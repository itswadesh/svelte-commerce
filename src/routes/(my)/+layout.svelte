<script lang="ts">
	import { setCartState, setUserState, setWishlistState } from '$lib/core/stores/index.js'
	import { page } from '$app/state'
	import Footer from '$lib/components/common/footer.svelte'
	import Nav from '$lib/components/nav/nav.svelte'
	import { Home, Package, Users, Menu, MapPinHouse, X, Heart } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import type { Snippet } from 'svelte'
	import Breadcrumb from '$lib/components/ui/breadcrumb-route.svelte'
	import { StorePlugins } from '$lib/core/components/index.js'
	import { fade, fly } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'

	let { children }: { children: Snippet } = $props()
	let isMobileMenuOpen = $state(false)

  const wishlistPlugin = $derived(page.data?.store?.plugins?.isWishlist)
	setWishlistState()
	setCartState()
	setUserState()

	const menuItems = $derived.by(() => {
    const items = [
	  	{ href: '/my', icon: Home, label: 'Dashboard' },
	  	{ href: '/my/profile', icon: Users, label: 'Profile' },
	  	{ href: '/my/orders', icon: Package, label: 'Orders' },
	  	{ href: '/my/addresses', icon: MapPinHouse, label: 'Addresses' },
	  	// { href: '/my/profile', icon: Settings, label: 'Profile' }
	  ]
    if (wishlistPlugin?.active)
      items.push({ href: '/my/wishlist', icon: Heart, label: 'Wishlist' })
    return items
  })
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

<!-- Account pages are private; keep the whole (my) tree out of search indexes. -->
<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<StorePlugins />

<Nav />

<div class="page-width relative flex min-h-screen flex-col overflow-hidden p-0 md:flex-row md:p-0">
	<!-- Backdrop overlay for mobile -->
	{#if isMobileMenuOpen}
		<div transition:fade={{ duration: 200 }} class="fixed inset-0 z-20 md:hidden">
			<Button
				variant="ghost"
				class="h-full w-full rounded-none bg-black/30 p-0 hover:bg-black/30"
				onclick={() => (isMobileMenuOpen = false)}
			>
				<span class="sr-only">Close menu</span>
			</Button>
		</div>
	{/if}

	<!-- Sidebar - Hidden on mobile unless menu is open -->
	<aside
		class="fixed left-0 top-0 z-30 h-full w-[80%] max-w-xs transform  bg-white transition-all duration-300 ease-in-out md:sticky md:w-72 md:translate-x-0 {isMobileMenuOpen
			? 'translate-x-0 shadow-2xl'
			: '-translate-x-full md:shadow-none'}"
		class:md:relative={true}
	>
		{#if isMobileMenuOpen || !isMobileMenuOpen}
			<nav class="relative top-[5rem] space-y-2 p-6 pt-10 md:top-0 md:pt-12">
				{#each menuItems as { href, icon: Icon, label }, i}
					{@const isActive = page.url.pathname === href || (page.url.pathname.startsWith(href) && href !== '/my')}
					<Button
						{href}
						variant={isActive ? 'default' : 'ghost'}
						class="w-full justify-start"
						onclick={() => (isMobileMenuOpen = false)}
					>
						<Icon class="mr-4 h-5 w-5" />
						{label}
					</Button>
				{/each}
			</nav>
		{/if}
	</aside>

	<!-- Main content -->
	<main class="flex-1 overflow-y-auto px-2 md:px-6">
		<div class="mb-4 block flex justify-start items-center max-md:flex max-md:gap-2">
			<!-- Mobile menu button -->
			<Button
				variant="ghost"
				size="icon"
				class="md:hidden"
				onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
			>
				{#if isMobileMenuOpen}
					<X class="h-4 w-4" />
				{:else}
					<Menu class="h-4 w-4" />
				{/if}
			</Button>
			<div class="md:hidden">
			<Breadcrumb items={breadcrumbItems} />
			</div>
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
