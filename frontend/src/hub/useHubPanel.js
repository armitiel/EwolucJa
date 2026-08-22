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

export const PANELE = ["gry", "profil", "czat", "wiadomosci", "porada", "zadanie"];

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

/**
 * Identyfikatory minigier, które hub potrafi otworzyć NAD sceną, bez opuszczania
 * `/swiat`. To te same `id`, co w `hub/data/minigry.v1.json` — jedno słownictwo
 * dla katalogu, dla znaków na mapie i dla adresu.
 *
 * ⚠ TA LISTA MUSI ISC W PARZE Z `GRY_OSADZONE` w `pages/Swiat.jsx`. Dopisanie
 * gry tylko tam, a nie tutaj, kończy się kafelkiem, który po dotknięciu NIC
 * NIE ROBI: hub wybiera drogę „nad sceną", a `otworzGre` odrzuca adres jako
 * spoza białej listy i wychodzi bez słowa. Tak zniknął `bieg-liska`.
 * `uruchomGre` w `Swiat.jsx` ma od teraz zabezpieczenie, które w takim
 * wypadku otwiera grę na jej własnym adresie — ale kafelek traci wtedy
 * wszystko, co daje otwarcie nad hubem (żywa scena, natychmiastowy powrót).
 */
export const GRY_W_HUBIE = ["pamiec-medrca", "lot-liska", "bieg-liska"];

/**
 * useHubGra — otwarta minigra trzymana w adresie (`/swiat?gra=pamiec-medrca`).
 *
 * Dlaczego w ogóle NAD hubem, a nie na własnym adresie (`/games/…`): wyjście
 * z gry odmontowywało `Swiat`, a razem z nim całą scenę WebGL. Powrót znaczył
 * ponowne wczytanie modeli — kilka sekund czarnego ekranu — i lisa
 * postawionego z powrotem na starcie, choć dziecko weszło do gry na drugim
 * końcu mapy. Scena zostaje zamontowana i zapauzowana, więc powrót jest
 * natychmiastowy i w tym samym miejscu.
 *
 * Dokąd wraca zamknięcie, wynika z SAMEGO ADRESU: `gra` dokładamy do tego, co
 * już w nim jest, i przy wyjściu tylko je usuwamy. Wejście z kafelka
 * biblioteki ma w adresie `panel=gry`, więc wraca do otwartej zakładki;
 * wejście ze znaku na mapie nie ma nic, więc wraca na czystą mapę. Żadnej
 * osobnej pamięci „skąd przyszedłem" — nie ma się czemu rozjechać.
 */
export function useHubGra() {
  const navigate = useNavigate();
  const location = useLocation();

  const gra = useMemo(() => {
    const wartosc = new URLSearchParams(location.search).get("gra");
    return GRY_W_HUBIE.includes(wartosc) ? wartosc : null;
  }, [location.search]);

  /**
   * Poziom wybrany PRZED wejściem do gry (`?gra=…&poziom=easy`).
   *
   * Jest w adresie z tego samego powodu, co sama gra: zaproszenie liska na
   * mapie pyta o poziom u siebie i od razu startuje partię, więc gra musi
   * dostać tę odpowiedź. Przekazanie jej stanem znaczyłoby, że odświeżenie
   * strony w trakcie partii cofa dziecko na ekran wyboru, którego już nie ma.
   *
   * `null` = weszliśmy z kafelka w zakładce i gra ma pokazać swój ekran
   * startowy. To jedyna różnica między tymi dwiema drogami.
   */
  const poziom = useMemo(() => {
    return new URLSearchParams(location.search).get("poziom") || null;
  }, [location.search]);

  const otworzGre = useCallback(
    (id, { poziom: wybrany = null } = {}) => {
      if (!GRY_W_HUBIE.includes(id) || id === gra) return;
      const parametry = new URLSearchParams(location.search);
      parametry.set("gra", id);
      if (wybrany) parametry.set("poziom", wybrany);
      else parametry.delete("poziom");
      // Wpis w historii, nie podmiana: systemowy „wstecz" ma zamykać grę,
      // a nie wyrzucać dziecko ze świata.
      navigate(`${location.pathname}?${parametry.toString()}`);
    },
    [navigate, location.pathname, location.search, gra]
  );

  const zamknijGre = useCallback(() => {
    if (!gra) return;
    const parametry = new URLSearchParams(location.search);
    parametry.delete("gra");
    parametry.delete("poziom");
    const reszta = parametry.toString();
    navigate(reszta ? `${location.pathname}?${reszta}` : location.pathname, { replace: true });
  }, [navigate, location.pathname, location.search, gra]);

  return { gra, poziom, otworzGre, zamknijGre };
}
