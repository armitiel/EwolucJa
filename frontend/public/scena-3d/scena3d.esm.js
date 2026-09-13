/* EwolucJA — scena 3D (planeta). Źródła: frontend/scena-3d-src/. NIE EDYTOWAĆ RĘCZNIE. */
globalThis.SCENA3D_POSTACIE=globalThis.SCENA3D_POSTACIE||{adventurer:{plik:"adventurer",klipy:{NlaTrack:"walk","NlaTrack.001":"run","NlaTrack.002":"idle","NlaTrack.003":"happy"},tempo:{}},fox:{plik:"fox",klipy:{NlaTrack:"run","NlaTrack.001":"walk","NlaTrack.002":"idle","NlaTrack.003":"happy"},tempo:{run:1.29},wyglad:{tint:.85,env:.38}}};globalThis.__SCENA3D_POSTAC=function(){let s=globalThis.SCENA3D_POSTAC||"adventurer";return globalThis.SCENA3D_POSTACIE[s]||{plik:s,klipy:null,tempo:{}}};function Eu(){return globalThis.__SCENA3D_POSTAC()}var rh="169";var vp=0,Ru=1,Mp=2;var Kd=1,oh=2,Xn=3,kn=0,Be=1,de=2,gi=0,Ms=1,zn=2,Cu=3,ko=4,wp=5,Ni=100,bp=101,Sp=102,Ap=103,Tp=104,Ep=200,Rp=201,Cp=202,zp=203,Nc=204,Uc=205,Pp=206,Ip=207,kp=208,Lp=209,Dp=210,Np=211,Up=212,Op=213,Fp=214,Oc=0,Fc=1,Bc=2,As=3,Hc=4,Vc=5,Gc=6,Wc=7,ah=0,Bp=1,Hp=2,_i=0,Vp=1,Gp=2,Wp=3,ch=4,Xp=5,qp=6,Kp=7,zu="attached",Yp="detached",Yd=300,Ts=301,Es=302,gr=303,Xc=304,ga=306,Ln=1e3,Kn=1001,_r=1002,Fe=1003,lh=1004;var gs=1005;var Je=1006,lr=1007;var In=1008;var Zn=1009,Zd=1010,jd=1011,yr=1012,hh=1013,Fi=1014,Cn=1015,Ir=1016,uh=1017,dh=1018,Rs=1020,$d=35902,Jd=1021,Qd=1022,gn=1023,tf=1024,ef=1025,ws=1026,Cs=1027,fh=1028,ph=1029,nf=1030,mh=1031;var gh=1033,Eo=33776,Ro=33777,Co=33778,zo=33779,qc=35840,Kc=35841,Yc=35842,Zc=35843,jc=36196,$c=37492,Jc=37496,Qc=37808,tl=37809,el=37810,nl=37811,il=37812,sl=37813,rl=37814,ol=37815,al=37816,cl=37817,ll=37818,hl=37819,ul=37820,dl=37821,Po=36492,fl=36494,pl=36495,sf=36283,ml=36284,gl=36285,_l=36286,_h=2200,Zp=2201,jp=2202,zs=2300,Ps=2301,Qa=2302,_s=2400,ys=2401,Lo=2402,yh=2500,rf=2501,of=0,_a=1,kr=2,$p=3200,Jp=3201;var xh=0,Qp=1,fi="",qt="srgb",Ie="srgb-linear",vh="display-p3",ya="display-p3-linear",Do="linear",ue="srgb",No="rec709",Uo="p3";var $i=7680;var Pu=519,tm=512,em=513,nm=514,af=515,im=516,sm=517,rm=518,om=519,yl=35044,cf=35048;var Iu="300 es",Yn=2e3,Oo=2001,jn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let i=this._listeners[t];if(i!==void 0){let r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}},Ue=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ku=1234567,hr=Math.PI/180,Is=180/Math.PI;function _n(){let s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ue[s&255]+Ue[s>>8&255]+Ue[s>>16&255]+Ue[s>>24&255]+"-"+Ue[t&255]+Ue[t>>8&255]+"-"+Ue[t>>16&15|64]+Ue[t>>24&255]+"-"+Ue[e&63|128]+Ue[e>>8&255]+"-"+Ue[e>>16&255]+Ue[e>>24&255]+Ue[n&255]+Ue[n>>8&255]+Ue[n>>16&255]+Ue[n>>24&255]).toLowerCase()}function ze(s,t,e){return Math.max(t,Math.min(e,s))}function Mh(s,t){return(s%t+t)%t}function am(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function cm(s,t,e){return s!==t?(e-s)/(t-s):0}function ur(s,t,e){return(1-e)*s+e*t}function lm(s,t,e,n){return ur(s,t,1-Math.exp(-e*n))}function hm(s,t=1){return t-Math.abs(Mh(s,t*2)-t)}function um(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function dm(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function fm(s,t){return s+Math.floor(Math.random()*(t-s+1))}function pm(s,t){return s+Math.random()*(t-s)}function mm(s){return s*(.5-Math.random())}function gm(s){s!==void 0&&(ku=s);let t=ku+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function _m(s){return s*hr}function ym(s){return s*Is}function xm(s){return(s&s-1)===0&&s!==0}function vm(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Mm(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function wm(s,t,e,n,i){let r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),d=o((t-n)/2),f=r((n-t)/2),p=o((n-t)/2);switch(i){case"XYX":s.set(a*h,c*u,c*d,a*l);break;case"YZY":s.set(c*d,a*h,c*u,a*l);break;case"ZXZ":s.set(c*u,c*d,a*h,a*l);break;case"XZX":s.set(a*h,c*p,c*f,a*l);break;case"YXY":s.set(c*f,a*h,c*p,a*l);break;case"ZYZ":s.set(c*p,c*f,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Rn(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function oe(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}var lf={DEG2RAD:hr,RAD2DEG:Is,generateUUID:_n,clamp:ze,euclideanModulo:Mh,mapLinear:am,inverseLerp:cm,lerp:ur,damp:lm,pingpong:hm,smoothstep:um,smootherstep:dm,randInt:fm,randFloat:pm,randFloatSpread:mm,seededRandom:gm,degToRad:_m,radToDeg:ym,isPowerOfTwo:xm,ceilPowerOfTwo:vm,floorPowerOfTwo:Mm,setQuaternionFromProperEuler:wm,normalize:oe,denormalize:Rn},it=class s{constructor(t=0,e=0){s.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ze(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ut=class s{constructor(t,e,n,i,r,o,a,c,l){s.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,c,l)}set(t,e,n,i,r,o,a,c,l){let h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],p=n[8],_=i[0],m=i[3],g=i[6],M=i[1],x=i[4],w=i[7],C=i[2],T=i[5],E=i[8];return r[0]=o*_+a*M+c*C,r[3]=o*m+a*x+c*T,r[6]=o*g+a*w+c*E,r[1]=l*_+h*M+u*C,r[4]=l*m+h*x+u*T,r[7]=l*g+h*w+u*E,r[2]=d*_+f*M+p*C,r[5]=d*m+f*x+p*T,r[8]=d*g+f*w+p*E,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+i*r*l-i*o*c}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,d=a*c-h*r,f=l*r-o*c,p=e*u+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/p;return t[0]=u*_,t[1]=(i*l-h*n)*_,t[2]=(a*n-i*o)*_,t[3]=d*_,t[4]=(h*e-i*c)*_,t[5]=(i*r-a*e)*_,t[6]=f*_,t[7]=(n*c-l*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-i*l,i*c,-i*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(tc.makeScale(t,e)),this}rotate(t){return this.premultiply(tc.makeRotation(-t)),this}translate(t,e){return this.premultiply(tc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},tc=new Ut;function hf(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function xr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function bm(){let s=xr("canvas");return s.style.display="block",s}var Lu={};function Io(s){s in Lu||(Lu[s]=!0,console.warn(s))}function Sm(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function Am(s){let t=s.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Tm(s){let t=s.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}var Du=new Ut().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Nu=new Ut().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),js={[Ie]:{transfer:Do,primaries:No,luminanceCoefficients:[.2126,.7152,.0722],toReference:s=>s,fromReference:s=>s},[qt]:{transfer:ue,primaries:No,luminanceCoefficients:[.2126,.7152,.0722],toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[ya]:{transfer:Do,primaries:Uo,luminanceCoefficients:[.2289,.6917,.0793],toReference:s=>s.applyMatrix3(Nu),fromReference:s=>s.applyMatrix3(Du)},[vh]:{transfer:ue,primaries:Uo,luminanceCoefficients:[.2289,.6917,.0793],toReference:s=>s.convertSRGBToLinear().applyMatrix3(Nu),fromReference:s=>s.applyMatrix3(Du).convertLinearToSRGB()}},Em=new Set([Ie,ya]),$t={enabled:!0,_workingColorSpace:Ie,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!Em.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;let n=js[t].toReference,i=js[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return js[s].primaries},getTransfer:function(s){return s===fi?Do:js[s].transfer},getLuminanceCoefficients:function(s,t=this._workingColorSpace){return s.fromArray(js[t].luminanceCoefficients)}};function bs(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ec(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var Ji,xl=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ji===void 0&&(Ji=xr("canvas")),Ji.width=t.width,Ji.height=t.height;let n=Ji.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Ji}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=xr("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=bs(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(bs(e[n]/255)*255):e[n]=bs(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Rm=0,Fo=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Rm++}),this.uuid=_n(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(nc(i[o].image)):r.push(nc(i[o]))}else r=nc(i);n.url=r}return e||(t.images[this.uuid]=n),n}};function nc(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?xl.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Cm=0,Pe=class s extends jn{constructor(t=s.DEFAULT_IMAGE,e=s.DEFAULT_MAPPING,n=Kn,i=Kn,r=Je,o=In,a=gn,c=Zn,l=s.DEFAULT_ANISOTROPY,h=fi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Cm++}),this.uuid=_n(),this.name="",this.source=new Fo(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new it(0,0),this.repeat=new it(1,1),this.center=new it(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ut,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Yd)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ln:t.x=t.x-Math.floor(t.x);break;case Kn:t.x=t.x<0?0:1;break;case _r:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ln:t.y=t.y-Math.floor(t.y);break;case Kn:t.y=t.y<0?0:1;break;case _r:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Pe.DEFAULT_IMAGE=null;Pe.DEFAULT_MAPPING=Yd;Pe.DEFAULT_ANISOTROPY=1;var Kt=class s{constructor(t=0,e=0,n=0,i=1){s.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r,c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],p=c[9],_=c[2],m=c[6],g=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(p+m)<.1&&Math.abs(l+f+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let x=(l+1)/2,w=(f+1)/2,C=(g+1)/2,T=(h+d)/4,E=(u+_)/4,z=(p+m)/4;return x>w&&x>C?x<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(x),i=T/n,r=E/n):w>C?w<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(w),n=T/i,r=z/i):C<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(C),n=E/r,i=z/r),this.set(n,i,r,e),this}let M=Math.sqrt((m-p)*(m-p)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(m-p)/M,this.y=(u-_)/M,this.z=(d-h)/M,this.w=Math.acos((l+f+g-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},vl=class extends jn{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Kt(0,0,t,e),this.scissorTest=!1,this.viewport=new Kt(0,0,t,e);let i={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Je,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new Pe(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new Fo(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},$n=class extends vl{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Bo=class extends Pe{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Fe,this.minFilter=Fe,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ml=class extends Pe{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Fe,this.minFilter=Fe,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ot=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3],d=r[o+0],f=r[o+1],p=r[o+2],_=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=p,t[e+3]=_;return}if(u!==_||c!==d||l!==f||h!==p){let m=1-a,g=c*d+l*f+h*p+u*_,M=g>=0?1:-1,x=1-g*g;if(x>Number.EPSILON){let C=Math.sqrt(x),T=Math.atan2(C,g*M);m=Math.sin(m*T)/C,a=Math.sin(a*T)/C}let w=a*M;if(c=c*m+d*w,l=l*m+f*w,h=h*m+p*w,u=u*m+_*w,m===1-a){let C=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=C,l*=C,h*=C,u*=C}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,r,o){let a=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=r[o],d=r[o+1],f=r[o+2],p=r[o+3];return t[e]=a*p+h*u+c*f-l*d,t[e+1]=c*p+h*d+l*u-a*f,t[e+2]=l*p+h*f+a*d-c*u,t[e+3]=h*p-a*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(i/2),u=a(r/2),d=c(n/2),f=c(i/2),p=c(r/2);switch(o){case"XYZ":this._x=d*h*u+l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u+d*f*p;break;case"YZX":this._x=d*h*u+l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u-d*f*p;break;case"XZY":this._x=d*h*u-l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u+d*f*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(o-i)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-c)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+l)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-l)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(c+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-i)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ze(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+i*l-r*c,this._y=i*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-i*a,this._w=o*h-n*a-i*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,i=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+i*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*i+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},b=class s{constructor(t=0,e=0,n=0){s.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Uu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Uu.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*i-a*n),h=2*(a*e-r*i),u=2*(r*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=i+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=i*c-r*a,this.y=r*o-n*c,this.z=n*a-i*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ic.copy(this).projectOnVector(t),this.sub(ic)}reflect(t){return this.sub(ic.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ze(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ic=new b,Uu=new Ot,Ae=class{constructor(t=new b(1/0,1/0,1/0),e=new b(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(An.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(An.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=An.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,An):An.fromBufferAttribute(r,o),An.applyMatrix4(t.matrixWorld),this.expandByPoint(An);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Yr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Yr.copy(n.boundingBox)),Yr.applyMatrix4(t.matrixWorld),this.union(Yr)}let i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,An),An.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter($s),Zr.subVectors(this.max,$s),Qi.subVectors(t.a,$s),ts.subVectors(t.b,$s),es.subVectors(t.c,$s),ai.subVectors(ts,Qi),ci.subVectors(es,ts),Ci.subVectors(Qi,es);let e=[0,-ai.z,ai.y,0,-ci.z,ci.y,0,-Ci.z,Ci.y,ai.z,0,-ai.x,ci.z,0,-ci.x,Ci.z,0,-Ci.x,-ai.y,ai.x,0,-ci.y,ci.x,0,-Ci.y,Ci.x,0];return!sc(e,Qi,ts,es,Zr)||(e=[1,0,0,0,1,0,0,0,1],!sc(e,Qi,ts,es,Zr))?!1:(jr.crossVectors(ai,ci),e=[jr.x,jr.y,jr.z],sc(e,Qi,ts,es,Zr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,An).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(An).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Fn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Fn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Fn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Fn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Fn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Fn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Fn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Fn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Fn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Fn=[new b,new b,new b,new b,new b,new b,new b,new b],An=new b,Yr=new Ae,Qi=new b,ts=new b,es=new b,ai=new b,ci=new b,Ci=new b,$s=new b,Zr=new b,jr=new b,zi=new b;function sc(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){zi.fromArray(s,r);let a=i.x*Math.abs(zi.x)+i.y*Math.abs(zi.y)+i.z*Math.abs(zi.z),c=t.dot(zi),l=e.dot(zi),h=n.dot(zi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var zm=new Ae,Js=new b,rc=new b,cn=class{constructor(t=new b,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):zm.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Js.subVectors(t,this.center);let e=Js.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Js,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(rc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Js.copy(t.center).add(rc)),this.expandByPoint(Js.copy(t.center).sub(rc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},Bn=new b,oc=new b,$r=new b,li=new b,ac=new b,Jr=new b,cc=new b,Bi=class{constructor(t=new b,e=new b(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Bn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Bn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Bn.copy(this.origin).addScaledVector(this.direction,e),Bn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){oc.copy(t).add(e).multiplyScalar(.5),$r.copy(e).sub(t).normalize(),li.copy(this.origin).sub(oc);let r=t.distanceTo(e)*.5,o=-this.direction.dot($r),a=li.dot(this.direction),c=-li.dot($r),l=li.lengthSq(),h=Math.abs(1-o*o),u,d,f,p;if(h>0)if(u=o*c-a,d=o*a-c,p=r*h,u>=0)if(d>=-p)if(d<=p){let _=1/h;u*=_,d*=_,f=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d<=-p?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=p?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(oc).addScaledVector($r,d),f}intersectSphere(t,e){Bn.subVectors(t.center,this.origin);let n=Bn.dot(this.direction),i=Bn.dot(Bn)-n*n,r=t.radius*t.radius;if(i>r)return null;let o=Math.sqrt(r-i),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,i=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,i=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||a>i)||((a>n||n!==n)&&(n=a),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,Bn)!==null}intersectTriangle(t,e,n,i,r){ac.subVectors(e,t),Jr.subVectors(n,t),cc.crossVectors(ac,Jr);let o=this.direction.dot(cc),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;li.subVectors(this.origin,t);let c=a*this.direction.dot(Jr.crossVectors(li,Jr));if(c<0)return null;let l=a*this.direction.dot(ac.cross(li));if(l<0||c+l>o)return null;let h=-a*li.dot(cc);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},At=class s{constructor(t,e,n,i,r,o,a,c,l,h,u,d,f,p,_,m){s.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,c,l,h,u,d,f,p,_,m)}set(t,e,n,i,r,o,a,c,l,h,u,d,f,p,_,m){let g=this.elements;return g[0]=t,g[4]=e,g[8]=n,g[12]=i,g[1]=r,g[5]=o,g[9]=a,g[13]=c,g[2]=l,g[6]=h,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=_,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new s().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,i=1/ns.setFromMatrixColumn(t,0).length(),r=1/ns.setFromMatrixColumn(t,1).length(),o=1/ns.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=o*h,f=o*u,p=a*h,_=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+p*l,e[5]=d-_*l,e[9]=-a*c,e[2]=_-d*l,e[6]=p+f*l,e[10]=o*c}else if(t.order==="YXZ"){let d=c*h,f=c*u,p=l*h,_=l*u;e[0]=d+_*a,e[4]=p*a-f,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-p,e[6]=_+d*a,e[10]=o*c}else if(t.order==="ZXY"){let d=c*h,f=c*u,p=l*h,_=l*u;e[0]=d-_*a,e[4]=-o*u,e[8]=p+f*a,e[1]=f+p*a,e[5]=o*h,e[9]=_-d*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){let d=o*h,f=o*u,p=a*h,_=a*u;e[0]=c*h,e[4]=p*l-f,e[8]=d*l+_,e[1]=c*u,e[5]=_*l+d,e[9]=f*l-p,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){let d=o*c,f=o*l,p=a*c,_=a*l;e[0]=c*h,e[4]=_-d*u,e[8]=p*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=f*u+p,e[10]=d-_*u}else if(t.order==="XZY"){let d=o*c,f=o*l,p=a*c,_=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+_,e[5]=o*h,e[9]=f*u-p,e[2]=p*u-f,e[6]=a*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Pm,t,Im)}lookAt(t,e,n){let i=this.elements;return on.subVectors(t,e),on.lengthSq()===0&&(on.z=1),on.normalize(),hi.crossVectors(n,on),hi.lengthSq()===0&&(Math.abs(n.z)===1?on.x+=1e-4:on.z+=1e-4,on.normalize(),hi.crossVectors(n,on)),hi.normalize(),Qr.crossVectors(on,hi),i[0]=hi.x,i[4]=Qr.x,i[8]=on.x,i[1]=hi.y,i[5]=Qr.y,i[9]=on.y,i[2]=hi.z,i[6]=Qr.z,i[10]=on.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],p=n[2],_=n[6],m=n[10],g=n[14],M=n[3],x=n[7],w=n[11],C=n[15],T=i[0],E=i[4],z=i[8],F=i[12],y=i[1],S=i[5],N=i[9],L=i[13],B=i[2],Z=i[6],H=i[10],$=i[14],W=i[3],at=i[7],ct=i[11],gt=i[15];return r[0]=o*T+a*y+c*B+l*W,r[4]=o*E+a*S+c*Z+l*at,r[8]=o*z+a*N+c*H+l*ct,r[12]=o*F+a*L+c*$+l*gt,r[1]=h*T+u*y+d*B+f*W,r[5]=h*E+u*S+d*Z+f*at,r[9]=h*z+u*N+d*H+f*ct,r[13]=h*F+u*L+d*$+f*gt,r[2]=p*T+_*y+m*B+g*W,r[6]=p*E+_*S+m*Z+g*at,r[10]=p*z+_*N+m*H+g*ct,r[14]=p*F+_*L+m*$+g*gt,r[3]=M*T+x*y+w*B+C*W,r[7]=M*E+x*S+w*Z+C*at,r[11]=M*z+x*N+w*H+C*ct,r[15]=M*F+x*L+w*$+C*gt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],p=t[3],_=t[7],m=t[11],g=t[15];return p*(+r*c*u-i*l*u-r*a*d+n*l*d+i*a*f-n*c*f)+_*(+e*c*f-e*l*d+r*o*d-i*o*f+i*l*h-r*c*h)+m*(+e*l*u-e*a*f-r*o*u+n*o*f+r*a*h-n*l*h)+g*(-i*a*h-e*c*u+e*a*d+i*o*u-n*o*d+n*c*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],p=t[12],_=t[13],m=t[14],g=t[15],M=u*m*l-_*d*l+_*c*f-a*m*f-u*c*g+a*d*g,x=p*d*l-h*m*l-p*c*f+o*m*f+h*c*g-o*d*g,w=h*_*l-p*u*l+p*a*f-o*_*f-h*a*g+o*u*g,C=p*u*c-h*_*c-p*a*d+o*_*d+h*a*m-o*u*m,T=e*M+n*x+i*w+r*C;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let E=1/T;return t[0]=M*E,t[1]=(_*d*r-u*m*r-_*i*f+n*m*f+u*i*g-n*d*g)*E,t[2]=(a*m*r-_*c*r+_*i*l-n*m*l-a*i*g+n*c*g)*E,t[3]=(u*c*r-a*d*r-u*i*l+n*d*l+a*i*f-n*c*f)*E,t[4]=x*E,t[5]=(h*m*r-p*d*r+p*i*f-e*m*f-h*i*g+e*d*g)*E,t[6]=(p*c*r-o*m*r-p*i*l+e*m*l+o*i*g-e*c*g)*E,t[7]=(o*d*r-h*c*r+h*i*l-e*d*l-o*i*f+e*c*f)*E,t[8]=w*E,t[9]=(p*u*r-h*_*r-p*n*f+e*_*f+h*n*g-e*u*g)*E,t[10]=(o*_*r-p*a*r+p*n*l-e*_*l-o*n*g+e*a*g)*E,t[11]=(h*a*r-o*u*r-h*n*l+e*u*l+o*n*f-e*a*f)*E,t[12]=C*E,t[13]=(h*_*i-p*u*i+p*n*d-e*_*d-h*n*m+e*u*m)*E,t[14]=(p*a*i-o*_*i-p*n*c+e*_*c+o*n*m-e*a*m)*E,t[15]=(o*u*i-h*a*i+h*n*c-e*u*c-o*n*d+e*a*d)*E,this}scale(t){let e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-i*c,l*c+i*a,0,l*a+i*c,h*a+n,h*c-i*o,0,l*c-i*a,h*c+i*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,d=r*l,f=r*h,p=r*u,_=o*h,m=o*u,g=a*u,M=c*l,x=c*h,w=c*u,C=n.x,T=n.y,E=n.z;return i[0]=(1-(_+g))*C,i[1]=(f+w)*C,i[2]=(p-x)*C,i[3]=0,i[4]=(f-w)*T,i[5]=(1-(d+g))*T,i[6]=(m+M)*T,i[7]=0,i[8]=(p+x)*E,i[9]=(m-M)*E,i[10]=(1-(d+_))*E,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements,r=ns.set(i[0],i[1],i[2]).length(),o=ns.set(i[4],i[5],i[6]).length(),a=ns.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],Tn.copy(this);let l=1/r,h=1/o,u=1/a;return Tn.elements[0]*=l,Tn.elements[1]*=l,Tn.elements[2]*=l,Tn.elements[4]*=h,Tn.elements[5]*=h,Tn.elements[6]*=h,Tn.elements[8]*=u,Tn.elements[9]*=u,Tn.elements[10]*=u,e.setFromRotationMatrix(Tn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,i,r,o,a=Yn){let c=this.elements,l=2*r/(e-t),h=2*r/(n-i),u=(e+t)/(e-t),d=(n+i)/(n-i),f,p;if(a===Yn)f=-(o+r)/(o-r),p=-2*o*r/(o-r);else if(a===Oo)f=-o/(o-r),p=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=p,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=Yn){let c=this.elements,l=1/(e-t),h=1/(n-i),u=1/(o-r),d=(e+t)*l,f=(n+i)*h,p,_;if(a===Yn)p=(o+r)*u,_=-2*u;else if(a===Oo)p=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=_,c[14]=-p,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},ns=new b,Tn=new At,Pm=new b(0,0,0),Im=new b(1,1,1),hi=new b,Qr=new b,on=new b,Ou=new At,Fu=new Ot,ln=class s{constructor(t=0,e=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,r=i[0],o=i[4],a=i[8],c=i[1],l=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ze(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ze(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ze(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(ze(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ou.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ou,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Fu.setFromEuler(this),this.setFromQuaternion(Fu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ln.DEFAULT_ORDER="XYZ";var vr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},km=0,Bu=new b,is=new Ot,Hn=new At,to=new b,Qs=new b,Lm=new b,Dm=new Ot,Hu=new b(1,0,0),Vu=new b(0,1,0),Gu=new b(0,0,1),Wu={type:"added"},Nm={type:"removed"},ss={type:"childadded",child:null},lc={type:"childremoved",child:null},fe=class s extends jn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:km++}),this.uuid=_n(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let t=new b,e=new ln,n=new Ot,i=new b(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new At},normalMatrix:{value:new Ut}}),this.matrix=new At,this.matrixWorld=new At,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return is.setFromAxisAngle(t,e),this.quaternion.multiply(is),this}rotateOnWorldAxis(t,e){return is.setFromAxisAngle(t,e),this.quaternion.premultiply(is),this}rotateX(t){return this.rotateOnAxis(Hu,t)}rotateY(t){return this.rotateOnAxis(Vu,t)}rotateZ(t){return this.rotateOnAxis(Gu,t)}translateOnAxis(t,e){return Bu.copy(t).applyQuaternion(this.quaternion),this.position.add(Bu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Hu,t)}translateY(t){return this.translateOnAxis(Vu,t)}translateZ(t){return this.translateOnAxis(Gu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Hn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?to.copy(t):to.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),Qs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hn.lookAt(Qs,to,this.up):Hn.lookAt(to,Qs,this.up),this.quaternion.setFromRotationMatrix(Hn),i&&(Hn.extractRotation(i.matrixWorld),is.setFromRotationMatrix(Hn),this.quaternion.premultiply(is.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Wu),ss.child=t,this.dispatchEvent(ss),ss.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Nm),lc.child=t,this.dispatchEvent(lc),lc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Hn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Hn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Hn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Wu),ss.child=t,this.dispatchEvent(ss),ss.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qs,t,Lm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qs,Dm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];i.animations.push(r(t.animations,c))}}if(e){let a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),p=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}};fe.DEFAULT_UP=new b(0,1,0);fe.DEFAULT_MATRIX_AUTO_UPDATE=!0;fe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var En=new b,Vn=new b,hc=new b,Gn=new b,rs=new b,os=new b,Xu=new b,uc=new b,dc=new b,fc=new b,pc=new Kt,mc=new Kt,gc=new Kt,pi=class s{constructor(t=new b,e=new b,n=new b){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),En.subVectors(t,e),i.cross(En);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){En.subVectors(i,e),Vn.subVectors(n,e),hc.subVectors(t,e);let o=En.dot(En),a=En.dot(Vn),c=En.dot(hc),l=Vn.dot(Vn),h=Vn.dot(hc),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(l*c-a*h)*d,p=(o*h-a*c)*d;return r.set(1-f-p,p,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Gn)===null?!1:Gn.x>=0&&Gn.y>=0&&Gn.x+Gn.y<=1}static getInterpolation(t,e,n,i,r,o,a,c){return this.getBarycoord(t,e,n,i,Gn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Gn.x),c.addScaledVector(o,Gn.y),c.addScaledVector(a,Gn.z),c)}static getInterpolatedAttribute(t,e,n,i,r,o){return pc.setScalar(0),mc.setScalar(0),gc.setScalar(0),pc.fromBufferAttribute(t,e),mc.fromBufferAttribute(t,n),gc.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(pc,r.x),o.addScaledVector(mc,r.y),o.addScaledVector(gc,r.z),o}static isFrontFacing(t,e,n,i){return En.subVectors(n,e),Vn.subVectors(t,e),En.cross(Vn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return En.subVectors(this.c,this.b),Vn.subVectors(this.a,this.b),En.cross(Vn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return s.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return s.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return s.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return s.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return s.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,r=this.c,o,a;rs.subVectors(i,n),os.subVectors(r,n),uc.subVectors(t,n);let c=rs.dot(uc),l=os.dot(uc);if(c<=0&&l<=0)return e.copy(n);dc.subVectors(t,i);let h=rs.dot(dc),u=os.dot(dc);if(h>=0&&u<=h)return e.copy(i);let d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(rs,o);fc.subVectors(t,r);let f=rs.dot(fc),p=os.dot(fc);if(p>=0&&f<=p)return e.copy(r);let _=f*l-c*p;if(_<=0&&l>=0&&p<=0)return a=l/(l-p),e.copy(n).addScaledVector(os,a);let m=h*p-f*u;if(m<=0&&u-h>=0&&f-p>=0)return Xu.subVectors(r,i),a=(u-h)/(u-h+(f-p)),e.copy(i).addScaledVector(Xu,a);let g=1/(m+_+d);return o=_*g,a=d*g,e.copy(n).addScaledVector(rs,o).addScaledVector(os,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},uf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ui={h:0,s:0,l:0},eo={h:0,s:0,l:0};function _c(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}var tt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=qt){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,$t.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=$t.workingColorSpace){return this.r=t,this.g=e,this.b=n,$t.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=$t.workingColorSpace){if(t=Mh(t,1),e=ze(e,0,1),n=ze(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=_c(o,r,t+1/3),this.g=_c(o,r,t),this.b=_c(o,r,t-1/3)}return $t.toWorkingColorSpace(this,i),this}setStyle(t,e=qt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=qt){let n=uf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=bs(t.r),this.g=bs(t.g),this.b=bs(t.b),this}copyLinearToSRGB(t){return this.r=ec(t.r),this.g=ec(t.g),this.b=ec(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=qt){return $t.fromWorkingColorSpace(Oe.copy(this),t),Math.round(ze(Oe.r*255,0,255))*65536+Math.round(ze(Oe.g*255,0,255))*256+Math.round(ze(Oe.b*255,0,255))}getHexString(t=qt){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=$t.workingColorSpace){$t.fromWorkingColorSpace(Oe.copy(this),e);let n=Oe.r,i=Oe.g,r=Oe.b,o=Math.max(n,i,r),a=Math.min(n,i,r),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(i-r)/u+(i<r?6:0);break;case i:c=(r-n)/u+2;break;case r:c=(n-i)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=$t.workingColorSpace){return $t.fromWorkingColorSpace(Oe.copy(this),e),t.r=Oe.r,t.g=Oe.g,t.b=Oe.b,t}getStyle(t=qt){$t.fromWorkingColorSpace(Oe.copy(this),t);let e=Oe.r,n=Oe.g,i=Oe.b;return t!==qt?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(ui),this.setHSL(ui.h+t,ui.s+e,ui.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ui),t.getHSL(eo);let n=ur(ui.h,eo.h,e),i=ur(ui.s,eo.s,e),r=ur(ui.l,eo.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Oe=new tt;tt.NAMES=uf;var Um=0,qe=class extends jn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Um++}),this.uuid=_n(),this.name="",this.type="Material",this.blending=Ms,this.side=kn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Nc,this.blendDst=Uc,this.blendEquation=Ni,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new tt(0,0,0),this.blendAlpha=0,this.depthFunc=As,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Pu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=$i,this.stencilZFail=$i,this.stencilZPass=$i,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ms&&(n.blending=this.blending),this.side!==kn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Nc&&(n.blendSrc=this.blendSrc),this.blendDst!==Uc&&(n.blendDst=this.blendDst),this.blendEquation!==Ni&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==As&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Pu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==$i&&(n.stencilFail=this.stencilFail),this.stencilZFail!==$i&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==$i&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(e){let r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},le=class extends qe{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new tt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=ah,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Me=new b,no=new it,Se=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=yl,this.updateRanges=[],this.gpuType=Cn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)no.fromBufferAttribute(this,e),no.applyMatrix3(t),this.setXY(e,no.x,no.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix3(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix4(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyNormalMatrix(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.transformDirection(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Rn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=oe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Rn(e,this.array)),e}setX(t,e){return this.normalized&&(e=oe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Rn(e,this.array)),e}setY(t,e){return this.normalized&&(e=oe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Rn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=oe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Rn(e,this.array)),e}setW(t,e){return this.normalized&&(e=oe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=oe(e,this.array),n=oe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=oe(e,this.array),n=oe(n,this.array),i=oe(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=oe(e,this.array),n=oe(n,this.array),i=oe(i,this.array),r=oe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==yl&&(t.usage=this.usage),t}};var Ho=class extends Se{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Vo=class extends Se{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Tt=class extends Se{constructor(t,e,n){super(new Float32Array(t),e,n)}},Om=0,mn=new At,yc=new fe,as=new b,an=new Ae,tr=new Ae,Ce=new b,Jt=class s extends jn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Om++}),this.uuid=_n(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(hf(t)?Vo:Ho)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ut().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return mn.makeRotationFromQuaternion(t),this.applyMatrix4(mn),this}rotateX(t){return mn.makeRotationX(t),this.applyMatrix4(mn),this}rotateY(t){return mn.makeRotationY(t),this.applyMatrix4(mn),this}rotateZ(t){return mn.makeRotationZ(t),this.applyMatrix4(mn),this}translate(t,e,n){return mn.makeTranslation(t,e,n),this.applyMatrix4(mn),this}scale(t,e,n){return mn.makeScale(t,e,n),this.applyMatrix4(mn),this}lookAt(t){return yc.lookAt(t),yc.updateMatrix(),this.applyMatrix4(yc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(as).negate(),this.translate(as.x,as.y,as.z),this}setFromPoints(t){let e=[];for(let n=0,i=t.length;n<i;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Tt(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ae);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new b(-1/0,-1/0,-1/0),new b(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let r=e[n];an.setFromBufferAttribute(r),this.morphTargetsRelative?(Ce.addVectors(this.boundingBox.min,an.min),this.boundingBox.expandByPoint(Ce),Ce.addVectors(this.boundingBox.max,an.max),this.boundingBox.expandByPoint(Ce)):(this.boundingBox.expandByPoint(an.min),this.boundingBox.expandByPoint(an.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new cn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new b,1/0);return}if(t){let n=this.boundingSphere.center;if(an.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];tr.setFromBufferAttribute(a),this.morphTargetsRelative?(Ce.addVectors(an.min,tr.min),an.expandByPoint(Ce),Ce.addVectors(an.max,tr.max),an.expandByPoint(Ce)):(an.expandByPoint(tr.min),an.expandByPoint(tr.max))}an.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)Ce.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(Ce));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Ce.fromBufferAttribute(a,l),c&&(as.fromBufferAttribute(t,l),Ce.add(as)),i=Math.max(i,n.distanceToSquared(Ce))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,i=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Se(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let z=0;z<n.count;z++)a[z]=new b,c[z]=new b;let l=new b,h=new b,u=new b,d=new it,f=new it,p=new it,_=new b,m=new b;function g(z,F,y){l.fromBufferAttribute(n,z),h.fromBufferAttribute(n,F),u.fromBufferAttribute(n,y),d.fromBufferAttribute(r,z),f.fromBufferAttribute(r,F),p.fromBufferAttribute(r,y),h.sub(l),u.sub(l),f.sub(d),p.sub(d);let S=1/(f.x*p.y-p.x*f.y);isFinite(S)&&(_.copy(h).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(S),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(S),a[z].add(_),a[F].add(_),a[y].add(_),c[z].add(m),c[F].add(m),c[y].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let z=0,F=M.length;z<F;++z){let y=M[z],S=y.start,N=y.count;for(let L=S,B=S+N;L<B;L+=3)g(t.getX(L+0),t.getX(L+1),t.getX(L+2))}let x=new b,w=new b,C=new b,T=new b;function E(z){C.fromBufferAttribute(i,z),T.copy(C);let F=a[z];x.copy(F),x.sub(C.multiplyScalar(C.dot(F))).normalize(),w.crossVectors(T,F);let S=w.dot(c[z])<0?-1:1;o.setXYZW(z,x.x,x.y,x.z,S)}for(let z=0,F=M.length;z<F;++z){let y=M[z],S=y.start,N=y.count;for(let L=S,B=S+N;L<B;L+=3)E(t.getX(L+0)),E(t.getX(L+1)),E(t.getX(L+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Se(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let i=new b,r=new b,o=new b,a=new b,c=new b,l=new b,h=new b,u=new b;if(t)for(let d=0,f=t.count;d<f;d+=3){let p=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);i.fromBufferAttribute(e,p),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,p),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ce.fromBufferAttribute(t,e),Ce.normalize(),t.setXYZ(e,Ce.x,Ce.y,Ce.z)}toNonIndexed(){function t(a,c){let l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h),f=0,p=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?f=c[_]*a.data.stride+a.offset:f=c[_]*h;for(let g=0;g<h;g++)d[p++]=l[f++]}return new Se(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new s,n=this.index.array,i=this.attributes;for(let a in i){let c=i[a],l=t(c,n);e.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){let d=l[h],f=t(d,n);c.push(f)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let i={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){let f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(i[c]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let i=t.attributes;for(let l in i){let h=i[l];this.setAttribute(l,h.clone(e))}let r=t.morphAttributes;for(let l in r){let h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let l=0,h=o.length;l<h;l++){let u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},qu=new At,Pi=new Bi,io=new cn,Ku=new b,so=new b,ro=new b,oo=new b,xc=new b,ao=new b,Yu=new b,co=new b,Dt=class extends fe{constructor(t=new Jt,e=new le){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let a=this.morphTargetInfluences;if(r&&a){ao.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=a[c],u=r[c];h!==0&&(xc.fromBufferAttribute(u,t),o?ao.addScaledVector(xc,h):ao.addScaledVector(xc.sub(e),h))}e.add(ao)}return e}raycast(t,e){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),io.copy(n.boundingSphere),io.applyMatrix4(r),Pi.copy(t.ray).recast(t.near),!(io.containsPoint(Pi.origin)===!1&&(Pi.intersectSphere(io,Ku)===null||Pi.origin.distanceToSquared(Ku)>(t.far-t.near)**2))&&(qu.copy(r).invert(),Pi.copy(t.ray).applyMatrix4(qu),!(n.boundingBox!==null&&Pi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Pi)))}_computeIntersections(t,e,n){let i,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,_=d.length;p<_;p++){let m=d[p],g=o[m.materialIndex],M=Math.max(m.start,f.start),x=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let w=M,C=x;w<C;w+=3){let T=a.getX(w),E=a.getX(w+1),z=a.getX(w+2);i=lo(this,g,t,n,l,h,u,T,E,z),i&&(i.faceIndex=Math.floor(w/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let p=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){let M=a.getX(m),x=a.getX(m+1),w=a.getX(m+2);i=lo(this,o,t,n,l,h,u,M,x,w),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(c!==void 0)if(Array.isArray(o))for(let p=0,_=d.length;p<_;p++){let m=d[p],g=o[m.materialIndex],M=Math.max(m.start,f.start),x=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let w=M,C=x;w<C;w+=3){let T=w,E=w+1,z=w+2;i=lo(this,g,t,n,l,h,u,T,E,z),i&&(i.faceIndex=Math.floor(w/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let p=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){let M=m,x=m+1,w=m+2;i=lo(this,o,t,n,l,h,u,M,x,w),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}};function Fm(s,t,e,n,i,r,o,a){let c;if(t.side===Be?c=n.intersectTriangle(o,r,i,!0,a):c=n.intersectTriangle(i,r,o,t.side===kn,a),c===null)return null;co.copy(a),co.applyMatrix4(s.matrixWorld);let l=e.ray.origin.distanceTo(co);return l<e.near||l>e.far?null:{distance:l,point:co.clone(),object:s}}function lo(s,t,e,n,i,r,o,a,c,l){s.getVertexPosition(a,so),s.getVertexPosition(c,ro),s.getVertexPosition(l,oo);let h=Fm(s,t,e,n,so,ro,oo,Yu);if(h){let u=new b;pi.getBarycoord(Yu,so,ro,oo,u),i&&(h.uv=pi.getInterpolatedAttribute(i,a,c,l,u,new it)),r&&(h.uv1=pi.getInterpolatedAttribute(r,a,c,l,u,new it)),o&&(h.normal=pi.getInterpolatedAttribute(o,a,c,l,u,new b),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:c,c:l,normal:new b,materialIndex:0};pi.getNormal(so,ro,oo,d.normal),h.face=d,h.barycoord=u}return h}var Ke=class s extends Jt{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};let a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],h=[],u=[],d=0,f=0;p("z","y","x",-1,-1,n,e,t,o,r,0),p("z","y","x",1,-1,n,e,-t,o,r,1),p("x","z","y",1,1,t,n,e,i,o,2),p("x","z","y",1,-1,t,n,-e,i,o,3),p("x","y","z",1,-1,t,e,n,i,r,4),p("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new Tt(l,3)),this.setAttribute("normal",new Tt(h,3)),this.setAttribute("uv",new Tt(u,2));function p(_,m,g,M,x,w,C,T,E,z,F){let y=w/E,S=C/z,N=w/2,L=C/2,B=T/2,Z=E+1,H=z+1,$=0,W=0,at=new b;for(let ct=0;ct<H;ct++){let gt=ct*S-L;for(let Ft=0;Ft<Z;Ft++){let Yt=Ft*y-N;at[_]=Yt*M,at[m]=gt*x,at[g]=B,l.push(at.x,at.y,at.z),at[_]=0,at[m]=0,at[g]=T>0?1:-1,h.push(at.x,at.y,at.z),u.push(Ft/E),u.push(1-ct/z),$+=1}}for(let ct=0;ct<z;ct++)for(let gt=0;gt<E;gt++){let Ft=d+gt+Z*ct,Yt=d+gt+Z*(ct+1),Y=d+(gt+1)+Z*(ct+1),Q=d+(gt+1)+Z*ct;c.push(Ft,Yt,Q),c.push(Yt,Y,Q),W+=6}a.addGroup(f,W,F),f+=W,d+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function ks(s){let t={};for(let e in s){t[e]={};for(let n in s[e]){let i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Xe(s){let t={};for(let e=0;e<s.length;e++){let n=ks(s[e]);for(let i in n)t[i]=n[i]}return t}function Bm(s){let t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function df(s){let t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:$t.workingColorSpace}var Hm={clone:ks,merge:Xe},Vm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Gm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,yn=class extends qe{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Vm,this.fragmentShader=Gm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ks(t.uniforms),this.uniformsGroups=Bm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Go=class extends fe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new At,this.projectionMatrix=new At,this.projectionMatrixInverse=new At,this.coordinateSystem=Yn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},di=new b,Zu=new it,ju=new it,De=class extends Go{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Is*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(hr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Is*2*Math.atan(Math.tan(hr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){di.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(di.x,di.y).multiplyScalar(-t/di.z),di.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(di.x,di.y).multiplyScalar(-t/di.z)}getViewSize(t,e){return this.getViewBounds(t,Zu,ju),e.subVectors(ju,Zu)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(hr*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*i/c,e-=o.offsetY*n/l,i*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},cs=-90,ls=1,wl=class extends fe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new De(cs,ls,t,e);i.layers=this.layers,this.add(i);let r=new De(cs,ls,t,e);r.layers=this.layers,this.add(r);let o=new De(cs,ls,t,e);o.layers=this.layers,this.add(o);let a=new De(cs,ls,t,e);a.layers=this.layers,this.add(a);let c=new De(cs,ls,t,e);c.layers=this.layers,this.add(c);let l=new De(cs,ls,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,c]=e;for(let l of e)this.remove(l);if(t===Yn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Oo)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,c),t.setRenderTarget(n,4,i),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Wo=class extends Pe{constructor(t,e,n,i,r,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Ts,super(t,e,n,i,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},bl=class extends $n{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new Wo(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Je}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Ke(5,5,5),r=new yn({name:"CubemapFromEquirect",uniforms:ks(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Be,blending:gi});r.uniforms.tEquirect.value=e;let o=new Dt(i,r),a=e.minFilter;return e.minFilter===In&&(e.minFilter=Je),new wl(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,i){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}},vc=new b,Wm=new b,Xm=new Ut,qn=class{constructor(t=new b(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=vc.subVectors(n,e).cross(Wm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(vc),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Xm.getNormalMatrix(t),i=this.coplanarPoint(vc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ii=new cn,ho=new b,Mr=class{constructor(t=new qn,e=new qn,n=new qn,i=new qn,r=new qn,o=new qn){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Yn){let n=this.planes,i=t.elements,r=i[0],o=i[1],a=i[2],c=i[3],l=i[4],h=i[5],u=i[6],d=i[7],f=i[8],p=i[9],_=i[10],m=i[11],g=i[12],M=i[13],x=i[14],w=i[15];if(n[0].setComponents(c-r,d-l,m-f,w-g).normalize(),n[1].setComponents(c+r,d+l,m+f,w+g).normalize(),n[2].setComponents(c+o,d+h,m+p,w+M).normalize(),n[3].setComponents(c-o,d-h,m-p,w-M).normalize(),n[4].setComponents(c-a,d-u,m-_,w-x).normalize(),e===Yn)n[5].setComponents(c+a,d+u,m+_,w+x).normalize();else if(e===Oo)n[5].setComponents(a,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ii.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ii.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ii)}intersectsSprite(t){return Ii.center.set(0,0,0),Ii.radius=.7071067811865476,Ii.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ii)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(ho.x=i.normal.x>0?t.max.x:t.min.x,ho.y=i.normal.y>0?t.max.y:t.min.y,ho.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(ho)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function ff(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function qm(s){let t=new WeakMap;function e(a,c){let l=a.array,h=a.usage,u=l.byteLength,d=s.createBuffer();s.bindBuffer(c,d),s.bufferData(c,l,h),a.onUploadCallback();let f;if(l instanceof Float32Array)f=s.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=s.SHORT;else if(l instanceof Uint32Array)f=s.UNSIGNED_INT;else if(l instanceof Int32Array)f=s.INT;else if(l instanceof Int8Array)f=s.BYTE;else if(l instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){let h=c.array,u=c.updateRanges;if(s.bindBuffer(l,a),u.length===0)s.bufferSubData(l,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){let p=u[d],_=u[f];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){let _=u[f];s.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=t.get(a);c&&(s.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:i,remove:r,update:o}}var Dn=class s extends Jt{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(i),l=a+1,h=c+1,u=t/a,d=e/c,f=[],p=[],_=[],m=[];for(let g=0;g<h;g++){let M=g*d-o;for(let x=0;x<l;x++){let w=x*u-r;p.push(w,-M,0),_.push(0,0,1),m.push(x/a),m.push(1-g/c)}}for(let g=0;g<c;g++)for(let M=0;M<a;M++){let x=M+l*g,w=M+l*(g+1),C=M+1+l*(g+1),T=M+1+l*g;f.push(x,w,T),f.push(w,C,T)}this.setIndex(f),this.setAttribute("position",new Tt(p,3)),this.setAttribute("normal",new Tt(_,3)),this.setAttribute("uv",new Tt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.widthSegments,t.heightSegments)}},Km=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ym=`#ifdef USE_ALPHAHASH
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
#endif`,Zm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,jm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,$m=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Jm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Qm=`#ifdef USE_AOMAP
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
#endif`,t0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,e0=`#ifdef USE_BATCHING
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
#endif`,n0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,i0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,s0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,r0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,o0=`#ifdef USE_IRIDESCENCE
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
#endif`,a0=`#ifdef USE_BUMPMAP
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
#endif`,c0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,l0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,h0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,u0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,d0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,f0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,p0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,m0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,g0=`#define PI 3.141592653589793
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
} // validated`,_0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,y0=`vec3 transformedNormal = objectNormal;
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
#endif`,x0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,v0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,M0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,w0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,b0="gl_FragColor = linearToOutputTexel( gl_FragColor );",S0=`
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
}`,A0=`#ifdef USE_ENVMAP
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
#endif`,T0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,E0=`#ifdef USE_ENVMAP
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
#endif`,R0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,C0=`#ifdef USE_ENVMAP
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
#endif`,z0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,P0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,I0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,k0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,L0=`#ifdef USE_GRADIENTMAP
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
}`,D0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,N0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,U0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,O0=`uniform bool receiveShadow;
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
#endif`,F0=`#ifdef USE_ENVMAP
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
#endif`,B0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,H0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,V0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,G0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,W0=`PhysicalMaterial material;
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
#endif`,X0=`struct PhysicalMaterial {
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
}`,q0=`
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
#endif`,K0=`#if defined( RE_IndirectDiffuse )
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
#endif`,Y0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Z0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,j0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,J0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Q0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,tg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,eg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,ng=`#if defined( USE_POINTS_UV )
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
#endif`,ig=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,sg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,rg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,og=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ag=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cg=`#ifdef USE_MORPHTARGETS
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
#endif`,lg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ug=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,dg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,pg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,mg=`#ifdef USE_NORMALMAP
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
#endif`,gg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,_g=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,yg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,xg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Mg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,wg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,bg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Sg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ag=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Tg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Eg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Rg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Cg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,zg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Pg=`float getShadowMask() {
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
}`,Ig=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,kg=`#ifdef USE_SKINNING
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
#endif`,Lg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Dg=`#ifdef USE_SKINNING
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
#endif`,Ng=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ug=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Og=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Fg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Bg=`#ifdef USE_TRANSMISSION
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
#endif`,Hg=`#ifdef USE_TRANSMISSION
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
#endif`,Vg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Gg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Wg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Xg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,qg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Kg=`uniform sampler2D t2D;
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
}`,Yg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,jg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,$g=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jg=`#include <common>
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
}`,Qg=`#if DEPTH_PACKING == 3200
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
}`,t_=`#define DISTANCE
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
}`,e_=`#define DISTANCE
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
}`,n_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,i_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,s_=`uniform float scale;
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
}`,r_=`uniform vec3 diffuse;
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
}`,o_=`#include <common>
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
}`,a_=`uniform vec3 diffuse;
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
}`,c_=`#define LAMBERT
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
}`,l_=`#define LAMBERT
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
}`,h_=`#define MATCAP
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
}`,u_=`#define MATCAP
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
}`,d_=`#define NORMAL
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
}`,f_=`#define NORMAL
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
}`,p_=`#define PHONG
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
}`,m_=`#define PHONG
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
}`,g_=`#define STANDARD
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
}`,__=`#define STANDARD
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
}`,y_=`#define TOON
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
}`,x_=`#define TOON
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
}`,v_=`uniform float size;
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
}`,M_=`uniform vec3 diffuse;
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
}`,w_=`#include <common>
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
}`,b_=`uniform vec3 color;
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
}`,S_=`uniform float rotation;
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
}`,A_=`uniform vec3 diffuse;
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
}`,Nt={alphahash_fragment:Km,alphahash_pars_fragment:Ym,alphamap_fragment:Zm,alphamap_pars_fragment:jm,alphatest_fragment:$m,alphatest_pars_fragment:Jm,aomap_fragment:Qm,aomap_pars_fragment:t0,batching_pars_vertex:e0,batching_vertex:n0,begin_vertex:i0,beginnormal_vertex:s0,bsdfs:r0,iridescence_fragment:o0,bumpmap_pars_fragment:a0,clipping_planes_fragment:c0,clipping_planes_pars_fragment:l0,clipping_planes_pars_vertex:h0,clipping_planes_vertex:u0,color_fragment:d0,color_pars_fragment:f0,color_pars_vertex:p0,color_vertex:m0,common:g0,cube_uv_reflection_fragment:_0,defaultnormal_vertex:y0,displacementmap_pars_vertex:x0,displacementmap_vertex:v0,emissivemap_fragment:M0,emissivemap_pars_fragment:w0,colorspace_fragment:b0,colorspace_pars_fragment:S0,envmap_fragment:A0,envmap_common_pars_fragment:T0,envmap_pars_fragment:E0,envmap_pars_vertex:R0,envmap_physical_pars_fragment:F0,envmap_vertex:C0,fog_vertex:z0,fog_pars_vertex:P0,fog_fragment:I0,fog_pars_fragment:k0,gradientmap_pars_fragment:L0,lightmap_pars_fragment:D0,lights_lambert_fragment:N0,lights_lambert_pars_fragment:U0,lights_pars_begin:O0,lights_toon_fragment:B0,lights_toon_pars_fragment:H0,lights_phong_fragment:V0,lights_phong_pars_fragment:G0,lights_physical_fragment:W0,lights_physical_pars_fragment:X0,lights_fragment_begin:q0,lights_fragment_maps:K0,lights_fragment_end:Y0,logdepthbuf_fragment:Z0,logdepthbuf_pars_fragment:j0,logdepthbuf_pars_vertex:$0,logdepthbuf_vertex:J0,map_fragment:Q0,map_pars_fragment:tg,map_particle_fragment:eg,map_particle_pars_fragment:ng,metalnessmap_fragment:ig,metalnessmap_pars_fragment:sg,morphinstance_vertex:rg,morphcolor_vertex:og,morphnormal_vertex:ag,morphtarget_pars_vertex:cg,morphtarget_vertex:lg,normal_fragment_begin:hg,normal_fragment_maps:ug,normal_pars_fragment:dg,normal_pars_vertex:fg,normal_vertex:pg,normalmap_pars_fragment:mg,clearcoat_normal_fragment_begin:gg,clearcoat_normal_fragment_maps:_g,clearcoat_pars_fragment:yg,iridescence_pars_fragment:xg,opaque_fragment:vg,packing:Mg,premultiplied_alpha_fragment:wg,project_vertex:bg,dithering_fragment:Sg,dithering_pars_fragment:Ag,roughnessmap_fragment:Tg,roughnessmap_pars_fragment:Eg,shadowmap_pars_fragment:Rg,shadowmap_pars_vertex:Cg,shadowmap_vertex:zg,shadowmask_pars_fragment:Pg,skinbase_vertex:Ig,skinning_pars_vertex:kg,skinning_vertex:Lg,skinnormal_vertex:Dg,specularmap_fragment:Ng,specularmap_pars_fragment:Ug,tonemapping_fragment:Og,tonemapping_pars_fragment:Fg,transmission_fragment:Bg,transmission_pars_fragment:Hg,uv_pars_fragment:Vg,uv_pars_vertex:Gg,uv_vertex:Wg,worldpos_vertex:Xg,background_vert:qg,background_frag:Kg,backgroundCube_vert:Yg,backgroundCube_frag:Zg,cube_vert:jg,cube_frag:$g,depth_vert:Jg,depth_frag:Qg,distanceRGBA_vert:t_,distanceRGBA_frag:e_,equirect_vert:n_,equirect_frag:i_,linedashed_vert:s_,linedashed_frag:r_,meshbasic_vert:o_,meshbasic_frag:a_,meshlambert_vert:c_,meshlambert_frag:l_,meshmatcap_vert:h_,meshmatcap_frag:u_,meshnormal_vert:d_,meshnormal_frag:f_,meshphong_vert:p_,meshphong_frag:m_,meshphysical_vert:g_,meshphysical_frag:__,meshtoon_vert:y_,meshtoon_frag:x_,points_vert:v_,points_frag:M_,shadow_vert:w_,shadow_frag:b_,sprite_vert:S_,sprite_frag:A_},ot={common:{diffuse:{value:new tt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ut},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ut}},envmap:{envMap:{value:null},envMapRotation:{value:new Ut},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ut}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ut}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ut},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ut},normalScale:{value:new it(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ut},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ut}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ut}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ut}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new tt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new tt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0},uvTransform:{value:new Ut}},sprite:{diffuse:{value:new tt(16777215)},opacity:{value:1},center:{value:new it(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ut},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0}}},Pn={basic:{uniforms:Xe([ot.common,ot.specularmap,ot.envmap,ot.aomap,ot.lightmap,ot.fog]),vertexShader:Nt.meshbasic_vert,fragmentShader:Nt.meshbasic_frag},lambert:{uniforms:Xe([ot.common,ot.specularmap,ot.envmap,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.fog,ot.lights,{emissive:{value:new tt(0)}}]),vertexShader:Nt.meshlambert_vert,fragmentShader:Nt.meshlambert_frag},phong:{uniforms:Xe([ot.common,ot.specularmap,ot.envmap,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.fog,ot.lights,{emissive:{value:new tt(0)},specular:{value:new tt(1118481)},shininess:{value:30}}]),vertexShader:Nt.meshphong_vert,fragmentShader:Nt.meshphong_frag},standard:{uniforms:Xe([ot.common,ot.envmap,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.roughnessmap,ot.metalnessmap,ot.fog,ot.lights,{emissive:{value:new tt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag},toon:{uniforms:Xe([ot.common,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.gradientmap,ot.fog,ot.lights,{emissive:{value:new tt(0)}}]),vertexShader:Nt.meshtoon_vert,fragmentShader:Nt.meshtoon_frag},matcap:{uniforms:Xe([ot.common,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.fog,{matcap:{value:null}}]),vertexShader:Nt.meshmatcap_vert,fragmentShader:Nt.meshmatcap_frag},points:{uniforms:Xe([ot.points,ot.fog]),vertexShader:Nt.points_vert,fragmentShader:Nt.points_frag},dashed:{uniforms:Xe([ot.common,ot.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Nt.linedashed_vert,fragmentShader:Nt.linedashed_frag},depth:{uniforms:Xe([ot.common,ot.displacementmap]),vertexShader:Nt.depth_vert,fragmentShader:Nt.depth_frag},normal:{uniforms:Xe([ot.common,ot.bumpmap,ot.normalmap,ot.displacementmap,{opacity:{value:1}}]),vertexShader:Nt.meshnormal_vert,fragmentShader:Nt.meshnormal_frag},sprite:{uniforms:Xe([ot.sprite,ot.fog]),vertexShader:Nt.sprite_vert,fragmentShader:Nt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ut},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Nt.background_vert,fragmentShader:Nt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ut}},vertexShader:Nt.backgroundCube_vert,fragmentShader:Nt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Nt.cube_vert,fragmentShader:Nt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Nt.equirect_vert,fragmentShader:Nt.equirect_frag},distanceRGBA:{uniforms:Xe([ot.common,ot.displacementmap,{referencePosition:{value:new b},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Nt.distanceRGBA_vert,fragmentShader:Nt.distanceRGBA_frag},shadow:{uniforms:Xe([ot.lights,ot.fog,{color:{value:new tt(0)},opacity:{value:1}}]),vertexShader:Nt.shadow_vert,fragmentShader:Nt.shadow_frag}};Pn.physical={uniforms:Xe([Pn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ut},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ut},clearcoatNormalScale:{value:new it(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ut},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ut},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ut},sheen:{value:0},sheenColor:{value:new tt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ut},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ut},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ut},transmissionSamplerSize:{value:new it},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ut},attenuationDistance:{value:0},attenuationColor:{value:new tt(0)},specularColor:{value:new tt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ut},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ut},anisotropyVector:{value:new it},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ut}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag};var uo={r:0,b:0,g:0},ki=new ln,T_=new At;function E_(s,t,e,n,i,r,o){let a=new tt(0),c=r===!0?0:1,l,h,u=null,d=0,f=null;function p(M){let x=M.isScene===!0?M.background:null;return x&&x.isTexture&&(x=(M.backgroundBlurriness>0?e:t).get(x)),x}function _(M){let x=!1,w=p(M);w===null?g(a,c):w&&w.isColor&&(g(w,1),x=!0);let C=s.xr.getEnvironmentBlendMode();C==="additive"?n.buffers.color.setClear(0,0,0,1,o):C==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(M,x){let w=p(x);w&&(w.isCubeTexture||w.mapping===ga)?(h===void 0&&(h=new Dt(new Ke(1,1,1),new yn({name:"BackgroundCubeMaterial",uniforms:ks(Pn.backgroundCube.uniforms),vertexShader:Pn.backgroundCube.vertexShader,fragmentShader:Pn.backgroundCube.fragmentShader,side:Be,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(C,T,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),ki.copy(x.backgroundRotation),ki.x*=-1,ki.y*=-1,ki.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(ki.y*=-1,ki.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(T_.makeRotationFromEuler(ki)),h.material.toneMapped=$t.getTransfer(w.colorSpace)!==ue,(u!==w||d!==w.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,u=w,d=w.version,f=s.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(l===void 0&&(l=new Dt(new Dn(2,2),new yn({name:"BackgroundMaterial",uniforms:ks(Pn.background.uniforms),vertexShader:Pn.background.vertexShader,fragmentShader:Pn.background.fragmentShader,side:kn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=w,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=$t.getTransfer(w.colorSpace)!==ue,w.matrixAutoUpdate===!0&&w.updateMatrix(),l.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||d!==w.version||f!==s.toneMapping)&&(l.material.needsUpdate=!0,u=w,d=w.version,f=s.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function g(M,x){M.getRGB(uo,df(s)),n.buffers.color.setClear(uo.r,uo.g,uo.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(M,x=1){a.set(M),c=x,g(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(M){c=M,g(a,c)},render:_,addToRenderList:m}}function R_(s,t){let e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null),r=i,o=!1;function a(y,S,N,L,B){let Z=!1,H=u(L,N,S);r!==H&&(r=H,l(r.object)),Z=f(y,L,N,B),Z&&p(y,L,N,B),B!==null&&t.update(B,s.ELEMENT_ARRAY_BUFFER),(Z||o)&&(o=!1,w(y,S,N,L),B!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function c(){return s.createVertexArray()}function l(y){return s.bindVertexArray(y)}function h(y){return s.deleteVertexArray(y)}function u(y,S,N){let L=N.wireframe===!0,B=n[y.id];B===void 0&&(B={},n[y.id]=B);let Z=B[S.id];Z===void 0&&(Z={},B[S.id]=Z);let H=Z[L];return H===void 0&&(H=d(c()),Z[L]=H),H}function d(y){let S=[],N=[],L=[];for(let B=0;B<e;B++)S[B]=0,N[B]=0,L[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:S,enabledAttributes:N,attributeDivisors:L,object:y,attributes:{},index:null}}function f(y,S,N,L){let B=r.attributes,Z=S.attributes,H=0,$=N.getAttributes();for(let W in $)if($[W].location>=0){let ct=B[W],gt=Z[W];if(gt===void 0&&(W==="instanceMatrix"&&y.instanceMatrix&&(gt=y.instanceMatrix),W==="instanceColor"&&y.instanceColor&&(gt=y.instanceColor)),ct===void 0||ct.attribute!==gt||gt&&ct.data!==gt.data)return!0;H++}return r.attributesNum!==H||r.index!==L}function p(y,S,N,L){let B={},Z=S.attributes,H=0,$=N.getAttributes();for(let W in $)if($[W].location>=0){let ct=Z[W];ct===void 0&&(W==="instanceMatrix"&&y.instanceMatrix&&(ct=y.instanceMatrix),W==="instanceColor"&&y.instanceColor&&(ct=y.instanceColor));let gt={};gt.attribute=ct,ct&&ct.data&&(gt.data=ct.data),B[W]=gt,H++}r.attributes=B,r.attributesNum=H,r.index=L}function _(){let y=r.newAttributes;for(let S=0,N=y.length;S<N;S++)y[S]=0}function m(y){g(y,0)}function g(y,S){let N=r.newAttributes,L=r.enabledAttributes,B=r.attributeDivisors;N[y]=1,L[y]===0&&(s.enableVertexAttribArray(y),L[y]=1),B[y]!==S&&(s.vertexAttribDivisor(y,S),B[y]=S)}function M(){let y=r.newAttributes,S=r.enabledAttributes;for(let N=0,L=S.length;N<L;N++)S[N]!==y[N]&&(s.disableVertexAttribArray(N),S[N]=0)}function x(y,S,N,L,B,Z,H){H===!0?s.vertexAttribIPointer(y,S,N,B,Z):s.vertexAttribPointer(y,S,N,L,B,Z)}function w(y,S,N,L){_();let B=L.attributes,Z=N.getAttributes(),H=S.defaultAttributeValues;for(let $ in Z){let W=Z[$];if(W.location>=0){let at=B[$];if(at===void 0&&($==="instanceMatrix"&&y.instanceMatrix&&(at=y.instanceMatrix),$==="instanceColor"&&y.instanceColor&&(at=y.instanceColor)),at!==void 0){let ct=at.normalized,gt=at.itemSize,Ft=t.get(at);if(Ft===void 0)continue;let Yt=Ft.buffer,Y=Ft.type,Q=Ft.bytesPerElement,dt=Y===s.INT||Y===s.UNSIGNED_INT||at.gpuType===hh;if(at.isInterleavedBufferAttribute){let pt=at.data,kt=pt.stride,wt=at.offset;if(pt.isInstancedInterleavedBuffer){for(let Bt=0;Bt<W.locationSize;Bt++)g(W.location+Bt,pt.meshPerAttribute);y.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=pt.meshPerAttribute*pt.count)}else for(let Bt=0;Bt<W.locationSize;Bt++)m(W.location+Bt);s.bindBuffer(s.ARRAY_BUFFER,Yt);for(let Bt=0;Bt<W.locationSize;Bt++)x(W.location+Bt,gt/W.locationSize,Y,ct,kt*Q,(wt+gt/W.locationSize*Bt)*Q,dt)}else{if(at.isInstancedBufferAttribute){for(let pt=0;pt<W.locationSize;pt++)g(W.location+pt,at.meshPerAttribute);y.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let pt=0;pt<W.locationSize;pt++)m(W.location+pt);s.bindBuffer(s.ARRAY_BUFFER,Yt);for(let pt=0;pt<W.locationSize;pt++)x(W.location+pt,gt/W.locationSize,Y,ct,gt*Q,gt/W.locationSize*pt*Q,dt)}}else if(H!==void 0){let ct=H[$];if(ct!==void 0)switch(ct.length){case 2:s.vertexAttrib2fv(W.location,ct);break;case 3:s.vertexAttrib3fv(W.location,ct);break;case 4:s.vertexAttrib4fv(W.location,ct);break;default:s.vertexAttrib1fv(W.location,ct)}}}}M()}function C(){z();for(let y in n){let S=n[y];for(let N in S){let L=S[N];for(let B in L)h(L[B].object),delete L[B];delete S[N]}delete n[y]}}function T(y){if(n[y.id]===void 0)return;let S=n[y.id];for(let N in S){let L=S[N];for(let B in L)h(L[B].object),delete L[B];delete S[N]}delete n[y.id]}function E(y){for(let S in n){let N=n[S];if(N[y.id]===void 0)continue;let L=N[y.id];for(let B in L)h(L[B].object),delete L[B];delete N[y.id]}}function z(){F(),o=!0,r!==i&&(r=i,l(r.object))}function F(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:z,resetDefaultState:F,dispose:C,releaseStatesOfGeometry:T,releaseStatesOfProgram:E,initAttributes:_,enableAttribute:m,disableUnusedAttributes:M}}function C_(s,t,e){let n;function i(l){n=l}function r(l,h){s.drawArrays(n,l,h),e.update(h,n,1)}function o(l,h,u){u!==0&&(s.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function a(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let p=0;p<u;p++)f+=h[p];e.update(f,n,1)}function c(l,h,u,d){if(u===0)return;let f=t.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<l.length;p++)o(l[p],h[p],d[p]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let p=0;for(let _=0;_<u;_++)p+=h[_];for(let _=0;_<d.length;_++)e.update(p,n,d[_])}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function z_(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let E=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(E){return!(E!==gn&&n.convert(E)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){let z=E===Ir&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==Zn&&n.convert(E)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Cn&&!z)}function c(E){if(E==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control");if(d===!0){let E=t.get("EXT_clip_control");E.clipControlEXT(E.LOWER_LEFT_EXT,E.ZERO_TO_ONE_EXT)}let f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),M=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),x=s.getParameter(s.MAX_VARYING_VECTORS),w=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),C=p>0,T=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:M,maxVaryings:x,maxFragmentUniforms:w,vertexTextures:C,maxSamples:T}}function P_(s){let t=this,e=null,n=0,i=!1,r=!1,o=new qn,a=new Ut,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){let p=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,g=s.get(u);if(!i||p===null||p.length===0||r&&!m)r?h(null):l();else{let M=r?0:n,x=M*4,w=g.clippingState||null;c.value=w,w=h(p,d,x,f);for(let C=0;C!==x;++C)w[C]=e[C];g.clippingState=w,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,p){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=c.value,p!==!0||m===null){let g=f+_*4,M=d.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<g)&&(m=new Float32Array(g));for(let x=0,w=f;x!==_;++x,w+=4)o.copy(u[x]).applyMatrix4(M,a),o.normal.toArray(m,w),m[w+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function I_(s){let t=new WeakMap;function e(o,a){return a===gr?o.mapping=Ts:a===Xc&&(o.mapping=Es),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===gr||a===Xc)if(t.has(o)){let c=t.get(o).texture;return e(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new bl(c.height);return l.fromEquirectangularTexture(s,o),t.set(o,l),o.addEventListener("dispose",i),e(l.texture,o.mapping)}else return null}}return o}function i(o){let a=o.target;a.removeEventListener("dispose",i);let c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var yi=class extends Go{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-t,o=n+t,a=i+e,c=i-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},xs=4,$u=[.125,.215,.35,.446,.526,.582],Ui=20,Mc=new yi,Ju=new tt,wc=null,bc=0,Sc=0,Ac=!1,Di=(1+Math.sqrt(5))/2,hs=1/Di,Qu=[new b(-Di,hs,0),new b(Di,hs,0),new b(-hs,0,Di),new b(hs,0,Di),new b(0,Di,-hs),new b(0,Di,hs),new b(-1,1,-1),new b(1,1,-1),new b(-1,1,1),new b(1,1,1)],Ls=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){wc=this._renderer.getRenderTarget(),bc=this._renderer.getActiveCubeFace(),Sc=this._renderer.getActiveMipmapLevel(),Ac=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,i,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=nd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ed(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(wc,bc,Sc),this._renderer.xr.enabled=Ac,t.scissorTest=!1,fo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ts||t.mapping===Es?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),wc=this._renderer.getRenderTarget(),bc=this._renderer.getActiveCubeFace(),Sc=this._renderer.getActiveMipmapLevel(),Ac=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Je,minFilter:Je,generateMipmaps:!1,type:Ir,format:gn,colorSpace:Ie,depthBuffer:!1},i=td(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=td(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=k_(r)),this._blurMaterial=L_(r,t,e)}return i}_compileMaterial(t){let e=new Dt(this._lodPlanes[0],t);this._renderer.compile(e,Mc)}_sceneToCubeUV(t,e,n,i){let a=new De(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Ju),h.toneMapping=_i,h.autoClear=!1;let f=new le({name:"PMREM.Background",side:Be,depthWrite:!1,depthTest:!1}),p=new Dt(new Ke,f),_=!1,m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,_=!0):(f.color.copy(Ju),_=!0);for(let g=0;g<6;g++){let M=g%3;M===0?(a.up.set(0,c[g],0),a.lookAt(l[g],0,0)):M===1?(a.up.set(0,0,c[g]),a.lookAt(0,l[g],0)):(a.up.set(0,c[g],0),a.lookAt(0,0,l[g]));let x=this._cubeSize;fo(i,M*x,g>2?x:0,x,x),h.setRenderTarget(i),_&&h.render(p,a),h.render(t,a)}p.geometry.dispose(),p.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){let n=this._renderer,i=t.mapping===Ts||t.mapping===Es;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=nd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ed());let r=i?this._cubemapMaterial:this._equirectMaterial,o=new Dt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let c=this._cubeSize;fo(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,Mc)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let i=this._lodPlanes.length;for(let r=1;r<i;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Qu[(i-r-1)%Qu.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,i,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new Dt(this._lodPlanes[i],l),d=l.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Ui-1),_=r/p,m=isFinite(r)?1+Math.floor(h*_):Ui;m>Ui&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ui}`);let g=[],M=0;for(let E=0;E<Ui;++E){let z=E/_,F=Math.exp(-z*z/2);g.push(F),E===0?M+=F:E<m&&(M+=2*F)}for(let E=0;E<g.length;E++)g[E]=g[E]/M;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=g,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:x}=this;d.dTheta.value=p,d.mipInt.value=x-n;let w=this._sizeLods[i],C=3*w*(i>x-xs?i-x+xs:0),T=4*(this._cubeSize-w);fo(e,C,T,3*w,2*w),c.setRenderTarget(e),c.render(u,Mc)}};function k_(s){let t=[],e=[],n=[],i=s,r=s-xs+1+$u.length;for(let o=0;o<r;o++){let a=Math.pow(2,i);e.push(a);let c=1/a;o>s-xs?c=$u[o-s+xs-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,p=6,_=3,m=2,g=1,M=new Float32Array(_*p*f),x=new Float32Array(m*p*f),w=new Float32Array(g*p*f);for(let T=0;T<f;T++){let E=T%3*2/3-1,z=T>2?0:-1,F=[E,z,0,E+2/3,z,0,E+2/3,z+1,0,E,z,0,E+2/3,z+1,0,E,z+1,0];M.set(F,_*p*T),x.set(d,m*p*T);let y=[T,T,T,T,T,T];w.set(y,g*p*T)}let C=new Jt;C.setAttribute("position",new Se(M,_)),C.setAttribute("uv",new Se(x,m)),C.setAttribute("faceIndex",new Se(w,g)),t.push(C),i>xs&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function td(s,t,e){let n=new $n(s,t,e);return n.texture.mapping=ga,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function fo(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function L_(s,t,e){let n=new Float32Array(Ui),i=new b(0,1,0);return new yn({name:"SphericalGaussianBlur",defines:{n:Ui,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:wh(),fragmentShader:`

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
		`,blending:gi,depthTest:!1,depthWrite:!1})}function ed(){return new yn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:wh(),fragmentShader:`

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
		`,blending:gi,depthTest:!1,depthWrite:!1})}function nd(){return new yn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:wh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function wh(){return`

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
	`}function D_(s){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===gr||c===Xc,h=c===Ts||c===Es;if(l||h){let u=t.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new Ls(s)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{let f=a.image;return l&&f&&f.height>0||h&&f&&i(f)?(e===null&&(e=new Ls(s)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function i(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function N_(s){let t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let i=e(n);return i===null&&Io("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function U_(s,t,e,n){let i={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let p in d.attributes)t.remove(d.attributes[p]);for(let p in d.morphAttributes){let _=d.morphAttributes[p];for(let m=0,g=_.length;m<g;m++)t.remove(_[m])}d.removeEventListener("dispose",o),delete i[d.id];let f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,e.memory.geometries++),d}function c(u){let d=u.attributes;for(let p in d)t.update(d[p],s.ARRAY_BUFFER);let f=u.morphAttributes;for(let p in f){let _=f[p];for(let m=0,g=_.length;m<g;m++)t.update(_[m],s.ARRAY_BUFFER)}}function l(u){let d=[],f=u.index,p=u.attributes.position,_=0;if(f!==null){let M=f.array;_=f.version;for(let x=0,w=M.length;x<w;x+=3){let C=M[x+0],T=M[x+1],E=M[x+2];d.push(C,T,T,E,E,C)}}else if(p!==void 0){let M=p.array;_=p.version;for(let x=0,w=M.length/3-1;x<w;x+=3){let C=x+0,T=x+1,E=x+2;d.push(C,T,T,E,E,C)}}else return;let m=new(hf(d)?Vo:Ho)(d,1);m.version=_;let g=r.get(u);g&&t.remove(g),r.set(u,m)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function O_(s,t,e){let n;function i(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,f){s.drawElements(n,f,r,d*o),e.update(f,n,1)}function l(d,f,p){p!==0&&(s.drawElementsInstanced(n,f,r,d*o,p),e.update(f,n,p))}function h(d,f,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,p);let m=0;for(let g=0;g<p;g++)m+=f[g];e.update(m,n,1)}function u(d,f,p,_){if(p===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<d.length;g++)l(d[g]/o,f[g],_[g]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,_,0,p);let g=0;for(let M=0;M<p;M++)g+=f[M];for(let M=0;M<_.length;M++)e.update(g,n,_[M])}}this.setMode=i,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function F_(s){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function B_(s,t,e){let n=new WeakMap,i=new Kt;function r(o,a,c){let l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let F=function(){E.dispose(),n.delete(a),a.removeEventListener("dispose",F)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],M=a.morphAttributes.color||[],x=0;f===!0&&(x=1),p===!0&&(x=2),_===!0&&(x=3);let w=a.attributes.position.count*x,C=1;w>t.maxTextureSize&&(C=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);let T=new Float32Array(w*C*4*u),E=new Bo(T,w,C,u);E.type=Cn,E.needsUpdate=!0;let z=x*4;for(let y=0;y<u;y++){let S=m[y],N=g[y],L=M[y],B=w*C*4*y;for(let Z=0;Z<S.count;Z++){let H=Z*z;f===!0&&(i.fromBufferAttribute(S,Z),T[B+H+0]=i.x,T[B+H+1]=i.y,T[B+H+2]=i.z,T[B+H+3]=0),p===!0&&(i.fromBufferAttribute(N,Z),T[B+H+4]=i.x,T[B+H+5]=i.y,T[B+H+6]=i.z,T[B+H+7]=0),_===!0&&(i.fromBufferAttribute(L,Z),T[B+H+8]=i.x,T[B+H+9]=i.y,T[B+H+10]=i.z,T[B+H+11]=L.itemSize===4?i.w:1)}}d={count:u,texture:E,size:new it(w,C)},n.set(a,d),a.addEventListener("dispose",F)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",o.morphTexture,e);else{let f=0;for(let _=0;_<l.length;_++)f+=l[_];let p=a.morphTargetsRelative?1:1-f;c.getUniforms().setValue(s,"morphTargetBaseInfluence",p),c.getUniforms().setValue(s,"morphTargetInfluences",l)}c.getUniforms().setValue(s,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function H_(s,t,e,n){let i=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,u=t.get(c,h);if(i.get(u)!==l&&(t.update(u),i.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),i.get(c)!==l&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){let d=c.skeleton;i.get(d)!==l&&(d.update(),i.set(d,l))}return u}function o(){i=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}var Xo=class extends Pe{constructor(t,e,n,i,r,o,a,c,l,h=ws){if(h!==ws&&h!==Cs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ws&&(n=Fi),n===void 0&&h===Cs&&(n=Rs),super(null,i,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Fe,this.minFilter=c!==void 0?c:Fe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},pf=new Pe,id=new Xo(1,1),mf=new Bo,gf=new Ml,_f=new Wo,sd=[],rd=[],od=new Float32Array(16),ad=new Float32Array(9),cd=new Float32Array(4);function Hs(s,t,e){let n=s[0];if(n<=0||n>0)return s;let i=t*e,r=sd[i];if(r===void 0&&(r=new Float32Array(i),sd[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function Te(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Ee(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function xa(s,t){let e=rd[t];e===void 0&&(e=new Int32Array(t),rd[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function V_(s,t){let e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function G_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;s.uniform2fv(this.addr,t),Ee(e,t)}}function W_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Te(e,t))return;s.uniform3fv(this.addr,t),Ee(e,t)}}function X_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;s.uniform4fv(this.addr,t),Ee(e,t)}}function q_(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Ee(e,t)}else{if(Te(e,n))return;cd.set(n),s.uniformMatrix2fv(this.addr,!1,cd),Ee(e,n)}}function K_(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Ee(e,t)}else{if(Te(e,n))return;ad.set(n),s.uniformMatrix3fv(this.addr,!1,ad),Ee(e,n)}}function Y_(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Ee(e,t)}else{if(Te(e,n))return;od.set(n),s.uniformMatrix4fv(this.addr,!1,od),Ee(e,n)}}function Z_(s,t){let e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function j_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;s.uniform2iv(this.addr,t),Ee(e,t)}}function $_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Te(e,t))return;s.uniform3iv(this.addr,t),Ee(e,t)}}function J_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;s.uniform4iv(this.addr,t),Ee(e,t)}}function Q_(s,t){let e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function ty(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;s.uniform2uiv(this.addr,t),Ee(e,t)}}function ey(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Te(e,t))return;s.uniform3uiv(this.addr,t),Ee(e,t)}}function ny(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;s.uniform4uiv(this.addr,t),Ee(e,t)}}function iy(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(id.compareFunction=af,r=id):r=pf,e.setTexture2D(t||r,i)}function sy(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||gf,i)}function ry(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||_f,i)}function oy(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||mf,i)}function ay(s){switch(s){case 5126:return V_;case 35664:return G_;case 35665:return W_;case 35666:return X_;case 35674:return q_;case 35675:return K_;case 35676:return Y_;case 5124:case 35670:return Z_;case 35667:case 35671:return j_;case 35668:case 35672:return $_;case 35669:case 35673:return J_;case 5125:return Q_;case 36294:return ty;case 36295:return ey;case 36296:return ny;case 35678:case 36198:case 36298:case 36306:case 35682:return iy;case 35679:case 36299:case 36307:return sy;case 35680:case 36300:case 36308:case 36293:return ry;case 36289:case 36303:case 36311:case 36292:return oy}}function cy(s,t){s.uniform1fv(this.addr,t)}function ly(s,t){let e=Hs(t,this.size,2);s.uniform2fv(this.addr,e)}function hy(s,t){let e=Hs(t,this.size,3);s.uniform3fv(this.addr,e)}function uy(s,t){let e=Hs(t,this.size,4);s.uniform4fv(this.addr,e)}function dy(s,t){let e=Hs(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function fy(s,t){let e=Hs(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function py(s,t){let e=Hs(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function my(s,t){s.uniform1iv(this.addr,t)}function gy(s,t){s.uniform2iv(this.addr,t)}function _y(s,t){s.uniform3iv(this.addr,t)}function yy(s,t){s.uniform4iv(this.addr,t)}function xy(s,t){s.uniform1uiv(this.addr,t)}function vy(s,t){s.uniform2uiv(this.addr,t)}function My(s,t){s.uniform3uiv(this.addr,t)}function wy(s,t){s.uniform4uiv(this.addr,t)}function by(s,t,e){let n=this.cache,i=t.length,r=xa(e,i);Te(n,r)||(s.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||pf,r[o])}function Sy(s,t,e){let n=this.cache,i=t.length,r=xa(e,i);Te(n,r)||(s.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||gf,r[o])}function Ay(s,t,e){let n=this.cache,i=t.length,r=xa(e,i);Te(n,r)||(s.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||_f,r[o])}function Ty(s,t,e){let n=this.cache,i=t.length,r=xa(e,i);Te(n,r)||(s.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||mf,r[o])}function Ey(s){switch(s){case 5126:return cy;case 35664:return ly;case 35665:return hy;case 35666:return uy;case 35674:return dy;case 35675:return fy;case 35676:return py;case 5124:case 35670:return my;case 35667:case 35671:return gy;case 35668:case 35672:return _y;case 35669:case 35673:return yy;case 5125:return xy;case 36294:return vy;case 36295:return My;case 36296:return wy;case 35678:case 36198:case 36298:case 36306:case 35682:return by;case 35679:case 36299:case 36307:return Sy;case 35680:case 36300:case 36308:case 36293:return Ay;case 36289:case 36303:case 36311:case 36292:return Ty}}var Sl=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=ay(e.type)}},Al=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Ey(e.type)}},Tl=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let r=0,o=i.length;r!==o;++r){let a=i[r];a.setValue(t,e[a.id],n)}}},Tc=/(\w+)(\])?(\[|\.)?/g;function ld(s,t){s.seq.push(t),s.map[t.id]=t}function Ry(s,t,e){let n=s.name,i=n.length;for(Tc.lastIndex=0;;){let r=Tc.exec(n),o=Tc.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===i){ld(e,l===void 0?new Sl(a,s,t):new Al(a,s,t));break}else{let u=e.map[a];u===void 0&&(u=new Tl(a),ld(e,u)),e=u}}}var Ss=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let r=t.getActiveUniform(e,i),o=t.getUniformLocation(e,r.name);Ry(r,o,this)}}setValue(t,e,n,i){let r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){let a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,r=t.length;i!==r;++i){let o=t[i];o.id in e&&n.push(o)}return n}};function hd(s,t,e){let n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}var Cy=37297,zy=0;function Py(s,t){let e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function Iy(s){let t=$t.getPrimaries($t.workingColorSpace),e=$t.getPrimaries(s),n;switch(t===e?n="":t===Uo&&e===No?n="LinearDisplayP3ToLinearSRGB":t===No&&e===Uo&&(n="LinearSRGBToLinearDisplayP3"),s){case Ie:case ya:return[n,"LinearTransferOETF"];case qt:case vh:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function ud(s,t,e){let n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";let r=/ERROR: 0:(\d+)/.exec(i);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+i+`

`+Py(s.getShaderSource(t),o)}else return i}function ky(s,t){let e=Iy(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Ly(s,t){let e;switch(t){case Vp:e="Linear";break;case Gp:e="Reinhard";break;case Wp:e="Cineon";break;case ch:e="ACESFilmic";break;case qp:e="AgX";break;case Kp:e="Neutral";break;case Xp:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var po=new b;function Dy(){$t.getLuminanceCoefficients(po);let s=po.x.toFixed(4),t=po.y.toFixed(4),e=po.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Ny(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(cr).join(`
`)}function Uy(s){let t=[];for(let e in s){let n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Oy(s,t){let e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(t,i),o=r.name,a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function cr(s){return s!==""}function dd(s,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function fd(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Fy=/^[ \t]*#include +<([\w\d./]+)>/gm;function El(s){return s.replace(Fy,Hy)}var By=new Map;function Hy(s,t){let e=Nt[t];if(e===void 0){let n=By.get(t);if(n!==void 0)e=Nt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return El(e)}var Vy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function pd(s){return s.replace(Vy,Gy)}function Gy(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function md(s){let t=`precision ${s.precision} float;
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
#define LOW_PRECISION`),t}function Wy(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Kd?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===oh?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Xn&&(t="SHADOWMAP_TYPE_VSM"),t}function Xy(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Ts:case Es:t="ENVMAP_TYPE_CUBE";break;case ga:t="ENVMAP_TYPE_CUBE_UV";break}return t}function qy(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Es:t="ENVMAP_MODE_REFRACTION";break}return t}function Ky(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case ah:t="ENVMAP_BLENDING_MULTIPLY";break;case Bp:t="ENVMAP_BLENDING_MIX";break;case Hp:t="ENVMAP_BLENDING_ADD";break}return t}function Yy(s){let t=s.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Zy(s,t,e,n){let i=s.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,c=Wy(e),l=Xy(e),h=qy(e),u=Ky(e),d=Yy(e),f=Ny(e),p=Uy(r),_=i.createProgram(),m,g,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(cr).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(cr).join(`
`),g.length>0&&(g+=`
`)):(m=[md(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(cr).join(`
`),g=[md(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==_i?"#define TONE_MAPPING":"",e.toneMapping!==_i?Nt.tonemapping_pars_fragment:"",e.toneMapping!==_i?Ly("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Nt.colorspace_pars_fragment,ky("linearToOutputTexel",e.outputColorSpace),Dy(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(cr).join(`
`)),o=El(o),o=dd(o,e),o=fd(o,e),a=El(a),a=dd(a,e),a=fd(a,e),o=pd(o),a=pd(a),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",e.glslVersion===Iu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Iu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let x=M+m+o,w=M+g+a,C=hd(i,i.VERTEX_SHADER,x),T=hd(i,i.FRAGMENT_SHADER,w);i.attachShader(_,C),i.attachShader(_,T),e.index0AttributeName!==void 0?i.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function E(S){if(s.debug.checkShaderErrors){let N=i.getProgramInfoLog(_).trim(),L=i.getShaderInfoLog(C).trim(),B=i.getShaderInfoLog(T).trim(),Z=!0,H=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(Z=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,C,T);else{let $=ud(i,C,"vertex"),W=ud(i,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+S.name+`
Material Type: `+S.type+`

Program Info Log: `+N+`
`+$+`
`+W)}else N!==""?console.warn("THREE.WebGLProgram: Program Info Log:",N):(L===""||B==="")&&(H=!1);H&&(S.diagnostics={runnable:Z,programLog:N,vertexShader:{log:L,prefix:m},fragmentShader:{log:B,prefix:g}})}i.deleteShader(C),i.deleteShader(T),z=new Ss(i,_),F=Oy(i,_)}let z;this.getUniforms=function(){return z===void 0&&E(this),z};let F;this.getAttributes=function(){return F===void 0&&E(this),F};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=i.getProgramParameter(_,Cy)),y},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=zy++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=C,this.fragmentShader=T,this}var jy=0,Rl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Cl(t),e.set(t,n)),n}},Cl=class{constructor(t){this.id=jy++,this.code=t,this.usedTimes=0}};function $y(s,t,e,n,i,r,o){let a=new vr,c=new Rl,l=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.reverseDepthBuffer,f=i.vertexTextures,p=i.precision,_={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(y){return l.add(y),y===0?"uv":`uv${y}`}function g(y,S,N,L,B){let Z=L.fog,H=B.geometry,$=y.isMeshStandardMaterial?L.environment:null,W=(y.isMeshStandardMaterial?e:t).get(y.envMap||$),at=W&&W.mapping===ga?W.image.height:null,ct=_[y.type];y.precision!==null&&(p=i.getMaxPrecision(y.precision),p!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",p,"instead."));let gt=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,Ft=gt!==void 0?gt.length:0,Yt=0;H.morphAttributes.position!==void 0&&(Yt=1),H.morphAttributes.normal!==void 0&&(Yt=2),H.morphAttributes.color!==void 0&&(Yt=3);let Y,Q,dt,pt;if(ct){let $e=Pn[ct];Y=$e.vertexShader,Q=$e.fragmentShader}else Y=y.vertexShader,Q=y.fragmentShader,c.update(y),dt=c.getVertexShaderID(y),pt=c.getFragmentShaderID(y);let kt=s.getRenderTarget(),wt=B.isInstancedMesh===!0,Bt=B.isBatchedMesh===!0,Zt=!!y.map,Gt=!!y.matcap,P=!!W,Ge=!!y.aoMap,Wt=!!y.lightMap,Ht=!!y.bumpMap,Et=!!y.normalMap,se=!!y.displacementMap,zt=!!y.emissiveMap,R=!!y.metalnessMap,v=!!y.roughnessMap,k=y.anisotropy>0,I=y.clearcoat>0,K=y.dispersion>0,X=y.iridescence>0,rt=y.sheen>0,et=y.transmission>0,st=k&&!!y.anisotropyMap,xt=I&&!!y.clearcoatMap,J=I&&!!y.clearcoatNormalMap,_t=I&&!!y.clearcoatRoughnessMap,Pt=X&&!!y.iridescenceMap,Rt=X&&!!y.iridescenceThicknessMap,ft=rt&&!!y.sheenColorMap,Xt=rt&&!!y.sheenRoughnessMap,Lt=!!y.specularMap,Qt=!!y.specularColorMap,D=!!y.specularIntensityMap,lt=et&&!!y.transmissionMap,q=et&&!!y.thicknessMap,j=!!y.gradientMap,ht=!!y.alphaMap,mt=y.alphaTest>0,jt=!!y.alphaHash,ve=!!y.extensions,je=_i;y.toneMapped&&(kt===null||kt.isXRRenderTarget===!0)&&(je=s.toneMapping);let te={shaderID:ct,shaderType:y.type,shaderName:y.name,vertexShader:Y,fragmentShader:Q,defines:y.defines,customVertexShaderID:dt,customFragmentShaderID:pt,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:p,batching:Bt,batchingColor:Bt&&B._colorsTexture!==null,instancing:wt,instancingColor:wt&&B.instanceColor!==null,instancingMorph:wt&&B.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:kt===null?s.outputColorSpace:kt.isXRRenderTarget===!0?kt.texture.colorSpace:Ie,alphaToCoverage:!!y.alphaToCoverage,map:Zt,matcap:Gt,envMap:P,envMapMode:P&&W.mapping,envMapCubeUVHeight:at,aoMap:Ge,lightMap:Wt,bumpMap:Ht,normalMap:Et,displacementMap:f&&se,emissiveMap:zt,normalMapObjectSpace:Et&&y.normalMapType===Qp,normalMapTangentSpace:Et&&y.normalMapType===xh,metalnessMap:R,roughnessMap:v,anisotropy:k,anisotropyMap:st,clearcoat:I,clearcoatMap:xt,clearcoatNormalMap:J,clearcoatRoughnessMap:_t,dispersion:K,iridescence:X,iridescenceMap:Pt,iridescenceThicknessMap:Rt,sheen:rt,sheenColorMap:ft,sheenRoughnessMap:Xt,specularMap:Lt,specularColorMap:Qt,specularIntensityMap:D,transmission:et,transmissionMap:lt,thicknessMap:q,gradientMap:j,opaque:y.transparent===!1&&y.blending===Ms&&y.alphaToCoverage===!1,alphaMap:ht,alphaTest:mt,alphaHash:jt,combine:y.combine,mapUv:Zt&&m(y.map.channel),aoMapUv:Ge&&m(y.aoMap.channel),lightMapUv:Wt&&m(y.lightMap.channel),bumpMapUv:Ht&&m(y.bumpMap.channel),normalMapUv:Et&&m(y.normalMap.channel),displacementMapUv:se&&m(y.displacementMap.channel),emissiveMapUv:zt&&m(y.emissiveMap.channel),metalnessMapUv:R&&m(y.metalnessMap.channel),roughnessMapUv:v&&m(y.roughnessMap.channel),anisotropyMapUv:st&&m(y.anisotropyMap.channel),clearcoatMapUv:xt&&m(y.clearcoatMap.channel),clearcoatNormalMapUv:J&&m(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:_t&&m(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Pt&&m(y.iridescenceMap.channel),iridescenceThicknessMapUv:Rt&&m(y.iridescenceThicknessMap.channel),sheenColorMapUv:ft&&m(y.sheenColorMap.channel),sheenRoughnessMapUv:Xt&&m(y.sheenRoughnessMap.channel),specularMapUv:Lt&&m(y.specularMap.channel),specularColorMapUv:Qt&&m(y.specularColorMap.channel),specularIntensityMapUv:D&&m(y.specularIntensityMap.channel),transmissionMapUv:lt&&m(y.transmissionMap.channel),thicknessMapUv:q&&m(y.thicknessMap.channel),alphaMapUv:ht&&m(y.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(Et||k),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!H.attributes.uv&&(Zt||ht),fog:!!Z,useFog:y.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:d,skinning:B.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:Ft,morphTextureStride:Yt,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:s.shadowMap.enabled&&N.length>0,shadowMapType:s.shadowMap.type,toneMapping:je,decodeVideoTexture:Zt&&y.map.isVideoTexture===!0&&$t.getTransfer(y.map.colorSpace)===ue,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===de,flipSided:y.side===Be,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:ve&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ve&&y.extensions.multiDraw===!0||Bt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return te.vertexUv1s=l.has(1),te.vertexUv2s=l.has(2),te.vertexUv3s=l.has(3),l.clear(),te}function M(y){let S=[];if(y.shaderID?S.push(y.shaderID):(S.push(y.customVertexShaderID),S.push(y.customFragmentShaderID)),y.defines!==void 0)for(let N in y.defines)S.push(N),S.push(y.defines[N]);return y.isRawShaderMaterial===!1&&(x(S,y),w(S,y),S.push(s.outputColorSpace)),S.push(y.customProgramCacheKey),S.join()}function x(y,S){y.push(S.precision),y.push(S.outputColorSpace),y.push(S.envMapMode),y.push(S.envMapCubeUVHeight),y.push(S.mapUv),y.push(S.alphaMapUv),y.push(S.lightMapUv),y.push(S.aoMapUv),y.push(S.bumpMapUv),y.push(S.normalMapUv),y.push(S.displacementMapUv),y.push(S.emissiveMapUv),y.push(S.metalnessMapUv),y.push(S.roughnessMapUv),y.push(S.anisotropyMapUv),y.push(S.clearcoatMapUv),y.push(S.clearcoatNormalMapUv),y.push(S.clearcoatRoughnessMapUv),y.push(S.iridescenceMapUv),y.push(S.iridescenceThicknessMapUv),y.push(S.sheenColorMapUv),y.push(S.sheenRoughnessMapUv),y.push(S.specularMapUv),y.push(S.specularColorMapUv),y.push(S.specularIntensityMapUv),y.push(S.transmissionMapUv),y.push(S.thicknessMapUv),y.push(S.combine),y.push(S.fogExp2),y.push(S.sizeAttenuation),y.push(S.morphTargetsCount),y.push(S.morphAttributeCount),y.push(S.numDirLights),y.push(S.numPointLights),y.push(S.numSpotLights),y.push(S.numSpotLightMaps),y.push(S.numHemiLights),y.push(S.numRectAreaLights),y.push(S.numDirLightShadows),y.push(S.numPointLightShadows),y.push(S.numSpotLightShadows),y.push(S.numSpotLightShadowsWithMaps),y.push(S.numLightProbes),y.push(S.shadowMapType),y.push(S.toneMapping),y.push(S.numClippingPlanes),y.push(S.numClipIntersection),y.push(S.depthPacking)}function w(y,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),y.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reverseDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.alphaToCoverage&&a.enable(20),y.push(a.mask)}function C(y){let S=_[y.type],N;if(S){let L=Pn[S];N=Hm.clone(L.uniforms)}else N=y.uniforms;return N}function T(y,S){let N;for(let L=0,B=h.length;L<B;L++){let Z=h[L];if(Z.cacheKey===S){N=Z,++N.usedTimes;break}}return N===void 0&&(N=new Zy(s,S,y,r),h.push(N)),N}function E(y){if(--y.usedTimes===0){let S=h.indexOf(y);h[S]=h[h.length-1],h.pop(),y.destroy()}}function z(y){c.remove(y)}function F(){c.dispose()}return{getParameters:g,getProgramCacheKey:M,getUniforms:C,acquireProgram:T,releaseProgram:E,releaseShaderCache:z,programs:h,dispose:F}}function Jy(){let s=new WeakMap;function t(o){return s.has(o)}function e(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,c){s.get(o)[a]=c}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function Qy(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function gd(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function _d(){let s=[],t=0,e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(u,d,f,p,_,m){let g=s[t];return g===void 0?(g={id:u.id,object:u,geometry:d,material:f,groupOrder:p,renderOrder:u.renderOrder,z:_,group:m},s[t]=g):(g.id=u.id,g.object=u,g.geometry=d,g.material=f,g.groupOrder=p,g.renderOrder=u.renderOrder,g.z=_,g.group=m),t++,g}function a(u,d,f,p,_,m){let g=o(u,d,f,p,_,m);f.transmission>0?n.push(g):f.transparent===!0?i.push(g):e.push(g)}function c(u,d,f,p,_,m){let g=o(u,d,f,p,_,m);f.transmission>0?n.unshift(g):f.transparent===!0?i.unshift(g):e.unshift(g)}function l(u,d){e.length>1&&e.sort(u||Qy),n.length>1&&n.sort(d||gd),i.length>1&&i.sort(d||gd)}function h(){for(let u=t,d=s.length;u<d;u++){let f=s[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:a,unshift:c,finish:h,sort:l}}function tx(){let s=new WeakMap;function t(n,i){let r=s.get(n),o;return r===void 0?(o=new _d,s.set(n,[o])):i>=r.length?(o=new _d,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function ex(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new b,color:new tt};break;case"SpotLight":e={position:new b,direction:new b,color:new tt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new b,color:new tt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new b,skyColor:new tt,groundColor:new tt};break;case"RectAreaLight":e={color:new tt,position:new b,halfWidth:new b,halfHeight:new b};break}return s[t.id]=e,e}}}function nx(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}var ix=0;function sx(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function rx(s){let t=new ex,e=nx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new b);let i=new b,r=new At,o=new At;function a(l){let h=0,u=0,d=0;for(let F=0;F<9;F++)n.probe[F].set(0,0,0);let f=0,p=0,_=0,m=0,g=0,M=0,x=0,w=0,C=0,T=0,E=0;l.sort(sx);for(let F=0,y=l.length;F<y;F++){let S=l[F],N=S.color,L=S.intensity,B=S.distance,Z=S.shadow&&S.shadow.map?S.shadow.map.texture:null;if(S.isAmbientLight)h+=N.r*L,u+=N.g*L,d+=N.b*L;else if(S.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(S.sh.coefficients[H],L);E++}else if(S.isDirectionalLight){let H=t.get(S);if(H.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let $=S.shadow,W=e.get(S);W.shadowIntensity=$.intensity,W.shadowBias=$.bias,W.shadowNormalBias=$.normalBias,W.shadowRadius=$.radius,W.shadowMapSize=$.mapSize,n.directionalShadow[f]=W,n.directionalShadowMap[f]=Z,n.directionalShadowMatrix[f]=S.shadow.matrix,M++}n.directional[f]=H,f++}else if(S.isSpotLight){let H=t.get(S);H.position.setFromMatrixPosition(S.matrixWorld),H.color.copy(N).multiplyScalar(L),H.distance=B,H.coneCos=Math.cos(S.angle),H.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),H.decay=S.decay,n.spot[_]=H;let $=S.shadow;if(S.map&&(n.spotLightMap[C]=S.map,C++,$.updateMatrices(S),S.castShadow&&T++),n.spotLightMatrix[_]=$.matrix,S.castShadow){let W=e.get(S);W.shadowIntensity=$.intensity,W.shadowBias=$.bias,W.shadowNormalBias=$.normalBias,W.shadowRadius=$.radius,W.shadowMapSize=$.mapSize,n.spotShadow[_]=W,n.spotShadowMap[_]=Z,w++}_++}else if(S.isRectAreaLight){let H=t.get(S);H.color.copy(N).multiplyScalar(L),H.halfWidth.set(S.width*.5,0,0),H.halfHeight.set(0,S.height*.5,0),n.rectArea[m]=H,m++}else if(S.isPointLight){let H=t.get(S);if(H.color.copy(S.color).multiplyScalar(S.intensity),H.distance=S.distance,H.decay=S.decay,S.castShadow){let $=S.shadow,W=e.get(S);W.shadowIntensity=$.intensity,W.shadowBias=$.bias,W.shadowNormalBias=$.normalBias,W.shadowRadius=$.radius,W.shadowMapSize=$.mapSize,W.shadowCameraNear=$.camera.near,W.shadowCameraFar=$.camera.far,n.pointShadow[p]=W,n.pointShadowMap[p]=Z,n.pointShadowMatrix[p]=S.shadow.matrix,x++}n.point[p]=H,p++}else if(S.isHemisphereLight){let H=t.get(S);H.skyColor.copy(S.color).multiplyScalar(L),H.groundColor.copy(S.groundColor).multiplyScalar(L),n.hemi[g]=H,g++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ot.LTC_FLOAT_1,n.rectAreaLTC2=ot.LTC_FLOAT_2):(n.rectAreaLTC1=ot.LTC_HALF_1,n.rectAreaLTC2=ot.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let z=n.hash;(z.directionalLength!==f||z.pointLength!==p||z.spotLength!==_||z.rectAreaLength!==m||z.hemiLength!==g||z.numDirectionalShadows!==M||z.numPointShadows!==x||z.numSpotShadows!==w||z.numSpotMaps!==C||z.numLightProbes!==E)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=p,n.hemi.length=g,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=w,n.spotShadowMap.length=w,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=w+C-T,n.spotLightMap.length=C,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=E,z.directionalLength=f,z.pointLength=p,z.spotLength=_,z.rectAreaLength=m,z.hemiLength=g,z.numDirectionalShadows=M,z.numPointShadows=x,z.numSpotShadows=w,z.numSpotMaps=C,z.numLightProbes=E,n.version=ix++)}function c(l,h){let u=0,d=0,f=0,p=0,_=0,m=h.matrixWorldInverse;for(let g=0,M=l.length;g<M;g++){let x=l[g];if(x.isDirectionalLight){let w=n.directional[u];w.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),w.direction.sub(i),w.direction.transformDirection(m),u++}else if(x.isSpotLight){let w=n.spot[f];w.position.setFromMatrixPosition(x.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),w.direction.sub(i),w.direction.transformDirection(m),f++}else if(x.isRectAreaLight){let w=n.rectArea[p];w.position.setFromMatrixPosition(x.matrixWorld),w.position.applyMatrix4(m),o.identity(),r.copy(x.matrixWorld),r.premultiply(m),o.extractRotation(r),w.halfWidth.set(x.width*.5,0,0),w.halfHeight.set(0,x.height*.5,0),w.halfWidth.applyMatrix4(o),w.halfHeight.applyMatrix4(o),p++}else if(x.isPointLight){let w=n.point[d];w.position.setFromMatrixPosition(x.matrixWorld),w.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){let w=n.hemi[_];w.direction.setFromMatrixPosition(x.matrixWorld),w.direction.transformDirection(m),_++}}}return{setup:a,setupView:c,state:n}}function yd(s){let t=new rx(s),e=[],n=[];function i(h){l.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}let l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function ox(s){let t=new WeakMap;function e(i,r=0){let o=t.get(i),a;return o===void 0?(a=new yd(s),t.set(i,[a])):r>=o.length?(a=new yd(s),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var zl=class extends qe{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=$p,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Pl=class extends qe{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},ax=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,cx=`uniform sampler2D shadow_pass;
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
}`;function lx(s,t,e){let n=new Mr,i=new it,r=new it,o=new Kt,a=new zl({depthPacking:Jp}),c=new Pl,l={},h=e.maxTextureSize,u={[kn]:Be,[Be]:kn,[de]:de},d=new yn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new it},radius:{value:4}},vertexShader:ax,fragmentShader:cx}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let p=new Jt;p.setAttribute("position",new Se(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Dt(p,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Kd;let g=this.type;this.render=function(T,E,z){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;let F=s.getRenderTarget(),y=s.getActiveCubeFace(),S=s.getActiveMipmapLevel(),N=s.state;N.setBlending(gi),N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);let L=g!==Xn&&this.type===Xn,B=g===Xn&&this.type!==Xn;for(let Z=0,H=T.length;Z<H;Z++){let $=T[Z],W=$.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;i.copy(W.mapSize);let at=W.getFrameExtents();if(i.multiply(at),r.copy(W.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/at.x),i.x=r.x*at.x,W.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/at.y),i.y=r.y*at.y,W.mapSize.y=r.y)),W.map===null||L===!0||B===!0){let gt=this.type!==Xn?{minFilter:Fe,magFilter:Fe}:{};W.map!==null&&W.map.dispose(),W.map=new $n(i.x,i.y,gt),W.map.texture.name=$.name+".shadowMap",W.camera.updateProjectionMatrix()}s.setRenderTarget(W.map),s.clear();let ct=W.getViewportCount();for(let gt=0;gt<ct;gt++){let Ft=W.getViewport(gt);o.set(r.x*Ft.x,r.y*Ft.y,r.x*Ft.z,r.y*Ft.w),N.viewport(o),W.updateMatrices($,gt),n=W.getFrustum(),w(E,z,W.camera,$,this.type)}W.isPointLightShadow!==!0&&this.type===Xn&&M(W,z),W.needsUpdate=!1}g=this.type,m.needsUpdate=!1,s.setRenderTarget(F,y,S)};function M(T,E){let z=t.update(_);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new $n(i.x,i.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,s.setRenderTarget(T.mapPass),s.clear(),s.renderBufferDirect(E,null,z,d,_,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,s.setRenderTarget(T.map),s.clear(),s.renderBufferDirect(E,null,z,f,_,null)}function x(T,E,z,F){let y=null,S=z.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(S!==void 0)y=S;else if(y=z.isPointLight===!0?c:a,s.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){let N=y.uuid,L=E.uuid,B=l[N];B===void 0&&(B={},l[N]=B);let Z=B[L];Z===void 0&&(Z=y.clone(),B[L]=Z,E.addEventListener("dispose",C)),y=Z}if(y.visible=E.visible,y.wireframe=E.wireframe,F===Xn?y.side=E.shadowSide!==null?E.shadowSide:E.side:y.side=E.shadowSide!==null?E.shadowSide:u[E.side],y.alphaMap=E.alphaMap,y.alphaTest=E.alphaTest,y.map=E.map,y.clipShadows=E.clipShadows,y.clippingPlanes=E.clippingPlanes,y.clipIntersection=E.clipIntersection,y.displacementMap=E.displacementMap,y.displacementScale=E.displacementScale,y.displacementBias=E.displacementBias,y.wireframeLinewidth=E.wireframeLinewidth,y.linewidth=E.linewidth,z.isPointLight===!0&&y.isMeshDistanceMaterial===!0){let N=s.properties.get(y);N.light=z}return y}function w(T,E,z,F,y){if(T.visible===!1)return;if(T.layers.test(E.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&y===Xn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,T.matrixWorld);let L=t.update(T),B=T.material;if(Array.isArray(B)){let Z=L.groups;for(let H=0,$=Z.length;H<$;H++){let W=Z[H],at=B[W.materialIndex];if(at&&at.visible){let ct=x(T,at,F,y);T.onBeforeShadow(s,T,E,z,L,ct,W),s.renderBufferDirect(z,null,L,ct,T,W),T.onAfterShadow(s,T,E,z,L,ct,W)}}}else if(B.visible){let Z=x(T,B,F,y);T.onBeforeShadow(s,T,E,z,L,Z,null),s.renderBufferDirect(z,null,L,Z,T,null),T.onAfterShadow(s,T,E,z,L,Z,null)}}let N=T.children;for(let L=0,B=N.length;L<B;L++)w(N[L],E,z,F,y)}function C(T){T.target.removeEventListener("dispose",C);for(let z in l){let F=l[z],y=T.target.uuid;y in F&&(F[y].dispose(),delete F[y])}}}var hx={[Oc]:Fc,[Bc]:Gc,[Hc]:Wc,[As]:Vc,[Fc]:Oc,[Gc]:Bc,[Wc]:Hc,[Vc]:As};function ux(s){function t(){let D=!1,lt=new Kt,q=null,j=new Kt(0,0,0,0);return{setMask:function(ht){q!==ht&&!D&&(s.colorMask(ht,ht,ht,ht),q=ht)},setLocked:function(ht){D=ht},setClear:function(ht,mt,jt,ve,je){je===!0&&(ht*=ve,mt*=ve,jt*=ve),lt.set(ht,mt,jt,ve),j.equals(lt)===!1&&(s.clearColor(ht,mt,jt,ve),j.copy(lt))},reset:function(){D=!1,q=null,j.set(-1,0,0,0)}}}function e(){let D=!1,lt=!1,q=null,j=null,ht=null;return{setReversed:function(mt){lt=mt},setTest:function(mt){mt?dt(s.DEPTH_TEST):pt(s.DEPTH_TEST)},setMask:function(mt){q!==mt&&!D&&(s.depthMask(mt),q=mt)},setFunc:function(mt){if(lt&&(mt=hx[mt]),j!==mt){switch(mt){case Oc:s.depthFunc(s.NEVER);break;case Fc:s.depthFunc(s.ALWAYS);break;case Bc:s.depthFunc(s.LESS);break;case As:s.depthFunc(s.LEQUAL);break;case Hc:s.depthFunc(s.EQUAL);break;case Vc:s.depthFunc(s.GEQUAL);break;case Gc:s.depthFunc(s.GREATER);break;case Wc:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}j=mt}},setLocked:function(mt){D=mt},setClear:function(mt){ht!==mt&&(s.clearDepth(mt),ht=mt)},reset:function(){D=!1,q=null,j=null,ht=null}}}function n(){let D=!1,lt=null,q=null,j=null,ht=null,mt=null,jt=null,ve=null,je=null;return{setTest:function(te){D||(te?dt(s.STENCIL_TEST):pt(s.STENCIL_TEST))},setMask:function(te){lt!==te&&!D&&(s.stencilMask(te),lt=te)},setFunc:function(te,$e,On){(q!==te||j!==$e||ht!==On)&&(s.stencilFunc(te,$e,On),q=te,j=$e,ht=On)},setOp:function(te,$e,On){(mt!==te||jt!==$e||ve!==On)&&(s.stencilOp(te,$e,On),mt=te,jt=$e,ve=On)},setLocked:function(te){D=te},setClear:function(te){je!==te&&(s.clearStencil(te),je=te)},reset:function(){D=!1,lt=null,q=null,j=null,ht=null,mt=null,jt=null,ve=null,je=null}}}let i=new t,r=new e,o=new n,a=new WeakMap,c=new WeakMap,l={},h={},u=new WeakMap,d=[],f=null,p=!1,_=null,m=null,g=null,M=null,x=null,w=null,C=null,T=new tt(0,0,0),E=0,z=!1,F=null,y=null,S=null,N=null,L=null,B=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Z=!1,H=0,$=s.getParameter(s.VERSION);$.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec($)[1]),Z=H>=1):$.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),Z=H>=2);let W=null,at={},ct=s.getParameter(s.SCISSOR_BOX),gt=s.getParameter(s.VIEWPORT),Ft=new Kt().fromArray(ct),Yt=new Kt().fromArray(gt);function Y(D,lt,q,j){let ht=new Uint8Array(4),mt=s.createTexture();s.bindTexture(D,mt),s.texParameteri(D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(D,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let jt=0;jt<q;jt++)D===s.TEXTURE_3D||D===s.TEXTURE_2D_ARRAY?s.texImage3D(lt,0,s.RGBA,1,1,j,0,s.RGBA,s.UNSIGNED_BYTE,ht):s.texImage2D(lt+jt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,ht);return mt}let Q={};Q[s.TEXTURE_2D]=Y(s.TEXTURE_2D,s.TEXTURE_2D,1),Q[s.TEXTURE_CUBE_MAP]=Y(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[s.TEXTURE_2D_ARRAY]=Y(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Q[s.TEXTURE_3D]=Y(s.TEXTURE_3D,s.TEXTURE_3D,1,1),i.setClear(0,0,0,1),r.setClear(1),o.setClear(0),dt(s.DEPTH_TEST),r.setFunc(As),Wt(!1),Ht(Ru),dt(s.CULL_FACE),P(gi);function dt(D){l[D]!==!0&&(s.enable(D),l[D]=!0)}function pt(D){l[D]!==!1&&(s.disable(D),l[D]=!1)}function kt(D,lt){return h[D]!==lt?(s.bindFramebuffer(D,lt),h[D]=lt,D===s.DRAW_FRAMEBUFFER&&(h[s.FRAMEBUFFER]=lt),D===s.FRAMEBUFFER&&(h[s.DRAW_FRAMEBUFFER]=lt),!0):!1}function wt(D,lt){let q=d,j=!1;if(D){q=u.get(lt),q===void 0&&(q=[],u.set(lt,q));let ht=D.textures;if(q.length!==ht.length||q[0]!==s.COLOR_ATTACHMENT0){for(let mt=0,jt=ht.length;mt<jt;mt++)q[mt]=s.COLOR_ATTACHMENT0+mt;q.length=ht.length,j=!0}}else q[0]!==s.BACK&&(q[0]=s.BACK,j=!0);j&&s.drawBuffers(q)}function Bt(D){return f!==D?(s.useProgram(D),f=D,!0):!1}let Zt={[Ni]:s.FUNC_ADD,[bp]:s.FUNC_SUBTRACT,[Sp]:s.FUNC_REVERSE_SUBTRACT};Zt[Ap]=s.MIN,Zt[Tp]=s.MAX;let Gt={[Ep]:s.ZERO,[Rp]:s.ONE,[Cp]:s.SRC_COLOR,[Nc]:s.SRC_ALPHA,[Dp]:s.SRC_ALPHA_SATURATE,[kp]:s.DST_COLOR,[Pp]:s.DST_ALPHA,[zp]:s.ONE_MINUS_SRC_COLOR,[Uc]:s.ONE_MINUS_SRC_ALPHA,[Lp]:s.ONE_MINUS_DST_COLOR,[Ip]:s.ONE_MINUS_DST_ALPHA,[Np]:s.CONSTANT_COLOR,[Up]:s.ONE_MINUS_CONSTANT_COLOR,[Op]:s.CONSTANT_ALPHA,[Fp]:s.ONE_MINUS_CONSTANT_ALPHA};function P(D,lt,q,j,ht,mt,jt,ve,je,te){if(D===gi){p===!0&&(pt(s.BLEND),p=!1);return}if(p===!1&&(dt(s.BLEND),p=!0),D!==wp){if(D!==_||te!==z){if((m!==Ni||x!==Ni)&&(s.blendEquation(s.FUNC_ADD),m=Ni,x=Ni),te)switch(D){case Ms:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case zn:s.blendFunc(s.ONE,s.ONE);break;case Cu:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ko:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Ms:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case zn:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case Cu:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ko:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}g=null,M=null,w=null,C=null,T.set(0,0,0),E=0,_=D,z=te}return}ht=ht||lt,mt=mt||q,jt=jt||j,(lt!==m||ht!==x)&&(s.blendEquationSeparate(Zt[lt],Zt[ht]),m=lt,x=ht),(q!==g||j!==M||mt!==w||jt!==C)&&(s.blendFuncSeparate(Gt[q],Gt[j],Gt[mt],Gt[jt]),g=q,M=j,w=mt,C=jt),(ve.equals(T)===!1||je!==E)&&(s.blendColor(ve.r,ve.g,ve.b,je),T.copy(ve),E=je),_=D,z=!1}function Ge(D,lt){D.side===de?pt(s.CULL_FACE):dt(s.CULL_FACE);let q=D.side===Be;lt&&(q=!q),Wt(q),D.blending===Ms&&D.transparent===!1?P(gi):P(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),r.setFunc(D.depthFunc),r.setTest(D.depthTest),r.setMask(D.depthWrite),i.setMask(D.colorWrite);let j=D.stencilWrite;o.setTest(j),j&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),se(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?dt(s.SAMPLE_ALPHA_TO_COVERAGE):pt(s.SAMPLE_ALPHA_TO_COVERAGE)}function Wt(D){F!==D&&(D?s.frontFace(s.CW):s.frontFace(s.CCW),F=D)}function Ht(D){D!==vp?(dt(s.CULL_FACE),D!==y&&(D===Ru?s.cullFace(s.BACK):D===Mp?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):pt(s.CULL_FACE),y=D}function Et(D){D!==S&&(Z&&s.lineWidth(D),S=D)}function se(D,lt,q){D?(dt(s.POLYGON_OFFSET_FILL),(N!==lt||L!==q)&&(s.polygonOffset(lt,q),N=lt,L=q)):pt(s.POLYGON_OFFSET_FILL)}function zt(D){D?dt(s.SCISSOR_TEST):pt(s.SCISSOR_TEST)}function R(D){D===void 0&&(D=s.TEXTURE0+B-1),W!==D&&(s.activeTexture(D),W=D)}function v(D,lt,q){q===void 0&&(W===null?q=s.TEXTURE0+B-1:q=W);let j=at[q];j===void 0&&(j={type:void 0,texture:void 0},at[q]=j),(j.type!==D||j.texture!==lt)&&(W!==q&&(s.activeTexture(q),W=q),s.bindTexture(D,lt||Q[D]),j.type=D,j.texture=lt)}function k(){let D=at[W];D!==void 0&&D.type!==void 0&&(s.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function I(){try{s.compressedTexImage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function K(){try{s.compressedTexImage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function X(){try{s.texSubImage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function rt(){try{s.texSubImage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function et(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function st(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function xt(){try{s.texStorage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function J(){try{s.texStorage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function _t(){try{s.texImage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Pt(){try{s.texImage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Rt(D){Ft.equals(D)===!1&&(s.scissor(D.x,D.y,D.z,D.w),Ft.copy(D))}function ft(D){Yt.equals(D)===!1&&(s.viewport(D.x,D.y,D.z,D.w),Yt.copy(D))}function Xt(D,lt){let q=c.get(lt);q===void 0&&(q=new WeakMap,c.set(lt,q));let j=q.get(D);j===void 0&&(j=s.getUniformBlockIndex(lt,D.name),q.set(D,j))}function Lt(D,lt){let j=c.get(lt).get(D);a.get(lt)!==j&&(s.uniformBlockBinding(lt,j,D.__bindingPointIndex),a.set(lt,j))}function Qt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),l={},W=null,at={},h={},u=new WeakMap,d=[],f=null,p=!1,_=null,m=null,g=null,M=null,x=null,w=null,C=null,T=new tt(0,0,0),E=0,z=!1,F=null,y=null,S=null,N=null,L=null,Ft.set(0,0,s.canvas.width,s.canvas.height),Yt.set(0,0,s.canvas.width,s.canvas.height),i.reset(),r.reset(),o.reset()}return{buffers:{color:i,depth:r,stencil:o},enable:dt,disable:pt,bindFramebuffer:kt,drawBuffers:wt,useProgram:Bt,setBlending:P,setMaterial:Ge,setFlipSided:Wt,setCullFace:Ht,setLineWidth:Et,setPolygonOffset:se,setScissorTest:zt,activeTexture:R,bindTexture:v,unbindTexture:k,compressedTexImage2D:I,compressedTexImage3D:K,texImage2D:_t,texImage3D:Pt,updateUBOMapping:Xt,uniformBlockBinding:Lt,texStorage2D:xt,texStorage3D:J,texSubImage2D:X,texSubImage3D:rt,compressedTexSubImage2D:et,compressedTexSubImage3D:st,scissor:Rt,viewport:ft,reset:Qt}}function xd(s,t,e,n){let i=dx(n);switch(e){case Jd:return s*t;case tf:return s*t;case ef:return s*t*2;case fh:return s*t/i.components*i.byteLength;case ph:return s*t/i.components*i.byteLength;case nf:return s*t*2/i.components*i.byteLength;case mh:return s*t*2/i.components*i.byteLength;case Qd:return s*t*3/i.components*i.byteLength;case gn:return s*t*4/i.components*i.byteLength;case gh:return s*t*4/i.components*i.byteLength;case Eo:case Ro:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Co:case zo:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Kc:case Zc:return Math.max(s,16)*Math.max(t,8)/4;case qc:case Yc:return Math.max(s,8)*Math.max(t,8)/2;case jc:case $c:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Jc:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Qc:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case tl:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case el:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case nl:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case il:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case sl:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case rl:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case ol:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case al:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case cl:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case ll:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case hl:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case ul:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case dl:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case Po:case fl:case pl:return Math.ceil(s/4)*Math.ceil(t/4)*16;case sf:case ml:return Math.ceil(s/4)*Math.ceil(t/4)*8;case gl:case _l:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function dx(s){switch(s){case Zn:case Zd:return{byteLength:1,components:1};case yr:case jd:case Ir:return{byteLength:2,components:1};case uh:case dh:return{byteLength:2,components:4};case Fi:case hh:case Cn:return{byteLength:4,components:1};case $d:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function fx(s,t,e,n,i,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new it,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(R,v){return f?new OffscreenCanvas(R,v):xr("canvas")}function _(R,v,k){let I=1,K=zt(R);if((K.width>k||K.height>k)&&(I=k/Math.max(K.width,K.height)),I<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let X=Math.floor(I*K.width),rt=Math.floor(I*K.height);u===void 0&&(u=p(X,rt));let et=v?p(X,rt):u;return et.width=X,et.height=rt,et.getContext("2d").drawImage(R,0,0,X,rt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+X+"x"+rt+")."),et}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),R;return R}function m(R){return R.generateMipmaps&&R.minFilter!==Fe&&R.minFilter!==Je}function g(R){s.generateMipmap(R)}function M(R,v,k,I,K=!1){if(R!==null){if(s[R]!==void 0)return s[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let X=v;if(v===s.RED&&(k===s.FLOAT&&(X=s.R32F),k===s.HALF_FLOAT&&(X=s.R16F),k===s.UNSIGNED_BYTE&&(X=s.R8)),v===s.RED_INTEGER&&(k===s.UNSIGNED_BYTE&&(X=s.R8UI),k===s.UNSIGNED_SHORT&&(X=s.R16UI),k===s.UNSIGNED_INT&&(X=s.R32UI),k===s.BYTE&&(X=s.R8I),k===s.SHORT&&(X=s.R16I),k===s.INT&&(X=s.R32I)),v===s.RG&&(k===s.FLOAT&&(X=s.RG32F),k===s.HALF_FLOAT&&(X=s.RG16F),k===s.UNSIGNED_BYTE&&(X=s.RG8)),v===s.RG_INTEGER&&(k===s.UNSIGNED_BYTE&&(X=s.RG8UI),k===s.UNSIGNED_SHORT&&(X=s.RG16UI),k===s.UNSIGNED_INT&&(X=s.RG32UI),k===s.BYTE&&(X=s.RG8I),k===s.SHORT&&(X=s.RG16I),k===s.INT&&(X=s.RG32I)),v===s.RGB_INTEGER&&(k===s.UNSIGNED_BYTE&&(X=s.RGB8UI),k===s.UNSIGNED_SHORT&&(X=s.RGB16UI),k===s.UNSIGNED_INT&&(X=s.RGB32UI),k===s.BYTE&&(X=s.RGB8I),k===s.SHORT&&(X=s.RGB16I),k===s.INT&&(X=s.RGB32I)),v===s.RGBA_INTEGER&&(k===s.UNSIGNED_BYTE&&(X=s.RGBA8UI),k===s.UNSIGNED_SHORT&&(X=s.RGBA16UI),k===s.UNSIGNED_INT&&(X=s.RGBA32UI),k===s.BYTE&&(X=s.RGBA8I),k===s.SHORT&&(X=s.RGBA16I),k===s.INT&&(X=s.RGBA32I)),v===s.RGB&&k===s.UNSIGNED_INT_5_9_9_9_REV&&(X=s.RGB9_E5),v===s.RGBA){let rt=K?Do:$t.getTransfer(I);k===s.FLOAT&&(X=s.RGBA32F),k===s.HALF_FLOAT&&(X=s.RGBA16F),k===s.UNSIGNED_BYTE&&(X=rt===ue?s.SRGB8_ALPHA8:s.RGBA8),k===s.UNSIGNED_SHORT_4_4_4_4&&(X=s.RGBA4),k===s.UNSIGNED_SHORT_5_5_5_1&&(X=s.RGB5_A1)}return(X===s.R16F||X===s.R32F||X===s.RG16F||X===s.RG32F||X===s.RGBA16F||X===s.RGBA32F)&&t.get("EXT_color_buffer_float"),X}function x(R,v){let k;return R?v===null||v===Fi||v===Rs?k=s.DEPTH24_STENCIL8:v===Cn?k=s.DEPTH32F_STENCIL8:v===yr&&(k=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Fi||v===Rs?k=s.DEPTH_COMPONENT24:v===Cn?k=s.DEPTH_COMPONENT32F:v===yr&&(k=s.DEPTH_COMPONENT16),k}function w(R,v){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Fe&&R.minFilter!==Je?Math.log2(Math.max(v.width,v.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?v.mipmaps.length:1}function C(R){let v=R.target;v.removeEventListener("dispose",C),E(v),v.isVideoTexture&&h.delete(v)}function T(R){let v=R.target;v.removeEventListener("dispose",T),F(v)}function E(R){let v=n.get(R);if(v.__webglInit===void 0)return;let k=R.source,I=d.get(k);if(I){let K=I[v.__cacheKey];K.usedTimes--,K.usedTimes===0&&z(R),Object.keys(I).length===0&&d.delete(k)}n.remove(R)}function z(R){let v=n.get(R);s.deleteTexture(v.__webglTexture);let k=R.source,I=d.get(k);delete I[v.__cacheKey],o.memory.textures--}function F(R){let v=n.get(R);if(R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let I=0;I<6;I++){if(Array.isArray(v.__webglFramebuffer[I]))for(let K=0;K<v.__webglFramebuffer[I].length;K++)s.deleteFramebuffer(v.__webglFramebuffer[I][K]);else s.deleteFramebuffer(v.__webglFramebuffer[I]);v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer[I])}else{if(Array.isArray(v.__webglFramebuffer))for(let I=0;I<v.__webglFramebuffer.length;I++)s.deleteFramebuffer(v.__webglFramebuffer[I]);else s.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&s.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let I=0;I<v.__webglColorRenderbuffer.length;I++)v.__webglColorRenderbuffer[I]&&s.deleteRenderbuffer(v.__webglColorRenderbuffer[I]);v.__webglDepthRenderbuffer&&s.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let k=R.textures;for(let I=0,K=k.length;I<K;I++){let X=n.get(k[I]);X.__webglTexture&&(s.deleteTexture(X.__webglTexture),o.memory.textures--),n.remove(k[I])}n.remove(R)}let y=0;function S(){y=0}function N(){let R=y;return R>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+i.maxTextures),y+=1,R}function L(R){let v=[];return v.push(R.wrapS),v.push(R.wrapT),v.push(R.wrapR||0),v.push(R.magFilter),v.push(R.minFilter),v.push(R.anisotropy),v.push(R.internalFormat),v.push(R.format),v.push(R.type),v.push(R.generateMipmaps),v.push(R.premultiplyAlpha),v.push(R.flipY),v.push(R.unpackAlignment),v.push(R.colorSpace),v.join()}function B(R,v){let k=n.get(R);if(R.isVideoTexture&&Et(R),R.isRenderTargetTexture===!1&&R.version>0&&k.__version!==R.version){let I=R.image;if(I===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(I.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Yt(k,R,v);return}}e.bindTexture(s.TEXTURE_2D,k.__webglTexture,s.TEXTURE0+v)}function Z(R,v){let k=n.get(R);if(R.version>0&&k.__version!==R.version){Yt(k,R,v);return}e.bindTexture(s.TEXTURE_2D_ARRAY,k.__webglTexture,s.TEXTURE0+v)}function H(R,v){let k=n.get(R);if(R.version>0&&k.__version!==R.version){Yt(k,R,v);return}e.bindTexture(s.TEXTURE_3D,k.__webglTexture,s.TEXTURE0+v)}function $(R,v){let k=n.get(R);if(R.version>0&&k.__version!==R.version){Y(k,R,v);return}e.bindTexture(s.TEXTURE_CUBE_MAP,k.__webglTexture,s.TEXTURE0+v)}let W={[Ln]:s.REPEAT,[Kn]:s.CLAMP_TO_EDGE,[_r]:s.MIRRORED_REPEAT},at={[Fe]:s.NEAREST,[lh]:s.NEAREST_MIPMAP_NEAREST,[gs]:s.NEAREST_MIPMAP_LINEAR,[Je]:s.LINEAR,[lr]:s.LINEAR_MIPMAP_NEAREST,[In]:s.LINEAR_MIPMAP_LINEAR},ct={[tm]:s.NEVER,[om]:s.ALWAYS,[em]:s.LESS,[af]:s.LEQUAL,[nm]:s.EQUAL,[rm]:s.GEQUAL,[im]:s.GREATER,[sm]:s.NOTEQUAL};function gt(R,v){if(v.type===Cn&&t.has("OES_texture_float_linear")===!1&&(v.magFilter===Je||v.magFilter===lr||v.magFilter===gs||v.magFilter===In||v.minFilter===Je||v.minFilter===lr||v.minFilter===gs||v.minFilter===In)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(R,s.TEXTURE_WRAP_S,W[v.wrapS]),s.texParameteri(R,s.TEXTURE_WRAP_T,W[v.wrapT]),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,W[v.wrapR]),s.texParameteri(R,s.TEXTURE_MAG_FILTER,at[v.magFilter]),s.texParameteri(R,s.TEXTURE_MIN_FILTER,at[v.minFilter]),v.compareFunction&&(s.texParameteri(R,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(R,s.TEXTURE_COMPARE_FUNC,ct[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Fe||v.minFilter!==gs&&v.minFilter!==In||v.type===Cn&&t.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){let k=t.get("EXT_texture_filter_anisotropic");s.texParameterf(R,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,i.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function Ft(R,v){let k=!1;R.__webglInit===void 0&&(R.__webglInit=!0,v.addEventListener("dispose",C));let I=v.source,K=d.get(I);K===void 0&&(K={},d.set(I,K));let X=L(v);if(X!==R.__cacheKey){K[X]===void 0&&(K[X]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,k=!0),K[X].usedTimes++;let rt=K[R.__cacheKey];rt!==void 0&&(K[R.__cacheKey].usedTimes--,rt.usedTimes===0&&z(v)),R.__cacheKey=X,R.__webglTexture=K[X].texture}return k}function Yt(R,v,k){let I=s.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(I=s.TEXTURE_2D_ARRAY),v.isData3DTexture&&(I=s.TEXTURE_3D);let K=Ft(R,v),X=v.source;e.bindTexture(I,R.__webglTexture,s.TEXTURE0+k);let rt=n.get(X);if(X.version!==rt.__version||K===!0){e.activeTexture(s.TEXTURE0+k);let et=$t.getPrimaries($t.workingColorSpace),st=v.colorSpace===fi?null:$t.getPrimaries(v.colorSpace),xt=v.colorSpace===fi||et===st?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);let J=_(v.image,!1,i.maxTextureSize);J=se(v,J);let _t=r.convert(v.format,v.colorSpace),Pt=r.convert(v.type),Rt=M(v.internalFormat,_t,Pt,v.colorSpace,v.isVideoTexture);gt(I,v);let ft,Xt=v.mipmaps,Lt=v.isVideoTexture!==!0,Qt=rt.__version===void 0||K===!0,D=X.dataReady,lt=w(v,J);if(v.isDepthTexture)Rt=x(v.format===Cs,v.type),Qt&&(Lt?e.texStorage2D(s.TEXTURE_2D,1,Rt,J.width,J.height):e.texImage2D(s.TEXTURE_2D,0,Rt,J.width,J.height,0,_t,Pt,null));else if(v.isDataTexture)if(Xt.length>0){Lt&&Qt&&e.texStorage2D(s.TEXTURE_2D,lt,Rt,Xt[0].width,Xt[0].height);for(let q=0,j=Xt.length;q<j;q++)ft=Xt[q],Lt?D&&e.texSubImage2D(s.TEXTURE_2D,q,0,0,ft.width,ft.height,_t,Pt,ft.data):e.texImage2D(s.TEXTURE_2D,q,Rt,ft.width,ft.height,0,_t,Pt,ft.data);v.generateMipmaps=!1}else Lt?(Qt&&e.texStorage2D(s.TEXTURE_2D,lt,Rt,J.width,J.height),D&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,J.width,J.height,_t,Pt,J.data)):e.texImage2D(s.TEXTURE_2D,0,Rt,J.width,J.height,0,_t,Pt,J.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Lt&&Qt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,lt,Rt,Xt[0].width,Xt[0].height,J.depth);for(let q=0,j=Xt.length;q<j;q++)if(ft=Xt[q],v.format!==gn)if(_t!==null)if(Lt){if(D)if(v.layerUpdates.size>0){let ht=xd(ft.width,ft.height,v.format,v.type);for(let mt of v.layerUpdates){let jt=ft.data.subarray(mt*ht/ft.data.BYTES_PER_ELEMENT,(mt+1)*ht/ft.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,q,0,0,mt,ft.width,ft.height,1,_t,jt,0,0)}v.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,q,0,0,0,ft.width,ft.height,J.depth,_t,ft.data,0,0)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,q,Rt,ft.width,ft.height,J.depth,0,ft.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Lt?D&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,q,0,0,0,ft.width,ft.height,J.depth,_t,Pt,ft.data):e.texImage3D(s.TEXTURE_2D_ARRAY,q,Rt,ft.width,ft.height,J.depth,0,_t,Pt,ft.data)}else{Lt&&Qt&&e.texStorage2D(s.TEXTURE_2D,lt,Rt,Xt[0].width,Xt[0].height);for(let q=0,j=Xt.length;q<j;q++)ft=Xt[q],v.format!==gn?_t!==null?Lt?D&&e.compressedTexSubImage2D(s.TEXTURE_2D,q,0,0,ft.width,ft.height,_t,ft.data):e.compressedTexImage2D(s.TEXTURE_2D,q,Rt,ft.width,ft.height,0,ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Lt?D&&e.texSubImage2D(s.TEXTURE_2D,q,0,0,ft.width,ft.height,_t,Pt,ft.data):e.texImage2D(s.TEXTURE_2D,q,Rt,ft.width,ft.height,0,_t,Pt,ft.data)}else if(v.isDataArrayTexture)if(Lt){if(Qt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,lt,Rt,J.width,J.height,J.depth),D)if(v.layerUpdates.size>0){let q=xd(J.width,J.height,v.format,v.type);for(let j of v.layerUpdates){let ht=J.data.subarray(j*q/J.data.BYTES_PER_ELEMENT,(j+1)*q/J.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,j,J.width,J.height,1,_t,Pt,ht)}v.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,_t,Pt,J.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,Rt,J.width,J.height,J.depth,0,_t,Pt,J.data);else if(v.isData3DTexture)Lt?(Qt&&e.texStorage3D(s.TEXTURE_3D,lt,Rt,J.width,J.height,J.depth),D&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,_t,Pt,J.data)):e.texImage3D(s.TEXTURE_3D,0,Rt,J.width,J.height,J.depth,0,_t,Pt,J.data);else if(v.isFramebufferTexture){if(Qt)if(Lt)e.texStorage2D(s.TEXTURE_2D,lt,Rt,J.width,J.height);else{let q=J.width,j=J.height;for(let ht=0;ht<lt;ht++)e.texImage2D(s.TEXTURE_2D,ht,Rt,q,j,0,_t,Pt,null),q>>=1,j>>=1}}else if(Xt.length>0){if(Lt&&Qt){let q=zt(Xt[0]);e.texStorage2D(s.TEXTURE_2D,lt,Rt,q.width,q.height)}for(let q=0,j=Xt.length;q<j;q++)ft=Xt[q],Lt?D&&e.texSubImage2D(s.TEXTURE_2D,q,0,0,_t,Pt,ft):e.texImage2D(s.TEXTURE_2D,q,Rt,_t,Pt,ft);v.generateMipmaps=!1}else if(Lt){if(Qt){let q=zt(J);e.texStorage2D(s.TEXTURE_2D,lt,Rt,q.width,q.height)}D&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,_t,Pt,J)}else e.texImage2D(s.TEXTURE_2D,0,Rt,_t,Pt,J);m(v)&&g(I),rt.__version=X.version,v.onUpdate&&v.onUpdate(v)}R.__version=v.version}function Y(R,v,k){if(v.image.length!==6)return;let I=Ft(R,v),K=v.source;e.bindTexture(s.TEXTURE_CUBE_MAP,R.__webglTexture,s.TEXTURE0+k);let X=n.get(K);if(K.version!==X.__version||I===!0){e.activeTexture(s.TEXTURE0+k);let rt=$t.getPrimaries($t.workingColorSpace),et=v.colorSpace===fi?null:$t.getPrimaries(v.colorSpace),st=v.colorSpace===fi||rt===et?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,st);let xt=v.isCompressedTexture||v.image[0].isCompressedTexture,J=v.image[0]&&v.image[0].isDataTexture,_t=[];for(let j=0;j<6;j++)!xt&&!J?_t[j]=_(v.image[j],!0,i.maxCubemapSize):_t[j]=J?v.image[j].image:v.image[j],_t[j]=se(v,_t[j]);let Pt=_t[0],Rt=r.convert(v.format,v.colorSpace),ft=r.convert(v.type),Xt=M(v.internalFormat,Rt,ft,v.colorSpace),Lt=v.isVideoTexture!==!0,Qt=X.__version===void 0||I===!0,D=K.dataReady,lt=w(v,Pt);gt(s.TEXTURE_CUBE_MAP,v);let q;if(xt){Lt&&Qt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,lt,Xt,Pt.width,Pt.height);for(let j=0;j<6;j++){q=_t[j].mipmaps;for(let ht=0;ht<q.length;ht++){let mt=q[ht];v.format!==gn?Rt!==null?Lt?D&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,ht,0,0,mt.width,mt.height,Rt,mt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,ht,Xt,mt.width,mt.height,0,mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Lt?D&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,ht,0,0,mt.width,mt.height,Rt,ft,mt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,ht,Xt,mt.width,mt.height,0,Rt,ft,mt.data)}}}else{if(q=v.mipmaps,Lt&&Qt){q.length>0&&lt++;let j=zt(_t[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,lt,Xt,j.width,j.height)}for(let j=0;j<6;j++)if(J){Lt?D&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,_t[j].width,_t[j].height,Rt,ft,_t[j].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Xt,_t[j].width,_t[j].height,0,Rt,ft,_t[j].data);for(let ht=0;ht<q.length;ht++){let jt=q[ht].image[j].image;Lt?D&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,ht+1,0,0,jt.width,jt.height,Rt,ft,jt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,ht+1,Xt,jt.width,jt.height,0,Rt,ft,jt.data)}}else{Lt?D&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Rt,ft,_t[j]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Xt,Rt,ft,_t[j]);for(let ht=0;ht<q.length;ht++){let mt=q[ht];Lt?D&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,ht+1,0,0,Rt,ft,mt.image[j]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,ht+1,Xt,Rt,ft,mt.image[j])}}}m(v)&&g(s.TEXTURE_CUBE_MAP),X.__version=K.version,v.onUpdate&&v.onUpdate(v)}R.__version=v.version}function Q(R,v,k,I,K,X){let rt=r.convert(k.format,k.colorSpace),et=r.convert(k.type),st=M(k.internalFormat,rt,et,k.colorSpace);if(!n.get(v).__hasExternalTextures){let J=Math.max(1,v.width>>X),_t=Math.max(1,v.height>>X);K===s.TEXTURE_3D||K===s.TEXTURE_2D_ARRAY?e.texImage3D(K,X,st,J,_t,v.depth,0,rt,et,null):e.texImage2D(K,X,st,J,_t,0,rt,et,null)}e.bindFramebuffer(s.FRAMEBUFFER,R),Ht(v)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,I,K,n.get(k).__webglTexture,0,Wt(v)):(K===s.TEXTURE_2D||K>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,I,K,n.get(k).__webglTexture,X),e.bindFramebuffer(s.FRAMEBUFFER,null)}function dt(R,v,k){if(s.bindRenderbuffer(s.RENDERBUFFER,R),v.depthBuffer){let I=v.depthTexture,K=I&&I.isDepthTexture?I.type:null,X=x(v.stencilBuffer,K),rt=v.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,et=Wt(v);Ht(v)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,et,X,v.width,v.height):k?s.renderbufferStorageMultisample(s.RENDERBUFFER,et,X,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,X,v.width,v.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,rt,s.RENDERBUFFER,R)}else{let I=v.textures;for(let K=0;K<I.length;K++){let X=I[K],rt=r.convert(X.format,X.colorSpace),et=r.convert(X.type),st=M(X.internalFormat,rt,et,X.colorSpace),xt=Wt(v);k&&Ht(v)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,xt,st,v.width,v.height):Ht(v)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,xt,st,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,st,v.width,v.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function pt(R,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,R),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(v.depthTexture).__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),B(v.depthTexture,0);let I=n.get(v.depthTexture).__webglTexture,K=Wt(v);if(v.depthTexture.format===ws)Ht(v)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,I,0,K):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,I,0);else if(v.depthTexture.format===Cs)Ht(v)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,I,0,K):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,I,0);else throw new Error("Unknown depthTexture format")}function kt(R){let v=n.get(R),k=R.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==R.depthTexture){let I=R.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),I){let K=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,I.removeEventListener("dispose",K)};I.addEventListener("dispose",K),v.__depthDisposeCallback=K}v.__boundDepthTexture=I}if(R.depthTexture&&!v.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");pt(v.__webglFramebuffer,R)}else if(k){v.__webglDepthbuffer=[];for(let I=0;I<6;I++)if(e.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[I]),v.__webglDepthbuffer[I]===void 0)v.__webglDepthbuffer[I]=s.createRenderbuffer(),dt(v.__webglDepthbuffer[I],R,!1);else{let K=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,X=v.__webglDepthbuffer[I];s.bindRenderbuffer(s.RENDERBUFFER,X),s.framebufferRenderbuffer(s.FRAMEBUFFER,K,s.RENDERBUFFER,X)}}else if(e.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=s.createRenderbuffer(),dt(v.__webglDepthbuffer,R,!1);else{let I=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,K=v.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,K),s.framebufferRenderbuffer(s.FRAMEBUFFER,I,s.RENDERBUFFER,K)}e.bindFramebuffer(s.FRAMEBUFFER,null)}function wt(R,v,k){let I=n.get(R);v!==void 0&&Q(I.__webglFramebuffer,R,R.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),k!==void 0&&kt(R)}function Bt(R){let v=R.texture,k=n.get(R),I=n.get(v);R.addEventListener("dispose",T);let K=R.textures,X=R.isWebGLCubeRenderTarget===!0,rt=K.length>1;if(rt||(I.__webglTexture===void 0&&(I.__webglTexture=s.createTexture()),I.__version=v.version,o.memory.textures++),X){k.__webglFramebuffer=[];for(let et=0;et<6;et++)if(v.mipmaps&&v.mipmaps.length>0){k.__webglFramebuffer[et]=[];for(let st=0;st<v.mipmaps.length;st++)k.__webglFramebuffer[et][st]=s.createFramebuffer()}else k.__webglFramebuffer[et]=s.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){k.__webglFramebuffer=[];for(let et=0;et<v.mipmaps.length;et++)k.__webglFramebuffer[et]=s.createFramebuffer()}else k.__webglFramebuffer=s.createFramebuffer();if(rt)for(let et=0,st=K.length;et<st;et++){let xt=n.get(K[et]);xt.__webglTexture===void 0&&(xt.__webglTexture=s.createTexture(),o.memory.textures++)}if(R.samples>0&&Ht(R)===!1){k.__webglMultisampledFramebuffer=s.createFramebuffer(),k.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let et=0;et<K.length;et++){let st=K[et];k.__webglColorRenderbuffer[et]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,k.__webglColorRenderbuffer[et]);let xt=r.convert(st.format,st.colorSpace),J=r.convert(st.type),_t=M(st.internalFormat,xt,J,st.colorSpace,R.isXRRenderTarget===!0),Pt=Wt(R);s.renderbufferStorageMultisample(s.RENDERBUFFER,Pt,_t,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+et,s.RENDERBUFFER,k.__webglColorRenderbuffer[et])}s.bindRenderbuffer(s.RENDERBUFFER,null),R.depthBuffer&&(k.__webglDepthRenderbuffer=s.createRenderbuffer(),dt(k.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(X){e.bindTexture(s.TEXTURE_CUBE_MAP,I.__webglTexture),gt(s.TEXTURE_CUBE_MAP,v);for(let et=0;et<6;et++)if(v.mipmaps&&v.mipmaps.length>0)for(let st=0;st<v.mipmaps.length;st++)Q(k.__webglFramebuffer[et][st],R,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+et,st);else Q(k.__webglFramebuffer[et],R,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0);m(v)&&g(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(rt){for(let et=0,st=K.length;et<st;et++){let xt=K[et],J=n.get(xt);e.bindTexture(s.TEXTURE_2D,J.__webglTexture),gt(s.TEXTURE_2D,xt),Q(k.__webglFramebuffer,R,xt,s.COLOR_ATTACHMENT0+et,s.TEXTURE_2D,0),m(xt)&&g(s.TEXTURE_2D)}e.unbindTexture()}else{let et=s.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(et=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(et,I.__webglTexture),gt(et,v),v.mipmaps&&v.mipmaps.length>0)for(let st=0;st<v.mipmaps.length;st++)Q(k.__webglFramebuffer[st],R,v,s.COLOR_ATTACHMENT0,et,st);else Q(k.__webglFramebuffer,R,v,s.COLOR_ATTACHMENT0,et,0);m(v)&&g(et),e.unbindTexture()}R.depthBuffer&&kt(R)}function Zt(R){let v=R.textures;for(let k=0,I=v.length;k<I;k++){let K=v[k];if(m(K)){let X=R.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,rt=n.get(K).__webglTexture;e.bindTexture(X,rt),g(X),e.unbindTexture()}}}let Gt=[],P=[];function Ge(R){if(R.samples>0){if(Ht(R)===!1){let v=R.textures,k=R.width,I=R.height,K=s.COLOR_BUFFER_BIT,X=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,rt=n.get(R),et=v.length>1;if(et)for(let st=0;st<v.length;st++)e.bindFramebuffer(s.FRAMEBUFFER,rt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+st,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,rt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+st,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,rt.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,rt.__webglFramebuffer);for(let st=0;st<v.length;st++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(K|=s.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(K|=s.STENCIL_BUFFER_BIT)),et){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,rt.__webglColorRenderbuffer[st]);let xt=n.get(v[st]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,xt,0)}s.blitFramebuffer(0,0,k,I,0,0,k,I,K,s.NEAREST),c===!0&&(Gt.length=0,P.length=0,Gt.push(s.COLOR_ATTACHMENT0+st),R.depthBuffer&&R.resolveDepthBuffer===!1&&(Gt.push(X),P.push(X),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,P)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Gt))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),et)for(let st=0;st<v.length;st++){e.bindFramebuffer(s.FRAMEBUFFER,rt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+st,s.RENDERBUFFER,rt.__webglColorRenderbuffer[st]);let xt=n.get(v[st]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,rt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+st,s.TEXTURE_2D,xt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,rt.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){let v=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[v])}}}function Wt(R){return Math.min(i.maxSamples,R.samples)}function Ht(R){let v=n.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Et(R){let v=o.render.frame;h.get(R)!==v&&(h.set(R,v),R.update())}function se(R,v){let k=R.colorSpace,I=R.format,K=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||k!==Ie&&k!==fi&&($t.getTransfer(k)===ue?(I!==gn||K!==Zn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),v}function zt(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=N,this.resetTextureUnits=S,this.setTexture2D=B,this.setTexture2DArray=Z,this.setTexture3D=H,this.setTextureCube=$,this.rebindTextures=wt,this.setupRenderTarget=Bt,this.updateRenderTargetMipmap=Zt,this.updateMultisampleRenderTarget=Ge,this.setupDepthRenderbuffer=kt,this.setupFrameBufferTexture=Q,this.useMultisampledRTT=Ht}function px(s,t){function e(n,i=fi){let r,o=$t.getTransfer(i);if(n===Zn)return s.UNSIGNED_BYTE;if(n===uh)return s.UNSIGNED_SHORT_4_4_4_4;if(n===dh)return s.UNSIGNED_SHORT_5_5_5_1;if(n===$d)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Zd)return s.BYTE;if(n===jd)return s.SHORT;if(n===yr)return s.UNSIGNED_SHORT;if(n===hh)return s.INT;if(n===Fi)return s.UNSIGNED_INT;if(n===Cn)return s.FLOAT;if(n===Ir)return s.HALF_FLOAT;if(n===Jd)return s.ALPHA;if(n===Qd)return s.RGB;if(n===gn)return s.RGBA;if(n===tf)return s.LUMINANCE;if(n===ef)return s.LUMINANCE_ALPHA;if(n===ws)return s.DEPTH_COMPONENT;if(n===Cs)return s.DEPTH_STENCIL;if(n===fh)return s.RED;if(n===ph)return s.RED_INTEGER;if(n===nf)return s.RG;if(n===mh)return s.RG_INTEGER;if(n===gh)return s.RGBA_INTEGER;if(n===Eo||n===Ro||n===Co||n===zo)if(o===ue)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Eo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ro)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Co)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===zo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Eo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ro)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Co)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===zo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===qc||n===Kc||n===Yc||n===Zc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===qc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Kc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Yc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Zc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===jc||n===$c||n===Jc)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===jc||n===$c)return o===ue?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Jc)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Qc||n===tl||n===el||n===nl||n===il||n===sl||n===rl||n===ol||n===al||n===cl||n===ll||n===hl||n===ul||n===dl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Qc)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===tl)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===el)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===nl)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===il)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===sl)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===rl)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ol)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===al)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===cl)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ll)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===hl)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ul)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===dl)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Po||n===fl||n===pl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Po)return o===ue?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===fl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===pl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===sf||n===ml||n===gl||n===_l)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Po)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ml)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===gl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===_l)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Rs?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}var Il=class extends De{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},yt=class extends fe{constructor(){super(),this.isGroup=!0,this.type="Group"}},mx={type:"move"},dr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new yt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new yt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new b,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new b),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new yt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new b,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new b),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(let _ of t.hand.values()){let m=e.getJointPose(_,n),g=this._getHandJoint(l,_);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;l.inputState.pinching&&d>f+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(mx)))}return a!==null&&(a.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new yt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},gx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,_x=`
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

}`,kl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){let i=new Pe,r=t.properties.get(i);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new yn({vertexShader:gx,fragmentShader:_x,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Dt(new Dn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Ll=class extends jn{constructor(t,e){super();let n=this,i=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,p=null,_=new kl,m=e.getContextAttributes(),g=null,M=null,x=[],w=[],C=new it,T=null,E=new De;E.layers.enable(1),E.viewport=new Kt;let z=new De;z.layers.enable(2),z.viewport=new Kt;let F=[E,z],y=new Il;y.layers.enable(1),y.layers.enable(2);let S=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let Q=x[Y];return Q===void 0&&(Q=new dr,x[Y]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(Y){let Q=x[Y];return Q===void 0&&(Q=new dr,x[Y]=Q),Q.getGripSpace()},this.getHand=function(Y){let Q=x[Y];return Q===void 0&&(Q=new dr,x[Y]=Q),Q.getHandSpace()};function L(Y){let Q=w.indexOf(Y.inputSource);if(Q===-1)return;let dt=x[Q];dt!==void 0&&(dt.update(Y.inputSource,Y.frame,l||o),dt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function B(){i.removeEventListener("select",L),i.removeEventListener("selectstart",L),i.removeEventListener("selectend",L),i.removeEventListener("squeeze",L),i.removeEventListener("squeezestart",L),i.removeEventListener("squeezeend",L),i.removeEventListener("end",B),i.removeEventListener("inputsourceschange",Z);for(let Y=0;Y<x.length;Y++){let Q=w[Y];Q!==null&&(w[Y]=null,x[Y].disconnect(Q))}S=null,N=null,_.reset(),t.setRenderTarget(g),f=null,d=null,u=null,i=null,M=null,Yt.stop(),n.isPresenting=!1,t.setPixelRatio(T),t.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(Y){if(i=Y,i!==null){if(g=t.getRenderTarget(),i.addEventListener("select",L),i.addEventListener("selectstart",L),i.addEventListener("selectend",L),i.addEventListener("squeeze",L),i.addEventListener("squeezestart",L),i.addEventListener("squeezeend",L),i.addEventListener("end",B),i.addEventListener("inputsourceschange",Z),m.xrCompatible!==!0&&await e.makeXRCompatible(),T=t.getPixelRatio(),t.getSize(C),i.renderState.layers===void 0){let Q={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,Q),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new $n(f.framebufferWidth,f.framebufferHeight,{format:gn,type:Zn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let Q=null,dt=null,pt=null;m.depth&&(pt=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Q=m.stencil?Cs:ws,dt=m.stencil?Rs:Fi);let kt={colorFormat:e.RGBA8,depthFormat:pt,scaleFactor:r};u=new XRWebGLBinding(i,e),d=u.createProjectionLayer(kt),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),M=new $n(d.textureWidth,d.textureHeight,{format:gn,type:Zn,depthTexture:new Xo(d.textureWidth,d.textureHeight,dt,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await i.requestReferenceSpace(a),Yt.setContext(i),Yt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function Z(Y){for(let Q=0;Q<Y.removed.length;Q++){let dt=Y.removed[Q],pt=w.indexOf(dt);pt>=0&&(w[pt]=null,x[pt].disconnect(dt))}for(let Q=0;Q<Y.added.length;Q++){let dt=Y.added[Q],pt=w.indexOf(dt);if(pt===-1){for(let wt=0;wt<x.length;wt++)if(wt>=w.length){w.push(dt),pt=wt;break}else if(w[wt]===null){w[wt]=dt,pt=wt;break}if(pt===-1)break}let kt=x[pt];kt&&kt.connect(dt)}}let H=new b,$=new b;function W(Y,Q,dt){H.setFromMatrixPosition(Q.matrixWorld),$.setFromMatrixPosition(dt.matrixWorld);let pt=H.distanceTo($),kt=Q.projectionMatrix.elements,wt=dt.projectionMatrix.elements,Bt=kt[14]/(kt[10]-1),Zt=kt[14]/(kt[10]+1),Gt=(kt[9]+1)/kt[5],P=(kt[9]-1)/kt[5],Ge=(kt[8]-1)/kt[0],Wt=(wt[8]+1)/wt[0],Ht=Bt*Ge,Et=Bt*Wt,se=pt/(-Ge+Wt),zt=se*-Ge;if(Q.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(zt),Y.translateZ(se),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),kt[10]===-1)Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{let R=Bt+se,v=Zt+se,k=Ht-zt,I=Et+(pt-zt),K=Gt*Zt/v*R,X=P*Zt/v*R;Y.projectionMatrix.makePerspective(k,I,K,X,R,v),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function at(Y,Q){Q===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(Q.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(i===null)return;let Q=Y.near,dt=Y.far;_.texture!==null&&(_.depthNear>0&&(Q=_.depthNear),_.depthFar>0&&(dt=_.depthFar)),y.near=z.near=E.near=Q,y.far=z.far=E.far=dt,(S!==y.near||N!==y.far)&&(i.updateRenderState({depthNear:y.near,depthFar:y.far}),S=y.near,N=y.far);let pt=Y.parent,kt=y.cameras;at(y,pt);for(let wt=0;wt<kt.length;wt++)at(kt[wt],pt);kt.length===2?W(y,E,z):y.projectionMatrix.copy(E.projectionMatrix),ct(Y,y,pt)};function ct(Y,Q,dt){dt===null?Y.matrix.copy(Q.matrixWorld):(Y.matrix.copy(dt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(Q.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Is*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(Y){c=Y,d!==null&&(d.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let gt=null;function Ft(Y,Q){if(h=Q.getViewerPose(l||o),p=Q,h!==null){let dt=h.views;f!==null&&(t.setRenderTargetFramebuffer(M,f.framebuffer),t.setRenderTarget(M));let pt=!1;dt.length!==y.cameras.length&&(y.cameras.length=0,pt=!0);for(let wt=0;wt<dt.length;wt++){let Bt=dt[wt],Zt=null;if(f!==null)Zt=f.getViewport(Bt);else{let P=u.getViewSubImage(d,Bt);Zt=P.viewport,wt===0&&(t.setRenderTargetTextures(M,P.colorTexture,d.ignoreDepthValues?void 0:P.depthStencilTexture),t.setRenderTarget(M))}let Gt=F[wt];Gt===void 0&&(Gt=new De,Gt.layers.enable(wt),Gt.viewport=new Kt,F[wt]=Gt),Gt.matrix.fromArray(Bt.transform.matrix),Gt.matrix.decompose(Gt.position,Gt.quaternion,Gt.scale),Gt.projectionMatrix.fromArray(Bt.projectionMatrix),Gt.projectionMatrixInverse.copy(Gt.projectionMatrix).invert(),Gt.viewport.set(Zt.x,Zt.y,Zt.width,Zt.height),wt===0&&(y.matrix.copy(Gt.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),pt===!0&&y.cameras.push(Gt)}let kt=i.enabledFeatures;if(kt&&kt.includes("depth-sensing")){let wt=u.getDepthInformation(dt[0]);wt&&wt.isValid&&wt.texture&&_.init(t,wt,i.renderState)}}for(let dt=0;dt<x.length;dt++){let pt=w[dt],kt=x[dt];pt!==null&&kt!==void 0&&kt.update(pt,Q,l||o)}gt&&gt(Y,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),p=null}let Yt=new ff;Yt.setAnimationLoop(Ft),this.setAnimationLoop=function(Y){gt=Y},this.dispose=function(){}}},Li=new ln,yx=new At;function xx(s,t){function e(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,df(s)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function i(m,g,M,x,w){g.isMeshBasicMaterial||g.isMeshLambertMaterial?r(m,g):g.isMeshToonMaterial?(r(m,g),u(m,g)):g.isMeshPhongMaterial?(r(m,g),h(m,g)):g.isMeshStandardMaterial?(r(m,g),d(m,g),g.isMeshPhysicalMaterial&&f(m,g,w)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),_(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(o(m,g),g.isLineDashedMaterial&&a(m,g)):g.isPointsMaterial?c(m,g,M,x):g.isSpriteMaterial?l(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,e(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===Be&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,e(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===Be&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,e(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,e(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);let M=t.get(g),x=M.envMap,w=M.envMapRotation;x&&(m.envMap.value=x,Li.copy(w),Li.x*=-1,Li.y*=-1,Li.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Li.y*=-1,Li.z*=-1),m.envMapRotation.value.setFromMatrix4(yx.makeRotationFromEuler(Li)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,m.aoMapTransform))}function o(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform))}function a(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function c(m,g,M,x){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*M,m.scale.value=x*.5,g.map&&(m.map.value=g.map,e(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function l(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function u(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,M){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Be&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function _(m,g){let M=t.get(g).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function vx(s,t,e,n){let i={},r={},o=[],a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,x){let w=x.program;n.uniformBlockBinding(M,w)}function l(M,x){let w=i[M.id];w===void 0&&(p(M),w=h(M),i[M.id]=w,M.addEventListener("dispose",m));let C=x.program;n.updateUBOMapping(M,C);let T=t.render.frame;r[M.id]!==T&&(d(M),r[M.id]=T)}function h(M){let x=u();M.__bindingPointIndex=x;let w=s.createBuffer(),C=M.__size,T=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,w),s.bufferData(s.UNIFORM_BUFFER,C,T),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,x,w),w}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){let x=i[M.id],w=M.uniforms,C=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,x);for(let T=0,E=w.length;T<E;T++){let z=Array.isArray(w[T])?w[T]:[w[T]];for(let F=0,y=z.length;F<y;F++){let S=z[F];if(f(S,T,F,C)===!0){let N=S.__offset,L=Array.isArray(S.value)?S.value:[S.value],B=0;for(let Z=0;Z<L.length;Z++){let H=L[Z],$=_(H);typeof H=="number"||typeof H=="boolean"?(S.__data[0]=H,s.bufferSubData(s.UNIFORM_BUFFER,N+B,S.__data)):H.isMatrix3?(S.__data[0]=H.elements[0],S.__data[1]=H.elements[1],S.__data[2]=H.elements[2],S.__data[3]=0,S.__data[4]=H.elements[3],S.__data[5]=H.elements[4],S.__data[6]=H.elements[5],S.__data[7]=0,S.__data[8]=H.elements[6],S.__data[9]=H.elements[7],S.__data[10]=H.elements[8],S.__data[11]=0):(H.toArray(S.__data,B),B+=$.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,N,S.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(M,x,w,C){let T=M.value,E=x+"_"+w;if(C[E]===void 0)return typeof T=="number"||typeof T=="boolean"?C[E]=T:C[E]=T.clone(),!0;{let z=C[E];if(typeof T=="number"||typeof T=="boolean"){if(z!==T)return C[E]=T,!0}else if(z.equals(T)===!1)return z.copy(T),!0}return!1}function p(M){let x=M.uniforms,w=0,C=16;for(let E=0,z=x.length;E<z;E++){let F=Array.isArray(x[E])?x[E]:[x[E]];for(let y=0,S=F.length;y<S;y++){let N=F[y],L=Array.isArray(N.value)?N.value:[N.value];for(let B=0,Z=L.length;B<Z;B++){let H=L[B],$=_(H),W=w%C,at=W%$.boundary,ct=W+at;w+=at,ct!==0&&C-ct<$.storage&&(w+=C-ct),N.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=w,w+=$.storage}}}let T=w%C;return T>0&&(w+=C-T),M.__size=w,M.__cache={},this}function _(M){let x={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(x.boundary=4,x.storage=4):M.isVector2?(x.boundary=8,x.storage=8):M.isVector3||M.isColor?(x.boundary=16,x.storage=12):M.isVector4?(x.boundary=16,x.storage=16):M.isMatrix3?(x.boundary=48,x.storage=48):M.isMatrix4?(x.boundary=64,x.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),x}function m(M){let x=M.target;x.removeEventListener("dispose",m);let w=o.indexOf(x.__bindingPointIndex);o.splice(w,1),s.deleteBuffer(i[x.id]),delete i[x.id],delete r[x.id]}function g(){for(let M in i)s.deleteBuffer(i[M]);o=[],i={},r={}}return{bind:c,update:l,dispose:g}}var qo=class{constructor(t={}){let{canvas:e=bm(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;let f=new Uint32Array(4),p=new Int32Array(4),_=null,m=null,g=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=qt,this.toneMapping=_i,this.toneMappingExposure=1;let x=this,w=!1,C=0,T=0,E=null,z=-1,F=null,y=new Kt,S=new Kt,N=null,L=new tt(0),B=0,Z=e.width,H=e.height,$=1,W=null,at=null,ct=new Kt(0,0,Z,H),gt=new Kt(0,0,Z,H),Ft=!1,Yt=new Mr,Y=!1,Q=!1,dt=new At,pt=new At,kt=new b,wt=new Kt,Bt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Zt=!1;function Gt(){return E===null?$:1}let P=n;function Ge(A,U){return e.getContext(A,U)}try{let A={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${rh}`),e.addEventListener("webglcontextlost",j,!1),e.addEventListener("webglcontextrestored",ht,!1),e.addEventListener("webglcontextcreationerror",mt,!1),P===null){let U="webgl2";if(P=Ge(U,A),P===null)throw Ge(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let Wt,Ht,Et,se,zt,R,v,k,I,K,X,rt,et,st,xt,J,_t,Pt,Rt,ft,Xt,Lt,Qt,D;function lt(){Wt=new N_(P),Wt.init(),Lt=new px(P,Wt),Ht=new z_(P,Wt,t,Lt),Et=new ux(P),Ht.reverseDepthBuffer&&Et.buffers.depth.setReversed(!0),se=new F_(P),zt=new Jy,R=new fx(P,Wt,Et,zt,Ht,Lt,se),v=new I_(x),k=new D_(x),I=new qm(P),Qt=new R_(P,I),K=new U_(P,I,se,Qt),X=new H_(P,K,I,se),Rt=new B_(P,Ht,R),J=new P_(zt),rt=new $y(x,v,k,Wt,Ht,Qt,J),et=new xx(x,zt),st=new tx,xt=new ox(Wt),Pt=new E_(x,v,k,Et,X,d,c),_t=new lx(x,X,Ht),D=new vx(P,se,Ht,Et),ft=new C_(P,Wt,se),Xt=new O_(P,Wt,se),se.programs=rt.programs,x.capabilities=Ht,x.extensions=Wt,x.properties=zt,x.renderLists=st,x.shadowMap=_t,x.state=Et,x.info=se}lt();let q=new Ll(x,P);this.xr=q,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let A=Wt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){let A=Wt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(A){A!==void 0&&($=A,this.setSize(Z,H,!1))},this.getSize=function(A){return A.set(Z,H)},this.setSize=function(A,U,V=!0){if(q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Z=A,H=U,e.width=Math.floor(A*$),e.height=Math.floor(U*$),V===!0&&(e.style.width=A+"px",e.style.height=U+"px"),this.setViewport(0,0,A,U)},this.getDrawingBufferSize=function(A){return A.set(Z*$,H*$).floor()},this.setDrawingBufferSize=function(A,U,V){Z=A,H=U,$=V,e.width=Math.floor(A*V),e.height=Math.floor(U*V),this.setViewport(0,0,A,U)},this.getCurrentViewport=function(A){return A.copy(y)},this.getViewport=function(A){return A.copy(ct)},this.setViewport=function(A,U,V,G){A.isVector4?ct.set(A.x,A.y,A.z,A.w):ct.set(A,U,V,G),Et.viewport(y.copy(ct).multiplyScalar($).round())},this.getScissor=function(A){return A.copy(gt)},this.setScissor=function(A,U,V,G){A.isVector4?gt.set(A.x,A.y,A.z,A.w):gt.set(A,U,V,G),Et.scissor(S.copy(gt).multiplyScalar($).round())},this.getScissorTest=function(){return Ft},this.setScissorTest=function(A){Et.setScissorTest(Ft=A)},this.setOpaqueSort=function(A){W=A},this.setTransparentSort=function(A){at=A},this.getClearColor=function(A){return A.copy(Pt.getClearColor())},this.setClearColor=function(){Pt.setClearColor.apply(Pt,arguments)},this.getClearAlpha=function(){return Pt.getClearAlpha()},this.setClearAlpha=function(){Pt.setClearAlpha.apply(Pt,arguments)},this.clear=function(A=!0,U=!0,V=!0){let G=0;if(A){let O=!1;if(E!==null){let nt=E.texture.format;O=nt===gh||nt===mh||nt===ph}if(O){let nt=E.texture.type,ut=nt===Zn||nt===Fi||nt===yr||nt===Rs||nt===uh||nt===dh,vt=Pt.getClearColor(),Mt=Pt.getClearAlpha(),Ct=vt.r,It=vt.g,bt=vt.b;ut?(f[0]=Ct,f[1]=It,f[2]=bt,f[3]=Mt,P.clearBufferuiv(P.COLOR,0,f)):(p[0]=Ct,p[1]=It,p[2]=bt,p[3]=Mt,P.clearBufferiv(P.COLOR,0,p))}else G|=P.COLOR_BUFFER_BIT}U&&(G|=P.DEPTH_BUFFER_BIT,P.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),V&&(G|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",j,!1),e.removeEventListener("webglcontextrestored",ht,!1),e.removeEventListener("webglcontextcreationerror",mt,!1),st.dispose(),xt.dispose(),zt.dispose(),v.dispose(),k.dispose(),X.dispose(),Qt.dispose(),D.dispose(),rt.dispose(),q.dispose(),q.removeEventListener("sessionstart",xu),q.removeEventListener("sessionend",vu),Ri.stop()};function j(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function ht(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;let A=se.autoReset,U=_t.enabled,V=_t.autoUpdate,G=_t.needsUpdate,O=_t.type;lt(),se.autoReset=A,_t.enabled=U,_t.autoUpdate=V,_t.needsUpdate=G,_t.type=O}function mt(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function jt(A){let U=A.target;U.removeEventListener("dispose",jt),ve(U)}function ve(A){je(A),zt.remove(A)}function je(A){let U=zt.get(A).programs;U!==void 0&&(U.forEach(function(V){rt.releaseProgram(V)}),A.isShaderMaterial&&rt.releaseShaderCache(A))}this.renderBufferDirect=function(A,U,V,G,O,nt){U===null&&(U=Bt);let ut=O.isMesh&&O.matrixWorld.determinant()<0,vt=gp(A,U,V,G,O);Et.setMaterial(G,ut);let Mt=V.index,Ct=1;if(G.wireframe===!0){if(Mt=K.getWireframeAttribute(V),Mt===void 0)return;Ct=2}let It=V.drawRange,bt=V.attributes.position,re=It.start*Ct,he=(It.start+It.count)*Ct;nt!==null&&(re=Math.max(re,nt.start*Ct),he=Math.min(he,(nt.start+nt.count)*Ct)),Mt!==null?(re=Math.max(re,0),he=Math.min(he,Mt.count)):bt!=null&&(re=Math.max(re,0),he=Math.min(he,bt.count));let ye=he-re;if(ye<0||ye===1/0)return;Qt.setup(O,G,vt,V,Mt);let sn,ne=ft;if(Mt!==null&&(sn=I.get(Mt),ne=Xt,ne.setIndex(sn)),O.isMesh)G.wireframe===!0?(Et.setLineWidth(G.wireframeLinewidth*Gt()),ne.setMode(P.LINES)):ne.setMode(P.TRIANGLES);else if(O.isLine){let St=G.linewidth;St===void 0&&(St=1),Et.setLineWidth(St*Gt()),O.isLineSegments?ne.setMode(P.LINES):O.isLineLoop?ne.setMode(P.LINE_LOOP):ne.setMode(P.LINE_STRIP)}else O.isPoints?ne.setMode(P.POINTS):O.isSprite&&ne.setMode(P.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)ne.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(Wt.get("WEBGL_multi_draw"))ne.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let St=O._multiDrawStarts,Le=O._multiDrawCounts,ie=O._multiDrawCount,Sn=Mt?I.get(Mt).bytesPerElement:1,ji=zt.get(G).currentProgram.getUniforms();for(let rn=0;rn<ie;rn++)ji.setValue(P,"_gl_DrawID",rn),ne.render(St[rn]/Sn,Le[rn])}else if(O.isInstancedMesh)ne.renderInstances(re,ye,O.count);else if(V.isInstancedBufferGeometry){let St=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,Le=Math.min(V.instanceCount,St);ne.renderInstances(re,ye,Le)}else ne.render(re,ye)};function te(A,U,V){A.transparent===!0&&A.side===de&&A.forceSinglePass===!1?(A.side=Be,A.needsUpdate=!0,Kr(A,U,V),A.side=kn,A.needsUpdate=!0,Kr(A,U,V),A.side=de):Kr(A,U,V)}this.compile=function(A,U,V=null){V===null&&(V=A),m=xt.get(V),m.init(U),M.push(m),V.traverseVisible(function(O){O.isLight&&O.layers.test(U.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),A!==V&&A.traverseVisible(function(O){O.isLight&&O.layers.test(U.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),m.setupLights();let G=new Set;return A.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let nt=O.material;if(nt)if(Array.isArray(nt))for(let ut=0;ut<nt.length;ut++){let vt=nt[ut];te(vt,V,O),G.add(vt)}else te(nt,V,O),G.add(nt)}),M.pop(),m=null,G},this.compileAsync=function(A,U,V=null){let G=this.compile(A,U,V);return new Promise(O=>{function nt(){if(G.forEach(function(ut){zt.get(ut).currentProgram.isReady()&&G.delete(ut)}),G.size===0){O(A);return}setTimeout(nt,10)}Wt.get("KHR_parallel_shader_compile")!==null?nt():setTimeout(nt,10)})};let $e=null;function On(A){$e&&$e(A)}function xu(){Ri.stop()}function vu(){Ri.start()}let Ri=new ff;Ri.setAnimationLoop(On),typeof self<"u"&&Ri.setContext(self),this.setAnimationLoop=function(A){$e=A,q.setAnimationLoop(A),A===null?Ri.stop():Ri.start()},q.addEventListener("sessionstart",xu),q.addEventListener("sessionend",vu),this.render=function(A,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),q.enabled===!0&&q.isPresenting===!0&&(q.cameraAutoUpdate===!0&&q.updateCamera(U),U=q.getCamera()),A.isScene===!0&&A.onBeforeRender(x,A,U,E),m=xt.get(A,M.length),m.init(U),M.push(m),pt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Yt.setFromProjectionMatrix(pt),Q=this.localClippingEnabled,Y=J.init(this.clippingPlanes,Q),_=st.get(A,g.length),_.init(),g.push(_),q.enabled===!0&&q.isPresenting===!0){let nt=x.xr.getDepthSensingMesh();nt!==null&&Za(nt,U,-1/0,x.sortObjects)}Za(A,U,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(W,at),Zt=q.enabled===!1||q.isPresenting===!1||q.hasDepthSensing()===!1,Zt&&Pt.addToRenderList(_,A),this.info.render.frame++,Y===!0&&J.beginShadows();let V=m.state.shadowsArray;_t.render(V,A,U),Y===!0&&J.endShadows(),this.info.autoReset===!0&&this.info.reset();let G=_.opaque,O=_.transmissive;if(m.setupLights(),U.isArrayCamera){let nt=U.cameras;if(O.length>0)for(let ut=0,vt=nt.length;ut<vt;ut++){let Mt=nt[ut];wu(G,O,A,Mt)}Zt&&Pt.render(A);for(let ut=0,vt=nt.length;ut<vt;ut++){let Mt=nt[ut];Mu(_,A,Mt,Mt.viewport)}}else O.length>0&&wu(G,O,A,U),Zt&&Pt.render(A),Mu(_,A,U);E!==null&&(R.updateMultisampleRenderTarget(E),R.updateRenderTargetMipmap(E)),A.isScene===!0&&A.onAfterRender(x,A,U),Qt.resetDefaultState(),z=-1,F=null,M.pop(),M.length>0?(m=M[M.length-1],Y===!0&&J.setGlobalState(x.clippingPlanes,m.state.camera)):m=null,g.pop(),g.length>0?_=g[g.length-1]:_=null};function Za(A,U,V,G){if(A.visible===!1)return;if(A.layers.test(U.layers)){if(A.isGroup)V=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(U);else if(A.isLight)m.pushLight(A),A.castShadow&&m.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||Yt.intersectsSprite(A)){G&&wt.setFromMatrixPosition(A.matrixWorld).applyMatrix4(pt);let ut=X.update(A),vt=A.material;vt.visible&&_.push(A,ut,vt,V,wt.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||Yt.intersectsObject(A))){let ut=X.update(A),vt=A.material;if(G&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),wt.copy(A.boundingSphere.center)):(ut.boundingSphere===null&&ut.computeBoundingSphere(),wt.copy(ut.boundingSphere.center)),wt.applyMatrix4(A.matrixWorld).applyMatrix4(pt)),Array.isArray(vt)){let Mt=ut.groups;for(let Ct=0,It=Mt.length;Ct<It;Ct++){let bt=Mt[Ct],re=vt[bt.materialIndex];re&&re.visible&&_.push(A,ut,re,V,wt.z,bt)}}else vt.visible&&_.push(A,ut,vt,V,wt.z,null)}}let nt=A.children;for(let ut=0,vt=nt.length;ut<vt;ut++)Za(nt[ut],U,V,G)}function Mu(A,U,V,G){let O=A.opaque,nt=A.transmissive,ut=A.transparent;m.setupLightsView(V),Y===!0&&J.setGlobalState(x.clippingPlanes,V),G&&Et.viewport(y.copy(G)),O.length>0&&qr(O,U,V),nt.length>0&&qr(nt,U,V),ut.length>0&&qr(ut,U,V),Et.buffers.depth.setTest(!0),Et.buffers.depth.setMask(!0),Et.buffers.color.setMask(!0),Et.setPolygonOffset(!1)}function wu(A,U,V,G){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[G.id]===void 0&&(m.state.transmissionRenderTarget[G.id]=new $n(1,1,{generateMipmaps:!0,type:Wt.has("EXT_color_buffer_half_float")||Wt.has("EXT_color_buffer_float")?Ir:Zn,minFilter:In,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$t.workingColorSpace}));let nt=m.state.transmissionRenderTarget[G.id],ut=G.viewport||y;nt.setSize(ut.z,ut.w);let vt=x.getRenderTarget();x.setRenderTarget(nt),x.getClearColor(L),B=x.getClearAlpha(),B<1&&x.setClearColor(16777215,.5),x.clear(),Zt&&Pt.render(V);let Mt=x.toneMapping;x.toneMapping=_i;let Ct=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),m.setupLightsView(G),Y===!0&&J.setGlobalState(x.clippingPlanes,G),qr(A,V,G),R.updateMultisampleRenderTarget(nt),R.updateRenderTargetMipmap(nt),Wt.has("WEBGL_multisampled_render_to_texture")===!1){let It=!1;for(let bt=0,re=U.length;bt<re;bt++){let he=U[bt],ye=he.object,sn=he.geometry,ne=he.material,St=he.group;if(ne.side===de&&ye.layers.test(G.layers)){let Le=ne.side;ne.side=Be,ne.needsUpdate=!0,bu(ye,V,G,sn,ne,St),ne.side=Le,ne.needsUpdate=!0,It=!0}}It===!0&&(R.updateMultisampleRenderTarget(nt),R.updateRenderTargetMipmap(nt))}x.setRenderTarget(vt),x.setClearColor(L,B),Ct!==void 0&&(G.viewport=Ct),x.toneMapping=Mt}function qr(A,U,V){let G=U.isScene===!0?U.overrideMaterial:null;for(let O=0,nt=A.length;O<nt;O++){let ut=A[O],vt=ut.object,Mt=ut.geometry,Ct=G===null?ut.material:G,It=ut.group;vt.layers.test(V.layers)&&bu(vt,U,V,Mt,Ct,It)}}function bu(A,U,V,G,O,nt){A.onBeforeRender(x,U,V,G,O,nt),A.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),O.onBeforeRender(x,U,V,G,A,nt),O.transparent===!0&&O.side===de&&O.forceSinglePass===!1?(O.side=Be,O.needsUpdate=!0,x.renderBufferDirect(V,U,G,O,A,nt),O.side=kn,O.needsUpdate=!0,x.renderBufferDirect(V,U,G,O,A,nt),O.side=de):x.renderBufferDirect(V,U,G,O,A,nt),A.onAfterRender(x,U,V,G,O,nt)}function Kr(A,U,V){U.isScene!==!0&&(U=Bt);let G=zt.get(A),O=m.state.lights,nt=m.state.shadowsArray,ut=O.state.version,vt=rt.getParameters(A,O.state,nt,U,V),Mt=rt.getProgramCacheKey(vt),Ct=G.programs;G.environment=A.isMeshStandardMaterial?U.environment:null,G.fog=U.fog,G.envMap=(A.isMeshStandardMaterial?k:v).get(A.envMap||G.environment),G.envMapRotation=G.environment!==null&&A.envMap===null?U.environmentRotation:A.envMapRotation,Ct===void 0&&(A.addEventListener("dispose",jt),Ct=new Map,G.programs=Ct);let It=Ct.get(Mt);if(It!==void 0){if(G.currentProgram===It&&G.lightsStateVersion===ut)return Au(A,vt),It}else vt.uniforms=rt.getUniforms(A),A.onBeforeCompile(vt,x),It=rt.acquireProgram(vt,Mt),Ct.set(Mt,It),G.uniforms=vt.uniforms;let bt=G.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(bt.clippingPlanes=J.uniform),Au(A,vt),G.needsLights=yp(A),G.lightsStateVersion=ut,G.needsLights&&(bt.ambientLightColor.value=O.state.ambient,bt.lightProbe.value=O.state.probe,bt.directionalLights.value=O.state.directional,bt.directionalLightShadows.value=O.state.directionalShadow,bt.spotLights.value=O.state.spot,bt.spotLightShadows.value=O.state.spotShadow,bt.rectAreaLights.value=O.state.rectArea,bt.ltc_1.value=O.state.rectAreaLTC1,bt.ltc_2.value=O.state.rectAreaLTC2,bt.pointLights.value=O.state.point,bt.pointLightShadows.value=O.state.pointShadow,bt.hemisphereLights.value=O.state.hemi,bt.directionalShadowMap.value=O.state.directionalShadowMap,bt.directionalShadowMatrix.value=O.state.directionalShadowMatrix,bt.spotShadowMap.value=O.state.spotShadowMap,bt.spotLightMatrix.value=O.state.spotLightMatrix,bt.spotLightMap.value=O.state.spotLightMap,bt.pointShadowMap.value=O.state.pointShadowMap,bt.pointShadowMatrix.value=O.state.pointShadowMatrix),G.currentProgram=It,G.uniformsList=null,It}function Su(A){if(A.uniformsList===null){let U=A.currentProgram.getUniforms();A.uniformsList=Ss.seqWithValue(U.seq,A.uniforms)}return A.uniformsList}function Au(A,U){let V=zt.get(A);V.outputColorSpace=U.outputColorSpace,V.batching=U.batching,V.batchingColor=U.batchingColor,V.instancing=U.instancing,V.instancingColor=U.instancingColor,V.instancingMorph=U.instancingMorph,V.skinning=U.skinning,V.morphTargets=U.morphTargets,V.morphNormals=U.morphNormals,V.morphColors=U.morphColors,V.morphTargetsCount=U.morphTargetsCount,V.numClippingPlanes=U.numClippingPlanes,V.numIntersection=U.numClipIntersection,V.vertexAlphas=U.vertexAlphas,V.vertexTangents=U.vertexTangents,V.toneMapping=U.toneMapping}function gp(A,U,V,G,O){U.isScene!==!0&&(U=Bt),R.resetTextureUnits();let nt=U.fog,ut=G.isMeshStandardMaterial?U.environment:null,vt=E===null?x.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Ie,Mt=(G.isMeshStandardMaterial?k:v).get(G.envMap||ut),Ct=G.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,It=!!V.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),bt=!!V.morphAttributes.position,re=!!V.morphAttributes.normal,he=!!V.morphAttributes.color,ye=_i;G.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(ye=x.toneMapping);let sn=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,ne=sn!==void 0?sn.length:0,St=zt.get(G),Le=m.state.lights;if(Y===!0&&(Q===!0||A!==F)){let pn=A===F&&G.id===z;J.setState(G,A,pn)}let ie=!1;G.version===St.__version?(St.needsLights&&St.lightsStateVersion!==Le.state.version||St.outputColorSpace!==vt||O.isBatchedMesh&&St.batching===!1||!O.isBatchedMesh&&St.batching===!0||O.isBatchedMesh&&St.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&St.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&St.instancing===!1||!O.isInstancedMesh&&St.instancing===!0||O.isSkinnedMesh&&St.skinning===!1||!O.isSkinnedMesh&&St.skinning===!0||O.isInstancedMesh&&St.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&St.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&St.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&St.instancingMorph===!1&&O.morphTexture!==null||St.envMap!==Mt||G.fog===!0&&St.fog!==nt||St.numClippingPlanes!==void 0&&(St.numClippingPlanes!==J.numPlanes||St.numIntersection!==J.numIntersection)||St.vertexAlphas!==Ct||St.vertexTangents!==It||St.morphTargets!==bt||St.morphNormals!==re||St.morphColors!==he||St.toneMapping!==ye||St.morphTargetsCount!==ne)&&(ie=!0):(ie=!0,St.__version=G.version);let Sn=St.currentProgram;ie===!0&&(Sn=Kr(G,U,O));let ji=!1,rn=!1,ja=!1,xe=Sn.getUniforms(),oi=St.uniforms;if(Et.useProgram(Sn.program)&&(ji=!0,rn=!0,ja=!0),G.id!==z&&(z=G.id,rn=!0),ji||F!==A){Ht.reverseDepthBuffer?(dt.copy(A.projectionMatrix),Am(dt),Tm(dt),xe.setValue(P,"projectionMatrix",dt)):xe.setValue(P,"projectionMatrix",A.projectionMatrix),xe.setValue(P,"viewMatrix",A.matrixWorldInverse);let pn=xe.map.cameraPosition;pn!==void 0&&pn.setValue(P,kt.setFromMatrixPosition(A.matrixWorld)),Ht.logarithmicDepthBuffer&&xe.setValue(P,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&xe.setValue(P,"isOrthographic",A.isOrthographicCamera===!0),F!==A&&(F=A,rn=!0,ja=!0)}if(O.isSkinnedMesh){xe.setOptional(P,O,"bindMatrix"),xe.setOptional(P,O,"bindMatrixInverse");let pn=O.skeleton;pn&&(pn.boneTexture===null&&pn.computeBoneTexture(),xe.setValue(P,"boneTexture",pn.boneTexture,R))}O.isBatchedMesh&&(xe.setOptional(P,O,"batchingTexture"),xe.setValue(P,"batchingTexture",O._matricesTexture,R),xe.setOptional(P,O,"batchingIdTexture"),xe.setValue(P,"batchingIdTexture",O._indirectTexture,R),xe.setOptional(P,O,"batchingColorTexture"),O._colorsTexture!==null&&xe.setValue(P,"batchingColorTexture",O._colorsTexture,R));let $a=V.morphAttributes;if(($a.position!==void 0||$a.normal!==void 0||$a.color!==void 0)&&Rt.update(O,V,Sn),(rn||St.receiveShadow!==O.receiveShadow)&&(St.receiveShadow=O.receiveShadow,xe.setValue(P,"receiveShadow",O.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(oi.envMap.value=Mt,oi.flipEnvMap.value=Mt.isCubeTexture&&Mt.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&U.environment!==null&&(oi.envMapIntensity.value=U.environmentIntensity),rn&&(xe.setValue(P,"toneMappingExposure",x.toneMappingExposure),St.needsLights&&_p(oi,ja),nt&&G.fog===!0&&et.refreshFogUniforms(oi,nt),et.refreshMaterialUniforms(oi,G,$,H,m.state.transmissionRenderTarget[A.id]),Ss.upload(P,Su(St),oi,R)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Ss.upload(P,Su(St),oi,R),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&xe.setValue(P,"center",O.center),xe.setValue(P,"modelViewMatrix",O.modelViewMatrix),xe.setValue(P,"normalMatrix",O.normalMatrix),xe.setValue(P,"modelMatrix",O.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){let pn=G.uniformsGroups;for(let Ja=0,xp=pn.length;Ja<xp;Ja++){let Tu=pn[Ja];D.update(Tu,Sn),D.bind(Tu,Sn)}}return Sn}function _p(A,U){A.ambientLightColor.needsUpdate=U,A.lightProbe.needsUpdate=U,A.directionalLights.needsUpdate=U,A.directionalLightShadows.needsUpdate=U,A.pointLights.needsUpdate=U,A.pointLightShadows.needsUpdate=U,A.spotLights.needsUpdate=U,A.spotLightShadows.needsUpdate=U,A.rectAreaLights.needsUpdate=U,A.hemisphereLights.needsUpdate=U}function yp(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(A,U,V){zt.get(A.texture).__webglTexture=U,zt.get(A.depthTexture).__webglTexture=V;let G=zt.get(A);G.__hasExternalTextures=!0,G.__autoAllocateDepthBuffer=V===void 0,G.__autoAllocateDepthBuffer||Wt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,U){let V=zt.get(A);V.__webglFramebuffer=U,V.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(A,U=0,V=0){E=A,C=U,T=V;let G=!0,O=null,nt=!1,ut=!1;if(A){let Mt=zt.get(A);if(Mt.__useDefaultFramebuffer!==void 0)Et.bindFramebuffer(P.FRAMEBUFFER,null),G=!1;else if(Mt.__webglFramebuffer===void 0)R.setupRenderTarget(A);else if(Mt.__hasExternalTextures)R.rebindTextures(A,zt.get(A.texture).__webglTexture,zt.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){let bt=A.depthTexture;if(Mt.__boundDepthTexture!==bt){if(bt!==null&&zt.has(bt)&&(A.width!==bt.image.width||A.height!==bt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(A)}}let Ct=A.texture;(Ct.isData3DTexture||Ct.isDataArrayTexture||Ct.isCompressedArrayTexture)&&(ut=!0);let It=zt.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(It[U])?O=It[U][V]:O=It[U],nt=!0):A.samples>0&&R.useMultisampledRTT(A)===!1?O=zt.get(A).__webglMultisampledFramebuffer:Array.isArray(It)?O=It[V]:O=It,y.copy(A.viewport),S.copy(A.scissor),N=A.scissorTest}else y.copy(ct).multiplyScalar($).floor(),S.copy(gt).multiplyScalar($).floor(),N=Ft;if(Et.bindFramebuffer(P.FRAMEBUFFER,O)&&G&&Et.drawBuffers(A,O),Et.viewport(y),Et.scissor(S),Et.setScissorTest(N),nt){let Mt=zt.get(A.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+U,Mt.__webglTexture,V)}else if(ut){let Mt=zt.get(A.texture),Ct=U||0;P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,Mt.__webglTexture,V||0,Ct)}z=-1},this.readRenderTargetPixels=function(A,U,V,G,O,nt,ut){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let vt=zt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ut!==void 0&&(vt=vt[ut]),vt){Et.bindFramebuffer(P.FRAMEBUFFER,vt);try{let Mt=A.texture,Ct=Mt.format,It=Mt.type;if(!Ht.textureFormatReadable(Ct)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ht.textureTypeReadable(It)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=A.width-G&&V>=0&&V<=A.height-O&&P.readPixels(U,V,G,O,Lt.convert(Ct),Lt.convert(It),nt)}finally{let Mt=E!==null?zt.get(E).__webglFramebuffer:null;Et.bindFramebuffer(P.FRAMEBUFFER,Mt)}}},this.readRenderTargetPixelsAsync=async function(A,U,V,G,O,nt,ut){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let vt=zt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ut!==void 0&&(vt=vt[ut]),vt){let Mt=A.texture,Ct=Mt.format,It=Mt.type;if(!Ht.textureFormatReadable(Ct))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ht.textureTypeReadable(It))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(U>=0&&U<=A.width-G&&V>=0&&V<=A.height-O){Et.bindFramebuffer(P.FRAMEBUFFER,vt);let bt=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,bt),P.bufferData(P.PIXEL_PACK_BUFFER,nt.byteLength,P.STREAM_READ),P.readPixels(U,V,G,O,Lt.convert(Ct),Lt.convert(It),0);let re=E!==null?zt.get(E).__webglFramebuffer:null;Et.bindFramebuffer(P.FRAMEBUFFER,re);let he=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Sm(P,he,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,bt),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,nt),P.deleteBuffer(bt),P.deleteSync(he),nt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,U=null,V=0){A.isTexture!==!0&&(Io("WebGLRenderer: copyFramebufferToTexture function signature has changed."),U=arguments[0]||null,A=arguments[1]);let G=Math.pow(2,-V),O=Math.floor(A.image.width*G),nt=Math.floor(A.image.height*G),ut=U!==null?U.x:0,vt=U!==null?U.y:0;R.setTexture2D(A,0),P.copyTexSubImage2D(P.TEXTURE_2D,V,0,0,ut,vt,O,nt),Et.unbindTexture()},this.copyTextureToTexture=function(A,U,V=null,G=null,O=0){A.isTexture!==!0&&(Io("WebGLRenderer: copyTextureToTexture function signature has changed."),G=arguments[0]||null,A=arguments[1],U=arguments[2],O=arguments[3]||0,V=null);let nt,ut,vt,Mt,Ct,It;V!==null?(nt=V.max.x-V.min.x,ut=V.max.y-V.min.y,vt=V.min.x,Mt=V.min.y):(nt=A.image.width,ut=A.image.height,vt=0,Mt=0),G!==null?(Ct=G.x,It=G.y):(Ct=0,It=0);let bt=Lt.convert(U.format),re=Lt.convert(U.type);R.setTexture2D(U,0),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,U.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,U.unpackAlignment);let he=P.getParameter(P.UNPACK_ROW_LENGTH),ye=P.getParameter(P.UNPACK_IMAGE_HEIGHT),sn=P.getParameter(P.UNPACK_SKIP_PIXELS),ne=P.getParameter(P.UNPACK_SKIP_ROWS),St=P.getParameter(P.UNPACK_SKIP_IMAGES),Le=A.isCompressedTexture?A.mipmaps[O]:A.image;P.pixelStorei(P.UNPACK_ROW_LENGTH,Le.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Le.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,vt),P.pixelStorei(P.UNPACK_SKIP_ROWS,Mt),A.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,O,Ct,It,nt,ut,bt,re,Le.data):A.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,O,Ct,It,Le.width,Le.height,bt,Le.data):P.texSubImage2D(P.TEXTURE_2D,O,Ct,It,nt,ut,bt,re,Le),P.pixelStorei(P.UNPACK_ROW_LENGTH,he),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,ye),P.pixelStorei(P.UNPACK_SKIP_PIXELS,sn),P.pixelStorei(P.UNPACK_SKIP_ROWS,ne),P.pixelStorei(P.UNPACK_SKIP_IMAGES,St),O===0&&U.generateMipmaps&&P.generateMipmap(P.TEXTURE_2D),Et.unbindTexture()},this.copyTextureToTexture3D=function(A,U,V=null,G=null,O=0){A.isTexture!==!0&&(Io("WebGLRenderer: copyTextureToTexture3D function signature has changed."),V=arguments[0]||null,G=arguments[1]||null,A=arguments[2],U=arguments[3],O=arguments[4]||0);let nt,ut,vt,Mt,Ct,It,bt,re,he,ye=A.isCompressedTexture?A.mipmaps[O]:A.image;V!==null?(nt=V.max.x-V.min.x,ut=V.max.y-V.min.y,vt=V.max.z-V.min.z,Mt=V.min.x,Ct=V.min.y,It=V.min.z):(nt=ye.width,ut=ye.height,vt=ye.depth,Mt=0,Ct=0,It=0),G!==null?(bt=G.x,re=G.y,he=G.z):(bt=0,re=0,he=0);let sn=Lt.convert(U.format),ne=Lt.convert(U.type),St;if(U.isData3DTexture)R.setTexture3D(U,0),St=P.TEXTURE_3D;else if(U.isDataArrayTexture||U.isCompressedArrayTexture)R.setTexture2DArray(U,0),St=P.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,U.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,U.unpackAlignment);let Le=P.getParameter(P.UNPACK_ROW_LENGTH),ie=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Sn=P.getParameter(P.UNPACK_SKIP_PIXELS),ji=P.getParameter(P.UNPACK_SKIP_ROWS),rn=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,ye.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,ye.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Mt),P.pixelStorei(P.UNPACK_SKIP_ROWS,Ct),P.pixelStorei(P.UNPACK_SKIP_IMAGES,It),A.isDataTexture||A.isData3DTexture?P.texSubImage3D(St,O,bt,re,he,nt,ut,vt,sn,ne,ye.data):U.isCompressedArrayTexture?P.compressedTexSubImage3D(St,O,bt,re,he,nt,ut,vt,sn,ye.data):P.texSubImage3D(St,O,bt,re,he,nt,ut,vt,sn,ne,ye),P.pixelStorei(P.UNPACK_ROW_LENGTH,Le),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,ie),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Sn),P.pixelStorei(P.UNPACK_SKIP_ROWS,ji),P.pixelStorei(P.UNPACK_SKIP_IMAGES,rn),O===0&&U.generateMipmaps&&P.generateMipmap(St),Et.unbindTexture()},this.initRenderTarget=function(A){zt.get(A).__webglFramebuffer===void 0&&R.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?R.setTextureCube(A,0):A.isData3DTexture?R.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?R.setTexture2DArray(A,0):R.setTexture2D(A,0),Et.unbindTexture()},this.resetState=function(){C=0,T=0,E=null,Et.reset(),Qt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Yn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===vh?"display-p3":"srgb",e.unpackColorSpace=$t.workingColorSpace===ya?"display-p3":"srgb"}};var Ko=class extends fe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ln,this.environmentIntensity=1,this.environmentRotation=new ln,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}},Ds=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=yl,this.updateRanges=[],this.version=0,this.uuid=_n()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,r=this.stride;i<r;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=_n()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=_n()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},We=new b,Hi=class s{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)We.fromBufferAttribute(this,e),We.applyMatrix4(t),this.setXYZ(e,We.x,We.y,We.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)We.fromBufferAttribute(this,e),We.applyNormalMatrix(t),this.setXYZ(e,We.x,We.y,We.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)We.fromBufferAttribute(this,e),We.transformDirection(t),this.setXYZ(e,We.x,We.y,We.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Rn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=oe(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=oe(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=oe(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=oe(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=oe(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Rn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Rn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Rn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Rn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=oe(e,this.array),n=oe(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=oe(e,this.array),n=oe(n,this.array),i=oe(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=oe(e,this.array),n=oe(n,this.array),i=oe(i,this.array),r=oe(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return new Se(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new s(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Ye=class extends qe{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new tt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},us,er=new b,ds=new b,fs=new b,ps=new it,nr=new it,yf=new At,mo=new b,ir=new b,go=new b,vd=new it,Ec=new it,Md=new it,Qe=class extends fe{constructor(t=new Ye){if(super(),this.isSprite=!0,this.type="Sprite",us===void 0){us=new Jt;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Ds(e,5);us.setIndex([0,1,2,0,2,3]),us.setAttribute("position",new Hi(n,3,0,!1)),us.setAttribute("uv",new Hi(n,2,3,!1))}this.geometry=us,this.material=t,this.center=new it(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ds.setFromMatrixScale(this.matrixWorld),yf.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),fs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ds.multiplyScalar(-fs.z);let n=this.material.rotation,i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));let o=this.center;_o(mo.set(-.5,-.5,0),fs,o,ds,i,r),_o(ir.set(.5,-.5,0),fs,o,ds,i,r),_o(go.set(.5,.5,0),fs,o,ds,i,r),vd.set(0,0),Ec.set(1,0),Md.set(1,1);let a=t.ray.intersectTriangle(mo,ir,go,!1,er);if(a===null&&(_o(ir.set(-.5,.5,0),fs,o,ds,i,r),Ec.set(0,1),a=t.ray.intersectTriangle(mo,go,ir,!1,er),a===null))return;let c=t.ray.origin.distanceTo(er);c<t.near||c>t.far||e.push({distance:c,point:er.clone(),uv:pi.getInterpolation(er,mo,ir,go,vd,Ec,Md,new it),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function _o(s,t,e,n,i,r){ps.subVectors(s,e).addScalar(.5).multiply(n),i!==void 0?(nr.x=r*ps.x-i*ps.y,nr.y=i*ps.x+r*ps.y):nr.copy(ps),s.copy(t),s.x+=nr.x,s.y+=nr.y,s.applyMatrix4(yf)}var wd=new b,bd=new Kt,Sd=new Kt,Mx=new b,Ad=new At,yo=new b,Rc=new cn,Td=new At,Cc=new Bi,Yo=class extends Dt{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=zu,this.bindMatrix=new At,this.bindMatrixInverse=new At,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let t=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ae),this.boundingBox.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,yo),this.boundingBox.expandByPoint(yo)}computeBoundingSphere(){let t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new cn),this.boundingSphere.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,yo),this.boundingSphere.expandByPoint(yo)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Rc.copy(this.boundingSphere),Rc.applyMatrix4(i),t.ray.intersectsSphere(Rc)!==!1&&(Td.copy(i).invert(),Cc.copy(t.ray).applyMatrix4(Td),!(this.boundingBox!==null&&Cc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,Cc)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let t=new Kt,e=this.geometry.attributes.skinWeight;for(let n=0,i=e.count;n<i;n++){t.fromBufferAttribute(e,n);let r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===zu?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Yp?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){let n=this.skeleton,i=this.geometry;bd.fromBufferAttribute(i.attributes.skinIndex,t),Sd.fromBufferAttribute(i.attributes.skinWeight,t),wd.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let r=0;r<4;r++){let o=Sd.getComponent(r);if(o!==0){let a=bd.getComponent(r);Ad.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),e.addScaledVector(Mx.copy(wd).applyMatrix4(Ad),o)}}return e.applyMatrix4(this.bindMatrixInverse)}},wr=class extends fe{constructor(){super(),this.isBone=!0,this.type="Bone"}},Zo=class extends Pe{constructor(t=null,e=1,n=1,i,r,o,a,c,l=Fe,h=Fe,u,d){super(null,o,a,c,l,h,i,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Ed=new At,wx=new At,jo=class s{constructor(t=[],e=[]){this.uuid=_n(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new At)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){let n=new At;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let t=this.bones,e=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,o=t.length;r<o;r++){let a=t[r]?t[r].matrixWorld:wx;Ed.multiplyMatrices(a,e[r]),Ed.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new s(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);let e=new Float32Array(t*t*4);e.set(this.boneMatrices);let n=new Zo(e,t,t,gn,Cn);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){let i=this.bones[e];if(i.name===t)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,i=t.bones.length;n<i;n++){let r=t.bones[n],o=e[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new wr),this.bones.push(o),this.boneInverses.push(new At().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){let t={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;let e=this.bones,n=this.boneInverses;for(let i=0,r=e.length;i<r;i++){let o=e[i];t.bones.push(o.uuid);let a=n[i];t.boneInverses.push(a.toArray())}return t}},Vi=class extends Se{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},ms=new At,Rd=new At,xo=[],Cd=new Ae,bx=new At,sr=new Dt,rr=new cn,Ne=class extends Dt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Vi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,bx)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ae),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ms),Cd.copy(t.boundingBox).applyMatrix4(ms),this.boundingBox.union(Cd)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new cn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ms),rr.copy(t.boundingSphere).applyMatrix4(ms),this.boundingSphere.union(rr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(t,e){let n=this.matrixWorld,i=this.count;if(sr.geometry=this.geometry,sr.material=this.material,sr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),rr.copy(this.boundingSphere),rr.applyMatrix4(n),t.ray.intersectsSphere(rr)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,ms),Rd.multiplyMatrices(n,ms),sr.matrixWorld=Rd,sr.raycast(t,xo);for(let o=0,a=xo.length;o<a;o++){let c=xo[o];c.instanceId=r,c.object=this,e.push(c)}xo.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Vi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){let n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Zo(new Float32Array(i*this.count),i,this.count,fh,Cn));let r=this.morphTexture.source.data.data,o=0;for(let l=0;l<n.length;l++)o+=n[l];let a=this.geometry.morphTargetsRelative?1:1-o,c=i*t;r[c]=a,r.set(n,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var br=class extends qe{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new tt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},$o=new b,Jo=new b,zd=new At,or=new Bi,vo=new cn,zc=new b,Pd=new b,Ns=class extends fe{constructor(t=new Jt,e=new br){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)$o.fromBufferAttribute(e,i-1),Jo.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=$o.distanceTo(Jo);t.setAttribute("lineDistance",new Tt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),vo.copy(n.boundingSphere),vo.applyMatrix4(i),vo.radius+=r,t.ray.intersectsSphere(vo)===!1)return;zd.copy(i).invert(),or.copy(t.ray).applyMatrix4(zd);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let _=f,m=p-1;_<m;_+=l){let g=h.getX(_),M=h.getX(_+1),x=Mo(this,t,or,c,g,M);x&&e.push(x)}if(this.isLineLoop){let _=h.getX(p-1),m=h.getX(f),g=Mo(this,t,or,c,_,m);g&&e.push(g)}}else{let f=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let _=f,m=p-1;_<m;_+=l){let g=Mo(this,t,or,c,_,_+1);g&&e.push(g)}if(this.isLineLoop){let _=Mo(this,t,or,c,p-1,f);_&&e.push(_)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Mo(s,t,e,n,i,r){let o=s.geometry.attributes.position;if($o.fromBufferAttribute(o,i),Jo.fromBufferAttribute(o,r),e.distanceSqToSegment($o,Jo,zc,Pd)>n)return;zc.applyMatrix4(s.matrixWorld);let c=t.ray.origin.distanceTo(zc);if(!(c<t.near||c>t.far))return{distance:c,point:Pd.clone().applyMatrix4(s.matrixWorld),index:i,face:null,faceIndex:null,barycoord:null,object:s}}var Id=new b,kd=new b,Qo=class extends Ns{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let i=0,r=e.count;i<r;i+=2)Id.fromBufferAttribute(e,i),kd.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Id.distanceTo(kd);t.setAttribute("lineDistance",new Tt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},ta=class extends Ns{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}},Gi=class extends qe{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new tt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Ld=new At,Dl=new Bi,wo=new cn,bo=new b,Us=class extends fe{constructor(t=new Jt,e=new Gi){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),wo.copy(n.boundingSphere),wo.applyMatrix4(i),wo.radius+=r,t.ray.intersectsSphere(wo)===!1)return;Ld.copy(i).invert(),Dl.copy(t.ray).applyMatrix4(Ld);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){let d=Math.max(0,o.start),f=Math.min(l.count,o.start+o.count);for(let p=d,_=f;p<_;p++){let m=l.getX(p);bo.fromBufferAttribute(u,m),Dd(bo,m,c,i,t,e,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let p=d,_=f;p<_;p++)bo.fromBufferAttribute(u,p),Dd(bo,p,c,i,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Dd(s,t,e,n,i,r,o){let a=Dl.distanceSqToPoint(s);if(a<e){let c=new b;Dl.closestPointToPoint(s,c),c.applyMatrix4(n);let l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var _e=class extends Pe{constructor(t,e,n,i,r,o,a,c,l){super(t,e,n,i,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},xn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,i=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let n=this.getLengths(),i=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(i=Math.floor(a+(c-a)/2),l=n[i]-o,l<0)a=i+1;else if(l>0)c=i-1;else{c=i;break}if(i=c,n[i]===o)return i/(r-1);let h=n[i],d=n[i+1]-h,f=(o-h)/d;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);let o=this.getPoint(i),a=this.getPoint(r),c=e||(o.isVector2?new it:new b);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){let n=new b,i=[],r=[],o=[],a=new b,c=new At;for(let f=0;f<=t;f++){let p=f/t;i[f]=this.getTangentAt(p,new b)}r[0]=new b,o[0]=new b;let l=Number.MAX_VALUE,h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();let p=Math.acos(ze(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(a,p))}o[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(ze(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(c.makeRotationAxis(i[p],f*p)),o[p].crossVectors(i[p],r[p])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Sr=class extends xn{constructor(t=0,e=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new it){let n=e,i=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);let a=this.aStartAngle+t*r,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Nl=class extends Sr{constructor(t,e,n,i,r,o){super(t,e,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function bh(){let s=0,t=0,e=0,n=0;function i(r,o,a,c){s=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){i(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let d=(o-r)/l-(a-r)/(l+h)+(a-o)/h,f=(a-o)/h-(c-o)/(h+u)+(c-a)/u;d*=h,f*=h,i(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return s+t*r+e*o+n*a}}}var So=new b,Pc=new bh,Ic=new bh,kc=new bh,Ul=class extends xn{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new b){let n=e,i=this.points,r=i.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=i[(a-1)%r]:(So.subVectors(i[0],i[1]).add(i[0]),l=So);let u=i[a%r],d=i[(a+1)%r];if(this.closed||a+2<r?h=i[(a+2)%r]:(So.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=So),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,p=Math.pow(l.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),p<1e-4&&(p=_),m<1e-4&&(m=_),Pc.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,p,_,m),Ic.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,p,_,m),kc.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,p,_,m)}else this.curveType==="catmullrom"&&(Pc.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Ic.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),kc.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(Pc.calc(c),Ic.calc(c),kc.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new b().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Nd(s,t,e,n,i){let r=(n-t)*.5,o=(i-e)*.5,a=s*s,c=s*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*s+e}function Sx(s,t){let e=1-s;return e*e*t}function Ax(s,t){return 2*(1-s)*s*t}function Tx(s,t){return s*s*t}function fr(s,t,e,n){return Sx(s,t)+Ax(s,e)+Tx(s,n)}function Ex(s,t){let e=1-s;return e*e*e*t}function Rx(s,t){let e=1-s;return 3*e*e*s*t}function Cx(s,t){return 3*(1-s)*s*s*t}function zx(s,t){return s*s*s*t}function pr(s,t,e,n,i){return Ex(s,t)+Rx(s,e)+Cx(s,n)+zx(s,i)}var ea=class extends xn{constructor(t=new it,e=new it,n=new it,i=new it){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new it){let n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(pr(t,i.x,r.x,o.x,a.x),pr(t,i.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Ol=class extends xn{constructor(t=new b,e=new b,n=new b,i=new b){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new b){let n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(pr(t,i.x,r.x,o.x,a.x),pr(t,i.y,r.y,o.y,a.y),pr(t,i.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},na=class extends xn{constructor(t=new it,e=new it){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new it){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new it){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Fl=class extends xn{constructor(t=new b,e=new b){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new b){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new b){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ia=class extends xn{constructor(t=new it,e=new it,n=new it){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new it){let n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(fr(t,i.x,r.x,o.x),fr(t,i.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Bl=class extends xn{constructor(t=new b,e=new b,n=new b){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new b){let n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(fr(t,i.x,r.x,o.x),fr(t,i.y,r.y,o.y),fr(t,i.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},sa=class extends xn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new it){let n=e,i=this.points,r=(i.length-1)*t,o=Math.floor(r),a=r-o,c=i[o===0?o:o-1],l=i[o],h=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(Nd(a,c.x,l.x,h.x,u.x),Nd(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new it().fromArray(i))}return this}},Ud=Object.freeze({__proto__:null,ArcCurve:Nl,CatmullRomCurve3:Ul,CubicBezierCurve:ea,CubicBezierCurve3:Ol,EllipseCurve:Sr,LineCurve:na,LineCurve3:Fl,QuadraticBezierCurve:ia,QuadraticBezierCurve3:Bl,SplineCurve:sa}),Hl=class extends xn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ud[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),i=this.getCurveLengths(),r=0;for(;r<i.length;){if(i[r]>=n){let o=i[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let i=0,r=this.curves;i<r.length;i++){let o=r[i],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(new Ud[i.type]().fromJSON(i))}return this}},ra=class extends Hl{constructor(t){super(),this.type="Path",this.currentPoint=new it,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new na(this.currentPoint.clone(),new it(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){let r=new ia(this.currentPoint.clone(),new it(t,e),new it(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,o){let a=new ea(this.currentPoint.clone(),new it(t,e),new it(n,i),new it(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new sa(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,o){let a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,i,r,o),this}absarc(t,e,n,i,r,o){return this.absellipse(t,e,n,n,i,r,o),this}ellipse(t,e,n,i,r,o,a,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,i,r,o,a,c),this}absellipse(t,e,n,i,r,o,a,c){let l=new Sr(t,e,n,i,r,o,a,c);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}};var tn=class s extends Jt{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;i=Math.floor(i),r=Math.floor(r);let h=[],u=[],d=[],f=[],p=0,_=[],m=n/2,g=0;M(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new Tt(u,3)),this.setAttribute("normal",new Tt(d,3)),this.setAttribute("uv",new Tt(f,2));function M(){let w=new b,C=new b,T=0,E=(e-t)/n;for(let z=0;z<=r;z++){let F=[],y=z/r,S=y*(e-t)+t;for(let N=0;N<=i;N++){let L=N/i,B=L*c+a,Z=Math.sin(B),H=Math.cos(B);C.x=S*Z,C.y=-y*n+m,C.z=S*H,u.push(C.x,C.y,C.z),w.set(Z,E,H).normalize(),d.push(w.x,w.y,w.z),f.push(L,1-y),F.push(p++)}_.push(F)}for(let z=0;z<i;z++)for(let F=0;F<r;F++){let y=_[F][z],S=_[F+1][z],N=_[F+1][z+1],L=_[F][z+1];t>0&&(h.push(y,S,L),T+=3),e>0&&(h.push(S,N,L),T+=3)}l.addGroup(g,T,0),g+=T}function x(w){let C=p,T=new it,E=new b,z=0,F=w===!0?t:e,y=w===!0?1:-1;for(let N=1;N<=i;N++)u.push(0,m*y,0),d.push(0,y,0),f.push(.5,.5),p++;let S=p;for(let N=0;N<=i;N++){let B=N/i*c+a,Z=Math.cos(B),H=Math.sin(B);E.x=F*H,E.y=m*y,E.z=F*Z,u.push(E.x,E.y,E.z),d.push(0,y,0),T.x=Z*.5+.5,T.y=H*.5*y+.5,f.push(T.x,T.y),p++}for(let N=0;N<i;N++){let L=C+N,B=S+N;w===!0?h.push(B,B+1,L):h.push(B+1,B,L),z+=3}l.addGroup(g,z,w===!0?1:2),g+=z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},xi=class s extends tn{constructor(t=1,e=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new s(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Vl=class s extends Jt{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};let r=[],o=[];a(i),l(n),h(),this.setAttribute("position",new Tt(r,3)),this.setAttribute("normal",new Tt(r.slice(),3)),this.setAttribute("uv",new Tt(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(M){let x=new b,w=new b,C=new b;for(let T=0;T<e.length;T+=3)f(e[T+0],x),f(e[T+1],w),f(e[T+2],C),c(x,w,C,M)}function c(M,x,w,C){let T=C+1,E=[];for(let z=0;z<=T;z++){E[z]=[];let F=M.clone().lerp(w,z/T),y=x.clone().lerp(w,z/T),S=T-z;for(let N=0;N<=S;N++)N===0&&z===T?E[z][N]=F:E[z][N]=F.clone().lerp(y,N/S)}for(let z=0;z<T;z++)for(let F=0;F<2*(T-z)-1;F++){let y=Math.floor(F/2);F%2===0?(d(E[z][y+1]),d(E[z+1][y]),d(E[z][y])):(d(E[z][y+1]),d(E[z+1][y+1]),d(E[z+1][y]))}}function l(M){let x=new b;for(let w=0;w<r.length;w+=3)x.x=r[w+0],x.y=r[w+1],x.z=r[w+2],x.normalize().multiplyScalar(M),r[w+0]=x.x,r[w+1]=x.y,r[w+2]=x.z}function h(){let M=new b;for(let x=0;x<r.length;x+=3){M.x=r[x+0],M.y=r[x+1],M.z=r[x+2];let w=m(M)/2/Math.PI+.5,C=g(M)/Math.PI+.5;o.push(w,1-C)}p(),u()}function u(){for(let M=0;M<o.length;M+=6){let x=o[M+0],w=o[M+2],C=o[M+4],T=Math.max(x,w,C),E=Math.min(x,w,C);T>.9&&E<.1&&(x<.2&&(o[M+0]+=1),w<.2&&(o[M+2]+=1),C<.2&&(o[M+4]+=1))}}function d(M){r.push(M.x,M.y,M.z)}function f(M,x){let w=M*3;x.x=t[w+0],x.y=t[w+1],x.z=t[w+2]}function p(){let M=new b,x=new b,w=new b,C=new b,T=new it,E=new it,z=new it;for(let F=0,y=0;F<r.length;F+=9,y+=6){M.set(r[F+0],r[F+1],r[F+2]),x.set(r[F+3],r[F+4],r[F+5]),w.set(r[F+6],r[F+7],r[F+8]),T.set(o[y+0],o[y+1]),E.set(o[y+2],o[y+3]),z.set(o[y+4],o[y+5]),C.copy(M).add(x).add(w).divideScalar(3);let S=m(C);_(T,y+0,M,S),_(E,y+2,x,S),_(z,y+4,w,S)}}function _(M,x,w,C){C<0&&M.x===1&&(o[x]=M.x-1),w.x===0&&w.z===0&&(o[x]=C/2/Math.PI+.5)}function m(M){return Math.atan2(M.z,-M.x)}function g(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.vertices,t.indices,t.radius,t.details)}};var Ar=class extends ra{constructor(t){super(t),this.uuid=_n(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(new ra().fromJSON(i))}return this}},Px={triangulate:function(s,t,e=2){let n=t&&t.length,i=n?t[0]*e:s.length,r=xf(s,0,i,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,c,l,h,u,d,f;if(n&&(r=Nx(s,t,r,e)),s.length>80*e){a=l=s[0],c=h=s[1];for(let p=e;p<i;p+=e)u=s[p],d=s[p+1],u<a&&(a=u),d<c&&(c=d),u>l&&(l=u),d>h&&(h=d);f=Math.max(l-a,h-c),f=f!==0?32767/f:0}return Tr(r,o,e,a,c,f,0),o}};function xf(s,t,e,n,i){let r,o;if(i===Kx(s,t,e,n)>0)for(r=t;r<e;r+=n)o=Od(r,s[r],s[r+1],o);else for(r=e-n;r>=t;r-=n)o=Od(r,s[r],s[r+1],o);return o&&va(o,o.next)&&(Rr(o),o=o.next),o}function Wi(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(va(e,e.next)||ge(e.prev,e,e.next)===0)){if(Rr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Tr(s,t,e,n,i,r,o){if(!s)return;!o&&r&&Hx(s,n,i,r);let a=s,c,l;for(;s.prev!==s.next;){if(c=s.prev,l=s.next,r?kx(s,n,i,r):Ix(s)){t.push(c.i/e|0),t.push(s.i/e|0),t.push(l.i/e|0),Rr(s),s=l.next,a=l.next;continue}if(s=l,s===a){o?o===1?(s=Lx(Wi(s),t,e),Tr(s,t,e,n,i,r,2)):o===2&&Dx(s,t,e,n,i,r):Tr(Wi(s),t,e,n,i,r,1);break}}}function Ix(s){let t=s.prev,e=s,n=s.next;if(ge(t,e,n)>=0)return!1;let i=t.x,r=e.x,o=n.x,a=t.y,c=e.y,l=n.y,h=i<r?i<o?i:o:r<o?r:o,u=a<c?a<l?a:l:c<l?c:l,d=i>r?i>o?i:o:r>o?r:o,f=a>c?a>l?a:l:c>l?c:l,p=n.next;for(;p!==t;){if(p.x>=h&&p.x<=d&&p.y>=u&&p.y<=f&&vs(i,a,r,c,o,l,p.x,p.y)&&ge(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function kx(s,t,e,n){let i=s.prev,r=s,o=s.next;if(ge(i,r,o)>=0)return!1;let a=i.x,c=r.x,l=o.x,h=i.y,u=r.y,d=o.y,f=a<c?a<l?a:l:c<l?c:l,p=h<u?h<d?h:d:u<d?u:d,_=a>c?a>l?a:l:c>l?c:l,m=h>u?h>d?h:d:u>d?u:d,g=Gl(f,p,t,e,n),M=Gl(_,m,t,e,n),x=s.prevZ,w=s.nextZ;for(;x&&x.z>=g&&w&&w.z<=M;){if(x.x>=f&&x.x<=_&&x.y>=p&&x.y<=m&&x!==i&&x!==o&&vs(a,h,c,u,l,d,x.x,x.y)&&ge(x.prev,x,x.next)>=0||(x=x.prevZ,w.x>=f&&w.x<=_&&w.y>=p&&w.y<=m&&w!==i&&w!==o&&vs(a,h,c,u,l,d,w.x,w.y)&&ge(w.prev,w,w.next)>=0))return!1;w=w.nextZ}for(;x&&x.z>=g;){if(x.x>=f&&x.x<=_&&x.y>=p&&x.y<=m&&x!==i&&x!==o&&vs(a,h,c,u,l,d,x.x,x.y)&&ge(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;w&&w.z<=M;){if(w.x>=f&&w.x<=_&&w.y>=p&&w.y<=m&&w!==i&&w!==o&&vs(a,h,c,u,l,d,w.x,w.y)&&ge(w.prev,w,w.next)>=0)return!1;w=w.nextZ}return!0}function Lx(s,t,e){let n=s;do{let i=n.prev,r=n.next.next;!va(i,r)&&vf(i,n,n.next,r)&&Er(i,r)&&Er(r,i)&&(t.push(i.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),Rr(n),Rr(n.next),n=s=r),n=n.next}while(n!==s);return Wi(n)}function Dx(s,t,e,n,i,r){let o=s;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Wx(o,a)){let c=Mf(o,a);o=Wi(o,o.next),c=Wi(c,c.next),Tr(o,t,e,n,i,r,0),Tr(c,t,e,n,i,r,0);return}a=a.next}o=o.next}while(o!==s)}function Nx(s,t,e,n){let i=[],r,o,a,c,l;for(r=0,o=t.length;r<o;r++)a=t[r]*n,c=r<o-1?t[r+1]*n:s.length,l=xf(s,a,c,n,!1),l===l.next&&(l.steiner=!0),i.push(Gx(l));for(i.sort(Ux),r=0;r<i.length;r++)e=Ox(i[r],e);return e}function Ux(s,t){return s.x-t.x}function Ox(s,t){let e=Fx(s,t);if(!e)return t;let n=Mf(e,s);return Wi(n,n.next),Wi(e,e.next)}function Fx(s,t){let e=t,n=-1/0,i,r=s.x,o=s.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){let d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=r&&d>n&&(n=d,i=e.x<e.next.x?e:e.next,d===r))return i}e=e.next}while(e!==t);if(!i)return null;let a=i,c=i.x,l=i.y,h=1/0,u;e=i;do r>=e.x&&e.x>=c&&r!==e.x&&vs(o<l?r:n,o,c,l,o<l?n:r,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(r-e.x),Er(e,s)&&(u<h||u===h&&(e.x>i.x||e.x===i.x&&Bx(i,e)))&&(i=e,h=u)),e=e.next;while(e!==a);return i}function Bx(s,t){return ge(s.prev,s,t.prev)<0&&ge(t.next,s,s.next)<0}function Hx(s,t,e,n){let i=s;do i.z===0&&(i.z=Gl(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,Vx(i)}function Vx(s){let t,e,n,i,r,o,a,c,l=1;do{for(e=s,s=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<l&&(a++,n=n.nextZ,!!n);t++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||e.z<=n.z)?(i=e,e=e.nextZ,a--):(i=n,n=n.nextZ,c--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;e=n}r.nextZ=null,l*=2}while(o>1);return s}function Gl(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function Gx(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function vs(s,t,e,n,i,r,o,a){return(i-o)*(t-a)>=(s-o)*(r-a)&&(s-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(i-o)*(n-a)}function Wx(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!Xx(s,t)&&(Er(s,t)&&Er(t,s)&&qx(s,t)&&(ge(s.prev,s,t.prev)||ge(s,t.prev,t))||va(s,t)&&ge(s.prev,s,s.next)>0&&ge(t.prev,t,t.next)>0)}function ge(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function va(s,t){return s.x===t.x&&s.y===t.y}function vf(s,t,e,n){let i=To(ge(s,t,e)),r=To(ge(s,t,n)),o=To(ge(e,n,s)),a=To(ge(e,n,t));return!!(i!==r&&o!==a||i===0&&Ao(s,e,t)||r===0&&Ao(s,n,t)||o===0&&Ao(e,s,n)||a===0&&Ao(e,t,n))}function Ao(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function To(s){return s>0?1:s<0?-1:0}function Xx(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&vf(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function Er(s,t){return ge(s.prev,s,s.next)<0?ge(s,t,s.next)>=0&&ge(s,s.prev,t)>=0:ge(s,t,s.prev)<0||ge(s,s.next,t)<0}function qx(s,t){let e=s,n=!1,i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function Mf(s,t){let e=new Wl(s.i,s.x,s.y),n=new Wl(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Od(s,t,e,n){let i=new Wl(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Rr(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Wl(s,t,e){this.i=s,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Kx(s,t,e,n){let i=0;for(let r=t,o=e-n;r<e;r+=n)i+=(s[o]-s[r])*(s[r+1]+s[o+1]),o=r;return i}var mr=class s{static area(t){let e=t.length,n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return s.area(t)<0}static triangulateShape(t,e){let n=[],i=[],r=[];Fd(t),Bd(n,t);let o=t.length;e.forEach(Fd);for(let c=0;c<e.length;c++)i.push(o),o+=e[c].length,Bd(n,e[c]);let a=Px.triangulate(n,i);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}};function Fd(s){let t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function Bd(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}var en=class s extends Vl{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new s(t.radius,t.detail)}};var Jn=class s extends Jt{constructor(t=.5,e=1,n=32,i=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:o},n=Math.max(3,n),i=Math.max(1,i);let a=[],c=[],l=[],h=[],u=t,d=(e-t)/i,f=new b,p=new it;for(let _=0;_<=i;_++){for(let m=0;m<=n;m++){let g=r+m/n*o;f.x=u*Math.cos(g),f.y=u*Math.sin(g),c.push(f.x,f.y,f.z),l.push(0,0,1),p.x=(f.x/e+1)/2,p.y=(f.y/e+1)/2,h.push(p.x,p.y)}u+=d}for(let _=0;_<i;_++){let m=_*(n+1);for(let g=0;g<n;g++){let M=g+m,x=M,w=M+n+1,C=M+n+2,T=M+1;a.push(x,w,T),a.push(w,C,T)}}this.setIndex(a),this.setAttribute("position",new Tt(c,3)),this.setAttribute("normal",new Tt(l,3)),this.setAttribute("uv",new Tt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},oa=class s extends Jt{constructor(t=new Ar([new it(0,.5),new it(-.5,-.5),new it(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],i=[],r=[],o=[],a=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(a,c,h),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new Tt(i,3)),this.setAttribute("normal",new Tt(r,3)),this.setAttribute("uv",new Tt(o,2));function l(h){let u=i.length/3,d=h.extractPoints(e),f=d.shape,p=d.holes;mr.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,g=p.length;m<g;m++){let M=p[m];mr.isClockWise(M)===!0&&(p[m]=M.reverse())}let _=mr.triangulateShape(f,p);for(let m=0,g=p.length;m<g;m++){let M=p[m];f=f.concat(M)}for(let m=0,g=f.length;m<g;m++){let M=f[m];i.push(M.x,M.y,0),r.push(0,0,1),o.push(M.x,M.y)}for(let m=0,g=_.length;m<g;m++){let M=_[m],x=M[0]+u,w=M[1]+u,C=M[2]+u;n.push(x,w,C),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return Yx(e,t)}static fromJSON(t,e){let n=[];for(let i=0,r=t.shapes.length;i<r;i++){let o=e[t.shapes[i]];n.push(o)}return new s(n,t.curveSegments)}};function Yx(s,t){if(t.shapes=[],Array.isArray(s))for(let e=0,n=s.length;e<n;e++){let i=s[e];t.shapes.push(i.uuid)}else t.shapes.push(s.uuid);return t}var Re=class s extends Jt{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let c=Math.min(o+a,Math.PI),l=0,h=[],u=new b,d=new b,f=[],p=[],_=[],m=[];for(let g=0;g<=n;g++){let M=[],x=g/n,w=0;g===0&&o===0?w=.5/e:g===n&&c===Math.PI&&(w=-.5/e);for(let C=0;C<=e;C++){let T=C/e;u.x=-t*Math.cos(i+T*r)*Math.sin(o+x*a),u.y=t*Math.cos(o+x*a),u.z=t*Math.sin(i+T*r)*Math.sin(o+x*a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(T+w,1-x),M.push(l++)}h.push(M)}for(let g=0;g<n;g++)for(let M=0;M<e;M++){let x=h[g][M+1],w=h[g][M],C=h[g+1][M],T=h[g+1][M+1];(g!==0||o>0)&&f.push(x,w,T),(g!==n-1||c<Math.PI)&&f.push(w,C,T)}this.setIndex(f),this.setAttribute("position",new Tt(p,3)),this.setAttribute("normal",new Tt(_,3)),this.setAttribute("uv",new Tt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var aa=class s extends Jt{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);let o=[],a=[],c=[],l=[],h=new b,u=new b,d=new b;for(let f=0;f<=n;f++)for(let p=0;p<=i;p++){let _=p/i*r,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(p/i),l.push(f/n)}for(let f=1;f<=n;f++)for(let p=1;p<=i;p++){let _=(i+1)*f+p-1,m=(i+1)*(f-1)+p-1,g=(i+1)*(f-1)+p,M=(i+1)*f+p;o.push(_,m,M),o.push(m,g,M)}this.setIndex(o),this.setAttribute("position",new Tt(a,3)),this.setAttribute("normal",new Tt(c,3)),this.setAttribute("uv",new Tt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var Os=class extends qe{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new tt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new tt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xh,this.normalScale=new it(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},hn=class extends Os{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new it(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ze(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new tt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new tt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new tt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var pe=class extends qe{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new tt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new tt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xh,this.normalScale=new it(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=ah,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function Oi(s,t,e){return!s||!e&&s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function wf(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function bf(s){function t(i,r){return s[i]-s[r]}let e=s.length,n=new Array(e);for(let i=0;i!==e;++i)n[i]=i;return n.sort(t),n}function Xl(s,t,e){let n=s.length,i=new s.constructor(n);for(let r=0,o=0;o!==n;++r){let a=e[r]*t;for(let c=0;c!==t;++c)i[o++]=s[a+c]}return i}function Sh(s,t,e,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(t.push(r.time),e.push.apply(e,o)),r=s[i++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(t.push(r.time),o.toArray(e,e.length)),r=s[i++];while(r!==void 0);else do o=r[n],o!==void 0&&(t.push(r.time),e.push(o)),r=s[i++];while(r!==void 0)}function Zx(s,t,e,n,i=30){let r=s.clone();r.name=t;let o=[];for(let c=0;c<r.tracks.length;++c){let l=r.tracks[c],h=l.getValueSize(),u=[],d=[];for(let f=0;f<l.times.length;++f){let p=l.times[f]*i;if(!(p<e||p>=n)){u.push(l.times[f]);for(let _=0;_<h;++_)d.push(l.values[f*h+_])}}u.length!==0&&(l.times=Oi(u,l.times.constructor),l.values=Oi(d,l.values.constructor),o.push(l))}r.tracks=o;let a=1/0;for(let c=0;c<r.tracks.length;++c)a>r.tracks[c].times[0]&&(a=r.tracks[c].times[0]);for(let c=0;c<r.tracks.length;++c)r.tracks[c].shift(-1*a);return r.resetDuration(),r}function jx(s,t=0,e=s,n=30){n<=0&&(n=30);let i=e.tracks.length,r=t/n;for(let o=0;o<i;++o){let a=e.tracks[o],c=a.ValueTypeName;if(c==="bool"||c==="string")continue;let l=s.tracks.find(function(g){return g.name===a.name&&g.ValueTypeName===c});if(l===void 0)continue;let h=0,u=a.getValueSize();a.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(h=u/3);let d=0,f=l.getValueSize();l.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(d=f/3);let p=a.times.length-1,_;if(r<=a.times[0]){let g=h,M=u-h;_=a.values.slice(g,M)}else if(r>=a.times[p]){let g=p*u+h,M=g+u-h;_=a.values.slice(g,M)}else{let g=a.createInterpolant(),M=h,x=u-h;g.evaluate(r),_=g.resultBuffer.slice(M,x)}c==="quaternion"&&new Ot().fromArray(_).normalize().conjugate().toArray(_);let m=l.times.length;for(let g=0;g<m;++g){let M=g*f+d;if(c==="quaternion")Ot.multiplyQuaternionsFlat(l.values,M,_,0,l.values,M);else{let x=f-d*2;for(let w=0;w<x;++w)l.values[M+w]-=_[w]}}}return s.blendMode=rf,s}var Sf={convertArray:Oi,isTypedArray:wf,getKeyframeOrder:bf,sortedArray:Xl,flattenJSON:Sh,subclip:Zx,makeClipAdditive:jx},vi=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],r=e[n-1];t:{e:{let o;n:{i:if(!(t<i)){for(let a=n+2;;){if(i===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=e[++n],t<i)break e}o=e.length;break n}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(i=r,r=e[--n-1],t>=r)break e}o=n,n=0;break n}break t}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(i=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i;for(let o=0;o!==i;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},ql=class extends vi{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:_s,endingEnd:_s}}intervalChanged_(t,e,n){let i=this.parameterPositions,r=t-2,o=t+1,a=i[r],c=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case ys:r=t,a=2*e-n;break;case Lo:r=i.length-2,a=e+i[r]-i[r+1];break;default:r=t,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case ys:o=t,c=2*n-e;break;case Lo:o=1,c=n+i[1]-i[0];break;default:o=t-1,c=e}let l=(n-e)*.5,h=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-e)/(i-e),_=p*p,m=_*p,g=-d*m+2*d*_-d*p,M=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*p+1,x=(-1-f)*m+(1.5+f)*_+.5*p,w=f*m-f*_;for(let C=0;C!==a;++C)r[C]=g*o[h+C]+M*o[l+C]+x*o[c+C]+w*o[u+C];return r}},ca=class extends vi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=(n-e)/(i-e),u=1-h;for(let d=0;d!==a;++d)r[d]=o[l+d]*u+o[c+d]*h;return r}},Kl=class extends vi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},vn=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Oi(e,this.TimeBufferType),this.values=Oi(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Oi(t.times,Array),values:Oi(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Kl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new ca(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new ql(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case zs:e=this.InterpolantFactoryMethodDiscrete;break;case Ps:e=this.InterpolantFactoryMethodLinear;break;case Qa:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return zs;case this.InterpolantFactoryMethodLinear:return Ps;case this.InterpolantFactoryMethodSmooth:return Qa}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t}return this}trim(t,e){let n=this.times,i=n.length,r=0,o=i-1;for(;r!==i&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(i!==void 0&&wf(i))for(let a=0,c=i.length;a!==c;++a){let l=i[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Qa,r=t.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=t[a],h=t[a+1];if(l!==h&&(a!==1||l!==t[0]))if(i)c=!0;else{let u=a*n,d=u-n,f=u+n;for(let p=0;p!==n;++p){let _=e[u+p];if(_!==e[d+p]||_!==e[f+p]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)e[d+f]=e[u+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,i}};vn.prototype.TimeBufferType=Float32Array;vn.prototype.ValueBufferType=Float32Array;vn.prototype.DefaultInterpolation=Ps;var Mi=class extends vn{constructor(t,e,n){super(t,e,n)}};Mi.prototype.ValueTypeName="bool";Mi.prototype.ValueBufferType=Array;Mi.prototype.DefaultInterpolation=zs;Mi.prototype.InterpolantFactoryMethodLinear=void 0;Mi.prototype.InterpolantFactoryMethodSmooth=void 0;var la=class extends vn{};la.prototype.ValueTypeName="color";var Qn=class extends vn{};Qn.prototype.ValueTypeName="number";var Yl=class extends vi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-e)/(i-e),l=t*a;for(let h=l+a;l!==h;l+=4)Ot.slerpFlat(r,0,o,l-a,o,l,c);return r}},ti=class extends vn{InterpolantFactoryMethodLinear(t){return new Yl(this.times,this.values,this.getValueSize(),t)}};ti.prototype.ValueTypeName="quaternion";ti.prototype.InterpolantFactoryMethodSmooth=void 0;var wi=class extends vn{constructor(t,e,n){super(t,e,n)}};wi.prototype.ValueTypeName="string";wi.prototype.ValueBufferType=Array;wi.prototype.DefaultInterpolation=zs;wi.prototype.InterpolantFactoryMethodLinear=void 0;wi.prototype.InterpolantFactoryMethodSmooth=void 0;var ei=class extends vn{};ei.prototype.ValueTypeName="vector";var Fs=class{constructor(t="",e=-1,n=[],i=yh){this.name=t,this.tracks=n,this.duration=e,this.blendMode=i,this.uuid=_n(),this.duration<0&&this.resetDuration()}static parse(t){let e=[],n=t.tracks,i=1/(t.fps||1);for(let o=0,a=n.length;o!==a;++o)e.push(Jx(n[o]).scale(i));let r=new this(t.name,t.duration,e,t.blendMode);return r.uuid=t.uuid,r}static toJSON(t){let e=[],n=t.tracks,i={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode};for(let r=0,o=n.length;r!==o;++r)e.push(vn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(t,e,n,i){let r=e.length,o=[];for(let a=0;a<r;a++){let c=[],l=[];c.push((a+r-1)%r,a,(a+1)%r),l.push(0,1,0);let h=bf(c);c=Xl(c,1,h),l=Xl(l,1,h),!i&&c[0]===0&&(c.push(r),l.push(l[0])),o.push(new Qn(".morphTargetInfluences["+e[a].name+"]",c,l).scale(1/n))}return new this(t,-1,o)}static findByName(t,e){let n=t;if(!Array.isArray(t)){let i=t;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===e)return n[i];return null}static CreateClipsFromMorphTargetSequences(t,e,n){let i={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,c=t.length;a<c;a++){let l=t[a],h=l.name.match(r);if(h&&h.length>1){let u=h[1],d=i[u];d||(i[u]=d=[]),d.push(l)}}let o=[];for(let a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],e,n));return o}static parseAnimation(t,e){if(!t)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let n=function(u,d,f,p,_){if(f.length!==0){let m=[],g=[];Sh(f,m,g,p),m.length!==0&&_.push(new u(d,m,g))}},i=[],r=t.name||"default",o=t.fps||30,a=t.blendMode,c=t.length||-1,l=t.hierarchy||[];for(let u=0;u<l.length;u++){let d=l[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){let f={},p;for(p=0;p<d.length;p++)if(d[p].morphTargets)for(let _=0;_<d[p].morphTargets.length;_++)f[d[p].morphTargets[_]]=-1;for(let _ in f){let m=[],g=[];for(let M=0;M!==d[p].morphTargets.length;++M){let x=d[p];m.push(x.time),g.push(x.morphTarget===_?1:0)}i.push(new Qn(".morphTargetInfluence["+_+"]",m,g))}c=f.length*o}else{let f=".bones["+e[u].name+"]";n(ei,f+".position",d,"pos",i),n(ti,f+".quaternion",d,"rot",i),n(ei,f+".scale",d,"scl",i)}}return i.length===0?null:new this(r,c,i,a)}resetDuration(){let t=this.tracks,e=0;for(let n=0,i=t.length;n!==i;++n){let r=this.tracks[n];e=Math.max(e,r.times[r.times.length-1])}return this.duration=e,this}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this}clone(){let t=[];for(let e=0;e<this.tracks.length;e++)t.push(this.tracks[e].clone());return new this.constructor(this.name,this.duration,t,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}};function $x(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Qn;case"vector":case"vector2":case"vector3":case"vector4":return ei;case"color":return la;case"quaternion":return ti;case"bool":case"boolean":return Mi;case"string":return wi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function Jx(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let t=$x(s.type);if(s.times===void 0){let e=[],n=[];Sh(s.keys,e,n,"value"),s.times=e,s.values=n}return t.parse!==void 0?t.parse(s):new t(s.name,s.times,s.values,s.interpolation)}var mi={enabled:!1,files:{},add:function(s,t){this.enabled!==!1&&(this.files[s]=t)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}},Zl=class{constructor(t,e,n){let i=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){let f=l[u],p=l[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null}}},Qx=new Zl,ni=class{constructor(t){this.manager=t!==void 0?t:Qx,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};ni.DEFAULT_MATERIAL_NAME="__DEFAULT";var Wn={},jl=class extends Error{constructor(t,e){super(t),this.response=e}},Cr=class extends ni{constructor(t){super(t)}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=mi.get(t);if(r!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0),r;if(Wn[t]!==void 0){Wn[t].push({onLoad:e,onProgress:n,onError:i});return}Wn[t]=[],Wn[t].push({onLoad:e,onProgress:n,onError:i});let o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let h=Wn[t],u=l.body.getReader(),d=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=d?parseInt(d):0,p=f!==0,_=0,m=new ReadableStream({start(g){M();function M(){u.read().then(({done:x,value:w})=>{if(x)g.close();else{_+=w.byteLength;let C=new ProgressEvent("progress",{lengthComputable:p,loaded:_,total:f});for(let T=0,E=h.length;T<E;T++){let z=h[T];z.onProgress&&z.onProgress(C)}g.enqueue(w),M()}},x=>{g.error(x)})}}});return new Response(m)}else throw new jl(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a===void 0)return l.text();{let u=/charset="?([^;"\s]*)"?/i.exec(a),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return l.arrayBuffer().then(p=>f.decode(p))}}}).then(l=>{mi.add(t,l);let h=Wn[t];delete Wn[t];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onLoad&&f.onLoad(l)}}).catch(l=>{let h=Wn[t];if(h===void 0)throw this.manager.itemError(t),l;delete Wn[t];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onError&&f.onError(l)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}};var $l=class extends ni{constructor(t){super(t)}load(t,e,n,i){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=mi.get(t);if(o!==void 0)return r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0),o;let a=xr("img");function c(){h(),mi.add(t,this),e&&e(this),r.manager.itemEnd(t)}function l(u){h(),i&&i(u),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(t),a.src=t,a}};var ha=class extends ni{constructor(t){super(t)}load(t,e,n,i){let r=new Pe,o=new $l(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,i),r}},Xi=class extends fe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new tt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},ua=class extends Xi{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(fe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new tt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},Lc=new At,Hd=new b,Vd=new b,zr=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new it(512,512),this.map=null,this.mapPass=null,this.matrix=new At,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Mr,this._frameExtents=new it(1,1),this._viewportCount=1,this._viewports=[new Kt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Hd.setFromMatrixPosition(t.matrixWorld),e.position.copy(Hd),Vd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Vd),e.updateMatrixWorld(),Lc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Lc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Lc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Jl=class extends zr{constructor(){super(new De(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){let e=this.camera,n=Is*2*t.angle*this.focus,i=this.mapSize.width/this.mapSize.height,r=t.distance||e.far;(n!==e.fov||i!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=i,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}},da=class extends Xi{constructor(t,e,n=0,i=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(fe.DEFAULT_UP),this.updateMatrix(),this.target=new fe,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Jl}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},Gd=new At,ar=new b,Dc=new b,Ql=class extends zr{constructor(){super(new De(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new it(4,2),this._viewportCount=6,this._viewports=[new Kt(2,1,1,1),new Kt(0,1,1,1),new Kt(3,1,1,1),new Kt(1,1,1,1),new Kt(3,0,1,1),new Kt(1,0,1,1)],this._cubeDirections=[new b(1,0,0),new b(-1,0,0),new b(0,0,1),new b(0,0,-1),new b(0,1,0),new b(0,-1,0)],this._cubeUps=[new b(0,1,0),new b(0,1,0),new b(0,1,0),new b(0,1,0),new b(0,0,1),new b(0,0,-1)]}updateMatrices(t,e=0){let n=this.camera,i=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),ar.setFromMatrixPosition(t.matrixWorld),n.position.copy(ar),Dc.copy(n.position),Dc.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Dc),n.updateMatrixWorld(),i.makeTranslation(-ar.x,-ar.y,-ar.z),Gd.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Gd)}},un=class extends Xi{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Ql}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},th=class extends zr{constructor(){super(new yi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},qi=class extends Xi{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(fe.DEFAULT_UP),this.updateMatrix(),this.target=new fe,this.shadow=new th}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},fa=class extends Xi{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}};var bi=class{static decodeText(t){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(t);let e="";for(let n=0,i=t.length;n<i;n++)e+=String.fromCharCode(t[n]);try{return decodeURIComponent(escape(e))}catch{return e}}static extractUrlBase(t){let e=t.lastIndexOf("/");return e===-1?"./":t.slice(0,e+1)}static resolveURL(t,e){return typeof t!="string"||t===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(t)&&(e=e.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(t)||/^data:.*,.*$/i.test(t)||/^blob:.*$/i.test(t)?t:e+t)}};var pa=class extends ni{constructor(t){super(t),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(t){return this.options=t,this}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=mi.get(t);if(o!==void 0){if(r.manager.itemStart(t),o.then){o.then(l=>{e&&e(l),r.manager.itemEnd(t)}).catch(l=>{i&&i(l)});return}return setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0),o}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader;let c=fetch(t,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(l){return mi.add(t,l),e&&e(l),r.manager.itemEnd(t),l}).catch(function(l){i&&i(l),mi.remove(t),r.manager.itemError(t),r.manager.itemEnd(t)});mi.add(t,c),r.manager.itemStart(t)}};var ma=class{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Wd(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let e=Wd();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}};function Wd(){return performance.now()}var eh=class{constructor(t,e,n){this.binding=t,this.valueSize=n;let i,r,o;switch(e){case"quaternion":i=this._slerp,r=this._slerpAdditive,o=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,r=this._select,o=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,r=this._lerpAdditive,o=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=r,this._setIdentity=o,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(t,e){let n=this.buffer,i=this.valueSize,r=t*i+i,o=this.cumulativeWeight;if(o===0){for(let a=0;a!==i;++a)n[r+a]=n[a];o=e}else{o+=e;let a=e/o;this._mixBufferRegion(n,r,0,a,i)}this.cumulativeWeight=o}accumulateAdditive(t){let e=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(e,i,0,t,n),this.cumulativeWeightAdditive+=t}apply(t){let e=this.valueSize,n=this.buffer,i=t*e+e,r=this.cumulativeWeight,o=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){let c=e*this._origIndex;this._mixBufferRegion(n,i,c,1-r,e)}o>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*e,1,e);for(let c=e,l=e+e;c!==l;++c)if(n[c]!==n[c+e]){a.setValue(n,i);break}}saveOriginalState(){let t=this.binding,e=this.buffer,n=this.valueSize,i=n*this._origIndex;t.getValue(e,i);for(let r=n,o=i;r!==o;++r)e[r]=e[i+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let t=this.valueSize*3;this.binding.setValue(this.buffer,t)}_setAdditiveIdentityNumeric(){let t=this._addIndex*this.valueSize,e=t+this.valueSize;for(let n=t;n<e;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let t=this._origIndex*this.valueSize,e=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[e+n]=this.buffer[t+n]}_select(t,e,n,i,r){if(i>=.5)for(let o=0;o!==r;++o)t[e+o]=t[n+o]}_slerp(t,e,n,i){Ot.slerpFlat(t,e,t,e,t,n,i)}_slerpAdditive(t,e,n,i,r){let o=this._workIndex*r;Ot.multiplyQuaternionsFlat(t,o,t,e,t,n),Ot.slerpFlat(t,e,t,e,t,o,i)}_lerp(t,e,n,i,r){let o=1-i;for(let a=0;a!==r;++a){let c=e+a;t[c]=t[c]*o+t[n+a]*i}}_lerpAdditive(t,e,n,i,r){for(let o=0;o!==r;++o){let a=e+o;t[a]=t[a]+t[n+o]*i}}},Ah="\\[\\]\\.:\\/",tv=new RegExp("["+Ah+"]","g"),Th="[^"+Ah+"]",ev="[^"+Ah.replace("\\.","")+"]",nv=/((?:WC+[\/:])*)/.source.replace("WC",Th),iv=/(WCOD+)?/.source.replace("WCOD",ev),sv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Th),rv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Th),ov=new RegExp("^"+nv+iv+sv+rv+"$"),av=["material","materials","bones","map"],nh=class{constructor(t,e,n){let i=n||ce.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},ce=class s{constructor(t,e,n){this.path=e,this.parsedPath=n||s.parseTrackName(e),this.node=s.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new s.Composite(t,e,n):new s(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(tv,"")}static parseTrackName(t){let e=ov.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);av.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let c=n(a.children);if(c)return c}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,r=e.propertyIndex;if(t||(t=s.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let o=t[i];if(o===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ce.Composite=nh;ce.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ce.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ce.prototype.GetterByBindingType=[ce.prototype._getValue_direct,ce.prototype._getValue_array,ce.prototype._getValue_arrayElement,ce.prototype._getValue_toArray];ce.prototype.SetterByBindingTypeAndVersioning=[[ce.prototype._setValue_direct,ce.prototype._setValue_direct_setNeedsUpdate,ce.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ce.prototype._setValue_array,ce.prototype._setValue_array_setNeedsUpdate,ce.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ce.prototype._setValue_arrayElement,ce.prototype._setValue_arrayElement_setNeedsUpdate,ce.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ce.prototype._setValue_fromArray,ce.prototype._setValue_fromArray_setNeedsUpdate,ce.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var ih=class{constructor(t,e,n=null,i=e.blendMode){this._mixer=t,this._clip=e,this._localRoot=n,this.blendMode=i;let r=e.tracks,o=r.length,a=new Array(o),c={endingStart:_s,endingEnd:_s};for(let l=0;l!==o;++l){let h=r[l].createInterpolant(null);a[l]=h,h.settings=c}this._interpolantSettings=c,this._interpolants=a,this._propertyBindings=new Array(o),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=Zp,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(t){return this._startTime=t,this}setLoop(t,e){return this.loop=t,this.repetitions=e,this}setEffectiveWeight(t){return this.weight=t,this._effectiveWeight=this.enabled?t:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(t){return this._scheduleFading(t,0,1)}fadeOut(t){return this._scheduleFading(t,1,0)}crossFadeFrom(t,e,n){if(t.fadeOut(e),this.fadeIn(e),n){let i=this._clip.duration,r=t._clip.duration,o=r/i,a=i/r;t.warp(1,o,e),this.warp(a,1,e)}return this}crossFadeTo(t,e,n){return t.crossFadeFrom(this,e,n)}stopFading(){let t=this._weightInterpolant;return t!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}setEffectiveTimeScale(t){return this.timeScale=t,this._effectiveTimeScale=this.paused?0:t,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(t){return this.timeScale=this._clip.duration/t,this.stopWarping()}syncWith(t){return this.time=t.time,this.timeScale=t.timeScale,this.stopWarping()}halt(t){return this.warp(this._effectiveTimeScale,0,t)}warp(t,e,n){let i=this._mixer,r=i.time,o=this.timeScale,a=this._timeScaleInterpolant;a===null&&(a=i._lendControlInterpolant(),this._timeScaleInterpolant=a);let c=a.parameterPositions,l=a.sampleValues;return c[0]=r,c[1]=r+n,l[0]=t/o,l[1]=e/o,this}stopWarping(){let t=this._timeScaleInterpolant;return t!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(t,e,n,i){if(!this.enabled){this._updateWeight(t);return}let r=this._startTime;if(r!==null){let c=(t-r)*n;c<0||n===0?e=0:(this._startTime=null,e=n*c)}e*=this._updateTimeScale(t);let o=this._updateTime(e),a=this._updateWeight(t);if(a>0){let c=this._interpolants,l=this._propertyBindings;switch(this.blendMode){case rf:for(let h=0,u=c.length;h!==u;++h)c[h].evaluate(o),l[h].accumulateAdditive(a);break;case yh:default:for(let h=0,u=c.length;h!==u;++h)c[h].evaluate(o),l[h].accumulate(i,a)}}}_updateWeight(t){let e=0;if(this.enabled){e=this.weight;let n=this._weightInterpolant;if(n!==null){let i=n.evaluate(t)[0];e*=i,t>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=e,e}_updateTimeScale(t){let e=0;if(!this.paused){e=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let i=n.evaluate(t)[0];e*=i,t>n.parameterPositions[1]&&(this.stopWarping(),e===0?this.paused=!0:this.timeScale=e)}}return this._effectiveTimeScale=e,e}_updateTime(t){let e=this._clip.duration,n=this.loop,i=this.time+t,r=this._loopCount,o=n===jp;if(t===0)return r===-1?i:o&&(r&1)===1?e-i:i;if(n===_h){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));t:{if(i>=e)i=e;else if(i<0)i=0;else{this.time=i;break t}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:t<0?-1:1})}}else{if(r===-1&&(t>=0?(r=0,this._setEndings(!0,this.repetitions===0,o)):this._setEndings(this.repetitions===0,!0,o)),i>=e||i<0){let a=Math.floor(i/e);i-=e*a,r+=Math.abs(a);let c=this.repetitions-r;if(c<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=t>0?e:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:t>0?1:-1});else{if(c===1){let l=t<0;this._setEndings(l,!l,o)}else this._setEndings(!1,!1,o);this._loopCount=r,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this.time=i;if(o&&(r&1)===1)return e-i}return i}_setEndings(t,e,n){let i=this._interpolantSettings;n?(i.endingStart=ys,i.endingEnd=ys):(t?i.endingStart=this.zeroSlopeAtStart?ys:_s:i.endingStart=Lo,e?i.endingEnd=this.zeroSlopeAtEnd?ys:_s:i.endingEnd=Lo)}_scheduleFading(t,e,n){let i=this._mixer,r=i.time,o=this._weightInterpolant;o===null&&(o=i._lendControlInterpolant(),this._weightInterpolant=o);let a=o.parameterPositions,c=o.sampleValues;return a[0]=r,c[0]=e,a[1]=r+t,c[1]=n,this}},cv=new Float32Array(1),Pr=class extends jn{constructor(t){super(),this._root=t,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(t,e){let n=t._localRoot||this._root,i=t._clip.tracks,r=i.length,o=t._propertyBindings,a=t._interpolants,c=n.uuid,l=this._bindingsByRootAndName,h=l[c];h===void 0&&(h={},l[c]=h);for(let u=0;u!==r;++u){let d=i[u],f=d.name,p=h[f];if(p!==void 0)++p.referenceCount,o[u]=p;else{if(p=o[u],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,c,f));continue}let _=e&&e._propertyBindings[u].binding.parsedPath;p=new eh(ce.create(n,f,_),d.ValueTypeName,d.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,c,f),o[u]=p}a[u].resultBuffer=p.buffer}}_activateAction(t){if(!this._isActiveAction(t)){if(t._cacheIndex===null){let n=(t._localRoot||this._root).uuid,i=t._clip.uuid,r=this._actionsByClip[i];this._bindAction(t,r&&r.knownActions[0]),this._addInactiveAction(t,i,n)}let e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){let r=e[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(t)}}_deactivateAction(t){if(this._isActiveAction(t)){let e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){let r=e[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(t)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let t=this;this.stats={actions:{get total(){return t._actions.length},get inUse(){return t._nActiveActions}},bindings:{get total(){return t._bindings.length},get inUse(){return t._nActiveBindings}},controlInterpolants:{get total(){return t._controlInterpolants.length},get inUse(){return t._nActiveControlInterpolants}}}}_isActiveAction(t){let e=t._cacheIndex;return e!==null&&e<this._nActiveActions}_addInactiveAction(t,e,n){let i=this._actions,r=this._actionsByClip,o=r[e];if(o===void 0)o={knownActions:[t],actionByRoot:{}},t._byClipCacheIndex=0,r[e]=o;else{let a=o.knownActions;t._byClipCacheIndex=a.length,a.push(t)}t._cacheIndex=i.length,i.push(t),o.actionByRoot[n]=t}_removeInactiveAction(t){let e=this._actions,n=e[e.length-1],i=t._cacheIndex;n._cacheIndex=i,e[i]=n,e.pop(),t._cacheIndex=null;let r=t._clip.uuid,o=this._actionsByClip,a=o[r],c=a.knownActions,l=c[c.length-1],h=t._byClipCacheIndex;l._byClipCacheIndex=h,c[h]=l,c.pop(),t._byClipCacheIndex=null;let u=a.actionByRoot,d=(t._localRoot||this._root).uuid;delete u[d],c.length===0&&delete o[r],this._removeInactiveBindingsForAction(t)}_removeInactiveBindingsForAction(t){let e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){let r=e[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(t){let e=this._actions,n=t._cacheIndex,i=this._nActiveActions++,r=e[i];t._cacheIndex=i,e[i]=t,r._cacheIndex=n,e[n]=r}_takeBackAction(t){let e=this._actions,n=t._cacheIndex,i=--this._nActiveActions,r=e[i];t._cacheIndex=i,e[i]=t,r._cacheIndex=n,e[n]=r}_addInactiveBinding(t,e,n){let i=this._bindingsByRootAndName,r=this._bindings,o=i[e];o===void 0&&(o={},i[e]=o),o[n]=t,t._cacheIndex=r.length,r.push(t)}_removeInactiveBinding(t){let e=this._bindings,n=t.binding,i=n.rootNode.uuid,r=n.path,o=this._bindingsByRootAndName,a=o[i],c=e[e.length-1],l=t._cacheIndex;c._cacheIndex=l,e[l]=c,e.pop(),delete a[r],Object.keys(a).length===0&&delete o[i]}_lendBinding(t){let e=this._bindings,n=t._cacheIndex,i=this._nActiveBindings++,r=e[i];t._cacheIndex=i,e[i]=t,r._cacheIndex=n,e[n]=r}_takeBackBinding(t){let e=this._bindings,n=t._cacheIndex,i=--this._nActiveBindings,r=e[i];t._cacheIndex=i,e[i]=t,r._cacheIndex=n,e[n]=r}_lendControlInterpolant(){let t=this._controlInterpolants,e=this._nActiveControlInterpolants++,n=t[e];return n===void 0&&(n=new ca(new Float32Array(2),new Float32Array(2),1,cv),n.__cacheIndex=e,t[e]=n),n}_takeBackControlInterpolant(t){let e=this._controlInterpolants,n=t.__cacheIndex,i=--this._nActiveControlInterpolants,r=e[i];t.__cacheIndex=i,e[i]=t,r.__cacheIndex=n,e[n]=r}clipAction(t,e,n){let i=e||this._root,r=i.uuid,o=typeof t=="string"?Fs.findByName(i,t):t,a=o!==null?o.uuid:t,c=this._actionsByClip[a],l=null;if(n===void 0&&(o!==null?n=o.blendMode:n=yh),c!==void 0){let u=c.actionByRoot[r];if(u!==void 0&&u.blendMode===n)return u;l=c.knownActions[0],o===null&&(o=l._clip)}if(o===null)return null;let h=new ih(this,o,e,n);return this._bindAction(h,l),this._addInactiveAction(h,a,r),h}existingAction(t,e){let n=e||this._root,i=n.uuid,r=typeof t=="string"?Fs.findByName(n,t):t,o=r?r.uuid:t,a=this._actionsByClip[o];return a!==void 0&&a.actionByRoot[i]||null}stopAllAction(){let t=this._actions,e=this._nActiveActions;for(let n=e-1;n>=0;--n)t[n].stop();return this}update(t){t*=this.timeScale;let e=this._actions,n=this._nActiveActions,i=this.time+=t,r=Math.sign(t),o=this._accuIndex^=1;for(let l=0;l!==n;++l)e[l]._update(i,t,r,o);let a=this._bindings,c=this._nActiveBindings;for(let l=0;l!==c;++l)a[l].apply(o);return this}setTime(t){this.time=0;for(let e=0;e<this._actions.length;e++)this._actions[e].time=0;return this.update(t)}getRoot(){return this._root}uncacheClip(t){let e=this._actions,n=t.uuid,i=this._actionsByClip,r=i[n];if(r!==void 0){let o=r.knownActions;for(let a=0,c=o.length;a!==c;++a){let l=o[a];this._deactivateAction(l);let h=l._cacheIndex,u=e[e.length-1];l._cacheIndex=null,l._byClipCacheIndex=null,u._cacheIndex=h,e[h]=u,e.pop(),this._removeInactiveBindingsForAction(l)}delete i[n]}}uncacheRoot(t){let e=t.uuid,n=this._actionsByClip;for(let o in n){let a=n[o].actionByRoot,c=a[e];c!==void 0&&(this._deactivateAction(c),this._removeInactiveAction(c))}let i=this._bindingsByRootAndName,r=i[e];if(r!==void 0)for(let o in r){let a=r[o];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(t,e){let n=this.existingAction(t,e);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};var Xd=new At,Bs=class{constructor(t,e,n=0,i=1/0){this.ray=new Bi(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new vr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Xd.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Xd),this}intersectObject(t,e=!0,n=[]){return sh(t,this,n,e),n.sort(qd),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)sh(t[i],this,n,e);return n.sort(qd),n}};function qd(s,t){return s.distance-t.distance}function sh(s,t,e,n){let i=!0;if(s.layers.test(t.layers)&&s.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){let r=s.children;for(let o=0,a=r.length;o<a;o++)sh(r[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:rh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=rh);function Eh(s,t){if(t===of)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(t===kr||t===_a){let e=s.getIndex();if(e===null){let o=[],a=s.getAttribute("position");if(a!==void 0){for(let c=0;c<a.count;c++)o.push(c);s.setIndex(o),e=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}let n=e.count-2,i=[];if(t===kr)for(let o=1;o<=n;o++)i.push(e.getX(0)),i.push(e.getX(o)),i.push(e.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(i.push(e.getX(o)),i.push(e.getX(o+1)),i.push(e.getX(o+2))):(i.push(e.getX(o+2)),i.push(e.getX(o+1)),i.push(e.getX(o)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let r=s.clone();return r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",t),s}var Ma=class extends ni{constructor(t){super(t),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(e){return new Lh(e)}),this.register(function(e){return new Dh(e)}),this.register(function(e){return new Wh(e)}),this.register(function(e){return new Xh(e)}),this.register(function(e){return new qh(e)}),this.register(function(e){return new Uh(e)}),this.register(function(e){return new Oh(e)}),this.register(function(e){return new Fh(e)}),this.register(function(e){return new Bh(e)}),this.register(function(e){return new kh(e)}),this.register(function(e){return new Hh(e)}),this.register(function(e){return new Nh(e)}),this.register(function(e){return new Gh(e)}),this.register(function(e){return new Vh(e)}),this.register(function(e){return new Ph(e)}),this.register(function(e){return new Kh(e)}),this.register(function(e){return new Yh(e)})}load(t,e,n,i){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let l=bi.extractUrlBase(t);o=bi.resolveURL(l,this.path)}else o=bi.extractUrlBase(t);this.manager.itemStart(t);let a=function(l){i?i(l):console.error(l),r.manager.itemError(t),r.manager.itemEnd(t)},c=new Cr(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(t,function(l){try{r.parse(l,o,function(h){e(h),r.manager.itemEnd(t)},a)}catch(h){a(h)}},n,a)}setDRACOLoader(t){return this.dracoLoader=t,this}setKTX2Loader(t){return this.ktx2Loader=t,this}setMeshoptDecoder(t){return this.meshoptDecoder=t,this}register(t){return this.pluginCallbacks.indexOf(t)===-1&&this.pluginCallbacks.push(t),this}unregister(t){return this.pluginCallbacks.indexOf(t)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(t),1),this}parse(t,e,n,i){let r,o={},a={},c=new TextDecoder;if(typeof t=="string")r=JSON.parse(t);else if(t instanceof ArrayBuffer)if(c.decode(new Uint8Array(t,0,4))===Cf){try{o[Vt.KHR_BINARY_GLTF]=new Zh(t)}catch(u){i&&i(u);return}r=JSON.parse(o[Vt.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(t));else r=t;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let l=new nu(r,{path:e||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let u=this.pluginCallbacks[h](l);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[u.name]=u,o[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){let u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case Vt.KHR_MATERIALS_UNLIT:o[u]=new Ih;break;case Vt.KHR_DRACO_MESH_COMPRESSION:o[u]=new jh(r,this.dracoLoader);break;case Vt.KHR_TEXTURE_TRANSFORM:o[u]=new $h;break;case Vt.KHR_MESH_QUANTIZATION:o[u]=new Jh;break;default:d.indexOf(u)>=0&&a[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}l.setExtensions(o),l.setPlugins(a),l.parse(n,i)}parseAsync(t,e){let n=this;return new Promise(function(i,r){n.parse(t,e,i,r)})}};function lv(){let s={};return{get:function(t){return s[t]},add:function(t,e){s[t]=e},remove:function(t){delete s[t]},removeAll:function(){s={}}}}var Vt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Ph=class{constructor(t){this.parser=t,this.name=Vt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let t=this.parser,e=this.parser.json.nodes||[];for(let n=0,i=e.length;n<i;n++){let r=e[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&t._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(t){let e=this.parser,n="light:"+t,i=e.cache.get(n);if(i)return i;let r=e.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[t],l,h=new tt(16777215);c.color!==void 0&&h.setRGB(c.color[0],c.color[1],c.color[2],Ie);let u=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new qi(h),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new un(h),l.distance=u;break;case"spot":l=new da(h),l.distance=u,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),l.decay=2,ii(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=e.createUniqueName(c.name||"light_"+t),i=Promise.resolve(l),e.cache.add(n,i),i}getDependency(t,e){if(t==="light")return this._loadLight(e)}createNodeAttachment(t){let e=this,n=this.parser,r=n.json.nodes[t],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(c){return n._getNodeRef(e.cache,a,c)})}},Ih=class{constructor(){this.name=Vt.KHR_MATERIALS_UNLIT}getMaterialType(){return le}extendParams(t,e,n){let i=[];t.color=new tt(1,1,1),t.opacity=1;let r=e.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;t.color.setRGB(o[0],o[1],o[2],Ie),t.opacity=o[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(t,"map",r.baseColorTexture,qt))}return Promise.all(i)}},kh=class{constructor(t){this.parser=t,this.name=Vt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(t,e){let i=this.parser.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name].emissiveStrength;return r!==void 0&&(e.emissiveIntensity=r),Promise.resolve()}},Lh=class{constructor(t){this.parser=t,this.name=Vt.KHR_MATERIALS_CLEARCOAT}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];if(o.clearcoatFactor!==void 0&&(e.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&r.push(n.assignTexture(e,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(e.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&r.push(n.assignTexture(e,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(r.push(n.assignTexture(e,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){let a=o.clearcoatNormalTexture.scale;e.clearcoatNormalScale=new it(a,a)}return Promise.all(r)}},Dh=class{constructor(t){this.parser=t,this.name=Vt.KHR_MATERIALS_DISPERSION}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let i=this.parser.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name];return e.dispersion=r.dispersion!==void 0?r.dispersion:0,Promise.resolve()}},Nh=class{constructor(t){this.parser=t,this.name=Vt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.iridescenceFactor!==void 0&&(e.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&r.push(n.assignTexture(e,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(e.iridescenceIOR=o.iridescenceIor),e.iridescenceThicknessRange===void 0&&(e.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(e.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(e.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&r.push(n.assignTexture(e,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(r)}},Uh=class{constructor(t){this.parser=t,this.name=Vt.KHR_MATERIALS_SHEEN}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[];e.sheenColor=new tt(0,0,0),e.sheenRoughness=0,e.sheen=1;let o=i.extensions[this.name];if(o.sheenColorFactor!==void 0){let a=o.sheenColorFactor;e.sheenColor.setRGB(a[0],a[1],a[2],Ie)}return o.sheenRoughnessFactor!==void 0&&(e.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&r.push(n.assignTexture(e,"sheenColorMap",o.sheenColorTexture,qt)),o.sheenRoughnessTexture!==void 0&&r.push(n.assignTexture(e,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(r)}},Oh=class{constructor(t){this.parser=t,this.name=Vt.KHR_MATERIALS_TRANSMISSION}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.transmissionFactor!==void 0&&(e.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&r.push(n.assignTexture(e,"transmissionMap",o.transmissionTexture)),Promise.all(r)}},Fh=class{constructor(t){this.parser=t,this.name=Vt.KHR_MATERIALS_VOLUME}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];e.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&r.push(n.assignTexture(e,"thicknessMap",o.thicknessTexture)),e.attenuationDistance=o.attenuationDistance||1/0;let a=o.attenuationColor||[1,1,1];return e.attenuationColor=new tt().setRGB(a[0],a[1],a[2],Ie),Promise.all(r)}},Bh=class{constructor(t){this.parser=t,this.name=Vt.KHR_MATERIALS_IOR}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let i=this.parser.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name];return e.ior=r.ior!==void 0?r.ior:1.5,Promise.resolve()}},Hh=class{constructor(t){this.parser=t,this.name=Vt.KHR_MATERIALS_SPECULAR}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];e.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&r.push(n.assignTexture(e,"specularIntensityMap",o.specularTexture));let a=o.specularColorFactor||[1,1,1];return e.specularColor=new tt().setRGB(a[0],a[1],a[2],Ie),o.specularColorTexture!==void 0&&r.push(n.assignTexture(e,"specularColorMap",o.specularColorTexture,qt)),Promise.all(r)}},Vh=class{constructor(t){this.parser=t,this.name=Vt.EXT_MATERIALS_BUMP}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return e.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&r.push(n.assignTexture(e,"bumpMap",o.bumpTexture)),Promise.all(r)}},Gh=class{constructor(t){this.parser=t,this.name=Vt.KHR_MATERIALS_ANISOTROPY}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.anisotropyStrength!==void 0&&(e.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(e.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&r.push(n.assignTexture(e,"anisotropyMap",o.anisotropyTexture)),Promise.all(r)}},Wh=class{constructor(t){this.parser=t,this.name=Vt.KHR_TEXTURE_BASISU}loadTexture(t){let e=this.parser,n=e.json,i=n.textures[t];if(!i.extensions||!i.extensions[this.name])return null;let r=i.extensions[this.name],o=e.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return e.loadTextureImage(t,r.source,o)}},Xh=class{constructor(t){this.parser=t,this.name=Vt.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(t){let e=this.name,n=this.parser,i=n.json,r=i.textures[t];if(!r.extensions||!r.extensions[e])return null;let o=r.extensions[e],a=i.images[o.source],c=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(t,o.source,c);if(i.extensionsRequired&&i.extensionsRequired.indexOf(e)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return n.loadTexture(t)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(t){let e=new Image;e.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",e.onload=e.onerror=function(){t(e.height===1)}})),this.isSupported}},qh=class{constructor(t){this.parser=t,this.name=Vt.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(t){let e=this.name,n=this.parser,i=n.json,r=i.textures[t];if(!r.extensions||!r.extensions[e])return null;let o=r.extensions[e],a=i.images[o.source],c=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(t,o.source,c);if(i.extensionsRequired&&i.extensionsRequired.indexOf(e)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return n.loadTexture(t)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(t){let e=new Image;e.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",e.onload=e.onerror=function(){t(e.height===1)}})),this.isSupported}},Kh=class{constructor(t){this.name=Vt.EXT_MESHOPT_COMPRESSION,this.parser=t}loadBufferView(t){let e=this.parser.json,n=e.bufferViews[t];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(e.extensionsRequired&&e.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){let c=i.byteOffset||0,l=i.byteLength||0,h=i.count,u=i.byteStride,d=new Uint8Array(a,c,l);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(h,u,d,i.mode,i.filter).then(function(f){return f.buffer}):o.ready.then(function(){let f=new ArrayBuffer(h*u);return o.decodeGltfBuffer(new Uint8Array(f),h,u,d,i.mode,i.filter),f})})}else return null}},Yh=class{constructor(t){this.name=Vt.EXT_MESH_GPU_INSTANCING,this.parser=t}createNodeMesh(t){let e=this.parser.json,n=e.nodes[t];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=e.meshes[n.mesh];for(let l of i.primitives)if(l.mode!==Mn.TRIANGLES&&l.mode!==Mn.TRIANGLE_STRIP&&l.mode!==Mn.TRIANGLE_FAN&&l.mode!==void 0)return null;let o=n.extensions[this.name].attributes,a=[],c={};for(let l in o)a.push(this.parser.getDependency("accessor",o[l]).then(h=>(c[l]=h,c[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(t)),Promise.all(a).then(l=>{let h=l.pop(),u=h.isGroup?h.children:[h],d=l[0].count,f=[];for(let p of u){let _=new At,m=new b,g=new Ot,M=new b(1,1,1),x=new Ne(p.geometry,p.material,d);for(let w=0;w<d;w++)c.TRANSLATION&&m.fromBufferAttribute(c.TRANSLATION,w),c.ROTATION&&g.fromBufferAttribute(c.ROTATION,w),c.SCALE&&M.fromBufferAttribute(c.SCALE,w),x.setMatrixAt(w,_.compose(m,g,M));for(let w in c)if(w==="_COLOR_0"){let C=c[w];x.instanceColor=new Vi(C.array,C.itemSize,C.normalized)}else w!=="TRANSLATION"&&w!=="ROTATION"&&w!=="SCALE"&&p.geometry.setAttribute(w,c[w]);fe.prototype.copy.call(x,p),this.parser.assignFinalMaterial(x),f.push(x)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}},Cf="glTF",Lr=12,Af={JSON:1313821514,BIN:5130562},Zh=class{constructor(t){this.name=Vt.KHR_BINARY_GLTF,this.content=null,this.body=null;let e=new DataView(t,0,Lr),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(t.slice(0,4))),version:e.getUint32(4,!0),length:e.getUint32(8,!0)},this.header.magic!==Cf)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-Lr,r=new DataView(t,Lr),o=0;for(;o<i;){let a=r.getUint32(o,!0);o+=4;let c=r.getUint32(o,!0);if(o+=4,c===Af.JSON){let l=new Uint8Array(t,Lr+o,a);this.content=n.decode(l)}else if(c===Af.BIN){let l=Lr+o;this.body=t.slice(l,l+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},jh=class{constructor(t,e){if(!e)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Vt.KHR_DRACO_MESH_COMPRESSION,this.json=t,this.dracoLoader=e,this.dracoLoader.preload()}decodePrimitive(t,e){let n=this.json,i=this.dracoLoader,r=t.extensions[this.name].bufferView,o=t.extensions[this.name].attributes,a={},c={},l={};for(let h in o){let u=tu[h]||h.toLowerCase();a[u]=o[h]}for(let h in t.attributes){let u=tu[h]||h.toLowerCase();if(o[h]!==void 0){let d=n.accessors[t.attributes[h]],f=Vs[d.componentType];l[u]=f.name,c[u]=d.normalized===!0}}return e.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){i.decodeDracoFile(h,function(f){for(let p in f.attributes){let _=f.attributes[p],m=c[p];m!==void 0&&(_.normalized=m)}u(f)},a,l,Ie,d)})})}},$h=class{constructor(){this.name=Vt.KHR_TEXTURE_TRANSFORM}extendTexture(t,e){return(e.texCoord===void 0||e.texCoord===t.channel)&&e.offset===void 0&&e.rotation===void 0&&e.scale===void 0||(t=t.clone(),e.texCoord!==void 0&&(t.channel=e.texCoord),e.offset!==void 0&&t.offset.fromArray(e.offset),e.rotation!==void 0&&(t.rotation=e.rotation),e.scale!==void 0&&t.repeat.fromArray(e.scale),t.needsUpdate=!0),t}},Jh=class{constructor(){this.name=Vt.KHR_MESH_QUANTIZATION}},wa=class extends vi{constructor(t,e,n,i){super(t,e,n,i)}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i*3+i;for(let o=0;o!==i;o++)e[o]=n[r+o];return e}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=a*2,l=a*3,h=i-e,u=(n-e)/h,d=u*u,f=d*u,p=t*l,_=p-l,m=-2*f+3*d,g=f-d,M=1-m,x=g-d+u;for(let w=0;w!==a;w++){let C=o[_+w+a],T=o[_+w+c]*h,E=o[p+w+a],z=o[p+w]*h;r[w]=M*C+x*T+m*E+g*z}return r}},hv=new Ot,Qh=class extends wa{interpolate_(t,e,n,i){let r=super.interpolate_(t,e,n,i);return hv.fromArray(r).normalize().toArray(r),r}},Mn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Vs={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Tf={9728:Fe,9729:Je,9984:lh,9985:lr,9986:gs,9987:In},Ef={33071:Kn,33648:_r,10497:Ln},Rh={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},tu={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Si={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},uv={CUBICSPLINE:void 0,LINEAR:Ps,STEP:zs},Ch={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function dv(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new Os({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:kn})),s.DefaultMaterial}function Ki(s,t,e){for(let n in e.extensions)s[n]===void 0&&(t.userData.gltfExtensions=t.userData.gltfExtensions||{},t.userData.gltfExtensions[n]=e.extensions[n])}function ii(s,t){t.extras!==void 0&&(typeof t.extras=="object"?Object.assign(s.userData,t.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+t.extras))}function fv(s,t,e){let n=!1,i=!1,r=!1;for(let l=0,h=t.length;l<h;l++){let u=t[l];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);let o=[],a=[],c=[];for(let l=0,h=t.length;l<h;l++){let u=t[l];if(n){let d=u.POSITION!==void 0?e.getDependency("accessor",u.POSITION):s.attributes.position;o.push(d)}if(i){let d=u.NORMAL!==void 0?e.getDependency("accessor",u.NORMAL):s.attributes.normal;a.push(d)}if(r){let d=u.COLOR_0!==void 0?e.getDependency("accessor",u.COLOR_0):s.attributes.color;c.push(d)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c)]).then(function(l){let h=l[0],u=l[1],d=l[2];return n&&(s.morphAttributes.position=h),i&&(s.morphAttributes.normal=u),r&&(s.morphAttributes.color=d),s.morphTargetsRelative=!0,s})}function pv(s,t){if(s.updateMorphTargets(),t.weights!==void 0)for(let e=0,n=t.weights.length;e<n;e++)s.morphTargetInfluences[e]=t.weights[e];if(t.extras&&Array.isArray(t.extras.targetNames)){let e=t.extras.targetNames;if(s.morphTargetInfluences.length===e.length){s.morphTargetDictionary={};for(let n=0,i=e.length;n<i;n++)s.morphTargetDictionary[e[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function mv(s){let t,e=s.extensions&&s.extensions[Vt.KHR_DRACO_MESH_COMPRESSION];if(e?t="draco:"+e.bufferView+":"+e.indices+":"+zh(e.attributes):t=s.indices+":"+zh(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)t+=":"+zh(s.targets[n]);return t}function zh(s){let t="",e=Object.keys(s).sort();for(let n=0,i=e.length;n<i;n++)t+=e[n]+":"+s[e[n]]+";";return t}function eu(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function gv(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":"image/png"}var _v=new At,nu=class{constructor(t={},e={}){this.json=t,this.extensions={},this.plugins={},this.options=e,this.cache=new lv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,o=-1;if(typeof navigator<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let c=a.match(/Version\/(\d+)/);i=n&&c?parseInt(c[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||r&&o<98?this.textureLoader=new ha(this.options.manager):this.textureLoader=new pa(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Cr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(t){this.extensions=t}setPlugins(t){this.plugins=t}parse(t,e){let n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let a={scene:o[0][i.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:i.asset,parser:n,userData:{}};return Ki(r,a,i),ii(a,i),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(a)})).then(function(){for(let c of a.scenes)c.updateMatrixWorld();t(a)})}).catch(e)}_markDefs(){let t=this.json.nodes||[],e=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=e.length;i<r;i++){let o=e[i].joints;for(let a=0,c=o.length;a<c;a++)t[o[a]].isBone=!0}for(let i=0,r=t.length;i<r;i++){let o=t[i];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(t,e){e!==void 0&&(t.refs[e]===void 0&&(t.refs[e]=t.uses[e]=0),t.refs[e]++)}_getNodeRef(t,e,n){if(t.refs[e]<=1)return n;let i=n.clone(),r=(o,a)=>{let c=this.associations.get(o);c!=null&&this.associations.set(a,c);for(let[l,h]of o.children.entries())r(h,a.children[l])};return r(n,i),i.name+="_instance_"+t.uses[e]++,i}_invokeOne(t){let e=Object.values(this.plugins);e.push(this);for(let n=0;n<e.length;n++){let i=t(e[n]);if(i)return i}return null}_invokeAll(t){let e=Object.values(this.plugins);e.unshift(this);let n=[];for(let i=0;i<e.length;i++){let r=t(e[i]);r&&n.push(r)}return n}getDependency(t,e){let n=t+":"+e,i=this.cache.get(n);if(!i){switch(t){case"scene":i=this.loadScene(e);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(e)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(e)});break;case"accessor":i=this.loadAccessor(e);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(e)});break;case"buffer":i=this.loadBuffer(e);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(e)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(e)});break;case"skin":i=this.loadSkin(e);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(e)});break;case"camera":i=this.loadCamera(e);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(t,e)}),!i)throw new Error("Unknown type: "+t);break}this.cache.add(n,i)}return i}getDependencies(t){let e=this.cache.get(t);if(!e){let n=this,i=this.json[t+(t==="mesh"?"es":"s")]||[];e=Promise.all(i.map(function(r,o){return n.getDependency(t,o)})),this.cache.add(t,e)}return e}loadBuffer(t){let e=this.json.buffers[t],n=this.fileLoader;if(e.type&&e.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+e.type+" buffer type is not supported.");if(e.uri===void 0&&t===0)return Promise.resolve(this.extensions[Vt.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(r,o){n.load(bi.resolveURL(e.uri,i.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+e.uri+'".'))})})}loadBufferView(t){let e=this.json.bufferViews[t];return this.getDependency("buffer",e.buffer).then(function(n){let i=e.byteLength||0,r=e.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(t){let e=this,n=this.json,i=this.json.accessors[t];if(i.bufferView===void 0&&i.sparse===void 0){let o=Rh[i.type],a=Vs[i.componentType],c=i.normalized===!0,l=new a(i.count*o);return Promise.resolve(new Se(l,o,c))}let r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(o){let a=o[0],c=Rh[i.type],l=Vs[i.componentType],h=l.BYTES_PER_ELEMENT,u=h*c,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,p=i.normalized===!0,_,m;if(f&&f!==u){let g=Math.floor(d/f),M="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+g+":"+i.count,x=e.cache.get(M);x||(_=new l(a,g*f,i.count*f/h),x=new Ds(_,f/h),e.cache.add(M,x)),m=new Hi(x,c,d%f/h,p)}else a===null?_=new l(i.count*c):_=new l(a,d,i.count*c),m=new Se(_,c,p);if(i.sparse!==void 0){let g=Rh.SCALAR,M=Vs[i.sparse.indices.componentType],x=i.sparse.indices.byteOffset||0,w=i.sparse.values.byteOffset||0,C=new M(o[1],x,i.sparse.count*g),T=new l(o[2],w,i.sparse.count*c);a!==null&&(m=new Se(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let E=0,z=C.length;E<z;E++){let F=C[E];if(m.setX(F,T[E*c]),c>=2&&m.setY(F,T[E*c+1]),c>=3&&m.setZ(F,T[E*c+2]),c>=4&&m.setW(F,T[E*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=p}return m})}loadTexture(t){let e=this.json,n=this.options,r=e.textures[t].source,o=e.images[r],a=this.textureLoader;if(o.uri){let c=n.manager.getHandler(o.uri);c!==null&&(a=c)}return this.loadTextureImage(t,r,a)}loadTextureImage(t,e,n){let i=this,r=this.json,o=r.textures[t],a=r.images[e],c=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[c])return this.textureCache[c];let l=this.loadImageSource(e,n).then(function(h){h.flipY=!1,h.name=o.name||a.name||"",h.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(h.name=a.uri);let d=(r.samplers||{})[o.sampler]||{};return h.magFilter=Tf[d.magFilter]||Je,h.minFilter=Tf[d.minFilter]||In,h.wrapS=Ef[d.wrapS]||Ln,h.wrapT=Ef[d.wrapT]||Ln,i.associations.set(h,{textures:t}),h}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(t,e){let n=this,i=this.json,r=this.options;if(this.sourceCache[t]!==void 0)return this.sourceCache[t].then(u=>u.clone());let o=i.images[t],a=self.URL||self.webkitURL,c=o.uri||"",l=!1;if(o.bufferView!==void 0)c=n.getDependency("bufferView",o.bufferView).then(function(u){l=!0;let d=new Blob([u],{type:o.mimeType});return c=a.createObjectURL(d),c});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+t+" is missing URI and bufferView");let h=Promise.resolve(c).then(function(u){return new Promise(function(d,f){let p=d;e.isImageBitmapLoader===!0&&(p=function(_){let m=new Pe(_);m.needsUpdate=!0,d(m)}),e.load(bi.resolveURL(u,r.path),p,void 0,f)})}).then(function(u){return l===!0&&a.revokeObjectURL(c),ii(u,o),u.userData.mimeType=o.mimeType||gv(o.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),u});return this.sourceCache[t]=h,h}assignTexture(t,e,n,i){let r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[Vt.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[Vt.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let c=r.associations.get(o);o=r.extensions[Vt.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,c)}}return i!==void 0&&(o.colorSpace=i),t[e]=o,o})}assignFinalMaterial(t){let e=t.geometry,n=t.material,i=e.attributes.tangent===void 0,r=e.attributes.color!==void 0,o=e.attributes.normal===void 0;if(t.isPoints){let a="PointsMaterial:"+n.uuid,c=this.cache.get(a);c||(c=new Gi,qe.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(a,c)),n=c}else if(t.isLine){let a="LineBasicMaterial:"+n.uuid,c=this.cache.get(a);c||(c=new br,qe.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(a,c)),n=c}if(i||r||o){let a="ClonedMaterial:"+n.uuid+":";i&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let c=this.cache.get(a);c||(c=n.clone(),r&&(c.vertexColors=!0),o&&(c.flatShading=!0),i&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(a,c),this.associations.set(c,this.associations.get(n))),n=c}t.material=n}getMaterialType(){return Os}loadMaterial(t){let e=this,n=this.json,i=this.extensions,r=n.materials[t],o,a={},c=r.extensions||{},l=[];if(c[Vt.KHR_MATERIALS_UNLIT]){let u=i[Vt.KHR_MATERIALS_UNLIT];o=u.getMaterialType(),l.push(u.extendParams(a,r,e))}else{let u=r.pbrMetallicRoughness||{};if(a.color=new tt(1,1,1),a.opacity=1,Array.isArray(u.baseColorFactor)){let d=u.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],Ie),a.opacity=d[3]}u.baseColorTexture!==void 0&&l.push(e.assignTexture(a,"map",u.baseColorTexture,qt)),a.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,a.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(l.push(e.assignTexture(a,"metalnessMap",u.metallicRoughnessTexture)),l.push(e.assignTexture(a,"roughnessMap",u.metallicRoughnessTexture))),o=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(t)}),l.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(t,a)})))}r.doubleSided===!0&&(a.side=de);let h=r.alphaMode||Ch.OPAQUE;if(h===Ch.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,h===Ch.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==le&&(l.push(e.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new it(1,1),r.normalTexture.scale!==void 0)){let u=r.normalTexture.scale;a.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&o!==le&&(l.push(e.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==le){let u=r.emissiveFactor;a.emissive=new tt().setRGB(u[0],u[1],u[2],Ie)}return r.emissiveTexture!==void 0&&o!==le&&l.push(e.assignTexture(a,"emissiveMap",r.emissiveTexture,qt)),Promise.all(l).then(function(){let u=new o(a);return r.name&&(u.name=r.name),ii(u,r),e.associations.set(u,{materials:t}),r.extensions&&Ki(i,u,r),u})}createUniqueName(t){let e=ce.sanitizeNodeName(t||"");return e in this.nodeNamesUsed?e+"_"+ ++this.nodeNamesUsed[e]:(this.nodeNamesUsed[e]=0,e)}loadGeometries(t){let e=this,n=this.extensions,i=this.primitiveCache;function r(a){return n[Vt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,e).then(function(c){return Rf(c,a,e)})}let o=[];for(let a=0,c=t.length;a<c;a++){let l=t[a],h=mv(l),u=i[h];if(u)o.push(u.promise);else{let d;l.extensions&&l.extensions[Vt.KHR_DRACO_MESH_COMPRESSION]?d=r(l):d=Rf(new Jt,l,e),i[h]={primitive:l,promise:d},o.push(d)}}return Promise.all(o)}loadMesh(t){let e=this,n=this.json,i=this.extensions,r=n.meshes[t],o=r.primitives,a=[];for(let c=0,l=o.length;c<l;c++){let h=o[c].material===void 0?dv(this.cache):this.getDependency("material",o[c].material);a.push(h)}return a.push(e.loadGeometries(o)),Promise.all(a).then(function(c){let l=c.slice(0,c.length-1),h=c[c.length-1],u=[];for(let f=0,p=h.length;f<p;f++){let _=h[f],m=o[f],g,M=l[f];if(m.mode===Mn.TRIANGLES||m.mode===Mn.TRIANGLE_STRIP||m.mode===Mn.TRIANGLE_FAN||m.mode===void 0)g=r.isSkinnedMesh===!0?new Yo(_,M):new Dt(_,M),g.isSkinnedMesh===!0&&g.normalizeSkinWeights(),m.mode===Mn.TRIANGLE_STRIP?g.geometry=Eh(g.geometry,_a):m.mode===Mn.TRIANGLE_FAN&&(g.geometry=Eh(g.geometry,kr));else if(m.mode===Mn.LINES)g=new Qo(_,M);else if(m.mode===Mn.LINE_STRIP)g=new Ns(_,M);else if(m.mode===Mn.LINE_LOOP)g=new ta(_,M);else if(m.mode===Mn.POINTS)g=new Us(_,M);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(g.geometry.morphAttributes).length>0&&pv(g,r),g.name=e.createUniqueName(r.name||"mesh_"+t),ii(g,r),m.extensions&&Ki(i,g,m),e.assignFinalMaterial(g),u.push(g)}for(let f=0,p=u.length;f<p;f++)e.associations.set(u[f],{meshes:t,primitives:f});if(u.length===1)return r.extensions&&Ki(i,u[0],r),u[0];let d=new yt;r.extensions&&Ki(i,d,r),e.associations.set(d,{meshes:t});for(let f=0,p=u.length;f<p;f++)d.add(u[f]);return d})}loadCamera(t){let e,n=this.json.cameras[t],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?e=new De(lf.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(e=new yi(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(e.name=this.createUniqueName(n.name)),ii(e,n),Promise.resolve(e)}loadSkin(t){let e=this.json.skins[t],n=[];for(let i=0,r=e.joints.length;i<r;i++)n.push(this._loadNodeShallow(e.joints[i]));return e.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",e.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let r=i.pop(),o=i,a=[],c=[];for(let l=0,h=o.length;l<h;l++){let u=o[l];if(u){a.push(u);let d=new At;r!==null&&d.fromArray(r.array,l*16),c.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',e.joints[l])}return new jo(a,c)})}loadAnimation(t){let e=this.json,n=this,i=e.animations[t],r=i.name?i.name:"animation_"+t,o=[],a=[],c=[],l=[],h=[];for(let u=0,d=i.channels.length;u<d;u++){let f=i.channels[u],p=i.samplers[f.sampler],_=f.target,m=_.node,g=i.parameters!==void 0?i.parameters[p.input]:p.input,M=i.parameters!==void 0?i.parameters[p.output]:p.output;_.node!==void 0&&(o.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",g)),c.push(this.getDependency("accessor",M)),l.push(p),h.push(_))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(l),Promise.all(h)]).then(function(u){let d=u[0],f=u[1],p=u[2],_=u[3],m=u[4],g=[];for(let M=0,x=d.length;M<x;M++){let w=d[M],C=f[M],T=p[M],E=_[M],z=m[M];if(w===void 0)continue;w.updateMatrix&&w.updateMatrix();let F=n._createAnimationTracks(w,C,T,E,z);if(F)for(let y=0;y<F.length;y++)g.push(F[y])}return new Fs(r,void 0,g)})}createNodeMesh(t){let e=this.json,n=this,i=e.nodes[t];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){let o=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let c=0,l=i.weights.length;c<l;c++)a.morphTargetInfluences[c]=i.weights[c]}),o})}loadNode(t){let e=this.json,n=this,i=e.nodes[t],r=n._loadNodeShallow(t),o=[],a=i.children||[];for(let l=0,h=a.length;l<h;l++)o.push(n.getDependency("node",a[l]));let c=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(o),c]).then(function(l){let h=l[0],u=l[1],d=l[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,_v)});for(let f=0,p=u.length;f<p;f++)h.add(u[f]);return h})}_loadNodeShallow(t){let e=this.json,n=this.extensions,i=this;if(this.nodeCache[t]!==void 0)return this.nodeCache[t];let r=e.nodes[t],o=r.name?i.createUniqueName(r.name):"",a=[],c=i._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(t)});return c&&a.push(c),r.camera!==void 0&&a.push(i.getDependency("camera",r.camera).then(function(l){return i._getNodeRef(i.cameraCache,r.camera,l)})),i._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(t)}).forEach(function(l){a.push(l)}),this.nodeCache[t]=Promise.all(a).then(function(l){let h;if(r.isBone===!0?h=new wr:l.length>1?h=new yt:l.length===1?h=l[0]:h=new fe,h!==l[0])for(let u=0,d=l.length;u<d;u++)h.add(l[u]);if(r.name&&(h.userData.name=r.name,h.name=o),ii(h,r),r.extensions&&Ki(n,h,r),r.matrix!==void 0){let u=new At;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);return i.associations.has(h)||i.associations.set(h,{}),i.associations.get(h).nodes=t,h}),this.nodeCache[t]}loadScene(t){let e=this.extensions,n=this.json.scenes[t],i=this,r=new yt;n.name&&(r.name=i.createUniqueName(n.name)),ii(r,n),n.extensions&&Ki(e,r,n);let o=n.nodes||[],a=[];for(let c=0,l=o.length;c<l;c++)a.push(i.getDependency("node",o[c]));return Promise.all(a).then(function(c){for(let h=0,u=c.length;h<u;h++)r.add(c[h]);let l=h=>{let u=new Map;for(let[d,f]of i.associations)(d instanceof qe||d instanceof Pe)&&u.set(d,f);return h.traverse(d=>{let f=i.associations.get(d);f!=null&&u.set(d,f)}),u};return i.associations=l(r),r})}_createAnimationTracks(t,e,n,i,r){let o=[],a=t.name?t.name:t.uuid,c=[];Si[r.path]===Si.weights?t.traverse(function(d){d.morphTargetInfluences&&c.push(d.name?d.name:d.uuid)}):c.push(a);let l;switch(Si[r.path]){case Si.weights:l=Qn;break;case Si.rotation:l=ti;break;case Si.position:case Si.scale:l=ei;break;default:switch(n.itemSize){case 1:l=Qn;break;case 2:case 3:default:l=ei;break}break}let h=i.interpolation!==void 0?uv[i.interpolation]:Ps,u=this._getArrayFromAccessor(n);for(let d=0,f=c.length;d<f;d++){let p=new l(c[d]+"."+Si[r.path],e.array,u,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(p),o.push(p)}return o}_getArrayFromAccessor(t){let e=t.array;if(t.normalized){let n=eu(e.constructor),i=new Float32Array(e.length);for(let r=0,o=e.length;r<o;r++)i[r]=e[r]*n;e=i}return e}_createCubicSplineTrackInterpolant(t){t.createInterpolant=function(n){let i=this instanceof ti?Qh:wa;return new i(this.times,this.values,this.getValueSize()/3,n)},t.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function yv(s,t,e){let n=t.attributes,i=new Ae;if(n.POSITION!==void 0){let a=e.json.accessors[n.POSITION],c=a.min,l=a.max;if(c!==void 0&&l!==void 0){if(i.set(new b(c[0],c[1],c[2]),new b(l[0],l[1],l[2])),a.normalized){let h=eu(Vs[a.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=t.targets;if(r!==void 0){let a=new b,c=new b;for(let l=0,h=r.length;l<h;l++){let u=r[l];if(u.POSITION!==void 0){let d=e.json.accessors[u.POSITION],f=d.min,p=d.max;if(f!==void 0&&p!==void 0){if(c.setX(Math.max(Math.abs(f[0]),Math.abs(p[0]))),c.setY(Math.max(Math.abs(f[1]),Math.abs(p[1]))),c.setZ(Math.max(Math.abs(f[2]),Math.abs(p[2]))),d.normalized){let _=eu(Vs[d.componentType]);c.multiplyScalar(_)}a.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(a)}s.boundingBox=i;let o=new cn;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=o}function Rf(s,t,e){let n=t.attributes,i=[];function r(o,a){return e.getDependency("accessor",o).then(function(c){s.setAttribute(a,c)})}for(let o in n){let a=tu[o]||o.toLowerCase();a in s.attributes||i.push(r(n[o],a))}if(t.indices!==void 0&&!s.index){let o=e.getDependency("accessor",t.indices).then(function(a){s.setIndex(a)});i.push(o)}return $t.workingColorSpace!==Ie&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${$t.workingColorSpace}" not supported.`),ii(s,t),yv(s,t,e),Promise.all(i).then(function(){return t.targets!==void 0?fv(s,t.targets,e):s})}var ba=new At,zf=new b,Pf=new b,If=new b,Ai=class{constructor(t=9){this.R=t}naKule(t,e,n=0,i=new b){let r=Math.hypot(t,e),o=this.R;if(r<1e-9)return i.set(0,o+n,0);let a=r/o,c=t/r,l=e/r,h=Math.sin(a),u=Math.cos(a);return i.set(h*c,u,h*l).multiplyScalar(o+n)}normalna(t,e,n=new b){return this.naKule(t,e,0,n).normalize()}ramka(t,e,n=new Ot){let i=Math.hypot(t,e);if(i<1e-9)return n.identity();let r=i/this.R,o=t/i,a=e/i,c=Math.sin(r),l=Math.cos(r),h=l*o,u=-c,d=l*a,f=-a,p=o;return zf.set(o*h-a*f,o*u,o*d-a*p),If.set(a*h+o*f,a*u,a*d+o*p),Pf.set(c*o,l,c*a),ba.makeBasis(zf,Pf,If),n.setFromRotationMatrix(ba)}zKuli(t,e={x:0,z:0,h:0}){let n=t.length();if(n<1e-9)return e.x=0,e.z=0,e.h=-this.R,e;let i=Math.max(-1,Math.min(1,t.y/n)),r=Math.acos(i),o=Math.atan2(t.z,t.x),a=r*this.R;return e.x=a*Math.cos(o),e.z=a*Math.sin(o),e.h=n-this.R,e}ustaw(t,e,n,i=0,r=0){return this.naKule(e,n,i,t.position),this.ramka(e,n,t.quaternion),r&&t.quaternion.multiply(Gs.setFromAxisAngle(xv,r)),t}obrotPodPunkt(t,e,n=new Ot){return this.ramka(t,e,n).invert()}},Gs=new Ot,xv=new b(0,1,0),Sa=new b,iu=new b;function nn(s,t,e,n=new b){n.copy(t).addScaledVector(s,-t.dot(s));let i=n.length();return i>1e-6?n.divideScalar(i):n.copy(e)}function He(s,t){s.addScaledVector(t,-s.dot(t));let e=s.length();return e>1e-6?s.divideScalar(e):s.set(1,0,0).addScaledVector(t,-t.x).normalize(),s}function kf(s,t,e){return Gs.setFromAxisAngle(t,e),s.applyQuaternion(Gs)}function su(s,t,e){return Sa.crossVectors(s,t),Math.atan2(Sa.dot(e),s.dot(t))}function vv(s,t,e=new Ot){return iu.crossVectors(s,t),ba.makeBasis(iu,s,t),e.setFromRotationMatrix(ba)}Ai.prototype.przesunPoKuli=function(s,t,e){Math.abs(e)<1e-9||(Sa.crossVectors(s,t).normalize(),Gs.setFromAxisAngle(Sa,e/this.R),s.applyQuaternion(Gs).normalize(),t.applyQuaternion(Gs),He(t,s))};Ai.prototype.punktObok=function(s,t,e,n=new b){n.copy(s);let i=iu.copy(t);return this.przesunPoKuli(n,i,e),n};Ai.prototype.odleglosc=function(s,t){return this.R*Math.acos(Math.max(-1,Math.min(1,s.dot(t))))};Ai.prototype.ustawN=function(s,t,e,n=0){return s.position.copy(t).multiplyScalar(this.R+n),vv(t,e,s.quaternion),s};function Lf(s=14){return s/(100*Math.PI/180)}function Ws(s,t,e=n=>[n.x,n.y]){let n=[],i=[];for(let r of s){let[o,a]=e(r);Math.hypot(o,a)<=t?i.push(r):i.length&&(i.length>=2&&n.push(i),i=[])}return i.length>=2&&n.push(i),n}var Mv=[{od:[-12,3.5],kontrola:[-6,5.2],do:[-3.2,8.6],kroki:12},{od:[-3.2,8.6],kontrola:[-2.2,10.6],do:[-4.5,15.5],kroki:8}],wv=[[-6.2,8.6],[-4.7,6.9],[-3.2,5.2],[-1.4,4.1],[-.1,2.6],[.9,.6],[1.1,-1.4],[.5,-3.4],[0,-5.6]],bv=[{file:"hut2",pos:[-10.6,-4.4],wysokosc:5.2,obrot:.55,promien:2.6,jasnosc:1.45}],si=(s,t)=>({id:s,file:"gwiazda",label:"Z\u0142ota gwiazdka",toast:"Z\u0142ota gwiazdka \u2014 z\u0142apana!",scale:.78,height:.95,glow:16765514,barwa:16763215,jasnosc:1.32,metalness:.3,roughness:.7,haloOpacity:.1,haloScale:.9,ringOpacity:0,lightBase:0,absorb:!0,absorbLift:1.5,respawn:12,iskry:26,iskrySila:1.6,pos:t}),Sv=[{id:"czarodziej",file:"wizard",label:"Czarodziej",toast:"Czarodziej pojawi\u0142 si\u0119 w lesie",pos:[-3,4],pozycje:[[-3,4],[-7,-8],[4,3.5],[4,-8],[.5,9]],scale:3.7,height:1.3,absorbLift:2.8,animuj:!0,bezObrotu:!0,obrotY:.484,absorb:!1,raz:!0,zasieg:1.9,zbrojenie:3.4,margines:1.8,cykl:35,respawn:60,respawnPierwszy:12,glow:12093672,ringColor:14268159,jasnosc:1.6,metalness:0,roughness:.85,haloOpacity:.2,haloScale:1.7,ringOpacity:.3,lightBase:0,iskry:38,iskrySila:1.9},{id:"karty",file:"karta",label:"Pami\u0119\u0107 M\u0119drca",toast:"Karty M\u0119drca \u2014 dobierz pary",pos:[3,2.6],scale:1.3,height:1.15,glow:8015298,ringColor:13148400,haloOpacity:.2,haloScale:1.2,ringOpacity:.22,lightBase:0,metalness:0,roughness:.85,jasnosc:1.7,absorb:!0,absorbLift:1.7,respawn:3.2},{id:"leaf",file:"lisc",label:"Sekret pod puchem",toast:"Pi\xF3rko \u2014 sekret pod puchem",pos:[-1.3,3.1],scale:1.6,height:1.55,glow:10481874,ringColor:12451048,haloOpacity:.13,ringOpacity:0,lightBase:0,haloScale:1.15,metalness:0,roughness:.9,absorb:!0,absorbLift:1.7,respawn:3.2},si("gwiazda-1",[-.4,4.6]),si("gwiazda-2",[2.4,5.2]),si("gwiazda-3",[-4.6,1.2]),si("gwiazda-4",[.8,-2.4]),si("gwiazda-5",[-3.2,-3.4]),si("gwiazda-6",[4.8,.6]),si("gwiazda-7",[-6.1,-1.6]),si("gwiazda-8",[1.6,7]),si("gwiazda-9",[5.4,-3.8])];function Av(s){let t=(n,i,r,o)=>new it((1-o)*(1-o)*n[0]+2*(1-o)*o*i[0]+o*o*r[0],(1-o)*(1-o)*n[1]+2*(1-o)*o*i[1]+o*o*r[1]),e=[];return s.forEach((n,i)=>{let r=n.kroki||12;for(let o=i?1:0;o<=r;o++)e.push(t(n.od,n.kontrola,n.do,o/r))}),e}function Df(){let s=globalThis.__SCENA3D_MAPA||{},t=s.swiat?.promien??12.5,e=s.swiat?.teren??36,n=Number(globalThis.SCENA3D_PROMIEN_KULI)||s.swiat?.promienKuli||Lf(t),i=(s.sciezka||wv).map(a=>new b(a[0],0,a[1])),r=s.rzeka?.krzywe||Mv,o=s.swiat?.promienTresci??.72*Math.PI*n;return{surowa:s,promienMapy:t,teren:e,promienKuli:n,promienTresci:o,start:s.start||null,sciezka:i,latarnia:{pos:new b(s.latarnia?.pos?.[0]??2.5,0,s.latarnia?.pos?.[1]??-1.2),punktSciezki:s.latarnia?.punktSciezki??6,ukryta:!!s.latarnia?.ukryta},most:{pos:[s.most?.pos?.[0]??-4.7,s.most?.pos?.[1]??6.9],ukryty:!!s.most?.ukryty},brama:{pos:[s.brama?.pos?.[0]??0,s.brama?.pos?.[1]??-7.2],ukryta:!!s.brama?.ukryta},rzeka:{szerokosc:s.rzeka?.szerokosc??1.5,krzywe:r,punkty:Av(r)},cienie:!!s.swiat?.cienie,terenKanciasty:s.swiat?.terenKanciasty??!1,terenWyboje:s.swiat?.terenWyboje,terenNieregularnosc:s.swiat?.terenNieregularnosc,terenFasety:!!s.swiat?.terenFasety,terenShader:s.swiat?.terenShader||null,chmury:s.swiat?.chmury??0,zoom:s.swiat?.zoom,dolnyDok:s.swiat?.dolnyDok!==!1,ekspozycja:Number.isFinite(s.swiat?.ekspozycja)?s.swiat.ekspozycja:1.25,kameraPodniesienie:Number.isFinite(s.swiat?.kameraPodniesienie)?s.swiat.kameraPodniesienie:null,zasiew:!!s.swiat?.zasiew,fasola:s.fasola||null,oczko:s.oczko||null,formyTerenu:s.formyTerenu||[],terenBarwy:s.swiat?.terenBarwy||null,doba:{wlaczona:!!s.swiat?.cyklDnia,nad:[s.swiat?.slonceNad?.[0]??0,s.swiat?.slonceNad?.[1]??0],strojenie:s.swiat?.doba||null},galezie:Array.isArray(s.galezie)?s.galezie:[],drzewa:s.drzewa||null,glazy:s.glazy||null,kwiaty:s.kwiaty||[],budynki:s.budynki??bv,znaki:s.znaki??Sv}}function Aa(s=1){let t=i=>Math.sin(s*12.9898*i+78.233)*43758.5453,e=[2,3,5].map(i=>t(i)%1*Math.PI*2),n=[.16,.1,.045];return i=>1+n[0]*Math.sin(2*i+e[0])+n[1]*Math.sin(3*i+e[1])+n[2]*Math.sin(5*i+e[2])}var Nf=s=>s<=0?0:s>=1?1:s*s*(3-2*s);function Uf(s,t,e){let n=t-s.pos[0],i=e-s.pos[1],r=Math.hypot(n,i);if(!s._mn)return r/s.promien;let o=Math.atan2(i,n);return r/(s.promien*s._mn(o))}var Of={wzgorze(s,t){let e=s.plaski??0;if(t>=1)return 0;let n=e>=1?0:Math.max(0,(t-e)/(1-e));return(s.wysokosc??.5)*(1-Nf(n))},niecka(s,t){let e=s.stok??.9;if(t>=1+e)return 0;let n=Math.max(0,(t-1)/e);return-(s.glebokosc??.11)*(1-Nf(n))}};function Ta(s){let t=[];for(let i of s.formyTerenu||[]){if(!i?.pos||!Of[i.typ]){console.warn("[teren] nieznana forma",i);continue}t.push({...i,promien:i.promien??2,_mn:i.ziarno!=null?Aa(i.ziarno):null})}if(s.oczko?.pos){let i=s.oczko;t.push({typ:"niecka",pos:i.pos,promien:i.promien??1.4,glebokosc:i.glebokosc??.11,stok:i.stok??.9,_mn:i.ziarno!=null?Aa(i.ziarno):null,_zrodlo:"oczko"})}for(let i of t)i._zasieg=i.promien*1.35*(i.typ==="niecka"?1+(i.stok??.9):1);return{h:(i,r)=>{let o=0;for(let a of t)Math.abs(i-a.pos[0])>a._zasieg||Math.abs(r-a.pos[1])>a._zasieg||(o+=Of[a.typ](a,Uf(a,i,r)));return o},niecka:(i,r)=>{let o=null;for(let a of t){if(a.typ!=="niecka"||Math.abs(i-a.pos[0])>a._zasieg||Math.abs(r-a.pos[1])>a._zasieg)continue;let c=Uf(a,i,r),l=a.stok??.9;c<1+l&&(o===null||c<o.o)&&(o={o:c,stok:l})}return o},formy:t,pusta:t.length===0}}var Tv={baza:8037968,jasna:9682272,ciemna:6131519,szalwia:8359793,brzeg:14472860,dno:8092245},Ev={skala:4,ziarno:0,moc:.5,kontrast:1,szalwia:.45,piasek:.35,wzgorza:.45,glebia:.1},Rv=`
varying vec3 vKierTeren;
varying float vWysTeren;

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
`;function Ff(s={}){let t={...Tv,...s.barwy||{}},e={...Ev,...s.strojenie||{}},n={uBazaTeren:{value:new tt(t.baza)},uJasnaTeren:{value:new tt(t.jasna)},uCiemnaTeren:{value:new tt(t.ciemna)},uSzalwiaTeren:{value:new tt(t.szalwia)},uPiasekTeren:{value:new tt(t.brzeg)},uDnoTeren:{value:new tt(t.dno)},uSkalaTeren:{value:e.skala},uMocTeren:{value:e.moc},uZiarnoTeren:{value:e.ziarno},uKontrastTeren:{value:e.kontrast},uSilaSzalwii:{value:e.szalwia},uSilaPiasku:{value:e.piasek},uWzgorzaTeren:{value:e.wzgorza},uGlebiaTeren:{value:Math.max(1e-4,e.glebia)}},i=new pe({color:16777215,flatShading:!!s.fasety});return i.onBeforeCompile=r=>{Object.assign(r.uniforms,n),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
        attribute float wysForma;
        varying vec3 vKierTeren;
        varying float vWysTeren;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        vKierTeren = normalize(position);
        vWysTeren = wysForma;`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
${Rv}`).replace("#include <color_fragment>",`#include <color_fragment>
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

        diffuseColor.rgb *= barwa;
      }`),i.userData.shaderTerenu=r},i.userData.uniformyTerenu=n,i.customProgramCacheKey=()=>"teren-proceduralny",i}var Cv=new b,Bf=new b,Yi=new b,Dr=new b,Xs=new b,Ea=new b,Nn=new b,yw=new b;function Hf(s){return Array.isArray(s)?[s[0],s[1]]:s.isVector3?[s.x,s.z]:[s.x,s.y]}function ru(s,t,e=Hf){let n=[];for(let i of s){let[r,o]=e(i),a=t.normalna(r,o,new b);n.length&&n[n.length-1].dot(a)>1-1e-12||n.push(a)}return n}function zv(s,t,e=.12){if(s.length<2)return s.slice();let n=t.R,i=[s[0].clone()],r=e;for(let a=0;a<s.length-1;a++){let c=s[a],l=s[a+1],h=Math.acos(Math.max(-1,Math.min(1,c.dot(l)))),u=h*n;if(u<1e-9)continue;let d=Math.sin(h),f=r;for(;f<=u;){let p=f/u,_=d>1e-9?Math.sin((1-p)*h)/d:1-p,m=d>1e-9?Math.sin(p*h)/d:p;i.push(Cv.copy(c).multiplyScalar(_).addScaledVector(l,m).normalize().clone()),f+=e}r=f-u}let o=s[s.length-1];return i[i.length-1].dot(o)<1-1e-9&&i.push(o.clone()),i}function Pv(s,t,e,n){let i=s[t],r=t>0,o=t<s.length-1;o&&nn(i,s[t+1],Yi.set(1,0,0),Yi),r&&nn(i,s[t-1],Dr.set(1,0,0),Dr).negate(),o||Yi.copy(Dr),r||Dr.copy(Yi),Xs.copy(Yi).add(Dr),Xs.lengthSq()<1e-10&&Xs.copy(Yi),He(Xs,i);let a=Math.max(Xs.dot(Yi),1/n);return{t:Xs,mitra:1/a}}function ou(s,t,e={}){let{polSzerokosc:n=.5,wysokosc:i=.01,krok:r=.12,skalaUV:o=1,mitraMax:a=2.5,kapsle:c=!0,juzNormalne:l=!1,wez:h=Hf}=e,u=l?s.map(T=>T.clone()):ru(s,t,h);if(u.length<2)return null;let d=zv(u,t,r);if(d.length<2)return null;let f=d.map(T=>({n:T,hw:n}));if(c&&n>1e-4){let T=[.38,.71,.92,.999],E=(z,F,y)=>{nn(z,F,Nn.set(1,0,0),Ea).negate();for(let S of T){let N=z.clone(),L=Ea.clone();t.przesunPoKuli(N,L,S*n);let B={n:N,hw:n*Math.sqrt(Math.max(0,1-S*S))};y?f.unshift(B):f.push(B)}};E(d[0],d[1],!0),E(d[d.length-1],d[d.length-2],!1)}let p=f.map(T=>T.n),_=[],m=[],g=[],M=[],x=t.R,w=0;for(let T=0;T<f.length;T++){let{n:E,hw:z}=f[T];T>0&&(w+=x*Math.acos(Math.max(-1,Math.min(1,p[T-1].dot(E)))));let{t:F,mitra:y}=Pv(p,T,t,a);Ea.crossVectors(E,F).normalize();let S=z*y;for(let N of[1,-1])Nn.copy(E),Bf.copy(Ea),S>1e-6&&t.przesunPoKuli(Nn,Bf,N*S),m.push(Nn.x,Nn.y,Nn.z),Nn.multiplyScalar(x+i),_.push(Nn.x,Nn.y,Nn.z);g.push(0,w*o,1,w*o)}for(let T=0;T<f.length-1;T++){let E=T*2;M.push(E,E+1,E+2,E+1,E+3,E+2)}let C=new Jt;return C.setAttribute("position",new Tt(_,3)),C.setAttribute("normal",new Tt(m,3)),C.setAttribute("uv",new Tt(g,2)),C.setIndex(M),C.computeBoundingSphere(),{geometry:C,os:d,dlugosc:w}}function Vf(s,t,e=Math.PI*t.R*.985){let n=Math.cos(Math.min(e/t.R,Math.PI*.995)),i=[],r=[];for(let o of s)o.y>=n?r.push(o):r.length&&(r.length>=2&&i.push(r),r=[]);return r.length>=2&&i.push(r),i}var wn={grassA:"#8bb054",grassB:"#6b9a45",grassC:"#a3c368",cliff:"#6d5a44",path:"#c9b58c",pathEdge:"#a8946e",pathSlab:"#d6c49c",water:"#3fb8c9",waterDeep:"#2a93a8",night:"#243147"},ee={pine:4029027,pineDark:3105616,trunk:7031344,leafTree:7319118,rock:9673884,rockDark:7831426,wood:9133628,woodDark:7226150,rope:13219465,lantern:8018488,flame:16767091,gate:10127978,gateGlow:16771496,pakKamien:7040888,pakKamienCiemny:5198684,pakZylka:13223092},Iv=(s,t={})=>new pe({color:s,...t}),me=s=>new pe({color:s,flatShading:!0});function ae(s,t,e=[0,0,0],n=[0,0,0],i=1){let r=new Dt(s,t);return r.position.set(...e),r.rotation.set(...n),r.scale.setScalar(i),r}function Gf(s,t,e,n,i){let r=Math.hypot(s,t);if(r<1e-6)return 1;let o=r/i,a=Math.sin(o)/o,c=Math.hypot(e,n)||1,l=-n/c,h=e/c,u=s/r,d=t/r,f=l*u+h*d,p=-l*d+h*u,_=Math.sqrt(f*f+p*p*a*a);return Math.min(8,1/Math.max(.001,_))}function au(s,t,e,n,i,r,o){if(t.length<2)return;s.fillStyle=s.strokeStyle;let a=i/2/o;for(let c=0;c<t.length-1;c++){let l=t[c],h=t[c+1],u=h.x-l.x,d=h.y-l.y,f=Math.hypot(u,d);if(f<1e-6)continue;u/=f,d/=f;let p=a*Gf(l.x,l.y,u,d,r),_=a*Gf(h.x,h.y,u,d,r);s.beginPath(),s.moveTo(e(l.x-d*p),n(l.y+u*p)),s.lineTo(e(h.x-d*_),n(h.y+u*_)),s.lineTo(e(h.x+d*_),n(h.y-u*_)),s.lineTo(e(l.x+d*p),n(l.y-u*p)),s.closePath(),s.fill()}for(let c of t){let l=Math.hypot(c.x,c.y),h=l/r,u=l<1e-6?1:Math.sin(h)/h,d=a/Math.max(.001,Math.abs(u));s.save(),s.translate(e(c.x),n(c.y)),s.rotate(Math.atan2(c.y,c.x)),s.beginPath(),s.ellipse(0,0,a*o,Math.min(a*8,d)*o,0,0,Math.PI*2),s.fill(),s.restore()}}function kv(s,t){let e=s.teren,n=2048,i=document.createElement("canvas");i.width=i.height=n;let r=i.getContext("2d"),o=n/e,a=x=>(x+e/2)*o,c=x=>(x+e/2)*o,l=r.createLinearGradient(0,0,0,n);l.addColorStop(0,wn.grassB),l.addColorStop(.55,wn.grassA),l.addColorStop(1,wn.grassB),r.fillStyle=l,r.fillRect(0,0,n,n);let h=42,u=()=>(h=h*16807%2147483647)/2147483647;for(let x=0;x<520;x++)r.fillStyle=u()>.5?wn.grassC:wn.grassB,r.globalAlpha=.16+u()*.2,r.beginPath(),r.ellipse(u()*n,u()*n,(14+u()*46)*2,(10+u()*30)*2,u()*3,0,7),r.fill();if(r.globalAlpha=1,!s.latarnia.ukryta){let x=r.createRadialGradient(a(0),c(-6.5),10,a(0),c(-6.5),n*.5);x.addColorStop(0,"rgba(255,220,140,0.5)"),x.addColorStop(.4,"rgba(255,220,140,0.16)"),x.addColorStop(1,"rgba(255,220,140,0)"),r.fillStyle=x,r.fillRect(0,0,n,n)}let d=t.R,f=s.rzeka.krzywe,p=(x=0)=>{let w=[];return f.forEach((C,T)=>{for(let E=T?1:0;E<=40;E++){let z=E/40;w.push(new it((1-z)*(1-z)*C.od[0]+2*(1-z)*z*C.kontrola[0]+z*z*C.do[0],(1-z)*(1-z)*(C.od[1]+x)+2*(1-z)*z*(C.kontrola[1]+x)+z*z*(C.do[1]+x)))}}),w},_=s.promienTresci,m=Ws(p(),_);r.strokeStyle=wn.waterDeep;for(let x of m)au(r,x,a,c,2.5*o,d,o);r.strokeStyle=wn.water;for(let x of m)au(r,x,a,c,1.9*o,d,o);r.strokeStyle="rgba(255,255,255,0.25)";let g=p();for(let x of[-.7,.2,.8]){let w=p(x),C=Ws(g.map((T,E)=>({x:T.x,y:T.y,ix:E})),_);for(let T of C)au(r,T.map(E=>w[E.ix]),a,c,.25*o,d,o)}for(let x=0;x<92;x++)r.fillStyle=["#ffffff","#e8b7e0","#ffd873"][Math.floor(u()*3)],r.globalAlpha=.8,r.beginPath(),r.arc(u()*n,u()*n,(2.6+u()*2)*2,0,7),r.fill();r.globalAlpha=1;let M=new _e(i);return M.colorSpace=qt,M.anisotropy=8,M}function Lv(s,t){let e=t.R,n=typeof s.terenKanciasty=="number"?s.terenKanciasty:5,i=s.terenWyboje??.05,r=new en(e,n),o=r.attributes.position,a=o.count,c=(y,S,N)=>Math.sin(4.8*y+.7)*Math.sin(5.9*N+1.9)*.55+Math.sin(9.3*S+2.6)*Math.sin(7.7*y+.3)*.3+Math.sin(15.1*N+4.2)*Math.sin(12.7*S+1.1)*.15,l=s.terenNieregularnosc??.3,h=1.10715/(n+1),u=l*h,d=y=>{let S=2166136261;for(let N=0;N<y.length;N++)S^=y.charCodeAt(N),S=Math.imul(S,16777619);return S>>>0},f=new Map,p=new b,_=new b,m=new b,g=y=>`${Math.round(y.x*1e4)},${Math.round(y.y*1e4)},${Math.round(y.z*1e4)}`,M=(y,S)=>{let N=f.get(S);if(N)return y.copy(N);let L=d(S),B=L%2048/2048*2-1,Z=(L>>>11)%2048/2048*2-1;return m.set(0,1,0),Math.abs(y.y)>.9&&m.set(1,0,0),p.crossVectors(y,m).normalize(),_.crossVectors(y,p).normalize(),y.addScaledVector(p,B*u).addScaledVector(_,Z*u).normalize(),f.set(S,y.clone()),y},x=Ta(s),w={x:0,z:0,h:0},C=y=>x.pusta?0:(t.zKuli(y,w),x.h(w.x,w.z)),T=new b,E=new Float32Array(a),z=new Array(a);for(let y=0;y<a;y++){T.fromBufferAttribute(o,y).normalize();let S=g(T);z[y]=S,u>1e-6&&M(T,S);let N=c(T.x,T.y,T.z),L=C(T);E[y]=L,T.multiplyScalar(e+i*(L<-1e-4?N*.3:N)+L),o.setXYZ(y,T.x,T.y,T.z)}r.setAttribute("wysForma",new Tt(E,1)),s.terenFasety?r.computeVertexNormals():Dv(r,z);let F=new Dt(r,Ff({barwy:s.terenBarwy||null,strojenie:s.terenShader||null,fasety:!!s.terenFasety}));return F.name="ground",F}function Dv(s,t){let e=s.attributes.position,n=e.count,i=new b,r=new b,o=new b,a=new b,c=new b,l=new b,h=new Map;for(let d=0;d+2<n;d+=3){i.fromBufferAttribute(e,d),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),l.crossVectors(a.subVectors(r,i),c.subVectors(o,i));for(let f=0;f<3;f++){let p=t[d+f],_=h.get(p);_||h.set(p,_=new b),_.add(l)}}let u=new Float32Array(n*3);for(let d=0;d<n;d++){let f=h.get(t[d]);l.copy(f).normalize(),u[d*3]=l.x,u[d*3+1]=l.y,u[d*3+2]=l.z}s.setAttribute("normal",new Tt(u,3))}function Nv(s,t){if(s.terenKanciasty)return Lv(s,t);let e=t.R,n=new Re(e,192,128),i=n.attributes.position,r=n.attributes.uv,o=new b,a={x:0,z:0,h:0},c=s.teren;for(let u=0;u<i.count;u++)o.fromBufferAttribute(i,u),t.zKuli(o,a),r.setXY(u,(a.x+c/2)/c,1-(a.z+c/2)/c);r.needsUpdate=!0;let l=new pe({map:kv(s,t)}),h=new Dt(n,l);return h.name="ground",h}var Ti={PREDKOSC:.18,SZEROKOSC:.9,KRYCIE:.56,SKALA:.55,WYSOKOSC:.012};function Wf(s){let t=document.createElement("canvas");t.width=96,t.height=256;let e=t.getContext("2d");e.clearRect(0,0,96,256),e.lineCap="round";for(let n=0;n<9;n++){let i=16+n*28+(n+s)%2*5,r=.42+n%3*.09,o=e.createLinearGradient(4,0,92,0);o.addColorStop(0,"rgba(255,255,255,0)"),o.addColorStop(.18,`rgba(255,255,255,${(r*.72).toFixed(3)})`),o.addColorStop(.5,`rgba(255,255,255,${r.toFixed(3)})`),o.addColorStop(.82,`rgba(255,255,255,${(r*.72).toFixed(3)})`),o.addColorStop(1,"rgba(255,255,255,0)"),e.strokeStyle=o,e.lineWidth=2.5+n%3*.7,e.beginPath(),e.moveTo(5,i),e.bezierCurveTo(25,i-5-s,62,i+5,91,i-1),e.stroke()}e.strokeStyle="rgba(255,255,255,.48)",e.lineWidth=1.8;for(let n=0;n<8;n++){let i=29+n*28+s*7,r=14+n%4*15;e.beginPath(),e.moveTo(r,i),e.quadraticCurveTo(r+8,i-3,r+17,i),e.stroke()}return t}function Uv(s,t){let e=Ws(s.rzeka.punkty,s.promienTresci),n=new yt,i=[];for(let r of e){let o=Ov(r,t);n.add(o.mesh),i.push(o.tik)}return{mesh:n,tik:r=>i.forEach(o=>o(r))}}function Ov(s,t){let e=()=>({mesh:new yt,tik:()=>{}});if(!s||s.length<2)return e();let n=[],i=[],r=[],o=Ti.SZEROKOSC,a=new b,c=new b,l=new b,h=new b,u=new b,d=new b,f=new b,p=0;for(let z=0;z<s.length;z++){let F=s[z],y=s[Math.min(z+1,s.length-1)],S=s[Math.max(z-1,0)];t.normalna(F.x,F.y,a),t.normalna(y.x,y.y,c),t.normalna(S.x,S.y,l),nn(a,c,f.set(1,0,0),h),nn(a,l,f.set(1,0,0),f).negate(),h.add(f),h.lengthSq()<1e-6&&nn(a,c,f.set(1,0,0),h),He(h,a),u.crossVectors(a,h).normalize(),z>0&&(p+=t.odleglosc(a,t.normalna(s[z-1].x,s[z-1].y,l)));let N=p*Ti.SKALA;d.copy(a),f.copy(u),t.przesunPoKuli(d,f,o),d.multiplyScalar(t.R+Ti.WYSOKOSC),n.push(d.x,d.y,d.z),d.copy(a),f.copy(u),t.przesunPoKuli(d,f,-o),d.multiplyScalar(t.R+Ti.WYSOKOSC),n.push(d.x,d.y,d.z),i.push(0,N,1,N)}for(let z=0;z<s.length-1;z++){let F=z*2;r.push(F,F+1,F+2,F+1,F+3,F+2)}let _=new Dn(1,1);_.setAttribute("position",new Tt(n,3)),_.setAttribute("uv",new Tt(i,2)),_.deleteAttribute("normal"),_.setIndex(r),_.computeBoundingSphere();let m=new _e(Wf(0)),g=new _e(Wf(1));m.wrapS=m.wrapT=Ln,g.wrapS=g.wrapT=Ln,g.repeat.set(1,1.35),g.offset.y=.37;let M=new le({map:m,transparent:!0,depthWrite:!1,side:de,opacity:Ti.KRYCIE}),x=new le({map:g,transparent:!0,depthWrite:!1,side:de,opacity:Ti.KRYCIE*.68}),w=new Dt(_,M);w.renderOrder=1,w.frustumCulled=!1;let C=new Dt(_,x);C.renderOrder=2,C.frustumCulled=!1;let T=new yt;return T.add(w,C),{mesh:T,tik:z=>{m.offset.y=(m.offset.y-z*Ti.PREDKOSC)%1,g.offset.y=(g.offset.y-z*Ti.PREDKOSC*.48)%1,g.offset.x=Math.sin(Date.now()*18e-5)*.045}}}var Un={HW_OBRYS:.95,HW_WYPELNIENIE:.775,H_OBRYS:.005,H_WYPELNIENIE:.009,H_PLYTKI:.013,KROK:.14,CO_ILE_PLYTEK:.46};function Fv(){let s=document.createElement("canvas");s.width=s.height=64;let t=s.getContext("2d");t.fillStyle="#ffffff",t.beginPath(),t.roundRect(2,2,60,60,13),t.fill();let e=new _e(s);return e.colorSpace=qt,e}function Bv(s,t){let e=new yt;e.name="sciezki";let n=new pe({color:wn.pathEdge,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),i=new pe({color:wn.path,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4}),r=[[s.sciezka,1]];for(let c of s.galezie||[]){let l=c&&(c.sciezka||c.punkty);l&&l.length>=2&&r.push([l,c.szerokosc||.75])}let o=[];for(let[c,l]of r)for(let h of Vf(ru(c,t),t)){let u={juzNormalne:!0,krok:Un.KROK},d=ou(h,t,{...u,polSzerokosc:Un.HW_OBRYS*l,wysokosc:Un.H_OBRYS}),f=ou(h,t,{...u,polSzerokosc:Un.HW_WYPELNIENIE*l,wysokosc:Un.H_WYPELNIENIE});d&&e.add(Xf(d.geometry,n)),f&&(e.add(Xf(f.geometry,i)),o.push({os:f.os,szer:l}))}let a=Hv(o);return a.length&&e.add(Vv(a,t)),e}function Xf(s,t){let e=new Dt(s,t);return e.frustumCulled=!1,e}function Hv(s){let t=[],e=1337,n=()=>(e=e*16807%2147483647)/2147483647,i=Math.max(1,Math.round(Un.CO_ILE_PLYTEK/Un.KROK));for(let{os:r,szer:o}of s)for(let a=i;a<r.length-i;a+=i)t.push({n:r[a],przed:r[a-1],po:r[a+1],wzdluz:(.55+n()*.25)*o,wpoprzek:(.42+n()*.2)*o,kolor:n()>.4?wn.pathSlab:"#cfbd96",bok:(n()-.5)*.12});return t}function Vv(s,t){let e=new Dn(1,1);e.rotateX(-Math.PI/2);let n=new pe({map:Fv(),transparent:!0,opacity:.85,alphaTest:.35,polygonOffset:!0,polygonOffsetFactor:-6,polygonOffsetUnits:-6}),i=new Ne(e,n,s.length);i.frustumCulled=!1;let r=new At,o=new tt,a=new b,c=new b,l=new b,h=new b,u=new b,d=new b,f=new b,p=new b;return s.forEach((_,m)=>{nn(_.n,_.po,d.set(1,0,0),a),nn(_.n,_.przed,d.set(1,0,0),l).negate(),a.add(l),He(a,_.n),c.crossVectors(_.n,a).normalize(),h.copy(_.n),u.copy(c),Math.abs(_.bok)>1e-4&&t.przesunPoKuli(h,u,_.bok),a.crossVectors(u,h).normalize(),d.copy(u).multiplyScalar(_.wpoprzek),f.copy(h),p.copy(a).multiplyScalar(_.wzdluz),r.makeBasis(d,f,p),r.setPosition(h.x*(t.R+Un.H_PLYTKI),h.y*(t.R+Un.H_PLYTKI),h.z*(t.R+Un.H_PLYTKI)),i.setMatrixAt(m,r),i.setColorAt(m,o.set(_.kolor))}),i.instanceMatrix.needsUpdate=!0,i.instanceColor&&(i.instanceColor.needsUpdate=!0),i}function Kf(s=1){let t=new yt;t.name="kamienny-pak";let e=me(ee.pakKamien),n=me(ee.pakKamienCiemny);t.add(ae(new tn(.34*s,.58*s,.72*s,7),n,[0,.3*s,0])),t.add(ae(new tn(.46*s,.3*s,.26*s,7),e,[0,.76*s,0]));for(let i=0;i<3;i++){let r=i*Math.PI*2/3+.4,o=ae(new xi(.42*s,1.9*s,5),i===1?n:e,[Math.cos(r)*.19*s,1.72*s,Math.sin(r)*.19*s],[Math.cos(r)*.13,r,Math.sin(r)*.13]);t.add(o)}t.add(ae(new xi(.3*s,2.3*s,6),e,[0,1.95*s,0]));for(let i=0;i<3;i++){let r=i*Math.PI*2/3-.5;t.add(ae(new tn(.035*s,.02*s,1.5*s,4),me(ee.pakZylka),[Math.cos(r)*.3*s,1.55*s,Math.sin(r)*.3*s],[Math.cos(r)*.16,0,Math.sin(r)*.16]))}return t}function qs(s=1){let t=new yt;return t.add(ae(new tn(.12*s,.18*s,.7*s,6),me(ee.trunk),[0,.35*s,0])),[[1.05,.95],[.82,1.6],[.58,2.2]].forEach(([e,n],i)=>{t.add(ae(new xi(e*s,1*s,7),me(i%2?ee.pineDark:ee.pine),[0,n*s,0]))}),t}function Ra(s=1){let t=new yt;return t.add(ae(new tn(.14*s,.2*s,1.1*s,6),me(ee.trunk),[0,.55*s,0])),t.add(ae(new en(1*s,1),me(ee.leafTree),[0,1.7*s,0])),t.add(ae(new en(.5*s,1),me(8371806),[.5*s,1.3*s,.25*s])),t}function qf(s=1,t=!1){let e=new yt;if(t){let o=ae(new en(.5*s,0),me(ee.rock),[0,.2*s,0],[.6,.9,.3]);return o.scale.set(1.1,.72,1),e.add(o),e}let n=ae(new en(.5*s,0),me(ee.rock),[0,.34*s,0],[.28,.8,.1]);n.scale.set(1,1.42,.96);let i=ae(new en(.33*s,0),me(ee.rock),[.26*s,.19*s,.14*s],[.9,.35,.5]);i.scale.set(1.12,.9,1.05);let r=ae(new en(.2*s,0),me(ee.rockDark),[-.34*s,.12*s,.26*s],[.5,.2,.4]);return r.scale.set(1.15,.8,1),e.add(n,i,r),e}function Gv(){let s=new yt;s.add(ae(new Ke(.22,2.1,.22),me(ee.lantern),[0,1.05,0])),s.add(ae(new Ke(.3,.16,.3),me(ee.woodDark),[0,2.16,0])),s.add(ae(new Ke(.8,.14,.18),me(ee.lantern),[-.3,2.02,0]));let t=new yt;t.position.set(-.62,1.7,0),t.add(ae(new tn(.02,.02,.24,5),me(ee.woodDark),[0,.24,0])),t.add(ae(new Ke(.24,.3,.24),me(ee.woodDark),[0,0,0]));let e=new pe({color:ee.flame,emissive:ee.flame,emissiveIntensity:1.6});t.add(ae(new Ke(.18,.22,.18),e,[0,0,0])),t.add(ae(new xi(.2,.14,4),me(ee.woodDark),[0,.2,0],[0,Math.PI/4,0])),s.add(t);let n=new un(ee.flame,9,7,2);return n.position.copy(t.position),s.add(n),s.userData={lamp:t,light:n,glassMat:e},s}function Wv(){let s=new yt;for(let t=-3;t<=3;t++)s.add(ae(new Ke(2.2,.1,.34),me(t%2?ee.wood:ee.woodDark),[0,.16+Math.cos(t*.4)*.09,t*.38],[Math.sin(t*.4)*.09,0,0]));for(let t of[-1,1]){for(let e of[-1,1])s.add(ae(new Ke(.14,.7,.14),me(ee.woodDark),[t*1,.45,e*1.25])),s.add(ae(new Re(.09,6,5),me(ee.wood),[t*1,.84,e*1.25]));s.add(ae(new tn(.03,.03,2.5,5),Iv(ee.rope),[t*1,.62,0],[Math.PI/2,0,0]))}return s}function Xv(){let s=new yt;for(let o of[-1,1])s.add(ae(new Ke(.6,2.6,.5),me(ee.gate),[o*1.3,1.3,0])),s.add(ae(new xi(.42,.6,4),me(ee.gate),[o*1.3,2.85,0],[0,Math.PI/4,0]));s.add(ae(new Ke(2.2,.5,.4),me(ee.gate),[0,2.45,0]));let t=document.createElement("canvas");t.width=t.height=128;let e=t.getContext("2d"),n=e.createRadialGradient(64,64,4,64,64,64);n.addColorStop(0,"rgba(255,240,190,1)"),n.addColorStop(1,"rgba(255,220,140,0)"),e.fillStyle=n,e.fillRect(0,0,128,128);let i=new Qe(new Ye({map:new _e(t),color:ee.gateGlow,transparent:!0,opacity:.9,blending:zn,depthWrite:!1}));i.scale.set(3.4,3.4,1),i.position.set(0,1.6,0),s.add(i);let r=new un(ee.gateGlow,10,10,2);return r.position.set(0,1.8,0),s.add(r),s.userData={glow:i,light:r},s}function Ca(s=1,t=.35,e=0,n=!1){let i=document.createElement("canvas");i.width=i.height=64;let r=i.getContext("2d"),o=r.createRadialGradient(32,32,2,32,32,32);if(n){let u=`rgb(${Math.round(255-225*t)},${Math.round(255-215*t)},${Math.round(255-225*t)})`;o.addColorStop(0,u),e&&o.addColorStop(e,u),o.addColorStop(1,"rgb(255,255,255)")}else o.addColorStop(0,`rgba(30,40,30,${t})`),e&&o.addColorStop(e,`rgba(30,40,30,${t})`),o.addColorStop(1,"rgba(30,40,30,0)");r.fillStyle=o,r.fillRect(0,0,64,64);let a=new _e(i);a.colorSpace=qt;let c=n?new le({map:a,transparent:!0,depthWrite:!1,blending:ko,toneMapped:!1}):new le({map:a,transparent:!0,depthWrite:!1}),l=new Dt(new Dn(s,s),c);l.rotation.x=-Math.PI/2,l.position.y=.02;let h=new yt;return h.add(l),h.userData.plama=l,h}function qv(s,t,e){let n=new Dt(e.geometry,e.material);n.updateMatrixWorld(!0),e.geometry.computeBoundingSphere();let i=e.geometry.boundingSphere.radius+1,r=new Bs,o=new b,a=new b,c=new b;function l(v,k){t.normalna(v,k,o),r.set(a.copy(o).multiplyScalar(i),c.copy(o).negate());let I=r.intersectObject(n,!1)[0];return(I?I.point.dot(o)-t.R:0)-.008}let h=256,u=[{p:16643814,s:15909194},{p:16238920,s:14715422},{p:15765428,s:16177003},{p:8038120,s:15982714},{p:12159712,s:16179338}],d=[{strona:1,wys:.34,sk:1,obr:-.5},{strona:-1,wys:.58,sk:.78,obr:.5}],f=new pe({color:6065210,flatShading:!0}),p=new pe({color:7250762,flatShading:!0}),_=new tn(.008,.012,1,5),m=new Re(.058,9,6),g=new Re(.052,10,7),M=new Re(.04,10,7),x=18,w=new Jt;w.setAttribute("position",new Tt([-.09,-.006,-.048,-.222,.978,.954,-.22,.926,1.003,-.116,-.016,.013,.092,.006,.048,.111,.017,-.013,-.147,.949,1.022,-.147,1,.973,-.009,-.005,.031,.013,.005,-.031,-.182,.938,1.012,-.183,.989,.963,-.307,.65,.188,-.312,.621,.228,-.019,.694,.268,-.022,.665,.306,-.163,.643,.267,-.159,.672,.228,-.297,.86,.531,-.293,.821,.574,-.067,.902,.586,-.066,.864,.627,-.175,.843,.6,-.177,.881,.558,-.197,.361,-.049,-.219,.34,-.003,.061,.399,.021,.046,.378,.065,-.083,.359,.031,-.065,.38,-.014],3)),w.setAttribute("color",new Tt([.72,.78,.62,1.113,1.094,.817,1.096,1.081,.808,.72,.78,.62,.726,.785,.623,.735,.792,.628,1.103,1.087,.812,1.12,1.1,.82,.72,.78,.62,.726,.785,.623,1.1,1.084,.81,1.117,1.097,.818,1.003,1.007,.762,.993,.999,.757,1.019,1.019,.769,1.009,1.011,.764,1.001,1.005,.761,1.011,1.013,.766,1.075,1.064,.797,1.062,1.053,.791,1.088,1.075,.804,1.076,1.065,.798,1.069,1.059,.794,1.082,1.069,.801,.897,.922,.709,.889,.915,.704,.912,.934,.716,.904,.927,.712,.896,.921,.708,.905,.928,.712],3)),w.setIndex([10,11,1,2,10,1,6,7,11,10,6,11,19,18,12,13,19,12,2,1,18,19,2,18,21,20,7,6,21,7,15,14,20,21,15,20,21,22,16,15,21,16,6,10,22,21,6,22,22,19,13,16,22,13,10,2,19,22,10,19,18,23,17,12,18,17,1,11,23,18,1,23,23,20,14,17,23,14,11,7,20,23,11,20,25,24,0,3,25,0,13,12,24,25,13,24,27,26,14,15,27,14,4,5,26,27,4,26,27,28,8,4,27,8,15,16,28,27,15,28,28,25,3,8,28,3,16,13,25,28,16,25,24,29,9,0,24,9,12,17,29,24,12,29,29,26,5,9,29,5,17,14,26,29,17,26]),w.scale(1.05,1,.4),w.computeVertexNormals();let C=new pe({color:16777215,flatShading:!0,vertexColors:!0}),T=[new tt(5804348),new tt(7317578),new tt(8829784)];function E(v){let k=v*2654435761%4294967296;return()=>(k=(k*1664525+1013904223)%4294967296,k/4294967296)}let z=s.map(v=>Math.max(0,Math.min(u.length-1,v.wariant|0))),F=u.map(()=>0);z.forEach(v=>F[v]++);let y=s.length+h,S=new Ne(_,f,y),N=new Ne(m,p,y*2),L=new Ne(w,C,h*x);S.count=s.length,N.count=s.length*2,L.count=0;let B=[],Z=[],H=[];u.forEach((v,k)=>{B.push(new Ne(g,new pe({color:v.p,flatShading:!1}),(F[k]+h)*5)),Z.push(new Ne(M,new pe({color:v.s,flatShading:!1}),F[k]+h)),B[k].count=F[k]*5,Z[k].count=F[k],H.push(0)});let $=new yt,W=new yt,at=new yt,ct=new yt,gt=new yt,Ft=[new yt,new yt],Yt=[],Y=[],Q=[];$.add(W),W.add(at,ct,...Ft),at.add(gt);for(let v=0;v<5;v++){let k=new yt;at.add(k),Yt.push(k)}for(let v=0;v<x;v++){let k=new yt,I=new yt;k.add(I),W.add(k),Y.push(k),Q.push(I)}let dt=new At().makeScale(0,0,0);function pt(v,k){let I=E(k+1),K=Math.max(0,Math.min(4,v.wariant|0)),X=.085+I()*.025,rt={x:v.pos[0],z:v.pos[1],typ:v.typ==="trawa"?"trawa":"kwiat",wariant:K,h:X,iTrawa:v.iTrawa??null,grunt:l(v.pos[0],v.pos[1]),gruntX:v.pos[0],gruntZ:v.pos[1],skala:(.85+I()*.5)*(v.skala!=null?v.skala:1),obrotY:v.obrot!=null?v.obrot:I()*Math.PI*2,bazaZ:(I()-.5)*.28,bazaX:(I()-.5)*.2,glowaX:-.34+I()*.14,katy:[0,0,0,0,0].map((et,st)=>st/5*Math.PI*2+I()*.1),iLodyga:k,iLisc:[k*2,k*2+1],iSrodek:H[K],iPlatki:[0,1,2,3,4].map(et=>H[K]*5+et),gib:{x:0,z:0,vx:0,vz:0}};return H[K]++,rt}function kt(v,k){let I=E(k),K=[[[0,0]],[[-.065,0],[.065,.012]],[[-.078,-.026],[0,.042],[.082,-.022]],[[-.1,-.012],[-.034,.038],[.038,.032],[.105,-.018]]],X=Math.floor(I()*K.length),rt=K[X],et=Math.min(x,4+rt.length+Math.floor(I()*4)),st=I()*Math.PI*2,xt=.05+I()*.075,J=.8+I()*.55,_t=.5+I()*1.05;v.ukladTrawy=X,v.trawa=Array.from({length:x},(Pt,Rt)=>{let ft=rt[Rt%rt.length],Xt=ft[0]*Math.cos(st)-ft[1]*Math.sin(st),Lt=ft[0]*Math.sin(st)+ft[1]*Math.cos(st),Qt=st+Rt*2.39996+(I()-.5)*.95,D=Rt<rt.length?I()*.022:Math.sqrt(I())*xt,lt=(.02+I()*.13)*_t,q=Math.floor(I()*T.length);return v.iTrawa!=null&&L.setColorAt(v.iTrawa+Rt,T[q]),{aktywne:Rt<et,x:Xt+Math.cos(Qt)*D,z:Lt+Math.sin(Qt)*D,h:(.115+I()*.09+(1-Math.min(1,D/xt))*.03)*J,szer:.75+I()*.5,luk:.75+I()*.55,obrot:Qt+(I()-.5)*2.1,pochylenieX:Math.sin(Qt)*lt+(I()-.5)*.1,pochylenieZ:-Math.cos(Qt)*lt+(I()-.5)*.1}})}let wt=s.map(pt);function Bt(v){(v.x!==v.gruntX||v.z!==v.gruntZ)&&(v.grunt=l(v.x,v.z),v.gruntX=v.x,v.gruntZ=v.z),t.ustaw($,v.x,v.z,v.grunt,0),W.position.set(0,0,0),W.rotation.set(v.bazaX+v.gib.z,v.obrotY,v.bazaZ-v.gib.x);let k=v.skala*(v.szerokoscWzrostu??1);if(W.scale.set(k,v.skala*(v.wzrost??1),k),v.typ==="trawa"){S.setMatrixAt(v.iLodyga,dt),N.setMatrixAt(v.iLisc[0],dt),N.setMatrixAt(v.iLisc[1],dt),Z[v.wariant].setMatrixAt(v.iSrodek,dt);for(let I=0;I<5;I++)B[v.wariant].setMatrixAt(v.iPlatki[I],dt);v.trawa.forEach((I,K)=>{let X=Y[K],rt=Q[K];X.position.set(I.x,0,I.z),X.rotation.set(I.pochylenieX,0,I.pochylenieZ),rt.position.set(0,-.09*I.h,0),rt.rotation.set(0,I.obrot,0),rt.scale.set(I.h*I.szer,I.h,I.h*I.luk)}),$.updateMatrixWorld(!0),v.trawa.forEach((I,K)=>L.setMatrixAt(v.iTrawa+K,I.aktywne?Q[K].matrixWorld:dt));return}ct.position.set(0,v.h/2,0),ct.scale.set(1,v.h,1),d.forEach((I,K)=>{let X=Ft[K];X.position.set(I.strona*.058*I.sk,v.h*I.wys,0),X.rotation.set(0,I.strona>0?.25:-.25,I.obr),X.scale.set(1.35*I.sk,.22*I.sk,.7*I.sk)}),at.position.set(0,v.h,0),at.rotation.set(v.glowaX,0,0),gt.position.set(0,.016,0),gt.scale.set(1,.58,1),v.katy.forEach((I,K)=>{let X=Yt[K];X.position.set(Math.cos(I)*.066,0,Math.sin(I)*.066),X.rotation.set(0,-I,.12),X.scale.set(1.3,.38,.88)}),$.updateMatrixWorld(!0),S.setMatrixAt(v.iLodyga,ct.matrixWorld),N.setMatrixAt(v.iLisc[0],Ft[0].matrixWorld),N.setMatrixAt(v.iLisc[1],Ft[1].matrixWorld),Z[v.wariant].setMatrixAt(v.iSrodek,gt.matrixWorld);for(let I=0;I<5;I++)B[v.wariant].setMatrixAt(v.iPlatki[I],Yt[I].matrixWorld);if(v.iTrawa!=null)for(let I=0;I<x;I++)L.setMatrixAt(v.iTrawa+I,dt)}wt.forEach(Bt);function Zt(){S.instanceMatrix.needsUpdate=!0,N.instanceMatrix.needsUpdate=!0,L.instanceMatrix.needsUpdate=!0,L.instanceColor&&(L.instanceColor.needsUpdate=!0);for(let v=0;v<u.length;v++)B[v].instanceMatrix.needsUpdate=!0,Z[v].instanceMatrix.needsUpdate=!0}Zt();let Gt=[S,N,L,...B,...Z];Gt.forEach(v=>v.frustumCulled=!1);let P=new Set,Ge=.1,Wt=.84,Ht=[[0,0,0],[.14,1.12,.25],[.38,.82,1.35],[.57,1.12,.9],[.75,.97,1.06],[1,1,1]],Et=0,se=0;function zt(v,k,I=!1){if(!Number.isFinite(v)||!Number.isFinite(k))return!1;let K=t.normalna(v,k);if(wt.some(J=>t.normalna(J.x,J.z,o).dot(K)>Math.cos(.32/t.R)))return!1;let X=(se+1)*7919,rt=E(X),et=rt()<.45?"trawa":"kwiat",st=.62+rt()*.46,xt;if(Et<h)xt=pt({pos:[v,k],typ:et,wariant:se%5,skala:st,iTrawa:Et*x},wt.length),wt.push(xt),Et++,S.count=wt.length,N.count=wt.length*2,B[xt.wariant].count=H[xt.wariant]*5,Z[xt.wariant].count=H[xt.wariant],L.count=Et*x;else{if(xt=wt.slice(s.length).find(J=>!P.has(J)&&t.normalna(J.x,J.z,o).dot(K)<Math.cos(9/t.R)),!xt)return!1;xt.x=v,xt.z=k,xt.typ=et}return xt.typ==="trawa"&&kt(xt,X*17+12345),se++,xt.czasWzrostu=0,xt.wzrost=I?1:0,xt.szerokoscWzrostu=I?1:0,xt.gib.x=xt.gib.z=xt.gib.vx=xt.gib.vz=0,I||P.add(xt),Bt(xt),Zt(),!0}function R(v,k=!1){if(P.size){for(let I of P){I.czasWzrostu+=Math.max(0,v);let K=k?1:Math.max(0,Math.min(1,(I.czasWzrostu-Ge)/Wt)),X=1;for(;X<Ht.length-1&&K>Ht[X][0];)X++;let rt=Ht[X-1],et=Ht[X],st=(K-rt[0])/(et[0]-rt[0]),xt=st*st*(3-2*st);I.szerokoscWzrostu=rt[1]+(et[1]-rt[1])*xt,I.wzrost=rt[2]+(et[2]-rt[2])*xt,Bt(I),K===1&&P.delete(I)}Zt()}}return{lista:wt,odswiez:Bt,oznacz:Zt,meshe:Gt,posadz:zt,aktualizujZasiew:R,stanZasiewu:()=>{let v=wt.slice(s.length,s.length+Et);return{zasiane:Et,rosnace:P.size,limit:h,trawy:v.filter(k=>k.typ==="trawa").length,kwiaty:v.filter(k=>k.typ==="kwiat").length}}}}function Yf(s,t){let e=new yt;e.name="planeta";let n=[],i=Nv(s,t);e.add(i);let r=Bv(s,t);e.add(r);let o=Uv(s,t);e.add(o.mesh);let a=s.sciezka,c=Wv(),l=a.length>=3?Math.atan2(a[2].x-a[1].x,a[2].z-a[1].z):0;t.ustaw(c,s.most.pos[0],s.most.pos[1],0,l),s.most.ukryty||e.add(c);let h=s.latarnia.pos,u=Gv();t.ustaw(u,h.x,h.z,0,-.35);let d=Ca(1.4);t.ustaw(d,h.x,h.z,0,0),s.latarnia.ukryta||(e.add(u,d),n.push({x:h.x,z:h.z,r:.45}));let f=Xv();t.ustaw(f,s.brama.pos[0],s.brama.pos[1],0,0),s.brama.ukryta||(e.add(f),n.push({x:s.brama.pos[0]-1.3,z:s.brama.pos[1],r:.55},{x:s.brama.pos[0]+1.3,z:s.brama.pos[1],r:.55}));let p=s.drzewa?s.drzewa.map(g=>[(g.typ==="lisciaste"?Ra:qs)(g.skala??1),g.pos[0],g.pos[1],g.obrot,g.skala??1]):[[qs(1.3),-3.6,1.3],[qs(.9),4.6,-4.2],[Ra(1),4.2,.6],[qs(1.1),-5.2,-3]];for(let[g,M,x,w,C]of p){let T=new yt;t.ustaw(T,M,x,0,w??0),T.add(g),e.add(T),n.push({x:M,z:x,r:.75,drzewo:g,skalaDrzewa:C||1});let E=Ca(2.2,.3);t.ustaw(E,M,x,0,0),e.add(E)}let _=s.glazy?s.glazy.map(g=>[g.pos[0],g.pos[1],g.skala??1,g.obrot]):[[-1.8,6.6,1.1],[3.1,3.4,.8],[-2.6,-4.6,1],[1.9,-5.4,.7],[-5.6,4,.9]];for(let[g,M,x,w]of _){let C=qf(x);t.ustaw(C,g,M,0,w??g*2.1),e.add(C),n.push({x:g,z:M,r:.55*x});for(let[T,E,z,F]of[[1.05,.62,.34,1.3],[-.78,1.02,.26,2.6],[.42,-.95,.3,.4]]){let y=qf(x*z,!0);t.ustaw(y,g+T*x,M+E*x,0,g+F),e.add(y)}}let m=qv(s.kwiaty,t,i);return m&&m.meshe.forEach(g=>e.add(g)),{group:e,ziemia:i,sciezki:r,lantern:u,gate:f,bridge:c,obrotMostu:l,blockers:n,kwiaty:m,nurtTik:o.tik}}var Kv=.95,Yv=.7;function za(s,t,e){let n=Math.min(1,Math.max(0,(s-t)/Math.max(1e-6,e-t)));return n*n*(3-2*n)}var Nr=null;function Zv(){if(Nr)return Nr;let s=document.createElement("canvas");s.width=s.height=128;let t=s.getContext("2d"),e=t.createRadialGradient(64,64,2,64,64,64);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.35,"rgba(255,255,255,0.5)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,128,128),Nr=new _e(s),Nr.colorSpace=qt,Nr}function jv(s,t=.24){let e=new Dt(new Jn(.4,.66,64),new le({color:s,transparent:!0,opacity:t,side:de,depthWrite:!1}));if(e.rotation.x=-Math.PI/2,e.position.y=.03,t<=0)return e;let n=new Jn(.4,.68,64),i=n.getAttribute("position"),r=i.count,o=new Float32Array(r*4),a=new Float32Array(r);for(let l=0;l<r;l++){o[l*4]=o[l*4+1]=o[l*4+2]=1,o[l*4+3]=0;let h=Math.atan2(i.getY(l),i.getX(l));a[l]=h<0?h+Math.PI*2:h}n.setAttribute("color",new Tt(o,4));let c=new Dt(n,new le({color:s,vertexColors:!0,transparent:!0,opacity:1,side:de,depthWrite:!1,blending:zn}));return c.position.z=.004,c.__katy=a,e.add(c),e.smuga=c,e}function $v(s,t,e){let n=s.smuga;if(!n)return;let i=n.geometry.getAttribute("color"),r=n.__katy,o=r.length,a=t*1.25%(Math.PI*2),c=1.35,l=Math.min(2.2,e);for(let h=0;h<o;h++){let u=(a-r[h])%(Math.PI*2);u<0&&(u+=Math.PI*2);let d=u<c?1-u/c:0;i.setW(h,d*d*d*.85*l)}i.needsUpdate=!0}var Pa=class{constructor(t,e,n=0,i){this.def=t,this.id=t.id,this.planeta=i,this.time=Math.random()*6.28,this.wake=0,this.punch=0,this.touches=0,this.state="idle",this.phase=0,this.fade=1,this.armed=!0,this.mapa={x:t.pos[0],z:t.pos[1]},this.n=i.normalna(t.pos[0],t.pos[1]),this.root=new yt,i.ustaw(this.root,t.pos[0],t.pos[1],n,0);let r=new Ae().setFromObject(e),o=new b;r.getSize(o);let a=.55*(t.scale??1)/Math.max(.001,o.y);e.scale.setScalar(a),r.setFromObject(e),e.position.sub(r.getCenter(new b)),this.mats=[],e.traverse(c=>{let l=c.material?Array.isArray(c.material)?c.material:[c.material]:[];for(let h of l)this.mats.push(h),(t.absorb||t.cykl>0)&&(h.transparent=!0,h.depthWrite=!0),h.metalness=t.metalness??0,h.roughness=t.roughness??.85,h.metalnessMap=null,h.roughnessMap=null,t.barwa!=null?h.color.setHex(t.barwa).multiplyScalar(t.jasnosc??1.35):t.wlasneKolory?h.color.multiplyScalar(t.jasnosc??1):h.color.setScalar(t.jasnosc??1.35),t.barwaMnoznik!=null&&(h.color.r*=(t.barwaMnoznik>>16&255)/255,h.color.g*=(t.barwaMnoznik>>8&255)/255,h.color.b*=(t.barwaMnoznik&255)/255),h.map&&(h.emissiveMap=h.map,h.emissive.setScalar(1),h.emissiveIntensity=0),h.needsUpdate=!0}),t.faceCamera&&(e.rotation.y=Math.atan2(.465,.885),e.rotation.x=-.5),this.spin=new yt,this.spin.position.y=t.height??1.1,this.spin.add(e),this.root.add(this.spin),this.haloBase=t.haloOpacity??.2,this.ringBase=t.ringOpacity??.22,this.lightBase=t.lightBase??2.2,this.halo=new Qe(new Ye({map:Zv(),color:t.glow,transparent:!0,opacity:this.haloBase,blending:zn,depthWrite:!1})),this.halo.scale.setScalar(t.haloScale??1.75),this.halo.position.y=t.height??1.1,this.root.add(this.halo),this.light=new un(t.glow,this.lightBase,6.5,2),this.light.position.y=(t.height??1.1)-.1,this.lightBase>0&&this.root.add(this.light),this.ring=jv(t.ringColor??t.glow,this.ringBase),this.root.add(this.ring),this.hit=new Dt(new Re(.85,10,8),new le({visible:!1})),this.hit.position.y=t.height??1.1,this.hit.userData.marker=this,this.root.add(this.hit),this.sparks=[]}update(t,e=1,n=99){this.time+=t,this.mixer&&this.mixer.update(t);let i=0,r=0,o=1;if(this.state==="absorb"){this.phase=Math.min(1,this.phase+t/Kv);let p=this.phase;i=(1-(1-p)*(1-p))*(this.def.absorbLift??1.7),o=1+.45*Math.sin(Math.min(1,p/.45)*Math.PI*.5)-1.05*za(p,.5,1),r=Math.sin(Math.min(1,p/.75)*Math.PI),this.fade=1-za(p,.42,.92),p>=1&&(this.state="gone",this.phase=0,this.setVisible(!1))}else if(this.state==="gone"){this.phase+=t;let p=(this.powroty?this.def.respawn:this.def.respawnPierwszy??this.def.respawn)??3.2;this.phase>=p&&(this.powroty=(this.powroty||0)+1,this.przenies(),this.state="appear",this.phase=0,this.setVisible(!0),this.def.cykl>0&&this.sparkBurst(this.def.iskry??18,this.def.iskrySila??1.35));return}else if(this.state==="appear"){this.phase=Math.min(1,this.phase+t/Yv);let p=this.phase;i=(1-p)*.55,o=.25+.75*za(p,0,1),r=Math.sin(p*Math.PI)*.7,this.fade=za(p,.05,.6),p>=1&&(this.state="idle",this.phase=0,this.fade=1)}this.state==="idle"&&this.def.cykl>0&&(this.phase+=t)>=this.def.cykl&&this.startAbsorb(!0);for(let p of this.mats)p.transparent&&(p.opacity=this.fade);n>(this.def.zbrojenie??1.7)&&(this.armed=!0);let a=n<3.2?1:0;this.wake+=(a-this.wake)*(1-Math.exp(-4*t)),this.punch=Math.max(0,this.punch-t*2.2);let c=this.punch*this.punch,l=this.def.bezUnoszenia?0:Math.sin(this.time*1.6)*(.09+.05*this.wake)*e;this.spin.position.y=(this.def.height??1.1)+l+(this.def.bezUnoszenia?0:c*.35)+i,this.def.faceCamera?this.spin.rotation.y=Math.sin(this.time*.9)*.38*e+c*1.6+r*1.1:this.def.bezObrotu?this.spin.rotation.y=this.def.obrotY??0:this.spin.rotation.y+=t*(.7+2.4*c);let h=this.def.oddechSkali??1,u=Math.max(0,(1+.08*this.wake*h+.4*c*(this.def.oddechDotyku??h))*o);if(this.spin.scale.setScalar(u),this.def.bujanie!=null)if(this.buj!=null)if((this.buj+=t)>2.6)this.buj=null,this.spin.rotation.z=0,this.spin.position.x=0;else{let p=this.def.bujanie*Math.exp(-1.5*this.buj)*Math.sin(7.5*this.buj),_=.275*(this.def.scale??1);this.spin.rotation.z=p,this.spin.position.x=-_*Math.sin(p),this.spin.position.y-=_*(1-Math.cos(p))}else this.spin.rotation.z=0,this.spin.position.x=0;let d=1+Math.sin(this.time*2.2)*.16,f=1+.45*this.wake+1.6*c+3.2*r;this.halo.position.y=this.spin.position.y,this.halo.scale.setScalar((this.def.haloScale??1.75)*d*f),this.halo.material.opacity=Math.min(1,this.haloBase*f),this.light.intensity=this.lightBase*d*f,this.ring.material.opacity=Math.min(1,this.ringBase*(.92+.5*(.5+.5*Math.sin(this.time*2.2)))*f),this.ring.scale.setScalar(1+.06*Math.sin(this.time*2.2)+.35*c+.5*r),$v(this.ring,this.time,f);for(let p=this.sparks.length-1;p>=0;p--){let _=this.sparks[p];_.userData.life-=t*1.4,_.userData.vel.y-=t*1.8,_.position.addScaledVector(_.userData.vel,t),_.material.opacity=Math.max(0,_.userData.life),_.userData.life<=0&&(this.root.remove(_),this.sparks.splice(p,1))}}touch(){return this.state!=="idle"||this.punch>.55||this.def.raz&&!this.armed?!1:(this.def.raz&&(this.armed=!1),this.punch=1,this.def.bujanie&&(this.buj=0),this.touches++,this.sparkBurst(12,1),!0)}startAbsorb(t=!1){return this.state!=="idle"||!t&&!this.armed?!1:(this.armed=!1,this.state="absorb",this.phase=0,this.punch=0,this.touches++,this.sparkBurst(this.def.iskry??18,this.def.iskrySila??1.35),!0)}get ready(){return this.state==="idle"}przenies(){let t=this.def._pozycje;if(!t||t.length<2)return;let e=t[Math.floor(Math.random()*t.length)];this.mapa={x:e[0],z:e[2]},this.planeta.normalna(e[0],e[2],this.n),this.planeta.ustaw(this.root,e[0],e[2],e[1],0)}ustawAktywny(t){this.aktywny!==t&&(this.aktywny=t,this.root.visible=t)}setVisible(t){if(this.spin.visible=t,this.halo.visible=t,this.light.visible=t,this.ring.visible=t,this.hit.visible=!1,this.hit.userData.off=!t,t)this.spin.scale.setScalar(.25);else{for(let e of this.sparks)this.root.remove(e);this.sparks.length=0,this.light.intensity=0,this.halo.material.opacity=0,this.ring.material.opacity=0}}sparkBurst(t,e){let n=new Re(.05,6,5);for(let i=0;i<t;i++){let r=new Dt(n,new le({color:this.def.glow,transparent:!0,opacity:1}));r.position.copy(this.spin.position);let o=i/t*Math.PI*2;r.userData={vel:new b(Math.cos(o)*e,1.2+Math.random()*.9,Math.sin(o)*e),life:1},this.root.add(r),this.sparks.push(r)}}get worldPos(){return this.mapa}};var $f=(s,t,e)=>s<t?t:s>e?e:s,Ur=(s,t,e)=>{let n=$f((e-s)/(t-s||1e-6),0,1);return n*n*(3-2*n)},Jv=(s,t,e,n)=>s+(t-s)*(1-Math.exp(-e*n)),Qv={niebo:{dzien:9423332,zorza:14256734,noc:2371911,silaZorzy:1,stopnie:[0,.16,.42,1],gradient:{dzien:{horyzont:14479095,nisko:11131120,srodek:7059172,zenit:4035542},poranek:{horyzont:16769976,nisko:16498592,srodek:15968702,zenit:10274020},zorza:{horyzont:16761963,nisko:16354923,srodek:14252966,zenit:8943784},noc:{horyzont:3039106,nisko:2573946,srodek:1781598,zenit:1253191}}},slonceTarcza:{rdzen:16776690,poswiataDzien:16771496,poswiataZorza:16751429,wielkosc:.95,rozmycieZorzy:.7,spowolnienieHoryzontu:.35,zasiegX:.93,szczyt:.48,zanurzenie:.05},ksiezyc:{barwa:16774876,wielkosc:1.15},ziemia:{dzien:16121830,zorza:16766634,noc:7445420,emisjaNoc:1195083,emisjaZorza:5588776},slonce:{dzien:16773327,zorza:16757598,moc:1.8},wypelnienie:{dzien:16773855,noc:9551331,mocDzien:.7,mocNoc:.8},hemisfera:{goraDzien:14214399,dolDzien:5600831,goraNoc:7711177,dolNoc:2376789,zorzaGora:16756848,mocDzien:1.05,mocNoc:.78},ambient:{dzien:8425664,noc:6851770,mocDzien:.3,mocNoc:.38},chmury:{dzien:16777215,zorza:16761763,noc:7902653,emisjaNoc:2308962},gwiazdy:{krycie:.85},progi:{dzienDo:52,zmierzchDo:98,nocOd:90,nocPelna:140,zorzaSrodek:90,zorzaSzerokosc:26.4},tempo:1.5};function tM(s,t){if(!t)return s;let e={};for(let n of Object.keys(s))e[n]=typeof s[n]=="object"&&s[n]!==null?{...s[n],...t[n]||{}}:t[n]??s[n];return e}var bn=new tt,we=new tt,eM=new tt,Or=new b,Zf=new b,jf=new b,Ia=new b,nM={x:0,y:0},iM={x:0,y:0};function sM(s="#fff6d8",t="#ffd98a"){let e=document.createElement("canvas");e.width=e.height=128;let n=e.getContext("2d"),i=n.createRadialGradient(64,64,0,64,64,64);i.addColorStop(0,s),i.addColorStop(.32,s),i.addColorStop(.46,t),i.addColorStop(1,"rgba(255,220,140,0)"),n.fillStyle=i,n.fillRect(0,0,128,128);let r=new _e(e);return r.colorSpace=qt,r}function rM(){let s=document.createElement("canvas");s.width=s.height=128;let t=s.getContext("2d");t.fillStyle="#fff6dc",t.beginPath(),t.arc(64,64,46,0,Math.PI*2),t.fill(),t.globalCompositeOperation="destination-out",t.beginPath(),t.arc(43,48,43,0,Math.PI*2),t.fill();let e=new _e(s);return e.colorSpace=qt,e}function oM(){let s=document.createElement("canvas");s.width=s.height=256;let t=s.getContext("2d"),e=t.createRadialGradient(128,128,0,128,128,128);e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.48,"rgba(255,255,255,1)"),e.addColorStop(.67,"rgba(255,255,255,.90)"),e.addColorStop(.82,"rgba(255,255,255,.36)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,256,256);let n=new _e(s);return n.colorSpace=qt,n}function aM(){let s=new yn({uniforms:{zenit:{value:new tt(2371911)},srodek:{value:new tt(2768739)},nisko:{value:new tt(2901616)},horyzont:{value:new tt(3099256)},stopnie:{value:new Kt(0,.16,.42,1)},srodekPlanety:{value:new Kt(0,0,1,1)},wysokoscNieba:{value:.4},noc:{value:0},aspekt:{value:1}},vertexShader:`
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
    `,depthTest:!1,depthWrite:!1,toneMapped:!1}),t=new Dt(new Dn(2,2),s);return t.frustumCulled=!1,t.renderOrder=-2e3,t.name="nieboskLon",t}var ka=class{constructor(t){this.C=tM(Qv,t.strojenie),this.scena=t.scena,this.slonce=t.slonce,this.wypelnienie=t.wypelnienie,this.hemisfera=t.hemisfera,this.ambient=t.ambient,this.gwiazdy=t.gwiazdy,this.ziemia=t.ziemia||null,this.slonceN=t.slonceN.clone().normalize(),this._sw=this.slonceN.clone(),this._orbita=new b,this.ustawSlonce(this.slonceN),this.faza=null,this.nieboskLon=aM(),this.scena.add(this.nieboskLon);let e=this.C,n=(i,r)=>{let o=new Qe(new Ye({map:i,transparent:!0,depthWrite:!1,opacity:0,toneMapped:!1}));return o.scale.setScalar(r),o.renderOrder=-1e3,o};this.rdzenSlonca=n(oM(),e.slonceTarcza.wielkosc),this.poswiata=n(sM("#ffffff","#ffffff"),e.slonceTarcza.wielkosc*2.2),this.tarczaKsiezyca=n(rM(),e.ksiezyc.wielkosc),this.t=null,this.stan={t:0,dzien:1,noc:0,zorza:0,pora:"dzien"}}podepnijDoKamery(t){t.add(this.rdzenSlonca,this.poswiata,this.tarczaKsiezyca),this.kamera=t}_sylwetka(t,e,n){Ia.set(0,0,0).project(t);let i=(this.promienPlanety||8)/e,r=(this.promienPlanety||8)/n;return{cx:Ia.x,cy:Ia.y,rx:i,ry:r,niebo:Math.max(.02,(1-Ia.y)/r-1)}}_wKadrze(t,e,n,i,r){t.position.set(e.dot(Or)*n*.78,i*(.54+.3*e.y),r)}ustawSlonce(t){this.slonceN.copy(t).normalize(),this._orbita.set(0,0,1).addScaledVector(this.slonceN,-this.slonceN.z),this._orbita.lengthSq()<1e-8&&this._orbita.set(1,0,0),this._orbita.normalize()}aktualizuj(t,e,n=.016){let i=this.C,r=-t.dot(this._orbita),o=t.dot(this.slonceN),a=Math.hypot(r,o)>1e-6?Math.atan2(r,o):this.faza??0;if(this.faza===null||this.t===null)this.faza=a;else{let M=Math.atan2(Math.sin(a-this.faza),Math.cos(a-this.faza));this.faza+=Jv(0,M,i.tempo,n)}let c=Math.atan2(Math.sin(this.faza),Math.cos(this.faza)),l=c+$f(i.slonceTarcza.spowolnienieHoryzontu,0,.45)*Math.sin(2*c),h=this.t=Math.cos(l),u=Math.abs(c)*180/Math.PI,d=1-Ur(i.progi.dzienDo,i.progi.zmierzchDo,u),f=Ur(i.progi.nocOd,i.progi.nocPelna,u),p=(u-i.progi.zorzaSrodek)/i.progi.zorzaSzerokosc,_=Math.exp(-p*p),m=1-Ur(-.2,.2,Math.sin(l));if(this.kamera&&this.kamera.matrixWorld.extractBasis(Or,Zf,jf),this._sw.set(Or.x,0,Or.z).normalize().multiplyScalar(Math.sin(l)),this._sw.y=h,this.slonce.position.copy(this._sw).multiplyScalar(30),this.slonce.intensity=i.slonce.moc*Math.max(d,_*.6),this.slonce.color.copy(bn.set(i.slonce.zorza)).lerp(we.set(i.slonce.dzien),d),this.wypelnienie.intensity=i.wypelnienie.mocNoc+(i.wypelnienie.mocDzien-i.wypelnienie.mocNoc)*d+_*(.5+.35*m),this.wypelnienie.color.copy(bn.set(i.wypelnienie.noc)).lerp(we.set(i.wypelnienie.dzien),d),this.hemisfera.intensity=i.hemisfera.mocNoc+(i.hemisfera.mocDzien-i.hemisfera.mocNoc)*d+_*.65,this.hemisfera.color.copy(bn.set(i.hemisfera.goraNoc)).lerp(we.set(i.hemisfera.goraDzien),d),i.hemisfera.zorzaGora&&this.hemisfera.color.lerp(we.set(i.hemisfera.zorzaGora),_*(1-.6*d)*.35),this.hemisfera.groundColor.copy(bn.set(i.hemisfera.dolNoc)).lerp(we.set(i.hemisfera.dolDzien),d),this.ambient.intensity=i.ambient.mocNoc+(i.ambient.mocDzien-i.ambient.mocNoc)*d,this.ambient.color.copy(bn.set(i.ambient.noc)).lerp(we.set(i.ambient.dzien),d),this.scena.background&&this.scena.background.copy(bn.set(i.niebo.noc)).lerp(we.set(i.niebo.dzien),d).lerp(we.set(i.niebo.zorza),_*(1-.55*d)*i.niebo.silaZorzy),this.nieboskLon){let M=this.nieboskLon.material.uniforms,x=_*(1-.55*d)*i.niebo.silaZorzy;M.noc.value=f,M.aspekt.value=this.kamera?(this.kamera.right-this.kamera.left)/(this.kamera.top-this.kamera.bottom):1;let w=i.niebo.gradient,C=i.niebo.stopnie;if(M.stopnie.value.set(C[0],C[1],C[2],C[3]),this.kamera&&this.promienPlanety){let T=this.kamera,E=(T.right-T.left)/2/(T.zoom||1),z=(T.top-T.bottom)/2/(T.zoom||1),F=this._sylwetka(T,E,z);M.srodekPlanety.value.set(F.cx,F.cy,F.rx,F.ry),M.wysokoscNieba.value=F.niebo}for(let T of["horyzont","nisko","srodek","zenit"])M[T].value.copy(bn.set(w.noc[T])).lerp(we.set(w.dzien[T]),d).lerp(we.set(w.zorza[T]).lerp(eM.set(w.poranek[T]),m),x)}if(this.ziemia?.material){let M=this.ziemia.material;M.color.copy(bn.set(i.ziemia.noc)).lerp(we.set(i.ziemia.dzien),d).lerp(we.set(i.ziemia.zorza),_*(1-.5*d)*.7),M.emissive&&M.emissive.copy(bn.set(0)).lerp(we.set(i.ziemia.emisjaNoc),f).lerp(we.set(i.ziemia.emisjaZorza),_*(1-d)*.6)}if(this.kamera){let M=this.kamera;M.matrixWorld.extractBasis(Or,Zf,jf);let x=(M.right-M.left)/2/(M.zoom||1),w=(M.top-M.bottom)/2/(M.zoom||1),C=this._sylwetka(M,x,w),T=S=>i.slonceTarcza.szczyt*Math.cos(S)-i.slonceTarcza.zanurzenie,E=(S,N)=>{let L=Math.sin(S)*i.slonceTarcza.zasiegX,B=1-Math.min(1,(L-C.cx)*(L-C.cx)/(C.rx*C.rx)),Z=C.cy+C.ry*Math.sqrt(Math.max(0,B));return N.x=L*x,N.y=(Z+Math.max(0,1-Z)*T(S))*w,N},z=E(l,nM),F=z.x;this.rdzenSlonca.position.set(z.x,z.y,-50),this.poswiata.position.set(z.x,z.y,-50.5),this.rdzenSlonca.material.opacity=Ur(-.52,-.2,h)*(.94-.12*d),this.rdzenSlonca.material.color.set(16771961).lerp(we.set(i.slonceTarcza.rdzen),d),this.rdzenSlonca.scale.setScalar(i.slonceTarcza.wielkosc*(1+.18*_)),this.poswiata.material.opacity=Math.max(d*.48,_*.46)*Ur(-.58,-.24,h),this.poswiata.material.color.copy(bn.set(i.slonceTarcza.poswiataZorza)).lerp(we.set(i.slonceTarcza.poswiataDzien),d),this.poswiata.scale.setScalar(i.slonceTarcza.wielkosc*(2.7+i.slonceTarcza.rozmycieZorzy*_));let y=E(l+Math.PI,iM);this.tarczaKsiezyca.position.set(y.x,y.y,-50),this.tarczaKsiezyca.material.opacity=f*.95,this.tarczaKsiezyca.visible=f>.02}for(let M of this.chmuryMaterialy||[])M.color.copy(bn.set(i.chmury.noc)).lerp(we.set(i.chmury.dzien),d).lerp(we.set(i.chmury.zorza),_*(1-.45*d)*.85),M.emissive&&M.emissive.copy(bn.set(i.chmury.emisjaNoc)).lerp(we.set(12900845),d).lerp(we.set(13014661),_*.75);if(this.gwiazdy){let M=i.gwiazdy.krycie*f;this.gwiazdy.material.opacity=M,this.gwiazdy.visible=M>.02}let g=f>.55?"noc":_>.35?m>.5?"poranek":"zmierzch":"dzien";return this.stan={t:h,dzien:d,noc:f,zorza:_,pora:g,faza:c,luk:l},g}};function cM(){let s=new en(1,2),t=new Jt().copy(s),e=t.getAttribute("position"),n=[],i=new tt(14478075),r=new tt(16776693),o=new tt;for(let a=0;a<e.count;a++){let c=Math.max(0,Math.min(1,(e.getY(a)+1)/2));o.copy(i).lerp(r,Math.sqrt(c)),n.push(o.r,o.g,o.b)}return t.setAttribute("color",new Tt(n,3)),t.computeVertexNormals(),t.computeBoundingSphere(),s.dispose(),t}var Jf=[[[0,0,.04,1.02,.27,.48],[-.68,.05,0,.54,.3,.39],[.67,.06,.01,.55,.31,.4],[-.34,.24,-.02,.52,.42,.42],[.16,.31,-.04,.62,.52,.48],[.57,.22,.02,.43,.36,.36]],[[0,0,.05,1.14,.25,.48],[-.8,.03,.01,.48,.27,.36],[.8,.04,.02,.49,.28,.37],[-.47,.23,-.02,.55,.4,.41],[.02,.28,-.05,.6,.47,.46],[.48,.27,-.01,.58,.43,.43],[.76,.18,.03,.35,.3,.32]],[[0,0,.06,.95,.27,.47],[-.62,.04,.02,.52,.29,.38],[.63,.05,.01,.52,.3,.39],[-.39,.23,-.02,.46,.38,.39],[.02,.34,-.06,.58,.55,.48],[.43,.27,-.03,.48,.43,.4],[-.12,.55,-.08,.36,.34,.34],[.66,.2,.03,.34,.29,.31]]],lM={ile:4,skalaOd:.4,skalaDo:.58,tempoOd:.022,tempoDo:.028,glebokosc:-45,rozstaw:1.45,rozsuwOd:.18,rozsuwDo:.95,pochylenie:1,pochylenieMaks:.85},La=class{constructor(t={}){let e=this.C={...lM,...t};this.grupa=new yt,this.grupa.name="chmury",this.material=new pe({vertexColors:!0,emissive:12900845,emissiveIntensity:.65,flatShading:!1}),this.geometria=cM();let n=20260912,i=()=>(n=n*16807%2147483647)/2147483647;this.sztuki=[];let r=0;for(let o=0;o<e.ile;o++){let a=Jf[o%Jf.length].map((l,h)=>({x:l[0]+(i()-.5)*.055,y:l[1]+(i()-.5)*.035,z:l[2]+(i()-.5)*.04,sx:l[3]*(.94+i()*.12),sy:l[4]*(.92+i()*.16),sz:l[5]*(.94+i()*.12),faza:i()*Math.PI*2,obrot:(i()-.5)*.18,indeks:r+h})),c=e.skalaOd+i()*(e.skalaDo-e.skalaOd);this.sztuki.push({wzor:a,skala:c,x:-e.rozstaw+(o+.5)*2*e.rozstaw/e.ile,postep:(o+.4)/e.ile,tempo:e.tempoOd+i()*(e.tempoDo-e.tempoOd),faza:i()*Math.PI*2}),r+=a.length}this.mesh=new Ne(this.geometria,this.material,r),this.mesh.name="zywe-obloki",this.mesh.frustumCulled=!1,this.mesh.instanceMatrix.setUsage(cf),this.grupa.add(this.mesh),this._czas=0,this._macierz=new At,this._pozycja=new b,this._skala=new b,this._obrot=new ln,this._kwaternion=new Ot,this._srodek=new b}podepnijDoKamery(t){t.add(this.grupa),this.kamera=t}aktualizuj(t,e,n=0){let i=this.kamera;if(!i)return;let r=Math.max(0,t);this._czas+=r;let o=this.C,a=(i.right-i.left)/2/(i.zoom||1),c=(i.top-i.bottom)/2/(i.zoom||1),l=this._srodek.set(0,0,0);i.worldToLocal(l);for(let h of this.sztuki){h.postep=(h.postep+r*h.tempo*(1+Math.min(2,Math.max(0,n))*.45))%1;let u=h.postep,d=u*u*(3-2*u),f=Math.min(1,u/.1),p=h.skala*Math.min(1,a/5.25)*2.35,_=p*(.16+1.18*d)*f,m=Math.sin(this._czas*.13+h.faza)*a*.026,g=h.x*a*(o.rozsuwOd+o.rozsuwDo*d)+m,M=.3*c+u*u*(.72*c+p*2.25),x=.78+.3*d,w=g-l.x,C=Math.max(.001,M-l.y),T=Math.max(-o.pochylenieMaks,Math.min(o.pochylenieMaks,Math.atan2(-w,C)*o.pochylenie)),E=Math.sin(T),z=Math.cos(T);for(let F of h.wzor){let y=this._czas*.34+F.faza,S=F.x+Math.sin(y)*.045+Math.sin(y*.47+h.faza)*.018,N=F.y+Math.cos(y*.81)*.025,L=F.z+Math.sin(y*.63)*.025,B=1+Math.sin(y*.73)*.055,Z=1+Math.cos(y*.59)*.045,H=1+Math.sin(y*.67+1.3)*.04,$=S*_*x,W=N*_;this._pozycja.set(g+$*z-W*E,M+$*E+W*z,this.C.glebokosc+d*10+L*_),this._skala.set(F.sx*_*B,F.sy*_*Z,F.sz*_*H),this._obrot.set(.06+Math.sin(y*.41)*.025,S*.055+Math.cos(y*.37)*.025,F.obrot+T+Math.sin(y*.29)*.025),this._kwaternion.setFromEuler(this._obrot),this._macierz.compose(this._pozycja,this._kwaternion,this._skala),this.mesh.setMatrixAt(F.indeks,this._macierz)}}this.mesh.instanceMatrix.needsUpdate=!0}};var hM={ile:3,barwa:16771488,promienOrbity:.62,wysokosc:.46,tempoOrbity:1.15,wielkoscKuli:.085,mocLatarni:2.6,zasiegLatarni:5.5},Fr=null;function uM(){if(Fr)return Fr;let s=document.createElement("canvas");s.width=s.height=64;let t=s.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.16,"rgba(255,253,240,1)"),e.addColorStop(.3,"rgba(255,236,170,0.78)"),e.addColorStop(1,"rgba(255,220,120,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),Fr=new _e(s),Fr.colorSpace=qt,Fr}var dM=new tt,Br=class{constructor(t,e={}){let n=this.C={...hM,...e};this.ile=0,this.t=0,this.grupa=new yt,this.grupa.name="swiatlo-bohatera",t.add(this.grupa),this.latarnia=new un(n.barwa,0,n.zasiegLatarni,2),this.latarnia.position.set(0,n.wysokosc,0),this.grupa.add(this.latarnia),this.kule=[];for(let i=0;i<n.ile;i++){let r=new yt,o=new Qe(new Ye({map:uM(),color:n.barwa,transparent:!0,blending:zn,depthWrite:!1,opacity:1,toneMapped:!1}));o.scale.setScalar(n.wielkoscKuli*9),r.add(o),r.visible=!1,r.scale.setScalar(.01),this.grupa.add(r),this.kule.push({obj:r,wejscie:0})}}dodaj(){if(this.ile>=this.C.ile)return!1;let t=this.kule[this.ile];return t.obj.visible=!0,t.wejscie=0,this.ile+=1,!0}oddaj(){let t=this.ile;this.ile=0;for(let e of this.kule)e.obj.visible=!1,e.wejscie=0;return t}get komplet(){return this.ile>=this.C.ile}aktualizuj(t){let e=this.C;this.t+=t;let n=Math.max(1,this.ile);for(let r=0;r<this.kule.length;r++){let o=this.kule[r];if(!o.obj.visible)continue;o.wejscie=Math.min(1,o.wejscie+t*1.6);let a=o.wejscie*o.wejscie*(3-2*o.wejscie),c=this.t*e.tempoOrbity*(Math.PI*2)/n+r*Math.PI*2/n,l=e.promienOrbity*(1+(1-a)*1.6);o.obj.position.set(Math.cos(c)*l,e.wysokosc+(1-a)*.9+Math.sin(this.t*2.1+r)*.045,Math.sin(c)*l),o.obj.scale.setScalar(a)}let i=this.ile/e.ile;this.latarnia.intensity=e.mocLatarni*i*i,this.latarnia.color.copy(dM.set(e.barwa))}};var ke={barwaGlowna:7122504,barwaGlownaCiemna:5147190,barwaPed:8834133,barwaPedCiemny:5543738,barwaSciezka:10146911,barwaSciezkaCiemna:6529082,barwaLisc:9424986,barwaLiscCiemny:7321160,barwaKwiat:16774876,barwaSrodek:16177003,gladkie:!0,krokiDojrzalosci:14,uSciezki:.55,skokSciezki:3},Qf=[{g:1,t0:0,start:0,om:1,zwezenie:.42},{g:.94,t0:0,start:.16,om:1,zwezenie:.38,sciezkowa:!0},{g:.88,t0:.04,start:.3,om:1.09,zwezenie:.44},{g:.82,t0:.11,start:.45,om:.91,zwezenie:.44},{g:.6,t0:.2,start:.62,om:1.18,zwezenie:.52}],dn=new b,tp=new b,Ks=new b,Da=new b(0,1,0),Na=new At,fM=new Ot,Hr=new b,fn=new b,Ze=new b,pM=new b(0,1,0),cu=new b,lu=new b,Ua=new b,Vr=(s,t={})=>new pe({color:s,flatShading:!0,...t}),be=(s,t=0,e=1)=>s<t?t:s>e?e:s,Oa=s=>s*s*(3-2*s);function mM(s){let t=(s*9301+49297)%233280;return()=>(t=(t*9301+49297)%233280)/233280}function hu(s,t,e){let n=new Ar;n.moveTo(0,0),n.bezierCurveTo(-s,t*.15,-s*1.05,t,0,1),n.bezierCurveTo(s*1.05,t,s,t*.15,0,0);let i=new oa(n,5),r=i.attributes.position;for(let o=0;o<r.count;o++){let a=r.getX(o),c=r.getY(o);r.setZ(o,-Math.abs(a)*e+Math.sin(c*Math.PI)*.09)}return i.computeVertexNormals(),i}function gM(){return[hu(.58,.62,.26),hu(.34,.55,.34),hu(.7,.78,.18)]}function _M(){let s=[],t=[],e=[],n=new tt(ke.barwaKwiat),i=new tt(ke.barwaSrodek),r=(c,l,h,u)=>(s.push(c,l,h),t.push(u.r,u.g,u.b),s.length/3-1),o=r(0,.02,0,i);for(let c=0;c<5;c++){let l=c/5*Math.PI*2,h=l+1.1,u=.06,d=.19,f=r(Math.cos(l)*u,0,Math.sin(l)*u,i),p=r(Math.cos((l+h)/2)*d,.035,Math.sin((l+h)/2)*d,n),_=r(Math.cos(h)*u,0,Math.sin(h)*u,i);e.push(o,f,_,f,p,_)}let a=new Jt;return a.setAttribute("position",new Tt(s,3)),a.setAttribute("color",new Tt(t,3)),a.setIndex(e),a.computeVertexNormals(),a}var Fa=class{constructor(t){this.H=t.H,this.obroty=t.obroty??2.6;let e=t.pnacza??(t.pedy!=null?t.pedy+1:this.H>6?5:4);this.ile=Math.max(2,Math.min(Qf.length,Math.round(e))),this.grubosc=t.grubosc??.18+.1*this.H,this.szerokoscSciezki=t.szerokoscSciezki??Math.max(.7,.1*this.H),this.u=0,this.krok=-1,this.ozdobyWidoczne=!0;let n=mM(t.ziarno??1);this.faza=[n()*6.28,n()*6.28,n()*6.28],this.rBaza=this.grubosc/(1+.36*this.ile),this.rSplotu=.36*this.ile*this.rBaza;let i=this.H/Math.max(1.3,this.szerokoscSciezki*ke.skokSciezki);this.obrotySciezki=Math.max(this.obroty*.85,i),this.dodatkoweObroty=Math.max(0,this.obrotySciezki-this.obroty),this.tabN=192,this.tab=new Float32Array(this.tabN+1);let r=0;for(let o=1;o<=this.tabN;o++)r+=this._tempo((o-.5)/this.tabN)/this.tabN;this.skalaSkretu=this.dodatkoweObroty/Math.max(1e-6,r),this.group=new yt,this.group.name="pnacze",this.matRura=Vr(16777215,{vertexColors:!0,flatShading:!ke.gladkie}),this.matLisc=Vr(16777215,{side:de}),this.matKwiat=Vr(16777215,{vertexColors:!0,side:de}),this.pnacza=[];for(let o=0;o<this.ile;o++)this._pnacze(o,n);this.sciezkowe=this.pnacza.find(o=>o.sciezkowa)||this.pnacza[0],this._ozdoby(n),this._przelicz(0),this.ustawWzrost(0)}os(t,e=new b){let n=.075*this.H,i=Oa(be(t/.12));return e.set(n*(Math.sin(t*2.3+this.faza[0])+.45*Math.sin(t*5.3+this.faza[2]))*i*t,t*this.H,n*(Math.cos(t*1.9+this.faza[1])+.45*Math.cos(t*4.1+this.faza[2]))*i*t)}promienSplotu(t){return this.rSplotu*(1-.34*t)*(1+.17*Math.sin(t*4.3+this.faza[1]))*(.62+.38*this.dojrzalosc)}promienPnacza(t,e){let n=be((e-t.t0)/Math.max(.001,1-t.t0)),i=.45+.55*Oa(be(n/.08)),r=1+.13*Math.sin(e*6.1+t.faza*3);return this.rBaza*t.g*(1-t.zwezenie*e)*r*(.15+.85*Math.pow(this.dojrzalosc,.8))*i}splaszczenie(t,e){return t.sciezkowa?be((this.frontSciezki-e)/.16):0}_tempo(t){return(.72+.62*t)*(1+.34*Math.sin(t*6+this.faza[2]))*(1+.16*Math.sin(t*13.7+this.faza[0]))}_przeliczSkret(){let t=this.tabN,e=this.sciezkowe,n=0;this.tab[0]=0;for(let i=1;i<=t;i++){let r=(i-.5)/t;n+=this.splaszczenie(e,r)*this._tempo(r)/t,this.tab[i]=n}}_skret(t){let e=be(t)*this.tabN,n=Math.min(this.tabN-1,Math.floor(e)),i=e-n;return this.tab[n]*(1-i)+this.tab[n+1]*i}kat(t,e){let n=t.faza+Math.PI*2*this.obroty*t.om*e+.13*Math.sin(e*5.1+t.faza);return t.sciezkowa&&(n+=Math.PI*2*this.skalaSkretu*this._skret(e)),n}promienOd(t,e){let n=this.promienSplotu(e),i=n*t.skalaR*(1+.26*Math.sin(e*Math.PI*2*this.obroty*.8+t.faza*2));if(t.sciezkowa){let r=this.splaszczenie(t,e);i+=r*(this.szerokoscSciezki*.34+n*.35)}return i}punkt(t,e,n=new b){let i=this.kat(t,e),r=this.promienOd(t,e);this.os(e,n);let o=t.szum;return n.x+=Math.cos(i)*r+o*Math.sin(e*3.1+t.faza*1.7),n.z+=Math.sin(i)*r+o*Math.cos(e*2.6+t.faza*2.4),n}styczna(t,e,n=new b){return this.punkt(t,Math.max(t.t0,e-.0035),cu),this.punkt(t,Math.min(1,e+.0035),lu),n.subVectors(lu,cu).normalize()}ramka(t,e,n=fn,i=Ze,r=Hr){return this.punkt(t,e,Ua),this.os(e,Ks),this.styczna(t,e,r),n.set(Ua.x-Ks.x,0,Ua.z-Ks.z),n.lengthSq()<1e-8&&n.set(1,0,0),n.addScaledVector(r,-n.dot(r)).normalize(),i.crossVectors(r,n).normalize(),i.y<0&&(i.negate(),n.negate()),Ua}_przekroj(t,e){let n=this.promienPnacza(t,e),i=this.splaszczenie(t,e);return i<=0?{w:n,h:n}:{w:n*(1-i)+this.szerokoscSciezki*.5*i,h:Math.max(n*(1-.55*i),this.szerokoscSciezki*.1*i)}}_pnacze(t,e){let n=Qf[t],i=1-n.t0,r={i:t,t0:n.t0,startU:n.start,om:n.om,g:n.g,zwezenie:n.zwezenie,sciezkowa:!!n.sciezkowa&&this.ile>=2,faza:t/this.ile*Math.PI*2+(e()-.5)*.5,szum:this.rSplotu*.18*(.6+e()*.8),skalaR:1,obwod:t===0?8:n.g>.7?7:6},o=i*(this.H+Math.PI*2*this.rSplotu*this.obroty);r.sciezkowa&&(o+=Math.PI*2*(this.rSplotu+this.szerokoscSciezki*.5)*this.dodatkoweObroty);let a=Math.round(be(o*7,28,170));r.sciezkowa&&(a=Math.round(Math.min(240,o*9)),r.obwod=8),r.N=a;let c=(a+1)*r.obwod,l=new Float32Array(c*3),h=new Float32Array(c*3),u=[];for(let m=0;m<a;m++)for(let g=0;g<r.obwod;g++){let M=m*r.obwod+g,x=(m+1)*r.obwod+g,w=(m+1)*r.obwod+(g+1)%r.obwod,C=m*r.obwod+(g+1)%r.obwod;u.push(M,x,C,x,w,C)}let d=new Jt;d.setAttribute("position",new Tt(l,3)),d.setAttribute("color",new Tt(h,3)),d.setIndex(u);let f=new Dt(d,this.matRura);f.castShadow=!0,f.frustumCulled=!1,r.mesh=f,r.pos=d.attributes.position.array,r.col=d.attributes.color.array,this.group.add(f),this.geoPaczka=this.geoPaczka||new Re(1,6,5),this.matCzubek=this.matCzubek||Vr(ke.barwaLisc);let p=new Dt(this.geoPaczka,this.matCzubek);p.scale.set(.8,2.1,.8);let _=new yt;_.add(p),_.castShadow=!0,r.czubek=_,this.group.add(_),this.pnacza.push(r)}_przelicz(t){this.dojrzalosc=t,this.frontSciezki=be((t-ke.uSciezki)/(1-ke.uSciezki))*1.18;for(let e of this.pnacza)e.skalaR=e.i===0?.18+.82*Oa(be((t-.1)/.45)):1;this._przeliczSkret();for(let e of this.pnacza)this._przeliczRure(e);this._przeliczOzdoby()}_przeliczRure(t){let{pos:e,col:n,N:i,obwod:r}=t,o=new tt(t.i===0?ke.barwaGlowna:ke.barwaPed),a=new tt(t.i===0?ke.barwaGlownaCiemna:ke.barwaPedCiemny),c=new tt(ke.barwaSciezka),l=new tt(ke.barwaSciezkaCiemna),h=t.i===0?.14:.3,u=0;for(let f=0;f<=i;f++){let p=t.t0+(1-t.t0)*(f/i),_=this.ramka(t,p,fn,Ze,Hr),m=this._przekroj(t,p),g=this.splaszczenie(t,p);for(let M=0;M<r;M++){let x=M/r*Math.PI*2,w=Math.cos(x),C=Math.sin(x);if(g>.05){let E=1-.52*g;w=Math.sign(w)*Math.pow(Math.abs(w),E),C=Math.sign(C)*Math.pow(Math.abs(C),E)}e[u]=_.x+m.w*w*fn.x+m.h*C*Ze.x,e[u+1]=_.y+m.w*w*fn.y+m.h*C*Ze.y,e[u+2]=_.z+m.w*w*fn.z+m.h*C*Ze.z;let T;g>.25?T=C>.25?c:l:T=(M+f*h)%r<r/2?o:a,n[u]=T.r,n[u+1]=T.g,n[u+2]=T.b,u+=3}}let d=t.mesh.geometry;d.attributes.position.needsUpdate=!0,d.attributes.color.needsUpdate=!0,d.computeVertexNormals(),d.computeBoundingSphere()}_ozdoby(t){this.ozdoby=[];let e=this.H,n=.38+.09*e,i=gM(),r=Math.round(be(6+e*.95,7,40)),o=Math.round(be(3+e*.6,4,18)),a=Math.round(be(3+e*.4,4,12)),c=[],l=this.pnacza.filter(p=>!p.sciezkowa);for(let p=0;p<r;p++){let _=l[p%l.length],m=(Math.floor(p/l.length)+.35+t()*.3)/Math.ceil(r/l.length);c.push({p:_,t:_.t0+(1-_.t0)*be(m,.04,.97)})}let h=p=>({p:this.pnacza[0],t:.098,kiel:!0,s:n*.82,obrot:p,tilt:.55,rol:0});c.unshift(h(1.57),h(-1.57)),this.liscie=i.map((p,_)=>{let m=Math.ceil(c.length/i.length)+1,g=new Ne(p,this.matLisc,m);return g.castShadow=!0,g.frustumCulled=!1,g.count=0,this.group.add(g),{im:g,uzyte:0}});let u=[new tt(ke.barwaLisc),new tt(ke.barwaLiscCiemny)];c.forEach((p,_)=>{let m=this.liscie[p.kiel?0:_%this.liscie.length],g=m.uzyte++;m.im.count=m.uzyte,m.im.setColorAt(g,u[!p.kiel&&t()<.42?1:0]);let M=p.t;this.ozdoby.push({im:m.im,i:g,p:p.p,t:M,s:p.s??n*(1-.42*M)*(.5+.5*Oa(be(M/.16)))*(.85+t()*.35),obrot:p.obrot??(_%2-.5)*1.7+(t()-.5)*.9,tilt:p.tilt??.22+t()*.5,rol:p.rol??(_%2?1:-1)*(.34+t()*.34),wysun:0,poz:new b,kw:new Ot,pop:-1})});for(let p of this.liscie)p.im.instanceColor&&(p.im.instanceColor.needsUpdate=!0);let d=new Ne(_M(),this.matKwiat,o);d.frustumCulled=!1,d.count=o,this.group.add(d),this.kwiaty=d;for(let p=0;p<o;p++){let _=l[p%l.length],m=be(.48+p/o*.5+(t()-.5)*.06,_.t0+.02,.98);this.ozdoby.push({im:d,i:p,p:_,t:m,s:1.2+.16*e,obrot:(t()-.5)*2.4,tilt:.55+t()*.6,wysun:.02,poz:new b,kw:new Ot,pop:-1})}let f=new Ne(new aa(.12,.022,4,10,Math.PI*1.6),Vr(ke.barwaPed),a);f.frustumCulled=!1,f.count=a,this.group.add(f),this.wasy=f;for(let p=0;p<a;p++){let _=l[p%l.length],m=be(.12+p/a*.8+(t()-.5)*.08,_.t0+.02,.97);this.ozdoby.push({im:f,i:p,p:_,t:m,s:(.8+.16*e)*(.7+t()*.6),obrot:(t()-.5)*3,tilt:.2+t()*.7,wysun:.01,poz:new b,kw:new Ot,pop:-1})}}_przeliczOzdoby(){for(let t of this.ozdoby){let e=this.ramka(t.p,t.t,fn,Ze,Hr);Ks.copy(fn).applyAxisAngle(Da,t.obrot);let n=cu.copy(Ks).multiplyScalar(Math.cos(t.tilt)).addScaledVector(Da,Math.sin(t.tilt)).normalize(),i=lu.crossVectors(n,Da);i.lengthSq()<1e-6?i.set(1,0,0):i.normalize();let r=dn.crossVectors(i,n).normalize();Na.makeBasis(i,n,r),t.kw.setFromRotationMatrix(Na),t.rol&&t.kw.multiply(fM.setFromAxisAngle(pM,t.rol)),t.poz.copy(e).addScaledVector(Ks,this.promienPnacza(t.p,t.t)*.85+t.wysun),t.pop=-1}}ustawWzrost(t){t=this.u=be(t);let e=Math.round(t*ke.krokiDojrzalosci);e!==this.krok&&(this.krok=e,this._przelicz(e/ke.krokiDojrzalosci));for(let i of this.pnacza){let r=be((t-i.startU)/Math.max(.02,1-i.startU));i.front=i.startU>0?Math.pow(r,.72):r,i.tHead=i.t0+(1-i.t0)*i.front;let o=Math.floor(i.front*i.N);if(i.mesh.geometry.setDrawRange(0,o*i.obwod*6),i.mesh.visible=o>0,i.czubek.visible=i.front>.004&&i.front<.999,i.czubek.visible){let a=this.punkt(i,i.tHead,dn);i.czubek.position.copy(a),this.styczna(i,i.tHead,tp),i.czubek.quaternion.setFromUnitVectors(Da,tp),i.czubek.scale.setScalar(Math.max(.001,this.promienPnacza(i,i.tHead)*.88))}}let n=new Set;for(let i of this.ozdoby){let r=this.ozdobyWidoczne?be((i.p.tHead-i.t)/.05):0;if(Math.abs(r-i.pop)<.004)continue;i.pop=r;let o=r<=0?1e-4:(r<.6?r/.6*1.16:1.16-(r-.6)/.4*.16)*i.s;Na.compose(i.poz,i.kw,dn.setScalar(Math.max(1e-4,o))),i.im.setMatrixAt(i.i,Na),n.add(i.im)}for(let i of n)i.instanceMatrix.needsUpdate=!0}get wysokosc(){return this.u*this.H}get widocznePnacza(){return this.pnacza.filter(t=>t.front>.01).length}sciezka(t,e=0){let n=this.sciezkowe,i=be(t,n.t0,1),r=this.ramka(n,i,fn,Ze,Hr),o=this._przekroj(n,i);return dn.copy(r).addScaledVector(Ze,o.h*.92).addScaledVector(fn,e),{kat:Math.atan2(dn.z,dn.x),r:Math.hypot(dn.x,dn.z),h:dn.y,os:[0,0]}}kolizja(t=48){let e=this.sciezkowe,n=[],i=[],r=[];for(let o=0;o<=t;o++){let a=e.t0+(1-e.t0)*(o/t),c=this.ramka(e,a,fn,Ze,Hr),l=this._przekroj(e,a);n.push(c.x+Ze.x*l.h*.92,c.y+Ze.y*l.h*.92,c.z+Ze.z*l.h*.92),i.push(fn.x,fn.y,fn.z),r.push(Ze.x,Ze.y,Ze.z)}return{os:n,bok:i,gora:r,szerokosc:this.szerokoscSciezki,probek:t}}siatkaKolizji(t=40){let e=this.kolizja(t),n=[],i=[],r=e.szerokosc*.5;for(let a=0;a<=t;a++){let c=a*3;n.push(e.os[c]-e.bok[c]*r,e.os[c+1]-e.bok[c+1]*r,e.os[c+2]-e.bok[c+2]*r),n.push(e.os[c]+e.bok[c]*r,e.os[c+1]+e.bok[c+1]*r,e.os[c+2]+e.bok[c+2]*r)}for(let a=0;a<t;a++){let c=a*2;i.push(c,c+2,c+1,c+1,c+2,c+3)}let o=new Jt;return o.setAttribute("position",new Tt(n,3)),o.setIndex(i),o.computeVertexNormals(),o}przeszkodaSplotu(t=10){let e=[];for(let n=0;n<=t;n++){let i=n/t;this.os(i,dn),e.push({x:dn.x,y:dn.y,z:dn.z,r:this.promienSplotu(i)+this.rBaza*1.15})}return e}pokazOzdoby(t){this.ozdobyWidoczne=!!t;for(let e of this.ozdoby)e.pop=-1;this.ustawWzrost(this.u)}stan(){return{u:+this.u.toFixed(3),pnaczy:this.pnacza.length,widoczne:this.widocznePnacza,splaszczenie:+be(this.frontSciezki).toFixed(3),krok:this.krok,rysunkow:this.group.children.filter(t=>t.visible).length,trojkatow:this.pnacza.reduce((t,e)=>t+e.N*e.obwod*2,0)}}zniszcz(){this.group.traverse(t=>{t.geometry&&t.geometry.dispose()});for(let t of[this.matRura,this.matLisc,this.matKwiat,this.matCzubek])t.dispose()}};var Ys={barwaLodygi:7321674,barwaLodygiCiemna:5214006,barwaLisc:9292890,barwaZiarno:12182378,barwaZiemia:8018492,barwaKwiat:16774876,czasWzrostu:1.4,czasWspinaczki:5.6,odstepWspinaczki:.04},uu=s=>new pe({color:s,flatShading:!0});function du(s,t,e=[0,0,0],n=[0,0,0],i=1){let r=new Dt(s,t);return r.position.set(...e),r.rotation.set(...n),r.scale.setScalar(i),r.castShadow=!0,r}function yM(s=.55){let t=new yt,e=du(new Re(s,10,7),uu(Ys.barwaZiemia),[0,-s*.52,0]);e.scale.set(1.3,.5,1.22),t.add(e);for(let n=0;n<7;n++){let i=n/7*Math.PI*2+.4,r=s*(.72+n%3*.13),o=s*(.1+n%4*.032),a=du(new en(o,0),uu(n%2?9071174:7164466),[Math.cos(i)*r,s*.02,Math.sin(i)*r],[.4+n,.9*n,.2]);a.scale.set(1.15,.65,1),t.add(a)}return t}function xM(s=.45){let t=new yt,e=s,n=du(new Re(e*.5,8,6),uu(Ys.barwaZiarno),[0,e*.42,0],[.3,.2,.5]);return n.scale.set(1.35,.85,.95),t.add(n),t}var Gr=null;function vM(){if(Gr)return Gr;let s=document.createElement("canvas");s.width=s.height=64;let t=s.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.3,"rgba(200,240,255,0.9)"),e.addColorStop(1,"rgba(120,200,255,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),Gr=new _e(s),Gr.colorSpace=qt,Gr}function MM(s,t,e,n,i,r,o=6,a=44){let c=[],l=[],h=[];for(let p=0;p<=o;p++)h.push(n+(i-n)*(p/o));let u=-1;n===0&&(c.push(0,r(0)+0,0),u=0,h.shift());let d=c.length/3;for(let p=0;p<h.length;p++){let _=h[p];for(let m=0;m<a;m++){let g=m/a*Math.PI*2,M=_*s*t(g),x=Math.cos(g)*M,w=Math.sin(g)*M,C=Math.sqrt(Math.max(0,e*e-x*x-w*w))-e+r(_);c.push(x,C,w)}}if(u>=0)for(let p=0;p<a;p++)l.push(0,d+(p+1)%a,d+p);for(let p=0;p+1<h.length;p++)for(let _=0;_<a;_++){let m=d+p*a+_,g=d+p*a+(_+1)%a,M=m+a,x=g+a;l.push(m,x,M,m,g,x)}let f=new Jt;return f.setAttribute("position",new Tt(c,3)),f.setIndex(l),f.computeVertexNormals(),f}var wM={glebokosc:.11};function ep(s,t){let e=s.promien??1.4,n=s.ziarno??1,i=Aa(n),r=t.R,o=new yt;o.name="oczko";let a=s.glebokosc??wM.glebokosc,c=new Dt(MM(e,i,r,0,1.02,()=>-a+.05,5),new pe({color:6276318,emissive:1731208,emissiveIntensity:.35,transparent:!0,opacity:.92}));o.add(c);let l=[];for(let u=0;u<3;u++){let d=new Dt(new Jn(e*.2,e*.24,32),new le({color:14677759,transparent:!0,opacity:.35,side:de,depthWrite:!1}));d.rotation.x=-Math.PI/2,d.position.y=-a+.055,d.userData.faza=u/3,o.add(d),l.push(d)}t.ustaw(o,s.pos[0],s.pos[1],0,0);let h=t.normalna(s.pos[0],s.pos[1]);return{mesh:o,n:h,promien:e,tik(u){for(let d of l){d.userData.faza=(d.userData.faza+u*.28)%1;let f=d.userData.faza,p=.35+f*3.6;d.scale.set(p,p,1),d.material.opacity=.42*(1-f)*(1-f)}}}}var Ba=class{constructor(t,e,n){this.def=t,this.planeta=e,this.etap=0,this.rosnie=null,this.czas=Math.random()*10,this.n=e.normalna(t.pos[0],t.pos[1]),this.root=new yt,this.root.name="fasola",e.ustaw(this.root,t.pos[0],t.pos[1],0,t.obrot??0);let i=[.45,.9,1.9,3.2,5.5];if(this.etapy=(t.etapy||[]).map((o,a)=>({def:o,wysokosc:o.wysokosc??i[a]??1})),!this.etapy.length)for(let o=0;o<5;o++)this.etapy.push({def:{},wysokosc:i[o]});this.H=this.etapy[this.ostatni].wysokosc,this.cele=this.etapy.map((o,a)=>a===0?0:Math.min(1,o.wysokosc/this.H));let r=t.pnacze||{};this.pnacze=new Fa({H:this.H,obroty:r.obroty,pnacza:r.pnacza,pedy:r.pedy,grubosc:r.grubosc,szerokoscSciezki:r.szerokosc,ziarno:r.ziarno??1}),this.u=0,this.root.add(this.pnacze.group),this.kopczyk=yM(Math.max(.45,this.pnacze.grubosc*.95)),this.kopczyk.scale.setScalar(.4),this.root.add(this.kopczyk),this.ziarno=new yt,this.root.add(this.ziarno),this.halo=new Qe(new Ye({map:vM(),color:12582864,transparent:!0,opacity:0,blending:zn,depthWrite:!1,toneMapped:!1})),this.halo.scale.setScalar(1.6),this.halo.position.y=.35,this.root.add(this.halo),this.swiatlo=new un(12582832,0,5,2),this.swiatlo.position.y=.6,this.root.add(this.swiatlo),this.rozbryzgi=[],this.gotowe=this._wczytajZiarno(n)}async _wczytajZiarno(t){let e=this.etapy[0],n=null;if(e.def.file&&t)try{n=(await t(e.def.file)).scene;let o=new Ae().setFromObject(n),a=new b;o.getSize(a),n.scale.setScalar(e.wysokosc/Math.max(.001,a.y)),o.setFromObject(n);let c=o.getCenter(new b);n.position.set(-c.x,-o.min.y-e.wysokosc*.22,-c.z),n.traverse(l=>{l.isMesh&&(l.castShadow=!0)})}catch{console.warn("[fasola] brak modelu ziarna",e.def.file,"\u2014 bry\u0142a zast\u0119pcza"),n=null}let i=n||xM(e.wysokosc);n||(i.position.y-=e.wysokosc*.18),this.ziarno.add(i),this.ziarno.visible=this.etap===0}get ostatni(){return this.etapy.length-1}get gotowa(){return this.etap>=this.ostatni&&!this.rosnie}get wysokosc(){return this.etap===0&&!this.rosnie?this.etapy[0].wysokosc:this.pnacze.wysokosc}sciezka(t){let e=this.pnacze.sciezka(t,Ys.odstepWspinaczki);return{kat:e.kat-(this.def.obrot??0),r:e.r,h:e.h}}podlej(){return this.rosnie||this.etap>=this.ostatni?!1:(this.rosnie={t:0,od:this.etap,do:this.etap+1},this._rozbryzg(16),!0)}_rozbryzg(t){let e=new Re(.05,6,5);for(let n=0;n<t;n++){let i=new Dt(e,new le({color:10478847,transparent:!0,opacity:1}));i.position.set(0,.35,0);let r=n/t*Math.PI*2;i.userData={vel:new b(Math.cos(r)*(.6+Math.random()*.8),1.4+Math.random()*1.2,Math.sin(r)*(.6+Math.random()*.8)),life:1},this.root.add(i),this.rozbryzgi.push(i)}}update(t,e=99){if(this.czas+=t,this.rosnie){let o=this.rosnie;o.t=Math.min(1,o.t+t/Ys.czasWzrostu);let a=this.cele[o.od],c=this.cele[o.do];if(o.od===0){let f=Math.min(1,o.t/.35);this.ziarno.visible=f<1,this.ziarno.scale.setScalar(Math.max(.001,1-f))}let l=o.od===0?Math.max(0,(o.t-.25)/.75):o.t,h=l<.75?l/.75:1,u=h*h*(3-2*h),d=l<.75?0:Math.sin((l-.75)/.25*Math.PI)*.04;this.u=a+(c-a)*u+(c-a)*d,this.pnacze.ustawWzrost(this.u),o.t>=1&&(this.etap=o.do,this.rosnie=null,this.u=c,this.pnacze.ustawWzrost(this.u))}if(this.kopczyk){let o=.4+.6*(this.u*this.u*(3-2*this.u));this.kopczyk.scale.setScalar(o)}!this.rosnie&&this.etap>0&&(this.pnacze.group.rotation.z=Math.sin(this.czas*1.3)*.02,this.pnacze.group.rotation.x=Math.cos(this.czas*1.1)*.015);let n=Math.max(0,1-e/6),i=this.gotowa?.55:.22,r=.6+.4*Math.sin(this.czas*2.2);this.halo.material.opacity=i*n*r,this.swiatlo.intensity=(this.gotowa?2.2:.6)*n*r;for(let o=this.rozbryzgi.length-1;o>=0;o--){let a=this.rozbryzgi[o];a.userData.life-=t*1.1,a.userData.vel.y-=t*3.2,a.position.addScaledVector(a.userData.vel,t),a.material.opacity=Math.max(0,a.userData.life),a.userData.life<=0&&(this.root.remove(a),this.rozbryzgi.splice(o,1))}}};var bM={ile:34,progBiegu:2.2,odstep:.07,zycie:.62,wielkoscOd:.16,wielkoscDo:.72,krycie:.9,wysokosc:.06,wznoszenie:.34,zostawanie:.34,rozrzutOdlotu:[.55,1.5],rozrzutBoczny:.6,rozrzutSkali:[.62,1.45],rozrzutZycia:[.72,1.34],rozrzutOdstepu:[.5,1.7],rozrzutWzdluz:.3,rozrzutWznoszenia:[.6,1.5],barwaDzien:16776694,barwaNoc:10467028},Wr=null;function SM(){if(Wr)return Wr;let s=document.createElement("canvas");s.width=s.height=64;let t=s.getContext("2d");for(let[e,n,i,r]of[[30,34,22,.9],[40,28,16,.7],[24,26,13,.6]]){let o=t.createRadialGradient(e,n,0,e,n,i);o.addColorStop(0,`rgba(255,255,255,${r})`),o.addColorStop(.55,`rgba(255,255,255,${r*.45})`),o.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=o,t.fillRect(0,0,64,64)}return Wr=new _e(s),Wr.colorSpace=qt,Wr}var fu=new b,pu=new b,AM=new tt,TM=new tt,Ha=class{constructor(t,e,n={}){let i=this.C={...bM,...n};this.planeta=e,this.grupa=new yt,this.grupa.name="dymki",t.add(this.grupa),this.material=new Ye({map:SM(),color:i.barwaDzien,transparent:!0,depthWrite:!1,opacity:i.krycie,toneMapped:!1}),this.sztuki=[];for(let r=0;r<i.ile;r++){let o=new Qe(this.material.clone());o.visible=!1,o.renderOrder=2,this.grupa.add(o),this.sztuki.push({sprite:o,zycie:0,n:new b,tyl:new b,skala:1,tempoZycia:1,wznosi:1,krycie:i.krycie})}this.nastepny=0,this.doWyrzutu=0,this._poprzednia=null,this.predkosc=0,this._ziarno=1013904223,this.los=()=>(this._ziarno=this._ziarno*16807%2147483647)/2147483647}aktualizuj(t,e,n,i){let r=this.C,o=this.planeta.R;if(this._poprzednia&&t>1e-4?this.predkosc=this.planeta.odleglosc(this._poprzednia,e)/t:this._poprzednia=new b,this._poprzednia.copy(e),this.predkosc>r.progBiegu)for(this.doWyrzutu-=t;this.doWyrzutu<=0;){let c=r.rozrzutOdstepu;this.doWyrzutu+=r.odstep*(c[0]+this.los()*(c[1]-c[0])),this._wyrzuc(e,n)}else this.doWyrzutu=0;let a=AM.set(r.barwaNoc).lerp(TM.set(r.barwaDzien),i?i.dzien:1);for(let c of this.sztuki){if(!c.sprite.visible)continue;if(c.zycie+=t/r.zycie*c.tempoZycia,c.zycie>=1){c.sprite.visible=!1;continue}let l=c.zycie,h=1-(1-l)*(1-l);c.sprite.scale.setScalar((r.wielkoscOd+(r.wielkoscDo-r.wielkoscOd)*h)*c.skala),c.sprite.material.opacity=c.krycie*(1-l*l),c.sprite.material.color.copy(a),fu.copy(c.n).multiplyScalar(o+r.wysokosc+r.wznoszenie*c.wznosi*h),fu.addScaledVector(c.tyl,r.zostawanie*h),c.sprite.position.copy(fu)}}_wyrzuc(t,e){let n=this.C,i=this.los,r=l=>l[0]+i()*(l[1]-l[0]),o=this.sztuki[this.nastepny];this.nastepny=(this.nastepny+1)%this.sztuki.length,o.zycie=0,o.sprite.visible=!0,o.skala=r(n.rozrzutSkali),o.tempoZycia=1/r(n.rozrzutZycia),o.wznosi=r(n.rozrzutWznoszenia),o.krycie=n.krycie*(.7+i()*.5),o.sprite.material.rotation=i()*Math.PI*2,pu.crossVectors(t,e).normalize();let a=(i()*2-1)*n.rozrzutBoczny,c=(i()*2-1)*n.rozrzutWzdluz;o.n.copy(t).addScaledVector(pu,a/this.planeta.R).addScaledVector(e,c/this.planeta.R).normalize(),o.tyl.copy(e).multiplyScalar(-1).addScaledVector(pu,(i()*2-1)*.9).normalize().multiplyScalar(r(n.rozrzutOdlotu)),o.sprite.material.opacity=o.krycie}};var Va=typeof matchMedia<"u"&&matchMedia("(pointer:coarse)").matches,Ka=1.75,Ei=1.38,mu=3.42,Xr="walk",Zi="run",Zs="clip",EM=1.46,RM=1.37,np=2.6,Ga=.13,Wa=-.375,ip=.55,gu=.14,sp=.45,rp=1.6,op=1.25,CM=1.7,ap=.3,zM=1.62,PM=.06,IM=.42,kM=.3,_u=1,yu=1.3,Xa=2.1,cp=.517*Ka,lp=1.33*Ka,LM=new Set(["Root","Hip","Pelvis"]),hp={ArrowUp:[0,1],KeyW:[0,1],ArrowDown:[0,-1],KeyS:[0,-1],ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0]},DM={NlaTrack:"walk","NlaTrack.001":"run","NlaTrack.002":"idle","NlaTrack.003":"happy"},NM=3.2,UM=.45,OM=1.1,FM=.8,BM=.573,HM=.5,VM=.596,up=-.182,GM=.127,WM=.218,XM=.47,dp=3.2,qM=7.5,KM=.45,YM=5.5,ZM=.22,Ve=(s,t,e)=>Math.max(t,Math.min(e,s)),qa=(s,t,e,n)=>s+(t-s)*(1-Math.exp(-e*n));function jM(s,t=.1){let e=[];for(let n of s.tracks){if(!n.name.endsWith(".position")||!LM.has(n.name.split(".")[0]))continue;let i=n.times.length;if(i<2)continue;let r=n.times[0],o=n.times[i-1]-r||1;for(let a=0;a<3;a++){let c=n.values[(i-1)*3+a]-n.values[a];if(!(Math.abs(c)<t)){for(let l=0;l<i;l++)n.values[l*3+a]-=c*((n.times[l]-r)/o);e.push(`${n.name}[${"xyz"[a]}]=${c.toFixed(2)}`)}}}return e}function $M(s,t=.3){let e=n=>n*n*(3-2*n);for(let n of s.tracks){let i=n.times.length;if(i<4)continue;let r=n.name.endsWith(".quaternion"),o=r?4:n.values.length/i,a=n.values.slice(0,o),c=n.values.slice((i-1)*o),l=0;for(let u=0;u<o;u++)l+=(a[u]-c[u])**2;if(Math.sqrt(l)<1e-4)continue;let h=Math.max(1,Math.floor(i*(1-t)));if(r){let u=new Ot(a[0],a[1],a[2],a[3]),d=new Ot(c[0],c[1],c[2],c[3]),f=u.clone().multiply(d.clone().invert()),p=new Ot,_=new Ot,m=new Ot;for(let g=h;g<i;g++){let M=e((g-h)/(i-1-h));_.copy(p).slerp(f,M),m.fromArray(n.values,g*4).premultiply(_).normalize(),m.toArray(n.values,g*4)}}else for(let u=h;u<i;u++){let d=e((u-h)/(i-1-h));for(let f=0;f<o;f++)n.values[u*o+f]+=(a[f]-c[f])*d}}return s}var ri=globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches??!1;function JM(s){let e=[],n=s.clone().normalize(),i=7,r=()=>(i=i*16807%2147483647)/2147483647;for(;e.length<700*3;){let c=new b(r()*2-1,r()*2-1,r()*2-1);c.lengthSq()>1||c.lengthSq()<.05||(c.normalize(),!(c.dot(n)>-.15)&&(c.multiplyScalar(70+r()*20),e.push(c.x,c.y,c.z)))}let o=new Jt;o.setAttribute("position",new Tt(e,3));let a=new Us(o,new Gi({color:16773839,size:2.2,sizeAttenuation:!1,transparent:!0,opacity:.85}));return a.frustumCulled=!1,a}var Ya=class{constructor(t,e={}){this.host=t,this.opts=e,this.listeners=new Map,this.destroyed=!1,this.paused=!1,typeof e.spokojnyRuch=="boolean"&&(ri=e.spokojnyRuch),this.mapa=Df(),this.planeta=new Ai(this.mapa.promienKuli),this.canvas=this.$("canvas"),this.renderer=new qo({canvas:this.canvas,antialias:!Va}),this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,Va?1.5:2)),this.renderer.outputColorSpace=qt,this.renderer.toneMapping=ch,this.renderer.toneMappingExposure=this.mapa.ekspozycja,this.scene=new Ko,this.scene.background=new tt(wn.night),this.hemisfera=new ua(14214399,5600831,1.05),this.scene.add(this.hemisfera),this.slonce=new qi(16769200,1.6),this.slonce.position.set(-6,12,4),this.scene.add(this.slonce),this.ambient=new fa(8425664,.35),this.scene.add(this.ambient),this.wypelnienie=new qi(16773855,.85),this.wypelnienie.position.set(5,7,9),this.scene.add(this.wypelnienie),this.camera=new yi(-1,1,1,-1,.1,160),this.camDir=new b(4.2,11.5,8).normalize().multiplyScalar(26),this.camTarget=new b(0,this.planeta.R*(1+up),0),this.camPos=new b,this.gwiazdy=JM(this.camDir),this.scene.add(this.gwiazdy),this.doba=this.mapa.doba.wlaczona?new ka({scena:this.scene,slonce:this.slonce,wypelnienie:this.wypelnienie,hemisfera:this.hemisfera,ambient:this.ambient,gwiazdy:this.gwiazdy,slonceN:this.planeta.normalna(this.mapa.doba.nad[0],this.mapa.doba.nad[1]),strojenie:this.mapa.doba.strojenie}):null,this._pora=null,this.chmury=this.mapa.chmury>0?new La({ile:this.mapa.chmury}):null,(this.doba||this.chmury)&&this.scene.add(this.camera),this.doba&&(this.doba.podepnijDoKamery(this.camera),this.doba.promienPlanety=this.planeta.R),this.chmury&&(this.chmury.podepnijDoKamery(this.camera),this.doba&&(this.doba.chmuryMaterialy=[this.chmury.material])),this.formy=Ta(this.mapa);let n=Yf(this.mapa,this.planeta);if(this.swiat=n.group,this.ziemia=n.ziemia,this.scene.add(this.swiat),this.lantern=n.lantern,this.blockers=n.blockers,this.doba&&(this.doba.ziemia=this.ziemia),this.mapa.cienie){this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=oh,this.slonce.castShadow=!0;let o=this.slonce.shadow;o.mapSize.set(Va?1024:2048,Va?1024:2048),o.camera.left=-14,o.camera.right=14,o.camera.top=14,o.camera.bottom=-14,o.camera.near=2,o.camera.far=62,o.normalBias=.05,o.bias=-4e-4,this.ziemia&&(this.ziemia.receiveShadow=!0),this.swiat.traverse(a=>{a.isMesh&&a!==this.ziemia&&(a.castShadow=!0,a.receiveShadow=!0)})}this.kwiaty=n.kwiaty,this.zasiewWlaczony=this.mapa.zasiew,this._zasiewOstatnia=null,this._zasiewDroga=0,this.nurtTik=n.nurtTik,this.oczko=this.mapa.oczko?ep(this.mapa.oczko,this.planeta):null,this.oczko&&this.swiat.add(this.oczko.mesh),this.fasola=this.mapa.fasola?new Ba(this.mapa.fasola,this.planeta,o=>this.loadGLB(o)):null,this.fasola&&this.swiat.add(this.fasola.root);let i=new Ot().setFromAxisAngle(new b(0,1,0),n.obrotMostu);this.bridgeInv=new At().compose(new b(this.mapa.most.pos[0],0,this.mapa.most.pos[1]),i,new b(1,1,1)).invert(),this.groundY=0,this.footOffset=0,this.marker=new Dt(new Jn(.28,.4,24),new le({color:16773839,transparent:!0,opacity:0,side:de})),this.marker.rotation.x=-Math.PI/2,this.marker.position.y=.05,this.markerKotwica=new yt,this.markerKotwica.add(this.marker),this.swiat.add(this.markerKotwica),this.markerPulse=0,this.sparkles=[],this.sparkleGrupa=new yt,this.planeta.ustaw(this.sparkleGrupa,this.mapa.latarnia.pos.x,this.mapa.latarnia.pos.z,0,0),this.swiat.add(this.sparkleGrupa),this.hn=new b(0,1,0),this.hf=new b(0,0,1),this.hp={x:0,z:0},this.heroLift=0,this.obrotCel=new Ot,this._qTmp=new Ot,this._v1=new b,this._v2=new b,this._v3=new b,this.rzeka3d=Ws(this.mapa.rzeka.punkty,this.mapa.promienTresci).map(o=>o.map(a=>this.planeta.naKule(a.x,a.y,0))),this.latarniaN=this.planeta.normalna(this.mapa.latarnia.pos.x,this.mapa.latarnia.pos.z),this.ograniczenieMapy=!!this.mapa.surowa?.swiat?.tylkoMapa,this.heroT=0,this.targetT=0,this.walking=!1,this.celebrated=!1,this.sequence=null,this.seqTimer=0,this.mode="goto",this.input=new it(0,0),this.keys=new Set,this.stick=null,this.inputSource=null,this.holdTime=0,this.holdDir=null,this.running=!1,this.idleAtLantern=0,this.camRight=new b,this.camFwd=new b,this.raycaster=new Bs,this.clock=new ma;let r=this.mapa.sciezka;this.odcinki=[],this.dlSciezki=0;for(let o=0;o<r.length-1;o++){let a=r[o].distanceTo(r[o+1]);this.odcinki.push(a),this.dlSciezki+=a}this.tLatarni=0;for(let o=0;o<this.mapa.latarnia.punktSciezki&&o<this.odcinki.length;o++)this.tLatarni+=this.odcinki[o];this.gotowa=this.loadHero().then(()=>this.loadMarkers()).then(()=>this.loadBudynki()).then(()=>this.fasola?.gotowe).then(()=>{this.destroyed||(this.$(".scena3d-loading")?.remove(),this.bindUI(),this.placeHero(0,!0),this.updateCameraBasis(),this.opts.autostart!==!1&&this.renderer.setAnimationLoop(()=>this.tick()),this.emit("gotowa",{klipy:Object.keys(this.actions)}),this._kinoWejscie())}).catch(o=>{throw this.emit("blad",{komunikat:String(o?.message||o)}),o}),this.onWinResize=()=>this.resize(),addEventListener("resize",this.onWinResize),globalThis.ResizeObserver&&(this.ro=new ResizeObserver(()=>this.resize()),this.ro.observe(this.host)),this.resize()}$(t){return this.host.querySelector(t)}$$(t){return this.host.querySelectorAll(t)}emit(t,e={}){let n={nazwa:t,...e};try{this.opts.onEvent?.(t,n)}catch(i){console.warn("onEvent",i)}for(let i of this.listeners.get(t)||[])try{i(n)}catch(r){console.warn("listener "+t,r)}for(let i of this.listeners.get("*")||[])try{i(n)}catch(r){console.warn("listener *",r)}this.host.dispatchEvent(new CustomEvent("scena3d:"+t,{detail:n,bubbles:!0}))}on(t,e){return this.listeners.has(t)||this.listeners.set(t,new Set),this.listeners.get(t).add(e),()=>this.off(t,e)}off(t,e){this.listeners.get(t)?.delete(e)}punktSciezki(t,e=new b){let n=this.mapa.sciezka;if(!n.length)return e.set(0,0,0);t=Ve(t,0,this.dlSciezki);let i=0;for(let r=0;r<this.odcinki.length;r++){if(t<=i+this.odcinki[r])return e.lerpVectors(n[r],n[r+1],(t-i)/this.odcinki[r]);i+=this.odcinki[r]}return e.copy(n[n.length-1])}najblizszyPunktSciezki(t){let e=this.mapa.sciezka,n=0,i=1/0,r=0,o=new b,a=new b,c=new b;for(let l=0;l<this.odcinki.length;l++){o.copy(e[l]),a.subVectors(e[l+1],e[l]),c.subVectors(t,o);let h=Ve(c.dot(a)/a.lengthSq(),0,1),u=c.addScaledVector(a,-h).lengthSq();u<i&&(i=u,n=r+h*this.odcinki[l]),r+=this.odcinki[l]}return{t:n,dist:Math.sqrt(i)}}loadGLB(t){if(t==="prog")return Promise.resolve({scene:new yt,animations:[]});if(t==="pak"){let i=new yt;return i.add(Kf(1)),Promise.resolve({scene:i,animations:[]})}if(t==="drzewo"||t==="drzewo-lisciaste"){let i=new yt,r=(t==="drzewo-lisciaste"?Ra:qs)(1);return r.scale.set(.84,1.26,.84),i.add(r),Promise.resolve({scene:i,animations:[]})}let e=new Ma,n=globalThis.__GLB_ASSETS?.[t]||(t==="adventurer"?globalThis.__HERO_GLB_B64:null);return new Promise((i,r)=>{if(n){let o=atob(n),a=new Uint8Array(o.length);for(let c=0;c<o.length;c++)a[c]=o.charCodeAt(c);e.parse(a.buffer,"",i,r)}else e.load(`${this.opts.zasoby??"./assets/"}${t}.glb`,i,void 0,r)})}miejsceWolne(t,e,n,i,r){if(!this.canWalk(t,e))return!1;for(let o=0;o<8;o++){let a=o/8*Math.PI*2;if(!this.canWalk(t+Math.cos(a)*n,e+Math.sin(a)*n))return!1}for(let o of r||[]){let a=o&&o.e;if(!(!a||a.id===i||!a.pos)&&Math.hypot(t-a.pos[0],e-a.pos[1])<n)return!1}return!0}wolneMiejsca(t,e){let n=i=>[i[0],this.groundHeightAt(i[0],i[1]),i[1]];for(let i of[t.margines??1.6,1,.6]){let r=t.pozycje.filter(o=>this.miejsceWolne(o[0],o[1],i,t.id,e));if(r.length)return r.map(n)}return t.pozycje.map(n)}async loadMarkers(){this.markers=[];let t=await Promise.all(this.mapa.znaki.map(e=>this.loadGLB(e.file).then(n=>({e,t:n})).catch(n=>(console.warn("Nie udalo sie wczytac znaku",e.id,n),null))));for(let e of t){if(!e)continue;let{e:n,t:i}=e;n.pozycje&&(n._pozycje=this.wolneMiejsca(n,t));let r=this.groundHeightAt(n.pos[0],n.pos[1]),o=new Pa(n,i.scene,r,this.planeta);n.animuj&&i.animations&&i.animations.length&&(o.mixer=new Pr(i.scene),o.mixer.clipAction(i.animations[0]).play()),this.swiat.add(o.root),this.markers.push(o)}}async loadBudynki(){for(let t of this.mapa.budynki)try{let n=(await this.loadGLB(t.file)).scene,i=new Ae().setFromObject(n),r=new b;i.getSize(r),n.scale.setScalar((t.wysokosc??2.4)/Math.max(.001,r.y)),i.setFromObject(n);let o=i.getCenter(new b),a=new yt;if(this.planeta.ustaw(a,t.pos[0],t.pos[1],0,0),n.position.set(-o.x,this.groundHeightAt(t.pos[0],t.pos[1])-i.min.y,-o.z),n.rotation.y=t.obrot??0,t.jasnosc&&n.traverse(c=>{let l=c.material?Array.isArray(c.material)?c.material:[c.material]:[];for(let h of l)h.color&&(h.color.multiplyScalar(t.jasnosc),h.needsUpdate=!0)}),a.add(n),this.swiat.add(a),t.ciemnosc){let c=t.mrokPromien??(t.promien??1.4)*.28,l=t.mrokWysokosc??(t.wysokosc??4)*.46,h=new Dt(new tn(c,c,l,24,1,!1),new le({color:t.mrokBarwa??1511432,transparent:!0,opacity:typeof t.ciemnosc=="number"?t.ciemnosc:.86,side:Be,depthWrite:!1})),u=t.mrokPos?t.mrokPos[0]:t.pos[0],d=t.mrokPos?t.mrokPos[1]:t.pos[1];this.planeta.ustaw(h,u,d,this.groundHeightAt(u,d)+(t.mrokY??.02)+l/2,0),h.renderOrder=-1,h.name="mrok-"+(t.file||"budynek"),this.swiat.add(h)}if(t.drzwiKat!=null){let c=t.promien??1.4,l=t.drzwiSzer??.9,h=14,u=Math.PI*c/h*1.15;for(let d=0;d<h;d++){let f=d/h*Math.PI*2,p=Math.atan2(Math.sin(f-t.drzwiKat),Math.cos(f-t.drzwiKat));Math.abs(p)<l/2||this.blockers.push({x:t.pos[0]+Math.sin(f)*c,z:t.pos[1]+Math.cos(f)*c,r:u})}}else this.blockers.push({x:t.pos[0],z:t.pos[1],r:t.promien??1.4})}catch(e){console.warn("Nie udalo sie wczytac budynku",t.file,e)}}async loadHero(){let t=Eu(),e=await this.loadGLB(t.plik||"adventurer"),n=e.scene;if(n.traverse(l=>{l.isSkinnedMesh&&(this.skinned=l,l.frustumCulled=!1)}),!this.skinned)throw new Error("Brak SkinnedMesh w GLB \u2014 rig nie zosta\u0142 wczytany");this.tilt=new yt,this.tilt.position.y=ip,n.position.y=-ip,this.tilt.add(n),this.hero=new yt,this.hero.add(this.tilt),this.model=n;let i=this.makeHeroEnv();n.traverse(l=>{let h=l.material?Array.isArray(l.material)?l.material:[l.material]:[];for(let u of h)u.metalness=0,u.metalnessMap=null,u.roughnessMap=null,u.roughness=.85,u.normalScale&&u.normalScale.setScalar(.55),u.color.setScalar(t.wyglad?.tint??zM),u.map&&(u.emissiveMap=u.map,u.emissive.setScalar(1),u.emissiveIntensity=t.wyglad?.self??PM),u.envMap=i,u.envMapIntensity=t.wyglad?.env??IM,u.needsUpdate=!0}),this.hero.scale.setScalar(Ka);let r=Ca(1.3,.62,.34,!0);this.heroShadow=r.userData.plama,this.heroShadow.geometry.scale(.7,.7,1),this.heroShadow.renderOrder=2,this.heroShadow.userData.dopracowany=!0,this.heroShadowKotwica=r,this.swiat.add(r);let o={},a=[];for(let l of e.animations){let h=(t.klipy||DM)[l.name]||l.name;l.name=h,a.push(...jM(l).map(u=>`${h}: ${u}`)),(h==="walk"||h==="run"||h==="idle")&&$M(l),o[h]=l}this.clipReport=a,o.walk&&!o.turn&&(o.turn=Sf.subclip(o.walk,"turn",0,13,24)),this.mixer=new Pr(this.model),this.actions={};for(let[l,h]of Object.entries(o)){let u=this.mixer.clipAction(h);(l==="turn"||l==="happy")&&(u.setLoop(_h),u.clampWhenFinished=!0),this.actions[l]=u}this.actions.walk&&(this.actions.walk.timeScale=Ei/cp*(t.tempo?.walk??1)),this.actions.run&&(this.actions.run.timeScale=mu/lp*(t.tempo?.run??1));let c=this.alignRunToWalk();c&&a.push(`run\u2192walk: obr\xF3t ${c.obrotPionowy}\xB0, \u015Brodek ${JSON.stringify(c.srodekSwiat)}`),this.calibrateFeet(),this.current=null,this.play("idle"),this.swiat.add(this.hero),this.swiatlo=new Br(this.hero),this.kropla=new Br(this.hero,{ile:1,barwa:9428223,mocLatarni:.35,wielkoscKuli:.11,promienOrbity:.5,wysokosc:.6,tempoOrbity:.8}),this.kropla.grupa.name="kropla-bohatera",this.dymki=new Ha(this.swiat,this.planeta),this.debugAPI(e)}debugAPI(t){globalThis.__POC={app:this,bones:this.skinned.skeleton.bones.length,clips:t.animations.map(e=>e.name),isSkinned:!0,setInput:(e,n)=>{this.enterFreeMode(),this.input.set(e,n),this.inputSource="api"},pos:()=>[+this.hp.x.toFixed(2),+this.heroLift.toFixed(2),+this.hp.z.toFixed(2)],clipReport:this.clipReport,clipY:()=>this.clipY,setHeroLook:({tint:e,self:n,env:i})=>{this.hero.traverse(r=>{let o=r.material?Array.isArray(r.material)?r.material:[r.material]:[];for(let a of o)e!=null&&a.color.setScalar(e),n!=null&&(a.emissiveIntensity=n),i!=null&&(a.envMapIntensity=i),a.needsUpdate=!0}),this.renderer.render(this.scene,this.camera)},leanDip:()=>+(this.leanDip||0).toFixed(4),setLean:e=>{this.lean=e,this.tilt.rotation.x=e},leanMax:Ga,runMode:()=>Zs,markers:()=>(this.markers||[]).map(e=>({id:e.id,dotkniecia:e.touches,stan:e.state,pos:[+e.mapa.x.toFixed(2),+e.mapa.z.toFixed(2)],skala:+e.spin.scale.x.toFixed(3),halo:+e.halo.material.opacity.toFixed(2),swiatlo:+e.light.intensity.toFixed(2),przebudzenie:+e.wake.toFixed(2),wysokosc:+e.spin.position.y.toFixed(3),krycie:+e.fade.toFixed(2),widoczny:e.spin.visible})),touched:()=>this.touched||[],tapMarker:e=>{let n=(this.markers||[]).find(i=>i.id===e);return n?(n.def.absorb?this.enterMarker(n,!0):this.touchMarker(n,!0),{skala:+n.spin.scale.x.toFixed(3),swiatlo:+n.light.intensity.toFixed(2)}):null},setRunMode:e=>{Zs=e,this.current=null,this.mixer.stopAllAction(),this.play("idle",0)},groundAt:(e,n)=>+this.groundHeightAt(e,n).toFixed(3),hold:()=>({trzymanie:+this.holdTime.toFixed(2),bieg:this.running,anim:this.current,predkosc:+(this.moveSpeed||0).toFixed(2),tempoKlipu:+(this.actions[Xr]?.timeScale||0).toFixed(2),pochylenieDeg:+((this.lean||0)*180/Math.PI).toFixed(1)}),planeta:()=>({R:this.planeta.R,obrot:this.swiat.quaternion.toArray().map(e=>+e.toFixed(3))})}}makeHeroEnv(){let t=document.createElement("canvas");t.width=64,t.height=32;let e=t.getContext("2d"),n=e.createLinearGradient(0,0,0,32);n.addColorStop(0,"#fff3dc"),n.addColorStop(.45,"#e9edff"),n.addColorStop(1,"#9dbb72"),e.fillStyle=n,e.fillRect(0,0,64,32);let i=new _e(t);i.mapping=gr,i.colorSpace=qt;let r=new Ls(this.renderer),o=r.fromEquirectangular(i);return r.dispose(),i.dispose(),o.texture}play(t,e=.22,n=!1){if(this.current===t)return;let i=this.actions[t];if(!i)return;let r=this.current?this.actions[this.current]:null;if(i.reset(),n&&r){let o=r.getClip().duration,a=i.getClip().duration;o>0&&(i.time=r.time%o/o*a)}i.fadeIn(r?e:0).play(),r&&r.fadeOut(e),this.current=t}bindUI(){this.canvas.addEventListener("pointerdown",n=>this.onPointerDown(n)),this.canvas.addEventListener("pointermove",n=>this.onPointerMove(n)),this.canvas.addEventListener("pointerup",n=>this.onPointerUp(n)),this.canvas.addEventListener("pointercancel",n=>this.onPointerUp(n)),this.onKeyDown=n=>{if(n.code==="ShiftLeft"||n.code==="ShiftRight"){this.keys.add(n.code);return}hp[n.code]&&(n.preventDefault(),this.keys.add(n.code),this.enterFreeMode())},this.onKeyUp=n=>{this.keys.delete(n.code)},this.onBlur=()=>this.keys.clear(),this.opts.klawiatura!==!1&&(addEventListener("keydown",this.onKeyDown),addEventListener("keyup",this.onKeyUp),addEventListener("blur",this.onBlur));let t=this.$(".scena3d-runmode");if(t){let n=()=>{t.textContent=Zs==="tempo"?"bieg: tempo":"bieg: klip"};n(),t.addEventListener("click",()=>{Zs=Zs==="tempo"?"clip":"tempo",n(),this.current=null,this.mixer.stopAllAction(),this.play("idle",0)})}this.stickBase=this.$(".scena3d-stick"),this.stickKnob=this.$(".scena3d-knob");let e=(n,i)=>this.$(`[data-akcja="${n}"]`)?.addEventListener("click",i);e("stop",()=>{this.stopWalk(),this.setActive("stop")}),e("go",()=>{this.goToLantern(),this.setActive("go")}),e("replay",()=>{this.replayWalk(),this.setActive("replay")})}updateCameraBasis(){this.camRight.set(1,0,0).applyQuaternion(this.camera.quaternion),this.camRight.y=0,this.camRight.normalize(),this.camFwd.set(0,0,-1).applyQuaternion(this.camera.quaternion),this.camFwd.y=0,this.camFwd.normalize()}enterFreeMode(){this.mode!=="free"&&(this.mode="free",this.walking=!1,this.setActive(null)),this.sequence&&(this.sequence=null)}onPointerDown(t){this.kinoSkroc(),this.stick||(this.stick={id:t.pointerId,x0:t.clientX,y0:t.clientY,active:!1},this.canvas.setPointerCapture?.(t.pointerId))}onPointerMove(t){let e=this.stick;if(!e||e.id!==t.pointerId)return;let n=t.clientX-e.x0,i=t.clientY-e.y0,r=Math.hypot(n,i);if(!e.active&&r<11)return;e.active||(e.active=!0,this.enterFreeMode(),this.showStick(e.x0,e.y0));let o=46,a=Math.min(1,r/o),c=r?n/r:0,l=r?i/r:0;this.input.set(c*a,-l*a),this.inputSource="stick",this.moveKnob(c*a*o,l*a*o)}onPointerUp(t){let e=this.stick;!e||e.id!==t.pointerId||(this.stick=null,this.hideStick(),e.active?(this.input.set(0,0),this.inputSource=null,this.setRunFlag(!1)):this.tapAt(t.clientX,t.clientY))}showStick(t,e){this.stickBase&&(this.stickBase.style.left=`${t}px`,this.stickBase.style.top=`${e}px`,this.stickBase.classList.add("on"))}moveKnob(t,e){this.stickKnob&&(this.stickKnob.style.transform=`translate(-50%,-50%) translate(${t}px,${e}px)`)}hideStick(){this.stickBase?.classList.remove("on"),this.moveKnob(0,0)}setRunFlag(t){this.running!==t&&(this.running=t,this.stickBase?.classList.toggle("run",t))}readKeys(){let t=0,e=0;for(let n of this.keys){let i=hp[n];i&&(t+=i[0],e+=i[1])}if(t||e){let n=Math.hypot(t,e),i=this.keys.has("ShiftLeft")||this.keys.has("ShiftRight")?1:.55;return this.input.set(t/n*i,e/n*i),this.inputSource="keys",!0}return!1}bridgeLocal(t,e,n){return n.set(t,0,e).applyMatrix4(this.bridgeInv)}groundHeightAt(t,e){let n=this.formy?this.formy.h(t,e):0,i=this.bridgeLocal(t,e,this._blTmp||(this._blTmp=new b)),r=Math.abs(i.z);if(Math.abs(i.x)>_u+.2||r>Xa)return n;let o=kM-.057*(Math.min(r,yu)/yu)**2,a=Ve((Xa-r)/(Xa-yu),0,1),c=Ve((_u+.2-Math.abs(i.x))/.3,0,1);return o*(a*a*(3-2*a)*c)}onBridge(t,e){let n=this.bridgeLocal(t,e,this._blTmp2||(this._blTmp2=new b));return Math.abs(n.x)<_u&&Math.abs(n.z)<Xa}canWalk(t,e){return this.canWalkN(this.planeta.normalna(t,e,this._v3))}canWalkN(t){let e=this.planeta.R;if(this.ograniczenieMapy){let o=this.planeta.zKuli(this._v1.copy(t).multiplyScalar(e));if(Math.hypot(o.x,o.z)>this.mapa.promienMapy)return!1}let n=this._v1.copy(t).multiplyScalar(e);for(let o of this.blockers){o.n||(o.n=this.planeta.naKule(o.x,o.z,0));let a=o.r+ap;if(n.distanceToSquared(o.n)<a*a)return!1}let i=1/0,r=this._v2;for(let o of this.rzeka3d)for(let a=0;a<o.length-1;a++){let c=o[a],l=o[a+1];r.subVectors(l,c);let h=r.lengthSq(),u=h>0?Ve(this._v3.subVectors(n,c).dot(r)/h,0,1):0;this._v3.copy(c).addScaledVector(r,u),i=Math.min(i,n.distanceTo(this._v3))}if(i<this.mapa.rzeka.szerokosc+ap*.5){let o=this.planeta.zKuli(n);return this.onBridge(o.x,o.z)}return!0}calibrateFeet(t=56){let e=this.skinned,n=e.geometry.attributes.position,i=1/0;for(let c=0;c<n.count;c++)i=Math.min(i,n.getY(c));this.soleVerts=[];for(let c=0;c<n.count;c++)n.getY(c)<i+.02&&this.soleVerts.push(c);let r=new b,o=this.tilt.rotation.x;this.tilt.rotation.x=0,this.hero.position.set(0,0,0),this.hero.quaternion.identity(),this.clipY={};for(let[c,l]of Object.entries(this.actions)){this.mixer.stopAllAction(),l.reset(),l.timeScale=1,l.play(),this.tilt.rotation.x=c===Zi?Wa:0;let h=l.getClip().duration||1,u=1/0;for(let d=0;d<t;d++){this.mixer.setTime(d/t*h),this.hero.updateMatrixWorld(!0);for(let f of this.soleVerts)e.getVertexPosition(f,r).applyMatrix4(e.matrixWorld),r.y<u&&(u=r.y)}this.clipY[c]=-u}this.tilt.rotation.x=0;let a=this.actions[Xr];if(a){this.mixer.stopAllAction(),a.reset(),a.timeScale=1,a.play();let c=a.getClip().duration||1,l=h=>{this.tilt.rotation.x=h;let u=1/0;for(let d=0;d<t;d++){this.mixer.setTime(d/t*c),this.hero.updateMatrixWorld(!0);for(let f of this.soleVerts)e.getVertexPosition(f,r).applyMatrix4(e.matrixWorld),r.y<u&&(u=r.y)}return u};this.leanDip=Math.max(0,l(0)-l(Ga))}else this.leanDip=0;return this.mixer.stopAllAction(),this.mixer.setTime(0),this.tilt.rotation.x=o,this.footOffset=this.clipY.idle??0,this.clipY}alignRunToWalk(){let t=this.actions[Xr],e=this.actions[Zi];if(!t||!e)return null;let n=this.skinned.skeleton.bones.find(L=>L.name==="Hip");if(!n)return null;let i=this.tilt.rotation.x;this.hero.position.set(0,0,0),this.hero.quaternion.identity(),this.tilt.rotation.x=0;let r=new b,o=new b,a=new b,c=32,l=this.skinned.skeleton.bones,h=l.find(L=>L.name==="L_Thigh"),u=l.find(L=>L.name==="R_Thigh");if(!h||!u)return null;let d=(L,B=0)=>{this.mixer.stopAllAction(),L.reset(),L.timeScale=1,L.play(),this.tilt.rotation.x=B;let Z=L.getClip().duration||1,H=new b,$=0,W=0;for(let at=0;at<c;at++){this.mixer.setTime(at/c*Z),this.hero.updateMatrixWorld(!0),n.getWorldPosition(r),H.add(r),h.getWorldPosition(o),u.getWorldPosition(a);let ct=a.x-o.x,gt=a.z-o.z,Ft=Math.hypot(ct,gt)||1;$+=gt/Ft,W+=-ct/Ft}return{pos:H.multiplyScalar(1/c),yaw:Math.atan2($/c,W/c)}},f=new Ot,p=d(t,0),_=d(e,Wa),m=p.yaw-_.yaw;for(;m>Math.PI;)m-=Math.PI*2;for(;m<-Math.PI;)m+=Math.PI*2;let g=p.pos.clone().sub(_.pos),M=new Ot;n.parent.getWorldQuaternion(M);let x=M.clone().invert(),w=new Ot().setFromAxisAngle(new b(0,1,0),m),C=x.clone().multiply(w).multiply(M),T=g.clone().divideScalar(Ka).applyQuaternion(x),E=e.getClip(),z=E.tracks.find(L=>L.name==="Hip.position");if(z)for(let L=0;L<z.times.length;L++)z.values[L*3]+=T.x,z.values[L*3+1]+=T.y,z.values[L*3+2]+=T.z;let F=E.tracks.find(L=>L.name==="Hip.quaternion");if(F)for(let L=0;L<F.times.length;L++)f.fromArray(F.values,L*4).premultiply(C).normalize(),f.toArray(F.values,L*4);e.reset();let y=d(e,Wa),S=y.yaw-p.yaw;for(;S>Math.PI;)S-=Math.PI*2;for(;S<-Math.PI;)S+=Math.PI*2;this.mixer.stopAllAction(),this.mixer.setTime(0),this.tilt.rotation.x=i;let N=y.pos.clone().sub(p.pos);return{obrotPionowy:+(m*180/Math.PI).toFixed(1),srodekSwiat:[+g.x.toFixed(3),+g.y.toFixed(3),+g.z.toFixed(3)],resztkowyBlad:+(S*180/Math.PI).toFixed(2),resztkowySrodek:+N.length().toFixed(4)}}_uderzDrzewa(t,e,n,i){let r=this.blockers;if(!r||ri)return;let o=Math.hypot(n,i);if(!(o>1e-6))return;let a=this._dtGib||1/60,c=.95,l=13;for(let h of r){let u=h&&h.drzewo;if(!u)continue;let d=h.x-t,f=h.z-e,p=Math.hypot(d,f);if(p<1e-4||p>h.r+c||(n*d+i*f)/o<=0)continue;let _=u.userData.gib||(u.userData.gib={x:0,z:0,vx:0,vz:0}),m=Math.min(1,(h.r+c-p)/c),g=Math.min(1,o*60/3.2),M=h.skalaDrzewa||1,x=l*m*g/M*a;_.vx+=d/p*x,_.vz+=f/p*x}}_uderzKwiaty(t,e,n,i){let r=this.kwiaty;if(!r)return;let o=Math.hypot(n,i);if(!(o>1e-6))return;let a=this._dtGib||1/60,c=.78,l=130;for(let h of r.lista){let u=h.x-t,d=h.z-e,f=Math.hypot(u,d);if(f<1e-4||f>c||(n*u+i*d)/o<=0)continue;let p=(c-f)/c,_=Math.min(1,o*60/3.2),m=l*p*_*a;h.gib.vx+=u/f*m,h.gib.vz+=d/f*m}}_sprezyna(t,e,n,i,r,o,a){t.vx+=(-e*t.x-n*t.vx)*r,t.vz+=(-e*t.z-n*t.vz)*r,t.x+=t.vx*r,t.z+=t.vz*r,t.x>i?(t.x=i,t.vx*=-.2):t.x<-i&&(t.x=-i,t.vx*=-.2),t.z>i?(t.z=i,t.vz*=-.2):t.z<-i&&(t.z=-i,t.vz*=-.2),Math.abs(t.x)<o&&Math.abs(t.z)<o&&Math.abs(t.vx)<a&&Math.abs(t.vz)<a&&(t.x=t.z=t.vx=t.vz=0)}ustawZasiew(t){this.zasiewWlaczony=!!t,this._zasiewOstatnia=null,this._zasiewDroga=0}_zasiejZaLiskiem(){if(!this.hero||!this.kwiaty||!this.zasiewWlaczony)return;if(!this._zasiewOstatnia){this._zasiewOstatnia=this.hn.clone();return}let t=Math.acos(Ve(this.hn.dot(this._zasiewOstatnia),-1,1))*this.planeta.R;if(this._zasiewOstatnia.copy(this.hn),t>2||this._kino||this.sequence){this._zasiewDroga=0;return}if(t<1e-5||(this._zasiewDroga+=t,this._zasiewDroga<.7))return;this._zasiewDroga%=.7;let e=this.planeta.punktObok(this.hn,this.hf,-.55,this._zasiewN||(this._zasiewN=new b)),n=(this._zasiewBok||(this._zasiewBok=new b)).crossVectors(e,this.hf).normalize();this.planeta.punktObok(e,n,(this._zasiewStrona=!this._zasiewStrona)?.18:-.18,e);let i=this.planeta.zKuli((this._zasiewP||(this._zasiewP=new b)).copy(e).multiplyScalar(this.planeta.R));(!this.onBridge(i.x,i.z)||this.mapa.most.ukryty)&&this.kwiaty.posadz(i.x,i.z,ri)}_gibKwiaty(t){let e=this.kwiaty;if(!e)return;let n=!1;for(let i of e.lista){let r=i.gib;!r.x&&!r.z&&!r.vx&&!r.vz||(this._sprezyna(r,52,4.6,1.05,t,3e-4,.003),e.odswiez(i),n=!0)}n&&e.oznacz()}_gibDrzew(t){for(let e of this.blockers||[]){let n=e&&e.drzewo;if(!n)continue;let i=n.userData.gib;if(!i||!i.x&&!i.z&&!i.vx&&!i.vz)continue;let r=e.skalaDrzewa||1;this._sprezyna(i,40/r,4.6,.26/r,t,2e-4,.002),n.rotation.z=-i.x,n.rotation.x=i.z}}aktualizujHp(){let t=this.planeta.zKuli(this._v1.copy(this.hn).multiplyScalar(this.planeta.R));this.hp.x=t.x,this.hp.z=t.z}moveKula(t,e){let n=this.hp.x,i=this.hp.z,r=this._vm1||(this._vm1=new b),o=this._vm2||(this._vm2=new b),a=(f,p)=>(r.copy(this.hn),o.copy(f),this.planeta.przesunPoKuli(r,o,p),this.canWalkN(r)),c=()=>(this.hn.copy(r),He(this.hf,this.hn),this.aktualizujHp(),!0);{let f=this._zamiar||(this._zamiar={x:0,z:0,h:0});r.copy(this.hn),o.copy(t),this.planeta.przesunPoKuli(r,o,e);let p=this.planeta.zKuli(this._v1.copy(r).multiplyScalar(this.planeta.R),f);this._uderzDrzewa(n,i,p.x-n,p.z-i),this._uderzKwiaty(n,i,p.x-n,p.z-i)}if(!this.canWalkN(this.hn)||a(t,e))return c();let l=this.stycznaZeSwiata(this.camRight,this._vm3||(this._vm3=new b)),h=this.stycznaZeSwiata(this.camFwd,this._vm4||(this._vm4=new b)),u=t.dot(l),d=t.dot(h);return Math.abs(u)>.001&&a(l,e*u)||Math.abs(d)>.001&&a(h,e*d)?c():!1}stycznaZeSwiata(t,e){return this._qTmp.copy(this.swiat.quaternion).invert(),e.copy(t).applyQuaternion(this._qTmp),He(e,this.hn)}setLocomotion(t){if(this.moveSpeed=t,t<.05){this.play("idle",.28);return}let e=Zs==="clip"&&!!this.actions[Zi],n=this.current===Zi;if(e&&(n?t>RM:t>EM)){let i=this.actions[Zi];i.timeScale=Ve(t/lp,.55,np),this.play(Zi,.26,!0)}else{let i=this.actions[Xr];i.timeScale=Ve(t/cp,.6,np),this.play(Xr,.24,!0)}}moveFree(t){let e=this.input.length(),n=this.mapa.latarnia.pos;if(e<gu){this.holdTime=Math.max(0,this.holdTime-t*3),this.holdDir=null,this.setRunFlag(!1),this.setLocomotion(0);let _=this.planeta.odleglosc(this.hn,this.latarniaN);!this.celebrated&&_<2.4?(this.idleAtLantern+=t,this.idleAtLantern>.35&&this.startCelebration()):this.idleAtLantern=0;return}this.idleAtLantern=0;let i=Ve((e-gu)/(1-gu),0,1),r=Ei*(.45+.55*i),o=Math.atan2(this.input.x,this.input.y);if(this.holdDir!==null){let _=o-this.holdDir;for(;_>Math.PI;)_-=Math.PI*2;for(;_<-Math.PI;)_+=Math.PI*2;Math.abs(_)>CM&&(this.holdTime=0)}this.holdDir=o,i>=sp?this.holdTime=Math.min(rp+op+.5,this.holdTime+t):this.holdTime=Math.max(0,this.holdTime-t*2);let a=Ve((this.holdTime-rp)/op,0,1),c=a*a*(3-2*a),l=Ei+(mu-Ei)*c,h=Math.max(r,i>=sp?l:0);this.setRunFlag(h>Ei*1.5);let u=this._dirTmp||(this._dirTmp=new b);u.copy(this.camRight).multiplyScalar(this.input.x/e).addScaledVector(this.camFwd,this.input.y/e).normalize();let d=this.stycznaZeSwiata(u,this._dirMap||(this._dirMap=new b)),f=this.moveKula(d,h*t);this.blockedFor=f?0:(this.blockedFor||0)+t,this.setLocomotion(this.blockedFor>.3?0:h),this.obrocKu(d,11,t);let p=this.planeta.odleglosc(this.hn,this.latarniaN);this.celebrated&&p>4&&(this.celebrated=!1)}obrocKu(t,e,n){let i=su(this.hf,t,this.hn);return kf(this.hf,this.hn,i*(1-Math.exp(-e*n))),He(this.hf,this.hn),i}stycznaDoMapy(t,e,n){let i=this.planeta.normalna(t,e,this._v2);return nn(this.hn,i,this.hf,n)}get heading(){let t=this._v3.copy(this.hf).applyQuaternion(this.swiat.quaternion);return Math.atan2(t.x,t.z)}set heading(t){}setActive(t){for(let e of this.$$(".scena3d-controls button"))e.classList.toggle("active",e.dataset.akcja===t)}tapAt(t,e){let n=this.canvas.getBoundingClientRect(),i=new it((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);this.raycaster.setFromCamera(i,this.camera);let r=this.raycaster.intersectObjects((this.markers||[]).map(f=>f.hit),!1);if(r.length){let f=r[0].object.userData.marker;f.def.absorb?this.enterMarker(f,!0):this.touchMarker(f,!0);return}let o=this.raycaster.intersectObject(this.ziemia,!1);if(!o.length)return;let a=this.swiat.worldToLocal(o[0].point.clone()),c=this.planeta.zKuli(a),l=new b(c.x,0,c.z),{t:h,dist:u}=this.najblizszyPunktSciezki(l);if(u>4.5)return;this.mode="goto",this.input.set(0,0),this.heroT=this.najblizszyPunktSciezki(new b(this.hp.x,0,this.hp.z)).t,this.startWalk(h);let d=this.punktSciezki(h);this.planeta.ustaw(this.markerKotwica,d.x,d.z,this.groundHeightAt(d.x,d.z),0),this.markerPulse=1}touchMarker(t,e=!1){if(!(!t||!t.touch())){this.hint(t.def.toast),this.touched=(this.touched||[]).concat(t.id),this.emit("znak:dotkniety",{znak:t.id,etykieta:t.def.label,palcem:e});try{navigator.vibrate?.([14,40,20])}catch{}e&&!this.walking&&!this.sequence&&(this.play("happy",.12),this.sequence="happy",this.seqTimer=0)}}enterMarker(t,e=!1){if(!(!t||!t.startAbsorb(e))){this.hint(t.def.toast),this.touched=(this.touched||[]).concat(t.id),this.emit("minigra:start",{znak:t.id,etykieta:t.def.label,palcem:e,poDomknieciu:.95});try{navigator.vibrate?.([18,50,26])}catch{}this.input.lengthSq()<.02&&(this.moveSpeed||0)<.05&&!this.walking&&!this.sequence&&(this.play("happy",.12),this.sequence="happy",this.seqTimer=0)}}hint(t,e=2200){let n=this.$(".scena3d-hint span");n&&(this._hintBase||(this._hintBase=n.textContent),n.textContent=t,clearTimeout(this._hintT),this._hintT=setTimeout(()=>{n.textContent=this._hintBase},e))}startWalk(t){this.targetT=t,this.walking=Math.abs(t-this.heroT)>.05,this.sequence=null,this.walking&&this.play("walk")}stopWalk(){this.walking=!1,this.sequence=null,this.input.set(0,0),this.inputSource=null,this.holdTime=0,this.holdDir=null,this.setRunFlag(!1),this.keys.clear(),this.hideStick(),this.play("idle")}goToLantern(){this.celebrated=!1,this.mode="goto",this.input.set(0,0),this.heroT=this.najblizszyPunktSciezki(new b(this.hp.x,0,this.hp.z)).t,this.startWalk(this.tLatarni)}replayWalk(){this.celebrated=!1,this.mode="goto",this.input.set(0,0),this.placeHero(0,!0),this.startWalk(this.tLatarni)}placeHero(t,e=!1){this.heroT=t;let n=this.punktSciezki(t),i=this.mapa.start;i?.pos&&t===0&&(n=new b(i.pos[0],0,i.pos[1])),this.planeta.normalna(n.x,n.z,this.hn),this.aktualizujHp(),this.groundY=this.groundHeightAt(n.x,n.z),this.lean=0,this.tilt&&(this.tilt.rotation.x=0),this.heroLift=this.groundY+(this.clipY?.idle??this.footOffset);let r=this.punktSciezki(Math.min(this.dlSciezki,t+.3)),o=i?.obrot!=null&&t===0?i.obrot:Math.atan2(r.x-n.x,r.z-n.z);this.hf.set(Math.sin(o),0,Math.cos(o)).applyQuaternion(this.planeta.ramka(n.x,n.z,this._qTmp)),He(this.hf,this.hn),e&&(this.planeta.obrotPodPunkt(this.hp.x,this.hp.z,this.swiat.quaternion),this.camPos.copy(this.camTarget).add(this.camDir),this.camera.position.copy(this.camPos),this.camera.lookAt(this.camTarget)),this.syncHero()}syncHero(){this.hero&&this.planeta.ustawN(this.hero,this.hn,this.hf,this.heroLift)}startCelebration(){this.emit("latarnia:reakcja",{faza:"obrot"}),this.celebrated=!0,this.walking=!1,this.sequence="turning",this.seqTimer=0,this.play("turn",.15)}spawnSparkles(){let t=new Re(.05,6,5),e=new le({color:16771496,transparent:!0});for(let n=0;n<10;n++){let i=new Dt(t,e.clone());i.position.set(-.6,1.7,0);let r=n/10*Math.PI*2;i.userData={vel:new b(Math.cos(r)*.9,1.4+Math.random(),Math.sin(r)*.9),life:1},this.sparkleGrupa.add(i),this.sparkles.push(i)}}tick(){let t=Math.min(.05,this.clock.getDelta()),e=Ei;if(this._dtGib=t,this._gibDrzew(t),this._gibKwiaty(t),this.kwiaty?.aktualizujZasiew(t,ri),ri||this.nurtTik(t),this.stick?.active||(this.keys.size?(this.readKeys(),this.enterFreeMode()):this.inputSource==="keys"&&(this.input.set(0,0),this.inputSource=null)),this.mode==="free"&&!this.sequence&&this.moveFree(t),!this.walking&&this.mode!=="free"&&(this.moveSpeed=0),this.walking){let f=Math.sign(this.targetT-this.heroT);this.heroT+=f*e*t,(f>0&&this.heroT>=this.targetT||f<0&&this.heroT<=this.targetT)&&(this.heroT=this.targetT,this.walking=!1,!this.celebrated&&Math.abs(this.heroT-this.tLatarni)<.6?this.startCelebration():this.play("idle"),this.emit("bohater:doszedl",{x:+this.hp.x.toFixed(2),z:+this.hp.z.toFixed(2),latarnia:Math.abs(this.heroT-this.tLatarni)<.6})),this.moveSpeed=e;let p=this.punktSciezki(this.heroT);this.planeta.normalna(p.x,p.z,this.hn),He(this.hf,this.hn),this.aktualizujHp();let _=this.punktSciezki(Ve(this.heroT+.35*(f||1),0,this.dlSciezki));if(_.distanceToSquared(p)>1e-6){let m=this.stycznaDoMapy(_.x,_.z,this._v1);f<0&&m.negate(),this.obrocKu(m,10,t)}}if(this.sequence==="turning"){this.seqTimer+=t;let f=nn(this.hn,this.latarniaN,this.hf,this._v1),p=this.obrocKu(f,6,t);this.seqTimer>.5&&Math.abs(p)<.08&&(this.sequence="happy",this.seqTimer=0,this.play("happy",.12),this.spawnSparkles())}else this.sequence==="happy"?(this.seqTimer+=t,this.seqTimer>1.55&&(this.sequence=null,this.idleAtLantern=0,this.play("idle",.3))):this.sequence==="wspinaczka"&&this._wspinaczkaKlatka(t);let n;this.sequence||!this.moveSpeed?n=0:this.current===Zi?n=Wa:n=Ga*Ve((this.moveSpeed-Ei*.8)/(mu-Ei*.8),0,1),this.lean=qa(this.lean||0,n,6,t),this.tilt&&(this.tilt.rotation.x=this.lean);let i=this.groundHeightAt(this.hp.x,this.hp.z);this.groundY=qa(this.groundY,i,9,t);let r=this.clipY?.[this.current]??this.footOffset;this.footOffset=qa(this.footOffset,r,12,t);let o=(this.leanDip||0)*Math.max(0,(this.lean||0)/Ga);this.heroLift=this.groundY+this.footOffset+o+(this._wspDodatek||0),this.syncHero(),this._zasiejZaLiskiem();let a=this._v1.copy(this.hn).applyQuaternion(this.swiat.quaternion);this._qTmp.setFromUnitVectors(a,this._v2.set(0,1,0)),this.obrotCel.copy(this._qTmp).multiply(this.swiat.quaternion);let c=ri?30:NM;if(this.swiat.quaternion.slerp(this.obrotCel,1-Math.exp(-c*t)),this.korektaPolnocy(t),this.mapa.cienie&&this.hero&&!this._cienieBohatera&&(this._cienieBohatera=!0,this.hero.traverse(f=>{(f.isMesh||f.isSkinnedMesh)&&(f.castShadow=!0)}),this.heroShadow&&(this.heroShadow.visible=!1)),this.chmury&&this.chmury.aktualizuj(t,this.doba?.stan||null,this.moveSpeed||0),this.doba){let f=this.doba.aktualizuj(this.hn,this.swiat.quaternion,t);f!==this._pora&&(this._pora=f,this.emit("doba:pora",{pora:f,...this.doba.stan}))}this._kameraFasola(t),this.camPos.copy(this.camTarget).add(this._camDirAkt||this.camDir),this.camPos.y+=this._camGora||0,this._kinoKlatka(t),this.camera.position.copy(this.camPos),this.camera.lookAt(this._kc.x,this._kc.y,this._kc.z);let l=ri?.3:1,h=this.doba?.stan||null;for(let f of this.markers||[]){f.def.pora&&h&&f.ustawAktywny(f.def.pora==="noc"?h.noc>.35:h.dzien>.35);let p=this.planeta.odleglosc(this.hn,f.n);if(f.update(t,l,p),f.aktywny!==!1){if(f.def.reagujeNaSwiatlo&&this.swiatlo){let _=this.swiatlo.ile,m=Math.max(0,1-p/7),g=_>=3?1:.35+.65*(.5+.5*Math.sin(this._czasGry*2.4)),M=_/3*g*(.35+.65*m);f.light&&(f.light.intensity=M*3.2),f.halo?.material&&(f.halo.material.opacity=M*.55),_===0&&(f.light&&(f.light.intensity=0),f.halo?.material&&(f.halo.material.opacity=0))}if(p<(f.def.zasieg??1)&&!this._kino){if(f.def.zbiera==="swiatlo"){if(this.swiatlo.komplet)continue;f.state==="idle"&&this.swiatlo.dodaj()&&this.emit("swiatlo:zebrane",{ile:this.swiatlo.ile,komplet:this.swiatlo.komplet})}f.def.absorb?this.enterMarker(f):this.touchMarker(f)}}}if(this.swiatlo&&this.swiatlo.aktualizuj(t),this.kropla&&this.kropla.aktualizuj(t),this._fasolaTik(t),this.dymki&&this.dymki.aktualizuj(t,this.hn,this.hf,this.doba?.stan||null),this._czasGry=(this._czasGry||0)+t,this.heroShadowKotwica){let f=this.groundHeightAt(this.hp.x,this.hp.z);this.planeta.ustawN(this.heroShadowKotwica,this.planeta.punktObok(this.hn,this.hf,.18,this._v1),this.hf,f);let p=Math.max(0,this.heroLift-f-.02),_=1+Ve(p,0,.35)*.7;this.heroShadow.scale.set(_,_,1),this.heroShadow.material.opacity=Ve(1-p*1.1,.5,1)}if(this.markerPulse>0){this.markerPulse=Math.max(0,this.markerPulse-t*1.4),this.marker.material.opacity=this.markerPulse*.9;let f=1+(1-this.markerPulse)*.7;this.marker.scale.set(f,f,1)}for(let f=this.sparkles.length-1;f>=0;f--){let p=this.sparkles[f];p.userData.life-=t*.9,p.userData.vel.y-=t*1.6,p.position.addScaledVector(p.userData.vel,t),p.material.opacity=Math.max(0,p.userData.life),p.userData.life<=0&&(this.sparkleGrupa.remove(p),this.sparkles.splice(f,1))}let u=this.lantern.userData,d=1+Math.sin(performance.now()*.003)*.12;u.light.intensity=9*d,u.glassMat.emissiveIntensity=1.1*d,this.mixer?.update(t),this.renderer.render(this.scene,this.camera)}korektaPolnocy(t){let n=Math.hypot(this.hp.x,this.hp.z)/this.planeta.R,i=Ve((2.4-n)/.8,0,1);if(i<=0)return;let r=this._v1.set(1,0,0).applyQuaternion(this.planeta.ramka(this.hp.x,this.hp.z,this._qTmp)).applyQuaternion(this.swiat.quaternion),o=Math.atan2(r.z,r.x);if(Math.abs(o)<1e-4)return;let a=(this.moveSpeed||0)>.05?UM:OM,c=o*(1-Math.exp(-a*i*t));this._qTmp.setFromAxisAngle(this._v2.set(0,1,0),c),this.swiat.quaternion.premultiply(this._qTmp)}_fasolaTik(t){this.oczko&&this.oczko.tik(t);let e=this.fasola;if(!e)return;let n=this.planeta.odleglosc(this.hn,e.n);if(e.update(t,n),!(this._kino||this.sequence)){if(this.oczko&&this.kropla&&!this.kropla.ile&&this.planeta.odleglosc(this.hn,this.oczko.n)<this.oczko.promien*.85){this.kropla.dodaj(),this.hint("Kropla wody!"),this.emit("woda:nabrana",{});try{navigator.vibrate?.([12,30,12])}catch{}}if(n<(e.def.zasieg??1.9))if(this.kropla?.ile&&!e.gotowa&&e.podlej()){this.kropla.oddaj(),this.hint(e.etap+1>=e.ostatni?"Fasola si\u0119ga chmur!":"Fasola ro\u015Bnie!"),this.emit("fasola:podlana",{etap:e.etap+1,etapow:e.ostatni}),this._wspUzbrojona=!1;try{navigator.vibrate?.([18,40,18])}catch{}this.input.lengthSq()<.02&&(this.moveSpeed||0)<.05&&!this.walking&&(this.play("happy",.12),this.sequence="happy",this.seqTimer=0)}else e.gotowa&&n<1.1&&this._wspUzbrojona&&this._wspinaczkaStart();else n>2.4&&(this._wspUzbrojona=!0)}}_wspinaczkaStart(){let t=this.fasola;this.stopWalk(),this.mode="free",this.sequence="wspinaczka",this.seqTimer=0,this._wsp={kat0:0},this._wspDodatek=0;let e=nn(t.n,this.hn,this.hf,this._v1),n=this._v2.set(1,0,0).applyQuaternion(this.planeta.ramka(t.def.pos[0],t.def.pos[1],this._qTmp));He(n,t.n);let r=su(n,e,t.n)-t.sciezka(0).kat;r=Math.atan2(Math.sin(r),Math.cos(r)),this._wsp.dk=r,this.play("run",.15),this.emit("fasola:wspinaczka",{wysokosc:t.wysokosc,dalej:t.def.dalej||null})}_wspinaczkaKlatka(t){let e=this.fasola,n=this._wsp;if(!e||!n){this.sequence=null;return}this.seqTimer+=t;let i=Math.min(1,this.seqTimer/Ys.czasWspinaczki),r=i*i*(3-2*i),o=e.sciezka(r),a=o.kat+n.dk*(1-Math.min(1,r/.12)),c=this.planeta.ramka(e.def.pos[0],e.def.pos[1],this._qTmp),l=this._v1.set(Math.cos(a),0,Math.sin(a)).applyQuaternion(c);He(l,e.n);let h=this.planeta.R;this._v2.copy(e.n).multiplyScalar(h+o.h).addScaledVector(l,o.r);let u=Math.max(.001,this._v2.length()),d=this._v3.crossVectors(l,e.n).normalize();if(this.hn.copy(this._v2).divideScalar(u),this.hf.copy(d),He(this.hf,this.hn),this.aktualizujHp(),this._wspDodatek=u-h,i>=1){this.sequence=null,this.play("happy",.2);let f=e.def.dalej||null;this.emit("swiat:dalej",{cel:f,z:"fasola"}),this._wspDodatek=0,this._wsp=null,this._wspUzbrojona=!1}}pauza(){this.paused||this.destroyed||(this.paused=!0,this.renderer.setAnimationLoop(null),this.emit("pauza"))}wznow(){!this.paused||this.destroyed||(this.paused=!1,this.clock.getDelta(),this.renderer.setAnimationLoop(()=>this.tick()),this.emit("wznowienie"))}ustawBohatera(t,e){return this.hero?(this._zasiewOstatnia=null,this._zasiewDroga=0,this.stopWalk(),this.mode="free",this.planeta.normalna(t,e,this.hn),He(this.hf,this.hn),this.aktualizujHp(),this.groundY=this.groundHeightAt(t,e),this.heroLift=this.groundY+(this.clipY?.[this.current]??0),this.syncHero(),!0):!1}ustawSpokojnyRuch(t){ri=!!t}ustawPowrotZnaku(t,e){let n=(this.markers||[]).find(i=>i.id===t);return n?(n.def.respawn=e===!1?1/0:Number(e),!0):!1}kino(t,e){if(!this.hero||ri)return!1;let n={wejscie:{trzym:1.9,powrot:1.5,kadr:1.7,luk:1.45,el:.2},bohater:{trzym:.9,powrot:1.1,kadr:2.6,luk:.8,el:.32},blysk:{trzym:.45,powrot:.75,kadr:3.4,luk:.45,el:.45}},i=n[t]||n.bohater;if(e){i=Object.assign({},i);for(let h in e)e[h]!=null&&(i[h]=e[h])}let r=this.hero.getWorldPosition(new b),o=new Ae().setFromObject(this.hero),a=Math.min(2.2,Math.max(.4,(o.max.y-r.y)*.86)),c=Math.max(.001,this.camera.right-this.camera.left),l=this.heading||0;return this._kino={faza:"trzym",t:0,trzymDl:i.trzym,powrotDl:i.powrot,gy:a,zoom:Math.max(1.05,c/(i.kadr||1.7)),az0:l-i.luk*.38,az1:l+i.luk*.62,el:i.el,br:this.camRight.clone(),bf:this.camFwd.clone()},this.mode="free",this.walking=!1,this.emit("kino",{ujecie:t}),!0}kinoSkroc(){let t=this._kino;return!t||t.faza!=="trzym"?!1:(t.pl=Math.min(1,t.t/Math.max(.001,t.trzymDl)),t.faza="powrot",t.t=0,t.powrotDl=.45,!0)}_kameraFasola(t){if(!this._camDirAkt){this._camDirAkt=this.camDir.clone();let r=Math.hypot(this.camDir.x,this.camDir.z);this._camDirBok=new b(this.camDir.x,r*Math.tan(XM),this.camDir.z).normalize().multiplyScalar(this.camDir.length()),this._kamF=0,this._camGora=0}let e=this.fasola,n=0;if(e&&e.def.kamera!==!1){let r=Math.min(1,e.wysokosc/2.5);if(this.sequence==="wspinaczka")n=1;else{let o=this.planeta.odleglosc(this.hn,e.n);n=Ve(1-(o-dp)/(qM-dp),0,1)*r}}this._kamF=qa(this._kamF,n,t,1.5),this._camDirAkt.lerpVectors(this.camDir,this._camDirBok,this._kamF);let i=e?e.wysokosc:0;this._camGora=this._kamF*Math.min(i*KM,YM)}_kinoWejscie(){try{let t="ewolucja.kino.wejscie";if(sessionStorage.getItem(t))return;sessionStorage.setItem(t,"1")}catch{}this.kino("wejscie")}_kinoKlatka(t){this._kc||(this._kc=new b),this._kcT||(this._kcT=new b),this._kc.set(this.camTarget.x,this.camTarget.y+.8+(this._camGora||0),this.camTarget.z);let e=this._kino;if(!e||!this.hero){let h=1-ZM*(this._kamF||0);Math.abs(this.camera.zoom-h)>1e-4&&(this.camera.zoom=h,this.camera.updateProjectionMatrix());return}e.t+=t;let n,i;if(e.faza==="trzym")i=Math.min(1,e.t/Math.max(.001,e.trzymDl)),n=1,e.t>=e.trzymDl&&(e.faza="powrot",e.t=0);else{i=e.pl!=null?e.pl:1;let h=Math.min(1,e.t/Math.max(.001,e.powrotDl));if(n=1-h*h*(3-2*h),e.t>=e.powrotDl){this._kino=null,this.camRight.copy(e.br),this.camFwd.copy(e.bf),this.camera.zoom!==1&&(this.camera.zoom=1,this.camera.updateProjectionMatrix());return}}let r=i*i*(3-2*i),o=e.az0+(e.az1-e.az0)*r,a=e.el,c=this.hero.getWorldPosition(this._kcH||(this._kcH=new b));this._kcT.set(c.x,c.y+e.gy,c.z),this._kc.lerp(this._kcT,n),this._kcT.set(Math.sin(o)*Math.cos(a),Math.sin(a),Math.cos(o)*Math.cos(a)).multiplyScalar(26).add(this._kc),this.camPos.lerp(this._kcT,n);let l=1+(e.zoom-1)*n;Math.abs(this.camera.zoom-l)>1e-4&&(this.camera.zoom=l,this.camera.updateProjectionMatrix())}pokazZnak(t){let e=(this.markers||[]).find(n=>n.id===t);return!e||e.state!=="gone"?!1:(e.state="appear",e.phase=0,e.setVisible(!0),!0)}schowajZnak(t){let e=(this.markers||[]).find(n=>n.id===t);return e?e.startAbsorb(!0):!1}stan(){return{gotowa:!!this.hero,pauza:this.paused,animacja:this.current,predkosc:+(this.moveSpeed||0).toFixed(3),zasiew:{wlaczony:this.zasiewWlaczony,...this.kwiaty?.stanZasiewu()},fasola:this.fasola?{etap:this.fasola.etap,etapow:this.fasola.ostatni,gotowa:this.fasola.gotowa,kropla:!!this.kropla?.ile}:null,bohater:this.hero?{x:+this.hp.x.toFixed(2),z:+this.hp.z.toFixed(2)}:null,znaki:(this.markers||[]).map(t=>({id:t.id,stan:t.state,dotkniecia:t.touches}))}}zniszcz(){this.destroyed||(this.destroyed=!0,this.renderer.setAnimationLoop(null),removeEventListener("resize",this.onWinResize),this.onKeyDown&&(removeEventListener("keydown",this.onKeyDown),removeEventListener("keyup",this.onKeyUp),removeEventListener("blur",this.onBlur)),this.ro?.disconnect(),this.scene.traverse(t=>{t.geometry?.dispose?.();let e=t.material?Array.isArray(t.material)?t.material:[t.material]:[];for(let n of e){for(let i of["map","emissiveMap","normalMap","roughnessMap","metalnessMap"])n[i]?.dispose?.();n.dispose?.()}}),this.mixer?.stopAllAction(),this.renderer.dispose(),this.listeners.clear(),this.emit("zniszczona"))}resize(){if(this.destroyed)return;let t=this.host.getBoundingClientRect(),e=Math.max(1,Math.round(t.width||innerWidth)),n=Math.max(1,Math.round(t.height||innerHeight));this.renderer.setSize(e,n);let i=e/n,r=Number(globalThis.SCENA3D_ZOOM)||Number(this.mapa?.zoom)||FM,o=i>=1,a=o?14:8.4,c=this.planeta?.R||8,l=Number(globalThis.SCENA3D_KAMERA_PODNIESIENIE)||(o?Number(globalThis.SCENA3D_KAMERA_PODNIESIENIE_POZIOM)||c*(this.mapa?.dolnyDok===!1?WM:GM):this.mapa?.kameraPodniesienie??c*up);this.camTarget&&Math.abs(this.camTarget.y-(c+l))>1e-6&&(this.camTarget.y=c+l,this.camPos&&(this.camPos.copy(this.camTarget).add(this.camDir),this.camera.position.copy(this.camPos),this.camera.lookAt(this.camTarget)));let u=Math.max(.5,(o?HM:BM)*c-l*VM),d=a/(i*2*u),f=Math.max(.3,Math.min(r,d)),p=a/f,_=p/i;this.camera.left=-p/2,this.camera.right=p/2,this.camera.top=_/2,this.camera.bottom=-_/2,this.camera.updateProjectionMatrix(),this.hero&&this.updateCameraBasis()}};var QM=`
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
`;function pp({tekstLadowania:s="\u0141adowanie bohatera\u2026",tekstPodpowiedzi:t="Przesu\u0144 palcem, by i\u015B\u0107 w dowoln\u0105 stron\u0119"}={}){return`
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
</div>`}var fp=!1;function mp(s){if(fp||s.querySelector("style[data-scena3d]"))return;let t=s.createElement("style");t.dataset.scena3d="1",t.textContent=QM,s.head.appendChild(t),fp=!0}var hb=["gotowa","minigra:start","znak:dotkniety","bohater:doszedl","latarnia:reakcja","doba:pora","swiatlo:zebrane","woda:nabrana","fasola:podlana","fasola:wspinaczka","swiat:dalej","pauza","wznowienie","zniszczona","blad"];async function tw(s={}){let t=typeof s.kontener=="string"?document.querySelector(s.kontener):s.kontener||document.body;if(!t)throw new Error("Scena 3D: nie znalaz\u0142em kontenera");let e=t.ownerDocument||document;mp(e);let n=e.createElement("div");n.className="scena3d-root"+(s.panel===!1?" bez-panelu":""),n.innerHTML=pp(s.teksty||{}),t.appendChild(n);let i=new Ya(n,{zasoby:s.zasoby,spokojnyRuch:s.spokojnyRuch,klawiatura:s.klawiatura,onEvent:s.onZdarzenie}),r={element:n,on:(o,a)=>i.on(o,a),off:(o,a)=>i.off(o,a),pauza:()=>i.pauza(),wznow:()=>i.wznow(),ustawBohatera:(o,a)=>i.ustawBohatera(o,a),ustawSpokojnyRuch:o=>i.ustawSpokojnyRuch(o),ustawZasiew:o=>i.ustawZasiew(o),ustawPowrotZnaku:(o,a)=>i.ustawPowrotZnaku(o,a),pokazZnak:o=>i.pokazZnak(o),kino:(o,a)=>i.kino(o,a),kinoSkroc:()=>i.kinoSkroc(),stan:()=>i.stan(),zniszcz:()=>{i.zniszcz(),n.remove()},_app:i};try{globalThis.__SCENA=r}catch{}try{await i.gotowa}catch(o){console.error("Scena 3D: nie uda\u0142o si\u0119 wczyta\u0107 modeli",o),r.blad=String(o?.message||o)}return r}function ub(s="ewolucja-scena-3d"){if(typeof customElements>"u"||customElements.get(s))return;class t extends HTMLElement{async connectedCallback(){if(!this._api){this.style.display=this.style.display||"block",this._api=await tw({kontener:this,zasoby:this.getAttribute("zasoby")||void 0,panel:!this.hasAttribute("bez-panelu"),klawiatura:!this.hasAttribute("bez-klawiatury"),spokojnyRuch:this.hasAttribute("spokojny-ruch")?!0:void 0});for(let n of["pauza","wznow","ustawBohatera","ustawSpokojnyRuch","ustawZasiew","ustawPowrotZnaku","pokazZnak","stan"])this[n]=(...i)=>this._api[n](...i);this.dispatchEvent(new CustomEvent("scena3d:zamontowana",{bubbles:!0}))}}disconnectedCallback(){this._api?.zniszcz(),this._api=null}}customElements.define(s,t)}function db(s,t="*"){if(typeof window>"u"||window.parent===window)return()=>{};let e=s.on("*",i=>{window.parent.postMessage({scena3d:"zdarzenie",nazwa:i.nazwa,dane:i},t)}),n=i=>{let r=i.data;if(!r||r.scena3d!=="komenda"||typeof s[r.metoda]!="function")return;let o=s[r.metoda](...r.argumenty||[]);window.parent.postMessage({scena3d:"odpowiedz",metoda:r.metoda,wynik:o},t)};return addEventListener("message",n),window.parent.postMessage({scena3d:"gotowa"},t),()=>{e(),removeEventListener("message",n)}}export{hb as ZDARZENIA,db as mostIframe,tw as utworzScena3D,ub as zarejestrujElement};
