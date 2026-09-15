/**
 * schronienie.js — budowla, która rośnie etapami z tego, co dziecko zdobyło
 * w świecie. Każdy etap to OSOBNA grupa; scena pokazuje wszystkie etapy do
 * numeru `n` włącznie, więc dołożenie kolejnego nie rusza poprzednich.
 */
import {
  Group, Mesh, MeshLambertMaterial, CylinderGeometry, CircleGeometry,
  DodecahedronGeometry,
} from "three";

const matKanciasty = (kolor) => new MeshLambertMaterial({ color: kolor, flatShading: true });

function mesh(geo, mat, pos = [0, 0, 0], rot = [0, 0, 0]) {
  const m = new Mesh(geo, mat);
  m.position.set(...pos);
  m.rotation.set(...rot);
  return m;
}

export const MAT_BUDOWY = {
  kora: matKanciasty(0x7a6144),
  ciecie: matKanciasty(0xd8b578),
  klepisko: matKanciasty(0x8d7d5c),
  kamien: matKanciasty(0x918b78),
  kamienCiemny: matKanciasty(0x716c60),
};

/** Kłoda z jasnymi czołami — ten sam zapis co w `natura.js`. */
function kloda(dl, r, seg = 8) {
  return new Mesh(new CylinderGeometry(r, r * .94, dl, seg),
    [MAT_BUDOWY.kora, MAT_BUDOWY.ciecie, MAT_BUDOWY.ciecie]);
}

/**
 * Słup z rozwidleniem — w rozwidleniu siada belka. To rozwidlenie jest całą
 * konstrukcją tego etapu: bez niego belka „lewituje" nad słupami i dziecko
 * nie widzi, co ją trzyma.
 */
function slupZWidelkami(s, wys) {
  const g = new Group();
  // Grubość słupa: 0,13 zamiast 0,085. Cieńsze wyglądały jak tyczki wbite
  // w trawę — a to ma być kłoda, którą dziecko przed chwilą przyniosło.
  g.add(mesh(new CylinderGeometry(.13 * s, .155 * s, wys * s, 7),
    MAT_BUDOWY.kora, [0, wys * s * .5, 0]));
  // Widelce rozchylone SZEROKO (.62 rad): przy ciasnym kącie dwa stożki
  // zlewają się w jeden trójkąt i słup wygląda jak grot strzały.
  // Muszą też WYSTAWAĆ PONAD BELKĘ, inaczej chowają się za nią i znika
  // jedyny element, który tłumaczy, na czym ta belka leży.
  [-1, 1].forEach((k) => {
    g.add(mesh(new CylinderGeometry(.055 * s, .085 * s, .44 * s, 5),
      MAT_BUDOWY.kora, [k * .11 * s, wys * s + .16 * s, 0], [0, 0, k * .58]));
  });
  // Kamienie klinujące słup przy ziemi — stąd wiadomo, po co były kamyczki.
  [[.16, .13, .1], [-.14, .11, -.12], [.02, .1, .18]].forEach(([x, r, z], i) => {
    const p = mesh(new DodecahedronGeometry(r * s, 0),
      i === 1 ? MAT_BUDOWY.kamienCiemny : MAT_BUDOWY.kamien,
      [x * s, r * .55 * s, z * s], [.4 + i, .8 * i, .3]);
    p.scale.set(1.1, .72, .95);
    g.add(p);
  });
  return g;
}

/**
 * ETAP 1 — SZKIELET. Dwa rozwidlone słupy i belka kalenicowa: dokładnie trzy
 * kłody, czyli jeden stos drewna. Ma wyglądać na ZACZĘTE, a nie na zrujnowane:
 * wszystko stoi prosto, kamienie leżą równo, nic nie jest złamane.
 */
function etap1(s = 1) {
  const g = new Group();
  g.name = "schronienie-etap-1";

  const klepisko = mesh(new CircleGeometry(1.06 * s, 14), MAT_BUDOWY.klepisko,
    [0, .012 * s, 0], [-Math.PI / 2, 0, .3]);
  klepisko.userData.krok = 0;
  g.add(klepisko);

  // Słupy są RÓŻNEJ WYSOKOŚCI, więc belka leży skośnie. Dwa równe słupy
  // z poprzeczką czytają się jak BRAMA — a brama już jest na tej mapie
  // i znaczy co innego. Skos od razu mówi „tędy pójdzie dach".
  const WYS = [1.42, .94];
  [-1, 1].forEach((k, i) => {
    const sl = slupZWidelkami(s, WYS[i]);
    sl.position.set(k * .68 * s, 0, 0);
    sl.rotation.y = k * .2;
    sl.userData.krok = i + 1;
    g.add(sl);
  });

  /* Belka kończy się DOKŁADNIE na widełkach (+0,1 na wystawkę), a nie pół
     metra za nimi: wystająca dźwignia czytała się jak katapulta, nie jak
     początek dachu. */
  const dy = (WYS[1] - WYS[0]) * s;
  const dx = 1.36 * s;
  const belka = kloda(Math.hypot(dx, dy) + .1 * s, .105 * s);
  belka.rotation.set(0, 0, Math.PI / 2 + Math.atan2(dy, dx));
  belka.position.set(0, (WYS[0] + WYS[1]) * .5 * s + .15 * s, 0);
  belka.userData.krok = 3;
  g.add(belka);

  return g;
}

const ETAPY = [etap1];

/**
 * Buduje schronienie do etapu `n` włącznie (n = 1 to sam szkielet).
 * Elementy niosą w `userData.krok` numer kroku w animacji stawiania —
 * scena układa je po kolei, zamiast pokazywać całość naraz.
 */
export function schronienie(n = 1, s = 1) {
  const g = new Group();
  g.name = "schronienie";
  for (let i = 0; i < Math.min(n, ETAPY.length); i++) g.add(ETAPY[i](s));
  return g;
}

export const LICZBA_ETAPOW = ETAPY.length;

/** Ile czego kosztuje dany etap — jedno miejsce, z którego czyta i świat, i tekst Wizkora. */
export const KOSZT_ETAPU = [
  { klody: 3, kamyki: 6, opis: "szkielet: dwa słupy i belka" },
];
