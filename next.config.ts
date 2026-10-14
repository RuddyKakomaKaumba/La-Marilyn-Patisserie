import type { NextConfig } from "next";

/**
 * En-têtes de sécurité sans effet sur le fonctionnement du site (aucun
 * script ni ressource tierce n'est bloqué). HSTS reste à activer chez
 * l'hébergeur, une fois le HTTPS du domaine définitif vérifié.
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

/**
 * Content-Security-Policy en mode « Report-Only » : rien n'est bloqué, les
 * écarts sont seulement signalés dans la console du navigateur. À passer en
 * mode bloquant (en-tête Content-Security-Policy) après vérification sur
 * l'hébergement de production. 'unsafe-inline' reste nécessaire pour les
 * scripts d'amorçage de Next.js tant qu'aucun nonce n'est utilisé.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

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
    // Le mode développement de Next.js utilise eval et des WebSockets :
    // la politique n'est évaluée qu'en production.
    const csp =
      process.env.NODE_ENV === "production"
        ? [
            {
              key: "Content-Security-Policy-Report-Only",
              value: contentSecurityPolicy,
            },
          ]
        : [];
    return [{ source: "/:path*", headers: [...securityHeaders, ...csp] }];
  },
};

export default nextConfig;
