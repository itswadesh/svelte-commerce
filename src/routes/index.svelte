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
import { GQL_HOME, GQL_Products } from '$houdini'
import { onMount } from 'svelte'
import ProductCard from '$lib/components/_ProductCard.svelte'
import { store } from '$lib/util'
import CategoriesHome from '$lib/components/_CategoriesHome.svelte'
import Errors from '$lib/components/alerts/Errors.svelte'
import HeroBanners from '$lib/HeroBanners.svelte'
import SEO from '$lib/components/SEO/index.svelte'
const seoProps = {
	title: 'Svelte Commerce',
	metadescription: 'Svelte Commerce as frontend and Misiki.io in backend '
}
export let banners,
	featuredProducts = null,
	hotProducts = null,
	shoppoProducts = null,
	loading

let heroBanners

onMount(async () => {
	GQL_HOME.fetch({ variables: { store: store?.id } })
	// featuredProducts = await getFeatured()
	// hotProducts = await getHot()
	// shoppoProducts = await getShoppo()
})
// async function getFeatured() {
// 	try {
// 		loading = true
// 		const x = (await GQL_Products.fetch({ variables: { popular: true } })).data.products
// 		return x
// 	} catch (e) {
// 	} finally {
// 		loading = false
// 	}
// }
// async function getHot() {
// 	try {
// 		loading = true
// 		return (await GQL_Products.fetch({ variables: { hot: true } })).data.products
// 	} catch (e) {
// 		console.log('err...', e.toString())
// 	} finally {
// 		loading = false
// 	}
// }
// async function getShoppo() {
// 	try {
// 		loading = true
// 		return (await GQL_Products.fetch({ variables: { q: 'shoppo' } })).data.products
// 	} catch (e) {
// 		console.log('err...', e.toString())
// 	} finally {
// 		loading = false
// 	}
// }
</script>

<SEO {...seoProps} />

<div>
	<Hero banners="{$GQL_HOME.data?.banners.data}" />
</div>

<!-- {JSON.stringify($GQL_HOME.data?.categories.data)} -->

<CategoriesHome loading="{$GQL_HOME.isFetching}" categories="{$GQL_HOME.data?.categories.data}" />
<div class="bg-white px-3 py-5 sm:p-10 md:py-20">
	<div class="container mx-auto max-w-6xl">
		{#if $GQL_HOME?.isFetching}
			<div class="grid grid-cols-2 items-center gap-2 md:grid-cols-4">
				<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-1 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-1 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>
			</div>
		{:else if $GQL_HOME?.errors}
			<Errors errors="{$GQL_HOME?.errors}" />
		{:else if $GQL_HOME?.data?.banners.count > 0}
			<HeroBanners heroBanners="{$GQL_HOME?.data?.banners.data}" />
		{/if}
	</div>
</div>
{#if $GQL_HOME.data?.popular}
	<div class="px-2 pt-5">
		<div class="flex flex-row items-center justify-between">
			<a href="/search" class="text-lg font-bold tracking-wider text-gray-800 lg:text-3xl">
				Popular Products
			</a>
			<a href="##" class="text-sm text-gray-500 hover:text-primary-500 sm:mr-2">See all </a>
		</div>
		<div
			class="container mx-auto mt-5 flex w-full flex-wrap items-start justify-start overflow-x-auto">
			{#each $GQL_HOME.data?.popular?.data as p}
				{#if p}
					<ProductCard product="{p}" class="mb-2 w-1/2 px-1 md:w-1/3 lg:w-1/5" />
				{/if}
			{/each}
		</div>
	</div>
{/if}

<!-- {#if $GQL_HOME.data?.trending}
	<div class="px-2 pt-1">
		<div class="flex flex-row items-center justify-between">
			<a href="/search" class="font-bold text-lg lg:text-3xl tracking-wider text-gray-800">
				Trending Items
			</a>
			<a href="##" class="text-sm text-gray-500 hover:text-primary-500 sm:mr-2">See all </a>
		</div>

		<div class="flex overflow-x-auto mt-5">
			{#each $GQL_HOME.data?.trending.data as p}
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
