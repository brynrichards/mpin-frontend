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

ecc = {};

/*
 * Represents a point on a curve in Jacobian coordinates. Coordinates can be
 * specified as bigInts or strings (which will be converted to bigInts).
 */
ecc.point = function(curve, x, y, z) {
	if (x === undefined) {
		this.isIdentity = true;
	} else {
		this.x = new curve.field(x);
		this.y = new curve.field(y);
		if (z === undefined) {
			this.z = new curve.field(1);
		} else {
			this.z = new curve.field(z);
		}
		this.isIdentity = false;
	}
	this.curve = curve;
};

ecc.point.prototype = {
	
	/*
	 * Precompute multiples.
	 */
	precompute : function() {
		var m, i, j;
		if (this.multiples === undefined) {
			j = this.dbl();
			m = this.multiples = [ new ecc.point(this.curve), this, j.toAffine() ];  /* O,P,2P... */
			for (i = 3; i < 11; i++) {     /* 11 is enough if using a NAF, otherwise 16 */
				j = j.add(this);
				m.push(j.toAffine());
			}
		}
	},

	/*
	 * Adds S and T and returns the result in Jacobian coordinates. Note that S
	 * must be in Jacobian coordinates and T must be in affine coordinates.
	 */
	add : function(T) {
		var S = this;
		if (S.curve !== T.curve) {
			throw new cjct.error("points must be on the same curve to add them!");
		}

		if (S.isIdentity) {
			return T;
		} else if (T.isIdentity) {
			return S;
		}
		
		var t0 = S.z.square();
		var t3 = new S.curve.field(T.x.mul(t0).sub(S.x));
		var t1 = new S.curve.field(t0.mul(S.z).mul(T.y).sub(S.y));

		if (t3.equals(0)) {
			if (t1.equals(0)) {
				// same point
				return S.dbl();		
			} else {
				// inverses
				return new ecc.point(S.curve);
			}
		}
		
		var t2 = t3.square();
		var t5 = t3.mul(t2);
		var t4 = S.x.mul(t2);
		
		x = new S.curve.field(t1.square().sub(t5).sub(t4).sub(t4));

		t4 = new S.curve.field(t4.sub(x)).mul(t1);
		y = new S.curve.field(t4.sub(S.y.mul(t5)));

		z = S.z.mul(t3);
		return new ecc.point(this.curve, x, y, z);
	},

	neg : function() {
		if (this.isIdentity) {
			return this;
		}
		return new ecc.point(this.curve, this.x, this.y.neg(), this.z);
	},
	
	sub : function(that) {
		if (this.isIdentity) {
			return that.neg();
		}
		return this.add(that.neg());
	},
	
	/*
	 * Doubles this point.
	 */
	dbl : function() {
		if (this.isIdentity) {
			return this;
		}
		
		if (this.curve.a.equals(0)) {
			var t0 = this.x.square();
			var t1 = this.y.square();
			var t2 = t1.square();
			var t3 = this.z.square();
			var t4 = new this.curve.field(this.x.add(t1).square().sub(t0).sub(t2)).dbl();
			var t5 = t0.add(t0).add(t0);
			
			var x = new this.curve.field(t5.square().sub(t4).sub(t4)); 
			t4 = new this.curve.field(t4.sub(x));
			var y = new this.curve.field(t5.mul(t4).sub(t2.dbl().dbl().dbl()));
			var z = this.y.mul(this.z).dbl();
		} else {
			var t0 = this.z.square();
			var t1 = this.y.square();
			var t2 = this.x.mul(t1);
			var t3 = new this.curve.field(this.x.sub(t0)).mul(this.x.add(t0));
			t3 = t3.dbl().add(t3);
			t2 = t2.dbl().dbl();

			var x = new this.curve.field(t3.square().sub(t2.dbl()));
			var z = new this.curve.field(this.y.add(this.z).square().sub(t1).sub(t0));
			var y = new this.curve.field(t2.sub(x).mul(t3).sub(t1.square().dbl().dbl().dbl()));
		}
		return new ecc.point(this.curve, x, y, z);
	},

	/*
	 * Returns a copy of this point converted to affine coordinates.
	 */
	toAffine : function() {
		if (this.isIdentity || this.z.equals(0) || this.z.undefined) {
			return new ecc.point(this.curve);
		}
		if (this.z.equals(1)) {
			return this;
		}
		var zi = this.z.inverse(), zi2 = zi.square();

		return new ecc.point(this.curve, this.x.mul(zi2), this.y.mul(zi2.mul(zi)));
	},
	

	/*
	 * Returns true if "this" and "that" are equal. Equality
	 * test is in constant time.
	 */
	equals : function(that) {
		var p = this.toAffine();
		var q = that.toAffine();

		if (p.isIdentity == true && q.isIdentity) {
			return true;
		}
		
		return p.x.equals(q.x) && p.y.equals(q.y);
	},
	
	toString : function() {
		var p = this.toAffine();
		return "[" + p.x.toString() + "," + p.y.toString() + "]";
	},
	
	/*
	 * Multiply this point by k and return the answer in Jacobian
	 * coordinates.
	 */

	 /* Modified by M.Scott 15/08/2012 to use a NAF */

/* really simple mul if you know l is very sparse or very short */

	smul : function(l) {
		var i,j,out=new ecc.point(this.curve);
		if (typeof (l) === "number") {
			l = [ l ];
		} else if (l.limbs !== undefined) {
			l = l.normalize().limbs;
		}
		for (i = l.length - 1; i >= 0; i--) { 
			for (j = bn.prototype.radix - 1; j >= 0; j--) {
				out = out.dbl();
				if (l[i] & (1 << j)) {
					out = out.add(this);
				}
			}
		}
		return out.toAffine();
	},

	mul : function(l,table) {
		var i, j, out = new ecc.point(this.curve);
		if (table===undefined )
		{
			var m,t,b,ptr,k;
			if (typeof (l) === "number") {
				m=3*l; m=Math.floor(m/2);
				l=Math.floor(l/2);
				l = [ l ];
				m = [ m ];
			} else if (l.limbs !== undefined) {
				l=l.normalize();
				m=new bn(l);
			//m=m.dbl().add(l); /* m=3*l */
				m=m.pmul(3);
				l = l.hlv().limbs;
				m = m.normalize().hlv().limbs;
			}

			this.precompute();

			if (this.multiples === undefined) {	
				for (i=m.length-1;i>=0;i--) {  /* l.length if no NAF */
					for (j = bn.prototype.radix - 1; j >= 0; j--) {
					/*out = out.dbl();
					if (l[i] & (1 << j)) {
						out = out.add(this);
					}*/
						out = out.dbl();
						ptr=(1<<j);
						t=m[i]&ptr;
						b=l[i]&ptr;
						if (t>b) out = out.add(this);
						if (t<b) out = out.sub(this);
					}
				}

			} else {
				for (i = m.length - 1; i >= 0; i--) {  /* l.length if no NAF */
					for (j = bn.prototype.radix - 4; j >= 0; j -= 4) {
						k=(m[i]>>j&0xF)-(l[i]>>j&0xF);
						out=out.dbl().dbl().dbl().dbl();
						if (k>0) out=out.add(this.multiples[k]);
						if (k<0) out=out.sub(this.multiples[-k]);
					}
				}
			}
		}
		else
		{
			var ws=8; /* ws*t=256 */
			var t=32; 

			//j=l.recode(t,ws,t-1);
			//if (j>0)
			//{
			//	if (j==1) out=this.toAffine();
			//	else out=table[j-2].toAffine();
			//}
			for (i=t-1;i>=0;i--)
			{
				j=l.recode(t,ws,i);
				out=out.dbl();
				if (j>0) 
				{
					if (j==1) out=out.add(this);
					else out=out.add(table[j-2]);
				}
			}
		}
		return out.toAffine();
	},

/* Compute j*this + k*X (simultaneous multiplication) */

	mul2: function(m,X,k,table1,table2) {
		var R = new ecc.point(this.curve);
		if (table1===undefined)
		{
			var i,j,len,t,b,ptr;

			m=m.normalize().limbs;
			k=k.normalize().limbs;

			if(m.length > k.length)
				{len = m.length; for (i=k.length;i<len;i++) k[i]=0;}
			else
				{len = k.length; for (i=m.length;i<len;i++) m[i]=0;}

			var C = this.add(X).toAffine();

			for (i=len-1;i>=0;i--) { 
				for (j = bn.prototype.radix - 1; j >= 0; j--) {
					R = R.dbl();
					ptr=(1<<j);
					t=m[i]&ptr;
					b=k[i]&ptr;

					if (t)
					{
						if (b) R=R.add(C);
						else   R=R.add(this);
					}
					else
					{
						if (b) R=R.add(X);
					}
				}
			}
		}
		else
		{
			var ws=8; /* ws*t=256 */
			var t=32; 
			var i,j1,j2;

			for (i=t-1;i>=0;i--)
			{
				j1=m.recode(t,ws,i);
				j2=k.recode(t,ws,i);
				R=R.dbl();
				if (j1>0) 
				{
					if (j1==1) R=R.add(this);
					else R=R.add(table1[j1-2]);
				}
				if (j2>0) 
				{
					if (j2==1) R=R.add(X);
					else R=R.add(table2[j2-2]);
				}
			}
		}
		return R.toAffine();
	},

	endomorph: function() {
		this.toAffine();
		return new ecc.point(this.curve,this.x.mul(ecc.constants.Beta),this.y);
	},

	GLVmul: function(e) {
		var i,W,B,u;
		var Q;
		W=new Array(2);
		W[0]=ecc.constants.A;
		W[1]=ecc.constants.B;
		B=new Array(2)
		for (i=0;i<2; i++)
			B[i]=new Array(2);

		B[0][0]=ecc.constants.A.copy().add(ecc.constants.B).normalize();
		B[0][1]=ecc.constants.B;
		B[1][0]=ecc.constants.B;
		B[1][1]=ecc.constants.A.copy().neg().normalize();

		u=e.glv(this.curve.r,W,B);
		Q=this.endomorph();

		if (u[1].negative())
		{
			u[1]=u[1].neg().normalize().trim();
			Q=Q.neg();
		}

		if (u[0].negative())
		{
			u[0]=u[0].neg().normalize().trim();
			return this.neg().mul2(u[0],Q,u[1]);
		}
		else return this.mul2(u[0],Q,u[1]);
	},

	isValid : function() {
		var z2 = this.z.square(), z4 = z2.square(), z6 = z4.mul(z2);
		return this.y.square().equals(
				this.curve.b.mul(z6).add(
						this.x.mul(this.curve.a.mul(z4).add(this.x.square()))));
	}
};

