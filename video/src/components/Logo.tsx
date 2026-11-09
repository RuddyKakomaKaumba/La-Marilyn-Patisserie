import React from "react";
import { Img, staticFile } from "remotion";
import { EASE, tween } from "../lib/anim";

/**
 * Logo officiel La Marilyn (fichier du site, non retouché). Il apparaît
 * dans un halo, pendant qu'un reflet le traverse.
 */
export const Logo: React.FC<{ size: number; frame: number; at: number; style?: React.CSSProperties }> = ({
  size,
  frame,
  at,
  style,
}) => {
  const o = tween(frame, at, at + 22, 0, 1);
  const s = tween(frame, at, at + 40, 0.82, 1, EASE.out);
  const blur = tween(frame, at, at + 20, 10, 0);
  const shine = tween(frame, at + 14, at + 54, 0, 1, EASE.inOut);
  const src = staticFile("brand/logo-la-marilyn.png");
  const ratio = 508 / 492;
  return (
    <div
      style={{
        position: "relative",
        width: size * ratio,
        height: size,
        opacity: o,
        transform: `scale(${s})`,
        filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-45%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(226,180,110,0.34) 0%, rgba(226,180,110,0.1) 40%, rgba(226,180,110,0) 66%)",
        }}
      />
      <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      {/* Reflet limité à la forme du logo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          background: `linear-gradient(110deg, rgba(255,255,255,0) ${shine * 160 - 50}%, rgba(255,250,235,0.95) ${shine * 160 - 30}%, rgba(255,255,255,0) ${shine * 160 - 10}%)`,
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
};
