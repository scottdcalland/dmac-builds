// DMac Builds, static site generator. Node 18+. Run: node build.mjs
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "docs");

/* ------------------------------------------------------------------ */
/* Business facts (all lifted from DMac Builds' Instagram & Facebook)  */
/* ------------------------------------------------------------------ */
const SITE = {
  name: "DMac Builds",
  owner: "Danny Mac",
  tagline: "Quality Built, Trusted Locally",
  strap: "Bricklaying, landscaping & bespoke garden design",
  base: "Platt Bridge, Wigan",
  town: "Wigan",
  email: "dmacbuilds@gmail.com",
  instagram: "https://www.instagram.com/dmacbuilds/",
  facebook: "https://www.facebook.com/61587794803724",
  radius: 20,
  domain: "https://dmacbuilds.co.uk", // used for canonical/OG placeholders
};

const IMG = {
  "work-01": { file: "work/work-01.jpg", alt: "Neatly laid orange facing brickwork with even mortar joints on a DMac Builds project in Wigan", cap: "Facing brickwork" },
  "work-02": { file: "work/work-02.jpg", alt: "New buff brick garden wall and concrete base built against a bungalow with decorative trellis fencing by DMac Builds", cap: "Garden wall & base" },
  "work-03": { file: "work/work-03.jpg", alt: "Cavity wall under construction with a concrete block inner leaf, reclaimed brick outer leaf, insulation and wall ties", cap: "Cavity wall build" },
  "work-04": { file: "work/work-04.jpg", alt: "Bricklayer levelling a new block and brick wall on fresh concrete foundations with a spirit level", cap: "Levelling new blockwork" },
  "work-05": { file: "work/work-05.jpg", alt: "Brick and block side-return wall built between two houses with insulation board as part of an extension by DMac Builds", cap: "Side-return extension" },
  "work-06": { file: "work/work-06.jpg", alt: "Red brick garden pier and boundary wall built by DMac Builds in the Wigan area", cap: "Brick garden pier" },
  "work-07": { file: "work/work-07.jpg", alt: "Concrete strip foundations with steel mesh and a new blockwork pier at the start of a groundworks job", cap: "Strip foundations" },
  "work-08": { file: "work/work-08.jpg", alt: "Danny Mac, founder of DMac Builds, a bricklayer based in Platt Bridge, Wigan", cap: "Danny Mac, DMac Builds" },
  "work-09": { file: "work/work-09.jpg", alt: "Close-up of a trowel pointing fresh mortar along a course of concrete blocks with a string line", cap: "Pointing & bricklaying" },
};
const imgOrder = ["work-02","work-01","work-06","work-03","work-04","work-07","work-05","work-09","work-08"];

