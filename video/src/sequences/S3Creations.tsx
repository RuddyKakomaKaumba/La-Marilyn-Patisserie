import React from "react";
import { AbsoluteFill, Sequence, random, useCurrentFrame } from "remotion";
import { GoldDust, Glow, LightSweep } from "../components/Atmosphere";
import { Photo, PhotoKey } from "../components/Photo";
import { Eyebrow, RevealLine, display } from "../components/Type";
import { EASE, tween } from "../lib/anim";
import { useFormat } from "../lib/format";
import { COLORS } from "../theme";

/** Images d'avance : chaque univers commence à entrer avant son premier temps. */
export const S3_LEAD = 12;
const PRE = S3_LEAD;

/**
 * Début de chaque univers (images depuis le début de la séquence). Les
 * coupes suivent la voix : une phrase par univers.
 */
export const S3_CUTS = [0, 80, 164, 250, 320];

/** Horloge d'un univers : 0 sur sa coupe, négative pendant l'entrée. */
const useSceneTime = () => useCurrentFrame() - PRE;

type Tone = "dark" | "light";

/** Scène de motion design : centre et échelle des formes selon le format. */
function useStage() {
  const { W, pick } = useFormat();
  return { cx: pick(W / 2, 1345), cy: pick(1190, 560), k: pick(1, 0.7) };
}

/* ------------------------------------------------------------------ */
/* Éléments graphiques                                                 */
/* ------------------------------------------------------------------ */

/** Photographie dans une forme (arche, cercle, gélule) qui s'ouvre et respire. */
const Shape: React.FC<{
  photo: PhotoKey;
  /** Position du centre, relative au centre de la scène. */
  x: number;
  y: number;
  w: number;
  h: number;
  radius: string;
  at: number;
  focus?: string;
  /** Direction d'entrée, en pixels. */
  from?: [number, number];
  tone?: Tone;
  sweep?: boolean;
}> = ({ photo, x, y, w, h, radius, at, focus = "50% 50%", from = [0, 120], tone = "dark", sweep }) => {
  const t = useSceneTime();
  const { cx, cy, k } = useStage();
  const p = tween(t, at, at + 30, 0, 1, EASE.out);
  const breathe = tween(t, at, at + 140, 0, 1, EASE.linear);
  return (
    <div
      style={{
        position: "absolute",
        left: cx + (x - w / 2) * k + (1 - p) * from[0] * k,
        top: cy + (y - h / 2) * k + (1 - p) * from[1] * k,
        width: w * k,
        height: h * k,
        borderRadius: radius,
        overflow: "hidden",
        opacity: tween(t, at, at + 12, 0, 1),
        transform: `scale(${0.82 + p * 0.18})`,
        boxShadow:
          tone === "dark"
            ? "0 40px 90px rgba(0,0,0,0.5), 0 0 0 1.5px rgba(226,199,150,0.5)"
            : "0 34px 70px rgba(58,42,32,0.26), 0 0 0 1.5px rgba(134,100,47,0.35)",
        backgroundColor: COLORS.inkSoft,
      }}
    >
      <Photo photo={photo} zoom={1.22 - p * 0.14 + breathe * 0.06} focus={focus} style={{ inset: 0 }} />
      {sweep && <LightSweep progress={tween(t, at + 10, at + 52, 0, 1, EASE.inOut)} opacity={0.28} />}
    </div>
  );
};

/** Anneau doré qui se trace puis tourne lentement, derrière la forme principale. */
const Ring: React.FC<{ r: number; at: number; x?: number; y?: number; tone?: Tone; dashed?: boolean }> = ({
  r,
  at,
  x = 0,
  y = 0,
  tone = "dark",
  dashed,
}) => {
  const t = useSceneTime();
  const { cx, cy, k } = useStage();
  const R = r * k;
  const len = 2 * Math.PI * R;
  const draw = tween(t, at, at + 44, 0, 1, EASE.inOut);
  const color = tone === "dark" ? COLORS.goldLight : COLORS.goldDeep;
  return (
    <svg
      width={R * 2 + 8}
      height={R * 2 + 8}
      style={{
        position: "absolute",
        left: cx + x * k - R - 4,
        top: cy + y * k - R - 4,
        transform: `rotate(${-90 + t * 0.35}deg)`,
        opacity: 0.75,
      }}
    >
      <circle
        cx={R + 4}
        cy={R + 4}
        r={R}
        fill="none"
        stroke={color}
        strokeWidth={dashed ? 2 : 1.5}
        strokeDasharray={dashed ? `2 ${14 * k}` : `${len}`}
        strokeDashoffset={dashed ? 0 : len * (1 - draw)}
        strokeLinecap="round"
        opacity={dashed ? draw : 1}
      />
    </svg>
  );
};

