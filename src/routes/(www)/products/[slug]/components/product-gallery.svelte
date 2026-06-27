<script lang="ts">
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import * as Carousel from '$lib/components/ui/carousel/index.js'
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js'
	import { Play, X } from '@lucide/svelte'
	import { getSettingState } from '$lib/core/stores/index.js'
	import Button from '$lib/components/ui/button/button.svelte'
	import { cn } from '$lib/core/utils/index.js'
	import { getYoutubeId } from '$lib/core/logic/index.js'
	import { page } from '$app/state'

	let { images = [] } = $props()

	let carouselApi: CarouselAPI | null = $state(null)
	let mainCarouselApi: CarouselAPI | null = $state(null)
	let previewCarouselApi: CarouselAPI | null = $state(null)
	let carouselImages = $state<string[]>([])
	let currentIndex = $state(0)
	let previewVideoPaused = $state<{ [key: string]: boolean }>({})
	let displayCarousel = $state('hidden')
	let selectedImage = $state<string>('')
	const settingState = getSettingState()

	const [aspectWidth, aspectHeight] = $derived(page?.data?.store?.productImageAspectRatio?.split(':') || ['1', '1'])

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
		const index = images.indexOf(img)
		currentIndex = index
		selectedImage = img
		setTimeout(() => {
			if (carouselApi) {
				carouselApi.scrollTo(index, true)
			}
		}, 0)
	}

	const hideCarousel = () => {
		displayCarousel = 'hidden'
	}

	const videoURLRegex = /mp4$|webm$/
	const isVideoURL = (x: string) => videoURLRegex.test(x)
</script>

{#if displayCarousel !== 'hidden'}
	<style>
		body {
			overflow: hidden !important;
		}
	</style>
{/if}

<div class="flex flex-col-reverse gap-4 sm:flex-row">
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
			class="relative w-full h-[480px]"
		>
			<Carousel.Content class="-mt-2 h-[480px]">
				{#each images as img, idx}
					{@const youtubeId = getYoutubeId(img)}
					<Carousel.Item class="pt-2 basis-1/5">
						<div
							class={cn(
								'relative overflow-hidden rounded-radius border p-0.5 w-full aspect-square',
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
								<LazyImg src={img} alt="Product Image" class="w-full rounded-radius object-cover" />
							{/if}
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
      {#if images.length > 4}
			  <div class="hidden sm:block">
			  	<Carousel.Previous class="-top-4 left-1/2 -translate-x-1/2 rotate-90 size-7 [&>svg]:size-3.5" />
			  	<Carousel.Next class="-bottom-4 left-1/2 -translate-x-1/2 rotate-90 size-7 [&>svg]:size-3.5" />
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
			<Carousel.Content>
				{#each images as img, index}
					{@const youtubeId = getYoutubeId(img)}
					<Carousel.Item>
						<div
							class="sm:mb-5 sm:cursor-zoom-in"
							role="button"
							tabindex="0"
							onclick={() => showCarousel(img)}
							onkeydown={(e) => e.key === 'Enter' && showCarousel(img)}
						>
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
								<LazyImg src={img} alt="Product Image" class="w-full rounded-radius object-contain" />
							{/if}
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<div class="hidden sm:block">
				<Carousel.Previous class="-left-4 size-7 [&>svg]:size-3.5" />
				<Carousel.Next class="-right-4 size-7 [&>svg]:size-3.5" />
			</div>

			<!-- Mobile Pagination Dots -->
			<div class="mt-4 flex justify-center gap-1.5 sm:hidden">
				{#each images as _, i}
					<button
						class="h-1.5 rounded-full transition-all duration-300 {currentIndex === i ? 'w-6 bg-primary' : 'w-1.5 bg-gray-300'}"
						onclick={() => mainCarouselApi?.scrollTo(i)}
						aria-label="Go to slide {i + 1}"
					></button>
				{/each}
			</div>
		</Carousel.Root>
	</div>
</div>

<!-- Fullscreen view -->
<div class="fixed left-0 top-0 z-[100] {displayCarousel} h-[100dvh] w-screen flex-col items-center justify-start overflow-hidden bg-black">
	<!-- Background overlay -->
	<Button variant="ghost" class="absolute left-0 top-0 h-full w-full rounded-none hover:bg-transparent" onclick={hideCarousel}>
		<span class="sr-only">Close Carousel</span>
	</Button>

	<div class="relative mx-auto flex h-full w-full max-w-[1200px] items-center gap-4 px-4 py-[5vh]">
		<!-- Close button -->
		<Button
			variant="plain"
			size="icon"
			class="absolute right-0 top-4 z-30 rounded-full text-white hover:border hover:border-primary hover:bg-white/10"
			onclick={hideCarousel}
		>
			<X class="h-6 w-6" />
		</Button>

		<!-- Main carousel -->
		<div class="h-full flex-1 overflow-hidden">
			<Carousel.Root
				opts={{ loop: true }}
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
									<LazyImg src={img} alt="Product Image" class="max-h-[90vh]" />
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
						class="relative h-24  overflow-hidden rounded-radius p-0 {currentIndex === i ? 'ring-2 ring-primary ring-offset-2 ring-offset-black' : ''}"
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
							<LazyImg
								src={youtubeId ? `https://img.youtube.com/vi/${youtubeId}/default.jpg` : img}
								alt="Thumbnail"
								class="h-full w-full rounded-radius object-contain"
							/>
						{/if}
					</Button>
				{/each}
			</div>
		{/if}
	</div>
</div>
