/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * ksztaltChmurki — jedna ścieżka SVG: bańka RAZEM z dzióbkiem.
 *
 * DLACZEGO NIE OBRAZEK. Chmurka rośnie z tekstem (dwie linijki albo cztery),
 * dosuwa się do krawędzi telefonu, a dzióbek musi zostać na ikonie, w którą
 * celuje — czyli wędruje wzdłuż dolnej krawędzi. Gotowy PNG trzeba by ciąć na
 * dziewięć kawałków i tak nie dałby ruchomego dzióbka. Ścieżka liczona
 * z rozmiaru robi jedno i drugie, jest ostra na każdym ekranie i bierze kolory
 * z UI zamiast mieć je wypalone.
 *
 * DLACZEGO NIE TRÓJKĄT DOKLEJONY POD KARTĄ (tak było wcześniej). Trójkąt ma
 * proste boki i własny obrys, więc w miejscu styku widać szew — dwa kształty
 * udające jeden. Tutaj dzióbek jest wycięciem TEJ SAMEJ ścieżki: jego boki
 * wypływają z krawędzi bańki łukiem, a obrys obiega całość jednym ciągiem.
 *
 * Kształt jest lekko NIESYMETRYCZNY (cztery różne promienie, dzióbek
 * podwinięty w bok). Idealnie równa bańka czyta się jak element systemu
 * operacyjnego; ta ma wyglądać jak rzecz z tego samego świata co gliniane
 * przedmioty i zwoje.
 */

/* PROPORCJE DZIÓBKA — JEDNO MIEJSCE DLA CAŁEJ GRY. Zmiana tych dwóch liczb
   schodzi na wszystkie dymki naraz, bo wszystkie rysuje ta sama ścieżka.

   19.09.2026 zeszliśmy z 34×38 na 22×26 (właściciel). Przy dużym dymku
   „Porada dnia" stary dzióbek jeszcze uchodził, ale te same 34 px przy
   pigułce pod awatarem gracza — 80 px szerokości — zajmowały jej pół spodu
   i czytały się jak osobny klin doklejony do bańki. */
export const OGON_DLUGOSC = 22;
const OGON_SZEROKOSC = 26;

/* Cztery różne promienie narożników — bańka ma być rysowana ręką, nie
   linijką. Stoją tutaj, a nie w środku funkcji, bo liczy się z nich
   najmniejsza sensowna szerokość bańki. */
const rLG = 30, rPG = 26, rPD = 30, rLD = 24;

/**
 * ABSOLUTNE MINIMUM BAŃKI — tyle, ile zajmuje sama nasada dzióbka.
 *
 * Nie ma tu nic o narożnikach: te KURCZĄ SIĘ do rozmiaru bańki (patrz
 * `skalaR` w `sciezkaChmurki`), więc kształt da się narysować w każdym
 * rozsądnym pudełku. Zostaje jeden twardy warunek — krawędź musi pomieścić
 * nasadę wraz z marginesem, czyli `1,2 · szerokość dzióbka`.
 *
 * Czyta to ścieżka i `Dymek` (jako `--dymek-min-wbudowane`), żeby pudełko
 * z treścią nigdy nie było WĘŻSZE od rysowanej bańki. Wcześniej stało tu 80,
 * wpisane w arkusz na sztywno przy dzióbku 38 px szerokim — czyli poniżej
 * progu, który sam wynikał z narożników. Wtedy klamra wypluwała punkt ZA
 * narożnikiem i w krawędzi robił się zadziorek.
 */
export const MIN_SZEROKOSC = Math.ceil(1.2 * OGON_SZEROKOSC);
export const MIN_WYSOKOSC = MIN_SZEROKOSC;

