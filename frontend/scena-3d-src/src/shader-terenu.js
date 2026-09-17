/*!
 * SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
 * SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
 *
 * EwolucJA — gra edukacyjna dla dzieci.
 * Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
 * autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
 */
/**
 * shader-terenu.js — PROCEDURALNA SKÓRA PLANETY.
 *
 * Skąd to się wzięło: teren kanciasty malował kolor w wierzchołkach
 * (`vertexColors`), więc plama koloru nie mogła być mniejsza od ścianki,
 * a każda zmiana palety wymagała przeliczenia całej geometrii. Tutaj kolor
 * liczy się w PIKSELU, z kierunku na kuli — plamy są dowolnie drobne,
 * niczego nie trzeba przebudowywać, a geometria niesie tylko jedną liczbę
 * na wierzchołek (`wysForma`: jak wysoko/głęboko leży teren w tym miejscu).
 *
 * DLACZEGO NIE `ShaderMaterial`: `doba.js` mnoży `ziemia.material.color`
 * (dzień → noc → zorza) i dodaje `emissive`, a mapa cieni wymaga pełnego
 * łańcucha `shadowmap`/`fog`/`lights`. Wszystko to jest w `MeshLambertMaterial`
 * za darmo, więc wchodzimy w niego przez `onBeforeCompile` i podmieniamy
 * SAMO ALBEDO. `diffuseColor.rgb *= barwa` zachowuje mnożnik `doba` dokładnie
 * tak, jak dotąd działał na `vColor`.
 *
 * Szum: klasyczny value-noise 3D na hashu (bez tekstur, bez zależności),
 * cztery oktawy. Kierunek jest LOKALNY — wzór jest przybity do planety
 * i kręci się razem z nią, a nie pływa pod bohaterem.
 */
import { Color, MeshLambertMaterial } from "three";

/** Paleta: zieleń w dwóch tonach + szarozielone przetarcie + piasek i dno. */
export const BARWY_TERENU = {
  baza: 0x7aa650,     // spokojna zieleń — do niej wraca wzór przy niskiej `moc`
  jasna: 0x93bd60,    // rozświetlona trawa
  ciemna: 0x5d8f3f,   // trawa w cieniu / gęstsza
  szalwia: 0x7f8f71,  // szarozielone przetarcie (te chłodne plamy z concept artu)
  brzeg: 0xdcd69c,    // kremowy piasek — i przetarcia, i brzeg oczka
  dno: 0x7b7a55,      // błotniste dno niecki
  ziemia: 0x6a4b33,   // przekopana ziemia (grządka fasoli)
  ziemiaJasna: 0x8a6a48, // jej obsypany, suchszy brzeg
};

/** Pokrętła — mapa: `swiat.terenShader`. */
export const STROJENIE_TERENU = {
  skala: 4,        // ile plam na obwód kuli (większe = drobniejsze)
  ziarno: 0,       // przesunięcie szumu: ten sam kod, inny świat
  moc: 0.5,        // JAK GŁOŚNO. 0 = jednolita zieleń, 1 = pełny wzór.
                   // To pokrętło od „rzuca się w oczy" — zawsze zaczynaj od niego.
  kontrast: 1.0,   // rozjazd między jasną a ciemną zielenią
  szalwia: 0.45,   // siła szarozielonych przetarć (0 = brak)
  piasek: 0.35,    // siła kremowych przetarć (0 = brak)
  wzgorza: 0.45,   // o ile wierzchołki wzgórz idą ku jasnej
  glebia: 0.1,     // przy jakiej głębokości niecki kolor jest już dnem
};

const WSPOLNE = /* glsl */ `
varying vec3 vKierTeren;
varying float vWysTeren;
varying float vZiemiaTeren;

uniform vec3 uBazaTeren;
uniform vec3 uJasnaTeren;
uniform vec3 uCiemnaTeren;
uniform vec3 uSzalwiaTeren;
uniform vec3 uPiasekTeren;
uniform vec3 uDnoTeren;
uniform float uSkalaTeren;
uniform float uMocTeren;
uniform float uZiarnoTeren;
uniform float uKontrastTeren;
uniform float uSilaSzalwii;
uniform float uSilaPiasku;
uniform float uWzgorzaTeren;
uniform float uGlebiaTeren;
uniform vec3 uZiemiaTeren;
uniform vec3 uZiemiaJasnaTeren;

float hashTeren(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float szumTeren(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hashTeren(i + vec3(0.0, 0.0, 0.0)), hashTeren(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hashTeren(i + vec3(0.0, 1.0, 0.0)), hashTeren(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(hashTeren(i + vec3(0.0, 0.0, 1.0)), hashTeren(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hashTeren(i + vec3(0.0, 1.0, 1.0)), hashTeren(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
    f.z);
}

/** Cztery oktawy, znormalizowane do ~0..1 (suma amplitud 0.9375). */
float fbmTeren(vec3 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    s += a * szumTeren(p);
    p = p * 2.07 + vec3(19.1, 7.3, 33.7);
    a *= 0.5;
  }
  return s / 0.9375;
}
`;

/**
 * Materiał terenu: Lambert z podmienionym albedo.
 * `opcje`: { barwy, strojenie, fasety } — `fasety: true` wraca do płaskiego
 * cieniowania (ścianki jak dawniej), sam wzór zostaje ten sam.
 */
