/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * edytorDomku — SUWAKI DO DRZEWA Z DOMKIEM, wprost w grającym świecie.
 *
 * PO CO TO ISTNIEJE. Liczby opisujące to drzewo (obrót pnia, wysokość desek,
 * miejsca kul liści) wyszły z rachunku na bryle modelu — i rachunek doprowadził
 * je do miejsca, w którym są „mniej więcej dobrze". Ostatnie dziesięć procent
 * robi oko, patrząc na planetę, z liskiem obok dla skali. Do tej pory oznaczało
 * to pętlę: zmień liczbę w `swiat.js` → zbuduj paczkę → podbij wersję sceny →
 * przeładuj → zapomnij, co się widziało minutę temu. Tutaj suwak rusza drzewem
 * w tej samej klatce.
 *
 * DLACZEGO W GRZE, A NIE W EDYTORZE MAPY. Edytor mapy ustawia, GDZIE co stoi na
 * planecie — rzut z góry. To drzewo trzeba oglądać z tej samej kamery, z której
 * patrzy dziecko, bo cały problem jest w tym, co która kula zasłania.
 *
 * ZAPIS IDZIE DO MAPY, nie do kodu. `mapa.schronienie.uklad` przykrywa wartości
 * domyślne (`ukladDomku` w `swiat.js`), więc ustawienie z suwaka zostaje
 * w projekcie i jedzie na produkcję razem z resztą świata. Zapisuje ta sama
 * końcówka `POST /__mapa`, z której korzysta edytor mapy — czyli tylko przy
 * `npm run dev`. Bez serwera deweloperskiego zostaje „Kopiuj JSON".
 *
 * PANEL SIEDZI W `document.body`, a nie w kontenerze sceny: kontener bywa
 * przycięty i przykryty HUD-em gry, a to narzędzie ma być widoczne zawsze.
 */

const KLASA = "edytor-domku";

/* Suwaki: [klucz, etykieta, min, max, krok]. Zakresy są CELOWO ciasne wokół
   wartości z modelu — szeroki suwak przy trzech pikselach myszy daje skok,
   po którym pomost ląduje w kosmosie i trzeba zaczynać od nowa. */
const POLA_PNIA = [
  ["obrotModelu", "obrót pnia", 0, 6.283, 0.005],
  ["skalaModelu", "skala modelu", 0.3, 1.2, 0.005],
  ["zanurzeniePnia", "zanurzenie w ziemi", 0, 1.0, 0.01],
  /* Przesunięcie w tych samych jednostkach, co kule liści — patrz `_ustawPien`
     w `app.js`. Zakres ±2 wystarcza z zapasem: dalej pień wychodzi poza własny
     cień i kolizję, które siedzą przy kotwicy. */
  ["pienX", "pień: x", -2, 2, 0.01],
  ["pienY", "pień: y (góra)", -1.5, 1.5, 0.01],
  ["pienZ", "pień: z", -2, 2, 0.01],
];
const POLA_POMOSTU = [
  ["poziom", "wysokość desek", 1.2, 4.0, 0.01],
  ["zasiegKonaru", "zasięg konaru", 0.8, 3.0, 0.01],
  ["pomostOd", "początek desek", 0.0, 1.5, 0.01],
  ["pomostPol", "pół szerokości", 0.25, 1.2, 0.01],
  ["klepiskoR", "klepisko: promień", 0.4, 2.5, 0.01],
  ["barierka", "wysokość barierki", 0.1, 1.2, 0.01],
  ["drabinkaOdsun", "odsunięcie drabinki", 0.1, 1.6, 0.01],
  ["drabinkaDlugosc", "długość drabinki", 0.6, 1.8, 0.01],
];
const POLA_DOMKU = [
  ["wysokoscScian", "wysokość ścian", 0.4, 1.8, 0.01],
  ["szerokoscDrzwi", "szerokość drzwi", 0.2, 1.2, 0.01],
  ["ganek", "głębokość ganku", 0.15, 1.2, 0.01],
];
/* Kula liści: [indeks w tablicy, etykieta, min, max]. */
const POLA_KULI = [
  [0, "x", -4, 4],
  [1, "y", 0, 6],
  [2, "z", -4, 4],
  [3, "r", 0.15, 1.6],
];

