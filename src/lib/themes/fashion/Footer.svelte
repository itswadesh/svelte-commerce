<script lang="ts">
// import { fetchFooterCategories } from './services/CategoryService'
// import appStore from '$lib/assets/app/app-store.svg'
// import googlePlay from '$lib/assets/app/google-play.png'
import { browser } from '$app/environment'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { PageService } from '$lib/services'
import { Textbox } from '$lib/ui'
import { toast } from '$lib/utils'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import type { Category } from '$lib/types'

export let me
export let store = {}
export let popularSearches: { took: 0; count: 0; data: [] }
export let megamenu: Category[]

function getYear() {
	const d = new Date()
	let year = d.getFullYear()
	return year
}

let pages = []
let emailAddress = ''

onMount(async () => {
	const res1 = await getPages()
	const res2 = await getStoreData()

	store = res2.storeOne
	megamenu = res2.megamenu1
	popularSearches = res2.popularSearches

	if (browser) {
		localStorage.setItem('megamenu', JSON.stringify(megamenu))
	}
})

async function getStoreData() {
	const response1 = await fetch('/server/store')
	const res = await response1.json()

	return res
}

async function getPages() {
	try {
		pages = await PageService.fetchPages({
			origin: $page.data.origin,
			storeId: $page.data.storeId
		})
	} catch (e) {
		console.error(e)
	}
}

function subscribedForNewsletter() {
	toast('Currently not working', 'info')
	return
}
</script>

<footer class="p-3 py-10 sm:px-10 sm:py-20 text-sm text-zinc-500">
	<div class="mb-10 sm:mb-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
		{#if $page.data.store?.description}
			<div class="col-span-1 flex flex-col gap-4 justify-self-left">
				<h5 class="whitespace-nowrap uppercase text-zinc-800">
					About {$page.data.store?.websiteName}
				</h5>

				<p class="max-w-xs">
					{@html $page.data.store?.description}
				</p>

				{#if $page.data.store?.phone}
					<div class="flex flex-wrap items-center gap-2">
						<h6>Contact No. :-</h6>

						<a href="tel:+{$page.data.store?.phone}" class="block underline hover:text-zinc-800">
							{$page.data.store?.phone}
						</a>
					</div>
				{/if}

				{#if $page.data.store?.email}
					<div class="flex flex-wrap items-center gap-2">
						<h6>Mail :-</h6>

						<a href="mailto:{$page.data.store?.email}" class="block underline hover:text-zinc-800">
							{$page.data.store?.email}
						</a>
					</div>
				{/if}

				{#if $page.data.store?.socialSharingButtons || $page.data.store?.email}
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
										class="h-5 w-5 transition duration-300 hover:text-zinc-800"
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
										class="h-5 w-5 transition duration-300 hover:text-zinc-800"
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
										class="h-5 w-5 transition duration-300 hover:text-zinc-800"
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
										class="h-5 w-5 transition duration-300 hover:text-zinc-800"
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
										class="h-5 w-5 transition duration-300 hover:text-zinc-800"
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

						<!-- Mail -->

						{#if $page.data.store?.email}
							<li class="max-w-max">
								<a
									href="mailto:{$page.data.store?.email}"
									aria-label="Click to contact with mail id">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 transition duration-300 hover:text-zinc-800"
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

						{#if $page.data.store?.socialSharingButtons?.active?.val && $page.data.store?.socialSharingButtons?.linkedin?.val}
							<li class="max-w-max">
								<a
									href="{$page.data.store?.socialSharingButtons?.linkedin?.val}"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Click for linkedin link">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 transition duration-300 hover:text-zinc-800"
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
										class="h-5 w-5 transition duration-300 hover:text-zinc-800"
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
										class="h-5 w-5 transition duration-300 hover:text-zinc-800"
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
			</div>
		{/if}

		<div
			class="col-span-1 flex flex-col gap-4 justify-self-left sm:justify-self-right md:justify-self-center">
			<h5 class="whitespace-nowrap uppercase text-zinc-800">Customer Service</h5>

			<ul class="flex flex-col gap-1">
				{#if pages?.length}
					{#each pages as page}
						<li class="flex max-w-max items-center">
							<a
								href="/p/{page.link || page.slug}"
								aria-label="Click to visit this page"
								class="hover:text-zinc-800 whitespace-pre-wrap">
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

				<li class="flex max-w-max items-center">
					<a
						href="/blogs"
						aria-label="Click to visit this page"
						class="hover:text-zinc-800 whitespace-pre-wrap">
						Blogs
					</a>
				</li>

				<li class="flex max-w-max items-center">
					<a
						href="/my/orders"
						aria-label="Click to visit this page"
						class="hover:text-zinc-800 whitespace-pre-wrap">
						Track Your Order
					</a>
				</li>

				{#if $page.data.store?.isMultiVendor}
					<li class="flex max-w-max items-center">
						<a
							href="{$page.data.store?.adminUrl}"
							target="_blank"
							aria-label="Click to visit this page"
							class="hover:text-zinc-800 whitespace-pre-wrap">
							Vendor Login
						</a>
					</li>

					<li class="flex max-w-max items-center">
						<a
							href="{$page.data.store?.adminUrl}?role=vendor&store={$page.data.storeId}"
							target="_blank"
							aria-label="Click to visit this page"
							class="hover:text-zinc-800 whitespace-pre-wrap">
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

		<form
			on:submit|preventDefault="{subscribedForNewsletter}"
			class="col-span-1 flex flex-col gap-4 max-w-xs justify-self-left md:justify-self-end">
			<h5 class="whitespace-nowrap uppercase text-zinc-800">Newsletter</h5>

			<p>Subscribe to receive updates, access to exclusive deals, and more.</p>

			<Textbox
				type="text"
				bind:value="{emailAddress}"
				placeholder="Enter your email address"
				class="w-full" />

			<PrimaryButton type="submit" blackBackground roundedNone disabled class="max-w-max uppercase">
				Subscribe
			</PrimaryButton>
		</form>
	</div>

	<div
		class="flex flex-col sm:flex-row items-center justify-center sm:justify-between text-sm text-zinc-500 gap-5 md:justify-between">
		<p class="text-center sm:text-left flex flex-col gap-1">
			<span>
				© {$page.data.store?.websiteName}
			</span>

			<span>
				Powered by <a
					href="{$page.data.store?.saasDomain}"
					rel="external"
					class="hover:underline"
					target="_blank">
					{$page.data.store?.saasName}
				</a>
			</span>
		</p>

		<div class="flex items-center justify-center gap-4">
			<a
				href="/contact-us"
				aria-label="Click to visit this page"
				class="uppercase text-zinc-500 transition duration-300 hover:text-zinc-700">
				Contact Us
			</a>

			<a
				href="/faqs"
				aria-label="Click to visit this page"
				class="uppercase text-zinc-500 transition duration-300 hover:text-zinc-700">
				Faqs
			</a>
		</div>
	</div>
</footer>
