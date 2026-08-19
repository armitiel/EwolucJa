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

/** Domyślne proporcje. Zmieniaj tutaj, nie w komponencie. */
export const OGON_DLUGOSC = 34;
const OGON_SZEROKOSC = 38;

/**
 * @param {object} o
 * @param {number} o.szer      szerokość bańki (px)
 * @param {number} o.wys       wysokość bańki bez dzióbka (px)
 * @param {number} o.ogonX     gdzie ma celować czubek — px od lewej krawędzi bańki
 * @param {boolean} o.wDol     true = dzióbek pod bańką (cel niżej), false = nad
 * @returns {string} atrybut `d` dla <path>
 */
export function sciezkaChmurki({ szer, wys, ogonX, wDol = true }) {
  const w = Math.max(80, szer);
  const h = Math.max(48, wys);
  const dl = OGON_DLUGOSC;
  const os = OGON_SZEROKOSC;

  // Cztery różne promienie — bańka ma być rysowana ręką, nie linijką.
  const rLG = 30, rPG = 26, rPD = 30, rLD = 24;

  // Czubek trzyma się celu, ale nasada nie może wyjść poza prostą część
  // krawędzi — inaczej dzióbek wyrastałby z zaokrąglonego rogu i kształt
  // rozpadłby się na dwa.
  const x = Math.max(rLD + os * 0.6, Math.min(ogonX, w - rPD - os * 0.6));
  const prawa = x + os / 2;
  const lewa = x - os / 2;
  // Czubek podwinięty w lewo — dzięki temu dzióbek „płynie", zamiast sterczeć
  // jak kolec. To ta sama miękkość, co w klockach i zwojach interfejsu.
  const czubekX = x - os * 0.22;

  if (wDol) {
    const y = h;
    const czubekY = h + dl;
    return [
      `M ${rLG} 0`,
      `H ${w - rPG}`,
      `Q ${w} 0 ${w} ${rPG}`,
      `V ${h - rPD}`,
      `Q ${w} ${y} ${w - rPD} ${y}`,
      `H ${prawa}`,
      // Prawy bok dzióbka: wypływa z krawędzi bańki i schodzi do czubka.
      `C ${x + os * 0.3} ${y + dl * 0.34} ${x + os * 0.14} ${y + dl * 0.68} ${czubekX} ${czubekY}`,
      // Lewy bok wraca krócej i bardziej stromo — stąd wrażenie ruchu.
      `C ${x - os * 0.3} ${y + dl * 0.52} ${x - os * 0.42} ${y + dl * 0.2} ${lewa} ${y}`,
      `H ${rLD}`,
      `Q 0 ${y} 0 ${h - rLD}`,
      `V ${rLG}`,
      `Q 0 0 ${rLG} 0`,
      "Z",
    ].join(" ");
  }

  // Dzióbek nad bańką — lustrzane odbicie, gdy cel jest wyżej niż chmurka.
  const y0 = dl;               // bańka zaczyna się poniżej czubka
  const h2 = h + dl;
  return [
    `M ${rLG} ${y0}`,
    `H ${lewa}`,
    `C ${x - os * 0.42} ${y0 - dl * 0.2} ${x - os * 0.3} ${y0 - dl * 0.52} ${czubekX} 0`,
    `C ${x + os * 0.14} ${y0 - dl * 0.68} ${x + os * 0.3} ${y0 - dl * 0.34} ${prawa} ${y0}`,
    `H ${w - rPG}`,
    `Q ${w} ${y0} ${w} ${y0 + rPG}`,
    `V ${h2 - rPD}`,
    `Q ${w} ${h2} ${w - rPD} ${h2}`,
    `H ${rLD}`,
    `Q 0 ${h2} 0 ${h2 - rLD}`,
    `V ${y0 + rLG}`,
    `Q 0 ${y0} ${rLG} ${y0}`,
    "Z",
  ].join(" ");
}
