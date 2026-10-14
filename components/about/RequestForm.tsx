"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/components/InfiniteProductCarousel";
import { DELIVERY, GATEAUX_TERMS, PRESENTOIRS } from "@/lib/commerce";
import { CREPES, MIGNARDISES, PATISSERIES } from "@/lib/creations";
import { formatFcfa, priceSummary } from "@/lib/pricing";
import {
  budgetText,
  buildRequestMessage,
  checkDate,
  daysUntil,
  formatDate,
  isoDate,
  isRequestType,
  REQUEST_TYPES,
  type MessageField,
  type RequestType,
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
import PrivacyNotice from "../forms/PrivacyNotice";
import { ArrowRight, WhatsAppIcon } from "../icons";

/** Types proposés dans ce formulaire (l'écrin a son propre configurateur). */
const FORM_TYPES: RequestType[] = [
  "cake-design",
  "gateaux",
  "mignardises",
  "buffet",
  "presentoirs",
  "ecrin",
];

const SNACKS = [...MIGNARDISES, ...CREPES];

/** « 10 pièces » → 10 (quantité minimale confirmée, si renseignée). */
const minOf = (p: Product) =>
  p.minQuantity ? Number.parseInt(p.minQuantity, 10) || 0 : 0;

type Values = Record<string, string>;

/**
 * Préparation d'une demande, envoyée sur WhatsApp sous forme de message
 * structuré. Aucune donnée n'est enregistrée ni transmise au site.
 */
export default function RequestForm() {
  const [type, setType] = useState<RequestType>("cake-design");
  const [v, setV] = useState<Values>({});
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [urgent, setUrgent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  // Type prérempli depuis un lien « Préparer ma demande » (?demande=…).
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("demande");
    if (isRequestType(param)) setType(param);
  }, []);

  const def = REQUEST_TYPES[type];
  const snackLead = Math.max(
    1,
    ...SNACKS.filter((p) => p.name in picks).map((p) => p.leadDays ?? 1),
  );
  const leadDays = type === "mignardises" ? snackLead : def.leadDays;
  const leadLabel =
    type === "mignardises" ? `${snackLead * 24} h` : def.leadLabel;

  const set = (id: string) => (value: string) => {
    setV((prev) => ({ ...prev, [id]: value }));
    clear(id);
  };
  const clear = (id: string) =>
    setErrors((e) => {
      if (!(id in e)) return e;
      const next = { ...e };
      delete next[id];
      return next;
    });

  const changeType = (t: RequestType) => {
    setType(t);
    setErrors({});
    setSentUrl(null);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    const need = (id: string, message: string) => {
      if (!v[id]?.trim()) e[id] = message;
    };
    switch (type) {
      case "cake-design":
        need("rq-occasion", "Indiquez l’occasion.");
        break;
      case "gateaux":
        need("rq-gateau", "Choisissez un gâteau.");
        if (v["rq-qty"] && !/^\d+$/.test(v["rq-qty"]))
          e["rq-qty"] = "Indiquez un nombre de gâteaux.";
        break;
      case "mignardises": {
        const chosen = SNACKS.filter((p) => p.name in picks);
        if (!chosen.length)
          e["rq-snacks"] = "Choisissez au moins une gourmandise.";
        for (const p of chosen) {
          const qty = Number(picks[p.name]);
          if (!/^\d+$/.test(picks[p.name]) || qty < 1) {
            e["rq-snacks"] = `Indiquez une quantité pour « ${p.name} ».`;
            break;
          }
          if (qty < minOf(p)) {
            e["rq-snacks"] =
              `« ${p.name} » : minimum ${p.minQuantity} par commande.`;
            break;
          }
        }
        break;
      }
      case "buffet":
        need("rq-event", "Indiquez le type d’événement.");
        need(
          "rq-people",
          "Indiquez le nombre de personnes, même approximatif.",
        );
        need("rq-place", "Indiquez le lieu de l’événement.");
        break;
      case "presentoirs":
        need("rq-formula", "Choisissez une formule.");
        break;
    }
    const dateError = checkDate(
      v["rq-date"] ?? "",
      leadDays,
      leadLabel,
      urgent,
    );
    if (dateError) e["rq-date"] = dateError;
    return e;
  };

  const fields = (): MessageField[] => {
    const common: MessageField[] = [
      ["Date souhaitée", v["rq-date"] && formatDate(v["rq-date"])],
      ["Demande urgente", urgent ? "oui" : undefined],
    ];
    const tail: MessageField[] = [
      ["Lieu de livraison", v["rq-delivery"]],
      ["Prénom", v["rq-name"]],
      ["Précisions", v["rq-details"]],
    ];
    switch (type) {
      case "cake-design":
        return [
          ["Occasion", v["rq-occasion"]],
          ...common,
          ["Inspiration", v["rq-inspiration"]],
          ["Nombre de personnes", v["rq-people"]],
          ["Saveur souhaitée", v["rq-flavour"]],
          ["Nombre d’étages", v["rq-tiers"]],
          ["Budget indicatif", budgetText(v["rq-budget"])],
          ...tail,
        ];
      case "gateaux":
        return [
          ["Gâteau", v["rq-gateau"]],
          ["Quantité", v["rq-qty"]],
          ...common,
          ...tail,
        ];
      case "mignardises":
        return [
          [
            "Commande",
            SNACKS.filter((p) => p.name in picks).map(
              (p) =>
                `${p.name} × ${picks[p.name]}${
                  v[`rq-opt-${p.name}`] ? ` (${v[`rq-opt-${p.name}`]})` : ""
                }`,
            ),
          ],
          ...common,
          ...tail,
        ];
      case "buffet":
        return [
          ["Type d’événement", v["rq-event"]],
          ...common,
          ["Nombre de personnes", v["rq-people"]],
          ["Lieu", v["rq-place"]],
          ["Produits souhaités", v["rq-products"]],
          ["Budget indicatif", budgetText(v["rq-budget"])],
          ["Prénom", v["rq-name"]],
          ["Informations complémentaires", v["rq-details"]],
        ];
      case "presentoirs":
        return [
          [
            "Formule",
            v["rq-formula"] === "seule"
              ? `Location seule du set de cubes (${formatFcfa(PRESENTOIRS.price)}, caution ${formatFcfa(PRESENTOIRS.deposit)})`
              : v["rq-formula"] === "prestation"
                ? "Location avec une prestation La Marilyn"
                : undefined,
          ],
          ["Date d’utilisation", v["rq-date"] && formatDate(v["rq-date"])],
          ["Prénom", v["rq-name"]],
          ["Précisions", v["rq-details"]],
        ];
      default:
        return [];
    }
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      setSentUrl(null);
      document
        .getElementById(first === "rq-snacks" ? "rq-snacks-legend" : first)
        ?.focus();
      return;
    }
    const closing =
      type === "cake-design"
        ? ["Je comprends que le prix final sera confirmé par La Marilyn."]
        : type === "buffet"
          ? ["Je souhaite recevoir un devis personnalisé."]
          : [];
    const url = whatsappUrl(
      buildRequestMessage(def.subject, fields(), closing),
    );
    setSentUrl(url);
    openWhatsApp(url);
  };

  // Gâteaux : après 18 h, le lendemain n'est plus garanti.
  const lateForTomorrow =
    type === "gateaux" &&
    !!v["rq-date"] &&
    daysUntil(v["rq-date"]) === 1 &&
    new Date().getHours() >= GATEAUX_TERMS.cutoffHour;

  const input = (
    id: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
    hint?: string,
  ) => (
    <input
      {...aria(id, hint, errors[id])}
      value={v[id] ?? ""}
      onChange={(e) => set(id)(e.target.value)}
      className={inputClass}
      {...props}
    />
  );
  const textarea = (id: string, hint?: string) => (
    <textarea
      {...aria(id, hint, errors[id])}
      rows={3}
      maxLength={1000}
      value={v[id] ?? ""}
      onChange={(e) => set(id)(e.target.value)}
      className={inputClass}
    />
  );

  return (
    <section
      id="demande"
      aria-labelledby="demande-form-title"
      className="scroll-mt-4 bg-cream px-4 py-12 sm:px-8 md:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <p className="eyebrow text-gold-deep">Préparer ma demande</p>
          <h2
            id="demande-form-title"
            className="display mt-4 text-[1.75rem] text-ink md:text-[2.5rem]"
          >
            Votre projet,
            <br />
            <em className="font-[330] italic">en quelques lignes.</em>
          </h2>
          <p className="mt-3 max-w-[26rem] text-[0.9375rem] leading-relaxed text-muted">
            Remplissez ce qui vous concerne : votre demande s’ouvre ensuite dans
            WhatsApp, prête à être envoyée à La Marilyn. Rien n’est enregistré
            sur le site.
          </p>
        </div>

        <form
          noValidate
          onSubmit={onSubmit}
          aria-labelledby="demande-form-title"
          className="rounded-[14px] bg-ivory p-5 sm:p-7 lg:p-9"
        >
          <fieldset>
            <legend className={labelClass}>Type de demande</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {FORM_TYPES.map((t) => (
                <label
                  key={t}
                  className="inline-flex min-h-10 cursor-pointer items-center rounded-full border border-sand px-3.5 text-[0.8125rem] text-ink transition-colors has-[:checked]:border-gold-deep has-[:checked]:bg-gold/15 has-[:focus-visible]:outline has-[:focus-visible]:outline-[1.5px] has-[:focus-visible]:outline-gold"
                >
                  <input
                    type="radio"
                    name="rq-type"
                    value={t}
                    checked={type === t}
                    onChange={() => changeType(t)}
                    className="sr-only"
                  />
                  {REQUEST_TYPES[t].label}
                </label>
              ))}
            </div>
          </fieldset>

          {type === "ecrin" ? (
            <div className="mt-6 rounded-[10px] border border-sand p-5">
              <p className="text-[0.9375rem] leading-relaxed text-ink">
                L’Écrin gourmand se compose avec son propre formulaire&nbsp;:
                occasion, gourmandises, couleurs et petit mot.
              </p>
              <Link href="/nos-creations#ecrin" className={`${btnGold} mt-4`}>
                Composer mon écrin
                <ArrowRight className={btnArrow} />
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              <ErrorSummary errors={errors} />

              {type === "cake-design" && (
                <>
                  <Field
                    id="rq-occasion"
                    label="Occasion"
                    error={errors["rq-occasion"]}
                  >
                    {input("rq-occasion", {
                      placeholder: "Anniversaire, mariage, baptême…",
                    })}
                  </Field>
                  <Field
                    id="rq-inspiration"
                    label="Inspiration"
                    optional
                    hint="Décrivez l’idée ; une photo d’inspiration pourra être envoyée dans la conversation WhatsApp."
                  >
                    {textarea("rq-inspiration", "hint")}
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-3">
                    <Field
                      id="rq-people"
                      label="Nombre de personnes"
                      optional
                      hint="Si vous le connaissez."
                    >
                      {input("rq-people", { inputMode: "numeric" }, "hint")}
                    </Field>
                    <Field id="rq-flavour" label="Saveur souhaitée" optional>
                      {input("rq-flavour")}
                    </Field>
                    <Field
                      id="rq-tiers"
                      label="Nombre d’étages"
                      optional
                      hint="Si souhaité."
                    >
                      {input("rq-tiers", { inputMode: "numeric" }, "hint")}
                    </Field>
                  </div>
                  <Field
                    id="rq-budget"
                    label="Budget indicatif (FCFA)"
                    optional
                    hint="Cake Design : à partir de 25 000 FCFA pour les créations les plus simples."
                  >
                    {input("rq-budget", { inputMode: "numeric" }, "hint")}
                  </Field>
                </>
              )}

              {type === "gateaux" && (
                <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
                  <Field
                    id="rq-gateau"
                    label="Gâteau"
                    error={errors["rq-gateau"]}
                  >
                    <select
                      {...aria("rq-gateau", undefined, errors["rq-gateau"])}
                      value={v["rq-gateau"] ?? ""}
                      onChange={(e) => set("rq-gateau")(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Choisir…</option>
                      {PATISSERIES.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name} — {priceSummary(p.pricing)}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    id="rq-qty"
                    label="Quantité"
                    optional
                    error={errors["rq-qty"]}
                  >
                    {input("rq-qty", {
                      inputMode: "numeric",
                      placeholder: "1",
                    })}
                  </Field>
                </div>
              )}

              {type === "mignardises" && (
                <fieldset
                  aria-describedby={
                    errors["rq-snacks"]
                      ? "rq-snacks-hint rq-snacks-error"
                      : "rq-snacks-hint"
                  }
                >
                  <legend
                    id="rq-snacks-legend"
                    tabIndex={-1}
                    className={`${labelClass} outline-none`}
                  >
                    Mignardises et crêpes
                  </legend>
                  <FieldMessages
                    id="rq-snacks"
                    hint="Quantités en pièces. Les minimums de commande sont indiqués pour chaque produit."
                    error={errors["rq-snacks"]}
                  />
                  <ul className="mt-3 divide-y divide-sand border-y border-sand">
                    {SNACKS.map((p) => {
                      const id = `rq-snack-${p.name.replace(/\W+/g, "-")}`;
                      const checked = p.name in picks;
                      const meta = [
                        priceSummary(p.pricing),
                        p.minQuantity && `min. ${p.minQuantity}`,
                        p.leadTime,
                      ]
                        .filter(Boolean)
                        .join(" · ");
                      return (
                        <li key={p.name} className="py-2.5">
                          <div className="flex min-h-10 items-center justify-between gap-3">
                            <label
                              htmlFor={id}
                              className="flex cursor-pointer items-start gap-2.5 text-[0.875rem] text-ink"
                            >
                              <input
                                id={id}
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  clear("rq-snacks");
                                  setPicks((prev) => {
                                    const next = { ...prev };
                                    if (e.target.checked)
                                      next[p.name] = String(minOf(p) || 1);
                                    else delete next[p.name];
                                    return next;
                                  });
                                }}
                                className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-gold-deep"
                              />
                              <span>
                                {p.name}
                                {meta && (
                                  <span className="block text-[0.75rem] text-muted">
                                    {meta}
                                  </span>
                                )}
                              </span>
                            </label>
                            {checked && (
                              <input
                                type="number"
                                inputMode="numeric"
                                min={minOf(p) || 1}
                                step={1}
                                value={picks[p.name]}
                                aria-label={`Quantité — ${p.name}`}
                                onChange={(e) => {
                                  clear("rq-snacks");
                                  setPicks((prev) => ({
                                    ...prev,
                                    [p.name]: e.target.value,
                                  }));
                                }}
                                className="h-10 w-[4.5rem] shrink-0 rounded-[8px] border border-sand bg-white px-2 text-center text-[1rem] text-ink focus:border-gold-deep focus:outline-none"
                              />
                            )}
                          </div>
                          {checked && p.options && (
                            <select
                              aria-label={`Choix — ${p.name}`}
                              value={v[`rq-opt-${p.name}`] ?? ""}
                              onChange={(e) =>
                                set(`rq-opt-${p.name}`)(e.target.value)
                              }
                              className={`${inputClass} !mt-2 sm:max-w-[16rem]`}
                            >
                              <option value="">Choix à préciser</option>
                              {p.options.map((o) => (
                                <option key={o}>{o}</option>
                              ))}
                            </select>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-2 text-[0.75rem] text-muted">
                    Grosses commandes : 72 h minimum.
                  </p>
                </fieldset>
              )}

              {type === "buffet" && (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      id="rq-event"
                      label="Type d’événement"
                      error={errors["rq-event"]}
                    >
                      {input("rq-event", {
                        placeholder: "Mariage, réception, séminaire…",
                      })}
                    </Field>
                    <Field
                      id="rq-people"
                      label="Nombre de personnes"
                      error={errors["rq-people"]}
                    >
                      {input("rq-people", { inputMode: "numeric" })}
                    </Field>
                  </div>
                  <Field
                    id="rq-place"
                    label="Lieu de l’événement"
                    error={errors["rq-place"]}
                  >
                    {input("rq-place", { placeholder: "Quartier, ville" })}
                  </Field>
                  <Field id="rq-products" label="Produits souhaités" optional>
                    {textarea("rq-products")}
                  </Field>
                  <Field
                    id="rq-budget"
                    label="Budget indicatif (FCFA)"
                    optional
                  >
                    {input("rq-budget", { inputMode: "numeric" })}
                  </Field>
                </>
              )}

              {type === "presentoirs" && (
                <fieldset>
                  <legend
                    id="rq-formula"
                    tabIndex={-1}
                    className={`${labelClass} outline-none`}
                  >
                    Formule
                  </legend>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {[
                      {
                        value: "seule",
                        label: "Location seule",
                        text: `${formatFcfa(PRESENTOIRS.price)} le set · caution ${formatFcfa(PRESENTOIRS.deposit)} · ${PRESENTOIRS.transport.toLowerCase()}`,
                      },
                      {
                        value: "prestation",
                        label: "Avec une prestation La Marilyn",
                        text: "Conditions précisées avec votre devis.",
                      },
                    ].map((f) => (
                      <label
                        key={f.value}
                        className="flex cursor-pointer gap-2.5 rounded-[10px] border border-sand p-3.5 text-[0.875rem] has-[:checked]:border-gold-deep has-[:checked]:bg-gold/10"
                      >
                        <input
                          type="radio"
                          name="rq-formula"
                          value={f.value}
                          checked={v["rq-formula"] === f.value}
                          onChange={() => set("rq-formula")(f.value)}
                          className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-gold-deep"
                        />
                        <span>
                          <span className="block font-semibold text-ink">
                            {f.label}
                          </span>
                          <span className="block text-[0.75rem] text-muted">
                            {f.text}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <FieldMessages id="rq-formula" error={errors["rq-formula"]} />
                </fieldset>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="rq-date"
                  label={
                    type === "presentoirs" || type === "buffet"
                      ? "Date de l’événement"
                      : "Date souhaitée"
                  }
                  hint={
                    type === "gateaux"
                      ? GATEAUX_TERMS.leadTime
                      : leadLabel
                        ? `Délai minimum : ${leadLabel}.`
                        : type === "buffet"
                          ? "Le délai dépend de la nature et de l’ampleur de l’événement."
                          : undefined
                  }
                  error={errors["rq-date"]}
                >
                  {input(
                    "rq-date",
                    { type: "date", min: isoDate(new Date()) },
                    type === "gateaux" || leadLabel || type === "buffet"
                      ? "hint"
                      : undefined,
                  )}
                </Field>
                {type !== "presentoirs" && type !== "buffet" && (
                  <Field
                    id="rq-delivery"
                    label="Lieu de livraison"
                    optional
                    hint="Frais de livraison à la charge du client, confirmés avec la commande."
                  >
                    {input(
                      "rq-delivery",
                      { placeholder: "Quartier, ville" },
                      "hint",
                    )}
                  </Field>
                )}
              </div>

              {lateForTomorrow && (
                <p
                  role="status"
                  className="rounded-[8px] bg-gold/15 px-3.5 py-2.5 text-[0.8125rem] text-ink"
                >
                  Il est plus de 18 h : une préparation pour demain n’est pas
                  garantie, la commande peut passer au créneau suivant
                  disponible.
                </p>
              )}

              {leadDays && (
                <label className="flex min-h-11 cursor-pointer items-start gap-2.5 text-[0.875rem] text-ink">
                  <input
                    type="checkbox"
                    checked={urgent}
                    onChange={(e) => {
                      setUrgent(e.target.checked);
                      clear("rq-date");
                    }}
                    className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-gold-deep"
                  />
                  <span>
                    Demande urgente
                    <span className="block text-[0.75rem] text-muted">
                      Selon les disponibilités, avec un supplément d’urgence
                      précisé par La Marilyn.
                    </span>
                  </span>
                </label>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="rq-name" label="Votre prénom" optional>
                  {input("rq-name", { autoComplete: "given-name" })}
                </Field>
              </div>
              <Field
                id="rq-details"
                label={
                  type === "buffet"
                    ? "Informations complémentaires"
                    : "Précisions"
                }
                optional
              >
                {textarea("rq-details")}
              </Field>

              <PrivacyNotice />
              <div className="flex flex-col items-start gap-3 pt-2">
                <button type="submit" className={btnGold}>
                  <WhatsAppIcon className="h-[18px] w-[18px]" />
                  Envoyer sur WhatsApp
                  <ArrowRight className={btnArrow} />
                </button>
                {type !== "presentoirs" && (
                  <p className="text-[0.75rem] leading-relaxed text-muted">
                    {DELIVERY.base}
                  </p>
                )}
                {sentUrl && (
                  <p role="status" className="text-[0.8125rem] text-ink">
                    Votre demande s’ouvre dans WhatsApp : il ne reste qu’à
                    l’envoyer.{" "}
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
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
