const base =
  "group inline-flex items-center justify-center gap-3 rounded-full font-sans text-[0.8125rem] font-medium tracking-[0.01em] transition-colors duration-300 ease-soft";

/** CTA principal : champagne plein, texte encre. */
export const btnGold = `${base} h-12 px-7 bg-gold text-ink hover:bg-gold-light`;

/** CTA secondaire sur fond sombre : contour champagne. */
export const btnOutlineLight = `${base} h-12 px-7 border border-gold/70 text-ivory hover:border-gold-light hover:bg-gold/10`;

export const btnArrow =
  "h-4 w-4 transition-transform duration-300 ease-soft group-hover:translate-x-0.5";

/** CTA secondaire sur fond clair : contour champagne, texte encre. */
export const btnOutlineDark = `${base} h-12 px-7 border border-gold/70 text-ink hover:border-gold-deep hover:bg-gold/10`;
