#!/usr/bin/env node
/**
 * EwolucJA DevTeam — Telegram Bot
 *
 * Bot do komunikacji z agentami deweloperskimi przez Telegram.
 *
 * KOMENDY:
 *   /start              — Powitanie + lista agentów
 *   /team               — Lista agentów i ich status
 *   /architekt [msg]    — Rozmawiaj z Architektem
 *   /reviewer [msg]     — Rozmawiaj z Reviewerem
 *   /tester [msg]       — Rozmawiaj z Testerem
 *   /devops [msg]       — Rozmawiaj z DevOps
 *   /pm [msg]           — Rozmawiaj z PM
 *   /consult [pytanie]  — Pytanie do całego zespołu
 *   /reset              — Wyczyść historię wszystkich agentów
 *   /metrics            — Statystyki użycia
 *
 * URUCHOMIENIE:
 *   ANTHROPIC_API_KEY=sk-ant-xxx TELEGRAM_BOT_TOKEN=xxx node telegram-bot.js
 *
 * Lub z .env:
 *   node --env-file=.env telegram-bot.js
 */

import { DevTeam } from "./agents.js";

// ── Konfiguracja ────────────────────────────────────────────────────

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const POLL_INTERVAL = 1500; // ms

// Opcjonalnie: ogranicz dostęp do konkretnych user IDs
const ALLOWED_USERS = process.env.ALLOWED_TELEGRAM_USERS
  ? process.env.ALLOWED_TELEGRAM_USERS.split(",").map(Number)
  : []; // pusty = wszyscy mogą

if (!BOT_TOKEN) {
  console.error("Brak TELEGRAM_BOT_TOKEN! Ustaw zmienną środowiskową.");
  process.exit(1);
}

// ── Inicjalizacja zespołu ───────────────────────────────────────────

const team = new DevTeam();
let lastUpdateId = 0;
let activeAgent = {}; // userId → agentName (domyślny agent per user)

// ── Telegram API helpers ────────────────────────────────────────────

