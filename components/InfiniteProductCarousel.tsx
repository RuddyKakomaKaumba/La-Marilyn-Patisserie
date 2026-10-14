"use client";

import Image from "next/image";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { priceSummary } from "@/lib/pricing";
import { ctaUrl, WHATSAPP_CTAS, type WhatsAppCta } from "@/lib/site";
import type { RequestType } from "@/lib/requests";
import ProductDetails from "./creations/ProductDetails";
import { PlusIcon } from "./icons";
import Sheet, { SheetClose } from "./ui/Sheet";

export type Product = {
  name: string;
  description: string;
  /** Teinte du placeholder tant que la photo n'est pas fournie. */
  tone: string;
  /**
   * Photographie du produit. Renseigner `src` + `alt` suffit : le cadre
   * (ratio 4/5, object-fit: cover) reste identique.
   */
  image?: { src: string; alt: string; position?: string };
  /** Pastille discrète affichée en haut à gauche de la photo. */
  badge?: ProductBadge;
  /**
   * Demande WhatsApp du bouton « + » : type de CTA et, si utile, précision
   * ajoutée au message (ex. le nom du gâteau).
   */
  cta?: { key: WhatsAppCta; detail?: string };

  /* ---- Informations commerciales (toutes optionnelles) ---------------- */
  /** Tarif confirmé par La Marilyn. Sans tarif : rien sur la carte. */
  pricing?: Pricing;
  /** Description détaillée, affichée dans la fiche (paragraphes). */
  details?: string[];
  /** Composition confirmée. */
  composition?: string;
  /** Choix proposés (parfums, crèmes, garnitures…). */
  options?: string[];
  /** Quantité minimale de commande, ex. « 10 pièces ». */
  minQuantity?: string;
  /** Délai minimum, ex. « 48 h ». */
  leadTime?: string;
  /** Frais de livraison indicatifs (repris des conditions validées). */
  delivery?: string;
  /** Délai minimum en jours (utilisé par le formulaire de demande). */
  leadDays?: number;
  /** Mentions importantes (inclus / non inclus, conditions…). */
  notes?: string[];
  /** Lien complémentaire dans la fiche, ex. vers l'offre détaillée. */
  link?: { label: string; href: string };
  /** Type de demande proposé par la fiche (formulaire « Préparer ma demande »). */
  request?: RequestType;
};

/**
 * Tarifs : prix fixe, prix de départ, déclinaisons (ex. 10 / 20 pièces),
 * ou devis. `unit` précise l'unité de vente (« unité », « le set »…).
 */
export type Pricing =
  | { kind: "fixed"; amount: number; unit?: string }
  | { kind: "from"; amount: number; unit?: string }
  | { kind: "variants"; items: { label: string; amount: number }[] }
  | { kind: "quote" }
  /** Produit proposé, tarif pas encore communiqué. */
  | { kind: "confirm" };

export type ProductBadge = "best-seller" | "sur-commande";

/**
 * Micro-étiquettes posées au bord de la photo : « Best seller » collé au
 * bord gauche, « Sur commande » au bord droit (arrondi côté intérieur).
 */
const BADGES: Record<
  ProductBadge,
  { symbol: string; label: string; color: string; className: string }
> = {
  "best-seller": {
    symbol: "★",
    label: "Best seller",
    color: "#C62828",
    className: "left-0 rounded-r-[6px]",
  },
  "sur-commande": {
    symbol: "✦",
    label: "Sur commande",
    color: "#0F62D6",
    className: "right-0 rounded-l-[6px]",
  },
};

type Props = {
  products: Product[];
  /** Sens de défilement du contenu : "right" = de gauche vers la droite. */
  direction?: "left" | "right";
  /** Vitesse en pixels par seconde. */
  speed?: number;
  /** Nom accessible du carrousel. */
  label: string;
  /**
   * "compact" : cartes étroites avec bouton « + ».
   * "showcase" : cartes plus larges (≈ 1,6 carte visible sur mobile),
   * ombre très légère.
   */
  variant?: CardVariant;
  /**
   * Affiche le bouton « + » (demande WhatsApp). Par défaut : oui pour
   * "compact", non pour "showcase".
   */
  showAction?: boolean;
  /**
   * Nombre de premières images chargées en priorité (rangée visible dès
   * l'arrivée sur la page : améliore le LCP).
   */
  priorityCount?: number;
};

type CardVariant = "compact" | "showcase";