// Instagram reels (shortcodes) for embedded video
const REELS = ["DcdLq0ltfNJ","DdHNRC8RKXd","Dc1VjGUIwCy","DdGiAbcSqim","Dc8CfGXxc6U","DcRKhLoNFsh"];

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */
const SERVICES = [
  {
    slug: "bricklaying", name: "Bricklaying", nav: "Bricklaying",
    hero: "work-01", covers: ["work-01","work-09","work-06","work-03"],
    short: "Clean, accurate brick and block work, from garden walls and piers to full structural brickwork.",
    lede: "Bricklaying is the trade DMac Builds is built on. We lay facing brick, block and reclaimed brick to a neat, consistent standard, whether it is a garden wall or the shell of an extension.",
    bullets: [
      "Facing brickwork and blockwork",
      "Garden, boundary and retaining walls",
      "Brick piers, pillars and gate posts",
      "Cavity walls for extensions and new builds",
      "Feature brickwork and arches",
      "Brick repairs and repointing",
    ],
    p1: "Every job starts with a level base and a string line, and it shows in the finish. We work in facing brick, common brick, engineering brick and concrete block, matching existing brickwork where we can so new work sits right alongside the old.",
    p2: "From a single garden wall to the full brick and block shell of an extension, the brickwork is set out properly, kept plumb and pointed cleanly. It is the difference between a wall that looks alright now and one that still looks sharp in ten years.",
  },
  {
    slug: "landscaping", name: "Landscaping", nav: "Landscaping",
    hero: "work-02", covers: ["work-02","work-06","work-04"],
    short: "Patios, paving, walls and fencing that turn a tired garden into somewhere you actually want to be.",
    lede: "Landscaping ties the hard work together, the walls, paving, steps and levels that give a garden its shape. We build gardens that drain properly, sit level and last.",
    bullets: [
      "Patios and Indian stone paving",
      "Block paving and pathways",
      "Garden and retaining walls",
      "Steps, levels and raised beds",
      "Fencing and sleeper edging",
      "Turfing and finishing groundwork",
    ],
    p1: "Good landscaping is mostly what you do not see, the sub-base, the falls for drainage, the foundations under a wall. We get those right first, then lay the paving and build the walls that make the garden usable.",
    p2: "Because we are bricklayers first, the walls, piers and edgings that frame a garden are built to the same standard as the brickwork on a house. The result is a garden that holds together season after season.",
  },
  {
    slug: "bespoke-garden-design", name: "Bespoke Garden Design", nav: "Garden Design",
    hero: "work-02", covers: ["work-02","work-06"],
    short: "Designed and built from scratch, levels, feature walls, patios and planting that work as one space.",
    lede: "A bespoke garden is designed around how you want to use the space, then built by the same team start to finish. No handovers, no guesswork.",
    bullets: [
      "Full garden layouts and levels",
      "Feature and rendered walls",
      "Patios, seating areas and paths",
      "Raised planters and sleeper beds",
      "Integrated steps and edging",
      "Fencing, screening and finishing",
    ],
    p1: "We start with the shape of the plot and what you want from it, a patio that catches the sun, a level lawn, a low wall to sit on. From there the garden is set out so the levels, drainage and hard landscaping all work together.",
    p2: "Everything is built in-house, so the brick, stone and timber all match up on site rather than on a drawing. You get a garden that feels considered and holds its value.",
  },
  {
    slug: "groundworks-and-concrete", name: "Groundworks & Concrete", nav: "Groundworks",
    hero: "work-07", covers: ["work-07","work-04","work-03"],
    short: "Foundations, footings, bases and drainage, the groundwork that everything else stands on.",
    lede: "Groundworks are the part of a build you never see and cannot get wrong. We dig, prepare and pour the foundations, footings and bases that carry the rest of the job.",
    bullets: [
      "Strip and trench-fill foundations",
      "Concrete bases and oversite slabs",
      "Footings for extensions and garages",
      "Drainage and pipe runs",
      "Hardcore, mesh and DPM preparation",
      "Muck-away and site clearance",
    ],
    p1: "We set out and dig footings to the right depth, get the reinforcement and damp-proofing in, and pour concrete to a clean, level finish. Get the ground right and the brickwork above it goes up straight.",
    p2: "Whether it is a base for a garden room, footings for an extension or a slab for a garage, the groundwork is done to spec so building control has no arguments and the structure stands the test of time.",
  },
  {
    slug: "garage-conversions", name: "Garage Conversions", nav: "Garage Conversions",
    hero: "work-05", covers: ["work-05","work-03","work-07"],
    short: "Turn an unused garage into a proper room, sub floors, insulation, blockwork and new externals.",
    lede: "A garage conversion is one of the cheapest ways to add a usable room. We handle the lot, from the sub floor and insulation to the new external walls and making good.",
    bullets: [
      "Insulated sub floors laid and levelled",
      "Blockwork and infill to the old opening",
      "New external walls and vents",
      "Cavity insulation and damp-proofing",
      "Preparation for plastering and fit-out",
      "Matching brickwork to the house",
    ],
    p1: "We start by getting the floor right, vents extended, insulation down, a level sub floor ready for the finish. The old garage door is bricked up and the new brickwork is matched to the house so it does not look like a conversion from the street.",
    p2: "The result is a warm, dry, usable room built on solid ground. It is work we post regularly on our socials, garage sub floor to finished shell.",
  },
  {
    slug: "extensions-and-building", name: "Extensions & Building", nav: "Extensions",
    hero: "work-03", covers: ["work-03","work-05","work-07"],
    short: "Single-storey extensions and structural brick and block work, built from the footings up.",
    lede: "Adding space to a house is brick-and-block work done properly. We build single-storey extensions and structural alterations from the foundations to the finished shell.",
    bullets: [
      "Single-storey rear and side extensions",
      "Structural brick and block walls",
      "Cavity walls, ties and insulation",
      "Lintels, openings and padstones",
      "Foundations and oversite included",
      "Built to your drawings and building control",
    ],
    p1: "We build to your architect's drawings and building control requirements, footings, cavity walls, insulation, lintels and openings, all set out and built to spec. Reclaimed or new brick is matched to the existing house.",
    p2: "Because the same team pours the footings and lays the brick, the extension goes up without the usual gaps between trades. You deal with one builder from the ground up.",
  },
  {
    slug: "renovations", name: "Renovations", nav: "Renovations",
    hero: "work-01", covers: ["work-01","work-06","work-09"],
    short: "Brick repairs, alterations and refurbishment work that brings a tired property back to life.",
    lede: "Renovation work is about making good, repairing, altering and refinishing brickwork and structure so an older property is sound and looks the part again.",
    bullets: [
      "Brick repairs and rebuilding",
      "Repointing and cleaning up brickwork",
      "Structural alterations and openings",
      "Rebuilding walls, piers and boundaries",
      "Making good after other trades",
      "Matching old brick and mortar",
    ],
    p1: "Older brickwork can be brought back with the right repairs, raking out and repointing, cutting out and replacing damaged brick, rebuilding leaning walls on proper foundations. We match mortar colour and joint style so repairs blend in.",
    p2: "Whether you are doing up a property to live in or to sell, tidy, solid brickwork makes the biggest visible difference for the money.",
  },
  {
    slug: "property-maintenance", name: "Property Maintenance", nav: "Maintenance",
    hero: "work-06", covers: ["work-06","work-04","work-01"],
    short: "The smaller brick, block and concrete jobs most builders will not turn up for.",
    lede: "Not every job is a full build. DMac Builds also takes on the smaller brick, block and concrete maintenance work that keeps a property in good order.",
    bullets: [
      "Wall and pier repairs",
      "Repointing and patching brickwork",
      "Small concrete bases and slabs",
      "Garden wall and step repairs",
      "Replacing damaged brick and block",
      "General building maintenance",
    ],
    p1: "A collapsed garden wall, a cracked pier, a bit of brickwork that needs cutting out and replacing, the jobs that are too small for the big firms but still need doing right. We turn up, do it properly and clean up after ourselves.",
    p2: "It is also the best way to try us out on a smaller job before a bigger one. Quality built, trusted locally, whatever the size.",
  },
];

