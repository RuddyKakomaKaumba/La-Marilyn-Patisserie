import Link from "next/link";
import { FESTIVE } from "@/lib/seasonal";
import SnowToggle from "./SnowToggle";

/**
 * Bandeau saisonnier, au-dessus du haut de page (thème des fêtes).
 * Hauteur fixe (--season-banner-h, voir app/seasonal.css) : le header,
 * positionné en absolu, est décalé d'autant.
 */
export default function SeasonalBanner() {
  if (!FESTIVE) return null;
  return (
    <aside aria-label="Édition des fêtes" className="season-banner">
      <p className="season-banner__text">
        <span aria-hidden="true" className="season-banner__star">
          ✦
        </span>
        <span className="season-banner__shine hidden sm:inline">
          Belles fêtes de fin d’année
        </span>
        <span className="season-banner__shine sm:hidden">Belles fêtes</span>
        <span aria-hidden="true" className="season-banner__dot">
          ·
        </span>
        <Link href="/nos-creations#ecrin" className="season-banner__link">
          <span className="hidden sm:inline">
            L’Écrin gourmand, une idée cadeau à composer
          </span>
          <span className="sm:hidden">Une idée cadeau à composer</span>
          <span aria-hidden="true"> →</span>
        </Link>
      </p>
      <SnowToggle />
    </aside>
  );
}
