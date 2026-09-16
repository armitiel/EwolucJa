/**
 * mowaPostaci — jedna zasada na głos postaci w oknach i panelach gry.
 *
 * ZASADA: LEKTOR KOŃCZY ZDANIE.
 *
 * Wcześniej każde takie okno uciszało głos we własnym `useEffect` przy
 * zamknięciu — i to był błąd, który widać było w grze: dziecko stuka
 * w zielony przycisk po pierwszej linijce (bo już wie, co ma robić),
 * a Wizkor milknie w pół słowa, zanim zdąży powiedzieć GDZIE. Efekt był
 * odwrotny do zamierzonego: im sprawniejsze dziecko, tym mniej z kwestii
 * słyszało.
 *
 * Dlatego zamknięcie okna NIE ucisza. Tekst na ekranie jest krótki
 * (`tekstEkranu` w `kwestieWizkora.js`), lektor mówi pełniejszą wersję
 * i spokojnie dopowiada ją zza kadru, gdy lis już biegnie.
 *
 * Głos milknie dokładnie w trzech sytuacjach — i tylko w nich:
 *
 *  1. ZACZYNA MÓWIĆ COŚ INNEGO. `interrupt: true` w każdym wywołaniu:
 *     nowe okno, nowa postać, nowy panel wchodzą na miejsce poprzedniego.
 *     Dwa głosy naraz nie zdarzą się nigdy.
 *  2. GRA JEST WYCISZONA. Nutka w HUD-zie znaczy „cicho w grze" — także
 *     w środku zdania (`bgMusic.onWyciszenie` → `ttsPlayer.stop`).
 *     Przy wyciszonej grze postać w ogóle się nie odzywa.
 *  3. KTOŚ ŚWIADOMIE UCISZA (`uciszPostac`) — wejście w minigrę, przejście
 *     między krainami, pulpit dev. To jest wyjątek, nie odruch: zwykłe
 *     zamknięcie okna go NIE używa.
 *
 * Kto tego używa: `PopupPostaci` (Wizkor i lisek na mapie),
 * `PodpowiedzMedrca` (podpowiedź Mędrca), `panels/ZadaniePanel`
 * (Wizkor czyta zadanie poza ekranem). Każde nowe powiadomienie z głosem
 * postaci ma wchodzić tędy, a nie wołać `ttsPlayer` po swojemu — inaczej
 * zasada znów rozjedzie się na cztery kopie.
 */
import bgMusic from "../services/bgMusic.js";
import { ttsPlayer } from "../services/ttsPlayer.js";

/**
 * Postać mówi. Zwraca obietnicę końca wypowiedzi (albo `null`, gdy nic nie
 * poszło w głos) — `PodpowiedzMedrca` pilnuje po niej, czy jeszcze mówi.
 *
 * Cicho zawodzi: wszystko, co postać mówi, stoi także napisane na ekranie,
 * więc brak TTS-a nie zabiera dziecku informacji, tylko wrażenie.
 */
export function powiedzPostacia(tekst, { glos, ton = "mystery" } = {}) {
  if (!tekst || !glos) return null;
  if (!bgMusic.isEnabled()) return null;
  try {
    return Promise.resolve(ttsPlayer.speak(tekst, { land: glos, tone: ton, interrupt: true }));
  } catch {
    return null;
  }
}

/**
 * Ucisza NATYCHMIAST. Tylko tam, gdzie cisza jest intencją — nie przy
 * zwykłym zamknięciu okna, bo od tego jest punkt 1 zasady wyżej.
 */
export function uciszPostac() {
  try { ttsPlayer.stop(); } catch {}
}
