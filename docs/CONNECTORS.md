# Connectors — status, gaps, and a request for help

Svelte Commerce talks to any backend through a **connector**: a small TypeScript module — usually a
package, once (GoCommerce) a directory in this repo — that maps one platform's API onto a shared
43-service surface (`product`, `cart`, `checkout`, `order`,
`auth`, `address`, …). Nothing in the storefront imports a connector by name — swap the export in
`kitcommerce.config.ts` and the same storefront runs on a different backend.

There are **27 connectors** today. This page is an honest account of how complete each one is,
and an open request to the people who build and maintain these platforms.

---

## 📣 If you maintain one of these platforms, we need you

Every connector below was written by reading your API's **authoritative source** — the OpenAPI
spec, the RAML, the router registration, or the controller source itself. We did not guess
endpoints, and where we could not verify a route we left an explicit placeholder rather than
ship a plausible-looking path that 404s in a merchant's store.

But reading a spec is not the same as running against a real store. **None of these connectors
have been exercised against a live production instance of the platform.** That is the single
biggest gap, and it is the thing you can help with that we cannot do alone.

**What would help most, in priority order:**

1. **A sandbox or demo instance we can point a storefront at.** Even a short-lived one. This is
   worth more than any amount of code review — it turns "verified against the spec" into
   "verified against reality".
2. **A correctness review of the idioms.** We picked one way to do pagination, filtering,
   sorting, and session handling per platform. If it is not the way you would do it, telling us
   costs you ten minutes and saves us a wrong assumption baked into every service.
3. **Answers on the specific gaps listed per connector below.** Most are "does this platform
   have X at all?" — questions you can answer instantly and we cannot.
