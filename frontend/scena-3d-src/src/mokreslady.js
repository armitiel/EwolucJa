/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * mokreslady.js — mokre plamki, które lisek zostawia, wychodząc z wody.
 *
 * PO CO TO JEST. Woda w tej grze jest miejscem, do którego się WCHODZI: stąd
 * bierze się kropla dla fasoli. Ale po wyjściu świat nie pamiętał o tym ani
 * sekundy — lisek wychodził z jeziora tak samo suchy, jak z trawy. Ślad, który
 * zostaje na kilka kroków i sam znika, jest najtańszym możliwym sposobem, żeby
 * powiedzieć „to, co przed chwilą zrobiłeś, zostawiło ślad w świecie". Ta sama
 * zasada, co przy fasoli i schronieniu, tylko w skali jednej chwili
 * (`docs/OPIS_PROJEKTU.md`: działanie → konsekwencja → zmiana świata).
 *
 * DLACZEGO PEŁNE KOŁA, A NIE PRZEZROCZYSTE SMUGI (decyzja właściciela).
 * Pierwsza wersja mieszała dwie warstwy — mnożenie na cień i dodawanie na
 * błękit — żeby plamka „wsiąkała" w trawę. Wyglądało to mgliście i nie
 * pasowało do reszty świata, która jest z płaskich, pełnych barw: planeta,
 * kwiaty, woda w stawie. Teraz plamka jest tym, czym jest wszystko dookoła:
 * jednolitym kołem w kolorze wody. Bez przezroczystości, bez mieszania,
 * bez tekstury — sama geometria.
 *
 * CO Z TEGO WYNIKA DLA ZNIKANIA. Skoro nie ma przezroczystości, plamka nie ma
 * jak zblednąć — więc WYSYCHA: kurczy się do zera. To czytelniejsze niż
 * blaknięcie (dziecko widzi, że kałużka się zmniejsza) i nie kosztuje ani
 * jednego kanału alfa.
 */

import {
  CircleGeometry, Color, InstancedMesh, Matrix4, MeshBasicMaterial,
  Object3D, Vector3,
} from "three";

/** Ile plamek może leżeć naraz. 28 wystarcza na komplet: 14 kroków w parach. */
const POJEMNOSC = 28;
/**
 * ODSTĘP MIĘDZY PLAMKAMI ROŚNIE, W MIARĘ JAK ŁAPY SCHNĄ.
 *
 * Stały odstęp dawał ścieżkę równą jak przeszycie maszyną — a woda kapie
 * gęsto tuż przy brzegu i coraz rzadziej, im dalej lisek odejdzie. Odstęp
 * wypada więc między `ODSTEP_MOKRY` a `ODSTEP_SUCHY` zależnie od wilgoci,
 * a na to nakłada się jeszcze losowy mnożnik: dzięki niemu zdarzają się
 * i plamki tuż obok siebie, i większe przerwy. Regularność jest tu jedyną
 * rzeczą, która wygląda sztucznie.
 */
const ODSTEP_MOKRY = 0.22;
const ODSTEP_SUCHY = 1.05;
const ROZRZUT_ODSTEPU_MIN = 0.45;
const ROZRZUT_ODSTEPU_MAX = 1.65;
/** Rozstaw łap od osi marszu — tyle, ile ma lisek między przednimi łapami. */
const ROZSTAW = 0.15;
/**
 * ROZSYP PRZY SAMEJ WODZIE. Tuż po wyjściu ze stawu woda nie kapie z łap —
 * ona się z nich STRZĄSA, więc krople lądują dookoła, a nie w dwóch rządkach
 * pod łapami. Mnożnik rozjeżdża ścieżkę na boki i wzdłuż marszu, i schodzi
 * do 1 razem z wilgocią: przy suchych łapach zostaje sam ślad stóp.
 */
const ROZSYP_PRZY_WODZIE = 2.8;
/**
 * Jak często kolejna kropla spada po TEJ SAMEJ stronie, co poprzednia.
 * Bez tego ścieżka jest idealnie naprzemienna i czyta się jak dwie równoległe
 * kreski; co piąta powtórzona strona robi z niej rozchlapaną wodę.
 */
