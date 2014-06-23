/*
 * AES module. Low-level AES code base on public-domain implementation
 * contained in the discontinued jsCrypto library by Emily Stark, Mike Hamburg
 * and Dan Boneh, which in turn is based on code from Vincent Rijment, 
 * Antoon Bosselaers and Paulo Barreto.
 * 
 * Author: Diego F. Aranha
 */

/* 
 * AES constructor, takes as arguments a 4/6/8 32-bit words and the tag length
 * for computed authenticators.
 */
aes = function(key, tagLength) {
	/* Round constants needed by AES. */
	this._RCON = [ [0x00, 0x00, 0x00, 0x00], [0x01, 0x00, 0x00, 0x00],
	               [0x02, 0x00, 0x00, 0x00], [0x04, 0x00, 0x00, 0x00],
	               [0x08, 0x00, 0x00, 0x00], [0x10, 0x00, 0x00, 0x00],
	               [0x20, 0x00, 0x00, 0x00], [0x40, 0x00, 0x00, 0x00],
	               [0x80, 0x00, 0x00, 0x00], [0x1b, 0x00, 0x00, 0x00],
	               [0x36, 0x00, 0x00, 0x00] ];

	/* Check if key satisfies the 128/192/256-bit length required by AES. */
	var length = key.length;
	if (length != 4 && length != 6 && length != 8) {
		throw new cjct.error("invalid key length");
	}
	
	this._key = key;
	this._rounds = 6 + this._key.length;
	
	/* Initialize tables. */
	this._SBOX = [];
	this._T = new Array(4);
	this._Tin = new Array(4);
	for (var i=0; i < 4; i++) {
		this._T[i] = [];
		this._Tin[i] = [];
	}
	
	/* Perform precomputation. */
	this._precompute();	
	this._schedule();
};
	
