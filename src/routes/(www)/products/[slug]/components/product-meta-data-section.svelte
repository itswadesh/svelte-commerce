<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'

	const productState = useProductState()
	const data = $derived(page.data)
	const metadataEntries = $derived(Object.entries(data?.product?.metadata || {}).filter(([key]) => !/^(product )?specifications?$/i.test(key.trim())))
</script>

{#if metadataEntries.length}
	<div class="mt-4">
		<div class="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
			{#each metadataEntries as [key, value]}
				<div class="card">
					<div class="card-header">
						<h3 class="card-title">{key}</h3>
					</div>
					<div class="card-content">
						<p>{value}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
