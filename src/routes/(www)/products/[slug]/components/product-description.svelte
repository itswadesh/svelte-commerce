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
	<div class="border-b border-gray-300 edp-acc">
		<button class="intra-pt flex w-full items-center justify-between gap-2 pb-2 text-base font-bold text-gray-900 edp-acc-btn" onclick={() => (isOpen = !isOpen)}>
			<span class="edp-acc-label">Product Description</span>

			{#if isOpen}
				<ChevronUp class="h-4 w-4 text-gray-800" />
			{:else}
				<ChevronDown class="h-4 w-4 text-gray-800" />
			{/if}
		</button>

		{#if isOpen}
			<div class="grid grid-cols-1 overflow-x-auto pb-6">
				<div
					class="edp-prose prose prose-sm max-w-none leading-relaxed text-gray-600 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-li:list-disc [&>table]:w-full [&>table]:border-collapse [&_td]:border-b [&_td]:border-gray-50 [&_td]:py-3 [&_td]:text-sm [&_th]:border-b [&_th]:border-gray-100 [&_th]:py-3 [&_th]:text-left [&_th]:text-xs [&_th]:font-bold [&_th]:uppercase [&_th]:tracking-widest"
				>
					{@html description}
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	/* Refined Editorial — default theme only. */
	:global([data-theme='default'] .edp-acc) {
		border-bottom: 1px solid var(--ed-line);
	}

	:global([data-theme='default'] .edp-acc-label) {
		font-family: var(--ed-body);
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ed-ink);
	}

	:global([data-theme='default'] .edp-prose) {
		color: var(--ed-soft);
		font-size: 0.92rem;
		line-height: 1.7;
	}

	:global([data-theme='default'] .edp-prose :is(h1, h2, h3, h4, strong)) {
		color: var(--ed-ink);
	}
</style>
