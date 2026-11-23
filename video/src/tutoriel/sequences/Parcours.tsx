import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import P from "../data/parcours.json";
import { COLORS } from "../../theme";
import { SANS, SERIF } from "../../fonts";
import { EASE, tween } from "../../lib/anim";
import { RevealLine, display } from "../../components/Type";
import { LightSweep } from "../../components/Atmosphere";
import { Phone, camAt, toFrame, CamKey, SCREEN } from "../components/Phone";
import { Loupe, Tag } from "../components/Marks";
import { Fades, StepHeader } from "../components/Stage";
import { MARKS, MEDALLION, creationsScroll, screenAt, scrollSpeed } from "../screens";
import { MessageCard } from "../components/MessageCard";
import { PageCrop } from "../components/PageCrop";
import { CUE, SEQ } from "../timeline";

const C = CUE;
const MID = SCREEN.width / 2;

/**
 * Caméra du plan-séquence (repère de l'écran). Chaque position clé vise un
 * point de l'interface ; la caméra se déplace en douceur de l'une à l'autre.
 */
const CAM: CamKey[] = [
  // 1. Accroche : du médaillon de l'entremets au téléphone
  { f: 0, s: 5.0, x: MEDALLION.x, y: MEDALLION.y },
  { f: C.photoToSite - 4, s: 2.77, x: MID, y: 440 },
  { f: C.photoToSite + 8, s: 2.77, x: MID, y: 440 },
  { f: SEQ.decouvrir.from - 6, s: 1.62, x: MID, y: 430, ry: -10, rx: 4 },
  // 2. Découvrir les créations
  { f: C.tapDecouvrir - 10, s: 1.78, x: 175, y: 400, ry: -6, rx: 3 },
  { f: C.navCreations + 26, s: 2.05, x: MID, y: 335, ry: 3 },
  { f: C.fastScroll - 4, s: 2.0, x: MID, y: 350, ry: 5 },
  { f: C.fastScroll + 12, s: 1.48, x: MID, y: 430, ry: 12, rx: 5 },
  { f: C.rewind, s: 1.48, x: MID, y: 430, ry: 10, rx: 4 },
  { f: C.onCard, s: 1.85, x: 150, y: 350, ry: -4 },
  { f: C.tapCard - 2, s: 1.95, x: 140, y: 380, ry: -6 },
  { f: C.ficheOpen + 18, s: 1.72, x: MID, y: 410, ry: -4 },
  // 3. Ajouter au panier
  { f: C.ficheScroll, s: 1.72, x: MID, y: 430 },
  { f: C.ficheScroll + 34, s: 1.92, x: MID, y: 600, ry: -5 },
  { f: C.added + 6, s: 1.92, x: MID, y: 640, ry: -4 },
  { f: C.ficheScroll2 + 22, s: 1.92, x: MID, y: 690, ry: -3 },
  { f: C.sheetClose + 10, s: 1.6, x: 240, y: 600, ry: 6 },
  { f: C.toMignardises - 2, s: 1.6, x: 240, y: 600, ry: 6 },
  { f: C.toMignardises + 40, s: 1.85, x: 150, y: 500, ry: -6 },
  { f: C.burgerAdded + 18, s: 1.85, x: 160, y: 540, ry: -4 },
  { f: C.multi + 22, s: 1.0, x: MID, y: 470, ry: 14, rx: 4, ax: 235 },
  { f: C.tapFloat - 30, s: 1.0, x: MID, y: 470, ry: 12, rx: 4, ax: 235 },
  { f: C.tapFloat - 4, s: 1.7, x: 300, y: 690, ry: 4 },
  // 4. Consulter le panier
  { f: C.drawerOpen + 16, s: 1.4, x: MID, y: 500 },
  { f: C.tapPlus - 8, s: 1.46, x: MID, y: 500 },
  { f: C.total + 16, s: 1.55, x: MID, y: 585 },
  { f: C.tapFinaliser - 26, s: 1.55, x: MID, y: 620 },
  { f: C.tapFinaliser, s: 1.62, x: MID, y: 660 },
  // 5. Finaliser sur WhatsApp
  { f: C.navCommande + 18, s: 1.55, x: MID, y: 420 },
  { f: C.toInfos + 26, s: 1.88, x: MID, y: 250 },
  { f: C.toMode, s: 1.88, x: MID, y: 290 },
  { f: C.toMode + 26, s: 1.88, x: MID, y: 320 },
  { f: C.toSubmit, s: 1.88, x: MID, y: 400 },
  { f: C.toSubmit + 26, s: 1.88, x: MID, y: 300 },
  { f: C.message, s: 1.5, x: MID, y: 330, ry: -6 },
  { f: C.message + 40, s: 1.05, x: MID, y: 422, ry: -14, ax: -40, ay: -10 },
  { f: SEQ.final.from, s: 0.98, x: MID, y: 422, ry: -16, ax: -40, ay: -10 },
];

