import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { GoldDust, Glow, LightSweep } from "../components/Atmosphere";
import { Logo } from "../components/Logo";
import { Photo, PhotoKey } from "../components/Photo";
import { Tap } from "../components/Devices";
import { Eyebrow, GoldRule, RevealLine, display } from "../components/Type";
import { EASE, tween } from "../lib/anim";
import { useFormat } from "../lib/format";
import { SANS, SERIF } from "../fonts";
import { COLORS, SITE_URL_LABEL } from "../theme";

export const S5_LEAD = 12;

const RIBBON: PhotoKey[] = [
  "cake-noir-or",
  "moelleux",
  "mini-cupcakes",
  "ecrin-garni",
  "cake-turquoise",
  "crepes-nature",
  "buffet-table",
  "velvet",
  "cake-blanc-or",
  "mini-burgers",
];

/** Ruban de créations qui défile lentement, en bord de cadre. */
const Ribbon: React.FC<{ f: number; y: number; size: number; opacity: number }> = ({ f, y, size, opacity }) => {
  const { W } = useFormat();
  const gap = 22;
  const step = size * 0.8 + gap;
  const total = RIBBON.length * step;
  const offset = (f * 1.5) % total;
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: W, height: size, opacity }}>
      {[...RIBBON, ...RIBBON].map((p, i) => {
        const x = i * step - offset;
        if (x < -step || x > W) return null;
        return <Photo key={i} photo={p} style={{ left: x, top: 0, width: size * 0.8, height: size, borderRadius: 16 }} />;
      })}
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, ${COLORS.ink} 0%, rgba(18,12,9,0) 14%, rgba(18,12,9,0) 86%, ${COLORS.ink} 100%)`,
        }}
      />
    </div>
  );
};

/** Séquence 5. Le final : le logo, la signature, l'adresse du site. */
export const S5Final: React.FC = () => {
  const frame = useCurrentFrame();
  const f = frame - S5_LEAD;
  const { W, H, pick } = useFormat();

  const nameSpacing = tween(f, 26, 70, 0.62, 0.3, EASE.out);
  const urlIn = tween(f, 72, 96, 0, 1, EASE.out);
  // Appel à l'action : la ligne arrive avec la voix, puis un toucher sur l'adresse.
  const CTA_AT = 92;
  const TAP_AT = 152;
  const press = 1 - 0.035 * tween(f, TAP_AT - 4, TAP_AT, 0, 1) * tween(f, TAP_AT, TAP_AT + 10, 1, 0);
  const pulse = 0.5 + 0.5 * Math.sin((f - 98) / 14);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink, opacity: tween(frame, 0, S5_LEAD + 6, 0, 1) }}>
      <Glow x={W / 2} y={pick(700, 430)} size={pick(1700, 1900)} opacity={0.2 + 0.06 * tween(f, 0, 40, 1, 0)} color="202,165,108" />
      <Glow x={W / 2} y={pick(700, 430)} size={pick(820, 760)} opacity={0.16} />
      <Ribbon f={f} y={pick(1560, 846)} size={pick(290, 190)} opacity={tween(f, 40, 90, 0, pick(0.5, 0.42))} />
      <GoldDust count={pick(40, 44)} seed="final" opacity={0.9} />
      {/* Éclat d'ouverture, sur le premier temps */}
      <LightSweep progress={tween(f, -6, 34, 0, 1, EASE.out)} opacity={0.32 * tween(f, 18, 36, 1, 0)} />

      <div
        style={{
          position: "absolute",
          left: 0,
          top: pick(322, 70),
          width: W,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Logo size={pick(300, 196)} frame={f} at={4} />
        <div style={{ height: pick(54, 30) }} />
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 300,
            fontSize: pick(104, 88),
            letterSpacing: `${nameSpacing}em`,
            marginRight: `${-nameSpacing}em`,
            color: COLORS.ivory,
            whiteSpace: "nowrap",
            opacity: tween(f, 26, 50, 0, 1),
            lineHeight: 1,
          }}
        >
          LA MARILYN
        </div>
        <div style={{ height: pick(30, 20) }} />
        <Eyebrow at={S5_LEAD + 40} size={pick(34, 28)} color={COLORS.goldLight} style={{ marginRight: "-0.2em" }}>
          L’art du gâteau
        </Eyebrow>
        <div style={{ height: pick(56, 34) }} />
        <GoldRule at={S5_LEAD + 52} width={pick(170, 150)} origin="center" />
        <div style={{ height: pick(56, 34) }} />
        <Eyebrow at={S5_LEAD + 62} size={pick(35, 30)} color={COLORS.ivory} style={{ marginRight: "-0.2em" }}>
          Notre nouveau site est en ligne
        </Eyebrow>
        <div style={{ height: pick(44, 26) }} />
        <RevealLine
          text="Commandez dès maintenant"
          at={S5_LEAD + CTA_AT}
          italic
          stagger={3}
          style={{ ...display(pick(76, 58), COLORS.goldLight), justifyContent: "center" }}
        />
        <div style={{ height: pick(36, 22) }} />
        {/* Adresse du site : bouton doré du site, large et lisible */}
        <div style={{ position: "relative", transform: `scale(${press})` }}>
        <div
          style={{
            position: "relative",
            padding: pick("30px 54px", "24px 52px"),
            borderRadius: 999,
            backgroundColor: COLORS.gold,
            color: COLORS.ink,
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: pick(49, 44),
            letterSpacing: "0.005em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            opacity: urlIn,
            transform: `translateY(${(1 - urlIn) * 40}px) scale(${0.94 + urlIn * 0.06})`,
            boxShadow: `0 0 ${50 + pulse * 40}px rgba(226,180,110,${0.28 + pulse * 0.16}), 0 20px 50px rgba(0,0,0,0.4)`,
          }}
        >
          {SITE_URL_LABEL}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(110deg, rgba(255,255,255,0) ${tween(f, 104, 140, -40, 120, EASE.inOut)}%, rgba(255,250,235,0.6) ${tween(f, 104, 140, -25, 135, EASE.inOut)}%, rgba(255,255,255,0) ${tween(f, 104, 140, -10, 150, EASE.inOut)}%)`,
            }}
          />
        </div>
          <div style={{ position: "absolute", left: "91%", top: "62%", transform: "scale(1.9)" }}>
            <Tap x={0} y={0} frame={f} at={TAP_AT} />
          </div>
        </div>
      </div>
      <AbsoluteFill style={{ backgroundColor: COLORS.ink, opacity: tween(f, 232, 240, 0, 0.25), height: H }} />
    </AbsoluteFill>
  );
};
