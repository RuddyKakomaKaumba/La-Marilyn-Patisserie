import React from "react";
import { COLORS } from "../../theme";
import { SANS } from "../../fonts";
import { EASE, tween } from "../../lib/anim";

type Box = { x: number; y: number; w: number; h: number };

/**
 * Surbrillance pédagogique : cadre doré qui se pose autour d'un élément de
 * l'interface (repère de l'écran), avec une pulsation douce.
 */
export const Ring: React.FC<{ box: Box; frame: number; from: number; to: number; radius?: number; pad?: number }> = ({
  box,
  frame,
  from,
  to,
  radius = 14,
  pad = 6,
}) => {
  if (frame < from - 2 || frame > to + 10) return null;
  const inn = tween(frame, from, from + 12, 0, 1, EASE.out);
  const out = tween(frame, to - 6, to + 6, 1, 0);
  const o = Math.min(inn, out);
  const pulse = 0.5 + 0.5 * Math.sin((frame - from) / 7);
  const grow = (1 - inn) * 10;
  return (
    <div
      style={{
        position: "absolute",
        left: box.x - pad - grow,
        top: box.y - pad - grow,
        width: box.w + (pad + grow) * 2,
        height: box.h + (pad + grow) * 2,
        borderRadius: radius + grow,
        border: `2.5px solid ${COLORS.gold}`,
        boxShadow: `0 0 0 ${4 + pulse * 4}px rgba(202,165,108,${0.18 + 0.1 * pulse}), 0 0 26px rgba(226,180,110,${0.35 * o})`,
        opacity: o,
        pointerEvents: "none",
      }}
    />
  );
};

/**
 * Toucher du doigt (repère de l'écran) : appui, puis onde qui s'élargit.
 */
export const Touch: React.FC<{ x: number; y: number; frame: number; at: number }> = ({ x, y, frame, at }) => {
  const t = (frame - at) / 18;
  if (t < -0.5 || t > 1.3) return null;
  const press = tween(frame, at - 8, at, 0, 1, EASE.out);
  const ring = Math.max(0, Math.min(1, t));
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 34,
          top: y - 34,
          width: 68,
          height: 68,
          borderRadius: "50%",
          border: `2px solid ${COLORS.gold}`,
          transform: `scale(${0.35 + ring * 1.1})`,
          opacity: t >= 0 ? 1 - ring : 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 15,
          top: y - 15,
          width: 30,
          height: 30,
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.78)",
          boxShadow: "0 0 0 1.5px rgba(134,100,47,0.6), 0 4px 14px rgba(18,12,9,0.32)",
          transform: `scale(${t < 0 ? 1.45 - press * 0.55 : 0.9 + ring * 0.25})`,
          opacity: t < 0 ? press : 1 - ring,
        }}
      />
    </>
  );
};

/** Étiquette d'annotation, dans le repère du film. */
export const Tag: React.FC<{
  x: number;
  y: number;
  frame: number;
  from: number;
  to: number;
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  size?: number;
}> = ({ x, y, frame, from, to, children, align = "center", size = 34 }) => {
  if (frame < from || frame > to + 10) return null;
  const inn = tween(frame, from, from + 14, 0, 1, EASE.out);
  const o = Math.min(inn, tween(frame, to - 8, to + 4, 1, 0));
  const shift = align === "center" ? "-50%" : align === "right" ? "-100%" : "0%";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${shift}, -50%) translateY(${(1 - inn) * 16}px) scale(${0.94 + inn * 0.06})`,
        opacity: o,
        padding: `${size * 0.42}px ${size * 0.8}px`,
        borderRadius: 999,
        backgroundColor: "rgba(18,12,9,0.88)",
        border: `1.5px solid rgba(226,199,150,0.75)`,
        boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
        color: COLORS.ivory,
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: size,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

/**
 * Loupe : agrandit une zone de l'écran du site (rendue une seconde fois,
 * à plus grande échelle) dans un cadre doré, dans le repère du film.
 * La source (`from`) est reliée à la loupe par un trait doré.
 */
export const Loupe: React.FC<{
  frame: number;
  from: number;
  to: number;
  /** Zone de l'écran agrandie (pixels CSS). */
  region: Box;
  /** Position de la loupe dans le film (centre) et largeur. */
  at: { x: number; y: number; w: number };
  /** Point de départ du trait (dans le film), généralement la zone source. */
  source?: { x: number; y: number };
  render: () => React.ReactNode;
}> = ({ frame, from, to, region, at, source, render }) => {
  if (frame < from || frame > to + 10) return null;
  const inn = tween(frame, from, from + 16, 0, 1, EASE.out);
  const o = Math.min(inn, tween(frame, to - 8, to + 6, 1, 0));
  const k = at.w / region.w;
  const h = region.h * k;
  const cx = source ? source.x + (at.x - source.x) * inn : at.x;
  const cy = source ? source.y + (at.y - source.y) * inn : at.y;
  const sc = 0.4 + 0.6 * inn;
  return (
    <>
      {source && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: o * 0.9, pointerEvents: "none" }}>
          <line x1={source.x} y1={source.y} x2={cx} y2={cy} stroke={COLORS.goldLight} strokeWidth={2} strokeDasharray="3 7" strokeLinecap="round" />
          <circle cx={source.x} cy={source.y} r={6} fill={COLORS.gold} />
        </svg>
      )}
      <div
        style={{
          position: "absolute",
          left: cx - at.w / 2,
          top: cy - h / 2,
          width: at.w,
          height: h,
          borderRadius: 22,
          overflow: "hidden",
          opacity: o,
          transform: `scale(${sc})`,
          boxShadow: `0 0 0 3px ${COLORS.gold}, 0 0 0 9px rgba(202,165,108,0.2), 0 34px 80px rgba(0,0,0,0.55)`,
          backgroundColor: COLORS.ivory,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 390,
            height: 844,
            transformOrigin: "0 0",
            transform: `scale(${k}) translate(${-region.x}px, ${-region.y}px)`,
          }}
        >
          {render()}
        </div>
      </div>
    </>
  );
};
