---
description: Reskin this svelte-commerce repo to match a client's static site design
argument-hint: <path-to-static-site-dir> [path-to-theme-out-dir]
allowed-tools: Bash(node *), Bash(npm run *), Bash(git *), Read, Edit, Write, Glob, Grep
---

Reskin this svelte-commerce/Litekart repo to match the static site design at: $1
Theme output directory (default `./reskin-out`): $2

Follow this exact workflow:

Core rule: this is design migration, not ecommerce logic conversion. The existing SvelteKit app is
the logic source. Do not rewrite product listing, product detail, cart, checkout, auth,
search/categories, account pages, API calls, routing, stores, or data structures. Migrate only the
visual layer.

## 1. Deterministic Extraction First
Run the token pipeline. Never eyeball colors/fonts yourself:

```bash
node ./tools/varni-reskin/bin/reskin.js run --in "$1" --out "${2:-./reskin-out}"
```

Read the generated `REPORT.md` and `design-tokens.json`. If `REPORT.md` contains warnings such as
low contrast or no chromatic colors, note them but proceed; the tokens mirror the client's actual
design.

Confirm that the extracted tokens cover colors, fonts, spacing, border radius, button styles, card
styles, container widths, header/footer layout, product-card layout, input styles, shadows, badges,
and navigation style.
Confirm that source framework spacing utilities are resolved into exact computed values at each
breakpoint, including container max-width, gutters, section padding, margins, grid gaps, row/column
spacing, and card dimensions. Do not approve token extraction if these values are missing or only
approximated.

## 2. Apply The Theme
- Replace the `:root` variable block in `src/app.css` or `app.pcss` with the contents of `theme.css`.
- Wire `tailwind.theme.cjs` into `tailwind.config.js` via `theme: { extend: require(...) }`, merging
  with any existing extend keys rather than clobbering them.
- Add the `fonts.html` `<link>` tags to `src/app.html` `<head>`, replacing any existing Google Fonts
  links.

## 3. Restyle Components Structurally
`design-tokens.json` lists detected sections; the matching HTML snippets are referenced in
`REPORT.md`. For each section that has a corresponding component in this repo, such as header, hero,
product-card, product-grid, footer, newsletter, or announcement:

- Follow `skills.md` for frontend design implementation. First build/update that theme's own
  `themes/<store>/DESIGN.md` (one DESIGN.md per theme, kept inside the theme folder — never a shared
  root `DESIGN.md`, since each theme would overwrite the last), identify every section, create a
  plan, list assets, explain responsive behavior, and cover structure, markup, CSS, interactions,
  breakpoints, and final optimization. Include a copyright/plagiarism checklist for identity, copy,
  images, icons, reviews, policies, and domains.
- Use only SvelteKit, existing Svelte components, shadcn, Tailwind, and Svelte 5 runes. Do not create
  replacement pages/components when an existing one should be modified or reused. Use exact design
  font sizes when specified, and show loading indicators inside clicked/async buttons.
- Do not use exact real logos, copied logo marks, or lookalike logo artwork. Replace logo marks with
  the website name as a text wordmark. By default, rename the brand/site to `Website-$1`, where `$1`
  is the user-provided or inferred source brand/site identifier.
- For new designs, apply settings colors first (`primary`, `primary foreground`, `secondary`,
  `secondary foreground`, `accent`, `accent foreground`), then clone and build the source
  header/footer layout, product component, home/PLP/PDP in parallel, and all other pages in parallel.
- Header and footer are mandatory theme sections, but source brand identity must not be copied.
  Extract and implement the source desktop/mobile header, navigation, mobile drawer/menu,
  announcement/top bars, logo placement, cart/account/search
  actions, footer columns, newsletter/legal rows, social/payment links, responsive breakpoints,
  spacing, colors, borders, typography, and hover/focus states. Replace the source logo, brand name,
  domain name, email addresses, phone numbers, physical address, copyright text, and other unique
  identity marks with the target store/theme identity or a clearly different placeholder. Do not call
  the theme complete while the previous theme's header, navigation, mobile nav, or footer is still
  visible.
