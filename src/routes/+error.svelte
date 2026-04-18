<script lang="ts">
	import { page } from '$app/state'
	import Button from '$lib/components/ui/button/button.svelte'
	import { ShoppingBag, Home, ArrowLeft, Search, Package, Tag } from '@lucide/svelte'
	import { goto } from '$app/navigation'
	import SeoHeader from '$lib/core/components/plugins/seo-header.svelte'

	let searchQuery = $state('')

	function handleSearch() {
		if (searchQuery.trim()) {
			goto(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
		}
	}
</script>

<SeoHeader metaTitle={`Error ${page.status}`} noindex={true} />

<div class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
	<div class="text-center max-w-2xl">
		<div class="mb-4 flex justify-center">
			<ShoppingBag class="h-24 w-24 animate-bounce text-primary" />
		</div>
		<h1 class="mb-2 text-6xl font-bold text-primary">{page.status}</h1>
		<h2 class="mb-8 text-2xl font-semibold text-gray-600">{page.error?.message || 'Something went wrong'}</h2>
		<p class="mb-8 text-gray-500">
			{#if page.status === 404}
				The page you're looking for doesn't exist.
			{:else}
				We encountered an unexpected error. Our team has been notified.
			{/if}
		</p>

		<!-- Search Bar -->
		<div class="mb-8">
			<form onsubmit={(e) => { e.preventDefault(); handleSearch(); }} class="mx-auto max-w-md">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search for products..."
						class="w-full rounded-lg border border-gray-300 px-10 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
					/>
					<Button
						type="submit"
						class="absolute right-2 top-1/2 -translate-y-1/2"
						onclick={() => handleSearch()}
					>
						Search
					</Button>
				</div>
			</form>
		</div>

		<!-- Navigation Links -->
		<div class="mb-8 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
			<a href="/" class="hover:text-primary transition-colors">Home</a>
			<span>•</span>
			<a href="/categories" class="hover:text-primary transition-colors">Categories</a>
			<span>•</span>
			<a href="/products" class="hover:text-primary transition-colors">All Products</a>
			<span>•</span>
			<a href="/contact-us" class="hover:text-primary transition-colors">Contact Us</a>
		</div>

		<div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
			<Button
				variant="outline"
				class="gap-2"
				onclick={() => {
					goto('/')
				}}
			>
				<ArrowLeft class="h-4 w-4" />
				Go Back
			</Button>
			<Button class="gap-2" onclick={() => goto('/')}>
				<Home class="h-4 w-4" />
				Return Home
			</Button>
		</div>
	</div>
</div>
