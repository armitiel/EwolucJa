/**
 * natura.js — elementy, które POWSTAJĄ Z PRACY dziecka: suche drzewko do
 * ścięcia, pieniek po nim, stos drewna i kamyczki z rozbitego głazu.
 *
 * Trzy decyzje, które warto znać przed zmianą:
 *
 * 1. ŚCINAMY TYLKO SUCHE DRZEWO. Gra uczy m.in. troski o otoczenie, więc
 *    ścinanie żywej sosny dla surowca niosłoby komunikat odwrotny do reszty
 *    produktu. Suchy pień jest bledszy (`0x8a7557` wobec żywego `0x765331`),
 *    nagi i ma odłamany szczyt — to jedyne sygnały, po których dziecko ma
 *    poznać, że tego drzewa nie trzeba żałować. Nie odbieraj im kontrastu.
 *
 * 2. JASNE CIĘCIE JEST TREŚCIĄ, NIE OZDOBĄ. Każda kłoda ma boki z kory
 *    i oba końce w barwie świeżego drewna (trzy grupy materiałów na walcu).
 *    To ten jasny krążek mówi „ktoś to porąbał", a nie „to tu leżało".
 *
 * 3. STOS I KAMYCZKI SĄ SKOŃCZONE, nie zbierane w nieskończoność. Mają
 *    starczyć na JEDNĄ rzecz, której brakuje światu — dlatego ich bryły są
 *    duże i policzalne wzrokiem (pięć kłód, sześć kamieni), a nie sypkie.
 *    Zamiana ich w licznik surowca byłaby gospodarką, przed którą ostrzega
 *    `docs/OPIS_PROJEKTU.md`.
 *
 * Konwencja jak w `swiat.js`: grupy budowane przez `mesh()`, wspólne materiały
 * z płaskim cieniowaniem, wszystkie wymiary skalowane parametrem `s`.
 * Ustawianie na kuli robi `planeta.ustaw(obiekt, x, z, h, obrotY)` — tak samo
 * jak dla sosen i głazów.
 */
import {
  Group, Mesh, MeshLambertMaterial, CylinderGeometry, ConeGeometry,
  DodecahedronGeometry, IcosahedronGeometry, BoxGeometry,
} from "three";

const matKanciasty = (kolor) => new MeshLambertMaterial({ color: kolor, flatShading: true });

function mesh(geo, mat, pos = [0, 0, 0], rot = [0, 0, 0], skala = 1) {
  const m = new Mesh(geo, mat);
  m.position.set(...pos);
  m.rotation.set(...rot);
  m.scale.setScalar(skala);
  return m;
}

export const MAT_DREWNO = {
  // Suchy pień jest SZARSZY i bledszy od żywego (`0x765331`) — to jedyny
  // sygnał, po którym dziecko ma poznać, że tego drzewa nie trzeba żałować.
  suchy: matKanciasty(0x8a7557),
  suchyCiemny: matKanciasty(0x6b5941),
  // Świeże cięcie: jasny krążek na końcu każdej kłody. To on mówi, że drewno
  // JEST ŚCIĘTE, a nie leży tu od zawsze.
  ciecie: matKanciasty(0xd8b578),
  kora: matKanciasty(0x7a6144),
  skala: matKanciasty(0x918b78),
  skalaJasna: matKanciasty(0xaaa38d),
  skalaCiemna: matKanciasty(0x716c60),
  mech: matKanciasty(0x668b45),
};

/** Kłoda: bok z kory, oba końce jasne od świeżego cięcia (3 grupy geometrii). */
function kloda(dl, r, seg = 8) {
  const geo = new CylinderGeometry(r, r * 0.94, dl, seg);
  return new Mesh(geo, [MAT_DREWNO.kora, MAT_DREWNO.ciecie, MAT_DREWNO.ciecie]);
}

/** Konar wyrasta Z PNIA: walec ma podstawę w punkcie zaczepienia, a nie
    środek — inaczej gałęzie wyglądają jak patyki wbite obok drzewa. */
