<div align="center">
<h2>Svelte Commerce</h2>
</div>

<div >

**The open-source frontend for any eCommerce. Built with a headless approach, using a modern JS stack. The API approach also allows you to merge Svelte Commerce with third-party payment gateways and analytics tools.**

## Backend support

Svelte Commerce talks to any backend through a connector package. Nothing in the app
imports a connector by name — every service resolves through `$lib/core/services`, which follows
whatever `kitcommerce.config.ts` exports. So switching backends is one export change:

```ts
// pick exactly one
export * as services from "@misiki/shopify-connector"
// export * as services from "@misiki/litekart-connector"
// export * as services from '@misiki/medusa-connector'
// export * as services from '@misiki/vendure-connector'
// export * as services from '@misiki/saleor-connector'
// export * as services from '@misiki/commercetools-connector'
// export * as services from '@misiki/woocommerce-connector'
```

`package.json` ships `@misiki/litekart-connector` as the stock connector. Replace it with the one
you picked above so `npm i` — and any Docker build, which installs from `package.json` alone —
resolves the connector your storefront actually talks to:

```sh
npm uninstall @misiki/litekart-connector
npm i @misiki/medusa-connector   # or vendure, saleor, ...
```

That is the only change needed. `@misiki/kitcommerce-core` imports `@misiki/litekart-connector` by
name — it is a peerDependency of that package — so two shims redirect that one specifier onto the
connector you installed: a resolver plugin in `vite.config.ts` for the runtime/bundling layer, and
an ambient declaration written by `sync-connector-types.js` (run by `npm run check`) for the type
layer. Both read `package.json`, so installing your connector is all it takes; neither does anything
when Litekart is the installed connector.

**There are 26 connectors.** The table below covers the six most-used ones; see
**[CONNECTORS.md](./CONNECTORS.md)** for the full list — Magento, PrestaShop, Shopware, Spree,
commercetools, Sylius, Bagisto, CS-Cart, OpenCart, nopCommerce, Spryker, OroCommerce, Virto,
Broadleaf, Swell, Sharetribe, EverShop, Shuup, X-Cart, Django Oscar — with per-platform coverage
measured from source, the known gaps, and **an open request for help from the people who build
these platforms**. Every endpoint was verified against each platform's authoritative spec or
source, but none have been run against a live production store yet. That is where we need you.

| Capability                    | Litekart | Shopify | Medusa | Vendure | Saleor | WooCommerce |
| ----------------------------- | :------: | :-----: | :----: | :-----: | :----: | :---------: |
| Product listing / search      |    ✅    |    ✅   |   ✅   |   ✅    |   ✅   |      ✅     |
| Product detail page           |    ✅    |    ✅   |   ✅   |   ✅    |   ✅   |      ✅     |
| Categories / collections      |    ✅    |    ✅   |   ✅   |   ✅    |   ❓   |      ✅     |
| Cart                          |    ✅    |    ✅   |   ✅   |   ✅    |   ✅   |      ✅     |
| Checkout                      |    ✅    |    ✅   |   ✅   |   ✅    |   ✅   |      ✅     |
| Payment methods               |    ✅    |    ✅   |   ✅   |   ✅    |   ✅   |      ✅     |
| Order placement               |    ✅    |    ✅   |   ✅   |   ✅    |   ✅   |      ✅     |
| Order history / detail        |    ✅    |    ✅   |   ✅   |   ✅    |   ✅   |      ✅     |
| Auth / registration           |    ✅    |    ✅   |   ✅   |   ✅    |   ✅   |      ✅     |
| Addresses                     |    ✅    |    ✅   |   ✅   |   ✅    |   ✅   |      ✅     |
| Customer profile              |    ✅    |    ✅   |   ✅   |   ✅    |   ✅   |      ✅     |
| Wishlist                      |    ✅    |    ❓   |   ❓   |   ❌    |   ❓   |      ❓     |
| Reviews                       |    ✅    |    ❓   |   ❓   |   ❌    |   ❓   |      ❓     |
| Coupons / promotions          |    ✅    |    ❓   |   ❓   |   ❌    |   ❓   |      ❓     |
| Multi-currency / regions      |    ✅    |    ✅   |   ❓   |   ❌    |   ❓   |      ❓     |
| Faceted search (Meilisearch)  |    ✅    |    ✅   |   ✅   |   ❌    |   ✅   |      ✅     |
| CMS pages, blog, banners, FAQ |    ✅    |    ❓   |   ❓   |   ❌    |   ❌   |      ❓     |
| Multi-vendor / marketplace    |    ✅    |    ✅   |   ❌   |   ❌    |   ❌   |      ❓     |

