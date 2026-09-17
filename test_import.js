/*!
 * EwolucJA — gra edukacyjna dla dzieci.
 * © 2026 Amitiel Angelisme. Wszelkie prawa zastrzeżone.
 * Powstało w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”.
 * Prawa autorskie należą do autora. Pełna nota: LICENSE.
 */
try {
  const m = await import("./backend/src/api/tts.js");
  console.log("ttsRoutes type:", typeof m.ttsRoutes);
} catch (e) {
  console.log("IMPORT ERR:", e.message);
  console.log(e.stack);
}
