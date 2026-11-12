import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { SANS, SERIF } from "../fonts";
import { EASE, tween } from "../lib/anim";

/**
 * Ligne de texte qui se pose mot à mot : chaque mot apparaît en fondu, en
 * montant légèrement et en se mettant au net. Aucun masque : on ne voit
 * jamais un mot coupé ou à moitié sorti.
 */
export const RevealLine: React.FC<{
  text: string;
  at: number;
  /** Image de sortie (facultatif) : la ligne s'efface d'un bloc. */
  out?: number;
  stagger?: number;
  duration?: number;
  style?: React.CSSProperties;
  italic?: boolean;
}> = ({ text, at, out, stagger = 3, duration = 18, style, italic }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const leave = out === undefined ? 1 : tween(frame, out, out + 9, 1, 0, EASE.inOut);
  if (frame < at || leave <= 0) {
    // Ligne réservée (mise en page stable) mais invisible.
    return (
      <div style={{ display: "flex", flexWrap: "wrap", columnGap: "0.26em", fontStyle: italic ? "italic" : "normal", ...style, visibility: "hidden" }}>
        {words.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: "0.26em",
        fontStyle: italic ? "italic" : "normal",
        ...style,
        opacity: leave,
        transform: `translateY(${(1 - leave) * -0.12}em)`,
      }}
    >
      {words.map((w, i) => {
        const start = at + i * stagger;
        const p = tween(frame, start, start + duration, 0, 1, EASE.out);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: p,
              transform: `translateY(${(1 - p) * 0.32}em)`,
              filter: p < 0.98 ? `blur(${(1 - p) * 7}px)` : undefined,
            }}
          >
            {w}
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
