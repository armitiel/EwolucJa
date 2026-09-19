/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * PasekKolejnejMisji — „Wizkor szykuje kolejne zadanie".
 *
 * PO CO TO ISTNIEJE. Między rozliczeniem jednej misji a zleceniem następnej
 * była cisza: ekran nagrody znikał i świat po prostu stał. Dziecko nie
 * wiedziało, czy to koniec, czy coś jeszcze będzie — a to jest dokładnie ten
 * moment, w którym ma poczuć „zaraz wydarzy się coś dalej". Pasek wypełnia tę
 * chwilę JEDNYM sygnałem: Wizkor pracuje, odliczanie widać, po nim wchodzi
 * okno z nowym zadaniem.
 *
 * DLACZEGO PASEK, A NIE ODLICZANIE. `docs/OPIS_PROJEKTU.md` zakazuje
 * odliczań budujących presję. Ten pasek NIE odlicza czasu dziecka — pokazuje
 * postęp czynności Wizkora. Nic się nie kończy, gdy się wypełni; przeciwnie,
 * coś się zaczyna. Nie ma go po czym „zdążyć" i nie da się przegrać.
 *
 * Wygląd wchodzi w rodzinę komunikatów (zielona pigułka ze złotą lamówką,
 * ta sama półka co toast), a po lewej stoi odznaka Wizkora — ta sama, która
 * wjeżdża z jego chmurką myśli. Odznaka NIE jest wpisana w maskę: ma własną
 * obręcz i wystaje ponad pigułkę, więc widać całą postać, a nie jej wycinek.
 */
import React, { useEffect, useRef, useState } from "react";
import "../styles/pasek-misji.css";
import { ODZNAKA_WIZKORA } from "./odznakaWizkora.js";

export default function PasekKolejnejMisji({
  otwarty,
  tytul = "Wizkor szykuje kolejne zadanie",
  /* ODZNAKA, NIE POPIERSIE. `wizPop.webp` to cała postać z laską — w kółku
     46 px trzeba ją było powiększyć do 185% i przyciąć, przez co z Wizkora
     zostawał kapelusz i pół brody. `wizkor_avatar.png` jest rysowany jako
     odznaka: twarz w złotej obręczy, czubek kapelusza i broda wychodzą poza
     krąg, tło przezroczyste. Tej samej używa chmurka myśli Wizkora, więc
     przeglądarka ma ją już w pamięci. */
  obrazek = ODZNAKA_WIZKORA,
  czas = 2600,
  onKoniec,
}) {
  const [pelny, setPelny] = useState(false);
  /* `onKoniec` przez ref: wołający przekazuje zwykle świeżą domknietą
     funkcję przy każdym renderze, a nie chcemy przez to restartować
     odliczania od zera. */
  const koniecRef = useRef(onKoniec);
  koniecRef.current = onKoniec;

  useEffect(() => {
    if (!otwarty) { setPelny(false); return undefined; }
    /* Klatka zwłoki przed startem: bez niej przeglądarka zdąży policzyć
       szerokość dopiero po ustawieniu 100% i przejście w ogóle nie rusza —
       pasek wskakuje pełny. */
    const start = window.setTimeout(() => setPelny(true), 40);
    const stop = window.setTimeout(() => koniecRef.current?.(), czas + 140);
    return () => { window.clearTimeout(start); window.clearTimeout(stop); };
  }, [otwarty, czas]);

  if (!otwarty) return null;

  return (
    <div className="pasek-misji" role="status" aria-live="polite">
      <span className="pasek-misji-portret" aria-hidden="true">
        <img src={obrazek} alt="" draggable="false" />
      </span>
      <span className="pasek-misji-tresc">
        <span className="pasek-misji-tytul">{tytul}</span>
        <span className="pasek-misji-tor">
          <span
            className="pasek-misji-wypelnienie"
            style={{ transitionDuration: `${czas}ms`, width: pelny ? "100%" : "0%" }}
          />
        </span>
      </span>
    </div>
  );
}
