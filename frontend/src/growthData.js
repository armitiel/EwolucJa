// Growth tips per profile
export const GROWTH_TIPS = {
  EM: {
    desc: "Empatia to Twoja sila - potrafisz czuc to, co inni. Oto jak ja rozwijac dalej:",
    tips: [
      "Codziennie zapytaj kogos bliskiego: jak sie dzis czujesz? I sluchaj uwaznie",
      "Narysuj komiks o postaci, ktora pomaga komus smutnemu",
      "Kiedy ktos jest zly, sprobuj zgadnac dlaczego, zanim ocenisz",
      "Prowadz dziennik uczuc - zapisuj co czules i dlaczego",
    ],
  },
  ST: {
    desc: "Strategiczne myslenie to Twoj atut - planujesz i analizujesz jak mistrz!",
    tips: [
      "Graj w gry planszowe wymagajace planowania (szachy, Catan, Blokus)",
      "Przed zadaniem domowym zrob plan: co, jak i w jakiej kolejnosci",
      "Rozwiazuj zagadki logiczne lub lamiglowki (Sudoku, labirynty)",
      "Wymysl 3 rozne rozwiazania jednego problemu i wybierz najlepsze",
    ],
  },
  KR: {
    desc: "Kreatywnosc to Twoja moc - widzisz swiat inaczej niz inni!",
    tips: [
      "Codziennie narysuj lub stworz cos nowego - nawet malego",
      "Wymysl alternatywne zakonczenie ulubionej bajki",
      "Zbuduj cos z materialow znalezionych w domu (karton, patyczki)",
      "Prowadz zeszyt pomyslow - zapisuj kazdy szalony pomysl",
    ],
  },
  LD: {
    desc: "Liderstwo to Twoja natura - inspirujesz innych do dzialania!",
    tips: [
      "Zaproponuj zabawe w grupie i zorganizuj zasady",
      "Kiedy kolega ma problem, zaproponuj pomoc zanim poprosi",
      "Podejmuj decyzje, ale pytaj innych o ich zdanie",
      "Prowadz male projekty - np. zorganizuj piknik lub gre podworkowa",
    ],
  },
  DT: {
    desc: "Umysl detektywa to Twoj dar - dostrzegasz to, co inni pomijaja!",
    tips: [
      "Graj w szukaj roznic lub gry obserwacyjne",
      "Podczas spaceru zanotuj 5 rzeczy, ktorych wczesniej nie zauwazyles",
      "Zadawaj pytania: dlaczego? - nawet wobec rzeczy oczywistych",
      "Prowadz dziennik obserwacji przyrody lub otoczenia",
    ],
  },
  MD: {
    desc: "Mediacja to Twoj talent - potrafisz laczyc ludzi i gasic konflikty!",
    tips: [
      "Kiedy dwoje kolegow sie klocio, sprobuj wysluchac obu stron",
      "Cwicz zdania typu: rozumiem, ze czujesz... - to buduje mosty",
      "Zaproponuj kompromis w nastepnej klotni o zabawke lub gre",
      "Graj w gry wspolpracy (np. Pandemic, Hanabi) zamiast rywalizacji",
    ],
  },
};

