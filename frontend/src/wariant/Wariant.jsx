/*!
 * EwolucJA — gra edukacyjna dla dzieci.
 * © 2026 Amitiel Angelisme. Wszelkie prawa zastrzeżone.
 * Powstało w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”.
 * Prawa autorskie należą do autora. Pełna nota: LICENSE.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ProfilAwatara from './ProfilAwatara.jsx';
import PopupPostaci from '../hub/PopupPostaci.jsx';
import bgMusic from '../services/bgMusic.js';
import HubDock from '../hub/HubDock.jsx';
import PoradaPanel from '../hub/panels/PoradaPanel.jsx';
import PanelSheet from '../hub/PanelSheet.jsx';
import { PROFILE_INFO } from '../components/ProfileAvatar.jsx';
import Scena3D from '../components/Scena3D.jsx';
import { OSIE, PYTANIA, PRZYGODY, przygodaPoId } from './tresci.js';
import { czytaj, zapisz, zmien, obecna, etapWzrostu, limitSesji, ZMIANA, KLUCZ } from './stan.js';
import './w2.css';

// Mapa autora i prototyp Fasoli pozostają nietknięte. W2 nie zależy od Fasoli.
// Dolny HUD (chmurka Wizkora + trzy przyciski) jest SCHOWANY do czasu, aż
// zadania wrócą — mają się zaczynać od spotkania z Wizkorem na mapie, a nie
// od panelu czekającego na starcie. Kod zostaje: wracamy do niego razem
// z elementami poprzedniego HUD-u.
const POKAZ_DOLNY_HUD = false;

export function mapaPrzygody(mapa) {
  return { ...mapa, fasola:null, oczko:null,
    swiat:{ ...mapa.swiat, zasiew:false, dolnyDok:false } };
}

/* Własne okno W2 usunięte. Panele jeżdżą teraz szufladą z poprzedniej wersji
   (`hub/PanelSheet.jsx`, style `.hub-sheet` / `.hub-scrim` w `hub/styles/hub.css`):
   <dialog> wskakiwał bez animacji — stąd „mignięcie" — i nie miał ani
   przyciemnienia tła, ani zachowanego przewijania, ani Escape. */

/**
 * Poznanie — pierwsze spotkanie z Wizkorem.
 *
 * Wygląd bierzemy WPROST z `hub/PopupPostaci.jsx`, czyli z tego samego okna,
 * które wita dziecko na `/swiat`: czarodziej wychodzi zza karty, wstęga niesie
 * jego imię, zielony przycisk prowadzi dalej. W2 nie ma już własnego okna
 * powitalnego — jedno źródło wyglądu dla obu światów, poprawka robi się raz.
 *
 * Tekstu zostaje tyle, ile trzeba, żeby dziecko wiedziało, co zrobić: JEDNO
 * ZDANIE NA EKRAN. Akapity tłumaczące („nie ma dobrych ani złych odpowiedzi",
 * „to preferencje na dziś, nie ocena") zniknęły — sześciolatek ich nie czyta,
 * a przez nie karta wyglądała na formularz, a nie na rozmowę z czarodziejem.
 *
 * Ekrany z pytaniem nie mają głównego przycisku: wyborem jest sama odpowiedź.
 * Dlatego `przycisk={null}` (obsluzone w `PopupPostaci`), a nie pusty CTA.
 */
