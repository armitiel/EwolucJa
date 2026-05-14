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

  return (
    <PageShell>
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

      <div className="screen-scroll" style={{ flex: 1, padding: "12px 18px 52px", display: "flex", flexDirection: "column", gap: 14 }}>
        {classes.length === 0 ? (
          <EmptyState onCreate={() => setShowCreate(true)} />
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
              <h2 className="t-display" style={{ fontSize: 22, margin: 0, color: "var(--p-ink)" }}>Twoje klasy</h2>
              <button className="btn btn-magic btn-sm" onClick={() => setShowCreate(true)}>+ Nowa klasa</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginTop: 6 }}>
              {classes.map((c) => <ClassCard key={c.id} cls={c} onClick={() => navigate(`/mentor/klasa/${c.id}`)} />)}
            </div>
          </>
        )}
      </div>

      {showCreate && <CreateClassModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
      {createdClass && <ClassCreatedModal cls={createdClass} onClose={() => setCreatedClass(null)} onGoToClass={() => navigate(`/mentor/klasa/${createdClass.id}`)} />}
    </PageShell>
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

function ClassCard({ cls, onClick }) {
  const expiresInDays = cls.invite_code_expires_at
    ? Math.max(0, Math.ceil((new Date(cls.invite_code_expires_at) - Date.now()) / 86400000))
    : null;
  return (
    <button onClick={onClick} className="pop-in" style={{ background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer" }}>
      <div className="card" style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
          <h3 className="t-display" style={{ fontSize: 18, margin: 0, color: "var(--p-ink)" }}>{cls.name}</h3>
          <span style={{ fontSize: 12, color: "var(--p-ink-soft)" }}>{cls.student_count} / {cls.max_students}</span>
        </div>
        {cls.description && <p style={{ fontSize: 13, color: "var(--p-ink-soft)", margin: "0 0 10px" }}>{cls.description}</p>}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 8, padding: "8px 12px", background: "rgba(122,77,194,.08)", borderRadius: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.3, color: "var(--p-magic-dk)" }}>KOD</div>
            <div className="t-display" style={{ fontSize: 14, color: "var(--p-ink)", marginTop: 1 }}>{cls.invite_code}</div>
          </div>
          {expiresInDays !== null && (
            <div style={{ fontSize: 11, color: "var(--p-ink-soft)", textAlign: "right" }}>
              wygasa za<br />{expiresInDays}d
            </div>
          )}
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
