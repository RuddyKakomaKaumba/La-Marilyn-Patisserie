import React from "react";
import { Img, staticFile } from "remotion";
import assets from "../data/assets.json";

export type PhotoKey = keyof typeof assets.photos;

export const photoSrc = (key: PhotoKey) => staticFile(`photos/${assets.photos[key].file}`);
export const photoBlur = (key: PhotoKey) => staticFile(`photos/${key}-flou.jpg`);
export const photoRatio = (key: PhotoKey) => assets.photos[key].width / assets.photos[key].height;

/**
 * Photographie cadrée (object-fit: cover, proportions toujours respectées),
 * avec un mouvement de caméra : zoom et léger déplacement.
 */
export const Photo: React.FC<{
  photo: PhotoKey;
  /** Zoom (1 = cadrage de base). */
  zoom?: number;
  /** Déplacement en % du cadre. */
  panX?: number;
  panY?: number;
  /** Point d'intérêt (object-position). */
  focus?: string;
  blur?: boolean;
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
}> = ({ photo, zoom = 1, panX = 0, panY = 0, focus = "50% 50%", blur, style, imgStyle }) => (
  <div style={{ position: "absolute", overflow: "hidden", ...style }}>
    <Img
      src={blur ? photoBlur(photo) : photoSrc(photo)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: focus,
        transform: `translate(${panX}%, ${panY}%) scale(${zoom})`,
        transformOrigin: focus,
        ...imgStyle,
      }}
    />
  </div>
);
