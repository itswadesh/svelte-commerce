<script lang="ts">
	import { GoogleStructuredDataBreadcrumb } from '@misiki/kitcommerce-core/components'
	import ProductListSchema from '$lib/components/seo/product-list-schema.svelte'

	import { page } from '$app/state'

	// Both call sites render this bare (`<ListingScehma />`), so a `products` prop defaulted to
	// `[]` and no listing page on the site ever emitted ItemList markup. Read the SSR data
	// directly — the same source listing-grid.svelte renders — and keep the prop as an override.
	const { products }: { products?: any[] } = $props()

	const listedProducts = $derived(products ?? page.data.products?.data ?? [])

	const categoryHierarchy: { name: string; slug?: string }[] = $derived(page.data.products?.categoryHierarchy || [])
</script>

<ProductListSchema products={listedProducts} />

<!-- Hand the raw hierarchy over: the core component maps `${origin}/${slug}` for every crumb,
     including the leaf. Pre-mapping into `breadcrumbs` here previously produced
     `https://example.compendant` (no separator) and dropped the last crumb entirely, so
     single-level categories emitted no BreadcrumbList at all. -->
<GoogleStructuredDataBreadcrumb {categoryHierarchy} />

<!-- No FAQPage here: this page renders no Q&A, and structured data that describes content the
     page does not show is a manual-action trigger. Real FAQ markup lives on /faqs. -->
