<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'
	import { ChevronDown, ChevronUp } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'

	const productState = useProductState()
	const data = $derived(page.data)
	const description = $derived(productState.selectedVariant?.description || data?.product?.description || '')
	const hasDescription = $derived(
		description
			.replace(/<[^>]*>/g, '')
			.replace(/&nbsp;/gi, '')
			.trim().length > 0
	)

	let isOpen = $state(true)
</script>

{#if hasDescription}
	<div class="border-b border-gray-300">
		<button class="intra-pt flex w-full items-center justify-between gap-2 pb-2 text-base font-bold text-gray-900" onclick={() => (isOpen = !isOpen)}>
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
					class="prose prose-sm max-w-none leading-relaxed text-gray-600 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-li:list-disc [&>table]:w-full [&>table]:border-collapse [&_td]:border-b [&_td]:border-gray-50 [&_td]:py-3 [&_td]:text-sm [&_th]:border-b [&_th]:border-gray-100 [&_th]:py-3 [&_th]:text-left [&_th]:text-xs [&_th]:font-bold [&_th]:uppercase [&_th]:tracking-widest"
				>
					{@html description}
				</div>
			</div>
		{/if}
	</div>
{/if}
