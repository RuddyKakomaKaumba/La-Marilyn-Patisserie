import React from "react";
import { Img, staticFile } from "remotion";
import assets from "../data/assets.json";
import { COLORS, SITE_URL_LABEL } from "../theme";
import { SANS } from "../fonts";

type PageName = keyof typeof assets.pages;

/**
 * Longue capture de page, affichée à la position de défilement voulue.
 * Seules les tuiles visibles sont montées. Unités : pixels CSS du site.
 */
export const PageScroll: React.FC<{
  page: PageName;
  scrollY: number;
  viewportHeight: number;
}> = ({ page, scrollY, viewportHeight }) => {
  const info = assets.pages[page];
  const max = Math.max(0, info.height - viewportHeight);
  const y = Math.min(Math.max(scrollY, 0), max);
  const first = Math.max(0, Math.floor(y / info.tile) - 1);
  const last = Math.min(info.count - 1, Math.floor((y + viewportHeight) / info.tile) + 1);
  const tiles = [];
  for (let i = first; i <= last; i++) {
    tiles.push(
      <Img
        key={i}
        src={staticFile(`captures/tuiles/${page}-${String(i).padStart(2, "0")}.jpg`)}
        style={{ position: "absolute", left: 0, top: i * info.tile - y, width: info.width, display: "block" }}
      />,
    );
  }
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: info.width, height: viewportHeight, overflow: "hidden" }}>
      {tiles}
    </div>
  );
};

export const PHONE = {
  /** Écran en pixels CSS : barre du navigateur + page. */
  width: 390,
  height: 844,
  bar: 50,
  bezel: 11,
  radius: 50,
};
export const PHONE_VIEWPORT = PHONE.height - PHONE.bar;

/**
 * Smartphone. Les enfants sont placés dans le repère de la page (390 px de
 * large), sous la barre d'adresse : on y pose directement les captures.
 * `overlay` reçoit les éléments posés par-dessus tout l'écran.
 */
