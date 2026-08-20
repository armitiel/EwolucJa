/**
 * e2e/przygoda.mjs — automatyczna kontrola pionowego wycinka.
 *
 * Uruchamiane w dwóch trybach:
 *   node e2e/przygoda.mjs offline   — bez backendu (sprawdza wymóg §11)
 *   node e2e/przygoda.mjs online    — z backendem i pętlą Mentora
 *
 * Sprawdza: przejście dziecka, brak blokowania przez lektora, jeden jasny
 * następny krok, oddanie dowodu, widoki mobilne, przepełnienia, rozmiary
 * stref dotyku i błędy konsoli.
 */

import { chromium, devices } from "playwright";

import fs from "node:fs";
import path from "node:path";

const MODE = process.argv[2] || "offline";
const BASE = process.env.BASE_URL || "http://127.0.0.1:4173";
const SHOTS = path.resolve("e2e/shots", MODE);
fs.mkdirSync(SHOTS, { recursive: true });

const problems = [];
const checks = [];
let shotN = 0;

function ok(name, detail = "") {
  checks.push({ name, pass: true, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ""}`);
}
function fail(name, detail = "") {
  checks.push({ name, pass: false, detail });
  problems.push(`${name}: ${detail}`);
  console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

async function shot(page, label) {
  shotN += 1;
  const file = path.join(SHOTS, `${String(shotN).padStart(2, "0")}-${label}.png`);
  await page.screenshot({ path: file });
  return file;
}

/** Widok mobilny: brak poziomego przepełnienia i brak przycisków poniżej 44 px. */
async function auditViewport(page, label) {
  const report = await page.evaluate(() => {
    const doc = document.documentElement;
    const overflowX = doc.scrollWidth - doc.clientWidth;
    const small = [];
    const offscreen = [];
    document.querySelectorAll("button, [role=button], input, textarea").forEach((el) => {
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden" || r.width === 0) return;
      if (r.height < 44 || r.width < 40) small.push(`${el.tagName}.${el.className || ""}:${Math.round(r.width)}x${Math.round(r.height)}`);
      if (r.bottom > window.innerHeight + 2 || r.top < -2) offscreen.push(`${el.tagName}:${Math.round(r.top)}-${Math.round(r.bottom)}`);
    });
    return { overflowX, small, offscreen, h: window.innerHeight };
  });
  if (report.overflowX > 1) fail(`${label}: przepełnienie w poziomie`, `${report.overflowX}px`);
  else ok(`${label}: brak przepełnienia`);
  if (report.small.length) fail(`${label}: za małe strefy dotyku`, report.small.slice(0, 4).join(", "));
  else ok(`${label}: strefy dotyku ≥44px`);
  if (report.offscreen.length) fail(`${label}: element poza ekranem`, report.offscreen.slice(0, 3).join(", "));
  else ok(`${label}: wszystkie kontrolki w kadrze`);
}

const run = async () => {
  // Chromium jest preinstalowany w kontenerze; wskazujemy binarke wprost,
  // zeby nie pobierac przegladarki przy kazdym uruchomieniu testu.
  const candidates = [
    process.env.CHROME_PATH,
    "/opt/pw-browsers/chromium-1148/chrome-linux/chrome",
    "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    "/opt/pw-browsers/chromium/chrome-linux/chrome",
  ].filter(Boolean);
  const exe = candidates.find((c) => fs.existsSync(c));
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const ctx = await browser.newContext({ ...devices["iPhone 12"], locale: "pl-PL" });
  const page = await ctx.newPage();

  const consoleErrors = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));

  console.log(`\n▶ Tryb: ${MODE}\n`);

  /* 1. Start przygody — bez konta, bez sieci. */
  await page.goto(`${BASE}/przygoda`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="adv-next"], [data-testid="adv-choices"]', { timeout: 10000 });
  await shot(page, "cold-open");
  ok("dziecko może rozpocząć przygodę bez konta");

  /* 2. Lektor nie blokuje — kontrolki są aktywne od razu. */
  const firstActionable = await page.locator('[data-testid="adv-next"], .adv-choice').first();
  const enabledImmediately = await firstActionable.isEnabled();
  if (enabledImmediately) ok("odpowiedzi nie są blokowane przez lektora");
  else fail("odpowiedzi zablokowane", "pierwsza kontrolka disabled na starcie");

  await auditViewport(page, "cold-open");

  /* 3. Przejście przez scenę: kwestie, wybory, reakcje. */
  let picks = 0;
  let guard = 0;
  while (guard < 60) {
    guard += 1;
    if (await page.locator('[data-testid="adv-avatar-reveal"]').count()) break;
    if (await page.locator('[data-testid="adv-choices"]').count()) {
      const opts = page.locator(".adv-choice");
      const n = await opts.count();
      if (n) {
        if (picks === 0) await shot(page, "wybor");
        await opts.nth(picks % n).click();
        picks += 1;
        await page.waitForTimeout(180);
        continue;
      }
    }
    const next = page.locator('[data-testid="adv-next"]');
    if (await next.count()) {
      if (await page.locator('[data-testid="adv-reaction"]').count()) {
        if (picks === 1) await shot(page, "reakcja-swiata");
      }
      await next.first().click();
      await page.waitForTimeout(150);
      continue;
    }
    break;
  }
  if (picks >= 3) ok("dziecko podjęło wybory w historii", `${picks} wyborów`);
  else fail("za mało wyborów w onboardingu", `${picks}`);

  /* 4. Awatar. */
  await page.waitForSelector('[data-testid="adv-avatar-reveal"]', { timeout: 10000 });
  await shot(page, "awatar");
  await auditViewport(page, "awatar");
  await page.fill('[data-testid="adv-name"]', "Ala");
  await page.click('[data-testid="adv-name-ok"]');
  ok("dziecko stworzyło awatara");

  /* 5. Domknięcie sceny → mapa. */
  guard = 0;
  while (guard < 20 && !page.url().includes("/mapa")) {
    guard += 1;
    const go = page.locator('[data-testid="adv-go"], [data-testid="adv-next"]');
    if (await go.count()) {
      await go.first().click();
      await page.waitForTimeout(200);
    } else break;
  }
  await page.waitForSelector('[data-testid="adv-map-screen"]', { timeout: 10000 });
  await shot(page, "mapa");
  await auditViewport(page, "mapa");

  const nextStepText = await page.locator('[data-testid="adv-nextstep"]').innerText();
  if (nextStepText && nextStepText.trim().length > 3) ok("mapa pokazuje jeden jasny następny krok", nextStepText.replace(/\n/g, " · "));
  else fail("brak następnego kroku na mapie");

  /* 6. Chwila Światła — dobrowolna, zamykana. */
  await page.click('[data-testid="adv-light-open"]');
  await page.waitForSelector('[data-testid="adv-light-moment"]', { timeout: 5000 });
  await shot(page, "chwila-swiatla");
  await page.click('[data-testid="adv-light-close"]');
  if (!(await page.locator('[data-testid="adv-light-moment"]').count())) ok("Chwila Światła jest dobrowolna i zamykalna");
  else fail("Chwila Światła nie zamyka się");

  /* 7. Droga do Lasu Szeptów i misja. */
  await page.click('[data-testid="adv-go"]');
  await page.waitForSelector('[data-testid="adv-mission-intro"], [data-testid="adv-next"]', { timeout: 10000 });
  guard = 0;
  while (guard < 25 && !(await page.locator('[data-testid="adv-mission-intro"]').count())) {
    guard += 1;
    const next = page.locator('[data-testid="adv-next"]');
    if (await next.count()) {
      await next.first().click();
      await page.waitForTimeout(150);
    } else break;
  }
  await page.waitForSelector('[data-testid="adv-mission-intro"]', { timeout: 10000 });
  await shot(page, "misja-wydarzenie");
  ok("misja pojawia się jako wydarzenie w świecie");

  await page.click('[data-testid="adv-mission-accept"]');
  await page.waitForSelector('[data-testid="adv-mission-proof"]', { timeout: 10000 });
  await auditViewport(page, "misja");

  await page.click('[data-testid="adv-example"]');
  if (await page.locator('[data-testid="adv-example-text"]').count()) ok("misja ma opcję „pokaż przykład”");
  else fail("brak przykładu w misji");
  await shot(page, "misja-formularz");

  await page.fill('[data-testid="adv-proof-text"]', "Babcia powiedziała, że pamięta skrzypienie furtki.");
  await page.click('[data-testid="adv-proof-send"]');
  await page.waitForSelector('[data-testid="adv-waiting"]', { timeout: 10000 });
  await shot(page, "czekanie-na-mentora");
  await auditViewport(page, "czekanie");
  ok("misję można wykonać i oddać");

  const waitText = await page.locator('[data-testid="adv-waiting"]').innerText();
  if (/odlicz|zosta.o ci|stracisz|spiesz/i.test(waitText)) fail("ekran czekania zawiera presję", waitText.slice(0, 60));
  else ok("ekran czekania bez presji i odliczania");

  /* 7b. PĘTLA MENTORA (tylko online): rejestracja opiekuna, akceptacja dowodu,
   *     powrót Iskry u dziecka i widoczna zmiana świata na mapie. */
  if (MODE === "online") {
    const playerId = await page.evaluate(() => localStorage.getItem("ewolucja.playerId"));
    if (!playerId) fail("MENTOR: dziecko nie ma konta", "brak playerId w sesji");
    else {
      ok("MENTOR: konto dziecka powstało w tle", playerId.slice(0, 8));
      const apiBase = BASE.replace(/\/$/, "") + "/api";
      const post = async (path, body) => {
        const r = await fetch(apiBase + path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        return { status: r.status, json: await r.json().catch(() => null) };
      };
      const get = async (path) => {
        const r = await fetch(apiBase + path);
        return { status: r.status, json: await r.json().catch(() => null) };
      };

      // Bierzemy ID misji, ktora dziecko faktycznie dostalo w swiecie — nie
      // "biezaca misje" gracza, bo ta moze pochodzic ze starego generatora.
      const seededId = await page.evaluate(() => {
        const key = Object.keys(localStorage).find((k) => k.startsWith("ewolucja.adventure.v1."));
        return key ? JSON.parse(localStorage.getItem(key))?.activeMission?.missionId : null;
      });
      if (!seededId) fail("MENTOR: misja fabularna nie powstała w API");
      const mission = seededId ? await get(`/missions/${seededId}`) : { status: 0, json: null };
      if (mission.status === 200 && (mission.json?.mission_id || mission.json?.id)) {
        const missionId = mission.json.mission_id || mission.json.id;
        ok("MENTOR: misja fabularna trafiła do kolejki", mission.json.title);
        if (mission.json.status === "submitted") ok("MENTOR: dowód dziecka jest widoczny", mission.json.submitted_proof?.proof_text?.slice(0, 40) || "");
        else fail("MENTOR: misja nie ma statusu submitted", String(mission.json.status));

        const gm = await post("/gm/register", { role: "parent", name: "Mama Ali" });
        if (gm.json?.account_id) {
          ok("MENTOR: konto opiekuna utworzone");
          const verdict = await post(`/gm/verify/${missionId}`, {
            account_id: gm.json.account_id,
            verdict: "approved",
            comment_text: "Piękny dźwięk. Dziękuję!",
          });
          if (verdict.status === 200) ok("MENTOR: może zaakceptować misję");
          else fail("MENTOR: akceptacja nie powiodła się", JSON.stringify(verdict.json));

          const after = await get(`/missions/${missionId}`);
          if (after.json?.status === "verified") ok("MENTOR: status misji zmienił się na verified");
          else fail("MENTOR: status po akceptacji", String(after.json?.status));

          // Dziecko sprawdza — bez odświeżania strony.
          await page.click('[data-testid="adv-check"]');
          await page.waitForSelector('[data-testid="adv-reward"]', { timeout: 12000 });
          await shot(page, "nagroda-po-akceptacji");
          await auditViewport(page, "nagroda");
          ok("po akceptacji dziecko widzi nagrodę");

          await page.click('[data-testid="adv-next"]');
          await page.waitForSelector('[data-testid="adv-iskra"], [data-testid="adv-next"]', { timeout: 10000 });
          let g2 = 0;
          while (g2 < 20 && !(await page.locator('[data-testid="adv-go"]').count())) {
            g2 += 1;
            const nx = page.locator('[data-testid="adv-next"]');
            if (await nx.count()) {
              if (await page.locator('[data-testid="adv-iskra"]').count()) await shot(page, "iskra-wraca");
              await nx.first().click();
              await page.waitForTimeout(180);
            } else break;
          }
          const iskryNow = await page.evaluate(() => {
            const key = Object.keys(localStorage).find((k) => k.startsWith("ewolucja.adventure.v1."));
            return key ? JSON.parse(localStorage.getItem(key)).iskry : [];
          });
          if (iskryNow?.includes("iskra-lasu")) ok("Iskra wróciła do świata dziecka");
          else fail("Iskra nie została zapisana", JSON.stringify(iskryNow));

          if (await page.locator('[data-testid="adv-go"]').count()) await page.click('[data-testid="adv-go"]');
          await page.waitForSelector('[data-testid="adv-map-screen"]', { timeout: 10000 });
          await shot(page, "mapa-po-iskrze");
          const nextAfter = await page.locator('[data-testid="adv-nextstep"]').innerText();
          if (/Dolin/i.test(nextAfter)) ok("mapa odblokowała kolejną ścieżkę", nextAfter.replace(/\n/g, " · "));
          else fail("brak nowej ścieżki po Iskrze", nextAfter.replace(/\n/g, " · "));

          // Ścieżka „poproś o poprawkę" na osobnej, świeżej misji.
          const seeded = await post("/missions/seed", {
            player_id: playerId,
            title: "Drugi dźwięk",
            body: "Zapytaj kogoś jeszcze.",
            competency_focus: ["DT"],
            proof_type: "text",
            adventure_ref: "test.reject",
          });
          if (seeded.json?.mission_id) {
            await post(`/missions/${seeded.json.mission_id}/submit`, { proof_text: "krótko" });
            const rej = await post(`/gm/verify/${seeded.json.mission_id}`, {
              account_id: gm.json.account_id,
              verdict: "needs_followup",
              comment_text: "Opowiedz trochę więcej.",
            });
            if (rej.status === 200) ok("MENTOR: może poprosić o poprawkę");
            else fail("MENTOR: prośba o poprawkę nie działa", JSON.stringify(rej.json));
          } else fail("MENTOR: nie udało się utworzyć misji testowej", JSON.stringify(seeded.json));

          // Istniejące funkcje nie zostały zepsute.
          const legacy = await get(`/players/${playerId}`);
          const okLegacy = legacy.json && legacy.json.lifetime_scores && legacy.json.archetype;
          if (okLegacy) ok("istniejący profil i archetyp nadal działają", `${legacy.json.archetype} · ${JSON.stringify(legacy.json.lifetime_scores)}`);
          else fail("profil gracza uszkodzony", JSON.stringify(legacy.json)?.slice(0, 120));
          const quiz = await get("/onboarding/quiz");
          if (quiz.status === 200 && quiz.json?.questions?.length) ok("stary onboarding nadal odpowiada", `${quiz.json.questions.length} pytań`);
          else fail("stary onboarding przestał działać");
        } else fail("MENTOR: nie udało się utworzyć konta opiekuna", JSON.stringify(gm.json));
      } else fail("MENTOR: brak misji w kolejce", JSON.stringify(mission.json)?.slice(0, 120));
    }
  }

  /* 8. Fallback bez dźwięku — wyciszenie nie psuje interfejsu. */
  await page.goto(`${BASE}/mapa`, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.setItem("ewolucja.adventure.sound", "off"));
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="adv-map-screen"]', { timeout: 10000 });
  const goVisible = await page.locator('[data-testid="adv-go"]').isVisible();
  if (goVisible) ok("aplikacja działa z wyłączonym dźwiękiem");
  else fail("wyciszenie psuje interfejs");
  await shot(page, "bez-dzwieku");

  /* 9. Trwałość stanu — dziecko wraca tam, gdzie skończyło. */
  const stateOk = await page.evaluate(() => {
    const key = Object.keys(localStorage).find((k) => k.startsWith("ewolucja.adventure.v1."));
    if (!key) return null;
    const s = JSON.parse(localStorage.getItem(key));
    return { traits: s.traits, grants: s.grants?.length, mission: s.activeMission?.status };
  });
  if (stateOk && Object.values(stateOk.traits).some((v) => v > 0)) {
    ok("wybory dziecka zapisały cechy", JSON.stringify(stateOk.traits));
  } else fail("cechy nie zostały zapisane");
  // W trybie online misja zdazyla przejsc pelna petle i zostala zamknieta,
  // wiec sprawdzamy trwalosc tego, co faktycznie ma przetrwac w danym trybie.
  if (MODE === "offline") {
    if (stateOk?.mission === "sent") ok("stan misji przetrwał przeładowanie", stateOk.mission);
    else fail("stan misji nie przetrwał", String(stateOk?.mission));
  } else {
    const iskry = await page.evaluate(() => {
      const key = Object.keys(localStorage).find((k) => k.startsWith("ewolucja.adventure.v1."));
      return key ? JSON.parse(localStorage.getItem(key)).iskry : [];
    });
    if (iskry?.length) ok("postęp przetrwał przeładowanie", `iskry: ${iskry.join(", ")}`);
    else fail("postęp nie przetrwał przeładowania");
  }

  /* 10. Konsola. */
  // "Failed to load resource" to log warstwy sieciowej (brak fontow/assetow/API w sandboxie),
  // a nie blad aplikacji. Liczymy wyjatki JS i bledy naszego API w trybie online.
  const realErrors = consoleErrors.filter((e) => {
    if (/favicon|manifest|sw\.js|fonts\.googleapis|ERR_TUNNEL|ERR_NAME_NOT_RESOLVED|WASM URL|Buffered fallback|dotlottie-web/i.test(e)) return false;
    if (/Failed to load resource/i.test(e)) return MODE === "online" && /\/api\//.test(e);
    return true;
  });
  if (realErrors.length === 0) ok("brak błędów konsoli");
  else fail("błędy konsoli", realErrors.slice(0, 3).join(" | "));

  await browser.close();

  const passed = checks.filter((c) => c.pass).length;
  console.log(`\n── Wynik: ${passed}/${checks.length} ──`);
  if (problems.length) {
    console.log("Do naprawy:");
    problems.forEach((p) => console.log(`  • ${p}`));
  }
  fs.writeFileSync(path.join(SHOTS, "report.json"), JSON.stringify({ mode: MODE, checks, problems }, null, 2));
  process.exit(problems.length ? 1 : 0);
};

run().catch((e) => {
  console.error("HARNESS ERROR:", e.message);
  process.exit(2);
});
