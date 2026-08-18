/**
 * poradaDnia — która karteczka wisi dziś na tablicy i co się z nią stało.
 *
 * Cała pamięć siedzi w localStorage, bo porady nie mają nic wspólnego z kontem:
 * to jest tablica korkowa w pokoju dziecka, a nie zapis postępu. Zmiana
 * urządzenia zaczyna od czysta i nic przez to nie ginie.
 *
 * Wybór jest DETERMINISTYCZNY w obrębie dnia — odświeżenie ekranu nie działa
 * jak losowanie nagrody. Ten sam dzień daje tę samą karteczkę, dopóki dziecko
 * jej nie zdejmie.
 */
import PORADY from "./data/porady.v1.json";

const KLUCZ_DZIS = "ewolucja.porady.dzis";
const KLUCZ_HISTORIA = "ewolucja.porady.historia";
const HISTORIA_MAX = 30;

/** Pory dnia w kolejności doby. Godziny są brzegami przedziałów [od, do). */
export const PORY = [
  { id: "rano", nazwa: "Rano", od: 5, do: 11 },
  { id: "poludnie", nazwa: "Południe", od: 11, do: 15 },
  { id: "popoludnie", nazwa: "Popołudnie", od: 15, do: 19 },
  { id: "wieczor", nazwa: "Wieczór", od: 19, do: 22 },
  { id: "noc", nazwa: "Noc", od: 22, do: 5 },
];

export function poraDnia(data = new Date()) {
  const g = data.getHours();
  return (
    PORY.find((p) => (p.od < p.do ? g >= p.od && g < p.do : g >= p.od || g < p.do)) || PORY[0]
  );
}

function kluczDnia(data = new Date()) {
  // Lokalna data, nie ISO w UTC: o 23:30 czasu polskiego ISO pokazuje już
  // jutro, więc karteczka zmieniałaby się dziecku w środku wieczoru.
  return `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`;
}

function czytaj(klucz, zapas) {
  try {
    const s = localStorage.getItem(klucz);
    return s ? JSON.parse(s) : zapas;
  } catch {
    return zapas;
  }
}

function pisz(klucz, wartosc) {
  try {
    localStorage.setItem(klucz, JSON.stringify(wartosc));
  } catch {}
}

/** Porady pasujące do pory dnia; z podziałem na dwie półki. */
export function poradyNaPore(poraId) {
  const wszystkie = PORADY.porady || [];
  const zPory = wszystkie.filter((p) => p.pora === poraId);
  const pula = zPory.length ? zPory : wszystkie;
  return {
    zdrowie: pula.filter((p) => p.typ === "zdrowie"),
    samopoczucie: pula.filter((p) => p.typ === "samopoczucie"),
  };
}

/**
 * Karteczka na dziś. `null`, gdy dziecko już ją zdjęło — wtedy panel pokazuje
 * zegar i półki z poradami, a nie pustą ramkę po karteczce.
 */
export function poradaDnia(data = new Date()) {
  const dzien = kluczDnia(data);
  const zapis = czytaj(KLUCZ_DZIS, null);
  if (zapis && zapis.dzien === dzien) {
    if (zapis.akcja) return null;             // zdjęta: kciukiem albo krzyżykiem
    return (PORADY.porady || []).find((p) => p.id === zapis.id) || null;
  }

  // Nowy dzień: losujemy z puli pasującej do pory, w której dziecko pierwszy
  // raz dziś zajrzało. Kto wchodzi rano, dostaje poranną.
  const { zdrowie, samopoczucie } = poradyNaPore(poraDnia(data).id);
  const pula = [...zdrowie, ...samopoczucie];
  if (!pula.length) return null;

  let h = 0;
  for (let i = 0; i < dzien.length; i += 1) h = (h * 31 + dzien.charCodeAt(i)) % 9973;
  const wybrana = pula[h % pula.length];
  pisz(KLUCZ_DZIS, { dzien, id: wybrana.id, akcja: null });
  return wybrana;
}

/**
 * Zdjęcie karteczki. `akcja` to „wzieta" (zielony kciuk) albo „odlozona"
 * (krzyżyk) — obie kończą dzień tak samo, różnią się tylko wpisem w historii.
 * Nic nie jest nigdzie liczone i nic nie przepada: odłożenie to nie jest porażka.
 */
export function zdejmijPorade(porada, akcja, data = new Date()) {
  if (!porada) return czytajHistorie();
  const dzien = kluczDnia(data);
  pisz(KLUCZ_DZIS, { dzien, id: porada.id, akcja });

  const historia = czytajHistorie();
  const wpis = { id: porada.id, tekst: porada.tekst, typ: porada.typ, akcja, dzien };
  const bezDuplikatu = historia.filter((h) => !(h.id === porada.id && h.dzien === dzien));
  const nowa = [wpis, ...bezDuplikatu].slice(0, HISTORIA_MAX);
  pisz(KLUCZ_HISTORIA, nowa);
  return nowa;
}

export function czytajHistorie() {
  const h = czytaj(KLUCZ_HISTORIA, []);
  return Array.isArray(h) ? h : [];
}

/** Uchwyt do konsoli — czekanie do jutra na sprawdzenie karteczki byłoby absurdem. */
export function zresetujPorade() {
  try {
    localStorage.removeItem(KLUCZ_DZIS);
    localStorage.removeItem(KLUCZ_HISTORIA);
  } catch {}
}
