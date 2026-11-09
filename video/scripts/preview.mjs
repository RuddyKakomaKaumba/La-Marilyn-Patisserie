/**
 * Planche-contact : rend quelques images d'une composition, pour contrôler
 * le montage sans exporter toute la vidéo.
 *
 *   node scripts/preview.mjs LancementVertical 0,40,80,120 [échelle] [dossier]
 */
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const [id = "LancementVertical", list = "0", scale = "0.35", out = "out/preview"] = process.argv.slice(2);
const frames = list.split(",").map(Number);
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const browser = await openBrowser("chrome");
const composition = await selectComposition({ serveUrl, id, puppeteerInstance: browser });
for (const frame of frames) {
  const output = path.join(out, `${id}-${String(frame).padStart(4, "0")}.jpg`);
  await renderStill({ composition, serveUrl, frame, output, imageFormat: "jpeg", jpegQuality: 88, scale: Number(scale), puppeteerInstance: browser });
}
await browser.close({ silent: true });
console.log("ok", frames.length);
