# Running Svelte Commerce on GoCommerce

This storefront can run against a [GoCommerce](https://github.com/itswadesh/gocommerce) server —
"a small, composable commerce engine for Go". Catalogue, cart, guest checkout and orders come live
from its REST API; store identity and CMS-style content are served statically from this repo. This
document covers setup, how the integration works, and its limits.

GoCommerce differs from every other backend here in three ways that shape the whole integration:

- **The connector is `@misiki/gocommerce-connector`**, written against the server's own OpenAPI
  document (`GET /doc` on a running store).
- **Guest checkout is permanent.** There are no shopper accounts by design — "a shopper needs a
  cart token and an email, never an account". Everything account-shaped is unavailable, and that is
  the product's intent rather than a gap in the connector.
- **The browser cannot call the API directly.** GoCommerce sends no CORS headers and answers a
  preflight with `405`, so browser-side calls are forwarded through this storefront's own origin.
  See [The proxy](#the-proxy).

## Quick start

1. Install the connector, and point the storefront at your GoCommerce server in `.env`:

   ```sh
   bun i @misiki/gocommerce-connector
   ```

   ```env
   PUBLIC_GOCOMMERCE_API_URL='http://127.0.0.1:8080'
   ```

2. Switch the connector in `kitcommerce.config.ts` — the repo default is
   `./src/lib/core/connectors/litekart`:

   ```ts
   export * as services from './src/lib/core/connectors/gocommerce'

   export default {
   	// store identity overrides — see below
   }
   ```

3. Run it:

   ```sh
   npm run dev
   ```

`@misiki/litekart-connector` can stay installed: `@misiki/kitcommerce-core` declares it as a peer
dependency, and it is never used at runtime in GoCommerce mode — `kitcommerce.config.ts` never names
it, and `blockRestFallbacks` stops any inherited Litekart REST path from being requested.

`/health` reports ready as soon as `PUBLIC_GOCOMMERCE_API_URL` is set; the Litekart env trio
(`PUBLIC_LITEKART_API_URL`, `PUBLIC_LITEKART_STORE_ID`, `PUBLIC_LITEKART_DOMAIN`) is not required in
GoCommerce mode.

## Environment variables

| Variable                    | Required | Purpose                                                          |
| --------------------------- | -------- | ---------------------------------------------------------------- |
| `PUBLIC_GOCOMMERCE_API_URL` | yes      | Base URL of the GoCommerce server. Paths are appended to it as-is |

Set only this connector's variables. The `PUBLIC_<CONNECTOR>_API_URL` variables double as mode
switches: if one is set while a different connector is active in `kitcommerce.config.ts`, the hooks
`init` throws at boot naming both halves of the disagreement.

## The proxy

GoCommerce answers with no `Access-Control-Allow-Origin` header and rejects an `OPTIONS` preflight
with `405 Method Not Allowed`. A page served from the storefront's origin therefore cannot call it —
and neither can a universal `+page.ts` load, because SvelteKit simulates the same CORS check
server-side "for consistency with client-side behaviour".

So every browser-side call goes through `src/routes/proxy/gocommerce/[...path]/+server.ts`, which
forwards method, path, query, body and headers unchanged to `PUBLIC_GOCOMMERCE_API_URL`. It is the
same shape as the Bagisto proxy next to it, and it adds no credential of its own: the cart token in
the URL is the shopper's, and the API is the only thing that judges it.

Server-side calls skip the proxy and go straight to the API — the extra hop would be the process
making a request to itself. The rule lives in one place,
the connector's `BaseService.apiUrl`, with one exception: media URLs always resolve
through the proxy, because a server-rendered `<img src>` is still fetched by the browser.

Two consequences worth knowing:

- The proxy prefix (`/proxy/gocommerce`) must not start with `/api/` — `rest-guard.ts` intercepts
  that prefix as a Litekart REST path and would answer these calls itself.
- In production the storefront server must be able to reach `PUBLIC_GOCOMMERCE_API_URL`. The
  browser does not, so the variable's name is misleading here: it is public only in the sense that
  SvelteKit exposes it to the client bundle.

## Store identity

Store details (name, logo, currency, menus, plugin toggles, theme CSS variables) are not fetched
from an API in GoCommerce mode — it is a commerce engine, not a CMS. They resolve as:

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

`isEmailMandatory` is forced true for this connector (see `static-store.ts`), and GoCommerce agrees:
`POST /api/checkout/{code}` requires `email`. Setting it false in your config does not skip the
requirement, it only moves the failure to the payment step.

### Feature toggles this connector forces off

The storefront decides which features to show from `plugins.*.active` — it is how the search icon
and the wishlist button already hide themselves. GoCommerce has no accounts, no discount engine, no
wishlist, no reviews and one vendor, so the connector forces these off
over whatever `kitcommerce.config.ts` says:

| Toggle                       | Why                                                              |
| ---------------------------- | ---------------------------------------------------------------- |
| `accounts`                   | Guest checkout is permanent; there is no sign-in to offer         |
| `isDiscountCoupons`          | No discount engine — every code entered can only be refused       |
| `isWishlist`                 | Nothing to store a wishlist in                                    |
| `isProductReviewsAndRatings` | No review API                                                     |
| `isMultiVendor`              | Single vendor by design                                           |

Forced rather than merged, for the same reason `isEmailMandatory` is: these are not preferences a
deployment can turn back on, they are absent from the API. Offering the affordance anyway produces a
button whose only possible answer is "not available on this store", which is worse than not showing
it. Everything else in the store record still comes from your config.

They are applied where the record is *read* (the connector's `readStaticStore`), not by wrapping the registered provider: `init.ts` calls
`setStaticStore(staticStoreConfig)` for whatever connector is active, at boot, which lands after the
connector module has loaded and replaces anything wrapped around it there.

`accounts` is this repo's own toggle, honoured by `src/lib/components/auth/auth-button.svelte` —
every login, signup and password-reset entry point renders through that component, so gating it
there covers the nav, the drawer and the checkout's "log in" links at once.

## How the integration works

### Money

GoCommerce sends money as an integer count of the currency's minor unit plus its code
(`{ amount_minor: 2500, currency: "USD" }`) — never a float, because binary floating point cannot
represent `0.10`, and never a formatted string, because the number of decimals belongs to the
currency (USD has 2, JPY has 0, KWD has 3). The storefront's components take a plain number in major
units, so `money.ts` converts once, against the currency the amount arrived with.

### The cart

A cart is an opaque token, and possessing it is the whole authorisation. That token is what the
storefront persists as `cart_id`, which is exactly where the shared cart store already looks.

`POST /api/carts` opens one; `POST`/`PATCH`/`DELETE` on `/line-items` change it. A `PATCH` sets an
absolute quantity and a quantity of zero removes the line, which is what the storefront's stepper
means when it steps down to nothing.

A checked-out cart keeps its lines forever — that is what makes it readable as a receipt — but its
status becomes `converted`, and the connector drops the stored token at that point. Otherwise the
shopper lands back on the store with the thing they just bought still in their bag, and every
attempt to change it refused by the API.

A token can also simply die: the cart expires after 30 days, and a server rebuilt from a different
database leaves every token in every shopper's browser naming nothing. The API answers
`404 "cart not found"`, and left alone that message is what a shopper sees when they click Add to
bag — about a token the storefront is holding, not anything they did. So a write that fails is
followed by a re-read of the cart: if it is gone or no longer `open`, the token is dropped and the
item goes into a fresh cart. If the cart is alive, the failure was real — a price that moved, stock
that ran out — and it is passed straight through, because starting a new bag would hide it.

The check re-reads rather than matching the message, because the API reports unrelated things
identically: at checkout, a dead cart and an unknown payment code are both `404 not_found`.

### The address step

GoCommerce has no endpoint that changes a cart after it is opened, and no address on it at all: the
shopper's name, phone and delivery address are arguments to `POST /api/checkout/{code}` and exist
nowhere before that call. The storefront collects them one step earlier, so `checkout-details.ts`
holds them in the browser against that cart id and spends them when the order is placed. They are
cleared as soon as the cart converts.

### Sessions and the address book

GoCommerce has no accounts, so nobody can be signed in — but the shared user store does not ask a
service about that. It decides by reading the `connect.sid` and `me` cookies straight from
`document.cookie`. A pair left behind by running this storefront against a backend that *does* have
accounts therefore makes a GoCommerce store look signed-in, and that is not cosmetic: the checkout
then takes the saved-address path instead of the guest one. So the connector clears those two
cookies when it loads in a browser, and `logout()` clears them too — the checkout page already calls
`logout()` and retries when it detects a stale session, and that recovery only works if something
actually clears them.

The address book itself is real, and local to this browser (`address-book.ts`). GoCommerce has
nowhere to store addresses — a delivery address exists only as an argument to checkout — but the
storefront's signed-in flow saves an address, lists it, and only then copies the selection onto the
cart. Refusing that write does not degrade gracefully; it dead-ends checkout. So the addresses live
beside the checkout details, under the same rule: the shopper's own data, on the shopper's own
device, sent to GoCommerce only when the order is placed. Clearing site data clears them.

### Checkout and payment

`GET /api/checkout` lists the payment codes the store installed. The storefront branches on an
uppercase code (`COD`, `STRIPE`, …) while GoCommerce installs them lowercase, so the code is
uppercased for the UI and the original kept for the API call.

`POST /api/checkout/{code}` validates the cart, reserves inventory and creates the order in one
transaction, then starts payment outside it. An `Idempotency-Key` is sent, so a double-submitted
Place Order cannot become two orders and two inventory holds. If a line's price changed, its product
went inactive, or stock ran out, the call is refused with `409` and per-line detail; the server's own
message is what the shopper is shown.

A gateway's own fields (a Razorpay order id, a Stripe client secret, a redirect URL) ride on the
response's `payment.client_data`, and the connector spreads them onto its return value — which is
what lets the storefront's per-gateway branches find what they look for without this connector
naming each gateway. **Only `cod` is verified end to end**, because that is the only method the
reference build installs.

Payment is reconciled by `POST /api/checkout/{code}/webhook`, called gateway-to-server. There is no
client-side capture step, so the storefront's capture entry points keep the redirect moving with the
order number rather than pretending to perform one.

### Orders

The order's `access_token`, returned once at checkout, is the only credential that reads it back.
The connector stores it in this browser, so "my orders" is every order placed from this browser.

The confirmation page is the exception: it renders on the **server**, where no token exists. It
arrives with `cart_id` in the URL, and a converted cart stays readable by its own token, so the
order is reconstructed from the cart that became it — the number from the URL, the items and totals
from the cart, all of it the shopper's own data reached with the shopper's own credential. The
delivery address is not on the cart, so that block is absent rather than invented.

### Catalogue and search

GoCommerce's shopper-facing catalogue takes `q`, `limit` and `page`, plus a category or collection
slug. It has **no sort parameter, no tag filter and no price range**, so the listing page's sort
control and facet filters are applied in the connector over one window of the catalogue — 200
products, the API's own `limit` ceiling. That is exact for a catalogue up to that size; past it,
sorting and filtering describe the first 200 products rather than all of them.

Product images come from two fields, in the order a gallery shows them: the product's own
`image_url`, then whatever image each variant nominates (`Variant.image`) — what a storefront swaps
to when a shopper picks a colour. Both are read defensively, because **`image_url` is not in the
OpenAPI document**: `GET /doc` still describes `Variant.image` as the only shopper-facing media,
while the server returns `image_url` on every product read. On a catalogue where only `image_url` is
set, reading the documented field alone shows no pictures at all. A product with neither renders the
components' own placeholder.

Media URLs are site-relative (`/media/<hash>.jpg`) and served by GoCommerce itself, so they resolve
through the proxy like every other browser-side request. Uploading media is admin-API only
(`/api/admin/products/{id}/media`), which a storefront holds no credential for.

`GET /api/categories` answers with one fixed window and ignores `limit`/`page`, so the category
tree the nav can show is whatever that window holds. A store that has imported a full retail
taxonomy has far more nodes than that; the ones a shopper reaches are still reachable, because a
listing page looks its category up by slug directly.

## Service behaviour

| Service                                | Behaviour in GoCommerce mode                                                                        |
| -------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `ProductService`, `SearchService`      | `/api/products`, `/api/products/slug/{slug}`, `/api/categories/{slug}`; sort and facets applied locally |
| `CategoryService`                      | `/api/categories`, `/api/categories/{slug}`; `get('/api/categories/all')` routed to the real tree    |
| `CollectionService`                    | `/api/collections`, `/api/collections/{slug}`                                                       |
| `MeilisearchService`, `AutocompleteService` | `?q=` on the catalogue — GoCommerce ships no separate search engine                             |
| `CartService`                          | `/api/carts` and its line-items; the address step is held in the browser (see above)                |
| `CheckoutService`, `PaymentMethodService` | `GET /api/checkout`, `POST /api/checkout/{code}`                                                  |
| `OrderService`                         | `/api/orders/{number}?token=…`; the confirmation page falls back to the converted cart               |
| `StoreService`, `MenuService`, `CountryService`, `CurrencyService`, `PluginService`, `SettingService` | The static store config                       |
| `AuthService`, `UserService`, `ProfileService` | No accounts exist — reads answer empty, writes explain why                            |
| `AddressService`                       | A browser-local address book; GoCommerce has nowhere to put one (see below)                          |
| `PageService`, `BlogService`, `BannerService`, `GalleryService`, `ReelsService` | Empty — no CMS                                        |
| `WishlistService`, `CouponService`, `ReviewService`, `VendorService` | Empty lists; writes throw a named message                        |
| `ContactService`, `EnquiryService`, `UploadService` | Throw — there is no inbox behind them, and a silent success is a lie                 |

The Conversational Shopping assistant (`/api/commerce-assistant/*`) is Litekart-only; its widget
detects the active connector and stays hidden without firing requests.

### Data sources at a glance

| Data                                       | Source                           |
| ------------------------------------------ | -------------------------------- |
| Products, categories, collections, search  | GoCommerce REST API              |
| Cart, checkout, payment methods, orders    | GoCommerce REST API              |
| Store identity, menus, countries, plugins  | Static (`kitcommerce.config.ts`) |
| CMS pages, blog, banners                   | Static/empty — no CMS            |
| Accounts, addresses, wishlist, reviews     | Unavailable — guest checkout only |

## Current limitations

Most of these are GoCommerce's design, not missing connector work:

- **No accounts.** `/my/*` is behind the storefront's auth guard and is therefore unreachable;
  login, signup and password reset all explain that no account is needed. A guest's order
  confirmation is where they see what they bought. Saved addresses work, but they never leave the
  device — see [Sessions and the address book](#sessions-and-the-address-book).
- **No discount codes, wishlist, reviews, vendors or CMS.** Their UI is hidden by the forced
  toggles above rather than offered and refused; the pages that remain render empty states, and the
  write paths throw a named message rather than succeeding silently.
- **No shipping rate selection.** GoCommerce prices shipping when it creates the order, so the cart
  shows no shipping line and the payment step renders no rate picker.
- **Sorting and filtering cover 200 products.** See [Catalogue and search](#catalogue-and-search).
- **Only `cod` is verified.** Other payment codes are forwarded generically; a gateway integration
  should be exercised before it is relied on.
- **Images are only as good as the catalogue.** A product with neither `image_url` nor a variant
  image renders a placeholder; uploading media is admin-API only.
- **The API must be reachable from the storefront server**, not from the browser. See
  [The proxy](#the-proxy).

## Troubleshooting

- **`PUBLIC_GOCOMMERCE_API_URL is set but the gocommerce connector is not active in kitcommerce.config.ts`**
  — thrown by the hooks `init` when that env var is set while a different connector is exported from
  `kitcommerce.config.ts`. Switch the export to `./src/lib/core/connectors/gocommerce`, or remove
  the env var if you meant to run another backend.
- **`the gocommerce connector is active in kitcommerce.config.ts but PUBLIC_GOCOMMERCE_API_URL is not set`**
  — add it to `.env`.
- **`CORS error: No 'Access-Control-Allow-Origin' header is present`** — something bypassed the
  proxy and called the API with an absolute URL from a universal load or the browser. Route it
  through `BaseService.apiUrl`.
- **`502 Bad Gateway` from `/proxy/gocommerce/...`** — the storefront server cannot reach
  `PUBLIC_GOCOMMERCE_API_URL`. The response body names the address and the reason, e.g. *"Could not
  reach the GoCommerce server at http://127.0.0.1:8080 — ECONNREFUSED. Is it running?"*. Almost
  always the API is simply not started; confirm with `curl <API>/health`, which answers
  `{"data":{"status":"ok",…}}`.
  - If the host is `localhost` and the server is listening on IPv4 only, Node resolves `localhost`
    to IPv6 `::1` first and the connection is refused. Use `127.0.0.1` in the env var.
- **`[gocommerce] no native implementation for \`get /api/...\`` in the console** — `rest-guard.ts`
  caught an inherited Litekart path and answered it empty rather than requesting it. Each path is
  reported once. Harmless if that feature has no GoCommerce equivalent; if it does, implement it in
  the connector's matching service.
- **"Saved addresses is not available on this store" at checkout** — fixed: the address book is now
  browser-local. If an older build shows it, the cause is a stale `connect.sid` / `me` cookie from a
  different backend making the storefront think you are signed in; clearing site data for the
  storefront's origin recovers it.
- **No product images** — check whether the API actually returns any: `curl
  '<API>/api/products?limit=200'` and look for `image_url` on the products and `image` on the
  variants. The connector reads both; if neither is set, the catalogue has no pictures to show.
- **Store shows "Test" / wrong branding** — set identity overrides in the `kitcommerce.config.ts`
  default export.
- **"cart not found" when adding to the bag** — the `cart_id` this browser holds names a cart the
  server no longer has (expired, wiped, or pointing at a different database). The connector detects
  that and opens a fresh cart instead of reporting it, so seeing the message means the recovery in
  `CartService.addToCart` did not run; clearing `cart_id` from `localStorage` is the manual fix.
- **The bag still shows something already bought** — the cart token should be dropped when the cart
  converts (`CartService.readCart`). Clearing `cart_id` from `localStorage` recovers it.
