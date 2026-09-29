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
  "Cakes, gâteaux sur mesure, mignardises et buffets gourmands : découvrez les créations de La Marilyn, pour une envie du moment comme pour recevoir vos invités.";

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
          cta="patisserie"
        />
        <CreationRow
          id="mignardises"
          title="Nos mignardises"
          products={MIGNARDISES}
          direction="left"
          speed={22}
          variant="showcase"
          cta="mignardises"
        />
        <CreationRow
          id="traiteur"
          title="Buffet gourmand"
          products={TRAITEUR}
          direction="right"
          speed={24}
          variant="showcase"
          showAction
          cta="buffet"
        />
        <EventCTA />
      </main>
      <SiteFooter />
      <WhatsAppFloat />
      <Reveal />
    </>
  );
}
