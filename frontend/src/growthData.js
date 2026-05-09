// Growth tips per profile
export const GROWTH_TIPS = {
  EM: {
    desc: "Empatia to Twoja siła — potrafisz czuć to, co inni. Oto jak ją rozwijać dalej:",
    tips: [
      "Codziennie zapytaj kogoś bliskiego: jak się dziś czujesz? I słuchaj uważnie",
      "Narysuj komiks o postaci, która pomaga komuś smutnemu",
      "Kiedy ktoś jest zły, spróbuj zgadnąć dlaczego, zanim ocenisz",
      "Prowadź dziennik uczuć — zapisuj co czułeś i dlaczego",
    ],
  },
  ST: {
    desc: "Strategiczne myślenie to Twój atut — planujesz i analizujesz jak mistrz!",
    tips: [
      "Graj w gry planszowe wymagające planowania (szachy, Catan, Blokus)",
      "Przed zadaniem domowym zrób plan: co, jak i w jakiej kolejności",
      "Rozwiązuj zagadki logiczne lub łamigłówki (Sudoku, labirynty)",
      "Wymyśl 3 różne rozwiązania jednego problemu i wybierz najlepsze",
    ],
  },
  KR: {
    desc: "Kreatywność to Twoja moc — widzisz świat inaczej niż inni!",
    tips: [
      "Codziennie narysuj lub stwórz coś nowego — nawet małego",
      "Wymyśl alternatywne zakończenie ulubionej bajki",
      "Zbuduj coś z materiałów znalezionych w domu (karton, patyczki)",
      "Prowadź zeszyt pomysłów — zapisuj każdy szalony pomysł",
    ],
  },
  LD: {
    desc: "Liderstwo to Twoja natura — inspirujesz innych do działania!",
    tips: [
      "Zaproponuj zabawę w grupie i zorganizuj zasady",
      "Kiedy kolega ma problem, zaproponuj pomoc zanim poprosi",
      "Podejmuj decyzje, ale pytaj innych o ich zdanie",
      "Prowadź małe projekty — np. zorganizuj piknik lub grę podwórkową",
    ],
  },
  DT: {
    desc: "Umysł detektywa to Twój dar — dostrzegasz to, co inni pomijają!",
    tips: [
      "Graj w szukaj różnic lub gry obserwacyjne",
      "Podczas spaceru zanotuj 5 rzeczy, których wcześniej nie zauważyłeś",
      "Zadawaj pytania: dlaczego? — nawet wobec rzeczy oczywistych",
      "Prowadź dziennik obserwacji przyrody lub otoczenia",
    ],
  },
  MD: {
    desc: "Mediacja to Twój talent — potrafisz łączyć ludzi i gasić konflikty!",
    tips: [
      "Kiedy dwoje kolegów się kłóci, spróbuj wysłuchać obu stron",
      "Ćwicz zdania typu: rozumiem, że czujesz… — to buduje mosty",
      "Zaproponuj kompromis w następnej kłótni o zabawkę lub grę",
      "Graj w gry współpracy (np. Pandemic, Hanabi) zamiast rywalizacji",
    ],
  },
};

