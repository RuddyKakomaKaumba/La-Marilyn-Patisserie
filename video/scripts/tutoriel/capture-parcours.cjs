/**
 * Tutoriel « Votre commande, en quelques clics » : captures du parcours
 * réel sur le site public, en lecture seule.
 *
 *   node scripts/tutoriel/capture-parcours.cjs
 *
 * Le panier vit dans le navigateur de capture (localStorage) : rien n'est
 * enregistré côté site. L'ouverture de WhatsApp est interceptée : aucun
 * message n'est envoyé, on récupère seulement le texte préparé par le site.
 *
 * Sorties : public/tutoriel/captures/*.png|jpg et src/tutoriel/data/parcours.json
 * (positions mesurées sur le site, en pixels CSS).
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = "https://la-marilyn-patisserie.vercel.app";
const OUT = path.join(__dirname, "..", "..", "public", "tutoriel", "captures");
const META = path.join(__dirname, "..", "..", "src", "tutoriel", "data", "parcours.json");
const W = 390;
const H = 844;
const SCALE = 3;

/** Données de démonstration (fictives) saisies dans le formulaire. */
const DEMO = {
  gateau: "Moelleux au chocolat",
  mignardise: "Mini burgers",
  name: "Aminata",
  date: "2026-12-05",
  place: "Bonapriso, Douala",
};

