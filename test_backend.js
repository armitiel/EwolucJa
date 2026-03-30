// Quick test of backend endpoints
async function test() {
  try {
    const h = await fetch("http://localhost:3001/api/health");
    console.log("health:", h.status, await h.text());
  } catch (e) {
    console.log("health ERR:", e.message);
  }

  try {
    const t = await fetch("http://localhost:3001/api/tts/status");
    console.log("tts status:", t.status, await t.text());
  } catch (e) {
    console.log("tts ERR:", e.message);
  }

  try {
    const s = await fetch("http://localhost:3001/api/tts/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Test", land: "dolina_selfie" }),
    });
    const buf = await s.arrayBuffer();
    console.log("tts speak:", s.status, buf.byteLength, "bytes");
  } catch (e) {
    console.log("tts speak ERR:", e.message);
  }
}
test();
