<style>
.minimum-width-rem {
	min-width: 360px;
}

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
import {
	Autocomplete,
	AutosuggestModal,
	AutocompleteItem,
	LazyImg,
	MegamenuHorizontal,
	MegamenuVertical
} from '$lib/components'
import { createEventDispatcher, getContext, onMount } from 'svelte'
import { cubicOut } from 'svelte/easing'
import { enhance } from '$app/forms'
import { fade, fly } from 'svelte/transition'
import { getAPI, post } from '$lib/utils/api'
import { getCdnImageUrl } from '$lib/utils'
import { goto, invalidateAll } from '$app/navigation'
import { logo } from '$lib/config'
import { page } from '$app/stores'
import { PrimaryButton, WhiteButton } from '$lib/ui'
import Cookie from 'cookie-universal'
import menu from '$lib/config/menu'

const dispatch = createEventDispatcher()
const cookies = Cookie()

export let me, cart, data, showCartSidebar, openSidebar, store

let q = ''
let showDropdownAccount = false
let show = false
let loadingForDeleteItemFromCart = []
let categories
let hellobar = $page.data.store?.hellobar || {}
// let menuItems = [
// 	{ title: 'Trending', link: '/trending-en?sort=-updatedAt' },
// 	{ title: 'Custom Design', link: '/custom-design' },
// 	{ title: 'P.A.Y.S. Program', link: '/p-a-y-s-program' }
// 	{ title: 'E Commerce Partner', link: '/e-commerce-partner' },
// 	{ title: 'Contact Us', link: '/contact-us' }
// ]
let menuItems2 = [
	{ title: 'Custom Design', link: '/custom-design' },
	{ title: 'P.A.Y.S.', link: '/p-a-y-s-program' }
]

// if (cart) cart = JSON.parse(cart)

// export const signOut = async () => {
// 	let logout, error

// 	try {
// 		await post('logout', {})
// 	} catch (e) {
// 		error = e
// 	} finally {
// 	}

// 	await cookies.set('me', null, { path: '/' })
// 	await cookies.set('cart', null, { path: '/' })
// 	await cookies.remove('token')
// 	await cookies.remove('connect.sid')
// 	await cookies.remove('me')
// 	await invalidateAll()

// 	return { data: logout, error }
// }

onMount(async () => {
	q = $page.url.searchParams.get('q')
	// const response = await fetch('/server/cart')
	// cart = await response.json()
})

// onMount(() => {
//   getFace(`face`)
// })

// function getFace(id) {
//   const face = faces.generate(null, { race: 'white' })
//   faces.display(id, face)
// }

// async function handleSignout() {
// 	try {
// 		await signOut()
// 		toast('Signed Out...', 'success')
// 		goto('/auth/login')
// 	} catch (e) {
// 		toast(e, 'error')
// 	} finally {
// 	}
// }

function slideFade(node, params) {
	const existingTransform = getComputedStyle(node).transform.replace('none', '')

	return {
		delay: params.delay || 0,
		duration: params.duration || 400,
		easing: params.easing || cubicOut,
		css: (t, u) =>
			`transform-origin: top right; transform: ${existingTransform} scaleX(${t}); opacity: ${t};`
	}
}

async function onSearchSubmit({ detail }) {
	let newUrl

	if (detail.type === 'category') {
		const u = new URL(`/${detail.slug}`, $page.data.origin)
		newUrl = u.toString()
	} else {
		const u = new URL('/search', $page.data.origin)
		u.searchParams.set('q', detail?.name)
		newUrl = u.toString() + '&sort=price'
	}

	goto(newUrl)
	dispatch('search', detail)
}

function handleShowCartSidebar() {
	if ($page?.url?.pathname !== '/cart') {
		showCartSidebar = true
		getCategories()
	}

	return
}

async function getCategories() {
	try {
		const res1 = await getAPI(`categories?store=${$page?.data?.store?.id}`, $page.data.origin)
		categories = res1?.data.filter((c) => {
			return c.img
		})
	} catch (e) {
	} finally {
	}
}

