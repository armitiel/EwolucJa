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

// LocalStorage tracking przeczytanych porad - prosty Set ID
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

function FreshTipCard({ tip, onOpen, read = false }) {
  const slot = SLOT_META[tip.slot] || SLOT_META.poludnie;
  const cat = PORADY_CATEGORIES.find((c) => c.id === tip.category) || {};
  // Przeczytane = mniej "krzykliwe": nizsze nasycenie + opacity
  return (
    <button onClick={() => onOpen?.(tip)} style={{
      display: "flex", alignItems: "stretch", gap: 16, padding: "16px 16px",
      borderRadius: 22, border: "none", cursor: "pointer", textAlign: "left", width: "100%",
      background: `linear-gradient(180deg,${slot.color} 0%,#fff 100%)`,
      boxShadow: `0 3px 0 ${slot.ring}33, 0 12px 28px rgba(43,42,74,.18), inset 0 0 0 1.5px rgba(255,255,255,.85)`,
      fontFamily: "inherit", color: "var(--p-ink)",
      position: "relative",
      transition: "transform .2s ease, box-shadow .2s ease, opacity .3s ease, filter .3s ease",
      opacity: read ? 0.7 : 1,
      filter: read ? "saturate(.55)" : "none",
    }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}>
      <PoradaGlyph kind={tip.icon || "medrzec"} tone={tip.tone || slot.tone} size={64} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.2, color: slot.ring, background: "rgba(255,255,255,.6)", padding: "3px 9px", borderRadius: 999 }}>{slot.emoji} {slot.label.toUpperCase()}</span>
          {read && (
            <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1, color: "var(--p-ink-soft)", background: "rgba(43,42,74,.10)", padding: "2px 7px", borderRadius: 999 }}>
              ✓ PRZECZYTANE
            </span>
          )}
          <span style={{ fontSize: 10, color: "var(--p-ink-soft)", fontWeight: 700 }}>· {tip.time || "1 min"}</span>
        </div>
        <div className="t-display" style={{ fontSize: 17, lineHeight: 1.2, fontWeight: 700, paddingRight: 8 }}>{tip.title}</div>
        <div style={{ fontSize: 13.5, color: "var(--p-ink)", lineHeight: 1.42 }}>{tip.body}</div>
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
  const cat = PORADY_CATEGORIES.find((c) => c.id === tip.category) || {};
  return (
    <div role="dialog" aria-modal="true" onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(43,30,90,.45)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 480, background: `linear-gradient(180deg,${slot.color} 0%, #fff 50%)`, borderRadius: 24, padding: "22px 20px 18px", boxShadow: "0 12px 36px rgba(43,30,90,.4)", color: "var(--p-ink)", position: "relative" }}>
        <button onClick={onClose} aria-label="Zamknij" style={{ position: "absolute", top: 12, right: 14, width: 32, height: 32, borderRadius: 999, border: "none", cursor: "pointer", background: "rgba(255,255,255,.75)", color: "var(--p-ink)", fontSize: 18, fontWeight: 800, boxShadow: "0 2px 6px rgba(43,30,90,.2)" }}>×</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <PoradaGlyph kind={tip.icon || "medrzec"} tone={tip.tone || slot.tone} size={56} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.2, color: slot.ring, background: "rgba(255,255,255,.7)", padding: "3px 9px", borderRadius: 999 }}>{slot.emoji} {slot.label.toUpperCase()} · DZIEŃ {tip.day}</span>
              <span style={{ fontSize: 10, color: "var(--p-ink-soft)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{cat.label}</span>
            </div>
          </div>
        </div>
        <h3 className="t-display" style={{ margin: "4px 0 10px", fontSize: 22, lineHeight: 1.18, fontWeight: 700 }}>{tip.title}</h3>
        <div style={{ fontSize: 15, lineHeight: 1.5, color: "var(--p-ink)" }}>{tip.body}</div>
        {tip.tags && tip.tags.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
            {tip.tags.map((t) => (<span key={t} style={{ fontSize: 10, fontWeight: 700, color: "var(--p-ink-soft)", background: "rgba(43,42,74,.07)", padding: "3px 8px", borderRadius: 999 }}>#{t}</span>))}
          </div>
        )}
      </div>
    </div>
  );
}

function LockedSlotCard({ slotKey }) {
  const slot = SLOT_META[slotKey];
  if (!slot) return null;
  const labelMap = { poranek: "Wróć rano", poludnie: "Wróć w południe", wieczor: "Wróć wieczorem" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 16, background: "rgba(255,255,255,.45)", boxShadow: "inset 0 0 0 1.5px rgba(43,42,74,.10)", fontFamily: "inherit", color: "var(--p-ink-soft)", border: "1.5px dashed rgba(122,77,194,.25)" }}>
      <div style={{ fontSize: 26, opacity: 0.6 }}>{slot.emoji}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: slot.ring, textTransform: "uppercase" }}>{slot.label}</div>
        <div className="t-display" style={{ fontSize: 14, fontWeight: 700, color: "var(--p-ink-soft)", marginTop: 1 }}>{labelMap[slotKey]}</div>
      </div>
      <div style={{ fontSize: 18, opacity: 0.4 }}>🔒</div>
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

  // Otwarcie porady - zapamietaj jako przeczytana
  function handleOpenTip(t) {
    setOpenTip(t);
    if (t?.id && !readTips.has(t.id)) {
      markTipRead(t.id);
      setReadTips(new Set([...readTips, t.id]));
    }
  }

  // Wszystkie porady dnia DZIŚ dla profilu (3 sloty)
  const todayTips = useMemo(() => {
    if (!profile) return [];
    return tipsForDay(profile, today).filter((t) => t.audience === "dziecko");
  }, [profile, today]);

  // ŚWIEŻA: porada aktualnego slotu (1 sztuka)
  const freshTip = useMemo(() => {
    return todayTips.find((t) => t.slot === nowSlot) || null;
  }, [todayTips, nowSlot]);

  // SLOTY DZIŚ JUŻ ZA NAMI (poranne porady po południu wpadają tu)
  const todayPastTips = useMemo(() => {
    return todayTips
      .filter((t) => SLOT_ORDER[t.slot] < nowOrder)
      .sort((a, b) => SLOT_ORDER[a.slot] - SLOT_ORDER[b.slot]);
  }, [todayTips, nowOrder]);

  // SLOTY DZIŚ PRZYSZŁE (np. wieczór gdy jest poranek) — pokażemy "Wróć później"
  const todayFutureSlots = useMemo(() => {
    return ["poranek", "poludnie", "wieczor"].filter((s) => SLOT_ORDER[s] > nowOrder);
  }, [nowOrder]);

  // HISTORIA: wcześniejsze dni cyklu (1..today-1), wszystkie sloty
  const historyTips = useMemo(() => {
    if (!profile) return [];
    return DAILY_TIPS
      .filter((t) => t.profile === profile && t.audience === "dziecko" && t.day < today)
      .sort((a, b) => (b.day - a.day) || (SLOT_ORDER[a.slot] - SLOT_ORDER[b.slot]));
  }, [profile, today]);

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
              background: tab === "porady" ? "linear-gradient(180deg,#7A4DC2,#4A2D80)" : "transparent",
              color: tab === "porady" ? "#fff" : "var(--p-ink-soft)",
              boxShadow: tab === "porady" ? "0 2px 6px rgba(74,45,128,.35)" : "none",
              transition: "all .2s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontSize: 26,
            }}
          >
            {/* Magiczna kula (krysztal) */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <defs>
                <radialGradient id={`ball-${tab}`} cx=".5" cy=".4">
                  <stop offset="0%" stopColor={tab === "porady" ? "#FFD269" : "#C8A0F0"} stopOpacity=".9" />
                  <stop offset="60%" stopColor={tab === "porady" ? "#C8A0F0" : "#9B7BC4"} stopOpacity=".7" />
                  <stop offset="100%" stopColor={tab === "porady" ? "#7A4DC2" : "#6B4AA0"} stopOpacity=".95" />
                </radialGradient>
              </defs>
              <ellipse cx="16" cy="28" rx="9" ry="2" fill="rgba(43,42,74,.18)" />
              <circle cx="16" cy="14" r="10" fill={`url(#ball-${tab})`} stroke={tab === "porady" ? "#FFD269" : "#7A4DC2"} strokeWidth="1.5" />
              <circle cx="13" cy="11" r="2.4" fill="#fff" opacity=".55" />
              <path d="M6 25 L26 25" stroke={tab === "porady" ? "#FFD269" : "#7A4DC2"} strokeWidth="1.8" strokeLinecap="round" opacity=".7" />
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
            {/* ŚWIEŻA porada — duża karta dla aktualnego slotu */}
            {freshTip && (
              <>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "4px 4px 0" }}>
                  <div className="t-display" style={{ fontSize: 19, color: "var(--p-ink)" }}>
                    ✦ Świeża porada {SLOT_META[nowSlot].label.toLowerCase()}
                  </div>
                </div>
                <FreshTipCard tip={freshTip} onOpen={handleOpenTip} read={readTips.has(freshTip.id)} />
              </>
            )}

            {/* JUŻ DZIŚ (porady wcześniejszych slotów dnia) - przeczytane wyszarzone */}
            {todayPastTips.length > 0 && (
              <>
                <div className="t-display" style={{ fontSize: 14, color: "var(--p-ink-soft)", margin: "8px 4px 0" }}>Już dziś</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {todayPastTips.map((t) => (
                    <HistoryTipCard key={t.id} tip={t} dayLabel="Dziś" onOpen={handleOpenTip} read={readTips.has(t.id)} />
                  ))}
                </div>
              </>
            )}

            {/* PRZYSZŁE sloty dnia — locked */}
            {todayFutureSlots.length > 0 && (
              <>
                <div className="t-display" style={{ fontSize: 14, color: "var(--p-ink-soft)", margin: "4px 4px 0" }}>Jeszcze przed Tobą</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {todayFutureSlots.map((s) => <LockedSlotCard key={s} slotKey={s} />)}
                </div>
              </>
            )}

            {/* HISTORIA — poprzednie dni */}
            {historyByDay.length > 0 && (
              <>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "16px 4px 0" }}>
                  <div className="t-display" style={{ fontSize: 16, color: "var(--p-ink-soft)" }}>Poprzednie dni</div>
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

            {/* Empty state - praktycznie niemozliwy bo zawsze dziecko ma >= 1 porade */}
            {!freshTip && todayPastTips.length === 0 && historyByDay.length === 0 && (
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
      <TabBar current="home" />
    </PageShell>
  );
}
