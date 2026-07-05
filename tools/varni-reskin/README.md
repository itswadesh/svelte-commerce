# varni-reskin

Zero-interaction design transplant: feed it one static HTML/CSS/JS store, get back a complete
svelte-commerce / Litekart theme — CSS variables, Tailwind config, store config, fonts, and
(optionally) AI-restyled components. The default workflow is one store at a time; batch mode exists
only for explicit batch requests.

```
static site files ──▶ EXTRACT ──▶ ANALYZE ──▶ GENERATE ──▶ AI RESTYLE ──▶ VERIFY
                     css-tree     OKLCH        theme.css    Claude Code    Playwright
                     cheerio      clustering   tailwind     (or API)       pixel diff
                                  role assign  store.config guardrailed
```

The AI step runs on **Claude Code** by default — your subscription login, no API key. An API engine exists as a fallback for environments without the `claude` binary.

```
> /reskin ./stores/organic
```

or just ask in plain language. The CLAUDE.md fragment instructs Claude Code to run
`reskin auto --in <single-store-path>` whenever you ask it to reskin a store, without asking you for
`--out`/`--repo`/`--concurrency` first. If you pass a parent folder such as `stores/`, it must stop
and ask which one store to process.

## Switchable storefront themes

Generated/applied themes must coexist. The live app chooses the active theme from config instead of
overwriting the app into one permanent design.

- Use `.env` for local/deployment selection: `PUBLIC_STOREFRONT_THEME=limelight`.
- Admin/store settings can override env later through fields such as `store.theme`,
  `store.activeTheme`, `store.themeName`, `store.settings.theme`,
  `store.plugins.themeSettings.theme`, or `store.plugins.themeSettings.activeTheme`.
- The root layout exposes `data.theme` and `data-theme="<theme-name>"`.
- Theme-specific homepage/nav/footer/component code must be guarded by the active theme. limelight copy,
  images, restaurant sections, and icon choices should only render when the active theme is `sarab`.
- Homepage theme copy/assets must live in the theme layer, not inline in route files. Put hero copy,
  SEO title/image, section labels/headings/body copy, decorative image paths, gallery/testimonial/team
  entries, static story/history blocks, empty-state copy, and CTA labels in the active theme config.
  Route files should render `themeContent` plus API commerce data.
- Homepage data other than the actual product list must come from static theme content and
  theme-local assets. Do not replace the theme hero, promo banners, newsletter/app banners, section
  copy, trust badges, stats, testimonials, blog teasers, or decorative category/promo presentation
  with API `desktopBanners`, `mobileBanners`, page layouts, page metadata, or loading state.

```
node ./tools/varni-reskin/bin/reskin.js auto --in ./stores/organic
```

## Automatic design contract

When the instruction is `Match the design of "stores/<store>"`, agents must run the design contract
steps automatically. For Sarab, that means:

```bash
npm run design:extract -- --source stores/sarab --out themes/sarab/design-contract.json
npm run design:verify -- --contract themes/sarab/design-contract.json --url http://127.0.0.1:5173/
```

For another store, replace both `sarab` path segments with that store name. Run extraction before
editing app files when source HTML/CSS exists. Run verification after the app is running and before
reporting the match complete. Any failed verification item is a repair task for the responsible
section or component.

## Source fidelity rule

Use the repository `skills.md` frontend design implementation skill when applying a new design. The
workflow starts by building/updating that theme's own `themes/<theme>/DESIGN.md` (one DESIGN.md per
theme, kept inside the theme folder — never a shared root `DESIGN.md`), identifying all sections, creating a development
plan, listing required assets, explaining responsive behavior, and covering structure, markup,
styling, interactions, responsive breakpoints, and final optimization.

Implement with SvelteKit, existing Svelte components, shadcn, Tailwind, and Svelte 5 runes. Modify or
reuse existing pages/components instead of creating replacements, use exact design font sizes when
specified, and show loading indicators inside clicked/async buttons. For new designs, apply settings
colors first (`primary`, `primary foreground`, `secondary`, `secondary foreground`, `accent`,
`accent foreground`), then build header/footer, product component, home/PLP/PDP in parallel, and all
other pages in parallel.

The current input design is the source of truth for that store. Convert the supplied HTML/CSS,
screenshot, Figma, image, or static template into a fully working SvelteKit ecommerce frontend while
preserving existing app logic. Do not freeze one store's design as a global baseline; derive a fresh
visual baseline from the current source design each time.

