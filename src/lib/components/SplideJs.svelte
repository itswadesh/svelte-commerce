<script lang="ts">
import '@splidejs/svelte-splide/css'
import { Splide, SplideTrack } from '@splidejs/svelte-splide'
import { createEventDispatcher } from 'svelte'

const dispath = createEventDispatcher()

export let currentImageIndex = 0
export let options = {}
export let showProgressBar = false
export let totalImagesLength = 0

function handleMove(e) {
	currentImageIndex = e.detail.index

	dispath('handleMove', { index: e.detail.index, prev: e.detail.prev })
}
</script>

<Splide
	{options}
	hasTrack="{false}"
	aria-labelledby="autoplay-example-heading"
	on:move="{(e) => handleMove(e)}">
	<div style="position: relative">
		<SplideTrack>
			<slot />
		</SplideTrack>
	</div>

	<!-- Progress bar -->

	{#if showProgressBar}
		<div class="splide__progress">
			<div class="splide__progress__bar bg-primary-200"></div>
		</div>
	{/if}

	<!-- Progress bar play pause toggle -->

	<!-- <button class="splide__toggle">
		<span class="splide__toggle__play">Play</span>
		<span class="splide__toggle__pause">Pause</span>
	</button> -->

	<div class="splide__arrows splide__arrows--ltr">
		<!-- Previous arrow button -->

		<button
			class="splide__arrow splide__arrow--prev"
			type="button"
			disabled="{currentImageIndex === 0}"
			aria-label="Previous slide"
			aria-controls="splide01-track">
			<div
				class="bg-white py-8 px-2 rounded border flex items-center justify-center"
				style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
				</svg>
			</div>
		</button>

		<!-- Next arrow button -->

		<button
			class="splide__arrow splide__arrow--next"
			type="button"
			disabled="{totalImagesLength === currentImageIndex - 1}"
			aria-label="Next slide"
			aria-controls="splide01-track">
			<div
				class="bg-white py-8 px-2 rounded border flex items-center justify-center"
				style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
				</svg>
			</div>
		</button>
	</div>
</Splide>
