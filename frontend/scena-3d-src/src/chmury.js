/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/** Żywe chmury 2.5D: wspólne low-poly obłoki składają się w zmienne sylwetki. */
import {
  BufferGeometry, Color, DynamicDrawUsage, Euler, Float32BufferAttribute, Group,
  IcosahedronGeometry, InstancedMesh, Matrix4, MeshLambertMaterial, Quaternion, Vector3,
} from 'three';

function geometriaObloku() {
  const baza = new IcosahedronGeometry(1, 2);
  const g = new BufferGeometry().copy(baza);
  const pozycje = g.getAttribute('position');
  const colors = [];
  const dol = new Color(0xdceafb), gora = new Color(0xfffdf5), c = new Color();
  for (let i=0; i<pozycje.count; i++) {
    const h = Math.max(0,Math.min(1,(pozycje.getY(i)+1)/2));
    c.copy(dol).lerp(gora,Math.sqrt(h));
    colors.push(c.r,c.g,c.b);
  }
  g.setAttribute('color',new Float32BufferAttribute(colors,3));
  g.computeVertexNormals();
  g.computeBoundingSphere();
  baza.dispose();
  return g;
}

// x, y, z, szerokość, wysokość, głębokość. Nakładające się obłoki dają
// trzy różne bazowe sylwetki, zanim dojdzie losowanie i animacja.
const WZORY = [
  [
    [0,0,.04,1.02,.27,.48],[-.68,.05,0,.54,.30,.39],[.67,.06,.01,.55,.31,.40],
    [-.34,.24,-.02,.52,.42,.42],[.16,.31,-.04,.62,.52,.48],[.57,.22,.02,.43,.36,.36],
  ],
  [
    [0,0,.05,1.14,.25,.48],[-.80,.03,.01,.48,.27,.36],[.80,.04,.02,.49,.28,.37],
    [-.47,.23,-.02,.55,.40,.41],[.02,.28,-.05,.60,.47,.46],[.48,.27,-.01,.58,.43,.43],
    [.76,.18,.03,.35,.30,.32],
  ],
  [
    [0,0,.06,.95,.27,.47],[-.62,.04,.02,.52,.29,.38],[.63,.05,.01,.52,.30,.39],
    [-.39,.23,-.02,.46,.38,.39],[.02,.34,-.06,.58,.55,.48],[.43,.27,-.03,.48,.43,.40],
    [-.12,.55,-.08,.36,.34,.34],[.66,.20,.03,.34,.29,.31],
  ],
];

export const CHMURY = {
  ile: 4, skalaOd: .40, skalaDo: .58,
  tempoOd: .022, tempoDo: .028, glebokosc: -45,
  // Rozstaw torów i to, jak mocno rozchodzą się ku bokom kadru w miarę
  // zbliżania. Większe liczby = chmury kończą bieg przy krawędziach ekranu.
  rozstaw: 1.45, rozsuwOd: .18, rozsuwDo: .95,
  // 1 = obłok stoi prostopadle do promienia planety (na bokach kadru
  // wyraźnie położony), 0 = zawsze poziomo jak dawniej.
  pochylenie: 1, pochylenieMaks: .85,
};

export class Chmury {
  constructor(opcje = {}) {
    const C = this.C = { ...CHMURY, ...opcje };
    this.grupa = new Group();
    this.grupa.name = 'chmury';
    this.material = new MeshLambertMaterial({ vertexColors: true,
      emissive: 0xc4d9ed, emissiveIntensity: .65, flatShading: false });
    this.geometria = geometriaObloku();

    let seed = 20260912;
    const los = () => (seed = seed * 16807 % 2147483647) / 2147483647;
    this.sztuki = [];
    let instancji = 0;
    for (let i=0; i<C.ile; i++) {
      const wzor = WZORY[i%WZORY.length].map((o,j) => ({
        x:o[0]+(los()-.5)*.055, y:o[1]+(los()-.5)*.035, z:o[2]+(los()-.5)*.04,
        sx:o[3]*(.94+los()*.12), sy:o[4]*(.92+los()*.16), sz:o[5]*(.94+los()*.12),
        faza:los()*Math.PI*2, obrot:(los()-.5)*.18, indeks:instancji+j,
      }));
      const skala = C.skalaOd + los()*(C.skalaDo-C.skalaOd);
      this.sztuki.push({wzor,skala,
        x:-C.rozstaw+(i+.5)*2*C.rozstaw/C.ile,
        postep:(i+.4)/C.ile,
        tempo:C.tempoOd+los()*(C.tempoDo-C.tempoOd),
        faza:los()*Math.PI*2});
      instancji += wzor.length;
    }

    this.mesh = new InstancedMesh(this.geometria,this.material,instancji);
    this.mesh.name = 'zywe-obloki';
    this.mesh.frustumCulled = false;
    this.mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    this.grupa.add(this.mesh);
    this._czas = 0;
    this._macierz = new Matrix4();
    this._pozycja = new Vector3();
    this._skala = new Vector3();
    this._obrot = new Euler();
    this._kwaternion = new Quaternion();
    this._srodek = new Vector3();
  }

