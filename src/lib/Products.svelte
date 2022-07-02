<script>
import CartButtons from './CartButtons.svelte'
import ImageLoader from './components/Image/ImageLoader.svelte'

import { currency } from './util'
export let products, showcart, cart
</script>

<div class="p-3 py-10 text-gray-800 sm:p-10">
	<div class="container mx-auto max-w-7xl">
		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
			{#each products as p, ix}
				<div
					class="group flex gap-4 rounded-2xl border bg-white p-4 shadow-lg transition duration-300 hover:shadow-xl sm:p-6">
					<div
						class="h-28 w-28 flex-shrink-0 overflow-hidden rounded-md bg-gray-300 bg-cover bg-no-repeat sm:h-36 sm:w-36"
						style="background-image: url('/no/gray-food-icon-seamless-pattern.jpg')">
						<ImageLoader
							src="{p._source.img}"
							alt=" "
							class="h-full w-full bg-white object-cover object-center" />
					</div>

					<div class="flex-1">
						<div class="mb-2 flex gap-2 sm:gap-4">
							<h1 class="flex-1 text-lg font-bold group-hover:underline">
								{p._source.name}
							</h1>

							<div class="flex-shrink-0">
								{#if p._source.foodType === 'V'}
									<ImageLoader src="{`/product/veg.png`}" alt="veg" class="h-5 w-5" />
								{:else if p._source.foodType === 'N' || p._source.foodType === 'E'}
									<ImageLoader src="{`/product/non-veg.png`}" alt="non veg" class="h-5 w-5" />
								{:else}
									<ImageLoader src="{`/product/other.png`}" alt="other" class="h-5 w-5" />
								{/if}
							</div>
						</div>

						{#if p._source?.tags?.length}
							<div class="mb-2 flex flex-wrap items-center gap-2">
								{#each p._source?.tags as tag}
									<div
										class="rounded-md px-2 py-1 text-xs font-semibold tracking-wider text-white"
										style="background-color:{tag.colorCode}">
										{tag.name}
									</div>
								{/each}
							</div>
						{/if}

						{#if p._source.description && p._source.description != ''}
							<p class="mb-2 text-sm line-clamp-2">
								{@html p._source.description}
							</p>
						{/if}

						<div class="mb-4 flex flex-wrap items-end gap-2">
							<span class="text-xl font-bold sm:text-3xl">
								{currency(p._source.price)}
							</span>

							{#if p._source.mrp > p._source.price}
								<span class="text-sm text-gray-500">
									<del>
										{currency(p._source.mrp)}
									</del>
								</span>
							{/if}

							{#if p._source.discount}
								<span class="text-sm text-green-500">
									({p._source.discount}%)
								</span>
							{/if}
						</div>

						{#if showcart}
							<CartButtons product="{{ id: p._id }}" cart="{cart}" />
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