When source HTML/CSS is available, extract a section-level design contract before editing app files.
Capture section order, class/selector mapping, text, card counts, image paths, icon classes/roles,
backgrounds/gradients, typography, spacing, radius, shadows, buttons, palette usage, and responsive
media rules. Use screenshots only as final QA, not as the primary reconstruction method.

Container and spacing fidelity are hard requirements. Treat source container max-width, gutters,
section padding, margins, gaps, grid tracks, card dimensions, and carousel/item spacing as computed
contract values. If the source uses Bootstrap or another framework, translate utilities such as
`container-*`, `row`, `col-*`, `g-*`, `p-*`, `px-*`, `py-*`, `m-*`, `mb-*`, and `my-*` to actual
computed values at each required breakpoint. Do not replace them with guessed `clamp()` expressions,
arbitrary Tailwind spacing, or approximate visual rhythm unless the source itself uses those
responsive formulas.

Every template section must be reproduced section-by-section exactly as specified by the input
design. Preserve the original section order, layout structure, content hierarchy, visible
text/casing, images, icons, backgrounds, colors, typography, spacing, borders, shadows, responsive
behavior, hover states, and micro-interactions. Do not skip, merge, reorder, simplify, or substitute
a source section unless the user explicitly approves it. Complete and verify one section against the
source before moving to the next.

Borders, font boldness, icons, and spacing are hard computed-style requirements. Capture and
reproduce exact `font-weight`, border width/style/color/radius on every side, divider lines, button
outlines, card outlines, icon source/type, icon size, stroke width, fill, color, and placement. Do
not change regular text to bold, bold text to regular, source image icons to generic icons, line
icons to filled icons, or bordered elements to unbordered elements.

Font family names are hard requirements too. If the source uses a named `@font-face` family such as
`queens`, download/use that source font asset and wire it locally; do not substitute a lookalike
Google/system font such as Cormorant unless the source font is unavailable and the exception is
explicitly documented.

The generated theme and any homepage/component work that follows it must match the source section
before inventing anything. Read the source HTML and CSS for the exact section being implemented and
preserve its visual contract: background color, layout, spacing, radius, shadows, typography scale,
CTA shape, images, floating cards/badges, and icon roles.

Preserve palette balance, not just token existence. If secondary/accent colors appear as visible
bands, panels, badges, gradients, or section backgrounds, carry those visible color areas into the
final app.

Do not turn a source light hero into a dark hero. Do not turn source pill buttons into rectangular
buttons. Icons are design requirements: map source icon intent to the closest installed app icon
equivalent and verify placement, size, color, and semantic role before calling the section complete.
Do not substitute nearby ecommerce icons such as cart/bag when the source uses a different icon like
truck/fast-delivery.

Section labels/eyebrows and hero typography must match the current source design exactly. Copy the
source text, casing, font family, weight, color, margin, and computed font-size behavior from the
source selectors/classes for that design. Before calling a homepage complete, inspect the rendered
app and confirm the hero title size and visible section labels match the current source at the
current viewport and mobile breakpoint.

Known failure pattern to prevent: merely copying tokens is not enough. A source green section must
remain a visible green section, a source red order card must remain red, a source truck/fast-delivery
icon must not become a cart icon, source heading/label sizes must match computed CSS, and source card
counts must survive in the working Svelte page.

## Design migration architecture

This tool is a design migration system, not an HTML/CSS-to-SvelteKit ecommerce rewrite. The existing
SvelteKit app remains the logic source for product listing, product detail, cart, checkout,
login/register, search, categories, account pages, API calls, routing, stores, and data structures.
Only the visual layer is migrated.

The migration flow should be:

1. Parse static HTML and CSS.
2. Extract design tokens: colors, fonts, spacing, radius, shadows, button styles, card styles,
   container widths, header/footer layout, product-card layout, input styles, badges, and navigation.
3. Detect reusable static blocks: header, footer, hero, product card, product grid, category card,
   banner, newsletter, form fields, and buttons.
4. Map static blocks to existing Svelte components with confidence scores and applied visual fields.
5. Generate theme files and a migration plan.
6. Patch mapped components only, preserving props, stores, API calls, events, conditionals, loops,
   slots, accessibility attributes, and ecommerce behavior.
