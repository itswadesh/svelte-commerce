<script lang="ts">
	import '../app.css'
	import { Toaster } from '$lib/components/ui/sonner/index.js'
	import { getThemeFontsUrl } from '$lib/theme/index.js'
	import { setUserState } from '$lib/core/stores/index.js'
	import { GoogleAnalytics } from '$lib/core/components/index.js'
	import KlaviyoPlugin from '$lib/core/components/plugins/klaviyo-plugin.svelte'
	import { navigating } from '$app/stores'
	import { updated } from '$app/state'
	import { afterNavigate, beforeNavigate } from '$app/navigation'
	import { browser } from '$app/environment'
	import { Loader } from '@lucide/svelte'
	import { type Snippet } from 'svelte'
	import type { StoreData } from '$lib/core/types/index.js'
	import { ColorPalette } from '$lib/core/components/index.js'
	import StoreFont from '$lib/components/common/store-font.svelte'
	import StorePalette from '$lib/components/common/store-palette.svelte'
	import { guardStorePalette } from '$lib/components/common/store-palette-guard.js'

	interface LayoutData {
		store: StoreData
		theme?: {
			name: string
			source: 'admin' | 'env' | 'default'
			available: string[]
		}
		timestamp: number
		error?: string
	}
	let { children, data }: { children: Snippet; data: LayoutData } = $props()
	setUserState()

	const themeName = $derived(data?.theme?.name || 'default')
	const themeFontsUrl = $derived(getThemeFontsUrl(themeName))

	// A navigation that changes the page, not just its query string.
	const isCrossRouteNavigation = $derived(!!$navigating && $navigating.to?.url.pathname !== $navigating.from?.url.pathname)

	// Second carrier for the active theme, on <html>. Portalled overlays — every bits-ui dialog,
	// sheet, drawer, popover, dropdown and tooltip — attach to `document.body`, which sits above the
	// shell below, so without this they resolve the `:root` fallback palette, radius and font
	// instead of this theme's. hooks.server.ts stamps the same value during SSR; this keeps <html>
	// in step when the theme changes client-side. The shell keeps its own attribute.
	$effect(() => {
		document.documentElement.setAttribute('data-theme', themeName)
	})

	// store-palette.svelte and store-font.svelte apply the merchant's admin-set palette and body
	// font as inline custom properties on `document.querySelector('[data-theme]')` — which, now
	// that <html> carries the attribute too, resolves to <html> rather than the shell. Values
	// inherited from <html> lose to the shell's own `[data-theme='…']` block, which declares the
	// same token names, so re-project whatever those components set on <html> onto the shell. The
	// page and the portals then read one palette instead of two.
	let shell: HTMLDivElement | null = $state(null)

	$effect(() => {
		const el = shell
		if (!el) return
		const root = document.documentElement
		let applied: string[] = []
		const project = () => {
			const next: string[] = []
			for (let i = 0; i < root.style.length; i++) {
				const name = root.style[i]
				if (!name.startsWith('--')) continue
				el.style.setProperty(name, root.style.getPropertyValue(name))
				next.push(name)
			}
			for (const name of applied) {
				if (!next.includes(name)) el.style.removeProperty(name)
			}
			applied = next
		}
		project()
		// Those components own their own effects, so react to their writes rather than racing them.
		const observer = new MutationObserver(project)
		observer.observe(root, { attributes: true, attributeFilter: ['style'] })
		return () => {
			observer.disconnect()
			for (const name of applied) el.style.removeProperty(name)
		}
	})

	// Themes built on the section library keep their look in the API and ship it on the store
	// payload. Inlining it here means the theme's CSS is already in the SSR head — no extra
	// request and nothing cross-origin blocking first paint, which a linked API stylesheet would.
	// The tag name is split on purpose: Svelte's preprocessor treats any literal `<style>` in the
	// file as this component's own stylesheet, even inside a string, and tries to compile it.
	const STYLE_OPEN = '<sty' + 'le id="theme-css">'
	const STYLE_CLOSE = '</sty' + 'le>'
	const themeStyleTag = $derived(data?.store?.themeCss ? STYLE_OPEN + data.store.themeCss + STYLE_CLOSE : '')

	// The merchant palette, in the SSR head rather than applied after hydration. StorePalette writes
	// the same custom properties onto the shell in an effect, so until this existed the storefront
	// painted the theme palette first and visibly flipped to the brand one once JavaScript ran —
	// most obvious on muted surfaces and on every primary button. Emitting it here means the first
	// paint is already correct; StorePalette still runs, so a runtime palette change keeps working.
	const paletteStyleTag = $derived.by(() => {
		if ((data?.theme?.name || 'default') !== 'default') return ''
		const vars = data?.store?.cssVariables ?? {}
		const declarations = Object.entries(guardStorePalette(vars as Record<string, unknown>))
			.map(([key, value]) => key + ': ' + value + ';')
			.join(' ')
		if (!declarations) return ''
		// Doubled attribute selector on purpose: Tailwind 3 emits its @layer base rules as plain,
		// unlayered CSS, so the theme block and this one would tie on specificity and the winner would
		// depend on stylesheet order — which differs between the dev server and a production build.
		// (0,2,0) settles it, and matches what StorePalette already does with inline styles.
		return STYLE_OPEN.replace('theme-css', 'store-palette') + "[data-theme='default'][data-theme] { " + declarations + ' }' + STYLE_CLOSE
	})

	// Mobile browsers paint their own chrome — the address-bar strip on Chrome for Android, the
	// status-bar backdrop once the storefront is installed — in a default grey unless the page names
	// a colour, so there was a visible seam above a header that is itself `bg-background`. Take the
	// merchant override when there is one so a custom palette moves the chrome with it, and fall back
	// to the theme value. Only the default theme is in scope; the others own their own backgrounds.
	const themeColor = $derived.by(() => {
		if ((data?.theme?.name || 'default') !== 'default') return ''
		// Read through entries rather than by key: `cssVariables` is typed `{}` upstream, so indexing it
		// needs a cast. This is what paletteStyleTag above already does with the same object.
		const override = Object.entries(data?.store?.cssVariables ?? {}).find(([key]) => key === '--background')?.[1]
		const triplet =
			typeof override === 'string' && override.trim() ? override.replaceAll(',', '').replace('hsl(', '').replace(')', '').trim() : '0 0% 100%'
		return `hsl(${triplet})`
	})

	// Stale-client protection. SvelteKit's `updated` store flips to true once the
	// deployed build (via _app/version.json polling) no longer matches the running
	// client. We then load fresh code so mobile/PWA users never keep running an
	// old bundle:
	//  - on the next in-app navigation (hard load instead of client-side nav)
	//  - immediately while the tab sits idle (covers webviews in the background)
	beforeNavigate((nav) => {
		if (updated.current && nav.to?.url && !nav.willUnload) {
			location.href = nav.to.url.href
		}
	})

	// Auto-update as soon as a new deployment is detected, even while the tab
	// sits idle (e.g. inside a mobile webview) — don't wait for a navigation.
	$effect(() => {
		if (browser && updated.current) {
			location.reload()
		}
	})

	// The last path this session settled on, so a change of page can be detected without trusting
	// the navigation's own `from`.
	let landedPath = ''

	// Also re-check on every navigation so a stale webview updates promptly.
	afterNavigate(({ to }) => {
		if (browser) updated.check()
		if (!browser) return

		// Land at the top when the page itself changes. SvelteKit normally handles this, but the
		// product page replaces its URL with `?variant_id=…` (`replaceState`, `noScroll`) the moment it
		// mounts — that navigation supersedes the one that brought the shopper in, so the scroll reset
		// never happens and its `afterNavigate` reports the product page as both `from` and `to`.
		// Tapping a product from halfway down a listing therefore dropped them halfway down the
		// product page. Comparing against the last settled path sidesteps that entirely.
		//
		// Query-only changes keep their position on purpose: those are the filter and variant updates.
		const path = to?.url.pathname
		if (!path) return
		if (path === landedPath) return
		landedPath = path

		// `behavior: 'instant'` is the other half of the fix. app.css sets `html { scroll-behavior: smooth }`, so a
		// plain scrollTo animates — and the product page replaces its URL (`?variant_id=…`) while that
		// animation is still running, which cancels it and leaves the shopper at the listing's offset.
		window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
	})

	// Origin serving product imagery — usually the LCP element and always a different host from
	// the document, so without a preconnect the browser pays DNS + TCP + TLS before the fetch can
	// even start (~100ms measured on a production storefront). Derived at runtime rather than
	// hardcoded so it follows whatever store/CDN this theme is deployed against. The Cloudflare
	// provider falls back to the image's own origin when no explicit CDN prefix is configured, so
	// fall back to a known store asset in that case.
	const imageCdnOrigin = $derived.by(() => {
		const cdn = data?.store?.plugins?.imageCdn
		if (!cdn?.active) return ''
		try {
			return new URL(cdn.url || data?.store?.logo || data?.store?.favicon).origin
		} catch {
			return ''
		}
	})
