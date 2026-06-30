# Instructions for AI Website Design: Claude CMS Compatible

You are designing a single-file, production-ready HTML website that will be managed by **Claude CMS**. Read every rule before writing a single line of HTML. **The #1 goal: every word, image, link, and embed the client can see must be editable.** Sections 0 and 2 are the rules that guarantee that. Follow them exactly.

> ## 🚫 ABSOLUTE RULE: NEVER use em-dashes
> **Never, ever, ever use an em-dash (`—`) anywhere.** Not in copy, not in headings, not in meta descriptions, not in alt text, not in code comments. This applies to every character you output.
> - Do not use em-dashes (`—`) or "double hyphens" (`--`) as a substitute.
> - Where you would reach for an em-dash, use a comma, a colon, a period, or parentheses instead, and rewrite the sentence so it reads naturally without one.
> - En-dashes (`–`) in numeric ranges are fine (e.g. `h1–h6`, `9–5`). The ban is specifically on the em-dash.

---

## How Claude CMS works (read this first)

Claude CMS ingests the rendered HTML of your page and freezes two things:

1. **Template**: the complete HTML structure, CSS, layout. Immutable forever. Clients cannot break it.
2. **Content model**: every tagged text node, image `src`, embed URL, and link `href`. These are the only things clients can change.

An AI planner translates plain-English client requests into safe set-operations. A deterministic Guardian validates every change. The structure never mutates, only content slots fill in.

**Critical implication:** design for permanence. The layout you write is the layout forever. Make it excellent.

### What clients can do after you hand it off

- Edit any tagged text field (click to select, type)
- Swap any `<img>`
- Change any link/button href
- Update YouTube / Vimeo embed URLs
- Adjust text color and background color per element
- Use the AI chat to request content changes in plain English
- Add new blocks to any section via the block picker

---

## ⭐ RULE 0: The editability rule that actually matters (READ THIS TWICE)

The ingester tags an element as editable when **it holds its own text directly**. It is the *deepest* text holder that wins. There is exactly **one trap** that silently freezes copy, and it is the cause of almost every "this title/paragraph isn't editable" problem:

> **A text element is frozen if it contains a child that ALSO holds its own block of text, UNLESS that child is a pure inline-formatting tag.**

So you must understand two categories of inline tag:

**① Pure formatting tags, SAFE to nest inside a heading/paragraph.** These are absorbed into the parent, and the whole line stays editable as ONE rich field:
`<strong> <b> <em> <i> <span> <small> <sup> <sub> <mark> <code> <u> <abbr> <time> <br>`

```html
<!-- ✅ FULLY EDITABLE, the entire h1 is one field; the gradient word survives -->
<h1>Build <span class="gradient-text">faster</span> websites</h1>

<!-- ✅ FULLY EDITABLE, one rich field, Bold + Italic toolbar shown -->
<p>We build <strong>fast</strong>, <em>beautiful</em> websites for serious businesses.</p>
```

**② `<a>` and `<button>`, NOT absorbed.** They own an editable href, so they always become their *own* field. That is good for standalone links and buttons, but it means **if you put a link in the MIDDLE of a sentence, the words around it freeze:**

```html
<!-- ❌ "Read our" and "before signing." become FROZEN, only "terms" stays editable -->
<p>Read our <a href="/terms">terms</a> before signing.</p>

<!-- ✅ FIX OPTION 1, make the whole line the link -->
<p><a href="/terms">Read our terms before signing.</a></p>

<!-- ✅ FIX OPTION 2, keep the link separate from the editable sentence -->
<p>Read our terms before signing.</p>
<a href="/terms">View terms →</a>
```

**Three hard rules that follow from this:**

