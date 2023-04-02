<script>
import { date, toast } from '$lib/utils'
import { ReviewService } from '$lib/services'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import BackButton from '$lib/ui/BackButton.svelte'
import dotsLoading from '$lib/assets/dots-loading.gif'
import ProductNav from '$lib/ProductNav.svelte'
import ReviewGallery from '$lib/components/Product/ReviewGallery.svelte'

export let data
// console.log('zzzzzzzzzzzzzzzzzz', data)
const { productReviews } = data

// console.log('$page', $page)

let brandId = $page.url.searchParams.get('brandId')
let type = $page.url.searchParams.get('type')
let allReviews = []
let count = 0
// console.log('type', type)
$: if (type === 'product_review') {
	allReviews = productReviews.product?.data
	count = productReviews.product?.count
	// console.log('allReviews', allReviews)
	// console.log('count', count)
} else {
	allReviews = productReviews.brand?.data
	count = productReviews.brand?.count
	// console.log('allReviews', allReviews)
	// console.log('count', count)
}
let currentPage = 1
let loading = false
let openReviewGallery = []
let openReviewImages = []
let reachedLast = false
let selectedProductGallery = []

onMount(() => {
	const intersectionObserver = new IntersectionObserver((entries) => {
		if (entries[0].intersectionRatio <= 0) return
		// load more content;
		loadNextPage()
	})

	intersectionObserver.observe(document.querySelector('.more'))
})

async function loadNextPage() {
	if (!reachedLast) {
		let nextPage = currentPage + 1
		$page.url.searchParams.delete('page')
		const searchParams = $page.url.searchParams.toString()

		try {
			loading = true

			const res = await ReviewService.fetchProductReviews({
				page: nextPage,
				brandIc: brandId,
				pid: data.pid,
				origin: $page?.data?.origin,
				storeId: $page?.data?.store?.id
			})

			// console.log('res', res)

			const isProduct = type === 'product_review' ? true : false

			// console.log('isProduct', isProduct)

			if (res?.product?.data?.length || res?.brand?.data?.length) {
				if (isProduct && res?.product?.data?.length) {
					allReviews = productReviews.product?.data.concat(res?.product?.data)
					count = res.product?.count
					// console.log('allReviews for next load', allReviews)
					// console.log('count for next load', count)
				} else if (res?.brand?.data?.length) {
					allReviews = productReviews.brand?.data.concat(res?.brand?.data)
					count = res.brand?.count
					// console.log('allReviews for next load', allReviews)
					// console.log('count for next load', count)
				}
			} else {
				reachedLast = true
			}

			data.err = !res?.estimatedTotalHits ? 'No result Not Found' : null

			currentPage = currentPage + 1
		} catch (e) {
			toast(e, 'error')
		} finally {
			loading = false
		}
	}
}

const handleSelectedProductGallery = (review, rx) => {
	// console.log('review, rx', review, rx)

	selectedProductGallery = review.images
		.map((item) => {
			return {
				createdAt: review.createdAt,
				image: item,
				message: review.message,
				product: review.product,
				rating: review.rating,
				user: review.user
			}
		})
		.flat()

	// console.log('selectedProductGallery', selectedProductGallery)

	openReviewImages[rx] = true
}
</script>

<ProductNav
	cart="{$page?.data?.cart}"
	me="{$page?.data?.me}"
	productName="{data.product?.name}"
	url="{$page?.url?.href}"
	store="{$page?.data?.store}">
	<div class="flex max-w-max flex-col items-start gap-1">
		<h2 class="max-w-[10rem] truncate font-semibold capitalize leading-4">
			{$page?.url?.searchParams.get('type') || ''} Reviews
		</h2>

		<p class="text-xs">
			{count}

			{#if count > 1}
				Reviews
			{:else}
				Review
			{/if}
		</p>
	</div>
</ProductNav>

{#if count}
	<div class="mt-14 sm:mt-20 lg:mt-0 p-3 py-5 sm:p-10">
		<div class="container mx-auto max-w-6xl">
			<!-- Name and count -->

			<header class="mb-10 hidden lg:flex items-center justify-between flex-wrap-reverse gap-2">
				<h1 class="flex flex-wrap items-center gap-2">
					<span class="text-xl font-bold md:text-2xl">
						{type === 'product_review' ? 'Product' : 'Brand'} Reviews
					</span>

					-

					<p>
						<span class="text-xl font-bold capitalize md:text-2xl">
							{count}
						</span>

						<span>
							{#if count > 1}
								Reviews
							{:else}
								Review
							{/if}
						</span>
					</p>
				</h1>

				<BackButton />
			</header>

			<div>
				{#each allReviews as review, rx}
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

						<div class="flex-1 flex flex-col gap-1 max-w-max">
							{#if review.message}
								<p class="first-letter:uppercase text-sm">
									{review.message}
								</p>
							{/if}

							{#if review?.images?.length}
								<button
									type="button"
									class="flex flex-wrap gap-1"
									on:click="{() => handleSelectedProductGallery(review, rx)}">
									{#each review?.images as img}
										<img src="{img}" alt="" class="h-20 w-14 rounded-md object-cover" />
									{/each}
								</button>

								<ReviewGallery
									showPhotosModal="{openReviewImages[rx]}"
									gallery="{selectedProductGallery}"
									on:close="{() => (openReviewImages[rx] = false)}" />
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
				{/each}

				<!-- Load more function triggers here -->

				<div class="more">
					<!-- Dot loading gif -->

					{#if loading}
						<div class="flex items-center justify-center p-6">
							<img
								src="{dotsLoading}"
								alt="loading"
								class="h-auto w-5 object-contain object-center" />
						</div>
					{/if}
				</div>

				<!-- Reached last -->

				{#if reachedLast}
					<p class="text-gray-500 p-4 text-center">
						<i>~ You have seen all the reviews ~</i>
					</p>
				{/if}
			</div>
		</div>
	</div>
{/if}
