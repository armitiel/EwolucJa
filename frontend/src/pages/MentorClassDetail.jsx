/**
 * MentorClassDetail — szczegoly klasy: lista uczniow, kod zaproszenia, akcje.
 */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import { Sparkle } from "../components/art.jsx";
import ProfileAvatar, { PROFILE_INFO } from "../components/ProfileAvatar.jsx";
import { mentorApi } from "../services/mentorApi.js";
import { pickTaskForGenerator } from "../data/mentorTaskLibrary.js";

export default function MentorClassDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [regen, setRegen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    try { setData(await mentorApi.getClass(id)); }
    catch (e) { if (e.status === 401) navigate("/mentor/zaloguj"); else setError(e.message); }
  }
  useEffect(() => { loadData(); }, [id, navigate]);

  async function handleRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  async function handleRegenerate() {
    if (!confirm("Wygenerowac nowy kod? Stary przestanie dzialac.")) return;
    setRegen(true);
    try {
      const result = await mentorApi.regenerateCode(id);
      setData({ ...data, invite_code: result.invite_code, invite_code_expires_at: result.invite_code_expires_at });
    } catch (e) {
      alert(e.message);
    } finally { setRegen(false); }
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  }

  if (error) return <PageShell skyVars={{ "--sky-top": "#E8D5FF", "--sky-mid": "#FFE0B5", "--sky-bot": "#FFD0B0" }}><div style={{ padding: 40 }}><p style={{ color: "#B85B47" }}>{error}</p></div></PageShell>;
  if (!data) return <PageShell skyVars={{ "--sky-top": "#E8D5FF", "--sky-mid": "#FFE0B5", "--sky-bot": "#FFD0B0" }}><div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkle /></div></PageShell>;

  const inviteLink = `${window.location.origin}/dolacz?kod=${data.invite_code}`;

  return (
    <PageShell skyVars={{ "--sky-top": "#E8D5FF", "--sky-mid": "#FFE0B5", "--sky-bot": "#FFD0B0" }}>
      {/* TopBar */}
      <div style={{ display: "flex", alignItems: "center", padding: "16px 18px", gap: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/mentor")}>← Wróć</button>
        <div style={{ flex: 1 }} />
        <button className="btn btn-ghost btn-sm" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? "..." : "↻ Odśwież"}
        </button>
      </div>

      <div className="screen-scroll" style={{ flex: 1, padding: "0 18px 52px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Header klasy - nazwa + licznik uczniow inline (bez opisu i przycisku Kod) */}
        <div className="card card-paper pop-in" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
            <h1 className="t-display" style={{ fontSize: 28, margin: 0, color: "var(--p-magic-dk)", lineHeight: 1 }}>{data.name}</h1>
            <span style={{ fontSize: 13, color: "var(--p-ink-soft)", fontWeight: 700 }}>
              {data.students.length} / {data.max_students} uczniów
            </span>
          </div>

          <div style={{ background: "rgba(122,77,194,.10)", borderRadius: 14, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-magic-dk)" }}>KOD ZAPROSZENIA</div>
            <div className="t-display" style={{ fontSize: 22, margin: "4px 0 8px", color: "var(--p-ink)" }}>{data.invite_code}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button className="btn btn-ghost btn-sm" onClick={() => copyText(inviteLink)}>{copied ? "✓ Skopiowano" : "🔗 Link"}</button>
              <button className="btn btn-ghost btn-sm" onClick={handleRegenerate} disabled={regen}>{regen ? "..." : "↻ Nowy kod"}</button>
            </div>
          </div>
        </div>

        {/* Lista uczniow */}
        <h2 className="t-display" style={{ fontSize: 18, margin: "8px 0 0", color: "var(--p-ink)" }}>
          Uczniowie {data.students.length > 0 && <span style={{ fontSize: 13, color: "var(--p-ink-soft)", fontWeight: 400 }}>({data.students.length})</span>}
        </h2>

        {data.students.length === 0 ? (
          <div className="card" style={{ padding: 20, textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "var(--p-ink-soft)", margin: 0 }}>
              Brak uczniów. Udostępnij kod rodzicom, by dołączyli.
            </p>
          </div>
        ) : (
          data.students.map((s) => (
            <StudentRow
              key={s.id}
              student={s}
              onClick={() => setSelectedStudent(s)}
              onDelete={async (e) => {
                e.stopPropagation();
                if (!confirm(`Usunąć ${s.name} z klasy? Cały postęp ucznia zostanie skasowany.`)) return;
                try {
                  await mentorApi.deleteStudent(id, s.id);
                  setData({ ...data, students: data.students.filter((st) => st.id !== s.id) });
                } catch (err) { alert(err.message); }
              }}
            />
          ))
        )}

      </div>

      {selectedStudent && (
        <StudentDetailModal
          classId={id}
          studentId={selectedStudent.id}
          studentName={selectedStudent.name}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </PageShell>
  );
}

function StudentRow({ student, onClick, onDelete }) {
  const lastActivity = student.last_activity ? new Date(student.last_activity) : null;
  const profileCode = mapToProfileCode(student.archetype);
  const profileInfo = profileCode ? PROFILE_INFO[profileCode] : null;
  const pendingReview = (student.pending_review_count || 0) > 0;
  const status = student.last_mission_status; // pending | submitted | verified | rejected | null
  const coins = student.coins || 0;
  const pct = Math.min(100, Math.round((coins / 80) * 100));

  // Mapa statusu misji na etykiete + kolor
  const STATUS_MAP = {
    submitted: { label: "Do sprawdzenia", color: "#7A4DC2", bg: "rgba(122,77,194,.18)", dot: "#7A4DC2", emoji: "✉" },
    pending:   { label: "W trakcie",      color: "#A66A1A", bg: "rgba(255,210,105,.30)", dot: "#E89A3D", emoji: "●" },
    rejected:  { label: "Do poprawy",     color: "#B85B47", bg: "rgba(184,91,71,.18)",   dot: "#B85B47", emoji: "↺" },
    verified:  { label: "Zatwierdzone",   color: "#3B6D11", bg: "rgba(99,153,34,.18)",   dot: "#5FA76F", emoji: "✓" },
  };
  const st = status && STATUS_MAP[status] ? STATUS_MAP[status] : null;

  return (
    <div
      className="card pop-in"
      onClick={onClick}
      style={{
        position: "relative",
        padding: "12px 14px 14px",
        display: "flex", alignItems: "center", gap: 12,
        cursor: "pointer",
        background: "rgba(255,255,255,.95)",
        boxShadow: "inset 0 0 0 1.4px rgba(168,122,42,.18), 0 3px 10px rgba(80,50,10,.08)",
        // Czerwona pulsujaca kropka w prawym gornym rogu gdy cos do zatwierdzenia
      }}
    >
      {/* Avatar - 91px + pulsujaca rozowa kropka w LEWYM GORNYM rogu avatara */}
      <div style={{ flex: "none", position: "relative" }}>
        {profileCode
          ? <ProfileAvatar profile={profileCode} size={91} variant="mini" />
          : <PendingAvatar size={91} />}
        {pendingReview && (
          <span aria-hidden="true" title="Czeka na sprawdzenie" style={{
            position: "absolute", top: -2, left: -2,
            width: 14, height: 14, borderRadius: "50%",
            background: "#E84BA0",
            boxShadow: "0 0 0 3px rgba(232,75,160,.25), 0 0 12px rgba(232,75,160,.55), inset 0 1px 0 rgba(255,255,255,.4)",
            animation: "pulse-dot 1.6s ease-in-out infinite",
            zIndex: 2,
          }} />
        )}
      </div>

      {/* Srodek - nazwa, profil chip, status, progress */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div className="t-display" style={{ fontSize: 18, color: "var(--p-ink)", lineHeight: 1 }}>{student.name}</div>
          {profileInfo && (
            <span style={{
              fontSize: 9, fontWeight: 900, letterSpacing: 1.2,
              padding: "2px 7px", borderRadius: 999,
              background: "rgba(78,77,118,.10)",
              color: "var(--p-ink-soft)",
              textTransform: "uppercase",
            }}>
              {profileInfo.name}
            </span>
          )}
        </div>

        {/* Status pill */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
          {st ? (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 10.5, fontWeight: 900,
              padding: "3px 9px", borderRadius: 999,
              background: st.bg, color: st.color,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%", background: st.dot,
                ...(status === "submitted" ? { animation: "pulse-dot 1.6s ease-in-out infinite" } : {}),
              }} />
              {st.label}
            </span>
          ) : (
            <span style={{ fontSize: 10.5, fontWeight: 800, color: "var(--p-ink-soft)" }}>
              {profileCode ? "Czeka na zadanie" : "Onboarding…"}
            </span>
          )}
          {lastActivity && (
            <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--p-ink-soft)" }}>
              · {timeAgo(lastActivity)}
            </span>
          )}
        </div>

        {/* Progress bar - postep tygodnia */}
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 999, background: "rgba(122,77,194,.12)", overflow: "hidden" }}>
            <div style={{
              width: `${pct}%`, height: "100%",
              background: "linear-gradient(90deg,#C8A0F0,#7A4DC2)",
              borderRadius: 999, transition: "width .6s ease",
            }} />
          </div>
          <span className="t-display" style={{ fontSize: 13, color: "var(--p-magic-dk)", minWidth: 40, textAlign: "right" }}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Delete button (strzalka usunieta) */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginLeft: 2 }}>
        {onDelete && (
          <button
            onClick={onDelete}
            title="Usuń z klasy"
            style={{
              background: "rgba(232,75,160,.10)", border: "none",
              color: "#B82F7C", fontSize: 12, cursor: "pointer",
              width: 22, height: 22, borderRadius: "50%",
              padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

function StudentDetailModal({ classId, studentId, studentName, onClose }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  // Tab state: 'odebrane' (default) | 'wyslij'. Historia usunieta.
  const [tab, setTab] = useState("odebrane");
  // Composer kind: 'task' | 'hint' | 'artifact'
  const [composerKind, setComposerKind] = useState("task");
  // Wspolne pola formy
  const [cTitle, setCTitle] = useState("");
  const [cBody, setCBody] = useState("");
  const [cReward, setCReward] = useState(25);
  const [sending, setSending] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  async function load() {
    try { setData(await mentorApi.getStudent(classId, studentId)); }
    catch (e) { setError(e.message); }
  }
  useEffect(() => { load(); }, [classId, studentId]);

  // Wspolny submit zaleznie od composerKind: task -> createMission, hint/artifact -> sendHint(kind)
  async function handleComposerSend() {
    const titleTrim = cTitle.trim();
    const bodyTrim = cBody.trim();
    if (!bodyTrim) return;
    setSending(true);
    try {
      if (composerKind === "task") {
        if (!titleTrim) { alert("Tytuł zadania jest wymagany"); setSending(false); return; }
        await mentorApi.createMission(studentId, { title: titleTrim, body: bodyTrim, points_reward: cReward });
      } else {
        const kindForApi = composerKind === "artifact" ? "artifact" : "hint";
        await mentorApi.sendHint(studentId, { kind: kindForApi, title: titleTrim || null, body: bodyTrim });
      }
      setCTitle(""); setCBody(""); setCReward(25);
      await load();
    } catch (e) { alert(e.message); }
    setSending(false);
  }

  async function handleDeleteHint(hintId) {
    if (!confirm("Usunąć tę wiadomość? Zniknie z historii i ze skrzynki ucznia.")) return;
    try { await mentorApi.deleteHint(studentId, hintId); await load(); }
    catch (e) { alert(e.message); }
  }

  // Generator: losuje task/hint/artifact z biblioteki dla profilu ucznia, wypelnia composer.
  // Zapisujemy ostatnio wylosowane ID w pamieci aby nie powtarzac.
  const [recentlyGenerated, setRecentlyGenerated] = useState(new Set());
  function handleGenerate() {
    const playerProfile = data?.player ? mapToProfileCode(data.player.archetype) : null;
    if (!playerProfile) {
      alert("Uczeń jeszcze nie ma profilu — nie mogę wygenerować dopasowanego zadania.");
      return;
    }
    const item = pickTaskForGenerator(composerKind, playerProfile, recentlyGenerated);
    if (!item) {
      alert("Brak gotowych szablonów dla tego typu i profilu.");
      return;
    }
    setCTitle(item.title);
    setCBody(item.body);
    if (composerKind === "task" && item.points_reward) setCReward(item.points_reward);
    setRecentlyGenerated(new Set([...recentlyGenerated, item.id]));
  }

  const profile = data?.player ? mapToProfileCode(data.player.archetype) : null;
  const scores = data?.player?.lifetime_scores || {};

  // Radar - spojny z CharakterBohatera w profilu ucznia (te same kody+kolejnosc+skala).
  // Kody profili (DT/EM/ST/KR/LD/MD) mapowane na cechy charakteru z polskimi 3-literowcami.
  const cx = 80, cy = 80, r = 56;
  const RADAR_TRAITS = [
    { k: "ST", short: "MĄD", color: "#7A4DC2" }, // Madrosc
    { k: "LD", short: "ODW", color: "#E89A3D" }, // Odwaga
    { k: "DT", short: "CIE", color: "#5FA76F" }, // Ciekawosc
    { k: "MD", short: "SKU", color: "#378ADD" }, // Skupienie
    { k: "EM", short: "ŻYC", color: "#E4779C" }, // Zyczliwosc
    { k: "KR", short: "KRE", color: "#EF9F27" }, // Kreatywnosc
  ];
  // Stala skala 50 punktow (jak w profilu ucznia) - kwiz wypelnia ~30-50%, misje rosna polygon
  const MAX_SCORE = 50;
  const radarVals = RADAR_TRAITS.map((t, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const raw = scores[t.k] || 0;
    const v = Math.min(1, raw / MAX_SCORE);
    return {
      x: cx + Math.cos(a) * r * v,
      y: cy + Math.sin(a) * r * v,
      ax: cx + Math.cos(a) * r,
      ay: cy + Math.sin(a) * r,
      t,
    };
  });
  const polyVal = radarVals.map((p) => `${p.x},${p.y}`).join(" ");

  // Liczniki tabow
  const submittedCount = (data?.missions || []).filter((m) => m.status === "submitted").length;
  const totalMissionsCount = (data?.missions || []).length;

  // ─── KIND CONFIG dla composera (Zadanie / Hint / Artefakt) ───
  const KINDS = {
    task:     { label: "Zadanie",   icon: "📜", c: "#E89A3D", dk: "#A66A1A", bg: "#FFE7B0", hint: "misja w realu — z dowodem" },
    hint:     { label: "Hint",      icon: "💡", c: "#E0B65C", dk: "#7E5B14", bg: "#FBEDC4", hint: "mała wskazówka w grze" },
    artifact: { label: "Artefakt",  icon: "🎁", c: "#7A4DC2", dk: "#4A2D80", bg: "#E6D6FA", hint: "magiczny przedmiot" },
  };
  const sel = KINDS[composerKind];
  const isTask = composerKind === "task";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", flexDirection: "column",
      maxWidth: 480, margin: "0 auto",
      background: "linear-gradient(180deg, #FFE5C8 0%, #FFCFAB 60%, #F9BAA0 100%)",
      animation: "fadeIn .25s ease-out both",
    }}>
      {/* BackBar - Wroc + Skopiuj link ucznia + odswiez */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 16px 8px", flex: "none" }}>
        <button onClick={onClose} style={{
          border: "none", cursor: "pointer",
          background: "rgba(255,255,255,.7)",
          padding: "8px 14px", borderRadius: 999,
          fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 12,
          color: "var(--p-ink)",
          boxShadow: "inset 0 0 0 1.2px rgba(43,42,74,.08)",
        }}>← Wróć</button>
        <div style={{ flex: 1 }} />
        {/* Kod ucznia - widoczny od razu, klikalny zeby skopiowac. Daje rodzicowi krotki kod do wpisania. */}
        {data?.player?.login_code && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(data.player.login_code).then(() => {
                setCodeCopied(true);
                setTimeout(() => setCodeCopied(false), 1800);
              }).catch(() => alert("Skopiuj ręcznie kod: " + data.player.login_code));
            }}
            title="Skopiuj kod ucznia (do wpisania na /odzyskaj)"
            style={{
              border: "none", cursor: "pointer",
              background: codeCopied ? "linear-gradient(180deg,#A8E08F,#5FA76F)" : "linear-gradient(180deg,#FFE7B0,#E89A3D)",
              color: codeCopied ? "#fff" : "#4A2A0E",
              padding: "8px 12px", borderRadius: 999,
              fontFamily: "var(--font-display, 'Baloo 2'), sans-serif", fontWeight: 800, fontSize: 13,
              boxShadow: "0 2px 0 #B47322",
              transition: "all .2s ease",
              display: "inline-flex", alignItems: "center", gap: 6, letterSpacing: 1,
            }}
          >
            {codeCopied ? "✓" : "🗝️"} {data.player.login_code}
          </button>
        )}
        <button
          onClick={() => {
            const link = `${window.location.origin}/uczen?id=${studentId}`;
            navigator.clipboard.writeText(link).then(() => {
              setLinkCopied(true);
              setTimeout(() => setLinkCopied(false), 1800);
            }).catch(() => alert("Nie udało się skopiować. Skopiuj ręcznie: " + link));
          }}
          title="Skopiuj długi link (do SMS/maila — od razu otwiera grę)"
          style={{
            border: "none", cursor: "pointer",
            background: linkCopied ? "linear-gradient(180deg,#A8E08F,#5FA76F)" : "rgba(255,255,255,.7)",
            color: linkCopied ? "#fff" : "var(--p-ink)",
            width: 34, height: 34, borderRadius: "50%",
            boxShadow: "inset 0 0 0 1.2px rgba(43,42,74,.08)",
            transition: "all .2s ease",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 14,
          }}
        >
          {linkCopied ? "✓" : "🔗"}
        </button>
        <button onClick={() => load()} title="Odśwież" style={{
          border: "none", cursor: "pointer",
          background: "rgba(255,255,255,.7)",
          width: 34, height: 34, borderRadius: "50%",
          boxShadow: "inset 0 0 0 1.2px rgba(43,42,74,.08)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" stroke="var(--p-ink)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {error && <div style={{ padding: 16, color: "#B85B47" }}>{error}</div>}
      {!data && !error && <div style={{ padding: 24, textAlign: "center", color: "var(--p-ink-soft)" }}>Ładuję...</div>}

      {data && (
        <div className="screen-scroll" style={{ flex: 1, padding: "0 16px 22px", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>

          {/* HEADER CARD: radar + portret + postep */}
          <div className="card card-paper" style={{ padding: 14, marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              {/* RADAR SVG 160x160 - spojny z profilem ucznia */}
              <svg width="160" height="160" viewBox="0 0 160 160" style={{ flex: "none" }}>
                <defs>
                  <radialGradient id="mentor-radar-glow" cx=".5" cy=".5">
                    <stop offset="0%" stopColor="#FFD269" stopOpacity=".55" />
                    <stop offset="100%" stopColor="#FFD269" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* Glow w srodku */}
                <circle cx={cx} cy={cy} r={r * 0.7} fill="url(#mentor-radar-glow)" />
                {/* Pierscienie heksagonalne */}
                {[0.5, 0.75, 1].map((s, i) => (
                  <polygon key={i}
                    points={radarVals.map((p) => `${cx + (p.ax - cx) * s},${cy + (p.ay - cy) * s}`).join(" ")}
                    fill={i === 2 ? "rgba(184,134,52,.05)" : "none"}
                    stroke={i === 2 ? "#B88634" : "rgba(184,134,52,.25)"}
                    strokeWidth={i === 2 ? 1.5 : 1}
                    strokeDasharray={i === 2 ? undefined : "2 3"}
                  />
                ))}
                {/* Promienie */}
                {radarVals.map((p, i) => (
                  <line key={i} x1={cx} y1={cy} x2={p.ax} y2={p.ay} stroke="rgba(184,134,52,.18)" strokeWidth="1" />
                ))}
                {/* Polygon z aktualnymi wartosciami */}
                <polygon points={polyVal} fill="rgba(122,77,194,.28)" stroke="#7A4DC2" strokeWidth="2.5" strokeLinejoin="round" />
                {/* Krople na punktach */}
                {radarVals.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="3" fill="#FFD269" stroke="#7A4DC2" strokeWidth="1.5" />
                ))}
                {/* Etykiety w kolkach na zewnatrz */}
                {radarVals.map((p, i) => {
                  const lx = cx + (p.ax - cx) * 1.18;
                  const ly = cy + (p.ay - cy) * 1.18;
                  return (
                    <g key={`l-${i}`}>
                      <circle cx={lx} cy={ly} r="11" fill="#fff" stroke={p.t.color} strokeWidth="1.5" />
                      <text x={lx} y={ly + 0.5} fontSize="7.5" fontWeight="900" textAnchor="middle"
                        dominantBaseline="middle" fill={p.t.color} fontFamily="Baloo 2, sans-serif">
                        {p.t.short}
                      </text>
                    </g>
                  );
                })}
                {/* Iskierka centralna */}
                <g transform={`translate(${cx - 6} ${cy - 6})`} opacity="0.7">
                  <path d="M6 0L7.1 4.9L12 6L7.1 7.1L6 12L4.9 7.1L0 6L4.9 4.9Z" fill="#FFD269" />
                </g>
              </svg>

              {/* Prawa kolumna: portret + nazwa + postep (avatar 2x wiekszy) */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                  <div style={{ position: "relative", width: 92, height: 92, flex: "none" }}>
                    <div aria-hidden="true" style={{
                      position: "absolute", inset: -5, borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(255,210,105,.55), transparent 65%)",
                      filter: "blur(3px)",
                    }} />
                    <div style={{
                      position: "relative", width: 92, height: 92, borderRadius: "50%",
                      background: "#fff", overflow: "hidden",
                      boxShadow: "inset 0 0 0 2px rgba(122,77,194,.4), 0 3px 10px rgba(80,50,10,.22)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {profile
                        ? <ProfileAvatar profile={profile} size={88} variant="mini" />
                        : <PendingAvatar size={88} />}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 className="t-display" style={{ fontSize: 22, lineHeight: 1, margin: 0, color: "var(--p-ink)" }}>
                      {studentName}
                    </h2>
                    {profile && (
                      <div style={{ fontSize: 12.5, fontWeight: 900, color: PROFILE_INFO[profile].color, marginTop: 4 }}>
                        {PROFILE_INFO[profile].name}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ marginTop: 10, fontSize: 10, fontWeight: 900, letterSpacing: 1.2, color: "#A66A1A", textTransform: "uppercase" }}>
                  Postęp tygodnia
                </div>
                <div className="t-display" style={{ fontSize: 24, lineHeight: 1, color: "var(--p-magic-dk)", marginTop: 1 }}>
                  {data.total_coins}<span style={{ color: "var(--p-ink-soft)", fontSize: 13 }}>/80</span>
                </div>
                <div className="prog magic" style={{ height: 6, marginTop: 6 }}>
                  <i style={{ width: `${Math.min(100, Math.round((data.total_coins / 80) * 100))}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* TABS - Odebrane jako pierwsza, Historia usunieta */}
          <div style={{ display: "flex", gap: 6, padding: "0 4px 10px" }}>
            {[
              { k: "odebrane", l: "Odebrane", n: totalMissionsCount, badge: submittedCount },
              { k: "wyslij",   l: "Wyślij" },
            ].map((t) => {
              const active = tab === t.k;
              return (
                <button key={t.k} onClick={() => setTab(t.k)} style={{
                  all: "unset", cursor: "pointer", flex: 1, textAlign: "center",
                  padding: "8px 6px", borderRadius: 12,
                  background: active ? "var(--p-magic-dk)" : "rgba(255,255,255,.55)",
                  color: active ? "#fff" : "var(--p-ink-soft)",
                  fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 12,
                  boxShadow: active ? "0 2px 0 rgba(43,30,90,.5)" : "inset 0 0 0 1.2px rgba(43,42,74,.08)",
                }}>
                  {t.l}
                  {typeof t.n !== "undefined" && t.n > 0 && (
                    <span style={{
                      fontSize: 9.5, marginLeft: 4, padding: "1px 6px",
                      background: active ? "rgba(255,210,105,.3)" : "rgba(43,42,74,.08)",
                      borderRadius: 999, fontWeight: 900,
                      color: active ? "#FFD269" : "var(--p-ink-soft)",
                    }}>{t.n}{t.badge ? ` · ${t.badge}✉` : ""}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── TAB: WYSLIJ - unified composer (task/hint/artifact) ── */}
          {tab === "wyslij" && (
            <>
              <div className="card card-paper" style={{ padding: 12 }}>
                {/* Chips wyboru typu */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5, marginBottom: 10 }}>
                  {Object.entries(KINDS).map(([key, k]) => {
                    const active = composerKind === key;
                    return (
                      <button key={key} onClick={() => setComposerKind(key)} style={{
                        all: "unset", cursor: "pointer",
                        padding: "7px 4px", borderRadius: 10,
                        background: active ? k.bg : "rgba(255,255,255,.65)",
                        boxShadow: active ? `inset 0 0 0 1.6px ${k.c}` : "inset 0 0 0 1.2px rgba(43,42,74,.08)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                        fontSize: 11, fontWeight: 800, color: active ? k.dk : "var(--p-ink)",
                        textAlign: "center",
                      }}>
                        <span>{k.icon}</span> {k.label}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, padding: "0 2px" }}>
                  <div className="t-display" style={{ fontSize: 13.5, color: sel.dk }}>Wyślij {sel.label.toLowerCase()}</div>
                  <span style={{ flex: 1 }} />
                  {/* Generator: szuka gotowego szablonu dopasowanego do profilu ucznia */}
                  <button
                    onClick={handleGenerate}
                    title={`Wygeneruj losowy ${sel.label.toLowerCase()} z biblioteki — dopasowany do profilu`}
                    style={{
                      border: "none", cursor: "pointer",
                      padding: "5px 11px", borderRadius: 999,
                      background: "linear-gradient(180deg,#C8A0F0,#7A4DC2)",
                      color: "#fff", fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 11,
                      letterSpacing: 0.4,
                      boxShadow: "0 2px 0 #4A2D80, 0 3px 8px rgba(74,45,128,.35)",
                      display: "inline-flex", alignItems: "center", gap: 4,
                    }}
                  >
                    ✦ Wygeneruj
                  </button>
                </div>
                <div style={{ display: "flex", padding: "0 2px 4px" }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: "var(--p-ink-soft)" }}>{sel.hint}</span>
                </div>

                <input
                  value={cTitle}
                  onChange={(e) => setCTitle(e.target.value)}
                  placeholder={isTask ? "Tytuł (np. Pomóż w kuchni 10 minut)" : composerKind === "hint" ? "Tytuł hinta (opcjonalnie)" : "Nazwa artefaktu (np. Klucz do drzwi)"}
                  style={{
                    width: "100%", border: "none", boxSizing: "border-box",
                    background: "rgba(255,255,255,.85)",
                    padding: "9px 12px", borderRadius: 11,
                    fontFamily: "Nunito,sans-serif", fontSize: 12.5, fontWeight: 700, color: "var(--p-ink)",
                    boxShadow: `inset 0 0 0 1.4px ${sel.c}40`,
                  }}
                />
                <textarea
                  value={cBody}
                  onChange={(e) => setCBody(e.target.value)}
                  placeholder={isTask ? "Co dokładnie ma zrobić? Co będzie dowodem?" : composerKind === "hint" ? "Twoja podpowiedź…" : "Co ten artefakt potrafi w grze?"}
                  style={{
                    width: "100%", marginTop: 7, border: "none", boxSizing: "border-box",
                    background: "rgba(255,255,255,.85)",
                    padding: "9px 12px", borderRadius: 11,
                    fontFamily: "Nunito,sans-serif", fontSize: 12.5, fontWeight: 600, color: "var(--p-ink)",
                    minHeight: 60, resize: "vertical",
                    boxShadow: `inset 0 0 0 1.4px ${sel.c}40`,
                  }}
                />

                {/* Reward slider - tylko dla taska */}
                {isTask && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 1.2, color: "#A66A1A", textTransform: "uppercase" }}>Nagroda · monety</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 999, background: "linear-gradient(180deg,#FFD269,#E89A3D)", color: "#4A2A0E", fontWeight: 900, fontSize: 13, boxShadow: "0 2px 0 #B47322" }}>
                        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #FFE7B0, #E89A3D)" }} />
                        +{cReward}
                      </span>
                    </div>
                    <input type="range" min={15} max={40} step={5}
                      value={cReward}
                      onChange={(e) => setCReward(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#E89A3D" }} />
                  </div>
                )}

                <button
                  className={isTask ? "btn btn-primary btn-block" : "btn btn-magic btn-block"}
                  style={{ marginTop: 10, fontSize: 13, padding: "12px 16px" }}
                  onClick={handleComposerSend}
                  disabled={sending || !cBody.trim() || (isTask && !cTitle.trim())}
                >
                  {sending ? "Wysyłam..." : (isTask ? `+ Wyślij zadanie (+${cReward} ✦)` : `✦ Wyślij ${sel.label.toLowerCase()}`)}
                </button>
              </div>
            </>
          )}

          {/* ── TAB: ODEBRANE - lista misji + lista wskazowek ── */}
          {tab === "odebrane" && (
            <>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "2px 4px 8px" }}>
                <div className="t-display" style={{ fontSize: 14, color: "var(--p-ink)" }}>
                  Zadania <span style={{ color: "var(--p-ink-soft)", fontWeight: 700 }}>· {totalMissionsCount}</span>
                </div>
                {submittedCount > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#7A4DC2" }}>
                    {submittedCount} do sprawdzenia ✉
                  </span>
                )}
              </div>
              {totalMissionsCount === 0 ? (
                <div style={{
                  padding: 14, borderRadius: 14,
                  background: "rgba(255,255,255,.92)",
                  textAlign: "center",
                  boxShadow: "inset 0 0 0 1.4px rgba(168,122,42,.22), 0 2px 8px rgba(80,50,10,.08)",
                  fontSize: 13, color: "var(--p-ink-soft)", fontWeight: 700,
                }}>
                  Jeszcze brak zadań. Przejdź do „Wyślij" ↑ aby stworzyć pierwsze.
                </div>
              ) : (
                data.missions.slice(0, 10).map((m) => (
                  <MissionCard key={m.id} mission={m}
                    onVerify={async (decision, points) => {
                      try { await mentorApi.verifyMission(m.id, decision, null, points); await load(); }
                      catch (e) { alert(e.message); }
                    }}
                    onDelete={async () => {
                      if (!window.confirm("Usunąć to zadanie z historii ucznia?")) return;
                      try { await mentorApi.deleteMission(m.id); await load(); }
                      catch (e) { alert(e.message); }
                    }}
                  />
                ))
              )}

              <div className="t-display" style={{ fontSize: 12.5, padding: "12px 4px 6px", color: "var(--p-ink)" }}>
                Wskazówki <span style={{ color: "var(--p-ink-soft)", fontSize: 11, fontWeight: 700 }}>({data.hints.length})</span>
              </div>
              {data.hints.length === 0 ? (
                <div style={{
                  padding: "12px 14px", borderRadius: 12,
                  background: "rgba(255,255,255,.92)",
                  boxShadow: "inset 0 0 0 1.4px rgba(168,122,42,.22), 0 2px 6px rgba(80,50,10,.06)",
                  fontSize: 12, fontWeight: 700, color: "var(--p-ink-soft)", textAlign: "center",
                }}>
                  Jeszcze nic. Przejdź do „Wyślij" ↑ aby podpowiedzieć.
                </div>
              ) : (
                data.hints.slice(0, 5).map((h) => (
                  <div key={h.id} style={{
                    background: "rgba(255,255,255,.92)",
                    borderRadius: 12, padding: "10px 12px", marginBottom: 6, position: "relative",
                    boxShadow: "inset 0 0 0 1.4px rgba(255,213,105,.55), 0 2px 6px rgba(80,50,10,.08)",
                    borderLeft: "3px solid #E89A3D",
                  }}>
                    <button onClick={() => handleDeleteHint(h.id)} title="Usuń wiadomość"
                      style={{ position: "absolute", top: 6, right: 6, background: "rgba(232,75,160,.15)", color: "#B82F7C", border: "none", borderRadius: 999, cursor: "pointer", padding: "2px 8px", fontSize: 11, fontWeight: 800 }}>
                      🗑
                    </button>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#7A4D10", paddingRight: 28 }}>
                      {h.kind === "artifact" ? "🎁" : h.kind === "message" ? "💬" : "💡"} {h.title || h.kind}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--p-ink)", marginTop: 2 }}>{h.body}</div>
                    <div style={{ fontSize: 10, color: "var(--p-ink-soft)", marginTop: 4 }}>
                      {new Date(h.sent_at).toLocaleString("pl-PL")} · {h.viewed_at ? "✓ widziane" : "niewidziane"}
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          <div style={{ height: 18 }} />
        </div>
      )}
    </div>
  );
}

// Karta misji w modal mentora - pokazuje status, dowod, akcje verify (z customowa liczba punktow)
function MissionCard({ mission, onVerify, onDelete }) {
  const status = mission.status;
  const proof = mission.submitted_proof;
  const verification = mission.gm_verification;
  const statusColor = status === "verified" ? "#3B6D11" : status === "submitted" ? "var(--p-magic-dk)" : status === "rejected" ? "#B85B47" : "var(--p-ink-soft)";
  const statusBg = status === "verified" ? "rgba(99,153,34,.18)" : status === "submitted" ? "rgba(122,77,194,.15)" : status === "rejected" ? "rgba(184,91,71,.15)" : "rgba(78,77,118,.08)";
  const statusLabel = status === "verified" ? `✓ zatwierdzono${verification?.points_awarded ? ` (+${verification.points_awarded} ✦)` : ""}` : status === "submitted" ? "✉ czeka na sprawdzenie" : status === "rejected" ? "↺ do poprawy" : status || "pending";
  const [points, setPoints] = useState(25);
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      padding: "11px 12px 12px", borderRadius: 14, marginBottom: 8,
      background: "rgba(255,255,255,.92)",
      boxShadow: "inset 0 0 0 1.4px rgba(168,122,42,.22), 0 2px 8px rgba(80,50,10,.08)",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="t-display" style={{ fontSize: 14, lineHeight: 1.15, color: "var(--p-ink)" }}>{mission.title || "Misja"}</div>
          <div style={{ fontSize: 11, color: "var(--p-ink-soft)", fontWeight: 700, marginTop: 2 }}>
            {new Date(mission.generated_at).toLocaleDateString("pl-PL")}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: "none" }}>
          <span style={{ fontSize: 10, fontWeight: 900, padding: "3px 9px", borderRadius: 999, background: statusBg, color: statusColor, whiteSpace: "nowrap" }}>
            {statusLabel}
          </span>
          {onDelete && (
            <button
              onClick={onDelete}
              title="Usuń zadanie"
              aria-label="Usuń zadanie"
              style={{
                background: "rgba(232,75,160,.12)", border: "none",
                color: "#B82F7C", cursor: "pointer",
                width: 26, height: 26, borderRadius: "50%",
                padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700,
              }}
            >🗑</button>
          )}
        </div>
      </div>

      {/* Tresc misji (kliknij zeby rozwinac) */}
      {mission.body && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "none", border: "none", padding: 0, marginTop: 5,
            fontSize: 11, color: "var(--p-magic-dk)", fontWeight: 800, cursor: "pointer",
          }}
        >
          {expanded ? "▼ ukryj treść" : "▶ zobacz treść zadania"}
        </button>
      )}
      {expanded && mission.body && (
        <div style={{
          marginTop: 6, padding: "8px 11px", borderRadius: 10,
          background: "linear-gradient(180deg, #FCF5E1 0%, #F4E3B8 100%)",
          boxShadow: "inset 0 0 0 1.2px rgba(168,122,42,.22)",
          fontSize: 12.5, color: "var(--p-ink)", lineHeight: 1.4,
        }}>
          {mission.body}
        </div>
      )}

      {/* Dowod ucznia - kremowa karta z fioletowym left-borderem */}
      {proof?.proof_text && (
        <div style={{
          marginTop: 8, padding: "8px 11px", borderRadius: 11,
          background: "#FCF5E1",
          boxShadow: "inset 0 0 0 1.2px rgba(168,122,42,.22)",
          borderLeft: "3px solid #7A4DC2",
        }}>
          <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1.2, color: "#A66A1A", textTransform: "uppercase" }}>
            ODPOWIEDŹ UCZNIA
          </div>
          <div style={{ fontSize: 17, color: "var(--p-ink)", marginTop: 4, lineHeight: 1.45, fontFamily: "inherit", fontWeight: 500 }}>
            „{proof.proof_text}"
          </div>
        </div>
      )}
      {proof?.proof_media_url && (
        <div style={{
          marginTop: 8, width: "100%", borderRadius: 11, overflow: "hidden",
          boxShadow: "inset 0 0 0 1.2px rgba(168,122,42,.25), 0 2px 6px rgba(80,50,10,.12)",
          position: "relative",
        }}>
          <a href={proof.proof_media_url} target="_blank" rel="noreferrer" style={{ display: "block" }}>
            <img src={proof.proof_media_url} alt="dowód" style={{ display: "block", width: "100%", maxHeight: 200, objectFit: "cover" }} />
          </a>
          <span style={{
            position: "absolute", bottom: 0, left: 0,
            padding: "4px 9px", fontSize: 9.5, fontWeight: 900, letterSpacing: 1,
            color: "#fff", textTransform: "uppercase",
            background: "rgba(0,0,0,.45)", borderRadius: "0 8px 0 0",
          }}>📷 dowód</span>
        </div>
      )}

      {/* Komentarz mentora po weryfikacji */}
      {verification?.comment && (
        <div style={{ marginTop: 8, padding: "6px 10px", borderRadius: 8, background: `${statusBg}`, fontSize: 11, color: statusColor, fontStyle: "italic", fontWeight: 600 }}>
          „{verification.comment}"
        </div>
      )}

      {/* Przyciski akcji + slider punktow - tylko jezeli status submitted */}
      {status === "submitted" && onVerify && (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 1.2, color: "#A66A1A", textTransform: "uppercase" }}>NAGRODA</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 900, color: "#A66A1A" }}>
              +{points} <span style={{ color: "#E89A3D" }}>✦</span>
            </span>
          </div>
          <input
            type="range" min={15} max={40} step={5}
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#E89A3D", marginBottom: 6 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => onVerify("reject", points)} className="btn btn-ghost btn-sm" style={{ flex: 1, fontSize: 12, color: "var(--p-ink)", padding: "9px 10px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ marginRight: 4, verticalAlign: "-2px" }}>
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Do poprawy
            </button>
            <button onClick={() => onVerify("approve", points)} className="btn btn-leaf btn-sm" style={{ flex: 1.4, fontSize: 12, padding: "9px 10px" }}>
              ✓ Zatwierdź (+{points} ✦)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Generic "head silhouette" dla studenta przed wyborem profilu (Onboarding pending)
function PendingAvatar({ size = 44 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(180deg, #C8A0F0 0%, #7A4DC2 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      boxShadow: "0 2px 6px rgba(122,77,194,.25)",
    }} title="Onboarding w toku">
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>
      </svg>
    </div>
  );
}

// Stare wartosci 'archetype' w bazie (np. 'tropiciel_tajemnic') -> kod profilu (DT).
// Nowe wartosci powinny byc bezposrednio kodami (EM/ST/KR/LD/DT/MD).
const LEGACY_ARCHETYPE_TO_PROFILE = {
  tropiciel_tajemnic: "DT", zaklinacz_uczuc: "EM", mistrz_map: "ST",
  tkacz_snow: "KR", gwardzista_odwagi: "LD", straznik_mostu: "MD",
};
function mapToProfileCode(value) {
  if (!value) return null;
  if (PROFILE_INFO[value]) return value; // juz kod profilu
  return LEGACY_ARCHETYPE_TO_PROFILE[value] || null;
}

function timeAgo(date) {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "teraz";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} godz`;
  return `${Math.floor(diff / 86400)} dni`;
}
