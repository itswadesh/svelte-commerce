<script lang="ts" module>
	import { getImageCDNUrl } from '@misiki/kitcommerce-core/utils'
	import { getContext, setContext } from 'svelte'

	// Candidate widths offered to the browser when `sizes` is set. The browser picks the
	// smallest one that satisfies the rendered size at the device's pixel density, so image
	// resolution adapts to the device instead of always fetching the 1280px fallback.
	const SRCSET_WIDTHS = [160, 240, 320, 480, 640, 768, 1024, 1280]

	/**
	 * The width-descriptor srcset this component emits when it is given `sizes`. Exported so a
	 * preload of the same image (the product page's LCP preload) offers the browser identical
	 * candidates, and the image is downloaded once.
	 *
	 * Empty when the CDN hands back one address for every width: a picture it cannot resize (a
	 * site-relative path, such as a sample shop's photos) listed the same file at 160w to 1280w,
	 * which offers the browser nothing and claims sizes that do not exist (SNX-034).
	 */
	export function lazyImgSrcset(src: string): string {
		const urls = SRCSET_WIDTHS.map((sw) => getImageCDNUrl(src, sw, 0))
		if (new Set(urls).size < 2) return ''
		return urls.map((url, i) => `${url} ${SRCSET_WIDTHS[i]}w`).join(', ')
	}

	// The first pictures a page renders are in or near the first screen, so they go in the server's
	// HTML, already shown, instead of waiting for the observer below. That observer only exists
	// after hydration, which on a mid-range phone on mobile data is seconds after first paint: the
	// home page's product cards sat empty all that time (owner, 2026-11-27: "until I scroll,
	// products are not visible"). Counted in render order, which is page order, so the server and
	// hydration agree. ponytail: a count, not a measurement, since the server cannot see the
	// screen; 8 covers the hero and two rows of cards on a phone, the first row on a desktop.
	const EARLY_PICTURES = 8
	const EARLY = Symbol('early pictures')

	/**
	 * Called by the root layout, so each page load gets its allowance of early pictures. A component
	 * that paces its own pictures (a carousel, whose slides sit off screen sideways) passes 0.
	 */
	export function allowEarlyPictures(count = EARLY_PICTURES) {
		setContext(EARLY, { left: count })
	}

	function claimEarly(): boolean {
		const allowance = getContext<{ left: number } | undefined>(EARLY)
		return !!allowance && allowance.left-- > 0
	}

	// A picture that comes out of the cache is complete before the frame paints: show it at once
	// rather than fading it in again.
	function shownIfCached(img: HTMLImageElement) {
		if (img.complete && img.naturalWidth) img.setAttribute('data-shown', '')
	}
</script>

<script lang="ts">
	import { page } from '$app/state'

	let {
		class: klass,
		alt = '',
		height = 'auto',
		src = '',
		aspectRatio = page?.data?.store?.productImageAspectRatio,
		width = 'auto',
		priority = false,
		/**
		 * Render and fetch this image now rather than when it nears the viewport, but at low fetch
		 * priority so it never competes with the LCP element. Inside the product carousel every slide
		 * past the first sits offscreen *horizontally*, never intersects, and would wait for the swipe.
		 * Callers turn this on once the page has gone idle, so first paint is unaffected.
		 */
		eager = false,
		loading = undefined,
		fetchpriority = undefined,
		sizes = undefined,
		...rest
	}: {
		class?: string
		alt?: string
		height?: string | number
		src?: string
		aspectRatio?: string
		width?: string | number
		priority?: boolean
		eager?: boolean
		loading?: 'lazy' | 'eager'
		fetchpriority?: 'auto' | 'high' | 'low'
		sizes?: string
		[key: string]: any
	} = $props()

	const resolvedLoading = $derived(loading ?? (priority || eager ? 'eager' : 'lazy'))

	// Fallback CDN resize width for responsive (w-full) images that pass no explicit
	// width. Without it the CDN URL omits width=/height= and serves the full-res original.
	const DEFAULT_CDN_WIDTH = 1280

	const [aspectWidth, aspectHeight] = $derived(aspectRatio?.split(':') || ['1', '1'])

	const h = $derived(height === 'auto' ? '0' : +height * 2)
	const w = $derived(width === 'auto' ? '0' : +width * 2)
	// Width fed to the CDN URL builder: real width when given, else the fallback.
	const cdnW = $derived(width === 'auto' ? DEFAULT_CDN_WIDTH : +width * 2)
	// Intrinsic-size ATTRIBUTES, as opposed to the CDN resize hints above. A responsively sized
	// (`auto`) image, the default for every product card and the gallery, states the rendition it
	// requests: the CDN width, and a height in the frame's aspect ratio. Lighthouse, axe and the
	// browser then read real dimensions and the right ratio before the file arrives. Never `0`:
	// a browser that infers a ratio from a 0/0 pair defeats the aspect-ratio box's CLS protection.
	const attrW = $derived(width === 'auto' ? cdnW : +w)
	const attrH = $derived(height === 'auto' ? Math.round((cdnW * +aspectHeight) / +aspectWidth) || cdnW : +h)
	// Device-responsive srcset (width descriptors) built from the CDN. Only emitted when a
	// caller supplies `sizes`, so existing single-src usage is unchanged.
	const cdnSrcset = $derived((sizes && lazyImgSrcset(src)) || undefined)

	let usingFallback = $state(false) // The CDN failed this picture; show the original address.

	// Retry the CDN only when the address really changes, not when the parent rebuilds the object
	// `src` was read from (a cart refresh after +, a listing re-fetch) with the same address.
	let shownSrc: string | null = null
	$effect(() => {
		const changed = shownSrc !== null && src !== shownSrc
		shownSrc = src
		if (changed) usingFallback = false
	})

	// A non-priority picture is added only once its box comes within 200px of the screen, so the
	// pictures load in the order they come into view. Putting every one in the server's HTML as
	// native `loading="lazy"` instead (2026-11-25) let Chrome fetch whatever lay within its 1250 to
	// 2500px lazy margin during first load, product page gallery slides at high priority among them:
	// mobile Lighthouse LCP went from 2.29 to 2.74s on home and 2.80 to 3.03s on a product page.
	const early = claimEarly()
	// Early pictures ask low, like `eager` ones: the count may reach pictures well down the page,
	// and they must not compete with the LCP picture for the line.
	const resolvedFetchPriority = $derived(fetchpriority ?? (priority ? 'high' : eager || early ? 'low' : 'auto'))
	let near = $state(early)
	function whenNear(node: HTMLElement) {
		if (near) return
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					near = true
					observer.disconnect()
				}
			},
			{ rootMargin: '200px 0px' }
		)
		observer.observe(node)
		return { destroy: () => observer.disconnect() }
	}
