/**
 * swiatlo.js — światło, które bohater NIESIE. Licznik bez licznika.
 *
 * ZASADA (brief §7): informacja żyje w świecie, nie w HUD-zie. Zamiast
 * „ŚWIATŁO 2/3" wokół bohatera krążą dwie świecące kule, a jego ogon świeci
 * mocniej. Dziecko odczytuje stan z postaci, nie z cyfry.
 *
 * TRZY WARSTWY, każda głośniejsza od poprzedniej:
 *   1. kule — ile ich krąży, tyle masz;
 *   2. bohater — koniec ogona rozświetla się stopniowo, przy komplecie jest
 *      latarnią z prawdziwym światłem punktowym rzucającym blask na trawę;
 *   3. świat — odpowiada Pąk (to już `app.js`), bo liczbę najlepiej czyta się
 *      z celu, a nie z siebie.
 *
 * Kule są dziećmi grupy bohatera, więc jadą z nim po kuli bez żadnej
 * matematyki — grupa jest już ustawiana przez `planeta.ustawN`.
 */
import {
  AdditiveBlending, Color, Group, PointLight,
  Sprite, SpriteMaterial, CanvasTexture, SRGBColorSpace,
} from "three";

export const SWIATLO = {
  ile: 3,              // ile kul mieści się w komplecie
  barwa: 0xffe9a0,
  promienOrbity: 0.62, // w jednostkach bohatera (jest skalowany ×1,75)
  wysokosc: 0.46,
  tempoOrbity: 1.15,   // obrotów na sekundę… dzielone przez liczbę kul
  wielkoscKuli: 0.085,
  mocLatarni: 2.6,     // przy komplecie
  zasiegLatarni: 5.5,
};

let _tekstura = null;
function poswiata() {
  if (_tekstura) return _tekstura;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const x = c.getContext("2d");
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0.00, "rgba(255,255,255,1)");
  g.addColorStop(0.16, "rgba(255,253,240,1)");
  g.addColorStop(0.30, "rgba(255,236,170,0.78)");
  g.addColorStop(1.00, "rgba(255,220,120,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  _tekstura = new CanvasTexture(c);
  _tekstura.colorSpace = SRGBColorSpace;
  return _tekstura;
}

const _c = new Color();

export class Swiatlo {
  /** @param {Group} bohater grupa bohatera — kule wieszamy na niej */
  constructor(bohater, opcje = {}) {
    const C = this.C = { ...SWIATLO, ...opcje };
    this.ile = 0;
    this.t = 0;
    this.grupa = new Group();
    this.grupa.name = "swiatlo-bohatera";
    bohater.add(this.grupa);

    // Latarnia: jedno światło punktowe rosnące razem z liczbą kul. Stoi
    // nisko, żeby kłaść blask na ziemi pod łapami — to ono sprawia, że nocą
    // widać, gdzie się idzie.
    this.latarnia = new PointLight(C.barwa, 0, C.zasiegLatarni, 2);
    this.latarnia.position.set(0, C.wysokosc, 0);
    this.grupa.add(this.latarnia);

    this.kule = [];
    for (let i = 0; i < C.ile; i++) {
      const k = new Group();
      // Sama poświata, BEZ kuli w środku. Nieprzezroczysty rdzeń pod dodawaną
      // poświatą czytał się jako szary krążek: ACES ściąga biel materiału,
      // a sprite dokłada się dookoła, nie na wierzchu. Twardy środek jest
      // więc wpisany w samą teksturę (biel do 30% promienia).
      const aura = new Sprite(new SpriteMaterial({
        map: poswiata(), color: C.barwa, transparent: true,
        blending: AdditiveBlending, depthWrite: false, opacity: 1,
        toneMapped: false,
      }));
      aura.scale.setScalar(C.wielkoscKuli * 9);
      k.add(aura);
      k.visible = false;
      k.scale.setScalar(0.01);
      this.grupa.add(k);
      this.kule.push({ obj: k, wejscie: 0 });
    }
  }

  /**
   * Dokłada jedną kulę. Zwraca `false`, gdy komplet już jest — dzięki temu
   * `app.js` wie, że nie ma czego zbierać.
   */
  dodaj() {
    if (this.ile >= this.C.ile) return false;
    const k = this.kule[this.ile];
    k.obj.visible = true;
    k.wejscie = 0;
    this.ile += 1;
    return true;
  }

  /** Oddaje całe światło (wlot do Pąka). Zwraca, ile go było. */
  oddaj() {
    const bylo = this.ile;
    this.ile = 0;
    for (const k of this.kule) { k.obj.visible = false; k.wejscie = 0; }
    return bylo;
  }

  get komplet() {
    return this.ile >= this.C.ile;
  }

  aktualizuj(dt) {
    const C = this.C;
    this.t += dt;
    const n = Math.max(1, this.ile);
    for (let i = 0; i < this.kule.length; i++) {
      const k = this.kule[i];
      if (!k.obj.visible) continue;
      // Wejście spiralą: nowa kula przylatuje z góry i z zewnątrz, zamiast
      // po prostu się pojawić — bez tego dziecko może nie zauważyć zdobycia.
      k.wejscie = Math.min(1, k.wejscie + dt * 1.6);
      const w = k.wejscie * k.wejscie * (3 - 2 * k.wejscie);
      const kat = this.t * C.tempoOrbity * (Math.PI * 2) / n + (i * Math.PI * 2) / n;
      const r = C.promienOrbity * (1 + (1 - w) * 1.6);
      k.obj.position.set(
        Math.cos(kat) * r,
        C.wysokosc + (1 - w) * 0.9 + Math.sin(this.t * 2.1 + i) * 0.045,
        Math.sin(kat) * r,
      );
      k.obj.scale.setScalar(w);
    }
    // Latarnia rośnie z kwadratem liczby kul — trzecia ma być wyraźnie
    // mocniejsza od drugiej, a nie o jedną trzecią jaśniejsza.
    const u = this.ile / C.ile;
    this.latarnia.intensity = C.mocLatarni * u * u;
    this.latarnia.color.copy(_c.set(C.barwa));
  }
}
