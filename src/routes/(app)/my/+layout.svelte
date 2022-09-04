<style>
.bg {
	background-image: url('/login/bg-lighter.svg');
	background-size: 150rem;
	z-index: 0;
}
.frosted {
	backdrop-filter: blur(12px);
	background-color: hsla(0, 0%, 0%, 0.5);
}
@media (max-width: 640px) {
	.mt-rem-main {
		margin-top: 3.3rem;
	}
}
@media (min-width: 640px) {
	.mt-rem-main {
		margin-top: 4rem;
	}
}
.h-rem {
	height: 93.1vh;
}
.active {
	@apply text-primary-700;
}
</style>

<script>
import PageTransitions from '$lib/PageTransitions.svelte'
import { ToastContainer, FlatToast } from 'svelte-toasts'
import GoogleAnalytics from '$lib/components/GoogleAnalytics.svelte'
import SidebarDashboard from './_SidebarDashboard.svelte'
import PreloadingIndicator from '$lib/PreloadingIndicator.svelte'
import menu from '$lib/config/menu'
import BackToTop from '$lib/components/BackToTop.svelte'
import Nav from '$lib/Nav.svelte'

export let data
$: ({ path, url, sort, isHome, q, currentPage, me, cart, store } = data)

let showSidebar = true
</script>

<div class="flex h-full w-full items-start">
	{#if showSidebar && menu?.length > 0}
		<div
			class="h-rem relative hidden w-52 flex-shrink-0 overflow-y-auto overflow-x-hidden bg-primary-500 scrollbar-none sm:block">
			<!-- Close sidebar icon -->

			{#if showSidebar === true}
				<button
					type="button"
					title="Close sidebar"
					class="absolute top-0 right-0 z-10 bg-black p-1 text-white"
					on:click="{() => (showSidebar = false)}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 transform transition duration-300 hover:scale-110"
						viewBox="0 0 20 20"
						fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd">
						</path>
					</svg>
				</button>
			{/if}

			<!-- Dashboard -->

			<a href="/my" aria-label="Click to route dashboard" sveltekit:prefetch>
				<button type="button" class="w-full p-3 text-left text-sm text-gray-400 focus:outline-none">
					Dashboard
				</button>
			</a>

			<!-- Sidebar Data -->

			{#each menu as s}
				<SidebarDashboard me="{me}" sidebar="{s}" />
			{/each}
		</div>
	{/if}

	<div class="h-rem w-full flex-1 overflow-y-auto">
		<!-- Open sidebar icon -->

		{#if showSidebar === false}
			<button
				type="button"
				title="Open sidebar"
				class="fixed top-16 left-0 z-10 hidden bg-black p-1 text-white sm:block"
				on:click="{() => (showSidebar = true)}">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 transform transition duration-300 hover:scale-110"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"> </path>
				</svg>
			</button>
		{/if}

		<PageTransitions url="{url}">
			<div class="p-3 py-5 sm:p-10">
				<slot />
			</div>
		</PageTransitions>
	</div>

	<BackToTop />
</div>
