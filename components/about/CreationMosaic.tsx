"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type MosaicItem = {
  src: string;
  alt: string;
  position?: string;
  /** Lien de la photo (publication Instagram). Sans lien : image seule. */
  href?: string;
  /** Image distante non optimisable par next/image. */
  unoptimized?: boolean;
};

/** Emplacements de la mosaïque (voir `.creation-gallery__grid`). */
const SLOTS = [
  { area: "a", tone: "#c99a67", wide: true },
  { area: "b", tone: "#3d2a1f", wide: false },
  { area: "c", tone: "#e6d7c2", wide: false },
  { area: "d", tone: "#8a5f43", wide: false },
  { area: "f", tone: "#efe5d7", wide: false },
  { area: "e", tone: "#dcc6a8", wide: true },
] as const;

const FADE_MS = 900;
const MIN_DELAY = 5000;
const MAX_DELAY = 7000;
/** Délai de reprise après un toucher sur la galerie (mobile). */
const TOUCH_RESUME_MS = 2500;

type Slot = {
  /** Image affichée (-1 : emplacement encore vide). */
  cur: number;
  /** Image sortante, le temps du fondu. */
  prev: number | null;
  /** Image préchargée, invisible, pour le prochain changement. */
  next: number | null;
  /** Compteur de changements, sert de clé d'animation. */
  gen: number;
};

type Change = { slot: number; item: number };

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

