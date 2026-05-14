/**
 * MentorPairs — Kreator par "Rozdartej Mapy" dla klasy.
 *
 * Flow:
 *   1. Wejscie -> POST /api/pairs/suggest -> dostajemy:
 *      - suggestions: [{pair_definition_id, definition, player_a, player_b}]
 *      - unpaired: uczniowie bez pary (zostana solo)
 *      - noArchetype: uczniowie przed onboardingiem
 *   2. Mentor widzi liste propozycji, moze odznaczyc te ktorych nie chce wyslac
 *   3. Klik "Wyslij" -> POST /pairs/bulk-assign
 *   4. Toast sukcesu, redirect do widoku klasy
 */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import { Sparkle } from "../components/art.jsx";
import { mentorApi } from "../services/mentorApi.js";

const ARCHETYPE_NAMES = {
  EM: "Empata", ST: "Strateg", KR: "Kreator", LD: "Lider", DT: "Detektyw", MD: "Strażnik",
};
const ARCHETYPE_EMOJI = {
  EM: "💚", ST: "🦉", KR: "✨", LD: "🦁", DT: "🔍", MD: "🛡️",
};

export default function MentorPairs() {
  const { id: classId } = useParams();
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState({}); // pair_def_id -> bool
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    Promise.all([mentorApi.me(), mentorApi.suggestPairs(classId)])
      .then(([m, d]) => {
        setMe(m);
        setData(d);
        // Domyslnie wszystkie zaznaczone
        const sel = {};
        d.suggestions.forEach((s) => { sel[s.pair_definition_id] = true; });
        setSelected(sel);
      })
      .catch((e) => {
        if (e.status === 401) navigate("/mentor/zaloguj");
        else setError(e.message);
      });
  }, [classId, navigate]);

  async function handleSend() {
    if (!data) return;
    const accepted = data.suggestions.filter((s) => selected[s.pair_definition_id]);
    if (!accepted.length) { setError("Zaznacz przynajmniej jedną parę"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const result = await mentorApi.bulkAssignPairs(
        accepted.map((s) => ({
          player_a_id: s.player_a.id,
          player_b_id: s.player_b.id,
          pair_definition_id: s.pair_definition_id,
        })),
        me?.id || null
      );
      const errors = result.created.filter((c) => c.error);
      setSuccess({ total: accepted.length, errors: errors.length });
      setTimeout(() => navigate(`/mentor/klasa/${classId}`), 1800);
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  }

  if (error) return <PageShell><div style={{ padding: 40 }}><p style={{ color: "#B85B47" }}>{error}</p></div></PageShell>;
  if (!data) return <PageShell><div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkle /></div></PageShell>;

  return (
    <PageShell>
      <div style={{ display: "flex", alignItems: "center", padding: "16px 18px", gap: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/mentor/klasa/${classId}`)}>← Wróć</button>
      </div>

      <div className="screen-scroll" style={{ flex: 1, padding: "0 18px 96px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="card card-paper pop-in" style={{ padding: "18px 20px" }}>
          <h1 className="t-display" style={{ fontSize: 22, margin: 0, color: "var(--p-magic-dk)" }}>Kreator par „Rozdarta Mapa"</h1>
          <p style={{ fontSize: 13, color: "var(--p-ink-soft)", margin: "6px 0 0", lineHeight: 1.4 }}>
            System dobrał {data.suggestions.length} {plPair(data.suggestions.length)} z {data.total_students} uczniów.
            Odznacz te których nie chcesz wysłać.
          </p>
          {(data.unpaired.length > 0 || data.noArchetype.length > 0) && (
            <p style={{ fontSize: 12, color: "#B85B47", margin: "8px 0 0" }}>
              ⚠ {data.unpaired.length + data.noArchetype.length} {plStudent(data.unpaired.length + data.noArchetype.length)} bez pary — dostaną misję solo.
            </p>
          )}
        </div>

        <h2 className="t-display" style={{ fontSize: 17, margin: "8px 0 0", color: "var(--p-ink)" }}>
          Propozycje ({Object.values(selected).filter(Boolean).length} / {data.suggestions.length})
        </h2>

        {data.suggestions.length === 0 ? (
          <div className="card" style={{ padding: 20, textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "var(--p-ink-soft)", margin: 0 }}>
              Brak możliwych par — uczniowie nie mają jeszcze archetypów lub klasa za mała.
            </p>
          </div>
        ) : (
          data.suggestions.map((s) => (
            <PairCard
              key={s.pair_definition_id}
              suggestion={s}
              selected={!!selected[s.pair_definition_id]}
              onToggle={() => setSelected({ ...selected, [s.pair_definition_id]: !selected[s.pair_definition_id] })}
            />
          ))
        )}

        {(data.unpaired.length > 0 || data.noArchetype.length > 0) && (
          <div className="card" style={{ padding: "12px 16px", marginTop: 10 }}>
            <h3 className="t-display" style={{ fontSize: 14, margin: "0 0 8px", color: "var(--p-ink-soft)" }}>Bez pary</h3>
            {[...data.unpaired, ...data.noArchetype].map((s) => (
              <div key={s.id} style={{ fontSize: 13, color: "var(--p-ink)", padding: "3px 0" }}>
                {ARCHETYPE_EMOJI[s.archetype] || "🌱"} {s.name} {s.archetype ? `(${ARCHETYPE_NAMES[s.archetype]})` : "(onboarding)"}
              </div>
            ))}
          </div>
        )}

        {data.suggestions.length > 0 && (
          <button className="btn btn-leaf btn-block" style={{ marginTop: 18 }} onClick={handleSend} disabled={submitting}>
            {submitting ? "Wysyłam..." : `✦ Wyślij ${Object.values(selected).filter(Boolean).length} ${plPair(Object.values(selected).filter(Boolean).length)}`}
          </button>
        )}

        {success && (
          <div className="card card-paper pop-in" style={{ padding: "16px 18px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 4 }}>✨</div>
            <p className="t-display" style={{ fontSize: 17, margin: 0, color: "var(--p-magic-dk)" }}>
              Wysłano {success.total} {plPair(success.total)}!
              {success.errors > 0 && <span style={{ fontSize: 13, display: "block", color: "#B85B47", marginTop: 4 }}>({success.errors} błędów)</span>}
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function PairCard({ suggestion, selected, onToggle }) {
  const def = suggestion.definition;
  return (
    <button
      onClick={onToggle}
      className="pop-in"
      style={{
        background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer", width: "100%",
      }}
    >
      <div className="card" style={{
        padding: "14px 16px",
        border: selected ? "2px solid var(--p-magic-dk)" : "1.5px solid rgba(78,77,118,.10)",
        opacity: selected ? 1 : .55,
        transition: "all .15s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            border: "2px solid var(--p-magic-dk)",
            background: selected ? "var(--p-magic-dk)" : "transparent",
            color: "#fff", fontSize: 14, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {selected ? "✓" : ""}
          </div>
          <div className="t-display" style={{ fontSize: 16, color: "var(--p-ink)" }}>{def.task_title}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <span>{ARCHETYPE_EMOJI[suggestion.player_a.archetype]}</span>
          <strong>{suggestion.player_a.name}</strong>
          <span style={{ color: "var(--p-ink-soft)" }}>+</span>
          <span>{ARCHETYPE_EMOJI[suggestion.player_b.archetype]}</span>
          <strong>{suggestion.player_b.name}</strong>
        </div>
        <div style={{ marginTop: 6, padding: "4px 10px", background: "rgba(255,213,105,.20)", borderRadius: 8, display: "inline-block", fontSize: 12, color: "#7A4D10", fontWeight: 700 }}>
          🔑 {def.full_keyword}
        </div>
      </div>
    </button>
  );
}

function plPair(n) { return n === 1 ? "parę" : n >= 2 && n <= 4 ? "pary" : "par"; }
function plStudent(n) { return n === 1 ? "uczeń" : n >= 2 && n <= 4 ? "uczniów" : "uczniów"; }
