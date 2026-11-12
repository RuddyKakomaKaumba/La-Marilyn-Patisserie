import React from "react";
import qr from "../data/qr.json";
import { COLORS } from "../theme";

/**
 * QR code vers le site (généré par segno, niveau de correction Q).
 * Modules sombres sur fond clair, marge blanche réglementaire : il reste
 * lisible par tous les lecteurs. `reveal` (0 → 1) le fait apparaître module
 * par module, depuis le centre.
 */
export const QrCode: React.FC<{ size: number; reveal?: number; style?: React.CSSProperties }> = ({
  size,
  reveal = 1,
  style,
}) => {
  const n = qr.size;
  const quiet = 3;
  const cell = size / (n + quiet * 2);
  const mid = (n - 1) / 2;
  const maxDist = Math.hypot(mid, mid);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.07,
        backgroundColor: COLORS.ivory,
        position: "relative",
        boxShadow: "0 0 0 2px rgba(226,199,150,0.9), 0 0 70px rgba(226,180,110,0.35), 0 26px 60px rgba(0,0,0,0.45)",
        ...style,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", inset: 0 }}>
        {qr.rows.map((row, y) =>
          row.split("").map((bit, x) => {
            if (bit !== "1") return null;
            const d = Math.hypot(x - mid, y - mid) / maxDist;
            const local = Math.max(0, Math.min(1, (reveal * 1.6 - d) / 0.6));
            if (local <= 0) return null;
            return (
              <rect
                key={`${x}-${y}`}
                x={(x + quiet) * cell - 0.2}
                y={(y + quiet) * cell - 0.2}
                width={cell + 0.4}
                height={cell + 0.4}
                fill={COLORS.ink}
                opacity={local}
              />
            );
          }),
        )}
      </svg>
    </div>
  );
};
