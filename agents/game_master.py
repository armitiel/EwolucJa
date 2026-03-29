"""
GAMA-1 Game Master — Silnik AI sterujący narracją i profilowaniem.

Odpowiada za:
1. Ładowanie scenariuszy krain z plików promptów
2. Wysyłanie kontekstu do modelu LLM (OpenAI API)
3. Walidację odpowiedzi AI wg schematów JSON
4. Obliczanie punktów profilu na podstawie wyborów gracza
5. Generowanie raportu końcowego (uczeń + nauczyciel)

Użycie:
    gm = GameMaster(api_key="sk-...")
    response = await gm.enter_land("las_decyzji", player_profile)
    updated_profile = gm.process_choice(player_profile, choice_data)
"""

import json
import os
from pathlib import Path
from datetime import datetime

# ── Konfiguracja ścieżek ──────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
PROMPTS_DIR = BASE_DIR / "prompts"
SCHEMAS_DIR = BASE_DIR / "schemas"

# ── Tabela punktacji ──────────────────────────────────────────────────
SCORING_TABLE = {
    # KRAINA 1: Dolina Selfie
    (1, "A"): {"DT": 2},
    (1, "B"): {"LD": 2},
    (1, "C"): {"ST": 2},
    (1, "D"): {"KR": 1},

    # KRAINA 2: Las Decyzji — Rozwidlenie
    (2, "A"): {"ST": 2},
    (2, "B"): {"DT": 3},

    # KRAINA 2: Las Decyzji — Chowaniec
    (3, "A"): {"EM": 2},
    (3, "B"): {"MD": 1},
    (3, "C"): {"ST": 2, "EM": -1},

    # KRAINA 3: Jaskinia Emocji — Skarbiec Czasu
    (4, "WAIT"):  {"ST": 3},
    (4, "CLICK"): {"LD": 1},

    # KRAINA 3: Jaskinia Emocji — Strażnik Masek
    # Punkty przyznawane dynamicznie: +1 EM, +1 DT za każde trafienie (maks 3)

    # KRAINA 4: Wyspa Talentów — Zagadka
    (6, "A"): {"ST": 2, "LD": 1},
    (6, "B"): {"MD": 2},
    (6, "C"): {},  # brak punktów za pominięcie

    # KRAINA 4: Wyspa Talentów — Przepaść
    # Punkty KR przyznawane dynamicznie przez AI (1-4)

    # KRAINA 5: Przystań Współpracy — Kłótnia
    (8, "A"): {"LD": 1, "MD": -1},
    (8, "B"): {"MD": 2},
    (8, "C"): {"MD": 2, "ST": 1},

    # KRAINA 5: Przystań Współpracy — Tratwa
    (9, "A"): {"LD": 2},
    (9, "B"): {"ST": 1},
    (9, "C"): {"EM": 2},
}

# ── Tabela tytułów hybrydowych ────────────────────────────────────────
HYBRID_TITLES = {
    ("DT", "KR"): "Wizjoner Tajemnic",
    ("EM", "MD"): "Strażnik Pokoju",
    ("LD", "ST"): "Generał Przygody",
    ("KR", "ST"): "Architekt Przyszłości",
    ("DT", "EM"): "Odkrywca Serc",
    ("KR", "LD"): "Mistrz Inwencji",
    ("LD", "MD"): "Kapitan Drużyny",
    ("DT", "ST"): "Łamacz Kodów",
    ("EM", "KR"): "Artysta Emocji",
    ("DT", "MD"): "Dyplomata Wiedzy",
    ("EM", "LD"): "Odważne Serce",
    ("MD", "ST"): "Mędrzec Pokoju",
    ("EM", "ST"): "Cierpliwy Opiekun",
    ("KR", "MD"): "Twórczy Mediator",
    ("DT", "LD"): "Śmiały Tropiciel",
}

LANDS_ORDER = [
    "dolina_selfie",
    "las_decyzji",
    "jaskinia_emocji",
    "wyspa_talentow",
    "przystan_wspolpracy",
    "gora_podsumowania",
]