ecc.point.random = function(curve) {
	var x, y;
	
	while (true) {
		x = new curve.field(new bn.random(curve.field.modulus));
		var t = x.mul(x).mul(x).add(curve.b).add(curve.a.mul(x));
		y = t.sqrt();
		
		if (y.square().equals(t)) {
			return new ecc.point(curve, x, y);		
		}
		if (y.neg().square().equals(t)) {
			return new ecc.point(curve, x, y.neg());
		}
	}
};

ecc.point.fromString = function(string, curve) {
//alert("In ecc "+string);
	var i = string.indexOf(",");
//alert("i= "+i);
	var x = string.substring(1, i);
//alert("x= "+x);
	string[i] = "/";
	var y = string.substring(i + 1, string.length - 1);
//alert("y= "+y);
	return new ecc.point(curve, util.bitsToHex(util.stringToBits(x)), util.bitsToHex(util.stringToBits(y)));
};

/*
 * Construct an elliptic curve. Most users will not use this and instead start
 * with one of the NIST curves defined below.
 */
ecc.curve = function(Field, r, a, b, x, y) {
	this.field = Field;
	this.t = new bn(r);
	this.r = Field.prototype.modulus.sub(r);
	this.a = new Field(a);
	this.b = new Field(b);
	this.G = new ecc.point(this, new Field(x), new Field(y));
};

