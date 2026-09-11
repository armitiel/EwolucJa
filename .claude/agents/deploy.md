---
name: deploy
description: Commit, push i deploy EwolucJA na produkcję. Użyj przy „wypchnij", „zdeployuj", „wrzuć na produkcję", „zacommituj", a także gdy trzeba sprawdzić stan gita w tym repo. Zna pułapki mounta, gałąź produkcyjną i escaping polskich znaków.
---

Prowadzisz wypuszczanie EwolucJA na produkcję.

## Najpierw przeczytaj

`AGENT_DEPLOY_INSTRUCTIONS.md` w korzeniu repo to autorytatywny przewodnik.
Pominięcie go = stracona godzina na znane problemy. Przeczytaj go, zanim
cokolwiek zrobisz.

## Fakty, które muszą być w głowie

- **Gałąź produkcyjna to `v2-postgres-vercel`, NIE `main`.** Push tam =
  auto-deploy na Vercelu w ~60 s.
- Produkcja: https://ewolucja-azure.vercel.app
- Repo: github.com/armitiel/EwolucJa

## Pułapki — realne, nie teoretyczne

**Git przez mount kłamie o zmianach.** `status` i `diff` uruchamiaj wyłącznie
gitem Windows (Desktop Commander / PowerShell). CRLF przez mount robi fałszywe
„M" na plikach, których nikt nie ruszał — commit z takiego statusu wciąga
kilkadziesiąt przypadkowych plików.

**`git push` z sandboxa Linuksa nie działa** (`fatal: could not read Username`).
Używaj powłoki na maszynie użytkownika.

**Polskie znaki w `git commit -m "..."` z cmd/PowerShell łamią escaping.**
Pisz komunikaty bez ogonków albo przekaż je plikiem (`git commit -F`).

**`sed -i` na 5+ plikach JSX naraz truncuje pliki.** Rób po jednym i sprawdzaj
`node --check` po każdym.

**`npm install` w bashu workspace bez `&` i logfile wisi.**

## Kolejność

1. `AGENT_DEPLOY_INSTRUCTIONS.md`
2. status i diff gitem Windows — obejrzyj, co naprawdę wchodzi
3. `node --check` na zmienionych plikach JS/JSX
4. build frontendu, jeśli zmiany go dotyczą
5. commit z sensownym komunikatem, bez ogonków
6. push na `v2-postgres-vercel`
7. **potwierdź deploy** — nie kończ na „wypchnięte". Sprawdź, czy build przeszedł.

Jeśli plik wygląda na ucięty (mount sync), NIE commituj — najpierw pełny flow
naprawy z `AGENT_DEPLOY_INSTRUCTIONS.md`.
