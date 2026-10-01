# Motion Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the svelte-commerce storefront route transitions (crossfade plus a card-to-gallery image morph), 150–300ms feedback on every interactive element, and a reduced-motion path that removes movement but keeps feedback.

**Architecture:**
- Motion tokens live in `src/app.css`. A small module, `src/lib/motion`, mirrors them for script-driven Svelte transitions and owns the reduced-motion fallback.
- A single `onNavigate` hook in the root layout wraps navigations in `document.startViewTransition` and names the morphing image through a `data-vt-morph` attribute.
- Everything else is a sweep: components move off raw durations, their own `svelte/transition` imports and their own reduced-motion rules, onto those shared pieces.

**Tech Stack:** SvelteKit 2.69, Svelte 5.56 (runes), Tailwind 3.4 + tailwindcss-animate, bits-ui / shadcn-svelte, vitest 3 (jsdom), Playwright 1.50 (`channel: 'chrome'`), Bun for scripts.

**Spec:** `docs/superpowers/specs/2026-10-01-motion-layer-design.md`. Read it before starting; this plan argues from it.

## Global Constraints

Every task's requirements implicitly include this section. The values come from the spec.

**Tokens and timing**
- `--motion-fast: 150ms` · `--motion-panel: 220ms` · `--motion-emphasis: 300ms` · `--motion-exit: 160ms` · `--motion-ease: cubic-bezier(0.22, 0.61, 0.36, 1)` · `--motion-ease-exit: cubic-bezier(0.4, 0, 1, 1)`.
- Nothing animates outside 150–300ms. Nothing exits under 150ms.

**What may animate**
- Movement only through `transform` and `opacity`.
- Colour, background, border-colour, fill and box-shadow transitions are allowed.
- Never animate `width`, `height`, `top`/`left`, `margin`, `padding` or `grid-template-rows`.

