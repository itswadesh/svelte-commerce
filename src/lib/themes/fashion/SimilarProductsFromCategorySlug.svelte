<script lang="ts">
import { ProductSkeleton } from '$lib/ui'
import DummyProductCard from './DummyProductCard.svelte'
import ProductCard from './ProductCard.svelte'

export let data
export let title = 'You May Also Like'
</script>

{#if data?.length}
	<div class="mb-5 sm:mb-10">
		<h2 class="mb-5 sm:mb-10 text-xl text-center uppercase">{title}</h2>

		<ul
			class="grid grid-cols-2 sm:flex flex-wrap w-full items-start justify-center gap-3 sm:gap-7 lg:gap-14">
			{#each data as p}
				<li class="col-span-1 sm:w-1/3 lg:w-1/4 xl:w-1/5">
					<ProductCard product="{p}" />
				</li>
			{/each}
		</ul>
	</div>
{/if}
