/*!
 * EwolucJA — gra edukacyjna dla dzieci.
 * © 2026 Amitiel Angelisme. Wszelkie prawa zastrzeżone.
 * Powstało w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”.
 * Prawa autorskie należą do autora. Pełna nota: LICENSE.
 */
// Zadania opracowane na podstawie mentorTaskLibrary i poradyDnia.
// Preferencje dobierają kolejność, nigdy ocenę ani trwały typ dziecka.
export const OSIE = {
  ciekawosc: 'Odkrywać', tworzenie: 'Tworzyć', wspolpraca: 'Działać razem',
  odwaga: 'Próbować nowego', wytrwalosc: 'Szukać innego sposobu',
};
export const PYTANIA = [
  { pytanie: 'Za zakrętem jest mała pracownia. Co chcesz zrobić?', opcje: [
    ['ciekawosc', 'Sprawdzić, co kryje się w środku'], ['tworzenie', 'Zbudować coś własnego'],
    ['wspolpraca', 'Zaprosić kogoś do wspólnej zabawy']] },
  { pytanie: 'Twój pomysł jeszcze nie działa. Co wybierasz?', opcje: [
    ['wytrwalosc', 'Zmienić jeden element i sprawdzić'], ['odwaga', 'Spróbować czegoś zupełnie nowego'],
    ['wspolpraca', 'Poszukać pomysłu razem z kimś']] },
];
export const PRZYGODY = [
  { id:'trzy-sekrety', os:'ciekawosc', tytul:'Sekrety małego listka',
    trop:'Na naszej polanie każdy liść wygląda trochę inaczej. Jakie tajemnice kryją liście w twoim świecie?',
    cel:'Obserwowanie i porównywanie cech przedmiotów.', zrodlo:'DT-TASK-001; porada zielony-trop',
    pytanie:'Dwa liście są zielone. Co jeszcze możesz porównać?',
    opcje:['Ich kształt i brzegi', 'Tylko kolor'], poprawna:0,
    wyjasnienie:'Liście mogą różnić się kształtem, wielkością i brzegami, nawet jeśli mają ten sam kolor.',
    mlodsi:['Znajdź w otoczeniu roślinę albo jej obrazek.', 'Obejrzyj dwa liście. Nie musisz ich zrywać.', 'Zauważ jedną różnicę. Możesz ją pokazać lub opowiedzieć.'],
    starsi:['Porównaj dwa liście rośliny lub liście na ilustracji.', 'Wybierz dwie cechy: kształt, brzeg, wielkość albo układ żyłek.', 'Opowiedz, co jest podobne, a co inne.'],
    slad:['Zauważyłem inny kształt', 'Zauważyłem inną wielkość', 'Zauważyłem coś innego'],
    rozmowa:'Co zauważyłeś dopiero przy drugim spojrzeniu?' },
  { id:'papierowy-most', os:'tworzenie', tytul:'Pomysł z jednej kartki',
    trop:'Mam pomysł na małą pracownię. Czy zwykła kartka może stać się mocniejsza, gdy zmienisz jej kształt?',
    cel:'Porównanie sztywności papieru po zmianie kształtu.', zrodlo:'mentorTaskLibrary: tworzenie, konstrukcje',
    pytanie:'Jak porównać płaską i złożoną kartkę?', opcje:['Zmienić wszystko naraz', 'Użyć tego samego lekkiego przedmiotu'], poprawna:1,
    wyjasnienie:'Ten sam lekki przedmiot pozwala porównać obie kartki. Zmieniasz tylko sposób złożenia.',
    mlodsi:['Weź kartkę i połóż ją między dwiema książkami na stole.', 'Sprawdź, czy utrzyma gumkę. Potem złóż kartkę w harmonijkę.', 'Spróbuj z tą samą gumką. Co się zmieniło?'],
    starsi:['Zbuduj papierowy most między dwiema książkami na stole.', 'Porównaj płaską kartkę z kartką złożoną w harmonijkę. Zachowaj ten sam odstęp i lekki przedmiot.', 'Zanotuj lub opowiedz wynik. Wynik inny niż oczekiwania też jest odkryciem.'],
    slad:['Złożona kartka utrzymała więcej', 'Obie zachowały się podobnie', 'Mam inny wynik'],
    rozmowa:'Co zmieniłeś w swojej konstrukcji?' },
  { id:'wspolny-rytm', os:'wspolpraca', tytul:'Rytm dla dwóch osób',
    trop:'Liście poruszają się razem. Ciekawe, czy uda się wam wymyślić wspólny rytm.',
    cel:'Słuchanie, naprzemienność i wspólne ustalanie reguły.', zrodlo:'mentorTaskLibrary: współpraca; dawne zadania muzyczne',
    pytanie:'Jak zacząć wspólne tworzenie rytmu?', opcje:['Ustalić, kto zaczyna, i zamieniać się rolami', 'Oboje przez cały czas nadawać inny rytm'], poprawna:0,
    wyjasnienie:'Zmiana ról daje każdej osobie czas na słuchanie i na własny pomysł.',
    mlodsi:['Zaproś znaną ci osobę do zabawy.', 'Wystukaj dłonią krótki rytm. Druga osoba go powtarza.', 'Zamieńcie się rolami. Jeśli jesteś teraz sam, wystukaj i powtórz swój rytm.'],
    starsi:['Zaproś znaną osobę i ustalcie zasadę zmiany ról.', 'Każde z was dodaje jeden fragment rytmu, a drugie go powtarza.', 'Zamieńcie się rolami. W pojedynkę możesz najpierw ułożyć dwa fragmenty.'],
    slad:['Zamieniliśmy się rolami', 'Wymyśliłem rytm samodzielnie', 'Spróbowaliśmy innego sposobu'],
    rozmowa:'Co pomogło wam usłyszeć pomysł drugiej osoby?' },
  { id:'nowa-proba', os:'odwaga', tytul:'Mały pierwszy krok',
    trop:'Nowy pęd zaczyna od małego ruchu. Jaki niewielki pomysł chcesz dziś wypróbować?',
    cel:'Wybór wykonalnego pierwszego kroku i proszenie o wsparcie.', zrodlo:'mentorTaskLibrary: odwaga; pierwszy krok',
    pytanie:'Od czego zacząć nowy, duży pomysł?', opcje:['Od małego kroku, który mogę teraz wykonać', 'Od zrobienia wszystkiego naraz'], poprawna:0,
    wyjasnienie:'Mały krok pozwala poznać zadanie. Można poprosić kogoś bliskiego o pomoc.',
    mlodsi:['Wybierz nowy wzór do narysowania lub figurę do ułożenia z klocków.', 'Wykonaj tylko pierwszy fragment.', 'Zauważ, co już udało się rozpocząć. Możesz poprosić o pomoc.'],
    starsi:['Wybierz bezpieczny mały projekt: rysunek, konstrukcję lub zagadkę.', 'Nazwij pierwszy krok i wykonaj go poza ekranem.', 'Zdecyduj, czego potrzebujesz do kolejnego kroku.'],
    slad:['Zacząłem od małego kroku', 'Spróbowałem z pomocą', 'Zmieniłem pierwszy pomysł'],
    rozmowa:'Co sprawiło, że łatwiej było zacząć?' },
  { id:'drugi-sposob', os:'wytrwalosc', tytul:'Jeszcze jeden sposób',
    trop:'Pęd szuka drogi do światła. Przyda mu się pomysł, który można poprawiać po każdej próbie.',
    cel:'Zmiana jednej cechy rozwiązania i porównanie efektu.', zrodlo:'mentorTaskLibrary: wytrwałość i budowanie',
    pytanie:'Wieża się przewraca. Co warto sprawdzić?', opcje:['Dokładnie to samo bez żadnej zmiany', 'Szerszą podstawę'], poprawna:1,
    wyjasnienie:'Szersza podstawa może pomóc wieży utrzymać równowagę. Sprawdź, co zmienia jedna poprawka.',
    mlodsi:['Ułóż małą wieżę z klocków albo papierowych kubków na stole.', 'Zmień jej podstawę.', 'Porównaj obie wersje. Nie trzeba budować wysoko.'],
    starsi:['Zbuduj niską konstrukcję z dostępnych lekkich elementów.', 'Zmień tylko podstawę lub ułożenie jednego elementu.', 'Porównaj stabilność. Opowiedz, czy zmiana pomogła.'],
    slad:['Zmieniłem podstawę', 'Znalazłem inne rozwiązanie', 'Moja próba dała inny wynik'],
    rozmowa:'Co podpowiedziała ci pierwsza próba?' },
  { id:'mapa-dzwiekow', os:'ciekawosc', tytul:'Co słychać za horyzontem?',
    trop:'Na planecie szeleści trawa. Jakie dźwięki tworzą mapę twojego otoczenia?',
    cel:'Uważna obserwacja i odróżnianie obserwacji od przypuszczenia.', zrodlo:'DT-TASK-006',
    pytanie:'Słyszysz szelest, ale nie widzisz jego źródła. Co wiesz?', opcje:['Na pewno jest tam ptak', 'Słyszę szelest; źródło mogę dopiero sprawdzić'], poprawna:1,
    wyjasnienie:'Dźwięk jest obserwacją. Pomysł o jego źródle jest przypuszczeniem, które można sprawdzić.',
    mlodsi:['Zostań w bezpiecznym miejscu i posłuchaj otoczenia.', 'Zauważ dwa różne dźwięki.', 'Pokaż ich kierunek lub je opowiedz. Możesz zamiast tego zauważyć dwa ruchy za oknem.'],
    starsi:['Wybierz bezpieczne miejsce i zauważ trzy dźwięki lub ruchy.', 'Oddziel to, co zauważasz, od tego, czego się domyślasz.', 'Narysuj małą mapę albo opowiedz swoje obserwacje.'],
    slad:['Zauważyłem dwa dźwięki', 'Obserwowałem ruch zamiast dźwięku', 'Sprawdziłem swoje przypuszczenie'],
    rozmowa:'Co wiesz na pewno, a czego się domyślasz?' },
  { id:'pytanie-do-bliskiego', os:'wspolpraca', tytul:'Pytanie, które otwiera rozmowę',
    trop:'Fasola sięga coraz dalej. Ciekawe, czego ktoś bliski nauczył się dzięki własnej próbie.',
    cel:'Formułowanie pytania i uważne słuchanie.', zrodlo:'DT-TASK-003',
    pytanie:'Co pomaga poznać czyjąś historię?', opcje:['Zapytać i zostawić czas na odpowiedź', 'Zgadnąć odpowiedź za tę osobę'], poprawna:0,
    wyjasnienie:'Otwarte pytanie daje rozmówcy miejsce na własną historię. Możesz dopytać o coś, co cię zainteresowało.',
    mlodsi:['Zapytaj znanego dorosłego: czego lubiłeś się uczyć jako dziecko?', 'Posłuchaj odpowiedzi i wybierz jeden ciekawy szczegół.', 'Jeśli nikogo teraz nie ma, przygotuj pytanie i wróć do rozmowy później.'],
    starsi:['Zapytaj bliską osobę o coś, czego nauczyła się metodą prób.', 'Dopytaj o jeden szczegół jej opowieści.', 'Gdy nie ma rozmówcy, przygotuj dwa pytania na później.'],
    slad:['Poznałem czyjąś historię', 'Przygotowałem pytania na później', 'Dopytałem o ciekawy szczegół'],
    rozmowa:'Co cię zaskoczyło w tej rozmowie?' },
];

export function kolejnoscPrzygod(preferencje = []) {
  // Stabilna kolejność: profil przesuwa pasującą pierwszą przygodę, reszta zostaje dostępna.
  const pierwsza = PRZYGODY.find(p => p.os === preferencje[0]) || PRZYGODY[0];
  return [pierwsza.id, ...PRZYGODY.filter(p => p.id !== pierwsza.id).map(p => p.id)];
}
export function przygodaPoId(id) { return PRZYGODY.find(p => p.id === id); }
