#!/usr/bin/env node
/**
 * EwolucJA DevTeam — CLI (Cowork / Terminal)
 *
 * Interaktywny interfejs do komunikacji z agentami deweloperskimi.
 *
 * URUCHOMIENIE:
 *   node --env-file=.env cli.js
 *   npm run cli
 *
 * KOMENDY:
 *   /architekt [msg]   — Rozmawiaj z Architektem
 *   /reviewer [msg]    — Rozmawiaj z Reviewerem
 *   /tester [msg]      — Rozmawiaj z Testerem
 *   /devops [msg]      — Rozmawiaj z DevOps
 *   /pm [msg]          — Rozmawiaj z PM
 *   /consult [pytanie] — Pytanie do całego zespołu
 *   /team              — Lista agentów i status
 *   /reset             — Wyczyść historię
 *   /metrics           — Statystyki
 *   /help              — Pomoc
 *   /exit              — Wyjdź
 */

import { DevTeam } from "./agents.js";
import { createInterface } from "readline";

// ── Kolory terminala ─────────────────────────────────────────────────

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  white: "\x1b[37m",
  bgBlue: "\x1b[44m",
  bgGreen: "\x1b[42m",
};

const AGENT_COLORS = {
  architekt: C.blue,
  reviewer: C.green,
  tester: C.yellow,
  devops: C.magenta,
  pm: C.cyan,
};

const AGENT_EMOJI = {
  architekt: "🏗",
  reviewer: "🔍",
  tester: "🧪",
  devops: "⚙️",
  pm: "📋",
};

// ── Inicjalizacja ────────────────────────────────────────────────────

const team = new DevTeam();
let currentAgent = "pm";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "",
});

function updatePrompt() {
  const color = AGENT_COLORS[currentAgent] || C.white;
  const emoji = AGENT_EMOJI[currentAgent] || "🤖";
  rl.setPrompt(`${color}${emoji} ${currentAgent}${C.reset} ${C.dim}>${C.reset} `);
}

// ── Wyświetlanie ─────────────────────────────────────────────────────

function printHeader() {
  console.log(`
${C.bold}${C.cyan}╔══════════════════════════════════════════════╗
║        EwolucJA DevTeam — CLI Console        ║
╚══════════════════════════════════════════════╝${C.reset}

${C.dim}Agenci: /architekt /reviewer /tester /devops /pm
Komendy: /consult /team /reset /metrics /help /exit${C.reset}

${C.dim}Aktywny agent: ${C.bold}${currentAgent}${C.reset}
${C.dim}Wpisz wiadomość lub /komendę${C.reset}
`);
}

function printAgent(agentName, text) {
  const color = AGENT_COLORS[agentName] || C.white;
  const emoji = AGENT_EMOJI[agentName] || "🤖";
  console.log(`\n${color}${C.bold}${emoji} ${agentName.charAt(0).toUpperCase() + agentName.slice(1)}:${C.reset}`);
  console.log(text);
  console.log();
}

function printSystem(text) {
  console.log(`${C.dim}${text}${C.reset}`);
}

function printError(text) {
  console.log(`${C.red}✗ ${text}${C.reset}`);
}

function printHelp() {
  console.log(`
${C.bold}${C.cyan}Komendy DevTeam CLI:${C.reset}

${C.bold}Agenci:${C.reset}
  ${C.blue}/architekt${C.reset} [msg]  — Tech Lead, planowanie, architektura
  ${C.green}/reviewer${C.reset} [msg]   — Code review, jakość, bezpieczeństwo
  ${C.yellow}/tester${C.reset} [msg]     — Testy, QA, scenariusze testowe
  ${C.magenta}/devops${C.reset} [msg]     — Deploy, CI/CD, infrastruktura
  ${C.cyan}/pm${C.reset} [msg]          — Backlog, priorytety, roadmapa

${C.bold}Zespół:${C.reset}
  /consult [pytanie] — Pytanie do całego zespołu (5 odpowiedzi)
  /team              — Pokaż status agentów
  /metrics           — Statystyki wywołań

${C.bold}Sesja:${C.reset}
  /reset             — Wyczyść historię wszystkich agentów
  /help              — Ta pomoc
  /exit              — Wyjdź z CLI

${C.bold}Użycie:${C.reset}
  Bez komendy — wiadomość trafia do aktywnego agenta (${currentAgent})
  /architekt Jak zrefaktoryzować App.jsx?
  /consult Czy dodać testy e2e?
  /pm /mvp
`);
}

