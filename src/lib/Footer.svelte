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
import { browser } from '$app/environment'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import appStore from '$lib/assets/app/app-store.svg'
import googlePlay from '$lib/assets/app/google-play.png'
import type { Category, Me } from './types'
// import { fetchFooterCategories } from './services/CategoryService'

export let store = {},
	popularSearches: { took: 0; count: 0; data: [] },
	megamenu: Category[]

// let categories = []

// onMount(async () => {
// await getCategories()
// })

// async function getCategories() {
// 	try {
// categories= await fetchFooterCategories({
// 	origin: $page?.data?.origin,
// 	storeId: $page?.data?.store?.id
// })
// const megamenu2 = await fetchMegamenuData({
// 	storeId: $page?.data?.store?.id,
// 	origin: $page.data?.origin
// })
// localStorage.setItem('megamenu', JSON.stringify(megamenu2))
// 	} catch (e) {
// 	} finally {
// 	}
// }

function getYear() {
	const d = new Date()
	let year = d.getFullYear()
	return year
}

let footerItems: any = [
	{
		heading: 'Store Info',
		subMenu: [
			{ title: 'About Us', link: '/about-us', new: false },
			{ title: 'Privacy Policy', link: '/privacy-policy', new: false },
			{
				title: 'Terms & Conditions',
				link: '/terms-conditions',
				new: false
			},
			{
				title: 'Payments & Returns',
				link: '/payments-returns',
				new: false
			},
			{
				title: 'Printing Terms & Cancellation Policy',
				link: '/printing-terms-cancellation-policy',
				new: false
			},
			{ title: 'Track Your Order', link: '/my/orders?sort=-updatedAt', new: false },
			{ title: 'Bulk Order Inquiry', link: '/bulk-order-inquiry', new: true },
			{ title: 'Blogs', link: '/blogs', new: false },
			{
				title: 'Join as Vendor',
				link: `${$page.data.store?.adminUrl}?role=vendor&store=${$page.data.store?.id}`,
				new: true,
				target: '_blank'
			}
		]
	}
]

onMount(async () => {
	const res = await getStoreData()
	store = res.storeOne
	megamenu = res.megamenu
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

<footer class="w-full justify-center bg-gray-50 p-3 text-sm sm:p-10">
	<div class="container mx-auto max-w-6xl">
		<div
			class="mb-4 flex w-full flex-col flex-wrap items-start justify-start gap-5 sm:mb-8 sm:max-h-[30rem] sm:gap-10 lg:max-h-96 xl:max-h-60">
			{#if footerItems?.length}
				{#each footerItems as item}
					<div>
						<h5 class="mb-4 whitespace-nowrap font-semibold uppercase">
							{item.heading}
						</h5>

						<ul class="flex flex-col gap-1 text-gray-500">
							{#each item?.subMenu as itm}
								<li class="flex max-w-max items-center">
									<a
										href="{itm.link}"
										aria-label="Click to route this page"
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

					<ul class="flex flex-col gap-1 text-gray-500">
						{#each megamenu as category}
							<li class="flex max-w-max items-center">
								<a
									href="/{category.link || category.slug}"
									aria-label="Click to route this page"
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
				<h5 class="mb-4 whitespace-nowrap font-semibold uppercase">Contact Us</h5>

				<ul class="flex flex-col gap-2 text-gray-500">
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

			<div>
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
			</div>

			{#if $page.data.store?.facebookPage || $page.data.store?.instagramPage || $page.data.store?.twitterPage || $page.data.store?.email || $page.data.store?.linkedinPage || $page.data.store?.pinterestPage || $page.data.store?.youtubeChannel}
				<div>
					<h5 class="mb-4 whitespace-nowrap font-semibold uppercase">Keep in touch</h5>

					<ul class="flex flex-wrap gap-4 text-gray-500">
						<!-- Facebook -->

						{#if $page.data.store?.facebookPage}
							<li class="max-w-max">
								<a
									href="{$page.data.store?.facebookPage}"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Click for facebook link">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 transition duration-300	hover:text-[#4267B2]"
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

						{#if $page.data.store?.instagramPage}
							<li class="max-w-max">
								<a
									href="{$page.data.store?.instagramPage}"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Click for instagram link">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 transition duration-300	hover:text-[#C13584]"
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

						{#if $page.data.store?.twitterPage}
							<li class="max-w-max">
								<a
									href="{$page.data.store?.twitterPage}"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Click for twitter link">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 transition duration-300	hover:text-[#1DA1F2]"
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

						{#if $page.data.store?.email}
							<li class="max-w-max">
								<a
									href="mailto:{$page.data.store?.email}"
									aria-label="Click to contact with mail id">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 transition duration-300	hover:text-[#c71610]"
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

						{#if $page.data.store?.linkedinPage}
							<li class="max-w-max">
								<a
									href="{$page.data.store?.linkedinPage}"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Click for linkedin link">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 transition duration-300	hover:text-[#0077b5]"
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

						{#if $page.data.store?.pinterestPage}
							<li class="max-w-max">
								<a
									href="{$page.data.store?.pinterestPage}"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Click for pinterest link">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 transition duration-300	hover:text-[#c8232c]"
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

						{#if $page.data.store?.youtubeChannel}
							<li class="max-w-max">
								<a
									href="{$page.data.store?.youtubeChannel}"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Click for youtube link">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 transition duration-300	hover:text-[#FF0000]"
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

		{#if popularSearches?.count > 0}
			<div class="mb-4 sm:mb-8">
				<h2 class="mb-4 flex items-center gap-4 font-semibold">
					<span class="flex-1 whitespace-nowrap uppercase"> Popular searches </span>

					<hr class="w-full border-t" />
				</h2>

				<ul class="flex flex-wrap items-center text-gray-500">
					{#each popularSearches.data as p, px}
						<li class="max-w-max">
							<a
								href="/search?q={p.text}"
								aria-label="Click for the products related to this field"
								class="link-underline link-underline-gray uppercase">
								{p.text}
							</a>

							{#if px < popularSearches.count - 1}
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
				<h2 class="mb-4 whitespace-nowrap font-semibold uppercase">Registered Office Address</h2>

				<p class="text-gray-500">
					{@html $page.data.store?.address}
				</p>
			</div>
		{/if}

		<hr class="mb-4 w-full border-t sm:mb-8" />

		<div
			class="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500 sm:gap-5 md:justify-between">
			<p>Copyright {getYear()} © {$page.data.store?.websiteName} made with ❤️ in India</p>

			<div class="flex items-center justify-center gap-4">
				<a
					href="/contact-us"
					aria-label="Click to route this page"
					class="font-bold uppercase text-primary-500 transition duration-300 hover:text-primary-700">
					Contact Us
				</a>

				<a
					href="/faqs"
					aria-label="Click to route this page"
					class="font-bold uppercase text-primary-500 transition duration-300 hover:text-primary-700">
					Faqs
				</a>
			</div>
		</div>
	</div>
</footer>
