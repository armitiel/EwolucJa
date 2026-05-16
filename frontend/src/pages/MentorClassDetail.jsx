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
      </div>
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
        ? <ProfileAvatar profile={profileCode} size={44} />
        : <div style={{ fontSize: 28 }}>🌱</div>}
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
        <div style={{ position: "sticky", top: 0, background: "linear-gradient(180deg,#FCF5E1,#F4E3B8)", padding: "16px 18px", borderBottom: "1px solid rgba(78,77,118,.10)", display: "flex", alignItems: "center", gap: 10 }}>
          {profile && <ProfileAvatar profile={profile} size={48} />}
          <div style={{ flex: 1 }}>
            <div className="t-display" style={{ fontSize: 18, color: "var(--p-ink)" }}>{studentName}</div>
            <div style={{ fontSize: 12, color: "var(--p-ink-soft)" }}>
              {profile ? PROFILE_INFO[profile].name : "Onboarding..."} · {data?.total_coins ?? 0} ✦
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: "4px 10px" }}>✕</button>
        </div>

        {error && <div style={{ padding: 16, color: "#B85B47" }}>{error}</div>}
        {!data && !error && <div style={{ padding: 24, textAlign: "center", color: "var(--p-ink-soft)" }}>Ładuję...</div>}

        {data && (
          <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 16 }}>
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
                    <div key={m.id} style={{ background: "rgba(122,77,194,.06)", borderRadius: 10, padding: "8px 10px", marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--p-ink)" }}>{m.title || "Misja"}</div>
                      <div style={{ fontSize: 11, color: "var(--p-ink-soft)" }}>{m.status} · {new Date(m.generated_at).toLocaleDateString("pl-PL")}</div>
                    </div>
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
