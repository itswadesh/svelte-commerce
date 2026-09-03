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
	import { hasConfiguredSupportChat } from '$lib/components/common/store-capabilities.js'
	import { dialog } from '$lib/actions/dialog.js'
	import { fade, fly } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'

	let { children }: { children: Snippet } = $props()
	let isMobileMenuOpen = $state(false)

	const wishlistPlugin = $derived(page.data?.store?.plugins?.isWishlist)
	setWishlistState()
	setCartState()
	setUserState()

	// StorePlugins mounts the support-chat widget, and the core component substitutes a demo account
	// id when the merchant has not filled one in, so an active-but-unconfigured plugin sends
	// shoppers into another business's support inbox. Mount it only when there is a real account.
	const supportChatConfigured = $derived(hasConfiguredSupportChat(page.data?.store?.plugins))

	// Background scroll lock while the account drawer is open: without it the page behind still
	// scrolls under a touch drag, so closing the menu returns the shopper somewhere they never
	// chose to be. Same pattern as the main nav drawer.
	$effect(() => {
		if (!isMobileMenuOpen) return
		const previous = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = previous
		}
	})

	const menuItems = $derived.by(() => {
		const items = [
			{ href: '/my', icon: Home, label: 'Dashboard' },
			{ href: '/my/profile', icon: Users, label: 'Profile' },
			{ href: '/my/orders', icon: Package, label: 'Orders' },
			{ href: '/my/addresses', icon: MapPinHouse, label: 'Addresses' }
		]
		if (wishlistPlugin?.active) items.push({ href: '/my/wishlist', icon: Heart, label: 'Wishlist' })
		return items
	})

	let breadcrumbItems = $state<{ label: string; href: string }[]>([])
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

<!-- One definition of the account links, rendered by both the desktop column and the mobile drawer,
     so the two can never drift apart. 44px tall on a phone, where every mis-tap costs a navigation. -->
{#snippet accountLinks()}
	{#each menuItems as { href, icon: Icon, label }}
		{@const isActive = page.url.pathname === href || (page.url.pathname.startsWith(href) && href !== '/my')}
		<Button {href} variant={isActive ? 'default' : 'ghost'} class="h-11 w-full justify-start md:h-10" onclick={() => (isMobileMenuOpen = false)}>
			<Icon class="mr-4 h-5 w-5" />
			{label}
		</Button>
	{/each}
{/snippet}

<!-- Account pages are private; keep the whole (my) tree out of search indexes. -->
<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if supportChatConfigured}
	<StorePlugins />
{/if}

<Nav />

<div class="page-width relative flex min-h-screen flex-col p-0 md:flex-row md:p-0">
	<!-- Desktop: a static column, not a drawer. Below `md` it is not rendered at all, which is what
	     the old `inert` attribute was emulating on a panel that stayed in the DOM off-screen. -->
	<aside class="hidden md:sticky md:top-0 md:block md:w-72 md:shrink-0">
		<nav aria-label="Account" class="space-y-2 p-6 pt-12">
			{@render accountLinks()}
		</nav>
	</aside>

	<!-- Main content -->
	<main id="main" class="min-w-0 flex-1 px-2 md:px-6">
		<div class="mb-4 flex items-center justify-start gap-2">
			<!-- The trigger used to be an unlabelled 36px icon button announced only as "button", with
			     nothing to say whether anything had opened. -->
			<Button
				variant="ghost"
				size="icon"
				aria-label="Account menu"
				aria-expanded={isMobileMenuOpen}
				aria-controls="account-menu-drawer"
				class="h-11 w-11 md:hidden"
				onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
			>
				{#if isMobileMenuOpen}
					<X class="h-5 w-5" />
				{:else}
					<Menu class="h-5 w-5" />
				{/if}
			</Button>
			<div class="md:hidden">
				<Breadcrumb items={breadcrumbItems} />
			</div>
		</div>
		{@render children()}
	</main>
</div>

<!-- Mobile: a real dialog. The panel used to sit off-screen but still in the DOM, so focus stayed on
     the trigger, the four links were reachable only by Shift+Tab and arrived in reverse order,
     Escape did nothing and the page behind kept scrolling. `use:dialog` moves focus in, traps Tab,
     closes on Escape and hands focus back to the trigger. -->
{#if isMobileMenuOpen}
	<div
		id="account-menu-drawer"
		class="fixed inset-0 z-drawer flex overflow-hidden md:hidden"
		role="dialog"
		aria-modal="true"
		aria-labelledby="account-menu-drawer-title"
		tabindex="-1"
		use:dialog={() => (isMobileMenuOpen = false)}
	>
		<!-- The scrim is decoration: a click target, not a control. Escape and the Close button are
		     the keyboard routes out. -->
		<div
			aria-hidden="true"
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 200 }}
			class="absolute inset-0 bg-black/40 backdrop-blur-xs"
			onclick={() => (isMobileMenuOpen = false)}
		></div>

		<div
			in:fly={{ x: -320, duration: 200, easing: cubicOut }}
			out:fly={{ x: -320, duration: 200, easing: cubicOut }}
			class="relative z-10 flex h-full w-[80%] max-w-xs flex-col overflow-y-auto border-r bg-background shadow-z-10"
		>
			<div class="flex items-center justify-between border-b px-5 py-4">
				<h2 id="account-menu-drawer-title" class="text-sm font-bold uppercase tracking-widest text-foreground">My account</h2>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Close account menu"
					class="h-11 w-11 rounded-full bg-muted text-foreground hover:bg-muted/70"
					onclick={() => (isMobileMenuOpen = false)}
				>
					<X class="h-4 w-4" />
				</Button>
			</div>

			<nav aria-label="Account" class="space-y-2 p-5">
				{@render accountLinks()}
			</nav>
		</div>
	</div>
{/if}

<Footer />
