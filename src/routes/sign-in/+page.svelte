<script lang="ts">
	import { page } from '$app/state'
	import Button from '$lib/components/ui/button/button.svelte'
	import AuthModal from '$lib/components/auth/auth-modal.svelte'
	import { goto } from '$app/navigation'
	import { setCartState, setWishlistState } from '$lib/core/stores/index.js'
	import { keepResolvableLinks } from '$lib/components/common/cms-pages.js'
	import type { PageProps } from './$types'

	let { data }: PageProps = $props()

	// The sign-in dialog writes the address onto the basket and refreshes the wishlist, through the
	// states the (www) layout provides; this screen sits outside it, so it provides its own.
	setCartState()
	setWishlistState()

	const store = $derived(page.data?.store as { name?: string; logo?: string } | undefined)
	const name = $derived(store?.name ?? '')

	// The sign-in dialog lives in the storefront's nav, which this screen leaves out, so it mounts
	// its own, as checkout does. `redirect` is what the dialog follows once the shopper is in.
	// Opened through the address, as the bag's sign-in link does: showAuthModal encodes `redirect` a
	// second time, and the password sign-in then reads it as no address and stays here.
	let showAuth = $state(false)

	// The dialog sends a signed-in shopper on to `redirect`, then steps back through the history
	// entry it pushed on opening, which lands here again. So once it closes with a session, go on.
	let opened = false
	$effect(() => {
		if (showAuth) opened = true
		else if (opened && /(?:^|;\s*)connect\.sid=/.test(document.cookie)) {
			opened = false
			const next = data.next
			setTimeout(() => {
				if (location.pathname === '/sign-in') goto(next, { replaceState: true, invalidateAll: true })
			}, 300)
		}
	})
	const open = (type: 'login' | 'signup') =>
		goto(`/sign-in?${new URLSearchParams({ show_auth: 'true', [type]: 'true', redirect: data.next })}`, {
			replaceState: true,
			noScroll: true,
			keepFocus: true
		})

	// The pages that stay open, so a visitor can read the terms before making an account.
	const links = $derived(
		keepResolvableLinks(
			[
				{ name: 'Terms', link: '/terms-and-conditions' },
				{ name: 'Privacy', link: '/privacy-policy' },
				{ name: 'Refunds', link: '/refund-policy' },
				{ name: 'Shipping', link: '/shipping-policy' },
				{ name: 'Contact', link: '/contact-us' }
			],
			page.data?.cmsPages ?? []
		)
	)
</script>

<svelte:head>
	<title>{name ? `Sign in to ${name}` : 'Sign in'}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-10">
	<div class="welcome grid w-full max-w-sm gap-6 text-center">
		<h1 class="page-heading">
			{#if store?.logo}
				<img src={store.logo} alt={name} width="192" height="48" fetchpriority="high" class="mx-auto block h-12 w-48 object-contain" />
			{:else}
				{name}
			{/if}
		</h1>
		<div class="grid gap-2">
			<p class="text-lg font-semibold">Welcome{name ? ` to ${name}` : ''}</p>
			<p class="text-sm text-muted-foreground">Sign in or create an account to see our products and shop.</p>
		</div>
		<div class="grid gap-3">
			<Button class="h-11 w-full" onclick={() => open('login')}>Sign in</Button>
			<Button variant="outline" class="h-11 w-full" onclick={() => open('signup')}>Create account</Button>
		</div>
	</div>
	{#if links.length}
		<nav aria-label="Store policies" class="mt-10 flex flex-wrap items-center justify-center gap-x-4">
			{#each links as item}
				<a
					href={item.link}
					class="inline-flex min-h-11 min-w-11 items-center justify-center text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					{item.name}
				</a>
			{/each}
		</nav>
	{/if}
</main>

<AuthModal bind:show={showAuth} />

<style>
	@media (prefers-reduced-motion: no-preference) {
		.welcome {
			animation: welcome-in 240ms ease-out both;
		}
	}

	@keyframes welcome-in {
		from {
			opacity: 0;
			transform: translateY(0.25rem);
		}
	}
</style>
