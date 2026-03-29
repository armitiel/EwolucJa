/**
 * EwolucJA DevTeam — Cowork Bridge
 * REPL do komunikacji z agentami. Stdin: @agent wiadomość
 */

import { DevTeam } from "./agents.js";
import { createInterface } from "readline";

// Ustaw PROJECT_ROOT na folder nadrzędny (EwolucJA)
if (!process.env.PROJECT_ROOT) {
  const url = new URL("..", import.meta.url);
  process.env.PROJECT_ROOT = url.pathname.replace(/^\/([A-Z]:)/, "$1");
}

const team = new DevTeam();

const rl = createInterface({ input: process.stdin });

console.log("BRIDGE_READY");

rl.on("line", async (line) => {
  const text = line.trim();
  if (!text) return;

  try {
    // @consult pytanie
    if (text.startsWith("@consult ")) {
      const q = text.slice(9);
      console.log("THINKING...");
      const results = await team.teamConsult(q);
      console.log("RESP_START");
      for (const [name, answer] of Object.entries(results)) {
        console.log(`\n=== ${name} ===\n${answer}`);
      }
      console.log("RESP_END");
      return;
    }

    // @agent wiadomość
    const match = text.match(/^@(\w+)\s+([\s\S]+)/);
    if (match) {
      const [, agent, msg] = match;
      console.log("THINKING...");
      const response = await team.chatWith(agent, msg);
      console.log("RESP_START");
      console.log(response);
      console.log("RESP_END");
      return;
    }

    console.log("ERR: Format: @agent wiadomość (np. @pm /mvp)");
  } catch (err) {
    console.log("ERR: " + err.message);
  }
});

process.on("uncaughtException", (err) => {
  console.log("ERR: " + err.message);
});
