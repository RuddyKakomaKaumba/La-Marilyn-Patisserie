/**
 * Typographies du site : Newsreader (titres) et DM Sans (textes).
 * Polices variables embarquées dans public/fonts (licence SIL Open Font
 * License), pour un rendu identique hors ligne.
 */
import { continueRender, delayRender, staticFile } from "remotion";

const FACES: [family: string, file: string, style: string, weight: string][] = [
  ["Newsreader", "Newsreader-latin.woff2", "normal", "200 800"],
  ["Newsreader", "Newsreader-Italic-latin.woff2", "italic", "200 800"],
  ["DM Sans", "DMSans-latin.woff2", "normal", "100 1000"],
];

if (typeof document !== "undefined") {
  const handle = delayRender("Chargement des polices");
  Promise.all(
    FACES.map(([family, file, style, weight]) => {
      const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format("woff2")`, { style, weight });
      document.fonts.add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error("Police introuvable", err);
      continueRender(handle);
    });
}

export const SERIF = `"Newsreader", "Times New Roman", serif`;
export const SANS = `"DM Sans", system-ui, sans-serif`;
