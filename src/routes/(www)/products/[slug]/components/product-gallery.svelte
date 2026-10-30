<script lang="ts" module>
	/**
	 * The main image's rendered width: the full content column on phones and tablets, half of it
	 * from 1024px where the purchase panel sits beside the gallery. Exported so the LCP preload in
	 * product-gallery-section.svelte offers the same candidates and sizes as the image itself.
	 */
	export const GALLERY_IMAGE_SIZES = '(min-width: 1024px) 50vw, 100vw'
</script>

<script lang="ts">
	import { onMount } from 'svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import * as Carousel from '$lib/components/ui/carousel/index.js'
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js'
	import { Play, X } from '@lucide/svelte'
	import { getSettingState } from '$lib/core/stores/index.js'
	import Button from '$lib/components/ui/button/button.svelte'
	import { cn } from '$lib/core/utils/index.js'
	import { getYoutubeId } from '$lib/core/logic/index.js'
	import { page } from '$app/state'
	import { themeOptions } from '$lib/composer/theme-options.js'
	import { productBadge } from '$lib/product/badge.js'
	import { dialog } from '$lib/actions/dialog'
	import { fade } from '$lib/motion'

	let { images = [] } = $props()

	// The label and the rating on the picture, as on the cards: from the product's own data, and
	// nothing without it. The rating is the reviews this page lists, so the two always agree.
	const options = $derived(themeOptions(page.data?.themeSettings))
	const badge = $derived(productBadge(page.data?.product, options.card_badge))
	const ratings = $derived<{ rating?: number }[]>(Array.isArray(page.data?.product?.ratings) ? page.data.product.ratings : [])
	const ratingScore = $derived(
		ratings.length ? Math.floor((ratings.reduce((sum, r) => sum + (Number(r?.rating) || 0), 0) / ratings.length) * 10) / 10 : 0
	)

	let carouselApi: CarouselAPI | null = $state(null)
	let mainCarouselApi: CarouselAPI | null = $state(null)
	let previewCarouselApi: CarouselAPI | null = $state(null)
	let carouselImages = $state<string[]>([])
	let currentIndex = $state(0)
	let previewVideoPaused = $state<{ [key: string]: boolean }>({})
	let displayCarousel = $state('hidden')
	let selectedImage = $state<string>('')
	const settingState = getSettingState()

	/**
	 * Slides past the first are gated behind an IntersectionObserver, and in a carousel they sit
	 * offscreen horizontally — so their request did not start until the shopper swiped, and every
	 * swipe cost a full round trip against the placeholder. Once the page has gone idle, with the
	 * LCP element and the initial fetches already done, turn the rest on. They fetch at
	 * `fetchpriority="low"`, so swiping becomes instant without taking bandwidth from first paint.
	 * Slide 0 keeps `priority` and is untouched.
	 */
	let preloadRest = $state(false)
	onMount(() => {
		// The timeout is load-bearing. A bare requestIdleCallback can be starved indefinitely when
		// the main thread never goes idle, which is the slow-connection case this preload exists
		// for — so without it the fix would do nothing for the shoppers who need it most.
		// Called on `window` rather than through a detached reference: a bare `rIC(...)` invokes it
		// with an undefined receiver, which some engines reject as an illegal invocation.
		if (typeof window.requestIdleCallback === 'function') {
			const id = window.requestIdleCallback(() => (preloadRest = true), { timeout: 2500 })
			return () => window.cancelIdleCallback?.(id)
		}
		const t = setTimeout(() => (preloadRest = true), 1500)
		return () => clearTimeout(t)
	})

	const [aspectWidth, aspectHeight] = $derived(page?.data?.store?.productImageAspectRatio?.split(':') || ['1', '1'])
	// The shop's picture shape (D128), as on the cards; the store record's ratio when it set none.
	const frameStyle = $derived(`aspect-ratio: var(--product-image-ratio, ${aspectWidth} / ${aspectHeight});`)

	const onImageClick = (img: string) => {
		selectedImage = img
		currentIndex = images.indexOf(img)
	}

	$effect(() => {
		if (mainCarouselApi && mainCarouselApi.selectedScrollSnap() !== currentIndex) {
			mainCarouselApi.scrollTo(currentIndex)
		}
		if (previewCarouselApi && previewCarouselApi.selectedScrollSnap() !== currentIndex) {
			previewCarouselApi.scrollTo(currentIndex)
		}
	})

	const rearrangeArray = (selectedItem: any, items: any[]) => {
		const index = items.indexOf(selectedItem)
		if (index !== -1) {
			return [...items.slice(index), ...items.slice(0, index)]
		}
		return items
	}

	const showCarousel = (img: string) => {
		carouselImages = images
		displayCarousel = 'flex'
		currentIndex = images.indexOf(img)
		selectedImage = img
	}

	const hideCarousel = () => {
		displayCarousel = 'hidden'
		// The page's pictures follow the gallery, so the one showing now takes focus back, not the
		// one that opened it (use:dialog leaves focus where this puts it).
		document.querySelector<HTMLElement>('[data-vt-gallery-primary]')?.focus({ preventScroll: true })
	}

	const onGalleryKeydown = (e: KeyboardEvent) => {
		if (e.key === 'ArrowLeft') carouselApi?.scrollPrev()
		else if (e.key === 'ArrowRight') carouselApi?.scrollNext()
		else return
		e.preventDefault()
	}

	const videoURLRegex = /mp4$|webm$/
	// A connector that knows which entries are videos says so (GoCommerce D134); a .mov upload or a
	// link with no extension is still a video, never a broken <img>.
	const knownVideos = $derived(new Set<string>(Array.isArray(page.data?.product?.videos) ? page.data.product.videos : []))
	const isVideoURL = (x: string) => knownVideos.has(x) || videoURLRegex.test(x)
