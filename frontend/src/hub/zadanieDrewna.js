/**
 * zadanieDrewna — DRUGIE zadanie od czarodzieja, zaraz po gwiazdkach:
 * zdobyć materiał na pierwszy etap schronienia i PRZYNIEŚĆ go na plac.
 *
 * Czym się różni od `zadanieGwiazdek` i dlaczego to nie jest kopia:
 *
 * 1. NIE MA NAGRODY W MONETACH. Zapłatą jest to, że na wielkim drzewie staje
 *    pomost z drabinką — „działanie → konsekwencja → zmiana świata", a nie
 *    „zadanie → monety → sklep". `docs/OPIS_PROJEKTU.md` odrzuca to drugie
 *    wprost, więc gdyby ktoś chciał tu dopisać `dodajMonety`, niech najpierw
 *    przeczyta tamten plik.
 *
 * 2. LICZY RZECZY, NIE SZTUKI. Do etapu potrzeba TRZECH ściętych drzew
 *    i trzech stosów zniesionych pod drzewo — nie „ośmiu jednostek drewna".
 *    Trzy takie same rzeczy dziecko trzyma w głowie i widzi w HUD-zie jako
 *    trzy znaczki; osiem jednostek to już magazyn.
 *
 *    KAMIEŃ WYPADŁ Z BUDOWY (decyzja właściciela 2026-09-17). Wcześniej etap
 *    kosztował jedno drzewo i jeden głaz, przez co dziecko uczyło się dwóch
 *    różnych czynności naraz, zanim zobaczyło pierwszy efekt. Teraz jest jedna
 *    czynność powtórzona trzy razy — i to ona buduje nawyk. Głaz został na
 *    polanie jako element świata, ale nie jest już celem (`mapa.json`,
 *    `doRozbicia: false`).
 *
 * 3. ŚCIĘCIE TO POŁOWA ROBOTY. Materiał nie teleportuje się na budowę —
 *    lisek musi go donieść. Stąd DWA stopnie dla każdej rzeczy:
 *    `zuzyte` (ścięte, leży w lesie) i `dostarczone` (jest na placu).
 *    Dopiero drugi stopień otwiera budowę. Gdyby kiedyś ktoś chciał to
 *    uprościć „bo szybciej" — to właśnie kurs z materiałem jest momentem,
 *    w którym „zdobyłem" zamienia się w „przyniosłem".
 *
 * 4. ŚCINAMY TRZY DOWOLNE DRZEWA. Dziecko wybiera które — każde zamienia się
 *    w stos kłód; reszta lasu stoi. Wyjątkiem jest wielkie drzewo na polanie:
 *    na nim ma stanąć domek, więc scena nie daje mu znaku do ścięcia.
 *    Zapis tego nie pilnuje (pilnuje scena), ale gdyby ktoś wołał
 *    `policzDrzewko` z innego miejsca — to są TRZY drzewa na etap,
 *    a nie zaproszenie do wycinania lasu.
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

/**
 * Ile czego trzeba na pierwszy etap.
 *
 * Trzy drzewa i trzy stosy pod drzewem — te same trzy rzeczy w dwóch stopniach,
 * nie sześć osobnych celów. `CEL_STOSOW` stoi obok `CEL_DRZEWKA` osobno, bo to
 * DWA różne pytania („czy ścięte?" i „czy na placu?") i kod czyta się jaśniej,
 * gdy nie trzeba pamiętać, że to przypadkiem ta sama liczba.
 */
export const CEL_DRZEWKA = 3;
export const CEL_STOSOW = 3;

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
  // Dzień (YYYY-MM-DD), w którym postawiono ostatnie piętro domku.
  dzienEtapu: null,
  // Identyfikatory zużytych obiektów (id drzew z mapy, np. „drzewo-3.10-8.42").
  // Trzymamy je W ZAPISIE z tego samego powodu co przy gwiazdkach: mapa
  // buduje się od nowa przy każdym wejściu, więc bez tej listy ścięte
  // drzewo wracałoby na polanę całe.
  zuzyte: [],
  /**
   * Co leży JUŻ POD DRZEWEM — lista id obiektów, z których materiał pochodzi.
   * LISTA, a nie dwa nazwane sloty jak przed 17.09: stosy są nierozróżnialne,
   * liczy się ich LICZBA, a id scena potrzebuje tylko po to, żeby po powrocie
   * do świata odtworzyć skład i nie wskrzesić ściętego drzewa.
   */
  dostarczone: [],
  spelnione: false,
  zbudowane: false,
  /** Numer najwyższego postawionego etapu schronienia (0 = pusta polana). */
  etap: 0,
  /** Czy świat pokazał już dziecku plac budowy. Jeden raz, nie przy każdym wejściu. */
  miejscePokazane: false,
};

