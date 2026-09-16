/**
 * zadanieDrewna — DRUGIE zadanie od czarodzieja, zaraz po gwiazdkach:
 * zdobyć materiał na pierwszy etap schronienia i PRZYNIEŚĆ go na plac.
 *
 * Czym się różni od `zadanieGwiazdek` i dlaczego to nie jest kopia:
 *
 * 1. NIE MA NAGRODY W MONETACH. Zapłatą jest to, że na polanie staje szkielet
 *    schronienia — „działanie → konsekwencja → zmiana świata", a nie
 *    „zadanie → monety → sklep". `docs/OPIS_PROJEKTU.md` odrzuca to drugie
 *    wprost, więc gdyby ktoś chciał tu dopisać `dodajMonety`, niech najpierw
 *    przeczyta tamten plik.
 *
 * 2. LICZY RZECZY, NIE SZTUKI. Do etapu potrzeba jednego suchego drzewka
 *    i jednego głazu — nie „ośmiu jednostek drewna". Dwa konkretne cele
 *    dziecko trzyma w głowie bez licznika; osiem jednostek to już magazyn.
 *
 * 3. ŚCIĘCIE TO POŁOWA ROBOTY. Materiał nie teleportuje się na budowę —
 *    lisek musi go donieść. Stąd DWA stopnie dla każdej rzeczy:
 *    `zuzyte` (ścięte, leży w lesie) i `dostarczone` (jest na placu).
 *    Dopiero drugi stopień otwiera budowę. Gdyby kiedyś ktoś chciał to
 *    uprościć „bo szybciej" — to właśnie kurs z materiałem jest momentem,
 *    w którym „zdobyłem" zamienia się w „przyniosłem".
 *
 * 4. ŚCINAMY TYLKO SUCHE DRZEWKO. Zapis tego nie pilnuje (pilnuje to scena,
 *    bo tylko suche drzewka dostają znak do wbiegnięcia), ale gdyby kiedyś
 *    ktoś wołał `policzDrzewko` z innego miejsca — to nie jest zaproszenie
 *    do wycinania żywego lasu.
 *
 * Czego tu NIE MA i nie powinno być: tego, co lisek niesie w tej chwili.
 * Ładunek jest ulotny — apka zamknięta w pół drogi oddaje stos tam, gdzie
 * leżał. Dziecko traci kurs, nie materiał.
 *
 * Trwałość jak przy gwiazdkach: localStorage, bo dziecko zamyka apkę w pół
 * drogi i wraca po godzinie, a to JEST zadanie — ma trwać.
 */

const KLUCZ = "ewolucja.zadanie.drewno";

/**
 * ZDARZENIE ZMIANY — tak samo jak w `misjeGier.js` i `puzzleGier.js`.
 *
 * PO CO. `Swiat.jsx` trzyma stan drewna w `useState` i czyta zapis RAZ, przy
 * montowaniu. Dopóki każda zmiana szła z jego własnego handlera, to działało.
 * Ale pulpit dev ustawia całe ogniwo łańcucha (`zastosujEtap` w
 * `etapyMisji.js`): kasuje zapis i odbudowuje go od zera, poza Reactem. Nikt
 * o tym nie mówił światu, więc scena zostawała ze ściętym drzewkiem, rozbitym
 * głazem i zniknniętym placem, mimo że zapis mówił „zacznij od początku".
 *
 * Ogłaszamy z `zapisz()` i z `skasujZadanieDrewna()`, czyli z DWÓCH miejsc,
 * przez które przechodzi każda zmiana — a nie z siedmiu mutatorów, bo ósmy
 * zawsze by o tym zapomniał.
 */
export const ZDARZENIE_ZMIANY = "ewolucja:drewno-zmiana";

function ogloszZmiane() {
  try { window.dispatchEvent(new CustomEvent(ZDARZENIE_ZMIANY)); } catch {}
}

/** Ile czego trzeba na pierwszy etap. Zgodne z `KOSZT_ETAPU` w scenie. */
export const CEL_DRZEWKA = 1;
export const CEL_GLAZY = 1;

