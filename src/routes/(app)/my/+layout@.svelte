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
import { page } from '$app/stores'
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
		bind:showCartSidebar="{showCartSidebar}"
		bind:openSidebar="{openSidebar}"
	/>

	<div class="mt-14 flex h-full w-full sm:mt-20">
		{#if menu?.length > 0}
			<div
				class="relative hidden w-44 shrink-0 overflow-y-auto bg-primary-500 py-3 overflow-x-hidden scrollbar-none sm:block"
			>
				<!-- Dashboard -->

				<a href="/my" aria-label="Click to route dashboard" data-sveltekit-preload-data>
					<button
						type="button"
						class="w-full p-3 text-left text-xs text-gray-200 focus:outline-none"
					>
						Dashboard
					</button>
				</a>

				<!-- Sidebar Data -->

				<ul>
					{#each menu as s}
						<li>
							<SidebarDashboard me="{me}" sidebar="{s}" />
						</li>
					{/each}

					{#if $page.data.me?.role === 'vendor'}
						<li>
							<a
								href="{$page.data.store?.adminUrl || '##'}"
								target="_blank"
								rel="external"
								aria-label="Click to route admin panel of the store front"
								class="ml-10 text-sm text-white"
							>
								Admin Panel
							</a>
						</li>
					{/if}
				</ul>

				<hr class="border-primary-600" />

				<!-- Change Password -->

				<a
					href="/auth/change-password"
					aria-label="Click to route dashboard"
					data-sveltekit-preload-data
				>
					<button
						type="button"
						class="w-full p-3 text-left text-xs text-gray-200 focus:outline-none"
					>
						Change Password
					</button>
				</a>
			</div>
		{/if}

		<div class="h-[89vh] w-full flex-1 overflow-y-auto p-3 py-5 sm:p-10">
			<PageTransitions url="{data.url}">
				<slot />
			</PageTransitions>
		</div>
	</div>
</div>