const SZANSA_TEJ_SAMEJ_STRONY = 0.22;
/** Plamka zostaje TAM, GDZIE BYŁA łapa, czyli odrobinę za bohaterem. */
const ZA_LISKIEM = -0.28;
/** Ten sam mnożnik zasięgu, co przy nabieraniu wody — jedno „jestem w stawie". */
const ZASIEG_WODY = 0.85;
/**
 * DRUGI, CIAŚNIEJSZY PROMIEŃ: dokąd lisek jeszcze BRODZI.
 *
 * Kropli nie stawiamy tylko tam, gdzie i tak zniknęłyby pod taflą. Gdyby
 * granicą było `ZASIEG_WODY`, ścieżka zaczynałaby się dobry metr od wody:
 * `promien` stawu to przy ręcznym obrysie NAJWIĘKSZY promień, więc 0,85 tej
 * wartości wypada w wąskich miejscach już na suchym brzegu. Stąd osobne,
 * mniejsze 0,55 — a to, co mimo wszystko padnie jeszcze w wodzie, chowa się
 * pod nią samo i nikomu nie przeszkadza.
 */
const ZASIEG_BRODZENIA = 0.55;
/**
 * Po ilu jednostkach marszu łapy wysychają. 7 to jakieś 16 śladów: dość, żeby
 * dziecko zdążyło zauważyć, że ciągną się za nim, i za mało, żeby obeszło
 * z nimi pół planety.
 */
const DROGA_SUCHA = 7.0;
/** Ile sekund żyje plamka i ile z tego trzyma pełny rozmiar, zanim zacznie schnąć. */
const ZYCIE = 2.9;
const PELNE = 0.9;
/** Widełki promienia. Różne rozmiary — inaczej ścieżka wygląda jak stempel. */
const R_MIN = 0.085;
const R_MAX = 0.165;
/**
 * Barwa wody ze stawu (`zbudujOczko`: 0x5fc4de), ściemniona: to ma być mokry
 * ślad NA ziemi, a nie druga tafla. Każda plamka dostaje własne drobne
 * odchylenie jasności, żeby kępka nie wyglądała na wyciętą jednym dziurkaczem.
 */
const BARWA = 0x4e9fbe;
const ROZRZUT_JASNOSCI = 0.16;

export class MokreSlady {
  /**
   * @param planeta        instancja `Planeta` (ramka na kuli)
   * @param swiat          grupa planety, do której wpina się ścieżka
   * @param wysokoscGruntu (x, z) → wysokość terenu; bez niej plamki wiszą
   */
  constructor(planeta, swiat, wysokoscGruntu) {
    this.planeta = planeta;
    this.wysokoscGruntu = wysokoscGruntu || null;

    /* KOŁO Z GEOMETRII, nie okrągła tekstura na kwadracie. Osiemnaście boków
       wystarcza przy tej wielkości, a przy okazji znika cały problem rogów
       płytki: nie ma czego chować, bo kwadratu nie ma. */
    const geo = new CircleGeometry(1, 18);
    geo.rotateX(-Math.PI / 2);   // ma LEŻEĆ, a nie stać
    this.geo = geo;

    /* `toneMapped: false`: renderer ma ACES, a mapowanie tonów rozjaśniłoby
       płaską barwę wody tak, że przestałaby zgadzać się ze stawem, z którego
       pochodzi. Plamka ma być tym samym błękitem, co tafla. */
    this.mesh = new InstancedMesh(geo, new MeshBasicMaterial({
      color: BARWA, toneMapped: false,
    }), POJEMNOSC);
    this.mesh.name = "mokre-slady";
    this.mesh.frustumCulled = false;
    this.mesh.count = POJEMNOSC;
    swiat.add(this.mesh);

    this._pusta = new Matrix4().makeScale(0, 0, 0);
    for (let i = 0; i < POJEMNOSC; i++) this.mesh.setMatrixAt(i, this._pusta);
    this.mesh.instanceMatrix.needsUpdate = true;

    // `promien` i `obrot` trzymamy przy plamce, bo kurczenie przelicza
    // macierz od nowa w każdej klatce — bez nich nie byłoby z czego.
    this.plamki = Array.from({ length: POJEMNOSC }, () => ({ wiek: 0, zyje: false }));
    this.nastepna = 0;

    this.wilgoc = 0;          // 1 = prosto z wody, 0 = sucho
    this.wWodzie = false;     // czyta scena: w wodzie nic za liskiem nie rośnie
    this.brodzil = false;     // czy poprzednia klatka zastała go jeszcze w wodzie
    this.droga = 0;           // ile przeszedł od ostatniej plamki
    this.odstep = ODSTEP_MOKRY;  // ile ma przejść do NASTĘPNEJ plamki
    this.strona = false;      // lewa/prawa łapa na przemian
    this._poprzednia = null;  // normalna z poprzedniej klatki

    this._pom = new Object3D();
    this._barwa = new Color();
    this._n = new Vector3();
    this._bok = new Vector3();
    this._p = { x: 0, z: 0, h: 0 };
  }

