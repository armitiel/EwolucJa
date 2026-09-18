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
  Group, Mesh, MeshLambertMaterial, BoxGeometry, CylinderGeometry, TorusGeometry,
} from "three";
import { kamyczki, MAT_DREWNO } from "./natura.js";
import { grzyby, KOLORY } from "./swiat.js";

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
