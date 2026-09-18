/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * ChmurkaAwatara — CICHY kanał: gra przypomina, co jest teraz do zrobienia.
 *
 * SAME IKONKI. Bez zdania, bez lektora, bez krzyżyka. To jest świadomy podział
 * ról między powiadomieniami w grze (`docs/design-system/powiadomienia.md`):
 *
 *   POSTAĆ MÓWI  — okno postaci i chmurka myśli Wizkora. Tekst i głos, rzadko,
 *                  zawsze z powodem. Dziecko ma przestać biegać i posłuchać.
 *   GRA PRZYPOMINA — to okno. Dwa obrazki przy awatarze, zmieniające się w
 *                  miejscu: „zrób TO z TYM". Nie przerywa zabawy, nie zabiera
 *                  głosu, schodzi samo.
 *   ŚWIAT POTWIERDZA — toast i liczniki.
 *
 * DLACZEGO BEZ TEKSTU. Kanał odzywa się często — po każdej zmianie etapu —
 * a wszystko, co często mówi zdaniem, dziecko po tygodniu przestaje czytać.
 * Para ikon czyta się jednym spojrzeniem w biegu i nie zajmuje ekranu.
 * Zdanie ma miejsce, w którym żyje: okno Wizkora przy zlecaniu zadania.
 *
 * DLACZEGO PRZY AWATARZE. Awatar jest jedynym punktem HUD-u, który mówi
 * „to jesteś ty" — i stoi w rogu, z dala od środka akcji. Dzióbek w jego
 * stronę robi z ikonek MYŚL DZIECKA („mam coś do zrobienia"), a nie kolejne
 * polecenie z zewnątrz.
 */
import React, { useEffect, useRef, useState } from "react";

/** Ile trzyma się jeden obrazek w parze (ms). */
const PRZEMIANA_MS = 1500;

function spokojnyRuch() {
  try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  catch { return false; }
}

export default function ChmurkaAwatara({ etap, onKoniec }) {
  const [spokojnie] = useState(spokojnyRuch);
  const [klatka, setKlatka] = useState(0);

  const id = etap?.id || null;
  const obrazki = etap?.obrazki || [];

  /* Przemiana obrazków. Przy `prefers-reduced-motion` zegar nie startuje —
     wtedy oba stoją obok siebie i mówią to samo bez ruchu. */
  useEffect(() => {
    if (!id || obrazki.length < 2 || spokojnie) return undefined;
    setKlatka(0);
    const zegar = window.setInterval(() => setKlatka((k) => (k + 1) % obrazki.length), PRZEMIANA_MS);
    return () => window.clearInterval(zegar);
  }, [id, obrazki.length, spokojnie]);

  /* Schodzi SAMA. Nie ma krzyżyka: nie ma czego zamykać, bo nic nie zasłania
     i nic nie czeka na decyzję. Dziecko, które tego nie zauważyło, zobaczy to
     przy następnej zmianie etapu. */
  /* `onKoniec` przychodzi jako nowa funkcja przy KAŻDYM renderze rodzica,
     a `Swiat` renderuje się przy każdej zebranej gwiazdce. W zależnościach
     restartowałoby to siedmiosekundowy zegar w nieskończoność — chmurka
     wisiałaby bez końca, a razem z nią zajęty slot w bramce. Ten sam chwyt,
     co w `ChmurkaZadania` (`koniecRef`). */
  const koniecRef = useRef(onKoniec);
  useEffect(() => { koniecRef.current = onKoniec; }, [onKoniec]);

  useEffect(() => {
    if (!id) return undefined;
    const zegar = window.setTimeout(() => koniecRef.current?.(), etap?.czasNaEkranie ?? 7000);
    return () => window.clearTimeout(zegar);
  }, [id, etap?.czasNaEkranie]);

  if (!id || !obrazki.length) return null;

  return (
    <div
      className={`chmurka-awatara${spokojnie ? " bez-ruchu" : ""}`}
      role="status"
      /* Dla czytnika ekranu i dla testów: nazwa etapu, choć na ekranie stoją
         same obrazki. To jedyne miejsce, gdzie ten tekst w ogóle istnieje. */
      aria-label={etap.tytul || "Co teraz"}
      data-testid="chmurka-awatara"
      data-etap={id}
    >
      <span className="chmurka-awatara-dziobek" aria-hidden="true" />
      <div className="chmurka-awatara-ikony">
        {obrazki.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            draggable="false"
            className={spokojnie || i === klatka ? "jest-widoczny" : ""}
          />
        ))}
      </div>
    </div>
  );
}
