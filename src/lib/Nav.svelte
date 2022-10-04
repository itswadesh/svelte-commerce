<style>
.minimum-width-rem {
	min-width: 360px;
}

.text-rem {
	font-size: xx-small;
}
</style>

<script lang="ts">
import { getAPI, post } from '$lib/util/api'
import { currency, toast } from '$lib/util'
import { goto, invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import Cookie from 'cookie-universal'
import { fade, fly, slide } from 'svelte/transition'
import { cubicOut } from 'svelte/easing'
import { createEventDispatcher, getContext, onMount } from 'svelte'
import { WWW_URL } from './config'
import Select from 'svelte-select'
// import 'svelte-select/tailwind.css'
import Item from '$lib/AutocompleteItem.svelte'
import PrimaryButton from './ui/PrimaryButton.svelte'
import LazyImg from './components/Image/LazyImg.svelte'
import MegaMenu from './components/MegaMenu.svelte'
import WhiteButton from './ui/WhiteButton.svelte'
import menu from '$lib/config/menu'
import { gett } from './utils'

const dispatch = createEventDispatcher()
const cookies = Cookie()

export let me, cart, data, showCartSidebar, openSidebar
let selectTarget = null
let q = ''
let typingTimer
let showDropdownAccount = false
let loadingForDeleteItemFromCart = []
let categories
// console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', cart)
// if (cart) cart = JSON.parse(cart)

export const signOut = async () => {
	let logout, error

	try {
		await post('logout', {})
	} catch (e) {
		error = e
	} finally {
	}

	await cookies.set('me', null, { path: '/' })
	await cookies.set('cart', null, { path: '/' })
	await cookies.remove('token')
	await cookies.remove('sid')
	await cookies.remove('me')
	await invalidateAll()

	return { data: logout, error }
}

onMount(() => {
	q = $page.url.searchParams.get('q')
})

// onMount(() => {
//   getFace(`face`)
// })

// function getFace(id) {
//   const face = faces.generate(null, { race: 'white' })
//   faces.display(id, face)
// }

async function handleSignout() {
	try {
		await signOut()
		toast('Signed Out...', 'success')
		goto('/auth/otp-login')
	} catch (e) {
		console.log(e)
		toast(e, 'error')
	} finally {
	}
}

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

async function onSearch(filterText) {
	try {
		const res = await getAPI(`es/autocomplete?q=${filterText}&store=${$page.data.store?.id}`)
		return res?.data || []
	} catch (e) {}
}

function enterPressedOnSearch() {
	// console.log('enterPressedOnSearch.................')
}

async function onSearchSubmit({ detail }) {
	// console.log('onSearchSubmit..............')

	let u = new URL('/search', WWW_URL)
	u.searchParams.set('q', detail?.key)
	let newUrl = u.toString() + '&sort=price'
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
		const res1 = await getAPI('categories')
		categories = res1?.data.filter((c) => {
			return c.imgCdn
		})
		// console.log('res1', res1)
		// console.log('categories', categories)
	} catch (e) {
	} finally {
	}
}

const removeItemFromCart = async ({ pid, qty, customizedImg, ix }: any) => {
	try {
		loadingForDeleteItemFromCart[ix] = true
		const res = await post('carts/add-to-cart', {
			pid: pid,
			qty: qty,
			customizedImg: customizedImg || null
		})

		// cart = res
		// $page.data.cart = res

		// await refreshCart()

		await invalidateAll()
	} catch (e) {
	} finally {
		loadingForDeleteItemFromCart[ix] = false
	}
}

const optionIdentifier = 'key'
const getOptionLabel = (option) => option.key
const getSelectionLabel = (option) => option.key
</script>

