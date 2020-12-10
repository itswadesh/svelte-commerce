<style>
.frosted-white {
	backdrop-filter: blur(5px);
	background-color: hsla(0, 0%, 100%, 0.35);
}
</style>

<script lang="ts">
import { fly } from 'svelte/transition'
import { page } from '$app/stores'
import { Reddit, Telegram, WhatsApp, Facebook, Twitter } from 'svelte-share-buttons-component'
import { WWW_URL } from '$lib/config'
import type { Cart, Me } from './types'

export let cart: Cart
export let data
export let me: Me
export let openSidebar: boolean
export let productName: string
export let showCartSidebar: boolean
export let store

$: scrollY = 0

let showShareButtons = false
</script>

<svelte:window bind:scrollY="{scrollY}" />

<nav
	class="minimum-width-rem fixed inset-x-0 top-0 flex h-14 w-full items-center justify-center px-3 sm:h-20 sm:px-10 lg:hidden
	{showCartSidebar ? 'z-50 ' : 'z-40'}"
	style="background-color: rgba(255, 255, 255, {scrollY < 500 ? scrollY / 500 : 1});">
	<div class="flex items-center justify-between gap-4 w-full">
		<!-- Back button -->

		{#if $page?.data?.isShowBackButton}
			<button
				type="button"
				class="h-8 w-8 flex items-center justify-center frosted-white rounded-full focus:outline-none"
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

		<div class="flex itmes-center gap-2">
			<div class="relative">
				<button
					type="button"
					class="h-8 w-8 flex items-center justify-center frosted-white rounded-full focus:outline-none"
					on:click="{() => (showShareButtons = true)}">
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
							d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
						></path>
					</svg>
				</button>

				{#if showShareButtons}
					<ul
						transition:fly="{{ y: -5, duration: 300 }}"
						class="absolute top-9 right-0 z-50 flex min-w-max list-none flex-col divide-y rounded-md border bg-white shadow-md">
						<li class="p-2">
							<Reddit title="{productName}" url="{WWW_URL}" />
						</li>

						<li class="p-2">
							<Telegram text="{productName}" url="{WWW_URL}" />
						</li>

						<li class="p-2">
							<WhatsApp text="{productName} {WWW_URL}" />
						</li>

						<li class="p-2">
							<Facebook quote="{productName}" url="{WWW_URL}" />
						</li>

						<li class="p-2">
							<Twitter
								text="{productName}"
								url="{WWW_URL}"
								hashtags="lrnr"
								via="lrnrin"
								related="mcq,cbse,chse,wbbse" />
						</li>
					</ul>

					<button
						type="button"
						class="fixed inset-0 z-40 h-full w-full bg-black bg-opacity-0 focus:outline-none"
						on:click="{() => (showShareButtons = false)}">
					</button>
				{/if}
			</div>

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
