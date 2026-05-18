/**
 * PoradyPage — "Porady / Komnata Mędrca" + inbox wiadomości od mentora.
 *
 * Zakładki:
 *  1. PORADY DNIA — TYLKO porada aktualnej pory dnia jest "świeża" (duża karta).
 *     Pozostałe sloty dziś: jeśli już minęły → karty historii; jeśli przyszłe → ukryte.
 *     Dzień zmienia się po wieczorze (lub o północy). Filtry: kategoria + pora dnia.
 *     Historia poprzednich dni — mniejsze karty, klik → modal z pełną treścią.
 *  2. Wiadomości od mentora — historia mentor_hints (bez zmian).
 *
 * Dane porad: ../dailyTipsData.js (540 porad, 6 archetypów × 30 dni × 3 sloty).
 * Endpoint mentora: GET /api/players/:id/hints/all
 */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, session } from "../services/api.js";
import { useAppData } from "../contexts/AppData.jsx";
import PageShell from "../components/PageShell.jsx";
import TabBar from "../components/TabBar.jsx";
import TopBar from "../components/TopBar.jsx";
import { PROFILE_INFO } from "../components/ProfileAvatar.jsx";
import { DAILY_TIPS, tipsForDay } from "../dailyTipsData.js";
import bgMusic from "../services/bgMusic.js";
import * as pushSvc from "../services/pushNotifications.js";

const LEGACY_TO_PROFILE = {
  tropiciel_tajemnic: "DT", zaklinacz_uczuc: "EM", mistrz_map: "ST",
  tkacz_snow: "KR", gwardzista_odwagi: "LD", straznik_mostu: "MD",
};
function profileCode(v) {
  if (!v) return "DT";
  return PROFILE_INFO[v] ? v : (LEGACY_TO_PROFILE[v] || "DT");
}

const PORADY_CATEGORIES = [
  { id: "wszystko", label: "Wszystko" },
  { id: "medrzec", label: "Od Mędrca" },
  { id: "misje", label: "Sztuczki misji" },
  { id: "kraina", label: "Sekrety krainy" },
  { id: "mentor", label: "Dla mentora" },
];

const SLOT_FILTERS = [
  { id: "wszystkie", label: "Cały dzień", emoji: "✦" },
  { id: "poranek", label: "Poranek", emoji: "🌅" },
  { id: "poludnie", label: "Południe", emoji: "☀️" },
  { id: "wieczor", label: "Wieczór", emoji: "🌙" },
];

const SLOT_META = {
  poranek:  { label: "Poranek",  emoji: "🌅", color: "#FFE7B0", ring: "#B47322", tone: "amber" },
  poludnie: { label: "Południe", emoji: "☀️", color: "#DBF0CE", ring: "#2F5841", tone: "leaf"  },
  wieczor:  { label: "Wieczór",  emoji: "🌙", color: "#E6D6FA", ring: "#7A4DC2", tone: "magic" },
};

// Liczba dni od rejestracji ucznia (1 = dzien rejestracji, max 30).
// Dzien rejestracji = od razu 3 porady (poranek/poludnie/wieczor) gotowe.
function daysSinceRegistration(player) {
  if (!player?.registered_at) return 1;
  const reg = new Date(player.registered_at);
  const today = new Date();
  // Liczymy na podstawie pelnych dni kalendarzowych (resetujemy godziny)
  reg.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - reg.getTime()) / 86400000) + 1;
  return Math.max(1, Math.min(30, diffDays));
}

