<style>
.frosted {
	backdrop-filter: blur(15px);
	background-color: hsla(0, 0%, 100%, 0.75);
}
</style>

<script context="module">
export async function load({ url, params, fetch }) {
	let q = url.searchParams.gelAll().toString()
	const page = +url.searchParams.get('page')
	const products = await get(`products/es?${q}`)
	const facets = products.facets.all_aggs

	return {
		props: {
			page,
			products,
			facets,
			query: q
		}
	}
}
</script>

<script>
import { goto } from '$app/navigation'
import { constructQry, constructURL2 } from '../../../util'
import { sorts } from '$lib/config'
import Product from '$lib/Product.svelte'
// import Pagination from './_Pagination.svelte'
// import ProductSkeleton from './_ProductSkeleton.svelte'
// import HeaderBody from './_HeaderBody.svelte'
// import NoProduct from './_NoProduct.svelte'
// import DesktopFilters from './_DesktopFilters.svelte'
// import MobileFilters from './_MobileFilters.svelte'
import SEO from '$lib/components/SEO/index.svelte'

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

const seoProps = {
	title: 'Search-Product',
	metadescription: 'search what you want'
}
</script>

<SEO {...seoProps} />

<section class="w-full text-gray-800 lg:px-20 lg:my-32">
	<!-- Nav bar start -->
	<nav
		class="fixed flex justify-between w-full p-2 border-b border-gray-400 shadow md:hidden frosted">
		<a href="/">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="w-6 h-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
			</svg>
		</a>
		<h4 class="font-bold tracking-wide">Hoodies</h4>

		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="w-6 h-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 6h16M4 12h16M4 18h16"></path>
		</svg>
	</nav>
	<!-- Nav bar end -->

	<div class="flex w-full mt-24">
		<div class="hidden mr-5 lg:block">
			<!-- <DesktopFilters facets="{facets}" query="{query}" /> -->
		</div>

		<div class="w-full">
			<!-- Heading start  -->
			<!-- <header class="hidden font-serif text-4xl text-center md:block">
				<span>Search result </span>
			</header> -->
			<!-- Heading end -->

			<!-- No result section start  -->
			<div class="hidden pt-12 text-center">
				<h2 class="font-bold">
					<span class="text-sm font-medium text-gray-600">No result's for </span> "adids"
				</h2>
			</div>
			<!-- No result section end -->
			<div class="w-full py-0.5 border-b ">
				<div class="flex items-center justify-between p-4 ">
					<div class="text-sm text-gray-400 md:text-base whitespace-nowrap sm:font-medium ">
						<span>589 items found</span>
					</div>
					<div class="flex items-center space-x-1">
						<h5 class="text-xs text-gray-400 md:text-base whitespace-nowrap sm:font-medium">
							SORT BY
						</h5>
						<select
							class="w-32 pt-0 font-semibold border border-gray-500 h-7 md:h-full md:w-44 md:p-1 focus:outline-none"
							name=""
							id="">
							<option value="">Relevance</option>
							<option value="">Price(lowest first)</option>
							<option value="">Price(heighest first)</option>
							<option value="">What.s New</option>
							<option value="">Discount</option>
						</select>
					</div>
				</div>
			</div>

			<!-- Result section start  -->

			<div class="flex flex-wrap mx-2 mt-5 mb-12">
				{#each products.data as p}
					{#if p}
						<Product product="{p}" />
					{/if}
				{/each}
			</div>

			<div class="mb-10">
				<!-- <Pagination
					count="{products.pageSize}"
					current="{parseInt(page || 1)}"
					on:change="{changePage}" /> -->
			</div>

			<!-- Result section end -->
		</div>
	</div>
</section>
