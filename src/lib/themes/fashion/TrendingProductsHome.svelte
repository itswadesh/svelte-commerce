<script>
import { fly } from 'svelte/transition'
import DummyProductCard from './DummyProductCard.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import ProductCard from './ProductCard.svelte'

export let data
// console.log('zzzzzzzzzzzzzzzzzz', data)
</script>

<!-- Trending products -->

{#await data.streamed.home then home}
	{#if home?.trending?.length > 0}
		<div>
			<div class="p-3 py-5 sm:px-10 md:py-10 text-center uppercase flex flex-col gap-2">
				<p class="text-sm tracking-widest">Featured Collection</p>

				{#if home?.trending[0]?.category?.name}
					<h2 class="text-xl font-medium tracking-wider sm:text-2xl md:text-2xl">
						{home?.trending[0]?.category?.name}
					</h2>
				{/if}
			</div>

			<ul
				class="sm:px-10 border-t sm:border-t-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 w-full items-start sm:gap-7 lg:gap-14">
				{#each home?.trending as p, px}
					{#if px < 8}
						<li in:fly="{{ y: 20, duration: 300, delay: 100 * px }}">
							<ProductCard product="{p}" />
						</li>
					{/if}
				{/each}

				{#each { length: 4 } as _}
					<li class="hidden sm:block">
						<DummyProductCard />
					</li>
				{/each}
			</ul>

			{#if home?.trending?.length >= 8}
				<div class="mb-10 sm:mb-20 flex justify-center">
					<a href="/search?q=">
						<PrimaryButton hideLoading roundedNone class="w-60">VIEW ALL PRODUCTS</PrimaryButton>
					</a>
				</div>
			{/if}

			<hr />
		</div>
	{/if}
{/await}