7. Run check/build.
8. Use Playwright screenshots or rendered inspection to compare key pages when possible: home,
   category/product listing, product detail, cart, checkout, and login/register.
9. Repair visual drift with focused component patches only.

Live commerce content must come from the app/API. Do not hardcode real products, prices, inventory,
stock, cart items, checkout data, account data, or user-specific data in theme/page/component work.
Static source HTML is a visual/content reference for theme-owned homepage sections. On the homepage,
only the actual live product list should depend on API product data; all non-product-list homepage
content must load from static theme content and theme assets, including banners. If API product data
is missing, render loading/empty states or hide that commerce grid; never invent live products to
fill the design.

Do not put theme-owned homepage content inline in route files. Theme-owned content belongs in theme
config/modules; API-owned commerce content belongs in API/composables/stores.

Expected artifacts should include `design-tokens.json`, `component-map.json`, `migration-plan.md`,
generated theme CSS/Tailwind files, `screenshot-report.json` when screenshots are run, and component
patches or changed-file summaries.

## Component build order

Agents must build storefronts from the smallest reusable pieces upward:

1. Micro components: buttons, icon buttons, badges, section labels, price text, rating rows, image
   wrappers, chips, inputs, and empty/loading states.
2. Reusable commerce components: product cards, category cards, menu cards, promo cards,
   testimonial cards, newsletter forms, and floating hero info cards.
3. Layout components: header, navigation, mobile nav, footer, announcement bars, containers, and
   section wrappers.
4. Page sections: hero, categories, featured products/menu, about/story, offer, testimonials, and
   newsletter.
5. Page contents: route files compose sections and pass data last.

If a visual pattern appears two or more times, extract or reuse a component instead of copying markup
into a page.

## Manual CLI (same tool, if you'd rather run it yourself)

```bash
npm link          # makes the `reskin` command available globally, from anywhere in this folder
```

## Single store

```bash
npm run design:extract -- --source stores/organic --out themes/organic/design-contract.json
```

Produces in `./themes/aarna/`:

| File | What it is | Where it goes in svelte-commerce |
|---|---|---|
| `design-tokens.json` | Full extracted design DNA | reference / debugging |
| `theme.css` | `:root` CSS variables (shadcn HSL format) | replace the `:root` block in `src/app.css` |
| `tailwind.theme.cjs` | Tailwind theme extension | `theme: { extend: require('./themes/aarna/tailwind.theme.cjs') }` in `tailwind.config.js` |
| `store.config.json` | Store name, logo, favicon, fonts, theme color | your store provisioning script / DB |
| `fonts.html` | Google Fonts `<link>` tags | `src/app.html` `<head>` |
| `REPORT.md` | Palette table, fonts, warnings, detected sections | read this when a store looks off |

## Batch — all 108 storefronts

```bash
# Input layout: one folder per store
stores/
  varni-001/ index.html css/ …
  varni-002/ …

reskin batch --in ./stores --out ./themes --concurrency 6
# → themes/varni-001/…, themes/varni-002/…, themes/batch-summary.json

# or, with reskin.config.json set up (out/concurrency/engine from config):
reskin auto --in ./stores
```

A store with broken CSS won't kill the batch — it's logged in `batch-summary.json` and the run continues.

## AI component restyle (structural, not just tokens)

Tokens change colors/fonts/radii. Layout structure (header composition, product-card anatomy, footer columns) needs component rewrites — that's the AI step. Two ways to run it, both on your Claude Code subscription:

### A) Headless batch (zero interaction) — default

Requires Claude Code installed and logged in once (`npm i -g @anthropic-ai/claude-code`, then run `claude` and log in):

```bash
reskin run --in ./client-site --out ./themes/aarna --repo /path/to/svelte-commerce
```

Engine selection is automatic: `claude` binary found → headless `claude -p` calls on your subscription; else `ANTHROPIC_API_KEY` set → direct API; else the restyle step is skipped (tokens are still generated). Force with `--engine claude-code|api`. Each component is a pure text transform piped through stdin — no tool permissions needed, so headless runs never block on a prompt. Tune with `CLAUDE_BIN` (binary path) and `RESKIN_CC_TIMEOUT_MS` (default 300s/component).

### B) Interactive Claude Code session (highest quality)

For a store whose layout diverges a lot from stock Litekart, run the reskin *inside* Claude Code with full repo context — it can inspect neighboring components, run `svelte-check`, and iterate against the build:

