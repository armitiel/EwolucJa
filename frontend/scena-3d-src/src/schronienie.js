/*!
 * EwolucJA — gra edukacyjna dla dzieci.
 * © 2026 Amitiel Angelisme. Wszelkie prawa zastrzeżone.
 * Powstało w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”.
 * Prawa autorskie należą do autora. Pełna nota: LICENSE.
 */
/**
 * schronienie.js — DOMEK NA DRZEWIE, który rośnie etapami z tego, co dziecko
 * zdobyło w świecie. Każdy etap to OSOBNA grupa; scena pokazuje wszystkie etapy
 * do numeru `n` włącznie, więc dołożenie kolejnego nie rusza poprzednich.
 *
 * DLACZEGO PLIK NADAL NAZYWA SIĘ `schronienie` (decyzja właściciela 2026-09-16).
 * Zmieniła się NARRACJA — z szałasu na polanie na domek na drzewie — a nie
 * miejsce w systemie. `schronienie` jest kluczem tego miejsca w `mapa.json`,
 * w zapisie zadania i w osi etapów; przemianowanie go dotknęłoby pięciu plików
 * i zapisów, które dzieci mają już na dyskach. Nazwa jest więc adresem, nie
 * opisem — a opisem jest ten komentarz.
 *
 * TRZY ETAPY (referencja od właściciela):
 *   1. platforma z barierką i drabinką  — „gotowe na zabawę"
 *   2. przytulny domek                  — dochodzi w innym DNIU przygody
 *   3. rozbudowany domek                — jw.
 * Dziś zbudowany jest etap 1; kolejne czekają na własną turę, a bramkę dnia
 * trzyma `zadanieDrewna.js`.
 *
 * WYSOKOŚCI SĄ SPRZĘŻONE Z DRZEWEM. Pień stawia `drzewoDomkowe` w `swiat.js`,
 * z tej samej skali co ten plik. Kotwica drzewa siedzi 0,12 pod darnią, a
 * kotwica domku 0,02 — stąd stała `ROZNICA_KOTWIC`: bez niej platforma wisiała
 * dziesięć centymetrów obok pnia.
 */
import {
  Group, Mesh, MeshLambertMaterial, BoxGeometry, BufferGeometry, CylinderGeometry,
  CircleGeometry, Float32BufferAttribute,
} from "three";
/* WYMIARY DRZEWA SĄ JEDNE. Poziom konaru i jego zasięg trzyma `swiat.js`,
   bo to on stawia pień — tutaj tylko je czytamy. Dwie listy liczb, które
   trzeba pamiętać razem, rozjeżdżają się przy pierwszej zmianie. */
import { DOMEK_DRZEWO, ZANURZENIE_DOMKU } from "./swiat.js";

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
  // Deski są JAŚNIEJSZE od kory — świeżo ociosane drewno kontra pień, na
  // którym leżą. Bez tego kontrastu platforma zlewa się z drzewem.
  deska: matKanciasty(0xc79a5f),
  deskaCiemna: matKanciasty(0xa87f4c),
  sznur: matKanciasty(0xd9c9a4),
};

/**
 * O ile kotwica domku stoi WYŻEJ od kotwicy drzewa, w jednostkach korony.
 *
 * LICZONE, NIE WPISANE. Kotwica drzewa jest zanurzona o `zanurzeniePnia`
 * skalowane razem z drzewem; kotwica domku o stałe 0,02 świata. To dwie różne
 * jednostki, więc trzeba je sprowadzić do jednej — a wpisanie tu gotowej
 * liczby znaczyłoby, że pierwsze pogłębienie korzeni odkleja pomost od gałęzi
 * i nikt nie wie dlaczego.
 */
function roznicaKotwic(u, s) {
  return (u.zanurzeniePnia ?? DOMEK_DRZEWO.zanurzeniePnia) - ZANURZENIE_DOMKU / s;
}

