<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import { getImageCDNUrl } from '@misiki/kitcommerce-core/utils'

	let {
		class: klass,
		alt = '',
		height = 'auto',
		src = '',
		aspectRatio = page?.data?.store?.productImageAspectRatio,
		width = 'auto',
		priority = false,
		...rest
	} = $props()

	// Fallback CDN resize width for responsive (w-full) images that pass no explicit
	// width. Without it the CDN URL omits width=/height= and serves the full-res original.
	// Larger than lazy-img's default because the zoom panel magnifies up to 2.5x.
	const DEFAULT_CDN_WIDTH = 1600

	// Magnification used by the side zoom panel.
	const ZOOM = 2.5
	// The panel needs far more detail than the on-page image, so it asks the CDN for a
	// high-resolution copy of the same admin/API image (or the untouched original when the
	// CDN plugin is off) instead of magnifying the display-sized copy.
	const ZOOM_CDN_WIDTH = 2400
	// Gap between the image and the zoom panel.
	const PANEL_GAP = 16
	// Below this the panel is too cramped to be useful, so zoom is skipped entirely.
	const MIN_PANEL_WIDTH = 280
	// Keep the panel off the very edge of the viewport.
	const VIEWPORT_INSET = 8

	const h = $derived(height === 'auto' ? '0' : +height * 2)
	const w = $derived(width === 'auto' ? '0' : +width * 2)
	// Width fed to the CDN URL builder: real width when given, else the fallback.
	const cdnW = $derived(width === 'auto' ? DEFAULT_CDN_WIDTH : +width * 2)

	const [aspectWidth, aspectHeight] = $derived(aspectRatio?.split(':') || ['1', '1'])

	const extension = $derived(src?.split('.').pop())

	let isSvg = $state(false)
	let loaded = $state(false)
	let error = $state(false)
	let isIntersecting = $state(false)
	let containerRef: HTMLDivElement | undefined = $state()
	let usingFallback = $state(false) // Track if we're using fallback

	// Zoom state
	let isHovered = $state(false)
	let isMobile = $state(false)
	// Image box measured on hover; the lens/panel maths are relative to it.
	let box = $state<{ left: number; top: number; width: number; height: number } | null>(null)
	// Lens rectangle, in image-box pixels.
	let lens = $state({ left: 0, top: 0, width: 0, height: 0 })
	// Zoom panel rectangle, in viewport pixels.
	let panel = $state<{ left: number; top: number; width: number; height: number } | null>(null)
	// Whether the high-definition copy has arrived; until then the panel shows the display copy.
	let zoomHiResLoaded = $state(false)

	if (extension === 'svg') {
		isSvg = true
	}

	const cdnActive = $derived(page?.data?.store?.plugins?.imageCdn?.active && !usingFallback)
	// Display-sized copy: already in cache, so the panel has something sharp-enough to show instantly.
	const displaySrc = $derived(cdnActive ? getImageCDNUrl(src, cdnW, h) : src)
	// High-definition copy, fetched only once the shopper actually hovers.
	const zoomSrc = $derived(cdnActive ? getImageCDNUrl(src, ZOOM_CDN_WIDTH, '0') : src)
	const canZoom = $derived(!isMobile && !isSvg && !error && (loaded || priority))
	const showZoom = $derived(isHovered && canZoom && !!box && !!panel)

	// Transparent placeholder
	const transparentPlaceholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

	let observer: IntersectionObserver

	onMount(() => {
		isMobile = window.innerWidth < 640
		const handleResize = () => {
			isMobile = window.innerWidth < 640
			closeZoom()
		}
		window.addEventListener('resize', handleResize)
		// Scrolling invalidates the cached image box, so drop the zoom instead of drifting.
		window.addEventListener('scroll', closeZoom, true)

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
			window.removeEventListener('resize', handleResize)
			window.removeEventListener('scroll', closeZoom, true)
		}
	})

	$effect(() => {
		if (src) {
			loaded = false
			error = false
			usingFallback = false
			zoomHiResLoaded = false
		}
	})

	const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

	// Places the panel beside the image: right by default, left when the right side is too tight.
	function computePanel(rect: DOMRect) {
		const viewportWidth = window.innerWidth
		const viewportHeight = window.innerHeight
		const spaceRight = viewportWidth - rect.right - PANEL_GAP - VIEWPORT_INSET
		const spaceLeft = rect.left - PANEL_GAP - VIEWPORT_INSET

		let panelWidth: number
		let left: number

		if (spaceRight >= MIN_PANEL_WIDTH) {
			panelWidth = Math.min(rect.width, spaceRight)
			left = rect.right + PANEL_GAP
		} else if (spaceLeft >= MIN_PANEL_WIDTH) {
			panelWidth = Math.min(rect.width, spaceLeft)
			left = rect.left - PANEL_GAP - panelWidth
		} else {
			return null
		}

		const panelHeight = Math.min(rect.height, viewportHeight - VIEWPORT_INSET * 2)
		const top = clamp(rect.top, VIEWPORT_INSET, Math.max(VIEWPORT_INSET, viewportHeight - VIEWPORT_INSET - panelHeight))

		return { left, top, width: panelWidth, height: panelHeight }
	}

	// The lens is the slice of the image the panel shows, so it is the panel scaled down by ZOOM.
	function updateLens(e: MouseEvent) {
		if (!box || !panel) return
		const lensWidth = Math.min(panel.width / ZOOM, box.width)
		const lensHeight = Math.min(panel.height / ZOOM, box.height)
		lens = {
			left: clamp(e.clientX - box.left - lensWidth / 2, 0, box.width - lensWidth),
			top: clamp(e.clientY - box.top - lensHeight / 2, 0, box.height - lensHeight),
			width: lensWidth,
			height: lensHeight
		}
	}

	function openZoom(e: MouseEvent) {
		if (!containerRef || !canZoom) return
		const rect = containerRef.getBoundingClientRect()
		const nextPanel = computePanel(rect)
		if (!nextPanel) {
			closeZoom()
			return
		}
		box = { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
		panel = nextPanel
		updateLens(e)
		isHovered = true
	}

	function handleMouseMove(e: MouseEvent) {
		if (isMobile) return
		if (isHovered) {
			updateLens(e)
		} else {
			openZoom(e)
		}
	}

	function closeZoom() {
		isHovered = false
	}

	// The panel has to escape the carousel's overflow-hidden/transformed viewport.
	function portal(node: HTMLElement) {
		document.body.appendChild(node)
		return {
			destroy() {
				node.remove()
			}
		}
	}
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<div
	bind:this={containerRef}
	onmouseenter={openZoom}
	onmouseleave={closeZoom}
	onmousemove={handleMouseMove}
	class="relative w-full overflow-hidden bg-gray-50"
	style="aspect-ratio: {aspectWidth}/{aspectHeight}; {height !== 'auto' ? `height: ${height}px;` : ''} {width !== 'auto' ? `width: ${width}px;` : ''}"
>
	{#if (!loaded || error) && !priority}
		<!-- Visible loading placeholder (skipped for priority images, which render eagerly). -->
		<div class="absolute inset-0 flex items-center justify-center bg-gray-50 animate-pulse">
			<!-- <ImageIcon class="h-8 w-8 text-gray-400" /> -->
		</div>
	{/if}

	{#if page?.data?.store?.plugins?.imageCdn?.active && !usingFallback}
		<div class={klass}>
			{#if isIntersecting || priority}
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
					fetchpriority={priority ? 'high' : 'auto'}
					decoding="async"
					data-nimg="1"
					loading={priority ? 'eager' : 'lazy'}
					src={getImageCDNUrl(src, cdnW, h)}
					height={+h}
					width={+w}
					class="h-full w-full object-contain object-center {klass}"
					class:opacity-0={!(loaded || priority)}
					class:opacity-100={loaded || priority}
					{...rest}
				/>
			{/if}
		</div>
	{:else}
		<div class={klass} style="width: {width}px; height: {height}px;">
			{#if isIntersecting || priority}
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
					loading={priority ? 'eager' : 'lazy'}
					fetchpriority={priority ? 'high' : 'auto'}
					decoding="async"
					data-nimg="1"
					height={+h}
					width={+w}
					class="h-full w-full object-contain object-center {klass}"
					class:opacity-0={!(loaded || priority)}
					class:opacity-100={loaded || priority}
					{...rest}
				/>
			{/if}
		</div>
	{/if}

	{#if showZoom}
		<!-- Lens: the region currently magnified in the side panel. -->
		<div
			class="pointer-events-none absolute z-10 border border-border bg-foreground/10"
			style="left: {lens.left}px; top: {lens.top}px; width: {lens.width}px; height: {lens.height}px;"
			aria-hidden="true"
		></div>
	{/if}
</div>

{#if showZoom && box && panel}
	{@const frame = `width: ${box.width * ZOOM}px; height: ${box.height * ZOOM}px; left: ${-lens.left * ZOOM}px; top: ${-lens.top * ZOOM}px;`}
	<!-- Zoom panel, rendered beside the image and portaled out of the carousel's clipped viewport. -->
	<div
		use:portal
		class="pointer-events-none fixed z-[80] overflow-hidden rounded-radius border border-border bg-background shadow-xl"
		style="left: {panel.left}px; top: {panel.top}px; width: {panel.width}px; height: {panel.height}px;"
		aria-hidden="true"
	>
		<!-- Cached display copy, so the panel is never empty while the hi-res one downloads. -->
		<img src={displaySrc} alt="" draggable="false" decoding="async" class="absolute max-w-none object-contain object-center" style={frame} />
		<img
			src={zoomSrc}
			alt=""
			draggable="false"
			decoding="async"
			onload={() => (zoomHiResLoaded = true)}
			class="absolute max-w-none object-contain object-center transition-opacity duration-200"
			class:opacity-0={!zoomHiResLoaded}
			style={frame}
		/>
	</div>
{/if}

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
