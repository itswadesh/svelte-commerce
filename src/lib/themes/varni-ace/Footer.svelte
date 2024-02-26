<style>
.link-underline {
	border-bottom-width: 0;
	background-image: linear-gradient(transparent, transparent),
		linear-gradient(rgb(255, 255, 255), rgb(249 250 251));
	background-size: 0 1px;
	background-position: 0 100%;
	background-repeat: no-repeat;
	transition: background-size 0.5s ease-in-out;
}

.link-underline-gray {
	background-image: linear-gradient(transparent, transparent),
		linear-gradient(rgb(229 231 235), rgb(229 231 235));
}

.link-underline:hover {
	background-size: 100% 1px;
	background-position: 0 100%;
}
</style>

<script lang="ts">
// import appStore from '$lib/assets/app/app-store.svg'
// import googlePlay from '$lib/assets/app/google-play.png'
import { browser } from '$app/environment'
import { getAllMegamenuFromStore } from '$lib/store/megamenu'
import { getMenuFromStore } from '$lib/store/menu'
import { getPopularSearchFromStore } from '$lib/store/popular-search'
import { navigateToProperPath, toast } from '$lib/utils'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import masterCard from '$lib/assets/payment-method/mastercard.png'
import paypal from '$lib/assets/payment-method/paypal.png'
import skrill from '$lib/assets/payment-method/skrill.png'
import type { Category } from '$lib/types'
import visa from '$lib/assets/payment-method/visa.png'
// import { storeStore } from '$lib/store/store'

export let content = ``
export let megamenu: Category[]

let email = ''
let menu = []
let paymentMethodCards = [masterCard, paypal, skrill, visa]
let popularSearches = []

function getYear() {
	const d = new Date()
	let year = d.getFullYear()
	return year
}
// let store = {}
$: store = $page.data.store

onMount(async () => {
	if (browser) {
		// if (browser) {
		// 	storeStore.subscribe((value) => {
		// 		store = value
		// 	})
		// }
		megamenu = await getAllMegamenuFromStore({
			storeId: $page?.data?.storeId,
			origin: $page.data.origin
		})

		menu = await getMenuFromStore({
			storeId: $page?.data?.storeId,
			origin: $page.data.origin
		})

		popularSearches = await getPopularSearchFromStore({
			limit: 20,
			sid: null,
			origin: $page.data.origin,
			storeId: $page?.data?.storeId
		})
	}
})

function positionToDisplayIsMultiVendor(itemsLength) {
	if (itemsLength >= 2) {
		return 1
	} else {
		return 0
	}
}
</script>