const meta = { source: BASE, viewport: { width: W, height: H, scale: SCALE }, demo: DEMO };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(path.dirname(META), { recursive: true });
  // --lang : le champ date natif s'affiche au format français (jj/mm/aaaa).
  const browser = await chromium.launch({
    args: ["--lang=fr-FR"],
    env: { ...process.env, LANG: "fr_FR.UTF-8", LANGUAGE: "fr" },
  });
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: SCALE,
    isMobile: true,
    hasTouch: true,
    locale: "fr-FR",
    timezoneId: "Africa/Douala",
    // Fige le défilement automatique des carrousels le temps de la capture.
    reducedMotion: "reduce",
  });
  // WhatsApp : on garde le lien préparé par le site, sans rien ouvrir ni envoyer.
  await ctx.addInitScript(() => {
    window.open = (u) => {
      window.__wa = String(u);
      return { closed: false, focus() {}, close() {}, location: {} };
    };
  });
  await ctx.route(/wa\.me|whatsapp\.com/, (r) => r.abort());
  const p = await ctx.newPage();

  const file = (n) => path.join(OUT, n);
  const shot = (n, opts = {}) => p.screenshot({ path: file(n), animations: "disabled", ...opts });
  const scrollY = () => p.evaluate(() => window.scrollY);
  /** Boîte d'un élément en coordonnées de page (pixels CSS). */
  const pageBox = async (loc) => {
    const b = await loc.boundingBox();
    const y = await scrollY();
    return b && { x: +b.x.toFixed(1), y: +(b.y + y).toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1) };
  };
  /** Boîte relative à un autre élément (pour les fenêtres). */
  const relBox = async (loc, origin) => {
    const [b, o] = [await loc.boundingBox(), await origin.boundingBox()];
    return b && o && { x: +(b.x - o.x).toFixed(1), y: +(b.y - o.y).toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1) };
  };
  const settle = async () => {
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 300) {
      await p.evaluate((v) => window.scrollTo(0, v), y);
      await p.waitForTimeout(110);
    }
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(900);
  };
  const scrollTo = async (y) => {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await p.waitForTimeout(350);
    return scrollY();
  };
  const floats = () =>
    p.evaluate(() =>
      [...document.querySelectorAll("[data-cart-button], .wa-float")].map((el) => {
        const s = getComputedStyle(el);
        const fixed = s.position === "fixed" || getComputedStyle(el.parentElement).position === "fixed";
        const r = el.getBoundingClientRect();
        return { cart: el.hasAttribute("data-cart-button"), fixed, x: r.x, y: r.y, w: r.width, h: r.height, label: el.getAttribute("aria-label") };
      }),
    );
  const HIDE_FLOATS = "hide-floats";
  const hideFloats = (on) =>
    p.evaluate(
      ([id, on]) => {
        document.getElementById(id)?.remove();
        if (!on) return;
        const st = document.createElement("style");
        st.id = id;
        // Boutons flottants masqués sur les pages entières : ils sont reposés au montage.
        st.textContent = ".wa-float, .cart-float{visibility:hidden!important} html{scroll-behavior:auto!important}";
        document.head.appendChild(st);
      },
      [HIDE_FLOATS, on],
    );
  /**
   * Bouton flottant isolé, sur fond transparent : le reste de la page est
   * masqué le temps de la capture (le bouton s'efface sinon lorsqu'il
   * recouvre un autre bouton de la page).
   */
  const isolatedShot = async (selector, name) => {
    const el = p.locator(selector).first();
    if (!(await el.count())) return null;
    await p.evaluate((sel) => {
      const st = document.createElement("style");
      st.id = "isolate-float";
      st.textContent = `html,body{background:transparent!important} body *{visibility:hidden!important}
        ${sel}, ${sel} *{visibility:visible!important}`;
      document.head.appendChild(st);
      for (let n = document.querySelector(sel); n && n !== document.body; n = n.parentElement) {
        n.dataset.prevOpacity = n.style.opacity;
        n.style.setProperty("opacity", "1", "important");
      }
    }, selector);
    await p.waitForTimeout(300);
    const b = await el.boundingBox();
    // Marge pour la pastille et l'ombre.
    const pad = 12;
    await p.screenshot({
      path: file(name),
      clip: { x: b.x - pad, y: b.y - pad, width: b.width + pad * 2, height: b.height + pad * 2 },
      omitBackground: true,
      animations: "disabled",
    });
    const label = await el.getAttribute("aria-label");
    await p.evaluate((sel) => {
      document.getElementById("isolate-float")?.remove();
      for (let n = document.querySelector(sel); n && n !== document.body; n = n.parentElement) {
        n.style.opacity = n.dataset.prevOpacity || "";
      }
    }, selector);
    return { x: +(b.x - pad).toFixed(1), y: +(b.y - pad).toFixed(1), w: +(b.width + pad * 2).toFixed(1), h: +(b.height + pad * 2).toFixed(1), label };
  };
  const floatShot = (name) => isolatedShot(".cart-float", name);

  /* ------------------------------ Accueil ------------------------------ */
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await settle();
  await p.waitForTimeout(600);
  await shot("t-accueil.png");
  meta.accueil = {
    cta: await pageBox(p.locator("a", { hasText: "Découvrir nos créations" }).first()),
    floats: await floats(),
  };
  meta.waFloat = await isolatedShot(".wa-float", "t-wa-float.png");

  /* --------------------------- Nos créations --------------------------- */
  await p.goto(BASE + "/nos-creations", { waitUntil: "networkidle" });
  await settle();
  await hideFloats(true);
  const sections = {};
  for (const id of ["patisseries", "cake-design", "mignardises", "crepes", "ecrin", "traiteur", "presentoirs"]) {
    sections[id] = await pageBox(p.locator("#" + id));
  }
  const chips = await p.locator("nav[aria-label='Sections de la page'] a").all();
  const chipBoxes = [];
  for (const c of chips) chipBoxes.push({ label: (await c.innerText()).trim(), ...(await pageBox(c)) });
  const gCard = p.locator("#patisseries article", { hasText: DEMO.gateau }).first();
  const mCard = p.locator("#mignardises article", { hasText: DEMO.mignardise }).first();
  meta.creations = {
    height: await p.evaluate(() => document.documentElement.scrollHeight),
    sections,
    chips: chipBoxes,
    gateauCard: await pageBox(gCard),
    gateauPrice: await pageBox(gCard.locator("p.text-gold-deep").first()),
    gateauAdd: await pageBox(gCard.locator("[data-card-cart]").first()),
    burgerCard: await pageBox(mCard),
    burgerPrice: await pageBox(mCard.locator("p.text-gold-deep").first()),
    burgerAdd: await pageBox(mCard.locator("[data-card-cart]").first()),
  };
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(400);
  await shot("t-creations-page.jpg", { fullPage: true, type: "jpeg", quality: 90 });
  await scrollTo(meta.creations.burgerCard.y - 200);
  {
    const b = await mCard.boundingBox();
    console.error("carte mini burgers avant ajout", b, await scrollY());
    await p.screenshot({ path: file("t-card-burgers.png"), clip: { x: Math.max(0, b.x), y: b.y, width: b.width, height: b.height }, animations: "disabled" });
  }

  // Fiche du Moelleux au chocolat (fenêtre haute pour la capturer en entier)
  await scrollTo(sections.patisseries.y - 20);
  meta.fiche = { scrollY: await scrollY() };
  await gCard.locator("button[aria-haspopup=dialog]").evaluate((e) => e.click());
  await p.waitForTimeout(1100);
  const sheetAt844 = await p.locator("dialog[open]").boundingBox();
  meta.fiche.sheetTop = sheetAt844.y;
  meta.fiche.sheetHeight844 = sheetAt844.height;
  await p.setViewportSize({ width: W, height: 2600 });
  await p.waitForTimeout(700);
  const dlg = p.locator("dialog[open]");
  const atc = dlg.locator("section[aria-labelledby^=atc-]");
  meta.fiche.height = (await dlg.boundingBox()).height;
  meta.fiche.price = await relBox(dlg.locator("ul.text-gold-deep").first(), dlg);
  meta.fiche.title = await relBox(dlg.locator("h2").first(), dlg);
  meta.fiche.addSection = await relBox(atc, dlg);
  meta.fiche.addButton = await relBox(atc.locator("button", { hasText: "Ajouter au panier" }), dlg);
  meta.fiche.stepper = await relBox(atc.locator("div.mt-1\\.5").first(), dlg);
  await dlg.screenshot({ path: file("t-fiche.png"), animations: "disabled" });
  await atc.locator("button", { hasText: "Ajouter au panier" }).click();
  await p.waitForTimeout(800);
  meta.fiche.heightAdded = (await dlg.boundingBox()).height;
  meta.fiche.added = await relBox(atc.locator(".cart-added"), dlg);
  meta.fiche.continue = await relBox(atc.locator("button", { hasText: "Continuer mes achats" }), dlg);
  await dlg.screenshot({ path: file("t-fiche-ajoute.png"), animations: "disabled" });
  await p.setViewportSize({ width: W, height: H });
  await p.waitForTimeout(500);
  await atc.locator("button", { hasText: "Continuer mes achats" }).click();
  await p.waitForTimeout(900);
  await hideFloats(false);
  await p.waitForTimeout(400);
  meta.cartFloat1 = await floatShot("t-cart-float-1.png");

  // Mini burgers : ajout direct depuis la carte (quantité minimale)
  await scrollTo(meta.creations.burgerCard.y - 200);
  meta.burger = { scrollY: await scrollY() };
  await hideFloats(true);
  await mCard.locator("[data-card-cart]").evaluate((e) => e.click());
  await p.waitForTimeout(450);
  await mCard.evaluate((e) => e.scrollIntoView({ block: "center", inline: "nearest" }));
  await p.waitForTimeout(250);
  const mb = await mCard.boundingBox();
  console.error("carte mini burgers après ajout", mb, await scrollY());
  await p.screenshot({ path: file("t-card-burgers-ajoute.png"), clip: { x: Math.max(0, mb.x), y: mb.y, width: mb.width, height: mb.height }, animations: "disabled" });
  await hideFloats(false);
  await p.waitForTimeout(400);
  meta.cartFloat2 = await floatShot("t-cart-float-2.png");
  meta.header = { badge: (await p.locator("header.absolute [data-cart-button]").first().getAttribute("aria-label")) };

  /* ------------------------------- Panier ------------------------------ */
  const cartFloatBtn = async () => p.locator(".cart-float").first();
  await (await cartFloatBtn()).evaluate((e) => e.click());
  await p.waitForTimeout(1000);
  const drawerAt844 = await p.locator("dialog[open]").boundingBox();
  meta.panier = { top844: drawerAt844.y, height844: drawerAt844.height };
  await p.setViewportSize({ width: W, height: 1800 });
  await p.waitForTimeout(700);
  const drawer = p.locator("dialog[open]");
  const rows = drawer.locator("ul > li");
  const rowInfo = async () => {
    const out = [];
    for (let i = 0; i < (await rows.count()); i++) {
      const r = rows.nth(i);
      const btns = await r.locator("button").all();
      const labels = [];
      for (const bt of btns) labels.push({ label: await bt.getAttribute("aria-label"), box: await relBox(bt, drawer) });
      out.push({ box: await relBox(r, drawer), text: (await r.innerText()).replace(/\s+/g, " "), buttons: labels });
    }
    return out;
  };
  const totalRow = drawer.locator("p", { hasText: /Total des produits|Sous-total provisoire/ }).first().locator("xpath=..");
  meta.panier.height = (await drawer.boundingBox()).height;
  meta.panier.rows = await rowInfo();
  meta.panier.total = await relBox(totalRow, drawer);
  meta.panier.totalText = (await totalRow.innerText()).replace(/\s+/g, " ");
  meta.panier.finaliser = await relBox(drawer.locator("a", { hasText: "Finaliser ma commande" }), drawer);
  await drawer.screenshot({ path: file("t-panier-1.png"), animations: "disabled" });
  // + sur le Moelleux au chocolat
  const plus = rows.nth(0).locator("button[aria-label*='ugmenter' i], button[aria-label*='Ajouter' i], button[aria-label*='plus' i]").first();
  meta.panier.plusLabel = await plus.getAttribute("aria-label");
  meta.panier.plus = await relBox(plus, drawer);
  await plus.click();
  await p.waitForTimeout(600);
  meta.panier.rows2 = await rowInfo();
  meta.panier.totalText2 = (await totalRow.innerText()).replace(/\s+/g, " ");
  meta.panier.height2 = (await drawer.boundingBox()).height;
  await drawer.screenshot({ path: file("t-panier-2.png"), animations: "disabled" });
  await p.setViewportSize({ width: W, height: H });
  await p.waitForTimeout(500);

  /* ---------------------------- Commande ------------------------------- */
  await drawer.locator("a", { hasText: "Finaliser ma commande" }).click();
  await p.waitForURL(/\/commande/);
  await p.waitForLoadState("networkidle");
  await settle();
  await hideFloats(true);
  const field = (id) => p.locator("#" + id);
  const submit = p.locator("form button[type=submit]").first();
  const measure = async () => ({
    height: await p.evaluate(() => document.documentElement.scrollHeight),
    recap: await pageBox(p.locator("#recap-titre").locator("xpath=ancestor::section[1]")),
    total: await pageBox(p.locator("p", { hasText: "Total des produits" }).first().locator("xpath=..")),
    infos: await pageBox(p.locator("#commande-form-titre")),
    name: await pageBox(field("co-name")),
    date: await pageBox(field("co-date")),
    mode: await pageBox(p.locator("#co-mode").locator("xpath=..")),
    livraison: await pageBox(p.locator("label", { hasText: "Livraison" }).first()),
    place: (await field("co-place").count()) ? await pageBox(field("co-place")) : null,
    submit: await pageBox(submit),
  });
  meta.commande = { states: [] };
  const fullShot = async (n) => {
    await p.evaluate(() => document.activeElement && document.activeElement.blur());
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(300);
    const m = await measure();
    await shot(n, { fullPage: true, type: "jpeg", quality: 90 });
    meta.commande.states.push({ file: n, ...m });
  };
  await fullShot("t-commande-0.jpg");
  // Saisie du prénom, lettre par lettre (le champ seul)
  const typeCrops = async (id, text, prefix, every = 1) => {
    const el = field(id);
    await el.scrollIntoViewIfNeeded();
    const crops = [];
    await el.click();
    for (let i = 1; i <= text.length; i++) {
      await el.press(text[i - 1] === " " ? "Space" : text[i - 1]);
      if (i % every && i !== text.length) continue;
      await p.waitForTimeout(60);
      const n = `${prefix}-${String(i).padStart(2, "0")}.png`;
      await el.screenshot({ path: file(n), animations: "disabled", caret: "initial" });
      crops.push({ chars: i, file: n });
    }
    return crops;
  };
  meta.commande.nameCrops = await typeCrops("co-name", DEMO.name, "t-nom");
  await field("co-date").fill(DEMO.date);
  await p.evaluate(() => document.activeElement && document.activeElement.blur());
  await p.waitForTimeout(300);
  await field("co-date").screenshot({ path: file("t-date.png"), animations: "disabled" });
  await p.locator("label", { hasText: "Livraison" }).first().click();
  await p.waitForTimeout(400);
  await fullShot("t-commande-1.jpg");
  meta.commande.placeCrops = await typeCrops("co-place", DEMO.place, "t-lieu", 2);
  await fullShot("t-commande-2.jpg");
  await submit.click();
  await p.waitForTimeout(900);
  meta.commande.errors = await p.locator("[id$=-error]").allInnerTexts();
  await fullShot("t-commande-3.jpg");
  const waUrl = await p.evaluate(() => window.__wa || null);
  meta.commande.whatsappUrl = waUrl ? waUrl.split("?")[0] : null;
  meta.commande.message = waUrl ? new URL(waUrl).searchParams.get("text") : null;

  await browser.close();
  meta.capturedAt = new Date().toISOString();
  fs.writeFileSync(META, JSON.stringify(meta, null, 2) + "\n");
  console.log(JSON.stringify({ ...meta, commande: { ...meta.commande, states: meta.commande.states.map((s) => ({ file: s.file, height: s.height, submit: s.submit, place: s.place })) } }, null, 1).slice(0, 9000));
})();
