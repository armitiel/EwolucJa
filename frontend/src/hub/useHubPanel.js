/**
 * useHubPanel — stan otwartego panelu huba trzymany w adresie (`/swiat?panel=profil`).
 *
 * Dlaczego w URL, a nie w useState: dzięki temu systemowy „wstecz" na Androidzie
 * zamyka panel, zamiast wyrzucać dziecko z aplikacji. To najczęstszy błąd
 * w takich hubach i najtrudniejszy do naprawienia później.
 *
 * Otwarcie panelu z huba = wpis w historii (wstecz zamyka).
 * Przełączenie panelu na panel = podmiana wpisu (wstecz zawsze wraca na czystą scenę).
 * Zamknięcie przyciskiem = podmiana wpisu, nigdy `history.back()` — inaczej wejście
 * z linku `?panel=…` wyprowadzałoby poza aplikację.
 */
import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const PANELE = ["gry", "profil", "czat", "wiadomosci", "porada"];

export function useHubPanel() {
  const navigate = useNavigate();
  const location = useLocation();

  const panel = useMemo(() => {
    const wartosc = new URLSearchParams(location.search).get("panel");
    return PANELE.includes(wartosc) ? wartosc : null;
  }, [location.search]);

  const otworz = useCallback(
    (id) => {
      if (!PANELE.includes(id) || id === panel) return;
      navigate(`${location.pathname}?panel=${id}`, { replace: panel !== null });
    },
    [navigate, location.pathname, panel]
  );

  const zamknij = useCallback(() => {
    if (!panel) return;
    navigate(location.pathname, { replace: true });
  }, [navigate, location.pathname, panel]);

  const przelacz = useCallback((id) => (id === panel ? zamknij() : otworz(id)), [panel, otworz, zamknij]);

  return { panel, otworz, zamknij, przelacz };
}
