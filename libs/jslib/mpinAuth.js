/* 
Copyright 2014 CertiVox UK Ltd, All Rights Reserved.

The CertiVox M-Pin Client and Server Libraries are free software: you can
redistribute it and/or modify it under the terms of the BSD 3-Clause
License - http://opensource.org/licenses/BSD-3-Clause

For full details regarding our CertiVox terms of service please refer to
the following links:

  * Our Terms and Conditions -
    http://www.certivox.com/about-certivox/terms-and-conditions/
  
  * Our Security and Privacy -
    http://www.certivox.com/about-certivox/security-privacy/

  * Our Statement of Position and Our Promise on Software Patents -
    http://www.certivox.com/about-certivox/patents/
*/
/*
   Certivox JavaScript M-Pin Authentication Functions

   Provides these functions:

   calculateMPinToken     Calculates the MPin Token 

   local_entropy          Gets an entropy value from the client machine

   randomX                Calculates a random 254 bit value

   addShares              Add two points on the curve that are originally in hex format

   pass1Request           Form the JSON request for pass one of the M-Pin protocol

   pass2Request           Form the JSON request for pass two of the M-Pin protocol

*/

/* 

As _{} is used widely in this code run jslint with --nomen flag

jslint --nomen mpinAuth.js

or do this 

jslint nomen: true
client_secret_pt = new ecc.point.fromString(client_secret_str, idak._curve);
jslint nomen: false

*/


/*global util */
/*global ecc */
/*global idak */
/*global Uint32Array */
/*global sha256 */
/*global bn */
/*global mpinAuth */
/*jslint browser: true*/
/*jslint plusplus: true */

mpinAuth = {};

// Default value for input for RandomX function
mpinAuth.hash_val = "";

// Default value for debug output
mpinAuth.DEBUG = false;

/* Calculates the MPin Token 
   
   This function convert mpin_id _hex to unicode. It then maps the mpin_id 
   to a point on the curve, multiplies this value by PIN and then subtracts 
   it from the client_secret curve point to generate the M-Pin token.

   Args:
        
     PIN: Four digit PIN 
     client_secret_hex: Hex encoded client secret
     mpin_id_hex: Hex encoded M-Pin ID

   Returns:

     mpin_token_hex: Hex encoded M-Pin Token

*/
mpinAuth.calculateMPinToken = function (PIN, client_secret_hex, mpin_id_hex) {
    "use strict";
    var mpin_id, mpin_id_pt, mpin_token_str,  mpin_token_hex, client_secret_str, client_secret_pt;
    client_secret_str = util.hex2pointFormat(client_secret_hex);
    client_secret_pt = new ecc.point.fromString(client_secret_str, idak._curve);
    mpin_id = util.bytesToUnicode(util.bitsToBytes(util.hexToBitsNew(mpin_id_hex)));
    mpin_id_pt = idak._hashToPoint1(util.unicodeToBytes(mpin_id));
    mpin_token_str = client_secret_pt.sub(mpin_id_pt.smul(parseInt(PIN, 10))).toString();
    mpin_token_hex = util.pointFormat2hex(mpin_token_str);
    return mpin_token_hex;
};

/* Get local entropy
   
   This function makes a call to /dev/urandom for a 256 bit value

   Args:
        
     NA

   Returns:

     entropy_val: 256 bit random value or null

*/
mpinAuth.local_entropy = function () {
    "use strict";
    var crypto, array, entropy_val, i, hex_val;
    if (typeof (window) === 'undefined') {
        if (mpinAuth.DEBUG) {console.log("Test mode without browser"); }
        return null;
    }
    crypto = (window.crypto || window.msCrypto);
    if (crypto !== 'undefined') {
        array = new Uint32Array(8);
        crypto.getRandomValues(array);

        entropy_val = "";
        for (i = 0; i < array.length; i++) {
            hex_val = array[i].toString(16);
            if (hex_val.length === 6) {
                hex_val = "00" + hex_val;
            }
            if (hex_val.length === 7) {
                hex_val = "0" + hex_val;
            }
            entropy_val = entropy_val + hex_val;
        }
        if (mpinAuth.DEBUG) {console.log("len(entropy_val): " + entropy_val.length + " entropy_val: " + entropy_val); }
        return entropy_val;
    }
    return null;
};

