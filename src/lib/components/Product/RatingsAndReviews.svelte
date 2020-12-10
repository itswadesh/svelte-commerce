<script>
import { goto } from '$app/navigation'
import { date, currency, delay, toast } from '$lib/utils'

export let product
export let reviews = {}

let clazz = ''
export { clazz as class }

let showReviewsCount = 3
let isLastReview = false

function handleShowReviewsCount() {
	showReviewsCount = showReviewsCount + 3
	if (showReviewsCount >= reviews?.reviews?.length) {
		return (isLastReview = true)
	}
}
</script>

<div id="ratings-and-reviews" class="{clazz}">
	<h6 class="mb-2 flex items-center gap-2 font-semibold uppercase">
		<span> Ratings </span>

		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="1">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
			></path>
		</svg>
	</h6>

	{#if reviews?.summary?.ratings_avg?.value > 0 || reviews?.reviews?.length}
		<div class="mb-5">
			<div class="tems-center flex">
				<div
					class="flex max-w-max flex-col items-center justify-center border-r border-gray-300 px-3 text-center">
					<h2 class="mb-2 flex items-end gap-2">
						<span class="text-4xl sm:text-5xl">
							{reviews?.summary?.ratings_avg?.value.toFixed(1)}
						</span>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-primary-500"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path
								d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
							></path>
						</svg>
					</h2>

					<p class="text-sm">
						{reviews?.summary?.ratings_sum?.value} Verified Buyers
					</p>
				</div>

				<div class="flex w-full max-w-xs flex-1 flex-col gap-2 px-3 text-xs">
					{#each reviews?.summary?.rating_count?.buckets as r}
						<div class="flex items-center justify-center gap-2">
							<div class="flex w-8 items-center gap-1">
								<span class="font-bold">{r.key}</span>

								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4 text-gray-300"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									></path>
								</svg>
							</div>

							<div class="relative h-1 w-full rounded-full bg-gray-300">
								<div
									class="absolute inset-y-0 left-0 rounded-full bg-green-500"
									style="width: {r.percent}%">
								</div>
							</div>

							<span class="w-8 text-right text-gray-500">
								{r.doc_count}
							</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<hr class="mb-5 w-full border-t border-gray-300" />

		{#if reviews?.reviews?.length}
			<div class="mb-5">
				<h2 class="mb-5 font-semibold">
					Customer Reviews ({reviews?.reviews?.length})
				</h2>

				{#each reviews?.reviews as review, rx}
					{#if rx + 1 <= showReviewsCount}
						<div class="mb-5 flex items-start gap-4">
							{#if review.rating}
								<div
									class="flex max-w-max items-center gap-0.5 rounded bg-primary-500 px-1.5 py-0.5 text-xs font-semibold text-white">
									<span>
										{review.rating}
									</span>

									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-3 w-3"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path
											d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
										></path>
									</svg>
								</div>
							{/if}

							<div class="flex-1 text-sm">
								{#if review.message}
									<p class="mb-2 first-letter:uppercase">
										{review.message}
									</p>
								{/if}

								<div class="flex items-center gap-2 text-gray-500">
									{#if review.user?.fullName}
										<span>{review.user?.fullName}</span>

										<span class="h-4 border-l border-gray-300"></span>
									{/if}

									{#if review.createdAt}
										<span>{date(review.createdAt)}</span>
									{/if}
								</div>
							</div>
						</div>
					{/if}
				{/each}

				{#if reviews?.reviews?.length >= showReviewsCount}
					{#if !isLastReview}
						<button
							type="button"
							class="text-sm font-semibold text-primary-500 transition duration-300 focus:outline-none hover:text-primary-700"
							on:click="{handleShowReviewsCount}">
							Show More
						</button>
					{:else}
						<button
							type="button"
							class="text-sm font-semibold text-primary-500 transition duration-300 focus:outline-none hover:text-primary-700"
							on:click="{() => (showReviewsCount = 3)}">
							Show Less
						</button>
					{/if}
				{/if}
			</div>
		{/if}
	{:else}
		<div class="mb-5 text-sm">
			No reviews yet, be the first one to review the {product?.name || 'product'}
		</div>
	{/if}

	<button
		type="button"
		class="group flex items-center gap-1 text-sm font-bold text-primary-500 focus:outline-none hover:text-primary-700"
		on:click="{() =>
			goto(`/my/reviews/create?product=${product?._id}&ref=/product/${product?.slug}`)}">
		<span>Add Your Review</span>

		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5 transform transition duration-500 group-hover:translate-x-2"
			viewBox="0 0 20 20"
			fill="currentColor">
			<path
				fill-rule="evenodd"
				d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
				clip-rule="evenodd"></path>
		</svg>
	</button>
</div>
