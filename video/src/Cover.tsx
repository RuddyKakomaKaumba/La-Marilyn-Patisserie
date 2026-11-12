import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import "./fonts";
import { GoldDust, Vignette } from "./components/Atmosphere";
import { Photo } from "./components/Photo";
import { QrCode } from "./components/QrCode";
import { SANS, SERIF } from "./fonts";
import { COLORS } from "./theme";

/**
 * Couverture pour Instagram Reels (1080 × 1920). Les éléments importants
 * tiennent dans le carré central, seul visible dans la grille du profil.
 */
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
    <Photo photo="hero" zoom={1.02} focus="54% 60%" panY={7} style={{ inset: 0 }} />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to bottom, rgba(18,12,9,0.94) 0%, rgba(18,12,9,0.9) 34%, rgba(18,12,9,0.45) 47%, rgba(18,12,9,0) 60%, rgba(18,12,9,0) 66%, rgba(18,12,9,0.9) 84%, rgba(18,12,9,0.96) 100%)",
      }}
    />
    <Vignette strength={0.45} />
    <GoldDust count={26} seed="couverture" opacity={0.8} />
    <div style={{ position: "absolute", left: 0, top: 330, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Img src={staticFile("brand/logo-la-marilyn.png")} style={{ width: 190, height: 184 }} />
      <div
        style={{
          marginTop: 30,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 30,
          letterSpacing: "0.3em",
          marginRight: "-0.3em",
          color: COLORS.goldLight,
        }}
      >
        LA MARILYN · L’ART DU GÂTEAU
      </div>
      <div
        style={{
          marginTop: 34,
          fontFamily: SERIF,
          fontWeight: 300,
          fontSize: 112,
          lineHeight: 1.02,
          letterSpacing: "-0.02em",
          color: COLORS.ivory,
          textAlign: "center",
        }}
      >
        Notre nouveau site
        <br />
        <span style={{ fontStyle: "italic", color: COLORS.goldLight }}>est en ligne.</span>
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 1395,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
      }}
    >
      <QrCode size={250} />
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 26, letterSpacing: "0.2em", marginRight: "-0.2em", color: COLORS.goldLight }}>
        SCANNEZ POUR COMMANDER
      </div>
    </div>
  </AbsoluteFill>
);