/**
 * Stany, jeden obiekt — tak samo jak przy gwiazdkach, bo czarodziej
 * i HUD czytają je tym samym odruchem:
 *
 *   1. nie ma zadania              istnieje=false
 *   2. trwa zdobywanie             istnieje, !spelnione
 *   3. materiał JEST NA PLACU      spelnione, !zbudowane
 *   4. szkielet stoi               zbudowane
 *
 * `zbudowane`, a nie `wyplacone`: nic tu nikomu nie płacimy. Nazwa ma
 * przypominać, czym kończy się to zadanie.
 */
const PUSTE = {
  istnieje: false,
  aktywne: false,
  drzewka: 0,
  glazy: 0,
  // Identyfikatory zużytych obiektów („drzewko-polana", „glaz-polana").
  // Trzymamy je W ZAPISIE z tego samego powodu co przy gwiazdkach: mapa
  // buduje się od nowa przy każdym wejściu, więc bez tej listy ścięte
  // drzewko wracałoby na polanę całe.
  zuzyte: [],
  /**
   * Co leży JUŻ NA PLACU. Klucz to rodzaj, wartość to id obiektu, z którego
   * materiał pochodzi — scena potrzebuje id, żeby po powrocie do świata
   * odtworzyć skład, a rodzaj mówi HUD-owi, którą ikonkę zapalić.
   */
  dostarczone: { drewno: null, kamien: null },
  spelnione: false,
  zbudowane: false,
  /** Numer najwyższego postawionego etapu schronienia (0 = pusta polana). */
  etap: 0,
  /** Czy świat pokazał już dziecku plac budowy. Jeden raz, nie przy każdym wejściu. */
  miejscePokazane: false,
};

function czytajDostarczone(surowe) {
  const d = surowe && typeof surowe === "object" ? surowe : {};
  const tekst = (v) => (typeof v === "string" && v ? v : null);
  return { drewno: tekst(d.drewno), kamien: tekst(d.kamien) };
}

function czytaj() {
  try {
    const surowe = JSON.parse(localStorage.getItem(KLUCZ) || "null");
    if (!surowe || typeof surowe !== "object") return null;
    return {
      istnieje: true,
      drzewka: Math.max(0, Number(surowe.drzewka) || 0),
      glazy: Math.max(0, Number(surowe.glazy) || 0),
      zuzyte: Array.isArray(surowe.zuzyte) ? surowe.zuzyte.filter((x) => typeof x === "string") : [],
      dostarczone: czytajDostarczone(surowe.dostarczone),
      zbudowane: !!surowe.zbudowane,
      etap: Math.max(0, Number(surowe.etap) || 0),
      miejscePokazane: !!surowe.miejscePokazane,
    };
  } catch {
    return null;
  }
}

function zapisz(stan) {
  try {
    localStorage.setItem(KLUCZ, JSON.stringify({
      drzewka: stan.drzewka, glazy: stan.glazy,
      zuzyte: stan.zuzyte, dostarczone: stan.dostarczone,
      zbudowane: stan.zbudowane, etap: stan.etap,
      miejscePokazane: stan.miejscePokazane,
    }));
  } catch {}
  ogloszZmiane();
}

/**
 * Pełny stan zadania — `spelnione`, `aktywne` i pola pochodne są WYLICZANE,
 * nie zapisywane, żeby nie dało się ich rozjechać z resztą.
 */
export function stanDrewna() {
  const s = czytaj();
  /* PUSTY STAN MA MIEĆ TE SAME POLA, co pełny. Inaczej `stanDrewna()` zwraca
     raz obiekt z `dostarczoneId`, raz bez — i pierwszy `.join()` na świeżym
     profilu wywala całą stronę. Kształt musi być jeden, zawsze. */
  if (!s) {
    return {
      ...PUSTE,
      dostarczone: { ...PUSTE.dostarczone },
      dostarczoneId: [],
      drewnoNaPlacu: false,
      kamienNaPlacu: false,
    };
  }
  const drewnoNaPlacu = !!s.dostarczone.drewno;
  const kamienNaPlacu = !!s.dostarczone.kamien;
  return {
    ...s,
    drewnoNaPlacu,
    kamienNaPlacu,
    /** Lista id do odtworzenia składu przez scenę. */
    dostarczoneId: [s.dostarczone.drewno, s.dostarczone.kamien].filter(Boolean),
    /* SPEŁNIONE ZNACZY „NA PLACU", nie „ścięte". To jest jedyne miejsce,
       w którym ta różnica zapada — reszta aplikacji czyta `spelnione`. */
    spelnione: drewnoNaPlacu && kamienNaPlacu,
    aktywne: !s.zbudowane,
  };
}

