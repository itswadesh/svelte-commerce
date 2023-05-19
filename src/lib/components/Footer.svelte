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
import { browser } from '$app/environment'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import appStore from '$lib/assets/app/app-store.svg'
import googlePlay from '$lib/assets/app/google-play.png'
import type { Category } from '$lib/types'

// console.log('$page', $page)

export let me
export let store = {}
export let popularSearches: { took: 0; count: 0; data: [] }
export let megamenu: Category[]

function getYear() {
	const d = new Date()
	let year = d.getFullYear()
	return year
}

let footerItems: any = [
	{
		heading: 'Company',
		subMenu: [
			{
				title: '(870) 932-9077 1407 Mitzi LnJonesboro, Arkansas(AR), 72401',
				link: '/about-us',
				new: false
			}
			// { title: 'Privacy Policy', link: '/privacy-policy', new: false },
			// {
			// 	title: 'Terms & Conditions',
			// 	link: '/terms-conditions',
			// 	new: false
			// },
			// {
			// 	title: 'Payments & Returns',
			// 	link: '/payments-returns',
			// 	new: false
			// },
			// { title: 'Blogs', link: '/blogs', new: false },
			// {
			// 	title: 'Join as Vendor',
			// 	link: `${$page.data.store?.adminUrl}?role=vendor&store=${$page.data.store?.id}`,
			// 	new: true,
			// 	target: '_blank'
			// }
		]
	}
	// {
	// 	heading: 'Customer service',
	// 	subMenu: [
	// 		{ title: 'Track Your Order', link: '##', new: false },
	// 		{ title: 'Bulk Order Inquiry', link: '/bulk-order-inquiry', new: true }
	// 	]
	// }
]

onMount(async () => {
	const res = await getStoreData()
	store = res.storeOne
	megamenu = res.megamenu1
	popularSearches = res.popularSearches
	if (browser) {
		localStorage.setItem('megamenu', JSON.stringify(megamenu))
	}
})
async function getStoreData() {
	const response = await fetch('/server/store')
	const res = await response.json()
	return res
}
</script>

