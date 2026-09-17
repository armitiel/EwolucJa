/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * wiadomosci — jedna skrzynka na dwa strumienie, które do niedawna żyły osobno:
 * powiadomienia świata (`adventure/engine/notifications.js`, localStorage) i
 * wiadomości Mentora (`api.getAllHints`, baza).
 *
 * Reguła utrzymana z poprzednich wersji: nic nie wyskakuje, nic nie ponagla,
 * brak konsekwencji za nieprzeczytanie. Brak sieci nie może wygasić skrzynki —
 * strumień świata jest offline'owy i zostaje widoczny.
 */
import { listNotifications, markRead } from "../adventure/engine/notifications.js";
import { api, session } from "../services/api.js";
import { stanZadania as stanZadaniaWizkora } from "./zadanieWizkora.js";
import { odmienDlaGracza } from "../services/rodzaj.js";

const ETYKIETY_MENTORA = { hint: "Podpowiedź", artifact: "Artefakt", message: "Wiadomość" };

function czasMs(wartosc) {
  const ms = new Date(wartosc || 0).getTime();
  return Number.isNaN(ms) ? 0 : ms;
}

/** „2 godz." / „wczoraj" / „12 sie" — krótko, w skali dziecka, nie w ISO. */
export function kiedyTekst(wartosc) {
  const ms = czasMs(wartosc);
  if (!ms) return "";
  const minuty = Math.floor((Date.now() - ms) / 60000);
  if (minuty < 1) return "przed chwilą";
  if (minuty < 60) return `${minuty} min`;
  const godziny = Math.floor(minuty / 60);
  if (godziny < 24) return `${godziny} godz.`;
  if (godziny < 48) return "wczoraj";
  return new Date(ms).toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
}

export async function zbierzWiadomosci() {
  const swiat = listNotifications()
    /* Wieści „Mentor przyjął Twoje zadanie" już nie powstają (patrz
       zadanieWizkora.js) — przypięta karta mówi wtedy to samo dwa centymetry
       wyżej. Filtr zdejmuje z listy także wpisy zapisane PRZED tą zmianą,
       które inaczej wisiałyby w zwoju do końca świata. */
    .filter((wpis) => !String(wpis.id || "").startsWith("zadanie-wizkora:"))
    .map((wpis) => ({
    klucz: `swiat-${wpis.id}`,
    zrodlo: "swiat",
    id: wpis.id,
    tytul: wpis.title,
    tresc: wpis.body,
    kiedy: wpis.at,
    nieprzeczytana: !wpis.read,
    to: wpis.to,
    autor: null,
    ikona: "/assets/hub-nav/iskra.png",
  }));

  let mentor = [];
  const pid = session.getPlayer();
  if (pid) {
    try {
      const dane = await api.getAllHints(pid);
      mentor = (dane?.hints || []).map((wpis) => ({
        klucz: `mentor-${wpis.id}`,
        zrodlo: "mentor",
        id: wpis.id,
        tytul: wpis.title || ETYKIETY_MENTORA[wpis.kind] || "Wiadomość od Mentora",
        tresc: wpis.body,
        kiedy: wpis.sent_at,
        nieprzeczytana: !wpis.viewed_at,
        to: null,
        autor: wpis.mentor_name || null,
        ikona: "/assets/hub-nav/iskra.png",
      }));
    } catch (err) {
      console.warn("[wiadomosci] getAllHints nie odpowiedział:", err);
    }
  }

  return [...swiat, ...mentor].sort((a, b) => czasMs(b.kiedy) - czasMs(a.kiedy));
}

export async function oznaczPrzeczytana(pozycja) {
  // Wpisy przypięte (zadania) nie są wieściami do odebrania — ich „nieprzeczytane"
  // znaczy „jest co zrobić" i gaśnie dopiero, gdy dziecko to zrobi. Bez tego
  // wyjścia rozwinięcie zadania w zwoju leciałoby do `markHintViewed`
  // z identyfikatorem, którego baza nie zna.
  if (pozycja.przypieta || pozycja.zrodlo === "zadanie-wizkora") return;
  if (pozycja.zrodlo === "swiat") {
    markRead(pozycja.id);
    return;
  }
  const pid = session.getPlayer();
  if (!pid) return;
  try { await api.markHintViewed(pid, pozycja.id); }
  catch (err) { console.warn("[wiadomosci] markHintViewed nie odpowiedział:", err); }
}


/**
 * Zadanie w realu jako wpis skrzynki.
 *
 * Misja żyje w Plecaku, ale dziecko zagląda do wiadomości — i tam ma znaleźć
 * to, co faktycznie ma dziś zrobić poza ekranem. Wpis jest PRZYPIĘTY na górze
 * i nigdy nie oznacza się jako przeczytany: to nie jest wieść, którą się
 * odbiera, tylko zadanie, które trwa aż je skończysz.
 */