// Daily missions per profile
export const DAILY_MISSIONS = {
  EM: [
    { icon: "\uD83D\uDC8C", text: "Napisz miłą wiadomość do kogoś, kto miał ciężki dzień" },
    { icon: "\uD83E\uDD17", text: "Przytul 3 osoby z rodziny i powiedz im coś miłego" },
    { icon: "\uD83C\uDFAD", text: "Odegraj scenkę, w której pocieszasz smutną postać" },
    { icon: "\uD83D\uDCD6", text: "Przeczytaj opowiadanie i opisz uczucia głównego bohatera" },
    { icon: "\uD83C\uDF08", text: "Narysuj mapę swoich dzisiejszych emocji (rano, po szkole, wieczorem)" },
    { icon: "\uD83D\uDC42", text: "Przez 5 minut słuchaj kogoś bez przerywania — potem powiedz co zrozumiałeś" },
    { icon: "\uD83C\uDFA8", text: "Namaluj portret kogoś bliskiego i podaruj mu go" },
  ],
  ST: [
    { icon: "\uD83D\uDDFA\uFE0F", text: "Zaplanuj idealny weekend — z harmonogramem i planem B" },
    { icon: "\uD83E\uDDE9", text: "Rozwiąż 3 zagadki logiczne lub łamigłówki" },
    { icon: "\uD83D\uDCCA", text: "Policz coś w domu (książki, rośliny) i zrób wykres" },
    { icon: "\uD83C\uDFAF", text: "Wyznacz 3 cele na dziś i odznaczaj je po kolei" },
    { icon: "\uD83C\uDFD7\uFE0F", text: "Zbuduj z klocków wieżę tak wysoko jak się da — z planem!" },
    { icon: "\uD83D\uDD22", text: "Wymyśl grę liczbową i naucz jej kogoś" },
    { icon: "\uD83D\uDCDD", text: "Napisz listę za i przeciw przed podjęciem następnej decyzji" },
  ],
  KR: [
    { icon: "\u270F\uFE0F", text: "Narysuj stwora, który nie istnieje — nadaj mu imię i historię" },
    { icon: "\uD83C\uDFB5", text: "Wymyśl piosenkę o dzisiejszym dniu (choćby 4 linijki)" },
    { icon: "\uD83D\uDCE6", text: "Zbuduj coś niesamowitego z kartonów i taśmy klejącej" },
    { icon: "\uD83C\uDF00", text: "Narysuj abstrakcyjny rysunek tylko z zamkniętymi oczami" },
    { icon: "\uD83D\uDCDD", text: "Napisz miniaturową bajkę (5 zdań) o latającym kocie" },
    { icon: "\uD83C\uDFAD", text: "Wymyśl nową postać do gry i opisz jej supermoce" },
    { icon: "\uD83D\uDD8C\uFE0F", text: "Pomaluj kamień, który znajdziesz — niech stanie się amuletem" },
  ],
  LD: [
    { icon: "\uD83D\uDCE2", text: "Zorganizuj rodzinną grę planszową i wyjaśnij zasady" },
    { icon: "\uD83E\uDD1D", text: "Pomóż młodszemu dziecku w czymś trudnym" },
    { icon: "\uD83D\uDCCB", text: "Zaproponuj plan dnia dla całej rodziny" },
    { icon: "\uD83C\uDFC6", text: "Pochwal 3 osoby dzisiaj za coś konkretnego" },
    { icon: "\uD83C\uDFAA", text: "Wymyśl i zorganizuj mini-turniej w ulubioną grę" },
    { icon: "\uD83E\uDDED", text: "Poprowadź rodzinny spacer — Ty decydujesz o trasie" },
    { icon: "\uD83D\uDCA1", text: "Zaproponuj rozwiązanie problemu domowego (np. bałagan, plan obiadów)" },
  ],
  DT: [
    { icon: "\uD83D\uDD0D", text: "Znajdź 5 ukrytych szczegółów w swoim pokoju, których nigdy nie zauważyłeś" },
    { icon: "\uD83D\uDD75\uFE0F", text: "Obserwuj ludzi w parku przez 10 min — co robią, czemu?" },
    { icon: "\uD83D\uDCF8", text: "Zrób 5 zdjęć dziwnych/ciekawych rzeczy w otoczeniu" },
    { icon: "\uD83E\uDDEA", text: "Przeprowadź mały eksperyment domowy (np. co rozpuszcza się w wodzie?)" },
    { icon: "\uD83D\uDCF0", text: "Przeczytaj artykuł i znajdź 3 pytania, na które nie ma odpowiedzi" },
    { icon: "\uD83D\uDDDD\uFE0F", text: "Rozwiąż zagadkę lub rebus — poproś kogoś o sprawdzenie" },
    { icon: "\uD83C\uDF3F", text: "Na spacerze zbierz 5 różnych liści i spróbuj je rozpoznać" },
  ],
  MD: [
    { icon: "\uD83D\uDD4A\uFE0F", text: "Jeśli ktoś się pokłóci — zaproponuj spokojną rozmowę" },
    { icon: "\uD83C\uDFB2", text: "Zagraj w grę kooperacyjną z kimś (gdzie wygracie razem)" },
    { icon: "\uD83D\uDCAC", text: "Zapytaj 3 osoby o ich opinie na jakiś temat i podsumuj" },
    { icon: "\uD83E\uDD32", text: "Podziel się czymś swoim z kimś, kto tego potrzebuje" },
    { icon: "\uD83D\uDCDC", text: "Napisz traktat pokojowy — zasady dobrej zabawy w grupie" },
    { icon: "\uD83C\uDF0D", text: "Opowiedz komuś ciekawostkę o innym kraju lub kulturze" },
    { icon: "\uD83C\uDF88", text: "Zorganizuj wspólną zabawę, w której nie ma przegranych" },
  ],
};
