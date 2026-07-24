<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'

	const productState = useProductState()
	const data = $derived(page.data)
	const metadataEntries = $derived(Object.entries(data?.product?.metadata || {}).filter(([key]) => !/^(product )?specifications?$/i.test(key.trim())))
</script>

{#if metadataEntries.length}
	<div class="mt-4 edp-meta">
		<div class="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
			{#each metadataEntries as [key, value]}
				<div class="card edp-meta-item">
					<div class="card-header">
						<h3 class="card-title edp-meta-key">{key}</h3>
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
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ed-soft);
		margin: 0 0 4px;
	}

	:global([data-theme='default'] .edp-meta-val) {
		font-family: var(--ed-body);
		font-size: 0.92rem;
		color: var(--ed-ink);
	}
</style>
