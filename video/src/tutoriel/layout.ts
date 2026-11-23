/**
 * Mise en page du format vertical (1080 × 1920).
 *
 * Zones (zone sûre Reels / TikTok : ni en haut sous la barre d'état, ni en
 * bas sous la légende et les boutons) :
 * - titre d'étape : 250 → 470 ;
 * - écran du site : autour de ANCHOR (point de la caméra) ;
 * - sous-titres : bande centrée sur CAPTION_Y, au-dessus de 1500.
 *
 * Pour une déclinaison horizontale, ajouter un second jeu de valeurs ici :
 * les séquences ne lisent que ces constantes.
 */
export const LAYOUT = {
  width: 1080,
  height: 1920,
  anchor: { x: 540, y: 880 },
  title: { top: 252, left: 72, width: 936 },
  captionY: 1396,
  captionWidth: 900,
  safeBottom: 1500,
} as const;
