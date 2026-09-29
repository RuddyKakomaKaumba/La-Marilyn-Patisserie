import type { Metadata } from "next";
import CreationRow from "@/components/creations/CreationRow";
import CreationsIntro from "@/components/creations/CreationsIntro";
import EventCTA from "@/components/creations/EventCTA";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { MIGNARDISES, PATISSERIES, TRAITEUR } from "@/lib/creations";

const title = "Nos créations | La Marilyn";
const description =
  "Pâtisseries, mignardises, traiteur et buffets : découvrez les créations gourmandes de La Marilyn pour vos envies et vos événements.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/nos-creations" },
  openGraph: { title, description, url: "/nos-creations" },
  twitter: { title, description },
};

export default function NosCreations() {
  return (
    <>
      <Header />
      <main className="bg-cream">
        <CreationsIntro />
        <CreationRow
          id="patisseries"
          title="Nos pâtisseries"
          products={PATISSERIES}
          direction="right"
          speed={24}
          cta={{ label: "Voir toutes les pâtisseries", href: "#" }}
        />
        <CreationRow
          id="mignardises"
          title="Nos mignardises"
          products={MIGNARDISES}
          direction="left"
          speed={22}
          variant="showcase"
          cta={{ label: "Découvrir toutes les mignardises", href: "#" }}
        />
        <CreationRow
          id="traiteur"
          title="Traiteur & buffets"
          products={TRAITEUR}
          direction="right"
          speed={24}
          cta={{ label: "Découvrir nos formules", href: "#" }}
        />
        <EventCTA />
      </main>
      <SiteFooter />
      <WhatsAppFloat />
      <Reveal />
    </>
  );
}
