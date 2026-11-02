/**
 * Thème saisonnier « Noël & Nouvel An 2026 » — interrupteur unique.
 *
 * Activé par défaut sur cette branche. Pour revenir au site habituel :
 * - définir la variable d'environnement NEXT_PUBLIC_SEASONAL_THEME=off
 *   (par exemple dans Vercel), puis redéployer ;
 * - ou passer DEFAULT_THEME à null ci-dessous.
 *
 * Désactivé, aucun composant festif n'est rendu et l'attribut
 * `data-season` disparaît de <html> : les styles de app/seasonal.css,
 * tous préfixés par ce sélecteur, ne s'appliquent plus.
 *
 * Aucun tarif, réduction, disponibilité ni création de Noël n'est annoncé
 * ici : les textes restent généraux tant que la cliente n'a rien confirmé.
 */
const DEFAULT_THEME: "fetes-2026" | null = "fetes-2026";

const env = process.env.NEXT_PUBLIC_SEASONAL_THEME;

export const SEASONAL_THEME =
  env === "off" ? null : env === "fetes-2026" ? env : DEFAULT_THEME;

export const FESTIVE = SEASONAL_THEME === "fetes-2026";

/** Valeur de l'attribut `data-season` posé sur <html>. */
export const SEASON_ATTR = FESTIVE ? "fetes" : undefined;
