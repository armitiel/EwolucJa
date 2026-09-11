---
description: Sprawdź grę testem pionowego wycinka i kontrolą składni
---

Użyj subagenta `tester-e2e`.

```
cd frontend
node e2e/przygoda.mjs offline    # bez backendu
node e2e/przygoda.mjs online     # z backendem i pętlą Mentora
```

Do tego `node --check` (JS) / `npx esbuild --loader=jsx` (JSX) na każdym
zmienionym pliku — to wychwytuje ucięte pliki.

W raporcie napisz osobno, **czego nie dało się sprawdzić bezgłowo**
(cykle, respawny, wszystko oparte o czas).

$ARGUMENTS