  /** Łapy znów są mokre. Woła scena, gdy bohater stoi w wodzie. */
  zamocz() {
    this.wilgoc = 1;
  }

  /**
   * @param dt    sekundy od poprzedniej klatki
   * @param hn    normalna bohatera (punkt na kuli)
   * @param hf    styczna „przód" bohatera
   * @param oczka lista stawów: `{ n, promien }`
   * @param stop  true, gdy plamek stawiać nie wolno (kino, teleport, panel)
   */
  tik(dt, hn, hf, oczka, stop = false) {
    // WODA NAJPIERW: wejście w staw odnawia wilgoć, nawet gdy bohater stoi.
    let wWodzie = false, brodzi = false;
    for (const o of oczka || []) {
      if (!o) continue;
      const d = this.planeta.odleglosc(hn, o.n);
      if (d < o.promien * ZASIEG_WODY) { wWodzie = true; this.zamocz(); }
      if (d < o.promien * ZASIEG_BRODZENIA) brodzi = true;
      if (wWodzie && brodzi) break;
    }
    /* FLAGA DLA SCENY. `_zasiejZaLiskiem` czyta ją, żeby w wodzie nie sadzić
       kwiatów ani traw — brodzący lisek nie zostawia za sobą łąki, zostawia
       kręgi na wodzie. Liczymy ją i tak przy okazji wilgoci, więc scena nie
       musi robić tego samego testu drugi raz. */
    this.wWodzie = wWodzie;

    this._wysuszaj(dt);

    if (!this._poprzednia) { this._poprzednia = hn.clone(); return; }
    const dystans = this.planeta.odleglosc(hn, this._poprzednia);
    this._poprzednia.copy(hn);

    /* Skok kamery albo teleport to nie jest marsz — bez tego warunku przelot
       przez pół planety rysowałby ścieżkę przez wszystko, co po drodze. */
    if (dystans > 2 || stop) { this.droga = 0; return; }
    if (this.wilgoc <= 0 || dystans < 1e-5) return;

    /* Wysychanie łap liczone DROGĄ, nie czasem: lisek stojący w miejscu nie
       wysycha szybciej od tego, który biegnie — a to on rozciera wodę. */
    this.wilgoc = Math.max(0, this.wilgoc - dystans / DROGA_SUCHA);

    // Głęboko w stawie plamek nie ma po co stawiać: leżałyby pod taflą.
    if (brodzi) { this.droga = 0; this.brodzil = true; return; }

    /* PIERWSZA KROPLA PADA NA SAMYM BRZEGU, a nie po pełnym odstępie. Bez tego
       lisek musiał najpierw przejść po suchym te 0,2–0,4 jednostki, więc
       ścieżka zaczynała się kawałek od wody i wyglądała, jakby woda skapnęła
       z powietrza. Wyjście z brodzenia jest zdarzeniem — i ma swoją kroplę. */
    if (this.brodzil) {
      this.brodzil = false;
      this.droga = 0;
      this._postaw(hn, hf);
      this._losujOdstep();
      return;
    }

    this.droga += dystans;
    if (this.droga < this.odstep) return;
    this.droga = 0;
    this._postaw(hn, hf);
    this._losujOdstep();
  }

