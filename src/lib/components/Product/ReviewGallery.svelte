<style>
.frosted-black {
	backdrop-filter: blur(5px);
	background-color: hsla(0, 0%, 0%, 0.8);
}
</style>

<script lang="ts">
import { createEventDispatcher, onMount } from 'svelte'
import { currency, date } from '$lib/utils'
import { page } from '$app/stores'
import { SplideSlide } from '@splidejs/svelte-splide'
import LazyImg from '../Image/LazyImg.svelte'

const dispatch = createEventDispatcher()

export let showPhotosModal = false
export let gallery

let Splide: any
let currentImageIndex = 0

onMount(async () => {
	const SplideModule = await import('$lib/components/SplideJs.svelte')

	Splide = SplideModule.default
})
</script>

{#if showPhotosModal}
	<div
		class="frosted-black fixed inset-0 z-[100] flex h-screen w-screen items-center justify-center overflow-hidden p-5 sm:p-10 lg:p-20">
		<!-- Close button -->

		<button
			type="button"
			class="fixed top-2 right-2 transform cursor-pointer text-zinc-200 transition duration-300 hover:scale-125 hover:text-white lg:top-10 lg:right-10"
			on:click="{() => dispatch('close')}">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
			</svg>
		</button>

		<!-- Images -->

		{#if gallery?.length > 1}
			<div
				class="fixed top-2.5 lg:top-10 left-[50%] transform -translate-x-1/2 max-w-xs text-white text-sm">
				Images {currentImageIndex + 1}/{gallery?.length}
			</div>
		{/if}

		<div class="container mx-auto relative bg-white rounded-3xl w-full max-w-xl max-h-max">
			{#if gallery?.length > 1}
				<svelte:component
					this="{Splide}"
					bind:currentImageIndex="{currentImageIndex}"
					options="{{
						rewind: true,
						lazyLoad: true,
						perPage: 1,
						perMove: 1,
						pagination: false
						// breakpoints: {
						// 640: {
						// 	perPage: 1,
						// 	perMove: 1,
						// 	arrows: false
						// }
						// },
					}}">
					{#each gallery as g}
						{#if g}
							<SplideSlide>
								<div class="p-5">
									<div class="mb-5 h-96 w-full">
										{#if g.image || g.images[0]}
											<LazyImg
												src="{g.image || g.images[0]}"
												alt=""
												class="block h-full w-full object-contain object-center rounded" />
										{:else}
											<div
												class="bg-zinc-100 text-zinc-500 flex flex-col gap-2 h-full w-full items-center justify-center text-center text-sm rounded">
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

									<div class="flex flex-col gap-2 text-xs sm:text-sm">
										<div class="flex items-center gap-2">
											<div class="flex items-center gap-1">
												{#each { length: 5 } as _, index}
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 20 20"
														fill="currentColor"
														class="w-4 h-4 {index < g.rating
															? 'text-primary-500'
															: 'text-zinc-200'}">
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

										{#if g.message}
											<p>
												{g.message}
											</p>
										{/if}

										{#if g.user}
											<span class="text-xs text-zinc-500">
												{g.user?.firstName} | {date(g.createdAt)}
											</span>
										{/if}

										{#if g.product}
											<h6>Purchased Item:</h6>

											<a
												href="/product/{g.product?.slug}"
												aria-label="View product"
												target="_blank"
												rel="noopener noreferrer"
												class="flex items-start gap-2 group">
												{#if g.product?.img}
													<LazyImg
														src="{g.product?.img}"
														alt=""
														class="block w-16 h-auto object-contain object-center rounded" />
												{/if}

												<div class="flex-1">
													<p class="mb-1 group-hover:underline">
														{g.product?.name}
													</p>

													<div class="flex flex-wrap items-center gap-2 text-xs">
														<span class="text-base font-bold whitespace-nowrap">
															{currency(g.product?.price, $page.data?.store?.currencySymbol)}
														</span>

														{#if g.product?.mrp > g.product?.price}
															<span class="whitespace-nowrap text-zinc-500 line-through">
																{currency(g.product?.mrp, $page.data?.store?.currencySymbol)}
															</span>

															{#if Math.floor(((g.product?.mrp - g.product?.price) / g.product?.mrp) * 100) > 0}
																<span class="whitespace-nowrap text-secondary-500">
																	({Math.floor(
																		((g.product?.mrp - g.product?.price) / g.product?.mrp) * 100
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
							</SplideSlide>
						{/if}
					{/each}
				</svelte:component>
			{:else}
				{#each gallery as g}
					{#if g}
						<div class="p-5">
							<div class="mb-5 h-96 w-full">
								{#if g.image || g.images[0]}
									<LazyImg
										src="{g.image || g.images[0]}"
										alt=""
										class="block h-full w-full object-contain object-center rounded" />
								{:else}
									<div
										class="bg-zinc-100 text-zinc-500 flex flex-col gap-2 h-full w-full items-center justify-center text-center text-sm rounded">
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

							<div class="flex flex-col gap-2 text-xs sm:text-sm">
								<div class="flex items-center gap-2">
									<div class="flex items-center gap-1">
										{#each { length: 5 } as _, index}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
												class="w-4 h-4 {index < g.rating ? 'text-primary-500' : 'text-zinc-200'}">
												<path
													fill-rule="evenodd"
													d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
													clip-rule="evenodd"></path>
											</svg>
										{/each}
									</div>

									<div class="bg-brand-500 text-white text-xs py-0.5 px-2 font-thin rounded-full">
										Verified Purchaser
									</div>
								</div>

								{#if g.message}
									<p>
										{g.message}
									</p>
								{/if}

								{#if g.user}
									<span class="text-xs text-zinc-500">
										{g.user?.firstName} | {date(g.createdAt)}
									</span>
								{/if}

								{#if g.product}
									<h6>Purchased Item:</h6>

									<a
										href="/product/{g.product?.slug}"
										aria-label="View product"
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-start gap-2 group">
										{#if g.product?.img}
											<LazyImg
												src="{g.product?.img}"
												alt=""
												class="block w-16 h-auto object-contain object-center rounded" />
										{/if}

										<div class="flex-1">
											<p class="mb-1 group-hover:underline">
												{g.product?.name}
											</p>

											<div class="flex flex-wrap items-center gap-2 text-xs">
												<span class="text-base font-bold whitespace-nowrap">
													{currency(g.product?.price, $page.data?.store?.currencySymbol)}
												</span>

												{#if g.product?.mrp > g.product?.price}
													<span class="whitespace-nowrap text-zinc-500 line-through">
														{currency(g.product?.mrp, $page.data?.store?.currencySymbol)}
													</span>

													{#if Math.floor(((g.product?.mrp - g.product?.price) / g.product?.mrp) * 100) > 0}
														<span class="whitespace-nowrap text-secondary-500">
															({Math.floor(
																((g.product?.mrp - g.product?.price) / g.product?.mrp) * 100
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
					{/if}
				{/each}
			{/if}
		</div>
	</div>
{/if}