/** Plan-séquence des étapes : accroche, découverte, panier, commande. */
export const Parcours: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt(f, CAM);
  const body = tween(f, C.phoneIn - 10, C.phoneIn + 26, 0, 1, EASE.inOut);
  const dim = tween(f, C.message, C.message + 20, 0, 0.55);
  const exit = tween(f, SEQ.final.from - 14, SEQ.final.from + 8, 0, 1, EASE.in);
  const blurIn = tween(f, 0, 26, 10, 0, EASE.soft);
  const screen = screenAt(f);

  // Repères dans le film pour les loupes et étiquettes
  const pricePt = toFrame(cam, MARKS.price.x + MARKS.price.w / 2, MARKS.price.y + MARKS.price.h / 2);
  const totalPt = toFrame(cam, MARKS.total2.x + MARKS.total2.w - 60, MARKS.total2.y + MARKS.total2.h / 2);
  const floatPt = toFrame(cam, MARKS.float.x + MARKS.float.w / 2, MARKS.float.y + MARKS.float.h / 2);
  const burgerPt = toFrame(cam, MARKS.burgerAdd.x + MARKS.burgerAdd.w / 2, MARKS.burgerAdd.y);

  // Titres des sections pendant le défilement rapide
  const sections: [string, number][] = [
    ["Gâteaux gourmands", P.creations.sections.patisseries.y],
    ["Cake Design", P.creations.sections["cake-design"].y],
    ["Mignardises", P.creations.sections.mignardises.y],
    ["Crêpes", P.creations.sections.crepes.y],
    ["L’Écrin gourmand", P.creations.sections.ecrin.y],
    ["Buffets", P.creations.sections.traiteur.y],
  ];
  const scroll = creationsScroll(f);
  const passing = f > C.fastScroll && f < C.rewind + 4 ? sections.filter(([, y]) => y <= scroll + 500).pop() : undefined;

  return (
    <AbsoluteFill style={{ opacity: 1 - exit * 0.0 }}>
      <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${1 - exit * 0.06})`, filter: blurIn > 0.3 ? `blur(${blurIn}px)` : undefined }}>
        <Phone cam={cam} body={body} dim={dim} shine={tween(f, C.phoneIn, C.phoneIn + 50, 0, 1, EASE.inOut)}>
          {screen}
        </Phone>
        {/* Reflet chaud sur le premier plan */}
        <LightSweep progress={tween(f, 6, 90, 0, 1, EASE.inOut)} opacity={0.18 * tween(f, 80, 100, 1, 0)} />
      </AbsoluteFill>

      <Fades top={tween(f, 0, 30, 0.7, 1)} bottom={1} />

      {/* 1. Accroche : la promesse */}
      <div style={{ position: "absolute", left: 0, top: 290, width: 1080, display: "flex", flexDirection: "column", alignItems: "center", opacity: tween(f, C.photoToSite - 6, C.photoToSite + 6, 1, 0) }}>
        <RevealLine text="VOS GOURMANDISES" at={20} stagger={4} style={{ ...display(96), letterSpacing: "0.03em", justifyContent: "center" }} />
        <div style={{ height: 14 }} />
        <RevealLine text="en quelques clics" at={34} italic stagger={4} style={{ ...display(88, COLORS.goldLight), justifyContent: "center" }} />
      </div>

      {/* En-tête des étapes */}
      <StepHeader marks={[SEQ.decouvrir.from + 8, SEQ.panier.from, SEQ.consulter.from, SEQ.whatsapp.from]} from={SEQ.decouvrir.from + 8} to={SEQ.final.from - 10} />

      {/* Défilement rapide : la section qui passe */}
      {passing && (
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 1240,
            transform: "translate(-50%, -50%)",
            fontFamily: SERIF,
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: 70,
            color: COLORS.goldLight,
            textShadow: "0 6px 30px rgba(0,0,0,0.7)",
            whiteSpace: "nowrap",
            opacity: Math.min(1, scrollSpeed(f) / 20 + 0.4) * tween(f, C.rewind - 2, C.rewind + 4, 1, 0),
          }}
        >
          {passing[0]}
        </div>
      )}

      {/* Loupe sur le tarif de la carte */}
      <Loupe
        frame={f}
        from={C.onCard + 18}
        to={C.tapCard - 4}
        region={{ x: MARKS.price.x - 6, y: MARKS.price.y - 30, w: MARKS.price.w + 12, h: MARKS.price.h + 40 }}
        at={{ x: 790, y: 640, w: 430 }}
        source={pricePt}
        render={() => screenAt(f)}
      />

      {/* Ajout direct : la quantité minimale est respectée */}
      <Tag x={540} y={1228} frame={f} from={C.burgerAdded + 6} to={C.multi - 2} size={36}>
        10 pièces ajoutées : le minimum requis
      </Tag>

      {/* Plusieurs gourmandises, un seul panier */}
      <MultiCards f={f} target={floatPt} />

      {/* Loupe sur le total du panier */}
      <Loupe
        frame={f}
        from={C.total}
        to={C.tapFinaliser - 30}
        region={{ x: MARKS.total2.x - 8, y: MARKS.total2.y - 8, w: MARKS.total2.w + 16, h: MARKS.total2.h + 16 }}
        at={{ x: 540, y: 1205, w: 900 }}
        source={totalPt}
        render={() => screenAt(f)}
      />

      {/* Message préparé par le site */}
      {f >= C.message - 2 && f < SEQ.final.from + 10 && <MessageCard f={f} from={C.message} burgerPt={burgerPt} />}
    </AbsoluteFill>
  );
};

/**
 * Les deux créations choisies s'envolent vers le panier : un seul panier
 * pour plusieurs produits (cartes réelles du site, prises sur la page).
 */
const MultiCards: React.FC<{ f: number; target: { x: number; y: number } }> = ({ f, target }) => {
  const from = C.multi;
  if (f < from || f > C.tapFloat - 6) return null;
  // Les deux cartes, côte à côte, à la même hauteur (430 px du film).
  const H = 430;
  const g = P.creations.gateauCard;
  const b = P.creations.burgerCard;
  const cards = [
    { box: g, k: H / g.h, x: 72 + (H / g.h) * g.w * 0.5, y: 760, rot: -4, delay: 0 },
    { box: b, k: H / b.h, x: 72 + (H / g.h) * g.w + 22 + (H / b.h) * b.w * 0.5, y: 760, rot: 3, delay: 8, added: true },
  ];
  const fly = (d: number) => tween(f, from + 74 + d, from + 102 + d, 0, 1, EASE.in);
  const text = Math.min(tween(f, from + 14, from + 28, 0, 1), tween(f, from + 70, from + 82, 1, 0));
  return (
    <>
      <div style={{ position: "absolute", left: 72, top: 1004, width: 430, opacity: text, transform: `translateY(${(1 - text) * 14}px)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 300, fontStyle: "italic", fontSize: 54, lineHeight: 1.1, color: COLORS.goldLight }}>
          Plusieurs gourmandises,
          <br />
          un seul panier.
        </div>
      </div>
      {cards.map((c, i) => {
        const inn = tween(f, from + 6 + c.delay, from + 28 + c.delay, 0, 1, EASE.out);
        const t = fly(c.delay);
        const k = c.k * (1 - t * 0.88);
        const x = c.x + (target.x - c.x) * t;
        const y = c.y + (target.y - c.y) * t;
        const w = c.box.w * k;
        const h = c.box.h * k;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - w / 2 - (1 - inn) * 200,
              top: y - h / 2,
              width: w,
              height: h,
              borderRadius: 10 * k,
              overflow: "hidden",
              opacity: inn * (1 - tween(t, 0.82, 1, 0, 1)),
              transform: `rotate(${c.rot * (1 - t)}deg)`,
              boxShadow: "0 30px 70px rgba(0,0,0,0.5), 0 0 0 1.5px rgba(226,199,150,0.55)",
            }}
          >
            <PageCrop page="t-creations-page" box={c.box} scale={k} overlay={c.added ? "t-card-burgers-ajoute.png" : undefined} />
          </div>
        );
      })}
    </>
  );
};
