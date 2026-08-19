/**
 * znakiMapy — zdejmowanie i stawianie znaków minigier w scenie 3D.
 *
 * PO CO. Gry mają być znaleziskiem, więc dopóki Wizkor nie zleci misji, jej
 * znaku po prostu NIE MA na mapie. A kiedy zleci — znak musi się pojawić OD
 * RAZU, bez wychodzenia ze świata: dziecko wychodzi z rozmowy prosto w las.
 * To wyklucza najprostsze rozwiązanie, czyli filtrowanie `mapa.json` przed
 * startem sceny — mapa czytana jest raz, przy montowaniu WebGL-a.
 *
 * JAK. Scena wystawia `ustawPowrotZnaku` i `pokazZnak`, ale nie ma publicznej
 * metody „schowaj natychmiast" (`schowajZnak` z klasy nie wchodzi do API, a i
 * tak gra animację wchłaniania — przy starcie świata wyglądałoby to jak
 * zbieranie znaków przez ducha). Zdjęcie znaku robimy więc na obiekcie znaku
 * wprost: stan „gone", zerowa faza, niewidoczny, powrót wyłączony.
 *
 * CENA. To jedyne miejsce, które sięga do wnętrza bundla (`_app.markers`).
 * Trzymam je w jednym pliku, żeby po podmianie sceny 3D było wiadomo, gdzie
 * szukać — i tylko po nazwach, które bundle zachowuje w kodzie: `markers`,
 * `id`, `state`, `phase`, `def.respawn`, `setVisible`. Wszystko jest
 * defensywne: gdy któregokolwiek zabraknie, funkcja zwraca `false` i świat
 * działa dalej — po prostu z widocznym znakiem, a nie z pustą mapą.
 */

/**
 * Oryginalne czasy powrotu, żeby dało się je oddać przy ujawnieniu znaku.
 *
 * DWIE liczby, nie jedna. Pętla sceny liczy próg powrotu jako
 * `powroty ? def.respawn : (def.respawnPierwszy ?? def.respawn)` — znak, który
 * nigdy jeszcze nie wrócił, patrzy więc na `respawnPierwszy`. Wygaszenie
 * samego `respawn` zostawiłoby taki znak z pierwszym powrotem po staremu
 * i po kilkunastu sekundach wstałby na mapie sam.
 */
const powrotOryginalny = new Map();

function markery(scena) {
  return scena?._app?.markers || [];
}

function znajdz(scena, znak) {
  return markery(scena).find((m) => m && m.id === znak) || null;
}

/** Czy scena jest już na tyle gotowa, żeby dało się ruszać znaki. */
export function znakiGotowe(scena) {
  return markery(scena).length > 0;
}

/**
 * Zdejmuje znak z mapy natychmiast i na stałe (do czasu `pokazZnakNaMapie`).
 * Bez animacji i bez dźwięku — to nie jest zebranie znaku, tylko jego brak.
 */
export function schowajZnakZMapy(scena, znak) {
  const m = znajdz(scena, znak);
  if (!m) return false;
  try {
    if (!powrotOryginalny.has(znak)) {
      powrotOryginalny.set(znak, {
        respawn: m.def?.respawn,
        respawnPierwszy: m.def?.respawnPierwszy,
      });
    }
    // Publiczne API tam, gdzie istnieje: `false` = „nie wracaj" (respawn ∞).
    if (typeof scena.ustawPowrotZnaku === "function") scena.ustawPowrotZnaku(znak, false);
    else if (m.def) m.def.respawn = Infinity;
    if (m.def && m.def.respawnPierwszy !== undefined) m.def.respawnPierwszy = Infinity;
    m.state = "gone";
    m.phase = 0;
    m.setVisible?.(false);
    return true;
  } catch (err) {
    console.warn("[znakiMapy] nie udało się schować znaku", znak, err);
    return false;
  }
}

/**
 * Stawia znak na mapie i przywraca mu normalny cykl powrotów. Wywołane na
 * znaku, który już stoi, nic nie psuje — `pokazZnak` reaguje tylko na stan
 * „gone".
 */
