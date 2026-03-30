try {
  const m = await import("./backend/src/api/tts.js");
  console.log("ttsRoutes type:", typeof m.ttsRoutes);
} catch (e) {
  console.log("IMPORT ERR:", e.message);
  console.log(e.stack);
}
