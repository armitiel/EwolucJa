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
  const swiat = listNotifications().map((wpis) => ({
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
        ikona: "/assets/hub-nav/profil-simple.png",
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
const STATUS_ZADANIA = {
  offered: { etykieta: "Do zrobienia", cta: "Otwórz zadanie" },
  changes: { etykieta: "Mentor prosi o poprawkę", cta: "Popraw zadanie" },
  sent: { etykieta: "U Mentora", cta: "Sprawdź, czy wrócił" },
  accepted: { etykieta: "Nagroda czeka", cta: "Odbierz nagrodę" },
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
    to: nextStep?.to?.startsWith("/przygoda") ? nextStep.to : "/przygoda/zadanie",
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
 * Wpis od Mentora, który wrócił z werdyktem, jest osobną wieścią — tu
 * pokazujemy sam stan zadania, żeby nie liczyć tego samego dwa razy.
 */
export function wpisZadaniaWizkora() {
  const stan = stanZadaniaWizkora();
  if (!stan.istnieje || stan.wyplacone) return null;
  return {
    klucz: "zadanie-wizkora",
    zrodlo: "zadanie-wizkora",
    id: stan.id,
    tytul: stan.def.tytul,
    tresc: stan.def.cel,
    jak: stan.def.jak || null,
    notatka: stan.notatka || null,
    kiedy: stan.zleconeAt,
    etykieta: stan.etykieta,
    cta: stan.cta,
    // Do zrobienia albo do odebrania = coś czeka. „U Mentora" nie pali
    // plakietki: dziecko nie ma wtedy nic do zrobienia i ponaglanie go
    // byłoby tylko hałasem.
    nieprzeczytana: stan.doZrobienia || stan.doOdbioru,
    przypieta: true,
    to: "/swiat?panel=zadanie",
    autor: null,
    ikona: "/wizPop.webp",
  };
}

/** Ile pozycji ma się doliczyć do plakietki na zakładce wiadomości. */
export function nieprzeczytaneZadaniaWizkora() {
  return wpisZadaniaWizkora()?.nieprzeczytana ? 1 : 0;
}
