# Link Conventions

Always emit clean, SEO-friendly listing URLs. Do NOT link to
`/products?search=<term>`; use the bare slug route instead: `/<term>`.

- `/products?search=pendant` → `/pendant`
- `/products?search=gold-ring` → `/gold-ring`

The bare `(www)/[slug]` route resolves the slug as a product listing (Meilisearch,
`categories: slug`), so `/pendant` is the canonical equivalent of a term/category search.
Apply this in `href`s, nav/menu links, category chips, search suggestions, and any generated
markup. This is a standing rule — do not ask about it again.

Keep real query params only when they carry non-term filters that the slug route reads from the
querystring (`price`, `tags`, `originCountry`, `keywords`, `page`) — e.g. `/pendant?page=2`.
The `products` route with its own routing/filter UI (the full catalogue page) is exempt; this rule
targets term/category shortcut links, not that page's internal state.

# Reskin rules (varni-reskin)

This repo gets re-themed per client using the varni-reskin pipeline in `tools/varni-reskin/`.
Project defaults live in `reskin.config.json` at the project root. Always let the tool read them
instead of asking the user for flags.

## Run Exactly One Store
Whenever the user asks to reskin a store, points at a static site folder, or drops a new folder
under `stores/`, run:

```bash
node ./tools/varni-reskin/bin/reskin.js auto --in "<single-store-path>"
```

If the user gives a parent folder such as `stores/`, stop and ask which single store to process.
Do not run batch mode by default. The user wants one store reskinned at a time.

`reskin.config.json` supplies `out`, `concurrency`, and `engine`. Do not ask the user for those
flags unless the requested store path is ambiguous or they explicitly ask for different settings.

The `/reskin <path>` slash command wraps this same single-store call.

## Switchable Theme Architecture
Multiple storefront themes must coexist. Do not overwrite the current theme as the only app design.
Add new themes as selectable implementations and resolve the active theme at runtime/config time.

- `.env` can select the active local/deployment theme with `PUBLIC_STOREFRONT_THEME=<theme-name>`.
- Admin/store settings should be allowed to override env when present. The resolver currently checks
  `store.theme`, `store.activeTheme`, `store.themeName`, `store.settings.theme`,
  `store.plugins.themeSettings.theme`, and `store.plugins.themeSettings.activeTheme`.
- The root layout exposes `data.theme` and adds `data-theme="<theme-name>"` to the app shell.
- Theme-specific homepage, nav, footer, component, and CSS work must be guarded by the active theme.
  A Sarab section must only render for the `sarab` theme; future themes should not inherit Sarab
  restaurant copy, images, icons, or layout by accident.
- Every new theme must include a cloned source header, navigation/mobile navigation, and footer
  layout, without copying the source brand identity. Treat header and footer as required sections,
  not optional shared chrome. Extract their source
  HTML/CSS, logo placement, menu structure, announcement/top bars, cart/account/search actions,
  social/payment links, newsletter/legal rows, responsive breakpoints, spacing, colors, borders,
  typography, and hover/focus states into that theme's `DESIGN.md` and implementation. Replace the
  source logo, brand name, domain name, email addresses, phone numbers, physical address, copyright
  text, and other unique identity marks with the target store/theme identity or a clearly different
  placeholder. Do not call a theme done while it still uses a previous theme's header or footer.
- Avoid copyright and plagiarism risk. Reference sites, screenshots, static templates, and competitor
  designs are inspiration and analysis inputs only. Absorb layout ideas, interaction patterns, and
  commerce requirements, then rebuild them inside this app's own theme identity and design system.
  Do not copy proprietary logos, brand names, domains, product names, campaign slogans, long-form
  copy, photography, illustrations, icon sets, reviews, policies, urgency tactics, or distinctive
  trade dress wholesale. Use original target-store content, licensed/local assets, API data, or
  clearly different placeholders.
- Homepage theme copy/assets must live in the theme layer, not inline in route files. Put hero copy,
  SEO title/image, section labels/headings/body copy, decorative image paths, gallery/testimonial/team
  entries, static story/history blocks, empty-state copy, and CTA labels in the active theme config.
  Route files should render `themeContent` plus API commerce data.
- Homepage data other than the actual product list must come from static theme content, not API page
  data. Hero banners, promo banners, newsletter/app-download banners, CTA copy, section headings,
  decorative images, trust badges, stats, testimonials, blog teasers, and theme-owned category/promo
  presentation should be driven by `themeContent` or theme-local static assets. Do not let API
  `desktopBanners`, `mobileBanners`, page layouts, page metadata, or loading state replace the
  theme's static homepage sections. API data is for live commerce lists such as products, prices,
  inventory, and real product/category collections.
