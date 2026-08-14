/**
 * HubIcons — pięć ikon doku. Osobny plik, bo `adventure/components/icons.jsx`
 * nie ma znaków dla minigier, czatu ani skrzynki, a dokładanie ich tam mieszałoby
 * zestaw fabularny z nawigacyjnym. Ten sam język wizualny: 24×24, kontur,
 * `currentColor`, grubość 1.8.
 */
import React from "react";

const SCIEZKI = {
  gry: (
    <>
      <rect x="2.6" y="7" width="18.8" height="11.4" rx="4.2" />
      <path d="M7.6 11.2v3.4M5.9 12.9h3.4M15.8 12.2h.01M18 15h.01" />
    </>
  ),
  profil: (
    <>
      <circle cx="12" cy="8" r="3.9" />
      <path d="M4.7 20c1.1-3.9 3.9-5.9 7.3-5.9s6.2 2 7.3 5.9" />
    </>
  ),
  czat: (
    <>
      <path d="M20 11.6a6.9 6.9 0 0 1-6.9 6.9H9.4L5.2 21.6v-4.4A6.9 6.9 0 0 1 9.4 4.7h3.7A6.9 6.9 0 0 1 20 11.6Z" />
      <path d="M9.4 11.6h6" />
    </>
  ),
  wiadomosci: (
    <>
      <path d="M4.8 5.6h10.6a2.8 2.8 0 0 1 2.8 2.8v10H7.6a2.8 2.8 0 0 1-2.8-2.8Z" />
      <path d="M8.4 9.4h7M8.4 13.1h4.8" />
      <path d="M18.2 8.4h1.4a1.4 1.4 0 0 1 1.4 1.4v6.4a2.2 2.2 0 0 1-2.2 2.2" />
    </>
  ),
  porada: (
    <>
      <circle cx="12" cy="12" r="4.1" />
      <path d="M12 3.1v2.1M12 18.8v2.1M3.1 12h2.1M18.8 12h2.1M5.7 5.7l1.5 1.5M16.8 16.8l1.5 1.5M18.3 5.7l-1.5 1.5M7.2 16.8l-1.5 1.5" />
    </>
  ),
};

export default function HubIcon({ name, size = 24, strokeWidth = 1.8, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {SCIEZKI[name] || SCIEZKI.porada}
    </svg>
  );
}
