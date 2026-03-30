import fs from "fs";

process.env.ELEVENLABS_API_KEY = "sk_60fe1a903e7a608dbe08bf4e645d7de666122aaf4ee1ae49";
process.env.ELEVENLABS_MODEL = "eleven_flash_v2_5";

const { ttsService } = await import("./backend/src/services/ttsService.js");

console.log("Status:", JSON.stringify(ttsService.getInfo()));

const buf = await ttsService.synthesize(
  "Witaj podróżniku! Rozpoczynamy przygodę w Dolinie Selfie. Jestem GAMA-1, twój przewodnik.",
  { land: "dolina_selfie" }
);

fs.writeFileSync("test_narrator.mp3", buf);
console.log("OK: test_narrator.mp3 (" + buf.length + " bytes)");
