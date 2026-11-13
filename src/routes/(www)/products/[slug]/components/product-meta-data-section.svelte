<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'

	const productState = useProductState()
	const data = $derived(page.data)
	// The highlights and the free gift note are drawn in the buy box (GoCommerce D134), the badge on
	// the gallery (src/lib/product/badge.ts), and a value that is a list or an object has no line of
	// text to show here ("[object Object]"), so none is repeated as a raw key. The badge was: every
	// product page carried a heading reading just "badge".
	const DRAWN_ELSEWHERE = new Set(['highlights', 'free_gift', 'badge'])
	// A key as a person reads it: "fabric_care" is "Fabric care".
	const label = (key: string) => {
		const words = key.replace(/[_-]+/g, ' ').trim()
		return words.charAt(0).toUpperCase() + words.slice(1)
	}
	const metadataEntries = $derived(
		Object.entries(data?.product?.metadata || {}).filter(
			([key, value]) =>
				!/^(product )?specifications?$/i.test(key.trim()) &&
				!DRAWN_ELSEWHERE.has(key) &&
				['string', 'number', 'boolean'].includes(typeof value)
		)
	)
</script>

{#if metadataEntries.length}
	<!-- Each key is an h2: these sit directly under the product's h1, with no section heading between. -->
	<div class="edp-meta">
		<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
			{#each metadataEntries as [key, value]}
				<div class="card edp-meta-item">
					<div class="card-header">
						<h2 class="card-title edp-meta-key">{label(key)}</h2>
					</div>
					<div class="card-content edp-meta-val">
						<p>{value}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	/* Refined Editorial — default theme only. Hairline definition blocks, no card+shadow. */
	:global([data-theme='default'] .edp-meta-item) {
		border-top: 1px solid var(--ed-line);
		padding-top: 12px;
	}

	:global([data-theme='default'] .edp-meta-key) {
		font-family: var(--ed-body);
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--ed-soft);
		margin: 0 0 4px;
	}

	:global([data-theme='default'] .edp-meta-val) {
		font-family: var(--ed-body);
		font-size: 0.875rem;
		color: var(--ed-ink);
	}
</style>
