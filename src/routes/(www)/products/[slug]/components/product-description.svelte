<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'
	import { ChevronDown, ChevronUp, Info } from '@lucide/svelte'

	const productState = useProductState()
	const data = $derived(page.data)
</script>

<div class="hidden grid-cols-1 overflow-x-auto sm:grid py-2 border-t border-gray-100">
	{#if productState.selectedVariant?.description || data?.product?.description}
		<div class="mb-4 flex items-center gap-3">
			<h2 class="text-xs font-bold uppercase tracking-widest text-gray-900">Product Description</h2>
			<div class="h-px flex-1 bg-gray-100"></div>
		</div>
		<div
			class="prose prose-sm max-w-none text-gray-600 leading-relaxed prose-headings:text-gray-900 prose-strong:text-gray-900 prose-li:list-disc [&>table]:w-full [&>table]:border-collapse [&_td]:border-b [&_td]:border-gray-50 [&_td]:py-3 [&_td]:text-sm [&_th]:text-left [&_th]:text-xs [&_th]:font-bold [&_th]:uppercase [&_th]:tracking-widest [&_th]:py-3 [&_th]:border-b [&_th]:border-gray-100"
		>
			{@html productState.selectedVariant?.description || data?.product?.description}
		</div>
	{/if}
</div>

<!-- Click to show description in mobile -->
<div class="sm:hidden border-t border-gray-100">
	<button
		class="flex w-full items-center justify-between gap-2 py-5 text-sm text-gray-900 font-bold uppercase tracking-widest"
		onclick={() => (productState.showDescription = !productState.showDescription)}
	>
		<div class="flex items-center gap-4">
			<div class="flex flex-col items-start">
				<span>Product Description</span>
			</div>
		</div>

		{#if productState.showDescription}
			<ChevronUp class="h-4 w-4 text-gray-400" />
		{:else}
			<ChevronDown class="h-4 w-4 text-gray-400" />
		{/if}
	</button>
	{#if productState.showDescription}
		<div class="grid grid-cols-1 overflow-x-auto pb-6">
			<div
				class="prose prose-sm text-gray-600 leading-relaxed [&>table]:w-full [&>table]:border-collapse [&_td]:border-b [&_td]:border-gray-50 [&_td]:py-3 [&_td]:text-sm [&_th]:text-left [&_th]:text-xs [&_th]:font-bold [&_th]:uppercase [&_th]:tracking-widest [&_th]:py-3 [&_th]:border-b [&_th]:border-gray-100"
			>
				{@html productState.selectedVariant?.description || data?.product?.description}
			</div>
		</div>
	{/if}
</div>