```bash
# one-time setup in your svelte-commerce repo:
cp -r varni-reskin /path/to/svelte-commerce/tools/varni-reskin
mkdir -p /path/to/svelte-commerce/.claude/commands
cp varni-reskin/claude-code/commands/reskin-store.md /path/to/svelte-commerce/.claude/commands/
cat varni-reskin/claude-code/CLAUDE.md.fragment >> /path/to/svelte-commerce/CLAUDE.md

# then per store:
cd /path/to/svelte-commerce
claude
> /reskin-store ../stores/varni-001
```

The slash command walks Claude Code through the exact workflow: run the deterministic extractor, apply theme files, restyle components under the logic-preservation contract, and verify every edit with `check-restyle.js --git` plus `svelte-check` and a full build before finishing. The CLAUDE.md fragment makes the rules stick across sessions.

In both modes, each section detected in the static site (header, hero, product-card, footer…) is paired with your existing component and restyled under a hard contract: **script block, props, stores, event handlers, bindings, and control-flow blocks must all survive; only markup and classes change.**

Every output passes a deterministic guardrail before being accepted: all `on:`, `bind:`, `use:`, `{#if}/{#each}`, and `export let` tokens from the original must exist in the output. Failures are saved as `.rejected.svelte` and your original is kept — a hallucinated component can never reach a store.

Restyled files land in `<out>/components/`. Add `--write` to also overwrite them in the repo (recommended only when the repo is a per-store branch/fork and CI runs your test suite after).

**Edit `config/component-map.json` once** to match your actual component paths in svelte-commerce — the shipped map uses common paths; yours may differ (e.g. `src/lib/components/product/ProductCard.svelte`). This is a one-time setup, then all 108 stores reuse it.

## Visual verification (optional)

```bash
npm i -D playwright pngjs pixelmatch && npx playwright install chromium
# with the reskinned SvelteKit dev server running:
reskin run --in ./client-site --out ./themes/aarna --verify-url http://localhost:5173
```

Writes `verify/source.png`, `verify/reskinned.png`, `verify/diff.png` and a pixel-drift percentage — your automated "does it actually look like the client's site" gate.

## CI recipe (GitHub Actions)

CI runners have no Claude Code login, so batch there uses the API engine (or run the batch locally where you're logged in and let CI only build + verify):

```yaml
- run: npm ci && npm link
- run: reskin batch --in stores --out themes --repo . --engine api --concurrency 4
  env: { ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }} }
- run: npm run build   # SvelteKit build catches any component syntax issue
- uses: actions/upload-artifact@v4
  with: { name: themes, path: themes }
```

Local batch on your subscription instead:

```bash
reskin batch --in ./stores --out ./themes --repo . --concurrency 2   # engine auto → claude-code
```

Keep `--concurrency` low (1–2) with the claude-code engine: each component is a full `claude -p` session and subscription rate limits apply — 108 stores is a leave-it-running-overnight job, not a 10-minute one.

## How role assignment works (deterministic)

Every color occurrence is weighted by context: colors on `button/.btn/.cta/:hover` selectors score as brand candidates; large-surface `background`s as background; body `color` as foreground. Occurrences are clustered in OKLCH space (near-duplicates merge), then roles are assigned: most-weighted light surface → `background`, dark text → `foreground`, highest-scoring chromatic → `primary`, next distinct hues → `secondary`/`accent`. Colors used only in `.error/.sale/.danger` contexts are excluded from brand ranking and mapped to `destructive`. Same input always produces the same theme.

`REPORT.md` flags low-confidence cases: WCAG contrast failures inherited from the source design, or sources with no chromatic colors.

## Notes & limits

- Works on file-based static sites. If a client only has a live URL, `wget -p -k <url>` it first (a `fetch` pre-step is an easy addition).
- JS files are accepted but currently only scanned indirectly (styles injected by JS at runtime aren't seen). If a client site is styled via JS, render it with Playwright first and save the DOM.
- The AI step is roughly 8 components × ~10K tokens per store. On the claude-code engine this draws from your subscription usage limits; run token-only (no `--repo`) for stores whose layout stays standard Litekart — the theme swap alone covers most reskins.
- `bin/check-restyle.js` works standalone (`--git <path>` compares HEAD vs working tree) — wire it into a pre-commit hook or CI so *any* component edit, human or AI, is checked.
