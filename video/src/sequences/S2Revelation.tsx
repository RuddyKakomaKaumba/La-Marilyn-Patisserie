import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import captures from "../data/captures.json";
import { GoldDust, Glow, InkBackdrop, LightSweep } from "../components/Atmosphere";
import { Browser, BROWSER, PageScroll, Phone, PHONE, PHONE_VIEWPORT } from "../components/Devices";
import { Photo } from "../components/Photo";
import { Eyebrow, GoldRule, RevealLine, display } from "../components/Type";
import { EASE, keys, tween } from "../lib/anim";
import { useFormat } from "../lib/format";
import { COLORS } from "../theme";

/** Images d'avance sur la séquence, pour le fondu depuis l'accroche. */
export const S2_LEAD = 14;

/** Bouton WhatsApp flottant du site, replacé en bas de l'écran. */
export const WaFloat: React.FC = () => (
  <Img
    src={staticFile("captures/m-wa-float.png")}
    style={{
      position: "absolute",
      left: captures.waFloat.x,
      top: PHONE_VIEWPORT - 64,
      width: captures.waFloat.w,
      height: captures.waFloat.h,
    }}
  />
);

/**
 * Séquence 2. La révélation : la photo de l'accroche était déjà le site.
 * La caméra recule, l'écran apparaît, puis la page d'accueil défile.
 */
