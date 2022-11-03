<style>
.minimum-width-rem {
	min-width: 360px;
}
</style>

<script lang="ts">
import Nav from '$lib/Nav.svelte'
import Footer from '$lib/Footer.svelte'
import PageTransitions from '$lib/PageTransitions.svelte'
import menu from '$lib/config/menu'
import SidebarDashboard from './_SidebarDashboard.svelte'

export let data

$: ({ path, url, sort, isHome, q, currentPage, me, cart, store } = data)

let showCartSidebar = false
let openSidebar = false
</script>

<div class="minimum-width-rem h-screen overflow-hidden">
	<Nav
		me="{data.me}"
		cart="{data.cart}"
		store="{data.store}"
		q="{data.q}"
		bind:showCartSidebar
		bind:openSidebar />

	<div class="mt-14 sm:mt-20 flex h-full w-full">
		{#if menu?.length > 0}
			<div
				class="relative hidden w-44 flex-shrink-0 overflow-y-auto overflow-x-hidden bg-primary-500 py-3 scrollbar-none sm:block">
				<!-- Dashboard -->

				<a href="/my" aria-label="Click to route dashboard" data-sveltekit-prefetch>
					<button
						type="button"
						class="w-full p-3 text-left text-sm text-gray-400 focus:outline-none">
						Dashboard
					</button>
				</a>

				<!-- Sidebar Data -->

				{#each menu as s}
					<SidebarDashboard me="{me}" sidebar="{s}" />
				{/each}
			</div>
		{/if}

		<div class="h-[89vh] w-full flex-1 overflow-y-auto p-3 py-5 sm:p-10">
			<PageTransitions url="{data.url}">
				<slot />
			</PageTransitions>
		</div>
	</div>
</div>