function Poznanie({ profil, zapiszProfil, zamknij }) {
  const [krok, setKrok] = useState(0);
  const [imie, setImie] = useState(profil?.imie || '');
  const [grupa, setGrupa] = useState(profil?.grupa || '1-3');
  const [wybory, setWybory] = useState(profil?.preferencje || []);
  const zakoncz = preferencje => zapiszProfil({ typ:'profil', imie, grupa, preferencje });

  if (krok === 0) return <PopupPostaci
    otwarty imie="Wizkor" obrazek="/wizPop.webp"
    tekst="Jak mam cię nazywać, wędrowcze?"
    dodatek={<div className="w2-poznanie">
      <input className="w2-poznanie-imie" maxLength={24} autoComplete="off" aria-label="Twoje imię"
        placeholder="Wędrowiec" value={imie} onChange={e => setImie(e.target.value)} />
      {/* Grupa bez nagłówka: dwa przyciski z napisem „Klasy 1–3" i „Klasy 4–8"
          mówią same za siebie, a nazwa dla czytnika ekranu siedzi w `aria-label`
          grupy. Widoczny legend był trzecim napisem na jednym ekranie. */}
      <div className="w2-poznanie-grupa" role="group" aria-label="Wybierz swoją grupę">
        {['1-3','4-8'].map(g => <button key={g} type="button" aria-pressed={grupa === g}
          onClick={() => setGrupa(g)}>Klasy {g.replace('-', '\u2013')}</button>)}
      </div>
    </div>}
    przycisk="Poznajmy się"
    przyciskDrugi="Wybierz za mnie"
    onAkcja={() => setKrok(1)}
    onDrugi={() => zakoncz([])}
    onZamknij={zamknij}
  />;

  const pytanie = PYTANIA[krok - 1];
  return <PopupPostaci
    otwarty imie="Wizkor" obrazek="/wizPop.webp"
    tekst={pytanie.pytanie}
    dodatek={<div className="w2-poznanie-wybory">
      {pytanie.opcje.map(([os, tekst]) => <button key={os} type="button" onClick={() => {
        const nowe = krok === 1 ? [os] : [...wybory.slice(0,1), os];
        setWybory(nowe);
        if (krok === 2) zakoncz(nowe); else setKrok(2);
      }}>{tekst}</button>)}
    </div>}
    przycisk={null}
    przyciskDrugi="Wróć"
    onDrugi={() => setKrok(krok - 1)}
    onZamknij={zamknij}
  />;
}

function MaleMemory({ ukoncz }) {
  const [karty] = useState(() => [0,0,1,1,2,2].map((v,i) => ({v,i,sort:Math.random()})).sort((a,b) => a.sort-b.sort));
  const [otwarte, setOtwarte] = useState([]);
  const [pary, setPary] = useState([]);
  const symbole = ['☀','☁','✿'];
  function odkryj(i) {
    if (otwarte.includes(i) || pary.includes(karty[i].v) || otwarte.length === 2) return;
    const nowe = [...otwarte, i];
    setOtwarte(nowe);
    if (nowe.length === 2 && karty[nowe[0]].v === karty[i].v) {
      const znalezione = [...pary,karty[i].v]; setPary(znalezione); setOtwarte([]);
      if (znalezione.length === 3) ukoncz();
    }
  }
  return <div className="w2-stos"><p>Odkryj trzy pary znaków polany. Bez pośpiechu — możesz próbować, ile potrzebujesz.</p>
    <div className="w2-memory">{karty.map((k,i) => {
      const widoczna = otwarte.includes(i) || pary.includes(k.v);
      return <button key={k.i} className={widoczna ? 'odkryta' : ''} disabled={pary.includes(k.v)}
        aria-label={widoczna ? `${['Słońce','Chmura','Kwiat'][k.v]}${pary.includes(k.v) ? ', para odnaleziona' : ''}` : `Odkryj kartę ${i+1}`} onClick={() => odkryj(i)}>{widoczna ? symbole[k.v] : '?'}</button>;
    })}</div>
    {otwarte.length === 2 && <button onClick={() => setOtwarte([])}>Zapamiętuję i szukam dalej</button>}
    <button className="w2-link" onClick={ukoncz}>Wolę od razu poznać pomysł</button>
  </div>;
}