export const S2Revelation: React.FC = () => {
  const frame = useCurrentFrame();
  const g = frame - S2_LEAD; // 0 = premier temps de la mesure 3
  const { W, H, vertical, pick } = useFormat();

  const pull = tween(g, 0, 52, 0, 1, EASE.inOut);
  const body = tween(g, 2, 22, 0, 1);
  const exit = tween(g, 212, 240, 0, 1, EASE.in);
  const float = Math.sin(g / 34) * 8;
  const titleOut = 200;

  /* ------------------------- Téléphone ------------------------- */
  const phoneFull = W / PHONE.width; // l'écran occupe toute la largeur
  const phoneRest = pick(1.58, 0.64);
  const phoneScale = vertical ? phoneFull + (phoneRest - phoneFull) * pull : phoneRest;
  const phoneX = pick(W / 2, 330);
  const phoneY = vertical ? H / 2 + (1215 - H / 2) * pull + float : 742 + float + tween(g, 34, 70, 700, 0, EASE.out);
  const phoneRotY = vertical ? keys(g, [0, 52, 210], [0, -15, 9]) : keys(g, [34, 210], [22, 8]);
  const phoneRotX = vertical ? keys(g, [0, 52, 210], [0, 7, 3]) : 4;
  const mobileScroll = keys(g, [64, 112, 130, 204], [0, 860, 910, 1730], EASE.inOut);

  /* ------------------------- Navigateur ------------------------ */
  const browserFull = W / BROWSER.width;
  const browserRest = 0.72;
  const browserScale = browserFull + (browserRest - browserFull) * pull;
  const browserX = W / 2 + (1262 - W / 2) * pull;
  const fullY = -60 + ((BROWSER.height + BROWSER.bar) / 2 - BROWSER.bar) * browserFull;
  const browserY = fullY + (560 - fullY) * pull + float * 0.6;
  const desktopScroll = keys(g, [64, 112, 130, 204], [0, 780, 840, 1900], EASE.inOut);

  return (
    <AbsoluteFill style={{ opacity: tween(frame, 0, S2_LEAD, 0, 1, EASE.linear) }}>
      <InkBackdrop glow={0.16}>
        <Photo
          photo="hero"
          blur
          zoom={1.25 + pull * 0.1}
          style={{ inset: 0, opacity: 0.34 }}
          focus="50% 60%"
        />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(18,12,9,0.15) 0%, rgba(18,12,9,0.86) 78%)" }} />
        <Glow x={pick(W / 2, 1215)} y={pick(1215, 560)} size={pick(1500, 1700)} opacity={0.2 * pull} />
      </InkBackdrop>
      <GoldDust count={26} seed="revelation" opacity={0.75 * pull} drift={g * 0.8} />

      {/* Arrière-plan : de vraies cartes du site dérivent, loin derrière l'écran */}
      {(vertical
        ? [
            { file: "ui-mignardises-1", x: -70, y: 1180, k: 1.25, speed: 1.0 },
            { file: "ui-patisseries-2", x: 880, y: 760, k: 1.5, speed: 1.5 },
            { file: "ui-crepes-2", x: 900, y: 1560, k: 1.2, speed: 0.8 },
            { file: "ui-traiteur-1", x: -120, y: 600, k: 1.0, speed: 0.6 },
          ]
        : []
      ).map((c, i) => (
        <Img
          key={c.file}
          src={staticFile(`captures/${c.file}.png`)}
          style={{
            position: "absolute",
            left: c.x,
            top: c.y - g * c.speed + (1 - pull) * 500 - exit * H,
            width: 200 * c.k,
            borderRadius: 12 * c.k,
            opacity: 0.42 * tween(g, 20 + i * 6, 60 + i * 6, 0, 1),
            transform: `rotate(${(i % 2 ? 1 : -1) * 4}deg)`,
            filter: "brightness(0.8)",
          }}
        />
      ))}

      <AbsoluteFill style={{ perspective: 2400, transform: `translateY(${-exit * H * 1.15}px)` }}>
        {!vertical && (
          <Browser
            scale={browserScale}
            chrome={body}
            style={{
              left: browserX,
              top: browserY,
              transform: `scale(${browserScale}) rotateY(${keys(g, [0, 52, 210], [0, -11, -5])}deg) rotateX(${pull * 3}deg)`,
            }}
          >
            <PageScroll page="d-accueil-page" scrollY={desktopScroll} viewportHeight={BROWSER.height} />
          </Browser>
        )}
        <Phone
          scale={phoneScale}
          body={vertical ? body : 1}
          shine={tween(g, 30, 80, 0, 1, EASE.inOut)}
          style={{
            left: phoneX,
            top: phoneY,
            transform: `scale(${phoneScale}) rotateY(${phoneRotY}deg) rotateX(${phoneRotX}deg)`,
          }}
          overlay={null}
        >
          <PageScroll page="m-accueil-page" scrollY={mobileScroll} viewportHeight={PHONE_VIEWPORT} />
          <WaFloat />
        </Phone>
      </AbsoluteFill>

      {/* Éclat sur le premier temps */}
      <LightSweep progress={tween(g, -2, 30, 0, 1, EASE.out)} opacity={0.3 * tween(g, 20, 34, 1, 0)} />

      {/* Annonce */}
      <div
        style={{
          position: "absolute",
          left: pick(0, 110),
          top: pick(268, 150),
          width: pick(W, 760),
          display: "flex",
          flexDirection: "column",
          alignItems: vertical ? "center" : "flex-start",
          transform: `translateY(${-exit * 300}px)`,
        }}
      >
        <Eyebrow at={frame < 0 ? 0 : S2_LEAD + 56} out={S2_LEAD + titleOut} size={pick(38, 34)}>
          Notre nouveau site
        </Eyebrow>
        <div style={{ height: pick(20, 18) }} />
        <RevealLine
          text="EST EN LIGNE"
          at={S2_LEAD + 62}
          out={S2_LEAD + titleOut}
          stagger={4}
          style={{ ...display(pick(124, 84)), letterSpacing: "0.02em", fontWeight: 300, flexWrap: "nowrap" }}
        />
        <div style={{ height: pick(26, 24) }} />
        <GoldRule at={S2_LEAD + 76} out={S2_LEAD + titleOut} width={pick(150, 130)} origin={vertical ? "center" : "left"} />
      </div>
    </AbsoluteFill>
  );
};