// Tracking przeczytanych porad:
//  - localStorage (instant, offline fallback, działa zanim backend odpowie)
//  - backend (viewed_tips table) - persist między urządzeniami, ładowany przy mount
// Po loadzie z backendu mergujemy oba zbiory.
const READ_TIPS_KEY = "ewolucja.readTips";
function getReadTipsSet() {
  try {
    const raw = localStorage.getItem(READ_TIPS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
}
function markTipRead(id) {
  try {
    const set = getReadTipsSet();
    set.add(id);
    localStorage.setItem(READ_TIPS_KEY, JSON.stringify([...set]));
  } catch {}
}

// Zwraca aktualny slot pory dnia oraz numer porządkowy (1=poranek..3=wieczor).
function currentSlotInfo(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return { slot: "poranek",  order: 1 };
  if (h < 18) return { slot: "poludnie", order: 2 };
  return        { slot: "wieczor",  order: 3 };
}

const SLOT_ORDER = { poranek: 1, poludnie: 2, wieczor: 3 };

function PoradaGlyph({ kind = "medrzec", size = 56, tone = "magic" }) {
  const colors = {
    magic: { bg: "linear-gradient(135deg,#E6D6FA,#C8A0F0)", ring: "#7A4DC2" },
    leaf:  { bg: "linear-gradient(135deg,#DBF0CE,#9CD09F)", ring: "#2F5841" },
    amber: { bg: "linear-gradient(135deg,#FFE7B0,#FFD269)", ring: "#B47322" },
    paper: { bg: "linear-gradient(135deg,#FCF5E1,#F4E3B8)", ring: "#A87A2A" },
    rose:  { bg: "linear-gradient(135deg,#FFD7D7,#F08C8C)", ring: "#7A2A2A" },
  };
  const c = colors[tone] || colors.magic;
  const ICON = {
    medrzec: <img src="/wizard.png" alt="" style={{ width: size, height: size, objectFit: "contain", filter: "drop-shadow(0 2px 4px rgba(80,40,140,.35))" }} />,
    zwoj: (<svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="none"><path d="M5 4h11a3 3 0 0 1 0 6H8v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke={c.ring} strokeWidth="2" strokeLinejoin="round" /><path d="M16 4a3 3 0 0 1 3 3v12a2 2 0 0 1-2 2" stroke={c.ring} strokeWidth="2" /></svg>),
    krysztal: (<svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="none"><path d="M12 2l8 7-8 13L4 9z" stroke={c.ring} strokeWidth="2" strokeLinejoin="round" /><path d="M4 9h16M12 2v20" stroke={c.ring} strokeWidth="1.5" /></svg>),
    pulse: (<svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55}><path d="M3 12h4l2-6 4 12 2-6h6" fill="none" stroke={c.ring} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>),
    rodzic: (<svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="none"><circle cx="9" cy="7" r="3" stroke={c.ring} strokeWidth="2" /><circle cx="16" cy="9" r="2.2" stroke={c.ring} strokeWidth="2" /><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" stroke={c.ring} strokeWidth="2" strokeLinecap="round" /><path d="M14 20c0-2 2-3.5 4-3.5s3 1 3 3" stroke={c.ring} strokeWidth="2" strokeLinecap="round" /></svg>),
    map: (<svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="none"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z" stroke={c.ring} strokeWidth="2" strokeLinejoin="round" /><path d="M9 4v16M15 6v16" stroke={c.ring} strokeWidth="2" /><circle cx="12" cy="11" r="1.5" fill={c.ring} /></svg>),
    mentor: (<svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="none"><path d="M21 12c0 4-4 7-9 7-1.4 0-2.7-.2-3.9-.6L3 20l1.4-3.6C3.5 15.2 3 13.7 3 12c0-4 4-7 9-7s9 3 9 7z" stroke={c.ring} strokeWidth="2" strokeLinejoin="round" /></svg>),
    artifact: (<svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="none"><path d="M4 8h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" stroke={c.ring} strokeWidth="2" /><path d="M8 8V6a4 4 0 0 1 8 0v2M3 8h18M12 12v4" stroke={c.ring} strokeWidth="2" strokeLinecap="round" /></svg>),
  };
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.32, flex: "none", background: c.bg, boxShadow: `inset 0 0 0 1.5px ${c.ring}33, 0 4px 10px rgba(43,42,74,.10)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {ICON[kind] || ICON.medrzec}
    </div>
  );
}

// FreshTipCard wg mockupu Ekran Porad: duza fioletowa karta z Medrcem PNG po lewej,
// sparkles + ksiezyc/slonce po prawej, tytul w cieplym kolorze i krotki opis.
// Klikalna - otwiera modal z pelna trescia (zachowuje onOpen).
// FreshTipCard - duza purple-card karta porady aktualnego slotu.
// Cala karta jest klikalna (otwiera modal). Brak CTA i bookmarka - sama karta to call-to-tap.
function FreshTipCard({ tip, onOpen, read = false }) {
  return (
    <button onClick={() => onOpen?.(tip)} style={{
      position: "relative", borderRadius: 28, overflow: "hidden",
      padding: "26px 22px 24px",
      background: "linear-gradient(160deg,#7A4DC2 0%,#4A2D80 70%,#2C1755 100%)",
      color: "#fff",
      boxShadow: "0 5px 0 rgba(43,30,90,.55), 0 22px 48px rgba(43,30,90,.5)",
      border: "none", cursor: "pointer", textAlign: "left", width: "100%",
      fontFamily: "inherit",
      opacity: read ? 0.85 : 1,
      transition: "transform .2s ease, opacity .3s ease",
      minHeight: 240,
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Slonce/ksiezyc kompozytowy w prawym gornym rogu */}
      <div aria-hidden="true" style={{ position: "absolute", top: 18, right: 22 }}>
        <svg width="48" height="48" viewBox="0 0 40 40">
          <circle cx="22" cy="18" r="13" fill="#FFD269" />
          <circle cx="27" cy="14" r="11" fill="#7A4DC2" />
        </svg>
      </div>
      {/* Trzy sparkles - delikatne, animowane */}
      <div aria-hidden="true" style={{ position: "absolute", top: 72, right: 72, opacity: 0.85 }}>
        <svg width="14" height="14" viewBox="0 0 16 16"><path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z" fill="#FFD269" /></svg>
      </div>
      <div aria-hidden="true" style={{ position: "absolute", top: 36, right: 140, opacity: 0.85 }}>
        <svg width="10" height="10" viewBox="0 0 16 16"><path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z" fill="#FFE7B0" /></svg>
      </div>
      <div aria-hidden="true" style={{ position: "absolute", bottom: 24, right: 28, opacity: 0.7 }}>
        <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z" fill="#C8A0F0" /></svg>
      </div>

      {/* Label gora: PORADA DNIA (bez 'OD MEDRCA' - redundantne) + chip PRZECZYTANE */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, letterSpacing: 2.2, opacity: 0.9, textTransform: "uppercase", fontWeight: 800 }}>
        <span>Porada dnia</span>
        {read && (
          <span style={{ fontSize: 9, letterSpacing: 1, background: "rgba(255,255,255,.18)", padding: "2px 8px", borderRadius: 999, fontWeight: 800 }}>✓ Przeczytane</span>
        )}
      </div>

      {/* Wizard PNG + tytul + opis - wieksze, dla "wow" efektu na fresh tip */}
      <div style={{ display: "flex", gap: 14, alignItems: "flex-end", marginTop: 14 }}>
        <img src="/wizhead.svg" alt="" style={{
          width: 100, height: "auto", flex: "none",
          filter: "drop-shadow(0 4px 10px rgba(0,0,0,.45))",
          marginBottom: -10,
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="t-display" style={{
            margin: 0, fontSize: 24, lineHeight: 1.15, fontWeight: 700, color: "rgb(252, 244, 221)",
          }}>
            „{tip.title}"
          </h3>
          <div style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.45, opacity: 0.9,
            display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {tip.body}
          </div>
        </div>
      </div>
    </button>
  );
}

function HistoryTipCard({ tip, dayLabel, onOpen, read = false }) {
  const slot = SLOT_META[tip.slot] || SLOT_META.poludnie;
  return (
    <button onClick={() => onOpen?.(tip)} style={{
      display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
      borderRadius: 14, border: "none", cursor: "pointer", textAlign: "left", width: "100%",
      background: "rgba(255,255,255,.85)",
      boxShadow: "inset 0 0 0 1px rgba(43,42,74,.08)",
      fontFamily: "inherit", color: "var(--p-ink)",
      opacity: read ? 0.55 : 1,
      filter: read ? "saturate(.5)" : "none",
      transition: "opacity .2s ease, background .2s ease, filter .2s ease",
    }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,1)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.85)"; }}>
      <PoradaGlyph kind={tip.icon || "medrzec"} tone={tip.tone || "magic"} size={36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: slot.ring, letterSpacing: 1 }}>{slot.emoji} {dayLabel}</span>
          {read && <span style={{ fontSize: 9, fontWeight: 800, color: "var(--p-ink-soft)" }}>· ✓ przeczytane</span>}
        </div>
        <div className="t-display" style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2, marginTop: 2, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{tip.title}</div>
      </div>
      <span style={{ fontSize: 16, color: "var(--p-ink-soft)", flex: "none" }}>›</span>
    </button>
  );
}

function TipModal({ tip, onClose }) {
  if (!tip) return null;
  const slot = SLOT_META[tip.slot] || SLOT_META.poludnie;
  return (
    <div role="dialog" aria-modal="true" onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(43,30,90,.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 18,
      animation: "tip-backdrop-in .25s ease-out both",
    }}>
      {/* Keyframes inline - skala 0.86 + opacity dla popup wjazdu, oraz delikatny bounce */}
      <style>{`
        @keyframes tip-backdrop-in { 0% { opacity: 0 } 100% { opacity: 1 } }
        @keyframes tip-pop-in {
          0%   { opacity: 0; transform: scale(.85) translateY(8px); }
          70%  { opacity: 1; transform: scale(1.02) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: 480,
        background: `linear-gradient(180deg,${slot.color} 0%, #fff 50%)`,
        borderRadius: 24, padding: "16px 18px 32px",
        boxShadow: "0 12px 36px rgba(43,30,90,.4)",
        color: "var(--p-ink)", position: "relative",
        animation: "tip-pop-in .42s cubic-bezier(.34,1.56,.64,1) both",
      }}>
        <button onClick={onClose} aria-label="Zamknij" style={{ position: "absolute", top: 12, right: 14, width: 32, height: 32, borderRadius: 999, border: "none", cursor: "pointer", background: "rgba(255,255,255,.75)", color: "var(--p-ink)", fontSize: 18, fontWeight: 800, boxShadow: "0 2px 6px rgba(43,30,90,.2)" }}>×</button>
        {/* Mala ikonka + chip slot+day w jednym pasku - oszczedza miejsce na gore */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, paddingRight: 36 }}>
          <PoradaGlyph kind={tip.icon || "medrzec"} tone={tip.tone || slot.tone} size={36} />
          <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.2, color: slot.ring, background: "rgba(255,255,255,.7)", padding: "3px 9px", borderRadius: 999, whiteSpace: "nowrap" }}>
            {slot.emoji} {slot.label.toUpperCase()} · DZIEŃ {tip.day}
          </span>
        </div>
        <h3 className="t-display" style={{ margin: "4px 0 12px", fontSize: 22, lineHeight: 1.18, fontWeight: 700 }}>{tip.title}</h3>
        <div style={{ fontSize: 15, lineHeight: 1.5, color: "var(--p-ink)" }}>{tip.body}</div>
      </div>
    </div>
  );
}

