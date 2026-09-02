# Svelte Commerce

Open-source headless storefront: SvelteKit 2 + Svelte 5 (runes) + TypeScript + Tailwind 3.4 +
shadcn-svelte/bits-ui, talking to any of 26 commerce backends through `@misiki/*-connector`
packages. Services, stores and load functions come from `@misiki/kitcommerce-core`; the UI lives here.

## UX and design system

Every storefront UI change follows the project UX system. Read it before touching a route or
component, and audit before redesigning:

@UX_SYSTEM.md

The current repository-level audit and priorities are in `docs/UX_AUDIT.md`.

## Conventions

- Backend: exactly one `export * as services from …` line is active in `kitcommerce.config.ts`. App
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
