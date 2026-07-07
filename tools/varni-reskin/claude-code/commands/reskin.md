---
description: Reskin exactly one store at the given path
argument-hint: <path-to-static-site-store-folder>
allowed-tools: Bash(node ./tools/varni-reskin/bin/reskin.js *), Bash(npm run *)
---

Run the reskin pipeline for this single store: $1

If `$1` is a parent folder containing multiple stores, stop and ask which one store to process.
Do not run batch mode by default.

Use the project defaults from `reskin.config.json`:

```bash
node ./tools/varni-reskin/bin/reskin.js auto --in "$1"
```

If the user instruction is `Match the design of "stores/<store>"`, run the design contract commands
automatically as part of the work:

```bash
npm run design:extract -- --source stores/<store> --out themes/<store>/design-contract.json
npm run design:verify -- --contract themes/<store>/design-contract.json --url http://127.0.0.1:5173/
```

Run extraction before implementation when source HTML/CSS exists. Run verification after the app is
running and before reporting the design match complete. Failed checks are the repair checklist.

Source fidelity is mandatory when the generated theme is later applied or when homepage/component
work follows this reskin:
- Follow `skills.md` for frontend design implementation. First build/update that theme's own
  `themes/<store>/DESIGN.md` (one DESIGN.md per theme, kept inside the theme folder — never a shared
  root `DESIGN.md`, since each theme would overwrite the last), identify all sections, create a plan,
  list assets, explain responsive behavior, and cover structure, markup, CSS, interactions,
  breakpoints, and final optimization. Include a copyright/plagiarism checklist for identity, copy,
  images, icons, reviews, policies, and domains.
- Use only SvelteKit, existing Svelte components, shadcn, Tailwind, and Svelte 5 runes. Do not create
  new pages/components when an existing one should be modified or reused. Use exact design font sizes
  when specified, and show loading indicators inside clicked/async buttons.
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
- Read the source HTML and CSS for each section before editing the app section.
- Preserve the source visual contract: background color, layout, spacing, border radius, shadows,
  typography scale, CTA shape, and icon roles.
- Preserve palette balance, not just token existence. If secondary/accent colors appear as visible
  bands, panels, badges, gradients, or section backgrounds, carry those visible color areas into the
  final app.
- Homepage data other than the actual product list must load from static theme content and
  theme-local assets. Do not replace the theme hero, promo banners, newsletter/app banners, section
  copy, trust badges, stats, testimonials, or decorative category/promo presentation with API
  `desktopBanners`, `mobileBanners`, page layouts, page metadata, or loading state. Use API data only
  for live commerce lists such as products, prices, inventory, and real product/category collections.
- Never change a source light hero into a dark hero or source pill buttons into rectangular buttons.
- Icons are design requirements. Map source icons to the closest installed app icon equivalents and
  verify placement, size, color, and semantic role. Do not substitute nearby ecommerce icons such as
  cart/bag when the source uses a different icon like truck/fast-delivery.
- Section labels/eyebrows and hero typography must match the current source design exactly:
  text/casing, font family, weight, color, margin, and computed font-size behavior. Verify the
  source selectors/classes against the rendered app at the current viewport and mobile breakpoint
  before calling the homepage done.
- Before calling a homepage/hero done, compare the rendered app to the source and verify hero
  background, primary/secondary buttons, floating cards/badges, images, icons, container
  width/gutters, section padding, heading margins, grid gaps, card spacing, border width/color/style,
  font weight, and icon size/stroke/fill.
- Prevent the known drift pattern: visible accent sections, CTA card colors, semantic icons,
  typography sizes, and card counts must come from the source contract, not approximation.

When homepage/component work follows this reskin, build in this order:
1. Micro components first: buttons, icon buttons, badges, section labels, price text, rating rows,
   image wrappers, chips, inputs, and empty/loading states.
2. Reusable commerce components next: product cards, category cards, menu cards, promo cards,
   testimonial cards, newsletter forms, and floating hero info cards.
3. Layout components next: header, navigation, mobile nav, footer, announcement bars, containers,
   and section wrappers. Clone the current source theme's header/footer layout rather than reusing
   the previous theme chrome, but replace the source logo, names, domain, and contact identity.
4. Page sections next: hero, categories, featured products/menu, about/story, offer, testimonials,
   and newsletter.
5. Page contents last: route files should compose sections and pass data, not duplicate repeated UI.

If a pattern appears two or more times, extract or reuse a component before calling the page done.

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

Design migration safety rules:
- The existing SvelteKit app is the logic source. Do not rewrite product listing, product detail,
  cart, checkout, auth, search, categories, account pages, API calls, routing, stores, or data
  structures.
- Migrate only the visual layer: tokens, layout, classes, icons, spacing, shadows, radius,
  typography, images, and responsive behavior.
- Use component mapping before app edits. Map static blocks to existing Svelte components and include
  what visual fields are applied, such as layout, image ratio, title style, price style, button
  style, badge style, and input style.
- If mapping confidence is low, ask for confirmation instead of editing broadly.
- Preserve accessibility attributes and interactions.
- When applying the theme or building pages, run build and use Playwright/screenshots when available
  to compare home, category/product listing, product detail, cart, checkout, and login/register.
  Repair only the responsible component for each mismatch.
- Exercise the functional shopping path in the browser or tests before reporting completion: PLP,
  PDP, add to cart, cart, checkout address/payment/process/success. Fix console errors, navigation
  errors, failed requests, and broken cart/checkout state before calling the theme done.

After it finishes, report:
- Where the generated theme files landed.
- Any warnings from `REPORT.md`.

Do not apply generated files into `src/app.css`, `tailwind.config.js`, or `src/app.html` unless the
user separately asks for that.