- When building a new design, create or extend a theme branch/component path for that theme and add it
  to the theme resolver's available theme list.

## Automatic Design Contract
When the user says `Match the design of "stores/<store>"`, or asks an AI coder to match/apply a
store design from a static source folder, run the design contract commands automatically before and
after implementation. Do not wait for the user to name these commands.

For example, for Sarab:

```bash
npm run design:extract -- --source stores/sarab --out themes/sarab/design-contract.json
npm run design:verify -- --contract themes/sarab/design-contract.json --url http://127.0.0.1:5173/
```

For another store, replace both `sarab` path segments with that store name. The extract command is
required before app edits when source HTML/CSS exists. The verify command is required after the app
is running and before reporting the design match complete. If verification fails, treat the report as
the repair checklist and fix the responsible section/component before claiming completion.

## Source Fidelity Rules For Homepage And Component Work
These rules exist because a previous Sarab homepage pass incorrectly made the hero dark and changed
button/icon styling away from the source design. Do not repeat that mistake.

- Use `skills.md` as the frontend design implementation skill for new designs. Before editing app
  code for a supplied design, build or update that theme's own `themes/<theme>/DESIGN.md` (one
  DESIGN.md per theme — never a shared root `DESIGN.md`, since each theme would overwrite the last),
  identify every section, create a development plan, list required assets, explain responsive
  behavior, and cover project structure, markup, styling, interaction JavaScript, breakpoints, and
  final optimization. Also create or update the strategy/visual-system docs before implementation:
  `PRODUCT.md` for users, success criteria, brand personality, anti-references, and design
  principles; `themes/<theme>/DESIGN.md` for tokens, typography, spacing/radius/shadow rules,
  accent-color rules, component rules, and a copyright/plagiarism checklist. Do not skip sections.
- Implement as a senior frontend developer using only SvelteKit, existing Svelte components, shadcn,
  Tailwind, and Svelte 5 runes. Never create a new page or component when an existing one should be
  modified or reused. Use exact design font sizes when specified. Buttons that trigger async/click
  actions must show loading indicators while clicked/in flight.
- New design build sequence: first apply settings colors (`primary`, `primary foreground`,
  `secondary`, `secondary foreground`, `accent`, `accent foreground`), then clone and implement the
  source header/footer layout including mobile nav and footer utility rows while replacing all source
  identity names/logos/domains/contact details, then product component, then home/PLP/PDP in
  parallel, then all other pages in parallel.
- The current input design is the source of truth for that store. Any supplied HTML/CSS, screenshot,
  Figma, image, or static template must be converted into a fully working SvelteKit ecommerce
  frontend that preserves the existing app logic. Do not freeze one store's design as a global
  baseline; each store/design gets its own visual baseline derived from its source files.
- When source HTML/CSS is available, do not start by eyeballing screenshots. First extract a
  section-level design contract from the source markup and CSS, then build/verify against that
  contract. The contract must capture section order, class/selector mapping, text, card counts,
  image paths, icon classes/roles, backgrounds/gradients, typography, spacing, radius, shadows,
  buttons, palette usage, and responsive media rules. Screenshots are final QA, not the primary
  reconstruction method.
- Container and spacing fidelity are hard requirements. Treat container max-width, gutters, section
  padding, margins, gaps, grid tracks, card dimensions, and carousel/item spacing as computed
  contract values. If the source uses Bootstrap or another framework, translate utilities such as
  `container-*`, `row`, `col-*`, `g-*`, `p-*`, `px-*`, `py-*`, `m-*`, `mb-*`, and `my-*` to their
  actual computed values at every supported breakpoint. Do not replace source values with guessed
  `clamp()` expressions, arbitrary Tailwind spacing, or "close enough" visual rhythm unless the
  source itself uses those responsive formulas.
- Every template section must be reproduced section-by-section exactly as specified by the input
  design. Preserve the original section order, layout structure, content hierarchy, visible
  text/casing, images, icons, backgrounds, colors, typography, spacing, borders, shadows, responsive
  behavior, hover states, and micro-interactions. Do not skip, merge, reorder, simplify, or
  substitute a source section unless the user explicitly approves it. Complete and verify one
  section against the source before moving to the next.
- Borders, font boldness, icons, and spacing must be treated as computed contract values, not
  visual guesses. Capture and reproduce exact `font-weight`, border width/style/color/radius on every
  side, divider lines, button outlines, card outlines, icon source/type, icon size, stroke width,
  fill, color, and placement. Do not change regular text to bold, bold text to regular, source image
  icons to generic icons, line icons to filled icons, or bordered elements to unbordered elements.
