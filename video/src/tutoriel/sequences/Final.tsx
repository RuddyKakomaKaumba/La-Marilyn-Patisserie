import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { GoldDust, Glow, LightSweep } from "../../components/Atmosphere";
import { Logo } from "../../components/Logo";
import { Photo } from "../../components/Photo";
import { QrCode } from "../../components/QrCode";
import { Eyebrow, GoldRule } from "../../components/Type";
import { COLORS, SITE_URL_LABEL } from "../../theme";
import { SANS, SERIF } from "../../fonts";
import { EASE, tween } from "../../lib/anim";

/** Images d'avance : la conclusion entre pendant que le téléphone s'efface. */
export const FINAL_LEAD = 14;

/**
 * Séquence 6. La conclusion : une création en arche, le logo, la signature,
 * l'appel « Découvrez notre site », l'adresse et le QR code.
 */
export const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const f = frame - FINAL_LEAD;
  const arch = tween(f, -FINAL_LEAD, 18, 0, 1, EASE.out);
  const zoom = 1.16 - tween(f, 0, 240, 0, 0.1, EASE.linear);
  const cta = tween(f, 36, 56, 0, 1, EASE.out);
  const pulse = 0.5 + 0.5 * Math.sin((f - 66) / 13);
  return (
    <AbsoluteFill style={{ opacity: tween(frame, 0, FINAL_LEAD + 6, 0, 1) }}>
      <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
        <Glow x={540} y={560} size={1600} opacity={0.24} />
        <GoldDust count={34} seed="tuto-final" opacity={0.8} />
      </AbsoluteFill>
      <LightSweep progress={tween(f, -6, 34, 0, 1, EASE.out)} opacity={0.16 * tween(f, 18, 36, 1, 0)} />

      {/* La création, dans une arche */}
      <div
        style={{
          position: "absolute",
          left: 540 - 250,
          top: 250 + (1 - arch) * 80,
          width: 500,
          height: 600,
          borderRadius: "250px 250px 28px 28px",
          overflow: "hidden",
          opacity: arch,
          boxShadow: "0 50px 110px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(226,199,150,0.6)",
        }}
      >
        <Photo photo="hero" zoom={zoom} focus="54% 58%" style={{ inset: 0 }} />
        <LightSweep progress={tween(f, 10, 60, 0, 1, EASE.inOut)} opacity={0.22} />
      </div>
      <div style={{ position: "absolute", left: 540 - 66, top: 770 }}>
        <div style={{ borderRadius: "50%", backgroundColor: COLORS.ink, padding: 8, boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>
          <Logo size={116} frame={f} at={6} />
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, top: 930, width: 1080, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 300,
            fontSize: 92,
            letterSpacing: `${tween(f, 16, 56, 0.55, 0.3, EASE.out)}em`,
            marginRight: "-0.3em",
            color: COLORS.ivory,
            opacity: tween(f, 16, 38, 0, 1),
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          LA MARILYN
        </div>
        <div style={{ height: 20 }} />
        <Eyebrow at={FINAL_LEAD + 28} size={30} color={COLORS.goldLight} style={{ marginRight: "-0.2em" }}>
          L’art du gâteau
        </Eyebrow>
        <div style={{ height: 30 }} />
        <GoldRule at={FINAL_LEAD + 36} width={150} origin="center" />
      </div>

      {/* Appel à l'action : le site, son adresse et le QR code */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 1110,
          width: 900,
          display: "flex",
          alignItems: "center",
          gap: 40,
          opacity: cta,
          transform: `translateY(${(1 - cta) * 30}px)`,
        }}
      >
        <QrCode size={196} reveal={tween(f, 40, 62, 0, 1, EASE.inOut)} />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              alignSelf: "flex-start",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "18px 34px",
              borderRadius: 999,
              backgroundColor: COLORS.gold,
              color: COLORS.ink,
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 38,
              boxShadow: `0 0 ${40 + pulse * 30}px rgba(226,180,110,${0.25 + pulse * 0.15}), 0 16px 40px rgba(0,0,0,0.4)`,
            }}
          >
            Découvrez notre site
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={COLORS.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 33, color: COLORS.ivory, letterSpacing: "0.01em" }}>{SITE_URL_LABEL}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
