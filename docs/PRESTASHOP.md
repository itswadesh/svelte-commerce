# Running Svelte Commerce on PrestaShop

This storefront can talk to a [PrestaShop](https://prestashop.com) backend through the `@misiki/prestashop-connector` connector.

> **Status: connector published, storefront wiring not included.**
> `@misiki/prestashop-connector` exists at version `0.4.0`, but this repo ships env wiring and an override module for
> Medusa, Saleor and Vendure only. Running PrestaShop means adding those two pieces yourself — both
> are small, and this page says exactly what they are.

## Status

|                  |                                        |
| :--------------- | :------------------------------------- |
| Connector        | `@misiki/prestashop-connector`         |
| Version          | 0.4.0                                  |
| Service coverage | **24/43**                              |
| Cart             | ✅                                     |
| Checkout         | ✅                                     |
| Auth             | ⛔                                     |
| Known gaps       | auth, review, wishlist, payment-method |

Coverage counts services wired to a real endpoint, out of the storefront service surface.
See [CONNECTORS.md](./CONNECTORS.md) for how the score is computed and what the symbols mean.

## Platform notes

The webservice API is the constraint: no customer login, and no cart-to-order checkout flow. Translatable fields need `<language>` children on write — echoing a `display=full` read straight back silently blanks them.

## Setup

1. Install the connector in place of the stock one:

   ```sh
   npm uninstall @misiki/litekart-connector
   npm i @misiki/prestashop-connector
   ```

2. Point `kitcommerce.config.ts` at it:

   ```ts
   export * as services from '@misiki/prestashop-connector'
   ```

3. Give the connector its base URL. There is no `PUBLIC_PRESTASHOP_API_URL` handling in
   `src/lib/core/connectors/init.ts` yet — that file only branches on the Medusa, Saleor and
   Vendure env vars. Add a branch for this connector following those, setting whichever
   statics `@misiki/prestashop-connector` exposes on its `BaseService`.

4. You do not need an override module. `@misiki/prestashop-connector` carries its own
   `setStaticStore`, `serveRestLocally` and `connectorName`, and
   `src/lib/core/connectors/init.ts` registers the first two on whatever connector is active. So
   store identity resolves from your config rather than `/api/stores/public-details`, and any
   Litekart REST path the connector still inherits is answered from local data or resolved empty
   instead of being requested — see the connector's own `rest-guard.ts`. Point
   `kitcommerce.config.ts` straight at the package, as in step 2.

   A module under `src/lib/core/connectors/` is worth adding only to override a service the
   connector already implements. `src/lib/core/connectors/vendure.ts` is the smallest example of
   one.

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

Services not wired for this platform: **auth, review, wishlist, payment-method**. Pages that depend on them render their
empty state rather than failing.

- Legal/CMS pages render their layout with empty content unless a page backend is wired.
- Homepage content other than the live product list must come from the active theme's
  static content — the standing rule for themes in this repo.
- The Conversational Shopping assistant (`/api/commerce-assistant/*`) is Litekart-only and
  stays hidden when another connector is active.

## Open question for PrestaShop maintainers

Is there a supported storefront auth path over the webservice API?

Answers are very welcome — see the request in
[CONNECTORS.md](./CONNECTORS.md).

## Troubleshooting

- **Store shows "Test" / wrong branding** — set identity overrides in the
  `kitcommerce.config.ts` default export.
- **`[prestashop] no native implementation for \`get /api/...\`` in the console** — the connector's
  REST guard caught an inherited Litekart path and answered it empty rather than requesting it.
  Each path is reported once. Harmless if that feature has no prestashop equivalent; if it does,
  implement it in the connector's matching service.
- **`http proxy error: api/... ECONNREFUSED` in dev** — a Litekart REST path was requested from
  outside the connector, so the guard never saw it (the guard covers everything routed through
  the connector's `BaseService`). Vite proxies `/api` to `PUBLIC_LITEKART_API_URL` or
  `localhost:7000`.
- **Build fails on `@misiki/litekart-connector`** — `@misiki/kitcommerce-core` declares it as
  a peer. `vite.config.ts` redirects that specifier to whichever `@misiki/*-connector` is
  installed, so make sure exactly one is listed in `package.json`.
