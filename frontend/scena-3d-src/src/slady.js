/**
 * slady.js — ŚLADY PO TYM, CO WYDARZYŁO SIĘ POZA EKRANEM.
 *
 * Dziecko robi zadanie w prawdziwym świecie, zostawia ślad w aplikacji —
 * i planeta ma to zauważyć. Do 17.09.2026 nie zauważała: wszystkie 22 zadania
 * w `zadania-wizkora.v2.json` mają pole `reakcja_swiata` z nazwą metody, ale
 * ŻADNEJ z tych metod nie było w scenie. `odpalReakcjeSwiata` wypisywało
 * `console.info` i na tym się kończyło, a Wizkor mówił dziecku „przy drzewie
 * wyrósł nowy kwiat — idź, zobacz". Dziecko szło i nie było kwiatu.
 *
 * Ten plik jest drugą połową tamtej obietnicy.
 *
 * ZASADY, KTÓRE TU OBOWIĄZUJĄ
 *
 * 1. **Nagrodą jest zmiana w świecie, nie przedmiot w plecaku.** Wszystko, co
 *    tu powstaje, stoi na planecie i widać to z drogi, którą dziecko i tak
 *    chodzi. Nic nie ląduje w ekwipunku i nic nie miga licznikiem.
 * 2. **Ślad jest trwały.** Scena buduje się od nowa przy każdym wejściu, więc
 *    stan trzyma React (`hub/sladySwiata.js`) i odtwarza go po `gotowa`,
 *    wołając te same metody z `bezAnimacji`. Dlatego każda metoda musi być
 *    DETERMINISTYCZNA: ten sam ślad w tej samej kolejności ma dać ten sam
 *    układ obiektów. Losowanie po `Math.random` złamałoby to od razu.
 * 3. **Kotwice, nie współrzędne.** Zadanie mówi „przy drabince", nie
 *    „[0.9, 2.1]". Dzięki temu przesunięcie domku w mapie nie zostawia
 *    kwiatów w szczerym polu.
 * 4. **Metoda, która nie ma czego postawić, zwraca `false`** i mówi o tym
 *    w konsoli. Nigdy nie udaje, że coś zrobiła — bo po niej idzie tekst,
 *    który dziecku to obiecuje.
 */

import {
  Color, Group, Mesh, MeshLambertMaterial, MeshBasicMaterial, BoxGeometry, CylinderGeometry, TorusGeometry,
  SphereGeometry, CircleGeometry, PlaneGeometry, DodecahedronGeometry, IcosahedronGeometry,
  Sprite, SpriteMaterial, CanvasTexture, SRGBColorSpace, AdditiveBlending, DoubleSide,
} from "three";
import { Vector3 } from "three";
import { kamyczki, MAT_DREWNO } from "./natura.js";
import { grzyby, latarnia, KOLORY } from "./swiat.js";
import { MAT_BUDOWY } from "./schronienie.js";
import { Swiatlo } from "./swiatlo.js";
import { stycznaDo } from "./planeta.js";

/* SYMBOLE DO RAMKI (hybryda KR, zestaw REAL-01: liść, gwiazda, słońce, fala,
   łapka, spirala) — jedna kreska na papierze, w tym samym duchu co rysunek
   dnia z `hub/ramkaDomku.js` (`namalujRysunek`), tylko bez zależności od huba.
   Punkty w kwadracie 0–1; osobne linie oddziela `null`. */
const SYMBOLE = {
  lisc: [[.5, .12], [.72, .3], [.8, .55], [.68, .8], [.5, .9], [.32, .8], [.2, .55], [.28, .3], [.5, .12], null, [.5, .2], [.5, .9]],
  gwiazda: [[.5, .1], [.62, .4], [.92, .4], [.68, .58], [.78, .9], [.5, .7], [.22, .9], [.32, .58], [.08, .4], [.38, .4], [.5, .1]],
  slonce: [[.5, .3], [.66, .36], [.72, .5], [.66, .64], [.5, .7], [.34, .64], [.28, .5], [.34, .36], [.5, .3], null,
    [.5, .08], [.5, .18], null, [.5, .82], [.5, .92], null, [.08, .5], [.18, .5], null, [.82, .5], [.92, .5], null,
    [.2, .2], [.27, .27], null, [.8, .2], [.73, .27], null, [.2, .8], [.27, .73], null, [.8, .8], [.73, .73]],
  fala: [[.06, .42], [.18, .3], [.3, .42], [.42, .54], [.54, .42], [.66, .3], [.78, .42], [.9, .54], null,
    [.06, .66], [.18, .54], [.3, .66], [.42, .78], [.54, .66], [.66, .54], [.78, .66], [.9, .78]],
  lapka: [[.5, .52], [.66, .58], [.7, .76], [.5, .86], [.3, .76], [.34, .58], [.5, .52], null,
    [.24, .34], [.3, .26], [.36, .34], [.3, .42], [.24, .34], null, [.43, .22], [.5, .14], [.57, .22], [.5, .3], [.43, .22], null,
    [.64, .34], [.7, .26], [.76, .34], [.7, .42], [.64, .34]],
  spirala: (() => { const p = []; for (let i = 0; i <= 40; i += 1) { const a = i / 40 * Math.PI * 4.5, r = .04 + .4 * i / 40; p.push([.5 + Math.cos(a) * r, .5 + Math.sin(a) * r]); } return p; })(),
};
const TLA_RAMKI = { drzewo: ["#dff0c4", "#c9e0a6"], woda: ["#d8ecf6", "#bcd9ea"], niebo: ["#fbe9b5", "#f2d68b"], papier: ["#FBF1D6", "#F4E3B8"] };

/** Płótno ramki: papier w kolorze tła z części A i symbol jedną kreską. */
function narysujSymbol(symbol = "gwiazda", tlo = "papier", S = 256, kreska = "#4e4d76") {
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  const [t0, t1] = TLA_RAMKI[tlo] || TLA_RAMKI.papier;
  const gr = g.createRadialGradient(S / 2, S / 2, S * .2, S / 2, S / 2, S * .75);
  gr.addColorStop(0, t0); gr.addColorStop(1, t1);
  g.fillStyle = gr; g.fillRect(0, 0, S, S);
  if (!symbol) return c;                       // pusta ramka (część A)
  const P = SYMBOLE[symbol] || SYMBOLE.gwiazda;
  g.strokeStyle = kreska; g.lineWidth = S * .032; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath();
  let nowa = true;
  for (const p of P) {
    if (!p) { nowa = true; continue; }
    if (nowa) { g.moveTo(p[0] * S, p[1] * S); nowa = false; } else g.lineTo(p[0] * S, p[1] * S);
  }
  g.stroke();
  return c;
}

/* Kąt złoty. Kolejne ślady tej samej kotwicy siadają po spirali, a nie
   w rządku: rządek czyta się jak grządka posadzona przez dorosłego, a to ma
   wyglądać, jakby wyrosło samo. Przy `PROMIEN_BAZA/KROK` sąsiednie punkty
   dzieli ok. 0,8 jednostki — powyżej progu 0,32, poniżej którego
   `kwiaty.posadz` odrzuca punkt jako zbyt bliski istniejącemu kwiatu. */
const KAT_ZLOTY = 2.39996;
const PROMIEN_BAZA = 0.45;
const PROMIEN_KROK = 0.30;

/** Punkt numer `i` wokół kotwicy — ta sama liczba zawsze daje to samo miejsce. */
function wokol(kotwica, i) {
  const r = PROMIEN_BAZA + PROMIEN_KROK * Math.sqrt(i + 1);
  const a = (i + 1) * KAT_ZLOTY;
  return [kotwica[0] + r * Math.cos(a), kotwica[1] + r * Math.sin(a)];
}

/* KOLORY KWIATÓW — indeksy do `PALETA_K` w `zbudujKwiaty` (`swiat.js`):
   0 kremowy, 1 żółty, 2 różowy, 3 błękitny, 4 fioletowy. Kolejność, w jakiej
   „nowy wariant" szuka barwy jeszcze nieużytej przy tej kotwicy: najpierw
   te, których zasiew liska i zwykłe ślady dają najmniej w oczy. */
const LICZBA_KOLOROW = 5;
const KOLEJNOSC_NOWYCH = [2, 3, 4, 1, 0];
/* Barwa „o krok cieplejszego" wypełnienia dla śladu `niebo-cichnie` (04 §6.1). */
const _CIEPLO = new Color(0xffd9a8);

/* MATERIAŁY ZNAKU — z tego, co planeta już ma: kora i jasne cięcie z kłód
   (`natura.js`), złoto z ognia latarni (`KOLORY.flame`). Jeden zestaw na
   moduł; znaków jest kilka, nie kilkaset. */
const MAT_ZNAK = {
  kolek: MAT_DREWNO.kora,
  tabliczka: MAT_DREWNO.ciecie,
  zloto: new MeshLambertMaterial({ color: KOLORY.flame, flatShading: true }),
  raczka: MAT_DREWNO.suchyCiemny,
};

