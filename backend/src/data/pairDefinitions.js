/**
 * pairDefinitions — 15 par archetypow ("Rozdarta Mapa").
 * Kazdy uczen w parze widzi tylko SWOJE slowo (A lub B) + krotka podpowiedz archetypu partnera.
 * Po znalezieniu sie razem wprowadzaja wspolne haslo -> aktywuje zadanie z 2 rolami.
 *
 * Mapowanie archetypow:
 *   DT = Detektyw (Badacz w feedu)
 *   ST = Strateg
 *   LD = Lider
 *   EM = Empata
 *   KR = Kreator
 *   MD = Strażnik (Mediator w naszych kodach)
 */

export const PAIR_DEFINITIONS = [
  {
    id: 1,
    archetype_a: "DT", word_a: "Złota",
    archetype_b: "ST", word_b: "Mapa",
    full_keyword: "Złota Mapa",
    task_title: "Wyspy bezpiecznego przejścia",
    task_body: "Przeprawcie się z jednego końca sali na drugi w najkrótszy sposób, stąpając tylko po wyznaczonych „wyspach” (np. określonych płytkach, kartkach, cieniach).",
    instructions_a: "Wyszukaj i wskaż wszystkie bezpieczne punkty, na których można stanąć.",
    instructions_b: "Zaplanuj dokładną trasę i kolejność kroków, abyście dotarli do celu bezbłędnie.",
  },
  {
    id: 2,
    archetype_a: "DT", word_a: "Tajny",
    archetype_b: "LD", word_b: "Znak",
    full_keyword: "Tajny Znak",
    task_title: "Wspólny okrzyk",
    task_body: "Odszukajcie w pobliżu inną parę i namówcie ich do wspólnego, jednoczesnego podskoku lub okrzyku.",
    instructions_a: "Twoim zadaniem jest obserwacja i namierzenie pary, która nie jest aktualnie zajęta swoim zadaniem.",
    instructions_b: "Twoim zadaniem jest podejść, przejąć inicjatywę i przekonać ich do wspólnej akcji.",
  },
  {
    id: 3,
    archetype_a: "DT", word_a: "Ciche",
    archetype_b: "EM", word_b: "Słowo",
    full_keyword: "Ciche Słowo",
    task_title: "Zagubiony detal",
    task_body: "Znajdźcie w przestrzeni dookoła Was jeden obiekt, który wygląda na „porzucony” lub „samotny”, i odłóżcie go na właściwe miejsce.",
    instructions_a: "Przeszukaj dokładnie teren, by odnaleźć ten jeden, zagubiony detal.",
    instructions_b: "Zadbaj o to, aby ten przedmiot trafił tam, gdzie będzie wyglądał dobrze i „bezpiecznie”.",
  },
  {
    id: 4,
    archetype_a: "DT", word_a: "Nowy",
    archetype_b: "KR", word_b: "Kolor",
    full_keyword: "Nowy Kolor",
    task_title: "Kompozycja z trzech faktur",
    task_body: "Znajdźcie 3 małe, różniące się od siebie elementy otoczenia (np. liść, kamyk, kapselek) i ułóżcie z nich małą kompozycję artystyczną.",
    instructions_a: "Musisz wytropić i zdobyć fizyczne materiały o ciekawych fakturach.",
    instructions_b: "Musisz połączyć zebrane elementy w piękny, symboliczny układ.",
  },
  {
    id: 5,
    archetype_a: "DT", word_a: "Pewny",
    archetype_b: "MD", word_b: "Szlak",
    full_keyword: "Pewny Szlak",
    task_title: "Strażnicy ścieżki",
    task_body: "Zbadajcie najbliższą okolicę i wskażcie jedno miejsce, o które ktoś w pośpiechu mógłby się potknąć lub zahaczyć.",
    instructions_a: "Wyszukaj potencjalne zagrożenie w przestrzeni wokół Was.",
    instructions_b: "Wymyśl i zrealizuj sposób (np. ustawiając coś obok), aby zabezpieczyć lub wyraźnie oznaczyć to miejsce dla innych.",
  },
  {
    id: 6,
    archetype_a: "ST", word_a: "Wielki",
    archetype_b: "LD", word_b: "Plan",
    full_keyword: "Wielki Plan",
    task_title: "Niemy dyrygent",
    task_body: "Bez używania słów, tylko za pomocą gestów, ustawcie 3 dowolne osoby z innej grupy w rzędzie.",
    instructions_a: "Ułóż logiczny i zrozumiały system znaków (gestów), którego użyjecie.",
    instructions_b: "Stań na czele i użyj tych znaków, aby skutecznie i z pewnością siebie pokierować ludźmi.",
  },
  {
    id: 7,
    archetype_a: "ST", word_a: "Dobry",
    archetype_b: "EM", word_b: "Krok",
    full_keyword: "Dobry Krok",
    task_title: "Idealny moment komplementu",
    task_body: "Wybierzcie kogoś z sali. Wymyślcie dla tej osoby szczery komplement i przekażcie go w idealnym momencie.",
    instructions_a: "Przeanalizuj sytuację i wskaż dokładny moment, w którym najlepiej będzie podejść do tej osoby.",
    instructions_b: "Sformułuj słowa, które sprawią tej osobie największą radość i przekaż je z uśmiechem.",
  },
  {
    id: 8,
    archetype_a: "ST", word_a: "Bystry",
    archetype_b: "KR", word_b: "Umysł",
    full_keyword: "Bystry Umysł",
    task_title: "Żywa maszyna",
    task_body: "Stwórzcie z własnych ciał lub ubrań „maszynę” składającą się z dwóch ruchomych części.",
    instructions_a: "Zaprojektuj mechanizm – jaka jest zasada działania Waszej maszyny i jak części na siebie wpływają.",
    instructions_b: "Zadbaj o to, by maszyna wyglądała oryginalnie i wykonuj ruchy w sposób teatralny.",
  },
  {
    id: 9,
    archetype_a: "ST", word_a: "Mocna",
    archetype_b: "MD", word_b: "Tarcza",
    full_keyword: "Mocna Tarcza",
    task_title: "Tajny szyfr drogi",
    task_body: "Ustalcie tajny znak dłonią (szyfr), którego będziecie używać, by dać sobie znać, że jesteście gotowi do dalszej drogi.",
    instructions_a: "Wymyśl system – jak działa Wasz znak i dlaczego trudno go zauważyć innym.",
    instructions_b: "Pilnuj, by znak pozostał tajemnicą i używaj go tylko wtedy, gdy jest w pełni bezpiecznie.",
  },
  {
    id: 10,
    archetype_a: "LD", word_a: "Odważne",
    archetype_b: "EM", word_b: "Serce",
    full_keyword: "Odważne Serce",
    task_title: "Wyciągnięta dłoń",
    task_body: "Zaoferujcie swoją pomoc innej parze w rozwiązywaniu ich zadania lub zapytajcie, jak się bawią.",
    instructions_a: "Miej odwagę, by przerwać własne zajęcie, wyjść przed szereg i zainicjować rozmowę z inną grupą.",
    instructions_b: "Poprowadź rozmowę tak, by inni czuli się wysłuchani, docenieni i wiedzieli, że Wasza pomoc jest szczera.",
  },
  {
    id: 11,
    archetype_a: "LD", word_a: "Głośny",
    archetype_b: "KR", word_b: "Śpiew",
    full_keyword: "Głośny Śpiew",
    task_title: "Unikalna piątka",
    task_body: "Wymyślcie własny, unikalny gest przybicia „piątki” na zakończenie wspólnej misji.",
    instructions_a: "Nadaj tempo, zdecyduj, kiedy testujecie gest i zadbaj o dynamikę ruchu.",
    instructions_b: "Skup się na formie – spraw, by gest był widowiskowy, nietypowy i zapadał w pamięć.",
  },
  {
    id: 12,
    archetype_a: "LD", word_a: "Jasna",
    archetype_b: "MD", word_b: "Droga",
    full_keyword: "Jasna Droga",
    task_title: "Strefa ciszy",
    task_body: "Wyznaczcie strefę „ciszy” wielkości jednego kroku. Przez 30 sekund pilnujcie, by nikt do niej nie wszedł.",
    instructions_a: "Poinformuj innych głośno i wyraźnie o Waszej nowej strefie i zasadach.",
    instructions_b: "Pilnuj wyznaczonej granicy i konsekwentnie, ale spokojnie strzeż wyznaczonego obszaru.",
  },
  {
    id: 13,
    archetype_a: "EM", word_a: "Ciepły",
    archetype_b: "KR", word_b: "Obraz",
    full_keyword: "Ciepły Obraz",
    task_title: "Pomnik spokoju i radości",
    task_body: "Stwórzcie wspólną pozę (pomnik), która bez użycia słów wyraża uczucie spokoju i radości.",
    instructions_a: "Wczuj się w emocję i zdecyduj, co musi wyrażać Wasza postawa (np. otwarte ramiona, uśmiech).",
    instructions_b: "Wymyśl kompozycję Waszych ciał, by pomnik wyglądał jak z prawdziwej galerii sztuki.",
  },
  {
    id: 14,
    archetype_a: "EM", word_a: "Czuły",
    archetype_b: "MD", word_b: "Mur",
    full_keyword: "Czuły Mur",
    task_title: "Tarcza wokół skarbu",
    task_body: "Znajdźcie najmniejszy przedmiot na podłodze (kamyk, listek) i stwórzcie wokół niego szczelną „tarczę” z Waszych rąk.",
    instructions_a: "Pomyśl o tym przedmiocie z czułością i wskaż go jako coś, co wymaga natychmiastowej ochrony.",
    instructions_b: "Użyj swojej fizyczności, by zbudować silną i niezachwianą zaporę.",
  },
  {
    id: 15,
    archetype_a: "KR", word_a: "Trwała",
    archetype_b: "MD", word_b: "Wieża",
    full_keyword: "Trwała Wieża",
    task_title: "Wieża wyobraźni",
    task_body: "Zbudujcie małą wieżę z 4 dowolnych przedmiotów. Musi być wysoka, ale nie może się zawalić, gdy ktoś obok niej przejdzie.",
    instructions_a: "Użyj wyobraźni, by połączyć niepasujące do siebie elementy w oryginalną budowlę.",
    instructions_b: "Odpowiadasz za fundament i prawidła fizyki – upewnij się, że wizja partnera nie runie pod własnym ciężarem.",
  },
];

/** Normalizacja hasla do porownania (case-insensitive, bez nadmiarowych spacji, bez polskich znakow opcjonalnie). */
export function normalizeKeyword(text) {
  if (!text) return "";
  return String(text)
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // usun akcenty
}

/** Mapa: znormalizowane full_keyword -> definicja. */
export const KEYWORD_INDEX = new Map(
  PAIR_DEFINITIONS.map((p) => [normalizeKeyword(p.full_keyword), p])
);

/** Znajdz definicje po haslu (dowolna wielkosc liter, polskie znaki tolerowane). */
export function findPairByKeyword(text) {
  return KEYWORD_INDEX.get(normalizeKeyword(text)) || null;
}