// PushPrompt - soft popup zachecajacy do wlaczenia powiadomien.
// Pokazany RAZ, po 3 otwartych poradach. Klik "Wlaczyc" odpala native permission dialog.
function PushPrompt({ onEnable, onSkip }) {
  return (
    <div role="dialog" aria-modal="true" onClick={onSkip} style={{
      position: "fixed", inset: 0, zIndex: 1100,
      background: "rgba(43,30,90,.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 14px 22px",
      animation: "tip-backdrop-in .25s ease-out both",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: 460,
        background: "linear-gradient(160deg,#7A4DC2 0%,#4A2D80 70%,#2C1755 100%)",
        color: "#fff",
        borderRadius: 22, padding: "20px 20px 18px",
        boxShadow: "0 12px 36px rgba(43,30,90,.45)",
        animation: "tip-pop-in .42s cubic-bezier(.34,1.56,.64,1) both",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/wizhead.svg" alt="" style={{ width: 56, height: "auto", flex: "none", filter: "drop-shadow(0 4px 8px rgba(0,0,0,.4))" }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 className="t-display" style={{ margin: 0, fontSize: 18, lineHeight: 1.2, color: "rgb(252, 244, 221)" }}>
              Mędrzec może Ci codziennie szeptać
            </h3>
            <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.4, opacity: 0.9 }}>
              Trzy małe wiadomości dziennie — gdy masz nową poradę. Bez spamu.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button onClick={onSkip} style={{
            flex: "none", padding: "11px 16px", borderRadius: 12,
            border: "none", cursor: "pointer",
            background: "rgba(255,255,255,.14)", color: "#fff",
            fontFamily: "inherit", fontWeight: 800, fontSize: 13,
          }}>Może później</button>
          <button onClick={onEnable} style={{
            flex: 1, padding: "11px 16px", borderRadius: 12,
            border: "none", cursor: "pointer",
            background: "linear-gradient(180deg,#FFD269,#E89A3D)",
            color: "#4A2A0E", fontFamily: "inherit", fontWeight: 900, fontSize: 14,
            letterSpacing: 0.3,
            boxShadow: "0 2px 0 #B47322",
          }}>✦ Włącz powiadomienia</button>
        </div>
      </div>
    </div>
  );
}