export function rozpocznijZadanieDrewna() {
  const s = czytaj();
  if (s) return stanDrewna();
  zapisz({ ...PUSTE, dostarczone: { ...PUSTE.dostarczone }, istnieje: true, aktywne: true });
  return stanDrewna();
}

/**
 * Zalicza jedno ścięte drzewko. `znak` to identyfikator obiektu z mapy —
 * bez niego to samo drzewko dałoby się „ściąć" dwa razy po wejściu do świata
 * od nowa.
 */
export function policzDrzewko(znak) {
  return policz("drzewka", znak);
}

/** Zalicza jeden rozbity głaz. */
export function policzGlaz(znak) {
  return policz("glazy", znak);
}

function policz(pole, znak) {
  let s = czytaj();
  /* ZADANIE OTWIERA SIĘ SAMO. Wcześniej brak zapisu powodował ciche wyjście
     i realne osiągnięcie przepadało — np. po włączeniu rąbania z pulpitu.
     Lepiej zapisać robotę, której nikt nie zlecił, niż zgubić zrobioną. */
  if (!s) { rozpocznijZadanieDrewna(); s = czytaj(); if (!s) return stanDrewna(); }
  if (znak && s.zuzyte.includes(znak)) return stanDrewna();
  s[pole] += 1;
  if (znak) s.zuzyte = [...s.zuzyte, znak];
  zapisz(s);
  return stanDrewna();
}

/**
 * Zalicza DONIESIENIE materiału na plac. To ten krok otwiera budowę —
 * `rodzaj` przychodzi ze sceny jako „drzewko" albo „glaz".
 */
export function zaliczDostawe(rodzaj, znak) {
  let s = czytaj();
  if (!s) { rozpocznijZadanieDrewna(); s = czytaj(); if (!s) return stanDrewna(); }
  const klucz = rodzaj === "glaz" ? "kamien" : "drewno";
  if (s.dostarczone[klucz]) return stanDrewna();
  s.dostarczone = { ...s.dostarczone, [klucz]: znak || klucz };
  // Dostawa bez wcześniejszego ścięcia (pulpit testowy) domyka też ten stopień,
  // inaczej HUD pokazywałby „na placu" przy nieodhaczonym ✓.
  if (znak && !s.zuzyte.includes(znak)) {
    s.zuzyte = [...s.zuzyte, znak];
    if (klucz === "kamien") s.glazy += 1; else s.drzewka += 1;
  }
  zapisz(s);
  return stanDrewna();
}

/** Czy ten obiekt z mapy został już zużyty (scena pyta przy budowaniu mapy). */
export function juzZuzyte(znak) {
  const s = czytaj();
  return !!s && s.zuzyte.includes(znak);
}

/** Zapamiętuje, że świat pokazał już dziecku plac — żeby nie robić tego co wejście. */
export function oznaczMiejscePokazane() {
  const s = czytaj();
  if (!s || s.miejscePokazane) return stanDrewna();
  s.miejscePokazane = true;
  zapisz(s);
  return stanDrewna();
}

/**
 * Stawia kolejny etap schronienia. Zwraca nowy stan — to on jest „nagrodą",
 * więc wołający ma czym pokazać dziecku, co się właśnie zmieniło w świecie.
 */
export function postawEtap() {
  const s = czytaj();
  if (!s) return stanDrewna();
  s.zbudowane = true;
  s.etap = Math.max(1, s.etap + 1);
  zapisz(s);
  return stanDrewna();
}

export function skasujZadanieDrewna() {
  try { localStorage.removeItem(KLUCZ); } catch {}
  ogloszZmiane();
}
