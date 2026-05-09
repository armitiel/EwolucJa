/**
 * TabBar — dolny pasek nawigacji widoczny na ekranach dziecka:
 * /world, /map, /backpack, /profile.
 */
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TabIcons } from "./art.jsx";

const TABS = [
  { id: "home", label: "Dom", path: "/world", icon: TabIcons.home },
  { id: "map", label: "Mapa", path: "/map", icon: TabIcons.map },
  { id: "backpack", label: "Plecak", path: "/backpack", icon: TabIcons.bag },
  { id: "profile", label: "Profil", path: "/profile", icon: TabIcons.hero },
];

export default function TabBar({ current }) {
  const navigate = useNavigate();
  const location = useLocation();
  const active = current || TABS.find((t) => t.path === location.pathname)?.id || "home";

  return (
    <div className="tabbar">
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
    </div>
  );
}
