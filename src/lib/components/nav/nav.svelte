<script lang="ts">
	import {
		X,
		UserCircle,
		ChevronLeft,
		ChevronDown,
		Phone,
		Mail,
		Menu,
		Heart,
		Home,
		Tag,
		Layers,
		Package,
		MapPin,
		KeyRound,
		LogOut
	} from '@lucide/svelte'
	import MainNav from './main-nav.svelte'
	import MegaMenu from './mega-menu.svelte'
	import { page } from '$app/state'
	import MsSearch from './ms-search.svelte'
	import AuthModal from '$lib/components/auth/auth-modal.svelte'
	import { AuthButton } from '$lib/core/components/index.js'
	import { fade, fly } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import { NavModule } from '$lib/core/composables/index.js'
	import { getWishlistState } from '@misiki/kitcommerce-core/stores'
	import CartSidebar from './cart-sidebar.svelte'
	import ProfileDropdown from './profile-dropdown.svelte'
	import { Button } from '$lib/components/ui/button/index.js'
	import { onDestroy, onMount } from 'svelte'
	import NoorNav from '$lib/theme/noor/NoorNav.svelte'
	import LimelightNav from '$lib/theme/limelight/LimelightNav.svelte'

	const wishlistState = getWishlistState()
	const wishlistPlugin = $derived(page?.data?.store?.plugins?.isWishlist)
	const navModule = new NavModule()
	const userState = navModule.userState
	const isHomepage = $derived(page.route?.id === '/(www)')
	// Hysteresis: collapse and expand at different offsets. With a single threshold the
	// header oscillates near the top — collapsing shrinks the sticky header, the browser's
	// scroll anchoring drops scrollY back under the threshold, the header re-expands, and
	// the cycle repeats. The gap must exceed the height lost on collapse (hello bar +
	// row-height change ≈ 56px).
	let isScrolled = $state(false)
	$effect(() => {
		if (navModule.scrollY > 90) isScrolled = true
		else if (navModule.scrollY < 10) isScrolled = false
	})
	const sidebarHistoryKey = '__svelteCommerceMobileSidebar'
	let ownsSidebarHistoryEntry = false

	function handleSidebarBrowserBack() {
		if (!navModule.openSidebar || !ownsSidebarHistoryEntry) return
		ownsSidebarHistoryEntry = false
		navModule.openSidebar = false
	}

	onMount(() => {
		window.addEventListener('popstate', handleSidebarBrowserBack)
		return () => window.removeEventListener('popstate', handleSidebarBrowserBack)
	})

	$effect(() => {
		if (typeof window === 'undefined') return

		if (navModule.openSidebar && !ownsSidebarHistoryEntry) {
			history.pushState({ ...history.state, [sidebarHistoryKey]: true }, '', window.location.href)
			ownsSidebarHistoryEntry = true
		} else if (!navModule.openSidebar && ownsSidebarHistoryEntry) {
			const isCurrentSidebarEntry = history.state?.[sidebarHistoryKey] === true
			ownsSidebarHistoryEntry = false
			if (isCurrentSidebarEntry) history.back()
		}
	})

	onDestroy(() => {
		if (typeof window !== 'undefined' && ownsSidebarHistoryEntry && history.state?.[sidebarHistoryKey] === true) {
			history.back()
		}
	})

	const menuItemsUser = $derived.by(() => {
		const items = [
			{ title: 'Profile', url: '/my/profile' },
			{ title: 'Orders', url: '/my/orders' },
			// { title: 'Buy Again', url: '/my/buy-again' },
			{ title: 'Addresses', url: '/my/addresses' },
			{ title: 'Change Password', url: '/auth/change-password' }
		]
		if (wishlistPlugin?.active) items.push({ title: 'Wishlist', url: '/my/wishlist' })
		return items
	})

	const activeThemeName = $derived(page.data?.theme?.name ?? 'default')
	const storeData = $derived(page?.data?.store ?? {})

	// Local expansion state for the nested mobile menu — tracks which header-menu parent is
	// open. Kept here (not the composable's category-sized showSubCategory) so it indexes by
	// the header menu itself.
	let mobileNestOpen = $state<boolean[]>([])
	function toggleMobileNest(i: number) {
		mobileNestOpen[i] = !mobileNestOpen[i]
	}
