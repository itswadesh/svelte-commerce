<style>
.h-rem {
	height: 50vh;
}
</style>

<script>
import { dateOnly } from '$lib/utils'
import { DummyProductCard, Pagination, LazyImg, ProductCard, SliderBanner } from '$lib/components'
import {
	Email,
	Facebook,
	LinkedIn,
	Pinterest,
	Telegram,
	Twitter,
	WhatsApp
} from 'svelte-share-buttons-component'
import { page } from '$app/stores'
import { RatingStarDisplay } from '$lib/ui'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import SEO from '$lib/components/SEO/index.svelte'

export let data

const seoProps = {
	title: 'Vendor Profile',
	metaDescription: 'Vendor Profile'
}

let text = data.vendor?.businessName
let url = $page?.url?.href
let media = data.vendor?.banners[0]
</script>

<SEO {...seoProps} />

<section class="min-h-screen">
	<SliderBanner
		data="{data.vendor}"
		rating="{data.rating}"
		ratingCount="{data.ratingCount}"
		reviewCount="{data.reviewCount}" />
	<!-- needClaim -->

	<div class="px-3 py-5 sm:p-10 xl:flex items-start gap-5">
		<ul class="hidden sticky top-28 xl:flex flex-col gap-2 m-0 p-0 list-none">
			<li>
				<WhatsApp text="{text} {url}" />
			</li>

			<li>
				<Telegram text="{text}" url="{url}" />
			</li>

			<li>
				<Facebook quote="{text}" url="{url}" />
			</li>

			<li>
				<Twitter
					class="share-button"
					text="{text}"
					url="{url}"
					hashtags="litekart"
					via="litekart"
					related="mobile cover,t-shirt,key chain " />
			</li>

			<li>
				<Pinterest url="{url}" media="{media}" description="{text}" />
			</li>

			<li>
				<LinkedIn url="{url}" />
			</li>

			<li>
				<Email subject="Take a look at this {text}" body="{url}" />
			</li>
		</ul>

		<div class="container mx-auto w-full max-w-6xl">
			<!-- About Vendor -->

			{#if data.vendor?.description}
				<p class="mb-10 prose max-w-none">
					{@html data.vendor?.description}
				</p>
			{/if}

			<ul class="xl:hidden flex flex-wrap gap-2 mb-5 p-0 list-none">
				<li>
					<WhatsApp text="{text} {url}" />
				</li>

				<li>
					<Telegram text="{text}" url="{url}" />
				</li>

				<li>
					<Facebook quote="{text}" url="{url}" />
				</li>

				<li>
					<Twitter
						class="share-button"
						text="{text}"
						url="{url}"
						hashtags="litekart"
						via="litekart"
						related="mobile cover,t-shirt,key chain " />
				</li>

				<li>
					<Pinterest url="{url}" media="{media}" description="{text}" />
				</li>

				<li>
					<LinkedIn url="{url}" />
				</li>

				<li>
					<Email subject="Take a look at this {text}" body="{url}" />
				</li>
			</ul>

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
