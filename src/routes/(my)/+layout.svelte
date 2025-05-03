<script lang="ts">
	import { setCartState } from '$lib/core/stores/cart.svelte'
	import { page } from '$app/state'
	import Footer from '$lib/components/common/footer.svelte'
	import Nav from '$lib/components/nav/nav.svelte'
	import { Home, Package, Users, Settings, Menu, X, Heart } from 'lucide-svelte'
	import type { Snippet } from 'svelte'
	import Breadcrumb from '$lib/components/ui/breadcrumb-route.svelte'
	import { MapPinHouse } from 'lucide-svelte'
	import { setUserState } from '$lib/core/stores/auth.svelte'
	import StorePlugins from '$lib/core/components/plugins/store-plugins.svelte'
	import { fade, fly } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'

	let { children }: { children: Snippet } = $props()
	let isMobileMenuOpen = $state(false)

	setCartState()
	setUserState()

	const menuItems = [
		{ href: '/my', icon: Home, label: 'Dashboard' },
		{ href: '/my/profile', icon: Users, label: 'Profile' },
		{ href: '/my/orders', icon: Package, label: 'Orders' },
		{ href: '/my/addresses', icon: MapPinHouse, label: 'Addresses' },
		{ href: '/my/wishlist', icon: Heart, label: 'Wishlist' }
		// { href: '/my/profile', icon: Settings, label: 'Profile' }
	]
	let breadcrumbItems = $state([])
	// Generate breadcrumb items based on current route
	$effect(() => {
		breadcrumbItems = page.url.pathname
			.split('/')
			.filter(Boolean)
			.map((path, index, arr) => {
				const href = `/${arr.slice(0, index + 1).join('/')}`
				// Convert path to readable label (e.g., 'my-orders' -> 'My Orders')
				const label = path
					.split('-')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' ')
				return { label, href }
			})
	})
</script>

<StorePlugins />

<Nav />

<div class="container relative flex min-h-screen flex-col overflow-hidden p-0 md:flex-row md:p-0">
	<!-- Backdrop overlay for mobile -->
	{#if isMobileMenuOpen}
		<button class="fixed inset-0 z-20 bg-black/30 md:hidden" transition:fade={{ duration: 200 }} onclick={() => (isMobileMenuOpen = false)}>
			<span class="sr-only">Close menu</span>
		</button>
	{/if}

	<!-- Sidebar - Hidden on mobile unless menu is open -->
	<aside
		class="fixed left-0 top-0 z-30 h-full w-[80%] max-w-xs transform border-r bg-white shadow-lg transition-all duration-300 ease-in-out md:sticky md:w-64 md:translate-x-0 md:shadow-none {isMobileMenuOpen
			? 'translate-x-0'
			: '-translate-x-full'}"
		class:md:relative={true}
	>
		{#if isMobileMenuOpen || !isMobileMenuOpen}
			<nav class="relative top-[5rem] space-y-1 p-4 pt-6 md:top-0 md:pt-4">
				{#each menuItems as { href, icon: Icon, label }, i}
					<a
						{href}
						class="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 {page.url.pathname === href ||
						(page.url.pathname.startsWith(href) && href !== '/my')
							? 'bg-gray-100 text-primary'
							: 'text-gray-600 hover:text-gray-900'}"
						onclick={() => (isMobileMenuOpen = false)}
						in:fly={{ y: 20, x: -20, delay: 100 + i * 50, duration: 200, easing: quintOut }}
					>
						<Icon class="mr-3 h-5 w-5" />
						{label}
					</a>
				{/each}
			</nav>
		{/if}
	</aside>

	<!-- Main content -->
	<main class="flex-1 overflow-y-auto px-4 md:px-6">
		<div class="mb-4 block max-md:flex max-md:gap-2">
			<!-- Mobile menu button -->
			<button
				class="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
				onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
			>
				{#if isMobileMenuOpen}
					<X class="h-4 w-4" />
				{:else}
					<Menu class="h-4 w-4" />
				{/if}
				<!-- <span class="ml-2 text-lg font-semibold">Menu</span> -->
			</button>
			<Breadcrumb items={breadcrumbItems} />
		</div>
		{@render children()}
	</main>
</div>

<Footer />

<style>
	/* Add smooth scrolling */
	:global(html) {
		scroll-behavior: smooth;
	}

	/* Ensure the sidebar has proper height */
	aside {
		height: 100vh;
		height: 100dvh; /* For mobile browsers with dynamic viewport height */
	}

	/* Improve transition performance */
	aside {
		will-change: transform;
		backface-visibility: hidden;
	}

	/* Ensure content doesn't overflow on small screens */
	@media (max-width: 768px) {
		main {
			padding-bottom: 2rem;
		}
	}
</style>
