import "dotenv/config";
import express from "express";
import { ttsRoutes } from "./backend/src/api/tts.js";

const app = express();
app.use(express.json());
app.use("/tts", ttsRoutes());

app.listen(4444, () => {
  console.log("Test server on 4444");
  console.log("ELEVENLABS_API_KEY:", process.env.ELEVENLABS_API_KEY ? "SET" : "MISSING");

  fetch("http://localhost:4444/tts/status")
    .then(r => r.json())
    .then(d => {
      console.log("Status:", JSON.stringify(d));
      process.exit(0);
    })
    .catch(e => {
      console.log("ERR:", e.message);
      process.exit(1);
    });
});
