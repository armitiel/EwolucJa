// PIERWSZA linia pliku — Sentry musi postawić globalne łapacze błędów, zanim
// React zacznie renderować. Bez DSN w środowisku moduł nic nie robi.
import "./services/sentry";

import React, { Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

/**
 * ScrollToTop — przy kazdej zmianie route (np. zakladki w TabBar) scrolluje:
 *  1) wszystkie wewnetrzne kontenery .screen-scroll (PageShell-based pages),
 *  2) okno (fallback dla stron bez .screen-scroll).
 * Zapewnia ze nowa strona zawsze otwiera sie od gory zawartosci.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Wewnetrzne scroll-containery
    try {
      document.querySelectorAll(".screen-scroll").forEach((el) => {
        el.scrollTop = 0;
      });
    } catch {}
    // Window fallback
    try { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }
    catch { window.scrollTo(0, 0); }
  }, [pathname]);
  return null;
}
import Landing from "./pages/Landing.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import Przygoda from "./pages/Przygoda.jsx";
import Swiat from "./pages/Swiat.jsx";
import MissionView from "./pages/MissionView.jsx";
import Games from "./pages/Games.jsx";
import Backpack from "./pages/Backpack.jsx";
import Profile from "./pages/Profile.jsx";
import Reward from "./pages/Reward.jsx";
import InviteGM from "./pages/InviteGM.jsx";
import GMPanel from "./pages/GMPanel.jsx";
import DevPanel from "./pages/DevPanel.jsx";
import MentorLogin from "./pages/MentorLogin.jsx";
import MentorDashboard from "./pages/MentorDashboard.jsx";
import MentorClassDetail from "./pages/MentorClassDetail.jsx";
import MentorPairs from "./pages/MentorPairs.jsx";
import JoinClass from "./pages/JoinClass.jsx";
import PoradyPage from "./pages/PoradyPage.jsx";
// Minigry osobnymi paczkami. Statyczny import wciagalby je z powrotem do
// glownego pliku i lazy w `Swiat.jsx` nie dawaloby nic — Vite dzieli po
// grafie importow, a nie po tym, jak komponent jest uzyty.
// Prototyp V1 (`App.jsx`, 1698 linii) siedzi na /play i jest osiagalny wylacznie
// z pulpitu deweloperskiego. Statyczny import wciagal jego caly ogon
// (AvatarBuilder, AvatarSVG, AvatarDisplay, AvatarAI, growthData) do paczki
// startowej KAZDEGO dziecka, ktore laduje na /swiat i nigdy tego kodu nie zobaczy.
const App = leniwy(() => import("./App.jsx"));
const MemoryGame = leniwy(() => import("./pages/MemoryGame.jsx"));
const ChoinkaLaunchGame = leniwy(() => import("./pages/ChoinkaLaunchGame.jsx"));
const BiegLiskaGame = leniwy(() => import("./pages/BiegLiskaGame.jsx"));
import LoginAsStudent from "./pages/LoginAsStudent.jsx";
import LoginByCode from "./pages/LoginByCode.jsx";
import DevTools from "./components/DevTools.jsx";
import Analityka from "./services/analityka.jsx";
import HintPopup from "./components/HintPopup.jsx";
import Loading from "./components/Loading.jsx";
import AppDataProvider, { useAppData } from "./contexts/AppData.jsx";
import "./services/bgMusic";
import "./styles/ewolucja.css";
import "./styles/animations.css";
import { leniwy, pilnujWdrozen } from "./services/leniwyImport.js";

// Wrapper — gdy AppData laduje sie po raz pierwszy, pokazujemy jeden globalny loader.
// Po tym kazda zmiana zakladki (Dom/Mapa/Plecak/Profil) jest natychmiastowa.
function AppRoutes() {
  const { loading } = useAppData();
  if (loading) return <Loading text="Otwieram Kronikę…" />;
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/onboarding" element={<Onboarding />} />
      {/* Fabula dziala takze bez sieci (localStorage jest zrodlem prawdy),
          ale dane gracza dociagamy — HUD ich potrzebuje. */}
      <Route path="/przygoda" element={<Przygoda />} />
      <Route path="/przygoda/:view" element={<Przygoda />} />
      {/* Hub 3D: scena z public/scena-3d jako tlo, sekcje UI jako panele nad nia.
          To jest BAZA gry — tu ladujemy po logowaniu i tu wracaja stare adresy. */}
      <Route path="/swiat" element={<Swiat />} />
      {/* Stare adresy pozostają kompatybilne, ale wracają do huba 3D — to jest baza.
          `/mapa` to dawna Mapa Iskier: plaski ekran z punktami krain, ktory byl
          baza przed scena 3D. Ekran zostal usuniety, ale ADRES musi zyc dalej —
          siedzi w historii przegladarki, w zakladkach, w linkach wyslanych
          rodzicom i w skrzynce powiadomien sprzed zmiany. Bez tego wpisu
          dziecko trafialoby na pusty ekran zamiast do swiata. */}
      <Route path="/world" element={<Navigate to="/swiat" replace />} />
      <Route path="/map" element={<Navigate to="/swiat" replace />} />
      <Route path="/mapa" element={<Navigate to="/swiat" replace />} />
      <Route path="/games" element={<Games />} />
      {/* Suspense na kazdej trasie z osobna, a nie wokol calego <Routes>:
          fallback ma zastapic TYLKO wczytywana gre. Owiniety globalnie
          zdejmowalby z ekranu wszystko przy kazdym przejsciu. */}
      <Route
        path="/games/memory"
        element={<Suspense fallback={<Loading text="Otwieram grę…" />}><MemoryGame /></Suspense>}
      />
      <Route
        path="/games/lot-liska"
        element={<Suspense fallback={<Loading text="Otwieram grę 3D…" />}><ChoinkaLaunchGame /></Suspense>}
      />
      <Route
        path="/games/bieg-liska"
        element={<Suspense fallback={<Loading text="Otwieram grę 3D…" />}><BiegLiskaGame /></Suspense>}
      />
      <Route path="/backpack" element={<Backpack />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/mission" element={<MissionView />} />
      <Route path="/reward" element={<Reward />} />
      <Route path="/invite-gm" element={<InviteGM />} />
      <Route path="/gm" element={<GMPanel />} />
      <Route path="/dev" element={<DevPanel />} />
      <Route
        path="/play"
        element={<Suspense fallback={<Loading text="Otwieram prototyp V1…" />}><App /></Suspense>}
      />
      {/* Mentor & klasy */}
      <Route path="/mentor/zaloguj" element={<MentorLogin />} />
      <Route path="/mentor" element={<MentorDashboard />} />
      <Route path="/mentor/klasa/:id" element={<MentorClassDetail />} />
      <Route path="/mentor/klasa/:id/pary" element={<MentorPairs />} />
      <Route path="/dolacz" element={<JoinClass />} />
      <Route path="/porady" element={<PoradyPage />} />
      <Route path="/uczen" element={<LoginAsStudent />} />
      <Route path="/odzyskaj" element={<LoginByCode />} />
      <Route path="/witaj" element={<LoginByCode />} />
    </Routes>
  );
}

// Rejestracja Service Worker dla push notifications (i offline fallback w przyszłosci).
// Wymagane do `pushManager.subscribe` w pushNotifications.js.
/* Bezpiecznik na wdrozenia: `<link rel="modulepreload">` potrafi paść
   wczesniej niz sam import, wiec `leniwy` nie ma wtedy czego zlapac. */
pilnujWdrozen();

if ("serviceWorker" in navigator && location.hostname !== "localhost") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((e) => console.warn("[SW] register failed:", e));
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <AppDataProvider>
        <AppRoutes />
        <HintPopup />
        <DevTools />
        {/* Statystyki Vercela. Same wizyty autora sa wyciszane w przegladarce -
            patrz services/analityka.jsx. */}
        <Analityka />
      </AppDataProvider>
    </BrowserRouter>
  </React.StrictMode>
);
