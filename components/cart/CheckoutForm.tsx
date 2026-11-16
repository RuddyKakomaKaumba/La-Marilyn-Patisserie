"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  buildOrderMessage,
  leadLabel,
  qtyLabel,
  type OrderDetails,
} from "@/lib/cart";
import {
  DELIVERY,
  GATEAUX_TERMS,
  PAYMENT,
  REQUEST_IS_NOT_BOOKING,
} from "@/lib/commerce";
import { formatFcfa } from "@/lib/pricing";
import {
  checkDate,
  daysUntil,
  firstRequestDate,
  nowInDouala,
} from "@/lib/requests";
import { whatsappUrl } from "@/lib/site";
import { btnArrow, btnGold, btnOutlineDark } from "../buttons";
import DateNotice from "../forms/DateNotice";
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
import { ArrowRight, BagIcon, WhatsAppIcon } from "../icons";
import { useCart } from "./CartProvider";

type Values = {
  name: string;
  phone: string;
  date: string;
  mode: "" | "livraison" | "retrait";
  place: string;
  details: string;
};

const EMPTY: Values = {
  name: "",
  phone: "",
  date: "",
  mode: "",
  place: "",
  details: "",
};

const PHONE = /^[+\d][\d\s().-]{5,24}$/;

/**
 * Finalisation de la commande : récapitulatif du panier, coordonnées,
 * date et mode de récupération, puis un seul message WhatsApp. Rien n'est
 * enregistré : les coordonnées restent dans la page, le temps de l'envoi.
 */
