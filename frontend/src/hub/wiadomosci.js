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
