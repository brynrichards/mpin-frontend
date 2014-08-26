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
util = {};

util.today = function() {
	var now=new Date();
	return Math.floor(now.getTime()/(60000*1440));  // for daily tokens
//	return Math.floor(now.getTime()/(60000));       // for 1 minute tokens
//	return (((((((now.getFullYear())<<5)+now.getDate())<<4)+now.getMonth())<<3)+now.getDay());
};

util.hex = function(n) {
  var out = "",i,digits="0123456789ABCDEF";
  for (i=0; i<8; i++) {
    var digit = n&0xF;
    out = digits.substring(digit,digit+1) + out;
    n = n >>> 4;
  }
  return out;
};

util.hexall = function(nn) {
  var out = "",i;
  for (i=0;i<nn.length;i++) {
    if (i%4 == 0) out+= "<br/>\n";
    else if (i) out += " ";
    out += util.hex(nn[i]);
  }
  return out;
};

util.unicodeToBytes = function(str) {
	var bytes = [];
	
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) <= 0x7F)
        	bytes.push(str.charCodeAt(i));
        else {
            var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
            for (var j = 0; j < h.length; j++)
            	bytes.push(parseInt(h[j], 16));
        }
    }
    return bytes;
};

util.bytesToUnicode = function(bytes) {
    var str = '';
    for (var i = 0; i < bytes.length; i++)
        str +=  bytes[i] <= 0x7F ? bytes[i] === 0x25 ? "%25" : String.fromCharCode(bytes[i]) : "%" + bytes[i].toString(16).toUpperCase();
    return decodeURIComponent(str);
};

util.wordsToBytes = function(words) {
	var bitmask = 0xff, bytes = [];
	for ( var i = 0; i < words.length; i++) {
		var bstart = i * 4;
		for ( var j = 0; j < 4; j++) {
			bytes[bstart + j] = (words[i] & (bitmask << (8 * (3 - j)))) >>> (8 * (3 - j));
		}
	}
	return bytes;
};

util.wordToBytes = function(word) {
	var bitmask = 0xff, bytes = [];
	for ( var j = 0; j < 4; j++) {
		bytes[j] = (word & (bitmask << (8 * (3 - j)))) >>> (8 * (3 - j));
	}
	return bytes;
};

util.bytesToWords = function(bytes) {
	var paddedBytes = bytes.slice(), words = [];
	while (paddedBytes.length % 4 != 0) {
		paddedBytes.push(0);
	}
	var num_words = Math.floor(paddedBytes.length / 4);
	for ( var j = 0; j < num_words; j++) {
		words[j] = ((paddedBytes[(j << 2) + 3]) | (paddedBytes[(j << 2) + 2] << 8)
				| (paddedBytes[(j << 2) + 1] << 16) | (paddedBytes[j << 2] << 24));
	}
	return words;
};

/* trim off extra zeros, or add leading zeros to byte array */
util.fixBytesLen = function(bytes,len){
	var b=bytes.slice(0);
	while (b.length>len) b.shift();
	while (b.length<len) b.unshift(0);
	return b;
};

util._chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",

util._clamp = function (a, len) {
	if (a.length * 32 < len) {
		return a;
	}
	a = a.slice(0, Math.ceil(len / 32));
	var l = a.length;
	len = len & 31;
	if (l > 0 && len) {
		a[l - 1] = util._partial(len, a[l - 1]
				& 0x80000000 >> (len - 1), 1);
	}
	return a;
};
  
util._getPartial = function (x) {
	return Math.round(x/0x10000000000) || 32;
},

util._bitLength = function (a) {
	var l = a.length, x;
    if (l === 0) { return 0; }
    x = a[l - 1];
    return (l-1) * 32 + util._getPartial(x);
};

util._partial = function (len, x, _end) {
	if (len === 32) { return x; }
    return (_end ? x|0 : x << (32-len)) + len * 0x10000000000;
};

/** Convert from a bitArray to a base64 string. */
util.bitsToString = function (arr, _noEquals) {
  var out = "", i, bits=0, c = util._chars, ta=0, bl = util._bitLength(arr);
  for (i=0; out.length * 6 < bl; ) {
    out += c.charAt((ta ^ arr[i]>>>bits) >>> 26);
    if (bits < 6) {
      ta = arr[i] << (6-bits);
      bits += 26;
      i++;
    } else {
      ta <<= 6;
      bits -= 6;
    }
  }
  while ((out.length & 3) && !_noEquals) { out += "="; }
  return out;
};

