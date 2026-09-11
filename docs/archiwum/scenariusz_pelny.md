# Scenariusz Pełny — Ewolucja: Gra Rozwojowa

## Przegląd

**Ewolucja** to gra fabularna (PWA) wspierająca rozwój kompetencji miękkich u dzieci w wieku 6-12 lat. Gracz przechodzi przez 5 krain + Górę Podsumowania, a system AI (GAMA-1) cicho profiluje jego kompetencje w 6 wymiarach.

---

## Mapa krain

```
  🏔️ Góra Podsumowania
      |
  ⛵ Przystań Współpracy
      |
  🏝️ Wyspa Talentów
      |
  🕯️ Jaskinia Emocji
      |
  🌲 Las Decyzji
      |
  📸 Dolina Selfie (START)
```

---

## Kraina 1: Dolina Selfie

**Cel psychologiczny:** Samoświadomość, eksploracja tożsamości.

**Zadanie 1 — Zwierciadło Prawdy:**
Gracz przesyła selfie → API generuje awatar → gracz wybiera kolor aury (nastrój) i element startowy. Wybór elementu daje pierwsze punkty profilowe.

---

## Kraina 2: Las Decyzji

**Cel psychologiczny:** Ciekawość poznawcza, empatia, podejmowanie decyzji etycznych.

**Zadanie 2 — Rozwidlenie Dróg:**
Test ciekawości — czy gracz pójdzie bezpieczną ścieżką do celu, czy eksploruje nieznane?

**Zadanie 3 — Uwięziony Chowaniec:**
Dylemat etyczny: pomoc innemu kosztem własnych punktów vs. priorytetyzacja wyniku.

---

## Kraina 3: Jaskinia Emocji

**Cel psychologiczny:** Cierpliwość, odraczanie gratyfikacji, inteligencja emocjonalna.

**Zadanie 4 — Skarbiec Czasu:**
Adaptacja Testu Marshmallow. Gracz czeka 30s lub klika wcześniej. System mierzy zachowanie.

**Zadanie 5 — Strażnik Masek:**
Rozpoznawanie złożonych emocji (frustracja, zakłopotanie, duma). Test teorii umysłu.

---

## Kraina 4: Wyspa Talentów

**Cel psychologiczny:** Kreatywność, tolerancja na frustrację, growth mindset.

**Zadanie 6 — Zagadka bez dobrej odpowiedzi:**
Mini-gra logiczna niemożliwa do wygrania za pierwszym razem. Mierzy reakcję na porażkę.

**Zadanie 7 — Przepaść i Pudełko:**
Myślenie dywergencyjne: użyj 3 przedmiotów (parasol, puszka, sznurek) aby pokonać przepaść. Odpowiedź otwarta oceniana przez AI.

---

## Kraina 5: Przystań Współpracy

**Cel psychologiczny:** Praca zespołowa, mediacja, role grupowe.

**Zadanie 8 — Kłótnia o Mapę:**
Dwa NPC się kłócą. Gracz może: narzucić wolę, zaproponować głosowanie lub szukać kompromisu.

**Zadanie 9 — Budowa Tratwy:**
Wybór roli zespołowej (kapitan, rzemieślnik, dusza towarzystwa) wg typologii Belbina.

---

## Góra Podsumowania

System sumuje punkty, generuje profil hybrydowy (2 dominujące cechy) i przypisuje tytuł:

| Kombinacja | Tytuł |
|-----------|-------|
| DT + KR | Wizjoner Tajemnic |
| EM + MD | Strażnik Pokoju |
| LD + ST | Generał Przygody |
| ST + KR | Architekt Przyszłości |
| EM + DT | Odkrywca Serc |
| LD + KR | Mistrz Inwencji |

Generowane są dwa raporty: przygodowy (dla ucznia) i sformalizowany (dla nauczyciela, CASEL + VIA).
