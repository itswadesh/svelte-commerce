<script lang="ts">
import { CategoryService } from '$lib/services'
import { goto, invalidateAll } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { sorts } from '$lib/config'
import { toast } from '$lib/utils'
import {ProductCard,Pagination,MobileFooter,DesktopFilter,MobileFilter} from '$lib/components'
import noDataAvailable from '$lib/assets/no/no-data-available.png'
import {PrimaryButton} from '$lib/ui'

export let data

let seoProps = {
	title: `Category`,
	description: `Category`
}

let products, productsCount, facets, err, currentPage

let query = $page?.url?.searchParams

onMount(async () => {
	try {
		const res = await CategoryService.fetchAllProductsOfCategories({
			origin: $page?.data?.origin,
			storeId: $page?.data?.store?.id
		})
		products = res.products
		productsCount = res.productsCount
		currentPage = res.currentPage
		facets = res.facets
		err = res.err
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
	await invalidateAll()
}

async function refreshData() {
	try {
		const res = await CategoryService.fetchCategory({ id: $page?.params?.slug, origin: origin })
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
				class="sticky top-[4.9rem] z-50 block lg:hidden"
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
						class="mb-5 grid w-full grid-cols-2 items-start gap-3 sm:mb-10 sm:flex sm:flex-wrap sm:justify-between lg:gap-6">
						{#each products as p}
							<ProductCard product="{p}" />
						{/each}
					</div>

					<Pagination count="{Math.ceil((productsCount || 1) / 40)}" current="{currentPage || 1}" />
				{:else}
					<div class="flex items-center justify-center" style="height: 60vh;">
						<div class="m-10 flex flex-col items-center justify-center text-center">
							<h1 class="mb-10 text-xl capitalize sm:text-2xl lg:text-3xl">
								Oops!!, No result found {#if data.category?.name} for "{data.category?.name}"{/if}
							</h1>

							<div class="mb-5">
								<img
									src="{noDataAvailable}"
									alt="no data available"
									class="h-60 w-auto object-contain text-xs" />
							</div>

							<p class="mb-5 text-center text-zinc-500">No data found</p>

							<PrimaryButton class="text-sm" on:click="{() => goto('/')}">
								Back to Home
							</PrimaryButton>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- MOBILE FOOTER -->

	<div class="block lg:hidden">
		<MobileFooter />
	</div>
</div>
