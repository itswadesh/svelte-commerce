<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'
	import { ChevronDown, ChevronUp } from '@lucide/svelte'

	const productState = useProductState()
	const data = $derived(page.data)

	let isOpen = $state(false)
</script>

<div class="border-t border-gray-100">
	{#if productState.selectedVariant?.description || data?.product?.description}
		<button
			class="flex w-full items-center justify-between gap-2 py-5 text-sm text-gray-900 font-bold uppercase "
			onclick={() => (isOpen = !isOpen)}
		>
			<span>Product Description</span>

			{#if isOpen}
				<ChevronUp class="h-4 w-4 text-gray-800" />
			{:else}
				<ChevronDown class="h-4 w-4 text-gray-800" />
			{/if}
		</button>

		{#if isOpen}
			<div class="grid grid-cols-1 overflow-x-auto pb-6">
				<div
					class="prose prose-sm max-w-none text-gray-600 leading-relaxed prose-headings:text-gray-900 prose-strong:text-gray-900 prose-li:list-disc [&>table]:w-full [&>table]:border-collapse [&_td]:border-b [&_td]:border-gray-50 [&_td]:py-3 [&_td]:text-sm [&_th]:text-left [&_th]:text-xs [&_th]:font-bold [&_th]:uppercase [&_th]:tracking-widest [&_th]:py-3 [&_th]:border-b [&_th]:border-gray-100"
				>
					{@html productState.selectedVariant?.description || data?.product?.description}
				</div>
			</div>
		{/if}
	{/if}
</div>

