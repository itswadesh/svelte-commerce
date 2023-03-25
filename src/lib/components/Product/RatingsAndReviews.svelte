<script>
import { date } from '$lib/utils'
import { goto } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { ReviewService } from '$lib/services'
import ReviewGallery from './ReviewGallery.svelte'

export let type
export let product
export let reviewsSummary = {}
export let reviews = {}

// console.log('type', type)
// console.log('product', product)
// console.log('reviewsSummary', reviewsSummary)
// console.log('reviews', reviews)

let clazz = ''
export { clazz as class }

let gallery = []
let loadingForGallery = false
let openReviewImages = []
let showGalleryModal = false

onMount(async () => {
	await getGallery()
})

async function getGallery() {
	try {
		loadingForGallery = true

		const res = await ReviewService.fetchProductReviews({
			page: +$page?.url?.searchParams.get('page') || 1,
			type: 'gallery',
			pid: product?._id,
			storeId: $page?.data?.store?.id,
			origin: $page?.data?.origin
		})

		// console.log('fetchProductReviews', res)

		gallery = res?.data
			.map((item) => {
				return item.images.map((image) => {
					return {
						createdAt: item.createdAt,
						image: image,
						message: item.message,
						product: item.product,
						rating: item.rating,
						user: item.user
					}
				})
			})
			.flat()

		// console.log('gallery', gallery)
	} catch (e) {
		console.error('error', e)
	} finally {
		loadingForGallery = false
	}
}
</script>

<div id="ratings-and-reviews" class="{clazz}">
	<!-- Heading -->

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

	{#if reviewsSummary?.summary?.ratings_avg?.value > 0 || reviewsSummary?.reviews?.length}
		<div class="mb-5">
			<!-- Ratings chart -->

			<div class="mb-5">
				<div class="tems-center flex">
					<div
						class="flex max-w-max flex-col items-center justify-center border-r border-gray-300 px-3 text-center">
						<h2 class="mb-2 flex items-end gap-2">
							<span class="text-4xl sm:text-5xl">
								{reviewsSummary?.summary?.ratings_avg?.value.toFixed(1).replace(/\.0+$/, '')}
							</span>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-primary-500"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
								</path>
							</svg>
						</h2>

						<p class="text-sm">
							{reviewsSummary?.summary?.ratings_sum?.value} Verified Buyers
						</p>
					</div>

					<div class="flex w-full max-w-xs flex-1 flex-col-reverse gap-2 px-3 text-xs">
						{#each reviewsSummary?.summary?.rating_count?.buckets as r}
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
										class:bg-yellow-500="{r.key == 2}"
										class:bg-red-500="{r.key == 1}"
										style="width: {Math.round(
											(r.doc_count / reviewsSummary?.summary?.ratings_sum?.value) * 100
										)}%">
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

			<!-- Customer Reviews -->

			{#if reviews?.length}
				<div class="mb-5">
					<h2 class="mb-5 font-semibold">
						Customer Reviews ({reviews?.length})
					</h2>

					{#each reviews as review, rx}
						{#if rx <= 5}
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

								<div class="flex-1 flex flex-col gap-1">
									{#if review.message}
										<p class="first-letter:uppercase text-sm">
											{review.message}
										</p>
									{/if}

									{#if review?.images?.length}
										<button
											type="button"
											class="flex flex-wrap gap-1"
											on:click="{() => (openReviewImages[rx] = true)}">
											{#each review?.images as img}
												<img src="{img}" alt="" class="h-20 w-14 rounded-md object-cover" />
											{/each}
										</button>

										<!-- <ReviewGallery
											showPhotosModal="{openReviewImages[rx]}"
											gallery="{review?.images}"
											on:close="{() => (openReviewImages[rx] = false)}" /> -->
									{/if}

									<div class="flex flex-wrap items-center gap-1 text-gray-500 text-xs">
										{#if review.user?.firstName}
											<span>{review.user?.firstName}</span>

											{#if review.user?.lastName}
												<span>{review.user?.lastName}</span>
											{/if}

											<span class="h-2.5 border-l border-gray-300"></span>
										{/if}

										{#if review.createdAt}
											<span>{date(review.createdAt)}</span>
										{/if}
									</div>
								</div>
							</div>
						{/if}
					{/each}
				</div>

				<!-- View all reviews -->

				{#if reviews?.length > 5}
					<a href="/all-reviews/{product?._id}?type={type}">
						<button
							type="button"
							class="border rounded-full py-1 px-4 text-xs text-primary-500 hover:bg-primary-500 hover:text-white transition duration-700 focus:outline-none">
							View All Reviews
						</button>
					</a>
				{/if}

				<!-- Gallery -->

				{#if gallery?.length}
					<button
						type="button"
						class="mt-5 w-full h-auto"
						on:click="{() => (showGalleryModal = true)}">
						<div class="grid grid-cols-3 grid-rows-3 gap-2 h-72 max-w-sm">
							{#if gallery[0]?.image}
								<div
									class="col-span-2 row-span-2 rounded-md bg-no-repeat bg-cover overflow-hidden"
									style="background-image:url({gallery[0]?.image});">
								</div>
							{/if}

							{#if gallery[1]?.image}
								<div
									class="col-span-1 row-span-1 rounded-md bg-no-repeat bg-cover overflow-hidden"
									style="background-image:url({gallery[1]?.image});">
								</div>
							{/if}

							{#if gallery[2]?.image}
								<div
									class="col-span-1 row-span-1 rounded-md bg-no-repeat bg-cover overflow-hidden"
									style="background-image:url({gallery[2]?.image});">
								</div>
							{/if}

							{#if gallery[3]?.image}
								<div
									class="col-span-1 row-span-1 rounded-md bg-no-repeat bg-cover overflow-hidden"
									style="background-image:url({gallery[3]?.image});">
								</div>
							{/if}

							{#if gallery[4]?.image}
								<div
									class="col-span-1 row-span-1 rounded-md bg-no-repeat bg-cover overflow-hidden"
									style="background-image:url({gallery[4]?.image});">
								</div>
							{/if}

							{#if gallery?.length - 5 > 0}
								<div
									class="col-span-1 row-span-1 relative p-3 rounded-md bg-no-repeat bg-cover overflow-hidden"
									style="background-image:url(gallery[5]?.image);">
									<div
										class="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center font-bold text-xl text-white">
										+{gallery?.length - 5}
									</div>
								</div>
							{/if}
						</div>
					</button>

					<ReviewGallery
						showPhotosModal="{showGalleryModal}"
						gallery="{gallery}"
						on:close="{() => (showGalleryModal = false)}" />
				{/if}
			{/if}
		</div>
	{:else}
		<div class="mb-5 text-sm">
			No reviews yet, be the first one to review the {product?.name || 'product'}
		</div>
	{/if}

	<!-- Add Your Review -->

	<button
		type="button"
		class="group flex items-center gap-1 text-sm font-bold text-primary-500 focus:outline-none hover:text-primary-700"
		on:click="{() => goto(`/my/reviews/create?pid=${product?._id}&ref=/product/${product?.slug}`)}">
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
