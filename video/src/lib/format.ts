import { useVideoConfig } from "remotion";

/**
 * Format de la composition. Le film existe en vertical (1080 × 1920) et en
 * horizontal (1920 × 1080) : chaque séquence choisit sa mise en page avec
 * `pick(vertical, horizontal)`.
 */
export function useFormat() {
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  function pick<T>(v: T, h: T): T {
    return vertical ? v : h;
  }
  return { W: width, H: height, vertical, pick };
}

/**
 * Zone sûre du format vertical : hors des interfaces d'Instagram Reels et
 * de TikTok (bandeau du haut, légende et boutons en bas et à droite).
 */
export const SAFE = { top: 250, bottom: 1500, left: 70, right: 1010 };
