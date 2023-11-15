<script lang="ts">
import { applyAction, enhance } from '$app/forms'
import { CartService, CategoryService } from '$lib/services'
import { cubicOut } from 'svelte/easing'
import { fade, fly, slide } from 'svelte/transition'
import { fireGTagEvent } from '$lib/utils/gTagB'
import { getAPI } from '$lib/utils/api'
import { invalidateAll } from '$app/navigation'
import { logo } from '$lib/config'
import { MegaMenu, LazyImg, AutosuggestModal } from '$lib/components'
import { navigateToProperPath, toast } from '$lib/utils'
import { page } from '$app/stores'
import { WhiteButton, PrimaryButton, Skeleton } from '$lib/ui'
import Cookie from 'cookie-universal'
import dotsLoading from '$lib/assets/dots-loading.gif'
import menu from '$lib/config/menu'
import noAddToCartAnimate from '$lib/assets/no/add-to-cart-animate.svg'
import productNonVeg from '$lib/assets/product/non-veg.png'
import productVeg from '$lib/assets/product/veg.png'
import userEmptyProfile from '$lib/assets/user-empty-profile.png'
import { cartStore, getCartFromStore, updateCartStore } from '$lib/store/cart'
import { onMount } from 'svelte'
import { browser } from '$app/environment'
import { storeStore } from '$lib/store/store'

const cookies = Cookie()

export let me, data, showCartSidebar: boolean, openSidebar: boolean, store

let clazz = ''
export { clazz as class }

export function convertParagraphs(node) {
	const paragraphs = node.querySelectorAll('p')

	paragraphs.forEach((paragraph) => {
		const span = document.createElement('span')
		span.innerHTML = paragraph.innerHTML
		paragraph.parentNode.replaceChild(span, paragraph)
	})
}

let categories
let loading = false
let loadingForSelectedCartItem = []
let selectedLoadingType = null
let show = false
let showDropdownAccount = false
$: cart = {}

onMount(async () => {
	if (browser) {
		storeStore.subscribe((value) => (store = value))
		cartStore.subscribe((value) => {
			cart = value
		})
	}
})

function slideFade(node, params) {
	const existingTransform = getComputedStyle(node).transform.replace('none', '')

	return {
		delay: params.delay || 0,
		duration: params.duration || 400,
		easing: params.easing || cubicOut,
		css: (t, u) =>
			`transform-origin: ${
				params.transformOrigin || 'top right'
			}; transform: ${existingTransform} scaleX(${t}); opacity: ${t};`
	}
}

function handleShowCartSidebar() {
	if ($page?.url?.pathname !== '/cart') {
		showCartSidebar = true
		// fetchCart()
		getCategories()
	}

	return
}

// async function fetchCart() {
// 	try {
// 		loading = true

// 		const res = await CartService.fetchRefreshCart({
// 			cartId: $page.data.cartId,
// 			origin: origin,
// 			storeId: store.id
// 		})

// 		if (res) {
// 			cart = {
// 				cartId: res?.cart_id,
// 				items: res?.items,
// 				qty: res?.qty,
// 				tax: +res?.tax,
// 				subtotal: +res?.subtotal,
// 				total: +res?.total,
// 				currencySymbol: res?.currencySymbol,
// 				discount: res?.discount,
// 				savings: res?.savings,
// 				selfTakeout: res?.selfTakeout,
// 				shipping: res?.shipping,
// 				unavailableItems: res?.unavailableItems,
// 				formattedAmount: res?.formattedAmount
// 			}

// 			cookies.set('cartId', cart.cartId, { path: '/' })
// 		}
// 	} catch (e) {
// 		toast(e, 'error')
// 	} finally {
// 		loading = false
// 	}
// }

async function getCategories() {
	try {
		const res1 = await CategoryService.fetchAllCategories({
			storeId: $page.data.store,
			origin: $page.data.origin
		})

		categories = res1?.data.filter((c) => {
			return c.img
		})
	} catch (e) {
	} finally {
	}
}
</script>