/* Calculates a random 254 bit value
   
   This function generates a random 254 bit value called x that is used in 
   the protocol

   Args:
        
     local_entropy_on: Turn on generation of local entropy

   Returns:

     x: 254 bit random number

*/
mpinAuth.randomX = function () {
    "use strict";
    var local_entropy_val, hash_input_hex, hash_input, hash_output, hash_output_bytes, hash_output_hex, hash_output_bn, x, x_str, i;
    local_entropy_val = mpinAuth.local_entropy();
    if (mpinAuth.DEBUG) {console.log("start: local_entropy_val: " + local_entropy_val); }
    if (mpinAuth.DEBUG) {console.log("start: mpinAuth.hash_val: " + mpinAuth.hash_val); }
    // Assign last used hash_val to input for new hash value.
    // This will also be the rendered value from the server when
    // the page is reloaded.
    hash_input_hex = mpinAuth.hash_val + local_entropy_val;
    if (mpinAuth.DEBUG) {console.log("hash_input_hex: " + hash_input_hex); }
    hash_input = util.bitsToBytes(util.hexToBitsNew(hash_input_hex));
    hash_output = new sha256();
    for (i = 0; i < hash_input.length; i++) {
        hash_output.update_byte(hash_input[i]);
    }
    hash_output_bytes = util.wordsToBytes(hash_output.finalize());

    // Use output from hash to generate x 
    hash_output_hex = util.bitsToHexNew(util.bytesToBits(hash_output_bytes));
    if (mpinAuth.DEBUG) {console.log("hash_output_hex " + hash_output_hex); }
    hash_output_bn = new bn(hash_output_hex);
    x = hash_output_bn.mod(idak._curve.r);
    x_str = x.toHexString();
    if (mpinAuth.DEBUG) {console.log("random x " + x_str); }

    // Update the mpinAuth.hash_val with the output
    // from the hash function.
    mpinAuth.hash_val = hash_output_hex;
    if (mpinAuth.DEBUG) {console.log("end: mpinAuth.hash_val: " + mpinAuth.hash_val); }
    return x;
};

/* Add two points on the curve that are originally in hex format
   
   This function is used to add client secret or time permits shares. 

   Args:
        
     share1_hex: Hex encoded point on the curve which represents 
                 a time permit or client secret share
     share2_hex: Hex encoded point on the curve which represents 
                 a time permit or client secret share

   Returns:

     sum_hex: Hex encoded sum of the shares

*/
mpinAuth.addShares = function (share1_hex, share2_hex) {
    "use strict";
    var share1_str, share1, share2_str, share2, sum_str, sum_hex;

    // Convert to ecc point
    share1_str = util.hex2pointFormat(share1_hex);
    share1 = new ecc.point.fromString(share1_str, idak._curve);
    if (mpinAuth.DEBUG) {console.log("share1_hex: " + share1_hex); }

    // Convert to ecc point
    share2_str = util.hex2pointFormat(share2_hex);
    share2 = new ecc.point.fromString(share2_str, idak._curve);
    if (mpinAuth.DEBUG) {console.log("share2_hex: " + share2_hex); }

    // Add shares to form sum value
    sum_str = share1.add(share2).toString();
    sum_hex = util.pointFormat2hex(sum_str);
    if (mpinAuth.DEBUG) {console.log("sum_hex: " + sum_hex); }
    return sum_hex;
};


/* Form the JSON request for pass one of the M-Pin protocol
   
   This function used the random value x and the mpin_id to calculate values to
   send to the server.

   Args:
        
     x: Random value
     mpin_id_hex: Hex encoded M-Pin ID

   Returns:

    {
      mpin_id: mpin_id_hex,
      UT: UT_hex,
      U: U_hex,
      pass: 1
    }

    where; 

    mpin_id: Hex encodes M-Pin ID
    UT: Hex encoded x( H1(IDc) + H1(DATE|hash(IDc)) )
    UT: Hex encoded x( H1(IDc) )
    pass: Protocol first pass

*/
mpinAuth.pass1Request = function (x, mpin_id_hex) {
    "use strict";
    var mpin_id, mpin_id_pt, mpin_id_bytes, mpin_id_pt_hex, x_hex, hash_mpin_id, hash_mpin_id_hex, date_mpin_id_pt, date_mpin_id_hex, U, U_hex, UT, UT_hex, request, i;

    // Get M-Pin ID in unicode
    mpin_id = util.bytesToUnicode(util.bitsToBytes(util.hexToBitsNew(mpin_id_hex)));
    if (mpinAuth.DEBUG) {console.log("mpin_id: " + mpin_id); }

    // Map M-Pin ID to Point on curve
    mpin_id_pt = idak._hashToPoint1(util.unicodeToBytes(mpin_id));

    // Calculate sha256 of M-Pin ID
    mpin_id_bytes = util.unicodeToBytes(mpin_id);
    hash_mpin_id = new sha256();
    for (i = 0; i < mpin_id_bytes.length; i++) {
        hash_mpin_id.update_byte(mpin_id_bytes[i]);
    }
    hash_mpin_id = util.wordsToBytes(hash_mpin_id.finalize());
    hash_mpin_id_hex = util.bitsToHexNew(util.bytesToBits(hash_mpin_id));
    if (mpinAuth.DEBUG) {console.log("mpinAuth.pass1Request hash_mpin_id_hex: " + hash_mpin_id_hex); }

    // Concatanate date with M-Pin ID and map to point on curve
    date_mpin_id_pt = idak._hashToPoint1(util.wordToBytes(util.today()).concat(hash_mpin_id));
    date_mpin_id_hex = util.pointFormat2hex(date_mpin_id_pt.toString());
    if (mpinAuth.DEBUG) {console.log("mpinAuth.pass1Request date_mpin_id_hex: " + date_mpin_id_hex); }

    // compute U
    U = idak.computeMPin_1x(mpin_id_pt, x);
    U_hex = util.pointFormat2hex(U);
    if (mpinAuth.DEBUG) {console.log("U: " + U); }
    if (mpinAuth.DEBUG) {console.log("U_hex: " + U_hex); }

    // compute UT
    mpin_id_pt_hex = util.pointFormat2hex(mpin_id_pt.toString());
    x_hex = x.toHexString();
    if (mpinAuth.DEBUG) {console.log("mpinAuth.pass1Request mpin_id_pt: " + mpin_id_pt_hex); }
    if (mpinAuth.DEBUG) {console.log("mpinAuth.pass1Request x_hex: " + x_hex); }
    UT = idak.computeMPin_1c(mpin_id_pt, date_mpin_id_pt, x);
    UT_hex = util.pointFormat2hex(UT);
    if (mpinAuth.DEBUG) {console.log("UT: " + UT); }
    if (mpinAuth.DEBUG) {console.log("UT_hex: " + UT_hex); }

    // Form request
    request = {
        mpin_id: mpin_id_hex,
        UT: UT_hex,
        U: U_hex,
        pass: 1
    };
    if (mpinAuth.DEBUG) {console.dir(request); }

    return request;
};