// Karta porady oczekujacej - dla slotow dnia ktorych jeszcze nie ma.
// Ikona zegarka (⏰) zamiast klodki - lepiej komunikuje "trzeba poczekac", nie "zablokowane".
function PendingSlotCard({ slotKey }) {
  const slot = SLOT_META[slotKey];
  if (!slot) return null;
  const labelMap = { poranek: "Czeka na poranek", poludnie: "Czeka na południe", wieczor: "Czeka na wieczór" };
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 14px", borderRadius: 16,
      background: "rgba(255,255,255,.5)",
      boxShadow: "inset 0 0 0 1.4px rgba(43,42,74,.08)",
      border: "1.5px dashed rgba(122,77,194,.3)",
      fontFamily: "inherit", color: "var(--p-ink-soft)",
    }}>
      <div style={{
        width: 36, height: 36, flex: "none", borderRadius: 12,
        background: "rgba(255,255,255,.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20,
        boxShadow: `inset 0 0 0 1.2px ${slot.ring}33`,
      }}>
        ⏰
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: slot.ring, textTransform: "uppercase" }}>
          {slot.emoji} {slot.label}
        </div>
        <div className="t-display" style={{ fontSize: 14, fontWeight: 700, color: "var(--p-ink)", marginTop: 1, opacity: 0.7 }}>
          {labelMap[slotKey]}
        </div>
      </div>
    </div>
  );
}

