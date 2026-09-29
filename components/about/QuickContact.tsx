import ContactServiceCard, { type ContactService } from "./ContactServiceCard";

const SERVICES: ContactService[] = [
  { label: "Gâteau sur mesure", cta: "surMesure" },
  { label: "Mignardises", cta: "mignardises" },
  { label: "Buffet / événement", cta: "buffet" },
  { label: "Location de présentoirs", cta: "presentoirs" },
];

export default function QuickContact() {
  return (
    <section
      aria-labelledby="demande-title"
      className="bg-cream px-4 py-14 sm:px-8 md:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <div data-reveal className="px-2 text-center">
          <p className="eyebrow text-gold-deep">En un message</p>
          <h2
            id="demande-title"
            className="display mt-4 text-[1.75rem] text-ink md:text-[2.25rem]"
          >
            Quelle est votre envie&nbsp;?
          </h2>
        </div>
        <ul className="mt-7 grid grid-cols-2 gap-2.5 md:mt-10 md:gap-4 lg:grid-cols-4 lg:gap-5">
          {SERVICES.map((s, i) => (
            <li
              key={s.label}
              data-reveal
              style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
            >
              <ContactServiceCard service={s} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
