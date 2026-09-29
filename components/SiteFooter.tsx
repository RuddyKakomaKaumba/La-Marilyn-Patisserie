import Image from "next/image";
import Link from "next/link";
import { LOGO, NAV_LINKS, SOCIAL_LINKS } from "@/lib/site";
import { FacebookIcon, InstagramIcon } from "./icons";

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
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-[0.8125rem] text-ivory/80">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
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
        <ul className="mt-8 flex justify-center gap-4">
          <li>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="La Marilyn sur Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/25 text-ivory/80 transition-colors duration-300 hover:border-gold-light hover:text-gold-light"
            >
              <InstagramIcon className="h-[18px] w-[18px]" />
            </a>
          </li>
          <li>
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="La Marilyn sur Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/25 text-ivory/80 transition-colors duration-300 hover:border-gold-light hover:text-gold-light"
            >
              <FacebookIcon className="h-[18px] w-[18px]" />
            </a>
          </li>
        </ul>
        <p className="mt-10 text-[0.6875rem] tracking-[0.04em] text-ivory/45">
          © La Marilyn — Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
