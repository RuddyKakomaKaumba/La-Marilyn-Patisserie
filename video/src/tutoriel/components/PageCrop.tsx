import React from "react";
import { Img } from "remotion";
import pages from "../data/pages.json";
import { cap } from "./Screen";

type PageName = Exclude<keyof typeof pages, "heroInHome">;

/** Morceau d'une page du site (ex. une carte produit), à l'échelle voulue. */
export const PageCrop: React.FC<{
  page: PageName;
  box: { x: number; y: number; w: number; h: number };
  scale: number;
  /** Capture posée par-dessus, au même endroit (ex. état « ajouté »). */
  overlay?: string;
}> = ({ page, box, scale, overlay }) => {
  const info = pages[page];
  const first = Math.max(0, Math.floor(box.y / info.tile));
  const last = Math.min(info.count - 1, Math.floor((box.y + box.h) / info.tile));
  const tiles = [];
  for (let i = first; i <= last; i++) {
    tiles.push(
      <Img
        key={i}
        src={cap(`tuiles/${page}-${String(i).padStart(2, "0")}.jpg`)}
        style={{ position: "absolute", left: -box.x, top: i * info.tile - box.y, width: info.width }}
      />,
    );
  }
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: box.w, height: box.h, transform: `scale(${scale})`, transformOrigin: "0 0", overflow: "hidden" }}>
      {tiles}
      {overlay && <Img src={cap(overlay)} style={{ position: "absolute", left: 0, top: 0, width: box.w }} />}
    </div>
  );
};
