# Installable, offline-aware, self-updating storefront: design

Date: 2026-10-01 · Status: awaiting review

## Intent

**What the user asked for:** "use PWA with auto update, same as Ananta". Ananta is the user's Astro
site (`C:\projects\Ananta-Tours-Website`, `docs/project-decisions.md` §25). Its service worker and
update logic are the reference. The design summary was approved in conversation on 2026-10-01.

**Adapted, not copied:**
- Ananta is one static site. Svelte Commerce is one codebase serving many merchants from one
  server, so everything a shopper sees as the "app" (name, icon, colours) comes from the store
  record at request time.
- Ananta's pages hold their own content. Here, prices, stock and the bag come live from `/api`, so
  freshness rules are stricter.

**Success:**
- Chrome reports the storefront installable with no manifest errors, under the merchant's own name
  and icon.
- A service worker controls every page.
- Offline:
  - A page the shopper opened before is served from a saved copy that says so.
  - Any other page gets a short offline page.
  - Nothing in `/api`, checkout or account is ever served from a cache.
- A new deploy takes over without a manual refresh, and never reloads a page while the shopper is
  typing, has a drawer or dialog open, or is in checkout.

## Current state (2026-10-01)

- No service worker, and no manifest linked.
- `generate-manifest.js` writes a hard-coded "Litekart" manifest. Nothing runs it, and its output
  is not in `static/`.
- `src/app.html` links `apple-touch-icon` to `/favicon.png` (512×512). `+layout.svelte` already
  emits `theme-color` from the merchant palette.
- **Deploy detection already exists** (`src/routes/+layout.svelte:131-158`, `svelte.config.js:63-66`):
  SvelteKit polls `/_app/version.json` every 60s and on each navigation. When the deployed version
  differs, the next navigation becomes a hard load, which is safe. **And `location.reload()` runs at
  once, unconditionally**, which can drop a shopper's half-typed address or close their open bag.
- The store record (`/api/stores/public-details`) carries `name`, `logo` and `favicon` (absolute
  S3 URLs of unknown size), `description` (HTML) and `cssVariables` (HSL strings for `--primary`,
  `--background` and others).

## Design

### 1. Installable: a manifest per store

**`src/routes/manifest.webmanifest/+server.ts`** builds the manifest from the store record. It
resolves the store the same way `src/routes/+layout.server.ts` does, by store-id cookie or by
domain. The pure part lives in `src/lib/pwa/manifest.ts`, as `buildManifest(store)`:

| Field | Value |
| :-- | :-- |
| `id`, `scope` | `/` |
| `start_url` | `/?source=pwa` |
| `display` | `standalone` |
| `name` | store name |
| `short_name` | store name, or its first word when the name is longer than 12 characters |
| `description` | store description, tags stripped, at most 300 characters; omitted when empty |
| `theme_color` | the merchant's `--primary` from `cssVariables`, else the default theme's |
| `background_color` | the merchant's `--background`, else `#ffffff` |
| `icons` | `/pwa-icon/192.png`, `/pwa-icon/512.png` (purpose `any`), `/pwa-icon/512-maskable.png` (purpose `maskable`) |

- Colours pass through as CSS colour strings, which manifests accept.
- Served as `application/manifest+json` with `Cache-Control: public, max-age=3600`.
- Linked from `+layout.svelte`'s head as `<link rel="manifest" href="/manifest.webmanifest">`.
- The `apple-touch-icon` link in `app.html` moves to `/pwa-icon/180.png`.

**`src/routes/pwa-icon/[file]/+server.ts`** produces icons whose pixels match their declared size.
Install prompts check this.
- Accepted files: `180.png`, `192.png`, `512.png`, `512-maskable.png`. Anything else is a 404.
- Source image: the store `favicon`, else its `logo`, else `static/favicon.png`.
- Resized with `sharp`, contained on `background_color`. The maskable variant keeps the image
  inside the central 80% safe zone.
- `Cache-Control: public, max-age=86400`.
- **Fallback:** `sharp` is a devDependency, present in the Docker image because `bun i` installs
  devDependencies. It is imported lazily. If it is missing, or the source fetch fails, the route
  serves `static/favicon.png` unchanged. That is a correct 512 icon, and a size mismatch only
  warns for 180 and 192. `package.json` is not changed.

`generate-manifest.js` is deleted. This route supersedes it, and nothing references it.

### 2. Service worker: `src/service-worker.ts`

This uses SvelteKit's native service-worker support (`$service-worker` gives `build`, `files` and
`version`).

**Registration**
- `kit.serviceWorker.register: false` in `svelte.config.js`.
- The worker is registered by `src/lib/pwa/register.ts` from the root layout: production only,
  after `load`, at idle, as Ananta does. That keeps it out of the page's own loading.

**Routing** is a pure function, `strategyFor(url, request)` in `src/lib/pwa/strategy.ts`, used by
the worker and unit-tested.

