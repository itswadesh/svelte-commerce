<script context="module" lang="ts">
export async function load({ url, params, fetch }) {
	let banners = []
	// try {
	// const settings = await get(`settings`)
	// 	banners = settings.data.banners.slider
	// } catch (e) {}
	return { props: { banners } }
}
</script>

<script>
import Hero from '$lib/Hero.svelte'
// import SEO from '$lib/components/SEO/index.svelte'
import { KQL_Home, KQL_Products } from '$lib/graphql/_kitql/graphqlStores'
import { onMount } from 'svelte'
import ProductCard from '$lib/components/_ProductCard.svelte'
import { store } from './../util'
import CategoriesHome from '$lib/components/_CategoriesHome.svelte'
import Errors from '$lib/components/alerts/Errors.svelte'
import HeroBanners from '$lib/HeroBanners.svelte'
const seoProps = {
	title: 'Search-Products',
	metadescription: 'Search your products'
}
export let banners,
	featuredProducts = null,
	hotProducts = null,
	shoppoProducts = null,
	loading

let heroBanners

onMount(async () => {
	KQL_Home.query({ variables: { store: store.id } })
	// featuredProducts = await getFeatured()
	// hotProducts = await getHot()
	// shoppoProducts = await getShoppo()
})
// async function getFeatured() {
// 	try {
// 		loading = true
// 		const x = (await KQL_Products.query({ variables: { popular: true } })).data.products
// 		return x
// 	} catch (e) {
// 	} finally {
// 		loading = false
// 	}
// }
// async function getHot() {
// 	try {
// 		loading = true
// 		return (await KQL_Products.query({ variables: { hot: true } })).data.products
// 	} catch (e) {
// 		console.log('err...', e.toString())
// 	} finally {
// 		loading = false
// 	}
// }
// async function getShoppo() {
// 	try {
// 		loading = true
// 		return (await KQL_Products.query({ variables: { q: 'shoppo' } })).data.products
// 	} catch (e) {
// 		console.log('err...', e.toString())
// 	} finally {
// 		loading = false
// 	}
// }
</script>

<!-- <SEO {...seoProps} /> -->
<div>
	<Hero banners="{$KQL_Home.data?.banners.data}" />
</div>

<!-- {JSON.stringify($KQL_Home.data?.categories.data)} -->

<CategoriesHome loading="{$KQL_Home.isFetching}" categories="{$KQL_Home.data?.categories.data}" />
<div class="px-3 py-5 sm:p-10 md:py-20 bg-white">
	<div class="container mx-auto max-w-6xl">
		{#if $KQL_Home?.isFetching}
			<div class="grid grid-cols-2 md:grid-cols-4 items-center gap-2">
				<div class="col-span-2 h-40 sm:h-60 bg-gray-300 rounded-md animate-pulse"></div>

				<div class="col-span-2 h-40 sm:h-60 bg-gray-300 rounded-md animate-pulse"></div>

				<div class="col-span-1 h-40 sm:h-60 bg-gray-300 rounded-md animate-pulse"></div>

				<div class="col-span-1 h-40 sm:h-60 bg-gray-300 rounded-md animate-pulse"></div>

				<div class="col-span-2 h-40 sm:h-60 bg-gray-300 rounded-md animate-pulse"></div>
			</div>
		{:else if $KQL_Home?.errors}
			<Errors errors="{$KQL_Home?.errors}" />
		{:else if $KQL_Home?.data?.banners.count > 0}
			<HeroBanners heroBanners="{$KQL_Home?.data?.banners.data}" />
		{/if}
	</div>
</div>
{#if $KQL_Home.data?.popular}
	<div class="px-2 pt-5">
		<div class="flex flex-row items-center justify-between">
			<a href="/search" class="font-bold text-lg lg:text-3xl tracking-wider text-gray-800">
				Popular Products
			</a>
			<a href="##" class="text-sm text-gray-500 hover:text-primary-500 sm:mr-2">See all </a>
		</div>
		<div
			class="w-full flex items-start flex-wrap justify-start overflow-x-auto mt-5 container mx-auto">
			{#each $KQL_Home.data?.popular?.data as p}
				{#if p}
					<ProductCard product="{p}" class="w-1/2 md:w-1/3 lg:w-1/5 px-1 mb-2" />
				{/if}
			{/each}
		</div>
	</div>
{/if}

<!-- {#if $KQL_Home.data?.trending}
	<div class="px-2 pt-1">
		<div class="flex flex-row items-center justify-between">
			<a href="/search" class="font-bold text-lg lg:text-3xl tracking-wider text-gray-800">
				Trending Items
			</a>
			<a href="##" class="text-sm text-gray-500 hover:text-primary-500 sm:mr-2">See all </a>
		</div>

		<div class="flex overflow-x-auto mt-5">
			{#each $KQL_Home.data?.trending.data as p}
				{#if p}
					<ProductCard product="{p}" />
				{/if}
			{/each}
		</div>
	</div>
{/if} -->

<!-- {#if shoppoProducts}
	<div class="px-2 pt-1">
		<div class="flex flex-row items-center justify-between">
			<a href="/search" class="font-bold text-lg lg:text-3xl tracking-wider text-gray-800">
				Addidas Products
			</a>
			<a href="##" class="text-sm text-gray-500 hover:text-primary-500 sm:mr-2">See all (45)</a>
		</div>

		<div class="flex overflow-x-auto mt-5">
			{#each shoppoProducts.data as p}
				{#if p}
					<ProductCard product="{p}" />
				{/if}
			{/each}
		</div>
	</div>
{/if} -->