function konar(s, dl, r, wys, obrotY, odchyl) {
  const g = new Group();
  g.position.set(0, wys * s, 0);
  g.rotation.set(0, obrotY, odchyl);
  g.add(mesh(new CylinderGeometry(.03 * s, .062 * s, dl * s, 5),
    MAT_DREWNO.suchyCiemny, [0, dl * s * .5, 0]));
  return g;
}

/**
 * SUCHE DRZEWKO — to, które dziecko może ściąć. Bez igieł i liści, z czterema
 * złamanymi konarami i rozłupanym szczytem. Sylwetka ma być czytelna z góry
 * mapy: jasna, naga kreska wśród ciemnych, gęstych sosen.
 */
export function sucheDrzewko(s = 1) {
  const e = new Group();
  e.name = "suche-drzewko";
  e.rotation.z = 0.045;

  e.add(mesh(new CylinderGeometry(.14 * s, .26 * s, 1.72 * s, 7),
    MAT_DREWNO.suchy, [0, .84 * s, 0], [0, .2, 0]));
  // Nabiegi korzeniowe: drzewo wyrasta z ziemi, a nie stoi na niej wbite.
  e.add(mesh(new CylinderGeometry(.24 * s, .34 * s, .2 * s, 7),
    MAT_DREWNO.suchyCiemny, [0, .1 * s, 0], [0, .5, 0]));

  // Rozłupany szczyt: dwie nierówne drzazgi zamiast jednego stożka —
  // stożek czyta się jak czubek drzewa, a to ma być ŚLAD PO ZŁAMANIU.
  e.add(mesh(new ConeGeometry(.1 * s, .42 * s, 4), MAT_DREWNO.suchy,
    [-.04 * s, 1.84 * s, .02 * s], [.08, .5, .1]));
  e.add(mesh(new ConeGeometry(.07 * s, .26 * s, 4), MAT_DREWNO.suchyCiemny,
    [.07 * s, 1.78 * s, -.03 * s], [-.06, 1.1, -.22]));

  [[.52, 1.24, .4, -1.05], [.44, 1.46, 2.2, .95], [.34, .96, 3.6, -1.15], [.3, 1.62, 5.1, .8]]
    .forEach(([dl, wys, oy, od]) => e.add(konar(s, dl, .05, wys, oy, od)));
  return e;
}

/** Pieniek, który zostaje w ziemi po ścięciu — ślad, że coś tu stało. */
export function pieniek(s = 1) {
  const e = new Group();
  e.name = "pieniek";
  const p = new Mesh(new CylinderGeometry(.24 * s, .3 * s, .34 * s, 7),
    [MAT_DREWNO.kora, MAT_DREWNO.ciecie, MAT_DREWNO.ciecie]);
  p.position.y = .17 * s;
  e.add(p);
  return e;
}

/**
 * STOS DREWNA — to, w co zamienia się drzewko. Dwa rzędy kłód plus dwie
 * rozłupane szczapy oparte z boku. Wszystkie cięcia patrzą w JEDNĄ stronę
 * (wzdłuż osi X), żeby z każdego kąta było widać jasne krążki i od razu
 * czytało się „ktoś to porąbał".
 */