/**
 * PŁYTA POMOSTU — bryła z `public/platforma.obj` (ZBrush), wklejona
 * wierzchołkami, nie wczytywana z pliku.
 *
 * DLACZEGO WKLEJONA. To osiem wierzchołków i sześć ścian. Trzymanie tego jako
 * osobnego assetu znaczyłoby: konwersja do `.glb`, kolejny plik do pobrania,
 * kolejne asynchroniczne wczytanie i kolejne miejsce, w którym coś nie doleci —
 * wszystko po to, żeby narysować płytę. Ten sam wybór, co przy źdźble trawy
 * w `swiat.js` (`gTrawa`), z tego samego powodu.
 *
 * CO TO JEST. Kwadratowa płyta o boku 1,86 i grubości 0,187 — czyli gruba
 * na dziesiątą część boku. Ta PROPORCJA jest tym, co model wnosi: pomost ma
 * być solidną kłodą do siedzenia, a nie dyktą. Poprzednia wersja składała go
 * z sześciu cienkich desek i czytał się jak półka.
 *
 * SKOS ZBRUSHA ZDEJMUJEMY. Kwadrat jest w pliku obrócony w swojej płaszczyźnie
 * o jakieś 23° — pamiątka po ustawieniu narzędzia, nie zamysł. Obrócony kwadrat
 * wpisany w prostokątny pomost daje romb: narożniki barierki wiszą wtedy poza
 * deskami. Kąt liczymy z samych wierzchołków, więc gdyby model wrócił z ZBrusha
 * obrócony inaczej, kod dalej go wyprostuje.
 *
 * NORMALIZUJEMY RAZ, przy wczytaniu modułu: środek na (0,0,0), płaszczyzna
 * pozioma (grubość w osi Y), bok równy 1, wierzch na y=0. Dzięki temu `etap1`
 * skaluje ją jak każdą inną bryłę i nie musi pamiętać, w jakim układzie
 * pracował ZBrush.
 */
function geometriaPlyty() {
  // Wierzchołki dokładnie jak w pliku (v), w kolejności 1..8.
  const V = [
    [-0.41427052, -0.30291837, -0.24878431], [-1.13633203, 1.41746652, -0.24878434],
    [ 0.58405584,  2.13952922, -0.24878434], [ 1.30611825, 0.41914355, -0.24878431],
    [ 1.30611681,  0.41914397, -0.43536165], [-0.41427075, -0.30291754, -0.43536165],
    [-1.13633108,  1.41746676, -0.43536162], [ 0.58405667, 2.13952827, -0.43536162],
  ];
  // Ściany (f) jako czworokąty, indeksy 1-based jak w OBJ.
  const F = [[4,3,2,1], [4,1,6,5], [6,1,2,7], [8,5,6,7], [3,4,5,8], [3,8,7,2]];

  const poz = [];
  for (const [a, b, c, d] of F) {
    for (const [i, j, k] of [[a, b, c], [a, c, d]]) {
      poz.push(...V[i - 1], ...V[j - 1], ...V[k - 1]);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(poz, 3));

  /* Z UKŁADU ZBRUSHA DO UKŁADU GRY. Model leży w płaszczyźnie XY z grubością
     w Z („stoi"), a pomost ma LEŻEĆ — stąd ćwierć obrotu wokół X. Po nim
     model ma współrzędne (x, z, -y). */
  g.rotateX(-Math.PI / 2);

  /* WYPROSTOWANIE (patrz nagłówek): bierzemy jeden bok górnej ściany —
     wierzchołek 1 → 4 — i obracamy płytę tak, żeby położył się wzdłuż osi X. */
  g.rotateY(Math.atan2(-(V[3][1] - V[0][1]), V[3][0] - V[0][0]));

  g.computeBoundingBox();
  const bb = g.boundingBox;
  g.translate(-(bb.min.x + bb.max.x) / 2, -bb.max.y, -(bb.min.z + bb.max.z) / 2);
  const bok = Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z);
  g.scale(1 / bok, 1 / bok, 1 / bok);
  g.computeVertexNormals();
  return g;
}

/** Jedna geometria na wszystkie pomosty — płyta jest zawsze ta sama. */
const GEO_PLYTA = geometriaPlyty();

/** Deska: prostopadłościan o proporcjach tarcicy, nie belki. */
function deska(dl, szer, gr, mat = MAT_BUDOWY.deska) {
  return new Mesh(new BoxGeometry(dl, gr, szer), mat);
}

/**
 * ETAP 1 — PLATFORMA. Pomost wysunięty z pnia w +X, barierka po trzech
 * stronach i drabinka z ziemi. Czyli dokładnie tyle, ile trzeba, żeby dziecko
 * powiedziało „tu już można siedzieć" — i ani deski więcej. Domek dochodzi
 * w etapie 2, w innym dniu przygody.
 *
 * Ma wyglądać na ZBUDOWANE, a nie na zrujnowane: deski leżą równo, barierka
 * stoi prosto, drabinka opiera się o krawędź, a nie o powietrze.
 */
