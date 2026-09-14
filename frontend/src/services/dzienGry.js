/**
 * dzienGry — którą dobę przygody dziecko ma dzisiaj.
 *
 * PO CO. Biblioteka porad to siatka 30 dni × 3 pory na profil. „Dzień" musi
 * znaczyć wszędzie to samo, bo inaczej panel Porada, ekran Komnaty i dowolny
 * przyszły konsument tej samej siatki pokazują trzy różne porady tej samej doby.
 * Wcześniej były dwie definicje naraz: `todaysTip()` liczyło dzień miesiąca,
 * a ekran porad dni od rejestracji. Ten moduł jest teraz jedynym źródłem.
 *
 * ZASADA. Dzień 1 to doba rejestracji, licznik zawija się co 30 dni, więc po
 * miesiącu biblioteka zaczyna kolejny obrót zamiast się kończyć. Porównujemy
 * całe doby kalendarzowe (godziny wyzerowane), bo dziecko odbiera „nowy dzień"
 * o północy, a nie 24 godziny po założeniu konta.
 *
 * BEZ REJESTRACJI (podgląd, konto gościa) spadamy na dzień miesiąca — wynik
 * jest wtedy dowolny, ale stabilny w obrębie doby, więc ekran się nie miga.
 */

/** Długość cyklu biblioteki porad w dniach. */
export const DNI_CYKLU = 30;

/**
 * @param {object|null} player gracz z `registered_at`
 * @param {Date} data moment odniesienia (wstrzykiwany w testach)
 * @returns {number} 1..DNI_CYKLU
 */
export function dzienPrzygody(player, data = new Date()) {
  const start = player?.registered_at ? new Date(player.registered_at) : null;
  if (!start || Number.isNaN(start.getTime())) {
    return ((data.getDate() - 1) % DNI_CYKLU) + 1;
  }
  const a = new Date(start); a.setHours(0, 0, 0, 0);
  const b = new Date(data); b.setHours(0, 0, 0, 0);
  const roznica = Math.floor((b - a) / 86400000);
  return (Math.max(0, roznica) % DNI_CYKLU) + 1;
}
