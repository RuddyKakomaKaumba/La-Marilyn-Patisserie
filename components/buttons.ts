/**
 * Mobile : boutons compacts (44 px, texte 14 px) ; tablette et desktop : 48 px.
 * Survol : fond qui s'éclaircit et flèche qui glisse de 4 px ; toucher :
 * léger enfoncement immédiat (active).
 */
const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-full font-sans text-[0.875rem] font-medium tracking-[0.01em] transition-[color,background-color,border-color,transform] duration-300 ease-soft active:scale-[0.98] md:gap-3";

const size = "h-11 px-6 md:h-12 md:px-7";

/** CTA principal : champagne plein, texte encre. */
export const btnGold = `${base} ${size} bg-gold text-ink hover:bg-gold-light active:bg-gold-light`;

/** CTA secondaire sur fond sombre : contour champagne. */
export const btnOutlineLight = `${base} ${size} border border-gold/70 text-ivory hover:border-gold-light hover:bg-gold/10 active:bg-gold/15`;

/** Variante plus discrète (CTA secondaire du hero sur mobile). */
export const btnOutlineLightQuiet = `${base} h-10 px-5 md:h-12 md:px-7 border border-gold/55 text-ivory/90 hover:border-gold-light hover:bg-gold/10 hover:text-ivory active:bg-gold/15`;

export const btnArrow =
  "h-4 w-4 transition-transform duration-300 ease-soft group-hover:translate-x-1";

/** CTA secondaire sur fond clair : contour champagne, texte encre. */
export const btnOutlineDark = `${base} ${size} border border-gold/70 text-ink hover:border-gold-deep hover:bg-gold/10 active:bg-gold/15`;
