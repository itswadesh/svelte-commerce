# Running Svelte Commerce on Litekart

[Litekart](https://litekart.in) is this storefront's stock backend and the reference
implementation every other connector is written against. A fresh clone already runs on it —
`.env.example` points at the public demo API, so `cp .env.example .env && npm run dev` gives you a
working store with no further wiring.

## Status

|                  |                              |
| :--------------- | :--------------------------- |
| Connector        | `@misiki/litekart-connector` |
| Version          | 2.0.30                       |
| Service coverage | **39/43**                    |
| Cart             | ✅                           |
| Checkout         | ✅                           |
| Auth             | ✅                           |
| Known gaps       | reference implementation     |

Litekart is the only backend where the full surface — CMS pages, blog, menus, Meilisearch
autocomplete, wishlist, coupons and the Conversational Shopping assistant — is served by the API.
Everything else falls back to static theme content for those. See
[CONNECTORS.md](./CONNECTORS.md) for the full matrix.

## Setup

Litekart is the default, so there is nothing to install or switch. `kitcommerce.config.ts` ships
with the Litekart connector module selected:

```ts
export * as services from './src/lib/core/connectors/litekart'
```

That module is a plain re-export of `@misiki/litekart-connector` — Litekart is the one backend
that needs no service overrides — so every backend is selected the same way: one path under
`src/lib/core/connectors`.

Set the env in `.env`:

```env
PUBLIC_LITEKART_API_URL=https://api.litekart.in
PUBLIC_LITEKART_DOMAIN=arialshop.com
```

## Environment variables

| Variable                   | Required      | Purpose                                                                                                             |
| :------------------------- | :------------ | :------------------------------------------------------------------------------------------------------------------ |
| `PUBLIC_LITEKART_API_URL`  | yes           | Base URL of the Litekart API. Vite also proxies `/api` here in dev (falling back to `localhost:7000`).              |
| `PUBLIC_LITEKART_DOMAIN`   | yes           | Store domain used to resolve store details when no `litekart_store_id` cookie is present.                           |
| `PUBLIC_LITEKART_STORE_ID` | in production | Store to serve directly, skipping domain lookup. `src/hooks.server.ts` writes it to the `litekart_store_id` cookie. |

`/health` returns 503 listing anything missing: on Litekart it requires all three of
`PUBLIC_LITEKART_API_URL`, `PUBLIC_LITEKART_STORE_ID` and `PUBLIC_LITEKART_DOMAIN`. Every module in
`src/lib/core/connectors` exports a `connectorName` marker — `litekart` here — and that is what
`/health`, `init` and the assistant service read to know which backend is active.

## Store identity

Store details come live from the API (`/api/stores/public-details`), so the
`kitcommerce.config.ts` default export is normally left empty:

```ts
export default {}
```

The static store config in `src/lib/core/connectors/default-store.json` exists for backends with
no Litekart API behind them; the Litekart module never reads it, because the API is authoritative
for name, logo, currency, menus, plugin toggles and theme CSS variables.

## Theme

On Litekart the theme is chosen in the admin and the API serves that theme's content, layout and
CSS — `store.theme` wins over `PUBLIC_STOREFRONT_THEME`. See the resolver in
`src/lib/theme/index.ts` for the full precedence order.

## Troubleshooting

- **`Unable to retrieve hostname from URL`** — neither `PUBLIC_LITEKART_DOMAIN` nor a resolvable
  request hostname was available. Set the domain explicitly.
- **`/health` returns 503** — the response names the missing variables. In production all three
  Litekart variables are required.
- **Wrong store served** — a stale `litekart_store_id` cookie. Setting `PUBLIC_LITEKART_STORE_ID`
  overwrites it on the next request.
- **Docker/production shows API errors that dev did not** — the Node server reads `PUBLIC_*` from
  the process environment, not `.env`. Set them on your deploy platform; see
  `docker-compose.yml`.
