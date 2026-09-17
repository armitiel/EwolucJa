/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * dymki.js — obłoczki spod łap biegnącego bohatera.
 *
 * PO CO. Bieg bez śladu wygląda jak ślizganie się po szkle. Kilka miękkich
 * kłębków zostających za łapami daje tarcie i ciężar — a przy okazji jest
 * drugim, cichym sygnałem, że dziecko WŁAŚNIE BIEGNIE, czyli że przyspiesza
 * dobę. Nic nie trzeba pisać na ekranie.
 *
 * GDZIE ŻYJĄ. W grupie PLANETY, nie kamery i nie bohatera. Kłębek ma zostać
 * TAM, gdzie odbiła się łapa — planeta obraca się dalej i obłoczek odjeżdża
 * razem z ziemią. Gdyby wisiał na bohaterze, jechałby z nim i nie byłby
 * śladem, tylko ozdobą.
 *
 * SKĄD WIEMY, ŻE BIEGNIE. Z przebytej drogi po kuli, a nie z flagi `running`
 * ani z wciśniętego klawisza: `odleglosc(poprzednia normalna, obecna) / dt`
 * daje prawdziwą prędkość niezależnie od tego, czym dziecko steruje.
 *
 * PULA, nie tworzenie w locie. Sprity powstają raz i wracają do obiegu —
 * alokacja w pętli klatek zostawia śmieci i szarpie na telefonie.
 */
import {
  CanvasTexture, Color, Group, SRGBColorSpace,
  Sprite, SpriteMaterial, Vector3,
} from "three";

export const DYMKI = {
  ile: 34,              // wielkość puli
  progBiegu: 2.2,       // jednostki/s — powyżej uznajemy, że to bieg
  odstep: 0.07,        // ŚREDNI odstęp między kłębkami przy pełnym biegu
  zycie: 0.62,          // średnia długość życia
  wielkoscOd: 0.16,
  wielkoscDo: 0.72,
  krycie: 0.9,
  wysokosc: 0.06,       // start nad ziemią
  wznoszenie: 0.34,     // ile wzlatuje przez całe życie
  zostawanie: 0.34,     // ile odjeżdża do tyłu (w jednostkach mapy)
  rozrzutOdlotu: [0.55, 1.5],  // każdy kłębek odlatuje inaczej daleko
  rozrzutBoczny: 0.6,   // w bok od osi biegu — szeroki wachlarz, nie pas
  // NIEREGULARNOŚĆ. Równe odstępy i równe kule czytają się jak perforacja,
  // a nie jak kurz spod łap. Każdy kłębek losuje własną skalę, długość
  // życia, odstęp do następnego, przesunięcie w bok i w przód oraz obrót.
  rozrzutSkali: [0.62, 1.45],
  rozrzutZycia: [0.72, 1.34],
  rozrzutOdstepu: [0.5, 1.7],
  rozrzutWzdluz: 0.3,
  rozrzutWznoszenia: [0.6, 1.5],
  barwaDzien: 0xfffdf6,
  barwaNoc: 0x9fb6d4,
};