export const Phone: React.FC<{
  /** Échelle : 1 = 390 px CSS de large. */
  scale: number;
  children: React.ReactNode;
  overlay?: React.ReactNode;
  /** Reflet qui glisse sur la vitre (0 → 1). */
  shine?: number;
  style?: React.CSSProperties;
  /** Opacité du boîtier (0 : seule la page est visible). */
  body?: number;
}> = ({ scale, children, overlay, shine, style, body = 1 }) => {
  const w = PHONE.width + PHONE.bezel * 2;
  const h = PHONE.height + PHONE.bezel * 2;
  return (
    <div
      style={{
        position: "absolute",
        width: w,
        height: h,
        marginLeft: -w / 2,
        marginTop: -h / 2,
        transform: `scale(${scale})`,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {/* Boîtier */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: PHONE.radius + PHONE.bezel,
          background: "linear-gradient(145deg, #4a3b2c 0%, #17100c 28%, #0a0706 62%, #3c2f22 100%)",
          boxShadow:
            "0 60px 120px rgba(0,0,0,0.55), 0 18px 40px rgba(0,0,0,0.45), inset 0 0 0 1.5px rgba(226,199,150,0.42), inset 0 0 0 4px #0a0706",
          opacity: body,
        }}
      />
      {/* Écran */}
      <div
        style={{
          position: "absolute",
          left: PHONE.bezel,
          top: PHONE.bezel,
          width: PHONE.width,
          height: PHONE.height,
          borderRadius: PHONE.radius * body,
          overflow: "hidden",
          backgroundColor: COLORS.ink,
        }}
      >
        <div style={{ position: "absolute", left: 0, top: PHONE.bar, width: PHONE.width, height: PHONE_VIEWPORT, overflow: "hidden" }}>
          {children}
        </div>
        {/* Barre d'adresse */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: PHONE.width,
            height: PHONE.bar,
            backgroundColor: "#0d0806",
            borderBottom: "1px solid rgba(202,165,108,0.18)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 7,
            opacity: body,
          }}
        >
          <div
            style={{
              height: 26,
              padding: "0 14px",
              borderRadius: 13,
              backgroundColor: "rgba(251,247,241,0.09)",
              color: "rgba(251,247,241,0.86)",
              fontFamily: SANS,
              fontSize: 12,
              letterSpacing: "0.01em",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="9" height="11" viewBox="0 0 9 11" fill="none">
              <rect x="0.5" y="4.5" width="8" height="6" rx="1.4" fill="rgba(226,199,150,0.9)" />
              <path d="M2.3 4.5V3a2.2 2.2 0 0 1 4.4 0v1.5" stroke="rgba(226,199,150,0.9)" strokeWidth="1.1" />
            </svg>
            {SITE_URL_LABEL}
          </div>
        </div>
        {overlay}
        {shine !== undefined && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(115deg, rgba(255,255,255,0) ${shine * 180 - 60}%, rgba(255,240,210,0.16) ${shine * 180 - 40}%, rgba(255,255,255,0) ${shine * 180 - 20}%)`,
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    </div>
  );
};

export const BROWSER = { width: 1440, height: 900, bar: 54, radius: 16 };

/** Fenêtre de navigateur (bureau), au repère de 1440 px de large. */
export const Browser: React.FC<{
  scale: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  /** Opacité de l'habillage (0 : seule la page est visible). */
  chrome?: number;
}> = ({ scale, children, style, chrome = 1 }) => {
  const w = BROWSER.width;
  const h = BROWSER.height + BROWSER.bar;
  return (
    <div
      style={{
        position: "absolute",
        width: w,
        height: h,
        marginLeft: -w / 2,
        marginTop: -h / 2,
        transform: `scale(${scale})`,
        borderRadius: BROWSER.radius * chrome,
        overflow: "hidden",
        boxShadow: `0 70px 140px rgba(0,0,0,${0.55 * chrome}), 0 0 0 1.5px rgba(226,199,150,${0.3 * chrome})`,
        backgroundColor: COLORS.ink,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: `0 0 auto 0`,
          height: BROWSER.bar,
          backgroundColor: "#0d0806",
          borderBottom: "1px solid rgba(202,165,108,0.2)",
          display: "flex",
          alignItems: "center",
          padding: "0 22px",
          gap: 9,
          opacity: chrome,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 13, height: 13, borderRadius: "50%", backgroundColor: "rgba(226,199,150,0.32)" }} />
        ))}
        <div
          style={{
            margin: "0 auto",
            height: 32,
            width: 560,
            borderRadius: 16,
            backgroundColor: "rgba(251,247,241,0.08)",
            color: "rgba(251,247,241,0.88)",
            fontFamily: SANS,
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {SITE_URL_LABEL}
        </div>
        <div style={{ width: 57 }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: BROWSER.bar, width: BROWSER.width, height: BROWSER.height, overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
};

/** Onde d'un toucher sur l'écran (repère de la page). */
export const Tap: React.FC<{ x: number; y: number; frame: number; at: number }> = ({ x, y, frame, at }) => {
  const t = (frame - at) / 16;
  if (t < -0.4 || t > 1.4) return null;
  const press = Math.max(0, Math.min(1, (frame - at + 6) / 6));
  const ring = Math.max(0, Math.min(1, t));
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 40,
          top: y - 40,
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: "2px solid rgba(202,165,108,0.9)",
          transform: `scale(${0.3 + ring * 0.9})`,
          opacity: (1 - ring) * (t >= 0 ? 1 : 0),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 17,
          top: y - 17,
          width: 34,
          height: 34,
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.72)",
          boxShadow: "0 0 0 1.5px rgba(134,100,47,0.55), 0 4px 14px rgba(18,12,9,0.3)",
          transform: `scale(${t < 0 ? 1.5 - press * 0.6 : 0.9 + ring * 0.25})`,
          opacity: t < 0 ? press : 1 - ring,
        }}
      />
    </>
  );
};