<nav
	class="{clazz} sticky inset-x-0 top-0 w-full border-b bg-white shadow-xs
		{store?.hellobar?.active?.val
		? 'h-[96px] sm:h-[120px] lg:h-[168px]'
		: 'h-[56px] sm:h-[80px] lg:h-[128px]'} 
		{showCartSidebar ? 'z-50 ' : 'z-40 delay-500'}">
	{#if store?.hellobar?.active?.val}
		<div
			use:convertParagraphs
			class="h-10 text-center tracking-wider flex items-center justify-center text-xs"
			style="background-color: {store?.hellobar?.bgColor?.val || '#27272a'};
				 color: {store?.hellobar?.textColor?.val || '#ffffff'};">
			{@html store?.hellobar.content?.val}
		</div>
	{/if}

	<div class="h-14 sm:h-20 items-center px-3 sm:px-10 w-full grid grid-cols-3 gap-4 lg:gap-8">
		<div class="col-span-1 justify-self-start flex items-center">
			<!-- Hamberger Menu -->

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
		</div>

		<div class="col-span-1 justify-self-center flex items-center">
			<!-- Website Logo/Name -->

			<a href="/" aria-label="Go to home" class="block shrink-0">
				{#if $page?.data?.store?.logo}
					<LazyImg
						src="{$page?.data?.store?.logo}"
						alt="logo"
						height="64"
						aspect_ratio="4:1"
						class="max-h-10 sm:max-h-16 max-w-[160px] object-contain object-left" />
				{:else if $page?.data?.store?.websiteName}
					<h2
						class="bg-gradient-to-b from-primary-500 to-secondary-500 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl truncate w-40 sm:w-auto sm:max-w-sm">
						{$page?.data?.store?.websiteName}
					</h2>
				{:else}
					<img
						src="{logo}"
						alt="logo"
						class="max-h-10 sm:max-h-16 max-w-[160px] object-contain object-left" />
				{/if}
			</a>
		</div>

		<div class="col-span-1 flex items-center gap-4 justify-self-end">
			{#if me?.active}
				<!-- Profile -->

				<div
					class="relative hidden lg:block"
					on:mouseenter="{() => (showDropdownAccount = true)}"
					on:mouseleave="{() => (showDropdownAccount = false)}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6 cursor-pointer">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
						></path>
					</svg>

					{#if showDropdownAccount}
						<ul
							transition:slide="{{ duration: 300 }}"
							class="absolute z-50 top-7 right-0 flex min-w-max flex-col rounded-b border bg-white p-2 text-sm font-semibold shadow-inner">
							<li class="mb-2 border-b py-2 px-4">
								<a
									href="/my/profile"
									aria-label="Click to visit profile"
									class="flex items-center gap-2">
									<div class="h-10 w-10 overflow-hidden rounded-full border">
										{#if me.avatar}
											<LazyImg
												src="{me.avatar}"
												alt=""
												width="40"
												class="w-10 h-10 rounded-full object-cover object-top" />
										{:else}
											<img
												src="{userEmptyProfile}"
												alt=""
												class="h-full w-full object-cover object-top" />
										{/if}
									</div>

									<div class="flex flex-1 flex-col text-sm">
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
								<li class="h-auto w-full flex-1">
									<a
										href="{m.url}"
										aria-label="Click to visit {m.name}"
										data-sveltekit-preload-data>
										<h6
											class="w-full cursor-pointer rounded py-2 px-4 text-left transition duration-300 focus:outline-none hover:bg-primary-50">
											{m.name}
										</h6>
									</a>
								</li>
							{/each}

							<li>
								<form
									action="/auth/logout"
									method="POST"
									use:enhance="{() => {
										return async () => {
											toast('Logged out successfully', 'success')
											await invalidateAll()
										}
									}}">
									<button
										type="submit"
										class="w-full cursor-pointer rounded py-2 px-4 text-left transition duration-300 focus:outline-none hover:bg-primary-50">
										Logout
									</button>
								</form>
							</li>
						</ul>
					{/if}
				</div>
			{:else}
				<!-- Login -->

				<a
					href="{$page.data?.loginUrl || '/auth/login'}?ref={$page?.url?.pathname}{$page?.url
						?.search}"
					aria-label="Click to visit login"
					data-sveltekit-preload-data
					class="hidden lg:block">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
						></path>
					</svg>
				</a>
			{/if}

			<!-- Search -->

			<button
				type="button"
				aria-label="Click to search products..."
				class="block focus:outline-none lg:hidden"
				on:click="{() => (show = true)}">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z">
					</path>
				</svg>
			</button>

			<!-- Cart -->

			<button
				class="focus:outline-none"
				aria-label="Click to visit cart"
				on:click="{handleShowCartSidebar}">
				<div class="relative">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
						></path>
					</svg>

					{#if cart?.qty > 0}
						<div
							class="absolute -top-2 -right-1.5 flex items-center justify-center rounded-full bg-primary-500 py-[0.8px] px-[5px] text-center text-xs font-bold uppercase text-white">
							{cart.qty}
						</div>
					{/if}
				</div>
			</button>
		</div>
	</div>

	<!-- Mega menu -->

	<div class="hidden lg:flex items-center justify-center overflow-auto scrollbar-none">
		<MegaMenu class="h-12 text-sm uppercase" />
	</div>
</nav>

{#if showCartSidebar}
	<div class="fixed inset-0 z-[100] h-screen w-full">
		<button
			transition:fade="{{ duration: 500 }}"
			class="absolute inset-0 cursor-default bg-black bg-opacity-50 focus:outline-none"
			on:click="{() => (showCartSidebar = false)}">
		</button>

		<div
			transition:slideFade="{{ duration: 500 }}"
			class="absolute inset-y-0 right-0 h-full w-full border-l bg-white lg:max-w-xs">
			<button
				type="button"
				class="absolute top-5 right-4 transform cursor-pointer text-zinc-500 transition duration-300 focus:outline-none hover:scale-125 hover:text-zinc-800"
				on:click="{() => (showCartSidebar = false)}">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"></path>
				</svg>
			</button>

			<div class="h-full shrink-0">
				<h2 class="border-b p-4 text-center font-bold uppercase sm:text-lg">Cart</h2>

				<div class="h-full overflow-y-auto p-4 pb-20 overflow-x-hidden">
					{#if loading}
						<ul class="p-0 list-none mb-5 flex flex-col gap-5">
							{#each { length: 4 } as _}
								<li>
									<Skeleton small />
								</li>
							{/each}
						</ul>
					{:else if cart?.qty > 0}
						<ul class="p-0 list-none mb-5 flex flex-col gap-5">
							{#each cart?.items || [] as item, ix}
								<li class="flex items-start justify-between gap-4">
									<a
										href="/product/{item.slug}"
										aria-label="Click to visit product details page"
										class="shrink-0"
										on:click="{() => (showCartSidebar = false)}">
										<LazyImg
											src="{item.isCustomized ? item.customizedImg : item.img}"
											alt=""
											width="64"
											class="h-auto w-16 object-contain object-left" />
									</a>

									<div class="flex flex-1 flex-col gap-2 text-sm">
										<div class="flex justify-between gap-2">
											<a
												href="/product/{item.slug}"
												aria-label="Click to visit product details page"
												class="flex-1 leading-4"
												on:click="{() => (showCartSidebar = false)}">{item.name}</a>

											{#if $page?.data?.store?.isFnb && item.foodType}
												<div>
													{#if item.foodType === 'veg'}
														<img src="{productVeg}" alt="veg" class="h-5 w-5" />
													{:else if item.foodType === 'nonveg'}
														<img src="{productNonVeg}" alt="non veg" class="h-5 w-5" />
													{/if}
												</div>
											{/if}
										</div>

										<!-- options -->

										{#if item?.usedOptions?.length}
											{#each item?.usedOptions as option}
												{#if option?.val?.length && option?.val !== undefined && option?.val != ''}
													<div class="flex flex-wrap gap-2">
														<span>{option.name}:</span>

														{#if option.val}
															<ul class="flex flex-wrap items-center gap-x-2 gap-y-1">
																{#each option.val as v, valIndex}
																	{#if v}
																		<b>
																			{v}
																		</b>

																		{#if valIndex < option.val?.length - 1}
																			,
																		{/if}
																	{/if}
																{/each}
															</ul>
														{/if}
													</div>
												{/if}
											{/each}
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

										<div class="flex items-center">
											<!-- Minus icon -->

											<form
												action="/cart?/add"
												method="POST"
												use:enhance="{() => {
													loadingForSelectedCartItem[ix] = true
													return async ({ result }) => {
														fireGTagEvent('remove_from_cart', item)
														updateCartStore({ data: result.data })
														await applyAction(result)
														loadingForSelectedCartItem[ix] = false
														// fetchCart()
													}
												}}">
												<input type="hidden" name="pid" value="{item.pid || null}" />
												<input type="hidden" name="vid" value="{item.vid || null}" />
												<input type="hidden" name="qty" value="{-1}" />
												<input
													type="hidden"
													name="customizedImg"
													value="{item.customizedImg || null}" />
												<input
													type="hidden"
													name="options"
													value="{JSON.stringify(item.options) || null}" />

												<button
													type="submit"
													disabled="{loadingForSelectedCartItem[ix]}"
													class="flex transform items-center justify-center rounded-full bg-zinc-200 transition duration-300 focus:outline-none h-6 w-6
															{loadingForSelectedCartItem[ix]
														? 'cursor-not-allowed opacity-80'
														: 'cursor-pointer hover:opacity-80 active:scale-95'}">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke-width="1.5"
														stroke="currentColor"
														class="w-4 h-4 text-zinc-500">
														<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"
														></path>
													</svg>
												</button>
											</form>

											<!-- Quantity indicator -->

											<div class="mx-2 flex h-6 w-6 items-center justify-center text-xs font-bold">
												{#if selectedLoadingType !== 'delete' && loading[ix]}
													<img
														src="{dotsLoading}"
														alt="loading"
														class="h-auto w-4 object-contain object-center" />
												{:else}
													<span>{item?.qty}</span>
												{/if}
											</div>

											<!-- Puls icon -->

											<form
												action="/cart?/add"
												method="POST"
												use:enhance="{() => {
													loadingForSelectedCartItem[ix] = true
													return async ({ result }) => {
														fireGTagEvent('add_to_cart', result?.data)
														updateCartStore({ data: result.data })
														await applyAction(result)
														loadingForSelectedCartItem[ix] = false
														// fetchCart()
													}
												}}">
												<input type="hidden" name="pid" value="{item.pid || null}" />
												<input type="hidden" name="vid" value="{item.vid || null}" />
												<input type="hidden" name="qty" value="{+1}" />
												<input
													type="hidden"
													name="customizedImg"
													value="{item.customizedImg || null}" />
												<input
													type="hidden"
													name="options"
													value="{JSON.stringify(item.options) || null}" />

												<button
													type="submit"
													disabled="{loadingForSelectedCartItem[ix]}"
													class="flex transform items-center justify-center rounded-full bg-zinc-200 transition duration-300 focus:outline-none h-6 w-6
															{loadingForSelectedCartItem[ix]
														? 'cursor-not-allowed opacity-80'
														: 'cursor-pointer hover:opacity-80 active:scale-95'}">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke-width="1.5"
														stroke="currentColor"
														class="w-4 h-4 text-zinc-500">
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															d="M12 4.5v15m7.5-7.5h-15"></path>
													</svg>
												</button>
											</form>
										</div>
									</div>

									<!-- Delete icon -->

									<form
										action="/cart?/add"
										method="POST"
										use:enhance="{() => {
											selectedLoadingType = 'delete'
											loadingForSelectedCartItem[ix] = true
											return async ({ result }) => {
												fireGTagEvent('remove_from_cart', item)
												updateCartStore({ data: result.data })
												await applyAction(result)
												selectedLoadingType = null
												loadingForSelectedCartItem[ix] = false
												// fetchCart()
											}
										}}">
										<input type="hidden" name="pid" value="{item.pid || null}" />
										<input type="hidden" name="vid" value="{item.vid || null}" />
										<input type="hidden" name="qty" value="{-9999999}" />
										<input
											type="hidden"
											name="customizedImg"
											value="{item.customizedImg || null}" />
										<input
											type="hidden"
											name="options"
											value="{JSON.stringify(item.options) || null}" />

										<button
											type="submit"
											disabled="{loadingForSelectedCartItem[ix]}"
											class="flex transform items-center justify-center rounded-full bg-zinc-200 transition duration-300 focus:outline-none h-6 w-6
														{loadingForSelectedCartItem[ix]
												? 'cursor-not-allowed opacity-80'
												: 'cursor-pointer hover:opacity-80 active:scale-95'}">
											{#if selectedLoadingType === 'delete' && loading[ix]}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-4 w-4 animate-spin"
													viewBox="0 0 24 24"
													stroke-width="1.5"
													stroke="currentColor"
													fill="none"
													stroke-linecap="round"
													stroke-linejoin="round">
													<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
													<path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95"></path>
													<path d="M3.69 8.56a9 9 0 0 0 -.69 3.44"></path>
													<path d="M3.69 15.44a9 9 0 0 0 1.95 2.92"></path>
													<path d="M8.56 20.31a9 9 0 0 0 3.44 .69"></path>
													<path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95"></path>
													<path d="M20.31 15.44a9 9 0 0 0 .69 -3.44"></path>
													<path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92"></path>
													<path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69"></path>
												</svg>
											{:else}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="1.5"
													stroke="currentColor"
													class="w-4 h-4 text-zinc-500">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
													></path>
												</svg>
											{/if}
										</button>
									</form>
								</li>
							{/each}
						</ul>

						<div class="mb-10 flex flex-col gap-2">
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
						<div class="mb-10 flex flex-col items-center text-center">
							<div>
								<img
									src="{noAddToCartAnimate}"
									alt="empty listing"
									class="mb-5 h-40 object-contain" />
							</div>

							<span class="mb-3 text-xl font-medium md:text-3xl">Empty Cart!!</span>

							<span class="text-xs">
								We didn't find any item inside cart, Go ahead, order some essentials from the menu
							</span>
						</div>
					{/if}

					{#if categories?.length}
						<div
							class="mb-5 flex items-center gap-2 whitespace-nowrap text-center font-bold uppercase sm:text-lg">
							<hr class="w-full" />

							<span>Our Categories</span>

							<hr class="w-full" />
						</div>

						<div class="grid grid-cols-3">
							{#each categories as c}
								<a
									href="{navigateToProperPath(c.link || c.slug)}"
									aria-label="Click to visit category related products page"
									class="col-span-1 block transform border transition duration-500 hover:-translate-y-2 hover:shadow-lg">
									<LazyImg
										src="{c.img}"
										height="80"
										width="80"
										aspect_ratio="1:1"
										class="aspect-square w-full object-cover object-center" />
								</a>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
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
			transition:slideFade="{{ duration: 500, transformOrigin: 'top left' }}"
			class="relative z-[60] h-full w-full overflow-y-auto bg-white p-6 overflow-x-hidden">
			<!--  w-72 -->

			<button
				type="button"
				class="absolute top-5 right-4 transform cursor-pointer text-zinc-500 transition duration-300 focus:outline-none hover:scale-125 hover:text-zinc-800"
				on:click="{() => (openSidebar = false)}">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"></path>
				</svg>
			</button>

			{#if me?.active}
				<ul class="text-zinc-500">
					<!-- Profile Preview -->

					<li>
						<a
							data-sveltekit-preload-data
							href="/my/profile"
							aria-label="Click to visit profile"
							class="mb-4 flex flex-col gap-2 border-b pb-4"
							on:click="{() => (openSidebar = false)}">
							<div class="h-20 w-20 overflow-hidden rounded border">
								{#if me.avatar}
									<LazyImg
										src="{me.avatar}"
										alt=""
										width="80"
										height="80"
										class="object-cover object-top" />
								{:else}
									<img
										src="{userEmptyProfile}"
										alt=""
										class="h-full w-full object-cover object-top" />
								{/if}
							</div>

							<div class="flex flex-1 flex-col text-sm">
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

					<!-- Logout -->

					<li>
						<form
							action="/auth/logout"
							method="POST"
							use:enhance="{() => {
								return async () => {
									toast('Logged out successfully', 'success')
									await invalidateAll()
								}
							}}">
							<button type="submit" aria-label="Logout" class="flex w-full items-center gap-2 py-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="h-5 w-5">
									<path
										fill-rule="evenodd"
										d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
										clip-rule="evenodd"></path>
									<path
										fill-rule="evenodd"
										d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z"
										clip-rule="evenodd"></path>
								</svg>

								<span>Logout</span>
							</button>
						</form>
					</li>
				</ul>
			{:else}
				<!-- Login -->

				<a
					href="{$page.data?.loginUrl || '/auth/login'}?ref={$page?.url?.pathname}{$page?.url
						?.search}"
					aria-label="Click to visit login"
					data-sveltekit-preload-data
					class="flex items-center gap-2 py-2"
					on:click="{() => (openSidebar = false)}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-5 w-5">
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