- Avoid copyright and plagiarism risk. Use the source only to understand layout patterns,
  interaction ideas, component roles, and commerce expectations. Do not copy proprietary logos,
  brand names, domains, product names, campaign slogans, long-form copy, photography, illustrations,
  icon sets, reviews, policies, urgency tactics, or distinctive trade dress wholesale. Rebuild the
  result inside this project's own theme identity and design system with original target-store
  content, licensed/local assets, API data, or clearly different placeholders.
- Read the target HTML snippet and the existing component.
- Use a component mapping layer before editing app files. Map static blocks to existing Svelte
  components and include confidence plus intended visual fields to apply, such as layout, image
  ratio, title style, price style, button style, badge style, and input style.
- If mapping confidence is low, stop and ask for confirmation instead of editing broadly.
- The current input design is the source of truth for that store. Convert the supplied HTML/CSS,
  screenshot, Figma, image, or static template into a fully working SvelteKit ecommerce frontend
  while preserving existing app logic. Do not freeze one store's design as a global baseline; derive
  a fresh visual baseline from the current source design each time.
- When source HTML/CSS is available, extract a section-level design contract before editing app
  files. Capture section order, class/selector mapping, text, card counts, image paths, icon
  classes/roles, backgrounds/gradients, typography, spacing, radius, shadows, buttons, palette usage,
  and responsive media rules. Use screenshots only as final QA.
- Container and spacing values must be exact. Translate source framework utilities such as
  Bootstrap `container-*`, `row`, `col-*`, `g-*`, `p-*`, `px-*`, `py-*`, `m-*`, `mb-*`, and `my-*`
  into computed values at desktop, laptop, tablet, and mobile breakpoints. Do not substitute guessed
  `clamp()` values, arbitrary Tailwind spacing, or approximate gutters when the source has explicit
  computed container widths, padding, margins, gaps, or grid/card dimensions.
- Reproduce every template section exactly as specified by the source input. Preserve section order,
  layout structure, content hierarchy, visible text/casing, images, icons, backgrounds, colors,
  typography, spacing, borders, shadows, responsive behavior, hover states, and micro-interactions.
  Do not skip, merge, reorder, simplify, or substitute source sections unless the user explicitly
  approves it. Finish and verify one source section before moving to the next.
- Borders, font boldness, icons, and spacing must be exact computed values. Capture/reproduce
  `font-weight`, border width/style/color/radius on every side, divider lines, button outlines, card
  outlines, icon source/type, icon size, stroke width, fill, color, and placement. Do not change
  regular text to bold, bold text to regular, source image icons to generic icons, line icons to
  filled icons, or bordered elements to unbordered elements.
- Preserve source fidelity: match the source background, layout, spacing, radius, shadows,
  typography scale, CTA shape, images, floating cards/badges, and icon roles before inventing
  anything.
- Homepage data other than the actual product list must load from static theme content and
  theme-local assets. Do not replace the theme hero, promo banners, newsletter/app banners, section
  copy, trust badges, stats, testimonials, or decorative category/promo presentation with API
  `desktopBanners`, `mobileBanners`, page layouts, page metadata, or loading state. Use API data only
  for live commerce lists such as products, prices, inventory, and real product/category collections.
- Verify icon semantic roles from the source. Do not substitute nearby ecommerce icons such as
  cart/bag when the source uses a different icon like truck/fast-delivery.
- Preserve palette balance, not just token existence. If secondary/accent colors appear as visible
  bands, panels, badges, gradients, or section backgrounds, carry those visible color areas into the
  final app.
- Match section labels/eyebrows and hero typography exactly for the current source design. Copy
  text/casing, font family, weight, color, margin, and computed font-size behavior from the source
  selectors/classes; verify them in the rendered app at the current viewport and mobile breakpoint.
- Prevent the known drift pattern: visible accent sections, CTA card colors, semantic icons,
  typography sizes, and card counts must come from the source contract, not approximation.
