<script>
import { page } from '$app/stores'
import { ProductCard, DummyProductCard } from '$lib/components'

export let data

let product_image_dimension = $page.data.store?.product_image_dimension || '3x4'
</script>

<!-- Popular products -->

{#await data?.streamed.home then home}
	{#if home?.popular?.length > 0}
		<div>
			<h2 class="p-3 py-5 text-center sm:px-10 md:py-10 uppercase">
				POPULAR ON {$page.data.store?.websiteName}
			</h2>

			<ul
				class="sm:px-10 border-t sm:border-t-0 grid w-full items-start sm:gap-3 lg:gap-6
				{product_image_dimension == '16x9'
					? 'grid-cols-1 md:grid-cols-2 lg:flex lg:flex-wrap lg:justify-between'
					: 'grid-cols-2 sm:flex sm:flex-wrap sm:justify-between'}">
				{#each home?.popular as p}
					<li>
						<ProductCard product="{p}" />
					</li>
				{/each}

				{#each { length: 8 } as _}
					<li class="hidden sm:block">
						<DummyProductCard />
					</li>
				{/each}
			</ul>
		</div>
	{/if}
{/await}
