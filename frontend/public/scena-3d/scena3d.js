/* EwolucJA — scena 3D (planeta). Źródła: frontend/scena-3d-src/. NIE EDYTOWAĆ RĘCZNIE. */
globalThis.SCENA3D_POSTACIE=globalThis.SCENA3D_POSTACIE||{adventurer:{plik:"adventurer",klipy:{NlaTrack:"walk","NlaTrack.001":"run","NlaTrack.002":"idle","NlaTrack.003":"happy"},tempo:{}},fox:{plik:"fox",klipy:{NlaTrack:"run","NlaTrack.001":"walk","NlaTrack.002":"idle","NlaTrack.003":"happy"},tempo:{run:1.29},wyglad:{tint:.85,env:.38}}};globalThis.__SCENA3D_POSTAC=function(){let s=globalThis.SCENA3D_POSTAC||"adventurer";return globalThis.SCENA3D_POSTACIE[s]||{plik:s,klipy:null,tempo:{}}};function Du(){return globalThis.__SCENA3D_POSTAC()}var hh="169";var zp=0,Nu=1,Pp=2;var ef=1,uh=2,qn=3,kn=0,He=1,ue=2,yi=0,Ms=1,zn=2,Uu=3,Uo=4,Ip=5,Ui=100,kp=101,Lp=102,Dp=103,Np=104,Up=200,Op=201,Fp=202,Bp=203,Vc=204,Gc=205,Hp=206,Vp=207,Gp=208,Wp=209,Xp=210,qp=211,Kp=212,Yp=213,Zp=214,Wc=0,Xc=1,qc=2,Ts=3,Kc=4,Yc=5,Zc=6,jc=7,dh=0,jp=1,Jp=2,_i=0,$p=1,Qp=2,tm=3,fh=4,em=5,nm=6,im=7,Ou="attached",sm="detached",nf=300,Es=301,Rs=302,_r=303,Jc=304,Ma=306,Ln=1e3,Yn=1001,xr=1002,Be=1003,ph=1004;var ys=1005;var en=1006,ur=1007;var In=1008;var jn=1009,sf=1010,rf=1011,vr=1012,mh=1013,Bi=1014,Cn=1015,Lr=1016,gh=1017,yh=1018,Cs=1020,of=35902,af=1021,cf=1022,gn=1023,lf=1024,hf=1025,bs=1026,zs=1027,_h=1028,xh=1029,uf=1030,vh=1031;var wh=1033,Po=33776,Io=33777,ko=33778,Lo=33779,$c=35840,Qc=35841,tl=35842,el=35843,nl=36196,il=37492,sl=37496,rl=37808,ol=37809,al=37810,cl=37811,ll=37812,hl=37813,ul=37814,dl=37815,fl=37816,pl=37817,ml=37818,gl=37819,yl=37820,_l=37821,Do=36492,xl=36494,vl=36495,df=36283,wl=36284,Ml=36285,bl=36286,Mh=2200,rm=2201,om=2202,Ps=2300,Is=2301,rc=2302,_s=2400,xs=2401,Oo=2402,bh=2500,ff=2501,pf=0,ba=1,Dr=2,am=3200,cm=3201;var Sh=0,lm=1,pi="",Yt="srgb",Le="srgb-linear",Ah="display-p3",Sa="display-p3-linear",Fo="linear",he="srgb",Bo="rec709",Ho="p3";var $i=7680;var Fu=519,hm=512,um=513,dm=514,mf=515,fm=516,pm=517,mm=518,gm=519,Sl=35044,gf=35048;var Bu="300 es",Zn=2e3,Vo=2001,Jn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let i=this._listeners[t];if(i!==void 0){let r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}},Oe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Hu=1234567,dr=Math.PI/180,ks=180/Math.PI;function yn(){let s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Oe[s&255]+Oe[s>>8&255]+Oe[s>>16&255]+Oe[s>>24&255]+"-"+Oe[t&255]+Oe[t>>8&255]+"-"+Oe[t>>16&15|64]+Oe[t>>24&255]+"-"+Oe[e&63|128]+Oe[e>>8&255]+"-"+Oe[e>>16&255]+Oe[e>>24&255]+Oe[n&255]+Oe[n>>8&255]+Oe[n>>16&255]+Oe[n>>24&255]).toLowerCase()}function Ie(s,t,e){return Math.max(t,Math.min(e,s))}function Th(s,t){return(s%t+t)%t}function ym(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function _m(s,t,e){return s!==t?(e-s)/(t-s):0}function fr(s,t,e){return(1-e)*s+e*t}function xm(s,t,e,n){return fr(s,t,1-Math.exp(-e*n))}function vm(s,t=1){return t-Math.abs(Th(s,t*2)-t)}function wm(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function Mm(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function bm(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Sm(s,t){return s+Math.random()*(t-s)}function Am(s){return s*(.5-Math.random())}function Tm(s){s!==void 0&&(Hu=s);let t=Hu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Em(s){return s*dr}function Rm(s){return s*ks}function Cm(s){return(s&s-1)===0&&s!==0}function zm(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Pm(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Im(s,t,e,n,i){let r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),d=o((t-n)/2),f=r((n-t)/2),p=o((n-t)/2);switch(i){case"XYX":s.set(a*h,c*u,c*d,a*l);break;case"YZY":s.set(c*d,a*h,c*u,a*l);break;case"ZXZ":s.set(c*u,c*d,a*h,a*l);break;case"XZX":s.set(a*h,c*p,c*f,a*l);break;case"YXY":s.set(c*f,a*h,c*p,a*l);break;case"ZYZ":s.set(c*p,c*f,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Rn(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function se(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}var yf={DEG2RAD:dr,RAD2DEG:ks,generateUUID:yn,clamp:Ie,euclideanModulo:Th,mapLinear:ym,inverseLerp:_m,lerp:fr,damp:xm,pingpong:vm,smoothstep:wm,smootherstep:Mm,randInt:bm,randFloat:Sm,randFloatSpread:Am,seededRandom:Tm,degToRad:Em,radToDeg:Rm,isPowerOfTwo:Cm,ceilPowerOfTwo:zm,floorPowerOfTwo:Pm,setQuaternionFromProperEuler:Im,normalize:se,denormalize:Rn},rt=class s{constructor(t=0,e=0){s.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ot=class s{constructor(t,e,n,i,r,o,a,c,l){s.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,c,l)}set(t,e,n,i,r,o,a,c,l){let h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],p=n[8],y=i[0],m=i[3],g=i[6],v=i[1],_=i[4],w=i[7],C=i[2],A=i[5],E=i[8];return r[0]=o*y+a*v+c*C,r[3]=o*m+a*_+c*A,r[6]=o*g+a*w+c*E,r[1]=l*y+h*v+u*C,r[4]=l*m+h*_+u*A,r[7]=l*g+h*w+u*E,r[2]=d*y+f*v+p*C,r[5]=d*m+f*_+p*A,r[8]=d*g+f*w+p*E,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+i*r*l-i*o*c}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,d=a*c-h*r,f=l*r-o*c,p=e*u+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/p;return t[0]=u*y,t[1]=(i*l-h*n)*y,t[2]=(a*n-i*o)*y,t[3]=d*y,t[4]=(h*e-i*c)*y,t[5]=(i*r-a*e)*y,t[6]=f*y,t[7]=(n*c-l*e)*y,t[8]=(o*e-n*r)*y,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-i*l,i*c,-i*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(oc.makeScale(t,e)),this}rotate(t){return this.premultiply(oc.makeRotation(-t)),this}translate(t,e){return this.premultiply(oc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},oc=new Ot;function _f(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function wr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function km(){let s=wr("canvas");return s.style.display="block",s}var Vu={};function No(s){s in Vu||(Vu[s]=!0,console.warn(s))}function Lm(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function Dm(s){let t=s.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Nm(s){let t=s.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}var Gu=new Ot().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Wu=new Ot().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),$s={[Le]:{transfer:Fo,primaries:Bo,luminanceCoefficients:[.2126,.7152,.0722],toReference:s=>s,fromReference:s=>s},[Yt]:{transfer:he,primaries:Bo,luminanceCoefficients:[.2126,.7152,.0722],toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[Sa]:{transfer:Fo,primaries:Ho,luminanceCoefficients:[.2289,.6917,.0793],toReference:s=>s.applyMatrix3(Wu),fromReference:s=>s.applyMatrix3(Gu)},[Ah]:{transfer:he,primaries:Ho,luminanceCoefficients:[.2289,.6917,.0793],toReference:s=>s.convertSRGBToLinear().applyMatrix3(Wu),fromReference:s=>s.applyMatrix3(Gu).convertLinearToSRGB()}},Um=new Set([Le,Sa]),Qt={enabled:!0,_workingColorSpace:Le,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!Um.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;let n=$s[t].toReference,i=$s[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return $s[s].primaries},getTransfer:function(s){return s===pi?Fo:$s[s].transfer},getLuminanceCoefficients:function(s,t=this._workingColorSpace){return s.fromArray($s[t].luminanceCoefficients)}};function Ss(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ac(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var Qi,Al=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Qi===void 0&&(Qi=wr("canvas")),Qi.width=t.width,Qi.height=t.height;let n=Qi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Qi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=wr("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Ss(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ss(e[n]/255)*255):e[n]=Ss(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Om=0,Go=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Om++}),this.uuid=yn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(cc(i[o].image)):r.push(cc(i[o]))}else r=cc(i);n.url=r}return e||(t.images[this.uuid]=n),n}};function cc(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Al.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Fm=0,ke=class s extends Jn{constructor(t=s.DEFAULT_IMAGE,e=s.DEFAULT_MAPPING,n=Yn,i=Yn,r=en,o=In,a=gn,c=jn,l=s.DEFAULT_ANISOTROPY,h=pi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Fm++}),this.uuid=yn(),this.name="",this.source=new Go(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new rt(0,0),this.repeat=new rt(1,1),this.center=new rt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ot,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==nf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ln:t.x=t.x-Math.floor(t.x);break;case Yn:t.x=t.x<0?0:1;break;case xr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ln:t.y=t.y-Math.floor(t.y);break;case Yn:t.y=t.y<0?0:1;break;case xr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};ke.DEFAULT_IMAGE=null;ke.DEFAULT_MAPPING=nf;ke.DEFAULT_ANISOTROPY=1;var jt=class s{constructor(t=0,e=0,n=0,i=1){s.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r,c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],p=c[9],y=c[2],m=c[6],g=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-y)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+y)<.1&&Math.abs(p+m)<.1&&Math.abs(l+f+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let _=(l+1)/2,w=(f+1)/2,C=(g+1)/2,A=(h+d)/4,E=(u+y)/4,z=(p+m)/4;return _>w&&_>C?_<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(_),i=A/n,r=E/n):w>C?w<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(w),n=A/i,r=z/i):C<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(C),n=E/r,i=z/r),this.set(n,i,r,e),this}let v=Math.sqrt((m-p)*(m-p)+(u-y)*(u-y)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(m-p)/v,this.y=(u-y)/v,this.z=(d-h)/v,this.w=Math.acos((l+f+g-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Tl=class extends Jn{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new jt(0,0,t,e),this.scissorTest=!1,this.viewport=new jt(0,0,t,e);let i={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:en,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new ke(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new Go(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},$n=class extends Tl{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Wo=class extends ke{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Be,this.minFilter=Be,this.wrapR=Yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var El=class extends ke{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Be,this.minFilter=Be,this.wrapR=Yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ft=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3],d=r[o+0],f=r[o+1],p=r[o+2],y=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=p,t[e+3]=y;return}if(u!==y||c!==d||l!==f||h!==p){let m=1-a,g=c*d+l*f+h*p+u*y,v=g>=0?1:-1,_=1-g*g;if(_>Number.EPSILON){let C=Math.sqrt(_),A=Math.atan2(C,g*v);m=Math.sin(m*A)/C,a=Math.sin(a*A)/C}let w=a*v;if(c=c*m+d*w,l=l*m+f*w,h=h*m+p*w,u=u*m+y*w,m===1-a){let C=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=C,l*=C,h*=C,u*=C}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,r,o){let a=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=r[o],d=r[o+1],f=r[o+2],p=r[o+3];return t[e]=a*p+h*u+c*f-l*d,t[e+1]=c*p+h*d+l*u-a*f,t[e+2]=l*p+h*f+a*d-c*u,t[e+3]=h*p-a*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(i/2),u=a(r/2),d=c(n/2),f=c(i/2),p=c(r/2);switch(o){case"XYZ":this._x=d*h*u+l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u+d*f*p;break;case"YZX":this._x=d*h*u+l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u-d*f*p;break;case"XZY":this._x=d*h*u-l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u+d*f*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(o-i)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-c)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+l)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-l)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(c+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-i)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ie(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+i*l-r*c,this._y=i*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-i*a,this._w=o*h-n*a-i*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,i=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+i*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*i+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},M=class s{constructor(t=0,e=0,n=0){s.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Xu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Xu.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*i-a*n),h=2*(a*e-r*i),u=2*(r*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=i+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=i*c-r*a,this.y=r*o-n*c,this.z=n*a-i*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return lc.copy(this).projectOnVector(t),this.sub(lc)}reflect(t){return this.sub(lc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},lc=new M,Xu=new Ft,Ee=class{constructor(t=new M(1/0,1/0,1/0),e=new M(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(An.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(An.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=An.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,An):An.fromBufferAttribute(r,o),An.applyMatrix4(t.matrixWorld),this.expandByPoint(An);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),$r.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),$r.copy(n.boundingBox)),$r.applyMatrix4(t.matrixWorld),this.union($r)}let i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,An),An.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Qs),Qr.subVectors(this.max,Qs),ts.subVectors(t.a,Qs),es.subVectors(t.b,Qs),ns.subVectors(t.c,Qs),ci.subVectors(es,ts),li.subVectors(ns,es),zi.subVectors(ts,ns);let e=[0,-ci.z,ci.y,0,-li.z,li.y,0,-zi.z,zi.y,ci.z,0,-ci.x,li.z,0,-li.x,zi.z,0,-zi.x,-ci.y,ci.x,0,-li.y,li.x,0,-zi.y,zi.x,0];return!hc(e,ts,es,ns,Qr)||(e=[1,0,0,0,1,0,0,0,1],!hc(e,ts,es,ns,Qr))?!1:(to.crossVectors(ci,li),e=[to.x,to.y,to.z],hc(e,ts,es,ns,Qr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,An).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(An).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Bn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Bn=[new M,new M,new M,new M,new M,new M,new M,new M],An=new M,$r=new Ee,ts=new M,es=new M,ns=new M,ci=new M,li=new M,zi=new M,Qs=new M,Qr=new M,to=new M,Pi=new M;function hc(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Pi.fromArray(s,r);let a=i.x*Math.abs(Pi.x)+i.y*Math.abs(Pi.y)+i.z*Math.abs(Pi.z),c=t.dot(Pi),l=e.dot(Pi),h=n.dot(Pi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var Bm=new Ee,tr=new M,uc=new M,cn=class{constructor(t=new M,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Bm.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;tr.subVectors(t,this.center);let e=tr.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(tr,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(uc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(tr.copy(t.center).add(uc)),this.expandByPoint(tr.copy(t.center).sub(uc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},Hn=new M,dc=new M,eo=new M,hi=new M,fc=new M,no=new M,pc=new M,Hi=class{constructor(t=new M,e=new M(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Hn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Hn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Hn.copy(this.origin).addScaledVector(this.direction,e),Hn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){dc.copy(t).add(e).multiplyScalar(.5),eo.copy(e).sub(t).normalize(),hi.copy(this.origin).sub(dc);let r=t.distanceTo(e)*.5,o=-this.direction.dot(eo),a=hi.dot(this.direction),c=-hi.dot(eo),l=hi.lengthSq(),h=Math.abs(1-o*o),u,d,f,p;if(h>0)if(u=o*c-a,d=o*a-c,p=r*h,u>=0)if(d>=-p)if(d<=p){let y=1/h;u*=y,d*=y,f=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d<=-p?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=p?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(dc).addScaledVector(eo,d),f}intersectSphere(t,e){Hn.subVectors(t.center,this.origin);let n=Hn.dot(this.direction),i=Hn.dot(Hn)-n*n,r=t.radius*t.radius;if(i>r)return null;let o=Math.sqrt(r-i),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,i=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,i=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||a>i)||((a>n||n!==n)&&(n=a),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,Hn)!==null}intersectTriangle(t,e,n,i,r){fc.subVectors(e,t),no.subVectors(n,t),pc.crossVectors(fc,no);let o=this.direction.dot(pc),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;hi.subVectors(this.origin,t);let c=a*this.direction.dot(no.crossVectors(hi,no));if(c<0)return null;let l=a*this.direction.dot(fc.cross(hi));if(l<0||c+l>o)return null;let h=-a*hi.dot(pc);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Rt=class s{constructor(t,e,n,i,r,o,a,c,l,h,u,d,f,p,y,m){s.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,c,l,h,u,d,f,p,y,m)}set(t,e,n,i,r,o,a,c,l,h,u,d,f,p,y,m){let g=this.elements;return g[0]=t,g[4]=e,g[8]=n,g[12]=i,g[1]=r,g[5]=o,g[9]=a,g[13]=c,g[2]=l,g[6]=h,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=y,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new s().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,i=1/is.setFromMatrixColumn(t,0).length(),r=1/is.setFromMatrixColumn(t,1).length(),o=1/is.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=o*h,f=o*u,p=a*h,y=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+p*l,e[5]=d-y*l,e[9]=-a*c,e[2]=y-d*l,e[6]=p+f*l,e[10]=o*c}else if(t.order==="YXZ"){let d=c*h,f=c*u,p=l*h,y=l*u;e[0]=d+y*a,e[4]=p*a-f,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-p,e[6]=y+d*a,e[10]=o*c}else if(t.order==="ZXY"){let d=c*h,f=c*u,p=l*h,y=l*u;e[0]=d-y*a,e[4]=-o*u,e[8]=p+f*a,e[1]=f+p*a,e[5]=o*h,e[9]=y-d*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){let d=o*h,f=o*u,p=a*h,y=a*u;e[0]=c*h,e[4]=p*l-f,e[8]=d*l+y,e[1]=c*u,e[5]=y*l+d,e[9]=f*l-p,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){let d=o*c,f=o*l,p=a*c,y=a*l;e[0]=c*h,e[4]=y-d*u,e[8]=p*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=f*u+p,e[10]=d-y*u}else if(t.order==="XZY"){let d=o*c,f=o*l,p=a*c,y=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+y,e[5]=o*h,e[9]=f*u-p,e[2]=p*u-f,e[6]=a*h,e[10]=y*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Hm,t,Vm)}lookAt(t,e,n){let i=this.elements;return on.subVectors(t,e),on.lengthSq()===0&&(on.z=1),on.normalize(),ui.crossVectors(n,on),ui.lengthSq()===0&&(Math.abs(n.z)===1?on.x+=1e-4:on.z+=1e-4,on.normalize(),ui.crossVectors(n,on)),ui.normalize(),io.crossVectors(on,ui),i[0]=ui.x,i[4]=io.x,i[8]=on.x,i[1]=ui.y,i[5]=io.y,i[9]=on.y,i[2]=ui.z,i[6]=io.z,i[10]=on.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],p=n[2],y=n[6],m=n[10],g=n[14],v=n[3],_=n[7],w=n[11],C=n[15],A=i[0],E=i[4],z=i[8],N=i[12],x=i[1],S=i[5],k=i[9],I=i[13],F=i[2],j=i[6],B=i[10],Q=i[14],W=i[3],lt=i[7],ot=i[11],vt=i[15];return r[0]=o*A+a*x+c*F+l*W,r[4]=o*E+a*S+c*j+l*lt,r[8]=o*z+a*k+c*B+l*ot,r[12]=o*N+a*I+c*Q+l*vt,r[1]=h*A+u*x+d*F+f*W,r[5]=h*E+u*S+d*j+f*lt,r[9]=h*z+u*k+d*B+f*ot,r[13]=h*N+u*I+d*Q+f*vt,r[2]=p*A+y*x+m*F+g*W,r[6]=p*E+y*S+m*j+g*lt,r[10]=p*z+y*k+m*B+g*ot,r[14]=p*N+y*I+m*Q+g*vt,r[3]=v*A+_*x+w*F+C*W,r[7]=v*E+_*S+w*j+C*lt,r[11]=v*z+_*k+w*B+C*ot,r[15]=v*N+_*I+w*Q+C*vt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],p=t[3],y=t[7],m=t[11],g=t[15];return p*(+r*c*u-i*l*u-r*a*d+n*l*d+i*a*f-n*c*f)+y*(+e*c*f-e*l*d+r*o*d-i*o*f+i*l*h-r*c*h)+m*(+e*l*u-e*a*f-r*o*u+n*o*f+r*a*h-n*l*h)+g*(-i*a*h-e*c*u+e*a*d+i*o*u-n*o*d+n*c*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],p=t[12],y=t[13],m=t[14],g=t[15],v=u*m*l-y*d*l+y*c*f-a*m*f-u*c*g+a*d*g,_=p*d*l-h*m*l-p*c*f+o*m*f+h*c*g-o*d*g,w=h*y*l-p*u*l+p*a*f-o*y*f-h*a*g+o*u*g,C=p*u*c-h*y*c-p*a*d+o*y*d+h*a*m-o*u*m,A=e*v+n*_+i*w+r*C;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let E=1/A;return t[0]=v*E,t[1]=(y*d*r-u*m*r-y*i*f+n*m*f+u*i*g-n*d*g)*E,t[2]=(a*m*r-y*c*r+y*i*l-n*m*l-a*i*g+n*c*g)*E,t[3]=(u*c*r-a*d*r-u*i*l+n*d*l+a*i*f-n*c*f)*E,t[4]=_*E,t[5]=(h*m*r-p*d*r+p*i*f-e*m*f-h*i*g+e*d*g)*E,t[6]=(p*c*r-o*m*r-p*i*l+e*m*l+o*i*g-e*c*g)*E,t[7]=(o*d*r-h*c*r+h*i*l-e*d*l-o*i*f+e*c*f)*E,t[8]=w*E,t[9]=(p*u*r-h*y*r-p*n*f+e*y*f+h*n*g-e*u*g)*E,t[10]=(o*y*r-p*a*r+p*n*l-e*y*l-o*n*g+e*a*g)*E,t[11]=(h*a*r-o*u*r-h*n*l+e*u*l+o*n*f-e*a*f)*E,t[12]=C*E,t[13]=(h*y*i-p*u*i+p*n*d-e*y*d-h*n*m+e*u*m)*E,t[14]=(p*a*i-o*y*i-p*n*c+e*y*c+o*n*m-e*a*m)*E,t[15]=(o*u*i-h*a*i+h*n*c-e*u*c-o*n*d+e*a*d)*E,this}scale(t){let e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-i*c,l*c+i*a,0,l*a+i*c,h*a+n,h*c-i*o,0,l*c-i*a,h*c+i*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,d=r*l,f=r*h,p=r*u,y=o*h,m=o*u,g=a*u,v=c*l,_=c*h,w=c*u,C=n.x,A=n.y,E=n.z;return i[0]=(1-(y+g))*C,i[1]=(f+w)*C,i[2]=(p-_)*C,i[3]=0,i[4]=(f-w)*A,i[5]=(1-(d+g))*A,i[6]=(m+v)*A,i[7]=0,i[8]=(p+_)*E,i[9]=(m-v)*E,i[10]=(1-(d+y))*E,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements,r=is.set(i[0],i[1],i[2]).length(),o=is.set(i[4],i[5],i[6]).length(),a=is.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],Tn.copy(this);let l=1/r,h=1/o,u=1/a;return Tn.elements[0]*=l,Tn.elements[1]*=l,Tn.elements[2]*=l,Tn.elements[4]*=h,Tn.elements[5]*=h,Tn.elements[6]*=h,Tn.elements[8]*=u,Tn.elements[9]*=u,Tn.elements[10]*=u,e.setFromRotationMatrix(Tn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,i,r,o,a=Zn){let c=this.elements,l=2*r/(e-t),h=2*r/(n-i),u=(e+t)/(e-t),d=(n+i)/(n-i),f,p;if(a===Zn)f=-(o+r)/(o-r),p=-2*o*r/(o-r);else if(a===Vo)f=-o/(o-r),p=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=p,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=Zn){let c=this.elements,l=1/(e-t),h=1/(n-i),u=1/(o-r),d=(e+t)*l,f=(n+i)*h,p,y;if(a===Zn)p=(o+r)*u,y=-2*u;else if(a===Vo)p=r*u,y=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=y,c[14]=-p,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},is=new M,Tn=new Rt,Hm=new M(0,0,0),Vm=new M(1,1,1),ui=new M,io=new M,on=new M,qu=new Rt,Ku=new Ft,ln=class s{constructor(t=0,e=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,r=i[0],o=i[4],a=i[8],c=i[1],l=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(Ie(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ie(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ie(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ie(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Ie(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Ie(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return qu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(qu,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ku.setFromEuler(this),this.setFromQuaternion(Ku,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ln.DEFAULT_ORDER="XYZ";var Mr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Gm=0,Yu=new M,ss=new Ft,Vn=new Rt,so=new M,er=new M,Wm=new M,Xm=new Ft,Zu=new M(1,0,0),ju=new M(0,1,0),Ju=new M(0,0,1),$u={type:"added"},qm={type:"removed"},rs={type:"childadded",child:null},mc={type:"childremoved",child:null},pe=class s extends Jn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Gm++}),this.uuid=yn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let t=new M,e=new ln,n=new Ft,i=new M(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Rt},normalMatrix:{value:new Ot}}),this.matrix=new Rt,this.matrixWorld=new Rt,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Mr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ss.setFromAxisAngle(t,e),this.quaternion.multiply(ss),this}rotateOnWorldAxis(t,e){return ss.setFromAxisAngle(t,e),this.quaternion.premultiply(ss),this}rotateX(t){return this.rotateOnAxis(Zu,t)}rotateY(t){return this.rotateOnAxis(ju,t)}rotateZ(t){return this.rotateOnAxis(Ju,t)}translateOnAxis(t,e){return Yu.copy(t).applyQuaternion(this.quaternion),this.position.add(Yu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Zu,t)}translateY(t){return this.translateOnAxis(ju,t)}translateZ(t){return this.translateOnAxis(Ju,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Vn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?so.copy(t):so.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),er.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Vn.lookAt(er,so,this.up):Vn.lookAt(so,er,this.up),this.quaternion.setFromRotationMatrix(Vn),i&&(Vn.extractRotation(i.matrixWorld),ss.setFromRotationMatrix(Vn),this.quaternion.premultiply(ss.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent($u),rs.child=t,this.dispatchEvent(rs),rs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(qm),mc.child=t,this.dispatchEvent(mc),mc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Vn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Vn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Vn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent($u),rs.child=t,this.dispatchEvent(rs),rs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(er,t,Wm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(er,Xm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];i.animations.push(r(t.animations,c))}}if(e){let a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),p=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}};pe.DEFAULT_UP=new M(0,1,0);pe.DEFAULT_MATRIX_AUTO_UPDATE=!0;pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var En=new M,Gn=new M,gc=new M,Wn=new M,os=new M,as=new M,Qu=new M,yc=new M,_c=new M,xc=new M,vc=new jt,wc=new jt,Mc=new jt,mi=class s{constructor(t=new M,e=new M,n=new M){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),En.subVectors(t,e),i.cross(En);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){En.subVectors(i,e),Gn.subVectors(n,e),gc.subVectors(t,e);let o=En.dot(En),a=En.dot(Gn),c=En.dot(gc),l=Gn.dot(Gn),h=Gn.dot(gc),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(l*c-a*h)*d,p=(o*h-a*c)*d;return r.set(1-f-p,p,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Wn)===null?!1:Wn.x>=0&&Wn.y>=0&&Wn.x+Wn.y<=1}static getInterpolation(t,e,n,i,r,o,a,c){return this.getBarycoord(t,e,n,i,Wn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Wn.x),c.addScaledVector(o,Wn.y),c.addScaledVector(a,Wn.z),c)}static getInterpolatedAttribute(t,e,n,i,r,o){return vc.setScalar(0),wc.setScalar(0),Mc.setScalar(0),vc.fromBufferAttribute(t,e),wc.fromBufferAttribute(t,n),Mc.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(vc,r.x),o.addScaledVector(wc,r.y),o.addScaledVector(Mc,r.z),o}static isFrontFacing(t,e,n,i){return En.subVectors(n,e),Gn.subVectors(t,e),En.cross(Gn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return En.subVectors(this.c,this.b),Gn.subVectors(this.a,this.b),En.cross(Gn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return s.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return s.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return s.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return s.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return s.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,r=this.c,o,a;os.subVectors(i,n),as.subVectors(r,n),yc.subVectors(t,n);let c=os.dot(yc),l=as.dot(yc);if(c<=0&&l<=0)return e.copy(n);_c.subVectors(t,i);let h=os.dot(_c),u=as.dot(_c);if(h>=0&&u<=h)return e.copy(i);let d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(os,o);xc.subVectors(t,r);let f=os.dot(xc),p=as.dot(xc);if(p>=0&&f<=p)return e.copy(r);let y=f*l-c*p;if(y<=0&&l>=0&&p<=0)return a=l/(l-p),e.copy(n).addScaledVector(as,a);let m=h*p-f*u;if(m<=0&&u-h>=0&&f-p>=0)return Qu.subVectors(r,i),a=(u-h)/(u-h+(f-p)),e.copy(i).addScaledVector(Qu,a);let g=1/(m+y+d);return o=y*g,a=d*g,e.copy(n).addScaledVector(os,o).addScaledVector(as,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},xf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},di={h:0,s:0,l:0},ro={h:0,s:0,l:0};function bc(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}var et=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Yt){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Qt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=Qt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Qt.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=Qt.workingColorSpace){if(t=Th(t,1),e=Ie(e,0,1),n=Ie(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=bc(o,r,t+1/3),this.g=bc(o,r,t),this.b=bc(o,r,t-1/3)}return Qt.toWorkingColorSpace(this,i),this}setStyle(t,e=Yt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Yt){let n=xf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ss(t.r),this.g=Ss(t.g),this.b=Ss(t.b),this}copyLinearToSRGB(t){return this.r=ac(t.r),this.g=ac(t.g),this.b=ac(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Yt){return Qt.fromWorkingColorSpace(Fe.copy(this),t),Math.round(Ie(Fe.r*255,0,255))*65536+Math.round(Ie(Fe.g*255,0,255))*256+Math.round(Ie(Fe.b*255,0,255))}getHexString(t=Yt){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Qt.workingColorSpace){Qt.fromWorkingColorSpace(Fe.copy(this),e);let n=Fe.r,i=Fe.g,r=Fe.b,o=Math.max(n,i,r),a=Math.min(n,i,r),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(i-r)/u+(i<r?6:0);break;case i:c=(r-n)/u+2;break;case r:c=(n-i)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=Qt.workingColorSpace){return Qt.fromWorkingColorSpace(Fe.copy(this),e),t.r=Fe.r,t.g=Fe.g,t.b=Fe.b,t}getStyle(t=Yt){Qt.fromWorkingColorSpace(Fe.copy(this),t);let e=Fe.r,n=Fe.g,i=Fe.b;return t!==Yt?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(di),this.setHSL(di.h+t,di.s+e,di.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(di),t.getHSL(ro);let n=fr(di.h,ro.h,e),i=fr(di.s,ro.s,e),r=fr(di.l,ro.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Fe=new et;et.NAMES=xf;var Km=0,Ze=class extends Jn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Km++}),this.uuid=yn(),this.name="",this.type="Material",this.blending=Ms,this.side=kn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Vc,this.blendDst=Gc,this.blendEquation=Ui,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new et(0,0,0),this.blendAlpha=0,this.depthFunc=Ts,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Fu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=$i,this.stencilZFail=$i,this.stencilZPass=$i,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ms&&(n.blending=this.blending),this.side!==kn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Vc&&(n.blendSrc=this.blendSrc),this.blendDst!==Gc&&(n.blendDst=this.blendDst),this.blendEquation!==Ui&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ts&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Fu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==$i&&(n.stencilFail=this.stencilFail),this.stencilZFail!==$i&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==$i&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(e){let r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},re=class extends Ze{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new et(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=dh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Se=new M,oo=new rt,Te=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Sl,this.updateRanges=[],this.gpuType=Cn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)oo.fromBufferAttribute(this,e),oo.applyMatrix3(t),this.setXY(e,oo.x,oo.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix3(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix4(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyNormalMatrix(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.transformDirection(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Rn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=se(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Rn(e,this.array)),e}setX(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Rn(e,this.array)),e}setY(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Rn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Rn(e,this.array)),e}setW(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),n=se(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),n=se(n,this.array),i=se(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),n=se(n,this.array),i=se(i,this.array),r=se(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Sl&&(t.usage=this.usage),t}};var Xo=class extends Te{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var qo=class extends Te{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var At=class extends Te{constructor(t,e,n){super(new Float32Array(t),e,n)}},Ym=0,mn=new Rt,Sc=new pe,cs=new M,an=new Ee,nr=new Ee,Pe=new M,Jt=class s extends Jn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ym++}),this.uuid=yn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(_f(t)?qo:Xo)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ot().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return mn.makeRotationFromQuaternion(t),this.applyMatrix4(mn),this}rotateX(t){return mn.makeRotationX(t),this.applyMatrix4(mn),this}rotateY(t){return mn.makeRotationY(t),this.applyMatrix4(mn),this}rotateZ(t){return mn.makeRotationZ(t),this.applyMatrix4(mn),this}translate(t,e,n){return mn.makeTranslation(t,e,n),this.applyMatrix4(mn),this}scale(t,e,n){return mn.makeScale(t,e,n),this.applyMatrix4(mn),this}lookAt(t){return Sc.lookAt(t),Sc.updateMatrix(),this.applyMatrix4(Sc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(cs).negate(),this.translate(cs.x,cs.y,cs.z),this}setFromPoints(t){let e=[];for(let n=0,i=t.length;n<i;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new At(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ee);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new M(-1/0,-1/0,-1/0),new M(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let r=e[n];an.setFromBufferAttribute(r),this.morphTargetsRelative?(Pe.addVectors(this.boundingBox.min,an.min),this.boundingBox.expandByPoint(Pe),Pe.addVectors(this.boundingBox.max,an.max),this.boundingBox.expandByPoint(Pe)):(this.boundingBox.expandByPoint(an.min),this.boundingBox.expandByPoint(an.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new cn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new M,1/0);return}if(t){let n=this.boundingSphere.center;if(an.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];nr.setFromBufferAttribute(a),this.morphTargetsRelative?(Pe.addVectors(an.min,nr.min),an.expandByPoint(Pe),Pe.addVectors(an.max,nr.max),an.expandByPoint(Pe)):(an.expandByPoint(nr.min),an.expandByPoint(nr.max))}an.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)Pe.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(Pe));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Pe.fromBufferAttribute(a,l),c&&(cs.fromBufferAttribute(t,l),Pe.add(cs)),i=Math.max(i,n.distanceToSquared(Pe))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,i=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Te(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let z=0;z<n.count;z++)a[z]=new M,c[z]=new M;let l=new M,h=new M,u=new M,d=new rt,f=new rt,p=new rt,y=new M,m=new M;function g(z,N,x){l.fromBufferAttribute(n,z),h.fromBufferAttribute(n,N),u.fromBufferAttribute(n,x),d.fromBufferAttribute(r,z),f.fromBufferAttribute(r,N),p.fromBufferAttribute(r,x),h.sub(l),u.sub(l),f.sub(d),p.sub(d);let S=1/(f.x*p.y-p.x*f.y);isFinite(S)&&(y.copy(h).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(S),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(S),a[z].add(y),a[N].add(y),a[x].add(y),c[z].add(m),c[N].add(m),c[x].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let z=0,N=v.length;z<N;++z){let x=v[z],S=x.start,k=x.count;for(let I=S,F=S+k;I<F;I+=3)g(t.getX(I+0),t.getX(I+1),t.getX(I+2))}let _=new M,w=new M,C=new M,A=new M;function E(z){C.fromBufferAttribute(i,z),A.copy(C);let N=a[z];_.copy(N),_.sub(C.multiplyScalar(C.dot(N))).normalize(),w.crossVectors(A,N);let S=w.dot(c[z])<0?-1:1;o.setXYZW(z,_.x,_.y,_.z,S)}for(let z=0,N=v.length;z<N;++z){let x=v[z],S=x.start,k=x.count;for(let I=S,F=S+k;I<F;I+=3)E(t.getX(I+0)),E(t.getX(I+1)),E(t.getX(I+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Te(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let i=new M,r=new M,o=new M,a=new M,c=new M,l=new M,h=new M,u=new M;if(t)for(let d=0,f=t.count;d<f;d+=3){let p=t.getX(d+0),y=t.getX(d+1),m=t.getX(d+2);i.fromBufferAttribute(e,p),r.fromBufferAttribute(e,y),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,p),c.fromBufferAttribute(n,y),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(y,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Pe.fromBufferAttribute(t,e),Pe.normalize(),t.setXYZ(e,Pe.x,Pe.y,Pe.z)}toNonIndexed(){function t(a,c){let l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h),f=0,p=0;for(let y=0,m=c.length;y<m;y++){a.isInterleavedBufferAttribute?f=c[y]*a.data.stride+a.offset:f=c[y]*h;for(let g=0;g<h;g++)d[p++]=l[f++]}return new Te(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new s,n=this.index.array,i=this.attributes;for(let a in i){let c=i[a],l=t(c,n);e.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){let d=l[h],f=t(d,n);c.push(f)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let i={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){let f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(i[c]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let i=t.attributes;for(let l in i){let h=i[l];this.setAttribute(l,h.clone(e))}let r=t.morphAttributes;for(let l in r){let h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let l=0,h=o.length;l<h;l++){let u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},td=new Rt,Ii=new Hi,ao=new cn,ed=new M,co=new M,lo=new M,ho=new M,Ac=new M,uo=new M,nd=new M,fo=new M,Lt=class extends pe{constructor(t=new Jt,e=new re){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let a=this.morphTargetInfluences;if(r&&a){uo.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=a[c],u=r[c];h!==0&&(Ac.fromBufferAttribute(u,t),o?uo.addScaledVector(Ac,h):uo.addScaledVector(Ac.sub(e),h))}e.add(uo)}return e}raycast(t,e){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ao.copy(n.boundingSphere),ao.applyMatrix4(r),Ii.copy(t.ray).recast(t.near),!(ao.containsPoint(Ii.origin)===!1&&(Ii.intersectSphere(ao,ed)===null||Ii.origin.distanceToSquared(ed)>(t.far-t.near)**2))&&(td.copy(r).invert(),Ii.copy(t.ray).applyMatrix4(td),!(n.boundingBox!==null&&Ii.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ii)))}_computeIntersections(t,e,n){let i,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,y=d.length;p<y;p++){let m=d[p],g=o[m.materialIndex],v=Math.max(m.start,f.start),_=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let w=v,C=_;w<C;w+=3){let A=a.getX(w),E=a.getX(w+1),z=a.getX(w+2);i=po(this,g,t,n,l,h,u,A,E,z),i&&(i.faceIndex=Math.floor(w/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let p=Math.max(0,f.start),y=Math.min(a.count,f.start+f.count);for(let m=p,g=y;m<g;m+=3){let v=a.getX(m),_=a.getX(m+1),w=a.getX(m+2);i=po(this,o,t,n,l,h,u,v,_,w),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(c!==void 0)if(Array.isArray(o))for(let p=0,y=d.length;p<y;p++){let m=d[p],g=o[m.materialIndex],v=Math.max(m.start,f.start),_=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let w=v,C=_;w<C;w+=3){let A=w,E=w+1,z=w+2;i=po(this,g,t,n,l,h,u,A,E,z),i&&(i.faceIndex=Math.floor(w/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let p=Math.max(0,f.start),y=Math.min(c.count,f.start+f.count);for(let m=p,g=y;m<g;m+=3){let v=m,_=m+1,w=m+2;i=po(this,o,t,n,l,h,u,v,_,w),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}};function Zm(s,t,e,n,i,r,o,a){let c;if(t.side===He?c=n.intersectTriangle(o,r,i,!0,a):c=n.intersectTriangle(i,r,o,t.side===kn,a),c===null)return null;fo.copy(a),fo.applyMatrix4(s.matrixWorld);let l=e.ray.origin.distanceTo(fo);return l<e.near||l>e.far?null:{distance:l,point:fo.clone(),object:s}}function po(s,t,e,n,i,r,o,a,c,l){s.getVertexPosition(a,co),s.getVertexPosition(c,lo),s.getVertexPosition(l,ho);let h=Zm(s,t,e,n,co,lo,ho,nd);if(h){let u=new M;mi.getBarycoord(nd,co,lo,ho,u),i&&(h.uv=mi.getInterpolatedAttribute(i,a,c,l,u,new rt)),r&&(h.uv1=mi.getInterpolatedAttribute(r,a,c,l,u,new rt)),o&&(h.normal=mi.getInterpolatedAttribute(o,a,c,l,u,new M),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:c,c:l,normal:new M,materialIndex:0};mi.getNormal(co,lo,ho,d.normal),h.face=d,h.barycoord=u}return h}var je=class s extends Jt{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};let a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],h=[],u=[],d=0,f=0;p("z","y","x",-1,-1,n,e,t,o,r,0),p("z","y","x",1,-1,n,e,-t,o,r,1),p("x","z","y",1,1,t,n,e,i,o,2),p("x","z","y",1,-1,t,n,-e,i,o,3),p("x","y","z",1,-1,t,e,n,i,r,4),p("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new At(l,3)),this.setAttribute("normal",new At(h,3)),this.setAttribute("uv",new At(u,2));function p(y,m,g,v,_,w,C,A,E,z,N){let x=w/E,S=C/z,k=w/2,I=C/2,F=A/2,j=E+1,B=z+1,Q=0,W=0,lt=new M;for(let ot=0;ot<B;ot++){let vt=ot*S-I;for(let Xt=0;Xt<j;Xt++){let Bt=Xt*x-k;lt[y]=Bt*v,lt[m]=vt*_,lt[g]=F,l.push(lt.x,lt.y,lt.z),lt[y]=0,lt[m]=0,lt[g]=A>0?1:-1,h.push(lt.x,lt.y,lt.z),u.push(Xt/E),u.push(1-ot/z),Q+=1}}for(let ot=0;ot<z;ot++)for(let vt=0;vt<E;vt++){let Xt=d+vt+j*ot,Bt=d+vt+j*(ot+1),Z=d+(vt+1)+j*(ot+1),tt=d+(vt+1)+j*ot;c.push(Xt,Bt,tt),c.push(Bt,Z,tt),W+=6}a.addGroup(f,W,N),f+=W,d+=Q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Ls(s){let t={};for(let e in s){t[e]={};for(let n in s[e]){let i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Ye(s){let t={};for(let e=0;e<s.length;e++){let n=Ls(s[e]);for(let i in n)t[i]=n[i]}return t}function jm(s){let t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function vf(s){let t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Qt.workingColorSpace}var Jm={clone:Ls,merge:Ye},$m=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Qm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,_n=class extends Ze{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=$m,this.fragmentShader=Qm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ls(t.uniforms),this.uniformsGroups=jm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Ko=class extends pe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Rt,this.projectionMatrix=new Rt,this.projectionMatrixInverse=new Rt,this.coordinateSystem=Zn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},fi=new M,id=new rt,sd=new rt,Ne=class extends Ko{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=ks*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(dr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ks*2*Math.atan(Math.tan(dr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){fi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(fi.x,fi.y).multiplyScalar(-t/fi.z),fi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(fi.x,fi.y).multiplyScalar(-t/fi.z)}getViewSize(t,e){return this.getViewBounds(t,id,sd),e.subVectors(sd,id)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(dr*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*i/c,e-=o.offsetY*n/l,i*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},ls=-90,hs=1,Rl=class extends pe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Ne(ls,hs,t,e);i.layers=this.layers,this.add(i);let r=new Ne(ls,hs,t,e);r.layers=this.layers,this.add(r);let o=new Ne(ls,hs,t,e);o.layers=this.layers,this.add(o);let a=new Ne(ls,hs,t,e);a.layers=this.layers,this.add(a);let c=new Ne(ls,hs,t,e);c.layers=this.layers,this.add(c);let l=new Ne(ls,hs,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,c]=e;for(let l of e)this.remove(l);if(t===Zn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Vo)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,c),t.setRenderTarget(n,4,i),t.render(e,l),n.texture.generateMipmaps=y,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Yo=class extends ke{constructor(t,e,n,i,r,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Es,super(t,e,n,i,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Cl=class extends $n{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new Yo(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:en}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new je(5,5,5),r=new _n({name:"CubemapFromEquirect",uniforms:Ls(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:He,blending:yi});r.uniforms.tEquirect.value=e;let o=new Lt(i,r),a=e.minFilter;return e.minFilter===In&&(e.minFilter=en),new Rl(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,i){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}},Tc=new M,t0=new M,e0=new Ot,Kn=class{constructor(t=new M(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=Tc.subVectors(n,e).cross(t0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(Tc),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||e0.getNormalMatrix(t),i=this.coplanarPoint(Tc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},ki=new cn,mo=new M,br=class{constructor(t=new Kn,e=new Kn,n=new Kn,i=new Kn,r=new Kn,o=new Kn){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Zn){let n=this.planes,i=t.elements,r=i[0],o=i[1],a=i[2],c=i[3],l=i[4],h=i[5],u=i[6],d=i[7],f=i[8],p=i[9],y=i[10],m=i[11],g=i[12],v=i[13],_=i[14],w=i[15];if(n[0].setComponents(c-r,d-l,m-f,w-g).normalize(),n[1].setComponents(c+r,d+l,m+f,w+g).normalize(),n[2].setComponents(c+o,d+h,m+p,w+v).normalize(),n[3].setComponents(c-o,d-h,m-p,w-v).normalize(),n[4].setComponents(c-a,d-u,m-y,w-_).normalize(),e===Zn)n[5].setComponents(c+a,d+u,m+y,w+_).normalize();else if(e===Vo)n[5].setComponents(a,u,y,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ki.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ki.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ki)}intersectsSprite(t){return ki.center.set(0,0,0),ki.radius=.7071067811865476,ki.applyMatrix4(t.matrixWorld),this.intersectsSphere(ki)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(mo.x=i.normal.x>0?t.max.x:t.min.x,mo.y=i.normal.y>0?t.max.y:t.min.y,mo.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(mo)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function wf(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function n0(s){let t=new WeakMap;function e(a,c){let l=a.array,h=a.usage,u=l.byteLength,d=s.createBuffer();s.bindBuffer(c,d),s.bufferData(c,l,h),a.onUploadCallback();let f;if(l instanceof Float32Array)f=s.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=s.SHORT;else if(l instanceof Uint32Array)f=s.UNSIGNED_INT;else if(l instanceof Int32Array)f=s.INT;else if(l instanceof Int8Array)f=s.BYTE;else if(l instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){let h=c.array,u=c.updateRanges;if(s.bindBuffer(l,a),u.length===0)s.bufferSubData(l,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){let p=u[d],y=u[f];y.start<=p.start+p.count+1?p.count=Math.max(p.count,y.start+y.count-p.start):(++d,u[d]=y)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){let y=u[f];s.bufferSubData(l,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=t.get(a);c&&(s.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:i,remove:r,update:o}}var Dn=class s extends Jt{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(i),l=a+1,h=c+1,u=t/a,d=e/c,f=[],p=[],y=[],m=[];for(let g=0;g<h;g++){let v=g*d-o;for(let _=0;_<l;_++){let w=_*u-r;p.push(w,-v,0),y.push(0,0,1),m.push(_/a),m.push(1-g/c)}}for(let g=0;g<c;g++)for(let v=0;v<a;v++){let _=v+l*g,w=v+l*(g+1),C=v+1+l*(g+1),A=v+1+l*g;f.push(_,w,A),f.push(w,C,A)}this.setIndex(f),this.setAttribute("position",new At(p,3)),this.setAttribute("normal",new At(y,3)),this.setAttribute("uv",new At(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.widthSegments,t.heightSegments)}},i0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,s0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,r0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,o0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,a0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,c0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,l0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,h0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,u0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,d0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,f0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,p0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,m0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,g0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,y0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,_0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,x0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,v0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,w0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,M0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,b0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,S0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,A0=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,T0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,E0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,R0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,C0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,z0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,P0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,I0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,k0="gl_FragColor = linearToOutputTexel( gl_FragColor );",L0=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,D0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,N0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,U0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,O0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,F0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,B0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,H0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,V0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,G0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,W0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,X0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,q0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,K0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Y0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Z0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,j0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,J0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,$0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Q0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,tg=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,eg=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,ng=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ig=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,sg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,rg=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,og=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ag=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,cg=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,lg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,hg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ug=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,dg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,pg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,mg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,gg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,yg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,_g=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,xg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,wg=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Mg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Sg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ag=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Tg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Eg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Rg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Cg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,zg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Pg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Ig=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,kg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Lg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Dg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ng=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ug=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Og=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Fg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Bg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Hg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Vg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Gg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Wg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Xg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,qg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Kg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Yg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Zg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,jg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Jg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,$g=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Qg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ty=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,ey=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,ny=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,iy=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ry=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,oy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ay=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cy=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,ly=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,hy=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,uy=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,dy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,fy=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,py=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,my=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,gy=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,yy=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_y=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xy=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vy=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,wy=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,My=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,by=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Sy=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ay=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ty=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Ey=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ry=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Cy=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zy=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Py=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Iy=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ky=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ly=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Dy=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ut={alphahash_fragment:i0,alphahash_pars_fragment:s0,alphamap_fragment:r0,alphamap_pars_fragment:o0,alphatest_fragment:a0,alphatest_pars_fragment:c0,aomap_fragment:l0,aomap_pars_fragment:h0,batching_pars_vertex:u0,batching_vertex:d0,begin_vertex:f0,beginnormal_vertex:p0,bsdfs:m0,iridescence_fragment:g0,bumpmap_pars_fragment:y0,clipping_planes_fragment:_0,clipping_planes_pars_fragment:x0,clipping_planes_pars_vertex:v0,clipping_planes_vertex:w0,color_fragment:M0,color_pars_fragment:b0,color_pars_vertex:S0,color_vertex:A0,common:T0,cube_uv_reflection_fragment:E0,defaultnormal_vertex:R0,displacementmap_pars_vertex:C0,displacementmap_vertex:z0,emissivemap_fragment:P0,emissivemap_pars_fragment:I0,colorspace_fragment:k0,colorspace_pars_fragment:L0,envmap_fragment:D0,envmap_common_pars_fragment:N0,envmap_pars_fragment:U0,envmap_pars_vertex:O0,envmap_physical_pars_fragment:Z0,envmap_vertex:F0,fog_vertex:B0,fog_pars_vertex:H0,fog_fragment:V0,fog_pars_fragment:G0,gradientmap_pars_fragment:W0,lightmap_pars_fragment:X0,lights_lambert_fragment:q0,lights_lambert_pars_fragment:K0,lights_pars_begin:Y0,lights_toon_fragment:j0,lights_toon_pars_fragment:J0,lights_phong_fragment:$0,lights_phong_pars_fragment:Q0,lights_physical_fragment:tg,lights_physical_pars_fragment:eg,lights_fragment_begin:ng,lights_fragment_maps:ig,lights_fragment_end:sg,logdepthbuf_fragment:rg,logdepthbuf_pars_fragment:og,logdepthbuf_pars_vertex:ag,logdepthbuf_vertex:cg,map_fragment:lg,map_pars_fragment:hg,map_particle_fragment:ug,map_particle_pars_fragment:dg,metalnessmap_fragment:fg,metalnessmap_pars_fragment:pg,morphinstance_vertex:mg,morphcolor_vertex:gg,morphnormal_vertex:yg,morphtarget_pars_vertex:_g,morphtarget_vertex:xg,normal_fragment_begin:vg,normal_fragment_maps:wg,normal_pars_fragment:Mg,normal_pars_vertex:bg,normal_vertex:Sg,normalmap_pars_fragment:Ag,clearcoat_normal_fragment_begin:Tg,clearcoat_normal_fragment_maps:Eg,clearcoat_pars_fragment:Rg,iridescence_pars_fragment:Cg,opaque_fragment:zg,packing:Pg,premultiplied_alpha_fragment:Ig,project_vertex:kg,dithering_fragment:Lg,dithering_pars_fragment:Dg,roughnessmap_fragment:Ng,roughnessmap_pars_fragment:Ug,shadowmap_pars_fragment:Og,shadowmap_pars_vertex:Fg,shadowmap_vertex:Bg,shadowmask_pars_fragment:Hg,skinbase_vertex:Vg,skinning_pars_vertex:Gg,skinning_vertex:Wg,skinnormal_vertex:Xg,specularmap_fragment:qg,specularmap_pars_fragment:Kg,tonemapping_fragment:Yg,tonemapping_pars_fragment:Zg,transmission_fragment:jg,transmission_pars_fragment:Jg,uv_pars_fragment:$g,uv_pars_vertex:Qg,uv_vertex:ty,worldpos_vertex:ey,background_vert:ny,background_frag:iy,backgroundCube_vert:sy,backgroundCube_frag:ry,cube_vert:oy,cube_frag:ay,depth_vert:cy,depth_frag:ly,distanceRGBA_vert:hy,distanceRGBA_frag:uy,equirect_vert:dy,equirect_frag:fy,linedashed_vert:py,linedashed_frag:my,meshbasic_vert:gy,meshbasic_frag:yy,meshlambert_vert:_y,meshlambert_frag:xy,meshmatcap_vert:vy,meshmatcap_frag:wy,meshnormal_vert:My,meshnormal_frag:by,meshphong_vert:Sy,meshphong_frag:Ay,meshphysical_vert:Ty,meshphysical_frag:Ey,meshtoon_vert:Ry,meshtoon_frag:Cy,points_vert:zy,points_frag:Py,shadow_vert:Iy,shadow_frag:ky,sprite_vert:Ly,sprite_frag:Dy},at={common:{diffuse:{value:new et(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ot}},envmap:{envMap:{value:null},envMapRotation:{value:new Ot},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ot},normalScale:{value:new rt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new et(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new et(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0},uvTransform:{value:new Ot}},sprite:{diffuse:{value:new et(16777215)},opacity:{value:1},center:{value:new rt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}}},Pn={basic:{uniforms:Ye([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.fog]),vertexShader:Ut.meshbasic_vert,fragmentShader:Ut.meshbasic_frag},lambert:{uniforms:Ye([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new et(0)}}]),vertexShader:Ut.meshlambert_vert,fragmentShader:Ut.meshlambert_frag},phong:{uniforms:Ye([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new et(0)},specular:{value:new et(1118481)},shininess:{value:30}}]),vertexShader:Ut.meshphong_vert,fragmentShader:Ut.meshphong_frag},standard:{uniforms:Ye([at.common,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.roughnessmap,at.metalnessmap,at.fog,at.lights,{emissive:{value:new et(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ut.meshphysical_vert,fragmentShader:Ut.meshphysical_frag},toon:{uniforms:Ye([at.common,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.gradientmap,at.fog,at.lights,{emissive:{value:new et(0)}}]),vertexShader:Ut.meshtoon_vert,fragmentShader:Ut.meshtoon_frag},matcap:{uniforms:Ye([at.common,at.bumpmap,at.normalmap,at.displacementmap,at.fog,{matcap:{value:null}}]),vertexShader:Ut.meshmatcap_vert,fragmentShader:Ut.meshmatcap_frag},points:{uniforms:Ye([at.points,at.fog]),vertexShader:Ut.points_vert,fragmentShader:Ut.points_frag},dashed:{uniforms:Ye([at.common,at.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ut.linedashed_vert,fragmentShader:Ut.linedashed_frag},depth:{uniforms:Ye([at.common,at.displacementmap]),vertexShader:Ut.depth_vert,fragmentShader:Ut.depth_frag},normal:{uniforms:Ye([at.common,at.bumpmap,at.normalmap,at.displacementmap,{opacity:{value:1}}]),vertexShader:Ut.meshnormal_vert,fragmentShader:Ut.meshnormal_frag},sprite:{uniforms:Ye([at.sprite,at.fog]),vertexShader:Ut.sprite_vert,fragmentShader:Ut.sprite_frag},background:{uniforms:{uvTransform:{value:new Ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ut.background_vert,fragmentShader:Ut.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ot}},vertexShader:Ut.backgroundCube_vert,fragmentShader:Ut.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ut.cube_vert,fragmentShader:Ut.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ut.equirect_vert,fragmentShader:Ut.equirect_frag},distanceRGBA:{uniforms:Ye([at.common,at.displacementmap,{referencePosition:{value:new M},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ut.distanceRGBA_vert,fragmentShader:Ut.distanceRGBA_frag},shadow:{uniforms:Ye([at.lights,at.fog,{color:{value:new et(0)},opacity:{value:1}}]),vertexShader:Ut.shadow_vert,fragmentShader:Ut.shadow_frag}};Pn.physical={uniforms:Ye([Pn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ot},clearcoatNormalScale:{value:new rt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ot},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ot},sheen:{value:0},sheenColor:{value:new et(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ot},transmissionSamplerSize:{value:new rt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ot},attenuationDistance:{value:0},attenuationColor:{value:new et(0)},specularColor:{value:new et(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ot},anisotropyVector:{value:new rt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ot}}]),vertexShader:Ut.meshphysical_vert,fragmentShader:Ut.meshphysical_frag};var go={r:0,b:0,g:0},Li=new ln,Ny=new Rt;function Uy(s,t,e,n,i,r,o){let a=new et(0),c=r===!0?0:1,l,h,u=null,d=0,f=null;function p(v){let _=v.isScene===!0?v.background:null;return _&&_.isTexture&&(_=(v.backgroundBlurriness>0?e:t).get(_)),_}function y(v){let _=!1,w=p(v);w===null?g(a,c):w&&w.isColor&&(g(w,1),_=!0);let C=s.xr.getEnvironmentBlendMode();C==="additive"?n.buffers.color.setClear(0,0,0,1,o):C==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(v,_){let w=p(_);w&&(w.isCubeTexture||w.mapping===Ma)?(h===void 0&&(h=new Lt(new je(1,1,1),new _n({name:"BackgroundCubeMaterial",uniforms:Ls(Pn.backgroundCube.uniforms),vertexShader:Pn.backgroundCube.vertexShader,fragmentShader:Pn.backgroundCube.fragmentShader,side:He,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(C,A,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Li.copy(_.backgroundRotation),Li.x*=-1,Li.y*=-1,Li.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Li.y*=-1,Li.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Ny.makeRotationFromEuler(Li)),h.material.toneMapped=Qt.getTransfer(w.colorSpace)!==he,(u!==w||d!==w.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,u=w,d=w.version,f=s.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(l===void 0&&(l=new Lt(new Dn(2,2),new _n({name:"BackgroundMaterial",uniforms:Ls(Pn.background.uniforms),vertexShader:Pn.background.vertexShader,fragmentShader:Pn.background.fragmentShader,side:kn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=w,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=Qt.getTransfer(w.colorSpace)!==he,w.matrixAutoUpdate===!0&&w.updateMatrix(),l.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||d!==w.version||f!==s.toneMapping)&&(l.material.needsUpdate=!0,u=w,d=w.version,f=s.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function g(v,_){v.getRGB(go,vf(s)),n.buffers.color.setClear(go.r,go.g,go.b,_,o)}return{getClearColor:function(){return a},setClearColor:function(v,_=1){a.set(v),c=_,g(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,g(a,c)},render:y,addToRenderList:m}}function Oy(s,t){let e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null),r=i,o=!1;function a(x,S,k,I,F){let j=!1,B=u(I,k,S);r!==B&&(r=B,l(r.object)),j=f(x,I,k,F),j&&p(x,I,k,F),F!==null&&t.update(F,s.ELEMENT_ARRAY_BUFFER),(j||o)&&(o=!1,w(x,S,k,I),F!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function c(){return s.createVertexArray()}function l(x){return s.bindVertexArray(x)}function h(x){return s.deleteVertexArray(x)}function u(x,S,k){let I=k.wireframe===!0,F=n[x.id];F===void 0&&(F={},n[x.id]=F);let j=F[S.id];j===void 0&&(j={},F[S.id]=j);let B=j[I];return B===void 0&&(B=d(c()),j[I]=B),B}function d(x){let S=[],k=[],I=[];for(let F=0;F<e;F++)S[F]=0,k[F]=0,I[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:S,enabledAttributes:k,attributeDivisors:I,object:x,attributes:{},index:null}}function f(x,S,k,I){let F=r.attributes,j=S.attributes,B=0,Q=k.getAttributes();for(let W in Q)if(Q[W].location>=0){let ot=F[W],vt=j[W];if(vt===void 0&&(W==="instanceMatrix"&&x.instanceMatrix&&(vt=x.instanceMatrix),W==="instanceColor"&&x.instanceColor&&(vt=x.instanceColor)),ot===void 0||ot.attribute!==vt||vt&&ot.data!==vt.data)return!0;B++}return r.attributesNum!==B||r.index!==I}function p(x,S,k,I){let F={},j=S.attributes,B=0,Q=k.getAttributes();for(let W in Q)if(Q[W].location>=0){let ot=j[W];ot===void 0&&(W==="instanceMatrix"&&x.instanceMatrix&&(ot=x.instanceMatrix),W==="instanceColor"&&x.instanceColor&&(ot=x.instanceColor));let vt={};vt.attribute=ot,ot&&ot.data&&(vt.data=ot.data),F[W]=vt,B++}r.attributes=F,r.attributesNum=B,r.index=I}function y(){let x=r.newAttributes;for(let S=0,k=x.length;S<k;S++)x[S]=0}function m(x){g(x,0)}function g(x,S){let k=r.newAttributes,I=r.enabledAttributes,F=r.attributeDivisors;k[x]=1,I[x]===0&&(s.enableVertexAttribArray(x),I[x]=1),F[x]!==S&&(s.vertexAttribDivisor(x,S),F[x]=S)}function v(){let x=r.newAttributes,S=r.enabledAttributes;for(let k=0,I=S.length;k<I;k++)S[k]!==x[k]&&(s.disableVertexAttribArray(k),S[k]=0)}function _(x,S,k,I,F,j,B){B===!0?s.vertexAttribIPointer(x,S,k,F,j):s.vertexAttribPointer(x,S,k,I,F,j)}function w(x,S,k,I){y();let F=I.attributes,j=k.getAttributes(),B=S.defaultAttributeValues;for(let Q in j){let W=j[Q];if(W.location>=0){let lt=F[Q];if(lt===void 0&&(Q==="instanceMatrix"&&x.instanceMatrix&&(lt=x.instanceMatrix),Q==="instanceColor"&&x.instanceColor&&(lt=x.instanceColor)),lt!==void 0){let ot=lt.normalized,vt=lt.itemSize,Xt=t.get(lt);if(Xt===void 0)continue;let Bt=Xt.buffer,Z=Xt.type,tt=Xt.bytesPerElement,wt=Z===s.INT||Z===s.UNSIGNED_INT||lt.gpuType===mh;if(lt.isInterleavedBufferAttribute){let ht=lt.data,Dt=ht.stride,Pt=lt.offset;if(ht.isInstancedInterleavedBuffer){for(let Ht=0;Ht<W.locationSize;Ht++)g(W.location+Ht,ht.meshPerAttribute);x.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=ht.meshPerAttribute*ht.count)}else for(let Ht=0;Ht<W.locationSize;Ht++)m(W.location+Ht);s.bindBuffer(s.ARRAY_BUFFER,Bt);for(let Ht=0;Ht<W.locationSize;Ht++)_(W.location+Ht,vt/W.locationSize,Z,ot,Dt*tt,(Pt+vt/W.locationSize*Ht)*tt,wt)}else{if(lt.isInstancedBufferAttribute){for(let ht=0;ht<W.locationSize;ht++)g(W.location+ht,lt.meshPerAttribute);x.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=lt.meshPerAttribute*lt.count)}else for(let ht=0;ht<W.locationSize;ht++)m(W.location+ht);s.bindBuffer(s.ARRAY_BUFFER,Bt);for(let ht=0;ht<W.locationSize;ht++)_(W.location+ht,vt/W.locationSize,Z,ot,vt*tt,vt/W.locationSize*ht*tt,wt)}}else if(B!==void 0){let ot=B[Q];if(ot!==void 0)switch(ot.length){case 2:s.vertexAttrib2fv(W.location,ot);break;case 3:s.vertexAttrib3fv(W.location,ot);break;case 4:s.vertexAttrib4fv(W.location,ot);break;default:s.vertexAttrib1fv(W.location,ot)}}}}v()}function C(){z();for(let x in n){let S=n[x];for(let k in S){let I=S[k];for(let F in I)h(I[F].object),delete I[F];delete S[k]}delete n[x]}}function A(x){if(n[x.id]===void 0)return;let S=n[x.id];for(let k in S){let I=S[k];for(let F in I)h(I[F].object),delete I[F];delete S[k]}delete n[x.id]}function E(x){for(let S in n){let k=n[S];if(k[x.id]===void 0)continue;let I=k[x.id];for(let F in I)h(I[F].object),delete I[F];delete k[x.id]}}function z(){N(),o=!0,r!==i&&(r=i,l(r.object))}function N(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:z,resetDefaultState:N,dispose:C,releaseStatesOfGeometry:A,releaseStatesOfProgram:E,initAttributes:y,enableAttribute:m,disableUnusedAttributes:v}}function Fy(s,t,e){let n;function i(l){n=l}function r(l,h){s.drawArrays(n,l,h),e.update(h,n,1)}function o(l,h,u){u!==0&&(s.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function a(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let p=0;p<u;p++)f+=h[p];e.update(f,n,1)}function c(l,h,u,d){if(u===0)return;let f=t.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<l.length;p++)o(l[p],h[p],d[p]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let p=0;for(let y=0;y<u;y++)p+=h[y];for(let y=0;y<d.length;y++)e.update(p,n,d[y])}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function By(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let E=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(E){return!(E!==gn&&n.convert(E)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){let z=E===Lr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==jn&&n.convert(E)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Cn&&!z)}function c(E){if(E==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control");if(d===!0){let E=t.get("EXT_clip_control");E.clipControlEXT(E.LOWER_LEFT_EXT,E.ZERO_TO_ONE_EXT)}let f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),v=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),_=s.getParameter(s.MAX_VARYING_VECTORS),w=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),C=p>0,A=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:y,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:v,maxVaryings:_,maxFragmentUniforms:w,vertexTextures:C,maxSamples:A}}function Hy(s){let t=this,e=null,n=0,i=!1,r=!1,o=new Kn,a=new Ot,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){let p=u.clippingPlanes,y=u.clipIntersection,m=u.clipShadows,g=s.get(u);if(!i||p===null||p.length===0||r&&!m)r?h(null):l();else{let v=r?0:n,_=v*4,w=g.clippingState||null;c.value=w,w=h(p,d,_,f);for(let C=0;C!==_;++C)w[C]=e[C];g.clippingState=w,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,p){let y=u!==null?u.length:0,m=null;if(y!==0){if(m=c.value,p!==!0||m===null){let g=f+y*4,v=d.matrixWorldInverse;a.getNormalMatrix(v),(m===null||m.length<g)&&(m=new Float32Array(g));for(let _=0,w=f;_!==y;++_,w+=4)o.copy(u[_]).applyMatrix4(v,a),o.normal.toArray(m,w),m[w+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,m}}function Vy(s){let t=new WeakMap;function e(o,a){return a===_r?o.mapping=Es:a===Jc&&(o.mapping=Rs),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===_r||a===Jc)if(t.has(o)){let c=t.get(o).texture;return e(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new Cl(c.height);return l.fromEquirectangularTexture(s,o),t.set(o,l),o.addEventListener("dispose",i),e(l.texture,o.mapping)}else return null}}return o}function i(o){let a=o.target;a.removeEventListener("dispose",i);let c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var xi=class extends Ko{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-t,o=n+t,a=i+e,c=i-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},vs=4,rd=[.125,.215,.35,.446,.526,.582],Oi=20,Ec=new xi,od=new et,Rc=null,Cc=0,zc=0,Pc=!1,Ni=(1+Math.sqrt(5))/2,us=1/Ni,ad=[new M(-Ni,us,0),new M(Ni,us,0),new M(-us,0,Ni),new M(us,0,Ni),new M(0,Ni,-us),new M(0,Ni,us),new M(-1,1,-1),new M(1,1,-1),new M(-1,1,1),new M(1,1,1)],Ds=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){Rc=this._renderer.getRenderTarget(),Cc=this._renderer.getActiveCubeFace(),zc=this._renderer.getActiveMipmapLevel(),Pc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,i,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=hd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ld(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Rc,Cc,zc),this._renderer.xr.enabled=Pc,t.scissorTest=!1,yo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Es||t.mapping===Rs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Rc=this._renderer.getRenderTarget(),Cc=this._renderer.getActiveCubeFace(),zc=this._renderer.getActiveMipmapLevel(),Pc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:en,minFilter:en,generateMipmaps:!1,type:Lr,format:gn,colorSpace:Le,depthBuffer:!1},i=cd(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=cd(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Gy(r)),this._blurMaterial=Wy(r,t,e)}return i}_compileMaterial(t){let e=new Lt(this._lodPlanes[0],t);this._renderer.compile(e,Ec)}_sceneToCubeUV(t,e,n,i){let a=new Ne(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(od),h.toneMapping=_i,h.autoClear=!1;let f=new re({name:"PMREM.Background",side:He,depthWrite:!1,depthTest:!1}),p=new Lt(new je,f),y=!1,m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,y=!0):(f.color.copy(od),y=!0);for(let g=0;g<6;g++){let v=g%3;v===0?(a.up.set(0,c[g],0),a.lookAt(l[g],0,0)):v===1?(a.up.set(0,0,c[g]),a.lookAt(0,l[g],0)):(a.up.set(0,c[g],0),a.lookAt(0,0,l[g]));let _=this._cubeSize;yo(i,v*_,g>2?_:0,_,_),h.setRenderTarget(i),y&&h.render(p,a),h.render(t,a)}p.geometry.dispose(),p.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){let n=this._renderer,i=t.mapping===Es||t.mapping===Rs;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=hd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ld());let r=i?this._cubemapMaterial:this._equirectMaterial,o=new Lt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let c=this._cubeSize;yo(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,Ec)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let i=this._lodPlanes.length;for(let r=1;r<i;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=ad[(i-r-1)%ad.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,i,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new Lt(this._lodPlanes[i],l),d=l.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Oi-1),y=r/p,m=isFinite(r)?1+Math.floor(h*y):Oi;m>Oi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Oi}`);let g=[],v=0;for(let E=0;E<Oi;++E){let z=E/y,N=Math.exp(-z*z/2);g.push(N),E===0?v+=N:E<m&&(v+=2*N)}for(let E=0;E<g.length;E++)g[E]=g[E]/v;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=g,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:_}=this;d.dTheta.value=p,d.mipInt.value=_-n;let w=this._sizeLods[i],C=3*w*(i>_-vs?i-_+vs:0),A=4*(this._cubeSize-w);yo(e,C,A,3*w,2*w),c.setRenderTarget(e),c.render(u,Ec)}};function Gy(s){let t=[],e=[],n=[],i=s,r=s-vs+1+rd.length;for(let o=0;o<r;o++){let a=Math.pow(2,i);e.push(a);let c=1/a;o>s-vs?c=rd[o-s+vs-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,p=6,y=3,m=2,g=1,v=new Float32Array(y*p*f),_=new Float32Array(m*p*f),w=new Float32Array(g*p*f);for(let A=0;A<f;A++){let E=A%3*2/3-1,z=A>2?0:-1,N=[E,z,0,E+2/3,z,0,E+2/3,z+1,0,E,z,0,E+2/3,z+1,0,E,z+1,0];v.set(N,y*p*A),_.set(d,m*p*A);let x=[A,A,A,A,A,A];w.set(x,g*p*A)}let C=new Jt;C.setAttribute("position",new Te(v,y)),C.setAttribute("uv",new Te(_,m)),C.setAttribute("faceIndex",new Te(w,g)),t.push(C),i>vs&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function cd(s,t,e){let n=new $n(s,t,e);return n.texture.mapping=Ma,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function yo(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function Wy(s,t,e){let n=new Float32Array(Oi),i=new M(0,1,0);return new _n({name:"SphericalGaussianBlur",defines:{n:Oi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Eh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:yi,depthTest:!1,depthWrite:!1})}function ld(){return new _n({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Eh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:yi,depthTest:!1,depthWrite:!1})}function hd(){return new _n({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Eh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:yi,depthTest:!1,depthWrite:!1})}function Eh(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Xy(s){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===_r||c===Jc,h=c===Es||c===Rs;if(l||h){let u=t.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new Ds(s)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{let f=a.image;return l&&f&&f.height>0||h&&f&&i(f)?(e===null&&(e=new Ds(s)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function i(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function qy(s){let t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let i=e(n);return i===null&&No("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Ky(s,t,e,n){let i={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let p in d.attributes)t.remove(d.attributes[p]);for(let p in d.morphAttributes){let y=d.morphAttributes[p];for(let m=0,g=y.length;m<g;m++)t.remove(y[m])}d.removeEventListener("dispose",o),delete i[d.id];let f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,e.memory.geometries++),d}function c(u){let d=u.attributes;for(let p in d)t.update(d[p],s.ARRAY_BUFFER);let f=u.morphAttributes;for(let p in f){let y=f[p];for(let m=0,g=y.length;m<g;m++)t.update(y[m],s.ARRAY_BUFFER)}}function l(u){let d=[],f=u.index,p=u.attributes.position,y=0;if(f!==null){let v=f.array;y=f.version;for(let _=0,w=v.length;_<w;_+=3){let C=v[_+0],A=v[_+1],E=v[_+2];d.push(C,A,A,E,E,C)}}else if(p!==void 0){let v=p.array;y=p.version;for(let _=0,w=v.length/3-1;_<w;_+=3){let C=_+0,A=_+1,E=_+2;d.push(C,A,A,E,E,C)}}else return;let m=new(_f(d)?qo:Xo)(d,1);m.version=y;let g=r.get(u);g&&t.remove(g),r.set(u,m)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function Yy(s,t,e){let n;function i(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,f){s.drawElements(n,f,r,d*o),e.update(f,n,1)}function l(d,f,p){p!==0&&(s.drawElementsInstanced(n,f,r,d*o,p),e.update(f,n,p))}function h(d,f,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,p);let m=0;for(let g=0;g<p;g++)m+=f[g];e.update(m,n,1)}function u(d,f,p,y){if(p===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<d.length;g++)l(d[g]/o,f[g],y[g]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,y,0,p);let g=0;for(let v=0;v<p;v++)g+=f[v];for(let v=0;v<y.length;v++)e.update(g,n,y[v])}}this.setMode=i,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Zy(s){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function jy(s,t,e){let n=new WeakMap,i=new jt;function r(o,a,c){let l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let N=function(){E.dispose(),n.delete(a),a.removeEventListener("dispose",N)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],v=a.morphAttributes.color||[],_=0;f===!0&&(_=1),p===!0&&(_=2),y===!0&&(_=3);let w=a.attributes.position.count*_,C=1;w>t.maxTextureSize&&(C=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);let A=new Float32Array(w*C*4*u),E=new Wo(A,w,C,u);E.type=Cn,E.needsUpdate=!0;let z=_*4;for(let x=0;x<u;x++){let S=m[x],k=g[x],I=v[x],F=w*C*4*x;for(let j=0;j<S.count;j++){let B=j*z;f===!0&&(i.fromBufferAttribute(S,j),A[F+B+0]=i.x,A[F+B+1]=i.y,A[F+B+2]=i.z,A[F+B+3]=0),p===!0&&(i.fromBufferAttribute(k,j),A[F+B+4]=i.x,A[F+B+5]=i.y,A[F+B+6]=i.z,A[F+B+7]=0),y===!0&&(i.fromBufferAttribute(I,j),A[F+B+8]=i.x,A[F+B+9]=i.y,A[F+B+10]=i.z,A[F+B+11]=I.itemSize===4?i.w:1)}}d={count:u,texture:E,size:new rt(w,C)},n.set(a,d),a.addEventListener("dispose",N)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",o.morphTexture,e);else{let f=0;for(let y=0;y<l.length;y++)f+=l[y];let p=a.morphTargetsRelative?1:1-f;c.getUniforms().setValue(s,"morphTargetBaseInfluence",p),c.getUniforms().setValue(s,"morphTargetInfluences",l)}c.getUniforms().setValue(s,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function Jy(s,t,e,n){let i=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,u=t.get(c,h);if(i.get(u)!==l&&(t.update(u),i.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),i.get(c)!==l&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){let d=c.skeleton;i.get(d)!==l&&(d.update(),i.set(d,l))}return u}function o(){i=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}var Zo=class extends ke{constructor(t,e,n,i,r,o,a,c,l,h=bs){if(h!==bs&&h!==zs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===bs&&(n=Bi),n===void 0&&h===zs&&(n=Cs),super(null,i,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Be,this.minFilter=c!==void 0?c:Be,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Mf=new ke,ud=new Zo(1,1),bf=new Wo,Sf=new El,Af=new Yo,dd=[],fd=[],pd=new Float32Array(16),md=new Float32Array(9),gd=new Float32Array(4);function Vs(s,t,e){let n=s[0];if(n<=0||n>0)return s;let i=t*e,r=dd[i];if(r===void 0&&(r=new Float32Array(i),dd[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function Re(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Ce(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Aa(s,t){let e=fd[t];e===void 0&&(e=new Int32Array(t),fd[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function $y(s,t){let e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Qy(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;s.uniform2fv(this.addr,t),Ce(e,t)}}function t_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Re(e,t))return;s.uniform3fv(this.addr,t),Ce(e,t)}}function e_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;s.uniform4fv(this.addr,t),Ce(e,t)}}function n_(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,n))return;gd.set(n),s.uniformMatrix2fv(this.addr,!1,gd),Ce(e,n)}}function i_(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,n))return;md.set(n),s.uniformMatrix3fv(this.addr,!1,md),Ce(e,n)}}function s_(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,n))return;pd.set(n),s.uniformMatrix4fv(this.addr,!1,pd),Ce(e,n)}}function r_(s,t){let e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function o_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;s.uniform2iv(this.addr,t),Ce(e,t)}}function a_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;s.uniform3iv(this.addr,t),Ce(e,t)}}function c_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;s.uniform4iv(this.addr,t),Ce(e,t)}}function l_(s,t){let e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function h_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;s.uniform2uiv(this.addr,t),Ce(e,t)}}function u_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;s.uniform3uiv(this.addr,t),Ce(e,t)}}function d_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;s.uniform4uiv(this.addr,t),Ce(e,t)}}function f_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(ud.compareFunction=mf,r=ud):r=Mf,e.setTexture2D(t||r,i)}function p_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Sf,i)}function m_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||Af,i)}function g_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||bf,i)}function y_(s){switch(s){case 5126:return $y;case 35664:return Qy;case 35665:return t_;case 35666:return e_;case 35674:return n_;case 35675:return i_;case 35676:return s_;case 5124:case 35670:return r_;case 35667:case 35671:return o_;case 35668:case 35672:return a_;case 35669:case 35673:return c_;case 5125:return l_;case 36294:return h_;case 36295:return u_;case 36296:return d_;case 35678:case 36198:case 36298:case 36306:case 35682:return f_;case 35679:case 36299:case 36307:return p_;case 35680:case 36300:case 36308:case 36293:return m_;case 36289:case 36303:case 36311:case 36292:return g_}}function __(s,t){s.uniform1fv(this.addr,t)}function x_(s,t){let e=Vs(t,this.size,2);s.uniform2fv(this.addr,e)}function v_(s,t){let e=Vs(t,this.size,3);s.uniform3fv(this.addr,e)}function w_(s,t){let e=Vs(t,this.size,4);s.uniform4fv(this.addr,e)}function M_(s,t){let e=Vs(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function b_(s,t){let e=Vs(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function S_(s,t){let e=Vs(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function A_(s,t){s.uniform1iv(this.addr,t)}function T_(s,t){s.uniform2iv(this.addr,t)}function E_(s,t){s.uniform3iv(this.addr,t)}function R_(s,t){s.uniform4iv(this.addr,t)}function C_(s,t){s.uniform1uiv(this.addr,t)}function z_(s,t){s.uniform2uiv(this.addr,t)}function P_(s,t){s.uniform3uiv(this.addr,t)}function I_(s,t){s.uniform4uiv(this.addr,t)}function k_(s,t,e){let n=this.cache,i=t.length,r=Aa(e,i);Re(n,r)||(s.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||Mf,r[o])}function L_(s,t,e){let n=this.cache,i=t.length,r=Aa(e,i);Re(n,r)||(s.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||Sf,r[o])}function D_(s,t,e){let n=this.cache,i=t.length,r=Aa(e,i);Re(n,r)||(s.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||Af,r[o])}function N_(s,t,e){let n=this.cache,i=t.length,r=Aa(e,i);Re(n,r)||(s.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||bf,r[o])}function U_(s){switch(s){case 5126:return __;case 35664:return x_;case 35665:return v_;case 35666:return w_;case 35674:return M_;case 35675:return b_;case 35676:return S_;case 5124:case 35670:return A_;case 35667:case 35671:return T_;case 35668:case 35672:return E_;case 35669:case 35673:return R_;case 5125:return C_;case 36294:return z_;case 36295:return P_;case 36296:return I_;case 35678:case 36198:case 36298:case 36306:case 35682:return k_;case 35679:case 36299:case 36307:return L_;case 35680:case 36300:case 36308:case 36293:return D_;case 36289:case 36303:case 36311:case 36292:return N_}}var zl=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=y_(e.type)}},Pl=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=U_(e.type)}},Il=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let r=0,o=i.length;r!==o;++r){let a=i[r];a.setValue(t,e[a.id],n)}}},Ic=/(\w+)(\])?(\[|\.)?/g;function yd(s,t){s.seq.push(t),s.map[t.id]=t}function O_(s,t,e){let n=s.name,i=n.length;for(Ic.lastIndex=0;;){let r=Ic.exec(n),o=Ic.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===i){yd(e,l===void 0?new zl(a,s,t):new Pl(a,s,t));break}else{let u=e.map[a];u===void 0&&(u=new Il(a),yd(e,u)),e=u}}}var As=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let r=t.getActiveUniform(e,i),o=t.getUniformLocation(e,r.name);O_(r,o,this)}}setValue(t,e,n,i){let r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){let a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,r=t.length;i!==r;++i){let o=t[i];o.id in e&&n.push(o)}return n}};function _d(s,t,e){let n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}var F_=37297,B_=0;function H_(s,t){let e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function V_(s){let t=Qt.getPrimaries(Qt.workingColorSpace),e=Qt.getPrimaries(s),n;switch(t===e?n="":t===Ho&&e===Bo?n="LinearDisplayP3ToLinearSRGB":t===Bo&&e===Ho&&(n="LinearSRGBToLinearDisplayP3"),s){case Le:case Sa:return[n,"LinearTransferOETF"];case Yt:case Ah:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function xd(s,t,e){let n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";let r=/ERROR: 0:(\d+)/.exec(i);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+i+`

`+H_(s.getShaderSource(t),o)}else return i}function G_(s,t){let e=V_(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function W_(s,t){let e;switch(t){case $p:e="Linear";break;case Qp:e="Reinhard";break;case tm:e="Cineon";break;case fh:e="ACESFilmic";break;case nm:e="AgX";break;case im:e="Neutral";break;case em:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var _o=new M;function X_(){Qt.getLuminanceCoefficients(_o);let s=_o.x.toFixed(4),t=_o.y.toFixed(4),e=_o.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function q_(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(hr).join(`
`)}function K_(s){let t=[];for(let e in s){let n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Y_(s,t){let e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(t,i),o=r.name,a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function hr(s){return s!==""}function vd(s,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function wd(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Z_=/^[ \t]*#include +<([\w\d./]+)>/gm;function kl(s){return s.replace(Z_,J_)}var j_=new Map;function J_(s,t){let e=Ut[t];if(e===void 0){let n=j_.get(t);if(n!==void 0)e=Ut[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return kl(e)}var $_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Md(s){return s.replace($_,Q_)}function Q_(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function bd(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function tx(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===ef?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===uh?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===qn&&(t="SHADOWMAP_TYPE_VSM"),t}function ex(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Es:case Rs:t="ENVMAP_TYPE_CUBE";break;case Ma:t="ENVMAP_TYPE_CUBE_UV";break}return t}function nx(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Rs:t="ENVMAP_MODE_REFRACTION";break}return t}function ix(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case dh:t="ENVMAP_BLENDING_MULTIPLY";break;case jp:t="ENVMAP_BLENDING_MIX";break;case Jp:t="ENVMAP_BLENDING_ADD";break}return t}function sx(s){let t=s.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function rx(s,t,e,n){let i=s.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,c=tx(e),l=ex(e),h=nx(e),u=ix(e),d=sx(e),f=q_(e),p=K_(r),y=i.createProgram(),m,g,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(hr).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(hr).join(`
`),g.length>0&&(g+=`
`)):(m=[bd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(hr).join(`
`),g=[bd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==_i?"#define TONE_MAPPING":"",e.toneMapping!==_i?Ut.tonemapping_pars_fragment:"",e.toneMapping!==_i?W_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ut.colorspace_pars_fragment,G_("linearToOutputTexel",e.outputColorSpace),X_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(hr).join(`
`)),o=kl(o),o=vd(o,e),o=wd(o,e),a=kl(a),a=vd(a,e),a=wd(a,e),o=Md(o),a=Md(a),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",e.glslVersion===Bu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Bu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let _=v+m+o,w=v+g+a,C=_d(i,i.VERTEX_SHADER,_),A=_d(i,i.FRAGMENT_SHADER,w);i.attachShader(y,C),i.attachShader(y,A),e.index0AttributeName!==void 0?i.bindAttribLocation(y,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(y,0,"position"),i.linkProgram(y);function E(S){if(s.debug.checkShaderErrors){let k=i.getProgramInfoLog(y).trim(),I=i.getShaderInfoLog(C).trim(),F=i.getShaderInfoLog(A).trim(),j=!0,B=!0;if(i.getProgramParameter(y,i.LINK_STATUS)===!1)if(j=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,y,C,A);else{let Q=xd(i,C,"vertex"),W=xd(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(y,i.VALIDATE_STATUS)+`

Material Name: `+S.name+`
Material Type: `+S.type+`

Program Info Log: `+k+`
`+Q+`
`+W)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(I===""||F==="")&&(B=!1);B&&(S.diagnostics={runnable:j,programLog:k,vertexShader:{log:I,prefix:m},fragmentShader:{log:F,prefix:g}})}i.deleteShader(C),i.deleteShader(A),z=new As(i,y),N=Y_(i,y)}let z;this.getUniforms=function(){return z===void 0&&E(this),z};let N;this.getAttributes=function(){return N===void 0&&E(this),N};let x=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=i.getProgramParameter(y,F_)),x},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=B_++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=C,this.fragmentShader=A,this}var ox=0,Ll=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Dl(t),e.set(t,n)),n}},Dl=class{constructor(t){this.id=ox++,this.code=t,this.usedTimes=0}};function ax(s,t,e,n,i,r,o){let a=new Mr,c=new Ll,l=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.reverseDepthBuffer,f=i.vertexTextures,p=i.precision,y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(x){return l.add(x),x===0?"uv":`uv${x}`}function g(x,S,k,I,F){let j=I.fog,B=F.geometry,Q=x.isMeshStandardMaterial?I.environment:null,W=(x.isMeshStandardMaterial?e:t).get(x.envMap||Q),lt=W&&W.mapping===Ma?W.image.height:null,ot=y[x.type];x.precision!==null&&(p=i.getMaxPrecision(x.precision),p!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",p,"instead."));let vt=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,Xt=vt!==void 0?vt.length:0,Bt=0;B.morphAttributes.position!==void 0&&(Bt=1),B.morphAttributes.normal!==void 0&&(Bt=2),B.morphAttributes.color!==void 0&&(Bt=3);let Z,tt,wt,ht;if(ot){let tn=Pn[ot];Z=tn.vertexShader,tt=tn.fragmentShader}else Z=x.vertexShader,tt=x.fragmentShader,c.update(x),wt=c.getVertexShaderID(x),ht=c.getFragmentShaderID(x);let Dt=s.getRenderTarget(),Pt=F.isInstancedMesh===!0,Ht=F.isBatchedMesh===!0,Zt=!!x.map,Vt=!!x.matcap,P=!!W,qe=!!x.aoMap,qt=!!x.lightMap,G=!!x.bumpMap,it=!!x.normalMap,J=!!x.displacementMap,dt=!!x.emissiveMap,R=!!x.metalnessMap,b=!!x.roughnessMap,O=x.anisotropy>0,q=x.clearcoat>0,K=x.dispersion>0,Y=x.iridescence>0,St=x.sheen>0,ct=x.transmission>0,ut=O&&!!x.anisotropyMap,Gt=q&&!!x.clearcoatMap,nt=q&&!!x.clearcoatNormalMap,_t=q&&!!x.clearcoatRoughnessMap,Ct=Y&&!!x.iridescenceMap,zt=Y&&!!x.iridescenceThicknessMap,yt=St&&!!x.sheenColorMap,Kt=St&&!!x.sheenRoughnessMap,Nt=!!x.specularMap,ae=!!x.specularColorMap,L=!!x.specularIntensityMap,mt=ct&&!!x.transmissionMap,X=ct&&!!x.thicknessMap,$=!!x.gradientMap,ft=!!x.alphaMap,gt=x.alphaTest>0,$t=!!x.alphaHash,be=!!x.extensions,Qe=_i;x.toneMapped&&(Dt===null||Dt.isXRRenderTarget===!0)&&(Qe=s.toneMapping);let te={shaderID:ot,shaderType:x.type,shaderName:x.name,vertexShader:Z,fragmentShader:tt,defines:x.defines,customVertexShaderID:wt,customFragmentShaderID:ht,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:p,batching:Ht,batchingColor:Ht&&F._colorsTexture!==null,instancing:Pt,instancingColor:Pt&&F.instanceColor!==null,instancingMorph:Pt&&F.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:Dt===null?s.outputColorSpace:Dt.isXRRenderTarget===!0?Dt.texture.colorSpace:Le,alphaToCoverage:!!x.alphaToCoverage,map:Zt,matcap:Vt,envMap:P,envMapMode:P&&W.mapping,envMapCubeUVHeight:lt,aoMap:qe,lightMap:qt,bumpMap:G,normalMap:it,displacementMap:f&&J,emissiveMap:dt,normalMapObjectSpace:it&&x.normalMapType===lm,normalMapTangentSpace:it&&x.normalMapType===Sh,metalnessMap:R,roughnessMap:b,anisotropy:O,anisotropyMap:ut,clearcoat:q,clearcoatMap:Gt,clearcoatNormalMap:nt,clearcoatRoughnessMap:_t,dispersion:K,iridescence:Y,iridescenceMap:Ct,iridescenceThicknessMap:zt,sheen:St,sheenColorMap:yt,sheenRoughnessMap:Kt,specularMap:Nt,specularColorMap:ae,specularIntensityMap:L,transmission:ct,transmissionMap:mt,thicknessMap:X,gradientMap:$,opaque:x.transparent===!1&&x.blending===Ms&&x.alphaToCoverage===!1,alphaMap:ft,alphaTest:gt,alphaHash:$t,combine:x.combine,mapUv:Zt&&m(x.map.channel),aoMapUv:qe&&m(x.aoMap.channel),lightMapUv:qt&&m(x.lightMap.channel),bumpMapUv:G&&m(x.bumpMap.channel),normalMapUv:it&&m(x.normalMap.channel),displacementMapUv:J&&m(x.displacementMap.channel),emissiveMapUv:dt&&m(x.emissiveMap.channel),metalnessMapUv:R&&m(x.metalnessMap.channel),roughnessMapUv:b&&m(x.roughnessMap.channel),anisotropyMapUv:ut&&m(x.anisotropyMap.channel),clearcoatMapUv:Gt&&m(x.clearcoatMap.channel),clearcoatNormalMapUv:nt&&m(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:_t&&m(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Ct&&m(x.iridescenceMap.channel),iridescenceThicknessMapUv:zt&&m(x.iridescenceThicknessMap.channel),sheenColorMapUv:yt&&m(x.sheenColorMap.channel),sheenRoughnessMapUv:Kt&&m(x.sheenRoughnessMap.channel),specularMapUv:Nt&&m(x.specularMap.channel),specularColorMapUv:ae&&m(x.specularColorMap.channel),specularIntensityMapUv:L&&m(x.specularIntensityMap.channel),transmissionMapUv:mt&&m(x.transmissionMap.channel),thicknessMapUv:X&&m(x.thicknessMap.channel),alphaMapUv:ft&&m(x.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(it||O),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!B.attributes.uv&&(Zt||ft),fog:!!j,useFog:x.fog===!0,fogExp2:!!j&&j.isFogExp2,flatShading:x.flatShading===!0,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:d,skinning:F.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:Xt,morphTextureStride:Bt,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:x.dithering,shadowMapEnabled:s.shadowMap.enabled&&k.length>0,shadowMapType:s.shadowMap.type,toneMapping:Qe,decodeVideoTexture:Zt&&x.map.isVideoTexture===!0&&Qt.getTransfer(x.map.colorSpace)===he,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===ue,flipSided:x.side===He,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:be&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(be&&x.extensions.multiDraw===!0||Ht)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return te.vertexUv1s=l.has(1),te.vertexUv2s=l.has(2),te.vertexUv3s=l.has(3),l.clear(),te}function v(x){let S=[];if(x.shaderID?S.push(x.shaderID):(S.push(x.customVertexShaderID),S.push(x.customFragmentShaderID)),x.defines!==void 0)for(let k in x.defines)S.push(k),S.push(x.defines[k]);return x.isRawShaderMaterial===!1&&(_(S,x),w(S,x),S.push(s.outputColorSpace)),S.push(x.customProgramCacheKey),S.join()}function _(x,S){x.push(S.precision),x.push(S.outputColorSpace),x.push(S.envMapMode),x.push(S.envMapCubeUVHeight),x.push(S.mapUv),x.push(S.alphaMapUv),x.push(S.lightMapUv),x.push(S.aoMapUv),x.push(S.bumpMapUv),x.push(S.normalMapUv),x.push(S.displacementMapUv),x.push(S.emissiveMapUv),x.push(S.metalnessMapUv),x.push(S.roughnessMapUv),x.push(S.anisotropyMapUv),x.push(S.clearcoatMapUv),x.push(S.clearcoatNormalMapUv),x.push(S.clearcoatRoughnessMapUv),x.push(S.iridescenceMapUv),x.push(S.iridescenceThicknessMapUv),x.push(S.sheenColorMapUv),x.push(S.sheenRoughnessMapUv),x.push(S.specularMapUv),x.push(S.specularColorMapUv),x.push(S.specularIntensityMapUv),x.push(S.transmissionMapUv),x.push(S.thicknessMapUv),x.push(S.combine),x.push(S.fogExp2),x.push(S.sizeAttenuation),x.push(S.morphTargetsCount),x.push(S.morphAttributeCount),x.push(S.numDirLights),x.push(S.numPointLights),x.push(S.numSpotLights),x.push(S.numSpotLightMaps),x.push(S.numHemiLights),x.push(S.numRectAreaLights),x.push(S.numDirLightShadows),x.push(S.numPointLightShadows),x.push(S.numSpotLightShadows),x.push(S.numSpotLightShadowsWithMaps),x.push(S.numLightProbes),x.push(S.shadowMapType),x.push(S.toneMapping),x.push(S.numClippingPlanes),x.push(S.numClipIntersection),x.push(S.depthPacking)}function w(x,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),x.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reverseDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.alphaToCoverage&&a.enable(20),x.push(a.mask)}function C(x){let S=y[x.type],k;if(S){let I=Pn[S];k=Jm.clone(I.uniforms)}else k=x.uniforms;return k}function A(x,S){let k;for(let I=0,F=h.length;I<F;I++){let j=h[I];if(j.cacheKey===S){k=j,++k.usedTimes;break}}return k===void 0&&(k=new rx(s,S,x,r),h.push(k)),k}function E(x){if(--x.usedTimes===0){let S=h.indexOf(x);h[S]=h[h.length-1],h.pop(),x.destroy()}}function z(x){c.remove(x)}function N(){c.dispose()}return{getParameters:g,getProgramCacheKey:v,getUniforms:C,acquireProgram:A,releaseProgram:E,releaseShaderCache:z,programs:h,dispose:N}}function cx(){let s=new WeakMap;function t(o){return s.has(o)}function e(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,c){s.get(o)[a]=c}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function lx(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function Sd(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Ad(){let s=[],t=0,e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(u,d,f,p,y,m){let g=s[t];return g===void 0?(g={id:u.id,object:u,geometry:d,material:f,groupOrder:p,renderOrder:u.renderOrder,z:y,group:m},s[t]=g):(g.id=u.id,g.object=u,g.geometry=d,g.material=f,g.groupOrder=p,g.renderOrder=u.renderOrder,g.z=y,g.group=m),t++,g}function a(u,d,f,p,y,m){let g=o(u,d,f,p,y,m);f.transmission>0?n.push(g):f.transparent===!0?i.push(g):e.push(g)}function c(u,d,f,p,y,m){let g=o(u,d,f,p,y,m);f.transmission>0?n.unshift(g):f.transparent===!0?i.unshift(g):e.unshift(g)}function l(u,d){e.length>1&&e.sort(u||lx),n.length>1&&n.sort(d||Sd),i.length>1&&i.sort(d||Sd)}function h(){for(let u=t,d=s.length;u<d;u++){let f=s[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:a,unshift:c,finish:h,sort:l}}function hx(){let s=new WeakMap;function t(n,i){let r=s.get(n),o;return r===void 0?(o=new Ad,s.set(n,[o])):i>=r.length?(o=new Ad,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function ux(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new M,color:new et};break;case"SpotLight":e={position:new M,direction:new M,color:new et,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new M,color:new et,distance:0,decay:0};break;case"HemisphereLight":e={direction:new M,skyColor:new et,groundColor:new et};break;case"RectAreaLight":e={color:new et,position:new M,halfWidth:new M,halfHeight:new M};break}return s[t.id]=e,e}}}function dx(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}var fx=0;function px(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function mx(s){let t=new ux,e=dx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new M);let i=new M,r=new Rt,o=new Rt;function a(l){let h=0,u=0,d=0;for(let N=0;N<9;N++)n.probe[N].set(0,0,0);let f=0,p=0,y=0,m=0,g=0,v=0,_=0,w=0,C=0,A=0,E=0;l.sort(px);for(let N=0,x=l.length;N<x;N++){let S=l[N],k=S.color,I=S.intensity,F=S.distance,j=S.shadow&&S.shadow.map?S.shadow.map.texture:null;if(S.isAmbientLight)h+=k.r*I,u+=k.g*I,d+=k.b*I;else if(S.isLightProbe){for(let B=0;B<9;B++)n.probe[B].addScaledVector(S.sh.coefficients[B],I);E++}else if(S.isDirectionalLight){let B=t.get(S);if(B.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let Q=S.shadow,W=e.get(S);W.shadowIntensity=Q.intensity,W.shadowBias=Q.bias,W.shadowNormalBias=Q.normalBias,W.shadowRadius=Q.radius,W.shadowMapSize=Q.mapSize,n.directionalShadow[f]=W,n.directionalShadowMap[f]=j,n.directionalShadowMatrix[f]=S.shadow.matrix,v++}n.directional[f]=B,f++}else if(S.isSpotLight){let B=t.get(S);B.position.setFromMatrixPosition(S.matrixWorld),B.color.copy(k).multiplyScalar(I),B.distance=F,B.coneCos=Math.cos(S.angle),B.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),B.decay=S.decay,n.spot[y]=B;let Q=S.shadow;if(S.map&&(n.spotLightMap[C]=S.map,C++,Q.updateMatrices(S),S.castShadow&&A++),n.spotLightMatrix[y]=Q.matrix,S.castShadow){let W=e.get(S);W.shadowIntensity=Q.intensity,W.shadowBias=Q.bias,W.shadowNormalBias=Q.normalBias,W.shadowRadius=Q.radius,W.shadowMapSize=Q.mapSize,n.spotShadow[y]=W,n.spotShadowMap[y]=j,w++}y++}else if(S.isRectAreaLight){let B=t.get(S);B.color.copy(k).multiplyScalar(I),B.halfWidth.set(S.width*.5,0,0),B.halfHeight.set(0,S.height*.5,0),n.rectArea[m]=B,m++}else if(S.isPointLight){let B=t.get(S);if(B.color.copy(S.color).multiplyScalar(S.intensity),B.distance=S.distance,B.decay=S.decay,S.castShadow){let Q=S.shadow,W=e.get(S);W.shadowIntensity=Q.intensity,W.shadowBias=Q.bias,W.shadowNormalBias=Q.normalBias,W.shadowRadius=Q.radius,W.shadowMapSize=Q.mapSize,W.shadowCameraNear=Q.camera.near,W.shadowCameraFar=Q.camera.far,n.pointShadow[p]=W,n.pointShadowMap[p]=j,n.pointShadowMatrix[p]=S.shadow.matrix,_++}n.point[p]=B,p++}else if(S.isHemisphereLight){let B=t.get(S);B.skyColor.copy(S.color).multiplyScalar(I),B.groundColor.copy(S.groundColor).multiplyScalar(I),n.hemi[g]=B,g++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=at.LTC_FLOAT_1,n.rectAreaLTC2=at.LTC_FLOAT_2):(n.rectAreaLTC1=at.LTC_HALF_1,n.rectAreaLTC2=at.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let z=n.hash;(z.directionalLength!==f||z.pointLength!==p||z.spotLength!==y||z.rectAreaLength!==m||z.hemiLength!==g||z.numDirectionalShadows!==v||z.numPointShadows!==_||z.numSpotShadows!==w||z.numSpotMaps!==C||z.numLightProbes!==E)&&(n.directional.length=f,n.spot.length=y,n.rectArea.length=m,n.point.length=p,n.hemi.length=g,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=_,n.pointShadowMap.length=_,n.spotShadow.length=w,n.spotShadowMap.length=w,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=_,n.spotLightMatrix.length=w+C-A,n.spotLightMap.length=C,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=E,z.directionalLength=f,z.pointLength=p,z.spotLength=y,z.rectAreaLength=m,z.hemiLength=g,z.numDirectionalShadows=v,z.numPointShadows=_,z.numSpotShadows=w,z.numSpotMaps=C,z.numLightProbes=E,n.version=fx++)}function c(l,h){let u=0,d=0,f=0,p=0,y=0,m=h.matrixWorldInverse;for(let g=0,v=l.length;g<v;g++){let _=l[g];if(_.isDirectionalLight){let w=n.directional[u];w.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),w.direction.sub(i),w.direction.transformDirection(m),u++}else if(_.isSpotLight){let w=n.spot[f];w.position.setFromMatrixPosition(_.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),w.direction.sub(i),w.direction.transformDirection(m),f++}else if(_.isRectAreaLight){let w=n.rectArea[p];w.position.setFromMatrixPosition(_.matrixWorld),w.position.applyMatrix4(m),o.identity(),r.copy(_.matrixWorld),r.premultiply(m),o.extractRotation(r),w.halfWidth.set(_.width*.5,0,0),w.halfHeight.set(0,_.height*.5,0),w.halfWidth.applyMatrix4(o),w.halfHeight.applyMatrix4(o),p++}else if(_.isPointLight){let w=n.point[d];w.position.setFromMatrixPosition(_.matrixWorld),w.position.applyMatrix4(m),d++}else if(_.isHemisphereLight){let w=n.hemi[y];w.direction.setFromMatrixPosition(_.matrixWorld),w.direction.transformDirection(m),y++}}}return{setup:a,setupView:c,state:n}}function Td(s){let t=new mx(s),e=[],n=[];function i(h){l.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}let l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function gx(s){let t=new WeakMap;function e(i,r=0){let o=t.get(i),a;return o===void 0?(a=new Td(s),t.set(i,[a])):r>=o.length?(a=new Td(s),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var Nl=class extends Ze{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=am,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Ul=class extends Ze{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},yx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,_x=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function xx(s,t,e){let n=new br,i=new rt,r=new rt,o=new jt,a=new Nl({depthPacking:cm}),c=new Ul,l={},h=e.maxTextureSize,u={[kn]:He,[He]:kn,[ue]:ue},d=new _n({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new rt},radius:{value:4}},vertexShader:yx,fragmentShader:_x}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let p=new Jt;p.setAttribute("position",new Te(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new Lt(p,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ef;let g=this.type;this.render=function(A,E,z){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;let N=s.getRenderTarget(),x=s.getActiveCubeFace(),S=s.getActiveMipmapLevel(),k=s.state;k.setBlending(yi),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);let I=g!==qn&&this.type===qn,F=g===qn&&this.type!==qn;for(let j=0,B=A.length;j<B;j++){let Q=A[j],W=Q.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;i.copy(W.mapSize);let lt=W.getFrameExtents();if(i.multiply(lt),r.copy(W.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/lt.x),i.x=r.x*lt.x,W.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/lt.y),i.y=r.y*lt.y,W.mapSize.y=r.y)),W.map===null||I===!0||F===!0){let vt=this.type!==qn?{minFilter:Be,magFilter:Be}:{};W.map!==null&&W.map.dispose(),W.map=new $n(i.x,i.y,vt),W.map.texture.name=Q.name+".shadowMap",W.camera.updateProjectionMatrix()}s.setRenderTarget(W.map),s.clear();let ot=W.getViewportCount();for(let vt=0;vt<ot;vt++){let Xt=W.getViewport(vt);o.set(r.x*Xt.x,r.y*Xt.y,r.x*Xt.z,r.y*Xt.w),k.viewport(o),W.updateMatrices(Q,vt),n=W.getFrustum(),w(E,z,W.camera,Q,this.type)}W.isPointLightShadow!==!0&&this.type===qn&&v(W,z),W.needsUpdate=!1}g=this.type,m.needsUpdate=!1,s.setRenderTarget(N,x,S)};function v(A,E){let z=t.update(y);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new $n(i.x,i.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,s.setRenderTarget(A.mapPass),s.clear(),s.renderBufferDirect(E,null,z,d,y,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,s.setRenderTarget(A.map),s.clear(),s.renderBufferDirect(E,null,z,f,y,null)}function _(A,E,z,N){let x=null,S=z.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(S!==void 0)x=S;else if(x=z.isPointLight===!0?c:a,s.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){let k=x.uuid,I=E.uuid,F=l[k];F===void 0&&(F={},l[k]=F);let j=F[I];j===void 0&&(j=x.clone(),F[I]=j,E.addEventListener("dispose",C)),x=j}if(x.visible=E.visible,x.wireframe=E.wireframe,N===qn?x.side=E.shadowSide!==null?E.shadowSide:E.side:x.side=E.shadowSide!==null?E.shadowSide:u[E.side],x.alphaMap=E.alphaMap,x.alphaTest=E.alphaTest,x.map=E.map,x.clipShadows=E.clipShadows,x.clippingPlanes=E.clippingPlanes,x.clipIntersection=E.clipIntersection,x.displacementMap=E.displacementMap,x.displacementScale=E.displacementScale,x.displacementBias=E.displacementBias,x.wireframeLinewidth=E.wireframeLinewidth,x.linewidth=E.linewidth,z.isPointLight===!0&&x.isMeshDistanceMaterial===!0){let k=s.properties.get(x);k.light=z}return x}function w(A,E,z,N,x){if(A.visible===!1)return;if(A.layers.test(E.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&x===qn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,A.matrixWorld);let I=t.update(A),F=A.material;if(Array.isArray(F)){let j=I.groups;for(let B=0,Q=j.length;B<Q;B++){let W=j[B],lt=F[W.materialIndex];if(lt&&lt.visible){let ot=_(A,lt,N,x);A.onBeforeShadow(s,A,E,z,I,ot,W),s.renderBufferDirect(z,null,I,ot,A,W),A.onAfterShadow(s,A,E,z,I,ot,W)}}}else if(F.visible){let j=_(A,F,N,x);A.onBeforeShadow(s,A,E,z,I,j,null),s.renderBufferDirect(z,null,I,j,A,null),A.onAfterShadow(s,A,E,z,I,j,null)}}let k=A.children;for(let I=0,F=k.length;I<F;I++)w(k[I],E,z,N,x)}function C(A){A.target.removeEventListener("dispose",C);for(let z in l){let N=l[z],x=A.target.uuid;x in N&&(N[x].dispose(),delete N[x])}}}var vx={[Wc]:Xc,[qc]:Zc,[Kc]:jc,[Ts]:Yc,[Xc]:Wc,[Zc]:qc,[jc]:Kc,[Yc]:Ts};function wx(s){function t(){let L=!1,mt=new jt,X=null,$=new jt(0,0,0,0);return{setMask:function(ft){X!==ft&&!L&&(s.colorMask(ft,ft,ft,ft),X=ft)},setLocked:function(ft){L=ft},setClear:function(ft,gt,$t,be,Qe){Qe===!0&&(ft*=be,gt*=be,$t*=be),mt.set(ft,gt,$t,be),$.equals(mt)===!1&&(s.clearColor(ft,gt,$t,be),$.copy(mt))},reset:function(){L=!1,X=null,$.set(-1,0,0,0)}}}function e(){let L=!1,mt=!1,X=null,$=null,ft=null;return{setReversed:function(gt){mt=gt},setTest:function(gt){gt?wt(s.DEPTH_TEST):ht(s.DEPTH_TEST)},setMask:function(gt){X!==gt&&!L&&(s.depthMask(gt),X=gt)},setFunc:function(gt){if(mt&&(gt=vx[gt]),$!==gt){switch(gt){case Wc:s.depthFunc(s.NEVER);break;case Xc:s.depthFunc(s.ALWAYS);break;case qc:s.depthFunc(s.LESS);break;case Ts:s.depthFunc(s.LEQUAL);break;case Kc:s.depthFunc(s.EQUAL);break;case Yc:s.depthFunc(s.GEQUAL);break;case Zc:s.depthFunc(s.GREATER);break;case jc:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}$=gt}},setLocked:function(gt){L=gt},setClear:function(gt){ft!==gt&&(s.clearDepth(gt),ft=gt)},reset:function(){L=!1,X=null,$=null,ft=null}}}function n(){let L=!1,mt=null,X=null,$=null,ft=null,gt=null,$t=null,be=null,Qe=null;return{setTest:function(te){L||(te?wt(s.STENCIL_TEST):ht(s.STENCIL_TEST))},setMask:function(te){mt!==te&&!L&&(s.stencilMask(te),mt=te)},setFunc:function(te,tn,Fn){(X!==te||$!==tn||ft!==Fn)&&(s.stencilFunc(te,tn,Fn),X=te,$=tn,ft=Fn)},setOp:function(te,tn,Fn){(gt!==te||$t!==tn||be!==Fn)&&(s.stencilOp(te,tn,Fn),gt=te,$t=tn,be=Fn)},setLocked:function(te){L=te},setClear:function(te){Qe!==te&&(s.clearStencil(te),Qe=te)},reset:function(){L=!1,mt=null,X=null,$=null,ft=null,gt=null,$t=null,be=null,Qe=null}}}let i=new t,r=new e,o=new n,a=new WeakMap,c=new WeakMap,l={},h={},u=new WeakMap,d=[],f=null,p=!1,y=null,m=null,g=null,v=null,_=null,w=null,C=null,A=new et(0,0,0),E=0,z=!1,N=null,x=null,S=null,k=null,I=null,F=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),j=!1,B=0,Q=s.getParameter(s.VERSION);Q.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(Q)[1]),j=B>=1):Q.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),j=B>=2);let W=null,lt={},ot=s.getParameter(s.SCISSOR_BOX),vt=s.getParameter(s.VIEWPORT),Xt=new jt().fromArray(ot),Bt=new jt().fromArray(vt);function Z(L,mt,X,$){let ft=new Uint8Array(4),gt=s.createTexture();s.bindTexture(L,gt),s.texParameteri(L,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(L,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let $t=0;$t<X;$t++)L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY?s.texImage3D(mt,0,s.RGBA,1,1,$,0,s.RGBA,s.UNSIGNED_BYTE,ft):s.texImage2D(mt+$t,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,ft);return gt}let tt={};tt[s.TEXTURE_2D]=Z(s.TEXTURE_2D,s.TEXTURE_2D,1),tt[s.TEXTURE_CUBE_MAP]=Z(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),tt[s.TEXTURE_2D_ARRAY]=Z(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),tt[s.TEXTURE_3D]=Z(s.TEXTURE_3D,s.TEXTURE_3D,1,1),i.setClear(0,0,0,1),r.setClear(1),o.setClear(0),wt(s.DEPTH_TEST),r.setFunc(Ts),qt(!1),G(Nu),wt(s.CULL_FACE),P(yi);function wt(L){l[L]!==!0&&(s.enable(L),l[L]=!0)}function ht(L){l[L]!==!1&&(s.disable(L),l[L]=!1)}function Dt(L,mt){return h[L]!==mt?(s.bindFramebuffer(L,mt),h[L]=mt,L===s.DRAW_FRAMEBUFFER&&(h[s.FRAMEBUFFER]=mt),L===s.FRAMEBUFFER&&(h[s.DRAW_FRAMEBUFFER]=mt),!0):!1}function Pt(L,mt){let X=d,$=!1;if(L){X=u.get(mt),X===void 0&&(X=[],u.set(mt,X));let ft=L.textures;if(X.length!==ft.length||X[0]!==s.COLOR_ATTACHMENT0){for(let gt=0,$t=ft.length;gt<$t;gt++)X[gt]=s.COLOR_ATTACHMENT0+gt;X.length=ft.length,$=!0}}else X[0]!==s.BACK&&(X[0]=s.BACK,$=!0);$&&s.drawBuffers(X)}function Ht(L){return f!==L?(s.useProgram(L),f=L,!0):!1}let Zt={[Ui]:s.FUNC_ADD,[kp]:s.FUNC_SUBTRACT,[Lp]:s.FUNC_REVERSE_SUBTRACT};Zt[Dp]=s.MIN,Zt[Np]=s.MAX;let Vt={[Up]:s.ZERO,[Op]:s.ONE,[Fp]:s.SRC_COLOR,[Vc]:s.SRC_ALPHA,[Xp]:s.SRC_ALPHA_SATURATE,[Gp]:s.DST_COLOR,[Hp]:s.DST_ALPHA,[Bp]:s.ONE_MINUS_SRC_COLOR,[Gc]:s.ONE_MINUS_SRC_ALPHA,[Wp]:s.ONE_MINUS_DST_COLOR,[Vp]:s.ONE_MINUS_DST_ALPHA,[qp]:s.CONSTANT_COLOR,[Kp]:s.ONE_MINUS_CONSTANT_COLOR,[Yp]:s.CONSTANT_ALPHA,[Zp]:s.ONE_MINUS_CONSTANT_ALPHA};function P(L,mt,X,$,ft,gt,$t,be,Qe,te){if(L===yi){p===!0&&(ht(s.BLEND),p=!1);return}if(p===!1&&(wt(s.BLEND),p=!0),L!==Ip){if(L!==y||te!==z){if((m!==Ui||_!==Ui)&&(s.blendEquation(s.FUNC_ADD),m=Ui,_=Ui),te)switch(L){case Ms:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case zn:s.blendFunc(s.ONE,s.ONE);break;case Uu:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Uo:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Ms:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case zn:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case Uu:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Uo:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}g=null,v=null,w=null,C=null,A.set(0,0,0),E=0,y=L,z=te}return}ft=ft||mt,gt=gt||X,$t=$t||$,(mt!==m||ft!==_)&&(s.blendEquationSeparate(Zt[mt],Zt[ft]),m=mt,_=ft),(X!==g||$!==v||gt!==w||$t!==C)&&(s.blendFuncSeparate(Vt[X],Vt[$],Vt[gt],Vt[$t]),g=X,v=$,w=gt,C=$t),(be.equals(A)===!1||Qe!==E)&&(s.blendColor(be.r,be.g,be.b,Qe),A.copy(be),E=Qe),y=L,z=!1}function qe(L,mt){L.side===ue?ht(s.CULL_FACE):wt(s.CULL_FACE);let X=L.side===He;mt&&(X=!X),qt(X),L.blending===Ms&&L.transparent===!1?P(yi):P(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),r.setFunc(L.depthFunc),r.setTest(L.depthTest),r.setMask(L.depthWrite),i.setMask(L.colorWrite);let $=L.stencilWrite;o.setTest($),$&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),J(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?wt(s.SAMPLE_ALPHA_TO_COVERAGE):ht(s.SAMPLE_ALPHA_TO_COVERAGE)}function qt(L){N!==L&&(L?s.frontFace(s.CW):s.frontFace(s.CCW),N=L)}function G(L){L!==zp?(wt(s.CULL_FACE),L!==x&&(L===Nu?s.cullFace(s.BACK):L===Pp?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):ht(s.CULL_FACE),x=L}function it(L){L!==S&&(j&&s.lineWidth(L),S=L)}function J(L,mt,X){L?(wt(s.POLYGON_OFFSET_FILL),(k!==mt||I!==X)&&(s.polygonOffset(mt,X),k=mt,I=X)):ht(s.POLYGON_OFFSET_FILL)}function dt(L){L?wt(s.SCISSOR_TEST):ht(s.SCISSOR_TEST)}function R(L){L===void 0&&(L=s.TEXTURE0+F-1),W!==L&&(s.activeTexture(L),W=L)}function b(L,mt,X){X===void 0&&(W===null?X=s.TEXTURE0+F-1:X=W);let $=lt[X];$===void 0&&($={type:void 0,texture:void 0},lt[X]=$),($.type!==L||$.texture!==mt)&&(W!==X&&(s.activeTexture(X),W=X),s.bindTexture(L,mt||tt[L]),$.type=L,$.texture=mt)}function O(){let L=lt[W];L!==void 0&&L.type!==void 0&&(s.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function q(){try{s.compressedTexImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function K(){try{s.compressedTexImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Y(){try{s.texSubImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function St(){try{s.texSubImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ct(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ut(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Gt(){try{s.texStorage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function nt(){try{s.texStorage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function _t(){try{s.texImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Ct(){try{s.texImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function zt(L){Xt.equals(L)===!1&&(s.scissor(L.x,L.y,L.z,L.w),Xt.copy(L))}function yt(L){Bt.equals(L)===!1&&(s.viewport(L.x,L.y,L.z,L.w),Bt.copy(L))}function Kt(L,mt){let X=c.get(mt);X===void 0&&(X=new WeakMap,c.set(mt,X));let $=X.get(L);$===void 0&&($=s.getUniformBlockIndex(mt,L.name),X.set(L,$))}function Nt(L,mt){let $=c.get(mt).get(L);a.get(mt)!==$&&(s.uniformBlockBinding(mt,$,L.__bindingPointIndex),a.set(mt,$))}function ae(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),l={},W=null,lt={},h={},u=new WeakMap,d=[],f=null,p=!1,y=null,m=null,g=null,v=null,_=null,w=null,C=null,A=new et(0,0,0),E=0,z=!1,N=null,x=null,S=null,k=null,I=null,Xt.set(0,0,s.canvas.width,s.canvas.height),Bt.set(0,0,s.canvas.width,s.canvas.height),i.reset(),r.reset(),o.reset()}return{buffers:{color:i,depth:r,stencil:o},enable:wt,disable:ht,bindFramebuffer:Dt,drawBuffers:Pt,useProgram:Ht,setBlending:P,setMaterial:qe,setFlipSided:qt,setCullFace:G,setLineWidth:it,setPolygonOffset:J,setScissorTest:dt,activeTexture:R,bindTexture:b,unbindTexture:O,compressedTexImage2D:q,compressedTexImage3D:K,texImage2D:_t,texImage3D:Ct,updateUBOMapping:Kt,uniformBlockBinding:Nt,texStorage2D:Gt,texStorage3D:nt,texSubImage2D:Y,texSubImage3D:St,compressedTexSubImage2D:ct,compressedTexSubImage3D:ut,scissor:zt,viewport:yt,reset:ae}}function Ed(s,t,e,n){let i=Mx(n);switch(e){case af:return s*t;case lf:return s*t;case hf:return s*t*2;case _h:return s*t/i.components*i.byteLength;case xh:return s*t/i.components*i.byteLength;case uf:return s*t*2/i.components*i.byteLength;case vh:return s*t*2/i.components*i.byteLength;case cf:return s*t*3/i.components*i.byteLength;case gn:return s*t*4/i.components*i.byteLength;case wh:return s*t*4/i.components*i.byteLength;case Po:case Io:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case ko:case Lo:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Qc:case el:return Math.max(s,16)*Math.max(t,8)/4;case $c:case tl:return Math.max(s,8)*Math.max(t,8)/2;case nl:case il:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case sl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case rl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case ol:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case al:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case cl:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case ll:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case hl:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case ul:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case dl:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case fl:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case pl:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case ml:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case gl:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case yl:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case _l:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case Do:case xl:case vl:return Math.ceil(s/4)*Math.ceil(t/4)*16;case df:case wl:return Math.ceil(s/4)*Math.ceil(t/4)*8;case Ml:case bl:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Mx(s){switch(s){case jn:case sf:return{byteLength:1,components:1};case vr:case rf:case Lr:return{byteLength:2,components:1};case gh:case yh:return{byteLength:2,components:4};case Bi:case mh:case Cn:return{byteLength:4,components:1};case of:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function bx(s,t,e,n,i,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new rt,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(R,b){return f?new OffscreenCanvas(R,b):wr("canvas")}function y(R,b,O){let q=1,K=dt(R);if((K.width>O||K.height>O)&&(q=O/Math.max(K.width,K.height)),q<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let Y=Math.floor(q*K.width),St=Math.floor(q*K.height);u===void 0&&(u=p(Y,St));let ct=b?p(Y,St):u;return ct.width=Y,ct.height=St,ct.getContext("2d").drawImage(R,0,0,Y,St),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+Y+"x"+St+")."),ct}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),R;return R}function m(R){return R.generateMipmaps&&R.minFilter!==Be&&R.minFilter!==en}function g(R){s.generateMipmap(R)}function v(R,b,O,q,K=!1){if(R!==null){if(s[R]!==void 0)return s[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let Y=b;if(b===s.RED&&(O===s.FLOAT&&(Y=s.R32F),O===s.HALF_FLOAT&&(Y=s.R16F),O===s.UNSIGNED_BYTE&&(Y=s.R8)),b===s.RED_INTEGER&&(O===s.UNSIGNED_BYTE&&(Y=s.R8UI),O===s.UNSIGNED_SHORT&&(Y=s.R16UI),O===s.UNSIGNED_INT&&(Y=s.R32UI),O===s.BYTE&&(Y=s.R8I),O===s.SHORT&&(Y=s.R16I),O===s.INT&&(Y=s.R32I)),b===s.RG&&(O===s.FLOAT&&(Y=s.RG32F),O===s.HALF_FLOAT&&(Y=s.RG16F),O===s.UNSIGNED_BYTE&&(Y=s.RG8)),b===s.RG_INTEGER&&(O===s.UNSIGNED_BYTE&&(Y=s.RG8UI),O===s.UNSIGNED_SHORT&&(Y=s.RG16UI),O===s.UNSIGNED_INT&&(Y=s.RG32UI),O===s.BYTE&&(Y=s.RG8I),O===s.SHORT&&(Y=s.RG16I),O===s.INT&&(Y=s.RG32I)),b===s.RGB_INTEGER&&(O===s.UNSIGNED_BYTE&&(Y=s.RGB8UI),O===s.UNSIGNED_SHORT&&(Y=s.RGB16UI),O===s.UNSIGNED_INT&&(Y=s.RGB32UI),O===s.BYTE&&(Y=s.RGB8I),O===s.SHORT&&(Y=s.RGB16I),O===s.INT&&(Y=s.RGB32I)),b===s.RGBA_INTEGER&&(O===s.UNSIGNED_BYTE&&(Y=s.RGBA8UI),O===s.UNSIGNED_SHORT&&(Y=s.RGBA16UI),O===s.UNSIGNED_INT&&(Y=s.RGBA32UI),O===s.BYTE&&(Y=s.RGBA8I),O===s.SHORT&&(Y=s.RGBA16I),O===s.INT&&(Y=s.RGBA32I)),b===s.RGB&&O===s.UNSIGNED_INT_5_9_9_9_REV&&(Y=s.RGB9_E5),b===s.RGBA){let St=K?Fo:Qt.getTransfer(q);O===s.FLOAT&&(Y=s.RGBA32F),O===s.HALF_FLOAT&&(Y=s.RGBA16F),O===s.UNSIGNED_BYTE&&(Y=St===he?s.SRGB8_ALPHA8:s.RGBA8),O===s.UNSIGNED_SHORT_4_4_4_4&&(Y=s.RGBA4),O===s.UNSIGNED_SHORT_5_5_5_1&&(Y=s.RGB5_A1)}return(Y===s.R16F||Y===s.R32F||Y===s.RG16F||Y===s.RG32F||Y===s.RGBA16F||Y===s.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function _(R,b){let O;return R?b===null||b===Bi||b===Cs?O=s.DEPTH24_STENCIL8:b===Cn?O=s.DEPTH32F_STENCIL8:b===vr&&(O=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Bi||b===Cs?O=s.DEPTH_COMPONENT24:b===Cn?O=s.DEPTH_COMPONENT32F:b===vr&&(O=s.DEPTH_COMPONENT16),O}function w(R,b){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Be&&R.minFilter!==en?Math.log2(Math.max(b.width,b.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?b.mipmaps.length:1}function C(R){let b=R.target;b.removeEventListener("dispose",C),E(b),b.isVideoTexture&&h.delete(b)}function A(R){let b=R.target;b.removeEventListener("dispose",A),N(b)}function E(R){let b=n.get(R);if(b.__webglInit===void 0)return;let O=R.source,q=d.get(O);if(q){let K=q[b.__cacheKey];K.usedTimes--,K.usedTimes===0&&z(R),Object.keys(q).length===0&&d.delete(O)}n.remove(R)}function z(R){let b=n.get(R);s.deleteTexture(b.__webglTexture);let O=R.source,q=d.get(O);delete q[b.__cacheKey],o.memory.textures--}function N(R){let b=n.get(R);if(R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(b.__webglFramebuffer[q]))for(let K=0;K<b.__webglFramebuffer[q].length;K++)s.deleteFramebuffer(b.__webglFramebuffer[q][K]);else s.deleteFramebuffer(b.__webglFramebuffer[q]);b.__webglDepthbuffer&&s.deleteRenderbuffer(b.__webglDepthbuffer[q])}else{if(Array.isArray(b.__webglFramebuffer))for(let q=0;q<b.__webglFramebuffer.length;q++)s.deleteFramebuffer(b.__webglFramebuffer[q]);else s.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&s.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&s.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let q=0;q<b.__webglColorRenderbuffer.length;q++)b.__webglColorRenderbuffer[q]&&s.deleteRenderbuffer(b.__webglColorRenderbuffer[q]);b.__webglDepthRenderbuffer&&s.deleteRenderbuffer(b.__webglDepthRenderbuffer)}let O=R.textures;for(let q=0,K=O.length;q<K;q++){let Y=n.get(O[q]);Y.__webglTexture&&(s.deleteTexture(Y.__webglTexture),o.memory.textures--),n.remove(O[q])}n.remove(R)}let x=0;function S(){x=0}function k(){let R=x;return R>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+i.maxTextures),x+=1,R}function I(R){let b=[];return b.push(R.wrapS),b.push(R.wrapT),b.push(R.wrapR||0),b.push(R.magFilter),b.push(R.minFilter),b.push(R.anisotropy),b.push(R.internalFormat),b.push(R.format),b.push(R.type),b.push(R.generateMipmaps),b.push(R.premultiplyAlpha),b.push(R.flipY),b.push(R.unpackAlignment),b.push(R.colorSpace),b.join()}function F(R,b){let O=n.get(R);if(R.isVideoTexture&&it(R),R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){let q=R.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Bt(O,R,b);return}}e.bindTexture(s.TEXTURE_2D,O.__webglTexture,s.TEXTURE0+b)}function j(R,b){let O=n.get(R);if(R.version>0&&O.__version!==R.version){Bt(O,R,b);return}e.bindTexture(s.TEXTURE_2D_ARRAY,O.__webglTexture,s.TEXTURE0+b)}function B(R,b){let O=n.get(R);if(R.version>0&&O.__version!==R.version){Bt(O,R,b);return}e.bindTexture(s.TEXTURE_3D,O.__webglTexture,s.TEXTURE0+b)}function Q(R,b){let O=n.get(R);if(R.version>0&&O.__version!==R.version){Z(O,R,b);return}e.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture,s.TEXTURE0+b)}let W={[Ln]:s.REPEAT,[Yn]:s.CLAMP_TO_EDGE,[xr]:s.MIRRORED_REPEAT},lt={[Be]:s.NEAREST,[ph]:s.NEAREST_MIPMAP_NEAREST,[ys]:s.NEAREST_MIPMAP_LINEAR,[en]:s.LINEAR,[ur]:s.LINEAR_MIPMAP_NEAREST,[In]:s.LINEAR_MIPMAP_LINEAR},ot={[hm]:s.NEVER,[gm]:s.ALWAYS,[um]:s.LESS,[mf]:s.LEQUAL,[dm]:s.EQUAL,[mm]:s.GEQUAL,[fm]:s.GREATER,[pm]:s.NOTEQUAL};function vt(R,b){if(b.type===Cn&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===en||b.magFilter===ur||b.magFilter===ys||b.magFilter===In||b.minFilter===en||b.minFilter===ur||b.minFilter===ys||b.minFilter===In)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(R,s.TEXTURE_WRAP_S,W[b.wrapS]),s.texParameteri(R,s.TEXTURE_WRAP_T,W[b.wrapT]),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,W[b.wrapR]),s.texParameteri(R,s.TEXTURE_MAG_FILTER,lt[b.magFilter]),s.texParameteri(R,s.TEXTURE_MIN_FILTER,lt[b.minFilter]),b.compareFunction&&(s.texParameteri(R,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(R,s.TEXTURE_COMPARE_FUNC,ot[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Be||b.minFilter!==ys&&b.minFilter!==In||b.type===Cn&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){let O=t.get("EXT_texture_filter_anisotropic");s.texParameterf(R,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,i.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function Xt(R,b){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,b.addEventListener("dispose",C));let q=b.source,K=d.get(q);K===void 0&&(K={},d.set(q,K));let Y=I(b);if(Y!==R.__cacheKey){K[Y]===void 0&&(K[Y]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,O=!0),K[Y].usedTimes++;let St=K[R.__cacheKey];St!==void 0&&(K[R.__cacheKey].usedTimes--,St.usedTimes===0&&z(b)),R.__cacheKey=Y,R.__webglTexture=K[Y].texture}return O}function Bt(R,b,O){let q=s.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(q=s.TEXTURE_2D_ARRAY),b.isData3DTexture&&(q=s.TEXTURE_3D);let K=Xt(R,b),Y=b.source;e.bindTexture(q,R.__webglTexture,s.TEXTURE0+O);let St=n.get(Y);if(Y.version!==St.__version||K===!0){e.activeTexture(s.TEXTURE0+O);let ct=Qt.getPrimaries(Qt.workingColorSpace),ut=b.colorSpace===pi?null:Qt.getPrimaries(b.colorSpace),Gt=b.colorSpace===pi||ct===ut?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,b.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,b.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Gt);let nt=y(b.image,!1,i.maxTextureSize);nt=J(b,nt);let _t=r.convert(b.format,b.colorSpace),Ct=r.convert(b.type),zt=v(b.internalFormat,_t,Ct,b.colorSpace,b.isVideoTexture);vt(q,b);let yt,Kt=b.mipmaps,Nt=b.isVideoTexture!==!0,ae=St.__version===void 0||K===!0,L=Y.dataReady,mt=w(b,nt);if(b.isDepthTexture)zt=_(b.format===zs,b.type),ae&&(Nt?e.texStorage2D(s.TEXTURE_2D,1,zt,nt.width,nt.height):e.texImage2D(s.TEXTURE_2D,0,zt,nt.width,nt.height,0,_t,Ct,null));else if(b.isDataTexture)if(Kt.length>0){Nt&&ae&&e.texStorage2D(s.TEXTURE_2D,mt,zt,Kt[0].width,Kt[0].height);for(let X=0,$=Kt.length;X<$;X++)yt=Kt[X],Nt?L&&e.texSubImage2D(s.TEXTURE_2D,X,0,0,yt.width,yt.height,_t,Ct,yt.data):e.texImage2D(s.TEXTURE_2D,X,zt,yt.width,yt.height,0,_t,Ct,yt.data);b.generateMipmaps=!1}else Nt?(ae&&e.texStorage2D(s.TEXTURE_2D,mt,zt,nt.width,nt.height),L&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,nt.width,nt.height,_t,Ct,nt.data)):e.texImage2D(s.TEXTURE_2D,0,zt,nt.width,nt.height,0,_t,Ct,nt.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Nt&&ae&&e.texStorage3D(s.TEXTURE_2D_ARRAY,mt,zt,Kt[0].width,Kt[0].height,nt.depth);for(let X=0,$=Kt.length;X<$;X++)if(yt=Kt[X],b.format!==gn)if(_t!==null)if(Nt){if(L)if(b.layerUpdates.size>0){let ft=Ed(yt.width,yt.height,b.format,b.type);for(let gt of b.layerUpdates){let $t=yt.data.subarray(gt*ft/yt.data.BYTES_PER_ELEMENT,(gt+1)*ft/yt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,X,0,0,gt,yt.width,yt.height,1,_t,$t,0,0)}b.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,X,0,0,0,yt.width,yt.height,nt.depth,_t,yt.data,0,0)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,X,zt,yt.width,yt.height,nt.depth,0,yt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Nt?L&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,X,0,0,0,yt.width,yt.height,nt.depth,_t,Ct,yt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,X,zt,yt.width,yt.height,nt.depth,0,_t,Ct,yt.data)}else{Nt&&ae&&e.texStorage2D(s.TEXTURE_2D,mt,zt,Kt[0].width,Kt[0].height);for(let X=0,$=Kt.length;X<$;X++)yt=Kt[X],b.format!==gn?_t!==null?Nt?L&&e.compressedTexSubImage2D(s.TEXTURE_2D,X,0,0,yt.width,yt.height,_t,yt.data):e.compressedTexImage2D(s.TEXTURE_2D,X,zt,yt.width,yt.height,0,yt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Nt?L&&e.texSubImage2D(s.TEXTURE_2D,X,0,0,yt.width,yt.height,_t,Ct,yt.data):e.texImage2D(s.TEXTURE_2D,X,zt,yt.width,yt.height,0,_t,Ct,yt.data)}else if(b.isDataArrayTexture)if(Nt){if(ae&&e.texStorage3D(s.TEXTURE_2D_ARRAY,mt,zt,nt.width,nt.height,nt.depth),L)if(b.layerUpdates.size>0){let X=Ed(nt.width,nt.height,b.format,b.type);for(let $ of b.layerUpdates){let ft=nt.data.subarray($*X/nt.data.BYTES_PER_ELEMENT,($+1)*X/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,$,nt.width,nt.height,1,_t,Ct,ft)}b.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,_t,Ct,nt.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,zt,nt.width,nt.height,nt.depth,0,_t,Ct,nt.data);else if(b.isData3DTexture)Nt?(ae&&e.texStorage3D(s.TEXTURE_3D,mt,zt,nt.width,nt.height,nt.depth),L&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,_t,Ct,nt.data)):e.texImage3D(s.TEXTURE_3D,0,zt,nt.width,nt.height,nt.depth,0,_t,Ct,nt.data);else if(b.isFramebufferTexture){if(ae)if(Nt)e.texStorage2D(s.TEXTURE_2D,mt,zt,nt.width,nt.height);else{let X=nt.width,$=nt.height;for(let ft=0;ft<mt;ft++)e.texImage2D(s.TEXTURE_2D,ft,zt,X,$,0,_t,Ct,null),X>>=1,$>>=1}}else if(Kt.length>0){if(Nt&&ae){let X=dt(Kt[0]);e.texStorage2D(s.TEXTURE_2D,mt,zt,X.width,X.height)}for(let X=0,$=Kt.length;X<$;X++)yt=Kt[X],Nt?L&&e.texSubImage2D(s.TEXTURE_2D,X,0,0,_t,Ct,yt):e.texImage2D(s.TEXTURE_2D,X,zt,_t,Ct,yt);b.generateMipmaps=!1}else if(Nt){if(ae){let X=dt(nt);e.texStorage2D(s.TEXTURE_2D,mt,zt,X.width,X.height)}L&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,_t,Ct,nt)}else e.texImage2D(s.TEXTURE_2D,0,zt,_t,Ct,nt);m(b)&&g(q),St.__version=Y.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function Z(R,b,O){if(b.image.length!==6)return;let q=Xt(R,b),K=b.source;e.bindTexture(s.TEXTURE_CUBE_MAP,R.__webglTexture,s.TEXTURE0+O);let Y=n.get(K);if(K.version!==Y.__version||q===!0){e.activeTexture(s.TEXTURE0+O);let St=Qt.getPrimaries(Qt.workingColorSpace),ct=b.colorSpace===pi?null:Qt.getPrimaries(b.colorSpace),ut=b.colorSpace===pi||St===ct?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,b.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,b.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ut);let Gt=b.isCompressedTexture||b.image[0].isCompressedTexture,nt=b.image[0]&&b.image[0].isDataTexture,_t=[];for(let $=0;$<6;$++)!Gt&&!nt?_t[$]=y(b.image[$],!0,i.maxCubemapSize):_t[$]=nt?b.image[$].image:b.image[$],_t[$]=J(b,_t[$]);let Ct=_t[0],zt=r.convert(b.format,b.colorSpace),yt=r.convert(b.type),Kt=v(b.internalFormat,zt,yt,b.colorSpace),Nt=b.isVideoTexture!==!0,ae=Y.__version===void 0||q===!0,L=K.dataReady,mt=w(b,Ct);vt(s.TEXTURE_CUBE_MAP,b);let X;if(Gt){Nt&&ae&&e.texStorage2D(s.TEXTURE_CUBE_MAP,mt,Kt,Ct.width,Ct.height);for(let $=0;$<6;$++){X=_t[$].mipmaps;for(let ft=0;ft<X.length;ft++){let gt=X[ft];b.format!==gn?zt!==null?Nt?L&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ft,0,0,gt.width,gt.height,zt,gt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ft,Kt,gt.width,gt.height,0,gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Nt?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ft,0,0,gt.width,gt.height,zt,yt,gt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ft,Kt,gt.width,gt.height,0,zt,yt,gt.data)}}}else{if(X=b.mipmaps,Nt&&ae){X.length>0&&mt++;let $=dt(_t[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,mt,Kt,$.width,$.height)}for(let $=0;$<6;$++)if(nt){Nt?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,_t[$].width,_t[$].height,zt,yt,_t[$].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Kt,_t[$].width,_t[$].height,0,zt,yt,_t[$].data);for(let ft=0;ft<X.length;ft++){let $t=X[ft].image[$].image;Nt?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ft+1,0,0,$t.width,$t.height,zt,yt,$t.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ft+1,Kt,$t.width,$t.height,0,zt,yt,$t.data)}}else{Nt?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,zt,yt,_t[$]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Kt,zt,yt,_t[$]);for(let ft=0;ft<X.length;ft++){let gt=X[ft];Nt?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ft+1,0,0,zt,yt,gt.image[$]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ft+1,Kt,zt,yt,gt.image[$])}}}m(b)&&g(s.TEXTURE_CUBE_MAP),Y.__version=K.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function tt(R,b,O,q,K,Y){let St=r.convert(O.format,O.colorSpace),ct=r.convert(O.type),ut=v(O.internalFormat,St,ct,O.colorSpace);if(!n.get(b).__hasExternalTextures){let nt=Math.max(1,b.width>>Y),_t=Math.max(1,b.height>>Y);K===s.TEXTURE_3D||K===s.TEXTURE_2D_ARRAY?e.texImage3D(K,Y,ut,nt,_t,b.depth,0,St,ct,null):e.texImage2D(K,Y,ut,nt,_t,0,St,ct,null)}e.bindFramebuffer(s.FRAMEBUFFER,R),G(b)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,q,K,n.get(O).__webglTexture,0,qt(b)):(K===s.TEXTURE_2D||K>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,q,K,n.get(O).__webglTexture,Y),e.bindFramebuffer(s.FRAMEBUFFER,null)}function wt(R,b,O){if(s.bindRenderbuffer(s.RENDERBUFFER,R),b.depthBuffer){let q=b.depthTexture,K=q&&q.isDepthTexture?q.type:null,Y=_(b.stencilBuffer,K),St=b.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ct=qt(b);G(b)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ct,Y,b.width,b.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,ct,Y,b.width,b.height):s.renderbufferStorage(s.RENDERBUFFER,Y,b.width,b.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,St,s.RENDERBUFFER,R)}else{let q=b.textures;for(let K=0;K<q.length;K++){let Y=q[K],St=r.convert(Y.format,Y.colorSpace),ct=r.convert(Y.type),ut=v(Y.internalFormat,St,ct,Y.colorSpace),Gt=qt(b);O&&G(b)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Gt,ut,b.width,b.height):G(b)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Gt,ut,b.width,b.height):s.renderbufferStorage(s.RENDERBUFFER,ut,b.width,b.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function ht(R,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,R),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(b.depthTexture).__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),F(b.depthTexture,0);let q=n.get(b.depthTexture).__webglTexture,K=qt(b);if(b.depthTexture.format===bs)G(b)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,q,0,K):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,q,0);else if(b.depthTexture.format===zs)G(b)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,q,0,K):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,q,0);else throw new Error("Unknown depthTexture format")}function Dt(R){let b=n.get(R),O=R.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==R.depthTexture){let q=R.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),q){let K=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,q.removeEventListener("dispose",K)};q.addEventListener("dispose",K),b.__depthDisposeCallback=K}b.__boundDepthTexture=q}if(R.depthTexture&&!b.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");ht(b.__webglFramebuffer,R)}else if(O){b.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(e.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer[q]),b.__webglDepthbuffer[q]===void 0)b.__webglDepthbuffer[q]=s.createRenderbuffer(),wt(b.__webglDepthbuffer[q],R,!1);else{let K=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Y=b.__webglDepthbuffer[q];s.bindRenderbuffer(s.RENDERBUFFER,Y),s.framebufferRenderbuffer(s.FRAMEBUFFER,K,s.RENDERBUFFER,Y)}}else if(e.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=s.createRenderbuffer(),wt(b.__webglDepthbuffer,R,!1);else{let q=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,K=b.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,K),s.framebufferRenderbuffer(s.FRAMEBUFFER,q,s.RENDERBUFFER,K)}e.bindFramebuffer(s.FRAMEBUFFER,null)}function Pt(R,b,O){let q=n.get(R);b!==void 0&&tt(q.__webglFramebuffer,R,R.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),O!==void 0&&Dt(R)}function Ht(R){let b=R.texture,O=n.get(R),q=n.get(b);R.addEventListener("dispose",A);let K=R.textures,Y=R.isWebGLCubeRenderTarget===!0,St=K.length>1;if(St||(q.__webglTexture===void 0&&(q.__webglTexture=s.createTexture()),q.__version=b.version,o.memory.textures++),Y){O.__webglFramebuffer=[];for(let ct=0;ct<6;ct++)if(b.mipmaps&&b.mipmaps.length>0){O.__webglFramebuffer[ct]=[];for(let ut=0;ut<b.mipmaps.length;ut++)O.__webglFramebuffer[ct][ut]=s.createFramebuffer()}else O.__webglFramebuffer[ct]=s.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){O.__webglFramebuffer=[];for(let ct=0;ct<b.mipmaps.length;ct++)O.__webglFramebuffer[ct]=s.createFramebuffer()}else O.__webglFramebuffer=s.createFramebuffer();if(St)for(let ct=0,ut=K.length;ct<ut;ct++){let Gt=n.get(K[ct]);Gt.__webglTexture===void 0&&(Gt.__webglTexture=s.createTexture(),o.memory.textures++)}if(R.samples>0&&G(R)===!1){O.__webglMultisampledFramebuffer=s.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let ct=0;ct<K.length;ct++){let ut=K[ct];O.__webglColorRenderbuffer[ct]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,O.__webglColorRenderbuffer[ct]);let Gt=r.convert(ut.format,ut.colorSpace),nt=r.convert(ut.type),_t=v(ut.internalFormat,Gt,nt,ut.colorSpace,R.isXRRenderTarget===!0),Ct=qt(R);s.renderbufferStorageMultisample(s.RENDERBUFFER,Ct,_t,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ct,s.RENDERBUFFER,O.__webglColorRenderbuffer[ct])}s.bindRenderbuffer(s.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=s.createRenderbuffer(),wt(O.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Y){e.bindTexture(s.TEXTURE_CUBE_MAP,q.__webglTexture),vt(s.TEXTURE_CUBE_MAP,b);for(let ct=0;ct<6;ct++)if(b.mipmaps&&b.mipmaps.length>0)for(let ut=0;ut<b.mipmaps.length;ut++)tt(O.__webglFramebuffer[ct][ut],R,b,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ct,ut);else tt(O.__webglFramebuffer[ct],R,b,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0);m(b)&&g(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(St){for(let ct=0,ut=K.length;ct<ut;ct++){let Gt=K[ct],nt=n.get(Gt);e.bindTexture(s.TEXTURE_2D,nt.__webglTexture),vt(s.TEXTURE_2D,Gt),tt(O.__webglFramebuffer,R,Gt,s.COLOR_ATTACHMENT0+ct,s.TEXTURE_2D,0),m(Gt)&&g(s.TEXTURE_2D)}e.unbindTexture()}else{let ct=s.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ct=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(ct,q.__webglTexture),vt(ct,b),b.mipmaps&&b.mipmaps.length>0)for(let ut=0;ut<b.mipmaps.length;ut++)tt(O.__webglFramebuffer[ut],R,b,s.COLOR_ATTACHMENT0,ct,ut);else tt(O.__webglFramebuffer,R,b,s.COLOR_ATTACHMENT0,ct,0);m(b)&&g(ct),e.unbindTexture()}R.depthBuffer&&Dt(R)}function Zt(R){let b=R.textures;for(let O=0,q=b.length;O<q;O++){let K=b[O];if(m(K)){let Y=R.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,St=n.get(K).__webglTexture;e.bindTexture(Y,St),g(Y),e.unbindTexture()}}}let Vt=[],P=[];function qe(R){if(R.samples>0){if(G(R)===!1){let b=R.textures,O=R.width,q=R.height,K=s.COLOR_BUFFER_BIT,Y=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,St=n.get(R),ct=b.length>1;if(ct)for(let ut=0;ut<b.length;ut++)e.bindFramebuffer(s.FRAMEBUFFER,St.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,St.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,St.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,St.__webglFramebuffer);for(let ut=0;ut<b.length;ut++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(K|=s.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(K|=s.STENCIL_BUFFER_BIT)),ct){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,St.__webglColorRenderbuffer[ut]);let Gt=n.get(b[ut]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Gt,0)}s.blitFramebuffer(0,0,O,q,0,0,O,q,K,s.NEAREST),c===!0&&(Vt.length=0,P.length=0,Vt.push(s.COLOR_ATTACHMENT0+ut),R.depthBuffer&&R.resolveDepthBuffer===!1&&(Vt.push(Y),P.push(Y),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,P)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Vt))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ct)for(let ut=0;ut<b.length;ut++){e.bindFramebuffer(s.FRAMEBUFFER,St.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.RENDERBUFFER,St.__webglColorRenderbuffer[ut]);let Gt=n.get(b[ut]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,St.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.TEXTURE_2D,Gt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,St.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){let b=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[b])}}}function qt(R){return Math.min(i.maxSamples,R.samples)}function G(R){let b=n.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function it(R){let b=o.render.frame;h.get(R)!==b&&(h.set(R,b),R.update())}function J(R,b){let O=R.colorSpace,q=R.format,K=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||O!==Le&&O!==pi&&(Qt.getTransfer(O)===he?(q!==gn||K!==jn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),b}function dt(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=k,this.resetTextureUnits=S,this.setTexture2D=F,this.setTexture2DArray=j,this.setTexture3D=B,this.setTextureCube=Q,this.rebindTextures=Pt,this.setupRenderTarget=Ht,this.updateRenderTargetMipmap=Zt,this.updateMultisampleRenderTarget=qe,this.setupDepthRenderbuffer=Dt,this.setupFrameBufferTexture=tt,this.useMultisampledRTT=G}function Sx(s,t){function e(n,i=pi){let r,o=Qt.getTransfer(i);if(n===jn)return s.UNSIGNED_BYTE;if(n===gh)return s.UNSIGNED_SHORT_4_4_4_4;if(n===yh)return s.UNSIGNED_SHORT_5_5_5_1;if(n===of)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===sf)return s.BYTE;if(n===rf)return s.SHORT;if(n===vr)return s.UNSIGNED_SHORT;if(n===mh)return s.INT;if(n===Bi)return s.UNSIGNED_INT;if(n===Cn)return s.FLOAT;if(n===Lr)return s.HALF_FLOAT;if(n===af)return s.ALPHA;if(n===cf)return s.RGB;if(n===gn)return s.RGBA;if(n===lf)return s.LUMINANCE;if(n===hf)return s.LUMINANCE_ALPHA;if(n===bs)return s.DEPTH_COMPONENT;if(n===zs)return s.DEPTH_STENCIL;if(n===_h)return s.RED;if(n===xh)return s.RED_INTEGER;if(n===uf)return s.RG;if(n===vh)return s.RG_INTEGER;if(n===wh)return s.RGBA_INTEGER;if(n===Po||n===Io||n===ko||n===Lo)if(o===he)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Po)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Io)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ko)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Lo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Po)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Io)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ko)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Lo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===$c||n===Qc||n===tl||n===el)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===$c)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Qc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===tl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===el)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===nl||n===il||n===sl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===nl||n===il)return o===he?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===sl)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===rl||n===ol||n===al||n===cl||n===ll||n===hl||n===ul||n===dl||n===fl||n===pl||n===ml||n===gl||n===yl||n===_l)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===rl)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ol)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===al)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===cl)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ll)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===hl)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ul)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===dl)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===fl)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===pl)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ml)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===gl)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===yl)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===_l)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Do||n===xl||n===vl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Do)return o===he?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===xl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===vl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===df||n===wl||n===Ml||n===bl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Do)return r.COMPRESSED_RED_RGTC1_EXT;if(n===wl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ml)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===bl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Cs?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}var Ol=class extends Ne{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},xt=class extends pe{constructor(){super(),this.isGroup=!0,this.type="Group"}},Ax={type:"move"},pr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new xt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new xt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new M,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new M),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new xt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new M,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new M),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(let y of t.hand.values()){let m=e.getJointPose(y,n),g=this._getHandJoint(l,y);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;l.inputState.pinching&&d>f+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Ax)))}return a!==null&&(a.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new xt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Tx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ex=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Fl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){let i=new ke,r=t.properties.get(i);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new _n({vertexShader:Tx,fragmentShader:Ex,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Lt(new Dn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Bl=class extends Jn{constructor(t,e){super();let n=this,i=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,p=null,y=new Fl,m=e.getContextAttributes(),g=null,v=null,_=[],w=[],C=new rt,A=null,E=new Ne;E.layers.enable(1),E.viewport=new jt;let z=new Ne;z.layers.enable(2),z.viewport=new jt;let N=[E,z],x=new Ol;x.layers.enable(1),x.layers.enable(2);let S=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let tt=_[Z];return tt===void 0&&(tt=new pr,_[Z]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(Z){let tt=_[Z];return tt===void 0&&(tt=new pr,_[Z]=tt),tt.getGripSpace()},this.getHand=function(Z){let tt=_[Z];return tt===void 0&&(tt=new pr,_[Z]=tt),tt.getHandSpace()};function I(Z){let tt=w.indexOf(Z.inputSource);if(tt===-1)return;let wt=_[tt];wt!==void 0&&(wt.update(Z.inputSource,Z.frame,l||o),wt.dispatchEvent({type:Z.type,data:Z.inputSource}))}function F(){i.removeEventListener("select",I),i.removeEventListener("selectstart",I),i.removeEventListener("selectend",I),i.removeEventListener("squeeze",I),i.removeEventListener("squeezestart",I),i.removeEventListener("squeezeend",I),i.removeEventListener("end",F),i.removeEventListener("inputsourceschange",j);for(let Z=0;Z<_.length;Z++){let tt=w[Z];tt!==null&&(w[Z]=null,_[Z].disconnect(tt))}S=null,k=null,y.reset(),t.setRenderTarget(g),f=null,d=null,u=null,i=null,v=null,Bt.stop(),n.isPresenting=!1,t.setPixelRatio(A),t.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(Z){if(i=Z,i!==null){if(g=t.getRenderTarget(),i.addEventListener("select",I),i.addEventListener("selectstart",I),i.addEventListener("selectend",I),i.addEventListener("squeeze",I),i.addEventListener("squeezestart",I),i.addEventListener("squeezeend",I),i.addEventListener("end",F),i.addEventListener("inputsourceschange",j),m.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(C),i.renderState.layers===void 0){let tt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,tt),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new $n(f.framebufferWidth,f.framebufferHeight,{format:gn,type:jn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let tt=null,wt=null,ht=null;m.depth&&(ht=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,tt=m.stencil?zs:bs,wt=m.stencil?Cs:Bi);let Dt={colorFormat:e.RGBA8,depthFormat:ht,scaleFactor:r};u=new XRWebGLBinding(i,e),d=u.createProjectionLayer(Dt),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),v=new $n(d.textureWidth,d.textureHeight,{format:gn,type:jn,depthTexture:new Zo(d.textureWidth,d.textureHeight,wt,void 0,void 0,void 0,void 0,void 0,void 0,tt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await i.requestReferenceSpace(a),Bt.setContext(i),Bt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function j(Z){for(let tt=0;tt<Z.removed.length;tt++){let wt=Z.removed[tt],ht=w.indexOf(wt);ht>=0&&(w[ht]=null,_[ht].disconnect(wt))}for(let tt=0;tt<Z.added.length;tt++){let wt=Z.added[tt],ht=w.indexOf(wt);if(ht===-1){for(let Pt=0;Pt<_.length;Pt++)if(Pt>=w.length){w.push(wt),ht=Pt;break}else if(w[Pt]===null){w[Pt]=wt,ht=Pt;break}if(ht===-1)break}let Dt=_[ht];Dt&&Dt.connect(wt)}}let B=new M,Q=new M;function W(Z,tt,wt){B.setFromMatrixPosition(tt.matrixWorld),Q.setFromMatrixPosition(wt.matrixWorld);let ht=B.distanceTo(Q),Dt=tt.projectionMatrix.elements,Pt=wt.projectionMatrix.elements,Ht=Dt[14]/(Dt[10]-1),Zt=Dt[14]/(Dt[10]+1),Vt=(Dt[9]+1)/Dt[5],P=(Dt[9]-1)/Dt[5],qe=(Dt[8]-1)/Dt[0],qt=(Pt[8]+1)/Pt[0],G=Ht*qe,it=Ht*qt,J=ht/(-qe+qt),dt=J*-qe;if(tt.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(dt),Z.translateZ(J),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Dt[10]===-1)Z.projectionMatrix.copy(tt.projectionMatrix),Z.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{let R=Ht+J,b=Zt+J,O=G-dt,q=it+(ht-dt),K=Vt*Zt/b*R,Y=P*Zt/b*R;Z.projectionMatrix.makePerspective(O,q,K,Y,R,b),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function lt(Z,tt){tt===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(tt.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(i===null)return;let tt=Z.near,wt=Z.far;y.texture!==null&&(y.depthNear>0&&(tt=y.depthNear),y.depthFar>0&&(wt=y.depthFar)),x.near=z.near=E.near=tt,x.far=z.far=E.far=wt,(S!==x.near||k!==x.far)&&(i.updateRenderState({depthNear:x.near,depthFar:x.far}),S=x.near,k=x.far);let ht=Z.parent,Dt=x.cameras;lt(x,ht);for(let Pt=0;Pt<Dt.length;Pt++)lt(Dt[Pt],ht);Dt.length===2?W(x,E,z):x.projectionMatrix.copy(E.projectionMatrix),ot(Z,x,ht)};function ot(Z,tt,wt){wt===null?Z.matrix.copy(tt.matrixWorld):(Z.matrix.copy(wt.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(tt.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(tt.projectionMatrix),Z.projectionMatrixInverse.copy(tt.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=ks*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(Z){c=Z,d!==null&&(d.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(x)};let vt=null;function Xt(Z,tt){if(h=tt.getViewerPose(l||o),p=tt,h!==null){let wt=h.views;f!==null&&(t.setRenderTargetFramebuffer(v,f.framebuffer),t.setRenderTarget(v));let ht=!1;wt.length!==x.cameras.length&&(x.cameras.length=0,ht=!0);for(let Pt=0;Pt<wt.length;Pt++){let Ht=wt[Pt],Zt=null;if(f!==null)Zt=f.getViewport(Ht);else{let P=u.getViewSubImage(d,Ht);Zt=P.viewport,Pt===0&&(t.setRenderTargetTextures(v,P.colorTexture,d.ignoreDepthValues?void 0:P.depthStencilTexture),t.setRenderTarget(v))}let Vt=N[Pt];Vt===void 0&&(Vt=new Ne,Vt.layers.enable(Pt),Vt.viewport=new jt,N[Pt]=Vt),Vt.matrix.fromArray(Ht.transform.matrix),Vt.matrix.decompose(Vt.position,Vt.quaternion,Vt.scale),Vt.projectionMatrix.fromArray(Ht.projectionMatrix),Vt.projectionMatrixInverse.copy(Vt.projectionMatrix).invert(),Vt.viewport.set(Zt.x,Zt.y,Zt.width,Zt.height),Pt===0&&(x.matrix.copy(Vt.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),ht===!0&&x.cameras.push(Vt)}let Dt=i.enabledFeatures;if(Dt&&Dt.includes("depth-sensing")){let Pt=u.getDepthInformation(wt[0]);Pt&&Pt.isValid&&Pt.texture&&y.init(t,Pt,i.renderState)}}for(let wt=0;wt<_.length;wt++){let ht=w[wt],Dt=_[wt];ht!==null&&Dt!==void 0&&Dt.update(ht,tt,l||o)}vt&&vt(Z,tt),tt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:tt}),p=null}let Bt=new wf;Bt.setAnimationLoop(Xt),this.setAnimationLoop=function(Z){vt=Z},this.dispose=function(){}}},Di=new ln,Rx=new Rt;function Cx(s,t){function e(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,vf(s)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function i(m,g,v,_,w){g.isMeshBasicMaterial||g.isMeshLambertMaterial?r(m,g):g.isMeshToonMaterial?(r(m,g),u(m,g)):g.isMeshPhongMaterial?(r(m,g),h(m,g)):g.isMeshStandardMaterial?(r(m,g),d(m,g),g.isMeshPhysicalMaterial&&f(m,g,w)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),y(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(o(m,g),g.isLineDashedMaterial&&a(m,g)):g.isPointsMaterial?c(m,g,v,_):g.isSpriteMaterial?l(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,e(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===He&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,e(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===He&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,e(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,e(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);let v=t.get(g),_=v.envMap,w=v.envMapRotation;_&&(m.envMap.value=_,Di.copy(w),Di.x*=-1,Di.y*=-1,Di.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Di.y*=-1,Di.z*=-1),m.envMapRotation.value.setFromMatrix4(Rx.makeRotationFromEuler(Di)),m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,m.aoMapTransform))}function o(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform))}function a(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function c(m,g,v,_){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*v,m.scale.value=_*.5,g.map&&(m.map.value=g.map,e(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function l(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function u(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,v){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===He&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function y(m,g){let v=t.get(g).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function zx(s,t,e,n){let i={},r={},o=[],a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,_){let w=_.program;n.uniformBlockBinding(v,w)}function l(v,_){let w=i[v.id];w===void 0&&(p(v),w=h(v),i[v.id]=w,v.addEventListener("dispose",m));let C=_.program;n.updateUBOMapping(v,C);let A=t.render.frame;r[v.id]!==A&&(d(v),r[v.id]=A)}function h(v){let _=u();v.__bindingPointIndex=_;let w=s.createBuffer(),C=v.__size,A=v.usage;return s.bindBuffer(s.UNIFORM_BUFFER,w),s.bufferData(s.UNIFORM_BUFFER,C,A),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,_,w),w}function u(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){let _=i[v.id],w=v.uniforms,C=v.__cache;s.bindBuffer(s.UNIFORM_BUFFER,_);for(let A=0,E=w.length;A<E;A++){let z=Array.isArray(w[A])?w[A]:[w[A]];for(let N=0,x=z.length;N<x;N++){let S=z[N];if(f(S,A,N,C)===!0){let k=S.__offset,I=Array.isArray(S.value)?S.value:[S.value],F=0;for(let j=0;j<I.length;j++){let B=I[j],Q=y(B);typeof B=="number"||typeof B=="boolean"?(S.__data[0]=B,s.bufferSubData(s.UNIFORM_BUFFER,k+F,S.__data)):B.isMatrix3?(S.__data[0]=B.elements[0],S.__data[1]=B.elements[1],S.__data[2]=B.elements[2],S.__data[3]=0,S.__data[4]=B.elements[3],S.__data[5]=B.elements[4],S.__data[6]=B.elements[5],S.__data[7]=0,S.__data[8]=B.elements[6],S.__data[9]=B.elements[7],S.__data[10]=B.elements[8],S.__data[11]=0):(B.toArray(S.__data,F),F+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,k,S.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(v,_,w,C){let A=v.value,E=_+"_"+w;if(C[E]===void 0)return typeof A=="number"||typeof A=="boolean"?C[E]=A:C[E]=A.clone(),!0;{let z=C[E];if(typeof A=="number"||typeof A=="boolean"){if(z!==A)return C[E]=A,!0}else if(z.equals(A)===!1)return z.copy(A),!0}return!1}function p(v){let _=v.uniforms,w=0,C=16;for(let E=0,z=_.length;E<z;E++){let N=Array.isArray(_[E])?_[E]:[_[E]];for(let x=0,S=N.length;x<S;x++){let k=N[x],I=Array.isArray(k.value)?k.value:[k.value];for(let F=0,j=I.length;F<j;F++){let B=I[F],Q=y(B),W=w%C,lt=W%Q.boundary,ot=W+lt;w+=lt,ot!==0&&C-ot<Q.storage&&(w+=C-ot),k.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=w,w+=Q.storage}}}let A=w%C;return A>0&&(w+=C-A),v.__size=w,v.__cache={},this}function y(v){let _={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(_.boundary=4,_.storage=4):v.isVector2?(_.boundary=8,_.storage=8):v.isVector3||v.isColor?(_.boundary=16,_.storage=12):v.isVector4?(_.boundary=16,_.storage=16):v.isMatrix3?(_.boundary=48,_.storage=48):v.isMatrix4?(_.boundary=64,_.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),_}function m(v){let _=v.target;_.removeEventListener("dispose",m);let w=o.indexOf(_.__bindingPointIndex);o.splice(w,1),s.deleteBuffer(i[_.id]),delete i[_.id],delete r[_.id]}function g(){for(let v in i)s.deleteBuffer(i[v]);o=[],i={},r={}}return{bind:c,update:l,dispose:g}}var jo=class{constructor(t={}){let{canvas:e=km(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;let f=new Uint32Array(4),p=new Int32Array(4),y=null,m=null,g=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Yt,this.toneMapping=_i,this.toneMappingExposure=1;let _=this,w=!1,C=0,A=0,E=null,z=-1,N=null,x=new jt,S=new jt,k=null,I=new et(0),F=0,j=e.width,B=e.height,Q=1,W=null,lt=null,ot=new jt(0,0,j,B),vt=new jt(0,0,j,B),Xt=!1,Bt=new br,Z=!1,tt=!1,wt=new Rt,ht=new Rt,Dt=new M,Pt=new jt,Ht={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Zt=!1;function Vt(){return E===null?Q:1}let P=n;function qe(T,D){return e.getContext(T,D)}try{let T={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${hh}`),e.addEventListener("webglcontextlost",$,!1),e.addEventListener("webglcontextrestored",ft,!1),e.addEventListener("webglcontextcreationerror",gt,!1),P===null){let D="webgl2";if(P=qe(D,T),P===null)throw qe(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let qt,G,it,J,dt,R,b,O,q,K,Y,St,ct,ut,Gt,nt,_t,Ct,zt,yt,Kt,Nt,ae,L;function mt(){qt=new qy(P),qt.init(),Nt=new Sx(P,qt),G=new By(P,qt,t,Nt),it=new wx(P),G.reverseDepthBuffer&&it.buffers.depth.setReversed(!0),J=new Zy(P),dt=new cx,R=new bx(P,qt,it,dt,G,Nt,J),b=new Vy(_),O=new Xy(_),q=new n0(P),ae=new Oy(P,q),K=new Ky(P,q,J,ae),Y=new Jy(P,K,q,J),zt=new jy(P,G,R),nt=new Hy(dt),St=new ax(_,b,O,qt,G,ae,nt),ct=new Cx(_,dt),ut=new hx,Gt=new gx(qt),Ct=new Uy(_,b,O,it,Y,d,c),_t=new xx(_,Y,G),L=new zx(P,J,G,it),yt=new Fy(P,qt,J),Kt=new Yy(P,qt,J),J.programs=St.programs,_.capabilities=G,_.extensions=qt,_.properties=dt,_.renderLists=ut,_.shadowMap=_t,_.state=it,_.info=J}mt();let X=new Bl(_,P);this.xr=X,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let T=qt.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=qt.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return Q},this.setPixelRatio=function(T){T!==void 0&&(Q=T,this.setSize(j,B,!1))},this.getSize=function(T){return T.set(j,B)},this.setSize=function(T,D,H=!0){if(X.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}j=T,B=D,e.width=Math.floor(T*Q),e.height=Math.floor(D*Q),H===!0&&(e.style.width=T+"px",e.style.height=D+"px"),this.setViewport(0,0,T,D)},this.getDrawingBufferSize=function(T){return T.set(j*Q,B*Q).floor()},this.setDrawingBufferSize=function(T,D,H){j=T,B=D,Q=H,e.width=Math.floor(T*H),e.height=Math.floor(D*H),this.setViewport(0,0,T,D)},this.getCurrentViewport=function(T){return T.copy(x)},this.getViewport=function(T){return T.copy(ot)},this.setViewport=function(T,D,H,V){T.isVector4?ot.set(T.x,T.y,T.z,T.w):ot.set(T,D,H,V),it.viewport(x.copy(ot).multiplyScalar(Q).round())},this.getScissor=function(T){return T.copy(vt)},this.setScissor=function(T,D,H,V){T.isVector4?vt.set(T.x,T.y,T.z,T.w):vt.set(T,D,H,V),it.scissor(S.copy(vt).multiplyScalar(Q).round())},this.getScissorTest=function(){return Xt},this.setScissorTest=function(T){it.setScissorTest(Xt=T)},this.setOpaqueSort=function(T){W=T},this.setTransparentSort=function(T){lt=T},this.getClearColor=function(T){return T.copy(Ct.getClearColor())},this.setClearColor=function(){Ct.setClearColor.apply(Ct,arguments)},this.getClearAlpha=function(){return Ct.getClearAlpha()},this.setClearAlpha=function(){Ct.setClearAlpha.apply(Ct,arguments)},this.clear=function(T=!0,D=!0,H=!0){let V=0;if(T){let U=!1;if(E!==null){let st=E.texture.format;U=st===wh||st===vh||st===xh}if(U){let st=E.texture.type,pt=st===jn||st===Bi||st===vr||st===Cs||st===gh||st===yh,Mt=Ct.getClearColor(),bt=Ct.getClearAlpha(),It=Mt.r,kt=Mt.g,Tt=Mt.b;pt?(f[0]=It,f[1]=kt,f[2]=Tt,f[3]=bt,P.clearBufferuiv(P.COLOR,0,f)):(p[0]=It,p[1]=kt,p[2]=Tt,p[3]=bt,P.clearBufferiv(P.COLOR,0,p))}else V|=P.COLOR_BUFFER_BIT}D&&(V|=P.DEPTH_BUFFER_BIT,P.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),H&&(V|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",$,!1),e.removeEventListener("webglcontextrestored",ft,!1),e.removeEventListener("webglcontextcreationerror",gt,!1),ut.dispose(),Gt.dispose(),dt.dispose(),b.dispose(),O.dispose(),Y.dispose(),ae.dispose(),L.dispose(),St.dispose(),X.dispose(),X.removeEventListener("sessionstart",Eu),X.removeEventListener("sessionend",Ru),Ci.stop()};function $(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function ft(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;let T=J.autoReset,D=_t.enabled,H=_t.autoUpdate,V=_t.needsUpdate,U=_t.type;mt(),J.autoReset=T,_t.enabled=D,_t.autoUpdate=H,_t.needsUpdate=V,_t.type=U}function gt(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function $t(T){let D=T.target;D.removeEventListener("dispose",$t),be(D)}function be(T){Qe(T),dt.remove(T)}function Qe(T){let D=dt.get(T).programs;D!==void 0&&(D.forEach(function(H){St.releaseProgram(H)}),T.isShaderMaterial&&St.releaseShaderCache(T))}this.renderBufferDirect=function(T,D,H,V,U,st){D===null&&(D=Ht);let pt=U.isMesh&&U.matrixWorld.determinant()<0,Mt=Tp(T,D,H,V,U);it.setMaterial(V,pt);let bt=H.index,It=1;if(V.wireframe===!0){if(bt=K.getWireframeAttribute(H),bt===void 0)return;It=2}let kt=H.drawRange,Tt=H.attributes.position,ie=kt.start*It,le=(kt.start+kt.count)*It;st!==null&&(ie=Math.max(ie,st.start*It),le=Math.min(le,(st.start+st.count)*It)),bt!==null?(ie=Math.max(ie,0),le=Math.min(le,bt.count)):Tt!=null&&(ie=Math.max(ie,0),le=Math.min(le,Tt.count));let xe=le-ie;if(xe<0||xe===1/0)return;ae.setup(U,V,Mt,H,bt);let sn,ee=yt;if(bt!==null&&(sn=q.get(bt),ee=Kt,ee.setIndex(sn)),U.isMesh)V.wireframe===!0?(it.setLineWidth(V.wireframeLinewidth*Vt()),ee.setMode(P.LINES)):ee.setMode(P.TRIANGLES);else if(U.isLine){let Et=V.linewidth;Et===void 0&&(Et=1),it.setLineWidth(Et*Vt()),U.isLineSegments?ee.setMode(P.LINES):U.isLineLoop?ee.setMode(P.LINE_LOOP):ee.setMode(P.LINE_STRIP)}else U.isPoints?ee.setMode(P.POINTS):U.isSprite&&ee.setMode(P.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)ee.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(qt.get("WEBGL_multi_draw"))ee.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{let Et=U._multiDrawStarts,De=U._multiDrawCounts,ne=U._multiDrawCount,Sn=bt?q.get(bt).bytesPerElement:1,Ji=dt.get(V).currentProgram.getUniforms();for(let rn=0;rn<ne;rn++)Ji.setValue(P,"_gl_DrawID",rn),ee.render(Et[rn]/Sn,De[rn])}else if(U.isInstancedMesh)ee.renderInstances(ie,xe,U.count);else if(H.isInstancedBufferGeometry){let Et=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,De=Math.min(H.instanceCount,Et);ee.renderInstances(ie,xe,De)}else ee.render(ie,xe)};function te(T,D,H){T.transparent===!0&&T.side===ue&&T.forceSinglePass===!1?(T.side=He,T.needsUpdate=!0,Jr(T,D,H),T.side=kn,T.needsUpdate=!0,Jr(T,D,H),T.side=ue):Jr(T,D,H)}this.compile=function(T,D,H=null){H===null&&(H=T),m=Gt.get(H),m.init(D),v.push(m),H.traverseVisible(function(U){U.isLight&&U.layers.test(D.layers)&&(m.pushLight(U),U.castShadow&&m.pushShadow(U))}),T!==H&&T.traverseVisible(function(U){U.isLight&&U.layers.test(D.layers)&&(m.pushLight(U),U.castShadow&&m.pushShadow(U))}),m.setupLights();let V=new Set;return T.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;let st=U.material;if(st)if(Array.isArray(st))for(let pt=0;pt<st.length;pt++){let Mt=st[pt];te(Mt,H,U),V.add(Mt)}else te(st,H,U),V.add(st)}),v.pop(),m=null,V},this.compileAsync=function(T,D,H=null){let V=this.compile(T,D,H);return new Promise(U=>{function st(){if(V.forEach(function(pt){dt.get(pt).currentProgram.isReady()&&V.delete(pt)}),V.size===0){U(T);return}setTimeout(st,10)}qt.get("KHR_parallel_shader_compile")!==null?st():setTimeout(st,10)})};let tn=null;function Fn(T){tn&&tn(T)}function Eu(){Ci.stop()}function Ru(){Ci.start()}let Ci=new wf;Ci.setAnimationLoop(Fn),typeof self<"u"&&Ci.setContext(self),this.setAnimationLoop=function(T){tn=T,X.setAnimationLoop(T),T===null?Ci.stop():Ci.start()},X.addEventListener("sessionstart",Eu),X.addEventListener("sessionend",Ru),this.render=function(T,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),X.enabled===!0&&X.isPresenting===!0&&(X.cameraAutoUpdate===!0&&X.updateCamera(D),D=X.getCamera()),T.isScene===!0&&T.onBeforeRender(_,T,D,E),m=Gt.get(T,v.length),m.init(D),v.push(m),ht.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),Bt.setFromProjectionMatrix(ht),tt=this.localClippingEnabled,Z=nt.init(this.clippingPlanes,tt),y=ut.get(T,g.length),y.init(),g.push(y),X.enabled===!0&&X.isPresenting===!0){let st=_.xr.getDepthSensingMesh();st!==null&&ec(st,D,-1/0,_.sortObjects)}ec(T,D,0,_.sortObjects),y.finish(),_.sortObjects===!0&&y.sort(W,lt),Zt=X.enabled===!1||X.isPresenting===!1||X.hasDepthSensing()===!1,Zt&&Ct.addToRenderList(y,T),this.info.render.frame++,Z===!0&&nt.beginShadows();let H=m.state.shadowsArray;_t.render(H,T,D),Z===!0&&nt.endShadows(),this.info.autoReset===!0&&this.info.reset();let V=y.opaque,U=y.transmissive;if(m.setupLights(),D.isArrayCamera){let st=D.cameras;if(U.length>0)for(let pt=0,Mt=st.length;pt<Mt;pt++){let bt=st[pt];zu(V,U,T,bt)}Zt&&Ct.render(T);for(let pt=0,Mt=st.length;pt<Mt;pt++){let bt=st[pt];Cu(y,T,bt,bt.viewport)}}else U.length>0&&zu(V,U,T,D),Zt&&Ct.render(T),Cu(y,T,D);E!==null&&(R.updateMultisampleRenderTarget(E),R.updateRenderTargetMipmap(E)),T.isScene===!0&&T.onAfterRender(_,T,D),ae.resetDefaultState(),z=-1,N=null,v.pop(),v.length>0?(m=v[v.length-1],Z===!0&&nt.setGlobalState(_.clippingPlanes,m.state.camera)):m=null,g.pop(),g.length>0?y=g[g.length-1]:y=null};function ec(T,D,H,V){if(T.visible===!1)return;if(T.layers.test(D.layers)){if(T.isGroup)H=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(D);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||Bt.intersectsSprite(T)){V&&Pt.setFromMatrixPosition(T.matrixWorld).applyMatrix4(ht);let pt=Y.update(T),Mt=T.material;Mt.visible&&y.push(T,pt,Mt,H,Pt.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||Bt.intersectsObject(T))){let pt=Y.update(T),Mt=T.material;if(V&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Pt.copy(T.boundingSphere.center)):(pt.boundingSphere===null&&pt.computeBoundingSphere(),Pt.copy(pt.boundingSphere.center)),Pt.applyMatrix4(T.matrixWorld).applyMatrix4(ht)),Array.isArray(Mt)){let bt=pt.groups;for(let It=0,kt=bt.length;It<kt;It++){let Tt=bt[It],ie=Mt[Tt.materialIndex];ie&&ie.visible&&y.push(T,pt,ie,H,Pt.z,Tt)}}else Mt.visible&&y.push(T,pt,Mt,H,Pt.z,null)}}let st=T.children;for(let pt=0,Mt=st.length;pt<Mt;pt++)ec(st[pt],D,H,V)}function Cu(T,D,H,V){let U=T.opaque,st=T.transmissive,pt=T.transparent;m.setupLightsView(H),Z===!0&&nt.setGlobalState(_.clippingPlanes,H),V&&it.viewport(x.copy(V)),U.length>0&&jr(U,D,H),st.length>0&&jr(st,D,H),pt.length>0&&jr(pt,D,H),it.buffers.depth.setTest(!0),it.buffers.depth.setMask(!0),it.buffers.color.setMask(!0),it.setPolygonOffset(!1)}function zu(T,D,H,V){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[V.id]===void 0&&(m.state.transmissionRenderTarget[V.id]=new $n(1,1,{generateMipmaps:!0,type:qt.has("EXT_color_buffer_half_float")||qt.has("EXT_color_buffer_float")?Lr:jn,minFilter:In,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qt.workingColorSpace}));let st=m.state.transmissionRenderTarget[V.id],pt=V.viewport||x;st.setSize(pt.z,pt.w);let Mt=_.getRenderTarget();_.setRenderTarget(st),_.getClearColor(I),F=_.getClearAlpha(),F<1&&_.setClearColor(16777215,.5),_.clear(),Zt&&Ct.render(H);let bt=_.toneMapping;_.toneMapping=_i;let It=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),m.setupLightsView(V),Z===!0&&nt.setGlobalState(_.clippingPlanes,V),jr(T,H,V),R.updateMultisampleRenderTarget(st),R.updateRenderTargetMipmap(st),qt.has("WEBGL_multisampled_render_to_texture")===!1){let kt=!1;for(let Tt=0,ie=D.length;Tt<ie;Tt++){let le=D[Tt],xe=le.object,sn=le.geometry,ee=le.material,Et=le.group;if(ee.side===ue&&xe.layers.test(V.layers)){let De=ee.side;ee.side=He,ee.needsUpdate=!0,Pu(xe,H,V,sn,ee,Et),ee.side=De,ee.needsUpdate=!0,kt=!0}}kt===!0&&(R.updateMultisampleRenderTarget(st),R.updateRenderTargetMipmap(st))}_.setRenderTarget(Mt),_.setClearColor(I,F),It!==void 0&&(V.viewport=It),_.toneMapping=bt}function jr(T,D,H){let V=D.isScene===!0?D.overrideMaterial:null;for(let U=0,st=T.length;U<st;U++){let pt=T[U],Mt=pt.object,bt=pt.geometry,It=V===null?pt.material:V,kt=pt.group;Mt.layers.test(H.layers)&&Pu(Mt,D,H,bt,It,kt)}}function Pu(T,D,H,V,U,st){T.onBeforeRender(_,D,H,V,U,st),T.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),U.onBeforeRender(_,D,H,V,T,st),U.transparent===!0&&U.side===ue&&U.forceSinglePass===!1?(U.side=He,U.needsUpdate=!0,_.renderBufferDirect(H,D,V,U,T,st),U.side=kn,U.needsUpdate=!0,_.renderBufferDirect(H,D,V,U,T,st),U.side=ue):_.renderBufferDirect(H,D,V,U,T,st),T.onAfterRender(_,D,H,V,U,st)}function Jr(T,D,H){D.isScene!==!0&&(D=Ht);let V=dt.get(T),U=m.state.lights,st=m.state.shadowsArray,pt=U.state.version,Mt=St.getParameters(T,U.state,st,D,H),bt=St.getProgramCacheKey(Mt),It=V.programs;V.environment=T.isMeshStandardMaterial?D.environment:null,V.fog=D.fog,V.envMap=(T.isMeshStandardMaterial?O:b).get(T.envMap||V.environment),V.envMapRotation=V.environment!==null&&T.envMap===null?D.environmentRotation:T.envMapRotation,It===void 0&&(T.addEventListener("dispose",$t),It=new Map,V.programs=It);let kt=It.get(bt);if(kt!==void 0){if(V.currentProgram===kt&&V.lightsStateVersion===pt)return ku(T,Mt),kt}else Mt.uniforms=St.getUniforms(T),T.onBeforeCompile(Mt,_),kt=St.acquireProgram(Mt,bt),It.set(bt,kt),V.uniforms=Mt.uniforms;let Tt=V.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Tt.clippingPlanes=nt.uniform),ku(T,Mt),V.needsLights=Rp(T),V.lightsStateVersion=pt,V.needsLights&&(Tt.ambientLightColor.value=U.state.ambient,Tt.lightProbe.value=U.state.probe,Tt.directionalLights.value=U.state.directional,Tt.directionalLightShadows.value=U.state.directionalShadow,Tt.spotLights.value=U.state.spot,Tt.spotLightShadows.value=U.state.spotShadow,Tt.rectAreaLights.value=U.state.rectArea,Tt.ltc_1.value=U.state.rectAreaLTC1,Tt.ltc_2.value=U.state.rectAreaLTC2,Tt.pointLights.value=U.state.point,Tt.pointLightShadows.value=U.state.pointShadow,Tt.hemisphereLights.value=U.state.hemi,Tt.directionalShadowMap.value=U.state.directionalShadowMap,Tt.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Tt.spotShadowMap.value=U.state.spotShadowMap,Tt.spotLightMatrix.value=U.state.spotLightMatrix,Tt.spotLightMap.value=U.state.spotLightMap,Tt.pointShadowMap.value=U.state.pointShadowMap,Tt.pointShadowMatrix.value=U.state.pointShadowMatrix),V.currentProgram=kt,V.uniformsList=null,kt}function Iu(T){if(T.uniformsList===null){let D=T.currentProgram.getUniforms();T.uniformsList=As.seqWithValue(D.seq,T.uniforms)}return T.uniformsList}function ku(T,D){let H=dt.get(T);H.outputColorSpace=D.outputColorSpace,H.batching=D.batching,H.batchingColor=D.batchingColor,H.instancing=D.instancing,H.instancingColor=D.instancingColor,H.instancingMorph=D.instancingMorph,H.skinning=D.skinning,H.morphTargets=D.morphTargets,H.morphNormals=D.morphNormals,H.morphColors=D.morphColors,H.morphTargetsCount=D.morphTargetsCount,H.numClippingPlanes=D.numClippingPlanes,H.numIntersection=D.numClipIntersection,H.vertexAlphas=D.vertexAlphas,H.vertexTangents=D.vertexTangents,H.toneMapping=D.toneMapping}function Tp(T,D,H,V,U){D.isScene!==!0&&(D=Ht),R.resetTextureUnits();let st=D.fog,pt=V.isMeshStandardMaterial?D.environment:null,Mt=E===null?_.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Le,bt=(V.isMeshStandardMaterial?O:b).get(V.envMap||pt),It=V.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,kt=!!H.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Tt=!!H.morphAttributes.position,ie=!!H.morphAttributes.normal,le=!!H.morphAttributes.color,xe=_i;V.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(xe=_.toneMapping);let sn=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,ee=sn!==void 0?sn.length:0,Et=dt.get(V),De=m.state.lights;if(Z===!0&&(tt===!0||T!==N)){let pn=T===N&&V.id===z;nt.setState(V,T,pn)}let ne=!1;V.version===Et.__version?(Et.needsLights&&Et.lightsStateVersion!==De.state.version||Et.outputColorSpace!==Mt||U.isBatchedMesh&&Et.batching===!1||!U.isBatchedMesh&&Et.batching===!0||U.isBatchedMesh&&Et.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Et.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Et.instancing===!1||!U.isInstancedMesh&&Et.instancing===!0||U.isSkinnedMesh&&Et.skinning===!1||!U.isSkinnedMesh&&Et.skinning===!0||U.isInstancedMesh&&Et.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Et.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Et.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Et.instancingMorph===!1&&U.morphTexture!==null||Et.envMap!==bt||V.fog===!0&&Et.fog!==st||Et.numClippingPlanes!==void 0&&(Et.numClippingPlanes!==nt.numPlanes||Et.numIntersection!==nt.numIntersection)||Et.vertexAlphas!==It||Et.vertexTangents!==kt||Et.morphTargets!==Tt||Et.morphNormals!==ie||Et.morphColors!==le||Et.toneMapping!==xe||Et.morphTargetsCount!==ee)&&(ne=!0):(ne=!0,Et.__version=V.version);let Sn=Et.currentProgram;ne===!0&&(Sn=Jr(V,D,U));let Ji=!1,rn=!1,nc=!1,Me=Sn.getUniforms(),ai=Et.uniforms;if(it.useProgram(Sn.program)&&(Ji=!0,rn=!0,nc=!0),V.id!==z&&(z=V.id,rn=!0),Ji||N!==T){G.reverseDepthBuffer?(wt.copy(T.projectionMatrix),Dm(wt),Nm(wt),Me.setValue(P,"projectionMatrix",wt)):Me.setValue(P,"projectionMatrix",T.projectionMatrix),Me.setValue(P,"viewMatrix",T.matrixWorldInverse);let pn=Me.map.cameraPosition;pn!==void 0&&pn.setValue(P,Dt.setFromMatrixPosition(T.matrixWorld)),G.logarithmicDepthBuffer&&Me.setValue(P,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&Me.setValue(P,"isOrthographic",T.isOrthographicCamera===!0),N!==T&&(N=T,rn=!0,nc=!0)}if(U.isSkinnedMesh){Me.setOptional(P,U,"bindMatrix"),Me.setOptional(P,U,"bindMatrixInverse");let pn=U.skeleton;pn&&(pn.boneTexture===null&&pn.computeBoneTexture(),Me.setValue(P,"boneTexture",pn.boneTexture,R))}U.isBatchedMesh&&(Me.setOptional(P,U,"batchingTexture"),Me.setValue(P,"batchingTexture",U._matricesTexture,R),Me.setOptional(P,U,"batchingIdTexture"),Me.setValue(P,"batchingIdTexture",U._indirectTexture,R),Me.setOptional(P,U,"batchingColorTexture"),U._colorsTexture!==null&&Me.setValue(P,"batchingColorTexture",U._colorsTexture,R));let ic=H.morphAttributes;if((ic.position!==void 0||ic.normal!==void 0||ic.color!==void 0)&&zt.update(U,H,Sn),(rn||Et.receiveShadow!==U.receiveShadow)&&(Et.receiveShadow=U.receiveShadow,Me.setValue(P,"receiveShadow",U.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(ai.envMap.value=bt,ai.flipEnvMap.value=bt.isCubeTexture&&bt.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&D.environment!==null&&(ai.envMapIntensity.value=D.environmentIntensity),rn&&(Me.setValue(P,"toneMappingExposure",_.toneMappingExposure),Et.needsLights&&Ep(ai,nc),st&&V.fog===!0&&ct.refreshFogUniforms(ai,st),ct.refreshMaterialUniforms(ai,V,Q,B,m.state.transmissionRenderTarget[T.id]),As.upload(P,Iu(Et),ai,R)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(As.upload(P,Iu(Et),ai,R),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&Me.setValue(P,"center",U.center),Me.setValue(P,"modelViewMatrix",U.modelViewMatrix),Me.setValue(P,"normalMatrix",U.normalMatrix),Me.setValue(P,"modelMatrix",U.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){let pn=V.uniformsGroups;for(let sc=0,Cp=pn.length;sc<Cp;sc++){let Lu=pn[sc];L.update(Lu,Sn),L.bind(Lu,Sn)}}return Sn}function Ep(T,D){T.ambientLightColor.needsUpdate=D,T.lightProbe.needsUpdate=D,T.directionalLights.needsUpdate=D,T.directionalLightShadows.needsUpdate=D,T.pointLights.needsUpdate=D,T.pointLightShadows.needsUpdate=D,T.spotLights.needsUpdate=D,T.spotLightShadows.needsUpdate=D,T.rectAreaLights.needsUpdate=D,T.hemisphereLights.needsUpdate=D}function Rp(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(T,D,H){dt.get(T.texture).__webglTexture=D,dt.get(T.depthTexture).__webglTexture=H;let V=dt.get(T);V.__hasExternalTextures=!0,V.__autoAllocateDepthBuffer=H===void 0,V.__autoAllocateDepthBuffer||qt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,D){let H=dt.get(T);H.__webglFramebuffer=D,H.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(T,D=0,H=0){E=T,C=D,A=H;let V=!0,U=null,st=!1,pt=!1;if(T){let bt=dt.get(T);if(bt.__useDefaultFramebuffer!==void 0)it.bindFramebuffer(P.FRAMEBUFFER,null),V=!1;else if(bt.__webglFramebuffer===void 0)R.setupRenderTarget(T);else if(bt.__hasExternalTextures)R.rebindTextures(T,dt.get(T.texture).__webglTexture,dt.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let Tt=T.depthTexture;if(bt.__boundDepthTexture!==Tt){if(Tt!==null&&dt.has(Tt)&&(T.width!==Tt.image.width||T.height!==Tt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(T)}}let It=T.texture;(It.isData3DTexture||It.isDataArrayTexture||It.isCompressedArrayTexture)&&(pt=!0);let kt=dt.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(kt[D])?U=kt[D][H]:U=kt[D],st=!0):T.samples>0&&R.useMultisampledRTT(T)===!1?U=dt.get(T).__webglMultisampledFramebuffer:Array.isArray(kt)?U=kt[H]:U=kt,x.copy(T.viewport),S.copy(T.scissor),k=T.scissorTest}else x.copy(ot).multiplyScalar(Q).floor(),S.copy(vt).multiplyScalar(Q).floor(),k=Xt;if(it.bindFramebuffer(P.FRAMEBUFFER,U)&&V&&it.drawBuffers(T,U),it.viewport(x),it.scissor(S),it.setScissorTest(k),st){let bt=dt.get(T.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+D,bt.__webglTexture,H)}else if(pt){let bt=dt.get(T.texture),It=D||0;P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,bt.__webglTexture,H||0,It)}z=-1},this.readRenderTargetPixels=function(T,D,H,V,U,st,pt){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Mt=dt.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&pt!==void 0&&(Mt=Mt[pt]),Mt){it.bindFramebuffer(P.FRAMEBUFFER,Mt);try{let bt=T.texture,It=bt.format,kt=bt.type;if(!G.textureFormatReadable(It)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!G.textureTypeReadable(kt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=T.width-V&&H>=0&&H<=T.height-U&&P.readPixels(D,H,V,U,Nt.convert(It),Nt.convert(kt),st)}finally{let bt=E!==null?dt.get(E).__webglFramebuffer:null;it.bindFramebuffer(P.FRAMEBUFFER,bt)}}},this.readRenderTargetPixelsAsync=async function(T,D,H,V,U,st,pt){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Mt=dt.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&pt!==void 0&&(Mt=Mt[pt]),Mt){let bt=T.texture,It=bt.format,kt=bt.type;if(!G.textureFormatReadable(It))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!G.textureTypeReadable(kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(D>=0&&D<=T.width-V&&H>=0&&H<=T.height-U){it.bindFramebuffer(P.FRAMEBUFFER,Mt);let Tt=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Tt),P.bufferData(P.PIXEL_PACK_BUFFER,st.byteLength,P.STREAM_READ),P.readPixels(D,H,V,U,Nt.convert(It),Nt.convert(kt),0);let ie=E!==null?dt.get(E).__webglFramebuffer:null;it.bindFramebuffer(P.FRAMEBUFFER,ie);let le=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Lm(P,le,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Tt),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,st),P.deleteBuffer(Tt),P.deleteSync(le),st}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,D=null,H=0){T.isTexture!==!0&&(No("WebGLRenderer: copyFramebufferToTexture function signature has changed."),D=arguments[0]||null,T=arguments[1]);let V=Math.pow(2,-H),U=Math.floor(T.image.width*V),st=Math.floor(T.image.height*V),pt=D!==null?D.x:0,Mt=D!==null?D.y:0;R.setTexture2D(T,0),P.copyTexSubImage2D(P.TEXTURE_2D,H,0,0,pt,Mt,U,st),it.unbindTexture()},this.copyTextureToTexture=function(T,D,H=null,V=null,U=0){T.isTexture!==!0&&(No("WebGLRenderer: copyTextureToTexture function signature has changed."),V=arguments[0]||null,T=arguments[1],D=arguments[2],U=arguments[3]||0,H=null);let st,pt,Mt,bt,It,kt;H!==null?(st=H.max.x-H.min.x,pt=H.max.y-H.min.y,Mt=H.min.x,bt=H.min.y):(st=T.image.width,pt=T.image.height,Mt=0,bt=0),V!==null?(It=V.x,kt=V.y):(It=0,kt=0);let Tt=Nt.convert(D.format),ie=Nt.convert(D.type);R.setTexture2D(D,0),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,D.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,D.unpackAlignment);let le=P.getParameter(P.UNPACK_ROW_LENGTH),xe=P.getParameter(P.UNPACK_IMAGE_HEIGHT),sn=P.getParameter(P.UNPACK_SKIP_PIXELS),ee=P.getParameter(P.UNPACK_SKIP_ROWS),Et=P.getParameter(P.UNPACK_SKIP_IMAGES),De=T.isCompressedTexture?T.mipmaps[U]:T.image;P.pixelStorei(P.UNPACK_ROW_LENGTH,De.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,De.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Mt),P.pixelStorei(P.UNPACK_SKIP_ROWS,bt),T.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,U,It,kt,st,pt,Tt,ie,De.data):T.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,U,It,kt,De.width,De.height,Tt,De.data):P.texSubImage2D(P.TEXTURE_2D,U,It,kt,st,pt,Tt,ie,De),P.pixelStorei(P.UNPACK_ROW_LENGTH,le),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,xe),P.pixelStorei(P.UNPACK_SKIP_PIXELS,sn),P.pixelStorei(P.UNPACK_SKIP_ROWS,ee),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Et),U===0&&D.generateMipmaps&&P.generateMipmap(P.TEXTURE_2D),it.unbindTexture()},this.copyTextureToTexture3D=function(T,D,H=null,V=null,U=0){T.isTexture!==!0&&(No("WebGLRenderer: copyTextureToTexture3D function signature has changed."),H=arguments[0]||null,V=arguments[1]||null,T=arguments[2],D=arguments[3],U=arguments[4]||0);let st,pt,Mt,bt,It,kt,Tt,ie,le,xe=T.isCompressedTexture?T.mipmaps[U]:T.image;H!==null?(st=H.max.x-H.min.x,pt=H.max.y-H.min.y,Mt=H.max.z-H.min.z,bt=H.min.x,It=H.min.y,kt=H.min.z):(st=xe.width,pt=xe.height,Mt=xe.depth,bt=0,It=0,kt=0),V!==null?(Tt=V.x,ie=V.y,le=V.z):(Tt=0,ie=0,le=0);let sn=Nt.convert(D.format),ee=Nt.convert(D.type),Et;if(D.isData3DTexture)R.setTexture3D(D,0),Et=P.TEXTURE_3D;else if(D.isDataArrayTexture||D.isCompressedArrayTexture)R.setTexture2DArray(D,0),Et=P.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,D.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,D.unpackAlignment);let De=P.getParameter(P.UNPACK_ROW_LENGTH),ne=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Sn=P.getParameter(P.UNPACK_SKIP_PIXELS),Ji=P.getParameter(P.UNPACK_SKIP_ROWS),rn=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,xe.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,xe.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,bt),P.pixelStorei(P.UNPACK_SKIP_ROWS,It),P.pixelStorei(P.UNPACK_SKIP_IMAGES,kt),T.isDataTexture||T.isData3DTexture?P.texSubImage3D(Et,U,Tt,ie,le,st,pt,Mt,sn,ee,xe.data):D.isCompressedArrayTexture?P.compressedTexSubImage3D(Et,U,Tt,ie,le,st,pt,Mt,sn,xe.data):P.texSubImage3D(Et,U,Tt,ie,le,st,pt,Mt,sn,ee,xe),P.pixelStorei(P.UNPACK_ROW_LENGTH,De),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,ne),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Sn),P.pixelStorei(P.UNPACK_SKIP_ROWS,Ji),P.pixelStorei(P.UNPACK_SKIP_IMAGES,rn),U===0&&D.generateMipmaps&&P.generateMipmap(Et),it.unbindTexture()},this.initRenderTarget=function(T){dt.get(T).__webglFramebuffer===void 0&&R.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?R.setTextureCube(T,0):T.isData3DTexture?R.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?R.setTexture2DArray(T,0):R.setTexture2D(T,0),it.unbindTexture()},this.resetState=function(){C=0,A=0,E=null,it.reset(),ae.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===Ah?"display-p3":"srgb",e.unpackColorSpace=Qt.workingColorSpace===Sa?"display-p3":"srgb"}};var Jo=class extends pe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ln,this.environmentIntensity=1,this.environmentRotation=new ln,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}},Ns=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Sl,this.updateRanges=[],this.version=0,this.uuid=yn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,r=this.stride;i<r;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=yn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=yn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Ke=new M,Vi=class s{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Ke.fromBufferAttribute(this,e),Ke.applyMatrix4(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ke.fromBufferAttribute(this,e),Ke.applyNormalMatrix(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ke.fromBufferAttribute(this,e),Ke.transformDirection(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Rn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=se(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Rn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Rn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Rn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Rn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),n=se(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),n=se(n,this.array),i=se(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),n=se(n,this.array),i=se(i,this.array),r=se(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return new Te(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new s(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Ve=class extends Ze{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new et(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},ds,ir=new M,fs=new M,ps=new M,ms=new rt,sr=new rt,Tf=new Rt,xo=new M,rr=new M,vo=new M,Rd=new rt,kc=new rt,Cd=new rt,Ge=class extends pe{constructor(t=new Ve){if(super(),this.isSprite=!0,this.type="Sprite",ds===void 0){ds=new Jt;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Ns(e,5);ds.setIndex([0,1,2,0,2,3]),ds.setAttribute("position",new Vi(n,3,0,!1)),ds.setAttribute("uv",new Vi(n,2,3,!1))}this.geometry=ds,this.material=t,this.center=new rt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),fs.setFromMatrixScale(this.matrixWorld),Tf.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),ps.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&fs.multiplyScalar(-ps.z);let n=this.material.rotation,i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));let o=this.center;wo(xo.set(-.5,-.5,0),ps,o,fs,i,r),wo(rr.set(.5,-.5,0),ps,o,fs,i,r),wo(vo.set(.5,.5,0),ps,o,fs,i,r),Rd.set(0,0),kc.set(1,0),Cd.set(1,1);let a=t.ray.intersectTriangle(xo,rr,vo,!1,ir);if(a===null&&(wo(rr.set(-.5,.5,0),ps,o,fs,i,r),kc.set(0,1),a=t.ray.intersectTriangle(xo,vo,rr,!1,ir),a===null))return;let c=t.ray.origin.distanceTo(ir);c<t.near||c>t.far||e.push({distance:c,point:ir.clone(),uv:mi.getInterpolation(ir,xo,rr,vo,Rd,kc,Cd,new rt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function wo(s,t,e,n,i,r){ms.subVectors(s,e).addScalar(.5).multiply(n),i!==void 0?(sr.x=r*ms.x-i*ms.y,sr.y=i*ms.x+r*ms.y):sr.copy(ms),s.copy(t),s.x+=sr.x,s.y+=sr.y,s.applyMatrix4(Tf)}var zd=new M,Pd=new jt,Id=new jt,Px=new M,kd=new Rt,Mo=new M,Lc=new cn,Ld=new Rt,Dc=new Hi,$o=class extends Lt{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Ou,this.bindMatrix=new Rt,this.bindMatrixInverse=new Rt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let t=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ee),this.boundingBox.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Mo),this.boundingBox.expandByPoint(Mo)}computeBoundingSphere(){let t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new cn),this.boundingSphere.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Mo),this.boundingSphere.expandByPoint(Mo)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Lc.copy(this.boundingSphere),Lc.applyMatrix4(i),t.ray.intersectsSphere(Lc)!==!1&&(Ld.copy(i).invert(),Dc.copy(t.ray).applyMatrix4(Ld),!(this.boundingBox!==null&&Dc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,Dc)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let t=new jt,e=this.geometry.attributes.skinWeight;for(let n=0,i=e.count;n<i;n++){t.fromBufferAttribute(e,n);let r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===Ou?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===sm?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){let n=this.skeleton,i=this.geometry;Pd.fromBufferAttribute(i.attributes.skinIndex,t),Id.fromBufferAttribute(i.attributes.skinWeight,t),zd.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let r=0;r<4;r++){let o=Id.getComponent(r);if(o!==0){let a=Pd.getComponent(r);kd.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),e.addScaledVector(Px.copy(zd).applyMatrix4(kd),o)}}return e.applyMatrix4(this.bindMatrixInverse)}},Sr=class extends pe{constructor(){super(),this.isBone=!0,this.type="Bone"}},Qo=class extends ke{constructor(t=null,e=1,n=1,i,r,o,a,c,l=Be,h=Be,u,d){super(null,o,a,c,l,h,i,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Dd=new Rt,Ix=new Rt,ta=class s{constructor(t=[],e=[]){this.uuid=yn(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Rt)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){let n=new Rt;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let t=this.bones,e=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,o=t.length;r<o;r++){let a=t[r]?t[r].matrixWorld:Ix;Dd.multiplyMatrices(a,e[r]),Dd.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new s(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);let e=new Float32Array(t*t*4);e.set(this.boneMatrices);let n=new Qo(e,t,t,gn,Cn);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){let i=this.bones[e];if(i.name===t)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,i=t.bones.length;n<i;n++){let r=t.bones[n],o=e[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new Sr),this.bones.push(o),this.boneInverses.push(new Rt().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){let t={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;let e=this.bones,n=this.boneInverses;for(let i=0,r=e.length;i<r;i++){let o=e[i];t.bones.push(o.uuid);let a=n[i];t.boneInverses.push(a.toArray())}return t}},Gi=class extends Te{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},gs=new Rt,Nd=new Rt,bo=[],Ud=new Ee,kx=new Rt,or=new Lt,ar=new cn,Ue=class extends Lt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Gi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,kx)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ee),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,gs),Ud.copy(t.boundingBox).applyMatrix4(gs),this.boundingBox.union(Ud)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new cn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,gs),ar.copy(t.boundingSphere).applyMatrix4(gs),this.boundingSphere.union(ar)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(t,e){let n=this.matrixWorld,i=this.count;if(or.geometry=this.geometry,or.material=this.material,or.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ar.copy(this.boundingSphere),ar.applyMatrix4(n),t.ray.intersectsSphere(ar)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,gs),Nd.multiplyMatrices(n,gs),or.matrixWorld=Nd,or.raycast(t,bo);for(let o=0,a=bo.length;o<a;o++){let c=bo[o];c.instanceId=r,c.object=this,e.push(c)}bo.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Gi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){let n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Qo(new Float32Array(i*this.count),i,this.count,_h,Cn));let r=this.morphTexture.source.data.data,o=0;for(let l=0;l<n.length;l++)o+=n[l];let a=this.geometry.morphTargetsRelative?1:1-o,c=i*t;r[c]=a,r.set(n,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var Ar=class extends Ze{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new et(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},ea=new M,na=new M,Od=new Rt,cr=new Hi,So=new cn,Nc=new M,Fd=new M,Us=class extends pe{constructor(t=new Jt,e=new Ar){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)ea.fromBufferAttribute(e,i-1),na.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=ea.distanceTo(na);t.setAttribute("lineDistance",new At(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),So.copy(n.boundingSphere),So.applyMatrix4(i),So.radius+=r,t.ray.intersectsSphere(So)===!1)return;Od.copy(i).invert(),cr.copy(t.ray).applyMatrix4(Od);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let y=f,m=p-1;y<m;y+=l){let g=h.getX(y),v=h.getX(y+1),_=Ao(this,t,cr,c,g,v);_&&e.push(_)}if(this.isLineLoop){let y=h.getX(p-1),m=h.getX(f),g=Ao(this,t,cr,c,y,m);g&&e.push(g)}}else{let f=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let y=f,m=p-1;y<m;y+=l){let g=Ao(this,t,cr,c,y,y+1);g&&e.push(g)}if(this.isLineLoop){let y=Ao(this,t,cr,c,p-1,f);y&&e.push(y)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Ao(s,t,e,n,i,r){let o=s.geometry.attributes.position;if(ea.fromBufferAttribute(o,i),na.fromBufferAttribute(o,r),e.distanceSqToSegment(ea,na,Nc,Fd)>n)return;Nc.applyMatrix4(s.matrixWorld);let c=t.ray.origin.distanceTo(Nc);if(!(c<t.near||c>t.far))return{distance:c,point:Fd.clone().applyMatrix4(s.matrixWorld),index:i,face:null,faceIndex:null,barycoord:null,object:s}}var Bd=new M,Hd=new M,ia=class extends Us{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let i=0,r=e.count;i<r;i+=2)Bd.fromBufferAttribute(e,i),Hd.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Bd.distanceTo(Hd);t.setAttribute("lineDistance",new At(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},sa=class extends Us{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}},Wi=class extends Ze{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new et(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Vd=new Rt,Hl=new Hi,To=new cn,Eo=new M,Os=class extends pe{constructor(t=new Jt,e=new Wi){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),To.copy(n.boundingSphere),To.applyMatrix4(i),To.radius+=r,t.ray.intersectsSphere(To)===!1)return;Vd.copy(i).invert(),Hl.copy(t.ray).applyMatrix4(Vd);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){let d=Math.max(0,o.start),f=Math.min(l.count,o.start+o.count);for(let p=d,y=f;p<y;p++){let m=l.getX(p);Eo.fromBufferAttribute(u,m),Gd(Eo,m,c,i,t,e,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let p=d,y=f;p<y;p++)Eo.fromBufferAttribute(u,p),Gd(Eo,p,c,i,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Gd(s,t,e,n,i,r,o){let a=Hl.distanceSqToPoint(s);if(a<e){let c=new M;Hl.closestPointToPoint(s,c),c.applyMatrix4(n);let l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var me=class extends ke{constructor(t,e,n,i,r,o,a,c,l){super(t,e,n,i,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},xn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,i=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let n=this.getLengths(),i=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(i=Math.floor(a+(c-a)/2),l=n[i]-o,l<0)a=i+1;else if(l>0)c=i-1;else{c=i;break}if(i=c,n[i]===o)return i/(r-1);let h=n[i],d=n[i+1]-h,f=(o-h)/d;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);let o=this.getPoint(i),a=this.getPoint(r),c=e||(o.isVector2?new rt:new M);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){let n=new M,i=[],r=[],o=[],a=new M,c=new Rt;for(let f=0;f<=t;f++){let p=f/t;i[f]=this.getTangentAt(p,new M)}r[0]=new M,o[0]=new M;let l=Number.MAX_VALUE,h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();let p=Math.acos(Ie(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(a,p))}o[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(Ie(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(c.makeRotationAxis(i[p],f*p)),o[p].crossVectors(i[p],r[p])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Tr=class extends xn{constructor(t=0,e=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new rt){let n=e,i=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);let a=this.aStartAngle+t*r,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Vl=class extends Tr{constructor(t,e,n,i,r,o){super(t,e,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Rh(){let s=0,t=0,e=0,n=0;function i(r,o,a,c){s=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){i(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let d=(o-r)/l-(a-r)/(l+h)+(a-o)/h,f=(a-o)/h-(c-o)/(h+u)+(c-a)/u;d*=h,f*=h,i(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return s+t*r+e*o+n*a}}}var Ro=new M,Uc=new Rh,Oc=new Rh,Fc=new Rh,Gl=class extends xn{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new M){let n=e,i=this.points,r=i.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=i[(a-1)%r]:(Ro.subVectors(i[0],i[1]).add(i[0]),l=Ro);let u=i[a%r],d=i[(a+1)%r];if(this.closed||a+2<r?h=i[(a+2)%r]:(Ro.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=Ro),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,p=Math.pow(l.distanceToSquared(u),f),y=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);y<1e-4&&(y=1),p<1e-4&&(p=y),m<1e-4&&(m=y),Uc.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,p,y,m),Oc.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,p,y,m),Fc.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,p,y,m)}else this.curveType==="catmullrom"&&(Uc.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Oc.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),Fc.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(Uc.calc(c),Oc.calc(c),Fc.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new M().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Wd(s,t,e,n,i){let r=(n-t)*.5,o=(i-e)*.5,a=s*s,c=s*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*s+e}function Lx(s,t){let e=1-s;return e*e*t}function Dx(s,t){return 2*(1-s)*s*t}function Nx(s,t){return s*s*t}function mr(s,t,e,n){return Lx(s,t)+Dx(s,e)+Nx(s,n)}function Ux(s,t){let e=1-s;return e*e*e*t}function Ox(s,t){let e=1-s;return 3*e*e*s*t}function Fx(s,t){return 3*(1-s)*s*s*t}function Bx(s,t){return s*s*s*t}function gr(s,t,e,n,i){return Ux(s,t)+Ox(s,e)+Fx(s,n)+Bx(s,i)}var ra=class extends xn{constructor(t=new rt,e=new rt,n=new rt,i=new rt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new rt){let n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(gr(t,i.x,r.x,o.x,a.x),gr(t,i.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Wl=class extends xn{constructor(t=new M,e=new M,n=new M,i=new M){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new M){let n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(gr(t,i.x,r.x,o.x,a.x),gr(t,i.y,r.y,o.y,a.y),gr(t,i.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},oa=class extends xn{constructor(t=new rt,e=new rt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new rt){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new rt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Xl=class extends xn{constructor(t=new M,e=new M){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new M){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new M){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},aa=class extends xn{constructor(t=new rt,e=new rt,n=new rt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new rt){let n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(mr(t,i.x,r.x,o.x),mr(t,i.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ql=class extends xn{constructor(t=new M,e=new M,n=new M){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new M){let n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(mr(t,i.x,r.x,o.x),mr(t,i.y,r.y,o.y),mr(t,i.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ca=class extends xn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new rt){let n=e,i=this.points,r=(i.length-1)*t,o=Math.floor(r),a=r-o,c=i[o===0?o:o-1],l=i[o],h=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(Wd(a,c.x,l.x,h.x,u.x),Wd(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new rt().fromArray(i))}return this}},Xd=Object.freeze({__proto__:null,ArcCurve:Vl,CatmullRomCurve3:Gl,CubicBezierCurve:ra,CubicBezierCurve3:Wl,EllipseCurve:Tr,LineCurve:oa,LineCurve3:Xl,QuadraticBezierCurve:aa,QuadraticBezierCurve3:ql,SplineCurve:ca}),Kl=class extends xn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Xd[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),i=this.getCurveLengths(),r=0;for(;r<i.length;){if(i[r]>=n){let o=i[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let i=0,r=this.curves;i<r.length;i++){let o=r[i],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(new Xd[i.type]().fromJSON(i))}return this}},la=class extends Kl{constructor(t){super(),this.type="Path",this.currentPoint=new rt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new oa(this.currentPoint.clone(),new rt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){let r=new aa(this.currentPoint.clone(),new rt(t,e),new rt(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,o){let a=new ra(this.currentPoint.clone(),new rt(t,e),new rt(n,i),new rt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new ca(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,o){let a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,i,r,o),this}absarc(t,e,n,i,r,o){return this.absellipse(t,e,n,n,i,r,o),this}ellipse(t,e,n,i,r,o,a,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,i,r,o,a,c),this}absellipse(t,e,n,i,r,o,a,c){let l=new Tr(t,e,n,i,r,o,a,c);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}};var We=class s extends Jt{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;i=Math.floor(i),r=Math.floor(r);let h=[],u=[],d=[],f=[],p=0,y=[],m=n/2,g=0;v(),o===!1&&(t>0&&_(!0),e>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new At(u,3)),this.setAttribute("normal",new At(d,3)),this.setAttribute("uv",new At(f,2));function v(){let w=new M,C=new M,A=0,E=(e-t)/n;for(let z=0;z<=r;z++){let N=[],x=z/r,S=x*(e-t)+t;for(let k=0;k<=i;k++){let I=k/i,F=I*c+a,j=Math.sin(F),B=Math.cos(F);C.x=S*j,C.y=-x*n+m,C.z=S*B,u.push(C.x,C.y,C.z),w.set(j,E,B).normalize(),d.push(w.x,w.y,w.z),f.push(I,1-x),N.push(p++)}y.push(N)}for(let z=0;z<i;z++)for(let N=0;N<r;N++){let x=y[N][z],S=y[N+1][z],k=y[N+1][z+1],I=y[N][z+1];t>0&&(h.push(x,S,I),A+=3),e>0&&(h.push(S,k,I),A+=3)}l.addGroup(g,A,0),g+=A}function _(w){let C=p,A=new rt,E=new M,z=0,N=w===!0?t:e,x=w===!0?1:-1;for(let k=1;k<=i;k++)u.push(0,m*x,0),d.push(0,x,0),f.push(.5,.5),p++;let S=p;for(let k=0;k<=i;k++){let F=k/i*c+a,j=Math.cos(F),B=Math.sin(F);E.x=N*B,E.y=m*x,E.z=N*j,u.push(E.x,E.y,E.z),d.push(0,x,0),A.x=j*.5+.5,A.y=B*.5*x+.5,f.push(A.x,A.y),p++}for(let k=0;k<i;k++){let I=C+k,F=S+k;w===!0?h.push(F,F+1,I):h.push(F+1,F,I),z+=3}l.addGroup(g,z,w===!0?1:2),g+=z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},vi=class s extends We{constructor(t=1,e=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new s(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ha=class s extends Jt{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};let r=[],o=[];a(i),l(n),h(),this.setAttribute("position",new At(r,3)),this.setAttribute("normal",new At(r.slice(),3)),this.setAttribute("uv",new At(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(v){let _=new M,w=new M,C=new M;for(let A=0;A<e.length;A+=3)f(e[A+0],_),f(e[A+1],w),f(e[A+2],C),c(_,w,C,v)}function c(v,_,w,C){let A=C+1,E=[];for(let z=0;z<=A;z++){E[z]=[];let N=v.clone().lerp(w,z/A),x=_.clone().lerp(w,z/A),S=A-z;for(let k=0;k<=S;k++)k===0&&z===A?E[z][k]=N:E[z][k]=N.clone().lerp(x,k/S)}for(let z=0;z<A;z++)for(let N=0;N<2*(A-z)-1;N++){let x=Math.floor(N/2);N%2===0?(d(E[z][x+1]),d(E[z+1][x]),d(E[z][x])):(d(E[z][x+1]),d(E[z+1][x+1]),d(E[z+1][x]))}}function l(v){let _=new M;for(let w=0;w<r.length;w+=3)_.x=r[w+0],_.y=r[w+1],_.z=r[w+2],_.normalize().multiplyScalar(v),r[w+0]=_.x,r[w+1]=_.y,r[w+2]=_.z}function h(){let v=new M;for(let _=0;_<r.length;_+=3){v.x=r[_+0],v.y=r[_+1],v.z=r[_+2];let w=m(v)/2/Math.PI+.5,C=g(v)/Math.PI+.5;o.push(w,1-C)}p(),u()}function u(){for(let v=0;v<o.length;v+=6){let _=o[v+0],w=o[v+2],C=o[v+4],A=Math.max(_,w,C),E=Math.min(_,w,C);A>.9&&E<.1&&(_<.2&&(o[v+0]+=1),w<.2&&(o[v+2]+=1),C<.2&&(o[v+4]+=1))}}function d(v){r.push(v.x,v.y,v.z)}function f(v,_){let w=v*3;_.x=t[w+0],_.y=t[w+1],_.z=t[w+2]}function p(){let v=new M,_=new M,w=new M,C=new M,A=new rt,E=new rt,z=new rt;for(let N=0,x=0;N<r.length;N+=9,x+=6){v.set(r[N+0],r[N+1],r[N+2]),_.set(r[N+3],r[N+4],r[N+5]),w.set(r[N+6],r[N+7],r[N+8]),A.set(o[x+0],o[x+1]),E.set(o[x+2],o[x+3]),z.set(o[x+4],o[x+5]),C.copy(v).add(_).add(w).divideScalar(3);let S=m(C);y(A,x+0,v,S),y(E,x+2,_,S),y(z,x+4,w,S)}}function y(v,_,w,C){C<0&&v.x===1&&(o[_]=v.x-1),w.x===0&&w.z===0&&(o[_]=C/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function g(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.vertices,t.indices,t.radius,t.details)}},ua=class s extends ha{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new s(t.radius,t.detail)}};var Er=class extends la{constructor(t){super(t),this.uuid=yn(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(new la().fromJSON(i))}return this}},Hx={triangulate:function(s,t,e=2){let n=t&&t.length,i=n?t[0]*e:s.length,r=Ef(s,0,i,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,c,l,h,u,d,f;if(n&&(r=qx(s,t,r,e)),s.length>80*e){a=l=s[0],c=h=s[1];for(let p=e;p<i;p+=e)u=s[p],d=s[p+1],u<a&&(a=u),d<c&&(c=d),u>l&&(l=u),d>h&&(h=d);f=Math.max(l-a,h-c),f=f!==0?32767/f:0}return Rr(r,o,e,a,c,f,0),o}};function Ef(s,t,e,n,i){let r,o;if(i===iv(s,t,e,n)>0)for(r=t;r<e;r+=n)o=qd(r,s[r],s[r+1],o);else for(r=e-n;r>=t;r-=n)o=qd(r,s[r],s[r+1],o);return o&&Ta(o,o.next)&&(zr(o),o=o.next),o}function Xi(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(Ta(e,e.next)||ye(e.prev,e,e.next)===0)){if(zr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Rr(s,t,e,n,i,r,o){if(!s)return;!o&&r&&Jx(s,n,i,r);let a=s,c,l;for(;s.prev!==s.next;){if(c=s.prev,l=s.next,r?Gx(s,n,i,r):Vx(s)){t.push(c.i/e|0),t.push(s.i/e|0),t.push(l.i/e|0),zr(s),s=l.next,a=l.next;continue}if(s=l,s===a){o?o===1?(s=Wx(Xi(s),t,e),Rr(s,t,e,n,i,r,2)):o===2&&Xx(s,t,e,n,i,r):Rr(Xi(s),t,e,n,i,r,1);break}}}function Vx(s){let t=s.prev,e=s,n=s.next;if(ye(t,e,n)>=0)return!1;let i=t.x,r=e.x,o=n.x,a=t.y,c=e.y,l=n.y,h=i<r?i<o?i:o:r<o?r:o,u=a<c?a<l?a:l:c<l?c:l,d=i>r?i>o?i:o:r>o?r:o,f=a>c?a>l?a:l:c>l?c:l,p=n.next;for(;p!==t;){if(p.x>=h&&p.x<=d&&p.y>=u&&p.y<=f&&ws(i,a,r,c,o,l,p.x,p.y)&&ye(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function Gx(s,t,e,n){let i=s.prev,r=s,o=s.next;if(ye(i,r,o)>=0)return!1;let a=i.x,c=r.x,l=o.x,h=i.y,u=r.y,d=o.y,f=a<c?a<l?a:l:c<l?c:l,p=h<u?h<d?h:d:u<d?u:d,y=a>c?a>l?a:l:c>l?c:l,m=h>u?h>d?h:d:u>d?u:d,g=Yl(f,p,t,e,n),v=Yl(y,m,t,e,n),_=s.prevZ,w=s.nextZ;for(;_&&_.z>=g&&w&&w.z<=v;){if(_.x>=f&&_.x<=y&&_.y>=p&&_.y<=m&&_!==i&&_!==o&&ws(a,h,c,u,l,d,_.x,_.y)&&ye(_.prev,_,_.next)>=0||(_=_.prevZ,w.x>=f&&w.x<=y&&w.y>=p&&w.y<=m&&w!==i&&w!==o&&ws(a,h,c,u,l,d,w.x,w.y)&&ye(w.prev,w,w.next)>=0))return!1;w=w.nextZ}for(;_&&_.z>=g;){if(_.x>=f&&_.x<=y&&_.y>=p&&_.y<=m&&_!==i&&_!==o&&ws(a,h,c,u,l,d,_.x,_.y)&&ye(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;w&&w.z<=v;){if(w.x>=f&&w.x<=y&&w.y>=p&&w.y<=m&&w!==i&&w!==o&&ws(a,h,c,u,l,d,w.x,w.y)&&ye(w.prev,w,w.next)>=0)return!1;w=w.nextZ}return!0}function Wx(s,t,e){let n=s;do{let i=n.prev,r=n.next.next;!Ta(i,r)&&Rf(i,n,n.next,r)&&Cr(i,r)&&Cr(r,i)&&(t.push(i.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),zr(n),zr(n.next),n=s=r),n=n.next}while(n!==s);return Xi(n)}function Xx(s,t,e,n,i,r){let o=s;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&tv(o,a)){let c=Cf(o,a);o=Xi(o,o.next),c=Xi(c,c.next),Rr(o,t,e,n,i,r,0),Rr(c,t,e,n,i,r,0);return}a=a.next}o=o.next}while(o!==s)}function qx(s,t,e,n){let i=[],r,o,a,c,l;for(r=0,o=t.length;r<o;r++)a=t[r]*n,c=r<o-1?t[r+1]*n:s.length,l=Ef(s,a,c,n,!1),l===l.next&&(l.steiner=!0),i.push(Qx(l));for(i.sort(Kx),r=0;r<i.length;r++)e=Yx(i[r],e);return e}function Kx(s,t){return s.x-t.x}function Yx(s,t){let e=Zx(s,t);if(!e)return t;let n=Cf(e,s);return Xi(n,n.next),Xi(e,e.next)}function Zx(s,t){let e=t,n=-1/0,i,r=s.x,o=s.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){let d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=r&&d>n&&(n=d,i=e.x<e.next.x?e:e.next,d===r))return i}e=e.next}while(e!==t);if(!i)return null;let a=i,c=i.x,l=i.y,h=1/0,u;e=i;do r>=e.x&&e.x>=c&&r!==e.x&&ws(o<l?r:n,o,c,l,o<l?n:r,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(r-e.x),Cr(e,s)&&(u<h||u===h&&(e.x>i.x||e.x===i.x&&jx(i,e)))&&(i=e,h=u)),e=e.next;while(e!==a);return i}function jx(s,t){return ye(s.prev,s,t.prev)<0&&ye(t.next,s,s.next)<0}function Jx(s,t,e,n){let i=s;do i.z===0&&(i.z=Yl(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,$x(i)}function $x(s){let t,e,n,i,r,o,a,c,l=1;do{for(e=s,s=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<l&&(a++,n=n.nextZ,!!n);t++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||e.z<=n.z)?(i=e,e=e.nextZ,a--):(i=n,n=n.nextZ,c--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;e=n}r.nextZ=null,l*=2}while(o>1);return s}function Yl(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function Qx(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function ws(s,t,e,n,i,r,o,a){return(i-o)*(t-a)>=(s-o)*(r-a)&&(s-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(i-o)*(n-a)}function tv(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!ev(s,t)&&(Cr(s,t)&&Cr(t,s)&&nv(s,t)&&(ye(s.prev,s,t.prev)||ye(s,t.prev,t))||Ta(s,t)&&ye(s.prev,s,s.next)>0&&ye(t.prev,t,t.next)>0)}function ye(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function Ta(s,t){return s.x===t.x&&s.y===t.y}function Rf(s,t,e,n){let i=zo(ye(s,t,e)),r=zo(ye(s,t,n)),o=zo(ye(e,n,s)),a=zo(ye(e,n,t));return!!(i!==r&&o!==a||i===0&&Co(s,e,t)||r===0&&Co(s,n,t)||o===0&&Co(e,s,n)||a===0&&Co(e,t,n))}function Co(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function zo(s){return s>0?1:s<0?-1:0}function ev(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&Rf(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function Cr(s,t){return ye(s.prev,s,s.next)<0?ye(s,t,s.next)>=0&&ye(s,s.prev,t)>=0:ye(s,t,s.prev)<0||ye(s,s.next,t)<0}function nv(s,t){let e=s,n=!1,i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function Cf(s,t){let e=new Zl(s.i,s.x,s.y),n=new Zl(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function qd(s,t,e,n){let i=new Zl(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function zr(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Zl(s,t,e){this.i=s,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function iv(s,t,e,n){let i=0;for(let r=t,o=e-n;r<e;r+=n)i+=(s[o]-s[r])*(s[r+1]+s[o+1]),o=r;return i}var yr=class s{static area(t){let e=t.length,n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return s.area(t)<0}static triangulateShape(t,e){let n=[],i=[],r=[];Kd(t),Yd(n,t);let o=t.length;e.forEach(Kd);for(let c=0;c<e.length;c++)i.push(o),o+=e[c].length,Yd(n,e[c]);let a=Hx.triangulate(n,i);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}};function Kd(s){let t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function Yd(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}var Nn=class s extends ha{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new s(t.radius,t.detail)}};var Qn=class s extends Jt{constructor(t=.5,e=1,n=32,i=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:o},n=Math.max(3,n),i=Math.max(1,i);let a=[],c=[],l=[],h=[],u=t,d=(e-t)/i,f=new M,p=new rt;for(let y=0;y<=i;y++){for(let m=0;m<=n;m++){let g=r+m/n*o;f.x=u*Math.cos(g),f.y=u*Math.sin(g),c.push(f.x,f.y,f.z),l.push(0,0,1),p.x=(f.x/e+1)/2,p.y=(f.y/e+1)/2,h.push(p.x,p.y)}u+=d}for(let y=0;y<i;y++){let m=y*(n+1);for(let g=0;g<n;g++){let v=g+m,_=v,w=v+n+1,C=v+n+2,A=v+1;a.push(_,w,A),a.push(w,C,A)}}this.setIndex(a),this.setAttribute("position",new At(c,3)),this.setAttribute("normal",new At(l,3)),this.setAttribute("uv",new At(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},da=class s extends Jt{constructor(t=new Er([new rt(0,.5),new rt(-.5,-.5),new rt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],i=[],r=[],o=[],a=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(a,c,h),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new At(i,3)),this.setAttribute("normal",new At(r,3)),this.setAttribute("uv",new At(o,2));function l(h){let u=i.length/3,d=h.extractPoints(e),f=d.shape,p=d.holes;yr.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,g=p.length;m<g;m++){let v=p[m];yr.isClockWise(v)===!0&&(p[m]=v.reverse())}let y=yr.triangulateShape(f,p);for(let m=0,g=p.length;m<g;m++){let v=p[m];f=f.concat(v)}for(let m=0,g=f.length;m<g;m++){let v=f[m];i.push(v.x,v.y,0),r.push(0,0,1),o.push(v.x,v.y)}for(let m=0,g=y.length;m<g;m++){let v=y[m],_=v[0]+u,w=v[1]+u,C=v[2]+u;n.push(_,w,C),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return sv(e,t)}static fromJSON(t,e){let n=[];for(let i=0,r=t.shapes.length;i<r;i++){let o=e[t.shapes[i]];n.push(o)}return new s(n,t.curveSegments)}};function sv(s,t){if(t.shapes=[],Array.isArray(s))for(let e=0,n=s.length;e<n;e++){let i=s[e];t.shapes.push(i.uuid)}else t.shapes.push(s.uuid);return t}var ze=class s extends Jt{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let c=Math.min(o+a,Math.PI),l=0,h=[],u=new M,d=new M,f=[],p=[],y=[],m=[];for(let g=0;g<=n;g++){let v=[],_=g/n,w=0;g===0&&o===0?w=.5/e:g===n&&c===Math.PI&&(w=-.5/e);for(let C=0;C<=e;C++){let A=C/e;u.x=-t*Math.cos(i+A*r)*Math.sin(o+_*a),u.y=t*Math.cos(o+_*a),u.z=t*Math.sin(i+A*r)*Math.sin(o+_*a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),y.push(d.x,d.y,d.z),m.push(A+w,1-_),v.push(l++)}h.push(v)}for(let g=0;g<n;g++)for(let v=0;v<e;v++){let _=h[g][v+1],w=h[g][v],C=h[g+1][v],A=h[g+1][v+1];(g!==0||o>0)&&f.push(_,w,A),(g!==n-1||c<Math.PI)&&f.push(w,C,A)}this.setIndex(f),this.setAttribute("position",new At(p,3)),this.setAttribute("normal",new At(y,3)),this.setAttribute("uv",new At(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var fa=class s extends Jt{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);let o=[],a=[],c=[],l=[],h=new M,u=new M,d=new M;for(let f=0;f<=n;f++)for(let p=0;p<=i;p++){let y=p/i*r,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(y),u.y=(t+e*Math.cos(m))*Math.sin(y),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(y),h.y=t*Math.sin(y),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(p/i),l.push(f/n)}for(let f=1;f<=n;f++)for(let p=1;p<=i;p++){let y=(i+1)*f+p-1,m=(i+1)*(f-1)+p-1,g=(i+1)*(f-1)+p,v=(i+1)*f+p;o.push(y,m,v),o.push(m,g,v)}this.setIndex(o),this.setAttribute("position",new At(a,3)),this.setAttribute("normal",new At(c,3)),this.setAttribute("uv",new At(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var Fs=class extends Ze{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new et(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new et(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Sh,this.normalScale=new rt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},hn=class extends Fs{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new rt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ie(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new et(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new et(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new et(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var ge=class extends Ze{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new et(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new et(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Sh,this.normalScale=new rt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=dh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function Fi(s,t,e){return!s||!e&&s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function zf(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function Pf(s){function t(i,r){return s[i]-s[r]}let e=s.length,n=new Array(e);for(let i=0;i!==e;++i)n[i]=i;return n.sort(t),n}function jl(s,t,e){let n=s.length,i=new s.constructor(n);for(let r=0,o=0;o!==n;++r){let a=e[r]*t;for(let c=0;c!==t;++c)i[o++]=s[a+c]}return i}function Ch(s,t,e,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(t.push(r.time),e.push.apply(e,o)),r=s[i++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(t.push(r.time),o.toArray(e,e.length)),r=s[i++];while(r!==void 0);else do o=r[n],o!==void 0&&(t.push(r.time),e.push(o)),r=s[i++];while(r!==void 0)}function rv(s,t,e,n,i=30){let r=s.clone();r.name=t;let o=[];for(let c=0;c<r.tracks.length;++c){let l=r.tracks[c],h=l.getValueSize(),u=[],d=[];for(let f=0;f<l.times.length;++f){let p=l.times[f]*i;if(!(p<e||p>=n)){u.push(l.times[f]);for(let y=0;y<h;++y)d.push(l.values[f*h+y])}}u.length!==0&&(l.times=Fi(u,l.times.constructor),l.values=Fi(d,l.values.constructor),o.push(l))}r.tracks=o;let a=1/0;for(let c=0;c<r.tracks.length;++c)a>r.tracks[c].times[0]&&(a=r.tracks[c].times[0]);for(let c=0;c<r.tracks.length;++c)r.tracks[c].shift(-1*a);return r.resetDuration(),r}function ov(s,t=0,e=s,n=30){n<=0&&(n=30);let i=e.tracks.length,r=t/n;for(let o=0;o<i;++o){let a=e.tracks[o],c=a.ValueTypeName;if(c==="bool"||c==="string")continue;let l=s.tracks.find(function(g){return g.name===a.name&&g.ValueTypeName===c});if(l===void 0)continue;let h=0,u=a.getValueSize();a.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(h=u/3);let d=0,f=l.getValueSize();l.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(d=f/3);let p=a.times.length-1,y;if(r<=a.times[0]){let g=h,v=u-h;y=a.values.slice(g,v)}else if(r>=a.times[p]){let g=p*u+h,v=g+u-h;y=a.values.slice(g,v)}else{let g=a.createInterpolant(),v=h,_=u-h;g.evaluate(r),y=g.resultBuffer.slice(v,_)}c==="quaternion"&&new Ft().fromArray(y).normalize().conjugate().toArray(y);let m=l.times.length;for(let g=0;g<m;++g){let v=g*f+d;if(c==="quaternion")Ft.multiplyQuaternionsFlat(l.values,v,y,0,l.values,v);else{let _=f-d*2;for(let w=0;w<_;++w)l.values[v+w]-=y[w]}}}return s.blendMode=ff,s}var If={convertArray:Fi,isTypedArray:zf,getKeyframeOrder:Pf,sortedArray:jl,flattenJSON:Ch,subclip:rv,makeClipAdditive:ov},wi=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],r=e[n-1];t:{e:{let o;n:{i:if(!(t<i)){for(let a=n+2;;){if(i===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=e[++n],t<i)break e}o=e.length;break n}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(i=r,r=e[--n-1],t>=r)break e}o=n,n=0;break n}break t}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(i=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i;for(let o=0;o!==i;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Jl=class extends wi{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:_s,endingEnd:_s}}intervalChanged_(t,e,n){let i=this.parameterPositions,r=t-2,o=t+1,a=i[r],c=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case xs:r=t,a=2*e-n;break;case Oo:r=i.length-2,a=e+i[r]-i[r+1];break;default:r=t,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case xs:o=t,c=2*n-e;break;case Oo:o=1,c=n+i[1]-i[0];break;default:o=t-1,c=e}let l=(n-e)*.5,h=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-e)/(i-e),y=p*p,m=y*p,g=-d*m+2*d*y-d*p,v=(1+d)*m+(-1.5-2*d)*y+(-.5+d)*p+1,_=(-1-f)*m+(1.5+f)*y+.5*p,w=f*m-f*y;for(let C=0;C!==a;++C)r[C]=g*o[h+C]+v*o[l+C]+_*o[c+C]+w*o[u+C];return r}},pa=class extends wi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=(n-e)/(i-e),u=1-h;for(let d=0;d!==a;++d)r[d]=o[l+d]*u+o[c+d]*h;return r}},$l=class extends wi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},vn=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Fi(e,this.TimeBufferType),this.values=Fi(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Fi(t.times,Array),values:Fi(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new $l(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new pa(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Jl(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Ps:e=this.InterpolantFactoryMethodDiscrete;break;case Is:e=this.InterpolantFactoryMethodLinear;break;case rc:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ps;case this.InterpolantFactoryMethodLinear:return Is;case this.InterpolantFactoryMethodSmooth:return rc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t}return this}trim(t,e){let n=this.times,i=n.length,r=0,o=i-1;for(;r!==i&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(i!==void 0&&zf(i))for(let a=0,c=i.length;a!==c;++a){let l=i[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===rc,r=t.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=t[a],h=t[a+1];if(l!==h&&(a!==1||l!==t[0]))if(i)c=!0;else{let u=a*n,d=u-n,f=u+n;for(let p=0;p!==n;++p){let y=e[u+p];if(y!==e[d+p]||y!==e[f+p]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)e[d+f]=e[u+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,i}};vn.prototype.TimeBufferType=Float32Array;vn.prototype.ValueBufferType=Float32Array;vn.prototype.DefaultInterpolation=Is;var Mi=class extends vn{constructor(t,e,n){super(t,e,n)}};Mi.prototype.ValueTypeName="bool";Mi.prototype.ValueBufferType=Array;Mi.prototype.DefaultInterpolation=Ps;Mi.prototype.InterpolantFactoryMethodLinear=void 0;Mi.prototype.InterpolantFactoryMethodSmooth=void 0;var ma=class extends vn{};ma.prototype.ValueTypeName="color";var ti=class extends vn{};ti.prototype.ValueTypeName="number";var Ql=class extends wi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-e)/(i-e),l=t*a;for(let h=l+a;l!==h;l+=4)Ft.slerpFlat(r,0,o,l-a,o,l,c);return r}},ei=class extends vn{InterpolantFactoryMethodLinear(t){return new Ql(this.times,this.values,this.getValueSize(),t)}};ei.prototype.ValueTypeName="quaternion";ei.prototype.InterpolantFactoryMethodSmooth=void 0;var bi=class extends vn{constructor(t,e,n){super(t,e,n)}};bi.prototype.ValueTypeName="string";bi.prototype.ValueBufferType=Array;bi.prototype.DefaultInterpolation=Ps;bi.prototype.InterpolantFactoryMethodLinear=void 0;bi.prototype.InterpolantFactoryMethodSmooth=void 0;var ni=class extends vn{};ni.prototype.ValueTypeName="vector";var Bs=class{constructor(t="",e=-1,n=[],i=bh){this.name=t,this.tracks=n,this.duration=e,this.blendMode=i,this.uuid=yn(),this.duration<0&&this.resetDuration()}static parse(t){let e=[],n=t.tracks,i=1/(t.fps||1);for(let o=0,a=n.length;o!==a;++o)e.push(cv(n[o]).scale(i));let r=new this(t.name,t.duration,e,t.blendMode);return r.uuid=t.uuid,r}static toJSON(t){let e=[],n=t.tracks,i={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode};for(let r=0,o=n.length;r!==o;++r)e.push(vn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(t,e,n,i){let r=e.length,o=[];for(let a=0;a<r;a++){let c=[],l=[];c.push((a+r-1)%r,a,(a+1)%r),l.push(0,1,0);let h=Pf(c);c=jl(c,1,h),l=jl(l,1,h),!i&&c[0]===0&&(c.push(r),l.push(l[0])),o.push(new ti(".morphTargetInfluences["+e[a].name+"]",c,l).scale(1/n))}return new this(t,-1,o)}static findByName(t,e){let n=t;if(!Array.isArray(t)){let i=t;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===e)return n[i];return null}static CreateClipsFromMorphTargetSequences(t,e,n){let i={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,c=t.length;a<c;a++){let l=t[a],h=l.name.match(r);if(h&&h.length>1){let u=h[1],d=i[u];d||(i[u]=d=[]),d.push(l)}}let o=[];for(let a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],e,n));return o}static parseAnimation(t,e){if(!t)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let n=function(u,d,f,p,y){if(f.length!==0){let m=[],g=[];Ch(f,m,g,p),m.length!==0&&y.push(new u(d,m,g))}},i=[],r=t.name||"default",o=t.fps||30,a=t.blendMode,c=t.length||-1,l=t.hierarchy||[];for(let u=0;u<l.length;u++){let d=l[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){let f={},p;for(p=0;p<d.length;p++)if(d[p].morphTargets)for(let y=0;y<d[p].morphTargets.length;y++)f[d[p].morphTargets[y]]=-1;for(let y in f){let m=[],g=[];for(let v=0;v!==d[p].morphTargets.length;++v){let _=d[p];m.push(_.time),g.push(_.morphTarget===y?1:0)}i.push(new ti(".morphTargetInfluence["+y+"]",m,g))}c=f.length*o}else{let f=".bones["+e[u].name+"]";n(ni,f+".position",d,"pos",i),n(ei,f+".quaternion",d,"rot",i),n(ni,f+".scale",d,"scl",i)}}return i.length===0?null:new this(r,c,i,a)}resetDuration(){let t=this.tracks,e=0;for(let n=0,i=t.length;n!==i;++n){let r=this.tracks[n];e=Math.max(e,r.times[r.times.length-1])}return this.duration=e,this}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this}clone(){let t=[];for(let e=0;e<this.tracks.length;e++)t.push(this.tracks[e].clone());return new this.constructor(this.name,this.duration,t,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}};function av(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ti;case"vector":case"vector2":case"vector3":case"vector4":return ni;case"color":return ma;case"quaternion":return ei;case"bool":case"boolean":return Mi;case"string":return bi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function cv(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let t=av(s.type);if(s.times===void 0){let e=[],n=[];Ch(s.keys,e,n,"value"),s.times=e,s.values=n}return t.parse!==void 0?t.parse(s):new t(s.name,s.times,s.values,s.interpolation)}var gi={enabled:!1,files:{},add:function(s,t){this.enabled!==!1&&(this.files[s]=t)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}},th=class{constructor(t,e,n){let i=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){let f=l[u],p=l[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null}}},lv=new th,ii=class{constructor(t){this.manager=t!==void 0?t:lv,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};ii.DEFAULT_MATERIAL_NAME="__DEFAULT";var Xn={},eh=class extends Error{constructor(t,e){super(t),this.response=e}},Pr=class extends ii{constructor(t){super(t)}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=gi.get(t);if(r!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0),r;if(Xn[t]!==void 0){Xn[t].push({onLoad:e,onProgress:n,onError:i});return}Xn[t]=[],Xn[t].push({onLoad:e,onProgress:n,onError:i});let o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let h=Xn[t],u=l.body.getReader(),d=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=d?parseInt(d):0,p=f!==0,y=0,m=new ReadableStream({start(g){v();function v(){u.read().then(({done:_,value:w})=>{if(_)g.close();else{y+=w.byteLength;let C=new ProgressEvent("progress",{lengthComputable:p,loaded:y,total:f});for(let A=0,E=h.length;A<E;A++){let z=h[A];z.onProgress&&z.onProgress(C)}g.enqueue(w),v()}},_=>{g.error(_)})}}});return new Response(m)}else throw new eh(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a===void 0)return l.text();{let u=/charset="?([^;"\s]*)"?/i.exec(a),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return l.arrayBuffer().then(p=>f.decode(p))}}}).then(l=>{gi.add(t,l);let h=Xn[t];delete Xn[t];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onLoad&&f.onLoad(l)}}).catch(l=>{let h=Xn[t];if(h===void 0)throw this.manager.itemError(t),l;delete Xn[t];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onError&&f.onError(l)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}};var nh=class extends ii{constructor(t){super(t)}load(t,e,n,i){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=gi.get(t);if(o!==void 0)return r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0),o;let a=wr("img");function c(){h(),gi.add(t,this),e&&e(this),r.manager.itemEnd(t)}function l(u){h(),i&&i(u),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(t),a.src=t,a}};var ga=class extends ii{constructor(t){super(t)}load(t,e,n,i){let r=new ke,o=new nh(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,i),r}},qi=class extends pe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new et(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},ya=class extends qi{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(pe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new et(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},Bc=new Rt,Zd=new M,jd=new M,Ir=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new rt(512,512),this.map=null,this.mapPass=null,this.matrix=new Rt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new br,this._frameExtents=new rt(1,1),this._viewportCount=1,this._viewports=[new jt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Zd.setFromMatrixPosition(t.matrixWorld),e.position.copy(Zd),jd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(jd),e.updateMatrixWorld(),Bc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Bc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},ih=class extends Ir{constructor(){super(new Ne(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){let e=this.camera,n=ks*2*t.angle*this.focus,i=this.mapSize.width/this.mapSize.height,r=t.distance||e.far;(n!==e.fov||i!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=i,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}},_a=class extends qi{constructor(t,e,n=0,i=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(pe.DEFAULT_UP),this.updateMatrix(),this.target=new pe,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new ih}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},Jd=new Rt,lr=new M,Hc=new M,sh=class extends Ir{constructor(){super(new Ne(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new rt(4,2),this._viewportCount=6,this._viewports=[new jt(2,1,1,1),new jt(0,1,1,1),new jt(3,1,1,1),new jt(1,1,1,1),new jt(3,0,1,1),new jt(1,0,1,1)],this._cubeDirections=[new M(1,0,0),new M(-1,0,0),new M(0,0,1),new M(0,0,-1),new M(0,1,0),new M(0,-1,0)],this._cubeUps=[new M(0,1,0),new M(0,1,0),new M(0,1,0),new M(0,1,0),new M(0,0,1),new M(0,0,-1)]}updateMatrices(t,e=0){let n=this.camera,i=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),lr.setFromMatrixPosition(t.matrixWorld),n.position.copy(lr),Hc.copy(n.position),Hc.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Hc),n.updateMatrixWorld(),i.makeTranslation(-lr.x,-lr.y,-lr.z),Jd.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Jd)}},un=class extends qi{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new sh}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},rh=class extends Ir{constructor(){super(new xi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ki=class extends qi{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(pe.DEFAULT_UP),this.updateMatrix(),this.target=new pe,this.shadow=new rh}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},xa=class extends qi{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}};var Si=class{static decodeText(t){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(t);let e="";for(let n=0,i=t.length;n<i;n++)e+=String.fromCharCode(t[n]);try{return decodeURIComponent(escape(e))}catch{return e}}static extractUrlBase(t){let e=t.lastIndexOf("/");return e===-1?"./":t.slice(0,e+1)}static resolveURL(t,e){return typeof t!="string"||t===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(t)&&(e=e.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(t)||/^data:.*,.*$/i.test(t)||/^blob:.*$/i.test(t)?t:e+t)}};var va=class extends ii{constructor(t){super(t),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(t){return this.options=t,this}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=gi.get(t);if(o!==void 0){if(r.manager.itemStart(t),o.then){o.then(l=>{e&&e(l),r.manager.itemEnd(t)}).catch(l=>{i&&i(l)});return}return setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0),o}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader;let c=fetch(t,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(l){return gi.add(t,l),e&&e(l),r.manager.itemEnd(t),l}).catch(function(l){i&&i(l),gi.remove(t),r.manager.itemError(t),r.manager.itemEnd(t)});gi.add(t,c),r.manager.itemStart(t)}};var wa=class{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=$d(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let e=$d();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}};function $d(){return performance.now()}var oh=class{constructor(t,e,n){this.binding=t,this.valueSize=n;let i,r,o;switch(e){case"quaternion":i=this._slerp,r=this._slerpAdditive,o=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,r=this._select,o=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,r=this._lerpAdditive,o=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=r,this._setIdentity=o,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(t,e){let n=this.buffer,i=this.valueSize,r=t*i+i,o=this.cumulativeWeight;if(o===0){for(let a=0;a!==i;++a)n[r+a]=n[a];o=e}else{o+=e;let a=e/o;this._mixBufferRegion(n,r,0,a,i)}this.cumulativeWeight=o}accumulateAdditive(t){let e=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(e,i,0,t,n),this.cumulativeWeightAdditive+=t}apply(t){let e=this.valueSize,n=this.buffer,i=t*e+e,r=this.cumulativeWeight,o=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){let c=e*this._origIndex;this._mixBufferRegion(n,i,c,1-r,e)}o>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*e,1,e);for(let c=e,l=e+e;c!==l;++c)if(n[c]!==n[c+e]){a.setValue(n,i);break}}saveOriginalState(){let t=this.binding,e=this.buffer,n=this.valueSize,i=n*this._origIndex;t.getValue(e,i);for(let r=n,o=i;r!==o;++r)e[r]=e[i+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let t=this.valueSize*3;this.binding.setValue(this.buffer,t)}_setAdditiveIdentityNumeric(){let t=this._addIndex*this.valueSize,e=t+this.valueSize;for(let n=t;n<e;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let t=this._origIndex*this.valueSize,e=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[e+n]=this.buffer[t+n]}_select(t,e,n,i,r){if(i>=.5)for(let o=0;o!==r;++o)t[e+o]=t[n+o]}_slerp(t,e,n,i){Ft.slerpFlat(t,e,t,e,t,n,i)}_slerpAdditive(t,e,n,i,r){let o=this._workIndex*r;Ft.multiplyQuaternionsFlat(t,o,t,e,t,n),Ft.slerpFlat(t,e,t,e,t,o,i)}_lerp(t,e,n,i,r){let o=1-i;for(let a=0;a!==r;++a){let c=e+a;t[c]=t[c]*o+t[n+a]*i}}_lerpAdditive(t,e,n,i,r){for(let o=0;o!==r;++o){let a=e+o;t[a]=t[a]+t[n+o]*i}}},zh="\\[\\]\\.:\\/",hv=new RegExp("["+zh+"]","g"),Ph="[^"+zh+"]",uv="[^"+zh.replace("\\.","")+"]",dv=/((?:WC+[\/:])*)/.source.replace("WC",Ph),fv=/(WCOD+)?/.source.replace("WCOD",uv),pv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ph),mv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ph),gv=new RegExp("^"+dv+fv+pv+mv+"$"),yv=["material","materials","bones","map"],ah=class{constructor(t,e,n){let i=n||oe.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},oe=class s{constructor(t,e,n){this.path=e,this.parsedPath=n||s.parseTrackName(e),this.node=s.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new s.Composite(t,e,n):new s(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(hv,"")}static parseTrackName(t){let e=gv.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);yv.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let c=n(a.children);if(c)return c}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,r=e.propertyIndex;if(t||(t=s.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let o=t[i];if(o===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};oe.Composite=ah;oe.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};oe.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};oe.prototype.GetterByBindingType=[oe.prototype._getValue_direct,oe.prototype._getValue_array,oe.prototype._getValue_arrayElement,oe.prototype._getValue_toArray];oe.prototype.SetterByBindingTypeAndVersioning=[[oe.prototype._setValue_direct,oe.prototype._setValue_direct_setNeedsUpdate,oe.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[oe.prototype._setValue_array,oe.prototype._setValue_array_setNeedsUpdate,oe.prototype._setValue_array_setMatrixWorldNeedsUpdate],[oe.prototype._setValue_arrayElement,oe.prototype._setValue_arrayElement_setNeedsUpdate,oe.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[oe.prototype._setValue_fromArray,oe.prototype._setValue_fromArray_setNeedsUpdate,oe.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var ch=class{constructor(t,e,n=null,i=e.blendMode){this._mixer=t,this._clip=e,this._localRoot=n,this.blendMode=i;let r=e.tracks,o=r.length,a=new Array(o),c={endingStart:_s,endingEnd:_s};for(let l=0;l!==o;++l){let h=r[l].createInterpolant(null);a[l]=h,h.settings=c}this._interpolantSettings=c,this._interpolants=a,this._propertyBindings=new Array(o),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=rm,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(t){return this._startTime=t,this}setLoop(t,e){return this.loop=t,this.repetitions=e,this}setEffectiveWeight(t){return this.weight=t,this._effectiveWeight=this.enabled?t:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(t){return this._scheduleFading(t,0,1)}fadeOut(t){return this._scheduleFading(t,1,0)}crossFadeFrom(t,e,n){if(t.fadeOut(e),this.fadeIn(e),n){let i=this._clip.duration,r=t._clip.duration,o=r/i,a=i/r;t.warp(1,o,e),this.warp(a,1,e)}return this}crossFadeTo(t,e,n){return t.crossFadeFrom(this,e,n)}stopFading(){let t=this._weightInterpolant;return t!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}setEffectiveTimeScale(t){return this.timeScale=t,this._effectiveTimeScale=this.paused?0:t,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(t){return this.timeScale=this._clip.duration/t,this.stopWarping()}syncWith(t){return this.time=t.time,this.timeScale=t.timeScale,this.stopWarping()}halt(t){return this.warp(this._effectiveTimeScale,0,t)}warp(t,e,n){let i=this._mixer,r=i.time,o=this.timeScale,a=this._timeScaleInterpolant;a===null&&(a=i._lendControlInterpolant(),this._timeScaleInterpolant=a);let c=a.parameterPositions,l=a.sampleValues;return c[0]=r,c[1]=r+n,l[0]=t/o,l[1]=e/o,this}stopWarping(){let t=this._timeScaleInterpolant;return t!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(t,e,n,i){if(!this.enabled){this._updateWeight(t);return}let r=this._startTime;if(r!==null){let c=(t-r)*n;c<0||n===0?e=0:(this._startTime=null,e=n*c)}e*=this._updateTimeScale(t);let o=this._updateTime(e),a=this._updateWeight(t);if(a>0){let c=this._interpolants,l=this._propertyBindings;switch(this.blendMode){case ff:for(let h=0,u=c.length;h!==u;++h)c[h].evaluate(o),l[h].accumulateAdditive(a);break;case bh:default:for(let h=0,u=c.length;h!==u;++h)c[h].evaluate(o),l[h].accumulate(i,a)}}}_updateWeight(t){let e=0;if(this.enabled){e=this.weight;let n=this._weightInterpolant;if(n!==null){let i=n.evaluate(t)[0];e*=i,t>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=e,e}_updateTimeScale(t){let e=0;if(!this.paused){e=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let i=n.evaluate(t)[0];e*=i,t>n.parameterPositions[1]&&(this.stopWarping(),e===0?this.paused=!0:this.timeScale=e)}}return this._effectiveTimeScale=e,e}_updateTime(t){let e=this._clip.duration,n=this.loop,i=this.time+t,r=this._loopCount,o=n===om;if(t===0)return r===-1?i:o&&(r&1)===1?e-i:i;if(n===Mh){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));t:{if(i>=e)i=e;else if(i<0)i=0;else{this.time=i;break t}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:t<0?-1:1})}}else{if(r===-1&&(t>=0?(r=0,this._setEndings(!0,this.repetitions===0,o)):this._setEndings(this.repetitions===0,!0,o)),i>=e||i<0){let a=Math.floor(i/e);i-=e*a,r+=Math.abs(a);let c=this.repetitions-r;if(c<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=t>0?e:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:t>0?1:-1});else{if(c===1){let l=t<0;this._setEndings(l,!l,o)}else this._setEndings(!1,!1,o);this._loopCount=r,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this.time=i;if(o&&(r&1)===1)return e-i}return i}_setEndings(t,e,n){let i=this._interpolantSettings;n?(i.endingStart=xs,i.endingEnd=xs):(t?i.endingStart=this.zeroSlopeAtStart?xs:_s:i.endingStart=Oo,e?i.endingEnd=this.zeroSlopeAtEnd?xs:_s:i.endingEnd=Oo)}_scheduleFading(t,e,n){let i=this._mixer,r=i.time,o=this._weightInterpolant;o===null&&(o=i._lendControlInterpolant(),this._weightInterpolant=o);let a=o.parameterPositions,c=o.sampleValues;return a[0]=r,c[0]=e,a[1]=r+t,c[1]=n,this}},_v=new Float32Array(1),kr=class extends Jn{constructor(t){super(),this._root=t,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(t,e){let n=t._localRoot||this._root,i=t._clip.tracks,r=i.length,o=t._propertyBindings,a=t._interpolants,c=n.uuid,l=this._bindingsByRootAndName,h=l[c];h===void 0&&(h={},l[c]=h);for(let u=0;u!==r;++u){let d=i[u],f=d.name,p=h[f];if(p!==void 0)++p.referenceCount,o[u]=p;else{if(p=o[u],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,c,f));continue}let y=e&&e._propertyBindings[u].binding.parsedPath;p=new oh(oe.create(n,f,y),d.ValueTypeName,d.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,c,f),o[u]=p}a[u].resultBuffer=p.buffer}}_activateAction(t){if(!this._isActiveAction(t)){if(t._cacheIndex===null){let n=(t._localRoot||this._root).uuid,i=t._clip.uuid,r=this._actionsByClip[i];this._bindAction(t,r&&r.knownActions[0]),this._addInactiveAction(t,i,n)}let e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){let r=e[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(t)}}_deactivateAction(t){if(this._isActiveAction(t)){let e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){let r=e[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(t)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let t=this;this.stats={actions:{get total(){return t._actions.length},get inUse(){return t._nActiveActions}},bindings:{get total(){return t._bindings.length},get inUse(){return t._nActiveBindings}},controlInterpolants:{get total(){return t._controlInterpolants.length},get inUse(){return t._nActiveControlInterpolants}}}}_isActiveAction(t){let e=t._cacheIndex;return e!==null&&e<this._nActiveActions}_addInactiveAction(t,e,n){let i=this._actions,r=this._actionsByClip,o=r[e];if(o===void 0)o={knownActions:[t],actionByRoot:{}},t._byClipCacheIndex=0,r[e]=o;else{let a=o.knownActions;t._byClipCacheIndex=a.length,a.push(t)}t._cacheIndex=i.length,i.push(t),o.actionByRoot[n]=t}_removeInactiveAction(t){let e=this._actions,n=e[e.length-1],i=t._cacheIndex;n._cacheIndex=i,e[i]=n,e.pop(),t._cacheIndex=null;let r=t._clip.uuid,o=this._actionsByClip,a=o[r],c=a.knownActions,l=c[c.length-1],h=t._byClipCacheIndex;l._byClipCacheIndex=h,c[h]=l,c.pop(),t._byClipCacheIndex=null;let u=a.actionByRoot,d=(t._localRoot||this._root).uuid;delete u[d],c.length===0&&delete o[r],this._removeInactiveBindingsForAction(t)}_removeInactiveBindingsForAction(t){let e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){let r=e[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(t){let e=this._actions,n=t._cacheIndex,i=this._nActiveActions++,r=e[i];t._cacheIndex=i,e[i]=t,r._cacheIndex=n,e[n]=r}_takeBackAction(t){let e=this._actions,n=t._cacheIndex,i=--this._nActiveActions,r=e[i];t._cacheIndex=i,e[i]=t,r._cacheIndex=n,e[n]=r}_addInactiveBinding(t,e,n){let i=this._bindingsByRootAndName,r=this._bindings,o=i[e];o===void 0&&(o={},i[e]=o),o[n]=t,t._cacheIndex=r.length,r.push(t)}_removeInactiveBinding(t){let e=this._bindings,n=t.binding,i=n.rootNode.uuid,r=n.path,o=this._bindingsByRootAndName,a=o[i],c=e[e.length-1],l=t._cacheIndex;c._cacheIndex=l,e[l]=c,e.pop(),delete a[r],Object.keys(a).length===0&&delete o[i]}_lendBinding(t){let e=this._bindings,n=t._cacheIndex,i=this._nActiveBindings++,r=e[i];t._cacheIndex=i,e[i]=t,r._cacheIndex=n,e[n]=r}_takeBackBinding(t){let e=this._bindings,n=t._cacheIndex,i=--this._nActiveBindings,r=e[i];t._cacheIndex=i,e[i]=t,r._cacheIndex=n,e[n]=r}_lendControlInterpolant(){let t=this._controlInterpolants,e=this._nActiveControlInterpolants++,n=t[e];return n===void 0&&(n=new pa(new Float32Array(2),new Float32Array(2),1,_v),n.__cacheIndex=e,t[e]=n),n}_takeBackControlInterpolant(t){let e=this._controlInterpolants,n=t.__cacheIndex,i=--this._nActiveControlInterpolants,r=e[i];t.__cacheIndex=i,e[i]=t,r.__cacheIndex=n,e[n]=r}clipAction(t,e,n){let i=e||this._root,r=i.uuid,o=typeof t=="string"?Bs.findByName(i,t):t,a=o!==null?o.uuid:t,c=this._actionsByClip[a],l=null;if(n===void 0&&(o!==null?n=o.blendMode:n=bh),c!==void 0){let u=c.actionByRoot[r];if(u!==void 0&&u.blendMode===n)return u;l=c.knownActions[0],o===null&&(o=l._clip)}if(o===null)return null;let h=new ch(this,o,e,n);return this._bindAction(h,l),this._addInactiveAction(h,a,r),h}existingAction(t,e){let n=e||this._root,i=n.uuid,r=typeof t=="string"?Bs.findByName(n,t):t,o=r?r.uuid:t,a=this._actionsByClip[o];return a!==void 0&&a.actionByRoot[i]||null}stopAllAction(){let t=this._actions,e=this._nActiveActions;for(let n=e-1;n>=0;--n)t[n].stop();return this}update(t){t*=this.timeScale;let e=this._actions,n=this._nActiveActions,i=this.time+=t,r=Math.sign(t),o=this._accuIndex^=1;for(let l=0;l!==n;++l)e[l]._update(i,t,r,o);let a=this._bindings,c=this._nActiveBindings;for(let l=0;l!==c;++l)a[l].apply(o);return this}setTime(t){this.time=0;for(let e=0;e<this._actions.length;e++)this._actions[e].time=0;return this.update(t)}getRoot(){return this._root}uncacheClip(t){let e=this._actions,n=t.uuid,i=this._actionsByClip,r=i[n];if(r!==void 0){let o=r.knownActions;for(let a=0,c=o.length;a!==c;++a){let l=o[a];this._deactivateAction(l);let h=l._cacheIndex,u=e[e.length-1];l._cacheIndex=null,l._byClipCacheIndex=null,u._cacheIndex=h,e[h]=u,e.pop(),this._removeInactiveBindingsForAction(l)}delete i[n]}}uncacheRoot(t){let e=t.uuid,n=this._actionsByClip;for(let o in n){let a=n[o].actionByRoot,c=a[e];c!==void 0&&(this._deactivateAction(c),this._removeInactiveAction(c))}let i=this._bindingsByRootAndName,r=i[e];if(r!==void 0)for(let o in r){let a=r[o];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(t,e){let n=this.existingAction(t,e);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};var Qd=new Rt,Hs=class{constructor(t,e,n=0,i=1/0){this.ray=new Hi(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new Mr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Qd.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Qd),this}intersectObject(t,e=!0,n=[]){return lh(t,this,n,e),n.sort(tf),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)lh(t[i],this,n,e);return n.sort(tf),n}};function tf(s,t){return s.distance-t.distance}function lh(s,t,e,n){let i=!0;if(s.layers.test(t.layers)&&s.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){let r=s.children;for(let o=0,a=r.length;o<a;o++)lh(r[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:hh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=hh);function Ih(s,t){if(t===pf)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(t===Dr||t===ba){let e=s.getIndex();if(e===null){let o=[],a=s.getAttribute("position");if(a!==void 0){for(let c=0;c<a.count;c++)o.push(c);s.setIndex(o),e=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}let n=e.count-2,i=[];if(t===Dr)for(let o=1;o<=n;o++)i.push(e.getX(0)),i.push(e.getX(o)),i.push(e.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(i.push(e.getX(o)),i.push(e.getX(o+1)),i.push(e.getX(o+2))):(i.push(e.getX(o+2)),i.push(e.getX(o+1)),i.push(e.getX(o)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let r=s.clone();return r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",t),s}var Ea=class extends ii{constructor(t){super(t),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(e){return new Fh(e)}),this.register(function(e){return new Bh(e)}),this.register(function(e){return new Zh(e)}),this.register(function(e){return new jh(e)}),this.register(function(e){return new Jh(e)}),this.register(function(e){return new Vh(e)}),this.register(function(e){return new Gh(e)}),this.register(function(e){return new Wh(e)}),this.register(function(e){return new Xh(e)}),this.register(function(e){return new Oh(e)}),this.register(function(e){return new qh(e)}),this.register(function(e){return new Hh(e)}),this.register(function(e){return new Yh(e)}),this.register(function(e){return new Kh(e)}),this.register(function(e){return new Nh(e)}),this.register(function(e){return new $h(e)}),this.register(function(e){return new Qh(e)})}load(t,e,n,i){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let l=Si.extractUrlBase(t);o=Si.resolveURL(l,this.path)}else o=Si.extractUrlBase(t);this.manager.itemStart(t);let a=function(l){i?i(l):console.error(l),r.manager.itemError(t),r.manager.itemEnd(t)},c=new Pr(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(t,function(l){try{r.parse(l,o,function(h){e(h),r.manager.itemEnd(t)},a)}catch(h){a(h)}},n,a)}setDRACOLoader(t){return this.dracoLoader=t,this}setKTX2Loader(t){return this.ktx2Loader=t,this}setMeshoptDecoder(t){return this.meshoptDecoder=t,this}register(t){return this.pluginCallbacks.indexOf(t)===-1&&this.pluginCallbacks.push(t),this}unregister(t){return this.pluginCallbacks.indexOf(t)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(t),1),this}parse(t,e,n,i){let r,o={},a={},c=new TextDecoder;if(typeof t=="string")r=JSON.parse(t);else if(t instanceof ArrayBuffer)if(c.decode(new Uint8Array(t,0,4))===Uf){try{o[Wt.KHR_BINARY_GLTF]=new tu(t)}catch(u){i&&i(u);return}r=JSON.parse(o[Wt.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(t));else r=t;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let l=new au(r,{path:e||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let u=this.pluginCallbacks[h](l);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[u.name]=u,o[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){let u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case Wt.KHR_MATERIALS_UNLIT:o[u]=new Uh;break;case Wt.KHR_DRACO_MESH_COMPRESSION:o[u]=new eu(r,this.dracoLoader);break;case Wt.KHR_TEXTURE_TRANSFORM:o[u]=new nu;break;case Wt.KHR_MESH_QUANTIZATION:o[u]=new iu;break;default:d.indexOf(u)>=0&&a[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}l.setExtensions(o),l.setPlugins(a),l.parse(n,i)}parseAsync(t,e){let n=this;return new Promise(function(i,r){n.parse(t,e,i,r)})}};function xv(){let s={};return{get:function(t){return s[t]},add:function(t,e){s[t]=e},remove:function(t){delete s[t]},removeAll:function(){s={}}}}var Wt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Nh=class{constructor(t){this.parser=t,this.name=Wt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let t=this.parser,e=this.parser.json.nodes||[];for(let n=0,i=e.length;n<i;n++){let r=e[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&t._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(t){let e=this.parser,n="light:"+t,i=e.cache.get(n);if(i)return i;let r=e.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[t],l,h=new et(16777215);c.color!==void 0&&h.setRGB(c.color[0],c.color[1],c.color[2],Le);let u=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new Ki(h),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new un(h),l.distance=u;break;case"spot":l=new _a(h),l.distance=u,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),l.decay=2,si(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=e.createUniqueName(c.name||"light_"+t),i=Promise.resolve(l),e.cache.add(n,i),i}getDependency(t,e){if(t==="light")return this._loadLight(e)}createNodeAttachment(t){let e=this,n=this.parser,r=n.json.nodes[t],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(c){return n._getNodeRef(e.cache,a,c)})}},Uh=class{constructor(){this.name=Wt.KHR_MATERIALS_UNLIT}getMaterialType(){return re}extendParams(t,e,n){let i=[];t.color=new et(1,1,1),t.opacity=1;let r=e.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;t.color.setRGB(o[0],o[1],o[2],Le),t.opacity=o[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(t,"map",r.baseColorTexture,Yt))}return Promise.all(i)}},Oh=class{constructor(t){this.parser=t,this.name=Wt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(t,e){let i=this.parser.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name].emissiveStrength;return r!==void 0&&(e.emissiveIntensity=r),Promise.resolve()}},Fh=class{constructor(t){this.parser=t,this.name=Wt.KHR_MATERIALS_CLEARCOAT}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];if(o.clearcoatFactor!==void 0&&(e.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&r.push(n.assignTexture(e,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(e.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&r.push(n.assignTexture(e,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(r.push(n.assignTexture(e,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){let a=o.clearcoatNormalTexture.scale;e.clearcoatNormalScale=new rt(a,a)}return Promise.all(r)}},Bh=class{constructor(t){this.parser=t,this.name=Wt.KHR_MATERIALS_DISPERSION}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let i=this.parser.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name];return e.dispersion=r.dispersion!==void 0?r.dispersion:0,Promise.resolve()}},Hh=class{constructor(t){this.parser=t,this.name=Wt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.iridescenceFactor!==void 0&&(e.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&r.push(n.assignTexture(e,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(e.iridescenceIOR=o.iridescenceIor),e.iridescenceThicknessRange===void 0&&(e.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(e.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(e.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&r.push(n.assignTexture(e,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(r)}},Vh=class{constructor(t){this.parser=t,this.name=Wt.KHR_MATERIALS_SHEEN}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[];e.sheenColor=new et(0,0,0),e.sheenRoughness=0,e.sheen=1;let o=i.extensions[this.name];if(o.sheenColorFactor!==void 0){let a=o.sheenColorFactor;e.sheenColor.setRGB(a[0],a[1],a[2],Le)}return o.sheenRoughnessFactor!==void 0&&(e.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&r.push(n.assignTexture(e,"sheenColorMap",o.sheenColorTexture,Yt)),o.sheenRoughnessTexture!==void 0&&r.push(n.assignTexture(e,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(r)}},Gh=class{constructor(t){this.parser=t,this.name=Wt.KHR_MATERIALS_TRANSMISSION}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.transmissionFactor!==void 0&&(e.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&r.push(n.assignTexture(e,"transmissionMap",o.transmissionTexture)),Promise.all(r)}},Wh=class{constructor(t){this.parser=t,this.name=Wt.KHR_MATERIALS_VOLUME}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];e.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&r.push(n.assignTexture(e,"thicknessMap",o.thicknessTexture)),e.attenuationDistance=o.attenuationDistance||1/0;let a=o.attenuationColor||[1,1,1];return e.attenuationColor=new et().setRGB(a[0],a[1],a[2],Le),Promise.all(r)}},Xh=class{constructor(t){this.parser=t,this.name=Wt.KHR_MATERIALS_IOR}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let i=this.parser.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name];return e.ior=r.ior!==void 0?r.ior:1.5,Promise.resolve()}},qh=class{constructor(t){this.parser=t,this.name=Wt.KHR_MATERIALS_SPECULAR}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];e.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&r.push(n.assignTexture(e,"specularIntensityMap",o.specularTexture));let a=o.specularColorFactor||[1,1,1];return e.specularColor=new et().setRGB(a[0],a[1],a[2],Le),o.specularColorTexture!==void 0&&r.push(n.assignTexture(e,"specularColorMap",o.specularColorTexture,Yt)),Promise.all(r)}},Kh=class{constructor(t){this.parser=t,this.name=Wt.EXT_MATERIALS_BUMP}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return e.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&r.push(n.assignTexture(e,"bumpMap",o.bumpTexture)),Promise.all(r)}},Yh=class{constructor(t){this.parser=t,this.name=Wt.KHR_MATERIALS_ANISOTROPY}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.anisotropyStrength!==void 0&&(e.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(e.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&r.push(n.assignTexture(e,"anisotropyMap",o.anisotropyTexture)),Promise.all(r)}},Zh=class{constructor(t){this.parser=t,this.name=Wt.KHR_TEXTURE_BASISU}loadTexture(t){let e=this.parser,n=e.json,i=n.textures[t];if(!i.extensions||!i.extensions[this.name])return null;let r=i.extensions[this.name],o=e.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return e.loadTextureImage(t,r.source,o)}},jh=class{constructor(t){this.parser=t,this.name=Wt.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(t){let e=this.name,n=this.parser,i=n.json,r=i.textures[t];if(!r.extensions||!r.extensions[e])return null;let o=r.extensions[e],a=i.images[o.source],c=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(t,o.source,c);if(i.extensionsRequired&&i.extensionsRequired.indexOf(e)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return n.loadTexture(t)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(t){let e=new Image;e.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",e.onload=e.onerror=function(){t(e.height===1)}})),this.isSupported}},Jh=class{constructor(t){this.parser=t,this.name=Wt.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(t){let e=this.name,n=this.parser,i=n.json,r=i.textures[t];if(!r.extensions||!r.extensions[e])return null;let o=r.extensions[e],a=i.images[o.source],c=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(t,o.source,c);if(i.extensionsRequired&&i.extensionsRequired.indexOf(e)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return n.loadTexture(t)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(t){let e=new Image;e.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",e.onload=e.onerror=function(){t(e.height===1)}})),this.isSupported}},$h=class{constructor(t){this.name=Wt.EXT_MESHOPT_COMPRESSION,this.parser=t}loadBufferView(t){let e=this.parser.json,n=e.bufferViews[t];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(e.extensionsRequired&&e.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){let c=i.byteOffset||0,l=i.byteLength||0,h=i.count,u=i.byteStride,d=new Uint8Array(a,c,l);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(h,u,d,i.mode,i.filter).then(function(f){return f.buffer}):o.ready.then(function(){let f=new ArrayBuffer(h*u);return o.decodeGltfBuffer(new Uint8Array(f),h,u,d,i.mode,i.filter),f})})}else return null}},Qh=class{constructor(t){this.name=Wt.EXT_MESH_GPU_INSTANCING,this.parser=t}createNodeMesh(t){let e=this.parser.json,n=e.nodes[t];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=e.meshes[n.mesh];for(let l of i.primitives)if(l.mode!==wn.TRIANGLES&&l.mode!==wn.TRIANGLE_STRIP&&l.mode!==wn.TRIANGLE_FAN&&l.mode!==void 0)return null;let o=n.extensions[this.name].attributes,a=[],c={};for(let l in o)a.push(this.parser.getDependency("accessor",o[l]).then(h=>(c[l]=h,c[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(t)),Promise.all(a).then(l=>{let h=l.pop(),u=h.isGroup?h.children:[h],d=l[0].count,f=[];for(let p of u){let y=new Rt,m=new M,g=new Ft,v=new M(1,1,1),_=new Ue(p.geometry,p.material,d);for(let w=0;w<d;w++)c.TRANSLATION&&m.fromBufferAttribute(c.TRANSLATION,w),c.ROTATION&&g.fromBufferAttribute(c.ROTATION,w),c.SCALE&&v.fromBufferAttribute(c.SCALE,w),_.setMatrixAt(w,y.compose(m,g,v));for(let w in c)if(w==="_COLOR_0"){let C=c[w];_.instanceColor=new Gi(C.array,C.itemSize,C.normalized)}else w!=="TRANSLATION"&&w!=="ROTATION"&&w!=="SCALE"&&p.geometry.setAttribute(w,c[w]);pe.prototype.copy.call(_,p),this.parser.assignFinalMaterial(_),f.push(_)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}},Uf="glTF",Nr=12,kf={JSON:1313821514,BIN:5130562},tu=class{constructor(t){this.name=Wt.KHR_BINARY_GLTF,this.content=null,this.body=null;let e=new DataView(t,0,Nr),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(t.slice(0,4))),version:e.getUint32(4,!0),length:e.getUint32(8,!0)},this.header.magic!==Uf)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-Nr,r=new DataView(t,Nr),o=0;for(;o<i;){let a=r.getUint32(o,!0);o+=4;let c=r.getUint32(o,!0);if(o+=4,c===kf.JSON){let l=new Uint8Array(t,Nr+o,a);this.content=n.decode(l)}else if(c===kf.BIN){let l=Nr+o;this.body=t.slice(l,l+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},eu=class{constructor(t,e){if(!e)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Wt.KHR_DRACO_MESH_COMPRESSION,this.json=t,this.dracoLoader=e,this.dracoLoader.preload()}decodePrimitive(t,e){let n=this.json,i=this.dracoLoader,r=t.extensions[this.name].bufferView,o=t.extensions[this.name].attributes,a={},c={},l={};for(let h in o){let u=ru[h]||h.toLowerCase();a[u]=o[h]}for(let h in t.attributes){let u=ru[h]||h.toLowerCase();if(o[h]!==void 0){let d=n.accessors[t.attributes[h]],f=Gs[d.componentType];l[u]=f.name,c[u]=d.normalized===!0}}return e.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){i.decodeDracoFile(h,function(f){for(let p in f.attributes){let y=f.attributes[p],m=c[p];m!==void 0&&(y.normalized=m)}u(f)},a,l,Le,d)})})}},nu=class{constructor(){this.name=Wt.KHR_TEXTURE_TRANSFORM}extendTexture(t,e){return(e.texCoord===void 0||e.texCoord===t.channel)&&e.offset===void 0&&e.rotation===void 0&&e.scale===void 0||(t=t.clone(),e.texCoord!==void 0&&(t.channel=e.texCoord),e.offset!==void 0&&t.offset.fromArray(e.offset),e.rotation!==void 0&&(t.rotation=e.rotation),e.scale!==void 0&&t.repeat.fromArray(e.scale),t.needsUpdate=!0),t}},iu=class{constructor(){this.name=Wt.KHR_MESH_QUANTIZATION}},Ra=class extends wi{constructor(t,e,n,i){super(t,e,n,i)}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i*3+i;for(let o=0;o!==i;o++)e[o]=n[r+o];return e}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=a*2,l=a*3,h=i-e,u=(n-e)/h,d=u*u,f=d*u,p=t*l,y=p-l,m=-2*f+3*d,g=f-d,v=1-m,_=g-d+u;for(let w=0;w!==a;w++){let C=o[y+w+a],A=o[y+w+c]*h,E=o[p+w+a],z=o[p+w]*h;r[w]=v*C+_*A+m*E+g*z}return r}},vv=new Ft,su=class extends Ra{interpolate_(t,e,n,i){let r=super.interpolate_(t,e,n,i);return vv.fromArray(r).normalize().toArray(r),r}},wn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Gs={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Lf={9728:Be,9729:en,9984:ph,9985:ur,9986:ys,9987:In},Df={33071:Yn,33648:xr,10497:Ln},kh={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},ru={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ai={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},wv={CUBICSPLINE:void 0,LINEAR:Is,STEP:Ps},Lh={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Mv(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new Fs({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:kn})),s.DefaultMaterial}function Yi(s,t,e){for(let n in e.extensions)s[n]===void 0&&(t.userData.gltfExtensions=t.userData.gltfExtensions||{},t.userData.gltfExtensions[n]=e.extensions[n])}function si(s,t){t.extras!==void 0&&(typeof t.extras=="object"?Object.assign(s.userData,t.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+t.extras))}function bv(s,t,e){let n=!1,i=!1,r=!1;for(let l=0,h=t.length;l<h;l++){let u=t[l];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);let o=[],a=[],c=[];for(let l=0,h=t.length;l<h;l++){let u=t[l];if(n){let d=u.POSITION!==void 0?e.getDependency("accessor",u.POSITION):s.attributes.position;o.push(d)}if(i){let d=u.NORMAL!==void 0?e.getDependency("accessor",u.NORMAL):s.attributes.normal;a.push(d)}if(r){let d=u.COLOR_0!==void 0?e.getDependency("accessor",u.COLOR_0):s.attributes.color;c.push(d)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c)]).then(function(l){let h=l[0],u=l[1],d=l[2];return n&&(s.morphAttributes.position=h),i&&(s.morphAttributes.normal=u),r&&(s.morphAttributes.color=d),s.morphTargetsRelative=!0,s})}function Sv(s,t){if(s.updateMorphTargets(),t.weights!==void 0)for(let e=0,n=t.weights.length;e<n;e++)s.morphTargetInfluences[e]=t.weights[e];if(t.extras&&Array.isArray(t.extras.targetNames)){let e=t.extras.targetNames;if(s.morphTargetInfluences.length===e.length){s.morphTargetDictionary={};for(let n=0,i=e.length;n<i;n++)s.morphTargetDictionary[e[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Av(s){let t,e=s.extensions&&s.extensions[Wt.KHR_DRACO_MESH_COMPRESSION];if(e?t="draco:"+e.bufferView+":"+e.indices+":"+Dh(e.attributes):t=s.indices+":"+Dh(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)t+=":"+Dh(s.targets[n]);return t}function Dh(s){let t="",e=Object.keys(s).sort();for(let n=0,i=e.length;n<i;n++)t+=e[n]+":"+s[e[n]]+";";return t}function ou(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Tv(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":"image/png"}var Ev=new Rt,au=class{constructor(t={},e={}){this.json=t,this.extensions={},this.plugins={},this.options=e,this.cache=new xv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,o=-1;if(typeof navigator<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let c=a.match(/Version\/(\d+)/);i=n&&c?parseInt(c[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||r&&o<98?this.textureLoader=new ga(this.options.manager):this.textureLoader=new va(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Pr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(t){this.extensions=t}setPlugins(t){this.plugins=t}parse(t,e){let n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let a={scene:o[0][i.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:i.asset,parser:n,userData:{}};return Yi(r,a,i),si(a,i),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(a)})).then(function(){for(let c of a.scenes)c.updateMatrixWorld();t(a)})}).catch(e)}_markDefs(){let t=this.json.nodes||[],e=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=e.length;i<r;i++){let o=e[i].joints;for(let a=0,c=o.length;a<c;a++)t[o[a]].isBone=!0}for(let i=0,r=t.length;i<r;i++){let o=t[i];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(t,e){e!==void 0&&(t.refs[e]===void 0&&(t.refs[e]=t.uses[e]=0),t.refs[e]++)}_getNodeRef(t,e,n){if(t.refs[e]<=1)return n;let i=n.clone(),r=(o,a)=>{let c=this.associations.get(o);c!=null&&this.associations.set(a,c);for(let[l,h]of o.children.entries())r(h,a.children[l])};return r(n,i),i.name+="_instance_"+t.uses[e]++,i}_invokeOne(t){let e=Object.values(this.plugins);e.push(this);for(let n=0;n<e.length;n++){let i=t(e[n]);if(i)return i}return null}_invokeAll(t){let e=Object.values(this.plugins);e.unshift(this);let n=[];for(let i=0;i<e.length;i++){let r=t(e[i]);r&&n.push(r)}return n}getDependency(t,e){let n=t+":"+e,i=this.cache.get(n);if(!i){switch(t){case"scene":i=this.loadScene(e);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(e)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(e)});break;case"accessor":i=this.loadAccessor(e);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(e)});break;case"buffer":i=this.loadBuffer(e);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(e)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(e)});break;case"skin":i=this.loadSkin(e);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(e)});break;case"camera":i=this.loadCamera(e);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(t,e)}),!i)throw new Error("Unknown type: "+t);break}this.cache.add(n,i)}return i}getDependencies(t){let e=this.cache.get(t);if(!e){let n=this,i=this.json[t+(t==="mesh"?"es":"s")]||[];e=Promise.all(i.map(function(r,o){return n.getDependency(t,o)})),this.cache.add(t,e)}return e}loadBuffer(t){let e=this.json.buffers[t],n=this.fileLoader;if(e.type&&e.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+e.type+" buffer type is not supported.");if(e.uri===void 0&&t===0)return Promise.resolve(this.extensions[Wt.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(r,o){n.load(Si.resolveURL(e.uri,i.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+e.uri+'".'))})})}loadBufferView(t){let e=this.json.bufferViews[t];return this.getDependency("buffer",e.buffer).then(function(n){let i=e.byteLength||0,r=e.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(t){let e=this,n=this.json,i=this.json.accessors[t];if(i.bufferView===void 0&&i.sparse===void 0){let o=kh[i.type],a=Gs[i.componentType],c=i.normalized===!0,l=new a(i.count*o);return Promise.resolve(new Te(l,o,c))}let r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(o){let a=o[0],c=kh[i.type],l=Gs[i.componentType],h=l.BYTES_PER_ELEMENT,u=h*c,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,p=i.normalized===!0,y,m;if(f&&f!==u){let g=Math.floor(d/f),v="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+g+":"+i.count,_=e.cache.get(v);_||(y=new l(a,g*f,i.count*f/h),_=new Ns(y,f/h),e.cache.add(v,_)),m=new Vi(_,c,d%f/h,p)}else a===null?y=new l(i.count*c):y=new l(a,d,i.count*c),m=new Te(y,c,p);if(i.sparse!==void 0){let g=kh.SCALAR,v=Gs[i.sparse.indices.componentType],_=i.sparse.indices.byteOffset||0,w=i.sparse.values.byteOffset||0,C=new v(o[1],_,i.sparse.count*g),A=new l(o[2],w,i.sparse.count*c);a!==null&&(m=new Te(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let E=0,z=C.length;E<z;E++){let N=C[E];if(m.setX(N,A[E*c]),c>=2&&m.setY(N,A[E*c+1]),c>=3&&m.setZ(N,A[E*c+2]),c>=4&&m.setW(N,A[E*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=p}return m})}loadTexture(t){let e=this.json,n=this.options,r=e.textures[t].source,o=e.images[r],a=this.textureLoader;if(o.uri){let c=n.manager.getHandler(o.uri);c!==null&&(a=c)}return this.loadTextureImage(t,r,a)}loadTextureImage(t,e,n){let i=this,r=this.json,o=r.textures[t],a=r.images[e],c=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[c])return this.textureCache[c];let l=this.loadImageSource(e,n).then(function(h){h.flipY=!1,h.name=o.name||a.name||"",h.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(h.name=a.uri);let d=(r.samplers||{})[o.sampler]||{};return h.magFilter=Lf[d.magFilter]||en,h.minFilter=Lf[d.minFilter]||In,h.wrapS=Df[d.wrapS]||Ln,h.wrapT=Df[d.wrapT]||Ln,i.associations.set(h,{textures:t}),h}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(t,e){let n=this,i=this.json,r=this.options;if(this.sourceCache[t]!==void 0)return this.sourceCache[t].then(u=>u.clone());let o=i.images[t],a=self.URL||self.webkitURL,c=o.uri||"",l=!1;if(o.bufferView!==void 0)c=n.getDependency("bufferView",o.bufferView).then(function(u){l=!0;let d=new Blob([u],{type:o.mimeType});return c=a.createObjectURL(d),c});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+t+" is missing URI and bufferView");let h=Promise.resolve(c).then(function(u){return new Promise(function(d,f){let p=d;e.isImageBitmapLoader===!0&&(p=function(y){let m=new ke(y);m.needsUpdate=!0,d(m)}),e.load(Si.resolveURL(u,r.path),p,void 0,f)})}).then(function(u){return l===!0&&a.revokeObjectURL(c),si(u,o),u.userData.mimeType=o.mimeType||Tv(o.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),u});return this.sourceCache[t]=h,h}assignTexture(t,e,n,i){let r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[Wt.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[Wt.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let c=r.associations.get(o);o=r.extensions[Wt.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,c)}}return i!==void 0&&(o.colorSpace=i),t[e]=o,o})}assignFinalMaterial(t){let e=t.geometry,n=t.material,i=e.attributes.tangent===void 0,r=e.attributes.color!==void 0,o=e.attributes.normal===void 0;if(t.isPoints){let a="PointsMaterial:"+n.uuid,c=this.cache.get(a);c||(c=new Wi,Ze.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(a,c)),n=c}else if(t.isLine){let a="LineBasicMaterial:"+n.uuid,c=this.cache.get(a);c||(c=new Ar,Ze.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(a,c)),n=c}if(i||r||o){let a="ClonedMaterial:"+n.uuid+":";i&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let c=this.cache.get(a);c||(c=n.clone(),r&&(c.vertexColors=!0),o&&(c.flatShading=!0),i&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(a,c),this.associations.set(c,this.associations.get(n))),n=c}t.material=n}getMaterialType(){return Fs}loadMaterial(t){let e=this,n=this.json,i=this.extensions,r=n.materials[t],o,a={},c=r.extensions||{},l=[];if(c[Wt.KHR_MATERIALS_UNLIT]){let u=i[Wt.KHR_MATERIALS_UNLIT];o=u.getMaterialType(),l.push(u.extendParams(a,r,e))}else{let u=r.pbrMetallicRoughness||{};if(a.color=new et(1,1,1),a.opacity=1,Array.isArray(u.baseColorFactor)){let d=u.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],Le),a.opacity=d[3]}u.baseColorTexture!==void 0&&l.push(e.assignTexture(a,"map",u.baseColorTexture,Yt)),a.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,a.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(l.push(e.assignTexture(a,"metalnessMap",u.metallicRoughnessTexture)),l.push(e.assignTexture(a,"roughnessMap",u.metallicRoughnessTexture))),o=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(t)}),l.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(t,a)})))}r.doubleSided===!0&&(a.side=ue);let h=r.alphaMode||Lh.OPAQUE;if(h===Lh.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,h===Lh.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==re&&(l.push(e.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new rt(1,1),r.normalTexture.scale!==void 0)){let u=r.normalTexture.scale;a.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&o!==re&&(l.push(e.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==re){let u=r.emissiveFactor;a.emissive=new et().setRGB(u[0],u[1],u[2],Le)}return r.emissiveTexture!==void 0&&o!==re&&l.push(e.assignTexture(a,"emissiveMap",r.emissiveTexture,Yt)),Promise.all(l).then(function(){let u=new o(a);return r.name&&(u.name=r.name),si(u,r),e.associations.set(u,{materials:t}),r.extensions&&Yi(i,u,r),u})}createUniqueName(t){let e=oe.sanitizeNodeName(t||"");return e in this.nodeNamesUsed?e+"_"+ ++this.nodeNamesUsed[e]:(this.nodeNamesUsed[e]=0,e)}loadGeometries(t){let e=this,n=this.extensions,i=this.primitiveCache;function r(a){return n[Wt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,e).then(function(c){return Nf(c,a,e)})}let o=[];for(let a=0,c=t.length;a<c;a++){let l=t[a],h=Av(l),u=i[h];if(u)o.push(u.promise);else{let d;l.extensions&&l.extensions[Wt.KHR_DRACO_MESH_COMPRESSION]?d=r(l):d=Nf(new Jt,l,e),i[h]={primitive:l,promise:d},o.push(d)}}return Promise.all(o)}loadMesh(t){let e=this,n=this.json,i=this.extensions,r=n.meshes[t],o=r.primitives,a=[];for(let c=0,l=o.length;c<l;c++){let h=o[c].material===void 0?Mv(this.cache):this.getDependency("material",o[c].material);a.push(h)}return a.push(e.loadGeometries(o)),Promise.all(a).then(function(c){let l=c.slice(0,c.length-1),h=c[c.length-1],u=[];for(let f=0,p=h.length;f<p;f++){let y=h[f],m=o[f],g,v=l[f];if(m.mode===wn.TRIANGLES||m.mode===wn.TRIANGLE_STRIP||m.mode===wn.TRIANGLE_FAN||m.mode===void 0)g=r.isSkinnedMesh===!0?new $o(y,v):new Lt(y,v),g.isSkinnedMesh===!0&&g.normalizeSkinWeights(),m.mode===wn.TRIANGLE_STRIP?g.geometry=Ih(g.geometry,ba):m.mode===wn.TRIANGLE_FAN&&(g.geometry=Ih(g.geometry,Dr));else if(m.mode===wn.LINES)g=new ia(y,v);else if(m.mode===wn.LINE_STRIP)g=new Us(y,v);else if(m.mode===wn.LINE_LOOP)g=new sa(y,v);else if(m.mode===wn.POINTS)g=new Os(y,v);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(g.geometry.morphAttributes).length>0&&Sv(g,r),g.name=e.createUniqueName(r.name||"mesh_"+t),si(g,r),m.extensions&&Yi(i,g,m),e.assignFinalMaterial(g),u.push(g)}for(let f=0,p=u.length;f<p;f++)e.associations.set(u[f],{meshes:t,primitives:f});if(u.length===1)return r.extensions&&Yi(i,u[0],r),u[0];let d=new xt;r.extensions&&Yi(i,d,r),e.associations.set(d,{meshes:t});for(let f=0,p=u.length;f<p;f++)d.add(u[f]);return d})}loadCamera(t){let e,n=this.json.cameras[t],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?e=new Ne(yf.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(e=new xi(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(e.name=this.createUniqueName(n.name)),si(e,n),Promise.resolve(e)}loadSkin(t){let e=this.json.skins[t],n=[];for(let i=0,r=e.joints.length;i<r;i++)n.push(this._loadNodeShallow(e.joints[i]));return e.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",e.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let r=i.pop(),o=i,a=[],c=[];for(let l=0,h=o.length;l<h;l++){let u=o[l];if(u){a.push(u);let d=new Rt;r!==null&&d.fromArray(r.array,l*16),c.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',e.joints[l])}return new ta(a,c)})}loadAnimation(t){let e=this.json,n=this,i=e.animations[t],r=i.name?i.name:"animation_"+t,o=[],a=[],c=[],l=[],h=[];for(let u=0,d=i.channels.length;u<d;u++){let f=i.channels[u],p=i.samplers[f.sampler],y=f.target,m=y.node,g=i.parameters!==void 0?i.parameters[p.input]:p.input,v=i.parameters!==void 0?i.parameters[p.output]:p.output;y.node!==void 0&&(o.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",g)),c.push(this.getDependency("accessor",v)),l.push(p),h.push(y))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(l),Promise.all(h)]).then(function(u){let d=u[0],f=u[1],p=u[2],y=u[3],m=u[4],g=[];for(let v=0,_=d.length;v<_;v++){let w=d[v],C=f[v],A=p[v],E=y[v],z=m[v];if(w===void 0)continue;w.updateMatrix&&w.updateMatrix();let N=n._createAnimationTracks(w,C,A,E,z);if(N)for(let x=0;x<N.length;x++)g.push(N[x])}return new Bs(r,void 0,g)})}createNodeMesh(t){let e=this.json,n=this,i=e.nodes[t];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){let o=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let c=0,l=i.weights.length;c<l;c++)a.morphTargetInfluences[c]=i.weights[c]}),o})}loadNode(t){let e=this.json,n=this,i=e.nodes[t],r=n._loadNodeShallow(t),o=[],a=i.children||[];for(let l=0,h=a.length;l<h;l++)o.push(n.getDependency("node",a[l]));let c=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(o),c]).then(function(l){let h=l[0],u=l[1],d=l[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,Ev)});for(let f=0,p=u.length;f<p;f++)h.add(u[f]);return h})}_loadNodeShallow(t){let e=this.json,n=this.extensions,i=this;if(this.nodeCache[t]!==void 0)return this.nodeCache[t];let r=e.nodes[t],o=r.name?i.createUniqueName(r.name):"",a=[],c=i._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(t)});return c&&a.push(c),r.camera!==void 0&&a.push(i.getDependency("camera",r.camera).then(function(l){return i._getNodeRef(i.cameraCache,r.camera,l)})),i._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(t)}).forEach(function(l){a.push(l)}),this.nodeCache[t]=Promise.all(a).then(function(l){let h;if(r.isBone===!0?h=new Sr:l.length>1?h=new xt:l.length===1?h=l[0]:h=new pe,h!==l[0])for(let u=0,d=l.length;u<d;u++)h.add(l[u]);if(r.name&&(h.userData.name=r.name,h.name=o),si(h,r),r.extensions&&Yi(n,h,r),r.matrix!==void 0){let u=new Rt;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);return i.associations.has(h)||i.associations.set(h,{}),i.associations.get(h).nodes=t,h}),this.nodeCache[t]}loadScene(t){let e=this.extensions,n=this.json.scenes[t],i=this,r=new xt;n.name&&(r.name=i.createUniqueName(n.name)),si(r,n),n.extensions&&Yi(e,r,n);let o=n.nodes||[],a=[];for(let c=0,l=o.length;c<l;c++)a.push(i.getDependency("node",o[c]));return Promise.all(a).then(function(c){for(let h=0,u=c.length;h<u;h++)r.add(c[h]);let l=h=>{let u=new Map;for(let[d,f]of i.associations)(d instanceof Ze||d instanceof ke)&&u.set(d,f);return h.traverse(d=>{let f=i.associations.get(d);f!=null&&u.set(d,f)}),u};return i.associations=l(r),r})}_createAnimationTracks(t,e,n,i,r){let o=[],a=t.name?t.name:t.uuid,c=[];Ai[r.path]===Ai.weights?t.traverse(function(d){d.morphTargetInfluences&&c.push(d.name?d.name:d.uuid)}):c.push(a);let l;switch(Ai[r.path]){case Ai.weights:l=ti;break;case Ai.rotation:l=ei;break;case Ai.position:case Ai.scale:l=ni;break;default:switch(n.itemSize){case 1:l=ti;break;case 2:case 3:default:l=ni;break}break}let h=i.interpolation!==void 0?wv[i.interpolation]:Is,u=this._getArrayFromAccessor(n);for(let d=0,f=c.length;d<f;d++){let p=new l(c[d]+"."+Ai[r.path],e.array,u,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(p),o.push(p)}return o}_getArrayFromAccessor(t){let e=t.array;if(t.normalized){let n=ou(e.constructor),i=new Float32Array(e.length);for(let r=0,o=e.length;r<o;r++)i[r]=e[r]*n;e=i}return e}_createCubicSplineTrackInterpolant(t){t.createInterpolant=function(n){let i=this instanceof ei?su:Ra;return new i(this.times,this.values,this.getValueSize()/3,n)},t.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function Rv(s,t,e){let n=t.attributes,i=new Ee;if(n.POSITION!==void 0){let a=e.json.accessors[n.POSITION],c=a.min,l=a.max;if(c!==void 0&&l!==void 0){if(i.set(new M(c[0],c[1],c[2]),new M(l[0],l[1],l[2])),a.normalized){let h=ou(Gs[a.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=t.targets;if(r!==void 0){let a=new M,c=new M;for(let l=0,h=r.length;l<h;l++){let u=r[l];if(u.POSITION!==void 0){let d=e.json.accessors[u.POSITION],f=d.min,p=d.max;if(f!==void 0&&p!==void 0){if(c.setX(Math.max(Math.abs(f[0]),Math.abs(p[0]))),c.setY(Math.max(Math.abs(f[1]),Math.abs(p[1]))),c.setZ(Math.max(Math.abs(f[2]),Math.abs(p[2]))),d.normalized){let y=ou(Gs[d.componentType]);c.multiplyScalar(y)}a.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(a)}s.boundingBox=i;let o=new cn;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=o}function Nf(s,t,e){let n=t.attributes,i=[];function r(o,a){return e.getDependency("accessor",o).then(function(c){s.setAttribute(a,c)})}for(let o in n){let a=ru[o]||o.toLowerCase();a in s.attributes||i.push(r(n[o],a))}if(t.indices!==void 0&&!s.index){let o=e.getDependency("accessor",t.indices).then(function(a){s.setIndex(a)});i.push(o)}return Qt.workingColorSpace!==Le&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Qt.workingColorSpace}" not supported.`),si(s,t),Rv(s,t,e),Promise.all(i).then(function(){return t.targets!==void 0?bv(s,t.targets,e):s})}var Ca=new Rt,Of=new M,Ff=new M,Bf=new M,Ti=class{constructor(t=9){this.R=t}naKule(t,e,n=0,i=new M){let r=Math.hypot(t,e),o=this.R;if(r<1e-9)return i.set(0,o+n,0);let a=r/o,c=t/r,l=e/r,h=Math.sin(a),u=Math.cos(a);return i.set(h*c,u,h*l).multiplyScalar(o+n)}normalna(t,e,n=new M){return this.naKule(t,e,0,n).normalize()}ramka(t,e,n=new Ft){let i=Math.hypot(t,e);if(i<1e-9)return n.identity();let r=i/this.R,o=t/i,a=e/i,c=Math.sin(r),l=Math.cos(r),h=l*o,u=-c,d=l*a,f=-a,p=o;return Of.set(o*h-a*f,o*u,o*d-a*p),Bf.set(a*h+o*f,a*u,a*d+o*p),Ff.set(c*o,l,c*a),Ca.makeBasis(Of,Ff,Bf),n.setFromRotationMatrix(Ca)}zKuli(t,e={x:0,z:0,h:0}){let n=t.length();if(n<1e-9)return e.x=0,e.z=0,e.h=-this.R,e;let i=Math.max(-1,Math.min(1,t.y/n)),r=Math.acos(i),o=Math.atan2(t.z,t.x),a=r*this.R;return e.x=a*Math.cos(o),e.z=a*Math.sin(o),e.h=n-this.R,e}ustaw(t,e,n,i=0,r=0){return this.naKule(e,n,i,t.position),this.ramka(e,n,t.quaternion),r&&t.quaternion.multiply(Ws.setFromAxisAngle(Cv,r)),t}obrotPodPunkt(t,e,n=new Ft){return this.ramka(t,e,n).invert()}},Ws=new Ft,Cv=new M(0,1,0),za=new M,cu=new M;function nn(s,t,e,n=new M){n.copy(t).addScaledVector(s,-t.dot(s));let i=n.length();return i>1e-6?n.divideScalar(i):n.copy(e)}function Xe(s,t){s.addScaledVector(t,-s.dot(t));let e=s.length();return e>1e-6?s.divideScalar(e):s.set(1,0,0).addScaledVector(t,-t.x).normalize(),s}function Hf(s,t,e){return Ws.setFromAxisAngle(t,e),s.applyQuaternion(Ws)}function lu(s,t,e){return za.crossVectors(s,t),Math.atan2(za.dot(e),s.dot(t))}function zv(s,t,e=new Ft){return cu.crossVectors(s,t),Ca.makeBasis(cu,s,t),e.setFromRotationMatrix(Ca)}Ti.prototype.przesunPoKuli=function(s,t,e){Math.abs(e)<1e-9||(za.crossVectors(s,t).normalize(),Ws.setFromAxisAngle(za,e/this.R),s.applyQuaternion(Ws).normalize(),t.applyQuaternion(Ws),Xe(t,s))};Ti.prototype.punktObok=function(s,t,e,n=new M){n.copy(s);let i=cu.copy(t);return this.przesunPoKuli(n,i,e),n};Ti.prototype.odleglosc=function(s,t){return this.R*Math.acos(Math.max(-1,Math.min(1,s.dot(t))))};Ti.prototype.ustawN=function(s,t,e,n=0){return s.position.copy(t).multiplyScalar(this.R+n),zv(t,e,s.quaternion),s};function Vf(s=14){return s/(100*Math.PI/180)}function Xs(s,t,e=n=>[n.x,n.y]){let n=[],i=[];for(let r of s){let[o,a]=e(r);Math.hypot(o,a)<=t?i.push(r):i.length&&(i.length>=2&&n.push(i),i=[])}return i.length>=2&&n.push(i),n}var Pv=[{od:[-12,3.5],kontrola:[-6,5.2],do:[-3.2,8.6],kroki:12},{od:[-3.2,8.6],kontrola:[-2.2,10.6],do:[-4.5,15.5],kroki:8}],Iv=[[-6.2,8.6],[-4.7,6.9],[-3.2,5.2],[-1.4,4.1],[-.1,2.6],[.9,.6],[1.1,-1.4],[.5,-3.4],[0,-5.6]],kv=[{file:"hut2",pos:[-10.6,-4.4],wysokosc:5.2,obrot:.55,promien:2.6,jasnosc:1.45}],ri=(s,t)=>({id:s,file:"gwiazda",label:"Z\u0142ota gwiazdka",toast:"Z\u0142ota gwiazdka \u2014 z\u0142apana!",scale:.78,height:.95,glow:16765514,barwa:16763215,jasnosc:1.32,metalness:.3,roughness:.7,haloOpacity:.1,haloScale:.9,ringOpacity:0,lightBase:0,absorb:!0,absorbLift:1.5,respawn:12,iskry:26,iskrySila:1.6,pos:t}),Lv=[{id:"czarodziej",file:"wizard",label:"Czarodziej",toast:"Czarodziej pojawi\u0142 si\u0119 w lesie",pos:[-3,4],pozycje:[[-3,4],[-7,-8],[4,3.5],[4,-8],[.5,9]],scale:3.7,height:1.3,absorbLift:2.8,animuj:!0,bezObrotu:!0,obrotY:.484,absorb:!1,raz:!0,zasieg:1.9,zbrojenie:3.4,margines:1.8,cykl:35,respawn:60,respawnPierwszy:12,glow:12093672,ringColor:14268159,jasnosc:1.6,metalness:0,roughness:.85,haloOpacity:.2,haloScale:1.7,ringOpacity:.3,lightBase:0,iskry:38,iskrySila:1.9},{id:"karty",file:"karta",label:"Pami\u0119\u0107 M\u0119drca",toast:"Karty M\u0119drca \u2014 dobierz pary",pos:[3,2.6],scale:1.3,height:1.15,glow:8015298,ringColor:13148400,haloOpacity:.2,haloScale:1.2,ringOpacity:.22,lightBase:0,metalness:0,roughness:.85,jasnosc:1.7,absorb:!0,absorbLift:1.7,respawn:3.2},{id:"leaf",file:"lisc",label:"Sekret pod puchem",toast:"Pi\xF3rko \u2014 sekret pod puchem",pos:[-1.3,3.1],scale:1.6,height:1.55,glow:10481874,ringColor:12451048,haloOpacity:.13,ringOpacity:0,lightBase:0,haloScale:1.15,metalness:0,roughness:.9,absorb:!0,absorbLift:1.7,respawn:3.2},ri("gwiazda-1",[-.4,4.6]),ri("gwiazda-2",[2.4,5.2]),ri("gwiazda-3",[-4.6,1.2]),ri("gwiazda-4",[.8,-2.4]),ri("gwiazda-5",[-3.2,-3.4]),ri("gwiazda-6",[4.8,.6]),ri("gwiazda-7",[-6.1,-1.6]),ri("gwiazda-8",[1.6,7]),ri("gwiazda-9",[5.4,-3.8])];function Dv(s){let t=(n,i,r,o)=>new rt((1-o)*(1-o)*n[0]+2*(1-o)*o*i[0]+o*o*r[0],(1-o)*(1-o)*n[1]+2*(1-o)*o*i[1]+o*o*r[1]),e=[];return s.forEach((n,i)=>{let r=n.kroki||12;for(let o=i?1:0;o<=r;o++)e.push(t(n.od,n.kontrola,n.do,o/r))}),e}function Gf(){let s=globalThis.__SCENA3D_MAPA||{},t=s.swiat?.promien??12.5,e=s.swiat?.teren??36,n=Number(globalThis.SCENA3D_PROMIEN_KULI)||s.swiat?.promienKuli||Vf(t),i=(s.sciezka||Iv).map(a=>new M(a[0],0,a[1])),r=s.rzeka?.krzywe||Pv,o=s.swiat?.promienTresci??.72*Math.PI*n;return{surowa:s,promienMapy:t,teren:e,promienKuli:n,promienTresci:o,start:s.start||null,sciezka:i,latarnia:{pos:new M(s.latarnia?.pos?.[0]??2.5,0,s.latarnia?.pos?.[1]??-1.2),punktSciezki:s.latarnia?.punktSciezki??6,ukryta:!!s.latarnia?.ukryta},most:{pos:[s.most?.pos?.[0]??-4.7,s.most?.pos?.[1]??6.9],ukryty:!!s.most?.ukryty},brama:{pos:[s.brama?.pos?.[0]??0,s.brama?.pos?.[1]??-7.2],ukryta:!!s.brama?.ukryta},rzeka:{szerokosc:s.rzeka?.szerokosc??1.5,krzywe:r,punkty:Dv(r)},cienie:!!s.swiat?.cienie,terenKanciasty:s.swiat?.terenKanciasty??!1,terenWyboje:s.swiat?.terenWyboje,terenNieregularnosc:s.swiat?.terenNieregularnosc,terenFasety:!!s.swiat?.terenFasety,terenShader:s.swiat?.terenShader||null,chmury:s.swiat?.chmury??0,zoom:s.swiat?.zoom,dolnyDok:s.swiat?.dolnyDok!==!1,ekspozycja:Number.isFinite(s.swiat?.ekspozycja)?s.swiat.ekspozycja:1.25,kameraPodniesienie:Number.isFinite(s.swiat?.kameraPodniesienie)?s.swiat.kameraPodniesienie:null,zasiew:!!s.swiat?.zasiew,fasola:s.fasola||null,oczko:s.oczko||null,formyTerenu:s.formyTerenu||[],terenBarwy:s.swiat?.terenBarwy||null,doba:{wlaczona:!!s.swiat?.cyklDnia,nad:[s.swiat?.slonceNad?.[0]??0,s.swiat?.slonceNad?.[1]??0],strojenie:s.swiat?.doba||null},galezie:Array.isArray(s.galezie)?s.galezie:[],drzewa:s.drzewa||null,glazy:s.glazy||null,kwiaty:s.kwiaty||[],budynki:s.budynki??kv,znaki:s.znaki??Lv}}function Ur(s=1){let t=i=>Math.sin(s*12.9898*i+78.233)*43758.5453,e=[2,3,5].map(i=>t(i)%1*Math.PI*2),n=[.16,.1,.045];return i=>1+n[0]*Math.sin(2*i+e[0])+n[1]*Math.sin(3*i+e[1])+n[2]*Math.sin(5*i+e[2])}var uu=s=>s<=0?0:s>=1?1:s*s*(3-2*s);function hu(s,t,e){let n=t-s.pos[0],i=e-s.pos[1],r=Math.hypot(n,i);if(!s._mn)return r/s.promien;let o=Math.atan2(i,n);return r/(s.promien*s._mn(o))}var du={wzgorze(s,t){let e=s.plaski??0;if(t>=1)return 0;let n=e>=1?0:Math.max(0,(t-e)/(1-e));return(s.wysokosc??.5)*(1-uu(n))},wykop(s,t){return du.niecka({...s,glebokosc:s.glebokosc??.04,stok:s.stok??.7},t)},niecka(s,t){let e=s.stok??.9;if(t>=1+e)return 0;let n=Math.max(0,(t-1)/e);return-(s.glebokosc??.11)*(1-uu(n))}};function Pa(s){let t=[];for(let r of s.formyTerenu||[]){if(!r?.pos||!du[r.typ]){console.warn("[teren] nieznana forma",r);continue}t.push({...r,promien:r.promien??2,_mn:r.ziarno!=null?Ur(r.ziarno):null})}if(s.oczko?.pos){let r=s.oczko;t.push({typ:"niecka",pos:r.pos,promien:r.promien??1.4,glebokosc:r.glebokosc??.11,stok:r.stok??.9,_mn:r.ziarno!=null?Ur(r.ziarno):null,_zrodlo:"oczko"})}if(s.fasola?.pos){let r=s.fasola,o=r.grzadka||{};t.push({typ:"wykop",pos:r.pos,promien:o.promien??1.05,glebokosc:o.glebokosc??.035,stok:o.stok??.8,_mn:Ur(o.ziarno??4),_zrodlo:"fasola"})}for(let r of t)r._zasieg=r.promien*1.35*(r.typ==="niecka"||r.typ==="wykop"?1+(r.stok??.9):1);return{h:(r,o)=>{let a=0;for(let c of t)Math.abs(r-c.pos[0])>c._zasieg||Math.abs(o-c.pos[1])>c._zasieg||(a+=du[c.typ](c,hu(c,r,o)));return a},niecka:(r,o)=>{let a=null;for(let c of t){if(c.typ!=="niecka"&&c.typ!=="wykop"||Math.abs(r-c.pos[0])>c._zasieg||Math.abs(o-c.pos[1])>c._zasieg)continue;let l=hu(c,r,o),h=c.stok??.9;l<1+h&&(a===null||l<a.o)&&(a={o:l,stok:h,typ:c.typ})}return a},ziemia:(r,o)=>{let a=0;for(let c of t){if(c.typ!=="wykop"||Math.abs(r-c.pos[0])>c._zasieg||Math.abs(o-c.pos[1])>c._zasieg)continue;let l=hu(c,r,o),h=1+(c.stok??.8)*.55;a=Math.max(a,1-uu((l-.75)/(h-.75)))}return a},formy:t,pusta:t.length===0}}var Nv={baza:8037968,jasna:9682272,ciemna:6131519,szalwia:8359793,brzeg:14472860,dno:8092245,ziemia:6966067,ziemiaJasna:9071176},Uv={skala:4,ziarno:0,moc:.5,kontrast:1,szalwia:.45,piasek:.35,wzgorza:.45,glebia:.1},Ov=`
varying vec3 vKierTeren;
varying float vWysTeren;
varying float vZiemiaTeren;

uniform vec3 uBazaTeren;
uniform vec3 uJasnaTeren;
uniform vec3 uCiemnaTeren;
uniform vec3 uSzalwiaTeren;
uniform vec3 uPiasekTeren;
uniform vec3 uDnoTeren;
uniform float uSkalaTeren;
uniform float uMocTeren;
uniform float uZiarnoTeren;
uniform float uKontrastTeren;
uniform float uSilaSzalwii;
uniform float uSilaPiasku;
uniform float uWzgorzaTeren;
uniform float uGlebiaTeren;
uniform vec3 uZiemiaTeren;
uniform vec3 uZiemiaJasnaTeren;

float hashTeren(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float szumTeren(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hashTeren(i + vec3(0.0, 0.0, 0.0)), hashTeren(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hashTeren(i + vec3(0.0, 1.0, 0.0)), hashTeren(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(hashTeren(i + vec3(0.0, 0.0, 1.0)), hashTeren(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hashTeren(i + vec3(0.0, 1.0, 1.0)), hashTeren(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
    f.z);
}

/** Cztery oktawy, znormalizowane do ~0..1 (suma amplitud 0.9375). */
float fbmTeren(vec3 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    s += a * szumTeren(p);
    p = p * 2.07 + vec3(19.1, 7.3, 33.7);
    a *= 0.5;
  }
  return s / 0.9375;
}
`;function Wf(s={}){let t={...Nv,...s.barwy||{}},e={...Uv,...s.strojenie||{}},n={uBazaTeren:{value:new et(t.baza)},uJasnaTeren:{value:new et(t.jasna)},uCiemnaTeren:{value:new et(t.ciemna)},uSzalwiaTeren:{value:new et(t.szalwia)},uPiasekTeren:{value:new et(t.brzeg)},uDnoTeren:{value:new et(t.dno)},uZiemiaTeren:{value:new et(t.ziemia)},uZiemiaJasnaTeren:{value:new et(t.ziemiaJasna)},uSkalaTeren:{value:e.skala},uMocTeren:{value:e.moc},uZiarnoTeren:{value:e.ziarno},uKontrastTeren:{value:e.kontrast},uSilaSzalwii:{value:e.szalwia},uSilaPiasku:{value:e.piasek},uWzgorzaTeren:{value:e.wzgorza},uGlebiaTeren:{value:Math.max(1e-4,e.glebia)}},i=new ge({color:16777215,flatShading:!!s.fasety});return i.onBeforeCompile=r=>{Object.assign(r.uniforms,n),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
        attribute float wysForma;
        attribute float ziemiaForma;
        varying vec3 vKierTeren;
        varying float vWysTeren;
        varying float vZiemiaTeren;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        vKierTeren = normalize(position);
        vWysTeren = wysForma;
        vZiemiaTeren = ziemiaForma;`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
${Ov}`).replace("#include <color_fragment>",`#include <color_fragment>
      {
        vec3 k = vKierTeren * uSkalaTeren + uZiarnoTeren;
        float duze = fbmTeren(k);
        float srednie = fbmTeren(k * 2.6 + 5.7);
        float drobne = fbmTeren(k * 7.3 + 13.3);

        // PROGI. fbmTeren to szum warto\u015Bciowy: skupia si\u0119 wok\xF3\u0142 0,5
        // (zmierzone na 20 tys. pr\xF3bek: mediana 0,50, 90. centyl 0,65,
        // maksimum ~0,87). Progi typu 0,6\u20130,95 nie zapalaj\u0105 si\u0119 prawie
        // nigdy \u2014 st\u0105d te ciasne, przesuni\u0119te w d\xF3\u0142 zakresy ni\u017Cej.

        // 1. dwa tony zieleni \u2014 wielka, mi\u0119kka plama
        float t = clamp((duze - 0.5) * uKontrastTeren + 0.5, 0.0, 1.0);
        vec3 barwa = mix(uCiemnaTeren, uJasnaTeren, smoothstep(0.35, 0.68, t));

        // 2. ch\u0142odne szarozielone przetarcia
        barwa = mix(barwa, uSzalwiaTeren, smoothstep(0.55, 0.75, srednie) * uSilaSzalwii);

        // 3. kremowe rozja\u015Bnienia \u2014 drobne, ale zbieraj\u0105 si\u0119 w k\u0119py:
        //    drobny szum daje kszta\u0142t, \u015Bredni decyduje GDZIE k\u0119pa wypada.
        float kremy = smoothstep(0.56, 0.76, drobne) * smoothstep(0.42, 0.64, srednie);
        barwa = mix(barwa, uPiasekTeren, kremy * uSilaPiasku);

        // 4. teren: wierzcho\u0142ki wzg\xF3rz suchsze, niecka piaskowa i b\u0142otnista
        barwa = mix(barwa, uJasnaTeren, clamp(vWysTeren * uWzgorzaTeren, 0.0, 0.5));
        // 5. \u015ACISZENIE. Ca\u0142y wz\xF3r wraca ku spokojnej zieleni \u2014 planeta ma
        //    by\u0107 t\u0142em dla bohatera, nie wzorkiem na tapecie. Niecka jest
        //    POZA \u015Bciszaniem: brzeg stawu to informacja, nie ozdoba.
        barwa = mix(uBazaTeren, barwa, uMocTeren);

        float wglab = clamp(-vWysTeren / uGlebiaTeren, 0.0, 1.0);
        barwa = mix(barwa, uPiasekTeren, smoothstep(0.06, 0.55, wglab + (drobne - 0.5) * 0.3));
        barwa = mix(barwa, uDnoTeren, smoothstep(0.5, 1.0, wglab));

        // 6. PRZEKOPANA ZIEMIA (grz\u0105dka fasoli): ta sama mechanika co brzeg
        //    stawu \u2014 waga z geometrii, brzeg postrz\u0119piony drobnym szumem,
        //    \u015Brodek ciemniejszy i wilgotny, obrze\u017Ce ja\u015Bniejsze i suche.
        float ziem = clamp(vZiemiaTeren + (drobne - 0.5) * 0.45, 0.0, 1.0);
        barwa = mix(barwa, uZiemiaJasnaTeren, smoothstep(0.12, 0.45, ziem));
        barwa = mix(barwa, uZiemiaTeren, smoothstep(0.5, 0.95, ziem + (srednie - 0.5) * 0.2));

        diffuseColor.rgb *= barwa;
      }`),i.userData.shaderTerenu=r},i.userData.uniformyTerenu=n,i.customProgramCacheKey=()=>"teren-proceduralny",i}var Fv=new M,Xf=new M,Zi=new M,Or=new M,qs=new M,Ia=new M,Un=new M,CM=new M;function qf(s){return Array.isArray(s)?[s[0],s[1]]:s.isVector3?[s.x,s.z]:[s.x,s.y]}function fu(s,t,e=qf){let n=[];for(let i of s){let[r,o]=e(i),a=t.normalna(r,o,new M);n.length&&n[n.length-1].dot(a)>1-1e-12||n.push(a)}return n}function Bv(s,t,e=.12){if(s.length<2)return s.slice();let n=t.R,i=[s[0].clone()],r=e;for(let a=0;a<s.length-1;a++){let c=s[a],l=s[a+1],h=Math.acos(Math.max(-1,Math.min(1,c.dot(l)))),u=h*n;if(u<1e-9)continue;let d=Math.sin(h),f=r;for(;f<=u;){let p=f/u,y=d>1e-9?Math.sin((1-p)*h)/d:1-p,m=d>1e-9?Math.sin(p*h)/d:p;i.push(Fv.copy(c).multiplyScalar(y).addScaledVector(l,m).normalize().clone()),f+=e}r=f-u}let o=s[s.length-1];return i[i.length-1].dot(o)<1-1e-9&&i.push(o.clone()),i}function Hv(s,t,e,n){let i=s[t],r=t>0,o=t<s.length-1;o&&nn(i,s[t+1],Zi.set(1,0,0),Zi),r&&nn(i,s[t-1],Or.set(1,0,0),Or).negate(),o||Zi.copy(Or),r||Or.copy(Zi),qs.copy(Zi).add(Or),qs.lengthSq()<1e-10&&qs.copy(Zi),Xe(qs,i);let a=Math.max(qs.dot(Zi),1/n);return{t:qs,mitra:1/a}}function pu(s,t,e={}){let{polSzerokosc:n=.5,wysokosc:i=.01,krok:r=.12,skalaUV:o=1,mitraMax:a=2.5,kapsle:c=!0,juzNormalne:l=!1,wez:h=qf}=e,u=l?s.map(A=>A.clone()):fu(s,t,h);if(u.length<2)return null;let d=Bv(u,t,r);if(d.length<2)return null;let f=d.map(A=>({n:A,hw:n}));if(c&&n>1e-4){let A=[.38,.71,.92,.999],E=(z,N,x)=>{nn(z,N,Un.set(1,0,0),Ia).negate();for(let S of A){let k=z.clone(),I=Ia.clone();t.przesunPoKuli(k,I,S*n);let F={n:k,hw:n*Math.sqrt(Math.max(0,1-S*S))};x?f.unshift(F):f.push(F)}};E(d[0],d[1],!0),E(d[d.length-1],d[d.length-2],!1)}let p=f.map(A=>A.n),y=[],m=[],g=[],v=[],_=t.R,w=0;for(let A=0;A<f.length;A++){let{n:E,hw:z}=f[A];A>0&&(w+=_*Math.acos(Math.max(-1,Math.min(1,p[A-1].dot(E)))));let{t:N,mitra:x}=Hv(p,A,t,a);Ia.crossVectors(E,N).normalize();let S=z*x;for(let k of[1,-1])Un.copy(E),Xf.copy(Ia),S>1e-6&&t.przesunPoKuli(Un,Xf,k*S),m.push(Un.x,Un.y,Un.z),Un.multiplyScalar(_+i),y.push(Un.x,Un.y,Un.z);g.push(0,w*o,1,w*o)}for(let A=0;A<f.length-1;A++){let E=A*2;v.push(E,E+1,E+2,E+1,E+3,E+2)}let C=new Jt;return C.setAttribute("position",new At(y,3)),C.setAttribute("normal",new At(m,3)),C.setAttribute("uv",new At(g,2)),C.setIndex(v),C.computeBoundingSphere(),{geometry:C,os:d,dlugosc:w}}function Kf(s,t,e=Math.PI*t.R*.985){let n=Math.cos(Math.min(e/t.R,Math.PI*.995)),i=[],r=[];for(let o of s)o.y>=n?r.push(o):r.length&&(r.length>=2&&i.push(r),r=[]);return r.length>=2&&i.push(r),i}var Mn={grassA:"#8bb054",grassB:"#6b9a45",grassC:"#a3c368",cliff:"#6d5a44",path:"#c9b58c",pathEdge:"#a8946e",pathSlab:"#d6c49c",water:"#3fb8c9",waterDeep:"#2a93a8",night:"#243147"},ve={pine:4029027,pineDark:3105616,trunk:7031344,leafTree:7319118,rock:9673884,rockDark:7831426,wood:9133628,woodDark:7226150,rope:13219465,lantern:8018488,flame:16767091,gate:10127978,gateGlow:16771496,pakKamien:7040888,pakKamienCiemny:5198684,pakZylka:13223092},Vv=(s,t={})=>new ge({color:s,...t}),fe=s=>new ge({color:s,flatShading:!0});function ce(s,t,e=[0,0,0],n=[0,0,0],i=1){let r=new Lt(s,t);return r.position.set(...e),r.rotation.set(...n),r.scale.setScalar(i),r}function Yf(s,t,e,n,i){let r=Math.hypot(s,t);if(r<1e-6)return 1;let o=r/i,a=Math.sin(o)/o,c=Math.hypot(e,n)||1,l=-n/c,h=e/c,u=s/r,d=t/r,f=l*u+h*d,p=-l*d+h*u,y=Math.sqrt(f*f+p*p*a*a);return Math.min(8,1/Math.max(.001,y))}function mu(s,t,e,n,i,r,o){if(t.length<2)return;s.fillStyle=s.strokeStyle;let a=i/2/o;for(let c=0;c<t.length-1;c++){let l=t[c],h=t[c+1],u=h.x-l.x,d=h.y-l.y,f=Math.hypot(u,d);if(f<1e-6)continue;u/=f,d/=f;let p=a*Yf(l.x,l.y,u,d,r),y=a*Yf(h.x,h.y,u,d,r);s.beginPath(),s.moveTo(e(l.x-d*p),n(l.y+u*p)),s.lineTo(e(h.x-d*y),n(h.y+u*y)),s.lineTo(e(h.x+d*y),n(h.y-u*y)),s.lineTo(e(l.x+d*p),n(l.y-u*p)),s.closePath(),s.fill()}for(let c of t){let l=Math.hypot(c.x,c.y),h=l/r,u=l<1e-6?1:Math.sin(h)/h,d=a/Math.max(.001,Math.abs(u));s.save(),s.translate(e(c.x),n(c.y)),s.rotate(Math.atan2(c.y,c.x)),s.beginPath(),s.ellipse(0,0,a*o,Math.min(a*8,d)*o,0,0,Math.PI*2),s.fill(),s.restore()}}function Gv(s,t){let e=s.teren,n=2048,i=document.createElement("canvas");i.width=i.height=n;let r=i.getContext("2d"),o=n/e,a=_=>(_+e/2)*o,c=_=>(_+e/2)*o,l=r.createLinearGradient(0,0,0,n);l.addColorStop(0,Mn.grassB),l.addColorStop(.55,Mn.grassA),l.addColorStop(1,Mn.grassB),r.fillStyle=l,r.fillRect(0,0,n,n);let h=42,u=()=>(h=h*16807%2147483647)/2147483647;for(let _=0;_<520;_++)r.fillStyle=u()>.5?Mn.grassC:Mn.grassB,r.globalAlpha=.16+u()*.2,r.beginPath(),r.ellipse(u()*n,u()*n,(14+u()*46)*2,(10+u()*30)*2,u()*3,0,7),r.fill();if(r.globalAlpha=1,!s.latarnia.ukryta){let _=r.createRadialGradient(a(0),c(-6.5),10,a(0),c(-6.5),n*.5);_.addColorStop(0,"rgba(255,220,140,0.5)"),_.addColorStop(.4,"rgba(255,220,140,0.16)"),_.addColorStop(1,"rgba(255,220,140,0)"),r.fillStyle=_,r.fillRect(0,0,n,n)}let d=t.R,f=s.rzeka.krzywe,p=(_=0)=>{let w=[];return f.forEach((C,A)=>{for(let E=A?1:0;E<=40;E++){let z=E/40;w.push(new rt((1-z)*(1-z)*C.od[0]+2*(1-z)*z*C.kontrola[0]+z*z*C.do[0],(1-z)*(1-z)*(C.od[1]+_)+2*(1-z)*z*(C.kontrola[1]+_)+z*z*(C.do[1]+_)))}}),w},y=s.promienTresci,m=Xs(p(),y);r.strokeStyle=Mn.waterDeep;for(let _ of m)mu(r,_,a,c,2.5*o,d,o);r.strokeStyle=Mn.water;for(let _ of m)mu(r,_,a,c,1.9*o,d,o);r.strokeStyle="rgba(255,255,255,0.25)";let g=p();for(let _ of[-.7,.2,.8]){let w=p(_),C=Xs(g.map((A,E)=>({x:A.x,y:A.y,ix:E})),y);for(let A of C)mu(r,A.map(E=>w[E.ix]),a,c,.25*o,d,o)}for(let _=0;_<92;_++)r.fillStyle=["#ffffff","#e8b7e0","#ffd873"][Math.floor(u()*3)],r.globalAlpha=.8,r.beginPath(),r.arc(u()*n,u()*n,(2.6+u()*2)*2,0,7),r.fill();r.globalAlpha=1;let v=new me(i);return v.colorSpace=Yt,v.anisotropy=8,v}function Wv(s,t){let e=t.R,n=typeof s.terenKanciasty=="number"?s.terenKanciasty:5,i=s.terenWyboje??.05,r=new Nn(e,n),o=r.attributes.position,a=o.count,c=(S,k,I)=>Math.sin(4.8*S+.7)*Math.sin(5.9*I+1.9)*.55+Math.sin(9.3*k+2.6)*Math.sin(7.7*S+.3)*.3+Math.sin(15.1*I+4.2)*Math.sin(12.7*k+1.1)*.15,l=s.terenNieregularnosc??.3,h=1.10715/(n+1),u=l*h,d=S=>{let k=2166136261;for(let I=0;I<S.length;I++)k^=S.charCodeAt(I),k=Math.imul(k,16777619);return k>>>0},f=new Map,p=new M,y=new M,m=new M,g=S=>`${Math.round(S.x*1e4)},${Math.round(S.y*1e4)},${Math.round(S.z*1e4)}`,v=(S,k)=>{let I=f.get(k);if(I)return S.copy(I);let F=d(k),j=F%2048/2048*2-1,B=(F>>>11)%2048/2048*2-1;return m.set(0,1,0),Math.abs(S.y)>.9&&m.set(1,0,0),p.crossVectors(S,m).normalize(),y.crossVectors(S,p).normalize(),S.addScaledVector(p,j*u).addScaledVector(y,B*u).normalize(),f.set(k,S.clone()),S},_=Pa(s),w={x:0,z:0,h:0},C=S=>_.pusta?0:(t.zKuli(S,w),_.h(w.x,w.z)),A=new M,E=new Float32Array(a),z=new Float32Array(a),N=new Array(a);for(let S=0;S<a;S++){A.fromBufferAttribute(o,S).normalize();let k=g(A);N[S]=k,u>1e-6&&v(A,k);let I=c(A.x,A.y,A.z),F=C(A);E[S]=F,_.pusta||(z[S]=_.ziemia(w.x,w.z)),A.multiplyScalar(e+i*(F<-1e-4?I*.3:I)+F),o.setXYZ(S,A.x,A.y,A.z)}r.setAttribute("wysForma",new At(E,1)),r.setAttribute("ziemiaForma",new At(z,1)),s.terenFasety?r.computeVertexNormals():Xv(r,N);let x=new Lt(r,Wf({barwy:s.terenBarwy||null,strojenie:s.terenShader||null,fasety:!!s.terenFasety}));return x.name="ground",x}function Xv(s,t){let e=s.attributes.position,n=e.count,i=new M,r=new M,o=new M,a=new M,c=new M,l=new M,h=new Map;for(let d=0;d+2<n;d+=3){i.fromBufferAttribute(e,d),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),l.crossVectors(a.subVectors(r,i),c.subVectors(o,i));for(let f=0;f<3;f++){let p=t[d+f],y=h.get(p);y||h.set(p,y=new M),y.add(l)}}let u=new Float32Array(n*3);for(let d=0;d<n;d++){let f=h.get(t[d]);l.copy(f).normalize(),u[d*3]=l.x,u[d*3+1]=l.y,u[d*3+2]=l.z}s.setAttribute("normal",new At(u,3))}function qv(s,t){if(s.terenKanciasty)return Wv(s,t);let e=t.R,n=new ze(e,192,128),i=n.attributes.position,r=n.attributes.uv,o=new M,a={x:0,z:0,h:0},c=s.teren;for(let u=0;u<i.count;u++)o.fromBufferAttribute(i,u),t.zKuli(o,a),r.setXY(u,(a.x+c/2)/c,1-(a.z+c/2)/c);r.needsUpdate=!0;let l=new ge({map:Gv(s,t)}),h=new Lt(n,l);return h.name="ground",h}var Ei={PREDKOSC:.18,SZEROKOSC:.9,KRYCIE:.56,SKALA:.55,WYSOKOSC:.012};function Zf(s){let t=document.createElement("canvas");t.width=96,t.height=256;let e=t.getContext("2d");e.clearRect(0,0,96,256),e.lineCap="round";for(let n=0;n<9;n++){let i=16+n*28+(n+s)%2*5,r=.42+n%3*.09,o=e.createLinearGradient(4,0,92,0);o.addColorStop(0,"rgba(255,255,255,0)"),o.addColorStop(.18,`rgba(255,255,255,${(r*.72).toFixed(3)})`),o.addColorStop(.5,`rgba(255,255,255,${r.toFixed(3)})`),o.addColorStop(.82,`rgba(255,255,255,${(r*.72).toFixed(3)})`),o.addColorStop(1,"rgba(255,255,255,0)"),e.strokeStyle=o,e.lineWidth=2.5+n%3*.7,e.beginPath(),e.moveTo(5,i),e.bezierCurveTo(25,i-5-s,62,i+5,91,i-1),e.stroke()}e.strokeStyle="rgba(255,255,255,.48)",e.lineWidth=1.8;for(let n=0;n<8;n++){let i=29+n*28+s*7,r=14+n%4*15;e.beginPath(),e.moveTo(r,i),e.quadraticCurveTo(r+8,i-3,r+17,i),e.stroke()}return t}function Kv(s,t){let e=Xs(s.rzeka.punkty,s.promienTresci),n=new xt,i=[];for(let r of e){let o=Yv(r,t);n.add(o.mesh),i.push(o.tik)}return{mesh:n,tik:r=>i.forEach(o=>o(r))}}function Yv(s,t){let e=()=>({mesh:new xt,tik:()=>{}});if(!s||s.length<2)return e();let n=[],i=[],r=[],o=Ei.SZEROKOSC,a=new M,c=new M,l=new M,h=new M,u=new M,d=new M,f=new M,p=0;for(let z=0;z<s.length;z++){let N=s[z],x=s[Math.min(z+1,s.length-1)],S=s[Math.max(z-1,0)];t.normalna(N.x,N.y,a),t.normalna(x.x,x.y,c),t.normalna(S.x,S.y,l),nn(a,c,f.set(1,0,0),h),nn(a,l,f.set(1,0,0),f).negate(),h.add(f),h.lengthSq()<1e-6&&nn(a,c,f.set(1,0,0),h),Xe(h,a),u.crossVectors(a,h).normalize(),z>0&&(p+=t.odleglosc(a,t.normalna(s[z-1].x,s[z-1].y,l)));let k=p*Ei.SKALA;d.copy(a),f.copy(u),t.przesunPoKuli(d,f,o),d.multiplyScalar(t.R+Ei.WYSOKOSC),n.push(d.x,d.y,d.z),d.copy(a),f.copy(u),t.przesunPoKuli(d,f,-o),d.multiplyScalar(t.R+Ei.WYSOKOSC),n.push(d.x,d.y,d.z),i.push(0,k,1,k)}for(let z=0;z<s.length-1;z++){let N=z*2;r.push(N,N+1,N+2,N+1,N+3,N+2)}let y=new Dn(1,1);y.setAttribute("position",new At(n,3)),y.setAttribute("uv",new At(i,2)),y.deleteAttribute("normal"),y.setIndex(r),y.computeBoundingSphere();let m=new me(Zf(0)),g=new me(Zf(1));m.wrapS=m.wrapT=Ln,g.wrapS=g.wrapT=Ln,g.repeat.set(1,1.35),g.offset.y=.37;let v=new re({map:m,transparent:!0,depthWrite:!1,side:ue,opacity:Ei.KRYCIE}),_=new re({map:g,transparent:!0,depthWrite:!1,side:ue,opacity:Ei.KRYCIE*.68}),w=new Lt(y,v);w.renderOrder=1,w.frustumCulled=!1;let C=new Lt(y,_);C.renderOrder=2,C.frustumCulled=!1;let A=new xt;return A.add(w,C),{mesh:A,tik:z=>{m.offset.y=(m.offset.y-z*Ei.PREDKOSC)%1,g.offset.y=(g.offset.y-z*Ei.PREDKOSC*.48)%1,g.offset.x=Math.sin(Date.now()*18e-5)*.045}}}var On={HW_OBRYS:.95,HW_WYPELNIENIE:.775,H_OBRYS:.005,H_WYPELNIENIE:.009,H_PLYTKI:.013,KROK:.14,CO_ILE_PLYTEK:.46};function Zv(){let s=document.createElement("canvas");s.width=s.height=64;let t=s.getContext("2d");t.fillStyle="#ffffff",t.beginPath(),t.roundRect(2,2,60,60,13),t.fill();let e=new me(s);return e.colorSpace=Yt,e}function jv(s,t){let e=new xt;e.name="sciezki";let n=new ge({color:Mn.pathEdge,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),i=new ge({color:Mn.path,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4}),r=[[s.sciezka,1]];for(let c of s.galezie||[]){let l=c&&(c.sciezka||c.punkty);l&&l.length>=2&&r.push([l,c.szerokosc||.75])}let o=[];for(let[c,l]of r)for(let h of Kf(fu(c,t),t)){let u={juzNormalne:!0,krok:On.KROK},d=pu(h,t,{...u,polSzerokosc:On.HW_OBRYS*l,wysokosc:On.H_OBRYS}),f=pu(h,t,{...u,polSzerokosc:On.HW_WYPELNIENIE*l,wysokosc:On.H_WYPELNIENIE});d&&e.add(jf(d.geometry,n)),f&&(e.add(jf(f.geometry,i)),o.push({os:f.os,szer:l}))}let a=Jv(o);return a.length&&e.add($v(a,t)),e}function jf(s,t){let e=new Lt(s,t);return e.frustumCulled=!1,e}function Jv(s){let t=[],e=1337,n=()=>(e=e*16807%2147483647)/2147483647,i=Math.max(1,Math.round(On.CO_ILE_PLYTEK/On.KROK));for(let{os:r,szer:o}of s)for(let a=i;a<r.length-i;a+=i)t.push({n:r[a],przed:r[a-1],po:r[a+1],wzdluz:(.55+n()*.25)*o,wpoprzek:(.42+n()*.2)*o,kolor:n()>.4?Mn.pathSlab:"#cfbd96",bok:(n()-.5)*.12});return t}function $v(s,t){let e=new Dn(1,1);e.rotateX(-Math.PI/2);let n=new ge({map:Zv(),transparent:!0,opacity:.85,alphaTest:.35,polygonOffset:!0,polygonOffsetFactor:-6,polygonOffsetUnits:-6}),i=new Ue(e,n,s.length);i.frustumCulled=!1;let r=new Rt,o=new et,a=new M,c=new M,l=new M,h=new M,u=new M,d=new M,f=new M,p=new M;return s.forEach((y,m)=>{nn(y.n,y.po,d.set(1,0,0),a),nn(y.n,y.przed,d.set(1,0,0),l).negate(),a.add(l),Xe(a,y.n),c.crossVectors(y.n,a).normalize(),h.copy(y.n),u.copy(c),Math.abs(y.bok)>1e-4&&t.przesunPoKuli(h,u,y.bok),a.crossVectors(u,h).normalize(),d.copy(u).multiplyScalar(y.wpoprzek),f.copy(h),p.copy(a).multiplyScalar(y.wzdluz),r.makeBasis(d,f,p),r.setPosition(h.x*(t.R+On.H_PLYTKI),h.y*(t.R+On.H_PLYTKI),h.z*(t.R+On.H_PLYTKI)),i.setMatrixAt(m,r),i.setColorAt(m,o.set(y.kolor))}),i.instanceMatrix.needsUpdate=!0,i.instanceColor&&(i.instanceColor.needsUpdate=!0),i}function $f(s=1){let t=new xt;t.name="kamienny-pak";let e=fe(ve.pakKamien),n=fe(ve.pakKamienCiemny);t.add(ce(new We(.34*s,.58*s,.72*s,7),n,[0,.3*s,0])),t.add(ce(new We(.46*s,.3*s,.26*s,7),e,[0,.76*s,0]));for(let i=0;i<3;i++){let r=i*Math.PI*2/3+.4,o=ce(new vi(.42*s,1.9*s,5),i===1?n:e,[Math.cos(r)*.19*s,1.72*s,Math.sin(r)*.19*s],[Math.cos(r)*.13,r,Math.sin(r)*.13]);t.add(o)}t.add(ce(new vi(.3*s,2.3*s,6),e,[0,1.95*s,0]));for(let i=0;i<3;i++){let r=i*Math.PI*2/3-.5;t.add(ce(new We(.035*s,.02*s,1.5*s,4),fe(ve.pakZylka),[Math.cos(r)*.3*s,1.55*s,Math.sin(r)*.3*s],[Math.cos(r)*.16,0,Math.sin(r)*.16]))}return t}var de={pien:fe(7754545),pienJasny:fe(9529147),igly:fe(4094269),iglyCiemne:fe(3106102),lisc:fe(5739586),liscJasny:fe(7514702),skala:fe(9538424),skalaJasna:fe(11182989),skalaCiemna:fe(7433312),mech:fe(6720325)};function Ks(s=1){let t=new xt;return t.name="sosna-low-poly",t.add(ce(new We(.105*s,.19*s,.88*s,6),de.pien,[0,.44*s,0],[0,.18,0])),[[1.02,.98],[.84,1.48],[.65,1.94],[.43,2.36]].forEach(([e,n],i)=>{let r=ce(new vi(e*s,.92*s,7),i%2?de.iglyCiemne:de.igly,[0,n*s,0],[0,.18+i*.48,i%2?-.025:.025]);r.scale.set(1,i===0?.82:.94,.88+i%2*.08),t.add(r)}),t}function ka(s=1){let t=new xt;t.name="drzewo-lisciaste-low-poly",t.add(ce(new We(.13*s,.22*s,1.25*s,6),de.pien,[0,.58*s,0],[0,.16,0])),t.add(ce(new We(.065*s,.09*s,.66*s,5),de.pienJasny,[-.17*s,1.08*s,.02*s],[0,0,.58])),t.add(ce(new We(.06*s,.085*s,.58*s,5),de.pien,[.19*s,1.12*s,.02*s],[.12,0,-.62]));let e=[[-.45,1.66,.02,.66,.58,.62,0],[.38,1.7,.08,.7,.6,.64,1],[-.05,2.12,-.02,.72,.68,.66,0],[.04,1.63,.38,.57,.52,.56,1],[.62,1.48,-.04,.43,.4,.44,0]];for(let[n,i,r,o,a,c,l]of e){let h=ce(new Nn(1,1),l?de.liscJasny:de.lisc,[n*s,i*s,r*s],[.1+n*.2,.35+i*.13,r*.3]);h.scale.set(o*s,a*s,c*s),t.add(h)}return t}function Jf(s=1,t=!1,e=0){let n=new xt;e=((e|0)%3+3)%3,n.name=t?"kamyk-low-poly":"skaly-low-poly",n.userData.wariantSkaly=e;let i=(r,o,a,c,l,h)=>{let u=ce(new ua(r*s,o),a,c.map(d=>d*s),l);return u.scale.set(...h),n.add(u),u};if(t){let r=[[1.22,.55,.88],[.96,.72,1.18],[1.34,.48,.78]];return i(.48,e===1?1:0,e===2?de.skalaCiemna:de.skala,[0,.16,0],[.45+e*.22,.9-e*.18,.2+e*.3],r[e]),n}return e===0?(i(.67,0,de.skala,[0,.4,0],[.2,.73,.08],[1.12,.92,.86]),i(.39,0,de.skalaJasna,[.48,.22,.12],[.78,.18,.46],[1.06,.66,.92]),i(.27,1,de.skalaCiemna,[-.46,.16,.25],[.42,.62,.16],[1.18,.58,.88]),i(.25,1,de.mech,[-.08,.73,-.02],[0,.4,0],[1.25,.13,.82])):e===1?(i(.6,0,de.skalaCiemna,[0,.27,0],[.12,.42,.06],[1.34,.58,1.02]),i(.46,0,de.skalaJasna,[-.15,.5,.01],[.05,.86,-.1],[1.12,.48,.84]),i(.34,1,de.skala,[.5,.18,.19],[.64,.28,.52],[1.2,.55,.95]),i(.23,0,de.skalaJasna,[-.56,.13,-.1],[.32,.98,.16],[1.1,.48,.8]),i(.28,1,de.mech,[-.13,.69,.01],[0,.2,0],[1.38,.1,.72])):(i(.51,0,de.skala,[0,.31,.02],[.3,.74,.14],[1.08,.78,.96]),i(.42,0,de.skalaJasna,[.44,.25,.08],[.78,.18,.54],[1.08,.69,.9]),i(.37,0,de.skalaCiemna,[-.43,.21,.17],[.42,.91,.22],[1.18,.62,.86]),i(.29,1,de.skala,[.18,.17,-.42],[.28,.36,.68],[1.24,.55,.82]),i(.24,0,de.skalaJasna,[-.19,.14,-.4],[.72,.52,.18],[1.04,.58,.94]),i(.24,1,de.mech,[.01,.6,-.02],[0,.4,0],[1.18,.12,.74])),n}function Qv(){let s=new xt;s.add(ce(new je(.22,2.1,.22),fe(ve.lantern),[0,1.05,0])),s.add(ce(new je(.3,.16,.3),fe(ve.woodDark),[0,2.16,0])),s.add(ce(new je(.8,.14,.18),fe(ve.lantern),[-.3,2.02,0]));let t=new xt;t.position.set(-.62,1.7,0),t.add(ce(new We(.02,.02,.24,5),fe(ve.woodDark),[0,.24,0])),t.add(ce(new je(.24,.3,.24),fe(ve.woodDark),[0,0,0]));let e=new ge({color:ve.flame,emissive:ve.flame,emissiveIntensity:1.6});t.add(ce(new je(.18,.22,.18),e,[0,0,0])),t.add(ce(new vi(.2,.14,4),fe(ve.woodDark),[0,.2,0],[0,Math.PI/4,0])),s.add(t);let n=new un(ve.flame,9,7,2);return n.position.copy(t.position),s.add(n),s.userData={lamp:t,light:n,glassMat:e},s}function tw(){let s=new xt;for(let t=-3;t<=3;t++)s.add(ce(new je(2.2,.1,.34),fe(t%2?ve.wood:ve.woodDark),[0,.16+Math.cos(t*.4)*.09,t*.38],[Math.sin(t*.4)*.09,0,0]));for(let t of[-1,1]){for(let e of[-1,1])s.add(ce(new je(.14,.7,.14),fe(ve.woodDark),[t*1,.45,e*1.25])),s.add(ce(new ze(.09,6,5),fe(ve.wood),[t*1,.84,e*1.25]));s.add(ce(new We(.03,.03,2.5,5),Vv(ve.rope),[t*1,.62,0],[Math.PI/2,0,0]))}return s}function ew(){let s=new xt;for(let o of[-1,1])s.add(ce(new je(.6,2.6,.5),fe(ve.gate),[o*1.3,1.3,0])),s.add(ce(new vi(.42,.6,4),fe(ve.gate),[o*1.3,2.85,0],[0,Math.PI/4,0]));s.add(ce(new je(2.2,.5,.4),fe(ve.gate),[0,2.45,0]));let t=document.createElement("canvas");t.width=t.height=128;let e=t.getContext("2d"),n=e.createRadialGradient(64,64,4,64,64,64);n.addColorStop(0,"rgba(255,240,190,1)"),n.addColorStop(1,"rgba(255,220,140,0)"),e.fillStyle=n,e.fillRect(0,0,128,128);let i=new Ge(new Ve({map:new me(t),color:ve.gateGlow,transparent:!0,opacity:.9,blending:zn,depthWrite:!1}));i.scale.set(3.4,3.4,1),i.position.set(0,1.6,0),s.add(i);let r=new un(ve.gateGlow,10,10,2);return r.position.set(0,1.8,0),s.add(r),s.userData={glow:i,light:r},s}function La(s=1,t=.35,e=0,n=!1){let i=document.createElement("canvas");i.width=i.height=64;let r=i.getContext("2d"),o=r.createRadialGradient(32,32,2,32,32,32);if(n){let u=`rgb(${Math.round(255-225*t)},${Math.round(255-215*t)},${Math.round(255-225*t)})`;o.addColorStop(0,u),e&&o.addColorStop(e,u),o.addColorStop(1,"rgb(255,255,255)")}else o.addColorStop(0,`rgba(30,40,30,${t})`),e&&o.addColorStop(e,`rgba(30,40,30,${t})`),o.addColorStop(1,"rgba(30,40,30,0)");r.fillStyle=o,r.fillRect(0,0,64,64);let a=new me(i);a.colorSpace=Yt;let c=n?new re({map:a,transparent:!0,depthWrite:!1,blending:Uo,toneMapped:!1}):new re({map:a,transparent:!0,depthWrite:!1}),l=new Lt(new Dn(s,s),c);l.rotation.x=-Math.PI/2,l.position.y=.02;let h=new xt;return h.add(l),h.userData.plama=l,h}function Qf(s,t){let e=new Lt(t.geometry,t.material);e.updateMatrixWorld(!0),t.geometry.computeBoundingSphere();let n=t.geometry.boundingSphere.radius+1,i=new Hs,r=new M,o=new M,a=new M;return function(l,h){s.normalna(l,h,r),i.set(o.copy(r).multiplyScalar(n),a.copy(r).negate());let u=i.intersectObject(e,!1)[0];return(u?u.point.dot(r)-s.R:0)-.008}}function nw(s,t,e,n=Qf(t,e)){let r=[{p:16643814,s:15909194},{p:16238920,s:14715422},{p:15765428,s:16177003},{p:8038120,s:15982714},{p:12159712,s:16179338}],o=[{strona:1,wys:.34,sk:1,obr:-.5},{strona:-1,wys:.58,sk:.78,obr:.5}],a=new ge({color:6065210,flatShading:!0}),c=new ge({color:7250762,flatShading:!0}),l=new We(.008,.012,1,5),h=new ze(.058,9,6),u=new ze(.052,10,7),d=new ze(.04,10,7),f=18,p=new Jt;p.setAttribute("position",new At([-.09,-.006,-.048,-.222,.978,.954,-.22,.926,1.003,-.116,-.016,.013,.092,.006,.048,.111,.017,-.013,-.147,.949,1.022,-.147,1,.973,-.009,-.005,.031,.013,.005,-.031,-.182,.938,1.012,-.183,.989,.963,-.307,.65,.188,-.312,.621,.228,-.019,.694,.268,-.022,.665,.306,-.163,.643,.267,-.159,.672,.228,-.297,.86,.531,-.293,.821,.574,-.067,.902,.586,-.066,.864,.627,-.175,.843,.6,-.177,.881,.558,-.197,.361,-.049,-.219,.34,-.003,.061,.399,.021,.046,.378,.065,-.083,.359,.031,-.065,.38,-.014],3)),p.setAttribute("color",new At([.72,.78,.62,1.113,1.094,.817,1.096,1.081,.808,.72,.78,.62,.726,.785,.623,.735,.792,.628,1.103,1.087,.812,1.12,1.1,.82,.72,.78,.62,.726,.785,.623,1.1,1.084,.81,1.117,1.097,.818,1.003,1.007,.762,.993,.999,.757,1.019,1.019,.769,1.009,1.011,.764,1.001,1.005,.761,1.011,1.013,.766,1.075,1.064,.797,1.062,1.053,.791,1.088,1.075,.804,1.076,1.065,.798,1.069,1.059,.794,1.082,1.069,.801,.897,.922,.709,.889,.915,.704,.912,.934,.716,.904,.927,.712,.896,.921,.708,.905,.928,.712],3)),p.setIndex([10,11,1,2,10,1,6,7,11,10,6,11,19,18,12,13,19,12,2,1,18,19,2,18,21,20,7,6,21,7,15,14,20,21,15,20,21,22,16,15,21,16,6,10,22,21,6,22,22,19,13,16,22,13,10,2,19,22,10,19,18,23,17,12,18,17,1,11,23,18,1,23,23,20,14,17,23,14,11,7,20,23,11,20,25,24,0,3,25,0,13,12,24,25,13,24,27,26,14,15,27,14,4,5,26,27,4,26,27,28,8,4,27,8,15,16,28,27,15,28,28,25,3,8,28,3,16,13,25,28,16,25,24,29,9,0,24,9,12,17,29,24,12,29,29,26,5,9,29,5,17,14,26,29,17,26]),p.scale(1.05,1,.4),p.computeVertexNormals();let y=new ge({color:16777215,flatShading:!0,vertexColors:!0}),m=[new et(5804348),new et(7317578),new et(8829784)];function g(G){let it=G*2654435761%4294967296;return()=>(it=(it*1664525+1013904223)%4294967296,it/4294967296)}let v=s.map(G=>Math.max(0,Math.min(r.length-1,G.wariant|0))),_=r.map(()=>0);v.forEach(G=>_[G]++);let w=s.length+256,C=new Ue(l,a,w),A=new Ue(h,c,w*2),E=new Ue(p,y,256*f);C.count=s.length,A.count=s.length*2,E.count=0;let z=[],N=[],x=[];r.forEach((G,it)=>{z.push(new Ue(u,new ge({color:G.p,flatShading:!1}),(_[it]+256)*5)),N.push(new Ue(d,new ge({color:G.s,flatShading:!1}),_[it]+256)),z[it].count=_[it]*5,N[it].count=_[it],x.push(0)});let S=new xt,k=new xt,I=new xt,F=new xt,j=new xt,B=[new xt,new xt],Q=[],W=[],lt=[];S.add(k),k.add(I,F,...B),I.add(j);for(let G=0;G<5;G++){let it=new xt;I.add(it),Q.push(it)}for(let G=0;G<f;G++){let it=new xt,J=new xt;it.add(J),k.add(it),W.push(it),lt.push(J)}let ot=new Rt().makeScale(0,0,0);function vt(G,it){let J=g(it+1),dt=Math.max(0,Math.min(4,G.wariant|0)),R=.085+J()*.025,b={x:G.pos[0],z:G.pos[1],typ:G.typ==="trawa"?"trawa":"kwiat",wariant:dt,h:R,iTrawa:G.iTrawa??null,grunt:n(G.pos[0],G.pos[1]),gruntX:G.pos[0],gruntZ:G.pos[1],skala:(.85+J()*.5)*(G.skala!=null?G.skala:1),obrotY:G.obrot!=null?G.obrot:J()*Math.PI*2,bazaZ:(J()-.5)*.28,bazaX:(J()-.5)*.2,glowaX:-.34+J()*.14,katy:[0,0,0,0,0].map((O,q)=>q/5*Math.PI*2+J()*.1),iLodyga:it,iLisc:[it*2,it*2+1],iSrodek:x[dt],iPlatki:[0,1,2,3,4].map(O=>x[dt]*5+O),gib:{x:0,z:0,vx:0,vz:0}};return x[dt]++,b}function Xt(G,it){let J=g(it),dt=[[[0,0]],[[-.065,0],[.065,.012]],[[-.078,-.026],[0,.042],[.082,-.022]],[[-.1,-.012],[-.034,.038],[.038,.032],[.105,-.018]]],R=Math.floor(J()*dt.length),b=dt[R],O=Math.min(f,4+b.length+Math.floor(J()*4)),q=J()*Math.PI*2,K=.05+J()*.075,Y=.8+J()*.55,St=.5+J()*1.05;G.ukladTrawy=R,G.trawa=Array.from({length:f},(ct,ut)=>{let Gt=b[ut%b.length],nt=Gt[0]*Math.cos(q)-Gt[1]*Math.sin(q),_t=Gt[0]*Math.sin(q)+Gt[1]*Math.cos(q),Ct=q+ut*2.39996+(J()-.5)*.95,zt=ut<b.length?J()*.022:Math.sqrt(J())*K,yt=(.02+J()*.13)*St,Kt=Math.floor(J()*m.length);return G.iTrawa!=null&&E.setColorAt(G.iTrawa+ut,m[Kt]),{aktywne:ut<O,x:nt+Math.cos(Ct)*zt,z:_t+Math.sin(Ct)*zt,h:(.115+J()*.09+(1-Math.min(1,zt/K))*.03)*Y,szer:.75+J()*.5,luk:.75+J()*.55,obrot:Ct+(J()-.5)*2.1,pochylenieX:Math.sin(Ct)*yt+(J()-.5)*.1,pochylenieZ:-Math.cos(Ct)*yt+(J()-.5)*.1}})}let Bt=s.map(vt);function Z(G){(G.x!==G.gruntX||G.z!==G.gruntZ)&&(G.grunt=n(G.x,G.z),G.gruntX=G.x,G.gruntZ=G.z),t.ustaw(S,G.x,G.z,G.grunt,0),k.position.set(0,0,0),k.rotation.set(G.bazaX+G.gib.z,G.obrotY,G.bazaZ-G.gib.x);let it=G.skala*(G.szerokoscWzrostu??1);if(k.scale.set(it,G.skala*(G.wzrost??1),it),G.typ==="trawa"){C.setMatrixAt(G.iLodyga,ot),A.setMatrixAt(G.iLisc[0],ot),A.setMatrixAt(G.iLisc[1],ot),N[G.wariant].setMatrixAt(G.iSrodek,ot);for(let J=0;J<5;J++)z[G.wariant].setMatrixAt(G.iPlatki[J],ot);G.trawa.forEach((J,dt)=>{let R=W[dt],b=lt[dt];R.position.set(J.x,0,J.z),R.rotation.set(J.pochylenieX,0,J.pochylenieZ),b.position.set(0,-.09*J.h,0),b.rotation.set(0,J.obrot,0),b.scale.set(J.h*J.szer,J.h,J.h*J.luk)}),S.updateMatrixWorld(!0),G.trawa.forEach((J,dt)=>E.setMatrixAt(G.iTrawa+dt,J.aktywne?lt[dt].matrixWorld:ot));return}F.position.set(0,G.h/2,0),F.scale.set(1,G.h,1),o.forEach((J,dt)=>{let R=B[dt];R.position.set(J.strona*.058*J.sk,G.h*J.wys,0),R.rotation.set(0,J.strona>0?.25:-.25,J.obr),R.scale.set(1.35*J.sk,.22*J.sk,.7*J.sk)}),I.position.set(0,G.h,0),I.rotation.set(G.glowaX,0,0),j.position.set(0,.016,0),j.scale.set(1,.58,1),G.katy.forEach((J,dt)=>{let R=Q[dt];R.position.set(Math.cos(J)*.066,0,Math.sin(J)*.066),R.rotation.set(0,-J,.12),R.scale.set(1.3,.38,.88)}),S.updateMatrixWorld(!0),C.setMatrixAt(G.iLodyga,F.matrixWorld),A.setMatrixAt(G.iLisc[0],B[0].matrixWorld),A.setMatrixAt(G.iLisc[1],B[1].matrixWorld),N[G.wariant].setMatrixAt(G.iSrodek,j.matrixWorld);for(let J=0;J<5;J++)z[G.wariant].setMatrixAt(G.iPlatki[J],Q[J].matrixWorld);if(G.iTrawa!=null)for(let J=0;J<f;J++)E.setMatrixAt(G.iTrawa+J,ot)}Bt.forEach(Z);function tt(){C.instanceMatrix.needsUpdate=!0,A.instanceMatrix.needsUpdate=!0,E.instanceMatrix.needsUpdate=!0,E.instanceColor&&(E.instanceColor.needsUpdate=!0);for(let G=0;G<r.length;G++)z[G].instanceMatrix.needsUpdate=!0,N[G].instanceMatrix.needsUpdate=!0}tt();let wt=[C,A,E,...z,...N];wt.forEach(G=>G.frustumCulled=!1);let ht=new Set,Dt=.1,Pt=.84,Ht=[[0,0,0],[.14,1.12,.25],[.38,.82,1.35],[.57,1.12,.9],[.75,.97,1.06],[1,1,1]],Zt=0,Vt=0,P=new M;function qe(G,it,J=!1){if(!Number.isFinite(G)||!Number.isFinite(it))return!1;let dt=t.normalna(G,it);if(Bt.some(Y=>t.normalna(Y.x,Y.z,P).dot(dt)>Math.cos(.32/t.R)))return!1;let R=(Vt+1)*7919,b=g(R),O=b()<.45?"trawa":"kwiat",q=.62+b()*.46,K;if(Zt<256)K=vt({pos:[G,it],typ:O,wariant:Vt%5,skala:q,iTrawa:Zt*f},Bt.length),Bt.push(K),Zt++,C.count=Bt.length,A.count=Bt.length*2,z[K.wariant].count=x[K.wariant]*5,N[K.wariant].count=x[K.wariant],E.count=Zt*f;else{if(K=Bt.slice(s.length).find(Y=>!ht.has(Y)&&t.normalna(Y.x,Y.z,P).dot(dt)<Math.cos(9/t.R)),!K)return!1;K.x=G,K.z=it,K.typ=O}return K.typ==="trawa"&&Xt(K,R*17+12345),Vt++,K.czasWzrostu=0,K.wzrost=J?1:0,K.szerokoscWzrostu=J?1:0,K.gib.x=K.gib.z=K.gib.vx=K.gib.vz=0,J||ht.add(K),Z(K),tt(),!0}function qt(G,it=!1){if(ht.size){for(let J of ht){J.czasWzrostu+=Math.max(0,G);let dt=it?1:Math.max(0,Math.min(1,(J.czasWzrostu-Dt)/Pt)),R=1;for(;R<Ht.length-1&&dt>Ht[R][0];)R++;let b=Ht[R-1],O=Ht[R],q=(dt-b[0])/(O[0]-b[0]),K=q*q*(3-2*q);J.szerokoscWzrostu=b[1]+(O[1]-b[1])*K,J.wzrost=b[2]+(O[2]-b[2])*K,Z(J),dt===1&&ht.delete(J)}tt()}}return{lista:Bt,odswiez:Z,oznacz:tt,meshe:wt,posadz:qe,aktualizujZasiew:qt,stanZasiewu:()=>{let G=Bt.slice(s.length,s.length+Zt);return{zasiane:Zt,rosnace:ht.size,limit:256,trawy:G.filter(it=>it.typ==="trawa").length,kwiaty:G.filter(it=>it.typ==="kwiat").length}}}}function tp(s,t){let e=new xt;e.name="planeta";let n=[],i=qv(s,t);e.add(i);let r=Qf(t,i),o=jv(s,t);e.add(o);let a=Kv(s,t);e.add(a.mesh);let c=s.sciezka,l=tw(),h=c.length>=3?Math.atan2(c[2].x-c[1].x,c[2].z-c[1].z):0;t.ustaw(l,s.most.pos[0],s.most.pos[1],0,h),s.most.ukryty||e.add(l);let u=s.latarnia.pos,d=Qv();t.ustaw(d,u.x,u.z,0,-.35);let f=La(1.4);t.ustaw(f,u.x,u.z,0,0),s.latarnia.ukryta||(e.add(d,f),n.push({x:u.x,z:u.z,r:.45}));let p=ew();t.ustaw(p,s.brama.pos[0],s.brama.pos[1],0,0),s.brama.ukryta||(e.add(p),n.push({x:s.brama.pos[0]-1.3,z:s.brama.pos[1],r:.55},{x:s.brama.pos[0]+1.3,z:s.brama.pos[1],r:.55}));let y=s.drzewa?s.drzewa.map(_=>[(_.typ==="lisciaste"?ka:Ks)(_.skala??1),_.pos[0],_.pos[1],_.obrot,_.skala??1]):[[Ks(1.3),-3.6,1.3],[Ks(.9),4.6,-4.2],[ka(1),4.2,.6],[Ks(1.1),-5.2,-3]];for(let[_,w,C,A,E]of y){let z=new xt,N=r(w,C);t.ustaw(z,w,C,N-.1*(E||1),A??0),z.add(_),e.add(z),n.push({x:w,z:C,r:.75,drzewo:_,skalaDrzewa:E||1});let x=La(2.2,.3);t.ustaw(x,w,C,N+.006,0),e.add(x)}let m=s.glazy?s.glazy.map(_=>[_.pos[0],_.pos[1],_.skala??1,_.obrot,_.wariant??0]):[[-1.8,6.6,1.1],[3.1,3.4,.8],[-2.6,-4.6,1],[1.9,-5.4,.7],[-5.6,4,.9]],g=[[[1.02,.58,.3,1.3],[-.72,.92,.25,2.6]],[[.88,-.46,.28,.5],[-.82,.68,.24,2.2],[.52,.96,.22,1.4]],[[1.02,.52,.3,1.3],[-.8,.9,.25,2.6],[.34,-.92,.27,.4],[-1.04,-.3,.2,1.8],[.86,-.58,.22,2.9]]];for(let[_,w,C,A,E=0]of m){let z=Jf(C,!1,E);t.ustaw(z,_,w,r(_,w)-.08*C,A??_*2.1),e.add(z),n.push({x:_,z:w,r:.55*C});for(let[N,[x,S,k,I]]of g[((E|0)%3+3)%3].entries()){let F=Jf(C*k,!0,E+N),j=_+x*C,B=w+S*C;t.ustaw(F,j,B,r(j,B)-.06*C*k,_+I),e.add(F)}}let v=nw(s.kwiaty,t,i,r);return v&&v.meshe.forEach(_=>e.add(_)),{group:e,ziemia:i,sciezki:o,lantern:d,gate:p,bridge:l,obrotMostu:h,blockers:n,kwiaty:v,nurtTik:a.tik,wysokoscGruntu:r}}var iw=.95,sw=.7;function Da(s,t,e){let n=Math.min(1,Math.max(0,(s-t)/Math.max(1e-6,e-t)));return n*n*(3-2*n)}var Fr=null;function rw(){if(Fr)return Fr;let s=document.createElement("canvas");s.width=s.height=128;let t=s.getContext("2d"),e=t.createRadialGradient(64,64,2,64,64,64);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.35,"rgba(255,255,255,0.5)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,128,128),Fr=new me(s),Fr.colorSpace=Yt,Fr}function ow(s,t=.24){let e=new Lt(new Qn(.4,.66,64),new re({color:s,transparent:!0,opacity:t,side:ue,depthWrite:!1}));if(e.rotation.x=-Math.PI/2,e.position.y=.03,t<=0)return e;let n=new Qn(.4,.68,64),i=n.getAttribute("position"),r=i.count,o=new Float32Array(r*4),a=new Float32Array(r);for(let l=0;l<r;l++){o[l*4]=o[l*4+1]=o[l*4+2]=1,o[l*4+3]=0;let h=Math.atan2(i.getY(l),i.getX(l));a[l]=h<0?h+Math.PI*2:h}n.setAttribute("color",new At(o,4));let c=new Lt(n,new re({color:s,vertexColors:!0,transparent:!0,opacity:1,side:ue,depthWrite:!1,blending:zn}));return c.position.z=.004,c.__katy=a,e.add(c),e.smuga=c,e}function aw(s,t,e){let n=s.smuga;if(!n)return;let i=n.geometry.getAttribute("color"),r=n.__katy,o=r.length,a=t*1.25%(Math.PI*2),c=1.35,l=Math.min(2.2,e);for(let h=0;h<o;h++){let u=(a-r[h])%(Math.PI*2);u<0&&(u+=Math.PI*2);let d=u<c?1-u/c:0;i.setW(h,d*d*d*.85*l)}i.needsUpdate=!0}var Na=class{constructor(t,e,n=0,i){this.def=t,this.id=t.id,this.planeta=i,this.time=Math.random()*6.28,this.wake=0,this.punch=0,this.touches=0,this.state="idle",this.phase=0,this.fade=1,this.armed=!0,this.mapa={x:t.pos[0],z:t.pos[1]},this.n=i.normalna(t.pos[0],t.pos[1]),this.root=new xt,i.ustaw(this.root,t.pos[0],t.pos[1],n,0);let r=new Ee().setFromObject(e),o=new M;r.getSize(o);let a=.55*(t.scale??1)/Math.max(.001,o.y);e.scale.setScalar(a),r.setFromObject(e),e.position.sub(r.getCenter(new M)),this.mats=[],e.traverse(c=>{let l=c.material?Array.isArray(c.material)?c.material:[c.material]:[];for(let h of l)this.mats.push(h),(t.absorb||t.cykl>0)&&(h.transparent=!0,h.depthWrite=!0),h.metalness=t.metalness??0,h.roughness=t.roughness??.85,h.metalnessMap=null,h.roughnessMap=null,t.barwa!=null?h.color.setHex(t.barwa).multiplyScalar(t.jasnosc??1.35):t.wlasneKolory?h.color.multiplyScalar(t.jasnosc??1):h.color.setScalar(t.jasnosc??1.35),t.barwaMnoznik!=null&&(h.color.r*=(t.barwaMnoznik>>16&255)/255,h.color.g*=(t.barwaMnoznik>>8&255)/255,h.color.b*=(t.barwaMnoznik&255)/255),h.map&&(h.emissiveMap=h.map,h.emissive.setScalar(1),h.emissiveIntensity=0),h.needsUpdate=!0}),t.faceCamera&&(e.rotation.y=Math.atan2(.465,.885),e.rotation.x=-.5),this.spin=new xt,this.spin.position.y=t.height??1.1,this.spin.add(e),this.root.add(this.spin),this.haloBase=t.haloOpacity??.2,this.ringBase=t.ringOpacity??.22,this.lightBase=t.lightBase??2.2,this.halo=new Ge(new Ve({map:rw(),color:t.glow,transparent:!0,opacity:this.haloBase,blending:zn,depthWrite:!1})),this.halo.scale.setScalar(t.haloScale??1.75),this.halo.position.y=t.height??1.1,this.root.add(this.halo),this.light=new un(t.glow,this.lightBase,6.5,2),this.light.position.y=(t.height??1.1)-.1,this.lightBase>0&&this.root.add(this.light),this.ring=ow(t.ringColor??t.glow,this.ringBase),this.root.add(this.ring),this.hit=new Lt(new ze(.85,10,8),new re({visible:!1})),this.hit.position.y=t.height??1.1,this.hit.userData.marker=this,this.root.add(this.hit),this.sparks=[]}update(t,e=1,n=99){this.time+=t,this.mixer&&this.mixer.update(t);let i=0,r=0,o=1;if(this.state==="absorb"){this.phase=Math.min(1,this.phase+t/iw);let p=this.phase;i=(1-(1-p)*(1-p))*(this.def.absorbLift??1.7),o=1+.45*Math.sin(Math.min(1,p/.45)*Math.PI*.5)-1.05*Da(p,.5,1),r=Math.sin(Math.min(1,p/.75)*Math.PI),this.fade=1-Da(p,.42,.92),p>=1&&(this.state="gone",this.phase=0,this.setVisible(!1))}else if(this.state==="gone"){this.phase+=t;let p=(this.powroty?this.def.respawn:this.def.respawnPierwszy??this.def.respawn)??3.2;this.phase>=p&&(this.powroty=(this.powroty||0)+1,this.przenies(),this.state="appear",this.phase=0,this.setVisible(!0),this.def.cykl>0&&this.sparkBurst(this.def.iskry??18,this.def.iskrySila??1.35));return}else if(this.state==="appear"){this.phase=Math.min(1,this.phase+t/sw);let p=this.phase;i=(1-p)*.55,o=.25+.75*Da(p,0,1),r=Math.sin(p*Math.PI)*.7,this.fade=Da(p,.05,.6),p>=1&&(this.state="idle",this.phase=0,this.fade=1)}this.state==="idle"&&this.def.cykl>0&&(this.phase+=t)>=this.def.cykl&&this.startAbsorb(!0);for(let p of this.mats)p.transparent&&(p.opacity=this.fade);n>(this.def.zbrojenie??1.7)&&(this.armed=!0);let a=n<3.2?1:0;this.wake+=(a-this.wake)*(1-Math.exp(-4*t)),this.punch=Math.max(0,this.punch-t*2.2);let c=this.punch*this.punch,l=this.def.bezUnoszenia?0:Math.sin(this.time*1.6)*(.09+.05*this.wake)*e;this.spin.position.y=(this.def.height??1.1)+l+(this.def.bezUnoszenia?0:c*.35)+i,this.def.faceCamera?this.spin.rotation.y=Math.sin(this.time*.9)*.38*e+c*1.6+r*1.1:this.def.bezObrotu?this.spin.rotation.y=this.def.obrotY??0:this.spin.rotation.y+=t*(.7+2.4*c);let h=this.def.oddechSkali??1,u=Math.max(0,(1+.08*this.wake*h+.4*c*(this.def.oddechDotyku??h))*o);if(this.spin.scale.setScalar(u),this.def.bujanie!=null)if(this.buj!=null)if((this.buj+=t)>2.6)this.buj=null,this.spin.rotation.z=0,this.spin.position.x=0;else{let p=this.def.bujanie*Math.exp(-1.5*this.buj)*Math.sin(7.5*this.buj),y=.275*(this.def.scale??1);this.spin.rotation.z=p,this.spin.position.x=-y*Math.sin(p),this.spin.position.y-=y*(1-Math.cos(p))}else this.spin.rotation.z=0,this.spin.position.x=0;let d=1+Math.sin(this.time*2.2)*.16,f=1+.45*this.wake+1.6*c+3.2*r;this.halo.position.y=this.spin.position.y,this.halo.scale.setScalar((this.def.haloScale??1.75)*d*f),this.halo.material.opacity=Math.min(1,this.haloBase*f),this.light.intensity=this.lightBase*d*f,this.ring.material.opacity=Math.min(1,this.ringBase*(.92+.5*(.5+.5*Math.sin(this.time*2.2)))*f),this.ring.scale.setScalar(1+.06*Math.sin(this.time*2.2)+.35*c+.5*r),aw(this.ring,this.time,f);for(let p=this.sparks.length-1;p>=0;p--){let y=this.sparks[p];y.userData.life-=t*1.4,y.userData.vel.y-=t*1.8,y.position.addScaledVector(y.userData.vel,t),y.material.opacity=Math.max(0,y.userData.life),y.userData.life<=0&&(this.root.remove(y),this.sparks.splice(p,1))}}touch(){return this.state!=="idle"||this.punch>.55||this.def.raz&&!this.armed?!1:(this.def.raz&&(this.armed=!1),this.punch=1,this.def.bujanie&&(this.buj=0),this.touches++,this.sparkBurst(12,1),!0)}startAbsorb(t=!1){return this.state!=="idle"||!t&&!this.armed?!1:(this.armed=!1,this.state="absorb",this.phase=0,this.punch=0,this.touches++,this.sparkBurst(this.def.iskry??18,this.def.iskrySila??1.35),!0)}get ready(){return this.state==="idle"}przenies(){let t=this.def._pozycje;if(!t||t.length<2)return;let e=t[Math.floor(Math.random()*t.length)];this.mapa={x:e[0],z:e[2]},this.planeta.normalna(e[0],e[2],this.n),this.planeta.ustaw(this.root,e[0],e[2],e[1],0)}ustawAktywny(t){this.aktywny!==t&&(this.aktywny=t,this.root.visible=t)}setVisible(t){if(this.spin.visible=t,this.halo.visible=t,this.light.visible=t,this.ring.visible=t,this.hit.visible=!1,this.hit.userData.off=!t,t)this.spin.scale.setScalar(.25);else{for(let e of this.sparks)this.root.remove(e);this.sparks.length=0,this.light.intensity=0,this.halo.material.opacity=0,this.ring.material.opacity=0}}sparkBurst(t,e){let n=new ze(.05,6,5);for(let i=0;i<t;i++){let r=new Lt(n,new re({color:this.def.glow,transparent:!0,opacity:1}));r.position.copy(this.spin.position);let o=i/t*Math.PI*2;r.userData={vel:new M(Math.cos(o)*e,1.2+Math.random()*.9,Math.sin(o)*e),life:1},this.root.add(r),this.sparks.push(r)}}get worldPos(){return this.mapa}};var ip=(s,t,e)=>s<t?t:s>e?e:s,Br=(s,t,e)=>{let n=ip((e-s)/(t-s||1e-6),0,1);return n*n*(3-2*n)},cw=(s,t,e,n)=>s+(t-s)*(1-Math.exp(-e*n)),lw={niebo:{dzien:9423332,zorza:14256734,noc:2371911,silaZorzy:1,stopnie:[0,.16,.42,1],gradient:{dzien:{horyzont:14479095,nisko:11131120,srodek:7059172,zenit:4035542},poranek:{horyzont:16769976,nisko:16498592,srodek:15968702,zenit:10274020},zorza:{horyzont:16761963,nisko:16354923,srodek:14252966,zenit:8943784},noc:{horyzont:3039106,nisko:2573946,srodek:1781598,zenit:1253191}}},slonceTarcza:{rdzen:16776690,poswiataDzien:16771496,poswiataZorza:16751429,wielkosc:.95,rozmycieZorzy:.7,spowolnienieHoryzontu:.35,zasiegX:.93,szczyt:.48,zanurzenie:.05},ksiezyc:{barwa:16774876,wielkosc:1.15},ziemia:{dzien:16121830,zorza:16766634,noc:7445420,emisjaNoc:1195083,emisjaZorza:5588776},slonce:{dzien:16773327,zorza:16757598,moc:1.8},wypelnienie:{dzien:16773855,noc:9551331,mocDzien:.7,mocNoc:.8},hemisfera:{goraDzien:14214399,dolDzien:5600831,goraNoc:7711177,dolNoc:2376789,zorzaGora:16756848,mocDzien:1.05,mocNoc:.78},ambient:{dzien:8425664,noc:6851770,mocDzien:.3,mocNoc:.38},chmury:{dzien:16777215,zorza:16761763,noc:7902653,emisjaNoc:2308962},gwiazdy:{krycie:.85},progi:{dzienDo:52,zmierzchDo:98,nocOd:90,nocPelna:140,zorzaSrodek:90,zorzaSzerokosc:26.4},tempo:1.5};function hw(s,t){if(!t)return s;let e={};for(let n of Object.keys(s))e[n]=typeof s[n]=="object"&&s[n]!==null?{...s[n],...t[n]||{}}:t[n]??s[n];return e}var bn=new et,Ae=new et,uw=new et,Hr=new M,ep=new M,np=new M,Ua=new M,dw={x:0,y:0},fw={x:0,y:0};function pw(s="#fff6d8",t="#ffd98a"){let e=document.createElement("canvas");e.width=e.height=128;let n=e.getContext("2d"),i=n.createRadialGradient(64,64,0,64,64,64);i.addColorStop(0,s),i.addColorStop(.32,s),i.addColorStop(.46,t),i.addColorStop(1,"rgba(255,220,140,0)"),n.fillStyle=i,n.fillRect(0,0,128,128);let r=new me(e);return r.colorSpace=Yt,r}function mw(){let s=document.createElement("canvas");s.width=s.height=128;let t=s.getContext("2d");t.fillStyle="#fff6dc",t.beginPath(),t.arc(64,64,46,0,Math.PI*2),t.fill(),t.globalCompositeOperation="destination-out",t.beginPath(),t.arc(43,48,43,0,Math.PI*2),t.fill();let e=new me(s);return e.colorSpace=Yt,e}function gw(){let s=document.createElement("canvas");s.width=s.height=256;let t=s.getContext("2d"),e=t.createRadialGradient(128,128,0,128,128,128);e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.48,"rgba(255,255,255,1)"),e.addColorStop(.67,"rgba(255,255,255,.90)"),e.addColorStop(.82,"rgba(255,255,255,.36)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,256,256);let n=new me(s);return n.colorSpace=Yt,n}function yw(){let s=new _n({uniforms:{zenit:{value:new et(2371911)},srodek:{value:new et(2768739)},nisko:{value:new et(2901616)},horyzont:{value:new et(3099256)},stopnie:{value:new jt(0,.16,.42,1)},srodekPlanety:{value:new jt(0,0,1,1)},wysokoscNieba:{value:.4},noc:{value:0},aspekt:{value:1}},vertexShader:`
      varying vec2 vu;
      void main() { vu = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }
    `,fragmentShader:`
      uniform vec3 zenit;
      uniform vec3 srodek;
      uniform vec3 nisko;
      uniform vec3 horyzont;
      uniform vec4 stopnie;
      uniform vec4 srodekPlanety;
      uniform float wysokoscNieba;
      uniform float noc;
      uniform float aspekt;
      varying vec2 vu;
      void main() {
        // WYSOKOSC LICZONA OD HORYZONTU, nie od dolu ekranu.
        // Planeta jest kula w srodku ukladu, wiec w rzucie ortograficznym
        // jej sylwetka to elipsa o znanym srodku i promieniach. Odleglosc
        // fragmentu od tej elipsy (w jej promieniach) daje "ile nad
        // horyzontem" - i to wlasnie po tym idzie gradient. Cieply pas
        // trzyma sie wtedy krawedzi planety na calej szerokosci, tak jak
        // na concept arcie, i nie zalezy od zoomu ani od tego, ile kadru
        // planeta zajmuje.
        vec2 q = (vu * 2.0 - 1.0 - srodekPlanety.xy) / srodekPlanety.zw;
        // Odleglosc od sylwetki, ZNORMALIZOWANA przez to, ile nieba w ogole
        // widac. Dzieki temu 1.0 to zawsze gorna ramka kadru, niezaleznie
        // od tego, czy telefon stoi w pionie, czy ekran jest szeroki.
        float h = clamp((length(q) - 1.0) / max(wysokoscNieba, 0.001), 0.0, 1.6);
        vec3 sky = horyzont;
        sky = mix(sky, nisko,  smoothstep(stopnie.x, stopnie.y, h));
        sky = mix(sky, srodek, smoothstep(stopnie.y, stopnie.z, h));
        sky = mix(sky, zenit,  smoothstep(stopnie.z, stopnie.w, h));
        // BEZ CHMUR. Obloki sa brylami 3D (chmury.js) wiszacymi przed
        // nieboskLonem - malowanie ich tutaj dawalo plaskie plamy bez
        // objetosci i dublowalo te prawdziwe. NieboskLon to sam gradient.
        // (Uwaga: to wnetrze szablonu JS - zadnych odwroconych apostrofow.)
        // Stable sparse stars, independent of viewport resolution and camera zoom.
        vec2 cells = vec2(vu.x*aspekt,vu.y)*38.0;
        vec2 id = floor(cells);
        float seed = fract(sin(dot(id,vec2(127.1,311.7)))*43758.5453);
        vec2 point = fract(cells)-vec2(.3+seed*.4,.5);
        float star = (1.0-smoothstep(.025,.075,length(point))) * step(.965,seed);
        sky += vec3(.75,.83,1.0)*star*noc*smoothstep(.6,.8,vu.y);
        gl_FragColor = vec4(sky, 1.0);
        #include <colorspace_fragment>
      }
    `,depthTest:!1,depthWrite:!1,toneMapped:!1}),t=new Lt(new Dn(2,2),s);return t.frustumCulled=!1,t.renderOrder=-2e3,t.name="nieboskLon",t}var Oa=class{constructor(t){this.C=hw(lw,t.strojenie),this.scena=t.scena,this.slonce=t.slonce,this.wypelnienie=t.wypelnienie,this.hemisfera=t.hemisfera,this.ambient=t.ambient,this.gwiazdy=t.gwiazdy,this.ziemia=t.ziemia||null,this.slonceN=t.slonceN.clone().normalize(),this._sw=this.slonceN.clone(),this._orbita=new M,this.ustawSlonce(this.slonceN),this.faza=null,this.nieboskLon=yw(),this.scena.add(this.nieboskLon);let e=this.C,n=(i,r)=>{let o=new Ge(new Ve({map:i,transparent:!0,depthWrite:!1,opacity:0,toneMapped:!1}));return o.scale.setScalar(r),o.renderOrder=-1e3,o};this.rdzenSlonca=n(gw(),e.slonceTarcza.wielkosc),this.poswiata=n(pw("#ffffff","#ffffff"),e.slonceTarcza.wielkosc*2.2),this.tarczaKsiezyca=n(mw(),e.ksiezyc.wielkosc),this.t=null,this.stan={t:0,dzien:1,noc:0,zorza:0,pora:"dzien"}}podepnijDoKamery(t){t.add(this.rdzenSlonca,this.poswiata,this.tarczaKsiezyca),this.kamera=t}_sylwetka(t,e,n){Ua.set(0,0,0).project(t);let i=(this.promienPlanety||8)/e,r=(this.promienPlanety||8)/n;return{cx:Ua.x,cy:Ua.y,rx:i,ry:r,niebo:Math.max(.02,(1-Ua.y)/r-1)}}_wKadrze(t,e,n,i,r){t.position.set(e.dot(Hr)*n*.78,i*(.54+.3*e.y),r)}ustawSlonce(t){this.slonceN.copy(t).normalize(),this._orbita.set(0,0,1).addScaledVector(this.slonceN,-this.slonceN.z),this._orbita.lengthSq()<1e-8&&this._orbita.set(1,0,0),this._orbita.normalize()}aktualizuj(t,e,n=.016){let i=this.C,r=-t.dot(this._orbita),o=t.dot(this.slonceN),a=Math.hypot(r,o)>1e-6?Math.atan2(r,o):this.faza??0;if(this.faza===null||this.t===null)this.faza=a;else{let v=Math.atan2(Math.sin(a-this.faza),Math.cos(a-this.faza));this.faza+=cw(0,v,i.tempo,n)}let c=Math.atan2(Math.sin(this.faza),Math.cos(this.faza)),l=c+ip(i.slonceTarcza.spowolnienieHoryzontu,0,.45)*Math.sin(2*c),h=this.t=Math.cos(l),u=Math.abs(c)*180/Math.PI,d=1-Br(i.progi.dzienDo,i.progi.zmierzchDo,u),f=Br(i.progi.nocOd,i.progi.nocPelna,u),p=(u-i.progi.zorzaSrodek)/i.progi.zorzaSzerokosc,y=Math.exp(-p*p),m=1-Br(-.2,.2,Math.sin(l));if(this.kamera&&this.kamera.matrixWorld.extractBasis(Hr,ep,np),this._sw.set(Hr.x,0,Hr.z).normalize().multiplyScalar(Math.sin(l)),this._sw.y=h,this.slonce.position.copy(this._sw).multiplyScalar(30),this.slonce.intensity=i.slonce.moc*Math.max(d,y*.6),this.slonce.color.copy(bn.set(i.slonce.zorza)).lerp(Ae.set(i.slonce.dzien),d),this.wypelnienie.intensity=i.wypelnienie.mocNoc+(i.wypelnienie.mocDzien-i.wypelnienie.mocNoc)*d+y*(.5+.35*m),this.wypelnienie.color.copy(bn.set(i.wypelnienie.noc)).lerp(Ae.set(i.wypelnienie.dzien),d),this.hemisfera.intensity=i.hemisfera.mocNoc+(i.hemisfera.mocDzien-i.hemisfera.mocNoc)*d+y*.65,this.hemisfera.color.copy(bn.set(i.hemisfera.goraNoc)).lerp(Ae.set(i.hemisfera.goraDzien),d),i.hemisfera.zorzaGora&&this.hemisfera.color.lerp(Ae.set(i.hemisfera.zorzaGora),y*(1-.6*d)*.35),this.hemisfera.groundColor.copy(bn.set(i.hemisfera.dolNoc)).lerp(Ae.set(i.hemisfera.dolDzien),d),this.ambient.intensity=i.ambient.mocNoc+(i.ambient.mocDzien-i.ambient.mocNoc)*d,this.ambient.color.copy(bn.set(i.ambient.noc)).lerp(Ae.set(i.ambient.dzien),d),this.scena.background&&this.scena.background.copy(bn.set(i.niebo.noc)).lerp(Ae.set(i.niebo.dzien),d).lerp(Ae.set(i.niebo.zorza),y*(1-.55*d)*i.niebo.silaZorzy),this.nieboskLon){let v=this.nieboskLon.material.uniforms,_=y*(1-.55*d)*i.niebo.silaZorzy;v.noc.value=f,v.aspekt.value=this.kamera?(this.kamera.right-this.kamera.left)/(this.kamera.top-this.kamera.bottom):1;let w=i.niebo.gradient,C=i.niebo.stopnie;if(v.stopnie.value.set(C[0],C[1],C[2],C[3]),this.kamera&&this.promienPlanety){let A=this.kamera,E=(A.right-A.left)/2/(A.zoom||1),z=(A.top-A.bottom)/2/(A.zoom||1),N=this._sylwetka(A,E,z);v.srodekPlanety.value.set(N.cx,N.cy,N.rx,N.ry),v.wysokoscNieba.value=N.niebo}for(let A of["horyzont","nisko","srodek","zenit"])v[A].value.copy(bn.set(w.noc[A])).lerp(Ae.set(w.dzien[A]),d).lerp(Ae.set(w.zorza[A]).lerp(uw.set(w.poranek[A]),m),_)}if(this.ziemia?.material){let v=this.ziemia.material;v.color.copy(bn.set(i.ziemia.noc)).lerp(Ae.set(i.ziemia.dzien),d).lerp(Ae.set(i.ziemia.zorza),y*(1-.5*d)*.7),v.emissive&&v.emissive.copy(bn.set(0)).lerp(Ae.set(i.ziemia.emisjaNoc),f).lerp(Ae.set(i.ziemia.emisjaZorza),y*(1-d)*.6)}if(this.kamera){let v=this.kamera;v.matrixWorld.extractBasis(Hr,ep,np);let _=(v.right-v.left)/2/(v.zoom||1),w=(v.top-v.bottom)/2/(v.zoom||1),C=this._sylwetka(v,_,w),A=S=>i.slonceTarcza.szczyt*Math.cos(S)-i.slonceTarcza.zanurzenie,E=(S,k)=>{let I=Math.sin(S)*i.slonceTarcza.zasiegX,F=1-Math.min(1,(I-C.cx)*(I-C.cx)/(C.rx*C.rx)),j=C.cy+C.ry*Math.sqrt(Math.max(0,F));return k.x=I*_,k.y=(j+Math.max(0,1-j)*A(S))*w,k},z=E(l,dw),N=z.x;this.rdzenSlonca.position.set(z.x,z.y,-50),this.poswiata.position.set(z.x,z.y,-50.5),this.rdzenSlonca.material.opacity=Br(-.52,-.2,h)*(.94-.12*d),this.rdzenSlonca.material.color.set(16771961).lerp(Ae.set(i.slonceTarcza.rdzen),d),this.rdzenSlonca.scale.setScalar(i.slonceTarcza.wielkosc*(1+.18*y)),this.poswiata.material.opacity=Math.max(d*.48,y*.46)*Br(-.58,-.24,h),this.poswiata.material.color.copy(bn.set(i.slonceTarcza.poswiataZorza)).lerp(Ae.set(i.slonceTarcza.poswiataDzien),d),this.poswiata.scale.setScalar(i.slonceTarcza.wielkosc*(2.7+i.slonceTarcza.rozmycieZorzy*y));let x=E(l+Math.PI,fw);this.tarczaKsiezyca.position.set(x.x,x.y,-50),this.tarczaKsiezyca.material.opacity=f*.95,this.tarczaKsiezyca.visible=f>.02}for(let v of this.chmuryMaterialy||[])v.color.copy(bn.set(i.chmury.noc)).lerp(Ae.set(i.chmury.dzien),d).lerp(Ae.set(i.chmury.zorza),y*(1-.45*d)*.85),v.emissive&&v.emissive.copy(bn.set(i.chmury.emisjaNoc)).lerp(Ae.set(12900845),d).lerp(Ae.set(13014661),y*.75);if(this.gwiazdy){let v=i.gwiazdy.krycie*f;this.gwiazdy.material.opacity=v,this.gwiazdy.visible=v>.02}let g=f>.55?"noc":y>.35?m>.5?"poranek":"zmierzch":"dzien";return this.stan={t:h,dzien:d,noc:f,zorza:y,pora:g,faza:c,luk:l},g}};function _w(){let s=new Nn(1,2),t=new Jt().copy(s),e=t.getAttribute("position"),n=[],i=new et(14478075),r=new et(16776693),o=new et;for(let a=0;a<e.count;a++){let c=Math.max(0,Math.min(1,(e.getY(a)+1)/2));o.copy(i).lerp(r,Math.sqrt(c)),n.push(o.r,o.g,o.b)}return t.setAttribute("color",new At(n,3)),t.computeVertexNormals(),t.computeBoundingSphere(),s.dispose(),t}var sp=[[[0,0,.04,1.02,.27,.48],[-.68,.05,0,.54,.3,.39],[.67,.06,.01,.55,.31,.4],[-.34,.24,-.02,.52,.42,.42],[.16,.31,-.04,.62,.52,.48],[.57,.22,.02,.43,.36,.36]],[[0,0,.05,1.14,.25,.48],[-.8,.03,.01,.48,.27,.36],[.8,.04,.02,.49,.28,.37],[-.47,.23,-.02,.55,.4,.41],[.02,.28,-.05,.6,.47,.46],[.48,.27,-.01,.58,.43,.43],[.76,.18,.03,.35,.3,.32]],[[0,0,.06,.95,.27,.47],[-.62,.04,.02,.52,.29,.38],[.63,.05,.01,.52,.3,.39],[-.39,.23,-.02,.46,.38,.39],[.02,.34,-.06,.58,.55,.48],[.43,.27,-.03,.48,.43,.4],[-.12,.55,-.08,.36,.34,.34],[.66,.2,.03,.34,.29,.31]]],xw={ile:4,skalaOd:.4,skalaDo:.58,tempoOd:.022,tempoDo:.028,glebokosc:-45,rozstaw:1.45,rozsuwOd:.18,rozsuwDo:.95,pochylenie:1,pochylenieMaks:.85},Fa=class{constructor(t={}){let e=this.C={...xw,...t};this.grupa=new xt,this.grupa.name="chmury",this.material=new ge({vertexColors:!0,emissive:12900845,emissiveIntensity:.65,flatShading:!1}),this.geometria=_w();let n=20260912,i=()=>(n=n*16807%2147483647)/2147483647;this.sztuki=[];let r=0;for(let o=0;o<e.ile;o++){let a=sp[o%sp.length].map((l,h)=>({x:l[0]+(i()-.5)*.055,y:l[1]+(i()-.5)*.035,z:l[2]+(i()-.5)*.04,sx:l[3]*(.94+i()*.12),sy:l[4]*(.92+i()*.16),sz:l[5]*(.94+i()*.12),faza:i()*Math.PI*2,obrot:(i()-.5)*.18,indeks:r+h})),c=e.skalaOd+i()*(e.skalaDo-e.skalaOd);this.sztuki.push({wzor:a,skala:c,x:-e.rozstaw+(o+.5)*2*e.rozstaw/e.ile,postep:(o+.4)/e.ile,tempo:e.tempoOd+i()*(e.tempoDo-e.tempoOd),faza:i()*Math.PI*2}),r+=a.length}this.mesh=new Ue(this.geometria,this.material,r),this.mesh.name="zywe-obloki",this.mesh.frustumCulled=!1,this.mesh.instanceMatrix.setUsage(gf),this.grupa.add(this.mesh),this._czas=0,this._macierz=new Rt,this._pozycja=new M,this._skala=new M,this._obrot=new ln,this._kwaternion=new Ft,this._srodek=new M}podepnijDoKamery(t){t.add(this.grupa),this.kamera=t}aktualizuj(t,e,n=0){let i=this.kamera;if(!i)return;let r=Math.max(0,t);this._czas+=r;let o=this.C,a=(i.right-i.left)/2/(i.zoom||1),c=(i.top-i.bottom)/2/(i.zoom||1),l=this._srodek.set(0,0,0);i.worldToLocal(l);for(let h of this.sztuki){h.postep=(h.postep+r*h.tempo*(1+Math.min(2,Math.max(0,n))*.45))%1;let u=h.postep,d=u*u*(3-2*u),f=Math.min(1,u/.1),p=h.skala*Math.min(1,a/5.25)*2.35,y=p*(.16+1.18*d)*f,m=Math.sin(this._czas*.13+h.faza)*a*.026,g=h.x*a*(o.rozsuwOd+o.rozsuwDo*d)+m,v=.3*c+u*u*(.72*c+p*2.25),_=.78+.3*d,w=g-l.x,C=Math.max(.001,v-l.y),A=Math.max(-o.pochylenieMaks,Math.min(o.pochylenieMaks,Math.atan2(-w,C)*o.pochylenie)),E=Math.sin(A),z=Math.cos(A);for(let N of h.wzor){let x=this._czas*.34+N.faza,S=N.x+Math.sin(x)*.045+Math.sin(x*.47+h.faza)*.018,k=N.y+Math.cos(x*.81)*.025,I=N.z+Math.sin(x*.63)*.025,F=1+Math.sin(x*.73)*.055,j=1+Math.cos(x*.59)*.045,B=1+Math.sin(x*.67+1.3)*.04,Q=S*y*_,W=k*y;this._pozycja.set(g+Q*z-W*E,v+Q*E+W*z,this.C.glebokosc+d*10+I*y),this._skala.set(N.sx*y*F,N.sy*y*j,N.sz*y*B),this._obrot.set(.06+Math.sin(x*.41)*.025,S*.055+Math.cos(x*.37)*.025,N.obrot+A+Math.sin(x*.29)*.025),this._kwaternion.setFromEuler(this._obrot),this._macierz.compose(this._pozycja,this._kwaternion,this._skala),this.mesh.setMatrixAt(N.indeks,this._macierz)}}this.mesh.instanceMatrix.needsUpdate=!0}};var vw={ile:3,barwa:16771488,promienOrbity:.62,wysokosc:.46,tempoOrbity:1.15,wielkoscKuli:.085,mocLatarni:2.6,zasiegLatarni:5.5},Vr=null;function ww(){if(Vr)return Vr;let s=document.createElement("canvas");s.width=s.height=64;let t=s.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.16,"rgba(255,253,240,1)"),e.addColorStop(.3,"rgba(255,236,170,0.78)"),e.addColorStop(1,"rgba(255,220,120,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),Vr=new me(s),Vr.colorSpace=Yt,Vr}var Mw=new et,Gr=class{constructor(t,e={}){let n=this.C={...vw,...e};this.ile=0,this.t=0,this.grupa=new xt,this.grupa.name="swiatlo-bohatera",t.add(this.grupa),this.latarnia=new un(n.barwa,0,n.zasiegLatarni,2),this.latarnia.position.set(0,n.wysokosc,0),this.grupa.add(this.latarnia),this.kule=[];for(let i=0;i<n.ile;i++){let r=new xt,o=new Ge(new Ve({map:ww(),color:n.barwa,transparent:!0,blending:zn,depthWrite:!1,opacity:1,toneMapped:!1}));o.scale.setScalar(n.wielkoscKuli*9),r.add(o),r.visible=!1,r.scale.setScalar(.01),this.grupa.add(r),this.kule.push({obj:r,wejscie:0})}}dodaj(){if(this.ile>=this.C.ile)return!1;let t=this.kule[this.ile];return t.obj.visible=!0,t.wejscie=0,this.ile+=1,!0}oddaj(){let t=this.ile;this.ile=0;for(let e of this.kule)e.obj.visible=!1,e.wejscie=0;return t}get komplet(){return this.ile>=this.C.ile}aktualizuj(t){let e=this.C;this.t+=t;let n=Math.max(1,this.ile);for(let r=0;r<this.kule.length;r++){let o=this.kule[r];if(!o.obj.visible)continue;o.wejscie=Math.min(1,o.wejscie+t*1.6);let a=o.wejscie*o.wejscie*(3-2*o.wejscie),c=this.t*e.tempoOrbity*(Math.PI*2)/n+r*Math.PI*2/n,l=e.promienOrbity*(1+(1-a)*1.6);o.obj.position.set(Math.cos(c)*l,e.wysokosc+(1-a)*.9+Math.sin(this.t*2.1+r)*.045,Math.sin(c)*l),o.obj.scale.setScalar(a)}let i=this.ile/e.ile;this.latarnia.intensity=e.mocLatarni*i*i,this.latarnia.color.copy(Mw.set(e.barwa))}};var _e={barwaGlowna:7122504,barwaGlownaCiemna:5147190,barwaPed:8834133,barwaPedCiemny:5543738,barwaSciezka:10146911,barwaSciezkaCiemna:6529082,barwaLisc:9424986,barwaLiscCiemny:7321160,barwaKwiat:16774876,barwaSrodek:16177003,gladkie:!0,krokiDojrzalosci:14,uSciezki:.55,szczyt:.68,wygiecieOd:.5,wygiecieSila:.42,wygiecieOpad:.16,skokSciezki:3},rp=[{g:1,t0:-.03,start:0,om:1,zwezenie:.42},{g:.94,t0:-.042,start:.16,om:1,zwezenie:.38,sciezkowa:!0},{g:.88,t0:-.052,start:.3,om:1.09,zwezenie:.44},{g:.82,t0:-.038,start:.45,om:.91,zwezenie:.44},{g:.6,t0:-.06,start:.62,om:1.18,zwezenie:.52}],dn=new M,op=new M,Ys=new M,Ba=new M(0,1,0),Ha=new Rt,bw=new Ft,Wr=new M,fn=new M,Je=new M,Sw=new M(0,1,0),gu=new M,yu=new M,Va=new M,Xr=(s,t={})=>new ge({color:s,flatShading:!0,...t}),we=(s,t=0,e=1)=>s<t?t:s>e?e:s,Zs=s=>s*s*(3-2*s);function Aw(s){let t=(s*9301+49297)%233280;return()=>(t=(t*9301+49297)%233280)/233280}function _u(s,t,e){let n=new Er;n.moveTo(0,0),n.bezierCurveTo(-s,t*.15,-s*1.05,t,0,1),n.bezierCurveTo(s*1.05,t,s,t*.15,0,0);let i=new da(n,5),r=i.attributes.position;for(let o=0;o<r.count;o++){let a=r.getX(o),c=r.getY(o);r.setZ(o,-Math.abs(a)*e+Math.sin(c*Math.PI)*.09)}return i.computeVertexNormals(),i}function Tw(){return[_u(.58,.62,.26),_u(.34,.55,.34),_u(.7,.78,.18)]}function Ew(){let s=[],t=[],e=[],n=new et(_e.barwaKwiat),i=new et(_e.barwaSrodek),r=(c,l,h,u)=>(s.push(c,l,h),t.push(u.r,u.g,u.b),s.length/3-1),o=r(0,.02,0,i);for(let c=0;c<5;c++){let l=c/5*Math.PI*2,h=l+1.1,u=.06,d=.19,f=r(Math.cos(l)*u,0,Math.sin(l)*u,i),p=r(Math.cos((l+h)/2)*d,.035,Math.sin((l+h)/2)*d,n),y=r(Math.cos(h)*u,0,Math.sin(h)*u,i);e.push(o,f,y,f,p,y)}let a=new Jt;return a.setAttribute("position",new At(s,3)),a.setAttribute("color",new At(t,3)),a.setIndex(e),a.computeVertexNormals(),a}var Ga=class{constructor(t){this.H=t.H,this.wygiecieOd=t.wygiecieOd??_e.wygiecieOd,this.wygiecieSila=t.wygiecieSila??_e.wygiecieSila,this.wygiecieOpad=t.wygiecieOpad??_e.wygiecieOpad,this.obroty=t.obroty??2.6;let e=t.pnacza??(t.pedy!=null?t.pedy+1:this.H>6?5:4);this.ile=Math.max(2,Math.min(rp.length,Math.round(e))),this.grubosc=t.grubosc??.18+.1*this.H,this.szerokoscSciezki=t.szerokoscSciezki??Math.max(.7,.1*this.H),this.u=0,this.krok=-1,this.dojrzalosc=0,this.ozdobyWidoczne=!0;let n=Aw(t.ziarno??1);this.faza=[n()*6.28,n()*6.28,n()*6.28],this.rBaza=this.grubosc/(1+.36*this.ile),this.rSplotu=.36*this.ile*this.rBaza;let i=this.H/Math.max(1.3,this.szerokoscSciezki*_e.skokSciezki);this.obrotySciezki=Math.max(this.obroty*.85,i),this.dodatkoweObroty=Math.max(0,this.obrotySciezki-this.obroty),this.tabN=192,this.tab=new Float32Array(this.tabN+1);let r=0;for(let o=1;o<=this.tabN;o++)r+=this._tempo((o-.5)/this.tabN)/this.tabN;this.skalaSkretu=this.dodatkoweObroty/Math.max(1e-6,r),this.group=new xt,this.group.name="pnacze",this.matRura=Xr(16777215,{vertexColors:!0,flatShading:!_e.gladkie}),this.matLisc=Xr(16777215,{side:ue}),this.matKwiat=Xr(16777215,{vertexColors:!0,side:ue}),this.pnacza=[];for(let o=0;o<this.ile;o++)this._pnacze(o,n);this.sciezkowe=this.pnacza.find(o=>o.sciezkowa)||this.pnacza[0],this._ozdoby(n),this._przelicz(0),this.ustawWzrost(0)}os(t,e=new M){let n=.13*this.H*(.3+.7*this.dojrzalosc),i=Zs(we(t/.12)),r=Zs(we((t-this.wygiecieOd)/Math.max(.05,1-this.wygiecieOd))),o=r*this.wygiecieSila*this.H*this.dojrzalosc,a=this.faza[0]*.7;return e.set(n*(Math.sin(t*2.3+this.faza[0])+.5*Math.sin(t*5.3+this.faza[2])+.4*t)*i*t+Math.cos(a)*o,t*this.H*(1-this.wygiecieOpad*r*this.dojrzalosc),n*(Math.cos(t*1.9+this.faza[1])+.5*Math.cos(t*4.1+this.faza[2])-.32*t)*i*t+Math.sin(a)*o)}stozek(t){return 1-.94*Zs(we((t-_e.szczyt)/(1-_e.szczyt)))}promienSplotu(t){return this.rSplotu*(1-.34*t)*(1+.17*Math.sin(t*4.3+this.faza[1]))*this.stozek(t)*(.62+.38*this.dojrzalosc)}promienPnacza(t,e){let n=we((e-t.t0)/Math.max(.001,1-t.t0)),i=1+.85*this.dojrzalosc*(1-Zs(we(n/.12))),r=1+.13*Math.sin(e*6.1+t.faza*3);return this.rBaza*t.g*(1-t.zwezenie*e)*r*this.stozek(e)*(.15+.85*Math.pow(this.dojrzalosc,.8))*i}splaszczenie(t,e){return t.sciezkowa?we((this.frontSciezki-e)/.16):0}_tempo(t){return(.72+.62*t)*(1+.34*Math.sin(t*6+this.faza[2]))*(1+.16*Math.sin(t*13.7+this.faza[0]))}_przeliczSkret(){let t=this.tabN,e=this.sciezkowe,n=0;this.tab[0]=0;for(let i=1;i<=t;i++){let r=(i-.5)/t;n+=this.splaszczenie(e,r)*this._tempo(r)/t,this.tab[i]=n}}_skret(t){let e=we(t)*this.tabN,n=Math.min(this.tabN-1,Math.floor(e)),i=e-n;return this.tab[n]*(1-i)+this.tab[n+1]*i}kat(t,e){let n=t.faza+Math.PI*2*this.obroty*t.om*e+.13*Math.sin(e*5.1+t.faza);return t.sciezkowa&&(n+=Math.PI*2*this.skalaSkretu*this._skret(e)),n}promienOd(t,e){let n=this.promienSplotu(e),i=n*t.skalaR*(1+.26*Math.sin(e*Math.PI*2*this.obroty*.8+t.faza*2));if(t.sciezkowa){let r=this.splaszczenie(t,e);i+=r*(this.szerokoscSciezki*.34*this.stozek(e)+n*.35)}return i}punkt(t,e,n=new M){let i=this.kat(t,e),r=this.promienOd(t,e);this.os(e,n);let o=t.szum*this.stozek(e);return n.x+=Math.cos(i)*r+o*Math.sin(e*3.1+t.faza*1.7),n.z+=Math.sin(i)*r+o*Math.cos(e*2.6+t.faza*2.4),n}styczna(t,e,n=new M){return this.punkt(t,Math.max(t.t0,e-.0035),gu),this.punkt(t,Math.min(1,e+.0035),yu),n.subVectors(yu,gu).normalize()}ramka(t,e,n=fn,i=Je,r=Wr){return this.punkt(t,e,Va),this.os(e,Ys),this.styczna(t,e,r),n.set(Va.x-Ys.x,0,Va.z-Ys.z),n.lengthSq()<1e-8&&n.set(1,0,0),n.addScaledVector(r,-n.dot(r)).normalize(),i.crossVectors(r,n).normalize(),i.y<0&&(i.negate(),n.negate()),Va}_przekroj(t,e){let n=this.promienPnacza(t,e),i=this.splaszczenie(t,e);if(i<=0)return{w:n,h:n};let r=this.szerokoscSciezki*this.stozek(e);return{w:n*(1-i)+r*.5*i,h:Math.max(n*(1-.55*i),r*.1*i)}}_pnacze(t,e){let n=rp[t],i=1-n.t0,r={i:t,t0:n.t0,startU:n.start,om:n.om,g:n.g,zwezenie:n.zwezenie,sciezkowa:!!n.sciezkowa&&this.ile>=2,faza:t/this.ile*Math.PI*2+(e()-.5)*.5,szum:this.rSplotu*.18*(.6+e()*.8),skalaR:1,obwod:t===0?8:n.g>.7?7:6},o=i*(this.H+Math.PI*2*this.rSplotu*this.obroty);r.sciezkowa&&(o+=Math.PI*2*(this.rSplotu+this.szerokoscSciezki*.5)*this.dodatkoweObroty);let a=Math.round(we(o*7,28,170));r.sciezkowa&&(a=Math.round(Math.min(240,o*9)),r.obwod=8),r.N=a;let c=(a+1)*r.obwod,l=new Float32Array(c*3),h=new Float32Array(c*3),u=[];for(let m=0;m<a;m++)for(let g=0;g<r.obwod;g++){let v=m*r.obwod+g,_=(m+1)*r.obwod+g,w=(m+1)*r.obwod+(g+1)%r.obwod,C=m*r.obwod+(g+1)%r.obwod;u.push(v,C,_,_,C,w)}let d=new Jt;d.setAttribute("position",new At(l,3)),d.setAttribute("color",new At(h,3)),d.setIndex(u);let f=new Lt(d,this.matRura);f.castShadow=!0,f.frustumCulled=!1,r.mesh=f,r.pos=d.attributes.position.array,r.col=d.attributes.color.array,this.group.add(f),this.geoPaczka=this.geoPaczka||new ze(1,6,5),this.matCzubek=this.matCzubek||Xr(_e.barwaLisc);let p=new Lt(this.geoPaczka,this.matCzubek);p.scale.set(.8,2.1,.8);let y=new xt;y.add(p),y.castShadow=!0,r.czubek=y,this.group.add(y),this.pnacza.push(r)}_przelicz(t){this.dojrzalosc=t,this.frontSciezki=we((t-_e.uSciezki)/(1-_e.uSciezki))*1.18;for(let e of this.pnacza)e.skalaR=e.i===0?.18+.82*Zs(we((t-.1)/.45)):1;this._przeliczSkret();for(let e of this.pnacza)this._przeliczRure(e);this._przeliczOzdoby()}_przeliczRure(t){let{pos:e,col:n,N:i,obwod:r}=t,o=new et(t.i===0?_e.barwaGlowna:_e.barwaPed),a=new et(t.i===0?_e.barwaGlownaCiemna:_e.barwaPedCiemny),c=new et(_e.barwaSciezka),l=new et(_e.barwaSciezkaCiemna),h=t.i===0?.14:.3,u=0;for(let f=0;f<=i;f++){let p=t.t0+(1-t.t0)*(f/i),y=this.ramka(t,p,fn,Je,Wr),m=this._przekroj(t,p),g=this.splaszczenie(t,p);for(let v=0;v<r;v++){let _=v/r*Math.PI*2,w=Math.cos(_),C=Math.sin(_);if(g>.05){let E=1-.52*g;w=Math.sign(w)*Math.pow(Math.abs(w),E),C=Math.sign(C)*Math.pow(Math.abs(C),E)}e[u]=y.x+m.w*w*fn.x+m.h*C*Je.x,e[u+1]=y.y+m.w*w*fn.y+m.h*C*Je.y,e[u+2]=y.z+m.w*w*fn.z+m.h*C*Je.z;let A;g>.25?A=C>.25?c:l:A=(v+f*h)%r<r/2?o:a,n[u]=A.r,n[u+1]=A.g,n[u+2]=A.b,u+=3}}let d=t.mesh.geometry;d.attributes.position.needsUpdate=!0,d.attributes.color.needsUpdate=!0,d.computeVertexNormals(),d.computeBoundingSphere()}_ozdoby(t){this.ozdoby=[];let e=this.H,n=.38+.09*e,i=Tw(),r=Math.round(we(6+e*.95,7,40)),o=Math.round(we(3+e*.6,4,18)),a=Math.round(we(3+e*.4,4,12)),c=[],l=this.pnacza.filter(p=>!p.sciezkowa);for(let p=0;p<r;p++){let y=l[p%l.length],m=(Math.floor(p/l.length)+.35+t()*.3)/Math.ceil(r/l.length);c.push({p:y,t:y.t0+(1-y.t0)*we(m,.04,.97)})}let h=p=>({p:this.pnacza[0],t:.098,kiel:!0,s:n*.82,obrot:p,tilt:.55,rol:0});c.unshift(h(1.57),h(-1.57)),this.liscie=i.map((p,y)=>{let m=Math.ceil(c.length/i.length)+1,g=new Ue(p,this.matLisc,m);return g.castShadow=!0,g.frustumCulled=!1,g.count=0,this.group.add(g),{im:g,uzyte:0}});let u=[new et(_e.barwaLisc),new et(_e.barwaLiscCiemny)];c.forEach((p,y)=>{let m=this.liscie[p.kiel?0:y%this.liscie.length],g=m.uzyte++;m.im.count=m.uzyte,m.im.setColorAt(g,u[!p.kiel&&t()<.42?1:0]);let v=p.t;this.ozdoby.push({im:m.im,i:g,p:p.p,t:v,s:(p.s??n*(1-.42*v)*(.5+.5*Zs(we(v/.16)))*(.85+t()*.35))*(.3+.7*this.stozek(v)),obrot:p.obrot??(y%2-.5)*1.7+(t()-.5)*.9,tilt:p.tilt??.22+t()*.5,rol:p.rol??(y%2?1:-1)*(.34+t()*.34),wysun:0,poz:new M,kw:new Ft,pop:-1})});for(let p of this.liscie)p.im.instanceColor&&(p.im.instanceColor.needsUpdate=!0);let d=new Ue(Ew(),this.matKwiat,o);d.frustumCulled=!1,d.count=o,this.group.add(d),this.kwiaty=d;for(let p=0;p<o;p++){let y=l[p%l.length],m=we(.48+p/o*.5+(t()-.5)*.06,y.t0+.02,.98);this.ozdoby.push({im:d,i:p,p:y,t:m,s:(1.2+.16*e)*(.3+.7*this.stozek(m)),obrot:(t()-.5)*2.4,tilt:.55+t()*.6,wysun:.02,poz:new M,kw:new Ft,pop:-1})}let f=new Ue(new fa(.12,.022,4,10,Math.PI*1.6),Xr(_e.barwaPed),a);f.frustumCulled=!1,f.count=a,this.group.add(f),this.wasy=f;for(let p=0;p<a;p++){let y=l[p%l.length],m=we(.12+p/a*.8+(t()-.5)*.08,y.t0+.02,.97);this.ozdoby.push({im:f,i:p,p:y,t:m,s:(.8+.16*e)*(.7+t()*.6)*(.3+.7*this.stozek(m)),obrot:(t()-.5)*3,tilt:.2+t()*.7,wysun:.01,poz:new M,kw:new Ft,pop:-1})}}_przeliczOzdoby(){for(let t of this.ozdoby){let e=this.ramka(t.p,t.t,fn,Je,Wr);Ys.copy(fn).applyAxisAngle(Ba,t.obrot);let n=gu.copy(Ys).multiplyScalar(Math.cos(t.tilt)).addScaledVector(Ba,Math.sin(t.tilt)).normalize(),i=yu.crossVectors(n,Ba);i.lengthSq()<1e-6?i.set(1,0,0):i.normalize();let r=dn.crossVectors(i,n).normalize();Ha.makeBasis(i,n,r),t.kw.setFromRotationMatrix(Ha),t.rol&&t.kw.multiply(bw.setFromAxisAngle(Sw,t.rol)),t.poz.copy(e).addScaledVector(Ys,this.promienPnacza(t.p,t.t)*.85+t.wysun),t.pop=-1}}ustawWzrost(t){t=this.u=we(t);let e=Math.round(t*_e.krokiDojrzalosci);e!==this.krok&&(this.krok=e,this._przelicz(e/_e.krokiDojrzalosci));for(let i of this.pnacza){let r=we((t-i.startU)/Math.max(.02,1-i.startU));i.front=i.startU>0?Math.pow(r,.72):r,i.tHead=i.t0+(1-i.t0)*i.front;let o=Math.floor(i.front*i.N);if(i.mesh.geometry.setDrawRange(0,o*i.obwod*6),i.mesh.visible=o>0,i.czubek.visible=i.front>.004,i.czubek.visible){let a=i.t0+(1-i.t0)*(o/i.N);i.czubek.position.copy(this.punkt(i,a,dn)),this.styczna(i,a,op),i.czubek.quaternion.setFromUnitVectors(Ba,op),i.czubek.scale.setScalar(Math.max(.001,this.promienPnacza(i,a)*.88))}}let n=new Set;for(let i of this.ozdoby){let r=this.ozdobyWidoczne?we((i.p.tHead-i.t)/.05):0;if(Math.abs(r-i.pop)<.004)continue;i.pop=r;let o=r<=0?1e-4:(r<.6?r/.6*1.16:1.16-(r-.6)/.4*.16)*i.s;Ha.compose(i.poz,i.kw,dn.setScalar(Math.max(1e-4,o))),i.im.setMatrixAt(i.i,Ha),n.add(i.im)}for(let i of n)i.instanceMatrix.needsUpdate=!0}get wysokosc(){return this.u*this.H}get widocznePnacza(){return this.pnacza.filter(t=>t.front>.01).length}sciezka(t,e=0){let n=this.sciezkowe,i=we(t,n.t0,1),r=this.ramka(n,i,fn,Je,Wr),o=this._przekroj(n,i);return dn.copy(r).addScaledVector(Je,o.h*.92).addScaledVector(fn,e),{kat:Math.atan2(dn.z,dn.x),r:Math.hypot(dn.x,dn.z),h:dn.y,os:[0,0]}}kolizja(t=48){let e=this.sciezkowe,n=[],i=[],r=[];for(let o=0;o<=t;o++){let a=e.t0+(1-e.t0)*(o/t),c=this.ramka(e,a,fn,Je,Wr),l=this._przekroj(e,a);n.push(c.x+Je.x*l.h*.92,c.y+Je.y*l.h*.92,c.z+Je.z*l.h*.92),i.push(fn.x,fn.y,fn.z),r.push(Je.x,Je.y,Je.z)}return{os:n,bok:i,gora:r,szerokosc:this.szerokoscSciezki,probek:t}}siatkaKolizji(t=40){let e=this.kolizja(t),n=[],i=[],r=e.szerokosc*.5;for(let a=0;a<=t;a++){let c=a*3;n.push(e.os[c]-e.bok[c]*r,e.os[c+1]-e.bok[c+1]*r,e.os[c+2]-e.bok[c+2]*r),n.push(e.os[c]+e.bok[c]*r,e.os[c+1]+e.bok[c+1]*r,e.os[c+2]+e.bok[c+2]*r)}for(let a=0;a<t;a++){let c=a*2;i.push(c,c+2,c+1,c+1,c+2,c+3)}let o=new Jt;return o.setAttribute("position",new At(n,3)),o.setIndex(i),o.computeVertexNormals(),o}przeszkodaSplotu(t=10){let e=[];for(let n=0;n<=t;n++){let i=n/t;this.os(i,dn),e.push({x:dn.x,y:dn.y,z:dn.z,r:this.promienSplotu(i)+this.rBaza*1.15})}return e}pokazOzdoby(t){this.ozdobyWidoczne=!!t;for(let e of this.ozdoby)e.pop=-1;this.ustawWzrost(this.u)}stan(){return{u:+this.u.toFixed(3),pnaczy:this.pnacza.length,widoczne:this.widocznePnacza,splaszczenie:+we(this.frontSciezki).toFixed(3),krok:this.krok,rysunkow:this.group.children.filter(t=>t.visible).length,trojkatow:this.pnacza.reduce((t,e)=>t+e.N*e.obwod*2,0)}}zniszcz(){this.group.traverse(t=>{t.geometry&&t.geometry.dispose()});for(let t of[this.matRura,this.matLisc,this.matKwiat,this.matCzubek])t.dispose()}};var js={barwaLodygi:7321674,barwaLodygiCiemna:5214006,barwaLisc:9292890,barwaZiarno:12182378,barwaZiemia:8018492,barwaKwiat:16774876,czasWzrostu:1.4,czasWspinaczki:5.6,odstepWspinaczki:.04},Rw=3.4,ap=9427199,Cw=16769696,zw=s=>s<0?0:s>1?1:s,Wa=s=>new ge({color:s,flatShading:!0});function Xa(s,t,e=[0,0,0],n=[0,0,0],i=1){let r=new Lt(s,t);return r.position.set(...e),r.rotation.set(...n),r.scale.setScalar(i),r.castShadow=!0,r}function Pw(s=.55,t=4,e=1.05){let n=(t*9301+49297)%233280,i=()=>(n=(n*9301+49297)%233280)/233280,r=new xt,o=new xt;o.name="rdzen",r.add(o);let a=Xa(new ze(s,10,7),Wa(js.barwaZiemia),[0,-s*.66,0]);a.scale.set(1.15,.42,1.08),o.add(a);for(let l=0;l<6;l++){let h=l/6*Math.PI*2+.4+(i()-.5)*.5,u=s*(.62+i()*.3),d=s*(.08+i()*.07),f=Xa(new Nn(d,0),Wa(l%2?9071174:7164466),[Math.cos(h)*u,s*.01,Math.sin(h)*u],[i()*3,i()*3,i()*3]);f.scale.set(1.15,.65,1),o.add(f)}let c=[10260348,9142386,11051150];for(let l=0;l<6;l++){let h=l/6*Math.PI*2+(i()-.5)*.8+.9,u=e*(.8+i()*.35),d=.05+i()*.07,f=Xa(new Nn(d,0),Wa(c[l%c.length]),[Math.cos(h)*u,d*.25,Math.sin(h)*u],[i()*3,i()*3,i()*3]);f.scale.set(.8+i()*.6,.5+i()*.35,.8+i()*.6),r.add(f)}return r}function Iw(s=.45){let t=new xt,e=s,n=Xa(new ze(e*.5,8,6),Wa(js.barwaZiarno),[0,e*.42,0],[.3,.2,.5]);return n.scale.set(1.35,.85,.95),t.add(n),t}var qr=null;function kw(){if(qr)return qr;let s=document.createElement("canvas");s.width=s.height=64;let t=s.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.3,"rgba(200,240,255,0.9)"),e.addColorStop(1,"rgba(120,200,255,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),qr=new me(s),qr.colorSpace=Yt,qr}var Kr=null;function Lw(){if(Kr)return Kr;let s=document.createElement("canvas");s.width=s.height=128;let t=s.getContext("2d"),e=()=>{t.beginPath(),t.moveTo(64,12),t.bezierCurveTo(78,34,110,58,110,80),t.arc(64,80,46,0,Math.PI),t.bezierCurveTo(18,58,50,34,64,12),t.closePath()};t.save(),t.shadowColor="rgba(18,52,78,0.55)",t.shadowBlur=12,t.shadowOffsetY=3,t.fillStyle="rgba(255,255,255,0.95)",e(),t.fill(),t.restore();let n=t.createLinearGradient(0,16,0,124);return n.addColorStop(0,"#dff6ff"),n.addColorStop(.45,"#8fd8ff"),n.addColorStop(1,"#3aa6dd"),t.fillStyle=n,e(),t.save(),t.clip(),t.fillRect(0,0,128,128),t.restore(),t.lineWidth=7,t.strokeStyle="rgba(255,255,255,0.95)",e(),t.stroke(),t.beginPath(),t.ellipse(48,78,11,16,-.35,0,Math.PI*2),t.fillStyle="rgba(255,255,255,0.72)",t.fill(),Kr=new me(s),Kr.colorSpace=Yt,Kr}var cp=.085;function Dw(s,t,e,n,i,r,o=88){let a=[],c=[],l=s.R,h=new M,u={x:0,z:0,h:0};t.updateMatrix();let d=(p,y)=>{let m=Math.sqrt(Math.max(0,l*l-p*p-y*y))-l;return r?(h.set(p,m,y).applyMatrix4(t.matrix),s.zKuli(h,u),m+(r(u.x,u.z)-i)+cp):m+cp};for(let p=0;p<o;p++){let y=p/o*Math.PI*2;for(let m of[e*n,e]){let g=Math.cos(y)*m,v=Math.sin(y)*m;a.push(g,d(g,v),v)}}for(let p=0;p<o;p++){let y=p*2,m=y+1,g=(p+1)%o*2,v=g+1;c.push(y,m,v,y,v,g)}let f=new Jt;return f.setAttribute("position",new At(a,3)),f.setIndex(c),f.computeVertexNormals(),f}function Nw(s,t,e,n,i,r,o=6,a=44){let c=[],l=[],h=[];for(let p=0;p<=o;p++)h.push(n+(i-n)*(p/o));let u=-1;n===0&&(c.push(0,r(0)+0,0),u=0,h.shift());let d=c.length/3;for(let p=0;p<h.length;p++){let y=h[p];for(let m=0;m<a;m++){let g=m/a*Math.PI*2,v=y*s*t(g),_=Math.cos(g)*v,w=Math.sin(g)*v,C=Math.sqrt(Math.max(0,e*e-_*_-w*w))-e+r(y);c.push(_,C,w)}}if(u>=0)for(let p=0;p<a;p++)l.push(0,d+(p+1)%a,d+p);for(let p=0;p+1<h.length;p++)for(let y=0;y<a;y++){let m=d+p*a+y,g=d+p*a+(y+1)%a,v=m+a,_=g+a;l.push(m,_,v,m,g,_)}let f=new Jt;return f.setAttribute("position",new At(c,3)),f.setIndex(l),f.computeVertexNormals(),f}var Uw={glebokosc:.11};function lp(s,t){let e=s.promien??1.4,n=s.ziarno??1,i=Ur(n),r=t.R,o=new xt;o.name="oczko";let a=s.glebokosc??Uw.glebokosc,c=new Lt(Nw(e,i,r,0,1.02,()=>-a+.05,5),new ge({color:6276318,emissive:1731208,emissiveIntensity:.35,transparent:!0,opacity:.92}));o.add(c);let l=[];for(let u=0;u<3;u++){let d=new Lt(new Qn(e*.2,e*.24,32),new re({color:14677759,transparent:!0,opacity:.35,side:ue,depthWrite:!1}));d.rotation.x=-Math.PI/2,d.position.y=-a+.055,d.userData.faza=u/3,o.add(d),l.push(d)}t.ustaw(o,s.pos[0],s.pos[1],0,0);let h=t.normalna(s.pos[0],s.pos[1]);return{mesh:o,n:h,promien:e,tik(u){for(let d of l){d.userData.faza=(d.userData.faza+u*.28)%1;let f=d.userData.faza,p=.35+f*3.6;d.scale.set(p,p,1),d.material.opacity=.42*(1-f)*(1-f)}}}}var qa=class{constructor(t,e,n,i){this.def=t,this.planeta=e,this.etap=0,this.rosnie=null,this.czas=Math.random()*10,this.n=e.normalna(t.pos[0],t.pos[1]),this.root=new xt,this.root.name="fasola";let r=i?i(t.pos[0],t.pos[1]):0;e.ustaw(this.root,t.pos[0],t.pos[1],r-.055,t.obrot??0);let o=[.45,.9,1.9,3.2,5.5];if(this.etapy=(t.etapy||[]).map((c,l)=>({def:c,wysokosc:c.wysokosc??o[l]??1})),!this.etapy.length)for(let c=0;c<5;c++)this.etapy.push({def:{},wysokosc:o[c]});this.H=this.etapy[this.ostatni].wysokosc,this.cele=this.etapy.map((c,l)=>l===0?0:Math.min(1,c.wysokosc/this.H));let a=t.pnacze||{};this.pnacze=new Ga({H:this.H,obroty:a.obroty,pnacza:a.pnacza,pedy:a.pedy,grubosc:a.grubosc,wygiecieOd:a.wygiecieOd,wygiecieSila:a.wygiecieSila,wygiecieOpad:a.wygiecieOpad,szerokoscSciezki:a.szerokosc,ziarno:a.ziarno??1}),this.u=0,this.root.add(this.pnacze.group),this.kopczyk=Pw(Math.max(.5,this.pnacze.grubosc*1.3),t.grzadka?.ziarno??4,t.grzadka?.promien??1.05),this.kopczyk.getObjectByName("rdzen").scale.setScalar(.4),this.root.add(this.kopczyk),this.ziarno=new xt,this.root.add(this.ziarno),this.halo=new Ge(new Ve({map:kw(),color:12582864,transparent:!0,opacity:0,blending:zn,depthWrite:!1,toneMapped:!1})),this.halo.scale.setScalar(1.6),this.halo.position.y=.35,this.root.add(this.halo),this.swiatlo=new un(12582832,0,5,2),this.swiatlo.position.y=.6,this.root.add(this.swiatlo),this.zasieg=t.zasieg??1.9,this.kragMat=new re({color:ap,transparent:!0,opacity:0,side:ue,depthWrite:!1,toneMapped:!1}),this.krag=new Lt(Dw(e,this.root,this.zasieg,.9,r,i),this.kragMat),this.krag.renderOrder=2,this.krag.visible=!1,this.root.add(this.krag),this.ikonaWody=new Ge(new Ve({map:Lw(),transparent:!0,opacity:0,depthWrite:!1,toneMapped:!1})),this.ikonaWody.scale.set(.62,.82,1),this.ikonaWody.visible=!1,this.root.add(this.ikonaWody),this.kropelka=new Ge(this.ikonaWody.material.clone()),this.kropelka.scale.set(.24,.32,1),this.kropelka.visible=!1,this.root.add(this.kropelka),this._kapanie=0,this.rozbryzgi=[],this.gotowe=this._wczytajZiarno(n)}async _wczytajZiarno(t){let e=this.etapy[0],n=null;if(e.def.file&&t)try{n=(await t(e.def.file)).scene;let o=new Ee().setFromObject(n),a=new M;o.getSize(a),n.scale.setScalar(e.wysokosc/Math.max(.001,a.y)),o.setFromObject(n);let c=o.getCenter(new M);n.position.set(-c.x,-o.min.y-e.wysokosc*.22,-c.z),n.traverse(l=>{l.isMesh&&(l.castShadow=!0)})}catch{console.warn("[fasola] brak modelu ziarna",e.def.file,"\u2014 bry\u0142a zast\u0119pcza"),n=null}let i=n||Iw(e.wysokosc);n||(i.position.y-=e.wysokosc*.18),this.ziarno.add(i),this.ziarno.visible=this.etap===0}get ostatni(){return this.etapy.length-1}get gotowa(){return this.etap>=this.ostatni&&!this.rosnie}get wysokosc(){return this.etap===0&&!this.rosnie?this.etapy[0].wysokosc:this.pnacze.wysokosc}sciezka(t){let e=this.pnacze.sciezka(t,js.odstepWspinaczki);return{kat:e.kat-(this.def.obrot??0),r:e.r,h:e.h}}podlej(){return this.rosnie||this.etap>=this.ostatni?!1:(this.rosnie={t:0,od:this.etap,do:this.etap+1},this._rozbryzg(16),!0)}_rozbryzg(t){let e=new ze(.05,6,5);for(let n=0;n<t;n++){let i=new Lt(e,new re({color:10478847,transparent:!0,opacity:1}));i.position.set(0,.35,0);let r=n/t*Math.PI*2;i.userData={vel:new M(Math.cos(r)*(.6+Math.random()*.8),1.4+Math.random()*1.2,Math.sin(r)*(.6+Math.random()*.8)),life:1},this.root.add(i),this.rozbryzgi.push(i)}}_wskazniki(t,e,n){let i=zw((this.zasieg+Rw-e)/2.2),r=this.gotowa,o=n?3.4:2.1,a=.72+.28*Math.sin(this.czas*o),c=r?.5:n?.7:.4;this.kragMat.color.setHex(r?Cw:ap),this.kragMat.opacity=c*i*a*(e<this.zasieg?1.25:1),this.krag.visible=this.kragMat.opacity>.004;let l=!r&&!this.rosnie&&i>.01;if(this.ikonaWody.visible=l,this.kropelka.visible=!1,!l)return;let h=Math.min(this.wysokosc,1.7)+.62;this._kapanie=(this._kapanie+t*(n?.62:.42))%1;let u=this._kapanie,d=u<.12?Math.sin(u/.12*Math.PI):0;if(this.ikonaWody.position.y=h+Math.sin(this.czas*2.4)*.07-.06*d,this.ikonaWody.scale.set(.62*(1-.12*d),.82*(1+.12*d),1),this.ikonaWody.material.opacity=i*(n?1:.88),u>.1&&u<.55){let f=(u-.1)/.45;this.kropelka.visible=!0,this.kropelka.position.set(0,h-.2-(h-.05)*f*f,0),this.kropelka.material.opacity=i*(f>.82?(1-f)/.18:1)}}update(t,e=99,n=!1){if(this.czas+=t,this.rosnie){let a=this.rosnie;a.t=Math.min(1,a.t+t/js.czasWzrostu);let c=this.cele[a.od],l=this.cele[a.do];if(a.od===0){let p=Math.min(1,a.t/.35);this.ziarno.visible=p<1,this.ziarno.scale.setScalar(Math.max(.001,1-p))}let h=a.od===0?Math.max(0,(a.t-.25)/.75):a.t,u=h<.75?h/.75:1,d=u*u*(3-2*u),f=h<.75?0:Math.sin((h-.75)/.25*Math.PI)*.04;this.u=c+(l-c)*d+(l-c)*f,this.pnacze.ustawWzrost(this.u),a.t>=1&&(this.etap=a.do,this.rosnie=null,this.u=l,this.pnacze.ustawWzrost(this.u))}if(this.kopczyk){let a=.4+.6*(this.u*this.u*(3-2*this.u));this.kopczyk.getObjectByName("rdzen").scale.setScalar(a)}!this.rosnie&&this.etap>0&&(this.pnacze.group.rotation.z=Math.sin(this.czas*1.3)*.02,this.pnacze.group.rotation.x=Math.cos(this.czas*1.1)*.015);let i=Math.max(0,1-e/6),r=this.gotowa?.55:.22,o=.6+.4*Math.sin(this.czas*2.2);this.halo.material.opacity=r*i*o,this.swiatlo.intensity=(this.gotowa?2.2:.6)*i*o,this._wskazniki(t,e,n);for(let a=this.rozbryzgi.length-1;a>=0;a--){let c=this.rozbryzgi[a];c.userData.life-=t*1.1,c.userData.vel.y-=t*3.2,c.position.addScaledVector(c.userData.vel,t),c.material.opacity=Math.max(0,c.userData.life),c.userData.life<=0&&(this.root.remove(c),this.rozbryzgi.splice(a,1))}}};var Ow={ile:34,progBiegu:2.2,odstep:.07,zycie:.62,wielkoscOd:.16,wielkoscDo:.72,krycie:.9,wysokosc:.06,wznoszenie:.34,zostawanie:.34,rozrzutOdlotu:[.55,1.5],rozrzutBoczny:.6,rozrzutSkali:[.62,1.45],rozrzutZycia:[.72,1.34],rozrzutOdstepu:[.5,1.7],rozrzutWzdluz:.3,rozrzutWznoszenia:[.6,1.5],barwaDzien:16776694,barwaNoc:10467028},Yr=null;function Fw(){if(Yr)return Yr;let s=document.createElement("canvas");s.width=s.height=64;let t=s.getContext("2d");for(let[e,n,i,r]of[[30,34,22,.9],[40,28,16,.7],[24,26,13,.6]]){let o=t.createRadialGradient(e,n,0,e,n,i);o.addColorStop(0,`rgba(255,255,255,${r})`),o.addColorStop(.55,`rgba(255,255,255,${r*.45})`),o.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=o,t.fillRect(0,0,64,64)}return Yr=new me(s),Yr.colorSpace=Yt,Yr}var xu=new M,vu=new M,Bw=new et,Hw=new et,Ka=class{constructor(t,e,n={}){let i=this.C={...Ow,...n};this.planeta=e,this.grupa=new xt,this.grupa.name="dymki",t.add(this.grupa),this.material=new Ve({map:Fw(),color:i.barwaDzien,transparent:!0,depthWrite:!1,opacity:i.krycie,toneMapped:!1}),this.sztuki=[];for(let r=0;r<i.ile;r++){let o=new Ge(this.material.clone());o.visible=!1,o.renderOrder=2,this.grupa.add(o),this.sztuki.push({sprite:o,zycie:0,n:new M,tyl:new M,skala:1,tempoZycia:1,wznosi:1,krycie:i.krycie})}this.nastepny=0,this.doWyrzutu=0,this._poprzednia=null,this.predkosc=0,this._ziarno=1013904223,this.los=()=>(this._ziarno=this._ziarno*16807%2147483647)/2147483647}aktualizuj(t,e,n,i){let r=this.C,o=this.planeta.R;if(this._poprzednia&&t>1e-4?this.predkosc=this.planeta.odleglosc(this._poprzednia,e)/t:this._poprzednia=new M,this._poprzednia.copy(e),this.predkosc>r.progBiegu)for(this.doWyrzutu-=t;this.doWyrzutu<=0;){let c=r.rozrzutOdstepu;this.doWyrzutu+=r.odstep*(c[0]+this.los()*(c[1]-c[0])),this._wyrzuc(e,n)}else this.doWyrzutu=0;let a=Bw.set(r.barwaNoc).lerp(Hw.set(r.barwaDzien),i?i.dzien:1);for(let c of this.sztuki){if(!c.sprite.visible)continue;if(c.zycie+=t/r.zycie*c.tempoZycia,c.zycie>=1){c.sprite.visible=!1;continue}let l=c.zycie,h=1-(1-l)*(1-l);c.sprite.scale.setScalar((r.wielkoscOd+(r.wielkoscDo-r.wielkoscOd)*h)*c.skala),c.sprite.material.opacity=c.krycie*(1-l*l),c.sprite.material.color.copy(a),xu.copy(c.n).multiplyScalar(o+r.wysokosc+r.wznoszenie*c.wznosi*h),xu.addScaledVector(c.tyl,r.zostawanie*h),c.sprite.position.copy(xu)}}_wyrzuc(t,e){let n=this.C,i=this.los,r=l=>l[0]+i()*(l[1]-l[0]),o=this.sztuki[this.nastepny];this.nastepny=(this.nastepny+1)%this.sztuki.length,o.zycie=0,o.sprite.visible=!0,o.skala=r(n.rozrzutSkali),o.tempoZycia=1/r(n.rozrzutZycia),o.wznosi=r(n.rozrzutWznoszenia),o.krycie=n.krycie*(.7+i()*.5),o.sprite.material.rotation=i()*Math.PI*2,vu.crossVectors(t,e).normalize();let a=(i()*2-1)*n.rozrzutBoczny,c=(i()*2-1)*n.rozrzutWzdluz;o.n.copy(t).addScaledVector(vu,a/this.planeta.R).addScaledVector(e,c/this.planeta.R).normalize(),o.tyl.copy(e).multiplyScalar(-1).addScaledVector(vu,(i()*2-1)*.9).normalize().multiplyScalar(r(n.rozrzutOdlotu)),o.sprite.material.opacity=o.krycie}};var Ya=typeof matchMedia<"u"&&matchMedia("(pointer:coarse)").matches,$a=1.75,Ri=1.38,wu=3.42,Zr="walk",ji="run",Js="clip",Vw=1.46,Gw=1.37,hp=2.6,Za=.13,ja=-.375,up=.55,Mu=.14,dp=.45,fp=1.6,pp=1.25,Ww=1.7,mp=.3,Xw=1.62,qw=.06,Kw=.42,Yw=.3,bu=1,Su=1.3,Ja=2.1,gp=.517*$a,yp=1.33*$a,Zw=new Set(["Root","Hip","Pelvis"]),_p={ArrowUp:[0,1],KeyW:[0,1],ArrowDown:[0,-1],KeyS:[0,-1],ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0]},jw={NlaTrack:"walk","NlaTrack.001":"run","NlaTrack.002":"idle","NlaTrack.003":"happy"},Jw=3.2,$w=.45,Qw=1.1,tM=.8,eM=.573,nM=.5,iM=.596,xp=-.182,sM=.127,rM=.218,$e=(s,t,e)=>Math.max(t,Math.min(e,s)),Au=(s,t,e,n)=>s+(t-s)*(1-Math.exp(-e*n));function oM(s,t=.1){let e=[];for(let n of s.tracks){if(!n.name.endsWith(".position")||!Zw.has(n.name.split(".")[0]))continue;let i=n.times.length;if(i<2)continue;let r=n.times[0],o=n.times[i-1]-r||1;for(let a=0;a<3;a++){let c=n.values[(i-1)*3+a]-n.values[a];if(!(Math.abs(c)<t)){for(let l=0;l<i;l++)n.values[l*3+a]-=c*((n.times[l]-r)/o);e.push(`${n.name}[${"xyz"[a]}]=${c.toFixed(2)}`)}}}return e}function aM(s,t=.3){let e=n=>n*n*(3-2*n);for(let n of s.tracks){let i=n.times.length;if(i<4)continue;let r=n.name.endsWith(".quaternion"),o=r?4:n.values.length/i,a=n.values.slice(0,o),c=n.values.slice((i-1)*o),l=0;for(let u=0;u<o;u++)l+=(a[u]-c[u])**2;if(Math.sqrt(l)<1e-4)continue;let h=Math.max(1,Math.floor(i*(1-t)));if(r){let u=new Ft(a[0],a[1],a[2],a[3]),d=new Ft(c[0],c[1],c[2],c[3]),f=u.clone().multiply(d.clone().invert()),p=new Ft,y=new Ft,m=new Ft;for(let g=h;g<i;g++){let v=e((g-h)/(i-1-h));y.copy(p).slerp(f,v),m.fromArray(n.values,g*4).premultiply(y).normalize(),m.toArray(n.values,g*4)}}else for(let u=h;u<i;u++){let d=e((u-h)/(i-1-h));for(let f=0;f<o;f++)n.values[u*o+f]+=(a[f]-c[f])*d}}return s}var oi=globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches??!1;function cM(s){let e=[],n=s.clone().normalize(),i=7,r=()=>(i=i*16807%2147483647)/2147483647;for(;e.length<700*3;){let c=new M(r()*2-1,r()*2-1,r()*2-1);c.lengthSq()>1||c.lengthSq()<.05||(c.normalize(),!(c.dot(n)>-.15)&&(c.multiplyScalar(70+r()*20),e.push(c.x,c.y,c.z)))}let o=new Jt;o.setAttribute("position",new At(e,3));let a=new Os(o,new Wi({color:16773839,size:2.2,sizeAttenuation:!1,transparent:!0,opacity:.85}));return a.frustumCulled=!1,a}var Qa=class{constructor(t,e={}){this.host=t,this.opts=e,this.listeners=new Map,this.destroyed=!1,this.paused=!1,typeof e.spokojnyRuch=="boolean"&&(oi=e.spokojnyRuch),this.mapa=Gf(),this.planeta=new Ti(this.mapa.promienKuli),this.canvas=this.$("canvas"),this.renderer=new jo({canvas:this.canvas,antialias:!Ya}),this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,Ya?1.5:2)),this.renderer.outputColorSpace=Yt,this.renderer.toneMapping=fh,this.renderer.toneMappingExposure=this.mapa.ekspozycja,this.scene=new Jo,this.scene.background=new et(Mn.night),this.hemisfera=new ya(14214399,5600831,1.05),this.scene.add(this.hemisfera),this.slonce=new Ki(16769200,1.6),this.slonce.position.set(-6,12,4),this.scene.add(this.slonce),this.ambient=new xa(8425664,.35),this.scene.add(this.ambient),this.wypelnienie=new Ki(16773855,.85),this.wypelnienie.position.set(5,7,9),this.scene.add(this.wypelnienie),this.camera=new xi(-1,1,1,-1,.1,160),this.camDir=new M(4.2,11.5,8).normalize().multiplyScalar(26),this.camTarget=new M(0,this.planeta.R*(1+xp),0),this.camPos=new M,this.gwiazdy=cM(this.camDir),this.scene.add(this.gwiazdy),this.doba=this.mapa.doba.wlaczona?new Oa({scena:this.scene,slonce:this.slonce,wypelnienie:this.wypelnienie,hemisfera:this.hemisfera,ambient:this.ambient,gwiazdy:this.gwiazdy,slonceN:this.planeta.normalna(this.mapa.doba.nad[0],this.mapa.doba.nad[1]),strojenie:this.mapa.doba.strojenie}):null,this._pora=null,this.chmury=this.mapa.chmury>0?new Fa({ile:this.mapa.chmury}):null,(this.doba||this.chmury)&&this.scene.add(this.camera),this.doba&&(this.doba.podepnijDoKamery(this.camera),this.doba.promienPlanety=this.planeta.R),this.chmury&&(this.chmury.podepnijDoKamery(this.camera),this.doba&&(this.doba.chmuryMaterialy=[this.chmury.material])),this.formy=Pa(this.mapa);let n=tp(this.mapa,this.planeta);if(this.swiat=n.group,this.ziemia=n.ziemia,this.scene.add(this.swiat),this.lantern=n.lantern,this.blockers=n.blockers,this.doba&&(this.doba.ziemia=this.ziemia),this.mapa.cienie){this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=uh,this.slonce.castShadow=!0;let o=this.slonce.shadow;o.mapSize.set(Ya?1024:2048,Ya?1024:2048),o.camera.left=-14,o.camera.right=14,o.camera.top=14,o.camera.bottom=-14,o.camera.near=2,o.camera.far=62,o.normalBias=.05,o.bias=-4e-4,this.ziemia&&(this.ziemia.receiveShadow=!0),this.swiat.traverse(a=>{a.isMesh&&a!==this.ziemia&&(a.castShadow=!0,a.receiveShadow=!0)})}this.kwiaty=n.kwiaty,this.zasiewWlaczony=this.mapa.zasiew,this._zasiewOstatnia=null,this._zasiewDroga=0,this.nurtTik=n.nurtTik,this.oczko=this.mapa.oczko?lp(this.mapa.oczko,this.planeta):null,this.oczko&&this.swiat.add(this.oczko.mesh),this.fasola=this.mapa.fasola?new qa(this.mapa.fasola,this.planeta,o=>this.loadGLB(o)):null,this.fasola&&this.swiat.add(this.fasola.root);let i=new Ft().setFromAxisAngle(new M(0,1,0),n.obrotMostu);this.bridgeInv=new Rt().compose(new M(this.mapa.most.pos[0],0,this.mapa.most.pos[1]),i,new M(1,1,1)).invert(),this.groundY=0,this.footOffset=0,this.marker=new Lt(new Qn(.28,.4,24),new re({color:16773839,transparent:!0,opacity:0,side:ue})),this.marker.rotation.x=-Math.PI/2,this.marker.position.y=.05,this.markerKotwica=new xt,this.markerKotwica.add(this.marker),this.swiat.add(this.markerKotwica),this.markerPulse=0,this.sparkles=[],this.sparkleGrupa=new xt,this.planeta.ustaw(this.sparkleGrupa,this.mapa.latarnia.pos.x,this.mapa.latarnia.pos.z,0,0),this.swiat.add(this.sparkleGrupa),this.hn=new M(0,1,0),this.hf=new M(0,0,1),this.hp={x:0,z:0},this.heroLift=0,this.obrotCel=new Ft,this._qTmp=new Ft,this._v1=new M,this._v2=new M,this._v3=new M,this.rzeka3d=Xs(this.mapa.rzeka.punkty,this.mapa.promienTresci).map(o=>o.map(a=>this.planeta.naKule(a.x,a.y,0))),this.latarniaN=this.planeta.normalna(this.mapa.latarnia.pos.x,this.mapa.latarnia.pos.z),this.ograniczenieMapy=!!this.mapa.surowa?.swiat?.tylkoMapa,this.heroT=0,this.targetT=0,this.walking=!1,this.celebrated=!1,this.sequence=null,this.seqTimer=0,this.mode="goto",this.input=new rt(0,0),this.keys=new Set,this.stick=null,this.inputSource=null,this.holdTime=0,this.holdDir=null,this.running=!1,this.idleAtLantern=0,this.camRight=new M,this.camFwd=new M,this.raycaster=new Hs,this.clock=new wa;let r=this.mapa.sciezka;this.odcinki=[],this.dlSciezki=0;for(let o=0;o<r.length-1;o++){let a=r[o].distanceTo(r[o+1]);this.odcinki.push(a),this.dlSciezki+=a}this.tLatarni=0;for(let o=0;o<this.mapa.latarnia.punktSciezki&&o<this.odcinki.length;o++)this.tLatarni+=this.odcinki[o];this.gotowa=this.loadHero().then(()=>this.loadMarkers()).then(()=>this.loadBudynki()).then(()=>this.fasola?.gotowe).then(()=>{this.destroyed||(this.$(".scena3d-loading")?.remove(),this.bindUI(),this.placeHero(0,!0),this.updateCameraBasis(),this.opts.autostart!==!1&&this.renderer.setAnimationLoop(()=>this.tick()),this.emit("gotowa",{klipy:Object.keys(this.actions)}),this._kinoWejscie())}).catch(o=>{throw this.emit("blad",{komunikat:String(o?.message||o)}),o}),this.onWinResize=()=>this.resize(),addEventListener("resize",this.onWinResize),globalThis.ResizeObserver&&(this.ro=new ResizeObserver(()=>this.resize()),this.ro.observe(this.host)),this.resize()}$(t){return this.host.querySelector(t)}$$(t){return this.host.querySelectorAll(t)}emit(t,e={}){let n={nazwa:t,...e};try{this.opts.onEvent?.(t,n)}catch(i){console.warn("onEvent",i)}for(let i of this.listeners.get(t)||[])try{i(n)}catch(r){console.warn("listener "+t,r)}for(let i of this.listeners.get("*")||[])try{i(n)}catch(r){console.warn("listener *",r)}this.host.dispatchEvent(new CustomEvent("scena3d:"+t,{detail:n,bubbles:!0}))}on(t,e){return this.listeners.has(t)||this.listeners.set(t,new Set),this.listeners.get(t).add(e),()=>this.off(t,e)}off(t,e){this.listeners.get(t)?.delete(e)}punktSciezki(t,e=new M){let n=this.mapa.sciezka;if(!n.length)return e.set(0,0,0);t=$e(t,0,this.dlSciezki);let i=0;for(let r=0;r<this.odcinki.length;r++){if(t<=i+this.odcinki[r])return e.lerpVectors(n[r],n[r+1],(t-i)/this.odcinki[r]);i+=this.odcinki[r]}return e.copy(n[n.length-1])}najblizszyPunktSciezki(t){let e=this.mapa.sciezka,n=0,i=1/0,r=0,o=new M,a=new M,c=new M;for(let l=0;l<this.odcinki.length;l++){o.copy(e[l]),a.subVectors(e[l+1],e[l]),c.subVectors(t,o);let h=$e(c.dot(a)/a.lengthSq(),0,1),u=c.addScaledVector(a,-h).lengthSq();u<i&&(i=u,n=r+h*this.odcinki[l]),r+=this.odcinki[l]}return{t:n,dist:Math.sqrt(i)}}loadGLB(t){if(t==="prog")return Promise.resolve({scene:new xt,animations:[]});if(t==="pak"){let i=new xt;return i.add($f(1)),Promise.resolve({scene:i,animations:[]})}if(t==="drzewo"||t==="drzewo-lisciaste"){let i=new xt,r=(t==="drzewo-lisciaste"?ka:Ks)(1);return r.scale.set(.84,1.26,.84),i.add(r),Promise.resolve({scene:i,animations:[]})}let e=new Ea,n=globalThis.__GLB_ASSETS?.[t]||(t==="adventurer"?globalThis.__HERO_GLB_B64:null);return new Promise((i,r)=>{if(n){let o=atob(n),a=new Uint8Array(o.length);for(let c=0;c<o.length;c++)a[c]=o.charCodeAt(c);e.parse(a.buffer,"",i,r)}else e.load(`${this.opts.zasoby??"./assets/"}${t}.glb`,i,void 0,r)})}miejsceWolne(t,e,n,i,r){if(!this.canWalk(t,e))return!1;for(let o=0;o<8;o++){let a=o/8*Math.PI*2;if(!this.canWalk(t+Math.cos(a)*n,e+Math.sin(a)*n))return!1}for(let o of r||[]){let a=o&&o.e;if(!(!a||a.id===i||!a.pos)&&Math.hypot(t-a.pos[0],e-a.pos[1])<n)return!1}return!0}wolneMiejsca(t,e){let n=i=>[i[0],this.groundHeightAt(i[0],i[1]),i[1]];for(let i of[t.margines??1.6,1,.6]){let r=t.pozycje.filter(o=>this.miejsceWolne(o[0],o[1],i,t.id,e));if(r.length)return r.map(n)}return t.pozycje.map(n)}async loadMarkers(){this.markers=[];let t=await Promise.all(this.mapa.znaki.map(e=>this.loadGLB(e.file).then(n=>({e,t:n})).catch(n=>(console.warn("Nie udalo sie wczytac znaku",e.id,n),null))));for(let e of t){if(!e)continue;let{e:n,t:i}=e;n.pozycje&&(n._pozycje=this.wolneMiejsca(n,t));let r=this.groundHeightAt(n.pos[0],n.pos[1]),o=new Na(n,i.scene,r,this.planeta);n.animuj&&i.animations&&i.animations.length&&(o.mixer=new kr(i.scene),o.mixer.clipAction(i.animations[0]).play()),this.swiat.add(o.root),this.markers.push(o)}}async loadBudynki(){for(let t of this.mapa.budynki)try{let n=(await this.loadGLB(t.file)).scene,i=new Ee().setFromObject(n),r=new M;i.getSize(r),n.scale.setScalar((t.wysokosc??2.4)/Math.max(.001,r.y)),i.setFromObject(n);let o=i.getCenter(new M),a=new xt;if(this.planeta.ustaw(a,t.pos[0],t.pos[1],0,0),n.position.set(-o.x,this.groundHeightAt(t.pos[0],t.pos[1])-i.min.y,-o.z),n.rotation.y=t.obrot??0,t.jasnosc&&n.traverse(c=>{let l=c.material?Array.isArray(c.material)?c.material:[c.material]:[];for(let h of l)h.color&&(h.color.multiplyScalar(t.jasnosc),h.needsUpdate=!0)}),a.add(n),this.swiat.add(a),t.ciemnosc){let c=t.mrokPromien??(t.promien??1.4)*.28,l=t.mrokWysokosc??(t.wysokosc??4)*.46,h=new Lt(new We(c,c,l,24,1,!1),new re({color:t.mrokBarwa??1511432,transparent:!0,opacity:typeof t.ciemnosc=="number"?t.ciemnosc:.86,side:He,depthWrite:!1})),u=t.mrokPos?t.mrokPos[0]:t.pos[0],d=t.mrokPos?t.mrokPos[1]:t.pos[1];this.planeta.ustaw(h,u,d,this.groundHeightAt(u,d)+(t.mrokY??.02)+l/2,0),h.renderOrder=-1,h.name="mrok-"+(t.file||"budynek"),this.swiat.add(h)}if(t.drzwiKat!=null){let c=t.promien??1.4,l=t.drzwiSzer??.9,h=14,u=Math.PI*c/h*1.15;for(let d=0;d<h;d++){let f=d/h*Math.PI*2,p=Math.atan2(Math.sin(f-t.drzwiKat),Math.cos(f-t.drzwiKat));Math.abs(p)<l/2||this.blockers.push({x:t.pos[0]+Math.sin(f)*c,z:t.pos[1]+Math.cos(f)*c,r:u})}}else this.blockers.push({x:t.pos[0],z:t.pos[1],r:t.promien??1.4})}catch(e){console.warn("Nie udalo sie wczytac budynku",t.file,e)}}async loadHero(){let t=Du(),e=await this.loadGLB(t.plik||"adventurer"),n=e.scene;if(n.traverse(l=>{l.isSkinnedMesh&&(this.skinned=l,l.frustumCulled=!1)}),!this.skinned)throw new Error("Brak SkinnedMesh w GLB \u2014 rig nie zosta\u0142 wczytany");this.tilt=new xt,this.tilt.position.y=up,n.position.y=-up,this.tilt.add(n),this.hero=new xt,this.hero.add(this.tilt),this.model=n;let i=this.makeHeroEnv();n.traverse(l=>{let h=l.material?Array.isArray(l.material)?l.material:[l.material]:[];for(let u of h)u.metalness=0,u.metalnessMap=null,u.roughnessMap=null,u.roughness=.85,u.normalScale&&u.normalScale.setScalar(.55),u.color.setScalar(t.wyglad?.tint??Xw),u.map&&(u.emissiveMap=u.map,u.emissive.setScalar(1),u.emissiveIntensity=t.wyglad?.self??qw),u.envMap=i,u.envMapIntensity=t.wyglad?.env??Kw,u.needsUpdate=!0}),this.hero.scale.setScalar($a);let r=La(1.3,.62,.34,!0);this.heroShadow=r.userData.plama,this.heroShadow.geometry.scale(.7,.7,1),this.heroShadow.renderOrder=2,this.heroShadow.userData.dopracowany=!0,this.heroShadowKotwica=r,this.swiat.add(r);let o={},a=[];for(let l of e.animations){let h=(t.klipy||jw)[l.name]||l.name;l.name=h,a.push(...oM(l).map(u=>`${h}: ${u}`)),(h==="walk"||h==="run"||h==="idle")&&aM(l),o[h]=l}this.clipReport=a,o.walk&&!o.turn&&(o.turn=If.subclip(o.walk,"turn",0,13,24)),this.mixer=new kr(this.model),this.actions={};for(let[l,h]of Object.entries(o)){let u=this.mixer.clipAction(h);(l==="turn"||l==="happy")&&(u.setLoop(Mh),u.clampWhenFinished=!0),this.actions[l]=u}this.actions.walk&&(this.actions.walk.timeScale=Ri/gp*(t.tempo?.walk??1)),this.actions.run&&(this.actions.run.timeScale=wu/yp*(t.tempo?.run??1));let c=this.alignRunToWalk();c&&a.push(`run\u2192walk: obr\xF3t ${c.obrotPionowy}\xB0, \u015Brodek ${JSON.stringify(c.srodekSwiat)}`),this.calibrateFeet(),this.current=null,this.play("idle"),this.swiat.add(this.hero),this.swiatlo=new Gr(this.hero),this.kropla=new Gr(this.hero,{ile:1,barwa:9428223,mocLatarni:.35,wielkoscKuli:.11,promienOrbity:.5,wysokosc:.6,tempoOrbity:.8}),this.kropla.grupa.name="kropla-bohatera",this.dymki=new Ka(this.swiat,this.planeta),this.debugAPI(e)}debugAPI(t){globalThis.__POC={app:this,bones:this.skinned.skeleton.bones.length,clips:t.animations.map(e=>e.name),isSkinned:!0,setInput:(e,n)=>{this.enterFreeMode(),this.input.set(e,n),this.inputSource="api"},pos:()=>[+this.hp.x.toFixed(2),+this.heroLift.toFixed(2),+this.hp.z.toFixed(2)],clipReport:this.clipReport,clipY:()=>this.clipY,setHeroLook:({tint:e,self:n,env:i})=>{this.hero.traverse(r=>{let o=r.material?Array.isArray(r.material)?r.material:[r.material]:[];for(let a of o)e!=null&&a.color.setScalar(e),n!=null&&(a.emissiveIntensity=n),i!=null&&(a.envMapIntensity=i),a.needsUpdate=!0}),this.renderer.render(this.scene,this.camera)},leanDip:()=>+(this.leanDip||0).toFixed(4),setLean:e=>{this.lean=e,this.tilt.rotation.x=e},leanMax:Za,runMode:()=>Js,markers:()=>(this.markers||[]).map(e=>({id:e.id,dotkniecia:e.touches,stan:e.state,pos:[+e.mapa.x.toFixed(2),+e.mapa.z.toFixed(2)],skala:+e.spin.scale.x.toFixed(3),halo:+e.halo.material.opacity.toFixed(2),swiatlo:+e.light.intensity.toFixed(2),przebudzenie:+e.wake.toFixed(2),wysokosc:+e.spin.position.y.toFixed(3),krycie:+e.fade.toFixed(2),widoczny:e.spin.visible})),touched:()=>this.touched||[],tapMarker:e=>{let n=(this.markers||[]).find(i=>i.id===e);return n?(n.def.absorb?this.enterMarker(n,!0):this.touchMarker(n,!0),{skala:+n.spin.scale.x.toFixed(3),swiatlo:+n.light.intensity.toFixed(2)}):null},setRunMode:e=>{Js=e,this.current=null,this.mixer.stopAllAction(),this.play("idle",0)},groundAt:(e,n)=>+this.groundHeightAt(e,n).toFixed(3),hold:()=>({trzymanie:+this.holdTime.toFixed(2),bieg:this.running,anim:this.current,predkosc:+(this.moveSpeed||0).toFixed(2),tempoKlipu:+(this.actions[Zr]?.timeScale||0).toFixed(2),pochylenieDeg:+((this.lean||0)*180/Math.PI).toFixed(1)}),planeta:()=>({R:this.planeta.R,obrot:this.swiat.quaternion.toArray().map(e=>+e.toFixed(3))})}}makeHeroEnv(){let t=document.createElement("canvas");t.width=64,t.height=32;let e=t.getContext("2d"),n=e.createLinearGradient(0,0,0,32);n.addColorStop(0,"#fff3dc"),n.addColorStop(.45,"#e9edff"),n.addColorStop(1,"#9dbb72"),e.fillStyle=n,e.fillRect(0,0,64,32);let i=new me(t);i.mapping=_r,i.colorSpace=Yt;let r=new Ds(this.renderer),o=r.fromEquirectangular(i);return r.dispose(),i.dispose(),o.texture}play(t,e=.22,n=!1){if(this.current===t)return;let i=this.actions[t];if(!i)return;let r=this.current?this.actions[this.current]:null;if(i.reset(),n&&r){let o=r.getClip().duration,a=i.getClip().duration;o>0&&(i.time=r.time%o/o*a)}i.fadeIn(r?e:0).play(),r&&r.fadeOut(e),this.current=t}bindUI(){this.canvas.addEventListener("pointerdown",n=>this.onPointerDown(n)),this.canvas.addEventListener("pointermove",n=>this.onPointerMove(n)),this.canvas.addEventListener("pointerup",n=>this.onPointerUp(n)),this.canvas.addEventListener("pointercancel",n=>this.onPointerUp(n)),this.onKeyDown=n=>{if(n.code==="ShiftLeft"||n.code==="ShiftRight"){this.keys.add(n.code);return}_p[n.code]&&(n.preventDefault(),this.keys.add(n.code),this.enterFreeMode())},this.onKeyUp=n=>{this.keys.delete(n.code)},this.onBlur=()=>this.keys.clear(),this.opts.klawiatura!==!1&&(addEventListener("keydown",this.onKeyDown),addEventListener("keyup",this.onKeyUp),addEventListener("blur",this.onBlur));let t=this.$(".scena3d-runmode");if(t){let n=()=>{t.textContent=Js==="tempo"?"bieg: tempo":"bieg: klip"};n(),t.addEventListener("click",()=>{Js=Js==="tempo"?"clip":"tempo",n(),this.current=null,this.mixer.stopAllAction(),this.play("idle",0)})}this.stickBase=this.$(".scena3d-stick"),this.stickKnob=this.$(".scena3d-knob");let e=(n,i)=>this.$(`[data-akcja="${n}"]`)?.addEventListener("click",i);e("stop",()=>{this.stopWalk(),this.setActive("stop")}),e("go",()=>{this.goToLantern(),this.setActive("go")}),e("replay",()=>{this.replayWalk(),this.setActive("replay")})}updateCameraBasis(){this.camRight.set(1,0,0).applyQuaternion(this.camera.quaternion),this.camRight.y=0,this.camRight.normalize(),this.camFwd.set(0,0,-1).applyQuaternion(this.camera.quaternion),this.camFwd.y=0,this.camFwd.normalize()}enterFreeMode(){this.mode!=="free"&&(this.mode="free",this.walking=!1,this.setActive(null)),this.sequence&&(this.sequence=null)}onPointerDown(t){this.kinoSkroc(),this.stick||(this.stick={id:t.pointerId,x0:t.clientX,y0:t.clientY,active:!1},this.canvas.setPointerCapture?.(t.pointerId))}onPointerMove(t){let e=this.stick;if(!e||e.id!==t.pointerId)return;let n=t.clientX-e.x0,i=t.clientY-e.y0,r=Math.hypot(n,i);if(!e.active&&r<11)return;e.active||(e.active=!0,this.enterFreeMode(),this.showStick(e.x0,e.y0));let o=46,a=Math.min(1,r/o),c=r?n/r:0,l=r?i/r:0;this.input.set(c*a,-l*a),this.inputSource="stick",this.moveKnob(c*a*o,l*a*o)}onPointerUp(t){let e=this.stick;!e||e.id!==t.pointerId||(this.stick=null,this.hideStick(),e.active?(this.input.set(0,0),this.inputSource=null,this.setRunFlag(!1)):this.tapAt(t.clientX,t.clientY))}showStick(t,e){this.stickBase&&(this.stickBase.style.left=`${t}px`,this.stickBase.style.top=`${e}px`,this.stickBase.classList.add("on"))}moveKnob(t,e){this.stickKnob&&(this.stickKnob.style.transform=`translate(-50%,-50%) translate(${t}px,${e}px)`)}hideStick(){this.stickBase?.classList.remove("on"),this.moveKnob(0,0)}setRunFlag(t){this.running!==t&&(this.running=t,this.stickBase?.classList.toggle("run",t))}readKeys(){let t=0,e=0;for(let n of this.keys){let i=_p[n];i&&(t+=i[0],e+=i[1])}if(t||e){let n=Math.hypot(t,e),i=this.keys.has("ShiftLeft")||this.keys.has("ShiftRight")?1:.55;return this.input.set(t/n*i,e/n*i),this.inputSource="keys",!0}return!1}bridgeLocal(t,e,n){return n.set(t,0,e).applyMatrix4(this.bridgeInv)}groundHeightAt(t,e){let n=this.formy?this.formy.h(t,e):0,i=this.bridgeLocal(t,e,this._blTmp||(this._blTmp=new M)),r=Math.abs(i.z);if(Math.abs(i.x)>bu+.2||r>Ja)return n;let o=Yw-.057*(Math.min(r,Su)/Su)**2,a=$e((Ja-r)/(Ja-Su),0,1),c=$e((bu+.2-Math.abs(i.x))/.3,0,1);return o*(a*a*(3-2*a)*c)}onBridge(t,e){let n=this.bridgeLocal(t,e,this._blTmp2||(this._blTmp2=new M));return Math.abs(n.x)<bu&&Math.abs(n.z)<Ja}canWalk(t,e){return this.canWalkN(this.planeta.normalna(t,e,this._v3))}canWalkN(t){let e=this.planeta.R;if(this.ograniczenieMapy){let o=this.planeta.zKuli(this._v1.copy(t).multiplyScalar(e));if(Math.hypot(o.x,o.z)>this.mapa.promienMapy)return!1}let n=this._v1.copy(t).multiplyScalar(e);for(let o of this.blockers){o.n||(o.n=this.planeta.naKule(o.x,o.z,0));let a=o.r+mp;if(n.distanceToSquared(o.n)<a*a)return!1}let i=1/0,r=this._v2;for(let o of this.rzeka3d)for(let a=0;a<o.length-1;a++){let c=o[a],l=o[a+1];r.subVectors(l,c);let h=r.lengthSq(),u=h>0?$e(this._v3.subVectors(n,c).dot(r)/h,0,1):0;this._v3.copy(c).addScaledVector(r,u),i=Math.min(i,n.distanceTo(this._v3))}if(i<this.mapa.rzeka.szerokosc+mp*.5){let o=this.planeta.zKuli(n);return this.onBridge(o.x,o.z)}return!0}calibrateFeet(t=56){let e=this.skinned,n=e.geometry.attributes.position,i=1/0;for(let c=0;c<n.count;c++)i=Math.min(i,n.getY(c));this.soleVerts=[];for(let c=0;c<n.count;c++)n.getY(c)<i+.02&&this.soleVerts.push(c);let r=new M,o=this.tilt.rotation.x;this.tilt.rotation.x=0,this.hero.position.set(0,0,0),this.hero.quaternion.identity(),this.clipY={};for(let[c,l]of Object.entries(this.actions)){this.mixer.stopAllAction(),l.reset(),l.timeScale=1,l.play(),this.tilt.rotation.x=c===ji?ja:0;let h=l.getClip().duration||1,u=1/0;for(let d=0;d<t;d++){this.mixer.setTime(d/t*h),this.hero.updateMatrixWorld(!0);for(let f of this.soleVerts)e.getVertexPosition(f,r).applyMatrix4(e.matrixWorld),r.y<u&&(u=r.y)}this.clipY[c]=-u}this.tilt.rotation.x=0;let a=this.actions[Zr];if(a){this.mixer.stopAllAction(),a.reset(),a.timeScale=1,a.play();let c=a.getClip().duration||1,l=h=>{this.tilt.rotation.x=h;let u=1/0;for(let d=0;d<t;d++){this.mixer.setTime(d/t*c),this.hero.updateMatrixWorld(!0);for(let f of this.soleVerts)e.getVertexPosition(f,r).applyMatrix4(e.matrixWorld),r.y<u&&(u=r.y)}return u};this.leanDip=Math.max(0,l(0)-l(Za))}else this.leanDip=0;return this.mixer.stopAllAction(),this.mixer.setTime(0),this.tilt.rotation.x=o,this.footOffset=this.clipY.idle??0,this.clipY}alignRunToWalk(){let t=this.actions[Zr],e=this.actions[ji];if(!t||!e)return null;let n=this.skinned.skeleton.bones.find(I=>I.name==="Hip");if(!n)return null;let i=this.tilt.rotation.x;this.hero.position.set(0,0,0),this.hero.quaternion.identity(),this.tilt.rotation.x=0;let r=new M,o=new M,a=new M,c=32,l=this.skinned.skeleton.bones,h=l.find(I=>I.name==="L_Thigh"),u=l.find(I=>I.name==="R_Thigh");if(!h||!u)return null;let d=(I,F=0)=>{this.mixer.stopAllAction(),I.reset(),I.timeScale=1,I.play(),this.tilt.rotation.x=F;let j=I.getClip().duration||1,B=new M,Q=0,W=0;for(let lt=0;lt<c;lt++){this.mixer.setTime(lt/c*j),this.hero.updateMatrixWorld(!0),n.getWorldPosition(r),B.add(r),h.getWorldPosition(o),u.getWorldPosition(a);let ot=a.x-o.x,vt=a.z-o.z,Xt=Math.hypot(ot,vt)||1;Q+=vt/Xt,W+=-ot/Xt}return{pos:B.multiplyScalar(1/c),yaw:Math.atan2(Q/c,W/c)}},f=new Ft,p=d(t,0),y=d(e,ja),m=p.yaw-y.yaw;for(;m>Math.PI;)m-=Math.PI*2;for(;m<-Math.PI;)m+=Math.PI*2;let g=p.pos.clone().sub(y.pos),v=new Ft;n.parent.getWorldQuaternion(v);let _=v.clone().invert(),w=new Ft().setFromAxisAngle(new M(0,1,0),m),C=_.clone().multiply(w).multiply(v),A=g.clone().divideScalar($a).applyQuaternion(_),E=e.getClip(),z=E.tracks.find(I=>I.name==="Hip.position");if(z)for(let I=0;I<z.times.length;I++)z.values[I*3]+=A.x,z.values[I*3+1]+=A.y,z.values[I*3+2]+=A.z;let N=E.tracks.find(I=>I.name==="Hip.quaternion");if(N)for(let I=0;I<N.times.length;I++)f.fromArray(N.values,I*4).premultiply(C).normalize(),f.toArray(N.values,I*4);e.reset();let x=d(e,ja),S=x.yaw-p.yaw;for(;S>Math.PI;)S-=Math.PI*2;for(;S<-Math.PI;)S+=Math.PI*2;this.mixer.stopAllAction(),this.mixer.setTime(0),this.tilt.rotation.x=i;let k=x.pos.clone().sub(p.pos);return{obrotPionowy:+(m*180/Math.PI).toFixed(1),srodekSwiat:[+g.x.toFixed(3),+g.y.toFixed(3),+g.z.toFixed(3)],resztkowyBlad:+(S*180/Math.PI).toFixed(2),resztkowySrodek:+k.length().toFixed(4)}}_uderzDrzewa(t,e,n,i){let r=this.blockers;if(!r||oi)return;let o=Math.hypot(n,i);if(!(o>1e-6))return;let a=this._dtGib||1/60,c=.95,l=13;for(let h of r){let u=h&&h.drzewo;if(!u)continue;let d=h.x-t,f=h.z-e,p=Math.hypot(d,f);if(p<1e-4||p>h.r+c||(n*d+i*f)/o<=0)continue;let y=u.userData.gib||(u.userData.gib={x:0,z:0,vx:0,vz:0}),m=Math.min(1,(h.r+c-p)/c),g=Math.min(1,o*60/3.2),v=h.skalaDrzewa||1,_=l*m*g/v*a;y.vx+=d/p*_,y.vz+=f/p*_}}_uderzKwiaty(t,e,n,i){let r=this.kwiaty;if(!r)return;let o=Math.hypot(n,i);if(!(o>1e-6))return;let a=this._dtGib||1/60,c=.78,l=130;for(let h of r.lista){let u=h.x-t,d=h.z-e,f=Math.hypot(u,d);if(f<1e-4||f>c||(n*u+i*d)/o<=0)continue;let p=(c-f)/c,y=Math.min(1,o*60/3.2),m=l*p*y*a;h.gib.vx+=u/f*m,h.gib.vz+=d/f*m}}_sprezyna(t,e,n,i,r,o,a){t.vx+=(-e*t.x-n*t.vx)*r,t.vz+=(-e*t.z-n*t.vz)*r,t.x+=t.vx*r,t.z+=t.vz*r,t.x>i?(t.x=i,t.vx*=-.2):t.x<-i&&(t.x=-i,t.vx*=-.2),t.z>i?(t.z=i,t.vz*=-.2):t.z<-i&&(t.z=-i,t.vz*=-.2),Math.abs(t.x)<o&&Math.abs(t.z)<o&&Math.abs(t.vx)<a&&Math.abs(t.vz)<a&&(t.x=t.z=t.vx=t.vz=0)}ustawZasiew(t){this.zasiewWlaczony=!!t,this._zasiewOstatnia=null,this._zasiewDroga=0}_zasiejZaLiskiem(){if(!this.hero||!this.kwiaty||!this.zasiewWlaczony)return;if(!this._zasiewOstatnia){this._zasiewOstatnia=this.hn.clone();return}let t=Math.acos($e(this.hn.dot(this._zasiewOstatnia),-1,1))*this.planeta.R;if(this._zasiewOstatnia.copy(this.hn),t>2||this._kino||this.sequence){this._zasiewDroga=0;return}if(t<1e-5||(this._zasiewDroga+=t,this._zasiewDroga<.7))return;this._zasiewDroga%=.7;let e=this.planeta.punktObok(this.hn,this.hf,-.55,this._zasiewN||(this._zasiewN=new M)),n=(this._zasiewBok||(this._zasiewBok=new M)).crossVectors(e,this.hf).normalize();this.planeta.punktObok(e,n,(this._zasiewStrona=!this._zasiewStrona)?.18:-.18,e);let i=this.planeta.zKuli((this._zasiewP||(this._zasiewP=new M)).copy(e).multiplyScalar(this.planeta.R));(!this.onBridge(i.x,i.z)||this.mapa.most.ukryty)&&this.kwiaty.posadz(i.x,i.z,oi)}_gibKwiaty(t){let e=this.kwiaty;if(!e)return;let n=!1;for(let i of e.lista){let r=i.gib;!r.x&&!r.z&&!r.vx&&!r.vz||(this._sprezyna(r,52,4.6,1.05,t,3e-4,.003),e.odswiez(i),n=!0)}n&&e.oznacz()}_gibDrzew(t){for(let e of this.blockers||[]){let n=e&&e.drzewo;if(!n)continue;let i=n.userData.gib;if(!i||!i.x&&!i.z&&!i.vx&&!i.vz)continue;let r=e.skalaDrzewa||1;this._sprezyna(i,40/r,4.6,.26/r,t,2e-4,.002),n.rotation.z=-i.x,n.rotation.x=i.z}}aktualizujHp(){let t=this.planeta.zKuli(this._v1.copy(this.hn).multiplyScalar(this.planeta.R));this.hp.x=t.x,this.hp.z=t.z}moveKula(t,e){let n=this.hp.x,i=this.hp.z,r=this._vm1||(this._vm1=new M),o=this._vm2||(this._vm2=new M),a=(f,p)=>(r.copy(this.hn),o.copy(f),this.planeta.przesunPoKuli(r,o,p),this.canWalkN(r)),c=()=>(this.hn.copy(r),Xe(this.hf,this.hn),this.aktualizujHp(),!0);{let f=this._zamiar||(this._zamiar={x:0,z:0,h:0});r.copy(this.hn),o.copy(t),this.planeta.przesunPoKuli(r,o,e);let p=this.planeta.zKuli(this._v1.copy(r).multiplyScalar(this.planeta.R),f);this._uderzDrzewa(n,i,p.x-n,p.z-i),this._uderzKwiaty(n,i,p.x-n,p.z-i)}if(!this.canWalkN(this.hn)||a(t,e))return c();let l=this.stycznaZeSwiata(this.camRight,this._vm3||(this._vm3=new M)),h=this.stycznaZeSwiata(this.camFwd,this._vm4||(this._vm4=new M)),u=t.dot(l),d=t.dot(h);return Math.abs(u)>.001&&a(l,e*u)||Math.abs(d)>.001&&a(h,e*d)?c():!1}stycznaZeSwiata(t,e){return this._qTmp.copy(this.swiat.quaternion).invert(),e.copy(t).applyQuaternion(this._qTmp),Xe(e,this.hn)}setLocomotion(t){if(this.moveSpeed=t,t<.05){this.play("idle",.28);return}let e=Js==="clip"&&!!this.actions[ji],n=this.current===ji;if(e&&(n?t>Gw:t>Vw)){let i=this.actions[ji];i.timeScale=$e(t/yp,.55,hp),this.play(ji,.26,!0)}else{let i=this.actions[Zr];i.timeScale=$e(t/gp,.6,hp),this.play(Zr,.24,!0)}}moveFree(t){let e=this.input.length(),n=this.mapa.latarnia.pos;if(e<Mu){this.holdTime=Math.max(0,this.holdTime-t*3),this.holdDir=null,this.setRunFlag(!1),this.setLocomotion(0);let y=this.planeta.odleglosc(this.hn,this.latarniaN);!this.celebrated&&y<2.4?(this.idleAtLantern+=t,this.idleAtLantern>.35&&this.startCelebration()):this.idleAtLantern=0;return}this.idleAtLantern=0;let i=$e((e-Mu)/(1-Mu),0,1),r=Ri*(.45+.55*i),o=Math.atan2(this.input.x,this.input.y);if(this.holdDir!==null){let y=o-this.holdDir;for(;y>Math.PI;)y-=Math.PI*2;for(;y<-Math.PI;)y+=Math.PI*2;Math.abs(y)>Ww&&(this.holdTime=0)}this.holdDir=o,i>=dp?this.holdTime=Math.min(fp+pp+.5,this.holdTime+t):this.holdTime=Math.max(0,this.holdTime-t*2);let a=$e((this.holdTime-fp)/pp,0,1),c=a*a*(3-2*a),l=Ri+(wu-Ri)*c,h=Math.max(r,i>=dp?l:0);this.setRunFlag(h>Ri*1.5);let u=this._dirTmp||(this._dirTmp=new M);u.copy(this.camRight).multiplyScalar(this.input.x/e).addScaledVector(this.camFwd,this.input.y/e).normalize();let d=this.stycznaZeSwiata(u,this._dirMap||(this._dirMap=new M)),f=this.moveKula(d,h*t);this.blockedFor=f?0:(this.blockedFor||0)+t,this.setLocomotion(this.blockedFor>.3?0:h),this.obrocKu(d,11,t);let p=this.planeta.odleglosc(this.hn,this.latarniaN);this.celebrated&&p>4&&(this.celebrated=!1)}obrocKu(t,e,n){let i=lu(this.hf,t,this.hn);return Hf(this.hf,this.hn,i*(1-Math.exp(-e*n))),Xe(this.hf,this.hn),i}stycznaDoMapy(t,e,n){let i=this.planeta.normalna(t,e,this._v2);return nn(this.hn,i,this.hf,n)}get heading(){let t=this._v3.copy(this.hf).applyQuaternion(this.swiat.quaternion);return Math.atan2(t.x,t.z)}set heading(t){}setActive(t){for(let e of this.$$(".scena3d-controls button"))e.classList.toggle("active",e.dataset.akcja===t)}tapAt(t,e){let n=this.canvas.getBoundingClientRect(),i=new rt((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);this.raycaster.setFromCamera(i,this.camera);let r=this.raycaster.intersectObjects((this.markers||[]).map(f=>f.hit),!1);if(r.length){let f=r[0].object.userData.marker;f.def.absorb?this.enterMarker(f,!0):this.touchMarker(f,!0);return}let o=this.raycaster.intersectObject(this.ziemia,!1);if(!o.length)return;let a=this.swiat.worldToLocal(o[0].point.clone()),c=this.planeta.zKuli(a),l=new M(c.x,0,c.z),{t:h,dist:u}=this.najblizszyPunktSciezki(l);if(u>4.5)return;this.mode="goto",this.input.set(0,0),this.heroT=this.najblizszyPunktSciezki(new M(this.hp.x,0,this.hp.z)).t,this.startWalk(h);let d=this.punktSciezki(h);this.planeta.ustaw(this.markerKotwica,d.x,d.z,this.groundHeightAt(d.x,d.z),0),this.markerPulse=1}touchMarker(t,e=!1){if(!(!t||!t.touch())){this.hint(t.def.toast),this.touched=(this.touched||[]).concat(t.id),this.emit("znak:dotkniety",{znak:t.id,etykieta:t.def.label,palcem:e});try{navigator.vibrate?.([14,40,20])}catch{}e&&!this.walking&&!this.sequence&&(this.play("happy",.12),this.sequence="happy",this.seqTimer=0)}}enterMarker(t,e=!1){if(!(!t||!t.startAbsorb(e))){this.hint(t.def.toast),this.touched=(this.touched||[]).concat(t.id),this.emit("minigra:start",{znak:t.id,etykieta:t.def.label,palcem:e,poDomknieciu:.95});try{navigator.vibrate?.([18,50,26])}catch{}this.input.lengthSq()<.02&&(this.moveSpeed||0)<.05&&!this.walking&&!this.sequence&&(this.play("happy",.12),this.sequence="happy",this.seqTimer=0)}}hint(t,e=2200){let n=this.$(".scena3d-hint span");n&&(this._hintBase||(this._hintBase=n.textContent),n.textContent=t,clearTimeout(this._hintT),this._hintT=setTimeout(()=>{n.textContent=this._hintBase},e))}startWalk(t){this.targetT=t,this.walking=Math.abs(t-this.heroT)>.05,this.sequence=null,this.walking&&this.play("walk")}stopWalk(){this.walking=!1,this.sequence=null,this.input.set(0,0),this.inputSource=null,this.holdTime=0,this.holdDir=null,this.setRunFlag(!1),this.keys.clear(),this.hideStick(),this.play("idle")}goToLantern(){this.celebrated=!1,this.mode="goto",this.input.set(0,0),this.heroT=this.najblizszyPunktSciezki(new M(this.hp.x,0,this.hp.z)).t,this.startWalk(this.tLatarni)}replayWalk(){this.celebrated=!1,this.mode="goto",this.input.set(0,0),this.placeHero(0,!0),this.startWalk(this.tLatarni)}placeHero(t,e=!1){this.heroT=t;let n=this.punktSciezki(t),i=this.mapa.start;i?.pos&&t===0&&(n=new M(i.pos[0],0,i.pos[1])),this.planeta.normalna(n.x,n.z,this.hn),this.aktualizujHp(),this.groundY=this.groundHeightAt(n.x,n.z),this.lean=0,this.tilt&&(this.tilt.rotation.x=0),this.heroLift=this.groundY+(this.clipY?.idle??this.footOffset);let r=this.punktSciezki(Math.min(this.dlSciezki,t+.3)),o=i?.obrot!=null&&t===0?i.obrot:Math.atan2(r.x-n.x,r.z-n.z);this.hf.set(Math.sin(o),0,Math.cos(o)).applyQuaternion(this.planeta.ramka(n.x,n.z,this._qTmp)),Xe(this.hf,this.hn),e&&(this.planeta.obrotPodPunkt(this.hp.x,this.hp.z,this.swiat.quaternion),this.camPos.copy(this.camTarget).add(this.camDir),this.camera.position.copy(this.camPos),this.camera.lookAt(this.camTarget)),this.syncHero()}syncHero(){this.hero&&this.planeta.ustawN(this.hero,this.hn,this.hf,this.heroLift)}startCelebration(){this.emit("latarnia:reakcja",{faza:"obrot"}),this.celebrated=!0,this.walking=!1,this.sequence="turning",this.seqTimer=0,this.play("turn",.15)}spawnSparkles(){let t=new ze(.05,6,5),e=new re({color:16771496,transparent:!0});for(let n=0;n<10;n++){let i=new Lt(t,e.clone());i.position.set(-.6,1.7,0);let r=n/10*Math.PI*2;i.userData={vel:new M(Math.cos(r)*.9,1.4+Math.random(),Math.sin(r)*.9),life:1},this.sparkleGrupa.add(i),this.sparkles.push(i)}}tick(){let t=Math.min(.05,this.clock.getDelta()),e=Ri;if(this._dtGib=t,this._gibDrzew(t),this._gibKwiaty(t),this.kwiaty?.aktualizujZasiew(t,oi),oi||this.nurtTik(t),this.stick?.active||(this.keys.size?(this.readKeys(),this.enterFreeMode()):this.inputSource==="keys"&&(this.input.set(0,0),this.inputSource=null)),this.mode==="free"&&!this.sequence&&this.moveFree(t),!this.walking&&this.mode!=="free"&&(this.moveSpeed=0),this.walking){let f=Math.sign(this.targetT-this.heroT);this.heroT+=f*e*t,(f>0&&this.heroT>=this.targetT||f<0&&this.heroT<=this.targetT)&&(this.heroT=this.targetT,this.walking=!1,!this.celebrated&&Math.abs(this.heroT-this.tLatarni)<.6?this.startCelebration():this.play("idle"),this.emit("bohater:doszedl",{x:+this.hp.x.toFixed(2),z:+this.hp.z.toFixed(2),latarnia:Math.abs(this.heroT-this.tLatarni)<.6})),this.moveSpeed=e;let p=this.punktSciezki(this.heroT);this.planeta.normalna(p.x,p.z,this.hn),Xe(this.hf,this.hn),this.aktualizujHp();let y=this.punktSciezki($e(this.heroT+.35*(f||1),0,this.dlSciezki));if(y.distanceToSquared(p)>1e-6){let m=this.stycznaDoMapy(y.x,y.z,this._v1);f<0&&m.negate(),this.obrocKu(m,10,t)}}if(this.sequence==="turning"){this.seqTimer+=t;let f=nn(this.hn,this.latarniaN,this.hf,this._v1),p=this.obrocKu(f,6,t);this.seqTimer>.5&&Math.abs(p)<.08&&(this.sequence="happy",this.seqTimer=0,this.play("happy",.12),this.spawnSparkles())}else this.sequence==="happy"?(this.seqTimer+=t,this.seqTimer>1.55&&(this.sequence=null,this.idleAtLantern=0,this.play("idle",.3))):this.sequence==="wspinaczka"&&this._wspinaczkaKlatka(t);let n;this.sequence||!this.moveSpeed?n=0:this.current===ji?n=ja:n=Za*$e((this.moveSpeed-Ri*.8)/(wu-Ri*.8),0,1),this.lean=Au(this.lean||0,n,6,t),this.tilt&&(this.tilt.rotation.x=this.lean);let i=this.groundHeightAt(this.hp.x,this.hp.z);this.groundY=Au(this.groundY,i,9,t);let r=this.clipY?.[this.current]??this.footOffset;this.footOffset=Au(this.footOffset,r,12,t);let o=(this.leanDip||0)*Math.max(0,(this.lean||0)/Za);this.heroLift=this.groundY+this.footOffset+o+(this._wspDodatek||0),this.syncHero(),this._zasiejZaLiskiem();let a=this._v1.copy(this.hn).applyQuaternion(this.swiat.quaternion);this._qTmp.setFromUnitVectors(a,this._v2.set(0,1,0)),this.obrotCel.copy(this._qTmp).multiply(this.swiat.quaternion);let c=oi?30:Jw;if(this.swiat.quaternion.slerp(this.obrotCel,1-Math.exp(-c*t)),this.korektaPolnocy(t),this.mapa.cienie&&this.hero&&!this._cienieBohatera&&(this._cienieBohatera=!0,this.hero.traverse(f=>{(f.isMesh||f.isSkinnedMesh)&&(f.castShadow=!0)}),this.heroShadow&&(this.heroShadow.visible=!1)),this.chmury&&this.chmury.aktualizuj(t,this.doba?.stan||null,this.moveSpeed||0),this.doba){let f=this.doba.aktualizuj(this.hn,this.swiat.quaternion,t);f!==this._pora&&(this._pora=f,this.emit("doba:pora",{pora:f,...this.doba.stan}))}this.camPos.copy(this.camTarget).add(this.camDir),this._kinoKlatka(t),this.camera.position.copy(this.camPos),this.camera.lookAt(this._kc.x,this._kc.y,this._kc.z);let l=oi?.3:1,h=this.doba?.stan||null;for(let f of this.markers||[]){f.def.pora&&h&&f.ustawAktywny(f.def.pora==="noc"?h.noc>.35:h.dzien>.35);let p=this.planeta.odleglosc(this.hn,f.n);if(f.update(t,l,p),f.aktywny!==!1){if(f.def.reagujeNaSwiatlo&&this.swiatlo){let y=this.swiatlo.ile,m=Math.max(0,1-p/7),g=y>=3?1:.35+.65*(.5+.5*Math.sin(this._czasGry*2.4)),v=y/3*g*(.35+.65*m);f.light&&(f.light.intensity=v*3.2),f.halo?.material&&(f.halo.material.opacity=v*.55),y===0&&(f.light&&(f.light.intensity=0),f.halo?.material&&(f.halo.material.opacity=0))}if(p<(f.def.zasieg??1)&&!this._kino){if(f.def.zbiera==="swiatlo"){if(this.swiatlo.komplet)continue;f.state==="idle"&&this.swiatlo.dodaj()&&this.emit("swiatlo:zebrane",{ile:this.swiatlo.ile,komplet:this.swiatlo.komplet})}f.def.absorb?this.enterMarker(f):this.touchMarker(f)}}}if(this.swiatlo&&this.swiatlo.aktualizuj(t),this.kropla&&this.kropla.aktualizuj(t),this._fasolaTik(t),this.dymki&&this.dymki.aktualizuj(t,this.hn,this.hf,this.doba?.stan||null),this._czasGry=(this._czasGry||0)+t,this.heroShadowKotwica){let f=this.groundHeightAt(this.hp.x,this.hp.z);this.planeta.ustawN(this.heroShadowKotwica,this.planeta.punktObok(this.hn,this.hf,.18,this._v1),this.hf,f);let p=Math.max(0,this.heroLift-f-.02),y=1+$e(p,0,.35)*.7;this.heroShadow.scale.set(y,y,1),this.heroShadow.material.opacity=$e(1-p*1.1,.5,1)}if(this.markerPulse>0){this.markerPulse=Math.max(0,this.markerPulse-t*1.4),this.marker.material.opacity=this.markerPulse*.9;let f=1+(1-this.markerPulse)*.7;this.marker.scale.set(f,f,1)}for(let f=this.sparkles.length-1;f>=0;f--){let p=this.sparkles[f];p.userData.life-=t*.9,p.userData.vel.y-=t*1.6,p.position.addScaledVector(p.userData.vel,t),p.material.opacity=Math.max(0,p.userData.life),p.userData.life<=0&&(this.sparkleGrupa.remove(p),this.sparkles.splice(f,1))}let u=this.lantern.userData,d=1+Math.sin(performance.now()*.003)*.12;u.light.intensity=9*d,u.glassMat.emissiveIntensity=1.1*d,this.mixer?.update(t),this.renderer.render(this.scene,this.camera)}korektaPolnocy(t){let n=Math.hypot(this.hp.x,this.hp.z)/this.planeta.R,i=$e((2.4-n)/.8,0,1);if(i<=0)return;let r=this._v1.set(1,0,0).applyQuaternion(this.planeta.ramka(this.hp.x,this.hp.z,this._qTmp)).applyQuaternion(this.swiat.quaternion),o=Math.atan2(r.z,r.x);if(Math.abs(o)<1e-4)return;let a=(this.moveSpeed||0)>.05?$w:Qw,c=o*(1-Math.exp(-a*i*t));this._qTmp.setFromAxisAngle(this._v2.set(0,1,0),c),this.swiat.quaternion.premultiply(this._qTmp)}_fasolaTik(t){this.oczko&&this.oczko.tik(t);let e=this.fasola;if(!e)return;let n=this.planeta.odleglosc(this.hn,e.n);if(e.update(t,n,!!this.kropla?.ile),!(this._kino||this.sequence)){if(this.oczko&&this.kropla&&!this.kropla.ile&&this.planeta.odleglosc(this.hn,this.oczko.n)<this.oczko.promien*.85){this.kropla.dodaj(),this.hint("Kropla wody!"),this.emit("woda:nabrana",{});try{navigator.vibrate?.([12,30,12])}catch{}}if(n<(e.def.zasieg??1.9))if(this.kropla?.ile&&!e.gotowa&&e.podlej()){this.kropla.oddaj(),this.hint(e.etap+1>=e.ostatni?"Fasola si\u0119ga chmur!":"Fasola ro\u015Bnie!"),this.emit("fasola:podlana",{etap:e.etap+1,etapow:e.ostatni}),this._wspUzbrojona=!1;try{navigator.vibrate?.([18,40,18])}catch{}this.input.lengthSq()<.02&&(this.moveSpeed||0)<.05&&!this.walking&&(this.play("happy",.12),this.sequence="happy",this.seqTimer=0)}else e.gotowa&&n<1.1&&this._wspUzbrojona&&this._wspinaczkaStart();else n>2.4&&(this._wspUzbrojona=!0)}}_wspinaczkaStart(){let t=this.fasola;this.stopWalk(),this.mode="free",this.sequence="wspinaczka",this.seqTimer=0,this._wsp={kat0:0},this._wspDodatek=0;let e=nn(t.n,this.hn,this.hf,this._v1),n=this._v2.set(1,0,0).applyQuaternion(this.planeta.ramka(t.def.pos[0],t.def.pos[1],this._qTmp));Xe(n,t.n);let r=lu(n,e,t.n)-t.sciezka(0).kat;r=Math.atan2(Math.sin(r),Math.cos(r)),this._wsp.dk=r,this.play("run",.15),this.emit("fasola:wspinaczka",{wysokosc:t.wysokosc,dalej:t.def.dalej||null})}_wspinaczkaKlatka(t){let e=this.fasola,n=this._wsp;if(!e||!n){this.sequence=null;return}this.seqTimer+=t;let i=Math.min(1,this.seqTimer/js.czasWspinaczki),r=i*i*(3-2*i),o=e.sciezka(r),a=o.kat+n.dk*(1-Math.min(1,r/.12)),c=this.planeta.ramka(e.def.pos[0],e.def.pos[1],this._qTmp),l=this._v1.set(Math.cos(a),0,Math.sin(a)).applyQuaternion(c);Xe(l,e.n);let h=this.planeta.punktObok(e.n,l,o.r,this._v2),u=this._v3.crossVectors(l,e.n).normalize();if(this.hn.copy(h),this.hf.copy(u),Xe(this.hf,this.hn),this.aktualizujHp(),this._wspDodatek=o.h,i>=1){this.sequence=null,this.play("happy",.2);let d=e.def.dalej||null;this.emit("swiat:dalej",{cel:d,z:"fasola"}),this._wspDodatek=0,this._wsp=null,this._wspUzbrojona=!1}}pauza(){this.paused||this.destroyed||(this.paused=!0,this.renderer.setAnimationLoop(null),this.emit("pauza"))}wznow(){!this.paused||this.destroyed||(this.paused=!1,this.clock.getDelta(),this.renderer.setAnimationLoop(()=>this.tick()),this.emit("wznowienie"))}ustawBohatera(t,e){return this.hero?(this._zasiewOstatnia=null,this._zasiewDroga=0,this.stopWalk(),this.mode="free",this.planeta.normalna(t,e,this.hn),Xe(this.hf,this.hn),this.aktualizujHp(),this.groundY=this.groundHeightAt(t,e),this.heroLift=this.groundY+(this.clipY?.[this.current]??0),this.syncHero(),!0):!1}ustawSpokojnyRuch(t){oi=!!t}ustawPowrotZnaku(t,e){let n=(this.markers||[]).find(i=>i.id===t);return n?(n.def.respawn=e===!1?1/0:Number(e),!0):!1}kino(t,e){if(!this.hero||oi)return!1;let n={wejscie:{trzym:1.9,powrot:1.5,kadr:1.7,luk:1.45,el:.2},bohater:{trzym:.9,powrot:1.1,kadr:2.6,luk:.8,el:.32},blysk:{trzym:.45,powrot:.75,kadr:3.4,luk:.45,el:.45}},i=n[t]||n.bohater;if(e){i=Object.assign({},i);for(let h in e)e[h]!=null&&(i[h]=e[h])}let r=this.hero.getWorldPosition(new M),o=new Ee().setFromObject(this.hero),a=Math.min(2.2,Math.max(.4,(o.max.y-r.y)*.86)),c=Math.max(.001,this.camera.right-this.camera.left),l=this.heading||0;return this._kino={faza:"trzym",t:0,trzymDl:i.trzym,powrotDl:i.powrot,gy:a,zoom:Math.max(1.05,c/(i.kadr||1.7)),az0:l-i.luk*.38,az1:l+i.luk*.62,el:i.el,br:this.camRight.clone(),bf:this.camFwd.clone()},this.mode="free",this.walking=!1,this.emit("kino",{ujecie:t}),!0}kinoSkroc(){let t=this._kino;return!t||t.faza!=="trzym"?!1:(t.pl=Math.min(1,t.t/Math.max(.001,t.trzymDl)),t.faza="powrot",t.t=0,t.powrotDl=.45,!0)}_kinoWejscie(){try{let t="ewolucja.kino.wejscie";if(sessionStorage.getItem(t))return;sessionStorage.setItem(t,"1")}catch{}this.kino("wejscie")}_kinoKlatka(t){this._kc||(this._kc=new M),this._kcT||(this._kcT=new M),this._kc.set(this.camTarget.x,this.camTarget.y+.8,this.camTarget.z);let e=this._kino;if(!e||!this.hero){this.camera.zoom!==1&&(this.camera.zoom=1,this.camera.updateProjectionMatrix());return}e.t+=t;let n,i;if(e.faza==="trzym")i=Math.min(1,e.t/Math.max(.001,e.trzymDl)),n=1,e.t>=e.trzymDl&&(e.faza="powrot",e.t=0);else{i=e.pl!=null?e.pl:1;let h=Math.min(1,e.t/Math.max(.001,e.powrotDl));if(n=1-h*h*(3-2*h),e.t>=e.powrotDl){this._kino=null,this.camRight.copy(e.br),this.camFwd.copy(e.bf),this.camera.zoom!==1&&(this.camera.zoom=1,this.camera.updateProjectionMatrix());return}}let r=i*i*(3-2*i),o=e.az0+(e.az1-e.az0)*r,a=e.el,c=this.hero.getWorldPosition(this._kcH||(this._kcH=new M));this._kcT.set(c.x,c.y+e.gy,c.z),this._kc.lerp(this._kcT,n),this._kcT.set(Math.sin(o)*Math.cos(a),Math.sin(a),Math.cos(o)*Math.cos(a)).multiplyScalar(26).add(this._kc),this.camPos.lerp(this._kcT,n);let l=1+(e.zoom-1)*n;Math.abs(this.camera.zoom-l)>1e-4&&(this.camera.zoom=l,this.camera.updateProjectionMatrix())}pokazZnak(t){let e=(this.markers||[]).find(n=>n.id===t);return!e||e.state!=="gone"?!1:(e.state="appear",e.phase=0,e.setVisible(!0),!0)}schowajZnak(t){let e=(this.markers||[]).find(n=>n.id===t);return e?e.startAbsorb(!0):!1}stan(){return{gotowa:!!this.hero,pauza:this.paused,animacja:this.current,predkosc:+(this.moveSpeed||0).toFixed(3),zasiew:{wlaczony:this.zasiewWlaczony,...this.kwiaty?.stanZasiewu()},fasola:this.fasola?{etap:this.fasola.etap,etapow:this.fasola.ostatni,gotowa:this.fasola.gotowa,kropla:!!this.kropla?.ile}:null,bohater:this.hero?{x:+this.hp.x.toFixed(2),z:+this.hp.z.toFixed(2)}:null,znaki:(this.markers||[]).map(t=>({id:t.id,stan:t.state,dotkniecia:t.touches}))}}zniszcz(){this.destroyed||(this.destroyed=!0,this.renderer.setAnimationLoop(null),removeEventListener("resize",this.onWinResize),this.onKeyDown&&(removeEventListener("keydown",this.onKeyDown),removeEventListener("keyup",this.onKeyUp),removeEventListener("blur",this.onBlur)),this.ro?.disconnect(),this.scene.traverse(t=>{t.geometry?.dispose?.();let e=t.material?Array.isArray(t.material)?t.material:[t.material]:[];for(let n of e){for(let i of["map","emissiveMap","normalMap","roughnessMap","metalnessMap"])n[i]?.dispose?.();n.dispose?.()}}),this.mixer?.stopAllAction(),this.renderer.dispose(),this.listeners.clear(),this.emit("zniszczona"))}resize(){if(this.destroyed)return;let t=this.host.getBoundingClientRect(),e=Math.max(1,Math.round(t.width||innerWidth)),n=Math.max(1,Math.round(t.height||innerHeight));this.renderer.setSize(e,n);let i=e/n,r=Number(globalThis.SCENA3D_ZOOM)||Number(this.mapa?.zoom)||tM,o=i>=1,a=o?14:8.4,c=this.planeta?.R||8,l=Number(globalThis.SCENA3D_KAMERA_PODNIESIENIE)||(o?Number(globalThis.SCENA3D_KAMERA_PODNIESIENIE_POZIOM)||c*(this.mapa?.dolnyDok===!1?rM:sM):this.mapa?.kameraPodniesienie??c*xp);this.camTarget&&Math.abs(this.camTarget.y-(c+l))>1e-6&&(this.camTarget.y=c+l,this.camPos&&(this.camPos.copy(this.camTarget).add(this.camDir),this.camera.position.copy(this.camPos),this.camera.lookAt(this.camTarget)));let u=Math.max(.5,(o?nM:eM)*c-l*iM),d=a/(i*2*u),f=Math.max(.3,Math.min(r,d)),p=a/f,y=p/i;this.camera.left=-p/2,this.camera.right=p/2,this.camera.top=y/2,this.camera.bottom=-y/2,this.camera.updateProjectionMatrix(),this.hero&&this.updateCameraBasis()}};var lM=`
.scena3d-root { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: #243147; font-family: "Nunito", ui-rounded, "Segoe UI", system-ui, sans-serif;
  -webkit-tap-highlight-color: transparent; touch-action: none; }
.scena3d-root * { box-sizing: border-box; }
.scena3d-root canvas { display: block; width: 100%; height: 100%; touch-action: none; }
.scena3d-loading { position: absolute; inset: 0; display: grid; place-items: center;
  color: #fff2cf; font-weight: 800; font-size: 18px; letter-spacing: .5px; }
.scena3d-hint { position: absolute; top: calc(env(safe-area-inset-top, 0px) + 14px); left: 0; right: 0;
  text-align: center; pointer-events: none; }
.scena3d-hint span { background: rgba(20,28,46,.75); color: #fff2cf; padding: 9px 18px;
  border-radius: 999px; font-weight: 800; font-size: 15px;
  box-shadow: inset 0 0 0 1.5px rgba(255,242,207,.25); }
/* wirtualny joystick \u2014 pojawia si\u0119 pod palcem */
.scena3d-stick { position: absolute; width: 128px; height: 128px; margin: -64px 0 0 -64px;
  border-radius: 50%; pointer-events: none; opacity: 0; transition: opacity .14s ease;
  background: radial-gradient(circle, rgba(255,242,207,.16), rgba(255,242,207,.05) 60%, transparent 70%);
  box-shadow: inset 0 0 0 2.5px rgba(255,242,207,.45); z-index: 5; }
.scena3d-stick.on { opacity: 1; }
.scena3d-stick.run { box-shadow: inset 0 0 0 3px rgba(255,216,115,.95), 0 0 22px rgba(255,216,115,.45); }
.scena3d-stick.run .scena3d-knob { background: radial-gradient(circle at 40% 35%, #fffaf0, #ffc247);
  box-shadow: 0 4px 14px rgba(0,0,0,.45), inset 0 0 0 2px rgba(255,255,255,.65); }
.scena3d-knob { position: absolute; left: 50%; top: 50%; width: 54px; height: 54px;
  border-radius: 50%; transform: translate(-50%,-50%);
  background: radial-gradient(circle at 40% 35%, #fff8e6, #ffd873);
  box-shadow: 0 4px 12px rgba(0,0,0,.45), inset 0 0 0 2px rgba(255,255,255,.5); }
.scena3d-stickhint { position: absolute; left: 50%; transform: translateX(-50%);
  bottom: calc(env(safe-area-inset-bottom, 0px) + 92px);
  color: #fff2cf; font-size: 12.5px; font-weight: 700; opacity: .78; text-align: center;
  pointer-events: none; text-shadow: 0 2px 8px rgba(0,0,0,.6); max-width: 92%; }
.scena3d-runmode { position: absolute; right: 12px; top: calc(env(safe-area-inset-top, 0px) + 58px);
  min-height: 44px; padding: 0 16px; border: 0; border-radius: 999px;
  font: inherit; font-weight: 800; font-size: 13.5px; color: #fff2cf;
  background: rgba(20,28,46,.78); box-shadow: inset 0 0 0 1.5px rgba(255,242,207,.3);
  cursor: pointer; z-index: 6; }
.scena3d-runmode:active { transform: translateY(2px); }
.scena3d-controls { position: absolute; left: 0; right: 0;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 14px);
  display: flex; gap: 10px; justify-content: center; padding: 0 14px; }
.scena3d-controls button { min-height: 60px; min-width: 96px; padding: 0 18px; border: 0;
  border-radius: 999px; font: inherit; font-weight: 900; font-size: 16px; color: #2a2415;
  background: linear-gradient(180deg, #fff2cf, #ffd873);
  box-shadow: 0 7px 0 #c9962f, 0 12px 22px rgba(0,0,0,.35); cursor: pointer;
  transition: transform .1s ease, box-shadow .1s ease; }
.scena3d-controls button:active { transform: translateY(5px); box-shadow: 0 2px 0 #c9962f; }
.scena3d-controls button.active { background: linear-gradient(180deg, #d9fff2, #6fe0c0);
  box-shadow: 0 7px 0 #2f9d86, 0 12px 22px rgba(0,0,0,.35); }
/* tryb bez panelu deweloperskiego (publikacja dla dzieci) */
.scena3d-root.bez-panelu .scena3d-runmode,
.scena3d-root.bez-panelu .scena3d-controls,
.scena3d-root.bez-panelu .scena3d-stickhint { display: none; }
@media (prefers-reduced-motion: reduce) {
  .scena3d-controls button, .scena3d-stick { transition: none; }
}
`;function wp({tekstLadowania:s="\u0141adowanie bohatera\u2026",tekstPodpowiedzi:t="Przesu\u0144 palcem, by i\u015B\u0107 w dowoln\u0105 stron\u0119"}={}){return`
<canvas class="scena3d-canvas"></canvas>
<div class="scena3d-loading">${s}</div>
<div class="scena3d-hint"><span>${t}</span></div>
<button class="scena3d-runmode" type="button">bieg: tempo</button>
<div class="scena3d-stick"><div class="scena3d-knob"></div></div>
<div class="scena3d-stickhint">przeci\u0105gnij = kierunek &nbsp;\xB7&nbsp; trzymaj d\u0142u\u017Cej = bieg</div>
<div class="scena3d-controls">
  <button type="button" data-akcja="stop">St\xF3j</button>
  <button type="button" data-akcja="go">Id\u017A</button>
  <button type="button" data-akcja="replay">Powt\xF3rz ch\xF3d</button>
</div>`}var vp=!1;function Mp(s){if(vp||s.querySelector("style[data-scena3d]"))return;let t=s.createElement("style");t.dataset.scena3d="1",t.textContent=lM,s.head.appendChild(t),vp=!0}var bp=["gotowa","minigra:start","znak:dotkniety","bohater:doszedl","latarnia:reakcja","doba:pora","swiatlo:zebrane","woda:nabrana","fasola:podlana","fasola:wspinaczka","swiat:dalej","pauza","wznowienie","zniszczona","blad"];async function tc(s={}){let t=typeof s.kontener=="string"?document.querySelector(s.kontener):s.kontener||document.body;if(!t)throw new Error("Scena 3D: nie znalaz\u0142em kontenera");let e=t.ownerDocument||document;Mp(e);let n=e.createElement("div");n.className="scena3d-root"+(s.panel===!1?" bez-panelu":""),n.innerHTML=wp(s.teksty||{}),t.appendChild(n);let i=new Qa(n,{zasoby:s.zasoby,spokojnyRuch:s.spokojnyRuch,klawiatura:s.klawiatura,onEvent:s.onZdarzenie}),r={element:n,on:(o,a)=>i.on(o,a),off:(o,a)=>i.off(o,a),pauza:()=>i.pauza(),wznow:()=>i.wznow(),ustawBohatera:(o,a)=>i.ustawBohatera(o,a),ustawSpokojnyRuch:o=>i.ustawSpokojnyRuch(o),ustawZasiew:o=>i.ustawZasiew(o),ustawPowrotZnaku:(o,a)=>i.ustawPowrotZnaku(o,a),pokazZnak:o=>i.pokazZnak(o),kino:(o,a)=>i.kino(o,a),kinoSkroc:()=>i.kinoSkroc(),stan:()=>i.stan(),zniszcz:()=>{i.zniszcz(),n.remove()},_app:i};try{globalThis.__SCENA=r}catch{}try{await i.gotowa}catch(o){console.error("Scena 3D: nie uda\u0142o si\u0119 wczyta\u0107 modeli",o),r.blad=String(o?.message||o)}return r}function Tu(s="ewolucja-scena-3d"){if(typeof customElements>"u"||customElements.get(s))return;class t extends HTMLElement{async connectedCallback(){if(!this._api){this.style.display=this.style.display||"block",this._api=await tc({kontener:this,zasoby:this.getAttribute("zasoby")||void 0,panel:!this.hasAttribute("bez-panelu"),klawiatura:!this.hasAttribute("bez-klawiatury"),spokojnyRuch:this.hasAttribute("spokojny-ruch")?!0:void 0});for(let n of["pauza","wznow","ustawBohatera","ustawSpokojnyRuch","ustawZasiew","ustawPowrotZnaku","pokazZnak","stan"])this[n]=(...i)=>this._api[n](...i);this.dispatchEvent(new CustomEvent("scena3d:zamontowana",{bubbles:!0}))}}disconnectedCallback(){this._api?.zniszcz(),this._api=null}}customElements.define(s,t)}function Sp(s,t="*"){if(typeof window>"u"||window.parent===window)return()=>{};let e=s.on("*",i=>{window.parent.postMessage({scena3d:"zdarzenie",nazwa:i.nazwa,dane:i},t)}),n=i=>{let r=i.data;if(!r||r.scena3d!=="komenda"||typeof s[r.metoda]!="function")return;let o=s[r.metoda](...r.argumenty||[]);window.parent.postMessage({scena3d:"odpowiedz",metoda:r.metoda,wynik:o},t)};return addEventListener("message",n),window.parent.postMessage({scena3d:"gotowa"},t),()=>{e(),removeEventListener("message",n)}}Tu();var hM=document.getElementById("scena-3d")||document.body,Ap=new URLSearchParams(location.search),uM=tc({kontener:hM,zasoby:globalThis.__SCENA3D_ZASOBY,panel:Ap.get("panel")!=="0",spokojnyRuch:Ap.get("spokojnie")==="1"?!0:void 0}).then(s=>(Sp(s),s.on("swiat:dalej",({cel:t})=>{if(!t)return;let e=new URL(location.href);e.searchParams.set("mapa",t),setTimeout(()=>location.assign(e.toString()),900)}),globalThis.EwolucjaScena3D.scena=s,s));globalThis.EwolucjaScena3D={gotowa:uM,utworzScena3D:tc,zarejestrujElement:Tu,ZDARZENIA:bp};