<footer class="w-full justify-center bg-slate-900 text-white p-3 text-sm sm:p-10">
	<div class="container mx-auto max-w-6xl">
		<div
			class="mb-4 flex w-full flex-col flex-wrap items-start justify-start gap-5 sm:mb-8 sm:gap-10 h-full sm:max-h-[35rem] xl:max-h-80 overflow-hidden">
			{#if footerItems?.length}
				{#each footerItems as item}
					<div>
						<h5 class="mb-4 whitespace-nowrap font-semibold uppercase">
							{item.heading}
						</h5>

						<ul class="flex flex-col gap-1 text-zinc-500">
							{#each item?.subMenu as itm}
								<li class="flex max-w-max items-center">
									<a
										href="{itm.link}"
										target="{item.target || 'self'}"
										aria-label="Click to visit this page"
										class="link-underline link-underline-gray whitespace-pre-wrap">
										{itm.title}
									</a>

									{#if itm.new}
										<div
											class="ml-2 max-w-max rounded bg-primary-500 py-[0.1rem] px-1 text-[0.5rem] font-semibold leading-3 tracking-wider text-white">
											NEW
										</div>
									{/if}
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			{/if}

			{#if megamenu?.length}
				<div>
					<h5 class="mb-4 whitespace-nowrap font-semibold uppercase">Collections</h5>

					<ul class="flex flex-col gap-1 text-zinc-500">
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
				<h5 class="mb-4 whitespace-nowrap font-semibold uppercase">Best Products</h5>

				<ul class="flex flex-col gap-2 text-zinc-500">
					<li class="max-w-max">
						<a href="#" class="group block">
							<h6 class="mb-0.5 flex items-center gap-1 font-semibold">
								<span></span>
							</h6>

							<span class="group-hover:underline">Double Beds</span>
						</a>
					</li>
					<li class="max-w-max">
						<a href="#" class="group block">
							<h6 class="mb-0.5 flex items-center gap-1 font-semibold">
								<span></span>
							</h6>

							<span class="group-hover:underline">Sofa Set</span>
						</a>
					</li>
					<li class="max-w-max">
						<a href="#" class="group block">
							<h6 class="mb-0.5 flex items-center gap-1 font-semibold">
								<span></span>
							</h6>

							<span class="group-hover:underline">Home Decore</span>
						</a>
					</li>
				</ul>
			</div>
			<div>
				<h5 class="mb-4 whitespace-nowrap font-semibold uppercase">Useful Links</h5>

				<ul class="flex flex-col gap-2 text-zinc-500">
					<li class="max-w-max">
						<a href="/contact-us" class="group block">
							<h6 class="mb-0.5 flex items-center gap-1 font-semibold">
								<span></span>
							</h6>

							<span class="group-hover:underline">Contact us</span>
						</a>
					</li>
					<li class="max-w-max">
						<a href="/about-us" class="group block">
							<h6 class="mb-0.5 flex items-center gap-1 font-semibold">
								<span></span>
							</h6>

							<span class="group-hover:underline">About Us</span>
						</a>
					</li>
					<li class="max-w-max">
						<a href="/cart" class="group block">
							<h6 class="mb-0.5 flex items-center gap-1 font-semibold">
								<span></span>
							</h6>

							<span class="group-hover:underline">Cart </span>
						</a>
					</li>
				</ul>
			</div>
			<div>
				<h5 class="mb-4 whitespace-nowrap font-semibold uppercase">Contact Us</h5>

				<ul class="flex flex-col gap-2 text-zinc-500">
					{#if $page.data.store?.email}
						<li class="max-w-max">
							<a href="mailto:{$page.data.store?.email}" class="group block">
								<h6 class="mb-0.5 flex items-center gap-1 font-semibold">
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

								<span class="group-hover:underline">{$page.data.store?.email}</span>
							</a>
						</li>
					{/if}

					{#if $page.data.store?.phone}
						<li class="max-w-max">
							<a href="tel:+{$page.data.store?.phone}" class="group block">
								<h6 class="mb-0.5 flex items-center gap-1 font-semibold">
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

								<span class="group-hover:underline">{$page.data.store?.phone}</span>
							</a>
						</li>
					{/if}

					<li class="max-w-max">
						<h6 class="mb-0.5 flex items-center gap-1 font-semibold">
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

						<p>Within 24 Hours</p>
					</li>

					<li class="max-w-max">
						<h6 class="mb-0.5 flex items-center gap-1 font-semibold">
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

						<p>Mon – Sat / 7AM – 9PM</p>
					</li>
				</ul>
			</div>

			<!-- <div>
				<h5 class="mb-4 whitespace-nowrap font-semibold uppercase">
					Experience {$page.data.store?.websiteName} app on mobile
				</h5>

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
		</div>

		<!-- {#if popularSearches?.count > 0}
			<div class="mb-4 sm:mb-8">
				<h2 class="mb-4 flex items-center gap-4 font-semibold">
					<span class="flex-1 whitespace-nowrap uppercase"> Popular searches </span>

					<hr class="w-full border-t" />
				</h2>

				<ul class="flex flex-wrap items-center text-zinc-500">
					{#each popularSearches.data as p, px}
						<li class="max-w-max">
							<a
								href="/search?q={p.text}"
								aria-label="Click for the products related to this field"
								class="link-underline link-underline-gray capitalize">
								{p.text}
							</a>

							{#if px < popularSearches.count - 1}
								<span class="px-2">|</span>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/if} -->

		<!-- {#if $page.data.store?.address}
			<hr class="mb-4 w-full border-t sm:mb-8" />

			<div class="mb-4 sm:mb-8">
				<h2 class="mb-4 whitespace-nowrap font-semibold uppercase">Registered Office Address</h2>

				<p class="text-zinc-500">
					{@html $page.data.store?.address}
				</p>
			</div>
		{/if} -->

		<hr class="mb-4 w-full border-t sm:mb-8" />

		<div
			class="flex flex-wrap items-center justify-center gap-2 text-sm text-zinc-500 sm:gap-5 md:justify-between">
			<p>
				Copyright {getYear()} © {$page.data.store?.websiteName} | Powered by
				<a href="https://litekart.in">Litekart</a>
				made with ❤️
			</p>

			<div class="flex items-center justify-center gap-4">
				<a
					href="/contact-us"
					aria-label="Click to visit this page"
					class="font-bold uppercase text-primary-500 transition duration-300 hover:text-primary-700">
					Contact Us
				</a>

				<a
					href="/faqs"
					aria-label="Click to visit this page"
					class="font-bold uppercase text-primary-500 transition duration-300 hover:text-primary-700">
					Faqs
				</a>
			</div>
		</div>
	</div>
</footer>
