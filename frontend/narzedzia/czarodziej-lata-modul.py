"""Doklada czarodzieja do zbudowanego modulu sceny (scena3d.js / scena3d.esm.js).

Modul jest zminifikowanym bundlem, wiec zmiany wchodza przez podmiane lancuchow.
Kazda podmiana MUSI trafic dokladnie raz - inaczej skrypt konczy sie bledem
i nie zapisuje niczego. Uruchomienie drugi raz na juz zalatanym pliku zglosi
0 trafien, czyli tez sie nie powiedzie. To celowe: lepiej blad niz podwojna
lata w minifikacie.
"""
import re
import sys

ZNAK = (
    '{id:"czarodziej",file:"wizard",label:"Czarodziej",'
    'toast:"Czarodziej pojawi\\u0142 si\\u0119 w lesie",'
    'pos:[-6.2,1.8],pozycje:[[-6.2,1.8],[4.8,2.6],[-2.4,-5.2],[6.4,-3.4],[.6,6.2]],'
    'scale:2.9,height:.8,animuj:!0,bezObrotu:!0,obrotY:.484,'
    'absorb:!1,raz:!0,zasieg:1.7,cykl:30,respawn:60,'
    'glow:12093672,ringColor:14268159,jasnosc:1.22,metalness:0,roughness:.85,'
    'haloOpacity:.16,haloScale:1.5,ringOpacity:.26,lightBase:0,iskry:34,iskrySila:1.7},'
)

ZMIANY = [
    ("materialy przezroczyste dla znikania",
     r"e\.absorb&&\(h\.transparent=!0,h\.depthWrite=!0\)",
     "e.absorb||e.cykl>0?(h.transparent=!0,h.depthWrite=!0):0"),

    ("brak obrotu dla postaci",
     r"(this\.def\.faceCamera\?this\.spin\.rotation\.y=Math\.sin\(this\.time\*\.9\)\*\.38\*t\+(\w)\*1\.6\+r\*1\.1:)this\.spin\.rotation\.y\+=e\*\(\.7\+2\.4\*\2\)",
     r"\1this.def.bezObrotu?this.spin.rotation.y=this.def.obrotY??0:this.spin.rotation.y+=e*(.7+2.4*\2)"),

    ("mikser animacji znaku",
     r"update\(e,t=1,n=99\)\{this\.time\+=e;",
     "update(e,t=1,n=99){this.time+=e,this.mixer&&this.mixer.update(e);"),

    ("powrot: nowe miejsce + iskry",
     r'this\.phase\+=e,this\.phase>=\(this\.def\.respawn\?\?3\.2\)&&\(this\.state="appear",this\.phase=0,this\.setVisible\(!0\)\);',
     'this.phase+=e,this.phase>=(this.def.respawn??3.2)&&(this.przenies(),this.state="appear",this.phase=0,this.setVisible(!0),this.def.cykl>0&&this.sparkBurst(this.def.iskry??18,this.def.iskrySila??1.35));'),

    ("cykl zycia: znikanie po czasie",
     r"\}for\(let f of this\.mats\)f\.transparent&&\(f\.opacity=this\.fade\);n>1\.7&&\(this\.armed=!0\);",
     '}this.state==="idle"&&this.def.cykl>0&&((this.phase+=e)>=this.def.cykl)&&this.startAbsorb(!0);for(let f of this.mats)f.transparent&&(f.opacity=this.fade);n>1.7&&(this.armed=!0);'),

    ("dotkniecie raz na podejscie",
     r'touch\(\)\{return this\.state!=="idle"\|\|this\.punch>\.55\?!1:\(this\.punch=1,',
     'touch(){return this.state!=="idle"||this.punch>.55||this.def.raz&&!this.armed?!1:(this.def.raz&&(this.armed=!1),this.punch=1,'),

    ("wlasny promien zasiegu",
     r"u\.update\(e,(\w),d\),d<1&&\(u\.def\.absorb\?",
     r"u.update(e,\1,d),d<(u.def.zasieg??1)&&(u.def.absorb?"),

    ("loadMarkers: mikser i losowe miejsca",
     r"for\(let x of w\)if\(x\)\{let\{e,t\}=x,n=this\.groundHeightAt\(e\.pos\[0\],e\.pos\[1\]\),i=new (\w+)\(e,t\.scene,n\);this\.scene\.add\(i\.root\),this\.markers\.push\(i\)\}",
     r"for(let x of w)if(x){let{e,t}=x;e.pozycje&&(e._pozycje=e.pozycje.map(p=>[p[0],this.groundHeightAt(p[0],p[1]),p[1]]));let n=this.groundHeightAt(e.pos[0],e.pos[1]),i=new \1(e,t.scene,n);e.animuj&&t.animations&&t.animations.length&&(i.mixer=new Hr(t.scene),i.mixer.clipAction(t.animations[0]).play()),i.przenies(),this.scene.add(i.root),this.markers.push(i)}"),

    ("metoda przenies()",
     r"setVisible\(e\)\{if\(this\.spin\.visible=e,",
     "przenies(){let p=this.def._pozycje;if(!p||p.length<2)return;let q=p[Math.floor(Math.random()*p.length)];this.root.position.set(q[0],q[1],q[2])}setVisible(e){if(this.spin.visible=e,"),

    ("API schowajZnak",
     r'(pokazZnak\(e\)\{let t=\(this\.markers\|\|\[\]\)\.find\(n=>n\.id===e\);return!t\|\|t\.state!=="gone"\?!1:\(t\.state="appear",t\.phase=0,t\.setVisible\(!0\),!0\)\})',
     r"\1schowajZnak(e){let t=(this.markers||[]).find(n=>n.id===e);return t?t.startAbsorb(!0):!1}"),

    ("znak czarodzieja w tablicy znakow",
     r'var (\w+)=\[(?=\{id:"medal")',
     lambda m: "var " + m.group(1) + "=[" + ZNAK),
]

bledy = 0
for sciezka in sys.argv[1:]:
    with open(sciezka, encoding="utf-8") as f:
        tresc = f.read()
    print("=== " + sciezka)
    for nazwa, wzor, zamiana in ZMIANY:
        ile = len(re.findall(wzor, tresc))
        if ile != 1:
            print("  BLAD  %s: trafien %d (oczekiwano 1)" % (nazwa, ile))
            bledy += 1
            continue
        tresc = re.sub(wzor, zamiana, tresc, count=1)
        print("  ok    " + nazwa)
    if bledy == 0:
        with open(sciezka, "w", encoding="utf-8") as f:
            f.write(tresc)

sys.exit(1 if bledy else 0)
