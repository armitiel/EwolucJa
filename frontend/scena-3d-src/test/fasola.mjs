import { chromium } from "playwright";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
page.on("pageerror", (e) => console.log("ERR", e.message));
await page.goto("http://localhost:8765/scena-3d/index.html?mapa=w2&panel=0", { waitUntil: "load" });
await page.waitForFunction(() => globalThis.__POC?.app?.hero, null, { timeout: 40000 }); await page.waitForTimeout(2000);
const krok = async (nazwa, fn) => { const r = await page.evaluate(fn); console.log(nazwa, JSON.stringify(r)); await page.screenshot({ path: `test/fasola-${nazwa}.png` }); };
await page.evaluate(() => { const a = __POC.app; a._kino = null; a.clock.getDelta = () => 1/60; a.zdarzenia = []; __SCENA.on("*", (z) => a.zdarzenia.push(z.nazwa)); });
const tik = (n) => { const a = __POC.app; const R = a.renderer.render; a.renderer.render = () => {}; for (let i = 0; i < n; i++) a.tick(); a.renderer.render = R; a.renderer.render(a.scene, a.camera); };
await page.exposeFunction("noop", () => {});
await krok("start", () => { const a = __POC.app; return { pos: __POC.pos(), stan: __SCENA.stan().fasola }; });
for (let e = 1; e <= 4; e++) {
  await krok(`podlanie${e}`, () => {
    const a = __POC.app;
    const R = a.renderer.render; a.renderer.render = () => {};
    a.ustawBohatera(6.2, 8.4); for (let i = 0; i < 30; i++) a.tick();
    const kropla = !!a.kropla.ile;
    a.ustawBohatera(0.9, 14.2); for (let i = 0; i < 130; i++) a.tick();
    a.renderer.render = R; a.renderer.render(a.scene, a.camera);
    return { kropla, stan: __SCENA.stan().fasola, zd: a.zdarzenia.splice(0) };
  });
}
await krok("wspinaczka", () => {
  const a = __POC.app;
  const R = a.renderer.render; a.renderer.render = () => {};
  a.ustawBohatera(6.2, 8.4); for (let i = 0; i < 20; i++) a.tick(); a.ustawBohatera(0.5, 14.3); for (let i = 0; i < 120; i++) a.tick();
  const wPolowie = { seq: a.sequence, lift: +a.heroLift.toFixed(2), pos: __POC.pos() };
  a.renderer.render = R; a.renderer.render(a.scene, a.camera);
  return { wPolowie, zd: a.zdarzenia.splice(0) };
});
await krok("szczyt", () => {
  const a = __POC.app;
  const R = a.renderer.render; a.renderer.render = () => {};
  for (let i = 0; i < 160; i++) a.tick();
  a.renderer.render = R; a.renderer.render(a.scene, a.camera);
  return { seq: a.sequence, lift: +a.heroLift.toFixed(2), zd: a.zdarzenia.splice(0), stan: __SCENA.stan().fasola };
});
await browser.close();