function MentorMessageCard({ msg, onMarkRead }) {
  const isUnread = !msg.viewed_at;
  const kindMap = {
    artifact: { icon: "artifact", tone: "amber", label: "ARTEFAKT" },
    message:  { icon: "mentor",   tone: "rose",  label: "WIADOMOŚĆ" },
    hint:     { icon: "medrzec",  tone: "magic", label: "PODPOWIEDŹ" },
  };
  const meta = kindMap[msg.kind] || kindMap.hint;
  const date = msg.sent_at ? new Date(msg.sent_at) : null;
  const dateStr = date ? date.toLocaleDateString("pl-PL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 14, padding: "14px 14px", borderRadius: 20, background: isUnread ? "linear-gradient(180deg, #FFF8E0 0%, #FCE9B3 100%)" : "rgba(255,255,255,.85)", boxShadow: isUnread ? "0 3px 0 rgba(180,115,34,.25), 0 10px 22px rgba(232,154,61,.22), inset 0 0 0 1.5px rgba(255,255,255,.7)" : "inset 0 0 0 1.5px rgba(255,255,255,.7), var(--shadow-md)", position: "relative" }}>
      {isUnread && (<div style={{ position: "absolute", top: 10, right: 12, fontSize: 9, fontWeight: 900, letterSpacing: 0.8, color: "#fff", background: "linear-gradient(180deg,#FFD269,#E89A3D)", padding: "3px 8px", borderRadius: 999, boxShadow: "0 2px 4px rgba(180,115,34,.4)" }}>NOWA</div>)}
      <PoradaGlyph kind={meta.icon} tone={meta.tone} size={58} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.4, color: "var(--p-magic-dk)", textTransform: "uppercase" }}>{meta.label}</span>
          {msg.mentor_name && (<span style={{ fontSize: 10, color: "var(--p-ink-soft)", fontWeight: 700 }}>· od {msg.mentor_name}</span>)}
        </div>
        {msg.title && (<div className="t-display" style={{ fontSize: 15.5, lineHeight: 1.2, fontWeight: 700, paddingRight: isUnread ? 56 : 0 }}>{msg.title}</div>)}
        <div className="t-hand" style={{ fontSize: 15, color: "var(--p-ink)", lineHeight: 1.35 }}>„{msg.body}"</div>
        {dateStr && (<div style={{ fontSize: 10.5, color: "var(--p-ink-soft)", fontWeight: 700, marginTop: 2 }}>{dateStr}</div>)}
        {isUnread && (
          <button onClick={() => onMarkRead?.(msg.id)} style={{ marginTop: 8, alignSelf: "flex-start", padding: "5px 12px", borderRadius: 999, background: "rgba(122,77,194,.15)", color: "var(--p-magic-dk)", border: "none", cursor: "pointer", fontSize: 11.5, fontWeight: 800, letterSpacing: 0.4 }}>✓ Oznacz jako przeczytane</button>
        )}
      </div>
    </div>
  );
}

