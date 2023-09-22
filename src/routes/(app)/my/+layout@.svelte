<style>
.minimum-width-rem {
	min-width: 360px;
}
</style>

<script lang="ts">
import { Nav } from '$lib/theme-config'
import { page } from '$app/stores'
import { PageTransitions, Footer } from '$lib/components'
import menu from '$lib/config/menu'
import SidebarDashboard from './_SidebarDashboard.svelte'

export let data

$: innerHeight = 0

let hellobar = $page.data.store?.hellobar || {}
let openSidebar = false
let showCartSidebar = false
let slotHeightAccToPageHeight = innerHeight

$: if (innerWidth < 640) {
	if (hellobar?.active?.val && $page.data.store?.isHyperlocal) {
		// 112 (without mobile footer)
		slotHeightAccToPageHeight = innerHeight - 168
	} else if (hellobar?.active?.val && !$page.data.store?.isHyperlocal) {
		// 88 (without mobile footer)
		slotHeightAccToPageHeight = innerHeight - 144
	} else if ($page.data.store?.isHyperlocal && !hellobar?.active?.val) {
		// 80 (without mobile footer)
		slotHeightAccToPageHeight = innerHeight - 136
	} else if (!hellobar?.active?.val && !$page.data.store?.isHyperlocal) {
		// 56 (without mobile footer)
		slotHeightAccToPageHeight = innerHeight - 112
	}
} else if (innerWidth < 1024) {
	if (hellobar?.active?.val && $page.data.store?.isHyperlocal) {
		// 136 (without mobile footer)
		slotHeightAccToPageHeight = innerHeight - 192
	} else if (hellobar?.active?.val && !$page.data.store?.isHyperlocal) {
		// 112 (without mobile footer)
		slotHeightAccToPageHeight = innerHeight - 168
	} else if ($page.data.store?.isHyperlocal && !hellobar?.active?.val) {
		// 104 (without mobile footer)
		slotHeightAccToPageHeight = innerHeight - 160
	} else if (!hellobar?.active?.val && !$page.data.store?.isHyperlocal) {
		// 80 (without mobile footer)
		slotHeightAccToPageHeight = innerHeight - 136
	}
} else {
	if (hellobar?.active?.val && $page.data.store?.isHyperlocal) {
		slotHeightAccToPageHeight = innerHeight - 112
	} else if (hellobar?.active?.val && !$page.data.store?.isHyperlocal) {
		slotHeightAccToPageHeight = innerHeight - 112
	} else if ($page.data.store?.isHyperlocal && !hellobar?.active?.val) {
		slotHeightAccToPageHeight = innerHeight - 80
	} else if (!hellobar?.active?.val && !$page.data.store?.isHyperlocal) {
		slotHeightAccToPageHeight = innerHeight - 80
	}
}
</script>

<svelte:window bind:innerHeight="{innerHeight}" />

<div class="minimum-width-rem h-screen overflow-y-auto">
	<Nav
		me="{data.me}"
		store="{data.store}"
		q="{data.q}"
		bind:showCartSidebar="{showCartSidebar}"
		bind:openSidebar="{openSidebar}" />

	<div class="flex w-full antialiased" style="height: {slotHeightAccToPageHeight}px;">
		{#if menu?.length > 0}
			<div
				class="relative hidden w-44 shrink-0 overflow-y-auto overflow-x-hidden bg-primary-500 py-3 scrollbar-none sm:block">
				<!-- Dashboard -->

				<a href="/my" aria-label="Click to visit dashboard" data-sveltekit-preload-data>
					<button
						type="button"
						class="w-full p-3 text-left text-sm text-zinc-200 focus:outline-none">
						Dashboard
					</button>
				</a>

				<!-- Sidebar Data -->

				{#each menu as s}
					<SidebarDashboard me="{data.me}" sidebar="{s}" />
				{/each}
			</div>
		{/if}

		<div class="h-full w-full flex-1 overflow-y-auto p-3 py-5 sm:p-10">
			<PageTransitions url="{data.url}">
				<slot />
			</PageTransitions>
		</div>
	</div>
</div>
