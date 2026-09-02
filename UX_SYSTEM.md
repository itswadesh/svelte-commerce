# Svelte Commerce UX system

This is the stable, project-wide UX and design-system contract for the storefront. It is layered
on purpose so that page work never restates the rules:

1. **Stable master prompt** (sections 3–8): permanent UX, design-system, accessibility and
   engineering rules. Change only when the product direction changes.
2. **Project context** (sections 1–2): brand, audience, stack and constraints. Update only when
   the product or stack changes.
3. **Page task**: one or two lines naming the route or component to improve. See section 9.

Do not repeat colours, spacing, component behaviour, accessibility rules or responsive rules in a
page task. Those belong here. Repository-level findings live in `docs/UX_AUDIT.md`.

---

## 1. Project context

```text
Product: Svelte Commerce, an open-source headless storefront (SvelteKit), one codebase for many merchants.
Primary users: shoppers on a merchant's storefront, majority on mobile; merchants configure, they do not code.
Merchant types: multi-category by design. Shipped themes: default (editorial), wine, organic, lime, noor.
                The public demo (arialshop.com, Litekart) is a jewellery store; treat it as one merchant, not the product.
Primary business goal: conversion, with product discovery as the path to it.
Brand personality (system baseline, per-theme tokens on top): quiet, product-first, trustworthy, fast, compact.
Current stack: SvelteKit 2.17 · Svelte 5.19 (runes: $props/$state/$derived; no <svelte:component>)
               TypeScript 5.7 · Vite 6 · Bun for scripts
               Tailwind CSS 3.4 (+ tailwindcss-animate, @tailwindcss/typography, tailwind-scrollbar,
               tailwind-variants, tailwind-merge, clsx)
               shadcn-svelte 0.14 (style "new-york", base "slate") on bits-ui 1.0-next
               vaul-svelte (mobile drawers/sheets) · embla-carousel-svelte (carousels)
               @lucide/svelte (icons) · svelte-sonner (toasts) · sveltekit-superforms + formsnap + zod (forms)
               @misiki/kitcommerce-core (services, stores, composables, load functions, SEO/analytics plugins)
Supported backends: 26 connectors (@misiki/<platform>-connector). Exactly one is active, chosen by the single
               uncommented export in kitcommerce.config.ts (currently GoCommerce). App code never imports a
               connector by name; everything resolves through $lib/core/services.
Must preserve: backend-neutral components, SSR, SEO (SeoHeader/Canonical/structured data), analytics hooks,
               cart/checkout/auth logic, URL and query-parameter contracts, data-testid hooks used by tests,
               and runtime theme switching (data-theme on the root wrapper).
Primary locale/currency: store-driven at runtime. Defaults in src/lib/core/connectors/default-store.json are
               en / USD; the Litekart demo runs INR. Never hard-code either.
Accessibility target: WCAG 2.2 AA.
Performance target: fast, stable pages with visible loading states and no avoidable layout shift.
```

## 2. Codebase map for UX work

| Concern | Where it lives | Notes |
| :-- | :-- | :-- |
| Design tokens (source of truth) | `src/app.css` | HSL triplets on `:root` and one `[data-theme='…']` block per theme; `--radius`, `--container-max`, `--container-gutter`, `--font-heading`, `--font-body`. |
| Token → utility mapping | `tailwind.config.ts` | `bg-background`, `text-foreground`, `text-muted-foreground`, `border`, `bg-primary`, `bg-muted`, `bg-card`, `bg-popover`, `bg-success`, `bg-destructive`, `ring`; radius scale derived from `--radius`; shadows `shadow-xs`, `shadow-z-1/z-2/z-10`. |
| Page container | `.page-width` in `src/app.css` | The single content rail: `min(--container-max, 100% - 2 × --container-gutter)`. Use it; do not add another max-width. |
| Headless/accessible primitives | `src/lib/components/ui/*` | shadcn-svelte on bits-ui: button, input, select, dialog, sheet, drawer, popover, dropdown-menu, tabs, collapsible, skeleton, tooltip, checkbox, radio-group, switch, pagination, table, sonner. |
| Storefront components | `src/lib/components/*` | nav (header, mega-menu, search, cart drawer, bottom nav), product-catalogue (listing, filters, product card), home, cart, checkout, address, auth, common (footer, pagination, modal). |
| Theme-specific surfaces | `src/lib/theme/<theme>/*` | Each theme owns a homepage; lime and noor also own a nav, footer and product card. Section library in `src/lib/theme/sections`. |
| Routes | `src/routes/(www)`, `(my)`, `(legal)` | Product page UI is in `src/routes/(www)/products/[slug]/components`. Listing routes: `/products`, `/categories/[slug]`, `/collections/[slug]`, `/[slug]`. Checkout: `/checkout/{cart,address,payment,success,failed}`. |
| Core (from the npm package) | `@misiki/kitcommerce-core` via `$lib/core/*` | Services, stores (cart/wishlist/user/product), composables, load functions, SEO and analytics plugins, `LazyImg`, `getImageCDNUrl`. Not editable here; the UI is. |
| Tests | `tests/*.test.ts` (vitest + testing-library), `tests/*.spec.ts` (Playwright, baseURL `http://localhost:3000`) | Keep `data-testid` hooks stable. |

