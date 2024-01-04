<script lang="ts">
import { DummyProductCard, ProductCard } from '$lib/components'

export let title = 'Recommended Products'
export let products = []
</script>

{#if products}
	<div class="mb-5 sm:mb-10">
		<div class="sticky top-14 sm:top-20 z-30 lg:static lg:z-0 mb-3 bg-white py-2">
			<h2 class="font-bold capitalize sm:text-lg border-b-4 border-zinc-800 max-w-max">
				{title}
			</h2>
		</div>

		<div
			class="mb-5 grid w-full grid-cols-2 items-start gap-3 sm:mb-10 sm:flex sm:flex-wrap sm:justify-between lg:gap-6">
			{#each products as p, px}
				<ProductCard product="{p}" />
			{/each}

			{#each { length: 7 } as _}
				<div class="hidden sm:block">
					<DummyProductCard />
				</div>
			{/each}
		</div>
	</div>
{/if}