/* ------------------------------------------------------------------ */
/* Areas, within ~20 miles of Wigan                                   */
/* ------------------------------------------------------------------ */
const AREAS = [
  { name: "Wigan", slug: "wigan", note: "our home town" },
  { name: "Platt Bridge", slug: "platt-bridge", note: "where we are based" },
  { name: "Ince-in-Makerfield", slug: "ince-in-makerfield" },
  { name: "Hindley", slug: "hindley" },
  { name: "Abram", slug: "abram" },
  { name: "Ashton-in-Makerfield", slug: "ashton-in-makerfield" },
  { name: "Golborne", slug: "golborne" },
  { name: "Lowton", slug: "lowton" },
  { name: "Leigh", slug: "leigh" },
  { name: "Atherton", slug: "atherton" },
  { name: "Tyldesley", slug: "tyldesley" },
  { name: "Standish", slug: "standish" },
  { name: "Aspull", slug: "aspull" },
  { name: "Orrell", slug: "orrell" },
  { name: "Pemberton", slug: "pemberton" },
  { name: "Billinge", slug: "billinge" },
  { name: "Shevington", slug: "shevington" },
  { name: "Up Holland", slug: "up-holland" },
  { name: "Bryn", slug: "bryn" },
  { name: "Bolton", slug: "bolton" },
  { name: "Horwich", slug: "horwich" },
  { name: "Westhoughton", slug: "westhoughton" },
  { name: "Chorley", slug: "chorley" },
  { name: "St Helens", slug: "st-helens" },
  { name: "Skelmersdale", slug: "skelmersdale" },
  { name: "Ormskirk", slug: "ormskirk" },
  { name: "Newton-le-Willows", slug: "newton-le-willows" },
  { name: "Haydock", slug: "haydock" },
  { name: "Warrington", slug: "warrington" },
];

/* ------------------------------------------------------------------ */
/* Inline SVG icons                                                    */
/* ------------------------------------------------------------------ */
const I = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.2 1 .46 1.4.9.44.4.7.8.9 1.4.17.4.36 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2-.2.6-.46 1-.9 1.4-.4.44-.8.7-1.4.9-.4.17-1 .36-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42-.6-.2-1-.46-1.4-.9-.44-.4-.7-.8-.9-1.4-.17-.4-.36-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.42-2.2.2-.6.46-1 .9-1.4.4-.44.8-.7 1.4-.9.4-.17 1-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.7.07-1.1.05-1.7.24-2.1.4-.5.2-.9.44-1.3.84-.4.4-.64.8-.84 1.3-.16.4-.35 1-.4 2.1C2.6 9.5 2.6 9.9 2.6 12s0 2.5.06 3.7c.05 1.1.24 1.7.4 2.1.2.5.44.9.84 1.3.4.4.8.64 1.3.84.4.16 1 .35 2.1.4 1.2.06 1.6.07 4.7.07s3.5 0 4.7-.07c1.1-.05 1.7-.24 2.1-.4.5-.2.9-.44 1.3-.84.4-.4.64-.8.84-1.3.16-.4.35-1 .4-2.1.06-1.2.07-1.6.07-3.7s0-2.5-.07-3.7c-.05-1.1-.24-1.7-.4-2.1-.2-.5-.44-.9-.84-1.3-.4-.4-.8-.64-1.3-.84-.4-.16-1-.35-2.1-.4C15.5 4 15.1 4 12 4Zm0 3.06A4.94 4.94 0 1 0 16.94 12 4.94 4.94 0 0 0 12 7.06Zm0 8.14A3.2 3.2 0 1 1 15.2 12 3.2 3.2 0 0 1 12 15.2Zm6.3-8.34a1.15 1.15 0 1 1-1.15-1.15 1.15 1.15 0 0 1 1.15 1.15Z"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z"/></svg>',
  tools: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2.4-.6-.6-2.4 2.1-2.1Z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.3 6.9.9-5 4.8 1.2 6.8L12 17.8 5.9 20.8 7.1 14l-5-4.8 6.9-.9L12 2Z"/></svg>',
};

/* ------------------------------------------------------------------ */
/* Template helpers                                                    */
/* ------------------------------------------------------------------ */
const asset = (rel, p) => `${rel}assets/${p}`;
const imgTag = (rel, key, cls = "", loading = "lazy") => {
  const m = IMG[key];
  return `<img src="${asset(rel, "img/" + m.file)}" alt="${m.alt}" loading="${loading}" decoding="async">`.replace("<img", cls ? `<img class="${cls}"` : "<img");
};