// Daily missions per profile
export const DAILY_MISSIONS = {
  EM: [
    { icon: "\uD83D\uDC8C", text: "Napisz mila wiadomosc do kogos, kto mial ciezki dzien" },
    { icon: "\uD83E\uDD17", text: "Przytul 3 osoby z rodziny i powiedz im cos milego" },
    { icon: "\uD83C\uDFAD", text: "Odegraj scenke, w ktorej pocieszasz smutna postac" },
    { icon: "\uD83D\uDCD6", text: "Przeczytaj opowiadanie i opisz uczucia glownego bohatera" },
    { icon: "\uD83C\uDF08", text: "Narysuj mape swoich dzisiejszych emocji (rano, po szkole, wieczorem)" },
    { icon: "\uD83D\uDC42", text: "Przez 5 minut sluchaj kogos bez przerywania - potem powiedz co zrozumiales" },
    { icon: "\uD83C\uDFA8", text: "Namaluj portret kogos bliskiego i podaruj mu go" },
  ],
  ST: [
    { icon: "\uD83D\uDDFA\uFE0F", text: "Zaplanuj idealny weekend - z harmonogramem i planem B" },
    { icon: "\uD83E\uDDE9", text: "Rozwiaz 3 zagadki logiczne lub lamiglowki" },
    { icon: "\uD83D\uDCCA", text: "Policz cos w domu (ksiazki, rosliny) i zrob wykres" },
    { icon: "\uD83C\uDFAF", text: "Wyznacz 3 cele na dzis i odznaczaj je po kolei" },
    { icon: "\uD83C\uDFD7\uFE0F", text: "Zbuduj z klockow wieze tak wysoko jak sie da - z planem!" },
    { icon: "\uD83D\uDD22", text: "Wymysl gre liczbowa i naucz jej kogos" },
    { icon: "\uD83D\uDCDD", text: "Napisz liste za i przeciw przed podjeciem nastepnej decyzji" },
  ],
  KR: [
    { icon: "\u270F\uFE0F", text: "Narysuj stwora, ktory nie istnieje - nadaj mu imie i historie" },
    { icon: "\uD83C\uDFB5", text: "Wymysl piosenke o dzisiejszym dniu (chocby 4 linijki)" },
    { icon: "\uD83D\uDCE6", text: "Zbuduj cos niesamowitego z kartonow i tasmy klejacej" },
    { icon: "\uD83C\uDF00", text: "Narysuj abstrakcyjny rysunek tylko z zamknietymi oczami" },
    { icon: "\uD83D\uDCDD", text: "Napisz miniaturowa bajke (5 zdan) o latajacym kocie" },
    { icon: "\uD83C\uDFAD", text: "Wymysl nowa postac do gry i opisz jej supermoce" },
    { icon: "\uD83D\uDD8C\uFE0F", text: "Pomaluj kamien, ktory znajdziesz - niech stanie sie amuletem" },
  ],
  LD: [
    { icon: "\uD83D\uDCE2", text: "Zorganizuj rodzinna gre planszowa i wyjasniej zasady" },
    { icon: "\uD83E\uDD1D", text: "Pomoz mlodszemu dziecku w czyms trudnym" },
    { icon: "\uD83D\uDCCB", text: "Zaproponuj plan dnia dla calej rodziny" },
    { icon: "\uD83C\uDFC6", text: "Pochwal 3 osoby dzisiaj za cos konkretnego" },
    { icon: "\uD83C\uDFAA", text: "Wymysl i zorganizuj mini-turniej w ulubiona gre" },
    { icon: "\uD83E\uDDED", text: "Poprowadz rodzinny spacer - Ty decydujesz o trasie" },
    { icon: "\uD83D\uDCA1", text: "Zaproponuj rozwiazanie problemu domowego (np. balagan, plan obiadow)" },
  ],
  DT: [
    { icon: "\uD83D\uDD0D", text: "Znajdz 5 ukrytych szczegolow w swoim pokoju, ktorych nigdy nie zauwazyles" },
    { icon: "\uD83D\uDD75\uFE0F", text: "Obserwuj ludzi w parku przez 10 min - co robia, czemu?" },
    { icon: "\uD83D\uDCF8", text: "Zrob 5 zdjec dziwnych/ciekawych rzeczy w otoczeniu" },
    { icon: "\uD83E\uDDEA", text: "Przeprowadz maly eksperyment domowy (np. co rozpuszcza sie w wodzie?)" },
    { icon: "\uD83D\uDCF0", text: "Przeczytaj artykul i znajdz 3 pytania, na ktore nie ma odpowiedzi" },
    { icon: "\uD83D\uDDDD\uFE0F", text: "Rozwiaz zagadke lub rebus - popros kogos o sprawdzenie" },
    { icon: "\uD83C\uDF3F", text: "Na spacerze zbierz 5 roznych lisci i sprobuj je rozpoznac" },
  ],
  MD: [
    { icon: "\uD83D\uDD4A\uFE0F", text: "Jesli ktos sie pokloci - zaproponuj spokojna rozmowe" },
    { icon: "\uD83C\uDFB2", text: "Zagraj w gre kooperacyjna z kims (gdzie wygracie razem)" },
    { icon: "\uD83D\uDCAC", text: "Zapytaj 3 osoby o ich opinie na jakis temat i podsumuj" },
    { icon: "\uD83E\uDD32", text: "Podziel sie czyms swoim z kims, kto tego potrzebuje" },
    { icon: "\uD83D\uDCDC", text: "Napisz traktat pokojowy - zasady dobrej zabawy w grupie" },
    { icon: "\uD83C\uDF0D", text: "Opowiedz komus ciekawostke o innym kraju lub kulturze" },
    { icon: "\uD83C\uDF88", text: "Zorganizuj wspolna zabawe, w ktorej nie ma przegranych" },
  ],
};
