"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { whatsappUrl } from "@/lib/site";
import { PlusIcon } from "./icons";

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
};

type Props = {
  products: Product[];
  /** Sens de défilement du contenu : "right" = de gauche vers la droite. */
  direction?: "left" | "right";
  /** Vitesse en pixels par seconde. */
  speed?: number;
  /** Nom accessible du carrousel. */
  label: string;
};

/** Délai avant la reprise de l'autoplay après une interaction (ms). */
const RESUME_DELAY = 2600;
/** Durée de la remise en vitesse progressive (s). */
const RAMP_UP = 1.4;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function InfiniteProductCarousel({
  products,
  direction = "left",
  speed = 26,
  label,
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLUListElement>(null);
  const [copies, setCopies] = useState(2);

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
        const active = !reduced && !hovering && !focused && t >= resumeAt;
        factor = active
          ? Math.min(1, factor + dt / RAMP_UP)
          : Math.max(0, factor - dt / 0.35);
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
      const target = e.target as HTMLElement;
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
    <div
      ref={viewportRef}
      role="region"
      aria-roledescription="carrousel"
      aria-label={label}
      className="relative cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing lg:[mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]"
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {Array.from({ length: copies }, (_, copy) => (
          <ul
            key={copy}
            ref={copy === 0 ? setRef : undefined}
            aria-hidden={copy > 0 || undefined}
            inert={copy > 0}
            className="flex shrink-0 gap-3 pr-3 md:gap-4 md:pr-4 lg:gap-5 lg:pr-5"
          >
            {products.map((p) => (
              <li
                key={p.name}
                className="w-[10.5rem] shrink-0 sm:w-[12.5rem] md:w-[13.5rem] lg:w-[15rem] xl:w-[16rem]"
              >
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[10px] bg-ivory">
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
            sizes="(min-width: 1280px) 256px, (min-width: 1024px) 240px, (min-width: 640px) 216px, 168px"
            className="object-cover"
            style={{ objectPosition: product.image.position ?? "50% 50%" }}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3.5 pt-3 md:px-4 md:pb-4 md:pt-3.5">
        <h3 className="font-sans text-[0.8125rem] font-semibold leading-snug text-ink md:text-[0.875rem]">
          {product.name}
        </h3>
        <p className="mt-1 text-[0.6875rem] leading-relaxed text-muted md:text-[0.75rem]">
          {product.description}
        </p>
        <div className="mt-auto pt-3">
          <a
            href={whatsappUrl(
              `Bonjour La Marilyn, je souhaiterais avoir plus d'informations sur : ${product.name}.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            aria-label={`Demander des informations sur « ${product.name} » via WhatsApp`}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/60 text-gold-deep transition-colors duration-300 hover:border-gold-deep hover:bg-gold/10"
          >
            <PlusIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
