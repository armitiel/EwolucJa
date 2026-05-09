import React from "react";
import { useNavigate } from "react-router-dom";
import { session } from "../services/api.js";
import { ttsPlayer } from "../services/ttsPlayer";
import PageShell from "../components/PageShell.jsx";
import { Avatar } from "../components/art.jsx";

export default function Landing() {
  const navigate = useNavigate();
  const playerId = session.getPlayer();
  const gmId = session.getGM();

  function goChild() {
    ttsPlayer.unlock();
    navigate(playerId ? "/world" : "/onboarding");
  }
  function goGM() {
    ttsPlayer.unlock();
    navigate("/gm");
  }

  return (
    <PageShell>
      <div
        style={{
          flex: 1,
          padding: "120px 24px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ marginTop: 10 }}>
          <Avatar kind="fox" size={120} evolved={1} />
        </div>

        <h1
          className="t-display"
          style={{
            fontSize: 54,
            margin: "8px 0 0",
            textAlign: "center",
            textShadow: "0 2px 0 rgba(255,255,255,.4)",
          }}
        >
          Ewoluc<span style={{ color: "var(--p-magic-dk)", fontStyle: "italic" }}>JA</span>
        </h1>
        <p
          className="t-hand"
          style={{
            fontSize: 22,
            margin: 0,
            color: "var(--p-ink-soft)",
            textAlign: "center",
            maxWidth: 320,
          }}
        >
          Świat, w którym Twoje wybory rosną razem z Twoim bohaterem.
        </p>

        <div
          style={{
            width: "100%",
            maxWidth: 380,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 18,
          }}
        >
          <button className="btn btn-magic btn-block" onClick={goChild}>
            <span style={{ fontSize: 20 }}>✦</span> Jestem bohaterem
            <span style={{ fontSize: 13, opacity: 0.85, marginLeft: "auto", fontWeight: 600 }}>
              {playerId ? "wróć do świata" : "rozpocznij przygodę"}
            </span>
          </button>
          <button className="btn btn-primary btn-block" onClick={goGM}>
            <span style={{ fontSize: 20 }}>☼</span> Jestem Mentorem
            <span style={{ fontSize: 13, opacity: 0.7, marginLeft: "auto", fontWeight: 600 }}>
              {gmId ? "wróć do panelu" : "panel rodzica"}
            </span>
          </button>
        </div>

        <p style={{ marginTop: 24, fontSize: 12, color: "var(--p-ink-soft)", textAlign: "center" }}>
          Tryb klasyczny (wersja 1.0) — <a href="/play" style={{ color: "var(--p-magic-dk)", fontWeight: 700, textDecoration: "none" }}>otwórz starą grę</a>
        </p>
      </div>
    </PageShell>
  );
}
