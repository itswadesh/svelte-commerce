<style>
.minimum-width-rem {
	min-width: 360px;
}
</style>

<script lang="ts">
import { Autocomplete } from '$lib/components'
import { AutosuggestModal, MegaMenu, LazyImg } from '$lib/components'
import { createEventDispatcher, onMount } from 'svelte'
import { cubicOut } from 'svelte/easing'
import { enhance } from '$app/forms'
import { fade, slide } from 'svelte/transition'
import { goback, toast } from '$lib/utils'
import { goto, invalidateAll } from '$app/navigation'
import { logo } from '$lib/config'
import { page } from '$app/stores'
import Cookie from 'cookie-universal'
import menu from '$lib/config/menu'
import PincodeInputBox from '$lib/themes/misiki/PincodeInputBox.svelte'
import userEmptyProfile from '$lib/assets/user-empty-profile.png'

const dispatch = createEventDispatcher()
const cookies = Cookie()

export let me: Me, cart: Cart, data, showCartSidebar: boolean, openSidebar: boolean, store

let clazz = ''
export { clazz as class }

let hellobar = $page.data.store?.hellobar || {}
let pin = ''
let q = ''
let show = false
let showDropdownAccount = false
let showPincodeInputBox = false

onMount(async () => {
	q = $page.url.searchParams.get('q')
	// const response = await fetch('/server/cart')
	// cart = await response.json()

	pin = cookies.get('zip')
})

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
		newUrl = u.toString()
	}

	goto(newUrl)
	dispatch('search', detail)
}
</script>

