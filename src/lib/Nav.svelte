<script lang="ts">
import { getAPI, post } from '$lib/util/api'
import { currency, toast } from '$lib/util'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import Cookie from 'cookie-universal'
import { fly, slide } from 'svelte/transition'
import { cubicOut } from 'svelte/easing'
import { createEventDispatcher, getContext, onMount } from 'svelte'
import { WWW_URL } from './config'
import Select from 'svelte-select'
// import 'svelte-select/tailwind.css'
import Item from '$lib/AutocompleteItem.svelte'
import PrimaryButton from './ui/PrimaryButton.svelte'
import LazyImg from './components/Image/LazyImg.svelte'
import MegaMenu from './components/MegaMenu.svelte'

const dispatch = createEventDispatcher()
const cookies = Cookie()

export let me,
	cart = {},
	data

let selectTarget = null
let openSidebar = false
let q = ''
let typingTimer
let showDropdownAccount = false

export const signOut = async () => {
	let logout, error

	try {
		await post('logout', {})
	} catch (e) {
		error = e
	} finally {
	}

	await cookies.set('me', null, { path: '/' })
	await cookies.remove('token')
	await cookies.remove('sid')
	await cookies.remove('me')

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
		$page.data.me = null
		$page.data.token = null
		$page.data.sid = null
		toast('Signed Out...', 'success')
		goto('/auth/otp-login')
	} catch (e) {
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

const optionIdentifier = 'key'
const getOptionLabel = (option) => option.key
const getSelectionLabel = (option) => option.key
</script>

<nav
	class="fixed inset-x-0 top-0 z-40 h-20 w-full justify-center bg-white px-3  shadow-md sm:px-10">
	<div class="flex w-full items-center justify-between gap-4">
		<!-- Back button -->

		<div class="block sm:hidden">
			{#if $page?.data?.isShowBackButton}
				<button type="button" class="focus:outline-none" on:click="{() => window.history.go(-1)}">
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
		</div>

		<!-- Logo -->

		<a class="flex-shrink-0 py-3 " href="/" aria-label="Click to route home">
			<LazyImg src="/logo.png" alt="" height="56" class="h-14 object-contain object-center" />
		</a>

		<div class="hidden lg:block">
			<MegaMenu />
		</div>

		<!-- Search box -->

		<form
			class="form-control relative z-50 hidden w-1/3 lg:block"
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
			<!-- Cart -->

			<a
				sveltekit:prefetch
				href="/autosuggest"
				aria-label="Click to route cart"
				class="flex h-20 flex-col items-center justify-center gap-1 border-b-4 border-transparent px-2 focus:outline-none sm:px-4 lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path
					></svg>
			</a>

			<div class="dropdown-end dropdown">
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
							<a href="/cart" aria-label="Click to route cart" class="w-full" sveltekit:prefetch>
								<PrimaryButton loadingringsize="sm" class="w-full text-sm uppercase">
									View cart
								</PrimaryButton>
							</a>
						</div>
					</div>
				</div>
			</div>

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

							<li class="h-auto w-full flex-1">
								<a href="/my/orders" aria-label="Click to route order" sveltekit:prefetch>
									<h6
										class="w-full cursor-pointer rounded py-2 px-4 text-left transition duration-300 hover:bg-primary-50 focus:outline-none">
										Orders
									</h6>
								</a>
							</li>

							<li class="h-auto w-full flex-1">
								<a href="/my/wishlist" aria-label="Click to route wishlist" sveltekit:prefetch>
									<h6
										class="w-full cursor-pointer rounded py-2 px-4 text-left transition duration-300 hover:bg-primary-50 focus:outline-none">
										Wishlist
									</h6>
								</a>
							</li>

							<li class="h-auto w-full flex-1">
								<a href="/my/profile" aria-label="Click to route profile" sveltekit:prefetch>
									<h6
										class="w-full cursor-pointer rounded py-2 px-4 text-left transition duration-300 hover:bg-primary-50 focus:outline-none">
										Profile
									</h6>
								</a>
							</li>

							<li>
								<button
									type="button"
									on:click="{handleSignout}"
									class="w-full cursor-pointer rounded py-2 px-4 text-left transition duration-300 hover:bg-primary-50 focus:outline-none">
									Logout
								</button>
							</li>
						</ul>
					{/if}
				</div>
			{/if}

			{#if !$page.data.me?.active}
				<!-- Login -->

				<a href="/auth/otp-login" aria-label="Click to route login" sveltekit:prefetch>
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
	<aside
		class="fixed inset-0 z-50 overflow-hidden overflow-y-auto overflow-x-hidden bg-white py-6"
		transition:slideFade="{{ duration: 500 }}">
		<button
			aria-label="Sidebar"
			type="button"
			class="fixed top-4 right-4 z-[60] transform  transition duration-500 hover:scale-90"
			on:click="{() => (openSidebar = false)}">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"></path>
			</svg>
		</button>

		{#if me?.active}
			<ul class="px-6 pr-14 text-gray-600">
				<li>
					<a
						sveltekit:prefetch
						href="/my/profile"
						aria-label="Click to route profile"
						class="mb-4 flex items-center gap-2">
						<div class="h-10 w-10 overflow-hidden rounded-full border">
							{#if me.avatar}
								<LazyImg src="{me.avatar}" alt="" width="40" class="object-cover object-top" />
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

				<!-- Account -->

				<li>
					<a
						sveltekit:prefetch
						href="/my"
						aria-label="Click to route account"
						class="flex items-center gap-2 py-2"
						on:click="{() => (openSidebar = false)}">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
								clip-rule="evenodd"></path>
						</svg>

						<span>Account</span>
					</a>
				</li>

				<!-- Profile -->

				<li>
					<a
						sveltekit:prefetch
						href="/my/profile"
						aria-label="Click to route profile"
						class="flex items-center gap-2 py-2"
						on:click="{() => (openSidebar = false)}">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
								clip-rule="evenodd"></path>
						</svg>

						<span>Profile</span>
					</a>
				</li>

				<!-- Change Password -->

				<li>
					<a
						sveltekit:prefetch
						href="/my/orders?ref={$page?.url?.pathname}"
						aria-label="Click to route change password"
						class="flex items-center gap-2 py-2"
						on:click="{() => (openSidebar = false)}">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"></path>
						</svg>

						<span>Orders</span>
					</a>
				</li>

				<!-- Log Out -->

				<li>
					<button
						type="button"
						aria-label="Logout"
						class="flex w-full items-center gap-2 py-2"
						on:click="{handleSignout}">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
								clip-rule="evenodd"></path>
						</svg>

						<span>Log Out</span>
					</button>
				</li>
			</ul>
		{:else}
			<!-- Login -->

			<a
				sveltekit:prefetch
				href="/auth/otp-login"
				aria-label="Click to route login"
				class="flex items-center gap-2 px-4 py-4 pr-12"
				on:click="{() => (openSidebar = false)}">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
						clip-rule="evenodd"></path>
				</svg>

				<span>Login</span>
			</a>
		{/if}
	</aside>
{/if}
