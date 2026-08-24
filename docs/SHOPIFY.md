# Running Svelte Commerce on Shopify

This storefront can talk to a [Shopify](https://www.shopify.com) backend through the `@misiki/shopify-connector` connector.

> **Status: connector published, storefront wiring not included.**
> `@misiki/shopify-connector` exists at version `1.1.0`, but this repo ships env wiring and an override module for
> Medusa, Saleor and Vendure only. Running Shopify means adding those two pieces yourself — both
> are small, and this page says exactly what they are.

## Status

|                  |                                                  |
| :--------------- | :----------------------------------------------- |
| Connector        | `@misiki/shopify-connector`                      |
| Version          | 1.1.0                                            |
| Service coverage | **16/27**                                        |
| Cart             | ✅                                               |
| Checkout         | ✅                                               |
| Auth             | ✅                                               |
| Known gaps       | review, wishlist, vendor, page, profile, country |

Coverage counts services wired to a real endpoint, out of the storefront service surface.
See [CONNECTORS.md](./CONNECTORS.md) for how the score is computed and what the symbols mean.

## Platform notes

Scored out of 27 rather than 43: several storefront services have no equivalent in the Storefront API surface this connector targets.

## Setup

1. Install the connector in place of the stock one:

   ```sh
   npm uninstall @misiki/litekart-connector
   npm i @misiki/shopify-connector
   ```

2. Point `kitcommerce.config.ts` at it:

   ```ts
   export * as services from '@misiki/shopify-connector'
   ```

3. Give the connector its store and tokens in `.env`:

   ```env
   PUBLIC_SHOPIFY_API_URL=your-store.myshopify.com
   PUBLIC_SHOPIFY_ACCESS_TOKEN=shpat_...
   PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
   ```

   `src/lib/core/connectors/init.ts` carries a row for every backend this storefront supports and
   applies that row at boot, in both hooks — the server one covers SSR, the client one covers the
   browser. Shopify is keyed on a store domain rather than a URL, so the row strips any
   `https://` you include before handing it to `setShopifyCredentials`.
   `PUBLIC_SHOPIFY_PROXY_URL` is read too, for stores fronted by a proxy.

4. You do not need an override module. `@misiki/shopify-connector` carries its own
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

Services not wired for this platform: **review, wishlist, vendor, page, profile, country**. Pages that depend on them render their
empty state rather than failing.

- Legal/CMS pages render their layout with empty content unless a page backend is wired.
- Homepage content other than the live product list must come from the active theme's
  static content — the standing rule for themes in this repo.
- The Conversational Shopping assistant (`/api/commerce-assistant/*`) is Litekart-only and
  stays hidden when another connector is active.

## Troubleshooting

- **Store shows "Test" / wrong branding** — set identity overrides in the
  `kitcommerce.config.ts` default export.
- **`[shopify] no native implementation for \`get /api/...\`` in the console** — the connector's
  REST guard caught an inherited Litekart path and answered it empty rather than requesting it.
  Each path is reported once. Harmless if that feature has no shopify equivalent; if it does,
  implement it in the connector's matching service.
- **`http proxy error: api/... ECONNREFUSED` in dev** — a Litekart REST path was requested from
  outside the connector, so the guard never saw it (the guard covers everything routed through
  the connector's `BaseService`). Vite proxies `/api` to `PUBLIC_LITEKART_API_URL` or
  `localhost:7000`.
- **Build fails on `@misiki/litekart-connector`** — `@misiki/kitcommerce-core` declares it as
  a peer. `vite.config.ts` redirects that specifier to whichever `@misiki/*-connector` is
  installed, so make sure exactly one is listed in `package.json`.
