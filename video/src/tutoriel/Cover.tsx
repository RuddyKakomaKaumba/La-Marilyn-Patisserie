import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import "../fonts";
import { GoldDust, Glow, Vignette } from "../components/Atmosphere";
import { Photo } from "../components/Photo";
import { COLORS } from "../theme";
import { SANS, SERIF } from "../fonts";
import { Phone } from "./components/Phone";
import { screenAt } from "./screens";
import { CUE } from "./timeline";

/**
 * Couverture Instagram du tutoriel (1080 × 1920). Le titre et l'écran du
 * panier tiennent dans la zone centrale 3:4, visible dans la grille du profil.
 */
export const CouvertureTutoriel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
    <Photo photo="moelleux" blur zoom={1.3} style={{ inset: 0, opacity: 0.32 }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(18,12,9,0.15) 0%, rgba(18,12,9,0.92) 78%)" }} />
    <Glow x={540} y={1150} size={1600} opacity={0.24} />
    <GoldDust count={26} seed="couverture-tuto" opacity={0.7} />
    {/* L'écran réel du panier (deux produits, total) */}
    <Phone cam={{ s: 1.42, x: 195, y: 520, ry: -12, rx: 5, ay: 360 }}>{screenAt(CUE.total + 40)}</Phone>
    <AbsoluteFill
      style={{
        background: `linear-gradient(to bottom, ${COLORS.ink} 0%, rgba(18,12,9,0.92) 30%, rgba(18,12,9,0.4) 44%, rgba(18,12,9,0) 52%, rgba(18,12,9,0) 86%, ${COLORS.ink} 100%)`,
      }}
    />
    <Vignette strength={0.4} />
    <div style={{ position: "absolute", left: 0, top: 290, width: 1080, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Img src={staticFile("brand/logo-la-marilyn.png")} style={{ width: 140, height: 136 }} />
      <div style={{ marginTop: 26, fontFamily: SANS, fontWeight: 500, fontSize: 28, letterSpacing: "0.3em", marginRight: "-0.3em", color: COLORS.goldLight }}>
        TUTORIEL · LA MARILYN
      </div>
      <div style={{ marginTop: 26, fontFamily: SERIF, fontWeight: 300, fontSize: 104, lineHeight: 1.02, letterSpacing: "-0.02em", color: COLORS.ivory, textAlign: "center" }}>
        Votre commande,
        <br />
        <span style={{ fontStyle: "italic", color: COLORS.goldLight }}>en quelques clics.</span>
      </div>
    </div>
  </AbsoluteFill>
);
