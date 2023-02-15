<style>
.minimum-width-rem {
	min-width: 360px;
}
</style>

<script lang="ts">
import { createEventDispatcher, getContext, onMount } from 'svelte'
import { cubicOut } from 'svelte/easing'
import { fade, fly } from 'svelte/transition'
import { goto } from '$app/navigation'
import { logo } from './config'
import { page } from '$app/stores'
import Autocomplete from '$lib/components/Autocomplete/Autocomplete.svelte'
import LazyImg from './components/Image/LazyImg.svelte'
import MegaMenu from './components/MegaMenu.svelte'
import menu from '$lib/config/menu'
import PrimaryButton from './ui/PrimaryButton.svelte'
import WhiteButton from './ui/WhiteButton.svelte'
import AutosuggestModal from './AutosuggestModal.svelte'
import { enhance } from '$app/forms'
import type { Cart, Me } from './types'

const dispatch = createEventDispatcher()

export let me:Me, cart:Cart, data, showCartSidebar=false, openSidebar=false, store

let q:string|null = ''
let showDropdownAccount = false
let show = false
let categories

onMount(async () => {
	q = $page.url.searchParams.get('q')
})

function slideFade(node:any, params:any) {
	const existingTransform = getComputedStyle(node).transform.replace('none', '')

	return {
		delay: params.delay || 0,
		duration: params.duration || 400,
		easing: params.easing || cubicOut,
		css: (t:number, u:number) =>
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
</script>

<nav
	class="minimum-width-rem fixed inset-x-0 top-0 flex h-14 w-full flex-col items-center justify-center border-b bg-white shadow-md sm:h-20 lg:h-40
	{showCartSidebar ? 'z-50 ' : 'z-40 delay-500'}"
>
	<div class="flex w-full items-center justify-between gap-4 px-3 sm:px-10 lg:gap-8">
		<div class="flex items-center gap-4">
			<!-- Back button -->

			{#if $page?.data?.isShowBackButton}
				<button
					type="button"
					class="block shrink-0 focus:outline-none sm:hidden"
					on:click="{() => window.history.go(-1)}"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path>
					</svg>
				</button>
			{/if}

			<!-- Website Logo/Name -->

			<a href="/" class="block shrink-0" aria-label="Click to route home">
				{#if $page?.data?.store?.logo}
					<LazyImg
						src="{$page?.data?.store?.logo}"
						alt=" "
						height="40"
						class="h-auto max-h-10 w-32 object-contain object-center sm:max-h-16"
					/>
				{:else if $page?.data?.store?.websiteName}
					<h2
						class="bg-gradient-to-b from-primary-500 to-secondary-500 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl"
					>
						{$page?.data?.store?.websiteName}
					</h2>
				{:else}
					<img
						src="{logo}"
						alt=" "
						class="h-auto max-h-10 w-32 object-contain object-center sm:max-h-16"
					/>
				{/if}
			</a>
		</div>

		<div class="hidden w-full min-w-min max-w-4xl flex-1 lg:block">
			<Autocomplete
				placeholder="{$page?.data?.store?.searchbarText || 'Search...'}"
				on:search="{onSearchSubmit}"
			/>
		</div>

		<div class="flex items-center gap-4 lg:gap-8">
			<button
				type="button"
				aria-label="Click to search quizzes, videos, notes etc..."
				class="block focus:outline-none lg:hidden"
				on:click="{() => (show = true)}"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
					>
					</path>
				</svg>
			</button>

			<a
				href="/cart"
				aria-label="Click to route cart"
				class="relative flex flex-col items-center justify-center gap-1 focus:outline-none lg:border-b-4 lg:border-transparent"
				data-sveltekit-preload-data
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
					></path>
				</svg>

				<span class="hidden text-center text-xs font-semibold tracking-wider lg:block"> Cart </span>

				{#if $page.data.cartQty > 0}
					<div
						class="absolute -top-2 -right-1.5 flex items-center justify-center rounded-full bg-primary-500 py-[0.8px] px-[5px] text-center text-xs font-bold uppercase text-white"
					>
						{$page.data.cartQty}
					</div>
				{/if}
			</a>

			{#if showCartSidebar}
				<div class="fixed inset-0 z-[100] h-screen w-full">
					<button
						transition:fade="{{ duration: 500 }}"
						class="absolute inset-0 cursor-default bg-black bg-opacity-50 focus:outline-none"
						on:click="{() => (showCartSidebar = false)}"
					>
					</button>

					<div
						transition:slideFade="{{ duration: 500 }}"
						class="absolute inset-y-0 right-0 h-full w-full border-l bg-white lg:max-w-xs"
					>
						<button
							type="button"
							class="absolute top-5 right-4 transform cursor-pointer text-gray-500 transition duration-300 focus:outline-none hover:scale-125 hover:text-gray-700"
							on:click="{() => (showCartSidebar = false)}"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"></path>
							</svg>
						</button>

						<div class="h-full shrink-0">
							<h2 class="border-b p-4 text-center font-bold uppercase sm:text-lg">Cart</h2>

							<div class="h-full overflow-y-auto p-4 pb-20 overflow-x-hidden">
								{#if $page.data.cartQty > 0}
									<div class="mb-5 flex flex-col gap-5">
										{#each cart?.items || [] as item, ix}
											<div class="flex items-start justify-between gap-4">
												<a
													href="/product/{item.slug}"
													aria-label="Click to route product details page"
													class="shrink-0"
													on:click="{() => (showCartSidebar = false)}"
												>
													{#if item.isCustomized}
														<LazyImg
															src="{item.customizedImg}"
															alt=""
															width="64"
															class="h-auto w-16 object-contain object-left"
														/>
													{:else}
														<LazyImg
															src="{item.img}"
															alt=""
															width="64"
															class="h-auto w-16 object-contain object-left"
														/>
													{/if}
												</a>

												<div class="flex flex-1 flex-col gap-1">
													<div class="mb-2 flex justify-between gap-2">
														<a
															href="/product/{item.slug}"
															aria-label="Click to route product details page"
															class="flex-1 text-sm leading-4"
															on:click="{() => (showCartSidebar = false)}">{item.name}</a
														>

														{#if $page?.data?.store?.isFnb && item.foodType}
															<div>
																{#if item.foodType === 'veg'}
																	<img src="/product/veg.png" alt="veg" class="h-5 w-5" />
																{:else if item.foodType === 'nonveg'}
																	<img src="/product/non-veg.png" alt="non veg" class="h-5 w-5" />
																{/if}
															</div>
														{/if}
													</div>

													{#if item?.usedOptions?.length}
														<div class="mt-2 flex flex-col gap-2 text-xs">
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

														<span class="text-gray-500">x</span>

														<span class="font-semibold">
															{item.formattedItemAmount?.price}
														</span>
													</div>
												</div>
											</div>
										{/each}
									</div>

									<div class="mb-10 flex flex-col gap-2">
										<a
											href="/cart"
											aria-label="Click to route cart page"
											class="block w-full"
											data-sveltekit-preload-data
										>
											<WhiteButton
												type="button"
												class="w-full text-xs uppercase"
												loadingringsize="xs"
												on:click="{() => (showCartSidebar = false)}"
											>
												View Cart
											</WhiteButton>
										</a>

										<a
											href="/checkout/address"
											aria-label="Click to route address of checkout page"
											class="block w-full"
											data-sveltekit-preload-data
										>
											<PrimaryButton
												type="button"
												class="w-full text-xs uppercase"
												loadingringsize="xs"
												clickEffect
												on:click="{() => (showCartSidebar = false)}"
											>
												Checkout
											</PrimaryButton>
										</a>
									</div>
								{:else}
									<div class="mb-10 flex flex-col items-center text-center">
										<div>
											<img
												src="/no/add-to-cart-animate.svg"
												alt="empty listing"
												class="mb-5 h-40 object-contain"
											/>
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
										class="mb-5 flex items-center gap-2 whitespace-nowrap text-center font-bold uppercase sm:text-lg"
									>
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
												aria-label="Click to route category related products page"
												class="col-span-1 block transform border transition duration-500 hover:-translate-y-2 hover:shadow-lg"
											>
												<LazyImg
													src="{c.img}"
													class="aspect-square w-full object-cover object-center"
												/>
											</a>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/if}

			{#if me?.active}
				<div
					class="relative hidden lg:block"
					on:mouseenter="{() => (showDropdownAccount = true)}"
					on:mouseleave="{() => (showDropdownAccount = false)}"
				>
					<button
						aria-label="/"
						class="flex h-20 flex-col items-center justify-center gap-1 border-b-4 focus:outline-none
						{showDropdownAccount ? 'border-primary-500' : 'border-transparent'}"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-6 w-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
							></path>
						</svg>

						<span class="hidden text-center text-xs font-semibold tracking-wider lg:block">
							Profile
						</span>
					</button>

					{#if showDropdownAccount}
						<ul
							transition:fly="{{ y: 5, duration: 700 }}"
							class="absolute top-20 right-0 flex min-w-max flex-col rounded-b border bg-white p-2 text-sm font-semibold  shadow-inner"
						>
							<li class="mb-2 border-b py-2 px-4">
								<a
									href="/my/profile"
									aria-label="Click to route profile"
									class="flex items-center gap-2"
								>
									<div class="h-10 w-10 overflow-hidden rounded-full border">
										{#if me.avatar}
											<LazyImg
												src="{me.avatar}"
												alt=""
												width="40"
												class="object-cover object-top"
											/>
										{:else}
											<img
												src="/user-empty-profile.png"
												alt=""
												class="h-full w-full object-cover object-top"
											/>
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
										aria-label="Click to route {m.name}"
										data-sveltekit-preload-data
									>
										<h6
											class="w-full cursor-pointer rounded py-2 px-4 text-left transition duration-300 focus:outline-none hover:bg-primary-50"
										>
											{m.name}
										</h6>
									</a>
								</li>
							{/each}

							<li>
								<form action="/auth/logout" method="POST" use:enhance>
									<button
										type="submit"
										class="w-full cursor-pointer rounded py-2 px-4 text-left transition duration-300 focus:outline-none hover:bg-primary-50"
									>
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
					on:click="{() => (openSidebar = true)}"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6"
					>
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
					aria-label="Click to route login"
					data-sveltekit-preload-data
				>
					<button
						class="flex flex-col items-center justify-center gap-1 focus:outline-none lg:border-b-4 lg:border-transparent"
						aria-label="/"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-6 w-6"
						>
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

	<div class="hidden h-20 w-full items-center justify-center border-t lg:flex">
		<MegaMenu />
	</div>
</nav>

{#if show}
	<AutosuggestModal bind:show="{show}" />
{/if}

{#if openSidebar}
	<aside class="fixed inset-0 z-[100] flex justify-end overflow-hidden bg-transparent">
		<button
			transition:fade="{{ duration: 500 }}"
			aria-label="Sidebar"
			type="button"
			class="absolute inset-0 bg-black bg-opacity-50 focus:outline-none"
			on:click="{() => (openSidebar = false)}"
		>
		</button>

		<div
			transition:slideFade="{{ duration: 500 }}"
			class="relative z-[60] h-full w-full overflow-y-auto bg-white p-6 overflow-x-hidden"
		>
			<!--  w-72 -->

			<button
				type="button"
				class="absolute top-5 right-4 transform cursor-pointer text-gray-500 transition duration-300 focus:outline-none hover:scale-125 hover:text-gray-700"
				on:click="{() => (openSidebar = false)}"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
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
							href="/my/profile"
							aria-label="Click to route profile"
							class="mb-4 flex flex-col gap-2 border-b pb-4"
							data-sveltekit-preload-data
							on:click="{() => (openSidebar = false)}"
						>
							<div class="h-20 w-20 overflow-hidden rounded-md border">
								{#if me.avatar}
									<LazyImg
										src="{me.avatar}"
										alt=""
										width="80"
										height="80"
										class="object-cover object-top"
									/>
								{:else}
									<img
										src="/user-empty-profile.png"
										alt=""
										class="h-full w-full object-cover object-top"
									/>
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
								href="{m.url}"
								aria-label="Click to route account"
								class="flex items-center gap-2 py-2"
								data-sveltekit-preload-data
								on:click="{() => (openSidebar = false)}"
							>
								{@html m.svg}

								{m.name}
							</a>
						</li>
					{/each}

					<!-- Logout -->

					<li>
						<form action="/auth/logout" method="POST" use:enhance>
							<button type="submit" aria-label="Logout" class="flex w-full items-center gap-2 py-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="h-5 w-5"
								>
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
					aria-label="Click to route login"
					class="flex items-center gap-2 py-2"
					data-sveltekit-preload-data
					on:click="{() => (openSidebar = false)}"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-5 w-5"
					>
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
