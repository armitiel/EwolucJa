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

  useEffect(() => {
    mentorApi.getClass(id).then(setData).catch((e) => {
      if (e.status === 401) navigate("/mentor/zaloguj");
      else setError(e.message);
    });
  }, [id, navigate]);

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
              onDelete={async () => {
                if (!confirm(`Usunąć ${s.name} z klasy? Cały postęp ucznia zostanie skasowany.`)) return;
                try {
                  await mentorApi.deleteStudent(id, s.id);
                  setData({ ...data, students: data.students.filter((st) => st.id !== s.id) });
                } catch (e) { alert(e.message); }
              }}
            />
          ))
        )}

        {data.students.length >= 2 && (
          <button className="btn btn-leaf btn-block" style={{ marginTop: 16 }} onClick={() => navigate(`/mentor/klasa/${id}/pary`)}>
            ✦ Aktywuj Rozdartą Mapę
          </button>
        )}
      </div>
    </PageShell>
  );
}

function StudentRow({ student, onDelete }) {
  const lastActivity = student.last_activity ? new Date(student.last_activity) : null;
  // Mapuj stary kod archetypu (nazwa) na profil (kod). Profile player.archetype trzyma kod profilu (DT/ST/...) lub stary archetyp string.
  const profileCode = mapToProfileCode(student.archetype);
  return (
    <div className="card pop-in" style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
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