export function stosDrewna(s = 1, { szczapy = true } = {}) {
  const e = new Group();
  e.name = "stos-drewna";
  // Obrót całości: cięcia nie patrzą prosto w oś świata, więc jasne krążki
  // widać z większości kątów, a stos nie wygląda jak ustawiony pod linijkę.
  e.rotation.y = .38;
  const dl = 1.05 * s, r = .145 * s;

  [[-.3, 0], [0, .015], [.3, -.01]].forEach(([z, dy], i) => {
    const k = kloda(dl, r * (i === 1 ? 1.08 : 1));
    k.rotation.set(0, 0, Math.PI / 2);
    k.position.set(0, r + dy * s, z * s);
    e.add(k);
  });
  [[-.155, .05], [.155, -.03]].forEach(([z, przes]) => {
    const k = kloda(dl * .93, r * .96);
    k.rotation.set(0, 0, Math.PI / 2);
    k.position.set(przes * s, r * 2.75, z * s);
    e.add(k);
  });
  // Jedna kłoda na szczycie zamyka piramidę — bez niej stos jest płaską ławą.
  const gora = kloda(dl * .86, r * .9);
  gora.rotation.set(0, .16, Math.PI / 2);
  gora.position.set(-.04 * s, r * 4.4, 0);
  e.add(gora);

  /* Szczapy: rozłupane połówki oparte o stos od czoła. Ciemna kora z jednej
     strony, jasne cięcie z drugiej — dlatego BoxGeometry, a nie walec.

     OPCJONALNE (decyzja właściciela 2026-09-17). Stos LEŻĄCY w lesie i na
     placu ma je mieć — bez nich jest gładką kostką. Ale ten sam stos NA
     PLECACH liska pokazywał je z boku jako sterczącą deskę i z góry, w biegu,
     czytało się to jak usterka, a nie jak drewno. Ładunek prosi więc
     o wersję bez szczap. */
  if (szczapy) [[-.62, .34, .42], [.66, -.3, -.5]].forEach(([x, z, rz]) => {
    const sz = mesh(new BoxGeometry(.13 * s, .62 * s, .17 * s), MAT_DREWNO.ciecie,
      [x * s, .3 * s, z * s], [.12, .6, rz]);
    e.add(sz);
    e.add(mesh(new BoxGeometry(.04 * s, .62 * s, .17 * s), MAT_DREWNO.kora,
      [(x + (x < 0 ? -.07 : .07)) * s, .3 * s, z * s], [.12, .6, rz]));
  });
  return e;
}

/**
 * KAMYCZKI — to, w co rozpada się głaz. Pięć brył w jednym skupisku,
 * z jedną wyraźnie większą: bez niej kupka wygląda jak żwir, a ma wyglądać
 * jak coś, co da się podnieść i z czego da się coś zbudować.
 */
export function kamyczki(s = 1) {
  const e = new Group();
  e.name = "kamyczki";
  const bryly = [
    [0, .21, 0, .36, MAT_DREWNO.skala, [1.1, .86, .95], [.4, .9, .2]],
    [-.34, .14, .14, .26, MAT_DREWNO.skalaJasna, [1.18, .74, .92], [.8, .3, .5]],
    [.32, .13, -.1, .24, MAT_DREWNO.skalaCiemna, [.95, .78, 1.12], [.2, 1.2, .7]],
    [.1, .1, .33, .19, MAT_DREWNO.skalaJasna, [1.05, .7, .9], [.6, .5, .9]],
    [-.14, .09, -.3, .17, MAT_DREWNO.skala, [1.15, .74, .92], [.9, .7, .3]],
    [.26, .07, .3, .13, MAT_DREWNO.skalaCiemna, [1.1, .7, .95], [.3, .2, .6]],
  ];
  for (const [x, y, z, r, mat, sk, rot] of bryly) {
    const p = mesh(new DodecahedronGeometry(r * s, 0), mat, [x * s, y * s, z * s], rot);
    p.scale.set(sk[0] * s, sk[1] * s, sk[2] * s);
    e.add(p);
  }
  // Odrobina mchu na największym kamieniu — ten sam akcent co przy głazach.
  const m = mesh(new IcosahedronGeometry(.13 * s, 0), MAT_DREWNO.mech, [.02 * s, .37 * s, .02 * s]);
  m.scale.set(1.3 * s, .32 * s, 1.1 * s);
  e.add(m);
  return e;
}

/** Wiórek / odłamek — leci spod narzędzia w trakcie pracy. */
export function wiorek(s = 1, kamien = false) {
  return mesh(
    kamien ? new DodecahedronGeometry(.075 * s, 0) : new BoxGeometry(.13 * s, .055 * s, .07 * s),
    kamien ? MAT_DREWNO.skalaJasna : MAT_DREWNO.ciecie);
}
