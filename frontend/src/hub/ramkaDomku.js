/**
 * ramkaDomku.js — RYSUNEK DNIA, KTÓRY WISI W DOMKU.
 *
 * O zachodzie Wizkor prosi o jedną rzecz z dzisiaj, narysowaną JEDNĄ LINIĄ —
 * bez odrywania palca, bez gumki, bez kolorów. To nie jest „narysuj ładnie",
 * tylko odcisk dnia. Rysunek wisi potem w ramce nad półką w domku na drzewie.
 *
 * DLACZEGO LINIA, A NIE ZDJĘCIE. Zdjęcia są wyłączone (`ZadaniePanel.jsx`,
 * `ZDJECIA_WLACZONE`), bo wgrywały się do publicznego magazynu z EXIF-em
 * i pozycją GPS — przy danych dzieci to nie jest ryzyko techniczne, tylko
 * prawne. Jedna linia to tablica kilkuset liczb: bez pliku, bez magazynu,
 * bez metadanych, bez twarzy. A w ramce i tak ląduje `CanvasTexture`, więc
 * kiedy tor obrazu stanie, zdjęcie wejdzie tym samym otworem — ramka nie
 * musi wiedzieć, czy dostała kreskę, czy fotografię.
 *
 * ZAPIS W `localStorage` + NA KONCIE: lokalna lista jest źródłem dla ramki,
 * a `services/swiatKonto.js` scala ją z `ramka.rysunki` z `/players/me/swiat`
 * (po dniu, nowszy wygrywa — jak `swiatService.js` na serwerze) i wysyła
 * po każdym `zapiszRysunek` (zdarzenie `ZDARZENIE_RYSUNKU`). Punkty są
 * ZNORMALIZOWANE do kwadratu 0–1, więc rysunek jest niezależny od rozmiaru
 * canvasu, na którym powstał, i od tego, na jakim zostanie namalowany.
 *
 * OBRAZ MISJI (tor W7): gdy Mentor wybrał „Pokaż w domku", ramka pokazuje
 * miniaturę zdjęcia zamiast kreski — `WnetrzeDomku.jsx` bierze ją z
 * `swiatKonto.pobierzObrazMisji()` i maluje na tym samym płótnie.
 */

const KLUCZ = "ewolucja.domek.ramka";

/** Zdarzenie okna po zapisie rysunku — nasłuchuje `services/swiatKonto.js`. */
export const ZDARZENIE_RYSUNKU = "ewolucja:rysunekDnia";

/* Tydzień rysunków. Dziś w ramce wisi najnowszy; reszta czeka na dzień, gdy
   domek dostanie drugą ścianę albo album. Więcej nie trzymamy — to jest
   pamięć przeglądarki, nie archiwum. */
const LIMIT = 7;

/** Górny limit punktów w linii — dość na kształt, za mało na portret. */
export const MAX_PUNKTOW = 240;

/** Minimalna długość linii (w ułamku boku), poniżej której to jeszcze nie rysunek. */
export const MIN_DLUGOSC = 0.12;

function odczytaj() {
  try {
    const s = JSON.parse(localStorage.getItem(KLUCZ) || "[]");
    return Array.isArray(s) ? s : [];
  } catch { return []; }
}

function zapisz(lista) {
  try { localStorage.setItem(KLUCZ, JSON.stringify(lista.slice(-LIMIT))); } catch {}
}

