<script lang="ts">
	import { Heart, Menu, UserRound } from '@lucide/svelte'
	import MsSearch from '$lib/components/nav/ms-search.svelte'
	import CartSidebar from '$lib/components/nav/cart-sidebar.svelte'
	import ProfileDropdown from '$lib/components/nav/profile-dropdown.svelte'
	import AuthButton from '$lib/components/auth/auth-button.svelte'

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

	// Header chrome is store-editable theme content.
	const navLinks = $derived(themeContent?.nav?.links ?? [])
	const announcement = $derived(themeContent?.nav?.announcement ?? '')
	const brandName = $derived(storeData?.name || themeContent?.brandName || 'Store')
</script>

{#if announcement}
	<section class="noor-announcement">{announcement}</section>
{/if}

<header class="noor-header shadow-xs">
	<div class="noor-header-main">
		<button
			class="noor-mobile-trigger"
			onclick={() => {
				navModule.openSidebar = true
			}}
			aria-label="Toggle menu"
		>
			<Menu class="h-5 w-5" />
		</button>

		<a href="/" class="noor-logo" aria-label="{brandName} home">
			{#if storeData?.logo}
				<img src={storeData.logo} alt={brandName} />
			{:else}
				<span class="noor-wordmark">{brandName}</span>
			{/if}
		</a>

		<div class="noor-actions">
			<MsSearch />

			{#if wishlistPlugin?.active}
				<div class="relative hidden items-center justify-center sm:flex" role="navigation">
					<a href="/my/wishlist" class="flex items-center justify-center text-[#151515] hover:text-black" aria-label="Wishlist">
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

			<div class="noor-account flex items-center">
				{#if userState?.user?.role}
					<ProfileDropdown onSignOut={navModule.handleSignOut} />
				{:else}
					<AuthButton aria-label="Login" type="login">
						<div class="flex items-center justify-center text-[#151515] hover:text-black">
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
	</div>

	<nav class="noor-nav" aria-label="{brandName} categories">
		{#each navLinks as item}
			<a href={item.href}>{item.label}</a>
		{/each}
	</nav>
</header>

<style>
	.noor-announcement {
		position: relative;
		z-index: 50;
		background: #111;
		color: #fff;
		padding: 8px 16px;
		text-align: center;
		font-family: var(--font-body);
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.1em;
		line-height: 1.4;
		text-transform: uppercase;
	}

	.noor-header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: #fff;
		border-bottom: 1px solid #ded8cf;
		color: #151515;
		font-family: var(--font-body);
	}

	.noor-header-main {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		min-height: 86px;
		padding: 0 44px;
	}

	.noor-logo {
		justify-self: center;
	}

	.noor-logo img {
		display: block;
		width: 120px;
		height: auto;
	}

	/* Shown when the store has not uploaded a logo. */
	.noor-wordmark {
		display: block;
		max-width: 200px;
		color: var(--ink, #151515);
		font-family: var(--font-heading);
		font-size: 22px;
		line-height: 1.1;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.noor-mobile-trigger {
		display: none;
		justify-self: start;
		align-items: center;
		color: #151515;
		background: transparent;
		border: 0;
		padding: 0;
		cursor: pointer;
	}

	.noor-actions {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 24px;
	}

	.noor-actions :global(svg),
	.noor-mobile-trigger :global(svg) {
		width: 20px;
		height: 20px;
		stroke-width: 1.75;
	}

	.noor-nav {
		display: flex;
		justify-content: center;
		gap: 42px;
		border-top: 1px solid #ded8cf;
		padding: 14px 24px;
	}

	.noor-nav a {
		color: #151515;
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-decoration: none;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.noor-nav a:hover {
		color: #6d6760;
	}

	@media (max-width: 900px) {
		.noor-announcement {
			font-size: 10px;
		}

		.noor-header-main {
			min-height: 68px;
			padding: 0 16px;
		}

		.noor-mobile-trigger {
			display: inline-flex;
		}

		.noor-logo img {
			width: 98px;
		}

		.noor-wordmark {
			max-width: 150px;
			font-size: 17px;
		}

		.noor-actions {
			gap: 14px;
		}

		.noor-account {
			display: none;
		}

		.noor-nav {
			justify-content: flex-start;
			gap: 22px;
			overflow-x: auto;
			padding: 12px 16px;
			scrollbar-width: none;
		}

		.noor-nav::-webkit-scrollbar {
			display: none;
		}

		.noor-nav a {
			flex: 0 0 auto;
			font-size: 11px;
		}
	}
</style>