function Przygotowanie({ p, stan, dzialaj }) {
  const [odpowiedz, setOdpowiedz] = useState(null);
  if (!stan.przygotowana) return <MaleMemory ukoncz={() => dzialaj({typ:'przygotuj'})} />;
  return <div className="w2-stos"><p className="w2-nadtytul">Jeden pomysł przed wyprawą</p><h3>{p.pytanie}</h3>
    {p.opcje.map((tekst,i) => <button key={tekst} className="w2-wybor" aria-pressed={odpowiedz === i} onClick={() => setOdpowiedz(i)}>{tekst}</button>)}
    {odpowiedz !== null && <><p className="w2-notatka" role="status">{odpowiedz === p.poprawna ? 'Tak. ' : 'Sprawdźmy ten pomysł. '}{p.wyjasnienie}</p>
      <button className="w2-cta" onClick={() => dzialaj({typ:'pomysl'})}>Sprawdzę poza ekranem</button></>}
  </div>;
}

function Instrukcja({ p, grupa }) {
  return <><ol className="w2-kroki">{(grupa === '4-8' ? p.starsi : p.mlodsi).map(k => <li key={k}>{k}</li>)}</ol>
    <p className="w2-notatka">Wybierz bezpieczne miejsce. Jeśli czegoś nie masz lub potrzebujesz pomocy, poproś znanego dorosłego. Możesz wrócić później.</p></>;
}

function Slad({ p, dzialaj }) {
  const [wybor, setWybor] = useState('');
  const [tekst, setTekst] = useState('');
  return <form className="w2-stos" onSubmit={e => {e.preventDefault(); dzialaj({typ:'slad',wybor,tekst});}}>
    <h3>Co wydarzyło się w twoim świecie?</h3><p>Wystarczy jeden wybór. Nie musisz wysyłać zdjęcia ani udowadniać wyniku.</p>
    {p.slad.map(w => <label className="w2-radio" key={w}><input type="radio" name="slad" value={w} checked={wybor === w} onChange={() => setWybor(w)} required />{w}</label>)}
    <label>Chcesz coś dodać? <span>(nie trzeba)</span><textarea maxLength={400} rows={3} value={tekst} onChange={e => setTekst(e.target.value)} /></label>
    <button className="w2-cta" disabled={!wybor} type="submit">Zostawiam ślad</button>
    <small>Ślad zostaje na tym urządzeniu. Pokaż go swojemu Mentorowi.</small>
  </form>;
}