/** Klucz dnia kalendarzowego w czasie lokalnym — „raz na dzień" liczy się dla dziecka, nie dla UTC. */
export function kluczDnia(d = new Date()) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dz = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dz}`;
}

/** Wszystkie zapamiętane rysunki, od najstarszego. */
export function rysunki() { return odczytaj(); }

/**
 * Scala rysunki z konta z lokalnymi: jeden na dzień, nowszy (`kiedy`) wygrywa,
 * ostatnie LIMIT. Zapisuje lokalnie i zwraca scaloną listę.
 */
export function scalRysunki(zdalne) {
  const lokalne = odczytaj();
  if (!Array.isArray(zdalne) || !zdalne.length) return lokalne;
  const poDniu = new Map(lokalne.map((r) => [r.dzien, r]));
  for (const r of zdalne) {
    if (!r || typeof r.dzien !== "string" || !Array.isArray(r.punkty) || r.punkty.length < 2) continue;
    const juz = poDniu.get(r.dzien);
    if (!juz || String(r.kiedy || "") >= String(juz.kiedy || "")) {
      poDniu.set(r.dzien, { wersja: r.wersja || 1, dzien: r.dzien, kiedy: r.kiedy || `${r.dzien}T12:00:00.000Z`, punkty: r.punkty.slice(0, MAX_PUNKTOW), zrodlo: r.zrodlo || "zachod" });
    }
  }
  const lista = [...poDniu.values()].sort((a, b) => a.dzien.localeCompare(b.dzien));
  zapisz(lista);
  return lista.slice(-LIMIT);
}

/** Rysunek, który wisi w ramce (najnowszy) albo `null`. */
export function rysunekAktualny() {
  const l = odczytaj();
  return l.length ? l[l.length - 1] : null;
}

/** Czy dziś już coś powstało — Wizkor prosi raz na dzień. */
export function czyRysowalDzis(d = new Date()) {
  return odczytaj().some((r) => r.dzien === kluczDnia(d));
}

/**
 * Długość łamanej w jednostkach znormalizowanych (bok kwadratu = 1).
 * Służy do odrzucenia „kropki" — jedno dotknięcie to jeszcze nie linia.
 */
export function dlugoscLinii(punkty) {
  let d = 0;
  for (let i = 1; i < punkty.length; i++) {
    d += Math.hypot(punkty[i][0] - punkty[i - 1][0], punkty[i][1] - punkty[i - 1][1]);
  }
  return d;
}

/**
 * Piksele canvasu → kwadrat 0–1. Canvas panelu jest kwadratowy, więc
 * wystarczy jeden dzielnik; gdyby nie był, krótszy bok rządzi, a dłuższy
 * jest wyśrodkowany — rysunek nie ma się rozciągać przy zmianie ekranu.
 */
export function normalizujPunkty(punkty, szer, wys) {
  const bok = Math.min(szer, wys) || 1;
  const ox = (szer - bok) / 2, oy = (wys - bok) / 2;
  const out = [];
  for (const [x, y] of punkty) {
    out.push([
      +Math.max(0, Math.min(1, (x - ox) / bok)).toFixed(4),
      +Math.max(0, Math.min(1, (y - oy) / bok)).toFixed(4),
    ]);
  }
  return out;
}

/**
 * Zapisuje rysunek dnia. `punkty` już znormalizowane (0–1).
 * Drugi rysunek tego samego dnia ZASTĘPUJE pierwszy — dziecko może poprawić,
 * ale w ramce wisi jeden, bo ramka jest jedna.
 */
export function zapiszRysunek(punkty, meta = {}) {
  if (!Array.isArray(punkty) || punkty.length < 2) return null;
  const wpis = {
    wersja: 1,
    dzien: kluczDnia(),
    kiedy: new Date().toISOString(),
    punkty: punkty.slice(0, MAX_PUNKTOW),
    // co Wizkor zapowiedział przy prośbie — do rozmowy z Mentorem, nie na ekran
    zrodlo: meta.zrodlo || "zachod",
  };
  const lista = odczytaj().filter((r) => r.dzien !== wpis.dzien);
  lista.push(wpis);
  zapisz(lista);
  try { window.dispatchEvent(new CustomEvent(ZDARZENIE_RYSUNKU, { detail: wpis })); } catch {}
  return wpis;
}

/** Pulpit testowy — pusta ramka, żeby dało się przejść zachód od nowa. */
export function wyczyscRysunki() {
  try { localStorage.removeItem(KLUCZ); } catch {}
}

/**
 * MALUJE RYSUNEK NA CANVAS — jedna funkcja dla podglądu w panelu i dla
 * tekstury w ramce (`WnetrzeDomku.jsx`), żeby dziecko widziało w domku
 * dokładnie to, co narysowało, a nie „podobne".
 *
 * Tło to ciepły papier, kreska w kolorze atramentu z palety (`--p-ink`
 * = #4e4d76, jedyny „czarny" w tej grze). Bez tekstury ramka pokazuje pusty
 * papier — puste ma być widoczne, bo to jest zaproszenie, nie błąd.
 *
 * `canvas` musi być kwadratowy; `rysunek` może być `null`.
 */
export function namalujRysunek(canvas, rysunek, opcje = {}) {
  const ctx = canvas.getContext("2d");
  const B = canvas.width;
  const tlo = opcje.tlo || "#FBF1D6";
  const kreska = opcje.kreska || "#4e4d76";
  ctx.clearRect(0, 0, B, canvas.height);

  // papier z lekkim ściemnieniem przy brzegach — żeby nie był płaską plamą
  const g = ctx.createRadialGradient(B * .5, B * .5, B * .2, B * .5, B * .5, B * .75);
  g.addColorStop(0, tlo);
  g.addColorStop(1, opcje.tloBrzeg || "#F4E3B8");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, B, canvas.height);

  const P = rysunek?.punkty;
  if (!Array.isArray(P) || P.length < 2) return canvas;

  ctx.strokeStyle = kreska;
  ctx.lineWidth = Math.max(2, B * (opcje.grubosc ?? 0.022));
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(P[0][0] * B, P[0][1] * B);
  /* Łuki między punktami zamiast prostych: palec zostawia punkty co kilka
     pikseli i prosta łamana wygląda jak pod linijkę. Kwadratowy Bézier przez
     środki odcinków daje gładką kreskę bez żadnego dodatkowego zapisu. */
  for (let i = 1; i < P.length - 1; i++) {
    const mx = (P[i][0] + P[i + 1][0]) / 2 * B;
    const my = (P[i][1] + P[i + 1][1]) / 2 * B;
    ctx.quadraticCurveTo(P[i][0] * B, P[i][1] * B, mx, my);
  }
  const k = P[P.length - 1];
  ctx.lineTo(k[0] * B, k[1] * B);
  ctx.stroke();
  return canvas;
}