- Work from small to large. Build or restyle micro components first: buttons, icon buttons, badges,
  section labels, price text, rating rows, image wrappers, chips, inputs, and empty/loading states.
- Build reusable commerce components next: product cards, category cards, menu cards, promo cards,
  testimonial cards, newsletter forms, and floating hero info cards. They should accept data/slots
  where appropriate instead of duplicating markup.
- Build layout components next: header, navigation, mobile nav, footer, announcement bars,
  containers, and section wrappers. Clone the current source theme's header/footer layout rather
  than reusing the previous theme chrome, but replace the source logo, names, domain, and contact
  identity.
- Build page sections next: hero, categories, featured products/menu, about/story, offer,
  testimonials, and newsletter.
- Assemble page contents last. Route files should mostly compose sections and pass data; repeated UI
  belongs in reusable components.
- If a visual pattern appears two or more times, extract or reuse a component instead of copying the
  markup into page files.

Before calling the theme complete, run an originality check: search the codebase for source brand
names, domains, email addresses, phone numbers, copied policy/review text, source copyright strings,
and unlicensed asset filenames. Replace any remaining source identity or copied content.

Before calling the theme complete, verify the commerce flow works without errors: PLP/category or
`/products`, PDP/product detail, add to cart, cart page quantity/remove/subtotal behavior, checkout
address/payment/process/success flow, and any API/localStorage state needed by those pages.

Before calling generated website work complete, verify desktop, laptop, tablet, and mobile widths are
responsive and do not create a horizontal scrollbar. Check `scrollWidth <= clientWidth`, then fix
overflowing layouts, images, grids, absolute elements, and long text instead of hiding unresolved
overflow.
- Rewrite only the markup structure and classes to match the target design. Use token-based Tailwind
  classes (`bg-primary`, `text-foreground`, `font-heading`, `rounded`, `border-border`) unless source
  fidelity requires a local section-specific style already represented in the source CSS.
- Never alter the `<script>` block, props, store subscriptions, event handlers, `bind:`, `use:`,
  `{#if}/{#each}/{#await}` blocks, transitions, or slots. Every dynamic expression from the original
  must survive.
- Preserve accessibility attributes and interactions. Do not remove `aria-*`, labels, semantic
  elements, keyboard behavior, focus states, or form associations.
- Keep AI edits small and targeted. Do not ask for broad "make the app look like this site" edits;
  patch one mapped component or section at a time.

## 4. Verify Every Edit - Mandatory
After each component edit:

```bash
node ./tools/varni-reskin/bin/check-restyle.js --git <path/to/Component.svelte>
```

If it fails, fix the component until it passes. Do not proceed with a failing check. Then, after all
components:

```bash
npm run check 2>/dev/null || npx svelte-check --threshold error
npm run build
```

Fix any errors introduced by your changes before finishing.

Before calling a homepage or hero complete, compare the rendered app to the source and verify hero
background, primary/secondary buttons, floating cards/badges, images, icons, container
width/gutters, section padding, heading margins, grid gaps, card spacing, border width/color/style,
font weight, and icon size/stroke/fill.

When a browser can run the app, use Playwright screenshots or direct rendered inspection for key
pages that exist: home, category/product listing, product detail, cart, checkout, and login/register.
Generate or update a screenshot report that names mismatches by area, such as header height, button
radius, product image ratio, footer background, icon placement, and card spacing. If visual drift is
above threshold, repair only the responsible component, then rerun build and comparison.

Exercise the functional shopping path in the browser or tests before reporting completion: PLP, PDP,
add to cart, cart, checkout address/payment/process/success. Fix console errors, navigation errors,
failed requests, and broken cart/checkout state before calling the theme done.

Do not modify package manager lockfiles unless a dependency change is truly required and explicitly
justified.

## 5. Report
Summarize: tokens applied, component map decisions, components restyled, reusable components
created, visual comparison status, guardrail results, and build status. Do not commit unless
explicitly asked.