<footer class="w-full text-sm border-t">
	<div class="justify-center p-3 sm:p-10">
		<div class="container mx-auto max-w-6xl">
			{#if menu?.length}
				<ul
					class="mb-5 p-0 list-none gap-5 sm:mb-10 sm:gap-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start">
					{#each menu as menu}
						{#if menu.menu_id === 'footer'}
							{#each menu.items as item, mx}
								<li class="col-span-1">
									{#if item.link}
										<a
											href="{item.link || '#'} "
											target="_blank"
											aria-label="Click to visit this page"
											class="block">
											<h6 class="mb-4 whitespace-nowrap font-semibold uppercase">{item.name}</h6>
										</a>
									{:else}
										<h6 class="mb-4 whitespace-nowrap font-semibold uppercase">{item.name}</h6>
									{/if}

									<ul class="m-0 p-0 list-none flex flex-col gap-2 text-zinc-500">
										{#if item?.items?.length}
											{#each item?.items as item2}
												<li class="flex max-w-max items-center">
													{#if item2.link}
														<a
															href="{item2.link || '#'} "
															target="_blank"
															aria-label="Click to visit this page"
															class="capitalize link-underline link-underline-gray whitespace-pre-wrap">
															{item2.name}
														</a>
													{:else}
														<span class="capitalize whitespace-pre-wrap">
															{item2.name}
														</span>
													{/if}
												</li>
											{/each}

											{#if mx === 0}
												<li class="flex max-w-xs items-center">
													<form
														on:submit|preventDefault="{() =>
															toast('subscribe currently not working', 'info')}"
														class="relative">
														<input
															type="email"
															value="{email}"
															placeholder="Enter your email..."
															class="w-full bg-white text-zinc-800 py-2 pl-2 pr-28 text-sm border focus:outline-none" />

														<button
															type="submit"
															class="absolute inset-y-0 right-0 w-24 px-2 bg-secondary-500 hover:bg-secondary-600 text-white transition duration-300 focus:outline-none">
															Subscribe
														</button>
													</form>
												</li>
											{/if}

											{#if mx === positionToDisplayIsMultiVendor(menu.items?.length) && store?.isMultiVendor}
												<li class="flex max-w-max items-center">
													<a
														href="{store?.adminUrl || '#'} "
														target="_blank"
														aria-label="Click to visit this page"
														class="capitalize link-underline link-underline-gray whitespace-pre-wrap">
														Vendor Login
													</a>
												</li>

												<li class="flex max-w-max items-center">
													<a
														href="{store?.adminUrl}?role=vendor&store={store?.id}"
														target="_blank"
														aria-label="Click to visit this page"
														class="capitalize link-underline link-underline-gray whitespace-pre-wrap">
														Join as Vendor
													</a>

													<div
														class="ml-2 max-w-max rounded bg-primary-500 py-[0.1rem] px-1 text-[0.5rem] font-semibold leading-3 tracking-wider text-white">
														NEW
													</div>
												</li>
											{/if}
										{/if}
									</ul>
								</li>
							{/each}
						{/if}
					{/each}

					<!-- STORE INFO -->

					<!-- <div class="col-span-1">
						<h5 class="mb-4 whitespace-nowrap font-semibold uppercase">Store Info</h5>

						<ul class="m-0 p-0 list-none flex flex-col gap-2 text-zinc-200">
							<li class="flex max-w-max items-center">
								<a
									href="/about-us"
									target="self"
									aria-label="Click to visit this page"
									class="link-underline link-underline-gray whitespace-pre-wrap">
									About Us
								</a>

								<div
									class="ml-2 max-w-max rounded bg-white py-[0.1rem] px-1 text-[0.5rem] font-semibold leading-3 tracking-wider text-primary-500">
									NEW
								</div>
							</li>

							<li class="flex max-w-max items-center">
								<a
									href="/contact-us"
									target="self"
									aria-label="Click to visit this page"
									class="link-underline link-underline-gray whitespace-pre-wrap">
									Contact Us
								</a>
							</li>

							{#if store?.isMultiVendor}
								<li class="flex max-w-max items-center">
									<a
										href="{store?.adminUrl}?role=vendor&store={$page?.data?.store}"
										target="self"
										aria-label="Click to visit this page"
										class="link-underline link-underline-gray whitespace-pre-wrap">
										Be Our Partner
									</a>
								</li>
							{/if}

							<li class="flex max-w-xs items-center">
								on:submit|preventDefault="{() =>// console.log('subscribe currently not working')}"
								<form
									class="relative">
									<input
										type="email"
										value="{email}"
										placeholder="Enter your email..."
										class="w-full bg-white text-zinc-800 py-2 pl-2 pr-28 text-sm focus:outline-none" />

									<button
										type="submit"
										class="absolute inset-y-0 right-0 w-24 px-2 bg-secondary-500 hover:bg-secondary-600 text-white transition duration-300 focus:outline-none">
										Subscribe
									</button>
								</form>
							</li>
						</ul>
					</div> -->

					<!-- POLICIES -->

					<!-- <div class="col-span-1">
						<h5 class="mb-4 whitespace-nowrap font-semibold uppercase">Policies</h5>

						<ul class="m-0 p-0 list-none flex flex-col gap-2 text-zinc-200">
							{#if pages?.length}
								{#each pages as page}
									<li class="flex max-w-max items-center">
										<a
											href="/p/{page.link || page.slug}"
											aria-label="Click to visit this page"
											class="capitalize link-underline link-underline-gray whitespace-pre-wrap">
											{page.name}
										</a>

										{#if page.new}
											<div
												class="ml-2 max-w-max rounded bg-primary-500 py-[0.1rem] px-1 text-[0.5rem] font-semibold leading-3 tracking-wider text-white">
												NEW
											</div>
										{/if}
									</li>
								{/each}
							{/if}
						</ul>
					</div> -->

					<!-- SERVICES -->

					<!-- {#if megamenu?.length}
						<div class="col-span-1">
							<h5 class="mb-4 whitespace-nowrap font-semibold uppercase">Services</h5>

							<ul class="m-0 p-0 list-none flex flex-col gap-2 text-zinc-200">
								{#each megamenu as category}
									<li class="flex max-w-max items-center">
										<a
											href="/{category.link || category.slug}"
											aria-label="Click to visit this page"
											class="link-underline link-underline-gray whitespace-pre-wrap">
											{category.name}
										</a>

										{#if category.new}
											<div
												class="ml-2 max-w-max rounded bg-white py-[0.1rem] px-1 text-[0.5rem] font-semibold leading-3 tracking-wider text-primary-500">
												NEW
											</div>
										{/if}
									</li>
								{/each}
							</ul>
						</div>
					{/if} -->

					<!-- VALUE ADDED SERVICES -->

					<!-- {#if megamenu?.length}
						<div class="col-span-1">
							<h5 class="mb-4 whitespace-nowrap font-semibold uppercase">Value Added Services</h5>

							<ul class="m-0 p-0 list-none flex flex-col gap-2 text-zinc-200">
								{#each megamenu as category}
									<li class="flex max-w-max items-center">
										<a
											href="/{category.link || category.slug}"
											aria-label="Click to visit this page"
											class="link-underline link-underline-gray whitespace-pre-wrap">
											{category.name}
										</a>

										{#if category.new}
											<div
												class="ml-2 max-w-max rounded bg-white py-[0.1rem] px-1 text-[0.5rem] font-semibold leading-3 tracking-wider text-primary-500">
												NEW
											</div>
										{/if}
									</li>
								{/each}
							</ul>
						</div>
					{/if} -->
				</ul>
			{/if}
		</div>
	</div>

	<div class="p-3 sm:px-10">
		<div
			class="container mx-auto max-w-6xl flex flex-wrap xl:grid xl:grid-cols-3 items-center justify-between gap-4">
			<p class="col-span-1 justify-start text-xs">
				Copyright © {getYear()}
				<span class="text-secondary-500">{store?.websiteName}</span>, All Rights Reserved. Powered
				by
				<a
					href="https://litekart.in/"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:underline">
					Litekart
				</a>
			</p>

			{#if store?.socialSharingButtons || store?.email}
				<ul class="col-span-1 justify-center flex flex-wrap gap-4">
					<!-- Facebook -->

					{#if store?.socialSharingButtons?.facebook?.val}
						<li class="max-w-max">
							<a
								href="{store?.socialSharingButtons?.facebook?.val}"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Click for facebook link">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 transition duration-300 hover:text-[#4267B2]"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									fill="none"
									stroke-linecap="round"
									stroke-linejoin="round">
									<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
									<path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"
									></path>
								</svg>
							</a>
						</li>
					{/if}

					<!-- Instagram -->

					{#if store?.socialSharingButtons?.instagram?.val}
						<li class="max-w-max">
							<a
								href="{store?.socialSharingButtons?.instagram?.val}"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Click for instagram link">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 transition duration-300 hover:text-[#C13584]"
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

					{#if store?.socialSharingButtons?.twitter?.val}
						<li class="max-w-max">
							<a
								href="{store?.socialSharingButtons?.twitter?.val}"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Click for twitter link">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 transition duration-300 hover:text-[#1DA1F2]"
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

					<!-- Mail -->

					{#if store?.email}
						<li class="max-w-max">
							<a href="mailto:{store?.email}" aria-label="Click to contact with mail id">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 transition duration-300 hover:text-[#c71610]"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									fill="none"
									stroke-linecap="round"
									stroke-linejoin="round">
									<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
									<rect x="3" y="5" width="18" height="14" rx="2"></rect>
									<polyline points="3 7 12 13 21 7"></polyline>
								</svg>
							</a>
						</li>
					{/if}

					<!-- Linkedin -->

					{#if store?.socialSharingButtons?.linkedin?.val}
						<li class="max-w-max">
							<a
								href="{store?.socialSharingButtons?.linkedin?.val}"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Click for linkedin link">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 transition duration-300 hover:text-[#0077b5]"
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

					<!-- Pinterest -->

					{#if store?.socialSharingButtons?.youtube?.val}
						<li class="max-w-max">
							<a
								href="{store?.socialSharingButtons?.youtube?.val}"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Click for pinterest link">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 transition duration-300 hover:text-[#c8232c]"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									fill="none"
									stroke-linecap="round"
									stroke-linejoin="round">
									<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
									<line x1="8" y1="20" x2="12" y2="11"></line>
									<path
										d="M10.7 14c.437 1.263 1.43 2 2.55 2c2.071 0 3.75 -1.554 3.75 -4a5 5 0 1 0 -9.7 1.7"
									></path>
									<circle cx="12" cy="12" r="9"></circle>
								</svg>
							</a>
						</li>
					{/if}

					<!-- Youtube -->

					{#if store?.youtubeUrl}
						<li class="max-w-max">
							<a
								href="{store?.youtubeUrl}"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Click for youtube link">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 transition duration-300 hover:text-[#FF0000]"
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
			{/if}

			{#if paymentMethodCards?.length}
				<ul class="col-span-1 justify-end flex flex-wrap gap-2 items-center m-0 p-0 list-none">
					{#each paymentMethodCards as pmc}
						<li>
							<img src="{pmc}" alt="" class="h-8 w-auto object-contain" />
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</footer>
