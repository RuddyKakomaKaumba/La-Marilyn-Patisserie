import React from "react";
import { Img, staticFile } from "remotion";
import pages from "../data/pages.json";
import { COLORS } from "../../theme";
import { SCREEN } from "./Phone";

export const cap = (name: string) => staticFile(`tutoriel/captures/${name}`);

type PageName = Exclude<keyof typeof pages, "heroInHome">;

/**
 * Page entière du site (capture découpée en tuiles), affichée à une
 * position de défilement donnée. Seules les tuiles visibles sont montées.
 */
export const TiledPage: React.FC<{ page: PageName; scroll: number; opacity?: number; children?: React.ReactNode }> = ({
  page,
  scroll,
  opacity = 1,
  children,
}) => {
  const info = pages[page];
  const y = Math.min(Math.max(scroll, 0), info.height - SCREEN.height);
  const first = Math.max(0, Math.floor(y / info.tile) - 1);
  const last = Math.min(info.count - 1, Math.floor((y + SCREEN.height) / info.tile) + 1);
  const tiles = [];
  for (let i = first; i <= last; i++) {
    tiles.push(
      <Img
        key={i}
        src={cap(`tuiles/${page}-${String(i).padStart(2, "0")}.jpg`)}
        style={{ position: "absolute", left: 0, top: i * info.tile, width: info.width, display: "block" }}
      />,
    );
  }
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity }}>
      {/* Repère de la page : les enfants se posent en coordonnées de page. */}
      <div style={{ position: "absolute", left: 0, top: -y, width: info.width, height: info.height }}>
        {tiles}
        {children}
      </div>
    </div>
  );
};

/** Capture posée à des coordonnées précises (pixels CSS). */
export const Shot: React.FC<{
  name: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ name, x = 0, y = 0, w = SCREEN.width, h, opacity = 1, style }) => (
  <Img
    src={cap(name)}
    style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity, display: "block", ...style }}
  />
);

/**
 * Fenêtre du bas (fiche produit ou panier), telle que le site l'affiche :
 * voile sombre, fenêtre qui monte, défilement interne.
 */
export const BottomSheet: React.FC<{
  name: string;
  /** Hauteur totale du contenu (pixels CSS). */
  contentHeight: number;
  /** Haut de la fenêtre une fois ouverte (pixels CSS dans l'écran). */
  top: number;
  /** 0 : fermée, 1 : ouverte. */
  open: number;
  scroll?: number;
  /** Seconde capture, en fondu (même fenêtre, autre état). */
  next?: { name: string; contentHeight: number; top?: number; mix: number };
}> = ({ name, contentHeight, top, open, scroll = 0, next }) => {
  if (open <= 0) return null;
  const nextTop = next?.top ?? top;
  const t = next ? top + (nextTop - top) * next.mix : top;
  const height = SCREEN.height - t;
  const y = t + (1 - open) * (height + 40);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, backgroundColor: COLORS.ink, opacity: 0.6 * open }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: y,
          width: SCREEN.width,
          height,
          overflow: "hidden",
          borderRadius: "16px 16px 0 0",
          boxShadow: "0 -10px 40px rgba(18,12,9,0.35)",
        }}
      >
        <Img src={cap(name)} style={{ position: "absolute", left: 0, top: -scroll, width: SCREEN.width }} />
        {next && next.mix > 0 && (
          <Img src={cap(next.name)} style={{ position: "absolute", left: 0, top: -scroll, width: SCREEN.width, opacity: next.mix }} />
        )}
      </div>
    </>
  );
};
