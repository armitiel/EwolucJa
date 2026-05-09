/**
 * Centralna konfiguracja frontendu V2.
 */

export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:3001/api";

// Aktualnie dostępny archetyp w MVP. Reszta odłożona do kolejnych iteracji.
export const ARCHETYPES = {
  tropiciel_tajemnic: {
    id: "tropiciel_tajemnic",
    profile: "DT",
    name: "Tropiciel Tajemnic",
    tagline: "Nic nie umknie Twojej uwadze.",
    description:
      "Smukły kot-humanoid w długim płaszczu i kapeluszu. Jedno oko zasłonięte monoklem-lupą, drugie świeci pomarańczowo. Stąpa cicho i zostawia świecące ślady.",
    accent_color: "#9b59b6",
    glow_color: "rgba(155, 89, 182, 0.25)",
    starter_artifact: { id: "kompas_cieni", name: "Kompas Cieni" },
    voice_persona: "tajemniczy, lekko żartobliwy szept",
    available_in_mvp: true,
  },
  zaklinacz_uczuc: {
    id: "zaklinacz_uczuc",
    profile: "EM",
    name: "Zaklinacz Uczuć",
    tagline: "Twoje serce widzi to, czego oczy nie widzą.",
    accent_color: "#e74c3c",
    available_in_mvp: false,
  },
  mistrz_map: {
    id: "mistrz_map",
    profile: "ST",
    name: "Mistrz Map",
    tagline: "Trzy kroki do przodu, zawsze.",
    accent_color: "#3498db",
    available_in_mvp: false,
  },
  tkacz_snow: {
    id: "tkacz_snow",
    profile: "KR",
    name: "Tkacz Snów",
    tagline: "Robisz z kartonu kosmiczny statek.",
    accent_color: "#e67e22",
    available_in_mvp: false,
  },
  gwardzista_odwagi: {
    id: "gwardzista_odwagi",
    profile: "LD",
    name: "Gwardzista Odwagi",
    tagline: "Idziesz pierwszy, nie z pychy — z troski.",
    accent_color: "#2ecc71",
    available_in_mvp: false,
  },
  straznik_mostu: {
    id: "straznik_mostu",
    profile: "MD",
    name: "Strażnik Mostu",
    tagline: "Łączysz dwie strony, gdy nikt inny nie może.",
    accent_color: "#1abc9c",
    available_in_mvp: false,
  },
};

// Cykl tygodniowy — pomocniki
export function timeUntilFriday(deadlineIso) {
  if (!deadlineIso) return null;
  const ms = new Date(deadlineIso).getTime() - Date.now();
  if (ms <= 0) return { passed: true, label: "Termin minął" };
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  if (days >= 1) return { passed: false, label: `${days}d ${hours}h do piątku` };
  return { passed: false, label: `${hours}h do piątku` };
}
