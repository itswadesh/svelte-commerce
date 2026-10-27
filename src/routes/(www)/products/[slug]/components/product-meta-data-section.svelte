<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'

	const productState = useProductState()
	const data = $derived(page.data)
	// The highlights and the free gift note are drawn in the buy box (GoCommerce D134), and a value
	// that is a list or an object has no line of text to show here ("[object Object]"), so neither
	// is repeated as a raw key.
	const DRAWN_ELSEWHERE = new Set(['highlights', 'free_gift'])
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
						<h2 class="card-title edp-meta-key">{key}</h2>
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
