/**
 * Captures du vrai site La Marilyn (production), utilisées dans le film.
 * Rien n'est modifié sur le site : simple navigation en lecture.
 *
 *   node scripts/capture-site.cjs
 *
 * Sorties : public/captures/*.png|jpg + src/data/captures.json (positions
 * réelles des sections et des éléments animés dans la vidéo).
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = "https://la-marilyn-patisserie.vercel.app";
const OUT = path.join(__dirname, "..", "public", "captures");
const META = path.join(__dirname, "..", "src", "data", "captures.json");
/** Date souhaitée saisie dans le formulaire de démonstration. */
const DEMO_DATE = "2026-12-19";
const DEMO_GATEAU = "Moelleux au chocolat";

const meta = {};
const shot = (p, name, opts = {}) =>
  p.screenshot({ path: path.join(OUT, name), animations: "disabled", ...opts });

/** Fait défiler toute la page pour déclencher les apparitions au scroll. */
async function settle(p) {
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 300) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await p.waitForTimeout(140);
  }
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(1200);
  return h;
}
const hideFloat = (p) =>
  p.addStyleTag({ content: ".wa-float{visibility:hidden!important} html{scroll-behavior:auto!important}" });
const box = async (p, sel) => {
  const el = typeof sel === "string" ? p.locator(sel).first() : sel;
  const b = await el.boundingBox();
  const sy = await p.evaluate(() => window.scrollY);
  return b && { x: b.x, y: b.y + sy, w: b.width, h: b.height };
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(path.dirname(META), { recursive: true });
  // --lang : le champ date natif s'affiche au format français (jj/mm/aaaa).
  const browser = await chromium.launch({
    args: ["--lang=fr-FR"],
    env: { ...process.env, LANG: "fr_FR.UTF-8", LANGUAGE: "fr" },
  });

  /* ------------------------------ Mobile ------------------------------ */
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    locale: "fr-FR",
    timezoneId: "Africa/Douala",
    // Fige le défilement automatique des carrousels le temps de la capture.
    reducedMotion: "reduce",
  });
  // Le bouton d'envoi ouvre WhatsApp dans un nouvel onglet : on le neutralise.
  await mobile.addInitScript(() => {
    window.open = () => ({ closed: false, focus() {}, location: {} });
  });
  await mobile.route(/wa\.me|whatsapp\.com/, (r) => r.abort());
  const m = await mobile.newPage();
  meta.mobile = { width: 390, height: 844, scale: 3 };

  // Accueil
  await m.goto(BASE + "/", { waitUntil: "networkidle" });
  await settle(m);
  await shot(m, "m-accueil-ecran.png");
  // Bouton flottant WhatsApp, capturé seul (fond transparent)
  meta.waFloat = await box(m, ".wa-float");
  await m.locator(".wa-float").screenshot({ path: path.join(OUT, "m-wa-float.png"), omitBackground: true });
  await hideFloat(m);
  meta.accueilHeight = await m.evaluate(() => document.documentElement.scrollHeight);
  await shot(m, "m-accueil-page.jpg", { fullPage: true, type: "jpeg", quality: 88 });

  // Nos créations
  await m.goto(BASE + "/nos-creations", { waitUntil: "networkidle" });
  await settle(m);
  await hideFloat(m);
  meta.creationsHeight = await m.evaluate(() => document.documentElement.scrollHeight);
  meta.sections = {};
  for (const id of ["patisseries", "cake-design", "mignardises", "crepes", "ecrin", "traiteur", "presentoirs"]) {
    meta.sections[id] = await box(m, "#" + id);
  }
  meta.devisButton = await box(m, m.locator("#cake-design a", { hasText: "Demander un devis" }));
  await shot(m, "m-creations-page.jpg", { fullPage: true, type: "jpeg", quality: 88 });

  // Fiche d'une création (bouton « + » de la carte Moelleux au chocolat)
  const card = m.locator("#patisseries article", { hasText: "Moelleux au chocolat" }).first();
  await m.evaluate(() => {
    const s = document.querySelector("#patisseries");
    window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY - 24);
  });
  await m.waitForTimeout(500);
  meta.ficheScrollY = await m.evaluate(() => window.scrollY);
  // Toute la carte ouvre la fiche de la création.
  meta.ficheCard = await box(m, card);
  await shot(m, "m-creations-gateaux-ecran.png");
  await card.locator("button[aria-haspopup=dialog]").click({ force: true });
  await m.waitForTimeout(1200);
  meta.ficheSheet = await box(m, "dialog[open]");
  await shot(m, "m-fiche-moelleux.png");

  // Cartes produit du site, capturées une à une (mises en scène dans la séquence 3)
  meta.ui = {};
  await m.goto(BASE + "/nos-creations", { waitUntil: "networkidle" });
  await settle(m);
  await hideFloat(m);
  for (const id of ["patisseries", "mignardises", "crepes", "traiteur"]) {
    const cards = m.locator(`#${id} article`);
    meta.ui[id] = [];
    for (let i = 0; i < Math.min(3, await cards.count()); i++) {
      const c = cards.nth(i);
      await c.scrollIntoViewIfNeeded();
      await m.waitForTimeout(250);
      const b = await c.boundingBox();
      const name = `ui-${id}-${i + 1}.png`;
      await c.screenshot({ path: path.join(OUT, name), animations: "disabled" });
      meta.ui[id].push({ file: name, w: b.width, h: b.height, title: (await c.locator("button[aria-haspopup=dialog]").innerText()).split(",")[0].trim() });
    }
  }

  // Formulaire de demande, type « Gâteaux gourmands » (lien « Préparer ma demande »)
  await m.goto(BASE + "/a-propos?demande=gateaux#demande", { waitUntil: "networkidle" });
  await settle(m);
  await hideFloat(m);
  const scrollTo = async (sel, offset) => {
    await m.evaluate(
      ([s, o]) => {
        const el = document.querySelector(s);
        window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - o);
      },
      [sel, offset],
    );
    await m.waitForTimeout(350);
    return m.evaluate(() => window.scrollY);
  };
  const blur = () => m.evaluate(() => document.activeElement && document.activeElement.blur());
  meta.form = {};
  meta.form.sectionY = (await box(m, "#demande")).y;
  meta.form.formY = await scrollTo("#demande form", 96);
  meta.form.gateau = await box(m, "#rq-gateau");
  meta.form.date = await box(m, "#rq-date");
  meta.form.submit = await box(m, "#demande button[type=submit]");
  await shot(m, "m-form-1-vide.png");
  await m.locator("#rq-gateau").selectOption(DEMO_GATEAU);
  await blur();
  await scrollTo("#demande form", 96);
  await shot(m, "m-form-2-gateau.png");
  await m.locator("#rq-date").fill(DEMO_DATE);
  await blur();
  await scrollTo("#demande form", 96);
  await shot(m, "m-form-3-date.png");
  meta.aproposHeight = await m.evaluate(() => document.documentElement.scrollHeight);
  await m.evaluate(() => window.scrollTo(0, 0));
  await m.waitForTimeout(300);
  await shot(m, "m-apropos-page.jpg", { fullPage: true, type: "jpeg", quality: 88 });
  meta.form.submitY = await scrollTo("#demande button[type=submit]", 470);
  await shot(m, "m-form-4-envoi.png");
  await m.locator("#demande button[type=submit]").click();
  await m.waitForTimeout(700);
  await blur();
  await scrollTo("#demande button[type=submit]", 470);
  await shot(m, "m-form-5-envoye.png");
  // Message réellement préparé par le site (lien wa.me généré par le formulaire)
  meta.form.message = await m.evaluate(() => {
    const a = document.querySelector("#demande p[role=status] a");
    return a ? new URL(a.href).searchParams.get("text") : null;
  });
  meta.form.demoDate = DEMO_DATE;
  await mobile.close();

  /* ------------------------------ Bureau ------------------------------ */
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    locale: "fr-FR",
    timezoneId: "Africa/Douala",
    reducedMotion: "reduce",
  });
  const d = await desktop.newPage();
  meta.desktop = { width: 1440, height: 900, scale: 2 };
  await d.goto(BASE + "/", { waitUntil: "networkidle" });
  await settle(d);
  await hideFloat(d);
  await shot(d, "d-accueil-ecran.jpg", { type: "jpeg", quality: 90 });
  meta.desktopAccueilHeight = await d.evaluate(() => document.documentElement.scrollHeight);
  await shot(d, "d-accueil-page.jpg", { fullPage: true, type: "jpeg", quality: 86 });
  await d.goto(BASE + "/nos-creations", { waitUntil: "networkidle" });
  await settle(d);
  await hideFloat(d);
  meta.desktopCreationsHeight = await d.evaluate(() => document.documentElement.scrollHeight);
  meta.desktopSections = {};
  for (const id of ["patisseries", "cake-design", "mignardises", "crepes", "ecrin", "traiteur"]) {
    meta.desktopSections[id] = await box(d, "#" + id);
  }
  await shot(d, "d-creations-page.jpg", { fullPage: true, type: "jpeg", quality: 86 });
  await desktop.close();

  await browser.close();
  meta.capturedAt = new Date().toISOString();
  meta.source = BASE;
  fs.writeFileSync(META, JSON.stringify(meta, null, 2) + "\n");
  console.log(JSON.stringify(meta, null, 1));
})();