/** Petites étoiles à quatre branches qui scintillent autour des formes. */
const Sparks: React.FC<{ seed: string; count?: number; spread?: number; tone?: Tone; at?: number }> = ({
  seed,
  count = 7,
  spread = 520,
  tone = "dark",
  at = 8,
}) => {
  const t = useSceneTime();
  const { cx, cy, k } = useStage();
  const color = tone === "dark" ? COLORS.goldLight : COLORS.gold;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const angle = random(`${seed}-a-${i}`) * Math.PI * 2;
        const dist = (0.62 + random(`${seed}-d-${i}`) * 0.5) * spread * k;
        const size = (16 + random(`${seed}-s-${i}`) * 26) * k;
        const pulse = 0.5 + 0.5 * Math.sin(t / (7 + (i % 4) * 2) + i * 2.1);
        const appear = tween(t, at + i * 3, at + i * 3 + 14, 0, 1, EASE.out);
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            style={{
              position: "absolute",
              left: cx + Math.cos(angle) * dist - size / 2,
              top: cy + Math.sin(angle) * dist * 0.92 - size / 2,
              opacity: appear * (0.35 + pulse * 0.65),
              transform: `scale(${0.6 + pulse * 0.5}) rotate(${t * 0.6 + i * 20}deg)`,
            }}
          >
            <path d="M12 0c.9 7.2 4.8 11.1 12 12-7.2.9-11.1 4.8-12 12-.9-7.2-4.8-11.1-12-12 7.2-.9 11.1-4.8 12-12Z" fill={color} />
          </svg>
        );
      })}
    </>
  );
};

/** Titre d'un univers : catégorie, puis la phrase en deux lignes. */
const SceneTitle: React.FC<{
  eyebrow: string;
  line1: string;
  line2: string;
  tone?: Tone;
  out: number;
}> = ({ eyebrow, line1, line2, tone = "dark", out }) => {
  const { W, pick } = useFormat();
  const main = tone === "dark" ? COLORS.ivory : COLORS.ink;
  const accent = tone === "dark" ? COLORS.goldLight : COLORS.goldDeep;
  // Le titre n'arrive qu'une fois le décor installé, et part avant la coupe.
  const start = PRE + 8;
  const end = PRE + out - 8;
  return (
    <div style={{ position: "absolute", left: pick(72, 110), top: pick(262, 286), width: pick(W - 144, 700) }}>
      <Eyebrow at={start} out={end} color={accent} size={pick(27, 24)}>
        {eyebrow}
      </Eyebrow>
      <div style={{ height: pick(24, 26) }} />
      <RevealLine text={line1} at={start + 4} out={end} style={display(pick(118, 104), main)} />
      <div style={{ height: pick(10, 12) }} />
      <RevealLine text={line2} at={start + 10} out={end} italic style={{ ...display(pick(70, 56), accent), lineHeight: 1.12 }} />
    </div>
  );
};

