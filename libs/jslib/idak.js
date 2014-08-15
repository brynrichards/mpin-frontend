/*
 * Authenticated key agreement.
 * 
 * Original Author: Diego F. Aranha
 * Heavily Modified by M.Scott March 2013
 */
idak = {
		/* Security level. */
		_curve : ecc.curves.c254,
		FS : 32,
		permits: true,
	
		_var : new bn("0x4000000003C012B1"),  /* BN curve param */
		_neg : true,


		_hash : function(vector) {
			var hash= new sha256();
			for (var i = 0; i < vector.length; i++) {
				hash.update_byte(vector[i]);
			}
			var rv=util.wordsToBytes(hash.finalize());
			while (rv.length<32) {
				bytes.push(0);
			}
			while (rv.length>32)
			{
				bytes.pop();
			}

			return rv;
		},

		_hashIt : function(vector) {
			var hash= new sha256();
			for (var i = 0; i < vector.length; i++) {
				hash.update_byte(vector[i]);
			}

			return util.bitsToString(util.bytesToBits(util.wordsToBytes(hash.finalize())));
		},

		_hashToInteger : function(vector, modulus) {
			var hash = new sha256();
			for (var i = 0; i < vector.length; i++) {
				hash.update_byte(vector[i]);
			}
			hash = util.wordsToBytes(hash.finalize());
			var k = new bn(util.bitsToHex(util.bytesToBits(hash)));
			return k.mod(modulus);
		},
		
		_hashToPoint1 : function(vector) {
			var hash = new sha256();
			for (var i = 0; i < vector.length; i++) {
				hash.update_byte(vector[i]);
			}
			hash = util.wordsToBytes(hash.finalize());
//			hash.unshift(1);
			var x0 = new bn(util.bitsToHex(util.bytesToBits(hash)));
			x0 = x0.mod(this._curve.field.modulus);

			while (true) {
				var x = new this._curve.field(x0.toHexString());
				var y0 = x.mul(x).mul(x).add(this._curve.a.mul(x)).add(this._curve.b);
				var y = y0.sqrt();
				if (y.print().limbs[0] & 1) {
					y = y.neg();
				}
				if (y.square().equals(y0)) {
					return new ecc.point(this._curve, x, y);
				}
				x0 = x0.add(new bn(1));
			}
		},
/*		
		_hashToPoint2 : function(vector) {
			var hash = new sha256();
			for (var i = 0; i < vector.length; i++) {
				hash.update_byte(vector[i]);
			}
			hash = util.wordsToBytes(hash.finalize());
//			hash.unshift(1);
			var x0 = new bn(util.bitsToHex(util.bytesToBits(hash)));
			x0 = x0.mod(this._curve.field.modulus);
			var point = [];
			while (true) {
				x0 = x0.add(new bn(1));
				var x = new fp2(new this._curve.field(1), new this._curve.field(x0.toHexString()));
				var b = new fp2(this._curve.b, 0); 
				b = b.mul(new fp2(1, 0).mulQNR().inverse());
				var a = new fp2(this._curve.a, 0);
				
				var y0 = x.mul(x).mul(x).add(a.mul(x)).add(b);
				
				var y = y0.sqrt();
				if (y.square().equals(y0)) {
					point = new twist.point(this._curve, x, y);
					break;
				}
			}
			// Multiply by factored cofactor. 
			var t0 = point.smul(this._var);
			if (this._neg) {
				t0 = t0.neg();
			}
			t1 = t0.add(t0).add(t0).toAffine();
			var t1 = t1.frobenius();
			point = point.frobenius().frobenius().frobenius();
			point = point.add(t0).add(t1).toAffine();
			t1 = t0.frobenius().frobenius();
			point = point.add(t1).toAffine();
			return point;
		},
	*/	
		_getSecret : function() {
			do {
				var v = new bn.random(this._curve.r);
			} while (v.equals(0));
			
			return v;
		},
		
		getSecret : function() {
			return this._getSecret();
		},
/*
		_getServerKey : function(secret, serverIdentity) {
			var point = this._hashToPoint2(util.unicodeToBytes(serverIdentity));
			var sk= point.mul(secret).toString();   
			return sk;
		},
		
		getServerKey : function(secret,serverIdentity) {
			return this._getServerKey(secret, serverIdentity);
		},
		
		getPrivateKey : function(masterKey, userIdentity) {
			var point = this._hashToPoint1(util.unicodeToBytes(userIdentity));
			// Compute private key as sA, where A = H(ID_A). 
			return point.mul(masterKey).toString(); 
		},

		getServerDetails : function(serverID) {
			return [serverID,this._hashToPoint2(util.unicodeToBytes(serverID)).toString()];
		},

		getTimePermit : function(masterKey, userIdentity) {
			var point = this._hashToPoint1(util.wordToBytes(util.today()).concat(util.unicodeToBytes(userIdentity))).toAffine();
			// Compute private key as sA, where A = H(ID_A). 
			return point.mul(masterKey).toString(); 
		},
	
		getMask : function() {
			return this._getSecret().toString();
		},

		getInverseMask : function(mask) {
			var m=new bn(util.bitsToHex(util.stringToBits(mask)));
			var n=m.inverseMod(this._curve.r);
			if (!n.greaterEquals(new bn(0))) 
				n = n.add(this._curve.r);
			return n.toString();
		},		

		registerPIN : function(privateKey, userIdentity, pin) {
			var privateKey = new ecc.point.fromString(privateKey, this._curve);
			
			// Compute A = H(ID_A). 
			var point = this._hashToPoint1(util.unicodeToBytes(userIdentity));

			// Compute (sA - alphaA). 
	
			var pin = parseInt(pin, 10);
			point = privateKey.sub(point.smul(pin));
			
			return point.toString();
		},
*/
/* Create precomputed table from user identity 
		createTable : function(userIdentity) {
			var i,j,k,bpp,is;
			var ws=8; // ws*width=256 
			var width=32; 
			var st=256; // 1<< ws 
			var publicKey = this._hashToPoint1(util.unicodeToBytes(userIdentity)).add(this._hashToPoint1(util.wordToBytes(util.today()).concat(util.unicodeToBytes(userIdentity))));
			var P=publicKey.toAffine();

			this.pktable=new Array(254);
			for (j=0;j<width;j++)
				P=P.dbl();

			k=1;

			for (i=2;i<st;i++)
			{
				if (i==(1<<k))
				{
					k++;
					this.pktable[i-2]=P.toAffine();     
					for (j=0;j<width;j++)
						P=P.dbl();
					continue;
				}

				bpp=1;
				this.pktable[i-2]=new ecc.point(this._curve);
				for (j=0;j<k;j++)
				{
					if (i&bpp)
					{
						is=1<<j;
						if (is==1) this.pktable[i-2]=(this.pktable[i-2].add(publicKey)).toAffine();
						else this.pktable[i-2]=(this.pktable[i-2].add(this.pktable[is-2])).toAffine();
					}
					bpp<<=1;
				}
			}
		},
*/
		hashedID : function(userID) {
			return this._hashToPoint1(util.unicodeToBytes(userID)); 
		},
			
		hashedTpID: function(userID) {
			return this._hashToPoint1(util.wordToBytes(util.today()).concat(util.unicodeToBytes(userID)));
		},

/* Identity combined with Time Stamped ID multiplied by z */
		computeMPin_1c : function(hashedID,hashedTpID,z) {
			var Pa;
			var Id = hashedID.toAffine(); //this._hashToPoint1(util.unicodeToBytes(userID)); 

			Pa=Id.add(hashedTpID).toAffine();//this._hashToPoint1(util.wordToBytes(util.today()).concat(util.unicodeToBytes(userID)))).toAffine();
			
			Pa=Pa.mul(z).toString(); /****/
	
			return Pa;
		},

/* Identity Multiplied by z */
		computeMPin_1x : function(hashedID,z) {
			var Id=hashedID.toAffine();
			Id=Id.mul(z).toString();
			return Id;
		},

		computeMPin_1b : function(hashedID,m,pin,token,permit) {
			var Px = new ecc.point.fromString(token, this._curve);
			// Compute (s - alpha)A + alpha * A = [s]A. 
			var pin = parseInt(pin, 10);
			Px = Px.add(hashedID.smul(pin)).toAffine(); // work
			if (this.permits) 
			{
				var tp=new ecc.point.fromString(permit, this._curve);
				Px = Px.add(tp).toAffine();
			}
			Px=Px.mul(m).toString(); /****/

			return Px; 
		},

		computeMPin_2 : function(x,y,m,mPair) {
	
			var n=m.inverseMod(this._curve.r);
			var z = x.add(y).mul(n).mod(this._curve.r);

			var buffer=util.bitsToBytes(util.stringToBits(mPair));

			var ee=new Array(12);
			for (var i=0;i<12;i++)
			{
				ee[i]=buffer.slice(i*this.FS,(i+1)*this.FS); ee[i]=util.bitsToHex(util.bytesToBits(ee[i]));
			}
			var c0=new fp2(ee[0],ee[1]);
			var c1=new fp2(ee[8],ee[9]);
			var c2=new fp2(ee[6],ee[7]);
			var w0=new fp6(c0,c1,c2);
			var c3=new fp2(ee[4],ee[5]);
			var c4=new fp2(ee[2],ee[3]);
			var c5=new fp2(ee[10],ee[11]);
			var w1=new fp6(c3,c4,c5);
			var g=new fp12(w0,w1);
			if (!g.member()) return ["0",false];

			var g0=g.trace();

			var gp=g.copy();
			gp=gp.frobenius();
			var g1=gp.trace();
			g=g.conj();
			gp=gp.mul(g);
			var g2=gp.trace();
			gp=gp.mul(g);
			var g3=gp.trace();

			var pmq=this._curve.field.modulus.sub(this._curve.r).normalize().trim();
			var am=z.mod(pmq);
			var ad=z.div(pmq);

			var e=g0.xtr_pow2(g1,g2,g3,am,ad); // unmask pairing value - work
			
			var buffer = 
				e.els[0].els[0].toMyPaddedBytes(32).concat(
				e.els[0].els[1].toMyPaddedBytes(32)).concat(
				e.els[1].els[0].toMyPaddedBytes(32)).concat(
				e.els[1].els[1].toMyPaddedBytes(32));

			var k=this._hash(buffer).slice(0,16);

			return [util.bitsToString(util.bytesToBits(k)),true];
		},

}
