var QRCode;!function(){function a(a){this.mode=c.MODE_8BIT_BYTE,this.data=a,this.parsedData=[];for(var b=[],d=0,e=this.data.length;e>d;d++){var f=this.data.charCodeAt(d);f>65536?(b[0]=240|(1835008&f)>>>18,b[1]=128|(258048&f)>>>12,b[2]=128|(4032&f)>>>6,b[3]=128|63&f):f>2048?(b[0]=224|(61440&f)>>>12,b[1]=128|(4032&f)>>>6,b[2]=128|63&f):f>128?(b[0]=192|(1984&f)>>>6,b[1]=128|63&f):b[0]=f,this.parsedData=this.parsedData.concat(b)}this.parsedData.length!=this.data.length&&(this.parsedData.unshift(191),this.parsedData.unshift(187),this.parsedData.unshift(239))}function b(a,b){this.typeNumber=a,this.errorCorrectLevel=b,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=[]}function i(a,b){if(void 0==a.length)throw new Error(a.length+"/"+b);for(var c=0;c<a.length&&0==a[c];)c++;this.num=new Array(a.length-c+b);for(var d=0;d<a.length-c;d++)this.num[d]=a[d+c]}function j(a,b){this.totalCount=a,this.dataCount=b}function k(){this.buffer=[],this.length=0}function m(){return"undefined"!=typeof CanvasRenderingContext2D}function n(){var a=!1,b=navigator.userAgent;return/android/i.test(b)&&(a=!0,aMat=b.toString().match(/android ([0-9]\.[0-9])/i),aMat&&aMat[1]&&(a=parseFloat(aMat[1]))),a}function r(a,b){for(var c=1,e=s(a),f=0,g=l.length;g>=f;f++){var h=0;switch(b){case d.L:h=l[f][0];break;case d.M:h=l[f][1];break;case d.Q:h=l[f][2];break;case d.H:h=l[f][3]}if(h>=e)break;c++}if(c>l.length)throw new Error("Too long data");return c}function s(a){var b=encodeURI(a).toString().replace(/\%[0-9a-fA-F]{2}/g,"a");return b.length+(b.length!=a?3:0)}a.prototype={getLength:function(){return this.parsedData.length},write:function(a){for(var b=0,c=this.parsedData.length;c>b;b++)a.put(this.parsedData[b],8)}},b.prototype={addData:function(b){var c=new a(b);this.dataList.push(c),this.dataCache=null},isDark:function(a,b){if(0>a||this.moduleCount<=a||0>b||this.moduleCount<=b)throw new Error(a+","+b);return this.modules[a][b]},getModuleCount:function(){return this.moduleCount},make:function(){this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(a,c){this.moduleCount=4*this.typeNumber+17,this.modules=new Array(this.moduleCount);for(var d=0;d<this.moduleCount;d++){this.modules[d]=new Array(this.moduleCount);for(var e=0;e<this.moduleCount;e++)this.modules[d][e]=null}this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(a,c),this.typeNumber>=7&&this.setupTypeNumber(a),null==this.dataCache&&(this.dataCache=b.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,c)},setupPositionProbePattern:function(a,b){for(var c=-1;7>=c;c++)if(!(-1>=a+c||this.moduleCount<=a+c))for(var d=-1;7>=d;d++)-1>=b+d||this.moduleCount<=b+d||(this.modules[a+c][b+d]=c>=0&&6>=c&&(0==d||6==d)||d>=0&&6>=d&&(0==c||6==c)||c>=2&&4>=c&&d>=2&&4>=d?!0:!1)},getBestMaskPattern:function(){for(var a=0,b=0,c=0;8>c;c++){this.makeImpl(!0,c);var d=f.getLostPoint(this);(0==c||a>d)&&(a=d,b=c)}return b},createMovieClip:function(a,b,c){var d=a.createEmptyMovieClip(b,c),e=1;this.make();for(var f=0;f<this.modules.length;f++)for(var g=f*e,h=0;h<this.modules[f].length;h++){var i=h*e,j=this.modules[f][h];j&&(d.beginFill(0,100),d.moveTo(i,g),d.lineTo(i+e,g),d.lineTo(i+e,g+e),d.lineTo(i,g+e),d.endFill())}return d},setupTimingPattern:function(){for(var a=8;a<this.moduleCount-8;a++)null==this.modules[a][6]&&(this.modules[a][6]=0==a%2);for(var b=8;b<this.moduleCount-8;b++)null==this.modules[6][b]&&(this.modules[6][b]=0==b%2)},setupPositionAdjustPattern:function(){for(var a=f.getPatternPosition(this.typeNumber),b=0;b<a.length;b++)for(var c=0;c<a.length;c++){var d=a[b],e=a[c];if(null==this.modules[d][e])for(var g=-2;2>=g;g++)for(var h=-2;2>=h;h++)this.modules[d+g][e+h]=-2==g||2==g||-2==h||2==h||0==g&&0==h?!0:!1}},setupTypeNumber:function(a){for(var b=f.getBCHTypeNumber(this.typeNumber),c=0;18>c;c++){var d=!a&&1==(1&b>>c);this.modules[Math.floor(c/3)][c%3+this.moduleCount-8-3]=d}for(var c=0;18>c;c++){var d=!a&&1==(1&b>>c);this.modules[c%3+this.moduleCount-8-3][Math.floor(c/3)]=d}},setupTypeInfo:function(a,b){for(var c=this.errorCorrectLevel<<3|b,d=f.getBCHTypeInfo(c),e=0;15>e;e++){var g=!a&&1==(1&d>>e);6>e?this.modules[e][8]=g:8>e?this.modules[e+1][8]=g:this.modules[this.moduleCount-15+e][8]=g}for(var e=0;15>e;e++){var g=!a&&1==(1&d>>e);8>e?this.modules[8][this.moduleCount-e-1]=g:9>e?this.modules[8][15-e-1+1]=g:this.modules[8][15-e-1]=g}this.modules[this.moduleCount-8][8]=!a},mapData:function(a,b){for(var c=-1,d=this.moduleCount-1,e=7,g=0,h=this.moduleCount-1;h>0;h-=2)for(6==h&&h--;;){for(var i=0;2>i;i++)if(null==this.modules[d][h-i]){var j=!1;g<a.length&&(j=1==(1&a[g]>>>e));var k=f.getMask(b,d,h-i);k&&(j=!j),this.modules[d][h-i]=j,e--,-1==e&&(g++,e=7)}if(d+=c,0>d||this.moduleCount<=d){d-=c,c=-c;break}}}},b.PAD0=236,b.PAD1=17,b.createData=function(a,c,d){for(var e=j.getRSBlocks(a,c),g=new k,h=0;h<d.length;h++){var i=d[h];g.put(i.mode,4),g.put(i.getLength(),f.getLengthInBits(i.mode,a)),i.write(g)}for(var l=0,h=0;h<e.length;h++)l+=e[h].dataCount;if(g.getLengthInBits()>8*l)throw new Error("code length overflow. ("+g.getLengthInBits()+">"+8*l+")");for(g.getLengthInBits()+4<=8*l&&g.put(0,4);0!=g.getLengthInBits()%8;)g.putBit(!1);for(;;){if(g.getLengthInBits()>=8*l)break;if(g.put(b.PAD0,8),g.getLengthInBits()>=8*l)break;g.put(b.PAD1,8)}return b.createBytes(g,e)},b.createBytes=function(a,b){for(var c=0,d=0,e=0,g=new Array(b.length),h=new Array(b.length),j=0;j<b.length;j++){var k=b[j].dataCount,l=b[j].totalCount-k;d=Math.max(d,k),e=Math.max(e,l),g[j]=new Array(k);for(var m=0;m<g[j].length;m++)g[j][m]=255&a.buffer[m+c];c+=k;var n=f.getErrorCorrectPolynomial(l),o=new i(g[j],n.getLength()-1),p=o.mod(n);h[j]=new Array(n.getLength()-1);for(var m=0;m<h[j].length;m++){var q=m+p.getLength()-h[j].length;h[j][m]=q>=0?p.get(q):0}}for(var r=0,m=0;m<b.length;m++)r+=b[m].totalCount;for(var s=new Array(r),t=0,m=0;d>m;m++)for(var j=0;j<b.length;j++)m<g[j].length&&(s[t++]=g[j][m]);for(var m=0;e>m;m++)for(var j=0;j<b.length;j++)m<h[j].length&&(s[t++]=h[j][m]);return s};for(var c={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},d={L:1,M:0,Q:3,H:2},e={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},f={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(a){for(var b=a<<10;f.getBCHDigit(b)-f.getBCHDigit(f.G15)>=0;)b^=f.G15<<f.getBCHDigit(b)-f.getBCHDigit(f.G15);return(a<<10|b)^f.G15_MASK},getBCHTypeNumber:function(a){for(var b=a<<12;f.getBCHDigit(b)-f.getBCHDigit(f.G18)>=0;)b^=f.G18<<f.getBCHDigit(b)-f.getBCHDigit(f.G18);return a<<12|b},getBCHDigit:function(a){for(var b=0;0!=a;)b++,a>>>=1;return b},getPatternPosition:function(a){return f.PATTERN_POSITION_TABLE[a-1]},getMask:function(a,b,c){switch(a){case e.PATTERN000:return 0==(b+c)%2;case e.PATTERN001:return 0==b%2;case e.PATTERN010:return 0==c%3;case e.PATTERN011:return 0==(b+c)%3;case e.PATTERN100:return 0==(Math.floor(b/2)+Math.floor(c/3))%2;case e.PATTERN101:return 0==b*c%2+b*c%3;case e.PATTERN110:return 0==(b*c%2+b*c%3)%2;case e.PATTERN111:return 0==(b*c%3+(b+c)%2)%2;default:throw new Error("bad maskPattern:"+a)}},getErrorCorrectPolynomial:function(a){for(var b=new i([1],0),c=0;a>c;c++)b=b.multiply(new i([1,g.gexp(c)],0));return b},getLengthInBits:function(a,b){if(b>=1&&10>b)switch(a){case c.MODE_NUMBER:return 10;case c.MODE_ALPHA_NUM:return 9;case c.MODE_8BIT_BYTE:return 8;case c.MODE_KANJI:return 8;default:throw new Error("mode:"+a)}else if(27>b)switch(a){case c.MODE_NUMBER:return 12;case c.MODE_ALPHA_NUM:return 11;case c.MODE_8BIT_BYTE:return 16;case c.MODE_KANJI:return 10;default:throw new Error("mode:"+a)}else{if(!(41>b))throw new Error("type:"+b);switch(a){case c.MODE_NUMBER:return 14;case c.MODE_ALPHA_NUM:return 13;case c.MODE_8BIT_BYTE:return 16;case c.MODE_KANJI:return 12;default:throw new Error("mode:"+a)}}},getLostPoint:function(a){for(var b=a.getModuleCount(),c=0,d=0;b>d;d++)for(var e=0;b>e;e++){for(var f=0,g=a.isDark(d,e),h=-1;1>=h;h++)if(!(0>d+h||d+h>=b))for(var i=-1;1>=i;i++)0>e+i||e+i>=b||(0!=h||0!=i)&&g==a.isDark(d+h,e+i)&&f++;f>5&&(c+=3+f-5)}for(var d=0;b-1>d;d++)for(var e=0;b-1>e;e++){var j=0;a.isDark(d,e)&&j++,a.isDark(d+1,e)&&j++,a.isDark(d,e+1)&&j++,a.isDark(d+1,e+1)&&j++,(0==j||4==j)&&(c+=3)}for(var d=0;b>d;d++)for(var e=0;b-6>e;e++)a.isDark(d,e)&&!a.isDark(d,e+1)&&a.isDark(d,e+2)&&a.isDark(d,e+3)&&a.isDark(d,e+4)&&!a.isDark(d,e+5)&&a.isDark(d,e+6)&&(c+=40);for(var e=0;b>e;e++)for(var d=0;b-6>d;d++)a.isDark(d,e)&&!a.isDark(d+1,e)&&a.isDark(d+2,e)&&a.isDark(d+3,e)&&a.isDark(d+4,e)&&!a.isDark(d+5,e)&&a.isDark(d+6,e)&&(c+=40);for(var k=0,e=0;b>e;e++)for(var d=0;b>d;d++)a.isDark(d,e)&&k++;var l=Math.abs(100*k/b/b-50)/5;return c+=10*l}},g={glog:function(a){if(1>a)throw new Error("glog("+a+")");return g.LOG_TABLE[a]},gexp:function(a){for(;0>a;)a+=255;for(;a>=256;)a-=255;return g.EXP_TABLE[a]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)},h=0;8>h;h++)g.EXP_TABLE[h]=1<<h;for(var h=8;256>h;h++)g.EXP_TABLE[h]=g.EXP_TABLE[h-4]^g.EXP_TABLE[h-5]^g.EXP_TABLE[h-6]^g.EXP_TABLE[h-8];for(var h=0;255>h;h++)g.LOG_TABLE[g.EXP_TABLE[h]]=h;i.prototype={get:function(a){return this.num[a]},getLength:function(){return this.num.length},multiply:function(a){for(var b=new Array(this.getLength()+a.getLength()-1),c=0;c<this.getLength();c++)for(var d=0;d<a.getLength();d++)b[c+d]^=g.gexp(g.glog(this.get(c))+g.glog(a.get(d)));return new i(b,0)},mod:function(a){if(this.getLength()-a.getLength()<0)return this;for(var b=g.glog(this.get(0))-g.glog(a.get(0)),c=new Array(this.getLength()),d=0;d<this.getLength();d++)c[d]=this.get(d);for(var d=0;d<a.getLength();d++)c[d]^=g.gexp(g.glog(a.get(d))+b);return new i(c,0).mod(a)}},j.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],j.getRSBlocks=function(a,b){var c=j.getRsBlockTable(a,b);if(void 0==c)throw new Error("bad rs block @ typeNumber:"+a+"/errorCorrectLevel:"+b);for(var d=c.length/3,e=[],f=0;d>f;f++)for(var g=c[3*f+0],h=c[3*f+1],i=c[3*f+2],k=0;g>k;k++)e.push(new j(h,i));return e},j.getRsBlockTable=function(a,b){switch(b){case d.L:return j.RS_BLOCK_TABLE[4*(a-1)+0];case d.M:return j.RS_BLOCK_TABLE[4*(a-1)+1];case d.Q:return j.RS_BLOCK_TABLE[4*(a-1)+2];case d.H:return j.RS_BLOCK_TABLE[4*(a-1)+3];default:return void 0}},k.prototype={get:function(a){var b=Math.floor(a/8);return 1==(1&this.buffer[b]>>>7-a%8)},put:function(a,b){for(var c=0;b>c;c++)this.putBit(1==(1&a>>>b-c-1))},getLengthInBits:function(){return this.length},putBit:function(a){var b=Math.floor(this.length/8);this.buffer.length<=b&&this.buffer.push(0),a&&(this.buffer[b]|=128>>>this.length%8),this.length++}};var l=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]],o=function(){var a=function(a,b){this._el=a,this._htOption=b};return a.prototype.draw=function(a){function g(a,b){var c=document.createElementNS("http://www.w3.org/2000/svg",a);for(var d in b)b.hasOwnProperty(d)&&c.setAttribute(d,b[d]);return c}var b=this._htOption,c=this._el,d=a.getModuleCount();Math.floor(b.width/d),Math.floor(b.height/d),this.clear();var h=g("svg",{viewBox:"0 0 "+String(d)+" "+String(d),width:"100%",height:"100%",fill:b.colorLight});h.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),c.appendChild(h),h.appendChild(g("rect",{fill:b.colorDark,width:"1",height:"1",id:"template"}));for(var i=0;d>i;i++)for(var j=0;d>j;j++)if(a.isDark(i,j)){var k=g("use",{x:String(i),y:String(j)});k.setAttributeNS("http://www.w3.org/1999/xlink","href","#template"),h.appendChild(k)}},a.prototype.clear=function(){for(;this._el.hasChildNodes();)this._el.removeChild(this._el.lastChild)},a}(),p="svg"===document.documentElement.tagName.toLowerCase(),q=p?o:m()?function(){function a(){this._elImage.src=this._elCanvas.toDataURL("image/png"),this._elImage.style.display="block",this._elCanvas.style.display="none"}function d(a,b){var c=this;if(c._fFail=b,c._fSuccess=a,null===c._bSupportDataURI){var d=document.createElement("img"),e=function(){c._bSupportDataURI=!1,c._fFail&&_fFail.call(c)},f=function(){c._bSupportDataURI=!0,c._fSuccess&&c._fSuccess.call(c)};return d.onabort=e,d.onerror=e,d.onload=f,d.src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",void 0}c._bSupportDataURI===!0&&c._fSuccess?c._fSuccess.call(c):c._bSupportDataURI===!1&&c._fFail&&c._fFail.call(c)}if(this._android&&this._android<=2.1){var b=1/window.devicePixelRatio,c=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(a,d,e,f,g,h,i,j){if("nodeName"in a&&/img/i.test(a.nodeName))for(var l=arguments.length-1;l>=1;l--)arguments[l]=arguments[l]*b;else"undefined"==typeof j&&(arguments[1]*=b,arguments[2]*=b,arguments[3]*=b,arguments[4]*=b);c.apply(this,arguments)}}var e=function(a,b){this._bIsPainted=!1,this._android=n(),this._htOption=b,this._elCanvas=document.createElement("canvas"),this._elCanvas.width=b.width,this._elCanvas.height=b.height,a.appendChild(this._elCanvas),this._el=a,this._oContext=this._elCanvas.getContext("2d"),this._bIsPainted=!1,this._elImage=document.createElement("img"),this._elImage.style.display="none",this._el.appendChild(this._elImage),this._bSupportDataURI=null};return e.prototype.draw=function(a){var b=this._elImage,c=this._oContext,d=this._htOption,e=a.getModuleCount(),f=d.width/e,g=d.height/e,h=Math.round(f),i=Math.round(g);b.style.display="none",this.clear();for(var j=0;e>j;j++)for(var k=0;e>k;k++){var l=a.isDark(j,k),m=k*f,n=j*g;c.strokeStyle=l?d.colorDark:d.colorLight,c.lineWidth=1,c.fillStyle=l?d.colorDark:d.colorLight,c.fillRect(m,n,f,g),c.strokeRect(Math.floor(m)+.5,Math.floor(n)+.5,h,i),c.strokeRect(Math.ceil(m)-.5,Math.ceil(n)-.5,h,i)}this._bIsPainted=!0},e.prototype.makeImage=function(){this._bIsPainted&&d.call(this,a)},e.prototype.isPainted=function(){return this._bIsPainted},e.prototype.clear=function(){this._oContext.clearRect(0,0,this._elCanvas.width,this._elCanvas.height),this._bIsPainted=!1},e.prototype.round=function(a){return a?Math.floor(1e3*a)/1e3:a},e}():function(){var a=function(a,b){this._el=a,this._htOption=b};return a.prototype.draw=function(a){for(var b=this._htOption,c=this._el,d=a.getModuleCount(),e=Math.floor(b.width/d),f=Math.floor(b.height/d),g=['<table style="border:0;border-collapse:collapse;">'],h=0;d>h;h++){g.push("<tr>");for(var i=0;d>i;i++)g.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:'+e+"px;height:"+f+"px;background-color:"+(a.isDark(h,i)?b.colorDark:b.colorLight)+';"></td>');g.push("</tr>")}g.push("</table>"),c.innerHTML=g.join("");var j=c.childNodes[0],k=(b.width-j.offsetWidth)/2,l=(b.height-j.offsetHeight)/2;k>0&&l>0&&(j.style.margin=l+"px "+k+"px")},a.prototype.clear=function(){this._el.innerHTML=""},a}();QRCode=function(a,b){if(this._htOption={width:256,height:256,typeNumber:4,colorDark:"#000000",colorLight:"#ffffff",correctLevel:d.H},"string"==typeof b&&(b={text:b}),b)for(var c in b)this._htOption[c]=b[c];"string"==typeof a&&(a=document.getElementById(a)),this._android=n(),this._el=a,this._oQRCode=null,this._oDrawing=new q(this._el,this._htOption),this._htOption.text&&this.makeCode(this._htOption.text)},QRCode.prototype.makeCode=function(a){this._oQRCode=new b(r(a,this._htOption.correctLevel),this._htOption.correctLevel),this._oQRCode.addData(a),this._oQRCode.make(),this._el.title=a,this._oDrawing.draw(this._oQRCode),this.makeImage()},QRCode.prototype.makeImage=function(){"function"==typeof this._oDrawing.makeImage&&(!this._android||this._android>=3)&&this._oDrawing.makeImage()},QRCode.prototype.clear=function(){this._oDrawing.clear()},QRCode.CorrectLevel=d}();
;
/*
    json2.js
    2012-10-08

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

;
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
		var maxMul=bn.prototype.maxMul-1;
		var ii=maxMul;

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



;
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

;
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
			var sk= point.GSmul(secret).toString();   
			return sk;
		},
		
		getServerKey : function(secret,serverIdentity) {
			return this._getServerKey(secret, serverIdentity);
		},
		
		getPrivateKey : function(masterKey, userIdentity) {
			var point = this._hashToPoint1(util.unicodeToBytes(userIdentity));
			// Compute private key as sA, where A = H(ID_A). 
			return point.GLVmul(masterKey).toString(); 
		},

		getServerDetails : function(serverID) {
			return [serverID,this._hashToPoint2(util.unicodeToBytes(serverID)).toString()];
		},

		getTimePermit : function(masterKey, userIdentity) {
			var point = this._hashToPoint1(util.wordToBytes(util.today()).concat(util.unicodeToBytes(userIdentity))).toAffine();
			// Compute private key as sA, where A = H(ID_A). 
			return point.GLVmul(masterKey).toString(); 
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
			
			Pa=Pa.GLVmul(z).toString(); /****/
	
			return Pa;
		},

/* Identity Multiplied by z */
		computeMPin_1x : function(hashedID,z) {
			var Id=hashedID.toAffine();
			Id=Id.GLVmul(z).toString();
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
			Px=Px.GLVmul(m).toString(); /****/

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

;
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

;
/*
 * Certivox JavaScript Crypto Toolkit
 *
 * sha256 implementation based on Mike Hamburg's public domain code.
 */

sha256 = function() {
	if (!this.k[0])
		this.precompute();
	this.initialize();
}

sha256.prototype = {
  /*
  init:[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],

  k:[0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
     0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
     0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
     0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
     0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
     0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
     0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
     0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2],
  */

	init : [],
	k : [],

	precompute : function() {
		var p = 2, i = 0, j;

		function frac(x) {
			return (x - Math.floor(x)) * 4294967296 | 0
		}

		outer: for (; i < 64; p++) {
			for (j = 2; j * j <= p; j++)
				if (p % j == 0)
					continue outer;

			if (i < 8)
				this.init[i] = frac(Math.pow(p, 1 / 2));
			this.k[i] = frac(Math.pow(p, 1 / 3));
			i++;
		}
	},

	initialize : function() {
		this.h = this.init.slice(0);
		this.word_buffer = [];
		this.bit_buffer = 0;
		this.bits_buffered = 0;
		this.length = 0;
		this.length_upper = 0;
	},

	// one cycle of sha256
	block:function(words) {
		var w=words.slice(0),i,h=this.h,tmp,k=this.k;

		var h0=h[0],h1=h[1],h2=h[2],h3=h[3],h4=h[4],h5=h[5],h6=h[6],h7=h[7];

		for (i=0;i<64;i++) {
			if (i<16) {
				tmp=w[i];
			} else {
				var a=w[(i+1)&15], b=w[(i+14)&15];
				tmp=w[i&15]=((a>>>7^a>>>18^a>>>3^a<<25^a<<14) + 
						(b>>>17^b>>>19^b>>>10^b<<15^b<<13) + 
						w[i&15] + w[(i+9)&15]) | 0;
			}
			tmp += h7 + (h4>>>6^h4>>>11^h4>>>25^h4<<26^h4<<21^h4<<7) + (h6 ^ h4&(h5^h6)) + k[i];
			h7=h6; h6=h5; h5=h4;
			h4 = h3 + tmp | 0;
			h3=h2; h2=h1; h1=h0;

			h0 = (tmp + ((h1&h2)^(h3&(h1^h2))) + (h1>>>2^h1>>>13^h1>>>22^h1<<30^h1<<19^h1<<10)) | 0;
		}
		h[0]+=h0; h[1]+=h1; h[2]+=h2; h[3]+=h3;
		h[4]+=h4; h[5]+=h5; h[6]+=h6; h[7]+=h7;
	},

	update_word_big_endian:function(word) {
		var bb;
		if ((bb = this.bits_buffered)) {
			this.word_buffer.push(word>>>(32-bb) ^ this.bit_buffer);
			this.bit_buffer = word << bb;
		} else {
			this.word_buffer.push(word);
		}
		this.length += 32;
		if (this.length == 0) this.length_upper ++; // mmhm..
		if (this.word_buffer.length == 16) {
			this.block(this.word_buffer);
			this.word_buffer = [];
		}
	},

	update_word_little_endian:function(word) {
		word = word >>> 16 ^ word << 16;
		word = ((word>>>8) & 0xFF00FF) ^ ((word<<8) & 0xFF00FF00);
		this.update_word_big_endian(word);
	},

	update_words_big_endian: function(words) { 
		for (var i=0; i<words.length; i++) this.update_word_big_endian(words[i]);
	},

	update_words_little_endian: function(words) { 
		for (var i=0; i<words.length; i++) this.update_word_little_endian(words[i]);
	},

	update_byte : function(b) {
		this.bit_buffer ^= (b & 0xff) << (24 - (this.bits_buffered));
		this.bits_buffered += 8;
		if (this.bits_buffered == 32) {
			this.bits_buffered = 0; 
			this.update_word_big_endian(this.bit_buffer);
			this.bit_buffer = 0;
		}
	},

	update_string:function(string) {
		throw new cjct.error("not yet implemented");
	},

	finalize:function() {
		var i, wb = this.word_buffer;

		wb.push(this.bit_buffer ^ (0x1 << (31 - this.bits_buffered)));
		for (i = (wb.length + 2); i & 15; i++) {
			wb.push(0);
		}
    
		wb.push(this.length_upper);
		wb.push(this.length + this.bits_buffered);
	    while (wb.length) {
	        this.block(wb.splice(0,16));
	    }

		var h = this.h;
		this.initialize();
		return h;
	}
}

sha256.hash_words_big_endian = function(words) {
	var s = new sha256();
	for ( var i = 0; i <= words.length - 16; i += 16) {
		s.block(words.slice(i, i + 16));
	}
	s.length = i << 5; // so don't pass this function more than 128M words
	if (i < words.length) {
		s.update_words_little_endian(words.slice(i));
	}
	return s.finalize();
}

sha256.hash_words_little_endian = function(words) {
	var w = words.slice(0);
	for ( var i = 0; i < w.length; i++) {
		w[i] = w[i] >>> 16 ^ w[i] << 16;
		w[i] = ((w[i] >>> 8) & 0xFF00FF) ^ ((w[i] << 8) & 0xFF00FF00);
	}
	return sha256.hash_words_big_endian(w);
}
;
// seedrandom.js version 2.0.
// Author: David Bau 4/2/2011
//
// Defines a method Math.seedrandom() that, when called, substitutes
// an explicitly seeded RC4-based algorithm for Math.random().  Also
// supports automatic seeding from local or network sources of entropy.
//
// Usage:
//
//   <script src=http://davidbau.com/encode/seedrandom-min.js></script>
//
//   Math.seedrandom('yipee'); Sets Math.random to a function that is
//                             initialized using the given explicit seed.
//
//   Math.seedrandom();        Sets Math.random to a function that is
//                             seeded using the current time, dom state,
//                             and other accumulated local entropy.
//                             The generated seed string is returned.
//
//   Math.seedrandom('yowza', true);
//                             Seeds using the given explicit seed mixed
//                             together with accumulated entropy.
//
//   <script src="http://bit.ly/srandom-512"></script>
//                             Seeds using physical random bits downloaded
//                             from random.org.
//
//   <script src="https://jsonlib.appspot.com/urandom?callback=Math.seedrandom">
//   </script>                 Seeds using urandom bits from call.jsonlib.com,
//                             which is faster than random.org.
//
// Examples:
//
//   Math.seedrandom("hello");            // Use "hello" as the seed.
//   document.write(Math.random());       // Always 0.5463663768140734
//   document.write(Math.random());       // Always 0.43973793770592234
//   var rng1 = Math.random;              // Remember the current prng.
//
//   var autoseed = Math.seedrandom();    // New prng with an automatic seed.
//   document.write(Math.random());       // Pretty much unpredictable.
//
//   Math.random = rng1;                  // Continue "hello" prng sequence.
//   document.write(Math.random());       // Always 0.554769432473455
//
//   Math.seedrandom(autoseed);           // Restart at the previous seed.
//   document.write(Math.random());       // Repeat the 'unpredictable' value.
//
// Notes:
//
// Each time seedrandom('arg') is called, entropy from the passed seed
// is accumulated in a pool to help generate future seeds for the
// zero-argument form of Math.seedrandom, so entropy can be injected over
// time by calling seedrandom with explicit data repeatedly.
//
// On speed - This javascript implementation of Math.random() is about
// 3-10x slower than the built-in Math.random() because it is not native
// code, but this is typically fast enough anyway.  Seeding is more expensive,
// especially if you use auto-seeding.  Some details (timings on Chrome 4):
//
// Our Math.random()            - avg less than 0.002 milliseconds per call
// seedrandom('explicit')       - avg less than 0.5 milliseconds per call
// seedrandom('explicit', true) - avg less than 2 milliseconds per call
// seedrandom()                 - avg about 38 milliseconds per call
//
// LICENSE (BSD):
//
// Copyright 2010 David Bau, all rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
// 
//   1. Redistributions of source code must retain the above copyright
//      notice, this list of conditions and the following disclaimer.
//
//   2. Redistributions in binary form must reproduce the above copyright
//      notice, this list of conditions and the following disclaimer in the
//      documentation and/or other materials provided with the distribution.
// 
//   3. Neither the name of this module nor the names of its contributors may
//      be used to endorse or promote products derived from this software
//      without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
/**
 * All code is in an anonymous closure to keep the global namespace clean.
 *
 * @param {number=} overflow 
 * @param {number=} startdenom
 */
(function (pool, math, width, chunks, significance, overflow, startdenom) {


//
// seedrandom()
// This is the seedrandom function described above.
//
math['seedrandom'] = function seedrandom(seed, use_entropy) {
  var key = [];
  var arc4;

  // Flatten the seed string or build one from local entropy if needed.
  seed = mixkey(flatten(
    use_entropy ? [seed, pool] :
    arguments.length ? seed :
    [new Date().getTime(), pool, window], 3), key);

  // Use the seed to initialize an ARC4 generator.
  arc4 = new ARC4(key);

  // Mix the randomness into accumulated entropy.
  mixkey(arc4.S, pool);

  // Override Math.random

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.

  math['random'] = function random() {  // Closure to return a random double:
    var n = arc4.g(chunks);             // Start with a numerator n < 2 ^ 48
    var d = startdenom;                 //   and denominator d = 2 ^ 48.
    var x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  // Return the seed that was used
  return seed;
};

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
/** @constructor */
function ARC4(key) {
  var t, u, me = this, keylen = key.length;
  var i = 0, j = me.i = me.j = me.m = 0;
  me.S = [];
  me.c = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) { me.S[i] = i++; }
  for (i = 0; i < width; i++) {
    t = me.S[i];
    j = lowbits(j + t + key[i % keylen]);
    u = me.S[j];
    me.S[i] = u;
    me.S[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  me.g = function getnext(count) {
    var s = me.S;
    var i = lowbits(me.i + 1); var t = s[i];
    var j = lowbits(me.j + t); var u = s[j];
    s[i] = u;
    s[j] = t;
    var r = s[lowbits(t + u)];
    while (--count) {
      i = lowbits(i + 1); t = s[i];
      j = lowbits(j + t); u = s[j];
      s[i] = u;
      s[j] = t;
      r = r * width + s[lowbits(t + u)];
    }
    me.i = i;
    me.j = j;
    return r;
  };
  // For robust unpredictability discard an initial batch of values.
  // See http://www.rsa.com/rsalabs/node.asp?id=2009
  me.g(width);
}

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
/** @param {Object=} result 
  * @param {string=} prop
  * @param {string=} typ */
function flatten(obj, depth, result, prop, typ) {
  result = [];
  typ = typeof(obj);
  if (depth && typ == 'object') {
    for (prop in obj) {
      if (prop.indexOf('S') < 5) {    // Avoid FF3 bug (local/sessionStorage)
        try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
      }
    }
  }
  return (result.length ? result : obj + (typ != 'string' ? '\0' : ''));
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
/** @param {number=} smear 
  * @param {number=} j */
function mixkey(seed, key, smear, j) {
  seed += '';                         // Ensure the seed is a string
  smear = 0;
  for (j = 0; j < seed.length; j++) {
    key[lowbits(j)] =
      lowbits((smear ^= key[lowbits(j)] * 19) + seed.charCodeAt(j));
  }
  seed = '';
  for (j in key) { seed += String.fromCharCode(key[j]); }
  return seed;
}

//
// lowbits()
// A quick "n mod width" for width a power of 2.
//
function lowbits(n) { return n & (width - 1); }

//
// The following constants are related to IEEE 754 limits.
//
startdenom = math.pow(width, chunks);
significance = math.pow(2, significance);
overflow = significance * 2;

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to intefere with determinstic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

// End anonymous scope, and pass initial values.
})(
  [],   // pool: entropy pool starts empty
  Math, // math: package containing random, pow, and seedrandom
  256,  // width: each RC4 output is 0 <= x < 256
  6,    // chunks: at least six RC4 outputs for each double
  52    // significance: there are 52 significant digits in a double
);
;
/* 
 jsCrypto
 
 * random.js -- cryptographic random number generator
 * Mike Hamburg, 2008.  Public domain.
 *
 * This generator uses a modified version of Fortuna.  Fortuna has
 * excellent resilience to compromise, relies on a state file, and is
 * intended to run for a long time.  As such, it does not need an
 * entropy estimator.  Unfortunately, Fortuna's startup in low-entropy
 * conditions leaves much to be desired.
 *
 * This generator features the following modifications.  First, the
 * generator does not create the n-th entropy pool until it exhausts
 * the n-1-st.  This means that entropy doesn't get "stuck" in pools
 * 10-31, which will never be used on a typical webpage.  It also
 * means that the entropy will all go into a single pool until the
 * generator is seeded.
 *
 * Second, there is a very crude entropy estimator.  The primary goal
 * of this estimator is to prevent the generator from being used in
 * low-entropy situations.  Corresponding to this entropy estimator,
 * there is a "paranoia control".  This controls how many bits of
 * estimated entropy must be present before the generator is used.
 * The generator cannot have more than 256 bits of actual entropy in
 * the main pool; rather, the paranoia control is designed to deal
 * with the fact that the entropy estimator is probably horrible.
 *
 * Third, the "statefile" is optional and stored in a cookie.  As
 * such, it is not protected from multiple simultaneous usage, and so
 * is treated conservatively.
 */

random = {
	/* public */
	NOT_READY: 0,
	READY: 1,
	REQUIRES_RESEED: 2,
	

		/* generate one random word */
	randomWord : function(paranoia) {
		return this.random_words(1, paranoia)[0];
	},

	/* generate nwords random words, and return them in an array */
	randomWords : function(nwords, paranoia) {
		var out = [], i, readiness = this.isReady(paranoia);

		if (readiness & this.NOT_READY)
			throw ("random: generator isn't seeded!");
		else if (readiness & this.REQUIRES_RESEED)
			this._reseedFromPools(!(readiness & this.READY));

		for (i = 0; i < nwords; i += 4) {
			if ((i + 1) % this._max_words_per_burst == 0)
				this._gate();

			var g = this._gen_4_words();
			out.push(g[0], g[1], g[2], g[3]);
		}
		this._gate();

		return out.slice(0, nwords);
	},

	setDefaultParanoia : function(paranoia) {
		this._default_paranoia = paranoia;
	},
	
	/* Add entropy to the pools.  Pass data as an array, number or
	 * string.  Pass estimated_entropy in bits.  Pass the source as a
	 * number or string.
	 */
	addEntropy : function(data, estimated_entropy, source) {
		source = source || "user";

		var id = this._collector_ids[source]
				|| (this._collector_ids[source] = this._collector_id_next++);

		var i, ty = 0;
		var t = (new Date()).valueOf();

		var robin = this._robins[source];
		if (robin == undefined) {
			robin = this._robins[source] = 0;
		}
		this._robins[source] = (this._robins[source] + 1) % this._pools.length;

		switch (typeof (data)) {

		case "number":
			data = [ data ];
			ty = 1;
			break;

		case "object":
			if (!estimated_entropy) {
				/* horrible entropy estimator */
				estimated_entropy = 0;
				for (i = 0; i < data.length; i++) {
					var x = data[i];
					while (x > 0) {
						estimated_entropy++;
						x = x >>> 1;
					}
				}
			}
			this._pools[robin].update_words_big_endian([ id, this._event_id++,
					ty || 2, estimated_entropy, t, data.length ].concat(data));
			break;

		case "string":
			if (!estimated_entropy) {
				/*
				 * English text has just over 1 bit per character of entropy.
				 * But this might be HTML or something, and have far less
				 * entropy than English... Oh well, let's just say one bit.
				 */
				estimated_entropy = data.length;
			}
			this._pools[robin].update_words_big_endian([ id, this._event_id++,
					3, estimated_entropy, t, data.length ]);
			this._pools[robin].update_string(data);
			break;

		default:
			throw new cjct.error("invalid argument");
		}
	
		var old_ready = this.isReady();

		/* record the new strength */
		this._pool_entropy[robin] += estimated_entropy;
		this._pool_strength += estimated_entropy;

		/* fire off events */
		if (old_ready == this.NOT_READY && this.isReady() != this.NOT_READY)
			this._fireEvent("seeded", Math.max(this._strength,
					this._pool_strength));

		if (old_ready == this.NOT_READY)
			this._fireEvent("progress", this.getProgress());
	},
	
	/* is the generator ready? */
	isReady : function(paranoia) {
		var entropy_required = this._PARANOIA_LEVELS[paranoia ? paranoia : this._default_paranoia];
		var result;

		if (this._strength && this._strength >= entropy_required) {
			result = (this._pool_entropy[0] > this._BITS_PER_RESEED && (new Date())
					.valueOf() > this._next_reseed) ? this.REQUIRES_RESEED
					| this.READY : this.READY;
		} else {
			result = (this._pool_strength > entropy_required) ? this.REQUIRES_RESEED
					| this.NOT_READY
					: this.NOT_READY;
		}

		return result;
	},
	
	/* how close to ready is it? */
	getProgress : function(paranoia) {
		var entropy_required = this._PARANOIA_LEVELS[paranoia ? paranoia : this._default_paranoia];

		if (this._strength >= entropy_required) {
			return 1.0;
		} else {
			return (this._pool_strength > entropy_required) ? 1.0
					: this._pool_strength / entropy_required;
		}
	},
	
	/* start the built-in entropy collectors */
	startCollectors : function() {
		if (this._collectors_started)
			return;

		if (window.addEventListener) {
			window.addEventListener("load", this._loadTimeCollector, false);
			window.addEventListener("mousemove", this._mouseCollector, false);
		} else if (document.attachEvent) {
			document.attachEvent("onload", this._loadTimeCollector);
			document.attachEvent("onmousemove", this._mouseCollector);
		} else
			throw ("can't attach event");

		this._collectors_started = true;
	},
	
	/* stop the built-in entropy collectors */
	stopCollectors : function() {
		if (!this._collectors_started)
			return;

		if (window.removeEventListener) {
			window.removeEventListener("load", this._loadTimeCollector);
			window.removeEventListener("mousemove", this._mouseCollector);
		} else if (window.detachEvent) {
			window.detachEvent("onload", this._loadTimeCollector);
			window.detachEvent("onmousemove", this._mouseCollector);
		}
		this._collectors_started = false;
	},
	
	/* add an event listener for progress or seeded-ness */
	addEventListener : function(name, callback) {
		this._callbacks[name][this._callback_i++] = callback;
	},
	
	/* remove an event listener for progress or seeded-ness */
	removeEventListener : function(name, cb) {
		var i, j, cbs = this._callbacks[name], js_temp = [];

		/*
		 * I'm not sure if this is necessary; in C++, iterating over a
		 * collection and modifying it at the same time is a no-no.
		 */
		for (j in cbs)
			if (cbs.hasOwnProperty[j] && cbs[j] === cb)
				js_temp.push(j);

		for (i = 0; i < js_temp.length; i++) {
			j = js[i];
			delete cbs[j];
		}
	},
	
	/* private */
	_pools                   : [new sha256()],
	_pool_entropy            : [0],
	_reseed_count            : 0,
	_robins                  : {},
	_event_id                : 0,
	
	_collector_ids           : {},
	_collector_id_next       : 0,
	
	_strength                : 0,
	_pool_strength           : 0,
	_next_reseed             : 0,
	_key                     : [0,0,0,0,0,0,0,0],
	_counter                 : [0,0,0,0],
	_cipher                  : undefined,
	_default_paranoia        : 6,
	
	/* event listener stuff */
	_collectors_started      : false,
	_callbacks               : {progress: {}, seeded: {}},
	_callback_i              : 0,
	
	/* constants */
	_MAX_WORDS_PER_BURST     : 65536,
	_PARANOIA_LEVELS         : [0,48,64,96,128,192,256,384,512,768,1024],
	_MILLISECONDS_PER_RESEED : 100,
	_BITS_PER_RESEED         : 80,
	
	/* generate 4 random words, no reseed, no gate */
	_gen_4_words : function() {
		var words = [];
		for ( var i = 0; i < 3; i++)
			if (++this._counter[i])
				break;
		this._cipher.encrypt(this._counter, words);
		return words;
	},
	
	/* rekey the AES instance with itself after a request, or every _MAX_WORDS_PER_BURST words */
	_gate : function() {
		this._key = this._gen_4_words().concat(this._gen_4_words());
		this._cipher = new aes(this._key);
	},

	/* reseed the generator with the given words */
	_reseed : function(seedWords) {
		this._key = sha256.hash_words_big_endian(this._key.concat(seedWords));
		this._cipher = new aes(this._key);
		for ( var i = 0; i < 3; i++)
			if (++this._counter[i])
				break;
	},
	
	/* reseed the data from the entropy pools */
	_reseedFromPools : function(full) {
		var reseed_data = [], strength = 0;

		this._next_reseed = (new Date()).valueOf()
				+ this._MILLISECONDS_PER_RESEED;

		for (var i = 0; i < this._pools.length; i++) {
			reseed_data = reseed_data.concat(this._pools[i].finalize());
			strength += this._pool_entropy[i];
			this._pool_entropy[i] = 0;

			if (!full && (this._reseed_count & (1 << i)))
				break;
		}

		/* if we used the last pool, push a new one onto the stack */
		if (this._reseed_count >= 1 << this._pools.length) {
			this._pools.push(new sha256());
			this._pool_entropy.push(0);
		}

		/* how strong was this reseed? */
		this._pool_strength -= strength;
		if (strength > this._strength)
			this._strength = strength;

		this._reseed_count++;
		this._reseed(reseed_data);
	},

	_mouseCollector : function(ev) {
		var x = ev.x || ev.clientX || ev.offsetX;
		var y = ev.y || ev.clientY || ev.offsetY;
		random.addEntropy([ x, y ], 2, "mouse");
	},

	_loadTimeCollector : function(ev) {
		var d = new Date();
		random.addEntropy(d, 2, "loadtime");
	},

	_fireEvent : function(name, arg) {
		var j, cbs = random._callbacks[name], cbs_temp = [];

		/* I'm not sure if this is necessary; in C++, iterating over a
		 * collection and modifying it at the same time is a no-no.
		 */
		for (j in cbs) {
			if (cbs.hasOwnProperty(j)) {
				cbs_temp.push(cbs[j]);
			}
		}

		for (j = 0; j < cbs_temp.length; j++) {
			cbs_temp[j](arg);
		}
	}
};

;
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

;
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
	
	/* Pseudo-random number generator. */
	random : random,
	
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

;
function createXMLHttp() 
{
 if (typeof XMLHttpRequest != "undefined") {
   return new XMLHttpRequest();
  }
 else if (window.ActiveXObject) 
 {
  var aVersions = ["MSXML2.XMLHttp.5.0","MSXML2.XMLHttp.4.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp","Microsoft.XMLHttp"];
  
  for (var i = 0; i < aVersions.length; i++) 
  {
   try
   {
    var oXmlHttp = new ActiveXObject(aVersions[i]);
    return oXmlHttp;
   }
   catch(oError)
   {
    throw new Error("XMLHttp object could be created.");
   }
  }
 }
 throw new Error("XMLHttp object could be created.");
}


// Extract PIN from User's secret
function extractPIN(aPin, clientSecretHex, identity, onSuccess)
{
  var tokenHex = _MPinToken(aPin, clientSecretHex, identity);
  onSuccess(tokenHex) 
};

// Generate the MPin Token
function _MPinToken(aPin, clientSecretHex, identity)
{
  var pin = aPin
  var clientSecretStr = hex2pointFormat(clientSecretHex);
  var clientSecret = new ecc.point.fromString(clientSecretStr, idak._curve);

  var IDc = util.bytesToUnicode(util.bitsToBytes(util.hexToBitsNew(identity)));

  var point = idak._hashToPoint1(util.unicodeToBytes(IDc));
  var token = clientSecret.sub(point.smul(parseInt(pin,10))).toString(); /* 2 inversions */
  var tokenHex = pointFormat2hex(token);
  return tokenHex;
};

// Input Base64 point on curve in format 04|x|y 
// Output [x,y]
function reset_format(point) 
{
  var point2 = util.bitsToBytes(util.stringToBits(point));
  point2 = util.fixBytesLen(point2, 2 * idak.FS + 1);
  var x = point2.slice(1, idak.FS + 1);
  x = util.bitsToString(util.bytesToBits(x));
  var y = point2.slice(idak.FS + 1);
  y = util.bitsToString(util.bytesToBits(y));
  return "[" + x + "," + y + "]";
};

// Input hex point on curve in format 04|x|y 
// Output [x,y]
function hex2pointFormat(point) 
{
  var point2 = util.bitsToBytes(util.hexToBitsNew(point));
  point2 = util.fixBytesLen(point2, 2 * idak.FS + 1);
  var x = point2.slice(1, idak.FS + 1);
  x = util.bitsToString(util.bytesToBits(x));
  var y = point2.slice(idak.FS + 1);
  y = util.bitsToString(util.bytesToBits(y));
  return "[" + x + "," + y + "]";
};

// Input [x,y]
// Output Base64 point on curve in format 04|x|y 
function change_format(point) {
  var position = point.indexOf(",");
  var x = util.bitsToBytes(util.stringToBits(point.substring(1, position)));
  var y = util.bitsToBytes(util.stringToBits(point.substring(position + 1, point.length - 1)));
  x = util.fixBytesLen(x, idak.FS);
  y = util.fixBytesLen(y, idak.FS);
  var point2 = [4];
  point2 = point2.concat(x).concat(y);
  return util.bitsToString(util.bytesToBits(point2));
};

// Input [x,y]
// Output hex point on curve in format 04|x|y 
function pointFormat2hex(point) {
  var position = point.indexOf(",");
  var x = util.bitsToBytes(util.stringToBits(point.substring(1, position)));
  var y = util.bitsToBytes(util.stringToBits(point.substring(position + 1, point.length - 1)));
  x = util.fixBytesLen(x, idak.FS);
  y = util.fixBytesLen(y, idak.FS);
  var point2 = [4];
  point2 = point2.concat(x).concat(y);
  return util.bitsToHexNew(util.bytesToBits(point2));
};



// Request authToken for authServer and send to Customer web app.
function getAuthToken(wsURL, IDcustomer, identity, timePermitHex, tokenHex, requestOTP, accessNumber, seedValueHex, aPin, verifyTokenURL, authTokenFormatter, customHeaders, handleToken, onVerifySuccess)
{


  // Generate random x value
  var x = _randomX(seedValueHex);

  var IDcHex = identity;

 // Open web socket to Auth Server.
  var wsOK = false;
  var useAJAX = false;

  setTimeout(function(){
    if (!wsOK) {
      if (!useAJAX) {
        useAJAX = true;
        console.error("Websocket connection timeout. Will use AJAX.");
        handleToken(false, "WEBSOCKETERROR", "WEB SOCKET ERROR");
      }
    }
  }, 5000)


  var authServerSocket = new WebSocket(wsURL);

  authServerSocket.onerror = function(event){
    authServerSocket.close();
    useAJAX = true;
    handleToken(false, "WEBSOCKETERROR", "WEB SOCKET ERROR");

    return;
  };

  authServerSocket.onopen = function () {
    var request = _pass1Request(x, IDcHex);
    // PASS1 REQUEST
    authServerSocket.send(JSON.stringify(request));
  }

  authServerSocket.onclose = function () {
  }

  authServerSocket.onmessage = function(event) {
      var response = JSON.parse(event.data);
      if (response.pass == 1)
	{
          wsOK = true;

          if (useAJAX)
            return;
	  
          // Compute PASS2 request
	  var request = _pass2Request(x, response.y, IDcHex, timePermitHex, tokenHex, requestOTP, accessNumber, aPin);

          // PASS2 REQUEST
          authServerSocket.send(JSON.stringify(request));
	}
      else if (response.pass == 2) 
        {
          var response = JSON.parse(event.data);
          // Send the response from the MPin server to the RP
          authServerSocket.close();
          sendAuthToken(verifyTokenURL,response, handleToken, authTokenFormatter, customHeaders, onVerifySuccess);
        }
      else
	{
          authServerSocket.close();
	}
  }
};

// Request authToken for authServer and send to Customer web app using websocketProxy.
function getAuthTokenAjax(restURL, IDcustomer, identity, timePermitHex, tokenHex, requestOTP, accessNumber, seedValueHex, aPin, verifyTokenURL, authTokenFormatter, customHeaders, handleToken, onVerifySuccess)
{

  var rURL = (restURL.mpin_endsWith("/")) ? restURL.slice(0, restURL.length-1) : restURL;
  rURL = restURL.split("/authenticationToken").join("")
  
  var urlSplit = rURL.split("://")
  if (urlSplit[0] == "wss")
    urlSplit[0] = "https";
  else if (urlSplit[0] == "ws")
    urlSplit[0] = "http";

  rURL = urlSplit.join("://")
  var restURLPass1 = rURL + "/pass1";
  var restURLPass2 = rURL + "/pass2";

  var xhrPass1 = createXMLHttp();

// Generate random x value
  var x = _randomX(seedValueHex);
  var IDcHex = identity;

  // Form request body
  var request1 = _pass1Request(x, IDcHex);
  var postData1 = JSON.stringify(request1);
  var requestDataType = 'application/json';


  xhrPass1.onreadystatechange=function(evtXHR){
      if (xhrPass1.readyState == 4) {
        if (xhrPass1.status == 200) {
          var jsonText1 = xhrPass1.responseText;
          var response1 = JSON.parse(jsonText1);

          // Compute PASS2 request
          var request2 = _pass2Request(x, response1.y, IDcHex, timePermitHex, tokenHex, requestOTP, accessNumber, aPin);
          request2.IDc = IDcHex;
          var postData2 = JSON.stringify(request2);

          // PASS2 REQUEST
          var xhrPass2 = createXMLHttp();

          xhrPass2.onreadystatechange=function(evtXHR){
            if (xhrPass2.readyState == 4) {
              if (xhrPass2.status == 200) {
                var jsonText2 = xhrPass2.responseText;
                var response2 = JSON.parse(jsonText2);

                sendAuthToken(verifyTokenURL, response2, handleToken, authTokenFormatter, customHeaders, onVerifySuccess);

                }
              else {
                // ERROR PASS 2
                console.error("Error PASS2 on Ajax Authentication Request: " + xmlhttpPass2.status)

                }
              } //readystate
            } //onreadystate

          xhrPass2.open("POST", restURLPass2, true);
          xhrPass2.setRequestHeader("Content-Type",requestDataType);

          for (var headerKey in customHeaders) { 
            xhrPass2.setRequestHeader(headerKey, customHeaders[headerKey]);
          }  
          xhrPass2.send(postData2);

        } else {
          // ERROR PASS 1
          console.error("Error PASS1 on Ajax Authentication Request: " + xmlhttpAuthToken.status)
        }
      }
    }

  xhrPass1.open("POST", restURLPass1, true);
  xhrPass1.setRequestHeader("Content-Type",requestDataType);
  for (var headerKey in customHeaders) { 
    xhrPass1.setRequestHeader(headerKey, customHeaders[headerKey]);
  }  
  xhrPass1.send(postData1);
};

// Send Authentication token to RP server
function sendAuthToken(restURL, mpinResponse, handleToken, authTokenFormatter, customHeaders, onVerifySuccess)
{
  var requestDataType = 'application/json';
  var xmlhttpAuthToken;

  // Declare data
  var jsonObj = {"mpinResponse":mpinResponse};

  if (authTokenFormatter)
    jsonObj = authTokenFormatter(jsonObj)


  // Sting
  var postData = JSON.stringify(jsonObj);

  var xmlhttpAuthToken = createXMLHttp()

  xmlhttpAuthToken.onreadystatechange=function(evtXHR)
  {
  if (xmlhttpAuthToken.readyState == 4)
    {
      if (xmlhttpAuthToken.status == 200)
        {
          var jsonText = xmlhttpAuthToken.responseText;
          var response = JSON.parse(jsonText);

          if (onVerifySuccess)
             onVerifySuccess(response)

          handleToken(true, "OK", "Authenticated", response);
        }
      else if (xmlhttpAuthToken.status == 401)
      {
        handleToken(false, "INVALID", "INVALID PIN");
      } 
      else if (xmlhttpAuthToken.status == 403)
      {
        handleToken(false, "NOTAUTHORIZED", "You are not authorized!");
      } 
      else if (xmlhttpAuthToken.status == 410)
      {
        handleToken(false, "MAXATTEMPTS", "Max Attempts Reached");
      }
      else if (xmlhttpAuthToken.status == 412)
      {
        handleToken(false, "INVALIDACCESSNUMBER", "Invalid Access Number");
      }
      else
      {
        handleToken(false, "INVOCATION", "Invocation Errors Occured " + xmlhttpAuthToken.readyState + " and the status is " + xmlhttpAuthToken.status);
      }
    }
  };
  xmlhttpAuthToken.open("POST",restURL,true);
  xmlhttpAuthToken.setRequestHeader("Content-Type",requestDataType);
  for (var headerKey in customHeaders) { 
    xmlhttpAuthToken.setRequestHeader(headerKey, customHeaders[headerKey]);
  }  
  xmlhttpAuthToken.send(postData);
};



function requestSignature(userID, mobile, signatureURL, customHeaders, onSuccess, onFail)
{
  var requestDataType = 'application/json';
  var restURL = signatureURL + "?userid=" + encodeURIComponent(userID)+"&mobile="+mobile;

  var xmlhttpSecret = createXMLHttp();

  xmlhttpSecret.onreadystatechange=function(evtXHR)
    {
      if (xmlhttpSecret.readyState == 4)
        {
          if (xmlhttpSecret.status == 200)
            {
              var jsonText = xmlhttpSecret.responseText;
              var response = JSON.parse(jsonText);
              onSuccess(response)
          }
          else if (xmlhttpSecret.status == 401 || xmlhttpSecret.status == 403)
          {
              // var jsonText = xmlhttpSecret.responseText;
              // var response = JSON.parse(jsonText);
              
              onFail("Error getting the mpin signature", xmlhttpSecret.status)
          }
         else
           {
              onFail("Error getting the mpin signature", xmlhttpSecret.status)
           }
        }
    }
  xmlhttpSecret.open("GET", restURL, true);
  xmlhttpSecret.setRequestHeader("Content-Type",requestDataType);
  for (var headerKey in customHeaders) { 
    xmlhttpSecret.setRequestHeader(headerKey, customHeaders[headerKey]);
  }    
  xmlhttpSecret.send();
};


function requestRegister(registerURL, mpinid, customHeaders, postDataFormatter, onSuccess, onFail)
{
    if (! postDataFormatter) {
      postDataFormatter = function(data){ return data}
    }

    var postData = JSON.stringify(postDataFormatter({identity: mpinid}))
      
    var xmlhttpRegister = createXMLHttp()
    xmlhttpRegister.onreadystatechange=function(evtXHR) {
    if (xmlhttpRegister.readyState == 4)
      {
        if (xmlhttpRegister.status == 200)
          {     
            onSuccess()
          }
        else
        {
          onFail(xmlhttpRegister.responseText, xmlhttpRegister.status)
        } 
      }
  };
  xmlhttpRegister.open("POST", registerURL, true);
  xmlhttpRegister.setRequestHeader("Content-Type", "application/json");
  for (var headerKey in customHeaders) { 
    xmlhttpRegister.setRequestHeader(headerKey, customHeaders[headerKey]);
  }    

  xmlhttpRegister.send(postData);
};

//same as RequestRPSJSON
// usage like function just call
function requestRPS (params, cb) {
	var _request = new XMLHttpRequest(), _method, _postData;
	_method = params.method || "GET";
	
	params.postDataFormatter || (params.postDataFormatter = function (data) {return data;});
	//
	_postData = JSON.stringify(params.postDataFormatter(params.data));
	
	_request.onreadystatechange = function () {
		if (_request.readyState === 4) {
			if (_request.status === 200) {
				cb(_request.responseText ? JSON.parse(_request.responseText): {});
			} else {
				var _errorData = {};
				_errorData.error = _request.responseText;
				_errorData.errorStatus = _request.status;
				cb(_errorData);
			}
		}
	};
	
	_request.open(_method, params.URL, true);
	_request.setRequestHeader("Content-Type", "application/json");
	if (params.customHeaders) {
		for (var headerKey in params.customHeaders) { 
			_request.setRequestHeader(headerKey, params.customHeaders[headerKey]);
		}
	}
	_request.send(_postData);
};

function RequestRPSJSON(params) {
  // Params: URL, method, data, customHeaders, postDataFormatter, timeout, onSuccess, onFail, onTimeout
  var postData;
  var method = params.method || "GET"

  if (method == "GET") 
    postData = null
  else {
    if (! params.postDataFormatter) {
      params.postDataFormatter = function(data){ return data}
    }

    postData = JSON.stringify(params.postDataFormatter(params.data))
  }

  var xhr = createXMLHttp()
  if (params.timeout) {
    xhr.timeout = params.timeout;
  }

  xhr.onreadystatechange=function(evtXHR) {
    if (xhr.readyState == 4)
      {
        if (xhr.status == 200)
          {     
              if (params.onSuccess) {
                var response = xhr.responseText ? JSON.parse(xhr.responseText) : {};
                params.onSuccess(response)
              }
          }
        else
        {
          if (params.onFail) {
            params.onFail(xhr.status, xhr.responseText)
          }
        } 
      }
  };

  if (params.onTimeout) {
    xhr.ontimeout = function(){ params.onTimeout() }
  }

  xhr.open(method, params.URL, true);
  xhr.myURL = params.URL;
  xhr.setRequestHeader("Content-Type", "application/json");
  if (params.customHeaders) {
    for (var headerKey in params.customHeaders) { 
      xhr.setRequestHeader(headerKey, params.customHeaders[headerKey]);
    }    
  }
  xhr.send(postData);

  this.abortRequest = function(){
    params.onFail = null;
    xhr.abort();
  }

  return this
};


// Request Client Secret from a TA.
function requestClientSecretShare(restURL, onSuccess, onFail)
{
  var xmlhttpClientSecret;
  var requestDataType = 'application/json';

  var xmlhttpClientSecret = createXMLHttp()
  xmlhttpClientSecret.onreadystatechange=function(evtXHR)
    {
      if (xmlhttpClientSecret.readyState == 4)
        {
          if (xmlhttpClientSecret.status == 200)
            {
              var jsonText = xmlhttpClientSecret.responseText;
              var response = JSON.parse(jsonText);
              onSuccess(response.clientSecret)
    	    }
          else if (xmlhttpClientSecret.status == 401 || xmlhttpClientSecret.status == 403)
    	    {
              var jsonText = xmlhttpClientSecret.responseText;
              var response = JSON.parse(jsonText);

              onFail("Error getting the client secret: " + xmlhttpClientSecret.status, xmlhttpClientSecret.status)
    	    }
         else
           {
              onFail("Error getting the client secret: " + xmlhttpClientSecret.status, xmlhttpClientSecret.status)
           }
        }
    }
  xmlhttpClientSecret.open("GET", restURL, true);
  xmlhttpClientSecret.setRequestHeader("Content-Type",requestDataType);

  xmlhttpClientSecret.send();
};

// Request the Client Secret Share and add them to form ClientSecret
function requestClientSecret(certivoxURL, clientSecretShare, onSuccess, onFail)
{
  // Get Client Secret Share from Certivox TA
  // n.b. Not a mobile request
//  var certivoxURL = certivoxURL+"&mobile=0"; 
  requestClientSecretShare(certivoxURL, function(certivoxShare){

    // Get Client Secret Share from Application TA
    //--// requestClientSecretShare(MPinDTAServerURL, customHeaders, function(appShare){

      // Add secret shares to form Client Secret
      
      var clientSecretHex = addShares(certivoxShare, clientSecretShare);

      // Callback
      onSuccess(clientSecretHex);
    //--// }, onFail);

  }, onFail);

};


// Add two points on the curve that are originally in hex format
function addShares(share1Hex, share2Hex)
{
  // Convert to ecc point
  var share1Str = hex2pointFormat(share1Hex);
  var share1 = new ecc.point.fromString(share1Str, idak._curve);

  // Convert to ecc point
  var share2Str = hex2pointFormat(share2Hex);
  var share2 = new ecc.point.fromString(share2Str, idak._curve);

  // Add shares to form whole value
  var wholeStr = share1.add(share2).toString();
  var wholeHex = pointFormat2hex(wholeStr);  
  return wholeHex;
}



MPIN_LOADED = true;



// Request Time Permit Share from a TA.
// TODO WHAT HAPPENS FOR 401, 403 or 500 errors
function requestTimePermitShare(restURL, customHeaders, onSuccess, onFail)
{
  var xmlhttpTimePermit;
  var requestDataType = 'application/json';

  var xmlhttpTimePermit = createXMLHttp()
  xmlhttpTimePermit.onreadystatechange=function(evtXHR)
    {
      if (xmlhttpTimePermit.readyState == 4)
        {
          if (xmlhttpTimePermit.status == 200)
            {
              var jsonText = xmlhttpTimePermit.responseText;
              var response = JSON.parse(jsonText);

              onSuccess(response.timePermit)
    	    }
          else if (xmlhttpTimePermit.status == 403)
    	    {
              var jsonText = xmlhttpTimePermit.responseText;
              var response = JSON.parse(jsonText);
              onFail(response, xmlhttpTimePermit.status)
    	    }
         else
           {
             var jsonText = xmlhttpTimePermit.responseText;
             var response = JSON.parse(jsonText);
             onFail(response, xmlhttpTimePermit.status)
           }
        }
    }
  xmlhttpTimePermit.open("GET", restURL, true);
  xmlhttpTimePermit.setRequestHeader("Content-Type",requestDataType);
  for (var headerKey in customHeaders) { 
    xmlhttpTimePermit.setRequestHeader(headerKey, customHeaders[headerKey]);
  }    

  xmlhttpTimePermit.send();
};


// Request the Time Permit Shares and add them to form TimePermit
function requestTimePermit(certivoxURL, MPinDTAServerURL, customHeaders, onSuccess, onFail)
{
  // Get Time Permit Share from Certivox TA
  // n.b. Not a mobile request
  requestTimePermitShare(certivoxURL, {}, function(certivoxShare){
    // Get Time Permit Share from Application TA
    requestTimePermitShare(MPinDTAServerURL, {}, function(appShare){
      // Add shares to form Time Permit
      var timePermitHex = addShares(certivoxShare, appShare);


      // Callback
      onSuccess(timePermitHex);

    }, onFail);

  }, onFail);
};

// Calculate random value x used in both passes
function _randomX(seedValueHex)
{
  var seedValue = util.bitsToBytes(util.hexToBitsNew(seedValueHex));
  cjct.random.addEntropy(seedValue);
  var x=idak.getSecret();
  return x;
}

// Calculate the body for the PASS1 request
function _pass1Request(x, IDcHex)
{
  // Get client ID
  var IDc = util.bytesToUnicode(util.bitsToBytes(util.hexToBitsNew(IDcHex)));

  // Get parameters for protocol
  var hashID=idak._hashToPoint1(util.unicodeToBytes(IDc)); 
  var hashTpID=idak._hashToPoint1(util.wordToBytes(util.today()).concat(util.unicodeToBytes(IDc))); 

  // compute U
  var U=idak.computeMPin_1x(hashID,x);
  var UHex=pointFormat2hex(U);

  // compute UT
  var UT=idak.computeMPin_1c(hashID,hashTpID,x);
  var UTHex=pointFormat2hex(UT);

  var request = {
    IDc: IDcHex,
    UT: UTHex,
    U: UHex,
    pass: 1
  }

  return request;
};


// Calculate the body for the PASS2 request
function _pass2Request(x, yHex, IDcHex, timePermitHex, tokenHex, requestOTP, accessNumber, PIN)
{
  // Get client ID
  var IDc = util.bytesToUnicode(util.bitsToBytes(util.hexToBitsNew(IDcHex)));

  // Hash ID to point on curve
  var hashID=idak._hashToPoint1(util.unicodeToBytes(IDc)); 

  var timePermit = hex2pointFormat(timePermitHex);
  var token = hex2pointFormat(tokenHex);

  // Compute V
  var y=new bn(util.bitsToHex(util.hexToBitsNew(yHex)));
  var r=idak._curve.r;
  var m = y.add(x).mod(r);
  m=r.sub(m).normalize();
  V=idak.computeMPin_1b(hashID, m, PIN, token, timePermit);
  var VHex=pointFormat2hex(V);

  var request = {
    V: VHex,
    OTP: requestOTP,
    WID: accessNumber,
    pass: 2
  }

  return request;
};

// PASS 1  
function pass1(restURL, identity, timePermitHex, tokenHex, requestOTP, accessNumber, seedValueHex, aPin, verifyTokenURL, authTokenFormatter, customHeaders, handleToken, onVerifySuccess)
{

  // Generate random x value
  var x = _randomX(seedValueHex);

  var IDcHex = identity;

  // Form request body
  var request = _pass1Request(x, IDcHex);
  var postData = JSON.stringify(request);

  var ajaxRequest;
  var requestDataType = 'application/json';

  if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
      ajaxRequest=new XMLHttpRequest();
    }
  else
    {// code for IE6, IE5
      ajaxRequest=new ActiveXObject("Microsoft.XMLHTTP");
    }

  ajaxRequest.onreadystatechange=function(evtXHR)
    {
      if (ajaxRequest.readyState == 4)
        {
          if (ajaxRequest.status == 200)
            {
              var jsonText = ajaxRequest.responseText;
              var response = JSON.parse(jsonText);
              pass2(restURL, x, response.y, IDcHex, timePermitHex, tokenHex, requestOTP, accessNumber, aPin, verifyTokenURL, authTokenFormatter, customHeaders, handleToken, onVerifySuccess);
    	    }
          else if (ajaxRequest.status == 500)
    	    {
    	    }
          else
            {
            }
        }
    }
  ajaxRequest.open("POST", restURL, true);
  ajaxRequest.setRequestHeader("Content-Type",requestDataType);
  ajaxRequest.send(postData);
};



// PASS 2  
function pass2(restURL, x, y, IDcHex, timePermitHex, tokenHex, requestOTP, accessNumber, aPin, verifyTokenURL, authTokenFormatter, customHeaders, handleToken, onVerifySuccess)
{

  // Form request body
  var request =  _pass2Request(x, y, IDcHex, timePermitHex, tokenHex, requestOTP, accessNumber, aPin);
  request.IDc = IDcHex;
  var postData = JSON.stringify(request);

  var ajaxRequest;
  var requestDataType = 'application/json';

  if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
      ajaxRequest=new XMLHttpRequest();
    }
  else
    {// code for IE6, IE5
      ajaxRequest=new ActiveXObject("Microsoft.XMLHTTP");
    }

  ajaxRequest.onreadystatechange=function(evtXHR)
    {
      if (ajaxRequest.readyState == 4)
        {
          if (ajaxRequest.status == 200)
            {
              var jsonText = ajaxRequest.responseText;
              var response = JSON.parse(jsonText);
              sendAuthToken(verifyTokenURL,response, handleToken, authTokenFormatter, customHeaders, onVerifySuccess);
    	    }
          else if (ajaxRequest.status == 500)
    	    {
    	    }
          else
            {
            }
        }
    }
  ajaxRequest.open("POST", restURL, true);
  ajaxRequest.setRequestHeader("Content-Type",requestDataType);
  ajaxRequest.send(postData);
};

;
