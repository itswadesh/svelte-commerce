<script lang="ts">
	import { useProductState } from '$lib/core/composables/index.js'
	import { Badge } from '$lib/components/ui/badge'
	import { page } from '$app/state'

	const productState = useProductState()
	const data = $derived(page.data)
</script>

{#if data?.product?.productTags?.length > 0}
	<div class=" flex flex-wrap gap-2 edp-tags">
		{#each (data?.product.productTags || '').split(',') || [] as t}
			<Badge variant="outline" class="edp-tag">{t}</Badge>
		{/each}
	</div>
{/if}

<style>
	/* Refined Editorial — default theme only. */
	:global([data-theme='default'] .edp-tags) {
		margin-top: 8px;
	}

	:global([data-theme='default'] .edp-tag) {
		border: 1px solid var(--ed-line) !important;
		border-radius: var(--ed-radius) !important;
		background: transparent !important;
		color: var(--ed-soft) !important;
		font-family: var(--ed-body);
		font-size: 0.68rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 4px 10px;
	}
</style>
