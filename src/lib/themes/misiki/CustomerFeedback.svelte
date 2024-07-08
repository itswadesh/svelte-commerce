<script>
import { currency, date } from '$lib/utils'
import { LazyImg } from '$lib/components'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { browser } from '$app/environment'
import { storeStore } from '$lib/store/store'
import * as Carousel from '$lib/shad-components/ui/carousel/index'

export let data = {}

let Splide

$: innerWidth = 0
let responsiveWidth = 0

$: if (innerWidth >= 640) {
	responsiveWidth = innerWidth - 80
} else {
	responsiveWidth = innerWidth - 24
}
let store = {}
onMount(async () => {
	if (browser) {
		storeStore.subscribe((value) => (store = value))
	}
})
</script>

<svelte:window bind:innerWidth />

{#await data?.streamed?.feedbacks then feedbacks}
	{#if feedbacks?.count > 0}
		<div>
			<h2 class="p-3 py-5 text-center uppercase sm:px-10 md:py-10">Customer Feedback</h2>

			<div class="px-3 sm:px-10">
				<Carousel.Root
					opts="{{
						align: 'start',
						loop: true
					}}">
					<Carousel.Content class="-ml-5">
						{#each feedbacks?.data as feedback}
							{#if feedback}
								<Carousel.Item class="basis-auto">
									<div class="relative w-full">
										<div class="bg-white rounded border shadow">
											<div>
												{#if feedback.image || feedback.images[0]}
													<LazyImg
														src="{feedback.image || feedback.images[0]}"
														alt=""
														height="500"
														width="500"
														aspect_ratio="1:1"
														class="block h-full w-full object-contain object-center rounded" />
												{:else}
													<div
														class="h-[500px] w-full items-center justify-center text-center text-sm bg-zinc-100 text-zinc-500 flex flex-col gap-2 rounded">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 24 24"
															fill="currentColor"
															class="w-6 h-6">
															<path
																fill-rule="evenodd"
																d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
																clip-rule="evenodd"></path>
														</svg>

														<span>Oops! No Image found</span>
													</div>
												{/if}
											</div>

											<div class="p-5 flex flex-col gap-2 text-xs sm:text-sm">
												<div class="flex items-center gap-2">
													<div class="flex items-center gap-1">
														{#each { length: 5 } as _, index}
															<svg
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 20 20"
																fill="currentColor"
																class="w-4 h-4
																{index < feedback.rating ? 'text-primary-500' : 'text-zinc-200'}">
																<path
																	fill-rule="evenodd"
																	d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
																	clip-rule="evenodd"></path>
															</svg>
														{/each}
													</div>

													<div
														class="bg-brand-500 text-white text-xs py-0.5 px-2 font-thin rounded-full">
														Verified Purchaser
													</div>
												</div>

												{#if feedback.message}
													<p>
														{feedback.message}
													</p>
												{/if}

												{#if feedback.user}
													<div class="flex items-center gap-2">
														{#if feedback.user?.avatar}
															<div class="h-6 w-6 rounded-full overflow-hidden">
																<img
																	src="{feedback.user?.avatar}"
																	alt="avatar"
																	class="h-full w-full object-cover object-top" />
															</div>
														{/if}

														<p class="flex-1">
															{#if feedback.user?.firstName}
																{feedback.user?.firstName}
															{/if}

															{#if feedback.user?.lastName}
																{feedback.user?.lastName}
															{/if}

															{#if feedback.user?.createdAt}
																| {date(feedback?.createdAt)}
															{/if}
														</p>
													</div>
												{/if}

												{#if feedback.product}
													<h6>Purchased Item:</h6>

													<a
														href="/product/{feedback.product?.slug}"
														aria-label="View product"
														target="_blank"
														rel="noopener noreferrer"
														class="flex items-start gap-2 group">
														{#if feedback.product?.img}
															<LazyImg
																src="{feedback.product?.img}"
																alt=""
																class="block w-16 h-auto object-contain object-center rounded" />
														{/if}

														<div class="flex-1">
															<p class="mb-1 group-hover:underline">
																{feedback.product?.name}
															</p>

															<div class="flex flex-wrap items-center gap-2 text-xs">
																<span class="text-base font-bold whitespace-nowrap">
																	{currency(feedback.product?.price, store?.currencySymbol)}
																</span>

																{#if feedback.product?.mrp > feedback.product?.price}
																	<span class="whitespace-nowrap text-zinc-500 line-through">
																		{currency(feedback.product?.mrp, store?.currencySymbol)}
																	</span>

																	{#if Math.floor(((feedback.product?.mrp - feedback.product?.price) / feedback.product?.mrp) * 100) > 0}
																		<span class="whitespace-nowrap text-secondary-500">
																			({Math.floor(
																				((feedback.product?.mrp - feedback.product?.price) /
																					feedback.product?.mrp) *
																					100
																			)}% off)
																		</span>
																	{/if}
																{/if}
															</div>
														</div>
													</a>
												{/if}
											</div>
										</div>
									</div>
								</Carousel.Item>
							{/if}
						{/each}
					</Carousel.Content>
					<Carousel.Previous />
					<Carousel.Next />
				</Carousel.Root>
				<!-- <svelte:component
					this="{Splide}"
					options="{{
						arrows: true,
						autoPlay: true,
						lazyLoad: true,
						pagination: false,
						perMove: 4,
						perPage: 4,
						rewind: true,
						width: responsiveWidth || '100%',
						breakpoints: {
							1024: {
								arrows: true,
								perMove: 3,
								perPage: 3
							},
							768: {
								arrows: true,
								perMove: 2,
								perPage: 2
							},
							640: {
								arrows: false,
								perMove: 1,
								perPage: 1
							}
						}
					}}">
				</svelte:component> -->
			</div>
		</div>
	{/if}
{/await}
