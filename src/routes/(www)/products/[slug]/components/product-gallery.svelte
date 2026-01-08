<script lang="ts">
import LazyImg from '$lib/core/components/image/lazy-img.svelte'
import * as Carousel from '$lib/components/ui/carousel/index'
import type { CarouselAPI } from '$lib/components/ui/carousel/context'
import { Play, X } from 'lucide-svelte'
import { getSettingState } from '$lib/core/stores/setting.svelte'
import Button from '$lib/components/ui/button/button.svelte'
import { getYoutubeId } from '$lib/core/logic/youtube.helper'

let { images = [] } = $props()

const settingState = getSettingState()

let carouselApi: CarouselAPI | null = $state(null)
let currentIndex = $state(0)

let displayCarousel = $state('hidden')
let carouselImages = $state<string[]>([])
let selectedImage = $state<string>('')

let previewVideoPaused = $state<{ [key: string]: boolean }>({})

const onImageClick = (img: string) => {
	selectedImage = img
	showCarousel(img)
}

const rearrangeArray = (selectedItem: any, items: any[]) => {
	const index = items.indexOf(selectedItem)
	if (index !== -1) {
		return [...items.slice(index), ...items.slice(0, index)]
	}
	return items
}

const showCarousel = (img: string) => {
	carouselImages = rearrangeArray(img, images)
	displayCarousel = 'flex'
}

const hideCarousel = () => {
	displayCarousel = 'hidden'
}

const handleCaroselKeyboardNavigation = (e: KeyboardEvent) => {
	if (displayCarousel === 'hidden') return
	if (!carouselApi) return

	switch (e.code) {
		case 'ArrowUp':
			carouselApi.scrollPrev()
			break
		case 'ArrowDown':
			carouselApi.scrollNext()
			break
		case 'ArrowLeft':
			carouselApi.scrollPrev()
			break
		case 'ArrowRight':
			carouselApi.scrollNext()
			break
		case 'Escape':
			displayCarousel = 'hidden'
			break
	}
}

const videoURLRegex = /mp4$|webm$/
const isVideoURL = (x: string) => videoURLRegex.test(x)
</script>

<svelte:window onkeydown={handleCaroselKeyboardNavigation} />