/**
 * Czyta dostawy z zapisu — w dwóch kształtach, bo stare profile ich nie zmienią.
 *
 * DO 17.09 stało tu `{ drewno: id, kamien: id }`: jedno drewno i jeden kamień.
 * Kamień przestał być materiałem, więc ze starego zapisu bierzemy samo drewno.
 * Dziecko w połowie tamtego zadania traci z placu kupkę kamieni (i licznik
 * cofa się do 1 z 3) — ale ścięte drzewa zostają zaliczone, a alternatywą było
 * zostawienie na placu materiału, którego budowa już nie używa.
 */
function czytajDostarczone(surowe) {
  if (Array.isArray(surowe)) {
    return surowe.filter((x) => typeof x === "string" && x).slice(0, CEL_STOSOW);
  }
  if (surowe && typeof surowe === "object" && typeof surowe.drewno === "string" && surowe.drewno) {
    return [surowe.drewno];
  }
  return [];
}

function czytaj() {
  try {
    const surowe = JSON.parse(localStorage.getItem(KLUCZ) || "null");
    if (!surowe || typeof surowe !== "object") return null;
    return {
      istnieje: true,
      drzewka: Math.max(0, Number(surowe.drzewka) || 0),
      zuzyte: Array.isArray(surowe.zuzyte) ? surowe.zuzyte.filter((x) => typeof x === "string") : [],
      dostarczone: czytajDostarczone(surowe.dostarczone),
      zbudowane: !!surowe.zbudowane,
      etap: Math.max(0, Number(surowe.etap) || 0),
      dzienEtapu: typeof surowe.dzienEtapu === "string" ? surowe.dzienEtapu : null,
      miejscePokazane: !!surowe.miejscePokazane,
    };
  } catch {
    return null;
  }
}

