<script lang="ts">
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { getYoutubeId } from '$lib/core/logic/index.js'
	import * as Carousel from '$lib/components/ui/carousel/index.js'
	import { onMount } from 'svelte'

	const { block } = $props()
	$inspect(block)
	const [aspectWidth, aspectHeight] = $derived(block.metadata.aspectRatio?.split(':') || ['1', '1'])

	let mainCarouselApi: CarouselAPI | null = $state(null)
	let currentIndex = $state(0)

	const videoURLRegex = /mp4$|webm$/
	const isVideoURL = (x: string) => videoURLRegex.test(x)

	onMount(() => {
		if (block.metadata.autoScroll) {
			const intervalId = setInterval(() => {
				mainCarouselApi?.scrollTo((currentIndex + 1) % block.metadata.images?.length)
			}, block.metadata.autoScrollInterval || 2000)

			return () => {
				clearInterval(intervalId)
			}
		}
	})
</script>

<div
	style="aspect-ratio: {aspectWidth}/{aspectHeight}; {block.metadata.maxWidth ? `max-width: ${block.metadata.maxWidth}px;` : ``} {block.metadata
		.maxHeight
		? ` max-height: ${block.metadata.maxHeight}px;`
		: ``}"
	class="flex-1"
>
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
			{#each block.metadata.images || [] as img, index}
				{@const youtubeId = getYoutubeId(img.file)}
				<Carousel.Item>
					<div role="button" tabindex="0">
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
						{:else if isVideoURL(img.file)}
							<video height="100%" width="100%" class="aspect-square w-full" loop autoplay muted>
								<source src={img.file} />
								Video not supported
							</video>
						{:else}
							<LazyImg src={img.file} aspectRatio={block.metadata.aspectRatio} alt="Product Image" class="w-full rounded-radius" />
						{/if}
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		{#if block.metadata.showScrollButtons}
			<Carousel.Previous class="-left-1 md:-left-4" />
			<Carousel.Next class="-right-1 md:-right-4" />
		{/if}

		<!-- Mobile Pagination Dots -->
		{#if block.metadata.showCarouselIndicators}
			<div class="mt-3 flex justify-center gap-1.5">
				{#each block.metadata.images || [] as _, i}
					<button
						class="h-1.5 rounded-full transition-all duration-300 {currentIndex === i ? 'w-6 bg-primary' : 'w-1.5 bg-muted'}"
						onclick={() => mainCarouselApi?.scrollTo(i)}
						aria-label="Go to slide {i + 1}"
					></button>
				{/each}
			</div>
		{/if}
	</Carousel.Root>
</div>