Commands: `bun run dev` · `bun run check` (svelte-check) · `bun run test:unit` · `bun run test` (Playwright) · `bun run format`.

The semantic token names used in this document map onto the existing variables. Do not add a
second token vocabulary; extend `src/app.css` and `tailwind.config.ts` when a primitive is
genuinely missing.

| Semantic name | Existing variable / utility |
| :-- | :-- |
| canvas | `--background` · `bg-background` |
| surface | `--card` / `--popover` · `bg-card`, `bg-popover` |
| surface-muted | `--muted` · `bg-muted` |
| text | `--foreground` · `text-foreground` |
| text-muted | `--muted-foreground` · `text-muted-foreground` |
| border | `--border` · `border` (default border colour) |
| primary / primary-hover | `--primary` · `bg-primary`; hover is `hover:bg-primary/90` until a dedicated token exists |
| accent | `--accent` · `bg-accent` |
| success | `--success` · `bg-success` |
| warning | not defined yet; add `--warning` / `--warning-foreground` in `src/app.css` and `tailwind.config.ts` before first use |
| danger | `--destructive` · `bg-destructive` |
| focus | `--ring` · global `:focus-visible` ring in `src/app.css` |

Known foundation gaps to close through the design system, not inside pages: no `warning` token,
no `primary-hover` token, no named z-index scale (arbitrary `z-[…]` values compete), no
motion-duration tokens, `dark:` utilities are emitted without a dark token set, and
`src/routes/styles.css` is an unused SvelteKit starter stylesheet. `docs/UX_AUDIT.md` holds the
current state and priorities.

---

## 3. Product direction

Use a **quiet, product-first commerce system**: modern, compact, trustworthy, fast, and easy to
scan. The product and its decision-making information carry the page, not decoration.

Use these products as references for principles, not as layouts to copy:

- **Shopify:** efficient commerce patterns, clear actions, predictable system behaviour.
- **Apple:** strong hierarchy, disciplined typography, product-led presentation.
- **Stripe:** clear information grouping, polished states, restrained visual depth.
- **Linear:** compact density, consistent spacing, minimal interaction noise.
- **Baymard research:** product discovery, filtering, product-page, cart and checkout behaviour.

The storefront must remain themeable for different merchants. Brand identity is expressed through
tokens, media, typography and limited accent treatments, not page-specific CSS rewrites.

## 4. Implementation architecture

Build on the small design system that already exists:

- CSS custom properties in `src/app.css` are the source of truth for tokens.
- Tailwind utilities mapped to semantic tokens in `tailwind.config.ts`.
- The accessible headless primitives already in use: shadcn-svelte on bits-ui, vaul-svelte for sheets.
- Reusable Svelte 5 components with documented sizes, variants, states and responsive behaviour.
- A dedicated internal `/design-system` route (or Storybook) for component review once components are shared.

Do not introduce a second competing UI library. Preserve working commerce logic and replace visual
structure incrementally.

### Foundation tokens

- Colours: `canvas`, `surface`, `surface-muted`, `text`, `text-muted`, `border`, `primary`,
  `primary-hover`, `accent`, `success`, `warning`, `danger`, `focus` (mapped in section 2).
- Typography: `font-sans` (`--font-body`) for UI and commerce data; `font-serif` (`--font-heading`)
  only for controlled editorial headings.
- Spacing: a 4px base scale of 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 (Tailwind 1–16).
- Radius: 8px for controls, 12px for cards, 16px for large surfaces, expressed through the
  `--radius`-derived scale (`rounded-sm/md/lg/xl`) so square themes stay square. No arbitrary radii.
- Elevation: borders for normal grouping; shadows only for floating layers (dialogs, menus,
  drawers, sticky controls).
- Motion: 120–180ms for feedback, 180–240ms for panels. Respect `prefers-reduced-motion`.