/**
 * GLINA DLA CAŁEJ SYLWETKI — zakres i stopnie gradientu wypełniającego.
 *
 * PO CO OSOBNA FUNKCJA. Bańka i dzióbek to jedna ścieżka, więc i jedno
 * wypełnienie — ale gradient jest pionowy, a dzióbek wisi POD bańką. Jeżeli
 * zakres gradientu obejmie samą bańkę (tak było do 19.09.2026), to wszystko
 * poniżej jej dolnej krawędzi dostaje PRZEDŁUŻONY OSTATNI STOPIEŃ, czyli
 * `--chmurka-tlo-4` — barwę cienia dolnej krawędzi. Cały dzióbek robi się
 * wtedy o dwa tony ciemniejszy od lica bańki, a na jego nasadzie kładzie się
 * w poprzek ciemny pasek 95,5–100%. Razem czyta się to jak doklejony trójkąt
 * — dokładnie to, czego ta ścieżka miała uniknąć.
 *
 * Dlatego przy dzióbku W DÓŁ zakres obejmuje CAŁĄ sylwetkę: cień dolnej
 * krawędzi ląduje na czubku dzióbka, bo to on jest teraz dołem kształtu.
 * Pierwszy stopień przeliczamy z powrotem na wysokość samej bańki, żeby pasek
 * światła na górnej krawędzi został dokładnie tam, gdzie był.
 *
 * Przy dzióbku W GÓRĘ nie ma czego naprawiać: zakres to sama bańka, a dzióbek
 * leży NAD nim i dostaje przedłużony stopień PIERWSZY, czyli barwę górnej
 * krawędzi. To jest właściwa barwa dla czegoś, co wystaje u góry.
 *
 * @returns {{y1:number, y2:number, stopnie:Array<[number, number]>}}
 *          `y1`/`y2` w jednostkach SVG (dlatego `gradientUnits="userSpaceOnUse"`),
 *          `stopnie` jako pary [offset, numer tokenu `--chmurka-tlo-N`].
 */
export function glinaChmurki({ wys, wDol = true, kierunek }) {
  const kier = kierunek || (wDol ? "dol" : "gora");
  const h = Math.max(MIN_WYSOKOSC, wys);
  const dl = OGON_DLUGOSC;
  const proste = [[0, 0], [0.1, 1], [0.9, 2], [0.955, 3], [1, 4]];

  /* Bez ogona nie ma czego korygować — zakres to sama bańka. */
  if (kier === "brak") return { y1: 0, y2: h, stopnie: proste };

  /* Dzióbek W BOK nie potrzebuje żadnej korekty: leży OBOK bańki, na tej samej
     wysokości, więc pionowy gradient przechodzi przez niego dokładnie tak, jak
     przez lico tuż obok. Zakres to po prostu sama bańka. */
  if (kier === "lewo" || kier === "prawo") return { y1: 0, y2: h, stopnie: proste };

  /* Dzióbek W GÓRĘ: zakres to sama bańka, a dzióbek leży NAD nim i dostaje
     przedłużony stopień PIERWSZY, czyli barwę górnej krawędzi. Właściwa barwa
     dla czegoś, co wystaje u góry. */
  if (kier === "gora") return { y1: dl, y2: dl + h, stopnie: proste };

  const calosc = h + dl;
  return {
    y1: 0,
    y2: calosc,
    stopnie: [[0, 0], [(0.1 * h) / calosc, 1], [0.9, 2], [0.955, 3], [1, 4]],
  };
}

/**
 * Rozmiar pola SVG dla danej bańki — bańka PLUS dzióbek po właściwej stronie,
 * oraz przesunięcie, o jakie trzeba cofnąć płótno, żeby lewy górny róg SAMEJ
 * bańki wypadł w punkcie (0, 0) układu rodzica.
 *
 * Dzięki temu komponent ustawia `<svg>` jednym `left`/`top` i nie musi wiedzieć,
 * w którą stronę wyrasta dzióbek.
 */
export function poleChmurki({ szer, wys, kierunek = "dol" }) {
  const w = Math.max(MIN_SZEROKOSC, szer);
  const h = Math.max(MIN_WYSOKOSC, wys);
  const dl = OGON_DLUGOSC;
  if (kierunek === "brak") return { szer: w, wys: h, przesX: 0, przesY: 0 };
  const pion = kierunek === "dol" || kierunek === "gora";
  return {
    szer: pion ? w : w + dl,
    wys: pion ? h + dl : h,
    // O ile płótno wystaje PRZED bańką (dzióbek rysuje się wtedy w ujemnym
    // obszarze względem niej, więc `<svg>` trzeba przesunąć o tyle w tył).
    przesX: kierunek === "lewo" ? -dl : 0,
    przesY: kierunek === "gora" ? -dl : 0,
  };
}

