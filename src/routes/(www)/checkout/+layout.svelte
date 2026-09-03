<script lang="ts">
	import { page } from '$app/state'
	import Logo from '$lib/components/common/logo.svelte'
	import { LockKeyhole } from '@lucide/svelte'
	import { keepResolvableLinks } from '$lib/components/common/cms-pages.js'

	let { children } = $props()

	// The reduced chrome checkout gets instead of the storefront's nav and footer: the brand mark
	// home, a reassurance, and a single row of legal links and payment marks. Nothing that invites
	// the shopper back out of the flow mid-purchase.
	const storeName = $derived(page.data?.store?.name ?? '')
	const legalLinks = $derived(
		keepResolvableLinks(
			[
				{ name: 'Terms', link: '/terms-and-conditions' },
				{ name: 'Privacy', link: '/privacy-policy' },
				{ name: 'Refunds', link: '/refund-policy' },
				{ name: 'Contact', link: '/contact-us' }
			],
			page.data?.cmsPages ?? []
		)
	)
</script>

<!-- Checkout URLs are per-session and must never be indexed. robots.txt only stops crawling,
     not indexing, so state it on the page for the whole checkout tree. -->
<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<header class="border-b border-border bg-background">
		<div class="page-width flex h-14 items-center justify-between gap-4">
			<a href="/" class="inline-flex min-h-[44px] items-center" aria-label="{storeName} home">
				<Logo />
			</a>
			<p class="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
				<LockKeyhole class="h-3.5 w-3.5" aria-hidden="true" />
				Secure checkout
			</p>
		</div>
	</header>

	<main id="main" class="flex-1">
		{@render children?.()}
	</main>

	<footer class="border-t border-border bg-background">
		<div class="page-width flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
			<p class="text-xs text-muted-foreground">© {new Date().getFullYear()} {storeName}</p>
			{#if legalLinks.length}
				<nav aria-label="Checkout legal links" class="flex flex-wrap items-center gap-x-4">
					{#each legalLinks as item}
						<a href={item.link} class="inline-flex min-h-[32px] items-center text-xs text-muted-foreground transition-colors hover:text-foreground">
							{item.name}
						</a>
					{/each}
				</nav>
			{/if}
		</div>
	</footer>
</div>