- Font family names are exact design requirements. If the source uses a named `@font-face` family
  such as `queens`, download/use that source font asset and wire it locally; do not substitute a
  lookalike Google/system font such as Cormorant unless the source font is unavailable and the
  exception is explicitly documented.
- Match the source theme before inventing anything. For every major section you touch, read the
  source HTML and CSS for that exact section first, then reproduce its visual contract in the app:
  background color, layout, spacing, border radius, shadows, typography scale, CTA shape, and icon
  choices.
- Preserve palette balance, not just token existence. If the source uses secondary/accent colors as
  visible bands, panels, badges, gradients, or section backgrounds, carry those visible color areas
  into the final app. Do not let one primary color dominate if the source design has meaningful
  green/gold/blue/etc. portions.
- Do not replace a light hero with a dark hero, do not change pill buttons into rectangular buttons,
  and do not substitute generic icons when the source section defines specific icon roles.
- Icons are part of the design, not decoration. Map source icon intent to the closest installed app
  icon library equivalent and verify each CTA/card/badge has the correct icon placement, size, and
  color. If the source has a utensils CTA, play button, star badge, fire deal card, clock delivery
  card, truck/fast-delivery order card, or similar role, that role must survive in the reskinned
  component. Do not substitute nearby ecommerce icons such as cart/bag when the source uses a
  different semantic icon.
- Section labels/eyebrows and hero typography are not optional approximations. Copy the source label
  text, casing, font family, weight, color, margin, and computed font-size behavior from the source
  selectors/classes for that design. Before calling a homepage done, inspect the rendered app and
  confirm the hero title font-size and every visible section eyebrow match the current source design
  at the current viewport and mobile breakpoint.
- Before marking a homepage or hero complete, compare the rendered app against the source section and
  explicitly verify: hero background, primary button shape/style, secondary CTA style, floating
  cards/badges, images, icons, container width/gutters, section top/bottom padding, heading margins,
  grid gaps, card spacing, border width/color/style, font weight, and icon size/stroke/fill. If any
  of these differ, fix the component before reporting done.
- Known failure pattern to prevent: merely copying tokens is not enough. A source green section must
  remain a visible green section, a source red order card must remain red, a source truck/fast-delivery
  icon must not become a cart icon, source heading/label sizes must match computed CSS, and source
  card counts must survive in the working Svelte page.
- Before calling a theme complete, run an originality check across the codebase and generated theme
  assets. Search for the source brand names, domains, email addresses, phone numbers, copied policy
  or review text, source copyright strings, and unlicensed asset filenames. Replace any remaining
  source identity or copied content with target-store content, licensed/local assets, API data, or
  clearly different placeholders.

## Design Migration System Rules
This work is not "convert static HTML/CSS into SvelteKit ecommerce logic." It is a design migration
system: read a static HTML/CSS storefront, extract its visual design, and apply that visual layer to
an already-working SvelteKit ecommerce frontend.

- Treat the existing SvelteKit app as the logic source. Do not regenerate or replace product
  listing, product detail, cart, checkout, login/register, search, categories, account pages, API
  calls, routing, state management, stores, or data structures.
- Live commerce content must come from the app/API. Do not hardcode real products, prices, inventory,
  stock, cart items, checkout data, account data, or user-specific data in theme/page/component work.
  Static source HTML is a visual/content reference for theme-owned homepage sections. On the
  homepage, only the actual live product list should depend on API product data; all non-product-list
  homepage content must load from static theme content and theme assets, including banners. If API
  product data is missing, render loading/empty states or hide that commerce grid; never invent live
  products to fill the design.
- Do not put theme-owned homepage content inline in `+page.svelte`. Theme-owned content belongs in
  theme config/modules; API-owned commerce content belongs in API/composables/stores.
- Migrate only the UI layer: visual tokens, component layout, classes, section composition, icons,
  spacing, shadows, radius, typography, images, and responsive behavior.
- Build around design tokens first. Extract colors, fonts, spacing, border radius, button styles,
  card styles, container widths, header/footer layout, product-card layout, input styles, shadows,
  badges, and navigation style before editing components.
- Use a component mapping layer before touching app files. Map static blocks such as header, hero,
  product card, product grid, category card, banner, newsletter, product detail, cart item, checkout
  form, login/register form, and footer to the existing Svelte components. Include the intended
  fields to apply, such as layout, image ratio, title style, price style, button style, badge style,
  and input style.
- If mapping confidence is low, stop and ask for confirmation instead of making random edits across
  the codebase.
