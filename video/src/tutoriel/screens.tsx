/**
 * Contenu de l'écran du téléphone, image par image, reconstitué à partir
 * des captures réelles du site (repère de l'écran : 390 × 844 px CSS).
 *
 * Chaque état correspond à une capture du parcours (scripts/tutoriel/
 * capture-parcours.cjs) ; les transitions (défilement, ouverture d'une
 * fenêtre, changement de page) reproduisent le comportement du site.
 */
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import P from "./data/parcours.json";
import PG from "./data/pages.json";
import { photoSrc } from "../components/Photo";
import { COLORS } from "../theme";
import { EASE, keys, tween } from "../lib/anim";
import { BottomSheet, Shot, TiledPage, cap } from "./components/Screen";
import { Ring, Touch } from "./components/Marks";
import { SCREEN } from "./components/Phone";
import { CUE } from "./timeline";

const C = CUE;
const W = SCREEN.width;
const H = SCREEN.height;
const center = (b: { x: number; y: number; w: number; h: number }) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });

/* ---- Repères mesurés sur le site ------------------------------------- */
const HERO = PG.heroInHome; // photo de l'accueil dans la capture
export const MEDALLION = { x: HERO.x + 541 * HERO.scale, y: HERO.y + 917 * HERO.scale };
const SCROLL_GATEAUX = P.fiche.scrollY; // 538 : section des gâteaux
const SCROLL_MIGNARDISES = P.burger.scrollY; // carte des Mini burgers
const FAST_END = 6100; // fin du défilement rapide (Buffets, Présentoirs)
const CMD = P.commande.states;
const SCROLL_INFOS = 860;
const SCROLL_MODE = 1300;
const SCROLL_SUBMIT = 2060;
const DRAWER2_TOP = H - P.panier.height2;
/** Décalage vertical, dans le panier, des éléments sous la première ligne. */
const DRAWER_GROW = P.panier.height2 - P.panier.height;

export const MARKS = {
  cta: center(P.accueil.cta),
  chips: P.creations.chips.slice(0, 7),
  card: { ...P.creations.gateauCard, y: P.creations.gateauCard.y - SCROLL_GATEAUX },
  price: { ...P.creations.gateauPrice, y: P.creations.gateauPrice.y - SCROLL_GATEAUX },
  ficheAdd: { ...P.fiche.addButton, y: P.fiche.sheetTop + P.fiche.addButton.y - 360 },
  ficheAddSection: { ...P.fiche.addSection, y: P.fiche.sheetTop + P.fiche.addSection.y - 360 },
  ficheAdded: { ...P.fiche.added, y: P.fiche.sheetTop + P.fiche.added.y - 470 },
  ficheContinue: { ...P.fiche.continue, y: P.fiche.sheetTop + P.fiche.continue.y - 470 },
  ficheTitle: { ...P.fiche.title, y: P.fiche.sheetTop + P.fiche.title.y },
  fichePrice: { ...P.fiche.price, y: P.fiche.sheetTop + P.fiche.price.y },
  burgerCard: { ...P.creations.burgerCard, y: P.creations.burgerCard.y - SCROLL_MIGNARDISES },
  burgerAdd: { ...P.creations.burgerAdd, y: P.creations.burgerAdd.y - SCROLL_MIGNARDISES },
  float: P.cartFloat1!,
  rows: P.panier.rows.map((r) => ({ ...r.box, y: P.panier.top844 + r.box.y })),
  plus: { ...P.panier.plus, y: P.panier.top844 + P.panier.plus.y },
  total2: { ...P.panier.total, y: DRAWER2_TOP + P.panier.total.y + DRAWER_GROW },
  finaliser2: { ...P.panier.finaliser, y: DRAWER2_TOP + P.panier.finaliser.y + DRAWER_GROW },
  name: { ...CMD[0].name, y: CMD[0].name.y - SCROLL_INFOS },
  date: { ...CMD[0].date, y: CMD[0].date.y - SCROLL_INFOS },
  livraison: { ...CMD[1].livraison, y: CMD[1].livraison.y - SCROLL_MODE },
  place: { ...CMD[1].place!, y: CMD[1].place!.y - SCROLL_MODE },
  submit: { ...CMD[3].submit, y: CMD[3].submit.y - SCROLL_SUBMIT },
};

