/**
 * quizObrazkowy.js — tresc testu profilu na starcie gry.
 *
 * PO CO OSOBNY PLIK. To jest OSIEM TYSIECY ZNAKOW TRESCI, nie logiki: szesc
 * scenek, dwadziescia cztery odpowiedzi, opisy ilustracji i warianty wiekowe.
 * Siedzac w `onboarding.js` przykrywalo trasy i punktacje, a kazda poprawka
 * jednego podpisu wygladala w diffie jak zmiana w API. Tutaj zmienia sie
 * tresc, tam mechanika.
 *
 * Zrodlo prawdy dla decyzji: `docs/TEST_OBRAZKOWY.md` (format, punktacja,
 * pola profilu) i `docs/TEST_OBRAZKOWY_PANEL.md` (werdykt panelu z 14.09 —
 * to on kaze pytac o BOHATERA, wycina zloto z Q1, wymienia Q6 i przepisuje
 * `MD` ze Straznika Mostu na Skupienie).
 */
// QUIZ OBRAZKOWY v5 (zrodlo prawdy: docs/TEST_OBRAZKOWY.md + docs/TEST_OBRAZKOWY_PANEL.md).
//
// CO SIE ZMIENILO WZGLEDEM v4 (werdykt panelu, 2026-09-14):
//  1. Pytamy o BOHATERA, nie o dziecko. „Co robi twoj bohater" zamiast „co
//     robisz" zdejmuje presje grzecznej odpowiedzi — a dziecko, ktore w realu
//     stoi z boku, moze dac bohaterowi odwage, ktorej samo nie ma. To nie jest
//     klamstwo o sobie, tylko granie.
//  2. `MD` to SKUPIENIE, nie mediacja. Kazdy kafelek MD ma cicha czynnosc
//     z WIDOCZNYM SKUTKIEM w tym samym kadrze — bezruch bez skutku czyta sie
//     u szesciolatka jako „boje sie" albo „tu sie nic nie dzieje".
//  3. Q6 wymienione w calosci. „Ktos nowy stoi sam obok grupy" mialo cztery
//     odpowiedzi znaczace to samo, a dziecko realnie odstawione rozpoznawalo
//     siebie w postaci z boku. Teraz: utkniety woz — nikt nie jest wykluczony,
//     cztery role tak samo potrzebne, zadna nie jest ladniejsza moralnie.
//  4. Zero zlota i zero efektow na pojedynczym kafelku (Q1 „ze srodka bije
//     zlote swiatlo" bylo pomiarem blyszczenia, nie odwagi).
//  5. Osie EM/MD dostaly sprawstwo. Wczesniej dostawaly czynnosci
//     podporzadkowane (podaje, trzymam drugiemu, robie mostek), a LD/KR
//     ekspansje — to byl podzial po linii plci wpisany w architekture testu.
//  6. Warianty wiekowe: `wariant48` podmienia kafelek dla klas 4-8 tam, gdzie
//     scenka dla mlodszych czyta sie jako dziecinna (kredki -> piornik).
//     `tylko48` = kafelek znika w wersji trzykafelkowej dla klas 1-3.
//
// Punktacja bez zmian — pierscien ST-MD-EM-KR-DT-LD: glowna +3, sasiedzi +2,
// dalsze +1, przeciwienstwo 0 (9 pkt na odpowiedz). Kazdy typ jest „glowna"
// dokladnie 4 razy w 24 odpowiedziach. Ukryte kafelki: ST·MD·DT·EM·KR·LD —
// kazdy typ znika dokladnie raz, wiec wersja trzykafelkowa zostaje zbalansowana.
// TYP wybieramy z licznika main_picks, suma `scores` karmi wylacznie radar.
//
// PODPISY: czasownik w pierwszej osobie na poczatku, najwyzej trzy slowa,
// slowa z elementarza. Dziecko po pierwszym kafelku zna wzor i dalej skanuje
// pierwsze slowo zamiast czytac calosc.
//
// `text` zostaje jako tekst dla lektora NA DOTKNIECIE kafelka (nie do
// czytania z automatu — efekt swiezosci u 6-9-latkow wchodzilby wprost
// w cecha glowna, a przy losowanej kolejnosci roznie dla kazdego dziecka).
const PKT = {
  ST: { ST: 3, MD: 2, EM: 1, KR: 0, DT: 1, LD: 2 },
  MD: { ST: 2, MD: 3, EM: 2, KR: 1, DT: 0, LD: 1 },
  EM: { ST: 1, MD: 2, EM: 3, KR: 2, DT: 1, LD: 0 },
  KR: { ST: 0, MD: 1, EM: 2, KR: 3, DT: 2, LD: 1 },
  DT: { ST: 1, MD: 0, EM: 1, KR: 2, DT: 3, LD: 2 },
  LD: { ST: 2, MD: 1, EM: 0, KR: 1, DT: 2, LD: 3 },
};

