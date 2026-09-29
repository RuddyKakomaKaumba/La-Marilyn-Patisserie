"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LOGO, WHATSAPP_URL } from "@/lib/site";

const NAV = [
  { href: "/nos-creations", label: "Nos créations" },
  { href: "/#savoir-faire", label: "Savoir-faire" },
  { href: "/#occasions", label: "Occasions" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:h-[88px] lg:px-12">
        <Link href="/" aria-label="La Marilyn — accueil" className="block shrink-0">
          <Image
            src={LOGO.src}
            width={LOGO.width}
            height={LOGO.height}
            alt="La Marilyn"
            priority
            sizes="64px"
            className="h-[54px] w-auto lg:h-[60px]"
          />
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="font-sans text-[0.8125rem] tracking-[0.04em] text-ivory/80 transition-colors duration-300 hover:text-gold-light aria-[current=page]:text-gold-light"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center rounded-full border border-gold/60 px-5 font-sans text-[0.8125rem] text-ivory transition-colors duration-300 hover:border-gold-light hover:bg-gold/10"
              >
                Nous contacter
              </a>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="relative -mr-2 flex h-11 w-11 items-center justify-center text-ivory/90 lg:hidden"
        >
          <span className="relative block h-3 w-[22px]">
            <span
              className={`absolute left-0 h-px w-full bg-current transition-transform duration-300 ease-soft ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-px w-full bg-current transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-full bg-current transition-transform duration-300 ease-soft ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className="border-t border-gold/15 bg-ink/95 px-5 pb-8 pt-4 backdrop-blur-sm lg:hidden"
      >
        <ul className="flex flex-col">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === item.href ? "page" : undefined}
                className="display block py-3 text-[1.625rem] text-ivory aria-[current=page]:text-gold-light"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="display block py-3 text-[1.625rem] text-gold-light"
            >
              Nous contacter
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