export default function CreationMosaic({ items }: { items: MosaicItem[] }) {
  const [slots, setSlots] = useState<Slot[]>(() =>
    SLOTS.map((_, i) => ({
      cur: i < items.length ? i : -1,
      prev: null,
      next: null,
      gen: 0,
    })),
  );
  /**
   * État de référence, mis à jour immédiatement (sans attendre le rendu) :
   * la rotation s'appuie toujours sur l'état réellement affiché.
   */
  const slotsRef = useRef(slots);
  const commit = useCallback((next: Slot[]) => {
    slotsRef.current = next;
    setSlots(next);
  }, []);

  const rootRef = useRef<HTMLUListElement>(null);
  const hovered = useRef(new Set<number>());
  const pausedUntil = useRef(0);
  const plan = useRef<Change[] | null>(null);
  /** Dernier moment où chaque image a quitté la mosaïque. */
  const lastHidden = useRef(new Map<number, number>());
  /** Dernier changement de chaque emplacement. */
  const slotChangedAt = useRef(SLOTS.map(() => 0));

  /** Prépare le prochain changement : 1 ou 2 emplacements, jamais tous. */
  const makePlan = useCallback((): Change[] | null => {
    const current = slotsRef.current;
    const visible = new Set(current.map((s) => s.cur).filter((c) => c >= 0));
    const eligible = current
      .map((_, i) => i)
      .filter((i) => !hovered.current.has(i));
    if (eligible.length < 1) return null;

    // Réserve : images non affichées, les moins récemment vues d'abord.
    const reserve = items
      .map((_, i) => i)
      .filter((i) => !visible.has(i))
      .sort(
        (x, y) =>
          (lastHidden.current.get(x) ?? -1) - (lastHidden.current.get(y) ?? -1),
      );

    // Emplacement cible : parmi les moins récemment modifiés.
    const byAge = [...eligible].sort(
      (x, y) => slotChangedAt.current[x] - slotChangedAt.current[y],
    );
    const target = pick(
      byAge.slice(0, Math.max(2, Math.ceil(byAge.length / 2))),
    );
    const others = eligible.filter((i) => i !== target && current[i].cur >= 0);

    if (reserve.length > 0) {
      // Une photo déjà visible change de place, une nouvelle prend la sienne.
      if (others.length > 0 && Math.random() < 0.45) {
        const source = pick(others);
        return [
          { slot: target, item: current[source].cur },
          { slot: source, item: reserve[0] },
        ];
      }
      const changes: Change[] = [{ slot: target, item: reserve[0] }];
      const second = eligible.filter((i) => i !== target);
      if (reserve.length > 1 && second.length > 0 && Math.random() < 0.3) {
        changes.push({ slot: pick(second), item: reserve[1] });
      }
      return changes;
    }

    // Pas de réserve : deux photos échangent leur place.
    if (others.length === 0) return null;
    const other = pick(others);
    return [
      { slot: target, item: current[other].cur },
      { slot: other, item: current[target].cur },
    ];
  }, [items]);

  /** Précharge les images du prochain changement dans leur emplacement. */
  const preload = useCallback(
    (changes: Change[] | null) => {
      plan.current = changes;
      commit(
        slotsRef.current.map((s, i) => {
          const c = changes?.find((x) => x.slot === i);
          return {
            ...s,
            next: c && c.item >= 0 && c.item !== s.cur ? c.item : null,
          };
        }),
      );
    },
    [commit],
  );

  /** Résultat d'un changement, ou null s'il créerait un doublon. */
  const resolve = (changes: Change[]) => {
    const current = slotsRef.current;
    const cur = current.map((s, i) => {
      const c = changes.find((x) => x.slot === i);
      return c ? c.item : s.cur;
    });
    const shown = cur.filter((c) => c >= 0);
    return new Set(shown).size === shown.length ? cur : null;
  };

  const apply = useCallback(() => {
    let changes = plan.current;
    plan.current = null;
    if (
      !changes ||
      changes.some((c) => hovered.current.has(c.slot)) ||
      !resolve(changes)
    ) {
      changes = makePlan();
    }
    if (!changes || !resolve(changes)) return;
    const now = Date.now();
    commit(
      slotsRef.current.map((s, i) => {
        const c = changes.find((x) => x.slot === i);
        if (!c || c.item === s.cur) return { ...s, next: null };
        if (s.cur >= 0 && !changes.some((x) => x.item === s.cur)) {
          lastHidden.current.set(s.cur, now);
        }
        slotChangedAt.current[i] = now;
        return {
          cur: c.item,
          prev: s.cur >= 0 ? s.cur : null,
          next: null,
          gen: s.gen + 1,
        };
      }),
    );
    window.setTimeout(() => {
      commit(
        slotsRef.current.map((s) =>
          s.prev === null ? s : { ...s, prev: null },
        ),
      );
      preload(makePlan());
    }, FADE_MS + 50);
  }, [makePlan, preload, commit]);

  useEffect(() => {
    if (items.length < 2) return;
    const root = rootRef.current;
    let inView = false;
    const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting), {
      rootMargin: "100px 0px",
    });
    if (root) io.observe(root);

    let timer = 0;
    const schedule = (delay: number) => {
      timer = window.setTimeout(tick, delay);
    };
    const tick = () => {
      if (!inView || document.hidden || Date.now() < pausedUntil.current) {
        schedule(1000);
        return;
      }
      apply();
      schedule(MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY));
    };

    preload(makePlan());
    schedule(MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY));
    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, [items.length, apply, makePlan, preload]);

  // Mobile : pas de changement pendant qu'on touche la galerie.
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") pausedUntil.current = Infinity;
  };
  const onPointerRelease = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse")
      pausedUntil.current = Date.now() + TOUCH_RESUME_MS;
  };

  return (
    <ul
      ref={rootRef}
      className="creation-gallery__grid"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerRelease}
      onPointerCancel={onPointerRelease}
    >
      {SLOTS.map((slot, i) => {
        const s = slots[i];
        const sizes = slot.wide
          ? "(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 100vw"
          : "(min-width: 1280px) 320px, (min-width: 1024px) 25vw, 50vw";
        return (
          <li
            key={slot.area}
            data-reveal="image"
            style={
              {
                gridArea: slot.area,
                backgroundColor: slot.tone,
                "--reveal-delay": `${i * 60}ms`,
              } as React.CSSProperties
            }
            className="group relative overflow-hidden rounded-[10px]"
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") hovered.current.add(i);
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") hovered.current.delete(i);
            }}
          >
            <div className="absolute inset-0 transition-transform duration-[700ms] ease-soft group-hover:scale-[1.02]">
              {s.prev !== null && (
                <Layer
                  key={`out-${s.gen}`}
                  item={items[s.prev]}
                  sizes={sizes}
                  className="mosaic-out"
                  hidden
                />
              )}
              {s.cur >= 0 && (
                <Layer
                  key={`in-${s.gen}-${s.cur}`}
                  item={items[s.cur]}
                  sizes={sizes}
                  className={s.gen > 0 ? "mosaic-in" : ""}
                  drift={(s.cur + i) % 2 === 0 ? "in" : "out"}
                  eager={s.gen > 0}
                />
              )}
              {s.next !== null && (
                <Layer
                  key={`next-${s.next}`}
                  item={items[s.next]}
                  sizes={sizes}
                  className="opacity-0"
                  hidden
                  eager
                />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Layer({
  item,
  sizes,
  className,
  drift,
  eager,
  hidden,
}: {
  item: MosaicItem;
  sizes: string;
  className: string;
  drift?: "in" | "out";
  /** Chargement immédiat (image préchargée ou déjà en place). */
  eager?: boolean;
  hidden?: boolean;
}) {
  const img = (
    <div
      className={`absolute inset-0 ${drift ? (drift === "in" ? "mosaic-drift-in" : "mosaic-drift-out") : ""}`}
    >
      <Image
        src={item.src}
        alt={hidden ? "" : item.alt}
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        unoptimized={item.unoptimized}
        draggable={false}
        className="object-cover"
        style={{ objectPosition: item.position ?? "50% 50%" }}
      />
    </div>
  );
  return (
    <div
      aria-hidden={hidden || undefined}
      className={`mosaic-layer absolute inset-0 ${className}`}
    >
      {item.href && !hidden ? (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${item.alt} — voir la publication sur Instagram`}
          className="absolute inset-0 block"
        >
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  );
}
