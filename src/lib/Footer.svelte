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
import { page } from '$app/stores'
import { fly, slide } from 'svelte/transition'
import LazyImg from './components/Image/LazyImg.svelte'
import { onMount } from 'svelte'
import { browser } from '$app/environment'
// import {
// 	address,
// 	email,
// 	facebookPage,
// 	instagramPage,
// 	linkedinPage,
// 	twitterPage,
// 	websiteName
// } from './config'

export let me, cart, store, popularSearches, megamenu

export { clazz as class }
let clazz = ''

// console.log('zzzzzzzzzzzzzzzzzz', $page)

function getYear() {
	const d = new Date()
	let year = d.getFullYear()
	return year
}

let footerItems = [
	{
		heading: 'Company',
		subMenu: [
			{ title: 'About Us', link: '/about-us', new: false },
			{ title: 'Privacy Policy', link: '/p/privacy-policy', new: false },
			{
				title: 'Terms & Conditions',
				link: '/p/terms-conditions',
				new: false
			},
			{
				title: 'Payments & Returns',
				link: '/p/payments-returns',
				new: false
			},
			{
				title: 'Printing Terms & Cancellation Policy',
				link: '/p/printing-terms-cancellation-policy',
				new: false
			}
		]
	},
	{
		heading: 'Customer service',
		subMenu: [
			{ title: 'Track Your Order', link: '##', new: false },
			{ title: 'Bulk Order Inquiry', link: '/bulk-order-inquiry', new: true },
			{
				title: 'Join as Vendor',
				link: `{$page.data.store?.adminUrl}?role=vendor&store={$page.data.store?.id}`,
				new: true,
				target: '_blank'
			}
		]
	}
]

// let popularSearches, popularSearchesCount

const items = [
	{
		label: 'Home',
		link: '/',
		icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h1"></path></svg>`
	},
	{
		label: 'Cart',
		link: '/cart',
		icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>`
	},
	{
		label: 'Categories',
		link: '/c',
		icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h1a2 2 0 012 2v2M7 7h10"></path></svg>`
	},
	{
		label: 'Account',
		link: me?.active ? '/my' : '/auth/otp-login',
		icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
	}
]

onMount(async () => {
	const res = await getStoreData()
	// try {
	// const res = await getAPI(`popular-search?store=${$page.data?.store?.id}`, $page.data.origin)
	// popularSearches = res?.data
	// popularSearchesCount = res?.count

	// console.log('popular-search = ', popularSearches)
	// } catch (e) {
	// 	toast(e, 'error')
	// } finally {
	// }

	store = res.storeOne
	megamenu = res.megamenu
	popularSearches = res.popularSearches
	if (browser) {
		// const megamenu = await getMegamenu()
		localStorage.setItem('megamenu', JSON.stringify(megamenu))
		// const home = await getHome()
		// localStorage.setItem('home', JSON.stringify(home))
	}
	// popularSearches = res
	// popularSearchesCount = res?.count
})
async function getStoreData() {
	const response = await fetch('/server/store')
	const res = await response.json()
	return res
}
// async function getMegamenu() {
// 	let megamenu = []
// 	const d = new Date()
// 	try {
// 		megamenu = await getAPI(
// 			`categories/megamenu?megamenu=true&store=${$page.data?.store?.id}`,
// 			$page.data.origin
// 		)
// 	} catch (e) {
// 		console.log('eeeeeeeeeeeeee', e)
// 	}
// 	const d3 = new Date()
// 	console.log('Megamenu loaded at hook: ', d3.getTime() - d.getTime())
// 	return megamenu
// }
// async function getHome() {
// 	let home = []
// 	const d = new Date()
// 	try {
// 		home = await getAPI(`home?store=${$page.data?.store?.id}`, $page.data.origin)
// 	} catch (e) {
// 		console.log('eeeeeeeeeeeeee', e)
// 	}
// 	const d3 = new Date()
// 	console.log('home loaded at hook: ', d3.getTime() - d.getTime())
// 	return home
// }
</script>

<div
	class="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 text-center tracking-wide text-white sm:px-10">
	<p class="mb-1 text-xl font-semibold uppercase">Truly Indian Brand</p>

	<p>Over <span class="font-semibold">2 Million</span> Happy Customers</p>
</div>