const CARD_WIDTH: Record<CardVariant, string> = {
  compact:
    "w-[10.5rem] sm:w-[12.5rem] md:w-[13.5rem] lg:w-[15rem] xl:w-[16rem]",
  showcase:
    "w-[14.5rem] sm:w-[16rem] md:w-[17rem] lg:w-[17.5rem] xl:w-[18.5rem]",
};

const CARD_SIZES: Record<CardVariant, string> = {
  compact:
    "(min-width: 1280px) 256px, (min-width: 1024px) 240px, (min-width: 640px) 216px, 168px",
  showcase:
    "(min-width: 1280px) 296px, (min-width: 1024px) 280px, (min-width: 640px) 272px, 232px",
};

/** Délai avant la reprise de l'autoplay après une interaction (ms). */
const RESUME_DELAY = 1800;
/** Durée de la remise en vitesse progressive (s). */
const RAMP_UP = 1.4;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function InfiniteProductCarousel({
  products,
  direction = "left",
  speed = 26,
  label,
  variant = "compact",
  showAction = variant === "compact",
  priorityCount = 0,
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLUListElement>(null);
  const [copies, setCopies] = useState(2);
  // Fiche produit ouverte (le carrousel reste en pause tant qu'elle l'est).
  const [selected, setSelected] = useState<Product | null>(null);
  const sheetOpen = useRef(false);
  sheetOpen.current = selected !== null;
  const titleId = useId();

  // Mesure : largeur d'un jeu de cartes et nombre de copies nécessaires
  // pour que la piste couvre toujours l'écran, sans espace vide.
  const setWidth = useRef(0);
  useIsoLayoutEffect(() => {
    const viewport = viewportRef.current;
    const set = setRef.current;
    if (!viewport || !set) return;
    const measure = () => {
      setWidth.current = set.getBoundingClientRect().width;
      if (setWidth.current > 0) {
        const needed = Math.ceil(viewport.clientWidth / setWidth.current) + 1;
        setCopies(Math.max(2, needed));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    ro.observe(set);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const sign = direction === "left" ? 1 : -1;
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedQuery.matches;

    let offset = 0; // position logique (px), bouclée par modulo
    let factor = 0; // 0..1, vitesse relative de l'autoplay
    let inertia = 0; // px/s, élan après un swipe
    let resumeAt = 0;
    let hovering = false;
    let focused = false;

    let dragging = false;
    let pointerId = -1;
    let captured = false;
    let lastX = 0;
    let lastT = 0;
    let moved = 0;
    let velocity = 0;
    let suppressClick = false;

    let raf = 0;
    let running = false;
    let prev = 0;

    const render = () => {
      const w = setWidth.current;
      if (!w) return;
      const x = ((offset % w) + w) % w;
      track.style.transform = `translate3d(${-x}px,0,0)`;
    };

    const pause = (delay = RESUME_DELAY) => {
      resumeAt = performance.now() + delay;
    };

    const tick = (t: number) => {
      const dt = Math.min((t - prev) / 1000, 0.05);
      prev = t;
      if (!dragging) {
        if (inertia !== 0) {
          offset += inertia * dt;
          inertia *= Math.pow(0.04, dt); // décroissance douce de l'élan
          if (Math.abs(inertia) < 8) inertia = 0;
        }
        const active =
          !reduced &&
          !hovering &&
          !focused &&
          !sheetOpen.current &&
          t >= resumeAt;
        factor = active
          ? Math.min(1, factor + dt / RAMP_UP)
          : Math.max(0, factor - dt / 0.6);
        // Accélération en douceur (ease-in-out) plutôt que linéaire.
        const eased = factor * factor * (3 - 2 * factor);
        offset += sign * speed * eased * dt;
      }
      render();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      prev = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // N'animer que lorsque le carrousel est visible.
    let inView = false;
    const sync = () => (inView && !document.hidden ? start() : stop());
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { rootMargin: "100px 0px" },
    );
    io.observe(viewport);
    document.addEventListener("visibilitychange", sync);

    const onReducedChange = (e: MediaQueryListEvent) => {
      reduced = e.matches;
    };
    reducedQuery.addEventListener("change", onReducedChange);

    // --- Swipe / glisser -------------------------------------------------
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      pointerId = e.pointerId;
      captured = false;
      lastX = e.clientX;
      lastT = e.timeStamp;
      moved = 0;
      velocity = 0;
      inertia = 0;
      factor = 0;
      pause();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      const dx = e.clientX - lastX;
      const dt = Math.max(e.timeStamp - lastT, 1);
      lastX = e.clientX;
      lastT = e.timeStamp;
      moved += Math.abs(dx);
      if (!captured && moved > 6) {
        captured = true;
        viewport.setPointerCapture(pointerId);
      }
      offset -= dx;
      // Vitesse lissée, en px/s, pour l'élan au relâchement.
      velocity = 0.75 * (-dx / dt) * 1000 + 0.25 * velocity;
      render();
    };
    const endDrag = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      dragging = false;
      if (captured && viewport.hasPointerCapture(pointerId)) {
        viewport.releasePointerCapture(pointerId);
      }
      // Pas d'élan si le doigt s'est arrêté avant de relâcher.
      inertia = e.timeStamp - lastT < 80 ? velocity : 0;
      suppressClick = moved > 6;
      pause();
    };
    const onClickCapture = (e: MouseEvent) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopPropagation();
        suppressClick = false;
      }
    };

    // Défilement horizontal au trackpad.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      inertia = 0;
      factor = 0;
      offset += e.deltaX;
      render();
      pause(1800);
    };

    // Survol (souris) : ralentit jusqu'à l'arrêt, sans à-coup.
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovering = true;
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        hovering = false;
        pause(500);
      }
    };

    // Clavier : un élément focalisé est ramené dans le cadre.
    const onFocusIn = (e: FocusEvent) => {
      focused = true;
      // Le navigateur peut faire défiler le cadre (overflow hidden) vers
      // l'élément focalisé : la position reste pilotée par `offset`.
      viewport.scrollLeft = 0;
      const target = e.target as HTMLElement;
      // Au clic souris ou tactile, la carte ne doit pas bouger sous le
      // pointeur : recadrage réservé à la navigation au clavier.
      if (!target.matches(":focus-visible")) return;
      const card = target.closest("li");
      if (!card) return;
      const v = viewport.getBoundingClientRect();
      const r = card.getBoundingClientRect();
      const gutter = 16;
      if (r.left < v.left + gutter) offset -= v.left + gutter - r.left;
      else if (r.right > v.right - gutter)
        offset += r.right - (v.right - gutter);
      render();
    };
    const onFocusOut = () => {
      focused = false;
      pause(1500);
    };

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("click", onClickCapture, true);
    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("pointerenter", onEnter);
    viewport.addEventListener("pointerleave", onLeave);
    viewport.addEventListener("focusin", onFocusIn);
    viewport.addEventListener("focusout", onFocusOut);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reducedQuery.removeEventListener("change", onReducedChange);
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", endDrag);
      viewport.removeEventListener("pointercancel", endDrag);
      viewport.removeEventListener("click", onClickCapture, true);
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("pointerenter", onEnter);
      viewport.removeEventListener("pointerleave", onLeave);
      viewport.removeEventListener("focusin", onFocusIn);
      viewport.removeEventListener("focusout", onFocusOut);
    };
  }, [direction, speed]);

  return (
    <>
      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carrousel"
        aria-label={`Carrousel : ${label}`}
        className={`relative cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing ${
          // Marge intérieure pour que l'ombre des cartes ne soit pas rognée.
          variant === "showcase" ? "-my-4 py-4" : ""
        } lg:[mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]`}
      >
        <div ref={trackRef} className="flex w-max will-change-transform">
          {Array.from({ length: copies }, (_, copy) => (
            <ul
              key={copy}
              ref={copy === 0 ? setRef : undefined}
              aria-hidden={copy > 0 || undefined}
              className="flex shrink-0 gap-3 pr-3 md:gap-4 md:pr-4 lg:gap-5 lg:pr-5"
            >
              {products.map((p, i) => (
                <li key={p.name} className={`shrink-0 ${CARD_WIDTH[variant]}`}>
                  <ProductCard
                    product={p}
                    variant={variant}
                    showAction={showAction}
                    onOpen={() => setSelected(p)}
                    clone={copy > 0}
                    priority={copy === 0 && i < priorityCount}
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <Sheet
        open={selected !== null}
        onClose={() => setSelected(null)}
        labelledBy={titleId}
      >
        {selected && (
          <>
            <SheetClose onClose={() => setSelected(null)} />
            <ProductDetails
              product={selected}
              titleId={titleId}
              onNavigate={() => setSelected(null)}
            />
          </>
        )}
      </Sheet>
    </>
  );
}

function ProductCard({
  product,
  variant,
  showAction,
  onOpen,
  clone,
  priority,
}: {
  product: Product;
  variant: CardVariant;
  showAction: boolean;
  onOpen: () => void;
  /**
   * Copie décorative (masquée aux lecteurs d'écran) : cliquable à la
   * souris ou au doigt, mais hors de l'ordre de tabulation.
   */
  clone: boolean;
  priority: boolean;
}) {
  // Titres des copies décoratives : pas de doublon dans le plan de la page.
  const Title = clone ? "p" : "h3";
  const tabIndex = clone ? -1 : undefined;
  const showcase = variant === "showcase";
  const price = priceSummary(product.pricing);
  return (
    <article
      className={`group/card relative flex h-full flex-col overflow-hidden rounded-[10px] bg-ivory ${
        showcase
          ? "shadow-[0_1px_2px_rgb(58_42_32/0.04),0_10px_24px_-14px_rgb(58_42_32/0.18)]"
          : ""
      }`}
    >
      <div
        className="relative aspect-[4/5] overflow-hidden"
        style={{ backgroundColor: product.tone }}
      >
        {product.image && (
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            draggable={false}
            sizes={CARD_SIZES[variant]}
            priority={priority}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[650ms] ease-soft group-hover/card:scale-[1.03]"
            style={{ objectPosition: product.image.position ?? "50% 50%" }}
          />
        )}
        {!product.image && (
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-3 text-center text-[9px] uppercase tracking-[0.16em] text-muted/60 md:text-[10px]"
          >
            Photo à venir
          </span>
        )}
        {product.badge && (
          <span
            data-badge={product.badge === "sur-commande" ? "right" : "left"}
            className={`absolute top-2 z-10 inline-flex items-center gap-[0.3em] px-[7px] py-1 font-sans text-[9px] font-semibold uppercase leading-none tracking-[0.08em] text-white md:text-[10px] ${BADGES[product.badge].className}`}
            style={{ backgroundColor: BADGES[product.badge].color }}
          >
            <span aria-hidden="true">{BADGES[product.badge].symbol}</span>
            {BADGES[product.badge].label}
          </span>
        )}
      </div>
      <div
        className={
          showcase
            ? "flex flex-1 flex-col px-4 pb-5 pt-4 md:px-5 md:pb-6"
            : "flex flex-1 flex-col px-3 pb-3.5 pt-3 md:px-4 md:pb-4 md:pt-3.5"
        }
      >
        <Title
          className={`font-sans font-semibold leading-snug text-ink ${
            showcase
              ? "text-[0.9375rem] md:text-base"
              : "text-[0.8125rem] md:text-[0.875rem]"
          }`}
        >
          {/* Toute la carte ouvre la fiche (le « + » reste au-dessus). */}
          <button
            type="button"
            onClick={onOpen}
            tabIndex={tabIndex}
            draggable={false}
            aria-haspopup="dialog"
            className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-[10px] focus-visible:after:outline focus-visible:after:outline-[1.5px] focus-visible:after:-outline-offset-2 focus-visible:after:outline-gold"
          >
            {product.name}
            <span className="sr-only"> — voir le détail</span>
          </button>
        </Title>
        <p
          className={`leading-relaxed text-muted ${
            showcase
              ? "mt-1.5 text-[0.8125rem] md:text-[0.84375rem]"
              : "mt-1 text-[0.75rem] leading-[1.5]"
          }`}
        >
          {product.description}
        </p>
        {price && (
          <p
            className={`font-sans font-semibold text-gold-deep ${
              showcase
                ? "mt-2.5 text-[0.8125rem] md:text-[0.875rem]"
                : "mt-2 text-[0.75rem] md:text-[0.8125rem]"
            }`}
          >
            {price}
          </p>
        )}
        {showAction && (
          <div
            className={`relative z-[1] mt-auto ${showcase ? "pt-4" : "pt-3"}`}
          >
            <a
              href={ctaUrl(product.cta?.key ?? "general", product.cta?.detail)}
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
              tabIndex={tabIndex}
              aria-label={`${WHATSAPP_CTAS[product.cta?.key ?? "general"].label} — ${product.name} (WhatsApp)`}
              className="group/plus flex h-7 w-7 items-center justify-center rounded-full border border-gold/60 text-gold-deep transition-colors duration-300 ease-soft hover:border-gold hover:bg-gold hover:text-ink active:bg-gold active:text-ink"
            >
              <PlusIcon className="h-3.5 w-3.5 transition-transform duration-300 ease-soft group-hover/plus:rotate-45" />
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
