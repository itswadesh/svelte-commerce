<style>
@media (min-width: 1024px) {
	.top-rem-map {
		top: 85px;
	}
}
.frosted-black {
	backdrop-filter: blur(5px);
	background-color: hsla(0, 0%, 0%, 0.8);
}
.height {
	max-height: 85vh;
}
</style>

<script>
import SEO from '$lib/components/SEO/index.svelte'
import { goto, invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import { dateOnly, toast } from '$lib/util'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import { sorts } from '$lib/config'
import { getAPI } from '$lib/util/api'
import ProductCard from '$lib/ProductCard.svelte'
import DesktopFilter from '$lib/components/DesktopFilter.svelte'
import MobileFilter from '$lib/components/MobileFilter.svelte'
import MobileFooter from '$lib/MobileFooter.svelte'
import Pagination from '$lib/components/Pagination.svelte'
import { onMount } from 'svelte'
import DummyProductCard from '$lib/DummyProductCard.svelte'
import { gett } from '$lib/utils'

export let data

let seoProps = {
	title: `Find best ${data.searchData || ' '}`,
	metadescription: `Find best ${data.searchData || ' '}`
}

async function sortNow(s) {
	let u = new URL($page.url)

	if (s == 'null' || s == null || s == undefined || s == 'undefined') {
		u.searchParams.delete('sort')
	} else {
		await u.searchParams.set('sort', s)
	}
	// await invalidateAll()
	goto(u.toString())
	window.scroll({ top: 0, behavior: 'smooth' })

	// await goto(`/search?${$page.url.searchParams.toString()}`)
}
let currentPage = 1
async function loadNextPage() {
	let nextPage = currentPage + 1
	try {
		const res = await getAPI(`products?${data.query.toString()}&page=${nextPage}`)
		// console.log('refresh res = ', res)
		data.products = data.products.concat(res?.data)
		data.count = res?.count
		data.facets = res?.facets?.all_aggs
		data.err = !data.products ? 'No result Not Found' : null
		currentPage = currentPage + 1
	} catch (e) {
		toast(e, 'error')
	} finally {
	}
}

async function refreshData() {}

onMount(() => {
	if ($page?.data?.isDesktop) return
	const intersectionObserver = new IntersectionObserver((entries) => {
		if (entries[0].intersectionRatio <= 0) return
		// load more content;
		loadNextPage()
	})
	intersectionObserver.observe(document.querySelector('.more'))
})
</script>

<SEO {...seoProps} />

<div>
	<div class="mb-20 flex w-full flex-col gap-5 lg:flex-row lg:gap-10 lg:p-10">
		{#if data.facets}
			<DesktopFilter
				facets="{data.facets}"
				query="{data.query}"
				class="sticky top-[7.5rem] hidden lg:top-[5.5rem] lg:block"
				on:clearAll="{refreshData}" />

			<MobileFilter
				facets="{data.facets}"
				class="sticky top-[5rem] z-40 block lg:hidden"
				on:clearAll="{refreshData}" />
		{/if}

		<div class="flex w-full px-3 sm:px-10 lg:px-0">
			{#if data.products}
				<div class="w-full">
					{#if data.products?.length > 0}
						<h1 class="mb-5 text-xl font-bold capitalize md:text-2xl">
							Showing results

							{#if data.searchData}
								for "{data.searchData}"
							{/if}

							({data.count})
						</h1>

						<div class="mb-4 hidden flex-wrap items-center justify-between md:flex">
							<label class="flex items-center gap-2">
								<span>Sort : </span>

								<select
									class="bg-transparent px-2 py-1 font-semibold focus:outline-none hover:underline"
									bind:value="{data.sort}"
									on:change="{() => sortNow(data.sort)}">
									{#each sorts as s}
										<option value="{s.val}">{s.name}</option>
									{/each}
								</select>
							</label>
						</div>

						<div
							class="mb-5 grid w-full grid-cols-2 items-start gap-3 sm:mb-10 sm:flex sm:flex-wrap sm:justify-between lg:mb-20 lg:gap-6">
							{#each data.products as p}
								<ProductCard product="{p}" />
							{/each}

							{#each { length: 7 } as _}
								<div class="hidden sm:block">
									<DummyProductCard />
								</div>
							{/each}
						</div>
						{#if !$page?.data?.isDesktop}
							<div class="more">loading</div>
						{:else}
							<Pagination count="{Math.ceil(data.count / 40)}" current="{data.currentPage}" />
						{/if}
					{:else}
						<div class="flex items-center justify-center" style="height: 60vh;">
							<div class="m-10 flex flex-col items-center justify-center text-center">
								<h1 class="mb-10 text-xl capitalize sm:text-2xl lg:text-3xl">
									Oops!!, No result found {#if data.searchData} for "{data.searchData}"{/if}
								</h1>

								<div class="mb-5">
									<LazyImg
										src="/no/no-data-availible.png"
										alt="no data availible"
										width="80"
										height="80"
										class="h-20 w-20 text-xs" />
								</div>

								<p class="mb-5 text-center text-gray-500">No data found</p>

								<PrimaryButton class="text-sm" on:click="{() => goto('/')}">
									Back to Home
								</PrimaryButton>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<!-- CATEGORY DESCRIPTION -->

	{#if data.category?.description}
		<div class="w-full justify-center bg-gray-50 px-3 py-10 text-sm sm:px-10 sm:py-20">
			<div
				class="container mx-auto grid max-w-6xl grid-cols-1 gap-10 text-sm sm:gap-20 md:grid-cols-6">
				<div class="col-span-1 text-gray-500 md:col-span-3 lg:col-span-4">
					<h1 class="mb-5 text-center text-base font-bold uppercase tracking-wide">
						Buy {data.category?.name}
					</h1>

					<div class="prose-sm prose text-justify">
						{@html data.category?.description}
					</div>
				</div>

				<div class="col-span-1 text-gray-500 md:col-span-3 lg:col-span-2">
					<h1 class="mb-5 text-center text-base font-bold uppercase tracking-wide">
						{data.category?.name} price list
					</h1>

					<ul class="flex flex-col gap-2">
						<li class="grid grid-cols-6 items-center gap-5 font-semibold uppercase">
							<span class="col-span-5">{data.category?.name}</span>

							<span class="col-span-1">Price <br /> (Rs)</span>
						</li>

						{#each data.products as p, px}
							{#if p && px < 10}
								<li>
									<a href="/product/{p.slug}" class="grid grid-cols-6 gap-5">
										<span class="col-span-5 text-justify">{p.name}</span>

										<span class="col-span-1 whitespace-nowrap">{p.formattedPrice}</span>
									</a>
								</li>
							{/if}
						{/each}

						{#if data.products && data.products[0] && data.products[0]?.updatedAt}
							<li class="font-semibold">
								<i>Data last updated on {dateOnly(data.products[0]?.updatedAt)}</i>
							</li>
						{/if}
					</ul>
				</div>
			</div>
		</div>
	{/if}

	<div class="block sm:hidden">
		<MobileFooter />
	</div>
</div>
