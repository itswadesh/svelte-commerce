# Running Svelte Commerce on OpenCart

This storefront can talk to a [OpenCart](https://www.opencart.com) backend through the `@misiki/opencart-connector` connector.

> **Status: connector published, storefront wiring not included.**
> `@misiki/opencart-connector` exists at version `0.5.0`, but this repo ships env wiring and an override module for
> Medusa, Saleor and Vendure only. Running OpenCart means adding those two pieces yourself — both
> are small, and this page says exactly what they are.

## Status

|                  |                                                                                 |
| :--------------- | :------------------------------------------------------------------------------ |
| Connector        | `@misiki/opencart-connector`                                                    |
| Version          | 0.5.0                                                                           |
| Service coverage | **9/43**                                                                        |
| Cart             | ✅                                                                              |
| Checkout         | ✅                                                                              |
| Auth             | ⛔                                                                              |
| Known gaps       | catalogue, search, auth, address, user, profile, coupon, page, wishlist, vendor |

Coverage counts services wired to a real endpoint, out of the storefront service surface.
See [CONNECTORS.md](./CONNECTORS.md) for how the score is computed and what the symbols mean.

## Platform notes

The most constrained of the set. Core's API is admin/order-management (`route=api/...`), not a storefront catalogue API. `api/order/info` has no ownership check at all, so the connector quarantines it behind an admin-only method — a shopper-facing call can never reach it.

## Setup

1. Install the connector in place of the stock one:

   ```sh
   npm uninstall @misiki/litekart-connector
   npm i @misiki/opencart-connector
   ```

2. Point `kitcommerce.config.ts` at it:

   ```ts
   export * as services from '@misiki/opencart-connector'
   ```

3. Give the connector its base URL. There is no `PUBLIC_OPENCART_API_URL` handling in
   `src/lib/core/connectors/init.ts` yet — that file only branches on the Medusa, Saleor and
   Vendure env vars. Add a branch for this connector following those, setting whichever
   statics `@misiki/opencart-connector` exposes on its `BaseService`.

4. Decide whether you need an override module. Connectors written against a non-Litekart
   backend generally still call Litekart REST endpoints (`/api/stores/public-details`,
   `/api/pages/*`) for store identity and CMS pages, and a store-lookup failure is fatal —
   hooks and the root layout both require store details. If you hit that, copy
   `src/lib/core/connectors/medusa.ts` as a starting point: it re-exports the whole connector
   and replaces the Litekart-dependent services with static implementations. See
   [MEDUSA.md](./MEDUSA.md#why-an-override-layer) for the rationale and a worked service table.

## Store identity

With no Litekart API behind the storefront, store details (name, logo, currency, menus,
plugin toggles, theme CSS variables) come from static config rather than an API:

```
src/lib/core/connectors/default-store.json   (full default store shape)
        merged under
kitcommerce.config.ts default export          (your overrides — highest priority)
```

Until you override it, the site shows the default store name ("Test"):

```ts
export default {
	name: 'My Store',
	logo: '/logo.svg',
	currencyCode: 'USD'
	// see src/lib/core/connectors/default-store.json for every available field
}
```

## Known limitations

Services not wired for this platform: **catalogue, search, auth, address, user, profile, coupon, page, wishlist, vendor**. Pages that depend on them render their
empty state rather than failing.

- Legal/CMS pages render their layout with empty content unless a page backend is wired.
- Homepage content other than the live product list must come from the active theme's
  static content — the standing rule for themes in this repo.
- The Conversational Shopping assistant (`/api/commerce-assistant/*`) is Litekart-only and
  stays hidden when another connector is active.

## Open question for OpenCart maintainers

Is a storefront REST surface planned for OpenCart 4, or is a custom extension the expected route?

Answers are very welcome — see the request in
[CONNECTORS.md](./CONNECTORS.md).

## Troubleshooting

- **Store shows "Test" / wrong branding** — set identity overrides in the
  `kitcommerce.config.ts` default export.
- **`http proxy error: api/... ECONNREFUSED` in dev** — something is calling a Litekart REST
  endpoint with a relative URL. Vite proxies `/api` to `PUBLIC_LITEKART_API_URL` or
  `localhost:7000`; that service needs a static override (step 4 above).
- **Build fails on `@misiki/litekart-connector`** — `@misiki/kitcommerce-core` declares it as
  a peer. `vite.config.ts` redirects that specifier to whichever `@misiki/*-connector` is
  installed, so make sure exactly one is listed in `package.json`.
