"use client";

import { useState } from "react";
import { ECRIN_TERMS } from "@/lib/commerce";
import { ECRIN_GOURMANDISES, ECRIN_OCCASIONS } from "@/lib/ecrin";
import {
  budgetText,
  buildRequestMessage,
  checkDate,
  formatDate,
  isoDate,
  REQUEST_TYPES,
} from "@/lib/requests";
import { whatsappUrl } from "@/lib/site";
import { btnArrow, btnGold } from "../buttons";
import {
  aria,
  ErrorSummary,
  Field,
  FieldMessages,
  inputClass,
  labelClass,
  openWhatsApp,
} from "../forms/fields";
import { ArrowRight, WhatsAppIcon } from "../icons";

const TYPE = REQUEST_TYPES.ecrin;

/**
 * « Composer mon écrin » : le visiteur décrit son écrin, puis la demande
 * part sur WhatsApp. Aucun calcul de prix, aucune limite inventée : les
 * quantités sont indicatives et la composition reste à valider.
 */
export default function EcrinConfigurator() {
  const [occasion, setOccasion] = useState("");
  const [occasionOther, setOccasionOther] = useState("");
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [otherTreat, setOtherTreat] = useState("");
  const [ambiance, setAmbiance] = useState("");
  const [note, setNote] = useState("");
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const clear = (id: string) =>
    setErrors((e) => {
      if (!(id in e)) return e;
      const next = { ...e };
      delete next[id];
      return next;
    });

  const toggle = (item: string, checked: boolean) => {
    clear("ecrin-gourmandises");
    setPicks((p) => {
      const next = { ...p };
      if (checked) next[item] = next[item] ?? "1";
      else delete next[item];
      return next;
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!occasion) e["ecrin-occasion"] = "Choisissez l’occasion.";
    else if (occasion === "Autre" && !occasionOther.trim())
      e["ecrin-occasion-other"] = "Précisez l’occasion.";
    if (!Object.keys(picks).length && !otherTreat.trim())
      e["ecrin-gourmandises"] =
        "Choisissez au moins une gourmandise ou décrivez votre envie.";
    for (const [item, qty] of Object.entries(picks)) {
      if (!/^\d+$/.test(qty) || Number(qty) < 1) {
        e["ecrin-gourmandises"] = `Indiquez une quantité pour « ${item} ».`;
        break;
      }
    }
    const dateError = checkDate(date, TYPE.leadDays, TYPE.leadLabel, urgent);
    if (dateError) e["ecrin-date"] = dateError;
    return e;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      setSentUrl(null);
      const el = document.getElementById(
        first === "ecrin-gourmandises" ? "ecrin-gourmandises-legend" : first,
      );
      el?.focus();
      return;
    }
    const message = buildRequestMessage(
      TYPE.subject,
      [
        ["Prénom", name],
        ["Occasion", occasion === "Autre" ? occasionOther : occasion],
        [
          "Gourmandises souhaitées",
          [
            ...Object.entries(picks).map(([item, qty]) => `${item} × ${qty}`),
            otherTreat.trim() && `Autre envie : ${otherTreat.trim()}`,
          ].filter(Boolean) as string[],
        ],
        ["Couleurs / ambiance", ambiance],
        ["Petit mot à glisser", note.trim() && `« ${note.trim()} »`],
        ["Budget indicatif", budgetText(budget)],
        ["Date souhaitée", date && formatDate(date)],
        ["Demande urgente", urgent ? "oui" : undefined],
        ["Précisions", details],
      ],
      [
        "Cette composition est une demande : elle reste soumise à la validation de La Marilyn (faisabilité, quantités, prix final et délai).",
      ],
    );
    const url = whatsappUrl(message);
    setSentUrl(url);
    openWhatsApp(url);
  };

  const minDate = isoDate(new Date());

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-labelledby="ecrin-compose-title"
      className="rounded-[14px] bg-ivory p-5 text-cocoa sm:p-7 lg:p-9"
    >
      <h3
        id="ecrin-compose-title"
        className="display text-[1.625rem] text-ink md:text-[2rem]"
      >
        Composer mon écrin
      </h3>
      <p className="mt-2 max-w-[34rem] text-[0.875rem] leading-relaxed text-muted">
        Décrivez l’écrin dont vous rêvez : votre demande s’ouvre ensuite dans
        WhatsApp, prête à être envoyée. La Marilyn revient vers vous pour
        valider la composition et vous confirmer le prix.
      </p>

      <div className="mt-6 space-y-5">
        <ErrorSummary errors={errors} />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="ecrin-occasion"
            label="Occasion"
            error={errors["ecrin-occasion"]}
          >
            <select
              {...aria("ecrin-occasion", undefined, errors["ecrin-occasion"])}
              value={occasion}
              onChange={(e) => {
                setOccasion(e.target.value);
                clear("ecrin-occasion");
              }}
              className={inputClass}
            >
              <option value="">Choisir…</option>
              {ECRIN_OCCASIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>
          {occasion === "Autre" && (
            <Field
              id="ecrin-occasion-other"
              label="Quelle occasion ?"
              error={errors["ecrin-occasion-other"]}
            >
              <input
                {...aria(
                  "ecrin-occasion-other",
                  undefined,
                  errors["ecrin-occasion-other"],
                )}
                value={occasionOther}
                onChange={(e) => {
                  setOccasionOther(e.target.value);
                  clear("ecrin-occasion-other");
                }}
                className={inputClass}
              />
            </Field>
          )}
        </div>

        <fieldset
          aria-describedby={
            errors["ecrin-gourmandises"]
              ? "ecrin-gourmandises-hint ecrin-gourmandises-error"
              : "ecrin-gourmandises-hint"
          }
        >
          <legend
            id="ecrin-gourmandises-legend"
            tabIndex={-1}
            className={`${labelClass} outline-none`}
          >
            Gourmandises
          </legend>
          <FieldMessages
            id="ecrin-gourmandises"
            hint="Cochez vos envies et indiquez une quantité. Les quantités sont indicatives : La Marilyn valide la composition avec vous."
            error={errors["ecrin-gourmandises"]}
          />
          <div className="mt-3 grid gap-5 md:grid-cols-2">
            {ECRIN_GOURMANDISES.map((g) => (
              <div key={g.group}>
                <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-gold-deep">
                  {g.group}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {g.items.map((item) => {
                    const id = `ecrin-item-${item.replace(/\W+/g, "-")}`;
                    const checked = item in picks;
                    return (
                      <li
                        key={item}
                        className="flex min-h-11 items-center justify-between gap-3"
                      >
                        <label
                          htmlFor={id}
                          className="flex cursor-pointer items-center gap-2.5 text-[0.875rem] text-ink"
                        >
                          <input
                            id={id}
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => toggle(item, e.target.checked)}
                            className="h-[18px] w-[18px] shrink-0 accent-gold-deep"
                          />
                          {item}
                        </label>
                        {checked && (
                          <input
                            type="number"
                            inputMode="numeric"
                            min={1}
                            step={1}
                            value={picks[item]}
                            aria-label={`Quantité — ${item}`}
                            onChange={(e) => {
                              clear("ecrin-gourmandises");
                              setPicks((p) => ({
                                ...p,
                                [item]: e.target.value,
                              }));
                            }}
                            className="h-10 w-[4.5rem] shrink-0 rounded-[8px] border border-sand bg-white px-2 text-center text-[1rem] text-ink focus:border-gold-deep focus:outline-none"
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <Field id="ecrin-other" label="Autre envie" optional className="mt-4">
            <input
              {...aria("ecrin-other")}
              value={otherTreat}
              onChange={(e) => {
                setOtherTreat(e.target.value);
                clear("ecrin-gourmandises");
              }}
              placeholder="Une gourmandise de la carte, une idée…"
              className={inputClass}
            />
          </Field>
        </fieldset>

        <Field
          id="ecrin-ambiance"
          label="Couleurs et ambiance"
          optional
          hint="Ex. : tons pastel, blanc et or, couleurs préférées de la personne…"
        >
          <input
            {...aria("ecrin-ambiance", "hint")}
            value={ambiance}
            onChange={(e) => setAmbiance(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field
          id="ecrin-note"
          label="Le petit mot à glisser dans l’écrin"
          optional
          hint="Il sera découvert à l’ouverture. 300 caractères maximum."
        >
          <textarea
            {...aria("ecrin-note", "hint")}
            value={note}
            maxLength={300}
            rows={3}
            onChange={(e) => setNote(e.target.value)}
            className={inputClass}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="ecrin-budget"
            label="Budget indicatif (FCFA)"
            optional
            hint={`L’Écrin gourmand : ${ECRIN_TERMS.price}`}
          >
            <input
              {...aria("ecrin-budget", "hint")}
              inputMode="numeric"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field
            id="ecrin-date"
            label="Date souhaitée"
            hint={`Délai minimum : ${TYPE.leadLabel}.`}
            error={errors["ecrin-date"]}
          >
            <input
              {...aria("ecrin-date", "hint", errors["ecrin-date"])}
              type="date"
              min={minDate}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                clear("ecrin-date");
              }}
              className={inputClass}
            />
          </Field>
        </div>

        <label className="flex min-h-11 cursor-pointer items-start gap-2.5 text-[0.875rem] text-ink">
          <input
            type="checkbox"
            checked={urgent}
            onChange={(e) => {
              setUrgent(e.target.checked);
              clear("ecrin-date");
            }}
            className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-gold-deep"
          />
          <span>
            Demande urgente
            <span className="block text-[0.75rem] text-muted">
              Selon les disponibilités, avec un supplément d’urgence précisé par
              La Marilyn.
            </span>
          </span>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="ecrin-name" label="Votre prénom" optional>
            <input
              {...aria("ecrin-name")}
              autoComplete="given-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <Field
          id="ecrin-details"
          label="Précisions"
          optional
          hint="Une photo d’inspiration ? Vous pourrez l’envoyer dans la conversation WhatsApp."
        >
          <textarea
            {...aria("ecrin-details", "hint")}
            value={details}
            rows={3}
            onChange={(e) => setDetails(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-7 flex flex-col items-start gap-3">
        <button type="submit" className={btnGold}>
          <WhatsAppIcon className="h-[18px] w-[18px]" />
          Envoyer ma composition
          <ArrowRight className={btnArrow} />
        </button>
        <p className="text-[0.75rem] leading-relaxed text-muted">
          {ECRIN_TERMS.priceDetail} {ECRIN_TERMS.cake}
        </p>
        {sentUrl && (
          <p role="status" className="text-[0.8125rem] text-ink">
            Votre demande s’ouvre dans WhatsApp : il ne reste qu’à l’envoyer.{" "}
            <a
              href={sentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold-deep underline underline-offset-2"
            >
              Rouvrir WhatsApp
            </a>
          </p>
        )}
      </div>
    </form>
  );
}
