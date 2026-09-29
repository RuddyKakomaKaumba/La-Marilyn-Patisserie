import { ctaUrl, WHATSAPP_CTAS, type WhatsAppCta } from "@/lib/site";
import { ArrowRight } from "../icons";

export type ContactService = {
  label: string;
  /** Demande WhatsApp correspondante (intitulé + message prérempli). */
  cta: WhatsAppCta;
};

export default function ContactServiceCard({
  service,
}: {
  service: ContactService;
}) {
  const { label } = WHATSAPP_CTAS[service.cta];
  return (
    <a
      href={ctaUrl(service.cta)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${service.label} — ${label} sur WhatsApp`}
      className="group flex h-full min-h-[7rem] flex-col justify-between rounded-[10px] bg-ivory p-4 transition-colors duration-300 hover:bg-[#fffdf9] md:min-h-[8.5rem] md:p-5"
    >
      <span className="font-sans text-[0.75rem] font-semibold uppercase leading-[1.45] tracking-[0.1em] text-ink md:text-[0.8125rem]">
        {service.label}
      </span>
      <span className="mt-4 flex items-center justify-between gap-2 text-[0.75rem] text-muted transition-colors duration-300 group-hover:text-gold-deep">
        {label}
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-gold-deep transition-transform duration-300 ease-soft group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}
