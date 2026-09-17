/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
try {
  const m = await import("./backend/src/api/tts.js");
  console.log("ttsRoutes type:", typeof m.ttsRoutes);
} catch (e) {
  console.log("IMPORT ERR:", e.message);
  console.log(e.stack);
}
