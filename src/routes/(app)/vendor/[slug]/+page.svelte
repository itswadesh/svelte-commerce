<style>
.h-rem {
	height: 50vh;
}
</style>

<script>
import { dateOnly } from '$lib/utils'
import { DummyProductCard, Pagination, LazyImg, ProductCard, SliderBanner } from '$lib/components'
import { RatingStarDisplay } from '$lib/ui'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import SEO from '$lib/components/SEO/index.svelte'

export let data
// console.log('zzzzzzzzzzzzzzzzzz', data)

const seoProps = {
	title: 'Vendor Profile',
	metaDescription: 'Vendor Profile'
}
</script>

<SEO {...seoProps} />

<section class="min-h-screen">
	<SliderBanner
		data="{data.vendor}"
		rating="{data.rating}"
		ratingCount="{data.ratingCount}"
		reviewCount="{data.reviewCount}" />
	<!-- needClaim -->

	<div class="px-3 py-5 sm:p-10">
		<div class="container mx-auto w-full max-w-6xl">
			<!-- About Vendor -->

			{#if data.vendor?.description}
				<p class="mb-10 prose prose-sm sm:prose-base max-w-none">
					{@html data.vendor?.description}
				</p>
			{/if}

			<!-- Categories -->

			{#if data.vendor?.categories && data.vendor?.categories.length}
				<div class="mb-10">
					<h5 class="mb-2 font-semibold sm:mb-4 sm:text-lg">Categories</h5>

					<div class="flex items-center gap-2">
						{#each data.vendor?.categories as category}
							<div class="rounded bg-gray-200 py-2 px-4 text-sm font-semibold">
								{category.name}
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Product By Vendor -->

			{#if data.vendorsProduct?.count}
				<div>
					<h3 class="mb-2 font-semibold sm:mb-4 sm:text-lg capitalize">
						Popular
						{#if data.vendorsProduct?.count > 1}
							items
						{:else}
							item
						{/if}
						from
						{data.vendor?.businessName || 'Vendor'}
					</h3>

					{#if data.vendorsProduct?.count}
						<div>
							<ul
								class="grid w-full grid-cols-2 items-start border-t sm:flex sm:flex-wrap sm:justify-between sm:gap-3 sm:border-t-0 lg:gap-6">
								{#each data.vendorsProduct?.data as p, ix}
									<li>
										<ProductCard product="{p}" />
									</li>
								{/each}

								{#each { length: 7 } as _}
									<li class="hidden sm:block">
										<DummyProductCard />
									</li>
								{/each}
							</ul>

							<Pagination
								count="{Math.ceil((data.vendorsProduct?.count || 1) / 40)}"
								current="{data.page || 1}" />
						</div>
					{:else}
						<p class="bg-zinc-200 rounded p-5 text-sm text-zinc-500 text-center">
							Oops!...No product found, vendor has not uploaded any product yet.
						</p>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</section>
