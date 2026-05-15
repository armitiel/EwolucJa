import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, session } from "../services/api.js";
import { ttsPlayer } from "../services/ttsPlayer";
import NarratorVoice from "../components/NarratorVoice.jsx";
import PageShell from "../components/PageShell.jsx";
import { Avatar, Sparkle, Coin, CoinPill } from "../components/art.jsx";
import ProfileAvatar, { PROFILE_INFO } from "../components/ProfileAvatar.jsx";
import StarBurst from "../components/StarBurst.jsx";
import { fx } from "../services/soundFx.js";

// Mapowanie starych nazw archetypow z bazy/configu na nowe kody profili
const LEGACY_TO_PROFILE = {
  tropiciel_tajemnic: "DT", zaklinacz_uczuc: "EM", mistrz_map: "ST",
  tkacz_snow: "KR", gwardzista_odwagi: "LD", straznik_mostu: "MD",
};
// Opisy + taglines dla 6 profili (zastepuje stara mape ARCHETYPES)
const PROFILE_LORE = {
  DT: { tagline: "Nic nie umknie Twojej uwadze.", description: "Cicho stąpasz przez świat i widzisz to, czego inni nie zauważają. Rozwijasz dociekliwość, uważność i sztukę zadawania pytań.", artifact: "Kompas Cieni" },
  EM: { tagline: "Twoje serce widzi to, czego oczy nie widzą.", description: "Czujesz emocje innych jak ciepło słońca. Rozwijasz empatię, wrażliwość i łagodność.", artifact: "Muszla Echa" },
  ST: { tagline: "Trzy kroki do przodu, zawsze.", description: "Rozpisujesz świat w mapy i strategie. Rozwijasz logikę, planowanie i samokontrolę.", artifact: "Kompas Strategiczny" },
  KR: { tagline: "Robisz z kartonu kosmiczny statek.", description: "Z prostych elementów tworzysz nieprawdopodobne historie. Rozwijasz myślenie nieszablonowe i ekspresję.", artifact: "Atrament Kronikarski" },
  LD: { tagline: "Idziesz pierwszy, nie z pychy — z troski.", description: "Pociągasz innych za sobą, bo widzą w Tobie odwagę i ciepło. Rozwijasz inicjatywę i troskę o innych.", artifact: "Tarcza Słońca" },
  MD: { tagline: "Łączysz dwie strony, gdy nikt inny nie może.", description: "Słuchasz obu głosów i znajdujesz wspólny punkt. Rozwijasz mediację i empatyczną komunikację.", artifact: "Wstęga Łączeń" },
};
function profileCodeFrom(v) {
  if (!v) return null;
  if (PROFILE_INFO[v]) return v;
  return LEGACY_TO_PROFILE[v] || null;
}