const removeItemFromCart = async ({ pid, qty, customizedImg, ix }: any) => {
	try {
		loadingForDeleteItemFromCart[ix] = true
		const res = await post(
			'carts/add-to-cart',
			{
				pid: pid,
				qty: qty,
				customizedImg: customizedImg || null,
				store: $page?.data?.store?.id
			},
			$page.data.origin
		)

		// cart = res
		// $page.data.cart = res

		// await refreshCart()
		await invalidateAll()
	} catch (e) {
	} finally {
		loadingForDeleteItemFromCart[ix] = false
	}
}

const optionIdentifier = 'name'
const getOptionLabel = (option) => option.name
const getSelectionLabel = (option) => option.name

let y
</script>

<svelte:window bind:scrollY="{y}" />

<nav
	class="fixed lg:static minimum-width-rem flex w-full flex-col items-center border-b bg-white shadow-md
	{showCartSidebar ? 'z-50 ' : 'z-40 delay-500'}
	{hellobar?.active?.val ? 'h-14 sm:h-20 lg:h-40' : 'h-14 sm:h-20 lg:h-[120px]'}">
	{#if hellobar?.active?.val}
		<div class="px-3 sm:px-10 w-full h-10 bg-zinc-100 shrink-0 hidden lg:block">
			<div
				class="container max-w-6xl mx-auto h-full w-full items-center shrink-0 grid-cols-3 gap-4 grid">
				<!-- {#if $page.data.store?.phone || $page.data.store?.email}
				<div class="flex items-center col-span-1 gap-4 text-zinc-500 justify-self-start">
					{#if $page.data.store?.phone}
						<div class="flex items-center gap-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="w-4 h-4">
								<path
									fill-rule="evenodd"
									d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z"
									clip-rule="evenodd"></path>
							</svg>

							<span>{$page.data.store?.phone}</span>
						</div>
					{/if}

					{#if $page.data.store?.email}
						<div class="flex items-center gap-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="w-4 h-4">
								<path
									d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z"
								></path>
								<path
									d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z"
								></path>
							</svg>

							<span>{$page.data.store?.email}</span>
						</div>
					{/if}
				</div>
			{/if}

			<p class="col-span-1 font-semibold text-center text-red-600 uppercase justify-self-center">
				PRICES ARE BORN HERE AND RAISED EVERYWHERE ELSE!
			</p>

			<a href="/contact-us" class="block col-span-1 text-zinc-500 justify-self-end hover:underline">
				Need Help?
			</a> -->

				{@html hellobar.content?.val}
			</div>
		</div>
	{/if}

	<div class="px-3 sm:px-10 w-full h-20 sm:shrink-0">
		<div
			class="container max-w-6xl mx-auto h-full w-full flex items-center justify-between gap-4 lg:gap-8">
			<div class="flex items-center gap-4">
				<!-- Back button -->

				{#if $page?.data?.isShowBackButton}
					<button
						type="button"
						class="shrink-0 block focus:outline-none sm:hidden"
						on:click="{() => window.history.go(-1)}">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path>
						</svg>
					</button>
				{/if}

				<!-- Website Logo/Name -->

				<a href="/" aria-label="Click to visit home" class="shrink-0 block sm:px-10">
					{#if $page?.data?.store?.logo}
						<!-- <LazyImg
							src="{$page?.data?.store?.logo}"
							alt="logo"
							height="64"
							aspect_ratio="4:1"
							class="max-h-10 sm:max-h-16 w-20 sm:w-40 object-contain object-left" /> -->
						<img
							alt="logo"
							height="160"
							src="{`${getCdnImageUrl(
								$page.data?.store?.logo,
								$page.data?.store?.IMAGE_CDN_URL
							)}?tr=h-160`}"
							class="max-h-10 sm:max-h-16 w-20 sm:w-40 object-contain object-left" />
					{:else if $page?.data?.store?.websiteName}
						<h2
							class="bg-gradient-to-b from-primary-500 to-secondary-500 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
							{$page?.data?.store?.websiteName}
						</h2>
					{:else}
						<img src="{logo}" alt="logo" class="max-h-16 w-40 object-contain object-left" />
					{/if}
				</a>
			</div>

			<!-- Search box -->

			<div class="flex-1 hidden w-full max-w-4xl min-w-min lg:block">
				<Autocomplete
					placeholder="{$page?.data?.store?.searchbarText || 'Search...'}"
					on:search="{onSearchSubmit}" />
			</div>

			<div class="flex items-center gap-4 lg:gap-8">
				<!-- Search -->

				<!-- <a
					data-sveltekit-preload-data
					href="/autosuggest"
					aria-label="Click to search quizzes, videos, notes etc..."
					class="block focus:outline-none lg:hidden">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
					</svg>
				</a> -->

				<button
					type="button"
					aria-label="Click to search quizzes, videos, notes etc..."
					class="block focus:outline-none lg:hidden"
					on:click="{() => (show = true)}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z">
						</path>
					</svg>
				</button>

				<!-- Cart -->

				<!-- <button
				class="relative flex flex-col items-center justify-center gap-1 focus:outline-none lg:border-b-4 lg:border-transparent"
				aria-label="Click to visit cart"
				on:click="{handleShowCartSidebar}"> -->
				<a
					href="/cart"
					class="relative flex flex-col items-center justify-center gap-1 focus:outline-none lg:border-b-4 lg:border-transparent"
					aria-label="Click to visit cart"
					data-sveltekit-preload-data>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
						></path>
					</svg>

					<span class="hidden text-xs font-semibold tracking-wider text-center lg:block">
						Cart
					</span>

					{#if $page?.data?.cart?.qty > 0}
						<div
							class="absolute -top-2 -right-1.5 flex items-center justify-center rounded-full bg-primary-500 py-[0.8px] px-[5px] text-center text-xs font-bold uppercase text-white">
							{$page?.data?.cart?.qty}
						</div>
					{/if}
				</a>
				<!-- </button> -->

				{#if showCartSidebar}
					<div class="fixed inset-0 z-[100] h-screen w-full">
						<button
							transition:fade="{{ duration: 500 }}"
							class="absolute inset-0 bg-black bg-opacity-50 cursor-default focus:outline-none"
							on:click="{() => (showCartSidebar = false)}">
						</button>

						<div
							transition:slideFade="{{ duration: 500 }}"
							class="absolute inset-y-0 right-0 w-full h-full bg-white border-l lg:max-w-xs">
							<button
								type="button"
								class="absolute text-zinc-500 transition duration-300 transform cursor-pointer top-5 right-4 focus:outline-none hover:scale-125 hover:text-zinc-700"
								on:click="{() => (showCartSidebar = false)}">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-5 h-5"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clip-rule="evenodd"></path>
								</svg>
							</button>

							<div class="shrink-0 h-full">
								<h1 class="p-4 font-bold text-center uppercase border-b sm:text-lg">Cart</h1>

								<div class="h-full p-4 pb-20 overflow-x-hidden overflow-y-auto">
									{#if $page.data.cartQty > 0}
										<div class="flex flex-col gap-5 mb-5">
											{#each cart?.items || [] as item, ix}
												<div class="flex items-start justify-between gap-4">
													<a
														href="/product/{item.slug}"
														class="shrink-0"
														on:click="{() => (showCartSidebar = false)}">
														{#if item.isCustomized}
															<LazyImg
																src="{item.customizedImg}"
																alt=""
																width="64"
																class="object-contain object-left w-16 h-auto" />
														{:else}
															<LazyImg
																src="{item.img}"
																alt=""
																width="64"
																class="object-contain object-left w-16 h-auto" />
														{/if}
													</a>

													<div class="flex flex-col flex-1 gap-1">
														<div class="flex justify-between gap-2 mb-2">
															<a
																href="/product/{item.slug}"
																class="flex-1 text-sm leading-4"
																on:click="{() => (showCartSidebar = false)}">{item.name}</a>

															{#if $page?.data?.store?.isFnb && item.foodType}
																<div>
																	{#if item.foodType === 'veg'}
																		<img src="/product/veg.png" alt="veg" class="w-5 h-5" />
																	{:else if item.foodType === 'nonveg'}
																		<img src="/product/non-veg.png" alt="non veg" class="w-5 h-5" />
																	{/if}
																</div>
															{/if}
														</div>

														{#if item?.usedOptions?.length}
															<div class="flex flex-col gap-2 mt-2 text-xs">
																{#each item?.usedOptions as option}
																	{#if option?.val?.length && option?.val !== undefined && option?.val != ''}
																		<div class="flex flex-wrap gap-2">
																			<h6>{option.name}:</h6>
																			{#each option.val as v}
																				{#if v}
																					<div class="font-bold">
																						{v}
																					</div>
																				{/if}
																			{/each}
																		</div>
																	{/if}
																{/each}
															</div>
														{/if}

														<div class="flex flex-wrap items-center gap-1">
															<span>
																{item.qty}
															</span>

															<span class="text-zinc-500">x</span>

															<span class="font-semibold">
																{item.formattedItemAmount?.price}
															</span>
														</div>
													</div>

													<!-- {#if loadingForDeleteItemFromCart[ix]}
													<div>...</div>
												{:else}
													<button
														type="button"
														class="p-1 overflow-hidden text-zinc-500 transition duration-300 transform border rounded-full focus:outline-none hover:scale-105 hover:border-zinc-800 hover:text-zinc-700"
														on:click="{() =>
															removeItemFromCart({
																pid: item.pid,
																qty: -999999,
																customizedImg: item.customizedImg,
																ix: ix
															})}">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															stroke-width="1.5"
															stroke="currentColor"
															class="w-4 h-4">
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
															></path>
														</svg>
													</button>
												{/if} -->
												</div>
											{/each}
										</div>

										<div class="flex flex-col gap-2 mb-10">
											<a href="/cart" class="block w-full" data-sveltekit-preload-data>
												<WhiteButton
													type="button"
													class="w-full text-xs uppercase"
													loadingringsize="xs"
													on:click="{() => (showCartSidebar = false)}">
													View Cart
												</WhiteButton>
											</a>

											<a href="/checkout/address" class="block w-full" data-sveltekit-preload-data>
												<PrimaryButton
													type="button"
													class="w-full text-xs uppercase"
													loadingringsize="xs"
													clickEffect
													on:click="{() => (showCartSidebar = false)}">
													Checkout
												</PrimaryButton>
											</a>
										</div>
									{:else}
										<div class="flex flex-col items-center mb-10 text-center">
											<div>
												<img
													src="/no/add-to-cart-animate.svg"
													alt="empty listing"
													class="object-contain h-40 mb-5" />
											</div>

											<span class="mb-3 text-xl font-medium md:text-3xl">Empty Cart!!</span>

											<span class="text-xs">
												We didn't find any item inside cart, Go ahead, order some essentials from
												the menu
											</span>
										</div>
									{/if}

									{#if categories?.length}
										<div
											class="flex items-center gap-2 mb-5 font-bold text-center uppercase whitespace-nowrap sm:text-lg">
											<hr class="w-full" />

											<span>Our Categories</span>

											<hr class="w-full" />
										</div>

										<div class="grid grid-cols-3">
											{#each categories as c}
												<a
													href="/{c.link}"
													target="_blank"
													rel="noopener noreferrer"
													class="block col-span-1 transition duration-500 transform border hover:-translate-y-2 hover:shadow-lg">
													<LazyImg
														src="{c.img}"
														class="object-cover object-center w-full aspect-square" />
												</a>
											{/each}
										</div>
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- <div class="dropdown-end dropdown">
					<button
						title="Cart"
						tabindex="0"
						class="flex flex-col items-center justify-center h-20 gap-1 px-2 border-b-4 border-transparent focus:outline-none sm:px-4"
						aria-label="Cart">
						<div class="indicator">
							<div>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="shrink-0 w-6 h-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
								</svg>

								<span class="hidden text-xs font-semibold tracking-wider text-center lg:block">
									Bag
								</span>
							</div>

							{#if cart?.qty}
								<span class="badge indicator-item badge-sm" transition:slide|local>
									{#key cart?.qty}
										<span in:fly="{{ y: -20 }}">
											{cart?.qty || 0}
										</span>
									{/key}
								</span>
							{/if}
						</div>
					</button>

					<div
						tabindex="0"
						class="mt-3 bg-white border shadow-md card dropdown-content card-compact w-52">
						<div class="card-body">
							<span class="text-lg font-bold">{cart?.qty || 0} Items</span>

							<span class="font-medium text-primary-500">
								Subtotal: {currency(cart?.total || 0)}
							</span>

							<div class="card-actions">
								<a
									href="/cart"
									aria-label="Click to visit cart"
									class="w-full"
									data-sveltekit-preload-data>
									<PrimaryButton loadingringsize="sm" class="w-full text-sm uppercase">
										View cart
									</PrimaryButton>
								</a>
							</div>
						</div>
					</div>
				</div> -->

				<a
					href="/my/wishlist?sort=-updatedAt"
					class="flex flex-col items-center justify-center gap-1 focus:outline-none lg:border-b-4 lg:border-transparent"
					aria-label="Click to visit wishlist"
					data-sveltekit-preload-data>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
						></path>
					</svg>

					<span class="hidden text-xs font-semibold tracking-wider text-center lg:block">
						Wishlist
					</span>
				</a>

				<!-- Profile -->

				{#if me?.active}
					<!-- Profile -->

					<div
						class="relative hidden lg:block"
						on:mouseenter="{() => (showDropdownAccount = true)}"
						on:mouseleave="{() => (showDropdownAccount = false)}">
						<button
							aria-label="/"
							class="flex h-20 flex-col items-center justify-center gap-1 border-b-4 focus:outline-none
						{showDropdownAccount ? 'border-primary-500' : 'border-transparent'}">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
								></path>
							</svg>

							<span class="hidden text-xs font-semibold tracking-wider text-center lg:block">
								Profile
							</span>
						</button>

						{#if showDropdownAccount}
							<ul
								transition:fly="{{ y: 5, duration: 700 }}"
								class="absolute right-0 z-50 flex flex-col p-2 text-sm font-semibold bg-white border rounded-b shadow-inner top-20 min-w-max">
								<li class="px-4 py-2 mb-2 border-b">
									<a
										href="/my/profile"
										aria-label="Click to visit profile"
										class="flex items-center gap-2">
										<div class="w-10 h-10 overflow-hidden border rounded-full">
											{#if me.avatar}
												<LazyImg
													src="{me.avatar}"
													alt=""
													width="40"
													class="object-cover object-top" />
											{:else}
												<img
													src="/user-empty-profile.png"
													alt=""
													class="object-cover object-top w-full h-full" />
											{/if}
										</div>

										<div class="flex flex-col flex-1 text-sm">
											{#if me.firstName}
												<span class="font-bold">
													Hi {me.firstName}
													{#if me.lastName}
														{me.lastName}
													{/if}
												</span>
											{/if}

											{#if me.email}
												<span>{me.email}</span>
											{:else if me.phone}
												<span>{me.phone}</span>
											{/if}
										</div>
									</a>
								</li>

								{#each menu as m}
									<li class="flex-1 w-full h-auto">
										<a
											href="{m.url}"
											aria-label="Click to visit {m.name}"
											data-sveltekit-preload-data>
											<h6
												class="w-full px-4 py-2 text-left transition duration-300 rounded cursor-pointer focus:outline-none hover:bg-zinc-100">
												{m.name}
											</h6>
										</a>
									</li>
								{/each}

								<li>
									<form action="/auth/logout" method="POST" use:enhance>
										<button
											type="submit"
											class="w-full px-4 py-2 text-left transition duration-300 rounded cursor-pointer focus:outline-none hover:bg-zinc-100">
											Logout
										</button>
									</form>
								</li>
							</ul>
						{/if}
					</div>

					<!-- Menu -->

					<button
						aria-label="Sidebar"
						type="button"
						class="focus:outline-none lg:hidden"
						on:click="{() => (openSidebar = true)}">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
						</svg>
					</button>
				{:else}
					<!-- Login -->

					<a
						href="{$page.data.loginUrl || '/auth/login'}?ref={$page?.url?.pathname}{$page?.url
							?.search}"
						aria-label="Click to visit login"
						data-sveltekit-preload-data>
						<button
							class="flex flex-col items-center justify-center gap-1 focus:outline-none lg:border-b-4 lg:border-transparent"
							aria-label="/">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
								></path>
							</svg>

							<span class="hidden text-xs font-semibold tracking-wider text-center lg:block">
								Login
							</span>
						</button>
					</a>
				{/if}
			</div>
		</div>
	</div>

	<!-- Vertical mega menu with menu items UI -->

	<!-- {#if y <= 150}
		<div class="px-3 sm:px-10 w-full border-t hidden lg:block h-10 shrink-0">
			<div class="container max-w-6xl mx-auto h-full w-full flex items-center">
				<MegamenuVertical />

				{#if menuItems?.length}
					<div class="flex items-center justify-center">
						<ul class="flex items-center">
							{#each menuItems as item}
								<li class="px-4 py-2">
									<a
										href="{item.link}"
										class="block font-semibold link-underline text-sm link-underline-gray">
										{item.title}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	{#if y > 150}
		<div
			transition:fly="{{ y: -20, duration: 500 }}"
			class="fixed inset-x-0 top-0 z-40 items-center justify-between hidden w-full h-20 gap-4 px-3 bg-white border-t border-b shadow-md lg:flex sm:px-10">
			<a class="h-full shrink-0 block" href="/" aria-label="Click to visit home">
				{#if $page?.data?.store?.logo}
					<LazyImg
						src="{$page?.data?.store?.logo}"
						alt=" "
						height="40"
						class="object-contain object-left h-auto max-h-16" />
				{:else if $page?.data?.store?.websiteName}
					<h1
						class="text-2xl font-extrabold text-transparent bg-gradient-to-b from-primary-500 to-secondary-500 bg-clip-text sm:text-3xl">
						{$page?.data?.store?.websiteName}
					</h1>
				{:else}
					<img src="{logo}" alt=" " class="object-contain object-left h-auto max-h-8" />
				{/if}
			</a>

			<div class="flex items-center container max-w-6xl justify-start">
				<MegamenuVertical height="{80}" />

				{#if menuItems?.length}
					<ul class="flex items-center text-sm xl:text-base">
						{#each menuItems as item}
							<li class="px-4">
								<a
									href="{item.link}"
									class="font-semibold block link-underline link-underline-gray">
									{item.title}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			<div class="flex items-center gap-4">
				<a
					href="/cart"
					class="relative flex flex-col items-center justify-center gap-1 focus:outline-none"
					aria-label="Click to visit cart"
					data-sveltekit-preload-data>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
						></path>
					</svg>

					{#if $page.data.cartQty > 0}
						<div
							class="absolute -top-2 -right-1.5 flex items-center justify-center rounded-full bg-primary-500 py-[0.8px] px-[5px] text-center text-xs font-bold uppercase text-white">
							{$page.data.cartQty}
						</div>
					{/if}
				</a>

				<a
					href="/my/profile"
					class="flex flex-col items-center justify-center gap-1 focus:outline-none"
					aria-label="Click to visit cart"
					data-sveltekit-preload-data>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
						></path>
					</svg>
				</a>
			</div>
		</div>
	{/if} -->

	<!-- Horizontal mega menu with menu items 2 UI -->

	{#if y <= 150}
		<div class="px-3 sm:px-10 w-full border-t hidden lg:block h-10 shrink-0">
			<div class="container max-w-6xl mx-auto h-full w-full flex items-center gap-4 justify-center">
				<MegamenuHorizontal />

				{#if menuItems2?.length}
					<ul class="flex items-center gap-4 text-sm xl:text-base">
						{#each menuItems2 as item}
							<li>
								<a href="{item.link}" class="block uppercase link-underline link-underline-gray">
									{item.title}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	{/if}

	{#if y > 150}
		<div
			transition:fly="{{ y: -20, duration: 500 }}"
			class="fixed inset-x-0 top-0 z-40 hidden w-full h-10 px-3 bg-white border-t border-b shadow-md lg:block sm:px-10">
			<div class="container mx-auto max-w-6xl flex items-center justify-between gap-4">
				<a class="h-full shrink-0 block" href="/" aria-label="Click to visit home">
					{#if $page?.data?.store?.logo}
						<LazyImg
							src="{$page?.data?.store?.logo}"
							alt=" "
							height="40"
							class="object-contain object-left h-auto max-h-8" />
					{:else if $page?.data?.store?.websiteName}
						<h1
							class="text-2xl font-extrabold text-transparent bg-gradient-to-b from-primary-500 to-secondary-500 bg-clip-text sm:text-3xl">
							{$page?.data?.store?.websiteName}
						</h1>
					{:else}
						<img src="{logo}" alt=" " class="object-contain object-left h-auto max-h-8" />
					{/if}
				</a>

				<div class="flex-1 flex items-center justify-center gap-4">
					<MegamenuHorizontal />

					{#if menuItems2?.length}
						<ul class="flex items-center gap-4 text-sm xl:text-base">
							{#each menuItems2 as item}
								<li>
									<a href="{item.link}" class="block uppercase link-underline link-underline-gray">
										{item.title}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</nav>

{#if show}
	<AutosuggestModal bind:show="{show}" />
{/if}

<!-- Sidebar -->

{#if openSidebar}
	<aside class="fixed inset-0 z-[100] flex justify-end overflow-hidden bg-transparent">
		<button
			transition:fade="{{ duration: 500 }}"
			aria-label="Sidebar"
			type="button"
			class="absolute inset-0 bg-black bg-opacity-50 focus:outline-none"
			on:click="{() => (openSidebar = false)}">
		</button>

		<div
			transition:slideFade="{{ duration: 500 }}"
			class="relative z-[60] h-full w-full overflow-y-auto bg-white p-6 overflow-x-hidden">
			<!--  w-72 -->

			<button
				type="button"
				class="absolute text-zinc-500 transition duration-300 transform cursor-pointer top-5 right-4 focus:outline-none hover:scale-125 hover:text-zinc-700"
				on:click="{() => (openSidebar = false)}">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-5 h-5"
					viewBox="0 0 20 20"
					fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"></path>
				</svg>
			</button>

			{#if me?.active}
				<ul class="text-zinc-600">
					<!-- Profile Preview -->

					<li>
						<a
							data-sveltekit-preload-data
							href="/my/profile"
							aria-label="Click to visit profile"
							class="flex flex-col gap-2 pb-4 mb-4 border-b"
							on:click="{() => (openSidebar = false)}">
							<div class="w-20 h-20 overflow-hidden border rounded">
								{#if me.avatar}
									<LazyImg
										src="{me.avatar}"
										alt=""
										width="80"
										height="80"
										class="object-cover object-top" />
								{:else}
									<img
										src="/user-empty-profile.png"
										alt=""
										class="object-cover object-top w-full h-full" />
								{/if}
							</div>

							<div class="flex flex-col flex-1 text-sm">
								{#if me.firstName}
									<span class="font-bold">
										Hi {me.firstName}
										{#if me.lastName}
											{me.lastName}
										{/if}
									</span>
								{/if}

								{#if me.email}
									<span>{me.email}</span>
								{:else if me.phone}
									<span>{me.phone}</span>
								{/if}
							</div>
						</a>
					</li>

					<!-- Menu -->

					{#each menu as m}
						<li>
							<a
								data-sveltekit-preload-data
								href="{m.url}"
								aria-label="Click to visit account"
								class="flex items-center gap-2 py-2"
								on:click="{() => (openSidebar = false)}">
								{@html m.svg}

								{m.name}
							</a>
						</li>
					{/each}

					<!-- Log Out -->

					<li>
						<form action="/auth/logout" method="POST" use:enhance>
							<button type="submit" aria-label="Logout" class="flex items-center w-full gap-2 py-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="w-5 h-5">
									<path
										fill-rule="evenodd"
										d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
										clip-rule="evenodd"></path>
									<path
										fill-rule="evenodd"
										d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z"
										clip-rule="evenodd"></path>
								</svg>

								<span>Log Out</span>
							</button>
						</form>
					</li>
				</ul>
			{:else}
				<!-- Login -->

				<a
					data-sveltekit-preload-data
					href="{$page.data.loginUrl || '/auth/login'}?ref={$page?.url?.pathname}{$page?.url
						?.search}"
					aria-label="Click to visit login"
					class="flex items-center gap-2 py-2"
					on:click="{() => (openSidebar = false)}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-5 h-5">
						<path
							fill-rule="evenodd"
							d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
							clip-rule="evenodd"></path>
						<path
							fill-rule="evenodd"
							d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
							clip-rule="evenodd"></path>
					</svg>

					<span>Login</span>
				</a>
			{/if}
		</div>
	</aside>
{/if}
