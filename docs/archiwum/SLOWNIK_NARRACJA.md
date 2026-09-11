# EwolucJA — Słownik narracji i dwie ścieżki do wyboru

> Dokument roboczy do decyzji autorki projektu.
> Po wyborze ścieżki (A lub B) — refactor w kodzie wg tabeli zamian.

---

## CZĘŚĆ 1: Co jest TERAZ w kodzie (audyt)

### Co już istnieje — i gdzie się gryzie

**Narrator / przewodnik** — w kodzie jest aż 4 postaci, częściowo te same, częściowo różne:
- `GAMA-1` — `backend/src/agents/NarratorAgent.js`, `GameOrchestrator.js`, `agents/world/zakatek_gama.md` (jako Narrator)
- `Mędrzec` — `backend/src/data/mentorTaskLibrary.js` ("Mędrzec szepcze"), `frontend/src/pages/Games.jsx` ("Pamięć Mędrca"), `PoradyPage.jsx` ("Od Mędrca"), `WorldHub.jsx` ("SZEPT MĘDRCZYNI" — wariant żeński!)
- `Mentor` — `MentorBubble.jsx`, `backend/src/api/mentor.js`, `zakatek_gama.md` ("Mentor (Sowa)") — kolizja: jest jednocześnie postacią w grze ORAZ rolą realnego nauczyciela/rodzica w panelu
- `Narrator` — `NarratorVoice.jsx`, `backend/src/api/narrative.js`

**Świat / hub:**
- `Zakątek Gamma` — żyje TYLKO w dokumentacji autorskiej (`agents/world/zakatek_gama.md`). Gracz NIGDY nie widzi tej nazwy w UI.
- W UI: brak jednej nazwy hubu.

**Krainy — DWA równoległe zestawy (!):**
- Oficjalne 6: Dolina Selfie, Las Pytań, Jaskinia Emocji, Wyspa Talentów, Przystań Współpracy, Góra Podsumowania (`backend/NarratorAgent.js`, `App.jsx LAND_NAMES`, docs)
- W `frontend/src/pages/MapView.jsx`: **inne nazwy** — Morze Słów, Góry Liczb, Zamek Czasu, Pustynia Pomysłów, Niebo Marzeń → to relikt po szkolnym MVP albo zapomniana placeholder-mapa.

**Gracz** — trzy słowa w różnych miejscach:
- `Gracz` (`game.js`, `psychologia_baza.md`)
- `Bohater` (`CharakterBohatera.jsx`, `HYBRID_TITLES`, `zakatek_gama.md`)
- `Uczeń` (`scenariusz_pelny.md`, `backend/onboarding.js`)

**Mechanika "Kronika":**
- Tylko w dokumentacji (`zakatek_gama.md`: "Kronika to serce Zakątka").
- Sformułowanie "rozpoznała Cię" — nie znalezione w kodzie (prawdopodobnie generowane dynamicznie przez Claude API w NarratorAgent prompt).

**Archetypy** — działa nowy system kodów (DT, EM, ST, KR, LD, MD) + 6 ładnych nazw (Detektyw, Empata, Strateg, Kreator, Lider, Mediator), ale w `Onboarding.jsx` jest jeszcze `LEGACY_TO_PROFILE` (tropiciel_tajemnic, zaklinacz_uczuc...) — można usunąć, jak tylko potwierdzimy, że nic z legacy ID nie leci z bazy.

**Etapy** — miks: `misja` / `zwój` (`zakatek_gama.md`: "zwój = misja") / `wyzwanie` / `zadanie` / `cykl`.

**Tytuł projektu:** "EwolucJA" pojawia się głównie w nagłówkach UI. W systemPrompt NarratorAgenta — "Ewolucja" (bez wielkiego JA). Drobna niespójność typograficzna.

---

## CZĘŚĆ 2: Dwie ścieżki narracyjne

Pełne wizje (pisane przez dwóch równoległych agentów) — poniżej skrócona porównawcza tabela. Po wyborze: refactor.

### Tabela porównawcza