| Request | Strategy |
| :-- | :-- |
| Not GET, cross-origin (S3 images, fonts, the API host), `/api/*`, `/proxy/*`, `/_app/version.json`, `/health`, `/manifest.webmanifest`, `/pwa-icon/*` | **untouched** (the browser's normal fetch) |
| Navigation to `/checkout*`, `/my*`, `/auth*` | **network only**, never stored; offline gets the offline page |
| Any other navigation | **network first**; a 200 `text/html` response is stored under its pathname (newest 40); offline: the saved copy, marked `data-saved-copy` on `<html>`, else the offline page |
| `/_app/immutable/*` | **cache first** (content-hashed); newest 120 |
| Same-origin files from `$service-worker`'s `files` (the `static/` directory) | **cached, refreshed behind**; newest 60 |

**Lifecycle**, as in Ananta:
- `install` precaches only `/offline` (see §3) and calls `skipWaiting()`.
- `activate` deletes every cache starting `sc-` that this version does not own, enables navigation
  preload, and calls `clients.claim()`.
- Cache names: `sc-pages-1`, `sc-app-1`, `sc-static-1`. Bump the number when what a cache holds
  changes shape.
- Every background cache write gives up after 20 seconds, because an old worker cannot hand over
  while it has work outstanding (Ananta's rule).
- A new deploy changes `version` and therefore the worker file, so the browser installs it on its
  next check and it takes over at once.

**Saved copies are per store by construction.** A service worker is scoped to its origin, and each
merchant has its own domain.

### 3. The offline page: `src/routes/offline/+page.svelte`

- Server-rendered per store: store name, a short "You're offline" message, the store phone and
  email from the store record when present (as `tel:` / `mailto:` links, which work offline), and
  a "Try again" link that reloads.
- `export const csr = false`, so the page needs none of the app's JavaScript.
- Precached at `install`. The worker fetches it from the same origin, so it carries that store's
  name.

### 4. Updates that wait for the shopper: `src/lib/pwa/auto-update.ts`

Deploy detection stays SvelteKit's `updated` (version polling). It is now also checked when the tab
becomes visible again and when the connection comes back. What changes is what happens next:

1. **On the next in-app navigation** the hard load stays as it is. Navigation is a safe moment.
2. **While the shopper sits on a page**, the immediate `location.reload()` is replaced by
   `reloadWhenIdle()`. It reloads as soon as `busy()` is false, checking every 3 seconds.
3. `busy()` is true while any of these hold:
   - an editable field has focus
   - any field differs from its default (value, checked or selected state)
   - an open modal: `[aria-modal="true"]`, `[role="dialog"][data-state="open"]` or
     `[data-vaul-drawer][data-state="open"]`
   - the route is `/checkout/*`; a shopper mid-payment is never reloaded, and their next navigation
     hard-loads instead
4. Before reloading, a `sessionStorage` flag is set. After the reload, a toast says "Updated to the
   latest version" (svelte-sonner, the existing toaster).
5. Each check also calls `registration.update()`, so the worker updates in step with the app.

**Saved copy behaviour**, in the same module:
- When `<html data-saved-copy>` is present, a toast says "You're offline — showing a saved copy",
  and the page reloads on the `online` event.
- Ananta's per-page ETag check is not carried over. Here, store content arrives live from the API,
  and a deploy is the only thing that makes an open page stale.

### 5. Out of scope

- Push notifications, background sync, an offline bag or offline checkout.
- A custom install button: the browser's own install UI is used.
- Caching product images. They are cross-origin (S3), and the browser's HTTP cache already holds
  them.

## Testing and verification

**Unit (vitest):**
- `tests/pwa-manifest.test.ts`:
  - fields from a store record
  - `short_name` truncation
  - description tags stripped and length capped
  - colour fallbacks when `cssVariables` lacks them
- `tests/pwa-strategy.test.ts`: every table row in §2, including that `/api`, `/checkout`, `/my`,
  `/auth`, version.json and cross-origin requests are untouched or network-only.
- `tests/pwa-auto-update.test.ts` (jsdom):
  - `busy()` for a focused field, a dirty field, an open dialog or drawer, and a checkout route
  - `reloadWhenIdle()` waits while busy and reloads, setting the flag, once idle

**Browser (`scripts/verify-pwa.mjs`):** Playwright with `channel: 'chrome'`, against the production
build. Kept out of `tests/` for the same reason as `verify-motion.mjs`. It checks:
- The manifest has no errors (`Page.getAppManifest`) and there are no installability errors
  (`Page.getInstallabilityErrors`). The name and icons are the store's.
- After a reload, the worker controls the page.
- A visited product page is in `sc-pages-1`; nothing under `/api` or `/checkout` is in any cache.
- Offline (`context.setOffline(true)`):
  - the visited page renders with `data-saved-copy` and the toast
  - an unvisited page renders the offline page with the store name
  - going back online reloads
- With `/_app/version.json` answering a different version (Playwright `route`):
  - an open cart drawer holds the reload for 5s
  - closing it reloads, and the "Updated" toast shows
- A new worker takes over: after the script swaps in a rebuilt `service-worker.js`,
  `registration.update()` makes it the controller without a manual refresh.

**Gates:**
- svelte-check adds no errors.
- vitest: no new failing files beyond the existing 19.
- `vite build` succeeds.
- `scripts/verify-motion.mjs` results are unchanged. The worker must not slow navigation.

## Risks

- **A stale saved page offline shows yesterday's price.** It is marked as a saved copy with a toast,
  checkout is never cached, and the live bag re-prices on reconnect.
- **A broken worker would stick.** Registration keeps the default `updateViaCache: 'imports'`, so
  the browser always checks the worker script itself against the network, whatever its HTTP cache
  headers. A corrected or emptied worker therefore replaces a broken one on the next visit, as in
  Ananta's recovery note.
- **The icon route depends on S3** for the source image. On failure it falls back to the bundled
  icon, so installability holds.
