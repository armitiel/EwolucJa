/**
 * MentorClassDetail — szczegoly klasy: lista uczniow, kod zaproszenia, akcje.
 */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import { Sparkle } from "../components/art.jsx";
import ProfileAvatar, { PROFILE_INFO } from "../components/ProfileAvatar.jsx";
import { mentorApi } from "../services/mentorApi.js";

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

  if (error) return <PageShell><div style={{ padding: 40 }}><p style={{ color: "#B85B47" }}>{error}</p></div></PageShell>;
  if (!data) return <PageShell><div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkle /></div></PageShell>;

  const inviteLink = `${window.location.origin}/dolacz?kod=${data.invite_code}`;

  return (
    <PageShell>
      {/* TopBar */}
      <div style={{ display: "flex", alignItems: "center", padding: "16px 18px", gap: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/mentor")}>← Wróć</button>
        <div style={{ flex: 1 }} />
        <button className="btn btn-ghost btn-sm" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? "..." : "↻ Odśwież"}
        </button>
      </div>

      <div className="screen-scroll" style={{ flex: 1, padding: "0 18px 52px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Header klasy */}
        <div className="card card-paper pop-in" style={{ padding: "18px 20px" }}>
          <h1 className="t-display" style={{ fontSize: 24, margin: 0, color: "var(--p-magic-dk)" }}>{data.name}</h1>
          <p style={{ fontSize: 13, color: "var(--p-ink-soft)", margin: "4px 0 14px" }}>
            {data.students.length} / {data.max_students} uczniów
            {data.description && ` · ${data.description}`}
          </p>

          <div style={{ background: "rgba(122,77,194,.10)", borderRadius: 14, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-magic-dk)" }}>KOD ZAPROSZENIA</div>
            <div className="t-display" style={{ fontSize: 22, margin: "4px 0 8px", color: "var(--p-ink)" }}>{data.invite_code}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button className="btn btn-ghost btn-sm" onClick={() => copyText(data.invite_code)}>{copied ? "✓" : "📋"} Kod</button>
              <button className="btn btn-ghost btn-sm" onClick={() => copyText(inviteLink)}>🔗 Link</button>
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

        {/* Rozdarta Mapa + zadania w realu - aktwowalna nawet bez par */}
        <button className="btn btn-leaf btn-block" style={{ marginTop: 16 }} onClick={() => navigate(`/mentor/klasa/${id}/pary`)}>
          ✦ Aktywuj Rozdartą Mapę {data.students.length < 2 && <span style={{ fontSize: 11, opacity: .8 }}>(zadania w realu)</span>}
        </button>
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
  return (
    <div
      className="card pop-in"
      onClick={onClick}
      style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
    >
      {profileCode
        ? <ProfileAvatar profile={profileCode} size={88} variant="mini" />
        : <PendingAvatar size={88} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="t-display" style={{ fontSize: 16, color: "var(--p-ink)" }}>{student.name}</div>
        <div style={{ fontSize: 12, color: "var(--p-ink-soft)" }}>
          {profileCode ? PROFILE_INFO[profileCode].name : "Onboarding..."}
          {student.last_mission_status && ` · ${student.last_mission_status}`}
        </div>
      </div>
      <div style={{ fontSize: 11, color: "var(--p-ink-soft)", textAlign: "right" }}>
        {lastActivity ? timeAgo(lastActivity) : "—"}
      </div>
      {onDelete && (
        <button
          onClick={onDelete}
          title="Usuń z klasy"
          style={{ background: "none", border: "none", color: "#B85B47", fontSize: 16, cursor: "pointer", padding: "4px 8px", marginLeft: 4 }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

function StudentDetailModal({ classId, studentId, studentName, onClose }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [hintBody, setHintBody] = useState("");
  const [hintTitle, setHintTitle] = useState("");
  const [hintKind, setHintKind] = useState("hint");
  const [sending, setSending] = useState(false);

  async function load() {
    try { setData(await mentorApi.getStudent(classId, studentId)); }
    catch (e) { setError(e.message); }
  }
  useEffect(() => { load(); }, [classId, studentId]);

  async function sendHint() {
    if (!hintBody.trim()) return;
    setSending(true);
    try {
      await mentorApi.sendHint(studentId, { kind: hintKind, title: hintTitle.trim() || null, body: hintBody.trim() });
      setHintBody(""); setHintTitle("");
      await load();
    } catch (e) { alert(e.message); }
    setSending(false);
  }

  const profile = data?.player ? mapToProfileCode(data.player.archetype) : null;
  const scores = data?.player?.lifetime_scores || {};

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,15,40,.65)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 14 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 440, maxHeight: "92vh", overflow: "auto", borderRadius: 16, background: "#fff" }}>
        <div style={{ position: "sticky", top: 0, background: "linear-gradient(180deg,#FCF5E1,#F4E3B8)", padding: "16px 18px", borderBottom: "1px solid rgba(78,77,118,.10)", display: "flex", alignItems: "center", gap: 12 }}>
          {profile
            ? <ProfileAvatar profile={profile} size={56} variant="mini" />
            : <PendingAvatar size={56} />}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="t-display" style={{ fontSize: 20, color: "var(--p-ink)", lineHeight: 1.1 }}>{studentName}</div>
            <div style={{ fontSize: 13, color: profile ? PROFILE_INFO[profile].color : "var(--p-ink-soft)", fontWeight: 700, marginTop: 2 }}>
              {profile ? PROFILE_INFO[profile].name : "Onboarding..."}
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: "4px 10px" }}>✕</button>
        </div>

        {error && <div style={{ padding: 16, color: "#B85B47" }}>{error}</div>}
        {!data && !error && <div style={{ padding: 24, textAlign: "center", color: "var(--p-ink-soft)" }}>Ładuję...</div>}

        {data && (
          <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* POSTEP TYGODNIA - progress bar jak u ucznia */}
            <section style={{ background: "linear-gradient(180deg, #FCF5E1 0%, #F4E3B8 100%)", border: "1.5px solid #E1CB94", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 800, color: "#7A4D10", marginBottom: 6, letterSpacing: 1.2 }}>
                <span>POSTĘP TYGODNIA</span>
                <span>{data.total_coins} / 100 ✦</span>
              </div>
              <div className="prog magic"><i style={{ width: `${Math.min(100, Math.round((data.total_coins / 100) * 100))}%` }} /></div>
              {data.week_coins > 0 && (
                <div style={{ fontSize: 11, color: "var(--p-magic-dk)", marginTop: 6, fontWeight: 700 }}>
                  +{data.week_coins} ✦ w ostatnim tygodniu
                </div>
              )}
            </section>

            {/* SCORES */}
            <section>
              <h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, color: "var(--p-ink-soft)", margin: "0 0 8px" }}>PUNKTY CECH</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                {["DT","EM","ST","KR","LD","MD"].map((p) => {
                  const info = PROFILE_INFO[p];
                  return (
                    <div key={p} style={{ background: `${info.color}1a`, borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: info.color, letterSpacing: .5 }}>{info.name.slice(0,3).toUpperCase()}</div>
                      <div className="t-display" style={{ fontSize: 18, color: info.color, lineHeight: 1 }}>{scores[p] || 0}</div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* MISJE */}
            <section>
              <h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, color: "var(--p-ink-soft)", margin: "0 0 8px" }}>OSTATNIE ZADANIA W REALU ({data.missions.length})</h3>
              {data.missions.length === 0
                ? <div style={{ fontSize: 13, color: "var(--p-ink-soft)" }}>Brak zadań.</div>
                : data.missions.slice(0, 5).map((m) => (
                    <MissionCard key={m.id} mission={m} onVerify={async (decision) => {
                      try {
                        await mentorApi.verifyMission(m.id, decision, null);
                        await load();
                      } catch (e) { alert(e.message); }
                    }} />
                  ))
              }
            </section>

            {/* HINTS HISTORY */}
            <section>
              <h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, color: "var(--p-ink-soft)", margin: "0 0 8px" }}>WYSŁANE WSKAZÓWKI ({data.hints.length})</h3>
              {data.hints.length === 0
                ? <div style={{ fontSize: 13, color: "var(--p-ink-soft)" }}>Nic jeszcze nie wysłano.</div>
                : data.hints.slice(0, 5).map((h) => (
                    <div key={h.id} style={{ background: "rgba(255,213,105,.18)", borderRadius: 10, padding: "8px 10px", marginBottom: 6 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#7A4D10" }}>
                        {h.kind === "artifact" ? "🎁" : h.kind === "message" ? "💬" : "💡"} {h.title || h.kind}
                      </div>
                      <div style={{ fontSize: 12, color: "#5C4220", marginTop: 2 }}>{h.body}</div>
                      <div style={{ fontSize: 10, color: "var(--p-ink-soft)", marginTop: 4 }}>
                        {new Date(h.sent_at).toLocaleString("pl-PL")} · {h.viewed_at ? "✓ widziane" : "niewidziane"}
                      </div>
                    </div>
                  ))
              }
            </section>

            {/* WYSLIJ NOWY HINT */}
            <section>
              <h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, color: "var(--p-magic-dk)", margin: "0 0 8px" }}>WYŚLIJ PODPOWIEDŹ / ARTEFAKT</h3>
              <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                {["hint","artifact","message"].map((k) => (
                  <button key={k} onClick={() => setHintKind(k)} className="btn btn-ghost btn-sm" style={{ flex: 1, background: hintKind === k ? "rgba(122,77,194,.18)" : undefined, color: hintKind === k ? "var(--p-magic-dk)" : "var(--p-ink-soft)" }}>
                    {k === "artifact" ? "🎁 Artefakt" : k === "message" ? "💬 Wiadomość" : "💡 Hint"}
                  </button>
                ))}
              </div>
              <input
                value={hintTitle}
                onChange={(e) => setHintTitle(e.target.value)}
                placeholder="Tytuł (opcjonalnie, np. 'Klucz do drzwi')"
                style={{ width: "100%", padding: "8px 10px", border: "1.5px solid rgba(78,77,118,.16)", borderRadius: 10, fontSize: 13, marginBottom: 6, boxSizing: "border-box" }}
              />
              <textarea
                value={hintBody}
                onChange={(e) => setHintBody(e.target.value)}
                placeholder="Treść (np. 'Spróbuj zacząć od słowa Złota...')"
                style={{ width: "100%", minHeight: 70, padding: "10px 12px", border: "1.5px solid rgba(78,77,118,.16)", borderRadius: 10, fontSize: 14, resize: "vertical", boxSizing: "border-box", fontFamily: "Nunito,sans-serif" }}
              />
              <button className="btn btn-magic btn-block" style={{ marginTop: 8 }} onClick={sendHint} disabled={sending || !hintBody.trim()}>
                {sending ? "Wysyłam..." : "✦ Wyślij"}
              </button>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

// Karta misji w modal mentora - pokazuje status, dowod, akcje verify
function MissionCard({ mission, onVerify }) {
  const status = mission.status;
  const proof = mission.submitted_proof;
  const verification = mission.gm_verification;
  const statusColor = status === "verified" ? "#3B6D11" : status === "submitted" ? "var(--p-magic-dk)" : status === "rejected" ? "#B85B47" : "var(--p-ink-soft)";
  const statusBg = status === "verified" ? "rgba(99,153,34,.18)" : status === "submitted" ? "rgba(122,77,194,.15)" : status === "rejected" ? "rgba(184,91,71,.15)" : "rgba(78,77,118,.08)";
  const statusLabel = status === "verified" ? "✓ zatwierdzono" : status === "submitted" ? "✉ czeka na sprawdzenie" : status === "rejected" ? "↺ do poprawy" : status || "pending";

  return (
    <div style={{ background: "rgba(122,77,194,.06)", borderRadius: 12, padding: "10px 12px", marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--p-ink)", flex: 1 }}>{mission.title || "Misja"}</div>
        <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999, background: statusBg, color: statusColor, whiteSpace: "nowrap" }}>{statusLabel}</span>
      </div>
      <div style={{ fontSize: 11, color: "var(--p-ink-soft)" }}>{new Date(mission.generated_at).toLocaleDateString("pl-PL")}</div>

      {/* Dowod ucznia */}
      {proof?.proof_text && (
        <div style={{ marginTop: 8, padding: "8px 10px", background: "rgba(255,255,255,.7)", borderRadius: 8, borderLeft: "3px solid var(--p-magic-dk)" }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.2, color: "var(--p-ink-soft)" }}>DOWÓD UCZNIA</div>
          <div style={{ fontSize: 13, color: "var(--p-ink)", marginTop: 2, lineHeight: 1.4, fontFamily: "Caveat, cursive" }}>
            „{proof.proof_text}"
          </div>
        </div>
      )}

      {/* Komentarz mentora po weryfikacji */}
      {verification?.comment && (
        <div style={{ marginTop: 6, fontSize: 11, color: statusColor, fontStyle: "italic" }}>
          „{verification.comment}" — Twoja decyzja
        </div>
      )}

      {/* Przyciski akcji - tylko jezeli status submitted */}
      {status === "submitted" && onVerify && (
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <button onClick={() => onVerify("reject")} className="btn btn-ghost btn-sm" style={{ flex: 1, color: "#B85B47" }}>
            ↺ Do poprawy
          </button>
          <button onClick={() => onVerify("approve")} className="btn btn-leaf btn-sm" style={{ flex: 1 }}>
            ✓ Zatwierdź (+20 ✦)
          </button>
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
