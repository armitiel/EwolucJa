import React, { useEffect, useState } from "react";
import { api, session } from "../services/api.js";
import PageShell from "../components/PageShell.jsx";
import NarratorVoice from "../components/NarratorVoice.jsx";
import { Avatar, MoonPhase } from "../components/art.jsx";

export default function GMPanel() {
  const [account, setAccount] = useState(null);
  const [step, setStep] = useState("auth");
  const [authMode, setAuthMode] = useState("register");
  const [form, setForm] = useState({ role: "parent", name: "", email: "", pairing_code: "" });
  const [loginId, setLoginId] = useState("");
  const [queue, setQueue] = useState([]);
  const [tab, setTab] = useState("children");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = session.getGM();
    if (saved) loadAccount(saved);
  }, []);

  async function loadAccount(id) {
    try {
      const acc = await api.getGM(id);
      setAccount(acc);
      session.setGM(acc.account_id);
      const q = await api.getGMQueue(acc.account_id);
      setQueue(q.missions || []);
      setStep("dashboard");
    } catch (e) {
      setError(e.message);
      session.setGM("");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const acc = await api.registerGM({
        role: form.role,
        name: form.name,
        email: form.email,
        pairing_code: form.pairing_code || undefined,
      });
      session.setGM(acc.account_id);
      await loadAccount(acc.account_id);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loadAccount(loginId.trim());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(missionId, verdict, comment) {
    try {
      await api.verifyMission(missionId, {
        account_id: account.account_id,
        verdict,
        comment_text: comment || "",
      });
      const q = await api.getGMQueue(account.account_id);
      setQueue(q.missions || []);
    } catch (e) {
      setError(e.message);
    }
  }

  function logout() {
    session.setGM("");
    setAccount(null);
    setStep("auth");
    setQueue([]);
  }

  if (step === "auth") {
    return (
      <PageShell sky="dawn">
        <div className="topbar">
          <div className="meta" style={{ textAlign: "center" }}>
            <div className="lbl">PANEL MENTORA</div>
            <div className="nm">Witaj, dorosły</div>
          </div>
          <div style={{ width: 36, fontSize: 24, textAlign: "right" }}>🦉</div>
        </div>
        <div style={{ flex: 1, padding: "10px 18px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
          <p className="t-hand" style={{ fontSize: 18, color: "var(--p-ink-soft)", margin: 0, textAlign: "center" }}>
            Z perspektywy dziecka pozostajesz jednym wspólnym Mentorem.
          </p>
          <div style={{ display: "flex", background: "rgba(255,255,255,.7)", borderRadius: 14, padding: 4 }}>
            {[["register", "Nowe konto"], ["login", "Mam konto"]].map(([k, l]) => (
              <button key={k} onClick={() => setAuthMode(k)} style={{ flex: 1, border: "none", cursor: "pointer", padding: "8px 6px", fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 13, borderRadius: 10, background: authMode === k ? "linear-gradient(180deg,#FFD269,#E89A3D)" : "transparent", color: authMode === k ? "#4A2A0E" : "var(--p-ink-soft)", boxShadow: authMode === k ? "0 2px 0 #B47322" : "none" }}>{l}</button>
            ))}
          </div>
          {authMode === "register" ? (
            <form onSubmit={handleRegister} className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Label>Rola</Label>
              <div style={{ display: "flex", gap: 8 }}>
                {[["parent", "Rodzic"], ["teacher", "Nauczyciel"]].map(([k, l]) => (
                  <button type="button" key={k} className={form.role === k ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm"} style={{ flex: 1 }} onClick={() => setForm({ ...form, role: k })}>{l}</button>
                ))}
              </div>
              <Label>Twoje imię</Label>
              <Input value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <Label>E-mail (opcjonalnie)</Label>
              <Input type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <Label>Kod parowania od dziecka (opcjonalnie)</Label>
              <Input value={form.pairing_code} onChange={(v) => setForm({ ...form, pairing_code: v.toUpperCase() })} placeholder="ABC123" />
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? "Tworzę…" : "Utwórz konto Mentora"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Label>Identyfikator konta GM</Label>
              <Input value={loginId} onChange={setLoginId} placeholder="gm_..." required />
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? "Loguję…" : "Zaloguj"}
              </button>
            </form>
          )}
          {error && <p style={{ color: "#B85B47" }}>{error}</p>}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell sky="dawn">
      <div className="topbar">
        <button className="btn btn-ghost btn-sm" onClick={logout}>Wyloguj</button>
        <div className="meta" style={{ textAlign: "center" }}>
          <div className="lbl">PANEL MENTORA · {account.role === "parent" ? "rodzic" : "nauczyciel"}</div>
          <div className="nm">{account.name}</div>
        </div>
        <div style={{ width: 36, fontSize: 24, textAlign: "right" }}>🦉</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "4px 18px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", background: "rgba(255,255,255,.7)", borderRadius: 14, padding: 4 }}>
          {[["children", "Tropiciele"], ["week", "Ten cykl"], ["settings", "Ton i tempo"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ flex: 1, border: "none", cursor: "pointer", padding: "8px 6px", fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 12, borderRadius: 10, background: tab === k ? "linear-gradient(180deg,#FFD269,#E89A3D)" : "transparent", color: tab === k ? "#4A2A0E" : "var(--p-ink-soft)", boxShadow: tab === k ? "0 2px 0 #B47322" : "none" }}>{l}</button>
          ))}
        </div>

        {tab === "children" && (
          <>
            {account.paired_player_ids.length === 0 ? (
              <div className="card">
                <p style={{ fontSize: 14, color: "var(--p-ink-soft)" }}>
                  Nikt jeszcze nie jest podpięty. Poproś dziecko o kod parowania.
                </p>
              </div>
            ) : (
              account.paired_player_ids.map((pid) => <ChildCard key={pid} playerId={pid} />)
            )}
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-ink-soft)", marginTop: 6 }}>
              MISJE DO WERYFIKACJI ({queue.length})
            </div>
            {queue.length === 0 ? (
              <div className="card">
                <p style={{ fontSize: 13, color: "var(--p-ink-soft)" }}>
                  Wszystko ogarnięte. W piątek wracaj — tam się dzieje.
                </p>
              </div>
            ) : (
              queue.map((m) => <MissionVerifyCard key={m.mission_id} mission={m} onVerify={handleVerify} />)
            )}
          </>
        )}

        {tab === "week" && (
          <>
            <div className="card">
              <div className="t-display" style={{ fontSize: 22 }}>Cykl tygodnia — dzień 4 z 5</div>
              <div className="prog magic" style={{ marginTop: 10 }}><i style={{ width: "60%" }} /></div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <Pillar phase={1} label="Pytanie" status="✓" />
                <Pillar phase={2} label="Słuchanie" status="✓" />
                <Pillar phase={3} label="Tropienie" status="…" active />
                <Pillar phase={0} label="Echo" status="—" />
              </div>
            </div>
            <div className="card">
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-ink-soft)" }}>WGLĄD</div>
              <div className="t-hand" style={{ fontSize: 19, marginTop: 4 }}>
                „Twoje dziecko chętnie zadaje pytania, ale rzadko zapisuje odpowiedzi."
              </div>
            </div>
          </>
        )}

        {tab === "settings" && (
          <>
            <div className="card">
              <div className="t-display" style={{ fontSize: 20 }}>Ton wiadomości</div>
              <div style={{ fontSize: 12, color: "var(--p-ink-soft)", marginBottom: 10 }}>
                Jak ma się zwracać do dziecka jego mentor-przewodnik?
              </div>
              {[["cieplo", "Ciepły bajarz"], ["energia", "Energiczny przewodnik (wybrane)"], ["tajemnica", "Tajemniczy mentor"]].map(([k, l], i) => (
                <label key={k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, cursor: "pointer", background: i === 1 ? "rgba(184,134,232,.16)" : "transparent", marginTop: 6 }}>
                  <input type="radio" name="ton" defaultChecked={i === 1} style={{ accentColor: "var(--p-magic-dk)" }} />
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{l}</span>
                </label>
              ))}
            </div>
            <div className="card">
              <div className="t-display" style={{ fontSize: 20 }}>Tempo cykli</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {["7 dni", "5 dni", "3 dni"].map((d, i) => (
                  <button key={d} className={i === 0 ? "btn btn-magic btn-sm" : "btn btn-ghost btn-sm"} style={{ flex: 1 }}>{d}</button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}

const Label = ({ children }) => (
  <label style={{ fontSize: 13, fontWeight: 700, color: "var(--p-ink-soft)" }}>{children}</label>
);

const Input = ({ value, onChange, ...rest }) => (
  <input value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid rgba(122,77,194,.30)", background: "rgba(255,255,255,.85)", fontSize: 15, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} {...rest} />
);

const Pillar = ({ phase, label, status, active }) => (
  <div style={{ flex: 1, textAlign: "center", padding: "10px 4px", borderRadius: 14, background: active ? "rgba(184,134,232,.18)" : "rgba(255,255,255,.5)", boxShadow: active ? "inset 0 0 0 2px var(--p-magic-dk)" : "none" }}>
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
      <MoonPhase phase={phase} size={28} glow={active} />
    </div>
    <div style={{ fontSize: 10, fontWeight: 800, color: "var(--p-ink-soft)" }}>{label}</div>
    <div style={{ fontSize: 14, fontWeight: 800, color: status === "✓" ? "var(--p-leaf-dk)" : "var(--p-magic-dk)" }}>{status}</div>
  </div>
);

function ChildCard({ playerId }) {
  const [child, setChild] = useState(null);
  useEffect(() => {
    api.getPlayer(playerId).then(setChild).catch(() => {});
  }, [playerId]);
  if (!child) return <div className="card"><div style={{ opacity: 0.6 }}>Ładuję…</div></div>;
  return (
    <div className="card" style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Avatar kind="fox" size={56} evolved={1} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="t-display" style={{ fontSize: 20 }}>{child.player_name}</div>
        <div style={{ fontSize: 11, color: "var(--p-ink-soft)" }}>Cykl #1</div>
        <div className="prog magic" style={{ marginTop: 6 }}><i style={{ width: "60%" }} /></div>
        <div className="t-hand" style={{ fontSize: 16, marginTop: 4, color: "var(--p-ink-soft)" }}>
          {(child.backpack || []).length > 0 ? `zdobył: ${child.backpack[child.backpack.length - 1].artifact_name}` : "jeszcze nic nie zdobył"}
        </div>
      </div>
    </div>
  );
}

function MissionVerifyCard({ mission, onVerify }) {
  const [comment, setComment] = useState("");
  const proofText = mission.submitted_proof?.proof_text || "";
  return (
    <div className="card">
      <p style={{ fontSize: 11, color: "var(--p-ink-soft)", margin: 0 }}>
        {mission.player_name} · cykl {mission.cycle_id?.slice(-6)}
      </p>
      <h3 className="t-display" style={{ fontSize: 17, margin: "4px 0" }}>{mission.title}</h3>
      <p style={{ fontSize: 14, color: "var(--p-ink-soft)", marginBottom: 8 }}>{mission.body}</p>
      {proofText && (
        <div style={{ background: "rgba(184,134,232,.12)", borderRadius: 12, padding: "8px 10px", marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <p style={{ fontSize: 11, color: "var(--p-ink-soft)", margin: 0, fontWeight: 800 }}>ECHO DZIECKA</p>
            <NarratorVoice text={proofText} land="mentor" tone="calm" autoPlay={false} />
          </div>
          <p style={{ fontSize: 14, marginTop: 4, fontFamily: "Caveat, cursive", lineHeight: 1.3 }}>{proofText}</p>
        </div>
      )}
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Komentarz Mentora (opcjonalnie)" rows={2}
        style={{ width: "100%", padding: 10, borderRadius: 10, border: "1.5px solid rgba(122,77,194,.20)", background: "rgba(255,255,255,.85)", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", resize: "vertical" }} />
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button className="btn btn-leaf btn-sm" style={{ flex: 1 }} onClick={() => onVerify(mission.mission_id, "approved", comment)}>✓ Zatwierdź</button>
        <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => onVerify(mission.mission_id, "highlighted", comment)}>✦ Wyróżnij</button>
        <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => onVerify(mission.mission_id, "needs_followup", comment)}>💬 Dopytaj</button>
      </div>
    </div>
  );
}
