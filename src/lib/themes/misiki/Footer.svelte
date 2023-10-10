<style>
.link-underline {
	border-bottom-width: 0;
	background-image: linear-gradient(transparent, transparent),
		linear-gradient(rgb(249 250 251), rgb(249 250 251));
	background-size: 0 1px;
	background-position: 0 100%;
	background-repeat: no-repeat;
	transition: background-size 0.5s ease-in-out;
}

.link-underline-gray {
	background-image: linear-gradient(transparent, transparent),
		linear-gradient(rgb(107 114 128), rgb(107 114 128));
}

.link-underline:hover {
	background-size: 100% 1px;
	background-position: 0 100%;
}
</style>

<script lang="ts">
// import { fetchFooterCategories } from './services/CategoryService'
// import appStore from '$lib/assets/app/app-store.svg'
// import googlePlay from '$lib/assets/app/google-play.png'
import { getPopularSearchFromStore } from '$lib/store/popular-search'
import { navigateToProperPath } from '$lib/utils'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import type { Category } from '$lib/types'
import { browser } from '$app/environment'

export let content = ``
export let me
export let megamenu: Category[]
export let store = {}

// console.log('$page', $page)

let popularSearches = []

function getYear() {
	const d = new Date()
	let year = d.getFullYear()
	return year
}

onMount(async () => {
	if (browser) {
		popularSearches = await getPopularSearchFromStore({
			limit: 20,
			sid: null,
			origin: $page.data.origin,
			storeId: $page.data.store?.id,
			isCors: $page.data.store?.isCors
		})
	}
	// console.log('popularSearches', popularSearches)

	// const res2 = await getStoreData()

	// store = res2.storeOne
	// megamenu = res2.megamenu1
	// popularSearches = res2.popularSearches

	// if (browser) {
	// 	localStorage.setItem('megamenu', JSON.stringify(megamenu))
	// }
})

// async function getStoreData() {
// 	const response1 = await fetch('/server/store')
// 	const res = await response1.json()

// 	return res
// }

function positionToDisplayIsMultiVendor(itemsLength) {
	// console.log('itemsLength', itemsLength)

	if (itemsLength >= 2) {
		return 1
	} else {
		return 0
	}
}
</script>

