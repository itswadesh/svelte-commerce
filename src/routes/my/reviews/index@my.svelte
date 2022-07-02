<script lang="ts">
import { onMount } from 'svelte'
import SEO from '$lib/components/SEO/index.svelte'
import { date, currency } from '$lib/util'
import { KQL_Reviews } from '$lib/graphql/_kitql/graphqlStores'

const seoProps = {
	title: 'Reviews',
	metadescription: 'My Reviews'
}
let reviews
let open = false
function toggle() {
	open = !open
}

onMount(() => {
	getReviews()
})
async function getReviews() {
	reviews = (await KQL_Reviews.query()).data?.reviews
}
</script>

<SEO {...seoProps} />

<section class="h-full w-full pl-2 tracking-wide text-gray-800 sm:pl-8 sm:pr-2 ">
	<h1 class="text-lg  font-bold sm:text-xl">
		<span class="mr-1">My reviews</span>( {reviews?.count || 0} )
	</h1>

	{#if reviews?.count > 0}
		{#each reviews?.data as review}
			<div
				class=" breview-t breview-gray-300 breview relative my-2 rounded-md bg-white p-4 transition duration-300 sm:my-5 md:shadow-md ">
				<div class="flex items-center justify-between">
					<!-- Details section start  -->
					<div class="sm:ml-4">
						<a href="{`/reviews/${review.id}`}" class="cursor-pointer">
							<span class="text-lg font-semibold tracking-wider md:text-2xl">
								{review.reviewNo}</span>
						</a>
						<div class="text-sm text-gray-400">
							{date(review.createdAt)}
						</div>

						<div class="relative mt-2 inline-block text-left">
							<div on:click="{toggle}" class="cursor-pointer font-semibold">Review Status</div>

							{#if open}
								<div
									class="absolute left-0 mt-2 w-52 bg-white py-1 capitalize shadow-lg ring-1 ring-black ring-opacity-5"
									role="menu"
									aria-orientation="vertical"
									aria-labelledby="menu-button"
									tabindex="-1">
									<div
										class="cursor-pointer py-1 px-2 transition duration-300 hover:bg-primary-50"
										role="none">
										{reviews.status}
									</div>
								</div>
							{/if}
						</div>

						<!-- Email div start  -->
						<div v-if="review.user" class="my-1">
							<span class=" cursor-pointer text-sm text-primary-500 hover:text-primary-700">
								{review.usermail}
							</span>
						</div>
						<!-- Email div end -->

						<!-- Pay by case div srart  -->
						<div class="item-center my-2 flex cursor-pointer text-sm">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-primary-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
								></path>
							</svg>
							<span class="ml-2"
								>Pay by
								<span class="font-semibold">{review.paymentMode}</span></span>
						</div>
						<!-- Pay by case div end -->
						{#if review?.items}
							<div class="my-6 flex cursor-default">
								<div class="flex w-full text-xs">
									{#each review.items as item}
										<div class="flex w-full text-xs">
											<a href="{`/reviews/${review.id}`}">
												{#if item.imgCdn}
													<img src="{item.imgCdn}" class="h-10 w-10" alt="" />
												{/if}
											</a>
											<div class="ml-2 flex-1">
												<div class="flex">
													<a href="{`/reviews/${review.id}`}">
														<h4 class="font-semibold text-gray-800">
															{item.name}
														</h4>
													</a>
												</div>
												<div class="my-1 flex">
													<h5 class="text-gray-500">
														{item.status}:
													</h5>
												</div>
												<h6 class="my-1 text-gray-800">
													{item.qty} × {currency(item.price)}
												</h6>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
					<div class="flex">
						<div>
							<div class="xl:flex">
								<div
									class=" mb-2 flex items-center justify-end text-base font-bold text-gray-800 md:text-xl xl:mb-0">
									<span class="text-gray-800"> </span>
									{#if review && review.amount}
										<span class="">
											{currency(review.amountotal)}
										</span>
									{/if}
								</div>

								<div class="hidden items-center sm:block md:ml-4 md:flex">
									<div class="mb-2 md:mb-0"></div>
								</div>
							</div>
						</div>

						<!-- Chevron right icon div start -->
						<div class="my-auto hidden sm:block">
							<a href="{`/reviews/${review.id}`}">
								<svg
									class=" ml-4 h-6 w-6 transform text-gray-500 hover:translate-x-1 hover:text-primary-500"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"></path>
								</svg>
							</a>
						</div>
						<!-- Chevron right icon div start -->
					</div>
				</div>
			</div>
		{/each}
	{:else}
		<div class="my-10 flex flex-col items-center justify-center ">
			<h4 class="font-semibold mb-5 text-center">There are no reviews yet</h4>

			<img src="/no/empty-animate.svg" alt="" class="h-80 md:h-96 mb-10" />

			<a
				href="/"
				class="bg-white hover:bg-primary-500 rounded-md shadow hover:shadow-md py-2 px-8 font-semibold text-sm text-primary-500 hover:text-white breview hover:breview-white breview-primary-500 focus:outline-none mx-auto focus:ring-primary-500 ring-opacity-50">
				Shop Now
			</a>
		</div>
	{/if}
</section>
