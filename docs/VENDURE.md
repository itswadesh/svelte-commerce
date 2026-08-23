# Running Svelte Commerce on Vendure

This storefront can run against a [Vendure](https://vendure.io) backend only. Commerce data (products, cart, checkout, auth, orders, addresses) comes live from Vendure's GraphQL Shop API; store identity and CMS-style content are served statically from this repo. This document covers setup, how the integration works, and its current limits.

## Quick start

1. Point the storefront at your Vendure server in `.env`:

   ```env
   PUBLIC_VENDURE_API_URL=http://localhost:3000
   ```

   The GraphQL endpoint is resolved as `<PUBLIC_VENDURE_API_URL>/shop-api`.

2. Switch the connector in `kitcommerce.config.ts` — the repo default is
   `@misiki/litekart-connector` — to the repo's Vendure override module, not the raw connector
   package (see [Why an override layer](#why-an-override-layer)):

   ```ts
   export * as services from './src/lib/core/connectors/vendure'

   export default {
   	// store identity overrides — see below
   }
   ```

3. Swap the connector package for the one your backend uses. `package.json` ships
   `@misiki/litekart-connector` as the stock choice; replace it with
   `@misiki/vendure-connector` so installs and Docker builds resolve the connector this
   storefront actually talks to:

   ```sh
   npm uninstall @misiki/litekart-connector
   npm i @misiki/vendure-connector
   npm run dev
   ```

`/health` reports ready as soon as `PUBLIC_VENDURE_API_URL` is set; the Litekart env trio
(`PUBLIC_LITEKART_API_URL`, `PUBLIC_LITEKART_STORE_ID`, `PUBLIC_LITEKART_DOMAIN`) is not required
in Vendure mode.

## Environment variables

| Variable                 | Required | Purpose                                                                    |
| ------------------------ | -------- | -------------------------------------------------------------------------- |
| `PUBLIC_VENDURE_API_URL` | yes      | Base URL of the Vendure server. GraphQL calls go to `<this URL>/shop-api`. |

Set only this connector's variables. The `PUBLIC_<CONNECTOR>_API_URL` variables double as mode
switches: if one is set while a different connector is active in `kitcommerce.config.ts`, the
hooks `init` throws at boot (see Troubleshooting). The Litekart env trio is not used in Vendure
mode.

## Required Vendure backend settings

- `authOptions.requireVerification` → `false`
- CORS: allow the storefront origin **with credentials**. The browser calls
  `PUBLIC_VENDURE_API_URL` directly and the connector sends `credentials: 'include'`, so
  `Access-Control-Allow-Origin` must echo the exact origin (not `*`) and
  `Access-Control-Allow-Credentials` must be `true`.

## Store identity

Store details (name, logo, currency, menus, plugin toggles, theme CSS variables) are not fetched
from an API in Vendure mode. They resolve as:

```
src/lib/core/connectors/default-store.json   (full default store shape)
        merged under
kitcommerce.config.ts default export          (your overrides — highest priority)
```

Until you override it, the site shows the default store name ("Test"). Typical overrides:

```ts
export default {
	name: 'My Store',
	logo: '/logo.svg',
	favicon: '/favicon.png',
	currencyCode: 'USD'
	// menu, megamenu, plugins, cssVariables, businessEmail, businessPhone, …
	// see src/lib/core/connectors/default-store.json for every available field
}
```

## How the integration works

Backend selection is a single export: the `kitcommerce.config` alias (defined in
`svelte.config.js`) resolves to `kitcommerce.config.ts`, and `@misiki/kitcommerce-core` re-exports
whatever `services` namespace that file provides. All app code imports services through
`$lib/core/services`, so swapping the export swaps the backend.

At boot, `init` in both `src/hooks.server.ts` and `src/hooks.client.ts` reads
`PUBLIC_VENDURE_API_URL` and applies it with the connector's public `setBaseUrl()`. Both hooks
matter: the server hook covers SSR, the client hook covers the browser (which must reach the
public Vendure URL in production).

Note for maintainers: import `BaseService`/`storeService` for this via the `kitcommerce.config`
alias, not `@misiki/kitcommerce-core/services` — the core services shim re-exports only the
concrete service classes and never `BaseService`, so the latter import is always `undefined`.

### Why an override layer

`@misiki/vendure-connector` only routes its GraphQL helper through the Vendure base URL. Its REST
helpers still call Litekart API endpoints (`/api/stores/public-details`, `/api/pages/*`) with
relative URLs — without a Litekart API those requests hit the app's own origin and fail, and the
store lookup failure is fatal (hooks and the root layout both require store details).

`src/lib/core/connectors/vendure.ts` re-exports the whole connector and replaces the
Litekart-REST-dependent services with static implementations:

| Service              | Behaviour in Vendure mode                                                      |
| -------------------- | ------------------------------------------------------------------------------ |
| `StoreService`       | Returns the static store config (defaults + `kitcommerce.config.ts` export)    |
| `PageService`        | Resolves empty pages/lists — no CMS backend                                    |
| `MenuService`        | Serves header/footer menus from the static store config (`menu` array)         |
| `MeilisearchService` | Autocomplete returns empty suggestions — no Meilisearch behind Vendure         |
| `ProfileService`     | Delegates to Vendure-native `activeCustomer` / `updateCustomer` (profile page) |
| `BlogService`        | Empty lists — no CMS backend (blog routes render their empty state)            |
| `WishlistService`    | Empty state; toggling shows "Wishlist is not available on this store"          |
| `CouponService`      | Empty coupon list (the cart's coupon drawer shows none)                        |
| everything else      | Unchanged: Vendure GraphQL via `<base URL>/shop-api`                           |

The Conversational Shopping assistant (`/api/commerce-assistant/*`) is Litekart-only; its widget
detects the active connector and stays hidden in Vendure mode without firing requests.

Two behaviours are driven by the static store config rather than code:

- **Search icon** — `plugins.search.active` is `false` in the defaults, which hides the nav search
  trigger (the autocomplete backend is Litekart Meilisearch). Vendure's own GraphQL search still
  powers the `/products` catalogue page.
- **Login** — `loginType` is `"EMAIL"` in the defaults, so the auth modal offers email/password
  only. Vendure has no OTP support (`getOtp` throws), while email login/signup/logout and password
  reset are native GraphQL.

### Data sources at a glance

| Data                                       | Source                           |
| ------------------------------------------ | -------------------------------- |
| Products, categories, search, PDP          | Vendure Shop API (GraphQL)       |
| Cart, checkout, payment methods, orders    | Vendure Shop API (GraphQL)       |
| Auth, customer profile, addresses          | Vendure Shop API (GraphQL)       |
| Store identity, menus, plugin toggles      | Static (`kitcommerce.config.ts`) |
| CMS pages (privacy policy, etc.), blog     | Static/empty — no CMS            |
| Theme homepage sections (hero, banners, …) | Theme layer (`themeContent`)     |

## Current limitations

From the connector capability matrix (see `README.md`): wishlist, reviews, coupons,
multi-currency/regions, Meilisearch faceted search, CMS content, and multi-vendor are not
implemented for Vendure yet. Concretely:

- Legal/CMS pages render their layout with empty content.
- Homepage sections other than the live product list must come from the active theme's static
  content (which is the standing rule for themes anyway).
- If the Vendure catalog has no matching products, commerce grids render their empty/loading
  states — the pages still work.

## Troubleshooting

- **`PUBLIC_VENDURE_API_URL is set but the vendure connector is not active in kitcommerce.config.ts`**
  — thrown by the hooks `init` when that env var is set while a different connector (e.g. the
  litekart default) is exported from `kitcommerce.config.ts`. Switch the export to
  `./src/lib/core/connectors/vendure`, or remove the env var if you meant to run Litekart.
- **`http proxy error: api/... ECONNREFUSED` in dev** — something is calling a Litekart REST
  endpoint with a relative URL; Vite proxies `/api` to `PUBLIC_LITEKART_API_URL || localhost:7000`.
  In Vendure mode that service needs a static override in
  `src/lib/core/connectors/vendure.ts`.
- **Store shows "Test" / wrong branding** — set identity overrides in the
  `kitcommerce.config.ts` default export.
- **Auth/cart works in dev but not deployed** — almost always Vendure CORS: allow the storefront
  origin with credentials (see backend settings above).
