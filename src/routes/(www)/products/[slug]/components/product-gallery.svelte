<script lang="ts">
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import * as Carousel from '$lib/components/ui/carousel/index.js'
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js'
	import { Play, X } from '@lucide/svelte'
	import { getSettingState } from '$lib/core/stores/index.js'
	import Button from '$lib/components/ui/button/button.svelte'
	import { cn } from '$lib/core/utils'
	import { getYoutubeId } from '$lib/core/logic/index.js'
	import LazyImgWithZoom from '$lib/core/components/image/lazy-img-with-zoom.svelte'

	let { images = [] } = $props()

	let carouselApi: CarouselAPI | null = $state(null)
	let mainCarouselApi: CarouselAPI | null = $state(null)
	let carouselImages = $state<string[]>([])
	let currentIndex = $state(0)
	let previewVideoPaused = $state<{ [key: string]: boolean }>({})
	let displayCarousel = $state('hidden')
	let selectedImage = $state<string>('')
	const settingState = getSettingState()

	const onImageClick = (img: string) => {
		selectedImage = img
		currentIndex = images.indexOf(img)
	}

	$effect(() => {
		if (mainCarouselApi && mainCarouselApi.selectedScrollSnap() !== currentIndex) {
			mainCarouselApi.scrollTo(currentIndex)
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
	<div class="hidden sm:flex sm:w-24 sm:flex-col gap-4">
		{#each images as img, idx}
			{@const youtubeId = getYoutubeId(img)}
			<div
				class={cn(
					'relative rounded-radius overflow-hidden border max-sm:inline-block max-sm:min-w-20 max-sm:max-w-20 p-0.5',
					idx === currentIndex ? 'border-primary': 'border-muted'
				)}
				role="button"
				tabindex="0"
				onclick={() => onImageClick?.(img)}
				onkeydown={(e) => e.key === 'Enter' && onImageClick?.(img)}
				aria-label="View full image"
			>
				{#if youtubeId}
					<iframe
						width="50%"
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
					<LazyImg src={img} alt="Product Image" class=" w-full rounded-radius object-cover" />
				{/if}
			</div>
		{/each}
	</div>

	<div class="flex-1">
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
								<LazyImg
									src={img}
									alt="Product Image"
									class="w-full rounded-radius object-cover"
								/>
							{/if}
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<div class="hidden sm:block">
				<Carousel.Previous class="-left-4" />
				<Carousel.Next class="-right-4" />
			</div>

			<!-- Mobile Pagination Dots -->
			<div class="flex justify-center gap-1.5 mt-4 sm:hidden">
				{#each images as _, i}
					<button
						class="h-1.5 rounded-full transition-all duration-300 {currentIndex === i ? 'bg-primary w-6' : 'bg-gray-300 w-1.5'}"
						onclick={() => mainCarouselApi?.scrollTo(i)}
						aria-label="Go to slide {i + 1}"
					></button>
				{/each}
			</div>
		</Carousel.Root>
	</div>
</div>

<div
	class="fixed left-0 top-0 z-[100] {displayCarousel} h-screen w-screen flex-col items-center justify-start bg-black"
>
	<!-- Background overlay -->
	<Button
		variant="ghost"
		class="absolute left-0 top-0 h-full w-full rounded-none hover:bg-transparent"
		onclick={hideCarousel}
	>
		<span class="sr-only">Close Carousel</span>
	</Button>

	<div class="relative mx-auto flex h-screen max-w-[1200px] items-center gap-4 px-4 py-12">
		<!-- Close button -->
		<Button
			variant="plain"
			size="icon"
			class="absolute right-0 top-4 hover:border hover:border-primary rounded-full z-30 text-white hover:bg-white/10"
			onclick={hideCarousel}
		>
			<X class="h-6 w-6" />
		</Button>

		<!-- Main carousel -->
		<div class="flex-1">
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
				class="relative w-full"
			>
				<Carousel.Content>
					{#each carouselImages || [] as img, index (index)}
						{@const youtubeId = getYoutubeId(img)}
						<Carousel.Item>
							<div class="flex h-[calc(100vh-6rem)] items-center justify-center">
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
										alt="Product Image"
										class="!max-h-[calc(100vh-6rem)] rounded-radius w-full object-contain"
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
			<div
				class="hidden h-[calc(100vh-6rem)] min-w-[120px] max-w-[120px] flex-none items-center gap-2 overflow-y-auto py-2 scrollbar-thin md:flex md:flex-col"
			>
				{#each carouselImages || [] as img, i}
					{@const youtubeId = getYoutubeId(img)}
					<Button
						variant="ghost"
						class="relative aspect-square h-24 w-24 overflow-hidden rounded-radius p-0 {currentIndex === i ? 'ring-2 ring-primary ring-offset-2 ring-offset-black' : ''}"
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
								class="h-full w-full rounded-radius object-cover"
							/>
						{/if}
					</Button>
				{/each}
			</div>
		{/if}
	</div>
</div>