<!-- {hellobar?.active?.val ? 'h-[88px] sm:h-28' : 'h-14 sm:h-20'} -->
<nav
	class="{clazz} minimum-width-rem sticky inset-x-0 top-0 w-full border-b bg-white shadow-xs
	{hellobar?.active?.val && $page.data.store?.isHyperlocal
		? 'h-[112px] sm:h-[136px] lg:h-[112px]'
		: ''}
	{hellobar?.active?.val && !$page.data.store?.isHyperlocal ? 'h-[88px] sm:h-[112px]' : ''}
	{$page.data.store?.isHyperlocal && !hellobar?.active?.val
		? 'h-[80px] sm:h-[104px] lg:h-[80px]'
		: ''}
	{!hellobar?.active?.val && !$page.data.store?.isHyperlocal ? 'h-[56px] sm:h-[80px]' : ''}
	{showCartSidebar ? 'z-50 ' : 'z-40 delay-500'}">
	<!-- hellobar -->

	{#if hellobar?.active?.val}
		<div
			class="h-8 text-center tracking-wider flex items-center justify-center text-sm"
			style="background-color: {hellobar?.bgColor?.val || '#27272a'};
				 color: {hellobar?.textColor?.val || '#ffffff'};">
			{@html hellobar.content?.val}
		</div>
	{/if}

	<div class="h-14 sm:h-20 flex items-center px-3 sm:px-10 w-full justify-between gap-4 lg:gap-8">
		<div class="flex items-center gap-4">
			<!-- Back button -->

			{#if $page?.data?.isShowBackButton}
				<button
					type="button"
					class="block shrink-0 focus:outline-none sm:hidden"
					on:click="{goback}">
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
							d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path>
					</svg>
				</button>
			{/if}

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
						class="bg-gradient-to-b from-primary-500 to-secondary-500 bg-clip-text text-transparent truncate w-40 sm:w-auto sm:max-w-sm">
						{$page?.data?.store?.websiteName}
					</h2>
				{:else}
					<img
						src="{logo}"
						alt="logo"
						class="max-h-10 sm:max-h-16 w-40 object-contain object-left" />
				{/if}
			</a>

			{#if $page.data.store?.isHyperlocal}
				<button
					type="button"
					class="hidden lg:flex max-w-max whitespace-nowrap items-center gap-2 text-sm font-semibold bg-zinc-100 py-2 px-4 rounded-full"
					on:click="{() => (showPincodeInputBox = true)}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-5 h-5 shrink-0">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"></path>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
						></path>
					</svg>

					<span class="hidden xl:block truncate">{pin || 'Select your pincode...'}</span>
				</button>
			{/if}
		</div>

		<!-- Mega menu -->

		<div
			class="hidden lg:flex w-auto flex-1 items-start justify-start overflow-auto scrollbar-none">
			<MegaMenu class="h-20 uppercase" />
		</div>

		<!-- Search box -->

		<div class="hidden w-full min-w-[200px] max-w-4xl flex-1 lg:block">
			<Autocomplete
				placeholder="{$page?.data?.store?.searchbarText || 'Search...'}"
				on:search="{onSearchSubmit}" />
		</div>

		<div class="flex items-center gap-4 lg:gap-8">
			<!-- Search mobile -->

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
					class="h-6 w-6">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
					></path>
				</svg>

				<span class="hidden text-center text-xs font-semibold tracking-wider lg:block"> Cart </span>

				{#if $page.data?.cartQty > 0}
					<div
						class="absolute -top-2 -right-1.5 flex items-center justify-center rounded-full bg-primary-500 py-[0.8px] px-[5px] text-center text-xs font-bold uppercase text-white">
						{$page.data?.cartQty}
					</div>
				{/if}
			</a>

			{#if me?.active}
				<!-- Profile desktop -->

				<div
					class="relative hidden lg:block"
					on:mouseenter="{() => (showDropdownAccount = true)}"
					on:mouseleave="{() => (showDropdownAccount = false)}">
					<a
						href="/my"
						aria-label="Click to visit dashboard"
						class="flex h-20 flex-col items-center justify-center gap-1 border-b-4 focus:outline-none
						{showDropdownAccount ? 'border-primary-500' : 'border-transparent'}">
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

						<span class="hidden text-center text-xs font-semibold tracking-wider lg:block">
							Account
						</span>
					</a>

					{#if showDropdownAccount}
						<ul
							transition:slide="{{ duration: 300 }}"
							class="absolute z-50 top-20 right-0 flex min-w-max flex-col rounded-b border bg-white p-2 text-sm shadow-inner">
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

									<h6 class="flex flex-1 flex-col">
										{#if me.firstName}
											<span>
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
									</h6>
								</a>
							</li>

							{#if !$page.url?.pathname.includes('/my')}
								{#each menu as m}
									<li class="h-auto w-full flex-1">
										<a
											href="{m.url}"
											aria-label="Click to visit {m.name}"
											data-sveltekit-preload-data
											class="block w-full cursor-pointer rounded py-2 px-4 text-left transition duration-300 focus:outline-none hover:bg-zinc-100">
											{m.name}
										</a>
									</li>
								{/each}
							{/if}

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
										class="w-full cursor-pointer rounded py-2 px-4 text-left transition duration-300 focus:outline-none hover:bg-zinc-100">
										Logout
									</button>
								</form>
							</li>
						</ul>
					{/if}
				</div>

				<!-- Menu mobile -->

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
						class="h-6 w-6">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
					</svg>
				</button>
			{:else}
				<!-- Login -->

				<a
					href="{$page.data?.loginUrl || '/auth/login'}?ref={$page?.url?.pathname}{$page?.url
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
							class="h-6 w-6">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
							></path>
						</svg>

						<span class="hidden text-center text-xs font-semibold tracking-wider lg:block">
							Login
						</span>
					</button>
				</a>
			{/if}
		</div>
	</div>

	{#if $page.data.store?.isHyperlocal}
		<button
			type="button"
			class="h-6 lg:hidden flex items-center justify-start gap-1 text-xs font-semibold bg-primary-100 px-3 w-full text-left"
			on:click="{() => (showPincodeInputBox = true)}">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-4 h-4">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
				></path>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"></path>
			</svg>

			<span>{pin || 'Select your pincode...'}</span>
		</button>
	{/if}
</nav>

{#if showPincodeInputBox}
	<PincodeInputBox on:close="{() => (showPincodeInputBox = false)}" />
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
			transition:slideFade="{{ duration: 500 }}"
			class="relative z-[60] h-full w-full overflow-y-auto bg-white p-6 overflow-x-hidden">
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
				<ul class="flex flex-col gap-4 m-0 p-0 list-none">
					<!-- Profile Preview -->

					<li>
						<a
							data-sveltekit-preload-data
							href="/my/profile"
							aria-label="Click to visit profile"
							class="flex flex-col gap-2"
							on:click="{() => (openSidebar = false)}">
							<div class="h-20 w-20 overflow-hidden rounded border">
								{#if me.avatar}
									<LazyImg
										src="{me.avatar}"
										alt="avatar"
										width="80"
										height="80"
										class="object-cover object-top" />
								{:else}
									<img
										src="{userEmptyProfile}"
										alt="avatar"
										class="h-full w-full object-cover object-top" />
								{/if}
							</div>

							<div class="flex flex-1 flex-col text-sm">
								{#if me.firstName}
									<h5>
										Hi {me.firstName}

										{#if me.lastName}
											{me.lastName}
										{/if}
									</h5>
								{/if}

								{#if me.email}
									<p>{me.email}</p>
								{:else if me.phone}
									<p>{me.phone}</p>
								{/if}
							</div>
						</a>
					</li>

					<hr class="w-full" />

					<!-- Menu -->

					{#each menu as m}
						<li>
							<a
								data-sveltekit-preload-data
								href="{m.url}"
								aria-label="Click to visit account"
								class="flex items-center gap-2"
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
							<button type="submit" aria-label="Logout" class="flex w-full items-center gap-2">
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
					class="flex items-center gap-2"
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
