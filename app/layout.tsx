import type { Metadata, Viewport } from "next";
import { DM_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import { bakeryJsonLd, OG_IMAGE, SITE_URL } from "@/lib/seo";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  preload: false, // Évite de précharger toutes les variantes, dont l’italique.
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const title = "La Marilyn | Pâtisserie & Créations Gourmandes à Douala";
const description =
  "Pâtisserie à Douala (Cameroun) : gâteaux gourmands, Cake Design, mignardises, crêpes et buffets préparés avec soin par La Marilyn. Commande sur WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "La Marilyn",
    title,
    description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/hero-entremets-chocolat.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#120c09",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${newsreader.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          // Contenu statique (constantes du site), sérialisé côté serveur.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(bakeryJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
