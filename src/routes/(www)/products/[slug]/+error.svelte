<script lang="ts">
	import { page } from '$app/state'
	import Button from '$lib/components/ui/button/button.svelte'
	import { Input } from '$lib/components/ui/input/index.js'
	import { ShoppingBag, Home, ArrowLeft, Search } from '@lucide/svelte'
	import { goto } from '$app/navigation'

	// The same GET form the root error boundary uses, onto the one route that renders a term.
	// A shopper who lands here has a product in mind; the recovery path should let them look for
	// it rather than only offering the whole catalogue.
	let searchQuery = $state('')

	function goBack() {
		if (typeof history !== 'undefined' && history.length > 1) history.back()
		else goto('/products')
	}
</script>

<svelte:head>
	<title>Product not found</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16">
	<div class="w-full max-w-2xl text-center">
		<div class="mb-6 flex justify-center">
			<ShoppingBag class="h-16 w-16 text-muted-foreground" aria-hidden="true" />
		</div>
		<h1 class="mb-2 text-5xl font-semibold tracking-tight text-foreground">{page.status}</h1>
		<h2 class="mb-4 text-xl font-medium text-foreground">{page.error?.message || 'Something went wrong'}</h2>
		<p class="mb-8 text-sm text-muted-foreground">
			{#if page.status === 404}
				The product you're looking for doesn't exist.
			{:else}
				We encountered an unexpected error. Our team has been notified.
			{/if}
		</p>

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
	</div>
</div>