<footer class="w-full justify-center bg-gray-50 p-3 text-sm  shadow-md sm:p-10">
	<div class="container mx-auto max-w-6xl">
		<div
			class="mb-4 flex w-full flex-col flex-wrap items-start justify-start gap-5 sm:mb-8 sm:max-h-[30rem] sm:gap-10 lg:max-h-96 xl:max-h-60">
			{#each footerItems as item}
				<div>
					<h1 class="mb-4 whitespace-nowrap font-semibold uppercase">
						{item.heading}
					</h1>

					<ul class="flex flex-col gap-1 text-gray-500">
						{#each item?.subMenu as item}
							<li class="flex max-w-max items-center">
								<a
									target="{item.target}"
									href="{item.link}"
									aria-label="Click to route this page"
									class="link-underline link-underline-gray whitespace-pre-wrap">
									{item.title}
								</a>

								{#if item.new}
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

			<div>
				<h1 class="mb-4 whitespace-nowrap font-semibold uppercase">Contact Us</h1>

				<ul class="flex flex-col gap-2 text-gray-500">
					<li class="max-w-max">
						<h2 class="mb-0.5 flex items-center gap-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								></path>
							</svg>

							<span class="font-semibold">Email</span>
						</h2>

						<p>{$page.data.store?.email}</p>
					</li>

					<li class="max-w-max">
						<h1 class="mb-0.5 flex items-center gap-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
							</svg>

							<span class="font-semibold">Guaranteed Response Time</span>
						</h1>

						<p>Within 3 to 6 Hours</p>
					</li>

					<li class="max-w-max">
						<h2 class="mb-0.5 flex items-center gap-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>

							<span class="font-semibold">Working Days/Hours</span>
						</h2>

						<p>Mon – Sat / 9:30AM – 6:30PM</p>
					</li>
				</ul>
			</div>

			<div>
				<h1 class="mb-4 whitespace-nowrap font-semibold uppercase">
					Experience {$page.data.store?.websiteName} app on mobile
				</h1>

				<div class="flex items-center gap-1">
					<a href="##" aria-label="Click for the app link on Google Play">
						<img
							src="/app/google-play.png"
							alt=""
							width="128"
							class="h-auto w-32 object-contain object-left" />
					</a>

					<a href="##" aria-label="Click for the app link on App Store">
						<img
							src="/app/app-store.svg"
							alt=""
							width="128"
							class="h-auto w-32 object-contain object-left p-1" />
					</a>
				</div>
			</div>

			<div>
				<h1 class="mb-4 whitespace-nowrap font-semibold uppercase">Keep in touch</h1>

				<ul class="flex flex-wrap gap-4 text-gray-500">
					<!-- Facebook -->

					<li class="max-w-max">
						<a
							href="${$page.data.store?.facebookPage}"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Click for facebook link">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 transition duration-300	hover:text-[#4267B2]"
								viewBox="0 0 24 24"
								stroke-width="2"
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

					<!-- Instagram -->

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
								stroke-width="2"
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

					<!-- Twitter -->

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
								stroke-width="2"
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

					<!-- Mail -->

					<li class="max-w-max">
						<a
							href="mailto:{$page.data.store?.websiteEmail}"
							aria-label="Click to contact with mail id">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 transition duration-300	hover:text-[#c71610]"
								viewBox="0 0 24 24"
								stroke-width="2"
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

					<!-- Linked in -->

					<li class="max-w-max">
						<a
							href="{$page.data.store?.linkedinPage}"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Click for linked in link">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 transition duration-300	hover:text-[#0077b5]"
								viewBox="0 0 24 24"
								stroke-width="2"
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

					<!-- Youtube -->

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
								stroke-width="2"
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
				</ul>
			</div>
		</div>
		{#if popularSearches?.count > 0}
			<div class="mb-4 sm:mb-8">
				<h1 class="mb-4 flex items-center gap-4 font-semibold">
					<span class="flex-1 whitespace-nowrap uppercase"> Popular searches </span>

					<hr class="w-full border-t" />
				</h1>

				<ul class="flex flex-wrap items-center text-gray-500">
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
		{/if}

		<hr class="mb-4 w-full border-t sm:mb-8" />

		<div class="mb-4 sm:mb-8">
			<h1 class="mb-4 whitespace-nowrap font-semibold uppercase">Registered Office Address</h1>

			<p class="text-gray-500">
				{@html $page.data.store?.address}
			</p>
		</div>

		<hr class="mb-4 w-full border-t sm:mb-8" />

		<div
			class="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500 sm:gap-5 md:justify-between">
			<p>Copyright {getYear()} © {$page.data.store?.websiteName} Made with ❤️ in India</p>

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
