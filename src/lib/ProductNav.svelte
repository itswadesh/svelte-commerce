<style>
.frosted-white {
	backdrop-filter: blur(5px);
	background-color: hsla(0, 0%, 100%, 0.35);
}
</style>

<script lang="ts">
import { page } from '$app/stores'
import AutosuggestModal from './AutosuggestModal.svelte'
import type { Cart, Me } from './types'

export let cart: Cart
export let data
export let me: Me
export let openSidebar: boolean
export let productName: string
export let showCartSidebar: boolean
export let store
export let url: string

$: scrollY = 0

let show = false
</script>

<svelte:window bind:scrollY="{scrollY}" />

<nav
	class="minimum-width-rem fixed inset-x-0 top-0 flex h-14 w-full items-center justify-center px-3 sm:h-20 sm:px-10 lg:hidden
	{showCartSidebar ? 'z-50 ' : 'z-40'}"
	style="background-color: rgba(255, 255, 255, {scrollY < 500 ? scrollY / 500 : 1});">
	<div class="flex items-center justify-between gap-4 w-full">
		<div class="flex items-center gap-4">
			<!-- Back button -->

			{#if $page?.data?.isShowBackButton}
				<button
					type="button"
					class="h-8 w-8 shrink-0 flex items-center justify-center frosted-white rounded-full focus:outline-none"
					on:click="{() => window.history.go(-1)}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"
						></path>
					</svg>
				</button>
			{/if}

			<div class="flex-1">
				<slot />
			</div>
		</div>

		<div class="flex items-center gap-2">
			<!-- Search -->

			<button
				type="button"
				class="h-8 w-8 flex items-center justify-center frosted-white rounded-full focus:outline-none"
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
						d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
				</svg>
			</button>

			{#if show}
				<AutosuggestModal bind:show="{show}" />
			{/if}

			<!-- Wishlist-->

			<a
				href="/my/wishlist"
				aria-label="Click to route wishlist"
				class="h-8 w-8 flex items-center justify-center frosted-white rounded-full focus:outline-none"
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
			</a>

			<!-- Cart -->

			<a
				href="/cart"
				aria-label="Click to route cart"
				class="h-8 w-8 relative flex items-center justify-center frosted-white rounded-full focus:outline-none"
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
						class="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-primary-500 py-[0.8px] px-[5px] text-center text-xs font-bold uppercase text-white">
						{$page.data.cartQty}
					</div>
				{/if}
			</a>
		</div>
	</div>
</nav>