function etap1(s = 1, u = DOMEK_DRZEWO) {
  const g = new Group();
  g.name = "domek-na-drzewie-etap-1";

  /* Płaska tarcza jest tu TYLKO AWARYJNA. Scena podmienia jej geometrię na
     taflę idącą za kulą i terenem (`taflaNaGruncie` w `swiat.js`) — bez tego
     środek klepiska siada dokładnie na darni i przebijają przez nie trójkąty
     terenu (ta zielona dziura). Podmiana idzie po nazwie, więc ten plik nie
     musi nic wiedzieć o planecie. */
  const R_KLEPISKA = (u.klepiskoR ?? 1.06) * s;
  const klepisko = mesh(new CircleGeometry(R_KLEPISKA, 14), MAT_BUDOWY.klepisko,
    [0, .012 * s, 0], [-Math.PI / 2, 0, .3]);
  klepisko.name = "schronienie-klepisko";
  klepisko.userData.krok = 0;
  klepisko.userData.promien = R_KLEPISKA;
  /* `przyZiemi` MÓWI SCENIE, ŻEBY TEGO NIE KOŁYSAŁA. Drzewo gibie się, kiedy
     lisek w nie wpadnie, i pomost z barierką jedzie razem z nim — bo na nim
     leży. Ale klepisko jest kawałkiem DARNI, a darń nie chodzi za drzewem:
     obrócona o te kilka stopni jednym brzegiem wjeżdżałaby pod ziemię,
     drugim wystawała ponad trawę. Scena przepina takie elementy do kotwicy. */
  klepisko.userData.przyZiemi = true;
  g.add(klepisko);

  /* WYSOKOŚCI Z JEDNEGO ŹRÓDŁA. `poziom` to wysokość konaru w układzie
     DRZEWA; kotwica domku stoi 0,10 wyżej, więc tyle odejmujemy. Pomost kończy
     się tuż przed końcem konaru — deski wystające poza podporę czytają się
     jak trampolina. */
  const Y = (u.poziom - roznicaKotwic(u, s)) * s;
  const X0 = u.pomostOd * s;                  // gdzie konar wychodzi z pnia
  const X1 = (u.zasiegKonaru - .12) * s;      // koniec desek
  const XS = (X0 + X1) / 2;
  const DL = Math.max(.2 * s, X1 - X0);
  const POL_Z = u.pomostPol * s;

  /* ZASTRZAŁÓW NIE MA i to jest decyzja, nie przeoczenie. Stały tu, dopóki pod
     pomostem była kodowa belka w pustce — wtedy trzeba było tłumaczyć, czemu
     deski nie spadają. Odkąd pomost leży na prawdziwym konarze modelu, podpora
     jest widoczna sama z siebie, a dwa patyki pod spodem tylko krzyżowały się
     z gałęziami drzewa. Referencja właściciela też ich nie ma: goła platforma
     w widłach i drabinka.

     Numer `krok` 1 został przez to pusty — animacja stawiania sortuje po tym
     polu, więc dziura w numeracji jest nieszkodliwa i zostawiam ją na wypadek,
     gdyby etap 2 chciał tam wstawić swoje podparcie. */
  /* POMOST to PŁYTA Z MODELU (`platforma.obj`), a nie sześć desek ułożonych
     kodem. Deski były cienkie i dzieliły pomost równiutkimi szparami co do
     milimetra — czytało się to jak półka. Płyta jest GRUBA (model: dziesiąta
     część boku) i dlatego wygląda na coś, na czym można usiąść.

     SKALUJEMY W TRZECH OSIACH, ale grubość zostaje proporcjonalna: geometria
     ma bok 1, więc mnożnik Y równy średniemu bokowi pomostu zachowuje tę samą
     „kłodowatość" przy każdej wielkości domku. */
  const BOK_POMOSTU = (DL + POL_Z * 2) / 2;
  const plyta = new Mesh(GEO_PLYTA, MAT_BUDOWY.deska);
  plyta.position.set(XS, Y, 0);
  plyta.scale.set(DL, BOK_POMOSTU, POL_Z * 2);
  plyta.userData.krok = 2;
  g.add(plyta);

  for (let i = 0; i < 3; i++) {
    const listwa = deska(DL * .94, .07 * s, .035 * s, MAT_BUDOWY.deskaCiemna);
    listwa.position.set(XS, Y + .018 * s, (i - 1) * POL_Z * .62);
    listwa.userData.krok = 2;
    g.add(listwa);
  }

  /* BARIERKA MA WEJŚCIE OD DRABINKI (właściciel, 2026-09-16).
     Wcześniej barierka była zamknięta dokładnie tam, gdzie drabinka dochodzi
     do desek — dziecko wspinało się prosto w poprzeczkę. Teraz bok w +X jest
     OTWARTY: zostają narożne słupki, które robią z tej dziury framugę, a nie
     wyrwę, i nic między nimi nie przechodzi. Zamknięty jest za to bok od pnia
     — po tamtej stronie i tak stoi drzewo, więc poprzeczka domyka pomost
     w skrzynkę, zamiast zostawiać dwie otwarte ściany.

     Słupki są KRÓTKIE — przy dłuższych platforma zamienia się w klatkę
     i przestaje wyglądać na miejsce do siedzenia. */
  const WYS_B = u.barierka * s;
  for (const [x, z] of [
    [X1 - .10 * s, -POL_Z + .10 * s], [X1 - .10 * s, POL_Z - .10 * s],
    [XS, -POL_Z + .10 * s], [XS, POL_Z - .10 * s],
    [X0 + .18 * s, -POL_Z + .10 * s], [X0 + .18 * s, POL_Z - .10 * s],
  ]) {
    const sl = new Mesh(new CylinderGeometry(.045 * s, .055 * s, WYS_B, 5), MAT_BUDOWY.kora);
    sl.position.set(x, Y + WYS_B / 2, z);
    sl.userData.krok = 3;
    g.add(sl);
  }
  for (const h of [.62, 1]) {
    for (const k of [-1, 1]) {
      const p = deska(DL - .20 * s, .06 * s, .06 * s, MAT_BUDOWY.deska);
      p.position.set(XS, Y + WYS_B * h, k * (POL_Z - .10 * s));
      p.userData.krok = 3;
      g.add(p);
    }
    /* Poprzeczka TYLKO od pnia. Bok w +X zostaje pusty — tam jest wejście. */
    const tyl = deska(.06 * s, POL_Z * 2 - .20 * s, .06 * s, MAT_BUDOWY.deska);
    tyl.position.set(X0 + .18 * s, Y + WYS_B * h, 0);
    tyl.userData.krok = 3;
    g.add(tyl);
  }

  /* DRABINKA LICZONA Z DWÓCH KOŃCÓW, nie z kąta.
     Wcześniej miała stały odchył i stałą długość, więc przy każdej zmianie
     wysokości pomostu albo nie dosięgała desek, albo je przebijała. Teraz
     podaje się, GDZIE ma stać na ziemi i DOKĄD ma sięgać, a kąt i długość
     wychodzą z rachunku — czyli górny szczebel zawsze kończy się przy
     krawędzi pomostu, cokolwiek stanie się z resztą wymiarów.

     STOPA NIE JEST NA Y=0. Zero to płaszczyzna STYCZNA do planety, a ziemia
     spod niej ucieka: przy tym odsunięciu od pnia grunt jest już ponad pół
     jednostki niżej, więc drabinka wisiała w powietrzu i czytało się to jak
     błąd skali. `drabinkaSpadek` (ujemny) dostajemy od sceny — tylko ona zna
     planetę i teren; patrz `punktNaGruncie` w `swiat.js`. */
  const GORA_X = X1 - .06 * s;          // przy samej krawędzi desek
  const GORA_Y = Y + .10 * s;           // ociupinę nad poziomem pokładu
  const DOL_X = X1 + u.drabinkaOdsun * s;   // stopa odsunięta od pnia
  const DOL_Y = u.drabinkaSpadek ?? 0;      // ile ziemia ucieka w tym miejscu
  const KAT = Math.atan2(DOL_X - GORA_X, GORA_Y - DOL_Y);
  const DL_BAZA = Math.hypot(DOL_X - GORA_X, GORA_Y - DOL_Y);   // ziemia → krawędź desek

  /* DŁUGOŚĆ JEST KROTNOŚCIĄ, NIE LICZBĄ METRÓW. Gdyby podawało się ją wprost,
     każda zmiana wysokości pomostu psułaby drabinkę — a tak 1,0 zawsze znaczy
     „od ziemi równo do desek", a 1,2 „i jeszcze kawałek ponad", niezależnie od
     tego, jak wysoko siedzi pokład. Stopa zostaje w miejscu; rośnie góra. */
  const DL_D = DL_BAZA * (u.drabinkaDlugosc ?? 1);
  const KX = (GORA_X - DOL_X) / DL_BAZA, KY = (GORA_Y - DOL_Y) / DL_BAZA;  // w górę
  const KON_X = DOL_X + KX * DL_D, KON_Y = DOL_Y + KY * DL_D;   // szczyt bocznic
  const SR_X = (DOL_X + KON_X) / 2, SR_Y = (DOL_Y + KON_Y) / 2;

  for (const k of [-1, 1]) {
    const b = new Mesh(new CylinderGeometry(.05 * s, .06 * s, DL_D, 5), MAT_BUDOWY.kora);
    b.position.set(SR_X, SR_Y, k * .26 * s);
    b.rotation.set(0, 0, KAT);
    b.userData.krok = 4;
    b.userData.przyZiemi = true;   // stopa stoi na darni — nie jedzie z drzewem
    g.add(b);
  }
  /* SZCZEBLI TYLE, ILE SIĘ MIEŚCI przy stałym odstępie — nie stała siódemka.
     Drabinka bywa raz krótsza, raz dłuższa (wysokość pomostu, spadek gruntu,
     suwak długości), a siedem szczebli rozciągniętych na dwa razy dłuższych
     bocznicach przestaje wyglądać na coś, po czym da się wejść. */
  const ODSTEP_SZCZEBLI = .38 * s;
  const SZCZEBLE = Math.max(3, Math.min(16, Math.round(DL_D / ODSTEP_SZCZEBLI)));
  for (let i = 0; i < SZCZEBLE; i++) {
    const t = (i + .5) / SZCZEBLE;      // 0 = dół, 1 = góra
    // Szczeble GRUBE (0,055): przy 0,035 ginęły za bocznicami i drabinka
    // czytała się jak dwie kreski bez stopni.
    const sz = new Mesh(new CylinderGeometry(.055 * s, .055 * s, .60 * s, 6), MAT_BUDOWY.sznur);
    sz.position.set(DOL_X + KX * DL_D * t, DOL_Y + KY * DL_D * t, 0);
    sz.rotation.set(Math.PI / 2, 0, 0);
    sz.userData.krok = 4;
    sz.userData.przyZiemi = true;   // szczeble trzymają się bocznic, a te stoją
    g.add(sz);
  }

  return g;
}