async function hashPin(pin) {
  const data = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`ewolucja-w2:${pin}`));
  return Array.from(new Uint8Array(data), b => b.toString(16).padStart(2,'0')).join('');
}
function Mentor({ stan, dzialaj }) {
  const [otwarty, setOtwarty] = useState(false);
  const [pin, setPin] = useState('');
  const [blad, setBlad] = useState('');
  const [tekst, setTekst] = useState('');
  const p = obecna(stan);
  const wpis = stan.wpisy.find(w => w.id === p?.id && !w.zauwazono);
  async function wejdz(e) {
    e.preventDefault();
    try {
      const hash = await hashPin(pin);
      if (stan.mentor.pinHash && stan.mentor.pinHash !== hash) {setBlad('Ten PIN nie pasuje. Spróbuj ponownie.'); return;}
      if (!stan.mentor.pinHash && !dzialaj({typ:'pin',hash})) return;
      setOtwarty(true); setPin(''); setBlad('');
    } catch {setBlad('Nie można otworzyć panelu. Użyj localhost lub bezpiecznego adresu HTTPS.');}
  }
  return <div className="w2-stos"><p className="w2-notatka">W2 · wspólny podgląd na tym urządzeniu. To jeszcze nie jest synchronizacja z kontem Mentora ani wysyłka do szkoły.</p>
    {!otwarty ? <form onSubmit={wejdz} className="w2-stos"><h3>{stan.mentor.pinHash ? 'Wejście dla dorosłego' : 'Dorosły ustawia panel W2'}</h3>
      <p>{stan.mentor.pinHash ? 'Podaj PIN ustawiony na tym urządzeniu.' : 'Ustal PIN, zanim oddasz urządzenie dziecku. To prosta blokada panelu, nie zabezpieczenie konta.'}</p>
      <label>PIN (4–8 cyfr)<input type="password" inputMode="numeric" pattern="[0-9]{4,8}" minLength={4} maxLength={8} required value={pin} onChange={e => setPin(e.target.value)} autoComplete="off" /></label>
      {blad && <p role="alert">{blad}</p>}<button className="w2-cta">{stan.mentor.pinHash ? 'Otwórz panel' : 'Ustaw PIN i otwórz'}</button>
    </form> : <>
      <h3>Zauważ próbę, nie oceniaj wyniku</h3>
      {wpis ? <article className="w2-karta"><h3>{p.tytul}</h3><p>{wpis.wybor}</p>{wpis.tekst && <blockquote>{wpis.tekst}</blockquote>}
        <p><strong>Początek rozmowy:</strong> {p.rozmowa}</p>
        <label>Twoja odpowiedź <span>(opcjonalnie)</span><textarea maxLength={400} rows={3} value={tekst} onChange={e => setTekst(e.target.value)} placeholder="Zauważyłem twoją próbę…" /></label>
        <button className="w2-cta" onClick={() => {dzialaj({typ:'zauwaz',tekst});setTekst('');}}>Zauważam tę przygodę</button>
      </article> : <p>Nie ma teraz nowego śladu do zauważenia. Dziecko może wrócić w swoim tempie.</p>}
      <label>Długość części ekranowej<select value={stan.sesja.limitMin} onChange={e => dzialaj({typ:'limit',minuty:Number(e.target.value)})}>{[5,8,12,15].map(n => <option key={n} value={n}>{n} minut</option>)}</select></label>
      <small>8 minut to ustawienie próbne, nie zalecenie zdrowotne. Nie pokazujemy dziecku odliczania. Limit nie blokuje instrukcji, śladu ani rozmowy.</small>
      <button onClick={() => dzialaj({typ:'nowa-sesja'})}>Rozpocznij nową sesję na tym urządzeniu</button>
      <details><summary>Co ćwiczą przygody?</summary>{PRZYGODY.map(p => <p key={p.id}><strong>{p.tytul} · {OSIE[p.os]}</strong><br />{p.cel}</p>)}</details>
    </>}
  </div>;
}

