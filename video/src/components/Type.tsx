import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { SANS, SERIF } from "../fonts";
import { EASE, tween } from "../lib/anim";

/**
 * Ligne de texte révélée mot à mot : chaque mot monte derrière un masque,
 * comme les apparitions du site, avec un léger décalage entre les mots.
 */
export const RevealLine: React.FC<{
  text: string;
  at: number;
  /** Image de sortie (facultatif) : les mots repartent vers le haut. */
  out?: number;
  stagger?: number;
  duration?: number;
  style?: React.CSSProperties;
  /** Mots en italique (indices). */
  italic?: boolean;
}> = ({ text, at, out, stagger = 3, duration = 22, style, italic }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: "0.26em",
        fontStyle: italic ? "italic" : "normal",
        ...style,
      }}
    >
      {words.map((w, i) => {
        const start = at + i * stagger;
        const inY = tween(frame, start, start + duration, 108, 0, EASE.out);
        const outY = out === undefined ? 0 : tween(frame, out + i * 2, out + i * 2 + 14, 0, -108, EASE.in);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              // Marge pour les jambages et les accents, hors du masque
              padding: "0.14em 0.06em 0.2em",
              margin: "-0.14em -0.06em -0.2em",
            }}
          >
            <span style={{ display: "inline-block", transform: `translateY(${inY + outY}%)`, whiteSpace: "pre" }}>
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** Surtitre en capitales espacées (classe .eyebrow du site). */
export const Eyebrow: React.FC<{
  children: React.ReactNode;
  at: number;
  out?: number;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, at, out, color = COLORS.goldLight, size = 26, style }) => {
  const frame = useCurrentFrame();
  const o = tween(frame, at, at + 16, 0, 1) * (out === undefined ? 1 : tween(frame, out, out + 10, 1, 0));
  const spacing = tween(frame, at, at + 30, 0.34, 0.2, EASE.out);
  return (
    <div
      style={{
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: size,
        letterSpacing: `${spacing}em`,
        textTransform: "uppercase",
        color,
        opacity: o,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Filet doré qui se trace. */
export const GoldRule: React.FC<{ at: number; out?: number; width: number; style?: React.CSSProperties; origin?: string }> = ({
  at,
  out,
  width,
  style,
  origin = "left",
}) => {
  const frame = useCurrentFrame();
  const s = tween(frame, at, at + 26, 0, 1, EASE.out) * (out === undefined ? 1 : tween(frame, out, out + 10, 1, 0));
  return (
    <div
      style={{
        width,
        height: 2,
        background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight})`,
        transform: `scaleX(${s})`,
        transformOrigin: origin,
        ...style,
      }}
    />
  );
};

export const display = (size: number, color: string = COLORS.ivory): React.CSSProperties => ({
  fontFamily: SERIF,
  fontWeight: 300,
  fontSize: size,
  lineHeight: 1.04,
  letterSpacing: "-0.02em",
  color,
});