/**
 * PROSTY ZNAK PROCEDURALNY: kołek wbity w ziemię i tabliczka z symbolem.
 * `Znak` z `znak.js` potrzebuje wczytanego modelu GLB, a w `assets/` nie ma
 * żadnej lupy — ten znak powstaje z brył, więc nie zależy od zasobów.
 * Symbol siedzi PO OBU stronach tabliczki: planeta obraca się pod bohaterem,
 * więc dziecko obchodzi znak dookoła i nie ma „tyłu".
 *
 * Rodzaje: `lupa` (okrąg ze złota + rączka) — inne dostają samą tabliczkę,
 * żeby nowa nazwa w danych nie stawiała pustego miejsca.
 */
function znakProceduralny(rodzaj = "lupa", s = 1) {
  const g = new Group();
  g.name = "znak-" + rodzaj;
  const H = .66 * s;                                   // wysokość kołka nad ziemią
  const kolek = new Mesh(new CylinderGeometry(.03 * s, .036 * s, H, 6), MAT_ZNAK.kolek);
  kolek.position.y = H / 2;
  g.add(kolek);
  const SZ = .42 * s, WY = .32 * s, GR = .045 * s;
  const tabliczka = new Mesh(new BoxGeometry(SZ, WY, GR), MAT_ZNAK.tabliczka);
  tabliczka.position.y = H - WY * .45;
  g.add(tabliczka);
  if (rodzaj === "lupa") {
    for (const strona of [1, -1]) {
      const z = strona * (GR / 2 + .012 * s);
      const r = .085 * s;
      const okrag = new Mesh(new TorusGeometry(r, .02 * s, 6, 18), MAT_ZNAK.zloto);
      okrag.position.set(-.04 * s, tabliczka.position.y + .03 * s, z);
      g.add(okrag);
      // Rączka: od dolnego-prawego brzegu okręgu w dół pod 45°.
      const dl = .15 * s;
      const raczka = new Mesh(new CylinderGeometry(.018 * s, .018 * s, dl, 6), MAT_ZNAK.raczka);
      const k = Math.SQRT1_2;
      raczka.position.set(
        okrag.position.x + (r + dl / 2) * k,
        okrag.position.y - (r + dl / 2) * k,
        z);
      raczka.rotation.z = Math.PI / 4;
      g.add(raczka);
    }
  }
  return g;
}

/**
 * KAMIEŃ-KROK (hybryda `kamienie-kroki`, 05 karta 1). Jedna płaska bryła,
 * nie kupka `kamyczki`: po kamieniu-kroku się STAJE, więc ma mieć wierzch.
 * Dwie barwy na przemian po numerze, żeby droga nie była szeregiem kopii.
 */
function kamienKrok(s = 1, i = 0) {
  const g = new Group();
  g.name = "kamien-krok";
  const mat = [MAT_DREWNO.skala, MAT_DREWNO.skalaJasna, MAT_DREWNO.skalaCiemna][i % 3];
  const k = new Mesh(new DodecahedronGeometry(.34 * s, 0), mat);
  k.scale.set(1.25, .38, 1.05);
  k.position.y = .09 * s;
  k.rotation.y = i * .9;
  g.add(k);
  if (i % 2 === 0) {
    const m = new Mesh(new IcosahedronGeometry(.11 * s, 0), MAT_DREWNO.mech);
    m.scale.set(1.2, .3, 1);
    m.position.set(.14 * s, .2 * s, -.1 * s);
    g.add(m);
  }
  return g;
}

/** Ile kamieni-kroków ma pełna droga (pięć po śladzie, szósty po zauważeniu). */
const KAMIENI_MAX = 6;
/** Zasięg, w którym lisek „dotyka" pierwszego kamienia (część A) i próg ponownego uzbrojenia. */
const KAMIEN_DOTYK = 1.05;
const KAMIEN_UZBROJENIE = 2.2;

/** Przecięcie odcinka A→B z wielokątem (lista [x, z]); zwraca punkt najbliższy A albo null. */
function przeciecieZObrysem(A, B, punkty) {
  let naj = null, najT = Infinity;
  const n = punkty.length;
  for (let i = 0; i < n; i += 1) {
    const P = punkty[i], Q = punkty[(i + 1) % n];
    const r = [B[0] - A[0], B[1] - A[1]], sPQ = [Q[0] - P[0], Q[1] - P[1]];
    const den = r[0] * sPQ[1] - r[1] * sPQ[0];
    if (Math.abs(den) < 1e-9) continue;
    const AP = [P[0] - A[0], P[1] - A[1]];
    const t = (AP[0] * sPQ[1] - AP[1] * sPQ[0]) / den;
    const u = (AP[0] * r[1] - AP[1] * r[0]) / den;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1 && t < najT) { najT = t; naj = [A[0] + r[0] * t, A[1] + r[1] * t]; }
  }
  return naj;
}

/**
 * ARGUMENTY PRZYCHODZĄ Z DANYCH, OPCJE Z KODU. `reakcja_swiata.args` w JSON-ie
 * jest tablicą różnej długości (`["przy-drabince"]`, `["przy-drabince", 2]`,
 * `["przy-drabince", 1, "nowy-wariant"]`), a odtwarzanie śladów dokłada na
 * koniec `{ bezAnimacji: true }`. Przy stałej liście parametrów ten obiekt
 * wpadał raz na trzecią, raz na drugą pozycję i lądował w miejscu `wariant`.
 * Dlatego opcje rozpoznajemy po TYPIE, a nie po miejscu.
 */
function rozdziel(a) {
  const ost = a[a.length - 1];
  const toOpcje = !!ost && typeof ost === "object" && !Array.isArray(ost);
  return [toOpcje ? a.slice(0, -1) : a.slice(), toOpcje ? ost : {}];
}

export class Slady {
  constructor(app) {
    this.app = app;
    /* Licznik na kotwicę, nie na metodę: drugi kwiat „przy drabince" ma
       wypaść obok pierwszego, a nie w tym samym punkcie — obojętne, z którego
       zadania przyszedł. */
    this.uzyte = new Map();
    /* Kolory kwiatów użyte przy kotwicy — dla „nowego wariantu" po
       zauważeniu przez Mentora: ma być barwa, której tu jeszcze nie było. */
    this.kolory = new Map();
    this.grupa = new Group();
    this.grupa.name = "slady-przygod";
    app.swiat.add(this.grupa);
    /* HYBRYDA LD: kamienie-kroki od drabinki do oczka zachodniego. Lista
       postawionych brył (indeks = numer kamienia), trasa liczona raz,
       znacznik braku (W6) i uzbrojenie „dotknięcia" pierwszego kamienia. */
    this._kamienie = [];
    this._trasa = null;
    this._znacznik = null;
    /* OBIEKTY DOTYKOWE hybryd: `{ nazwa, n, r, uzbrojony }` — lisek podchodzi,
       scena melduje `hybryda:obiekt-dotkniety { obiekt }` raz na podejście.
       Rejestrują je metody części A (pierwszy kamień, kładka, dno oczka). */
    this._dotykowe = [];
    /* MD: lampka na pomoście (jedna; `ustawLampke` przestawia), świetliki nocą.
       DT: stan oczka wschodniego. ST: kwiat przy kładce (raz). */
    this._lampka = null;
    this._swietliki = [];
    this._oczko = { blysk: null, lilie: [], kwiat: null };
    this._kwiatPrzyKladce = false;
    /* EM: ławka na ganku (+ rzecz, + królik); KR: ramka na ścianie domku (+ mała). */
    this._lawka = null;
    this._ramka = null;
    /* ŚLAD PORADY DNIA (`ustawSladPorady`) — jeden na dobę, schodzi z nocą. */
    this._porada = null;
    this._v = new Vector3();
    this._w = new Vector3();
  }

  /** Rejestruje obiekt, przy którym lisek ma „dotknąć" hybrydy (raz na podejście). */
  _dotykowy(nazwa, x, z, r = KAMIEN_DOTYK) {
    const n = this.app.planeta.normalna(x, z);
    const stary = this._dotykowe.find((d) => d.nazwa === nazwa);
    if (stary) { stary.n = n; stary.r = r; return; }
    this._dotykowe.push({ nazwa, n, r, uzbrojony: true });
  }