let _tekstura = null;
function klebek() {
  if (_tekstura) return _tekstura;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const x = c.getContext("2d");
  // Miękki, lekko niesymetryczny kłębek — trzy nachodzące na siebie plamy,
  // żeby nie wyglądał jak idealne koło.
  for (const [cx, cy, r, a] of [[30, 34, 22, 0.9], [40, 28, 16, 0.7], [24, 26, 13, 0.6]]) {
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, `rgba(255,255,255,${a})`);
    g.addColorStop(0.55, `rgba(255,255,255,${a * 0.45})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, 64, 64);
  }
  _tekstura = new CanvasTexture(c);
  _tekstura.colorSpace = SRGBColorSpace;
  return _tekstura;
}

const _n = new Vector3();
const _f = new Vector3();
const _a = new Color();
const _b = new Color();

export class Dymki {
  /**
   * @param {Group} grupaPlanety grupa, która obraca się pod bohaterem
   * @param {Planeta} planeta
   */
  constructor(grupaPlanety, planeta, opcje = {}) {
    const C = this.C = { ...DYMKI, ...opcje };
    this.planeta = planeta;
    this.grupa = new Group();
    this.grupa.name = "dymki";
    grupaPlanety.add(this.grupa);

    this.material = new SpriteMaterial({
      // ZWYKŁE mieszanie, nie dodawanie: dodawany biały kłębek na jasnej
      // trawie znika, bo nie ma czego rozjaśnić. Kurz ma być widoczny
      // także w pełnym słońcu.
      map: klebek(), color: C.barwaDzien, transparent: true,
      depthWrite: false, opacity: C.krycie, toneMapped: false,
    });

    this.sztuki = [];
    for (let i = 0; i < C.ile; i++) {
      const s = new Sprite(this.material.clone());
      s.visible = false;
      s.renderOrder = 2;
      this.grupa.add(s);
      this.sztuki.push({
        sprite: s, zycie: 0, n: new Vector3(), tyl: new Vector3(),
        skala: 1, tempoZycia: 1, wznosi: 1, krycie: C.krycie,
      });
    }
    this.nastepny = 0;
    this.doWyrzutu = 0;
    this._poprzednia = null;
    this.predkosc = 0;
    // Własny generator, żeby ślad był powtarzalny przy tym samym biegu,
    // a nie inny przy każdym uruchomieniu.
    this._ziarno = 1013904223;
    this.los = () => (this._ziarno = (this._ziarno * 16807) % 2147483647) / 2147483647;
  }

  /**
   * @param {number} dt
   * @param {Vector3} hn normalna bohatera (układ planety)
   * @param {Vector3} hf styczna „przód"
   * @param {object} stan wynik `Doba.stan` albo null
   */
  aktualizuj(dt, hn, hf, stan) {
    const C = this.C;
    const R = this.planeta.R;

    // PRĘDKOŚĆ z faktycznie przebytej drogi po kuli.
    if (this._poprzednia && dt > 1e-4) {
      this.predkosc = this.planeta.odleglosc(this._poprzednia, hn) / dt;
    } else {
      this._poprzednia = new Vector3();
    }
    this._poprzednia.copy(hn);

    if (this.predkosc > C.progBiegu) {
      this.doWyrzutu -= dt;
      while (this.doWyrzutu <= 0) {
        const z = C.rozrzutOdstepu;
        this.doWyrzutu += C.odstep * (z[0] + this.los() * (z[1] - z[0]));
        this._wyrzuc(hn, hf);
      }
    } else {
      this.doWyrzutu = 0;
    }

    const barwa = _a.set(C.barwaNoc).lerp(_b.set(C.barwaDzien), stan ? stan.dzien : 1);
    for (const k of this.sztuki) {
      if (!k.sprite.visible) continue;
      k.zycie += (dt / C.zycie) * k.tempoZycia;
      if (k.zycie >= 1) { k.sprite.visible = false; continue; }
      const u = k.zycie;
      // Rośnie szybko i zwalnia (ease-out), gaśnie coraz szybciej (ease-in):
      // kłębek ma buchnąć, a potem rozejść się w nic.
      const rosnie = 1 - (1 - u) * (1 - u);
      k.sprite.scale.setScalar((C.wielkoscOd + (C.wielkoscDo - C.wielkoscOd) * rosnie) * k.skala);
      k.sprite.material.opacity = k.krycie * (1 - u * u);
      k.sprite.material.color.copy(barwa);
      _n.copy(k.n).multiplyScalar(R + C.wysokosc + C.wznoszenie * k.wznosi * rosnie);
      _n.addScaledVector(k.tyl, C.zostawanie * rosnie);
      k.sprite.position.copy(_n);
    }
  }

  _wyrzuc(hn, hf) {
    const C = this.C;
    const los = this.los;
    const mie = (z) => z[0] + los() * (z[1] - z[0]);
    const k = this.sztuki[this.nastepny];
    this.nastepny = (this.nastepny + 1) % this.sztuki.length;

    k.zycie = 0;
    k.sprite.visible = true;
    k.skala = mie(C.rozrzutSkali);
    k.tempoZycia = 1 / mie(C.rozrzutZycia);
    k.wznosi = mie(C.rozrzutWznoszenia);
    k.krycie = C.krycie * (0.7 + los() * 0.5);
    // Obrót sprite'a — bez niego wszystkie kłębki mają ten sam profil
    // i widać, że to jedna tekstura.
    k.sprite.material.rotation = los() * Math.PI * 2;

    // Rozrzut: w bok CIĄGLE (nie na przemian lewo-prawo, bo to daje regularny
    // warkocz) i trochę wzdłuż, żeby odstępy nie były równe także w przestrzeni.
    _f.crossVectors(hn, hf).normalize();
    const bok = (los() * 2 - 1) * C.rozrzutBoczny;
    const wzdluz = (los() * 2 - 1) * C.rozrzutWzdluz;
    k.n.copy(hn)
      .addScaledVector(_f, bok / this.planeta.R)
      .addScaledVector(hf, wzdluz / this.planeta.R)
      .normalize();
    // Odlatuje do tyłu, ale wyraźnie ROZCHODZI SIĘ NA BOKI — bez tego kłębki
    // zostają jedną smugą w osi biegu zamiast rozwiewać się za łapami.
    k.tyl.copy(hf).multiplyScalar(-1)
      .addScaledVector(_f, (los() * 2 - 1) * 0.9)
      .normalize()
      .multiplyScalar(mie(C.rozrzutOdlotu));
    k.sprite.material.opacity = k.krycie;
  }
}
