/*
   Certivox JavaScript M-Pin Authentication Functions

   Provides these functions:

   calculateMPinToken     This function is a wrapper around _calculateMPinToken 
                          in order to deal with hex encoded mpin_id values

   _calculateMPinToken    Calculates the MPin Token 

   _local_entropy         Gets an entropy value from the client machine

   randomX                Calculates a random 254 bit value

   addShares              Add two points on the curve that are originally in hex format

   pass1Request           Form the JSON request for pass one of the M-Pin protocol

   pass2Request           Form the JSON request for pass two of the M-Pin protocol

*/

mpinAuth = {};

// Default value for input for RandomX function
mpinAuth.hash_val = "";

// Default value for debug output
mpinAuth.DEBUG = false;

/* Calculates the MPin Token
   
   This function is a wrapper around _calculateMPinToken 
   in order to deal with hex encoded mpin_id values

   Args:
        
     PIN: Four digit PIN 
     clientSecret_hex: Hex encoded client secret
     mpin_id_hex: Hex encoded M-Pin ID

   Returns:

     mpin_token_hex: Hex encoded M-Pin Token

*/
mpinAuth.calculateMPinToken = function(PIN, clientSecret_hex, mpin_id_hex)
{
  var mpin_id = util.bytesToUnicode(util.bitsToBytes(util.hexToBitsNew(mpin_id_hex)));
  var mpin_token_hex = mpinAuth._calculateMPinToken(PIN, clientSecret_hex, mpin_id);
  return mpin_token_hex;
};

/* Calculates the MPin Token 
   
   This function maps the mpin_id to a point on the curve, multiplies this 
   value by PIN and then subtracts it from the clientSecret curve point to 
   return the M-Pin token.

   Args:
        
     PIN: Four digit PIN 
     clientSecret_hex: Hex encoded client secret
     mpin_id: M-Pin ID in unicode

   Returns:

     mpin_token_hex: Hex encoded M-Pin Token

*/
mpinAuth._calculateMPinToken = function(PIN, clientSecret_hex, mpin_id)
{
  var clientSecretStr = util.hex2pointFormat(clientSecret_hex);
  var clientSecret = new ecc.point.fromString(clientSecretStr, idak._curve);
  var point = idak._hashToPoint1(util.unicodeToBytes(mpin_id));
  var mpin_token = clientSecret.sub(point.smul(parseInt(PIN,10))).toString();
  var mpin_token_hex = util.pointFormat2hex(mpin_token);
  return mpin_token_hex;
};

/* Get local entropy
   
   This function makes a call to /dev/urandom for a 256 bit value

   Args:
        
     NA

   Returns:

     entropy_val: 256 bit random value or null

*/
mpinAuth._local_entropy = function()
{
  if( typeof(window) === 'undefined')
    {
      if (DEBUG){console.log("Test mode without browser")}
      return null;
    }

  crypto = (window.crypto || window.msCrypto);
  if( typeof(crypto) !== 'undefined')
    {
      var array = new Uint32Array(8);
      crypto.getRandomValues(array);
  
      var entropy_val = "";
      for (var i = 0; i < array.length; i++) {
         hex_val = array[i].toString(16)
         if (hex_val.length == 6){
           hex_val = "00" + hex_val;
         }
         if (hex_val.length == 7){
           hex_val = "0" + hex_val;
         }
         entropy_val = entropy_val + hex_val
      }
      if (DEBUG){console.log("len(entropy_val): " + entropy_val.length + " entropy_val: " + entropy_val);}
      return entropy_val;
    }
  else
    {
      return null;
    }
}

