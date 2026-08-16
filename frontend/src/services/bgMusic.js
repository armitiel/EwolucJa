/**
 * bgMusic — muzyka w tle (lokalny plik MP3 z public/).
 * Wymaga gestu użytkownika do odtworzenia (autoplay policy przeglądarki).
 * Współpracuje z ttsPlayer: gdy lektor mówi, muzyka cichnie (duck), potem wraca.
 *
 * KRYTYCZNE: używa Web Audio API (AudioContext + GainNode) bo na iOS Safari
 * `audio.volume` jest read-only (system zawsze gra na pełnej głośności).
 * GainNode obchodzi to ograniczenie — działa na wszystkich platformach.
 *
 * Ref-counting na duck/unduck: wiele "graczy" (TTS, MissionView, PoradyPage)
 * może prosić o ducking. Music wraca dopiero gdy WSZYSCY puszcza.
 */

/**
 * Playlista tła — utwory lecą PO KOLEI, a nie w pętli jeden.
 *
 * Pętla z jednego kawałka robi się słyszalna po kilku minutach i dziecko
 * zaczyna czekać na powtórkę zamiast grać. Trzy utwory (2:00 + 1:32 + 1:32)
 * dają ponad pięć minut, zanim cokolwiek wróci.
 *
 * Wszystkie trzy przygotowane pod web: 32 kHz, VBR ~80 kbps, joint stereo —
 * z 193 kbps / 44,1 kHz. Razem 3,0 MB zamiast 7,3 MB, przy materiale, który
 * i tak gra w tle na 25% głośności.
 *
 * `Mindful_Forest_Path` celowo BEZ narastania i wyciszenia: ten sam plik służy
 * też za tło scen w `adventure/audio/sceneAudio.js`, gdzie leci w pętli —
 * fade zrobiłby w niej słyszalne wgniecenie co przejście. Dwa spacery mają
 * 0,8 s wejścia i 1,2 s wyjścia, bo grają wyłącznie tutaj.
 *
 * Źródła w 193 kbps leżą w `frontend/audio-zrodla/`, celowo poza `public/`:
 * wszystko z `public/` trafia do builda, a mastery nie mają po co jechać do
 * przeglądarki dziecka.
 */
import { audioCtx } from "./audioCtx.js";

const PLAYLISTA = ["/Mindful_Forest_Path.mp3", "/spacer-1.mp3", "/spacer-2.mp3"];
/**
 * Losowanie bez powtórek: tasujemy całą playlistę i gramy ją do końca, dopiero
 * potem tasujemy od nowa. To nie to samo, co losowanie przed każdym utworem —
 * przy trzech kawałkach czysty los co rundę wraca do tego samego średnio co
 * trzeci raz i brzmi jak zepsuta playlista, mimo że jest „bardziej losowy".
 *
 * Przy przetasowaniu pilnujemy jeszcze, żeby nowa runda nie zaczęła się od
 * tego, który właśnie skończył grać — inaczej na styku rund utwór potrafi
 * polecieć dwa razy z rzędu.
 */
function potasuj(lista) {
  const t = lista.slice();
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}
const STORAGE_KEY = "ewolucja.bgmusic";

class BgMusic {
  constructor() {
    this._audio = null;
    this._ctx = null;            // AudioContext
    this._source = null;         // MediaElementAudioSourceNode (jednorazowy per audio element!)
    this._gain = null;           // GainNode — TYM sterujemy zamiast audio.volume
    this._enabled = this._readEnabled();
    this._volume = 0.2;          // 20% (ściszone o 20% z dawnych 25%)
    // Ściszenie na czas lektora zjeżdża razem z głośnością bazową — trzyma tę
    // samą proporcję (1/5), więc muzyka pod mową jest tak samo dyskretna
    // jak była, a nie nagle wyraźniejsza względem reszty.
    this._duckedVolume = 0.04;
    this._target = this._volume;
    this._unlocked = false;
    this._kolejka = [];          // reszta bieżącej, przetasowanej rundy
    this._track = this._dobierzUtwor();
    this._duckRequests = 0;
    this._installAutoUnlock();
  }

