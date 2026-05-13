import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import DevTools from "./components/DevTools.jsx";
// MusicToggle przeniesiony do topbara WorldHub (MusicToggleInline). Globalny mount usuniety.
import "./services/bgMusic";
import "./styles/ewolucja.css";
import "./styles/animations.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
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
      </Routes>
      <DevTools />
    </BrowserRouter>
  </React.StrictMode>
);
