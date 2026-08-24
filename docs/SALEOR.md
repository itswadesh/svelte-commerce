# Running Svelte Commerce on Saleor

This storefront can run against a [Saleor](https://saleor.io) backend only. Commerce data
(products, cart, checkout, auth, orders, addresses) comes live from Saleor's GraphQL API; store
identity is served statically from this repo, and the connector ships its own static placeholder
pages for CMS content. This document covers setup, how the integration works, and its current
limits.

## Quick start

1. Point the storefront at your Saleor GraphQL endpoint in `.env`:

   ```env
   PUBLIC_SALEOR_API_URL=https://your-store.saleor.cloud/graphql/
   ```

2. Switch the connector in `kitcommerce.config.ts` — the repo default is
   `./src/lib/core/connectors/litekart` — to the repo's Saleor override module, not the raw
   connector package (see [Why an override layer](#why-an-override-layer)):

   ```ts
   export * as services from './src/lib/core/connectors/saleor'

   export default {
   	// store identity overrides — see below
   }
   ```

3. Swap the connector package for the one your backend uses. `package.json` ships
   `@misiki/litekart-connector` as the stock choice; replace it with
   `@misiki/saleor-connector` so installs and Docker builds resolve the connector this
   storefront actually talks to:

   ```sh
   npm uninstall @misiki/litekart-connector
   npm i @misiki/saleor-connector
   npm run dev
   ```

`/health` reports ready when `PUBLIC_SALEOR_API_URL` is set and the Saleor connector is active;
the Litekart env trio (`PUBLIC_LITEKART_API_URL`, `PUBLIC_LITEKART_STORE_ID`,
`PUBLIC_LITEKART_DOMAIN`) is not required in Saleor mode.

## Environment variables

| Variable                | Required | Purpose                                                                            |
| ----------------------- | -------- | ---------------------------------------------------------------------------------- |
| `PUBLIC_SALEOR_API_URL` | yes      | Full Saleor GraphQL endpoint URL, e.g. `https://your-store.saleor.cloud/graphql/`. |

Set only this connector's variables. The `PUBLIC_<CONNECTOR>_API_URL` variables double as mode
switches: if one is set while a different connector is active in `kitcommerce.config.ts`, the
hooks `init` throws at boot (see Troubleshooting). The Litekart env trio is not used in Saleor
mode.

## Required Saleor backend settings

- Require email confirmation for user registration → `false`
- `isPhoneMandatory` → `false`
- Allow unpaid orders in **order settings** → enabled
- Allow unpaid orders in **channel settings** → enabled
- CORS: allow the storefront origin — the browser calls `PUBLIC_SALEOR_API_URL` directly.

## Store identity

Store details (name, logo, currency, menus, plugin toggles, theme CSS variables) are not fetched
from an API in Saleor mode. They resolve as:

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

At boot, `init` in both hooks (via `src/lib/core/connectors/init.ts`) applies
`PUBLIC_SALEOR_API_URL` to the connector's `BaseService.SALEOR_API_URL` static. Both hooks
matter: the server hook covers SSR, the client hook covers the browser (which must reach the
public Saleor URL in production). The `init` guard fails loudly if `PUBLIC_SALEOR_API_URL` is set
while a different connector is active.

### Why an override layer

`@misiki/saleor-connector` used to call the Litekart API endpoint `/api/stores/public-details` for
store metadata — without a Litekart API that request fails, and the store lookup failure is fatal
(hooks and the root layout both require store details).

From 1.0.4 the connector answers it itself, so `src/lib/core/connectors/saleor.ts` is down to what
only this storefront can know: it registers the store record through `setStaticStore`, hands the
connector a local resolver for the REST paths this repo can serve, and keeps a prototype-level net
(`blockRestFallbacks`) in case a service still reaches for one. The behaviour below is the
connector's:

| Service                       | Behaviour in Saleor mode                                                                                                                                                            |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `StoreService`                | Returns the static store config (defaults + `kitcommerce.config.ts` export). That config defaults `isEmailMandatory` to true — `checkoutComplete` requires an email on the checkout |
| `PageService`                 | Connector-native static dummy pages; unknown ids resolve to empty                                                                                                                   |
| `MenuService`                 | Serves header/footer menus from the static store config (`menu` array)                                                                                                              |
| `MeilisearchService`          | Autocomplete returns empty suggestions — no Litekart Meilisearch proxy                                                                                                              |
| `ProfileService`              | Delegates to Saleor-native `me` / `accountUpdate` (profile page)                                                                                                                    |
| `BlogService`                 | Empty lists — no CMS backend (blog routes render their empty state)                                                                                                                 |
| `WishlistService`             | Empty state; toggling shows "Wishlist is not available on this store"                                                                                                               |
| `CouponService`               | Empty coupon list (the cart's coupon drawer shows none)                                                                                                                             |
| `CategoryService`             | `get('/api/categories/all')` → Saleor categories (`fetchAllCategories`)                                                                                                             |
| everything else Litekart-REST | Never requested: collection reads resolve empty, single-record reads and writes throw — see the connector's `rest-guard.ts`                                                         |
| everything else               | Unchanged: Saleor GraphQL via `PUBLIC_SALEOR_API_URL`                                                                                                                               |

The Conversational Shopping assistant (`/api/commerce-assistant/*`) is Litekart-only; its widget
detects the active connector and stays hidden in Saleor mode without firing requests.

Two behaviours are driven by the static store config rather than code:

- **Search icon** — `plugins.search.active` is `false` in the defaults, which hides the nav search
  trigger (the autocomplete backend is Litekart Meilisearch).
- **Login** — `loginType` is `"EMAIL"` in the defaults, so the auth modal offers email/password
  only. Saleor has no OTP support (`getOtp` throws), while email login/signup/logout and password
  reset are native GraphQL.

Checkout note: cart, shipping rates, payment-method listing and COD checkout are Saleor-native
GraphQL — but the online payment gateway methods (Razorpay, Stripe, PhonePe, PayPal, Cashfree,
Affirm) throw "not implemented" in this connector.

## Current limitations

See the connector capability matrix in `README.md` for what's implemented for Saleor. Concretely:

- CMS-style pages show the connector's placeholder content — no CMS backend.
- Homepage sections other than the live product list must come from the active theme's static
  content (which is the standing rule for themes anyway).
- If the Saleor catalog has no matching products, commerce grids render their empty/loading
  states — the pages still work.

## Troubleshooting

- **`PUBLIC_SALEOR_API_URL is set but the saleor connector is not active in kitcommerce.config.ts`**
  — thrown by the hooks `init` when that env var is set while a different connector (e.g. the
  litekart default) is exported from `kitcommerce.config.ts`. Switch the export to
  `./src/lib/core/connectors/saleor`, or remove the env var if you meant to run another backend.
- **`[saleor] no native implementation for \`get /api/...\`` in the console** — the connector's
  REST guard caught an inherited Litekart path and answered it empty rather than requesting it.
  Each path is reported once. Harmless if that feature has no Saleor equivalent; if it does,
  implement it in the connector's matching service.
- **`http proxy error: api/... ECONNREFUSED` in dev** — a Litekart REST path was requested from
  outside the connector, so neither its guard nor `blockRestFallbacks` saw it; Vite proxies
  `/api` to `PUBLIC_LITEKART_API_URL || localhost:7000`.
- **Store shows "Test" / wrong branding** — set identity overrides in the
  `kitcommerce.config.ts` default export.
- **Auth/cart works in dev but not deployed** — almost always CORS: allow the deployed storefront
  origin on the Saleor API.
