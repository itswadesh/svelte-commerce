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
	AutocompleteItem,
	AutosuggestModal,
	LazyImg,
	MegaMenu
} from '$lib/components'
import { createEventDispatcher, onMount } from 'svelte'
import { cubicOut } from 'svelte/easing'
import { enhance } from '$app/forms'
import { fade, fly } from 'svelte/transition'
import { getAPI, post } from '$lib/utils/api'
import { goto, invalidateAll } from '$app/navigation'
import { logo } from '$lib/config'
import { page } from '$app/stores'
import menu from '$lib/config/menu'
import { browser } from '$app/environment'
import { cartStore } from '$lib/store/cart'

const dispatch = createEventDispatcher()

export let me, cart, data, showCartSidebar, openSidebar, store

// console.log('$page', $page)

let categories
let loadingForDeleteItemFromCart = []
let q = ''
let show = false
let showDropdownAccount = false
let showMiniNavSearch = false
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

// 	await cookies.remove('token')
// 	await cookies.remove('connect.sid')
// 	await cookies.remove('me')
// 	await invalidateAll()

// 	return { data: logout, error }
// }

onMount(async () => {
	q = $page.url.searchParams.get('q')

	if (browser) {
		cartStore.subscribe((value) => {
			cart = value
		})
	}
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
		const res1 = await getAPI(`categories?store=${$page?.data?.storeId}`, $page.data.origin)
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
				store: $page?.data?.storeId
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
	class="fixed lg:static inset-x-0 top-0 minimum-width-rem flex w-full flex-col items-center border-b bg-white shadow-md h-14 sm:h-20 lg:h-40
	{showCartSidebar ? 'z-50 ' : 'z-40 delay-500'}">
	<div class="px-3 sm:px-10 w-full h-14 sm:h-20 lg:h-[120px] bg-zinc-50 shrink-0">
		<div
			class="container max-w-6xl mx-auto h-full w-full flex items-center justify-between gap-4 text-xs">
			<!-- login and phone -->

			<div class="flex flex-col gap-2">
				{#if me?.active}
					<!-- Profile -->

					<a
						href="/"
						aria-label="Click to visit profile"
						class="flex items-center gap-1 capitalize focus:outline-none"
						data-sveltekit-preload-data>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-5 h-5">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
							></path>
						</svg>

						<span class="hidden text-xs lg:flex items-center gap-1">
							{#if me.firstName}
								<span class="w-40 truncate">
									Hi
									<b>
										{me.firstName}
										{#if me.lastName}
											{me.lastName}
										{/if}
									</b>
								</span>
							{/if}
						</span>
					</a>
				{:else}
					<!-- Login -->

					<a
						href="{$page.data.loginUrl || '/auth/login'}?ref={$page?.url?.pathname}{$page?.url
							?.search}"
						aria-label="Click to visit login"
						class="flex items-center gap-1 uppercase focus:outline-none"
						data-sveltekit-preload-data>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-5 h-5">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
							></path>
						</svg>

						<span class="hidden text-xs lg:block">
							Welcome, you can <b>login</b> or <b>register</b>
						</span>
					</a>
				{/if}

				<!-- Email/Phone -->

				{#if $page.data.store?.email}
					<a
						href="mailto:{$page.data.store?.email}"
						aria-label="Click to visit login"
						class="flex items-center gap-1 uppercase focus:outline-none"
						data-sveltekit-preload-data>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-5 h-5">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
							></path>
						</svg>

						<span class="hidden text-xs lg:block">
							Hotline: <b>{$page.data.store?.email}</b>
						</span>
					</a>
				{:else if $page.data.store?.phone}
					<a
						href="tel:+{$page.data.store?.phone}"
						aria-label="Click to visit login"
						class="flex items-center gap-1 uppercase focus:outline-none"
						data-sveltekit-preload-data>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-5 h-5">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
							></path>
						</svg>

						<span class="hidden text-xs lg:block">
							Hotline: <b>{$page.data.store?.phone}</b>
						</span>
					</a>
				{/if}
			</div>

			<!-- Website Logo/Name -->

			<a href="/" aria-label="Go to home" class="block shrink-0">
				{#if $page?.data?.store?.logo}
					<LazyImg
						src="{$page?.data?.store?.logo}"
						alt="logo"
						height="64"
						width="160"
						aspect_ratio="4:1"
						class="max-h-10 sm:max-h-16 lg:max-h-20 object-contain object-left" />
				{:else if $page?.data?.store?.websiteName}
					<h2
						class="bg-gradient-to-b from-primary-500 to-secondary-500 bg-clip-text text-transparent truncate w-40 sm:w-auto sm:max-w-sm">
						{$page?.data?.store?.websiteName}
					</h2>
				{:else}
					<img
						src="{logo}"
						alt="logo"
						class="max-h-10 sm:max-h-16 lg:max-h-20 object-contain object-left" />
				{/if}
			</a>

			<!-- wishlist, cart, search -->

			<div class="flex flex-col gap-2">
				<div class="flex items-center gap-2">
					<a
						href="/my/wishlist?sort=-updatedAt"
						class="flex items-center gap-1 uppercase focus:outline-none"
						aria-label="Click to visit wishlist"
						data-sveltekit-preload-data>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-5 h-5">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
							></path>
						</svg>

						<span class="hidden text-xs font-semibold tracking-wider text-center lg:block">
							Wishlist : <span class="text-secondary-500"> 0 </span>
						</span>
					</a>

					<!-- Cart -->

					<a
						href="/cart"
						class="relative flex items-center gap-1 uppercase focus:outline-none"
						aria-label="Click to visit cart"
						data-sveltekit-preload-data>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-5 h-5">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
							></path>
						</svg>

						{#if cart?.qty > 0}
							<div
								class="absolute -top-2 -right-1.5 flex items-center justify-center rounded-full bg-secondary-500 py-[0.8px] px-[5px] text-center text-xs font-bold uppercase text-white">
								{cart.qty}
							</div>
						{/if}

						<span class="hidden text-xs font-semibold tracking-wider text-center lg:block">
							Shopping cart :
							<span class="text-secondary-500"> $0 </span>
						</span>
					</a>
				</div>

				<!-- Search box -->

				<div class="flex-1 hidden w-full max-w-4xl min-w-min lg:block">
					<Autocomplete
						placeholder="{$page?.data?.store?.searchbarText || 'Search...'}"
						on:search="{onSearchSubmit}" />
				</div>
			</div>
		</div>
	</div>

	<!-- Horizontal mega menu with menu items 2 UI -->

	{#if y <= 150}
		<div class="px-3 sm:px-10 w-full border-t hidden lg:block h-10 shrink-0">
			<div
				class="container mx-auto max-w-6xl w-full flex items-center justify-center gap-4 overflow-hidden">
				<MegaMenu applyBottomBorderColor class="h-10" />

				<!-- {#if menuItems2?.length}
					<ul class="h-10 flex items-center gap-4 text-sm xl:text-base">
						{#each menuItems2 as item}
							<li>
								<a
									href="{item.link}"
									class="block whitespace-nowrap uppercase link-underline link-underline-gray">
									{item.title}
								</a>
							</li>
						{/each}
					</ul>
				{/if} -->
			</div>
		</div>
	{/if}

	{#if y > 150}
		<div
			transition:fly="{{ y: -20, duration: 500 }}"
			class="fixed inset-x-0 top-0 z-40 hidden w-full h-auto max-h-max px-3 sm:px-10 lg:block bg-white/75 border-t border-b shadow-md">
			<div class="container mx-auto max-w-6xl">
				<div class="flex items-center justify-between gap-4">
					<a href="/" aria-label="Go to home" class="block shrink-0">
						{#if $page?.data?.store?.logo}
							<LazyImg
								src="{$page?.data?.store?.logo}"
								alt="logo"
								height="32"
								width="96"
								aspect_ratio="4:1"
								class="max-h-8 w-auto object-contain object-left" />
						{:else if $page?.data?.store?.websiteName}
							<h2
								class="bg-gradient-to-b from-primary-500 to-secondary-500 bg-clip-text text-transparent truncate w-40 sm:w-auto sm:max-w-sm">
								{$page?.data?.store?.websiteName}
							</h2>
						{:else}
							<img src="{logo}" alt="logo" class="max-h-8 w-auto object-contain object-left" />
						{/if}
					</a>

					<!-- Megamenu -->

					<div class="flex items-center gap-4">
						<MegaMenu applyBottomBorderColor class="h-10" />
					</div>

					<div class="flex items-center gap-4">
						<!-- Search -->

						<button
							type="button"
							aria-label="Click to search quizzes, videos, notes etc..."
							class="focus:outline-none"
							on:click="{() => (showMiniNavSearch = !showMiniNavSearch)}">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-5 h-5">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z">
								</path>
							</svg>
						</button>

						<!-- Cart -->

						<a
							href="/cart"
							class="relative focus:outline-none"
							aria-label="Click to visit cart"
							data-sveltekit-preload-data>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-5 h-5">
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
						</a>

						<!-- Profile/Login -->

						<a
							href="{me?.active ? '/my/profile' : $page.data.loginUrl || '/auth/login'}?ref={$page
								?.url?.pathname}{$page?.url?.search}"
							aria-label="{me?.active ? 'Click to visit profile' : 'Click to visit login'}"
							title="{me?.active ? 'Click to visit profile' : 'Click to visit login'}"
							data-sveltekit-preload-data>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-5 h-5">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
								></path>
							</svg>
						</a>
					</div>
				</div>

				<!-- Search box -->

				{#if showMiniNavSearch}
					<div class="py-2 w-full">
						<Autocomplete
							placeholder="{$page?.data?.store?.searchbarText || 'Search...'}"
							on:search="{onSearchSubmit}" />
					</div>
				{/if}
			</div>
		</div>
	{/if}
</nav>

{#if show}
	<AutosuggestModal bind:show />
{/if}

{#if showMiniNavSearch}
	<button
		type="button"
		class="fixed inset-0 z-30 bg-black/0 cursor-auto focus:outline-none"
		on:click="{() => (showMiniNavSearch = false)}">
	</button>
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
