# Vendor Solution Module: AI Build Instructions (gorgeous edition)

You are building a **solution module** for the WinTech Vendor Sub-Sites engine. It is not a full website. It is a self-contained block of HTML that gets injected into the middle of a partner's existing web page: the partner's header sits above it, the partner's footer and contact section sit below it, and your module fills the white space in between. It must look stunning on its own and never interfere with the partner's site around it.

Read every rule before writing a line. The rules in Part 1 are non-negotiable: break one and the engine breaks. Part 2 is where you push the design to the limit.

> ## 🚫 ABSOLUTE RULE: NEVER use em-dashes
> Never use an em-dash (`—`) anywhere: not in copy, headings, alt text, or comments. Do not use double hyphens (`--`) as a substitute. Use a comma, colon, period, or parentheses and rewrite so it reads naturally. En-dashes in numeric ranges (`9-5`) are fine.

---

# PART 1: The hard rules (the engine depends on these)

## 1. Output a FRAGMENT, never a full page

No `<!DOCTYPE>`, no `<html>`, no `<head>`, no `<body>`. The module is injected with `innerHTML`, so those tags are thrown away. Your file has exactly three parts, in this order:

```html
<style>
  /* ALL css, every selector scoped (see rule 2) */
</style>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<div class="vendorname-mod">
  <!-- ALL content lives here -->
</div>
```

Replace `vendorname` with the real vendor (`eset-mod`, `barracuda-mod`, `ninjio-mod`).

## 2. Scope EVERY style under your module class (critical)

Unscoped CSS leaks out and breaks the partner's site, and the partner's CSS leaks in and breaks yours. So:

- Every selector starts with your module class: `.eset-mod h1`, `.eset-mod .card`. Never bare `h1`, `p`, or `.card`.
- **Keyframe names are global. Prefix them too** so they cannot collide with the partner page: `@keyframes eset-rise`, not `@keyframes rise`.
- **Reset inherited styles on the wrapper** so the partner's body font, color, and line-height cannot bleed in:

```css
.eset-mod { font-family: 'Inter', -apple-system, system-ui, sans-serif; color: #1a1a2e; line-height: 1.6; text-align: left; }
.eset-mod * { margin: 0; padding: 0; box-sizing: border-box; }
```

## 3. No JavaScript

`<script>` tags injected with `innerHTML` do not run, and the server injects its own analytics. So write zero JavaScript. Every interaction is CSS only (see Part 2 for the toolkit). Animated number counters are the one thing you cannot do, so use static numbers.

## 4. Build embed-safe layout (this is what separates a pro module from a broken one)

Your module lives inside someone else's column, not a full browser window. So:

- **No `position: fixed`.** It anchors to the visitor's viewport, not your module, and will float over the partner's page. Use `position: relative` or `absolute` inside a `relative` parent.
- **No `100vw` full-bleed tricks.** `100vw` is the whole browser width and will burst out of the partner's container and cause sideways scroll. Control width with a centered wrap instead:

```css
.eset-mod .wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
```

- **Be careful with `position: sticky`.** It sticks within the partner's scroll context and usually looks wrong. Avoid it unless you have tested it.
- **Full-width color bands:** make a section stretch edge to edge by giving the section full width and putting a `.wrap` inside it, not by using `100vw`.
- **Heights:** use `min-height` with padding, not fixed `vh` heights that assume you own the screen. A hero can use `min-height: clamp(420px, 60vh, 640px)`.

## 5. No chrome, no contact info, no vendor links

The partner supplies all of that. So the module must contain:

- No nav bar, no header, no footer.
- No partner names (the module does not know which partner shows it).
- No phone numbers, emails, or addresses.
- No "About Us" or "Why Choose Us" (that is the partner's section).
- No links to the vendor's own website.

## 6. Every CTA points to `#partner-contact` and carries `data-cta`

CTAs scroll the visitor down to the partner's contact section. They never link to the vendor.

```html
<a class="btn btn-primary" href="#partner-contact" data-cta="hero_cta">Get Your Free Assessment</a>
<a class="btn btn-ghost"   href="#tech"            data-cta="mid_cta">See How It Works</a>
```

Use `hero_cta`, `mid_cta`, `bottom_cta` for the `data-cta` value. Button copy must drive action without naming who to contact. Good: "Schedule a Security Review", "Talk to an Expert", "Get Protected Today". Bad: "Contact ESET", "Call Us", "Buy Now".

## 7. Host every image locally, prefer inline SVG for icons

- Images live in the `images/` folder next to `page.html`. Reference them relatively: `<img src="images/hero.jpg" alt="...">` or `url('images/hero.jpg')` in CSS.
- **Never use an external image URL** (no Unsplash, no CDN). Hero images: 1400px wide minimum, JPG, under 200KB.
- Icons: inline SVG, 24x24 viewBox, stroke based, using the vendor's brand colors. No emoji as icons (emoji is acceptable only in an awards row).

## 8. Give the portal what it needs to list the page

The catalog scans your file for two things, so always include them once near the top:

- Exactly **one `<h1>`** (becomes the catalog title).
- One element with the class **`eyebrow`** (becomes the catalog eyebrow label).

## 9. Keep the page focused so personalization works

The engine can rewrite your visible copy per partner to match their brand voice. It only changes text between tags, never structure. To stay friendly to that step:

- Put every fact in real text (between tags), not in attributes.
- Write clean, confident, neutral base copy. The partner voice is layered on later.
- Do not pad the page to enormous length. A tight, rich page personalizes cleanly; an oversized one may skip personalization and just render as written (still fine, just not voiced).

---

# PART 2: Push the design to the limit

All of the following is CSS only and safe inside an embedded, scoped, no-JS module. Use it boldly. The goal is a page that looks like a flagship product launch, not a brochure.

## Brand system

Use the vendor's real brand colors, hardcoded. White (`#ffffff`) is always the base. Dark sections use the vendor's primary color. You may define colors as scoped custom properties on the wrapper (this is safe because it cannot leak past `.eset-mod`):

```css
.eset-mod {
  --brand: #00a4e4;        /* ESET blue */
  --brand-deep: #0d2137;
  --ink: #1a1a2e;
  --muted: #5b6472;
}
.eset-mod .btn-primary { background: var(--brand); }
```

## Typography that carries the page

Load Inter (weights 400 to 900). Use a strong scale and tight hero leading:

| Element | Size | Weight |
|---|---|---|
| Hero headline | clamp(34px, 5vw, 52px) | 900 |
| Section title | clamp(26px, 3.5vw, 34px) | 800 |
| Card title | 17px | 700 |
| Body | 15px to 17px | 400 |
| Eyebrow | 12px | 700, uppercase, letter-spacing 2px |

Reach for `text-wrap: balance` on headlines and `clamp()` for fluid sizing.

## The gorgeous toolkit (all CSS only, all embed-safe)

**Scroll-driven reveals** (modern, no JS, remember to prefix the keyframe):
```css
@keyframes eset-rise { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
.eset-mod .reveal { animation: eset-rise linear both; animation-timeline: view(); animation-range: entry 0% entry 35%; }
```

**Mesh gradient hero background** (no image needed, looks premium):
```css
.eset-mod .hero {
  background-color: #0d2137;
  background-image:
    radial-gradient(at 18% 20%, rgba(0,164,228,0.45) 0%, transparent 50%),
    radial-gradient(at 82% 12%, rgba(0,164,228,0.25) 0%, transparent 45%),
    radial-gradient(at 60% 85%, rgba(13,33,55,0.9) 0%, transparent 50%);
}
```

**Glass cards on dark sections:**
```css
.eset-mod .glass { background: rgba(255,255,255,0.07); backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); border: 1px solid rgba(255,255,255,0.12); border-radius: 18px; }
```

**Gradient text for one hero accent word:**
```css
.eset-mod .grad { background: linear-gradient(120deg, #00a4e4, #6fd3ff); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
```

**Glow buttons and lift-on-hover cards:**
```css
.eset-mod .btn-primary { box-shadow: 0 0 0 rgba(0,164,228,0); transition: box-shadow .3s, transform .3s; }
.eset-mod .btn-primary:hover { box-shadow: 0 8px 30px rgba(0,164,228,0.45); transform: translateY(-2px); }
.eset-mod .card { transition: transform .3s, box-shadow .3s; }
.eset-mod .card:hover { transform: translateY(-6px); box-shadow: 0 24px 50px rgba(0,0,0,0.12); }
```

Other safe upgrades to use freely: `clip-path` angled section edges, `mask` fades, `color-mix()` tints, bento grids with `grid-template-columns: repeat(12, 1fr)` and varied spans, accent top-borders on cards, animated gradient borders, pill badges, and subtle `@keyframes` ambient motion on hero glows. Avoid only the things in Part 1 rule 4 (`fixed`, `100vw`, risky `sticky`).

Accessibility nicety: wrap big motion in `@media (prefers-reduced-motion: no-preference) { ... }` so it calms down for users who ask for less.

## Section blueprint (use what fits, keep this order)

1. **Hero (required):** dark or mesh background, eyebrow, `<h1>`, 2 to 3 sentence value statement, primary CTA. Optional ghost CTA.
2. **Trust stats (recommended):** dark band, big numbers in a 4-up grid.
3. **Problem / threat (recommended):** cards naming what the product defends against.
4. **Capabilities (required):** feature cards with inline SVG icons and accent borders.
5. **Differentiator (optional):** dark section, glass cards, what makes it better.
6. **Social proof (recommended):** customer names or longevity stats (no partner names).
7. **Awards (optional):** glass cards on dark.
8. **Platform support (recommended):** pill badges for OS and environments.
9. **Compliance (recommended):** pill badges for frameworks (HIPAA, GDPR, PCI DSS).
10. **Bottom CTA (required):** dark band, one strong line, primary CTA to `#partner-contact`.

---

# Quality checklist before you ship page.html

Mechanics:
- [ ] Starts with `<style>`, not `<!DOCTYPE>`. Fragment only.
- [ ] Every selector scoped under `.vendorname-mod`. Keyframes prefixed too.
- [ ] Wrapper resets inherited font, color, line-height, and box-sizing.
- [ ] Zero `<script>`. No `position: fixed`. No `100vw`.
- [ ] Exactly one `<h1>` and one `.eyebrow` near the top.
- [ ] Every CTA points to `#partner-contact` and has a `data-cta`.
- [ ] No partner names, contact info, nav, footer, or vendor links.
- [ ] All images are local (`images/...`). No external URLs. Icons are inline SVG.
- [ ] Grids collapse to one column at 800px. Tested narrow and wide.

Design:
- [ ] Real vendor brand colors, white base, dark sections in the primary color.
- [ ] Inter loaded. Fluid `clamp()` type. Balanced headlines.
- [ ] At least a few premium touches (mesh or glass, scroll reveal, hover lift, gradient accent).
- [ ] Motion respects `prefers-reduced-motion`.
- [ ] Reads as a flagship product page, not a flyer.

---

# Copy-paste starter skeleton

```html
<style>
  .eset-mod { --brand:#00a4e4; --brand-deep:#0d2137; --ink:#1a1a2e; --muted:#5b6472;
    font-family:'Inter',-apple-system,system-ui,sans-serif; color:var(--ink); line-height:1.6; text-align:left; background:#fff; }
  .eset-mod * { margin:0; padding:0; box-sizing:border-box; }
  .eset-mod .wrap { max-width:1200px; margin:0 auto; padding:0 24px; }
  .eset-mod .eyebrow { font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--brand); }
  .eset-mod h1 { font-size:clamp(34px,5vw,52px); font-weight:900; line-height:1.05; text-wrap:balance; margin:14px 0; }
  .eset-mod .hero { position:relative; padding:88px 0; color:#fff;
    background-color:var(--brand-deep);
    background-image:radial-gradient(at 18% 20%,rgba(0,164,228,.45) 0,transparent 50%),radial-gradient(at 82% 12%,rgba(0,164,228,.25) 0,transparent 45%); }
  .eset-mod .lead { font-size:17px; max-width:620px; opacity:.92; margin-bottom:26px; }
  .eset-mod .btn { display:inline-block; padding:14px 28px; border-radius:10px; font-weight:700; text-decoration:none; transition:transform .3s, box-shadow .3s; }
  .eset-mod .btn-primary { background:var(--brand); color:#04121d; }
  .eset-mod .btn-primary:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(0,164,228,.45); }
  .eset-mod .section { padding:72px 0; }
  .eset-mod .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  .eset-mod .card { background:#fff; border:1px solid #e8ebf0; border-top:3px solid var(--brand); border-radius:16px; padding:26px; transition:transform .3s, box-shadow .3s; }
  .eset-mod .card:hover { transform:translateY(-6px); box-shadow:0 24px 50px rgba(0,0,0,.10); }
  @keyframes eset-rise { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:none; } }
  .eset-mod .reveal { animation:eset-rise linear both; animation-timeline:view(); animation-range:entry 0% entry 35%; }
  @media (max-width:800px){ .eset-mod .grid-3 { grid-template-columns:1fr; } .eset-mod .hero { padding:64px 0; } }
</style>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<div class="eset-mod">
  <section class="hero">
    <div class="wrap">
      <div class="eyebrow">Endpoint Protection</div>
      <h1>Stop What Other Tools <span class="grad">Miss</span></h1>
      <p class="lead">Multilayered endpoint security that detects, blocks, and rolls back threats before they reach your data.</p>
      <a class="btn btn-primary" href="#partner-contact" data-cta="hero_cta">Get Your Free Assessment</a>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="grid-3">
        <div class="card reveal"><h3>Behavioral Detection</h3><p>Catches novel attacks by what they do, not just by signature.</p></div>
        <div class="card reveal"><h3>One-Click Rollback</h3><p>Reverses ransomware damage to the last known-good state.</p></div>
        <div class="card reveal"><h3>Lightweight Agent</h3><p>Full protection with near-zero impact on device performance.</p></div>
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--brand-deep);color:#fff;text-align:center">
    <div class="wrap">
      <h2 style="font-size:clamp(26px,3.5vw,34px);font-weight:800;margin-bottom:18px">Ready to close the gaps in your defense?</h2>
      <a class="btn btn-primary" href="#partner-contact" data-cta="bottom_cta">Talk to an Expert</a>
    </div>
  </section>
</div>
```

Save it as `parent/content/<channel>/<vendor>/<solution>/page.html`, put images in the sibling `images/` folder, preview at `/preview/<childId>/<path>`, and hand partners the embed snippet from `/portal/<childId>`.