  /* ── KOTWICE ────────────────────────────────────────────────────────────
     Nazwa z danych → punkt na mapie. Kotwica, której nie da się policzyć,
     zwraca `null` i metoda grzecznie odpada — lepszy brak kwiatu niż kwiat
     w środku oczka. */
  kotwica(nazwa) {
    const m = this.app.mapa || {};
    const znak = (id) => (m.znaki || []).find((z) => z.id === id)?.pos || null;
    const domek = m.schronienie?.pos || null;

    switch (nazwa) {
      case "pod-drzewem":
        return domek;

      /* Stopa drabinki, nie środek pnia: dziecko staje właśnie tam, a kwiat
         w miejscu, w którym stoi pień, wchodziłby w jego kolizję. Kierunek
         bierzemy z obrotu domku, żeby po przestawieniu schronienia w mapie
         kwiaty poszły razem z drabinką. */
      case "przy-drabince": {
        if (!domek) return null;
        const a = (m.schronienie?.obrot ?? 0);
        const d = 1.15 * (m.schronienie?.skala ?? 1);
        return [domek[0] + d * Math.cos(a), domek[1] - d * Math.sin(a)];
      }

      /* STOPA DRABINKI — dokładnie tam, gdzie lisek staje przed wejściem do
         domku (kotwica `kotwica-drabinka-stopa` w bryle, przeliczona z układu
         planety na mapę). Bez domku: to samo miejsce z obrotu schronienia. */
      case "stopa-drabinki": {
        const D = this.app._drabinkaDane?.();
        if (D?.dol) { const p = this.app.planeta.zKuli(D.dol); return [p.x, p.z]; }
        return this.kotwica("przy-drabince");
      }
      /* Pomost = kotwica domku (obiekty na barierce liczą się od niej). */
      case "pomost": return domek;
      case "oczko-wschodnie": return this.app.oczka?.[0]?.pos ? [...this.app.oczka[0].pos] : null;
      case "oczko-zachodnie": return this.app.oczka?.[1]?.pos ? [...this.app.oczka[1].pos] : null;
      /* Kładka nad oczkiem wschodnim (`mapa.most`, hybryda ST). */
      case "kladka": return Array.isArray(m.most?.pos) ? [...m.most.pos] : null;
      /* Brzeg oczka zachodniego od strony drabinki — koniec drogi z kamieni. */
      case "brzeg-oczka-zachodniego": {
        const t = this._trasaKamieni();
        return t ? t[KAMIENI_MAX - 1] : null;
      }

      case "obok-karty": return znak("karty");
      case "obok-czarodzieja": return znak("czarodziej");

      /* Pieniek po drzewie, które dziecko samo ścięło — najlepsza kotwica,
         jaką ma ta gra, bo wskazuje miejsce po JEGO pracy. Zanim cokolwiek
         zostało ścięte, pieńka nie ma i schodzimy na drabinkę (tak samo mówi
         opis w danych: „bez pieńka: przy drabince"). */
      case "na-pienku": {
        const p = this.app._ostatniPieniek;
        return Array.isArray(p) ? p : this.kotwica("przy-drabince");
      }

      /* Najbliższa domkowi iglaka — „choinka" w tekstach zadań. */
      case "przy-choince": {
        const drzewa = (m.drzewa || []).filter((d) => d.typ !== "lisciaste" && Array.isArray(d.pos));
        if (!drzewa.length || !domek) return null;
        let naj = drzewa[0], najD = Infinity;
        for (const d of drzewa) {
          const dd = (d.pos[0] - domek[0]) ** 2 + (d.pos[1] - domek[1]) ** 2;
          if (dd < najD) { najD = dd; naj = d; }
        }
        return [naj.pos[0], naj.pos[1]];
      }

      /* ŚCIEŻKI DZIŚ NIE MA — `mapa.sciezka` wyczyszczono 14.09 i został sam
         builder. „Przy ścieżce" znaczy więc: w połowie drogi, którą dziecko
         naprawdę pokonuje najczęściej, czyli między domkiem a polaną Wizkora. */
      case "przy-sciezce": {
        const w = znak("czarodziej");
        if (!domek || !w) return null;
        return [(domek[0] + w[0]) / 2, (domek[1] + w[1]) / 2];
      }

      default:
        return null;
    }
  }

  /** Kolejny wolny numer punktu przy tej kotwicy. */
  _numer(nazwa) {
    const n = this.uzyte.get(nazwa) || 0;
    this.uzyte.set(nazwa, n + 1);
    return n;
  }

  /* ── KWIAT ──────────────────────────────────────────────────────────────
     Piętnaście z dwudziestu dwóch zadań kończy się kwiatem. To nie jest
     lenistwo bazy: kwiat jest jedyną rzeczą, którą ta planeta umie wypuścić
     w DOWOLNYM miejscu, rośnie z animacją i nie wygląda jak nagroda.

     `kwiaty.posadz` sam odmawia, gdy punkt leży zbyt blisko istniejącej
     rośliny — dlatego próbujemy kolejnych punktów spirali, zamiast uznawać
     pierwszą odmowę za koniec.

     ZAWSZE KWIAT, ZAWSZE TEN SAM KOLOR. `posadz` bez opcji losuje rodzaj
     rośliny (w ~45 % trawa) i barwę z licznika WSPÓLNEGO z zasiewem liska —
     Wizkor obiecałby kwiat, a wyrosłaby kępka, w innym kolorze niż wczoraj.
     Dlatego rodzaj i barwa idą stąd, z numeru punktu przy kotwicy: to samo
     przy pierwszym wywołaniu i przy odtworzeniu po wejściu do świata.
     `wariant === "nowy-wariant"` (zauważenie przez Mentora) bierze barwę,
     której przy tej kotwicy jeszcze nie było. */
  posadzKwiat(...a) {
    const [dane, opcje] = rozdziel(a);
    const gdzie = dane[0] || "przy-drabince";
    const ile = dane[1] == null ? 1 : dane[1];
    const wariant = dane[2] || null;
    const k = this.kotwica(gdzie);
    const kwiaty = this.app.kwiaty;
    if (!k || !kwiaty?.posadz) {
      console.warn("[slady] nie ma gdzie posadzić kwiatu:", gdzie);
      return false;
    }
    const bez = !!opcje.bezAnimacji;
    const uzyteKolory = this.kolory.get(gdzie) || new Set();
    this.kolory.set(gdzie, uzyteKolory);
    let posadzone = 0;
    for (let n = 0; n < (Number(ile) || 1); n += 1) {
      const pierwszy = this.uzyte.get(gdzie) || 0;
      let kolor = pierwszy % LICZBA_KOLOROW;
      if (wariant === "nowy-wariant") {
        const wolny = KOLEJNOSC_NOWYCH.find((c) => !uzyteKolory.has(c));
        kolor = wolny != null ? wolny : (pierwszy + 2) % LICZBA_KOLOROW;
      }
      for (let proba = 0; proba < 14; proba += 1) {
        const [x, z] = wokol(k, this._numer(gdzie));
        if (kwiaty.posadz(x, z, { bezAnimacji: bez, typ: "kwiat", wariant: kolor })) {
          posadzone += 1;
          uzyteKolory.add(kolor);
          break;
        }
      }
    }
    if (posadzone) kwiaty.oznacz?.();
    return posadzone > 0;
  }

  /* ── KAMYCZKI ───────────────────────────────────────────────────────────
     `uklad` to albo liczba (tyle kamyczków po spirali kotwicy), albo „krag"
     — wtedy siadają w koło, bo zadanie `minuta-w-glowie` mówi o zegarze
     słonecznym i kółko jest w nim treścią, nie ozdobą. */
  ulozKamyczki(...a) {
    const [dane] = rozdziel(a);
    const gdzie = dane[0] || "przy-sciezce";
    const uklad = dane[1] == null ? 3 : dane[1];
    const k = this.kotwica(gdzie);
    if (!k) { console.warn("[slady] nie ma gdzie ułożyć kamyczków:", gdzie); return false; }
    const krag = uklad === "krag";
    const ile = krag ? 6 : (Number(uklad) || 3);
    for (let i = 0; i < ile; i += 1) {
      const [x, z] = krag
        ? [k[0] + 0.78 * Math.cos((i / ile) * Math.PI * 2), k[1] + 0.78 * Math.sin((i / ile) * Math.PI * 2)]
        : wokol(k, this._numer(gdzie));
      const b = kamyczki(0.5);
      this.grupa.add(this.app._osadz(b, x, z, 0.03, i * 0.7));
    }
    this.app._wlaczCienie?.(this.grupa);
    return true;
  }

  /** Nowy grzyb — ta sama bryła, co grzyby rozstawione w mapie. */
  dodajGrzyb(...a) {
    const [dane] = rozdziel(a);
    const gdzie = dane[0] || "przy-sciezce";
    const k = this.kotwica(gdzie);
    if (!k) { console.warn("[slady] nie ma gdzie postawić grzyba:", gdzie); return false; }
    const [x, z] = wokol(k, this._numer(gdzie));
    this.grupa.add(this.app._osadz(grzyby(0.85), x, z, 0.02, x + z));
    this.app._wlaczCienie?.(this.grupa);
    return true;
  }

  /* ── ODSŁONIĘCIE UKRYTEGO OBIEKTU ───────────────────────────────────────
     Most, brama i latarnia SĄ ZBUDOWANE przy starcie i tylko nie wchodzą do
     świata (`swiat.js`: `if (!mapa.most.ukryty) s.add(t)`), a `zbudujSwiat`
     zwraca je mimo to. Odsłonięcie jest więc jednym `add` — pod warunkiem,
     że dołożymy też kolizje, których tamten warunek nie dodał. Bez nich
     dziecko przeszłoby przez bramę na wylot. */
  pokazUkryty(...a) {
    const [dane] = rozdziel(a);
    const co = dane[0] || "brama";
    const app = this.app;
    const cel = { brama: app._bramaUkryta, latarnia: app._latarniaUkryta, most: app._mostUkryty }[co];
    if (!cel || !cel.obj) { console.warn("[slady] nie ma czego odsłonić:", co); return false; }
    if (cel.obj.parent) return true;          // już stoi — ślad odtwarzany drugi raz
    app.swiat.add(cel.obj);
    for (const b of cel.blockers || []) app.blockers.push(b);
    app._wlaczCienie?.(cel.obj);
    return true;
  }