export function pokazZnakNaMapie(scena, znak) {
  const m = znajdz(scena, znak);
  if (!m) return false;
  try {
    const zapamietany = powrotOryginalny.get(znak);
    const powrot = zapamietany ? zapamietany.respawn : m.def?.respawn;
    const wartosc = Number.isFinite(powrot) ? powrot : 3.2;
    if (typeof scena.ustawPowrotZnaku === "function") scena.ustawPowrotZnaku(znak, wartosc);
    else if (m.def) m.def.respawn = wartosc;
    if (m.def && zapamietany && zapamietany.respawnPierwszy !== undefined) {
      m.def.respawnPierwszy = zapamietany.respawnPierwszy;
    }
    if (typeof scena.pokazZnak === "function") scena.pokazZnak(znak);
    else if (m.state === "gone") { m.state = "appear"; m.phase = 0; m.setVisible?.(true); }
    return true;
  } catch (err) {
    console.warn("[znakiMapy] nie udało się pokazać znaku", znak, err);
    return false;
  }
}

/**
 * Ustawia mapę pod bieżący stan misji: `widoczne` zostają, cała reszta
 * z `wszystkie` znika. Wołane po każdym „gotowa" sceny i po każdej zmianie
 * misji — jest idempotentne, więc powtórzenie nic nie kosztuje.
 */
export function zastosujZnaki(scena, wszystkie, widoczne) {
  if (!znakiGotowe(scena)) return false;
  const maBycWidoczny = new Set(widoczne || []);
  for (const znak of wszystkie || []) {
    if (maBycWidoczny.has(znak)) pokazZnakNaMapie(scena, znak);
    else schowajZnakZMapy(scena, znak);
  }
  return true;
}

/**
 * To samo, ale z ponawianiem. Zdarzenie „gotowa" mówi, że stoi bohater —
 * modele znaków potrafią dojechać ułamek sekundy później i wtedy nie ma czego
 * chować. Bez ponowienia dziecko zobaczyłoby na mapie znak gry, której Wizkor
 * jeszcze nie zlecił: błąd rzadki, za to dokładnie w miejscu, o które chodzi.
 *
 * `dajWidoczne` jest FUNKCJĄ, nie listą — ponowienie wypada nawet o kilka
 * sekund później, a w tym czasie stan misji mógł się zmienić. Lista policzona
 * z góry przywracałaby wtedy nieaktualną mapę.
 */
export function zastosujZnakiUparcie(scena, wszystkie, dajWidoczne, proby = 20, odstep = 200) {
  if (zastosujZnaki(scena, wszystkie, dajWidoczne())) return true;
  if (proby <= 0) return false;
  setTimeout(() => zastosujZnakiUparcie(scena, wszystkie, dajWidoczne, proby - 1, odstep), odstep);
  return false;
}

/**
 * Gdzie znak jest W TEJ CHWILI na ekranie (piksele okna) — punkt startu dla
 * lecących cząstek. `null`, gdy czegokolwiek brakuje; wołający ma wtedy
 * spaść na środek ekranu, a nie zrezygnować z animacji.
 *
 * Rzutowanie robi sama scena: `position.project(camera)` daje współrzędne
 * znormalizowane (-1..1), a płótno mówi, gdzie te -1..1 leżą na stronie.
 * Bohater jest blisko środka kadru, więc bez tej matematyki iskry startowałyby
 * mniej więcej dobrze — ale „mniej więcej" widać, gdy gwiazdka leży z boku.
 */
export function pozycjaNaEkranie(scena, znak) {
  try {
    const app = scena?._app;
    const m = znajdz(scena, znak);
    const pozycja = m?.root?.position;
    const kamera = app?.camera;
    const plotno = app?.canvas || app?.renderer?.domElement;
    if (!pozycja?.clone || !kamera || !plotno?.getBoundingClientRect) return null;

    const p = pozycja.clone();
    p.y += (m.def?.height ?? 1) * 0.5;          // środek modelu, nie jego stopa
    p.project(kamera);
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) return null;

    const r = plotno.getBoundingClientRect();
    return {
      x: r.left + ((p.x + 1) / 2) * r.width,
      y: r.top + ((1 - p.y) / 2) * r.height,
    };
  } catch {
    return null;
  }
}
