import type { Metadata, Viewport } from "next";
import { DM_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const title = "La Marilyn | Pâtisserie & Créations Gourmandes";
const description =
  "Découvrez l’univers de La Marilyn : pâtisseries, gâteaux, mignardises, buffets et créations gourmandes pour vos événements.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title,
  description,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "La Marilyn",
    title,
    description,
    images: [
      {
        url: "/images/hero-entremets-chocolat.webp",
        width: 941,
        height: 1672,
        alt: "Entremets au chocolat La Marilyn orné du médaillon signature",
      },
    ],
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
      <body>{children}</body>
    </html>
  );
}