export default function PoradyPage() {
  const navigate = useNavigate();
  const { player } = useAppData();
  const [tab, setTab] = useState("porady");
  const [mentorMsgs, setMentorMsgs] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [openTip, setOpenTip] = useState(null);
  // Stan przeczytanych - odswiezany gdy uzytkownik otworzy porade
  const [readTips, setReadTips] = useState(() => getReadTipsSet());

  useEffect(() => { if (!session.getPlayer()) navigate("/onboarding"); }, [navigate]);

  // Plynne sciszenie muzyki na czas wizyty w Komnacie (Rozkmina Dnia).
  // Ref-counted w bgMusic — TTS moze tez prosic o duck bez konfliktu.
  useEffect(() => {
    try { bgMusic.duck(); } catch {}
    return () => { try { bgMusic.unduck(); } catch {} };
  }, []);

  const loadMessages = async () => {
    const pid = session.getPlayer();
    if (!pid) return;
    setLoadingMsgs(true);
    try {
      const data = await api.getAllHints(pid);
      setMentorMsgs(data.hints || []);
    } catch (e) {
      console.warn("[PoradyPage] getAllHints failed:", e);
    } finally {
      setLoadingMsgs(false);
    }
  };

  useEffect(() => { loadMessages(); }, []);

  // Po zalogowaniu - pociagnij z backendu liste przeczytanych porad i zmerguj z localStorage.
  // Backend = master (między urządzeniami), localStorage = warm cache.
  useEffect(() => {
    const pid = session.getPlayer();
    if (!pid) return;
    api.getViewedTips(pid)
      .then((data) => {
        const remoteIds = (data?.viewed || []).map((v) => v.tip_id);
        if (remoteIds.length === 0) return;
        setReadTips((prev) => {
          const merged = new Set(prev);
          remoteIds.forEach((id) => merged.add(id));
          // synchronizuj localStorage z mergiem (zeby kolejne wizyty miały complete cache)
          try { localStorage.setItem(READ_TIPS_KEY, JSON.stringify([...merged])); } catch {}
          return merged;
        });
      })
      .catch((e) => console.warn("[PoradyPage] getViewedTips failed:", e));
  }, []);

  async function handleMarkRead(hintId) {
    const pid = session.getPlayer();
    if (!pid) return;
    try {
      await api.markHintViewed(pid, hintId);
      setMentorMsgs((prev) => prev.map((h) => h.id === hintId ? { ...h, viewed_at: new Date().toISOString() } : h));
    } catch (e) { console.warn(e); }
  }

  const profile = player ? profileCode(player.archetype) : null;
  // Dni od rejestracji: dzien 1 to dzisiaj (od razu 3 porady)
  const today = useMemo(() => daysSinceRegistration(player), [player]);
  const { slot: nowSlot, order: nowOrder } = useMemo(() => currentSlotInfo(), []);

  // Soft prompt push: pokazany RAZ, po 3+ otwartych poradach.
  // Reguly: tylko gdy isSupported(); tylko gdy status != denied i != subscribed;
  // localStorage flag "push.softPromptShown" - nie pokazuj wiecej razy.
  const [showPushPrompt, setShowPushPrompt] = useState(false);

  // Otwarcie porady - zapamietaj jako przeczytana (lokalnie + backend) + ew. soft prompt push
  function handleOpenTip(t) {
    setOpenTip(t);
    if (t?.id && !readTips.has(t.id)) {
      const newSet = new Set([...readTips, t.id]);
      markTipRead(t.id);
      setReadTips(newSet);
      const pid = session.getPlayer();
      if (pid) {
        api.markTipViewed(pid, t.id).catch((e) => console.warn("[PoradyPage] markTipViewed failed:", e));
      }
      // Po 3. NOWO otwartej poradzie - rozwaz soft prompt push
      maybeShowPushPrompt(newSet.size);
    }
  }

  async function maybeShowPushPrompt(readCount) {
    if (readCount < 3) return;
    if (!pushSvc.isSupported()) return;
    try {
      if (localStorage.getItem("push.softPromptShown") === "1") return;
    } catch {}
    try {
      const status = await pushSvc.getStatus();
      if (status === "denied" || status === "subscribed") return;
    } catch {}
    setShowPushPrompt(true);
  }

  async function handleEnablePush() {
    try {
      await pushSvc.enable();
      try { localStorage.setItem("push.softPromptShown", "1"); } catch {}
      setShowPushPrompt(false);
    } catch (e) {
      console.warn("[push enable]", e);
      try { localStorage.setItem("push.softPromptShown", "1"); } catch {}
      setShowPushPrompt(false);
      alert(`Nie udało się włączyć: ${e.message}`);
    }
  }
  function handleSkipPush() {
    try { localStorage.setItem("push.softPromptShown", "1"); } catch {}
    setShowPushPrompt(false);
  }

  // WSZYSTKIE dostepne porady profilu dla dziecka, posortowane od najnowszych
  // (day desc, w obrebie dnia: wieczor > poludnie > poranek).
  // Baza ma luki (niektore profile maja 9-30 porad lacznie zamiast 90), wiec zamiast
  // sztywno trzymac sie day-based gating, pokazujemy CALOSC co jest dostepne -
  // dziecko zawsze ma cos do czytania.
  const availableTips = useMemo(() => {
    if (!profile) return [];
    return DAILY_TIPS
      .filter((t) => t.profile === profile && t.audience === "dziecko")
      .sort((a, b) => (b.day - a.day) || (SLOT_ORDER[b.slot] - SLOT_ORDER[a.slot]));
  }, [profile]);

  // ŚWIEŻA: zawsze najnowsza dostepna porada (purple card na gorze) - niezaleznie od slotu.
  const freshTip = useMemo(() => availableTips[0] || null, [availableTips]);

  // HISTORIA: pozostale porady (bez freshTip), zachowuje sortowanie od najnowszych
  const historyTips = useMemo(() => availableTips.slice(1), [availableTips]);

  // OCZEKUJACE: sloty bieżącego dnia, które jeszcze nie nadeszły (np. wieczór gdy jest południe).
  // Pokazane z ikoną zegarka jako "Czeka na poranek/południe/wieczór" - daje dziecku poczucie,
  // że Mędrzec ma jeszcze coś w zanadrzu na ten dzień.
  const todayFutureSlots = useMemo(() => {
    return ["poranek", "poludnie", "wieczor"].filter((s) => SLOT_ORDER[s] > nowOrder);
  }, [nowOrder]);

  const unreadCount = mentorMsgs.filter((m) => !m.viewed_at).length;
  const totalMsgCount = mentorMsgs.length;

  // Grupowanie historii po dniu (bez filtrow)
  const historyByDay = useMemo(() => {
    const m = new Map();
    for (const t of historyTips) {
      if (!m.has(t.day)) m.set(t.day, []);
      m.get(t.day).push(t);
    }
    return Array.from(m.entries()).sort((a, b) => b[0] - a[0]);
  }, [historyTips]);

  if (!player) return null;

  return (
    <PageShell>
      <TopBar />
      <div className="screen-scroll" style={{ flex: 1, minHeight: 0, padding: "12px 18px calc(100px + env(safe-area-inset-bottom, 0px))", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Header dynamiczny - zmienia sie miedzy zakladkami:
              porady   -> KOMNATA MEDRCA / Porady (caps label fioletowy)
              mentor   -> SKRZYNKA MENTORA / Wiadomosci (caps label miodowy)
            Key forsuje re-render i fade na zmiane tabu. */}
        <div key={`hdr-${tab}`} style={{ opacity: 0, animation: "el-up .45s ease 0s forwards", padding: "2px 2px 0" }}>
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 1.8,
            color: tab === "porady" ? "var(--p-magic-dk)" : "#A66A1A",
            textTransform: "uppercase",
          }}>
            {tab === "porady" ? "Komnata Mędrca" : "Skrzynka Mentora"}
          </div>
          <h1 className="t-display" style={{ fontSize: 28, margin: "2px 0 0", lineHeight: 1, color: "var(--p-ink)" }}>
            {tab === "porady" ? "Porady" : "Wiadomości"}
          </h1>
        </div>

        {/* Tab switcher: ikonki (magiczna kula vs koperta) - dla dziecka czytelniejsze niz tekst */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
          padding: 6, borderRadius: 18, background: "rgba(255,255,255,.55)",
          boxShadow: "inset 0 0 0 1.2px rgba(43,42,74,.08)",
          opacity: 0, animation: "el-up .55s ease .05s forwards",
        }}>
          <button
            onClick={() => setTab("porady")}
            title="Porady dnia"
            aria-label="Porady dnia"
            style={{
              padding: "12px 10px", borderRadius: 14, border: "none", cursor: "pointer",
              background: tab === "porady" ? "linear-gradient(180deg,#FFD269,#E89A3D)" : "transparent",
              color: tab === "porady" ? "#4A2A0E" : "var(--p-ink-soft)",
              boxShadow: tab === "porady" ? "0 2px 6px rgba(232,154,61,.4)" : "none",
              transition: "all .2s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontSize: 26,
            }}
          >
            {/* Magiczna kula (krysztal) - na zoltym tle inverted kolory dla kontrastu */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <defs>
                <radialGradient id={`ball-${tab}`} cx=".5" cy=".4">
                  <stop offset="0%" stopColor={tab === "porady" ? "#FFF6D6" : "#C8A0F0"} stopOpacity=".95" />
                  <stop offset="60%" stopColor={tab === "porady" ? "#C8A0F0" : "#9B7BC4"} stopOpacity=".7" />
                  <stop offset="100%" stopColor={tab === "porady" ? "#7A4DC2" : "#6B4AA0"} stopOpacity=".95" />
                </radialGradient>
              </defs>
              <ellipse cx="16" cy="28" rx="9" ry="2" fill="rgba(43,42,74,.18)" />
              <circle cx="16" cy="14" r="10" fill={`url(#ball-${tab})`} stroke={tab === "porady" ? "#A66A1A" : "#7A4DC2"} strokeWidth="1.5" />
              <circle cx="13" cy="11" r="2.4" fill="#fff" opacity=".55" />
              <path d="M6 25 L26 25" stroke={tab === "porady" ? "#A66A1A" : "#7A4DC2"} strokeWidth="1.8" strokeLinecap="round" opacity=".7" />
            </svg>
          </button>
          <button
            onClick={() => setTab("mentor")}
            title="Wiadomości od mentora"
            aria-label="Wiadomości od mentora"
            style={{
              position: "relative",
              padding: "12px 10px", borderRadius: 14, border: "none", cursor: "pointer",
              background: tab === "mentor" ? "linear-gradient(180deg,#FFD269,#E89A3D)" : "transparent",
              color: tab === "mentor" ? "#4A2A0E" : "var(--p-ink-soft)",
              boxShadow: tab === "mentor" ? "0 2px 6px rgba(232,154,61,.4)" : "none",
              transition: "all .2s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {/* Koperta */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="9" width="24" height="16" rx="3" fill={tab === "mentor" ? "#fff" : "#FCF5E1"} stroke={tab === "mentor" ? "#A66A1A" : "var(--p-ink-soft)"} strokeWidth="1.6" />
              <path d="M4 11 L16 19 L28 11" fill="none" stroke={tab === "mentor" ? "#A66A1A" : "var(--p-ink-soft)"} strokeWidth="1.6" strokeLinejoin="round" />
              {tab === "mentor" && (
                <path d="M22 5 L26 9 M24 4 L26 6" stroke="#A66A1A" strokeWidth="1.2" strokeLinecap="round" />
              )}
            </svg>
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: 6, right: 10,
                minWidth: 18, height: 18, borderRadius: 999,
                background: "#E84BA0", color: "#fff",
                fontSize: 10, fontWeight: 900,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                padding: "0 5px",
                boxShadow: "0 2px 4px rgba(184,47,124,.5)",
                animation: "pulse-dot 2s ease-in-out infinite",
              }}>{unreadCount}</span>
            )}
          </button>
        </div>

        {/* Animacja przelaczenia tab: fade-slide */}
        <style>{`
          .porady-tab-content { animation: porady-fade-slide .35s cubic-bezier(.34,1.56,.64,1) both; }
          @keyframes porady-fade-slide {
            0% { opacity: 0; transform: translateX(20px); }
            100% { opacity: 1; transform: translateX(0); }
          }
        `}</style>
        {tab === "porady" && (
          <div className="porady-tab-content" key="tab-porady" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Najnowsza porada — duza purple card na gorze, zawsze dostepna */}
            {freshTip && (
              <FreshTipCard tip={freshTip} onOpen={handleOpenTip} read={readTips.has(freshTip.id)} />
            )}

            {/* OCZEKUJACE - sloty dnia jeszcze przed nami, z ikona zegarka */}
            {todayFutureSlots.length > 0 && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "10px 4px 0" }}>
                  <span style={{ fontSize: 16 }}>⏰</span>
                  <div className="t-display" style={{ fontSize: 16, color: "var(--p-ink-soft)" }}>Wkrótce</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {todayFutureSlots.map((s) => <PendingSlotCard key={s} slotKey={s} />)}
                </div>
              </>
            )}

            {/* HISTORIA — wszystkie pozostale porady profilu, posortowane od najnowszych.
                Pogrupowane po dniach z labelka DZIEN N - daje uczniowi poczucie kroniki rozwoju. */}
            {historyTips.length > 0 && (
              <>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "10px 4px 0" }}>
                  <div className="t-display" style={{ fontSize: 16, color: "var(--p-ink-soft)" }}>Wcześniejsze porady</div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--p-ink-soft)", letterSpacing: 0.5 }}>{historyTips.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {historyByDay.map(([day, tips]) => (
                    <div key={day} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "var(--p-magic-dk)", letterSpacing: 1.2, textTransform: "uppercase", padding: "0 4px" }}>Dzień {day}</div>
                      {tips.map((t) => (
                        <HistoryTipCard key={t.id} tip={t} dayLabel={`Dzień ${t.day}`} onOpen={handleOpenTip} read={readTips.has(t.id)} />
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Empty state - tylko gdy profile nie ma zadnych porad w bazie */}
            {!freshTip && (
              <div className="card" style={{ textAlign: "center", padding: "22px 16px", marginTop: 8 }}>
                <div className="t-display" style={{ fontSize: 17 }}>Mędrzec zbiera myśli…</div>
                <div style={{ fontSize: 13, color: "var(--p-ink-soft)", marginTop: 4 }}>Wróć tu za chwilę — pierwsza porada już w drodze.</div>
              </div>
            )}
          </div>
        )}

        {tab === "mentor" && (
          <div className="porady-tab-content" key="tab-mentor" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "4px 4px 0" }}>
              <div className="t-display" style={{ fontSize: 18 }}>Wiadomości od mentora</div>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--p-ink-soft)", letterSpacing: 0.5 }}>{totalMsgCount} {totalMsgCount === 1 ? "wpis" : totalMsgCount > 1 && totalMsgCount < 5 ? "wpisy" : "wpisów"}</span>
            </div>
            {loadingMsgs && (<div className="card" style={{ textAlign: "center", padding: "22px 16px" }}><div style={{ fontSize: 13, color: "var(--p-ink-soft)" }}>Wczytuję wiadomości…</div></div>)}
            {!loadingMsgs && mentorMsgs.length === 0 && (
              <div style={{ marginTop: 4, borderRadius: 20, overflow: "hidden", background: "linear-gradient(135deg, rgba(255,210,105,.30), rgba(184,134,232,.25))", border: "1.5px dashed rgba(122,77,194,.35)", padding: "26px 18px", textAlign: "center" }}>
                <div style={{ fontSize: 42 }}>📭</div>
                <div className="t-display" style={{ fontSize: 18 }}>Cisza w skrzynce…</div>
                <div style={{ fontSize: 13, color: "var(--p-ink-soft)", marginTop: 6, lineHeight: 1.4 }}>Twój mentor jeszcze nic Ci nie napisał.<br />Gdy wyśle wiadomość, pojawi się tutaj.</div>
              </div>
            )}
            {!loadingMsgs && mentorMsgs.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {mentorMsgs.map((msg) => (<MentorMessageCard key={msg.id} msg={msg} onMarkRead={handleMarkRead} />))}
              </div>
            )}
          </div>
        )}
      </div>
      {openTip && <TipModal tip={openTip} onClose={() => setOpenTip(null)} />}
      {showPushPrompt && <PushPrompt onEnable={handleEnablePush} onSkip={handleSkipPush} />}
      <TabBar current="home" />
    </PageShell>
  );
}