### Density rules

- Desktop controls may be 36–40px high, but the interactive area must stay easy to target.
- Mobile interactive controls are normally at least 44px high.
- Gutters: 16px mobile, 24px tablet, 32px desktop (the `--container-gutter` clamp).
- One content container with a sensible maximum width, normally 1280–1440px.
- Prefer fewer, better-grouped surfaces over cards inside cards.
- Avoid oversized headings, excessive vertical gaps, pill-shaped styling everywhere, heavy
  gradients, glassmorphism and decorative animation.

### Type scale

- Body: 14–16px, line-height 1.45–1.6.
- Supporting text: 12–14px, never low-contrast merely to appear elegant.
- Page title: 28–40px depending on viewport. Section title: 22–32px.
- Product price: prominent, but not larger than the product title hierarchy requires.
- Weights: 400, 500, 600 and one display weight.

---

## 5. Permanent UX rules

### Global navigation

- Keep the desktop header to a compact utility row plus a clearly organised category row, only
  when both are necessary.
- Make search immediately visible on desktop and reachable in one tap on mobile.
- Use distinct category names. Merge overlapping items such as "Custom" and "Custom Design".
- Keep wishlist, account and cart icons consistent, labelled for assistive technology, and large
  enough to operate.
- Use a focused mega-menu with grouped categories, clear hover/focus behaviour, a backdrop and
  keyboard navigation.
- Preserve user context when returning from a product page to a list: filters, sort, pagination
  and scroll position.

### Homepage

- One primary story and one primary action above the fold.
- Then category discovery, a focused product collection, concise trust evidence, and only the
  highest-value editorial content.
- Limit repeated carousels. Prefer a stable grid when users need to compare products.
- Remove duplicated content and low-value sections. A compact homepage leads to products quickly.
- Match every headline and CTA to the imagery shown.

### Search and product listing

- Useful autocomplete: query suggestions, categories, recent searches, and a few products.
- Result counts accurate and synchronised with filters; counts share the query/filter scope.
- Hide zero-result filter values unless they explain an already-selected state.
- Active filters as removable chips above the grid, with "Clear all".
- Sticky mobile toolbar for **Filter** and **Sort**; filters open in a bottom sheet or full-height drawer.
- Desktop filters easy to scan with counts, sensible defaults, and collapsed low-priority groups.
- Product cards prioritise image, product name, price, meaningful variant information,
  availability and wishlist. No repeated merchant name in a single-brand shop.
- Do not hide the meaningful difference between similar products through aggressive truncation.
- Reserve image dimensions and show skeletons to prevent layout shift.

### Product page

- Balanced gallery/purchase layout; keep the purchase panel visible on desktop when practical.
- Name, price, selected variant, availability, delivery/returns summary and primary CTA visible
  without unnecessary scrolling.
- Variant selection unambiguous: selected, available, unavailable, loading and error states look different.
- Many sizes or variants: progressive disclosure, a select/popover, or grouped options, not a wall of pills.
- Update price, media, SKU and availability together when variants change.
- Sticky mobile Add to Cart bar only after the primary CTA scrolls out of view.
- Zoomable images and an accessible non-WebGL fallback for 3D/AR media. Purchasing never depends on 3D support.
- Specifications, care, shipping and returns in clear accordions below the purchasing decision.
- Reviews, recommendations and recently viewed products useful and restrained.

### Cart and checkout

- Cart drawer for quick confirmation; cart page for review and editing.
- Quantity, remove, save-for-later, variant, price, discount, shipping estimate and subtotal understandable.
- One unmistakable checkout CTA; no competing primary buttons.
- Guest checkout allowed; delay account creation until it offers a clear benefit.
- Persistent labels, inline validation, correct input types and autocomplete; never clear valid
  fields after an error.
- Order summary visible on desktop; collapsible but discoverable on mobile.

## 6. States and feedback

Every component defines: default, hover, active/pressed, focus-visible, disabled, loading, empty,
error, success. Never show a blank page or region while data loads: stable skeletons for first
load, subtle progress for later updates.

## 7. Accessibility and performance

- WCAG 2.2 AA. Semantic HTML first; ARIA only when native semantics are insufficient.
- Visible keyboard focus, logical focus order, dialog focus trapping, Escape-to-close.
- Sufficient text, icon, border and focus contrast.
- Pointer targets meet WCAG minimums; about 44px for important mobile actions.
- Keyboard-only, screen reader, 200% zoom, reduced motion and forced-colours support where practical.
- Optimise images, fonts, API waterfalls and hydration. Reserve dimensions to prevent layout shift.
- Do not sacrifice usability for Lighthouse scores, but treat slow LCP, CLS and interaction
  latency as UX defects.