| Element | Ścieżka A — Kronikarka Wiela | Ścieżka B — Agentka GAMA-1 |
|---|---|---|
| **Klimat** | Mistyczno-baśniowy, skryptorium, witraże, pieczęcie | Sci-przygodowy, fale gamma, świetlista istota, misje |
| **Narrator** | **Wiela** — Kronikarka Charakteru. Starsza, ciepła, archaiczna. | **GAMA-1** — Agentka ze światła (fale gamma = olśnienia). Ciepła, ciekawska, śpiewna. |
| **Nazwa projektu w UI dziecka** | "Kronika Charakteru" (EwolucJA znika z gry, zostaje jako brand) | "EwolucJA" (gra słów: JA + ewolucja) |
| **Hub / świat** | **Skryptorium** (sala kronikarki) | **Zakątek Gamma** (zostaje, doprecyzowany jako miejsce między światami) |
| **Gracz** | Kandydat / Kronikowany / Bohater Własnej Kroniki | **Agent / Agentka** (Świeży Agent po quizie) |
| **Kronika** | Realna księga na ekranie. Wiela ją czyta. "Kronika otworzyła Twoją pierwszą stronę" | "Kronika Gammy" — system pamięci Agentki. "Kronika zapamiętała Twoją pierwszą iskrę" |
| **6 archetypów** | **Pieczęcie** (Serca, Mapy, Iskry, Płomienia, Lupy, Mostu) | **Iskry** (Serca, Planu, Wyobraźni, Wodza, Tropu, Mostu) |
| **Etapy** | Wyprawa (do krainy) / Próba (pytanie) / Wpis (nagroda) / Cykl (tydzień) | Misja / Kraina / Odkrycie (nagroda) / Cykl |
| **Co ginie** | GAMA-1, Mędrzec, Zakątek Gamma, "misja" | Mędrzec, "Mentor" w narracji (zostaje tylko w panelu dorosłego) |
| **Co zostaje** | Kronika (wzmocniona), 6 krain, Mentor=panel dorosłego, EwolucJA=brand | GAMA-1, Zakątek Gamma, Kronika, EwolucJA, 6 krain |
| **Skala zmian w kodzie** | DUŻA (rebrand UI, "Kronika Charakteru" zastępuje "EwolucJA" w grze) | ŚREDNIA (porządkowanie + dopisanie semantyki, mniej zamian) |

### 3 zdania narratora — porównanie tonu

**Ścieżka A — Wiela:**
> "Witaj. Twoja Kronika leżała tu długo, czysta. Dziś otwieramy pierwszą stronę — razem."
> "W Lesie Pytań nie ma złych odpowiedzi. Są tylko te, które jeszcze nie wiedzą, że są twoje."
> "Zapisuję, co dziś zrobiłaś. Pieczęć Iskry — twoja czwarta. Kronika rośnie szybciej, niż myślisz."

**Ścieżka B — GAMA-1:**
> "Czujesz to migotanie w środku? To Twoja Iskra Serca — właśnie się obudziła. Chodź, pokażę Ci, co potrafi."
> "W Lesie Pytań nie ma złych odpowiedzi, Agencie. Są tylko te, których jeszcze nie wypowiedziałeś na głos."
> "Kronika zapisała dziś trzy nowe strony o Tobie. Zajrzymy do nich razem, czy zostawimy je na jutro?"

---

## CZĘŚĆ 3: Wspólne — niezależnie od wyboru A/B

Te rzeczy trzeba ujednolicić TAK CZY INACZEJ:

1. **"Mentor" = TYLKO dorosły opiekun w panelu mentora.** W grze dziecka słowo "mentor" nie pada. Wszystkie wystąpienia "Mędrzec" / "Mędrczyni" → zamiana na narratora (Wiela LUB GAMA-1, zależnie od ścieżki).
2. **MapView.jsx — odjeb.** Albo zaktualizować na 6 oficjalnych krain, albo wywalić (jeśli nie jest aktywnym ekranem). Decyzja techniczna.
3. **Gracz w polszczyźnie** — wybrać JEDNO słowo: "Bohater" (A) lub "Agent/Agentka" (B). Wszędzie indziej "Gracz" zostaje w kodzie technicznym (zmiennych), nie w UI.
4. **EwolucJA / Ewolucja** — ujednolicić typografię (wielkie "JA" w obu wariantach, jeśli zostaje).
5. **`LEGACY_TO_PROFILE`** w `Onboarding.jsx` — usunąć po potwierdzeniu, że stare ID nie wracają z DB.
6. **Komponent `CharakterBohatera.jsx`** — przemianować zgodnie ze ścieżką (A: `CharakterKronikowanego`, B: `CharakterAgenta`) lub zostawić generycznie `CharakterPostaci`.

---

## CZĘŚĆ 4: Decyzja

Wybór A lub B otwiera refactor. Po wyborze:

1. Konkretna tabela zamian (stary termin → nowy, lista plików).
2. Refaktor plik-po-pliku (bez `sed -i` na wielu plikach — pamięć z CLAUDE.md o truncate).
3. Grep weryfikacyjny: czy nic ze starej nomenklatury nie zostało.
4. Build/test lokalny przed push (na `v2-postgres-vercel`).
