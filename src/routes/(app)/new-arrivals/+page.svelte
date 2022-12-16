<script>
import { goto } from '$app/navigation'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import MobileFooter from '$lib/MobileFooter.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import ProductCard from '$lib/ProductCard.svelte'
import SEO from '$lib/components/SEO/index.svelte'

export let data

let seoProps = {
	title: `New arrivals`,
	description: `New arrivals`
}

let categories = [
	{ name: 'Kurtas' },
	{ name: 'Jeans' },
	{ name: 'T-Shirts' },
	{ name: 'Winter Wear' },
	{ name: 'Kurtas' },
	{ name: 'Jeans' },
	{ name: 'T-Shirts' },
	{ name: 'Winter Wear' }
]

let selectedCategory = {}
let showItemCount = 10
</script>

<SEO {...seoProps} />

{#if data.newArrivals && data.newArrivals[0]}
	<div>
		<div class="mb-20">
			<!-- BANNER -->

			<div class="relative mb-4">
				<div class="h-[25vh] overflow-hidden">
					<LazyImg
						src="{data.newArrivals[0].img}"
						alt=" "
						height="190"
						class="h-full w-full object-cover object-top" />
				</div>

				<div
					class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-center text-3xl font-bold tracking-wider text-white">
					{data.newArrivals[0].name}
				</div>
			</div>

			{#if data.productsCount > 0}
				<!-- CATEGORIES -->

				<!-- <div class="mb-4 w-screen overflow-x-auto overflow-y-hidden scrollbar-none">
					<ul class="ml-2 flex items-center">
						{#each categories as c}
							<li>
								<button
									type="button"
									class="mr-2 whitespace-nowrap rounded-full border-2 px-4 py-1 text-sm font-semibold focus:outline-none
                            {selectedCategory.name === c.name
										? 'border-primary-500 bg-primary-500 text-white'
										: 'text-gray-700 border-gray-200 bg-transparent'}"
									on:click="{() => (selectedCategory = c)}">
									{c.name}
								</button>
							</li>
						{/each}
					</ul>
				</div> -->

				<!-- PRODUCTS -->

				<div
					class="mb-5 grid w-full grid-cols-2 items-start gap-3 sm:mb-10 sm:flex sm:flex-wrap sm:justify-between lg:mb-20 lg:gap-6">
					{#each data.products as p, px}
						{#if showItemCount >= px + 1}
							<ProductCard product="{p}" />
						{/if}
					{/each}
				</div>

				{#if data.productsCount > showItemCount}
					<div class="mx-auto max-w-max">
						<PrimaryButton
							type="button"
							loadingringsize="sm"
							class="text-sm"
							on:click="{() => (showItemCount = showItemCount + 1)}">
							Show More
						</PrimaryButton>
					</div>
				{/if}
			{:else}
				<div class="flex items-center justify-center">
					<div class="m-10 flex flex-col items-center justify-center text-center">
						<h1 class="mb-10 text-xl font-semibold capitalize sm:text-2xl lg:text-3xl">
							Oops!!, No products there
						</h1>

						<div class="mb-5">
							<img
								src="/no/no-data-availible.png"
								alt="no data availible"
								class="h-20 w-20 object-contain text-xs" />
						</div>

						<p class="mb-5 text-center text-gray-500">No data found</p>

						<PrimaryButton class="text-sm" on:click="{() => goto('/')}">Back to Home</PrimaryButton>
					</div>
				</div>
			{/if}
		</div>

		<!-- MOBILE FOOTER -->

		<div class="block sm:hidden">
			<MobileFooter />
		</div>
	</div>
{:else}
	<div class="flex h-[70vh] items-center justify-center">
		<div class="m-10 flex flex-col items-center justify-center text-center">
			<h1 class="mb-10 text-xl font-semibold capitalize sm:text-2xl lg:text-3xl">
				Oops!!, No products there
			</h1>

			<div class="mb-5">
				<img
					src="/no/no-data-availible.png"
					alt="no data availible"
					class="h-20 w-20 object-contain text-xs" />
			</div>

			<p class="mb-5 text-center text-gray-500">No data found</p>

			<PrimaryButton class="text-sm" on:click="{() => goto('/')}">Back to Home</PrimaryButton>
		</div>
	</div>
{/if}
