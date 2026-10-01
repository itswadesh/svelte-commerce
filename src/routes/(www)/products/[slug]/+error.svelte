<script lang="ts">
	import { page } from '$app/state'
	import Button from '$lib/components/ui/button/button.svelte'
	import { Input } from '$lib/components/ui/input/index.js'
	import Spinner from '$lib/components/common/spinner.svelte'
	import { ShoppingBag, Home, ArrowLeft, Search, RotateCw, WifiOff } from '@lucide/svelte'
	import { goto, invalidateAll } from '$app/navigation'

	// Two different failures share this page. A 404 means the product is gone; anything else (the
	// load answers 503 for a dropped connection or an API error, see +page.ts) means it could not be
	// fetched right now, and saying "not found" would send the shopper away from something they
	// could still buy. That case offers a retry instead.
	const notFound = $derived(page.status === 404)

	// The same GET form the root error boundary uses, onto the one route that renders a term.
	// A shopper who lands on a missing product has one in mind; the recovery path should let them
	// look for it rather than only offering the whole catalogue.
	let searchQuery = $state('')

	let retrying = $state(false)
	async function retry() {
		retrying = true
		try {
			await invalidateAll()
		} finally {
			retrying = false
		}
	}

	function goBack() {
		if (typeof history !== 'undefined' && history.length > 1) history.back()
		else goto('/products')
	}
</script>

<svelte:head>
	<title>{notFound ? 'Product not found' : "Couldn't load this product"}</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16">
	<div class="w-full max-w-2xl text-center">
		<div class="mb-6 flex justify-center">
			{#if notFound}
				<ShoppingBag class="h-16 w-16 text-muted-foreground" aria-hidden="true" />
			{:else}
				<WifiOff class="h-16 w-16 text-muted-foreground" aria-hidden="true" />
			{/if}
		</div>

		{#if notFound}
			<h1 class="mb-2 text-5xl font-semibold tracking-tight text-foreground">404</h1>
			<h2 class="mb-4 text-xl font-medium text-foreground">Product not found</h2>
			<p class="mb-8 text-sm text-muted-foreground">The product you're looking for doesn't exist.</p>

			<form action="/products" method="GET" role="search" class="mx-auto mb-8 flex max-w-md items-center gap-2">
				<div class="relative flex-1">
					<Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
					<Input
						type="search"
						name="search"
						bind:value={searchQuery}
						enterkeyhint="search"
						aria-label="Search for products"
						placeholder="Search for products"
						class="h-11 pl-9"
					/>
				</div>
				<Button type="submit" class="h-11 shrink-0">Search</Button>
			</form>

			<div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
				<Button variant="outline" class="h-11 gap-2" onclick={goBack}>
					<ArrowLeft class="h-4 w-4" />
					Go back
				</Button>
				<Button href="/products" class="h-11 gap-2">
					<Home class="h-4 w-4" />
					All products
				</Button>
			</div>
		{:else}
			<h1 class="mb-4 text-2xl font-semibold tracking-tight text-foreground">Couldn't load this product</h1>
			<p class="mb-8 text-sm text-muted-foreground" role="status">
				The product is still there; we couldn't reach the store just now. Check your connection and try again.
			</p>

			<div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
				<Button variant="outline" class="h-11 gap-2" onclick={goBack}>
					<ArrowLeft class="h-4 w-4" />
					Go back
				</Button>
				<Button class="h-11 gap-2" onclick={retry} disabled={retrying} aria-busy={retrying}>
					{#if retrying}
						<Spinner label="Trying again" />
						Trying again…
					{:else}
						<RotateCw class="h-4 w-4" aria-hidden="true" />
						Try again
					{/if}
				</Button>
			</div>
		{/if}
	</div>
</div>
