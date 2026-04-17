<script lang="ts">
import CartItem from '$lib/components/cart/cart-item.svelte'
import { X, UserCircle, ChevronLeftIcon, Phone, Mail, Menu, ChevronDown } from 'lucide-svelte'
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
import { NavModule } from '$lib/core/composables/use-nav.svelte'

const menuItemsUser = [
	{ title: 'Profile', url: '/my/profile' },
	{ title: 'Orders', url: '/my/orders' },
	// { title: 'Buy Again', url: '/my/buy-again' },
	{ title: 'Addresses', url: '/my/addresses' },
	{ title: 'Wishlist', url: '/my/wishlist' },
	{ title: 'Change Password', url: '/auth/change-password' }
]

let { storeData } = $props()

const navModule = new NavModule()
const userState = navModule.userState
const cartState = navModule.cartState
</script>

<svelte:window bind:scrollY={navModule.scrollY} />

<header
	class="{navModule.isProductListingPage
		? 'max-sm:border-b'
		: ''} shadow-xs sticky top-0 z-50 w-full flex-col items-center justify-between {navModule.navBackground} transition-all duration-200"
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
	<div class="mx mx-2 flex items-center justify-between py-3 lg:container sm:py-2 lg:mx-auto">
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
						<ChevronLeftIcon class="h-6 w-6 font-bold" />
						<span class="sr-only">Go back</span>
					</button>

					<div class="flex flex-col items-start">
						{#if page.params?.slug || page.url?.searchParams?.get?.('search')}
							<h1 class="text-base font-semibold capitalize">
								{page.params?.slug?.replace?.(/-/g, ' ').replace?.(/\b\w/g, (c) => c?.toUpperCase?.()) || page.url?.searchParams?.get?.('search')}
							</h1>
						{:else}
							<h1 class="text-base font-semibold">Products</h1>
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
				<div class="relative flex items-center gap-4 sm:gap-5">
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

					<MsSearch class="-top-1 mr-10" />

					{#if !page.url.pathname.startsWith('/checkout')}
						<div class="relative" role="navigation">
							<a class="flex items-center rounded-full lg:hidden" href="/checkout/cart" aria-label="View Cart">
								<svg
									width="24"
									height="24"
									class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11M20 7L18 3H6L4 7M20 7H4M20 7V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V7"
										stroke="black"
										style="stroke:black;stroke:black;stroke-opacity:1;"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									></path>
								</svg>
								{#if cartState?.cart?.total && cartState.cart?.lineItems?.length > 0}
									<span
										class="absolute right-0 top-0 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-primary px-1.5 py-1 text-xs font-bold leading-none text-white"
									>
										{cartState.cart.qty}
									</span>
								{/if}
							</a>
							<button
								class="hidden items-center rounded-full lg:flex"
								aria-label="Toggle Cart"
								onclick={() => {
									cartState.isOpen = !cartState.isOpen
								}}
							>
								<svg
									width="24"
									height="24"
									class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11M20 7L18 3H6L4 7M20 7H4M20 7V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V7"
										stroke="black"
										style="stroke:black;stroke:black;stroke-opacity:1;"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									></path>
								</svg>
								{#if cartState?.cart?.total && cartState.cart?.lineItems?.length > 0}
									<span
										class="absolute right-0 top-0 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-primary px-1.5 py-1 text-xs font-bold leading-none text-white"
									>
										{cartState.cart.qty}
									</span>
								{/if}
							</button>
							{#if cartState.isOpen}
								<!-- close cart backdrop -->
								<button
									class="fixed inset-0 z-50 h-svh w-full overflow-hidden bg-black bg-opacity-30 scrollbar-none"
									aria-label="Close cart"
									onclick={navModule.closeCartSidebar}
								>
									<style>
										body {
											overflow: hidden;
										}
									</style>
									<span class="sr-only">Close cart</span>
								</button>

								<div
									class="shadow-3xl fixed right-0 top-0 z-[10000000] h-screen w-full overflow-y-auto bg-white sm:w-[37.5%]"
									transition:navModule.slideFadeTopRight={{ duration: 500 }}
								>
									<div class="relative z-50 flex h-full flex-col justify-between bg-white p-4">
										<div class="sm:mx-3">
											<h2 class="mb-4 mt-4 text-xl font-bold">My Shopping Cart</h2>
											<button class="absolute right-4 top-4 rounded-full p-1" aria-label="close cart" onclick={navModule.closeCartSidebar}>
												<X class="size-4" />
											</button>

											{#each cartState.cart?.lineItems || [] as _, i}
												<CartItem bind:cartProduct={cartState.cart.lineItems[i]} removeItem={navModule.removeCartItem} />
											{/each}
										</div>

										<div class="sticky bottom-0 {cartState.cart?.lineItems?.length > 0 ? '-mx-4 bg-gray-50' : ''} py-6 sm:px-4">
											<div class="space-y-1">
												{#if cartState.cart?.lineItems?.length > 0}
													<div class="mx-4 flex items-center justify-between">
														<p class="text-base font-bold text-zinc-500 sm:text-[20px]">Total</p>
														<p class="text-base font-semibold sm:text-lg">
															{formatPrice(cartState?.cart?.total, storeData?.currencyCode)}
														</p>
													</div>
													<p class="mx-4 text-right text-xs text-gray-500 sm:text-sm">MRP includes of all taxes</p>
												{:else}
													<div class="flex min-h-[80vh] flex-col items-center justify-center gap-3 bg-white">
														<img src="/empty-cart.svg" alt="Empty cart" class="h-40 w-40" />
														<span class="text-2xl font-medium">Empty Cart!!</span>
														<span class="px-2 text-center text-xs"
															>We didn't find any item inside cart, Go ahead, order some essentials from the menu</span
														>
														<button
															disabled={!!cartState.isUpdatingCart}
															onclick={navModule.handleContinueShoppingClick}
															class="mt-6 w-[90%] border border-black border-opacity-20 bg-white py-3 font-semibold text-black hover:border-opacity-100"
														>
															Continue Shopping
														</button>
													</div>
												{/if}
											</div>
											{#if cartState?.cart?.total >= 0 && cartState.cart?.lineItems?.length > 0}
												<div class="mx-4 mt-6 flex justify-between">
													<Button
														variant="secondary"
														disabled={!!cartState.isUpdatingCart}
														onclick={navModule.handleContinueShoppingClick}
														class="w-[48%]"
													>
														Continue Shopping
													</Button>
													<Button
														disabled={!!cartState.isUpdatingCart}
														onclick={(e) => {
															e.stopPropagation()
															if(cartState){
																cartState.isOpen = false
															}
															goto('/checkout/cart')
														}}
														class="w-[48%]"
													>
														Proceed
													</Button>
												</div>
											{/if}
										</div>
									</div>
								</div>
							{/if}
						</div>
					{/if}
					<!-- {/if} -->
					<div class="flex h-full items-center">
						{#if userState?.user?.role}
							<DropdownMenu.Root>
								<DropdownMenu.Trigger aria-label="User Profile">
									<div class="flex items-center justify-center">
										<!-- <Button variant="link" href="/" class="hidden lg:block">
										Hi {userState.user?.name || ''}
									</Button> -->
										{#if userState.user?.avatar}
											<LazyImg
												width="40"
												height="40"
												src={userState.user?.avatar}
												alt=""
												class="h-8 w-8 rounded-full border object-cover object-top"
											/>
										{:else}
											<div class="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
												<UserCircle class="h-6 w-6 text-muted-foreground" />
											</div>
										{/if}
									</div>
								</DropdownMenu.Trigger>

								<DropdownMenu.Content>
									<DropdownMenu.Group>
										{#each menuItemsUser as item}
											<a href={item.url} aria-label={item.title} class="block w-full cursor-default">
												<DropdownMenu.Item>{item.title}</DropdownMenu.Item>
											</a>
										{/each}
										<DropdownMenu.Item>
											<button type="button" class="w-full cursor-default text-left focus:outline-none" onclick={navModule.handleSignOut}>
												Sign out
											</button>
										</DropdownMenu.Item>
									</DropdownMenu.Group>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						{:else}
							<AuthButton aria-label="Login" type="login">
								<UserCircle class="size-5" />
								<!-- <Button variant="link" class="-mr-2 hidden lg:block px-0">
                Login
              </Button> -->
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
																<a
																	href={cc.link ? cc.link : cc.slug ? '/' + cc.slug : '/products'}
																	aria-label="Click to visit category related products page"
																	class="flex w-full items-center justify-between gap-2 py-1 text-left text-zinc-200 hover:text-white focus:outline-none"
																	onclick={() => (navModule.openSidebar = false)}
																>
																	{cc.name}
																</a>
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