/* ---- Défilements -------------------------------------------------------- */
export const creationsScroll = (f: number) =>
  f < C.toMignardises
    ? keys(f, [C.fastScroll, C.rewind - 4, C.rewind, C.onCard], [0, FAST_END, FAST_END, SCROLL_GATEAUX], EASE.inOut)
    : tween(f, C.toMignardises, C.toMignardises + 36, SCROLL_GATEAUX, SCROLL_MIGNARDISES, EASE.inOut);

const commandeScroll = (f: number) =>
  keys(
    f,
    [C.toInfos, C.toInfos + 26, C.toMode, C.toMode + 24, C.toSubmit, C.toSubmit + 26],
    [0, SCROLL_INFOS, SCROLL_INFOS, SCROLL_MODE, SCROLL_MODE, SCROLL_SUBMIT],
    EASE.inOut,
  );

/** Vitesse de défilement (px CSS par image), pour le flou de bougé. */
export const scrollSpeed = (f: number) => Math.abs(creationsScroll(f + 1) - creationsScroll(f));

/* ---- Éléments flottants du site ------------------------------------------ */
const WaFloat: React.FC = () => <Shot name="t-wa-float.png" x={P.waFloat.x} y={P.waFloat.y} w={P.waFloat.w} />;

const CartFloat: React.FC<{ f: number }> = ({ f }) => {
  if (f < C.float1) return null;
  const two = f >= C.burgerAdded + 2;
  const at = two ? C.burgerAdded + 2 : C.float1;
  const pop = tween(f, at, at + 6, 0.6, 1.12, EASE.out) - tween(f, at + 6, at + 14, 0, 0.12, EASE.inOut);
  const b = two ? P.cartFloat2! : P.cartFloat1!;
  return (
    <Img
      src={cap(two ? "t-cart-float-2.png" : "t-cart-float-1.png")}
      style={{
        position: "absolute",
        left: b.x,
        top: b.y,
        width: b.w,
        transform: `scale(${f < at + 14 ? pop : 1})`,
        opacity: tween(f, at - 1, at + 3, 0.2, 1),
      }}
    />
  );
};

/* ---- Pages -------------------------------------------------------------- */

/** Accueil : d'abord la photo seule (premier plan), puis la page. */
const Home: React.FC<{ f: number }> = ({ f }) => {
  const site = tween(f, C.photoToSite, C.photoToSite + 18, 0, 1, EASE.inOut);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      {site < 1 && (
        <Img
          src={photoSrc("hero")}
          style={{ position: "absolute", left: HERO.x, top: HERO.y, width: 941 * HERO.scale, height: 1672 * HERO.scale }}
        />
      )}
      <Shot name="t-accueil.png" opacity={site} />
      {f > C.photoToSite && <Touch x={MARKS.cta.x} y={MARKS.cta.y} frame={f} at={C.tapDecouvrir} />}
      <Ring box={P.accueil.cta} frame={f} from={C.tapDecouvrir - 18} to={C.tapDecouvrir + 4} radius={24} pad={5} />
    </AbsoluteFill>
  );
};

const Creations: React.FC<{ f: number; children?: React.ReactNode; floats?: boolean }> = ({ f, children, floats = true }) => {
  const scroll = creationsScroll(f);
  const speed = scrollSpeed(f);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <div style={{ position: "absolute", inset: 0, filter: speed > 8 ? `blur(${Math.min(5, speed / 30)}px)` : undefined }}>
        <TiledPage page="t-creations-page" scroll={scroll}>
          {f >= C.burgerAdded && (
            <Shot name="t-card-burgers-ajoute.png" x={P.creations.burgerCard.x} y={P.creations.burgerCard.y} w={P.creations.burgerCard.w} />
          )}
        </TiledPage>
      </div>
      {floats && (
        <>
          <WaFloat />
          <CartFloat f={f} />
        </>
      )}
      {children}
    </AbsoluteFill>
  );
};