util.stringToBits = function(str) {
  str = str.replace(/\s|=/g,'');
  var out = [], i, bits=0, c = util._chars, ta=0, x;
  for (i=0; i < str.length; i++) {
    x = c.indexOf(str.charAt(i));
    if (x < 0) {
      throw new cjct.error("invalid format!");
    }
    if (bits > 26) {
      bits -= 26;
      out.push(ta ^ x>>>bits);
      ta  = x << (32-bits);
    } else {
      bits += 6;
      ta ^= x << (32-bits);
    }
  }
  if (bits&56) {
    out.push(util._partial(bits&56, ta, 1));
  }
  return out;
};

util.bitsToBytes = function (arr) {
	var out = [], bl = util._bitLength(arr), i, tmp;
    for (i=0; i<bl/8; i++) {
    	if ((i&3) === 0) {
    	  	tmp = arr[i/4];
      	}
      	out.push(tmp >>> 24);
      	tmp <<= 8;
    }
    return out;
};
  
/** Convert from an array of bytes to a bitArray. */
util.bytesToBits = function (bytes) {
	var out = [], i, tmp=0;
	for (i=0; i<bytes.length; i++) {
		tmp = tmp << 8 | bytes[i];
		if ((i&3) === 3) {
			out.push(tmp);
			tmp = 0;
		}
	}
	if (i&3) {
		out.push(util._partial(8*(i&3), tmp));
	}
	return out;
};

/** Convert from a bitArray to a hex string. */
util.bitsToHex = function (arr) {
	  var out = "", i, x;
	for (i = 0; i < arr.length; i++) {
		out += ((arr[i] | 0) + 0xF00000000000).toString(16).substr(4);
	}
	return "0x" + out.substr(0, util._bitLength(arr) / 4);
};

/** Convert from a hex string to a bitArray. */
util.hexToBits = function(str) {
	var i, out = [], len;
	str = str.replace(/\s|0x/g, "");
	len = str.length;
	str = str + "00000000";
	for (i = 0; i < str.length; i += 8) {
		out.push(parseInt(str.substr(i, 8), 16) ^ 0);
	}
	return util._clamp(out, len * 4);
};

/** Convert from a bitArray to a hex string. */
util.bitsToHexNew = function (arr) {
	  var out = "", i, x;
	for (i = 0; i < arr.length; i++) {
		out += ((arr[i] | 0) + 0xF00000000000).toString(16).substr(4);
	}
	return out.substr(0, util._bitLength(arr) / 4);
};

/** Convert from a hex string to a bitArray. */
util.hexToBitsNew = function(str) {
	var i, out = [], len;
	len = str.length;
	str = str + "00000000";
	for (i = 0; i < str.length; i += 8) {
		out.push(parseInt(str.substr(i, 8), 16) ^ 0);
	}
	return util._clamp(out, len * 4);
};

/* Input Base64 point on curve in format 04|x|y 
   Output [x,y] */
util.reset_format = function(point) 
{
  var point2 = util.bitsToBytes(util.stringToBits(point));
  point2 = util.fixBytesLen(point2, 2 * idak.FS + 1);
  var x = point2.slice(1, idak.FS + 1);
  x = util.bitsToString(util.bytesToBits(x));
  var y = point2.slice(idak.FS + 1);
  y = util.bitsToString(util.bytesToBits(y));
  return "[" + x + "," + y + "]";
};

/* Input hex point on curve in format 04|x|y 
   Output [x,y] */
util.hex2pointFormat = function(point) 
{
  var point2 = util.bitsToBytes(util.hexToBitsNew(point));
  point2 = util.fixBytesLen(point2, 2 * idak.FS + 1);
  var x = point2.slice(1, idak.FS + 1);
  x = util.bitsToString(util.bytesToBits(x));
  var y = point2.slice(idak.FS + 1);
  y = util.bitsToString(util.bytesToBits(y));
  return "[" + x + "," + y + "]";
};

/* Input [x,y]
   Output Base64 point on curve in format 04|x|y */
util.change_format = function(point) {
  var position = point.indexOf(",");
  var x = util.bitsToBytes(util.stringToBits(point.substring(1, position)));
  var y = util.bitsToBytes(util.stringToBits(point.substring(position + 1, point.length - 1)));
  x = util.fixBytesLen(x, idak.FS);
  y = util.fixBytesLen(y, idak.FS);
  var point2 = [4];
  point2 = point2.concat(x).concat(y);
  return util.bitsToString(util.bytesToBits(point2));
};

/* Input [x,y]
   Output hex point on curve in format 04|x|y  */
util.pointFormat2hex = function(point) {
  var position = point.indexOf(",");
  var x = util.bitsToBytes(util.stringToBits(point.substring(1, position)));
  var y = util.bitsToBytes(util.stringToBits(point.substring(position + 1, point.length - 1)));
  x = util.fixBytesLen(x, idak.FS);
  y = util.fixBytesLen(y, idak.FS);
  var point2 = [4];
  point2 = point2.concat(x).concat(y);
  return util.bitsToHexNew(util.bytesToBits(point2));
};
