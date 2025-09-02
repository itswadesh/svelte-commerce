<script lang="ts">
	import { onMount } from 'svelte'
	import EmblaCarousel from 'embla-carousel'
	import AutoScroll from 'embla-carousel-auto-scroll'
	import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
	import { ReelsService } from '$lib/core/services'

	let reels = $state()

	let emblaNode
	let emblaApi
	let videos = $state([])
	let currentIndex = $state(0)
	let isPlaying = $state(true)
	let isMuted = $state(true)

	// Function to handle video playback
	function handleVideoPlayback(index) {
		videos.forEach((video, i) => {
			if (i === index) {
				if (isPlaying) {
					video.play().catch(() => {
						// Autoplay prevented, add a play button
						video.dataset.needsUserAction = true
					})
				} else {
					video.pause()
				}
			} else {
				video.pause()
				video.currentTime = 0
			}
		})
	}

	function togglePlay() {
		isPlaying = !isPlaying
		handleVideoPlayback(currentIndex)
	}

	function toggleMute() {
		isMuted = !isMuted
		videos.forEach((video) => {
			video.muted = isMuted
		})
	}
	const load = async () => {
		try {
			// For development, return sample data
			// In production, uncomment the following line:
			const reelsdata = await reelsService.list()

			reels = reelsdata.data
		} catch (e) {
			console.error('Error loading reels:', e)
			throw error(400, e?.message || 'Error loading reels')
		}
	}

	onMount(() => {
		// Initialize Embla Carousel
		emblaApi = EmblaCarousel(
			emblaNode,
			{
				axis: 'y',
				loop: true,
				dragFree: false, // Disable dragFree for better snapping
				containScroll: 'trimSnaps',
				skipSnaps: false, // Ensure it always snaps to slides
				duration: 20, // Faster snap animation
				startIndex: 0,
				align: 'center'
			},
			[WheelGesturesPlugin(), AutoScroll({ playOnInit: false })]
		)

		// Get all video elements
		videos = emblaNode.querySelectorAll('video')

		// Handle slide changes
		emblaApi.on('select', () => {
			currentIndex = emblaApi.selectedScrollSnap()
			handleVideoPlayback(currentIndex)
		})
		load()
		// Start with the first video
		handleVideoPlayback(0)

		return () => {
			if (emblaApi) emblaApi.destroy()
		}
	})

	// Handle manual play button click
	function handlePlayClick(video) {
		video.play()
		video.dataset.needsUserAction = false
	}
</script>

<svelte:head>
	<title>Reels</title>
</svelte:head>
<div class="fixed inset-0 bg-black">
	<div class="relative h-full w-full" bind:this={emblaNode}>
		<div class="h-full">
			{#each reels as reel}
				<div class="relative h-full w-full snap-y snap-mandatory snap-always">
					<div class="absolute inset-0 flex items-center justify-center">
						<video
							class="h-full w-full object-cover"
							src={reel.link}
							loop
							muted={isMuted}
							playsinline
							onclick={(e) => {
								if (e.target.dataset.needsUserAction) {
									handlePlayClick(e.target)
								}
							}}
						>
							<track kind="captions" />
						</video>

						<!-- Play button overlay (shown when autoplay is prevented) -->
						{#if videos[currentIndex]?.dataset?.needsUserAction}
							<button
								class="absolute inset-0 flex items-center justify-center bg-black/50 text-white"
								onclick={() => handlePlayClick(videos[currentIndex])}
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" viewBox="0 0 24 24" fill="currentColor">
									<path d="M8 5v14l11-7z" />
								</svg>
							</button>
						{/if}

						<!-- Video Controls Overlay -->
						<div class="absolute bottom-20 right-4 flex flex-col gap-4">
							<button class="rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-black/30" onclick={togglePlay}>
								{#if isPlaying}
									<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M6 4h4v16H6zM14 4h4v16h-4z" />
									</svg>
								{:else}
									<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M5 3l14 9-14 9V3z" />
									</svg>
								{/if}
							</button>

							<button class="rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-black/30" onclick={toggleMute}>
								{#if isMuted}
									<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M11 5L6 9H2v6h4l5 4V5z" />
										<path d="M23 9l-6 6" />
										<path d="M17 9l6 6" />
									</svg>
								{:else}
									<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M11 5L6 9H2v6h4l5 4V5z" />
										<path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
									</svg>
								{/if}
							</button>
						</div>

						<!-- Video Info Overlay -->
						<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
							<h3 class="text-lg font-semibold">{reel.name}</h3>
							<p class="text-sm opacity-90">{reel.productId}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Navigation Buttons -->
	<!-- <button
        class="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
        onclick={() => emblaApi?.scrollPrev()}
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" />
        </svg>
    </button>
    
    <button
        class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
        onclick={() => emblaApi?.scrollNext()}
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6" />
        </svg>
    </button> -->
</div>

<style>
	:global(.embla) {
		overflow: hidden;
	}
	:global(.embla__container) {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	:global(.embla__slide) {
		flex: 0 0 100%;
		min-width: 0;
		height: 100%;
	}
</style>
