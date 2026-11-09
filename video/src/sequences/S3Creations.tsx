import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import captures from "../data/captures.json";
import { GoldDust, Glow, LightSweep } from "../components/Atmosphere";
import { Photo, PhotoKey } from "../components/Photo";
import { Eyebrow, RevealLine, display } from "../components/Type";
import { EASE, tween } from "../lib/anim";
import { useFormat } from "../lib/format";
import { COLORS } from "../theme";
import { BEAT } from "../timeline";

/** Images d'avance, pour entrer pendant que le téléphone quitte le cadre. */
export const S3_LEAD = 16;
/** Chaque univers est monté PRE images avant son premier temps (son entrée). */
const PRE = S3_LEAD;
/** Horloge d'un univers : 0 sur son premier temps, négative pendant l'entrée. */
const useSceneTime = () => useCurrentFrame() - PRE;

/** Début de chaque univers, en temps musicaux depuis le début de la séquence. */
const CUTS = [0, 3, 6, 9, 12, 16].map((b) => b * BEAT);
const TOTAL = 5;

type Tone = "dark" | "light";

/** Titre d'un univers : numéro, nom en deux lignes (la seconde en italique). */
const SceneTitle: React.FC<{
  t: number;
  index: number;
  line1: string;
  line2: string;
  note?: string;
  tone?: Tone;
  out: number;
}> = ({ t, index, line1, line2, note, tone = "dark", out }) => {
  const { W, vertical, pick } = useFormat();
  const main = tone === "dark" ? COLORS.ivory : COLORS.ink;
  const accent = tone === "dark" ? COLORS.goldLight : COLORS.goldDeep;
  const size = pick(124, 116);
  return (
    <div
      style={{
        position: "absolute",
        left: pick(72, 110),
        top: pick(266, 250),
        width: pick(W - 144, 620),
        opacity: tween(t, out - 4, out + 8, 1, 0),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Eyebrow at={PRE + 2} color={accent} size={pick(26, 24)}>
          {`0${index} / 0${TOTAL}`}
        </Eyebrow>
        <div
          style={{
            height: 1.5,
            width: 110,
            backgroundColor: accent,
            opacity: 0.7,
            transform: `scaleX(${tween(t, 4, 28, 0, 1, EASE.out)})`,
            transformOrigin: "left",
          }}
        />
        {note && (
          <Eyebrow at={PRE + 10} color={accent} size={pick(26, 24)}>
            {note}
          </Eyebrow>
        )}
      </div>
      <div style={{ height: pick(26, 28) }} />
      <RevealLine text={line1} at={PRE + 3} duration={20} style={display(size, main)} />
      <RevealLine text={line2} at={PRE + 8} duration={20} italic style={{ ...display(size, accent), marginTop: vertical ? 2 : 0 }} />
    </div>
  );
};

/** Carte photo aux angles arrondis, comme les visuels du site. */
const Card: React.FC<{
  photo: PhotoKey;
  x: number;
  y: number;
  w: number;
  h: number;
  zoom?: number;
  focus?: string;
  transform?: string;
  opacity?: number;
  radius?: number;
  children?: React.ReactNode;
}> = ({ photo, x, y, w, h, zoom = 1, focus, transform, opacity = 1, radius = 22, children }) => (
  <div
    style={{
      position: "absolute",
      left: x - w / 2,
      top: y - h / 2,
      width: w,
      height: h,
      borderRadius: radius,
      overflow: "hidden",
      transform,
      opacity,
      boxShadow: "0 40px 90px rgba(0,0,0,0.5), 0 0 0 1.5px rgba(226,199,150,0.35)",
      backgroundColor: COLORS.inkSoft,
    }}
  >
    <Photo photo={photo} zoom={zoom} focus={focus} style={{ inset: 0 }} />
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* 1. Cake Design : trois créations en éventail                        */
/* ------------------------------------------------------------------ */
const CAKES: PhotoKey[] = ["cake-turquoise", "cake-noir-or", "cake-licorne", "cake-blanc-or"];

const CakeDesign: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useSceneTime();
  const { W, H, pick } = useFormat();
  const cx = pick(W / 2, 1320);
  const cy = pick(1150, 560);
  const k = pick(1.12, 0.86);
  const drift = tween(t, 0, dur, 0, 1, EASE.linear);
  // Le carrousel avance d'un cran au milieu du plan : une autre création passe devant.
  const turn = tween(t, 28, 46, 0, 1, EASE.inOut);
  const spread = pick(318, 420) * k;
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink, isolation: "isolate" }}>
      <Glow x={cx} y={cy} size={1500 * k} opacity={0.24} />
      <GoldDust count={20} seed="cake" opacity={0.7} />
      {CAKES.map((photo, i) => {
        const slot = i - 1 - turn; // 0 = au centre
        const away = Math.min(Math.abs(slot), 1.6);
        const front = 1 - Math.min(away, 1);
        const rise = tween(t, -S3_LEAD + Math.abs(i - 1) * 5, -S3_LEAD + Math.abs(i - 1) * 5 + 30, H * 0.9, 0, EASE.out);
        const w = (410 + 180 * front) * k;
        const h = (570 + 220 * front) * k;
        return (
          <div key={photo} style={{ position: "absolute", inset: 0, zIndex: Math.round(100 - away * 50) }}>
            <Card
              photo={photo}
              x={cx + slot * spread - Math.sign(slot) * drift * 14}
              y={cy + away * 26 + rise}
              w={w}
              h={h}
              zoom={1.04 + drift * 0.06}
              focus="50% 45%"
              opacity={tween(away, 1.05, 1.6, 0.96, 0)}
              transform={`perspective(1800px) rotateY(${-Math.max(-1, Math.min(1, slot)) * 20}deg) rotateZ(${Math.max(-1, Math.min(1, slot)) * 2.5}deg)`}
            >
              {front > 0.6 && <LightSweep progress={tween(t, i === 1 ? 4 : 40, i === 1 ? 34 : 66, 0, 1, EASE.inOut)} opacity={0.3} />}
            </Card>
          </div>
        );
      })}
      <div style={{ position: "absolute", inset: 0, zIndex: 200 }}>
        <SceneTitle t={t} index={1} line1="Cake" line2="Design" out={dur} />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 2. Gâteaux gourmands : la photo et les vraies cartes du site        */
/* ------------------------------------------------------------------ */
const Gateaux: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useSceneTime();
  const { W, H, pick } = useFormat();
  const cards = captures.ui.patisseries;
  const scale = pick(1.7, 1.36);
  const cw = cards[0].w * scale;
  const ch = cards[0].h * scale;
  const gap = pick(22, 22);
  const rowX = pick(72, 800);
  const rowY = pick(950, 468);
  const slide = tween(t, 0, 34, 420, 0, EASE.out) - tween(t, 0, dur, 0, 46, EASE.linear);
  // Le panneau crème monte avec un bord courbe, comme les séparateurs du site.
  const up = tween(t, -12, 10, 1, 0, EASE.inOut);
  const photo = pick({ x: 70, y: 620, w: W - 140, h: 400 }, { x: 800, y: 86, w: 1040, h: 440 });
  return (
    <AbsoluteFill style={{ transform: `translateY(${up * (H + 160)}px)` }}>
      <div
        style={{
          position: "absolute",
          left: "-15%",
          top: -110,
          width: "130%",
          height: 260,
          borderRadius: "50%",
          backgroundColor: COLORS.cream,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: COLORS.cream }} />
      <div
        style={{
          position: "absolute",
          left: photo.x,
          top: photo.y,
          width: photo.w,
          height: photo.h,
          borderRadius: 22,
          overflow: "hidden",
          clipPath: `inset(0 0 ${tween(t, 0, 26, 30, 0, EASE.out)}% 0 round 22px)`,
        }}
      >
        <Photo photo="moelleux" zoom={1.16 - tween(t, 0, dur, 0, 0.1, EASE.linear)} focus="50% 44%" style={{ inset: 0 }} />
      </div>
      {cards.map((c, i) => (
        <Img
          key={c.file}
          src={staticFile(`captures/${c.file}`)}
          style={{
            position: "absolute",
            left: rowX + i * (cw + gap) + slide * (1 + i * 0.35),
            top: rowY + tween(t, 2 + i * 4, 30 + i * 4, 90, 0, EASE.out),
            width: cw,
            height: ch,
            borderRadius: 10 * scale,
            boxShadow: "0 26px 60px rgba(58,42,32,0.24), 0 4px 12px rgba(58,42,32,0.1)",
            opacity: tween(t, i * 4, 14 + i * 4, 0, 1),
          }}
        />
      ))}
      <SceneTitle t={t} index={2} line1="Gâteaux" line2="gourmands" tone="light" out={dur} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 3. Mignardises et crêpes : deux matières, une diagonale             */
/* ------------------------------------------------------------------ */
const Mignardises: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useSceneTime();
  const { W, H, vertical, pick } = useFormat();
  const inA = tween(t, -10, 12, 1, 0, EASE.inOut);
  const inB = tween(t, -6, 16, 1, 0, EASE.inOut);
  const move = tween(t, 0, dur, 0, 1, EASE.linear);
  // Diagonale : horizontale inclinée en vertical, verticale inclinée en horizontal.
  const A = pick("polygon(0 0, 100% 0, 100% 50%, 0 64%)", "polygon(34% 0, 71% 0, 61% 100%, 34% 100%)");
  const B = pick("polygon(0 64%, 100% 50%, 100% 100%, 0 100%)", "polygon(71% 0, 100% 0, 100% 100%, 61% 100%)");
  const angle = pick(-Math.atan((0.14 * H) / W), Math.atan((0.1 * W) / H));
  return (
    <AbsoluteFill>
      {!vertical && <AbsoluteFill style={{ backgroundColor: COLORS.ink, opacity: tween(t, -10, 4, 0, 1) }} />}
      <AbsoluteFill style={{ clipPath: A, transform: pick(`translateX(${-inA * 100}%)`, `translateY(${-inA * 100}%)`) }}>
        <Photo photo="mini-burgers" zoom={1.22 - move * 0.1} panX={-2 + move * 3} focus={pick("50% 40%", "50% 50%")} style={pick({ inset: 0 }, { left: "30%", top: 0, width: "45%", height: "100%" })} />
        <AbsoluteFill style={{ background: pick("linear-gradient(to bottom, rgba(18,12,9,0.9) 0%, rgba(18,12,9,0.62) 24%, rgba(18,12,9,0) 42%)", "linear-gradient(to right, rgba(18,12,9,1) 33%, rgba(18,12,9,0) 46%)") }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: B, transform: pick(`translateX(${inB * 100}%)`, `translateY(${inB * 100}%)`) }}>
        <Photo photo="crepes-suzette" zoom={1.12 + move * 0.1} panX={2 - move * 3} focus="50% 50%" style={pick({ left: 0, top: "48%", width: "100%", height: "52%" }, { left: "58%", top: 0, width: "42%", height: "100%" })} />
      </AbsoluteFill>
      {/* Filet doré le long de la diagonale */}
      <div
        style={{
          position: "absolute",
          left: pick(-W * 0.1, 0.66 * W - 1),
          top: pick(0.57 * H - 1.5, -H * 0.1),
          width: pick(W * 1.2, 3),
          height: pick(3, H * 1.2),
          background: `linear-gradient(${pick("90deg", "180deg")}, rgba(202,165,108,0), ${COLORS.goldLight}, rgba(202,165,108,0))`,
          transform: `rotate(${angle}rad) scale${pick("X", "Y")}(${tween(t, 6, 30, 0, 1, EASE.out)})`,
          opacity: 0.9,
        }}
      />
      <SceneTitle t={t} index={3} line1="Mignardises" line2="et crêpes" out={dur} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 4. L'Écrin gourmand : le coffret s'ouvre                            */
/* ------------------------------------------------------------------ */
const Ecrin: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useSceneTime();
  const { W, pick } = useFormat();
  const cx = pick(W / 2, 1330);
  const cy = pick(1130, 548);
  const w = pick(800, 700);
  const h = pick(900, 800);
  const iris = tween(t, -10, 14, 0, 150, EASE.inOut);
  const open1 = tween(t, 15, 31, 100, 0, EASE.inOut);
  const open2 = tween(t, 33, 49, 100, 0, EASE.inOut);
  const zoomOut = tween(t, dur - 10, dur + 6, 1, 1.5, EASE.in);
  return (
    <AbsoluteFill style={{ clipPath: `circle(${iris}% at ${(cx / W) * 100}% 58%)`, backgroundColor: COLORS.ink }}>
      <Glow x={cx} y={cy} size={1500} opacity={0.26} />
      <GoldDust count={18} seed="ecrin" opacity={0.7} />
      <div
        style={{
          position: "absolute",
          left: cx - w / 2,
          top: cy - h / 2,
          width: w,
          height: h,
          borderRadius: 24,
          overflow: "hidden",
          transform: `scale(${(0.94 + tween(t, 0, dur, 0, 0.06, EASE.linear)) * zoomOut})`,
          opacity: tween(t, dur - 4, dur + 6, 1, 0),
          boxShadow: "0 50px 110px rgba(0,0,0,0.6), 0 0 0 1.5px rgba(226,199,150,0.45)",
        }}
      >
        <Photo photo="ecrin-ferme" zoom={1.08} focus="50% 50%" style={{ inset: 0 }} />
        {/* Le couvercle se lève : chaque photo se découvre de bas en haut */}
        <AbsoluteFill style={{ clipPath: `inset(${open1}% 0 0 0)` }}>
          <Photo photo="ecrin-ouvert" zoom={1.06} focus="50% 50%" style={{ inset: 0 }} />
        </AbsoluteFill>
        <AbsoluteFill style={{ clipPath: `inset(${open2}% 0 0 0)` }}>
          <Photo photo="ecrin-garni" zoom={1.14 - tween(t, 33, dur, 0, 0.08)} focus="50% 62%" style={{ inset: 0 }} />
        </AbsoluteFill>
        {[open1, open2].map((o, i) =>
          o > 0 && o < 100 ? (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${o}%`,
                height: 3,
                marginTop: -1.5,
                background: `linear-gradient(90deg, rgba(226,199,150,0), ${COLORS.goldLight}, rgba(226,199,150,0))`,
                boxShadow: "0 0 26px 6px rgba(226,199,150,0.5)",
              }}
            />
          ) : null,
        )}
      </div>
      <SceneTitle t={t} index={4} line1="L’Écrin" line2="gourmand" note="Nouveau" out={dur} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 5. Buffets gourmands : le grand plan                                */
/* ------------------------------------------------------------------ */
const Buffets: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useSceneTime();
  const { vertical, pick } = useFormat();
  const enter = tween(t, -8, 8, 0, 1);
  const push = tween(t, -8, dur + 10, 0, 1, EASE.linear);
  return (
    <AbsoluteFill style={{ opacity: enter, backgroundColor: COLORS.ink }}>
      <Photo
        photo="buffet-reception"
        zoom={1.3 - tween(t, -8, 22, 0, 0.2, EASE.out) + push * 0.08}
        focus={pick("50% 70%", "50% 72%")}
        style={pick({ inset: 0 }, { left: "30%", top: 0, width: "70%", height: "100%" })}
      />
      <AbsoluteFill
        style={{
          background: pick(
            "linear-gradient(to bottom, rgba(18,12,9,0.92) 0%, rgba(18,12,9,0.7) 22%, rgba(18,12,9,0) 44%, rgba(18,12,9,0) 80%, rgba(18,12,9,0.5) 100%)",
            "linear-gradient(to right, rgba(18,12,9,1) 30%, rgba(18,12,9,0.55) 42%, rgba(18,12,9,0) 58%)",
          ),
        }}
      />
      <GoldDust count={vertical ? 22 : 26} seed="buffet" opacity={0.8} />
      <LightSweep progress={tween(t, 4, 60, 0, 1, EASE.inOut)} opacity={0.16} />
      <Img
        src={staticFile(`captures/${captures.ui.traiteur[1].file}`)}
        style={{
          position: "absolute",
          left: pick(72, 1530),
          top: pick(960, 400) + tween(t, 22, 50, 160, 0, EASE.out),
          width: captures.ui.traiteur[1].w * pick(1.3, 1.2),
          borderRadius: 13,
          opacity: tween(t, 22, 38, 0, 1) * tween(t, dur - 12, dur - 2, 1, 0),
          transform: `rotate(${tween(t, 22, 50, -7, -2.5, EASE.out)}deg)`,
          boxShadow: "0 40px 90px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(226,199,150,0.4)",
        }}
      />
      <SceneTitle t={t} index={5} line1="Buffets" line2="gourmands" out={dur - 8} />
    </AbsoluteFill>
  );
};

const SCENES = [CakeDesign, Gateaux, Mignardises, Ecrin, Buffets];

/** Séquence 3. Les créations : cinq univers, un changement par phrase musicale. */
export const S3Creations: React.FC = () => (
  <AbsoluteFill>
    {SCENES.map((Scene, i) => {
      const start = CUTS[i];
      const dur = CUTS[i + 1] - start;
      // Chaque univers reste monté le temps que le suivant le recouvre.
      return (
        <Sequence key={i} from={S3_LEAD + start - PRE} durationInFrames={dur + PRE + 18}>
          <Scene dur={dur} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
