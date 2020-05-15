<script>
import { CDN_URL } from './../../config'

import { Swipe, SwipeItem } from 'svelte-swipe'
import { expoIn } from 'svelte/easing'

const swipeConfig = {
	autoplay: false,
	delay: 2000,
	showIndicators: true,
	transitionDuration: 1000,
	defaultIndex: 0,
}
let SwipeComp

function nextSlide() {
	SwipeComp.nextItem()
}

function prevSlide() {
	SwipeComp.prevItem()
}

export let banners = [
	{
		img: '/ecommerce-banner-1.png',
	},
	{
		img: '/ETP-banner-for-ecommerce.jpg',
	},
]
</script>

<div class="relative h-36 md:h-48 lg:h-60 xl:h-96">
	<Swipe {...swipeConfig} bind:this="{SwipeComp}">
		{#each banners as b, i}
			<SwipeItem>
				<a href="/search" class="w-full">
					<!-- <img src="{`${CDN_URL}/${b.img}`}" alt="${CDN_URL}" class="w-full" /> -->
					<img
						src="/ETP-banner-for-ecommerce.jpg"
						alt="banner"
						class="w-full xl:h-full object-cover" />
				</a>
			</SwipeItem>
		{/each}
	</Swipe>
	<button
		class="hidden md:block absolute left-4 md:top-20 lg:top-24 xl:top-40 z-10  bg-white px-2 py-2 rounded-full border-2 hover:bg-gray-200 focus:outline-none"
		type="button"
		on:click="{prevSlide}">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"
			></path>
		</svg>
	</button>
	<button
		class="hidden md:block absolute right-4 md:top-20 lg:top-24 xl:top-40 z-10 bg-white px-2 py-2 rounded-full border-2 hover:bg-gray-200 focus:outline-none"
		type="button"
		on:click="{nextSlide}">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
		</svg>
	</button>
</div>
