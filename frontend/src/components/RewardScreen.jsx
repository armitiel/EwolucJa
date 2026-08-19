/**
 * RewardScreen — uniwersalny ekran celebracji nagrody.
 *
 * Używany wszędzie, gdzie w grze pojawia się „wygrana":
 *  - zadanie czarodzieja w świecie 3D (komplet gwiazdek)
 *  - po wysłaniu zadania w realu (MissionView)
 *  - po zatwierdzeniu zadania przez Mentora (HintPopup)
 *  - po ukończeniu minigry (Memory)
 *  - po quizie onboardingowym
 *
 * WYGLĄD IDZIE Z JEDNEGO ZESTAWU (`styles/nagroda.css`), a nie ze stylów
 * wpisanych w atrybuty. Wcześniej ten ekran malował się sam: własna kremowa
 * karta, własna obwódka i fioletowy przycisk — poprawnie, ale OBOK gry.
 * Teraz to ten sam pergamin, ta sama złota obwódka, ta sama fioletowa wstęga
 * i ten sam zielony przycisk co okna postaci w świecie.
 *
 * W atrybutach zostały wyłącznie animacje liczone z indeksu elementu
 * (konfetti, iskry, lot monet) — tych nie da się sensownie zapisać w CSS,
 * bo każdy kawałek ma inny tor, rozmiar i opóźnienie.
 *
 * JEDEN EKRAN NA KONIEC GRY. Minigry miały wcześniej dwa: ten (konfetti,
 * licznik monet, „Zobacz wynik") i zaraz pod nim własne podsumowanie z tym
 * SAMYM tytułem, tym samym zdaniem i tą samą liczbą monet, tylko bez
 * konfetti. Dziecko klikało przez to samo dwa razy. Dlatego doszły tu cztery
 * pola opisujące wynik — gwiazdki, kafelki statystyk, rozbicie nagrody
 * i akcje — żeby wszystko, co gra ma do powiedzenia, zmieściło się na jednym
 * ekranie. Wszystkie są opcjonalne, więc pozostałe cztery miejsca (zadanie
 * czarodzieja, MissionView, HintPopup, quiz) działają bez zmian.
 *
 * Props:
 *  - eyebrow: string   (nadtytuł na wstędze, np. "ZADANIE CZARODZIEJA")
 *  - title: string     (duży nagłówek)
 *  - subtitle?: string
 *  - coins: number     (liczba w animowanym liczniku)
 *  - gwiazdki?: number (0–3; podium z oceną partii)
 *  - kafelki?: [{ wartosc, etykieta }]      (ruchy, czas, pary…)
 *  - rozbicie?: [{ etykieta, monety }]      (skąd te monety: partia, Wizkor)
 *  - akcje?: [{ etykieta, onClick, ton }]   (zastępują pojedyncze CTA)
 *  - note?: string     (komentarz pod licznikiem)
 *  - noteStyle?: 'quote' | 'caption'
 *  - ctaLabel?: string
 *  - onDismiss: function
 *  - autoDismissMs?: number
 */
import React, { useEffect, useState } from "react";
import { Sparkle, Coin } from "./art.jsx";
import { fx } from "../services/soundFx.js";
import "../styles/nagroda.css";

const CONFETTI_COLORS = ["#FFD269", "#B886E8", "#7BC0E8", "#F08C8C", "#5FA76F", "#FFB347"];
const CONFETTI_PIECES = 32;
const SPARKLE_PIECES = 12;
const COIN_TALLY_MS = 1800;
const FLY_COINS_COUNT = 8;        // Ile monet leci do licznika w HUD-zie
const FLY_COIN_DURATION_MS = 900; // Czas pojedynczego lotu
const FLY_COIN_STAGGER_MS = 80;   // Odstep miedzy startami

/** Gwiazdka wektorem — ta sama, co na wstędze w oknie postaci. */
function Gwiazdka({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 1.6l3.1 6.4 7 1-5 4.9 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-4.9 7-1z" />
    </svg>
  );
}