{#if displayCarousel !== 'hidden'}
	<style>
		body {
			overflow: hidden !important;
		}
	</style>
{/if}

{#if images?.length === 1}
	<div class="mx-2 hidden grid-cols-1 sm:grid lg:mx-0">
		{#each images as img}
			{@const youtubeId = getYoutubeId(img)}
			<div
				class="relative overflow-hidden rounded-lg"
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
						class="aspect-square rounded-lg"
						src="https://www.youtube.com/embed/{youtubeId}?rel=0&modestbranding=1&playsinline=1"
						title="Video"
						frameborder="0"
						allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
						loading="lazy"
					></iframe>
        {:else if isVideoURL(img)}
          <video height="100%" width="50%" class="aspect-square w-1/2 rounded-lg" loop autoplay>
            <source src={img}>
            Video not supported
          </video>
				{:else}
					<LazyImg src={img} alt="Product Image" class=" w-1/2 object-cover transition-transform duration-300 hover:scale-105" />
				{/if}
			</div>
		{/each}
	</div>
{:else}
	<div class="mx-2 hidden grid-cols-2 gap-2 sm:grid lg:mx-0">
		{#each images as img}
			{@const youtubeId = getYoutubeId(img)}
			<div
				class="relative overflow-hidden rounded-lg"
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
						class="aspect-square rounded-lg"
						src="https://www.youtube.com/embed/{youtubeId}?rel=0&modestbranding=1&playsinline=1"
						title="Video"
						frameborder="0"
						allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
						loading="lazy"
					></iframe>
        {:else if isVideoURL(img)}
          <div class="w-full h-full relative flex justify-center items-center aspect-square">
            <video bind:paused={previewVideoPaused[img]} height="100%" width="100%" class="aspect-square absolute top-0 left-0 rounded-lg" loop autoplay muted>
              <source src={img}>
              Video not supported
            </video>
            {#if previewVideoPaused[img]}
              <div class="bg-white p-2 rounded-full z-10">
                <Play />
              </div>
            {/if}
          </div>
				{:else}
					<LazyImg src={img} alt="Product Image" class=" w-full object-cover transition-transform duration-300 hover:scale-105" />
				{/if}
			</div>
		{/each}
	</div>
{/if}

<div class="sm:hidden">
	<div class="">
		<Carousel.Root
			class="relative"
			opts={{ loop: true }}
			setApi={(api) => {
				if (api) carouselApi = api
				api?.on('select', (e) => {
					const selectedIndex = e?.selectedScrollSnap() || 0
					currentIndex = selectedIndex
				})
			}}
		>
			<Carousel.Content>
				{#each images || [] as img, index (index)}
          {@const youtubeId = getYoutubeId(img)}
					<Carousel.Item>
						<div
							class=""
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
					        class="aspect-square max-h-[420px] w-full rounded-lg"
					        src="https://www.youtube.com/embed/{youtubeId}?rel=0&modestbranding=1&playsinline=1"
					        title="Video"
					        frameborder="0"
					        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					        allowfullscreen
					        loading="lazy"
					      ></iframe>
              {:else if isVideoURL(img)}
                <video height="100%" width="100%" class="aspect-square rounded-lg" loop autoplay>
                  <source src={img}>
                  Video not supported
                </video>
              {:else}
							  <LazyImg src={img} alt="Product Image" class="max-h-[420px] w-full object-cover object-top" />
              {/if}
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
		</Carousel.Root>

		<div class="mt-2 flex justify-center">
			{#each images || [] as img, index (index)}
				<button
					class="mx-1 h-2 w-2 rounded-full bg-opacity-50 {index === currentIndex ? 'bg-black' : 'bg-gray-400'}"
					onclick={() => {
						currentIndex = index
						carouselApi?.scrollTo(index)
					}}
				>
					<span class="sr-only">Go to slide {index + 1}</span>
				</button>
			{/each}
		</div>
	</div>
</div>

<div class="fixed left-0 top-0 z-[60] {displayCarousel} h-screen w-screen flex-col items-center justify-start bg-black">
	<!-- Background overlay -->
	<button class="absolute left-0 top-0 h-full w-full" onclick={hideCarousel}>
		<span class="hidden">Close Carousel</span>
	</button>

	<div class="relative mx-auto flex h-screen max-w-[1200px] items-center gap-4 px-4 py-12">
		<!-- Close button -->
		<Button class="absolute right-6 top-6 z-30 h-10 w-10 p-0" onclick={hideCarousel}>
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
					        	class="aspect-square rounded-lg"
					        	src="https://www.youtube.com/embed/{youtubeId}?rel=0&modestbranding=1&playsinline=1"
					        	title="Video"
					        	frameborder="0"
					        	allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					        	allowfullscreen
					        	loading="lazy"
					        ></iframe>
              {:else if isVideoURL(img)}
                <video height="100%" width="100%" class="aspect-square rounded-lg" loop autoplay>
                  <source src={img}>
                  Video not supported
                </video>
                {:else}
								  <LazyImg
								  	src={img}
								  	alt="Product Image"
								  	class="aspect-[{settingState?.selectedStore?.productImageAspectRatio?.replace(
								  		':',
								  		'/'
								  	)}] !max-h-[calc(100vh-6rem)] w-full object-contain"
								  />
                {/if}
							</div>
						</Carousel.Item>
					{/each}
				</Carousel.Content>

				<div class="hidden md:block">
					<Carousel.Previous class="absolute left-2 top-1/2 z-30 h-10 w-10 -translate-y-1/2 transform bg-white/10 text-white hover:bg-white/20" />
					<Carousel.Next class="absolute right-2 top-1/2 z-30 h-10 w-10 -translate-y-1/2 transform bg-white/10 text-white hover:bg-white/20" />
				</div>
			</Carousel.Root>
		</div>

		<!-- Thumbnails on the right -->
		{#if carouselImages?.length > 0}
			<div
				class="hidden h-[calc(100vh-6rem)] min-w-[120px] max-w-[120px] flex-none items-center gap-2 overflow-y-auto py-2 scrollbar-thin md:flex md:flex-col"
			>
				{#each carouselImages || [] as img, i}
					{@const youtubeId = getYoutubeId(img)}
					<button
						class="relative aspect-square max-h-24 min-h-24 min-w-24 max-w-24 overflow-hidden rounded-lg bg-black transition-colors hover:ring-1 hover:ring-white hover:ring-offset-2 hover:ring-offset-black
								{currentIndex === i ? 'ring-1 ring-white ring-offset-2 ring-offset-black' : ''}"
						onclick={() => {
							if (carouselApi) {
								carouselApi.scrollTo(i)
								currentIndex = i
								selectedImage = img
							}
						}}
					>
            {#if isVideoURL(img)}
              <video height="100%" width="100%" class="aspect-square rounded-lg" loop autoplay>
                <source src={img}>
                Video not supported
              </video>
            {:else}
						  <LazyImg
						  	src={youtubeId ? `https://img.youtube.com/vi/${youtubeId}/default.jpg` : img}
						  	alt="Thumbnail"
						  	class="h-full w-full object-cover"
						  />
            {/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