/* Calculates a random 254 bit value
   
   This function generates a random 254 bit value called x that is used in 
   the protocol

   Args:
        
     local_entropy_on: Turn on generation of local entropy

   Returns:

     x: 254 bit random number

*/
mpinAuth.randomX = function()
{
  var local_entropy_val = mpinAuth._local_entropy();
  if (DEBUG){console.log("start: local_entropy_val: " + local_entropy_val);}
  if (DEBUG){console.log("start: mpinAuth.hash_val: " + mpinAuth.hash_val);}
  // Assign last used hash_val to input for new hash value.
  // This will also be the rendered value from the server when
  // the page is reloaded.
  hash_input_hex = mpinAuth.hash_val + local_entropy_val;
  if (DEBUG){console.log("hash_input_hex: " + hash_input_hex);}
  var hash_input = util.bitsToBytes(util.hexToBitsNew(hash_input_hex));
  var hash_output = new sha256();
  for (var i = 0; i < hash_input.length; i++) 
    {
      hash_output.update_byte(hash_input[i]);
    }
  hash_output_bytes = util.wordsToBytes(hash_output.finalize());
  
  // Use output from hash to generate x 
  var hash_output_hex = util.bitsToHexNew(util.bytesToBits(hash_output_bytes));
  if (DEBUG){console.log("hash_output_hex " + hash_output_hex);}
  var hash_output_bn = new bn(hash_output_hex);
  var x = hash_output_bn.mod(idak._curve.r);
  var x_str = x.toHexString();
  if (DEBUG){console.log("random x " + x_str);}

  // Update the mpinAuth.hash_val with the output
  // from the hash function.
  mpinAuth.hash_val = hash_output_hex;
  if (DEBUG){console.log("end: mpinAuth.hash_val: " + mpinAuth.hash_val);}
  return x;
}

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
mpinAuth.addShares = function(share1_hex, share2_hex)
{
  // Convert to ecc point
  var share1_str = util.hex2pointFormat(share1_hex);
  var share1 = new ecc.point.fromString(share1_str, idak._curve);
  if (DEBUG){console.log("share1_hex: "+share1_hex);}

  // Convert to ecc point
  var share2_str = util.hex2pointFormat(share2_hex);
  var share2 = new ecc.point.fromString(share2_str, idak._curve);
  if (DEBUG){console.log("share2_hex: "+share2_hex);}

  // Add shares to form sum value
  var sum_str = share1.add(share2).toString();
  var sum_hex = util.pointFormat2hex(sum_str);  
  if (DEBUG){console.log("sum_hex: "+sum_hex);}
  return sum_hex;
}


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
mpinAuth.pass1Request = function(x, mpin_id_hex)
{
  // Get client ID
  var mpin_id = util.bytesToUnicode(util.bitsToBytes(util.hexToBitsNew(mpin_id_hex)));
  if (DEBUG){console.log("mpin_id: "+mpin_id);}

  // Get parameters for protocol
  var hashID=idak._hashToPoint1(util.unicodeToBytes(mpin_id)); 
  // kmc 29/5/2014 
  // TP = H1(DATE|hash(IDc))
  var mpin_id_bytes = util.unicodeToBytes(mpin_id);
  var hash_mpin_id = new sha256();
  for (var i = 0; i < mpin_id_bytes.length; i++) {
      hash_mpin_id.update_byte(mpin_id_bytes[i]);
  }
  hash_mpin_id = util.wordsToBytes(hash_mpin_id.finalize());
  var hash_mpin_id_hex = util.bitsToHexNew(util.bytesToBits(hash_mpin_id));
  if (DEBUG){console.log("mpinAuth.pass1Request hash_mpin_id_hex: "+hash_mpin_id_hex);}
  var hashTpID=idak._hashToPoint1(util.wordToBytes(util.today()).concat(hash_mpin_id)); 
  var hashTpID_hex=util.pointFormat2hex(hashTpID.toString());
  if (DEBUG){console.log("mpinAuth.pass1Request hashTpID_hex: "+hashTpID_hex);}
  // var hashTpID=idak._hashToPoint1(util.wordToBytes(util.today()).concat(util.unicodeToBytes(mpin_id))); 

  // compute U
  var U=idak.computeMPin_1x(hashID,x);
  var U_hex=util.pointFormat2hex(U);
  if (DEBUG){console.log("U: "+U);}
  if (DEBUG){console.log("U_hex: "+U_hex);}

  // compute UT
  var hashID_hex=util.pointFormat2hex(hashID.toString());
  var x_hex = x.toHexString();
  if (DEBUG){console.log("mpinAuth.pass1Request hashID: "+hashID_hex);}
  if (DEBUG){console.log("mpinAuth.pass1Request x_hex: "+x_hex);}
  var UT=idak.computeMPin_1c(hashID,hashTpID,x);
  var UT_hex=util.pointFormat2hex(UT);
  if (DEBUG){console.log("UT: "+UT);}
  if (DEBUG){console.log("UT_hex: "+UT_hex);}

  var request = {
    mpin_id: mpin_id_hex,
    UT: UT_hex,
    U: U_hex,
    pass: 1
  }
  if (DEBUG){console.dir(request);}

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
mpinAuth.pass2Request = function(x, y_hex, mpin_id_hex, timePermit_hex, token_hex, requestOTP, accessNumber, PIN)
{
  if (DEBUG){console.log("mpin_id_hex: "+mpin_id_hex);}
  if (DEBUG){console.log("y_hex: "+y_hex);}
  // Get M-PIN ID
  var mpin_id = util.bytesToUnicode(util.bitsToBytes(util.hexToBitsNew(mpin_id_hex)));
  if (DEBUG){console.log("mpin_id: "+mpin_id);}

  // Hash ID to point on curve
  var hashID=idak._hashToPoint1(util.unicodeToBytes(mpin_id)); 

  if (DEBUG){console.log("timePermit_hex: "+timePermit_hex);}
  var timePermit = util.hex2pointFormat(timePermit_hex);

  if (DEBUG){console.log("token_hex: "+token_hex);}
  var token = util.hex2pointFormat(token_hex);

  // Compute V
  var y=new bn(y_hex);
  var r=idak._curve.r;
  var m = y.add(x).mod(r);
  m=r.sub(m).normalize();
  V=idak.computeMPin_1b(hashID, m, PIN, token, timePermit);
  var V_hex=util.pointFormat2hex(V);
  if (DEBUG){console.log("V: "+V);}
  if (DEBUG){console.log("V_hex: "+V_hex);}

  var request = {
    V: V_hex,
    OTP: requestOTP,
    WID: accessNumber,
    pass: 2
  }
  if (DEBUG){console.dir(request);}

  return request;
};


/* Hash the M-PIN ID 
   
   Hash the M-PIN ID and then hex encode it.

   Args:
        
     mpin_id_hex: Hex encoded M-PIN ID

   Returns:

    hash_mpin_id_hex: Hex encoded hash of the M-PIN ID
*/
mpinAuth.sha256_hex = function(mpin_id_hex)
{
  // Get M-Pin ID
  var mpin_id = util.bytesToUnicode(util.bitsToBytes(util.hexToBitsNew(mpin_id_hex)));

  // Calulate hash
  var mpin_id_bytes = util.unicodeToBytes(mpin_id);
  var hash_mpin_id = new sha256();
  for (var i = 0; i < mpin_id_bytes.length; i++) {
      hash_mpin_id.update_byte(mpin_id_bytes[i]);
  }
  hash_mpin_id = util.wordsToBytes(hash_mpin_id.finalize());

  // Hex encode value
  var hash_mpin_id_hex = util.bitsToHexNew(util.bytesToBits(hash_mpin_id));
  return hash_mpin_id_hex;
}