export default function CheckoutForm() {
  const { summary, ready, open } = useCart();
  const [v, setV] = useState<Values>(EMPTY);
  const [urgent, setUrgent] = useState(false);
  const [submitErrors, setErrors] = useState<Record<string, string>>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  // Délai le plus long des produits du panier (sauf demande urgente).
  const leadDays = Math.max(1, summary.leadDays);
  const lead = leadLabel(leadDays);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setV((prev) => ({ ...prev, [key]: value }));
    setSentUrl(null);
    setErrors((e) => {
      const id = `co-${key}`;
      if (!(id in e)) return e;
      const next = { ...e };
      delete next[id];
      return next;
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!v.name.trim()) e["co-name"] = "Indiquez votre nom.";
    if (v.phone.trim() && !PHONE.test(v.phone.trim()))
      e["co-phone"] = "Indiquez un numéro de téléphone valide.";
    const dateError = checkDate(v.date, leadDays, lead, urgent);
    if (dateError) e["co-date"] = dateError;
    if (!v.mode) e["co-mode"] = "Choisissez la livraison ou le retrait.";
    if (v.mode === "livraison" && !v.place.trim())
      e["co-place"] = "Indiquez le lieu de livraison.";
    return e;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      setSentUrl(null);
      document.getElementById(first)?.focus();
      return;
    }
    const details: OrderDetails = {
      name: v.name,
      phone: v.phone,
      date: v.date,
      urgent,
      mode: v.mode as OrderDetails["mode"],
      place: v.place,
      details: v.details,
    };
    const url = whatsappUrl(buildOrderMessage(summary, details));
    setSentUrl(url);
    openWhatsApp(url);
  };

  const liveDateError = v.date
    ? checkDate(v.date, leadDays, lead, urgent)
    : undefined;
  const errors =
    liveDateError && !submitErrors["co-date"]
      ? { ...submitErrors, "co-date": liveDateError }
      : submitErrors;

  // Gâteaux : après 18 h (heure de Douala), le lendemain n'est plus garanti.
  const lateForTomorrow =
    summary.hasGateau &&
    !!v.date &&
    daysUntil(v.date) === 1 &&
    nowInDouala().hour >= GATEAUX_TERMS.cutoffHour;

  if (!ready) {
    return <div className="min-h-[24rem]" aria-busy="true" />;
  }

  if (!summary.lines.length) {
    return (
      <div className="mx-auto flex max-w-[34rem] flex-col items-center rounded-[14px] bg-ivory px-6 py-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
          <BagIcon className="h-7 w-7" />
        </span>
        <h2 className="display mt-4 text-[1.5rem] text-ink">
          Votre panier est vide
        </h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
          Ajoutez des gâteaux gourmands, des mignardises ou des crêpes depuis
          nos créations, puis revenez ici pour envoyer votre commande.
        </p>
        <Link href="/nos-creations" className={`${btnGold} mt-6`}>
          Découvrir nos créations
          <ArrowRight className={btnArrow} />
        </Link>
      </div>
    );
  }

  const blocked = summary.unavailable.length > 0;

  return (
    <div className="mx-auto grid max-w-[1280px] gap-6 lg:grid-cols-[1fr_1.35fr] lg:items-start lg:gap-12">
      {/* Récapitulatif */}
      <section
        aria-labelledby="recap-titre"
        className="rounded-[14px] bg-ivory p-5 sm:p-7 lg:sticky lg:top-6"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h2
            id="recap-titre"
            className="display text-[1.5rem] text-ink md:text-[1.75rem]"
          >
            Votre panier
          </h2>
          <button
            type="button"
            onClick={open}
            className="text-[0.8125rem] text-gold-deep underline decoration-gold/60 underline-offset-4 hover:text-ink"
          >
            Modifier
          </button>
        </div>
        <ul className="mt-4 divide-y divide-sand border-y border-sand">
          {summary.lines.map((l) => {
            const product = l.entry?.product;
            return (
              <li key={l.key} className="flex gap-3 py-3">
                <div
                  className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[8px]"
                  style={{ backgroundColor: product?.tone ?? "#eadfcf" }}
                >
                  {product?.image && (
                    <Image
                      src={product.image.src}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                      style={{
                        objectPosition: product.image.position ?? "50% 50%",
                      }}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1 text-[0.875rem]">
                  <p className="font-semibold text-ink">
                    {product?.name ?? "Produit retiré"}
                  </p>
                  <p className="text-[0.8125rem] text-muted">
                    {l.available
                      ? [qtyLabel(l.mode, l.qty), l.variant, l.option]
                          .filter(Boolean)
                          .join(" · ")
                      : "Ce produit n’est plus proposé"}
                  </p>
                </div>
                <p className="shrink-0 text-right text-[0.875rem] font-semibold tabular-nums text-ink">
                  {l.subtotal === null ? (
                    <span className="font-normal text-muted">
                      Tarif à confirmer
                    </span>
                  ) : (
                    formatFcfa(l.subtotal)
                  )}
                </p>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <p className="font-sans text-[0.9375rem] font-semibold text-ink">
            {summary.unpriced.length
              ? "Sous-total provisoire"
              : "Total des produits"}
          </p>
          <p className="font-sans text-[1.25rem] font-semibold tabular-nums text-ink">
            {formatFcfa(summary.total)}
          </p>
        </div>
        <ul className="mt-2 space-y-1 text-[0.75rem] leading-relaxed text-muted">
          {summary.unpriced.length > 0 && (
            <li>
              Sur devis :{" "}
              {summary.unpriced.map((l) => l.entry?.product.name).join(", ")}.
              Leur tarif vous est confirmé par La Marilyn.
            </li>
          )}
          <li>
            Montant indicatif, hors frais de livraison (à la charge du client).{" "}
            {DELIVERY.final}
          </li>
          <li>{PAYMENT.summary}</li>
        </ul>
      </section>

      {/* Coordonnées et envoi */}
      <form
        noValidate
        onSubmit={onSubmit}
        aria-labelledby="commande-form-titre"
        className="rounded-[14px] bg-ivory p-5 sm:p-7 lg:p-9"
      >
        <h2
          id="commande-form-titre"
          className="display text-[1.5rem] text-ink md:text-[1.75rem]"
        >
          Vos informations
        </h2>
        <p className="mt-1 text-[0.875rem] text-muted">
          À remplir une seule fois pour toute la commande.
        </p>

        <div className="mt-6 space-y-5">
          <ErrorSummary errors={submitErrors} />

          {blocked && (
            <p
              role="alert"
              className="rounded-[8px] bg-[#fff3cd] px-3.5 py-2.5 text-[0.8125rem] text-[#5c4300]"
            >
              Certains articles ne sont plus proposés.{" "}
              <button
                type="button"
                onClick={open}
                className="font-semibold underline underline-offset-2"
              >
                Retirez-les du panier
              </button>{" "}
              avant d’envoyer votre commande.
            </p>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="co-name" label="Votre nom" error={errors["co-name"]}>
              <input
                {...aria("co-name", undefined, errors["co-name"])}
                autoComplete="name"
                maxLength={80}
                value={v.name}
                onChange={(e) => set("name", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field
              id="co-phone"
              label="Téléphone"
              optional
              hint="Si différent de votre numéro WhatsApp."
              error={errors["co-phone"]}
            >
              <input
                {...aria("co-phone", "hint", errors["co-phone"])}
                type="tel"
                autoComplete="tel"
                maxLength={25}
                value={v.phone}
                onChange={(e) => set("phone", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <Field
            id="co-date"
            label="Date souhaitée"
            hint={
              summary.hasGateau && leadDays === 1
                ? GATEAUX_TERMS.leadTime
                : `Délai minimum pour votre panier : ${lead} (le délai le plus long des produits choisis).`
            }
            error={errors["co-date"]}
            className="sm:max-w-[50%] sm:pr-2.5"
          >
            <input
              {...aria("co-date", "hint", errors["co-date"])}
              type="date"
              min={urgent ? nowInDouala().today : firstRequestDate(leadDays)}
              value={v.date}
              onChange={(e) => set("date", e.target.value)}
              className={inputClass}
            />
          </Field>

          <DateNotice />

          {lateForTomorrow && (
            <p
              role="status"
              className="rounded-[8px] bg-gold/15 px-3.5 py-2.5 text-[0.8125rem] text-ink"
            >
              Il est plus de 18 h : une préparation pour demain n’est pas
              garantie, la commande peut passer au créneau suivant disponible.
            </p>
          )}

          <label className="flex min-h-11 cursor-pointer items-start gap-2.5 text-[0.875rem] text-ink">
            <input
              type="checkbox"
              checked={urgent}
              onChange={(e) => {
                setUrgent(e.target.checked);
                setSentUrl(null);
                setErrors((prev) => {
                  if (!("co-date" in prev)) return prev;
                  const next = { ...prev };
                  delete next["co-date"];
                  return next;
                });
              }}
              className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-gold-deep"
            />
            <span>
              Demande urgente
              <span className="block text-[0.75rem] text-muted">
                Selon les disponibilités, avec un supplément d’urgence précisé
                par La Marilyn.
              </span>
            </span>
          </label>

          <fieldset>
            <legend
              id="co-mode"
              tabIndex={-1}
              className={`${labelClass} outline-none`}
            >
              Mode de récupération
            </legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {(
                [
                  {
                    value: "livraison",
                    label: "Livraison",
                    text: "Frais à la charge du client, confirmés avec la commande.",
                  },
                  {
                    value: "retrait",
                    label: "Retrait sur place",
                    text: DELIVERY.pickup,
                  },
                ] as const
              ).map((m) => (
                <label
                  key={m.value}
                  className="flex cursor-pointer gap-2.5 rounded-[10px] border border-sand bg-white p-3.5 text-[0.875rem] has-[:checked]:border-gold-deep has-[:checked]:bg-gold/10"
                >
                  <input
                    type="radio"
                    name="co-mode"
                    value={m.value}
                    checked={v.mode === m.value}
                    onChange={() => set("mode", m.value)}
                    className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-gold-deep"
                  />
                  <span>
                    <span className="block font-semibold text-ink">
                      {m.label}
                    </span>
                    <span className="block text-[0.75rem] text-muted">
                      {m.text}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <FieldMessages id="co-mode" error={errors["co-mode"]} />
          </fieldset>

          {v.mode === "livraison" && (
            <Field
              id="co-place"
              label="Lieu de livraison"
              error={errors["co-place"]}
            >
              <input
                {...aria("co-place", undefined, errors["co-place"])}
                placeholder="Quartier, ville"
                maxLength={160}
                value={v.place}
                onChange={(e) => set("place", e.target.value)}
                className={inputClass}
              />
            </Field>
          )}

          <Field id="co-details" label="Informations complémentaires" optional>
            <textarea
              {...aria("co-details")}
              rows={3}
              maxLength={1000}
              value={v.details}
              onChange={(e) => set("details", e.target.value)}
              className={inputClass}
            />
          </Field>

          <p className="text-[0.75rem] leading-relaxed text-muted md:text-[0.8125rem]">
            {REQUEST_IS_NOT_BOOKING} {PAYMENT.summary}{" "}
            <Link
              href="/a-propos#conditions"
              className="text-gold-deep underline underline-offset-2 hover:text-ink"
            >
              Nos conditions
            </Link>
          </p>

          <PrivacyNotice />

          <div className="flex flex-col items-stretch gap-3 pt-2 sm:items-start">
            <button
              type="submit"
              disabled={blocked}
              className={`${btnGold} disabled:pointer-events-none disabled:opacity-50`}
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              Envoyer ma commande sur WhatsApp
              <ArrowRight className={btnArrow} />
            </button>
            {sentUrl && (
              <div role="status" className="text-[0.8125rem] text-ink">
                <p>
                  Votre commande s’ouvre dans WhatsApp : il ne reste qu’à
                  l’envoyer.{" "}
                  <a
                    href={sentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-deep underline underline-offset-2"
                  >
                    Rouvrir WhatsApp
                  </a>
                </p>
                <p className="mt-1 text-muted">
                  Votre panier reste disponible tant que La Marilyn n’a pas
                  confirmé votre commande.
                </p>
              </div>
            )}
            <Link href="/nos-creations" className={btnOutlineDark}>
              Continuer mes achats
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