4. **A pointer to the right docs when ours were wrong.** Three documentation URLs we were given
   were dead (`spree.readthedocs.io/en/latest/api/`, `api.sylius.com`,
   `django-oscar-api.readthedocs.io`'s route page). We fell back to reading source. If there is
   a canonical spec we missed, we would rather use it.

Open an issue or a PR on the connector's repo, or start a
[discussion](https://github.com/itswadesh/svelte-commerce/discussions/new/choose).
We will credit you in the connector README.

---

## How "coverage" is measured

Coverage is **not** hand-asserted. A script traces which service methods transitively reach the
HTTP layer (`_fetch`), following each connector's own request helpers. A service counts as wired
only if it genuinely issues a request, or delegates to one that does.

A large number of placeholders is often the **correct** answer, not a failure. OpenCart core ships
exactly ten API controllers — cart, coupon, currency, customer, login, order, payment, reward,
shipping, voucher — and no product, category, or search controller at all. Its 9/43 is the honest
ceiling for that API, not a to-do list.

Some services are Litekart-native concepts with no equivalent anywhere: `reels`, `deals`, `chat`,
`gallery`, `popularity`, `demo-request`, `feedback`, `plugins`, `banner`. These stay as
documented placeholders on every connector and are excluded from the "known gaps" column below.

Where a platform has no real customer-auth endpoint, `auth` **throws `NotSupportedError`** rather
than fabricating a session — a stub that mints a logged-in user for any password is an auth
bypass, not a placeholder.

---

## Status

| Platform                                                                         | Package                           | Version | Coverage  | Cart | Checkout | Auth | Known gaps                                                                                 |
| :------------------------------------------------------------------------------- | :-------------------------------- | :------ | :-------- | :--: | :------: | :--: | :----------------------------------------------------------------------------------------- |
| [Litekart](https://litekart.in)                                                  | `@misiki/litekart-connector`      | 2.0.30  | **39/43** |  ✅  |    ✅    |  ✅  | reference implementation                                                                   |
| [Vendure](https://www.vendure.io)                                                | `@misiki/vendure-connector`       | 2.0.35  | **39/43** |  ✅  |    ✅    |  ✅  | —                                                                                          |
| [GoCommerce](https://github.com/itswadesh/gocommerce)                             | `@misiki/gocommerce-connector`    | —       | **10/43** |  ✅  |    ✅    |  ⛔  | accounts, coupon, wishlist, review, vendor, CMS — none exist in the API                     |
| [Medusa](https://medusajs.com)                                                   | `@misiki/medusa-connector`        | 2.1.5   | **31/43** |  —   |    ✅    |  —   | auth, cart, product, category, search, address, user, payment-method                       |
| [Broadleaf](https://www.broadleafcommerce.com)                                   | `@misiki/broadleaf-connector`     | 0.5.0   | **28/43** |  ✅  |    ✅    |  ✅  | —                                                                                          |
| [Saleor](https://saleor.io)                                                      | `@misiki/saleor-connector`        | 1.0.3   | **28/43** |  —   |    —     |  —   | auth, cart, checkout, order, category, coupon, search, address, user, page, payment-method |
| [Shopware](https://www.shopware.com)                                             | `@misiki/shopware-connector`      | 0.4.0   | **28/43** |  ✅  |    ✅    |  ✅  | coupon                                                                                     |
| [Virto Commerce](https://virtocommerce.com)                                      | `@misiki/virto-connector`         | 0.4.0   | **28/43** |  ✅  |    ✅    |  ✅  | —                                                                                          |
| [WooCommerce](https://woocommerce.com)                                           | `@misiki/woocommerce-connector`   | 0.4.0   | **27/43** |  ✅  |    ✅    |  ⛔  | auth (no core endpoint), wishlist                                                          |
| [Magento](https://business.adobe.com/products/commerce/magento/open-source.html) | `@misiki/magento-connector`       | 0.4.0   | **26/43** |  ✅  |    ✅    |  ✅  | review, wishlist                                                                           |
| [Spree](https://spreecommerce.org)                                               | `@misiki/spree-connector`         | 0.4.0   | **26/43** |  ✅  |    ✅    |  ✅  | review                                                                                     |
| [X-Cart](https://www.x-cart.com)                                                 | `@misiki/x-cart-connector`        | 0.5.0   | **26/43** |  ✅  |    ✅    |  ✅  | vendor                                                                                     |
| [EverShop](https://evershop.io)                                                  | `@misiki/evershop-connector`      | 0.4.0   | **25/43** |  ✅  |    ✅    |  ✅  | review, wishlist, vendor                                                                   |
| [Spryker](https://spryker.com)                                                   | `@misiki/spryker-connector`       | 0.4.0   | **25/43** |  ✅  |    ✅    |  ✅  | coupon                                                                                     |
| [nopCommerce](https://www.nopcommerce.com)                                       | `@misiki/nopcommerce-connector`   | 0.5.0   | **24/43** |  ✅  |    ✅    |  ✅  | coupon, currency                                                                           |
| [PrestaShop](https://prestashop.com)                                             | `@misiki/prestashop-connector`    | 0.4.0   | **24/43** |  ✅  |    ✅    |  ⛔  | auth, review, wishlist, payment-method                                                     |
| [Sylius](https://sylius.com)                                                     | `@misiki/sylius-connector`        | 0.4.0   | **24/43** |  ✅  |    ✅    |  ✅  | wishlist, vendor, page                                                                     |
| [Swell](https://www.swell.is)                                                    | `@misiki/swell-connector`         | 0.4.0   | **23/43** |  ✅  |    ✅    |  ✅  | review, wishlist, vendor, state                                                            |
| [Bagisto](https://bagisto.com)                                                   | `@misiki/bagisto-connector`       | 0.4.0   | **22/43** |  ✅  |    ✅    |  ✅  | coupon, page, payment-method, vendor                                                       |
| [commercetools](https://commercetools.com)                                       | `@misiki/commercetools-connector` | 0.5.0   | **21/43** |  ✅  |    ✅    |  ✅  | country, currency, page, vendor                                                            |
| [OroCommerce](https://oroinc.com)                                                | `@misiki/orocommerce-connector`   | 0.4.0   | **21/43** |  ✅  |    ✅    |  ✅  | review, wishlist, currency, vendor                                                         |
| [Sharetribe](https://www.sharetribe.com)                                         | `@misiki/sharetribe-connector`    | 0.4.0   | **21/43** |  —   |    ✅    |  ✅  | cart, coupon, address, country, state, wishlist                                            |
| [CS-Cart](https://www.cs-cart.com)                                               | `@misiki/cs-cart-connector`       | 0.4.0   | **20/43** |  ✅  |    ✅    |  ⛔  | auth, address, country, state, currency, coupon, wishlist                                  |
| [Shuup](https://github.com/shuup/shuup)                                          | `@misiki/shuup-connector`         | 0.5.0   | **19/43** |  ✅  |    ✅    |  ✅  | coupon, review, page, country, state, wishlist                                             |
| [Shopify](https://www.shopify.com)                                               | `@misiki/shopify-connector`       | 1.1.0   | **16/27** |  ✅  |    ✅    |  ✅  | review, wishlist, vendor, page, profile, country                                           |
| [Django Oscar](https://github.com/django-oscar/django-oscar)                     | `@misiki/oscar-connector`         | 0.5.0   | **15/43** |  ✅  |    ✅    |  ✅  | coupon, review, search, page, payment-method, currency, state, wishlist, vendor            |
| [OpenCart](https://www.opencart.com)                                             | `@misiki/opencart-connector`      | 0.5.0   | **9/43**  |  ✅  |    ✅    |  ⛔  | catalogue, search, auth, address, user, profile, coupon, page, wishlist, vendor            |

✅ wired · ⛔ throws `NotSupportedError` (no real endpoint on the platform) · — not yet wired

---

## Per-platform notes and what we'd like to ask you

### Litekart, Vendure

The two most complete connectors. Vendure's GraphQL Shop API covers essentially the whole surface.

### GoCommerce

`@misiki/gocommerce-connector` is written against the server's own OpenAPI document. Its 10/43 is
the honest ceiling for a bare store, not a to-do list: guest checkout is permanent by design, and
there are no wishlists or reviews to wire and no CMS. Catalogue, cart, checkout and orders are all
native. A store that installs GoCommerce's optional `identity` module adds four more — auth, user,
profile and addresses — which the connector detects and wires automatically.

Three things a maintainer could change that would matter more than any connector work: the API sends
**no CORS headers** and answers a preflight with `405`, so a browser cannot call it at all and this
storefront forwards every browser-side call through its own origin; the shopper-facing catalogue has
**no sort parameter and no price or tag filter**, so the listing page's sort control and facets are
applied client-side over one 200-product window; and `Product.image_url` is **missing from the
OpenAPI document** at `/doc`, which still names `Variant.image` as the only shopper-facing media — a
connector written from the spec alone shows no product images. See
[GOCOMMERCE.md](./GOCOMMERCE.md).

### Medusa, Saleor

Predate the current wiring pass and cover the core commerce path. They have not been through
the same source-verification sweep as the rest and are the next candidates for it.

### Shopware

Store API is one of the cleanest headless surfaces here. Cart and customer session ride the
`sw-context-token` header, captured and replayed like a cookie.
**Question for maintainers:** is there a Store API route for promotion/voucher _lookup_ (not just
applying one to a cart)? We found apply/remove but no way to list or validate a code standalone.

### Virto Commerce, Broadleaf

Both required deciding which API generation to target. Broadleaf is wired against
**Microservices** (41 OpenAPI 3.0.3 documents), not the legacy 5.x/6.x monolith, which publishes
no versioned REST contract.
**Question for Broadleaf:** `CartPricing` in the published schema has no `total`,
`adjustmentsTotal`, or `feesTotal`, but the demo gateway returns them. Which is authoritative? A
deployment following the spec strictly would render a zero cart total.

### WooCommerce

Three namespaces with three different auth models: `wc/v3` (consumer key/secret), the Store API
`wc/store/v1` (session/Cart-Token, cart and checkout live here only), and WP core `wp/v2`.
**Question for maintainers:** is there any supported path to customer login without a JWT plugin?
Today `auth` throws, because `POST /customers` creates an account but returns no session.

### Magento

Customer token auth via `/V1/integration/customer/token` works well. `Magento_Review` and
`Magento_Wishlist` ship no `webapi.xml`, so neither has a REST surface.
**Question for maintainers:** is exposing those planned, or is a custom module the expected answer?

### PrestaShop

The webservice API is the constraint: no customer login, and no cart→order checkout flow.
Translatable fields need `<language>` children on write — echoing a `display=full` read straight
back silently blanks them, which we hit and fixed.
**Question for maintainers:** is there a supported storefront auth path over the webservice API?

### commercetools

Version-based optimistic concurrency (`{ version, actions: [] }`) is modelled throughout.
Wired against `/me` endpoints so nothing runs unscoped.
**Question for maintainers:** for a headless storefront, is the `/me` surface plus an anonymous
token the idiomatic pattern, or should we use the Checkout/Frontend APIs instead?

### Spree, Spryker, OroCommerce

All three are JSON:API; each connector ships a deserialiser that resolves `included`
relationships. **Note:** `jsonapi` appearing in the file count is that helper, not a service.

### Sharetribe

A marketplace, not a webshop — the mapping is `listing → Product`, `transaction → Order`. There
is deliberately no cart, no coupon, and no category tree.
**Question for maintainers:** is `listing → Product` the mapping you would recommend, or should a
storefront model transactions as the primary entity?

### CS-Cart, Shuup, EverShop, Swell, Bagisto, Sylius, X-Cart, nopCommerce

Solid core commerce coverage. The recurring gaps are wishlist, reviews, and coupon _lookup_ —
in most cases we could not find an endpoint and would rather ask than invent one.
**nopCommerce specifically:** core ships no REST API; this connector targets the API-Frontend
plugin contract (v4.50.09, 2022). If there is a newer published contract, please point us at it.

### Django Oscar

Wired against `django-oscar-api`, which is a separate package from Oscar core — worth stating in
your docs if a storefront is a supported use case.

### OpenCart

The most constrained. Core's API is admin/order-management (`route=api/...`), not a storefront
catalogue API, and `api/order/info` has no ownership check at all — we quarantined it behind an
admin-only method so a shopper-facing call can never reach it.
**Question for maintainers:** is a storefront REST surface planned for OpenCart 4, or is a custom
extension the expected route?

---

## Contributing

Connector repos live under [github.com/misiki-in](https://github.com/misiki-in) as
`<platform>-connector`. Each is standalone: `bun install && bun run build`.

A connector is a set of services extending a shared `BaseService`. To wire one up:

1. Read the canonical signature in `litekart-connector/src/services/<same-file>.ts` — method names
   and shapes must match exactly, because the storefront calls every connector interchangeably.
2. Implement against the platform's real endpoint and map into the types in `src/types/index.ts`.
3. If the platform has no equivalent, leave the placeholder and say why in a comment. **An honest
   placeholder always beats a plausible path**, which fails as a runtime 404 in someone's store.
4. `npx tsc --noEmit` must pass.

Two rules we hold firmly, both learned from bugs we shipped and then caught:

- **Never fabricate pagination totals.** Read them from the platform's real envelope or headers.
- **Never return an unscoped list where the storefront expects "mine".** A `GET /orders` without a
  customer filter returns every order in the store to whoever holds the key.
