/**
 * analityka — zdarzenia do Vercel Web Analytics, z wyciszeniem dla autora.
 *
 * DLACZEGO NIE PO IP: Vercel Web Analytics nie ma listy wykluczonych adresów.
 * Filtr może działać wyłącznie w przeglądarce, zanim zdarzenie wyjdzie — i tak
 * to tu jest zrobione. Trzy powody, dla których nic nie wysyłamy:
 *
 *   1. jesteśmy „u siebie" (localhost, sieć domowa, build deweloperski) —
 *      to samo `czyLokalnie()`, którego używa tryb testowy,
 *   2. w przeglądarce leży zapis `ewolucja.bez-analityki`,
 *   3. w adresie jest `?analityka=off` — i to jednocześnie ZAPISUJE wyłączenie
 *      na stałe w tej przeglądarce (`?analityka=on` cofa).
 *
 * Praktycznie: wejdź raz z `?analityka=off` na każdym urządzeniu, z którego
 * testujesz publikację, i twoje wizyty przestaną się liczyć. Statystyki
 * zbiorcze Vercela (odsłony) i tak zliczą wejście, jeśli skrypt się załaduje,
 * więc `beforeSend` zwraca `null` dla WSZYSTKIEGO, także dla odsłon.
 *
 * Nazwy zdarzeń są po polsku i z podkreśleniami, bo tak wyglądają w panelu
 * Vercela i mają być czytelne bez tłumaczenia.
 */
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { track } from "@vercel/analytics";
import { czyLokalnie } from "./dev.js";

const KLUCZ = "ewolucja.bez-analityki";

function zParametru() {
  try {
    const v = new URLSearchParams(window.location.search).get("analityka");
    if (v === null) return null;
    return v === "off" || v === "0" || v === "false";
  } catch {
    return null;
  }
}

/** Czy zdarzenia mają być wyciszone. Parametr w adresie jest zapamiętywany. */
export function wyciszone() {
  const zAdresu = zParametru();
  if (zAdresu !== null) {
    try { localStorage.setItem(KLUCZ, zAdresu ? "1" : "0"); } catch {}
    return zAdresu || czyLokalnie();
  }
  try { if (localStorage.getItem(KLUCZ) === "1") return true; } catch {}
  return czyLokalnie();
}

/**
 * Wyślij zdarzenie. Wartości muszą być płaskie (tekst, liczba, prawda/fałsz) —
 * Vercel odrzuca zagnieżdżone obiekty, więc lepiej niech to nie wyjdzie z
 * aplikacji, niż ma zginąć po drodze.
 */
export function zdarzenie(nazwa, dane) {
  if (wyciszone()) return;
  try {
    const czyste = {};
    Object.entries(dane || {}).forEach(([k, v]) => {
      if (v === null || v === undefined) return;
      czyste[k] = typeof v === "object" ? String(v) : v;
    });
    track(nazwa, Object.keys(czyste).length ? czyste : undefined);
  } catch {}
}

/** Wpinane raz, w `main.jsx`. */
export default function Analityka() {
  return <Analytics beforeSend={(e) => (wyciszone() ? null : e)} />;
}
