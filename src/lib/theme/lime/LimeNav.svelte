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
		themeContent,
		pathname = ''
	}: {
		navModule: any
		wishlistPlugin?: any
		wishlistState?: any
		userState?: any
		storeData?: any
		themeContent?: any
		pathname?: string
	} = $props()

	// Header chrome is store-editable theme content; the literals below are only the
	// fallback for a store whose theme content has not been resolved yet.
	const navLinks = $derived(themeContent?.nav?.links ?? [])
	const storeCtaLabel = $derived(themeContent?.nav?.ctaLabel ?? 'Find a Store')
	const storeCtaHref = $derived(themeContent?.nav?.ctaHref ?? '/store-locator')
	const brandName = $derived(storeData?.name || themeContent?.brandName || 'Store')
</script>

<section class="lime-topbar">
	<a class="lime-find-store" href={storeCtaHref}>
		<MapPin class="h-4 w-4" />
		<span>{storeCtaLabel}</span>
	</a>
</section>

<header class="lime-header shadow-xs">
	<button
		class="lime-mobile-trigger"
		onclick={() => {
			navModule.openSidebar = true
		}}
		aria-label="Toggle menu"
	>
		<Menu class="h-5 w-5" />
	</button>

	<a class="lime-logo" href="/">
		{#if storeData?.logo}
			<img src={storeData.logo} alt={brandName} />
		{:else}
			<span class="lime-wordmark">{brandName}</span>
		{/if}
	</a>

	<nav class="lime-nav" aria-label="Main navigation">
		{#each navLinks as item}
			<a href={item.href}>{item.label}</a>
		{/each}
	</nav>

	<div class="lime-actions">
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

		<div class="lime-account flex items-center">
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
	.lime-topbar {
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

	.lime-header a {
		color: inherit;
	}

	.lime-find-store {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 7px 16px;
		border-radius: 999px;
		background: var(--lime-plum, #460032);
		color: #fff;
		font-size: 14px;
		line-height: 1;
		white-space: nowrap;
	}

	.lime-find-store:hover {
		background: var(--lime-wine, #6f1648);
	}

	.lime-find-store :global(svg) {
		width: 15px;
		height: 15px;
		stroke-width: 1.75;
	}

	.lime-header {
		position: sticky;
		top: 0;
		z-index: 20;
		display: grid;
		grid-template-columns: 200px minmax(0, 1fr) 156px;
		align-items: center;
		height: 82px;
		padding: 12px 40px;
		background: #fff;
		color: var(--lime-plum, #460032);
		font-family: var(--font-body);
	}

	.lime-logo img {
		width: 200px;
		height: auto;
		display: block;
	}

	/* Shown when the store has not uploaded a logo. */
	.lime-wordmark {
		display: block;
		max-width: 200px;
		color: var(--lime-plum, #460032);
		font-family: var(--font-heading);
		font-size: 26px;
		line-height: 1.1;
		letter-spacing: 0.02em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.lime-nav {
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

	.lime-actions {
		display: flex;
		justify-content: flex-end;
		gap: 17px;
		align-items: center;
	}

	.lime-actions :global(svg),
	.lime-mobile-trigger :global(svg) {
		width: 18px;
		height: 18px;
		stroke-width: 1.5;
	}

	.lime-mobile-trigger {
		display: none;
	}

	@media (max-width: 1200px) {
		.lime-header {
			grid-template-columns: 170px minmax(0, 1fr) 132px;
			padding: 12px 24px;
		}

		.lime-logo img {
			width: 170px;
		}

		.lime-wordmark {
			max-width: 170px;
			font-size: 22px;
		}

		.lime-nav {
			gap: 12px;
			font-size: 11px;
		}
	}

	@media (max-width: 900px) {
		.lime-topbar {
			height: auto;
			padding: 6px 14px;
			font-size: 12px;
		}

		.lime-find-store {
			padding: 6px 12px;
			font-size: 12px;
		}

		.lime-find-store :global(svg) {
			width: 13px;
			height: 13px;
		}

		.lime-account {
			display: none;
		}

		.lime-header {
			grid-template-columns: 1fr auto 1fr;
			height: 52px;
			padding: 8px 14px;
		}

		.lime-mobile-trigger {
			display: flex;
			justify-self: start;
			background: transparent;
			border: none;
			padding: 0;
			cursor: pointer;
		}

		.lime-logo {
			justify-self: center;
		}

		.lime-logo img {
			width: 126px;
		}

		.lime-wordmark {
			max-width: 126px;
			font-size: 18px;
		}

		.lime-nav {
			display: none;
		}

		.lime-actions {
			justify-self: end;
			gap: 12px;
		}
	}
</style>
