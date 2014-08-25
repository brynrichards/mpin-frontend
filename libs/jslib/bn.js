/* 
 * Copyright 2009-2010 Emily Stark, Mike Hamburg, Dan Boneh.
 * All rights reserved.

 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.

 * THIS SOFTWARE IS PROVIDED BY THE AUTHORS ``AS IS'' AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
 * BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN
 * IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

 * The views and conclusions contained in the software and documentation
 * are those of the authors and should not be interpreted as representing
 * official policies, either expressed or implied, of the authors.
 */

/*
 * Constructs a new bignum from another bignum, a number or a hex string.
 */
bn = function(it) {
	this.initWith(it);
};

bn.prototype = {
	radix : 24,
	maxMul : 8,
	_class : bn,

	_b64codes : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",

	copy : function() {
		return new this._class(this);
	},

	/*
	 * Initializes this with it, either as a bn, a number, or a hex string.
	 */
	initWith : function(it) {
		var i = 0, k, n, l;
		var neg=false;
		switch (typeof it) {
		case "object":
			this.limbs = it.limbs.slice(0);
			break;

		case "number":
			this.limbs = [ it ];
			this.normalize();
			break;

		case "string":
			it = it.replace(/^0x/, '');
			if (it.charAt(0)=='-') {neg=true; it=it.slice(1);}
			this.limbs = [];
			// hack
			k = this.radix / 4;
			for (i = 0; i < it.length; i += k) {
				this.limbs.push(parseInt(it.substring(Math.max(it.length - i
						- k, 0), it.length - i), 16));
			}
			break;

		default:
			this.limbs = [ 0 ];
		}
		if (neg) 
		{
			for (i=0;i<this.limbs.length;i++) this.limbs[i]=-this.limbs[i];
			this.normalize();
		}
		return this;
	},

	/*
	 * Returns true if "this" and "that" are equal. Calls fullReduce(). Equality
	 * test is in constant time.
	 */
	equals : function(that) {
		if (typeof that === "number") {
			that = new this._class(that);
		}
		this.fix();
		that.fix();
		var difference = 0, i;

		for (i = 0; i < this.limbs.length || i < that.limbs.length; i++) {
			difference |= this.getLimb(i) ^ that.getLimb(i);
		}
		return (difference === 0);
	},

	/*
	 * Get the i'th limb of this, zero if i is too large.
	 */
	getLimb : function(i) {
		return (i >= this.limbs.length) ? 0 : this.limbs[i];
	},

	/*
	 * Constant time comparison function. Returns 1 if this >= that, or zero
	 * otherwise.
	 */
	greaterEquals : function(that) {
		if (typeof that === "number") {
			that = new this._class(that);
		}
		var less = 0, greater = 0, i, a, b;
		i = Math.max(this.limbs.length, that.limbs.length) - 1;
		for (; i >= 0; i--) {
			a = this.getLimb(i);
			b = that.getLimb(i);
			greater |= (b - a) & ~less;
			less |= (a - b) & ~greater;
		}
		return (greater | ~less) >>> 31;
	},

/* faster method - might insert some leading zeros, but who cares... */
/*
	toString : function() {
		var t=this.print();
	
		var out="";
		var i,s,l=t.limbs;

		var b1,b2,b3,c1,c2,c3,c4;
		for (i=t.limbs.length-1;i>=0;i--)
		{
			s=l[i];
			b1=s&0xFF;
			b2=(s>>8)&0xFF;
			b3=(s>>16)&0xFF;
			c1=b1&63;
			c2=((b2&15)<<2)|(b1>>6);
			c3=((b3&3)<<4)|(b2>>4);
			c4=b3>>2;

			out=out+this._b64codes.charAt(c4)+this._b64codes.charAt(c3)+this._b64codes.charAt(c2)+this._b64codes.charAt(c1);
		}
	
		return out;
	},
*/
	/*
	 * Convert to a hex string and then base64.
	 */

	toString : function() {
		var t = this.print();
		var out = "", i, s, l = t.limbs;
		for (i = 0; i < t.limbs.length; i++) {
			s = l[i].toString(16);
			while (i < t.limbs.length - 1 && s.length < 6) {
				s = "0" + s;
			}
			out = s + out;
		}
		if (out.length % 2 == 1) {
			out = "0x0" + out;	
		} else {
			out = "0x" + out;
		}
		var bits = util.hexToBits(out);
		return util.bitsToString(bits);
	},
	
    toHexString : function() {
//alert("In Hex Print");
    	var t = this.print();
        var out = "", i, s, l = t.limbs;
        for (i = 0; i < t.limbs.length; i++) {
                s = l[i].toString(16);
                while (i < t.limbs.length - 1 && s.length < 6) {
                        s = "0" + s;
                }
                out = s + out;
        }
        return "0x" + out;
    },
	
	toBytes : function() {
		var string = this.toString();
		var bits = util.stringToBits(string);
		return util.bitsToBytes(bits).reverse();
	},
	
	toMyPaddedBytes : function(max) {
		var bytes = this.toBytes();
		while (bytes.length<max) {
			bytes.push(0);
		}
		while (bytes.length>max)
		{
			bytes.pop();
		}
		return bytes.reverse();
	},

	toPaddedBytes : function(m) {
		var bytes = this.toBytes();
		var maximum = m.toBytes();
		while (bytes.length < maximum.length) {
			bytes.push(0);
		}
		return bytes.reverse();
	},
		
	toTruncatedBytes : function() {
		var bytes = this.toBytes();
		while (bytes[bytes.length - 1] == 0) {
			bytes.pop();
		}
		return bytes;
	},
	
	/* this += that. Does not normalize. */
	addM : function(that) {
		if (typeof (that) !== "object") {
			that = new this._class(that);
		}
		var i, l = this.limbs, ll = that.limbs;
		for (i = l.length; i < ll.length; i++) {
			l[i] = 0;
		}
		for (i = 0; i < ll.length; i++) {
			l[i] += ll[i];
		}
		return this;
	},

	pmulM : function(that) {
		var i,l=this.limbs;
		for (i=0;i<l.length;i++ )
		{
			l[i]*=that;
		}
		return this.normalize();
	},

	/* this *= 2. Requires normalized; ends up normalized. */
	doubleM : function() {
		var i, carry = 0, tmp, r = this.radix, m = this.radixMask, l = this.limbs;
		for (i = 0; i < l.length; i++) {
			tmp = l[i];
			tmp = tmp + tmp + carry;
			l[i] = tmp & m;
			carry = tmp >> r;
		}
		if (carry) {
			l.push(carry);
		}
		return this;
	},

	/* this /= 2, rounded down. Requires normalized; ends up normalized. */
	halveM : function() {
		var i, carry = 0, tmp, r = this.radix, l = this.limbs;
		for (i = l.length - 1; i >= 0; i--) {
			tmp = l[i];
			l[i] = (tmp + carry) >> 1;
			carry = (tmp & 1) << r;
		}
		if (!l[l.length - 1]) {
			l.pop();
		}
		return this;
	},

	/* this -= that. Does not normalize. */
	subM : function(that) {
		if (typeof (that) !== "object") {
			that = new this._class(that);
		}
		var i, l = this.limbs, ll = that.limbs;
		for (i = l.length; i < ll.length; i++) {
			l[i] = 0;
		}
		for (i = 0; i < ll.length; i++) {
			l[i] -= ll[i];
		}
		return this;
	},

	/* this * that. Normalizes and reduces. */
	mulM : function(that) {
		if (typeof (that) === "number") {
			that = new this._class(that);
		}
		this.cnormalize();
		that.cnormalize();

		var i, j, a = this.limbs, b = that.limbs, al = a.length, bl = b.length, out = new this._class(), c = out.limbs, ai, ii = this.maxMul;
		for (i = 0; i < al + bl; i++) {
			c[i] = 0;
		}
		cl = c.length;
		for (; i < c.length; i++) {
			c[i] = 0;
		}

		for (i = 0; i < al; i++) {
			ai = a[i];
			for (j = 0; j < bl; j++) {
				c[i + j] += ai * b[j];
			}

			if (!--ii) {
				ii = this.maxMul;
				out.cnormalize();
			}
		}
		return out.cnormalize();
	},
 
	/* this * this. Normalizes and reduces. */
	sqrM : function() {
		this.cnormalize();

		var i, ti, j, a = this.limbs, al = a.length, out = new this._class(), c = out.limbs, ai, ii = this.maxMul;
		for (i = 0; i < al + al; i++) {
			c[i] = 0;
		}
		cl = c.length;
		for (; i < c.length; i++) {
			c[i] = 0;
		}

		for (i = 0; i < al; i++) {
			ai = a[i];
			for (j = i+1; j < al; j++) {
				c[i + j] += ai * a[j];
			}

			if (!--ii) {
				ii = this.maxMul;
				out.cnormalize();
			}
		}
		out.cnormalize();
		for (i=0;i<al+al;i++) {
			c[i]+=c[i];
		}
		for (i=0;i<al;i++) {
			ti=i+i;
			c[ti]+=a[i]*a[i];
		}
		return out.cnormalize();
	},
	
	mod : function(that) {
		that = new bn(that).normalize(); // copy before we begin
		var out = new bn(this).normalize(), ci = 0;

		for (; out.greaterEquals(that); ci++) {
			that.doubleM();
		}
		for (; ci > 0; ci--) {
			that.halveM();
			if (out.greaterEquals(that)) {
				out.subM(that).normalize();
			}
		}
		return out.trim();
	},

	div : function(that) {
		that = new bn(that).normalize(); // copy before we begin
		var out = new bn(this).normalize(), ci = 0;
		var cmp = new bn(1);
		var quo = new bn(0);

		for (; out.greaterEquals(that); ci++) {
			cmp.doubleM(); 
			that.doubleM();
		}

		for (; ci > 0; ci--) {
			that.halveM();
			cmp.halveM();
			if (out.greaterEquals(that)) {
				quo.addM(cmp).normalize();
				out.subM(that).normalize();
			}
		}

		return quo;
	},

	/*
	 * return inverse mod prime p. p must be odd. Binary extended Euclidean
	 * algorithm mod p.
	 */
	inverseMod : function(p) {
		var a = new bn(1), b = new bn(0), x = new bn(this), y = new bn(p), tmp, i, nz = 1;

		if (!(p.limbs[0] & 1)) {
			throw (new cjct.error("invalid argument"));
		}

		// invariant: y is odd
		do {
			if (x.limbs[0] & 1) {
				if (!x.greaterEquals(y)) {
					// x < y; swap everything
					tmp = x;
					x = y;
					y = tmp;
					tmp = a;
					a = b;
					b = tmp;
				}
				x.subM(y);
				x.normalize();

				if (!a.greaterEquals(b)) {
					a.addM(p);
				}
				a.subM(b);
			}

			// cut everything in half
			x.halveM();
			if (a.limbs[0] & 1) {
				a.addM(p);
			}
			a.normalize();
			a.halveM();

			// check for termination: x ?= 0
			for (i = nz = 0; i < x.limbs.length; i++) {
				nz |= x.limbs[i];
			}
		} while (nz);

		if (!y.equals(1)) { 
			throw new cjct.error("invalid arguments");
		}
		
		return b;
	},

	negative: function() {
		this.normalize().trim();
		return (this.limbs[this.limbs.length-1]<0);
	},

	/* returns a negated copy. */
	neg : function() {
		return new this._class(0).sub(this);
	},

	/* this + that. Does not normalize. */
	add : function(that) {
		return this.copy().addM(that);
	},
	
	dbl : function() {
		return this.copy().doubleM();
	},
	
	hlv : function() {
		return this.copy().halveM();
	},

	/* this - that. Does not normalize. */
	sub : function(that) {
		return this.copy().subM(that);
	},

	/* this*integer, normalised */
	pmul : function(that) {
		return this.copy().pmulM(that);
	},

	/* this * that. Normalizes and reduces. */
	mul : function(that) {
		return this.mulM(that).reduce();
	},
	
	/* this ^ 2. Normalizes and reduces. */
	square : function() {
		return this.sqrM().reduce();
	//	return this.mul(this);
	},
 
	/* this ^ n. Uses square-and-multiply. Normalizes and reduces. */
	power : function(l) {
		if (typeof (l) === "number") {
			l = [ l ];
		} else if (l.limbs !== undefined) {
			l = l.normalize().limbs;
		}
		var i, j, out = new this._class(1), pow = this;

		for (i = l.length - 1; i >= 0; i--) {
			for (j = bn.prototype.radix - 1; j >= 0; j--) {
				out = out.square();
				if (l[i] & (1 << j)) {
					out = out.mul(this);
				}
			}
		}
		
		return out;
	},

	recode : function(t,w,i) {
		var j,n,b=bn.prototype.radix;
		var r=0;

		for (j=w-1;j>=0;j--)
		{
			r+=r;
			n=i+j*t;
			r+=(this.limbs[Math.floor(n/b)]&(1<<(n%b)))>>(n%b);
		}

		return r;
	},

/* for Gallant-Lambert-Vanstone method. A positive exponent "this" mod r is broken into half-length u[0] and u[1] */

	glv : function(r,W,B) {
		var i,j,u,v;
		u=new Array(2);
		v=new Array(2);
		for (i=0;i<2;i++)
		{
			u[i]=new bn(0);
			v[i]=new bn();
			if (W[i].negative())
				v[i]=this.mul(W[i].neg()).div(r).neg().normalize();
			else
				v[i]=this.mul(W[i]).div(r);
		}
		u[0]=this;

		for (i=0;i<2;i++)
		{
			for (j=0;j<2;j++)
				u[i]=u[i].sub(v[j].mul(B[j][i]));
			u[i].normalize().trim();
		}

		return u;
	},

/* for Galbraith-Scott method. A positive exponent "this" mod r is broken into quarter-length u[0], u[1], u[2] and u[3] */

	gs: function(r,W,B) {
		var i,j,u,v,g;
		u=new Array(4);
		v=new Array(4);
		for (i=0;i<4;i++)
		{
			u[i]=new bn(0);
			v[i]=new bn();
			if (W[i].negative())
				v[i]=this.mul(W[i].neg()).div(r).neg().normalize();
			else
				v[i]=this.mul(W[i]).div(r);
		}
		u[0]=this;
		for (i=0;i<4;i++)
		{
			for (j=0;j<4;j++)
				u[i]=u[i].sub(v[j].mul(B[j][i]));
			u[i].normalize().trim();
		}
		return u;
	},

	trim : function() {
		var l = this.limbs, p;
		do {
			p = l.pop();
		} while (l.length && p === 0);
		l.push(p);
		return this;
	},

	/* Reduce mod a modulus. Stubbed for subclassing. */
	reduce : function() {
		return this.normalize();
	},

	print: function() {
		return this.normalize();
	},

	/* Reduce and normalize. Stubbed for subclassing. */
	fix : function() {
		return this.normalize();
	},
	
	/* Return an integer suitable for printing. Stubbed for subclassing. */
	print : function() {
		return this.normalize();
	},

	/* Propagate carries. */
	normalize : function() {
		var carry = 0, i, pv = this.placeVal, ipv = this.ipv, l, m, limbs = this.limbs, ll = limbs.length, mask = this.radixMask;
		for (i = 0; i < ll || (carry !== 0 && carry !== -1); i++) {
			l = (limbs[i] || 0) + carry;
			m = limbs[i] = l & mask;
			carry = (l - m) * ipv;
		}
		if (carry === -1) {
			limbs[i - 1] -= this.placeVal;
		}
		return this;
	},

	/* Constant-time normalize. Does not allocate additional space. */
	cnormalize : function() {
		var carry = 0, i, ipv = this.ipv, l, m, limbs = this.limbs, ll = limbs.length, mask = this.radixMask;
		for (i = 0; i < ll - 1; i++) {
			l = limbs[i] + carry;
			m = limbs[i] = l & mask;
			carry = (l - m) * ipv;
		}
		limbs[i] += carry;
		return this;
	},
};