  podepnijDoKamery(camera) { camera.add(this.grupa); this.kamera=camera; }

  aktualizuj(dt,stan,predkosc=0) {
    const k=this.kamera;
    if (!k) return;
    const krok=Math.max(0,dt);
    this._czas += krok;
    const C=this.C;
    const W=(k.right-k.left)/2/(k.zoom||1), H=(k.top-k.bottom)/2/(k.zoom||1);
    // ŚRODEK PLANETY W UKŁADZIE KAMERY. Obłoki są dziećmi kamery, a kamera
    // jest ortograficzna — jej lokalne x, y to wprost miejsce na ekranie,
    // w tych samych jednostkach co cx/cy niżej. Kula leży w zerze świata,
    // więc wystarczy przenieść zero do układu kamery: z tego jednego punktu
    // bierze się cała krzywizna, którą widać na horyzoncie.
    const srodek=this._srodek.set(0,0,0);
    k.worldToLocal(srodek);
    for (const s of this.sztuki) {
      // W kamerze ortograficznej perspektywę budują skala, tor od punktu
      // zbiegu i coraz szerszy rozstaw obłoków.
      s.postep=(s.postep+krok*s.tempo*(1+Math.min(2,Math.max(0,predkosc))*.45))%1;
      const p=s.postep;
      const gladki=p*p*(3-2*p);
      const pojawienie=Math.min(1,p/.10);
      const near=s.skala*Math.min(1,W/5.25)*2.35;
      const rozmiar=near*(.16+1.18*gladki)*pojawienie;
      const wiatr=Math.sin(this._czas*.13+s.faza)*W*.026;
      const cx=s.x*W*(C.rozsuwOd+C.rozsuwDo*gladki)+wiatr;
      // Kwadrat postępu długo trzyma chmurę w kadrze, a dopiero końcówka
      // unosi całą bryłę ponad górną krawędź.
      const cy=.30*H+p*p*(.72*H+near*2.25);
      const rozszerzenie=.78+.30*gladki;
      // NACHYLENIE WZGLĘDEM ŚRODKA PLANETY. Chmura nie wisi pionowo, tylko
      // leży na niewidzialnej sferze: jej „góra" pokrywa się z promieniem
      // planety. W środku kadru promień jest pionowy i nic się nie dzieje,
      // a im dalej w bok, tym mocniej obłok się kładzie — tak samo, jak
      // opada horyzont pod nim. Ponieważ tor odsuwa chmurę ku krawędzi,
      // nachylenie narasta samo w miarę zbliżania.
      const dx=cx-srodek.x;
      const dy=Math.max(1e-3,cy-srodek.y);
      const pochyl=Math.max(-C.pochylenieMaks,Math.min(C.pochylenieMaks,
        Math.atan2(-dx,dy)*C.pochylenie));
      const sinP=Math.sin(pochyl), cosP=Math.cos(pochyl);

      for (const o of s.wzor) {
        // Niesynchroniczne przesunięcia i skale zmieniają obrys chmury,
        // ale pozostają na tyle małe, by nie wyglądała jak galareta.
        const a=this._czas*.34+o.faza;
        const bx=o.x+Math.sin(a)*.045+Math.sin(a*.47+s.faza)*.018;
        const by=o.y+Math.cos(a*.81)*.025;
        const bz=o.z+Math.sin(a*.63)*.025;
        const pulsX=1+Math.sin(a*.73)*.055;
        const pulsY=1+Math.cos(a*.59)*.045;
        const pulsZ=1+Math.sin(a*.67+1.3)*.04;
        // Obłok obraca się JAKO CAŁOŚĆ: to samo `pochyl` kręci rozstawem
        // kulek wokół środka chmury i każdą kulką z osobna. Sam obrót
        // instancji przechyliłby bryłki, zostawiając rozstaw poziomy —
        // chmura wyglądałaby wtedy na rozjechaną, a nie położoną.
        const ox=bx*rozmiar*rozszerzenie, oy=by*rozmiar;
        this._pozycja.set(cx+ox*cosP-oy*sinP,cy+ox*sinP+oy*cosP,
          this.C.glebokosc+gladki*10+bz*rozmiar);
        this._skala.set(o.sx*rozmiar*pulsX,o.sy*rozmiar*pulsY,o.sz*rozmiar*pulsZ);
        this._obrot.set(.06+Math.sin(a*.41)*.025,(bx*.055)+Math.cos(a*.37)*.025,
          o.obrot+pochyl+Math.sin(a*.29)*.025);
        this._kwaternion.setFromEuler(this._obrot);
        this._macierz.compose(this._pozycja,this._kwaternion,this._skala);
        this.mesh.setMatrixAt(o.indeks,this._macierz);
      }
    }
    this.mesh.instanceMatrix.needsUpdate=true;
  }
}
