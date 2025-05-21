<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/product'
	import { ChevronDown, ChevronUp, Info } from 'lucide-svelte'

	const productState = useProductState()
	const data = $derived(page.data)
</script>

<div class="hidden grid-cols-1 overflow-x-auto sm:grid">
	{#if productState.selectedVariant?.description || data?.product?.description}
		<div class="mb-1 mt-5 flex items-center gap-2">
			<span class="text-sm text-gray-500">Description</span>
			<Info class="h-3 w-3" />
		</div>
		<p
			class="prose text-black prose-li:list-decimal [&>table]:border [&>table]:border-gray-200 [&_*_td]:border [&_*_td]:border-gray-200 [&_*_td]:p-1 [&_*_th]:border [&_*_th]:border-gray-200"
		>
			{@html productState.selectedVariant?.description || data?.product?.description}
		</p>
		<!-- <p
                class="prose text-black {!showDescription
                  ? 'line-clamp-3 text-ellipsis'
                  : ''} prose-li:list-decimal [&>table]:border [&>table]:border-gray-200 [&_*_td]:border [&_*_td]:border-gray-200 [&_*_td]:p-1 [&_*_th]:border [&_*_th]:border-gray-200"
              >
                {@html selectedVariant?.description ||
                  data?.product?.description}
              </p>
              {#if !showDescription}
                <button
                  class="inline-block text-primary cursor-pointer text-start text-sm underline"
                  onclick={() => (showDescription = true)}
                >
                  Show more
                </button>
              {:else}
                <button
                  class="inline-block text-primary cursor-pointer text-start text-sm underline"
                  onclick={() => (showDescription = false)}
                >
                  Show less
                </button>
              {/if} -->
	{/if}
</div>

<!-- Click to show description in mobile -->
<div class="absolute w-screen -translate-x-3 border-t border-gray-200 sm:hidden"></div>
<div class="sm:hidden">
	<button
		class="flex w-full items-center justify-between gap-2 {!productState.showDescription
			? 'border-b'
			: ''} border-gray-200 py-4 text-sm text-gray-500"
		onclick={() => (productState.showDescription = !productState.showDescription)}
	>
		<div class="flex items-center gap-4">
			<Info class="h-5 w-5 text-black" />
			<div class="flex flex-col items-start">
				<span class="font-semibold text-black">Product Description</span>
				<span class="text-xs text-gray-500">Click to view</span>
			</div>
		</div>

		{#if productState.showDescription}
			<ChevronUp class="h-5 w-5 text-black" />
		{:else}
			<ChevronDown class="h-5 w-5 text-black" />
		{/if}
	</button>
	{#if productState.showDescription}
		<div class="grid grid-cols-1 overflow-x-auto">
			<p
				class="text-black [&>table]:border [&>table]:border-gray-200 [&_*_td]:border [&_*_td]:border-gray-200 [&_*_td]:p-1 [&_*_th]:border [&_*_th]:border-gray-200"
			>
				{@html productState.selectedVariant?.description || data?.product?.description}
			</p>
		</div>
	{/if}
</div>

