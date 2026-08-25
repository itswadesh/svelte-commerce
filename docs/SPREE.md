# Running Svelte Commerce on Spree

This storefront can talk to a [Spree](https://spreecommerce.org) backend through the `@misiki/spree-connector` connector.

> **Status: connector published, storefront wiring not included.**
> `@misiki/spree-connector` exists at version `0.4.0`, but this repo ships env wiring and an override module for
> Medusa, Saleor and Vendure only. Running Spree means adding those two pieces yourself — both
> are small, and this page says exactly what they are.

## Status

|                  |                           |
| :--------------- | :------------------------ |
| Connector        | `@misiki/spree-connector` |
| Version          | 0.4.0                     |
| Service coverage | **26/43**                 |
| Cart             | ✅                        |
| Checkout         | ✅                        |
| Auth             | ✅                        |
| Known gaps       | review                    |

Coverage counts services wired to a real endpoint, out of the storefront service surface.
See [CONNECTORS.md](./CONNECTORS.md) for how the score is computed and what the symbols mean.

## Platform notes

JSON:API. The connector ships a deserialiser that resolves `included` relationships. `jsonapi` in the file count is that helper, not a service.

## Setup

1. Install the connector in place of the stock one:

   ```sh
   npm uninstall @misiki/litekart-connector
   npm i @misiki/spree-connector
   ```

2. Point `kitcommerce.config.ts` at this backend's module — not at the package, so app code
   never names a connector:

   ```ts
   export * as services from './src/lib/core/connectors/spree'
   ```

3. Give the connector its base URL in `.env`:

   ```env
   PUBLIC_SPREE_API_URL=https://your-store.example.com
   ```

   `src/lib/core/connectors/init.ts` carries a row for every backend this storefront supports and
   applies that row at boot, in both hooks — the server one covers SSR, the client one covers the
   browser, which must reach the same URL in production. Boot fails naming the variable if it is
   missing, rather than letting every call fall through to a relative path.

   The rest of this connector's credentials are read from the same prefix when you set them:
   `PUBLIC_SPREE_API_KEY`, `PUBLIC_SPREE_API_SECRET`, `PUBLIC_SPREE_ACCESS_TOKEN`, `PUBLIC_SPREE_ACCESS_KEY`, `PUBLIC_SPREE_STORE_ID`, `PUBLIC_SPREE_CHANNEL_ID`. Unset ones are not passed, so they never overwrite a value the connector already
   holds.

4. What that module does. `@misiki/spree-connector` already carries its own `setStaticStore`,
   `serveRestLocally` and `connectorName`, and `src/lib/core/connectors/init.ts` registers the
   first two on whatever connector is active. So store identity resolves from your config rather
   than `/api/stores/public-details`, and any Litekart REST path the connector still inherits is
   answered from local data or resolved empty instead of being requested.

   `src/lib/core/connectors/spree.ts` is thin on purpose: it re-exports the package, exports the
   `connectorName` marker, and registers those two hooks at module load. Override a service here
   only when you want to change what the connector already does.

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

Services not wired for this platform: **review**. Pages that depend on them render their
empty state rather than failing.

- Legal/CMS pages render their layout with empty content unless a page backend is wired.
- Homepage content other than the live product list must come from the active theme's
  static content — the standing rule for themes in this repo.
- The Conversational Shopping assistant (`/api/commerce-assistant/*`) is Litekart-only and
  stays hidden when another connector is active.

## Troubleshooting

- **Store shows "Test" / wrong branding** — set identity overrides in the
  `kitcommerce.config.ts` default export.
- **`[spree] no native implementation for \`get /api/...\`` in the console** — the connector's
  REST guard caught an inherited Litekart path and answered it empty rather than requesting it.
  Each path is reported once. Harmless if that feature has no spree equivalent; if it does,
  implement it in the connector's matching service.
- **`http proxy error: api/... ECONNREFUSED` in dev** — a Litekart REST path was requested from
  outside the connector, so the guard never saw it (the guard covers everything routed through
  the connector's `BaseService`). Vite proxies `/api` to `PUBLIC_LITEKART_API_URL` or
  `localhost:7000`.
- **Build fails on `@misiki/litekart-connector`** — `@misiki/kitcommerce-core` declares it as
  a peer. `vite.config.ts` redirects that specifier to whichever `@misiki/*-connector` is
  installed, so make sure exactly one is listed in `package.json`.
