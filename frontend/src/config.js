/**
 * Centralna konfiguracja frontendu V2.
 */

export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.PROD ? "/api" : "http://localhost:3001/api");

// Wszystkie 6 archetypow dostepnych dla graczy. Dopasowanie wedlug quizu wstepnego.
export const ARCHETYPES = {
  tropiciel_tajemnic: {
    id: "tropiciel_tajemnic",
    profile: "DT",
    name: "Tropiciel Tajemnic",
    tagline: "Nic nie umknie Twojej uwadze.",
    description:
      "Smukły lis-humanoid w długim płaszczu i kapeluszu. Jedno oko zasłonięte monoklem-lupą, drugie świeci ciepłym bursztynem. Stąpa cicho i zostawia świecące ślady. Rozwija dociekliwość, uważność i sztukę stawiania pytań.",
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
    description:
      "Drobna, eteryczna istota o spiczastych uszach. Skóra zmienia odcień zależnie od emocji w pobliżu — różowy to radość, błękit to spokój, fiolet to troska. Towarzyszy jej świecąca ćma. Rozwija empatię, wrażliwość i łagodność.",
    accent_color: "#e74c3c",
    glow_color: "rgba(231, 76, 60, 0.25)",
    starter_artifact: { id: "muszla_echa", name: "Muszla Echa" },
    voice_persona: "miękki, ciepły, uważny",
    available_in_mvp: true,
  },
  mistrz_map: {
    id: "mistrz_map",
    profile: "ST",
    name: "Mistrz Map",
    tagline: "Trzy kroki do przodu, zawsze.",
    description:
      "Mądry gnom o krępej sylwetce, w długim płaszczu z dziesiątkami kieszeni pełnych zwojów. Mosiężne okulary z wymiennymi soczewkami. W łapie zwinięta mapa, która sama się rozwija. Rozwija logikę, planowanie i samokontrolę.",
    accent_color: "#3498db",
    glow_color: "rgba(52, 152, 219, 0.25)",
    starter_artifact: { id: "kompas_strategiczny", name: "Kompas Strategiczny" },
    voice_persona: "spokojny, planujący, w precyzyjnych krokach",
    available_in_mvp: true,
  },
  tkacz_snow: {
    id: "tkacz_snow",
    profile: "KR",
    name: "Tkacz Snów",
    tagline: "Robisz z kartonu kosmiczny statek.",
    description:
      "Półprzezroczysta istota z gwiezdnego pyłu. W jej ciele krążą kolorowe iskry układające się w zmienne wzory. Z palców snują się świetliste nici, z których pleci obrazy w powietrzu. Rozwija myślenie nieszablonowe i ekspresję.",
    accent_color: "#e67e22",
    glow_color: "rgba(230, 126, 34, 0.25)",
    starter_artifact: { id: "atrament_kronikarski", name: "Atrament Kronikarski" },
    voice_persona: "rozmarzony, pełen zaskakujących porównań",
    available_in_mvp: true,
  },
  gwardzista_odwagi: {
    id: "gwardzista_odwagi",
    profile: "LD",
    name: "Gwardzista Odwagi",
    tagline: "Idziesz pierwszy, nie z pychy — z troski.",
    description:
      "Postawna postać z lwią grzywą w ciepłych pomarańczach. Zbroja z miękkiej, matowej gliny o krągłych krawędziach. Stoi pewnie, pierś do przodu, ale uśmiech łagodny. Rozwija odwagę, inicjatywę i troskę o innych.",
    accent_color: "#2ecc71",
    glow_color: "rgba(46, 204, 113, 0.25)",
    starter_artifact: { id: "tarcza_slonca", name: "Tarcza Słońca" },
    voice_persona: "śmiały, motywujący, ale ciepły",
    available_in_mvp: true,
  },
  straznik_mostu: {
    id: "straznik_mostu",
    profile: "MD",
    name: "Strażnik Mostu",
    tagline: "Łączysz dwie strony, gdy nikt inny nie może.",
    description:
      "Spokojna, rozłożysta postać z dwoma parami ramion — po jednej dla każdej strony. Skóra w odcieniu jasnego piaskowca, włosy splecione w warkocz z dwóch kolorów. W rękach trzyma świetlistą wstęgę łączącą dłonie. Rozwija mediację i słuchanie obu stron.",
    accent_color: "#1abc9c",
    glow_color: "rgba(26, 188, 156, 0.25)",
    starter_artifact: { id: "wstega_laczen", name: "Wstęga Łączeń" },
    voice_persona: "łagodzący, łączący, spokojny",
    available_in_mvp: true,
  },
};

// Cykl tygodniowy — pomocniki
export function timeUntilFriday(deadlineIso) {
  if (!deadlineIso) return null;
  const ms = new Date(deadlineIso).getTime() - Date.now();
  if (ms <= 0) return { passed: true, label: "Termin minął", days: 0, hours: 0 };
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const daysRoundedUp = days + (hours > 0 ? 1 : 0);
  if (days >= 1) {
    return { passed: false, label: `${days}d ${hours}h do piątku`, days: daysRoundedUp, hours };
  }
  return { passed: false, label: `${hours}h do piątku`, days: daysRoundedUp, hours };
}
