import type { Metadata } from "next";
import CheckoutForm from "@/components/cart/CheckoutForm";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const title = "Ma commande | La Marilyn";
const description =
  "Finalisez votre commande La Marilyn : récapitulatif du panier, date souhaitée et envoi en un seul message WhatsApp.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/commande" },
  robots: { index: false, follow: true },
};

export default function Commande() {
  return (
    <>
      <Header />
      <main>
        <section
          aria-labelledby="commande-titre"
          className="bg-ink px-6 pb-10 pt-[5.75rem] text-ivory sm:px-10 md:pb-14 md:pt-[8.5rem] lg:px-12"
        >
          <div className="mx-auto max-w-[1280px]">
            <p className="eyebrow text-gold-light/90">Ma commande</p>
            <span aria-hidden="true" className="mt-3 block h-px w-8 bg-gold" />
            <h1
              id="commande-titre"
              className="display mt-4 text-[2.25rem] leading-[1.02] text-ivory sm:text-[3rem] lg:text-[3.75rem]"
            >
              Encore un instant,{" "}
              <em className="font-[330] italic">et c’est envoyé.</em>
            </h1>
            <p className="mt-3 max-w-[34rem] text-[0.9375rem] leading-relaxed text-ivory/75">
              Vérifiez votre panier, indiquez la date et le mode de récupération
              : votre commande s’ouvre ensuite dans WhatsApp, en un seul
              message. La Marilyn vous confirme la disponibilité et le montant
              définitif.
            </p>
          </div>
        </section>
        <div className="bg-cream px-4 py-8 sm:px-8 md:py-14 lg:px-12 lg:py-20">
          <CheckoutForm />
        </div>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  );
}
