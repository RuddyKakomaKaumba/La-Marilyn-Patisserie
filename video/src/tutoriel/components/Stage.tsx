import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { GoldDust, Glow } from "../../components/Atmosphere";
import { Photo, PhotoKey } from "../../components/Photo";
import { COLORS } from "../../theme";
import { SANS, SERIF } from "../../fonts";
import { EASE, tween } from "../../lib/anim";
import { LAYOUT } from "../layout";

/** Fond du film : encre, photographie floutée, halo et poussière d'or. */
export const Backdrop: React.FC<{ photo?: PhotoKey; glowY?: number; photoOpacity?: number }> = ({
  photo = "moelleux",
  glowY = LAYOUT.anchor.y,
  photoOpacity = 0.26,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      <Photo photo={photo} blur zoom={1.3 + frame * 0.0002} style={{ inset: 0, opacity: photoOpacity }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, rgba(18,12,9,0.2) 0%, rgba(18,12,9,0.92) 80%)" }} />
      <Glow x={LAYOUT.width / 2} y={glowY} size={1700} opacity={0.2} />
      <GoldDust count={22} seed="tuto" opacity={0.55} />
    </AbsoluteFill>
  );
};

/** Fondus haut et bas : le site glisse sous le titre et sous les sous-titres. */
export const Fades: React.FC<{ top?: number; bottom?: number }> = ({ top = 1, bottom = 1 }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: LAYOUT.width,
        height: 640,
        opacity: top,
        background: `linear-gradient(to bottom, ${COLORS.ink} 0%, rgba(18,12,9,0.98) 58%, rgba(18,12,9,0.82) 72%, rgba(18,12,9,0) 100%)`,
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 1210,
        width: LAYOUT.width,
        height: 710,
        opacity: bottom,
        background: `linear-gradient(to top, ${COLORS.ink} 0%, rgba(18,12,9,0.95) 38%, rgba(18,12,9,0.6) 66%, rgba(18,12,9,0) 100%)`,
        pointerEvents: "none",
      }}
    />
  </>
);

const STEPS = ["Choisissez", "Ajoutez au panier", "Vérifiez votre panier", "Envoyez sur WhatsApp"];

/**
 * En-tête pédagogique : progression en quatre étapes et titre de l'étape
 * en cours. Le titre change en fondu, la barre de progression avance.
 */
export const StepHeader: React.FC<{ marks: number[]; from: number; to: number }> = ({ marks, from, to }) => {
  const frame = useCurrentFrame();
  if (frame < from - 2 || frame > to + 12) return null;
  const o = Math.min(tween(frame, from, from + 16, 0, 1), tween(frame, to - 8, to + 8, 1, 0));
  const step = marks.reduce((acc, m, i) => (frame >= m ? i : acc), 0);
  return (
    <div style={{ position: "absolute", left: LAYOUT.title.left, top: LAYOUT.title.top, width: LAYOUT.title.width, opacity: o }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {STEPS.map((s, i) => {
          const fill = tween(frame, marks[i], marks[i] + 18, 0, 1, EASE.out);
          return (
            <div key={s} style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: "rgba(226,199,150,0.22)", overflow: "hidden" }}>
              <div style={{ width: `${fill * 100}%`, height: "100%", backgroundColor: COLORS.gold }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "relative", height: 150, marginTop: 30 }}>
        {STEPS.map((s, i) => {
          const start = marks[i];
          const end = marks[i + 1] ?? Infinity;
          if (frame < start - 2 || frame > end + 12) return null;
          const p = tween(frame, start, start + 18, 0, 1, EASE.out);
          const q = end === Infinity ? 1 : tween(frame, end - 2, end + 10, 1, 0);
          return (
            <div key={s} style={{ position: "absolute", inset: 0, opacity: Math.min(p, q), transform: `translateY(${(1 - p) * 22 - (1 - q) * 16}px)` }}>
              <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 27, letterSpacing: "0.22em", color: COLORS.goldLight }}>
                {`ÉTAPE ${i + 1} SUR 4`}
              </div>
              <div style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 84, lineHeight: 1.05, letterSpacing: "-0.02em", color: COLORS.ivory, marginTop: 10 }}>
                {s}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
