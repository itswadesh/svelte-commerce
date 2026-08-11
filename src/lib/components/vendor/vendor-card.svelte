<script lang="ts">
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import EmptyImage from '$lib/core/components/image/empty-image.svelte'
	import type { Vendor } from '$lib/core/types/index.js'

	// /vendors used to render its vendors through product-card.svelte, which reads `product.mrp`
	// and links every card to `/products/<slug>`. That threw on init and, once the prop was
	// renamed, still pointed every vendor at a product URL that 404s. Vendors get their own card
	// and link to /store/<slug>, the route that actually renders a vendor storefront.
	const { vendor, priority = false }: { vendor: Vendor; priority?: boolean } = $props()

	const title = $derived(vendor?.businessName || vendor?.name || 'Vendor')
	const image = $derived(vendor?.featuredImage || vendor?.logo)
	const place = $derived([vendor?.city, vendor?.countryName].filter(Boolean).join(', '))
</script>

<a href="/store/{vendor?.slug}" class="group flex flex-col gap-3" aria-label="Visit {title}">
	<div class="aspect-square overflow-hidden rounded-radius border border-border bg-muted">
		{#if image}
			<LazyImg
				src={image}
				alt="{title} storefront"
				sizes="(min-width: 1024px) 25vw, (min-width: 768px) 38vw, 50vw"
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				{priority}
			/>
		{:else}
			<EmptyImage class="h-full w-full" />
		{/if}
	</div>
	<div class="flex flex-col gap-0.5">
		<h2 class="text-sm font-semibold text-foreground">{title}</h2>
		{#if place}
			<p class="text-xs text-muted-foreground">{place}</p>
		{/if}
	</div>
</a>