  /* ── KAMIENIE-KROKI (hybryda LD) ────────────────────────────────────────
     Droga od stopy drabinki do brzegu oczka zachodniego. Sześć punktów liczy
     się RAZ z mapy (stopa drabinki → środek oczka, przecięte z obrysem
     stawu), bez losowania: ten sam świat daje tę samą drogę przy każdym
     wejściu. Pierwszy kamień leży pod drabinką (kładzie go lisek w części A),
     pięć po śladzie, szósty na samym brzegu po zauważeniu przez Mentora —
     wtedy droga dochodzi do wody. */
  _trasaKamieni() {
    if (this._trasa) return this._trasa;
    const S = this.kotwica("stopa-drabinki");
    const oczko = this.app.oczka?.[1];
    const obrys = this.app.mapa?.oczka?.[1]?.punkty;
    if (!S || !oczko?.pos) return null;
    const C = oczko.pos;
    const E0 = (Array.isArray(obrys) && obrys.length >= 3) ? przeciecieZObrysem(S, C, obrys) : null;
    const dx0 = C[0] - S[0], dz0 = C[1] - S[1];
    const dl0 = Math.hypot(dx0, dz0) || 1;
    const kier = [dx0 / dl0, dz0 / dl0];
    const bok = [-kier[1], kier[0]];
    // Brzeg: przecięcie z obrysem, a bez obrysu — promień stawu od środka. Ostatni kamień 0,45 przed wodą.
    const doBrzegu = E0 ? Math.hypot(E0[0] - S[0], E0[1] - S[1]) : Math.max(1, dl0 - (oczko.promien || 1.4));
    const a = .85;                       // pierwszy kamień pod drabinką
    const b = Math.max(a + 1.5, doBrzegu - .45);
    const t = [];
    for (let i = 0; i < KAMIENI_MAX; i += 1) {
      const u = i / (KAMIENI_MAX - 1);
      const d = a + (b - a) * u;
      // Lekki wąż wzdłuż drogi (pierwszy i ostatni na osi): tak biegł lisek.
      const w = (i === 0 || i === KAMIENI_MAX - 1) ? 0 : Math.sin(i * 1.9) * .42;
      t.push([S[0] + kier[0] * d + bok[0] * w, S[1] + kier[1] * d + bok[1] * w]);
    }
    this._trasa = t;
    return t;
  }

  /** Pozycja kamienia numer `i` (1…6) na mapie — do kadru kamery; `null`, gdy trasy nie ma. */
  pozycjaKamienia(i = 1) {
    const t = this._trasaKamieni();
    if (!t) return null;
    const k = Math.max(1, Math.min(KAMIENI_MAX, Number(i) || 1));
    return [...t[k - 1]];
  }

  /**
   * `ulozKamienie(n, "kwiat"?)` — n to DOCELOWA liczba kamieni (1–6), nie
   * przyrost: powtórzone wywołanie niczego nie dokłada, mniejsze n nic nie
   * zabiera (droga nie znika). Z flagą `"kwiat"` przy szóstym kamieniu rośnie
   * kwiat w nowym kolorze — dodatek po zauważeniu przez Mentora (05 karta 1).
   * Bez `bezAnimacji` kamienie wchodzą jeden po drugim, od drabinki.
   */
  ulozKamienie(...a) {
    const [dane, opcje] = rozdziel(a);
    const n = Math.max(0, Math.min(KAMIENI_MAX, Math.floor(Number(dane[0]) || 0)));
    const zKwiatem = dane.includes("kwiat");
    const t = this._trasaKamieni();
    if (!t) { console.warn("[slady] nie ma gdzie ułożyć kamieni-kroków (brak drabinki albo oczka)"); return false; }
    const bez = !!opcje.bezAnimacji;
    const start = this._kamienie.length;
    for (let i = start; i < n; i += 1) {
      const [x, z] = t[i];
      const bryla = kamienKrok(1, i);
      const kotwica = this.app._osadz(bryla, x, z, .05, i * .7);
      kotwica.userData.n = this.app.planeta.normalna(x, z);
      this.grupa.add(kotwica);
      this._kamienie.push(kotwica);
      if (i === 0) this._dotykowy("kamien", x, z);
      if (!bez) this._animujKamien(bryla, (i - start) * .22);
    }
    if (zKwiatem && n >= KAMIENI_MAX && !this._kwiatPrzyWodzie) {
      const [x, z] = t[KAMIENI_MAX - 1];
      // Kwiat obok ostatniego kamienia, od strony drabinki i w bok — poza wodą.
      const [px, pz] = t[KAMIENI_MAX - 2];
      const dx = x - px, dz = z - pz, dl = Math.hypot(dx, dz) || 1;
      const fx = x - (dx / dl) * .55 - (dz / dl) * .5, fz = z - (dz / dl) * .55 + (dx / dl) * .5;
      this._kwiatPrzyWodzie = !!this.app.kwiaty?.posadz?.(fx, fz, { bezAnimacji: bez, typ: "kwiat", wariant: 3 });
      if (this._kwiatPrzyWodzie) this.app.kwiaty.oznacz?.();
    }
    this.app._wlaczCienie?.(this.grupa);
    return true;
  }

  /* Kamień „wyrasta" z ziemi: skala od zera, z lekkim przestrzeleniem. Raz. */
  _animujKamien(bryla, opoznienie = 0) {
    const t0 = performance.now() + opoznienie * 1000;
    bryla.scale.setScalar(.001);
    const krok = () => {
      if (this.app.destroyed) return;
      const u = Math.min(1, Math.max(0, (performance.now() - t0) / 520));
      const s = u < 1 ? (1.08 - .08 * u) * (1 - Math.pow(1 - u, 3)) : 1;
      bryla.scale.setScalar(Math.max(.001, s));
      if (u < 1) requestAnimationFrame(krok);
    };
    requestAnimationFrame(krok);
  }

  /**
   * DOTKNIĘCIE PIERWSZEGO KAMIENIA (część A). Lisek podchodzi pod drabinkę,
   * staje przy kamieniu — scena melduje `hybryda:obiekt-dotkniety` raz na
   * podejście (uzbraja się, gdy odejdzie), a hub decyduje, czy to jest ta
   * chwila na chmurkę liska. Sam kamień nic nie robi: nie znika, nie świeci.
   */
  tik(e = 0) {
    const app = this.app;
    this._lampkaTik(e);
    this._swietlikiTik(e);
    this._poradaTik(e);
    if (!app.hn || !app.hero) return;
    if (app._kino || app.sequence || app._podglad) return;
    for (const o of this._dotykowe) {
      const d = app.planeta.odleglosc(app.hn, o.n);
      if (d > Math.max(KAMIEN_UZBROJENIE, o.r * 2.1)) { o.uzbrojony = true; continue; }
      if (d < o.r && o.uzbrojony) {
        o.uzbrojony = false;
        app.emit("hybryda:obiekt-dotkniety", { obiekt: o.nazwa, n: this._kamienie.length });
      }
    }
  }

  /* ── LAMPKA NA POMOŚCIE (hybryda MD, 05 karta 2) ────────────────────────
     `ustawLampke(miejsce, "zapalona"?)`: `latarnia()` w skali 0,45 na jednym
     z trzech miejsc z części A — `barierka` (kotwica ganku pomostu),
     `drabinka` (szczyt drabinki), `drzewo` (grunt przy stopie drabinki).
     Jedna lampka: kolejne wywołanie przestawia, nie dokłada. Bez „zapalona"
     stoi zgaszona (część A: wybór miejsca); zapalona świeci PO ZACHODZIE —
     światło punktowe idzie za `doba.stan.noc`, w dzień jest zerem, więc
     budżet świateł (3–4) nie rośnie. Bez domku: grunt pod drzewem. */
  ustawLampke(...a) {
    const [dane] = rozdziel(a);
    const miejsce = ["barierka", "drabinka", "drzewo"].includes(dane[0]) ? dane[0] : "barierka";
    const zapalona = dane.includes("zapalona");
    const app = this.app;
    if (this._lampka) {
      this._lampka.obj.parent?.remove(this._lampka.obj);
      this._lampka = null;
    }
    const lamp = latarnia();
    lamp.name = "lampka-hybrydy";
    lamp.scale.setScalar(.45);
    const ud = lamp.userData;
    ud.light.intensity = 0;
    ud.glassMat.emissiveIntensity = .15;
    const K = app._schronienie;
    let rodzic = null;
    if (miejsce === "barierka" && K) {
      rodzic = K.getObjectByName("kotwica-ganek");
      if (rodzic) lamp.position.set(.05, 0, -((Number(rodzic.userData?.szerokosc) || 1.2) / 2 - .16));
    } else if (miejsce === "drabinka" && K) {
      rodzic = K.getObjectByName("kotwica-drabinka-szczyt");
      if (rodzic) lamp.position.set(-.18, 0, .34);
    }
    if (rodzic) {
      rodzic.add(lamp);
    } else {
      // Pod drzewem: obok stopy drabinki, od strony polany.
      const S = this.kotwica("stopa-drabinki") || this.kotwica("pod-drzewem");
      if (!S) { console.warn("[slady] nie ma gdzie postawić lampki"); return false; }
      const [x, z] = wokol(S, 3);
      const kot = app._osadz(lamp, x, z, .02, 0);
      this.grupa.add(kot);
    }
    app._wlaczCienie?.(lamp);
    this._lampka = { obj: lamp, miejsce, zapalona, faza: 0 };
    return true;
  }

