<script lang="ts">
	import CartItem from '$lib/components/cart/cart-item.svelte'
	import {
		X,
		UserCircle,
		ChevronLeft,
		Phone,
		Mail,
		Menu,
		Home,
		ChevronDown,
		ShoppingBag,
		MapPin,
		Check,
		Heart,
		ArrowRightCircleIcon
	} from '@lucide/svelte'
	import MainNav from './main-nav.svelte'
	import { Button } from '$lib/components/ui/button'
	import { goto } from '$app/navigation'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { formatPrice } from '$lib/core/utils'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import MegaMenu from './mega-menu.svelte'
	import { page } from '$app/state'
	import MsSearch from './ms-search.svelte'
	import AuthModal from '$lib/components/auth/auth-modal.svelte'
	import AuthButton from '$lib/core/components/auth/auth-button.svelte'
	import { fade } from 'svelte/transition'
	import { NavModule } from '$lib/core/composables/index.js'
	import { getWishlistState } from '@misiki/kitcommerce-core/stores'
	import CartSidebar from './cart-sidebar.svelte'

	const menuItemsUser = [
		{ title: 'Profile', url: '/my/profile' },
		{ title: 'Orders', url: '/my/orders' },
		// { title: 'Buy Again', url: '/my/buy-again' },
		{ title: 'Addresses', url: '/my/addresses' },
		{ title: 'Wishlist', url: '/my/wishlist' },
		{ title: 'Change Password', url: '/auth/change-password' }
	]

	const { storeData } = $props()

  const wishlistState = getWishlistState()
	const wishlistPlugin = $derived(page?.data?.store?.plugins?.isWishlist)
	const navModule = new NavModule()
	const userState = navModule.userState
	const cartState = navModule.cartState
</script>

<svelte:window bind:scrollY={navModule.scrollY} />

<header
	class="{navModule.isProductListingPage
		? 'max-sm:border-b'
		: ''} shadow-xs sticky top-0 z-50 w-full flex-col items-center justify-between bg-white transition-all duration-200"
