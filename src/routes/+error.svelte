<script lang="ts">
	import { taxonomy } from '$lib/core/connectors/taxonomy'
	import { page } from '$app/state'
	import Button from '$lib/components/ui/button/button.svelte'
	import { Input } from '$lib/components/ui/input/index.js'
	import { ShoppingBag, Home, ArrowLeft, Search } from '@lucide/svelte'
	import { goto } from '$app/navigation'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'

	// A plain GET form onto the one route that renders a term. It used to submit to
	// `/search?q=…`, and no /search route exists — so the single recovery tool on the error page
	// sent a shopper who mistyped a URL straight to a second 404. As a form with a real action it
	// also works before hydration, and `?search=` is already disallowed in robots.txt.
	let searchQuery = $state('')

	function goBack() {
		if (typeof history !== 'undefined' && history.length > 1) history.back()
		else goto('/')
	}
</script>

<SeoHeader metaTitle={`Error ${page.status}`} noindex={true} />

<div class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16">
	<div class="w-full max-w-2xl text-center">
		<div class="mb-6 flex justify-center">
			<ShoppingBag class="h-16 w-16 text-muted-foreground" aria-hidden="true" />
		</div>
		<h1 class="mb-2 text-5xl font-semibold tracking-tight text-foreground">{page.status}</h1>
		<h2 class="mb-4 text-xl font-medium text-foreground">{page.error?.message || 'Something went wrong'}</h2>
		<p class="mb-8 text-sm text-muted-foreground">
			{#if page.status === 404}
				The page you're looking for doesn't exist.
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

		<nav class="mb-8 flex flex-wrap justify-center gap-x-2 gap-y-1 text-sm" aria-label="Recovery links">
			<a
				href="/"
				class="inline-flex min-h-11 items-center px-2 text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
			>
				Home
			</a>
			<a
				href="/categories"
				class="inline-flex min-h-11 items-center px-2 text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
			>
				{taxonomy.many}
			</a>
			<a
				href="/products"
				class="inline-flex min-h-11 items-center px-2 text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
			>
				All products
			</a>
			<a
				href="/contact-us"
				class="inline-flex min-h-11 items-center px-2 text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
			>
				Contact us
			</a>
		</nav>

		<div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
			<Button variant="outline" class="h-11 gap-2" onclick={goBack}>
				<ArrowLeft class="h-4 w-4" />
				Go back
			</Button>
			<Button href="/" class="h-11 gap-2">
				<Home class="h-4 w-4" />
				Return home
			</Button>
		</div>
	</div>
</div>