  _lampkaTik(e) {
    const L = this._lampka;
    if (!L) return;
    const noc = this.app.doba?.stan ? Math.max(this.app.doba.stan.noc || 0, (this.app.doba.stan.zorza || 0) * .5) : 1;
    L.faza += e;
    const mig = 1 + Math.sin(L.faza * 3.1) * .1;
    const moc = L.zapalona ? noc : 0;
    L.obj.userData.light.intensity = 5.5 * moc * mig;
    L.obj.userData.glassMat.emissiveIntensity = .15 + 1.3 * moc * mig;
  }

  /* ── ŚWIETLIKI (MD po zauważeniu) ───────────────────────────────────────
     Trzy nocne światełka wokół drzewa z domkiem: emisyjna kulka + poświata
     (sprite addytywny), BEZ światła punktowego (budżet). Widać je tylko, gdy
     `doba.stan.noc` przekroczy próg z bramy znaków (0,35); w dzień nie ma
     ich wcale. `dodajSwietlika(n)` — n docelowo (idempotentne). */
  dodajSwietlika(...a) {
    const [dane] = rozdziel(a);
    const gdzie = typeof dane[0] === "string" ? dane[0] : "pod-drzewem";
    const n = Math.max(1, Math.min(6, Math.floor(Number(dane.find((x) => typeof x === "number")) || 3)));
    const k = this.kotwica(gdzie);
    if (!k) { console.warn("[slady] nie ma gdzie puścić świetlików:", gdzie); return false; }
    if (!this._poswiataTex) {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g = c.getContext("2d");
      const gr = g.createRadialGradient(32, 32, 2, 32, 32, 30);
      gr.addColorStop(0, "rgba(255,240,170,.9)");
      gr.addColorStop(.4, "rgba(255,220,120,.35)");
      gr.addColorStop(1, "rgba(255,200,80,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      this._poswiataTex = new CanvasTexture(c);
      this._poswiataTex.colorSpace = SRGBColorSpace;
    }
    for (let i = this._swietliki.length; i < n; i += 1) {
      const kat = .9 + i * 2.05, r = 2.1 + (i % 2) * .5;
      const x = k[0] + Math.cos(kat) * r, z = k[1] + Math.sin(kat) * r;
      const g = new Group();
      g.name = "swietlik";
      g.add(new Mesh(new SphereGeometry(.07, 8, 6), new MeshBasicMaterial({ color: 0xfff3a0, toneMapped: false })));
      const spr = new Sprite(new SpriteMaterial({ map: this._poswiataTex, transparent: true, blending: AdditiveBlending, depthWrite: false, opacity: .85 }));
      spr.scale.setScalar(.7);
      g.add(spr);
      const h = (this.app.wysokoscGruntuSiatki ? this.app.wysokoscGruntuSiatki(x, z) : 0) + 1.5 + (i % 3) * .35;
      this.app.planeta.ustaw(g, x, z, h, 0);
      g.visible = false;
      this.grupa.add(g);
      this._swietliki.push({ obj: g, x, z, h, faza: i * 1.7 });
    }
    return true;
  }

  _swietlikiTik(e) {
    if (!this._swietliki.length) return;
    const noc = this.app.doba?.stan ? (this.app.doba.stan.noc || 0) : 1;
    const widac = noc > .35;
    for (const s of this._swietliki) {
      s.obj.visible = widac;
      if (!widac) continue;
      s.faza += e;
      const dx = Math.sin(s.faza * .8) * .35, dz = Math.cos(s.faza * .6) * .35;
      this.app.planeta.ustaw(s.obj, s.x + dx, s.z + dz, s.h + Math.sin(s.faza * 1.3) * .18, 0);
      s.obj.children[1].material.opacity = .55 + Math.sin(s.faza * 2.2) * .3;
    }
  }

  /* ── ŁAWKA DLA GOŚCIA (hybryda EM, 05 karta 5) ──────────────────────────
     `ustawLawke({ rzecz, kroliczek })`: ławka z brył (deska + dwie nogi,
     materiały domku) na ganku pomostu, po przeciwnej stronie niż lampka MD
     (kotwica `kotwica-ganek`, strona +z). `rzecz` z części A: poduszka /
     kubek / koc na jednym końcu; `kroliczek: true` po zauważeniu — model
     `kroliczek.glb` z `assets` (skala 0,5, bez animacji) siada z drugiej
     strony, obok rzeczy; drugie miejsce jest zajęte przez gościa. Idempotentne.
     Bez domku: ławka nie ma gdzie stanąć (pomostu nie ma) — `false`. */
  ustawLawke(...a) {
    const [dane] = rozdziel(a);
    const arg = dane[0] && typeof dane[0] === "object" ? dane[0] : { rzecz: dane[0] || null, kroliczek: dane.includes("kroliczek") };
    const rzecz = ["poduszka", "kubek", "koc"].includes(arg.rzecz) ? arg.rzecz : null;
    const app = this.app;
    const K = app._schronienie;
    const ganek = K?.getObjectByName("kotwica-ganek");
    if (!ganek) { console.warn("[slady] nie ma pomostu — ławka nie ma gdzie stanąć"); return false; }
    if (!this._lawka) {
      const szer = Number(ganek.userData?.szerokosc) || 1.2;
      const g = new Group();
      g.name = "lawka-dla-goscia";
      const DL = Math.min(.9, szer * .42), GL = .26, WYS = .27;
      const siedzisko = new Mesh(new BoxGeometry(GL, .05, DL), MAT_BUDOWY.deska);
      siedzisko.position.y = WYS;
      g.add(siedzisko);
      for (const k of [-1, 1]) {
        const noga = new Mesh(new BoxGeometry(GL * .8, WYS, .05), MAT_BUDOWY.deskaCiemna);
        noga.position.set(0, WYS / 2, k * (DL / 2 - .06));
        g.add(noga);
      }
      // Ganek jest wąski (x), więc ławka stoi WZDŁUŻ krawędzi pomostu (z), po +z.
      g.position.set(.02, 0, szer / 2 - DL / 2 - .05);
      ganek.add(g);
      app._wlaczCienie?.(g);
      this._lawka = { obj: g, DL, WYS, rzecz: null, krolik: null };
      const p = this.kotwica("pomost");
      if (p) this._dotykowy("lawka", p[0], p[1], 2.3);
    }
    const L = this._lawka;
    if (L.rzecz) { L.obj.remove(L.rzecz); L.rzecz = null; }
    if (rzecz) {
      let m;
      const mat = (kolor) => new MeshLambertMaterial({ color: kolor, flatShading: true });
      if (rzecz === "kubek") {
        m = new Mesh(new CylinderGeometry(.05, .04, .09, 8), mat(0xe8f0f4));
        m.position.y = L.WYS + .07;
      } else if (rzecz === "koc") {
        m = new Mesh(new BoxGeometry(.2, .07, .22), mat(0xc96b6b));
        m.position.y = L.WYS + .06;
        m.rotation.y = .2;
      } else {
        m = new Mesh(new BoxGeometry(.18, .07, .18), mat(0x7fa9d9));
        m.position.y = L.WYS + .06;
        m.rotation.y = .5;
      }
      m.position.z = -L.DL * .28;   // jeden koniec ławki; drugi zostaje dla gościa
      m.name = "rzecz-" + rzecz;
      L.obj.add(m);
      L.rzecz = m;
      app._wlaczCienie?.(m);
    }
    if (arg.kroliczek && !L.krolik) {
      L.krolik = new Group();   // rezerwacja od razu — drugie wywołanie nie wczyta dwóch
      L.krolik.position.set(0, L.WYS + .025, L.DL * .26);
      L.krolik.rotation.y = -Math.PI / 2;
      L.obj.add(L.krolik);
      app.loadGLB?.("kroliczek").then((gl) => {
        if (!gl?.scene || app.destroyed) return;
        const sc = gl.scene;
        sc.scale.setScalar(.5);
        sc.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
        L.krolik.add(sc);   // bez miksera: klipy z GLB nie startują
      }).catch((err) => console.warn("[slady] królik nie dojechał:", err));
    }
    return true;
  }

  /* ── RAMKA NA DOMKU (hybryda KR, 05 karta 6) ────────────────────────────
     `ustawRamke({ symbol, tlo, mala })`: ramka z brył + płótno (`CanvasTexture`)
     na FRONTOWEJ ścianie domku obok drzwi, od strony ganku — widać ją z polany
     i z drabinki (kotwica `kotwica-ramka` ze `schronienie.js` wisi WEWNĄTRZ
     domku, na tylnej ścianie — ta obsługuje rysunek dnia w `WnetrzeDomku`;
     tu zostaje jej rozmiar `bok`). Bez `symbol` — pusta ramka (część A);
     `symbol` + `tlo` (drzewo / woda / niebo z części A) — obraz po śladzie;
     `mala: true` — druga, mniejsza ramka z łapką liska (po zauważeniu).
     Zdjęcie rysunku (tor obrazu, „Pokaż w domku") żyje w `WnetrzeDomku`;
     w scenie zostaje symbol. Idempotentne. */
  ustawRamke(...a) {
    const [dane] = rozdziel(a);
    const arg = dane[0] && typeof dane[0] === "object" ? dane[0] : { symbol: dane[0] || null, tlo: dane[1] || null, mala: dane.includes("mala") };
    const app = this.app;
    const K = app._schronienie;
    const drzwi = K?.getObjectByName("kotwica-drzwi");
    const wzor = K?.getObjectByName("kotwica-ramka");
    if (!drzwi) { console.warn("[slady] nie ma domku — ramka nie ma gdzie wisieć"); return false; }
    const bok = Number(wzor?.userData?.bok) || .45;
    const zrobRamke = (rozmiar, tekstura, obrotY) => {
      const g = new Group();
      const gr = rozmiar * .09;
      const rama = MAT_BUDOWY.deskaCiemna;
      for (const [x, y, w, h] of [[0, rozmiar / 2, rozmiar + gr, gr], [0, -rozmiar / 2, rozmiar + gr, gr], [-rozmiar / 2, 0, gr, rozmiar], [rozmiar / 2, 0, gr, rozmiar]]) {
        const m = new Mesh(new BoxGeometry(w, h, gr * .8), rama);
        m.position.set(x, y, 0);
        g.add(m);
      }
      const mapa = new CanvasTexture(tekstura);
      mapa.colorSpace = SRGBColorSpace;
      const plotno = new Mesh(new PlaneGeometry(rozmiar, rozmiar), new MeshLambertMaterial({ map: mapa }));
      plotno.position.z = gr * .1;
      g.add(plotno);
      g.userData.plotno = plotno;
      g.rotation.y = obrotY;
      return g;
    };
    if (!this._ramka) {
      const szerDrzwi = Number(drzwi.userData?.szerokosc) || .4;
      const wys = Number(drzwi.userData?.wysokosc) || .6;
      const g = zrobRamke(bok, narysujSymbol(null, "papier"), Math.PI / 2);
      g.name = "ramka-hybrydy";
      /* Dziecko KOTWICY DRZWI (nie korzenia domku): kotwice siedzą w bryle
         przesuniętej o `pienX/pienZ` i kołyszą się z drzewem — ramka ma jechać
         razem ze ścianą. Ściana frontowa stoi w x drzwi; ramka tuż przed jej
         licem, obok drzwi, od strony ganku (+x), po −z. */
      g.position.set(.045, wys * .62, -(szerDrzwi / 2 + bok / 2 + .1));
      drzwi.add(g);
      app._wlaczCienie?.(g);
      this._ramka = { obj: g, mala: null, symbol: null, tlo: null };
      const p = this.kotwica("pomost");
      if (p) this._dotykowy("ramka", p[0], p[1], 2.3);
    }
    const R = this._ramka;
    if (arg.symbol && SYMBOLE[arg.symbol]) {
      R.symbol = arg.symbol;
      R.tlo = TLA_RAMKI[arg.tlo] ? arg.tlo : "papier";
      const pl = R.obj.userData.plotno;
      pl.material.map?.dispose?.();
      pl.material.map = new CanvasTexture(narysujSymbol(R.symbol, R.tlo));
      pl.material.map.colorSpace = SRGBColorSpace;
      pl.material.needsUpdate = true;
    }
    if (arg.mala && !R.mala) {
      // Mniejsza, rude tło, łapka liska — „lisek też coś powiesił".
      const c = narysujSymbol("lapka", "papier", 128, "#b8641f");
      const g2 = c.getContext("2d"); g2.globalCompositeOperation = "multiply"; g2.fillStyle = "#f3c48f"; g2.fillRect(0, 0, 128, 128);
      const m = zrobRamke(bok * .55, c, Math.PI / 2);
      m.position.copy(R.obj.position);
      m.position.z -= bok / 2 + bok * .55 / 2 + .08;
      m.position.y -= bok * .12;
      drzwi.add(m);
      app._wlaczCienie?.(m);
      R.mala = m;
    }
    return true;
  }

  /* ── KŁADKA NAD OCZKIEM (hybryda ST, 05 karta 3) ────────────────────────
     `ustawKladke({ ksztalt, porecz })`: odsłania ukryty most (`pokazUkryty`)
     i przebudowuje deski przez `userData.ustaw` z `swiat.js`. `ksztalt`:
     "brak" (część A — tylko brzegi, kładka nie przenosi: `_mostPrzenosi`),
     "plaska" / "harmonijka" / "rurka" / "przemiennie" (po śladzie — lisek
     przechodzi). `porecz: true` po zauważeniu + kwiat przy przęśle (raz). */
  ustawKladke(...a) {
    const [dane, opcje] = rozdziel(a);
    const arg = dane[0] && typeof dane[0] === "object" ? dane[0] : { ksztalt: dane[0], porecz: dane.includes("porecz") };
    const ksztalt = ["brak", "plaska", "harmonijka", "rurka", "przemiennie", "pelne"].includes(arg.ksztalt) ? arg.ksztalt : "brak";
    const porecz = !!arg.porecz;
    const app = this.app;
    if (!this.pokazUkryty("most") && !app.bridge?.parent) { console.warn("[slady] nie ma kładki do ustawienia"); return false; }
    const most = app._mostUkryty?.obj || app.bridge;
    most.userData.ustaw?.({ deski: ksztalt, porecz });
    app._wlaczCienie?.(most);
    const k = this.kotwica("kladka");
    if (k) this._dotykowy("kladka", k[0], k[1], 1.6);
    if (porecz && k && !this._kwiatPrzyKladce && app.kwiaty?.posadz) {
      for (let i = 0; i < 8 && !this._kwiatPrzyKladce; i += 1) {
        const [x, z] = wokol([k[0] - .5, k[1] + 2.1], i);
        this._kwiatPrzyKladce = !!app.kwiaty.posadz(x, z, { bezAnimacji: !!opcje.bezAnimacji, typ: "kwiat", wariant: 2 });
      }
      if (this._kwiatPrzyKladce) app.kwiaty.oznacz?.();
    }
    return true;
  }

  /* ── OCZKO WSCHODNIE (hybryda DT, 05 karta 4) ────────────────────────────
     `ustawOczko({ blysk, przejrzyste, lilie, kwiat })`:
       blysk        — błyszczący kamyk pod taflą (część A: „na dnie coś błyska")
       przejrzyste  — tafla z 0,92 na 0,55 krycia, mniej emisji
       lilie        — n liści lilii (płaskie dyski na wodzie)
       kwiat        — biały kwiat na pierwszym liściu (po zauważeniu)
     Idempotentne: każde pole ustawia stan docelowy. Bez oczka — nic. */
  ustawOczko(...a) {
    const [dane] = rozdziel(a);
    const arg = dane[0] && typeof dane[0] === "object" ? dane[0] : {};
    const app = this.app;
    const o = app.oczka?.[0];
    if (!o?.pos) { console.warn("[slady] nie ma oczka wschodniego"); return false; }
    const [cx, cz] = o.pos;
    const poziom = o.poziomWody ?? -.15;
    const st = this._oczko;
    if (arg.blysk && !st.blysk) {
      const k = kamyczki(.42);
      k.traverse((m) => {
        if (!m.isMesh) return;
        m.material = m.material.clone();
        m.material.emissive?.set(0xffe9a8);
        m.material.emissiveIntensity = .55;
      });
      st.blysk = app._osadz(k, cx + .35, cz - .25, .1, .6);
      this.grupa.add(st.blysk);
      this._dotykowy("oczko", cx, cz, Math.max(1.4, (o.promien || 2) * .55));
    }
    if (arg.przejrzyste != null && o.tafla?.material) {
      o.tafla.material.opacity = arg.przejrzyste ? .55 : .92;
      o.tafla.material.emissiveIntensity = arg.przejrzyste ? .12 : .35;
      o.tafla.material.needsUpdate = true;
    }
    const lilie = Math.max(0, Math.min(6, Number(arg.lilie) || 0));
    const matLisc = new MeshLambertMaterial({ color: 0x4c9a4a, side: DoubleSide });
    for (let i = st.lilie.length; i < lilie; i += 1) {
      const kat = 1.1 + i * 2.2, r = .55 + (i % 2) * .45;
      const x = cx + Math.cos(kat) * r, z = cz + Math.sin(kat) * r;
      const geo = new CircleGeometry(.3, 12, .35, Math.PI * 2 - .55);   // wcięcie liścia lilii
      geo.rotateX(-Math.PI / 2);
      const lisc = new Mesh(geo, matLisc);
      app.planeta.ustaw(lisc, x, z, poziom + .012, i * 1.3);
      this.grupa.add(lisc);
      st.lilie.push({ obj: lisc, x, z });
    }
    if (arg.kwiat && !st.kwiat && st.lilie[0]) {
      const L = st.lilie[0];
      const g = new Group();
      g.name = "kwiat-lilii";
      const platek = new MeshLambertMaterial({ color: 0xfff8f0 });
      for (let i = 0; i < 5; i += 1) {
        const p = new Mesh(new SphereGeometry(.07, 6, 5), platek);
        p.scale.set(1, .45, 1.9);
        const kat = (i / 5) * Math.PI * 2;
        p.position.set(Math.cos(kat) * .09, .05, Math.sin(kat) * .09);
        p.rotation.y = -kat + Math.PI / 2;
        p.rotation.x = -.35;
        g.add(p);
      }
      g.add(new Mesh(new SphereGeometry(.045, 6, 5), new MeshLambertMaterial({ color: KOLORY.flame })).translateY(.08));
      app.planeta.ustaw(g, L.x, L.z, poziom + .02, 0);
      this.grupa.add(g);
      st.kwiat = g;
    }
    app._wlaczCienie?.(this.grupa);
    return true;
  }

  /* ── ZNACZNIK BRAKU (W6) ────────────────────────────────────────────────
     Ten sam pierścień, co na placu budowy (`_placIkona`), ale BEZ ikony domku
     w środku — mówi tylko „tu czegoś brakuje". Jeden na wszystkie hybrydy;
     wisi w układzie planety nad kotwicą i oddycha jak znaczek placu.
     `pokazZnacznikBraku(null)` zdejmuje go. Niezależny od `ustawPlacBudowy`,
     który schodzi przy etapie domku > 0. */
  pokazZnacznikBraku(...a) {
    const [dane] = rozdziel(a);
    const nazwa = dane[0] || null;
    const app = this.app;
    if (this._znacznik) {
      app.swiat.remove(this._znacznik);
      this._znacznik.material.map?.dispose?.();
      this._znacznik.material.dispose?.();
      this._znacznik = null;
    }
    if (!nazwa) return true;
    const k = this.kotwica(nazwa);
    if (!k) { console.warn("[slady] znacznik braku bez kotwicy:", nazwa); return false; }
    const S = 256;
    const c = document.createElement("canvas");
    c.width = c.height = S;
    const g = c.getContext("2d");
    g.lineCap = "round"; g.lineJoin = "round";
    app._tloWskaznika(g, S, (g2, cc, u2) => {
      g2.lineWidth = 11 * u2;
      g2.strokeStyle = "#FFC061";
      g2.beginPath(); g2.arc(cc, cc, 43.5 * u2, 0, Math.PI * 2); g2.stroke();
    });
    // Pusty środek = brak. Trzy kropki zamiast ikony, żeby tarcza nie była dziurą.
    g.fillStyle = "#FFC061";
    for (const dx of [-16, 0, 16]) { g.beginPath(); g.arc(S / 2 + dx * (S / 100), S / 2, 4.2 * (S / 100), 0, Math.PI * 2); g.fill(); }
    const mapa = new CanvasTexture(c);
    mapa.colorSpace = SRGBColorSpace;
    const spr = new Sprite(new SpriteMaterial({ map: mapa, transparent: true, depthTest: false }));
    spr.renderOrder = 58;
    spr.scale.setScalar(1.0);
    const n = app.planeta.normalna(k[0], k[1]).clone();
    const h = app.wysokoscGruntuSiatki ? app.wysokoscGruntuSiatki(k[0], k[1]) : 0;
    /* Nad pomostem znacznik musi wisieć NAD deskami (poziom × skala domku),
       nie w pniu; reszta kotwic stoi na gruncie. */
    const nad = nazwa === "pomost" ? (this.app._uklad?.poziom ?? 2.6) * (this.app.mapa?.schronienie?.skala ?? 1) + 1.4 : 1.35;
    const baza = app.planeta.naKule(k[0], k[1], h + nad);
    spr.position.copy(baza);
    app.swiat.add(spr);
    this._znacznik = spr;
    const bujaj = () => {
      if (app.destroyed || this._znacznik !== spr) return;
      const t = performance.now() * .0022;
      spr.position.copy(baza).addScaledVector(n, Math.sin(t) * .07);
      spr.scale.setScalar(1.0 + Math.sin(t * 1.6) * .04);
      requestAnimationFrame(bujaj);
    };
    requestAnimationFrame(bujaj);
    return true;
  }

  /* ── ŚLAD PORADY DNIA (docs/tresci/04 §6) ───────────────────────────────
     Lisek robi w świecie to samo, co dziecko zrobiło obok ekranu, a świat
     zmienia się delikatnie i TYLKO DO KOŃCA DOBY. To nie jest nagroda: bez
     licznika, bez monet, bez Fasoli (`fasola:podlana` nie idzie), jeden ślad
     na dzień (drugi tego dnia ZASTĘPUJE pierwszy, nie dokłada), schodzi z nocą
     (`_etapSesji` = noc) tak jak mokre ślady łap. Żadnego światła w oknie ani
     nocnego — to reakcje hybryd (`05`, MD). Wszystko z tego, co scena już ma:
     klipy `idle`/`happy`, sprężyny gibania, `Chmury`, `Swiatlo`, `kwiaty.posadz`,
     `kamyczki`, `MokreSlady`, `Dymki`. Żadnego nowego modelu ani klipu.

     `ustawSladPorady(slad, { kolor, bezAnimacji })`:
       lisek-oddycha           — puls skali bohatera (1,00→1,03) pięć razy; drzewa
                                 i kwiaty gibają o połowę wolniej (`_spokojGib`),
                                 chmury ×0,6 — do końca doby
       lisek-strzasa           — `happy` dwa razy + dymki pod łapami; trzy kwiaty
                                 wokół miejsca, w którym stał
       swiatlo-dnia            — kula światła (`Swiatlo`, bez światła punktowego)
                                 krąży przy stopie drabinki, gaśnie o zachodzie
       kamyczek-przy-drabince  — ozdobny kamyczek u stóp drabinki (etap 0: obok
                                 placu); NIE liczy się jako materiał
       niebo-cichnie           — lisek staje; chmury wolniej, wypełnienie o krok
                                 cieplsze (tylko barwa, NIE `doba.przewin`)
       slady-lap               — lisek biegnie kawałek ku choince i wraca; mokre
                                 łapy, ślady nie wysychają do końca doby
       kropla-swiatla          — błękitna kropla unosi się nad oczkiem wschodnim,
                                 do zmierzchu
       kwiat-koloru            — jeden kwiat przy oczku w kolorze z karty odzewu
                                 (`kolor` = indeks palety `zbudujKwiaty`)
     `bezAnimacji` = odtworzenie po wejściu do świata tego samego dnia: sam
     stan, bez pulsu, biegu i `happy`. */
  ustawSladPorady(...a) {
    const [dane, opcje] = rozdziel(a);
    const slad = dane[0];
    const app = this.app;
    if (!slad || !app.hero) return false;
    const bez = !!opcje.bezAnimacji;
    const kolor = Number.isInteger(opcje.kolor) ? opcje.kolor : null;
    if (this._porada && this._porada.slad === slad && (kolor == null || this._porada.kolor === kolor)) return true;
    this.zdejmijSladPorady();
    const P = this._porada = { slad, kolor, t: 0, obiekty: [], kule: [], puls: null, happy: 0, bieg: null, cieplo: 0 };

    const wolniejszeChmury = () => {
      if (!app.chmury?.sztuki || P.chmury) return;
      P.chmury = app.chmury.sztuki.map((s) => s.tempo);
      for (const s of app.chmury.sztuki) s.tempo *= .6;
    };
    const kula = (kotwica, h, barwa) => {
      if (!kotwica) return false;
      const g = new Group();
      g.name = "swiatlo-porady";
      app.planeta.ustaw(g, kotwica[0], kotwica[1], h, 0);
      const sw = new Swiatlo(g, { ile: 1, barwa, mocLatarni: 0, wielkoscKuli: .13, promienOrbity: .32, wysokosc: 0, tempoOrbity: .45 });
      sw.grupa.remove(sw.latarnia);    // budżet świateł punktowych zostaje nietknięty
      sw.dodaj();
      this.grupa.add(g);
      P.obiekty.push(g);
      P.kule.push(sw);
      return true;
    };
    const stan = () => {
      if (!app.walking && !app.sequence && !app._kino) app.play("idle", .3);
    };

    switch (slad) {
      case "lisek-oddycha": {
        app._spokojGib = .5;
        wolniejszeChmury();
        if (!bez) { stan(); P.puls = { baza: app.hero.scale.x, t: 0, okres: 4, cykli: 5 }; }
        return true;
      }
      case "lisek-strzasa": {
        const k = [app.hp.x, app.hp.z];
        let posadzone = 0;
        for (let i = 0; i < 12 && posadzone < 3; i += 1) {
          const [x, z] = wokol(k, i);
          if (app.kwiaty?.posadz?.(x, z, { bezAnimacji: bez, typ: "kwiat", wariant: (i + 1) % LICZBA_KOLOROW })) posadzone += 1;
        }
        if (posadzone) app.kwiaty.oznacz?.();
        if (!bez) { P.happy = 2; P.happyT = 0; }
        return true;
      }
      case "swiatlo-dnia": {
        const S = this.kotwica("stopa-drabinki") || this.kotwica("pod-drzewem");
        if (!S) { console.warn("[slady] ślad porady: nie ma drabinki dla światła dnia"); this._porada = null; return false; }
        const [x, z] = wokol(S, 2);
        const h = (app.wysokoscGruntuSiatki ? app.wysokoscGruntuSiatki(x, z) : 0) + 1.05;
        stan();
        return kula([x, z], h, 0xffe9a8);
      }
      case "kamyczek-przy-drabince": {
        const S = this.kotwica("stopa-drabinki") || this.kotwica("przy-drabince");
        if (!S) { console.warn("[slady] ślad porady: nie ma gdzie położyć kamyczka"); this._porada = null; return false; }
        const [x, z] = wokol(S, 4);
        const kot = app._osadz(kamyczki(.42), x, z, .03, 1.1);
        kot.name = "kamyczek-porady";
        this.grupa.add(kot);
        app._wlaczCienie?.(kot);
        P.obiekty.push(kot);
        return true;
      }
      case "niebo-cichnie": {
        wolniejszeChmury();
        P.cieplo = 1;
        if (!bez) stan();
        return true;
      }
      case "slady-lap": {
        const M = app.mokreSlady;
        if (M) { M.bezWysychania = true; M.zamocz(); }
        if (!bez) {
          const c = this.kotwica("przy-choince");
          if (c) P.bieg = { t: 0, tam: 1.15, powrot: 1.25, celN: app.planeta.normalna(c[0], c[1]), startN: app.hn.clone() };
        }
        return true;
      }
      case "kropla-swiatla": {
        const o = app.oczka?.[0];
        if (!o?.pos) { console.warn("[slady] ślad porady: nie ma oczka dla kropli"); this._porada = null; return false; }
        stan();
        return kula(o.pos, (o.poziomWody ?? -.15) + 1.1, 0x8fdcff);
      }
      case "kwiat-koloru": {
        const o = app.oczka?.[0];
        if (!o?.pos) { console.warn("[slady] ślad porady: nie ma oczka dla kwiatu"); this._porada = null; return false; }
        /* Brzeg od strony drabinki, poza wodą: promień stawu + zapas. */
        const D = this.kotwica("stopa-drabinki") || this.kotwica("pod-drzewem") || [o.pos[0] + 1, o.pos[1]];
        const dx = D[0] - o.pos[0], dz = D[1] - o.pos[1], dl = Math.hypot(dx, dz) || 1;
        const r = (o.promien || 1.4) + .7;
        const brzeg = [o.pos[0] + dx / dl * r, o.pos[1] + dz / dl * r];
        const wariant = kolor == null ? 2 : Math.max(0, Math.min(LICZBA_KOLOROW - 1, kolor));
        let ok = false;
        for (let i = 0; i < 10 && !ok; i += 1) {
          const [x, z] = wokol(brzeg, i);
          if (Math.hypot(x - o.pos[0], z - o.pos[1]) < (o.promien || 1.4) + .35) continue;
          ok = !!app.kwiaty?.posadz?.(x, z, { bezAnimacji: bez, typ: "kwiat", wariant });
        }
        if (ok) app.kwiaty.oznacz?.();
        if (ok && !bez) app.pokazMiejsce?.(brzeg, { trzym: 1.2 });
        return ok;
      }
      default:
        console.warn("[slady] nieznany ślad porady:", slad);
        this._porada = null;
        return false;
    }
  }

  /** Zdejmuje ślad porady i przywraca tempo chmur, gibanie, wysychanie łap, skalę liska. */
  zdejmijSladPorady() {
    const P = this._porada;
    const app = this.app;
    if (!P) return;
    this._porada = null;
    for (const o of P.obiekty) o.parent?.remove(o);
    if (P.chmury && app.chmury?.sztuki) app.chmury.sztuki.forEach((s, i) => { if (P.chmury[i] != null) s.tempo = P.chmury[i]; });
    app._spokojGib = 1;
    if (P.puls && app.hero) app.hero.scale.setScalar(P.puls.baza);
    if (app.mokreSlady) app.mokreSlady.bezWysychania = false;
    if (P.bieg && app.inputSource === "api") { app.input.set(0, 0); app.inputSource = null; }
  }

  _poradaTik(e) {
    const P = this._porada;
    if (!P) return;
    const app = this.app;
    /* NOC ZDEJMUJE ŚLAD — tak samo jak mokre ślady łap: rano jest czysto. */
    if (app._etapSesji === "noc" || app._etapSesji === "koniec") { this.zdejmijSladPorady(); return; }
    P.t += e;
    const dzien = app.doba?.stan ? Math.max(0, Math.min(1, app.doba.stan.dzien || 0)) : 1;

    // Kule światła: krążą w dzień, gasną o zachodzie (skala → 0, bez nocnego światła).
    for (const sw of P.kule) {
      sw.aktualizuj(e);
      const k = sw.kule[0]?.obj;
      if (k) { k.visible = dzien > .05; k.scale.multiplyScalar(Math.max(.001, dzien)); }
    }

    // Puls oddechu: 1,00 → 1,03 → 1,00 na cykl, pięć cykli, potem skala bazowa.
    if (P.puls && app.hero) {
      const U = P.puls;
      U.t += e;
      const faza = U.t / U.okres;
      if (faza >= U.cykli) { app.hero.scale.setScalar(U.baza); P.puls = null; }
      else app.hero.scale.setScalar(U.baza * (1 + .03 * .5 * (1 - Math.cos(faza * Math.PI * 2))));
    }

    // Dwa `happy` po kolei + kłębki pod łapami (Dymki mają własny wyrzut).
    if (P.happy > 0) {
      P.happyT += e;
      if (!app.sequence && !app.walking && !app._kino && P.happyT > .25) {
        P.happy -= 1;
        P.happyT = 0;
        app.play("happy", .12);
        app.sequence = "happy";
        app.seqTimer = 0;
        if (app.dymki?._wyrzuc && app.hn && app.hf) for (let i = 0; i < 3; i += 1) app.dymki._wyrzuc(app.hn, app.hf);
      }
    }

    // Wypełnienie o krok cieplejsze — tylko barwa, po `Doba.aktualizuj` (ona ją ustawia co klatkę).
    if (P.cieplo > 0 && app.wypelnienie?.color) app.wypelnienie.color.lerp(_CIEPLO, .22 * P.cieplo * dzien);

    this._biegTik(e);
  }

  /* Bieg liska ku choince i z powrotem — przez drążek „z api": to ta sama
     droga, którą idzie palec dziecka, więc kolizje, kroki i dymki działają
     same. Palec dziecka na drążku albo kino przerywają bieg od razu. */
  _biegTik(e) {
    const P = this._porada;
    const B = P?.bieg;
    if (!B) return;
    const app = this.app;
    const koniec = () => { if (app.inputSource === "api") { app.input.set(0, 0); app.inputSource = null; } P.bieg = null; };
    if (app.stick?.active || app._kino || app._podglad || app._drabinka || app.keys?.size) { koniec(); return; }
    B.t += e;
    const doCelu = B.t < B.tam;
    const cel = doCelu ? B.celN : B.startN;
    if (B.t >= B.tam + B.powrot || (!doCelu && app.planeta.odleglosc(app.hn, B.startN) < .3)) { koniec(); return; }
    const dir = stycznaDo(app.hn, cel, app.hf, this._v);
    this._w.copy(dir).applyQuaternion(app.swiat.quaternion);
    const ix = this._w.dot(app.camRight), iy = this._w.dot(app.camFwd);
    const dl = Math.hypot(ix, iy) || 1;
    app.enterFreeMode?.();
    app.input.set(ix / dl, iy / dl);
    app.inputSource = "api";
  }

  /**
   * ZNAK OBOK WIZKORA — po zadaniu, w którym dziecko zadało pytanie albo
   * powiedziało pierwsze słowo (`pierwsze-slowo`, `lowca-pytan`). Wołany z
   * danych jako `dodajZnak ["lupa"]`; drugi argument to kotwica (domyślnie
   * obok czarodzieja). Znak jest proceduralny (`znakProceduralny`), bo
   * `Znak` z `znak.js` wymaga modelu GLB, którego w `assets/` nie ma —
   * kołek i tabliczka z brył wystarczą, żeby obietnica z toastu („obok
   * Wizkora pojawił się znak") była prawdą. Miejsce z tej samej spirali,
   * co reszta śladów, więc odtworzenie stawia go dokładnie tam, gdzie
   * stanął pierwszy raz. Tabliczka patrzy w stronę kotwicy.
   */
  dodajZnak(...a) {
    const [dane] = rozdziel(a);
    const rodzaj = dane[0] || "lupa";
    const gdzie = dane[1] || "obok-czarodzieja";
    const k = this.kotwica(gdzie);
    if (!k) { console.warn("[slady] nie ma gdzie postawić znaku:", gdzie, rodzaj); return false; }
    const [x, z] = wokol(k, this._numer(gdzie));
    const obrot = Math.atan2(k[0] - x, k[1] - z);
    this.grupa.add(this.app._osadz(znakProceduralny(rodzaj, 1), x, z, 0.04, obrot));
    this.app._wlaczCienie?.(this.grupa);
    return true;
  }
}
