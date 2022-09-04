<script lang="ts">
import SEO from '$lib/components/SEO/index.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import Breadcrumb from '$lib/components/Breadcrumb.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import MobileFooter from '$lib/MobileFooter.svelte'
import { goto, invalidate } from '$app/navigation'
import Pagination from '$lib/components/Pagination.svelte'
import ProductCard from '$lib/ProductCard.svelte'
import MobileFilter from '$lib/components/MobileFilter.svelte'
import DesktopFilter from '$lib/components/DesktopFilter.svelte'
import { page } from '$app/stores'
import { getAPI } from '$lib/util/api'
import { toast } from '$lib/util'
import { onMount } from 'svelte'
import { sorts } from '$lib/config'

export let data

// console.log('zzzzzzzzzzzzzzzzzz', data)

let seoProps = {
	title: `Category`,
	description: `Category`
}

let products, productsCount, facets, err, currentPage

let query = $page?.url?.searchParams

onMount(async () => {
	try {
		const res = await getAPI(
			`products?categories=${data.category?._id}&store=${$page.data?.store?.id}`
		)

		// console.log('res = ', res)

		products = res?.data
		productsCount = res?.count
		currentPage = res?.page
		facets = res?.facets?.all_aggs
		err = !products ? 'No result Not Found' : null
	} catch (e) {
		toast(e, 'error')
	} finally {
	}
})

async function sortNow(s) {
	if (s == 'null' || s == null || s == undefined || s == 'undefined') {
		$page.url.searchParams.delete('sort')
	} else {
		await $page.url.searchParams.set('sort', s)
	}
	await goto(`/search?${$page.url.searchParams.toString()}`)
	await invalidate()
}

async function refreshData() {
	try {
		const res = await getAPI(`categories/${$page?.params?.slug}?${data.query.toString()}`)

		// console.log('refresh res = ', res)

		data.category = res?.data
		data.count = res?.count
		data.err = !data.category ? 'No result Not Found' : null
	} catch (e) {
		toast(e, 'error')
	} finally {
	}
}
</script>

<!-- <SEO {...seoProps} /> -->

<svelte:head>
	<title>{data.category?.name}</title>
</svelte:head>

<div>
	<div class="mb-20 flex min-h-screen w-full flex-col gap-5 lg:flex-row lg:gap-10 lg:px-10">
		{#if facets}
			<DesktopFilter
				facets="{facets}"
				query="{query}"
				class="sticky top-[7.5rem] hidden lg:top-[5.5rem] lg:block"
				on:clearAll="{refreshData}" />

			<MobileFilter
				facets="{facets}"
				class="sticky top-[5rem] z-50 block lg:hidden"
				on:clearAll="{refreshData}" />
		{/if}

		<div class="flex w-full px-3 py-5">
			<div class="w-full">
				{#if productsCount > 0}
					<h1 class="mb-5 text-xl font-bold capitalize md:text-2xl">
						{data.category?.name} ({productsCount})
					</h1>

					<div class="mb-4 hidden flex-wrap items-center justify-between md:flex">
						<label class="flex items-center gap-2">
							<span>Sort : </span>

							<select
								class="bg-transparent px-2 py-1 font-semibold hover:underline focus:outline-none"
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
						{#each products as p}
							<ProductCard product="{p}" />
						{/each}
					</div>

					<Pagination count="{Math.ceil(productsCount / 40)}" current="{currentPage}" />
				{:else}
					<div class="flex items-center justify-center" style="height: 60vh;">
						<div class="m-10 flex flex-col items-center justify-center text-center">
							<h1 class="mb-10 text-xl capitalize sm:text-2xl lg:text-3xl">
								Oops!!, No result found {#if data.category?.name} for "{data.category?.name}"{/if}
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
		</div>
	</div>

	<div class="block sm:hidden">
		<MobileFooter />
	</div>
</div>
