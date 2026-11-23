import React from "react";
import { AbsoluteFill, random } from "remotion";
import { Photo, PhotoKey } from "../../components/Photo";
import { COLORS } from "../../theme";
import { SANS, SERIF } from "../../fonts";
import { EASE, tween } from "../../lib/anim";
import { BEAT } from "../timeline";

/** Retombée rapide après un choc (0 → 1 → 0), pour les « coups » sur le temps. */
export const hit = (f: number, at: number, len = 8) => (f < at ? 0 : Math.exp(-(f - at) / (len / 3)));

/**
 * Accroche : quatre créations coupées sur le temps, et le titre qui claque
 * mot à mot (un mot par temps).
 */
const MONTAGE: { photo: PhotoKey; focus: string }[] = [
  { photo: "moelleux", focus: "50% 45%" },
  { photo: "mini-cupcakes", focus: "55% 50%" },
  { photo: "cake-noir-or", focus: "50% 40%" },
  { photo: "tarte-framboise", focus: "50% 58%" },
];
const WORDS = [
  { text: "VOS", gold: false },
  { text: "GOURMANDISES", gold: false },
  { text: "EN QUELQUES", gold: false },
  { text: "CLICS", gold: true },
];

export const Montage: React.FC<{ f: number; end: number }> = ({ f, end }) => {
  if (f >= end + 2) return null;
  const i = Math.min(MONTAGE.length - 1, Math.floor(f / BEAT));
  const local = f - i * BEAT;
  const punch = tween(local, 0, 10, 1.16, 1.02, EASE.out);
  const flash = hit(f, i * BEAT, 4) * 0.35;
  return (
    <AbsoluteFill style={{ opacity: tween(f, end - 3, end + 2, 1, 0) }}>
      <Photo
        photo={MONTAGE[i].photo}
        zoom={punch}
        focus={MONTAGE[i].focus}
        style={{ inset: 0 }}
        imgStyle={{ transform: `scale(${punch}) rotate(${(i % 2 ? 1 : -1) * tween(local, 0, 10, 2, 0, EASE.out)}deg)` }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(18,12,9,0.75) 0%, rgba(18,12,9,0.25) 45%, rgba(18,12,9,0.55) 100%)" }} />
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

/** Le titre de l'accroche, un mot par temps, puis en entier sur la photo. */
export const HookTitle: React.FC<{ f: number; out: number }> = ({ f, out }) => {
  const o = tween(f, out - 6, out + 4, 1, 0);
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 300, width: 1080, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      {WORDS.map((w, k) => {
        const at = k * BEAT;
        if (f < at) return <div key={k} style={{ height: k === 1 ? 128 : 116 }} />;
        const slam = tween(f, at, at + 7, 1.45, 1, EASE.out);
        const a = tween(f, at, at + 3, 0, 1);
        return (
          <div
            key={k}
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: k === 1 ? 118 : 104,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: w.gold ? COLORS.goldLight : COLORS.ivory,
              transform: `scale(${slam})`,
              opacity: a,
              textShadow: "0 8px 40px rgba(0,0,0,0.55)",
              whiteSpace: "nowrap",
            }}
          >
            {w.text}
          </div>
        );
      })}
    </div>
  );
};

const CARD_STYLE = [
  { bg: `linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.gold})`, ink: COLORS.ink, num: "rgba(18,12,9,0.12)" },
  { bg: COLORS.cream, ink: COLORS.ink, num: "rgba(134,100,47,0.16)" },
  { bg: COLORS.ink, ink: COLORS.goldLight, num: "rgba(226,199,150,0.1)" },
  { bg: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDeep})`, ink: COLORS.ivory, num: "rgba(18,12,9,0.14)" },
];
const CARD_TEXT = [["CHOISISSEZ"], ["AJOUTEZ", "AU PANIER"], ["VÉRIFIEZ", "VOTRE PANIER"], ["ENVOYEZ SUR", "WHATSAPP"]];

/**
 * Titre d'étape plein cadre : un panneau traverse l'écran sur le premier
 * temps de l'étape, le titre claque, puis le panneau repart et dévoile la
 * suite (transition « coup de fouet »).
 */
export const StepCard: React.FC<{ f: number; at: number; index: number }> = ({ f, at, index }) => {
  const t = f - at;
  if (t < -8 || t > 30) return null;
  const inn = tween(t, -8, 2, 1, 0, EASE.out); // 1 → 0 : le panneau arrive de la droite
  const out = tween(t, 20, 30, 0, 1, EASE.in); // 0 → 1 : il repart vers la gauche
  const x = inn * 1250 - out * 1250;
  const st = CARD_STYLE[index % CARD_STYLE.length];
  const slam = tween(t, 0, 8, 1.35, 1, EASE.out);
  const sub = tween(t, 3, 9, 0, 1);
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}px) skewX(${(inn - out) * -8}deg)`, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: st.bg }} />
      <div
        style={{
          position: "absolute",
          right: -40,
          top: 470,
          fontFamily: SERIF,
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: 760,
          lineHeight: 0.8,
          color: st.num,
          transform: `translateX(${tween(t, 0, 30, 40, -40)}px)`,
        }}
      >
        {index + 1}
      </div>
      <div style={{ position: "absolute", left: 80, top: 760, right: 60 }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: "0.3em", color: st.ink, opacity: sub }}>
          {`ÉTAPE ${index + 1} / 4`}
        </div>
        <div style={{ height: 22 }} />
        <div style={{ transform: `scale(${slam})`, transformOrigin: "0% 50%" }}>
          {CARD_TEXT[index].map((line, k) => (
            <div key={k} style={{ fontFamily: SANS, fontWeight: 800, fontSize: 112, lineHeight: 1.02, letterSpacing: "-0.03em", color: st.ink, whiteSpace: "nowrap" }}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Éclat doré : petites étincelles projetées depuis un point (repère du film). */
export const Burst: React.FC<{ f: number; at: number; x: number; y: number; count?: number; size?: number; seed?: string }> = ({
  f,
  at,
  x,
  y,
  count = 16,
  size = 1,
  seed = "burst",
}) => {
  const t = f - at;
  if (t < 0 || t > 26) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 90 * size,
          top: y - 90 * size,
          width: 180 * size,
          height: 180 * size,
          borderRadius: "50%",
          border: `3px solid ${COLORS.goldLight}`,
          transform: `scale(${0.2 + tween(t, 0, 14, 0, 1.2, EASE.out)})`,
          opacity: tween(t, 0, 14, 0.9, 0),
        }}
      />
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + random(`${seed}-a-${i}`) * 0.5;
        const v = (140 + random(`${seed}-v-${i}`) * 160) * size;
        const p = tween(t, 0, 22, 0, 1, EASE.out);
        const px = x + Math.cos(a) * v * p;
        const py = y + Math.sin(a) * v * p + 60 * size * p * p;
        const s = (6 + random(`${seed}-s-${i}`) * 9) * size;
        const star = i % 3 === 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px - s / 2,
              top: py - s / 2,
              width: s,
              height: s,
              borderRadius: star ? 2 : "50%",
              transform: star ? `rotate(${45 + t * 10}deg)` : undefined,
              backgroundColor: i % 2 ? COLORS.goldLight : "#fff3d6",
              boxShadow: "0 0 12px rgba(255,220,160,0.9)",
              opacity: tween(t, 12, 26, 1, 0),
            }}
          />
        );
      })}
    </>
  );
};
