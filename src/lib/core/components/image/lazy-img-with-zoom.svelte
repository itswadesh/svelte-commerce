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

	const h = $derived(height === 'auto' ? '0' : +height * 2)
	const w = $derived(width === 'auto' ? '0' : +width * 2)

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
	let zoomPos = $state({ x: 50, y: 50 })

	if (extension === 'svg') {
		isSvg = true
	}

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

	function handleMouseMove(e: MouseEvent) {
		if (!containerRef) return
		const { left, top, width, height } = containerRef.getBoundingClientRect()
		const x = ((e.clientX - left) / width) * 100
		const y = ((e.clientY - top) / height) * 100
		zoomPos = { x, y }
	}
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<div
	bind:this={containerRef}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	onmousemove={handleMouseMove}
	class="relative w-full overflow-hidden bg-gray-50"
	style="aspect-ratio: {aspectWidth}/{aspectHeight}; {height !== 'auto' ? `height: ${height}px;` : ''} {width !== 'auto' ? `width: ${width}px;` : ''}"
>
	{#if !loaded || error}
		<div class="absolute inset-0 flex items-center justify-center bg-gray-50">
			<!-- <ImageIcon class="h-8 w-8 text-gray-400" /> -->
			<img class="animate-pulse" src="/images/emptyimage.png" alt="empty placeholder" />
		</div>
	{/if}

	{#if page?.data?.store?.plugins?.imageCdn?.active && !usingFallback}
		<div class={klass}>
			{#if isIntersecting}
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
					src={getImageCDNUrl(src)}
					height={+h}
					width={+w}
					class="h-full w-full object-contain object-center {klass}"
					class:opacity-0={!loaded}
					class:opacity-100={loaded}
					style:transform-origin="{zoomPos.x}% {zoomPos.y}%"
					style:transform={isHovered ? 'scale(2.5)' : 'scale(1)'}
					style:transition="transform 0.5s cubic-bezier(0.33, 1, 0.68, 1), transform-origin 0.15s ease-out"
					{...rest}
				/>
			{/if}
		</div>
	{:else}
		<div class={klass} style="width: {width}px; height: {height}px;">
			{#if isIntersecting}
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
					class:opacity-0={!loaded}
					class:opacity-100={loaded}
					style:transform-origin="{zoomPos.x}% {zoomPos.y}%"
					style:transform={isHovered ? 'scale(2.5)' : 'scale(1)'}
					style:transition="transform 0.5s cubic-bezier(0.33, 1, 0.68, 1), transform-origin 0.15s ease-out"
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