// Krotkie teksty przejsciowe miedzy odpowiedzia a kolejnym pytaniem.
// Indeksowane po numerze pytania DO KTOREGO przechodzimy (1 -> 4).
const TRANSITIONS = [
  "",                                          // przed pyt. 1 (nieuzywane — tam jest intro)
  "Dobrze… słyszę cię. A teraz powiedz mi…",   // przed pyt. 2
  "Hmm, to ciekawe. Pomyśl chwilę nad tym…",   // przed pyt. 3
  "Czuję, że zaczynam cię już rozumieć. Jeszcze jedno…", // przed pyt. 4
  "Ostatnie pytanie. Skup się jeszcze na chwilę…",       // przed pyt. 5
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState("name");
  const [name, setName] = useState("");
  const [playerId, setPlayerId] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [questionIdx, setQuestionIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Czy lektor skonczyl mowic (intro lub przejscie) — dopiero wtedy pokazujemy odpowiedzi.
  // Przy 1. pytaniu blokuje wszystko do konca intro. Przy kolejnych — do konca przejscia.
  const [narrationDone, setNarrationDone] = useState(false);
  // Animowane potwierdzenie wyboru — id zaznaczonej odpowiedzi, delay przed przejsciem.
  const [pickedAnswerId, setPickedAnswerId] = useState(null);

  useEffect(() => {
    if (step === "quiz" && !quiz) {
      api.getQuiz().then(setQuiz).catch((e) => setError(e.message));
    }
  }, [step, quiz]);

  async function handleStart(e) {
    e.preventDefault();
    if (!name.trim()) return;
    ttsPlayer.unlock();
    setLoading(true);
    setError(null);
    try {
      const player = await api.createPlayer(name.trim());
      session.setPlayer(player.player_id);
      setPlayerId(player.player_id);
      setStep("quiz");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(qid, aid) {
    if (pickedAnswerId) return; // chrona przed double-clickiem
    setPickedAnswerId(aid);
    // Sygnal dzwiekowy + zlote gwiazdki natychmiast po wyborze (user gesture - autoplay OK)
    fx.gentleMagical(0.6);
    // Maly delay (1100ms) zeby uzytkownik zauwazyl efekty zanim przejdzie dalej
    setTimeout(() => {
      setAnswers((prev) => ({ ...prev, [qid]: aid }));
      if (quiz && questionIdx < quiz.questions.length - 1) {
        setNarrationDone(false);
        setQuestionIdx((i) => i + 1);
        setPickedAnswerId(null);
      } else {
        submitQuiz({ ...answers, [qid]: aid });
      }
    }, 1100);
  }

  async function submitQuiz(finalAnswers) {
    setLoading(true);
    try {
      const payload = Object.entries(finalAnswers).map(([q, a]) => ({ question_id: q, answer_id: a }));
      const res = await api.submitQuiz(playerId, payload);
      setResult(res);
      setStep("result");
      try { await api.generateMission(playerId); } catch {}
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const totalSteps = 1 + (quiz?.questions?.length || 5) + 1;
  const currentStepIdx = step === "name" ? 0 : step === "quiz" ? 1 + questionIdx : totalSteps - 1;

  return (
    <PageShell>
      <div className="topbar" style={{ position: "relative", zIndex: 1 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/")}>‹ Wróć</button>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === currentStepIdx ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i <= currentStepIdx ? "var(--p-magic-dk)" : "rgba(78,77,118,.20)",
                  transition: "all .25s",
                }}
              />
            ))}
          </div>
          {step === "quiz" && quiz && (
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, color: "var(--p-magic-dk)", whiteSpace: "nowrap" }}>
              {questionIdx + 1} / {quiz.questions.length}
            </span>
          )}
        </div>
      </div>

      <div className="screen-scroll" style={{ flex: 1, padding: "16px 18px 48px" }}>
        {step === "name" && (
          <form onSubmit={handleStart} className="pop-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <h1 className="t-display" style={{ fontSize: 34, margin: "8px 0 4px", color: "var(--p-ink)", lineHeight: 1.18, letterSpacing: "-0.3px" }}>
              Witaj w Zakątku&nbsp;Gamma
            </h1>
            <p className="t-hand" style={{ margin: "4px 0 8px", fontSize: 20, color: "var(--p-ink-soft)", lineHeight: 1.5 }}>
              Zanim wyruszymy — powiedz, jak się nazywasz?
            </p>

            <div style={{ position: "relative", marginTop: 6 }}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={16}
                autoFocus
                style={{
                  width: "100%",
                  fontSize: 24,
                  fontFamily: "var(--font-display, 'Fredoka'), sans-serif",
                  fontWeight: 700,
                  padding: "18px 20px",
                  border: "2.5px solid var(--p-magic-dk)",
                  borderRadius: 18,
                  background: "rgba(255,255,255,.85)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: -10,
                  left: 18,
                  background: "var(--p-magic-dk)",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "2px 10px",
                  borderRadius: 6,
                  letterSpacing: 1,
                }}
              >
                TWOJE IMIĘ
              </span>
            </div>

            <button type="submit" className="btn btn-magic btn-block" disabled={loading || !name.trim()}>
              {loading ? "Otwieram bramę…" : "Dalej →"}
            </button>

            <NarratorVoice
              text="Witaj w Zakątku Gamma… Zanim ruszymy w tę przygodę — powiedz mi, jak masz na imię?"
              land="dolina_selfie"
              tone="warm"
              speed={0.95}
              pauseBefore={500}
              inlinePauses
              autoPlayDelay={1200}
              autoPlay
            />

            {error && <p style={{ color: "#B85B47" }}>{error}</p>}
          </form>
        )}

        {step === "quiz" && quiz && (
          <div className="pop-in" key={questionIdx} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Czarodziej-narrator (wiz2) — duzy podczas intro 1. pytania, mniejszy przy kolejnych (2x wzgledem poprzedniej wersji) */}
            <div className="pop-in" style={{ display: "flex", justifyContent: "center", padding: "8px 0 4px", position: "relative" }}>
              <div style={{ position: "relative", animation: "float-slow 4s ease-in-out infinite" }}>
                <img
                  src="/wizard.png"
                  alt="Strażniczka Zakątka"
                  style={{
                    width: questionIdx === 0 && !narrationDone ? 180 : 120,
                    maxWidth: "60vw",
                    height: "auto",
                    objectFit: "contain",
                    filter: "drop-shadow(0 10px 18px rgba(80,40,140,.35))",
                    transition: "width 0.5s ease",
                  }}
                />
                <div style={{ position: "absolute", top: 4, right: -8 }}><Sparkle size={24} /></div>
                <div style={{ position: "absolute", bottom: 22, left: -14 }}><Sparkle size={18} delay={0.5} /></div>
                {questionIdx === 0 && !narrationDone && (
                  <div style={{ position: "absolute", top: 60, left: -18 }}><Sparkle size={14} delay={1} /></div>
                )}
              </div>
            </div>

            <h2 className="t-display" style={{ fontSize: 26, lineHeight: 1.2, margin: 0, textAlign: "center" }}>
              {quiz.questions[questionIdx].question}
            </h2>

            {/* Kontrolka lektora — wysrodkowana pod pytaniem */}
            <div style={{ display: "flex", justifyContent: "center", margin: "4px 0 8px" }}>
              {questionIdx === 0 ? (
                <NarratorVoice
                  text={`Cześć. Bardzo się cieszę, że tu jesteś. Zakątek Gamma właśnie otwiera przed tobą swoje bramy… Czeka cię tu mnóstwo radości, gier i zupełnie nowych, tajemniczych miejsc do zbadania. Żeby ta podróż była dla ciebie jak najciekawsza — warto na samym początku sprawdzić, jaka niezwykła siła w tobie drzemie. Dlatego przygotowałam dla ciebie kilka prostych pytań. Dzięki twoim szczerym odpowiedziom dowiesz się, z jakim magicznym opiekunem wyruszycie w drogę. Może to będzie wspierający Empata… a może bystra Strateżka? Twój nowy przyjaciel poprowadzi cię przez wszystkie wyzwania i pokaże ci świat, w którym nauka jest najfajniejszą zabawą. Zaufaj sobie… i zobaczmy, od czego zacznie się twoja historia. A teraz… ${quiz.questions[0].question}`}
                  land="las_decyzji"
                  tone="warm"
                  speed={0.92}
                  pauseBefore={500}
                  inlinePauses
                  autoPlay
                  onEnd={() => setNarrationDone(true)}
                />
              ) : (
                <NarratorVoice
                  text={`${TRANSITIONS[questionIdx] || ""} ${quiz.questions[questionIdx].question}`.trim()}
                  land="las_decyzji"
                  tone="calm"
                  speed={0.94}
                  pauseBefore={300}
                  inlinePauses
                  autoPlay
                  onEnd={() => setNarrationDone(true)}
                />
              )}
            </div>

            {/* Odpowiedzi — pojawiaja sie dopiero po skonczeniu narracji, z animacja fade-up */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                opacity: narrationDone ? 1 : 0,
                transform: narrationDone ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                pointerEvents: narrationDone ? "auto" : "none",
              }}
            >
              {quiz.questions[questionIdx].answers.map((a, idx) => {
                const isPicked = pickedAnswerId === a.answer_id;
                const isDimmed = pickedAnswerId && !isPicked;
                return (
                  <button
                    key={a.answer_id}
                    className="card card-tight"
                    onClick={() => selectAnswer(quiz.questions[questionIdx].question_id, a.answer_id)}
                    disabled={loading || !narrationDone || !!pickedAnswerId}
                    style={{
                      border: "none",
                      cursor: narrationDone && !pickedAnswerId ? "pointer" : "default",
                      textAlign: "left",
                      padding: "14px 16px",
                      fontSize: 15,
                      fontFamily: "var(--font-body, 'Nunito'), sans-serif",
                      fontWeight: 600,
                      color: isPicked ? "#fff" : "var(--p-ink)",
                      background: isPicked
                        ? "linear-gradient(180deg, #C8A0F0 0%, #7A4DC2 100%)"
                        : undefined,
                      boxShadow: isPicked
                        ? "0 0 0 4px rgba(184,134,232,.35), 0 8px 24px rgba(122,77,194,.45), 0 3px 0 #4A2D80"
                        : undefined,
                      transform: !narrationDone
                        ? "translateY(8px)"
                        : isPicked
                        ? "scale(1.02)"
                        : isDimmed
                        ? "scale(0.97)"
                        : "translateY(0)",
                      opacity: !narrationDone ? 0 : isDimmed ? 0.45 : 1,
                      filter: isDimmed ? "grayscale(.3)" : "none",
                      transition: !narrationDone
                        ? `opacity 0.4s ease ${idx * 0.08}s, transform 0.4s ease ${idx * 0.08}s`
                        : "opacity 0.35s ease, transform 0.35s cubic-bezier(.34,1.56,.64,1), background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease, filter 0.3s ease",
                      position: "relative",
                      overflow: isPicked ? "visible" : "hidden",
                    }}
                  >
                    {a.text}
                    {/* Zlote gwiazdki - eksplozja przy wyborze */}
                    {isPicked && <StarBurst count={10} duration={950} />}
                    {/* Pulsujace halo wokol zaznaczonej */}
                    {isPicked && (
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          inset: -2,
                          borderRadius: "inherit",
                          pointerEvents: "none",
                          boxShadow: "0 0 0 0 rgba(184,134,232,.6)",
                          animation: "pulse-ring 0.9s ease-out forwards",
                        }}
                      />
                    )}
                    {/* Checkmark po prawej */}
                    {isPicked && (
                      <span
                        style={{
                          position: "absolute",
                          right: 14,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontWeight: 900,
                          color: "var(--p-magic-dk)",
                          animation: "coin-bump .5s cubic-bezier(.34,1.56,.64,1) both",
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}

              {!narrationDone && (
                <p style={{ opacity: 0.55, fontSize: 13, textAlign: "center", margin: "8px 0 0", fontStyle: "italic" }}>
                  Posłuchaj uważnie… za chwilę pojawią się odpowiedzi.
                </p>
              )}
            </div>
          </div>
        )}

        {step === "result" && result && (
          <CelebrationThenArchetype result={result} onEnter={() => navigate("/world")} />
        )}
      </div>
    </PageShell>
  );
}

function ArchetypeReveal({ result, onEnter }) {
  // Backend zwraca teraz 'profile' jako kod (EM/ST/...). Fallback na 'archetype' (stara nazwa, mapujemy).
  const profileCode = profileCodeFrom(result.profile || result.archetype) || "DT";
  const info = PROFILE_INFO[profileCode];
  const lore = PROFILE_LORE[profileCode];
  const revealText = `Kronika rozpoznała Cię jako: ${info.name}. ${lore.tagline}`;
  return (
    <div className="pop-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <p style={{ opacity: 0.65, fontSize: 12, fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>
        KRONIKA ROZPOZNAŁA CIĘ JAKO…
      </p>

      <div style={{ position: "relative", filter: `drop-shadow(0 12px 24px ${info.glow})` }}>
        <ProfileAvatar profile={profileCode} size={160} />
        <div style={{ position: "absolute", top: -6, right: -10 }}>
          <Sparkle size={22} />
        </div>
        <div style={{ position: "absolute", bottom: 10, left: -16 }}>
          <Sparkle size={16} delay={0.5} />
        </div>
      </div>

      <h2 className="t-display" style={{ fontSize: 32, margin: "4px 0 0", textAlign: "center", color: info.color }}>
        {info.name}
      </h2>
      <p className="t-hand" style={{ fontSize: 20, color: "var(--p-ink-soft)", margin: 0, textAlign: "center", maxWidth: 320 }}>
        {lore.tagline}
      </p>

      <div className="card card-paper" style={{ width: "100%", maxWidth: 380 }}>
        <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, color: "var(--p-ink-soft)" }}>
          {lore.description}
        </p>
        <p style={{ marginTop: 10, fontSize: 13 }}>
          Pierwszy artefakt w plecaku: <strong>{lore.artifact}</strong>
        </p>
      </div>

      <NarratorVoice text={revealText} land="gora_podsumowania" tone="celebration" pauseBefore={600} inlinePauses autoPlay />

      <button className="btn btn-magic btn-block" style={{ maxWidth: 380 }} onClick={onEnter}>
        Wyrusz w drogę ✦
      </button>
    </div>
  );
}

// ─── Ekran nagrody po quizie — najpierw burst + monety, potem ArchetypeReveal ───
function CelebrationThenArchetype({ result, onEnter }) {
  const [phase, setPhase] = useState("burst"); // burst -> archetype
  const [coinCount, setCoinCount] = useState(0);
  const REWARD = 50;
  // Trzymamy ten ekran ~6.5s, by gracz nasycil sie nagroda zanim trafi do ArchetypeReveal.
  const DWELL_MS = 6500;

  useEffect(() => {
    if (phase !== "burst") return;
    // Animowany licznik monet 0 -> 50 w 1.8s
    const start = Date.now();
    const duration = 1800;
    const tick = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / duration);
      setCoinCount(Math.round(REWARD * t));
      if (t >= 1) clearInterval(tick);
    }, 40);
    // Auto-przejscie do ArchetypeReveal, jesli gracz nie klinkie sam
    const t1 = setTimeout(() => setPhase("archetype"), DWELL_MS);
    return () => {
      clearInterval(tick);
      clearTimeout(t1);
    };
  }, [phase]);

  if (phase === "archetype") {
    return <ArchetypeReveal result={result} onEnter={onEnter} />;
  }

  // Konfetti — 3 rodzaje czastek na losowych pozycjach z roznymi animacjami.
  const colors = ["#FFD269", "#B886E8", "#7BC0E8", "#F08C8C", "#5FA76F", "#FFB347"];
  const PIECES = 36;
  return (
    <div
      className="pop-in"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        padding: "60px 0 20px",
        position: "relative",
        minHeight: 560,
        overflow: "hidden",
      }}
    >
      {/* WARSTWA KONFETTI — pętla 3.2s, kazdy element rusza losowo */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {Array.from({ length: PIECES }).map((_, i) => {
          const left = (i * 137) % 100; // pseudo-losowe equal spread
          const delay = (i % 12) * 0.15;
          const dur = 2.4 + (i % 5) * 0.4;
          const sz = 8 + (i % 4) * 3;
          const drift = -30 + ((i * 31) % 60);
          const rot = (i * 47) % 360;
          const color = colors[i % colors.length];
          const shape = i % 3; // 0=koło 1=kwadrat 2=płatek
          const radius = shape === 0 ? "50%" : shape === 1 ? "3px" : "60% 0 60% 0";
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${left}%`,
                top: "-20px",
                width: sz,
                height: sz,
                background: color,
                borderRadius: radius,
                transform: `rotate(${rot}deg)`,
                animation: `confetti-fall ${dur}s linear ${delay}s infinite`,
                ["--tx"]: `${drift}px`,
                opacity: 0.85,
              }}
            />
          );
        })}
      </div>

      {/* Drobne sparkle-burst dookola monety (jednorazowy efekt) */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const cx = 50 + Math.cos(a) * 22;
          const cy = 32 + Math.sin(a) * 16;
          return (
            <div
              key={`b${i}`}
              style={{
                position: "absolute",
                left: `${cx}%`,
                top: `${cy}%`,
                width: 14,
                height: 14,
                borderRadius: "60% 0 60% 0",
                background: colors[i % colors.length],
                transform: `rotate(${i * 32}deg)`,
                animation: `petal-fly 1.6s cubic-bezier(.34,1.56,.64,1) ${i * 0.05}s both`,
              }}
            />
          );
        })}
      </div>

      <p
        className="t-hand"
        style={{
          fontSize: 22,
          color: "var(--p-ink-soft)",
          margin: 0,
          textAlign: "center",
          maxWidth: 340,
          lineHeight: 1.3,
          position: "relative",
          zIndex: 1,
        }}
      >
        Twoje szczere odpowiedzi zasłużyły na pierwszą nagrodę.
      </p>

      {/* Wielka pigulka z monetami — animowany licznik */}
      <div style={{ margin: "10px 0", position: "relative", animation: "coin-tally .6s ease-out", zIndex: 1 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: "linear-gradient(180deg,#FFF1B0,#FFD269)",
            color: "#7A4D10",
            fontWeight: 800,
            fontSize: 40,
            padding: "18px 32px",
            borderRadius: 999,
            boxShadow: "inset 0 0 0 2.5px #E1B66A, 0 8px 20px rgba(160,110,30,.35), 0 0 60px rgba(255,210,105,.55)",
            fontFamily: "var(--font-display, 'Baloo 2'), sans-serif",
          }}
        >
          <Coin size={48} anim />
          <span style={{ lineHeight: 1 }}>+{coinCount}</span>
        </div>
        <div style={{ position: "absolute", top: -12, right: -16 }}>
          <Sparkle size={28} />
        </div>
        <div style={{ position: "absolute", bottom: -10, left: -12 }}>
          <Sparkle size={20} delay={0.4} />
        </div>
      </div>

      <button
        className="btn btn-magic btn-block"
        style={{ maxWidth: 360, marginTop: 10, position: "relative", zIndex: 1 }}
        onClick={() => setPhase("archetype")}
      >
        Zobacz, kim jesteś →
      </button>

      <div style={{ position: "relative", zIndex: 1 }}>
        <NarratorVoice
          text={`Brawo! Zdobyłeś pierwsze ${REWARD} złotych monet. Twój skarbiec dopiero się otwiera.`}
          land="gora_podsumowania"
          tone="celebration"
          pauseBefore={300}
          inlinePauses
          autoPlay
        />
      </div>
    </div>
  );
}
