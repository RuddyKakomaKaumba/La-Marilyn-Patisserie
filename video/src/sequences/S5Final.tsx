import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { GoldDust, Glow, LightSweep } from "../components/Atmosphere";
import { Logo } from "../components/Logo";
import { Photo, PhotoKey } from "../components/Photo";
import { QrCode } from "../components/QrCode";
import { Eyebrow, GoldRule, RevealLine, display } from "../components/Type";
import { EASE, tween } from "../lib/anim";
import { useFormat } from "../lib/format";
import { SERIF } from "../fonts";
import { COLORS } from "../theme";

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
  // Appel à l'action, puis le QR code qui se dessine depuis son centre.
  const CTA_AT = 106;
  const QR_AT = 78;
  const qrIn = tween(f, QR_AT, QR_AT + 16, 0, 1, EASE.out);
  const qrDraw = tween(f, QR_AT + 2, QR_AT + 34, 0, 1, EASE.inOut);
  const pulse = 0.5 + 0.5 * Math.sin((f - QR_AT) / 14);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink, opacity: tween(frame, 0, S5_LEAD + 6, 0, 1) }}>
      <Glow x={W / 2} y={pick(700, 430)} size={pick(1700, 1900)} opacity={0.2 + 0.06 * tween(f, 0, 40, 1, 0)} color="202,165,108" />
      <Glow x={W / 2} y={pick(700, 430)} size={pick(820, 760)} opacity={0.16} />
      <Ribbon f={f} y={pick(1590, 900)} size={pick(270, 160)} opacity={tween(f, 40, 90, 0, pick(0.5, 0.42))} />
      <GoldDust count={pick(40, 44)} seed="final" opacity={0.9} />
      {/* Éclat d'ouverture, sur le premier temps */}
      <LightSweep progress={tween(f, -6, 34, 0, 1, EASE.out)} opacity={0.32 * tween(f, 18, 36, 1, 0)} />

      <div
        style={{
          position: "absolute",
          left: 0,
          top: pick(268, 34),
          width: W,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Logo size={pick(232, 150)} frame={f} at={4} />
        <div style={{ height: pick(34, 16) }} />
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 300,
            fontSize: pick(96, 74),
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
        <div style={{ height: pick(24, 12) }} />
        <Eyebrow at={S5_LEAD + 40} size={pick(34, 28)} color={COLORS.goldLight} style={{ marginRight: "-0.2em" }}>
          L’art du gâteau
        </Eyebrow>
        <div style={{ height: pick(36, 18) }} />
        <GoldRule at={S5_LEAD + 52} width={pick(170, 150)} origin="center" />
        <div style={{ height: pick(36, 18) }} />
        <Eyebrow at={S5_LEAD + 62} size={pick(35, 30)} color={COLORS.ivory} style={{ marginRight: "-0.2em" }}>
          Notre nouveau site est en ligne
        </Eyebrow>
        <div style={{ height: pick(40, 22) }} />
        <RevealLine
          text="Commandez dès maintenant"
          at={S5_LEAD + CTA_AT}
          italic
          stagger={3}
          style={{ ...display(pick(76, 56), COLORS.goldLight), justifyContent: "center" }}
        />
        <div style={{ height: pick(40, 22) }} />
        {/* QR code vers le site, à la place de l'adresse */}
        <div
          style={{
            opacity: qrIn,
            transform: `translateY(${(1 - qrIn) * 36}px) scale(${0.92 + qrIn * 0.08 + pulse * 0.008})`,
          }}
        >
          <QrCode size={pick(330, 250)} reveal={qrDraw} />
        </div>
        <div style={{ height: pick(26, 16) }} />
        <Eyebrow at={S5_LEAD + QR_AT + 26} size={pick(26, 22)} color={COLORS.goldLight} style={{ marginRight: "-0.2em" }}>
          Scannez pour commander
        </Eyebrow>
      </div>
      <AbsoluteFill style={{ backgroundColor: COLORS.ink, opacity: tween(f, 232, 240, 0, 0.25), height: H }} />
    </AbsoluteFill>
  );
};
