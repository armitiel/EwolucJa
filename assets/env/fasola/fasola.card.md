id: fasola
typ: env (roślina, 5 etapów wzrostu — pięć osobnych modeli statycznych)
opis: Magiczna Fasola z arkusza konceptu „Magic Bean Vine": ziarno → kiełek → młody pęd → skręcony pęd → spiralna ścieżka. Styl gry: miękkie bryły, czytelne sylwetki, dla dzieci.
skala_w_grze_m: 0.45 / 0.9 / 1.9 / 3.2 / 5.5   (wysokości etapów; silnik normalizuje wysokość sam — `mapa-w2.json → fasola.etapy[].wysokosc`)
rig_type: brak (statyczne)
animacje: brak (wzrost i wspinaczka robi silnik — `scena-3d-src/src/fasola.js`)
budzet_tris: 1500 (etapy 1–2), 3000 (3–4), 5000 (5)
tekstura_px: 512
pivot: center_bottom (silnik i tak stawia spód na ziemi: bbox.min.y → 0, środek XZ → punkt)
front: dowolny (roślina obrotowa); `fasola.obrot` w mapie
wzorzec: lisc.glb (prop 74 KB)
koncepty: concept/fasola_<n>_concept.png — wycięte z arkusza użytkownika (2026-09-13), białe tło, po jednym obiekcie
pliki w grze: frontend/public/scena-3d/assets/fasola_1.glb … fasola_5.glb (brak pliku = bryła zastępcza z fasola.js)

Tripo task_id:
  fasola_1: 5226bba0-1d3e-448b-b932-731acd2f40f3  (image_to_model, v3.1, smart_low_poly, 2026-09-13)
  fasola_2: 27dfa2df-fa8c-446b-a882-b3832c5abc8e  (image_to_model, v3.1, smart_low_poly, 2026-09-13)
  fasola_3: c5fae8dc-6843-4e29-a69b-ae507605d069  (image_to_model, v3.1, smart_low_poly, 2026-09-13)
  fasola_4: 753697d9-523b-4e47-ac5a-0f7d0041ecb4  (image_to_model, v3.1, smart_low_poly, 2026-09-13)
  fasola_5: 1873444e-ecfe-40a7-bf9f-76aa379d27d7  (image_to_model, v3.1, smart_low_poly, 2026-09-13)

## Wynik Tripo (13.09) — 5 × 40 kr. = 200 kr.
- Surowe: `tripo/tripo-out/fasola-N-<id8>/model.glb` (2,4k–8,3k ścianek, 3 × JPEG 2048).
- Czyszczenie bez Blendera: `scripts/glb/glb_clean.py` (numpy) — wycięte podstawki/płyty,
  tło za pnączem (etap 5), drzazgi i pływające kamyki; zostaje sam mesh + baseColor
  (etapy 1–2: 512 px webp, 3–5: 1024 px webp). Podglądy klasyfikacji: `f*_cut.png` w skrypcie.
- Eksport: `export/fasola_1..5.glb` (130–630 KB) → skopiowane do `frontend/public/scena-3d/assets/`.
- Silnik normalizuje wysokość (`wysokosc` w mapa-w2.json), środek XZ i spód — bez zmian w kodzie.
- Uwagi: etap 1 ma nad nasionkiem 3 białe „iskierki" (z konceptu) — zostawione celowo.
