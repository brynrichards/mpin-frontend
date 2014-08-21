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
