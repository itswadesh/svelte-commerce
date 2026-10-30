<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'

	// The link in an abandoned-cart reminder: the basket's token in the address.
	// It becomes this browser's cart, and the cart page opens with it. A full
	// load rather than a client-side navigation, so the cart is read afresh.
	const token = page.params.token ?? ''
	const valid = /^[A-Za-z0-9_-]{16,128}$/.test(token)

	onMount(() => {
		if (!valid) return
		try {
			window.localStorage.setItem('cart_id', token)
		} catch {
			// Storage refused (a private window): the cart page shows what it can.
		}
		window.location.replace('/checkout/cart')
	})
</script>

<svelte:head>
	<title>Your cart</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="mx-auto flex min-h-[50vh] w-full max-w-sm flex-col items-center justify-center gap-4 px-4 py-10 text-center">
	{#if valid}
		<p class="text-muted-foreground" role="status">Opening your cart…</p>
		<noscript><a class="underline" href="/checkout/cart">Open your cart</a></noscript>
	{:else}
		<h1 class="text-xl font-semibold text-foreground">This cart link is not valid</h1>
		<p class="text-sm text-muted-foreground">It may have been copied incompletely.</p>
		<Button href="/products">Continue shopping</Button>
	{/if}
</section>