class GameMaster:
    """Główny kontroler gry GAMA-1."""

    def __init__(self, api_key: str | None = None, model: str = "gpt-4o-mini"):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.model = model
        self.temperature = 0.4
        self.system_prompt = self._load_prompt("system_prompt.txt")
        self.land_scenarios = self._load_prompt("lands_scenarios.txt")
        self.player_schema = self._load_schema("player_profile.json")

    # ── Ładowanie plików ──────────────────────────────────────────────

    def _load_prompt(self, filename: str) -> str:
        path = PROMPTS_DIR / filename
        return path.read_text(encoding="utf-8")

    def _load_schema(self, filename: str) -> dict:
        path = SCHEMAS_DIR / filename
        return json.loads(path.read_text(encoding="utf-8"))

    # ── Tworzenie nowego profilu gracza ───────────────────────────────

    def create_player(self, player_id: str, name: str) -> dict:
        """Tworzy czysty profil gracza z zerową punktacją."""
        return {
            "player_id": player_id,
            "player_name": name,
            "avatar": {
                "base_image": None,
                "aura_color": None,
                "starter_item": None,
                "unlocked_assets": [],
            },
            "scores": {"EM": 0, "ST": 0, "KR": 0, "LD": 0, "DT": 0, "MD": 0},
            "completed_lands": [],
            "current_land": LANDS_ORDER[0],
            "choices_log": [],
            "final_profile": None,
        }

    # ── Przetwarzanie wyborów gracza ──────────────────────────────────

    def process_choice(self, profile: dict, task_id: int, choice_id: str,
                       behavioral_data: dict | None = None) -> dict:
        """
        Przetwarza wybór gracza i aktualizuje punkty.

        Args:
            profile: Aktualny profil gracza.
            task_id: Numer zadania (1-9).
            choice_id: ID wybranej opcji (np. "A", "B", "WAIT").
            behavioral_data: Dodatkowe dane behawioralne (np. czas reakcji).

        Returns:
            Zaktualizowany profil gracza.
        """
        # Pobierz punkty z tabeli
        points = SCORING_TABLE.get((task_id, choice_id), {})

        # Zastosuj punkty (z limitem 0-10)
        for skill, delta in points.items():
            current = profile["scores"].get(skill, 0)
            profile["scores"][skill] = max(0, min(10, current + delta))

        # Zapisz log wyboru
        log_entry = {
            "land": profile["current_land"],
            "task_id": task_id,
            "choice_id": choice_id,
            "timestamp": datetime.utcnow().isoformat(),
            "points_awarded": points,
            "behavioral_data": behavioral_data or {},
        }
        profile["choices_log"].append(log_entry)

        return profile

    # ── Specjalne mechaniki ───────────────────────────────────────────

    def process_marshmallow(self, profile: dict, waited: bool,
                            wait_time_ms: int) -> dict:
        """Obsługuje Test Marshmallow (Zadanie 4)."""
        choice = "WAIT" if waited else "CLICK"
        return self.process_choice(profile, 4, choice, {
            "reaction_time_ms": wait_time_ms,
            "waited_full_duration": waited,
        })

    def process_emotion_matching(self, profile: dict,
                                  matches: dict[str, str]) -> dict:
        """
        Obsługuje Strażnika Masek (Zadanie 5).

        Args:
            matches: {"frustration": "frustracja", "embarrassment": "zakłopotanie", ...}
        """
        correct_answers = {
            "frustration": "frustracja",
            "embarrassment": "zakłopotanie",
            "pride": "duma",
        }
        correct_count = sum(
            1 for key, val in matches.items()
            if correct_answers.get(key, "").lower() == val.lower()
        )
        # +1 EM i +1 DT za każde trafienie
        for _ in range(correct_count):
            profile["scores"]["EM"] = min(10, profile["scores"]["EM"] + 1)
            profile["scores"]["DT"] = min(10, profile["scores"]["DT"] + 1)

        profile["choices_log"].append({
            "land": "jaskinia_emocji",
            "task_id": 5,
            "choice_id": f"MATCH_{correct_count}/3",
            "timestamp": datetime.utcnow().isoformat(),
            "points_awarded": {"EM": correct_count, "DT": correct_count},
            "behavioral_data": {"matches": matches, "correct_count": correct_count},
        })
        return profile

    def process_creativity(self, profile: dict, answer: str,
                           ai_creativity_score: int) -> dict:
        """
        Obsługuje Przepaść i Pudełko (Zadanie 7).

        Args:
            answer: Odpowiedź tekstowa ucznia.
            ai_creativity_score: Ocena kreatywności od AI (1-4).
        """
        kr_points = max(1, min(4, ai_creativity_score))
        profile["scores"]["KR"] = min(10, profile["scores"]["KR"] + kr_points)

        profile["choices_log"].append({
            "land": "wyspa_talentow",
            "task_id": 7,
            "choice_id": f"CREATIVE_{kr_points}",
            "timestamp": datetime.utcnow().isoformat(),
            "points_awarded": {"KR": kr_points},
            "behavioral_data": {"free_text_input": answer, "ai_score": ai_creativity_score},
        })
        return profile

    # ── Przejście między krainami ─────────────────────────────────────

    def advance_land(self, profile: dict) -> dict:
        """Przenosi gracza do kolejnej krainy."""
        current = profile["current_land"]
        if current in LANDS_ORDER:
            idx = LANDS_ORDER.index(current)
            profile["completed_lands"].append(current)
            if idx + 1 < len(LANDS_ORDER):
                profile["current_land"] = LANDS_ORDER[idx + 1]
            else:
                profile["current_land"] = None  # Gra ukończona
        return profile

    # ── Generowanie profilu końcowego ─────────────────────────────────

    def generate_final_profile(self, profile: dict) -> dict:
        """Oblicza profil hybrydowy i przypisuje tytuł."""
        scores = profile["scores"]

        # Posortuj profile malejąco
        sorted_profiles = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        top_two = tuple(sorted(p[0] for p in sorted_profiles[:2]))

        # Znajdź tytuł hybrydowy
        title = HYBRID_TITLES.get(top_two, "Bohater Nieznanych Krain")

        # Profil z najniższym wynikiem = wyzwanie
        lowest = sorted_profiles[-1]

        profile["final_profile"] = {
            "dominant_profiles": [sorted_profiles[0][0], sorted_profiles[1][0]],
            "hybrid_title": title,
            "scores_sorted": {p[0]: p[1] for p in sorted_profiles},
            "challenge_area": lowest[0],
            "student_report": None,   # Wypełniane przez LLM
            "teacher_report": None,   # Wypełniane przez LLM
            "avatar_assets": [],      # Wypełniane przez system renderowania
        }
        return profile

    # ── Wywołanie LLM ─────────────────────────────────────────────────

    async def call_llm(self, messages: list[dict]) -> str:
        """
        Wysyła zapytanie do OpenAI API.

        W produkcji użyj: openai.AsyncOpenAI(api_key=self.api_key)
        Tu zostawiamy stub do integracji.
        """
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=self.api_key)
            response = await client.chat.completions.create(
                model=self.model,
                temperature=self.temperature,
                max_tokens=500,
                messages=messages,
                response_format={"type": "json_object"},
            )
            return response.choices[0].message.content
        except ImportError:
            # Fallback: zwróć placeholder jeśli brak biblioteki openai
            return json.dumps({
                "narration": "[LLM niedostępny — zainstaluj pakiet openai]",
                "choices": [],
            })

    async def enter_land(self, land_name: str, profile: dict) -> dict:
        """
        Wchodzi do krainy — ładuje scenariusz i generuje narrację przez LLM.
        """
        messages = [
            {"role": "system", "content": self.system_prompt},
            {
                "role": "user",
                "content": (
                    f"Gracz: {profile['player_name']}\n"
                    f"Aktualna kraina: {land_name}\n"
                    f"Dotychczasowe punkty: {json.dumps(profile['scores'])}\n\n"
                    f"--- SCENARIUSZ KRAINY ---\n"
                    f"{self._get_land_section(land_name)}\n\n"
                    f"Wygeneruj odpowiedź narratora w formacie JSON "
                    f"zgodnym ze schematem narrator_response."
                ),
            },
        ]
        response_text = await self.call_llm(messages)
        return json.loads(response_text)

    async def generate_reports(self, profile: dict) -> dict:
        """Generuje raport dla ucznia i nauczyciela przez LLM."""
        messages = [
            {"role": "system", "content": self.system_prompt},
            {
                "role": "user",
                "content": (
                    f"Gracz: {profile['player_name']}\n"
                    f"Profil końcowy: {json.dumps(profile['final_profile'])}\n"
                    f"Pełne punkty: {json.dumps(profile['scores'])}\n"
                    f"Log wyborów: {json.dumps(profile['choices_log'])}\n\n"
                    f"Wygeneruj:\n"
                    f"1. 'student_report': Raport dla ucznia (język przygody, 3-5 zdań).\n"
                    f"2. 'teacher_report': Raport dla nauczyciela zgodny ze schematem "
                    f"teacher_report.json (terminologia CASEL i VIA).\n"
                    f"Odpowiedz w formacie JSON."
                ),
            },
        ]
        response_text = await self.call_llm(messages)
        reports = json.loads(response_text)

        profile["final_profile"]["student_report"] = reports.get("student_report")
        profile["final_profile"]["teacher_report"] = reports.get("teacher_report")
        return profile

    def _get_land_section(self, land_name: str) -> str:
        """Wyodrębnia fragment scenariusza dla danej krainy."""
        land_headers = {
            "dolina_selfie": "KRAINA 1: DOLINA SELFIE",
            "las_decyzji": "KRAINA 2: LAS DECYZJI",
            "jaskinia_emocji": "KRAINA 3: JASKINIA EMOCJI",
            "wyspa_talentow": "KRAINA 4: WYSPA TALENTÓW",
            "przystan_wspolpracy": "KRAINA 5: PRZYSTAŃ WSPÓŁPRACY",
            "gora_podsumowania": "GÓRA PODSUMOWANIA",
        }
        header = land_headers.get(land_name, "")
        text = self.land_scenarios

        start = text.find(header)
        if start == -1:
            return f"[Brak scenariusza dla krainy: {land_name}]"

        # Znajdź koniec sekcji (następny separator '====')
        next_section = text.find("=" * 20, start + len(header) + 1)
        if next_section == -1:
            return text[start:]
        return text[start:next_section].strip()


