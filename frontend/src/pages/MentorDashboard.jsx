/**
 * MentorDashboard — lista klas mentora.
 * Pusty stan: CTA "Stworz pierwsza klase". Z klasami: grid kart.
 * Tworzenie nowej klasy — inline modal.
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import { Sparkle } from "../components/art.jsx";
import { mentorApi } from "../services/mentorApi.js";
import { session } from "../services/api.js";

export default function MentorDashboard() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [classes, setClasses] = useState(null);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createdClass, setCreatedClass] = useState(null);

  useEffect(() => {
    Promise.all([mentorApi.me(), mentorApi.listClasses()])
      .then(([m, c]) => { setMe(m); setClasses(c.classes || []); })
      .catch((e) => {
        if (e.status === 401) navigate("/mentor/zaloguj", { replace: true });
        else setError(e.message);
      });
  }, [navigate]);

  async function handleLogout() {
    await mentorApi.logout().catch(() => {});
    navigate("/");
  }

  async function handleCreate(data) {
    try {
      const created = await mentorApi.createClass(data);
      setClasses([created, ...classes]);
      setShowCreate(false);
      setCreatedClass(created);
    } catch (e) {
      throw e;
    }
  }

  if (error) {
    return (
      <PageShell><div style={{ padding: 40 }}><p style={{ color: "#B85B47" }}>{error}</p></div></PageShell>
    );
  }

  if (!me || !classes) {
    return (
      <PageShell><div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkle /></div></PageShell>
    );
  }

  // Sunset BG dla wszystkich ekranow mentora - purple lavender -> peach -> salmon (z mockupu Magical workshop B)
  const MENTOR_SKY = { "--sky-top": "#E8D5FF", "--sky-mid": "#FFE0B5", "--sky-bot": "#FFD0B0" };
  return (
    <PageShell skyVars={MENTOR_SKY}>
      {/* TopBar mentora */}
      <div style={{ display: "flex", alignItems: "center", padding: "16px 18px", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 999, background: "var(--p-magic-dk)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, overflow: "hidden" }}>
          {me.picture ? <img src={me.picture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials(me.name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="t-display" style={{ fontSize: 18, lineHeight: 1.1, color: "var(--p-ink)" }}>{me.name}</div>
          <div style={{ fontSize: 12, color: "var(--p-ink-soft)" }}>{me.email}</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Wyloguj</button>
      </div>

      <div className="screen-scroll" style={{ flex: 1, padding: "8px 18px 52px", display: "flex", flexDirection: "column", gap: 14 }}>
        {classes.length === 0 ? (
          <EmptyState onCreate={() => setShowCreate(true)} />
        ) : (
          <>
            {/* Hero strip - Magical workshop B */}
            <div style={{ padding: "6px 4px 6px" }}>
              <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.6, color: "var(--p-magic-dk)", textTransform: "uppercase" }}>
                Dzień dobry, mentorze
              </div>
              <h1 className="t-display" style={{ fontSize: 30, lineHeight: 1, margin: "4px 0 6px" }}>
                Twoje klasy
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: "var(--p-ink-soft)", fontWeight: 700, lineHeight: 1.3 }}>
                <b style={{ color: "var(--p-magic-dk)" }}>{classes.reduce((s, c) => s + (c.student_count || 0), 0)}</b> aktywnych bohaterów ·{" "}
                <span>{classes.length} {classes.length === 1 ? "klasa" : classes.length < 5 ? "klasy" : "klas"}</span>
              </p>
            </div>

            {/* Jedna magical karta na klasę - bez opisu, bez kodu */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
              {classes.map((c) => <ClassCard key={c.id} cls={c} onClick={() => navigate(`/mentor/klasa/${c.id}`)} />)}
            </div>

            {/* Nowa klasa - line action */}
            <button className="btn btn-ghost btn-block" onClick={() => setShowCreate(true)} style={{ fontSize: 14 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 4, verticalAlign: "-3px" }}>
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
              Nowa klasa
            </button>
          </>
        )}

        <DemoPlayerCard navigate={navigate} />
      </div>

      {showCreate && <CreateClassModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
      {createdClass && <ClassCreatedModal cls={createdClass} onClose={() => setCreatedClass(null)} onGoToClass={() => navigate(`/mentor/klasa/${createdClass.id}`)} />}
    </PageShell>
  );
}

function DemoPlayerCard({ navigate }) {
  const [demo, setDemo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    mentorApi.getDemoPlayer().then((d) => setDemo(d.player)).catch(() => {});
  }, []);

  async function enterDemo() {
    setLoading(true);
    try {
      const res = await mentorApi.startDemoPlayer("Tester");
      session.setPlayer(res.player_id);
      try { localStorage.setItem("ewolucja.demoMode", "1"); } catch {}
      navigate(demo?.archetype ? "/world" : "/onboarding");
    } catch (e) {
      alert(e.message);
      setLoading(false);
    }
  }

  async function resetDemo() {
    if (!confirm("Zresetowac profil testowy? Caly postep zostanie usuniety.")) return;
    setLoading(true);
    try {
      await mentorApi.resetDemoPlayer();
      setDemo(null);
    } finally { setLoading(false); }
  }

  return (
    <div className="card" style={{ padding: "14px 16px", marginTop: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 28 }}>🎮</div>
        <div style={{ flex: 1 }}>
          <div className="t-display" style={{ fontSize: 15, color: "var(--p-ink)" }}>Tryb gracza (testowy)</div>
          <div style={{ fontSize: 12, color: "var(--p-ink-soft)", lineHeight: 1.35, marginTop: 2 }}>
            {demo
              ? <>Twój profil: <strong>{demo.name}</strong>{demo.archetype ? ` · ${demo.archetype}` : " · onboarding"}</>
              : "Wejdz jako uczeń, by przetestować grę. Profil testowy nie trafia do par ani klas."}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        <button className="btn btn-magic btn-sm" onClick={enterDemo} disabled={loading} style={{ flex: 1 }}>
          {demo ? "→ Wróć do gry" : "→ Wejdź jako uczeń"}
        </button>
        {demo && (
          <button className="btn btn-ghost btn-sm" onClick={resetDemo} disabled={loading}>
            ↻ Reset
          </button>
        )}
      </div>
    </div>
  );
}

