/**
 * postacie.js — rejestr bohaterów (dawniej doklejony na początku bundla).
 *
 * Wybór postaci: `globalThis.SCENA3D_POSTAC = "fox"` PRZED utworzeniem sceny
 * (React: `components/Scena3D.jsx`; podgląd: `index.html?postac=`).
 * Każda postać: `plik` (GLB w assets/), `klipy` (nazwy z GLB → walk/run/idle/
 * happy), `tempo` (mnożniki timeScale), `wyglad` (tint/self/env materiału).
 *
 * Klipy lisa są ODWROTNE niż chłopca: NlaTrack = run, NlaTrack.001 = walk
 * (zweryfikowane pomiarem amplitudy kości, nie na oko).
 */
globalThis.SCENA3D_POSTACIE = globalThis.SCENA3D_POSTACIE || {
  adventurer: {
    plik: "adventurer",
    klipy: { NlaTrack: "walk", "NlaTrack.001": "run", "NlaTrack.002": "idle", "NlaTrack.003": "happy" },
    tempo: {},
  },
  fox: {
    plik: "fox",
    klipy: { NlaTrack: "run", "NlaTrack.001": "walk", "NlaTrack.002": "idle", "NlaTrack.003": "happy" },
    tempo: { run: 1.29 },
    wyglad: { tint: 0.85, env: 0.38 },
  },
};

globalThis.__SCENA3D_POSTAC = function () {
  const n = globalThis.SCENA3D_POSTAC || "adventurer";
  return globalThis.SCENA3D_POSTACIE[n] || { plik: n, klipy: null, tempo: {} };
};

export function postac() {
  return globalThis.__SCENA3D_POSTAC();
}