const STYL = `
.${KLASA}{position:fixed;top:12px;right:12px;width:330px;max-height:calc(100vh - 24px);
  overflow:auto;z-index:99999;background:#14181fee;color:#e8e3d8;border:1px solid #3a4250;
  border-radius:10px;font:12px/1.35 ui-monospace,Menlo,Consolas,monospace;
  box-shadow:0 10px 34px #0009;backdrop-filter:blur(3px)}
.${KLASA} header{display:flex;align-items:center;gap:8px;padding:8px 10px;
  border-bottom:1px solid #2b323d;position:sticky;top:0;background:#171c24f5}
.${KLASA} header b{flex:1;font-weight:600;letter-spacing:.02em}
.${KLASA} button{background:#2a3240;color:#e8e3d8;border:1px solid #3d4757;border-radius:6px;
  padding:4px 8px;cursor:pointer;font:inherit}
.${KLASA} button:hover{background:#36404f}
.${KLASA} button.glowny{background:#3d6b46;border-color:#4e8759}
.${KLASA} section{padding:8px 10px;border-bottom:1px solid #222831}
.${KLASA} h4{margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#8d9aad}
.${KLASA} .rzad{display:grid;grid-template-columns:96px 1fr 66px;gap:6px;align-items:center;margin:3px 0}
.${KLASA} .rzad span{color:#a9b4c4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px}
.${KLASA} input[type=range]{width:100%;accent-color:#6fa87c;min-width:0}
.${KLASA} input[type=number]{width:100%;box-sizing:border-box;background:#0f1319;color:#e8e3d8;
  border:1px solid #333c49;border-radius:4px;padding:2px 4px;font:inherit;text-align:right}
.${KLASA} .kula{border:1px solid #29303b;border-radius:7px;padding:6px;margin:6px 0;background:#0f141b}
.${KLASA} .kula .glowa{display:flex;align-items:center;gap:6px;margin-bottom:4px;color:#8d9aad}
.${KLASA} .kula .glowa b{flex:1;color:#c9d2e0;font-weight:600}
.${KLASA} footer{padding:8px 10px;display:flex;flex-wrap:wrap;gap:6px}
.${KLASA} .info{padding:0 10px 8px;color:#8d9aad;min-height:15px}
`;

/** Skrót na tworzenie elementów — bez tego ten plik to las `createElement`. */
function el(rodzic, tag, wlasciwosci = {}) {
  const e = Object.assign(document.createElement(tag), wlasciwosci);
  rodzic?.appendChild(e);
  return e;
}

/**
 * Suwak + pole liczbowe, zawsze zsynchronizowane.
 *
 * DWA WEJŚCIA NA JEDNĄ LICZBĘ, bo służą do czego innego: suwakiem się SZUKA
 * (widać zmianę w ruchu), a w polu WPISUJE się to, co się już wie — albo
 * odczytuje, żeby przepisać do kodu.
 */
function suwak(rodzic, etykieta, wartosc, { min, max, krok }, przy) {
  const rzad = el(rodzic, "div", { className: "rzad" });
  el(rzad, "span", { textContent: etykieta, title: etykieta });
  const s = el(rzad, "input", { type: "range", min, max, step: krok, value: wartosc });
  const l = el(rzad, "input", { type: "number", min, max, step: krok, value: Number(wartosc).toFixed(3) });
  const podaj = (v, zrodlo) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return;
    if (zrodlo !== s) s.value = String(n);
    if (zrodlo !== l) l.value = n.toFixed(3);
    przy(n);
  };
  s.addEventListener("input", () => podaj(s.value, s));
  l.addEventListener("input", () => podaj(l.value, l));
  return { ustaw: (v) => { s.value = String(v); l.value = Number(v).toFixed(3); } };
}

/**
 * Otwiera panel. Drugi raz wołany — zamyka (jeden przycisk włącza i wyłącza).
 *
 * @param {object} app  instancja sceny (`app.js`)
 * @returns {object|null} uchwyt z `zamknij()`
 */
