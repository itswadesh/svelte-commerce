<script lang="ts">
	import { useProductState } from '$lib/core/composables/product'
	import { Badge } from '$lib/components/ui/badge'

	const productState = useProductState()
	const data = $derived(productState.data)
</script>

{#if data?.product?.productTags?.length > 0}
	<div class=" flex flex-wrap gap-2">
		{#each (data?.product.productTags || '').split(',') || [] as t}
			<Badge variant="outline">{t}</Badge>
		{/each}
	</div>
{/if}