- AI edits must be small and targeted. Never ask an agent to generally "make the site look like this
  HTML site." Give focused tasks like "Update ProductCard.svelte to visually match the product cards
  from the source while preserving props and add-to-cart behavior."
- Preserve accessibility attributes as well as Svelte logic. Do not remove `aria-*`, labels,
  semantic tags, keyboard behavior, focus states, or form associations.
- Never modify package manager lockfiles unless a dependency change is truly required and explicitly
  justified.

## Required Component Build Order
When an AI agent is asked to build or apply a storefront theme, it must work from the smallest
pieces upward. Do not start by hardcoding full page contents.

1. Micro components: define the smallest reusable primitives first, such as buttons, icon buttons,
   badges, section labels, price text, rating rows, image wrappers, chips, inputs, and empty/loading
   states. Match the source theme's radius, shadows, spacing, icon placement, and typography.
2. Reusable commerce components: build shared components from those primitives next, such as product
   cards, category cards, menu cards, promo cards, testimonial cards, newsletter forms, and floating
   hero info cards. These should accept data/slots where appropriate instead of duplicating markup.
3. Layout components: build or restyle header, navigation, mobile nav, footer, announcement bars,
   containers, and section wrappers after the reusable pieces exist. The source header and footer
   layout must be cloned for every new theme; do not leave the prior theme's chrome in place, and do
   not copy the source logo, names, domain, or contact identity.
4. Page sections: compose hero, category, featured products/menu, about/story, offer, testimonial,
   and newsletter sections from the reusable components.
5. Page contents: assemble the homepage and any other route last. Page files should mostly compose
   sections and pass data; repeated UI should be promoted back into reusable components before the
   page is considered complete.

If a pattern appears two or more times, extract or reuse a component instead of copying the markup.
Before reporting done, verify the hierarchy still holds: primitives first, reusable components next,
layout chrome next, page sections next, final page composition last.

## Visual Verification And Repair Loop
Visual comparison is mandatory for applied themes and homepage/component work when a browser can run
the app.

- Capture or inspect source and app renderings for the key pages that exist: home, category/product
  listing, product detail, cart, checkout, login/register, and any store-specific landing sections.
- Prefer Playwright screenshots and pixel comparison when available. Generate or update a report
  that names match quality and mismatches by area, such as header height, button radius, product
  image ratio, footer background, icon placement, and spacing between cards.
- Repair iteratively. If a mismatch is above threshold, create a focused patch for the responsible
  component only, then rerun build and visual comparison.
- For tool output, prefer a `design-migration` or `themes/<store>` artifact set containing
  `design-tokens.json`, `component-map.json`, `screenshot-report.json` when screenshots are run,
  `migration-plan.md`, generated theme CSS/Tailwind files, and component patches or changed file
  summaries.

## Non-Negotiable Rules When Restyling Components
- Design tokens come only from the generated `design-tokens.json`. Never invent or eyeball colors,
  fonts, radii, or shadows. If a value is missing, use the closest existing token.
- Style with token-based Tailwind classes (`bg-primary`, `text-foreground`, `bg-muted`,
  `border-border`, `font-heading`, `rounded`) unless the source fidelity check requires a local
  section-specific style already represented in source CSS.
- Component `<script>` blocks, props, store subscriptions, event handlers, bindings, actions,
  control-flow blocks, transitions, and slots are load-bearing: preserve all of them exactly.
- Restyling means markup and classes only unless the user explicitly asks for homepage development or
  section implementation.
- After editing any `.svelte` component by hand, run:
  `node ./tools/varni-reskin/bin/check-restyle.js --git <path>` when the file is a restyle of an
  existing component. It must pass before moving on.

## Applying Generated Theme Files
`reskin auto`/`run`/`batch` only generate theme output under `themes/<store>/`; they never touch the
live app. If the user asks to apply a theme, then and only then:
- Replace the relevant `:root` block in `src/app.css` with the generated `theme.css`.
- Merge `tailwind.theme.cjs` into `tailwind.config.js`.
- Replace or add the font `<link>` tags in `src/app.html` with `fonts.html`.
- Run `npm run build` afterward.

## Other Commands
- `node ./tools/varni-reskin/bin/reskin.js run --in <dir> --out <dir>`: single store, explicit paths.
- `node ./tools/varni-reskin/bin/reskin.js batch --in <stores> --out <themes>`: explicit batch only
  when the user clearly asks for batch processing.
- `/reskin-store <static-site-dir>`: interactive, higher-touch workflow for stores that diverge a lot
  from stock Litekart.