export function materialTerenu(opcje = {}) {
  const B = { ...BARWY_TERENU, ...(opcje.barwy || {}) };
  const S = { ...STROJENIE_TERENU, ...(opcje.strojenie || {}) };

  const u = {
    uBazaTeren: { value: new Color(B.baza) },
    uJasnaTeren: { value: new Color(B.jasna) },
    uCiemnaTeren: { value: new Color(B.ciemna) },
    uSzalwiaTeren: { value: new Color(B.szalwia) },
    uPiasekTeren: { value: new Color(B.brzeg) },
    uDnoTeren: { value: new Color(B.dno) },
    uZiemiaTeren: { value: new Color(B.ziemia) },
    uZiemiaJasnaTeren: { value: new Color(B.ziemiaJasna) },
    uSkalaTeren: { value: S.skala },
    uMocTeren: { value: S.moc },
    uZiarnoTeren: { value: S.ziarno },
    uKontrastTeren: { value: S.kontrast },
    uSilaSzalwii: { value: S.szalwia },
    uSilaPiasku: { value: S.piasek },
    uWzgorzaTeren: { value: S.wzgorza },
    uGlebiaTeren: { value: Math.max(1e-4, S.glebia) },
  };

  const mat = new MeshLambertMaterial({ color: 0xffffff, flatShading: !!opcje.fasety });

  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u);

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>
        attribute float wysForma;
        attribute float ziemiaForma;
        varying vec3 vKierTeren;
        varying float vWysTeren;
        varying float vZiemiaTeren;`)
      .replace("#include <begin_vertex>", `#include <begin_vertex>
        vKierTeren = normalize(position);
        vWysTeren = wysForma;
        vZiemiaTeren = ziemiaForma;`);

    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>
${WSPOLNE}`)
      .replace("#include <color_fragment>", `#include <color_fragment>
      {
        vec3 k = vKierTeren * uSkalaTeren + uZiarnoTeren;
        float duze = fbmTeren(k);
        float srednie = fbmTeren(k * 2.6 + 5.7);
        float drobne = fbmTeren(k * 7.3 + 13.3);

        // PROGI. fbmTeren to szum wartościowy: skupia się wokół 0,5
        // (zmierzone na 20 tys. próbek: mediana 0,50, 90. centyl 0,65,
        // maksimum ~0,87). Progi typu 0,6–0,95 nie zapalają się prawie
        // nigdy — stąd te ciasne, przesunięte w dół zakresy niżej.

        // 1. dwa tony zieleni — wielka, miękka plama
        float t = clamp((duze - 0.5) * uKontrastTeren + 0.5, 0.0, 1.0);
        vec3 barwa = mix(uCiemnaTeren, uJasnaTeren, smoothstep(0.35, 0.68, t));

        // 2. chłodne szarozielone przetarcia
        barwa = mix(barwa, uSzalwiaTeren, smoothstep(0.55, 0.75, srednie) * uSilaSzalwii);

        // 3. kremowe rozjaśnienia — drobne, ale zbierają się w kępy:
        //    drobny szum daje kształt, średni decyduje GDZIE kępa wypada.
        float kremy = smoothstep(0.56, 0.76, drobne) * smoothstep(0.42, 0.64, srednie);
        barwa = mix(barwa, uPiasekTeren, kremy * uSilaPiasku);

        // 4. teren: wierzchołki wzgórz suchsze, niecka piaskowa i błotnista
        barwa = mix(barwa, uJasnaTeren, clamp(vWysTeren * uWzgorzaTeren, 0.0, 0.5));
        // 5. ŚCISZENIE. Cały wzór wraca ku spokojnej zieleni — planeta ma
        //    być tłem dla bohatera, nie wzorkiem na tapecie. Niecka jest
        //    POZA ściszaniem: brzeg stawu to informacja, nie ozdoba.
        barwa = mix(uBazaTeren, barwa, uMocTeren);

        float wglab = clamp(-vWysTeren / uGlebiaTeren, 0.0, 1.0);
        barwa = mix(barwa, uPiasekTeren, smoothstep(0.06, 0.55, wglab + (drobne - 0.5) * 0.3));
        barwa = mix(barwa, uDnoTeren, smoothstep(0.5, 1.0, wglab));

        // 6. PRZEKOPANA ZIEMIA (grządka fasoli): ta sama mechanika co brzeg
        //    stawu — waga z geometrii, brzeg postrzępiony drobnym szumem,
        //    środek ciemniejszy i wilgotny, obrzeże jaśniejsze i suche.
        float ziem = clamp(vZiemiaTeren + (drobne - 0.5) * 0.45, 0.0, 1.0);
        barwa = mix(barwa, uZiemiaJasnaTeren, smoothstep(0.12, 0.45, ziem));
        barwa = mix(barwa, uZiemiaTeren, smoothstep(0.5, 0.95, ziem + (srednie - 0.5) * 0.2));

        diffuseColor.rgb *= barwa;
      }`);

    mat.userData.shaderTerenu = shader;
  };

  // Dostęp do pokręteł w locie: `__POC.app.ziemia.material.userData.uniformyTerenu`
  mat.userData.uniformyTerenu = u;
  mat.customProgramCacheKey = () => "teren-proceduralny";
  return mat;
}