/** Formulaire de commande : état de la page selon l'avancée de la saisie. */
const Commande: React.FC<{ f: number }> = ({ f }) => {
  const scroll = commandeScroll(f);
  const state = f >= C.tapSend + 3 ? 3 : f >= C.typePlace + 26 ? 2 : f >= C.tapLivraison + 2 ? 1 : 0;
  const page = (["t-commande-0", "t-commande-1", "t-commande-2", "t-commande-3"] as const)[state];
  const s0 = CMD[0];
  const s1 = CMD[1];
  const nameCrops = P.commande.nameCrops;
  const placeCrops = P.commande.placeCrops;
  const typed = (list: { file: string }[], from: number, frames: number) => {
    const k = Math.floor(tween(f, from, from + frames, 0, list.length, EASE.linear));
    return k <= 0 ? null : list[Math.min(list.length, k) - 1].file;
  };
  const nameFile = typed(nameCrops, C.typeName, 26);
  const placeFile = typed(placeCrops, C.typePlace, 24);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <TiledPage page={page} scroll={scroll}>
        {state === 0 && nameFile && <Shot name={nameFile} x={s0.name.x} y={s0.name.y} w={s0.name.w} />}
        {state === 0 && f >= C.dateShown && <Shot name="t-date.png" x={s0.date.x} y={s0.date.y} w={s0.date.w} />}
        {state === 1 && placeFile && <Shot name={placeFile} x={s1.place!.x} y={s1.place!.y} w={s1.place!.w} />}
      </TiledPage>
      <WaFloat />
    </AbsoluteFill>
  );
};

