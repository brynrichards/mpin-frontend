/*
   Certivox JavaScript M-Pin Authentication Functions

   Provides these functions:

   calculateMPinToken     This function is a wrapper around _calculateMPinToken 
                          in order to deal with hex encoded mpin_id values

   _calculateMPinToken    Calculates the MPin Token 

   randomX                Calculates a random 256 bit value

   addShares              Add two points on the curve that are originally in hex format

   pass1Request           Form the JSON request for pass one of the M-Pin protocol

   pass2Request           Form the JSON request for pass two of the M-Pin protocol

*/

mpinAuth = {};


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

/* Calculates a random 256 bit value
   
   This function generates a random 256 bit value called x that is used in 
   the protocol

   Args:
        
     seedValue_hex: A seed value for the random number generator

   Returns:

     x: 256 bit random number

*/
mpinAuth.randomX = function(seedValue_hex)
{
  console.log("seedValue_hex: "+seedValue_hex);
  var seedValue = util.bitsToBytes(util.hexToBitsNew(seedValue_hex));
  cjct.random.addEntropy(seedValue);
  var x=idak.getSecret();
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
  console.log("share1_hex: "+share1_hex);

  // Convert to ecc point
  var share2_str = util.hex2pointFormat(share2_hex);
  var share2 = new ecc.point.fromString(share2_str, idak._curve);
  console.log("share2_hex: "+share2_hex);

  // Add shares to form sum value
  var sum_str = share1.add(share2).toString();
  var sum_hex = util.pointFormat2hex(sum_str);  
  console.log("sum_hex: "+sum_hex);
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
  console.log("mpin_id: "+mpin_id);

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
  var hashTpID=idak._hashToPoint1(util.wordToBytes(util.today()).concat(hash_mpin_id)); 
  // var hashTpID=idak._hashToPoint1(util.wordToBytes(util.today()).concat(util.unicodeToBytes(mpin_id))); 

  // compute U
  var U=idak.computeMPin_1x(hashID,x);
  var U_hex=util.pointFormat2hex(U);
  console.log("U: "+U);
  console.log("U_hex: "+U_hex);

  // compute UT
  var UT=idak.computeMPin_1c(hashID,hashTpID,x);
  var UT_hex=util.pointFormat2hex(UT);
  console.log("UT: "+UT);
  console.log("UT_hex: "+UT_hex);

  var request = {
    mpin_id: mpin_id_hex,
    UT: UT_hex,
    U: U_hex,
    pass: 1
  }
  console.dir(request);

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
  console.log("mpin_id_hex: "+mpin_id_hex);
  console.log("y_hex: "+y_hex);
  // Get M-PIN ID
  var mpin_id = util.bytesToUnicode(util.bitsToBytes(util.hexToBitsNew(mpin_id_hex)));
  console.log("mpin_id: "+mpin_id);

  // Hash ID to point on curve
  var hashID=idak._hashToPoint1(util.unicodeToBytes(mpin_id)); 

  console.log("timePermit_hex: "+timePermit_hex);
  var timePermit = util.hex2pointFormat(timePermit_hex);

  console.log("token_hex: "+token_hex);
  var token = util.hex2pointFormat(token_hex);

  // Compute V
  var y=new bn(util.bitsToHex(util.hexToBitsNew(y_hex)));
  var r=idak._curve.r;
  var m = y.add(x).mod(r);
  m=r.sub(m).normalize();
  V=idak.computeMPin_1b(hashID, m, PIN, token, timePermit);
  var V_hex=util.pointFormat2hex(V);
  console.log("V: "+V);
  console.log("V_hex: "+V_hex);

  var request = {
    V: V_hex,
    OTP: requestOTP,
    WID: accessNumber,
    pass: 2
  }
  console.dir(request);

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