async function tgFetch(method, body = {}) {
  const res = await fetch(`${TELEGRAM_API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function sendMessage(chatId, text, parseMode = "Markdown") {
  // Telegram ma limit 4096 znaków — dziel długie wiadomości
  const chunks = splitMessage(text, 4000);
  for (const chunk of chunks) {
    await tgFetch("sendMessage", {
      chat_id: chatId,
      text: chunk,
      parse_mode: parseMode,
    }).catch(() => {
      // Fallback bez parsowania (jeśli Markdown się psuje)
      tgFetch("sendMessage", { chat_id: chatId, text: chunk });
    });
  }
}

async function sendTyping(chatId) {
  await tgFetch("sendChatAction", { chat_id: chatId, action: "typing" });
}

function splitMessage(text, maxLen) {
  if (text.length <= maxLen) return [text];
  const chunks = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }
    // Szukaj naturalnego podziału (nowa linia, kropka)
    let splitAt = remaining.lastIndexOf("\n", maxLen);
    if (splitAt < maxLen / 2) splitAt = remaining.lastIndexOf(". ", maxLen);
    if (splitAt < maxLen / 2) splitAt = maxLen;
    chunks.push(remaining.substring(0, splitAt));
    remaining = remaining.substring(splitAt).trimStart();
  }
  return chunks;
}

// ── Obsługa komend ──────────────────────────────────────────────────

async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;
  const text = (msg.text || "").trim();

  // Sprawdź uprawnienia
  if (ALLOWED_USERS.length > 0 && !ALLOWED_USERS.includes(userId)) {
    await sendMessage(chatId, "Brak dostępu. Twoje ID: `" + userId + "`");
    return;
  }

  if (!text) return;

  // ── /start ──
  if (text === "/start") {
    await sendMessage(chatId, `*Witaj w DevTeam EwolucJA!* 🎮

Jestem botem który łączy Cię z zespołem agentów AI do rozwoju projektu.

*Agenci:*
🏗 /architekt — decyzje techniczne, planowanie
🔍 /reviewer — code review, jakość
🧪 /tester — testy, QA, scenariusze
⚙️ /devops — deploy, CI/CD, infra
📋 /pm — backlog, priorytety, roadmapa

*Komendy:*
/team — status zespołu
/consult [pytanie] — pytanie do wszystkich
/reset — wyczyść historię
/metrics — statystyki

*Użycie:*
\`/architekt Jak najlepiej zrefaktoryzować App.jsx?\`
\`/pm /mvp\`
\`/consult Czy powinniśmy dodać testy e2e?\`

Lub po prostu napisz wiadomość — trafi do ostatnio aktywnego agenta.`);
    return;
  }

  // ── /team ──
  if (text === "/team") {
    const agents = team.listAgents();
    const lines = agents.map((a) =>
      `• *${a.name}* (${a.role}) — ${a.calls} wywołań, ${a.historyLength} msg w historii`
    );
    await sendMessage(chatId, `*Zespół DevTeam:*\n\n${lines.join("\n")}`);
    return;
  }

  // ── /reset ──
  if (text === "/reset") {
    team.resetAll();
    delete activeAgent[userId];
    await sendMessage(chatId, "Historia wszystkich agentów wyczyszczona. 🧹");
    return;
  }

  // ── /metrics ──
  if (text === "/metrics") {
    const agents = team.listAgents();
    const total = agents.reduce((s, a) => s + a.calls, 0);
    const lines = agents.map((a) => `${a.name}: ${a.calls} wywołań`);
    await sendMessage(chatId, `*Metryki:*\n${lines.join("\n")}\n\nŁącznie: ${total} wywołań`);
    return;
  }

  // ── /consult [pytanie] ──
  if (text.startsWith("/consult")) {
    const question = text.replace("/consult", "").trim();
    if (!question) {
      await sendMessage(chatId, "Użycie: `/consult [pytanie do całego zespołu]`");
      return;
    }

    await sendTyping(chatId);
    await sendMessage(chatId, `*Konsultacja zespołowa:* ${question}\n\n_Czekam na odpowiedzi od 5 agentów..._`);

    try {
      const results = await team.teamConsult(question);
      let response = `*Odpowiedzi zespołu:*\n\n`;
      for (const [name, answer] of Object.entries(results)) {
        const emoji = { architekt: "🏗", reviewer: "🔍", tester: "🧪", devops: "⚙️", pm: "📋" }[name] || "🤖";
        response += `${emoji} *${name.charAt(0).toUpperCase() + name.slice(1)}:*\n${answer}\n\n`;
      }
      await sendMessage(chatId, response);
    } catch (err) {
      await sendMessage(chatId, `Błąd konsultacji: ${err.message}`);
    }
    return;
  }

  // ── /[agent] [wiadomość] ──
  const agentMatch = text.match(/^\/(architekt|reviewer|tester|devops|pm)\s*([\s\S]*)/i);
  if (agentMatch) {
    const agentName = agentMatch[1].toLowerCase();
    const userMsg = agentMatch[2].trim();

    activeAgent[userId] = agentName;

    if (!userMsg) {
      await sendMessage(chatId, `Przełączam na *${agentName}*. Teraz Twoje wiadomości trafiają do tego agenta.\n\nNapisz cokolwiek lub użyj komendy agenta (np. /plan, /review, /test...)`);
      return;
    }

    await sendTyping(chatId);
    try {
      const response = await team.chatWith(agentName, userMsg);
      const emoji = { architekt: "🏗", reviewer: "🔍", tester: "🧪", devops: "⚙️", pm: "📋" }[agentName] || "🤖";
      await sendMessage(chatId, `${emoji} *${agentName}:*\n\n${response}`);
    } catch (err) {
      await sendMessage(chatId, `Błąd ${agentName}: ${err.message}`);
    }
    return;
  }

  // ── Domyślny agent (ostatnio aktywny) ──
  const currentAgent = activeAgent[userId] || "pm";
  await sendTyping(chatId);
  try {
    const response = await team.chatWith(currentAgent, text);
    const emoji = { architekt: "🏗", reviewer: "🔍", tester: "🧪", devops: "⚙️", pm: "📋" }[currentAgent] || "🤖";
    await sendMessage(chatId, `${emoji} *${currentAgent}:*\n\n${response}`);
  } catch (err) {
    await sendMessage(chatId, `Błąd: ${err.message}`);
  }
}

// ── Long Polling ────────────────────────────────────────────────────

async function poll() {
  try {
    const data = await tgFetch("getUpdates", {
      offset: lastUpdateId + 1,
      timeout: 30,
      allowed_updates: ["message"],
    });

    if (data.ok && data.result?.length > 0) {
      for (const update of data.result) {
        lastUpdateId = update.update_id;
        if (update.message) {
          handleMessage(update.message).catch((err) =>
            console.error("[Bot] Error handling message:", err)
          );
        }
      }
    }
  } catch (err) {
    console.error("[Bot] Poll error:", err.message);
    await new Promise((r) => setTimeout(r, 5000)); // wait before retry
  }
}

async function startPolling() {
  console.log("🤖 EwolucJA DevTeam Bot uruchomiony!");
  console.log(`   Agenci: ${Object.keys(team.agents).join(", ")}`);
  console.log(`   API Key: ${process.env.ANTHROPIC_API_KEY ? "✅ ustawiony" : "❌ brak (tryb demo)"}`);
  console.log(`   Ograniczenie użytkowników: ${ALLOWED_USERS.length > 0 ? ALLOWED_USERS.join(", ") : "brak (wszyscy)"}`);
  console.log("   Nasłuchuję...\n");

  while (true) {
    await poll();
  }
}

// ── Start ───────────────────────────────────────────────────────────
startPolling();