export const ONBOARDING_QUIZ = [
  {
    question_id: "nq1",
    question: "Na polanie stoi zamknięta skrzynia. Co robi twój bohater?",
    answers: [
      { answer_id: "a", glowna: "ST", podpis: "Oglądam kłódkę", obraz: "/assets/onboarding/skrzynia-a.webp", text: "Kuca przy skrzyni i wodzi palcem po kłódce.", points: PKT.ST, tylko48: true },
      // Bęben zamiast rakiety: „statek kosmiczny” powtarzał się w Q1 i Q4,
      // a dymek myślowy to język książeczki obrazkowej.
      { answer_id: "b", glowna: "KR", podpis: "Robię z niej bęben", obraz: "/assets/onboarding/skrzynia-b.webp", text: "Klęka i uderza dłońmi w wieko — teraz to bęben.", points: PKT.KR },
      { answer_id: "c", glowna: "EM", podpis: "Wołam kogoś jeszcze", obraz: "/assets/onboarding/skrzynia-c.webp", text: "Trzyma dłoń na skrzyni i macha przez ramię do drugiej postaci.", points: PKT.EM },
      // Bez złota: kurz i jeden liść. Wieko ma być ciężkie, nie nagradzające.
      { answer_id: "d", glowna: "LD", podpis: "Unoszę wieko", obraz: "/assets/onboarding/skrzynia-d.webp", text: "Obiema rękami podnosi ciężkie wieko.", points: PKT.LD },
    ],
  },
  {
    question_id: "nq2",
    question: "Przez ścieżkę płynie strumyk. Jak twój bohater przejdzie?",
    // Dla klas 1-3 woda niesie realny ładunek lęku, a lęk zmienia wybór na
    // „bezpieczny” niezależnie od preferencji. Kłoda przenosi wszystkie cztery
    // cechy jeden do jednego.
    /* WARIANT DLA KLAS 1-3 ZAPARKOWANY. U mlodszych woda niesie realny ladunek
       leku, a lek zmienia wybor na „bezpieczny" niezaleznie od preferencji
       (werdykt socjologa) — stad kloda zamiast strumyka. Tresc wraca RAZEM
       z plikami `kloda-a..d`, bo inaczej pytanie mowiloby o kłodzie, a cztery
       ilustracje pokazywalyby strumyk.
       Dogenerowanie:  python scripts\\kafelki-onboarding.py kloda-a kloda-b kloda-c kloda-d
    pytanie13: "Przez ścieżkę leży przewrócona kłoda. Jak twój bohater przejdzie?", */
    answers: [
      { answer_id: "a", glowna: "MD", podpis: "Idę kamień po kamieniu", obraz: "/assets/onboarding/strumyk-a.webp", text: "Stoi pewnie na środkowym kamieniu, wzrok już na następnym.", points: PKT.MD, tylko48: true },
      { answer_id: "b", glowna: "DT", podpis: "Sprawdzam patykiem", obraz: "/assets/onboarding/strumyk-b.webp", text: "Kuca na brzegu i sprawdza patykiem, jak tu głęboko.", points: PKT.DT },
      { answer_id: "c", glowna: "KR", podpis: "Buduję mostek", obraz: "/assets/onboarding/strumyk-c.webp", text: "Układa deskę i trzy kamienie w poprzek.", points: PKT.KR },
      // Bez „pierwszy” (to porównanie) i bez postaci patrzącej z brzegu
      // (to scena przed publicznością).
      { answer_id: "d", glowna: "LD", podpis: "Przeskakuję", obraz: "/assets/onboarding/strumyk-d.webp", text: "Rozpędza się i przeskakuje na drugi brzeg.", points: PKT.LD },
    ],
  },
  {
    question_id: "nq3",
    // Druga postać ma NEUTRALNĄ minę i już sama zbiera. Zasmucona robiła
    // z kafelka EM „odpowiedź dobrego dziecka”, a z pozostałych trzech
    // „zostawiłem kogoś smutnego”.
    question: "Komuś rozsypało się pudełko kredek. Co robi twój bohater?",
    pytanie48: "Komuś rozsypał się piórnik. Co robi twój bohater?",
    answers: [
      { answer_id: "a", glowna: "EM", podpis: "Podaję kredkę", wariant48: { podpis: "Podaję długopis", text: "Kuca obok i podaje długopis, którym tamten przed chwilą pisał." }, obraz: "/assets/onboarding/kredki-a.webp", text: "Kuca obok i podaje kredkę w tym kolorze, którym tamten przed chwilą rysował.", points: PKT.EM },
      { answer_id: "b", glowna: "ST", podpis: "Układam po kolorach", wariant48: { podpis: "Układam po kolei" }, obraz: "/assets/onboarding/kredki-b.webp", text: "Zbiera i układa wszystko w równym rządku.", points: PKT.ST },
      // Skupienie: jedna rzecz do końca w ruchu dookoła. Nie dotyka drugiej
      // osoby, więc nie koliduje z EM.
      { answer_id: "c", glowna: "MD", podpis: "Zbieram jedną po jednej", obraz: "/assets/onboarding/kredki-c.webp", text: "Klęka i wkłada je pojedynczo, dookoła wszyscy biegają.", points: PKT.MD },
      { answer_id: "d", glowna: "DT", podpis: "Szukam pod ławką", obraz: "/assets/onboarding/kredki-d.webp", text: "Zagląda pod ławkę — na pewno któraś się tam zakręciła.", points: PKT.DT, tylko48: true },
    ],
  },
  {
    question_id: "nq4",
    question: "Twój bohater dostaje wielkie pudło. Co z nim zrobi?",
    answers: [
      { answer_id: "a", glowna: "KR", podpis: "Zmieniam w rakietę", obraz: "/assets/onboarding/pudlo-a.webp", text: "Maluje je, wycina okienko i dokleja skrzydła.", points: PKT.KR },
      { answer_id: "b", glowna: "DT", podpis: "Oglądam przez lupę", obraz: "/assets/onboarding/pudlo-b.webp", text: "Stawia je jak stolik i ogląda kamyk przez lupę.", points: PKT.DT },
      // Schronienie z zaproszeniem zamiast laurki. Domku dla misia
      // z wyciętym serduszkiem trzynastolatek nie kliknie — a to jest
      // kafelek widoczny WYŁĄCZNIE dla starszych.
      { answer_id: "c", glowna: "EM", podpis: "Budka dla dwojga", obraz: "/assets/onboarding/pudlo-c.webp", text: "Kładzie je na boku, wkłada dwie poduszki i latarkę, i zaprasza kogoś do środka.", points: PKT.EM, tylko48: true },
      // Sanki zamiast tarczy i wieży: jeden przedmiot zamiast trzech, ruch
      // zamiast rycerskiej otoczki, i kafelek przestaje być „dla chłopców”.
      { answer_id: "d", glowna: "LD", podpis: "Robię z niego sanki", obraz: "/assets/onboarding/pudlo-d.webp", text: "Rozkłada karton i zjeżdża na nim z trawiastej górki.", points: PKT.LD },
    ],
  },
  {
    question_id: "nq5",
    // Słowo „tropy” znika z całego ekranu — pytanie mówiło „tropy”,
    // a odpowiedzi „ślady”, a sam „trop” to słownictwo z czwartej klasy.
    question: "Na ziemi widać ślady łapek. Co robi twój bohater?",
    answers: [
      { answer_id: "a", glowna: "DT", podpis: "Idę po śladach", obraz: "/assets/onboarding/tropy-a.webp", text: "Idzie wzdłuż śladów i patrzy, dokąd prowadzą.", points: PKT.DT },
      { answer_id: "b", glowna: "ST", podpis: "Rysuję mapę", obraz: "/assets/onboarding/tropy-b.webp", text: "Rysuje patykiem plan: ślady, drzewo, strzałka.", points: PKT.ST },
      // Odcisk dłoni to laurka z przedszkola, a „wzór-zwierzę” to dwa pomysły
      // w jednym kadrze — nieczytelne bez podpisu.
      { answer_id: "c", glowna: "KR", podpis: "Robię własne ślady", obraz: "/assets/onboarding/tropy-c.webp", text: "Przeskakuje po błocie obok, zostawiając drugi, własny rządek.", points: PKT.KR, tylko48: true },
      // Sarna BLISKO i duża: związek „zamarłem → podeszła” musi być widoczny
      // w jednym kadrze, inaczej Skupienie nie dociera.
      { answer_id: "d", glowna: "MD", podpis: "Stoję cicho", obraz: "/assets/onboarding/tropy-d.webp", text: "Zastyga za krzakiem — sarna jest już tuż obok.", points: PKT.MD },
    ],
  },
  {
    question_id: "nq6",
    // NOWE PYTANIE. Poprzednie („ktoś nowy stoi sam obok bawiącej się grupy”)
    // miało cztery odpowiedzi znaczące to samo — włączam nowego — więc
    // mierzyło znajomość normy, nie dziecko. Do tego dziecko, które samo jest
    // nowe albo z placówki, rozpoznawało siebie w postaci stojącej z boku.
    // Tutaj nikt nie jest wykluczony i wszystkie cztery role są tak samo
    // potrzebne: dziecko wybiera rolę, nie cnotę.
    // Cztery gotowe ilustracje pokazują cztery równie potrzebne role przy tym
    // samym wozie. Komplet przełącza pytanie na spójną siatkę obrazkową.
    question: "Na ścieżce utknął wóz pełen koszy. Kilka osób próbuje go ruszyć. Co robi twój bohater?",
    pytanie13: "Na ścieżce utknął wóz. Co robi twój bohater?",
    answers: [
      { answer_id: "a", glowna: "EM", podpis: "Zmieniam zmęczonego", obraz: "/assets/onboarding/woz-a.webp", text: "Wchodzi na miejsce kogoś, kto opadł z sił, i chwyta za linę.", points: PKT.EM },
      { answer_id: "b", glowna: "LD", podpis: "Pcham pierwszy", obraz: "/assets/onboarding/woz-b.webp", text: "Opiera ramię o burtę, zanim reszta zdąży się zebrać.", points: PKT.LD, tylko48: true },
      { answer_id: "c", glowna: "ST", podpis: "Ustawiam po kolei", obraz: "/assets/onboarding/woz-c.webp", text: "Pokazuje każdemu jego miejsce przy linie.", points: PKT.ST },
      // Skupienie użyteczne, a nie bierne: zauważenie kamienia rozwiązuje sprawę.
      { answer_id: "d", glowna: "MD", podpis: "Widzę, gdzie blokuje", obraz: "/assets/onboarding/woz-d.webp", text: "Kuca przy kole i wpatruje się w zaklinowany kamień.", points: PKT.MD },
    ],
  },
];
