import Image from "next/image";
import Link from "next/link";
import { LOGO } from "@/lib/site";

const FOOTER_LINKS = [
  { href: "/nos-creations#patisseries", label: "Pâtisseries" },
  { href: "#", label: "Gâteaux" },
  { href: "/nos-creations#mignardises", label: "Mignardises" },
  { href: "/nos-creations#traiteur", label: "Traiteur" },
  { href: "#", label: "Location" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-ink px-6 pb-24 pt-16 text-center text-ivory sm:px-10 md:pt-20 lg:pb-14">
      <div className="mx-auto max-w-[34rem]">
        <Link
          href="/"
          aria-label="La Marilyn — accueil"
          className="mx-auto block w-fit"
        >
          <Image
            src={LOGO.src}
            width={LOGO.width}
            height={LOGO.height}
            alt="La Marilyn"
            sizes="112px"
            className="mx-auto h-auto w-[104px] md:w-[112px]"
          />
        </Link>
        <nav aria-label="Liens de pied de page" className="mt-8">
          <ul className="mx-auto flex max-w-[17.5rem] flex-wrap justify-center gap-x-7 gap-y-3 text-[0.8125rem] text-ivory/80 sm:max-w-none">
            {FOOTER_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="transition-colors duration-300 hover:text-gold-light"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-10 text-[0.6875rem] tracking-[0.04em] text-ivory/45">
          © {new Date().getFullYear()} La Marilyn · Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
