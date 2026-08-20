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
const KLUCZ_RYTUAL = "ewolucja.porady.rytual";
const KLUCZ_SLADY = "ewolucja.porady.slady";
const HISTORIA_MAX = 30;

/**
 * Trzy aktywności są małą biblioteką minigier, nie listą poleceń. Ilustracja
 * niesie wybór tak samo jak w zakładce Minigry, a tekst dopowiada tylko, co
 * wydarzy się po dotknięciu kafla.
 *
 * `zapowiedz` to zdanie, które LISEK mówi po wybraniu karty (`hub/glosLiska.js`).
 * Pisane pod UCHO, nie pod oko: bez cyfr i skrótów, bo „5 oddechów" czyta się
 * inaczej niż „pięć oddechów", a dziecko ma usłyszeć, na co się właśnie
 * zgodziło, zanim zacznie. Jedno zdanie o tym, CO TO ZA ĆWICZENIE, i drugie
 * krótkie — zaproszenie.
 */
export const KARTY_DNIA = [
  {
    id: "balon-spokoju",
    tytul: "Balon spokoju",
    opis: "5 oddechów z liskiem",
    akcja: "oddech",
    ilustracja: "/assets/porady/karta-oddech.png",
    zapowiedz: "Pięć wolnych oddechów. Nadmuchujemy balon i patrzymy, jak rośnie. Robimy to razem?",
    odzew: "Balon zabrał trochę pośpiechu. Widziałem, jak zwolniłeś.",
  },
  {
    id: "zielony-trop",
    tytul: "Zielony trop",
    opis: "Znajdź 5 zielonych rzeczy",
    akcja: "trop",
    ilustracja: "/assets/porady/karta-trop.png",
    zapowiedz: "Szukamy pięciu zielonych rzeczy dookoła siebie. Kto pierwszy zobaczy?",
    odzew: "Masz bystre oczy. Pięć zielonych śladów już świeci na mapie.",
  },
  {
    id: "strzasnij-napiecie",
    tytul: "Strząśnij napięcie",
    opis: "3 ruchy razem z liskiem",
    akcja: "ruch",
    ilustracja: "/assets/porady/karta-ruch.png",
    zapowiedz: "Trzy ruchy: łapki, barki i głowa. Strząsamy z siebie napięcie. Gotowy?",
    odzew: "Łapki, barki i głowa są już lżejsze. Dobra robota.",
  },
];

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

/** Kolejność kart obraca się codziennie, ale nie zmienia po odświeżeniu. */
export function kartyDnia(data = new Date()) {
  const dzien = kluczDnia(data);
  let h = 0;
  for (let i = 0; i < dzien.length; i += 1) h = (h * 31 + dzien.charCodeAt(i)) % 9973;
  const start = h % KARTY_DNIA.length;
  return [...KARTY_DNIA.slice(start), ...KARTY_DNIA.slice(0, start)];
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

function pustyRytual(data = new Date()) {
  return { dzien: kluczDnia(data), wybrana: null, ukonczona: null };
}

/** Wybór i wykonanie są rozdzielone: samo dotknięcie kafla niczego nie zalicza. */
export function czytajRytual(data = new Date()) {
  const dzien = kluczDnia(data);
  const zapis = czytaj(KLUCZ_RYTUAL, null);
  return zapis && zapis.dzien === dzien ? zapis : pustyRytual(data);
}

export function wybierzKarteDnia(id, data = new Date()) {
  const karta = KARTY_DNIA.find((x) => x.id === id);
  const stan = czytajRytual(data);
  if (!karta) return stan;
  // Wykonana wcześniej karta zostawia listek, ale nie zamyka całej zakładki.
  // Dziecko może wrócić do listy i uruchomić inną krótką aktywność tego dnia.
  const nowy = { ...stan, wybrana: id, ukonczona: null };
  pisz(KLUCZ_RYTUAL, nowy);
  return nowy;
}

export function anulujWyborKarty(data = new Date()) {
  const stan = czytajRytual(data);
  const nowy = { ...stan, wybrana: null, ukonczona: null };
  pisz(KLUCZ_RYTUAL, nowy);
  return nowy;
}

export function ukonczKarteDnia(id, data = new Date()) {
  const karta = KARTY_DNIA.find((x) => x.id === id);
  if (!karta) return czytajRytual(data);
  const dzien = kluczDnia(data);
  const nowy = { dzien, wybrana: id, ukonczona: id };
  pisz(KLUCZ_RYTUAL, nowy);

  const slady = czytajSlady().filter((x) => x.dzien !== dzien);
  pisz(KLUCZ_SLADY, [{ dzien, id }, ...slady].slice(0, 7));
  return nowy;
}

export function czytajSlady() {
  const slady = czytaj(KLUCZ_SLADY, []);
  return Array.isArray(slady) ? slady : [];
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
    localStorage.removeItem(KLUCZ_RYTUAL);
    localStorage.removeItem(KLUCZ_SLADY);
  } catch {}
}
