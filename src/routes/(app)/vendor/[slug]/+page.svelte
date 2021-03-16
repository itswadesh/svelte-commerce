<script>
import { dateOnly } from '$lib/utils'
import DummyProductCard from '$lib/DummyProductCard.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import Pagination from '$lib/components/Pagination.svelte'
import ProductCard from '$lib/ProductCard.svelte'
import RatingStarDisplay from '$lib/ui/RatingStarDisplay.svelte'
import userEmptyProfile from '$lib/assets/user-empty-profile.png'

export let data

console.log('data', data)
</script>

<section class="min-h-screen">
	<div class="sm:p-10">
		<div class="container mx-auto w-full max-w-6xl">
			{#if data.vendor}
				<div class="grid grid-cols-1 lg:grid-cols-6 lg:gap-10">
					<!-- Vendor Profile -->

					<div class="col-span-1 lg:col-span-2 px-3 py-5 sm:px-0 sm:py-0">
						<div
							class="static flex flex-col items-center justify-center gap-4 lg:sticky lg:top-32 max-w-sm mx-auto">
							<div>
								{#if data.vendor?.banners[0]}
									<LazyImg
										src="{data.vendor?.banners[0]}"
										alt=" "
										class="h-40 w-40 rounded-full object-cover object-top" />
								{:else}
									<img
										src="{userEmptyProfile}"
										alt=" "
										class="h-40 w-40 rounded-full object-cover object-top" />
								{/if}
							</div>

							<ul class="flex flex-col gap-1 text-center">
								{#if data.vendor?.businessName || data.vendor?.name}
									{#if data.vendor?.businessName}
										<li class="text-xl font-semibold">
											{data.vendor?.businessName}
										</li>
									{/if}

									{#if data.vendor?.name}
										<li>{data.vendor?.name}</li>
									{/if}
								{/if}

								<li>
									<RatingStarDisplay
										rating="{data.vendor?.ratings}"
										ratingCount="{data.vendor?.ratings}"
										reviewCount="{data.vendor?.reviews}"
										class="flex flex-col items-center justify-center gap-2" />
								</li>
							</ul>

							<!-- information list -->

							<ul class="flex flex-col gap-1">
								{#if data.vendor?.productSold}
									<li class="items-center flex gap-2">
										<h6 class="w-28 font-semibold">Product Sold</h6>

										<span>:</span>

										<span>{data.vendor?.productSold}</span>
									</li>
								{/if}

								<li class="items-center flex gap-2">
									<h6 class="w-28 font-semibold">Verified</h6>

									<span>:</span>

									<p
										class="flex items-center gap-1 
										{data.vendor?.verified ? 'text-green-500' : 'text-gray-300'}">
										{#if data.vendor?.verified}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
												class="w-5 h-5">
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
													clip-rule="evenodd"></path>
											</svg>

											<span> Yes </span>
										{:else}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
												class="w-5 h-5">
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
													clip-rule="evenodd"></path>
											</svg>

											<span> No </span>
										{/if}
									</p>
								</li>

								{#if data.vendor?.createdAt}
									<li class="items-center flex gap-2">
										<h6 class="w-28 font-semibold">Registered</h6>

										<span>:</span>

										<span>{dateOnly(data.vendor?.createdAt)}</span>
									</li>
								{/if}
							</ul>

							<hr class="w-full" />

							<!-- {#if data.vendor?.email || data.vendor?.phone}
								<div>
									{#if data.vendor?.email}
										<p>{data.vendor?.email}</p>
									{/if}

									{#if data.vendor?.phone}
										<p>{data.vendor?.phone}</p>
									{/if}
								</div>
							{/if} -->

							<!-- social media links -->

							<ul class="flex flex-wrap items-center gap-1">
								<!-- Facebook -->

								{#if data.vendor?.facebook_url}
									<li
										class="duraton-300 h-10 w-10 overflow-hidden rounded-full transition hover:bg-[#4267B2] hover:text-white">
										<a
											href="{data.vendor?.facebook_url}"
											aria-label="Click to route facebook page"
											target="_blank"
											rel="noopener noreferrer"
											class="flex h-full w-full items-center justify-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												fill="none"
												stroke-linecap="round"
												stroke-linejoin="round">
												<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
												<path
													d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"
												></path>
											</svg>
										</a>
									</li>
								{/if}

								<!-- Instagram -->

								{#if data.vendor?.insta_url}
									<li
										class="duraton-300 h-10 w-10 overflow-hidden rounded-full transition hover:bg-[#C13584] hover:text-white">
										<a
											href="{data.vendor?.insta_url}"
											aria-label="Click to route instagram page"
											target="_blank"
											rel="noopener noreferrer"
											class="flex h-full w-full items-center justify-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												fill="none"
												stroke-linecap="round"
												stroke-linejoin="round">
												<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
												<rect x="4" y="4" width="16" height="16" rx="4"></rect>
												<circle cx="12" cy="12" r="3"></circle>
												<line x1="16.5" y1="7.5" x2="16.5" y2="7.501"></line>
											</svg>
										</a>
									</li>
								{/if}

								<!-- Twitter -->

								{#if data.vendor?.twitter_url}
									<li
										class="duraton-300 h-10 w-10 overflow-hidden rounded-full transition hover:bg-[#1DA1F2] hover:text-white">
										<a
											href="{data.vendor?.twitter_url}"
											aria-label="Click to route twitter page"
											target="_blank"
											rel="noopener noreferrer"
											class="flex h-full w-full items-center justify-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												fill="none"
												stroke-linecap="round"
												stroke-linejoin="round">
												<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
												<path
													d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z"
												></path>
											</svg>
										</a>
									</li>
								{/if}

								<!-- Linked in -->

								{#if data.vendor?.linkedin_url}
									<li
										class="duraton-300 h-10 w-10 overflow-hidden rounded-full transition hover:bg-[#0077b5] hover:text-white">
										<a
											href="{data.vendor?.linkedin_url}"
											aria-label="Click to route linkedin page"
											target="_blank"
											rel="noopener noreferrer"
											class="flex h-full w-full items-center justify-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												fill="none"
												stroke-linecap="round"
												stroke-linejoin="round">
												<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
												<rect x="4" y="4" width="16" height="16" rx="2"></rect>
												<line x1="8" y1="11" x2="8" y2="16"></line>
												<line x1="8" y1="8" x2="8" y2="8.01"></line>
												<line x1="12" y1="16" x2="12" y2="11"></line>
												<path d="M16 16v-3a2 2 0 0 0 -4 0"></path>
											</svg>
										</a>
									</li>
								{/if}

								<!-- Youtube -->

								{#if data.vendor?.youtube_url}
									<li
										class="duraton-300 h-10 w-10 overflow-hidden rounded-full transition hover:bg-[#FF0000] hover:text-white">
										<a
											href="{data.vendor?.youtube_url}"
											aria-label="Click to route youtube page"
											target="_blank"
											rel="noopener noreferrer"
											class="flex h-full w-full items-center justify-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												fill="none"
												stroke-linecap="round"
												stroke-linejoin="round">
												<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
												<rect x="3" y="5" width="18" height="14" rx="4"></rect>
												<path d="M10 9l5 3l-5 3z"></path>
											</svg>
										</a>
									</li>
								{/if}
							</ul>
						</div>
					</div>

					<!-- Vendor products -->

					<div class="col-span-1 lg:col-span-4">
						<div class="flex items-center justify-between gap-5">
							<h2 class="text-xl font-bold sm:text-2xl md:text-3xl p-5 lg:p-0 lg:mb-5">
								Vendor's Product

								{#if data.vendorsProduct?.count}
									({data.vendorsProduct?.count})
								{/if}
							</h2>

							<!-- <a
								href="/{data.vendor?.slug}?sort=-updatedAt"
								aria-label="click to route vendor details page"
								class="text-xs font-semibold text-primary-500 hover:text-primary-700 hover:underline sm:text-sm">
								View All
							</a> -->
						</div>

						{#if data.vendorsProduct?.count}
							<div>
								<ul
									class="grid w-full grid-cols-2 items-start border-t sm:flex sm:flex-wrap sm:justify-between sm:gap-3 sm:border-t-0 lg:gap-6">
									{#each data.vendorsProduct?.data as p, ix}
										<li>
											<ProductCard product="{p}" />
										</li>
									{/each}

									{#each { length: 7 } as _}
										<li class="hidden sm:block">
											<DummyProductCard />
										</li>
									{/each}
								</ul>

								<Pagination
									count="{Math.ceil((data.vendorsProduct?.count || 1) / 40)}"
									current="{data.page || 1}" />
							</div>
						{:else}
							<p class="bg-gray-200 rounded p-5 text-sm text-gray-500 text-center">
								Oops!...No product found, vendor has not uploaded any product yet.
							</p>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>