/* Tor `/przygoda` jest wyłączony (`POKAZ_MISJE_PRZYGODY`), ale etykiety
   trzymamy w jednym słownictwie z torem Wizkora (06 §4.7): bez „poprawki",
   „u Mentora" i „nagrody" — Mentor zauważa, nie ocenia. */
const STATUS_ZADANIA = {
  offered: { etykieta: "Czeka — u ciebie", cta: "Otwórz zadanie" },
  changes: { etykieta: "Ślad zostawiony", cta: "Zobacz" },
  sent: { etykieta: "Ślad zostawiony", cta: "Zobacz" },
  accepted: { etykieta: "Mentor to widzi", cta: "Zobacz, co się zmieniło" },
};

export function wpisZadania(adventure, state, nextStep) {
  const aktywna = state?.activeMission;
  if (!aktywna) return null;
  const misja = adventure?.missions?.[aktywna.ref];
  if (!misja) return null;

  const status = STATUS_ZADANIA[aktywna.status] || STATUS_ZADANIA.offered;
  return {
    klucz: "zadanie",
    zrodlo: "zadanie",
    id: aktywna.missionId || aktywna.ref,
    tytul: misja.title,
    tresc: misja.goal,
    jak: misja.how || null,
    przyklad: misja.example || null,
    notatka: aktywna.note || null,
    kiedy: aktywna.offeredAt,
    etykieta: status.etykieta,
    cta: status.cta,
    nieprzeczytana: false,
    przypieta: true,
    to: nextStep?.to || "/swiat",
    autor: null,
    ikona: "/plecak.png",
  };
}


/**
 * Zadanie od Wizkora do zrobienia POZA ekranem — jako wpis skrzynki.
 *
 * Różni się od wpisu przygody jedną rzeczą i to jest cała decyzja: dopóki jest
 * co zrobić, wpis liczy się jako NIEPRZECZYTANY. Dzięki temu na zakładce
 * wiadomości pali się „1" i dziecko widzi, że coś na nie czeka, nawet jeśli
 * rozmowę z Wizkorem zamknęło pięć minut temu i zdążyło o niej zapomnieć.
 * Zauważenie przez Mentora NIE MA osobnej wieści — widać je tu, w tej samej
 * karcie („Mentor {zobaczył|zobaczyła}"), więc jedno zdarzenie to jeden wpis
 * i jedna jedynka na plakietce. Monet na karcie nie ma (idą w tle przy śladzie).
 */
export function wpisZadaniaWizkora() {
  const stan = stanZadaniaWizkora();
  if (!stan.istnieje || stan.wyplacone) return null;
  const szept = stan.def.szept || null;
  const tresc = szept && stan.def.cel.endsWith(szept)
    ? stan.def.cel.slice(0, -szept.length).trim()
    : stan.def.cel;
  /* Tokeny `{m|ż}` odmieniamy przy składaniu wpisu — zwój dostaje gotowe
     zdania (tytuł, treść, szept, „jak", etykieta), a nie klamry. Odcięcie
     szeptu od celu robimy PRZED odmianą, bo oba pola stoją w danych w tej
     samej, jeszcze nieodmienionej formie. */
  return {
    klucz: "zadanie-wizkora",
    zrodlo: "zadanie-wizkora",
    id: stan.id,
    tytul: odmienDlaGracza(stan.def.tytul),
    tresc: odmienDlaGracza(tresc),
    szept: odmienDlaGracza(szept),
    jak: odmienDlaGracza(stan.def.jak) || null,
    notatka: odmienDlaGracza(stan.notatka) || null,
    kiedy: stan.zleconeAt,
    etykieta: odmienDlaGracza(stan.etykieta),
    cta: odmienDlaGracza(stan.cta),
    // Monety NIE idą na kartę (06 §4.6: cichy licznik w HUD, zero w tekstach).
    nagroda: null,
    // Czeka u ciebie albo Mentor zobaczył = coś czeka. „Ślad zostawiony" nie
    // pali plakietki: dziecko nie ma wtedy nic do zrobienia i ponaglanie go
    // byłoby tylko hałasem.
    nieprzeczytana: stan.doZrobienia || stan.doOdbioru,
    przypieta: true,
    to: "/swiat?panel=zadanie",
    autor: null,
    // Gdy odpowiedz jest sprawdzana, wpis w zwoju pokazuje Wizkora z lupa nad
    // zwojem — ten sam obrazek, ktory dziecko zobaczy po otwarciu panelu.
    // Stan widac wiec juz na liscie, bez czytania plakietki.
    ikona: stan.czeka ? "/wizSprawdza.webp" : "/wizPop.webp",
  };
}

/** Ile pozycji ma się doliczyć do plakietki na zakładce wiadomości. */
export function nieprzeczytaneZadaniaWizkora() {
  return wpisZadaniaWizkora()?.nieprzeczytana ? 1 : 0;
}