/**
 * @param {object} o
 * @param {number} o.szer      szerokość bańki (px)
 * @param {number} o.wys       wysokość bańki bez dzióbka (px)
 * @param {number} o.ogonX     gdzie ma celować czubek — px WZDŁUŻ krawędzi,
 *                             na której siedzi dzióbek: od lewej przy „dol"
 *                             i „gora", od góry przy „lewo" i „prawo"
 * @param {("dol"|"gora"|"lewo"|"prawo")} [o.kierunek]  w którą stronę wyrasta dzióbek
 * @param {boolean} [o.wDol]   starsze wywołania bez `kierunek`: true = w dół
 * @returns {string} atrybut `d` dla <path>
 */
export function sciezkaChmurki({ szer, wys, ogonX, wDol = true, kierunek }) {
  const kier = kierunek || (wDol ? "dol" : "gora");

  /* DZIÓBEK W BOK RYSUJEMY PRZEZ ZAMIANĘ OSI, nie przez drugą kopię wzoru.
     Bańka z dzióbkiem po lewej to dokładnie ta sama figura, co bańka
     z dzióbkiem u góry, odbita względem przekątnej: punkt (x, y) staje się
     (y, x). Tak samo „w prawo" jest transpozycją „w dół". Druga, ręcznie
     napisana wersja tych samych łuków rozjechałaby się z pierwszą przy
     pierwszej poprawce kształtu — a poprawek było już kilka.

     Kosztem jest to, że wszystkie punkty muszą przechodzić przez `P()`,
     więc znikają skróty `H`/`V` (poziomo/pionowo) — po zamianie osi
     oznaczałyby co innego. `L` robi to samo, tylko jawnie. */
  const transpon = kier === "lewo" || kier === "prawo";
  const wDolRob = kier === "dol" || kier === "prawo";

  const w0 = Math.max(MIN_SZEROKOSC, szer);
  const h0 = Math.max(MIN_WYSOKOSC, wys);

  // Wymiary w układzie ROBOCZYM (tym, w którym dzióbek jest zawsze pionowy).
  const w = transpon ? h0 : w0;
  const h = transpon ? w0 : h0;

  const dl = OGON_DLUGOSC;
  const os = kier === "brak" ? 0 : OGON_SZEROKOSC;
  const P = (x, y) => (transpon ? `${y} ${x}` : `${x} ${y}`);

  /* PROMIENIE NAROŻNIKÓW SKALUJĄ SIĘ DO ROZMIARU BAŃKI — i to nie jest
     ostrożność na zapas, tylko warunek narysowania kształtu.

     Narożniki 30 i 26 zjadają 56 px krawędzi. Dymek Mentora ma 63 px
     wysokości, a jego dzióbek wychodzi BOKIEM, czyli siedzi właśnie na tej
     63-pikselowej krawędzi: po odjęciu narożników zostaje 7 px na nasadę
     szeroką na 26. Zakres dla środka nasady robił się wtedy pusty, klamra
     niżej wypluwała punkt ZA narożnikiem i ścieżka zawracała sama na siebie —
     w krawędzi pojawiał się zadziorek, a przy większym dzióbku cały klin
     wychodził w przypadkowym miejscu.

     Zamiast tego kurczymy narożniki dokładnie o tyle, żeby nasada się
     zmieściła. Przy dużych dymkach mnożnik wynosi 1 i nic się nie zmienia;
     przy małych bańka robi się mniej „poduszkowa", co i tak jest właściwe —
     30-pikselowy łuk na 60-pikselowej krawędzi wyglądał jak pigułka. */
  const sumaKrawedzi = Math.max(rLG + rPG, rLD + rPD);
  const sumaBoku = Math.max(rLG + rLD, rPG + rPD);
  const skalaR = Math.max(0.2, Math.min(
    1,
    (w - 1.2 * os) / sumaKrawedzi,
    h / sumaBoku
  ));
  const aLG = rLG * skalaR, aPG = rPG * skalaR;
  const aPD = rPD * skalaR, aLD = rLD * skalaR;

  /* BEZ OGONA — ta sama bryła, tylko bez wypustki. Potrzebna wszędzie tam,
     gdzie postać stoi obok dymka i nie ma w co celować (np. `MentorBubble`
     z `tail={false}`). */
  if (kier === "brak") {
    return [
      `M ${aLG} 0`,
      `L ${w0 - aPG} 0`,
      `Q ${w0} 0 ${w0} ${aPG}`,
      `L ${w0} ${h0 - aPD}`,
      `Q ${w0} ${h0} ${w0 - aPD} ${h0}`,
      `L ${aLD} ${h0}`,
      `Q 0 ${h0} 0 ${h0 - aLD}`,
      `L 0 ${aLG}`,
      `Q 0 0 ${aLG} 0`,
      "Z",
    ].join(" ");
  }

  /* Czubek trzyma się celu, ale nasada nie może wyjść poza PROSTĄ część
     krawędzi — inaczej dzióbek wyrastałby z zaokrąglonego rogu i kształt
     rozpadłby się na dwa.

     PROMIENIE BIERZEMY Z TEJ KRAWĘDZI, NA KTÓREJ SIEDZI DZIÓBEK. Do
     19.09.2026 obie klamry liczyły się z narożników DOLNYCH (24 i 30) także
     wtedy, gdy dzióbek szedł w górę — a górne mają 30 i 26. Przy dużych
     dymkach nie było tego widać, bo nasada i tak wypadała daleko od rogu, ale
     przy pigułce pod awatarem gracza lewa nasada lądowała 3 px WEWNĄTRZ łuku
     górnego lewego narożnika i ścieżka zawracała: `L` szło w tył, robiąc
     zadziorek w krawędzi. */
  const rA = wDolRob ? aLD : aLG;
  const rB = wDolRob ? aPD : aPG;
  const x = Math.max(rA + os * 0.6, Math.min(ogonX, w - rB - os * 0.6));
  const prawa = x + os / 2;
  const lewa = x - os / 2;
  // Czubek podwinięty w bok — dzięki temu dzióbek „płynie", zamiast sterczeć
  // jak kolec. To ta sama miękkość, co w klockach i zwojach interfejsu.
  const czubekX = x - os * 0.22;

  if (wDolRob) {
    const y = h;
    const czubekY = h + dl;
    return [
      `M ${P(aLG, 0)}`,
      `L ${P(w - aPG, 0)}`,
      `Q ${P(w, 0)} ${P(w, aPG)}`,
      `L ${P(w, h - aPD)}`,
      `Q ${P(w, y)} ${P(w - aPD, y)}`,
      `L ${P(prawa, y)}`,
      // Prawy bok dzióbka: wypływa z krawędzi bańki i schodzi do czubka.
      `C ${P(x + os * 0.3, y + dl * 0.34)} ${P(x + os * 0.14, y + dl * 0.68)} ${P(czubekX, czubekY)}`,
      // Lewy bok wraca krócej i bardziej stromo — stąd wrażenie ruchu.
      `C ${P(x - os * 0.3, y + dl * 0.52)} ${P(x - os * 0.42, y + dl * 0.2)} ${P(lewa, y)}`,
      `L ${P(aLD, y)}`,
      `Q ${P(0, y)} ${P(0, h - aLD)}`,
      `L ${P(0, aLG)}`,
      `Q ${P(0, 0)} ${P(aLG, 0)}`,
      "Z",
    ].join(" ");
  }

  // Dzióbek nad bańką — lustrzane odbicie, gdy cel jest wyżej niż chmurka.
  const y0 = dl;               // bańka zaczyna się poniżej czubka
  const h2 = h + dl;
  return [
    `M ${P(aLG, y0)}`,
    `L ${P(lewa, y0)}`,
    `C ${P(x - os * 0.42, y0 - dl * 0.2)} ${P(x - os * 0.3, y0 - dl * 0.52)} ${P(czubekX, 0)}`,
    `C ${P(x + os * 0.14, y0 - dl * 0.68)} ${P(x + os * 0.3, y0 - dl * 0.34)} ${P(prawa, y0)}`,
    `L ${P(w - aPG, y0)}`,
    `Q ${P(w, y0)} ${P(w, y0 + aPG)}`,
    `L ${P(w, h2 - aPD)}`,
    `Q ${P(w, h2)} ${P(w - aPD, h2)}`,
    `L ${P(aLD, h2)}`,
    `Q ${P(0, h2)} ${P(0, h2 - aLD)}`,
    `L ${P(0, y0 + aLG)}`,
    `Q ${P(0, y0)} ${P(aLG, y0)}`,
    "Z",
  ].join(" ");
}