</script>

<svelte:window bind:scrollY={navModule.scrollY} />

{#if activeThemeName === 'limelight'}
	<LimelightNav {navModule} {wishlistPlugin} {wishlistState} {userState} {storeData} pathname={page.url.pathname} />
{:else if activeThemeName === 'noor'}
	<NoorNav {navModule} {wishlistPlugin} {wishlistState} {userState} {storeData} pathname={page.url.pathname} />
{:else}
	<header
		class:ed={activeThemeName === 'default'}
		class="{navModule.isProductListingPage
			? 'max-sm:border-b'
			: ''} shadow-xs sticky top-0 z-50 w-full flex-col items-center justify-between bg-white transition-all duration-200"
	>
		<!-- Hello bar -->
		{#if navModule.helloBarPlugin?.active && isHomepage}
			<!-- <div class="bg-primary py-2 text-center text-xs text-white sm:text-sm">
				{@html helloBarPlugin?.content}
			</div> -->

			<!-- Grid-rows 1fr→0fr collapse animates to zero without a magic max-height. -->
			<div class="grid transition-[grid-template-rows] duration-300 ease-in-out {isScrolled ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}">
				<div class="overflow-hidden">
					{#if navModule.helloBarPlugin?.content}
						<div class="max-w-none bg-primary py-2 text-center text-xs text-primary-foreground sm:text-sm">
							<ul class="sliding-list" style="--item-count: {navModule.itemCount}; --anim-duration: {navModule.animationDuration}s;">
								{#if navModule.helloBarPlugin?.content}
									<li style="--index: 1;">{@html navModule.helloBarPlugin?.content}</li>
								{/if}
								{#if navModule.helloBarPlugin?.content2}
									<li style="--index: 2;">{@html navModule.helloBarPlugin?.content2}</li>
								{/if}
								{#if navModule.helloBarPlugin?.content3}
									<li style="--index: 3;">{@html navModule.helloBarPlugin?.content3}</li>
								{/if}
							</ul>
						</div>
					{:else}
						<div class="bg-primary py-2 text-center text-xs text-foreground sm:text-sm">
							{@html navModule.helloBarPlugin?.content}
						</div>
					{/if}
				</div>
			</div>
		{/if}
		<!-- Fixed heights stand in for vertical padding here, so the scroll slimming transitions height instead. -->
		<div class="ed-row page-width flex items-center justify-between bg-white transition-[height] duration-300 ease-in-out {isScrolled ? 'h-12' : 'h-16 sm:h-14'}">
			<div class="hidden justify-center gap-3 sm:flex">
				<Button
					variant="ghost"
					size="icon"
					aria-label="Sidebar"
					class="md:hidden"
					onclick={() => {
						navModule.openSidebar = true
					}}
				>
					<Menu class="text-black" />
				</Button>
				<MainNav />
			</div>

			<div class="flex items-center justify-center sm:hidden">
				{#if navModule.isProductListingPage}
					<div class="flex items-center gap-2">
						<Button variant="ghost" size="icon" aria-label="Go back" onclick={navModule.goBack}>
							<ChevronLeft class="h-6 w-6 font-bold" />
							<span class="sr-only">Go back</span>
						</Button>

						<div class="flex flex-col items-start">
							{#if page.params?.slug || page.url?.searchParams?.get?.('search')}
								<p class="ed-plp-title text-base font-semibold capitalize">
									{page.params?.slug?.replace?.(/-/g, ' ').replace?.(/\b\w/g, (c) => c?.toUpperCase?.()) || page.url?.searchParams?.get?.('search')}
								</p>
							{:else}
								<p class="ed-plp-title text-base font-semibold">Products</p>
							{/if}

							<p class="ed-plp-count text-xs text-gray-500">{navModule.productsCount > 999 ? '1000+' : navModule.productsCount} products</p>
						</div>
					</div>
				{:else}
					<Button
						variant="ghost"
						size="icon"
						aria-label="Sidebar"
						class="md:hidden"
						onclick={() => {
							navModule.openSidebar = true
						}}
					>
						<Menu class="text-black" />
					</Button>
					<MainNav />
				{/if}
			</div>

			{#if navModule.megaMenuPluginActive}
				<div class="hidden md:block">
					<MegaMenu slim={isScrolled} />
				</div>
			{/if}
			<div class="flex items-center gap-2 sm:gap-2">
				<MsSearch />

				{#if wishlistPlugin?.active}
					<div class="relative hidden sm:block" role="navigation">
						<a
							href="/my/wishlist"
							class="ed-action flex items-center justify-center rounded-full px-2 text-gray-700 transition-colors hover:text-black"
							aria-label="Wishlist"
						>
							<Heart class="h-5 w-5" />
							{#if wishlistState?.count > 0}
								<span
									class="absolute right-0 top-0 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-primary px-1.5 py-1 text-xs font-bold leading-none text-primary-foreground"
								>
									{wishlistState.count}
								</span>
							{/if}
						</a>
					</div>
				{/if}

				{#if !page.url.pathname.startsWith('/checkout')}
					<div class="">
						<CartSidebar
							onClose={navModule.closeCartSidebar}
							onContinueShopping={navModule.handleContinueShoppingClick}
							onRemoveCartItem={navModule.removeCartItem}
						/>
					</div>
				{/if}

				<div class="flex h-full items-center px-2 font-sans">
					{#if userState?.user?.role}
						<ProfileDropdown onSignOut={navModule.handleSignOut} />
					{:else}
						<AuthButton aria-label="Login" type="login">
							<div class="ed-action flex items-center justify-center text-gray-700 transition-colors hover:text-black">
								<UserCircle class="h-5 w-5" />
							</div>
						</AuthButton>
					{/if}
				</div>
			</div>
		</div>
	</header>
{/if}

<!-- Sidebar -->
{#if navModule.openSidebar}
	<aside class:ed={activeThemeName === 'default'} class="fixed inset-0 z-[100] flex overflow-hidden bg-transparent font-sans">
		<div
			role="button"
			tabindex="0"
			aria-label="Close sidebar"
			in:fade={{ duration: 300 }}
			out:fade={{ duration: 300 }}
			class="backdrop-blur-xs absolute inset-0 bg-black/40"
			onclick={() => {
				navModule.openSidebar = false
			}}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					navModule.openSidebar = false
				}
			}}
		>
			<span class="sr-only">Close sidebar</span>
		</div>
		<div
			in:fly={{ x: -320, duration: 300, easing: cubicOut }}
			out:fly={{ x: -320, duration: 300, easing: cubicOut }}
			class="ed-drawer relative z-[60] flex h-full w-full max-w-[300px] flex-col overflow-hidden border-r border-gray-100 bg-white text-foreground shadow-2xl"
		>
			<!-- Header -->
			<div class="ed-drawer-head flex items-center justify-between border-b border-gray-100 px-5 py-4">
				<a href="/" class="flex items-center gap-2" onclick={() => (navModule.openSidebar = false)}>
					{#if activeThemeName === 'noor'}
						<img src="/noor/logo.png" class="h-8 object-contain" alt="Noor" />
					{:else if page?.data?.store?.logo}
						<img src={page?.data?.store?.logo} class="h-8 object-contain" alt={page?.data?.store?.name || 'Logo'} />
					{:else}
						<span class="text-base font-black uppercase tracking-wider text-black">
							{page?.data?.store?.name || 'Svelte Commerce'}
						</span>
					{/if}
				</a>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Close sidebar"
					class="h-8 w-8 rounded-full bg-gray-50 text-foreground hover:bg-gray-100"
					onclick={() => (navModule.openSidebar = false)}
				>
					<X class="h-4 w-4" />
				</Button>
			</div>

			<!-- User Profile Banner -->
			<div class="ed-drawer-user border-b border-gray-100 bg-gray-50/50 px-5 py-4">
				{#if userState?.user?.role}
					<div class="flex items-center gap-3">
						<div class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
							{#if userState.user?.avatar}
								<img src={userState.user.avatar} alt="" class="h-full w-full object-cover" />
							{:else}
								<UserCircle class="h-5 w-5" />
							{/if}
						</div>
						<div class="overflow-hidden">
							<p class="truncate text-xs font-bold text-gray-900">
								{userState.user?.firstName || userState.user?.name || 'My Account'}
							</p>
							<p class="truncate text-[10px] font-medium text-gray-500">
								{userState.user?.email || ''}
							</p>
						</div>
					</div>
				{:else}
					<div class="flex flex-col gap-1.5">
						<span class="ed-drawer-label text-[10px] font-bold uppercase tracking-wider text-gray-400">Welcome Guest</span>
						<AuthButton aria-label="Login" type="login">
							<div
								class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-all duration-200 hover:bg-primary/95"
							>
								<UserCircle class="h-4 w-4" />
								<span>Login / Register</span>
							</div>
						</AuthButton>
					</div>
				{/if}
			</div>

			<!-- Menu Scroll Area -->
			<div class="flex-1 space-y-6 overflow-y-auto px-5 py-4">
				<!-- Shop Section -->
				<div>
					<span class="ed-drawer-label mb-3 block text-[10px] font-bold uppercase tracking-wider text-gray-400">Shop & Explore</span>
					<ul class="m-0 flex w-full list-none flex-col gap-1.5 p-0 text-sm">
						<li>
							<a
								href="/"
								class="ed-drawer-link flex items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-black"
								onclick={() => (navModule.openSidebar = false)}
							>
								<Home class="h-4 w-4 text-gray-400" />
								<span>Home</span>
							</a>
						</li>


						<li>
							<a
								href="/products"
								class="ed-drawer-link flex items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-black"
								onclick={() => (navModule.openSidebar = false)}
							>
								<Tag class="h-4 w-4 text-gray-400" />
								<span>All Products</span>
							</a>
						</li>
					</ul>
				</div>

				<!-- NavMenu Section -->
				{#if navModule.navMenu?.length}
					<div>
						<span class="ed-drawer-label mb-3 block text-[10px] font-bold uppercase tracking-wider text-gray-400">Quick Links</span>
						<ul class="m-0 flex w-full list-none flex-col gap-1.5 p-0 text-sm">
							{#each navModule.navMenu as menuItem, i}
								<li>
									{#if menuItem?.items?.length}
										<div class="flex w-full items-center justify-between">
											<a
												href={menuItem?.link || (menuItem?.slug ? '/' + menuItem.slug : '/products')}
												class="ed-drawer-link flex flex-1 items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-black"
												onclick={() => (navModule.openSidebar = false)}
											>
												<Layers class="h-4 w-4 text-gray-400" />
												<span>{menuItem.name}</span>
											</a>
											<button
												type="button"
												class="grid h-8 w-8 shrink-0 place-items-center rounded-md text-gray-500 transition-colors hover:bg-gray-100"
												aria-label="Toggle {menuItem.name}"
												aria-expanded={mobileNestOpen[i] ? 'true' : 'false'}
												onclick={() => toggleMobileNest(i)}
											>
												<ChevronDown class="h-4 w-4 transition-transform duration-300 {mobileNestOpen[i] ? '-rotate-180' : ''}" />
											</button>
										</div>
										{#if mobileNestOpen[i]}
											<ul class="m-0 ml-6 mt-1 flex list-none flex-col gap-1 border-l border-gray-100 p-0 pl-3">
												{#each menuItem.items as child}
													<li>
														<a
															href={child?.link || (child?.slug ? '/' + child.slug : '/products')}
															class="ed-drawer-link block rounded-md px-3 py-1.5 text-[11px] font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-black"
															onclick={() => (navModule.openSidebar = false)}
														>
															{child.name}
														</a>
													</li>
												{/each}
											</ul>
										{/if}
									{:else}
										<a
											href={menuItem?.link}
											class="ed-drawer-link flex items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-black"
											onclick={() => (navModule.openSidebar = false)}
										>
											<Layers class="h-4 w-4 text-gray-400" />
											<span>{menuItem.name}</span>
										</a>
									{/if}
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- Account Section -->
				<div>
					<span class="ed-drawer-label mb-3 block text-[10px] font-bold uppercase tracking-wider text-gray-400">My Account</span>
					<ul class="m-0 flex w-full list-none flex-col gap-1.5 p-0 text-sm">
						{#if menuItemsUser?.length}
							{#each menuItemsUser as m}
								<li>
									<a
										href={m.url}
										class="ed-drawer-link flex items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-black"
										onclick={() => (navModule.openSidebar = false)}
									>
										{#if m.title === 'Profile'}
											<UserCircle class="h-4 w-4 text-gray-400" />
										{:else if m.title === 'Orders'}
											<Package class="h-4 w-4 text-gray-400" />
										{:else if m.title === 'Addresses'}
											<MapPin class="h-4 w-4 text-gray-400" />
										{:else if m.title === 'Change Password'}
											<KeyRound class="h-4 w-4 text-gray-400" />
										{:else if m.title === 'Wishlist'}
											<Heart class="h-4 w-4 text-gray-400" />
										{/if}
										<span>{m.title}</span>
									</a>
								</li>
							{/each}
						{/if}

						{#if userState?.user?.role}
							<li>
								<button
									class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700"
									onclick={() => {
										navModule.openSidebar = false
										navModule.handleSignOut()
									}}
								>
									<LogOut class="h-4 w-4 text-red-400" />
									<span>Sign Out</span>
								</button>
							</li>
						{/if}
					</ul>
				</div>
			</div>

			<!-- Footer Contact Box -->
			{#if page?.data?.store?.businessEmail || page?.data?.store?.businessPhone}
				<div class="ed-drawer-foot border-t border-gray-100 bg-gray-50/50 p-5">
					<span class="ed-drawer-label mb-2 block text-[9px] font-bold uppercase tracking-wider text-gray-400">Support Contact</span>
					<div class="flex flex-col gap-2">
						{#if page?.data?.store?.businessEmail}
							<a
								href="mailto:{page?.data?.store?.businessEmail}"
								aria-label="Email us"
								class="ed-contact flex items-center gap-2.5 text-[11px] font-medium text-gray-600 transition-colors duration-200 hover:text-black"
							>
								<Mail class="h-3.5 w-3.5 text-gray-400" />
								<span class="truncate">{page?.data?.store?.businessEmail}</span>
							</a>
						{/if}

						{#if page?.data?.store?.businessPhone}
							<a
								href="tel:+{page?.data?.store?.businessPhone}"
								aria-label="Call us"
								class="ed-contact flex items-center gap-2.5 text-[11px] font-medium text-gray-600 transition-colors duration-200 hover:text-black"
							>
								<Phone class="h-3.5 w-3.5 text-gray-400" />
								<span>+{page?.data?.store?.businessPhone}</span>
							</a>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</aside>
{/if}

<AuthModal bind:show={navModule.showAuthModal} />

<style>
	/* ============================================================
	   Refined Editorial header + drawer — default theme only.
	   `.ed` is added via class:ed only when activeThemeName === 'default',
	   so sarab/organic keep their existing look untouched.
	   ============================================================ */
	header.ed {
		background: var(--ed-surface);
		box-shadow: none;
		border-bottom: 1px solid var(--ed-line);
		font-family: var(--ed-body);
		color: var(--ed-ink);
	}

	.ed .ed-row {
		background: transparent;
	}

	/* Header action icons (wishlist, account) — ink, accent on hover */
	.ed .ed-action {
		color: var(--ed-ink);
		transition: color 0.25s ease;
	}

	.ed .ed-action:hover {
		color: hsl(var(--primary));
	}

	/* Mobile product-listing header */
	.ed .ed-plp-title {
		font-family: var(--ed-display);
		font-weight: 500;
		letter-spacing: -0.01em;
		color: var(--ed-ink);
	}

	.ed .ed-plp-count {
		color: var(--ed-soft);
		letter-spacing: 0.02em;
	}

	/* ---------- Mobile drawer ---------- */
	.ed .ed-drawer {
		background: var(--ed-surface);
		border-right-color: var(--ed-line);
		color: var(--ed-ink);
	}

	.ed .ed-drawer-head,
	.ed .ed-drawer-user,
	.ed .ed-drawer-foot {
		border-color: var(--ed-line);
	}

	.ed .ed-drawer-user,
	.ed .ed-drawer-foot {
		background: var(--ed-canvas);
	}

	.ed .ed-drawer-label {
		font-family: var(--ed-body);
		color: var(--ed-soft);
		letter-spacing: 0.18em;
		font-weight: 600;
	}

	.ed .ed-drawer-link {
		color: var(--ed-ink);
		font-family: var(--ed-body);
		border-radius: var(--ed-radius);
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}

	.ed .ed-drawer-link:hover {
		background: var(--ed-canvas);
		color: hsl(var(--primary));
	}

	.ed .ed-drawer-link :global(svg) {
		color: var(--ed-soft);
		transition: color 0.2s ease;
	}

	.ed .ed-drawer-link:hover :global(svg) {
		color: hsl(var(--primary));
	}

	.ed .ed-contact {
		color: var(--ed-soft);
		transition: color 0.2s ease;
	}

	.ed .ed-contact:hover {
		color: hsl(var(--primary));
	}

	.ed .ed-contact :global(svg) {
		color: var(--ed-soft);
	}

	@media (prefers-reduced-motion: reduce) {
		.ed .ed-action,
		.ed .ed-drawer-link,
		.ed .ed-drawer-link :global(svg),
		.ed .ed-contact {
			transition: none;
		}
	}

	.minimum-width-rem {
		min-width: 360px;
	}

	@media screen and (max-width: 350px) {
		.minimum-width-rem {
			min-width: 300px;
		}
	}

	.sliding-list {
		list-style: none;
		margin: 0;
		padding: 0;
		height: 1.8rem;
		overflow: hidden;
		position: relative;
	}

	.sliding-list li {
		height: 1.8rem;
		line-height: 1.8rem;
		position: absolute;
		width: 100%;
		opacity: 0;
		animation: slideUp var(--anim-duration) linear infinite;
		animation-delay: calc(var(--index) * (var(--anim-duration) / var(--item-count)));
	}

	.sliding-list li:first-child {
		opacity: 1;
		top: 0;
	}

	@media screen and (max-width: 300px) {
		.sliding-list {
			height: 1rem;
		}
		.sliding-list li {
			height: 1rem;
			line-height: 1rem;
		}
	}

	@keyframes slideUp {
		0%,
		3% {
			top: 100%;
			opacity: 0;
		}
		5%,
		33% {
			top: 0;
			opacity: 1;
		}
		36%,
		100% {
			top: -100%;
			opacity: 0;
		}
	}
</style>