function WhitelistPanel() {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState(null);
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && list === null) mentorApi.listWhitelist().then((d) => setList(d.emails || [])).catch((e) => setError(e.message));
  }, [open, list]);

  async function handleAdd() {
    setError(null);
    if (!email.trim()) return;
    setAdding(true);
    try {
      await mentorApi.addWhitelist(email.trim(), null);
      const d = await mentorApi.listWhitelist();
      setList(d.emails || []);
      setEmail("");
    } catch (e) { setError(e.message); } finally { setAdding(false); }
  }

  async function handleRemove(em) {
    if (!confirm(`Usunac ${em} z listy?`)) return;
    await mentorApi.removeWhitelist(em).catch(() => {});
    const d = await mentorApi.listWhitelist();
    setList(d.emails || []);
  }

  return (
    <div className="card" style={{ padding: "14px 16px", marginTop: 18 }}>
      <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left" }}>
        <span style={{ fontSize: 18 }}>{open ? "▾" : "▸"}</span>
        <div className="t-display" style={{ fontSize: 15, color: "var(--p-ink)", flex: 1 }}>Zaproś innych mentorów</div>
        {list && <span style={{ fontSize: 12, color: "var(--p-ink-soft)" }}>{list.length} osób</span>}
      </button>

      {open && (
        <div style={{ marginTop: 12 }}>
          <p style={{ fontSize: 12, color: "var(--p-ink-soft)", margin: "0 0 10px", lineHeight: 1.4 }}>
            Dodaj email Google osoby która ma móc zalogować się jako mentor. Bez dodania tu — Google zablokuje logowanie.
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !adding && handleAdd()}
              placeholder="mentor@gmail.com"
              style={{ flex: 1, padding: "10px 12px", border: "1.5px solid rgba(78,77,118,.16)", borderRadius: 10, background: "rgba(255,255,255,.92)", fontSize: 14, color: "var(--p-ink)", outline: "none" }}
            />
            <button className="btn btn-magic btn-sm" onClick={handleAdd} disabled={adding || !email.trim()}>
              {adding ? "..." : "+"}
            </button>
          </div>
          {error && <p style={{ color: "#B85B47", fontSize: 12, margin: "6px 0 0" }}>{error}</p>}

          {list && list.length > 0 && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {list.map((entry) => (
                <div key={entry.email} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "rgba(122,77,194,.06)", borderRadius: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: "var(--p-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.email}</div>
                    {entry.added_by_name && <div style={{ fontSize: 10, color: "var(--p-ink-soft)" }}>dodał: {entry.added_by_name}</div>}
                  </div>
                  <button onClick={() => handleRemove(entry.email)} style={{ background: "none", border: "none", color: "#B85B47", fontSize: 14, cursor: "pointer", padding: "2px 6px" }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="card card-paper pop-in" style={{ marginTop: 30, padding: "32px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 10 }}>🎓</div>
      <h2 className="t-display" style={{ fontSize: 22, margin: "0 0 6px", color: "var(--p-magic-dk)" }}>Twój gabinet jest pusty</h2>
      <p style={{ fontSize: 14, color: "var(--p-ink-soft)", margin: "0 0 18px", lineHeight: 1.4 }}>
        Stwórz pierwszą klasę, by zaprosić uczniów i zacząć przygodę razem.
      </p>
      <button className="btn btn-magic btn-block" style={{ maxWidth: 280, margin: "0 auto" }} onClick={onCreate}>
        ✦ Stwórz pierwszą klasę
      </button>
    </div>
  );
}

// Animacje portowane 1:1 z handoff B Magical workshop (aurora blobs + starfield + shimmer)
const MAGICAL_KEYFRAMES = `
  @keyframes aurora1 {
    0%,100% { transform: translate(0,0) scale(1); opacity: .85; }
    50%     { transform: translate(40px,30px) scale(1.15); opacity: 1; }
  }
  @keyframes aurora2 {
    0%,100% { transform: translate(0,0) scale(1); opacity: .7; }
    50%     { transform: translate(-30px,-40px) scale(1.2); opacity: 1; }
  }
  @keyframes aurora3 {
    0%,100% { transform: translate(0,0) scale(.9); opacity: .6; }
    50%     { transform: translate(-20px,30px) scale(1.1); opacity: .9; }
  }
  @keyframes mw-twinkle {
    0%,100% { opacity: .3; transform: scale(.7); }
    50%     { opacity: 1;  transform: scale(1.1); }
  }
  @keyframes mw-shimmer {
    0%   { background-position: -180% 0; }
    100% { background-position:  180% 0; }
  }
`;

const STARFIELD = [
  { x: "12%", y: "18%", s: 10, c: "#F4B7E0", d: 0 },
  { x: "76%", y: "12%", s: 14, c: "#fff",    d: 0.8 },
  { x: "88%", y: "40%", s: 8,  c: "#C8A0F0", d: 1.4 },
  { x: "18%", y: "62%", s: 12, c: "#E89AC7", d: 0.4 },
  { x: "48%", y: "82%", s: 9,  c: "#fff",    d: 2.0 },
  { x: "62%", y: "58%", s: 11, c: "#C8A0F0", d: 1.6 },
  { x: "30%", y: "42%", s: 7,  c: "#F4B7E0", d: 2.4 },
];

function ClassCard({ cls, onClick }) {
  // Magical workshop B - 1:1 z handoff3/mentor.jsx MentorHomeB.
  // Aurora blobs (3) + drifting starfield (7) + shimmer sweep + duza nazwa + 3-col count strip.
  const studentCount = cls.student_count || 0;
  const maxStudents = cls.max_students || 20;
  // Aktywni dziś: aproksymacja - student_count (gdy backend dostarczy active_today_count, podmienic).
  const activeToday = cls.active_today_count ?? studentCount;
  // Postęp tygodniowy klasy - placeholder do czasu agregacji backend.
  const weekPct = cls.week_progress_pct ?? Math.round((activeToday / Math.max(1, maxStudents)) * 100);

  return (
    <button onClick={onClick} className="pop-in" style={{ all: "unset", cursor: "pointer", display: "block", width: "100%" }}>
      <style>{MAGICAL_KEYFRAMES}</style>
      <div style={{
        position: "relative", borderRadius: 26, overflow: "hidden",
        background: "linear-gradient(160deg, #7A4DC2 0%, #4A2D80 70%, #2A1556 100%)",
        color: "#fff",
        boxShadow: "0 5px 0 rgba(28,16,60,.55), 0 22px 44px rgba(43,30,90,.45)",
        minHeight: 200,
      }}>
        {/* Aurora blob 1 - lewy gora rozowy */}
        <div aria-hidden="true" style={{
          position: "absolute", top: -30, left: -30, width: 180, height: 180,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,154,199,.55), transparent 65%)",
          filter: "blur(20px)",
          animation: "aurora1 9s ease-in-out infinite",
        }} />
        {/* Aurora blob 2 - dolny prawy */}
        <div aria-hidden="true" style={{
          position: "absolute", bottom: -40, right: -20, width: 200, height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(244,140,180,.45), transparent 65%)",
          filter: "blur(22px)",
          animation: "aurora2 11s ease-in-out infinite",
        }} />
        {/* Aurora blob 3 - srodkowy fioletowy */}
        <div aria-hidden="true" style={{
          position: "absolute", top: "30%", right: "25%", width: 100, height: 100,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184,134,232,.5), transparent 65%)",
          filter: "blur(18px)",
          animation: "aurora3 13s ease-in-out infinite",
        }} />

        {/* Drifting starfield */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          {STARFIELD.map((p, i) => (
            <div key={i} style={{
              position: "absolute", left: p.x, top: p.y,
              animation: "mw-twinkle 2.4s ease-in-out infinite",
              animationDelay: `${p.d}s`,
            }}>
              <svg width={p.s} height={p.s} viewBox="0 0 16 16">
                <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z" fill={p.c} />
              </svg>
            </div>
          ))}
        </div>

        {/* Shimmer sweep - diagonalny pasek przesuwajacy sie po karcie */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(110deg, transparent 38%, rgba(255,255,255,.18) 50%, transparent 62%)",
          backgroundSize: "200% 100%",
          animation: "mw-shimmer 6s linear infinite",
          pointerEvents: "none",
        }} />

        {/* Content na wierzchu */}
        <div style={{ position: "relative", padding: "22px 22px 18px", zIndex: 2 }}>
          {/* Wielka nazwa klasy - 80px, soft pink z gleboka tekstowa cieniem */}
          <h3 className="t-display" style={{
            fontSize: 80, lineHeight: 0.85, margin: "4px 0 12px",
            textShadow: "0 4px 0 rgba(28,16,60,.4), 0 10px 26px rgba(232,154,199,.65)",
            letterSpacing: -1,
            color: "rgb(251, 233, 249)",
          }}>
            {cls.name}
          </h3>

          {/* 3-kolumnowy strip: Bohaterowie / Aktywni / Tydzien */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.4, opacity: 0.65, textTransform: "uppercase" }}>
                Bohaterowie
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 2 }}>
                <span className="t-display" style={{ fontSize: 24, lineHeight: 1, color: "rgb(231, 240, 160)" }}>{studentCount}</span>
                <span style={{ fontSize: 13, fontWeight: 700, opacity: 0.55 }}>/ {maxStudents}</span>
              </div>
            </div>
            <div style={{ width: 1, height: 32, background: "rgba(255,255,255,.18)" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.4, opacity: 0.65, textTransform: "uppercase" }}>
                Aktywni
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 2 }}>
                <span className="t-display" style={{ fontSize: 24, lineHeight: 1, color: "rgb(231, 240, 160)" }}>{activeToday}</span>
                <span style={{ fontSize: 13, fontWeight: 700, opacity: 0.55 }}>dziś</span>
              </div>
            </div>
            <div style={{ width: 1, height: 32, background: "rgba(255,255,255,.18)" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.4, opacity: 0.65, textTransform: "uppercase" }}>
                Tydzień
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 2 }}>
                <span className="t-display" style={{ fontSize: 24, lineHeight: 1, color: "#fff" }}>{weekPct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function CreateClassModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maxStudents, setMaxStudents] = useState(30);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit() {
    if (!name.trim()) { setError("Nazwa klasy wymagana"); return; }
    setSubmitting(true);
    try {
      await onCreate({ name: name.trim(), description: description.trim() || null, maxStudents });
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="card pop-in" style={{ width: "100%", maxWidth: 420, padding: "22px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 className="t-display" style={{ fontSize: 22, margin: 0, color: "var(--p-magic-dk)" }}>Nowa klasa</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: "4px 10px" }}>✕</button>
        </div>
        <Field label="Nazwa klasy *">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="np. 3B SP nr 12" style={inputStyle} />
        </Field>
        <Field label="Krótki opis (opcjonalnie)">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} style={{ ...inputStyle, resize: "none" }} />
        </Field>
        <Field label="Limit uczniów">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setMaxStudents(Math.max(1, maxStudents - 1))}>−</button>
            <span className="t-display" style={{ fontSize: 20, minWidth: 32, textAlign: "center" }}>{maxStudents}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setMaxStudents(maxStudents + 1)}>+</button>
          </div>
        </Field>
        {error && <p style={{ color: "#B85B47", fontSize: 13, margin: "8px 0 0" }}>{error}</p>}
        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <button className="btn btn-ghost btn-block" onClick={onClose} disabled={submitting}>Anuluj</button>
          <button className="btn btn-magic btn-block" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Tworzę..." : "Utwórz klasę ✦"}
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

function ClassCreatedModal({ cls, onClose, onGoToClass }) {
  const [copied, setCopied] = useState(false);
  const inviteLink = `${window.location.origin}/dolacz?kod=${cls.invite_code}`;
  function copy(text) {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  }
  return (
    <ModalBackdrop onClose={onClose}>
      <div className="card card-paper pop-in" style={{ width: "100%", maxWidth: 420, padding: "26px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 6 }}>✨</div>
        <h2 className="t-display" style={{ fontSize: 22, margin: "0 0 6px", color: "var(--p-magic-dk)" }}>Klasa „{cls.name}" utworzona!</h2>
        <p style={{ fontSize: 13, color: "var(--p-ink-soft)", margin: "0 0 18px" }}>
          Podziel się kodem z rodzicami lub wyślij link do zaproszenia.
        </p>
        <div style={{ background: "rgba(122,77,194,.10)", borderRadius: 14, padding: "12px 14px", marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-magic-dk)" }}>KOD ZAPROSZENIA</div>
          <div className="t-display" style={{ fontSize: 22, margin: "4px 0", color: "var(--p-ink)" }}>{cls.invite_code}</div>
          <button className="btn btn-ghost btn-sm" onClick={() => copy(cls.invite_code)} style={{ marginTop: 4 }}>
            {copied ? "✓ Skopiowano" : "📋 Kopiuj kod"}
          </button>
        </div>
        <button className="btn btn-ghost btn-block" onClick={() => copy(inviteLink)} style={{ marginBottom: 10 }}>
          🔗 Skopiuj link zaproszenia
        </button>
        <button className="btn btn-magic btn-block" onClick={onGoToClass}>Idź do klasy →</button>
      </div>
    </ModalBackdrop>
  );
}

function ModalBackdrop({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,15,40,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 18, zIndex: 100 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%" }}>{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.4, color: "var(--p-ink-soft)", marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 12px",
  border: "1.5px solid rgba(78,77,118,.16)", borderRadius: 12,
  background: "rgba(255,255,255,.92)",
  fontFamily: "Nunito, sans-serif", fontSize: 15, color: "var(--p-ink)",
  outline: "none", boxSizing: "border-box",
};

function initials(name) {
  if (!name) return "?";
  return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}