function head(rel, { title, desc, canonical, ogimg }) {
  const og = ogimg ? `${SITE.domain}/${asset("", "img/" + IMG[ogimg].file)}` : `${SITE.domain}/assets/img/logo-badge.jpg`;
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#14213a">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${og}">
<meta property="og:site_name" content="${SITE.name}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${asset(rel, "img/logo-badge.jpg")}">
<link rel="apple-touch-icon" href="${asset(rel, "img/logo-badge.jpg")}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${asset(rel, "css/styles.css")}">
</head>`;
}

function header(rel, active = "") {
  const nav = [
    ["Home", `${rel}index.html`, "home"],
    ["Services", `${rel}services.html`, "services"],
    ["Areas", `${rel}areas.html`, "areas"],
    ["Gallery", `${rel}gallery.html`, "gallery"],
    ["About", `${rel}about.html`, "about"],
    ["Contact", `${rel}contact.html`, "contact"],
  ].map(([label, href, key]) => `<a href="${href}"${key === active ? ' class="active"' : ""}>${label}</a>`).join("");
  return `<header class="site-header">
  <div class="wrap bar">
    <a class="brand" href="${rel}index.html" aria-label="DMac Builds home">
      <img class="brand__badge" src="${asset(rel, "img/logo-badge.jpg")}" alt="DMac Builds logo">
      <span class="brand__name"><b>DMAC <i>BUILDS</i></b><span>${SITE.strap.split(",")[0]} &middot; Wigan</span></span>
    </a>
    <nav class="nav" id="primary-nav">${nav}</nav>
    <div class="header-cta"><a class="btn btn-primary" href="${rel}contact.html">Get a free quote</a></div>
    <button class="nav-toggle" aria-label="Menu" aria-controls="primary-nav" aria-expanded="false"><span></span></button>
  </div>
</header>`;
}

function mobileBar(rel) {
  return `<div class="mobile-bar">
  <a class="m-quote" href="${rel}contact.html">${I.mail}<span>Get a free quote</span></a>
  <a class="m-social" href="${SITE.instagram}" target="_blank" rel="noopener">${I.ig}<span>See our work</span></a>
</div>`;
}

function ctaBand(rel, heading = "Start your project the right way", text = "Free, no-obligation quotes across Wigan and within 20 miles. Tell us about the job and we will come and take a look.") {
  return `<section class="cta-band">
  <div class="wrap">
    <div><h2>${heading}</h2><p>${text}</p></div>
    <a class="btn btn-primary btn-lg" href="${rel}contact.html">Get a free quote ${I.arrow}</a>
  </div>
</section>`;
}

function footer(rel) {
  const svc = SERVICES.slice(0, 6).map(s => `<li><a href="${rel}services/${s.slug}.html">${s.name}</a></li>`).join("");
  const areas = AREAS.slice(0, 12).map(a => `<li><a href="${rel}areas/${a.slug}.html">${a.name}</a></li>`).join("");
  return `${ctaBand(rel)}
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <span class="brand__name"><b>DMAC BUILDS</b></span>
        <p>${SITE.strap} in ${SITE.town}. ${SITE.tagline}.</p>
        <div class="footer-social">
          <a href="${SITE.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a>
          <a href="${SITE.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.fb}</a>
          <a href="mailto:${SITE.email}" aria-label="Email">${I.mail}</a>
        </div>
      </div>
      <div><h4>Services</h4><ul class="footer-nav">${svc}<li><a href="${rel}services.html">All services</a></li></ul></div>
      <div><h4>Areas covered</h4><ul class="footer-areas">${areas}</ul><p style="margin-top:10px"><a href="${rel}areas.html">See all areas &rarr;</a></p></div>
      <div>
        <h4>Get in touch</h4>
        <ul class="footer-nav">
          <li>${I.pin} ${SITE.base}</li>
          <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
          <li><a href="${rel}contact.html">Request a free quote</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; ${new Date().getFullYear()} DMac Builds. ${SITE.tagline}.</span>
      <span>Bricklaying &middot; Landscaping &middot; Groundworks &middot; ${SITE.town}</span>
    </div>
  </div>
</footer>
<div class="lb" id="lightbox"><button class="lb__close" aria-label="Close">&times;</button><img src="" alt=""></div>
${mobileBar(rel)}
<script src="${asset(rel, "js/main.js")}" defer></script>
</body></html>`;
}

function schema(rel, extra = {}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "name": SITE.name,
    "image": `${SITE.domain}/assets/img/logo-badge.jpg`,
    "description": `${SITE.strap} in ${SITE.town} and within ${SITE.radius} miles. ${SITE.tagline}.`,
    "email": SITE.email,
    "founder": { "@type": "Person", "name": SITE.owner },
    "areaServed": AREAS.map(a => ({ "@type": "City", "name": a.name })),
    "address": { "@type": "PostalAddress", "addressLocality": "Platt Bridge", "addressRegion": "Wigan", "addressCountry": "GB" },
    "knowsAbout": SERVICES.map(s => s.name),
    "sameAs": [SITE.instagram, SITE.facebook],
    "slogan": SITE.tagline,
    ...extra,
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

/* ------------------------------------------------------------------ */
/* Components                                                          */
/* ------------------------------------------------------------------ */
function serviceCard(rel, s) {
  return `<article class="card">
  <a class="card__media" href="${rel}services/${s.slug}.html">${imgTag(rel, s.hero)}<span class="card__tag">${s.nav}</span></a>
  <div class="card__body">
    <h3>${s.name}</h3>
    <p>${s.short}</p>
    <a class="card__link" href="${rel}services/${s.slug}.html">Learn more ${I.arrow}</a>
  </div>
</article>`;
}

function galleryGrid(rel, keys, masonry = true) {
  return `<div class="gallery${masonry ? " masonry" : ""}">
  ${keys.map(k => `<figure data-lightbox data-full="${asset(rel, "img/" + IMG[k].file)}">${imgTag(rel, k)}<figcaption>${IMG[k].cap}</figcaption></figure>`).join("\n  ")}
</div>`;
}

function reelsGrid(count = 6) {
  return `<div class="reels">
  ${REELS.slice(0, count).map(code => `<div class="reel"><iframe src="https://www.instagram.com/reel/${code}/embed/" loading="lazy" scrolling="no" allowtransparency="true" allow="encrypted-media" title="DMac Builds video"></iframe></div>`).join("\n  ")}
</div>`;
}

function areaLinks(rel, list = AREAS) {
  return `<ul class="area-list">${list.map(a => `<li><a href="${rel}areas/${a.slug}.html">${a.name}</a></li>`).join("")}</ul>`;
}

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */
function pageHome() {
  const rel = "";
  return head(rel, {
    title: "DMac Builds | Bricklayer, Landscaper & Groundworks in Wigan",
    desc: "DMac Builds is a Wigan bricklayer specialising in bricklaying, landscaping and bespoke garden design, plus groundworks, concrete, garage conversions and extensions. Free quotes within 20 miles.",
    canonical: `${SITE.domain}/`,
    ogimg: "work-02",
  }) + `<body>
${header(rel, "home")}
<section class="hero">
  <div class="hero__media">${imgTag(rel, "work-02", "", "eager")}</div>
  <div class="wrap hero__inner">
    <div class="hero__grid">
      <div>
        <span class="eyebrow hero__eyebrow">Bricklaying &middot; Landscaping &middot; Groundworks</span>
        <h1>Built <em>brick by brick</em> in Wigan</h1>
        <p class="hero__sub">DMac Builds is a Wigan-based building firm specialising in bricklaying, landscaping and bespoke garden design. ${SITE.tagline}.</p>
        <div class="hero__cta">
          <a class="btn btn-primary btn-lg" href="${rel}contact.html">Get a free quote ${I.arrow}</a>
          <a class="btn btn-outline-light btn-lg" href="${rel}gallery.html">See our work</a>
        </div>
        <ul class="hero__trust">
          <li>${I.pin} Based in ${SITE.base}</li>
          <li>${I.check} Free, no-obligation quotes</li>
          <li>${I.check} Covering 20 miles of Wigan</li>
        </ul>
      </div>
      <aside class="hero__card">
        <h3>Free consultation</h3>
        <p>Tell us about the job and we will come and take a look.</p>
        <ul class="quote-list">
          <li>${I.check} Bricklaying &amp; garden walls</li>
          <li>${I.check} Patios, paving &amp; landscaping</li>
          <li>${I.check} Foundations &amp; groundworks</li>
          <li>${I.check} Extensions &amp; garage conversions</li>
        </ul>
        <a class="btn btn-primary btn-block" href="${rel}contact.html">Request your free quote</a>
      </aside>
    </div>
  </div>
</section>

<div class="trustbar">
  <div class="wrap">
    <span class="item">${I.tools} Skilled brick &amp; block work</span>
    <span class="item">${I.shield} Quality built, trusted locally</span>
    <span class="item">${I.pin} Wigan &amp; within 20 miles</span>
    <span class="item">${I.star} Follow the work on Instagram</span>
  </div>
</div>

<section class="section">
  <div class="wrap">
    <div class="section-head center">
      <span class="eyebrow">What we do</span>
      <h2>Building services across Wigan</h2>
      <p class="lead">From a single garden wall to a full extension, every job is set out properly and finished to a standard we are happy to put our name to.</p>
    </div>
    <div class="grid cols-4">${SERVICES.map(s => serviceCard(rel, s)).join("")}</div>
  </div>
</section>

<section class="section section--paper2">
  <div class="wrap">
    <div class="split">
      <div class="split__media">${imgTag(rel, "work-08")}<span class="badge-note">Brick by brick</span></div>
      <div>
        <span class="eyebrow">Who we are</span>
        <h2>A local builder who turns up and does it right</h2>
        <p>DMac Builds is run by ${SITE.owner}, a bricklayer based in ${SITE.base}. What started on the tools has grown into a firm that takes on bricklaying, landscaping, groundworks and extensions across the Wigan area.</p>
        <ul class="ticks">
          <li>${I.check}<span><b>A proper trade background.</b> Bricklayers first, so the brick and block work is clean, level and built to last.</span></li>
          <li>${I.check}<span><b>One team, start to finish.</b> Footings to finished shell, without the gaps between trades.</span></li>
          <li>${I.check}<span><b>Local and accountable.</b> We work on our own doorstep, so our reputation travels with us.</span></li>
        </ul>
        <a class="btn btn-navy" href="${rel}about.html">More about DMac Builds ${I.arrow}</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head center"><span class="eyebrow">Why DMac Builds</span><h2>Straight talking, solid work</h2></div>
    <div class="usp">
      <div class="usp__item"><div class="n">01</div><h4>Quality built</h4><p>Set out with a level and string line and finished cleanly. It is the standard we post online every week.</p></div>
      <div class="usp__item"><div class="n">02</div><h4>Trusted locally</h4><p>Based in Platt Bridge and working across Wigan, our name is on every job we do.</p></div>
      <div class="usp__item"><div class="n">03</div><h4>One point of contact</h4><p>You deal with the builder doing the work, not a call centre or a chain of subbies.</p></div>
      <div class="usp__item"><div class="n">04</div><h4>Free quotes</h4><p>We come out, look at the job and give you an honest price with no pressure.</p></div>
    </div>
  </div>
</section>

<section class="section section--navy">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow" style="color:#ffd9c2">Recent work</span><h2>See the graft for yourself</h2><p class="lead" style="color:#cdd6e6">Straight off our Instagram and Facebook, real jobs across the Wigan area, from footings to finished brickwork.</p></div>
    ${galleryGrid(rel, ["work-02","work-01","work-06","work-03","work-04","work-07"])}
    <div style="margin-top:26px"><a class="btn btn-outline-light" href="${rel}gallery.html">View the full gallery ${I.arrow}</a></div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head center"><span class="eyebrow">On video</span><h2>Jobs in progress</h2><p class="lead">A few recent reels from site. Tap to watch on Instagram.</p></div>
    ${reelsGrid(3)}
  </div>
</section>

<section class="section section--paper2">
  <div class="wrap">
    <div class="section-head center"><span class="eyebrow">Where we work</span><h2>Covering Wigan and 20 miles around</h2></div>
    <div class="areas-layout">
      ${areaLinks(rel)}
      <div class="area-panel">
        <h3>Not sure if we cover you?</h3>
        <p>We are based in ${SITE.base} and take on work right across the Wigan borough and the towns around it, roughly ${SITE.radius} miles in every direction.</p>
        <div class="pin">${I.pin}<span>If your town is not listed, ask anyway. If it is close, we will come and quote.</span></div>
        <div style="margin-top:22px"><a class="btn btn-primary btn-block" href="${rel}contact.html">Check your area</a></div>
      </div>
    </div>
  </div>
</section>
${footer(rel)}`;
}

function pageServicesIndex() {
  const rel = "";
  return head(rel, {
    title: "Our Services | Bricklaying, Landscaping & Groundworks | DMac Builds",
    desc: "The full range of building services from DMac Builds in Wigan: bricklaying, landscaping, bespoke garden design, groundworks, garage conversions, extensions, renovations and maintenance.",
    canonical: `${SITE.domain}/services.html`,
  }) + `<body>
${header(rel, "services")}
<section class="page-hero">
  <div class="page-hero__media">${imgTag(rel, "work-03", "", "eager")}</div>
  <div class="wrap page-hero__inner">
    <span class="eyebrow hero__eyebrow">What we do</span>
    <h1>Building services in <em>Wigan</em></h1>
    <p>Bricklaying is our trade, but DMac Builds takes on the full range of brick, block, concrete and landscaping work across the Wigan area.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="grid cols-3">${SERVICES.map(s => serviceCard(rel, s)).join("")}</div>
  </div>
</section>
${footer(rel)}`;
}

function pageService(s) {
  const rel = "../";
  const others = SERVICES.filter(x => x.slug !== s.slug).slice(0, 3);
  return head(rel, {
    title: `${s.name} in Wigan | DMac Builds`,
    desc: `${s.short} DMac Builds provides ${s.name.toLowerCase()} across Wigan and within 20 miles. Free quotes. ${SITE.tagline}.`,
    canonical: `${SITE.domain}/services/${s.slug}.html`,
    ogimg: s.hero,
  }) + `<body>
${header(rel, "services")}
<section class="page-hero">
  <div class="page-hero__media">${imgTag(rel, s.hero, "", "eager")}</div>
  <div class="wrap page-hero__inner">
    <span class="eyebrow hero__eyebrow">Services</span>
    <h1>${s.name} <em>in Wigan</em></h1>
    <p>${s.lede}</p>
  </div>
</section>
<div class="crumb"><div class="wrap"><a href="${rel}index.html">Home</a> / <a href="${rel}services.html">Services</a> / <span>${s.name}</span></div></div>
<section class="section">
  <div class="wrap">
    <div class="split">
      <div class="prose">
        <span class="eyebrow">What's involved</span>
        <h2>${s.name} done properly</h2>
        <p>${s.p1}</p>
        <p>${s.p2}</p>
        <h3>What we take on</h3>
        <ul class="bullets">${s.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
        <div style="margin-top:8px"><a class="btn btn-primary" href="${rel}contact.html">Get a quote for ${s.name.toLowerCase()} ${I.arrow}</a></div>
      </div>
      <div>
        <div class="split__media" style="margin-bottom:14px">${imgTag(rel, s.covers[1] || s.hero)}</div>
        ${galleryGrid(rel, s.covers.slice(0, 4), false)}
      </div>
    </div>
  </div>
</section>
<section class="section section--paper2 section--tight">
  <div class="wrap">
    <div class="section-head center"><span class="eyebrow">Also from DMac Builds</span><h2>Other services</h2></div>
    <div class="grid cols-3">${others.map(o => serviceCard(rel, o)).join("")}</div>
  </div>
</section>
${footer(rel)}`;
}

function pageAreasIndex() {
  const rel = "";
  return head(rel, {
    title: "Areas We Cover | Wigan & Within 20 Miles | DMac Builds",
    desc: "DMac Builds covers Wigan and the towns within 20 miles, including Leigh, Bolton, St Helens, Warrington, Chorley, Ormskirk, Skelmersdale and more. Bricklaying, landscaping and groundworks.",
    canonical: `${SITE.domain}/areas.html`,
  }) + `<body>
${header(rel, "areas")}
<section class="page-hero">
  <div class="page-hero__media">${imgTag(rel, "work-06", "", "eager")}</div>
  <div class="wrap page-hero__inner">
    <span class="eyebrow hero__eyebrow">Where we work</span>
    <h1>Areas we <em>cover</em></h1>
    <p>Based in ${SITE.base}, DMac Builds works across the Wigan borough and the towns within roughly ${SITE.radius} miles. Pick your town for local details.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="areas-layout">
      ${areaLinks(rel)}
      <div class="area-panel">
        <h3>Local to you</h3>
        <p>We keep our work close to home, so you get a builder who knows the area and can call round to quote without a big travel charge.</p>
        <div class="pin">${I.pin}<span>${SITE.base} &middot; covering ${SITE.radius} miles of Wigan</span></div>
        <div style="margin-top:22px"><a class="btn btn-primary btn-block" href="${rel}contact.html">Get a free quote</a></div>
      </div>
    </div>
  </div>
</section>
${footer(rel)}`;
}

function pageArea(a, idx) {
  const rel = "../";
  const nearby = AREAS.filter(x => x.slug !== a.slug).slice(idx % 6, (idx % 6) + 5);
  const near = nearby.length ? nearby : AREAS.filter(x => x.slug !== a.slug).slice(0, 5);
  const intros = [
    `Looking for a reliable builder in ${a.name}? DMac Builds provides bricklaying, landscaping and groundworks in ${a.name} and the surrounding area, working out of nearby ${SITE.base}.`,
    `DMac Builds is a Wigan building firm covering ${a.name}. From garden walls and patios to foundations and extensions, we bring proper brick-and-block work to ${a.name} homes.`,
    `Need brickwork, landscaping or groundworks in ${a.name}? We are a local, Wigan-based team and ${a.name} is well within the 20 miles we cover from ${SITE.base}.`,
  ];
  const intro = a.note ? `DMac Builds is a building firm ${a.note === "where we are based" ? "based right here in" : "covering"} ${a.name}${a.note === "our home town" ? ", our home town" : ""}. We take on bricklaying, landscaping and groundworks across ${a.name} and the wider Wigan area.` : intros[idx % intros.length];
  const locLabel = a.slug === "wigan" ? "Wigan" : (a.slug === "platt-bridge" ? "Platt Bridge, Wigan" : `${a.name}, near Wigan`);
  return head(rel, {
    title: `Builder in ${a.name} | Bricklaying, Landscaping & Groundworks | DMac Builds`,
    desc: `Local builder covering ${a.name}. DMac Builds provides bricklaying, garden walls, patios, foundations, extensions and garage conversions in ${a.name} and around Wigan. Free quotes.`,
    canonical: `${SITE.domain}/areas/${a.slug}.html`,
    ogimg: "work-02",
  }) + `<body>
${header(rel, "areas")}
<section class="page-hero">
  <div class="page-hero__media">${imgTag(rel, imgOrder[idx % imgOrder.length], "", "eager")}</div>
  <div class="wrap page-hero__inner">
    <span class="eyebrow hero__eyebrow">${I.pin} ${locLabel}</span>
    <h1>Builder in <em>${a.name}</em></h1>
    <p>${intro}</p>
  </div>
</section>
<div class="crumb"><div class="wrap"><a href="${rel}index.html">Home</a> / <a href="${rel}areas.html">Areas</a> / <span>${a.name}</span></div></div>
<section class="section">
  <div class="wrap">
    <div class="split">
      <div class="prose">
        <span class="eyebrow">Our services in ${a.name}</span>
        <h2>Brick, block, garden &amp; groundwork in ${a.name}</h2>
        <p>Whatever the job in ${a.name}, it is done by the same team from start to finish. As bricklayers by trade, the walls, piers and paving we build are set out properly and finished to last.</p>
        <ul class="bullets">
          ${SERVICES.map(s => `<li><a href="${rel}services/${s.slug}.html">${s.name}</a> in ${a.name}</li>`).join("")}
        </ul>
        <p>Being local to ${a.name} means we can call round quickly to take a look and give you a straight, no-obligation price.</p>
        <div style="margin-top:8px"><a class="btn btn-primary" href="${rel}contact.html">Get a free quote in ${a.name} ${I.arrow}</a></div>
      </div>
      <div>
        <div class="split__media" style="margin-bottom:16px">${imgTag(rel, imgOrder[(idx + 3) % imgOrder.length])}<span class="badge-note">${SITE.tagline}</span></div>
        <div class="area-panel">
          <h3>Nearby towns</h3>
          <ul class="area-list" style="columns:1">${near.map(n => `<li><a href="${rel}areas/${n.slug}.html" style="color:#cdd6e6;border-color:rgba(255,255,255,.14)">${n.name}</a></li>`).join("")}</ul>
        </div>
      </div>
    </div>
  </div>
</section>
${footer(rel)}`;
}

function pageGallery() {
  const rel = "";
  return head(rel, {
    title: "Gallery | Recent Bricklaying & Landscaping Jobs | DMac Builds",
    desc: "Photos and videos of recent DMac Builds jobs around Wigan: brickwork, garden walls, patios, foundations, extensions and garage conversions.",
    canonical: `${SITE.domain}/gallery.html`,
    ogimg: "work-01",
  }) + `<body>
${header(rel, "gallery")}
<section class="page-hero">
  <div class="page-hero__media">${imgTag(rel, "work-01", "", "eager")}</div>
  <div class="wrap page-hero__inner">
    <span class="eyebrow hero__eyebrow">Our work</span>
    <h1>Recent <em>jobs</em></h1>
    <p>Straight from our Instagram and Facebook. Real jobs across the Wigan area, from footings and brickwork to finished garden walls. Tap any photo to enlarge.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Photos</span><h2>On the tools</h2></div>
    ${galleryGrid(rel, imgOrder)}
  </div>
</section>
<section class="section section--navy">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow" style="color:#ffd9c2">Video</span><h2>Jobs in progress</h2><p class="lead" style="color:#cdd6e6">Recent reels from site. Tap to watch on Instagram.</p></div>
    ${reelsGrid(6)}
  </div>
</section>
${footer(rel)}`;
}

function pageAbout() {
  const rel = "";
  return head(rel, {
    title: "About DMac Builds | Wigan Builder & Bricklayer",
    desc: "DMac Builds is run by Danny Mac, a bricklayer based in Platt Bridge, Wigan, specialising in bricklaying, landscaping and bespoke garden design across the Wigan area.",
    canonical: `${SITE.domain}/about.html`,
    ogimg: "work-08",
  }) + `<body>
${header(rel, "about")}
<section class="page-hero">
  <div class="page-hero__media">${imgTag(rel, "work-07", "", "eager")}</div>
  <div class="wrap page-hero__inner">
    <span class="eyebrow hero__eyebrow">About us</span>
    <h1>Quality built, <em>trusted locally</em></h1>
    <p>A Wigan building firm with a bricklayer's eye for a clean, level, lasting finish.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="split">
      <div class="split__media">${imgTag(rel, "work-08")}<span class="badge-note">${SITE.owner}</span></div>
      <div class="prose">
        <span class="eyebrow">The firm</span>
        <h2>Building brick by brick in Wigan</h2>
        <p>DMac Builds is run by ${SITE.owner}, a bricklayer based in ${SITE.base}. It is a hands-on firm that has grown from bricklaying into landscaping, groundworks, garage conversions and extensions across the Wigan area.</p>
        <p>The approach is simple. Turn up when we say, set the job out properly, and finish it to a standard worth photographing. That is why the work goes up on Instagram and Facebook most weeks, footings to finished brickwork.</p>
        <p>Because we are bricklayers by trade, the structural side is second nature. Walls go up plumb and level, foundations are dug to the right depth, and new brickwork is matched to the old so it looks like it was always there.</p>
        <ul class="ticks">
          <li>${I.check}<span><b>Specialists in bricklaying, landscaping and bespoke garden design.</b></span></li>
          <li>${I.check}<span><b>Based in ${SITE.base}, covering ${SITE.radius} miles of Wigan.</b></span></li>
          <li>${I.check}<span><b>Free, no-obligation quotes on every job.</b></span></li>
        </ul>
        <a class="btn btn-primary" href="${rel}contact.html">Get a free quote ${I.arrow}</a>
      </div>
    </div>
  </div>
</section>
<section class="section section--paper2">
  <div class="wrap">
    <div class="section-head center"><span class="eyebrow">How we work</span><h2>From first look to finished job</h2></div>
    <div class="usp">
      <div class="usp__item"><div class="n">01</div><h4>Free quote</h4><p>We come out, look at the job and give you an honest, written price.</p></div>
      <div class="usp__item"><div class="n">02</div><h4>Set out right</h4><p>Levels, string lines and foundations sorted before a brick is laid.</p></div>
      <div class="usp__item"><div class="n">03</div><h4>Built to last</h4><p>Clean brick and block work, pointed and finished properly.</p></div>
      <div class="usp__item"><div class="n">04</div><h4>Left tidy</h4><p>Site cleared and cleaned up, ready for you to enjoy.</p></div>
    </div>
  </div>
</section>
${footer(rel)}`;
}

function pageContact() {
  const rel = "";
  return head(rel, {
    title: "Contact DMac Builds | Free Quotes in Wigan",
    desc: "Get a free, no-obligation quote from DMac Builds. Email dmacbuilds@gmail.com or send an enquiry. Bricklaying, landscaping and groundworks across Wigan and within 20 miles.",
    canonical: `${SITE.domain}/contact.html`,
  }) + `<body>
${header(rel, "contact")}
<section class="page-hero">
  <div class="page-hero__media">${imgTag(rel, "work-04", "", "eager")}</div>
  <div class="wrap page-hero__inner">
    <span class="eyebrow hero__eyebrow">Get in touch</span>
    <h1>Get a <em>free quote</em></h1>
    <p>Tell us about the job and we will come and take a look. No pressure, no obligation.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="contact-layout">
      <div>
        <div class="section-head"><span class="eyebrow">Enquiry</span><h2>Tell us about the job</h2></div>
        <form class="form" id="enquiry-form" novalidate>
          <div class="field"><label for="name">Your name</label><input id="name" name="name" type="text" autocomplete="name" required></div>
          <div class="grid cols-2" style="gap:0 18px">
            <div class="field"><label for="phone">Phone</label><input id="phone" name="phone" type="tel" autocomplete="tel"></div>
            <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required></div>
          </div>
          <div class="grid cols-2" style="gap:0 18px">
            <div class="field"><label for="service">Service</label>
              <select id="service" name="service">
                <option value="">Choose a service</option>
                ${SERVICES.map(s => `<option>${s.name}</option>`).join("")}
                <option>Something else</option>
              </select>
            </div>
            <div class="field"><label for="area">Your town</label><input id="area" name="area" type="text" placeholder="e.g. ${SITE.town}"></div>
          </div>
          <div class="field"><label for="message">Details of the job</label><textarea id="message" name="message" placeholder="What you would like doing, rough size, and when you are hoping to start."></textarea></div>
          <button class="btn btn-primary btn-lg btn-block" type="submit">Send enquiry ${I.arrow}</button>
          <p class="note">This opens an email to ${SITE.email} with your details ready to send.</p>
          <p class="note" id="form-ok" hidden style="color:var(--orange-700);font-weight:600">Thanks, your email should now be open. If not, email us directly at ${SITE.email}.</p>
        </form>
      </div>
      <div>
        <div class="section-head"><span class="eyebrow">Direct</span><h2>Prefer to reach out yourself?</h2></div>
        <div class="contact-cards">
          <div class="cc">${I.mail}<div><h4>Email</h4><p><a href="mailto:${SITE.email}">${SITE.email}</a></p></div></div>
          <div class="cc">${I.ig}<div><h4>Instagram</h4><p><a href="${SITE.instagram}" target="_blank" rel="noopener">@dmacbuilds</a>, message us and see the latest jobs</p></div></div>
          <div class="cc">${I.fb}<div><h4>Facebook</h4><p><a href="${SITE.facebook}" target="_blank" rel="noopener">DMac Builds</a>, follow the work and get in touch</p></div></div>
          <div class="cc">${I.pin}<div><h4>Based in</h4><p>${SITE.base}<br>Covering Wigan and ${SITE.radius} miles around</p></div></div>
        </div>
      </div>
    </div>
  </div>
</section>
${footer(rel)}`;
}

function page404() {
  const rel = "";
  return head(rel, { title: "Page not found | DMac Builds", desc: "That page could not be found.", canonical: `${SITE.domain}/404.html` }) + `<body>
${header(rel)}
<section class="section" style="text-align:center;padding:120px 0">
  <div class="wrap">
    <span class="eyebrow" style="justify-content:center">Error 404</span>
    <h1>That page has been bricked up</h1>
    <p class="lead" style="max-width:520px;margin:12px auto 26px">We could not find the page you were after. Let's get you back on solid ground.</p>
    <a class="btn btn-primary btn-lg" href="${rel}index.html">Back to home ${I.arrow}</a>
  </div>
</section>
${footer(rel)}`;
}

/* ------------------------------------------------------------------ */
/* Write everything                                                    */
/* ------------------------------------------------------------------ */
function inject(html, rel) { return html.replace("</head>", schema(rel) + "\n</head>"); }

async function write(file, html) {
  const full = path.join(OUT, file);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, html, "utf8");
  return file;
}

async function run() {
  const written = [];
  written.push(await write("index.html", inject(pageHome(), "")));
  written.push(await write("services.html", inject(pageServicesIndex(), "")));
  written.push(await write("areas.html", inject(pageAreasIndex(), "")));
  written.push(await write("gallery.html", inject(pageGallery(), "")));
  written.push(await write("about.html", inject(pageAbout(), "")));
  written.push(await write("contact.html", inject(pageContact(), "")));
  written.push(await write("404.html", inject(page404(), "")));
  for (const s of SERVICES) written.push(await write(`services/${s.slug}.html`, inject(pageService(s), "../")));
  for (let i = 0; i < AREAS.length; i++) written.push(await write(`areas/${AREAS[i].slug}.html`, inject(pageArea(AREAS[i], i), "../")));

  // sitemap + robots
  const urls = [
    "", "services.html", "areas.html", "gallery.html", "about.html", "contact.html",
    ...SERVICES.map(s => `services/${s.slug}.html`),
    ...AREAS.map(a => `areas/${a.slug}.html`),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE.domain}/${u}</loc><changefreq>monthly</changefreq></url>`).join("\n")}
</urlset>`;
  await write("sitemap.xml", sitemap);
  await write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE.domain}/sitemap.xml\n`);
  // Cloudflare Pages / Netlify friendly 200 fallback not needed for static

  console.log(`Built ${written.length} pages + sitemap + robots into /site`);
  console.log(written.join("\n"));
}

run().catch(e => { console.error(e); process.exit(1); });
