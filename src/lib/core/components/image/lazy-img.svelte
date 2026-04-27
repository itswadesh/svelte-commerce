<script lang="ts">
	import { fade } from 'svelte/transition'
	import { onMount } from 'svelte'
	import { Image as ImageIcon } from '@lucide/svelte'
	import { page } from '$app/state'
  import { getImageCDNUrl } from '@misiki/kitcommerce-core/utils';

	let {
		class: klass,
		alt = '',
		height = 'auto',
		src = '',
		aspectRatio = page?.data?.store?.productImageAspectRatio,
		width = 'auto',
		loading = 'lazy',
		fetchpriority = 'auto',
		...rest
	}: {
		class?: string
		alt?: string
		height?: string | number
		src?: string
		aspectRatio?: string
		width?: string | number
		loading?: 'lazy' | 'eager'
		fetchpriority?: 'auto' | 'high' | 'low'
		[key: string]: any
	} = $props()

	const h = $derived(height === 'auto' ? '0' : +height * 2)
	const w = $derived(width === 'auto' ? '0' : +width * 2)

	const [aspectWidth, aspectHeight] = $derived(aspectRatio?.split(':') || ['1', '1'])

	const extension = $derived(src?.split('.').pop())

	let loaded = $state(false)
	let error = $state(false)
	let isIntersecting = $state(false)
	let containerRef: HTMLDivElement
	let usingFallback = $state(false) // Track if we're using fallback

  //$inspect(page?.data?.store, usingFallback)
	// Transparent placeholder
	const transparentPlaceholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

	let observer: IntersectionObserver

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					isIntersecting = entry.isIntersecting
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
	class="relative w-full bg-gray-50"
	style="aspect-ratio: {aspectWidth}/{aspectHeight}; {height !== 'auto' ? `height: ${height}px;` : ''} {width !== 'auto' ? `width: ${width}px;` : ''}"
>
	{#if !loaded || error}
		<div class="absolute inset-0 flex items-center justify-center bg-gray-50">
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
					{fetchpriority}
					decoding="async"
					data-nimg="1"
					{loading}
					src={getImageCDNUrl(src)}
					height={+h}
					width={+w}
					class="h-full w-full object-contain object-center transition-opacity duration-300 {klass}"
					class:opacity-0={!loaded}
					class:opacity-100={loaded}
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
					{loading}
					{fetchpriority}
					decoding="async"
					data-nimg="1"
					height={+h}
					width={+w}
					class="h-full w-full object-contain object-center transition-opacity duration-300 {klass}"
					class:opacity-0={!loaded}
					class:opacity-100={loaded}
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