bn.fromBits = function(bits) {
	var Class = this, out = new Class(), words = [], w = bitArray, t = this.prototype, l = Math
			.min(this.bitLength || 0x100000000, w.bitLength(bits)), e = l
			% t.radix || t.radix;

	words[0] = w.extract(bits, 0, e);
	for (; e < l; e += t.radix) {
		words.unshift(w.extract(bits, e, t.radix));
	}

	out.limbs = words;
	return out;
};

bn.prototype.ipv = 1 / (bn.prototype.placeVal = Math.pow(2, bn.prototype.radix));
bn.prototype.radixMask = (1 << bn.prototype.radix) - 1;

/*
 * Creates a new subclass of bn, based on reduction modulo a pseudo-Mersenne
 * prime, i.e. a prime of the form 2^e + sum(a * 2^b),where the sum is negative
 * and sparse.
 */
bn.sparsePrime = function(exponent, coeff) {
	function p(it) {
		this.initWith(it);
		this.fix();
	}

	var ppr = p.prototype = new bn(), i, tmp, mo;
	mo = ppr.modOffset = Math.ceil(tmp = exponent / ppr.radix);
	ppr.exponent = exponent;
	ppr.offset = [];
	ppr.factor = [];
	ppr.minOffset = mo;
	ppr.fullMask = 0;
	ppr.fullOffset = [];
	ppr.fullFactor = [];
	ppr.modulus = p.modulus = new bn(Math.pow(2, exponent));

	ppr.fullMask = 0 | -Math.pow(2, exponent % ppr.radix);

	for (i = 0; i < coeff.length; i++) {
		ppr.offset[i] = Math.floor(coeff[i][0] / ppr.radix - tmp);
		ppr.fullOffset[i] = Math.ceil(coeff[i][0] / ppr.radix - tmp);
		ppr.factor[i] = coeff[i][1]
				* Math.pow(1 / 2, exponent - coeff[i][0] + ppr.offset[i]
						* ppr.radix);
		ppr.fullFactor[i] = coeff[i][1]
				* Math.pow(1 / 2, exponent - coeff[i][0] + ppr.fullOffset[i]
						* ppr.radix);
		ppr.modulus.addM(new bn(Math.pow(2, coeff[i][0]) * coeff[i][1]));
		ppr.minOffset = Math.min(ppr.minOffset, -ppr.offset[i]); // conservative
	}
	ppr._class = p;
	ppr.modulus.cnormalize();

	/*
	 * Approximate reduction mod p. May leave a number which is negative or
	 * slightly larger than p.
	 */
	ppr.reduce = function() {
		var i, k, l, mo = this.modOffset, limbs = this.limbs, aff, off = this.offset, ol = this.offset.length, fac = this.factor, ll;

		i = this.minOffset;
		while (limbs.length > mo) {
			l = limbs.pop();
			ll = limbs.length;
			for (k = 0; k < ol; k++) {
				limbs[ll + off[k]] -= fac[k] * l;
			}

			i--;
			if (!i) {
				limbs.push(0);
				this.cnormalize();
				i = this.minOffset;
			}
		}
		this.cnormalize();

		return this;
	};

	ppr._strongReduce = (ppr.fullMask === -1) ? ppr.reduce : function() {
		var limbs = this.limbs, i = limbs.length - 1, k, l;
		this.reduce();
		if (i === this.modOffset - 1) {
			l = limbs[i] & this.fullMask;
			limbs[i] -= l;
			for (k = 0; k < this.fullOffset.length; k++) {
				limbs[i + this.fullOffset[k]] -= this.fullFactor[k] * l;
			}
			this.normalize();
		}
	};

	/* mostly constant-time, very expensive full reduction. */
	ppr.fix = function() {
		var greater, i;
		// massively above the modulus, may be negative

		this._strongReduce();
		// less than twice the modulus, may be negative

		this.addM(this.modulus);
		this.addM(this.modulus);
		this.normalize();
		// probably 2-3x the modulus

		this._strongReduce();
		// less than the power of 2. still may be more than
		// the modulus

		// HACK: pad out to this length
		for (i = this.limbs.length; i < this.modOffset; i++) {
			this.limbs[i] = 0;
		}

		// constant-time subtract modulus
		greater = this.greaterEquals(this.modulus);
		for (i = 0; i < this.limbs.length; i++) {
			this.limbs[i] -= this.modulus.limbs[i] * greater;
		}
		this.cnormalize();

		return this;
	};
	
	ppr.print = function() {
		return this.fix(); 
	};

	ppr.inverse = function() {
	//	return (this.power(this.modulus.sub(2)));  // alternative method
		return this.inverseMod(this.modulus);
	};

	ppr.sqrt = function() {
		return this.power(this.modulus.add(1).hlv().hlv());
	};

	p.fromBits = bn.fromBits;

	return p;
};