<nav
	class="minimum-width-rem fixed inset-x-0 top-0 h-20 w-full justify-center border-b bg-white px-3 shadow-md sm:px-10
	{showCartSidebar ? 'z-50 ' : 'z-40 delay-500'}">
	<div class="flex w-full items-center justify-between gap-4">
		<div class="flex items-center gap-4">
			<!-- Back button -->

			{#if $page?.data?.isShowBackButton}
				<button
					type="button"
					class="block focus:outline-none sm:hidden"
					on:click="{() => window.history.go(-1)}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"
						></path>
					</svg>
				</button>
			{/if}

			<!-- Logo -->

			<a class="flex-shrink-0 py-3 " href="/" aria-label="Click to route home">
				<LazyImg src="/logo.svg" alt="" width="112" class="w-28 object-contain object-center" />
			</a>
		</div>

		<!-- Mega menu -->

		<div class="hidden lg:block">
			<MegaMenu />
		</div>

		<!-- Search box -->

		<form
			class="form-control relative z-50 hidden w-full min-w-min max-w-4xl flex-1 lg:block"
			on:submit|preventDefault="{enterPressedOnSearch}"
			bind:this="{selectTarget}">
			<!-- <button
				type="submit"
				aria-label="Click here to search input data"
				class="absolute inset-y-0 left-0 z-[60] hidden h-full w-10 flex-shrink-0 cursor-default items-center justify-center focus:outline-none sm:flex">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-gray-500"
					viewBox="0 0 20 20"
					fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
						clip-rule="evenodd"></path>
				</svg>
			</button> -->

			<Select
				appendListTarget="{selectTarget}"
				loadOptions="{onSearch}"
				on:select="{onSearchSubmit}"
				optionIdentifier="{optionIdentifier}"
				getSelectionLabel="{getSelectionLabel}"
				getOptionLabel="{getOptionLabel}"
				Item="{Item}"
				placeholder="Search for covers, cases, accessories..."
				inputStyles="cursor: text" />
			<!-- padding-left: 40px; -->
		</form>

		<div class="flex items-center">
			<!-- Search -->

			<a
				data-sveltekit-prefetch
				href="/autosuggest"
				aria-label="Click to search quizzes, videos, notes etc..."
				class="flex h-20 flex-col items-center justify-center gap-1 border-b-4 border-transparent px-2 focus:outline-none sm:px-4 lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="h-6 w-6">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
				</svg>
			</a>

			<!-- Cart -->
			<button
				class="relative h-20 gap-1 border-b-4 border-transparent px-2 focus:outline-none sm:px-4"
				aria-label="Click to route cart"
				on:click="{handleShowCartSidebar}">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 flex-shrink-0"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
				</svg>
				<span class="hidden text-center text-xs font-semibold tracking-wider lg:block"> Cart </span>
				{#if cart?.qty > 0}
					<div
						class="absolute top-3.5 right-0 flex items-center justify-center rounded-full bg-primary-500 py-0.5 px-2 text-center text-xs font-bold uppercase text-white sm:right-2 lg:top-2">
						{cart?.qty}
					</div>
				{/if}
			</button>

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
							class="absolute top-5 right-4 transform cursor-pointer text-gray-500 transition duration-300 focus:outline-none hover:scale-125 hover:text-gray-800"
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

						<div class="h-full flex-shrink-0">
							<h1 class="border-b p-4 text-center font-bold uppercase sm:text-lg">Cart</h1>

							<div class="h-full overflow-y-auto overflow-x-hidden p-4 pb-20">
								{#if cart?.qty > 0}
									<div class="mb-5 flex flex-col gap-5">
										{#each cart.items as item, ix}
											<div class="flex items-start justify-between gap-4">
												<a
													href="/product/{item.slug}"
													class="flex-shrink-0"
													on:click="{() => (showCartSidebar = false)}">
													{#if item.isCustomized}
														<LazyImg
															src="{item.customizedImg}"
															alt=""
															height="96"
															class="h-24 w-auto object-contain object-left" />
													{:else}
														<LazyImg
															src="{item.imgCdn}"
															alt=""
															height="96"
															class="h-24 w-auto object-contain object-left" />
													{/if}
												</a>

												<div class="flex flex-1 flex-col gap-1">
													<a
														href="/product/{item.slug}"
														class="text-sm leading-4"
														on:click="{() => (showCartSidebar = false)}">{item.name}</a>

													<div class="flex flex-wrap items-center gap-1">
														<span>
															{item.qty}
														</span>

														<span class="text-gray-500">x</span>

														<span class="font-semibold">
															{item.formattedItemAmount?.price}
														</span>
													</div>
												</div>

												{#if loadingForDeleteItemFromCart[ix]}
													<div>...</div>
												{:else}
													<button
														type="button"
														class="transform overflow-hidden rounded-full border p-1 text-gray-500 transition duration-300 focus:outline-none hover:scale-105 hover:border-gray-800 hover:text-gray-800"
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
															class="h-4 w-4">
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
															></path>
														</svg>
													</button>
												{/if}
											</div>
										{/each}
									</div>

									<div class="mb-10 flex flex-col gap-2">
										<a href="/cart" class="block w-full" sveltekit:prefetch>
											<WhiteButton
												type="button"
												class="w-full text-xs uppercase"
												loadingringsize="xs"
												on:click="{() => (showCartSidebar = false)}">
												View Cart
											</WhiteButton>
										</a>

										<a href="/checkout/address" class="block w-full" sveltekit:prefetch>
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
											<LazyImg
												src="/no/add-to-cart-animate.svg"
												alt="empty listing"
												height="160"
												class="mb-5 h-40 object-contain" />
										</div>

										<span class="mb-3 text-xl font-medium md:text-3xl">Empty Cart!!</span>

										<span class="text-xs">
											We didn't find any item inside cart, Go ahead, order some essentials from the
											menu
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
												href="/{c.link}"
												target="_blank"
												rel="noopener noreferrer"
												class="col-span-1 block transform border transition duration-500 hover:-translate-y-2 hover:shadow-lg">
												<LazyImg
													src="{c.imgCdn}"
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

			<!-- <div class="dropdown-end dropdown">
				<button
					title="Cart"
					tabindex="0"
					class="flex h-20 flex-col items-center justify-center gap-1 border-b-4 border-transparent px-2 focus:outline-none sm:px-4"
					aria-label="Cart">
					<div class="indicator">
						<div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 flex-shrink-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
							</svg>

							<span class="hidden text-center text-xs font-semibold tracking-wider lg:block">
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
					class="card dropdown-content card-compact mt-3 w-52 border bg-white  shadow-md">
					<div class="card-body">
						<span class="text-lg font-bold">{cart?.qty || 0} Items</span>

						<span class="font-medium text-primary-500">
							Subtotal: {currency(cart?.total || 0)}
						</span>

						<div class="card-actions">
							<a
								href="/cart"
								aria-label="Click to route cart"
								class="w-full"
								data-sveltekit-prefetch>
								<PrimaryButton loadingringsize="sm" class="w-full text-sm uppercase">
									View cart
								</PrimaryButton>
							</a>
						</div>
					</div>
				</div>
			</div> -->

			<!-- Profile -->

			{#if me?.active}
				<div
					class="relative hidden lg:block"
					on:mouseenter="{() => (showDropdownAccount = true)}"
					on:mouseleave="{() => (showDropdownAccount = false)}">
					<button
						class="h-20 gap-1 border-b-4 px-2 focus:outline-none sm:px-4
						{showDropdownAccount ? 'border-primary-500' : 'border-transparent'}">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mx-auto h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
						</svg>

						<span class="hidden text-center text-xs font-semibold tracking-wider lg:block">
							Profile
						</span>
					</button>

					{#if showDropdownAccount}
						<ul
							transition:fly="{{ y: 5, duration: 700 }}"
							class="absolute top-20 right-0 z-[100] flex min-w-max flex-col rounded-b border bg-white p-2 text-sm font-semibold  shadow-inner">
							<li class="mb-2 border-b py-2 px-4">
								<a
									href="/my/profile"
									aria-label="Click to route profile"
									class="flex items-center gap-2">
									<div class="h-10 w-10 overflow-hidden rounded-full border">
										{#if me.avatar}
											<LazyImg
												src="{me.avatar}"
												alt=""
												width="40"
												class="object-cover object-top" />
										{:else}
											<LazyImg
												src="/user-empty-profile.png"
												alt=""
												width="40"
												class="object-cover object-top" />
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
									<a href="{m.url}" aria-label="Click to route {m.name}" data-sveltekit-prefetch>
										<h6
											class="w-full cursor-pointer rounded py-2 px-4 text-left transition duration-300 focus:outline-none hover:bg-primary-50">
											{m.name}
										</h6>
									</a>
								</li>
							{/each}

							<li>
								<button
									type="button"
									on:click="{handleSignout}"
									class="w-full cursor-pointer rounded py-2 px-4 text-left transition duration-300 focus:outline-none hover:bg-primary-50">
									Logout
								</button>
							</li>
						</ul>
					{/if}
				</div>
			{/if}

			{#if !$page.data.me?.active}
				<!-- Login -->

				<a href="/auth/otp-login" aria-label="Click to route login" data-sveltekit-prefetch>
					<button
						class="h-20 gap-1 border-b-4 border-transparent px-2 focus:outline-none sm:px-4"
						aria-label="/">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mx-auto h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
						</svg>

						<span class="hidden text-center text-xs font-semibold tracking-wider lg:block">
							Login
						</span>
					</button>
				</a>
			{:else}
				<!-- Menu -->

				<button
					aria-label="Sidebar"
					type="button"
					class="flex h-20 flex-col items-center justify-center gap-1 px-4 focus:outline-none lg:hidden"
					on:click="{() => (openSidebar = true)}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
					</svg>

					<span class="hidden text-center text-xs font-semibold tracking-wider lg:block">
						Menu
					</span>
				</button>
			{/if}
		</div>
	</div>
</nav>

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
			class="relative z-[60] h-full w-full overflow-y-auto overflow-x-hidden bg-white p-6">
			<!--  w-72 -->

			<button
				type="button"
				class="absolute top-5 right-4 transform cursor-pointer text-gray-500 transition duration-300 focus:outline-none hover:scale-125 hover:text-gray-800"
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
				<ul class="text-gray-600">
					<!-- Profile Preview -->

					<li>
						<a
							data-sveltekit-prefetch
							href="/my/profile"
							aria-label="Click to route profile"
							class="mb-4 flex flex-col gap-2 border-b pb-4"
							on:click="{() => (openSidebar = false)}">
							<div class="h-20 w-20 overflow-hidden rounded-md border">
								{#if me.avatar}
									<LazyImg
										src="{me.avatar}"
										alt=""
										width="80"
										height="80"
										class="object-cover object-top" />
								{:else}
									<LazyImg
										src="/user-empty-profile.png"
										alt=""
										width="80"
										height="80"
										class="object-cover object-top" />
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
								data-sveltekit-prefetch
								href="{m.url}"
								aria-label="Click to route account"
								class="flex items-center gap-2 py-2"
								on:click="{() => (openSidebar = false)}">
								{@html m.svg}

								{m.name}
							</a>
						</li>
					{/each}

					<!-- Log Out -->

					<li>
						<button
							type="button"
							aria-label="Logout"
							class="flex w-full items-center gap-2 py-2"
							on:click="{handleSignout}">
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

							<span>Log Out</span>
						</button>
					</li>
				</ul>
			{:else}
				<!-- Login -->

				<a
					data-sveltekit-prefetch
					href="/auth/otp-login"
					aria-label="Click to route login"
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
