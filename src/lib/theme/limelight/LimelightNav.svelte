<script lang="ts">
	import { Heart, MapPin, Menu, UserRound } from '@lucide/svelte'
	import MsSearch from '$lib/components/nav/ms-search.svelte'
	import CartSidebar from '$lib/components/nav/cart-sidebar.svelte'
	import ProfileDropdown from '$lib/components/nav/profile-dropdown.svelte'
	import { AuthButton } from '$lib/core/components/index.js'

	let {
		navModule,
		wishlistPlugin,
		wishlistState,
		userState,
		storeData,
		pathname = ''
	}: {
		navModule: any
		wishlistPlugin?: any
		wishlistState?: any
		userState?: any
		storeData?: any
		pathname?: string
	} = $props()

	const limelightNavItems = ['Rings', 'Earrings', 'Pendants', 'Bracelets', 'Solitaire', 'Necklaces', 'New', 'Everyday Shine', 'Navarambh', 'More Jewellery']
</script>

<section class="limelight-topbar">
	<a class="limelight-find-store" href="/store-locator">
		<MapPin class="h-4 w-4" />
		<span>Find a Store</span>
	</a>
</section>

<header class="limelight-header shadow-xs">
	<button
		class="limelight-mobile-trigger"
		onclick={() => {
			navModule.openSidebar = true
		}}
		aria-label="Toggle menu"
	>
		<Menu class="h-5 w-5" />
	</button>

	<a class="limelight-logo" href="/">
		<img src="/limelight/logo.png" alt={storeData?.name || 'Limelight Diamonds'} />
	</a>

	<nav class="limelight-nav" aria-label="Main navigation">
		{#each limelightNavItems as item}
			<a href="/search?q={encodeURIComponent(item)}">{item}</a>
		{/each}
	</nav>

	<div class="limelight-actions">
		<MsSearch />

		{#if wishlistPlugin?.active}
			<div class="relative flex items-center justify-center" role="navigation">
				<a href="/my/wishlist" class="flex items-center justify-center text-gray-700 hover:text-black" aria-label="Wishlist">
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

		<div class="limelight-account flex items-center">
			{#if userState?.user?.role}
				<ProfileDropdown onSignOut={navModule.handleSignOut} />
			{:else}
				<AuthButton aria-label="Login" type="login">
					<div class="flex items-center justify-center text-gray-700 hover:text-black">
						<UserRound class="h-5 w-5" />
					</div>
				</AuthButton>
			{/if}
		</div>

		{#if !pathname.startsWith('/checkout')}
			<CartSidebar
				onClose={navModule.closeCartSidebar}
				onContinueShopping={navModule.handleContinueShoppingClick}
				onRemoveCartItem={navModule.removeCartItem}
			/>
		{/if}
	</div>
</header>

<style>
	.limelight-topbar {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 45px;
		padding: 6px 40px;
		background: #f5f5f5;
		font-size: 14px;
		line-height: 1;
		font-family: var(--font-body);
	}

	.limelight-header a {
		color: inherit;
	}

	.limelight-find-store {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 7px 16px;
		border-radius: 999px;
		background: var(--limelight-plum, #460032);
		color: #fff;
		font-size: 14px;
		line-height: 1;
		white-space: nowrap;
	}

	.limelight-find-store:hover {
		background: var(--limelight-wine, #6f1648);
	}

	.limelight-find-store :global(svg) {
		width: 15px;
		height: 15px;
		stroke-width: 1.75;
	}

	.limelight-header {
		position: sticky;
		top: 0;
		z-index: 20;
		display: grid;
		grid-template-columns: 200px minmax(0, 1fr) 156px;
		align-items: center;
		height: 82px;
		padding: 12px 40px;
		background: #fff;
		color: var(--limelight-plum, #460032);
		font-family: var(--font-body);
	}

	.limelight-logo img {
		width: 200px;
		height: auto;
		display: block;
	}

	.limelight-nav {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20px;
		padding-left: 10px;
		font-size: 12px;
		font-weight: 400;
		line-height: 28.8px;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.limelight-actions {
		display: flex;
		justify-content: flex-end;
		gap: 17px;
		align-items: center;
	}

	.limelight-actions :global(svg),
	.limelight-mobile-trigger :global(svg) {
		width: 18px;
		height: 18px;
		stroke-width: 1.5;
	}

	.limelight-mobile-trigger {
		display: none;
	}

	@media (max-width: 1200px) {
		.limelight-header {
			grid-template-columns: 170px minmax(0, 1fr) 132px;
			padding: 12px 24px;
		}

		.limelight-logo img {
			width: 170px;
		}

		.limelight-nav {
			gap: 12px;
			font-size: 11px;
		}
	}

	@media (max-width: 900px) {
		.limelight-topbar {
			height: auto;
			padding: 6px 14px;
			font-size: 12px;
		}

		.limelight-find-store {
			padding: 6px 12px;
			font-size: 12px;
		}

		.limelight-find-store :global(svg) {
			width: 13px;
			height: 13px;
		}

		.limelight-account {
			display: none;
		}

		.limelight-header {
			grid-template-columns: 1fr auto 1fr;
			height: 52px;
			padding: 8px 14px;
		}

		.limelight-mobile-trigger {
			display: flex;
			justify-self: start;
			background: transparent;
			border: none;
			padding: 0;
			cursor: pointer;
		}

		.limelight-logo {
			justify-self: center;
		}

		.limelight-logo img {
			width: 126px;
		}

		.limelight-nav {
			display: none;
		}

		.limelight-actions {
			justify-self: end;
			gap: 12px;
		}
	}
</style>
