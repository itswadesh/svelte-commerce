# Svelte Commerce

Open-source headless storefront: SvelteKit 2 + Svelte 5 (runes) + TypeScript + Tailwind 3.4 +
shadcn-svelte/bits-ui, talking to any of 26 commerce backends through `@misiki/*-connector`
packages. Services, stores and load functions come from `@misiki/kitcommerce-core`; the UI lives here.

## UX and design system

Every storefront UI change follows the project UX system. Read it before touching a route or
component, and audit before redesigning:

@UX_SYSTEM.md

The current repository-level audit and priorities are in `docs/UX_AUDIT.md`.

## Facts worth not rediscovering

These cost real effort to establish. Read them before exploring, and if you spawn subagents, put
the relevant ones in their prompts so each does not re-derive them.

**Verifying**

- `bun run check` is **broken**: it shells out to `sync-connector-types.js`, which is not in the
  repo, and exits before type-checking. Use `bunx svelte-check --tsconfig ./tsconfig.json` instead.
- svelte-check baseline on 2026-09-03 is **150 errors, 102 warnings, 66 files**, all pre-existing.
  Compare against that number; do not treat it as your regression.
- Unit tests: `bunx vitest run`. Playwright specs expect the app on `http://localhost:3000`.
- Playwright: launch with `chromium.launch({ channel: 'chrome' })`. The bundled browser build is
  not installed. From Git Bash, prefix a route argument with `MSYS_NO_PATHCONV=1` or `/products`
  is rewritten into a Windows path.
- `bun run dev` serves the default theme. `PUBLIC_STOREFRONT_THEME=<name>` overrides it, but only
  when the store record carries no theme of its own.

**The local backend**

- The active connector is Litekart (`kitcommerce.config.ts`), and `.env.example` points it at the
  hosted demo API: `PUBLIC_LITEKART_API_URL=https://api.litekart.in`, `PUBLIC_LITEKART_DOMAIN=arialshop.com`.
  Litekart reads store identity, menus and plugin toggles live from that API, so
  `src/lib/core/connectors/default-store.json` and `static-store.ts` are out of the picture here —
  they serve the connectors that have no store record of their own.
- The notes that used to live here about a three-product store with no images, no accounts and
  inactive `search` / `isWishlist` / `isDiscountCoupons` toggles were specific to the local
  GoCommerce backend, which has been removed. Re-verify against the live backend before treating
  any absent control as configuration rather than a bug.
- A missing product image is demo data, not a defect. A component that collapses to zero height
  because the image is missing is a defect.

**Ownership: what you may not edit**

- `src/lib/core/**` and `node_modules/**` are package-owned (`@misiki/kitcommerce-core`, the
  connectors). Wrap behaviour at the call site, or in the active connector's module under
  `src/lib/core/connectors/`; never edit in place.
- `src/lib/theme/{wine,organic,lime,noor}/**` is out of design scope. Do not break it, do not
  design for it.
- `package.json` and `bun.lock` are often modified by a parallel session working in this same
  directory. Leave them alone unless the task is about dependencies.

## Conventions

- Backend: no file names a connector. `vite.config.ts` resolves whichever `@misiki/*-connector`
  `package.json` installs (override with `PUBLIC_CONNECTOR`) and exposes it as `$connector`;
  `src/lib/core/connectors/active.ts` is the single module wrapping it, for every backend. App
  code never imports a connector package by name; use `$lib/core/services`.
- Tokens: `src/app.css` (per `[data-theme]` HSL variables) mapped by `tailwind.config.ts`. Use the
  semantic utilities (`bg-background`, `text-muted-foreground`, `border`, `bg-primary`, …), the
  `--radius`-derived `rounded-*` scale and `.page-width`. No hard-coded hex colours or arbitrary
  `z-[…]` values in components.
- Primitives: `src/lib/components/ui/*` (shadcn-svelte). Do not add another UI library.
- Svelte 5 only: `$props`, `$state`, `$derived`, snippets. No `<svelte:component>`, no legacy stores in new code.
- Formatting: Prettier (tabs, single quotes, no semicolons) — `bun run format`.
- Verify: `bun run check` for types, `bun run test:unit` for vitest, `bun run test` for Playwright
  (expects the app on `http://localhost:3000`).