---

## 8. Stable master prompt

> You are the senior product designer and Svelte/SvelteKit frontend engineer responsible for Svelte Commerce. Your job is to improve the storefront as a cohesive commerce product, not redesign isolated screens.
>
> Work in this order:
>
> 1. Inspect the existing route, related components, data states, responsive behavior, and existing design tokens before proposing changes.
> 2. Audit UX first. List issues by Critical, High, Medium, and Low priority. For each issue, state the evidence, user impact, and recommended correction.
> 3. Preserve working commerce behavior, API contracts, SEO, analytics, and accessibility. Do not remove features simply to make the page cleaner.
> 4. Apply the shared Svelte Commerce design system. Reuse semantic tokens and existing components. Do not add one-off colors, spacing, typography, radii, shadows, or component variants inside a page unless the design system genuinely lacks the required primitive.
> 5. Make the experience modern, compact, product-first, and calm. Use strong hierarchy, disciplined spacing, clear content, restrained motion, and minimal decorative noise. Do not use excessive gradients, glassmorphism, oversized text, nested cards, or pills for every control.
> 6. Use Shopify for commerce clarity, Apple for hierarchy, Stripe for polished information grouping, Linear for compact density, and Baymard research for e-commerce behavior. Borrow principles only; do not copy another product's brand or layout.
> 7. Design mobile-first, then verify at 360px, 390px, 768px, 1024px, 1280px, and 1440px. Important mobile actions should have approximately 44px touch targets. Desktop may look compact without making the interaction area difficult to use.
> 8. Meet WCAG 2.2 AA: semantic HTML, visible focus, keyboard operation, adequate contrast, understandable labels, meaningful alt text, accessible dialogs/drawers, and reduced-motion support.
> 9. Define and implement loading, empty, error, disabled, success, hover, active, and focus-visible states. Never leave blank areas while waiting for data. Reserve media dimensions to prevent layout shift.
> 10. Prefer existing Svelte and headless UI primitives. Do not introduce another UI library without a clear project-wide reason. Keep components reusable, typed, and backend-agnostic.
> 11. Keep content concise and helpful. Use plain language, sentence case, descriptive labels, and one clear primary action per decision area.
> 12. Before implementation, show a short design plan covering hierarchy, components, responsive behavior, and states. Then implement the smallest complete vertical slice.
> 13. After implementation, verify functionality, keyboard navigation, responsive layout, console errors, loading behavior, and visual consistency. Summarize what changed, what remains, and any assumptions.
>
> Storefront-specific UX rules:
>
> - Navigation and search must make product discovery immediate.
> - Filter counts must be accurate; hide irrelevant zero-result values; show removable active-filter chips and Clear all.
> - Product cards prioritize image, meaningful name, price, important variant/availability information, and wishlist. Avoid repeated single-brand labels.
> - Product pages prioritize media, price, variant selection, availability, delivery/returns confidence, and Add to Cart. Large option sets require progressive disclosure. 3D/AR must always have a usable fallback.
> - Cart and checkout must minimize distraction, preserve valid input, explain errors next to fields, support guest checkout, and make totals transparent.
>
> When requirements are incomplete, infer sensible defaults from the existing product and design system. Ask a question only when the answer would materially change the architecture, brand direction, or purchasing flow.

---

## 9. Page task template

This is the only part that changes regularly:

```text
Apply the Svelte Commerce UX master prompt to [route/component].
Audit the current experience first, then improve it using the shared design system.
Preserve all existing functionality and API behavior.
Focus this iteration on: [optional page-specific goal].
```

Example:

```text
Apply the Svelte Commerce UX master prompt to the product-list route.
Audit first, then improve filter usability, product-card scanability, loading states, and mobile filter/sort behavior.
Preserve current URLs, query parameters, analytics, and backend adapters.
```

## 10. Definition of done for every redesign task

- UX audit completed before visual changes.
- Uses shared tokens and reusable components; no unexplained one-off styling.
- Works at all defined breakpoints without clipping or horizontal scrolling.
- All data states are designed and implemented.
- Keyboard and screen-reader-critical flows work.
- Main actions have clear labels and adequate target sizes.
- Product data, counts, prices, variants, totals and availability are consistent.
- No new console errors or broken navigation (`bun run check` clean for touched files).
- Loading feedback appears immediately and layout remains stable.
- The page feels like the same product as every other Svelte Commerce page, in every shipped theme.
