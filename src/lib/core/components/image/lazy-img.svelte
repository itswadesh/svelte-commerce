<script lang="ts" module>
	import { getImageCDNUrl } from '@misiki/kitcommerce-core/utils'

	// Candidate widths offered to the browser when `sizes` is set. The browser picks the
	// smallest one that satisfies the rendered size at the device's pixel density, so image
	// resolution adapts to the device instead of always fetching the 1280px fallback.
	const SRCSET_WIDTHS = [160, 240, 320, 480, 640, 768, 1024, 1280]

	/**
	 * The width-descriptor srcset this component emits when it is given `sizes`. Exported so a
	 * preload of the same image (the product page's LCP preload) offers the browser identical
	 * candidates, and the image is downloaded once.
	 */
	export function lazyImgSrcset(src: string): string {
		return SRCSET_WIDTHS.map((sw) => `${getImageCDNUrl(src, sw, 0)} ${sw}w`).join(', ')
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte'
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
		 * Render and fetch this image now, without waiting for it to intersect the viewport, but at
		 * low fetch priority so it never competes with the LCP element.
		 *
		 * The intersection gate below means a non-priority image is not merely
		 * `loading="lazy"` — its <img> is not in the DOM at all. Inside the product carousel every
		 * slide past the first sits offscreen *horizontally*, so nothing intersects and the request
		 * does not begin until the shopper swipes. They then wait a full round trip against the
		 * placeholder on every swipe. Callers turn this on once the page has gone idle, so first
		 * paint is unaffected.
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
	const resolvedFetchPriority = $derived(fetchpriority ?? (priority ? 'high' : eager ? 'low' : 'auto'))

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
	const cdnSrcset = $derived(sizes ? lazyImgSrcset(src) : undefined)

	const extension = $derived(src?.split('.').pop())

	let loaded = $state(false)
	let error = $state(false)
	let isIntersecting = $state(false)
	let containerRef: HTMLDivElement
	let usingFallback = $state(false) // Track if we're using fallback

	// Transparent placeholder
	const transparentPlaceholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

	let observer: IntersectionObserver

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
          if (!isIntersecting) {
					  isIntersecting = entry.isIntersecting
          }
				}
			},
			{
				rootMargin: '50px',
				threshold: 0
			}
		)

		if (containerRef) {
			observer.observe(containerRef)
		}

		return () => {
			if (observer) {
				observer.disconnect()
			}
		}
	})

	$effect(() => {
		if (src) {
			loaded = false
			error = false
			usingFallback = false
		}
	})
</script>

<div
	bind:this={containerRef}
	class="relative bg-transparent w-full"
	style="aspect-ratio: {aspectWidth}/{aspectHeight}; {height !== 'auto' ? `height: ${height}px;` : ''} {width !== 'auto' ? `width: ${width}px;` : ''}"
>
	{#if (!loaded || error) && !priority}
		<!-- Visible loading placeholder (skipped for priority images, which render eagerly). -->
		<div class="absolute inset-0 flex items-center justify-center bg-gray-50 animate-pulse">
			<!-- <ImageIcon class="h-8 w-8 text-gray-400" /> -->
		</div>
	{/if}
	<!-- {#if !loaded && !error}
		<div class="absolute inset-0 flex items-center justify-center bg-gray-50/50" transition:fade={{ duration: 150 }}>
			<div class="h-1 w-1/3 overflow-hidden rounded-full bg-primary/20">
				<div class="h-full w-1/3 animate-[shimmer_1.5s_ease-in-out_infinite] rounded-full bg-primary"></div>
			</div>
		</div>
	{/if} -->
	{#if page?.data?.store?.plugins?.imageCdn?.active && !usingFallback}
		<div class={klass}>
			{#if isIntersecting || priority || eager}
				<!-- srcset/sizes are declared BEFORE src on purpose. This <img> is created by the
				     client (behind the IntersectionObserver gate), not by the HTML parser, so Svelte
				     applies attributes in source order and setting src first starts a load for the
				     full-width candidate before srcset is ever considered — a 96px thumbnail ends up
				     fetching the 1280px render despite carrying a correct srcset. -->
				<img
					onload={() => {
						loaded = true
						error = false
					}}
					onerror={(e) => {
						if (!usingFallback) {
							usingFallback = true
							loaded = false
							error = false
						} else {
							error = true
							loaded = false
						}
					}}
					{alt}
					draggable="false"
					fetchpriority={resolvedFetchPriority}
					decoding="async"
	        style="aspect-ratio: {aspectWidth}/{aspectHeight}; {height !== 'auto' ? `height: ${height}px;` : ''} {width !== 'auto' ? `width: ${width}px;` : ''}"
					data-nimg="1"
					loading={resolvedLoading}
					srcset={cdnSrcset}
					{sizes}
					src={getImageCDNUrl(src, cdnW, h)}
					height={attrH}
					width={attrW}
					class="h-full w-full object-contain object-center transition-opacity duration-300 {klass}"
					class:opacity-0={!(loaded || priority)}
					class:opacity-100={loaded || priority}
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
			{#if isIntersecting || priority || eager}
				<img
					onload={() => {
						loaded = true
						error = false
					}}
					onerror={(ev) => {
						error = true
						loaded = false
					}}
					{alt}
					{src}
					draggable="false"
					loading={resolvedLoading}
					fetchpriority={resolvedFetchPriority}
					decoding="async"
					data-nimg="1"
	        style="aspect-ratio: {aspectWidth}/{aspectHeight}; {height !== 'auto' ? `height: ${height}px;` : ''} {width !== 'auto' ? `width: ${width}px;` : ''}"
					height={attrH}
					width={attrW}
					class="h-full w-full object-contain object-center transition-opacity duration-300 {klass}"
					class:opacity-0={!(loaded || priority)}
					class:opacity-100={loaded || priority}
					{...rest}
				/>
			{/if}
		</div>
	{/if}
</div>

<style>
	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}

	.shimmer {
		background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
	}
</style>