✅ supported · ❌ not implemented yet · ❓ untested

> Litekart is the reference implementation and is the most complete. The Medusa, Vendure
> and Saleor connectors cover the core commerce path — browse, product, cart, checkout,
> order — and are actively being extended. PRs welcome.

> **Maintainers of these platforms:** we would rather ask than guess. The fastest way to help is
> a sandbox instance we can point a storefront at, or ten minutes telling us our endpoint idioms
> are wrong. Specific open questions per platform are in
> [CONNECTORS.md](./CONNECTORS.md#per-platform-notes-and-what-wed-like-to-ask-you).

### Required backend settings

Each backend needs a few settings changed before the storefront will work end to end.

**Vendure**

- `authOptions.requireVerification` → `false`

See [VENDURE.md](./VENDURE.md) for the full Vendure setup guide (env, store identity,
architecture, limitations, troubleshooting).

**Saleor**

- Require email confirmation for user registration → `false`
- `isPhoneMandatory` → `false`
- Allow unpaid orders in **order settings** → enabled
- Allow unpaid orders in **channel settings** → enabled

See [SALEOR.md](./SALEOR.md) for the full Saleor setup guide.

**Medusa**

- Set a publishable API key and add your storefront origin to the Store CORS config.

See [MEDUSA.md](./MEDUSA.md) for the full Medusa setup guide.

### Demos

| Backend  | Demo                |
| :------- | :------------------ |
| Litekart | https://arialshop.com/ |
| Medusa   | _add URL_           |
| Vendure  | _add URL_           |
| Saleor   | _add URL_           |

</div>

<div align="center">
  <br>
    <img width="400" src="./.github/assets/5.gif" >
</div>

<div align="center">
  <br>
    <img width="400" src="./.github/assets/6.gif" >
    <img width="400" src="./.github/assets/7.gif" hspace="5">
</div>

<br>
<p align="center">
<img height="400" src="./.github/assets/8.jpg" hspace="10">
<img height="400" src="./.github/assets/9.jpg" hspace="10">
<img height="400" src="./.github/assets/10.jpg" hspace="10">
</p>

<br/>
<h2 align="center"> Premium themes made using svelte-commerce </h2>
<p align="center">
<img height="200" src="./.github/assets/1.jpg" hspace="10">
<img height="200" src="./.github/assets/2.jpg" hspace="10">
<br>
<br>
<img height="200" src="./.github/assets/3.jpg" hspace="10">
<img height="200" src="./.github/assets/4.jpg" hspace="10">
</p>

<br/>
<p align="center">
  <img src="https://img.shields.io/badge/Made_With-Svelte-red.svg?style=for-the-badge" alt="Made with Svelte"><br/><br/>
  <img src="https://img.shields.io/badge/Maintained%3F-Yes-blueviolet?style=for-the-badge" alt="Maintained">
	<a href="https://github.com/itswadesh/svelte-commerce/stargazers" target="_blank">
		<img alt="Stargazers" src="https://img.shields.io/github/stars/itswadesh/svelte-commerce?style=for-the-badge" ></a>
	<a href="https://github.com/itswadesh/svelte-commerce/issues" target="_blank">
		<img alt="Issues" src="https://img.shields.io/github/issues/itswadesh/svelte-commerce?style=for-the-badge" ></a>
  <a href="https://t.me/itswadesh" target="_blank">
    <img alt="Telegram" src="https://img.shields.io/badge/Telegram-itswadesh-blue.svg?style=for-the-badge"></a>
</p>

<br/>
<p align="center">
  <a href="https://github.com/itswadesh/svelte-commerce/discussions/new/choose" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Discussions-blue?logo=github&style=for-the-badge" alt="GitHub Discussions" width="200" height="28"/>
  </a>
  <a href="https://discord.gg/GgdAeccwDR" target="_blank">
    <img src="https://img.shields.io/badge/Discord-Community-blueviolet?logo=discord&style=for-the-badge" alt="Discord Community" width="200" height="28"/>
  </a>
  <a href="https://twitter.com/itswadesh" target="_blank">
    <img src="https://img.shields.io/badge/Twitter-Follow-blue?logo=twitter&style=for-the-badge" alt="Twitter Follow" width="200" height="28"/>
  </a>
  <a href="https://reddit.com/u/itswadesh" target="_blank">
    <img src="https://img.shields.io/badge/Reddit-Profile-FF4500?logo=reddit&style=for-the-badge" alt="Reddit Profile" width="200" height="28"/>
  </a>
</p>

<p align="center">
Reach out to me with queries!
</p>
<br/>
<br/>

<div align="">

</div>
<br/>
<h2 class="text-center text-sm font-semibold text-gray-600">TRUSTED BY TEAMS AROUND THE WORLD</h2> 
<p>
<img hspace="10" alt="Varni Jewels" src="https://litekart.in/_app/immutable/assets/varni.DuN9QdLG.webp" class="h-fit w-28 px-2 dark:brightness-0 dark:invert" height="32" style="object-fit: contain;">
<img hspace="10" alt="LRNR" src=".github/lrnr.svg" class="h-8 px-2 dark:brightness-0 dark:invert" height="32" style="object-fit: contain;">
</p>
<br/>

## What is it?

- Svelte Commerce is a PWA storefront for your existing eCommerce based on SvelteKit.
- It is possible to connect with any eCommerce backend that provides an API.
- We are working on adapters for Medusa, Shopify, and WooCommerce.

## Features

- 👨🏻‍💻 It's both SSR and SPA
- 🚀 Superfast
- 🔗 It is possible to connect with any eCommerce backend if the backend has a REST API
- 🔓 Svelte Commerce is free and open source. Download and modify it the way you want
- 🛒 Most of the essential features for eCommerce are already integrated
- 💰 No need to make a big leap or invest a huge amount. Just take this open source project and attach it to your existing backend.

## Get Started

```
git clone https://github.com/itswadesh/svelte-commerce.git
cd svelte-commerce
npm i
npm run dev
```

That's all!

Open http://localhost:3000 on Chrome. Your app should be live with awesome svelte-commerce up and running

## Configuration

There is 1 place to configure

1. `kitcommerce.config.ts`
   This is used to define which service to use. Only 1 of the listed services can be active at a
   time — install that connector in `package.json` in place of `@misiki/litekart-connector`. Valid
   values are:
   - `export * as services from "@misiki/shopify-connector"`
   - `export * as services from "@misiki/litekart-connector"`
   - `export * as services from '@misiki/medusa-connector'`
   - `export * as services from '@misiki/vendure-connector'`
   - `export * as services from '@misiki/saleor-connector'`
   - `export * as services from '@misiki/commercetools-connector'`
   - `export * as services from '@misiki/woocommerce-connector'`

## Deployment

Click on the button to directly deploy to Netlify or Vercel. Zero configuration required.

<a href="https://app.netlify.com/start/deploy?repository=https://github.com/itswadesh/svelte-commerce" aria-label="Click to deploy into netlify">
<img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to netlify">
</a>

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fitswadesh%2Fsvelte-commerce&env=PUBLIC_LITEKART_DOMAIN)

The following environment variables are mandatory:

```
PUBLIC_LITEKART_DOMAIN=arialshop.com
PUBLIC_LITEKART_API_URL=https://api.litekart.in
```

You can replace the env variable with your store domain

### Docker

We also support docker images, use the following command to pull the latest docker image and deploy it:

```sh
docker run -d -p 3000:3000 ghcr.io/itswadesh/svelte-commerce:latest
```