>
	<!-- Hello bar -->
	{#if navModule.helloBarPlugin?.active && !navModule.isProductListingPage}
		<!-- <div class="bg-primary py-2 text-center text-xs text-white sm:text-sm">
			{@html helloBarPlugin?.content}
		</div> -->

		{#if navModule.helloBarPlugin?.content}
			<div class="max-w-none bg-primary py-2 text-center text-xs text-white sm:text-sm">
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
			<div class="bg-primary py-2 text-center text-xs text-white sm:text-sm">
				{@html navModule.helloBarPlugin?.content}
			</div>
		{/if}
	{/if}
	<div class="page-width flex items-center justify-between bg-white py-3 sm:py-2">
		<div class="hidden justify-center gap-3 sm:flex">
			<button
				aria-label="Sidebar"
				type="button"
				class="block text-zinc-200 transition duration-300 hover:text-white focus:outline-none md:hidden"
				onclick={() => {
					navModule.openSidebar = true
				}}
			>
				<Menu class="text-black" />
			</button>
			<MainNav />
		</div>

		<div class="flex gap-3 sm:hidden">
			{#if navModule.isProductListingPage}
				<div class="flex items-center gap-2">
					<button class="flex items-center gap-2 text-lg font-medium" aria-label="Go back" onclick={navModule.goBack}>
						<ChevronLeft class="h-6 w-6 font-bold" />
						<span class="sr-only">Go back</span>
					</button>

					<div class="flex flex-col items-start">
						{#if page.params?.slug || page.url?.searchParams?.get?.('search')}
							<p class="text-base font-semibold capitalize">
								{page.params?.slug?.replace?.(/-/g, ' ').replace?.(/\b\w/g, (c) => c?.toUpperCase?.()) || page.url?.searchParams?.get?.('search')}
							</p>
						{:else}
							<p class="text-base font-semibold">Products</p>
						{/if}

						<p class="text-xs text-gray-500">{navModule.productsCount > 999 ? '1000+' : navModule.productsCount} products</p>
					</div>
				</div>
			{:else}
				<button
					aria-label="Sidebar"
					type="button"
					class="block text-zinc-200 transition duration-300 hover:text-white focus:outline-none md:hidden"
					onclick={() => {
						navModule.openSidebar = true
					}}
				>
					<Menu class="text-black" />
				</button>
				<MainNav />
			{/if}
		</div>

		{#if navModule.megaMenuPluginActive}
			<div class="hidden md:block">
				<MegaMenu />
			</div>
		{/if}
		<div class="flex items-center gap-2">
			<!-- <Search /> -->
			<div class="flex items-center">
				<div class="relative flex items-center intra-gap">
					<!-- {#if isProductListingPage}
              <div class="block sm:hidden">
                {#if page?.data?.store?.plugins?.socialSharingButtons?.active}
                  <ShareButton
                    productName={page?.url?.pathname?.split("/")?.[2]}
                    productImage={""}
                    url={page?.url?.href}
                  />
                {/if}
              </div>
            {/if} -->

					<MsSearch />

					<!-- {#if page?.url?.pathname !== '/'}
				<a
					href="/"
					class="flex items-center justify-center rounded-full p-2 text-gray-500 transition-all duration-300 ease-out hover:bg-gray-100 hover:text-primary hover:scale-110 active:scale-95"
					aria-label="Home"
				>
					<Home class="h-5 w-5" />
				</a>
				{/if} -->

					{#if wishlistPlugin.active}
						<div class="relative px-2" role="navigation">
							<a href="/my/wishlist" class="rounded-full" aria-label="Toggle Cart">
                <Heart class="h-5 w-5"/>
								{#if wishlistState.count > 0}
									<span
										class="absolute right-0 top-0 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-primary px-1.5 py-1 text-xs font-bold leading-none text-white"
									>
										{wishlistState.count}
									</span>
								{/if}
							</a>
						</div>
					{/if}

					{#if !page.url.pathname.startsWith('/checkout')}
            <CartSidebar onClose={navModule.closeCartSidebar} />
					{/if}
					<!-- {/if} -->

					<div class="flex h-full items-center font-['Inter',_sans-serif]">
						{#if userState?.user?.role}
							<DropdownMenu.Root>
								<DropdownMenu.Trigger
									aria-label="User Profile"
									class="flex items-center justify-center rounded-full px-2 transition-all duration-300 ease-out"
								>
									{#if userState.user?.avatar}
										<div class="h-5 w-5 overflow-hidden rounded-full">
											<LazyImg
												width="20"
												height="20"
												src={userState.user?.avatar}
												alt="{userState.user?.firstName || userState.user?.name || 'User'}'s avatar"
												class="h-full w-full object-cover object-top"
											/>
										</div>
									{:else}
										<UserCircle class="h-5 w-5" />
									{/if}
								</DropdownMenu.Trigger>

								<DropdownMenu.Content class="min-w-[240px] rounded-2xl border-gray-100 bg-white p-2 shadow-2xl">
									<!-- User Header -->
									<div class="mb-2 flex items-center gap-3 border-b border-gray-50 px-4 py-4">
										<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary">
											{#if userState.user?.avatar}
												<img src={userState.user.avatar} alt="" class="h-full w-full rounded-full object-cover" />
											{:else}
												<UserCircle class="h-6 w-6" />
											{/if}
										</div>
										<div class="overflow-hidden">
											<p class="truncate text-sm font-black text-gray-900">
												{userState.user?.firstName || userState.user?.name || 'My Account'}
											</p>
											<p class="truncate text-[10px] font-bold uppercase tracking-widest text-gray-400">
												{userState.user?.email || 'Logged In'}
											</p>
										</div>
									</div>

									<DropdownMenu.Group>
										<a href="/my/profile" class="block w-full">
											<DropdownMenu.Item
												class="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-primary"
											>
												<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 transition-colors group-hover:bg-white">
													<UserCircle class="h-4 w-4" />
												</div>
												Profile Settings
											</DropdownMenu.Item>
										</a>
										<a href="/my/orders" class="block w-full">
											<DropdownMenu.Item
												class="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-primary"
											>
												<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50">
													<ShoppingBag class="h-4 w-4" />
												</div>
												Order History
											</DropdownMenu.Item>
										</a>
										<a href="/my/addresses" class="block w-full">
											<DropdownMenu.Item
												class="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-primary"
											>
												<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50">
													<MapPin class="h-4 w-4" />
												</div>
												My Addresses
											</DropdownMenu.Item>
										</a>
										<a href="/my/wishlist" class="block w-full">
											<DropdownMenu.Item
												class="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-primary"
											>
												<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50">
													<Heart class="h-4 w-4" />
												</div>
												My Wishlist
											</DropdownMenu.Item>
										</a>
									</DropdownMenu.Group>

									<div class="my-2 h-px bg-gray-50"></div>

									<DropdownMenu.Item>
										<button
											type="button"
											class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-500 transition-all hover:bg-red-50"
											onclick={navModule.handleSignOut}
										>
											<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100/30">
												<ArrowRightCircleIcon class="h-4 w-4" />
											</div>
											Sign Out
										</button>
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						{:else}
							<AuthButton aria-label="Login" type="login">
								<div
									class="flex items-center justify-center rounded-full p-2 text-gray-500 transition-all duration-300 ease-out hover:scale-110 hover:bg-gray-100 hover:text-primary active:scale-95"
								>
									<UserCircle class="h-5 w-5" />
								</div>
							</AuthButton>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</header>

<!-- Sidebar -->
{#if navModule.openSidebar}
	<aside class="fixed inset-0 z-[100] flex overflow-hidden bg-transparent">
		<button
			transition:fade={{ duration: 500 }}
			aria-label="Sidebar"
			type="button"
			class="absolute inset-0 bg-black bg-opacity-50 focus:outline-none"
			onclick={() => {
				navModule.openSidebar = false
			}}
		>
		</button>
		<div transition:fade={{ duration: 500 }} class="relative z-[60] h-full w-full overflow-y-auto overflow-x-hidden bg-primary p-6 pt-16 text-white">
			<button
				type="button"
				aria-label="Close sidebar"
				class="absolute right-4 top-4 transform cursor-pointer rounded-full bg-zinc-800 bg-opacity-50 p-2 text-white transition duration-300 hover:scale-125 hover:text-zinc-200 focus:outline-none"
				onclick={() => (navModule.openSidebar = false)}
			>
				<X class="h-5 w-5" />
			</button>

			<ul class="m-0 flex w-full list-none flex-col gap-4 p-0 text-sm">
				{#if navModule.megaMenuPluginActive && navModule.megaMenu?.length}
					<li class="mt-2">
						<ul class="m-0 flex w-full list-none flex-col gap-3 p-0 text-sm">
							{#each navModule.megaMenu as m, mx}
								<li>
									{#if m?.children?.length}
										<div
											class="'text-zinc-200 hover:text-white' flex w-full items-center justify-between
                     gap-2 py-1"
										>
											<a
												href={m.link ? m.link : m.slug ? '/' + m.slug : '/products'}
												aria-label="Click to visit category related products"
												class="flex-1 text-base font-medium"
												onclick={() => (navModule.openSidebar = false)}
											>
												{m.name}
											</a>

											<button
												type="button"
												aria-label="Toggle subcategory"
												class="overflow-hidden p-2 focus:outline-none"
												onclick={() => navModule.handleToggleSubCategory(m, mx)}
											>
												<ChevronDown
													class="h-5 w-5 shrink-0 transition duration-300
                                {navModule.showSubCategory[mx] ? '-rotate-180 transform' : ''}"
												/>
											</button>
										</div>
									{:else}
										<a
											href={m.link ? m.link : m.slug ? '/' + m.slug : '/products'}
											aria-label="Click to visit category related products"
											class="flex w-full items-center justify-between gap-2 py-1 text-left text-base font-medium text-zinc-200 hover:text-white focus:outline-none"
											onclick={() => (navModule.openSidebar = false)}
										>
											{m.name}
										</a>
									{/if}

									{#if navModule.showSubCategory[mx]}
										<ul class="ml-4 mt-2 list-none p-0">
											{#each m.children as c, cx}
												<li class="mb-2">
													{#if c.children?.length}
														<div
															class="flex w-full items-center justify-between gap-2 py-1
                          {navModule.selectedCategory2 === c.name ? 'text-white' : 'text-zinc-200 hover:text-white'}"
														>
															<a
																href={c.link ? c.link : c.slug ? '/' + c.slug : '/products'}
																class="flex-1"
																onclick={() => (navModule.openSidebar = false)}
															>
																{c.name}
															</a>

															<button
																type="button"
																aria-label="Toggle subcategory"
																class="overflow-hidden p-2 focus:outline-none"
																onclick={() => navModule.handleToggleSubCategory2(c, cx)}
															>
																<ChevronDown
																	class="h-5 w-5 shrink-0 transition duration-300
                                {navModule.showSubCategory2[cx] ? '-rotate-180 transform' : ''}"
																/>
															</button>
														</div>
													{:else}
														<a
															href={c.link ? c.link : c.slug ? '/' + c.slug : '/products'}
															aria-label="Click to visit category related products page"
															class="flex w-full items-center justify-between gap-2 py-1 text-left text-zinc-200 hover:text-white focus:outline-none"
															onclick={() => (navModule.openSidebar = false)}
														>
															{c.name}
														</a>
													{/if}

													{#if navModule.showSubCategory2[cx]}
														<ul class="ml-4 mt-1 list-none p-0">
															{#each c.children as cc}
																<li>
																	<a
																		href={cc.link ? cc.link : cc.slug ? '/' + cc.slug : '/products'}
																		aria-label="Click to visit category related products page"
																		class="flex w-full items-center justify-between gap-2 py-1 text-left text-zinc-200 hover:text-white focus:outline-none"
																		onclick={() => (navModule.openSidebar = false)}
																	>
																		{cc.name}
																	</a>
																</li>
															{/each}
														</ul>
													{/if}
												</li>
											{/each}
										</ul>
									{/if}
								</li>
							{/each}
						</ul>
					</li>
				{/if}

				{#if navModule.navMenu?.length}
					<li class="mt-4 border-t border-zinc-700 pt-4">
						<ul class="m-0 flex w-full list-none flex-col gap-3 p-0 text-sm">
							{#each navModule.navMenu as menuItem}
								<li>
									<a
										href={menuItem?.link}
										class="transiton block py-1 text-base text-zinc-200 duration-300 hover:text-white focus:outline-none"
										onclick={() => (navModule.openSidebar = false)}
									>
										{menuItem.name}
									</a>
								</li>
							{/each}
						</ul>
					</li>
				{/if}

				{#if page?.data?.store?.businessEmail || page?.data?.store?.businessPhone}
					<li class="mt-4 border-zinc-700 pt-4 {navModule.navMenu?.length ? 'border-t' : ''}">
						<!-- Email/Phone -->
						<div class="flex flex-col gap-2">
							{#if page?.data?.store?.businessEmail}
								<a
									href="mailto:{page?.data?.store?.businessEmail}"
									aria-label="Email us"
									class="transiton flex items-center gap-2 text-zinc-200 duration-300 hover:text-white focus:outline-none"
								>
									<Mail class="size-4" />
									{page?.data?.store?.businessEmail}
								</a>
							{/if}

							{#if page?.data?.store?.businessPhone}
								<a
									href="tel:+{page?.data?.store?.businessPhone}}"
									aria-label="Call us"
									class="transiton flex items-center gap-2 text-zinc-200 duration-300 hover:text-white focus:outline-none"
								>
									<Phone class="size-4" />
									{page?.data?.store?.businessPhone}
								</a>
							{/if}
						</div>
					</li>
				{/if}

				{#if menuItemsUser?.length}
					<li class="mt-4 border-t border-zinc-700 pt-4">
						<ul class="m-0 flex w-full list-none flex-col gap-3 p-0 text-sm">
							{#each menuItemsUser as m}
								<li>
									<a
										href={m.url}
										class="transiton block py-1 text-base text-zinc-200 duration-300 hover:text-white focus:outline-none"
										onclick={() => (navModule.openSidebar = false)}
									>
										{m.title}
									</a>
								</li>
							{/each}
						</ul>
					</li>
				{/if}
			</ul>
		</div>
	</aside>
{/if}

<AuthModal bind:show={navModule.showAuthModal} />

<style>
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
