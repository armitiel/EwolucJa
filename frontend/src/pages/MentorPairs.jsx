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
import ProfileAvatar, { PROFILE_INFO } from "../components/ProfileAvatar.jsx";
import { mentorApi } from "../services/mentorApi.js";

const LEGACY = { tropiciel_tajemnic: "DT", zaklinacz_uczuc: "EM", mistrz_map: "ST", tkacz_snow: "KR", gwardzista_odwagi: "LD", straznik_mostu: "MD" };
function code(v) { return PROFILE_INFO[v] ? v : (LEGACY[v] || v); }

export default function MentorPairs() {
  const { id: classId } = useParams();
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [data, setData] = useState(null);
  const [activePairs, setActivePairs] = useState(null);
  const [selected, setSelected] = useState({}); // pair_def_id -> bool
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  function loadAll() {
    Promise.all([mentorApi.me(), mentorApi.suggestPairs(classId), mentorApi.listActivePairsForClass(classId)])
      .then(([m, d, a]) => {
        setMe(m);
        setData(d);
        setActivePairs(a.pairs || []);
        const sel = {};
        d.suggestions.forEach((s) => { sel[s.pair_definition_id] = true; });
        setSelected(sel);
      })
      .catch((e) => {
        if (e.status === 401) navigate("/mentor/zaloguj");
        else setError(e.message);
      });
  }

  useEffect(() => { loadAll(); }, [classId, navigate]);

  async function markCompleted(assignmentId) {
    if (!confirm("Oznaczyć tę parę jako wykonaną?")) return;
    try {
      await mentorApi.completePair(assignmentId);
      setActivePairs(activePairs.map((p) => p.id === assignmentId ? { ...p, status: "completed", completed_at: new Date().toISOString() } : p));
    } catch (e) { alert(e.message); }
  }

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
        {/* AKTYWNE PARY - status biezacych zadan */}
        {activePairs && activePairs.length > 0 && (
          <>
            <h2 className="t-display" style={{ fontSize: 17, margin: "8px 0 0", color: "var(--p-ink)" }}>
              Aktywne zadania ({activePairs.length})
            </h2>
            {activePairs.map((pair) => (
              <ActivePairCard key={pair.id} pair={pair} onMarkCompleted={() => markCompleted(pair.id)} />
            ))}
            <div style={{ height: 8 }} />
          </>
        )}

        <div className="card card-paper pop-in" style={{ padding: "18px 20px" }}>
          <h1 className="t-display" style={{ fontSize: 22, margin: 0, color: "var(--p-magic-dk)" }}>{activePairs?.length > 0 ? "Dodaj kolejne pary" : "Kreator par „Rozdarta Mapa"}</h1>
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
                {(PROFILE_INFO[code(s.archetype)]?.emoji) || "🌱"} {s.name} {s.archetype ? `(${PROFILE_INFO[code(s.archetype)]?.name})` : "(onboarding)"}
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

function ActivePairCard({ pair, onMarkCompleted }) {
  const def = pair.definition;
  const status = pair.status; // pending | matched | completed
  const statusColor = status === "completed" ? "#3B6D11" : status === "matched" ? "#7A4D10" : "var(--p-magic-dk)";
  const statusBg = status === "completed" ? "rgba(99,153,34,.18)" : status === "matched" ? "rgba(255,213,105,.30)" : "rgba(122,77,194,.15)";
  const statusLabel = status === "completed" ? "✓ Wykonane" : status === "matched" ? "⚡ W trakcie zadania" : "⏳ Czeka na połączenie";

  return (
    <div className="card pop-in" style={{ padding: "14px 16px", opacity: status === "completed" ? .7 : 1 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
        <div className="t-display" style={{ fontSize: 16, color: "var(--p-ink)" }}>{def?.task_title || "Zadanie"}</div>
        <span style={{ fontSize: 11, fontWeight: 800, color: statusColor, background: statusBg, padding: "3px 8px", borderRadius: 999 }}>
          {statusLabel}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
        <PlayerLine profile={code(pair.player_a_archetype)} name={pair.player_a_name} word={def?.word_a} />
        <PlayerLine profile={code(pair.player_b_archetype)} name={pair.player_b_name} word={def?.word_b} />
      </div>

      <div style={{ marginTop: 8, padding: "4px 10px", background: "rgba(255,213,105,.20)", borderRadius: 8, display: "inline-block", fontSize: 12, color: "#7A4D10", fontWeight: 700 }}>
        🔑 {def?.full_keyword}
      </div>

      {status === "matched" && (
        <button className="btn btn-leaf btn-sm" style={{ marginTop: 10, width: "100%" }} onClick={onMarkCompleted}>
          ✓ Oznacz jako wykonane
        </button>
      )}
      {status === "pending" && (
        <p style={{ fontSize: 11, color: "var(--p-ink-soft)", margin: "8px 0 0", fontStyle: "italic" }}>
          Uczniowie nie połączyli się jeszcze. Mają osobne słowa-połówki i muszą się znaleźć w sali.
        </p>
      )}
    </div>
  );
}

function PlayerLine({ profile, name, word }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {profile && PROFILE_INFO[profile]
        ? <div style={{ width: 28, height: 28, flexShrink: 0 }}><ProfileAvatar profile={profile} size={28} /></div>
        : <span style={{ fontSize: 18 }}>🌱</span>}
      <strong style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</strong>
      <span style={{ fontSize: 11, color: "var(--p-ink-soft)" }}>słowo: <strong style={{ color: "var(--p-ink)" }}>{word}</strong></span>
    </div>
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
          {PROFILE_INFO[code(suggestion.player_a.archetype)] && <div style={{ width: 26, height: 26 }}><ProfileAvatar profile={code(suggestion.player_a.archetype)} size={26} /></div>}
          <strong>{suggestion.player_a.name}</strong>
          <span style={{ color: "var(--p-ink-soft)" }}>+</span>
          {PROFILE_INFO[code(suggestion.player_b.archetype)] && <div style={{ width: 26, height: 26 }}><ProfileAvatar profile={code(suggestion.player_b.archetype)} size={26} /></div>}
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
