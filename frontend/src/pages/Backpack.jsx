/**
 * Backpack / ScreenBackpack — plecak z artefaktami zdobytymi w cyklach.
 * Pierwsza karta: szczegóły wybranego artefaktu. Niżej: siatka zdobytych + nieodkryte slots.
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, session } from "../services/api.js";
import PageShell from "../components/PageShell.jsx";
import Loading from "../components/Loading.jsx";
import TabBar from "../components/TabBar.jsx";
import { Artifact } from "../components/art.jsx";

// Stałe sloty "do odkrycia" — wizualizacja przyszłych krain
const PLACEHOLDER_SLOTS = [
  { kind: "book", name: "Księga Czasu" },
  { kind: "key", name: "Klucz do Wieży" },
  { kind: "shell", name: "Muszla Morza" },
];

// Mapowanie nazw artefaktów (z backendu) na typy wizualne (z biblioteki art)
function artifactKind(name = "") {
  const n = name.toLowerCase();
  if (n.includes("kompas") || n.includes("kryształ") || n.includes("krysztal")) return "crystal";
  if (n.includes("piór") || n.includes("pior")) return "feather";
  if (n.includes("liść") || n.includes("liscia")) return "leaf";
  if (n.includes("klucz")) return "key";
  if (n.includes("muszla")) return "shell";
  if (n.includes("księg") || n.includes("ksieg") || n.includes("atrament")) return "book";
  return "crystal";
}

export default function Backpack() {
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [open, setOpen] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = session.getPlayer();
    if (!id) {
      navigate("/onboarding");
      return;
    }
    api.getPlayer(id).then(setPlayer).catch((e) => setError(e.message));
  }, [navigate]);

  if (error)
    return (
      <PageShell>
        <div style={{ padding: 40 }}>
          <p style={{ color: "#B85B47" }}>{error}</p>
        </div>
      </PageShell>
    );
  if (!player) return <Loading text="Otwieranie plecaka…" />;

  const items = (player.backpack || []).slice().reverse(); // newest first
  const totalSlots = items.length + PLACEHOLDER_SLOTS.length;
  const cur = items[open];

  return (
    <PageShell>
      <div className="topbar">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/world")}>
          ‹
        </button>
        <div className="meta" style={{ textAlign: "center" }}>
          <div className="lbl">PLECAK ARTEFAKTÓW</div>
          <div className="nm">
            {items.length} z {totalSlots} odnalezione
          </div>
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          minHeight: 0,
          padding: "4px 18px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Szczegóły wybranego */}
        {cur ? (
          <div
            className="card card-paper"
            style={{ display: "flex", alignItems: "center", gap: 14 }}
          >
            <Artifact kind={artifactKind(cur.artifact_name)} size={72} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="t-display" style={{ fontSize: 22 }}>
                {cur.artifact_name}
              </div>
              <div style={{ fontSize: 12, color: "var(--p-ink-soft)" }}>
                z krainy: <b>Las Pytań</b>
              </div>
              <div style={{ fontSize: 11, color: "var(--p-ink-soft)", marginTop: 2 }}>
                {new Date(cur.awarded_at).toLocaleDateString("pl-PL", {
                  weekday: "short",
                  day: "numeric",
                  month: "long",
                })}
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                <span className="chip leaf">zdobyty</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="card card-paper" style={{ textAlign: "center" }}>
            <div className="t-display" style={{ fontSize: 18 }}>
              Plecak jest jeszcze pusty
            </div>
            <p style={{ fontSize: 13, color: "var(--p-ink-soft)" }}>
              Wykonaj pierwszą misję, aby zdobyć artefakt.
            </p>
            <button className="btn btn-magic btn-sm" onClick={() => navigate("/mission")}>
              Otwórz misję
            </button>
          </div>
        )}

        {/* Zdobyte */}
        {items.length > 0 && (
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1.5,
                color: "var(--p-ink-soft)",
                margin: "6px 0 8px",
              }}
            >
              ZDOBYTE
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {items.map((it, i) => (
                <button
                  key={it.artifact_id + i}
                  className="card card-tight shimmer"
                  onClick={() => setOpen(i)}
                  style={{
                    border: "none",
                    cursor: "pointer",
                    background:
                      open === i ? "rgba(184,134,232,.20)" : "rgba(255,255,255,.78)",
                    boxShadow:
                      open === i
                        ? "inset 0 0 0 2.5px var(--p-magic-dk)"
                        : "var(--shadow-sm)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Artifact kind={artifactKind(it.artifact_name)} size={50} />
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      textAlign: "center",
                      fontWeight: 800,
                      marginTop: 4,
                    }}
                  >
                    {it.artifact_name.split(" ")[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nieodkryte */}
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 1.5,
              color: "var(--p-ink-soft)",
              margin: "6px 0 8px",
            }}
          >
            JESZCZE NIEODKRYTE
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {PLACEHOLDER_SLOTS.map((it, i) => (
              <div
                key={i}
                className="card card-tight"
                style={{ filter: "grayscale(.8) opacity(.45)", textAlign: "center" }}
              >
                <Artifact kind={it.kind} size={50} />
                <div style={{ fontSize: 11, fontWeight: 800, marginTop: 4 }}>?</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TabBar current="backpack" />
    </PageShell>
  );
}