ecc.curves = {
	c192 : new ecc.curve(
			bn.prime.p192,
			"0x662107c8eb94364e4b2dd7ce",
			-3,
			"0x64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1",
			"0x188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012",
			"0x07192b95ffc8da78631011ed6b24cdd573f977a11e794811"),

	c224 : new ecc.curve(
			bn.prime.p224,
			"0xe95c1f470fc1ec22d6baa3a3d5c4",
			-3,
			"0xb4050a850c04b3abf54132565044b0b7d7bfd8ba270b39432355ffb4",
			"0xb70e0cbd6bb4bf7f321390b94a03c1d356c21122343280d6115c1d21",
			"0xbd376388b5f723fb4c22dfe6cd4375a05a07476444d5819985007e34"),

	c256 : new ecc.curve(
			bn.prime.p256,
			"0x4319055358e8617b0c46353d039cdaae",
			-3,
			"0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b",
			"0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296",
			"0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"),

	c384 : new ecc.curve(
			bn.prime.p384,
			"0x389cb27e0bc8d21fa7e5f24cb74f58851313e696333ad68c",
			-3,
			"0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef",
			"0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7",
			"0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f"),

	c254 : new ecc.curve(
			bn.prime.p254,
			"0x600000000B4038130054634925303646",
			0,
			2,
			"0x2400000008702A0DB0BDDF647A6366D3243FD6EE18093EE1BE6623EF5C1B55B2", // -1 
			"0x1")
};

ecc.constants = {
	A : new bn("600000000B40381200546349162FEB83"),
	B : new bn("8000000007802561"),
	Beta : new bn("8A2767366FEB39F76D4080940EAFD73531BA5621CB403D1C721FF30A56F323C"),

	
/*
	c254 : new ecc.curve(
			bn.prime.p254,
			"0x61818000000000030600000000000006",
			0,
			2,
			"0x2523648240000001BA344D80000000086121000000000013A700000000000012", // -1 
			"0x1")
};

ecc.constants = {
	A : new bn("61818000000000020400000000000003"),
	B : new bn("8100000000000001"),
// Cube root of unity modulo BN curve - in Montgomery form - with radix 2^24 
	Beta : new bn("1090dfdd00001dc53c51daa6b29bdb7bc4336ec7284638d1dd03971796033fbc"), 
*/
};