/* Form the JSON request for pass two of the M-Pin protocol
   
   This function used the random value x and the mpin_id to calculate values to
   send to the server.

   Args:
        
     x: Random value
     y_hex: Random value supplied by server
     mpin_id_hex: Hex encoded M-Pin ID
     timePermit_hex: Hex encoded Time Permit
     token_hex: Hex encoded M-Pin Token
     requestOTP: Request a one time password. This is different 
                 from the one time password that is the output from 
                 authentication.
     accessNumber: Web ID number required for mobile authentication
     PIN: PIN for authentication

   Returns:

    {
      V: V_hex,
      OTP: requestOTP,
      WID: accessNumber,
      pass: 2
    }

    where; 

    V: Value required by the server to authenticate user
    OTP: Request OTP: 1 = required
    WID: Number required for mobile authentication
    pass: Protocol second pass

*/
mpinAuth.pass2Request = function (x, y_hex, mpin_id_hex, timePermit_hex, token_hex, requestOTP, accessNumber, PIN) {
    "use strict";
    var mpin_id, mpin_id_pt, timePermit, token, y, r, m, V, V_hex, request;

    if (mpinAuth.DEBUG) {console.log("mpin_id_hex: " + mpin_id_hex); }
    if (mpinAuth.DEBUG) {console.log("y_hex: " + y_hex); }
    // Get M-PIN ID
    mpin_id = util.bytesToUnicode(util.bitsToBytes(util.hexToBitsNew(mpin_id_hex)));
    if (mpinAuth.DEBUG) {console.log("mpin_id: " + mpin_id); }

    // Hash ID to point on curve
    mpin_id_pt = idak._hashToPoint1(util.unicodeToBytes(mpin_id));

    if (mpinAuth.DEBUG) {console.log("timePermit_hex: " + timePermit_hex); }
    timePermit = util.hex2pointFormat(timePermit_hex);

    if (mpinAuth.DEBUG) {console.log("token_hex: " + token_hex); }
    token = util.hex2pointFormat(token_hex);

    // Compute V
    y = new bn(y_hex);
    r = idak._curve.r;
    m = y.add(x).mod(r);
    m = r.sub(m).normalize();
    V = idak.computeMPin_1b(mpin_id_pt, m, PIN, token, timePermit);
    V_hex = util.pointFormat2hex(V);
    if (mpinAuth.DEBUG) {console.log("V: " + V); }
    if (mpinAuth.DEBUG) {console.log("V_hex: " + V_hex); }

    // Form reuest
    request = {
        V: V_hex,
        OTP: requestOTP,
        WID: accessNumber,
        pass: 2
    };
    if (mpinAuth.DEBUG) {console.dir(request); }

    return request;
};


/* Hash the M-PIN ID 
   
   Hash the M-PIN ID and then hex encode it.

   Args:
        
     mpin_id_hex: Hex encoded M-PIN ID

   Returns:

    hash_mpin_id_hex: Hex encoded hash of the M-PIN ID
*/
mpinAuth.sha256_hex = function (mpin_id_hex) {
    "use strict";
    var mpin_id, mpin_id_bytes, hash_mpin_id, hash_mpin_id_hex, i;

    // Get M-Pin ID in unicode
    mpin_id = util.bytesToUnicode(util.bitsToBytes(util.hexToBitsNew(mpin_id_hex)));

    // Calulate sha256 value
    mpin_id_bytes = util.unicodeToBytes(mpin_id);
    hash_mpin_id = new sha256();
    for (i = 0; i < mpin_id_bytes.length; i++) {
        hash_mpin_id.update_byte(mpin_id_bytes[i]);
    }
    hash_mpin_id = util.wordsToBytes(hash_mpin_id.finalize());

    // Hex encode value
    hash_mpin_id_hex = util.bitsToHexNew(util.bytesToBits(hash_mpin_id));
    return hash_mpin_id_hex;
};
