<script>
import { fly } from 'svelte/transition'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { RatingStarDisplay } from '$lib/ui'
import { ReviewService } from '$lib/services'
import LazyImg from './Image/LazyImg.svelte'

let currentIndex = 0
let showPopup = true
let reviews = [
	{
		user: {
			avatar: '/profile.png',
			firstName: 'Pratap Chandra',
			lastName: 'Maharana'
		},
		rating: 4.5,
		review: 'Product is good but the cloth is very thin',
		product: {
			img: '/user-empty-profile.png',
			name: 'White shirt with round neck'
		}
	},
	{
		user: {
			avatar: '/profile.png',
			firstName: 'Kritic',
			lastName: 'Kumar'
		},
		rating: 2,
		review: 'Product fabric is super.',
		product: {
			img: '/user-empty-profile.png',
			name: 'Sky blue night suit'
		}
	},
	{
		user: {
			avatar: '/profile.png',
			firstName: 'Rinku',
			lastName: ''
		},
		rating: 3.5,
		review: 'Awesome product, very comfortable.',
		product: {
			img: '/user-empty-profile.png',
			name: 'Light red summer wear'
		}
	}
]
let selectedReview = {}

onMount(() => {
	try {
		const res = ReviewService.fetchReviews({
			currentPage: 0,
			origin,
			storeId: $page?.data?.storeId,
			sort: 'updatedAt'
		})
	} catch (err) {}
})

function displayReview() {
	if (showPopup) {
		selectedReview = reviews[currentIndex]
	}

	showPopup = !showPopup // Toggle between show and hide
	currentIndex++

	if (currentIndex >= reviews.length) {
		currentIndex = 0 // Reset index to loop through reviews
	}
}

// Initial display
displayReview()

// Set an interval to switch between showing and hiding reviews
const iterationInterval = setInterval(displayReview, 8000) // 8000 ms (5 seconds to show + 3 seconds to hide)

// Stop the interval after a certain number of iterations (e.g., 10 iterations)
const maxIterations = 20
let iterationCount = 0

function stopInterval() {
	showPopup = false
	clearInterval(iterationInterval)
}

setTimeout(stopInterval, maxIterations * 8000) // 8000 ms (5 seconds to show + 3 seconds to hide)
</script>

{#if showPopup && selectedReview}
	<div
		transition:fly="{{ x: 160, duration: 300 }}"
		class="fixed z-[99] bottom-32 right-4 w-40 text-xs">
		<div class="relative p-4 flex flex-col gap-2 bg-white rounded shadow">
			<button
				type="button"
				class="absolute z-10 -top-1 -left-1 h-6 w-6 text-zinc-500 bg-white rounded-full shadow flex items-center justify-center focus:outline-none"
				on:click="{stopInterval}">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-4 h-4">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
				</svg>
			</button>

			<div class="font-bold flex items-center gap-2">
				{#if selectedReview.user?.avatar}
					<img
						src="{selectedReview.user?.avatar}"
						class="h-6 w-6 shrink-0 rounded-full object-cover object-center" />
				{/if}

				<span class="flex-1 line-clamp-1">
					{#if selectedReview.user?.firstName}
						{selectedReview.user?.firstName}
					{/if}

					{#if selectedReview.user?.lastName}
						{selectedReview.user?.lastName}
					{/if}
				</span>
			</div>

			<RatingStarDisplay showOnlyStars rating="{selectedReview.rating}" />

			<p class="text-xs line-clamp-6">
				{selectedReview.review}
			</p>

			<hr />

			<div class="flex items-center gap-2">
				<img
					src="{selectedReview.product?.img}"
					class="h-8 w-8 rounded object-cover object-center" />

				<span class="line-clamp-2 leading-3 text-[10px]">
					{selectedReview.product?.name}
				</span>
			</div>
		</div>
	</div>
{/if}