<footer class="w-full justify-center bg-zinc-50 p-3 text-sm sm:p-10">
	<div class="container mx-auto max-w-6xl">
		<div
			class="mb-4 flex w-full flex-col flex-wrap items-start justify-start gap-5 sm:mb-8 sm:gap-10 h-full sm:max-h-[35rem] xl:max-h-80 overflow-hidden">
			{#if $page?.data?.menu?.length}
				{#each $page?.data?.menu as menu}
					{#if menu.menu_id === 'footer'}
						{#each menu.items as item, mx}
							<div class="max-w-xs">
								{#if item.link}
									<a
										href="{item.link || '#'} "
										target="_blank"
										aria-label="Click to visit this page"
										class="block">
										<h6 class="mb-4 whitespace-nowrap uppercase">{item.name}</h6>
									</a>
								{:else}
									<h6 class="mb-4 whitespace-nowrap uppercase">{item.name}</h6>
								{/if}

								<ul class="flex flex-col gap-1 text-zinc-500">
									{#each item.items as item2}
										<li class="flex max-w-max items-center">
											{#if item2.link}
												<a
													href="{item2.link || '#'} "
													target="_blank"
													aria-label="Click to visit this page"
													class="link-underline link-underline-gray whitespace-pre-wrap">
													{item2.name}
												</a>
											{:else}
												<p>
													{item2.name}
												</p>
											{/if}
										</li>
									{/each}

									{#if mx === positionToDisplayIsMultiVendor(menu.items?.length) && $page.data.store?.isMultiVendor}
										<li class="flex max-w-max items-center">
											<a
												href="{$page.data.store?.adminUrl || '#'} "
												target="_blank"
												aria-label="Click to visit this page"
												class="link-underline link-underline-gray whitespace-pre-wrap">
												Vendor Login
											</a>
										</li>

										<li class="flex max-w-max items-center">
											<a
												href="{$page.data.store?.adminUrl}?role=vendor&store={$page.data.store?.id}"
												target="_blank"
												aria-label="Click to visit this page"
												class="link-underline link-underline-gray whitespace-pre-wrap">
												Join as Vendor
											</a>

											<div
												class="ml-2 max-w-max rounded bg-primary-500 py-[0.1rem] px-1 text-[0.5rem] font-semibold leading-3 tracking-wider text-white">
												NEW
											</div>
										</li>
									{/if}
								</ul>
							</div>
						{/each}
					{/if}
				{/each}
			{/if}

			{#if megamenu?.length}
				<div>
					<h6 class="mb-4 whitespace-nowrap uppercase">Collections</h6>

					<ul class="flex flex-col gap-1 text-zinc-500">
						{#each megamenu as category}
							<li class="flex max-w-max items-center">
								<a
									href="{navigateToProperPath(category.link || category.slug, $page.data.origin)}"
									aria-label="Click to visit this page"
									class="link-underline link-underline-gray whitespace-pre-wrap">
									{category.name}
								</a>

								{#if category.new}
									<div
										class="ml-2 max-w-max rounded bg-primary-500 py-[0.1rem] px-1 text-[0.5rem] font-semibold leading-3 tracking-wider text-white">
										NEW
									</div>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			<div>
				<h6 class="mb-4 whitespace-nowrap uppercase">Contact Us</h6>

				<ul class="flex flex-col gap-2 text-zinc-500">
					{#if $page.data.store?.email || $page.data.store?.websiteEmail}
						<li class="max-w-max">
							<a
								href="mailto:{$page.data.store?.email || $page.data.store?.websiteEmail}"
								class="block">
								<h6 class="mb-0.5 flex items-center gap-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="h-5 w-5 shrink-0">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
										></path>
									</svg>

									<span>Email</span>
								</h6>

								<p>{$page.data.store?.email || $page.data.store?.websiteEmail}</p>
							</a>
						</li>
					{/if}

					{#if $page.data.store?.phone}
						<li class="max-w-max">
							<a href="tel:+{$page.data.store?.phone}" class="block">
								<h6 class="mb-0.5 flex items-center gap-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="h-5 w-5 shrink-0">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
										></path>
									</svg>

									<span>Phone</span>
								</h6>

								<p>{$page.data.store?.phone}</p>
							</a>
						</li>
					{/if}

					{#if $page.data.store?.guaranteed_response_time}
						<li class="max-w-max">
							<h6 class="mb-0.5 flex items-center gap-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="h-5 w-5 shrink-0">
									<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"
									></path>
								</svg>

								<span>Guaranteed Response Time</span>
							</h6>

							<p>{$page.data.store?.guaranteed_response_time}</p>
						</li>
					{/if}

					{#if $page.data.store?.store_timings}
						<li class="max-w-max">
							<h6 class="mb-0.5 flex items-center gap-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="h-5 w-5 shrink-0">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>

								<span>Working Days/Hours</span>
							</h6>

							<p>{@html $page.data.store?.store_timings}</p>
						</li>
					{/if}
				</ul>
			</div>

			<!-- <div>
				<h6 class="mb-4 whitespace-nowrap uppercase">
					Experience {$page.data.store?.websiteName} app on mobile
				</h6>

				<div class="flex items-center gap-1">
					<a
						href="https://"
						aria-label="Click for the app link on Google Play"
						target="_blank"
						rel="noopener noreferrer">
						<img src="{googlePlay}" alt="" class="h-auto w-32 object-contain object-left" />
					</a>

					<a
						href="https://"
						aria-label="Click for the app link on App Store"
						target="_blank"
						rel="noopener noreferrer">
						<img src="{appStore}" alt="" class="h-auto w-32 object-contain object-left p-1" />
					</a>
				</div>
			</div> -->

			{#if ($page.data.store?.socialSharingButtons?.active?.val && $page.data.store?.socialSharingButtons?.facebook?.val) || ($page.data.store?.socialSharingButtons?.active?.val && $page.data.store?.socialSharingButtons?.instagram?.val) || ($page.data.store?.socialSharingButtons?.active?.val && $page.data.store?.socialSharingButtons?.telegram?.val) || ($page.data.store?.socialSharingButtons?.active?.val && $page.data.store?.socialSharingButtons?.twitter?.val) || ($page.data.store?.socialSharingButtons?.active?.val && $page.data.store?.socialSharingButtons?.reddit?.val) || ($page.data.store?.socialSharingButtons?.active?.val && $page.data.store?.socialSharingButtons?.linkedin?.val) || ($page.data.store?.socialSharingButtons?.active?.val && $page.data.store?.socialSharingButtons?.pinterest?.val) || ($page.data.store?.socialSharingButtons?.active?.val && $page.data.store?.socialSharingButtons?.youtube?.val)}
				<div>
					<h6 class="mb-4 whitespace-nowrap uppercase">Keep in touch</h6>

					<ul class="flex flex-wrap gap-4 text-zinc-500">
						<!-- Facebook -->

						{#if $page.data.store?.socialSharingButtons?.active?.val && $page.data.store?.socialSharingButtons?.facebook?.val}
							<li class="max-w-max">
								<a
									href="{$page.data.store?.socialSharingButtons?.facebook?.val}"
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
										<path
											d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"
										></path>
									</svg>
								</a>
							</li>
						{/if}

						<!-- Instagram -->

						{#if $page.data.store?.socialSharingButtons?.active?.val && $page.data.store?.socialSharingButtons?.instagram?.val}
							<li class="max-w-max">
								<a
									href="{$page.data.store?.socialSharingButtons?.instagram?.val}"
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

						<!-- Telegram -->

						{#if $page.data.store?.socialSharingButtons?.active?.val && $page.data.store?.socialSharingButtons?.telegram?.val}
							<li class="max-w-max">
								<a
									href="{$page.data.store?.socialSharingButtons?.telegram?.val}"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Click for telegram link">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 transition duration-300 hover:text-[#229ED9]"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										fill="none"
										stroke-linecap="round"
										stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
										<path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4"></path>
									</svg>
								</a>
							</li>
						{/if}

						<!-- Twitter -->

						{#if $page.data.store?.socialSharingButtons?.active?.val && $page.data.store?.socialSharingButtons?.twitter?.val}
							<li class="max-w-max">
								<a
									href="{$page.data.store?.socialSharingButtons?.twitter?.val}"
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

						<!-- Reddit -->

						{#if $page.data.store?.socialSharingButtons?.active?.val && $page.data.store?.socialSharingButtons?.reddit?.val}
							<li class="max-w-max">
								<a
									href="{$page.data.store?.socialSharingButtons?.reddit?.val}"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Click for reddit link">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 transition duration-300 hover:text-[#FF5700]"
										width="44"
										height="44"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										fill="none"
										stroke-linecap="round"
										stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
										<path
											d="M12 8c2.648 0 5.028 .826 6.675 2.14a2.5 2.5 0 0 1 2.326 4.36c0 3.59 -4.03 6.5 -9 6.5c-4.875 0 -8.845 -2.8 -9 -6.294l-1 -.206a2.5 2.5 0 0 1 2.326 -4.36c1.646 -1.313 4.026 -2.14 6.674 -2.14z"
										></path>
										<path d="M12 8l1 -5l6 1"></path>
										<path d="M19 4m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
										<circle cx="9" cy="13" r=".5" fill="currentColor"></circle>
										<circle cx="15" cy="13" r=".5" fill="currentColor"></circle>
										<path d="M10 17c.667 .333 1.333 .5 2 .5s1.333 -.167 2 -.5"></path>
									</svg>
								</a>
							</li>
						{/if}

						<!-- Linkedin -->

						{#if $page.data.store?.socialSharingButtons?.active?.val && $page.data.store?.socialSharingButtons?.linkedin?.val}
							<li class="max-w-max">
								<a
									href="{$page.data.store?.socialSharingButtons?.linkedin?.val}"
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

						{#if $page.data.store?.socialSharingButtons?.active?.val && $page.data.store?.socialSharingButtons?.pinterest?.val}
							<li class="max-w-max">
								<a
									href="{$page.data.store?.socialSharingButtons?.pinterest?.val}"
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

						{#if $page.data.store?.socialSharingButtons?.active?.val && $page.data.store?.socialSharingButtons?.youtube?.val}
							<li class="max-w-max">
								<a
									href="{$page.data.store?.socialSharingButtons?.youtube?.val}"
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
				</div>
			{/if}
		</div>

		{#if popularSearches?.length > 0}
			<div class="mb-4 sm:mb-8">
				<div class="mb-4 flex items-center gap-4 font-semibold">
					<h6 class="flex-1 whitespace-nowrap uppercase">Popular searches</h6>

					<hr class="w-full border-t" />
				</div>

				<ul class="flex flex-wrap items-center text-zinc-500">
					{#each popularSearches as p, px}
						<li class="max-w-max">
							<a
								href="{navigateToProperPath(p.link || p.slug, $page.data.origin)} "
								aria-label="Click for the products related to this field"
								class="link-underline link-underline-gray capitalize">
								{p.name}
							</a>

							{#if px < popularSearches.length}
								<span class="px-2">|</span>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		{#if $page.data.store?.address}
			<hr class="mb-4 w-full border-t sm:mb-8" />

			<div class="mb-4 sm:mb-8">
				<h6 class="mb-4 whitespace-nowrap uppercase">Registered Office Address</h6>

				<p>
					{@html $page.data.store?.address}
				</p>
			</div>
		{/if}

		<hr class="mb-4 w-full border-t sm:mb-8" />

		<div class="flex flex-wrap items-center justify-between gap-5 md:justify-between">
			<p class="whitespace-nowrap">
				© {$page.data.store?.websiteName}
				Powered by
				<a
					href="{$page.data.store?.saasDomain || 'https://litekart.in'}"
					rel="external"
					class="hover:underline"
					target="_blank">
					{$page.data.store?.saasName || 'Litekart'}
				</a>
			</p>

			<div class="flex items-center justify-center gap-4 text-xs text-zinc-500">
				<!-- Contact Us -->

				<a
					href="/contact-us"
					aria-label="Click to visit this page"
					class="font-bold uppercase text-zinc-500 transition duration-300 hover:text-zinc-800">
					Contact Us
				</a>

				<!-- Faqs -->

				<a
					href="/faqs"
					aria-label="Click to visit this page"
					class="font-bold uppercase text-zinc-500 transition duration-300 hover:text-zinc-800">
					Faqs
				</a>
			</div>
		</div>

		{#if content}
			<hr class="my-4 w-full border-t sm:mb-8" />

			<div class="prose max-w-none">
				{@html content}
			</div>
		{/if}
	</div>
</footer>