export default function Wariant() {
  const [stan, setStan] = useState(czytaj);
  const stanRef = useRef(stan); stanRef.current = stan;
  const api = useRef(null);
  const [gotowa, setGotowa] = useState(false);
  const [bladSceny, setBladSceny] = useState(false);
  const [bladZapisu, setBladZapisu] = useState('');
  const [panel, setPanel] = useState(() => location.pathname.endsWith('/mentor') ? 'mentor' : null);
  const [widoczna, setWidoczna] = useState(!document.hidden);
  const [widokSladu, setWidokSladu] = useState(false);
  const [powrotPokazany, setPowrotPokazany] = useState(false);
  const [powrotPanelu, setPowrotPanelu] = useState(null);
  const zarejestrujPowrot = useCallback(akcja => { setPowrotPanelu(() => akcja || null); }, []);
  // Typ z onboardingu (most przez localStorage — W2 nie wczytuje konta).
  // Decyduje tylko o tym, które zwierzę siedzi w pasku; brak typu = lisek.
  const [typ] = useState(() => { try { return localStorage.getItem('ewolucja.profil.typ'); } catch { return null; } });
  const awatar = PROFILE_INFO[typ]?.svgMini || '/fox_avatar.png';
  const [muzyka, setMuzyka] = useState(() => bgMusic.isEnabled());
  const p = obecna(stan);
  const limit = limitSesji(stan);
  const liczba = etapWzrostu(stan);
  const preferujeSpokojnie = useRef(matchMedia('(prefers-reduced-motion: reduce)').matches);

  function dzialaj(akcja) {
    const nowy = zmien(stanRef.current,akcja);
    if (nowy === stanRef.current) return false;
    try { zapisz(nowy); stanRef.current = nowy; setStan(nowy); setBladZapisu(''); return true; }
    catch {setBladZapisu('Nie udało się zapisać. Zwolnij miejsce lub zezwól przeglądarce na zapis. Twój poprzedni postęp pozostał bez zmian.');return false;}
  }
  useEffect(() => {
    const odswiez = e => {if (!e?.key || e.key === KLUCZ) {const nowy=czytaj();stanRef.current=nowy;setStan(nowy);}};
    const widocznosc = () => setWidoczna(!document.hidden);
    addEventListener('storage',odswiez); addEventListener(ZMIANA,odswiez); document.addEventListener('visibilitychange',widocznosc);
    return () => {removeEventListener('storage',odswiez);removeEventListener(ZMIANA,odswiez);document.removeEventListener('visibilitychange',widocznosc);};
  }, []);
  useEffect(() => {
    // Zegar sesji liczy tylko fazy PRZED wyprawą. Chodzenie po powrocie
    // ('slad', 'zauwazone') nie zjada limitu — dziecko czeka na Mentora,
    // a nie gra dalej.
    const aktywna = widoczna && panel !== 'mentor' && (gotowa || bladSceny) && !limit && ['trop','przygotowanie','zaproszenie'].includes(stan.faza);
    if (!aktywna) return;
    let poprzednio = performance.now();
    const id = setInterval(() => {const teraz=performance.now();dzialaj({typ:'czas',ms:teraz-poprzednio});poprzednio=teraz;},1000);
    return () => clearInterval(id);
  }, [widoczna, panel, gotowa, bladSceny, limit, stan.faza]);
  useEffect(() => {
    // Świat stoi TYLKO wtedy, gdy dziecka ma przy nim nie być: karta w tle,
    // otwarty panel, brak profilu, wyprawa poza ekranem ('poza') albo koniec
    // sesji. W 'slad' i 'zauwazone' dziecko WRÓCIŁO — zamrożona planeta czyta
    // się wtedy jako zepsuta gra, a nie jak czekanie na Mentora. Czekanie ma
    // pokazywać świat (chmura nad fasolą), nie bezruch.
    // UWAGA: 'wyjscie' zamyka sesję na stałe (stan.js: sesja.zamknieta = true),
    // więc po powrocie `limit` jest prawdziwy aż do akcji 'dalej'. Gdyby sam
    // zatrzymywał planetę, dziecko wracałoby zawsze do martwego świata.
    const wrocil = stan.faza === 'slad' || stan.faza === 'zauwazone';
    const pauza = !widoczna || !!panel || !stan.profil || stan.faza === 'poza' || (limit && !wrocil);
    // Powrót ma krótki widok świata mimo zamkniętej sesji.
    if ((!pauza || (powrotPokazany && stan.faza === 'zauwazone' && !panel && widoczna))) api.current?.wznow();
    else api.current?.pauza();
  }, [gotowa,widoczna,panel,stan.profil,stan.faza,limit,powrotPokazany]);
  useEffect(() => {
    if (!gotowa) return;
    if (stan.faza !== 'zauwazone' || powrotPokazany) api.current?.ustawSladyPrzygod(liczba, !powrotPokazany || preferujeSpokojnie.current);
  }, [gotowa,liczba,stan.faza,powrotPokazany]);
  useEffect(() => {
    // Po ujęciu powrotu NIE zatrzymujemy planety: dziecko zostaje w świecie,
    // który dopiero co się zmienił. Zatrzymanie po dziesięciu sekundach
    // wyglądało jak zawieszona gra.
    if (!powrotPokazany) return;
  }, [powrotPokazany]);
  useEffect(() => {
    if (limit && panel === 'przygoda') setWidokSladu(false);
  },[limit,panel]);

  function otworzPrzygode() { setWidokSladu(false); setPanel('przygoda'); }
  function pokazPowrot() {
    setPanel(null); setPowrotPokazany(true);
    api.current?.ustawBohatera(0,6.72);
    api.current?.ustawSladyPrzygod(liczba,preferujeSpokojnie.current);
  }
  /* Panele z krokami w środku (Porada) zgłaszają przez `onPowrot`, że mają
     dokąd cofnąć — to REJESTRACJA akcji, nie zamknięcie. Podanie tam `zamknij`
     kończyło się tym, że panel zamykał się w chwili otwarcia, czyli „porada
     nie działa". Wzorzec żywcem z `pages/Swiat.jsx` (`zarejestrujPowrot`
     + `powrot` na arkuszu). */
  const zamknij = () => { setPowrotPanelu(null); setPanel(null); };
  const faktycznyPanel = panel || (!stan.profil && (gotowa || bladSceny) ? 'profil' : null);
  const tytuly = {profil: 'Twój profil',przygoda:p?.tytul || 'Twoje przygody',kronika:'Kronika odkryć',mentor:'Dla Mentora',porada:'Chwila z Liskiem'};
  const opis = !stan.profil ? 'Poznajmy się i wybierzmy pierwszą przygodę.' : stan.faza === 'poza' ? 'Teraz odkrywasz swój świat. Instrukcja zostaje tutaj.' : stan.faza === 'slad' ? 'Twój ślad jest zapisany. Pokaż go Mentorowi na tym urządzeniu.' : stan.faza === 'zauwazone' ? 'Mentor zauważył twoją próbę. Na polanie pojawi się jej ślad.' : stan.faza === 'koniec' ? 'Siedem przygód zostało w twojej Kronice. To dobry moment na odpoczynek.' : limit ? 'Pomysł czeka już poza ekranem. Zajrzyjmy do wskazówki.' : p?.trop;
  const akcja = stan.faza === 'zauwazone' ? (powrotPokazany ? 'Zamknij tę przygodę' : 'Zobacz zmianę na polanie') : stan.faza === 'poza' ? 'Moja wyprawa' : stan.faza === 'slad' ? 'Zobacz zapisany ślad' : stan.faza === 'koniec' ? 'Otwórz Kronikę' : limit ? 'Zobacz pomysł poza ekranem' : stan.faza === 'trop' ? 'Odkryj przygodę' : 'Wróć do przygody';
  return <main className="w2">
    <Scena3D apiRef={api} mapa="/scena-3d/mapa-w2.json" przygotujMape={mapaPrzygody} className="w2-scena" zoom={1.05} spokojnyRuch={preferujeSpokojnie.current}
      onGotowa={s => {s.ustawSladyPrzygod(Math.max(0,etapWzrostu(stanRef.current)-(stanRef.current.faza === 'zauwazone' ? 1 : 0)),true);setGotowa(true);window.__rozsunChmury?.();}}
      onBlad={() => {setBladSceny(true);window.__rozsunChmury?.();}} />
    {/* HUD PRZENIESIONY Z W1 (`pages/Swiat.jsx`, sekcja `.game-hud`) — ten sam
        markup, te same klasy, ten sam arkusz `public/scena-3d/hud.css`
        linkowany globalnie w `index.html`. Nic tu nie jest odtwarzane od nowa:
        czip profilu, złota pinetka muzyki i dok stroją się z jednego pliku,
        więc W1 i W2 nie rozjadą się po pierwszej poprawce wyglądu.
        Świadome różnice wobec W1: nie ma licznika monet (W2 nie prowadzi
        ekonomii, a „0/100" na starcie to licznik dla samego licznika) i dok
        pokazuje na razie samą „Poradę" — reszta wejść dostanie ikonę wtedy,
        gdy będzie miała treść. */}
    {(gotowa || bladSceny) && <div className="game-hud" data-variant="B" aria-label="Interfejs świata">
      <div className="game-hud-top">
        <button type="button" className="game-hud-profile" onClick={() => setPanel('profil')}
          aria-label={`Otwórz profil: ${stan.profil?.imie || 'Wędrowiec'}`} data-testid="hub-chip-profil">
          <img className="ma-uszy" src={awatar} alt="" aria-hidden="true" draggable="false" />
          <span>{stan.profil?.imie || 'Wędrowiec'}</span>
        </button>
        <div className="game-hud-resources">
          <button type="button" className={`game-hud-music${muzyka ? '' : ' is-off'}`}
            onClick={() => setMuzyka(bgMusic.toggle())} aria-pressed={muzyka}
            aria-label={muzyka ? 'Wycisz muzykę' : 'Włącz muzykę'}
            title={muzyka ? 'Wycisz muzykę' : 'Włącz muzykę'} data-testid="hub-music">
            <img src="/music.png" alt="" aria-hidden="true" draggable="false" />
          </button>
        </div>
      </div>
      <div className="game-hud-bottom">
        <HubDock sekcje={['porada']} aktywny={panel === 'porada' ? 'porada' : null}
          onWybor={id => setPanel(id === 'porada' ? 'porada' : null)} />
      </div>
    </div>}

    {!gotowa && !bladSceny && <p className="w2-ladowanie" role="status">Otwieram twój mały świat…</p>}
    {bladSceny && <section className="w2-awaria"><h2>Świat 3D chwilowo odpoczywa</h2><p>Możesz nadal otworzyć przygodę i instrukcję.</p><button onClick={() => location.reload()}>Spróbuj wczytać świat ponownie</button></section>}
    {bladZapisu && <p className="w2-blad" role="alert">{bladZapisu}</p>}
    {POKAZ_DOLNY_HUD && (gotowa || bladSceny) && <div className="w2-dol">
      <section className="w2-chmurka" aria-label="Wskazówka Wizkora"><img src="/wizPop.webp" alt="" /><div><p className="w2-nadtytul">{stan.faza === 'koniec' ? 'Do zobaczenia' : 'Twoja przygoda'}</p><p>{opis}</p>
        <button className="w2-cta" onClick={() => {
          if (!stan.profil) setPanel('profil');
          else if (stan.faza === 'koniec') setPanel('kronika');
          else if (stan.faza === 'zauwazone') {
            if (!powrotPokazany) pokazPowrot();
            else if(dzialaj({typ:'dalej'})) {setPowrotPokazany(false);setPanel('przygoda');}
          } else otworzPrzygode();
        }}>{stan.profil ? akcja : 'Poznajmy się'}</button></div></section>
      <nav className="w2-dok" aria-label="Twój świat"><button onClick={otworzPrzygode}>Przygoda</button><button onClick={() => setPanel('kronika')}>Kronika</button><button onClick={() => setPanel('porada')}>Chwila z Liskiem</button></nav>
    </div>}
    {/* Poznanie NIE wchodzi do `Okno`: ma teraz wlasne okno postaci (ta sama
        karta, co powitania na `/swiat`), wiec ramka z fioletowa belka i tytulem
        byla druga ramka wokol tej samej rozmowy. */}
    {faktycznyPanel === 'profil' && !stan.profil && <Poznanie
      profil={stan.profil}
      zapiszProfil={a => {if(dzialaj(a)){setPanel(null);}}}
      zamknij={zamknij} />}
    <PanelSheet open={!!faktycznyPanel && !(faktycznyPanel === 'profil' && !stan.profil)}
      title={tytuly[faktycznyPanel] || ''} onClose={zamknij}
      onPowrot={powrotPanelu} powrot={!!powrotPanelu} testId="w2-sheet">
      {/* Zmiana imienia NIE otwiera już „Poznajmy się" — profil sam zamienia
          napis w pole tekstowe i oddaje tu gotowe imię. Ankieta zostaje tym,
          czym była: pierwszym poznaniem, a nie formularzem poprawek. */}
      {faktycznyPanel === 'profil' && stan.profil && <ProfilAwatara
        imie={stan.profil.imie}
        onZapiszImie={noweImie => dzialaj({ typ:'profil', imie:noweImie, grupa:stan.profil.grupa, preferencje:stan.profil.preferencje })}
      />}
      {faktycznyPanel === 'mentor' && <Mentor stan={stan} dzialaj={dzialaj} />}
      {faktycznyPanel === 'porada' && <PoradaPanel onPowrot={zarejestrujPowrot} />}
      {faktycznyPanel === 'kronika' && <div className="w2-stos"><p>Tu zostają twoje próby i odkrycia. Bez punktów i porównywania z innymi.</p>
        {!stan.wpisy.length && <p className="w2-notatka">Pierwsza strona czeka na twoją wyprawę poza ekran.</p>}
        {stan.wpisy.map(w => <article key={w.id} className="w2-karta"><p className="w2-nadtytul">{w.zauwazono ? 'Mentor zauważył' : 'Twój zapisany ślad'}</p><h3>{przygodaPoId(w.id)?.tytul}</h3><p>{w.wybor}</p>{w.tekst && <p>{w.tekst}</p>}{w.odpowiedz && <blockquote>{w.odpowiedz}</blockquote>}</article>)}
        <small>Kronika jest zapisana tylko w tej przeglądarce. Wyczyszczenie danych strony usuwa ten lokalny zapis.</small></div>}
      {faktycznyPanel === 'przygoda' && (!stan.profil ? <><p>Najpierw wybierzmy coś dla ciebie.</p><button className="w2-cta" onClick={() => setPanel('profil')}>Poznajmy się</button></> : !p ? <><h3>To dopiero początek twoich odkryć</h3><p>W2 zawiera siedem przygód. Kolejne miejsca są jeszcze w przygotowaniu.</p><button onClick={() => setPanel('kronika')}>Zobacz Kronikę</button></> : <div className="w2-stos">
        {['trop','przygotowanie','zaproszenie'].includes(stan.faza) && limit ? <><h3>Teraz przygoda w twoim świecie</h3><Instrukcja p={p} grupa={stan.profil.grupa} /><button className="w2-cta" onClick={() => {if(dzialaj({typ:'wyjscie'}))zamknij();}}>Odkładam ekran</button></> : <>
          {stan.faza === 'trop' && <><img className="w2-portret" src="/wizPop.webp" alt="Wizkor" /><p>{p.trop}</p><p className="w2-notatka">Najpierw krótka zabawa tutaj. Potem małe odkrycie poza ekranem — wrócisz, kiedy zechcesz.</p><button className="w2-cta" onClick={() => dzialaj({typ:'start'})}>Sprawdźmy to</button></>}
          {stan.faza === 'przygotowanie' && <Przygotowanie key={p.id} p={p} stan={stan} dzialaj={dzialaj} />}
          {stan.faza === 'zaproszenie' && <><h3>Zabierz pomysł ze sobą</h3><Instrukcja p={p} grupa={stan.profil.grupa} /><button className="w2-cta" onClick={() => {if(dzialaj({typ:'wyjscie'}))zamknij();}}>Odkładam ekran</button></>}
        </>}
        {stan.faza === 'poza' && (widokSladu ? <Slad p={p} dzialaj={dzialaj} /> : <><h3>Twoja wyprawa poza ekran</h3><Instrukcja p={p} grupa={stan.profil.grupa} /><button className="w2-cta" onClick={() => setWidokSladu(true)}>Wróciłem — chcę opowiedzieć</button><button onClick={zamknij}>Wrócę później</button></>)}
        {stan.faza === 'slad' && <><h3>Twój ślad zostaje w Kronice</h3><p>{stan.wpisy.find(w => w.id === p.id)?.wybor}</p><p>Nie musisz czekać przy ekranie. Pokaż tę stronę Mentorowi, kiedy będziecie razem.</p><button onClick={() => setPanel('mentor')}>Pokaż Mentorowi na tym urządzeniu</button><button className="w2-cta" onClick={zamknij}>Na dziś wystarczy</button></>}
        {stan.faza === 'zauwazone' && <><h3>Twoja próba została zauważona</h3><blockquote>{stan.wpisy.find(w => w.id === p.id)?.odpowiedz}</blockquote><p>Wróć na polanę — pojawią się na niej nowe rośliny, ślad tej przygody.</p><button className="w2-cta" onClick={pokazPowrot}>Zobacz zmianę na polanie</button></>}
      </div>)}
    </PanelSheet>
  </main>;
}