# ── Punkt wejścia do testowania ───────────────────────────────────────

if __name__ == "__main__":
    import asyncio

    async def demo():
        gm = GameMaster()
        player = gm.create_player("test-001", "Kasia")

        print("=== Nowy gracz ===")
        print(json.dumps(player["scores"], indent=2))

        # Symulacja wyborów
        player = gm.process_choice(player, 1, "A")   # Lupa -> +2 DT
        player = gm.process_choice(player, 2, "B")   # Ścieżka -> +3 DT
        player = gm.process_choice(player, 3, "A")   # Pomoc -> +2 EM
        player = gm.process_marshmallow(player, waited=True, wait_time_ms=30000)
        player = gm.process_emotion_matching(player, {
            "frustration": "frustracja",
            "embarrassment": "zakłopotanie",
            "pride": "duma",
        })
        player = gm.process_choice(player, 6, "A")   # Retry -> +2 ST, +1 LD
        player = gm.process_creativity(player, "Użyję parasola jako spadochronu", 3)
        player = gm.process_choice(player, 8, "C")   # Kompromis -> +2 MD, +1 ST
        player = gm.process_choice(player, 9, "A")   # Kapitan -> +2 LD

        player = gm.generate_final_profile(player)

        print("\n=== Profil końcowy ===")
        print(json.dumps(player["scores"], indent=2))
        print(f"Tytuł: {player['final_profile']['hybrid_title']}")
        print(f"Dominujące: {player['final_profile']['dominant_profiles']}")

    asyncio.run(demo())
