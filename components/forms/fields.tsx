/**
 * Champs de formulaire partagés (demande de devis, configurateur d'écrin) :
 * libellé, aide et message d'erreur reliés au champ (aria-describedby).
 */

export const inputClass =
  "mt-1.5 block w-full rounded-[8px] border border-sand bg-white px-3.5 py-2.5 font-sans text-[1rem] text-ink placeholder:text-muted/60 transition-colors duration-200 focus:border-gold-deep focus:outline-none focus-visible:outline-[1.5px] focus-visible:outline-offset-1 focus-visible:outline-gold aria-[invalid=true]:border-[#b3261e] md:text-[0.9375rem]";

export const labelClass = "font-sans text-[0.8125rem] font-semibold text-ink";

export const hintId = (id: string) => `${id}-hint`;
export const errorId = (id: string) => `${id}-error`;

/** Props ARIA d'un champ selon son aide et son erreur éventuelle. */
export function aria(id: string, hint?: string, error?: string) {
  const ids = [hint && hintId(id), error && errorId(id)].filter(Boolean);
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": ids.length ? ids.join(" ") : undefined,
  } as const;
}

export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className = "",
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {optional && (
          <span className="font-normal text-muted"> (facultatif)</span>
        )}
      </label>
      {children}
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
}

export function FieldMessages({
  id,
  hint,
  error,
}: {
  id: string;
  hint?: string;
  error?: string;
}) {
  return (
    <>
      {hint && (
        <p
          id={hintId(id)}
          className="mt-1 text-[0.75rem] leading-relaxed text-muted"
        >
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId(id)}
          className="mt-1 text-[0.8125rem] font-medium text-[#b3261e]"
        >
          {error}
        </p>
      )}
    </>
  );
}

/** Résumé des erreurs, annoncé dès l'envoi d'un formulaire incomplet. */
export function ErrorSummary({ errors }: { errors: Record<string, string> }) {
  const entries = Object.entries(errors);
  if (!entries.length) return null;
  return (
    <div
      role="alert"
      className="rounded-[8px] border border-[#b3261e]/40 bg-[#b3261e]/5 px-4 py-3 text-[0.8125rem] text-[#8c1d18]"
    >
      <p className="font-semibold">
        {entries.length > 1
          ? `${entries.length} informations sont à compléter :`
          : "Une information est à compléter :"}
      </p>
      <ul className="mt-1 list-disc pl-5">
        {entries.map(([id, message]) => (
          <li key={id}>
            <a href={`#${id}`} className="underline underline-offset-2">
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Ouvre la conversation WhatsApp préparée dans un nouvel onglet. */
export function openWhatsApp(url: string) {
  // (« noopener » ferait renvoyer null à window.open : on coupe le lien à la main.)
  const win = window.open(url, "_blank");
  if (win) win.opener = null;
  else window.location.href = url;
}
