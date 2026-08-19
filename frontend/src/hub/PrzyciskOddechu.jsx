/**
 * PrzyciskOddechu — wejście w oddech, stojące na wierzchu przy zegarze.
 *
 * Wcześniej oddech był jedną z trzech losowanych drobnostek. Losowanie ma sens
 * przy rzeczach wymiennych, ale nie przy tej jednej, po którą dziecko ma
 * sięgać samo: skoro ma być nawykiem, musi być ZAWSZE w tym samym miejscu.
 *
 * Animacja wciśnięcia jest tu robotą, nie ozdobą. Przycisk jest duży, okrągły
 * i lekko wraca do góry po puszczeniu — ma się chcieć w niego stukać, bo
 * pierwsze wejście w oddech bierze się z ciekawości, a nie z potrzeby.
 */
import React, { useRef, useState } from "react";

export default function PrzyciskOddechu({ onStart }) {
  const [klik, setKlik] = useState(false);
  const czasomierz = useRef(null);

  function nacisnij() {
    setKlik(true);
    window.clearTimeout(czasomierz.current);
    // Ekran otwiera się PO odbiciu przycisku - inaczej animacja ginie pod
    // nakładką i dziecko nie widzi, że jego dotknięcie cokolwiek zrobiło.
    czasomierz.current = window.setTimeout(() => {
      setKlik(false);
      onStart?.();
    }, 260);
  }

  return (
    <div className="kacik-oddech">
      <button
        type="button"
        className={`oddech-guzik${klik ? " jest-klik" : ""}`}
        onClick={nacisnij}
        aria-label="Zacznij oddychać"
      >
        <img src="/assets/porady/przycisk-oddech.png" alt="" aria-hidden="true" draggable="false" />
      </button>
      <span className="kacik-tytul">Oddech</span>
    </div>
  );
}