const ETAPY = [etap1];

/**
 * Buduje schronienie do etapu `n` włącznie (n = 1 to sam szkielet).
 * Elementy niosą w `userData.krok` numer kroku w animacji stawiania —
 * scena układa je po kolei, zamiast pokazywać całość naraz.
 */
export function schronienie(n = 1, s = 1, uklad = DOMEK_DRZEWO) {
  const g = new Group();
  g.name = "schronienie";
  for (let i = 0; i < Math.min(n, ETAPY.length); i++) g.add(ETAPY[i](s, uklad));
  return g;
}

export const LICZBA_ETAPOW = ETAPY.length;

/**
 * Ile pięter ma domek DOCELOWO, wliczając te, których jeszcze nie ma w kodzie.
 * `LICZBA_ETAPOW` mówi, co scena umie postawić DZIŚ; ta stała mówi, dokąd
 * prowadzi opowieść — i to na niej opiera się bramka rozbudowy
 * (`czyMoznaRozbudowac` w `hub/zadanieDrewna.js`). Rozjazd między nimi jest
 * normalny i celowy: etapy 2 i 3 mają swoją turę jeszcze przed sobą.
 */
export const ETAPY_DOCELOWO = 3;

/** Ile czego kosztuje dany etap — jedno miejsce, z którego czyta i świat, i tekst Wizkora. */
export const KOSZT_ETAPU = [
  { klody: 3, kamyki: 6, opis: "platforma na drzewie: deski, barierka i drabinka" },
];