// ── Obsługa wejścia ──────────────────────────────────────────────────

async function handleInput(line) {
  const text = line.trim();
  if (!text) {
    rl.prompt();
    return;
  }

  // /exit
  if (text === "/exit" || text === "/quit" || text === "/q") {
    printSystem("Do zobaczenia! 👋");
    process.exit(0);
  }

  // /help
  if (text === "/help" || text === "/?") {
    printHelp();
    rl.prompt();
    return;
  }

  // /team
  if (text === "/team") {
    const agents = team.listAgents();
    console.log(`\n${C.bold}Zespół DevTeam:${C.reset}\n`);
    for (const a of agents) {
      const color = AGENT_COLORS[a.name.toLowerCase()] || C.white;
      const emoji = AGENT_EMOJI[a.name.toLowerCase()] || "🤖";
      console.log(`  ${emoji} ${color}${C.bold}${a.name}${C.reset} (${a.role}) — ${a.calls} wywołań, ${a.historyLength} msg`);
    }
    console.log();
    rl.prompt();
    return;
  }

  // /reset
  if (text === "/reset") {
    team.resetAll();
    printSystem("Historia wszystkich agentów wyczyszczona. 🧹");
    rl.prompt();
    return;
  }

  // /metrics
  if (text === "/metrics") {
    const agents = team.listAgents();
    const total = agents.reduce((s, a) => s + a.calls, 0);
    console.log(`\n${C.bold}Metryki:${C.reset}\n`);
    for (const a of agents) {
      const bar = "█".repeat(Math.min(a.calls, 30));
      console.log(`  ${a.name.padEnd(12)} ${C.green}${bar}${C.reset} ${a.calls}`);
    }
    console.log(`\n  ${C.bold}Łącznie: ${total} wywołań${C.reset}\n`);
    rl.prompt();
    return;
  }

  // /consult [pytanie]
  if (text.startsWith("/consult")) {
    const question = text.replace("/consult", "").trim();
    if (!question) {
      printSystem("Użycie: /consult [pytanie do całego zespołu]");
      rl.prompt();
      return;
    }

    printSystem(`Konsultacja zespołowa: "${question}"\nCzekam na odpowiedzi od 5 agentów...`);

    try {
      const results = await team.teamConsult(question);
      console.log(`\n${C.bold}${C.cyan}═══ Odpowiedzi zespołu ═══${C.reset}\n`);
      for (const [name, answer] of Object.entries(results)) {
        printAgent(name, answer);
      }
    } catch (err) {
      printError(`Błąd konsultacji: ${err.message}`);
    }
    rl.prompt();
    return;
  }

  // /[agent] [wiadomość]
  const agentMatch = text.match(/^\/(architekt|reviewer|tester|devops|pm)\s*([\s\S]*)/i);
  if (agentMatch) {
    const agentName = agentMatch[1].toLowerCase();
    const userMsg = agentMatch[2].trim();

    currentAgent = agentName;
    updatePrompt();

    if (!userMsg) {
      printSystem(`Przełączam na ${agentName}. Twoje wiadomości trafiają teraz do tego agenta.`);
      rl.prompt();
      return;
    }

    printSystem("Myślę...");
    try {
      const response = await team.chatWith(agentName, userMsg);
      printAgent(agentName, response);
    } catch (err) {
      printError(`Błąd ${agentName}: ${err.message}`);
    }
    rl.prompt();
    return;
  }

  // Domyślny agent
  printSystem(`→ ${currentAgent} myśli...`);
  try {
    const response = await team.chatWith(currentAgent, text);
    printAgent(currentAgent, response);
  } catch (err) {
    printError(`Błąd: ${err.message}`);
  }
  rl.prompt();
}

// ── Start ────────────────────────────────────────────────────────────

printHeader();
updatePrompt();
rl.prompt();

rl.on("line", handleInput);
rl.on("close", () => {
  printSystem("\nDo zobaczenia! 👋");
  process.exit(0);
});
