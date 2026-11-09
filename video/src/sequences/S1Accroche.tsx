import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { GoldDust, LightSweep, Vignette } from "../components/Atmosphere";
import { Logo } from "../components/Logo";
import { photoSrc } from "../components/Photo";
import { RevealLine, display } from "../components/Type";
import { EASE, tween } from "../lib/anim";
import { useFormat } from "../lib/format";
import { COLORS } from "../theme";

/**
 * Cadrage final du plan d'ouverture, mesuré sur les captures du site : la
 * photo se pose exactement là où elle se trouve dans la page d'accueil
 * (mobile en vertical, bureau en horizontal). La séquence suivante peut
 * ainsi fondre vers la vraie interface sans aucun saut.
 */
export const HERO_END = {
  vertical: { baseWidth: 1080, x: -2.8, y: 337, zoom: 1.0073 },
  horizontal: { baseWidth: 1154.3, x: 766.7, y: -570.7, zoom: 1 },
};
/** Centre du médaillon signature, en proportion de la photo. */
const MEDALLION = { x: 541 / 941, y: 917 / 1672 };

export const HeroPlate: React.FC<{ progress: number; blur?: number }> = ({ progress, blur = 0 }) => {
  const { vertical, pick } = useFormat();
  const end = vertical ? HERO_END.vertical : HERO_END.horizontal;
  const baseHeight = (end.baseWidth * 1672) / 941;
  const fx = MEDALLION.x * end.baseWidth;
  const fy = MEDALLION.y * baseHeight;
  // Départ : très près du médaillon, au centre du cadre.
  const z0 = pick(2.05, 1.75);
  const start = pick({ x: 540, y: 900 }, { x: 1250, y: 520 });
  const endPoint = { x: end.x + fx * end.zoom, y: end.y + fy * end.zoom };
  const zoom = z0 * Math.pow(end.zoom / z0, progress);
  const px = start.x + (endPoint.x - start.x) * progress;
  const py = start.y + (endPoint.y - start.y) * progress;
  return (
    <Img
      src={photoSrc("hero")}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: end.baseWidth,
        height: baseHeight,
        transformOrigin: "0 0",
        transform: `translate(${px - fx * zoom}px, ${py - fy * zoom}px) scale(${zoom})`,
        filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
      }}
    />
  );
};

/** Séquence 1. L'accroche : le médaillon, la matière, la promesse. */
export const S1Accroche: React.FC = () => {
  const frame = useCurrentFrame();
  const { W, vertical, pick } = useFormat();

  const progress = tween(frame, 0, 150, 0, 1, EASE.glide);
  const blur = tween(frame, 0, 30, 12, 0, EASE.soft);
  const exposure = tween(frame, 0, 7, 0.35, 1);
  const textOut = 132;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      <AbsoluteFill style={{ opacity: exposure }}>
        <HeroPlate progress={progress} blur={blur} />
        {/* Reflet chaud qui glisse sur le glaçage */}
        <LightSweep progress={tween(frame, 8, 96, 0, 1, EASE.inOut)} opacity={0.22} />
      </AbsoluteFill>

      {/* Fondu sombre derrière le texte (le même que sur le site) */}
      <AbsoluteFill
        style={{
          background: pick(
            `linear-gradient(to bottom, ${COLORS.ink} 0%, rgba(18,12,9,0.96) 16%, rgba(18,12,9,0.6) 31%, rgba(18,12,9,0) 46%)`,
            `linear-gradient(to right, ${COLORS.ink} 0%, rgba(18,12,9,0.97) 36%, rgba(18,12,9,0.55) 50%, rgba(18,12,9,0) 64%)`,
          ),
          opacity: vertical ? tween(frame, 10, 70, 0, 1) : 1,
        }}
      />
      <Vignette strength={0.5} />
      <GoldDust count={pick(30, 36)} seed="accroche" opacity={tween(frame, 6, 40, 0, 0.9)} drift={progress * 260} />

      {/* Logo puis promesse */}
      <div
        style={{
          position: "absolute",
          left: pick(0, 120),
          top: pick(250, 232),
          width: pick(W, 900),
          display: "flex",
          flexDirection: "column",
          alignItems: vertical ? "center" : "flex-start",
          opacity: tween(frame, textOut + 6, textOut + 20, 1, 0),
        }}
      >
        <Logo size={pick(196, 150)} frame={frame} at={12} />
        <div style={{ height: pick(36, 40) }} />
        <RevealLine
          text="Vos envies gourmandes"
          at={40}
          out={textOut}
          italic
          style={{ ...display(pick(96, 86)), justifyContent: vertical ? "center" : "flex-start" }}
        />
        <div style={{ height: pick(14, 12) }} />
        <RevealLine
          text="méritent toute notre attention."
          at={66}
          out={textOut + 3}
          style={{ ...display(pick(66, 58)), justifyContent: vertical ? "center" : "flex-start" }}
        />
      </div>
    </AbsoluteFill>
  );
};
