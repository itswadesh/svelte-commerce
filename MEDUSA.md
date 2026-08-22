# Running Svelte Commerce on Medusa

This storefront can run against a [Medusa](https://medusajs.com) backend only. Commerce data
(products, cart, checkout, auth, orders, addresses) comes live from Medusa's Store API; store
identity and CMS-style content are served statically from this repo. This document covers setup,
how the integration works, and its current limits.

## Quick start

1. Point the storefront at your Medusa server in `.env`:

   ```env
   PUBLIC_MEDUSA_API_URL=http://localhost:9000
   PUBLIC_MEDUSA_PUBLISHABLE_API_KEY=pk_...
   PUBLIC_MEDUSA_REGION_ID=reg_...
   ```

2. Switch the connector in `kitcommerce.config.ts` — the repo default is
   `@misiki/litekart-connector` — to the repo's Medusa override module, not the raw connector
   package (see [Why an override layer](#why-an-override-layer)):

   ```ts
   export * as services from './src/lib/core/connectors/medusa'

   export default {
   	// store identity overrides — see below
   }
   ```

3. Install and run:

   ```sh
   npm i
   npm run dev
   ```

`/health` reports ready when `PUBLIC_MEDUSA_API_URL` is set and the Medusa connector is active;
the Litekart env trio (`PUBLIC_LITEKART_API_URL`, `PUBLIC_LITEKART_STORE_ID`,
`PUBLIC_LITEKART_DOMAIN`) is not required in Medusa mode.

## Environment variables

| Variable                            | Required | Purpose                                                          |
| ----------------------------------- | -------- | ---------------------------------------------------------------- |
| `PUBLIC_MEDUSA_API_URL`             | yes      | Base URL of the Medusa server (Store API).                       |
| `PUBLIC_MEDUSA_PUBLISHABLE_API_KEY` | yes      | Publishable API key created in the Medusa admin.                 |
| `PUBLIC_MEDUSA_REGION_ID`           | yes      | Region ID (`reg_…`) used for pricing, currency and availability. |

Set only this connector's variables. The `PUBLIC_<CONNECTOR>_API_URL` variables double as mode
switches: if one is set while a different connector is active in `kitcommerce.config.ts`, the
hooks `init` throws at boot (see Troubleshooting). The Litekart env trio is not used in Medusa
mode.

## Required Medusa backend settings

- Create a publishable API key and set it as `PUBLIC_MEDUSA_PUBLISHABLE_API_KEY`.
- Add the storefront origin to the Store CORS config.

## Store identity

Store details (name, logo, currency, menus, plugin toggles, theme CSS variables) are not fetched
from an API in Medusa mode. They resolve as:

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
	currencyCode: 'USD',
	// menu, megamenu, plugins, cssVariables, businessEmail, businessPhone, …
	// see src/lib/core/connectors/default-store.json for every available field
}
```

## How the integration works

Backend selection is a single export: the `kitcommerce.config` alias (defined in
`svelte.config.js`) resolves to `kitcommerce.config.ts`, and `@misiki/kitcommerce-core` re-exports
whatever `services` namespace that file provides. All app code imports services through
`$lib/core/services`, so swapping the export swaps the backend.

At boot, `init` in both hooks (via `src/lib/core/connectors/init.ts`) applies the
`PUBLIC_MEDUSA_*` env to the connector's `BaseService` statics (`BASE_URL`, `PUBLISHABLE_KEY`,
`REGION_ID`). Both hooks matter: the server hook covers SSR, the client hook covers the browser
(which must reach the public Medusa URL in production). The `init` guard fails loudly if
`PUBLIC_MEDUSA_API_URL` is set while a different connector is active.

### Why an override layer

`@misiki/medusa-connector` still calls Litekart API endpoints (`/api/stores/public-details`,
`/api/pages/*`) for store/page metadata — without a Litekart API those requests fail, and the
store lookup failure is fatal (hooks and the root layout both require store details).

`src/lib/core/connectors/medusa.ts` re-exports the whole connector and replaces the
Litekart-REST-dependent services with static implementations:

| Service              | Behaviour in Medusa mode                                                          |
| -------------------- | --------------------------------------------------------------------------------- |
| `StoreService`       | Returns the static store config (defaults + `kitcommerce.config.ts` export)      |
| `PageService`        | Resolves empty pages/lists — no CMS backend                                       |
| `MenuService`        | Serves header/footer menus from the static store config (`menu` array)           |
| `MeilisearchService` | Autocomplete returns empty suggestions — no Litekart Meilisearch proxy            |
| `ProfileService`     | Delegates to Medusa-native `getMe` / `updateProfile` (profile page)              |
| `BlogService`        | Empty lists — no CMS backend (blog routes render their empty state)               |
| `WishlistService`    | Empty state; toggling shows "Wishlist is not available on this store"             |
| `CouponService`      | Empty coupon list (the cart's coupon drawer shows none)                           |
| everything else      | Unchanged: Medusa Store API via `PUBLIC_MEDUSA_API_URL`                           |

The Conversational Shopping assistant (`/api/commerce-assistant/*`) is Litekart-only; its widget
detects the active connector and stays hidden in Medusa mode without firing requests.

Two behaviours are driven by the static store config rather than code:

- **Search icon** — `plugins.search.active` is `false` in the defaults, which hides the nav search
  trigger (the autocomplete backend is Litekart Meilisearch).
- **Login** — `loginType` is `"EMAIL"` in the defaults, so the auth modal offers email/password
  only. Medusa's `getOtp` is a mock (it reports success without sending anything), while email
  login/signup/logout and password reset are native via the Medusa SDK.

Checkout note: cart, shipping rates and payment-method listing are Medusa-native, and COD checkout
completes via the SDK — but the online payment gateway methods (Razorpay, Stripe, PhonePe, PayPal,
Cashfree, Affirm) in this connector still post to Litekart `/api/checkout/*` endpoints and will not
work without a Litekart API.

## Current limitations

See the connector capability matrix in `README.md` for what's implemented for Medusa. Concretely:

- Legal/CMS pages render their layout with empty content — no CMS backend.
- Homepage sections other than the live product list must come from the active theme's static
  content (which is the standing rule for themes anyway).
- If the Medusa catalog has no matching products, commerce grids render their empty/loading
  states — the pages still work.

## Troubleshooting

- **`PUBLIC_MEDUSA_API_URL is set but the medusa connector is not active in kitcommerce.config.ts`**
  — thrown by the hooks `init` when that env var is set while a different connector (e.g. the
  litekart default) is exported from `kitcommerce.config.ts`. Switch the export to
  `./src/lib/core/connectors/medusa`, or remove the env var if you meant to run another backend.
- **`http proxy error: api/... ECONNREFUSED` in dev** — something is calling a Litekart REST
  endpoint with a relative URL; Vite proxies `/api` to `PUBLIC_LITEKART_API_URL || localhost:7000`.
  In Medusa mode that service needs a static override in `src/lib/core/connectors/medusa.ts`.
- **Store shows "Test" / wrong branding** — set identity overrides in the
  `kitcommerce.config.ts` default export.
- **Auth/cart works in dev but not deployed** — check the publishable API key and that the
  deployed storefront origin is in Medusa's Store CORS config.
