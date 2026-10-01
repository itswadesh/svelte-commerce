# Motion layer: design

Date: 2026-10-01 · Sub-project 1 of "UI/UX Pro Max for svelte-commerce" · Status: awaiting review

Sub-project 2, the Pro Max audit-and-fix pass over accessibility, touch, layout, forms and
navigation, gets its own spec once this one ships. It builds on the tokens and module defined here.

## Intent

**What the user asked for:** "implement UI/UX pro max for svelte-commerce", scoped in conversation
to *motion + audit*, keeping the current editorial look, with motion first. Route changes
crossfade, and opening a product morphs the card image into the PDP gallery.

**The rule it must meet** (user's global CLAUDE.md): a UI change is done only when it has page
transitions, 150–300ms feedback on every interactive element and state change, and a
`prefers-reduced-motion` path that removes the movement and keeps the feedback. Animate
`transform` and `opacity`, and confirm that scrolling and animations hold their frame rate.

**The user's own browser reports `prefers-reduced-motion: reduce`.** The reduced path is what they
see day to day, so it is a first-class design, not a fallback. Status feedback such as spinners
keeps running in that mode, slowed.

**Success:**
- Every route change animates.
- Product image morphs card → PDP and back.
- Every control in scope answers hover, press, focus and state changes within 150–300ms.
- Under reduced motion nothing moves, but every one of those changes still visibly fades or
  changes colour; nothing snaps.
- No animation frame over 50ms, and about 60fps on average during the measured interactions.

## Current state (2026-10-01)

- Tokens exist but are barely used: `--motion-fast: 140ms`, `--motion-panel: 200ms`,
  `--motion-ease` (`src/app.css:59`), mapped to `duration-fast`, `duration-panel` and
  `ease-standard` (`tailwind.config.ts:169`).
- 60 raw `duration-300/500/700/1000` classes across 29 in-scope files.
- 21 in-scope files import `svelte/transition` directly (14 `fade`, 15 `fly`, 3 `slide`,
  1 `scale`), each with its own duration and its own reduced-motion handling, or none.
- No route transitions. `onNavigate` is used only by `auth-modal.svelte`.
- The global reduced-motion block (`src/app.css:503`) sets overlay `animate-in` / `animate-out` to
  **1ms** and removes button transitions entirely, so in the user's browser dialogs, sheets,
  popovers and buttons snap with no feedback. That breaks "keep the feedback".
- `.ed-btn-base` hover lifts 2px over 300ms with its own curve (`src/app.css:469`).

## Design

### 1. Tokens

`src/app.css` (`:root`), mapped in `tailwind.config.ts`:

| Token | Value | Use | Tailwind |
| :-- | :-- | :-- | :-- |
| `--motion-fast` | 150ms | feedback: hover, press, focus state, toggles, popovers | `duration-fast` |
| `--motion-panel` | 220ms | panels: drawers, dialogs, accordions, route crossfade | `duration-panel` |
| `--motion-emphasis` | 300ms | the product morph, success check, heart pop, card image hover | `duration-emphasis` |
| `--motion-exit-ratio` | 0.7 | exits run at 70% of their enter duration | — |
| `--motion-ease` | `cubic-bezier(0.22, 0.61, 0.36, 1)` (unchanged) | enter and state changes | `ease-standard` |
| `--motion-ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | exits | `ease-exit` |

All three durations sit inside the user's 150–300ms rule and the `UX_SYSTEM.md` bands (feedback
120–180, panels 180–240). `UX_SYSTEM.md` §4 gains a short motion contract pointing here, and the
stale "no motion-duration tokens" gap note is removed.

**What may animate:** movement only through `transform` and `opacity`. Colour, background and
border-colour transitions are allowed, because they repaint without layout. Never `width`,
`height`, `top`/`left`, `margin` or `padding`. One consequence: accordions stop animating height.
Their content fades and rises 4px while the space opens at once (see §2, `slide`).

**Sweep rule:** on interactive elements, raw `duration-300/500/700/1000` becomes the matching
token. Long timings that are not feedback stay as they are: hero autoplay intervals, skeleton
pulse, carousel scroll. Every replaced class goes in the change list in the plan, file by file.

### 2. `$lib/motion` (new, `src/lib/motion/index.ts`)

Drop-in replacements for `svelte/transition`, reading the tokens and honouring reduced motion:

```ts
export { fade, fly, slide, scale } // same call signatures as svelte/transition
export const prefersReducedMotion: { readonly current: boolean } // live, SSR-safe (false on server)
```

- Default durations come from the tokens: `fade` and `scale` use fast, `fly` and `slide` use
  panel. The `out` direction gets the exit ratio and exit ease. An explicit `duration` from the
  caller still wins, which keeps call sites honest during the sweep.
- **Reduced motion:** `fly`, `slide` and `scale` return a `fade` of the same duration. Nothing
  becomes 0ms.
- `slide` is re-implemented as fade plus `translateY(-4px → 0)`, with no height interpolation, to
  satisfy the transform-and-opacity rule.
- The 21 in-scope importers switch `from 'svelte/transition'` to `from '$lib/motion'`, and their
  local `matchMedia` checks for reduced motion are deleted (`contact-us/+page.svelte:27`,
  `cart-sidebar.svelte:95`).

### 3. Route transitions (`src/lib/motion/route-transition.ts`, wired in `src/routes/+layout.svelte`)

```ts
onNavigate((navigation) => startRouteTransition(navigation))
```

`startRouteTransition` returns nothing (plain navigation) when any of these hold:
- `document.startViewTransition` is missing. Firefox and older Safari keep today's instant
  navigation.
- `navigation.type` is `enter` or `leave`.
- `from` and `to` share a pathname, which covers query-only changes: filters, sort, pagination,
  `?variant_id`. Those already have busy states, and a full-page crossfade would fight them.

Otherwise it wraps the DOM update in `document.startViewTransition` and resolves once
`navigation.complete` settles. This is the standard SvelteKit pattern.

**Crossfade:** `::view-transition-old(root)` and `::view-transition-new(root)` run
`--motion-panel` with the standard and exit eases. These elements carry static names, so they hold
still instead of fading:
- `site-header` on `nav.svelte`'s `<header>`
- `site-footer` on `footer.svelte`'s `<footer>`
- `bottom-nav` on the mobile bottom nav

Checkout has its own chrome without them, which is fine: names only need to be unique, not
present.

**Product morph.** Names are assigned **only by the hook, never in markup**. A static name on the
PDP gallery would collide with a clicked related-product card on the same page, and a duplicate
name aborts the whole transition.

- Elements opt in with data attributes:
  - `data-vt-product-media="<slug>"` on the card media wrapper, in `DefaultProductCard.svelte` and
    the shared `product-card.svelte`
  - `data-vt-gallery-primary` on the PDP's first gallery slide (`product-gallery.svelte`, slide 0)
- **Into a PDP:**
  - Before the snapshot: clear every `product-media` name, then set it on the first visible
    element matching `[data-vt-product-media="<to slug>"]`.
  - In the update callback, after `navigation.complete`: set it on `[data-vt-gallery-primary]`.
- **Out of a PDP to a page that lists it** (Back to the listing): the reverse. The gallery is
  named before the snapshot, and the matching card is named after the new DOM and its restored
  scroll position are in place. If no visible card matches, only the crossfade runs.
- PDP → PDP (a related product): the clicked card is the source, and the old gallery is cleared
  first.
- After `transition.finished`, every name the hook set is cleared.
- The morph runs `--motion-emphasis` on `::view-transition-group(product-media)`, and the
  image's old and new snapshots crossfade inside it.
- Under reduced motion the morph name is never assigned, so the route is a plain crossfade, which
  is opacity only.

### 4. Micro-interactions

All values come from §1. Each line lists hover / press / focus / state, then the reduced-motion
form.

| Element | Full motion | Reduced motion |
| :-- | :-- | :-- |
| Buttons (`.ed-btn-base`, `ui/button`) | hover colour/opacity (fast); filled CTAs lift 2px; press `scale(.97)` (fast) | colour/opacity only |
| Icon buttons (header, wishlist, close) | hover background (fast); press `scale(.92)` | background only |
| Text links in nav, mega-menu, footer | underline via `::after` `scaleX(0→1)` from the left (fast) | underline fades in |
| Product card | image `scale(1.03)` (emphasis); quick-add fades in and rises 4px (fast); press `scale(.98)` | quick-add fades; no scale |
| Wishlist toggle | heart `scale(1→1.2→1)` (emphasis), fill crossfades | fill crossfade only |
| Add to cart | idle → spinner → check (held 1.2s) → idle, labels crossfading (fast); check pops `scale(.6→1)` | crossfades; spinner keeps turning (1.6s) |
| Cart count badge | `scale(1→1.15→1)` on change (panel) | number crossfades |
| Inputs, selects | border colour and ring on focus (fast); error text fades in and rises 2px | colour; error fades |
| Checkbox / radio / switch | mark `scale(.6→1)`; switch thumb `translateX` (fast) | mark fades; thumb moves instantly, track colour fades |
| Accordions (PDP specs and description, filters) | chevron rotates (panel); content via `$lib/motion` `slide` | chevron instant, content fades |
| Dialog | fade + `scale(.96→1)` in (panel), out at the exit ratio | fade only, same duration |
| Sheet / drawer (cart, filters, menu, size guide) | slide in (panel), out at the exit ratio; backdrop fades | panel and backdrop fade |
| Popover / dropdown / select / tooltip / mega-menu | fade + 4px translate (fast) | fade only |
| Skeletons, spinners | unchanged | pulse 3s, spin 1.6s (existing) |

**The focus ring appears immediately.** A delayed indicator lags keyboard users. The 150ms
feedback on focus is the control's own colour or border change.

### 5. Reduced-motion path (`src/app.css`)

Rewrite the global block's rules so that:
- Overlays keep their durations (no more 1ms). Their transforms are neutralised by resetting
  tailwindcss-animate's variables: `--tw-enter-scale: 1`, `--tw-enter-translate-x/y: 0`,
  `--tw-enter-rotate: 0`, and the exit equivalents. `animate-in` / `animate-out` then become pure
  fades.
- `.ed-btn-base` keeps colour and opacity transitions and loses only `transform`.
- `::view-transition-group(*)` runs no movement; the root crossfade stays.
- The existing spinner and pulse slow-downs and the hero entrance override stay.

Component `<style>` blocks that already have their own reduced-motion rules are aligned to this
contract during the sweep (listed in the plan), not left divergent.

### 6. Out of scope

- Themes wine, organic, lime and noor: not designed for. Shared files stay safe for them.
- `src/lib/core/**` (package-owned): its one `svelte/transition` importer stays untouched.
- Toast internals (svelte-sonner): left as shipped.
- Any change to the look: colour, type, spacing, layout. That belongs to sub-project 2.

## Testing and verification

**Unit (vitest, `tests/motion.test.ts`):**
- `$lib/motion`:
  - token default durations
  - exit ratio on `out`
  - reduced motion turns `fly`, `slide` and `scale` into fades of equal, non-zero duration
  - SSR-safe `prefersReducedMotion`
- `route-transition`:
  - skip rules: unsupported browser, `enter`/`leave`, same pathname, query-only change
  - morph naming on a jsdom fixture: exactly one `product-media` name at snapshot time, including
    PDP → PDP with a named gallery present
  - names cleared after `finished`
  - no naming under reduced motion

**Browser (`scripts/verify-motion.mjs`, Playwright with `channel: 'chrome'`, against the
production build on `node build`):**
- Kept out of `tests/` on purpose: vitest picks up every `tests/**/*.spec.ts`, which is why the
  existing Playwright specs show up as vitest failures.
- Runs twice, with `reducedMotion: 'no-preference'` and with `'reduce'`. Checks:
  - home → listing → PDP → Back: each navigation runs a view transition (`document.startViewTransition` spied)
  - the morph group exists only in the full-motion run
  - no console errors
- Frame timing: requestAnimationFrame deltas recorded during a 2s listing scroll, the animation
  phase of card → PDP (from `transition.ready` to `transition.finished`), cart drawer open and
  close, and mega-menu open. **Pass:** no frame over 50ms and an average of 55fps or better,
  unthrottled. A 4× CPU-throttled run is reported, not gated.
- Visual spot-check in the user's Chrome, which runs reduced motion, at 390px and 1280px.

**Gates:**
- svelte-check: no errors in touched files, total at or below the 90-error count of 2026-10-01
- `bunx vitest run`: no new failing files beyond the existing 19
- `vite build` succeeds

## Risks

- **Duplicate `view-transition-name` aborts a transition.** Mitigated by hook-only naming and a
  unit test for it. The failure mode is graceful: the navigation still completes, just without
  animation.
- **Back-navigation morph depends on scroll restoration** having happened before naming. If
  SvelteKit restores later than `navigation.complete`, the card is off-screen and the morph
  silently degrades to the crossfade. Acceptable, and the browser script checks it.
- **Sticky header with a view-transition name** is raised into its own layer during transitions.
  A visual check covers it at both widths.
