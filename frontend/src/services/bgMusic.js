/**
 * bgMusic — Muzyka w tle z YouTube IFrame API.
 *
 * Odtwarza audio z YouTube w ukrytym iframe.
 * Obsługuje fade-in, fade-out, pauza/resume, volume.
 */

let player = null;
let ready = false;
let pendingPlay = null;
let fadeInterval = null;
let currentVolume = 0;
let targetVolume = 30; // domyślna głośność (0-100)

// Załaduj YouTube IFrame API
function loadAPI() {
  if (window.YT && window.YT.Player) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      // Skrypt już dodany, czekaj na callback
      const check = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      return;
    }
    window.onYouTubeIframeAPIReady = () => resolve();
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
}

// Utwórz ukryty div dla playera
function createContainer() {
  let el = document.getElementById("yt-bg-music");
  if (!el) {
    el = document.createElement("div");
    el.id = "yt-bg-music";
    el.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;pointer-events:none;opacity:0;";
    document.body.appendChild(el);
  }
  return el;
}

function fadeVolume(from, to, durationMs, onDone) {
  if (fadeInterval) clearInterval(fadeInterval);
  const steps = 30;
  const stepTime = durationMs / steps;
  const stepSize = (to - from) / steps;
  let current = from;
  let step = 0;

  fadeInterval = setInterval(() => {
    step++;
    current += stepSize;
    currentVolume = Math.round(Math.max(0, Math.min(100, current)));
    try { player?.setVolume(currentVolume); } catch {}
    if (step >= steps) {
      clearInterval(fadeInterval);
      fadeInterval = null;
      currentVolume = to;
      try { player?.setVolume(to); } catch {}
      if (onDone) onDone();
    }
  }, stepTime);
}

const bgMusic = {
  /**
   * Rozpocznij odtwarzanie z fade-in.
   * @param {string} videoId — YouTube video ID
   * @param {number} startSeconds — punkt startowy w sekundach
   * @param {number} fadeDuration — czas fade-in w ms (domyślnie 3000)
   * @param {number} volume — docelowa głośność 0-100 (domyślnie 30)
   */
  async play(videoId, { startSeconds = 0, fadeDuration = 3000, volume = 30 } = {}) {
    targetVolume = volume;

    await loadAPI();
    const container = createContainer();

    if (player && ready) {
      // Player już istnieje — zmień video
      try {
        player.setVolume(0);
        currentVolume = 0;
        player.loadVideoById({ videoId, startSeconds });
        fadeVolume(0, targetVolume, fadeDuration);
      } catch (e) {
        console.warn("[bgMusic] Error switching track:", e);
      }
      return;
    }

    // Twórz nowego playera
    pendingPlay = { videoId, startSeconds, fadeDuration };

    player = new window.YT.Player(container, {
      height: "1",
      width: "1",
      videoId,
      playerVars: {
        autoplay: 1,
        start: Math.floor(startSeconds),
        loop: 1,
        playlist: videoId, // wymagane dla loop
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
      },
      events: {
        onReady: (e) => {
          ready = true;
          e.target.setVolume(0);
          currentVolume = 0;
          e.target.playVideo();
          const pp = pendingPlay;
          pendingPlay = null;
          fadeVolume(0, targetVolume, pp?.fadeDuration || fadeDuration);
        },
        onStateChange: (e) => {
          // Restart gdy kończy się video
          if (e.data === window.YT.PlayerState.ENDED) {
            e.target.seekTo(startSeconds);
            e.target.playVideo();
          }
        },
        onError: (e) => {
          console.warn("[bgMusic] YouTube player error:", e.data);
        },
      },
    });
  },

  /** Zatrzymaj z fade-out */
  stop(fadeDuration = 2000) {
    if (!player || !ready) return;
    fadeVolume(currentVolume, 0, fadeDuration, () => {
      try { player.pauseVideo(); } catch {}
    });
  },

  /** Pauza z fade-out */
  pause(fadeDuration = 1500) {
    if (!player || !ready) return;
    fadeVolume(currentVolume, 0, fadeDuration, () => {
      try { player.pauseVideo(); } catch {}
    });
  },

  /** Resume z fade-in */
  resume(fadeDuration = 2000) {
    if (!player || !ready) return;
    try {
      player.playVideo();
      fadeVolume(0, targetVolume, fadeDuration);
    } catch {}
  },

  /** Ustaw głośność (0-100) */
  setVolume(vol) {
    targetVolume = vol;
    currentVolume = vol;
    try { player?.setVolume(vol); } catch {}
  },

  /** Czy gra? */
  isPlaying() {
    try {
      return ready && player?.getPlayerState() === window.YT.PlayerState.PLAYING;
    } catch {
      return false;
    }
  },
};

export default bgMusic;
