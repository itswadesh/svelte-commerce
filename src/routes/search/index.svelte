<style>
.frosted {
	backdrop-filter: blur(15px);
	background-color: hsla(0, 0%, 100%, 0.75);
}
</style>

<script context="module">
import { get } from '../../util/api'
export async function load({ page: { host, path, params, query }, fetch }) {
	let q = query.toString()
	const page = +query.get('page')
	const products = await get(`products/es?${q}`)
	const facets = products?.facets?.all_aggs

	return {
		props: {
			page,
			products,
			facets,
			query: q,
		},
	}
}
</script>

<script>
import { goto } from '$app/navigation'
import { constructQry, constructURL2 } from '../../util'
import { sorts } from './../../../config'
import Product from '$lib/Product.svelte'
import Pagination from './_Pagination.svelte'
import ProductSkeleton from './_ProductSkeleton.svelte'
import HeaderBody from './_HeaderBody.svelte'
import NoProduct from './_NoProduct.svelte'
import DesktopFilters from './_DesktopFilters.svelte'
import MobileFilters from './_MobileFilters.svelte'
export let page, products, facets, query
const PAGE_SIZE = 30
let showMobileFilter = false,
	category = {},
	productCount = 0,
	pageSize = 10,
	currentPage = 1,
	loading = false,
	searchQuery
// $: start = 1 + (page - 1) * PAGE_SIZE;
// $: next = `/search?page=${+page + 1}`;
// $: prev = `/search?page=${+page - 1}`;
//   $: noOfPages = Math.ceil(productCount / 24)
function changePage(e, p) {
	let fl = { ...query }
	delete fl.page
	const url = constructURL2('/search', fl)
	let page = parseInt(e.detail || 1)
	goto(`${url}page=${page}`)
	// scrollToTop();
}
function toggle(e) {
	showMobileFilter = e.detail
}
// async function getData(query) {
//   return await get(`electronics/es?page=${p}`);
// }
// onMount(async (s)=>{
// 	products=await	getData()
// })

// page.subscribe(page => {
// 	query = page.query
// 	if (query.q == undefined) query.q = ''
// 	getData(query)
// })
</script>

<svelte:head>
	<title>Svelte Ecommerce</title>
	<meta name="description" content="Latest Ecommerce Stack" />
</svelte:head>
{#if showMobileFilter}
	<MobileFilters facets="{facets}" on:hide="{toggle}" />
{:else}
	<div class="flex ">
		<DesktopFilters facets="{facets}" query="{query}" />
		<div class="w-full">
			<HeaderBody
				searchQuery="{searchQuery}"
				count="{products.count}"
				on:hide="{() => (showMobileFilter = !showMobileFilter)}" />
			{#if loading}
				<div class="flex flex-wrap">
					{#each { length: 15 } as _, i}
						<ProductSkeleton />
					{/each}
				</div>
			{:else if !products || !products.data || !products.data.length}
				<NoProduct />
			{:else if products && products.data && products.data.length > 0}
				<div class="flex flex-wrap justify-between">
					{#each products.data as p}
						{#if p}
							<Product product="{p}" />
						{/if}
					{/each}
				</div>
			{/if}
			<Pagination
				count="{products.pageSize}"
				current="{parseInt(page || 1)}"
				on:change="{changePage}" />
		</div>
		<div class="mt-20 lg:hidden">
			<div class="fixed bottom-0 w-full py-2 text-center frosted">
				<span class="font-bold ">{products.count}</span> products
			</div>
		</div>
	</div>
{/if}
