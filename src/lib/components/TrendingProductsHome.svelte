<script>
import { page } from '$app/stores'
import { ProductCard, DummyProductCard } from '$lib/components'

export let data

let product_image_dimension = $page.data.store?.product_image_dimension || '3x4'
</script>

<!-- Trending products -->

{#await data.streamed.home then home}
	{#if home?.trending?.length > 0}
		<div>
			<h2
				class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl uppercase">
				<!-- TRENDING ON {$page.data.store?.websiteName} -->
				Latest Collection
			</h2>

			<ul
				class="sm:px-10 border-t sm:border-t-0 grid w-full items-start sm:gap-3 lg:gap-6
				{product_image_dimension == '16x9'
					? 'grid-cols-1 md:grid-cols-2 lg:flex lg:flex-wrap lg:justify-between'
					: 'grid-cols-2 sm:flex sm:flex-wrap sm:justify-between'}">
				{#each home?.trending as p}
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
