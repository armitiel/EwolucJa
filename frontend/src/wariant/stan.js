/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
import { kolejnoscPrzygod, przygodaPoId } from './tresci.js';

export const KLUCZ = 'ewolucja.w2.przygoda.v1';
export const ZMIANA = 'ewolucja:w2:zmiana';
const FAZY = ['trop', 'przygotowanie', 'zaproszenie', 'poza', 'slad', 'zauwazone', 'koniec'];
export const pustyStan = () => ({ wersja:1, profil:null, kolejnosc:[], indeks:0, faza:'trop',
  przygotowana:false, wpisy:[], sesja:{ uzytoMs:0, limitMin:8, zamknieta:false },
  mentor:{ pinHash:null }, wydarzenia:[] });

export function normalizuj(raw) {
  const baza = pustyStan();
  if (!raw || raw.wersja !== 1) return baza;
  const profil = raw.profil && ['1-3','4-8'].includes(raw.profil.grupa) ? raw.profil : null;
  const zapisane = Array.isArray(raw.kolejnosc) ? [...new Set(raw.kolejnosc.filter(przygodaPoId))] : [];
  const domyslne = profil ? kolejnoscPrzygod(profil.preferencje) : [];
  const kolejnosc = profil ? [...zapisane, ...domyslne.filter(id => !zapisane.includes(id))] : [];
  return { ...baza, profil, kolejnosc,
    indeks:Math.max(0, Math.min(kolejnosc.length, Math.floor(Number(raw.indeks) || 0))),
    faza:FAZY.includes(raw.faza) ? raw.faza : 'trop', przygotowana:!!raw.przygotowana,
    wpisy:Array.isArray(raw.wpisy) ? raw.wpisy.filter(w => przygodaPoId(w.id)) : [],
    sesja:{ limitMin:[5,8,12,15].includes(raw.sesja?.limitMin) ? raw.sesja.limitMin : 8,
      uzytoMs:Math.max(0, Number(raw.sesja?.uzytoMs) || 0), zamknieta:!!raw.sesja?.zamknieta },
    mentor:{ pinHash:typeof raw.mentor?.pinHash === 'string' ? raw.mentor.pinHash : null },
    wydarzenia:Array.isArray(raw.wydarzenia) ? raw.wydarzenia.slice(-150) : [],
  };
}
export function czytaj() {
  try { return normalizuj(JSON.parse(localStorage.getItem(KLUCZ))); } catch { return pustyStan(); }
}
export function zapisz(stan) {
  // Nie udajemy zapisu, gdy przeglądarka odmawia dostępu lub zabrakło miejsca.
  localStorage.setItem(KLUCZ, JSON.stringify(stan));
  window.dispatchEvent(new CustomEvent(ZMIANA));
}
export function obecna(s) { return przygodaPoId(s.kolejnosc[s.indeks]); }
export function etapWzrostu(s) { return new Set(s.wpisy.filter(w => w.zauwazono).map(w => w.id)).size; }
export function limitSesji(s) { return s.sesja.zamknieta || s.sesja.uzytoMs >= s.sesja.limitMin * 60000; }

export function zmien(s, a, teraz = Date.now()) {
  let n = { ...s, sesja:{...s.sesja}, mentor:{...s.mentor} };
  const p = obecna(s);
  switch (a.typ) {
    case 'profil':
      n.profil = { imie:String(a.imie || 'Wędrowiec').trim().slice(0,24) || 'Wędrowiec',
        grupa:a.grupa === '4-8' ? '4-8' : '1-3', preferencje:a.preferencje || [] };
      if (!s.profil) n.kolejnosc = kolejnoscPrzygod(n.profil.preferencje);
      break;
    case 'start': if (s.faza !== 'trop' || limitSesji(s)) return s; n.faza = 'przygotowanie'; break;
    case 'przygotuj': if (s.faza !== 'przygotowanie' || limitSesji(s)) return s; n.przygotowana = true; break;
    case 'pomysl': if (!s.przygotowana || s.faza !== 'przygotowanie' || limitSesji(s)) return s; n.faza = 'zaproszenie'; break;
    case 'wyjscie':
      if (!['trop','zaproszenie','przygotowanie'].includes(s.faza)) return s;
      n.faza = 'poza'; n.sesja.zamknieta = true; break;
    case 'slad':
      if (!p || s.faza !== 'poza' || !p.slad.includes(a.wybor)) return s;
      n.wpisy = [...s.wpisy.filter(w => w.id !== p.id), { id:p.id, wybor:a.wybor,
        tekst:String(a.tekst || '').trim().slice(0,400), zgloszono:teraz, zauwazono:null, odpowiedz:'' }];
      n.faza = 'slad'; break;
    case 'zauwaz': {
      if (s.faza !== 'slad' || !p || !s.wpisy.some(w => w.id === p.id && !w.zauwazono)) return s;
      n.wpisy = s.wpisy.map(w => w.id === p.id ? {...w, zauwazono:teraz,
        odpowiedz:String(a.tekst || 'Zauważyłem twoją próbę. Opowiesz mi o niej?').slice(0,400)} : w);
      n.faza = 'zauwazone'; break;
    }
    case 'dalej':
      if (s.faza !== 'zauwazone') return s;
      n.indeks++; n.faza = n.indeks >= s.kolejnosc.length ? 'koniec' : 'trop';
      n.przygotowana = false; n.sesja.uzytoMs = 0; n.sesja.zamknieta = false; break;
    case 'czas': n.sesja.uzytoMs += Math.max(0, Math.min(10000, a.ms || 0)); return n;
    case 'limit': if (![5,8,12,15].includes(a.minuty)) return s; n.sesja.limitMin = a.minuty; break;
    case 'nowa-sesja': n.sesja.uzytoMs = 0; n.sesja.zamknieta = false; break;
    case 'pin': n.mentor.pinHash = a.hash; break;
    default: return s;
  }
  n.wydarzenia = [...s.wydarzenia, {typ:a.typ, przygoda:p?.id || null, czas:teraz}].slice(-150);
  return n;
}
