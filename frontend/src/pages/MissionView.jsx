import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { upload } from "@vercel/blob/client";
import { api, session } from "../services/api.js";
import { API_BASE } from "../config.js";
import { useAppData } from "../contexts/AppData.jsx";
import NarratorVoice from "../components/NarratorVoice.jsx";
import PageShell from "../components/PageShell.jsx";
import TopBar from "../components/TopBar.jsx";
import TabBar from "../components/TabBar.jsx";
import Celebration from "../components/Celebration.jsx";
import { Sparkle, ScrollIcon, MissionScroll, Coin } from "../components/art.jsx";
import MentorBubble from "../components/MentorBubble.jsx";
import { fx } from "../services/soundFx.js";
import { ttsPlayer } from "../services/ttsPlayer.js";
import bgMusic from "../services/bgMusic.js";

export default function MissionView() {
  const navigate = useNavigate();
  // Misja z globalnego kontekstu - byla zaladowana razem z domem, brak czekania
  const { mission, error: ctxError, refreshAll } = useAppData();
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [error, setError] = useState(ctxError);
  // Photo upload state (Vercel Blob)
  const fileInputRef = useRef(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null); // local blob URL do preview podczas uploadu
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (!session.getPlayer()) navigate("/onboarding");
  }, [navigate]);

  // KRITYCZNE: za kazdym wejsciem na strone Zadania odswiez cache w AppData.
  // Bez tego — gdy mentor wyslal nowa misje, uczen widzi cache'owana starsza (lub "Misja nie znaleziona").
  useEffect(() => {
    try { refreshAll?.(); } catch {}
  }, [refreshAll]);

  // Plynne sciszenie muzyki na czas wizyty na MissionView (duck on mount, unduck on leave).
  useEffect(() => {
    try { bgMusic.duck(); } catch {}
    return () => { try { bgMusic.unduck(); } catch {} };
  }, []);

  useEffect(() => {
    if (step === 1) {
      const id = setTimeout(() => setStep(2), 2000);
      return () => clearTimeout(id);
    }
  }, [step]);

  // Wywolywane bezposrednio z onClick (user gesture) - bypass autoplay policy
  function openScroll() {
    // BLOKADA: gdy status = submitted, nie pozwalamy otworzyc zwoju (czeka na weryfikacje mentora).
    // Dziecko widzi tylko bubble z informacja, ze odpowiedz jest sprawdzana.
    if (mission?.status === "submitted") {
      try { fx.gentleMagical(0.3); } catch {}
      return;
    }
    // SFX otwarcia zwoju - dyskretne, zeby nie zaglusyc lektora ani muzyki
    fx.magicalAncient(0.18); // ambientowy szum tla - 18% (jeszcze cisszej, glos lektora ma byc dominujacy)
    fx.dopamine(0.3);        // delikatny puff zamiast peniego dopaminowego dzwieku
    // KRITYCZNE: explicit unlock TTS w gestie usera. Bez tego NarratorVoice
    // mountowany przy step 1 widzi unlocked=false i czeka na polling co 500ms.
    ttsPlayer.unlock();
    setStep(1);
    setTimeout(() => setStep(2), 1200);
  }

  // Krotki burst konfetti przy otwarciu zwoju (WOW efekt)
  const [openBurst, setOpenBurst] = useState(false);
  useEffect(() => {
    if (step === 2) {
      setOpenBurst(true);
      const id = setTimeout(() => setOpenBurst(false), 2400);
      return () => clearTimeout(id);
    }
  }, [step]);

  // Zwoj otwarty (step 2 lub 3) = ciemne tlo + glow
  const scrollOpen = step === 2 || step === 3;
  // Ciemny overlay zaczyna fade-in od step 1 (klikniecie 'Rozwin') - plynne przejscie kolor tla
  const darkOverlayOn = step === 1 || step === 2 || step === 3;

  const narrationText = useMemo(() => {
    if (!mission) return "";
    return [mission.narrative_intro, mission.body].filter(Boolean).join(" ");
  }, [mission]);

  async function handleSubmit() {
    if (!mission || (!answer.trim() && !mediaUrl)) return;
    setSubmitting(true);
    try {
      await api.submitMissionProof(mission.mission_id, {
        proof_text: answer,
        proof_media_url: mediaUrl || null,
      });
      // Dzwiek nagrody + Celebration overlay (Lottie) + reward toast.
      fx.dopamine(0.6);
      setCelebrating(true);
      try { await refreshAll(); } catch {}
      // Reward screen widoczny ~2.8s (czas na obejrzenie Lottie + nagrody za samo wyslanie).
      // Duza nagroda za misje przychodzi gdy Mentor zatwierdzi (RewardPopup w HintPopup).
      setTimeout(() => navigate("/world", { replace: true }), 2800);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  // Upload zdjecia do Vercel Blob (klient -> direct upload, bypass 4.5MB Vercel Function body limit)
  async function handlePickPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Wybierz plik graficzny (zdjęcie).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Plik jest za duży (max 10 MB). Spróbuj zrobić nowe zdjęcie.");
      return;
    }
    setUploadError(null);
    setUploading(true);
    // Lokalny preview od razu - user widzi co wybral zanim upload sie skonczy
    const localUrl = URL.createObjectURL(file);
    setMediaPreview(localUrl);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const pathname = `proofs/${mission?.mission_id || "no-mission"}/${Date.now()}.${ext}`;
      const result = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: `${API_BASE}/uploads/handler`,
      });
      setMediaUrl(result.url);
    } catch (err) {
      console.error("[photo upload]", err);
      setUploadError("Nie udało się wysłać zdjęcia. Spróbuj jeszcze raz.");
      setMediaPreview(null);
    } finally {
      setUploading(false);
    }
  }

  function clearPhoto() {
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaPreview(null);
    setMediaUrl(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  if (error) {
    return (
      <PageShell>
        <TopBar />
        <div style={{ padding: 40 }}>
          <p style={{ color: "#B85B47" }}>{error}</p>
        </div>
        <TabBar current="mission" />
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Plynnie pojawiajacy sie ciemny overlay - zaczyna fade-in od momentu kilkniecia 'Rozwin zwoj' */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: darkOverlayOn ? 1 : 0,
          transition: "opacity 1.2s cubic-bezier(.4, 0, .2, 1)",
          background:
            "radial-gradient(ellipse at 50% 35%, #2A1B5C 0%, #1A1238 45%, #0F0828 100%)",
        }}
      />
      <TopBar />

      <div className="screen-scroll" style={{
        flex: 1,
        /* Symetryczny padding + justify-content: center daje wycentrowanie zawartosci
           w pelnej widocznej strefie miedzy TopBar a TabBar (zwoj + form zawsze w srodku ekranu).
           padding-top/bottom rowne -> osi pionowa centruje sie wzgledem srodka widocznego obszaru. */
        padding: "8px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        position: "relative",
        zIndex: 1,
        justifyContent: "center",
      }}>
        {!mission && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "40px 0" }}>
            <div style={{ animation: "float-mid 3s ease-in-out infinite" }}>
              <ScrollIcon size={80} />
            </div>
            <p className="t-hand" style={{ fontSize: 18, color: "var(--p-ink-soft)", margin: 0, textAlign: "center" }}>
              Kronika szuka tropu dla Ciebie…
            </p>
          </div>
        )}
        {/* Etapy 0–2: zwoj zamkniety / w trakcie rozwijania / otwarty z tresci misji.
            Rezerwujemy stale miejsce dla CTA pod zwojem zeby pozycja zwoju nie skakala miedzy stanami. */}
        {mission && step !== 3 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 0, width: "100%" }}>
            <div
              style={{
                animation: step === 0 ? "float-mid 3s ease-in-out infinite" : "none",
                position: "relative",
              }}
            >
              {/* GLOW HALO za zwojem - 2 warstwy dla WOW efektu */}
              {scrollOpen && (
                <>
                  {/* Warstwa zewnetrzna - duza, miekka, fioletowo-purpurowa aura */}
                  <div
                    aria-hidden="true"
                    className="mission-scroll-halo-outer"
                    style={{
                      position: "absolute",
                      inset: "-60% -40%",
                      zIndex: 0,
                      pointerEvents: "none",
                      background:
                        "radial-gradient(ellipse at center, rgba(180,130,255,.55) 0%, rgba(140,90,220,.40) 30%, rgba(80,40,160,.20) 60%, transparent 80%)",
                      filter: "blur(20px)",
                    }}
                  />
                  {/* Warstwa wewnetrzna - intensywna ciepla zlota poswiata */}
                  <div
                    aria-hidden="true"
                    className="mission-scroll-halo-inner"
                    style={{
                      position: "absolute",
                      inset: "-25% -15%",
                      zIndex: 0,
                      pointerEvents: "none",
                      background:
                        "radial-gradient(ellipse at center, rgba(255,235,170,.85) 0%, rgba(255,200,100,.65) 25%, rgba(255,160,60,.35) 50%, transparent 75%)",
                      filter: "blur(12px)",
                      mixBlendMode: "screen",
                    }}
                  />
                </>
              )}
              <MissionScroll
                state={step === 0 ? "closed" : "open"}
                sealed={step === 0 && mission.status === "submitted"}
                width={360}
                onClick={() => {
                  if (step === 0 && mission.status !== "submitted") {
                    openScroll();
                  } else if (step === 2 && mission.status === "pending") {
                    setStep(0);
                  }
                }}
              >
                {/* Ikonka pieczeci dla REJECTED (do doprawki). Submitted juz ma fioletowa wstege na zwoj2.svg. */}
                {mission.status === "rejected" && (
                  <div style={{
                    position: "absolute", top: 6, right: 10,
                    width: 38, height: 38, borderRadius: "50%",
                    background: "linear-gradient(180deg,#FFD269,#E89A3D)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, color: "#fff",
                    boxShadow: "0 2px 6px rgba(80,40,140,.45), inset 0 1.5px 0 rgba(255,255,255,.4)",
                    zIndex: 2,
                  }}
                    title="Do doprawki"
                  >
                    🔄
                  </div>
                )}

                {/* TYTUL + TRESC MISJI - wyszarzone gdy zapieczetowane (zadanie juz wykonane) */}
                <div style={{ opacity: mission.status === "submitted" ? 0.5 : 1, transition: "opacity .4s ease" }}>
                  <h2 className="t-display" style={{ fontSize: 18, lineHeight: 1.2, margin: "0 0 8px", color: "#3B2A12", textAlign: "center" }}>
                    {mission.title}
                  </h2>
                  <p className="t-hand" style={{ fontSize: 15, lineHeight: 1.35, margin: 0, color: "#5C4220", textAlign: "center" }}>
                    {mission.body}
                  </p>
                </div>

                {/* CTA "Daj Odpowiedz" WEWNATRZ pergaminu - widoczne tylko w step 2 i tylko gdy status pending */}
                {step === 2 && mission.status === "pending" && (
                  <button
                    className="btn btn-leaf pop-in"
                    style={{
                      marginTop: 14, alignSelf: "center", padding: "8px 22px",
                      fontSize: 15, fontWeight: 800,
                    }}
                    onClick={(e) => { e.stopPropagation(); setStep(3); }}
                  >
                    Daj Odpowiedź ✦
                  </button>
                )}

                {/* TWOJA ODPOWIEDZ (po wyslaniu) - cytat z proof_text lub miniatura zdjecia */}
                {step === 2 && mission.status === "submitted" && (
                  <>
                    {/* Separator ozdobny */}
                    <div style={{ alignSelf: "center", margin: "14px 0 8px", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 24, height: 1, background: "rgba(122,77,194,.35)" }} />
                      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "var(--p-magic-dk)" }}>TWOJA ODPOWIEDŹ</span>
                      <span style={{ width: 24, height: 1, background: "rgba(122,77,194,.35)" }} />
                    </div>
                    {mission.submitted_proof?.proof_text && (
                      <p className="t-hand" style={{ fontSize: 16, lineHeight: 1.35, margin: "0 8px", color: "#3B2A12", textAlign: "center" }}>
                        „{mission.submitted_proof.proof_text}"
                      </p>
                    )}
                    {mission.submitted_proof?.proof_media_url && (
                      <div style={{ marginTop: 8, alignSelf: "center" }}>
                        <img
                          src={mission.submitted_proof.proof_media_url}
                          alt="Twoje zdjęcie"
                          style={{ maxWidth: 180, maxHeight: 140, borderRadius: 10, border: "2px solid rgba(122,77,194,.30)", boxShadow: "0 2px 8px rgba(80,40,140,.25)" }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                    {!mission.submitted_proof?.proof_text && !mission.submitted_proof?.proof_media_url && (
                      <p style={{ fontSize: 12, color: "var(--p-ink-soft)", textAlign: "center", margin: "0", fontStyle: "italic" }}>
                        (twoja odpowiedź dotarła do Mędrca ✦)
                      </p>
                    )}
                    {/* MentorBubble z glowa maga - reuzywalny komponent dla wszystkich powiadomien od mentora */}
                    <div style={{ marginTop: 12, alignSelf: "stretch", padding: "0 4px", maxWidth: 320 }} onClick={(e) => e.stopPropagation()}>
                      <MentorBubble
                        title="Mentor"
                        text="Twoja odpowiedź jest sprawdzana przez Mentora."
                        tone="magic"
                        size="sm"
                      />
                    </div>
                  </>
                )}

                {step === 2 && mission.status === "verified" && (
                  <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(99,153,34,.18)", borderRadius: 12, alignSelf: "center", maxWidth: 300, border: "1.5px solid rgba(99,153,34,.30)" }}>
                    <p className="t-display" style={{ fontSize: 14, color: "#3B6D11", margin: "0 0 4px", textAlign: "center" }}>
                      ✨ Mędrzec przeczytał!
                    </p>
                    <p style={{ fontSize: 12, color: "#3B6D11", margin: 0, textAlign: "center", lineHeight: 1.4, fontWeight: 600 }}>
                      Twój wysiłek poznał świat.<br />
                      Sprawdź swój skarbiec — czeka tam nagroda.
                    </p>
                  </div>
                )}
                {step === 2 && mission.status === "rejected" && (
                  <>
                    {/* Pokaz tez wyslana odpowiedz (zwiniete pod separatorem) */}
                    {mission.submitted_proof?.proof_text && (
                      <div style={{ alignSelf: "center", margin: "12px 8px 4px", padding: "8px 12px", background: "rgba(120,90,30,.08)", borderRadius: 10, maxWidth: 280 }}>
                        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.2, color: "#7A4D10", marginBottom: 2, textAlign: "center" }}>POPRZEDNIA ODPOWIEDŹ</div>
                        <p className="t-hand" style={{ fontSize: 13, lineHeight: 1.3, margin: 0, color: "#5C4220", textAlign: "center", opacity: 0.7 }}>
                          „{mission.submitted_proof.proof_text}"
                        </p>
                      </div>
                    )}
                    <div style={{ marginTop: 8, padding: "10px 14px", background: "rgba(232,154,61,.18)", borderRadius: 12, alignSelf: "center", maxWidth: 300, border: "1.5px solid rgba(232,154,61,.35)" }}>
                      <p className="t-display" style={{ fontSize: 14, color: "#7A4D10", margin: "0 0 4px", textAlign: "center" }}>
                        Mędrzec prosi o doprawkę
                      </p>
                      {mission.gm_verification?.comment && (
                        <p className="t-hand" style={{ fontSize: 14, color: "#5C4220", margin: "4px 0 0", textAlign: "center", lineHeight: 1.3, fontStyle: "italic" }}>
                          „{mission.gm_verification.comment}"
                        </p>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); setStep(3); }}
                        style={{
                          marginTop: 10, padding: "6px 14px", borderRadius: 999, border: "none",
                          background: "linear-gradient(180deg,#FFD269,#E89A3D)", color: "#4A2A0E",
                          fontSize: 12, fontWeight: 800, cursor: "pointer",
                          boxShadow: "0 2px 0 #B47322",
                        }}
                      >
                        ✦ Spróbuj jeszcze raz
                      </button>
                    </div>
                  </>
                )}
              </MissionScroll>
              {step === 0 && (
                <>
                  <div style={{ position: "absolute", top: -6, left: -22 }}><Sparkle size={20} /></div>
                  <div style={{ position: "absolute", bottom: 0, right: -26 }}><Sparkle size={16} delay={0.4} /></div>
                </>
              )}
            </div>

            {/* Podpowiedz + CTA rozwijania (alternatywa do klikniecia w zwoj) */}
            {/* Stala strefa pod zwojem - zarezerwowane miejsce na CTA + lektora.
                Zachowuje pozycje zwoju gdy zmienia sie step, bez "skoku" w layoucie.
                Lektor mountowany od step 1 (compact, autoplay z 600ms delay = zaraz po dzwiekach),
                widoczne kontrolki pojawia sie przy step 2 (ten sam instance audio - bez przerwy). */}
            <div style={{ width: "100%", maxWidth: 360, marginTop: 20, minHeight: 100, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              {step === 0 && mission.status === "pending" && (
                <button
                  className="btn btn-magic btn-block pop-in"
                  style={{ width: "100%" }}
                  onClick={openScroll}
                >
                  Rozwiń zwój ✦
                </button>
              )}
              {step === 0 && mission.status === "submitted" && (
                <>
                  {/* Status: submitted - zwoj zablokowany do czasu weryfikacji.
                      Brak CTA do otwarcia, tylko MentorBubble z komunikatem. */}
                  <div
                    aria-disabled="true"
                    className="btn btn-ghost btn-block pop-in"
                    style={{
                      width: "100%", opacity: 0.55,
                      cursor: "not-allowed",
                      pointerEvents: "none",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                  >
                    🔒 Zwój zapieczętowany
                  </div>
                  <div style={{ width: "100%", maxWidth: 360, marginTop: 8 }}>
                    <MentorBubble
                      title="Mentor"
                      text="Twoja odpowiedź jest sprawdzana przez Mentora. Wróć tu wkrótce."
                      tone="magic"
                      size="md"
                    />
                  </div>
                </>
              )}
              {step === 0 && mission.status === "verified" && (
                <button
                  className="btn btn-leaf btn-block pop-in"
                  style={{ width: "100%" }}
                  onClick={openScroll}
                >
                  ✨ Zobacz nagrodę
                </button>
              )}
              {step === 0 && mission.status === "rejected" && (
                <>
                  <button
                    className="btn btn-magic btn-block pop-in"
                    style={{ width: "100%", background: "linear-gradient(180deg,#FFD269,#E89A3D)", color: "#4A2A0E", boxShadow: "0 2px 0 #B47322" }}
                    onClick={openScroll}
                  >
                    🔄 Spróbuj jeszcze raz
                  </button>
                  <p className="t-hand" style={{ fontSize: 15, color: "var(--p-ink-soft)", margin: "4px 0 0", textAlign: "center", lineHeight: 1.3 }}>
                    Mędrzec prosi o doprawkę
                  </p>
                </>
              )}
              {(step === 1 || step === 2) && (
                <div style={{ transform: step === 2 ? "scale(1.5)" : "scale(1)", transformOrigin: "center top", marginTop: step === 2 ? 4 : 0 }}>
                  <NarratorVoice
                    text={narrationText}
                    land="las_decyzji"
                    tone="mystery"
                    inlinePauses
                    autoPlay
                    autoPlayDelay={step === 1 ? 600 : 0}
                    compact={step === 1}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Etap 3: formularz dowodu - paper/piaskowy styl, cienkie obramowania, zielone CTA */}
        {mission && step === 3 && (
          <div className="pop-in" style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 420 }}>
            <div style={{
              background: "linear-gradient(180deg, #FCF5E1 0%, #F4E3B8 100%)",
              border: "1px solid #E1CB94",
              borderRadius: 16,
              padding: "12px 14px",
              boxShadow: "0 2px 6px rgba(120,90,30,.10)",
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, color: "#7A4D10" }}>
                Twoja odpowiedź / Dowód
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Napisz odpowiedź albo opowiedz, jak Ci poszło…"
                style={{
                  width: "100%", minHeight: 90, marginTop: 6, padding: 12,
                  border: "1px solid rgba(168,122,42,.30)",
                  borderRadius: 12,
                  background: "rgba(255,250,235,.7)",
                  fontFamily: "Caveat, cursive", fontSize: 20, color: "var(--p-ink)",
                  resize: "none", outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{
              background: "linear-gradient(180deg, #FCF5E1 0%, #F4E3B8 100%)",
              border: "1px solid #E1CB94",
              borderRadius: 16,
              padding: "12px 14px",
              boxShadow: "0 2px 6px rgba(120,90,30,.10)",
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, color: "#7A4D10" }}>
                Dodaj zdjęcie (opcjonalnie)
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePickPhoto}
                style={{ display: "none" }}
              />
              {!mediaPreview && !uploading && (
                <button
                  className="btn btn-ghost btn-block"
                  style={{ marginTop: 8, border: "1px solid rgba(168,122,42,.30)" }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  📷 Zrób / wybierz zdjęcie
                </button>
              )}
              {uploading && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, padding: "10px 12px", background: "rgba(168,122,42,.10)", borderRadius: 10 }}>
                  <span style={{ animation: "sparkle 1.4s ease-in-out infinite" }}>✦</span>
                  <span style={{ fontSize: 13, color: "#7A4D10", fontWeight: 700 }}>Wysyłam zdjęcie…</span>
                </div>
              )}
              {mediaPreview && (
                <div style={{ marginTop: 8, position: "relative" }}>
                  <img
                    src={mediaPreview}
                    alt="dowód"
                    style={{
                      width: "100%", maxHeight: 220, objectFit: "contain",
                      borderRadius: 12,
                      border: "1px solid rgba(168,122,42,.30)",
                      background: "#fff",
                    }}
                  />
                  {mediaUrl && (
                    <span style={{ position: "absolute", top: 8, left: 8, fontSize: 11, fontWeight: 800, color: "#fff", background: "rgba(95,167,111,.95)", padding: "3px 8px", borderRadius: 999 }}>
                      ✓ wysłane
                    </span>
                  )}
                  <button
                    onClick={clearPhoto}
                    style={{ position: "absolute", top: 8, right: 8, padding: "4px 10px", borderRadius: 999, border: "none", background: "rgba(232,75,160,.92)", color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
                  >🗑 usuń</button>
                </div>
              )}
              {uploadError && (
                <div style={{ marginTop: 6, fontSize: 12, color: "#B85B47", fontWeight: 700 }}>
                  {uploadError}
                </div>
              )}
            </div>
            {/* CTA - zielony (btn-leaf), text "Wyslij" */}
            <button
              className="btn btn-leaf btn-block"
              style={{ fontSize: 16, padding: "14px 18px" }}
              disabled={(!answer.trim() && !mediaUrl) || submitting || uploading || mission.status === "submitted"}
              onClick={handleSubmit}
            >
              {submitting ? "Wysyłam…" : uploading ? "Czekaj — zdjęcie się wysyła…" : mission.status === "submitted" ? "🔒 Już wysłane" : mission.status === "rejected" ? "✦ Wyślij poprawioną odpowiedź" : "✓ Wyślij"}
            </button>
          </div>
        )}
      </div>
      <Celebration active={celebrating || openBurst} />

      {/* Reward overlay — pokazuje sie po wyslaniu odpowiedzi (~2.8s przed navigate /world) */}
      {celebrating && (
        <div
          aria-live="polite"
          style={{
            position: "fixed", inset: 0, zIndex: 60,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20, pointerEvents: "none",
            animation: "fadeIn .35s ease forwards",
          }}
        >
          <div style={{
            background: "linear-gradient(180deg, #FFF8E0 0%, #FCE9B3 100%)",
            borderRadius: 26,
            padding: "26px 28px",
            maxWidth: 360, width: "100%",
            textAlign: "center",
            boxShadow: "0 4px 0 rgba(180,115,34,.35), 0 18px 44px rgba(120,80,10,.45), inset 0 0 0 1.5px rgba(255,255,255,.65)",
            transform: "scale(1)",
            animation: "pop-in .55s cubic-bezier(.34,1.56,.64,1) forwards",
          }}>
            <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 6 }}>✨</div>
            <h3 className="t-display" style={{ fontSize: 26, margin: "4px 0 8px", color: "#3B2A12" }}>
              Wysłane do Mędrca!
            </h3>
            <p style={{ fontSize: 14, color: "#7A4D10", margin: "0 0 14px", lineHeight: 1.4 }}>
              Twój zwój już płynie do Mędrca. Sprawdzi i wyśle nagrodę.
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,.92)",
              padding: "8px 18px 8px 12px", borderRadius: 999,
              boxShadow: "inset 0 0 0 1.5px #E1B66A, 0 2px 6px rgba(120,80,10,.18)",
              fontSize: 18, fontWeight: 900, color: "#7A4D10",
              letterSpacing: 0.4,
            }}>
              <Coin size={24} anim /> +5
            </div>
            <div style={{ fontSize: 11, color: "var(--p-ink-soft)", marginTop: 10, fontWeight: 700, letterSpacing: 0.5 }}>
              ZA SAMO WYSŁANIE · DUŻA NAGRODA PO AKCEPTACJI
            </div>
          </div>
        </div>
      )}

      <TabBar current="mission" />
    </PageShell>
  );
}