export function otworzEdytorDomku(app) {
  if (!app) return null;
  if (app._edytorDomku) { app._edytorDomku.zamknij(); return null; }

  if (!document.getElementById(`${KLASA}-styl`)) {
    el(document.head, "style", { id: `${KLASA}-styl`, textContent: STYL });
  }

  const panel = el(document.body, "div", { className: KLASA });
  const naglowek = el(panel, "header");
  el(naglowek, "b", { textContent: "Drzewo z domkiem" });
  const zamknijBtn = el(naglowek, "button", { textContent: "✕", title: "zamknij" });
  const info = el(panel, "div", { className: "info" });

  const powiedz = (t) => { info.textContent = t; };

  /** Jedno miejsce, w które schodzą wszystkie zmiany. */
  const odswiez = () => {
    app.przebudujDomek();
    powiedz("zmienione — pamiętaj o „Zapisz do mapy”");
  };

  const u = app.ukladDomku?.() || {};

  /* ── PIEŃ ─────────────────────────────────────────────────────────────── */
  const sekPien = el(panel, "section");
  el(sekPien, "h4", { textContent: "Pień (model tree.glb)" });
  for (const [klucz, etykieta, min, max, krok] of POLA_PNIA) {
    suwak(sekPien, etykieta, u[klucz], { min, max, krok }, (v) => {
      u[klucz] = v;
      odswiez();
    });
  }

  /* ── POMOST ───────────────────────────────────────────────────────────── */
  const sekPomost = el(panel, "section");
  el(sekPomost, "h4", { textContent: "Pomost, barierka, drabinka" });
  const podpowiedz = el(sekPomost, "div", { className: "info", style: "padding:0 0 6px" });
  podpowiedz.textContent = "Widać dopiero, gdy domek jest zbudowany.";
  for (const [klucz, etykieta, min, max, krok] of POLA_POMOSTU) {
    suwak(sekPomost, etykieta, u[klucz], { min, max, krok }, (v) => {
      u[klucz] = v;
      odswiez();
    });
  }

  /* ── CHATKA ───────────────────────────────────────────────────────────── */
  const sekDomek = el(panel, "section");
  el(sekDomek, "h4", { textContent: "Chatka (bez drzewa)" });
  for (const [klucz, etykieta, min, max, krok] of POLA_DOMKU) {
    suwak(sekDomek, etykieta, u[klucz], { min, max, krok }, (v) => {
      u[klucz] = v;
      odswiez();
    });
  }

  /* ── KORONA ───────────────────────────────────────────────────────────── */
  const sekKorona = el(panel, "section");
  const glowaKorony = el(sekKorona, "h4", { textContent: "Kule liści" });
  const lista = el(sekKorona, "div");

  /* PRZERYSOWUJEMY CAŁĄ LISTĘ po dodaniu i skasowaniu kuli, a nie przy każdym
     ruchu suwaka: numery kul po skasowaniu środkowej i tak wszystkie się
     przesuwają, a przy suwaku liczy się płynność, nie porządek w DOM-ie. */
  const rysujKule = () => {
    lista.textContent = "";
    glowaKorony.textContent = `Kule liści (${u.korony.length})`;
    u.korony.forEach((kula, i) => {
      const box = el(lista, "div", { className: "kula" });
      const glowa = el(box, "div", { className: "glowa" });
      el(glowa, "b", { textContent: `kula ${i + 1}` });

      const jasna = el(glowa, "button", { textContent: kula[4] ? "jasna" : "ciemna" });
      jasna.addEventListener("click", () => {
        kula[4] = kula[4] ? 0 : 1;
        jasna.textContent = kula[4] ? "jasna" : "ciemna";
        odswiez();
      });

      const kopiuj = el(glowa, "button", { textContent: "＋", title: "zduplikuj" });
      kopiuj.addEventListener("click", () => {
        u.korony.splice(i + 1, 0, [kula[0] + 0.3, kula[1], kula[2] + 0.3, kula[3], kula[4]]);
        rysujKule();
        odswiez();
      });

      const usun = el(glowa, "button", { textContent: "✕", title: "usuń" });
      usun.addEventListener("click", () => {
        if (u.korony.length <= 1) { powiedz("ostatniej kuli nie usuwam"); return; }
        u.korony.splice(i, 1);
        rysujKule();
        odswiez();
      });

      for (const [idx, etykieta, min, max] of POLA_KULI) {
        suwak(box, etykieta, kula[idx], { min, max, krok: 0.01 }, (v) => {
          kula[idx] = v;
          odswiez();
        });
      }
    });
  };
  rysujKule();

  /* ── STOPKA ───────────────────────────────────────────────────────────── */
  const stopka = el(panel, "footer");

  /** Co trafia do mapy — bez `roznicaKotwic`, bo ta opisuje kod, nie wygląd. */
  const doZapisu = () => ({
    obrotModelu: +Number(u.obrotModelu).toFixed(4),
    skalaModelu: +Number(u.skalaModelu).toFixed(4),
    zanurzeniePnia: +Number(u.zanurzeniePnia).toFixed(3),
    klepiskoR: +Number(u.klepiskoR).toFixed(3),
    poziom: +Number(u.poziom).toFixed(3),
    zasiegKonaru: +Number(u.zasiegKonaru).toFixed(3),
    pomostOd: +Number(u.pomostOd).toFixed(3),
    pomostPol: +Number(u.pomostPol).toFixed(3),
    pienX: +Number(u.pienX || 0).toFixed(3),
    pienY: +Number(u.pienY || 0).toFixed(3),
    pienZ: +Number(u.pienZ || 0).toFixed(3),
    barierka: +Number(u.barierka).toFixed(3),
    drabinkaOdsun: +Number(u.drabinkaOdsun).toFixed(3),
    drabinkaDlugosc: +Number(u.drabinkaDlugosc ?? 1).toFixed(3),
    wysokoscScian: +Number(u.wysokoscScian ?? 0.62).toFixed(3),
    szerokoscDrzwi: +Number(u.szerokoscDrzwi ?? 0.44).toFixed(3),
    ganek: +Number(u.ganek ?? 0.34).toFixed(3),
    korony: u.korony.map((k) => [
      +Number(k[0]).toFixed(3), +Number(k[1]).toFixed(3), +Number(k[2]).toFixed(3),
      +Number(k[3]).toFixed(3), k[4] ? 1 : 0,
    ]),
  });

  const zapisz = el(stopka, "button", { className: "glowny", textContent: "Zapisz do mapy" });
  zapisz.addEventListener("click", async () => {
    const surowa = app.mapa?.surowa;
    if (!surowa || !surowa.schronienie) { powiedz("mapa nie ma wpisu `schronienie`"); return; }
    surowa.schronienie.uklad = doZapisu();
    /* NAZWA PLIKU NIE JEST ZGADYWANA. Światów jest kilka, każdy w swoim pliku;
       stronę ustawia `Scena3D.jsx` i ona zostawia tu nazwę. Bez niej wolę
       nie zapisać niż zapisać nie ten świat. */
    const sciezka = globalThis.__SCENA3D_PLIK_MAPY || "";
    const plik = sciezka.split("/").pop();
    if (!plik) { powiedz("nie wiem, do którego pliku mapy zapisać"); return; }
    try {
      const odp = await fetch(`/__mapa?plik=${encodeURIComponent(plik)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(surowa),
      });
      const dane = await odp.json();
      powiedz(dane.ok ? `zapisane → ${dane.plik}` : `błąd zapisu: ${dane.blad}`);
    } catch {
      powiedz("zapis działa tylko przy npm run dev — użyj „Kopiuj JSON”");
    }
  });

  const kopiuj = el(stopka, "button", { textContent: "Kopiuj JSON" });
  kopiuj.addEventListener("click", async () => {
    const tekst = JSON.stringify(doZapisu(), null, 2);
    try {
      await navigator.clipboard.writeText(tekst);
      powiedz("JSON w schowku");
    } catch {
      console.log("[edytor domku] uklad:\n" + tekst);
      powiedz("schowek niedostępny — JSON jest w konsoli");
    }
  });

  const domyslne = el(stopka, "button", { textContent: "Domyślne" });
  domyslne.addEventListener("click", () => {
    /* Domyślne = to, co jest w kodzie, czyli świat bez wpisu w mapie.
       Kasujemy `uklad` i budujemy układ od zera tą samą drogą, co przy starcie. */
    if (app.mapa?.surowa?.schronienie) delete app.mapa.surowa.schronienie.uklad;
    if (app.mapa?.schronienie) delete app.mapa.schronienie.uklad;
    const czysty = app.przebudujDomek(ukladZDomyslnych(app));
    if (czysty) { Object.assign(u, czysty); u.korony = czysty.korony; }
    odbuduj();
    powiedz("wrócone do wartości z kodu (mapa wyczyszczona — zapisz, żeby zostało)");
  });

  el(stopka, "button", { textContent: "Zamknij" }).addEventListener("click", () => uchwyt.zamknij());
  zamknijBtn.addEventListener("click", () => uchwyt.zamknij());

  /** Przerysowuje wszystkie kontrolki z bieżącego układu (po „Domyślne”). */
  function odbuduj() {
    uchwyt.zamknij();
    otworzEdytorDomku(app);
  }

  const uchwyt = {
    zamknij() {
      panel.remove();
      if (app._edytorDomku === uchwyt) app._edytorDomku = null;
    },
  };
  app._edytorDomku = uchwyt;
  powiedz("suwak rusza drzewem od razu");
  return uchwyt;
}

/**
 * Wartości domyślne jako świeży obiekt. Scena trzyma je w `swiat.js`, ale
 * import tamtego modułu tutaj wciągnąłby pół świata do narzędzia, które ma być
 * lekkie — więc pytamy o nie scenę, która i tak je ma.
 */
function ukladZDomyslnych(app) {
  return app.ukladDomkuDomyslny?.() || null;
}
