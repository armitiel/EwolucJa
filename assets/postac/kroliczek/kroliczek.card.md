# Karta asetu: kroliczek

id: kroliczek
typ: postac
opis: mały króliczek — postać DRUGOPLANOWA (secondary), low-poly; biega na czterech łapach; kremowo-piaskowe futro, różowe wnętrze uszu, bez chustki; ta sama paleta i nastrój co Lisek
skala_w_grze_m: 0.45       # mniejszy niż bohaterowie (fox 0.99 m) — zwierzątko drugoplanowe
rig_type: quadruped        # Tripo v2.5: preset tylko walk → idle/run własne w Blenderze (lub walk z timeScale jako run)
animacje: idle, walk, run   # secondary — bez happy; nazwy jak w rejestrze
animacje_wlasne: idle, run # idle = oddech/uszy w Blenderze; run = walk 1.6× lub własna
budzet_tris: 2500          # low-poly secondary; fox.glb (bohater) ma 6 432
tekstura_px: 512           # low-poly → flat colors, 512 w zupełności wystarczy
pivot: center_bottom
front: -Y w Blenderze → +Z w Three.js (jak fox)
styl: DNA claymorphism z docs/grafika.md §2 + paleta tokenów

## Log
- 2026-09-10: karta założona; saldo Tripo 1000 kredytów; koncept: gpt-image-2, generations, białe tło (lekcja z gen-postac.mjs: transparent na edits wraca złotym tłem)

## task_id (Tripo)
- 2026-09-10: v1 (biped, clay) odrzucona przez autora: ma być low-poly, drugoplanowa, na 4 łapach → v2 z --poza=quad --lowpoly
- image_to_model: 6c3f839a-64aa-4597-95a3-764d2cc0e6bd (v3.1-20260211, smart_low_poly, face_limit 2500, 40 kredytów) → tripo/kroliczek_model.glb (2 479 tris, 3 tekstury 2048 jpeg: Color/ORM/NormalGL; bbox 0.77×1.0×0.70, pivot w środku)
- convert_model (fbx, niepotrzebny — efekt uboczny `--for game-mobile`): b1837975-d3e7-4c19-a32b-bdc233b791f7, 10 kredytów. Następnym razem bez `--for`.
- rig-check: 14a22fc4 (riggable, quadruped, 0 kr.) · rig: 06dfd6e2-3dc3-445c-89ba-bbff60c85a46 (quadruped, spec tripo, 25 kr.) · retarget walk in-place: d91ea2c1-c083-40e7-a5b3-14f6c8af8f6d (10 kr.)
- Blender (scripts/blender/kroliczek_build.py, Blender 4.3 headless): skala 0.45 m, pivot spód, przód -Y (obrót -90° Z), tylko Base Color 512 webp (ORM/normal usunięte), klipy: idle (48 kl., oddech+ucho), hop (21 kl., w miejscu: przysiad→wybicie→apex 0.15 m→lądowanie, uszy), walk (Tripo). Eksport: assets/postac/kroliczek/export/kroliczek.glb (297 KB) → frontend/public/scena-3d/assets/kroliczek.glb
- Lekcje: (1) importer glTF ustawia rotation_mode=QUATERNION na armaturze — rotation_euler bez zmiany trybu jest ignorowane; (2) akcje Tripo mają klucze na OBIEKCIE armatury (location/scale) — nadpisują skalę/pivot, usunąć; (3) transform_apply na armaturze Tripo przesuwa mesh o +1 m — zostawiać transformacje na obiekcie; (4) poza spoczynkowa rigu = poprawne stanie, walk ma wysuniętą łapę — idle/hop budować na rest
- Integracja: scena ładuje `mapa.znaki[].file` + `animuj:true` → gra `animations[0]` (u nas idle). Poruszanie w podskokach (hop + przemieszczenie) wymaga logiki wędrującego NPC w scena-3d-src — do zrobienia.