function zapisz(stan) {
  try {
    localStorage.setItem(KLUCZ, JSON.stringify({
      drzewka: stan.drzewka,
      zuzyte: stan.zuzyte, dostarczone: stan.dostarczone,
      zbudowane: stan.zbudowane, etap: stan.etap,
      dzienEtapu: stan.dzienEtapu ?? null,
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
      dostarczone: [],
      dostarczoneId: [],
      naPlacu: 0,
      doSciecia: CEL_DRZEWKA,
      doZniesienia: 0,
    };
  }
  const naPlacu = s.dostarczone.length;
  return {
    ...s,
    /** Ile stosów leży już pod drzewem (0..CEL_STOSOW). */
    naPlacu,
    /** Ile drzew jeszcze trzeba ściąć. */
    doSciecia: Math.max(0, CEL_DRZEWKA - s.drzewka),
    /** Ile stosów jest ściętych, ale wciąż leży w lesie. */
    doZniesienia: Math.max(0, Math.min(s.drzewka, CEL_DRZEWKA) - naPlacu),
    /** Lista id do odtworzenia składu przez scenę. */
    dostarczoneId: [...s.dostarczone],
    /* SPEŁNIONE ZNACZY „NA PLACU", nie „ścięte". To jest jedyne miejsce,
       w którym ta różnica zapada — reszta aplikacji czyta `spelnione`. */
    spelnione: naPlacu >= CEL_STOSOW,
    aktywne: !s.zbudowane,
  };
}

export function rozpocznijZadanieDrewna() {
  const s = czytaj();
  if (s) return stanDrewna();
  zapisz({ ...PUSTE, dostarczone: [], istnieje: true, aktywne: true });
  return stanDrewna();
}

/**
 * Zalicza jedno ścięte drzewo. `znak` to identyfikator obiektu z mapy —
 * bez niego to samo drzewo dałoby się „ściąć" dwa razy po wejściu do świata
 * od nowa.
 */
export function policzDrzewko(znak) {
  return policz("drzewka", znak);
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
 * Zalicza DONIESIENIE stosu pod drzewo. To ten krok otwiera budowę.
 *
 * `rodzaj` przychodzi ze sceny („drzewko" albo „glaz"). Kamień od 17.09 NIE
 * JEST materiałem: scena i tak nie powinna go przynieść (głaz stracił znak
 * `doRozbicia`), ale stary zapis albo pulpit dev mogą jeszcze zawołać tę
 * funkcję z „glaz" — wtedy nic nie zaliczamy, zamiast po cichu przyjąć
 * na plac coś, czego budowa nie użyje.
 */
export function zaliczDostawe(rodzaj, znak) {
  let s = czytaj();
  if (!s) { rozpocznijZadanieDrewna(); s = czytaj(); if (!s) return stanDrewna(); }
  if (rodzaj === "glaz") return stanDrewna();
  if (s.dostarczone.length >= CEL_STOSOW) return stanDrewna();
  // Bez id stos i tak musi mieć czym się różnić od poprzedniego, inaczej
  // druga dostawa z pulpitu nadpisałaby pierwszą.
  const id = znak || `stos-${s.dostarczone.length + 1}`;
  if (s.dostarczone.includes(id)) return stanDrewna();
  s.dostarczone = [...s.dostarczone, id];
  // Dostawa bez wcześniejszego ścięcia (pulpit testowy) domyka też ten stopień,
  // inaczej HUD pokazywałby „pod drzewem" przy nieodhaczonym ✓.
  if (!s.zuzyte.includes(id)) {
    s.zuzyte = [...s.zuzyte, id];
    s.drzewka += 1;
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
/**
 * DOBA, W KTÓREJ STOIMY — jako znacznik „tego samego dnia".
 *
 * Używamy daty kalendarzowej, a nie numeru z `services/dzienGry.js`, z dwóch
 * powodów. Ten numer zawija się co 30 dni (dzień 31 to znowu 1), więc jako
 * znacznik „czy to już inny dzień" kłamałby raz na miesiąc. I potrzebuje
 * obiektu gracza, którego ten moduł nie widzi. Sam `dzienPrzygody` porównuje
 * zresztą właśnie całe doby kalendarzowe — bierzemy więc to samo, tylko wprost.
 */
function dobaDzis(data = new Date()) {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export function postawEtap() {
  const s = czytaj();
  if (!s) return stanDrewna();
  s.zbudowane = true;
  s.etap = Math.max(1, s.etap + 1);
  // Zapamiętujemy DZIEŃ postawienia — od niego liczy się prawo do rozbudowy.
  s.dzienEtapu = dobaDzis();
  zapisz(s);
  return stanDrewna();
}

/**
 * CZY WOLNO ROZBUDOWAĆ DOMEK (decyzja właściciela 2026-09-16).
 *
 * Domek na drzewie ma trzy piętra opowieści: pomost, przytulny domek,
 * rozbudowany domek. Kolejne NIE mogą powstać tego samego dnia, co poprzednie —
 * i to nie jest sztuczne opóźnienie, tylko sedno tej gry. Nagrodą ma być
 * „wróciłem następnego dnia i świat czekał", a nie „wyklikałem trzy piętra
 * w jednej sesji". Trzy piętra w kwadrans to gra o zbieraniu; jedno piętro
 * dziennie to powód, żeby wrócić (`docs/OPIS_PROJEKTU.md`, o rytmie sesji).
 *
 * Drugi warunek — nowy materiał — sprawdza się sam: rozbudowa zaczyna się od
 * wyzerowania dostaw, więc `spelnione` znów jest fałszem, dopóki dziecko czegoś
 * nie przyniesie.
 *
 * @param {number} docelowo ile pięter ma docelowo domek (`ETAPY_DOCELOWO`)
 */
export function czyMoznaRozbudowac(docelowo = 3, data = new Date()) {
  const s = czytaj();
  if (!s || !s.zbudowane) return false;
  if (s.etap >= docelowo) return false;
  // Brak zapisanego dnia = zapis sprzed tej zmiany. Traktujemy go jak „dawno",
  // bo blokowanie rozbudowy za cudzy brak danych byłoby karą za aktualizację.
  if (!s.dzienEtapu) return true;
  return s.dzienEtapu !== dobaDzis(data);
}

export function skasujZadanieDrewna() {
  try { localStorage.removeItem(KLUCZ); } catch {}
  ogloszZmiane();
}
