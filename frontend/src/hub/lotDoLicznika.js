/**
 * lotDoLicznika — iskry lecące od połkniętego znaku do kafelka w HUD.
 *
 * PO CO. Gwiazdka znikała w trawie, a liczba w rogu ekranu podskakiwała sama.
 * To dwa osobne zdarzenia i dziecko musi je samo połączyć. Lot je zszywa:
 * widać, że TA gwiazdka poleciała TAM i dlatego licznik urósł.
 *
 * DLACZEGO POZA REACTEM. Cząstki żyją pół sekundy i ruszają się co klatkę.
 * Trzymane w stanie komponentu przerysowywałyby cały hub kilkanaście razy
 * w trakcie lotu — a pod spodem chodzi scena 3D, która potrzebuje każdej
 * klatki. Tutaj powstaje kilka elementów DOM, animuje je przeglądarka
 * (Web Animations API, czyli kompozytor), po locie znikają.
 *
 * GWARANCJA DOLOTU. `onDolot` woła się ZAWSZE — także wtedy, gdy animacja
 * nie ruszy (karta w tle wstrzymuje WAAPI, `prefers-reduced-motion`, brak
 * elementu docelowego). Licznik jest stanem gry, nie ozdobą; nie może zależeć
 * od tego, czy animacja doszła do końca.
 */

const ID_WARSTWY = "ewolucja-lot-warstwa";

/** Warstwa na cząstki: nad HUD-em (z-index 20), pod oknami i grami (60/70). */
function warstwa() {
  let el = document.getElementById(ID_WARSTWY);
  if (el) return el;
  el = document.createElement("div");
  el.id = ID_WARSTWY;
  el.setAttribute("aria-hidden", "true");
  el.style.cssText =
    "position:fixed;inset:0;z-index:30;pointer-events:none;overflow:hidden;contain:strict";
  document.body.appendChild(el);
  return el;
}

function skromnyRuch() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/** Środek elementu w pikselach okna — cel lotu. */
export function srodekElementu(el) {
  if (!el?.getBoundingClientRect) return null;
  const r = el.getBoundingClientRect();
  if (!r.width && !r.height) return null;      // element schowany
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/**
 * Krótkie podbicie kafelka — moment, w którym liczba się zmienia. Klasę
 * zdejmujemy po animacji, żeby kolejna gwiazdka mogła ją założyć od nowa
 * (ponowne dodanie tej samej klasy nie restartuje animacji CSS).
 */
export function podbijKafelek(el, klasa = "jest-podbite", czas = 460) {
  if (!el?.classList) return;
  el.classList.remove(klasa);
  // Wymuszenie przeliczenia stylu — bez tego przeglądarka skleja zdjęcie
  // i dodanie klasy w jednej klatce, więc animacja nie rusza po raz drugi.
  void el.offsetWidth;
  el.classList.add(klasa);
  window.setTimeout(() => el.classList.remove(klasa), czas);
}

/**
 * Lot cząstek `start` → `cel`.
 *
 * @param {{x:number,y:number}|null} start  punkt startu (px okna); brak = środek ekranu
 * @param {HTMLElement|{x:number,y:number}} cel  kafelek albo punkt
 * @param {() => void} onDolot  wywoływane RAZ, gdy pierwsza cząstka dolatuje
 */
export function lecDoLicznika({ start, cel, onDolot, obraz = "/star.png", ile = 7, czas = 620 }) {
  const meta = cel && cel.nodeType === 1 ? srodekElementu(cel) : cel || null;
  let dolecialo = false;
  const dolot = () => {
    if (dolecialo) return;
    dolecialo = true;
    try { onDolot?.(); } catch (err) { console.warn("[lotDoLicznika] onDolot", err); }
  };

  // Nie ma dokąd lecieć albo dziecko prosi o spokój — sam skutek, bez lotu.
  if (!meta || skromnyRuch() || typeof document === "undefined") {
    dolot();
    return () => {};
  }

  const od = start || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const host = warstwa();
  const czastki = [];

  for (let i = 0; i < ile; i += 1) {
    const rozmiar = 13 + Math.round(Math.random() * 13);
    const el = document.createElement("img");
    el.src = obraz;
    el.alt = "";
    el.draggable = false;
    el.style.cssText =
      `position:absolute;left:0;top:0;width:${rozmiar}px;height:${rozmiar}px;` +
      "will-change:transform,opacity;filter:drop-shadow(0 2px 3px rgba(80,45,10,.35))";
    host.appendChild(el);
    czastki.push(el);

    // Rozprysk najpierw NA ZEWNĄTRZ, dopiero potem lot do kafelka. Cząstki
    // lecące od razu po prostej wyglądają jak kursor, a nie jak coś, co
    // wystrzeliło z ziemi.
    const kat = (i / ile) * Math.PI * 2 + Math.random() * 0.7;
    const promien = 34 + Math.random() * 46;
    const rozprysk = {
      x: od.x + Math.cos(kat) * promien,
      y: od.y + Math.sin(kat) * promien * 0.72 - 18,
    };
    const obrot = (Math.random() * 2 - 1) * 220;
    const opoznienie = i * 34;

    const anim = el.animate(
      [
        { transform: `translate(${od.x - rozmiar / 2}px, ${od.y - rozmiar / 2}px) scale(.35) rotate(0deg)`, opacity: 0, offset: 0 },
        { transform: `translate(${rozprysk.x - rozmiar / 2}px, ${rozprysk.y - rozmiar / 2}px) scale(1) rotate(${obrot * 0.35}deg)`, opacity: 1, offset: 0.28 },
        { transform: `translate(${meta.x - rozmiar / 2}px, ${meta.y - rozmiar / 2}px) scale(.4) rotate(${obrot}deg)`, opacity: 0.95, offset: 1 },
      ],
      {
        duration: czas + Math.random() * 160,
        delay: opoznienie,
        // Wolno na rozprysku, szybko na dolocie — jak coś przyciąganego.
        easing: "cubic-bezier(.36,.03,.2,1)",
        fill: "forwards",
      }
    );
    // Licznik podskakuje na PIERWSZEJ cząstce, nie na ostatniej: ogon lotu
    // trwa jeszcze ćwierć sekundy i czekanie na niego czyta się jak zacięcie.
    if (i === 0) anim.onfinish = dolot;
    el._anim = anim;
  }

  // Bezpiecznik: karta w tle wstrzymuje animacje i `onfinish` nie przyjdzie
  // nigdy. Stan gry nie może na tym utknąć.
  const bezpiecznik = window.setTimeout(dolot, czas + 900);

  const sprzataj = window.setTimeout(() => {
    for (const el of czastki) { try { el._anim?.cancel(); } catch {} el.remove(); }
    if (!host.childElementCount) host.remove();
  }, czas + 1400);

  return () => {
    window.clearTimeout(bezpiecznik);
    window.clearTimeout(sprzataj);
    for (const el of czastki) { try { el._anim?.cancel(); } catch {} el.remove(); }
    dolot();
  };
}