</script>

<!-- No placeholder (owner, 2026-11-25): the box keeps its ratio, empty, and the picture fades in
     when it arrives (app.css). It used to sit over a grey pulsing box. -->
<div
	use:whenNear
	class="relative bg-transparent w-full"
	style="aspect-ratio: {aspectWidth}/{aspectHeight}; {height !== 'auto' ? `height: ${height}px;` : ''} {width !== 'auto' ? `width: ${width}px;` : ''}"
>
	{#if page?.data?.store?.plugins?.imageCdn?.active && !usingFallback}
		<div class={klass}>
			<!-- srcset/sizes are declared BEFORE src on purpose. When the client creates this <img>
			     (a page navigated to, a slide added), Svelte applies attributes in source order, and
			     setting src first starts a load for the full-width candidate before srcset is ever
			     considered — a 96px thumbnail ends up fetching the 1280px render. -->
			{#if priority || eager || near}
				<img
					onerror={() => {
						usingFallback = true
					}}
					{alt}
					draggable="false"
					fetchpriority={resolvedFetchPriority}
					decoding="async"
					style="aspect-ratio: {aspectWidth}/{aspectHeight}; {height !== 'auto' ? `height: ${height}px;` : ''} {width !== 'auto' ? `width: ${width}px;` : ''}"
					data-nimg="1"
					data-shown={early ? '' : undefined}
					use:shownIfCached
					loading={resolvedLoading}
					srcset={cdnSrcset}
					sizes={cdnSrcset ? sizes : undefined}
					src={getImageCDNUrl(src, cdnW, h)}
					height={attrH}
					width={attrW}
					class="h-full w-full object-contain {klass}"
					{...rest}
				/>
			{/if}
		</div>
	{:else}
		<!-- Guarded the same way the CDN branch's wrapper is: with the `auto` defaults this used
		     to emit the literal `style="width: autopx; height: autopx;"`, which the CSS parser
		     silently drops. `klass` stays on this wrapper — callers such as the lime theme's
		     ll-image rely on it to size the box that holds the <img>. -->
		<div
			class={klass}
			style="{width !== 'auto' ? `width: ${width}px;` : ''} {height !== 'auto' ? `height: ${height}px;` : ''}"
		>
			{#if priority || eager || near}
				<img
					{alt}
					{src}
					draggable="false"
					loading={resolvedLoading}
					fetchpriority={resolvedFetchPriority}
					decoding="async"
					data-nimg="1"
					data-shown={early ? '' : undefined}
					use:shownIfCached
					style="aspect-ratio: {aspectWidth}/{aspectHeight}; {height !== 'auto' ? `height: ${height}px;` : ''} {width !== 'auto' ? `width: ${width}px;` : ''}"
					height={attrH}
					width={attrW}
					class="h-full w-full object-contain {klass}"
					{...rest}
				/>
			{/if}
		</div>
	{/if}
</div>