  /** Ile do następnej kropli: baza z wilgoci, na to losowy mnożnik. */
  _losujOdstep() {
    const baza = ODSTEP_MOKRY + (ODSTEP_SUCHY - ODSTEP_MOKRY) * (1 - this.wilgoc);
    const mn = ROZRZUT_ODSTEPU_MIN + Math.random() * (ROZRZUT_ODSTEPU_MAX - ROZRZUT_ODSTEPU_MIN);
    this.odstep = baza * mn;
  }

  _postaw(hn, hf) {
    const P = this.planeta;
    // Im mokrzej, tym szerzej — patrz `ROZSYP_PRZY_WODZIE`.
    const rozsyp = 1 + (ROZSYP_PRZY_WODZIE - 1) * this.wilgoc;
    /* Odległość za liskiem drga RAZEM z bokiem, więc rozsyp jest dwuwymiarowy.
       Gdyby drgał tylko bok, krople dalej układałyby się w poprzeczne rządki —
       tylko szersze. */
    const wzdluz = ZA_LISKIEM * (0.7 + Math.random() * 0.6)
      - (Math.random() - 0.35) * 0.34 * (rozsyp - 1);
    P.punktObok(hn, hf, wzdluz, this._n);
    this._bok.crossVectors(this._n, hf).normalize();
    if (Math.random() >= SZANSA_TEJ_SAMEJ_STRONY) this.strona = !this.strona;
    const bok = ROZSTAW * (0.45 + Math.random() * 1.1) * rozsyp;
    P.punktObok(this._n, this._bok, this.strona ? bok : -bok, this._n);

    const p = P.zKuli(this._pom.position.copy(this._n).multiplyScalar(P.R), this._p);
    const h = (this.wysokoscGruntu ? this.wysokoscGruntu(p.x, p.z) : 0) + 0.018;

    const i = this.nastepna;
    this.nastepna = (this.nastepna + 1) % POJEMNOSC;
    /* Im bliżej sucha, tym mniejsza plamka — ścieżka gaśnie sama z siebie,
       bez żadnego „a teraz koniec". Losowy rozrzut na wierzchu tego. */
    const s = this.plamki[i];
    s.wiek = 0;
    s.zyje = true;
    s.x = p.x; s.z = p.z; s.h = h;
    s.obrot = Math.random() * Math.PI;
    s.promien = (R_MIN + Math.random() * (R_MAX - R_MIN)) * (0.55 + 0.45 * this.wilgoc);
    this._odswiez(i, 1);

    const j = 1 - ROZRZUT_JASNOSCI / 2 + Math.random() * ROZRZUT_JASNOSCI;
    this.mesh.setColorAt(i, this._barwa.setRGB(j, j, j));
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  /** Przelicza macierz jednej plamki przy zadanym ułamku rozmiaru. */
  _odswiez(i, ulamek) {
    const s = this.plamki[i];
    const o = this._pom;
    this.planeta.ustaw(o, s.x, s.z, s.h, s.obrot);
    const r = s.promien * ulamek;
    o.scale.set(r, 1, r);
    o.updateMatrix();
    this.mesh.setMatrixAt(i, o.matrix);
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  _wysuszaj(dt) {
    for (let i = 0; i < POJEMNOSC; i++) {
      const s = this.plamki[i];
      if (!s.zyje) continue;
      s.wiek += dt;
      if (s.wiek >= ZYCIE) {
        s.zyje = false;
        this.mesh.setMatrixAt(i, this._pusta);
        this.mesh.instanceMatrix.needsUpdate = true;
        continue;
      }
      if (s.wiek <= PELNE) continue;
      // Kurczenie z kwadratem: najpierw ledwo widoczne, na końcu szybkie —
      // tak wsiąka kałuża, a nie tak, jak gaśnie żarówka.
      const u = 1 - (s.wiek - PELNE) / (ZYCIE - PELNE);
      this._odswiez(i, u * u);
    }
  }

  zniszcz() {
    this.mesh.parent?.remove(this.mesh);
    this.mesh.material.dispose();
    this.geo.dispose();
  }
}
