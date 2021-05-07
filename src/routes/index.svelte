<script context="module" lang="ts">
export async function load({ page: { host, path, params, query }, fetch }) {
	let banners = []
	try {
		const settings = await get(`settings`)
		banners = settings.data.banners.slider
	} catch (e) {}
	return { props: { banners } }
}
</script>

<script>
import { get } from '../util/api'
import Hero from '$lib/Hero.svelte'
import Product1 from '$lib/Product1.svelte'
import { onMount } from 'svelte'
export let banners,
	featuredProducts = null,
	hotProducts = null,
	shoppoProducts = null,
	loading

onMount(async () => {
	featuredProducts = await getFeatured()
	hotProducts = await getHot()
	shoppoProducts = await getShoppo()
})
async function getFeatured() {
	try {
		loading = true
		const x = await get(`products?featured=true`)
		return x
	} catch (e) {
		// console.log(e);
	} finally {
		loading = false
	}
}
async function getHot() {
	try {
		loading = true
		return await get(`products?hot=true`)
	} catch (e) {
		console.log('err...', e.toString())
	} finally {
		loading = false
	}
}
async function getShoppo() {
	try {
		loading = true
		return await get(`products?brandName=Adidas`)
	} catch (e) {
		console.log('err...', e.toString())
	} finally {
		loading = false
	}
}
</script>

<Hero banners="{banners}" />
{#if featuredProducts}
	<div class="my-3 max-w-max mx-auto">
		<a href="/search" class="flex items-center">
			<img src="https://img.icons8.com/plumpy/24/000000/geometry.png" alt="" />
			<h1 class="font-bold text-xl mx-4 lg:text-3xl tracking-wider py-5 text-gray-800">
				FEATURED PRODUCTS
			</h1>
			<img src="https://img.icons8.com/plumpy/24/000000/geometry.png" alt="" />
		</a>
	</div>
	<div class="flex overflow-x-auto py-2 pl-2 md:pl-6">
		{#each featuredProducts.data as p}
			{#if p}
				<Product1 product="{p}" />
			{/if}
		{/each}
	</div>
{/if}

{#if hotProducts}
	<div class="my-3 max-w-max mx-auto">
		<a href="/search" class="flex items-center">
			<img src="https://img.icons8.com/plumpy/24/000000/geometry.png" alt="" />
			<h1 class="font-bold text-xl mx-4 lg:text-3xl tracking-wider py-5 text-gray-800">
				HOT SELLING ITEMS
			</h1>
			<img src="https://img.icons8.com/plumpy/24/000000/geometry.png" alt="" />
		</a>
	</div>
	<div class="flex overflow-x-auto py-2 pl-2 md:pl-6">
		{#each hotProducts.data as p}
			{#if p}
				<Product1 product="{p}" />
			{/if}
		{/each}
	</div>
{/if}

{#if shoppoProducts}
	<div class="my-3 max-w-max mx-auto">
		<a href="/search" class="flex items-center">
			<img src="https://img.icons8.com/plumpy/24/000000/geometry.png" alt="" />
			<h1 class="font-bold text-xl mx-4 lg:text-3xl tracking-wider py-5 text-gray-800">
				ADDIDAS PRODUCTS
			</h1>
			<img src="https://img.icons8.com/plumpy/24/000000/geometry.png" alt="" />
		</a>
	</div>
	<div class="flex overflow-x-auto py-2 pl-2 md:pl-6">
		{#each shoppoProducts.data as p}
			{#if p}
				<Product1 product="{p}" />
			{/if}
		{/each}
	</div>
{/if}
