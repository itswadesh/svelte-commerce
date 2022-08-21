<style>
.frosted {
	backdrop-filter: blur(15px);
	background-color: hsla(0, 0%, 100%, 0.75);
}
</style>

<script>
import { goto } from '$app/navigation'
import { constructQry, constructURL2 } from '$lib/util'
import { sorts } from '$lib/config'
import Product from '$lib/Product.svelte'
// import Pagination from './_Pagination.svelte'
// import ProductSkeleton from './_ProductSkeleton.svelte'
// import HeaderBody from './_HeaderBody.svelte'
// import NoProduct from './_NoProduct.svelte'
// import DesktopFilters from './_DesktopFilters.svelte'
// import MobileFilters from './_MobileFilters.svelte'
import SEO from '$lib/components/SEO/index.svelte'

export let data
let { page, products, facets, query } = data
$: ({ page, products, facets, query } = data)

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

<section class="w-full text-gray-800 lg:my-32 lg:px-20">
	<!-- Nav bar start -->
	<nav
		class="frosted fixed flex w-full justify-between border-b border-gray-400 p-2 shadow md:hidden">
		<a href="/">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
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
			class="h-6 w-6"
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

	<div class="mt-24 flex w-full">
		<div class="mr-5 hidden lg:block">
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
			<div class="w-full border-b py-0.5 ">
				<div class="flex items-center justify-between p-4 ">
					<div class="whitespace-nowrap text-sm text-gray-400 sm:font-medium md:text-base ">
						<span>589 items found</span>
					</div>
					<div class="flex items-center space-x-1">
						<h5 class="whitespace-nowrap text-xs text-gray-400 sm:font-medium md:text-base">
							SORT BY
						</h5>
						<select
							class="h-7 w-32 border border-gray-500 pt-0 font-semibold focus:outline-none md:h-full md:w-44 md:p-1"
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

			<div class="mx-2 mt-5 mb-12 flex flex-wrap">
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