aes.prototype = {

	encrypt: function(block, ciphertext) {
		if (block.length != 4) {
			throw new cjct.error("invalid block size");
		}

		/* Recover key schedule */
		var w = this._w;
		
		/* Load round transformation tables. */
		var te0, te1, te2, te3;
		te0 = this._T[0]; te1 = this._T[1];
		te2 = this._T[2]; te3 = this._T[3];

		/* Perform rounds. */
		var rk = w[0];
		var s0 = block[0] ^ rk[0]; var s1 = block[1] ^ rk[1];
		var s2 = block[2] ^ rk[2]; var s3 = block[3] ^ rk[3];
		var t0, t1, t2, t3;
		rk = w[1];
		var order = [];
		var nr = w.length - 1;
		for (var round = 1; round < nr; round++) {
			order = [s1, s2, s3, s0];
			t0 = te0[(s0>>>24)] ^ te1[(order[0]>>>16) & 0xff]^ te2[(s2>>>8)&0xff] ^ te3[order[2]&0xff] ^ rk[0];
			t1 = te0[(s1>>>24)] ^ te1[(order[1]>>>16) & 0xff]^ te2[(s3>>>8)&0xff] ^ te3[order[3]&0xff] ^ rk[1];
			t2 = te0[(s2>>>24)] ^ te1[(order[2]>>>16) & 0xff]^ te2[(s0>>>8)&0xff] ^ te3[order[0]&0xff] ^ rk[2];
			t3 = te0[(s3>>>24)] ^ te1[(order[3]>>>16) & 0xff]^ te2[(s1>>>8)&0xff] ^ te3[order[1]&0xff] ^ rk[3];
			s0 = t0; s1 = t1; s2 = t2; s3 = t3; rk = w[round+1];
		}
		s0 = (te2[t0>>>24]&0xff000000) ^ (te3[(t1>>>16)&0xff]&0x00ff0000) ^ (te0[(t2>>>8)&0xff]&0x0000ff00) ^ (te1[(t3)&0xff]&0x000000ff) ^ rk[0];
		s1 = (te2[t1>>>24]&0xff000000) ^ (te3[(t2>>>16)&0xff]&0x00ff0000) ^ (te0[(t3>>>8)&0xff]&0x0000ff00) ^ (te1[(t0)&0xff]&0x000000ff) ^ rk[1];
		s2 = (te2[t2>>>24]&0xff000000) ^ (te3[(t3>>>16)&0xff]&0x00ff0000) ^ (te0[(t0>>>8)&0xff]&0x0000ff00) ^ (te1[(t1)&0xff]&0x000000ff) ^ rk[2];
		s3 = (te2[t3>>>24]&0xff000000) ^ (te3[(t0>>>16)&0xff]&0x00ff0000) ^ (te0[(t1>>>8)&0xff]&0x0000ff00) ^ (te1[(t2)&0xff]&0x000000ff) ^ rk[3];

		ciphertext[0] = s0; ciphertext[1] = s1;
		ciphertext[2] = s2; ciphertext[3] = s3;
	},
		
	/* Precompute constants. */
	_precompute: function() {
		var x,xi,sx,tx,tisx,i;
		var d=[];

		/* compute double table */
		for (x=0;x<256;x++) {
			d[x]= x&128 ? x<<1 ^ 0x11b : x<<1;
			d[x] = x<<1 ^ (x>>7)*0x11b; //but I think that's less clear.
		}

		/* Compute the round tables. */
		for(x=xi=0;;) {
			sx = xi^ xi<<1 ^ xi<<2 ^ xi<<3 ^ xi<<4;
			sx = sx>>8 ^ sx&0xFF ^ 0x63;

			var dsx = d[sx], x2=d[x],x4=d[x2],x8=d[x4];

			/* te(x) = rotations of (2,1,1,3) * sx */
			tx = dsx<<24 ^ sx<<16 ^ sx<<8 ^ sx^dsx;

			/* Similarly, td(sx) = (E,9,D,B) * x. */
			tisx = (x8 ^ x4 ^ x2) << 24 ^ (x8 ^ x) << 16 ^ (x8 ^ x4 ^ x) << 8 ^ (x8 ^ x2 ^ x);

			for (i=0;i<4;i++) {
				this._T[i][x]  = tx;
				this._Tin[i][sx] = tisx;
				tx   =   tx<<24 | tx>>>8;
				tisx = tisx<<24 | tisx>>>8;
			}
			this._SBOX[ x] = sx;
	    
			if (x==5) {
				break;
			} else if (x) {
				x   = x2^d[d[d[x8^x2]]]; // x  *= 82 = 0b1010010
				xi ^= d[d[xi]];          // xi *= 5  = 0b101
			} else {
				x = xi = 1;
			}
		}

		/* We computed the arrays out of order.  On Firefox, this matters.
		/* Compact them. */
		for (i=0; i<4; i++) {
			this._T[i] = this._T[i].slice(0);
			this._Tin[i] = this._Tin[i].slice(0);
		}
		this._SBOX = this._SBOX.slice(0);
	},
		
	/* Computes key schedule for encryption. */
	_schedule: function() {
		this._w = [];
		var key = this._key;
		var klen = key.length;
		var j = 0;
		
		var w = [];
		var s = this._SBOX;
		for ( var i = 0; i < klen; i++) {
			w[i] = key[i];
		}
		
		for (var i=klen; i < 4*(this._rounds+1); i++) {
			var temp = w[i-1];
			if (i % klen == 0) {
				temp = s[temp >>> 16 & 0xff] << 24 ^
				s[temp >>> 8 & 0xff] << 16 ^
				s[temp & 0xff] << 8 ^
				s[temp >>> 24] ^ this._RCON[j+1][0] << 24;
				j++;
			} else {
				if (klen == 8 && i % klen == 4) {
					temp = s[temp >>> 24] << 24 ^
					s[temp >>> 16 & 0xff] << 16 ^
					s[temp >>> 8 & 0xff] << 8 ^
					s[temp & 0xff];
				}
			}
			w[i] = w[i-klen] ^ temp;
		}
		
		var wlen = w.length/4;
		for (var i=0; i < wlen; i++) {
			this._w[i] = [];
			this._w[i][0] = w[i*4];
			this._w[i][1] = w[i*4+1];
			this._w[i][2] = w[i*4+2];
			this._w[i][3] = w[i*4+3];
		}
	},
};