export default function RewardScreen({
  eyebrow,
  title,
  subtitle,
  coins = 0,
  gwiazdki = null,
  kafelki = null,
  rozbicie = null,
  akcje = null,
  note,
  noteStyle = "caption",
  ctaLabel = "Dziękuję ✦",
  onDismiss,
  autoDismissMs,
}) {
  const [coinCount, setCoinCount] = useState(0);
  const [flyCoins, setFlyCoins] = useState(false);

  useEffect(() => {
    try { fx.gentleMagical(0.7); } catch {}
    try { fx.dopamine(0.6); } catch {}
    // Animowany licznik 0 → coins w 1,8 s
    const start = Date.now();
    const tick = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / COIN_TALLY_MS);
      setCoinCount(Math.round(coins * t));
      if (t >= 1) clearInterval(tick);
    }, 40);
    return () => clearInterval(tick);
  }, [coins]);

  // Po zakonczeniu animacji licznika -> wyslij monety do licznika w HUD-zie.
  // Sekwencja: licznik (1,8 s) -> lot monet (0,9 s + odstepy) -> "coinsLanded".
  useEffect(() => {
    if (!coins || coins <= 0) return;
    const startFly = setTimeout(() => setFlyCoins(true), COIN_TALLY_MS);
    const lastCoinArrival = COIN_TALLY_MS + FLY_COIN_DURATION_MS + (FLY_COINS_COUNT - 1) * FLY_COIN_STAGGER_MS;
    const emitLanded = setTimeout(() => {
      try {
        window.dispatchEvent(new CustomEvent("ewolucja:coinsLanded", { detail: { amount: coins } }));
      } catch {}
    }, lastCoinArrival);
    return () => { clearTimeout(startFly); clearTimeout(emitLanded); };
  }, [coins]);

  useEffect(() => {
    if (!autoDismissMs) return;
    const id = setTimeout(() => { try { onDismiss?.(); } catch {} }, autoDismissMs);
    return () => clearTimeout(id);
  }, [autoDismissMs, onDismiss]);

  return (
    <div className="nagroda" role="dialog" aria-live="polite">
      <div className="nagroda-zaslona" aria-hidden="true" />

      {/* Konfetti spadające w pętli */}
      <div className="nagroda-warstwa" aria-hidden="true">
        {Array.from({ length: CONFETTI_PIECES }).map((_, i) => {
          const left = (i * 137) % 100;
          const delay = (i % 12) * 0.15;
          const dur = 2.4 + (i % 5) * 0.4;
          const sz = 8 + (i % 4) * 3;
          const drift = -30 + ((i * 31) % 60);
          const rot = (i * 47) % 360;
          const shape = i % 3;
          const radius = shape === 0 ? "50%" : shape === 1 ? "3px" : "60% 0 60% 0";
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${left}%`, top: "-20px",
                width: sz, height: sz,
                background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                borderRadius: radius,
                transform: `rotate(${rot}deg)`,
                animation: `confetti-fall ${dur}s linear ${delay}s infinite`,
                ["--tx"]: `${drift}px`,
                opacity: 0.9,
              }}
            />
          );
        })}
      </div>

      {/* Wybuch iskier (jednorazowy) */}
      <div className="nagroda-warstwa" aria-hidden="true">
        {Array.from({ length: SPARKLE_PIECES }).map((_, i) => {
          const a = (i / SPARKLE_PIECES) * Math.PI * 2;
          const cx = 50 + Math.cos(a) * 22;
          const cy = 42 + Math.sin(a) * 16;
          return (
            <div
              key={`b${i}`}
              style={{
                position: "absolute",
                left: `${cx}%`, top: `${cy}%`,
                width: 14, height: 14,
                borderRadius: "60% 0 60% 0",
                background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                transform: `rotate(${i * 32}deg)`,
                animation: `petal-fly 1.6s cubic-bezier(.34,1.56,.64,1) ${i * 0.05}s both`,
              }}
            />
          );
        })}
      </div>

      <div className="nagroda-karta">
        {eyebrow ? (
          <p className="nagroda-wstega">
            <Gwiazdka className="nagroda-gwiazdka" />
            <span>{eyebrow}</span>
            <Gwiazdka className="nagroda-gwiazdka" />
          </p>
        ) : null}

        {/* Gwiazdki NAD tytułem: to jest ocena partii, a dziecko czyta ją
            obrazkiem szybciej niż zdaniem. Środkowa stoi wyżej — podium widać
            zanim się policzy sztuki. */}
        {typeof gwiazdki === "number" ? (
          <p className="nagroda-gwiazdki" aria-label={`${gwiazdki} z 3 gwiazdek`}>
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                src="/star.png"
                alt=""
                aria-hidden="true"
                className={`nagroda-gwiazda${i <= gwiazdki ? "" : " nagroda-gwiazda--pusta"}${i === 2 ? " nagroda-gwiazda--srodek" : ""}`}
              />
            ))}
          </p>
        ) : null}

        {title ? <h2 className="nagroda-tytul">{title}</h2> : null}
        {subtitle ? <p className="nagroda-podtytul">{subtitle}</p> : null}

        <p className="nagroda-pigulka">
          <Coin size={40} anim />
          <b>+{coinCount}</b>
          <span className="nagroda-iskra nagroda-iskra--gora" aria-hidden="true"><Sparkle size={24} /></span>
          <span className="nagroda-iskra nagroda-iskra--dol" aria-hidden="true"><Sparkle size={18} delay={0.4} /></span>
        </p>

        {/* Rozbicie pokazujemy TYLKO wtedy, gdy nagroda ma więcej niż jedno
            źródło. Przy samej partii linijka „za grę +11" pod liczbą +11
            byłaby powtórzeniem, a dziecko szukałoby w niej różnicy. */}
        {rozbicie && rozbicie.filter((r) => r && r.monety > 0).length > 1 ? (
          <ul className="nagroda-rozbicie">
            {rozbicie.filter((r) => r && r.monety > 0).map((r) => (
              <li key={r.etykieta}>
                <span>{r.etykieta}</span>
                <b>+{r.monety}</b>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="nagroda-przerywnik" aria-hidden="true">
          <Gwiazdka className="nagroda-iskierka" />
          <Gwiazdka className="nagroda-iskierka nagroda-iskierka--duza" />
          <Gwiazdka className="nagroda-iskierka" />
        </p>

        {/* Statystyki stoją POD nagrodą i są celowo mniejsze: to ciekawostka
            dla dziecka, które chce wiedzieć „w ile ruchów", a nie odpowiedź
            na pytanie „ile dostałem". */}
        {kafelki && kafelki.length ? (
          <div className="nagroda-kafelki">
            {kafelki.map((k) => (
              <div className="nagroda-kafel" key={k.etykieta}>
                <b>{k.wartosc}</b>
                <span>{k.etykieta}</span>
              </div>
            ))}
          </div>
        ) : null}

        {note ? (
          <p className={`nagroda-notka${noteStyle === "quote" ? " nagroda-notka--cytat" : ""}`}>
            {noteStyle === "quote" ? `„${note}"` : note}
          </p>
        ) : null}

        {akcje && akcje.length ? (
          <div className="nagroda-akcje">
            {akcje.map((a) => (
              <button
                key={a.etykieta}
                type="button"
                className={`hub-btn ${a.ton === "ghost" ? "hub-btn-ghost" : "hub-btn-primary"}`}
                onClick={a.onClick}
              >
                {a.etykieta}
              </button>
            ))}
          </div>
        ) : onDismiss ? (
          <button type="button" className="hub-btn hub-btn-primary nagroda-cta" onClick={onDismiss}>
            {ctaLabel}
          </button>
        ) : null}
      </div>

      {/* Monety lecą z miejsca pigułki do licznika w prawym górnym rogu.
          Tor, skala i opóźnienie liczą się z rozmiaru okna, więc te wartości
          muszą zostać w atrybutach — sama klatka `coin-fly` siedzi w CSS. */}
      {flyCoins && Array.from({ length: FLY_COINS_COUNT }).map((_, i) => {
        const targetX = window.innerWidth - 60;
        const targetY = 36;
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight * 0.42;
        return (
          <div
            key={`fly${i}`}
            aria-hidden="true"
            style={{
              position: "fixed",
              left: startX, top: startY,
              width: 24, height: 24,
              marginLeft: -12, marginTop: -12,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #FFE7B0 0%, #FFD269 50%, #E89A3D 100%)",
              boxShadow: "0 0 18px rgba(255,210,105,.9), inset 0 0 0 1.5px #B47322",
              animation: `coin-fly ${FLY_COIN_DURATION_MS}ms cubic-bezier(.45,.05,.55,.95) ${i * FLY_COIN_STAGGER_MS}ms forwards`,
              ["--tx"]: `${targetX - startX}px`,
              ["--ty"]: `${targetY - startY}px`,
              pointerEvents: "none",
              zIndex: 10001,
              opacity: 0,
            }}
          />
        );
      })}
    </div>
  );
}
