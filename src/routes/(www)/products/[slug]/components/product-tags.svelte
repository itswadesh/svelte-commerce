<script lang="ts">
	import { useProductState } from '$lib/core/composables/product'
	import { Badge } from '$lib/components/ui/badge'
	import { page } from '$app/state'

	const productState = useProductState()
	const data = $derived(page.data)
</script>

{#if data?.product?.productTags?.length > 0}
	<div class=" flex flex-wrap gap-2">
		{#each (data?.product.productTags || '').split(',') || [] as t}
			<Badge variant="outline">{t}</Badge>
		{/each}
	</div>
{/if}