</script>

<svelte:head>
	<!-- No `crossorigin` here on purpose: the product <img> tags are non-CORS and would not reuse
	     a connection opened in the CORS pool. -->
	{#if imageCdnOrigin}
		<link rel="preconnect" href={imageCdnOrigin} />
	{/if}
	<link rel="icon" href={data?.store?.favicon || '/favicon.png'} />
	{#if themeColor}
		<meta name="theme-color" content={themeColor} />
	{/if}
	<!-- No canonical here. A layout-level default cannot know whether the page below it already
	     emitted one, and the listing routes now pass an explicit `canonicalUrl` that preserves
	     ?page=N — so a default emitted here would ship a second, *conflicting* <link rel=canonical>
	     on every paginated listing and Google would discard both. Canonicals are owned per page:
	     SeoHeader routes get theirs from SeoHeader, the handful of hand-rolled <title> routes
	     render <Canonical /> ($lib/components/seo/canonical.svelte).
	     No default <meta name="description"> here either — the root head renders *before* the
	     page's, so a generic one would shadow the per-page description on every SeoHeader route. -->
	{#if themeFontsUrl}
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
		<link rel="preload" as="style" href={themeFontsUrl} />
		<link href={themeFontsUrl} rel="stylesheet" />
	{/if}
	{#if themeStyleTag}
		{@html themeStyleTag}
	{/if}
	{#if paletteStyleTag}
		{@html paletteStyleTag}
	{/if}
	{#if data?.store?.plugins?.headerScripts?.active}
		{@html data?.store?.plugins?.headerScripts?.html}
	{/if}
</svelte:head>

<ColorPalette />
<StorePalette />
<StoreFont />
<GoogleAnalytics />
<KlaviyoPlugin storeData={data?.store} />

<!-- <ThemeProvider /> -->

<div bind:this={shell} class="light min-h-screen theme-{themeName}" data-theme={themeName} data-theme-source={data?.theme?.source || 'default'}>
	<!-- Background/min-height wrapper only. NOT a <main>: every group layout renders its own
	     <main>, and nesting them ships duplicate main landmarks on all 55 routes. -->
	<div class="min-h-screen bg-background">
		<!-- Cross-route only. Filter, sort and pagination changes navigate to the same route, and this
		     overlay blurred the whole page behind a modal spinner for them, which said nothing about
		     which region was updating and blocked the controls the shopper had just used. Those
		     refinements now report progress on the grid itself. -->
		{#if isCrossRouteNavigation}
			<!-- Delayed spinner: fast navigations finish without a loader flash; only
			     navigations still pending after 700ms get the overlay. -->
			{#await new Promise((resolve) => setTimeout(resolve, 700)) then _}
				<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm" role="status">
					<div class="rounded-lg bg-white p-4">
						<Loader class="animate-spin" />
						<span class="sr-only">Loading</span>
					</div>
				</div>
			{:catch}
				<!-- Ignore any errors from the promise -->
			{/await}
		{/if}
		{@render children()}
	</div>
	<!-- Inside the wrapper on purpose: svelte-sonner renders where it is mounted, so out here it
	     used to paint every toast in the root fallback palette and font. -->
	<Toaster position="top-center" />
</div>