/* ---- Écran complet, image par image ------------------------------------ */
export const screenAt = (f: number): React.ReactNode => {
  // 1. Accueil, puis passage à « Nos créations »
  if (f < C.navCreations) return <Home f={f} />;
  if (f < C.navCreations + 20) {
    const p = tween(f, C.navCreations, C.navCreations + 18, 0, 1, EASE.inOut);
    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${-p * W * 0.35}px)`, opacity: 1 - p * 0.6 }}>
          <Home f={f} />
        </div>
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - p) * W}px)`, boxShadow: "-20px 0 40px rgba(0,0,0,0.3)" }}>
          <Creations f={f} />
        </div>
      </AbsoluteFill>
    );
  }
  // 2. Fiche du Moelleux au chocolat
  if (f >= C.ficheOpen && f < C.sheetClose + 20) {
    const open = Math.min(tween(f, C.ficheOpen, C.ficheOpen + 20, 0, 1, EASE.out), tween(f, C.sheetClose, C.sheetClose + 18, 1, 0, EASE.inOut));
    const scroll = keys(f, [C.ficheScroll, C.ficheScroll + 30, C.ficheScroll2, C.ficheScroll2 + 18], [0, 360, 360, 470], EASE.inOut);
    const mix = tween(f, C.added, C.added + 5, 0, 1);
    return (
      <Creations f={f} floats={false}>
        <WaFloat />
        <BottomSheet
          name="t-fiche.png"
          contentHeight={P.fiche.height}
          top={P.fiche.sheetTop}
          open={open}
          scroll={scroll}
          next={{ name: "t-fiche-ajoute.png", contentHeight: P.fiche.heightAdded, mix }}
        />
        <Touch x={W / 2} y={MARKS.card.y + 120} frame={f} at={C.tapCard} />
        <Touch {...center(MARKS.ficheAdd)} frame={f} at={C.tapAdd} />
        <Touch {...center(MARKS.ficheContinue)} frame={f} at={C.tapContinue} />
        <Ring box={MARKS.ficheAdd} frame={f} from={C.tapAdd - 22} to={C.tapAdd + 2} radius={24} />
        <Ring box={MARKS.ficheAdded} frame={f} from={C.added + 8} to={C.ficheScroll2 + 30} radius={14} />
      </Creations>
    );
  }
  // 3. Panier ouvert
  if (f >= C.drawerOpen && f < C.navCommande) {
    const open = tween(f, C.drawerOpen, C.drawerOpen + 20, 0, 1, EASE.out);
    const mix = tween(f, C.plusDone, C.plusDone + 6, 0, 1);
    const rows = MARKS.rows;
    return (
      <Creations f={f}>
        <BottomSheet
          name="t-panier-1.png"
          contentHeight={P.panier.height}
          top={P.panier.top844}
          open={open}
          next={{ name: "t-panier-2.png", contentHeight: P.panier.height2, top: DRAWER2_TOP, mix }}
        />
        <Ring box={rows[0]} frame={f} from={C.rows} to={C.rows + 44} radius={12} pad={2} />
        <Ring box={rows[1]} frame={f} from={C.rows + 44} to={C.rows + 90} radius={12} pad={2} />
        <Ring box={MARKS.plus} frame={f} from={C.tapPlus - 16} to={C.tapPlus + 6} radius={20} pad={3} />
        <Touch {...center(MARKS.plus)} frame={f} at={C.tapPlus} />
        <Ring box={MARKS.finaliser2} frame={f} from={C.tapFinaliser - 22} to={C.tapFinaliser + 4} radius={24} />
        <Touch {...center(MARKS.finaliser2)} frame={f} at={C.tapFinaliser} />
      </Creations>
    );
  }
  // 4. Passage à la page de commande
  if (f >= C.navCommande && f < C.navCommande + 20) {
    const p = tween(f, C.navCommande, C.navCommande + 18, 0, 1, EASE.inOut);
    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${-p * W * 0.35}px)`, opacity: 1 - p * 0.6 }}>
          <Creations f={f}>
            <BottomSheet name="t-panier-2.png" contentHeight={P.panier.height2} top={DRAWER2_TOP} open={1 - p} />
          </Creations>
        </div>
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - p) * W}px)`, boxShadow: "-20px 0 40px rgba(0,0,0,0.3)" }}>
          <Commande f={f} />
        </div>
      </AbsoluteFill>
    );
  }
  if (f >= C.navCommande) {
    return (
      <AbsoluteFill>
        <Commande f={f} />
        <Ring box={MARKS.name} frame={f} from={C.typeName - 6} to={C.typeName + 30} radius={10} pad={3} />
        <Touch {...center(MARKS.name)} frame={f} at={C.typeName - 4} />
        <Ring box={MARKS.date} frame={f} from={C.tapDate - 4} to={C.dateShown + 14} radius={10} pad={3} />
        <Touch {...center(MARKS.date)} frame={f} at={C.tapDate} />
        <Ring box={MARKS.livraison} frame={f} from={C.tapLivraison - 4} to={C.tapLivraison + 18} radius={14} pad={3} />
        <Touch {...center(MARKS.livraison)} frame={f} at={C.tapLivraison} />
        <Ring box={MARKS.place} frame={f} from={C.typePlace - 2} to={C.typePlace + 28} radius={10} pad={3} />
        <Ring box={MARKS.submit} frame={f} from={C.tapSend - 22} to={C.tapSend + 6} radius={26} pad={4} />
        <Touch {...center(MARKS.submit)} frame={f} at={C.tapSend} />
      </AbsoluteFill>
    );
  }
  // Nos créations (défilement, ajouts)
  return (
    <Creations f={f}>
      {P.creations.chips.slice(0, 7).map((c, i) => (
        <Ring
          key={c.label}
          box={{ ...c, y: c.y - creationsScroll(f) }}
          frame={f}
          from={C.chips + i * 7}
          to={C.chips + i * 7 + 26}
          radius={20}
          pad={2}
        />
      ))}
      <Ring box={MARKS.card} frame={f} from={C.onCard + 4} to={C.tapCard + 2} radius={12} pad={3} />
      <Touch x={W / 2 - 110} y={MARKS.card.y + 120} frame={f} at={C.tapCard} />
      <Ring box={MARKS.burgerAdd} frame={f} from={C.tapBurger - 22} to={C.tapBurger + 26} radius={22} pad={3} />
      <Touch {...center(MARKS.burgerAdd)} frame={f} at={C.tapBurger} />
      <Ring box={MARKS.float} frame={f} from={C.float1 + 2} to={C.float1 + 34} radius={40} pad={-6} />
      <Ring box={MARKS.float} frame={f} from={C.burgerAdded + 4} to={C.burgerAdded + 34} radius={40} pad={-6} />
      <Ring box={MARKS.float} frame={f} from={C.tapFloat - 18} to={C.tapFloat + 4} radius={40} pad={-6} />
      <Touch {...center(MARKS.float)} frame={f} at={C.tapFloat} />
    </Creations>
  );
};