/** Fond d'un univers, qui s'ouvre en cercle depuis le centre de la scène. */
const Backdrop: React.FC<{ tone: Tone; children: React.ReactNode }> = ({ tone, children }) => {
  const t = useSceneTime();
  const { W, H } = useFormat();
  const { cx, cy } = useStage();
  const open = tween(t, -PRE, 6, 0, 135, EASE.inOut);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: tone === "dark" ? COLORS.ink : COLORS.cream,
        clipPath: `circle(${open}% at ${(cx / W) * 100}% ${(cy / H) * 100}%)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 1. Les gâteaux : une arche, deux médaillons                         */
/* ------------------------------------------------------------------ */
const Gateaux: React.FC<{ dur: number }> = ({ dur }) => {
  const { cx, cy, k } = useStage();
  return (
    <Backdrop tone="dark">
      <Glow x={cx} y={cy} size={1500 * k} opacity={0.26} />
      <GoldDust count={18} seed="s3a" opacity={0.7} />
      <Ring r={452} at={-2} />
      <Ring r={500} at={6} dashed />
      <Shape photo="cake-turquoise" x={-340} y={250} w={270} h={270} radius="50%" at={8} from={[-160, 60]} focus="50% 38%" />
      <Shape photo="cake-blanc-or" x={345} y={-260} w={230} h={230} radius="50%" at={12} from={[160, -60]} focus="50% 30%" />
      <Shape photo="cake-noir-or" x={0} y={10} w={590} h={800} radius={`${300 * k}px ${300 * k}px ${26 * k}px ${26 * k}px`} at={0} focus="50% 44%" sweep />
      <Sparks seed="s3a" />
      <SceneTitle eyebrow="Gâteaux sur mesure" line1="Des gâteaux" line2="pour vos plus belles occasions" out={dur} />
    </Backdrop>
  );
};

/* ------------------------------------------------------------------ */
/* 2. Les pâtisseries : un grand cercle sur fond crème                 */
/* ------------------------------------------------------------------ */
const Patisseries: React.FC<{ dur: number }> = ({ dur }) => (
  <Backdrop tone="light">
    <Ring r={420} at={0} tone="light" />
    <Ring r={470} at={8} tone="light" dashed />
    <Shape photo="tarte-framboise" x={0} y={0} w={740} h={740} radius="50%" at={0} focus="50% 56%" tone="light" sweep />
    <Shape photo="velvet" x={-335} y={300} w={260} h={260} radius="50%" at={10} from={[-140, 80]} tone="light" />
    <Shape photo="moelleux" x={340} y={-285} w={220} h={220} radius="50%" at={14} from={[140, -80]} tone="light" focus="50% 40%" />
    <Sparks seed="s3b" tone="light" count={6} />
    <SceneTitle eyebrow="Pâtisseries" line1="Des pâtisseries" line2="pour célébrer vos moments précieux" tone="light" out={dur} />
  </Backdrop>
);

/* ------------------------------------------------------------------ */
/* 3. Mignardises et coffrets : deux gélules qui se croisent           */
/* ------------------------------------------------------------------ */
const Mignardises: React.FC<{ dur: number }> = ({ dur }) => {
  const { cx, cy, k } = useStage();
  return (
    <Backdrop tone="dark">
      <Glow x={cx} y={cy} size={1500 * k} opacity={0.24} />
      <GoldDust count={18} seed="s3c" opacity={0.7} />
      <Ring r={470} at={0} dashed />
      <Shape photo="mini-cupcakes" x={-235} y={-40} w={430} h={790} radius={`${215 * k}px`} at={0} from={[0, 420]} focus="55% 50%" sweep />
      <Shape photo="ecrin-garni" x={235} y={60} w={430} h={790} radius={`${215 * k}px`} at={6} from={[0, -420]} focus="50% 66%" />
      <Shape photo="mini-moelleux" x={0} y={395} w={210} h={210} radius="50%" at={16} from={[0, 90]} />
      <Sparks seed="s3c" count={6} spread={560} />
      <SceneTitle eyebrow="Mignardises · Coffrets cadeaux" line1="Des mignardises" line2="à partager, des coffrets à offrir" out={dur} />
    </Backdrop>
  );
};

/* ------------------------------------------------------------------ */
/* 4. Les buffets : une fenêtre en arche qui s'ouvre en grand          */
/* ------------------------------------------------------------------ */
const Buffets: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useSceneTime();
  const { W, H, vertical, pick } = useFormat();
  const { cx, cy, k } = useStage();
  // De l'arche au plein cadre.
  const open = tween(t, 4, 34, 0, 1, EASE.inOut);
  const area = pick({ x: 0, y: 0, w: W, h: H }, { x: W * 0.3, y: 0, w: W * 0.7, h: H });
  const arch = { x: cx - 300 * k, y: cy - 400 * k, w: 600 * k, h: 800 * k };
  const lerp = (a: number, b: number) => a + (b - a) * open;
  const box = { x: lerp(arch.x, area.x), y: lerp(arch.y, area.y), w: lerp(arch.w, area.w), h: lerp(arch.h, area.h) };
  const top = lerp(300 * k, 0);
  const bottom = lerp(26 * k, 0);
  return (
    <Backdrop tone="dark">
      <Glow x={cx} y={cy} size={1500 * k} opacity={0.24} />
      <Ring r={452} at={-4} />
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y + tween(t, -4, 22, 160, 0, EASE.out),
          width: box.w,
          height: box.h,
          borderRadius: `${top}px ${top}px ${bottom}px ${bottom}px`,
          overflow: "hidden",
          opacity: tween(t, -4, 8, 0, 1),
          boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
        }}
      >
        <Photo
          photo="buffet-reception"
          zoom={1.22 - open * 0.12 + tween(t, 0, dur + 20, 0, 0.08, EASE.linear)}
          focus={pick("50% 70%", "50% 72%")}
          style={{ inset: 0 }}
        />
        <LightSweep progress={tween(t, 24, 76, 0, 1, EASE.inOut)} opacity={0.18} />
      </div>
      <AbsoluteFill
        style={{
          opacity: open,
          background: pick(
            "linear-gradient(to bottom, rgba(18,12,9,0.94) 0%, rgba(18,12,9,0.78) 24%, rgba(18,12,9,0) 46%, rgba(18,12,9,0) 80%, rgba(18,12,9,0.5) 100%)",
            "linear-gradient(to right, rgba(18,12,9,1) 30%, rgba(18,12,9,0.6) 42%, rgba(18,12,9,0) 60%)",
          ),
        }}
      />
      <GoldDust count={vertical ? 22 : 26} seed="s3d" opacity={0.8} />
      <Sparks seed="s3d" count={5} spread={600} at={30} />
      <SceneTitle eyebrow="Buffets · Événements" line1="Des buffets" line2="pour sublimer vos événements" out={dur} />
    </Backdrop>
  );
};

const SCENES = [Gateaux, Patisseries, Mignardises, Buffets];

/** Séquence 3. Les services : quatre univers en motion design, un par phrase de la voix. */
export const S3Creations: React.FC = () => (
  <AbsoluteFill>
    {SCENES.map((Scene, i) => {
      const start = S3_CUTS[i];
      const dur = S3_CUTS[i + 1] - start;
      // Chaque univers reste monté le temps que le suivant le recouvre.
      return (
        <Sequence key={i} from={S3_LEAD + start - PRE} durationInFrames={dur + PRE + 16}>
          <Scene dur={dur} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
