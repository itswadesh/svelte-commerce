<style>
.frosted {
	backdrop-filter: blur(15px);
	background-color: hsla(0, 0%, 100%, 0.75);
}
.text-extrasmall {
	font-size: 0.5rem;
}
.active {
	border-bottom: 2px solid black;
}
</style>

<script lang="ts">
import { goto } from '$app/navigation'
import { page, session } from '$app/stores'
import Cookies from 'universal-cookie'
const cookies = new Cookies()
import { spring } from 'svelte/motion'
import Search from '$lib/Search.svelte'
import { Categories } from './graphql/_kitql/graphqlTypes'
import { KQL_Cart, KQL_Init, KQL_Me } from './graphql/_kitql/graphqlStores'
import { signOut } from './services'
import { onMount } from 'svelte'
import { store } from './../util'

onMount(async () => {
	await KQL_Me.query({})
	await KQL_Cart.query({})
})
export let section

async function handleSignout() {
	await signOut()
}
</script>

<nav class=" p-4 shadow-md border-gray-100 frosted">
	<div class="flex items-center justify-between">
		<a href="/" class="flex items-center focus:outline-none max-w-max">
			<img alt="" class="h-8" src="/logo.png" />
		</a>
		{#if $KQL_Init.data?.megamenu}
			<div
				class="flex items-center justify-center w-full ml-8 text-sm font-semibold tracking-wide uppercase xl:ml-10">
				{#each $KQL_Init.data?.megamenu as c}
					<a
						href="{`/search?categories=${c?.slug}&page=1`}"
						class="mx-2 cursor-pointer hover:text-primary-500 whitespace-nowrap xl:mx-5"
						class:active="{$page.url.pathname == `categories=${c.slug}&page=1`}">
						{c?.name}
					</a>
				{/each}
			</div>
		{/if}
		<div class="flex flex-row items-center">
			<a href="/cart" class:selected="{section === 'cart'}">
				<button
					type="button"
					class="flex items-center mr-5 font-semibold transform focus:outline-none whitespace-nowrap active:scale-95 hover:text-primary-500 group">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-5 h-5 mr-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
					</svg>
					{#if $KQL_Cart.data?.cart.qty}
						<span
							class="counter-digits absolute flex items-center justify-center p-0.5 text-extrasmall text-white bg-black group-hover:bg-primary-500 rounded-full w-4 h-4 top-0 right-0 -mr-2 -mt-2"
							style="transform: translate(0, {100}%)">{Math.floor($KQL_Cart.data?.cart.qty)}</span>
					{/if}
				</button>
			</a>

			<a href="/wishlist">
				<button
					class="flex items-center mr-5  transform focus:outline-none whitespace-nowrap active:scale-95 hover:text-primary-500 group">
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
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						></path>
					</svg>
				</button>
			</a>
			{#if !$KQL_Me.errors}
				<a
					class:selected="{section === 'login'}"
					href="/my"
					class="min-w-max flex items-center mx-2 ">
					{#if $KQL_Me.data?.me?.firstName}
						<div class=" flex-1 text-sm font-semibold mr-2 whitespace-nowrap">
							<span>Hi {$KQL_Me.data?.me?.firstName}</span>
						</div>
					{/if}

					<div class="flex-shrink-0">
						{#if $KQL_Me.data?.me?.avatar}
							<img
								src="{$KQL_Me.data?.me?.avatar}"
								alt=""
								class="w-10 shadow h-10 bg-white rounded-full " />
						{:else}
							<img
								src="/leadership-profile.png"
								alt="user"
								class="w-8 shadow h-8  bg-white rounded-full " />
						{/if}
					</div>
				</a>
			{:else}
				<a href="/login" class="text-sm font-semibold tracking-wide hover:text-primary-500">
					LOGIN
				</a>
			{/if}
		</div>
	</div>
</nav>
