import { Easing, interpolate } from "remotion";

export const EASE = {
  /** Courbe du site (--ease-soft). */
  soft: Easing.bezier(0.22, 0.61, 0.36, 1),
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.55, 0, 0.9, 0.4),
  glide: Easing.bezier(0.3, 0.1, 0.2, 1),
  linear: (t: number) => t,
};

/** Interpolation bornée entre deux images. */
export const tween = (
  frame: number,
  from: number,
  to: number,
  a: number,
  b: number,
  easing: (t: number) => number = EASE.soft,
) =>
  interpolate(frame, [from, to], [a, b], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Enchaîne plusieurs paliers : keys([0, 30, 60], [0, 1, 0]). */
export const keys = (
  frame: number,
  frames: number[],
  values: number[],
  easing: (t: number) => number = EASE.inOut,
) =>
  interpolate(frame, frames, values, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Apparition puis disparition (opacité). */
export const fadeInOut = (frame: number, start: number, end: number, fade = 10) =>
  Math.min(tween(frame, start, start + fade, 0, 1), tween(frame, end - fade, end, 1, 0));
