import React from "react";
import { interpolate } from "remotion";
import { COLORS } from "../../theme";
import { LAYOUT } from "../layout";

/** Écran du site, en pixels CSS (viewport mobile des captures). */
export const SCREEN = { width: 390, height: 844, radius: 46, bezel: 12 } as const;

/** Position de la caméra : point de l'écran visé, zoom et inclinaison. */
export type Cam = {
  /** Zoom : 1 = 390 px CSS affichés sur 390 px du film. */
  s: number;
  /** Point de l'écran (pixels CSS) placé sur le point d'ancrage du cadre. */
  x: number;
  y: number;
  /** Rotation en degrés (perspective), autour du point visé. */
  ry?: number;
  rx?: number;
  /** Décalage du point d'ancrage dans le cadre (pixels du film). */
  ax?: number;
  ay?: number;
};
export type CamKey = Cam & { f: number };

/**
 * Trajectoire de caméra : interpolation douce entre des positions clés. Le
 * zoom est interpolé en logarithme, pour une vitesse perçue constante.
 */
export function camAt(frame: number, keys: CamKey[]): Cam {
  if (frame <= keys[0].f) return keys[0];
  const last = keys[keys.length - 1];
  if (frame >= last.f) return last;
  let i = 0;
  while (keys[i + 1].f <= frame) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const u = interpolate(frame, [a.f, b.f], [0, 1]);
  // Courbe quintique : départ et arrivée francs, mouvement nerveux.
  const t = u < 0.5 ? 16 * u ** 5 : 1 - (-2 * u + 2) ** 5 / 2;
  const lerp = (p: number, q: number) => p + (q - p) * t;
  return {
    s: Math.exp(lerp(Math.log(a.s), Math.log(b.s))),
    x: lerp(a.x, b.x),
    y: lerp(a.y, b.y),
    ry: lerp(a.ry ?? 0, b.ry ?? 0),
    rx: lerp(a.rx ?? 0, b.rx ?? 0),
    ax: lerp(a.ax ?? 0, b.ax ?? 0),
    ay: lerp(a.ay ?? 0, b.ay ?? 0),
  };
}

/** Point de l'écran → point du film (sans tenir compte de l'inclinaison). */
export function toFrame(cam: Cam, x: number, y: number) {
  return {
    x: LAYOUT.anchor.x + (cam.ax ?? 0) + (x - cam.x) * cam.s,
    y: LAYOUT.anchor.y + (cam.ay ?? 0) + (y - cam.y) * cam.s,
  };
}

/**
 * Smartphone filmé par la caméra. Les enfants sont posés dans le repère de
 * l'écran (390 × 844, comme les captures du site).
 */
export const Phone: React.FC<{
  cam: Cam;
  children: React.ReactNode;
  /** Opacité du boîtier (0 : l'écran seul, bord à bord). */
  body?: number;
  /** Reflet qui glisse sur la vitre (0 → 1). */
  shine?: number;
  /** Assombrit l'écran (0 → 1). */
  dim?: number;
  style?: React.CSSProperties;
}> = ({ cam, children, body = 1, shine, dim = 0, style }) => {
  const { bezel, radius, width, height } = SCREEN;
  const ax = LAYOUT.anchor.x + (cam.ax ?? 0);
  const ay = LAYOUT.anchor.y + (cam.ay ?? 0);
  return (
    <div style={{ position: "absolute", left: ax, top: ay, width: 0, height: 0, perspective: 2600, ...style }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: width + bezel * 2,
          height: height + bezel * 2,
          transformOrigin: "0 0",
          transform: `rotateY(${cam.ry ?? 0}deg) rotateX(${cam.rx ?? 0}deg) scale(${cam.s}) translate(${-(cam.x + bezel)}px, ${-(cam.y + bezel)}px)`,
        }}
      >
        {/* Boîtier */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius + bezel,
            background: "linear-gradient(145deg, #4a3b2c 0%, #17100c 28%, #0a0706 62%, #3c2f22 100%)",
            boxShadow:
              "0 50px 110px rgba(0,0,0,0.6), 0 16px 36px rgba(0,0,0,0.45), inset 0 0 0 1.2px rgba(226,199,150,0.5), inset 0 0 0 3.5px #0a0706",
            opacity: body,
          }}
        />
        {/* Écran */}
        <div
          style={{
            position: "absolute",
            left: bezel,
            top: bezel,
            width,
            height,
            borderRadius: radius * body,
            overflow: "hidden",
            backgroundColor: COLORS.ink,
          }}
        >
          {children}
          {dim > 0 && <div style={{ position: "absolute", inset: 0, backgroundColor: COLORS.ink, opacity: dim }} />}
          {shine !== undefined && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(115deg, rgba(255,255,255,0) ${shine * 180 - 60}%, rgba(255,240,210,0.14) ${shine * 180 - 40}%, rgba(255,255,255,0) ${shine * 180 - 20}%)`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