  _readEnabled() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw === null ? true : raw === "1";
    } catch {
      return true;
    }
  }

  _writeEnabled(v) {
    try { localStorage.setItem(STORAGE_KEY, v ? "1" : "0"); } catch {}
  }

  _installAutoUnlock() {
    if (typeof window === "undefined" || this._unlockInstalled) return;
    this._unlockInstalled = true;
    const odepnij = () => {
      window.removeEventListener("click", handler, true);
      window.removeEventListener("touchstart", handler, true);
      window.removeEventListener("keydown", handler, true);
      window.removeEventListener("pointerdown", handler, true);
    };
    /**
     * Odblokowanie NIE jest jednorazową próbą.
     *
     * Wcześniej pierwszy gest od razu odpinał wszystkie nasłuchy, niezależnie
     * od tego, czy `play()` się udało. A `play()` bywa odrzucone mimo gestu —
     * przeglądarka nie zawsze uznaje za aktywację dotknięcie w trakcie
     * ładowania strony ani gest, który trafił w warstwę z `pointer-events: none`
     * (u nas: kurtyna z chmur na starcie świata). Wtedy muzyka milkła do końca
     * sesji i wyglądało to na zepsuty dźwięk, choć wystarczyłoby spróbować
     * jeszcze raz przy następnym kliknięciu.
     *
     * Teraz nasłuchy schodzą dopiero, gdy odtwarzanie NAPRAWDĘ ruszyło.
     */
    const handler = () => {
      if (this._unlocked) return;
      if (!this._enabled) {
        // Muzyka wyłączona świadomie — gest i tak się liczy, bo późniejsze
        // `setEnabled(true)` samo w sobie jest kliknięciem.
        this._unlocked = true;
        odepnij();
        return;
      }
      this._start().then((udalo) => {
        if (!udalo) return;          // spróbujemy przy kolejnym geście
        this._unlocked = true;
        odepnij();
      });
    };
    window.addEventListener("click", handler, true);
    window.addEventListener("touchstart", handler, { capture: true, passive: true });
    window.addEventListener("keydown", handler, true);
    window.addEventListener("pointerdown", handler, true);
  }

  /**
   * Kolejny utwór z przetasowanej rundy; pusta runda = nowe tasowanie.
   */
  _dobierzUtwor() {
    if (!this._kolejka.length) {
      const runda = potasuj(PLAYLISTA);
      // Nowa runda nie zaczyna się od tego, który przed chwilą grał.
      if (runda.length > 1 && runda[0] === this._track) runda.push(runda.shift());
      this._kolejka = runda;
    }
    return this._kolejka.shift();
  }

  /**
   * Przejście do kolejnego utworu — podmieniamy `src` w TYM SAMYM elemencie
   * audio, zamiast tworzyć nowy.
   *
   * To nie jest oszczędność, tylko konieczność: `createMediaElementSource`
   * wiąże graf Web Audio z konkretnym elementem i przy podmianie elementu
   * trzeba by odbudować cały łańcuch source → gain → destination. A wraz z nim
   * zgubiłby się stan duckingu, czyli ściszenia na czas lektora.
   */
  _nastepnyUtwor() {
    this._track = this._dobierzUtwor();
    if (!this._audio) return;
    try {
      this._audio.src = this._track;
      this._audio.currentTime = 0;
      const p = this._audio.play();
      if (p?.catch) p.catch(() => {});
    } catch (e) {
      console.warn("[bgMusic] nie udało się przełączyć utworu:", e?.message);
    }
  }

  _ensureAudio() {
    if (this._audio) return this._audio;
    const a = new Audio(this._track);
    // Bez `loop` — koniec utworu jest sygnałem do przełączenia na kolejny.
    a.loop = false;
    a.addEventListener("ended", () => this._nastepnyUtwor());
    a.crossOrigin = "anonymous"; // wymagane dla Web Audio jesli serwer ustawia CORS
    a.volume = 1;                // zostawiamy 1 — gloscia steruje GainNode
    a.preload = "auto";
    this._audio = a;
    return a;
  }

  /** Buduje graf Web Audio: <audio> → source → gain → destination. */
  _ensureAudioGraph() {
    if (this._ctx) return true;
    if (!this._audio) return false;
    try {
      // Wspólny kontekst całej aplikacji (patrz `audioCtx.js`) — nie własny.
      // Drugi strumień do karty dźwiękowej na telefonie potrafi dołożyć
      // opóźnienie i trzaski, a po powrocie z tła budzi się tylko jeden.
      this._ctx = audioCtx();
      if (!this._ctx) return false; // Web Audio nie wspierany (bardzo stare przegladarki)
      this._source = this._ctx.createMediaElementSource(this._audio);
      this._gain = this._ctx.createGain();
      this._gain.gain.value = 0; // start cicho, _fade go podniesie
      this._source.connect(this._gain).connect(this._ctx.destination);
      return true;
    } catch (e) {
      console.warn("[bgMusic] Web Audio init failed:", e?.message);
      this._ctx = null;
      this._source = null;
      this._gain = null;
      return false;
    }
  }

  /** Fade gain od obecnej wartosci do target w durationMs (linear ramp). */
  _fade(toVolume, durationMs = 1200) {
    const target = Math.max(0, Math.min(1, toVolume));
    if (this._gain && this._ctx) {
      const t = this._ctx.currentTime;
      const dur = Math.max(0.01, durationMs / 1000);
      try {
        this._gain.gain.cancelScheduledValues(t);
        this._gain.gain.setValueAtTime(this._gain.gain.value, t);
        this._gain.gain.linearRampToValueAtTime(target, t + dur);
      } catch (e) {
        // fallback: instant set
        try { this._gain.gain.value = target; } catch {}
      }
      return;
    }
    // Fallback (brak Web Audio): zmiana audio.volume krok po kroku (dziala na desktop)
    if (this._audio) {
      const from = this._audio.volume;
      const steps = Math.max(1, Math.floor(durationMs / 50));
      const delta = (target - from) / steps;
      let step = 0;
      if (this._fadeTimer) clearInterval(this._fadeTimer);
      this._fadeTimer = setInterval(() => {
        step++;
        try { this._audio.volume = Math.max(0, Math.min(1, from + delta * step)); } catch {}
        if (step >= steps) { clearInterval(this._fadeTimer); this._fadeTimer = null; }
      }, 50);
    }
  }

  /** @returns {Promise<boolean>} czy odtwarzanie faktycznie ruszyło */
  _start() {
    const a = this._ensureAudio();
    return a.play()
      .then(() => {
        // Buduj graf Web Audio dopiero PO play() — musi byc w gestcie usera.
        this._ensureAudioGraph();
        // Resume AudioContext jezeli suspended (iOS Safari domyslnie suspended).
        if (this._ctx && this._ctx.state === "suspended") {
          try { this._ctx.resume(); } catch {}
        }
        // Jesli ktos juz prosil o duck (np. user wszedl na /mission przed unlockiem),
        // zacznij od duckedVolume.
        const target = this._duckRequests > 0 ? this._duckedVolume : this._target;
        this._fade(target, 1500);
        // Widoczne w konsoli, bo „ciągle leci to samo" jest nie do rozstrzygnięcia
        // ze słuchu — przy trzech utworach powtórka po odświeżeniu wypada
        // średnio co trzeci raz i łatwo wziąć ją za brak losowania.
        console.info("[bgMusic] gram:", this._track, "| dalej w rundzie:", this._kolejka.join(", ") || "(koniec rundy)");
        return true;
      })
      .catch((e) => {
        console.warn("[bgMusic] play blocked:", e.message);
        return false;
      });
  }

  /** Włącz lub wyłącz (zapamiętane w localStorage). */
  setEnabled(v) {
    this._enabled = !!v;
    this._writeEnabled(this._enabled);
    if (this._enabled) {
      if (this._unlocked) this._start();
    } else {
      this._fade(0, 600);
      setTimeout(() => { if (this._audio) this._audio.pause(); }, 700);
    }
  }

  toggle() { this.setEnabled(!this._enabled); return this._enabled; }
  isEnabled() { return this._enabled; }

  /** Ustawia głośność bazową (0-1). Nie wplywa na ducking. */
  setVolume(v) {
    this._volume = Math.max(0, Math.min(1, v));
    this._target = this._volume;
    if (this._enabled && (this._gain || this._audio)) {
      const target = this._duckRequests > 0 ? this._duckedVolume : this._volume;
      this._fade(target, 400);
    }
  }

  /** Ducking: ścisz do 5%, gdy lektor mówi LUB strona prosi. Ref-counted. */
  duck() {
    this._duckRequests++;
    if (!this._enabled) return;
    // Resume context jezeli suspended (np. iOS Safari po przerwie)
    if (this._ctx && this._ctx.state === "suspended") {
      try { this._ctx.resume(); } catch {}
    }
    this._fade(this._duckedVolume, 250);
  }

  /** Zwolnienie żądania ducking. Music wraca dopiero gdy nikt już nie prosi. */
  unduck() {
    this._duckRequests = Math.max(0, this._duckRequests - 1);
    if (!this._enabled) return;
    if (this._duckRequests === 0) {
      this._fade(this._volume, 700);
    }
    // jezeli jeszcze ktos prosi (np. /mission), zostaw ducked
  }

  /** Zmiana utworu. UWAGA: MediaElementAudioSource nie da sie podpiac drugi raz —
   *  trzeba zrobic nowy <audio> i nowy source. */
  setTrack(url) {
    this._track = url;
    if (this._audio) {
      // Tear down audio graph (zachowamy _ctx)
      try { this._audio.pause(); } catch {}
      try { if (this._source) this._source.disconnect(); } catch {}
      try { if (this._gain) this._gain.disconnect(); } catch {}
      this._audio = null;
      this._source = null;
      this._gain = null;
      if (this._enabled && this._unlocked) this._start();
    }
  }
}

const bgMusic = new BgMusic();
export default bgMusic;

// Hook DevTools w window dla debugowania na produkcji:
//   window.bgMusic.duck() / unduck() / setVolume(0.5)
if (typeof window !== "undefined") {
  window.bgMusic = bgMusic;
}