1. **Never put bare text and an `<a>`/`<button>` side by side inside the same `<p>`/`<h*>`.** Either wrap the whole thing in the link, or split them into separate elements.
2. **Keep formatting tags as DIRECT children, don't nest them inside each other.** `<p>... <strong>fast</strong> ...</p>` is fine. `<p>... <strong>very <em>fast</em></strong> ...</p>` may lose the inner `<em>` on save. If you need two styles on one phrase, put them side by side, not nested.
3. **Text shorter than 2 characters, or made only of separators/icons (`# • · | — – - + / \`), is never tagged.** A lone `$`, a single digit, or a bare "✓" will be frozen. Always keep a number and its unit/label together in one element: `<span>5 years</span>`, **not** `<span>5</span><span>years</span>`.

---

## RULE 1: No JavaScript

**Scripts are stripped at ingest. Write zero JavaScript.** `<script>` tags are deleted on import. The served site is pure HTML + CSS.

### CSS-only interactive patterns

| Pattern | CSS technique |
|---|---|
| Mobile hamburger menu | `<input type="checkbox">` + `<label>` + adjacent sibling selector |
| Accordion / FAQ | `<details>` + `<summary>` (native HTML) |
| Tab panels | `:target` pseudo-class on `<section id>` anchors |
| Image carousel | `scroll-snap-type` + `scroll-behavior: smooth` |
| Sticky nav | `position: sticky; top: 0` |
| Modal / lightbox | `:target` pseudo-class |
| Dark mode toggle | `<input type="checkbox">` + `:has()` on `<html>` |
| Hover menus | `:hover` + `visibility` + `opacity` transition |
| Animated counters | Not possible without JS, use static numbers |

### Scroll-driven animations (pure CSS)

```css
@keyframes fade-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
.animate-on-scroll { animation: fade-up linear both; animation-timeline: view(); animation-range: entry 0% entry 30%; }
```

Supported Chrome 115+, Safari 18+, Firefox 128+.

---

## RULE 2: Structure your HTML so content is editable

The autotagger walks the DOM and tags the **deepest element that holds direct text**.

**Will be editable:** any element that directly holds text, `h1`–`h6`, `p`, `li`, `a`, `button`, `span`, `blockquote`, `figcaption`, `dt`, `dd`, `th`, `td`, etc.

**Will NOT be editable:** text placed *directly* inside a structural container, `div`, `section`, `nav`, `header`, `footer`, `main`, `ul`, `ol`, `article`, `aside`, `form`. Such text has no leaf to attach to and is frozen.

```html
<!-- ❌ FROZEN, text sits directly in a <div> -->
<div class="badge">New for 2026</div>

<!-- ✅ EDITABLE, text lives in a leaf element -->
<div class="badge"><span>New for 2026</span></div>
```

**Golden rule: every piece of client-facing copy must live in a leaf phrasing element, and must obey RULE 0.**

---

## RULE 3: Section landmarks with IDs

Wrap every logical section in `<section id="...">`. The `id`:

1. Becomes the group label in the editor (`id="hero"` → group "Hero").
2. Is the target when a client adds a new block (the block picker inserts inside the clicked section).

**Every `<section>` must have an `id`.** Use lowercase kebab-case; the CMS converts hyphens to spaces and title-cases the label.

```html
<main>
  <section id="hero">...</section>
  <section id="services">...</section>
  <section id="testimonials">...</section>
  <section id="pricing">...</section>
  <section id="faq">...</section>
  <section id="contact">...</section>
</main>
```

---

## RULE 4: Images (and the background-image trap)

Every `<img>` becomes an editable image slot. Always include descriptive `alt` text, it becomes the field label.

> **⚠️ CSS `background-image` is NEVER editable.** This is the #1 reason a hero or section image "can't be swapped." If the client may ever want to change a picture, it MUST be a real `<img>` element, never a CSS background.

For full-bleed hero images, use a real `<img>` layered behind the content:

```html
<div class="hero-wrapper">
  <img src="https://..." alt="Hero background" class="hero-bg" />
  <div class="hero-content"><h1>Headline over the image</h1></div>
</div>
```

```css
.hero-wrapper { position: relative; height: 100vh; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hero-content { position: relative; z-index: 1; }
```

Reserve CSS gradients/patterns for purely decorative backgrounds the client will never change.

---

## RULE 5: Links and buttons

Every `<a>` and `<button>` with text gets an editable text field **and** an editable href. Write real href values. (Remember RULE 0 ②: keep links out of the middle of editable sentences.)

```html
<a href="https://example.com/contact">Get in touch</a>
<a href="mailto:hello@example.com">Email us</a>
<a href="#pricing">See pricing</a>
<button type="button">Start free trial</button>
```

---

## RULE 6: Video embeds (YouTube / Vimeo)

To make a video embed URL editable, add `data-cms-embed` to the `<iframe>`:

```html
<div class="video-wrapper">
  <iframe data-cms-embed src="https://www.youtube.com/embed/VIDEO_ID" title="Product demo" frameborder="0" allowfullscreen></iframe>
</div>
```

```css
.video-wrapper { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; }
.video-wrapper iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
```

**Only `data-cms-embed` iframes become editable.** Plain iframes are frozen. Only YouTube (`youtube.com/embed/`, `youtu.be/`) and Vimeo (`player.vimeo.com/video/`) URLs are accepted.

---

## RULE 7: SEO meta tags (put ALL of them in `<head>`, with real values)

A meta field is only editable **if the tag exists with real content at ingest.** Omit a tag and the client can never add it. Always include the full set:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Page Title, Brand Name</title>
  <meta name="description" content="~155 character description for Google." />
  <link rel="icon" href="https://..." />
  <meta property="og:title" content="Page Title" />
  <meta property="og:description" content="Social share blurb." />
  <meta property="og:image" content="https://... 1200x630 image" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Page Title" />
  <meta name="twitter:description" content="Social share blurb." />
</head>
```

---

## RULE 8: Collections (repeatable blocks)

Sibling groups with the same tag and **60%+ shared CSS classes** are detected as collections (cards, tiers, testimonials, FAQs) so they can be duplicated/removed.

Two requirements:
1. **Identical class names across siblings.** For a "featured" variant, use a data attribute, not an extra class (an extra class breaks the 60% threshold):
   ```html
   <div class="pricing-card" data-featured="true">...</div>
   ```
   ```css
   .pricing-card[data-featured="true"] { border: 2px solid var(--accent); transform: scale(1.03); }
   ```
2. **Every sibling must contain at least one editable leaf** (a tagged text or image). An "empty" card with text sitting bare in a `<div>` breaks collection detection for the whole group, so make sure each card follows RULE 2.

---

## RULE 9: Rich text fields

Inline formatting present at ingest signals the field supports it; the editor shows a B/I/U toolbar only for those fields. Per RULE 0, keep formatting tags as **direct children** and don't nest them.

```html
<!-- ✅ Bold + Italic available; whole line editable as one field -->
<p>We build <strong>fast</strong>, <em>beautiful</em> websites for serious businesses.</p>

<!-- ✅ Plain text only, no toolbar -->
<p>Simple tagline here.</p>
```

---

## Block addition: what clients can add themselves

Clients click any section background → "+ Add block" → pick a type. No designer pre-placement required.

| Type | What gets inserted |
|---|---|
| Heading | `<h2>` editable heading |
| Paragraph | `<p>` editable body text |
| Image | `<img>` editable image slot |
| YouTube / Vimeo video | Responsive `<iframe data-cms-embed>` |
| Button | `<a>` styled CTA |
| Quote | `<blockquote>` pull quote |
| Divider | `<hr>` |
| Spacer | Vertical whitespace |
| Two columns | Side-by-side heading + paragraph |
| Image + text | Image beside heading and paragraph |

Design the ideal initial state; clients grow the page from there.

---

## Color editing (per-element)

Every selected element shows a **Color** section with **Text color** and **Background** pickers. Values are validated by the Guardian (hex, `rgb()`, `hsl()`, `transparent` only). Use CSS custom properties for your brand palette; clients override per-element as needed.

---

## Cutting-edge CSS techniques (use freely: all CSS is frozen and 100% yours)

### Design tokens
```css
:root {
  --brand-hue: 245;
  --brand: hsl(var(--brand-hue) 85% 55%);
  --surface: hsl(var(--brand-hue) 15% 8%);
  --text: hsl(var(--brand-hue) 20% 92%);
  --radius: 12px; --radius-lg: 24px;
}
```

### Glassmorphism
```css
.glass-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%); border: 1px solid rgba(255,255,255,0.12); border-radius: var(--radius-lg); }
```

### Glow / neon
```css
.glow-btn { background: var(--brand); box-shadow: 0 0 24px color-mix(in srgb, var(--brand) 60%, transparent), 0 0 64px color-mix(in srgb, var(--brand) 30%, transparent); transition: box-shadow .3s ease; }
.glow-btn:hover { box-shadow: 0 0 32px color-mix(in srgb, var(--brand) 80%, transparent), 0 0 96px color-mix(in srgb, var(--brand) 50%, transparent); }
```

### Mesh gradient background (decorative only: not editable)
```css
.mesh-bg { background-color: hsl(245 85% 8%); background-image: radial-gradient(at 20% 20%, hsl(245 85% 30%) 0%, transparent 50%), radial-gradient(at 80% 10%, hsl(280 85% 30%) 0%, transparent 40%), radial-gradient(at 60% 80%, hsl(200 85% 25%) 0%, transparent 45%); }
```

### Animated gradient text (uses `<span>`: fully editable under RULE 0)
```css
@keyframes gradient-shift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
.gradient-text { background: linear-gradient(135deg,#a78bfa,#60a5fa,#34d399,#a78bfa); background-size: 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: gradient-shift 4s ease infinite; }
```

### Bento grid / card hover / reveals
```css
.bento { display: grid; grid-template-columns: repeat(12,1fr); gap: 1rem; }
.bento .card-wide { grid-column: span 8; } .bento .card-tall { grid-column: span 4; grid-row: span 2; } .bento .card-small { grid-column: span 4; }
.card { transition: transform .3s ease, box-shadow .3s ease; }
.card:hover { transform: translateY(-6px); box-shadow: 0 32px 64px rgba(0,0,0,.4); }
```

---

## Complete page structure template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Site Name, Tagline</title>
  <meta name="description" content="~155 chars." />
  <link rel="icon" href="https://..." />
  <meta property="og:title" content="Site Name" />
  <meta property="og:description" content="~200 chars." />
  <meta property="og:image" content="https://... 1200x630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Site Name" />
  <meta name="twitter:description" content="~200 chars." />
  <style>/* All CSS here, full creative freedom */</style>
</head>
<body>

  <header>
    <nav>
      <a href="/" class="logo-link"><span class="logo-text">Brand</span></a>
      <ul class="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <a href="#contact" class="btn-nav">Get started</a>
    </nav>
  </header>

  <main>
    <section id="hero">
      <h1>Your compelling headline</h1>
      <p class="hero-sub">Supporting subheadline that clarifies the value prop.</p>
      <div class="hero-ctas">
        <a href="#contact" class="btn btn-primary">Primary action</a>
        <a href="#features" class="btn btn-ghost">Learn more</a>
      </div>
      <img src="https://..." alt="Hero illustration" class="hero-img" />
    </section>

    <section id="features">
      <h2>Section heading</h2>
      <p class="section-sub">Optional section subtext.</p>
      <div class="features-grid">
        <div class="feature-card">
          <img src="https://..." alt="Feature icon" class="feature-icon" />
          <h3>Feature name</h3>
          <p>Feature description goes here.</p>
        </div>
        <!-- Repeat .feature-card with identical classes; each must hold editable leaves -->
      </div>
    </section>

    <section id="demo">
      <h2>See it in action</h2>
      <div class="video-wrapper">
        <iframe data-cms-embed src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Product demo" frameborder="0" allowfullscreen></iframe>
      </div>
    </section>

    <section id="testimonials">
      <h2>What clients say</h2>
      <div class="testimonials-grid">
        <div class="testimonial-card">
          <blockquote>The exact quote from the client goes here verbatim.</blockquote>
          <p class="testimonial-author">Jane Smith, CEO of Acme</p>
          <img src="https://..." alt="Jane Smith" class="avatar" />
        </div>
        <!-- Repeat .testimonial-card -->
      </div>
    </section>

    <section id="pricing">
      <h2>Simple, transparent pricing</h2>
      <div class="pricing-grid">
        <div class="pricing-card">
          <h3>Plan name</h3>
          <p class="price">$29/mo</p>
          <p class="price-sub">Billed annually</p>
          <ul class="feature-list">
            <li>Feature one</li>
            <li>Feature two</li>
            <li>Feature three</li>
          </ul>
          <a href="#contact" class="btn btn-primary">Get started</a>
        </div>
        <!-- Repeat .pricing-card -->
      </div>
    </section>

    <section id="faq">
      <h2>Frequently asked questions</h2>
      <div class="faq-list">
        <details>
          <summary>Question text here?</summary>
          <p>Answer goes here.</p>
        </details>
        <!-- Repeat details -->
      </div>
    </section>

    <section id="contact">
      <h2>Get in touch</h2>
      <p>A short invitation to reach out.</p>
      <a href="mailto:hello@example.com" class="btn btn-primary">Email us</a>
    </section>
  </main>

  <footer>
    <p class="footer-brand">Brand Name</p>
    <p class="footer-copy">© 2026 Brand Name. All rights reserved.</p>
    <nav class="footer-links">
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms</a>
    </nav>
  </footer>

</body>
</html>
```

> Note in the price example: `$29/mo` is a single text node, so it stays editable. Don't split the number into its own `<span>`.

---

## ✅ Checklist before finalizing (editability first)

- [ ] **RULE 0:** no `<a>`/`<button>` sitting next to bare text inside a `<p>`/`<h*>`, links are either the whole element or fully separate
- [ ] **RULE 0:** formatting tags (`strong`, `em`, `span`…) are direct children, never nested inside each other
- [ ] **RULE 0:** every number has its unit/label in the same element; no lone 1-character text
- [ ] Every piece of copy lives in a leaf element, no bare text directly in `div`/`section`/`nav`/`header`/`footer`/`main`/`ul`/`ol`
- [ ] Every swappable picture is a real `<img>`, never a CSS `background-image`
- [ ] Every `<section>` has a meaningful `id="..."`
- [ ] Repeating cards use identical class names AND each card contains editable leaves
- [ ] All images have descriptive `alt`; all links have real `href`
- [ ] Full SEO `<head>`: title, description, favicon, og:*, twitter:*, all present with real values
- [ ] All interactive patterns are CSS-only; zero `<script>` tags
- [ ] Responsive at 375px and 1440px; viewport meta present
- [ ] All asset URLs absolute (`https://...`)
- [ ] YouTube/Vimeo iframes clients should update have `data-cms-embed`; decorative iframes do not

---

## Multi-page sites

Each page has its own frozen template and content model.

- **Each page is a separate HTML file.** Ingest one at a time.
- **The home page drives the visual DNA of all other pages.** Adding a page clones the home page's header, footer, nav, and `<style>`, then drops in a starter layout. Design the home page first.
- **Each page has its own content model**, independently versioned.
- **Live URLs:** home at `/live/<site-name>`, others at `/live/<site-name>/<slug>`.

### RULE MP1: Home page is the master template
Put your **entire CSS**, **nav**, and **footer** in the home page `<style>`/markup, they propagate to every page.

### RULE MP2: Inter-page links use the slug
```html
<a href="/">Home</a>
<a href="/about">About</a>
<a href="/services">Services</a>
<a href="/contact">Contact</a>
```
Slugs are lowercase kebab-case, auto-derived from the page title ("Our Services" → `/our-services`).

### RULE MP3: Nav lists all pages
The number of nav items is frozen, clients can edit each link's text/href but cannot add or remove nav items. Include a link for every page at design time.

### RULE MP4: Each page needs its own SEO
Every page file must have its own `<title>` and `<meta name="description">` (and ideally the full og:/twitter: set per RULE 7).

### RULE MP5: Each non-home page is a complete, self-contained HTML file
Same `<head>` CSS, same header/nav, same footer as the home page.

### RULE MP6: Section IDs are scoped per page
Two pages may both use `<section id="hero">`. IDs only need to be unique within a single page.

### Suggested sections per page type
| Page | Sections |
|---|---|
| Home | hero, features, testimonials, pricing, faq, contact |
| About | about-hero, team, story, values, contact |
| Services | services-hero, services-list, process, pricing, contact |
| Blog index | blog-hero, posts (collection of .post-card) |
| Blog post | article (h1, subhead, paragraphs, img) |
| Contact | contact-hero, contact-info |
| Pricing | pricing-hero, pricing-grid, faq, cta |

### Multi-page checklist
- [ ] Home page carries the complete CSS, nav, and footer all pages inherit
- [ ] Nav links every page via slug hrefs (`/about`, `/services`…)
- [ ] Every non-home page is a complete standalone file (same header, CSS, footer)
- [ ] Every page has its own unique `<title>` and meta description
- [ ] Section IDs unique within each page
- [ ] Every page follows RULES 0–9
