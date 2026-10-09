import { ORDER_STEPS, PAYMENT, REQUEST_IS_NOT_BOOKING } from "@/lib/commerce";

/** Comment commander : les quatre étapes, du message à la remise. */
export default function HowToOrder() {
  return (
    <section
      id="conditions"
      aria-labelledby="conditions-title"
      className="scroll-mt-4 bg-ivory px-4 py-12 sm:px-8 md:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <div data-reveal className="max-w-[36rem]">
          <p className="eyebrow text-gold-deep">Commander</p>
          <h2
            id="conditions-title"
            className="display mt-4 text-[1.75rem] text-ink md:text-[2.5rem]"
          >
            Comment se passe
            <br />
            une commande&nbsp;?
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
            {REQUEST_IS_NOT_BOOKING}
          </p>
        </div>

        <ol className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-4 lg:gap-5">
          {ORDER_STEPS.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
              className="rounded-[10px] border border-sand bg-cream/60 p-4 md:p-5"
            >
              <span
                aria-hidden="true"
                className="display block text-[1.75rem] text-gold-deep"
              >
                {i + 1}
              </span>
              <h3 className="mt-2 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-ink">
                {step.title}
              </h3>
              <p className="mt-1.5 text-[0.875rem] leading-relaxed text-muted">
                {step.text}
              </p>
            </li>
          ))}
        </ol>

        <p
          data-reveal
          className="mt-6 max-w-[44rem] text-[0.8125rem] leading-relaxed text-muted"
        >
          {PAYMENT.summary} {PAYMENT.means}
        </p>
      </div>
    </section>
  );
}
