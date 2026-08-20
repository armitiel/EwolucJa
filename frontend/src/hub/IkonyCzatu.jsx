/**
 * IkonyCzatu — trzy ikony kanałów czatu, rysowane w kodzie (SVG), nie emoji.
 *
 * PO CO WŁASNE, SKORO BYŁY EMOJI. Emoji renderuje system: 🏕️ na Androidzie,
 * iOS i Windowsie to trzy różne obrazki, w trzech różnych stylach i o trzech
 * różnych wagach kreski. W nagłówku, gdzie stoją obok siebie, było widać, że
 * to zbieranina, a nie komplet. SVG rysuje się wszędzie tak samo i bierze
 * kolor z `currentColor`, więc na złotej zakładce jest ciemne, a na fioletowym
 * pasku kremowe — bez drugiego zestawu plików.
 *
 * JĘZYK ZNAKU: liczy się LICZBA DYMKÓW, bo to ona mówi, z kim się rozmawia.
 *   Forum     — trzy dymki (wielu naraz)
 *   Prywatne  — dwa dymki zwrócone do siebie (jeden na jeden)
 *   Mentor    — jeden dymek z głową nad nim (konkretna, dorosła osoba)
 * Kształty są obłe i pełne, bez konturów — tak jak reszta świata
 * (claymorphism), i czytelne przy 26 px, bo tyle mają w zakładce.
 */
import React from "react";

/** Forum — trzy dymki: dwa z tyłu, jeden z przodu z ogonkiem. */
function Forum() {
  return (
    <g fill="currentColor">
      <rect x="1.5" y="3" width="16" height="11.5" rx="5" opacity=".38" />
      <rect x="14.5" y="2" width="16" height="11.5" rx="5" opacity=".38" />
      <path d="M8.5 12.5h15a5.5 5.5 0 0 1 5.5 5.5v3.5a5.5 5.5 0 0 1-5.5 5.5H16l-5.2 3.4a.9.9 0 0 1-1.4-.8V27h-.9A5.5 5.5 0 0 1 3 21.5V18a5.5 5.5 0 0 1 5.5-5.5Z" />
    </g>
  );
}

/** Prywatne — dwa dymki naprzeciw siebie. Drugi jaśniejszy: to odpowiedź. */
function Prywatne() {
  return (
    <g fill="currentColor">
      <path d="M6.5 2h13A5.5 5.5 0 0 1 25 7.5v2A5.5 5.5 0 0 1 19.5 15h-7l-4.1 3.1a.9.9 0 0 1-1.4-.7V15h-.5A5.5 5.5 0 0 1 1 9.5v-2A5.5 5.5 0 0 1 6.5 2Z" />
      <path d="M25.5 16h-12A5.5 5.5 0 0 0 8 21.5v1A5.5 5.5 0 0 0 13.5 28h6l4.1 3.1a.9.9 0 0 0 1.4-.7V28h.5a5.5 5.5 0 0 0 5.5-5.5v-1a5.5 5.5 0 0 0-5.5-5.5Z" opacity=".45" />
    </g>
  );
}

/**
 * Mentor — dymek z głową. Rozważaliśmy spiczastą czapkę, ale przy 26 px
 * czytała się jak stożek na pudełku, a do tego myliła Mentora z Wizkorem;
 * postaci z gry w czacie NIE MA i ikona nie może tego podważać.
 */
function Mentor() {
  return (
    <g fill="currentColor">
      <circle cx="16" cy="6.6" r="4.9" opacity=".6" />
      <path d="M6.5 13h19a4.6 4.6 0 0 1 4.6 4.6v4.6a4.6 4.6 0 0 1-4.6 4.6H17l-5.1 3.4a.9.9 0 0 1-1.4-.8v-2.6H6.5A4.6 4.6 0 0 1 1.9 22.2v-4.6A4.6 4.6 0 0 1 6.5 13Z" />
    </g>
  );
}

const RYSUNKI = { forum: Forum, prywatne: Prywatne, mentor: Mentor };

export default function IkonaKanalu({ kanal, size = 26 }) {
  const Rysunek = RYSUNKI[kanal];
  if (!Rysunek) return null;
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" focusable="false">
      <Rysunek />
    </svg>
  );
}
