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
import SEO from '$lib/components/SEO/index.svelte'
const seoProps = {
	title: 'Search-Products',
	metadescription: 'Search your products',
}
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

<SEO {...seoProps} />

<div>
	<Hero banners="{banners}" />
</div>
{#if featuredProducts}
	<div class="px-2 pt-5">
		<div class="flex flex-row items-center justify-between">
			<a href="/search" class="font-bold text-lg lg:text-3xl tracking-wider text-gray-800">
				Trending Products
			</a>
			<a href="##" class="text-sm text-gray-500 hover:text-primary-500 sm:mr-2">See all (45)</a>
		</div>

		<div class="w-full flex items-start justify-start overflow-x-auto mt-5">
			{#each featuredProducts.data as p}
				{#if p}
					<Product1 product="{p}" />
				{/if}
			{/each}
		</div>
	</div>
{/if}

{#if hotProducts}
	<div class="px-2 pt-1">
		<div class="flex flex-row items-center justify-between">
			<a href="/search" class="font-bold text-lg lg:text-3xl tracking-wider text-gray-800">
				Hot Selling Items
			</a>
			<a href="##" class="text-sm text-gray-500 hover:text-primary-500 sm:mr-2">See all (45)</a>
		</div>

		<div class="flex overflow-x-auto mt-5">
			{#each hotProducts.data as p}
				{#if p}
					<Product1 product="{p}" />
				{/if}
			{/each}
		</div>
	</div>
{/if}

{#if shoppoProducts}
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
					<Product1 product="{p}" />
				{/if}
			{/each}
		</div>
	</div>
{/if}