bn.densePrime = function(modulus, digit) {
	function p(it) {
		var m = new bn(modulus), sm = m.limbs.length;
		var t = new bn(it);
/* tricky stuff here. Only strings and numbers are converted to Montgomery format */		
		if (typeof it == "number" && it !== 0 || typeof it == "string") {
			t.limbs = (new Array(sm)).concat(t.limbs);
			for (var i = 0; i < sm; i++) {
				t.limbs[i] = 0;
			}
			t = t.mod(m);
		}
		
		while (!t.greaterEquals(0)) {
			t.addM(m);
		}
		while (t.greaterEquals(m)) {
			t.subM(m);
		}
		t.cnormalize();
		this.limbs = t.limbs.slice(0);
	}

	var ppr = p.prototype = new bn();
	ppr.modulus = p.modulus = new bn(modulus);
	ppr.digit = p.digit = (new bn(digit)).limbs[0];
	ppr._class = p;
	ppr.modulus.cnormalize();

	ppr.reduce = function() {
		this.cnormalize();
		var t = this.limbs, m = this.modulus.limbs, sm = m.length;

		var ll,mm,carry,mask=bn.prototype.radixMask;
		var ipv=bn.prototype.ipv;
		var maxMul=bn.prototype.maxMul-2;
		var ii=maxMul;

                for (var i=t.length;i<2*sm;i++) t[i]=0;   // new line entered to initialise t[] array
		for (var i = 0; i < sm; i++) {
			var r = ((t[i]&mask) * this.digit) & mask;
			for (var j = 0; j < sm; j++) {
				t[i + j] += m[j] * r;
			}       

			ii--;
			if (!ii)
			{
				this.normalize();
				ii=maxMul;
			}
			else
			{	
				ll=t[i];
				mm=t[i]=ll&mask;
				carry=(ll-mm)*ipv;
				t[i+1]+=carry;
			}
		}
		this.normalize();

		this.limbs = new Array(sm);
		for (var i = 0; i < sm; i++) {
			this.limbs[i] = 0;
		}		
		for (var i = 0; i < (t.length - sm); i++) {
			this.limbs[i] = t[i + sm];
		}

		while (this.greaterEquals(this.modulus)) {
			this.subM(this.modulus);
			this.cnormalize();
		}

		return this.copy();
	};
	
	ppr.fix = function() {

		while (!this.greaterEquals(new bn(0))) {
			this.addM(this.modulus);
		}
		while (this.greaterEquals(this.modulus)) {
			this.subM(this.modulus);
		}
		return this.cnormalize();
	};

	ppr.print = function() {
//alert("in dense redc");
		while (this.greaterEquals(this.modulus)) {
			this.subM(this.modulus);
		}
		this.normalize().trim();

		var u = this.copy();
		var t = this.copy();
		t.limbs = new Array(2 * this.modulus.limbs.length + 1);
		for (var i = 0; i < this.limbs.length; i++) {
			t.limbs[i] = this.limbs[i];
		}
		for (var i = this.limbs.length; i < t.limbs.length; i++) {
			t.limbs[i] = 0;
		}
		t = t.reduce();
		for (var i = 0; i < this.modulus.limbs.length; i++) {
			u.limbs[i] = t.limbs[i];
		}
		return u.trim();
	};

    ppr.inverse = function() {
 //          var t=this.power(this.modulus.sub(2));
 //          return t.copy();  // alternative method
         
        var t=this.copy();
        t=t.print();   // redc
        t=t.inverseMod(this.modulus).normalize().trim();

 //      Now nres() the result

        var m = new bn(this.modulus), sm = m.limbs.length;
         
        t.limbs = (new Array(sm)).concat(t.limbs);
        for (var i = 0; i < sm; i++) {
                t.limbs[i] = 0;
        }
        t = t.mod(m);
                 
        while (!t.greaterEquals(0)) {
                t.addM(m);
        }
        while (t.greaterEquals(m)) {
                t.subM(m);
        }
        t.normalize();
         
        t._class=p;  // make it the right sub-class

        for (var i=t.limbs.length;i<this.modulus.limbs.length;i++ )
                t.limbs[i]=0;

        return t; 
 };

/*
	ppr.inverse = function() {
	//	return (this.power(this.modulus.sub(2)));  // alternative method
//alert("In dense inverse");	

		var t=this.print();   // redc

		t=t.inverseMod(this.modulus).normalize().trim();

	//	Now nres() the result

		var m = new bn(this.modulus), sm = m.limbs.length;

		t.limbs = (new Array(sm)).concat(t.limbs);
		for (var i = 0; i < sm; i++) {
			t.limbs[i] = 0;
		}
		t = t.mod(m);
		
		while (!t.greaterEquals(0)) {
			t.addM(m);
		}
		while (t.greaterEquals(m)) {
			t.subM(m);
		}

		t.cnormalize();

		for (var i = 0; i < this.modulus.limbs.length; i++) {
			this.limbs[i] = t.limbs[i];
		}
		alert("1. this= "+this.limbs);

		this.cnormalize();
	//	this=this.normalize().trim();
		alert("2. this= "+this.limbs);
	//			this._class=p;  // make it the right sub-class

		return this;

	};
*/
	ppr.sqrt = function() {
		return this.power(this.modulus.add(1).hlv().hlv());
	};

	return p;
};