**Reduced motion** (`prefers-reduced-motion: reduce`, which the user's own Chrome reports)
- No translate, scale or morph.
- Opacity and colour feedback keep their full duration. Nothing snaps to 0ms.
- Spinners keep turning (1.6s per turn).

**The focus ring appears immediately.** Never transition it.

**Scope**
- In scope: the default theme and shared components.
- Do not edit `src/lib/core/**` or `node_modules/**`.
- Do not design for `src/lib/theme/{wine,organic,lime,noor}/**`, but do not break them.
- Leave `package.json` and `bun.lock` alone.

**Repo conventions**
- Prettier: tabs, single quotes, no semicolons (`bunx prettier --write <files>`).
- Svelte 5 runes only.
- No hard-coded hex colours. No arbitrary `z-[…]` values in new code.

**Verification commands**
- Types: `bunx svelte-check --tsconfig ./tsconfig.json` (`bun run check` is broken). Baseline on 2026-10-01: **90 errors**. Touched files must add none.
- Unit tests: `bunx vitest run <file>`. The full suite has **19 pre-existing failing files**; that number must not grow.
- Build: `BUILD_TIME="$(date -u +'%Y-%m-%d %H:%M:%S')" bun run build`.
- Production server for browser checks: `PORT=3100 PUBLIC_LITEKART_API_URL=https://api.litekart.in PUBLIC_LITEKART_DOMAIN=demo.litekart.in node build`.
  - Browse it at `http://127.0.0.1:3100`, not `localhost`. The user's Chrome holds a stale `localhost` store cookie that renders "Store not found".

**Git**
- Commit at the end of every task, ending each message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Push `main` after Task 9 passes.

## Review Focus

These are the five inputs most likely to bite a shopper that the spec implies but does not spell out. Each is pinned by a test in the owning task.

1. **A product slug with non-ASCII characters** (`/products/bague-%C3%A9toile`). The morph must still find the card whose `data-vt-product-media` holds the decoded slug. *Task 3, test "matches an encoded slug".*
2. **A second navigation before the first transition finishes** (double click, or click then Back). The first transition's cleanup must not strip the second one's names. *Task 3, test "a stale transition does not clear a newer one".*
3. **Back to a listing where the product's card is off-screen or not rendered** (paginated, filtered, scrolled away). Only the crossfade runs, with no error and no stray name. *Task 3, test "no visible card on return means crossfade only".*
4. **A navigation that fails or is cancelled** (`navigation.complete` rejects). No unhandled rejection, and no name left behind. *Task 3, test "a failed navigation leaves nothing named".*
5. **The OS reduced-motion setting flipped mid-session.** Each transition must read the live setting, not one cached at load. *Task 1, test "reads the reduced-motion setting live".*

---

## File map

| File | Responsibility | Task |
| :-- | :-- | :-- |
| `src/app.css` | tokens · route-transition CSS · motion utilities and keyframes · global reduced-motion block | 1, 3, 4, 7 |
| `tailwind.config.ts` | `duration-fast/panel/emphasis/exit`, `ease-standard/exit` | 1 |
| `src/lib/motion/index.ts` (new) | `fade` `fly` `slide` `scale` `drawer`, `motionMs`, `isReducedMotion`, `prefersReducedMotion` | 1 |
| `src/lib/motion/route-transition.ts` (new) | `startRouteTransition` and its helpers | 3 |
| `src/routes/+layout.svelte` | wires `onNavigate` | 3 |
| `tests/motion.test.ts`, `tests/route-transition.test.ts` (new) | unit tests | 1, 3 |
| `scripts/verify-motion.mjs` (new) | Playwright transitions and frame-timing check | 8 |
| `UX_SYSTEM.md`, `docs/UX_AUDIT.md` | motion contract, status row | 1, 9 |
| components listed per task | sweep | 2, 4–7 |

---

### Task 1: Motion tokens and `$lib/motion`

**Files:**
- Modify: `src/app.css:59-63`
- Modify: `tailwind.config.ts:167-175`
- Modify: `UX_SYSTEM.md`
- Create: `src/lib/motion/index.ts`
- Test: `tests/motion.test.ts`

**Interfaces:**
- Produces:
  - `motionMs(token: 'fast' | 'panel' | 'emphasis' | 'exit'): number`
  - `FALLBACK_MS`
  - `isReducedMotion(): boolean`
  - `prefersReducedMotion: { readonly current: boolean }`
  - Transitions `fade`, `fly({ x?, y?, opacity?, delay?, duration?, easing? })`, `slide`, `scale({ start?, opacity?, … })` and `drawer({ edge?: 'left' | 'right' | 'bottom', … })`. All are Svelte 5 transition functions `(node, params, options?: { direction })`.
  - Tailwind classes `duration-fast|panel|emphasis|exit` and `ease-standard|exit`.

- [ ] **Step 1: Write the failing test** — create `tests/motion.test.ts`:

```ts
import { describe, it, expect, vi, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { cubicIn, cubicOut } from 'svelte/easing'
import { FALLBACK_MS, motionMs, fade, fly, slide, scale, drawer, prefersReducedMotion } from '$lib/motion'

const reduce = (on: boolean) =>
	vi.stubGlobal('matchMedia', (query: string) => ({
		matches: on && query.includes('reduce'),
		media: query,
		addListener() {},
		removeListener() {},
		addEventListener() {},
		removeEventListener() {}
	}))

afterEach(() => vi.unstubAllGlobals())

const node = () => document.createElement('div')
const out = { direction: 'out' as const }

describe('motion tokens', () => {
	it('mirror the values in src/app.css', () => {
		const css = readFileSync('src/app.css', 'utf8')
		for (const [token, ms] of Object.entries(FALLBACK_MS)) {
			expect(css).toMatch(new RegExp(`--motion-${token}:\\s*${ms}ms;`))
		}
	})

	it('fall back when the stylesheet cannot be read', () => {
		expect(motionMs('panel')).toBe(220)
	})
})

describe('transitions, full motion', () => {
	it('fade defaults to fast, and fast elements exit at fast', () => {
		reduce(false)
		expect(fade(node()).duration).toBe(150)
		expect(fade(node()).easing).toBe(cubicOut)
		expect(fade(node(), {}, out).duration).toBe(150)
		expect(fade(node(), {}, out).easing).toBe(cubicIn)
	})

	it('panel-length transitions exit at --motion-exit', () => {
		reduce(false)
		expect(fly(node(), { y: 24 }).duration).toBe(220)
		expect(fly(node(), { y: 24 }, out).duration).toBe(160)
		expect(drawer(node(), { edge: 'left' }, out).duration).toBe(160)
	})

	it('an explicit duration wins', () => {
		reduce(false)
		expect(fly(node(), { duration: 180 }).duration).toBe(180)
	})

	it('fly moves by transform only', () => {
		reduce(false)
		const css = fly(node(), { y: 24 }).css!(0, 1)
		expect(css).toContain('translate(0px, 24px)')
		expect(css).not.toMatch(/height|width|top|left:/)
	})

	it('slide never interpolates height', () => {
		reduce(false)
		const css = slide(node()).css!(0.5, 0.5)
		expect(css).toContain('translateY(-2px)')
		expect(css).not.toContain('height')
	})

	it('drawer translates from its edge', () => {
		reduce(false)
		expect(drawer(node(), { edge: 'right' }).css!(0, 1)).toContain('translateX(100%)')
		expect(drawer(node(), { edge: 'left' }).css!(0, 1)).toContain('translateX(-100%)')
		expect(drawer(node(), { edge: 'bottom' }).css!(0, 1)).toContain('translateY(100%)')
	})

	it('scale starts at .96 by default', () => {
		reduce(false)
		expect(scale(node()).css!(0, 1)).toContain('scale(0.96)')
	})
})

describe('transitions, reduced motion', () => {
	it('fly, slide, scale and drawer become fades of the same, non-zero duration', () => {
		reduce(true)
		for (const config of [fly(node(), { y: 24 }), slide(node()), drawer(node(), { edge: 'right' })]) {
			expect(config.duration).toBe(220)
			expect(config.css!(0.5, 0.5)).not.toContain('transform')
			expect(config.css!(0.5, 0.5)).toContain('opacity')
		}
		expect(scale(node()).duration).toBe(150)
		expect(scale(node()).css!(0.5, 0.5)).not.toContain('transform')
	})

	it('reads the reduced-motion setting live', () => {
		reduce(false)
		expect(prefersReducedMotion.current).toBe(false)
		reduce(true)
		expect(prefersReducedMotion.current).toBe(true)
		expect(fly(node(), { y: 24 }).css!(0, 1)).not.toContain('transform')
	})

	it('is false where matchMedia does not exist (SSR)', () => {
		vi.stubGlobal('matchMedia', undefined)
		expect(prefersReducedMotion.current).toBe(false)
	})
})
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `bunx vitest run tests/motion.test.ts`
Expected: FAIL. `Failed to resolve import "$lib/motion"`.

- [ ] **Step 3: Update the tokens.** In `src/app.css`, replace:

```css
		/* Motion. 120-180ms for feedback, 180-240ms for panels. --motion-ease carries
		   the curve that used to sit unused in --ease. */
		--motion-fast: 140ms;
		--motion-panel: 200ms;
		--motion-ease: cubic-bezier(0.22, 0.61, 0.36, 1);
```

with:

```css
		/* Motion. One scale for the storefront — see
		   docs/superpowers/specs/2026-10-01-motion-layer-design.md. Fast is feedback; panel is
		   drawers, dialogs and the route crossfade; emphasis is the product morph, success marks and
		   card-image hover. Panels exit at --motion-exit, and nothing exits under 150ms.
		   src/lib/motion/index.ts mirrors these numbers for script-driven transitions. */
		--motion-fast: 150ms;
		--motion-panel: 220ms;
		--motion-emphasis: 300ms;
		--motion-exit: 160ms;
		--motion-ease: cubic-bezier(0.22, 0.61, 0.36, 1);
		--motion-ease-exit: cubic-bezier(0.4, 0, 1, 1);
```

In `tailwind.config.ts`, replace:

```ts
			// `duration-fast` for feedback (120-180ms), `duration-panel` for panels
			// (180-240ms), `ease-standard` for both.
			transitionDuration: {
				fast: 'var(--motion-fast)',
				panel: 'var(--motion-panel)'
			},
			transitionTimingFunction: {
				standard: 'var(--motion-ease)'
			}
```

with:

```ts
			// The motion tokens from src/app.css. tailwindcss-animate copies transitionDuration and
			// transitionTimingFunction into its animation utilities, so `duration-panel` on an
			// `animate-in` overlay sets its animation length too.
			transitionDuration: {
				fast: 'var(--motion-fast)',
				panel: 'var(--motion-panel)',
				emphasis: 'var(--motion-emphasis)',
				exit: 'var(--motion-exit)'
			},
			transitionTimingFunction: {
				standard: 'var(--motion-ease)',
				exit: 'var(--motion-ease-exit)'
			}
```

- [ ] **Step 4: Write the module.** Create `src/lib/motion/index.ts`:

```ts
import { cubicIn, cubicOut } from 'svelte/easing'
import type { EasingFunction, TransitionConfig } from 'svelte/transition'

// Drop-in replacements for svelte/transition that read the motion tokens and honour reduced
// motion. Under `prefers-reduced-motion: reduce` every moving transition becomes a fade of the
// same length: the movement goes, the feedback stays. See
// docs/superpowers/specs/2026-10-01-motion-layer-design.md §2.

export type MotionToken = 'fast' | 'panel' | 'emphasis' | 'exit'

/** The `--motion-*` values in src/app.css, for when the stylesheet cannot be read (SSR, jsdom).
 *  tests/motion.test.ts fails if the two drift apart. */
export const FALLBACK_MS: Readonly<Record<MotionToken, number>> = { fast: 150, panel: 220, emphasis: 300, exit: 160 }

/** A motion token in milliseconds, read from the stylesheet so app.css stays the one source. */
export function motionMs(token: MotionToken): number {
	if (typeof document === 'undefined') return FALLBACK_MS[token]
	const raw = getComputedStyle(document.documentElement).getPropertyValue(`--motion-${token}`).trim()
	const value = parseFloat(raw)
	if (!Number.isFinite(value) || value <= 0) return FALLBACK_MS[token]
	return raw.endsWith('ms') ? value : value * 1000
}

/** Read on every call, so an OS setting flipped mid-session applies to the next transition. */
export function isReducedMotion(): boolean {
	return typeof globalThis.matchMedia === 'function' && globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches === true
}

/** Live and SSR-safe: false on the server, the current media query in the browser. */
export const prefersReducedMotion = {
	get current() {
		return isReducedMotion()
	}
}

type Timing = { delay?: number; duration?: number; easing?: EasingFunction }
type Options = { direction?: 'in' | 'out' | 'both' }
type Resolved = { delay: number; duration: number; easing: EasingFunction }

// `out:` gets exit timing. A bidirectional `transition:` arrives as 'both' and reverses at its
// enter duration, because Svelte computes the config once for both directions.
function timing(params: Timing, token: 'fast' | 'panel' | 'emphasis', options?: Options): Resolved {
	const exiting = options?.direction === 'out'
	return {
		delay: params.delay ?? 0,
		duration: params.duration ?? motionMs(exiting && token !== 'fast' ? 'exit' : token),
		easing: params.easing ?? (exiting ? cubicIn : cubicOut)
	}
}

function opacityOf(node: Element): number {
	const value = parseFloat(getComputedStyle(node).opacity)
	return Number.isFinite(value) ? value : 1
}

// Composes with a transform the element already carries (`-translate-x-1/2` on a centred panel).
function transformOf(node: Element): string {
	const value = getComputedStyle(node).transform
	return value && value !== 'none' ? `${value} ` : ''
}

function fadeOnly(node: Element, resolved: Resolved): TransitionConfig {
	const target = opacityOf(node)
	return { ...resolved, css: (t) => `opacity: ${t * target}` }
}

export function fade(node: Element, params: Timing = {}, options?: Options): TransitionConfig {
	return fadeOnly(node, timing(params, 'fast', options))
}

export function fly(node: Element, params: Timing & { x?: number; y?: number; opacity?: number } = {}, options?: Options): TransitionConfig {
	const resolved = timing(params, 'panel', options)
	if (isReducedMotion()) return fadeOnly(node, resolved)
	const target = opacityOf(node)
	const transform = transformOf(node)
	const { x = 0, y = 0, opacity = 0 } = params
	const delta = target * (1 - opacity)
	return { ...resolved, css: (_t, u) => `transform: ${transform}translate(${u * x}px, ${u * y}px); opacity: ${target - delta * u}` }
}

/** Not svelte's slide: no height interpolation (that is layout), a 4px rise and a fade instead. */
export function slide(node: Element, params: Timing = {}, options?: Options): TransitionConfig {
	const resolved = timing(params, 'panel', options)
	if (isReducedMotion()) return fadeOnly(node, resolved)
	const target = opacityOf(node)
	const transform = transformOf(node)
	return { ...resolved, css: (t, u) => `transform: ${transform}translateY(${-4 * u}px); opacity: ${t * target}` }
}

export function scale(node: Element, params: Timing & { start?: number; opacity?: number } = {}, options?: Options): TransitionConfig {
	const resolved = timing(params, 'fast', options)
	if (isReducedMotion()) return fadeOnly(node, resolved)
	const target = opacityOf(node)
	const transform = transformOf(node)
	const { start = 0.96, opacity = 0 } = params
	const opacityDelta = target * (1 - opacity)
	return { ...resolved, css: (t, u) => `transform: ${transform}scale(${start + (1 - start) * t}); opacity: ${target - opacityDelta * u}` }
}

export type DrawerEdge = 'left' | 'right' | 'bottom'

const FROM_EDGE: Record<DrawerEdge, (u: number) => string> = {
	left: (u) => `translateX(${-u * 100}%)`,
	right: (u) => `translateX(${u * 100}%)`,
	bottom: (u) => `translateY(${u * 100}%)`
}

/** An edge-anchored panel slides in from its edge; it does not squash or fade on the way. */
export function drawer(node: Element, params: Timing & { edge?: DrawerEdge } = {}, options?: Options): TransitionConfig {
	const resolved = timing(params, 'panel', options)
	if (isReducedMotion()) return fadeOnly(node, resolved)
	const move = FROM_EDGE[params.edge ?? 'right']
	return { ...resolved, css: (_t, u) => `transform: ${move(u)}` }
}
```

- [ ] **Step 5: Run the test and confirm it passes**

Run: `bunx vitest run tests/motion.test.ts`
Expected: PASS, 12 tests.

- [ ] **Step 6: Record the contract in `UX_SYSTEM.md`.**
  - In §4 "Foundation tokens", replace the line `- Motion: 120–180ms for feedback, 180–240ms for panels. Respect \`prefers-reduced-motion\`.` with:

```md
- Motion: `duration-fast` 150ms (feedback), `duration-panel` 220ms (panels, route crossfade),
  `duration-emphasis` 300ms (product morph, success, card-image hover), `duration-exit` 160ms
  (panel exits); `ease-standard` / `ease-exit`. Move with `transform` and `opacity` only. Script
  transitions come from `$lib/motion`, never `svelte/transition`. Under reduced motion nothing
  moves and nothing snaps: movement becomes a fade of the same length. Contract:
  `docs/superpowers/specs/2026-10-01-motion-layer-design.md`.
```

  - In §2, delete `no motion-duration tokens,` from the "Known foundation gaps" sentence.

- [ ] **Step 7: Format, type-check, commit**

```bash
bunx prettier --write src/lib/motion/index.ts tests/motion.test.ts tailwind.config.ts
bunx svelte-check --tsconfig ./tsconfig.json --output machine | grep -E "lib/motion|motion.test|COMPLETED"
git add src/app.css tailwind.config.ts src/lib/motion/index.ts tests/motion.test.ts UX_SYSTEM.md
git commit -m "feat(motion): one token scale and a reduced-motion-aware transition module

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: no svelte-check line for `lib/motion` or `motion.test`. COMPLETED at or below 90 errors.

---

### Task 2: Move every in-scope `svelte/transition` user onto `$lib/motion`

**Files (all Modify):**
- `src/lib/components/chat/conversational-shopping.svelte`
- `src/lib/components/common/modal.svelte`
- `src/lib/components/coupon/coupons-drawer.svelte`
- `src/lib/components/nav/bottom-nav.svelte`
- `src/lib/components/nav/cart-sidebar.svelte`
- `src/lib/components/nav/mega-menu.svelte`
- `src/lib/components/nav/nav.svelte`
- `src/lib/components/product-catalogue/desktop-filter.svelte`
- `src/routes/(legal)/contact-us/+page.svelte`
- `src/routes/(my)/+layout.svelte`
- `src/routes/(my)/my/addresses/+page.svelte`
- `src/routes/(my)/my/orders/+page.svelte`
- `src/routes/(my)/my/profile/+page.svelte`
- `src/routes/(my)/my/wishlist/+page.svelte`
- `src/routes/(www)/+page.svelte`
- `src/routes/(www)/checkout/success/+page.svelte`
- under `src/routes/(www)/products/[slug]/components/`: `product-cart-and-wishlist-buttons.svelte`, `product-description.svelte`, `product-details.svelte`, `product-reviews-section.svelte`, `product-specifications.svelte`, `size-guide-drawer.svelte`

**Interfaces:**
- Consumes: `fade`, `fly`, `slide`, `scale` and `drawer` from `$lib/motion` (Task 1).

**Rules applied below:**
- Drop every `duration` and custom `easing` so the tokens apply.
- Keep geometry: fly distances capped at 24px, except edge drawers, which become `drawer`.
- Drawers that close get separate `in:` / `out:` so they take exit timing.
- List staggers cap at 5 items × 40ms.

- [ ] **Step 1: Swap the imports.** Make each replacement exactly:

| File | Old | New |
| :-- | :-- | :-- |
| conversational-shopping.svelte:3 | `import { fly, fade } from 'svelte/transition'` | `import { fly, fade } from '$lib/motion'` |
| modal.svelte:3 | `import { fade } from 'svelte/transition'` | `import { fade } from '$lib/motion'` |
| coupons-drawer.svelte:7 | `import { fly } from 'svelte/transition'` | `import { fade } from '$lib/motion'` |
| bottom-nav.svelte:6 | `import { slide } from 'svelte/transition'` | `import { drawer } from '$lib/motion'` |
| cart-sidebar.svelte:9 | `import { cubicOut } from 'svelte/easing'` | `import { drawer, fade } from '$lib/motion'` |
| mega-menu.svelte:7 | `import { fade } from 'svelte/transition'` | `import { fade, fly, motionMs } from '$lib/motion'` |
| nav.svelte:12–13 | `import { fade, fly } from 'svelte/transition'` and the next line `import { cubicOut } from 'svelte/easing'` | `import { drawer, fade } from '$lib/motion'` (one line; delete the easing import) |
| desktop-filter.svelte:5–6 | `import { fade, fly } from 'svelte/transition'` and `import { quintOut } from 'svelte/easing'` | `import { fade, fly } from '$lib/motion'` |
| contact-us/+page.svelte:13 | `import { fade } from 'svelte/transition'` | `import { fade } from '$lib/motion'` |
| (my)/+layout.svelte:13–14 | `import { fade, fly } from 'svelte/transition'` and `import { cubicOut } from 'svelte/easing'` | `import { drawer, fade } from '$lib/motion'` |
| addresses/+page.svelte:8 | `import { fade, fly } from 'svelte/transition'` | `import { fade, fly } from '$lib/motion'` |
| orders/+page.svelte:23 | `import { fade, fly } from 'svelte/transition'` | `import { fade, fly } from '$lib/motion'` |
| profile/+page.svelte:7 | `import { fly, fade } from 'svelte/transition'` | `import { fly, fade } from '$lib/motion'` |
| wishlist/+page.svelte:5 | `import { fade, fly } from 'svelte/transition'` | `import { fade, fly } from '$lib/motion'` |
| (www)/+page.svelte:3 | `import { fly } from 'svelte/transition'` | `import { fly } from '$lib/motion'` |
| checkout/success/+page.svelte:9 | `import { fade, fly } from 'svelte/transition'` | `import { fly } from '$lib/motion'` (`fade` was unused) |
| product-cart-and-wishlist-buttons.svelte:8, :10 | `import { fly } from 'svelte/transition'`; delete `import { quintOut } from 'svelte/easing'` | `import { fade, fly } from '$lib/motion'` |
| product-description.svelte:5–6 | `import { slide } from 'svelte/transition'` and `import { prefersReducedMotion } from 'svelte/motion'` | `import { slide } from '$lib/motion'` |
| product-details.svelte:29–30 | `import { fly } from 'svelte/transition'` and `import { prefersReducedMotion } from 'svelte/motion'` | `import { fly } from '$lib/motion'` |
| product-reviews-section.svelte:11–12 | `import { fade, scale } from 'svelte/transition'` and `import { quintOut } from 'svelte/easing'` | `import { fade, scale } from '$lib/motion'` |
| product-specifications.svelte:7–8 | `import { slide } from 'svelte/transition'` and `import { prefersReducedMotion } from 'svelte/motion'` | `import { slide } from '$lib/motion'` |
| size-guide-drawer.svelte:6 | `import { fly } from 'svelte/transition'` | `import { fade } from '$lib/motion'` |

- [ ] **Step 2: Rewrite the directives.** Make each replacement exactly:

| File:line | Old | New |
| :-- | :-- | :-- |
| conversational-shopping:190 | `transition:fade={{ duration: 150 }}` | `transition:fade` |
| conversational-shopping:198 | `transition:fly={{ y: 24, duration: 200 }}` | `transition:fly={{ y: 24 }}` |
| modal:104 | `transition:fade={{ duration: 100 }}` | `transition:fade` |
| coupons-drawer:29 | `in:fly={{ duration: 300 }}` | `in:fade` |
| bottom-nav:143 | `transition:slide={{ duration: 300 }}` | `in:drawer={{ edge: 'bottom' }} out:drawer={{ edge: 'bottom' }}` |
| cart-sidebar:160 | `transition:slideInFromRight={{ duration: 220 }}` | `in:drawer={{ edge: 'right' }} out:drawer={{ edge: 'right' }}` |
| mega-menu:225 | `transition:fade={{ duration: 150 }}` | `transition:fade` |
| mega-menu:239 | `transition:fade={{ duration: 100 }}` | `transition:fade` |
| nav:314–315 | `in:fade={{ duration: 300 }}` / `out:fade={{ duration: 300 }}` | `in:fade` / `out:fade` |
| nav:322–323 | `in:fly={{ x: -320, duration: 300, easing: cubicOut }}` / `out:fly={{ x: -320, duration: 300, easing: cubicOut }}` | `in:drawer={{ edge: 'left' }}` / `out:drawer={{ edge: 'left' }}` |
| desktop-filter:99 and :209 | `in:fly={{ x: 10, duration: 200, easing: quintOut }}` | `in:fly={{ x: 8 }}` |
| desktop-filter:120 and :230 | `in:fade={{ duration: 200, delay: 200 }}` | `in:fade` |
| contact-us:185 and :211 | `in:fade={feedbackFade}` | `in:fade` |
| (my)/+layout:148–149 | `in:fade={{ duration: 200 }}` / `out:fade={{ duration: 200 }}` | `in:fade` / `out:fade` |
| (my)/+layout:155–156 | `in:fly={{ x: -320, duration: 200, easing: cubicOut }}` / `out:fly={{ x: -320, duration: 200, easing: cubicOut }}` | `in:drawer={{ edge: 'left' }}` / `out:drawer={{ edge: 'left' }}` |
| addresses:66, orders:131, wishlist:68 | `in:fly={{ y: 20, duration: 400, delay: i * 50 }}` | `in:fly={{ y: 12, delay: Math.min(i, 5) * 40 }}` |
| profile:17 | `in:fly={{ y: 20, duration: 600 }}` | `in:fly={{ y: 12 }}` |
| profile:106 | `in:fly={{ y: 50, duration: 400 }} out:fade={{ duration: 200 }}` | `in:fly={{ y: 24 }} out:fade` |
| (www)/+page:222 | `transition:fly={{ x: 50, duration: 150 }}` | `transition:fly={{ x: 24 }}` |
| checkout/success:107 | `in:fly={{ y: 20, duration: 600 }}` | `in:fly={{ y: 12 }}` |
| product-cart-and-wishlist-buttons:101 | `transition:fly={{ x: 50, duration: 300, easing: quintOut }}` | `in:fly={{ x: 24 }} out:fade` |
| product-description:51 | `transition:slide={{ duration: panelMs }}` | `transition:slide` |
| product-specifications:75 | `transition:slide={{ duration: panelMs }}` | `transition:slide` |
| product-details:396 | `transition:fly={{ y: 24, duration: prefersReducedMotion.current ? 0 : 180 }}` | `transition:fly={{ y: 24 }}` |
| product-reviews-section:247 | `in:fade={{ duration: 150 }}` | `in:fade` |
| product-reviews-section:313 | `transition:fade={{ duration: 200 }}` | `transition:fade` |
| product-reviews-section:316 | `transition:scale={{ start: 0.95, duration: 300, easing: quintOut }}` | `transition:scale={{ start: 0.96 }}` |
| product-reviews-section:358 | `in:scale={{ start: 0.9, duration: 200 }}` | `in:scale={{ start: 0.9 }}` |
| size-guide-drawer:56 | `in:fly={{ duration: 300 }}` | `in:fade` |

- [ ] **Step 3: Delete the local reduced-motion workarounds the module now owns.**
  - `cart-sidebar.svelte`: delete the comment block and `function slideInFromRight(...) { ... }` (lines 91–102). Then fade the backdrop. It is a `<Button>` component, and transition directives only work on elements, so wrap the whole `<Button variant="ghost" class="fixed inset-0 z-overlay …" aria-label="Close cart" onclick={closeCart}> … </Button>` block (lines 141–152) in `<div transition:fade>` … `</div>`. The wrapper is static, so the fixed button still covers the viewport, and the wrapper's opacity fades it.
  - `contact-us/+page.svelte`: delete lines 27–28 (`const reducedMotion = …` and `const feedbackFade = …`).
  - `product-description.svelte:23` and `product-specifications.svelte:18`: delete `const panelMs = $derived(prefersReducedMotion.current ? 0 : 200)`.
  - `mega-menu.svelte:136-139`: give the panel `<div class="ed-mm-panel mega-menu …">` a fast 4px drop by adding `transition:fly={{ y: -4, duration: motionMs('fast') }}` to that element.

- [ ] **Step 4: Prove nothing in scope still bypasses the module.**

```bash
grep -rn "from 'svelte/transition'" src --include=*.svelte | grep -v "src/lib/core/\|theme/\(wine\|organic\|lime\|noor\)"
grep -rnE "(transition|in|out):(fade|fly|slide|scale|drawer)=\{\{[^}]*duration: [0-9]" src --include=*.svelte | grep -v "src/lib/core/\|theme/\(wine\|organic\|lime\|noor\)"
grep -rn "prefers-reduced-motion: reduce)').matches" src --include=*.svelte | grep -v "src/lib/core/"
```

Expected:
- The first two print nothing.
- The third prints only `src/lib/theme/default/DefaultHomepage.svelte:171`. That one stops hero autoplay, which is a behaviour rather than a transition, so it stays.

- [ ] **Step 5: Type-check and run the motion tests**

```bash
bunx prettier --write $(git diff --name-only)
bunx svelte-check --tsconfig ./tsconfig.json --output machine | grep -E "COMPLETED"
bunx vitest run tests/motion.test.ts
```

Expected: COMPLETED at or below 90 errors, and motion tests PASS.

- [ ] **Step 6: Commit**

```bash
git add -A src
git commit -m "refactor(motion): every in-scope transition goes through \$lib/motion

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Route transitions and the product morph

**Files:**
- Create: `src/lib/motion/route-transition.ts`
- Test: `tests/route-transition.test.ts`
- Modify: `src/routes/+layout.svelte:10`, plus one line after `setUserState()`
- Modify: `src/app.css` (append after the editorial-button block, before `Reduced motion`)
- Modify (markers):
  - `src/lib/components/nav/nav.svelte:128-132`
  - `src/lib/components/common/footer.svelte:120`
  - `src/lib/components/nav/bottom-nav.svelte:98`
  - `src/lib/theme/default/DefaultProductCard.svelte:106`
  - `src/lib/components/product-catalogue/product-card.svelte:95`
  - `src/routes/(www)/products/[slug]/components/product-gallery.svelte:191`

**Interfaces:**
- Consumes: `isReducedMotion()` from Task 1.
- Produces:
  - `startRouteTransition(nav: RouteNavigation, doc?: Document): Promise<void> | undefined`
  - `shouldTransition(nav, doc?): boolean`
  - `productSlugOf(pathname?: string): string | null`
  - `MORPH_ATTR = 'data-vt-morph'`
  - DOM contract: `data-vt-product-media="<slug>"` and `data-vt-gallery-primary`.

- [ ] **Step 1: Write the failing test** — create `tests/route-transition.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { startRouteTransition, shouldTransition, productSlugOf } from '$lib/motion/route-transition'

type Call = { named: string[]; finish: () => void; done: Promise<unknown> }

let calls: Call[]

const named = () => [...document.querySelectorAll('[data-vt-morph]')].map((el) => el.id)
const flush = () => new Promise((r) => setTimeout(r, 0))

function installViewTransitions() {
	calls = []
	document.startViewTransition = ((update: () => Promise<void>) => {
		const call = { named: named() } as Call
		const finished = new Promise<void>((resolve) => (call.finish = resolve))
		call.done = Promise.resolve().then(update)
		calls.push(call)
		return { finished: call.done.then(() => finished), ready: call.done, updateCallbackDone: call.done, skipTransition() {} }
	}) as unknown as Document['startViewTransition']
}

const reduce = (on: boolean) =>
	vi.stubGlobal('matchMedia', (query: string) => ({ matches: on && query.includes('reduce'), media: query, addListener() {}, removeListener() {} }))

/** jsdom lays nothing out; give an element a box at `top`. */
function place(el: Element | null, top: number) {
	if (!el) throw new Error('missing element')
	el.getBoundingClientRect = () => ({ top, bottom: top + 100, left: 0, right: 100, width: 100, height: 100, x: 0, y: top, toJSON() {} })
}

/** A navigation whose DOM swap happens when `complete` settles, as SvelteKit's does. */
function navigation(from: string | null, to: string | null, nextHtml?: string, opts: { type?: string; fail?: boolean } = {}) {
	const complete = new Promise<void>((resolve, reject) =>
		setTimeout(() => {
			if (nextHtml !== undefined) document.body.innerHTML = nextHtml
			for (const el of document.querySelectorAll('[data-place]')) place(el, Number((el as HTMLElement).dataset.place))
			if (opts.fail) reject(new Error('navigation aborted'))
			else resolve()
		})
	)
	return {
		type: opts.type ?? 'link',
		from: from ? { url: new URL(from, 'https://shop.test') } : null,
		to: to ? { url: new URL(to, 'https://shop.test') } : null,
		complete
	}
}

const LISTING = `
	<div id="card-a" data-vt-product-media="ring-a" data-place="100"></div>
	<div id="card-b" data-vt-product-media="ring-b" data-place="300"></div>`
const PDP = (related = '') => `<div id="gallery" data-vt-gallery-primary data-place="80"></div>${related}`

function render(html: string) {
	document.body.innerHTML = html
	for (const el of document.querySelectorAll('[data-place]')) place(el, Number((el as HTMLElement).dataset.place))
}

beforeEach(() => {
	installViewTransitions()
	reduce(false)
})

afterEach(() => {
	vi.unstubAllGlobals()
	// @ts-expect-error jsdom has no view transitions; the test installs and removes them
	delete document.startViewTransition
	document.body.innerHTML = ''
})

describe('shouldTransition', () => {
	it('skips browsers without view transitions', () => {
		// @ts-expect-error see afterEach
		delete document.startViewTransition
		expect(shouldTransition(navigation('/products', '/products/ring-a'))).toBe(false)
	})

	it('skips enter, leave and query- or hash-only changes', () => {
		expect(shouldTransition(navigation('/products', '/products/ring-a', undefined, { type: 'enter' }))).toBe(false)
		expect(shouldTransition(navigation('/products?sort=price', '/products?sort=new'))).toBe(false)
		expect(shouldTransition(navigation('/products/ring-a?variant_id=v1', '/products/ring-a?variant_id=v2'))).toBe(false)
		expect(shouldTransition(navigation('/products/ring-a', '/products/ring-a#reviews'))).toBe(false)
	})

	it('runs for a change of page', () => {
		expect(shouldTransition(navigation('/', '/products'))).toBe(true)
	})
})

describe('productSlugOf', () => {
	it('reads product pages only, decoded', () => {
		expect(productSlugOf('/products/ring-a')).toBe('ring-a')
		expect(productSlugOf('/products/bague-%C3%A9toile/')).toBe('bague-étoile')
		expect(productSlugOf('/products')).toBeNull()
		expect(productSlugOf('/categories/rings')).toBeNull()
	})
})

describe('startRouteTransition', () => {
	it('resolves before the DOM update, so SvelteKit can proceed', async () => {
		render(LISTING)
		const nav = navigation('/products', '/products/ring-a', PDP())
		await expect(startRouteTransition(nav)).resolves.toBeUndefined()
		await calls[0].done
	})

	it('morphs the clicked card into the gallery, then clears the names', async () => {
		render(LISTING)
		startRouteTransition(navigation('/products', '/products/ring-a', PDP()))
		await calls[0].done
		expect(calls[0].named).toEqual(['card-a'])
		expect(named()).toEqual(['gallery'])
		calls[0].finish()
		await flush()
		expect(named()).toEqual([])
	})

	it('morphs the gallery back into its card on return', async () => {
		render(PDP())
		startRouteTransition(navigation('/products/ring-b', '/products', LISTING))
		await calls[0].done
		expect(calls[0].named).toEqual(['gallery'])
		expect(named()).toEqual(['card-b'])
	})

	it('names only the clicked related card when one product page opens another', async () => {
		render(PDP('<div id="related-b" data-vt-product-media="ring-b" data-place="600"></div>'))
		startRouteTransition(navigation('/products/ring-a', '/products/ring-b', PDP().replace('gallery', 'gallery-b')))
		await calls[0].done
		expect(calls[0].named).toEqual(['related-b'])
		expect(named()).toEqual(['gallery-b'])
	})

	it('matches an encoded slug', async () => {
		render('<div id="card-e" data-vt-product-media="bague-étoile" data-place="100"></div>')
		startRouteTransition(navigation('/products', '/products/bague-%C3%A9toile', PDP()))
		await calls[0].done
		expect(calls[0].named).toEqual(['card-e'])
	})

	it('no visible card on return means crossfade only', async () => {
		render(PDP())
		startRouteTransition(navigation('/products/ring-a', '/products', LISTING.replace('data-place="100"', 'data-place="5000"')))
		await calls[0].done
		expect(calls.length).toBe(1)
		expect(named()).toEqual([])
	})

	it('a stale transition does not clear a newer one', async () => {
		render(LISTING)
		startRouteTransition(navigation('/products', '/products/ring-a', PDP()))
		await calls[0].done
		startRouteTransition(navigation('/products/ring-a', '/products', LISTING))
		await calls[1].done
		calls[0].finish()
		await flush()
		expect(named()).toEqual(['card-a'])
	})

	it('a failed navigation leaves nothing named and throws nothing', async () => {
		render(LISTING)
		startRouteTransition(navigation('/products', '/products/ring-a', PDP(), { fail: true }))
		await calls[0].done
		calls[0].finish()
		await flush()
		expect(named()).toEqual([])
	})

	it('under reduced motion crossfades without naming anything', async () => {
		reduce(true)
		render(LISTING)
		startRouteTransition(navigation('/products', '/products/ring-a', PDP()))
		await calls[0].done
		expect(calls[0].named).toEqual([])
		expect(named()).toEqual([])
	})
})
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `bunx vitest run tests/route-transition.test.ts`
Expected: FAIL. `Failed to resolve import "$lib/motion/route-transition"`.

- [ ] **Step 3: Write the module.** Create `src/lib/motion/route-transition.ts`:

```ts
import { isReducedMotion } from './index'

// Wraps a SvelteKit navigation in a view transition: every page change crossfades, and opening a
// product morphs the card image into the product-page gallery (and back). See
// docs/superpowers/specs/2026-10-01-motion-layer-design.md §3.
//
// The morph name is set only here, never in markup: a duplicate `view-transition-name` aborts the
// whole transition, and a product page can hold its own gallery and a related card at once.
// app.css maps the attribute to the name: `[data-vt-morph] { view-transition-name: product-media }`.

export const MORPH_ATTR = 'data-vt-morph'

/** The part of SvelteKit's OnNavigate this needs; `type` stays a string so tests can pass 'enter'. */
export type RouteNavigation = {
	type: string
	from: { url: URL } | null
	to: { url: URL } | null
	complete: Promise<void>
}

const PRODUCT_PATH = /^\/products\/([^/]+)\/?$/

export function productSlugOf(pathname?: string): string | null {
	const match = pathname ? PRODUCT_PATH.exec(pathname) : null
	return match ? decodeURIComponent(match[1]) : null
}

export function shouldTransition(nav: RouteNavigation, doc: Document = document): boolean {
	if (typeof doc.startViewTransition !== 'function') return false
	if (nav.type === 'enter' || nav.type === 'leave') return false
	if (!nav.from || !nav.to) return false
	// Query and hash changes (filters, sort, pagination, ?variant_id, #reviews) keep their own
	// in-place busy states; a whole-page crossfade would fight them.
	return nav.from.url.pathname !== nav.to.url.pathname
}

function clearMorph(doc: Document) {
	for (const el of doc.querySelectorAll(`[${MORPH_ATTR}]`)) el.removeAttribute(MORPH_ATTR)
}

function mark(el: Element | null): boolean {
	if (!el) return false
	el.setAttribute(MORPH_ATTR, '')
	return true
}

function onScreen(el: Element, win: Window | null): boolean {
	const box = el.getBoundingClientRect()
	return box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < (win?.innerHeight ?? Infinity)
}

function cardFor(slug: string, doc: Document): Element | null {
	for (const el of doc.querySelectorAll('[data-vt-product-media]')) {
		if ((el as HTMLElement).dataset.vtProductMedia === slug && onScreen(el, doc.defaultView)) return el
	}
	return null
}

const galleryOf = (doc: Document) => doc.querySelector('[data-vt-gallery-primary]')

// Starting a transition skips the running one, whose `finished` then settles late. Only the newest
// transition may clear names, or the old one strips the morph from the new one mid-flight.
let generation = 0

export function startRouteTransition(nav: RouteNavigation, doc: Document = document): Promise<void> | undefined {
	if (!shouldTransition(nav, doc)) return

	const mine = ++generation
	const toSlug = productSlugOf(nav.to?.url.pathname)
	const fromSlug = productSlugOf(nav.from?.url.pathname)
	const morph = !isReducedMotion()

	clearMorph(doc)
	const hasSource = morph && (toSlug ? mark(cardFor(toSlug, doc)) : fromSlug ? mark(galleryOf(doc)) : false)

	return new Promise((resolve) => {
		const transition = doc.startViewTransition!(async () => {
			resolve()
			// A failed or cancelled navigation still has to let the transition finish cleanly.
			await nav.complete.catch(() => {})
			clearMorph(doc)
			if (hasSource) mark(toSlug ? galleryOf(doc) : fromSlug ? cardFor(fromSlug, doc) : null)
		})
		const cleanUp = () => {
			if (mine === generation) clearMorph(doc)
		}
		transition.ready.catch(() => {})
		transition.finished.then(cleanUp, cleanUp)
	})
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `bunx vitest run tests/route-transition.test.ts`
Expected: PASS, 13 tests.

- [ ] **Step 5: Wire the hook.**
  - In `src/routes/+layout.svelte` line 10, change `import { afterNavigate, beforeNavigate } from '$app/navigation'` to `import { afterNavigate, beforeNavigate, onNavigate } from '$app/navigation'`.
  - Add `import { startRouteTransition } from '$lib/motion/route-transition'` after the last import.
  - Directly after `setUserState()`, add:

```ts
	// Every page change crossfades; opening a product morphs its image. See route-transition.ts.
	onNavigate((navigation) => startRouteTransition(navigation))
```

- [ ] **Step 6: The transition CSS.** In `src/app.css`, insert before the `/* ---- Reduced motion` comment block:

```css
/* ------------------------------------------------------------------ *
 * Route transitions — src/lib/motion/route-transition.ts
 *
 * The page crossfades; the header, footer and bottom nav hold still because they carry names of
 * their own; the clicked product image morphs into the gallery through `product-media`.
 * ------------------------------------------------------------------ */
::view-transition-old(root) {
	animation-duration: var(--motion-exit);
	animation-timing-function: var(--motion-ease-exit);
}
::view-transition-new(root) {
	animation-duration: var(--motion-panel);
	animation-timing-function: var(--motion-ease);
}
::view-transition-group(product-media) {
	animation-duration: var(--motion-emphasis);
	animation-timing-function: var(--motion-ease);
}
[data-vt-morph] {
	view-transition-name: product-media;
}
.vt-site-header {
	view-transition-name: site-header;
}
.vt-site-footer {
	view-transition-name: site-footer;
}
.vt-bottom-nav {
	view-transition-name: bottom-nav;
}
```

- [ ] **Step 7: The markers.** Make each edit exactly:
  - `nav.svelte:132`: in the `<header>` class string, `sticky top-0 z-50 w-full` → `vt-site-header sticky top-0 z-50 w-full`.
  - `footer.svelte:120`: `<footer class:ed={activeThemeName === 'default'} aria-label="Site footer"` → `<footer class="vt-site-footer" class:ed={activeThemeName === 'default'} aria-label="Site footer"`.
  - `bottom-nav.svelte:98`: `cn('pb-safe fixed bottom-0` → `cn('vt-bottom-nav pb-safe fixed bottom-0`.
  - `DefaultProductCard.svelte:106`: `<div class="dpc__frame" use:trackImage` → `<div class="dpc__frame" data-vt-product-media={product.slug} use:trackImage`.
  - `product-card.svelte:95`: `<div onloadcapture={() => (imageFailed = false)}` → `<div data-vt-product-media={product.slug} onloadcapture={() => (imageFailed = false)}`.
  - `product-gallery.svelte:191-192`: on the slide wrapper `<div` whose next line is `class="sm:mb-5 sm:cursor-pointer"`, add `data-vt-gallery-primary={index === 0 ? '' : undefined}` as the first attribute.

- [ ] **Step 8: Check in the browser that the names change nothing at rest.**
  - Build, start the server, and open `http://127.0.0.1:3100/products` at 1280px and at 390px.
  - Open the cart drawer: it must cover the full viewport height, with its backdrop over the whole page.
  - At 390px, open the menu drawer: same.
  - At 1280px, hover a category with children: the mega-menu panel drops below the header.
  - Click a card and press Back. The page crossfades and the image morphs both ways (Chrome's reduced-motion emulation off).

- [ ] **Step 9: Type-check and run both test files**

```bash
bunx prettier --write src/lib/motion/route-transition.ts tests/route-transition.test.ts src/routes/+layout.svelte
bunx svelte-check --tsconfig ./tsconfig.json --output machine | grep -E "route-transition|COMPLETED"
bunx vitest run tests/motion.test.ts tests/route-transition.test.ts
```

Expected: no route-transition lines, COMPLETED at or below 90, and both files PASS.

- [ ] **Step 10: Commit**

```bash
git add -A src tests
git commit -m "feat(motion): route crossfade and card-to-gallery morph via view transitions

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Overlays and the global reduced-motion block

**Files:**
- Modify: `src/lib/components/ui/dialog/dialog-content.svelte:23`
- Modify: `src/lib/components/ui/sheet/sheet-content.svelte:5`
- Modify: `src/app.css` (`.ed-btn-base` transition at :463-475, reduced-motion block at :519-560)

**Interfaces:**
- Consumes: the Tailwind duration and ease utilities (Task 1) and the route-transition names (Task 3).

- [ ] **Step 1: Dialog.** In `dialog-content.svelte:23`, replace ` shadow-lg duration-200 data-[state=open]:animate-in` with ` shadow-lg data-[state=open]:duration-panel data-[state=closed]:duration-exit data-[state=closed]:ease-exit data-[state=open]:ease-standard data-[state=open]:animate-in`.

- [ ] **Step 2: Sheet.** In `sheet-content.svelte:5`, replace `shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500` with `shadow-lg data-[state=open]:duration-panel data-[state=open]:ease-standard data-[state=closed]:duration-exit data-[state=closed]:ease-exit`.

  Popover, select, tooltip and dropdown keep tailwindcss-animate's default of 150ms, which is `--motion-fast`. Leave them.

- [ ] **Step 3: Editorial buttons on tokens, with press feedback.** In `src/app.css`, replace the `transition:` declaration inside `[data-theme='default'] .ed-btn-base { … }`:

```css
	transition:
		transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
		background-color 0.25s ease,
		color 0.25s ease,
		border-color 0.25s ease,
		opacity 0.25s ease;
```

with:

```css
	transition:
		transform var(--motion-fast) var(--motion-ease),
		background-color var(--motion-fast) var(--motion-ease),
		color var(--motion-fast) var(--motion-ease),
		border-color var(--motion-fast) var(--motion-ease),
		opacity var(--motion-fast) var(--motion-ease);
```

Then, after the `[data-theme='default'] .ed-btn-base.w-9 { … }` rule, add:

```css
/* Press: every editorial button gives under the finger; icon-only ones a little more. (0,4,0) and
   (0,5,0), so they outrank the (0,3,0) hover lift while held. */
[data-theme='default'] .ed-btn-base:active:not(:disabled) {
	transform: scale(0.97);
}
[data-theme='default'] .ed-btn-base.w-9:active:not(:disabled) {
	transform: scale(0.92);
}
```

- [ ] **Step 4: Rewrite the reduced-motion block.** Replace everything from `@media (prefers-reduced-motion: reduce) {` through its closing `}` (app.css :519-560) with the block below. Keep the long comment above it, but change its last paragraph to: `Overlays keep their full duration as pure fades; movement goes, feedback stays.`

```css
@media (prefers-reduced-motion: reduce) {
	/* Buttons keep their colour and opacity feedback; only the lift and the press go. */
	html [data-theme='default'] .ed-btn-base,
	html .ed-btn-base {
		transition-property: background-color, color, border-color, opacity;
	}
	html [data-theme='default'] .ed-btn-base:hover,
	html [data-theme='default'] .ed-btn-base:active,
	html .ed-btn-base:hover,
	html .ed-btn-base:active {
		transform: none;
	}

	/* Purely decorative loops. */
	html .animate-ping,
	html .animate-bounce {
		animation: none !important;
	}

	/* Kept, but slowed out of the vestibular range. */
	html .animate-spin {
		animation-duration: 1.6s !important;
		animation-timing-function: linear !important;
	}
	html .animate-pulse {
		animation-duration: 3s !important;
	}

	/* Overlays (tailwindcss-animate: dialog, sheet, popover, dropdown, select, tooltip) keep their
	   duration and lose their zoom and slide. The plugin builds its enter/exit keyframes from these
	   variables, so neutralising them turns every overlay into a pure fade. !important because the
	   `data-[state=open]:zoom-in-95` utilities sit at (0,2,0). */
	html .animate-in,
	html .animate-out {
		--tw-enter-scale: 1 !important;
		--tw-enter-rotate: 0 !important;
		--tw-enter-translate-x: 0 !important;
		--tw-enter-translate-y: 0 !important;
		--tw-exit-scale: 1 !important;
		--tw-exit-rotate: 0 !important;
		--tw-exit-translate-x: 0 !important;
		--tw-exit-translate-y: 0 !important;
	}

	/* Route transitions: the crossfade stays (opacity), nothing travels or resizes. */
	::view-transition-group(*) {
		animation: none !important;
	}

	/* Editorial hero entrance. */
	html .ed-hero__body > *,
	html .ed-hero__media {
		animation: none !important;
		opacity: 1 !important;
		transform: none !important;
	}

	html {
		scroll-behavior: auto;
	}
}
```

- [ ] **Step 5: Build and confirm the generated CSS**

```bash
BUILD_TIME="$(date -u +'%Y-%m-%d %H:%M:%S')" bun run build > /dev/null 2>&1; echo "build exit $?"
CSS=$(ls .svelte-kit/output/client/_app/immutable/assets/*.css | xargs grep -l "motion-panel" | head -1)
for needle in "duration-emphasis" "duration-exit" "ease-exit" "view-transition-name:product-media" "--tw-enter-scale:1!important" "view-transition-group(\*)"; do printf "%-40s %s\n" "$needle" "$(grep -c -- "$needle" "$CSS")"; done
grep -c "animation-duration:var(--motion-panel)" "$CSS"
```

Expected:
- `build exit 0`.
- Every needle count is 1 or more.
- The last count is 1 or more. That proves tailwindcss-animate picked up the panel token as an animation duration.

- [ ] **Step 6: Commit**

```bash
git add src/app.css src/lib/components/ui/dialog/dialog-content.svelte src/lib/components/ui/sheet/sheet-content.svelte
git commit -m "feat(motion): overlays on tokens; reduced motion fades instead of snapping

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: The header bar scrolls away; no animated heights

**Files:**
- Modify: `src/lib/components/nav/nav.svelte` (script near :35, markup :128-189)

**Why:** Today the header animates `grid-template-rows` and `height` while the page scrolls. That
is a layout animation on the scroll path, and the cause of the scroll-anchoring oscillation the
hysteresis comment at :30 works around.

A `transform` on the header is **not** the fix. It would make the header the containing block for
the `fixed` cart drawer, menu drawer and backdrops rendered inside it, and they would shift and
clip.

The fix: the sticky header's `top` becomes minus the bar's height. The bar then scrolls away with
the page and the rest of the header sticks. That movement is ordinary compositor scrolling, with
nothing animated.

- [ ] **Step 1: Measure the bar.** In the script, after `let isScrolled = $state(false)`, add:

```ts
	// Height of the announcement or hello bar, if one renders. The sticky header sits this far above
	// the viewport, so the bar scrolls away with the page and the rest of the header sticks:
	// ordinary scrolling, with no animated height and no transform to trap the fixed drawers inside.
	let barHeight = $state(0)
```

- [ ] **Step 2: Offset the header.** On the `<header>` (:128-132):
  - Delete ` transition-all duration-200` from its class string. Nothing on it transitions any more.
  - Add this attribute to the element:

```svelte
		style:top={barHeight ? `-${barHeight}px` : undefined}
```

- [ ] **Step 3: Unwrap the bars.**
  - Wrap the two `{#if … isHomepage}` bar blocks (the announcement block starting :136 and the hello-bar block starting :154) together in `<div bind:clientHeight={barHeight}>` … `</div>`.
  - Inside each block, replace the two wrapper lines and their closers:
    - `<div class="grid transition-[grid-template-rows] duration-300 ease-in-out {isScrolled ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}">` and its `</div>`
    - `<div class="overflow-hidden">` and its `</div>`
  - Keep the bar content inside them. Delete the comment `<!-- Grid-rows 1fr→0fr collapse animates to zero without a magic max-height. -->`.

- [ ] **Step 4: One row height.** At :184-189, replace the comment `<!-- Fixed heights stand in for vertical padding here, so the scroll slimming transitions height instead. -->` with:

```svelte
		<!-- One fixed height: the row no longer slims on scroll, because animating height re-lays-out
		     the page on every scroll frame. -->
```

  …and the class fragment `transition-[height] duration-300 ease-in-out {isScrolled ? 'h-12' : 'h-16 sm:h-14'}` with `h-14`.

- [ ] **Step 5: Remove what no longer has a reader.**
  - Run `grep -n "isScrolled" src/lib/components/nav/nav.svelte`.
  - If the only hits are its declaration and the `$effect` that sets it, delete both, along with the hysteresis comment above the declaration (:30-34).
  - If anything else reads it, leave all three.

- [ ] **Step 6: Check it in the browser.**
  - Build, start the server, and open `http://127.0.0.1:3100/` at 1280px and at 390px in Chrome.
  - Scroll down 200px. The bar has scrolled off, the logo row is pinned at the top, and nothing jumped.
  - Open the cart drawer while scrolled: it covers the full viewport, with its backdrop over the whole page.
  - At 390px, open the menu drawer while scrolled: same.
  - Check this in the console:

```js
const h = document.querySelector('.vt-site-header'); [h.style.top, h.getBoundingClientRect().top]
// at scrollY 200: ['-<bar>px', -<bar>]; on a page without a bar: ['', 0]
```

- [ ] **Step 7: Commit**

```bash
bunx prettier --write src/lib/components/nav/nav.svelte
git add src/lib/components/nav/nav.svelte
git commit -m "perf(nav): let the announcement bar scroll away instead of animating row heights

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Sweep raw durations, in classes and in `<style>` blocks

**Files:** each file named in the tables below.

**Rules:**
- Feedback (colour, small icon moves, press) → `duration-fast`.
- Rotations and panels → `duration-panel`.
- Image hover zooms → `duration-emphasis`.
- `transition-all` becomes the specific properties that change.
- A transition on an element whose properties never change is deleted.
- A width or height animation becomes a transform, or a colour-only transition with the size snapping.
- `ease-out-expo` is not a configured utility and does nothing; delete it.

- [ ] **Step 1: Tailwind classes.** Make each replacement exactly. Line numbers are from 2026-10-01 and shift slightly after Tasks 2–5; match on the old text.

| File:line | Old | New |
| :-- | :-- | :-- |
| buttons/checkout-button:58 | `transition-transform duration-300` | `transition-transform duration-fast ease-standard` |
| collection/display-collections:23 | `transition-transform duration-300` | `transition-transform duration-emphasis ease-standard` |
| collection/display-collections:38 | `transition-colors duration-300` | `transition-colors duration-fast` |
| common/footer:131 | `transition-transform duration-300` | `transition-transform duration-panel ease-standard` |
| home/banners:37 | `transition-opacity duration-500` | `transition-colors duration-fast` |
| home/banners:39 | `transition-all duration-500` | `transition-[transform,opacity] duration-panel ease-standard` |
| home/homepage-banners:46 | `transition-all duration-500` | `transition-shadow duration-panel` |
| home/homepage-banners:56 | `transition-opacity duration-500` | `transition-opacity duration-panel` |
| home/homepage-category-list-with-image:51 | ` transition-all duration-500 ease-out` | *(delete)* |
| home/homepage-category-list-with-image:56 | `transition-transform duration-700 ease-in-out` | `transition-transform duration-emphasis ease-standard` |
| home/homepage-category-list-with-image:60 | `transition-colors duration-300` | `transition-colors duration-fast` |
| image/image-overlay:21 | `transition-colors duration-300` | `transition-colors duration-fast` |
| nav/bottom-nav:156 | `transition-all duration-300` | `transition-colors duration-fast` |
| nav/bottom-nav:198 | `transition-colors duration-300` | `transition-colors duration-fast` |
| nav/mega-menu:111 | `transition-all duration-300` | `transition-[color,transform] duration-fast ease-standard` |
| nav/mega-menu:124 | `ease-out-expo h-3.5 w-3.5 shrink-0 transition-transform duration-300` | `h-3.5 w-3.5 shrink-0 transition-transform duration-panel ease-standard` |
| nav/mega-menu:138 | `mega-menu ease-out-expo absolute` and ` transition-all duration-500` | `mega-menu absolute` and *(delete)* |
| nav/nav:440 | `transition-transform duration-300` | `transition-transform duration-panel ease-standard` |
| page-blocks/blocks/banner-block:92 | `transition-all duration-300` | `transition-colors duration-fast` |
| page-blocks/blocks/featured-categories:61 | ` transition-all duration-500 ease-out` | *(delete)* |
| page-blocks/blocks/featured-categories:66 | `transition-transform duration-700 ease-in-out` | `transition-transform duration-emphasis ease-standard` |
| page-blocks/blocks/featured-categories:70 | `transition-colors duration-300` | `transition-colors duration-fast` |
| product-catalogue/product-card:86 | `transition-all duration-300` | `transition-[transform,opacity,box-shadow] duration-fast` |
| product-catalogue/product-card:100 | `transition-transform duration-500` | `transition-transform duration-emphasis` |
| vendor/vendor-card:24 | `transition-transform duration-300` | `transition-transform duration-emphasis ease-standard` |
| (my)/my/addresses:67 | `transition-all duration-300 ` | `transition-[border-color,box-shadow] duration-fast` |
| (my)/my/buy-again:67 and :136 | `duration-300` and `laptop:transition-all` | `duration-fast` and `laptop:transition-[transform,opacity]` |
| (my)/my/orders:194 | `transition-transform duration-500` | `transition-transform duration-emphasis` |
| (my)/my/wishlist:69 | `transition-all duration-300` | `transition-[transform,box-shadow] duration-fast` |
| (my)/my/wishlist:79 | `transition-transform duration-500` | `transition-transform duration-emphasis` |
| (www)/categories:30, (www)/collections:44 | `transition-transform duration-300` | `transition-transform duration-emphasis ease-standard` |
| checkout/address:259, :270, :344, :419, :441 | ` transition-all duration-500` | *(delete)* |
| checkout/address:400 | ` transition-all duration-300` | *(delete)* |
| checkout/payment/payment:190 | `transition-all duration-300` | `transition-[transform,border-color,background-color] duration-fast ease-standard` |
| checkout/payment/payment:262 | `transition-transform duration-300` | `transition-transform duration-panel ease-standard` |
| checkout/payment/review:35 | `transition-transform duration-300` | `transition-transform duration-fast ease-standard` |
| checkout/success:143 | ` transition-all duration-1000` | *(delete)* |
| checkout/success:149 | `transition-colors duration-500` | `transition-colors duration-panel` |
| checkout/success:199, :202 | ` transition-all duration-300` | *(delete)* |
| (www)/messages:39, :82, :202, :287 | `transition duration-300` | `transition-colors duration-fast` |
| products/[slug]/components/product-gallery:245 | `transition-all duration-300` | `transition-colors duration-fast` |
| products/[slug]/components/product-reviews-section:163, :217 | `duration-500` | `duration-emphasis` |

  Mega-menu `:113` is rewritten in Task 7, so leave it here.

- [ ] **Step 2: The review bars stop animating width.** In `product-reviews-section.svelte:143`, replace:

```svelte
<div class="absolute inset-y-0 left-0 bg-primary transition-all duration-700 ease-out" style="width: {row.pct}%"></div>
```

with:

```svelte
<div class="absolute inset-y-0 left-0 w-full origin-left bg-primary transition-transform duration-emphasis ease-standard" style="transform: scaleX({row.pct / 100})"></div>
```

- [ ] **Step 3: Hard-coded durations in `<style>` blocks.** Run this from the repo root. It rewrites only the 11 listed files (app.css was done in Task 4), and only `<duration> <curve>` pairs:

```bash
while IFS= read -r f; do
  sed -i -E \
    -e 's/0\.6s cubic-bezier\(0\.16, 1, 0\.3, 1\)/var(--motion-emphasis) var(--motion-ease)/g' \
    -e 's/0?\.(15|2|25|3|35)s cubic-bezier\(0\.16, 1, 0\.3, 1\)/var(--motion-fast) var(--motion-ease)/g' \
    -e 's/0?\.(15|2|25|3|35)s ease([,;])/var(--motion-fast) var(--motion-ease)\2/g' "$f"
done <<'LIST'
src/lib/components/common/newsletter.svelte
src/lib/components/nav/main-nav.svelte
src/lib/components/nav/nav.svelte
src/lib/components/nav/profile-dropdown.svelte
src/lib/components/product-catalogue/desktop-filter.svelte
src/lib/components/product-catalogue/listing-grid.svelte
src/lib/components/product-catalogue/listing-header.svelte
src/lib/theme/default/DefaultHomepage.svelte
src/lib/theme/default/DefaultProductCard.svelte
src/routes/(www)/products/[slug]/components/product-aggregation.svelte
src/routes/(www)/products/[slug]/components/product-cart-and-wishlist-buttons.svelte
LIST
```

  The dot indicator in `DefaultHomepage.svelte` (:838-840) animates `width`. Edit it by hand. Replace:

```css
		transition:
			width 0.35s cubic-bezier(0.16, 1, 0.3, 1),
			background 0.35s ease;
```

  (after the sed it reads `width var(--motion-fast) var(--motion-ease),` / `background var(--motion-fast) var(--motion-ease);`) with:

```css
		/* The active dot widens instantly; only its colour fades. Width is layout. */
		transition: background var(--motion-fast) var(--motion-ease);
```

- [ ] **Step 4: Align the component reduced-motion blocks** (spec §5).
  - **Delete** each of these `@media (prefers-reduced-motion: reduce) { … }` blocks entirely. They cancel colour-only transitions, which must stay.
    - `main-nav.svelte` (`.ed-nav-link`)
    - `nav.svelte` (`.ed-action`, `.ed-drawer-link`, `.ed-contact`)
    - `profile-dropdown.svelte` (`.ed-pd-trigger`)
    - `desktop-filter.svelte` (`.ed-df__cat`, `.ed-df__opt`)
    - `listing-grid.svelte` (`.ed-pagination`)
    - `listing-header.svelte` (`.ed-lh__select`)
    - `mobile-filter.svelte` (`.ed-mf__apply`)
    - `product-variation.svelte` (`.edp-pill`)
  - **Rewrite** `newsletter.svelte`'s block, whose button also lifts:

```css
	@media (prefers-reduced-motion: reduce) {
		:global([data-theme='default']) .ed-sub-btn {
			transition-property: background-color, color, border-color, opacity;
		}
		:global([data-theme='default']) .ed-sub-btn:hover {
			transform: none;
		}
	}
```

  - **Rewrite** the `transition: none` rule in `DefaultHomepage.svelte`'s block (selectors `.ed-cat__media img` … `.ed-link :global(.ed-link__icon)`):

```css
		.ed-cat__media img,
		.ed-cat__placeholder,
		.ed-band__media img,
		.ed-slider__arrow,
		.ed-btn,
		.ed-news__form button,
		.ed-link :global(.ed-link__icon) {
			transition-property: background-color, color, border-color, opacity, box-shadow;
		}
		.ed-cat:hover .ed-cat__placeholder,
		a.ed-band__item:hover .ed-band__media img,
		.ed-btn:hover,
		.ed-news__form button:hover,
		.ed-link:hover :global(.ed-link__icon),
		.ed-cat__media:hover img {
			transform: none;
		}
```

  - **Leave** the reduced-motion blocks in `DefaultProductCard.svelte` and `product-cart-and-wishlist-buttons.svelte` alone. Task 7 rewrites them.

- [ ] **Step 5: Prove the sweep is complete**

```bash
grep -rnE "duration-(300|500|700|1000)" src --include=*.svelte | grep -v "src/lib/core/\|theme/\(wine\|organic\|lime\|noor\)\|input-otp-slot"
grep -rnE "(transform|opacity|color|background|border-color|width|box-shadow) +(0?\.[0-9]+s|[0-9]+ms)" src --include=*.svelte | grep -v "src/lib/core/\|theme/\(wine\|organic\|lime\|noor\)"
grep -rnE "transition-\[(grid-template-rows|height|width)\]|ease-out-expo" src --include=*.svelte | grep -v "src/lib/core/\|theme/\(wine\|organic\|lime\|noor\)"
```

Expected:
- All three print nothing.
- `input-otp-slot`'s `duration-1000` is the caret-blink cycle, a status loop, and stays.

- [ ] **Step 6: Type-check, format, commit**

```bash
bunx prettier --write $(git diff --name-only)
bunx svelte-check --tsconfig ./tsconfig.json --output machine | grep COMPLETED
git add -A src
git commit -m "refactor(motion): sweep raw durations onto tokens; nothing animates layout

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Micro-interactions

**Files:**
- Modify: `src/app.css` (motion utilities, after the route-transition block)
- Modify: `src/lib/components/nav/main-nav.svelte:47-48`
- Modify: `src/lib/components/nav/mega-menu.svelte:106-114`
- Modify: `src/lib/components/common/footer-menu.svelte:26`
- Modify: `src/lib/components/nav/nav.svelte` (`.ed .ed-action` style)
- Modify: `src/lib/components/nav/cart-sidebar.svelte:119-136`
- Modify: `src/lib/theme/default/DefaultProductCard.svelte` (markup :139-160 and style)
- Modify: `src/routes/(www)/products/[slug]/components/product-cart-and-wishlist-buttons.svelte`
- Modify: `src/lib/components/ui/checkbox/checkbox.svelte`, `ui/radio-group/radio-group-item.svelte`, `ui/switch/switch.svelte`, `ui/form/form-field-errors.svelte`

**Interfaces:**
- Produces these CSS utilities: `.motion-press`, `.motion-underline` (`data-current="true"` keeps it drawn; `--underline-offset` overrides the default `-4px`), `.motion-pop`, `.motion-pop-in`, `.motion-bump`, `.motion-rise`.

- [ ] **Step 1: Utilities and keyframes.** In `src/app.css`, append after the route-transition block:

```css
/* ------------------------------------------------------------------ *
 * Micro-interactions — docs/superpowers/specs/2026-10-01-motion-layer-design.md §4
 * ------------------------------------------------------------------ */
@keyframes motion-pop {
	0%,
	100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.2);
	}
}
@keyframes motion-pop-in {
	from {
		opacity: 0;
		transform: scale(0.6);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}
@keyframes motion-bump {
	0%,
	100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.15);
	}
}
@keyframes motion-rise {
	from {
		opacity: 0;
		transform: translateY(2px);
	}
	to {
		opacity: 1;
		transform: none;
	}
}
@keyframes motion-fade-in {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

.motion-pop {
	animation: motion-pop var(--motion-emphasis) var(--motion-ease);
}
.motion-pop-in {
	animation: motion-pop-in var(--motion-emphasis) var(--motion-ease) both;
}
.motion-bump {
	animation: motion-bump var(--motion-panel) var(--motion-ease);
}
.motion-rise {
	animation: motion-rise var(--motion-fast) var(--motion-ease) both;
}

/* Press feedback for controls that are not a shadcn <Button>. */
.motion-press {
	transition: transform var(--motion-fast) var(--motion-ease);
}
.motion-press:active:not(:disabled) {
	transform: scale(0.92);
}

/* A hover underline that wipes in from the left. `data-current="true"` keeps it drawn. */
.motion-underline {
	position: relative;
}
.motion-underline::after {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	bottom: var(--underline-offset, -4px);
	height: 2px;
	background: hsl(var(--primary));
	transform: scaleX(0);
	transform-origin: left;
	transition:
		transform var(--motion-fast) var(--motion-ease),
		opacity var(--motion-fast) var(--motion-ease);
}
.motion-underline:hover::after,
.motion-underline:focus-visible::after,
.motion-underline[data-current='true']::after {
	transform: scaleX(1);
}

@media (prefers-reduced-motion: reduce) {
	html .motion-pop {
		animation: none;
	}
	html .motion-pop-in,
	html .motion-bump,
	html .motion-rise {
		animation-name: motion-fade-in;
	}
	html .motion-press:active:not(:disabled) {
		transform: none;
	}
	html .motion-underline::after {
		transform: scaleX(1);
		opacity: 0;
	}
	html .motion-underline:hover::after,
	html .motion-underline:focus-visible::after,
	html .motion-underline[data-current='true']::after {
		opacity: 1;
	}
}
```

- [ ] **Step 2: Underlines.**
  - **`main-nav.svelte:47-48`.** Replace the class string `ed-nav-link relative inline-flex min-h-[32px] items-center text-sm font-bold uppercase tracking-widest text-muted-foreground transition-all after:absolute after:bottom-[-4px]` + newline + `after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:text-foreground hover:after:w-full active:scale-95` with `ed-nav-link motion-underline inline-flex min-h-[32px] items-center text-sm font-bold uppercase tracking-widest text-muted-foreground transition-[color,transform] duration-fast ease-standard hover:text-foreground active:scale-95`.
  - **`mega-menu.svelte:109-113`.** Replace the class fragment `ed-mm-link relative flex` with `ed-mm-link motion-underline flex [--underline-offset:0px]`. Then replace the two lines:

```
								{selectedCategory === category.name ? 'text-primary after:scale-x-100' : 'after:scale-x-0'}
								after:ease-out-expo after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100"
```

    with:

```
								{selectedCategory === category.name ? 'text-primary' : ''}"
							data-current={selectedCategory === category.name}
```

  - **`footer-menu.svelte:26`.** Replace `inline-flex min-h-[32px] items-center text-sm text-muted-foreground transition-colors hover:text-foreground` with `motion-underline inline-flex min-h-[32px] items-center self-start text-sm text-muted-foreground transition-colors duration-fast hover:text-foreground [--underline-offset:4px]`.

- [ ] **Step 3: Header icon press.** In `nav.svelte`'s `<style>`, replace:

```css
	.ed .ed-action {
		color: var(--ed-ink);
		transition: color var(--motion-fast) var(--motion-ease);
	}
```

  with:

```css
	.ed .ed-action {
		color: var(--ed-ink);
		transition:
			color var(--motion-fast) var(--motion-ease),
			transform var(--motion-fast) var(--motion-ease);
	}

	.ed .ed-action:active {
		transform: scale(0.92);
	}

	@media (prefers-reduced-motion: reduce) {
		.ed .ed-action:active {
			transform: none;
		}
	}
```

  In `cart-sidebar.svelte:121`, add `motion-press` to the cart trigger's class: `class="motion-press flex h-9 w-9 …"`.

- [ ] **Step 4: Cart badge bump.** In `cart-sidebar.svelte`'s script, add:

```ts
	// Bumps the badge when the count changes, not when it first renders: a page load is not news.
	let bumpKey = $state(0)
	let previousQty: number | undefined
	$effect(() => {
		const qty = cartState?.cart?.qty
		if (previousQty !== undefined && qty !== previousQty) bumpKey++
		previousQty = qty
	})
```

  Replace the badge (`{#if cartState?.cart?.total && …}` block, :131-136) with:

```svelte
		{#if cartState?.cart?.total && cartState.cart?.lineItems?.length > 0}
			<!-- The outer span positions; the inner one animates, so the bump never fights the offset. -->
			<span class="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2">
				{#key bumpKey}
					<span
						class="inline-flex items-center justify-center rounded-full bg-primary px-1.5 py-1 text-xs font-bold leading-none text-primary-foreground {bumpKey
							? 'motion-bump'
							: ''}"
					>
						{cartState.cart.qty}
					</span>
				{/key}
			</span>
		{/if}
```

- [ ] **Step 5: Product card.**
  - **Markup.** In `DefaultProductCard.svelte`, replace the heart's `{#if isWishlisted}<Heart class="dpc__wish-icon is-on" />{:else}<Heart class="dpc__wish-icon" />{/if}` with a single element, so its fill can crossfade:

```svelte
							{#key popKey}
								<Heart class="dpc__wish-icon {isWishlisted ? 'is-on' : ''} {popKey && isWishlisted ? 'motion-pop' : ''}" />
							{/key}
```

    In the script, add `let popKey = $state(0)`. In the heart's `onclick`, add `popKey++` before `toggleWishlist()`.
  - **Styles.** In its `<style>`, after the sweep in Task 6 has tokenised the existing transitions, add:

```css
	/* Hover lifts the photograph a little; a press gives under the finger. Pointer-only for the zoom,
	   because a phone has no hover and a tap would leave it stuck. */
	.dpc__frame {
		transition: transform var(--motion-emphasis) var(--motion-ease);
	}
	.dpc__media {
		transition: transform var(--motion-fast) var(--motion-ease);
	}
	@media (hover: hover) and (pointer: fine) {
		.dpc:hover .dpc__frame {
			transform: scale(1.03);
		}
	}
	.dpc__media-link:active .dpc__media {
		transform: scale(0.98);
	}
	.dpc__add {
		transition:
			background var(--motion-fast) var(--motion-ease),
			color var(--motion-fast) var(--motion-ease),
			transform var(--motion-fast) var(--motion-ease);
	}
	.dpc__add:active:not(:disabled),
	.dpc__qty button:active:not(:disabled) {
		transform: scale(0.97);
	}
	.dpc :global(.dpc__wish-icon) {
		transition:
			fill var(--motion-fast) var(--motion-ease),
			color var(--motion-fast) var(--motion-ease);
	}
```

    Delete the old `.dpc__add` `transition:` declaration. The rule above replaces it.
  - **Reduced motion.** Replace the component's reduced-motion block with:

```css
	@media (prefers-reduced-motion: reduce) {
		.dpc :global(.dpc__skeleton) {
			animation: none;
		}
		.dpc__frame,
		.dpc__media,
		.dpc__wish,
		.dpc__add,
		.dpc__qty button {
			transform: none !important;
		}
	}
```

    The heart keeps its opacity reveal and fill crossfade. The pop is cancelled globally by Step 1.

- [ ] **Step 6: PDP add to cart and wishlist.** In `product-cart-and-wishlist-buttons.svelte`:
  - **Script.** Add:

```ts
	// Which face the add button shows; keyed so each change crossfades instead of swapping.
	const atcState = $derived(productState.isAdding ? 'adding' : justAdded ? 'added' : outOfStock ? 'oos' : 'idle')
	let wishToggled = $state(false)
```

  - **Wishlist button.**
    - `onclick={productState.handleWishlistClick}` → `onclick={(e) => { wishToggled = true; productState.handleWishlistClick(e) }}`.
    - In the `HeartIcon` class, `'scale-110 fill-destructive text-destructive'` → `\`fill-destructive text-destructive ${wishToggled ? 'motion-pop' : ''}\``.
    - Delete ` transition-transform duration-fast` from the same class.
  - **Add-to-bag button contents.** Wrap the whole `{#if productState.isAdding} … {/if}` chain in:

```svelte
					{#key atcState}
						<span class="inline-flex items-center gap-2" in:fade>
							<!-- the existing {#if productState.isAdding} … {/if} chain, unchanged, except: -->
						</span>
					{/key}
```

    In that chain, change `<Check class="h-4 w-4" aria-hidden="true" />` to `<Check class="motion-pop-in h-4 w-4" aria-hidden="true" />`.
  - **`<style>`.** Replace the `.edp-atc` transition with `transform var(--motion-fast) var(--motion-ease), opacity var(--motion-fast) var(--motion-ease), background-color var(--motion-fast) var(--motion-ease), color var(--motion-fast) var(--motion-ease)`, and add:

```css
	:global([data-theme='default'] .edp-atc:active:not(:disabled)) {
		transform: scale(0.97);
	}
```

  - **Reduced-motion block.** Replace it with:

```css
	@media (prefers-reduced-motion: reduce) {
		:global([data-theme='default'] .edp-atc:hover:not(:disabled)),
		:global([data-theme='default'] .edp-atc:active:not(:disabled)) {
			transform: none;
		}
	}
```

- [ ] **Step 7: Form controls.**
  - **`checkbox.svelte:16`.** Add `transition-colors duration-fast` to the root class string. At :28 replace `<Check class={cn('size-3.5', !checked && 'text-transparent')} />` with `<Check class={cn('size-3.5 transition-[transform,opacity] duration-fast ease-standard motion-reduce:transform-none', !checked && 'scale-50 opacity-0')} />`.
  - **`radio-group-item.svelte:23`.** Replace `<Circle class="size-3.5 fill-primary" />` with `<Circle class="motion-pop-in size-3.5 fill-primary" />`.
  - **`switch.svelte`.**
    - Root: `transition-colors` → `transition-colors duration-fast`.
    - Thumb: `transition-transform data-[state=checked]` → `transition-transform duration-fast ease-standard motion-reduce:transition-none data-[state=checked]`.
  - **`form-field-errors.svelte:23`.** Replace `<div {...errorProps} class={cn(errorClasses)}>{error}</div>` with `<div {...errorProps} class={cn('motion-rise', errorClasses)}>{error}</div>`.

- [ ] **Step 8: Check it in the browser at full and reduced motion.**
  - Build and start the server.
  - In Chrome DevTools, open the Rendering tab and set "Emulate CSS media feature prefers-reduced-motion" to `no-preference`, then to `reduce`.
  - On `http://127.0.0.1:3100/products` at 1280px:
    - hover a card: the image zooms, and the heart drops in
    - press the add button: it scales
    - toggle the heart: it pops (no-preference) or its fill fades (reduce)
    - hover a header link and a footer link: the underline wipes in (no-preference) or fades in (reduce)
  - On a PDP:
    - add to bag: spinner, then a check that pops in (fades under reduce), then idle, each face crossfading
    - the header cart badge bumps (fades under reduce)
  - Expected: no console errors in either mode.

- [ ] **Step 9: Format, type-check, unit tests, commit**

```bash
bunx prettier --write $(git diff --name-only)
bunx svelte-check --tsconfig ./tsconfig.json --output machine | grep COMPLETED
bunx vitest run tests/motion.test.ts tests/route-transition.test.ts
git add -A src
git commit -m "feat(motion): press, hover and state feedback on every storefront control

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Browser verification script

**Files:**
- Create: `scripts/verify-motion.mjs`

The script lives outside `tests/` on purpose: vitest collects every `tests/**/*.spec.ts`.

- [ ] **Step 1: Write the script**

```js
// Drives the production build in Chrome at full and reduced motion and checks the motion layer:
// every page change runs a view transition, the product morph runs only at full motion, nothing
// logs an error, and animation phases hold their frame rate (no frame over 50ms, ~60fps average).
//
//   PORT=3100 PUBLIC_LITEKART_API_URL=https://api.litekart.in PUBLIC_LITEKART_DOMAIN=demo.litekart.in node build
//   node scripts/verify-motion.mjs            # BASE_URL defaults to http://127.0.0.1:3100
import { chromium } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3100'
const MAX_FRAME_MS = 50
const MIN_AVG_FPS = 55
const failures = []
const report = []

const check = (ok, label) => {
	report.push(`${ok ? 'PASS' : 'FAIL'}  ${label}`)
	if (!ok) failures.push(label)
}

// Runs in the page before the app. Records every view transition (whether the morph group
// animated, frame deltas from `ready` to `finished`) and exposes a frame sampler.
const instrument = () => {
	window.__sampleFrames = (ms) =>
		new Promise((resolve) => {
			const frames = []
			let last = performance.now()
			const stopAt = last + ms
			const tick = (now) => {
				frames.push(now - last)
				last = now
				if (now < stopAt) requestAnimationFrame(tick)
				else resolve(frames)
			}
			requestAnimationFrame(tick)
		})

	window.__vt = []
	const original = document.startViewTransition?.bind(document)
	if (!original) return
	document.startViewTransition = (update) => {
		const record = { morph: false, frames: [], done: false, error: null }
		window.__vt.push(record)
		const transition = original(update)
		transition.ready
			.then(() => {
				record.morph = document.getAnimations().some((a) => String(a.effect?.pseudoElement ?? '').includes('product-media'))
				let last = performance.now()
				const tick = (now) => {
					record.frames.push(now - last)
					last = now
					if (!record.done) requestAnimationFrame(tick)
				}
				requestAnimationFrame(tick)
			})
			.catch((e) => (record.error = String(e)))
		transition.finished.finally(() => (record.done = true))
		return transition
	}
}

const smooth = (label, frames) => {
	const usable = frames.slice(1)
	const worst = Math.round(Math.max(0, ...usable))
	const mean = usable.reduce((a, b) => a + b, 0) / Math.max(1, usable.length)
	const fps = Math.round(1000 / mean)
	check(worst <= MAX_FRAME_MS && fps >= MIN_AVG_FPS, `${label}: worst frame ${worst}ms, ${fps}fps`)
}

const lastTransition = async (page) => {
	await page.waitForFunction(() => window.__vt.length > 0 && window.__vt.at(-1).done, null, { timeout: 10_000 })
	return page.evaluate(() => window.__vt.at(-1))
}

for (const reducedMotion of ['no-preference', 'reduce']) {
	const browser = await chromium.launch({ channel: 'chrome' })
	const context = await browser.newContext({ reducedMotion, viewport: { width: 1280, height: 900 } })
	const page = await context.newPage()
	const errors = []
	page.on('pageerror', (e) => errors.push(e.message))
	page.on('console', (m) => m.type() === 'error' && !/trustpilot/i.test(m.text()) && errors.push(m.text()))
	await page.addInitScript(instrument)
	const mode = reducedMotion === 'reduce' ? 'reduced' : 'full'

	await page.goto(`${BASE}/products`, { waitUntil: 'networkidle' })

	// 1. Scrolling the listing.
	const scrolling = page.evaluate(() => window.__sampleFrames(2000))
	for (let i = 0; i < 40; i++) {
		await page.mouse.wheel(0, 60)
		await page.waitForTimeout(50)
	}
	smooth(`[${mode}] listing scroll`, await scrolling)
	await page.evaluate(() => window.scrollTo(0, 0))

	// 2. Card → product page.
	await page.locator('a:has([data-vt-product-media])').first().click()
	await page.waitForURL(/\/products\/[^/?]+/)
	let vt = await lastTransition(page)
	check(!vt.error, `[${mode}] card → PDP ran a view transition${vt.error ? ` (${vt.error})` : ''}`)
	check(vt.morph === (mode === 'full'), `[${mode}] card → PDP morph ${mode === 'full' ? 'ran' : 'stayed off'}`)
	smooth(`[${mode}] card → PDP animation`, vt.frames)

	// 3. Back to the listing.
	await page.goBack()
	await page.waitForURL(/\/products\/?(\?.*)?$/)
	vt = await lastTransition(page)
	check(!vt.error, `[${mode}] Back ran a view transition${vt.error ? ` (${vt.error})` : ''}`)
	check(vt.morph === (mode === 'full'), `[${mode}] Back morph ${mode === 'full' ? 'ran' : 'stayed off'}`)
	smooth(`[${mode}] Back animation`, vt.frames)

	// 4. Cart drawer open, then closed with Escape.
	let sampling = page.evaluate(() => window.__sampleFrames(900))
	await page.locator('[data-testid="cart-icon"]').click()
	await page.waitForTimeout(400)
	await page.keyboard.press('Escape')
	smooth(`[${mode}] cart drawer open/close`, await sampling)

	// 5. Mega-menu open, only when the store has a category with children.
	const megaLink = page.locator('.ed-mm-link[aria-haspopup="true"]').first()
	if (await megaLink.count()) {
		sampling = page.evaluate(() => window.__sampleFrames(500))
		await megaLink.hover()
		smooth(`[${mode}] mega-menu open`, await sampling)
	} else {
		report.push(`SKIP  [${mode}] mega-menu: no category with children in this store`)
	}

	check(errors.length === 0, `[${mode}] no console errors${errors.length ? `: ${errors.join(' | ')}` : ''}`)
	await browser.close()
}

console.log(report.join('\n'))
process.exit(failures.length ? 1 : 0)
```

- [ ] **Step 2: Run it against the build**

```bash
BUILD_TIME="$(date -u +'%Y-%m-%d %H:%M:%S')" bun run build > /dev/null 2>&1
PORT=3100 PUBLIC_LITEKART_API_URL=https://api.litekart.in PUBLIC_LITEKART_DOMAIN=demo.litekart.in node build &
sleep 3
node scripts/verify-motion.mjs
```

Expected: every line `PASS` (or the mega-menu `SKIP`), exit 0.

  **If a frame-timing line fails, do not loosen the threshold.**
  1. Rerun once, because a headless first paint can stall.
  2. Then find the long frame with a Chrome performance trace on the same interaction.
  3. If it reproduces on the pre-motion commit (`git stash; rebuild; rerun`), report it as environmental, with the numbers from both runs.

- [ ] **Step 3: Commit**

```bash
bunx prettier --write scripts/verify-motion.mjs
git add scripts/verify-motion.mjs
git commit -m "test(motion): browser check for transitions, morph and frame timing

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Final gates, docs, push

**Files:**
- Modify: `docs/UX_AUDIT.md` (Implementation status table)

- [ ] **Step 1: Full gates**

```bash
bunx svelte-check --tsconfig ./tsconfig.json 2>&1 | tail -1
bunx vitest run 2>&1 | grep -E "Test Files"
node scripts/verify-motion.mjs
```

Expected:
- svelte-check at or below 90 errors.
- vitest `Test Files  19 failed | 7 passed (26)`: the 19 pre-existing failures plus the 2 new passing files.
- The verify script exits 0.

- [ ] **Step 2: Visual spot-check in the user's Chrome (reduced motion), at 390px and 1280px.**
  - Pages: home, listing, PDP, cart drawer, mobile menu, filter sheet, checkout address.
  - Every state change visibly fades or changes colour. Nothing slides, zooms or snaps. Spinners turn.
  - The header, footer and bottom nav do not flicker on navigation.

- [ ] **Step 3: Status row.** Add to the table in `docs/UX_AUDIT.md` "Implementation status":

```md
| Motion layer: tokens, route crossfade + product morph, feedback on every control, reduced motion that fades instead of snapping | `<sha of Task 7 commit>` |
```

- [ ] **Step 4: Commit and push**

```bash
git add docs/UX_AUDIT.md
git commit -m "docs: record the motion layer in the UX audit status

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push origin main
```
