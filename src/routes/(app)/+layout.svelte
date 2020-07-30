<style>
.longShadow {
	text-shadow: 1px 1px rgba(0, 0, 0, 0.01), 2px 2px rgba(0, 0, 0, 0.03),
		3px 3px rgba(0, 0, 0, 0.025), 4px 4px rgba(0, 0, 0, 0.02), 5px 5px rgba(0, 0, 0, 0.015),
		6px 6px rgba(0, 0, 0, 0.01), 7px 7px rgba(0, 0, 0, 0.01), 8px 8px rgba(0, 0, 0, 0.01),
		9px 9px rgba(0, 0, 0, 0.01), 10px 10px rgba(0, 0, 0, 0.01), 11px 11px rgba(0, 0, 0, 0.01),
		12px 12px rgba(0, 0, 0, 0.01), 13px 13px rgba(0, 0, 0, 0.01), 14px 14px rgba(0, 0, 0, 0.01),
		15px 15px rgba(0, 0, 0, 0.01), 16px 16px rgba(0, 0, 0, 0.01), 17px 17px rgba(0, 0, 0, 0.01),
		18px 18px rgba(0, 0, 0, 0.01), 19px 19px rgba(0, 0, 0, 0.01), 20px 20px rgba(0, 0, 0, 0.01),
		21px 21px rgba(0, 0, 0, 0.01), 22px 22px rgba(0, 0, 0, 0.01), 23px 23px rgba(0, 0, 0, 0.01);
}
</style>

<script lang="ts">
import { page } from '$app/stores'
import Footer from '$lib/Footer.svelte'
import Nav from '$lib/Nav.svelte'
import PageTransitions from '$lib/PageTransitions.svelte'

// console.log('zzzzzzzzzzzzzzzzzz', $page)

export let data

let openSidebar = false
let showCartSidebar = false
</script>

<div class="{showCartSidebar || openSidebar ? 'h-screen overflow-hidden' : 'h-full'}">
	<Nav
		me="{data.me}"
		cart="{data.cart}"
		bind:showCartSidebar="{showCartSidebar}"
		bind:openSidebar="{openSidebar}" />

	<PageTransitions url="{data.url}">
		<div class="mt-14 w-full flex-1 sm:mt-20">
			{#if $page.data.store?.closed}
				<div class="flex h-[91.5vh] w-full items-center justify-center bg-primary-50 p-5 sm:p-10">
					<div class="rounded-3xl border-8 border-primary-200 bg-white p-5 shadow-2xl sm:p-10">
						<div class="flex items-center justify-between">
							<div class="h-4 w-4 rounded-full bg-gray-500"></div>

							<div class="h-4 w-4 rounded-full bg-gray-500"></div>
						</div>

						<div class="flex flex-col gap-5 p-5 text-center tracking-wider sm:gap-10 sm:p-10">
							<h1 class="longShadow text-5xl font-extrabold uppercase text-primary-500 sm:text-6xl">
								Closed
							</h1>

							<p class="font-semibold text-gray-500 sm:text-xl">
								{$page.data.store?.closedMessage || `Sorry we're closed for the day`}
							</p>
						</div>
					</div>
				</div>
			{:else}
				<slot />
			{/if}
		</div>
	</PageTransitions>

	<div class="hidden sm:block">
		<Footer me="{data.me}" />
	</div>
</div>
