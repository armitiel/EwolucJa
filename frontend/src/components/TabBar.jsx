/**
 * TabBar — dolny pasek nawigacji widoczny na ekranach dziecka:
 * /swiat, /games, /backpack, /profile.
 *
 * Uwaga: hub 3D (/swiat) ma wlasny dok (HubDock) i TabBara NIE renderuje.
 * Zakladka "Swiat" jest tu droga POWROTU do bazy z ekranow bocznych.
 */
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TabIcons } from "./art.jsx";

const TABS = [
  { id: "home", label: "Świat", path: "/swiat", icon: TabIcons.home },
  { id: "games", label: "Gry", path: "/games", icon: TabIcons.games },
  { id: "mission", label: "Plecak", path: "/backpack", icon: TabIcons.mission },
  { id: "profile", label: "Profil", path: "/profile", icon: TabIcons.hero },
];

export default function TabBar({ current }) {
  const navigate = useNavigate();
  const location = useLocation();
  const active = current || TABS.find((t) => t.path === location.pathname)?.id || "home";

  return (
    <React.Fragment>
      <div className="tabbar-spacer" aria-hidden="true" />
      <nav className="tabbar" aria-label="Nawigacja glowna">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${active === tab.id ? "active" : ""}`}
            onClick={() => navigate(tab.path)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </React.Fragment>
  );
}
