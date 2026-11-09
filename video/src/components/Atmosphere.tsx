import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { useFormat } from "../lib/format";

/**
 * Poussière d'or : particules lumineuses sur plusieurs plans. Les plus
 * grosses sont proches (floues, rapides), les plus fines lointaines : le
 * décalage de vitesse donne la profondeur.
 */
export const GoldDust: React.FC<{
  count?: number;
  seed?: string;
  opacity?: number;
  /** Décalage global (parallaxe avec la caméra). */
  drift?: number;
}> = ({ count = 34, seed = "dust", opacity = 1, drift = 0 }) => {
  const frame = useCurrentFrame();
  const { W, H } = useFormat();
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const depth = random(`${seed}-d-${i}`); // 0 = loin, 1 = proche
        const size = 3 + depth * depth * 34;
        const speed = 0.25 + depth * 1.3;
        const x0 = random(`${seed}-x-${i}`) * W;
        const y0 = random(`${seed}-y-${i}`) * (H + 200);
        const sway = Math.sin(frame / (38 + i * 3) + i) * (10 + depth * 26);
        const y = ((((y0 - frame * speed - drift * depth) % (H + 200)) + (H + 200)) % (H + 200)) - 100;
        const twinkle = 0.55 + 0.45 * Math.sin(frame / (9 + (i % 7) * 3) + i * 1.7);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x0 + sway,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255,236,196,${0.95 - depth * 0.5}) 0%, rgba(226,199,150,${0.5 - depth * 0.3}) 38%, rgba(202,165,108,0) 70%)`,
              opacity: twinkle * (0.35 + (1 - depth) * 0.5),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Vignettage doux, pour concentrer le regard. */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.6 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 46%, rgba(18,12,9,0) 42%, rgba(18,12,9,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

/** Halo chaud, comme une lampe hors champ. */
export const Glow: React.FC<{
  x: number | string;
  y: number | string;
  size: number;
  opacity?: number;
  color?: string;
}> = ({ x, y, size, opacity = 0.3, color = "226,180,110" }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: size,
      height: size,
      marginLeft: -size / 2,
      marginTop: -size / 2,
      borderRadius: "50%",
      background: `radial-gradient(circle, rgba(${color},${opacity}) 0%, rgba(${color},${opacity * 0.4}) 35%, rgba(${color},0) 68%)`,
      pointerEvents: "none",
    }}
  />
);

/**
 * Trait de lumière oblique qui traverse le cadre une fois.
 * `progress` va de 0 (hors champ à gauche) à 1 (hors champ à droite).
 */
export const LightSweep: React.FC<{ progress: number; opacity?: number; width?: number }> = ({
  progress,
  opacity = 0.2,
  width = 46,
}) => (
  <AbsoluteFill
    style={{
      mixBlendMode: "screen",
      opacity,
      background: `linear-gradient(112deg, rgba(255,230,180,0) ${progress * 200 - 100 - width / 2}%, rgba(255,232,190,0.9) ${progress * 200 - 100}%, rgba(255,230,180,0) ${progress * 200 - 100 + width / 2}%)`,
      pointerEvents: "none",
    }}
  />
);

/** Fond sombre de la marque, avec un halo ambré. */
export const InkBackdrop: React.FC<{ children?: React.ReactNode; glow?: number }> = ({ children, glow = 0.2 }) => {
  const { W, H } = useFormat();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      <Glow x={W / 2} y={H * 0.45} size={Math.max(W, H) * 1.3} opacity={glow} color="202,165,108" />
      {children}
    </AbsoluteFill>
  );
};
