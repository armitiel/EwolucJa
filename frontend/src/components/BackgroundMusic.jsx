import { useEffect, useRef, useState } from "react";

export default function BackgroundMusic({ src = "/Mindful_Forest_Path.mp3", volume = 0.25 }) {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(() => {
    return localStorage.getItem("bgm_muted") === "1";
  });

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = volume;
    audio.preload = "auto";
    audioRef.current = audio;

    const tryPlay = () => {
      if (muted) return;
      audio.play().catch(() => {});
    };

    tryPlay();

    const onFirstInteract = () => {
      tryPlay();
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
      window.removeEventListener("touchstart", onFirstInteract);
    };
    window.addEventListener("pointerdown", onFirstInteract);
    window.addEventListener("keydown", onFirstInteract);
    window.addEventListener("touchstart", onFirstInteract);

    return () => {
      audio.pause();
      audio.src = "";
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
      window.removeEventListener("touchstart", onFirstInteract);
    };
  }, [src, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    localStorage.setItem("bgm_muted", muted ? "1" : "0");
  }, [muted]);

  return (
    <button
      onClick={() => setMuted((m) => !m)}
      title={muted ? "Włącz muzykę" : "Wycisz muzykę"}
      style={{
        position: "fixed",
        bottom: 12,
        right: 12,
        zIndex: 9999,
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "none",
        background: "rgba(0,0,0,0.45)",
        color: "#fff",
        fontSize: 18,
        cursor: "pointer",
        backdropFilter: "blur(6px)",
      }}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
