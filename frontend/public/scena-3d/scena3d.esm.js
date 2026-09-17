/*!
 * EwolucJA — gra edukacyjna dla dzieci.
 * © 2026 Amitiel Angelisme. Wszelkie prawa zastrzeżone.
 * Powstało w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”.
 * Prawa autorskie należą do autora. Pełna nota: LICENSE.
 *
 * Scena 3D (planeta). Źródła: frontend/scena-3d-src/. NIE EDYTOWAĆ RĘCZNIE.
 */
var bm=Object.defineProperty;var Sm=(s,t)=>()=>(s&&(t=s(s=0)),t);var Am=(s,t)=>{for(var e in t)bm(s,e,{get:t[e],enumerable:!0})};var im={};Am(im,{otworzEdytorDomku:()=>nm});function ce(s,t,e={}){let n=Object.assign(document.createElement(t),e);return s?.appendChild(n),n}function sd(s,t,e,{min:n,max:i,krok:r},o){let a=ce(s,"div",{className:"rzad"});ce(a,"span",{textContent:t,title:t});let c=ce(a,"input",{type:"range",min:n,max:i,step:r,value:e}),l=ce(a,"input",{type:"number",min:n,max:i,step:r,value:Number(e).toFixed(3)}),h=(u,d)=>{let f=Number(u);Number.isFinite(f)&&(d!==c&&(c.value=String(f)),d!==l&&(l.value=f.toFixed(3)),o(f))};return c.addEventListener("input",()=>h(c.value,c)),l.addEventListener("input",()=>h(l.value,l)),{ustaw:u=>{c.value=String(u),l.value=Number(u).toFixed(3)}}}function nm(s){if(!s)return null;if(s._edytorDomku)return s._edytorDomku.zamknij(),null;document.getElementById(`${ke}-styl`)||ce(document.head,"style",{id:`${ke}-styl`,textContent:lM});let t=ce(document.body,"div",{className:ke}),e=ce(t,"header");ce(e,"b",{textContent:"Drzewo z domkiem"});let n=ce(e,"button",{textContent:"\u2715",title:"zamknij"}),i=ce(t,"div",{className:"info"}),r=M=>{i.textContent=M},o=()=>{s.przebudujDomek(),r("zmienione \u2014 pami\u0119taj o \u201EZapisz do mapy\u201D")},a=s.ukladDomku?.()||{},c=ce(t,"section");ce(c,"h4",{textContent:"Pie\u0144 (model tree.glb)"});for(let[M,T,R,P,w]of oM)sd(c,T,a[M],{min:R,max:P,krok:w},b=>{a[M]=b,o()});let l=ce(t,"section");ce(l,"h4",{textContent:"Pomost, barierka, drabinka"});let h=ce(l,"div",{className:"info",style:"padding:0 0 6px"});h.textContent="Wida\u0107 dopiero, gdy domek jest zbudowany.";for(let[M,T,R,P,w]of aM)sd(l,T,a[M],{min:R,max:P,krok:w},b=>{a[M]=b,o()});let u=ce(t,"section"),d=ce(u,"h4",{textContent:"Kule li\u015Bci"}),f=ce(u,"div"),p=()=>{f.textContent="",d.textContent=`Kule li\u015Bci (${a.korony.length})`,a.korony.forEach((M,T)=>{let R=ce(f,"div",{className:"kula"}),P=ce(R,"div",{className:"glowa"});ce(P,"b",{textContent:`kula ${T+1}`});let w=ce(P,"button",{textContent:M[4]?"jasna":"ciemna"});w.addEventListener("click",()=>{M[4]=M[4]?0:1,w.textContent=M[4]?"jasna":"ciemna",o()}),ce(P,"button",{textContent:"\uFF0B",title:"zduplikuj"}).addEventListener("click",()=>{a.korony.splice(T+1,0,[M[0]+.3,M[1],M[2]+.3,M[3],M[4]]),p(),o()}),ce(P,"button",{textContent:"\u2715",title:"usu\u0144"}).addEventListener("click",()=>{if(a.korony.length<=1){r("ostatniej kuli nie usuwam");return}a.korony.splice(T,1),p(),o()});for(let[C,U,K,B]of cM)sd(R,U,M[C],{min:K,max:B,krok:.01},Q=>{M[C]=Q,o()})})};p();let y=ce(t,"footer"),m=()=>({obrotModelu:+Number(a.obrotModelu).toFixed(4),skalaModelu:+Number(a.skalaModelu).toFixed(4),zanurzeniePnia:+Number(a.zanurzeniePnia).toFixed(3),klepiskoR:+Number(a.klepiskoR).toFixed(3),poziom:+Number(a.poziom).toFixed(3),zasiegKonaru:+Number(a.zasiegKonaru).toFixed(3),pomostOd:+Number(a.pomostOd).toFixed(3),pomostPol:+Number(a.pomostPol).toFixed(3),pienX:+Number(a.pienX||0).toFixed(3),pienY:+Number(a.pienY||0).toFixed(3),pienZ:+Number(a.pienZ||0).toFixed(3),barierka:+Number(a.barierka).toFixed(3),drabinkaOdsun:+Number(a.drabinkaOdsun).toFixed(3),drabinkaDlugosc:+Number(a.drabinkaDlugosc??1).toFixed(3),korony:a.korony.map(M=>[+Number(M[0]).toFixed(3),+Number(M[1]).toFixed(3),+Number(M[2]).toFixed(3),+Number(M[3]).toFixed(3),M[4]?1:0])});ce(y,"button",{className:"glowny",textContent:"Zapisz do mapy"}).addEventListener("click",async()=>{let M=s.mapa?.surowa;if(!M||!M.schronienie){r("mapa nie ma wpisu `schronienie`");return}M.schronienie.uklad=m();let R=(globalThis.__SCENA3D_PLIK_MAPY||"").split("/").pop();if(!R){r("nie wiem, do kt\xF3rego pliku mapy zapisa\u0107");return}try{let w=await(await fetch(`/__mapa?plik=${encodeURIComponent(R)}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(M)})).json();r(w.ok?`zapisane \u2192 ${w.plik}`:`b\u0142\u0105d zapisu: ${w.blad}`)}catch{r("zapis dzia\u0142a tylko przy npm run dev \u2014 u\u017Cyj \u201EKopiuj JSON\u201D")}}),ce(y,"button",{textContent:"Kopiuj JSON"}).addEventListener("click",async()=>{let M=JSON.stringify(m(),null,2);try{await navigator.clipboard.writeText(M),r("JSON w schowku")}catch{console.log(`[edytor domku] uklad:
`+M),r("schowek niedost\u0119pny \u2014 JSON jest w konsoli")}}),ce(y,"button",{textContent:"Domy\u015Blne"}).addEventListener("click",()=>{s.mapa?.surowa?.schronienie&&delete s.mapa.surowa.schronienie.uklad,s.mapa?.schronienie&&delete s.mapa.schronienie.uklad;let M=s.przebudujDomek(hM(s));M&&(Object.assign(a,M),a.korony=M.korony),v(),r("wr\xF3cone do warto\u015Bci z kodu (mapa wyczyszczona \u2014 zapisz, \u017Ceby zosta\u0142o)")}),ce(y,"button",{textContent:"Zamknij"}).addEventListener("click",()=>k.zamknij()),n.addEventListener("click",()=>k.zamknij());function v(){k.zamknij(),nm(s)}let k={zamknij(){t.remove(),s._edytorDomku===k&&(s._edytorDomku=null)}};return s._edytorDomku=k,r("suwak rusza drzewem od razu"),k}function hM(s){return s.ukladDomkuDomyslny?.()||null}var ke,oM,aM,cM,lM,sm=Sm(()=>{ke="edytor-domku",oM=[["obrotModelu","obr\xF3t pnia",0,6.283,.005],["skalaModelu","skala modelu",.3,1.2,.005],["zanurzeniePnia","zanurzenie w ziemi",0,1,.01],["pienX","pie\u0144: x",-2,2,.01],["pienY","pie\u0144: y (g\xF3ra)",-1.5,1.5,.01],["pienZ","pie\u0144: z",-2,2,.01]],aM=[["poziom","wysoko\u015B\u0107 desek",1.2,4,.01],["zasiegKonaru","zasi\u0119g konaru",.8,3,.01],["pomostOd","pocz\u0105tek desek",0,1.5,.01],["pomostPol","p\xF3\u0142 szeroko\u015Bci",.25,1.2,.01],["klepiskoR","klepisko: promie\u0144",.4,2.5,.01],["barierka","wysoko\u015B\u0107 barierki",.1,1.2,.01],["drabinkaOdsun","odsuni\u0119cie drabinki",.1,1.6,.01],["drabinkaDlugosc","d\u0142ugo\u015B\u0107 drabinki",.6,1.8,.01]],cM=[[0,"x",-4,4],[1,"y",0,6],[2,"z",-4,4],[3,"r",.15,1.6]],lM=`
.${ke}{position:fixed;top:12px;right:12px;width:330px;max-height:calc(100vh - 24px);
  overflow:auto;z-index:99999;background:#14181fee;color:#e8e3d8;border:1px solid #3a4250;
  border-radius:10px;font:12px/1.35 ui-monospace,Menlo,Consolas,monospace;
  box-shadow:0 10px 34px #0009;backdrop-filter:blur(3px)}
.${ke} header{display:flex;align-items:center;gap:8px;padding:8px 10px;
  border-bottom:1px solid #2b323d;position:sticky;top:0;background:#171c24f5}
.${ke} header b{flex:1;font-weight:600;letter-spacing:.02em}
.${ke} button{background:#2a3240;color:#e8e3d8;border:1px solid #3d4757;border-radius:6px;
  padding:4px 8px;cursor:pointer;font:inherit}
.${ke} button:hover{background:#36404f}
.${ke} button.glowny{background:#3d6b46;border-color:#4e8759}
.${ke} section{padding:8px 10px;border-bottom:1px solid #222831}
.${ke} h4{margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#8d9aad}
.${ke} .rzad{display:grid;grid-template-columns:96px 1fr 66px;gap:6px;align-items:center;margin:3px 0}
.${ke} .rzad span{color:#a9b4c4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px}
.${ke} input[type=range]{width:100%;accent-color:#6fa87c;min-width:0}
.${ke} input[type=number]{width:100%;box-sizing:border-box;background:#0f1319;color:#e8e3d8;
  border:1px solid #333c49;border-radius:4px;padding:2px 4px;font:inherit;text-align:right}
.${ke} .kula{border:1px solid #29303b;border-radius:7px;padding:6px;margin:6px 0;background:#0f141b}
.${ke} .kula .glowa{display:flex;align-items:center;gap:6px;margin-bottom:4px;color:#8d9aad}
.${ke} .kula .glowa b{flex:1;color:#c9d2e0;font-weight:600}
.${ke} footer{padding:8px 10px;display:flex;flex-wrap:wrap;gap:6px}
.${ke} .info{padding:0 10px 8px;color:#8d9aad;min-height:15px}
`});globalThis.SCENA3D_POSTACIE=globalThis.SCENA3D_POSTACIE||{fox:{plik:"fox",klipy:{NlaTrack:"run","NlaTrack.001":"walk","NlaTrack.002":"idle","NlaTrack.003":"happy"},tempo:{run:1.29},wyglad:{tint:.85,env:.38}}};globalThis.__SCENA3D_POSTAC=function(){let s=globalThis.SCENA3D_POSTAC||"fox";return globalThis.SCENA3D_POSTACIE[s]||globalThis.SCENA3D_POSTACIE.fox};function _d(){return globalThis.__SCENA3D_POSTAC()}var Ih="169";var Tm=0,xd=1,Em=2;var Ff=1,Lh=2,Jn=3,Fn=0,je=1,de=2,Ei=0,Ls=1,Dn=2,wd=3,ia=4,zm=5,Yi=100,Rm=101,km=102,Cm=103,Pm=104,Im=200,Lm=201,Dm=202,Nm=203,ul=204,dl=205,Um=206,Om=207,Fm=208,Bm=209,Hm=210,Vm=211,Gm=212,Wm=213,Xm=214,fl=0,pl=1,ml=2,Os=3,gl=4,yl=5,_l=6,xl=7,Dh=0,Km=1,jm=2,zi=0,qm=1,Ym=2,Zm=3,Nh=4,$m=5,Jm=6,Qm=7,vd="attached",t0="detached",Bf=300,Fs=301,Bs=302,Nr=303,wl=304,Ha=306,Bn=1e3,ti=1001,Ur=1002,Ke=1003,Uh=1004;var Rs=1005;var rn=1006,Rr=1007;var On=1008;var ni=1009,Hf=1010,Vf=1011,Or=1012,Oh=1013,Ji=1014,Ln=1015,Jr=1016,Fh=1017,Bh=1018,Hs=1020,Gf=35902,Wf=1021,Xf=1022,wn=1023,Kf=1024,jf=1025,Ds=1026,Vs=1027,Hh=1028,Vh=1029,qf=1030,Gh=1031;var Wh=1033,$o=33776,Jo=33777,Qo=33778,ta=33779,vl=35840,Ml=35841,bl=35842,Sl=35843,Al=36196,Tl=37492,El=37496,zl=37808,Rl=37809,kl=37810,Cl=37811,Pl=37812,Il=37813,Ll=37814,Dl=37815,Nl=37816,Ul=37817,Ol=37818,Fl=37819,Bl=37820,Hl=37821,ea=36492,Vl=36494,Gl=36495,Yf=36283,Wl=36284,Xl=36285,Kl=36286,Xh=2200,e0=2201,n0=2202,Gs=2300,Ws=2301,zc=2302,ks=2400,Cs=2401,sa=2402,Kh=2500,Zf=2501,$f=0,Va=1,Qr=2,i0=3200,s0=3201;var jh=0,r0=1,Si="",Vt="srgb",Be="srgb-linear",qh="display-p3",Ga="display-p3-linear",ra="linear",ye="srgb",oa="rec709",aa="p3";var hs=7680;var Md=519,o0=512,a0=513,c0=514,Jf=515,l0=516,h0=517,u0=518,d0=519,jl=35044,Qf=35048;var bd="300 es",ei=2e3,ca=2001,ii=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let i=this._listeners[t];if(i!==void 0){let r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}},We=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Sd=1234567,kr=Math.PI/180,Xs=180/Math.PI;function vn(){let s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(We[s&255]+We[s>>8&255]+We[s>>16&255]+We[s>>24&255]+"-"+We[t&255]+We[t>>8&255]+"-"+We[t>>16&15|64]+We[t>>24&255]+"-"+We[e&63|128]+We[e>>8&255]+"-"+We[e>>16&255]+We[e>>24&255]+We[n&255]+We[n>>8&255]+We[n>>16&255]+We[n>>24&255]).toLowerCase()}function Oe(s,t,e){return Math.max(t,Math.min(e,s))}function Yh(s,t){return(s%t+t)%t}function f0(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function p0(s,t,e){return s!==t?(e-s)/(t-s):0}function Cr(s,t,e){return(1-e)*s+e*t}function m0(s,t,e,n){return Cr(s,t,1-Math.exp(-e*n))}function g0(s,t=1){return t-Math.abs(Yh(s,t*2)-t)}function y0(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function _0(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function x0(s,t){return s+Math.floor(Math.random()*(t-s+1))}function w0(s,t){return s+Math.random()*(t-s)}function v0(s){return s*(.5-Math.random())}function M0(s){s!==void 0&&(Sd=s);let t=Sd+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function b0(s){return s*kr}function S0(s){return s*Xs}function A0(s){return(s&s-1)===0&&s!==0}function T0(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function E0(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function z0(s,t,e,n,i){let r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),d=o((t-n)/2),f=r((n-t)/2),p=o((n-t)/2);switch(i){case"XYX":s.set(a*h,c*u,c*d,a*l);break;case"YZY":s.set(c*d,a*h,c*u,a*l);break;case"ZXZ":s.set(c*u,c*d,a*h,a*l);break;case"XZX":s.set(a*h,c*p,c*f,a*l);break;case"YXY":s.set(c*f,a*h,c*p,a*l);break;case"ZYZ":s.set(c*p,c*f,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function In(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function ae(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}var tp={DEG2RAD:kr,RAD2DEG:Xs,generateUUID:vn,clamp:Oe,euclideanModulo:Yh,mapLinear:f0,inverseLerp:p0,lerp:Cr,damp:m0,pingpong:g0,smoothstep:y0,smootherstep:_0,randInt:x0,randFloat:w0,randFloatSpread:v0,seededRandom:M0,degToRad:b0,radToDeg:S0,isPowerOfTwo:A0,ceilPowerOfTwo:T0,floorPowerOfTwo:E0,setQuaternionFromProperEuler:z0,normalize:ae,denormalize:In},ot=class s{constructor(t=0,e=0){s.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Oe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ot=class s{constructor(t,e,n,i,r,o,a,c,l){s.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,c,l)}set(t,e,n,i,r,o,a,c,l){let h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],p=n[8],y=i[0],m=i[3],g=i[6],x=i[1],_=i[4],v=i[7],k=i[2],M=i[5],T=i[8];return r[0]=o*y+a*x+c*k,r[3]=o*m+a*_+c*M,r[6]=o*g+a*v+c*T,r[1]=l*y+h*x+u*k,r[4]=l*m+h*_+u*M,r[7]=l*g+h*v+u*T,r[2]=d*y+f*x+p*k,r[5]=d*m+f*_+p*M,r[8]=d*g+f*v+p*T,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+i*r*l-i*o*c}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,d=a*c-h*r,f=l*r-o*c,p=e*u+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/p;return t[0]=u*y,t[1]=(i*l-h*n)*y,t[2]=(a*n-i*o)*y,t[3]=d*y,t[4]=(h*e-i*c)*y,t[5]=(i*r-a*e)*y,t[6]=f*y,t[7]=(n*c-l*e)*y,t[8]=(o*e-n*r)*y,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-i*l,i*c,-i*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Rc.makeScale(t,e)),this}rotate(t){return this.premultiply(Rc.makeRotation(-t)),this}translate(t,e){return this.premultiply(Rc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Rc=new Ot;function ep(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Fr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function R0(){let s=Fr("canvas");return s.style.display="block",s}var Ad={};function na(s){s in Ad||(Ad[s]=!0,console.warn(s))}function k0(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function C0(s){let t=s.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function P0(s){let t=s.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}var Td=new Ot().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Ed=new Ot().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),gr={[Be]:{transfer:ra,primaries:oa,luminanceCoefficients:[.2126,.7152,.0722],toReference:s=>s,fromReference:s=>s},[Vt]:{transfer:ye,primaries:oa,luminanceCoefficients:[.2126,.7152,.0722],toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[Ga]:{transfer:ra,primaries:aa,luminanceCoefficients:[.2289,.6917,.0793],toReference:s=>s.applyMatrix3(Ed),fromReference:s=>s.applyMatrix3(Td)},[qh]:{transfer:ye,primaries:aa,luminanceCoefficients:[.2289,.6917,.0793],toReference:s=>s.convertSRGBToLinear().applyMatrix3(Ed),fromReference:s=>s.applyMatrix3(Td).convertLinearToSRGB()}},I0=new Set([Be,Ga]),Qt={enabled:!0,_workingColorSpace:Be,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!I0.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;let n=gr[t].toReference,i=gr[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return gr[s].primaries},getTransfer:function(s){return s===Si?ra:gr[s].transfer},getLuminanceCoefficients:function(s,t=this._workingColorSpace){return s.fromArray(gr[t].luminanceCoefficients)}};function Ns(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function kc(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var us,ql=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{us===void 0&&(us=Fr("canvas")),us.width=t.width,us.height=t.height;let n=us.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=us}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Fr("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Ns(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ns(e[n]/255)*255):e[n]=Ns(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},L0=0,la=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:L0++}),this.uuid=vn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(Cc(i[o].image)):r.push(Cc(i[o]))}else r=Cc(i);n.url=r}return e||(t.images[this.uuid]=n),n}};function Cc(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?ql.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var D0=0,Fe=class s extends ii{constructor(t=s.DEFAULT_IMAGE,e=s.DEFAULT_MAPPING,n=ti,i=ti,r=rn,o=On,a=wn,c=ni,l=s.DEFAULT_ANISOTROPY,h=Si){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:D0++}),this.uuid=vn(),this.name="",this.source=new la(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ot,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Bf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Bn:t.x=t.x-Math.floor(t.x);break;case ti:t.x=t.x<0?0:1;break;case Ur:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Bn:t.y=t.y-Math.floor(t.y);break;case ti:t.y=t.y<0?0:1;break;case Ur:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Fe.DEFAULT_IMAGE=null;Fe.DEFAULT_MAPPING=Bf;Fe.DEFAULT_ANISOTROPY=1;var $t=class s{constructor(t=0,e=0,n=0,i=1){s.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r,c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],p=c[9],y=c[2],m=c[6],g=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-y)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+y)<.1&&Math.abs(p+m)<.1&&Math.abs(l+f+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let _=(l+1)/2,v=(f+1)/2,k=(g+1)/2,M=(h+d)/4,T=(u+y)/4,R=(p+m)/4;return _>v&&_>k?_<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(_),i=M/n,r=T/n):v>k?v<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(v),n=M/i,r=R/i):k<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(k),n=T/r,i=R/r),this.set(n,i,r,e),this}let x=Math.sqrt((m-p)*(m-p)+(u-y)*(u-y)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(m-p)/x,this.y=(u-y)/x,this.z=(d-h)/x,this.w=Math.acos((l+f+g-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Yl=class extends ii{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new $t(0,0,t,e),this.scissorTest=!1,this.viewport=new $t(0,0,t,e);let i={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:rn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new Fe(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new la(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},si=class extends Yl{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},ha=class extends Fe{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ke,this.minFilter=Ke,this.wrapR=ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Zl=class extends Fe{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ke,this.minFilter=Ke,this.wrapR=ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ft=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3],d=r[o+0],f=r[o+1],p=r[o+2],y=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=p,t[e+3]=y;return}if(u!==y||c!==d||l!==f||h!==p){let m=1-a,g=c*d+l*f+h*p+u*y,x=g>=0?1:-1,_=1-g*g;if(_>Number.EPSILON){let k=Math.sqrt(_),M=Math.atan2(k,g*x);m=Math.sin(m*M)/k,a=Math.sin(a*M)/k}let v=a*x;if(c=c*m+d*v,l=l*m+f*v,h=h*m+p*v,u=u*m+y*v,m===1-a){let k=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=k,l*=k,h*=k,u*=k}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,r,o){let a=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=r[o],d=r[o+1],f=r[o+2],p=r[o+3];return t[e]=a*p+h*u+c*f-l*d,t[e+1]=c*p+h*d+l*u-a*f,t[e+2]=l*p+h*f+a*d-c*u,t[e+3]=h*p-a*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(i/2),u=a(r/2),d=c(n/2),f=c(i/2),p=c(r/2);switch(o){case"XYZ":this._x=d*h*u+l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u+d*f*p;break;case"YZX":this._x=d*h*u+l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u-d*f*p;break;case"XZY":this._x=d*h*u-l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u+d*f*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(o-i)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-c)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+l)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-l)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(c+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-i)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Oe(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+i*l-r*c,this._y=i*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-i*a,this._w=o*h-n*a-i*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,i=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+i*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*i+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},S=class s{constructor(t=0,e=0,n=0){s.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(zd.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(zd.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*i-a*n),h=2*(a*e-r*i),u=2*(r*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=i+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=i*c-r*a,this.y=r*o-n*c,this.z=n*a-i*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Pc.copy(this).projectOnVector(t),this.sub(Pc)}reflect(t){return this.sub(Pc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Oe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Pc=new S,zd=new Ft,Ee=class{constructor(t=new S(1/0,1/0,1/0),e=new S(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(kn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(kn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=kn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,kn):kn.fromBufferAttribute(r,o),kn.applyMatrix4(t.matrixWorld),this.expandByPoint(kn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),xo.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),xo.copy(n.boundingBox)),xo.applyMatrix4(t.matrixWorld),this.union(xo)}let i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,kn),kn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(yr),wo.subVectors(this.max,yr),ds.subVectors(t.a,yr),fs.subVectors(t.b,yr),ps.subVectors(t.c,yr),_i.subVectors(fs,ds),xi.subVectors(ps,fs),Vi.subVectors(ds,ps);let e=[0,-_i.z,_i.y,0,-xi.z,xi.y,0,-Vi.z,Vi.y,_i.z,0,-_i.x,xi.z,0,-xi.x,Vi.z,0,-Vi.x,-_i.y,_i.x,0,-xi.y,xi.x,0,-Vi.y,Vi.x,0];return!Ic(e,ds,fs,ps,wo)||(e=[1,0,0,0,1,0,0,0,1],!Ic(e,ds,fs,ps,wo))?!1:(vo.crossVectors(_i,xi),e=[vo.x,vo.y,vo.z],Ic(e,ds,fs,ps,wo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,kn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(kn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Kn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Kn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Kn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Kn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Kn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Kn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Kn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Kn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Kn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Kn=[new S,new S,new S,new S,new S,new S,new S,new S],kn=new S,xo=new Ee,ds=new S,fs=new S,ps=new S,_i=new S,xi=new S,Vi=new S,yr=new S,wo=new S,vo=new S,Gi=new S;function Ic(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Gi.fromArray(s,r);let a=i.x*Math.abs(Gi.x)+i.y*Math.abs(Gi.y)+i.z*Math.abs(Gi.z),c=t.dot(Gi),l=e.dot(Gi),h=n.dot(Gi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var N0=new Ee,_r=new S,Lc=new S,un=class{constructor(t=new S,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):N0.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;_r.subVectors(t,this.center);let e=_r.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(_r,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Lc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(_r.copy(t.center).add(Lc)),this.expandByPoint(_r.copy(t.center).sub(Lc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},jn=new S,Dc=new S,Mo=new S,wi=new S,Nc=new S,bo=new S,Uc=new S,Qi=class{constructor(t=new S,e=new S(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,jn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=jn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(jn.copy(this.origin).addScaledVector(this.direction,e),jn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Dc.copy(t).add(e).multiplyScalar(.5),Mo.copy(e).sub(t).normalize(),wi.copy(this.origin).sub(Dc);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Mo),a=wi.dot(this.direction),c=-wi.dot(Mo),l=wi.lengthSq(),h=Math.abs(1-o*o),u,d,f,p;if(h>0)if(u=o*c-a,d=o*a-c,p=r*h,u>=0)if(d>=-p)if(d<=p){let y=1/h;u*=y,d*=y,f=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d<=-p?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=p?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Dc).addScaledVector(Mo,d),f}intersectSphere(t,e){jn.subVectors(t.center,this.origin);let n=jn.dot(this.direction),i=jn.dot(jn)-n*n,r=t.radius*t.radius;if(i>r)return null;let o=Math.sqrt(r-i),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,i=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,i=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||a>i)||((a>n||n!==n)&&(n=a),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,jn)!==null}intersectTriangle(t,e,n,i,r){Nc.subVectors(e,t),bo.subVectors(n,t),Uc.crossVectors(Nc,bo);let o=this.direction.dot(Uc),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;wi.subVectors(this.origin,t);let c=a*this.direction.dot(bo.crossVectors(wi,bo));if(c<0)return null;let l=a*this.direction.dot(Nc.cross(wi));if(l<0||c+l>o)return null;let h=-a*wi.dot(Uc);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Et=class s{constructor(t,e,n,i,r,o,a,c,l,h,u,d,f,p,y,m){s.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,c,l,h,u,d,f,p,y,m)}set(t,e,n,i,r,o,a,c,l,h,u,d,f,p,y,m){let g=this.elements;return g[0]=t,g[4]=e,g[8]=n,g[12]=i,g[1]=r,g[5]=o,g[9]=a,g[13]=c,g[2]=l,g[6]=h,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=y,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new s().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,i=1/ms.setFromMatrixColumn(t,0).length(),r=1/ms.setFromMatrixColumn(t,1).length(),o=1/ms.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=o*h,f=o*u,p=a*h,y=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+p*l,e[5]=d-y*l,e[9]=-a*c,e[2]=y-d*l,e[6]=p+f*l,e[10]=o*c}else if(t.order==="YXZ"){let d=c*h,f=c*u,p=l*h,y=l*u;e[0]=d+y*a,e[4]=p*a-f,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-p,e[6]=y+d*a,e[10]=o*c}else if(t.order==="ZXY"){let d=c*h,f=c*u,p=l*h,y=l*u;e[0]=d-y*a,e[4]=-o*u,e[8]=p+f*a,e[1]=f+p*a,e[5]=o*h,e[9]=y-d*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){let d=o*h,f=o*u,p=a*h,y=a*u;e[0]=c*h,e[4]=p*l-f,e[8]=d*l+y,e[1]=c*u,e[5]=y*l+d,e[9]=f*l-p,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){let d=o*c,f=o*l,p=a*c,y=a*l;e[0]=c*h,e[4]=y-d*u,e[8]=p*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=f*u+p,e[10]=d-y*u}else if(t.order==="XZY"){let d=o*c,f=o*l,p=a*c,y=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+y,e[5]=o*h,e[9]=f*u-p,e[2]=p*u-f,e[6]=a*h,e[10]=y*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(U0,t,O0)}lookAt(t,e,n){let i=this.elements;return ln.subVectors(t,e),ln.lengthSq()===0&&(ln.z=1),ln.normalize(),vi.crossVectors(n,ln),vi.lengthSq()===0&&(Math.abs(n.z)===1?ln.x+=1e-4:ln.z+=1e-4,ln.normalize(),vi.crossVectors(n,ln)),vi.normalize(),So.crossVectors(ln,vi),i[0]=vi.x,i[4]=So.x,i[8]=ln.x,i[1]=vi.y,i[5]=So.y,i[9]=ln.y,i[2]=vi.z,i[6]=So.z,i[10]=ln.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],p=n[2],y=n[6],m=n[10],g=n[14],x=n[3],_=n[7],v=n[11],k=n[15],M=i[0],T=i[4],R=i[8],P=i[12],w=i[1],b=i[5],I=i[9],C=i[13],U=i[2],K=i[6],B=i[10],Q=i[14],G=i[3],ct=i[7],at=i[11],gt=i[15];return r[0]=o*M+a*w+c*U+l*G,r[4]=o*T+a*b+c*K+l*ct,r[8]=o*R+a*I+c*B+l*at,r[12]=o*P+a*C+c*Q+l*gt,r[1]=h*M+u*w+d*U+f*G,r[5]=h*T+u*b+d*K+f*ct,r[9]=h*R+u*I+d*B+f*at,r[13]=h*P+u*C+d*Q+f*gt,r[2]=p*M+y*w+m*U+g*G,r[6]=p*T+y*b+m*K+g*ct,r[10]=p*R+y*I+m*B+g*at,r[14]=p*P+y*C+m*Q+g*gt,r[3]=x*M+_*w+v*U+k*G,r[7]=x*T+_*b+v*K+k*ct,r[11]=x*R+_*I+v*B+k*at,r[15]=x*P+_*C+v*Q+k*gt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],p=t[3],y=t[7],m=t[11],g=t[15];return p*(+r*c*u-i*l*u-r*a*d+n*l*d+i*a*f-n*c*f)+y*(+e*c*f-e*l*d+r*o*d-i*o*f+i*l*h-r*c*h)+m*(+e*l*u-e*a*f-r*o*u+n*o*f+r*a*h-n*l*h)+g*(-i*a*h-e*c*u+e*a*d+i*o*u-n*o*d+n*c*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],p=t[12],y=t[13],m=t[14],g=t[15],x=u*m*l-y*d*l+y*c*f-a*m*f-u*c*g+a*d*g,_=p*d*l-h*m*l-p*c*f+o*m*f+h*c*g-o*d*g,v=h*y*l-p*u*l+p*a*f-o*y*f-h*a*g+o*u*g,k=p*u*c-h*y*c-p*a*d+o*y*d+h*a*m-o*u*m,M=e*x+n*_+i*v+r*k;if(M===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let T=1/M;return t[0]=x*T,t[1]=(y*d*r-u*m*r-y*i*f+n*m*f+u*i*g-n*d*g)*T,t[2]=(a*m*r-y*c*r+y*i*l-n*m*l-a*i*g+n*c*g)*T,t[3]=(u*c*r-a*d*r-u*i*l+n*d*l+a*i*f-n*c*f)*T,t[4]=_*T,t[5]=(h*m*r-p*d*r+p*i*f-e*m*f-h*i*g+e*d*g)*T,t[6]=(p*c*r-o*m*r-p*i*l+e*m*l+o*i*g-e*c*g)*T,t[7]=(o*d*r-h*c*r+h*i*l-e*d*l-o*i*f+e*c*f)*T,t[8]=v*T,t[9]=(p*u*r-h*y*r-p*n*f+e*y*f+h*n*g-e*u*g)*T,t[10]=(o*y*r-p*a*r+p*n*l-e*y*l-o*n*g+e*a*g)*T,t[11]=(h*a*r-o*u*r-h*n*l+e*u*l+o*n*f-e*a*f)*T,t[12]=k*T,t[13]=(h*y*i-p*u*i+p*n*d-e*y*d-h*n*m+e*u*m)*T,t[14]=(p*a*i-o*y*i-p*n*c+e*y*c+o*n*m-e*a*m)*T,t[15]=(o*u*i-h*a*i+h*n*c-e*u*c-o*n*d+e*a*d)*T,this}scale(t){let e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-i*c,l*c+i*a,0,l*a+i*c,h*a+n,h*c-i*o,0,l*c-i*a,h*c+i*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,d=r*l,f=r*h,p=r*u,y=o*h,m=o*u,g=a*u,x=c*l,_=c*h,v=c*u,k=n.x,M=n.y,T=n.z;return i[0]=(1-(y+g))*k,i[1]=(f+v)*k,i[2]=(p-_)*k,i[3]=0,i[4]=(f-v)*M,i[5]=(1-(d+g))*M,i[6]=(m+x)*M,i[7]=0,i[8]=(p+_)*T,i[9]=(m-x)*T,i[10]=(1-(d+y))*T,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements,r=ms.set(i[0],i[1],i[2]).length(),o=ms.set(i[4],i[5],i[6]).length(),a=ms.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],Cn.copy(this);let l=1/r,h=1/o,u=1/a;return Cn.elements[0]*=l,Cn.elements[1]*=l,Cn.elements[2]*=l,Cn.elements[4]*=h,Cn.elements[5]*=h,Cn.elements[6]*=h,Cn.elements[8]*=u,Cn.elements[9]*=u,Cn.elements[10]*=u,e.setFromRotationMatrix(Cn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,i,r,o,a=ei){let c=this.elements,l=2*r/(e-t),h=2*r/(n-i),u=(e+t)/(e-t),d=(n+i)/(n-i),f,p;if(a===ei)f=-(o+r)/(o-r),p=-2*o*r/(o-r);else if(a===ca)f=-o/(o-r),p=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=p,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=ei){let c=this.elements,l=1/(e-t),h=1/(n-i),u=1/(o-r),d=(e+t)*l,f=(n+i)*h,p,y;if(a===ei)p=(o+r)*u,y=-2*u;else if(a===ca)p=r*u,y=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=y,c[14]=-p,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},ms=new S,Cn=new Et,U0=new S(0,0,0),O0=new S(1,1,1),vi=new S,So=new S,ln=new S,Rd=new Et,kd=new Ft,dn=class s{constructor(t=0,e=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,r=i[0],o=i[4],a=i[8],c=i[1],l=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(Oe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Oe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Oe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Oe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Oe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Oe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Rd.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Rd,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return kd.setFromEuler(this),this.setFromQuaternion(kd,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};dn.DEFAULT_ORDER="XYZ";var Br=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},F0=0,Cd=new S,gs=new Ft,qn=new Et,Ao=new S,xr=new S,B0=new S,H0=new Ft,Pd=new S(1,0,0),Id=new S(0,1,0),Ld=new S(0,0,1),Dd={type:"added"},V0={type:"removed"},ys={type:"childadded",child:null},Oc={type:"childremoved",child:null},fe=class s extends ii{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:F0++}),this.uuid=vn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let t=new S,e=new dn,n=new Ft,i=new S(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Et},normalMatrix:{value:new Ot}}),this.matrix=new Et,this.matrixWorld=new Et,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Br,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return gs.setFromAxisAngle(t,e),this.quaternion.multiply(gs),this}rotateOnWorldAxis(t,e){return gs.setFromAxisAngle(t,e),this.quaternion.premultiply(gs),this}rotateX(t){return this.rotateOnAxis(Pd,t)}rotateY(t){return this.rotateOnAxis(Id,t)}rotateZ(t){return this.rotateOnAxis(Ld,t)}translateOnAxis(t,e){return Cd.copy(t).applyQuaternion(this.quaternion),this.position.add(Cd.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Pd,t)}translateY(t){return this.translateOnAxis(Id,t)}translateZ(t){return this.translateOnAxis(Ld,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(qn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ao.copy(t):Ao.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),xr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?qn.lookAt(xr,Ao,this.up):qn.lookAt(Ao,xr,this.up),this.quaternion.setFromRotationMatrix(qn),i&&(qn.extractRotation(i.matrixWorld),gs.setFromRotationMatrix(qn),this.quaternion.premultiply(gs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Dd),ys.child=t,this.dispatchEvent(ys),ys.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(V0),Oc.child=t,this.dispatchEvent(Oc),Oc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),qn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),qn.multiply(t.parent.matrixWorld)),t.applyMatrix4(qn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Dd),ys.child=t,this.dispatchEvent(ys),ys.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xr,t,B0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xr,H0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];i.animations.push(r(t.animations,c))}}if(e){let a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),p=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}};fe.DEFAULT_UP=new S(0,1,0);fe.DEFAULT_MATRIX_AUTO_UPDATE=!0;fe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Pn=new S,Yn=new S,Fc=new S,Zn=new S,_s=new S,xs=new S,Nd=new S,Bc=new S,Hc=new S,Vc=new S,Gc=new $t,Wc=new $t,Xc=new $t,Ai=class s{constructor(t=new S,e=new S,n=new S){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Pn.subVectors(t,e),i.cross(Pn);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){Pn.subVectors(i,e),Yn.subVectors(n,e),Fc.subVectors(t,e);let o=Pn.dot(Pn),a=Pn.dot(Yn),c=Pn.dot(Fc),l=Yn.dot(Yn),h=Yn.dot(Fc),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(l*c-a*h)*d,p=(o*h-a*c)*d;return r.set(1-f-p,p,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Zn)===null?!1:Zn.x>=0&&Zn.y>=0&&Zn.x+Zn.y<=1}static getInterpolation(t,e,n,i,r,o,a,c){return this.getBarycoord(t,e,n,i,Zn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Zn.x),c.addScaledVector(o,Zn.y),c.addScaledVector(a,Zn.z),c)}static getInterpolatedAttribute(t,e,n,i,r,o){return Gc.setScalar(0),Wc.setScalar(0),Xc.setScalar(0),Gc.fromBufferAttribute(t,e),Wc.fromBufferAttribute(t,n),Xc.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(Gc,r.x),o.addScaledVector(Wc,r.y),o.addScaledVector(Xc,r.z),o}static isFrontFacing(t,e,n,i){return Pn.subVectors(n,e),Yn.subVectors(t,e),Pn.cross(Yn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Pn.subVectors(this.c,this.b),Yn.subVectors(this.a,this.b),Pn.cross(Yn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return s.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return s.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return s.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return s.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return s.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,r=this.c,o,a;_s.subVectors(i,n),xs.subVectors(r,n),Bc.subVectors(t,n);let c=_s.dot(Bc),l=xs.dot(Bc);if(c<=0&&l<=0)return e.copy(n);Hc.subVectors(t,i);let h=_s.dot(Hc),u=xs.dot(Hc);if(h>=0&&u<=h)return e.copy(i);let d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(_s,o);Vc.subVectors(t,r);let f=_s.dot(Vc),p=xs.dot(Vc);if(p>=0&&f<=p)return e.copy(r);let y=f*l-c*p;if(y<=0&&l>=0&&p<=0)return a=l/(l-p),e.copy(n).addScaledVector(xs,a);let m=h*p-f*u;if(m<=0&&u-h>=0&&f-p>=0)return Nd.subVectors(r,i),a=(u-h)/(u-h+(f-p)),e.copy(i).addScaledVector(Nd,a);let g=1/(m+y+d);return o=y*g,a=d*g,e.copy(n).addScaledVector(_s,o).addScaledVector(xs,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},np={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Mi={h:0,s:0,l:0},To={h:0,s:0,l:0};function Kc(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}var tt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Vt){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Qt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=Qt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Qt.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=Qt.workingColorSpace){if(t=Yh(t,1),e=Oe(e,0,1),n=Oe(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Kc(o,r,t+1/3),this.g=Kc(o,r,t),this.b=Kc(o,r,t-1/3)}return Qt.toWorkingColorSpace(this,i),this}setStyle(t,e=Vt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Vt){let n=np[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ns(t.r),this.g=Ns(t.g),this.b=Ns(t.b),this}copyLinearToSRGB(t){return this.r=kc(t.r),this.g=kc(t.g),this.b=kc(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Vt){return Qt.fromWorkingColorSpace(Xe.copy(this),t),Math.round(Oe(Xe.r*255,0,255))*65536+Math.round(Oe(Xe.g*255,0,255))*256+Math.round(Oe(Xe.b*255,0,255))}getHexString(t=Vt){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Qt.workingColorSpace){Qt.fromWorkingColorSpace(Xe.copy(this),e);let n=Xe.r,i=Xe.g,r=Xe.b,o=Math.max(n,i,r),a=Math.min(n,i,r),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(i-r)/u+(i<r?6:0);break;case i:c=(r-n)/u+2;break;case r:c=(n-i)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=Qt.workingColorSpace){return Qt.fromWorkingColorSpace(Xe.copy(this),e),t.r=Xe.r,t.g=Xe.g,t.b=Xe.b,t}getStyle(t=Vt){Qt.fromWorkingColorSpace(Xe.copy(this),t);let e=Xe.r,n=Xe.g,i=Xe.b;return t!==Vt?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Mi),this.setHSL(Mi.h+t,Mi.s+e,Mi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Mi),t.getHSL(To);let n=Cr(Mi.h,To.h,e),i=Cr(Mi.s,To.s,e),r=Cr(Mi.l,To.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Xe=new tt;tt.NAMES=np;var G0=0,Je=class extends ii{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:G0++}),this.uuid=vn(),this.name="",this.type="Material",this.blending=Ls,this.side=Fn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ul,this.blendDst=dl,this.blendEquation=Yi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new tt(0,0,0),this.blendAlpha=0,this.depthFunc=Os,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Md,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=hs,this.stencilZFail=hs,this.stencilZPass=hs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ls&&(n.blending=this.blending),this.side!==Fn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ul&&(n.blendSrc=this.blendSrc),this.blendDst!==dl&&(n.blendDst=this.blendDst),this.blendEquation!==Yi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Os&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Md&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==hs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==hs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==hs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(e){let r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},ne=class extends Je{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new tt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new dn,this.combine=Dh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Te=new S,Eo=new ot,Ce=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=jl,this.updateRanges=[],this.gpuType=Ln,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Eo.fromBufferAttribute(this,e),Eo.applyMatrix3(t),this.setXY(e,Eo.x,Eo.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix3(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix4(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.applyNormalMatrix(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.transformDirection(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=In(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ae(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=In(e,this.array)),e}setX(t,e){return this.normalized&&(e=ae(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=In(e,this.array)),e}setY(t,e){return this.normalized&&(e=ae(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=In(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ae(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=In(e,this.array)),e}setW(t,e){return this.normalized&&(e=ae(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ae(e,this.array),n=ae(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=ae(e,this.array),n=ae(n,this.array),i=ae(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=ae(e,this.array),n=ae(n,this.array),i=ae(i,this.array),r=ae(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==jl&&(t.usage=this.usage),t}};var ua=class extends Ce{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var da=class extends Ce{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var vt=class extends Ce{constructor(t,e,n){super(new Float32Array(t),e,n)}},W0=0,xn=new Et,jc=new fe,ws=new S,hn=new Ee,wr=new Ee,Ue=new S,Gt=class s extends ii{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:W0++}),this.uuid=vn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(ep(t)?da:ua)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ot().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return xn.makeRotationFromQuaternion(t),this.applyMatrix4(xn),this}rotateX(t){return xn.makeRotationX(t),this.applyMatrix4(xn),this}rotateY(t){return xn.makeRotationY(t),this.applyMatrix4(xn),this}rotateZ(t){return xn.makeRotationZ(t),this.applyMatrix4(xn),this}translate(t,e,n){return xn.makeTranslation(t,e,n),this.applyMatrix4(xn),this}scale(t,e,n){return xn.makeScale(t,e,n),this.applyMatrix4(xn),this}lookAt(t){return jc.lookAt(t),jc.updateMatrix(),this.applyMatrix4(jc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ws).negate(),this.translate(ws.x,ws.y,ws.z),this}setFromPoints(t){let e=[];for(let n=0,i=t.length;n<i;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new vt(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ee);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new S(-1/0,-1/0,-1/0),new S(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let r=e[n];hn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ue.addVectors(this.boundingBox.min,hn.min),this.boundingBox.expandByPoint(Ue),Ue.addVectors(this.boundingBox.max,hn.max),this.boundingBox.expandByPoint(Ue)):(this.boundingBox.expandByPoint(hn.min),this.boundingBox.expandByPoint(hn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new un);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new S,1/0);return}if(t){let n=this.boundingSphere.center;if(hn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];wr.setFromBufferAttribute(a),this.morphTargetsRelative?(Ue.addVectors(hn.min,wr.min),hn.expandByPoint(Ue),Ue.addVectors(hn.max,wr.max),hn.expandByPoint(Ue)):(hn.expandByPoint(wr.min),hn.expandByPoint(wr.max))}hn.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)Ue.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(Ue));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Ue.fromBufferAttribute(a,l),c&&(ws.fromBufferAttribute(t,l),Ue.add(ws)),i=Math.max(i,n.distanceToSquared(Ue))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,i=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ce(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let R=0;R<n.count;R++)a[R]=new S,c[R]=new S;let l=new S,h=new S,u=new S,d=new ot,f=new ot,p=new ot,y=new S,m=new S;function g(R,P,w){l.fromBufferAttribute(n,R),h.fromBufferAttribute(n,P),u.fromBufferAttribute(n,w),d.fromBufferAttribute(r,R),f.fromBufferAttribute(r,P),p.fromBufferAttribute(r,w),h.sub(l),u.sub(l),f.sub(d),p.sub(d);let b=1/(f.x*p.y-p.x*f.y);isFinite(b)&&(y.copy(h).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(b),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(b),a[R].add(y),a[P].add(y),a[w].add(y),c[R].add(m),c[P].add(m),c[w].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let R=0,P=x.length;R<P;++R){let w=x[R],b=w.start,I=w.count;for(let C=b,U=b+I;C<U;C+=3)g(t.getX(C+0),t.getX(C+1),t.getX(C+2))}let _=new S,v=new S,k=new S,M=new S;function T(R){k.fromBufferAttribute(i,R),M.copy(k);let P=a[R];_.copy(P),_.sub(k.multiplyScalar(k.dot(P))).normalize(),v.crossVectors(M,P);let b=v.dot(c[R])<0?-1:1;o.setXYZW(R,_.x,_.y,_.z,b)}for(let R=0,P=x.length;R<P;++R){let w=x[R],b=w.start,I=w.count;for(let C=b,U=b+I;C<U;C+=3)T(t.getX(C+0)),T(t.getX(C+1)),T(t.getX(C+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ce(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let i=new S,r=new S,o=new S,a=new S,c=new S,l=new S,h=new S,u=new S;if(t)for(let d=0,f=t.count;d<f;d+=3){let p=t.getX(d+0),y=t.getX(d+1),m=t.getX(d+2);i.fromBufferAttribute(e,p),r.fromBufferAttribute(e,y),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,p),c.fromBufferAttribute(n,y),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(y,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ue.fromBufferAttribute(t,e),Ue.normalize(),t.setXYZ(e,Ue.x,Ue.y,Ue.z)}toNonIndexed(){function t(a,c){let l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h),f=0,p=0;for(let y=0,m=c.length;y<m;y++){a.isInterleavedBufferAttribute?f=c[y]*a.data.stride+a.offset:f=c[y]*h;for(let g=0;g<h;g++)d[p++]=l[f++]}return new Ce(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new s,n=this.index.array,i=this.attributes;for(let a in i){let c=i[a],l=t(c,n);e.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){let d=l[h],f=t(d,n);c.push(f)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let i={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){let f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(i[c]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let i=t.attributes;for(let l in i){let h=i[l];this.setAttribute(l,h.clone(e))}let r=t.morphAttributes;for(let l in r){let h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let l=0,h=o.length;l<h;l++){let u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ud=new Et,Wi=new Qi,zo=new un,Od=new S,Ro=new S,ko=new S,Co=new S,qc=new S,Po=new S,Fd=new S,Io=new S,At=class extends fe{constructor(t=new Gt,e=new ne){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let a=this.morphTargetInfluences;if(r&&a){Po.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=a[c],u=r[c];h!==0&&(qc.fromBufferAttribute(u,t),o?Po.addScaledVector(qc,h):Po.addScaledVector(qc.sub(e),h))}e.add(Po)}return e}raycast(t,e){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),zo.copy(n.boundingSphere),zo.applyMatrix4(r),Wi.copy(t.ray).recast(t.near),!(zo.containsPoint(Wi.origin)===!1&&(Wi.intersectSphere(zo,Od)===null||Wi.origin.distanceToSquared(Od)>(t.far-t.near)**2))&&(Ud.copy(r).invert(),Wi.copy(t.ray).applyMatrix4(Ud),!(n.boundingBox!==null&&Wi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Wi)))}_computeIntersections(t,e,n){let i,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,y=d.length;p<y;p++){let m=d[p],g=o[m.materialIndex],x=Math.max(m.start,f.start),_=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let v=x,k=_;v<k;v+=3){let M=a.getX(v),T=a.getX(v+1),R=a.getX(v+2);i=Lo(this,g,t,n,l,h,u,M,T,R),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let p=Math.max(0,f.start),y=Math.min(a.count,f.start+f.count);for(let m=p,g=y;m<g;m+=3){let x=a.getX(m),_=a.getX(m+1),v=a.getX(m+2);i=Lo(this,o,t,n,l,h,u,x,_,v),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(c!==void 0)if(Array.isArray(o))for(let p=0,y=d.length;p<y;p++){let m=d[p],g=o[m.materialIndex],x=Math.max(m.start,f.start),_=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let v=x,k=_;v<k;v+=3){let M=v,T=v+1,R=v+2;i=Lo(this,g,t,n,l,h,u,M,T,R),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let p=Math.max(0,f.start),y=Math.min(c.count,f.start+f.count);for(let m=p,g=y;m<g;m+=3){let x=m,_=m+1,v=m+2;i=Lo(this,o,t,n,l,h,u,x,_,v),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}};function X0(s,t,e,n,i,r,o,a){let c;if(t.side===je?c=n.intersectTriangle(o,r,i,!0,a):c=n.intersectTriangle(i,r,o,t.side===Fn,a),c===null)return null;Io.copy(a),Io.applyMatrix4(s.matrixWorld);let l=e.ray.origin.distanceTo(Io);return l<e.near||l>e.far?null:{distance:l,point:Io.clone(),object:s}}function Lo(s,t,e,n,i,r,o,a,c,l){s.getVertexPosition(a,Ro),s.getVertexPosition(c,ko),s.getVertexPosition(l,Co);let h=X0(s,t,e,n,Ro,ko,Co,Fd);if(h){let u=new S;Ai.getBarycoord(Fd,Ro,ko,Co,u),i&&(h.uv=Ai.getInterpolatedAttribute(i,a,c,l,u,new ot)),r&&(h.uv1=Ai.getInterpolatedAttribute(r,a,c,l,u,new ot)),o&&(h.normal=Ai.getInterpolatedAttribute(o,a,c,l,u,new S),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:c,c:l,normal:new S,materialIndex:0};Ai.getNormal(Ro,ko,Co,d.normal),h.face=d,h.barycoord=u}return h}var ze=class s extends Gt{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};let a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],h=[],u=[],d=0,f=0;p("z","y","x",-1,-1,n,e,t,o,r,0),p("z","y","x",1,-1,n,e,-t,o,r,1),p("x","z","y",1,1,t,n,e,i,o,2),p("x","z","y",1,-1,t,n,-e,i,o,3),p("x","y","z",1,-1,t,e,n,i,r,4),p("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new vt(l,3)),this.setAttribute("normal",new vt(h,3)),this.setAttribute("uv",new vt(u,2));function p(y,m,g,x,_,v,k,M,T,R,P){let w=v/T,b=k/R,I=v/2,C=k/2,U=M/2,K=T+1,B=R+1,Q=0,G=0,ct=new S;for(let at=0;at<B;at++){let gt=at*b-C;for(let jt=0;jt<K;jt++){let Bt=jt*w-I;ct[y]=Bt*x,ct[m]=gt*_,ct[g]=U,l.push(ct.x,ct.y,ct.z),ct[y]=0,ct[m]=0,ct[g]=M>0?1:-1,h.push(ct.x,ct.y,ct.z),u.push(jt/T),u.push(1-at/R),Q+=1}}for(let at=0;at<R;at++)for(let gt=0;gt<T;gt++){let jt=d+gt+K*at,Bt=d+gt+K*(at+1),Z=d+(gt+1)+K*(at+1),et=d+(gt+1)+K*at;c.push(jt,Bt,et),c.push(Bt,Z,et),G+=6}a.addGroup(f,G,P),f+=G,d+=Q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Ks(s){let t={};for(let e in s){t[e]={};for(let n in s[e]){let i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function $e(s){let t={};for(let e=0;e<s.length;e++){let n=Ks(s[e]);for(let i in n)t[i]=n[i]}return t}function K0(s){let t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function ip(s){let t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Qt.workingColorSpace}var j0={clone:Ks,merge:$e},q0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Y0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Mn=class extends Je{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=q0,this.fragmentShader=Y0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ks(t.uniforms),this.uniformsGroups=K0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},fa=class extends fe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Et,this.projectionMatrix=new Et,this.projectionMatrixInverse=new Et,this.coordinateSystem=ei}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},bi=new S,Bd=new ot,Hd=new ot,Ve=class extends fa{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Xs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(kr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Xs*2*Math.atan(Math.tan(kr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){bi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(bi.x,bi.y).multiplyScalar(-t/bi.z),bi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(bi.x,bi.y).multiplyScalar(-t/bi.z)}getViewSize(t,e){return this.getViewBounds(t,Bd,Hd),e.subVectors(Hd,Bd)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(kr*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*i/c,e-=o.offsetY*n/l,i*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},vs=-90,Ms=1,$l=class extends fe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Ve(vs,Ms,t,e);i.layers=this.layers,this.add(i);let r=new Ve(vs,Ms,t,e);r.layers=this.layers,this.add(r);let o=new Ve(vs,Ms,t,e);o.layers=this.layers,this.add(o);let a=new Ve(vs,Ms,t,e);a.layers=this.layers,this.add(a);let c=new Ve(vs,Ms,t,e);c.layers=this.layers,this.add(c);let l=new Ve(vs,Ms,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,c]=e;for(let l of e)this.remove(l);if(t===ei)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===ca)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,c),t.setRenderTarget(n,4,i),t.render(e,l),n.texture.generateMipmaps=y,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},pa=class extends Fe{constructor(t,e,n,i,r,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Fs,super(t,e,n,i,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Jl=class extends si{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new pa(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:rn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new ze(5,5,5),r=new Mn({name:"CubemapFromEquirect",uniforms:Ks(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:je,blending:Ei});r.uniforms.tEquirect.value=e;let o=new At(i,r),a=e.minFilter;return e.minFilter===On&&(e.minFilter=rn),new $l(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,i){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}},Yc=new S,Z0=new S,$0=new Ot,Qn=class{constructor(t=new S(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=Yc.subVectors(n,e).cross(Z0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(Yc),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||$0.getNormalMatrix(t),i=this.coplanarPoint(Yc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Xi=new un,Do=new S,Hr=class{constructor(t=new Qn,e=new Qn,n=new Qn,i=new Qn,r=new Qn,o=new Qn){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ei){let n=this.planes,i=t.elements,r=i[0],o=i[1],a=i[2],c=i[3],l=i[4],h=i[5],u=i[6],d=i[7],f=i[8],p=i[9],y=i[10],m=i[11],g=i[12],x=i[13],_=i[14],v=i[15];if(n[0].setComponents(c-r,d-l,m-f,v-g).normalize(),n[1].setComponents(c+r,d+l,m+f,v+g).normalize(),n[2].setComponents(c+o,d+h,m+p,v+x).normalize(),n[3].setComponents(c-o,d-h,m-p,v-x).normalize(),n[4].setComponents(c-a,d-u,m-y,v-_).normalize(),e===ei)n[5].setComponents(c+a,d+u,m+y,v+_).normalize();else if(e===ca)n[5].setComponents(a,u,y,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Xi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Xi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Xi)}intersectsSprite(t){return Xi.center.set(0,0,0),Xi.radius=.7071067811865476,Xi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Xi)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(Do.x=i.normal.x>0?t.max.x:t.min.x,Do.y=i.normal.y>0?t.max.y:t.min.y,Do.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Do)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function sp(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function J0(s){let t=new WeakMap;function e(a,c){let l=a.array,h=a.usage,u=l.byteLength,d=s.createBuffer();s.bindBuffer(c,d),s.bufferData(c,l,h),a.onUploadCallback();let f;if(l instanceof Float32Array)f=s.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=s.SHORT;else if(l instanceof Uint32Array)f=s.UNSIGNED_INT;else if(l instanceof Int32Array)f=s.INT;else if(l instanceof Int8Array)f=s.BYTE;else if(l instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){let h=c.array,u=c.updateRanges;if(s.bindBuffer(l,a),u.length===0)s.bufferSubData(l,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){let p=u[d],y=u[f];y.start<=p.start+p.count+1?p.count=Math.max(p.count,y.start+y.count-p.start):(++d,u[d]=y)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){let y=u[f];s.bufferSubData(l,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=t.get(a);c&&(s.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:i,remove:r,update:o}}var Hn=class s extends Gt{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(i),l=a+1,h=c+1,u=t/a,d=e/c,f=[],p=[],y=[],m=[];for(let g=0;g<h;g++){let x=g*d-o;for(let _=0;_<l;_++){let v=_*u-r;p.push(v,-x,0),y.push(0,0,1),m.push(_/a),m.push(1-g/c)}}for(let g=0;g<c;g++)for(let x=0;x<a;x++){let _=x+l*g,v=x+l*(g+1),k=x+1+l*(g+1),M=x+1+l*g;f.push(_,v,M),f.push(v,k,M)}this.setIndex(f),this.setAttribute("position",new vt(p,3)),this.setAttribute("normal",new vt(y,3)),this.setAttribute("uv",new vt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.widthSegments,t.heightSegments)}},Q0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,tg=`#ifdef USE_ALPHAHASH
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
#endif`,eg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ng=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ig=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,sg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,rg=`#ifdef USE_AOMAP
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
#endif`,og=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ag=`#ifdef USE_BATCHING
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
#endif`,cg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,lg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,hg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ug=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,dg=`#ifdef USE_IRIDESCENCE
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
#endif`,fg=`#ifdef USE_BUMPMAP
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
#endif`,pg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,mg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,gg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,yg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_g=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,xg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,wg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,vg=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Mg=`#define PI 3.141592653589793
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
} // validated`,bg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Sg=`vec3 transformedNormal = objectNormal;
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
#endif`,Ag=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Tg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Eg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,zg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Rg="gl_FragColor = linearToOutputTexel( gl_FragColor );",kg=`
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
}`,Cg=`#ifdef USE_ENVMAP
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
#endif`,Pg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ig=`#ifdef USE_ENVMAP
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
#endif`,Lg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Dg=`#ifdef USE_ENVMAP
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
#endif`,Ng=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ug=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Og=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Fg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Bg=`#ifdef USE_GRADIENTMAP
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
}`,Hg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Vg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Gg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Wg=`uniform bool receiveShadow;
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
#endif`,Xg=`#ifdef USE_ENVMAP
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
#endif`,Kg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,jg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,qg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Yg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Zg=`PhysicalMaterial material;
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
#endif`,$g=`struct PhysicalMaterial {
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
}`,Jg=`
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
#endif`,Qg=`#if defined( RE_IndirectDiffuse )
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
#endif`,ty=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ey=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ny=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,iy=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sy=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ry=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,oy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ay=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,cy=`#if defined( USE_POINTS_UV )
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
#endif`,ly=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,hy=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,uy=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,dy=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,fy=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,py=`#ifdef USE_MORPHTARGETS
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
#endif`,my=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,gy=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,yy=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,_y=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wy=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,vy=`#ifdef USE_NORMALMAP
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
#endif`,My=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,by=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Sy=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ay=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ty=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ey=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,zy=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ry=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ky=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Cy=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Py=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Iy=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ly=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Dy=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ny=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Uy=`float getShadowMask() {
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
}`,Oy=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Fy=`#ifdef USE_SKINNING
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
#endif`,By=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Hy=`#ifdef USE_SKINNING
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
#endif`,Vy=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Gy=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Wy=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Xy=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ky=`#ifdef USE_TRANSMISSION
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
#endif`,jy=`#ifdef USE_TRANSMISSION
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
#endif`,qy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Yy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Zy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,$y=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Jy=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Qy=`uniform sampler2D t2D;
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
}`,t_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,e_=`#ifdef ENVMAP_TYPE_CUBE
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
}`,n_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,i_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,s_=`#include <common>
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
}`,r_=`#if DEPTH_PACKING == 3200
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
}`,o_=`#define DISTANCE
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
}`,a_=`#define DISTANCE
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
}`,c_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,l_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,h_=`uniform float scale;
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
}`,u_=`uniform vec3 diffuse;
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
}`,d_=`#include <common>
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
}`,f_=`uniform vec3 diffuse;
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
}`,p_=`#define LAMBERT
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
}`,m_=`#define LAMBERT
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
}`,g_=`#define MATCAP
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
}`,y_=`#define MATCAP
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
}`,__=`#define NORMAL
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
}`,x_=`#define NORMAL
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
}`,w_=`#define PHONG
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
}`,v_=`#define PHONG
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
}`,M_=`#define STANDARD
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
}`,b_=`#define STANDARD
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
}`,S_=`#define TOON
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
}`,A_=`#define TOON
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
}`,T_=`uniform float size;
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
}`,E_=`uniform vec3 diffuse;
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
}`,z_=`#include <common>
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
}`,R_=`uniform vec3 color;
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
}`,k_=`uniform float rotation;
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
}`,C_=`uniform vec3 diffuse;
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
}`,Ut={alphahash_fragment:Q0,alphahash_pars_fragment:tg,alphamap_fragment:eg,alphamap_pars_fragment:ng,alphatest_fragment:ig,alphatest_pars_fragment:sg,aomap_fragment:rg,aomap_pars_fragment:og,batching_pars_vertex:ag,batching_vertex:cg,begin_vertex:lg,beginnormal_vertex:hg,bsdfs:ug,iridescence_fragment:dg,bumpmap_pars_fragment:fg,clipping_planes_fragment:pg,clipping_planes_pars_fragment:mg,clipping_planes_pars_vertex:gg,clipping_planes_vertex:yg,color_fragment:_g,color_pars_fragment:xg,color_pars_vertex:wg,color_vertex:vg,common:Mg,cube_uv_reflection_fragment:bg,defaultnormal_vertex:Sg,displacementmap_pars_vertex:Ag,displacementmap_vertex:Tg,emissivemap_fragment:Eg,emissivemap_pars_fragment:zg,colorspace_fragment:Rg,colorspace_pars_fragment:kg,envmap_fragment:Cg,envmap_common_pars_fragment:Pg,envmap_pars_fragment:Ig,envmap_pars_vertex:Lg,envmap_physical_pars_fragment:Xg,envmap_vertex:Dg,fog_vertex:Ng,fog_pars_vertex:Ug,fog_fragment:Og,fog_pars_fragment:Fg,gradientmap_pars_fragment:Bg,lightmap_pars_fragment:Hg,lights_lambert_fragment:Vg,lights_lambert_pars_fragment:Gg,lights_pars_begin:Wg,lights_toon_fragment:Kg,lights_toon_pars_fragment:jg,lights_phong_fragment:qg,lights_phong_pars_fragment:Yg,lights_physical_fragment:Zg,lights_physical_pars_fragment:$g,lights_fragment_begin:Jg,lights_fragment_maps:Qg,lights_fragment_end:ty,logdepthbuf_fragment:ey,logdepthbuf_pars_fragment:ny,logdepthbuf_pars_vertex:iy,logdepthbuf_vertex:sy,map_fragment:ry,map_pars_fragment:oy,map_particle_fragment:ay,map_particle_pars_fragment:cy,metalnessmap_fragment:ly,metalnessmap_pars_fragment:hy,morphinstance_vertex:uy,morphcolor_vertex:dy,morphnormal_vertex:fy,morphtarget_pars_vertex:py,morphtarget_vertex:my,normal_fragment_begin:gy,normal_fragment_maps:yy,normal_pars_fragment:_y,normal_pars_vertex:xy,normal_vertex:wy,normalmap_pars_fragment:vy,clearcoat_normal_fragment_begin:My,clearcoat_normal_fragment_maps:by,clearcoat_pars_fragment:Sy,iridescence_pars_fragment:Ay,opaque_fragment:Ty,packing:Ey,premultiplied_alpha_fragment:zy,project_vertex:Ry,dithering_fragment:ky,dithering_pars_fragment:Cy,roughnessmap_fragment:Py,roughnessmap_pars_fragment:Iy,shadowmap_pars_fragment:Ly,shadowmap_pars_vertex:Dy,shadowmap_vertex:Ny,shadowmask_pars_fragment:Uy,skinbase_vertex:Oy,skinning_pars_vertex:Fy,skinning_vertex:By,skinnormal_vertex:Hy,specularmap_fragment:Vy,specularmap_pars_fragment:Gy,tonemapping_fragment:Wy,tonemapping_pars_fragment:Xy,transmission_fragment:Ky,transmission_pars_fragment:jy,uv_pars_fragment:qy,uv_pars_vertex:Yy,uv_vertex:Zy,worldpos_vertex:$y,background_vert:Jy,background_frag:Qy,backgroundCube_vert:t_,backgroundCube_frag:e_,cube_vert:n_,cube_frag:i_,depth_vert:s_,depth_frag:r_,distanceRGBA_vert:o_,distanceRGBA_frag:a_,equirect_vert:c_,equirect_frag:l_,linedashed_vert:h_,linedashed_frag:u_,meshbasic_vert:d_,meshbasic_frag:f_,meshlambert_vert:p_,meshlambert_frag:m_,meshmatcap_vert:g_,meshmatcap_frag:y_,meshnormal_vert:__,meshnormal_frag:x_,meshphong_vert:w_,meshphong_frag:v_,meshphysical_vert:M_,meshphysical_frag:b_,meshtoon_vert:S_,meshtoon_frag:A_,points_vert:T_,points_frag:E_,shadow_vert:z_,shadow_frag:R_,sprite_vert:k_,sprite_frag:C_},lt={common:{diffuse:{value:new tt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ot}},envmap:{envMap:{value:null},envMapRotation:{value:new Ot},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ot},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new tt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new tt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0},uvTransform:{value:new Ot}},sprite:{diffuse:{value:new tt(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}}},Un={basic:{uniforms:$e([lt.common,lt.specularmap,lt.envmap,lt.aomap,lt.lightmap,lt.fog]),vertexShader:Ut.meshbasic_vert,fragmentShader:Ut.meshbasic_frag},lambert:{uniforms:$e([lt.common,lt.specularmap,lt.envmap,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.fog,lt.lights,{emissive:{value:new tt(0)}}]),vertexShader:Ut.meshlambert_vert,fragmentShader:Ut.meshlambert_frag},phong:{uniforms:$e([lt.common,lt.specularmap,lt.envmap,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.fog,lt.lights,{emissive:{value:new tt(0)},specular:{value:new tt(1118481)},shininess:{value:30}}]),vertexShader:Ut.meshphong_vert,fragmentShader:Ut.meshphong_frag},standard:{uniforms:$e([lt.common,lt.envmap,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.roughnessmap,lt.metalnessmap,lt.fog,lt.lights,{emissive:{value:new tt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ut.meshphysical_vert,fragmentShader:Ut.meshphysical_frag},toon:{uniforms:$e([lt.common,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.gradientmap,lt.fog,lt.lights,{emissive:{value:new tt(0)}}]),vertexShader:Ut.meshtoon_vert,fragmentShader:Ut.meshtoon_frag},matcap:{uniforms:$e([lt.common,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.fog,{matcap:{value:null}}]),vertexShader:Ut.meshmatcap_vert,fragmentShader:Ut.meshmatcap_frag},points:{uniforms:$e([lt.points,lt.fog]),vertexShader:Ut.points_vert,fragmentShader:Ut.points_frag},dashed:{uniforms:$e([lt.common,lt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ut.linedashed_vert,fragmentShader:Ut.linedashed_frag},depth:{uniforms:$e([lt.common,lt.displacementmap]),vertexShader:Ut.depth_vert,fragmentShader:Ut.depth_frag},normal:{uniforms:$e([lt.common,lt.bumpmap,lt.normalmap,lt.displacementmap,{opacity:{value:1}}]),vertexShader:Ut.meshnormal_vert,fragmentShader:Ut.meshnormal_frag},sprite:{uniforms:$e([lt.sprite,lt.fog]),vertexShader:Ut.sprite_vert,fragmentShader:Ut.sprite_frag},background:{uniforms:{uvTransform:{value:new Ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ut.background_vert,fragmentShader:Ut.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ot}},vertexShader:Ut.backgroundCube_vert,fragmentShader:Ut.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ut.cube_vert,fragmentShader:Ut.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ut.equirect_vert,fragmentShader:Ut.equirect_frag},distanceRGBA:{uniforms:$e([lt.common,lt.displacementmap,{referencePosition:{value:new S},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ut.distanceRGBA_vert,fragmentShader:Ut.distanceRGBA_frag},shadow:{uniforms:$e([lt.lights,lt.fog,{color:{value:new tt(0)},opacity:{value:1}}]),vertexShader:Ut.shadow_vert,fragmentShader:Ut.shadow_frag}};Un.physical={uniforms:$e([Un.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ot},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ot},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ot},sheen:{value:0},sheenColor:{value:new tt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ot},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ot},attenuationDistance:{value:0},attenuationColor:{value:new tt(0)},specularColor:{value:new tt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ot},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ot}}]),vertexShader:Ut.meshphysical_vert,fragmentShader:Ut.meshphysical_frag};var No={r:0,b:0,g:0},Ki=new dn,P_=new Et;function I_(s,t,e,n,i,r,o){let a=new tt(0),c=r===!0?0:1,l,h,u=null,d=0,f=null;function p(x){let _=x.isScene===!0?x.background:null;return _&&_.isTexture&&(_=(x.backgroundBlurriness>0?e:t).get(_)),_}function y(x){let _=!1,v=p(x);v===null?g(a,c):v&&v.isColor&&(g(v,1),_=!0);let k=s.xr.getEnvironmentBlendMode();k==="additive"?n.buffers.color.setClear(0,0,0,1,o):k==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(x,_){let v=p(_);v&&(v.isCubeTexture||v.mapping===Ha)?(h===void 0&&(h=new At(new ze(1,1,1),new Mn({name:"BackgroundCubeMaterial",uniforms:Ks(Un.backgroundCube.uniforms),vertexShader:Un.backgroundCube.vertexShader,fragmentShader:Un.backgroundCube.fragmentShader,side:je,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(k,M,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Ki.copy(_.backgroundRotation),Ki.x*=-1,Ki.y*=-1,Ki.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Ki.y*=-1,Ki.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(P_.makeRotationFromEuler(Ki)),h.material.toneMapped=Qt.getTransfer(v.colorSpace)!==ye,(u!==v||d!==v.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,u=v,d=v.version,f=s.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new At(new Hn(2,2),new Mn({name:"BackgroundMaterial",uniforms:Ks(Un.background.uniforms),vertexShader:Un.background.vertexShader,fragmentShader:Un.background.fragmentShader,side:Fn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=Qt.getTransfer(v.colorSpace)!==ye,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||d!==v.version||f!==s.toneMapping)&&(l.material.needsUpdate=!0,u=v,d=v.version,f=s.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function g(x,_){x.getRGB(No,ip(s)),n.buffers.color.setClear(No.r,No.g,No.b,_,o)}return{getClearColor:function(){return a},setClearColor:function(x,_=1){a.set(x),c=_,g(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,g(a,c)},render:y,addToRenderList:m}}function L_(s,t){let e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null),r=i,o=!1;function a(w,b,I,C,U){let K=!1,B=u(C,I,b);r!==B&&(r=B,l(r.object)),K=f(w,C,I,U),K&&p(w,C,I,U),U!==null&&t.update(U,s.ELEMENT_ARRAY_BUFFER),(K||o)&&(o=!1,v(w,b,I,C),U!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function c(){return s.createVertexArray()}function l(w){return s.bindVertexArray(w)}function h(w){return s.deleteVertexArray(w)}function u(w,b,I){let C=I.wireframe===!0,U=n[w.id];U===void 0&&(U={},n[w.id]=U);let K=U[b.id];K===void 0&&(K={},U[b.id]=K);let B=K[C];return B===void 0&&(B=d(c()),K[C]=B),B}function d(w){let b=[],I=[],C=[];for(let U=0;U<e;U++)b[U]=0,I[U]=0,C[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:b,enabledAttributes:I,attributeDivisors:C,object:w,attributes:{},index:null}}function f(w,b,I,C){let U=r.attributes,K=b.attributes,B=0,Q=I.getAttributes();for(let G in Q)if(Q[G].location>=0){let at=U[G],gt=K[G];if(gt===void 0&&(G==="instanceMatrix"&&w.instanceMatrix&&(gt=w.instanceMatrix),G==="instanceColor"&&w.instanceColor&&(gt=w.instanceColor)),at===void 0||at.attribute!==gt||gt&&at.data!==gt.data)return!0;B++}return r.attributesNum!==B||r.index!==C}function p(w,b,I,C){let U={},K=b.attributes,B=0,Q=I.getAttributes();for(let G in Q)if(Q[G].location>=0){let at=K[G];at===void 0&&(G==="instanceMatrix"&&w.instanceMatrix&&(at=w.instanceMatrix),G==="instanceColor"&&w.instanceColor&&(at=w.instanceColor));let gt={};gt.attribute=at,at&&at.data&&(gt.data=at.data),U[G]=gt,B++}r.attributes=U,r.attributesNum=B,r.index=C}function y(){let w=r.newAttributes;for(let b=0,I=w.length;b<I;b++)w[b]=0}function m(w){g(w,0)}function g(w,b){let I=r.newAttributes,C=r.enabledAttributes,U=r.attributeDivisors;I[w]=1,C[w]===0&&(s.enableVertexAttribArray(w),C[w]=1),U[w]!==b&&(s.vertexAttribDivisor(w,b),U[w]=b)}function x(){let w=r.newAttributes,b=r.enabledAttributes;for(let I=0,C=b.length;I<C;I++)b[I]!==w[I]&&(s.disableVertexAttribArray(I),b[I]=0)}function _(w,b,I,C,U,K,B){B===!0?s.vertexAttribIPointer(w,b,I,U,K):s.vertexAttribPointer(w,b,I,C,U,K)}function v(w,b,I,C){y();let U=C.attributes,K=I.getAttributes(),B=b.defaultAttributeValues;for(let Q in K){let G=K[Q];if(G.location>=0){let ct=U[Q];if(ct===void 0&&(Q==="instanceMatrix"&&w.instanceMatrix&&(ct=w.instanceMatrix),Q==="instanceColor"&&w.instanceColor&&(ct=w.instanceColor)),ct!==void 0){let at=ct.normalized,gt=ct.itemSize,jt=t.get(ct);if(jt===void 0)continue;let Bt=jt.buffer,Z=jt.type,et=jt.bytesPerElement,Mt=Z===s.INT||Z===s.UNSIGNED_INT||ct.gpuType===Oh;if(ct.isInterleavedBufferAttribute){let ut=ct.data,Dt=ut.stride,Pt=ct.offset;if(ut.isInstancedInterleavedBuffer){for(let Ht=0;Ht<G.locationSize;Ht++)g(G.location+Ht,ut.meshPerAttribute);w.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=ut.meshPerAttribute*ut.count)}else for(let Ht=0;Ht<G.locationSize;Ht++)m(G.location+Ht);s.bindBuffer(s.ARRAY_BUFFER,Bt);for(let Ht=0;Ht<G.locationSize;Ht++)_(G.location+Ht,gt/G.locationSize,Z,at,Dt*et,(Pt+gt/G.locationSize*Ht)*et,Mt)}else{if(ct.isInstancedBufferAttribute){for(let ut=0;ut<G.locationSize;ut++)g(G.location+ut,ct.meshPerAttribute);w.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let ut=0;ut<G.locationSize;ut++)m(G.location+ut);s.bindBuffer(s.ARRAY_BUFFER,Bt);for(let ut=0;ut<G.locationSize;ut++)_(G.location+ut,gt/G.locationSize,Z,at,gt*et,gt/G.locationSize*ut*et,Mt)}}else if(B!==void 0){let at=B[Q];if(at!==void 0)switch(at.length){case 2:s.vertexAttrib2fv(G.location,at);break;case 3:s.vertexAttrib3fv(G.location,at);break;case 4:s.vertexAttrib4fv(G.location,at);break;default:s.vertexAttrib1fv(G.location,at)}}}}x()}function k(){R();for(let w in n){let b=n[w];for(let I in b){let C=b[I];for(let U in C)h(C[U].object),delete C[U];delete b[I]}delete n[w]}}function M(w){if(n[w.id]===void 0)return;let b=n[w.id];for(let I in b){let C=b[I];for(let U in C)h(C[U].object),delete C[U];delete b[I]}delete n[w.id]}function T(w){for(let b in n){let I=n[b];if(I[w.id]===void 0)continue;let C=I[w.id];for(let U in C)h(C[U].object),delete C[U];delete I[w.id]}}function R(){P(),o=!0,r!==i&&(r=i,l(r.object))}function P(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:R,resetDefaultState:P,dispose:k,releaseStatesOfGeometry:M,releaseStatesOfProgram:T,initAttributes:y,enableAttribute:m,disableUnusedAttributes:x}}function D_(s,t,e){let n;function i(l){n=l}function r(l,h){s.drawArrays(n,l,h),e.update(h,n,1)}function o(l,h,u){u!==0&&(s.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function a(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let p=0;p<u;p++)f+=h[p];e.update(f,n,1)}function c(l,h,u,d){if(u===0)return;let f=t.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<l.length;p++)o(l[p],h[p],d[p]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let p=0;for(let y=0;y<u;y++)p+=h[y];for(let y=0;y<d.length;y++)e.update(p,n,d[y])}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function N_(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let T=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(T){return!(T!==wn&&n.convert(T)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){let R=T===Jr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==ni&&n.convert(T)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==Ln&&!R)}function c(T){if(T==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control");if(d===!0){let T=t.get("EXT_clip_control");T.clipControlEXT(T.LOWER_LEFT_EXT,T.ZERO_TO_ONE_EXT)}let f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),_=s.getParameter(s.MAX_VARYING_VECTORS),v=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),k=p>0,M=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:y,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:x,maxVaryings:_,maxFragmentUniforms:v,vertexTextures:k,maxSamples:M}}function U_(s){let t=this,e=null,n=0,i=!1,r=!1,o=new Qn,a=new Ot,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){let p=u.clippingPlanes,y=u.clipIntersection,m=u.clipShadows,g=s.get(u);if(!i||p===null||p.length===0||r&&!m)r?h(null):l();else{let x=r?0:n,_=x*4,v=g.clippingState||null;c.value=v,v=h(p,d,_,f);for(let k=0;k!==_;++k)v[k]=e[k];g.clippingState=v,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,p){let y=u!==null?u.length:0,m=null;if(y!==0){if(m=c.value,p!==!0||m===null){let g=f+y*4,x=d.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<g)&&(m=new Float32Array(g));for(let _=0,v=f;_!==y;++_,v+=4)o.copy(u[_]).applyMatrix4(x,a),o.normal.toArray(m,v),m[v+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,m}}function O_(s){let t=new WeakMap;function e(o,a){return a===Nr?o.mapping=Fs:a===wl&&(o.mapping=Bs),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Nr||a===wl)if(t.has(o)){let c=t.get(o).texture;return e(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new Jl(c.height);return l.fromEquirectangularTexture(s,o),t.set(o,l),o.addEventListener("dispose",i),e(l.texture,o.mapping)}else return null}}return o}function i(o){let a=o.target;a.removeEventListener("dispose",i);let c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var Ri=class extends fa{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-t,o=n+t,a=i+e,c=i-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Ps=4,Vd=[.125,.215,.35,.446,.526,.582],Zi=20,Zc=new Ri,Gd=new tt,$c=null,Jc=0,Qc=0,tl=!1,qi=(1+Math.sqrt(5))/2,bs=1/qi,Wd=[new S(-qi,bs,0),new S(qi,bs,0),new S(-bs,0,qi),new S(bs,0,qi),new S(0,qi,-bs),new S(0,qi,bs),new S(-1,1,-1),new S(1,1,-1),new S(-1,1,1),new S(1,1,1)],js=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){$c=this._renderer.getRenderTarget(),Jc=this._renderer.getActiveCubeFace(),Qc=this._renderer.getActiveMipmapLevel(),tl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,i,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=jd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Kd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget($c,Jc,Qc),this._renderer.xr.enabled=tl,t.scissorTest=!1,Uo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Fs||t.mapping===Bs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),$c=this._renderer.getRenderTarget(),Jc=this._renderer.getActiveCubeFace(),Qc=this._renderer.getActiveMipmapLevel(),tl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:rn,minFilter:rn,generateMipmaps:!1,type:Jr,format:wn,colorSpace:Be,depthBuffer:!1},i=Xd(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Xd(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=F_(r)),this._blurMaterial=B_(r,t,e)}return i}_compileMaterial(t){let e=new At(this._lodPlanes[0],t);this._renderer.compile(e,Zc)}_sceneToCubeUV(t,e,n,i){let a=new Ve(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Gd),h.toneMapping=zi,h.autoClear=!1;let f=new ne({name:"PMREM.Background",side:je,depthWrite:!1,depthTest:!1}),p=new At(new ze,f),y=!1,m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,y=!0):(f.color.copy(Gd),y=!0);for(let g=0;g<6;g++){let x=g%3;x===0?(a.up.set(0,c[g],0),a.lookAt(l[g],0,0)):x===1?(a.up.set(0,0,c[g]),a.lookAt(0,l[g],0)):(a.up.set(0,c[g],0),a.lookAt(0,0,l[g]));let _=this._cubeSize;Uo(i,x*_,g>2?_:0,_,_),h.setRenderTarget(i),y&&h.render(p,a),h.render(t,a)}p.geometry.dispose(),p.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){let n=this._renderer,i=t.mapping===Fs||t.mapping===Bs;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=jd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Kd());let r=i?this._cubemapMaterial:this._equirectMaterial,o=new At(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let c=this._cubeSize;Uo(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,Zc)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let i=this._lodPlanes.length;for(let r=1;r<i;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Wd[(i-r-1)%Wd.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,i,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new At(this._lodPlanes[i],l),d=l.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Zi-1),y=r/p,m=isFinite(r)?1+Math.floor(h*y):Zi;m>Zi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Zi}`);let g=[],x=0;for(let T=0;T<Zi;++T){let R=T/y,P=Math.exp(-R*R/2);g.push(P),T===0?x+=P:T<m&&(x+=2*P)}for(let T=0;T<g.length;T++)g[T]=g[T]/x;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=g,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:_}=this;d.dTheta.value=p,d.mipInt.value=_-n;let v=this._sizeLods[i],k=3*v*(i>_-Ps?i-_+Ps:0),M=4*(this._cubeSize-v);Uo(e,k,M,3*v,2*v),c.setRenderTarget(e),c.render(u,Zc)}};function F_(s){let t=[],e=[],n=[],i=s,r=s-Ps+1+Vd.length;for(let o=0;o<r;o++){let a=Math.pow(2,i);e.push(a);let c=1/a;o>s-Ps?c=Vd[o-s+Ps-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,p=6,y=3,m=2,g=1,x=new Float32Array(y*p*f),_=new Float32Array(m*p*f),v=new Float32Array(g*p*f);for(let M=0;M<f;M++){let T=M%3*2/3-1,R=M>2?0:-1,P=[T,R,0,T+2/3,R,0,T+2/3,R+1,0,T,R,0,T+2/3,R+1,0,T,R+1,0];x.set(P,y*p*M),_.set(d,m*p*M);let w=[M,M,M,M,M,M];v.set(w,g*p*M)}let k=new Gt;k.setAttribute("position",new Ce(x,y)),k.setAttribute("uv",new Ce(_,m)),k.setAttribute("faceIndex",new Ce(v,g)),t.push(k),i>Ps&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Xd(s,t,e){let n=new si(s,t,e);return n.texture.mapping=Ha,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Uo(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function B_(s,t,e){let n=new Float32Array(Zi),i=new S(0,1,0);return new Mn({name:"SphericalGaussianBlur",defines:{n:Zi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Zh(),fragmentShader:`

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
		`,blending:Ei,depthTest:!1,depthWrite:!1})}function Kd(){return new Mn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Zh(),fragmentShader:`

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
		`,blending:Ei,depthTest:!1,depthWrite:!1})}function jd(){return new Mn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Zh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ei,depthTest:!1,depthWrite:!1})}function Zh(){return`

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
	`}function H_(s){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===Nr||c===wl,h=c===Fs||c===Bs;if(l||h){let u=t.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new js(s)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{let f=a.image;return l&&f&&f.height>0||h&&f&&i(f)?(e===null&&(e=new js(s)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function i(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function V_(s){let t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let i=e(n);return i===null&&na("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function G_(s,t,e,n){let i={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let p in d.attributes)t.remove(d.attributes[p]);for(let p in d.morphAttributes){let y=d.morphAttributes[p];for(let m=0,g=y.length;m<g;m++)t.remove(y[m])}d.removeEventListener("dispose",o),delete i[d.id];let f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,e.memory.geometries++),d}function c(u){let d=u.attributes;for(let p in d)t.update(d[p],s.ARRAY_BUFFER);let f=u.morphAttributes;for(let p in f){let y=f[p];for(let m=0,g=y.length;m<g;m++)t.update(y[m],s.ARRAY_BUFFER)}}function l(u){let d=[],f=u.index,p=u.attributes.position,y=0;if(f!==null){let x=f.array;y=f.version;for(let _=0,v=x.length;_<v;_+=3){let k=x[_+0],M=x[_+1],T=x[_+2];d.push(k,M,M,T,T,k)}}else if(p!==void 0){let x=p.array;y=p.version;for(let _=0,v=x.length/3-1;_<v;_+=3){let k=_+0,M=_+1,T=_+2;d.push(k,M,M,T,T,k)}}else return;let m=new(ep(d)?da:ua)(d,1);m.version=y;let g=r.get(u);g&&t.remove(g),r.set(u,m)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function W_(s,t,e){let n;function i(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,f){s.drawElements(n,f,r,d*o),e.update(f,n,1)}function l(d,f,p){p!==0&&(s.drawElementsInstanced(n,f,r,d*o,p),e.update(f,n,p))}function h(d,f,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,p);let m=0;for(let g=0;g<p;g++)m+=f[g];e.update(m,n,1)}function u(d,f,p,y){if(p===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<d.length;g++)l(d[g]/o,f[g],y[g]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,y,0,p);let g=0;for(let x=0;x<p;x++)g+=f[x];for(let x=0;x<y.length;x++)e.update(g,n,y[x])}}this.setMode=i,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function X_(s){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function K_(s,t,e){let n=new WeakMap,i=new $t;function r(o,a,c){let l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let P=function(){T.dispose(),n.delete(a),a.removeEventListener("dispose",P)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],x=a.morphAttributes.color||[],_=0;f===!0&&(_=1),p===!0&&(_=2),y===!0&&(_=3);let v=a.attributes.position.count*_,k=1;v>t.maxTextureSize&&(k=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let M=new Float32Array(v*k*4*u),T=new ha(M,v,k,u);T.type=Ln,T.needsUpdate=!0;let R=_*4;for(let w=0;w<u;w++){let b=m[w],I=g[w],C=x[w],U=v*k*4*w;for(let K=0;K<b.count;K++){let B=K*R;f===!0&&(i.fromBufferAttribute(b,K),M[U+B+0]=i.x,M[U+B+1]=i.y,M[U+B+2]=i.z,M[U+B+3]=0),p===!0&&(i.fromBufferAttribute(I,K),M[U+B+4]=i.x,M[U+B+5]=i.y,M[U+B+6]=i.z,M[U+B+7]=0),y===!0&&(i.fromBufferAttribute(C,K),M[U+B+8]=i.x,M[U+B+9]=i.y,M[U+B+10]=i.z,M[U+B+11]=C.itemSize===4?i.w:1)}}d={count:u,texture:T,size:new ot(v,k)},n.set(a,d),a.addEventListener("dispose",P)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",o.morphTexture,e);else{let f=0;for(let y=0;y<l.length;y++)f+=l[y];let p=a.morphTargetsRelative?1:1-f;c.getUniforms().setValue(s,"morphTargetBaseInfluence",p),c.getUniforms().setValue(s,"morphTargetInfluences",l)}c.getUniforms().setValue(s,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function j_(s,t,e,n){let i=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,u=t.get(c,h);if(i.get(u)!==l&&(t.update(u),i.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),i.get(c)!==l&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){let d=c.skeleton;i.get(d)!==l&&(d.update(),i.set(d,l))}return u}function o(){i=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}var ma=class extends Fe{constructor(t,e,n,i,r,o,a,c,l,h=Ds){if(h!==Ds&&h!==Vs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Ds&&(n=Ji),n===void 0&&h===Vs&&(n=Hs),super(null,i,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ke,this.minFilter=c!==void 0?c:Ke,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},rp=new Fe,qd=new ma(1,1),op=new ha,ap=new Zl,cp=new pa,Yd=[],Zd=[],$d=new Float32Array(16),Jd=new Float32Array(9),Qd=new Float32Array(4);function er(s,t,e){let n=s[0];if(n<=0||n>0)return s;let i=t*e,r=Yd[i];if(r===void 0&&(r=new Float32Array(i),Yd[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function Pe(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Ie(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Wa(s,t){let e=Zd[t];e===void 0&&(e=new Int32Array(t),Zd[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function q_(s,t){let e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Y_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;s.uniform2fv(this.addr,t),Ie(e,t)}}function Z_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Pe(e,t))return;s.uniform3fv(this.addr,t),Ie(e,t)}}function $_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;s.uniform4fv(this.addr,t),Ie(e,t)}}function J_(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Pe(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Ie(e,t)}else{if(Pe(e,n))return;Qd.set(n),s.uniformMatrix2fv(this.addr,!1,Qd),Ie(e,n)}}function Q_(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Pe(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Ie(e,t)}else{if(Pe(e,n))return;Jd.set(n),s.uniformMatrix3fv(this.addr,!1,Jd),Ie(e,n)}}function tx(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Pe(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Ie(e,t)}else{if(Pe(e,n))return;$d.set(n),s.uniformMatrix4fv(this.addr,!1,$d),Ie(e,n)}}function ex(s,t){let e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function nx(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;s.uniform2iv(this.addr,t),Ie(e,t)}}function ix(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;s.uniform3iv(this.addr,t),Ie(e,t)}}function sx(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;s.uniform4iv(this.addr,t),Ie(e,t)}}function rx(s,t){let e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function ox(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;s.uniform2uiv(this.addr,t),Ie(e,t)}}function ax(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;s.uniform3uiv(this.addr,t),Ie(e,t)}}function cx(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;s.uniform4uiv(this.addr,t),Ie(e,t)}}function lx(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(qd.compareFunction=Jf,r=qd):r=rp,e.setTexture2D(t||r,i)}function hx(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||ap,i)}function ux(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||cp,i)}function dx(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||op,i)}function fx(s){switch(s){case 5126:return q_;case 35664:return Y_;case 35665:return Z_;case 35666:return $_;case 35674:return J_;case 35675:return Q_;case 35676:return tx;case 5124:case 35670:return ex;case 35667:case 35671:return nx;case 35668:case 35672:return ix;case 35669:case 35673:return sx;case 5125:return rx;case 36294:return ox;case 36295:return ax;case 36296:return cx;case 35678:case 36198:case 36298:case 36306:case 35682:return lx;case 35679:case 36299:case 36307:return hx;case 35680:case 36300:case 36308:case 36293:return ux;case 36289:case 36303:case 36311:case 36292:return dx}}function px(s,t){s.uniform1fv(this.addr,t)}function mx(s,t){let e=er(t,this.size,2);s.uniform2fv(this.addr,e)}function gx(s,t){let e=er(t,this.size,3);s.uniform3fv(this.addr,e)}function yx(s,t){let e=er(t,this.size,4);s.uniform4fv(this.addr,e)}function _x(s,t){let e=er(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function xx(s,t){let e=er(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function wx(s,t){let e=er(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function vx(s,t){s.uniform1iv(this.addr,t)}function Mx(s,t){s.uniform2iv(this.addr,t)}function bx(s,t){s.uniform3iv(this.addr,t)}function Sx(s,t){s.uniform4iv(this.addr,t)}function Ax(s,t){s.uniform1uiv(this.addr,t)}function Tx(s,t){s.uniform2uiv(this.addr,t)}function Ex(s,t){s.uniform3uiv(this.addr,t)}function zx(s,t){s.uniform4uiv(this.addr,t)}function Rx(s,t,e){let n=this.cache,i=t.length,r=Wa(e,i);Pe(n,r)||(s.uniform1iv(this.addr,r),Ie(n,r));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||rp,r[o])}function kx(s,t,e){let n=this.cache,i=t.length,r=Wa(e,i);Pe(n,r)||(s.uniform1iv(this.addr,r),Ie(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||ap,r[o])}function Cx(s,t,e){let n=this.cache,i=t.length,r=Wa(e,i);Pe(n,r)||(s.uniform1iv(this.addr,r),Ie(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||cp,r[o])}function Px(s,t,e){let n=this.cache,i=t.length,r=Wa(e,i);Pe(n,r)||(s.uniform1iv(this.addr,r),Ie(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||op,r[o])}function Ix(s){switch(s){case 5126:return px;case 35664:return mx;case 35665:return gx;case 35666:return yx;case 35674:return _x;case 35675:return xx;case 35676:return wx;case 5124:case 35670:return vx;case 35667:case 35671:return Mx;case 35668:case 35672:return bx;case 35669:case 35673:return Sx;case 5125:return Ax;case 36294:return Tx;case 36295:return Ex;case 36296:return zx;case 35678:case 36198:case 36298:case 36306:case 35682:return Rx;case 35679:case 36299:case 36307:return kx;case 35680:case 36300:case 36308:case 36293:return Cx;case 36289:case 36303:case 36311:case 36292:return Px}}var Ql=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=fx(e.type)}},th=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Ix(e.type)}},eh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let r=0,o=i.length;r!==o;++r){let a=i[r];a.setValue(t,e[a.id],n)}}},el=/(\w+)(\])?(\[|\.)?/g;function tf(s,t){s.seq.push(t),s.map[t.id]=t}function Lx(s,t,e){let n=s.name,i=n.length;for(el.lastIndex=0;;){let r=el.exec(n),o=el.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===i){tf(e,l===void 0?new Ql(a,s,t):new th(a,s,t));break}else{let u=e.map[a];u===void 0&&(u=new eh(a),tf(e,u)),e=u}}}var Us=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let r=t.getActiveUniform(e,i),o=t.getUniformLocation(e,r.name);Lx(r,o,this)}}setValue(t,e,n,i){let r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){let a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,r=t.length;i!==r;++i){let o=t[i];o.id in e&&n.push(o)}return n}};function ef(s,t,e){let n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}var Dx=37297,Nx=0;function Ux(s,t){let e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function Ox(s){let t=Qt.getPrimaries(Qt.workingColorSpace),e=Qt.getPrimaries(s),n;switch(t===e?n="":t===aa&&e===oa?n="LinearDisplayP3ToLinearSRGB":t===oa&&e===aa&&(n="LinearSRGBToLinearDisplayP3"),s){case Be:case Ga:return[n,"LinearTransferOETF"];case Vt:case qh:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function nf(s,t,e){let n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";let r=/ERROR: 0:(\d+)/.exec(i);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+i+`

`+Ux(s.getShaderSource(t),o)}else return i}function Fx(s,t){let e=Ox(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Bx(s,t){let e;switch(t){case qm:e="Linear";break;case Ym:e="Reinhard";break;case Zm:e="Cineon";break;case Nh:e="ACESFilmic";break;case Jm:e="AgX";break;case Qm:e="Neutral";break;case $m:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Oo=new S;function Hx(){Qt.getLuminanceCoefficients(Oo);let s=Oo.x.toFixed(4),t=Oo.y.toFixed(4),e=Oo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Vx(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(zr).join(`
`)}function Gx(s){let t=[];for(let e in s){let n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Wx(s,t){let e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(t,i),o=r.name,a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function zr(s){return s!==""}function sf(s,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function rf(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Xx=/^[ \t]*#include +<([\w\d./]+)>/gm;function nh(s){return s.replace(Xx,jx)}var Kx=new Map;function jx(s,t){let e=Ut[t];if(e===void 0){let n=Kx.get(t);if(n!==void 0)e=Ut[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return nh(e)}var qx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function of(s){return s.replace(qx,Yx)}function Yx(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function af(s){let t=`precision ${s.precision} float;
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
#define LOW_PRECISION`),t}function Zx(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Ff?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===Lh?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Jn&&(t="SHADOWMAP_TYPE_VSM"),t}function $x(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Fs:case Bs:t="ENVMAP_TYPE_CUBE";break;case Ha:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Jx(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Bs:t="ENVMAP_MODE_REFRACTION";break}return t}function Qx(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Dh:t="ENVMAP_BLENDING_MULTIPLY";break;case Km:t="ENVMAP_BLENDING_MIX";break;case jm:t="ENVMAP_BLENDING_ADD";break}return t}function tw(s){let t=s.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function ew(s,t,e,n){let i=s.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,c=Zx(e),l=$x(e),h=Jx(e),u=Qx(e),d=tw(e),f=Vx(e),p=Gx(r),y=i.createProgram(),m,g,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(zr).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(zr).join(`
`),g.length>0&&(g+=`
`)):(m=[af(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(zr).join(`
`),g=[af(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==zi?"#define TONE_MAPPING":"",e.toneMapping!==zi?Ut.tonemapping_pars_fragment:"",e.toneMapping!==zi?Bx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ut.colorspace_pars_fragment,Fx("linearToOutputTexel",e.outputColorSpace),Hx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(zr).join(`
`)),o=nh(o),o=sf(o,e),o=rf(o,e),a=nh(a),a=sf(a,e),a=rf(a,e),o=of(o),a=of(a),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",e.glslVersion===bd?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===bd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let _=x+m+o,v=x+g+a,k=ef(i,i.VERTEX_SHADER,_),M=ef(i,i.FRAGMENT_SHADER,v);i.attachShader(y,k),i.attachShader(y,M),e.index0AttributeName!==void 0?i.bindAttribLocation(y,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(y,0,"position"),i.linkProgram(y);function T(b){if(s.debug.checkShaderErrors){let I=i.getProgramInfoLog(y).trim(),C=i.getShaderInfoLog(k).trim(),U=i.getShaderInfoLog(M).trim(),K=!0,B=!0;if(i.getProgramParameter(y,i.LINK_STATUS)===!1)if(K=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,y,k,M);else{let Q=nf(i,k,"vertex"),G=nf(i,M,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(y,i.VALIDATE_STATUS)+`

Material Name: `+b.name+`
Material Type: `+b.type+`

Program Info Log: `+I+`
`+Q+`
`+G)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(C===""||U==="")&&(B=!1);B&&(b.diagnostics={runnable:K,programLog:I,vertexShader:{log:C,prefix:m},fragmentShader:{log:U,prefix:g}})}i.deleteShader(k),i.deleteShader(M),R=new Us(i,y),P=Wx(i,y)}let R;this.getUniforms=function(){return R===void 0&&T(this),R};let P;this.getAttributes=function(){return P===void 0&&T(this),P};let w=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=i.getProgramParameter(y,Dx)),w},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Nx++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=k,this.fragmentShader=M,this}var nw=0,ih=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new sh(t),e.set(t,n)),n}},sh=class{constructor(t){this.id=nw++,this.code=t,this.usedTimes=0}};function iw(s,t,e,n,i,r,o){let a=new Br,c=new ih,l=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.reverseDepthBuffer,f=i.vertexTextures,p=i.precision,y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(w){return l.add(w),w===0?"uv":`uv${w}`}function g(w,b,I,C,U){let K=C.fog,B=U.geometry,Q=w.isMeshStandardMaterial?C.environment:null,G=(w.isMeshStandardMaterial?e:t).get(w.envMap||Q),ct=G&&G.mapping===Ha?G.image.height:null,at=y[w.type];w.precision!==null&&(p=i.getMaxPrecision(w.precision),p!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",p,"instead."));let gt=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,jt=gt!==void 0?gt.length:0,Bt=0;B.morphAttributes.position!==void 0&&(Bt=1),B.morphAttributes.normal!==void 0&&(Bt=2),B.morphAttributes.color!==void 0&&(Bt=3);let Z,et,Mt,ut;if(at){let sn=Un[at];Z=sn.vertexShader,et=sn.fragmentShader}else Z=w.vertexShader,et=w.fragmentShader,c.update(w),Mt=c.getVertexShaderID(w),ut=c.getFragmentShaderID(w);let Dt=s.getRenderTarget(),Pt=U.isInstancedMesh===!0,Ht=U.isBatchedMesh===!0,Zt=!!w.map,Wt=!!w.matcap,L=!!G,Ye=!!w.aoMap,qt=!!w.lightMap,W=!!w.bumpMap,st=!!w.normalMap,$=!!w.displacementMap,ft=!!w.emissiveMap,z=!!w.metalnessMap,A=!!w.roughnessMap,F=w.anisotropy>0,j=w.clearcoat>0,q=w.dispersion>0,Y=w.iridescence>0,Tt=w.sheen>0,ht=w.transmission>0,dt=F&&!!w.anisotropyMap,Xt=j&&!!w.clearcoatMap,nt=j&&!!w.clearcoatNormalMap,wt=j&&!!w.clearcoatRoughnessMap,kt=Y&&!!w.iridescenceMap,Ct=Y&&!!w.iridescenceThicknessMap,xt=Tt&&!!w.sheenColorMap,Yt=Tt&&!!w.sheenRoughnessMap,Nt=!!w.specularMap,ue=!!w.specularColorMap,D=!!w.specularIntensityMap,yt=ht&&!!w.transmissionMap,X=ht&&!!w.thicknessMap,J=!!w.gradientMap,pt=!!w.alphaMap,_t=w.alphaTest>0,Jt=!!w.alphaHash,Ae=!!w.extensions,nn=zi;w.toneMapped&&(Dt===null||Dt.isXRRenderTarget===!0)&&(nn=s.toneMapping);let ee={shaderID:at,shaderType:w.type,shaderName:w.name,vertexShader:Z,fragmentShader:et,defines:w.defines,customVertexShaderID:Mt,customFragmentShaderID:ut,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:p,batching:Ht,batchingColor:Ht&&U._colorsTexture!==null,instancing:Pt,instancingColor:Pt&&U.instanceColor!==null,instancingMorph:Pt&&U.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:Dt===null?s.outputColorSpace:Dt.isXRRenderTarget===!0?Dt.texture.colorSpace:Be,alphaToCoverage:!!w.alphaToCoverage,map:Zt,matcap:Wt,envMap:L,envMapMode:L&&G.mapping,envMapCubeUVHeight:ct,aoMap:Ye,lightMap:qt,bumpMap:W,normalMap:st,displacementMap:f&&$,emissiveMap:ft,normalMapObjectSpace:st&&w.normalMapType===r0,normalMapTangentSpace:st&&w.normalMapType===jh,metalnessMap:z,roughnessMap:A,anisotropy:F,anisotropyMap:dt,clearcoat:j,clearcoatMap:Xt,clearcoatNormalMap:nt,clearcoatRoughnessMap:wt,dispersion:q,iridescence:Y,iridescenceMap:kt,iridescenceThicknessMap:Ct,sheen:Tt,sheenColorMap:xt,sheenRoughnessMap:Yt,specularMap:Nt,specularColorMap:ue,specularIntensityMap:D,transmission:ht,transmissionMap:yt,thicknessMap:X,gradientMap:J,opaque:w.transparent===!1&&w.blending===Ls&&w.alphaToCoverage===!1,alphaMap:pt,alphaTest:_t,alphaHash:Jt,combine:w.combine,mapUv:Zt&&m(w.map.channel),aoMapUv:Ye&&m(w.aoMap.channel),lightMapUv:qt&&m(w.lightMap.channel),bumpMapUv:W&&m(w.bumpMap.channel),normalMapUv:st&&m(w.normalMap.channel),displacementMapUv:$&&m(w.displacementMap.channel),emissiveMapUv:ft&&m(w.emissiveMap.channel),metalnessMapUv:z&&m(w.metalnessMap.channel),roughnessMapUv:A&&m(w.roughnessMap.channel),anisotropyMapUv:dt&&m(w.anisotropyMap.channel),clearcoatMapUv:Xt&&m(w.clearcoatMap.channel),clearcoatNormalMapUv:nt&&m(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:wt&&m(w.clearcoatRoughnessMap.channel),iridescenceMapUv:kt&&m(w.iridescenceMap.channel),iridescenceThicknessMapUv:Ct&&m(w.iridescenceThicknessMap.channel),sheenColorMapUv:xt&&m(w.sheenColorMap.channel),sheenRoughnessMapUv:Yt&&m(w.sheenRoughnessMap.channel),specularMapUv:Nt&&m(w.specularMap.channel),specularColorMapUv:ue&&m(w.specularColorMap.channel),specularIntensityMapUv:D&&m(w.specularIntensityMap.channel),transmissionMapUv:yt&&m(w.transmissionMap.channel),thicknessMapUv:X&&m(w.thicknessMap.channel),alphaMapUv:pt&&m(w.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(st||F),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!B.attributes.uv&&(Zt||pt),fog:!!K,useFog:w.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:d,skinning:U.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:jt,morphTextureStride:Bt,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:w.dithering,shadowMapEnabled:s.shadowMap.enabled&&I.length>0,shadowMapType:s.shadowMap.type,toneMapping:nn,decodeVideoTexture:Zt&&w.map.isVideoTexture===!0&&Qt.getTransfer(w.map.colorSpace)===ye,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===de,flipSided:w.side===je,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Ae&&w.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ae&&w.extensions.multiDraw===!0||Ht)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return ee.vertexUv1s=l.has(1),ee.vertexUv2s=l.has(2),ee.vertexUv3s=l.has(3),l.clear(),ee}function x(w){let b=[];if(w.shaderID?b.push(w.shaderID):(b.push(w.customVertexShaderID),b.push(w.customFragmentShaderID)),w.defines!==void 0)for(let I in w.defines)b.push(I),b.push(w.defines[I]);return w.isRawShaderMaterial===!1&&(_(b,w),v(b,w),b.push(s.outputColorSpace)),b.push(w.customProgramCacheKey),b.join()}function _(w,b){w.push(b.precision),w.push(b.outputColorSpace),w.push(b.envMapMode),w.push(b.envMapCubeUVHeight),w.push(b.mapUv),w.push(b.alphaMapUv),w.push(b.lightMapUv),w.push(b.aoMapUv),w.push(b.bumpMapUv),w.push(b.normalMapUv),w.push(b.displacementMapUv),w.push(b.emissiveMapUv),w.push(b.metalnessMapUv),w.push(b.roughnessMapUv),w.push(b.anisotropyMapUv),w.push(b.clearcoatMapUv),w.push(b.clearcoatNormalMapUv),w.push(b.clearcoatRoughnessMapUv),w.push(b.iridescenceMapUv),w.push(b.iridescenceThicknessMapUv),w.push(b.sheenColorMapUv),w.push(b.sheenRoughnessMapUv),w.push(b.specularMapUv),w.push(b.specularColorMapUv),w.push(b.specularIntensityMapUv),w.push(b.transmissionMapUv),w.push(b.thicknessMapUv),w.push(b.combine),w.push(b.fogExp2),w.push(b.sizeAttenuation),w.push(b.morphTargetsCount),w.push(b.morphAttributeCount),w.push(b.numDirLights),w.push(b.numPointLights),w.push(b.numSpotLights),w.push(b.numSpotLightMaps),w.push(b.numHemiLights),w.push(b.numRectAreaLights),w.push(b.numDirLightShadows),w.push(b.numPointLightShadows),w.push(b.numSpotLightShadows),w.push(b.numSpotLightShadowsWithMaps),w.push(b.numLightProbes),w.push(b.shadowMapType),w.push(b.toneMapping),w.push(b.numClippingPlanes),w.push(b.numClipIntersection),w.push(b.depthPacking)}function v(w,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),w.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reverseDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.alphaToCoverage&&a.enable(20),w.push(a.mask)}function k(w){let b=y[w.type],I;if(b){let C=Un[b];I=j0.clone(C.uniforms)}else I=w.uniforms;return I}function M(w,b){let I;for(let C=0,U=h.length;C<U;C++){let K=h[C];if(K.cacheKey===b){I=K,++I.usedTimes;break}}return I===void 0&&(I=new ew(s,b,w,r),h.push(I)),I}function T(w){if(--w.usedTimes===0){let b=h.indexOf(w);h[b]=h[h.length-1],h.pop(),w.destroy()}}function R(w){c.remove(w)}function P(){c.dispose()}return{getParameters:g,getProgramCacheKey:x,getUniforms:k,acquireProgram:M,releaseProgram:T,releaseShaderCache:R,programs:h,dispose:P}}function sw(){let s=new WeakMap;function t(o){return s.has(o)}function e(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,c){s.get(o)[a]=c}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function rw(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function cf(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function lf(){let s=[],t=0,e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(u,d,f,p,y,m){let g=s[t];return g===void 0?(g={id:u.id,object:u,geometry:d,material:f,groupOrder:p,renderOrder:u.renderOrder,z:y,group:m},s[t]=g):(g.id=u.id,g.object=u,g.geometry=d,g.material=f,g.groupOrder=p,g.renderOrder=u.renderOrder,g.z=y,g.group=m),t++,g}function a(u,d,f,p,y,m){let g=o(u,d,f,p,y,m);f.transmission>0?n.push(g):f.transparent===!0?i.push(g):e.push(g)}function c(u,d,f,p,y,m){let g=o(u,d,f,p,y,m);f.transmission>0?n.unshift(g):f.transparent===!0?i.unshift(g):e.unshift(g)}function l(u,d){e.length>1&&e.sort(u||rw),n.length>1&&n.sort(d||cf),i.length>1&&i.sort(d||cf)}function h(){for(let u=t,d=s.length;u<d;u++){let f=s[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:a,unshift:c,finish:h,sort:l}}function ow(){let s=new WeakMap;function t(n,i){let r=s.get(n),o;return r===void 0?(o=new lf,s.set(n,[o])):i>=r.length?(o=new lf,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function aw(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new S,color:new tt};break;case"SpotLight":e={position:new S,direction:new S,color:new tt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new S,color:new tt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new S,skyColor:new tt,groundColor:new tt};break;case"RectAreaLight":e={color:new tt,position:new S,halfWidth:new S,halfHeight:new S};break}return s[t.id]=e,e}}}function cw(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}var lw=0;function hw(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function uw(s){let t=new aw,e=cw(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new S);let i=new S,r=new Et,o=new Et;function a(l){let h=0,u=0,d=0;for(let P=0;P<9;P++)n.probe[P].set(0,0,0);let f=0,p=0,y=0,m=0,g=0,x=0,_=0,v=0,k=0,M=0,T=0;l.sort(hw);for(let P=0,w=l.length;P<w;P++){let b=l[P],I=b.color,C=b.intensity,U=b.distance,K=b.shadow&&b.shadow.map?b.shadow.map.texture:null;if(b.isAmbientLight)h+=I.r*C,u+=I.g*C,d+=I.b*C;else if(b.isLightProbe){for(let B=0;B<9;B++)n.probe[B].addScaledVector(b.sh.coefficients[B],C);T++}else if(b.isDirectionalLight){let B=t.get(b);if(B.color.copy(b.color).multiplyScalar(b.intensity),b.castShadow){let Q=b.shadow,G=e.get(b);G.shadowIntensity=Q.intensity,G.shadowBias=Q.bias,G.shadowNormalBias=Q.normalBias,G.shadowRadius=Q.radius,G.shadowMapSize=Q.mapSize,n.directionalShadow[f]=G,n.directionalShadowMap[f]=K,n.directionalShadowMatrix[f]=b.shadow.matrix,x++}n.directional[f]=B,f++}else if(b.isSpotLight){let B=t.get(b);B.position.setFromMatrixPosition(b.matrixWorld),B.color.copy(I).multiplyScalar(C),B.distance=U,B.coneCos=Math.cos(b.angle),B.penumbraCos=Math.cos(b.angle*(1-b.penumbra)),B.decay=b.decay,n.spot[y]=B;let Q=b.shadow;if(b.map&&(n.spotLightMap[k]=b.map,k++,Q.updateMatrices(b),b.castShadow&&M++),n.spotLightMatrix[y]=Q.matrix,b.castShadow){let G=e.get(b);G.shadowIntensity=Q.intensity,G.shadowBias=Q.bias,G.shadowNormalBias=Q.normalBias,G.shadowRadius=Q.radius,G.shadowMapSize=Q.mapSize,n.spotShadow[y]=G,n.spotShadowMap[y]=K,v++}y++}else if(b.isRectAreaLight){let B=t.get(b);B.color.copy(I).multiplyScalar(C),B.halfWidth.set(b.width*.5,0,0),B.halfHeight.set(0,b.height*.5,0),n.rectArea[m]=B,m++}else if(b.isPointLight){let B=t.get(b);if(B.color.copy(b.color).multiplyScalar(b.intensity),B.distance=b.distance,B.decay=b.decay,b.castShadow){let Q=b.shadow,G=e.get(b);G.shadowIntensity=Q.intensity,G.shadowBias=Q.bias,G.shadowNormalBias=Q.normalBias,G.shadowRadius=Q.radius,G.shadowMapSize=Q.mapSize,G.shadowCameraNear=Q.camera.near,G.shadowCameraFar=Q.camera.far,n.pointShadow[p]=G,n.pointShadowMap[p]=K,n.pointShadowMatrix[p]=b.shadow.matrix,_++}n.point[p]=B,p++}else if(b.isHemisphereLight){let B=t.get(b);B.skyColor.copy(b.color).multiplyScalar(C),B.groundColor.copy(b.groundColor).multiplyScalar(C),n.hemi[g]=B,g++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=lt.LTC_FLOAT_1,n.rectAreaLTC2=lt.LTC_FLOAT_2):(n.rectAreaLTC1=lt.LTC_HALF_1,n.rectAreaLTC2=lt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let R=n.hash;(R.directionalLength!==f||R.pointLength!==p||R.spotLength!==y||R.rectAreaLength!==m||R.hemiLength!==g||R.numDirectionalShadows!==x||R.numPointShadows!==_||R.numSpotShadows!==v||R.numSpotMaps!==k||R.numLightProbes!==T)&&(n.directional.length=f,n.spot.length=y,n.rectArea.length=m,n.point.length=p,n.hemi.length=g,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=_,n.pointShadowMap.length=_,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=_,n.spotLightMatrix.length=v+k-M,n.spotLightMap.length=k,n.numSpotLightShadowsWithMaps=M,n.numLightProbes=T,R.directionalLength=f,R.pointLength=p,R.spotLength=y,R.rectAreaLength=m,R.hemiLength=g,R.numDirectionalShadows=x,R.numPointShadows=_,R.numSpotShadows=v,R.numSpotMaps=k,R.numLightProbes=T,n.version=lw++)}function c(l,h){let u=0,d=0,f=0,p=0,y=0,m=h.matrixWorldInverse;for(let g=0,x=l.length;g<x;g++){let _=l[g];if(_.isDirectionalLight){let v=n.directional[u];v.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),u++}else if(_.isSpotLight){let v=n.spot[f];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),f++}else if(_.isRectAreaLight){let v=n.rectArea[p];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(m),o.identity(),r.copy(_.matrixWorld),r.premultiply(m),o.extractRotation(r),v.halfWidth.set(_.width*.5,0,0),v.halfHeight.set(0,_.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),p++}else if(_.isPointLight){let v=n.point[d];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(m),d++}else if(_.isHemisphereLight){let v=n.hemi[y];v.direction.setFromMatrixPosition(_.matrixWorld),v.direction.transformDirection(m),y++}}}return{setup:a,setupView:c,state:n}}function hf(s){let t=new uw(s),e=[],n=[];function i(h){l.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}let l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function dw(s){let t=new WeakMap;function e(i,r=0){let o=t.get(i),a;return o===void 0?(a=new hf(s),t.set(i,[a])):r>=o.length?(a=new hf(s),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var rh=class extends Je{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=i0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},oh=class extends Je{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},fw=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,pw=`uniform sampler2D shadow_pass;
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
}`;function mw(s,t,e){let n=new Hr,i=new ot,r=new ot,o=new $t,a=new rh({depthPacking:s0}),c=new oh,l={},h=e.maxTextureSize,u={[Fn]:je,[je]:Fn,[de]:de},d=new Mn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:fw,fragmentShader:pw}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let p=new Gt;p.setAttribute("position",new Ce(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new At(p,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ff;let g=this.type;this.render=function(M,T,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||M.length===0)return;let P=s.getRenderTarget(),w=s.getActiveCubeFace(),b=s.getActiveMipmapLevel(),I=s.state;I.setBlending(Ei),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);let C=g!==Jn&&this.type===Jn,U=g===Jn&&this.type!==Jn;for(let K=0,B=M.length;K<B;K++){let Q=M[K],G=Q.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;i.copy(G.mapSize);let ct=G.getFrameExtents();if(i.multiply(ct),r.copy(G.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/ct.x),i.x=r.x*ct.x,G.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/ct.y),i.y=r.y*ct.y,G.mapSize.y=r.y)),G.map===null||C===!0||U===!0){let gt=this.type!==Jn?{minFilter:Ke,magFilter:Ke}:{};G.map!==null&&G.map.dispose(),G.map=new si(i.x,i.y,gt),G.map.texture.name=Q.name+".shadowMap",G.camera.updateProjectionMatrix()}s.setRenderTarget(G.map),s.clear();let at=G.getViewportCount();for(let gt=0;gt<at;gt++){let jt=G.getViewport(gt);o.set(r.x*jt.x,r.y*jt.y,r.x*jt.z,r.y*jt.w),I.viewport(o),G.updateMatrices(Q,gt),n=G.getFrustum(),v(T,R,G.camera,Q,this.type)}G.isPointLightShadow!==!0&&this.type===Jn&&x(G,R),G.needsUpdate=!1}g=this.type,m.needsUpdate=!1,s.setRenderTarget(P,w,b)};function x(M,T){let R=t.update(y);d.defines.VSM_SAMPLES!==M.blurSamples&&(d.defines.VSM_SAMPLES=M.blurSamples,f.defines.VSM_SAMPLES=M.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),M.mapPass===null&&(M.mapPass=new si(i.x,i.y)),d.uniforms.shadow_pass.value=M.map.texture,d.uniforms.resolution.value=M.mapSize,d.uniforms.radius.value=M.radius,s.setRenderTarget(M.mapPass),s.clear(),s.renderBufferDirect(T,null,R,d,y,null),f.uniforms.shadow_pass.value=M.mapPass.texture,f.uniforms.resolution.value=M.mapSize,f.uniforms.radius.value=M.radius,s.setRenderTarget(M.map),s.clear(),s.renderBufferDirect(T,null,R,f,y,null)}function _(M,T,R,P){let w=null,b=R.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(b!==void 0)w=b;else if(w=R.isPointLight===!0?c:a,s.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){let I=w.uuid,C=T.uuid,U=l[I];U===void 0&&(U={},l[I]=U);let K=U[C];K===void 0&&(K=w.clone(),U[C]=K,T.addEventListener("dispose",k)),w=K}if(w.visible=T.visible,w.wireframe=T.wireframe,P===Jn?w.side=T.shadowSide!==null?T.shadowSide:T.side:w.side=T.shadowSide!==null?T.shadowSide:u[T.side],w.alphaMap=T.alphaMap,w.alphaTest=T.alphaTest,w.map=T.map,w.clipShadows=T.clipShadows,w.clippingPlanes=T.clippingPlanes,w.clipIntersection=T.clipIntersection,w.displacementMap=T.displacementMap,w.displacementScale=T.displacementScale,w.displacementBias=T.displacementBias,w.wireframeLinewidth=T.wireframeLinewidth,w.linewidth=T.linewidth,R.isPointLight===!0&&w.isMeshDistanceMaterial===!0){let I=s.properties.get(w);I.light=R}return w}function v(M,T,R,P,w){if(M.visible===!1)return;if(M.layers.test(T.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&w===Jn)&&(!M.frustumCulled||n.intersectsObject(M))){M.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,M.matrixWorld);let C=t.update(M),U=M.material;if(Array.isArray(U)){let K=C.groups;for(let B=0,Q=K.length;B<Q;B++){let G=K[B],ct=U[G.materialIndex];if(ct&&ct.visible){let at=_(M,ct,P,w);M.onBeforeShadow(s,M,T,R,C,at,G),s.renderBufferDirect(R,null,C,at,M,G),M.onAfterShadow(s,M,T,R,C,at,G)}}}else if(U.visible){let K=_(M,U,P,w);M.onBeforeShadow(s,M,T,R,C,K,null),s.renderBufferDirect(R,null,C,K,M,null),M.onAfterShadow(s,M,T,R,C,K,null)}}let I=M.children;for(let C=0,U=I.length;C<U;C++)v(I[C],T,R,P,w)}function k(M){M.target.removeEventListener("dispose",k);for(let R in l){let P=l[R],w=M.target.uuid;w in P&&(P[w].dispose(),delete P[w])}}}var gw={[fl]:pl,[ml]:_l,[gl]:xl,[Os]:yl,[pl]:fl,[_l]:ml,[xl]:gl,[yl]:Os};function yw(s){function t(){let D=!1,yt=new $t,X=null,J=new $t(0,0,0,0);return{setMask:function(pt){X!==pt&&!D&&(s.colorMask(pt,pt,pt,pt),X=pt)},setLocked:function(pt){D=pt},setClear:function(pt,_t,Jt,Ae,nn){nn===!0&&(pt*=Ae,_t*=Ae,Jt*=Ae),yt.set(pt,_t,Jt,Ae),J.equals(yt)===!1&&(s.clearColor(pt,_t,Jt,Ae),J.copy(yt))},reset:function(){D=!1,X=null,J.set(-1,0,0,0)}}}function e(){let D=!1,yt=!1,X=null,J=null,pt=null;return{setReversed:function(_t){yt=_t},setTest:function(_t){_t?Mt(s.DEPTH_TEST):ut(s.DEPTH_TEST)},setMask:function(_t){X!==_t&&!D&&(s.depthMask(_t),X=_t)},setFunc:function(_t){if(yt&&(_t=gw[_t]),J!==_t){switch(_t){case fl:s.depthFunc(s.NEVER);break;case pl:s.depthFunc(s.ALWAYS);break;case ml:s.depthFunc(s.LESS);break;case Os:s.depthFunc(s.LEQUAL);break;case gl:s.depthFunc(s.EQUAL);break;case yl:s.depthFunc(s.GEQUAL);break;case _l:s.depthFunc(s.GREATER);break;case xl:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}J=_t}},setLocked:function(_t){D=_t},setClear:function(_t){pt!==_t&&(s.clearDepth(_t),pt=_t)},reset:function(){D=!1,X=null,J=null,pt=null}}}function n(){let D=!1,yt=null,X=null,J=null,pt=null,_t=null,Jt=null,Ae=null,nn=null;return{setTest:function(ee){D||(ee?Mt(s.STENCIL_TEST):ut(s.STENCIL_TEST))},setMask:function(ee){yt!==ee&&!D&&(s.stencilMask(ee),yt=ee)},setFunc:function(ee,sn,Xn){(X!==ee||J!==sn||pt!==Xn)&&(s.stencilFunc(ee,sn,Xn),X=ee,J=sn,pt=Xn)},setOp:function(ee,sn,Xn){(_t!==ee||Jt!==sn||Ae!==Xn)&&(s.stencilOp(ee,sn,Xn),_t=ee,Jt=sn,Ae=Xn)},setLocked:function(ee){D=ee},setClear:function(ee){nn!==ee&&(s.clearStencil(ee),nn=ee)},reset:function(){D=!1,yt=null,X=null,J=null,pt=null,_t=null,Jt=null,Ae=null,nn=null}}}let i=new t,r=new e,o=new n,a=new WeakMap,c=new WeakMap,l={},h={},u=new WeakMap,d=[],f=null,p=!1,y=null,m=null,g=null,x=null,_=null,v=null,k=null,M=new tt(0,0,0),T=0,R=!1,P=null,w=null,b=null,I=null,C=null,U=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),K=!1,B=0,Q=s.getParameter(s.VERSION);Q.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(Q)[1]),K=B>=1):Q.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),K=B>=2);let G=null,ct={},at=s.getParameter(s.SCISSOR_BOX),gt=s.getParameter(s.VIEWPORT),jt=new $t().fromArray(at),Bt=new $t().fromArray(gt);function Z(D,yt,X,J){let pt=new Uint8Array(4),_t=s.createTexture();s.bindTexture(D,_t),s.texParameteri(D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(D,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Jt=0;Jt<X;Jt++)D===s.TEXTURE_3D||D===s.TEXTURE_2D_ARRAY?s.texImage3D(yt,0,s.RGBA,1,1,J,0,s.RGBA,s.UNSIGNED_BYTE,pt):s.texImage2D(yt+Jt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,pt);return _t}let et={};et[s.TEXTURE_2D]=Z(s.TEXTURE_2D,s.TEXTURE_2D,1),et[s.TEXTURE_CUBE_MAP]=Z(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),et[s.TEXTURE_2D_ARRAY]=Z(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),et[s.TEXTURE_3D]=Z(s.TEXTURE_3D,s.TEXTURE_3D,1,1),i.setClear(0,0,0,1),r.setClear(1),o.setClear(0),Mt(s.DEPTH_TEST),r.setFunc(Os),qt(!1),W(xd),Mt(s.CULL_FACE),L(Ei);function Mt(D){l[D]!==!0&&(s.enable(D),l[D]=!0)}function ut(D){l[D]!==!1&&(s.disable(D),l[D]=!1)}function Dt(D,yt){return h[D]!==yt?(s.bindFramebuffer(D,yt),h[D]=yt,D===s.DRAW_FRAMEBUFFER&&(h[s.FRAMEBUFFER]=yt),D===s.FRAMEBUFFER&&(h[s.DRAW_FRAMEBUFFER]=yt),!0):!1}function Pt(D,yt){let X=d,J=!1;if(D){X=u.get(yt),X===void 0&&(X=[],u.set(yt,X));let pt=D.textures;if(X.length!==pt.length||X[0]!==s.COLOR_ATTACHMENT0){for(let _t=0,Jt=pt.length;_t<Jt;_t++)X[_t]=s.COLOR_ATTACHMENT0+_t;X.length=pt.length,J=!0}}else X[0]!==s.BACK&&(X[0]=s.BACK,J=!0);J&&s.drawBuffers(X)}function Ht(D){return f!==D?(s.useProgram(D),f=D,!0):!1}let Zt={[Yi]:s.FUNC_ADD,[Rm]:s.FUNC_SUBTRACT,[km]:s.FUNC_REVERSE_SUBTRACT};Zt[Cm]=s.MIN,Zt[Pm]=s.MAX;let Wt={[Im]:s.ZERO,[Lm]:s.ONE,[Dm]:s.SRC_COLOR,[ul]:s.SRC_ALPHA,[Hm]:s.SRC_ALPHA_SATURATE,[Fm]:s.DST_COLOR,[Um]:s.DST_ALPHA,[Nm]:s.ONE_MINUS_SRC_COLOR,[dl]:s.ONE_MINUS_SRC_ALPHA,[Bm]:s.ONE_MINUS_DST_COLOR,[Om]:s.ONE_MINUS_DST_ALPHA,[Vm]:s.CONSTANT_COLOR,[Gm]:s.ONE_MINUS_CONSTANT_COLOR,[Wm]:s.CONSTANT_ALPHA,[Xm]:s.ONE_MINUS_CONSTANT_ALPHA};function L(D,yt,X,J,pt,_t,Jt,Ae,nn,ee){if(D===Ei){p===!0&&(ut(s.BLEND),p=!1);return}if(p===!1&&(Mt(s.BLEND),p=!0),D!==zm){if(D!==y||ee!==R){if((m!==Yi||_!==Yi)&&(s.blendEquation(s.FUNC_ADD),m=Yi,_=Yi),ee)switch(D){case Ls:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Dn:s.blendFunc(s.ONE,s.ONE);break;case wd:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ia:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Ls:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Dn:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case wd:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ia:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}g=null,x=null,v=null,k=null,M.set(0,0,0),T=0,y=D,R=ee}return}pt=pt||yt,_t=_t||X,Jt=Jt||J,(yt!==m||pt!==_)&&(s.blendEquationSeparate(Zt[yt],Zt[pt]),m=yt,_=pt),(X!==g||J!==x||_t!==v||Jt!==k)&&(s.blendFuncSeparate(Wt[X],Wt[J],Wt[_t],Wt[Jt]),g=X,x=J,v=_t,k=Jt),(Ae.equals(M)===!1||nn!==T)&&(s.blendColor(Ae.r,Ae.g,Ae.b,nn),M.copy(Ae),T=nn),y=D,R=!1}function Ye(D,yt){D.side===de?ut(s.CULL_FACE):Mt(s.CULL_FACE);let X=D.side===je;yt&&(X=!X),qt(X),D.blending===Ls&&D.transparent===!1?L(Ei):L(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),r.setFunc(D.depthFunc),r.setTest(D.depthTest),r.setMask(D.depthWrite),i.setMask(D.colorWrite);let J=D.stencilWrite;o.setTest(J),J&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),$(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?Mt(s.SAMPLE_ALPHA_TO_COVERAGE):ut(s.SAMPLE_ALPHA_TO_COVERAGE)}function qt(D){P!==D&&(D?s.frontFace(s.CW):s.frontFace(s.CCW),P=D)}function W(D){D!==Tm?(Mt(s.CULL_FACE),D!==w&&(D===xd?s.cullFace(s.BACK):D===Em?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):ut(s.CULL_FACE),w=D}function st(D){D!==b&&(K&&s.lineWidth(D),b=D)}function $(D,yt,X){D?(Mt(s.POLYGON_OFFSET_FILL),(I!==yt||C!==X)&&(s.polygonOffset(yt,X),I=yt,C=X)):ut(s.POLYGON_OFFSET_FILL)}function ft(D){D?Mt(s.SCISSOR_TEST):ut(s.SCISSOR_TEST)}function z(D){D===void 0&&(D=s.TEXTURE0+U-1),G!==D&&(s.activeTexture(D),G=D)}function A(D,yt,X){X===void 0&&(G===null?X=s.TEXTURE0+U-1:X=G);let J=ct[X];J===void 0&&(J={type:void 0,texture:void 0},ct[X]=J),(J.type!==D||J.texture!==yt)&&(G!==X&&(s.activeTexture(X),G=X),s.bindTexture(D,yt||et[D]),J.type=D,J.texture=yt)}function F(){let D=ct[G];D!==void 0&&D.type!==void 0&&(s.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function j(){try{s.compressedTexImage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function q(){try{s.compressedTexImage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Y(){try{s.texSubImage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Tt(){try{s.texSubImage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ht(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function dt(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Xt(){try{s.texStorage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function nt(){try{s.texStorage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function wt(){try{s.texImage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function kt(){try{s.texImage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ct(D){jt.equals(D)===!1&&(s.scissor(D.x,D.y,D.z,D.w),jt.copy(D))}function xt(D){Bt.equals(D)===!1&&(s.viewport(D.x,D.y,D.z,D.w),Bt.copy(D))}function Yt(D,yt){let X=c.get(yt);X===void 0&&(X=new WeakMap,c.set(yt,X));let J=X.get(D);J===void 0&&(J=s.getUniformBlockIndex(yt,D.name),X.set(D,J))}function Nt(D,yt){let J=c.get(yt).get(D);a.get(yt)!==J&&(s.uniformBlockBinding(yt,J,D.__bindingPointIndex),a.set(yt,J))}function ue(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),l={},G=null,ct={},h={},u=new WeakMap,d=[],f=null,p=!1,y=null,m=null,g=null,x=null,_=null,v=null,k=null,M=new tt(0,0,0),T=0,R=!1,P=null,w=null,b=null,I=null,C=null,jt.set(0,0,s.canvas.width,s.canvas.height),Bt.set(0,0,s.canvas.width,s.canvas.height),i.reset(),r.reset(),o.reset()}return{buffers:{color:i,depth:r,stencil:o},enable:Mt,disable:ut,bindFramebuffer:Dt,drawBuffers:Pt,useProgram:Ht,setBlending:L,setMaterial:Ye,setFlipSided:qt,setCullFace:W,setLineWidth:st,setPolygonOffset:$,setScissorTest:ft,activeTexture:z,bindTexture:A,unbindTexture:F,compressedTexImage2D:j,compressedTexImage3D:q,texImage2D:wt,texImage3D:kt,updateUBOMapping:Yt,uniformBlockBinding:Nt,texStorage2D:Xt,texStorage3D:nt,texSubImage2D:Y,texSubImage3D:Tt,compressedTexSubImage2D:ht,compressedTexSubImage3D:dt,scissor:Ct,viewport:xt,reset:ue}}function uf(s,t,e,n){let i=_w(n);switch(e){case Wf:return s*t;case Kf:return s*t;case jf:return s*t*2;case Hh:return s*t/i.components*i.byteLength;case Vh:return s*t/i.components*i.byteLength;case qf:return s*t*2/i.components*i.byteLength;case Gh:return s*t*2/i.components*i.byteLength;case Xf:return s*t*3/i.components*i.byteLength;case wn:return s*t*4/i.components*i.byteLength;case Wh:return s*t*4/i.components*i.byteLength;case $o:case Jo:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Qo:case ta:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ml:case Sl:return Math.max(s,16)*Math.max(t,8)/4;case vl:case bl:return Math.max(s,8)*Math.max(t,8)/2;case Al:case Tl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case El:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case zl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Rl:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case kl:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Cl:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case Pl:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Il:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Ll:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case Dl:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case Nl:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case Ul:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case Ol:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case Fl:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case Bl:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case Hl:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case ea:case Vl:case Gl:return Math.ceil(s/4)*Math.ceil(t/4)*16;case Yf:case Wl:return Math.ceil(s/4)*Math.ceil(t/4)*8;case Xl:case Kl:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function _w(s){switch(s){case ni:case Hf:return{byteLength:1,components:1};case Or:case Vf:case Jr:return{byteLength:2,components:1};case Fh:case Bh:return{byteLength:2,components:4};case Ji:case Oh:case Ln:return{byteLength:4,components:1};case Gf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function xw(s,t,e,n,i,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ot,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(z,A){return f?new OffscreenCanvas(z,A):Fr("canvas")}function y(z,A,F){let j=1,q=ft(z);if((q.width>F||q.height>F)&&(j=F/Math.max(q.width,q.height)),j<1)if(typeof HTMLImageElement<"u"&&z instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&z instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&z instanceof ImageBitmap||typeof VideoFrame<"u"&&z instanceof VideoFrame){let Y=Math.floor(j*q.width),Tt=Math.floor(j*q.height);u===void 0&&(u=p(Y,Tt));let ht=A?p(Y,Tt):u;return ht.width=Y,ht.height=Tt,ht.getContext("2d").drawImage(z,0,0,Y,Tt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+Y+"x"+Tt+")."),ht}else return"data"in z&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),z;return z}function m(z){return z.generateMipmaps&&z.minFilter!==Ke&&z.minFilter!==rn}function g(z){s.generateMipmap(z)}function x(z,A,F,j,q=!1){if(z!==null){if(s[z]!==void 0)return s[z];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+z+"'")}let Y=A;if(A===s.RED&&(F===s.FLOAT&&(Y=s.R32F),F===s.HALF_FLOAT&&(Y=s.R16F),F===s.UNSIGNED_BYTE&&(Y=s.R8)),A===s.RED_INTEGER&&(F===s.UNSIGNED_BYTE&&(Y=s.R8UI),F===s.UNSIGNED_SHORT&&(Y=s.R16UI),F===s.UNSIGNED_INT&&(Y=s.R32UI),F===s.BYTE&&(Y=s.R8I),F===s.SHORT&&(Y=s.R16I),F===s.INT&&(Y=s.R32I)),A===s.RG&&(F===s.FLOAT&&(Y=s.RG32F),F===s.HALF_FLOAT&&(Y=s.RG16F),F===s.UNSIGNED_BYTE&&(Y=s.RG8)),A===s.RG_INTEGER&&(F===s.UNSIGNED_BYTE&&(Y=s.RG8UI),F===s.UNSIGNED_SHORT&&(Y=s.RG16UI),F===s.UNSIGNED_INT&&(Y=s.RG32UI),F===s.BYTE&&(Y=s.RG8I),F===s.SHORT&&(Y=s.RG16I),F===s.INT&&(Y=s.RG32I)),A===s.RGB_INTEGER&&(F===s.UNSIGNED_BYTE&&(Y=s.RGB8UI),F===s.UNSIGNED_SHORT&&(Y=s.RGB16UI),F===s.UNSIGNED_INT&&(Y=s.RGB32UI),F===s.BYTE&&(Y=s.RGB8I),F===s.SHORT&&(Y=s.RGB16I),F===s.INT&&(Y=s.RGB32I)),A===s.RGBA_INTEGER&&(F===s.UNSIGNED_BYTE&&(Y=s.RGBA8UI),F===s.UNSIGNED_SHORT&&(Y=s.RGBA16UI),F===s.UNSIGNED_INT&&(Y=s.RGBA32UI),F===s.BYTE&&(Y=s.RGBA8I),F===s.SHORT&&(Y=s.RGBA16I),F===s.INT&&(Y=s.RGBA32I)),A===s.RGB&&F===s.UNSIGNED_INT_5_9_9_9_REV&&(Y=s.RGB9_E5),A===s.RGBA){let Tt=q?ra:Qt.getTransfer(j);F===s.FLOAT&&(Y=s.RGBA32F),F===s.HALF_FLOAT&&(Y=s.RGBA16F),F===s.UNSIGNED_BYTE&&(Y=Tt===ye?s.SRGB8_ALPHA8:s.RGBA8),F===s.UNSIGNED_SHORT_4_4_4_4&&(Y=s.RGBA4),F===s.UNSIGNED_SHORT_5_5_5_1&&(Y=s.RGB5_A1)}return(Y===s.R16F||Y===s.R32F||Y===s.RG16F||Y===s.RG32F||Y===s.RGBA16F||Y===s.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function _(z,A){let F;return z?A===null||A===Ji||A===Hs?F=s.DEPTH24_STENCIL8:A===Ln?F=s.DEPTH32F_STENCIL8:A===Or&&(F=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===Ji||A===Hs?F=s.DEPTH_COMPONENT24:A===Ln?F=s.DEPTH_COMPONENT32F:A===Or&&(F=s.DEPTH_COMPONENT16),F}function v(z,A){return m(z)===!0||z.isFramebufferTexture&&z.minFilter!==Ke&&z.minFilter!==rn?Math.log2(Math.max(A.width,A.height))+1:z.mipmaps!==void 0&&z.mipmaps.length>0?z.mipmaps.length:z.isCompressedTexture&&Array.isArray(z.image)?A.mipmaps.length:1}function k(z){let A=z.target;A.removeEventListener("dispose",k),T(A),A.isVideoTexture&&h.delete(A)}function M(z){let A=z.target;A.removeEventListener("dispose",M),P(A)}function T(z){let A=n.get(z);if(A.__webglInit===void 0)return;let F=z.source,j=d.get(F);if(j){let q=j[A.__cacheKey];q.usedTimes--,q.usedTimes===0&&R(z),Object.keys(j).length===0&&d.delete(F)}n.remove(z)}function R(z){let A=n.get(z);s.deleteTexture(A.__webglTexture);let F=z.source,j=d.get(F);delete j[A.__cacheKey],o.memory.textures--}function P(z){let A=n.get(z);if(z.depthTexture&&z.depthTexture.dispose(),z.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(A.__webglFramebuffer[j]))for(let q=0;q<A.__webglFramebuffer[j].length;q++)s.deleteFramebuffer(A.__webglFramebuffer[j][q]);else s.deleteFramebuffer(A.__webglFramebuffer[j]);A.__webglDepthbuffer&&s.deleteRenderbuffer(A.__webglDepthbuffer[j])}else{if(Array.isArray(A.__webglFramebuffer))for(let j=0;j<A.__webglFramebuffer.length;j++)s.deleteFramebuffer(A.__webglFramebuffer[j]);else s.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&s.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&s.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let j=0;j<A.__webglColorRenderbuffer.length;j++)A.__webglColorRenderbuffer[j]&&s.deleteRenderbuffer(A.__webglColorRenderbuffer[j]);A.__webglDepthRenderbuffer&&s.deleteRenderbuffer(A.__webglDepthRenderbuffer)}let F=z.textures;for(let j=0,q=F.length;j<q;j++){let Y=n.get(F[j]);Y.__webglTexture&&(s.deleteTexture(Y.__webglTexture),o.memory.textures--),n.remove(F[j])}n.remove(z)}let w=0;function b(){w=0}function I(){let z=w;return z>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+z+" texture units while this GPU supports only "+i.maxTextures),w+=1,z}function C(z){let A=[];return A.push(z.wrapS),A.push(z.wrapT),A.push(z.wrapR||0),A.push(z.magFilter),A.push(z.minFilter),A.push(z.anisotropy),A.push(z.internalFormat),A.push(z.format),A.push(z.type),A.push(z.generateMipmaps),A.push(z.premultiplyAlpha),A.push(z.flipY),A.push(z.unpackAlignment),A.push(z.colorSpace),A.join()}function U(z,A){let F=n.get(z);if(z.isVideoTexture&&st(z),z.isRenderTargetTexture===!1&&z.version>0&&F.__version!==z.version){let j=z.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Bt(F,z,A);return}}e.bindTexture(s.TEXTURE_2D,F.__webglTexture,s.TEXTURE0+A)}function K(z,A){let F=n.get(z);if(z.version>0&&F.__version!==z.version){Bt(F,z,A);return}e.bindTexture(s.TEXTURE_2D_ARRAY,F.__webglTexture,s.TEXTURE0+A)}function B(z,A){let F=n.get(z);if(z.version>0&&F.__version!==z.version){Bt(F,z,A);return}e.bindTexture(s.TEXTURE_3D,F.__webglTexture,s.TEXTURE0+A)}function Q(z,A){let F=n.get(z);if(z.version>0&&F.__version!==z.version){Z(F,z,A);return}e.bindTexture(s.TEXTURE_CUBE_MAP,F.__webglTexture,s.TEXTURE0+A)}let G={[Bn]:s.REPEAT,[ti]:s.CLAMP_TO_EDGE,[Ur]:s.MIRRORED_REPEAT},ct={[Ke]:s.NEAREST,[Uh]:s.NEAREST_MIPMAP_NEAREST,[Rs]:s.NEAREST_MIPMAP_LINEAR,[rn]:s.LINEAR,[Rr]:s.LINEAR_MIPMAP_NEAREST,[On]:s.LINEAR_MIPMAP_LINEAR},at={[o0]:s.NEVER,[d0]:s.ALWAYS,[a0]:s.LESS,[Jf]:s.LEQUAL,[c0]:s.EQUAL,[u0]:s.GEQUAL,[l0]:s.GREATER,[h0]:s.NOTEQUAL};function gt(z,A){if(A.type===Ln&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===rn||A.magFilter===Rr||A.magFilter===Rs||A.magFilter===On||A.minFilter===rn||A.minFilter===Rr||A.minFilter===Rs||A.minFilter===On)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(z,s.TEXTURE_WRAP_S,G[A.wrapS]),s.texParameteri(z,s.TEXTURE_WRAP_T,G[A.wrapT]),(z===s.TEXTURE_3D||z===s.TEXTURE_2D_ARRAY)&&s.texParameteri(z,s.TEXTURE_WRAP_R,G[A.wrapR]),s.texParameteri(z,s.TEXTURE_MAG_FILTER,ct[A.magFilter]),s.texParameteri(z,s.TEXTURE_MIN_FILTER,ct[A.minFilter]),A.compareFunction&&(s.texParameteri(z,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(z,s.TEXTURE_COMPARE_FUNC,at[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===Ke||A.minFilter!==Rs&&A.minFilter!==On||A.type===Ln&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||n.get(A).__currentAnisotropy){let F=t.get("EXT_texture_filter_anisotropic");s.texParameterf(z,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,i.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy}}}function jt(z,A){let F=!1;z.__webglInit===void 0&&(z.__webglInit=!0,A.addEventListener("dispose",k));let j=A.source,q=d.get(j);q===void 0&&(q={},d.set(j,q));let Y=C(A);if(Y!==z.__cacheKey){q[Y]===void 0&&(q[Y]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,F=!0),q[Y].usedTimes++;let Tt=q[z.__cacheKey];Tt!==void 0&&(q[z.__cacheKey].usedTimes--,Tt.usedTimes===0&&R(A)),z.__cacheKey=Y,z.__webglTexture=q[Y].texture}return F}function Bt(z,A,F){let j=s.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(j=s.TEXTURE_2D_ARRAY),A.isData3DTexture&&(j=s.TEXTURE_3D);let q=jt(z,A),Y=A.source;e.bindTexture(j,z.__webglTexture,s.TEXTURE0+F);let Tt=n.get(Y);if(Y.version!==Tt.__version||q===!0){e.activeTexture(s.TEXTURE0+F);let ht=Qt.getPrimaries(Qt.workingColorSpace),dt=A.colorSpace===Si?null:Qt.getPrimaries(A.colorSpace),Xt=A.colorSpace===Si||ht===dt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,A.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,A.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xt);let nt=y(A.image,!1,i.maxTextureSize);nt=$(A,nt);let wt=r.convert(A.format,A.colorSpace),kt=r.convert(A.type),Ct=x(A.internalFormat,wt,kt,A.colorSpace,A.isVideoTexture);gt(j,A);let xt,Yt=A.mipmaps,Nt=A.isVideoTexture!==!0,ue=Tt.__version===void 0||q===!0,D=Y.dataReady,yt=v(A,nt);if(A.isDepthTexture)Ct=_(A.format===Vs,A.type),ue&&(Nt?e.texStorage2D(s.TEXTURE_2D,1,Ct,nt.width,nt.height):e.texImage2D(s.TEXTURE_2D,0,Ct,nt.width,nt.height,0,wt,kt,null));else if(A.isDataTexture)if(Yt.length>0){Nt&&ue&&e.texStorage2D(s.TEXTURE_2D,yt,Ct,Yt[0].width,Yt[0].height);for(let X=0,J=Yt.length;X<J;X++)xt=Yt[X],Nt?D&&e.texSubImage2D(s.TEXTURE_2D,X,0,0,xt.width,xt.height,wt,kt,xt.data):e.texImage2D(s.TEXTURE_2D,X,Ct,xt.width,xt.height,0,wt,kt,xt.data);A.generateMipmaps=!1}else Nt?(ue&&e.texStorage2D(s.TEXTURE_2D,yt,Ct,nt.width,nt.height),D&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,nt.width,nt.height,wt,kt,nt.data)):e.texImage2D(s.TEXTURE_2D,0,Ct,nt.width,nt.height,0,wt,kt,nt.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){Nt&&ue&&e.texStorage3D(s.TEXTURE_2D_ARRAY,yt,Ct,Yt[0].width,Yt[0].height,nt.depth);for(let X=0,J=Yt.length;X<J;X++)if(xt=Yt[X],A.format!==wn)if(wt!==null)if(Nt){if(D)if(A.layerUpdates.size>0){let pt=uf(xt.width,xt.height,A.format,A.type);for(let _t of A.layerUpdates){let Jt=xt.data.subarray(_t*pt/xt.data.BYTES_PER_ELEMENT,(_t+1)*pt/xt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,X,0,0,_t,xt.width,xt.height,1,wt,Jt,0,0)}A.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,X,0,0,0,xt.width,xt.height,nt.depth,wt,xt.data,0,0)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,X,Ct,xt.width,xt.height,nt.depth,0,xt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Nt?D&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,X,0,0,0,xt.width,xt.height,nt.depth,wt,kt,xt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,X,Ct,xt.width,xt.height,nt.depth,0,wt,kt,xt.data)}else{Nt&&ue&&e.texStorage2D(s.TEXTURE_2D,yt,Ct,Yt[0].width,Yt[0].height);for(let X=0,J=Yt.length;X<J;X++)xt=Yt[X],A.format!==wn?wt!==null?Nt?D&&e.compressedTexSubImage2D(s.TEXTURE_2D,X,0,0,xt.width,xt.height,wt,xt.data):e.compressedTexImage2D(s.TEXTURE_2D,X,Ct,xt.width,xt.height,0,xt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Nt?D&&e.texSubImage2D(s.TEXTURE_2D,X,0,0,xt.width,xt.height,wt,kt,xt.data):e.texImage2D(s.TEXTURE_2D,X,Ct,xt.width,xt.height,0,wt,kt,xt.data)}else if(A.isDataArrayTexture)if(Nt){if(ue&&e.texStorage3D(s.TEXTURE_2D_ARRAY,yt,Ct,nt.width,nt.height,nt.depth),D)if(A.layerUpdates.size>0){let X=uf(nt.width,nt.height,A.format,A.type);for(let J of A.layerUpdates){let pt=nt.data.subarray(J*X/nt.data.BYTES_PER_ELEMENT,(J+1)*X/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,J,nt.width,nt.height,1,wt,kt,pt)}A.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,wt,kt,nt.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,Ct,nt.width,nt.height,nt.depth,0,wt,kt,nt.data);else if(A.isData3DTexture)Nt?(ue&&e.texStorage3D(s.TEXTURE_3D,yt,Ct,nt.width,nt.height,nt.depth),D&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,wt,kt,nt.data)):e.texImage3D(s.TEXTURE_3D,0,Ct,nt.width,nt.height,nt.depth,0,wt,kt,nt.data);else if(A.isFramebufferTexture){if(ue)if(Nt)e.texStorage2D(s.TEXTURE_2D,yt,Ct,nt.width,nt.height);else{let X=nt.width,J=nt.height;for(let pt=0;pt<yt;pt++)e.texImage2D(s.TEXTURE_2D,pt,Ct,X,J,0,wt,kt,null),X>>=1,J>>=1}}else if(Yt.length>0){if(Nt&&ue){let X=ft(Yt[0]);e.texStorage2D(s.TEXTURE_2D,yt,Ct,X.width,X.height)}for(let X=0,J=Yt.length;X<J;X++)xt=Yt[X],Nt?D&&e.texSubImage2D(s.TEXTURE_2D,X,0,0,wt,kt,xt):e.texImage2D(s.TEXTURE_2D,X,Ct,wt,kt,xt);A.generateMipmaps=!1}else if(Nt){if(ue){let X=ft(nt);e.texStorage2D(s.TEXTURE_2D,yt,Ct,X.width,X.height)}D&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,wt,kt,nt)}else e.texImage2D(s.TEXTURE_2D,0,Ct,wt,kt,nt);m(A)&&g(j),Tt.__version=Y.version,A.onUpdate&&A.onUpdate(A)}z.__version=A.version}function Z(z,A,F){if(A.image.length!==6)return;let j=jt(z,A),q=A.source;e.bindTexture(s.TEXTURE_CUBE_MAP,z.__webglTexture,s.TEXTURE0+F);let Y=n.get(q);if(q.version!==Y.__version||j===!0){e.activeTexture(s.TEXTURE0+F);let Tt=Qt.getPrimaries(Qt.workingColorSpace),ht=A.colorSpace===Si?null:Qt.getPrimaries(A.colorSpace),dt=A.colorSpace===Si||Tt===ht?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,A.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,A.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,dt);let Xt=A.isCompressedTexture||A.image[0].isCompressedTexture,nt=A.image[0]&&A.image[0].isDataTexture,wt=[];for(let J=0;J<6;J++)!Xt&&!nt?wt[J]=y(A.image[J],!0,i.maxCubemapSize):wt[J]=nt?A.image[J].image:A.image[J],wt[J]=$(A,wt[J]);let kt=wt[0],Ct=r.convert(A.format,A.colorSpace),xt=r.convert(A.type),Yt=x(A.internalFormat,Ct,xt,A.colorSpace),Nt=A.isVideoTexture!==!0,ue=Y.__version===void 0||j===!0,D=q.dataReady,yt=v(A,kt);gt(s.TEXTURE_CUBE_MAP,A);let X;if(Xt){Nt&&ue&&e.texStorage2D(s.TEXTURE_CUBE_MAP,yt,Yt,kt.width,kt.height);for(let J=0;J<6;J++){X=wt[J].mipmaps;for(let pt=0;pt<X.length;pt++){let _t=X[pt];A.format!==wn?Ct!==null?Nt?D&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,pt,0,0,_t.width,_t.height,Ct,_t.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,pt,Yt,_t.width,_t.height,0,_t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Nt?D&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,pt,0,0,_t.width,_t.height,Ct,xt,_t.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,pt,Yt,_t.width,_t.height,0,Ct,xt,_t.data)}}}else{if(X=A.mipmaps,Nt&&ue){X.length>0&&yt++;let J=ft(wt[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,yt,Yt,J.width,J.height)}for(let J=0;J<6;J++)if(nt){Nt?D&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,wt[J].width,wt[J].height,Ct,xt,wt[J].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Yt,wt[J].width,wt[J].height,0,Ct,xt,wt[J].data);for(let pt=0;pt<X.length;pt++){let Jt=X[pt].image[J].image;Nt?D&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,pt+1,0,0,Jt.width,Jt.height,Ct,xt,Jt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,pt+1,Yt,Jt.width,Jt.height,0,Ct,xt,Jt.data)}}else{Nt?D&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Ct,xt,wt[J]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Yt,Ct,xt,wt[J]);for(let pt=0;pt<X.length;pt++){let _t=X[pt];Nt?D&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,pt+1,0,0,Ct,xt,_t.image[J]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,pt+1,Yt,Ct,xt,_t.image[J])}}}m(A)&&g(s.TEXTURE_CUBE_MAP),Y.__version=q.version,A.onUpdate&&A.onUpdate(A)}z.__version=A.version}function et(z,A,F,j,q,Y){let Tt=r.convert(F.format,F.colorSpace),ht=r.convert(F.type),dt=x(F.internalFormat,Tt,ht,F.colorSpace);if(!n.get(A).__hasExternalTextures){let nt=Math.max(1,A.width>>Y),wt=Math.max(1,A.height>>Y);q===s.TEXTURE_3D||q===s.TEXTURE_2D_ARRAY?e.texImage3D(q,Y,dt,nt,wt,A.depth,0,Tt,ht,null):e.texImage2D(q,Y,dt,nt,wt,0,Tt,ht,null)}e.bindFramebuffer(s.FRAMEBUFFER,z),W(A)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,j,q,n.get(F).__webglTexture,0,qt(A)):(q===s.TEXTURE_2D||q>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,j,q,n.get(F).__webglTexture,Y),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Mt(z,A,F){if(s.bindRenderbuffer(s.RENDERBUFFER,z),A.depthBuffer){let j=A.depthTexture,q=j&&j.isDepthTexture?j.type:null,Y=_(A.stencilBuffer,q),Tt=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ht=qt(A);W(A)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ht,Y,A.width,A.height):F?s.renderbufferStorageMultisample(s.RENDERBUFFER,ht,Y,A.width,A.height):s.renderbufferStorage(s.RENDERBUFFER,Y,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Tt,s.RENDERBUFFER,z)}else{let j=A.textures;for(let q=0;q<j.length;q++){let Y=j[q],Tt=r.convert(Y.format,Y.colorSpace),ht=r.convert(Y.type),dt=x(Y.internalFormat,Tt,ht,Y.colorSpace),Xt=qt(A);F&&W(A)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Xt,dt,A.width,A.height):W(A)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Xt,dt,A.width,A.height):s.renderbufferStorage(s.RENDERBUFFER,dt,A.width,A.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function ut(z,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,z),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(A.depthTexture).__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),U(A.depthTexture,0);let j=n.get(A.depthTexture).__webglTexture,q=qt(A);if(A.depthTexture.format===Ds)W(A)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,j,0,q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,j,0);else if(A.depthTexture.format===Vs)W(A)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,j,0,q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function Dt(z){let A=n.get(z),F=z.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==z.depthTexture){let j=z.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),j){let q=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,j.removeEventListener("dispose",q)};j.addEventListener("dispose",q),A.__depthDisposeCallback=q}A.__boundDepthTexture=j}if(z.depthTexture&&!A.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");ut(A.__webglFramebuffer,z)}else if(F){A.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(e.bindFramebuffer(s.FRAMEBUFFER,A.__webglFramebuffer[j]),A.__webglDepthbuffer[j]===void 0)A.__webglDepthbuffer[j]=s.createRenderbuffer(),Mt(A.__webglDepthbuffer[j],z,!1);else{let q=z.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Y=A.__webglDepthbuffer[j];s.bindRenderbuffer(s.RENDERBUFFER,Y),s.framebufferRenderbuffer(s.FRAMEBUFFER,q,s.RENDERBUFFER,Y)}}else if(e.bindFramebuffer(s.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=s.createRenderbuffer(),Mt(A.__webglDepthbuffer,z,!1);else{let j=z.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,q=A.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,q),s.framebufferRenderbuffer(s.FRAMEBUFFER,j,s.RENDERBUFFER,q)}e.bindFramebuffer(s.FRAMEBUFFER,null)}function Pt(z,A,F){let j=n.get(z);A!==void 0&&et(j.__webglFramebuffer,z,z.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),F!==void 0&&Dt(z)}function Ht(z){let A=z.texture,F=n.get(z),j=n.get(A);z.addEventListener("dispose",M);let q=z.textures,Y=z.isWebGLCubeRenderTarget===!0,Tt=q.length>1;if(Tt||(j.__webglTexture===void 0&&(j.__webglTexture=s.createTexture()),j.__version=A.version,o.memory.textures++),Y){F.__webglFramebuffer=[];for(let ht=0;ht<6;ht++)if(A.mipmaps&&A.mipmaps.length>0){F.__webglFramebuffer[ht]=[];for(let dt=0;dt<A.mipmaps.length;dt++)F.__webglFramebuffer[ht][dt]=s.createFramebuffer()}else F.__webglFramebuffer[ht]=s.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){F.__webglFramebuffer=[];for(let ht=0;ht<A.mipmaps.length;ht++)F.__webglFramebuffer[ht]=s.createFramebuffer()}else F.__webglFramebuffer=s.createFramebuffer();if(Tt)for(let ht=0,dt=q.length;ht<dt;ht++){let Xt=n.get(q[ht]);Xt.__webglTexture===void 0&&(Xt.__webglTexture=s.createTexture(),o.memory.textures++)}if(z.samples>0&&W(z)===!1){F.__webglMultisampledFramebuffer=s.createFramebuffer(),F.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let ht=0;ht<q.length;ht++){let dt=q[ht];F.__webglColorRenderbuffer[ht]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,F.__webglColorRenderbuffer[ht]);let Xt=r.convert(dt.format,dt.colorSpace),nt=r.convert(dt.type),wt=x(dt.internalFormat,Xt,nt,dt.colorSpace,z.isXRRenderTarget===!0),kt=qt(z);s.renderbufferStorageMultisample(s.RENDERBUFFER,kt,wt,z.width,z.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ht,s.RENDERBUFFER,F.__webglColorRenderbuffer[ht])}s.bindRenderbuffer(s.RENDERBUFFER,null),z.depthBuffer&&(F.__webglDepthRenderbuffer=s.createRenderbuffer(),Mt(F.__webglDepthRenderbuffer,z,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Y){e.bindTexture(s.TEXTURE_CUBE_MAP,j.__webglTexture),gt(s.TEXTURE_CUBE_MAP,A);for(let ht=0;ht<6;ht++)if(A.mipmaps&&A.mipmaps.length>0)for(let dt=0;dt<A.mipmaps.length;dt++)et(F.__webglFramebuffer[ht][dt],z,A,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ht,dt);else et(F.__webglFramebuffer[ht],z,A,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0);m(A)&&g(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Tt){for(let ht=0,dt=q.length;ht<dt;ht++){let Xt=q[ht],nt=n.get(Xt);e.bindTexture(s.TEXTURE_2D,nt.__webglTexture),gt(s.TEXTURE_2D,Xt),et(F.__webglFramebuffer,z,Xt,s.COLOR_ATTACHMENT0+ht,s.TEXTURE_2D,0),m(Xt)&&g(s.TEXTURE_2D)}e.unbindTexture()}else{let ht=s.TEXTURE_2D;if((z.isWebGL3DRenderTarget||z.isWebGLArrayRenderTarget)&&(ht=z.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(ht,j.__webglTexture),gt(ht,A),A.mipmaps&&A.mipmaps.length>0)for(let dt=0;dt<A.mipmaps.length;dt++)et(F.__webglFramebuffer[dt],z,A,s.COLOR_ATTACHMENT0,ht,dt);else et(F.__webglFramebuffer,z,A,s.COLOR_ATTACHMENT0,ht,0);m(A)&&g(ht),e.unbindTexture()}z.depthBuffer&&Dt(z)}function Zt(z){let A=z.textures;for(let F=0,j=A.length;F<j;F++){let q=A[F];if(m(q)){let Y=z.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,Tt=n.get(q).__webglTexture;e.bindTexture(Y,Tt),g(Y),e.unbindTexture()}}}let Wt=[],L=[];function Ye(z){if(z.samples>0){if(W(z)===!1){let A=z.textures,F=z.width,j=z.height,q=s.COLOR_BUFFER_BIT,Y=z.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Tt=n.get(z),ht=A.length>1;if(ht)for(let dt=0;dt<A.length;dt++)e.bindFramebuffer(s.FRAMEBUFFER,Tt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+dt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,Tt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+dt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,Tt.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Tt.__webglFramebuffer);for(let dt=0;dt<A.length;dt++){if(z.resolveDepthBuffer&&(z.depthBuffer&&(q|=s.DEPTH_BUFFER_BIT),z.stencilBuffer&&z.resolveStencilBuffer&&(q|=s.STENCIL_BUFFER_BIT)),ht){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Tt.__webglColorRenderbuffer[dt]);let Xt=n.get(A[dt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Xt,0)}s.blitFramebuffer(0,0,F,j,0,0,F,j,q,s.NEAREST),c===!0&&(Wt.length=0,L.length=0,Wt.push(s.COLOR_ATTACHMENT0+dt),z.depthBuffer&&z.resolveDepthBuffer===!1&&(Wt.push(Y),L.push(Y),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,L)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Wt))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ht)for(let dt=0;dt<A.length;dt++){e.bindFramebuffer(s.FRAMEBUFFER,Tt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+dt,s.RENDERBUFFER,Tt.__webglColorRenderbuffer[dt]);let Xt=n.get(A[dt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,Tt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+dt,s.TEXTURE_2D,Xt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Tt.__webglMultisampledFramebuffer)}else if(z.depthBuffer&&z.resolveDepthBuffer===!1&&c){let A=z.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[A])}}}function qt(z){return Math.min(i.maxSamples,z.samples)}function W(z){let A=n.get(z);return z.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function st(z){let A=o.render.frame;h.get(z)!==A&&(h.set(z,A),z.update())}function $(z,A){let F=z.colorSpace,j=z.format,q=z.type;return z.isCompressedTexture===!0||z.isVideoTexture===!0||F!==Be&&F!==Si&&(Qt.getTransfer(F)===ye?(j!==wn||q!==ni)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),A}function ft(z){return typeof HTMLImageElement<"u"&&z instanceof HTMLImageElement?(l.width=z.naturalWidth||z.width,l.height=z.naturalHeight||z.height):typeof VideoFrame<"u"&&z instanceof VideoFrame?(l.width=z.displayWidth,l.height=z.displayHeight):(l.width=z.width,l.height=z.height),l}this.allocateTextureUnit=I,this.resetTextureUnits=b,this.setTexture2D=U,this.setTexture2DArray=K,this.setTexture3D=B,this.setTextureCube=Q,this.rebindTextures=Pt,this.setupRenderTarget=Ht,this.updateRenderTargetMipmap=Zt,this.updateMultisampleRenderTarget=Ye,this.setupDepthRenderbuffer=Dt,this.setupFrameBufferTexture=et,this.useMultisampledRTT=W}function ww(s,t){function e(n,i=Si){let r,o=Qt.getTransfer(i);if(n===ni)return s.UNSIGNED_BYTE;if(n===Fh)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Bh)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Gf)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Hf)return s.BYTE;if(n===Vf)return s.SHORT;if(n===Or)return s.UNSIGNED_SHORT;if(n===Oh)return s.INT;if(n===Ji)return s.UNSIGNED_INT;if(n===Ln)return s.FLOAT;if(n===Jr)return s.HALF_FLOAT;if(n===Wf)return s.ALPHA;if(n===Xf)return s.RGB;if(n===wn)return s.RGBA;if(n===Kf)return s.LUMINANCE;if(n===jf)return s.LUMINANCE_ALPHA;if(n===Ds)return s.DEPTH_COMPONENT;if(n===Vs)return s.DEPTH_STENCIL;if(n===Hh)return s.RED;if(n===Vh)return s.RED_INTEGER;if(n===qf)return s.RG;if(n===Gh)return s.RG_INTEGER;if(n===Wh)return s.RGBA_INTEGER;if(n===$o||n===Jo||n===Qo||n===ta)if(o===ye)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===$o)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Jo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Qo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ta)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===$o)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Jo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Qo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ta)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===vl||n===Ml||n===bl||n===Sl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===vl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ml)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===bl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Sl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Al||n===Tl||n===El)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Al||n===Tl)return o===ye?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===El)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===zl||n===Rl||n===kl||n===Cl||n===Pl||n===Il||n===Ll||n===Dl||n===Nl||n===Ul||n===Ol||n===Fl||n===Bl||n===Hl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===zl)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Rl)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===kl)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Cl)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Pl)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Il)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ll)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Dl)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Nl)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ul)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ol)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Fl)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Bl)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Hl)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ea||n===Vl||n===Gl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===ea)return o===ye?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Vl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Gl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Yf||n===Wl||n===Xl||n===Kl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===ea)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Wl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Xl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Kl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Hs?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}var ah=class extends Ve{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},it=class extends fe{constructor(){super(),this.isGroup=!0,this.type="Group"}},vw={type:"move"},Pr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new it,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new it,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new S,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new S),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new it,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new S,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new S),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(let y of t.hand.values()){let m=e.getJointPose(y,n),g=this._getHandJoint(l,y);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;l.inputState.pinching&&d>f+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(vw)))}return a!==null&&(a.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new it;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Mw=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,bw=`
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

}`,ch=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){let i=new Fe,r=t.properties.get(i);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new Mn({vertexShader:Mw,fragmentShader:bw,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new At(new Hn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},lh=class extends ii{constructor(t,e){super();let n=this,i=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,p=null,y=new ch,m=e.getContextAttributes(),g=null,x=null,_=[],v=[],k=new ot,M=null,T=new Ve;T.layers.enable(1),T.viewport=new $t;let R=new Ve;R.layers.enable(2),R.viewport=new $t;let P=[T,R],w=new ah;w.layers.enable(1),w.layers.enable(2);let b=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let et=_[Z];return et===void 0&&(et=new Pr,_[Z]=et),et.getTargetRaySpace()},this.getControllerGrip=function(Z){let et=_[Z];return et===void 0&&(et=new Pr,_[Z]=et),et.getGripSpace()},this.getHand=function(Z){let et=_[Z];return et===void 0&&(et=new Pr,_[Z]=et),et.getHandSpace()};function C(Z){let et=v.indexOf(Z.inputSource);if(et===-1)return;let Mt=_[et];Mt!==void 0&&(Mt.update(Z.inputSource,Z.frame,l||o),Mt.dispatchEvent({type:Z.type,data:Z.inputSource}))}function U(){i.removeEventListener("select",C),i.removeEventListener("selectstart",C),i.removeEventListener("selectend",C),i.removeEventListener("squeeze",C),i.removeEventListener("squeezestart",C),i.removeEventListener("squeezeend",C),i.removeEventListener("end",U),i.removeEventListener("inputsourceschange",K);for(let Z=0;Z<_.length;Z++){let et=v[Z];et!==null&&(v[Z]=null,_[Z].disconnect(et))}b=null,I=null,y.reset(),t.setRenderTarget(g),f=null,d=null,u=null,i=null,x=null,Bt.stop(),n.isPresenting=!1,t.setPixelRatio(M),t.setSize(k.width,k.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(Z){if(i=Z,i!==null){if(g=t.getRenderTarget(),i.addEventListener("select",C),i.addEventListener("selectstart",C),i.addEventListener("selectend",C),i.addEventListener("squeeze",C),i.addEventListener("squeezestart",C),i.addEventListener("squeezeend",C),i.addEventListener("end",U),i.addEventListener("inputsourceschange",K),m.xrCompatible!==!0&&await e.makeXRCompatible(),M=t.getPixelRatio(),t.getSize(k),i.renderState.layers===void 0){let et={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,et),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new si(f.framebufferWidth,f.framebufferHeight,{format:wn,type:ni,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let et=null,Mt=null,ut=null;m.depth&&(ut=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,et=m.stencil?Vs:Ds,Mt=m.stencil?Hs:Ji);let Dt={colorFormat:e.RGBA8,depthFormat:ut,scaleFactor:r};u=new XRWebGLBinding(i,e),d=u.createProjectionLayer(Dt),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),x=new si(d.textureWidth,d.textureHeight,{format:wn,type:ni,depthTexture:new ma(d.textureWidth,d.textureHeight,Mt,void 0,void 0,void 0,void 0,void 0,void 0,et),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await i.requestReferenceSpace(a),Bt.setContext(i),Bt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function K(Z){for(let et=0;et<Z.removed.length;et++){let Mt=Z.removed[et],ut=v.indexOf(Mt);ut>=0&&(v[ut]=null,_[ut].disconnect(Mt))}for(let et=0;et<Z.added.length;et++){let Mt=Z.added[et],ut=v.indexOf(Mt);if(ut===-1){for(let Pt=0;Pt<_.length;Pt++)if(Pt>=v.length){v.push(Mt),ut=Pt;break}else if(v[Pt]===null){v[Pt]=Mt,ut=Pt;break}if(ut===-1)break}let Dt=_[ut];Dt&&Dt.connect(Mt)}}let B=new S,Q=new S;function G(Z,et,Mt){B.setFromMatrixPosition(et.matrixWorld),Q.setFromMatrixPosition(Mt.matrixWorld);let ut=B.distanceTo(Q),Dt=et.projectionMatrix.elements,Pt=Mt.projectionMatrix.elements,Ht=Dt[14]/(Dt[10]-1),Zt=Dt[14]/(Dt[10]+1),Wt=(Dt[9]+1)/Dt[5],L=(Dt[9]-1)/Dt[5],Ye=(Dt[8]-1)/Dt[0],qt=(Pt[8]+1)/Pt[0],W=Ht*Ye,st=Ht*qt,$=ut/(-Ye+qt),ft=$*-Ye;if(et.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(ft),Z.translateZ($),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Dt[10]===-1)Z.projectionMatrix.copy(et.projectionMatrix),Z.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{let z=Ht+$,A=Zt+$,F=W-ft,j=st+(ut-ft),q=Wt*Zt/A*z,Y=L*Zt/A*z;Z.projectionMatrix.makePerspective(F,j,q,Y,z,A),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ct(Z,et){et===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(et.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(i===null)return;let et=Z.near,Mt=Z.far;y.texture!==null&&(y.depthNear>0&&(et=y.depthNear),y.depthFar>0&&(Mt=y.depthFar)),w.near=R.near=T.near=et,w.far=R.far=T.far=Mt,(b!==w.near||I!==w.far)&&(i.updateRenderState({depthNear:w.near,depthFar:w.far}),b=w.near,I=w.far);let ut=Z.parent,Dt=w.cameras;ct(w,ut);for(let Pt=0;Pt<Dt.length;Pt++)ct(Dt[Pt],ut);Dt.length===2?G(w,T,R):w.projectionMatrix.copy(T.projectionMatrix),at(Z,w,ut)};function at(Z,et,Mt){Mt===null?Z.matrix.copy(et.matrixWorld):(Z.matrix.copy(Mt.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(et.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(et.projectionMatrix),Z.projectionMatrixInverse.copy(et.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Xs*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return w},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(Z){c=Z,d!==null&&(d.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(w)};let gt=null;function jt(Z,et){if(h=et.getViewerPose(l||o),p=et,h!==null){let Mt=h.views;f!==null&&(t.setRenderTargetFramebuffer(x,f.framebuffer),t.setRenderTarget(x));let ut=!1;Mt.length!==w.cameras.length&&(w.cameras.length=0,ut=!0);for(let Pt=0;Pt<Mt.length;Pt++){let Ht=Mt[Pt],Zt=null;if(f!==null)Zt=f.getViewport(Ht);else{let L=u.getViewSubImage(d,Ht);Zt=L.viewport,Pt===0&&(t.setRenderTargetTextures(x,L.colorTexture,d.ignoreDepthValues?void 0:L.depthStencilTexture),t.setRenderTarget(x))}let Wt=P[Pt];Wt===void 0&&(Wt=new Ve,Wt.layers.enable(Pt),Wt.viewport=new $t,P[Pt]=Wt),Wt.matrix.fromArray(Ht.transform.matrix),Wt.matrix.decompose(Wt.position,Wt.quaternion,Wt.scale),Wt.projectionMatrix.fromArray(Ht.projectionMatrix),Wt.projectionMatrixInverse.copy(Wt.projectionMatrix).invert(),Wt.viewport.set(Zt.x,Zt.y,Zt.width,Zt.height),Pt===0&&(w.matrix.copy(Wt.matrix),w.matrix.decompose(w.position,w.quaternion,w.scale)),ut===!0&&w.cameras.push(Wt)}let Dt=i.enabledFeatures;if(Dt&&Dt.includes("depth-sensing")){let Pt=u.getDepthInformation(Mt[0]);Pt&&Pt.isValid&&Pt.texture&&y.init(t,Pt,i.renderState)}}for(let Mt=0;Mt<_.length;Mt++){let ut=v[Mt],Dt=_[Mt];ut!==null&&Dt!==void 0&&Dt.update(ut,et,l||o)}gt&&gt(Z,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),p=null}let Bt=new sp;Bt.setAnimationLoop(jt),this.setAnimationLoop=function(Z){gt=Z},this.dispose=function(){}}},ji=new dn,Sw=new Et;function Aw(s,t){function e(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,ip(s)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function i(m,g,x,_,v){g.isMeshBasicMaterial||g.isMeshLambertMaterial?r(m,g):g.isMeshToonMaterial?(r(m,g),u(m,g)):g.isMeshPhongMaterial?(r(m,g),h(m,g)):g.isMeshStandardMaterial?(r(m,g),d(m,g),g.isMeshPhysicalMaterial&&f(m,g,v)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),y(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(o(m,g),g.isLineDashedMaterial&&a(m,g)):g.isPointsMaterial?c(m,g,x,_):g.isSpriteMaterial?l(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,e(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===je&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,e(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===je&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,e(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,e(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);let x=t.get(g),_=x.envMap,v=x.envMapRotation;_&&(m.envMap.value=_,ji.copy(v),ji.x*=-1,ji.y*=-1,ji.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(ji.y*=-1,ji.z*=-1),m.envMapRotation.value.setFromMatrix4(Sw.makeRotationFromEuler(ji)),m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,m.aoMapTransform))}function o(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform))}function a(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function c(m,g,x,_){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*x,m.scale.value=_*.5,g.map&&(m.map.value=g.map,e(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function l(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function u(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,x){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===je&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function y(m,g){let x=t.get(g).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Tw(s,t,e,n){let i={},r={},o=[],a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,_){let v=_.program;n.uniformBlockBinding(x,v)}function l(x,_){let v=i[x.id];v===void 0&&(p(x),v=h(x),i[x.id]=v,x.addEventListener("dispose",m));let k=_.program;n.updateUBOMapping(x,k);let M=t.render.frame;r[x.id]!==M&&(d(x),r[x.id]=M)}function h(x){let _=u();x.__bindingPointIndex=_;let v=s.createBuffer(),k=x.__size,M=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,v),s.bufferData(s.UNIFORM_BUFFER,k,M),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,_,v),v}function u(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){let _=i[x.id],v=x.uniforms,k=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,_);for(let M=0,T=v.length;M<T;M++){let R=Array.isArray(v[M])?v[M]:[v[M]];for(let P=0,w=R.length;P<w;P++){let b=R[P];if(f(b,M,P,k)===!0){let I=b.__offset,C=Array.isArray(b.value)?b.value:[b.value],U=0;for(let K=0;K<C.length;K++){let B=C[K],Q=y(B);typeof B=="number"||typeof B=="boolean"?(b.__data[0]=B,s.bufferSubData(s.UNIFORM_BUFFER,I+U,b.__data)):B.isMatrix3?(b.__data[0]=B.elements[0],b.__data[1]=B.elements[1],b.__data[2]=B.elements[2],b.__data[3]=0,b.__data[4]=B.elements[3],b.__data[5]=B.elements[4],b.__data[6]=B.elements[5],b.__data[7]=0,b.__data[8]=B.elements[6],b.__data[9]=B.elements[7],b.__data[10]=B.elements[8],b.__data[11]=0):(B.toArray(b.__data,U),U+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,I,b.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(x,_,v,k){let M=x.value,T=_+"_"+v;if(k[T]===void 0)return typeof M=="number"||typeof M=="boolean"?k[T]=M:k[T]=M.clone(),!0;{let R=k[T];if(typeof M=="number"||typeof M=="boolean"){if(R!==M)return k[T]=M,!0}else if(R.equals(M)===!1)return R.copy(M),!0}return!1}function p(x){let _=x.uniforms,v=0,k=16;for(let T=0,R=_.length;T<R;T++){let P=Array.isArray(_[T])?_[T]:[_[T]];for(let w=0,b=P.length;w<b;w++){let I=P[w],C=Array.isArray(I.value)?I.value:[I.value];for(let U=0,K=C.length;U<K;U++){let B=C[U],Q=y(B),G=v%k,ct=G%Q.boundary,at=G+ct;v+=ct,at!==0&&k-at<Q.storage&&(v+=k-at),I.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=v,v+=Q.storage}}}let M=v%k;return M>0&&(v+=k-M),x.__size=v,x.__cache={},this}function y(x){let _={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(_.boundary=4,_.storage=4):x.isVector2?(_.boundary=8,_.storage=8):x.isVector3||x.isColor?(_.boundary=16,_.storage=12):x.isVector4?(_.boundary=16,_.storage=16):x.isMatrix3?(_.boundary=48,_.storage=48):x.isMatrix4?(_.boundary=64,_.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),_}function m(x){let _=x.target;_.removeEventListener("dispose",m);let v=o.indexOf(_.__bindingPointIndex);o.splice(v,1),s.deleteBuffer(i[_.id]),delete i[_.id],delete r[_.id]}function g(){for(let x in i)s.deleteBuffer(i[x]);o=[],i={},r={}}return{bind:c,update:l,dispose:g}}var ga=class{constructor(t={}){let{canvas:e=R0(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;let f=new Uint32Array(4),p=new Int32Array(4),y=null,m=null,g=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Vt,this.toneMapping=zi,this.toneMappingExposure=1;let _=this,v=!1,k=0,M=0,T=null,R=-1,P=null,w=new $t,b=new $t,I=null,C=new tt(0),U=0,K=e.width,B=e.height,Q=1,G=null,ct=null,at=new $t(0,0,K,B),gt=new $t(0,0,K,B),jt=!1,Bt=new Hr,Z=!1,et=!1,Mt=new Et,ut=new Et,Dt=new S,Pt=new $t,Ht={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Zt=!1;function Wt(){return T===null?Q:1}let L=n;function Ye(E,N){return e.getContext(E,N)}try{let E={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ih}`),e.addEventListener("webglcontextlost",J,!1),e.addEventListener("webglcontextrestored",pt,!1),e.addEventListener("webglcontextcreationerror",_t,!1),L===null){let N="webgl2";if(L=Ye(N,E),L===null)throw Ye(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let qt,W,st,$,ft,z,A,F,j,q,Y,Tt,ht,dt,Xt,nt,wt,kt,Ct,xt,Yt,Nt,ue,D;function yt(){qt=new V_(L),qt.init(),Nt=new ww(L,qt),W=new N_(L,qt,t,Nt),st=new yw(L),W.reverseDepthBuffer&&st.buffers.depth.setReversed(!0),$=new X_(L),ft=new sw,z=new xw(L,qt,st,ft,W,Nt,$),A=new O_(_),F=new H_(_),j=new J0(L),ue=new L_(L,j),q=new G_(L,j,$,ue),Y=new j_(L,q,j,$),Ct=new K_(L,W,z),nt=new U_(ft),Tt=new iw(_,A,F,qt,W,ue,nt),ht=new Aw(_,ft),dt=new ow,Xt=new dw(qt),kt=new I_(_,A,F,st,Y,d,c),wt=new mw(_,Y,W),D=new Tw(L,$,W,st),xt=new D_(L,qt,$),Yt=new W_(L,qt,$),$.programs=Tt.programs,_.capabilities=W,_.extensions=qt,_.properties=ft,_.renderLists=dt,_.shadowMap=wt,_.state=st,_.info=$}yt();let X=new lh(_,L);this.xr=X,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let E=qt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=qt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return Q},this.setPixelRatio=function(E){E!==void 0&&(Q=E,this.setSize(K,B,!1))},this.getSize=function(E){return E.set(K,B)},this.setSize=function(E,N,H=!0){if(X.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}K=E,B=N,e.width=Math.floor(E*Q),e.height=Math.floor(N*Q),H===!0&&(e.style.width=E+"px",e.style.height=N+"px"),this.setViewport(0,0,E,N)},this.getDrawingBufferSize=function(E){return E.set(K*Q,B*Q).floor()},this.setDrawingBufferSize=function(E,N,H){K=E,B=N,Q=H,e.width=Math.floor(E*H),e.height=Math.floor(N*H),this.setViewport(0,0,E,N)},this.getCurrentViewport=function(E){return E.copy(w)},this.getViewport=function(E){return E.copy(at)},this.setViewport=function(E,N,H,V){E.isVector4?at.set(E.x,E.y,E.z,E.w):at.set(E,N,H,V),st.viewport(w.copy(at).multiplyScalar(Q).round())},this.getScissor=function(E){return E.copy(gt)},this.setScissor=function(E,N,H,V){E.isVector4?gt.set(E.x,E.y,E.z,E.w):gt.set(E,N,H,V),st.scissor(b.copy(gt).multiplyScalar(Q).round())},this.getScissorTest=function(){return jt},this.setScissorTest=function(E){st.setScissorTest(jt=E)},this.setOpaqueSort=function(E){G=E},this.setTransparentSort=function(E){ct=E},this.getClearColor=function(E){return E.copy(kt.getClearColor())},this.setClearColor=function(){kt.setClearColor.apply(kt,arguments)},this.getClearAlpha=function(){return kt.getClearAlpha()},this.setClearAlpha=function(){kt.setClearAlpha.apply(kt,arguments)},this.clear=function(E=!0,N=!0,H=!0){let V=0;if(E){let O=!1;if(T!==null){let rt=T.texture.format;O=rt===Wh||rt===Gh||rt===Vh}if(O){let rt=T.texture.type,mt=rt===ni||rt===Ji||rt===Or||rt===Hs||rt===Fh||rt===Bh,bt=kt.getClearColor(),St=kt.getClearAlpha(),It=bt.r,Lt=bt.g,zt=bt.b;mt?(f[0]=It,f[1]=Lt,f[2]=zt,f[3]=St,L.clearBufferuiv(L.COLOR,0,f)):(p[0]=It,p[1]=Lt,p[2]=zt,p[3]=St,L.clearBufferiv(L.COLOR,0,p))}else V|=L.COLOR_BUFFER_BIT}N&&(V|=L.DEPTH_BUFFER_BIT,L.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),H&&(V|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",J,!1),e.removeEventListener("webglcontextrestored",pt,!1),e.removeEventListener("webglcontextcreationerror",_t,!1),dt.dispose(),Xt.dispose(),ft.dispose(),A.dispose(),F.dispose(),Y.dispose(),ue.dispose(),D.dispose(),Tt.dispose(),X.dispose(),X.removeEventListener("sessionstart",hd),X.removeEventListener("sessionend",ud),Hi.stop()};function J(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),v=!0}function pt(){console.log("THREE.WebGLRenderer: Context Restored."),v=!1;let E=$.autoReset,N=wt.enabled,H=wt.autoUpdate,V=wt.needsUpdate,O=wt.type;yt(),$.autoReset=E,wt.enabled=N,wt.autoUpdate=H,wt.needsUpdate=V,wt.type=O}function _t(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Jt(E){let N=E.target;N.removeEventListener("dispose",Jt),Ae(N)}function Ae(E){nn(E),ft.remove(E)}function nn(E){let N=ft.get(E).programs;N!==void 0&&(N.forEach(function(H){Tt.releaseProgram(H)}),E.isShaderMaterial&&Tt.releaseShaderCache(E))}this.renderBufferDirect=function(E,N,H,V,O,rt){N===null&&(N=Ht);let mt=O.isMesh&&O.matrixWorld.determinant()<0,bt=xm(E,N,H,V,O);st.setMaterial(V,mt);let St=H.index,It=1;if(V.wireframe===!0){if(St=q.getWireframeAttribute(H),St===void 0)return;It=2}let Lt=H.drawRange,zt=H.attributes.position,oe=Lt.start*It,ge=(Lt.start+Lt.count)*It;rt!==null&&(oe=Math.max(oe,rt.start*It),ge=Math.min(ge,(rt.start+rt.count)*It)),St!==null?(oe=Math.max(oe,0),ge=Math.min(ge,St.count)):zt!=null&&(oe=Math.max(oe,0),ge=Math.min(ge,zt.count));let we=ge-oe;if(we<0||we===1/0)return;ue.setup(O,V,bt,H,St);let an,se=xt;if(St!==null&&(an=j.get(St),se=Yt,se.setIndex(an)),O.isMesh)V.wireframe===!0?(st.setLineWidth(V.wireframeLinewidth*Wt()),se.setMode(L.LINES)):se.setMode(L.TRIANGLES);else if(O.isLine){let Rt=V.linewidth;Rt===void 0&&(Rt=1),st.setLineWidth(Rt*Wt()),O.isLineSegments?se.setMode(L.LINES):O.isLineLoop?se.setMode(L.LINE_LOOP):se.setMode(L.LINE_STRIP)}else O.isPoints?se.setMode(L.POINTS):O.isSprite&&se.setMode(L.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)se.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(qt.get("WEBGL_multi_draw"))se.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let Rt=O._multiDrawStarts,He=O._multiDrawCounts,re=O._multiDrawCount,Rn=St?j.get(St).bytesPerElement:1,ls=ft.get(V).currentProgram.getUniforms();for(let cn=0;cn<re;cn++)ls.setValue(L,"_gl_DrawID",cn),se.render(Rt[cn]/Rn,He[cn])}else if(O.isInstancedMesh)se.renderInstances(oe,we,O.count);else if(H.isInstancedBufferGeometry){let Rt=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,He=Math.min(H.instanceCount,Rt);se.renderInstances(oe,we,He)}else se.render(oe,we)};function ee(E,N,H){E.transparent===!0&&E.side===de&&E.forceSinglePass===!1?(E.side=je,E.needsUpdate=!0,_o(E,N,H),E.side=Fn,E.needsUpdate=!0,_o(E,N,H),E.side=de):_o(E,N,H)}this.compile=function(E,N,H=null){H===null&&(H=E),m=Xt.get(H),m.init(N),x.push(m),H.traverseVisible(function(O){O.isLight&&O.layers.test(N.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),E!==H&&E.traverseVisible(function(O){O.isLight&&O.layers.test(N.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),m.setupLights();let V=new Set;return E.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let rt=O.material;if(rt)if(Array.isArray(rt))for(let mt=0;mt<rt.length;mt++){let bt=rt[mt];ee(bt,H,O),V.add(bt)}else ee(rt,H,O),V.add(rt)}),x.pop(),m=null,V},this.compileAsync=function(E,N,H=null){let V=this.compile(E,N,H);return new Promise(O=>{function rt(){if(V.forEach(function(mt){ft.get(mt).currentProgram.isReady()&&V.delete(mt)}),V.size===0){O(E);return}setTimeout(rt,10)}qt.get("KHR_parallel_shader_compile")!==null?rt():setTimeout(rt,10)})};let sn=null;function Xn(E){sn&&sn(E)}function hd(){Hi.stop()}function ud(){Hi.start()}let Hi=new sp;Hi.setAnimationLoop(Xn),typeof self<"u"&&Hi.setContext(self),this.setAnimationLoop=function(E){sn=E,X.setAnimationLoop(E),E===null?Hi.stop():Hi.start()},X.addEventListener("sessionstart",hd),X.addEventListener("sessionend",ud),this.render=function(E,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(v===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),X.enabled===!0&&X.isPresenting===!0&&(X.cameraAutoUpdate===!0&&X.updateCamera(N),N=X.getCamera()),E.isScene===!0&&E.onBeforeRender(_,E,N,T),m=Xt.get(E,x.length),m.init(N),x.push(m),ut.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),Bt.setFromProjectionMatrix(ut),et=this.localClippingEnabled,Z=nt.init(this.clippingPlanes,et),y=dt.get(E,g.length),y.init(),g.push(y),X.enabled===!0&&X.isPresenting===!0){let rt=_.xr.getDepthSensingMesh();rt!==null&&Sc(rt,N,-1/0,_.sortObjects)}Sc(E,N,0,_.sortObjects),y.finish(),_.sortObjects===!0&&y.sort(G,ct),Zt=X.enabled===!1||X.isPresenting===!1||X.hasDepthSensing()===!1,Zt&&kt.addToRenderList(y,E),this.info.render.frame++,Z===!0&&nt.beginShadows();let H=m.state.shadowsArray;wt.render(H,E,N),Z===!0&&nt.endShadows(),this.info.autoReset===!0&&this.info.reset();let V=y.opaque,O=y.transmissive;if(m.setupLights(),N.isArrayCamera){let rt=N.cameras;if(O.length>0)for(let mt=0,bt=rt.length;mt<bt;mt++){let St=rt[mt];fd(V,O,E,St)}Zt&&kt.render(E);for(let mt=0,bt=rt.length;mt<bt;mt++){let St=rt[mt];dd(y,E,St,St.viewport)}}else O.length>0&&fd(V,O,E,N),Zt&&kt.render(E),dd(y,E,N);T!==null&&(z.updateMultisampleRenderTarget(T),z.updateRenderTargetMipmap(T)),E.isScene===!0&&E.onAfterRender(_,E,N),ue.resetDefaultState(),R=-1,P=null,x.pop(),x.length>0?(m=x[x.length-1],Z===!0&&nt.setGlobalState(_.clippingPlanes,m.state.camera)):m=null,g.pop(),g.length>0?y=g[g.length-1]:y=null};function Sc(E,N,H,V){if(E.visible===!1)return;if(E.layers.test(N.layers)){if(E.isGroup)H=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(N);else if(E.isLight)m.pushLight(E),E.castShadow&&m.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Bt.intersectsSprite(E)){V&&Pt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(ut);let mt=Y.update(E),bt=E.material;bt.visible&&y.push(E,mt,bt,H,Pt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Bt.intersectsObject(E))){let mt=Y.update(E),bt=E.material;if(V&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Pt.copy(E.boundingSphere.center)):(mt.boundingSphere===null&&mt.computeBoundingSphere(),Pt.copy(mt.boundingSphere.center)),Pt.applyMatrix4(E.matrixWorld).applyMatrix4(ut)),Array.isArray(bt)){let St=mt.groups;for(let It=0,Lt=St.length;It<Lt;It++){let zt=St[It],oe=bt[zt.materialIndex];oe&&oe.visible&&y.push(E,mt,oe,H,Pt.z,zt)}}else bt.visible&&y.push(E,mt,bt,H,Pt.z,null)}}let rt=E.children;for(let mt=0,bt=rt.length;mt<bt;mt++)Sc(rt[mt],N,H,V)}function dd(E,N,H,V){let O=E.opaque,rt=E.transmissive,mt=E.transparent;m.setupLightsView(H),Z===!0&&nt.setGlobalState(_.clippingPlanes,H),V&&st.viewport(w.copy(V)),O.length>0&&yo(O,N,H),rt.length>0&&yo(rt,N,H),mt.length>0&&yo(mt,N,H),st.buffers.depth.setTest(!0),st.buffers.depth.setMask(!0),st.buffers.color.setMask(!0),st.setPolygonOffset(!1)}function fd(E,N,H,V){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[V.id]===void 0&&(m.state.transmissionRenderTarget[V.id]=new si(1,1,{generateMipmaps:!0,type:qt.has("EXT_color_buffer_half_float")||qt.has("EXT_color_buffer_float")?Jr:ni,minFilter:On,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qt.workingColorSpace}));let rt=m.state.transmissionRenderTarget[V.id],mt=V.viewport||w;rt.setSize(mt.z,mt.w);let bt=_.getRenderTarget();_.setRenderTarget(rt),_.getClearColor(C),U=_.getClearAlpha(),U<1&&_.setClearColor(16777215,.5),_.clear(),Zt&&kt.render(H);let St=_.toneMapping;_.toneMapping=zi;let It=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),m.setupLightsView(V),Z===!0&&nt.setGlobalState(_.clippingPlanes,V),yo(E,H,V),z.updateMultisampleRenderTarget(rt),z.updateRenderTargetMipmap(rt),qt.has("WEBGL_multisampled_render_to_texture")===!1){let Lt=!1;for(let zt=0,oe=N.length;zt<oe;zt++){let ge=N[zt],we=ge.object,an=ge.geometry,se=ge.material,Rt=ge.group;if(se.side===de&&we.layers.test(V.layers)){let He=se.side;se.side=je,se.needsUpdate=!0,pd(we,H,V,an,se,Rt),se.side=He,se.needsUpdate=!0,Lt=!0}}Lt===!0&&(z.updateMultisampleRenderTarget(rt),z.updateRenderTargetMipmap(rt))}_.setRenderTarget(bt),_.setClearColor(C,U),It!==void 0&&(V.viewport=It),_.toneMapping=St}function yo(E,N,H){let V=N.isScene===!0?N.overrideMaterial:null;for(let O=0,rt=E.length;O<rt;O++){let mt=E[O],bt=mt.object,St=mt.geometry,It=V===null?mt.material:V,Lt=mt.group;bt.layers.test(H.layers)&&pd(bt,N,H,St,It,Lt)}}function pd(E,N,H,V,O,rt){E.onBeforeRender(_,N,H,V,O,rt),E.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),O.onBeforeRender(_,N,H,V,E,rt),O.transparent===!0&&O.side===de&&O.forceSinglePass===!1?(O.side=je,O.needsUpdate=!0,_.renderBufferDirect(H,N,V,O,E,rt),O.side=Fn,O.needsUpdate=!0,_.renderBufferDirect(H,N,V,O,E,rt),O.side=de):_.renderBufferDirect(H,N,V,O,E,rt),E.onAfterRender(_,N,H,V,O,rt)}function _o(E,N,H){N.isScene!==!0&&(N=Ht);let V=ft.get(E),O=m.state.lights,rt=m.state.shadowsArray,mt=O.state.version,bt=Tt.getParameters(E,O.state,rt,N,H),St=Tt.getProgramCacheKey(bt),It=V.programs;V.environment=E.isMeshStandardMaterial?N.environment:null,V.fog=N.fog,V.envMap=(E.isMeshStandardMaterial?F:A).get(E.envMap||V.environment),V.envMapRotation=V.environment!==null&&E.envMap===null?N.environmentRotation:E.envMapRotation,It===void 0&&(E.addEventListener("dispose",Jt),It=new Map,V.programs=It);let Lt=It.get(St);if(Lt!==void 0){if(V.currentProgram===Lt&&V.lightsStateVersion===mt)return gd(E,bt),Lt}else bt.uniforms=Tt.getUniforms(E),E.onBeforeCompile(bt,_),Lt=Tt.acquireProgram(bt,St),It.set(St,Lt),V.uniforms=bt.uniforms;let zt=V.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(zt.clippingPlanes=nt.uniform),gd(E,bt),V.needsLights=vm(E),V.lightsStateVersion=mt,V.needsLights&&(zt.ambientLightColor.value=O.state.ambient,zt.lightProbe.value=O.state.probe,zt.directionalLights.value=O.state.directional,zt.directionalLightShadows.value=O.state.directionalShadow,zt.spotLights.value=O.state.spot,zt.spotLightShadows.value=O.state.spotShadow,zt.rectAreaLights.value=O.state.rectArea,zt.ltc_1.value=O.state.rectAreaLTC1,zt.ltc_2.value=O.state.rectAreaLTC2,zt.pointLights.value=O.state.point,zt.pointLightShadows.value=O.state.pointShadow,zt.hemisphereLights.value=O.state.hemi,zt.directionalShadowMap.value=O.state.directionalShadowMap,zt.directionalShadowMatrix.value=O.state.directionalShadowMatrix,zt.spotShadowMap.value=O.state.spotShadowMap,zt.spotLightMatrix.value=O.state.spotLightMatrix,zt.spotLightMap.value=O.state.spotLightMap,zt.pointShadowMap.value=O.state.pointShadowMap,zt.pointShadowMatrix.value=O.state.pointShadowMatrix),V.currentProgram=Lt,V.uniformsList=null,Lt}function md(E){if(E.uniformsList===null){let N=E.currentProgram.getUniforms();E.uniformsList=Us.seqWithValue(N.seq,E.uniforms)}return E.uniformsList}function gd(E,N){let H=ft.get(E);H.outputColorSpace=N.outputColorSpace,H.batching=N.batching,H.batchingColor=N.batchingColor,H.instancing=N.instancing,H.instancingColor=N.instancingColor,H.instancingMorph=N.instancingMorph,H.skinning=N.skinning,H.morphTargets=N.morphTargets,H.morphNormals=N.morphNormals,H.morphColors=N.morphColors,H.morphTargetsCount=N.morphTargetsCount,H.numClippingPlanes=N.numClippingPlanes,H.numIntersection=N.numClipIntersection,H.vertexAlphas=N.vertexAlphas,H.vertexTangents=N.vertexTangents,H.toneMapping=N.toneMapping}function xm(E,N,H,V,O){N.isScene!==!0&&(N=Ht),z.resetTextureUnits();let rt=N.fog,mt=V.isMeshStandardMaterial?N.environment:null,bt=T===null?_.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Be,St=(V.isMeshStandardMaterial?F:A).get(V.envMap||mt),It=V.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Lt=!!H.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),zt=!!H.morphAttributes.position,oe=!!H.morphAttributes.normal,ge=!!H.morphAttributes.color,we=zi;V.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(we=_.toneMapping);let an=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,se=an!==void 0?an.length:0,Rt=ft.get(V),He=m.state.lights;if(Z===!0&&(et===!0||E!==P)){let _n=E===P&&V.id===R;nt.setState(V,E,_n)}let re=!1;V.version===Rt.__version?(Rt.needsLights&&Rt.lightsStateVersion!==He.state.version||Rt.outputColorSpace!==bt||O.isBatchedMesh&&Rt.batching===!1||!O.isBatchedMesh&&Rt.batching===!0||O.isBatchedMesh&&Rt.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Rt.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Rt.instancing===!1||!O.isInstancedMesh&&Rt.instancing===!0||O.isSkinnedMesh&&Rt.skinning===!1||!O.isSkinnedMesh&&Rt.skinning===!0||O.isInstancedMesh&&Rt.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Rt.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Rt.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Rt.instancingMorph===!1&&O.morphTexture!==null||Rt.envMap!==St||V.fog===!0&&Rt.fog!==rt||Rt.numClippingPlanes!==void 0&&(Rt.numClippingPlanes!==nt.numPlanes||Rt.numIntersection!==nt.numIntersection)||Rt.vertexAlphas!==It||Rt.vertexTangents!==Lt||Rt.morphTargets!==zt||Rt.morphNormals!==oe||Rt.morphColors!==ge||Rt.toneMapping!==we||Rt.morphTargetsCount!==se)&&(re=!0):(re=!0,Rt.__version=V.version);let Rn=Rt.currentProgram;re===!0&&(Rn=_o(V,N,O));let ls=!1,cn=!1,Ac=!1,be=Rn.getUniforms(),yi=Rt.uniforms;if(st.useProgram(Rn.program)&&(ls=!0,cn=!0,Ac=!0),V.id!==R&&(R=V.id,cn=!0),ls||P!==E){W.reverseDepthBuffer?(Mt.copy(E.projectionMatrix),C0(Mt),P0(Mt),be.setValue(L,"projectionMatrix",Mt)):be.setValue(L,"projectionMatrix",E.projectionMatrix),be.setValue(L,"viewMatrix",E.matrixWorldInverse);let _n=be.map.cameraPosition;_n!==void 0&&_n.setValue(L,Dt.setFromMatrixPosition(E.matrixWorld)),W.logarithmicDepthBuffer&&be.setValue(L,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&be.setValue(L,"isOrthographic",E.isOrthographicCamera===!0),P!==E&&(P=E,cn=!0,Ac=!0)}if(O.isSkinnedMesh){be.setOptional(L,O,"bindMatrix"),be.setOptional(L,O,"bindMatrixInverse");let _n=O.skeleton;_n&&(_n.boneTexture===null&&_n.computeBoneTexture(),be.setValue(L,"boneTexture",_n.boneTexture,z))}O.isBatchedMesh&&(be.setOptional(L,O,"batchingTexture"),be.setValue(L,"batchingTexture",O._matricesTexture,z),be.setOptional(L,O,"batchingIdTexture"),be.setValue(L,"batchingIdTexture",O._indirectTexture,z),be.setOptional(L,O,"batchingColorTexture"),O._colorsTexture!==null&&be.setValue(L,"batchingColorTexture",O._colorsTexture,z));let Tc=H.morphAttributes;if((Tc.position!==void 0||Tc.normal!==void 0||Tc.color!==void 0)&&Ct.update(O,H,Rn),(cn||Rt.receiveShadow!==O.receiveShadow)&&(Rt.receiveShadow=O.receiveShadow,be.setValue(L,"receiveShadow",O.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(yi.envMap.value=St,yi.flipEnvMap.value=St.isCubeTexture&&St.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&N.environment!==null&&(yi.envMapIntensity.value=N.environmentIntensity),cn&&(be.setValue(L,"toneMappingExposure",_.toneMappingExposure),Rt.needsLights&&wm(yi,Ac),rt&&V.fog===!0&&ht.refreshFogUniforms(yi,rt),ht.refreshMaterialUniforms(yi,V,Q,B,m.state.transmissionRenderTarget[E.id]),Us.upload(L,md(Rt),yi,z)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Us.upload(L,md(Rt),yi,z),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&be.setValue(L,"center",O.center),be.setValue(L,"modelViewMatrix",O.modelViewMatrix),be.setValue(L,"normalMatrix",O.normalMatrix),be.setValue(L,"modelMatrix",O.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){let _n=V.uniformsGroups;for(let Ec=0,Mm=_n.length;Ec<Mm;Ec++){let yd=_n[Ec];D.update(yd,Rn),D.bind(yd,Rn)}}return Rn}function wm(E,N){E.ambientLightColor.needsUpdate=N,E.lightProbe.needsUpdate=N,E.directionalLights.needsUpdate=N,E.directionalLightShadows.needsUpdate=N,E.pointLights.needsUpdate=N,E.pointLightShadows.needsUpdate=N,E.spotLights.needsUpdate=N,E.spotLightShadows.needsUpdate=N,E.rectAreaLights.needsUpdate=N,E.hemisphereLights.needsUpdate=N}function vm(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return k},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(E,N,H){ft.get(E.texture).__webglTexture=N,ft.get(E.depthTexture).__webglTexture=H;let V=ft.get(E);V.__hasExternalTextures=!0,V.__autoAllocateDepthBuffer=H===void 0,V.__autoAllocateDepthBuffer||qt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,N){let H=ft.get(E);H.__webglFramebuffer=N,H.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(E,N=0,H=0){T=E,k=N,M=H;let V=!0,O=null,rt=!1,mt=!1;if(E){let St=ft.get(E);if(St.__useDefaultFramebuffer!==void 0)st.bindFramebuffer(L.FRAMEBUFFER,null),V=!1;else if(St.__webglFramebuffer===void 0)z.setupRenderTarget(E);else if(St.__hasExternalTextures)z.rebindTextures(E,ft.get(E.texture).__webglTexture,ft.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let zt=E.depthTexture;if(St.__boundDepthTexture!==zt){if(zt!==null&&ft.has(zt)&&(E.width!==zt.image.width||E.height!==zt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");z.setupDepthRenderbuffer(E)}}let It=E.texture;(It.isData3DTexture||It.isDataArrayTexture||It.isCompressedArrayTexture)&&(mt=!0);let Lt=ft.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Lt[N])?O=Lt[N][H]:O=Lt[N],rt=!0):E.samples>0&&z.useMultisampledRTT(E)===!1?O=ft.get(E).__webglMultisampledFramebuffer:Array.isArray(Lt)?O=Lt[H]:O=Lt,w.copy(E.viewport),b.copy(E.scissor),I=E.scissorTest}else w.copy(at).multiplyScalar(Q).floor(),b.copy(gt).multiplyScalar(Q).floor(),I=jt;if(st.bindFramebuffer(L.FRAMEBUFFER,O)&&V&&st.drawBuffers(E,O),st.viewport(w),st.scissor(b),st.setScissorTest(I),rt){let St=ft.get(E.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+N,St.__webglTexture,H)}else if(mt){let St=ft.get(E.texture),It=N||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,St.__webglTexture,H||0,It)}R=-1},this.readRenderTargetPixels=function(E,N,H,V,O,rt,mt){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let bt=ft.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&mt!==void 0&&(bt=bt[mt]),bt){st.bindFramebuffer(L.FRAMEBUFFER,bt);try{let St=E.texture,It=St.format,Lt=St.type;if(!W.textureFormatReadable(It)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!W.textureTypeReadable(Lt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=E.width-V&&H>=0&&H<=E.height-O&&L.readPixels(N,H,V,O,Nt.convert(It),Nt.convert(Lt),rt)}finally{let St=T!==null?ft.get(T).__webglFramebuffer:null;st.bindFramebuffer(L.FRAMEBUFFER,St)}}},this.readRenderTargetPixelsAsync=async function(E,N,H,V,O,rt,mt){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let bt=ft.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&mt!==void 0&&(bt=bt[mt]),bt){let St=E.texture,It=St.format,Lt=St.type;if(!W.textureFormatReadable(It))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!W.textureTypeReadable(Lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(N>=0&&N<=E.width-V&&H>=0&&H<=E.height-O){st.bindFramebuffer(L.FRAMEBUFFER,bt);let zt=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,zt),L.bufferData(L.PIXEL_PACK_BUFFER,rt.byteLength,L.STREAM_READ),L.readPixels(N,H,V,O,Nt.convert(It),Nt.convert(Lt),0);let oe=T!==null?ft.get(T).__webglFramebuffer:null;st.bindFramebuffer(L.FRAMEBUFFER,oe);let ge=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await k0(L,ge,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,zt),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,rt),L.deleteBuffer(zt),L.deleteSync(ge),rt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,N=null,H=0){E.isTexture!==!0&&(na("WebGLRenderer: copyFramebufferToTexture function signature has changed."),N=arguments[0]||null,E=arguments[1]);let V=Math.pow(2,-H),O=Math.floor(E.image.width*V),rt=Math.floor(E.image.height*V),mt=N!==null?N.x:0,bt=N!==null?N.y:0;z.setTexture2D(E,0),L.copyTexSubImage2D(L.TEXTURE_2D,H,0,0,mt,bt,O,rt),st.unbindTexture()},this.copyTextureToTexture=function(E,N,H=null,V=null,O=0){E.isTexture!==!0&&(na("WebGLRenderer: copyTextureToTexture function signature has changed."),V=arguments[0]||null,E=arguments[1],N=arguments[2],O=arguments[3]||0,H=null);let rt,mt,bt,St,It,Lt;H!==null?(rt=H.max.x-H.min.x,mt=H.max.y-H.min.y,bt=H.min.x,St=H.min.y):(rt=E.image.width,mt=E.image.height,bt=0,St=0),V!==null?(It=V.x,Lt=V.y):(It=0,Lt=0);let zt=Nt.convert(N.format),oe=Nt.convert(N.type);z.setTexture2D(N,0),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,N.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,N.unpackAlignment);let ge=L.getParameter(L.UNPACK_ROW_LENGTH),we=L.getParameter(L.UNPACK_IMAGE_HEIGHT),an=L.getParameter(L.UNPACK_SKIP_PIXELS),se=L.getParameter(L.UNPACK_SKIP_ROWS),Rt=L.getParameter(L.UNPACK_SKIP_IMAGES),He=E.isCompressedTexture?E.mipmaps[O]:E.image;L.pixelStorei(L.UNPACK_ROW_LENGTH,He.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,He.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,bt),L.pixelStorei(L.UNPACK_SKIP_ROWS,St),E.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,O,It,Lt,rt,mt,zt,oe,He.data):E.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,O,It,Lt,He.width,He.height,zt,He.data):L.texSubImage2D(L.TEXTURE_2D,O,It,Lt,rt,mt,zt,oe,He),L.pixelStorei(L.UNPACK_ROW_LENGTH,ge),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,we),L.pixelStorei(L.UNPACK_SKIP_PIXELS,an),L.pixelStorei(L.UNPACK_SKIP_ROWS,se),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Rt),O===0&&N.generateMipmaps&&L.generateMipmap(L.TEXTURE_2D),st.unbindTexture()},this.copyTextureToTexture3D=function(E,N,H=null,V=null,O=0){E.isTexture!==!0&&(na("WebGLRenderer: copyTextureToTexture3D function signature has changed."),H=arguments[0]||null,V=arguments[1]||null,E=arguments[2],N=arguments[3],O=arguments[4]||0);let rt,mt,bt,St,It,Lt,zt,oe,ge,we=E.isCompressedTexture?E.mipmaps[O]:E.image;H!==null?(rt=H.max.x-H.min.x,mt=H.max.y-H.min.y,bt=H.max.z-H.min.z,St=H.min.x,It=H.min.y,Lt=H.min.z):(rt=we.width,mt=we.height,bt=we.depth,St=0,It=0,Lt=0),V!==null?(zt=V.x,oe=V.y,ge=V.z):(zt=0,oe=0,ge=0);let an=Nt.convert(N.format),se=Nt.convert(N.type),Rt;if(N.isData3DTexture)z.setTexture3D(N,0),Rt=L.TEXTURE_3D;else if(N.isDataArrayTexture||N.isCompressedArrayTexture)z.setTexture2DArray(N,0),Rt=L.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,N.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,N.unpackAlignment);let He=L.getParameter(L.UNPACK_ROW_LENGTH),re=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Rn=L.getParameter(L.UNPACK_SKIP_PIXELS),ls=L.getParameter(L.UNPACK_SKIP_ROWS),cn=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,we.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,we.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,St),L.pixelStorei(L.UNPACK_SKIP_ROWS,It),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Lt),E.isDataTexture||E.isData3DTexture?L.texSubImage3D(Rt,O,zt,oe,ge,rt,mt,bt,an,se,we.data):N.isCompressedArrayTexture?L.compressedTexSubImage3D(Rt,O,zt,oe,ge,rt,mt,bt,an,we.data):L.texSubImage3D(Rt,O,zt,oe,ge,rt,mt,bt,an,se,we),L.pixelStorei(L.UNPACK_ROW_LENGTH,He),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,re),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Rn),L.pixelStorei(L.UNPACK_SKIP_ROWS,ls),L.pixelStorei(L.UNPACK_SKIP_IMAGES,cn),O===0&&N.generateMipmaps&&L.generateMipmap(Rt),st.unbindTexture()},this.initRenderTarget=function(E){ft.get(E).__webglFramebuffer===void 0&&z.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?z.setTextureCube(E,0):E.isData3DTexture?z.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?z.setTexture2DArray(E,0):z.setTexture2D(E,0),st.unbindTexture()},this.resetState=function(){k=0,M=0,T=null,st.reset(),ue.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ei}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===qh?"display-p3":"srgb",e.unpackColorSpace=Qt.workingColorSpace===Ga?"display-p3":"srgb"}};var ya=class extends fe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new dn,this.environmentIntensity=1,this.environmentRotation=new dn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}},qs=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=jl,this.updateRanges=[],this.version=0,this.uuid=vn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,r=this.stride;i<r;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=vn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=vn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Ze=new S,ts=class s{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Ze.fromBufferAttribute(this,e),Ze.applyMatrix4(t),this.setXYZ(e,Ze.x,Ze.y,Ze.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ze.fromBufferAttribute(this,e),Ze.applyNormalMatrix(t),this.setXYZ(e,Ze.x,Ze.y,Ze.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ze.fromBufferAttribute(this,e),Ze.transformDirection(t),this.setXYZ(e,Ze.x,Ze.y,Ze.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=In(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ae(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ae(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ae(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ae(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ae(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=In(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=In(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=In(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=In(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ae(e,this.array),n=ae(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=ae(e,this.array),n=ae(n,this.array),i=ae(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ae(e,this.array),n=ae(n,this.array),i=ae(i,this.array),r=ae(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return new Ce(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new s(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Le=class extends Je{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new tt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Ss,vr=new S,As=new S,Ts=new S,Es=new ot,Mr=new ot,lp=new Et,Fo=new S,br=new S,Bo=new S,df=new ot,nl=new ot,ff=new ot,De=class extends fe{constructor(t=new Le){if(super(),this.isSprite=!0,this.type="Sprite",Ss===void 0){Ss=new Gt;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new qs(e,5);Ss.setIndex([0,1,2,0,2,3]),Ss.setAttribute("position",new ts(n,3,0,!1)),Ss.setAttribute("uv",new ts(n,2,3,!1))}this.geometry=Ss,this.material=t,this.center=new ot(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),As.setFromMatrixScale(this.matrixWorld),lp.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Ts.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&As.multiplyScalar(-Ts.z);let n=this.material.rotation,i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));let o=this.center;Ho(Fo.set(-.5,-.5,0),Ts,o,As,i,r),Ho(br.set(.5,-.5,0),Ts,o,As,i,r),Ho(Bo.set(.5,.5,0),Ts,o,As,i,r),df.set(0,0),nl.set(1,0),ff.set(1,1);let a=t.ray.intersectTriangle(Fo,br,Bo,!1,vr);if(a===null&&(Ho(br.set(-.5,.5,0),Ts,o,As,i,r),nl.set(0,1),a=t.ray.intersectTriangle(Fo,Bo,br,!1,vr),a===null))return;let c=t.ray.origin.distanceTo(vr);c<t.near||c>t.far||e.push({distance:c,point:vr.clone(),uv:Ai.getInterpolation(vr,Fo,br,Bo,df,nl,ff,new ot),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function Ho(s,t,e,n,i,r){Es.subVectors(s,e).addScalar(.5).multiply(n),i!==void 0?(Mr.x=r*Es.x-i*Es.y,Mr.y=i*Es.x+r*Es.y):Mr.copy(Es),s.copy(t),s.x+=Mr.x,s.y+=Mr.y,s.applyMatrix4(lp)}var pf=new S,mf=new $t,gf=new $t,Ew=new S,yf=new Et,Vo=new S,il=new un,_f=new Et,sl=new Qi,_a=class extends At{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=vd,this.bindMatrix=new Et,this.bindMatrixInverse=new Et,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let t=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ee),this.boundingBox.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Vo),this.boundingBox.expandByPoint(Vo)}computeBoundingSphere(){let t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new un),this.boundingSphere.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Vo),this.boundingSphere.expandByPoint(Vo)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),il.copy(this.boundingSphere),il.applyMatrix4(i),t.ray.intersectsSphere(il)!==!1&&(_f.copy(i).invert(),sl.copy(t.ray).applyMatrix4(_f),!(this.boundingBox!==null&&sl.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,sl)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let t=new $t,e=this.geometry.attributes.skinWeight;for(let n=0,i=e.count;n<i;n++){t.fromBufferAttribute(e,n);let r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===vd?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===t0?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){let n=this.skeleton,i=this.geometry;mf.fromBufferAttribute(i.attributes.skinIndex,t),gf.fromBufferAttribute(i.attributes.skinWeight,t),pf.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let r=0;r<4;r++){let o=gf.getComponent(r);if(o!==0){let a=mf.getComponent(r);yf.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),e.addScaledVector(Ew.copy(pf).applyMatrix4(yf),o)}}return e.applyMatrix4(this.bindMatrixInverse)}},Vr=class extends fe{constructor(){super(),this.isBone=!0,this.type="Bone"}},xa=class extends Fe{constructor(t=null,e=1,n=1,i,r,o,a,c,l=Ke,h=Ke,u,d){super(null,o,a,c,l,h,i,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},xf=new Et,zw=new Et,wa=class s{constructor(t=[],e=[]){this.uuid=vn(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Et)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){let n=new Et;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let t=this.bones,e=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,o=t.length;r<o;r++){let a=t[r]?t[r].matrixWorld:zw;xf.multiplyMatrices(a,e[r]),xf.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new s(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);let e=new Float32Array(t*t*4);e.set(this.boneMatrices);let n=new xa(e,t,t,wn,Ln);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){let i=this.bones[e];if(i.name===t)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,i=t.bones.length;n<i;n++){let r=t.bones[n],o=e[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new Vr),this.bones.push(o),this.boneInverses.push(new Et().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){let t={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;let e=this.bones,n=this.boneInverses;for(let i=0,r=e.length;i<r;i++){let o=e[i];t.bones.push(o.uuid);let a=n[i];t.boneInverses.push(a.toArray())}return t}},es=class extends Ce{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},zs=new Et,wf=new Et,Go=[],vf=new Ee,Rw=new Et,Sr=new At,Ar=new un,Ne=class extends At{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new es(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Rw)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ee),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,zs),vf.copy(t.boundingBox).applyMatrix4(zs),this.boundingBox.union(vf)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new un),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,zs),Ar.copy(t.boundingSphere).applyMatrix4(zs),this.boundingSphere.union(Ar)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(t,e){let n=this.matrixWorld,i=this.count;if(Sr.geometry=this.geometry,Sr.material=this.material,Sr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ar.copy(this.boundingSphere),Ar.applyMatrix4(n),t.ray.intersectsSphere(Ar)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,zs),wf.multiplyMatrices(n,zs),Sr.matrixWorld=wf,Sr.raycast(t,Go);for(let o=0,a=Go.length;o<a;o++){let c=Go[o];c.instanceId=r,c.object=this,e.push(c)}Go.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new es(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){let n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new xa(new Float32Array(i*this.count),i,this.count,Hh,Ln));let r=this.morphTexture.source.data.data,o=0;for(let l=0;l<n.length;l++)o+=n[l];let a=this.geometry.morphTargetsRelative?1:1-o,c=i*t;r[c]=a,r.set(n,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var Gr=class extends Je{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new tt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},va=new S,Ma=new S,Mf=new Et,Tr=new Qi,Wo=new un,rl=new S,bf=new S,Ys=class extends fe{constructor(t=new Gt,e=new Gr){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)va.fromBufferAttribute(e,i-1),Ma.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=va.distanceTo(Ma);t.setAttribute("lineDistance",new vt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Wo.copy(n.boundingSphere),Wo.applyMatrix4(i),Wo.radius+=r,t.ray.intersectsSphere(Wo)===!1)return;Mf.copy(i).invert(),Tr.copy(t.ray).applyMatrix4(Mf);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let y=f,m=p-1;y<m;y+=l){let g=h.getX(y),x=h.getX(y+1),_=Xo(this,t,Tr,c,g,x);_&&e.push(_)}if(this.isLineLoop){let y=h.getX(p-1),m=h.getX(f),g=Xo(this,t,Tr,c,y,m);g&&e.push(g)}}else{let f=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let y=f,m=p-1;y<m;y+=l){let g=Xo(this,t,Tr,c,y,y+1);g&&e.push(g)}if(this.isLineLoop){let y=Xo(this,t,Tr,c,p-1,f);y&&e.push(y)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Xo(s,t,e,n,i,r){let o=s.geometry.attributes.position;if(va.fromBufferAttribute(o,i),Ma.fromBufferAttribute(o,r),e.distanceSqToSegment(va,Ma,rl,bf)>n)return;rl.applyMatrix4(s.matrixWorld);let c=t.ray.origin.distanceTo(rl);if(!(c<t.near||c>t.far))return{distance:c,point:bf.clone().applyMatrix4(s.matrixWorld),index:i,face:null,faceIndex:null,barycoord:null,object:s}}var Sf=new S,Af=new S,ba=class extends Ys{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let i=0,r=e.count;i<r;i+=2)Sf.fromBufferAttribute(e,i),Af.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Sf.distanceTo(Af);t.setAttribute("lineDistance",new vt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Sa=class extends Ys{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}},ns=class extends Je{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new tt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Tf=new Et,hh=new Qi,Ko=new un,jo=new S,Zs=class extends fe{constructor(t=new Gt,e=new ns){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ko.copy(n.boundingSphere),Ko.applyMatrix4(i),Ko.radius+=r,t.ray.intersectsSphere(Ko)===!1)return;Tf.copy(i).invert(),hh.copy(t.ray).applyMatrix4(Tf);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){let d=Math.max(0,o.start),f=Math.min(l.count,o.start+o.count);for(let p=d,y=f;p<y;p++){let m=l.getX(p);jo.fromBufferAttribute(u,m),Ef(jo,m,c,i,t,e,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let p=d,y=f;p<y;p++)jo.fromBufferAttribute(u,p),Ef(jo,p,c,i,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Ef(s,t,e,n,i,r,o){let a=hh.distanceSqToPoint(s);if(a<e){let c=new S;hh.closestPointToPoint(s,c),c.applyMatrix4(n);let l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var he=class extends Fe{constructor(t,e,n,i,r,o,a,c,l){super(t,e,n,i,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},bn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,i=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let n=this.getLengths(),i=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(i=Math.floor(a+(c-a)/2),l=n[i]-o,l<0)a=i+1;else if(l>0)c=i-1;else{c=i;break}if(i=c,n[i]===o)return i/(r-1);let h=n[i],d=n[i+1]-h,f=(o-h)/d;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);let o=this.getPoint(i),a=this.getPoint(r),c=e||(o.isVector2?new ot:new S);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){let n=new S,i=[],r=[],o=[],a=new S,c=new Et;for(let f=0;f<=t;f++){let p=f/t;i[f]=this.getTangentAt(p,new S)}r[0]=new S,o[0]=new S;let l=Number.MAX_VALUE,h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();let p=Math.acos(Oe(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(a,p))}o[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(Oe(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(c.makeRotationAxis(i[p],f*p)),o[p].crossVectors(i[p],r[p])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Wr=class extends bn{constructor(t=0,e=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new ot){let n=e,i=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);let a=this.aStartAngle+t*r,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},uh=class extends Wr{constructor(t,e,n,i,r,o){super(t,e,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function $h(){let s=0,t=0,e=0,n=0;function i(r,o,a,c){s=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){i(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let d=(o-r)/l-(a-r)/(l+h)+(a-o)/h,f=(a-o)/h-(c-o)/(h+u)+(c-a)/u;d*=h,f*=h,i(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return s+t*r+e*o+n*a}}}var qo=new S,ol=new $h,al=new $h,cl=new $h,dh=class extends bn{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new S){let n=e,i=this.points,r=i.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=i[(a-1)%r]:(qo.subVectors(i[0],i[1]).add(i[0]),l=qo);let u=i[a%r],d=i[(a+1)%r];if(this.closed||a+2<r?h=i[(a+2)%r]:(qo.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=qo),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,p=Math.pow(l.distanceToSquared(u),f),y=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);y<1e-4&&(y=1),p<1e-4&&(p=y),m<1e-4&&(m=y),ol.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,p,y,m),al.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,p,y,m),cl.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,p,y,m)}else this.curveType==="catmullrom"&&(ol.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),al.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),cl.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(ol.calc(c),al.calc(c),cl.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new S().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function zf(s,t,e,n,i){let r=(n-t)*.5,o=(i-e)*.5,a=s*s,c=s*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*s+e}function kw(s,t){let e=1-s;return e*e*t}function Cw(s,t){return 2*(1-s)*s*t}function Pw(s,t){return s*s*t}function Ir(s,t,e,n){return kw(s,t)+Cw(s,e)+Pw(s,n)}function Iw(s,t){let e=1-s;return e*e*e*t}function Lw(s,t){let e=1-s;return 3*e*e*s*t}function Dw(s,t){return 3*(1-s)*s*s*t}function Nw(s,t){return s*s*s*t}function Lr(s,t,e,n,i){return Iw(s,t)+Lw(s,e)+Dw(s,n)+Nw(s,i)}var Aa=class extends bn{constructor(t=new ot,e=new ot,n=new ot,i=new ot){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new ot){let n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Lr(t,i.x,r.x,o.x,a.x),Lr(t,i.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},fh=class extends bn{constructor(t=new S,e=new S,n=new S,i=new S){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new S){let n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Lr(t,i.x,r.x,o.x,a.x),Lr(t,i.y,r.y,o.y,a.y),Lr(t,i.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Ta=class extends bn{constructor(t=new ot,e=new ot){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ot){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ot){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ph=class extends bn{constructor(t=new S,e=new S){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new S){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new S){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ea=class extends bn{constructor(t=new ot,e=new ot,n=new ot){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ot){let n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(Ir(t,i.x,r.x,o.x),Ir(t,i.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},mh=class extends bn{constructor(t=new S,e=new S,n=new S){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new S){let n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(Ir(t,i.x,r.x,o.x),Ir(t,i.y,r.y,o.y),Ir(t,i.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},za=class extends bn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ot){let n=e,i=this.points,r=(i.length-1)*t,o=Math.floor(r),a=r-o,c=i[o===0?o:o-1],l=i[o],h=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(zf(a,c.x,l.x,h.x,u.x),zf(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new ot().fromArray(i))}return this}},Rf=Object.freeze({__proto__:null,ArcCurve:uh,CatmullRomCurve3:dh,CubicBezierCurve:Aa,CubicBezierCurve3:fh,EllipseCurve:Wr,LineCurve:Ta,LineCurve3:ph,QuadraticBezierCurve:Ea,QuadraticBezierCurve3:mh,SplineCurve:za}),gh=class extends bn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Rf[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),i=this.getCurveLengths(),r=0;for(;r<i.length;){if(i[r]>=n){let o=i[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let i=0,r=this.curves;i<r.length;i++){let o=r[i],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(new Rf[i.type]().fromJSON(i))}return this}},Ra=class extends gh{constructor(t){super(),this.type="Path",this.currentPoint=new ot,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new Ta(this.currentPoint.clone(),new ot(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){let r=new Ea(this.currentPoint.clone(),new ot(t,e),new ot(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,o){let a=new Aa(this.currentPoint.clone(),new ot(t,e),new ot(n,i),new ot(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new za(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,o){let a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,i,r,o),this}absarc(t,e,n,i,r,o){return this.absellipse(t,e,n,n,i,r,o),this}ellipse(t,e,n,i,r,o,a,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,i,r,o,a,c),this}absellipse(t,e,n,i,r,o,a,c){let l=new Wr(t,e,n,i,r,o,a,c);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}};var ki=class s extends Gt{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);let r=[],o=[],a=[],c=[],l=new S,h=new ot;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){let f=n+u/e*i;l.x=t*Math.cos(f),l.y=t*Math.sin(f),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new vt(o,3)),this.setAttribute("normal",new vt(a,3)),this.setAttribute("uv",new vt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.segments,t.thetaStart,t.thetaLength)}},pe=class s extends Gt{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;i=Math.floor(i),r=Math.floor(r);let h=[],u=[],d=[],f=[],p=0,y=[],m=n/2,g=0;x(),o===!1&&(t>0&&_(!0),e>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new vt(u,3)),this.setAttribute("normal",new vt(d,3)),this.setAttribute("uv",new vt(f,2));function x(){let v=new S,k=new S,M=0,T=(e-t)/n;for(let R=0;R<=r;R++){let P=[],w=R/r,b=w*(e-t)+t;for(let I=0;I<=i;I++){let C=I/i,U=C*c+a,K=Math.sin(U),B=Math.cos(U);k.x=b*K,k.y=-w*n+m,k.z=b*B,u.push(k.x,k.y,k.z),v.set(K,T,B).normalize(),d.push(v.x,v.y,v.z),f.push(C,1-w),P.push(p++)}y.push(P)}for(let R=0;R<i;R++)for(let P=0;P<r;P++){let w=y[P][R],b=y[P+1][R],I=y[P+1][R+1],C=y[P][R+1];t>0&&(h.push(w,b,C),M+=3),e>0&&(h.push(b,I,C),M+=3)}l.addGroup(g,M,0),g+=M}function _(v){let k=p,M=new ot,T=new S,R=0,P=v===!0?t:e,w=v===!0?1:-1;for(let I=1;I<=i;I++)u.push(0,m*w,0),d.push(0,w,0),f.push(.5,.5),p++;let b=p;for(let I=0;I<=i;I++){let U=I/i*c+a,K=Math.cos(U),B=Math.sin(U);T.x=P*B,T.y=m*w,T.z=P*K,u.push(T.x,T.y,T.z),d.push(0,w,0),M.x=K*.5+.5,M.y=B*.5*w+.5,f.push(M.x,M.y),p++}for(let I=0;I<i;I++){let C=k+I,U=b+I;v===!0?h.push(U,U+1,C):h.push(U+1,U,C),R+=3}l.addGroup(g,R,v===!0?1:2),g+=R}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ri=class s extends pe{constructor(t=1,e=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new s(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ka=class s extends Gt{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};let r=[],o=[];a(i),l(n),h(),this.setAttribute("position",new vt(r,3)),this.setAttribute("normal",new vt(r.slice(),3)),this.setAttribute("uv",new vt(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(x){let _=new S,v=new S,k=new S;for(let M=0;M<e.length;M+=3)f(e[M+0],_),f(e[M+1],v),f(e[M+2],k),c(_,v,k,x)}function c(x,_,v,k){let M=k+1,T=[];for(let R=0;R<=M;R++){T[R]=[];let P=x.clone().lerp(v,R/M),w=_.clone().lerp(v,R/M),b=M-R;for(let I=0;I<=b;I++)I===0&&R===M?T[R][I]=P:T[R][I]=P.clone().lerp(w,I/b)}for(let R=0;R<M;R++)for(let P=0;P<2*(M-R)-1;P++){let w=Math.floor(P/2);P%2===0?(d(T[R][w+1]),d(T[R+1][w]),d(T[R][w])):(d(T[R][w+1]),d(T[R+1][w+1]),d(T[R+1][w]))}}function l(x){let _=new S;for(let v=0;v<r.length;v+=3)_.x=r[v+0],_.y=r[v+1],_.z=r[v+2],_.normalize().multiplyScalar(x),r[v+0]=_.x,r[v+1]=_.y,r[v+2]=_.z}function h(){let x=new S;for(let _=0;_<r.length;_+=3){x.x=r[_+0],x.y=r[_+1],x.z=r[_+2];let v=m(x)/2/Math.PI+.5,k=g(x)/Math.PI+.5;o.push(v,1-k)}p(),u()}function u(){for(let x=0;x<o.length;x+=6){let _=o[x+0],v=o[x+2],k=o[x+4],M=Math.max(_,v,k),T=Math.min(_,v,k);M>.9&&T<.1&&(_<.2&&(o[x+0]+=1),v<.2&&(o[x+2]+=1),k<.2&&(o[x+4]+=1))}}function d(x){r.push(x.x,x.y,x.z)}function f(x,_){let v=x*3;_.x=t[v+0],_.y=t[v+1],_.z=t[v+2]}function p(){let x=new S,_=new S,v=new S,k=new S,M=new ot,T=new ot,R=new ot;for(let P=0,w=0;P<r.length;P+=9,w+=6){x.set(r[P+0],r[P+1],r[P+2]),_.set(r[P+3],r[P+4],r[P+5]),v.set(r[P+6],r[P+7],r[P+8]),M.set(o[w+0],o[w+1]),T.set(o[w+2],o[w+3]),R.set(o[w+4],o[w+5]),k.copy(x).add(_).add(v).divideScalar(3);let b=m(k);y(M,w+0,x,b),y(T,w+2,_,b),y(R,w+4,v,b)}}function y(x,_,v,k){k<0&&x.x===1&&(o[_]=x.x-1),v.x===0&&v.z===0&&(o[_]=k/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function g(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.vertices,t.indices,t.radius,t.details)}},$s=class s extends ka{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new s(t.radius,t.detail)}};var Xr=class extends Ra{constructor(t){super(t),this.uuid=vn(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(new Ra().fromJSON(i))}return this}},Uw={triangulate:function(s,t,e=2){let n=t&&t.length,i=n?t[0]*e:s.length,r=hp(s,0,i,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,c,l,h,u,d,f;if(n&&(r=Vw(s,t,r,e)),s.length>80*e){a=l=s[0],c=h=s[1];for(let p=e;p<i;p+=e)u=s[p],d=s[p+1],u<a&&(a=u),d<c&&(c=d),u>l&&(l=u),d>h&&(h=d);f=Math.max(l-a,h-c),f=f!==0?32767/f:0}return Kr(r,o,e,a,c,f,0),o}};function hp(s,t,e,n,i){let r,o;if(i===Qw(s,t,e,n)>0)for(r=t;r<e;r+=n)o=kf(r,s[r],s[r+1],o);else for(r=e-n;r>=t;r-=n)o=kf(r,s[r],s[r+1],o);return o&&Xa(o,o.next)&&(qr(o),o=o.next),o}function is(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(Xa(e,e.next)||xe(e.prev,e,e.next)===0)){if(qr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Kr(s,t,e,n,i,r,o){if(!s)return;!o&&r&&jw(s,n,i,r);let a=s,c,l;for(;s.prev!==s.next;){if(c=s.prev,l=s.next,r?Fw(s,n,i,r):Ow(s)){t.push(c.i/e|0),t.push(s.i/e|0),t.push(l.i/e|0),qr(s),s=l.next,a=l.next;continue}if(s=l,s===a){o?o===1?(s=Bw(is(s),t,e),Kr(s,t,e,n,i,r,2)):o===2&&Hw(s,t,e,n,i,r):Kr(is(s),t,e,n,i,r,1);break}}}function Ow(s){let t=s.prev,e=s,n=s.next;if(xe(t,e,n)>=0)return!1;let i=t.x,r=e.x,o=n.x,a=t.y,c=e.y,l=n.y,h=i<r?i<o?i:o:r<o?r:o,u=a<c?a<l?a:l:c<l?c:l,d=i>r?i>o?i:o:r>o?r:o,f=a>c?a>l?a:l:c>l?c:l,p=n.next;for(;p!==t;){if(p.x>=h&&p.x<=d&&p.y>=u&&p.y<=f&&Is(i,a,r,c,o,l,p.x,p.y)&&xe(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function Fw(s,t,e,n){let i=s.prev,r=s,o=s.next;if(xe(i,r,o)>=0)return!1;let a=i.x,c=r.x,l=o.x,h=i.y,u=r.y,d=o.y,f=a<c?a<l?a:l:c<l?c:l,p=h<u?h<d?h:d:u<d?u:d,y=a>c?a>l?a:l:c>l?c:l,m=h>u?h>d?h:d:u>d?u:d,g=yh(f,p,t,e,n),x=yh(y,m,t,e,n),_=s.prevZ,v=s.nextZ;for(;_&&_.z>=g&&v&&v.z<=x;){if(_.x>=f&&_.x<=y&&_.y>=p&&_.y<=m&&_!==i&&_!==o&&Is(a,h,c,u,l,d,_.x,_.y)&&xe(_.prev,_,_.next)>=0||(_=_.prevZ,v.x>=f&&v.x<=y&&v.y>=p&&v.y<=m&&v!==i&&v!==o&&Is(a,h,c,u,l,d,v.x,v.y)&&xe(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;_&&_.z>=g;){if(_.x>=f&&_.x<=y&&_.y>=p&&_.y<=m&&_!==i&&_!==o&&Is(a,h,c,u,l,d,_.x,_.y)&&xe(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;v&&v.z<=x;){if(v.x>=f&&v.x<=y&&v.y>=p&&v.y<=m&&v!==i&&v!==o&&Is(a,h,c,u,l,d,v.x,v.y)&&xe(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function Bw(s,t,e){let n=s;do{let i=n.prev,r=n.next.next;!Xa(i,r)&&up(i,n,n.next,r)&&jr(i,r)&&jr(r,i)&&(t.push(i.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),qr(n),qr(n.next),n=s=r),n=n.next}while(n!==s);return is(n)}function Hw(s,t,e,n,i,r){let o=s;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Zw(o,a)){let c=dp(o,a);o=is(o,o.next),c=is(c,c.next),Kr(o,t,e,n,i,r,0),Kr(c,t,e,n,i,r,0);return}a=a.next}o=o.next}while(o!==s)}function Vw(s,t,e,n){let i=[],r,o,a,c,l;for(r=0,o=t.length;r<o;r++)a=t[r]*n,c=r<o-1?t[r+1]*n:s.length,l=hp(s,a,c,n,!1),l===l.next&&(l.steiner=!0),i.push(Yw(l));for(i.sort(Gw),r=0;r<i.length;r++)e=Ww(i[r],e);return e}function Gw(s,t){return s.x-t.x}function Ww(s,t){let e=Xw(s,t);if(!e)return t;let n=dp(e,s);return is(n,n.next),is(e,e.next)}function Xw(s,t){let e=t,n=-1/0,i,r=s.x,o=s.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){let d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=r&&d>n&&(n=d,i=e.x<e.next.x?e:e.next,d===r))return i}e=e.next}while(e!==t);if(!i)return null;let a=i,c=i.x,l=i.y,h=1/0,u;e=i;do r>=e.x&&e.x>=c&&r!==e.x&&Is(o<l?r:n,o,c,l,o<l?n:r,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(r-e.x),jr(e,s)&&(u<h||u===h&&(e.x>i.x||e.x===i.x&&Kw(i,e)))&&(i=e,h=u)),e=e.next;while(e!==a);return i}function Kw(s,t){return xe(s.prev,s,t.prev)<0&&xe(t.next,s,s.next)<0}function jw(s,t,e,n){let i=s;do i.z===0&&(i.z=yh(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,qw(i)}function qw(s){let t,e,n,i,r,o,a,c,l=1;do{for(e=s,s=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<l&&(a++,n=n.nextZ,!!n);t++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||e.z<=n.z)?(i=e,e=e.nextZ,a--):(i=n,n=n.nextZ,c--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;e=n}r.nextZ=null,l*=2}while(o>1);return s}function yh(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function Yw(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function Is(s,t,e,n,i,r,o,a){return(i-o)*(t-a)>=(s-o)*(r-a)&&(s-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(i-o)*(n-a)}function Zw(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!$w(s,t)&&(jr(s,t)&&jr(t,s)&&Jw(s,t)&&(xe(s.prev,s,t.prev)||xe(s,t.prev,t))||Xa(s,t)&&xe(s.prev,s,s.next)>0&&xe(t.prev,t,t.next)>0)}function xe(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function Xa(s,t){return s.x===t.x&&s.y===t.y}function up(s,t,e,n){let i=Zo(xe(s,t,e)),r=Zo(xe(s,t,n)),o=Zo(xe(e,n,s)),a=Zo(xe(e,n,t));return!!(i!==r&&o!==a||i===0&&Yo(s,e,t)||r===0&&Yo(s,n,t)||o===0&&Yo(e,s,n)||a===0&&Yo(e,t,n))}function Yo(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function Zo(s){return s>0?1:s<0?-1:0}function $w(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&up(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function jr(s,t){return xe(s.prev,s,s.next)<0?xe(s,t,s.next)>=0&&xe(s,s.prev,t)>=0:xe(s,t,s.prev)<0||xe(s,s.next,t)<0}function Jw(s,t){let e=s,n=!1,i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function dp(s,t){let e=new _h(s.i,s.x,s.y),n=new _h(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function kf(s,t,e,n){let i=new _h(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function qr(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function _h(s,t,e){this.i=s,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Qw(s,t,e,n){let i=0;for(let r=t,o=e-n;r<e;r+=n)i+=(s[o]-s[r])*(s[r+1]+s[o+1]),o=r;return i}var Dr=class s{static area(t){let e=t.length,n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return s.area(t)<0}static triangulateShape(t,e){let n=[],i=[],r=[];Cf(t),Pf(n,t);let o=t.length;e.forEach(Cf);for(let c=0;c<e.length;c++)i.push(o),o+=e[c].length,Pf(n,e[c]);let a=Uw.triangulate(n,i);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}};function Cf(s){let t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function Pf(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}var fn=class s extends ka{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new s(t.radius,t.detail)}};var oi=class s extends Gt{constructor(t=.5,e=1,n=32,i=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:o},n=Math.max(3,n),i=Math.max(1,i);let a=[],c=[],l=[],h=[],u=t,d=(e-t)/i,f=new S,p=new ot;for(let y=0;y<=i;y++){for(let m=0;m<=n;m++){let g=r+m/n*o;f.x=u*Math.cos(g),f.y=u*Math.sin(g),c.push(f.x,f.y,f.z),l.push(0,0,1),p.x=(f.x/e+1)/2,p.y=(f.y/e+1)/2,h.push(p.x,p.y)}u+=d}for(let y=0;y<i;y++){let m=y*(n+1);for(let g=0;g<n;g++){let x=g+m,_=x,v=x+n+1,k=x+n+2,M=x+1;a.push(_,v,M),a.push(v,k,M)}}this.setIndex(a),this.setAttribute("position",new vt(c,3)),this.setAttribute("normal",new vt(l,3)),this.setAttribute("uv",new vt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},Ca=class s extends Gt{constructor(t=new Xr([new ot(0,.5),new ot(-.5,-.5),new ot(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],i=[],r=[],o=[],a=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(a,c,h),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new vt(i,3)),this.setAttribute("normal",new vt(r,3)),this.setAttribute("uv",new vt(o,2));function l(h){let u=i.length/3,d=h.extractPoints(e),f=d.shape,p=d.holes;Dr.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,g=p.length;m<g;m++){let x=p[m];Dr.isClockWise(x)===!0&&(p[m]=x.reverse())}let y=Dr.triangulateShape(f,p);for(let m=0,g=p.length;m<g;m++){let x=p[m];f=f.concat(x)}for(let m=0,g=f.length;m<g;m++){let x=f[m];i.push(x.x,x.y,0),r.push(0,0,1),o.push(x.x,x.y)}for(let m=0,g=y.length;m<g;m++){let x=y[m],_=x[0]+u,v=x[1]+u,k=x[2]+u;n.push(_,v,k),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return tv(e,t)}static fromJSON(t,e){let n=[];for(let i=0,r=t.shapes.length;i<r;i++){let o=e[t.shapes[i]];n.push(o)}return new s(n,t.curveSegments)}};function tv(s,t){if(t.shapes=[],Array.isArray(s))for(let e=0,n=s.length;e<n;e++){let i=s[e];t.shapes.push(i.uuid)}else t.shapes.push(s.uuid);return t}var Se=class s extends Gt{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let c=Math.min(o+a,Math.PI),l=0,h=[],u=new S,d=new S,f=[],p=[],y=[],m=[];for(let g=0;g<=n;g++){let x=[],_=g/n,v=0;g===0&&o===0?v=.5/e:g===n&&c===Math.PI&&(v=-.5/e);for(let k=0;k<=e;k++){let M=k/e;u.x=-t*Math.cos(i+M*r)*Math.sin(o+_*a),u.y=t*Math.cos(o+_*a),u.z=t*Math.sin(i+M*r)*Math.sin(o+_*a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),y.push(d.x,d.y,d.z),m.push(M+v,1-_),x.push(l++)}h.push(x)}for(let g=0;g<n;g++)for(let x=0;x<e;x++){let _=h[g][x+1],v=h[g][x],k=h[g+1][x],M=h[g+1][x+1];(g!==0||o>0)&&f.push(_,v,M),(g!==n-1||c<Math.PI)&&f.push(v,k,M)}this.setIndex(f),this.setAttribute("position",new vt(p,3)),this.setAttribute("normal",new vt(y,3)),this.setAttribute("uv",new vt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Pa=class s extends Gt{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);let o=[],a=[],c=[],l=[],h=new S,u=new S,d=new S;for(let f=0;f<=n;f++)for(let p=0;p<=i;p++){let y=p/i*r,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(y),u.y=(t+e*Math.cos(m))*Math.sin(y),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(y),h.y=t*Math.sin(y),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(p/i),l.push(f/n)}for(let f=1;f<=n;f++)for(let p=1;p<=i;p++){let y=(i+1)*f+p-1,m=(i+1)*(f-1)+p-1,g=(i+1)*(f-1)+p,x=(i+1)*f+p;o.push(y,m,x),o.push(m,g,x)}this.setIndex(o),this.setAttribute("position",new vt(a,3)),this.setAttribute("normal",new vt(c,3)),this.setAttribute("uv",new vt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var Js=class extends Je{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new tt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new tt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=jh,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new dn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},pn=class extends Js{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ot(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Oe(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new tt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new tt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new tt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var te=class extends Je{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new tt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new tt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=jh,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new dn,this.combine=Dh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function $i(s,t,e){return!s||!e&&s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function fp(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function pp(s){function t(i,r){return s[i]-s[r]}let e=s.length,n=new Array(e);for(let i=0;i!==e;++i)n[i]=i;return n.sort(t),n}function xh(s,t,e){let n=s.length,i=new s.constructor(n);for(let r=0,o=0;o!==n;++r){let a=e[r]*t;for(let c=0;c!==t;++c)i[o++]=s[a+c]}return i}function Jh(s,t,e,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(t.push(r.time),e.push.apply(e,o)),r=s[i++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(t.push(r.time),o.toArray(e,e.length)),r=s[i++];while(r!==void 0);else do o=r[n],o!==void 0&&(t.push(r.time),e.push(o)),r=s[i++];while(r!==void 0)}function ev(s,t,e,n,i=30){let r=s.clone();r.name=t;let o=[];for(let c=0;c<r.tracks.length;++c){let l=r.tracks[c],h=l.getValueSize(),u=[],d=[];for(let f=0;f<l.times.length;++f){let p=l.times[f]*i;if(!(p<e||p>=n)){u.push(l.times[f]);for(let y=0;y<h;++y)d.push(l.values[f*h+y])}}u.length!==0&&(l.times=$i(u,l.times.constructor),l.values=$i(d,l.values.constructor),o.push(l))}r.tracks=o;let a=1/0;for(let c=0;c<r.tracks.length;++c)a>r.tracks[c].times[0]&&(a=r.tracks[c].times[0]);for(let c=0;c<r.tracks.length;++c)r.tracks[c].shift(-1*a);return r.resetDuration(),r}function nv(s,t=0,e=s,n=30){n<=0&&(n=30);let i=e.tracks.length,r=t/n;for(let o=0;o<i;++o){let a=e.tracks[o],c=a.ValueTypeName;if(c==="bool"||c==="string")continue;let l=s.tracks.find(function(g){return g.name===a.name&&g.ValueTypeName===c});if(l===void 0)continue;let h=0,u=a.getValueSize();a.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(h=u/3);let d=0,f=l.getValueSize();l.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(d=f/3);let p=a.times.length-1,y;if(r<=a.times[0]){let g=h,x=u-h;y=a.values.slice(g,x)}else if(r>=a.times[p]){let g=p*u+h,x=g+u-h;y=a.values.slice(g,x)}else{let g=a.createInterpolant(),x=h,_=u-h;g.evaluate(r),y=g.resultBuffer.slice(x,_)}c==="quaternion"&&new Ft().fromArray(y).normalize().conjugate().toArray(y);let m=l.times.length;for(let g=0;g<m;++g){let x=g*f+d;if(c==="quaternion")Ft.multiplyQuaternionsFlat(l.values,x,y,0,l.values,x);else{let _=f-d*2;for(let v=0;v<_;++v)l.values[x+v]-=y[v]}}}return s.blendMode=Zf,s}var mp={convertArray:$i,isTypedArray:fp,getKeyframeOrder:pp,sortedArray:xh,flattenJSON:Jh,subclip:ev,makeClipAdditive:nv},Ci=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],r=e[n-1];t:{e:{let o;n:{i:if(!(t<i)){for(let a=n+2;;){if(i===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=e[++n],t<i)break e}o=e.length;break n}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(i=r,r=e[--n-1],t>=r)break e}o=n,n=0;break n}break t}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(i=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i;for(let o=0;o!==i;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},wh=class extends Ci{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ks,endingEnd:ks}}intervalChanged_(t,e,n){let i=this.parameterPositions,r=t-2,o=t+1,a=i[r],c=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case Cs:r=t,a=2*e-n;break;case sa:r=i.length-2,a=e+i[r]-i[r+1];break;default:r=t,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Cs:o=t,c=2*n-e;break;case sa:o=1,c=n+i[1]-i[0];break;default:o=t-1,c=e}let l=(n-e)*.5,h=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-e)/(i-e),y=p*p,m=y*p,g=-d*m+2*d*y-d*p,x=(1+d)*m+(-1.5-2*d)*y+(-.5+d)*p+1,_=(-1-f)*m+(1.5+f)*y+.5*p,v=f*m-f*y;for(let k=0;k!==a;++k)r[k]=g*o[h+k]+x*o[l+k]+_*o[c+k]+v*o[u+k];return r}},Ia=class extends Ci{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=(n-e)/(i-e),u=1-h;for(let d=0;d!==a;++d)r[d]=o[l+d]*u+o[c+d]*h;return r}},vh=class extends Ci{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},Sn=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=$i(e,this.TimeBufferType),this.values=$i(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:$i(t.times,Array),values:$i(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new vh(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Ia(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new wh(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Gs:e=this.InterpolantFactoryMethodDiscrete;break;case Ws:e=this.InterpolantFactoryMethodLinear;break;case zc:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Gs;case this.InterpolantFactoryMethodLinear:return Ws;case this.InterpolantFactoryMethodSmooth:return zc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t}return this}trim(t,e){let n=this.times,i=n.length,r=0,o=i-1;for(;r!==i&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(i!==void 0&&fp(i))for(let a=0,c=i.length;a!==c;++a){let l=i[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===zc,r=t.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=t[a],h=t[a+1];if(l!==h&&(a!==1||l!==t[0]))if(i)c=!0;else{let u=a*n,d=u-n,f=u+n;for(let p=0;p!==n;++p){let y=e[u+p];if(y!==e[d+p]||y!==e[f+p]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)e[d+f]=e[u+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,i}};Sn.prototype.TimeBufferType=Float32Array;Sn.prototype.ValueBufferType=Float32Array;Sn.prototype.DefaultInterpolation=Ws;var Pi=class extends Sn{constructor(t,e,n){super(t,e,n)}};Pi.prototype.ValueTypeName="bool";Pi.prototype.ValueBufferType=Array;Pi.prototype.DefaultInterpolation=Gs;Pi.prototype.InterpolantFactoryMethodLinear=void 0;Pi.prototype.InterpolantFactoryMethodSmooth=void 0;var La=class extends Sn{};La.prototype.ValueTypeName="color";var ai=class extends Sn{};ai.prototype.ValueTypeName="number";var Mh=class extends Ci{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-e)/(i-e),l=t*a;for(let h=l+a;l!==h;l+=4)Ft.slerpFlat(r,0,o,l-a,o,l,c);return r}},ci=class extends Sn{InterpolantFactoryMethodLinear(t){return new Mh(this.times,this.values,this.getValueSize(),t)}};ci.prototype.ValueTypeName="quaternion";ci.prototype.InterpolantFactoryMethodSmooth=void 0;var Ii=class extends Sn{constructor(t,e,n){super(t,e,n)}};Ii.prototype.ValueTypeName="string";Ii.prototype.ValueBufferType=Array;Ii.prototype.DefaultInterpolation=Gs;Ii.prototype.InterpolantFactoryMethodLinear=void 0;Ii.prototype.InterpolantFactoryMethodSmooth=void 0;var li=class extends Sn{};li.prototype.ValueTypeName="vector";var Qs=class{constructor(t="",e=-1,n=[],i=Kh){this.name=t,this.tracks=n,this.duration=e,this.blendMode=i,this.uuid=vn(),this.duration<0&&this.resetDuration()}static parse(t){let e=[],n=t.tracks,i=1/(t.fps||1);for(let o=0,a=n.length;o!==a;++o)e.push(sv(n[o]).scale(i));let r=new this(t.name,t.duration,e,t.blendMode);return r.uuid=t.uuid,r}static toJSON(t){let e=[],n=t.tracks,i={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode};for(let r=0,o=n.length;r!==o;++r)e.push(Sn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(t,e,n,i){let r=e.length,o=[];for(let a=0;a<r;a++){let c=[],l=[];c.push((a+r-1)%r,a,(a+1)%r),l.push(0,1,0);let h=pp(c);c=xh(c,1,h),l=xh(l,1,h),!i&&c[0]===0&&(c.push(r),l.push(l[0])),o.push(new ai(".morphTargetInfluences["+e[a].name+"]",c,l).scale(1/n))}return new this(t,-1,o)}static findByName(t,e){let n=t;if(!Array.isArray(t)){let i=t;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===e)return n[i];return null}static CreateClipsFromMorphTargetSequences(t,e,n){let i={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,c=t.length;a<c;a++){let l=t[a],h=l.name.match(r);if(h&&h.length>1){let u=h[1],d=i[u];d||(i[u]=d=[]),d.push(l)}}let o=[];for(let a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],e,n));return o}static parseAnimation(t,e){if(!t)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let n=function(u,d,f,p,y){if(f.length!==0){let m=[],g=[];Jh(f,m,g,p),m.length!==0&&y.push(new u(d,m,g))}},i=[],r=t.name||"default",o=t.fps||30,a=t.blendMode,c=t.length||-1,l=t.hierarchy||[];for(let u=0;u<l.length;u++){let d=l[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){let f={},p;for(p=0;p<d.length;p++)if(d[p].morphTargets)for(let y=0;y<d[p].morphTargets.length;y++)f[d[p].morphTargets[y]]=-1;for(let y in f){let m=[],g=[];for(let x=0;x!==d[p].morphTargets.length;++x){let _=d[p];m.push(_.time),g.push(_.morphTarget===y?1:0)}i.push(new ai(".morphTargetInfluence["+y+"]",m,g))}c=f.length*o}else{let f=".bones["+e[u].name+"]";n(li,f+".position",d,"pos",i),n(ci,f+".quaternion",d,"rot",i),n(li,f+".scale",d,"scl",i)}}return i.length===0?null:new this(r,c,i,a)}resetDuration(){let t=this.tracks,e=0;for(let n=0,i=t.length;n!==i;++n){let r=this.tracks[n];e=Math.max(e,r.times[r.times.length-1])}return this.duration=e,this}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this}clone(){let t=[];for(let e=0;e<this.tracks.length;e++)t.push(this.tracks[e].clone());return new this.constructor(this.name,this.duration,t,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}};function iv(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ai;case"vector":case"vector2":case"vector3":case"vector4":return li;case"color":return La;case"quaternion":return ci;case"bool":case"boolean":return Pi;case"string":return Ii}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function sv(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let t=iv(s.type);if(s.times===void 0){let e=[],n=[];Jh(s.keys,e,n,"value"),s.times=e,s.values=n}return t.parse!==void 0?t.parse(s):new t(s.name,s.times,s.values,s.interpolation)}var Ti={enabled:!1,files:{},add:function(s,t){this.enabled!==!1&&(this.files[s]=t)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}},bh=class{constructor(t,e,n){let i=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){let f=l[u],p=l[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null}}},rv=new bh,hi=class{constructor(t){this.manager=t!==void 0?t:rv,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};hi.DEFAULT_MATERIAL_NAME="__DEFAULT";var $n={},Sh=class extends Error{constructor(t,e){super(t),this.response=e}},Yr=class extends hi{constructor(t){super(t)}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=Ti.get(t);if(r!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0),r;if($n[t]!==void 0){$n[t].push({onLoad:e,onProgress:n,onError:i});return}$n[t]=[],$n[t].push({onLoad:e,onProgress:n,onError:i});let o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let h=$n[t],u=l.body.getReader(),d=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=d?parseInt(d):0,p=f!==0,y=0,m=new ReadableStream({start(g){x();function x(){u.read().then(({done:_,value:v})=>{if(_)g.close();else{y+=v.byteLength;let k=new ProgressEvent("progress",{lengthComputable:p,loaded:y,total:f});for(let M=0,T=h.length;M<T;M++){let R=h[M];R.onProgress&&R.onProgress(k)}g.enqueue(v),x()}},_=>{g.error(_)})}}});return new Response(m)}else throw new Sh(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a===void 0)return l.text();{let u=/charset="?([^;"\s]*)"?/i.exec(a),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return l.arrayBuffer().then(p=>f.decode(p))}}}).then(l=>{Ti.add(t,l);let h=$n[t];delete $n[t];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onLoad&&f.onLoad(l)}}).catch(l=>{let h=$n[t];if(h===void 0)throw this.manager.itemError(t),l;delete $n[t];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onError&&f.onError(l)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}};var Ah=class extends hi{constructor(t){super(t)}load(t,e,n,i){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=Ti.get(t);if(o!==void 0)return r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0),o;let a=Fr("img");function c(){h(),Ti.add(t,this),e&&e(this),r.manager.itemEnd(t)}function l(u){h(),i&&i(u),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(t),a.src=t,a}};var Da=class extends hi{constructor(t){super(t)}load(t,e,n,i){let r=new Fe,o=new Ah(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,i),r}},ss=class extends fe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new tt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},Na=class extends ss{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(fe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new tt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},ll=new Et,If=new S,Lf=new S,Zr=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ot(512,512),this.map=null,this.mapPass=null,this.matrix=new Et,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Hr,this._frameExtents=new ot(1,1),this._viewportCount=1,this._viewports=[new $t(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;If.setFromMatrixPosition(t.matrixWorld),e.position.copy(If),Lf.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Lf),e.updateMatrixWorld(),ll.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ll),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ll)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Th=class extends Zr{constructor(){super(new Ve(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){let e=this.camera,n=Xs*2*t.angle*this.focus,i=this.mapSize.width/this.mapSize.height,r=t.distance||e.far;(n!==e.fov||i!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=i,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}},Ua=class extends ss{constructor(t,e,n=0,i=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(fe.DEFAULT_UP),this.updateMatrix(),this.target=new fe,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Th}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},Df=new Et,Er=new S,hl=new S,Eh=class extends Zr{constructor(){super(new Ve(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ot(4,2),this._viewportCount=6,this._viewports=[new $t(2,1,1,1),new $t(0,1,1,1),new $t(3,1,1,1),new $t(1,1,1,1),new $t(3,0,1,1),new $t(1,0,1,1)],this._cubeDirections=[new S(1,0,0),new S(-1,0,0),new S(0,0,1),new S(0,0,-1),new S(0,1,0),new S(0,-1,0)],this._cubeUps=[new S(0,1,0),new S(0,1,0),new S(0,1,0),new S(0,1,0),new S(0,0,1),new S(0,0,-1)]}updateMatrices(t,e=0){let n=this.camera,i=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Er.setFromMatrixPosition(t.matrixWorld),n.position.copy(Er),hl.copy(n.position),hl.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(hl),n.updateMatrixWorld(),i.makeTranslation(-Er.x,-Er.y,-Er.z),Df.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Df)}},mn=class extends ss{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Eh}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},zh=class extends Zr{constructor(){super(new Ri(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},rs=class extends ss{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(fe.DEFAULT_UP),this.updateMatrix(),this.target=new fe,this.shadow=new zh}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},Oa=class extends ss{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}};var Li=class{static decodeText(t){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(t);let e="";for(let n=0,i=t.length;n<i;n++)e+=String.fromCharCode(t[n]);try{return decodeURIComponent(escape(e))}catch{return e}}static extractUrlBase(t){let e=t.lastIndexOf("/");return e===-1?"./":t.slice(0,e+1)}static resolveURL(t,e){return typeof t!="string"||t===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(t)&&(e=e.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(t)||/^data:.*,.*$/i.test(t)||/^blob:.*$/i.test(t)?t:e+t)}};var Fa=class extends hi{constructor(t){super(t),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(t){return this.options=t,this}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=Ti.get(t);if(o!==void 0){if(r.manager.itemStart(t),o.then){o.then(l=>{e&&e(l),r.manager.itemEnd(t)}).catch(l=>{i&&i(l)});return}return setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0),o}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader;let c=fetch(t,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(l){return Ti.add(t,l),e&&e(l),r.manager.itemEnd(t),l}).catch(function(l){i&&i(l),Ti.remove(t),r.manager.itemError(t),r.manager.itemEnd(t)});Ti.add(t,c),r.manager.itemStart(t)}};var Ba=class{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Nf(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let e=Nf();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}};function Nf(){return performance.now()}var Rh=class{constructor(t,e,n){this.binding=t,this.valueSize=n;let i,r,o;switch(e){case"quaternion":i=this._slerp,r=this._slerpAdditive,o=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,r=this._select,o=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,r=this._lerpAdditive,o=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=r,this._setIdentity=o,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(t,e){let n=this.buffer,i=this.valueSize,r=t*i+i,o=this.cumulativeWeight;if(o===0){for(let a=0;a!==i;++a)n[r+a]=n[a];o=e}else{o+=e;let a=e/o;this._mixBufferRegion(n,r,0,a,i)}this.cumulativeWeight=o}accumulateAdditive(t){let e=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(e,i,0,t,n),this.cumulativeWeightAdditive+=t}apply(t){let e=this.valueSize,n=this.buffer,i=t*e+e,r=this.cumulativeWeight,o=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){let c=e*this._origIndex;this._mixBufferRegion(n,i,c,1-r,e)}o>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*e,1,e);for(let c=e,l=e+e;c!==l;++c)if(n[c]!==n[c+e]){a.setValue(n,i);break}}saveOriginalState(){let t=this.binding,e=this.buffer,n=this.valueSize,i=n*this._origIndex;t.getValue(e,i);for(let r=n,o=i;r!==o;++r)e[r]=e[i+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let t=this.valueSize*3;this.binding.setValue(this.buffer,t)}_setAdditiveIdentityNumeric(){let t=this._addIndex*this.valueSize,e=t+this.valueSize;for(let n=t;n<e;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let t=this._origIndex*this.valueSize,e=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[e+n]=this.buffer[t+n]}_select(t,e,n,i,r){if(i>=.5)for(let o=0;o!==r;++o)t[e+o]=t[n+o]}_slerp(t,e,n,i){Ft.slerpFlat(t,e,t,e,t,n,i)}_slerpAdditive(t,e,n,i,r){let o=this._workIndex*r;Ft.multiplyQuaternionsFlat(t,o,t,e,t,n),Ft.slerpFlat(t,e,t,e,t,o,i)}_lerp(t,e,n,i,r){let o=1-i;for(let a=0;a!==r;++a){let c=e+a;t[c]=t[c]*o+t[n+a]*i}}_lerpAdditive(t,e,n,i,r){for(let o=0;o!==r;++o){let a=e+o;t[a]=t[a]+t[n+o]*i}}},Qh="\\[\\]\\.:\\/",ov=new RegExp("["+Qh+"]","g"),tu="[^"+Qh+"]",av="[^"+Qh.replace("\\.","")+"]",cv=/((?:WC+[\/:])*)/.source.replace("WC",tu),lv=/(WCOD+)?/.source.replace("WCOD",av),hv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",tu),uv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",tu),dv=new RegExp("^"+cv+lv+hv+uv+"$"),fv=["material","materials","bones","map"],kh=class{constructor(t,e,n){let i=n||le.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},le=class s{constructor(t,e,n){this.path=e,this.parsedPath=n||s.parseTrackName(e),this.node=s.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new s.Composite(t,e,n):new s(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(ov,"")}static parseTrackName(t){let e=dv.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);fv.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let c=n(a.children);if(c)return c}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,r=e.propertyIndex;if(t||(t=s.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let o=t[i];if(o===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};le.Composite=kh;le.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};le.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};le.prototype.GetterByBindingType=[le.prototype._getValue_direct,le.prototype._getValue_array,le.prototype._getValue_arrayElement,le.prototype._getValue_toArray];le.prototype.SetterByBindingTypeAndVersioning=[[le.prototype._setValue_direct,le.prototype._setValue_direct_setNeedsUpdate,le.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[le.prototype._setValue_array,le.prototype._setValue_array_setNeedsUpdate,le.prototype._setValue_array_setMatrixWorldNeedsUpdate],[le.prototype._setValue_arrayElement,le.prototype._setValue_arrayElement_setNeedsUpdate,le.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[le.prototype._setValue_fromArray,le.prototype._setValue_fromArray_setNeedsUpdate,le.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Ch=class{constructor(t,e,n=null,i=e.blendMode){this._mixer=t,this._clip=e,this._localRoot=n,this.blendMode=i;let r=e.tracks,o=r.length,a=new Array(o),c={endingStart:ks,endingEnd:ks};for(let l=0;l!==o;++l){let h=r[l].createInterpolant(null);a[l]=h,h.settings=c}this._interpolantSettings=c,this._interpolants=a,this._propertyBindings=new Array(o),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=e0,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(t){return this._startTime=t,this}setLoop(t,e){return this.loop=t,this.repetitions=e,this}setEffectiveWeight(t){return this.weight=t,this._effectiveWeight=this.enabled?t:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(t){return this._scheduleFading(t,0,1)}fadeOut(t){return this._scheduleFading(t,1,0)}crossFadeFrom(t,e,n){if(t.fadeOut(e),this.fadeIn(e),n){let i=this._clip.duration,r=t._clip.duration,o=r/i,a=i/r;t.warp(1,o,e),this.warp(a,1,e)}return this}crossFadeTo(t,e,n){return t.crossFadeFrom(this,e,n)}stopFading(){let t=this._weightInterpolant;return t!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}setEffectiveTimeScale(t){return this.timeScale=t,this._effectiveTimeScale=this.paused?0:t,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(t){return this.timeScale=this._clip.duration/t,this.stopWarping()}syncWith(t){return this.time=t.time,this.timeScale=t.timeScale,this.stopWarping()}halt(t){return this.warp(this._effectiveTimeScale,0,t)}warp(t,e,n){let i=this._mixer,r=i.time,o=this.timeScale,a=this._timeScaleInterpolant;a===null&&(a=i._lendControlInterpolant(),this._timeScaleInterpolant=a);let c=a.parameterPositions,l=a.sampleValues;return c[0]=r,c[1]=r+n,l[0]=t/o,l[1]=e/o,this}stopWarping(){let t=this._timeScaleInterpolant;return t!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(t,e,n,i){if(!this.enabled){this._updateWeight(t);return}let r=this._startTime;if(r!==null){let c=(t-r)*n;c<0||n===0?e=0:(this._startTime=null,e=n*c)}e*=this._updateTimeScale(t);let o=this._updateTime(e),a=this._updateWeight(t);if(a>0){let c=this._interpolants,l=this._propertyBindings;switch(this.blendMode){case Zf:for(let h=0,u=c.length;h!==u;++h)c[h].evaluate(o),l[h].accumulateAdditive(a);break;case Kh:default:for(let h=0,u=c.length;h!==u;++h)c[h].evaluate(o),l[h].accumulate(i,a)}}}_updateWeight(t){let e=0;if(this.enabled){e=this.weight;let n=this._weightInterpolant;if(n!==null){let i=n.evaluate(t)[0];e*=i,t>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=e,e}_updateTimeScale(t){let e=0;if(!this.paused){e=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let i=n.evaluate(t)[0];e*=i,t>n.parameterPositions[1]&&(this.stopWarping(),e===0?this.paused=!0:this.timeScale=e)}}return this._effectiveTimeScale=e,e}_updateTime(t){let e=this._clip.duration,n=this.loop,i=this.time+t,r=this._loopCount,o=n===n0;if(t===0)return r===-1?i:o&&(r&1)===1?e-i:i;if(n===Xh){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));t:{if(i>=e)i=e;else if(i<0)i=0;else{this.time=i;break t}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:t<0?-1:1})}}else{if(r===-1&&(t>=0?(r=0,this._setEndings(!0,this.repetitions===0,o)):this._setEndings(this.repetitions===0,!0,o)),i>=e||i<0){let a=Math.floor(i/e);i-=e*a,r+=Math.abs(a);let c=this.repetitions-r;if(c<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=t>0?e:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:t>0?1:-1});else{if(c===1){let l=t<0;this._setEndings(l,!l,o)}else this._setEndings(!1,!1,o);this._loopCount=r,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this.time=i;if(o&&(r&1)===1)return e-i}return i}_setEndings(t,e,n){let i=this._interpolantSettings;n?(i.endingStart=Cs,i.endingEnd=Cs):(t?i.endingStart=this.zeroSlopeAtStart?Cs:ks:i.endingStart=sa,e?i.endingEnd=this.zeroSlopeAtEnd?Cs:ks:i.endingEnd=sa)}_scheduleFading(t,e,n){let i=this._mixer,r=i.time,o=this._weightInterpolant;o===null&&(o=i._lendControlInterpolant(),this._weightInterpolant=o);let a=o.parameterPositions,c=o.sampleValues;return a[0]=r,c[0]=e,a[1]=r+t,c[1]=n,this}},pv=new Float32Array(1),$r=class extends ii{constructor(t){super(),this._root=t,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(t,e){let n=t._localRoot||this._root,i=t._clip.tracks,r=i.length,o=t._propertyBindings,a=t._interpolants,c=n.uuid,l=this._bindingsByRootAndName,h=l[c];h===void 0&&(h={},l[c]=h);for(let u=0;u!==r;++u){let d=i[u],f=d.name,p=h[f];if(p!==void 0)++p.referenceCount,o[u]=p;else{if(p=o[u],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,c,f));continue}let y=e&&e._propertyBindings[u].binding.parsedPath;p=new Rh(le.create(n,f,y),d.ValueTypeName,d.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,c,f),o[u]=p}a[u].resultBuffer=p.buffer}}_activateAction(t){if(!this._isActiveAction(t)){if(t._cacheIndex===null){let n=(t._localRoot||this._root).uuid,i=t._clip.uuid,r=this._actionsByClip[i];this._bindAction(t,r&&r.knownActions[0]),this._addInactiveAction(t,i,n)}let e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){let r=e[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(t)}}_deactivateAction(t){if(this._isActiveAction(t)){let e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){let r=e[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(t)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let t=this;this.stats={actions:{get total(){return t._actions.length},get inUse(){return t._nActiveActions}},bindings:{get total(){return t._bindings.length},get inUse(){return t._nActiveBindings}},controlInterpolants:{get total(){return t._controlInterpolants.length},get inUse(){return t._nActiveControlInterpolants}}}}_isActiveAction(t){let e=t._cacheIndex;return e!==null&&e<this._nActiveActions}_addInactiveAction(t,e,n){let i=this._actions,r=this._actionsByClip,o=r[e];if(o===void 0)o={knownActions:[t],actionByRoot:{}},t._byClipCacheIndex=0,r[e]=o;else{let a=o.knownActions;t._byClipCacheIndex=a.length,a.push(t)}t._cacheIndex=i.length,i.push(t),o.actionByRoot[n]=t}_removeInactiveAction(t){let e=this._actions,n=e[e.length-1],i=t._cacheIndex;n._cacheIndex=i,e[i]=n,e.pop(),t._cacheIndex=null;let r=t._clip.uuid,o=this._actionsByClip,a=o[r],c=a.knownActions,l=c[c.length-1],h=t._byClipCacheIndex;l._byClipCacheIndex=h,c[h]=l,c.pop(),t._byClipCacheIndex=null;let u=a.actionByRoot,d=(t._localRoot||this._root).uuid;delete u[d],c.length===0&&delete o[r],this._removeInactiveBindingsForAction(t)}_removeInactiveBindingsForAction(t){let e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){let r=e[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(t){let e=this._actions,n=t._cacheIndex,i=this._nActiveActions++,r=e[i];t._cacheIndex=i,e[i]=t,r._cacheIndex=n,e[n]=r}_takeBackAction(t){let e=this._actions,n=t._cacheIndex,i=--this._nActiveActions,r=e[i];t._cacheIndex=i,e[i]=t,r._cacheIndex=n,e[n]=r}_addInactiveBinding(t,e,n){let i=this._bindingsByRootAndName,r=this._bindings,o=i[e];o===void 0&&(o={},i[e]=o),o[n]=t,t._cacheIndex=r.length,r.push(t)}_removeInactiveBinding(t){let e=this._bindings,n=t.binding,i=n.rootNode.uuid,r=n.path,o=this._bindingsByRootAndName,a=o[i],c=e[e.length-1],l=t._cacheIndex;c._cacheIndex=l,e[l]=c,e.pop(),delete a[r],Object.keys(a).length===0&&delete o[i]}_lendBinding(t){let e=this._bindings,n=t._cacheIndex,i=this._nActiveBindings++,r=e[i];t._cacheIndex=i,e[i]=t,r._cacheIndex=n,e[n]=r}_takeBackBinding(t){let e=this._bindings,n=t._cacheIndex,i=--this._nActiveBindings,r=e[i];t._cacheIndex=i,e[i]=t,r._cacheIndex=n,e[n]=r}_lendControlInterpolant(){let t=this._controlInterpolants,e=this._nActiveControlInterpolants++,n=t[e];return n===void 0&&(n=new Ia(new Float32Array(2),new Float32Array(2),1,pv),n.__cacheIndex=e,t[e]=n),n}_takeBackControlInterpolant(t){let e=this._controlInterpolants,n=t.__cacheIndex,i=--this._nActiveControlInterpolants,r=e[i];t.__cacheIndex=i,e[i]=t,r.__cacheIndex=n,e[n]=r}clipAction(t,e,n){let i=e||this._root,r=i.uuid,o=typeof t=="string"?Qs.findByName(i,t):t,a=o!==null?o.uuid:t,c=this._actionsByClip[a],l=null;if(n===void 0&&(o!==null?n=o.blendMode:n=Kh),c!==void 0){let u=c.actionByRoot[r];if(u!==void 0&&u.blendMode===n)return u;l=c.knownActions[0],o===null&&(o=l._clip)}if(o===null)return null;let h=new Ch(this,o,e,n);return this._bindAction(h,l),this._addInactiveAction(h,a,r),h}existingAction(t,e){let n=e||this._root,i=n.uuid,r=typeof t=="string"?Qs.findByName(n,t):t,o=r?r.uuid:t,a=this._actionsByClip[o];return a!==void 0&&a.actionByRoot[i]||null}stopAllAction(){let t=this._actions,e=this._nActiveActions;for(let n=e-1;n>=0;--n)t[n].stop();return this}update(t){t*=this.timeScale;let e=this._actions,n=this._nActiveActions,i=this.time+=t,r=Math.sign(t),o=this._accuIndex^=1;for(let l=0;l!==n;++l)e[l]._update(i,t,r,o);let a=this._bindings,c=this._nActiveBindings;for(let l=0;l!==c;++l)a[l].apply(o);return this}setTime(t){this.time=0;for(let e=0;e<this._actions.length;e++)this._actions[e].time=0;return this.update(t)}getRoot(){return this._root}uncacheClip(t){let e=this._actions,n=t.uuid,i=this._actionsByClip,r=i[n];if(r!==void 0){let o=r.knownActions;for(let a=0,c=o.length;a!==c;++a){let l=o[a];this._deactivateAction(l);let h=l._cacheIndex,u=e[e.length-1];l._cacheIndex=null,l._byClipCacheIndex=null,u._cacheIndex=h,e[h]=u,e.pop(),this._removeInactiveBindingsForAction(l)}delete i[n]}}uncacheRoot(t){let e=t.uuid,n=this._actionsByClip;for(let o in n){let a=n[o].actionByRoot,c=a[e];c!==void 0&&(this._deactivateAction(c),this._removeInactiveAction(c))}let i=this._bindingsByRootAndName,r=i[e];if(r!==void 0)for(let o in r){let a=r[o];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(t,e){let n=this.existingAction(t,e);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};var Uf=new Et,tr=class{constructor(t,e,n=0,i=1/0){this.ray=new Qi(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new Br,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Uf.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Uf),this}intersectObject(t,e=!0,n=[]){return Ph(t,this,n,e),n.sort(Of),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)Ph(t[i],this,n,e);return n.sort(Of),n}};function Of(s,t){return s.distance-t.distance}function Ph(s,t,e,n){let i=!0;if(s.layers.test(t.layers)&&s.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){let r=s.children;for(let o=0,a=r.length;o<a;o++)Ph(r[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ih}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ih);function eu(s,t){if(t===$f)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(t===Qr||t===Va){let e=s.getIndex();if(e===null){let o=[],a=s.getAttribute("position");if(a!==void 0){for(let c=0;c<a.count;c++)o.push(c);s.setIndex(o),e=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}let n=e.count-2,i=[];if(t===Qr)for(let o=1;o<=n;o++)i.push(e.getX(0)),i.push(e.getX(o)),i.push(e.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(i.push(e.getX(o)),i.push(e.getX(o+1)),i.push(e.getX(o+2))):(i.push(e.getX(o+2)),i.push(e.getX(o+1)),i.push(e.getX(o)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let r=s.clone();return r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",t),s}var Ka=class extends hi{constructor(t){super(t),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(e){return new cu(e)}),this.register(function(e){return new lu(e)}),this.register(function(e){return new _u(e)}),this.register(function(e){return new xu(e)}),this.register(function(e){return new wu(e)}),this.register(function(e){return new uu(e)}),this.register(function(e){return new du(e)}),this.register(function(e){return new fu(e)}),this.register(function(e){return new pu(e)}),this.register(function(e){return new au(e)}),this.register(function(e){return new mu(e)}),this.register(function(e){return new hu(e)}),this.register(function(e){return new yu(e)}),this.register(function(e){return new gu(e)}),this.register(function(e){return new ru(e)}),this.register(function(e){return new vu(e)}),this.register(function(e){return new Mu(e)})}load(t,e,n,i){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let l=Li.extractUrlBase(t);o=Li.resolveURL(l,this.path)}else o=Li.extractUrlBase(t);this.manager.itemStart(t);let a=function(l){i?i(l):console.error(l),r.manager.itemError(t),r.manager.itemEnd(t)},c=new Yr(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(t,function(l){try{r.parse(l,o,function(h){e(h),r.manager.itemEnd(t)},a)}catch(h){a(h)}},n,a)}setDRACOLoader(t){return this.dracoLoader=t,this}setKTX2Loader(t){return this.ktx2Loader=t,this}setMeshoptDecoder(t){return this.meshoptDecoder=t,this}register(t){return this.pluginCallbacks.indexOf(t)===-1&&this.pluginCallbacks.push(t),this}unregister(t){return this.pluginCallbacks.indexOf(t)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(t),1),this}parse(t,e,n,i){let r,o={},a={},c=new TextDecoder;if(typeof t=="string")r=JSON.parse(t);else if(t instanceof ArrayBuffer)if(c.decode(new Uint8Array(t,0,4))===wp){try{o[Kt.KHR_BINARY_GLTF]=new bu(t)}catch(u){i&&i(u);return}r=JSON.parse(o[Kt.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(t));else r=t;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let l=new ku(r,{path:e||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let u=this.pluginCallbacks[h](l);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[u.name]=u,o[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){let u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case Kt.KHR_MATERIALS_UNLIT:o[u]=new ou;break;case Kt.KHR_DRACO_MESH_COMPRESSION:o[u]=new Su(r,this.dracoLoader);break;case Kt.KHR_TEXTURE_TRANSFORM:o[u]=new Au;break;case Kt.KHR_MESH_QUANTIZATION:o[u]=new Tu;break;default:d.indexOf(u)>=0&&a[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}l.setExtensions(o),l.setPlugins(a),l.parse(n,i)}parseAsync(t,e){let n=this;return new Promise(function(i,r){n.parse(t,e,i,r)})}};function mv(){let s={};return{get:function(t){return s[t]},add:function(t,e){s[t]=e},remove:function(t){delete s[t]},removeAll:function(){s={}}}}var Kt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},ru=class{constructor(t){this.parser=t,this.name=Kt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let t=this.parser,e=this.parser.json.nodes||[];for(let n=0,i=e.length;n<i;n++){let r=e[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&t._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(t){let e=this.parser,n="light:"+t,i=e.cache.get(n);if(i)return i;let r=e.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[t],l,h=new tt(16777215);c.color!==void 0&&h.setRGB(c.color[0],c.color[1],c.color[2],Be);let u=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new rs(h),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new mn(h),l.distance=u;break;case"spot":l=new Ua(h),l.distance=u,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),l.decay=2,ui(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=e.createUniqueName(c.name||"light_"+t),i=Promise.resolve(l),e.cache.add(n,i),i}getDependency(t,e){if(t==="light")return this._loadLight(e)}createNodeAttachment(t){let e=this,n=this.parser,r=n.json.nodes[t],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(c){return n._getNodeRef(e.cache,a,c)})}},ou=class{constructor(){this.name=Kt.KHR_MATERIALS_UNLIT}getMaterialType(){return ne}extendParams(t,e,n){let i=[];t.color=new tt(1,1,1),t.opacity=1;let r=e.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;t.color.setRGB(o[0],o[1],o[2],Be),t.opacity=o[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(t,"map",r.baseColorTexture,Vt))}return Promise.all(i)}},au=class{constructor(t){this.parser=t,this.name=Kt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(t,e){let i=this.parser.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name].emissiveStrength;return r!==void 0&&(e.emissiveIntensity=r),Promise.resolve()}},cu=class{constructor(t){this.parser=t,this.name=Kt.KHR_MATERIALS_CLEARCOAT}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:pn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];if(o.clearcoatFactor!==void 0&&(e.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&r.push(n.assignTexture(e,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(e.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&r.push(n.assignTexture(e,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(r.push(n.assignTexture(e,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){let a=o.clearcoatNormalTexture.scale;e.clearcoatNormalScale=new ot(a,a)}return Promise.all(r)}},lu=class{constructor(t){this.parser=t,this.name=Kt.KHR_MATERIALS_DISPERSION}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:pn}extendMaterialParams(t,e){let i=this.parser.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name];return e.dispersion=r.dispersion!==void 0?r.dispersion:0,Promise.resolve()}},hu=class{constructor(t){this.parser=t,this.name=Kt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:pn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.iridescenceFactor!==void 0&&(e.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&r.push(n.assignTexture(e,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(e.iridescenceIOR=o.iridescenceIor),e.iridescenceThicknessRange===void 0&&(e.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(e.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(e.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&r.push(n.assignTexture(e,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(r)}},uu=class{constructor(t){this.parser=t,this.name=Kt.KHR_MATERIALS_SHEEN}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:pn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[];e.sheenColor=new tt(0,0,0),e.sheenRoughness=0,e.sheen=1;let o=i.extensions[this.name];if(o.sheenColorFactor!==void 0){let a=o.sheenColorFactor;e.sheenColor.setRGB(a[0],a[1],a[2],Be)}return o.sheenRoughnessFactor!==void 0&&(e.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&r.push(n.assignTexture(e,"sheenColorMap",o.sheenColorTexture,Vt)),o.sheenRoughnessTexture!==void 0&&r.push(n.assignTexture(e,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(r)}},du=class{constructor(t){this.parser=t,this.name=Kt.KHR_MATERIALS_TRANSMISSION}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:pn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.transmissionFactor!==void 0&&(e.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&r.push(n.assignTexture(e,"transmissionMap",o.transmissionTexture)),Promise.all(r)}},fu=class{constructor(t){this.parser=t,this.name=Kt.KHR_MATERIALS_VOLUME}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:pn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];e.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&r.push(n.assignTexture(e,"thicknessMap",o.thicknessTexture)),e.attenuationDistance=o.attenuationDistance||1/0;let a=o.attenuationColor||[1,1,1];return e.attenuationColor=new tt().setRGB(a[0],a[1],a[2],Be),Promise.all(r)}},pu=class{constructor(t){this.parser=t,this.name=Kt.KHR_MATERIALS_IOR}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:pn}extendMaterialParams(t,e){let i=this.parser.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name];return e.ior=r.ior!==void 0?r.ior:1.5,Promise.resolve()}},mu=class{constructor(t){this.parser=t,this.name=Kt.KHR_MATERIALS_SPECULAR}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:pn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];e.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&r.push(n.assignTexture(e,"specularIntensityMap",o.specularTexture));let a=o.specularColorFactor||[1,1,1];return e.specularColor=new tt().setRGB(a[0],a[1],a[2],Be),o.specularColorTexture!==void 0&&r.push(n.assignTexture(e,"specularColorMap",o.specularColorTexture,Vt)),Promise.all(r)}},gu=class{constructor(t){this.parser=t,this.name=Kt.EXT_MATERIALS_BUMP}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:pn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return e.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&r.push(n.assignTexture(e,"bumpMap",o.bumpTexture)),Promise.all(r)}},yu=class{constructor(t){this.parser=t,this.name=Kt.KHR_MATERIALS_ANISOTROPY}getMaterialType(t){let n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:pn}extendMaterialParams(t,e){let n=this.parser,i=n.json.materials[t];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.anisotropyStrength!==void 0&&(e.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(e.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&r.push(n.assignTexture(e,"anisotropyMap",o.anisotropyTexture)),Promise.all(r)}},_u=class{constructor(t){this.parser=t,this.name=Kt.KHR_TEXTURE_BASISU}loadTexture(t){let e=this.parser,n=e.json,i=n.textures[t];if(!i.extensions||!i.extensions[this.name])return null;let r=i.extensions[this.name],o=e.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return e.loadTextureImage(t,r.source,o)}},xu=class{constructor(t){this.parser=t,this.name=Kt.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(t){let e=this.name,n=this.parser,i=n.json,r=i.textures[t];if(!r.extensions||!r.extensions[e])return null;let o=r.extensions[e],a=i.images[o.source],c=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(t,o.source,c);if(i.extensionsRequired&&i.extensionsRequired.indexOf(e)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return n.loadTexture(t)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(t){let e=new Image;e.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",e.onload=e.onerror=function(){t(e.height===1)}})),this.isSupported}},wu=class{constructor(t){this.parser=t,this.name=Kt.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(t){let e=this.name,n=this.parser,i=n.json,r=i.textures[t];if(!r.extensions||!r.extensions[e])return null;let o=r.extensions[e],a=i.images[o.source],c=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(t,o.source,c);if(i.extensionsRequired&&i.extensionsRequired.indexOf(e)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return n.loadTexture(t)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(t){let e=new Image;e.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",e.onload=e.onerror=function(){t(e.height===1)}})),this.isSupported}},vu=class{constructor(t){this.name=Kt.EXT_MESHOPT_COMPRESSION,this.parser=t}loadBufferView(t){let e=this.parser.json,n=e.bufferViews[t];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(e.extensionsRequired&&e.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){let c=i.byteOffset||0,l=i.byteLength||0,h=i.count,u=i.byteStride,d=new Uint8Array(a,c,l);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(h,u,d,i.mode,i.filter).then(function(f){return f.buffer}):o.ready.then(function(){let f=new ArrayBuffer(h*u);return o.decodeGltfBuffer(new Uint8Array(f),h,u,d,i.mode,i.filter),f})})}else return null}},Mu=class{constructor(t){this.name=Kt.EXT_MESH_GPU_INSTANCING,this.parser=t}createNodeMesh(t){let e=this.parser.json,n=e.nodes[t];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=e.meshes[n.mesh];for(let l of i.primitives)if(l.mode!==An.TRIANGLES&&l.mode!==An.TRIANGLE_STRIP&&l.mode!==An.TRIANGLE_FAN&&l.mode!==void 0)return null;let o=n.extensions[this.name].attributes,a=[],c={};for(let l in o)a.push(this.parser.getDependency("accessor",o[l]).then(h=>(c[l]=h,c[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(t)),Promise.all(a).then(l=>{let h=l.pop(),u=h.isGroup?h.children:[h],d=l[0].count,f=[];for(let p of u){let y=new Et,m=new S,g=new Ft,x=new S(1,1,1),_=new Ne(p.geometry,p.material,d);for(let v=0;v<d;v++)c.TRANSLATION&&m.fromBufferAttribute(c.TRANSLATION,v),c.ROTATION&&g.fromBufferAttribute(c.ROTATION,v),c.SCALE&&x.fromBufferAttribute(c.SCALE,v),_.setMatrixAt(v,y.compose(m,g,x));for(let v in c)if(v==="_COLOR_0"){let k=c[v];_.instanceColor=new es(k.array,k.itemSize,k.normalized)}else v!=="TRANSLATION"&&v!=="ROTATION"&&v!=="SCALE"&&p.geometry.setAttribute(v,c[v]);fe.prototype.copy.call(_,p),this.parser.assignFinalMaterial(_),f.push(_)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}},wp="glTF",to=12,gp={JSON:1313821514,BIN:5130562},bu=class{constructor(t){this.name=Kt.KHR_BINARY_GLTF,this.content=null,this.body=null;let e=new DataView(t,0,to),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(t.slice(0,4))),version:e.getUint32(4,!0),length:e.getUint32(8,!0)},this.header.magic!==wp)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-to,r=new DataView(t,to),o=0;for(;o<i;){let a=r.getUint32(o,!0);o+=4;let c=r.getUint32(o,!0);if(o+=4,c===gp.JSON){let l=new Uint8Array(t,to+o,a);this.content=n.decode(l)}else if(c===gp.BIN){let l=to+o;this.body=t.slice(l,l+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Su=class{constructor(t,e){if(!e)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Kt.KHR_DRACO_MESH_COMPRESSION,this.json=t,this.dracoLoader=e,this.dracoLoader.preload()}decodePrimitive(t,e){let n=this.json,i=this.dracoLoader,r=t.extensions[this.name].bufferView,o=t.extensions[this.name].attributes,a={},c={},l={};for(let h in o){let u=zu[h]||h.toLowerCase();a[u]=o[h]}for(let h in t.attributes){let u=zu[h]||h.toLowerCase();if(o[h]!==void 0){let d=n.accessors[t.attributes[h]],f=nr[d.componentType];l[u]=f.name,c[u]=d.normalized===!0}}return e.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){i.decodeDracoFile(h,function(f){for(let p in f.attributes){let y=f.attributes[p],m=c[p];m!==void 0&&(y.normalized=m)}u(f)},a,l,Be,d)})})}},Au=class{constructor(){this.name=Kt.KHR_TEXTURE_TRANSFORM}extendTexture(t,e){return(e.texCoord===void 0||e.texCoord===t.channel)&&e.offset===void 0&&e.rotation===void 0&&e.scale===void 0||(t=t.clone(),e.texCoord!==void 0&&(t.channel=e.texCoord),e.offset!==void 0&&t.offset.fromArray(e.offset),e.rotation!==void 0&&(t.rotation=e.rotation),e.scale!==void 0&&t.repeat.fromArray(e.scale),t.needsUpdate=!0),t}},Tu=class{constructor(){this.name=Kt.KHR_MESH_QUANTIZATION}},ja=class extends Ci{constructor(t,e,n,i){super(t,e,n,i)}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i*3+i;for(let o=0;o!==i;o++)e[o]=n[r+o];return e}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=a*2,l=a*3,h=i-e,u=(n-e)/h,d=u*u,f=d*u,p=t*l,y=p-l,m=-2*f+3*d,g=f-d,x=1-m,_=g-d+u;for(let v=0;v!==a;v++){let k=o[y+v+a],M=o[y+v+c]*h,T=o[p+v+a],R=o[p+v]*h;r[v]=x*k+_*M+m*T+g*R}return r}},gv=new Ft,Eu=class extends ja{interpolate_(t,e,n,i){let r=super.interpolate_(t,e,n,i);return gv.fromArray(r).normalize().toArray(r),r}},An={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},nr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},yp={9728:Ke,9729:rn,9984:Uh,9985:Rr,9986:Rs,9987:On},_p={33071:ti,33648:Ur,10497:Bn},nu={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},zu={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Di={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},yv={CUBICSPLINE:void 0,LINEAR:Ws,STEP:Gs},iu={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function _v(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new Js({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Fn})),s.DefaultMaterial}function os(s,t,e){for(let n in e.extensions)s[n]===void 0&&(t.userData.gltfExtensions=t.userData.gltfExtensions||{},t.userData.gltfExtensions[n]=e.extensions[n])}function ui(s,t){t.extras!==void 0&&(typeof t.extras=="object"?Object.assign(s.userData,t.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+t.extras))}function xv(s,t,e){let n=!1,i=!1,r=!1;for(let l=0,h=t.length;l<h;l++){let u=t[l];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);let o=[],a=[],c=[];for(let l=0,h=t.length;l<h;l++){let u=t[l];if(n){let d=u.POSITION!==void 0?e.getDependency("accessor",u.POSITION):s.attributes.position;o.push(d)}if(i){let d=u.NORMAL!==void 0?e.getDependency("accessor",u.NORMAL):s.attributes.normal;a.push(d)}if(r){let d=u.COLOR_0!==void 0?e.getDependency("accessor",u.COLOR_0):s.attributes.color;c.push(d)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c)]).then(function(l){let h=l[0],u=l[1],d=l[2];return n&&(s.morphAttributes.position=h),i&&(s.morphAttributes.normal=u),r&&(s.morphAttributes.color=d),s.morphTargetsRelative=!0,s})}function wv(s,t){if(s.updateMorphTargets(),t.weights!==void 0)for(let e=0,n=t.weights.length;e<n;e++)s.morphTargetInfluences[e]=t.weights[e];if(t.extras&&Array.isArray(t.extras.targetNames)){let e=t.extras.targetNames;if(s.morphTargetInfluences.length===e.length){s.morphTargetDictionary={};for(let n=0,i=e.length;n<i;n++)s.morphTargetDictionary[e[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function vv(s){let t,e=s.extensions&&s.extensions[Kt.KHR_DRACO_MESH_COMPRESSION];if(e?t="draco:"+e.bufferView+":"+e.indices+":"+su(e.attributes):t=s.indices+":"+su(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)t+=":"+su(s.targets[n]);return t}function su(s){let t="",e=Object.keys(s).sort();for(let n=0,i=e.length;n<i;n++)t+=e[n]+":"+s[e[n]]+";";return t}function Ru(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Mv(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":"image/png"}var bv=new Et,ku=class{constructor(t={},e={}){this.json=t,this.extensions={},this.plugins={},this.options=e,this.cache=new mv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,o=-1;if(typeof navigator<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let c=a.match(/Version\/(\d+)/);i=n&&c?parseInt(c[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||r&&o<98?this.textureLoader=new Da(this.options.manager):this.textureLoader=new Fa(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Yr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(t){this.extensions=t}setPlugins(t){this.plugins=t}parse(t,e){let n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let a={scene:o[0][i.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:i.asset,parser:n,userData:{}};return os(r,a,i),ui(a,i),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(a)})).then(function(){for(let c of a.scenes)c.updateMatrixWorld();t(a)})}).catch(e)}_markDefs(){let t=this.json.nodes||[],e=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=e.length;i<r;i++){let o=e[i].joints;for(let a=0,c=o.length;a<c;a++)t[o[a]].isBone=!0}for(let i=0,r=t.length;i<r;i++){let o=t[i];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(t,e){e!==void 0&&(t.refs[e]===void 0&&(t.refs[e]=t.uses[e]=0),t.refs[e]++)}_getNodeRef(t,e,n){if(t.refs[e]<=1)return n;let i=n.clone(),r=(o,a)=>{let c=this.associations.get(o);c!=null&&this.associations.set(a,c);for(let[l,h]of o.children.entries())r(h,a.children[l])};return r(n,i),i.name+="_instance_"+t.uses[e]++,i}_invokeOne(t){let e=Object.values(this.plugins);e.push(this);for(let n=0;n<e.length;n++){let i=t(e[n]);if(i)return i}return null}_invokeAll(t){let e=Object.values(this.plugins);e.unshift(this);let n=[];for(let i=0;i<e.length;i++){let r=t(e[i]);r&&n.push(r)}return n}getDependency(t,e){let n=t+":"+e,i=this.cache.get(n);if(!i){switch(t){case"scene":i=this.loadScene(e);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(e)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(e)});break;case"accessor":i=this.loadAccessor(e);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(e)});break;case"buffer":i=this.loadBuffer(e);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(e)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(e)});break;case"skin":i=this.loadSkin(e);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(e)});break;case"camera":i=this.loadCamera(e);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(t,e)}),!i)throw new Error("Unknown type: "+t);break}this.cache.add(n,i)}return i}getDependencies(t){let e=this.cache.get(t);if(!e){let n=this,i=this.json[t+(t==="mesh"?"es":"s")]||[];e=Promise.all(i.map(function(r,o){return n.getDependency(t,o)})),this.cache.add(t,e)}return e}loadBuffer(t){let e=this.json.buffers[t],n=this.fileLoader;if(e.type&&e.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+e.type+" buffer type is not supported.");if(e.uri===void 0&&t===0)return Promise.resolve(this.extensions[Kt.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(r,o){n.load(Li.resolveURL(e.uri,i.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+e.uri+'".'))})})}loadBufferView(t){let e=this.json.bufferViews[t];return this.getDependency("buffer",e.buffer).then(function(n){let i=e.byteLength||0,r=e.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(t){let e=this,n=this.json,i=this.json.accessors[t];if(i.bufferView===void 0&&i.sparse===void 0){let o=nu[i.type],a=nr[i.componentType],c=i.normalized===!0,l=new a(i.count*o);return Promise.resolve(new Ce(l,o,c))}let r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(o){let a=o[0],c=nu[i.type],l=nr[i.componentType],h=l.BYTES_PER_ELEMENT,u=h*c,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,p=i.normalized===!0,y,m;if(f&&f!==u){let g=Math.floor(d/f),x="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+g+":"+i.count,_=e.cache.get(x);_||(y=new l(a,g*f,i.count*f/h),_=new qs(y,f/h),e.cache.add(x,_)),m=new ts(_,c,d%f/h,p)}else a===null?y=new l(i.count*c):y=new l(a,d,i.count*c),m=new Ce(y,c,p);if(i.sparse!==void 0){let g=nu.SCALAR,x=nr[i.sparse.indices.componentType],_=i.sparse.indices.byteOffset||0,v=i.sparse.values.byteOffset||0,k=new x(o[1],_,i.sparse.count*g),M=new l(o[2],v,i.sparse.count*c);a!==null&&(m=new Ce(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let T=0,R=k.length;T<R;T++){let P=k[T];if(m.setX(P,M[T*c]),c>=2&&m.setY(P,M[T*c+1]),c>=3&&m.setZ(P,M[T*c+2]),c>=4&&m.setW(P,M[T*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=p}return m})}loadTexture(t){let e=this.json,n=this.options,r=e.textures[t].source,o=e.images[r],a=this.textureLoader;if(o.uri){let c=n.manager.getHandler(o.uri);c!==null&&(a=c)}return this.loadTextureImage(t,r,a)}loadTextureImage(t,e,n){let i=this,r=this.json,o=r.textures[t],a=r.images[e],c=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[c])return this.textureCache[c];let l=this.loadImageSource(e,n).then(function(h){h.flipY=!1,h.name=o.name||a.name||"",h.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(h.name=a.uri);let d=(r.samplers||{})[o.sampler]||{};return h.magFilter=yp[d.magFilter]||rn,h.minFilter=yp[d.minFilter]||On,h.wrapS=_p[d.wrapS]||Bn,h.wrapT=_p[d.wrapT]||Bn,i.associations.set(h,{textures:t}),h}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(t,e){let n=this,i=this.json,r=this.options;if(this.sourceCache[t]!==void 0)return this.sourceCache[t].then(u=>u.clone());let o=i.images[t],a=self.URL||self.webkitURL,c=o.uri||"",l=!1;if(o.bufferView!==void 0)c=n.getDependency("bufferView",o.bufferView).then(function(u){l=!0;let d=new Blob([u],{type:o.mimeType});return c=a.createObjectURL(d),c});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+t+" is missing URI and bufferView");let h=Promise.resolve(c).then(function(u){return new Promise(function(d,f){let p=d;e.isImageBitmapLoader===!0&&(p=function(y){let m=new Fe(y);m.needsUpdate=!0,d(m)}),e.load(Li.resolveURL(u,r.path),p,void 0,f)})}).then(function(u){return l===!0&&a.revokeObjectURL(c),ui(u,o),u.userData.mimeType=o.mimeType||Mv(o.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),u});return this.sourceCache[t]=h,h}assignTexture(t,e,n,i){let r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[Kt.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[Kt.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let c=r.associations.get(o);o=r.extensions[Kt.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,c)}}return i!==void 0&&(o.colorSpace=i),t[e]=o,o})}assignFinalMaterial(t){let e=t.geometry,n=t.material,i=e.attributes.tangent===void 0,r=e.attributes.color!==void 0,o=e.attributes.normal===void 0;if(t.isPoints){let a="PointsMaterial:"+n.uuid,c=this.cache.get(a);c||(c=new ns,Je.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(a,c)),n=c}else if(t.isLine){let a="LineBasicMaterial:"+n.uuid,c=this.cache.get(a);c||(c=new Gr,Je.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(a,c)),n=c}if(i||r||o){let a="ClonedMaterial:"+n.uuid+":";i&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let c=this.cache.get(a);c||(c=n.clone(),r&&(c.vertexColors=!0),o&&(c.flatShading=!0),i&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(a,c),this.associations.set(c,this.associations.get(n))),n=c}t.material=n}getMaterialType(){return Js}loadMaterial(t){let e=this,n=this.json,i=this.extensions,r=n.materials[t],o,a={},c=r.extensions||{},l=[];if(c[Kt.KHR_MATERIALS_UNLIT]){let u=i[Kt.KHR_MATERIALS_UNLIT];o=u.getMaterialType(),l.push(u.extendParams(a,r,e))}else{let u=r.pbrMetallicRoughness||{};if(a.color=new tt(1,1,1),a.opacity=1,Array.isArray(u.baseColorFactor)){let d=u.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],Be),a.opacity=d[3]}u.baseColorTexture!==void 0&&l.push(e.assignTexture(a,"map",u.baseColorTexture,Vt)),a.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,a.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(l.push(e.assignTexture(a,"metalnessMap",u.metallicRoughnessTexture)),l.push(e.assignTexture(a,"roughnessMap",u.metallicRoughnessTexture))),o=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(t)}),l.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(t,a)})))}r.doubleSided===!0&&(a.side=de);let h=r.alphaMode||iu.OPAQUE;if(h===iu.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,h===iu.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==ne&&(l.push(e.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new ot(1,1),r.normalTexture.scale!==void 0)){let u=r.normalTexture.scale;a.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&o!==ne&&(l.push(e.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==ne){let u=r.emissiveFactor;a.emissive=new tt().setRGB(u[0],u[1],u[2],Be)}return r.emissiveTexture!==void 0&&o!==ne&&l.push(e.assignTexture(a,"emissiveMap",r.emissiveTexture,Vt)),Promise.all(l).then(function(){let u=new o(a);return r.name&&(u.name=r.name),ui(u,r),e.associations.set(u,{materials:t}),r.extensions&&os(i,u,r),u})}createUniqueName(t){let e=le.sanitizeNodeName(t||"");return e in this.nodeNamesUsed?e+"_"+ ++this.nodeNamesUsed[e]:(this.nodeNamesUsed[e]=0,e)}loadGeometries(t){let e=this,n=this.extensions,i=this.primitiveCache;function r(a){return n[Kt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,e).then(function(c){return xp(c,a,e)})}let o=[];for(let a=0,c=t.length;a<c;a++){let l=t[a],h=vv(l),u=i[h];if(u)o.push(u.promise);else{let d;l.extensions&&l.extensions[Kt.KHR_DRACO_MESH_COMPRESSION]?d=r(l):d=xp(new Gt,l,e),i[h]={primitive:l,promise:d},o.push(d)}}return Promise.all(o)}loadMesh(t){let e=this,n=this.json,i=this.extensions,r=n.meshes[t],o=r.primitives,a=[];for(let c=0,l=o.length;c<l;c++){let h=o[c].material===void 0?_v(this.cache):this.getDependency("material",o[c].material);a.push(h)}return a.push(e.loadGeometries(o)),Promise.all(a).then(function(c){let l=c.slice(0,c.length-1),h=c[c.length-1],u=[];for(let f=0,p=h.length;f<p;f++){let y=h[f],m=o[f],g,x=l[f];if(m.mode===An.TRIANGLES||m.mode===An.TRIANGLE_STRIP||m.mode===An.TRIANGLE_FAN||m.mode===void 0)g=r.isSkinnedMesh===!0?new _a(y,x):new At(y,x),g.isSkinnedMesh===!0&&g.normalizeSkinWeights(),m.mode===An.TRIANGLE_STRIP?g.geometry=eu(g.geometry,Va):m.mode===An.TRIANGLE_FAN&&(g.geometry=eu(g.geometry,Qr));else if(m.mode===An.LINES)g=new ba(y,x);else if(m.mode===An.LINE_STRIP)g=new Ys(y,x);else if(m.mode===An.LINE_LOOP)g=new Sa(y,x);else if(m.mode===An.POINTS)g=new Zs(y,x);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(g.geometry.morphAttributes).length>0&&wv(g,r),g.name=e.createUniqueName(r.name||"mesh_"+t),ui(g,r),m.extensions&&os(i,g,m),e.assignFinalMaterial(g),u.push(g)}for(let f=0,p=u.length;f<p;f++)e.associations.set(u[f],{meshes:t,primitives:f});if(u.length===1)return r.extensions&&os(i,u[0],r),u[0];let d=new it;r.extensions&&os(i,d,r),e.associations.set(d,{meshes:t});for(let f=0,p=u.length;f<p;f++)d.add(u[f]);return d})}loadCamera(t){let e,n=this.json.cameras[t],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?e=new Ve(tp.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(e=new Ri(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(e.name=this.createUniqueName(n.name)),ui(e,n),Promise.resolve(e)}loadSkin(t){let e=this.json.skins[t],n=[];for(let i=0,r=e.joints.length;i<r;i++)n.push(this._loadNodeShallow(e.joints[i]));return e.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",e.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let r=i.pop(),o=i,a=[],c=[];for(let l=0,h=o.length;l<h;l++){let u=o[l];if(u){a.push(u);let d=new Et;r!==null&&d.fromArray(r.array,l*16),c.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',e.joints[l])}return new wa(a,c)})}loadAnimation(t){let e=this.json,n=this,i=e.animations[t],r=i.name?i.name:"animation_"+t,o=[],a=[],c=[],l=[],h=[];for(let u=0,d=i.channels.length;u<d;u++){let f=i.channels[u],p=i.samplers[f.sampler],y=f.target,m=y.node,g=i.parameters!==void 0?i.parameters[p.input]:p.input,x=i.parameters!==void 0?i.parameters[p.output]:p.output;y.node!==void 0&&(o.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",g)),c.push(this.getDependency("accessor",x)),l.push(p),h.push(y))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(l),Promise.all(h)]).then(function(u){let d=u[0],f=u[1],p=u[2],y=u[3],m=u[4],g=[];for(let x=0,_=d.length;x<_;x++){let v=d[x],k=f[x],M=p[x],T=y[x],R=m[x];if(v===void 0)continue;v.updateMatrix&&v.updateMatrix();let P=n._createAnimationTracks(v,k,M,T,R);if(P)for(let w=0;w<P.length;w++)g.push(P[w])}return new Qs(r,void 0,g)})}createNodeMesh(t){let e=this.json,n=this,i=e.nodes[t];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){let o=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let c=0,l=i.weights.length;c<l;c++)a.morphTargetInfluences[c]=i.weights[c]}),o})}loadNode(t){let e=this.json,n=this,i=e.nodes[t],r=n._loadNodeShallow(t),o=[],a=i.children||[];for(let l=0,h=a.length;l<h;l++)o.push(n.getDependency("node",a[l]));let c=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(o),c]).then(function(l){let h=l[0],u=l[1],d=l[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,bv)});for(let f=0,p=u.length;f<p;f++)h.add(u[f]);return h})}_loadNodeShallow(t){let e=this.json,n=this.extensions,i=this;if(this.nodeCache[t]!==void 0)return this.nodeCache[t];let r=e.nodes[t],o=r.name?i.createUniqueName(r.name):"",a=[],c=i._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(t)});return c&&a.push(c),r.camera!==void 0&&a.push(i.getDependency("camera",r.camera).then(function(l){return i._getNodeRef(i.cameraCache,r.camera,l)})),i._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(t)}).forEach(function(l){a.push(l)}),this.nodeCache[t]=Promise.all(a).then(function(l){let h;if(r.isBone===!0?h=new Vr:l.length>1?h=new it:l.length===1?h=l[0]:h=new fe,h!==l[0])for(let u=0,d=l.length;u<d;u++)h.add(l[u]);if(r.name&&(h.userData.name=r.name,h.name=o),ui(h,r),r.extensions&&os(n,h,r),r.matrix!==void 0){let u=new Et;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);return i.associations.has(h)||i.associations.set(h,{}),i.associations.get(h).nodes=t,h}),this.nodeCache[t]}loadScene(t){let e=this.extensions,n=this.json.scenes[t],i=this,r=new it;n.name&&(r.name=i.createUniqueName(n.name)),ui(r,n),n.extensions&&os(e,r,n);let o=n.nodes||[],a=[];for(let c=0,l=o.length;c<l;c++)a.push(i.getDependency("node",o[c]));return Promise.all(a).then(function(c){for(let h=0,u=c.length;h<u;h++)r.add(c[h]);let l=h=>{let u=new Map;for(let[d,f]of i.associations)(d instanceof Je||d instanceof Fe)&&u.set(d,f);return h.traverse(d=>{let f=i.associations.get(d);f!=null&&u.set(d,f)}),u};return i.associations=l(r),r})}_createAnimationTracks(t,e,n,i,r){let o=[],a=t.name?t.name:t.uuid,c=[];Di[r.path]===Di.weights?t.traverse(function(d){d.morphTargetInfluences&&c.push(d.name?d.name:d.uuid)}):c.push(a);let l;switch(Di[r.path]){case Di.weights:l=ai;break;case Di.rotation:l=ci;break;case Di.position:case Di.scale:l=li;break;default:switch(n.itemSize){case 1:l=ai;break;case 2:case 3:default:l=li;break}break}let h=i.interpolation!==void 0?yv[i.interpolation]:Ws,u=this._getArrayFromAccessor(n);for(let d=0,f=c.length;d<f;d++){let p=new l(c[d]+"."+Di[r.path],e.array,u,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(p),o.push(p)}return o}_getArrayFromAccessor(t){let e=t.array;if(t.normalized){let n=Ru(e.constructor),i=new Float32Array(e.length);for(let r=0,o=e.length;r<o;r++)i[r]=e[r]*n;e=i}return e}_createCubicSplineTrackInterpolant(t){t.createInterpolant=function(n){let i=this instanceof ci?Eu:ja;return new i(this.times,this.values,this.getValueSize()/3,n)},t.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function Sv(s,t,e){let n=t.attributes,i=new Ee;if(n.POSITION!==void 0){let a=e.json.accessors[n.POSITION],c=a.min,l=a.max;if(c!==void 0&&l!==void 0){if(i.set(new S(c[0],c[1],c[2]),new S(l[0],l[1],l[2])),a.normalized){let h=Ru(nr[a.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=t.targets;if(r!==void 0){let a=new S,c=new S;for(let l=0,h=r.length;l<h;l++){let u=r[l];if(u.POSITION!==void 0){let d=e.json.accessors[u.POSITION],f=d.min,p=d.max;if(f!==void 0&&p!==void 0){if(c.setX(Math.max(Math.abs(f[0]),Math.abs(p[0]))),c.setY(Math.max(Math.abs(f[1]),Math.abs(p[1]))),c.setZ(Math.max(Math.abs(f[2]),Math.abs(p[2]))),d.normalized){let y=Ru(nr[d.componentType]);c.multiplyScalar(y)}a.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(a)}s.boundingBox=i;let o=new un;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=o}function xp(s,t,e){let n=t.attributes,i=[];function r(o,a){return e.getDependency("accessor",o).then(function(c){s.setAttribute(a,c)})}for(let o in n){let a=zu[o]||o.toLowerCase();a in s.attributes||i.push(r(n[o],a))}if(t.indices!==void 0&&!s.index){let o=e.getDependency("accessor",t.indices).then(function(a){s.setIndex(a)});i.push(o)}return Qt.workingColorSpace!==Be&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Qt.workingColorSpace}" not supported.`),ui(s,t),Sv(s,t,e),Promise.all(i).then(function(){return t.targets!==void 0?xv(s,t.targets,e):s})}var qa=new Et,vp=new S,Mp=new S,bp=new S,Ni=class{constructor(t=9){this.R=t}naKule(t,e,n=0,i=new S){let r=Math.hypot(t,e),o=this.R;if(r<1e-9)return i.set(0,o+n,0);let a=r/o,c=t/r,l=e/r,h=Math.sin(a),u=Math.cos(a);return i.set(h*c,u,h*l).multiplyScalar(o+n)}normalna(t,e,n=new S){return this.naKule(t,e,0,n).normalize()}ramka(t,e,n=new Ft){let i=Math.hypot(t,e);if(i<1e-9)return n.identity();let r=i/this.R,o=t/i,a=e/i,c=Math.sin(r),l=Math.cos(r),h=l*o,u=-c,d=l*a,f=-a,p=o;return vp.set(o*h-a*f,o*u,o*d-a*p),bp.set(a*h+o*f,a*u,a*d+o*p),Mp.set(c*o,l,c*a),qa.makeBasis(vp,Mp,bp),n.setFromRotationMatrix(qa)}zKuli(t,e={x:0,z:0,h:0}){let n=t.length();if(n<1e-9)return e.x=0,e.z=0,e.h=-this.R,e;let i=Math.max(-1,Math.min(1,t.y/n)),r=Math.acos(i),o=Math.atan2(t.z,t.x),a=r*this.R;return e.x=a*Math.cos(o),e.z=a*Math.sin(o),e.h=n-this.R,e}ustaw(t,e,n,i=0,r=0){return this.naKule(e,n,i,t.position),this.ramka(e,n,t.quaternion),r&&t.quaternion.multiply(ir.setFromAxisAngle(Av,r)),t}obrotPodPunkt(t,e,n=new Ft){return this.ramka(t,e,n).invert()}},ir=new Ft,Av=new S(0,1,0),Ya=new S,Cu=new S;function on(s,t,e,n=new S){n.copy(t).addScaledVector(s,-t.dot(s));let i=n.length();return i>1e-6?n.divideScalar(i):n.copy(e)}function qe(s,t){s.addScaledVector(t,-s.dot(t));let e=s.length();return e>1e-6?s.divideScalar(e):s.set(1,0,0).addScaledVector(t,-t.x).normalize(),s}function Sp(s,t,e){return ir.setFromAxisAngle(t,e),s.applyQuaternion(ir)}function Pu(s,t,e){return Ya.crossVectors(s,t),Math.atan2(Ya.dot(e),s.dot(t))}function Tv(s,t,e=new Ft){return Cu.crossVectors(s,t),qa.makeBasis(Cu,s,t),e.setFromRotationMatrix(qa)}Ni.prototype.przesunPoKuli=function(s,t,e){Math.abs(e)<1e-9||(Ya.crossVectors(s,t).normalize(),ir.setFromAxisAngle(Ya,e/this.R),s.applyQuaternion(ir).normalize(),t.applyQuaternion(ir),qe(t,s))};Ni.prototype.punktObok=function(s,t,e,n=new S){n.copy(s);let i=Cu.copy(t);return this.przesunPoKuli(n,i,e),n};Ni.prototype.odleglosc=function(s,t){return this.R*Math.acos(Math.max(-1,Math.min(1,s.dot(t))))};Ni.prototype.ustawN=function(s,t,e,n=0){return s.position.copy(t).multiplyScalar(this.R+n),Tv(t,e,s.quaternion),s};function Ap(s=14){return s/(100*Math.PI/180)}function sr(s,t,e=n=>[n.x,n.y]){let n=[],i=[];for(let r of s){let[o,a]=e(r);Math.hypot(o,a)<=t?i.push(r):i.length&&(i.length>=2&&n.push(i),i=[])}return i.length>=2&&n.push(i),n}var Ev=[{od:[-12,3.5],kontrola:[-6,5.2],do:[-3.2,8.6],kroki:12},{od:[-3.2,8.6],kontrola:[-2.2,10.6],do:[-4.5,15.5],kroki:8}],zv=[[-6.2,8.6],[-4.7,6.9],[-3.2,5.2],[-1.4,4.1],[-.1,2.6],[.9,.6],[1.1,-1.4],[.5,-3.4],[0,-5.6]],Rv=[{file:"hut2",pos:[-10.6,-4.4],wysokosc:5.2,obrot:.55,promien:2.6,jasnosc:1.45}],di=(s,t)=>({id:s,file:"gwiazda",label:"Z\u0142ota gwiazdka",toast:"Z\u0142ota gwiazdka \u2014 z\u0142apana!",scale:.78,height:.95,glow:16765514,barwa:16763215,jasnosc:1.32,metalness:.3,roughness:.7,haloOpacity:.1,haloScale:.9,ringOpacity:0,lightBase:0,absorb:!0,absorbLift:1.5,respawn:12,iskry:26,iskrySila:1.6,pos:t}),kv=[{id:"czarodziej",file:"wizard",label:"Czarodziej",toast:"Czarodziej pojawi\u0142 si\u0119 w lesie",pos:[-3,4],pozycje:[[-3,4],[-7,-8],[4,3.5],[4,-8],[.5,9]],scale:3.7,height:1.3,absorbLift:2.8,animuj:!0,bezObrotu:!0,obrotY:.484,absorb:!1,raz:!0,zasieg:1.9,zbrojenie:3.4,margines:1.8,cykl:35,respawn:60,respawnPierwszy:12,glow:12093672,ringColor:14268159,jasnosc:1.6,metalness:0,roughness:.85,haloOpacity:.2,haloScale:1.7,ringOpacity:.3,lightBase:0,iskry:38,iskrySila:1.9},{id:"karty",file:"karta",label:"Gra na Pami\u0119\u0107",toast:"Gra na Pami\u0119\u0107 \u2014 dobierz pary",pos:[3,2.6],scale:1.3,height:1.15,glow:8015298,ringColor:13148400,haloOpacity:.2,haloScale:1.2,ringOpacity:.22,lightBase:0,metalness:0,roughness:.85,jasnosc:1.7,absorb:!0,absorbLift:1.7,respawn:3.2},di("gwiazda-1",[-.4,4.6]),di("gwiazda-2",[2.4,5.2]),di("gwiazda-3",[-4.6,1.2]),di("gwiazda-4",[.8,-2.4]),di("gwiazda-5",[-3.2,-3.4]),di("gwiazda-6",[4.8,.6]),di("gwiazda-7",[-6.1,-1.6]),di("gwiazda-8",[1.6,7]),di("gwiazda-9",[5.4,-3.8])];function Cv(s){let t=(n,i,r,o)=>new ot((1-o)*(1-o)*n[0]+2*(1-o)*o*i[0]+o*o*r[0],(1-o)*(1-o)*n[1]+2*(1-o)*o*i[1]+o*o*r[1]),e=[];return s.forEach((n,i)=>{let r=n.kroki||12;for(let o=i?1:0;o<=r;o++)e.push(t(n.od,n.kontrola,n.do,o/r))}),e}function Tp(){let s=globalThis.__SCENA3D_MAPA||{},t=s.swiat?.promien??12.5,e=s.swiat?.teren??36,n=Number(globalThis.SCENA3D_PROMIEN_KULI)||s.swiat?.promienKuli||Ap(t),i=(s.sciezka||zv).map(a=>new S(a[0],0,a[1])),r=s.rzeka?.krzywe||Ev,o=s.swiat?.promienTresci??.72*Math.PI*n;return{surowa:s,promienMapy:t,teren:e,promienKuli:n,promienTresci:o,start:s.start||null,sciezka:i,latarnia:{pos:new S(s.latarnia?.pos?.[0]??2.5,0,s.latarnia?.pos?.[1]??-1.2),punktSciezki:s.latarnia?.punktSciezki??6,ukryta:!!s.latarnia?.ukryta},most:{pos:[s.most?.pos?.[0]??-4.7,s.most?.pos?.[1]??6.9],ukryty:!!s.most?.ukryty},brama:{pos:[s.brama?.pos?.[0]??0,s.brama?.pos?.[1]??-7.2],ukryta:!!s.brama?.ukryta},rzeka:{szerokosc:s.rzeka?.szerokosc??1.5,krzywe:r,punkty:Cv(r)},cienie:!!s.swiat?.cienie,terenKanciasty:s.swiat?.terenKanciasty??!1,terenWyboje:s.swiat?.terenWyboje,terenNieregularnosc:s.swiat?.terenNieregularnosc,terenFasety:!!s.swiat?.terenFasety,terenShader:s.swiat?.terenShader||null,chmury:s.swiat?.chmury??0,zoom:s.swiat?.zoom,dolnyDok:s.swiat?.dolnyDok!==!1,ekspozycja:Number.isFinite(s.swiat?.ekspozycja)?s.swiat.ekspozycja:1.25,kameraPodniesienie:Number.isFinite(s.swiat?.kameraPodniesienie)?s.swiat.kameraPodniesienie:null,zasiew:!!s.swiat?.zasiew,fasola:s.fasola||null,oczko:s.oczko||null,oczka:Array.isArray(s.oczka)?s.oczka:[],formyTerenu:s.formyTerenu||[],terenBarwy:s.swiat?.terenBarwy||null,doba:{wlaczona:!!s.swiat?.cyklDnia,nad:[s.swiat?.slonceNad?.[0]??0,s.swiat?.slonceNad?.[1]??0],strojenie:s.swiat?.doba||null},galezie:Array.isArray(s.galezie)?s.galezie:[],drzewa:s.drzewa||null,glazy:s.glazy||null,kwiaty:s.kwiaty||[],grzyby:s.grzyby||[],budynki:s.budynki??Rv,sucheDrzewka:Array.isArray(s.sucheDrzewka)?s.sucheDrzewka:[],schronienie:s.schronienie&&Array.isArray(s.schronienie.pos)?s.schronienie:null,znaki:s.znaki??kv}}function Za(s=1){let t=i=>Math.sin(s*12.9898*i+78.233)*43758.5453,e=[2,3,5].map(i=>t(i)%1*Math.PI*2),n=[.16,.1,.045];return i=>1+n[0]*Math.sin(2*i+e[0])+n[1]*Math.sin(3*i+e[1])+n[2]*Math.sin(5*i+e[2])}function Pv(s){let t=0,e=0;for(let n of s)t+=n[0],e+=n[1];return[t/s.length,e/s.length]}function Iv(s,t,e,n,i,r){let o=[t[0]+(e[0]-t[0])*i,t[1]+(e[1]-t[1])*i];if(!r)return o;let a=i*i,c=a*i,l=(u,d,f,p)=>.5*(2*d+(-u+f)*i+(2*u-5*d+4*f-p)*a+(-u+3*d-3*f+p)*c),h=[l(s[0],t[0],e[0],n[0]),l(s[1],t[1],e[1],n[1])];return[o[0]+(h[0]-o[0])*r,o[1]+(h[1]-o[1])*r]}var zp=.7,Rp=6;function Lv(s,t=zp,e=Rp){if(!Array.isArray(s)||s.length<3||!(t>0))return(s||[]).map(a=>[a[0],a[1]]);let n=s.length,i=a=>s[(a%n+n)%n],r=Math.max(1,Math.round(e)),o=[];for(let a=0;a<n;a++)for(let c=0;c<r;c++)o.push(Iv(i(a-1),i(a),i(a+1),i(a+2),c/r,t));return o}var rr=180;function Nu(s,t={}){let e=t.srodek||Pv(s),n=Lv(s,t.gladkosc??zp,t.probki??Rp),i=new Float64Array(rr),[r,o]=e;for(let l=0;l<rr;l++){let h=l/rr*Math.PI*2,u=Math.cos(h),d=Math.sin(h),f=0;for(let p=0,y=n.length-1;p<n.length;y=p++){let m=n[y][0]-r,g=n[y][1]-o,x=n[p][0]-r,_=n[p][1]-o,v=x-m,k=_-g,M=u*k-d*v;if(Math.abs(M)<1e-12)continue;let T=-(u*g-d*m)/M;if(T<0||T>1)continue;let R=Math.abs(u)>Math.abs(d)?(m+T*v)/u:(g+T*k)/d;R>f&&(f=R)}i[l]=f}let a=0;for(let l of i)l>a&&(a=l);if(a<1e-6)return{r:()=>1,max:1,srodek:e};for(let l=0;l<rr;l++)i[l]<1e-6&&(i[l]=a*.05);return{r:l=>{let h=(l/(Math.PI*2)%1+1)%1*rr,u=Math.floor(h),d=h-u;return i[u]*(1-d)+i[(u+1)%rr]*d},max:a,srodek:e}}var Lu=s=>s<=0?0:s>=1?1:s*s*(3-2*s);function Iu(s,t,e){let n=t-s.pos[0],i=e-s.pos[1],r=Math.hypot(n,i);if(!s._mn)return r/s.promien;let o=Math.atan2(i,n);return r/(s.promien*s._mn(o))}var Du={wzgorze(s,t){let e=s.plaski??0;if(t>=1)return 0;let n=e>=1?0:Math.max(0,(t-e)/(1-e));return(s.wysokosc??.5)*(1-Lu(n))},wykop(s,t){return Du.niecka({...s,glebokosc:s.glebokosc??.04,stok:s.stok??.7},t)},niecka(s,t){let e=s.stok??.9;if(t>=1+e)return 0;let n=Math.max(0,(t-1)/e);return-(s.glebokosc??.11)*(1-Lu(n))}};function Ep(s,t=2){if(Array.isArray(s.punkty)&&s.punkty.length>=3){let n=Nu(s.punkty,{gladkosc:s.gladkosc,probki:s.probki});return{...s,pos:s.pos||n.srodek,promien:1,_mn:n.r,_maxR:n.max}}let e=s.promien??t;return{...s,promien:e,_mn:s.ziarno!=null?Za(s.ziarno):null,_maxR:e*1.35}}function $a(s){let t=[];for(let o of s.formyTerenu||[]){if(!Du[o?.typ]||!o.pos&&!Array.isArray(o.punkty)){console.warn("[teren] nieznana forma",o);continue}t.push(Ep(o))}let e=[...s.oczka||[],...s.oczko?.pos||s.oczko?.punkty?[s.oczko]:[]];for(let o of e)t.push(Ep({typ:"niecka",pos:o.pos,punkty:o.punkty,promien:o.promien??1.4,glebokosc:o.glebokosc??.11,stok:o.stok??.9,ziarno:o.ziarno,gladkosc:o.gladkosc,probki:o.probki,_zrodlo:"oczko"},1.4));if(s.fasola?.pos){let o=s.fasola,a=o.grzadka||{};t.push({typ:"wykop",pos:o.pos,promien:a.promien??1.05,glebokosc:a.glebokosc??.035,stok:a.stok??.8,_mn:Za(a.ziarno??4),_zrodlo:"fasola"})}for(let o of t)o._zasieg=(o._maxR??o.promien*1.35)*(o.typ==="niecka"||o.typ==="wykop"?1+(o.stok??.9):1)+.2;return{h:(o,a)=>{let c=0;for(let l of t)Math.abs(o-l.pos[0])>l._zasieg||Math.abs(a-l.pos[1])>l._zasieg||(c+=Du[l.typ](l,Iu(l,o,a)));return c},niecka:(o,a)=>{let c=null;for(let l of t){if(l.typ!=="niecka"&&l.typ!=="wykop"||Math.abs(o-l.pos[0])>l._zasieg||Math.abs(a-l.pos[1])>l._zasieg)continue;let h=Iu(l,o,a),u=l.stok??.9;h<1+u&&(c===null||h<c.o)&&(c={o:h,stok:u,typ:l.typ})}return c},ziemia:(o,a)=>{let c=0;for(let l of t){if(l.typ!=="wykop"||Math.abs(o-l.pos[0])>l._zasieg||Math.abs(a-l.pos[1])>l._zasieg)continue;let h=Iu(l,o,a),u=1+(l.stok??.8)*.55;c=Math.max(c,1-Lu((h-.75)/(u-.75)))}return c},formy:t,pusta:t.length===0}}var Dv={baza:8037968,jasna:9682272,ciemna:6131519,szalwia:8359793,brzeg:14472860,dno:8092245,ziemia:6966067,ziemiaJasna:9071176},Nv={skala:4,ziarno:0,moc:.5,kontrast:1,szalwia:.45,piasek:.35,wzgorza:.45,glebia:.1},Uv=`
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
`;function kp(s={}){let t={...Dv,...s.barwy||{}},e={...Nv,...s.strojenie||{}},n={uBazaTeren:{value:new tt(t.baza)},uJasnaTeren:{value:new tt(t.jasna)},uCiemnaTeren:{value:new tt(t.ciemna)},uSzalwiaTeren:{value:new tt(t.szalwia)},uPiasekTeren:{value:new tt(t.brzeg)},uDnoTeren:{value:new tt(t.dno)},uZiemiaTeren:{value:new tt(t.ziemia)},uZiemiaJasnaTeren:{value:new tt(t.ziemiaJasna)},uSkalaTeren:{value:e.skala},uMocTeren:{value:e.moc},uZiarnoTeren:{value:e.ziarno},uKontrastTeren:{value:e.kontrast},uSilaSzalwii:{value:e.szalwia},uSilaPiasku:{value:e.piasek},uWzgorzaTeren:{value:e.wzgorza},uGlebiaTeren:{value:Math.max(1e-4,e.glebia)}},i=new te({color:16777215,flatShading:!!s.fasety});return i.onBeforeCompile=r=>{Object.assign(r.uniforms,n),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
        attribute float wysForma;
        attribute float ziemiaForma;
        varying vec3 vKierTeren;
        varying float vWysTeren;
        varying float vZiemiaTeren;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        vKierTeren = normalize(position);
        vWysTeren = wysForma;
        vZiemiaTeren = ziemiaForma;`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
${Uv}`).replace("#include <color_fragment>",`#include <color_fragment>
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
      }`),i.userData.shaderTerenu=r},i.userData.uniformyTerenu=n,i.customProgramCacheKey=()=>"teren-proceduralny",i}var Ov=new S,Cp=new S,as=new S,eo=new S,or=new S,Ja=new S,Vn=new S,ib=new S;function Pp(s){return Array.isArray(s)?[s[0],s[1]]:s.isVector3?[s.x,s.z]:[s.x,s.y]}function Uu(s,t,e=Pp){let n=[];for(let i of s){let[r,o]=e(i),a=t.normalna(r,o,new S);n.length&&n[n.length-1].dot(a)>1-1e-12||n.push(a)}return n}function Fv(s,t,e=.12){if(s.length<2)return s.slice();let n=t.R,i=[s[0].clone()],r=e;for(let a=0;a<s.length-1;a++){let c=s[a],l=s[a+1],h=Math.acos(Math.max(-1,Math.min(1,c.dot(l)))),u=h*n;if(u<1e-9)continue;let d=Math.sin(h),f=r;for(;f<=u;){let p=f/u,y=d>1e-9?Math.sin((1-p)*h)/d:1-p,m=d>1e-9?Math.sin(p*h)/d:p;i.push(Ov.copy(c).multiplyScalar(y).addScaledVector(l,m).normalize().clone()),f+=e}r=f-u}let o=s[s.length-1];return i[i.length-1].dot(o)<1-1e-9&&i.push(o.clone()),i}function Bv(s,t,e,n){let i=s[t],r=t>0,o=t<s.length-1;o&&on(i,s[t+1],as.set(1,0,0),as),r&&on(i,s[t-1],eo.set(1,0,0),eo).negate(),o||as.copy(eo),r||eo.copy(as),or.copy(as).add(eo),or.lengthSq()<1e-10&&or.copy(as),qe(or,i);let a=Math.max(or.dot(as),1/n);return{t:or,mitra:1/a}}function Ou(s,t,e={}){let{polSzerokosc:n=.5,wysokosc:i=.01,krok:r=.12,skalaUV:o=1,mitraMax:a=2.5,kapsle:c=!0,juzNormalne:l=!1,wez:h=Pp}=e,u=l?s.map(M=>M.clone()):Uu(s,t,h);if(u.length<2)return null;let d=Fv(u,t,r);if(d.length<2)return null;let f=d.map(M=>({n:M,hw:n}));if(c&&n>1e-4){let M=[.38,.71,.92,.999],T=(R,P,w)=>{on(R,P,Vn.set(1,0,0),Ja).negate();for(let b of M){let I=R.clone(),C=Ja.clone();t.przesunPoKuli(I,C,b*n);let U={n:I,hw:n*Math.sqrt(Math.max(0,1-b*b))};w?f.unshift(U):f.push(U)}};T(d[0],d[1],!0),T(d[d.length-1],d[d.length-2],!1)}let p=f.map(M=>M.n),y=[],m=[],g=[],x=[],_=t.R,v=0;for(let M=0;M<f.length;M++){let{n:T,hw:R}=f[M];M>0&&(v+=_*Math.acos(Math.max(-1,Math.min(1,p[M-1].dot(T)))));let{t:P,mitra:w}=Bv(p,M,t,a);Ja.crossVectors(T,P).normalize();let b=R*w;for(let I of[1,-1])Vn.copy(T),Cp.copy(Ja),b>1e-6&&t.przesunPoKuli(Vn,Cp,I*b),m.push(Vn.x,Vn.y,Vn.z),Vn.multiplyScalar(_+i),y.push(Vn.x,Vn.y,Vn.z);g.push(0,v*o,1,v*o)}for(let M=0;M<f.length-1;M++){let T=M*2;x.push(T,T+1,T+2,T+1,T+3,T+2)}let k=new Gt;return k.setAttribute("position",new vt(y,3)),k.setAttribute("normal",new vt(m,3)),k.setAttribute("uv",new vt(g,2)),k.setIndex(x),k.computeBoundingSphere(),{geometry:k,os:d,dlugosc:v}}function Ip(s,t,e=Math.PI*t.R*.985){let n=Math.cos(Math.min(e/t.R,Math.PI*.995)),i=[],r=[];for(let o of s)o.y>=n?r.push(o):r.length&&(r.length>=2&&i.push(r),r=[]);return r.length>=2&&i.push(r),i}var Tn={grassA:"#8bb054",grassB:"#6b9a45",grassC:"#a3c368",cliff:"#6d5a44",path:"#c9b58c",pathEdge:"#a8946e",pathSlab:"#d6c49c",water:"#3fb8c9",waterDeep:"#2a93a8",night:"#243147"},ve={pine:4029027,pineDark:3105616,trunk:7031344,leafTree:7319118,rock:9673884,rockDark:7831426,wood:9133628,woodDark:7226150,rope:13219465,lantern:8018488,flame:16767091,gate:10127978,gateGlow:16771496,pakKamien:7040888,pakKamienCiemny:5198684,pakZylka:13223092},cr=(s,t={})=>new te({color:s,...t}),me=s=>new te({color:s,flatShading:!0});function ie(s,t,e=[0,0,0],n=[0,0,0],i=1){let r=new At(s,t);return r.position.set(...e),r.rotation.set(...n),r.scale.setScalar(i),r}function Lp(s,t,e,n,i){let r=Math.hypot(s,t);if(r<1e-6)return 1;let o=r/i,a=Math.sin(o)/o,c=Math.hypot(e,n)||1,l=-n/c,h=e/c,u=s/r,d=t/r,f=l*u+h*d,p=-l*d+h*u,y=Math.sqrt(f*f+p*p*a*a);return Math.min(8,1/Math.max(.001,y))}function Fu(s,t,e,n,i,r,o){if(t.length<2)return;s.fillStyle=s.strokeStyle;let a=i/2/o;for(let c=0;c<t.length-1;c++){let l=t[c],h=t[c+1],u=h.x-l.x,d=h.y-l.y,f=Math.hypot(u,d);if(f<1e-6)continue;u/=f,d/=f;let p=a*Lp(l.x,l.y,u,d,r),y=a*Lp(h.x,h.y,u,d,r);s.beginPath(),s.moveTo(e(l.x-d*p),n(l.y+u*p)),s.lineTo(e(h.x-d*y),n(h.y+u*y)),s.lineTo(e(h.x+d*y),n(h.y-u*y)),s.lineTo(e(l.x+d*p),n(l.y-u*p)),s.closePath(),s.fill()}for(let c of t){let l=Math.hypot(c.x,c.y),h=l/r,u=l<1e-6?1:Math.sin(h)/h,d=a/Math.max(.001,Math.abs(u));s.save(),s.translate(e(c.x),n(c.y)),s.rotate(Math.atan2(c.y,c.x)),s.beginPath(),s.ellipse(0,0,a*o,Math.min(a*8,d)*o,0,0,Math.PI*2),s.fill(),s.restore()}}function Hv(s,t){let e=s.teren,n=2048,i=document.createElement("canvas");i.width=i.height=n;let r=i.getContext("2d"),o=n/e,a=_=>(_+e/2)*o,c=_=>(_+e/2)*o,l=r.createLinearGradient(0,0,0,n);l.addColorStop(0,Tn.grassB),l.addColorStop(.55,Tn.grassA),l.addColorStop(1,Tn.grassB),r.fillStyle=l,r.fillRect(0,0,n,n);let h=42,u=()=>(h=h*16807%2147483647)/2147483647;for(let _=0;_<520;_++)r.fillStyle=u()>.5?Tn.grassC:Tn.grassB,r.globalAlpha=.16+u()*.2,r.beginPath(),r.ellipse(u()*n,u()*n,(14+u()*46)*2,(10+u()*30)*2,u()*3,0,7),r.fill();if(r.globalAlpha=1,!s.latarnia.ukryta){let _=r.createRadialGradient(a(0),c(-6.5),10,a(0),c(-6.5),n*.5);_.addColorStop(0,"rgba(255,220,140,0.5)"),_.addColorStop(.4,"rgba(255,220,140,0.16)"),_.addColorStop(1,"rgba(255,220,140,0)"),r.fillStyle=_,r.fillRect(0,0,n,n)}let d=t.R,f=s.rzeka.krzywe,p=(_=0)=>{let v=[];return f.forEach((k,M)=>{for(let T=M?1:0;T<=40;T++){let R=T/40;v.push(new ot((1-R)*(1-R)*k.od[0]+2*(1-R)*R*k.kontrola[0]+R*R*k.do[0],(1-R)*(1-R)*(k.od[1]+_)+2*(1-R)*R*(k.kontrola[1]+_)+R*R*(k.do[1]+_)))}}),v},y=s.promienTresci,m=sr(p(),y);r.strokeStyle=Tn.waterDeep;for(let _ of m)Fu(r,_,a,c,2.5*o,d,o);r.strokeStyle=Tn.water;for(let _ of m)Fu(r,_,a,c,1.9*o,d,o);r.strokeStyle="rgba(255,255,255,0.25)";let g=p();for(let _ of[-.7,.2,.8]){let v=p(_),k=sr(g.map((M,T)=>({x:M.x,y:M.y,ix:T})),y);for(let M of k)Fu(r,M.map(T=>v[T.ix]),a,c,.25*o,d,o)}for(let _=0;_<92;_++)r.fillStyle=["#ffffff","#e8b7e0","#ffd873"][Math.floor(u()*3)],r.globalAlpha=.8,r.beginPath(),r.arc(u()*n,u()*n,(2.6+u()*2)*2,0,7),r.fill();r.globalAlpha=1;let x=new he(i);return x.colorSpace=Vt,x.anisotropy=8,x}function Vv(s,t){let e=t.R,n=typeof s.terenKanciasty=="number"?s.terenKanciasty:5,i=s.terenWyboje??.05,r=new fn(e,n),o=r.attributes.position,a=o.count,c=(b,I,C)=>Math.sin(4.8*b+.7)*Math.sin(5.9*C+1.9)*.55+Math.sin(9.3*I+2.6)*Math.sin(7.7*b+.3)*.3+Math.sin(15.1*C+4.2)*Math.sin(12.7*I+1.1)*.15,l=s.terenNieregularnosc??.3,h=1.10715/(n+1),u=l*h,d=b=>{let I=2166136261;for(let C=0;C<b.length;C++)I^=b.charCodeAt(C),I=Math.imul(I,16777619);return I>>>0},f=new Map,p=new S,y=new S,m=new S,g=b=>`${Math.round(b.x*1e4)},${Math.round(b.y*1e4)},${Math.round(b.z*1e4)}`,x=(b,I)=>{let C=f.get(I);if(C)return b.copy(C);let U=d(I),K=U%2048/2048*2-1,B=(U>>>11)%2048/2048*2-1;return m.set(0,1,0),Math.abs(b.y)>.9&&m.set(1,0,0),p.crossVectors(b,m).normalize(),y.crossVectors(b,p).normalize(),b.addScaledVector(p,K*u).addScaledVector(y,B*u).normalize(),f.set(I,b.clone()),b},_=$a(s),v={x:0,z:0,h:0},k=b=>_.pusta?0:(t.zKuli(b,v),_.h(v.x,v.z)),M=new S,T=new Float32Array(a),R=new Float32Array(a),P=new Array(a);for(let b=0;b<a;b++){M.fromBufferAttribute(o,b).normalize();let I=g(M);P[b]=I,u>1e-6&&x(M,I);let C=c(M.x,M.y,M.z),U=k(M);T[b]=U,_.pusta||(R[b]=_.ziemia(v.x,v.z)),M.multiplyScalar(e+i*(U<-1e-4?C*.3:C)+U),o.setXYZ(b,M.x,M.y,M.z)}r.setAttribute("wysForma",new vt(T,1)),r.setAttribute("ziemiaForma",new vt(R,1)),s.terenFasety?r.computeVertexNormals():Gv(r,P);let w=new At(r,kp({barwy:s.terenBarwy||null,strojenie:s.terenShader||null,fasety:!!s.terenFasety}));return w.name="ground",w}function Gv(s,t){let e=s.attributes.position,n=e.count,i=new S,r=new S,o=new S,a=new S,c=new S,l=new S,h=new Map;for(let d=0;d+2<n;d+=3){i.fromBufferAttribute(e,d),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),l.crossVectors(a.subVectors(r,i),c.subVectors(o,i));for(let f=0;f<3;f++){let p=t[d+f],y=h.get(p);y||h.set(p,y=new S),y.add(l)}}let u=new Float32Array(n*3);for(let d=0;d<n;d++){let f=h.get(t[d]);l.copy(f).normalize(),u[d*3]=l.x,u[d*3+1]=l.y,u[d*3+2]=l.z}s.setAttribute("normal",new vt(u,3))}function Wv(s,t){if(s.terenKanciasty)return Vv(s,t);let e=t.R,n=new Se(e,192,128),i=n.attributes.position,r=n.attributes.uv,o=new S,a={x:0,z:0,h:0},c=s.teren;for(let u=0;u<i.count;u++)o.fromBufferAttribute(i,u),t.zKuli(o,a),r.setXY(u,(a.x+c/2)/c,1-(a.z+c/2)/c);r.needsUpdate=!0;let l=new te({map:Hv(s,t)}),h=new At(n,l);return h.name="ground",h}var Ui={PREDKOSC:.18,SZEROKOSC:.9,KRYCIE:.56,SKALA:.55,WYSOKOSC:.012};function Dp(s){let t=document.createElement("canvas");t.width=96,t.height=256;let e=t.getContext("2d");e.clearRect(0,0,96,256),e.lineCap="round";for(let n=0;n<9;n++){let i=16+n*28+(n+s)%2*5,r=.42+n%3*.09,o=e.createLinearGradient(4,0,92,0);o.addColorStop(0,"rgba(255,255,255,0)"),o.addColorStop(.18,`rgba(255,255,255,${(r*.72).toFixed(3)})`),o.addColorStop(.5,`rgba(255,255,255,${r.toFixed(3)})`),o.addColorStop(.82,`rgba(255,255,255,${(r*.72).toFixed(3)})`),o.addColorStop(1,"rgba(255,255,255,0)"),e.strokeStyle=o,e.lineWidth=2.5+n%3*.7,e.beginPath(),e.moveTo(5,i),e.bezierCurveTo(25,i-5-s,62,i+5,91,i-1),e.stroke()}e.strokeStyle="rgba(255,255,255,.48)",e.lineWidth=1.8;for(let n=0;n<8;n++){let i=29+n*28+s*7,r=14+n%4*15;e.beginPath(),e.moveTo(r,i),e.quadraticCurveTo(r+8,i-3,r+17,i),e.stroke()}return t}function Xv(s,t){let e=sr(s.rzeka.punkty,s.promienTresci),n=new it,i=[];for(let r of e){let o=Kv(r,t);n.add(o.mesh),i.push(o.tik)}return{mesh:n,tik:r=>i.forEach(o=>o(r))}}function Kv(s,t){let e=()=>({mesh:new it,tik:()=>{}});if(!s||s.length<2)return e();let n=[],i=[],r=[],o=Ui.SZEROKOSC,a=new S,c=new S,l=new S,h=new S,u=new S,d=new S,f=new S,p=0;for(let R=0;R<s.length;R++){let P=s[R],w=s[Math.min(R+1,s.length-1)],b=s[Math.max(R-1,0)];t.normalna(P.x,P.y,a),t.normalna(w.x,w.y,c),t.normalna(b.x,b.y,l),on(a,c,f.set(1,0,0),h),on(a,l,f.set(1,0,0),f).negate(),h.add(f),h.lengthSq()<1e-6&&on(a,c,f.set(1,0,0),h),qe(h,a),u.crossVectors(a,h).normalize(),R>0&&(p+=t.odleglosc(a,t.normalna(s[R-1].x,s[R-1].y,l)));let I=p*Ui.SKALA;d.copy(a),f.copy(u),t.przesunPoKuli(d,f,o),d.multiplyScalar(t.R+Ui.WYSOKOSC),n.push(d.x,d.y,d.z),d.copy(a),f.copy(u),t.przesunPoKuli(d,f,-o),d.multiplyScalar(t.R+Ui.WYSOKOSC),n.push(d.x,d.y,d.z),i.push(0,I,1,I)}for(let R=0;R<s.length-1;R++){let P=R*2;r.push(P,P+1,P+2,P+1,P+3,P+2)}let y=new Hn(1,1);y.setAttribute("position",new vt(n,3)),y.setAttribute("uv",new vt(i,2)),y.deleteAttribute("normal"),y.setIndex(r),y.computeBoundingSphere();let m=new he(Dp(0)),g=new he(Dp(1));m.wrapS=m.wrapT=Bn,g.wrapS=g.wrapT=Bn,g.repeat.set(1,1.35),g.offset.y=.37;let x=new ne({map:m,transparent:!0,depthWrite:!1,side:de,opacity:Ui.KRYCIE}),_=new ne({map:g,transparent:!0,depthWrite:!1,side:de,opacity:Ui.KRYCIE*.68}),v=new At(y,x);v.renderOrder=1,v.frustumCulled=!1;let k=new At(y,_);k.renderOrder=2,k.frustumCulled=!1;let M=new it;return M.add(v,k),{mesh:M,tik:R=>{m.offset.y=(m.offset.y-R*Ui.PREDKOSC)%1,g.offset.y=(g.offset.y-R*Ui.PREDKOSC*.48)%1,g.offset.x=Math.sin(Date.now()*18e-5)*.045}}}var Gn={HW_OBRYS:.95,HW_WYPELNIENIE:.775,H_OBRYS:.005,H_WYPELNIENIE:.009,H_PLYTKI:.013,KROK:.14,CO_ILE_PLYTEK:.46};function jv(){let s=document.createElement("canvas");s.width=s.height=64;let t=s.getContext("2d");t.fillStyle="#ffffff",t.beginPath(),t.roundRect(2,2,60,60,13),t.fill();let e=new he(s);return e.colorSpace=Vt,e}function qv(s,t){let e=new it;e.name="sciezki";let n=new te({color:Tn.pathEdge,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),i=new te({color:Tn.path,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4}),r=[[s.sciezka,1]];for(let c of s.galezie||[]){let l=c&&(c.sciezka||c.punkty);l&&l.length>=2&&r.push([l,c.szerokosc||.75])}let o=[];for(let[c,l]of r)for(let h of Ip(Uu(c,t),t)){let u={juzNormalne:!0,krok:Gn.KROK},d=Ou(h,t,{...u,polSzerokosc:Gn.HW_OBRYS*l,wysokosc:Gn.H_OBRYS}),f=Ou(h,t,{...u,polSzerokosc:Gn.HW_WYPELNIENIE*l,wysokosc:Gn.H_WYPELNIENIE});d&&e.add(Np(d.geometry,n)),f&&(e.add(Np(f.geometry,i)),o.push({os:f.os,szer:l}))}let a=Yv(o);return a.length&&e.add(Zv(a,t)),e}function Np(s,t){let e=new At(s,t);return e.frustumCulled=!1,e}function Yv(s){let t=[],e=1337,n=()=>(e=e*16807%2147483647)/2147483647,i=Math.max(1,Math.round(Gn.CO_ILE_PLYTEK/Gn.KROK));for(let{os:r,szer:o}of s)for(let a=i;a<r.length-i;a+=i)t.push({n:r[a],przed:r[a-1],po:r[a+1],wzdluz:(.55+n()*.25)*o,wpoprzek:(.42+n()*.2)*o,kolor:n()>.4?Tn.pathSlab:"#cfbd96",bok:(n()-.5)*.12});return t}function Zv(s,t){let e=new Hn(1,1);e.rotateX(-Math.PI/2);let n=new te({map:jv(),transparent:!0,opacity:.85,alphaTest:.35,polygonOffset:!0,polygonOffsetFactor:-6,polygonOffsetUnits:-6}),i=new Ne(e,n,s.length);i.frustumCulled=!1;let r=new Et,o=new tt,a=new S,c=new S,l=new S,h=new S,u=new S,d=new S,f=new S,p=new S;return s.forEach((y,m)=>{on(y.n,y.po,d.set(1,0,0),a),on(y.n,y.przed,d.set(1,0,0),l).negate(),a.add(l),qe(a,y.n),c.crossVectors(y.n,a).normalize(),h.copy(y.n),u.copy(c),Math.abs(y.bok)>1e-4&&t.przesunPoKuli(h,u,y.bok),a.crossVectors(u,h).normalize(),d.copy(u).multiplyScalar(y.wpoprzek),f.copy(h),p.copy(a).multiplyScalar(y.wzdluz),r.makeBasis(d,f,p),r.setPosition(h.x*(t.R+Gn.H_PLYTKI),h.y*(t.R+Gn.H_PLYTKI),h.z*(t.R+Gn.H_PLYTKI)),i.setMatrixAt(m,r),i.setColorAt(m,o.set(y.kolor))}),i.instanceMatrix.needsUpdate=!0,i.instanceColor&&(i.instanceColor.needsUpdate=!0),i}function Fp(s=1){let t=new it;t.name="kamienny-pak";let e=me(ve.pakKamien),n=me(ve.pakKamienCiemny);t.add(ie(new pe(.34*s,.58*s,.72*s,7),n,[0,.3*s,0])),t.add(ie(new pe(.46*s,.3*s,.26*s,7),e,[0,.76*s,0]));for(let i=0;i<3;i++){let r=i*Math.PI*2/3+.4,o=ie(new ri(.42*s,1.9*s,5),i===1?n:e,[Math.cos(r)*.19*s,1.72*s,Math.sin(r)*.19*s],[Math.cos(r)*.13,r,Math.sin(r)*.13]);t.add(o)}t.add(ie(new ri(.3*s,2.3*s,6),e,[0,1.95*s,0]));for(let i=0;i<3;i++){let r=i*Math.PI*2/3-.5;t.add(ie(new pe(.035*s,.02*s,1.5*s,4),me(ve.pakZylka),[Math.cos(r)*.3*s,1.55*s,Math.sin(r)*.3*s],[Math.cos(r)*.16,0,Math.sin(r)*.16]))}return t}function pi(s,t,e,n=1){let i=s.attributes.position,r=1/0,o=-1/0;for(let l=0;l<i.count;l++){let h=i.getY(l);h<r&&(r=h),h>o&&(o=h)}let a=o-r||1,c=new Float32Array(i.count*3);for(let l=0;l<i.count;l++){let h=Math.pow((i.getY(l)-r)/a,n);c[l*3]=t[0]+(e[0]-t[0])*h,c[l*3+1]=t[1]+(e[1]-t[1])*h,c[l*3+2]=t[2]+(e[2]-t[2])*h}return s.setAttribute("color",new vt(c,3)),s}var mi={igly:[[.7,.76,.68],[1.17,1.12,.97]],pien:[[.64,.68,.7],[1.1,1.06,1]],lisc:[[.71,.77,.69],[1.15,1.12,.96]],kapelusz:[[.76,.72,.72],[1.13,1.06,1.02]],trzon:[[.72,.74,.77],[1.07,1.06,1.02]]},ar=s=>new te({color:s,flatShading:!0,vertexColors:!0}),Wn={pien:ar(7754545),pienJasny:ar(9529147),igly:ar(4094269),iglyCiemne:ar(3106102),lisc:ar(5739586),liscJasny:ar(7514702)},Ge={pien:me(7754545),pienJasny:me(9529147),igly:me(4094269),iglyCiemne:me(3106102),lisc:me(5739586),liscJasny:me(7514702),skala:me(9538424),skalaJasna:me(11182989),skalaCiemna:me(7433312),mech:me(6720325)};function fi(s=1,t=0){let e=new it;return e.name="sosna-low-poly",e.add(ie(pi(new pe(.105*s,.19*s,.88*s,6),...mi.pien),Wn.pien,[0,.44*s,0],[0,.18+t,0])),[[1.02,.98],[.84,1.48],[.65,1.94],[.43,2.36]].forEach(([n,i],r)=>{let o=ie(pi(new ri(n*s,.92*s,7),...mi.igly,1.35),r%2?Wn.iglyCiemne:Wn.igly,[0,i*s,0],[0,.18+t+r*.48,r%2?-.025:.025]);o.scale.set(1,r===0?.82:.94,.88+r%2*.08),e.add(o)}),e}function Qa(s=1){let t=new it;t.name="drzewo-lisciaste-low-poly",t.add(ie(pi(new pe(.13*s,.22*s,1.25*s,6),...mi.pien),Wn.pien,[0,.58*s,0],[0,.16,0])),t.add(ie(pi(new pe(.065*s,.09*s,.66*s,5),...mi.pien),Wn.pienJasny,[-.17*s,1.08*s,.02*s],[0,0,.58])),t.add(ie(pi(new pe(.06*s,.085*s,.58*s,5),...mi.pien),Wn.pien,[.19*s,1.12*s,.02*s],[.12,0,-.62]));let e=[[-.45,1.66,.02,.66,.58,.62,0],[.38,1.7,.08,.7,.6,.64,1],[-.05,2.12,-.02,.72,.68,.66,0],[.04,1.63,.38,.57,.52,.56,1],[.62,1.48,-.04,.43,.4,.44,0]];for(let[n,i,r,o,a,c,l]of e){let h=ie(pi(new fn(1,1),...mi.lisc),l?Wn.liscJasny:Wn.lisc,[n*s,i*s,r*s],[.1+n*.2,.35+i*.13,r*.3]);h.scale.set(o*s,a*s,c*s),t.add(h)}return t}function $v(s=1){let t=new it;t.name="choinka-podwojna-low-poly";let e=fi(.92*s,0);e.position.set(-.26*s,0,.13*s),e.rotation.z=.028,t.add(e);let n=fi(.74*s,.45);return n.position.set(.3*s,0,-.16*s),n.rotation.z=-.05,t.add(n),t}var no={kapelusz:cr(13058092,{flatShading:!0,vertexColors:!0}),kapeluszMlody:cr(14508596,{flatShading:!0,vertexColors:!0}),trzon:cr(15721414,{vertexColors:!0}),kropka:cr(16249052),blaszki:cr(14207138)};function Up(s=1,t=!1){let e=new it,n=.17*s,i=.27*s;e.add(ie(pi(new pe(.05*s,.073*s,.29*s,7),...mi.trzon),no.trzon,[0,.145*s,0])),e.add(ie(new pe(n*.96,n*.96,.014*s,9),no.blaszki,[0,i-.004*s,0]));let r=ie(pi(new Se(n,9,5,0,Math.PI*2,0,Math.PI*.54),...mi.kapelusz,.7),t?no.kapeluszMlody:no.kapelusz,[0,i,0]);r.scale.set(1,.84,1),e.add(r);for(let[o,a,c]of[[.5,.62,1],[2.2,.78,.82],[3.7,.5,.92],[5.1,.86,.74],[1.4,1.06,.66],[4.3,1.08,.58]]){let l=n*.94,h=ie(new Se(.031*s*c,7,5),no.kropka,[Math.sin(a)*Math.cos(o)*l,i+Math.cos(a)*l*.84,Math.sin(a)*Math.sin(o)*l]);e.add(h)}return e}function Jv(s=1){let t=new it;t.name="grzyby-low-poly";let e=Up(s,!1);e.position.set(-.05*s,0,.02*s),e.rotation.set(0,.42,.045),t.add(e);let n=Up(.54*s,!0);return n.position.set(.185*s,0,-.085*s),n.rotation.set(0,-1.15,-.07),t.add(n),t}var En={skalaModelu:.66,zanurzeniePnia:.34,obrotModelu:3.176,pienX:0,pienY:0,pienZ:0,poziom:2.6,zasiegKonaru:1.41,pomostOd:.2,pomostPol:.56,klepiskoR:1.06,barierka:.5,drabinkaOdsun:.62,drabinkaDlugosc:1,korony:[[1.58,3.95,-.38,.85,0],[.76,3.68,-1.42,.72,1],[.96,3.3,-1.05,.68,0],[1.96,3.25,.95,.7,1],[-1.01,2.92,-2.22,.7,1],[-2.01,3.32,-.74,.72,0]]};function tc(s){let t=s&&typeof s.uklad=="object"&&s.uklad?s.uklad:{},e={...En,...t},n=Array.isArray(t.korony)&&t.korony.length?t.korony:En.korony;return e.korony=n.map(i=>[Number(i[0])||0,Number(i[1])||0,Number(i[2])||0,Number(i[3])||.5,i[4]?1:0]),e}var hr=.02,Bp=me(7294510);function Bu(s=1,t=En){let e=new it;e.name="drzewo-domkowe";let n=t.korony||En.korony;for(let[i,r,o,a,c]of n){let l=ie(pi(new fn(1,1),...mi.lisc),c?Wn.liscJasny:Wn.lisc,[i*s,r*s,o*s],[.1+i*.2,.35+r*.13,o*.3]);l.scale.set(a*s,a*(.88+Math.abs(i)%.17)*s,a*(.96+Math.abs(o)%.13)*s),e.add(l)}return e}function Hu(s,t,e,n,i,r=0,o=null){let a=s.R,c=Math.sqrt(Math.max(0,a*a-e*e-n*n))-a;if(!i)return c+r;let l=new S,h={x:0,z:0,h:0};t.updateMatrix();let u=(p,y,m)=>(l.set(p,y,m).applyMatrix4(t.matrix),s.zKuli(l,h),h),d=o;if(d==null){let p=u(0,0,0);d=i(p.x,p.z)}let f=u(e,c,n);return c+(i(f.x,f.z)-d)+r}function Vu(s,t,e,n,i=.03,r=48,o=5){let a=s.R,c=[],l=[],h=new S,u={x:0,z:0,h:0};t.updateMatrix();let f=((x,_,v)=>(h.set(x,_,v).applyMatrix4(t.matrix),s.zKuli(h,u),u))(0,0,0),p=n?n(f.x,f.z):0,y=(x,_)=>Hu(s,t,x,_,n,i,p);c.push(0,y(0,0),0);for(let x=1;x<=o;x++){let _=e*(x/o);for(let v=0;v<r;v++){let k=v/r*Math.PI*2,M=Math.cos(k)*_,T=Math.sin(k)*_;c.push(M,y(M,T),T)}}for(let x=0;x<r;x++)l.push(0,1+x,1+(x+1)%r);for(let x=1;x<o;x++){let _=1+(x-1)*r,v=1+x*r;for(let k=0;k<r;k++){let M=(k+1)%r;l.push(_+k,v+k,v+M,_+k,v+M,_+M)}}l.reverse();let m=new Gt;m.setAttribute("position",new vt(c,3)),m.setIndex(l);let g=new Float32Array(c.length);for(let x=1;x<g.length;x+=3)g[x]=1;return m.setAttribute("normal",new vt(g,3)),m}function Op(s=1,t=!1,e=0){let n=new it;e=((e|0)%3+3)%3,n.name=t?"kamyk-low-poly":"skaly-low-poly",n.userData.wariantSkaly=e;let i=(r,o,a,c,l,h)=>{let u=ie(new $s(r*s,o),a,c.map(d=>d*s),l);return u.scale.set(...h),n.add(u),u};if(t){let r=[[1.22,.55,.88],[.96,.72,1.18],[1.34,.48,.78]];return i(.48,e===1?1:0,e===2?Ge.skalaCiemna:Ge.skala,[0,.16,0],[.45+e*.22,.9-e*.18,.2+e*.3],r[e]),n}return e===0?(i(.67,0,Ge.skala,[0,.4,0],[.2,.73,.08],[1.12,.92,.86]),i(.39,0,Ge.skalaJasna,[.48,.22,.12],[.78,.18,.46],[1.06,.66,.92]),i(.27,1,Ge.skalaCiemna,[-.46,.16,.25],[.42,.62,.16],[1.18,.58,.88]),i(.25,1,Ge.mech,[-.08,.73,-.02],[0,.4,0],[1.25,.13,.82])):e===1?(i(.6,0,Ge.skalaCiemna,[0,.27,0],[.12,.42,.06],[1.34,.58,1.02]),i(.46,0,Ge.skalaJasna,[-.15,.5,.01],[.05,.86,-.1],[1.12,.48,.84]),i(.34,1,Ge.skala,[.5,.18,.19],[.64,.28,.52],[1.2,.55,.95]),i(.23,0,Ge.skalaJasna,[-.56,.13,-.1],[.32,.98,.16],[1.1,.48,.8]),i(.28,1,Ge.mech,[-.13,.69,.01],[0,.2,0],[1.38,.1,.72])):(i(.51,0,Ge.skala,[0,.31,.02],[.3,.74,.14],[1.08,.78,.96]),i(.42,0,Ge.skalaJasna,[.44,.25,.08],[.78,.18,.54],[1.08,.69,.9]),i(.37,0,Ge.skalaCiemna,[-.43,.21,.17],[.42,.91,.22],[1.18,.62,.86]),i(.29,1,Ge.skala,[.18,.17,-.42],[.28,.36,.68],[1.24,.55,.82]),i(.24,0,Ge.skalaJasna,[-.19,.14,-.4],[.72,.52,.18],[1.04,.58,.94]),i(.24,1,Ge.mech,[.01,.6,-.02],[0,.4,0],[1.18,.12,.74])),n}function Qv(){let s=new it;s.add(ie(new ze(.22,2.1,.22),me(ve.lantern),[0,1.05,0])),s.add(ie(new ze(.3,.16,.3),me(ve.woodDark),[0,2.16,0])),s.add(ie(new ze(.8,.14,.18),me(ve.lantern),[-.3,2.02,0]));let t=new it;t.position.set(-.62,1.7,0),t.add(ie(new pe(.02,.02,.24,5),me(ve.woodDark),[0,.24,0])),t.add(ie(new ze(.24,.3,.24),me(ve.woodDark),[0,0,0]));let e=new te({color:ve.flame,emissive:ve.flame,emissiveIntensity:1.6});t.add(ie(new ze(.18,.22,.18),e,[0,0,0])),t.add(ie(new ri(.2,.14,4),me(ve.woodDark),[0,.2,0],[0,Math.PI/4,0])),s.add(t);let n=new mn(ve.flame,9,7,2);return n.position.copy(t.position),s.add(n),s.userData={lamp:t,light:n,glassMat:e},s}function t1(){let s=new it;for(let t=-3;t<=3;t++)s.add(ie(new ze(2.2,.1,.34),me(t%2?ve.wood:ve.woodDark),[0,.16+Math.cos(t*.4)*.09,t*.38],[Math.sin(t*.4)*.09,0,0]));for(let t of[-1,1]){for(let e of[-1,1])s.add(ie(new ze(.14,.7,.14),me(ve.woodDark),[t*1,.45,e*1.25])),s.add(ie(new Se(.09,6,5),me(ve.wood),[t*1,.84,e*1.25]));s.add(ie(new pe(.03,.03,2.5,5),cr(ve.rope),[t*1,.62,0],[Math.PI/2,0,0]))}return s}function e1(){let s=new it;for(let o of[-1,1])s.add(ie(new ze(.6,2.6,.5),me(ve.gate),[o*1.3,1.3,0])),s.add(ie(new ri(.42,.6,4),me(ve.gate),[o*1.3,2.85,0],[0,Math.PI/4,0]));s.add(ie(new ze(2.2,.5,.4),me(ve.gate),[0,2.45,0]));let t=document.createElement("canvas");t.width=t.height=128;let e=t.getContext("2d"),n=e.createRadialGradient(64,64,4,64,64,64);n.addColorStop(0,"rgba(255,240,190,1)"),n.addColorStop(1,"rgba(255,220,140,0)"),e.fillStyle=n,e.fillRect(0,0,128,128);let i=new De(new Le({map:new he(t),color:ve.gateGlow,transparent:!0,opacity:.9,blending:Dn,depthWrite:!1}));i.scale.set(3.4,3.4,1),i.position.set(0,1.6,0),s.add(i);let r=new mn(ve.gateGlow,10,10,2);return r.position.set(0,1.8,0),s.add(r),s.userData={glow:i,light:r},s}function lr(s=1,t=.35,e=0,n=!1){let i=document.createElement("canvas");i.width=i.height=64;let r=i.getContext("2d"),o=r.createRadialGradient(32,32,2,32,32,32);if(n){let u=`rgb(${Math.round(255-225*t)},${Math.round(255-215*t)},${Math.round(255-225*t)})`;o.addColorStop(0,u),e&&o.addColorStop(e,u),o.addColorStop(1,"rgb(255,255,255)")}else o.addColorStop(0,`rgba(30,40,30,${t})`),e&&o.addColorStop(e,`rgba(30,40,30,${t})`),o.addColorStop(1,"rgba(30,40,30,0)");r.fillStyle=o,r.fillRect(0,0,64,64);let a=new he(i);a.colorSpace=Vt;let c=n?new ne({map:a,transparent:!0,depthWrite:!1,blending:ia,toneMapped:!1}):new ne({map:a,transparent:!0,depthWrite:!1}),l=new At(new Hn(s,s),c);l.rotation.x=-Math.PI/2,l.position.y=.02;let h=new it;return h.add(l),h.userData.plama=l,h}function Hp(s,t){let e=new At(t.geometry,t.material);e.updateMatrixWorld(!0),t.geometry.computeBoundingSphere();let n=t.geometry.boundingSphere.radius+1,i=new tr,r=new S,o=new S,a=new S;return function(l,h){s.normalna(l,h,r),i.set(o.copy(r).multiplyScalar(n),a.copy(r).negate());let u=i.intersectObject(e,!1)[0];return(u?u.point.dot(r)-s.R:0)-.008}}function n1(s,t,e,n=Hp(t,e)){let r=[{p:16643814,s:15909194},{p:16238920,s:14715422},{p:15765428,s:16177003},{p:8038120,s:15982714},{p:12159712,s:16179338}],o=[{strona:1,wys:.34,sk:1,obr:-.5},{strona:-1,wys:.58,sk:.78,obr:.5}],a=new te({color:6065210,flatShading:!0}),c=new te({color:7250762,flatShading:!0}),l=new pe(.008,.012,1,5),h=new Se(.058,9,6),u=new Se(.052,10,7),d=new Se(.04,10,7),f=18,p=new Gt;p.setAttribute("position",new vt([-.09,-.006,-.048,-.222,.978,.954,-.22,.926,1.003,-.116,-.016,.013,.092,.006,.048,.111,.017,-.013,-.147,.949,1.022,-.147,1,.973,-.009,-.005,.031,.013,.005,-.031,-.182,.938,1.012,-.183,.989,.963,-.307,.65,.188,-.312,.621,.228,-.019,.694,.268,-.022,.665,.306,-.163,.643,.267,-.159,.672,.228,-.297,.86,.531,-.293,.821,.574,-.067,.902,.586,-.066,.864,.627,-.175,.843,.6,-.177,.881,.558,-.197,.361,-.049,-.219,.34,-.003,.061,.399,.021,.046,.378,.065,-.083,.359,.031,-.065,.38,-.014],3)),p.setAttribute("color",new vt([.72,.78,.62,1.113,1.094,.817,1.096,1.081,.808,.72,.78,.62,.726,.785,.623,.735,.792,.628,1.103,1.087,.812,1.12,1.1,.82,.72,.78,.62,.726,.785,.623,1.1,1.084,.81,1.117,1.097,.818,1.003,1.007,.762,.993,.999,.757,1.019,1.019,.769,1.009,1.011,.764,1.001,1.005,.761,1.011,1.013,.766,1.075,1.064,.797,1.062,1.053,.791,1.088,1.075,.804,1.076,1.065,.798,1.069,1.059,.794,1.082,1.069,.801,.897,.922,.709,.889,.915,.704,.912,.934,.716,.904,.927,.712,.896,.921,.708,.905,.928,.712],3)),p.setIndex([10,11,1,2,10,1,6,7,11,10,6,11,19,18,12,13,19,12,2,1,18,19,2,18,21,20,7,6,21,7,15,14,20,21,15,20,21,22,16,15,21,16,6,10,22,21,6,22,22,19,13,16,22,13,10,2,19,22,10,19,18,23,17,12,18,17,1,11,23,18,1,23,23,20,14,17,23,14,11,7,20,23,11,20,25,24,0,3,25,0,13,12,24,25,13,24,27,26,14,15,27,14,4,5,26,27,4,26,27,28,8,4,27,8,15,16,28,27,15,28,28,25,3,8,28,3,16,13,25,28,16,25,24,29,9,0,24,9,12,17,29,24,12,29,29,26,5,9,29,5,17,14,26,29,17,26]),p.scale(1.05,1,.4),p.computeVertexNormals();let y=new te({color:16777215,flatShading:!0,vertexColors:!0}),m=[new tt(5804348),new tt(7317578),new tt(8829784)];function g(W){let st=W*2654435761%4294967296;return()=>(st=(st*1664525+1013904223)%4294967296,st/4294967296)}let x=s.map(W=>Math.max(0,Math.min(r.length-1,W.wariant|0))),_=r.map(()=>0);x.forEach(W=>_[W]++);let v=s.length+256,k=new Ne(l,a,v),M=new Ne(h,c,v*2),T=new Ne(p,y,256*f);k.count=s.length,M.count=s.length*2,T.count=0;let R=[],P=[],w=[];r.forEach((W,st)=>{R.push(new Ne(u,new te({color:W.p,flatShading:!1}),(_[st]+256)*5)),P.push(new Ne(d,new te({color:W.s,flatShading:!1}),_[st]+256)),R[st].count=_[st]*5,P[st].count=_[st],w.push(0)});let b=new it,I=new it,C=new it,U=new it,K=new it,B=[new it,new it],Q=[],G=[],ct=[];b.add(I),I.add(C,U,...B),C.add(K);for(let W=0;W<5;W++){let st=new it;C.add(st),Q.push(st)}for(let W=0;W<f;W++){let st=new it,$=new it;st.add($),I.add(st),G.push(st),ct.push($)}let at=new Et().makeScale(0,0,0);function gt(W,st){let $=g(st+1),ft=Math.max(0,Math.min(4,W.wariant|0)),z=.085+$()*.025,A={x:W.pos[0],z:W.pos[1],typ:W.typ==="trawa"?"trawa":"kwiat",wariant:ft,h:z,iTrawa:W.iTrawa??null,grunt:n(W.pos[0],W.pos[1]),gruntX:W.pos[0],gruntZ:W.pos[1],skala:(.85+$()*.5)*(W.skala!=null?W.skala:1),obrotY:W.obrot!=null?W.obrot:$()*Math.PI*2,bazaZ:($()-.5)*.28,bazaX:($()-.5)*.2,glowaX:-.34+$()*.14,katy:[0,0,0,0,0].map((F,j)=>j/5*Math.PI*2+$()*.1),iLodyga:st,iLisc:[st*2,st*2+1],iSrodek:w[ft],iPlatki:[0,1,2,3,4].map(F=>w[ft]*5+F),gib:{x:0,z:0,vx:0,vz:0}};return w[ft]++,A}function jt(W,st){let $=g(st),ft=[[[0,0]],[[-.065,0],[.065,.012]],[[-.078,-.026],[0,.042],[.082,-.022]],[[-.1,-.012],[-.034,.038],[.038,.032],[.105,-.018]]],z=Math.floor($()*ft.length),A=ft[z],F=Math.min(f,4+A.length+Math.floor($()*4)),j=$()*Math.PI*2,q=.05+$()*.075,Y=.8+$()*.55,Tt=.5+$()*1.05;W.ukladTrawy=z,W.trawa=Array.from({length:f},(ht,dt)=>{let Xt=A[dt%A.length],nt=Xt[0]*Math.cos(j)-Xt[1]*Math.sin(j),wt=Xt[0]*Math.sin(j)+Xt[1]*Math.cos(j),kt=j+dt*2.39996+($()-.5)*.95,Ct=dt<A.length?$()*.022:Math.sqrt($())*q,xt=(.02+$()*.13)*Tt,Yt=Math.floor($()*m.length);return W.iTrawa!=null&&T.setColorAt(W.iTrawa+dt,m[Yt]),{aktywne:dt<F,x:nt+Math.cos(kt)*Ct,z:wt+Math.sin(kt)*Ct,h:(.115+$()*.09+(1-Math.min(1,Ct/q))*.03)*Y,szer:.75+$()*.5,luk:.75+$()*.55,obrot:kt+($()-.5)*2.1,pochylenieX:Math.sin(kt)*xt+($()-.5)*.1,pochylenieZ:-Math.cos(kt)*xt+($()-.5)*.1}})}let Bt=s.map(gt);function Z(W){(W.x!==W.gruntX||W.z!==W.gruntZ)&&(W.grunt=n(W.x,W.z),W.gruntX=W.x,W.gruntZ=W.z),t.ustaw(b,W.x,W.z,W.grunt,0),I.position.set(0,0,0),I.rotation.set(W.bazaX+W.gib.z,W.obrotY,W.bazaZ-W.gib.x);let st=W.skala*(W.szerokoscWzrostu??1);if(I.scale.set(st,W.skala*(W.wzrost??1),st),W.typ==="trawa"){k.setMatrixAt(W.iLodyga,at),M.setMatrixAt(W.iLisc[0],at),M.setMatrixAt(W.iLisc[1],at),P[W.wariant].setMatrixAt(W.iSrodek,at);for(let $=0;$<5;$++)R[W.wariant].setMatrixAt(W.iPlatki[$],at);W.trawa.forEach(($,ft)=>{let z=G[ft],A=ct[ft];z.position.set($.x,0,$.z),z.rotation.set($.pochylenieX,0,$.pochylenieZ),A.position.set(0,-.09*$.h,0),A.rotation.set(0,$.obrot,0),A.scale.set($.h*$.szer,$.h,$.h*$.luk)}),b.updateMatrixWorld(!0),W.trawa.forEach(($,ft)=>T.setMatrixAt(W.iTrawa+ft,$.aktywne?ct[ft].matrixWorld:at));return}U.position.set(0,W.h/2,0),U.scale.set(1,W.h,1),o.forEach(($,ft)=>{let z=B[ft];z.position.set($.strona*.058*$.sk,W.h*$.wys,0),z.rotation.set(0,$.strona>0?.25:-.25,$.obr),z.scale.set(1.35*$.sk,.22*$.sk,.7*$.sk)}),C.position.set(0,W.h,0),C.rotation.set(W.glowaX,0,0),K.position.set(0,.016,0),K.scale.set(1,.58,1),W.katy.forEach(($,ft)=>{let z=Q[ft];z.position.set(Math.cos($)*.066,0,Math.sin($)*.066),z.rotation.set(0,-$,.12),z.scale.set(1.3,.38,.88)}),b.updateMatrixWorld(!0),k.setMatrixAt(W.iLodyga,U.matrixWorld),M.setMatrixAt(W.iLisc[0],B[0].matrixWorld),M.setMatrixAt(W.iLisc[1],B[1].matrixWorld),P[W.wariant].setMatrixAt(W.iSrodek,K.matrixWorld);for(let $=0;$<5;$++)R[W.wariant].setMatrixAt(W.iPlatki[$],Q[$].matrixWorld);if(W.iTrawa!=null)for(let $=0;$<f;$++)T.setMatrixAt(W.iTrawa+$,at)}Bt.forEach(Z);function et(){k.instanceMatrix.needsUpdate=!0,M.instanceMatrix.needsUpdate=!0,T.instanceMatrix.needsUpdate=!0,T.instanceColor&&(T.instanceColor.needsUpdate=!0);for(let W=0;W<r.length;W++)R[W].instanceMatrix.needsUpdate=!0,P[W].instanceMatrix.needsUpdate=!0}et();let Mt=[k,M,T,...R,...P];Mt.forEach(W=>W.frustumCulled=!1);let ut=new Set,Dt=.1,Pt=.84,Ht=[[0,0,0],[.14,1.12,.25],[.38,.82,1.35],[.57,1.12,.9],[.75,.97,1.06],[1,1,1]],Zt=0,Wt=0,L=new S;function Ye(W,st,$=!1){if(!Number.isFinite(W)||!Number.isFinite(st))return!1;let ft=t.normalna(W,st);if(Bt.some(Y=>t.normalna(Y.x,Y.z,L).dot(ft)>Math.cos(.32/t.R)))return!1;let z=(Wt+1)*7919,A=g(z),F=A()<.45?"trawa":"kwiat",j=.62+A()*.46,q;if(Zt<256)q=gt({pos:[W,st],typ:F,wariant:Wt%5,skala:j,iTrawa:Zt*f},Bt.length),Bt.push(q),Zt++,k.count=Bt.length,M.count=Bt.length*2,R[q.wariant].count=w[q.wariant]*5,P[q.wariant].count=w[q.wariant],T.count=Zt*f;else{if(q=Bt.slice(s.length).find(Y=>!ut.has(Y)&&t.normalna(Y.x,Y.z,L).dot(ft)<Math.cos(9/t.R)),!q)return!1;q.x=W,q.z=st,q.typ=F}return q.typ==="trawa"&&jt(q,z*17+12345),Wt++,q.czasWzrostu=0,q.wzrost=$?1:0,q.szerokoscWzrostu=$?1:0,q.gib.x=q.gib.z=q.gib.vx=q.gib.vz=0,$||ut.add(q),Z(q),et(),!0}function qt(W,st=!1){if(ut.size){for(let $ of ut){$.czasWzrostu+=Math.max(0,W);let ft=st?1:Math.max(0,Math.min(1,($.czasWzrostu-Dt)/Pt)),z=1;for(;z<Ht.length-1&&ft>Ht[z][0];)z++;let A=Ht[z-1],F=Ht[z],j=(ft-A[0])/(F[0]-A[0]),q=j*j*(3-2*j);$.szerokoscWzrostu=A[1]+(F[1]-A[1])*q,$.wzrost=A[2]+(F[2]-A[2])*q,Z($),ft===1&&ut.delete($)}et()}}return{lista:Bt,odswiez:Z,oznacz:et,meshe:Mt,posadz:Ye,aktualizujZasiew:qt,stanZasiewu:()=>{let W=Bt.slice(s.length,s.length+Zt);return{zasiane:Zt,rosnace:ut.size,limit:256,trawy:W.filter(st=>st.typ==="trawa").length,kwiaty:W.filter(st=>st.typ==="kwiat").length}}}}function Vp(s,t){let e=new it;e.name="planeta";let n=[],i=Wv(s,t);e.add(i);let r=Hp(t,i),o=qv(s,t);e.add(o);let a=Xv(s,t);e.add(a.mesh);let c=s.sciezka,l=t1(),h=c.length>=3?Math.atan2(c[2].x-c[1].x,c[2].z-c[1].z):0;t.ustaw(l,s.most.pos[0],s.most.pos[1],0,h),s.most.ukryty||e.add(l);let u=s.latarnia.pos,d=Qv();t.ustaw(d,u.x,u.z,0,-.35);let f=lr(1.4);t.ustaw(f,u.x,u.z,0,0),s.latarnia.ukryta||(e.add(d,f),n.push({x:u.x,z:u.z,r:.45}));let p=e1();t.ustaw(p,s.brama.pos[0],s.brama.pos[1],0,0),s.brama.ukryta||(e.add(p),n.push({x:s.brama.pos[0]-1.3,z:s.brama.pos[1],r:.55},{x:s.brama.pos[0]+1.3,z:s.brama.pos[1],r:.55}));let y={sosna:fi,lisciaste:Qa,podwojna:$v},m=s.drzewa?s.drzewa.map(M=>[(y[M.typ]||fi)(M.skala??1),M.pos[0],M.pos[1],M.obrot,M.skala??1,M.typ]):[[fi(1.3),-3.6,1.3],[fi(.9),4.6,-4.2],[Qa(1),4.2,.6],[fi(1.1),-5.2,-3]];for(let[M,T,R,P,w,b]of m){let I=new it,C=r(T,R);t.ustaw(I,T,R,C-.1*(w||1),P??0),I.add(M),e.add(I);let U=b==="podwojna";n.push({x:T,z:R,r:U?1.02:.75,drzewo:M,skalaDrzewa:w||1});let K=lr(U?3.1:2.2,.3);t.ustaw(K,T,R,C+.006,0),e.add(K)}let g=s.glazy?s.glazy.map(M=>[M.pos[0],M.pos[1],M.skala??1,M.obrot,M.wariant??0]):[[-1.8,6.6,1.1],[3.1,3.4,.8],[-2.6,-4.6,1],[1.9,-5.4,.7],[-5.6,4,.9]],x=[[[1.02,.58,.3,1.3],[-.72,.92,.25,2.6]],[[.88,-.46,.28,.5],[-.82,.68,.24,2.2],[.52,.96,.22,1.4]],[[1.02,.52,.3,1.3],[-.8,.9,.25,2.6],[.34,-.92,.27,.4],[-1.04,-.3,.2,1.8],[.86,-.58,.22,2.9]]];for(let[M,[T,R,P,w,b=0]]of g.entries()){let I=new it;I.name=`glaz-${M}`,I.userData.mapaPos=[T,R],I.userData.skala=P;let C=Op(P,!1,b);t.ustaw(C,T,R,r(T,R)-.08*P,w??T*2.1),I.add(C),n.push({x:T,z:R,r:.55*P});for(let[U,[K,B,Q,G]]of x[((b|0)%3+3)%3].entries()){let ct=Op(P*Q,!0,b+U),at=T+K*P,gt=R+B*P;t.ustaw(ct,at,gt,r(at,gt)-.06*P*Q,T+G),I.add(ct)}e.add(I)}for(let M of s.grzyby||[]){if(!Array.isArray(M?.pos))continue;let[T,R]=M.pos,P=M.skala??1,w=r(T,R),b=Jv(P);t.ustaw(b,T,R,w-.02*P,M.obrot??T*1.7),e.add(b);let I=lr(.62*P,.26);t.ustaw(I,T,R,w+.005,0),e.add(I)}let _=null,v=tc(s.schronienie);if(s.schronienie&&Array.isArray(s.schronienie.pos)){let M=s.schronienie,T=M.skala??1,[R,P]=M.pos,w=r(R,P),b=new it;b.name="drzewo-domkowe-kotwica",t.ustaw(b,R,P,w-v.zanurzeniePnia*T,M.obrot??0);let I=Bu(T,v);b.add(I),e.add(b),_=b,n.push({x:R,z:P,r:.62*T,drzewo:I,skalaDrzewa:T,domkowe:!0});let C=lr(4*T,.32);t.ustaw(C,R,P,w+.006,0),e.add(C)}let k=n1(s.kwiaty,t,i,r);return k&&k.meshe.forEach(M=>e.add(M)),{group:e,ziemia:i,sciezki:o,lantern:d,gate:p,bridge:l,obrotMostu:h,blockers:n,kwiaty:k,nurtTik:a.tik,wysokoscGruntu:r,kotwicaDomku:_,ukladDomku:v}}var Oi=s=>new te({color:s,flatShading:!0});function ec(s,t,e=[0,0,0],n=[0,0,0],i=1){let r=new At(s,t);return r.position.set(...e),r.rotation.set(...n),r.scale.setScalar(i),r}var Qe={suchy:Oi(9074007),suchyCiemny:Oi(7035201),ciecie:Oi(14202232),kora:Oi(8020292),skala:Oi(9538424),skalaJasna:Oi(11182989),skalaCiemna:Oi(7433312),mech:Oi(6720325)};function Gu(s,t,e=8){let n=new pe(t,t*.94,s,e);return new At(n,[Qe.kora,Qe.ciecie,Qe.ciecie])}function Wu(s=1){let t=new it;t.name="pieniek";let e=new At(new pe(.24*s,.3*s,.34*s,7),[Qe.kora,Qe.ciecie,Qe.ciecie]);return e.position.y=.17*s,t.add(e),t}function io(s=1,{szczapy:t=!0}={}){let e=new it;e.name="stos-drewna",e.rotation.y=.38;let n=1.05*s,i=.145*s;[[-.3,0],[0,.015],[.3,-.01]].forEach(([o,a],c)=>{let l=Gu(n,i*(c===1?1.08:1));l.rotation.set(0,0,Math.PI/2),l.position.set(0,i+a*s,o*s),e.add(l)}),[[-.155,.05],[.155,-.03]].forEach(([o,a])=>{let c=Gu(n*.93,i*.96);c.rotation.set(0,0,Math.PI/2),c.position.set(a*s,i*2.75,o*s),e.add(c)});let r=Gu(n*.86,i*.9);return r.rotation.set(0,.16,Math.PI/2),r.position.set(-.04*s,i*4.4,0),e.add(r),t&&[[-.62,.34,.42],[.66,-.3,-.5]].forEach(([o,a,c])=>{let l=ec(new ze(.13*s,.62*s,.17*s),Qe.ciecie,[o*s,.3*s,a*s],[.12,.6,c]);e.add(l),e.add(ec(new ze(.04*s,.62*s,.17*s),Qe.kora,[(o+(o<0?-.07:.07))*s,.3*s,a*s],[.12,.6,c]))}),e}function nc(s=1){let t=new it;t.name="kamyczki";let e=[[0,.21,0,.36,Qe.skala,[1.1,.86,.95],[.4,.9,.2]],[-.34,.14,.14,.26,Qe.skalaJasna,[1.18,.74,.92],[.8,.3,.5]],[.32,.13,-.1,.24,Qe.skalaCiemna,[.95,.78,1.12],[.2,1.2,.7]],[.1,.1,.33,.19,Qe.skalaJasna,[1.05,.7,.9],[.6,.5,.9]],[-.14,.09,-.3,.17,Qe.skala,[1.15,.74,.92],[.9,.7,.3]],[.26,.07,.3,.13,Qe.skalaCiemna,[1.1,.7,.95],[.3,.2,.6]]];for(let[i,r,o,a,c,l,h]of e){let u=ec(new $s(a*s,0),c,[i*s,r*s,o*s],h);u.scale.set(l[0]*s,l[1]*s,l[2]*s),t.add(u)}let n=ec(new fn(.13*s,0),Qe.mech,[.02*s,.37*s,.02*s]);return n.scale.set(1.3*s,.32*s,1.1*s),t.add(n),t}var Fi=s=>new te({color:s,flatShading:!0});function i1(s,t,e=[0,0,0],n=[0,0,0]){let i=new At(s,t);return i.position.set(...e),i.rotation.set(...n),i}var gi={kora:Fi(8020292),ciecie:Fi(14202232),klepisko:Fi(9272668),kamien:Fi(9538424),kamienCiemny:Fi(7433312),deska:Fi(13081183),deskaCiemna:Fi(11042636),sznur:Fi(14272932)};function s1(s,t){return(s.zanurzeniePnia??En.zanurzeniePnia)-hr/t}function r1(){let s=[[-.41427052,-.30291837,-.24878431],[-1.13633203,1.41746652,-.24878434],[.58405584,2.13952922,-.24878434],[1.30611825,.41914355,-.24878431],[1.30611681,.41914397,-.43536165],[-.41427075,-.30291754,-.43536165],[-1.13633108,1.41746676,-.43536162],[.58405667,2.13952827,-.43536162]],t=[[4,3,2,1],[4,1,6,5],[6,1,2,7],[8,5,6,7],[3,4,5,8],[3,8,7,2]],e=[];for(let[o,a,c,l]of t)for(let[h,u,d]of[[o,a,c],[o,c,l]])e.push(...s[h-1],...s[u-1],...s[d-1]);let n=new Gt;n.setAttribute("position",new vt(e,3)),n.rotateX(-Math.PI/2),n.rotateY(Math.atan2(-(s[3][1]-s[0][1]),s[3][0]-s[0][0])),n.computeBoundingBox();let i=n.boundingBox;n.translate(-(i.min.x+i.max.x)/2,-i.max.y,-(i.min.z+i.max.z)/2);let r=Math.max(i.max.x-i.min.x,i.max.z-i.min.z);return n.scale(1/r,1/r,1/r),n.computeVertexNormals(),n}var o1=r1();function Xu(s,t,e,n=gi.deska){return new At(new ze(s,e,t),n)}function a1(s=1,t=En){let e=new it;e.name="domek-na-drzewie-etap-1";let n=(t.klepiskoR??1.06)*s,i=i1(new ki(n,14),gi.klepisko,[0,.012*s,0],[-Math.PI/2,0,.3]);i.name="schronienie-klepisko",i.userData.krok=0,i.userData.promien=n,i.userData.przyZiemi=!0,e.add(i);let r=(t.poziom-s1(t,s))*s,o=t.pomostOd*s,a=(t.zasiegKonaru-.12)*s,c=(o+a)/2,l=Math.max(.2*s,a-o),h=t.pomostPol*s,u=(l+h*2)/2,d=new At(o1,gi.deska);d.position.set(c,r,0),d.scale.set(l,u,h*2),d.userData.krok=2,e.add(d);for(let C=0;C<3;C++){let U=Xu(l*.94,.07*s,.035*s,gi.deskaCiemna);U.position.set(c,r+.018*s,(C-1)*h*.62),U.userData.krok=2,e.add(U)}let f=t.barierka*s;for(let[C,U]of[[a-.1*s,-h+.1*s],[a-.1*s,h-.1*s],[c,-h+.1*s],[c,h-.1*s],[o+.18*s,-h+.1*s],[o+.18*s,h-.1*s]]){let K=new At(new pe(.045*s,.055*s,f,5),gi.kora);K.position.set(C,r+f/2,U),K.userData.krok=3,e.add(K)}for(let C of[.62,1]){for(let K of[-1,1]){let B=Xu(l-.2*s,.06*s,.06*s,gi.deska);B.position.set(c,r+f*C,K*(h-.1*s)),B.userData.krok=3,e.add(B)}let U=Xu(.06*s,h*2-.2*s,.06*s,gi.deska);U.position.set(o+.18*s,r+f*C,0),U.userData.krok=3,e.add(U)}let p=a-.06*s,y=r+.1*s,m=a+t.drabinkaOdsun*s,g=t.drabinkaSpadek??0,x=Math.atan2(m-p,y-g),_=Math.hypot(m-p,y-g),v=_*(t.drabinkaDlugosc??1),k=(p-m)/_,M=(y-g)/_,T=m+k*v,R=g+M*v,P=(m+T)/2,w=(g+R)/2;for(let C of[-1,1]){let U=new At(new pe(.05*s,.06*s,v,5),gi.kora);U.position.set(P,w,C*.26*s),U.rotation.set(0,0,x),U.userData.krok=4,U.userData.przyZiemi=!0,e.add(U)}let b=.38*s,I=Math.max(3,Math.min(16,Math.round(v/b)));for(let C=0;C<I;C++){let U=(C+.5)/I,K=new At(new pe(.055*s,.055*s,.6*s,6),gi.sznur);K.position.set(m+k*v*U,g+M*v*U,0),K.rotation.set(Math.PI/2,0,0),K.userData.krok=4,K.userData.przyZiemi=!0,e.add(K)}return e}var Ku=[a1];function Gp(s=1,t=1,e=En){let n=new it;n.name="schronienie";for(let i=0;i<Math.min(s,Ku.length);i++)n.add(Ku[i](t,e));return n}var ju=Ku.length;var c1=.95,l1=.7;function ic(s,t,e){let n=Math.min(1,Math.max(0,(s-t)/Math.max(1e-6,e-t)));return n*n*(3-2*n)}var so=null;function h1(){if(so)return so;let s=document.createElement("canvas");s.width=s.height=128;let t=s.getContext("2d"),e=t.createRadialGradient(64,64,2,64,64,64);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.35,"rgba(255,255,255,0.5)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,128,128),so=new he(s),so.colorSpace=Vt,so}function qu(s,t=.24){let e=new At(new oi(.4,.66,64),new ne({color:s,transparent:!0,opacity:t,side:de,depthWrite:!1}));if(e.rotation.x=-Math.PI/2,e.position.y=.03,t<=0)return e;let n=new oi(.4,.68,64),i=n.getAttribute("position"),r=i.count,o=new Float32Array(r*4),a=new Float32Array(r);for(let l=0;l<r;l++){o[l*4]=o[l*4+1]=o[l*4+2]=1,o[l*4+3]=0;let h=Math.atan2(i.getY(l),i.getX(l));a[l]=h<0?h+Math.PI*2:h}n.setAttribute("color",new vt(o,4));let c=new At(n,new ne({color:s,vertexColors:!0,transparent:!0,opacity:1,side:de,depthWrite:!1,blending:Dn}));return c.position.z=.004,c.__katy=a,e.add(c),e.smuga=c,e}function Yu(s,t,e){let n=s.smuga;if(!n)return;let i=n.geometry.getAttribute("color"),r=n.__katy,o=r.length,a=t*1.25%(Math.PI*2),c=1.35,l=Math.min(2.2,e);for(let h=0;h<o;h++){let u=(a-r[h])%(Math.PI*2);u<0&&(u+=Math.PI*2);let d=u<c?1-u/c:0;i.setW(h,d*d*d*.85*l)}i.needsUpdate=!0}var sc=class{constructor(t,e,n=0,i){this.def=t,this.id=t.id,this.planeta=i,this.time=Math.random()*6.28,this.wake=0,this.punch=0,this.touches=0,this.state="idle",this.phase=0,this.fade=1,this.armed=!0,this.mapa={x:t.pos[0],z:t.pos[1]},this.n=i.normalna(t.pos[0],t.pos[1]),this.root=new it,i.ustaw(this.root,t.pos[0],t.pos[1],n,0);let r=new Ee().setFromObject(e),o=new S;r.getSize(o);let a=.55*(t.scale??1)/Math.max(.001,o.y);e.scale.setScalar(a),r.setFromObject(e),e.position.sub(r.getCenter(new S)),this.mats=[],e.traverse(c=>{let l=c.material?Array.isArray(c.material)?c.material:[c.material]:[];for(let h of l)this.mats.push(h),(t.absorb||t.cykl>0)&&(h.transparent=!0,h.depthWrite=!0),h.metalness=t.metalness??0,h.roughness=t.roughness??.85,h.metalnessMap=null,h.roughnessMap=null,t.barwa!=null?h.color.setHex(t.barwa).multiplyScalar(t.jasnosc??1.35):t.wlasneKolory?h.color.multiplyScalar(t.jasnosc??1):h.color.setScalar(t.jasnosc??1.35),t.barwaMnoznik!=null&&(h.color.r*=(t.barwaMnoznik>>16&255)/255,h.color.g*=(t.barwaMnoznik>>8&255)/255,h.color.b*=(t.barwaMnoznik&255)/255),h.map&&(h.emissiveMap=h.map,h.emissive.setScalar(1),h.emissiveIntensity=0),h.needsUpdate=!0}),t.faceCamera&&(e.rotation.y=Math.atan2(.465,.885),e.rotation.x=-.5),this.spin=new it,this.spin.position.y=t.height??1.1,this.spin.add(e),this.root.add(this.spin),this.haloBase=t.haloOpacity??.2,this.ringBase=t.ringOpacity??.22,this.lightBase=t.lightBase??2.2,this.halo=new De(new Le({map:h1(),color:t.glow,transparent:!0,opacity:this.haloBase,blending:Dn,depthWrite:!1})),this.halo.scale.setScalar(t.haloScale??1.75),this.halo.position.y=t.height??1.1,this.root.add(this.halo),this.light=new mn(t.glow,this.lightBase,6.5,2),this.light.position.y=(t.height??1.1)-.1,this.lightBase>0&&this.root.add(this.light),this.ring=qu(t.ringColor??t.glow,this.ringBase),this.root.add(this.ring),this.hit=new At(new Se(.85,10,8),new ne({visible:!1})),this.hit.position.y=t.height??1.1,this.hit.userData.marker=this,this.root.add(this.hit),this.sparks=[]}update(t,e=1,n=99){this.time+=t,this.mixer&&this.mixer.update(t);let i=0,r=0,o=1;if(this.state==="absorb"){this.phase=Math.min(1,this.phase+t/c1);let p=this.phase;i=(1-(1-p)*(1-p))*(this.def.absorbLift??1.7),o=1+.45*Math.sin(Math.min(1,p/.45)*Math.PI*.5)-1.05*ic(p,.5,1),r=Math.sin(Math.min(1,p/.75)*Math.PI),this.fade=1-ic(p,.42,.92),p>=1&&(this.state="gone",this.phase=0,this.setVisible(!1))}else if(this.state==="gone"){this.phase+=t;let p=(this.powroty?this.def.respawn:this.def.respawnPierwszy??this.def.respawn)??3.2;this.phase>=p&&(this.powroty=(this.powroty||0)+1,this.przenies(),this.state="appear",this.phase=0,this.setVisible(!0),this.def.cykl>0&&this.sparkBurst(this.def.iskry??18,this.def.iskrySila??1.35));return}else if(this.state==="appear"){this.phase=Math.min(1,this.phase+t/l1);let p=this.phase;i=(1-p)*.55,o=.25+.75*ic(p,0,1),r=Math.sin(p*Math.PI)*.7,this.fade=ic(p,.05,.6),p>=1&&(this.state="idle",this.phase=0,this.fade=1)}this.state==="idle"&&this.def.cykl>0&&(this.phase+=t)>=this.def.cykl&&this.startAbsorb(!0);for(let p of this.mats)p.transparent&&(p.opacity=this.fade);n>(this.def.zbrojenie??1.7)&&(this.armed=!0);let a=n<3.2?1:0;this.wake+=(a-this.wake)*(1-Math.exp(-4*t)),this.punch=Math.max(0,this.punch-t*2.2);let c=this.punch*this.punch,l=this.def.bezUnoszenia?0:Math.sin(this.time*1.6)*(.09+.05*this.wake)*e;this.spin.position.y=(this.def.height??1.1)+l+(this.def.bezUnoszenia?0:c*.35)+i,this.def.faceCamera?this.spin.rotation.y=Math.sin(this.time*.9)*.38*e+c*1.6+r*1.1:this.def.bezObrotu?this.spin.rotation.y=this.def.obrotY??0:this.spin.rotation.y+=t*(.7+2.4*c);let h=this.def.oddechSkali??1,u=Math.max(0,(1+.08*this.wake*h+.4*c*(this.def.oddechDotyku??h))*o);if(this.spin.scale.setScalar(u),this.def.bujanie!=null)if(this.buj!=null)if((this.buj+=t)>2.6)this.buj=null,this.spin.rotation.z=0,this.spin.position.x=0;else{let p=this.def.bujanie*Math.exp(-1.5*this.buj)*Math.sin(7.5*this.buj),y=.275*(this.def.scale??1);this.spin.rotation.z=p,this.spin.position.x=-y*Math.sin(p),this.spin.position.y-=y*(1-Math.cos(p))}else this.spin.rotation.z=0,this.spin.position.x=0;let d=1+Math.sin(this.time*2.2)*.16,f=1+.45*this.wake+1.6*c+3.2*r;this.halo.position.y=this.spin.position.y,this.halo.scale.setScalar((this.def.haloScale??1.75)*d*f),this.halo.material.opacity=Math.min(1,this.haloBase*f),this.light.intensity=this.lightBase*d*f,this.ring.material.opacity=Math.min(1,this.ringBase*(.92+.5*(.5+.5*Math.sin(this.time*2.2)))*f),this.ring.scale.setScalar(1+.06*Math.sin(this.time*2.2)+.35*c+.5*r),Yu(this.ring,this.time,f);for(let p=this.sparks.length-1;p>=0;p--){let y=this.sparks[p];y.userData.life-=t*1.4,y.userData.vel.y-=t*1.8,y.position.addScaledVector(y.userData.vel,t),y.material.opacity=Math.max(0,y.userData.life),y.userData.life<=0&&(this.root.remove(y),this.sparks.splice(p,1))}}touch(t=!1){return this.state!=="idle"||this.punch>.55||this.def.raz&&!this.armed?!1:(this.def.raz&&(this.armed=!1),t&&(this.punch=1,this.def.bujanie&&(this.buj=0),this.sparkBurst(12,1)),this.touches++,!0)}startAbsorb(t=!1){return this.state!=="idle"||!t&&!this.armed?!1:(this.armed=!1,this.state="absorb",this.phase=0,this.punch=0,this.touches++,this.sparkBurst(this.def.iskry??18,this.def.iskrySila??1.35),!0)}get ready(){return this.state==="idle"}przenies(){let t=this.def._pozycje;if(!t||t.length<2)return;let e=t[Math.floor(Math.random()*t.length)];this.mapa={x:e[0],z:e[2]},this.planeta.normalna(e[0],e[2],this.n),this.planeta.ustaw(this.root,e[0],e[2],e[1],0)}ustawAktywny(t){this.aktywny!==t&&(this.aktywny=t,this.root.visible=t)}setVisible(t){if(this.spin.visible=t,this.halo.visible=t,this.light.visible=t,this.ring.visible=t,this.hit.visible=!1,this.hit.userData.off=!t,t)this.spin.scale.setScalar(.25);else{for(let e of this.sparks)this.root.remove(e);this.sparks.length=0,this.light.intensity=0,this.halo.material.opacity=0,this.ring.material.opacity=0}}sparkBurst(t,e){let n=new Se(.05,6,5);for(let i=0;i<t;i++){let r=new At(n,new ne({color:this.def.glow,transparent:!0,opacity:1}));r.position.copy(this.spin.position);let o=i/t*Math.PI*2;r.userData={vel:new S(Math.cos(o)*e,1.2+Math.random()*.9,Math.sin(o)*e),life:1},this.root.add(r),this.sparks.push(r)}}get worldPos(){return this.mapa}};var ur=28,Zu=.22,u1=1.05,Wp=.45,d1=1.65,f1=.15,p1=2.8,m1=.22,g1=-.28,y1=.85,_1=.55,x1=7,Xp=2.9,$u=.9,Kp=.085,w1=.165,v1=5152702,jp=.16,rc=class{constructor(t,e,n){this.planeta=t,this.wysokoscGruntu=n||null;let i=new ki(1,18);i.rotateX(-Math.PI/2),this.geo=i,this.mesh=new Ne(i,new ne({color:v1,toneMapped:!1}),ur),this.mesh.name="mokre-slady",this.mesh.frustumCulled=!1,this.mesh.count=ur,e.add(this.mesh),this._pusta=new Et().makeScale(0,0,0);for(let r=0;r<ur;r++)this.mesh.setMatrixAt(r,this._pusta);this.mesh.instanceMatrix.needsUpdate=!0,this.plamki=Array.from({length:ur},()=>({wiek:0,zyje:!1})),this.nastepna=0,this.wilgoc=0,this.wWodzie=!1,this.brodzil=!1,this.droga=0,this.odstep=Zu,this.strona=!1,this._poprzednia=null,this._pom=new fe,this._barwa=new tt,this._n=new S,this._bok=new S,this._p={x:0,z:0,h:0}}zamocz(){this.wilgoc=1}tik(t,e,n,i,r=!1){let o=!1,a=!1;for(let l of i||[]){if(!l)continue;let h=this.planeta.odleglosc(e,l.n);if(h<l.promien*y1&&(o=!0,this.zamocz()),h<l.promien*_1&&(a=!0),o&&a)break}if(this.wWodzie=o,this._wysuszaj(t),!this._poprzednia){this._poprzednia=e.clone();return}let c=this.planeta.odleglosc(e,this._poprzednia);if(this._poprzednia.copy(e),c>2||r){this.droga=0;return}if(!(this.wilgoc<=0||c<1e-5)){if(this.wilgoc=Math.max(0,this.wilgoc-c/x1),a){this.droga=0,this.brodzil=!0;return}if(this.brodzil){this.brodzil=!1,this.droga=0,this._postaw(e,n),this._losujOdstep();return}this.droga+=c,!(this.droga<this.odstep)&&(this.droga=0,this._postaw(e,n),this._losujOdstep())}}_losujOdstep(){let t=Zu+(u1-Zu)*(1-this.wilgoc),e=Wp+Math.random()*(d1-Wp);this.odstep=t*e}_postaw(t,e){let n=this.planeta,i=1+(p1-1)*this.wilgoc,r=g1*(.7+Math.random()*.6)-(Math.random()-.35)*.34*(i-1);n.punktObok(t,e,r,this._n),this._bok.crossVectors(this._n,e).normalize(),Math.random()>=m1&&(this.strona=!this.strona);let o=f1*(.45+Math.random()*1.1)*i;n.punktObok(this._n,this._bok,this.strona?o:-o,this._n);let a=n.zKuli(this._pom.position.copy(this._n).multiplyScalar(n.R),this._p),c=(this.wysokoscGruntu?this.wysokoscGruntu(a.x,a.z):0)+.018,l=this.nastepna;this.nastepna=(this.nastepna+1)%ur;let h=this.plamki[l];h.wiek=0,h.zyje=!0,h.x=a.x,h.z=a.z,h.h=c,h.obrot=Math.random()*Math.PI,h.promien=(Kp+Math.random()*(w1-Kp))*(.55+.45*this.wilgoc),this._odswiez(l,1);let u=1-jp/2+Math.random()*jp;this.mesh.setColorAt(l,this._barwa.setRGB(u,u,u)),this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}_odswiez(t,e){let n=this.plamki[t],i=this._pom;this.planeta.ustaw(i,n.x,n.z,n.h,n.obrot);let r=n.promien*e;i.scale.set(r,1,r),i.updateMatrix(),this.mesh.setMatrixAt(t,i.matrix),this.mesh.instanceMatrix.needsUpdate=!0}_wysuszaj(t){for(let e=0;e<ur;e++){let n=this.plamki[e];if(!n.zyje)continue;if(n.wiek+=t,n.wiek>=Xp){n.zyje=!1,this.mesh.setMatrixAt(e,this._pusta),this.mesh.instanceMatrix.needsUpdate=!0;continue}if(n.wiek<=$u)continue;let i=1-(n.wiek-$u)/(Xp-$u);this._odswiez(e,i*i)}}zniszcz(){this.mesh.parent?.remove(this.mesh),this.mesh.material.dispose(),this.geo.dispose()}};var ac=(s,t,e)=>s<t?t:s>e?e:s,ro=(s,t,e)=>{let n=ac((e-s)/(t-s||1e-6),0,1);return n*n*(3-2*n)},M1=(s,t,e,n)=>s+(t-s)*(1-Math.exp(-e*n)),b1={niebo:{dzien:9423332,zorza:14256734,noc:2371911,silaZorzy:1,stopnie:[0,.16,.42,1],gradient:{dzien:{horyzont:14479095,nisko:11131120,srodek:7059172,zenit:4035542},poranek:{horyzont:16769976,nisko:16498592,srodek:15968702,zenit:10274020},zorza:{horyzont:16761963,nisko:16354923,srodek:14252966,zenit:8943784},noc:{horyzont:3039106,nisko:2573946,srodek:1781598,zenit:1253191}}},slonceTarcza:{rdzen:16776690,poswiataDzien:16771496,poswiataZorza:16751429,wielkosc:.95,rozmycieZorzy:.7,spowolnienieHoryzontu:.35,zasiegX:.93,szczyt:.48,zanurzenie:.05},ksiezyc:{barwa:16774876,wielkosc:1.15},ziemia:{dzien:16121830,zorza:16766634,noc:7445420,emisjaNoc:1195083,emisjaZorza:5588776},slonce:{dzien:16773327,zorza:16757598,moc:1.8},wypelnienie:{dzien:16773855,noc:9551331,mocDzien:.7,mocNoc:.8},hemisfera:{goraDzien:14214399,dolDzien:5600831,goraNoc:7711177,dolNoc:2376789,zorzaGora:16756848,mocDzien:1.05,mocNoc:.78},ambient:{dzien:8425664,noc:6851770,mocDzien:.3,mocNoc:.38},chmury:{dzien:16777215,zorza:16761763,noc:7902653,emisjaNoc:2308962},gwiazdy:{krycie:.85},progi:{dzienDo:52,zmierzchDo:98,nocOd:90,nocPelna:140,zorzaSrodek:90,zorzaSzerokosc:26.4},tempo:1.5,zrodlo:"czas",sesja:{minutyDnia:15,minutySesji:15,switStopnie:90}};function S1(s){let t=s.zorzaSrodek-s.zorzaSzerokosc*Math.sqrt(Math.log(2.857142857142857)),e=s.nocOd+(s.nocPelna-s.nocOd)*.53349;return{zmierzch:t,noc:e}}var qp=179.5;function A1(s,t){if(!t)return s;let e={};for(let n of Object.keys(s))e[n]=typeof s[n]=="object"&&s[n]!==null?{...s[n],...t[n]||{}}:t[n]??s[n];return e}var zn=new tt,Re=new tt,T1=new tt,oo=new S,Yp=new S,Zp=new S,oc=new S,E1={x:0,y:0},z1={x:0,y:0};function R1(s="#fff6d8",t="#ffd98a"){let e=document.createElement("canvas");e.width=e.height=128;let n=e.getContext("2d"),i=n.createRadialGradient(64,64,0,64,64,64);i.addColorStop(0,s),i.addColorStop(.32,s),i.addColorStop(.46,t),i.addColorStop(1,"rgba(255,220,140,0)"),n.fillStyle=i,n.fillRect(0,0,128,128);let r=new he(e);return r.colorSpace=Vt,r}function k1(){let s=document.createElement("canvas");s.width=s.height=128;let t=s.getContext("2d");t.fillStyle="#fff6dc",t.beginPath(),t.arc(64,64,46,0,Math.PI*2),t.fill(),t.globalCompositeOperation="destination-out",t.beginPath(),t.arc(43,48,43,0,Math.PI*2),t.fill();let e=new he(s);return e.colorSpace=Vt,e}function C1(){let s=document.createElement("canvas");s.width=s.height=256;let t=s.getContext("2d"),e=t.createRadialGradient(128,128,0,128,128,128);e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.48,"rgba(255,255,255,1)"),e.addColorStop(.67,"rgba(255,255,255,.90)"),e.addColorStop(.82,"rgba(255,255,255,.36)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,256,256);let n=new he(s);return n.colorSpace=Vt,n}function P1(){let s=new Mn({uniforms:{zenit:{value:new tt(2371911)},srodek:{value:new tt(2768739)},nisko:{value:new tt(2901616)},horyzont:{value:new tt(3099256)},stopnie:{value:new $t(0,.16,.42,1)},srodekPlanety:{value:new $t(0,0,1,1)},wysokoscNieba:{value:.4},noc:{value:0},aspekt:{value:1}},vertexShader:`
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
    `,depthTest:!1,depthWrite:!1,toneMapped:!1}),t=new At(new Hn(2,2),s);return t.frustumCulled=!1,t.renderOrder=-2e3,t.name="nieboskLon",t}var cc=class{constructor(t){this.C=A1(b1,t.strojenie),this.scena=t.scena,this.slonce=t.slonce,this.wypelnienie=t.wypelnienie,this.hemisfera=t.hemisfera,this.ambient=t.ambient,this.gwiazdy=t.gwiazdy,this.ziemia=t.ziemia||null,this.slonceN=t.slonceN.clone().normalize(),this._sw=this.slonceN.clone(),this._orbita=new S,this.ustawSlonce(this.slonceN),this.faza=null,this.naCzas=this.C.zrodlo==="czas",this._granice=S1(this.C.progi),this.czas=0;let e=this.C.sesja;this.stopnieNaSek=Number.isFinite(e.minutySesji)&&e.minutySesji>0?(e.switStopnie+qp)/(e.minutySesji*60):(e.switStopnie+this._granice.zmierzch)/Math.max(1,e.minutyDnia*60),this.sekundaZachodu=(e.switStopnie+this._granice.zmierzch)/this.stopnieNaSek,this.sekundaKonca=(e.switStopnie+qp)/this.stopnieNaSek,this.sekundaZmroku=(e.switStopnie+this._granice.noc)/this.stopnieNaSek,this.etapSesji="dzien",this.nieboskLon=P1(),this.scena.add(this.nieboskLon);let n=this.C,i=(r,o)=>{let a=new De(new Le({map:r,transparent:!0,depthWrite:!1,opacity:0,toneMapped:!1}));return a.scale.setScalar(o),a.renderOrder=-1e3,a};this.rdzenSlonca=i(C1(),n.slonceTarcza.wielkosc),this.poswiata=i(R1("#ffffff","#ffffff"),n.slonceTarcza.wielkosc*2.2),this.tarczaKsiezyca=i(k1(),n.ksiezyc.wielkosc),this.t=null,this.stan={t:0,dzien:1,noc:0,zorza:0,pora:"dzien"}}podepnijDoKamery(t){t.add(this.rdzenSlonca,this.poswiata,this.tarczaKsiezyca),this.kamera=t}_sylwetka(t,e,n){oc.set(0,0,0).project(t);let i=(this.promienPlanety||8)/e,r=(this.promienPlanety||8)/n;return{cx:oc.x,cy:oc.y,rx:i,ry:r,niebo:Math.max(.02,(1-oc.y)/r-1)}}_wKadrze(t,e,n,i,r){t.position.set(e.dot(oo)*n*.78,i*(.54+.3*e.y),r)}odSwitu(){this.czas=0,this.etapSesji="dzien",this.naCzas&&(this.faza=-this.C.sesja.switStopnie*Math.PI/180)}przewin(t){this.naCzas&&(this.czas=ac(t,0,this.sekundaKonca))}ustawSlonce(t){this.slonceN.copy(t).normalize(),this._orbita.set(0,0,1).addScaledVector(this.slonceN,-this.slonceN.z),this._orbita.lengthSq()<1e-8&&this._orbita.set(1,0,0),this._orbita.normalize()}aktualizuj(t,e,n=.016){let i=this.C;if(this.naCzas)this.czas=Math.min(this.czas+Math.max(0,n),this.sekundaKonca),this.faza=(-i.sesja.switStopnie+this.czas*this.stopnieNaSek)*Math.PI/180,this.etapSesji=this.czas>=this.sekundaKonca?"koniec":this.czas>=this.sekundaZmroku?"noc":this.czas>=this.sekundaZachodu?"zachod":"dzien";else{let y=-t.dot(this._orbita),m=t.dot(this.slonceN),g=Math.hypot(y,m)>1e-6?Math.atan2(y,m):this.faza??0;if(this.faza===null||this.t===null)this.faza=g;else{let x=Math.atan2(Math.sin(g-this.faza),Math.cos(g-this.faza));this.faza+=M1(0,x,i.tempo,n)}}let r=Math.atan2(Math.sin(this.faza),Math.cos(this.faza)),o=r+ac(i.slonceTarcza.spowolnienieHoryzontu,0,.45)*Math.sin(2*r),a=this.t=Math.cos(o),c=Math.abs(r)*180/Math.PI,l=1-ro(i.progi.dzienDo,i.progi.zmierzchDo,c),h=ro(i.progi.nocOd,i.progi.nocPelna,c),u=(c-i.progi.zorzaSrodek)/i.progi.zorzaSzerokosc,d=Math.exp(-u*u),f=1-ro(-.2,.2,Math.sin(o));if(this.kamera&&this.kamera.matrixWorld.extractBasis(oo,Yp,Zp),this._sw.set(oo.x,0,oo.z).normalize().multiplyScalar(Math.sin(o)),this._sw.y=a,this.slonce.position.copy(this._sw).multiplyScalar(30),this.slonce.intensity=i.slonce.moc*Math.max(l,d*.6),this.slonce.color.copy(zn.set(i.slonce.zorza)).lerp(Re.set(i.slonce.dzien),l),this.wypelnienie.intensity=i.wypelnienie.mocNoc+(i.wypelnienie.mocDzien-i.wypelnienie.mocNoc)*l+d*(.5+.35*f),this.wypelnienie.color.copy(zn.set(i.wypelnienie.noc)).lerp(Re.set(i.wypelnienie.dzien),l),this.hemisfera.intensity=i.hemisfera.mocNoc+(i.hemisfera.mocDzien-i.hemisfera.mocNoc)*l+d*.65,this.hemisfera.color.copy(zn.set(i.hemisfera.goraNoc)).lerp(Re.set(i.hemisfera.goraDzien),l),i.hemisfera.zorzaGora&&this.hemisfera.color.lerp(Re.set(i.hemisfera.zorzaGora),d*(1-.6*l)*.35),this.hemisfera.groundColor.copy(zn.set(i.hemisfera.dolNoc)).lerp(Re.set(i.hemisfera.dolDzien),l),this.ambient.intensity=i.ambient.mocNoc+(i.ambient.mocDzien-i.ambient.mocNoc)*l,this.ambient.color.copy(zn.set(i.ambient.noc)).lerp(Re.set(i.ambient.dzien),l),this.scena.background&&this.scena.background.copy(zn.set(i.niebo.noc)).lerp(Re.set(i.niebo.dzien),l).lerp(Re.set(i.niebo.zorza),d*(1-.55*l)*i.niebo.silaZorzy),this.nieboskLon){let y=this.nieboskLon.material.uniforms,m=d*(1-.55*l)*i.niebo.silaZorzy;y.noc.value=h,y.aspekt.value=this.kamera?(this.kamera.right-this.kamera.left)/(this.kamera.top-this.kamera.bottom):1;let g=i.niebo.gradient,x=i.niebo.stopnie;if(y.stopnie.value.set(x[0],x[1],x[2],x[3]),this.kamera&&this.promienPlanety){let _=this.kamera,v=(_.right-_.left)/2/(_.zoom||1),k=(_.top-_.bottom)/2/(_.zoom||1),M=this._sylwetka(_,v,k);y.srodekPlanety.value.set(M.cx,M.cy,M.rx,M.ry),y.wysokoscNieba.value=M.niebo}for(let _ of["horyzont","nisko","srodek","zenit"])y[_].value.copy(zn.set(g.noc[_])).lerp(Re.set(g.dzien[_]),l).lerp(Re.set(g.zorza[_]).lerp(T1.set(g.poranek[_]),f),m)}if(this.ziemia?.material){let y=this.ziemia.material;y.color.copy(zn.set(i.ziemia.noc)).lerp(Re.set(i.ziemia.dzien),l).lerp(Re.set(i.ziemia.zorza),d*(1-.5*l)*.7),y.emissive&&y.emissive.copy(zn.set(0)).lerp(Re.set(i.ziemia.emisjaNoc),h).lerp(Re.set(i.ziemia.emisjaZorza),d*(1-l)*.6)}if(this.kamera){let y=this.kamera;y.matrixWorld.extractBasis(oo,Yp,Zp);let m=(y.right-y.left)/2/(y.zoom||1),g=(y.top-y.bottom)/2/(y.zoom||1),x=this._sylwetka(y,m,g),_=R=>i.slonceTarcza.szczyt*Math.cos(R)-i.slonceTarcza.zanurzenie,v=(R,P)=>{let w=Math.sin(R)*i.slonceTarcza.zasiegX,b=1-Math.min(1,(w-x.cx)*(w-x.cx)/(x.rx*x.rx)),I=x.cy+x.ry*Math.sqrt(Math.max(0,b));return P.x=w*m,P.y=(I+Math.max(0,1-I)*_(R))*g,P},k=v(o,E1),M=k.x;this.rdzenSlonca.position.set(k.x,k.y,-50),this.poswiata.position.set(k.x,k.y,-50.5),this.rdzenSlonca.material.opacity=ro(-.52,-.2,a)*(.94-.12*l),this.rdzenSlonca.material.color.set(16771961).lerp(Re.set(i.slonceTarcza.rdzen),l),this.rdzenSlonca.scale.setScalar(i.slonceTarcza.wielkosc*(1+.18*d)),this.poswiata.material.opacity=Math.max(l*.48,d*.46)*ro(-.58,-.24,a),this.poswiata.material.color.copy(zn.set(i.slonceTarcza.poswiataZorza)).lerp(Re.set(i.slonceTarcza.poswiataDzien),l),this.poswiata.scale.setScalar(i.slonceTarcza.wielkosc*(2.7+i.slonceTarcza.rozmycieZorzy*d));let T=v(o+Math.PI,z1);this.tarczaKsiezyca.position.set(T.x,T.y,-50),this.tarczaKsiezyca.material.opacity=h*.95,this.tarczaKsiezyca.visible=h>.02}for(let y of this.chmuryMaterialy||[])y.color.copy(zn.set(i.chmury.noc)).lerp(Re.set(i.chmury.dzien),l).lerp(Re.set(i.chmury.zorza),d*(1-.45*l)*.85),y.emissive&&y.emissive.copy(zn.set(i.chmury.emisjaNoc)).lerp(Re.set(12900845),l).lerp(Re.set(13014661),d*.75);if(this.gwiazdy){let y=i.gwiazdy.krycie*h;this.gwiazdy.material.opacity=y,this.gwiazdy.visible=y>.02}let p=h>.55?"noc":d>.35?f>.5?"poranek":"zmierzch":"dzien";return this.stan={t:a,dzien:l,noc:h,zorza:d,pora:p,faza:r,luk:o,etapSesji:this.etapSesji,czas:this.czas,postep:this.naCzas?ac(this.czas/Math.max(1,this.sekundaKonca),0,1):0},p}};function I1(){let s=new fn(1,2),t=new Gt().copy(s),e=t.getAttribute("position"),n=[],i=new tt(14478075),r=new tt(16776693),o=new tt;for(let a=0;a<e.count;a++){let c=Math.max(0,Math.min(1,(e.getY(a)+1)/2));o.copy(i).lerp(r,Math.sqrt(c)),n.push(o.r,o.g,o.b)}return t.setAttribute("color",new vt(n,3)),t.computeVertexNormals(),t.computeBoundingSphere(),s.dispose(),t}var $p=[[[0,0,.04,1.02,.27,.48],[-.68,.05,0,.54,.3,.39],[.67,.06,.01,.55,.31,.4],[-.34,.24,-.02,.52,.42,.42],[.16,.31,-.04,.62,.52,.48],[.57,.22,.02,.43,.36,.36]],[[0,0,.05,1.14,.25,.48],[-.8,.03,.01,.48,.27,.36],[.8,.04,.02,.49,.28,.37],[-.47,.23,-.02,.55,.4,.41],[.02,.28,-.05,.6,.47,.46],[.48,.27,-.01,.58,.43,.43],[.76,.18,.03,.35,.3,.32]],[[0,0,.06,.95,.27,.47],[-.62,.04,.02,.52,.29,.38],[.63,.05,.01,.52,.3,.39],[-.39,.23,-.02,.46,.38,.39],[.02,.34,-.06,.58,.55,.48],[.43,.27,-.03,.48,.43,.4],[-.12,.55,-.08,.36,.34,.34],[.66,.2,.03,.34,.29,.31]]],L1={ile:4,skalaOd:.4,skalaDo:.58,tempoOd:.022,tempoDo:.028,glebokosc:-45,rozstaw:1.45,rozsuwOd:.18,rozsuwDo:.95,pochylenie:1,pochylenieMaks:.85},lc=class{constructor(t={}){let e=this.C={...L1,...t};this.grupa=new it,this.grupa.name="chmury",this.material=new te({vertexColors:!0,emissive:12900845,emissiveIntensity:.65,flatShading:!1}),this.geometria=I1();let n=20260912,i=()=>(n=n*16807%2147483647)/2147483647;this.sztuki=[];let r=0;for(let o=0;o<e.ile;o++){let a=$p[o%$p.length].map((l,h)=>({x:l[0]+(i()-.5)*.055,y:l[1]+(i()-.5)*.035,z:l[2]+(i()-.5)*.04,sx:l[3]*(.94+i()*.12),sy:l[4]*(.92+i()*.16),sz:l[5]*(.94+i()*.12),faza:i()*Math.PI*2,obrot:(i()-.5)*.18,indeks:r+h})),c=e.skalaOd+i()*(e.skalaDo-e.skalaOd);this.sztuki.push({wzor:a,skala:c,x:-e.rozstaw+(o+.5)*2*e.rozstaw/e.ile,postep:(o+.4)/e.ile,tempo:e.tempoOd+i()*(e.tempoDo-e.tempoOd),faza:i()*Math.PI*2}),r+=a.length}this.mesh=new Ne(this.geometria,this.material,r),this.mesh.name="zywe-obloki",this.mesh.frustumCulled=!1,this.mesh.instanceMatrix.setUsage(Qf),this.grupa.add(this.mesh),this._czas=0,this._macierz=new Et,this._pozycja=new S,this._skala=new S,this._obrot=new dn,this._kwaternion=new Ft,this._srodek=new S}podepnijDoKamery(t){t.add(this.grupa),this.kamera=t}aktualizuj(t,e,n=0){let i=this.kamera;if(!i)return;let r=Math.max(0,t);this._czas+=r;let o=this.C,a=(i.right-i.left)/2/(i.zoom||1),c=(i.top-i.bottom)/2/(i.zoom||1),l=this._srodek.set(0,0,0);i.worldToLocal(l);for(let h of this.sztuki){h.postep=(h.postep+r*h.tempo*(1+Math.min(2,Math.max(0,n))*.45))%1;let u=h.postep,d=u*u*(3-2*u),f=Math.min(1,u/.1),p=h.skala*Math.min(1,a/5.25)*2.35,y=p*(.16+1.18*d)*f,m=Math.sin(this._czas*.13+h.faza)*a*.026,g=h.x*a*(o.rozsuwOd+o.rozsuwDo*d)+m,x=.3*c+u*u*(.72*c+p*2.25),_=.78+.3*d,v=g-l.x,k=Math.max(.001,x-l.y),M=Math.max(-o.pochylenieMaks,Math.min(o.pochylenieMaks,Math.atan2(-v,k)*o.pochylenie)),T=Math.sin(M),R=Math.cos(M);for(let P of h.wzor){let w=this._czas*.34+P.faza,b=P.x+Math.sin(w)*.045+Math.sin(w*.47+h.faza)*.018,I=P.y+Math.cos(w*.81)*.025,C=P.z+Math.sin(w*.63)*.025,U=1+Math.sin(w*.73)*.055,K=1+Math.cos(w*.59)*.045,B=1+Math.sin(w*.67+1.3)*.04,Q=b*y*_,G=I*y;this._pozycja.set(g+Q*R-G*T,x+Q*T+G*R,this.C.glebokosc+d*10+C*y),this._skala.set(P.sx*y*U,P.sy*y*K,P.sz*y*B),this._obrot.set(.06+Math.sin(w*.41)*.025,b*.055+Math.cos(w*.37)*.025,P.obrot+M+Math.sin(w*.29)*.025),this._kwaternion.setFromEuler(this._obrot),this._macierz.compose(this._pozycja,this._kwaternion,this._skala),this.mesh.setMatrixAt(P.indeks,this._macierz)}}this.mesh.instanceMatrix.needsUpdate=!0}};var D1={ile:3,barwa:16771488,promienOrbity:.62,wysokosc:.46,tempoOrbity:1.15,wielkoscKuli:.085,mocLatarni:2.6,zasiegLatarni:5.5},ao=null;function N1(){if(ao)return ao;let s=document.createElement("canvas");s.width=s.height=64;let t=s.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.16,"rgba(255,253,240,1)"),e.addColorStop(.3,"rgba(255,236,170,0.78)"),e.addColorStop(1,"rgba(255,220,120,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),ao=new he(s),ao.colorSpace=Vt,ao}var U1=new tt,co=class{constructor(t,e={}){let n=this.C={...D1,...e};this.ile=0,this.t=0,this.grupa=new it,this.grupa.name="swiatlo-bohatera",t.add(this.grupa),this.latarnia=new mn(n.barwa,0,n.zasiegLatarni,2),this.latarnia.position.set(0,n.wysokosc,0),this.grupa.add(this.latarnia),this.kule=[];for(let i=0;i<n.ile;i++){let r=new it,o=new De(new Le({map:N1(),color:n.barwa,transparent:!0,blending:Dn,depthWrite:!1,opacity:1,toneMapped:!1}));o.scale.setScalar(n.wielkoscKuli*9),r.add(o),r.visible=!1,r.scale.setScalar(.01),this.grupa.add(r),this.kule.push({obj:r,wejscie:0})}}dodaj(){if(this.ile>=this.C.ile)return!1;let t=this.kule[this.ile];return t.obj.visible=!0,t.wejscie=0,this.ile+=1,!0}oddaj(){let t=this.ile;this.ile=0;for(let e of this.kule)e.obj.visible=!1,e.wejscie=0;return t}get komplet(){return this.ile>=this.C.ile}aktualizuj(t){let e=this.C;this.t+=t;let n=Math.max(1,this.ile);for(let r=0;r<this.kule.length;r++){let o=this.kule[r];if(!o.obj.visible)continue;o.wejscie=Math.min(1,o.wejscie+t*1.6);let a=o.wejscie*o.wejscie*(3-2*o.wejscie),c=this.t*e.tempoOrbity*(Math.PI*2)/n+r*Math.PI*2/n,l=e.promienOrbity*(1+(1-a)*1.6);o.obj.position.set(Math.cos(c)*l,e.wysokosc+(1-a)*.9+Math.sin(this.t*2.1+r)*.045,Math.sin(c)*l),o.obj.scale.setScalar(a)}let i=this.ile/e.ile;this.latarnia.intensity=e.mocLatarni*i*i,this.latarnia.color.copy(U1.set(e.barwa))}};var _e={barwaGlowna:7122504,barwaGlownaCiemna:5147190,barwaPed:8834133,barwaPedCiemny:5543738,barwaSciezka:10146911,barwaSciezkaCiemna:6529082,barwaLisc:9424986,barwaLiscCiemny:7321160,barwaKwiat:16774876,barwaSrodek:16177003,gladkie:!0,krokiDojrzalosci:14,uSciezki:.55,szczyt:.68,wygiecieOd:.5,wygiecieSila:.42,wygiecieOpad:.16,skokSciezki:3},Jp=[{g:1,t0:-.03,start:0,om:1,zwezenie:.42},{g:.94,t0:-.042,start:.16,om:1,zwezenie:.38,sciezkowa:!0},{g:.88,t0:-.052,start:.3,om:1.09,zwezenie:.44},{g:.82,t0:-.038,start:.45,om:.91,zwezenie:.44},{g:.6,t0:-.06,start:.62,om:1.18,zwezenie:.52}],gn=new S,Ju=new S,dr=new S,hc=new S(0,1,0),uc=new Et,O1=new Ft,lo=new S,yn=new S,tn=new S,F1=new S(0,1,0),Qu=new S,td=new S,dc=new S,ho=(s,t={})=>new te({color:s,flatShading:!0,...t}),B1=1.06,H1=.45,Me=(s,t=0,e=1)=>s<t?t:s>e?e:s,fr=s=>s*s*(3-2*s);function V1(s){let t=(s*9301+49297)%233280;return()=>(t=(t*9301+49297)%233280)/233280}function ed(s,t,e){let n=new Xr;n.moveTo(0,0),n.bezierCurveTo(-s,t*.15,-s*1.05,t,0,1),n.bezierCurveTo(s*1.05,t,s,t*.15,0,0);let i=new Ca(n,5),r=i.attributes.position;for(let o=0;o<r.count;o++){let a=r.getX(o),c=r.getY(o);r.setZ(o,-Math.abs(a)*e+Math.sin(c*Math.PI)*.09)}return i.computeVertexNormals(),i}function G1(){return[ed(.58,.62,.26),ed(.34,.55,.34),ed(.7,.78,.18)]}function W1(){let s=[],t=[],e=[],n=new tt(_e.barwaKwiat),i=new tt(_e.barwaSrodek),r=(c,l,h,u)=>(s.push(c,l,h),t.push(u.r,u.g,u.b),s.length/3-1),o=r(0,.02,0,i);for(let c=0;c<5;c++){let l=c/5*Math.PI*2,h=l+1.1,u=.06,d=.19,f=r(Math.cos(l)*u,0,Math.sin(l)*u,i),p=r(Math.cos((l+h)/2)*d,.035,Math.sin((l+h)/2)*d,n),y=r(Math.cos(h)*u,0,Math.sin(h)*u,i);e.push(o,f,y,f,p,y)}let a=new Gt;return a.setAttribute("position",new vt(s,3)),a.setAttribute("color",new vt(t,3)),a.setIndex(e),a.computeVertexNormals(),a}var fc=class{constructor(t){this.H=t.H,this.wygiecieOd=t.wygiecieOd??_e.wygiecieOd,this.wygiecieSila=t.wygiecieSila??_e.wygiecieSila,this.wygiecieOpad=t.wygiecieOpad??_e.wygiecieOpad,this.obroty=t.obroty??2.6;let e=t.pnacza??(t.pedy!=null?t.pedy+1:this.H>6?5:4);this.ile=Math.max(2,Math.min(Jp.length,Math.round(e))),this.grubosc=t.grubosc??.18+.1*this.H,this.szerokoscSciezki=t.szerokoscSciezki??Math.max(.7,.1*this.H),this.u=0,this.krok=-1,this.dojrzalosc=0,this.ozdobyWidoczne=!0;let n=V1(t.ziarno??1);this.faza=[n()*6.28,n()*6.28,n()*6.28],this.rBaza=this.grubosc/(1+.36*this.ile),this.rSplotu=.36*this.ile*this.rBaza;let i=this.H/Math.max(1.3,this.szerokoscSciezki*_e.skokSciezki);this.obrotySciezki=Math.max(this.obroty*.85,i),this.dodatkoweObroty=Math.max(0,this.obrotySciezki-this.obroty),this.tabN=192,this.tab=new Float32Array(this.tabN+1);let r=0;for(let o=1;o<=this.tabN;o++)r+=this._tempo((o-.5)/this.tabN)/this.tabN;this.skalaSkretu=this.dodatkoweObroty/Math.max(1e-6,r),this.group=new it,this.group.name="pnacze",this.matRura=ho(16777215,{vertexColors:!0,flatShading:!_e.gladkie,side:de}),this.matLisc=ho(16777215,{side:de}),this.matKwiat=ho(16777215,{vertexColors:!0,side:de}),this.pnacza=[];for(let o=0;o<this.ile;o++)this._pnacze(o,n);this.sciezkowe=this.pnacza.find(o=>o.sciezkowa)||this.pnacza[0],this._ozdoby(n),this._przelicz(0),this.ustawWzrost(0)}os(t,e=new S){let n=.13*this.H*(.3+.7*this.dojrzalosc),i=fr(Me(t/.12)),r=fr(Me((t-this.wygiecieOd)/Math.max(.05,1-this.wygiecieOd))),o=r*this.wygiecieSila*this.H*this.dojrzalosc,a=this.faza[0]*.7;return e.set(n*(Math.sin(t*2.3+this.faza[0])+.5*Math.sin(t*5.3+this.faza[2])+.4*t)*i*t+Math.cos(a)*o,t*this.H*(1-this.wygiecieOpad*r*this.dojrzalosc),n*(Math.cos(t*1.9+this.faza[1])+.5*Math.cos(t*4.1+this.faza[2])-.32*t)*i*t+Math.sin(a)*o)}stozek(t){return 1-.94*fr(Me((t-_e.szczyt)/(1-_e.szczyt)))}promienSplotu(t){return this.rSplotu*(1-.34*t)*(1+.17*Math.sin(t*4.3+this.faza[1]))*this.stozek(t)*(.62+.38*this.dojrzalosc)}promienPnacza(t,e){let n=Me((e-t.t0)/Math.max(.001,1-t.t0)),i=1+.85*this.dojrzalosc*(1-fr(Me(n/.12))),r=1+.13*Math.sin(e*6.1+t.faza*3);return this.rBaza*t.g*(1-t.zwezenie*e)*r*this.stozek(e)*(.15+.85*Math.pow(this.dojrzalosc,.8))*i}splaszczenie(t,e){return t.sciezkowa?Me((this.frontSciezki-e)/.16):0}_tempo(t){return(.72+.62*t)*(1+.34*Math.sin(t*6+this.faza[2]))*(1+.16*Math.sin(t*13.7+this.faza[0]))}_przeliczSkret(){let t=this.tabN,e=this.sciezkowe,n=0;this.tab[0]=0;for(let i=1;i<=t;i++){let r=(i-.5)/t;n+=this.splaszczenie(e,r)*this._tempo(r)/t,this.tab[i]=n}}_skret(t){let e=Me(t)*this.tabN,n=Math.min(this.tabN-1,Math.floor(e)),i=e-n;return this.tab[n]*(1-i)+this.tab[n+1]*i}kat(t,e){let n=t.faza+Math.PI*2*this.obroty*t.om*e+.13*Math.sin(e*5.1+t.faza);return t.sciezkowa&&(n+=Math.PI*2*this.skalaSkretu*this._skret(e)),n}promienOd(t,e){let n=this.promienSplotu(e),i=n*t.skalaR*(1+.26*Math.sin(e*Math.PI*2*this.obroty*.8+t.faza*2));if(t.sciezkowa){let r=this.splaszczenie(t,e);i+=r*(this.szerokoscSciezki*.34*this.stozek(e)+n*.35)}return i}punkt(t,e,n=new S){let i=this.kat(t,e),r=this.promienOd(t,e);this.os(e,n);let o=t.szum*this.stozek(e);return n.x+=Math.cos(i)*r+o*Math.sin(e*3.1+t.faza*1.7),n.z+=Math.sin(i)*r+o*Math.cos(e*2.6+t.faza*2.4),n}styczna(t,e,n=new S){return this.punkt(t,Math.max(t.t0,e-.0035),Qu),this.punkt(t,Math.min(1,e+.0035),td),n.subVectors(td,Qu).normalize()}ramka(t,e,n=yn,i=tn,r=lo){return this.punkt(t,e,dc),this.os(e,dr),this.styczna(t,e,r),n.set(dc.x-dr.x,0,dc.z-dr.z),n.lengthSq()<1e-8&&n.set(1,0,0),n.addScaledVector(r,-n.dot(r)).normalize(),i.crossVectors(r,n).normalize(),i.y<0&&(i.negate(),n.negate()),dc}_przekroj(t,e){let n=this.promienPnacza(t,e),i=this.splaszczenie(t,e);if(i<=0)return{w:n,h:n};let r=this.szerokoscSciezki*this.stozek(e);return{w:n*(1-i)+r*.5*i,h:Math.max(n*(1-.55*i),r*.1*i)}}_pnacze(t,e){let n=Jp[t],i=1-n.t0,r={i:t,t0:n.t0,startU:n.start,om:n.om,g:n.g,zwezenie:n.zwezenie,sciezkowa:!!n.sciezkowa&&this.ile>=2,faza:t/this.ile*Math.PI*2+(e()-.5)*.5,szum:this.rSplotu*.18*(.6+e()*.8),skalaR:1,obwod:t===0?8:n.g>.7?7:6},o=i*(this.H+Math.PI*2*this.rSplotu*this.obroty);r.sciezkowa&&(o+=Math.PI*2*(this.rSplotu+this.szerokoscSciezki*.5)*this.dodatkoweObroty);let a=Math.round(Me(o*7,28,170));r.sciezkowa&&(a=Math.round(Math.min(240,o*9)),r.obwod=8),r.N=a;let c=(a+1)*r.obwod,l=new Float32Array(c*3),h=new Float32Array(c*3),u=[];for(let g=0;g<a;g++)for(let x=0;x<r.obwod;x++){let _=g*r.obwod+x,v=(g+1)*r.obwod+x,k=(g+1)*r.obwod+(x+1)%r.obwod,M=g*r.obwod+(x+1)%r.obwod;u.push(_,M,v,v,M,k)}let d=new Gt;d.setAttribute("position",new vt(l,3)),d.setAttribute("color",new vt(h,3)),d.setIndex(u);let f=new At(d,this.matRura);f.castShadow=!0,f.frustumCulled=!1,r.mesh=f,r.pos=d.attributes.position.array,r.col=d.attributes.color.array,this.group.add(f),this.geoPaczka=this.geoPaczka||new Se(1,7,6),this.matCzubki=this.matCzubki||[];let p=r.i===0?_e.barwaGlowna:_e.barwaPed;this.matCzubki[r.i]=this.matCzubki[r.i]||ho(p);let y=new At(this.geoPaczka,this.matCzubki[r.i]);y.scale.set(.92,2,.92);let m=new it;m.add(y),m.castShadow=!0,r.czubek=m,this.group.add(m),this.pnacza.push(r)}_przelicz(t){this.dojrzalosc=t,this.frontSciezki=Me((t-_e.uSciezki)/(1-_e.uSciezki))*1.18;for(let e of this.pnacza)e.skalaR=e.i===0?.18+.82*fr(Me((t-.1)/.45)):1;this._przeliczSkret();for(let e of this.pnacza)this._przeliczRure(e);this._przeliczOzdoby()}_przeliczRure(t){let{pos:e,col:n,N:i,obwod:r}=t,o=new tt(t.i===0?_e.barwaGlowna:_e.barwaPed),a=new tt(t.i===0?_e.barwaGlownaCiemna:_e.barwaPedCiemny),c=new tt(_e.barwaSciezka),l=new tt(_e.barwaSciezkaCiemna),h=t.i===0?.14:.3,u=0;for(let f=0;f<=i;f++){let p=t.t0+(1-t.t0)*(f/i),y=this.ramka(t,p,yn,tn,lo),m=this._przekroj(t,p),g=this.splaszczenie(t,p);for(let x=0;x<r;x++){let _=x/r*Math.PI*2,v=Math.cos(_),k=Math.sin(_);if(g>.05){let T=1-.52*g;v=Math.sign(v)*Math.pow(Math.abs(v),T),k=Math.sign(k)*Math.pow(Math.abs(k),T)}e[u]=y.x+m.w*v*yn.x+m.h*k*tn.x,e[u+1]=y.y+m.w*v*yn.y+m.h*k*tn.y,e[u+2]=y.z+m.w*v*yn.z+m.h*k*tn.z;let M;g>.25?M=k>.25?c:l:M=(x+f*h)%r<r/2?o:a,n[u]=M.r,n[u+1]=M.g,n[u+2]=M.b,u+=3}}let d=t.mesh.geometry;d.attributes.position.needsUpdate=!0,d.attributes.color.needsUpdate=!0,d.computeVertexNormals(),d.computeBoundingSphere()}_ozdoby(t){this.ozdoby=[];let e=this.H,n=.38+.09*e,i=G1(),r=Math.round(Me(6+e*.95,7,40)),o=Math.round(Me(3+e*.6,4,18)),a=Math.round(Me(3+e*.4,4,12)),c=[],l=this.pnacza.filter(p=>!p.sciezkowa);for(let p=0;p<r;p++){let y=l[p%l.length],m=(Math.floor(p/l.length)+.35+t()*.3)/Math.ceil(r/l.length);c.push({p:y,t:y.t0+(1-y.t0)*Me(m,.04,.97)})}let h=p=>({p:this.pnacza[0],t:.098,kiel:!0,s:n*.82,obrot:p,tilt:.55,rol:0});c.unshift(h(1.57),h(-1.57)),this.liscie=i.map((p,y)=>{let m=Math.ceil(c.length/i.length)+1,g=new Ne(p,this.matLisc,m);return g.castShadow=!0,g.frustumCulled=!1,g.count=0,this.group.add(g),{im:g,uzyte:0}});let u=[new tt(_e.barwaLisc),new tt(_e.barwaLiscCiemny)];c.forEach((p,y)=>{let m=this.liscie[p.kiel?0:y%this.liscie.length],g=m.uzyte++;m.im.count=m.uzyte,m.im.setColorAt(g,u[!p.kiel&&t()<.42?1:0]);let x=p.t;this.ozdoby.push({im:m.im,i:g,p:p.p,t:x,s:(p.s??n*(1-.42*x)*(.5+.5*fr(Me(x/.16)))*(.85+t()*.35))*(.3+.7*this.stozek(x)),obrot:p.obrot??(y%2-.5)*1.7+(t()-.5)*.9,tilt:p.tilt??.22+t()*.5,rol:p.rol??(y%2?1:-1)*(.34+t()*.34),wysun:0,poz:new S,kw:new Ft,pop:-1})});for(let p of this.liscie)p.im.instanceColor&&(p.im.instanceColor.needsUpdate=!0);let d=new Ne(W1(),this.matKwiat,o);d.frustumCulled=!1,d.count=o,this.group.add(d),this.kwiaty=d;for(let p=0;p<o;p++){let y=l[p%l.length],m=Me(.48+p/o*.5+(t()-.5)*.06,y.t0+.02,.98);this.ozdoby.push({im:d,i:p,p:y,t:m,s:(1.2+.16*e)*(.3+.7*this.stozek(m)),obrot:(t()-.5)*2.4,tilt:.55+t()*.6,wysun:.02,poz:new S,kw:new Ft,pop:-1})}let f=new Ne(new Pa(.12,.022,4,10,Math.PI*1.6),ho(_e.barwaPed),a);f.frustumCulled=!1,f.count=a,this.group.add(f),this.wasy=f;for(let p=0;p<a;p++){let y=l[p%l.length],m=Me(.12+p/a*.8+(t()-.5)*.08,y.t0+.02,.97);this.ozdoby.push({im:f,i:p,p:y,t:m,s:(.8+.16*e)*(.7+t()*.6)*(.3+.7*this.stozek(m)),obrot:(t()-.5)*3,tilt:.2+t()*.7,wysun:.01,poz:new S,kw:new Ft,pop:-1})}}_przeliczOzdoby(){for(let t of this.ozdoby){let e=this.ramka(t.p,t.t,yn,tn,lo);dr.copy(yn).applyAxisAngle(hc,t.obrot);let n=Qu.copy(dr).multiplyScalar(Math.cos(t.tilt)).addScaledVector(hc,Math.sin(t.tilt)).normalize(),i=td.crossVectors(n,hc);i.lengthSq()<1e-6?i.set(1,0,0):i.normalize();let r=gn.crossVectors(i,n).normalize();uc.makeBasis(i,n,r),t.kw.setFromRotationMatrix(uc),t.rol&&t.kw.multiply(O1.setFromAxisAngle(F1,t.rol)),t.poz.copy(e).addScaledVector(dr,this.promienPnacza(t.p,t.t)*.85+t.wysun),t.pop=-1}}ustawWzrost(t){t=this.u=Me(t);let e=Math.round(t*_e.krokiDojrzalosci);e!==this.krok&&(this.krok=e,this._przelicz(e/_e.krokiDojrzalosci));for(let i of this.pnacza){let r=Me((t-i.startU)/Math.max(.02,1-i.startU));i.front=i.startU>0?Math.pow(r,.72):r,i.tHead=i.t0+(1-i.t0)*i.front;let o=Math.floor(i.front*i.N);if(i.mesh.geometry.setDrawRange(0,o*i.obwod*6),i.mesh.visible=o>0,i.czubek.visible=i.front>.004,i.czubek.visible){let a=i.t0+(1-i.t0)*(o/i.N),c=Math.max(.001,this.promienPnacza(i,a));this.styczna(i,a,Ju),i.czubek.position.copy(this.punkt(i,a,gn)).addScaledVector(Ju,-c*H1),i.czubek.quaternion.setFromUnitVectors(hc,Ju),i.czubek.scale.setScalar(c*B1)}}let n=new Set;for(let i of this.ozdoby){let r=this.ozdobyWidoczne?Me((i.p.tHead-i.t)/.05):0;if(Math.abs(r-i.pop)<.004)continue;i.pop=r;let o=r<=0?1e-4:(r<.6?r/.6*1.16:1.16-(r-.6)/.4*.16)*i.s;uc.compose(i.poz,i.kw,gn.setScalar(Math.max(1e-4,o))),i.im.setMatrixAt(i.i,uc),n.add(i.im)}for(let i of n)i.instanceMatrix.needsUpdate=!0}get wysokosc(){return this.u*this.H}get widocznePnacza(){return this.pnacza.filter(t=>t.front>.01).length}sciezka(t,e=0){let n=this.sciezkowe,i=Me(t,n.t0,1),r=this.ramka(n,i,yn,tn,lo),o=this._przekroj(n,i);return gn.copy(r).addScaledVector(tn,o.h*.92).addScaledVector(yn,e),{kat:Math.atan2(gn.z,gn.x),r:Math.hypot(gn.x,gn.z),h:gn.y,os:[0,0]}}kolizja(t=48){let e=this.sciezkowe,n=[],i=[],r=[];for(let o=0;o<=t;o++){let a=e.t0+(1-e.t0)*(o/t),c=this.ramka(e,a,yn,tn,lo),l=this._przekroj(e,a);n.push(c.x+tn.x*l.h*.92,c.y+tn.y*l.h*.92,c.z+tn.z*l.h*.92),i.push(yn.x,yn.y,yn.z),r.push(tn.x,tn.y,tn.z)}return{os:n,bok:i,gora:r,szerokosc:this.szerokoscSciezki,probek:t}}siatkaKolizji(t=40){let e=this.kolizja(t),n=[],i=[],r=e.szerokosc*.5;for(let a=0;a<=t;a++){let c=a*3;n.push(e.os[c]-e.bok[c]*r,e.os[c+1]-e.bok[c+1]*r,e.os[c+2]-e.bok[c+2]*r),n.push(e.os[c]+e.bok[c]*r,e.os[c+1]+e.bok[c+1]*r,e.os[c+2]+e.bok[c+2]*r)}for(let a=0;a<t;a++){let c=a*2;i.push(c,c+2,c+1,c+1,c+2,c+3)}let o=new Gt;return o.setAttribute("position",new vt(n,3)),o.setIndex(i),o.computeVertexNormals(),o}przeszkodaSplotu(t=10){let e=[];for(let n=0;n<=t;n++){let i=n/t;this.os(i,gn),e.push({x:gn.x,y:gn.y,z:gn.z,r:this.promienSplotu(i)+this.rBaza*1.15})}return e}pokazOzdoby(t){this.ozdobyWidoczne=!!t;for(let e of this.ozdoby)e.pop=-1;this.ustawWzrost(this.u)}stan(){return{u:+this.u.toFixed(3),pnaczy:this.pnacza.length,widoczne:this.widocznePnacza,splaszczenie:+Me(this.frontSciezki).toFixed(3),krok:this.krok,rysunkow:this.group.children.filter(t=>t.visible).length,trojkatow:this.pnacza.reduce((t,e)=>t+e.N*e.obwod*2,0)}}zniszcz(){this.group.traverse(t=>{t.geometry&&t.geometry.dispose()});for(let t of[this.matRura,this.matLisc,this.matKwiat,...this.matCzubki||[]])t?.dispose()}};var pr={barwaLodygi:7321674,barwaLodygiCiemna:5214006,barwaLisc:9292890,barwaZiarno:12182378,barwaZiemia:8018492,barwaKwiat:16774876,czasWzrostu:1.4,czasWspinaczki:5.6,odstepWspinaczki:.04},X1=3.4,Qp=9427199,K1=16769696,j1=s=>s<0?0:s>1?1:s,pc=s=>new te({color:s,flatShading:!0});function mc(s,t,e=[0,0,0],n=[0,0,0],i=1){let r=new At(s,t);return r.position.set(...e),r.rotation.set(...n),r.scale.setScalar(i),r.castShadow=!0,r}function q1(s=.55,t=4,e=1.05){let n=(t*9301+49297)%233280,i=()=>(n=(n*9301+49297)%233280)/233280,r=new it,o=new it;o.name="rdzen",r.add(o);let a=mc(new Se(s,10,7),pc(pr.barwaZiemia),[0,-s*.66,0]);a.scale.set(1.15,.42,1.08),o.add(a);for(let l=0;l<6;l++){let h=l/6*Math.PI*2+.4+(i()-.5)*.5,u=s*(.62+i()*.3),d=s*(.08+i()*.07),f=mc(new fn(d,0),pc(l%2?9071174:7164466),[Math.cos(h)*u,s*.01,Math.sin(h)*u],[i()*3,i()*3,i()*3]);f.scale.set(1.15,.65,1),o.add(f)}let c=[8215100,7031857,9398855];for(let l=0;l<6;l++){let h=l/6*Math.PI*2+(i()-.5)*.8+.9,u=s*(.55+i()*.35),d=.06+i()*.08,f=mc(new fn(d,0),pc(c[l%c.length]),[Math.cos(h)*u,d*.25,Math.sin(h)*u],[i()*3,i()*3,i()*3]);f.scale.set(.8+i()*.6,.5+i()*.35,.8+i()*.6),r.add(f)}return r}function Y1(s){let t=s.material;if(!t||!t.map||t.userData.rozswietlone)return;t.userData.rozswietlone=!0;let e=t.map.image;if(e&&e.width){let n=document.createElement("canvas");n.width=e.width,n.height=e.height;let i=n.getContext("2d");i.drawImage(e,0,0);let r=i.getImageData(0,0,n.width,n.height),o=r.data;for(let c=0;c<o.length;c+=4){let l=o[c],h=o[c+1],u=o[c+2],d=h-Math.max(l,u);if(d<=6)continue;let f=Math.min(1,d/40);o[c]=Math.min(255,l*(1-.35*f)+30*f),o[c+1]=Math.min(255,h*(1+.28*f)+22*f),o[c+2]=Math.min(255,u*(1-.55*f))}i.putImageData(r,0,0);let a=new he(n);a.colorSpace=t.map.colorSpace,a.flipY=t.map.flipY,a.wrapS=t.map.wrapS,a.wrapT=t.map.wrapT,t.map=a}t.emissive=new tt(9240414),t.emissiveMap=t.map,t.emissiveIntensity=.55,t.needsUpdate=!0}function Z1(s=.45){let t=new it,e=s,n=mc(new Se(e*.5,8,6),pc(pr.barwaZiarno),[0,e*.42,0],[.3,.2,.5]);return n.scale.set(1.35,.85,.95),t.add(n),t}var uo=null;function $1(){if(uo)return uo;let s=document.createElement("canvas");s.width=s.height=64;let t=s.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.3,"rgba(200,240,255,0.9)"),e.addColorStop(1,"rgba(120,200,255,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),uo=new he(s),uo.colorSpace=Vt,uo}var fo=null;function J1(){if(fo)return fo;let s=document.createElement("canvas");s.width=s.height=128;let t=s.getContext("2d"),e=()=>{t.beginPath(),t.moveTo(64,12),t.bezierCurveTo(78,34,110,58,110,80),t.arc(64,80,46,0,Math.PI),t.bezierCurveTo(18,58,50,34,64,12),t.closePath()};t.save(),t.shadowColor="rgba(18,52,78,0.55)",t.shadowBlur=12,t.shadowOffsetY=3,t.fillStyle="rgba(255,255,255,0.95)",e(),t.fill(),t.restore();let n=t.createLinearGradient(0,16,0,124);return n.addColorStop(0,"#dff6ff"),n.addColorStop(.45,"#8fd8ff"),n.addColorStop(1,"#3aa6dd"),t.fillStyle=n,e(),t.save(),t.clip(),t.fillRect(0,0,128,128),t.restore(),t.lineWidth=7,t.strokeStyle="rgba(255,255,255,0.95)",e(),t.stroke(),t.beginPath(),t.ellipse(48,78,11,16,-.35,0,Math.PI*2),t.fillStyle="rgba(255,255,255,0.72)",t.fill(),fo=new he(s),fo.colorSpace=Vt,fo}var tm=.085;function Q1(s,t,e,n,i,r,o=88){let a=[],c=[],l=s.R,h=new S,u={x:0,z:0,h:0};t.updateMatrix();let d=(p,y)=>{let m=Math.sqrt(Math.max(0,l*l-p*p-y*y))-l;return r?(h.set(p,m,y).applyMatrix4(t.matrix),s.zKuli(h,u),m+(r(u.x,u.z)-i)+tm):m+tm};for(let p=0;p<o;p++){let y=p/o*Math.PI*2;for(let m of[e*n,e]){let g=Math.cos(y)*m,x=Math.sin(y)*m;a.push(g,d(g,x),x)}}for(let p=0;p<o;p++){let y=p*2,m=y+1,g=(p+1)%o*2,x=g+1;c.push(y,m,x,y,x,g)}let f=new Gt;return f.setAttribute("position",new vt(a,3)),f.setIndex(c),f.computeVertexNormals(),f}function tM(s,t,e,n,i,r,o=6,a=44){let c=[],l=[],h=[];for(let p=0;p<=o;p++)h.push(n+(i-n)*(p/o));let u=-1;n===0&&(c.push(0,r(0)+0,0),u=0,h.shift());let d=c.length/3;for(let p=0;p<h.length;p++){let y=h[p];for(let m=0;m<a;m++){let g=m/a*Math.PI*2,x=y*s*t(g),_=Math.cos(g)*x,v=Math.sin(g)*x,k=Math.sqrt(Math.max(0,e*e-_*_-v*v))-e+r(y);c.push(_,k,v)}}if(u>=0)for(let p=0;p<a;p++)l.push(0,d+(p+1)%a,d+p);for(let p=0;p+1<h.length;p++)for(let y=0;y<a;y++){let m=d+p*a+y,g=d+p*a+(y+1)%a,x=m+a,_=g+a;l.push(m,_,x,m,g,_)}let f=new Gt;return f.setAttribute("position",new vt(c,3)),f.setIndex(l),f.computeVertexNormals(),f}var eM={glebokosc:.11};function em(s,t){let e=Array.isArray(s.punkty)&&s.punkty.length>=3?Nu(s.punkty,{gladkosc:s.gladkosc,probki:s.probki}):null,n=e?1:s.promien??1.4,i=e?e.r:Za(s.ziarno??1),r=e?Math.min(160,Math.max(56,Math.round(e.max*26))):44,o=t.R,a=new it;a.name="oczko";let c=s.glebokosc??eM.glebokosc,l=new At(tM(n,i,o,0,1.02,()=>-c+.05,5,r),new te({color:6276318,emissive:1731208,emissiveIntensity:.35,transparent:!0,opacity:.92}));a.add(l);let h=e?e.max:n,u=[];for(let p=0;p<3;p++){let y=new At(new oi(h*.2,h*.24,32),new ne({color:14677759,transparent:!0,opacity:.35,side:de,depthWrite:!1}));y.rotation.x=-Math.PI/2,y.position.y=-c+.055,y.userData.faza=p/3,a.add(y),u.push(y)}let d=e?e.srodek:s.pos;t.ustaw(a,d[0],d[1],0,0);let f=t.normalna(d[0],d[1]);return{mesh:a,n:f,pos:d,promien:e?e.max:n,tik(p){for(let y of u){y.userData.faza=(y.userData.faza+p*.28)%1;let m=y.userData.faza,g=.35+m*3.6;y.scale.set(g,g,1),y.material.opacity=.42*(1-m)*(1-m)}}}}var gc=class{constructor(t,e,n,i){this.def=t,this.planeta=e,this.etap=0,this.rosnie=null,this.czas=Math.random()*10,this.n=e.normalna(t.pos[0],t.pos[1]),this.root=new it,this.root.name="fasola";let r=i?i(t.pos[0],t.pos[1]):0;e.ustaw(this.root,t.pos[0],t.pos[1],r-.055,t.obrot??0);let o=[.45,.9,1.9,3.2,5.5];if(this.etapy=(t.etapy||[]).map((c,l)=>({def:c,wysokosc:c.wysokosc??o[l]??1})),!this.etapy.length)for(let c=0;c<5;c++)this.etapy.push({def:{},wysokosc:o[c]});this.H=this.etapy[this.ostatni].wysokosc,this.cele=this.etapy.map((c,l)=>l===0?0:Math.min(1,c.wysokosc/this.H));let a=t.pnacze||{};this.pnacze=new fc({H:this.H,obroty:a.obroty,pnacza:a.pnacza,pedy:a.pedy,grubosc:a.grubosc,wygiecieOd:a.wygiecieOd,wygiecieSila:a.wygiecieSila,wygiecieOpad:a.wygiecieOpad,szerokoscSciezki:a.szerokosc,ziarno:a.ziarno??1}),this.u=0,this.root.add(this.pnacze.group),this.kopczyk=q1(Math.max(.5,this.pnacze.grubosc*1.3),t.grzadka?.ziarno??4,t.grzadka?.promien??1.05),this.kopczyk.getObjectByName("rdzen").scale.setScalar(.4),this.root.add(this.kopczyk),this.ziarno=new it,this.root.add(this.ziarno),this.halo=new De(new Le({map:$1(),color:12582864,transparent:!0,opacity:0,blending:Dn,depthWrite:!1,toneMapped:!1})),this.halo.scale.setScalar(1.6),this.halo.position.y=.35,this.root.add(this.halo),this.swiatlo=new mn(12582832,0,5,2),this.swiatlo.position.y=.6,this.root.add(this.swiatlo),this.zasieg=t.zasieg??1.9,this.kragMat=new ne({color:Qp,transparent:!0,opacity:0,side:de,depthWrite:!1,toneMapped:!1}),this.krag=new At(Q1(e,this.root,this.zasieg,.9,r,i),this.kragMat),this.krag.renderOrder=2,this.krag.visible=!1,this.root.add(this.krag),this.ikonaWody=new De(new Le({map:J1(),transparent:!0,opacity:0,depthWrite:!1,toneMapped:!1})),this.ikonaWody.scale.set(.62,.82,1),this.ikonaWody.visible=!1,this.root.add(this.ikonaWody),this.kropelka=new De(this.ikonaWody.material.clone()),this.kropelka.scale.set(.24,.32,1),this.kropelka.visible=!1,this.root.add(this.kropelka),this._kapanie=0,this.rozbryzgi=[],this.gotowe=this._wczytajZiarno(n)}async _wczytajZiarno(t){let e=this.etapy[0],n=null;if(e.def.file&&t)try{n=(await t(e.def.file)).scene;let o=new Ee().setFromObject(n),a=new S;o.getSize(a),n.scale.setScalar(e.wysokosc/Math.max(.001,a.y)),o.setFromObject(n);let c=o.getCenter(new S);n.position.set(-c.x,-o.min.y-e.wysokosc*.22,-c.z),n.traverse(l=>{l.isMesh&&(l.castShadow=!0,Y1(l))})}catch{console.warn("[fasola] brak modelu ziarna",e.def.file,"\u2014 bry\u0142a zast\u0119pcza"),n=null}let i=n||Z1(e.wysokosc);n||(i.position.y-=e.wysokosc*.18),this.ziarno.add(i),this.ziarno.visible=this.etap===0}get ostatni(){return this.etapy.length-1}get gotowa(){return this.etap>=this.ostatni&&!this.rosnie}get wysokosc(){return this.etap===0&&!this.rosnie?this.etapy[0].wysokosc:this.pnacze.wysokosc}sciezka(t){let e=this.pnacze.sciezka(t,pr.odstepWspinaczki);return{kat:e.kat-(this.def.obrot??0),r:e.r,h:e.h}}podlej(){return this.rosnie||this.etap>=this.ostatni?!1:(this.rosnie={t:0,od:this.etap,do:this.etap+1},this._rozbryzg(16),!0)}_rozbryzg(t){let e=new Se(.05,6,5);for(let n=0;n<t;n++){let i=new At(e,new ne({color:10478847,transparent:!0,opacity:1}));i.position.set(0,.35,0);let r=n/t*Math.PI*2;i.userData={vel:new S(Math.cos(r)*(.6+Math.random()*.8),1.4+Math.random()*1.2,Math.sin(r)*(.6+Math.random()*.8)),life:1},this.root.add(i),this.rozbryzgi.push(i)}}_wskazniki(t,e,n){let i=j1((this.zasieg+X1-e)/2.2),r=this.gotowa,o=n?3.4:2.1,a=.72+.28*Math.sin(this.czas*o),c=r?.5:n?.7:.4;this.kragMat.color.setHex(r?K1:Qp),this.kragMat.opacity=c*i*a*(e<this.zasieg?1.25:1),this.krag.visible=this.kragMat.opacity>.004;let l=!r&&!this.rosnie&&i>.01;if(this.ikonaWody.visible=l,this.kropelka.visible=!1,!l)return;let h=Math.min(this.wysokosc,1.7)+.62;this._kapanie=(this._kapanie+t*(n?.62:.42))%1;let u=this._kapanie,d=u<.12?Math.sin(u/.12*Math.PI):0;if(this.ikonaWody.position.y=h+Math.sin(this.czas*2.4)*.07-.06*d,this.ikonaWody.scale.set(.62*(1-.12*d),.82*(1+.12*d),1),this.ikonaWody.material.opacity=i*(n?1:.88),u>.1&&u<.55){let f=(u-.1)/.45;this.kropelka.visible=!0,this.kropelka.position.set(0,h-.2-(h-.05)*f*f,0),this.kropelka.material.opacity=i*(f>.82?(1-f)/.18:1)}}update(t,e=99,n=!1){if(this.czas+=t,this.rosnie){let a=this.rosnie;a.t=Math.min(1,a.t+t/pr.czasWzrostu);let c=this.cele[a.od],l=this.cele[a.do];if(a.od===0){let p=Math.min(1,a.t/.35);this.ziarno.visible=p<1,this.ziarno.scale.setScalar(Math.max(.001,1-p))}let h=a.od===0?Math.max(0,(a.t-.25)/.75):a.t,u=h<.75?h/.75:1,d=u*u*(3-2*u),f=h<.75?0:Math.sin((h-.75)/.25*Math.PI)*.04;this.u=c+(l-c)*d+(l-c)*f,this.pnacze.ustawWzrost(this.u),a.t>=1&&(this.etap=a.do,this.rosnie=null,this.u=l,this.pnacze.ustawWzrost(this.u))}if(this.kopczyk){let a=.4+.6*(this.u*this.u*(3-2*this.u));this.kopczyk.getObjectByName("rdzen").scale.setScalar(a)}!this.rosnie&&this.etap>0&&(this.pnacze.group.rotation.z=Math.sin(this.czas*1.3)*.02,this.pnacze.group.rotation.x=Math.cos(this.czas*1.1)*.015);let i=Math.max(0,1-e/6),r=this.gotowa?.55:.22,o=.6+.4*Math.sin(this.czas*2.2);this.halo.material.opacity=r*i*o,this.swiatlo.intensity=(this.gotowa?2.2:.6)*i*o,this._wskazniki(t,e,n);for(let a=this.rozbryzgi.length-1;a>=0;a--){let c=this.rozbryzgi[a];c.userData.life-=t*1.1,c.userData.vel.y-=t*3.2,c.position.addScaledVector(c.userData.vel,t),c.material.opacity=Math.max(0,c.userData.life),c.userData.life<=0&&(this.root.remove(c),this.rozbryzgi.splice(a,1))}}};var nM={ile:34,progBiegu:2.2,odstep:.07,zycie:.62,wielkoscOd:.16,wielkoscDo:.72,krycie:.9,wysokosc:.06,wznoszenie:.34,zostawanie:.34,rozrzutOdlotu:[.55,1.5],rozrzutBoczny:.6,rozrzutSkali:[.62,1.45],rozrzutZycia:[.72,1.34],rozrzutOdstepu:[.5,1.7],rozrzutWzdluz:.3,rozrzutWznoszenia:[.6,1.5],barwaDzien:16776694,barwaNoc:10467028},po=null;function iM(){if(po)return po;let s=document.createElement("canvas");s.width=s.height=64;let t=s.getContext("2d");for(let[e,n,i,r]of[[30,34,22,.9],[40,28,16,.7],[24,26,13,.6]]){let o=t.createRadialGradient(e,n,0,e,n,i);o.addColorStop(0,`rgba(255,255,255,${r})`),o.addColorStop(.55,`rgba(255,255,255,${r*.45})`),o.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=o,t.fillRect(0,0,64,64)}return po=new he(s),po.colorSpace=Vt,po}var nd=new S,id=new S,sM=new tt,rM=new tt,yc=class{constructor(t,e,n={}){let i=this.C={...nM,...n};this.planeta=e,this.grupa=new it,this.grupa.name="dymki",t.add(this.grupa),this.material=new Le({map:iM(),color:i.barwaDzien,transparent:!0,depthWrite:!1,opacity:i.krycie,toneMapped:!1}),this.sztuki=[];for(let r=0;r<i.ile;r++){let o=new De(this.material.clone());o.visible=!1,o.renderOrder=2,this.grupa.add(o),this.sztuki.push({sprite:o,zycie:0,n:new S,tyl:new S,skala:1,tempoZycia:1,wznosi:1,krycie:i.krycie})}this.nastepny=0,this.doWyrzutu=0,this._poprzednia=null,this.predkosc=0,this._ziarno=1013904223,this.los=()=>(this._ziarno=this._ziarno*16807%2147483647)/2147483647}aktualizuj(t,e,n,i){let r=this.C,o=this.planeta.R;if(this._poprzednia&&t>1e-4?this.predkosc=this.planeta.odleglosc(this._poprzednia,e)/t:this._poprzednia=new S,this._poprzednia.copy(e),this.predkosc>r.progBiegu)for(this.doWyrzutu-=t;this.doWyrzutu<=0;){let c=r.rozrzutOdstepu;this.doWyrzutu+=r.odstep*(c[0]+this.los()*(c[1]-c[0])),this._wyrzuc(e,n)}else this.doWyrzutu=0;let a=sM.set(r.barwaNoc).lerp(rM.set(r.barwaDzien),i?i.dzien:1);for(let c of this.sztuki){if(!c.sprite.visible)continue;if(c.zycie+=t/r.zycie*c.tempoZycia,c.zycie>=1){c.sprite.visible=!1;continue}let l=c.zycie,h=1-(1-l)*(1-l);c.sprite.scale.setScalar((r.wielkoscOd+(r.wielkoscDo-r.wielkoscOd)*h)*c.skala),c.sprite.material.opacity=c.krycie*(1-l*l),c.sprite.material.color.copy(a),nd.copy(c.n).multiplyScalar(o+r.wysokosc+r.wznoszenie*c.wznosi*h),nd.addScaledVector(c.tyl,r.zostawanie*h),c.sprite.position.copy(nd)}}_wyrzuc(t,e){let n=this.C,i=this.los,r=l=>l[0]+i()*(l[1]-l[0]),o=this.sztuki[this.nastepny];this.nastepny=(this.nastepny+1)%this.sztuki.length,o.zycie=0,o.sprite.visible=!0,o.skala=r(n.rozrzutSkali),o.tempoZycia=1/r(n.rozrzutZycia),o.wznosi=r(n.rozrzutWznoszenia),o.krycie=n.krycie*(.7+i()*.5),o.sprite.material.rotation=i()*Math.PI*2,id.crossVectors(t,e).normalize();let a=(i()*2-1)*n.rozrzutBoczny,c=(i()*2-1)*n.rozrzutWzdluz;o.n.copy(t).addScaledVector(id,a/this.planeta.R).addScaledVector(e,c/this.planeta.R).normalize(),o.tyl.copy(e).multiplyScalar(-1).addScaledVector(id,(i()*2-1)*.9).normalize().multiplyScalar(r(n.rozrzutOdlotu)),o.sprite.material.opacity=o.krycie}};var _c=typeof matchMedia<"u"&&matchMedia("(pointer:coarse)").matches,mo=5,Mc=1.75,Bi=1.38,rd=3.42,go="walk",cs="run",mr="clip",uM=1.46,dM=1.37,rm=2.6,xc=.13,wc=-.375,om=.55,od=.14,am=.45,cm=1.6,lm=1.25,fM=1.7,hm=.3,pM=1.62,mM=.06,gM=.42,yM=.3,ad=1,cd=1.3,vc=2.1,um=.517*Mc,dm=1.33*Mc,_M=new Set(["Root","Hip","Pelvis"]),fm={ArrowUp:[0,1],KeyW:[0,1],ArrowDown:[0,-1],KeyS:[0,-1],ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0]},xM={NlaTrack:"walk","NlaTrack.001":"run","NlaTrack.002":"idle","NlaTrack.003":"happy"},wM=3.2,vM=1.7,MM=.45,bM=1.1,SM=.8,AM=.573,TM=.5,EM=.596,pm=-.182,mm=.62,zM=.62,RM=.085,kM=2.6;function CM(s){if(s>=1)return 1;if(s<.68){let e=s/.68;return e*e}let t=(s-.68)/.32;return 1-Math.sin(t*Math.PI)*.17*(1-t)}var PM=.127,IM=.218,en=(s,t,e)=>Math.max(t,Math.min(e,s)),ld=(s,t,e,n)=>s+(t-s)*(1-Math.exp(-e*n));function LM(s,t=.1){let e=[];for(let n of s.tracks){if(!n.name.endsWith(".position")||!_M.has(n.name.split(".")[0]))continue;let i=n.times.length;if(i<2)continue;let r=n.times[0],o=n.times[i-1]-r||1;for(let a=0;a<3;a++){let c=n.values[(i-1)*3+a]-n.values[a];if(!(Math.abs(c)<t)){for(let l=0;l<i;l++)n.values[l*3+a]-=c*((n.times[l]-r)/o);e.push(`${n.name}[${"xyz"[a]}]=${c.toFixed(2)}`)}}}return e}function DM(s,t=.3){let e=n=>n*n*(3-2*n);for(let n of s.tracks){let i=n.times.length;if(i<4)continue;let r=n.name.endsWith(".quaternion"),o=r?4:n.values.length/i,a=n.values.slice(0,o),c=n.values.slice((i-1)*o),l=0;for(let u=0;u<o;u++)l+=(a[u]-c[u])**2;if(Math.sqrt(l)<1e-4)continue;let h=Math.max(1,Math.floor(i*(1-t)));if(r){let u=new Ft(a[0],a[1],a[2],a[3]),d=new Ft(c[0],c[1],c[2],c[3]),f=u.clone().multiply(d.clone().invert()),p=new Ft,y=new Ft,m=new Ft;for(let g=h;g<i;g++){let x=e((g-h)/(i-1-h));y.copy(p).slerp(f,x),m.fromArray(n.values,g*4).premultiply(y).normalize(),m.toArray(n.values,g*4)}}else for(let u=h;u<i;u++){let d=e((u-h)/(i-1-h));for(let f=0;f<o;f++)n.values[u*o+f]+=(a[f]-c[f])*d}}return s}var Nn=globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches??!1;function NM(s){let e=[],n=s.clone().normalize(),i=7,r=()=>(i=i*16807%2147483647)/2147483647;for(;e.length<700*3;){let c=new S(r()*2-1,r()*2-1,r()*2-1);c.lengthSq()>1||c.lengthSq()<.05||(c.normalize(),!(c.dot(n)>-.15)&&(c.multiplyScalar(70+r()*20),e.push(c.x,c.y,c.z)))}let o=new Gt;o.setAttribute("position",new vt(e,3));let a=new Zs(o,new ns({color:16773839,size:2.2,sizeAttenuation:!1,transparent:!0,opacity:.85}));return a.frustumCulled=!1,a}var bc=class{constructor(t,e={}){this.host=t,this.opts=e,this.listeners=new Map,this.destroyed=!1,this.paused=!1,typeof e.spokojnyRuch=="boolean"&&(Nn=e.spokojnyRuch),this.mapa=Tp(),this.planeta=new Ni(this.mapa.promienKuli),this.canvas=this.$("canvas"),this.renderer=new ga({canvas:this.canvas,antialias:!_c}),this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,_c?1.5:2)),this.renderer.outputColorSpace=Vt,this.renderer.toneMapping=Nh,this.renderer.toneMappingExposure=this.mapa.ekspozycja,this.scene=new ya,this.scene.background=new tt(Tn.night),this.hemisfera=new Na(14214399,5600831,1.05),this.scene.add(this.hemisfera),this.slonce=new rs(16769200,1.6),this.slonce.position.set(-6,12,4),this.scene.add(this.slonce),this.ambient=new Oa(8425664,.35),this.scene.add(this.ambient),this.wypelnienie=new rs(16773855,.85),this.wypelnienie.position.set(5,7,9),this.scene.add(this.wypelnienie),this.camera=new Ri(-1,1,1,-1,.1,160),this.camDir=new S(4.2,11.5,8).normalize().multiplyScalar(26),this.camTarget=new S(0,this.planeta.R*(1+pm),0),this.camPos=new S,this.gwiazdy=NM(this.camDir),this.scene.add(this.gwiazdy);let n=Number(new URLSearchParams(location.search).get("doba")),i=Number.isFinite(n)&&n>0?{...this.mapa.doba.strojenie||{},sesja:{...(this.mapa.doba.strojenie||{}).sesja||{},minutySesji:n}}:this.mapa.doba.strojenie;this.doba=this.mapa.doba.wlaczona?new cc({scena:this.scene,slonce:this.slonce,wypelnienie:this.wypelnienie,hemisfera:this.hemisfera,ambient:this.ambient,gwiazdy:this.gwiazdy,slonceN:this.planeta.normalna(this.mapa.doba.nad[0],this.mapa.doba.nad[1]),strojenie:i}):null,this._pora=null,this._etapSesji=null,this.chmury=this.mapa.chmury>0?new lc({ile:this.mapa.chmury}):null,(this.doba||this.chmury)&&this.scene.add(this.camera),this.doba&&(this.doba.podepnijDoKamery(this.camera),this.doba.promienPlanety=this.planeta.R),this.chmury&&(this.chmury.podepnijDoKamery(this.camera),this.doba&&(this.doba.chmuryMaterialy=[this.chmury.material])),this.formy=$a(this.mapa);let r=Vp(this.mapa,this.planeta);if(this.swiat=r.group,this.ziemia=r.ziemia,this.scene.add(this.swiat),this.lantern=r.lantern,this.blockers=r.blockers,this.wysokoscGruntuSiatki=r.wysokoscGruntu||null,this.doba&&(this.doba.ziemia=this.ziemia),this.mapa.cienie){this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Lh,this.slonce.castShadow=!0;let c=this.slonce.shadow;c.mapSize.set(_c?1024:2048,_c?1024:2048),c.camera.left=-14,c.camera.right=14,c.camera.top=14,c.camera.bottom=-14,c.camera.near=2,c.camera.far=62,c.normalBias=.05,c.bias=-4e-4,this.ziemia&&(this.ziemia.receiveShadow=!0),this.swiat.traverse(l=>{l.isMesh&&l!==this.ziemia&&(l.castShadow=!0,l.receiveShadow=!0)})}this.kwiaty=r.kwiaty,this.zasiewWlaczony=this.mapa.zasiew,this._zasiewOstatnia=null,this._zasiewDroga=0,this.nurtTik=r.nurtTik,this._kotwicaDomku=r.kotwicaDomku||null,this._uklad=r.ukladDomku||tc(this.mapa.schronienie),this._wczytajPienDomku(),this.oczka=[...this.mapa.oczka||[],...this.mapa.oczko?[this.mapa.oczko]:[]].map(c=>em(c,this.planeta));for(let c of this.oczka)this.swiat.add(c.mesh);this.oczko=this.oczka[0]||null,this.mokreSlady=new rc(this.planeta,this.swiat,this.wysokoscGruntuSiatki),this.fasola=this.mapa.fasola?new gc(this.mapa.fasola,this.planeta,c=>this.loadGLB(c)):null,this.fasola&&this.swiat.add(this.fasola.root);let o=new Ft().setFromAxisAngle(new S(0,1,0),r.obrotMostu);this.bridgeInv=new Et().compose(new S(this.mapa.most.pos[0],0,this.mapa.most.pos[1]),o,new S(1,1,1)).invert(),this.groundY=0,this.footOffset=0,this.marker=new At(new oi(.28,.4,24),new ne({color:16773839,transparent:!0,opacity:0,side:de})),this.marker.rotation.x=-Math.PI/2,this.marker.position.y=.05,this.markerKotwica=new it,this.markerKotwica.add(this.marker),this.swiat.add(this.markerKotwica),this.markerPulse=0,this.sparkles=[],this.sparkleGrupa=new it,this.planeta.ustaw(this.sparkleGrupa,this.mapa.latarnia.pos.x,this.mapa.latarnia.pos.z,0,0),this.swiat.add(this.sparkleGrupa),this.hn=new S(0,1,0),this._doScinania=[],this._rabanieAktywne=!0,this.hf=new S(0,0,1),this.hp={x:0,z:0},this.heroLift=0,this.obrotCel=new Ft,this._qTmp=new Ft,this._v1=new S,this._v2=new S,this._v3=new S,this.rzeka3d=sr(this.mapa.rzeka.punkty,this.mapa.promienTresci).map(c=>c.map(l=>this.planeta.naKule(l.x,l.y,0))),this.latarniaN=this.planeta.normalna(this.mapa.latarnia.pos.x,this.mapa.latarnia.pos.z),this.ograniczenieMapy=!!this.mapa.surowa?.swiat?.tylkoMapa,this.heroT=0,this.targetT=0,this.walking=!1,this.celebrated=!1,this.sequence=null,this.seqTimer=0,this.mode="goto",this.input=new ot(0,0),this.keys=new Set,this.stick=null,this.inputSource=null,this.holdTime=0,this.holdDir=null,this.running=!1,this.idleAtLantern=0,this.camRight=new S,this.camFwd=new S,this.raycaster=new tr,this.clock=new Ba;let a=this.mapa.sciezka;this.odcinki=[],this.dlSciezki=0;for(let c=0;c<a.length-1;c++){let l=a[c].distanceTo(a[c+1]);this.odcinki.push(l),this.dlSciezki+=l}this.tLatarni=0;for(let c=0;c<this.mapa.latarnia.punktSciezki&&c<this.odcinki.length;c++)this.tLatarni+=this.odcinki[c];this.gotowa=this.loadHero().then(()=>this.loadMarkers()).then(()=>this.loadBudynki()).then(()=>this.loadSucheDrzewka()).then(()=>this.fasola?.gotowe).then(()=>{this.destroyed||(this.$(".scena3d-loading")?.remove(),this.bindUI(),this.placeHero(0,!0),this.updateCameraBasis(),this.opts.autostart!==!1&&this.renderer.setAnimationLoop(()=>this.tick()),this.emit("gotowa",{klipy:Object.keys(this.actions)}),this._kinoWejscie())}).catch(c=>{throw this.emit("blad",{komunikat:String(c?.message||c)}),c}),this.onWinResize=()=>this.resize(),addEventListener("resize",this.onWinResize),globalThis.ResizeObserver&&(this.ro=new ResizeObserver(()=>this.resize()),this.ro.observe(this.host)),this.resize()}$(t){return this.host.querySelector(t)}$$(t){return this.host.querySelectorAll(t)}emit(t,e={}){let n={nazwa:t,...e};try{this.opts.onEvent?.(t,n)}catch(i){console.warn("onEvent",i)}for(let i of this.listeners.get(t)||[])try{i(n)}catch(r){console.warn("listener "+t,r)}for(let i of this.listeners.get("*")||[])try{i(n)}catch(r){console.warn("listener *",r)}this.host.dispatchEvent(new CustomEvent("scena3d:"+t,{detail:n,bubbles:!0}))}on(t,e){return this.listeners.has(t)||this.listeners.set(t,new Set),this.listeners.get(t).add(e),()=>this.off(t,e)}off(t,e){this.listeners.get(t)?.delete(e)}punktSciezki(t,e=new S){let n=this.mapa.sciezka;if(!n.length)return e.set(0,0,0);t=en(t,0,this.dlSciezki);let i=0;for(let r=0;r<this.odcinki.length;r++){if(t<=i+this.odcinki[r])return e.lerpVectors(n[r],n[r+1],(t-i)/this.odcinki[r]);i+=this.odcinki[r]}return e.copy(n[n.length-1])}najblizszyPunktSciezki(t){let e=this.mapa.sciezka,n=0,i=1/0,r=0,o=new S,a=new S,c=new S;for(let l=0;l<this.odcinki.length;l++){o.copy(e[l]),a.subVectors(e[l+1],e[l]),c.subVectors(t,o);let h=en(c.dot(a)/a.lengthSq(),0,1),u=c.addScaledVector(a,-h).lengthSq();u<i&&(i=u,n=r+h*this.odcinki[l]),r+=this.odcinki[l]}return{t:n,dist:Math.sqrt(i)}}loadGLB(t){if(t==="prog")return Promise.resolve({scene:new it,animations:[]});if(t==="pak"){let i=new it;return i.add(Fp(1)),Promise.resolve({scene:i,animations:[]})}if(t==="drzewo"||t==="drzewo-lisciaste"){let i=new it,r=(t==="drzewo-lisciaste"?Qa:fi)(1);return r.scale.set(.84,1.26,.84),i.add(r),Promise.resolve({scene:i,animations:[]})}let e=new Ka,n=globalThis.__GLB_ASSETS?.[t]||(t==="adventurer"?globalThis.__HERO_GLB_B64:null);return new Promise((i,r)=>{if(n){let o=atob(n),a=new Uint8Array(o.length);for(let c=0;c<o.length;c++)a[c]=o.charCodeAt(c);e.parse(a.buffer,"",i,r)}else e.load(`${this.opts.zasoby??"./assets/"}${t}.glb`,i,void 0,r)})}miejsceWolne(t,e,n,i,r){if(!this.canWalk(t,e))return!1;for(let o=0;o<8;o++){let a=o/8*Math.PI*2;if(!this.canWalk(t+Math.cos(a)*n,e+Math.sin(a)*n))return!1}for(let o of r||[]){let a=o&&o.e;if(!(!a||a.id===i||!a.pos)&&Math.hypot(t-a.pos[0],e-a.pos[1])<n)return!1}return!0}wolneMiejsca(t,e){let n=i=>[i[0],this.groundHeightAt(i[0],i[1]),i[1]];for(let i of[t.margines??1.6,1,.6]){let r=t.pozycje.filter(o=>this.miejsceWolne(o[0],o[1],i,t.id,e));if(r.length)return r.map(n)}return t.pozycje.map(n)}async loadMarkers(){this.markers=[];let t=await Promise.all(this.mapa.znaki.map(e=>this.loadGLB(e.file).then(n=>({e,t:n})).catch(n=>(console.warn("Nie udalo sie wczytac znaku",e.id,n),null))));for(let e of t){if(!e)continue;let{e:n,t:i}=e;n.pozycje&&(n._pozycje=this.wolneMiejsca(n,t));let r=this.groundHeightAt(n.pos[0],n.pos[1]),o=new sc(n,i.scene,r,this.planeta);n.animuj&&i.animations&&i.animations.length&&(o.mixer=new $r(i.scene),o.mixer.clipAction(i.animations[0]).play()),this.swiat.add(o.root),this.markers.push(o)}}async loadSucheDrzewka(){for(let e of this.mapa.sucheDrzewka||[])try{let i=(await this.loadGLB(e.file||"suche_drzewko")).scene,r=new Ee().setFromObject(i),o=new S;r.getSize(o),i.scale.setScalar((e.wysokosc??2.4)/Math.max(.001,o.y)),r.setFromObject(i),i.position.set(0,-r.min.y,0);let a=this._osadz(i,e.pos[0],e.pos[1],.04,e.obrot??0);i.traverse(f=>{f.isMesh&&(f.material=new te({color:9074007,flatShading:!0}),f.geometry.computeVertexNormals())});let c=e.id||`drzewko-${e.pos[0]}-${e.pos[1]}`;i.name=`suche-${c}`,this.swiat.add(a);let l=new it;l.visible=!1;let h=(e.wysokosc??2.4)*.48;l.add(this._osadz(io(h),e.pos[0]+.72,e.pos[1]+.3,.05,.4)),l.add(this._osadz(Wu((e.wysokosc??2.4)*.42),e.pos[0],e.pos[1],.04,0)),this.swiat.add(l);let u={x:e.pos[0],z:e.pos[1],r:e.kolizja??.5};this.blockers.push(u);let d=[e.pos[0]+.72,e.pos[1]+.3];this._doScinania.push({id:c,rodzaj:"drzewko",pos:e.pos,zrodlo:i,wynik:l,blocker:u,n:this.planeta.normalna(e.pos[0],e.pos[1]),posWyniku:d,nWyniku:this.planeta.normalna(d[0],d[1]),skalaWyniku:h,zasieg:e.zasieg??1.6,postep:0,zrobione:!1,dostarczone:!1})}catch(n){console.warn("[scena] nie udalo sie wczytac suchego drzewka",n)}this._zarejestrujDrzewa(),this._zarejestrujGlazy();let t=this.mapa.schronienie;this._nPlacu=t?this.planeta.normalna(t.pos[0],t.pos[1]):null,console.info("[rabanie] cele:",this._doScinania.map(e=>`${e.id} (${e.rodzaj}, zasieg ${e.zasieg})`)),console.info("[schronienie] miejsce:",t?.pos??"brak w mapie")}async loadBudynki(){for(let t of this.mapa.budynki)try{let n=(await this.loadGLB(t.file)).scene,i=new Ee().setFromObject(n),r=new S;i.getSize(r),n.scale.setScalar((t.wysokosc??2.4)/Math.max(.001,r.y)),i.setFromObject(n);let o=i.getCenter(new S),a=new it;if(this.planeta.ustaw(a,t.pos[0],t.pos[1],0,0),n.position.set(-o.x,this.groundHeightAt(t.pos[0],t.pos[1])-i.min.y,-o.z),n.rotation.y=t.obrot??0,t.jasnosc&&n.traverse(c=>{let l=c.material?Array.isArray(c.material)?c.material:[c.material]:[];for(let h of l)h.color&&(h.color.multiplyScalar(t.jasnosc),h.needsUpdate=!0)}),a.add(n),this.swiat.add(a),t.ciemnosc){let c=t.mrokPromien??(t.promien??1.4)*.28,l=t.mrokWysokosc??(t.wysokosc??4)*.46,h=new At(new pe(c,c,l,24,1,!1),new ne({color:t.mrokBarwa??1511432,transparent:!0,opacity:typeof t.ciemnosc=="number"?t.ciemnosc:.86,side:je,depthWrite:!1})),u=t.mrokPos?t.mrokPos[0]:t.pos[0],d=t.mrokPos?t.mrokPos[1]:t.pos[1];this.planeta.ustaw(h,u,d,this.groundHeightAt(u,d)+(t.mrokY??.02)+l/2,0),h.renderOrder=-1,h.name="mrok-"+(t.file||"budynek"),this.swiat.add(h)}if(t.drzwiKat!=null){let c=t.promien??1.4,l=t.drzwiSzer??.9,h=14,u=Math.PI*c/h*1.15;for(let d=0;d<h;d++){let f=d/h*Math.PI*2,p=Math.atan2(Math.sin(f-t.drzwiKat),Math.cos(f-t.drzwiKat));Math.abs(p)<l/2||this.blockers.push({x:t.pos[0]+Math.sin(f)*c,z:t.pos[1]+Math.cos(f)*c,r:u})}}else this.blockers.push({x:t.pos[0],z:t.pos[1],r:t.promien??1.4})}catch(e){console.warn("Nie udalo sie wczytac budynku",t.file,e)}}async loadHero(){let t=_d(),e=await this.loadGLB(t.plik||"fox"),n=e.scene;if(n.traverse(l=>{l.isSkinnedMesh&&(this.skinned=l,l.frustumCulled=!1)}),!this.skinned)throw new Error("Brak SkinnedMesh w GLB \u2014 rig nie zosta\u0142 wczytany");this.tilt=new it,this.tilt.position.y=om,n.position.y=-om,this.tilt.add(n),this.hero=new it,this.hero.add(this.tilt),this.model=n;let i=this.makeHeroEnv();n.traverse(l=>{let h=l.material?Array.isArray(l.material)?l.material:[l.material]:[];for(let u of h)u.metalness=0,u.metalnessMap=null,u.roughnessMap=null,u.roughness=.85,u.normalScale&&u.normalScale.setScalar(.55),u.color.setScalar(t.wyglad?.tint??pM),u.map&&(u.emissiveMap=u.map,u.emissive.setScalar(1),u.emissiveIntensity=t.wyglad?.self??mM),u.envMap=i,u.envMapIntensity=t.wyglad?.env??gM,u.needsUpdate=!0}),this.hero.scale.setScalar(Mc);let r=lr(1.3,.62,.34,!0);this.heroShadow=r.userData.plama,this.heroShadow.geometry.scale(.7,.7,1),this.heroShadow.renderOrder=2,this.heroShadow.userData.dopracowany=!0,this.heroShadowKotwica=r,this.swiat.add(r);let o={},a=[];for(let l of e.animations){let h=(t.klipy||xM)[l.name]||l.name;l.name=h,a.push(...LM(l).map(u=>`${h}: ${u}`)),(h==="walk"||h==="run"||h==="idle")&&DM(l),o[h]=l}this.clipReport=a,o.walk&&!o.turn&&(o.turn=mp.subclip(o.walk,"turn",0,13,24)),this.mixer=new $r(this.model),this.actions={};for(let[l,h]of Object.entries(o)){let u=this.mixer.clipAction(h);(l==="turn"||l==="happy")&&(u.setLoop(Xh),u.clampWhenFinished=!0),this.actions[l]=u}this.actions.walk&&(this.actions.walk.timeScale=Bi/um*(t.tempo?.walk??1)),this.actions.run&&(this.actions.run.timeScale=rd/dm*(t.tempo?.run??1));let c=this.alignRunToWalk();c&&a.push(`run\u2192walk: obr\xF3t ${c.obrotPionowy}\xB0, \u015Brodek ${JSON.stringify(c.srodekSwiat)}`),this.calibrateFeet(),this.current=null,this.play("idle"),this.swiat.add(this.hero),this.swiatlo=new co(this.hero),this.kropla=new co(this.hero,{ile:1,barwa:9428223,mocLatarni:.35,wielkoscKuli:.11,promienOrbity:.5,wysokosc:.6,tempoOrbity:.8}),this.kropla.grupa.name="kropla-bohatera",this.dymki=new yc(this.swiat,this.planeta),this.debugAPI(e)}debugAPI(t){globalThis.__POC={app:this,bones:this.skinned.skeleton.bones.length,clips:t.animations.map(e=>e.name),isSkinned:!0,setInput:(e,n)=>{this.enterFreeMode(),this.input.set(e,n),this.inputSource="api"},pos:()=>[+this.hp.x.toFixed(2),+this.heroLift.toFixed(2),+this.hp.z.toFixed(2)],clipReport:this.clipReport,clipY:()=>this.clipY,setHeroLook:({tint:e,self:n,env:i})=>{this.hero.traverse(r=>{let o=r.material?Array.isArray(r.material)?r.material:[r.material]:[];for(let a of o)e!=null&&a.color.setScalar(e),n!=null&&(a.emissiveIntensity=n),i!=null&&(a.envMapIntensity=i),a.needsUpdate=!0}),this.renderer.render(this.scene,this.camera)},leanDip:()=>+(this.leanDip||0).toFixed(4),setLean:e=>{this.lean=e,this.tilt.rotation.x=e},leanMax:xc,runMode:()=>mr,markers:()=>(this.markers||[]).map(e=>({id:e.id,dotkniecia:e.touches,stan:e.state,pos:[+e.mapa.x.toFixed(2),+e.mapa.z.toFixed(2)],skala:+e.spin.scale.x.toFixed(3),halo:+e.halo.material.opacity.toFixed(2),swiatlo:+e.light.intensity.toFixed(2),przebudzenie:+e.wake.toFixed(2),wysokosc:+e.spin.position.y.toFixed(3),krycie:+e.fade.toFixed(2),widoczny:e.spin.visible})),touched:()=>this.touched||[],tapMarker:e=>{let n=(this.markers||[]).find(i=>i.id===e);return n?(n.def.absorb?this.enterMarker(n,!0):this.touchMarker(n,!0),{skala:+n.spin.scale.x.toFixed(3),swiatlo:+n.light.intensity.toFixed(2)}):null},setRunMode:e=>{mr=e,this.current=null,this.mixer.stopAllAction(),this.play("idle",0)},groundAt:(e,n)=>+this.groundHeightAt(e,n).toFixed(3),hold:()=>({trzymanie:+this.holdTime.toFixed(2),bieg:this.running,anim:this.current,predkosc:+(this.moveSpeed||0).toFixed(2),tempoKlipu:+(this.actions[go]?.timeScale||0).toFixed(2),pochylenieDeg:+((this.lean||0)*180/Math.PI).toFixed(1)}),planeta:()=>({R:this.planeta.R,obrot:this.swiat.quaternion.toArray().map(e=>+e.toFixed(3))})}}makeHeroEnv(){let t=document.createElement("canvas");t.width=64,t.height=32;let e=t.getContext("2d"),n=e.createLinearGradient(0,0,0,32);n.addColorStop(0,"#fff3dc"),n.addColorStop(.45,"#e9edff"),n.addColorStop(1,"#9dbb72"),e.fillStyle=n,e.fillRect(0,0,64,32);let i=new he(t);i.mapping=Nr,i.colorSpace=Vt;let r=new js(this.renderer),o=r.fromEquirectangular(i);return r.dispose(),i.dispose(),o.texture}play(t,e=.22,n=!1){if(this.current===t)return;let i=this.actions[t];if(!i)return;let r=this.current?this.actions[this.current]:null;if(i.reset(),n&&r){let o=r.getClip().duration,a=i.getClip().duration;o>0&&(i.time=r.time%o/o*a)}i.fadeIn(r?e:0).play(),r&&r.fadeOut(e),this.current=t}bindUI(){this.canvas.addEventListener("pointerdown",n=>this.onPointerDown(n)),this.canvas.addEventListener("pointermove",n=>this.onPointerMove(n)),this.canvas.addEventListener("pointerup",n=>this.onPointerUp(n)),this.canvas.addEventListener("pointercancel",n=>this.onPointerUp(n)),this.onKeyDown=n=>{if(n.code==="ShiftLeft"||n.code==="ShiftRight"){this.keys.add(n.code);return}fm[n.code]&&(n.preventDefault(),this.keys.add(n.code),this.enterFreeMode())},this.onKeyUp=n=>{this.keys.delete(n.code)},this.onBlur=()=>this.keys.clear(),this.opts.klawiatura!==!1&&(addEventListener("keydown",this.onKeyDown),addEventListener("keyup",this.onKeyUp),addEventListener("blur",this.onBlur));let t=this.$(".scena3d-runmode");if(t){let n=()=>{t.textContent=mr==="tempo"?"bieg: tempo":"bieg: klip"};n(),t.addEventListener("click",()=>{mr=mr==="tempo"?"clip":"tempo",n(),this.current=null,this.mixer.stopAllAction(),this.play("idle",0)})}this.stickBase=this.$(".scena3d-stick"),this.stickKnob=this.$(".scena3d-knob");let e=(n,i)=>this.$(`[data-akcja="${n}"]`)?.addEventListener("click",i);e("stop",()=>{this.stopWalk(),this.setActive("stop")}),e("go",()=>{this.goToLantern(),this.setActive("go")}),e("replay",()=>{this.replayWalk(),this.setActive("replay")})}updateCameraBasis(){this.camRight.set(1,0,0).applyQuaternion(this.camera.quaternion),this.camRight.y=0,this.camRight.normalize(),this.camFwd.set(0,0,-1).applyQuaternion(this.camera.quaternion),this.camFwd.y=0,this.camFwd.normalize()}enterFreeMode(){this.mode!=="free"&&(this.mode="free",this.walking=!1,this.setActive(null)),this.sequence&&(this.sequence=null)}onPointerDown(t){this.kinoSkroc(),this.stick||(this.stick={id:t.pointerId,x0:t.clientX,y0:t.clientY,active:!1},this.canvas.setPointerCapture?.(t.pointerId))}onPointerMove(t){let e=this.stick;if(!e||e.id!==t.pointerId)return;let n=t.clientX-e.x0,i=t.clientY-e.y0,r=Math.hypot(n,i);if(!e.active&&r<11)return;e.active||(e.active=!0,this.enterFreeMode(),this.showStick(e.x0,e.y0));let o=46,a=Math.min(1,r/o),c=r?n/r:0,l=r?i/r:0;this.input.set(c*a,-l*a),this.inputSource="stick",this.moveKnob(c*a*o,l*a*o)}onPointerUp(t){let e=this.stick;!e||e.id!==t.pointerId||(this.stick=null,this.hideStick(),e.active?(this.input.set(0,0),this.inputSource=null,this.setRunFlag(!1)):this.tapAt(t.clientX,t.clientY))}showStick(t,e){this.stickBase&&(this.stickBase.style.left=`${t}px`,this.stickBase.style.top=`${e}px`,this.stickBase.classList.add("on"))}moveKnob(t,e){this.stickKnob&&(this.stickKnob.style.transform=`translate(-50%,-50%) translate(${t}px,${e}px)`)}hideStick(){this.stickBase?.classList.remove("on"),this.moveKnob(0,0)}setRunFlag(t){this.running!==t&&(this.running=t,this.stickBase?.classList.toggle("run",t))}readKeys(){let t=0,e=0;for(let n of this.keys){let i=fm[n];i&&(t+=i[0],e+=i[1])}if(t||e){let n=Math.hypot(t,e),i=this.keys.has("ShiftLeft")||this.keys.has("ShiftRight")?1:.55;return this.input.set(t/n*i,e/n*i),this.inputSource="keys",!0}return!1}bridgeLocal(t,e,n){return n.set(t,0,e).applyMatrix4(this.bridgeInv)}_osadz(t,e,n,i=0,r=0){let o=this.wysokoscGruntuSiatki?this.wysokoscGruntuSiatki(e,n):this.groundHeightAt(e,n),a=new it;return this.planeta.ustaw(a,e,n,o-i,r),t&&a.add(t),a}groundHeightAt(t,e){let n=this.formy?this.formy.h(t,e):0,i=this.bridgeLocal(t,e,this._blTmp||(this._blTmp=new S)),r=Math.abs(i.z);if(Math.abs(i.x)>ad+.2||r>vc)return n;let o=yM-.057*(Math.min(r,cd)/cd)**2,a=en((vc-r)/(vc-cd),0,1),c=en((ad+.2-Math.abs(i.x))/.3,0,1);return o*(a*a*(3-2*a)*c)}onBridge(t,e){let n=this.bridgeLocal(t,e,this._blTmp2||(this._blTmp2=new S));return Math.abs(n.x)<ad&&Math.abs(n.z)<vc}canWalk(t,e){return this.canWalkN(this.planeta.normalna(t,e,this._v3))}canWalkN(t){let e=this.planeta.R;if(this.ograniczenieMapy){let o=this.planeta.zKuli(this._v1.copy(t).multiplyScalar(e));if(Math.hypot(o.x,o.z)>this.mapa.promienMapy)return!1}let n=this._v1.copy(t).multiplyScalar(e);for(let o of this.blockers){o.n||(o.n=this.planeta.naKule(o.x,o.z,0));let a=o.r+hm;if(n.distanceToSquared(o.n)<a*a)return!1}let i=1/0,r=this._v2;for(let o of this.rzeka3d)for(let a=0;a<o.length-1;a++){let c=o[a],l=o[a+1];r.subVectors(l,c);let h=r.lengthSq(),u=h>0?en(this._v3.subVectors(n,c).dot(r)/h,0,1):0;this._v3.copy(c).addScaledVector(r,u),i=Math.min(i,n.distanceTo(this._v3))}if(i<this.mapa.rzeka.szerokosc+hm*.5){let o=this.planeta.zKuli(n);return this.onBridge(o.x,o.z)}return!0}calibrateFeet(t=56){let e=this.skinned,n=e.geometry.attributes.position,i=1/0;for(let c=0;c<n.count;c++)i=Math.min(i,n.getY(c));this.soleVerts=[];for(let c=0;c<n.count;c++)n.getY(c)<i+.02&&this.soleVerts.push(c);let r=new S,o=this.tilt.rotation.x;this.tilt.rotation.x=0,this.hero.position.set(0,0,0),this.hero.quaternion.identity(),this.clipY={};for(let[c,l]of Object.entries(this.actions)){this.mixer.stopAllAction(),l.reset(),l.timeScale=1,l.play(),this.tilt.rotation.x=c===cs?wc:0;let h=l.getClip().duration||1,u=1/0;for(let d=0;d<t;d++){this.mixer.setTime(d/t*h),this.hero.updateMatrixWorld(!0);for(let f of this.soleVerts)e.getVertexPosition(f,r).applyMatrix4(e.matrixWorld),r.y<u&&(u=r.y)}this.clipY[c]=-u}this.tilt.rotation.x=0;let a=this.actions[go];if(a){this.mixer.stopAllAction(),a.reset(),a.timeScale=1,a.play();let c=a.getClip().duration||1,l=h=>{this.tilt.rotation.x=h;let u=1/0;for(let d=0;d<t;d++){this.mixer.setTime(d/t*c),this.hero.updateMatrixWorld(!0);for(let f of this.soleVerts)e.getVertexPosition(f,r).applyMatrix4(e.matrixWorld),r.y<u&&(u=r.y)}return u};this.leanDip=Math.max(0,l(0)-l(xc))}else this.leanDip=0;return this.mixer.stopAllAction(),this.mixer.setTime(0),this.tilt.rotation.x=o,this.footOffset=this.clipY.idle??0,this.clipY}alignRunToWalk(){let t=this.actions[go],e=this.actions[cs];if(!t||!e)return null;let n=this.skinned.skeleton.bones.find(C=>C.name==="Hip");if(!n)return null;let i=this.tilt.rotation.x;this.hero.position.set(0,0,0),this.hero.quaternion.identity(),this.tilt.rotation.x=0;let r=new S,o=new S,a=new S,c=32,l=this.skinned.skeleton.bones,h=l.find(C=>C.name==="L_Thigh"),u=l.find(C=>C.name==="R_Thigh");if(!h||!u)return null;let d=(C,U=0)=>{this.mixer.stopAllAction(),C.reset(),C.timeScale=1,C.play(),this.tilt.rotation.x=U;let K=C.getClip().duration||1,B=new S,Q=0,G=0;for(let ct=0;ct<c;ct++){this.mixer.setTime(ct/c*K),this.hero.updateMatrixWorld(!0),n.getWorldPosition(r),B.add(r),h.getWorldPosition(o),u.getWorldPosition(a);let at=a.x-o.x,gt=a.z-o.z,jt=Math.hypot(at,gt)||1;Q+=gt/jt,G+=-at/jt}return{pos:B.multiplyScalar(1/c),yaw:Math.atan2(Q/c,G/c)}},f=new Ft,p=d(t,0),y=d(e,wc),m=p.yaw-y.yaw;for(;m>Math.PI;)m-=Math.PI*2;for(;m<-Math.PI;)m+=Math.PI*2;let g=p.pos.clone().sub(y.pos),x=new Ft;n.parent.getWorldQuaternion(x);let _=x.clone().invert(),v=new Ft().setFromAxisAngle(new S(0,1,0),m),k=_.clone().multiply(v).multiply(x),M=g.clone().divideScalar(Mc).applyQuaternion(_),T=e.getClip(),R=T.tracks.find(C=>C.name==="Hip.position");if(R)for(let C=0;C<R.times.length;C++)R.values[C*3]+=M.x,R.values[C*3+1]+=M.y,R.values[C*3+2]+=M.z;let P=T.tracks.find(C=>C.name==="Hip.quaternion");if(P)for(let C=0;C<P.times.length;C++)f.fromArray(P.values,C*4).premultiply(k).normalize(),f.toArray(P.values,C*4);e.reset();let w=d(e,wc),b=w.yaw-p.yaw;for(;b>Math.PI;)b-=Math.PI*2;for(;b<-Math.PI;)b+=Math.PI*2;this.mixer.stopAllAction(),this.mixer.setTime(0),this.tilt.rotation.x=i;let I=w.pos.clone().sub(p.pos);return{obrotPionowy:+(m*180/Math.PI).toFixed(1),srodekSwiat:[+g.x.toFixed(3),+g.y.toFixed(3),+g.z.toFixed(3)],resztkowyBlad:+(b*180/Math.PI).toFixed(2),resztkowySrodek:+I.length().toFixed(4)}}_uderzDrzewa(t,e,n,i){let r=this.blockers;if(!r||Nn)return;let o=Math.hypot(n,i);if(!(o>1e-6))return;let a=this._dtGib||1/60,c=.95,l=13;for(let h of r){let u=h&&h.drzewo;if(!u)continue;let d=h.x-t,f=h.z-e,p=Math.hypot(d,f);if(p<1e-4||p>h.r+c||(n*d+i*f)/o<=0)continue;let y=u.userData.gib||(u.userData.gib={x:0,z:0,vx:0,vz:0}),m=Math.min(1,(h.r+c-p)/c),g=Math.min(1,o*60/3.2),x=h.skalaDrzewa||1,_=l*m*g/x*a;y.vx+=d/p*_,y.vz+=f/p*_}}_uderzKwiaty(t,e,n,i){let r=this.kwiaty;if(!r)return;let o=Math.hypot(n,i);if(!(o>1e-6))return;let a=this._dtGib||1/60,c=.78,l=130;for(let h of r.lista){let u=h.x-t,d=h.z-e,f=Math.hypot(u,d);if(f<1e-4||f>c||(n*u+i*d)/o<=0)continue;let p=(c-f)/c,y=Math.min(1,o*60/3.2),m=l*p*y*a;h.gib.vx+=u/f*m,h.gib.vz+=d/f*m}}_sprezyna(t,e,n,i,r,o,a){t.vx+=(-e*t.x-n*t.vx)*r,t.vz+=(-e*t.z-n*t.vz)*r,t.x+=t.vx*r,t.z+=t.vz*r,t.x>i?(t.x=i,t.vx*=-.2):t.x<-i&&(t.x=-i,t.vx*=-.2),t.z>i?(t.z=i,t.vz*=-.2):t.z<-i&&(t.z=-i,t.vz*=-.2),Math.abs(t.x)<o&&Math.abs(t.z)<o&&Math.abs(t.vx)<a&&Math.abs(t.vz)<a&&(t.x=t.z=t.vx=t.vz=0)}ustawZasiew(t){this.zasiewWlaczony=!!t,this._zasiewOstatnia=null,this._zasiewDroga=0}_zasiejZaLiskiem(){if(!this.hero||!this.kwiaty||!this.zasiewWlaczony)return;if(!this._zasiewOstatnia){this._zasiewOstatnia=this.hn.clone();return}let t=Math.acos(en(this.hn.dot(this._zasiewOstatnia),-1,1))*this.planeta.R;if(this._zasiewOstatnia.copy(this.hn),this.mokreSlady?.wWodzie){this._zasiewDroga=0;return}if(t>2||this._kino||this.sequence){this._zasiewDroga=0;return}if(t<1e-5||(this._zasiewDroga+=t,this._zasiewDroga<.7))return;this._zasiewDroga%=.7;let e=this.planeta.punktObok(this.hn,this.hf,-.55,this._zasiewN||(this._zasiewN=new S)),n=(this._zasiewBok||(this._zasiewBok=new S)).crossVectors(e,this.hf).normalize();this.planeta.punktObok(e,n,(this._zasiewStrona=!this._zasiewStrona)?.18:-.18,e);let i=this.planeta.zKuli((this._zasiewP||(this._zasiewP=new S)).copy(e).multiplyScalar(this.planeta.R));(!this.onBridge(i.x,i.z)||this.mapa.most.ukryty)&&this.kwiaty.posadz(i.x,i.z,Nn)}_gibKwiaty(t){let e=this.kwiaty;if(!e)return;let n=!1;for(let i of e.lista){let r=i.gib;!r.x&&!r.z&&!r.vx&&!r.vz||(this._sprezyna(r,52,4.6,1.05,t,3e-4,.003),e.odswiez(i),n=!0)}n&&e.oznacz()}_gibDrzew(t){for(let e of this.blockers||[]){let n=e&&e.drzewo;if(!n)continue;let i=n.userData.gib;if(!i||!i.x&&!i.z&&!i.vx&&!i.vz)continue;let r=e.skalaDrzewa||1;this._sprezyna(i,40/r,4.6,.26/r,t,2e-4,.002),n.rotation.z=-i.x,n.rotation.x=i.z,e.domkowe&&this._gibanaBudowla&&(this._gibanaBudowla.rotation.z=n.rotation.z,this._gibanaBudowla.rotation.x=n.rotation.x)}}aktualizujHp(){let t=this.planeta.zKuli(this._v1.copy(this.hn).multiplyScalar(this.planeta.R));this.hp.x=t.x,this.hp.z=t.z}moveKula(t,e){let n=this.hp.x,i=this.hp.z,r=this._vm1||(this._vm1=new S),o=this._vm2||(this._vm2=new S),a=(f,p)=>(r.copy(this.hn),o.copy(f),this.planeta.przesunPoKuli(r,o,p),this.canWalkN(r)),c=()=>(this.hn.copy(r),qe(this.hf,this.hn),this.aktualizujHp(),!0);{let f=this._zamiar||(this._zamiar={x:0,z:0,h:0});r.copy(this.hn),o.copy(t),this.planeta.przesunPoKuli(r,o,e);let p=this.planeta.zKuli(this._v1.copy(r).multiplyScalar(this.planeta.R),f);this._uderzDrzewa(n,i,p.x-n,p.z-i),this._uderzKwiaty(n,i,p.x-n,p.z-i)}if(!this.canWalkN(this.hn)||a(t,e))return c();let l=this.stycznaZeSwiata(this.camRight,this._vm3||(this._vm3=new S)),h=this.stycznaZeSwiata(this.camFwd,this._vm4||(this._vm4=new S)),u=t.dot(l),d=t.dot(h);return Math.abs(u)>.001&&a(l,e*u)||Math.abs(d)>.001&&a(h,e*d)?c():!1}stycznaZeSwiata(t,e){return this._qTmp.copy(this.swiat.quaternion).invert(),e.copy(t).applyQuaternion(this._qTmp),qe(e,this.hn)}setLocomotion(t){if(this.moveSpeed=t,t<.05){this.play("idle",.28);return}let e=mr==="clip"&&!!this.actions[cs],n=this.current===cs;if(e&&(n?t>dM:t>uM)){let i=this.actions[cs];i.timeScale=en(t/dm,.55,rm),this.play(cs,.26,!0)}else{let i=this.actions[go];i.timeScale=en(t/um,.6,rm),this.play(go,.24,!0)}}moveFree(t){let e=this.input.length(),n=this.mapa.latarnia.pos;if(e<od){this.holdTime=Math.max(0,this.holdTime-t*3),this.holdDir=null,this.setRunFlag(!1),this.setLocomotion(0);let y=this.planeta.odleglosc(this.hn,this.latarniaN);!this.celebrated&&y<2.4?(this.idleAtLantern+=t,this.idleAtLantern>.35&&this.startCelebration()):this.idleAtLantern=0;return}this.idleAtLantern=0;let i=en((e-od)/(1-od),0,1),r=Bi*(.45+.55*i),o=Math.atan2(this.input.x,this.input.y);if(this.holdDir!==null){let y=o-this.holdDir;for(;y>Math.PI;)y-=Math.PI*2;for(;y<-Math.PI;)y+=Math.PI*2;Math.abs(y)>fM&&(this.holdTime=0)}this.holdDir=o,i>=am?this.holdTime=Math.min(cm+lm+.5,this.holdTime+t):this.holdTime=Math.max(0,this.holdTime-t*2);let a=en((this.holdTime-cm)/lm,0,1),c=a*a*(3-2*a),l=Bi+(rd-Bi)*c,h=Math.max(r,i>=am?l:0);this.setRunFlag(h>Bi*1.5);let u=this._dirTmp||(this._dirTmp=new S);u.copy(this.camRight).multiplyScalar(this.input.x/e).addScaledVector(this.camFwd,this.input.y/e).normalize();let d=this.stycznaZeSwiata(u,this._dirMap||(this._dirMap=new S)),f=this.moveKula(d,h*t);this.blockedFor=f?0:(this.blockedFor||0)+t,this.setLocomotion(this.blockedFor>.3?0:h),this.obrocKu(d,11,t);let p=this.planeta.odleglosc(this.hn,this.latarniaN);this.celebrated&&p>4&&(this.celebrated=!1)}obrocKu(t,e,n){let i=Pu(this.hf,t,this.hn);return Sp(this.hf,this.hn,i*(1-Math.exp(-e*n))),qe(this.hf,this.hn),i}stycznaDoMapy(t,e,n){let i=this.planeta.normalna(t,e,this._v2);return on(this.hn,i,this.hf,n)}get heading(){let t=this._v3.copy(this.hf).applyQuaternion(this.swiat.quaternion);return Math.atan2(t.x,t.z)}set heading(t){}setActive(t){for(let e of this.$$(".scena3d-controls button"))e.classList.toggle("active",e.dataset.akcja===t)}tapAt(t,e){let n=this.canvas.getBoundingClientRect(),i=new ot((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);this.raycaster.setFromCamera(i,this.camera);let r=this.raycaster.intersectObjects((this.markers||[]).map(f=>f.hit),!1);if(r.length){let f=r[0].object.userData.marker;f.def.absorb?this.enterMarker(f,!0):this.touchMarker(f,!0);return}let o=this.raycaster.intersectObject(this.ziemia,!1);if(!o.length)return;let a=this.swiat.worldToLocal(o[0].point.clone()),c=this.planeta.zKuli(a),l=new S(c.x,0,c.z),{t:h,dist:u}=this.najblizszyPunktSciezki(l);if(u>4.5)return;this.mode="goto",this.input.set(0,0),this.heroT=this.najblizszyPunktSciezki(new S(this.hp.x,0,this.hp.z)).t,this.startWalk(h);let d=this.punktSciezki(h);this.planeta.ustaw(this.markerKotwica,d.x,d.z,this.groundHeightAt(d.x,d.z),0),this.markerPulse=1}touchMarker(t,e=!1){if(!(!t||!t.touch(e))){t.def.toast&&this.hint(t.def.toast),this.touched=(this.touched||[]).concat(t.id),this.emit("znak:dotkniety",{znak:t.id,etykieta:t.def.label,palcem:e});try{navigator.vibrate?.([14,40,20])}catch{}e&&!this.walking&&!this.sequence&&(this.play("happy",.12),this.sequence="happy",this.seqTimer=0)}}enterMarker(t,e=!1){if(!(!t||!t.startAbsorb(e))){t.def.toast&&this.hint(t.def.toast),this.touched=(this.touched||[]).concat(t.id),this.emit("minigra:start",{znak:t.id,etykieta:t.def.label,palcem:e,poDomknieciu:.95});try{navigator.vibrate?.([18,50,26])}catch{}this.input.lengthSq()<.02&&(this.moveSpeed||0)<.05&&!this.walking&&!this.sequence&&(this.play("happy",.12),this.sequence="happy",this.seqTimer=0)}}hint(t,e=2200){let n=this.$(".scena3d-hint span");n&&(this._hintBase||(this._hintBase=n.textContent),n.textContent=t,clearTimeout(this._hintT),this._hintT=setTimeout(()=>{n.textContent=this._hintBase},e))}startWalk(t){this.targetT=t,this.walking=Math.abs(t-this.heroT)>.05,this.sequence=null,this.walking&&this.play("walk")}stopWalk(){this.walking=!1,this.sequence=null,this.input.set(0,0),this.inputSource=null,this.holdTime=0,this.holdDir=null,this.setRunFlag(!1),this.keys.clear(),this.hideStick(),this.play("idle")}goToLantern(){this.celebrated=!1,this.mode="goto",this.input.set(0,0),this.heroT=this.najblizszyPunktSciezki(new S(this.hp.x,0,this.hp.z)).t,this.startWalk(this.tLatarni)}replayWalk(){this.celebrated=!1,this.mode="goto",this.input.set(0,0),this.placeHero(0,!0),this.startWalk(this.tLatarni)}placeHero(t,e=!1){this.heroT=t;let n=this.punktSciezki(t),i=this.mapa.start;i?.pos&&t===0&&(n=new S(i.pos[0],0,i.pos[1])),this.planeta.normalna(n.x,n.z,this.hn),this.aktualizujHp(),this.groundY=this.groundHeightAt(n.x,n.z),this.lean=0,this.tilt&&(this.tilt.rotation.x=0),this.heroLift=this.groundY+(this.clipY?.idle??this.footOffset);let r=this.punktSciezki(Math.min(this.dlSciezki,t+.3)),o=i?.obrot!=null&&t===0?i.obrot:Math.atan2(r.x-n.x,r.z-n.z);this.hf.set(Math.sin(o),0,Math.cos(o)).applyQuaternion(this.planeta.ramka(n.x,n.z,this._qTmp)),qe(this.hf,this.hn),e&&(this.planeta.obrotPodPunkt(this.hp.x,this.hp.z,this.swiat.quaternion),this.camPos.copy(this.camTarget).add(this.camDir),this.camera.position.copy(this.camPos),this.camera.lookAt(this.camTarget)),this.syncHero()}syncHero(){this.hero&&this.planeta.ustawN(this.hero,this.hn,this.hf,this.heroLift)}startCelebration(){this.emit("latarnia:reakcja",{faza:"obrot"}),this.celebrated=!0,this.walking=!1,this.sequence="turning",this.seqTimer=0,this.play("turn",.15)}spawnSparkles(){let t=new Se(.05,6,5),e=new ne({color:16771496,transparent:!0});for(let n=0;n<10;n++){let i=new At(t,e.clone());i.position.set(-.6,1.7,0);let r=n/10*Math.PI*2;i.userData={vel:new S(Math.cos(r)*.9,1.4+Math.random(),Math.sin(r)*.9),life:1},this.sparkleGrupa.add(i),this.sparkles.push(i)}}tick(){let t=Math.min(.05,this.clock.getDelta()),e=Bi;if(this._dtGib=t,this._gibDrzew(t),this._gibKwiaty(t),this.kwiaty?.aktualizujZasiew(t,Nn),Nn||this.nurtTik(t),this.stick?.active||(this.keys.size?(this.readKeys(),this.enterFreeMode()):this.inputSource==="keys"&&(this.input.set(0,0),this.inputSource=null)),this.mode==="free"&&!this.sequence&&this.moveFree(t),!this.walking&&this.mode!=="free"&&(this.moveSpeed=0),this.walking){let y=Math.sign(this.targetT-this.heroT);this.heroT+=y*e*t,(y>0&&this.heroT>=this.targetT||y<0&&this.heroT<=this.targetT)&&(this.heroT=this.targetT,this.walking=!1,!this.celebrated&&Math.abs(this.heroT-this.tLatarni)<.6?this.startCelebration():this.play("idle"),this.emit("bohater:doszedl",{x:+this.hp.x.toFixed(2),z:+this.hp.z.toFixed(2),latarnia:Math.abs(this.heroT-this.tLatarni)<.6})),this.moveSpeed=e;let m=this.punktSciezki(this.heroT);this.planeta.normalna(m.x,m.z,this.hn),qe(this.hf,this.hn),this.aktualizujHp();let g=this.punktSciezki(en(this.heroT+.35*(y||1),0,this.dlSciezki));if(g.distanceToSquared(m)>1e-6){let x=this.stycznaDoMapy(g.x,g.z,this._v1);y<0&&x.negate(),this.obrocKu(x,10,t)}}if(this.sequence==="turning"){this.seqTimer+=t;let y=on(this.hn,this.latarniaN,this.hf,this._v1),m=this.obrocKu(y,6,t);this.seqTimer>.5&&Math.abs(m)<.08&&(this.sequence="happy",this.seqTimer=0,this.play("happy",.12),this.spawnSparkles())}else this.sequence==="happy"?(this.seqTimer+=t,this.seqTimer>1.55&&(this.sequence=null,this.idleAtLantern=0,this.play("idle",.3))):this.sequence==="wspinaczka"&&this._wspinaczkaKlatka(t);let n;this.sequence||!this.moveSpeed?n=0:this.current===cs?n=wc:n=xc*en((this.moveSpeed-Bi*.8)/(rd-Bi*.8),0,1),this.lean=ld(this.lean||0,n,6,t),this.tilt&&(this.tilt.rotation.x=this.lean);let i=this.groundHeightAt(this.hp.x,this.hp.z);this.groundY=ld(this.groundY,i,9,t);let r=this.clipY?.[this.current]??this.footOffset;this.footOffset=ld(this.footOffset,r,12,t);let o=(this.leanDip||0)*Math.max(0,(this.lean||0)/xc);this.heroLift=this.groundY+this.footOffset+o+(this._wspDodatek||0),this.syncHero(),this.mokreSlady?.tik(t,this.hn,this.hf,this.oczka,!!(this._kino||this.sequence)),this._zasiejZaLiskiem();let a=this.hn,c=this._podgladTik(t);c>0&&(a=this._v3.copy(this.hn).lerp(this._podglad.n,c).normalize());let l=this._v1.copy(a).applyQuaternion(this.swiat.quaternion);this._qTmp.setFromUnitVectors(l,this._v2.set(0,1,0)),this.obrotCel.copy(this._qTmp).multiply(this.swiat.quaternion);let h=Nn?30:c>0?vM:wM;if(this.swiat.quaternion.slerp(this.obrotCel,1-Math.exp(-h*t)),this.korektaPolnocy(t),this.mapa.cienie&&this.hero&&!this._cienieBohatera&&(this._cienieBohatera=!0,this.hero.traverse(y=>{(y.isMesh||y.isSkinnedMesh)&&(y.castShadow=!0)}),this.heroShadow&&(this.heroShadow.visible=!1)),this.chmury&&this.chmury.aktualizuj(t,this.doba?.stan||null,this.moveSpeed||0),this.doba){let y=this.doba.aktualizuj(this.hn,this.swiat.quaternion,t);y!==this._pora&&(this._pora=y,this.emit("doba:pora",{pora:y,...this.doba.stan}));let m=this.doba.etapSesji;m!==this._etapSesji&&(this._etapSesji=m,this.emit("doba:sesja",{etap:m,...this.doba.stan}))}this.camPos.copy(this.camTarget).add(this.camDir),this._kinoKlatka(t),this._wejscieKlatka(t),this._nocKlatka(t),this._opadKlodKlatka(t),this.camera.position.copy(this.camPos),this.camera.lookAt(this._kc.x,this._kc.y,this._kc.z);let u=Nn?.3:1,d=this.doba?.stan||null;for(let y of this.markers||[]){y.def.pora&&d&&y.ustawAktywny(y.def.pora==="noc"?d.noc>.35:d.dzien>.35);let m=this.planeta.odleglosc(this.hn,y.n);if(y.update(t,u,m),y.aktywny!==!1){if(y.def.reagujeNaSwiatlo&&this.swiatlo){let g=this.swiatlo.ile,x=Math.max(0,1-m/7),_=g>=3?1:.35+.65*(.5+.5*Math.sin(this._czasGry*2.4)),v=g/3*_*(.35+.65*x);y.light&&(y.light.intensity=v*3.2),y.halo?.material&&(y.halo.material.opacity=v*.55),g===0&&(y.light&&(y.light.intensity=0),y.halo?.material&&(y.halo.material.opacity=0))}if(m<(y.def.zasieg??1)&&!this._kino){if(y.def.zbiera==="swiatlo"){if(this.swiatlo.komplet)continue;y.state==="idle"&&this.swiatlo.dodaj()&&this.emit("swiatlo:zebrane",{ile:this.swiatlo.ile,komplet:this.swiatlo.komplet})}y.def.absorb?this.enterMarker(y):this.touchMarker(y)}}}if(this.swiatlo&&this.swiatlo.aktualizuj(t),this.kropla&&this.kropla.aktualizuj(t),this._fasolaTik(t),this._rabanieTik(t),this._transportTik(t),this._sladTik(t),this.dymki&&this.dymki.aktualizuj(t,this.hn,this.hf,this.doba?.stan||null),this._czasGry=(this._czasGry||0)+t,this.heroShadowKotwica){let y=this.groundHeightAt(this.hp.x,this.hp.z);this.planeta.ustawN(this.heroShadowKotwica,this.planeta.punktObok(this.hn,this.hf,.18,this._v1),this.hf,y);let m=Math.max(0,this.heroLift-y-.02),g=1+en(m,0,.35)*.7;this.heroShadow.scale.set(g,g,1),this.heroShadow.material.opacity=en(1-m*1.1,.5,1)}if(this.markerPulse>0){this.markerPulse=Math.max(0,this.markerPulse-t*1.4),this.marker.material.opacity=this.markerPulse*.9;let y=1+(1-this.markerPulse)*.7;this.marker.scale.set(y,y,1)}for(let y=this.sparkles.length-1;y>=0;y--){let m=this.sparkles[y];m.userData.life-=t*.9,m.userData.vel.y-=t*1.6,m.position.addScaledVector(m.userData.vel,t),m.material.opacity=Math.max(0,m.userData.life),m.userData.life<=0&&(this.sparkleGrupa.remove(m),this.sparkles.splice(y,1))}let f=this.lantern.userData,p=1+Math.sin(performance.now()*.003)*.12;f.light.intensity=9*p,f.glassMat.emissiveIntensity=1.1*p,this.mixer?.update(t),this.renderer.render(this.scene,this.camera)}korektaPolnocy(t){let n=Math.hypot(this.hp.x,this.hp.z)/this.planeta.R,i=en((2.4-n)/.8,0,1);if(i<=0)return;let r=this._v1.set(1,0,0).applyQuaternion(this.planeta.ramka(this.hp.x,this.hp.z,this._qTmp)).applyQuaternion(this.swiat.quaternion),o=Math.atan2(r.z,r.x);if(Math.abs(o)<1e-4)return;let a=(this.moveSpeed||0)>.05?MM:bM,c=o*(1-Math.exp(-a*i*t));this._qTmp.setFromAxisAngle(this._v2.set(0,1,0),c),this.swiat.quaternion.premultiply(this._qTmp)}_ikonaSiekiery(){if(this._ikSiek!==void 0)return this._ikSiek;let t=new Image;return t.onload=()=>{this._wskPracy?.rysuj(this._wskPostep??0)},t.onerror=()=>{console.warn("[wskaznik] brak ikony siekiery"),this._ikSiek=null},t.src=`${this.opts.zasoby??"./assets/"}ikona-siekiera.png`,this._ikSiek=t,t}_tloWskaznika(t,e,n){let i=e/2,r=e/100;t.fillStyle="#211d16",t.beginPath(),t.arc(i,i,49.2*r,0,Math.PI*2),t.fill(),t.lineWidth=1.5*r,t.strokeStyle="#140f09",t.beginPath(),t.arc(i,i,49.2*r,0,Math.PI*2),t.stroke(),n&&n(t,i,r),t.fillStyle="#140f09",t.beginPath(),t.arc(i,i,37.7*r,0,Math.PI*2),t.fill();let o=t.createRadialGradient(i,i-6*r,2*r,i,i,36.7*r);return o.addColorStop(0,"#4a4a53"),o.addColorStop(1,"#26262c"),t.fillStyle=o,t.beginPath(),t.arc(i,i,36.7*r,0,Math.PI*2),t.fill(),t.save(),t.globalAlpha=.06,t.fillStyle="#ffffff",t.beginPath(),t.ellipse(i,i-18*r,25*r,13*r,0,0,Math.PI*2),t.fill(),t.restore(),{c0:i,u:r}}_wskaznikPracy(){if(this._wskPracy)return this._wskPracy;let t=256,e=t/2,n=document.createElement("canvas");n.width=n.height=t;let i=n.getContext("2d"),r=new he(n);r.colorSpace=Vt;let o=new De(new Le({map:r,depthTest:!1,transparent:!0}));return o.renderOrder=60,o.scale.setScalar(1.05),o.visible=!1,o.rysuj=a=>{a=Math.min(1,Math.max(0,a||0)),this._wskPostep=a,i.clearRect(0,0,t,t),i.lineCap="round",i.lineJoin="round";let{c0:c,u:l}=this._tloWskaznika(i,t,(u,d,f)=>{let p=43.5*f,y=11*f;if(u.lineWidth=y,u.strokeStyle="#5a5326",u.beginPath(),u.arc(d,d,p,0,Math.PI*2),u.stroke(),a<=0)return;let m=-Math.PI/2,g=m+Math.PI*2*a;u.save(),u.shadowColor="#ffab27",u.shadowBlur=6*f,u.lineWidth=y,u.strokeStyle="#ffab27",u.beginPath(),u.arc(d,d,p,m,g),u.stroke(),u.beginPath(),u.arc(d,d,p,m,g),u.stroke(),u.restore();let x=u.createLinearGradient(0,d-p,0,d+p);x.addColorStop(0,"#ffdc4b"),x.addColorStop(.52,"#ffdc4b"),x.addColorStop(1,"#ff8f1f"),u.lineWidth=y,u.strokeStyle=x,u.beginPath(),u.arc(d,d,p,m,g),u.stroke()}),h=this._ikonaSiekiery();if(h&&h.complete&&h.naturalWidth){let u=56*l;i.drawImage(h,c-u/2,c-11*l-u/2,u,u)}i.font=`700 ${Math.round(17*l)}px "Baloo 2", "Arial Rounded MT Bold", "Trebuchet MS", sans-serif`,i.textAlign="center",i.textBaseline="middle",i.save(),i.shadowColor="rgba(0,0,0,.45)",i.shadowBlur=3*l,i.shadowOffsetY=1.5*l,i.fillStyle="#fff7e6",i.fillText(`${Math.round(a*100)}%`,c,c+20.5*l),i.restore(),o.material.map.needsUpdate=!0},this.swiat.add(o),this._wskPracy=o,o}async _wczytajPienDomku(){let t=this._kotwicaDomku,e=this.mapa.schronienie;if(!(!t||!e))try{let n=await this.loadGLB("tree");if(this.destroyed)return;let i=n.scene.clone(!0);i.name="drzewo-domkowe-pien",this._ustawPien(i,e,this._uklad||En),i.traverse(o=>{o.isMesh&&(o.material=Bp,o.geometry.computeVertexNormals())}),((this.blockers||[]).find(o=>o&&o.domkowe&&o.drzewo)?.drzewo||t).add(i),this._pienDomku=i}catch(n){console.warn("[domek] nie udalo sie wczytac pnia",n)}}_ustawPien(t,e,n){let i=e.skala??1;t.scale.setScalar(i*n.skalaModelu),t.rotation.y=n.obrotModelu,t.position.set((n.pienX||0)*i,(n.pienY||0)*i,(n.pienZ||0)*i)}przebudujDomek(t){t&&(this._uklad={...this._uklad,...t});let e=this._uklad,n=this._kotwicaDomku,i=(this.blockers||[]).find(c=>c&&c.domkowe);if(!n||!i||!e)return;let r=this.mapa.schronienie||{};if(Array.isArray(r.pos)){let c=r.skala??1,l=this.wysokoscGruntuSiatki?this.wysokoscGruntuSiatki(r.pos[0],r.pos[1]):this.groundHeightAt(r.pos[0],r.pos[1]);this.planeta.ustaw(n,r.pos[0],r.pos[1],l-(e.zanurzeniePnia??En.zanurzeniePnia)*c,r.obrot??0)}let o=this._pienDomku;o&&(o.parent?.remove(o),this._ustawPien(o,r,e)),i.drzewo&&(n.remove(i.drzewo),i.drzewo.traverse(c=>{c.geometry?.dispose?.()}));let a=Bu(r.skala??1,e);return o&&a.add(o),n.add(a),i.drzewo=a,this._etapSchronienia>0&&this.ustawSchronienie(this._etapSchronienia,!1),e}ukladDomku(){return this._uklad}ukladDomkuDomyslny(){return tc(null)}async edytorDomku(){try{return(await Promise.resolve().then(()=>(sm(),im))).otworzEdytorDomku(this)}catch(t){return console.warn("[domek] edytor sie nie otworzyl",t),null}}_zarejestrujDrzewa(){for(let t of this.blockers||[]){if(!t||!t.drzewo||t.domkowe)continue;let e=t.skalaDrzewa||1,n=[t.x,t.z],i=`drzewo-${t.x.toFixed(2)}-${t.z.toFixed(2)}`,r=new it;r.visible=!1,r.name=`wynik-${i}`;let o=e*1.2;r.add(this._osadz(io(o),n[0]+.72,n[1]+.3,.05,.4)),r.add(this._osadz(Wu(e*1.05),n[0],n[1],.04,0)),this.swiat.add(r);let a=[n[0]+.72,n[1]+.3];this._doScinania.push({id:i,rodzaj:"drzewko",pos:n,zrodlo:t.drzewo,wynik:r,blocker:t,n:this.planeta.normalna(n[0],n[1]),posWyniku:a,nWyniku:this.planeta.normalna(a[0],a[1]),skalaWyniku:o,zasieg:1.6,postep:0,zrobione:!1,dostarczone:!1})}}_zarejestrujGlazy(){for(let[t,e]of(this.mapa.glazy||[]).entries()){if(!e||!e.doRozbicia)continue;let n=this.swiat.getObjectByName(`glaz-${t}`);if(!n)continue;let i=new it;i.visible=!1,i.add(this._osadz(nc(.95*(e.skala??1)),e.pos[0],e.pos[1],.08*(e.skala??1),e.obrot??0)),this.swiat.add(i);let r=(this.blockers||[]).find(o=>o&&!o.drzewo&&Math.abs(o.x-e.pos[0])<1e-6&&Math.abs(o.z-e.pos[1])<1e-6)||null;this._doScinania.push({id:e.id||`glaz-${t}`,rodzaj:"glaz",pos:e.pos,zrodlo:n,wynik:i,blocker:r,n:this.planeta.normalna(e.pos[0],e.pos[1]),posWyniku:e.pos,nWyniku:this.planeta.normalna(e.pos[0],e.pos[1]),skalaWyniku:.95*(e.skala??1),zasieg:e.zasieg??1.9,postep:0,zrobione:!1,dostarczone:!1})}}oznaczZuzyte(t){let e=new Set(Array.isArray(t)?t:[]);for(let n of this._doScinania){let i=e.has(n.id);i!==!!n.zrobione&&(i?(n.zrobione=!0,n.postep=mo,n.zrodlo.visible=!1,n.wynik.visible=!0,this._zdejmijKolizje(n)):(n.zrobione=!1,n.dostarczone=!1,n.niesione=!1,n.postep=0,n.zrodlo.visible=!0,n.wynik.visible=!1,this._wrocKolizje(n),this._ladunek?.cel===n&&this._porzucLadunek()))}}_zdejmijKolizje(t){if(!t.blocker)return;let e=this.blockers.indexOf(t.blocker);e>=0&&this.blockers.splice(e,1),t.blockerSchowany=t.blocker,t.blocker=null}_wrocKolizje(t){let e=t.blocker||t.blockerSchowany;e&&(this.blockers.includes(e)||this.blockers.push(e),t.blocker=e,t.blockerSchowany=null)}ustawRabanieAktywne(t){this._rabanieAktywne=t!==!1,!this._rabanieAktywne&&this._wskPracy&&(this._wskPracy.visible=!1)}_rabanieTik(t){if(!this._doScinania.length)return;let e=this._wskPracy;if(this._kino||this.sequence||this._podglad||this._ladunek){e&&(e.visible=!1);return}let n=null;for(let a of this._doScinania)if(!a.zrobione&&this.planeta.odleglosc(this.hn,a.n)<a.zasieg){n=a;break}if(!n){e&&(e.visible=!1),this._blokadaPokazana=!1,this._rabUcieczka=0;return}if(!this._rabanieAktywne){e&&(e.visible=!1),this._blokadaPokazana||(this._blokadaPokazana=!0,this.hint("Wizkor jeszcze o to nie prosi\u0142"));return}this._blokadaPokazana=!1;let i=Math.hypot(this.input.x,this.input.y);if(this._rabUcieczka=i>.55?(this._rabUcieczka||0)+t:0,this._rabUcieczka>.35){e&&(e.visible=!1);return}let r=this.stycznaDoMapy(n.pos[0],n.pos[1],this._rabKier||(this._rabKier=new S));this.obrocKu(r,9,t),this.input.set(0,0),this.setLocomotion(0),this.walking=!1,n.postep=Math.min(mo,n.postep+t);let o=this._wskaznikPracy();if(o.visible=!0,o.position.copy(this.hero.position).addScaledVector(this.hn,1.14),o.rysuj(n.postep/mo),!(n.postep<mo)){n.zrobione=!0,n.zrodlo.visible=!1,n.wynik.visible=!0,n.rodzaj!=="glaz"&&this._zacznijOpadKlod(n.wynik,n.skalaWyniku||1),this._zdejmijKolizje(n),o.visible=!1,this.hint(n.rodzaj==="glaz"?"Kamienie si\u0119 przydadz\u0105!":"Drewno gotowe!"),this.emit("surowiec:zdobyty",{rodzaj:n.rodzaj,id:n.id,pos:n.pos});try{navigator.vibrate?.([18,40,18])}catch{}this.input.lengthSq()<.02&&(this.moveSpeed||0)<.05&&!this.walking&&(this.play("happy",.12),this.sequence="happy",this.seqTimer=0)}}pokazZnakWKadrze(t,e={}){let n=(this.markers||[]).find(r=>r&&r.id===t&&r.state!=="gone"),i=n?.mapa||n?.root?.position;return i?this.pokazMiejsce([i.x,i.z],e):!1}pokazMiejsce(t,e={}){let n=Array.isArray(t)?t:this.mapa.schronienie?.pos;return!n||!this.hero?!1:Nn?(this.emit("miejsce:pokazane",{pos:n,pominiete:!0}),!1):(this._podglad={faza:"dojazd",t:0,dojazd:e.dojazd??1.25,trzym:e.trzym??1.7,powrot:e.powrot??1.1,n:this.planeta.normalna(n[0],n[1]),pos:n,w:0},this.input.set(0,0),this.setLocomotion(0),this.walking=!1,this.stopWalk?.(),!0)}_podgladTik(t){let e=this._podglad;if(!e)return 0;if(e.t+=t,e.faza==="dojazd")e.w=Math.min(1,e.t/e.dojazd),e.t>=e.dojazd&&(e.faza="trzym",e.t=0,e.w=1);else if(e.faza==="trzym")e.w=1,e.t>=e.trzym&&(e.faza="powrot",e.t=0);else if(e.w=Math.max(0,1-e.t/e.powrot),e.t>=e.powrot)return this._podglad=null,this.emit("miejsce:pokazane",{pos:e.pos}),0;let n=e.w;return n*n*(3-2*n)}_ladunekModel(t,e){let n=new it;return n.name="ladunek",n.add(t==="glaz"?nc(e*.58):io(e*.58,{szczapy:!1})),n}_sladDoPlacu(){if(this._slad)return this._slad;let t=new it;t.name="slad-do-placu";let e=new ki(.135,14);this._sladKropki=[];for(let n=0;n<16;n+=1){let i=new At(e,new ne({color:16761402,transparent:!0,opacity:0,depthWrite:!1}));i.rotation.x=-Math.PI/2;let r=new it;r.add(i),t.add(r),this._sladKropki.push(r)}return t.visible=!1,this.swiat.add(t),this._slad=t,t}_sladTik(t){let e=this.mapa.schronienie;if(!(!!this._ladunek&&!!e&&Array.isArray(e.pos)&&!this._kino&&!this._podglad)){this._slad&&(this._slad.visible=!1);return}let i=this._sladDoPlacu();i.visible=!0,this._sladFaza=((this._sladFaza||0)+t*.45)%1;let r=this.hp.x,o=this.hp.z,a=e.pos[0],c=e.pos[1],l=this._sladKropki.length;for(let h=0;h<l;h+=1){let u=(h+1)/(l+1),d=r+(a-r)*u,f=o+(c-o)*u,p=this.wysokoscGruntuSiatki?this.wysokoscGruntuSiatki(d,f):this.groundHeightAt(d,f),y=this._sladKropki[h];this.planeta.ustaw(y,d,f,p+.02,0);let m=(u-this._sladFaza+1)%1,g=Math.max(0,1-m*2.4),x=y.children[0];x.material.opacity=.16+.52*g*g,x.scale.setScalar(.72+.5*g)}}_transportTik(t){if(!this._doScinania.length||this._kino||this.sequence||this._podglad)return;let e=this.mapa.schronienie;if(this._ladunek){let n=this._ladunek.model;if(n.position.copy(this.hero.position).addScaledVector(this.hn,.66),n.quaternion.copy(this.hero.quaternion),!e||!this._nPlacu)return;this.planeta.odleglosc(this.hn,this._nPlacu)<(e.zasieg??1.35)&&this._oddajLadunek();return}for(let n of this._doScinania){if(!n.zrobione||n.dostarczone||n.niesione||this.planeta.odleglosc(this.hn,n.nWyniku)>=(n.zasiegWyniku??.95))continue;n.niesione=!0,n.wynik.visible=!1;let i=this._ladunekModel(n.rodzaj,n.skalaWyniku??1);this.swiat.add(i),this._ladunek={rodzaj:n.rodzaj,id:n.id,cel:n,model:i},this.hint(n.rodzaj==="glaz"?"Nios\u0119 kamienie":"Nios\u0119 drewno"),this.emit("surowiec:podniesiony",{rodzaj:n.rodzaj,id:n.id});try{navigator.vibrate?.(14)}catch{}return}}_porzucLadunek(){let t=this._ladunek;t&&(this.swiat.remove(t.model),t.model.traverse(e=>{e.geometry?.dispose?.()}),t.cel&&(t.cel.niesione=!1),this._ladunek=null)}_oddajLadunek(){let t=this._ladunek;if(t){this.swiat.remove(t.model),t.model.traverse(e=>{e.geometry?.dispose?.()}),t.cel.niesione=!1,t.cel.dostarczone=!0,this._polozNaPlacu(t.rodzaj,t.cel.skalaWyniku??1,this._doScinania.filter(e=>e.dostarczone&&e!==t.cel).length),this._ladunek=null,this.hint(t.rodzaj==="glaz"?"Kamienie na placu!":"Drewno na placu!"),this.emit("surowiec:dostarczony",{rodzaj:t.rodzaj,id:t.id});try{navigator.vibrate?.([18,40,18])}catch{}this.input.lengthSq()<.02&&(this.moveSpeed||0)<.05&&!this.walking&&(this.play("happy",.12),this.sequence="happy",this.seqTimer=0)}}_polozNaPlacu(t,e,n=0){let i=this.mapa.schronienie;if(!i)return;this._skladNaPlacu||(this._skladNaPlacu=new it,this._skladNaPlacu.name="sklad-na-placu",this.swiat.add(this._skladNaPlacu));let r=i.skala??1,o=(i.obrot??0)+Math.PI+(n-1)*.55,a=1.25*r,c=i.pos[0]+a*Math.cos(o),l=i.pos[1]-a*Math.sin(o),h=t==="glaz"?nc(e*.8):io(e*.7);this._skladNaPlacu.add(this._osadz(h,c,l,.05,o+.35))}_zabierzSklad(){this._skladNaPlacu&&(this.swiat.remove(this._skladNaPlacu),this._skladNaPlacu.traverse(t=>{t.geometry?.dispose?.()}),this._skladNaPlacu=null)}oznaczDostarczone(t){let e=new Set(Array.isArray(t)?t:[]),n=!1;for(let r of this._doScinania){let o=e.has(r.id);o!==!!r.dostarczone&&(n=!0,o?(r.dostarczone=!0,r.niesione=!1,r.zrobione=!0,r.postep=mo,r.zrodlo.visible=!1,r.wynik.visible=!1,this._zdejmijKolizje(r)):(r.dostarczone=!1,r.niesione=!1,r.wynik.visible=!!r.zrobione,this._ladunek?.cel===r&&this._porzucLadunek()))}if(!n||(this._zabierzSklad(),this._etapSchronienia>0))return;let i=0;for(let r of this._doScinania)r.dostarczone&&this._polozNaPlacu(r.rodzaj,r.skalaWyniku??1,i++)}ustawSchronienie(t=0,e=!1){let n=this.mapa.schronienie;if(!n||!Array.isArray(n.pos))return;this._schronienie&&(this.swiat.remove(this._schronienie),this._schronienie.traverse(x=>{x.geometry?.dispose?.()}),this._schronienie=null,this._gibanaBudowla=null);for(let x of this._schronBlockers||[]){let _=this.blockers.indexOf(x);_>=0&&this.blockers.splice(_,1)}if(this._schronBlockers=[],this._etapSchronienia=Math.max(0,Math.min(t|0,ju)),this._etapSchronienia<=0)return;this.ustawPlacBudowy(!1),this._zabierzSklad();let i=n.skala??1,r=this._uklad||En,o=this._osadz(null,n.pos[0],n.pos[1],hr,n.obrot??0);o.name="schronienie-kotwica";let a=(r.zasiegKonaru-.12+r.drabinkaOdsun)*i,c=Hu(this.planeta,o,a,0,this.wysokoscGruntuSiatki,hr),l=Gp(this._etapSchronienia,i,{...r,drabinkaSpadek:c});o.add(l);let h=l.getObjectByName("schronienie-klepisko");h&&(h.geometry.dispose(),h.geometry=Vu(this.planeta,o,h.userData.promien??1.06*i,this.wysokoscGruntuSiatki,hr+.03*i),h.rotation.set(0,0,0),h.position.set(0,0,0));for(let x of[...l.children])x.userData?.przyZiemi&&o.add(x);if(this._gibanaBudowla=l,this.swiat.add(o),this._schronienie=o,!e)return;let u=[];if(o.traverse(x=>{x.userData?.krok!=null&&(u.push(x),x.visible=!1)}),u.sort((x,_)=>x.userData.krok-_.userData.krok),!u.length)return;let d=.34,f=.26,p=performance.now(),y=u.map(x=>x.scale.clone()),m=()=>{if(this.destroyed||this._schronienie!==o)return;let x=(performance.now()-p)/1e3,_=!0;u.forEach((v,k)=>{let M=(x-k*f)/d;if(M<=0){_=!1;return}if(v.visible=!0,M>=1){v.scale.copy(y[k]);return}_=!1;let T=1-(1-M)*(1-M);v.scale.set(y[k].x*T,y[k].y*(T+Math.sin(M*Math.PI)*.12),y[k].z*T)}),_||requestAnimationFrame(m)};requestAnimationFrame(m);let g=(u.length*f+d)*1e3+400;setTimeout(()=>{this.destroyed||this._schronienie!==o||u.forEach((x,_)=>{x.visible=!0,x.scale.copy(y[_])})},g)}_placBudowy(t){let e=new it;e.name="plac-budowy";let n=new te({color:10189646,flatShading:!0});for(let i of[-1,1]){let r=new At(new pe(.06*t,.085*t,.34*t,5),n);r.position.set(i*.68*t,.17*t,0),e.add(r)}return e}_ikonaDomku(){if(this._ikDom!==void 0)return this._ikDom;let t=new Image;return t.onload=()=>{this._placIk?.rysuj(!!this._placGotowy)},t.onerror=()=>{console.warn("[plac] brak ikony domku"),this._ikDom=null},t.src=`${this.opts.zasoby??"./assets/"}ikona-siedlisko.png`,this._ikDom=t,t}_placIkona(){let e=document.createElement("canvas");e.width=e.height=256;let n=e.getContext("2d"),i=new he(e);i.colorSpace=Vt;let r=new De(new Le({map:i,transparent:!0,depthTest:!1}));return r.renderOrder=58,r.scale.setScalar(1.05),r.rysuj=o=>{n.clearRect(0,0,256,256),n.lineCap="round",n.lineJoin="round";let{c0:a,u:c}=this._tloWskaznika(n,256,(h,u,d)=>{h.lineWidth=11*d,h.strokeStyle=o?"#FF7A18":"#5a5326",h.beginPath(),h.arc(u,u,43.5*d,0,Math.PI*2),h.stroke()}),l=this._ikonaDomku();if(l&&l.complete&&l.naturalWidth){let h=62*c;n.drawImage(l,a-h/2,a-h/2,h,h)}r.material.map.needsUpdate=!0},r}ustawPlacBudowy(t,e=!1){let n=this.mapa.schronienie;if(!n||!Array.isArray(n.pos))return;if(!t||this._etapSchronienia>0){this._plac&&(this.swiat.remove(this._plac),this._plac.traverse(r=>{r.geometry?.dispose?.()}),this._plac=null,this._placPierscien=null,this._placGotowy=void 0),this._placIk&&(this.swiat.remove(this._placIk),this._placIk.material.map?.dispose?.(),this._placIk.material.dispose?.(),this._placIk=null);return}let i=n.skala??1;if(!this._plac){let r=this._placBudowy(i),o=this._osadz(r,n.pos[0],n.pos[1],.01,n.obrot??0),a=new te({color:9337430,flatShading:!0,transparent:!0,opacity:.55}),c=new At(Vu(this.planeta,o,1.02*i,this.wysokoscGruntuSiatki,.01+.03*i),a);r.add(c);let l=1.02*i,h=Math.sqrt(Math.max(0,this.planeta.R**2-l**2))-this.planeta.R,u=qu(16760929,.26);u.scale.setScalar(l/.66),u.position.y=h+.05*i,u.renderOrder=3,r.add(u);let d=this._placIkona();d.position.copy(o.position).addScaledVector(this.planeta.normalna(n.pos[0],n.pos[1]),1.45*i),this.swiat.add(o),this.swiat.add(d),this._plac=o,this._placIk=d,this._placBaza=d.position.clone(),this._placN=this.planeta.normalna(n.pos[0],n.pos[1]).clone(),this._placPierscien=u;let f=()=>{if(this.destroyed||this._placIk!==d)return;let p=performance.now()*.0022,y=!!this._placGotowy;d.position.copy(this._placBaza).addScaledVector(this._placN,Math.sin(p)*(y?.11:.05)),d.scale.setScalar(y?1.05+Math.sin(p*1.6)*.076:1),Yu(u,performance.now()*.001,y?1.9:.85),requestAnimationFrame(f)};requestAnimationFrame(f)}if(this._placGotowy!==e){this._placGotowy=e,this._placIk?.rysuj(e);let r=this._placPierscien;r&&(r.material.opacity=e?.5:.24,r.material.color.setHex(e?16742936:15255690),r.smuga&&r.smuga.material.color.setHex(e?16767392:15255690))}}_fasolaTik(t){for(let i of this.oczka)i.tik(t);let e=this.fasola;if(!e)return;let n=this.planeta.odleglosc(this.hn,e.n);if(e.update(t,n,!!this.kropla?.ile),!(this._kino||this.sequence)){if(this.kropla&&!this.kropla.ile){for(let i of this.oczka)if(!(this.planeta.odleglosc(this.hn,i.n)>=i.promien*.85)){this.kropla.dodaj(),this.hint("Kropla wody!"),this.emit("woda:nabrana",{pos:i.pos});try{navigator.vibrate?.([12,30,12])}catch{}break}}if(n<(e.def.zasieg??1.9))if(this.kropla?.ile&&!e.gotowa&&e.podlej()){this.kropla.oddaj(),this.hint(e.etap+1>=e.ostatni?"Fasola si\u0119ga chmur!":"Fasola ro\u015Bnie!"),this.emit("fasola:podlana",{etap:e.etap+1,etapow:e.ostatni}),this._wspUzbrojona=!1;try{navigator.vibrate?.([18,40,18])}catch{}this.input.lengthSq()<.02&&(this.moveSpeed||0)<.05&&!this.walking&&(this.play("happy",.12),this.sequence="happy",this.seqTimer=0)}else e.gotowa&&n<1.1&&this._wspUzbrojona&&this._wspinaczkaStart();else n>2.4&&(this._wspUzbrojona=!0)}}_wspinaczkaStart(){let t=this.fasola;this.stopWalk(),this.mode="free",this.sequence="wspinaczka",this.seqTimer=0,this._wsp={kat0:0},this._wspDodatek=0;let e=on(t.n,this.hn,this.hf,this._v1),n=this._v2.set(1,0,0).applyQuaternion(this.planeta.ramka(t.def.pos[0],t.def.pos[1],this._qTmp));qe(n,t.n);let r=Pu(n,e,t.n)-t.sciezka(0).kat;r=Math.atan2(Math.sin(r),Math.cos(r)),this._wsp.dk=r,this.play("run",.15),this.emit("fasola:wspinaczka",{wysokosc:t.wysokosc,dalej:t.def.dalej||null})}_wspinaczkaKlatka(t){let e=this.fasola,n=this._wsp;if(!e||!n){this.sequence=null;return}this.seqTimer+=t;let i=Math.min(1,this.seqTimer/pr.czasWspinaczki),r=i*i*(3-2*i),o=e.sciezka(r),a=o.kat+n.dk*(1-Math.min(1,r/.12)),c=this.planeta.ramka(e.def.pos[0],e.def.pos[1],this._qTmp),l=this._v1.set(Math.cos(a),0,Math.sin(a)).applyQuaternion(c);qe(l,e.n);let h=this.planeta.punktObok(e.n,l,o.r,this._v2),u=this._v3.crossVectors(l,e.n).normalize();if(this.hn.copy(h),this.hf.copy(u),qe(this.hf,this.hn),this.aktualizujHp(),this._wspDodatek=o.h,i>=1){this.sequence=null,this.play("happy",.2);let d=e.def.dalej||null;this.emit("swiat:dalej",{cel:d,z:"fasola"}),this._wspDodatek=0,this._wsp=null,this._wspUzbrojona=!1}}pauza(){this.paused||this.destroyed||(this.paused=!0,this.renderer.setAnimationLoop(null),this.emit("pauza"))}wznow(){!this.paused||this.destroyed||(this.paused=!1,this.clock.getDelta(),this.renderer.setAnimationLoop(()=>this.tick()),this.emit("wznowienie"))}ustawBohatera(t,e){return this.hero?(this._zasiewOstatnia=null,this._zasiewDroga=0,this.stopWalk(),this.mode="free",this.planeta.normalna(t,e,this.hn),qe(this.hf,this.hn),this.aktualizujHp(),this.groundY=this.groundHeightAt(t,e),this.heroLift=this.groundY+(this.clipY?.[this.current]??0),this.syncHero(),!0):!1}ustawSpokojnyRuch(t){Nn=!!t}ustawPowrotZnaku(t,e){let n=(this.markers||[]).find(i=>i.id===t);return n?(n.def.respawn=e===!1?1/0:Number(e),!0):!1}kino(t,e){if(!this.hero||Nn)return!1;let n={wejscie:{trzym:1.9,powrot:1.5,kadr:1.7,luk:1.45,el:.2},bohater:{trzym:.9,powrot:1.1,kadr:2.6,luk:.8,el:.32},blysk:{trzym:.45,powrot:.75,kadr:3.4,luk:.45,el:.45}},i=n[t]||n.bohater;if(e){i=Object.assign({},i);for(let h in e)e[h]!=null&&(i[h]=e[h])}let r=this.hero.getWorldPosition(new S),o=new Ee().setFromObject(this.hero),a=Math.min(2.2,Math.max(.4,(o.max.y-r.y)*.86)),c=Math.max(.001,this.camera.right-this.camera.left),l=this.heading||0;return this._kino={faza:"trzym",t:0,trzymDl:i.trzym,powrotDl:i.powrot,gy:a,zoom:Math.max(1.05,c/(i.kadr||1.7)),az0:l-i.luk*.38,az1:l+i.luk*.62,el:i.el,br:this.camRight.clone(),bf:this.camFwd.clone()},this.mode="free",this.walking=!1,this.emit("kino",{ujecie:t}),!0}kinoSkroc(){let t=this._kino;return!t||t.faza!=="trzym"?!1:(t.pl=Math.min(1,t.t/Math.max(.001,t.trzymDl)),t.faza="powrot",t.t=0,t.powrotDl=.45,!0)}_kinoWejscie(){}kinoWejsciaTeraz(){try{console.log("[KINO] kinoWejsciaTeraz; hero?",!!this.hero,"camDir?",!!this.camDir,"camPos?",!!this.camPos)}catch{}if(!this.hero)return!1;let t=Math.atan2(this.camDir.x,this.camDir.z);return this._wejscie={t:0,hold:1.9,dl:1.7,epsStart:1.4,azStart:t+2.62,zoomStart:.72},!0}_wejscieKlatka(t){let e=this._wejscie;if(!e)return;if(e.t===0)try{console.log("[KINO] pierwsza klatka najazdu (start z gory)")}catch{}e.t+=t;let n=0;if(e.t>e.hold){let d=Math.min(1,(e.t-e.hold)/e.dl);n=1-Math.pow(1-d,3)}let i=this.camDir.length(),r=Math.asin(Math.max(-1,Math.min(1,this.camDir.y/i))),o=Math.atan2(this.camDir.x,this.camDir.z),a=e.epsStart+(r-e.epsStart)*n,c=e.azStart+(o-e.azStart)*n,l=e.zoomStart+(1-e.zoomStart)*n,h=Math.cos(a),u=Math.sin(a);if(this.camPos.set(this.camTarget.x+h*Math.sin(c)*i,this.camTarget.y+u*i,this.camTarget.z+h*Math.cos(c)*i),this._kc.set(this.camTarget.x,this.camTarget.y+.8,this.camTarget.z),Math.abs(this.camera.zoom-l)>1e-4&&(this.camera.zoom=l,this.camera.updateProjectionMatrix()),e.t>=e.hold+e.dl){this._wejscie=null,this.camera.zoom!==1&&(this.camera.zoom=1,this.camera.updateProjectionMatrix());try{this.emit("wejscie:gotowe")}catch{}}}_zacznijOpadKlod(t,e=1){if(Nn)return;let n=t.getObjectByName("stos-drewna")||t.getObjectByName("kamyczki");if(!n||!n.children.length)return;let i=n.children.map(a=>{let c=a.userData.opadCel||(a.userData.opadCel={y:a.position.y,rx:a.rotation.x,rz:a.rotation.z});return{m:a,y:c.y,rx:c.rx,rz:c.rz}});this._opadKlod&&(this._opadKlod=this._opadKlod.filter(a=>a.czesci[0]?.m.parent!==n));let r=a=>a.geometry?.type==="BoxGeometry";i.sort((a,c)=>(r(a.m)?1:0)-(r(c.m)?1:0)||a.y-c.y);let o=Math.max(1.1,e*kM);i.forEach((a,c)=>{a.opoznienie=c*RM,a.start=a.y+o,a.obrotX=a.rx+(Math.random()-.5)*1.2,a.obrotZ=a.rz+(Math.random()-.5)*1.2,a.m.visible=!1}),(this._opadKlod||(this._opadKlod=[])).push({czesci:i,t:0})}_opadKlodKlatka(t){let e=this._opadKlod;if(!(!e||!e.length))for(let n=e.length-1;n>=0;n--){let i=e[n];i.t+=t;let r=!1;for(let o of i.czesci){let a=(i.t-o.opoznienie)/zM;if(a<0){r=!0;continue}if(o.m.visible=!0,a>=1){o.m.position.y=o.y,o.m.rotation.x=o.rx,o.m.rotation.z=o.rz;continue}r=!0;let c=CM(a);o.m.position.y=o.start+(o.y-o.start)*c;let l=Math.min(1,a/.68),h=l*l*(3-2*l);o.m.rotation.x=o.obrotX+(o.rx-o.obrotX)*h,o.m.rotation.z=o.obrotZ+(o.rz-o.obrotZ)*h}r||e.splice(n,1)}}_nocKlatka(t){if(!this.doba||!this.doba.naCzas)return;let e=this.doba.etapSesji==="koniec";if(this._zoomNocy===void 0&&(this._zoomNocy=1),!e&&this._zoomNocy===1)return;let n=e?mm:1;this._zoomNocy+=(n-this._zoomNocy)*(1-Math.exp(-.34*t)),Math.abs(this._zoomNocy-n)<.004&&(this._zoomNocy=n),e&&!this._sesjaZamknieta&&this._zoomNocy<mm+.02&&(this._sesjaZamknieta=!0,this.emit("sesja:zamknieta",{...this.doba.stan})),this._zoomNocy!==1&&(this.camera.zoom*=this._zoomNocy,this.camera.updateProjectionMatrix())}_kinoKlatka(t){this._kc||(this._kc=new S),this._kcT||(this._kcT=new S),this._kc.set(this.camTarget.x,this.camTarget.y+.8,this.camTarget.z);let e=this._kino;if(!e||!this.hero){this.camera.zoom!==1&&(this.camera.zoom=1,this.camera.updateProjectionMatrix());return}e.t+=t;let n,i;if(e.faza==="trzym")i=Math.min(1,e.t/Math.max(.001,e.trzymDl)),n=1,e.t>=e.trzymDl&&(e.faza="powrot",e.t=0);else{i=e.pl!=null?e.pl:1;let h=Math.min(1,e.t/Math.max(.001,e.powrotDl));if(n=1-h*h*(3-2*h),e.t>=e.powrotDl){this._kino=null,this.camRight.copy(e.br),this.camFwd.copy(e.bf),this.camera.zoom!==1&&(this.camera.zoom=1,this.camera.updateProjectionMatrix());return}}let r=i*i*(3-2*i),o=e.az0+(e.az1-e.az0)*r,a=e.el,c=this.hero.getWorldPosition(this._kcH||(this._kcH=new S));this._kcT.set(c.x,c.y+e.gy,c.z),this._kc.lerp(this._kcT,n),this._kcT.set(Math.sin(o)*Math.cos(a),Math.sin(a),Math.cos(o)*Math.cos(a)).multiplyScalar(26).add(this._kc),this.camPos.lerp(this._kcT,n);let l=1+(e.zoom-1)*n;Math.abs(this.camera.zoom-l)>1e-4&&(this.camera.zoom=l,this.camera.updateProjectionMatrix())}pokazZnak(t){let e=(this.markers||[]).find(n=>n.id===t);return!e||e.state!=="gone"?!1:(e.state="appear",e.phase=0,e.setVisible(!0),!0)}schowajZnak(t){let e=(this.markers||[]).find(n=>n.id===t);return e?e.startAbsorb(!0):!1}stan(){return{gotowa:!!this.hero,pauza:this.paused,animacja:this.current,predkosc:+(this.moveSpeed||0).toFixed(3),zasiew:{wlaczony:this.zasiewWlaczony,...this.kwiaty?.stanZasiewu()},fasola:this.fasola?{etap:this.fasola.etap,etapow:this.fasola.ostatni,gotowa:this.fasola.gotowa,kropla:!!this.kropla?.ile}:null,bohater:this.hero?{x:+this.hp.x.toFixed(2),z:+this.hp.z.toFixed(2)}:null,znaki:(this.markers||[]).map(t=>({id:t.id,stan:t.state,dotkniecia:t.touches})),rabanie:{aktywne:!!this._rabanieAktywne,cele:(this._doScinania||[]).map(t=>({id:t.id,rodzaj:t.rodzaj,zrobione:t.zrobione,niesione:!!t.niesione,dostarczone:!!t.dostarczone,postep:+(t.postep||0).toFixed(2),zasieg:t.zasieg,odleglosc:this.hn&&t.n?+this.planeta.odleglosc(this.hn,t.n).toFixed(2):null,doWyniku:this.hn&&t.nWyniku?+this.planeta.odleglosc(this.hn,t.nWyniku).toFixed(2):null})),niesie:this._ladunek?{rodzaj:this._ladunek.rodzaj,id:this._ladunek.id}:null,doPlacu:this.hn&&this._nPlacu?+this.planeta.odleglosc(this.hn,this._nPlacu).toFixed(2):null},podglad:this._podglad?{faza:this._podglad.faza,pos:this._podglad.pos}:null,schronienie:{etap:this._etapSchronienia||0,etapow:ju,miejsce:this.mapa.schronienie?.pos||null,plac:this._plac?this._placGotowy?"gotowy":"czeka":"ukryty"}}}zniszcz(){this.destroyed||(this.destroyed=!0,this.renderer.setAnimationLoop(null),removeEventListener("resize",this.onWinResize),this.onKeyDown&&(removeEventListener("keydown",this.onKeyDown),removeEventListener("keyup",this.onKeyUp),removeEventListener("blur",this.onBlur)),this.ro?.disconnect(),this.scene.traverse(t=>{t.geometry?.dispose?.();let e=t.material?Array.isArray(t.material)?t.material:[t.material]:[];for(let n of e){for(let i of["map","emissiveMap","normalMap","roughnessMap","metalnessMap"])n[i]?.dispose?.();n.dispose?.()}}),this.mixer?.stopAllAction(),this.renderer.dispose(),this.listeners.clear(),this.emit("zniszczona"))}resize(){if(this.destroyed)return;let t=this.host.getBoundingClientRect(),e=Math.max(1,Math.round(t.width||innerWidth)),n=Math.max(1,Math.round(t.height||innerHeight));this.renderer.setSize(e,n);let i=e/n,r=Number(globalThis.SCENA3D_ZOOM)||Number(this.mapa?.zoom)||SM,o=i>=1,a=o?14:8.4,c=this.planeta?.R||8,l=Number(globalThis.SCENA3D_KAMERA_PODNIESIENIE)||(o?Number(globalThis.SCENA3D_KAMERA_PODNIESIENIE_POZIOM)||c*(this.mapa?.dolnyDok===!1?IM:PM):this.mapa?.kameraPodniesienie??c*pm);this.camTarget&&Math.abs(this.camTarget.y-(c+l))>1e-6&&(this.camTarget.y=c+l,this.camPos&&(this.camPos.copy(this.camTarget).add(this.camDir),this.camera.position.copy(this.camPos),this.camera.lookAt(this.camTarget)));let u=Math.max(.5,(o?TM:AM)*c-l*EM),d=a/(i*2*u),f=Math.max(.3,Math.min(r,d)),p=a/f,y=p/i;this.camera.left=-p/2,this.camera.right=p/2,this.camera.top=y/2,this.camera.bottom=-y/2,this.camera.updateProjectionMatrix(),this.hero&&this.updateCameraBasis()}};var UM=`
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
`;function ym({tekstLadowania:s="\u0141adowanie bohatera\u2026",tekstPodpowiedzi:t="Przesu\u0144 palcem, by i\u015B\u0107 w dowoln\u0105 stron\u0119"}={}){return`
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
</div>`}var gm=!1;function _m(s){if(gm||s.querySelector("style[data-scena3d]"))return;let t=s.createElement("style");t.dataset.scena3d="1",t.textContent=UM,s.head.appendChild(t),gm=!0}var aS=["gotowa","wejscie:gotowe","minigra:start","znak:dotkniety","bohater:doszedl","latarnia:reakcja","doba:pora","doba:sesja","sesja:zamknieta","swiatlo:zebrane","woda:nabrana","fasola:podlana","fasola:wspinaczka","swiat:dalej","surowiec:zdobyty","surowiec:podniesiony","surowiec:dostarczony","miejsce:pokazane","pauza","wznowienie","zniszczona","blad"];async function OM(s={}){let t=typeof s.kontener=="string"?document.querySelector(s.kontener):s.kontener||document.body;if(!t)throw new Error("Scena 3D: nie znalaz\u0142em kontenera");let e=t.ownerDocument||document;_m(e);let n=e.createElement("div");n.className="scena3d-root"+(s.panel===!1?" bez-panelu":""),n.innerHTML=ym(s.teksty||{}),t.appendChild(n);let i=new bc(n,{zasoby:s.zasoby,spokojnyRuch:s.spokojnyRuch,klawiatura:s.klawiatura,onEvent:s.onZdarzenie}),r={element:n,on:(o,a)=>i.on(o,a),off:(o,a)=>i.off(o,a),pauza:()=>i.pauza(),wznow:()=>i.wznow(),ustawBohatera:(o,a)=>i.ustawBohatera(o,a),ustawSpokojnyRuch:o=>i.ustawSpokojnyRuch(o),ustawZasiew:o=>i.ustawZasiew(o),ustawSladyPrzygod:(o,a=!1)=>{let c=Math.max(0,Math.min(7,Math.floor(Number(o)||0)));if(!i.kwiaty)return;let l=globalThis.__SCENA3D_MAPA?.start?.pos||[0,6.72];for(let h=i._sladyPrzygod||0;h<c;h++)for(let u=0;u<5;u++){let d=(h*5+u)/35*Math.PI*2;i.kwiaty.posadz(l[0]+Math.cos(d)*2.5,l[1]+Math.sin(d)*2.5,a)}i._sladyPrzygod=Math.max(i._sladyPrzygod||0,c)},ustawPowrotZnaku:(o,a)=>i.ustawPowrotZnaku(o,a),pokazZnak:o=>i.pokazZnak(o),kino:(o,a)=>i.kino(o,a),kinoSkroc:()=>i.kinoSkroc(),kinoWejsciaTeraz:()=>i.kinoWejsciaTeraz(),oznaczZuzyte:o=>i.oznaczZuzyte(o),oznaczDostarczone:o=>i.oznaczDostarczone(o),ustawRabanieAktywne:o=>i.ustawRabanieAktywne(o),ustawSchronienie:(o,a)=>i.ustawSchronienie(o,a),edytorDomku:()=>i.edytorDomku(),ustawPlacBudowy:(o,a)=>i.ustawPlacBudowy(o,a),pokazMiejsce:(o,a)=>i.pokazMiejsce(o,a),pokazZnakWKadrze:(o,a)=>i.pokazZnakWKadrze(o,a),stan:()=>i.stan(),zniszcz:()=>{i.zniszcz(),n.remove()},_app:i};try{globalThis.__SCENA=r}catch{}try{await i.gotowa}catch(o){console.error("Scena 3D: nie uda\u0142o si\u0119 wczyta\u0107 modeli",o),r.blad=String(o?.message||o)}return r}function cS(s="ewolucja-scena-3d"){if(typeof customElements>"u"||customElements.get(s))return;class t extends HTMLElement{async connectedCallback(){if(!this._api){this.style.display=this.style.display||"block",this._api=await OM({kontener:this,zasoby:this.getAttribute("zasoby")||void 0,panel:!this.hasAttribute("bez-panelu"),klawiatura:!this.hasAttribute("bez-klawiatury"),spokojnyRuch:this.hasAttribute("spokojny-ruch")?!0:void 0});for(let n of["pauza","wznow","ustawBohatera","ustawSpokojnyRuch","ustawZasiew","ustawPowrotZnaku","pokazZnak","stan"])this[n]=(...i)=>this._api[n](...i);this.dispatchEvent(new CustomEvent("scena3d:zamontowana",{bubbles:!0}))}}disconnectedCallback(){this._api?.zniszcz(),this._api=null}}customElements.define(s,t)}function lS(s,t="*"){if(typeof window>"u"||window.parent===window)return()=>{};let e=s.on("*",i=>{window.parent.postMessage({scena3d:"zdarzenie",nazwa:i.nazwa,dane:i},t)}),n=i=>{let r=i.data;if(!r||r.scena3d!=="komenda"||typeof s[r.metoda]!="function")return;let o=s[r.metoda](...r.argumenty||[]);window.parent.postMessage({scena3d:"odpowiedz",metoda:r.metoda,wynik:o},t)};return addEventListener("message",n),window.parent.postMessage({scena3d:"gotowa"},t),()=>{e(),removeEventListener("message",n)}}export{aS as ZDARZENIA,lS as mostIframe,OM as utworzScena3D,cS as zarejestrujElement};