// a small Mersenne prime
bn.prime = {
	p127 : bn.sparsePrime(127, [ [ 0, -1 ] ]),

	// Bernstein's prime for Curve25519
	p25519 : bn.sparsePrime(255, [ [ 0, -19 ] ]),

	// NIST primes
	p192 : bn.sparsePrime(192, [ [ 0, -1 ], [ 64, -1 ] ]),
	p224 : bn.sparsePrime(224, [ [ 0, 1 ], [ 96, -1 ] ]),
	p256 : bn.sparsePrime(256, [ [ 0, -1 ], [ 96, 1 ], [ 192, 1 ], [ 224, -1 ] ]),
	p384 : bn.sparsePrime(384, [ [ 0, -1 ], [ 32, 1 ], [ 96, -1 ], [ 128, -1 ] ]),
	p521 : bn.sparsePrime(521, [ [ 0, -1 ] ]),
	p254 : bn.densePrime("0x2400000008702A0DB0BDDF647A6366D3243FD6EE18093EE1BE6623EF5C1B55B3", "0x789E85")  /* prime p and base-1/p[0] mod base */
//	p254 : bn.densePrime("0x2523648240000001ba344d80000000086121000000000013a700000000000013", "0x9435e5")
};

bn.random = function(modulus, paranoia) {
	if (typeof modulus !== "object") {
		modulus = new bn(modulus);
	}
	var words, i, l = modulus.limbs.length, m = modulus.limbs[l - 1] + 1, out = new bn();
	while (true) {
		// get a sequence whose first digits make sense
		do {
			words = random.randomWords(l, paranoia);
			if (words[l - 1] < 0) {
				words[l - 1] += 0x100000000;
			}
		} while (Math.floor(words[l - 1] / m) === Math.floor(0x100000000 / m));
		words[l - 1] %= m;

		// mask off all the limbs
		for (i = 0; i < l - 1; i++) {
			words[i] &= modulus.radixMask;
		}

		// check the rest of the digits
		out.limbs = words;
		if (!out.greaterEquals(modulus)) {
			return out;
		}
	}
};


