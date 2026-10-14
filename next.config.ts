import type { NextConfig } from "next";

/**
 * En-têtes de sécurité sans effet sur le fonctionnement du site (aucun
 * script ni ressource tierce n'est bloqué). La Content-Security-Policy et
 * HSTS restent à décider avec l'hébergeur (voir rapport d'audit).
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Interdit l'affichage du site dans un cadre tiers (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 750, 828, 1080, 1280, 1600, 1920],
    // Visuels des publications Instagram (CDN Meta).
    remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
