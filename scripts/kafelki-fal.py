# SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
# SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
#
# EwolucJA — gra edukacyjna dla dzieci.
# Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
# autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
"""
Dogenerowanie brakujacych kafelkow onboardingu przez fal.ai.

Po co osobny skrypt: konto OpenAI wyczerpalo srodki w polowie batcha
(429 `credit_balance_exhausted`), a fal.ai rozlicza sie osobno. Prompt jest
TEN SAM - importowany z `kafelki-onboarding.py`, zeby nie powstala druga,
rozjezdzajaca sie kopia opisow.

Model: `fal-ai/flux/dev` (tekst -> obraz). NIE image-to-image, choc mamy juz
gotowe kafelki: img2img przeciagnalby kompozycje sasiada, a wlasnie o rozne
kompozycje przy tym samym stylu tu chodzi.

Uruchomienie:  python scripts\\kafelki-fal.py woz-b woz-c woz-d
               python scripts\\kafelki-fal.py        (wszystkie brakujace)
Klucz: backend/.env -> FAL_KEY
"""
import importlib.util, json, pathlib, re, sys, time, urllib.request, urllib.error

ROOT = pathlib.Path(__file__).resolve().parents[1]
KAT = ROOT / "frontend" / "public" / "assets" / "onboarding"

_spec = importlib.util.spec_from_file_location("kafelki_onb", ROOT / "scripts" / "kafelki-onboarding.py")
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)
KAFELKI, prompt = _mod.KAFELKI, _mod.prompt


def klucz():
    t = (ROOT / "backend" / ".env").read_text("utf-8", "ignore")
    m = re.search(r"FAL_KEY\s*=\s*['\"]?([^\s'\"]+)", t)
    if not m:
        sys.exit("Brak FAL_KEY w backend/.env.")
    return m.group(1)


KLUCZ = klucz()
NAGLOWKI = {"Authorization": "Key " + KLUCZ, "Content-Type": "application/json"}


def wolaj(url, dane=None):
    req = urllib.request.Request(
        url,
        data=json.dumps(dane).encode() if dane is not None else None,
        headers=NAGLOWKI,
    )
    return json.loads(urllib.request.urlopen(req, timeout=120).read())


def generuj(nazwa):
    """Kolejka fal.ai: zlecenie -> odpytywanie statusu -> pobranie obrazka.
    Flux nie ma trybu 'high quality' jak gpt-image, ale ma `num_inference_steps`
    — 40 krokow przy 1024 daje czysty, rowny rysunek bez artefaktow w glinie."""
    zlecenie = wolaj("https://queue.fal.run/fal-ai/flux/dev", {
        "prompt": prompt(nazwa),
        "image_size": "square_hd",
        "num_inference_steps": 40,
        "guidance_scale": 3.5,
        "num_images": 1,
        "enable_safety_checker": True,
    })
    status_url = zlecenie["status_url"]
    for _ in range(90):
        time.sleep(2)
        st = wolaj(status_url)
        if st.get("status") == "COMPLETED":
            break
        if st.get("status") == "FAILED":
            raise RuntimeError(f"{nazwa}: fal zwrocil FAILED")
    else:
        raise TimeoutError(f"{nazwa}: fal nie oddal obrazka w trzy minuty")
    wynik = wolaj(zlecenie["response_url"])
    adres = wynik["images"][0]["url"]
    plik = KAT / f"{nazwa}.png"
    plik.write_bytes(urllib.request.urlopen(adres, timeout=120).read())
    return plik


brakujace = [n for n in KAFELKI if not (KAT / f"{n}.png").exists()]
wybrane = [a for a in sys.argv[1:] if a in KAFELKI] or brakujace
print(f"brakuje: {len(brakujace)} | do wygenerowania: {len(wybrane)}", flush=True)

for nazwa in wybrane:
    print(f"generuje {nazwa}...", flush=True)
    try:
        plik = generuj(nazwa)
        print(f"  -> {plik.name} ({plik.stat().st_size // 1024} kB)", flush=True)
    except Exception as e:
        print(f"  !! {nazwa}: {type(e).__name__} {e}", flush=True)

print("gotowe.")


# ── img2img ──────────────────────────────────────────────────────────────
# Flux w trybie tekst -> obraz rysuje INNEGO liska: jasniejszy, blyszczacy,
# czarne konce uszu i lap, turkusowe niebo. Kafelek w innym stylu wygrywa albo
# przegrywa wygladem, nie trescia - czyli dokladnie to, przed czym broni blok
# WSPOLNE. Dlatego brakujace sztuki robimy Z GOTOWEGO kafelka jako wzorca
# stylu (`fal-ai/flux/dev/image-to-image`), zgodnie z CLAUDE.md.
#
# `strength` to jedyne pokretlo, ktore tu naprawde wazy: nizej niz 0,7 zostaje
# kompozycja wzorca (dwa te same obrazki), wyzej niz 0,85 wraca styl Fluxa.
import base64


def generuj_z_wzorca(nazwa, wzorzec="woz-a", strength=0.78):
    zrodlo = KAT / f"{wzorzec}.png"
    if not zrodlo.exists():
        sys.exit(f"Brak wzorca stylu: {zrodlo}")
    dane = base64.b64encode(zrodlo.read_bytes()).decode()
    zlecenie = wolaj("https://queue.fal.run/fal-ai/flux/dev/image-to-image", {
        "prompt": prompt(nazwa),
        "image_url": f"data:image/png;base64,{dane}",
        "strength": strength,
        "num_inference_steps": 40,
        "guidance_scale": 3.5,
        "num_images": 1,
    })
    status_url = zlecenie["status_url"]
    for _ in range(90):
        time.sleep(2)
        st = wolaj(status_url)
        if st.get("status") == "COMPLETED":
            break
        if st.get("status") == "FAILED":
            raise RuntimeError(f"{nazwa}: fal zwrocil FAILED")
    else:
        raise TimeoutError(f"{nazwa}: fal nie oddal obrazka w trzy minuty")
    wynik = wolaj(zlecenie["response_url"])
    plik = KAT / f"{nazwa}.png"
    plik.write_bytes(urllib.request.urlopen(wynik["images"][0]["url"], timeout=120).read())
    return plik