</script>

{#if displayCarousel !== 'hidden'}
	<style>
		body {
			overflow: hidden !important;
		}
	</style>
{/if}

{#snippet overlays()}
	{#if badge}
		<span class="edp-gallery__badge" data-testid="product-gallery-badge">{badge}</span>
	{/if}
	{#if ratingScore > 0}
		<a href="#reviews" class="edp-gallery__rating" aria-label="Rated {ratingScore} out of 5 from {ratings.length} {ratings.length === 1 ? 'review' : 'reviews'}">
			<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"
				><path
					fill="currentColor"
					d="M5.58 1.15a.5.5 0 0 1 .84 0l1.528 2.363a.5.5 0 0 0 .291.212l2.72.722a.5.5 0 0 1 .26.799L9.442 7.429a.5.5 0 0 0-.111.343l.153 2.81a.5.5 0 0 1-.68.493L6.18 10.063a.5.5 0 0 0-.36 0l-2.625 1.014a.5.5 0 0 1-.68-.494l.153-2.81a.5.5 0 0 0-.11-.343L.781 5.246a.5.5 0 0 1 .26-.799l2.719-.722a.5.5 0 0 0 .291-.212L5.58 1.149Z"
				/></svg
			>
			<span>{ratingScore.toFixed(1)}</span>
			<span class="edp-gallery__rating-count">| {ratings.length}</span>
		</a>
	{/if}
{/snippet}

<!-- The store's pdp_gallery: a carousel everywhere, or on a desktop a two-column grid of every
     picture, the way the reference lays a product out. -->
{#if options.pdp_gallery === 'grid'}
	<div class="edp-gallery-grid hidden grid-cols-2 gap-2 lg:grid">
		{#each images.filter((img: string) => !getYoutubeId(img) && !isVideoURL(img)) as img, index (img)}
			<button type="button" class="edp-gallery__frame relative overflow-hidden rounded-radius" style={frameStyle} onclick={() => showCarousel(img)}>
				<span class="sr-only">View picture {index + 1} full screen</span>
				<LazyImg
					src={img}
					alt={`${page.data?.product?.title || page.data?.product?.name || 'Product image'} - View ${index + 1}`}
					class="h-full w-full"
					sizes="(min-width: 1024px) 25vw, 50vw"
					priority={index === 0}
				/>
				{#if index === 0}
					{@render overlays()}
				{/if}
			</button>
		{/each}
	</div>
{/if}

<div class="edp-gallery flex flex-col-reverse gap-4 sm:flex-row" class:lg:hidden={options.pdp_gallery === 'grid'}>
	<!-- Preview images -->
	<div class="hidden sm:flex sm:w-24 sm:flex-col">
		<Carousel.Root
			opts={{ align: 'start', loop: true }}
			orientation="vertical"
			setApi={(api) => {
				if (api) {
					previewCarouselApi = api
				}
			}}
			class="relative h-[480px] w-full"
		>
			<Carousel.Content class="-mt-2 h-[480px]">
				{#each images as img, idx}
					{@const youtubeId = getYoutubeId(img)}
					<Carousel.Item class="basis-1/5 pt-2">
						<div
							class={cn(
								'relative aspect-square w-full overflow-hidden rounded-radius border p-0.5',
								idx === currentIndex ? 'border-primary' : 'border-muted'
							)}
							role="button"
							tabindex="0"
							onclick={() => onImageClick?.(img)}
							onkeydown={(e) => e.key === 'Enter' && onImageClick?.(img)}
							aria-label="View full image"
						>
							{#if youtubeId}
								<iframe
									width="100%"
									height="100%"
									class="aspect-square"
									src="https://www.youtube.com/embed/{youtubeId}?rel=0&modestbranding=1&playsinline=1"
									title="Video"
									frameborder="0"
									allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowfullscreen
									loading="lazy"
								></iframe>
							{:else if isVideoURL(img)}
								<video height="100%" width="100%" class="aspect-square w-full" loop autoplay>
									<source src={img} />
									Video not supported
								</video>
							{:else}
								<!-- Keyed so the thumbnail fully re-renders when a variant change swaps the image URL. -->
								{#key img}
									<!-- The rail is `sm:w-24` and hidden below sm, so 96px is the real rendered
									     width. Without `sizes` LazyImg emits no srcset and every thumbnail pulls
									     the 1280px render. -->
									<LazyImg
										src={img}
										alt={`${page.data?.product?.title || page.data?.product?.name || 'Product'} - Thumbnail ${idx + 1}`}
										class="w-full rounded-radius object-cover"
										sizes="96px"
									/>
								{/key}
							{/if}
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			{#if images.length > 4}
				<div class="hidden sm:block">
					<Carousel.Previous class="-top-4 left-1/2 size-7 -translate-x-1/2 rotate-90 [&>svg]:size-3.5" />
					<Carousel.Next class="-bottom-4 left-1/2 size-7 -translate-x-1/2 rotate-90 [&>svg]:size-3.5" />
				</div>
			{/if}
		</Carousel.Root>
	</div>

	<div class="flex-1">
		<!-- Main Preview Image -->
		<Carousel.Root
			opts={{ loop: true }}
			setApi={(api) => {
				if (api) {
					mainCarouselApi = api
					api.on('select', () => {
						currentIndex = api.selectedScrollSnap()
					})
				}
			}}
			class="relative w-full"
		>
			<div class="relative">
			<Carousel.Content>
				{#each images as img, index}
					{@const youtubeId = getYoutubeId(img)}
					<Carousel.Item>
						<div
							data-vt-gallery-primary={index === currentIndex ? '' : undefined}
							class="sm:mb-5 sm:cursor-pointer"
							role="button"
							tabindex="0"
							onclick={() => showCarousel(img)}
							onkeydown={(e) => {
								// Handled here: focus moves into the gallery before the key's keypress, which
								// would otherwise press the gallery's close button.
								if (e.key !== 'Enter' && e.key !== ' ') return
								e.preventDefault()
								showCarousel(img)
							}}
						>
							<span class="sr-only">View full-screen gallery</span>
							{#if youtubeId}
								<div class="relative aspect-square w-full">
									<iframe
										width="100%"
										height="100%"
										class="aspect-square"
										src="https://www.youtube.com/embed/{youtubeId}?rel=0&modestbranding=1&playsinline=1"
										title="Video"
										frameborder="0"
										allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowfullscreen
										loading="lazy"
									></iframe>
								</div>
							{:else if isVideoURL(img)}
								<video height="100%" width="100%" class="aspect-square w-full" loop autoplay muted>
									<source src={img} />
									Video not supported
								</video>
							{:else}
								<!-- Keyed so the image fully re-renders when a variant change swaps the image URL.
								     No hover zoom: clicking opens the full-screen gallery, which is the same
								     look-closer affordance without a lens following the cursor. -->
									{#key img}
									<div class="edp-gallery__frame overflow-hidden rounded-radius" style={frameStyle}>
										<LazyImg
											src={img}
											alt={`${page.data?.product?.title || page.data?.product?.name || 'Product image'} - View ${index + 1}`}
											class="h-full w-full"
											sizes={GALLERY_IMAGE_SIZES}
											priority={index === 0}
											eager={preloadRest}
										/>
									</div>
								{/key}
							{/if}
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			{@render overlays()}
			</div>
			<div class="hidden sm:block">
				<Carousel.Previous class="-left-4 size-7 [&>svg]:size-3.5" />
				<Carousel.Next class="-right-4 size-7 [&>svg]:size-3.5" />
			</div>

			<!-- Mobile Pagination Dots -->
			<div class="mt-4 flex justify-center sm:hidden">
				{#each images as _, i}
					<!-- The button is the 24px target; the 6px dot inside it is the indicator. -->
					<button class="grid h-6 min-w-6 place-items-center" onclick={() => mainCarouselApi?.scrollTo(i)} aria-label="Go to slide {i + 1}">
						<span class="h-1.5 rounded-full transition-colors duration-fast {currentIndex === i ? 'w-6 bg-foreground' : 'w-1.5 bg-border-strong'}"></span>
					</button>
				{/each}
			</div>
		</Carousel.Root>
	</div>
</div>

<!-- Fullscreen view. Mounted only while open, so use:dialog moves focus in, keeps Tab inside, closes
     on Escape and hands focus back to the page; the arrows step the pictures. -->
{#if displayCarousel !== 'hidden'}
<div
	transition:fade
	role="dialog"
	aria-modal="true"
	aria-label="Product pictures"
	tabindex="-1"
	use:dialog={hideCarousel}
	onkeydown={onGalleryKeydown}
	class="fixed left-0 top-0 z-[100] flex h-[100dvh] w-screen flex-col items-center justify-start overflow-hidden bg-black"
>
	<!-- A click outside the picture closes; the keyboard has Escape and the close button. -->
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="absolute left-0 top-0 h-full w-full" aria-hidden="true" onclick={hideCarousel}></div>

	<div class="relative mx-auto flex h-full w-full max-w-[1200px] items-center gap-4 px-4 py-[5vh]">
		<!-- Close button -->
		<Button
			variant="plain"
			size="icon"
			class="absolute right-0 top-4 z-30 rounded-full text-white hover:border hover:border-primary hover:bg-white/10"
			onclick={hideCarousel}
		>
			<X class="h-6 w-6" />
			<span class="sr-only">Close</span>
		</Button>

		<!-- Main carousel -->
		<div class="h-full flex-1 overflow-hidden">
			<Carousel.Root
				opts={{ loop: true, startIndex: currentIndex }}
				setApi={(api) => {
					if (api) {
						carouselApi = api
						api.on('select', () => {
							currentIndex = api.selectedScrollSnap()
							selectedImage = carouselImages[currentIndex]
						})
					}
				}}
				class="relative h-full w-full"
			>
				<Carousel.Content class="h-full">
					{#each carouselImages || [] as img, index (index)}
						{@const youtubeId = getYoutubeId(img)}
						<Carousel.Item class="">
							<div class="">
								{#if youtubeId}
									<iframe
										width="100%"
										height="100%"
										class="aspect-square rounded-radius"
										src="https://www.youtube.com/embed/{youtubeId}?rel=0&modestbranding=1&playsinline=1"
										title="Video"
										frameborder="0"
										allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowfullscreen
										loading="lazy"
									></iframe>
								{:else if isVideoURL(img)}
									<video height="100%" width="100%" class="aspect-square rounded-lg" loop autoplay>
										<source src={img} />
										Video not supported
									</video>
								{:else}
									<LazyImg
										src={img}
										alt={`${page.data?.product?.title || page.data?.product?.name || 'Product image'} - View ${index + 1}`}
										class="max-h-[90vh]"
									/>
								{/if}
							</div>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
			</Carousel.Root>
		</div>

		<!-- Thumbnails on the right -->
		{#if carouselImages?.length > 0}
			<div class="hidden h-full min-w-[160px] max-w-[160px] flex-none items-center gap-2 overflow-y-auto py-2 scrollbar-thin md:flex md:flex-col">
				{#each carouselImages || [] as img, i}
					{@const youtubeId = getYoutubeId(img)}
					<Button
						variant="ghost"
						style="aspect-ratio: {aspectWidth}/{aspectHeight};"
						class="relative h-24  overflow-hidden rounded-radius p-0 {currentIndex === i
							? 'ring-2 ring-primary ring-offset-2 ring-offset-black'
							: ''}"
						onclick={() => {
							if (carouselApi) {
								carouselApi.scrollTo(i)
								currentIndex = i
								selectedImage = img
							}
						}}
					>
						{#if isVideoURL(img)}
							<video height="100%" width="100%" class="aspect-square rounded-radius" loop autoplay>
								<source src={img} />
								Video not supported
							</video>
						{:else}
							<!-- Lightbox rail buttons are h-24 (96px) with a square-ish aspect ratio. -->
							<LazyImg
								src={youtubeId ? `https://img.youtube.com/vi/${youtubeId}/default.jpg` : img}
								alt={`${page.data?.product?.title || page.data?.product?.name || 'Product'} - Gallery Thumbnail ${i + 1}`}
								class="h-full w-full rounded-radius object-contain"
								sizes="96px"
							/>
						{/if}
					</Button>
				{/each}
			</div>
		{/if}
	</div>
</div>
{/if}

<style>
	/* Refined Editorial — default theme only. Clean gallery: warm media wells,
	   editorial radius, hairline thumbnail borders (selected keeps primary). */
	:global([data-theme='default'] .edp-gallery .rounded-radius) {
		border-radius: var(--ed-radius);
	}

	:global([data-theme='default'] .edp-gallery .border-muted) {
		border-color: var(--ed-line);
	}

	/* LazyImg draws its own ratio box; the frame's ratio (the shop's) wins, as on the cards. */
	.edp-gallery__frame :global(> .w-full) {
		height: 100%;
	}

	.edp-gallery__frame :global(img) {
		object-fit: var(--product-image-fit, contain);
	}

	/* A phone shows the picture edge to edge, the product before the page's margins. */
	@media (max-width: 639px) {
		:global([data-theme='default']) .edp-gallery {
			margin-inline: calc(-1 * var(--container-gutter));
		}

		:global([data-theme='default']) .edp-gallery .edp-gallery__frame {
			border-radius: 0;
		}
	}

	.edp-gallery__badge,
	.edp-gallery__rating {
		position: absolute;
		left: 12px;
		z-index: 2;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		max-width: calc(100% - 24px);
		padding: 4px 8px;
		background: hsl(var(--card) / 0.92);
		color: hsl(var(--foreground));
		font-size: var(--type-dense, 0.8125rem);
		font-weight: 600;
		line-height: 1.2;
	}

	.edp-gallery__badge {
		top: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		border-radius: max(0px, calc(var(--radius) - 4px));
	}

	.edp-gallery__rating {
		bottom: 12px;
		min-height: 28px;
		border-radius: 999px;
		font-variant-numeric: tabular-nums;
		transition: transform var(--motion-fast) var(--motion-ease);
	}

	/* From 640px each slide keeps a 20px margin under its picture (`sm:mb-5`); the pill stays on the
	   picture, not on that margin. */
	@media (min-width: 640px) {
		.edp-gallery .edp-gallery__rating {
			bottom: 32px;
		}
	}

	.edp-gallery__rating svg {
		color: hsl(var(--warning));
	}

	.edp-gallery__rating-count {
		font-weight: 500;
		color: hsl(var(--muted-foreground));
	}

	.edp-gallery__rating:active {
		transform: scale(0.96);
	}

	@media (prefers-reduced-motion: reduce) {
		.edp-gallery__rating:active {
			transform: none;
		}
	}
</style>
