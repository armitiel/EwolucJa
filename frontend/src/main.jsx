import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import App from "./App.jsx";
import Landing from "./pages/Landing.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import WorldHub from "./pages/WorldHub.jsx";
import MissionView from "./pages/MissionView.jsx";
import MapView from "./pages/MapView.jsx";
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
import JoinClass from "./pages/JoinClass.jsx";
import DevTools from "./components/DevTools.jsx";
import Loading from "./components/Loading.jsx";
import AppDataProvider, { useAppData } from "./contexts/AppData.jsx";
import "./services/bgMusic";
import "./styles/ewolucja.css";
import "./styles/animations.css";

// Wrapper — gdy AppData laduje sie po raz pierwszy, pokazujemy jeden globalny loader.
// Po tym kazda zmiana zakladki (Dom/Mapa/Plecak/Profil) jest natychmiastowa.
function AppRoutes() {
  const { loading } = useAppData();
  if (loading) return <Loading text="Otwieram Kronikę…" />;
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/world" element={<WorldHub />} />
      <Route path="/map" element={<MapView />} />
      <Route path="/games" element={<Games />} />
      <Route path="/backpack" element={<Backpack />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/mission" element={<MissionView />} />
      <Route path="/reward" element={<Reward />} />
      <Route path="/invite-gm" element={<InviteGM />} />
      <Route path="/gm" element={<GMPanel />} />
      <Route path="/dev" element={<DevPanel />} />
      <Route path="/play" element={<App />} />
      {/* Mentor & klasy */}
      <Route path="/mentor/zaloguj" element={<MentorLogin />} />
      <Route path="/mentor" element={<MentorDashboard />} />
      <Route path="/mentor/klasa/:id" element={<MentorClassDetail />} />
      <Route path="/dolacz" element={<JoinClass />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppDataProvider>
        <AppRoutes />
        <DevTools />
      </AppDataProvider>
    </BrowserRouter>
  </React.StrictMode>
);
