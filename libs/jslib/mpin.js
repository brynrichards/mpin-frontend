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
 * Certivox JavaScript Cryptography Toolkit
 * 
 * Author: Diego F. Aranha
 */

/* Top-level namespace. */
var cjct = {
	/* Symmetric ciphers. */
	/* cipher: gcm, */

	/* Hash function. */
	hash : sha256,
	
	/* Unit tests/benchmarks. */
	/*tester : tester, bencher : bencher,*/
	
	/* Multi-precision arithmetic. */
	bn : bn,
	
	/* Elliptic curve arithmetic. */
	ecc : ecc,
	
	/* Protocols. */
	idak : idak, 

	/* Utilities. */
	util : util,
	
	/* Exceptions. */
    error: function(message) {
        this.toString = function() { return "ERROR: " + this.message; };
        this.message = message;
    },
};
