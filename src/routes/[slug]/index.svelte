<style>
.zoom {
	transition: transform 0.7s;
}
.zoom:hover {
	transform: scale(1.035);
}
</style>

<script context="module" lang="ts">
import { get } from '../../util/api'
import { lazyload } from './../../actions/lazyload'
import { authorInfo, CDN_URL, WWW_URL } from './../../../config'
import { currency } from '../../util'
import { addToCart } from '../../../store/cart'
import { me } from '../../../store/auth'
import { goto } from '$app/navigation'
import SEO from '$lib/components/SEO/index.svelte'
export async function load({ page: { host, path, params, query }, fetch }) {
	try {
		const id = query.get('id')
		if (!id) throw Error('Invalid product id')
		const product = await get(`products/${id}`)
		return {
			props: {
				product,
			},
		}
	} catch (e) {
		throw Error(e)
	}
}
</script>

<script>
me()
import Footer from '$lib/MobFooter.svelte'
export let product
console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', product.slug)
let CartButtonText = 'Add To Cart'
function addToBag(product) {
	addToCart({ pid: product._id, vid: product.variants[0]._id, qty: 1 })
	CartButtonText = 'Go To Cart'
	// goto('/cart')
}
const breadcrumbs = [
	{
		name: 'Home',
		slug: product.slug,
	},
]
const { author } = authorInfo
const entityMeta = {
	url: `${WWW_URL}/`,
	faviconWidth: 512,
	faviconHeight: 512,
	caption: author,
}
const seoProps = {
	entityMeta,
	breadcrumbs,
	title: product.name,
	metadescription: product.metaDescription,
	featuredImage: product.img,
	ogImage: product.img,
	ogSquareImage: product.img,
	twitterImage: product.img,
	name: product.name,
	description: product.description,
	price: product.price,
	image: product.img,
	createdAt: product.createdAt,
	updatedAt: product.updatedAt,
	sku: product.sku,
	id: product._id,
	slug: product.slug,
	gtin: product.gtin,
	brand: product.brand,
	ratingCount: product.ratingCount,
	ratingValue: product.ratingValue,
	popularity: product.popularity,
}
</script>

<SEO {...seoProps} />

<section class="min-h-screen bg-gray-100 cursor-default md:py-10 md:px-5 lg:px-10 xl:px-20">
	<div class="px-8 pt-8 bg-white md:mx-10 md:flex md:space-x-5 lg:space-x-10 group">
		<!-- Image section start  -->
		<div class="relative md:w-1/2 md:mb-auto">
			<a href="/search" class="absolute mt-2 ml-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="block w-5 h-5 transform cursor-pointer md:hidden hover:scale-110"
					viewBox="0 0 20 20"
					fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"></path>
				</svg>
			</a>

			<!-- <svg
				xmlns="http://www.w3.org/2000/svg"
				class="absolute right-0 block w-6 h-6 mt-2 mr-16 transform cursor-pointer md:hidden hover:scale-110"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
				></path>
			</svg>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="absolute right-0 block w-6 h-6 mt-2 mr-2 transform cursor-pointer md:hidden hover:scale-110"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
				></path>
			</svg> -->

			<div>
				<img
					use:lazyload
					src="{`${CDN_URL}/${product?.img && product?.img[0]}?tr=w-3,h-3`}"
					data-src="{`${CDN_URL}/${product?.img && product?.img[0]}`}"
					alt=""
					class="object-cover object-top w-full mx-auto bg-white zoom md:h-auto" />
			</div>
			<!-- <div class="absolute flex items-center space-x-4 transform -translate-x-10 bottom-5 left-1/2">
				<div class="w-2 h-2 transform bg-black border rounded-full cursor-pointer hover:scale-150">
				</div>
				<div class="w-2 h-2 transform bg-white border rounded-full cursor-pointer hover:scale-150">
				</div>
				<div class="w-2 h-2 transform bg-white border rounded-full cursor-pointer hover:scale-150">
				</div>
				<div class="w-2 h-2 transform bg-white border rounded-full cursor-pointer hover:scale-150">
				</div>
			</div> -->
		</div>
		<!-- Image section end -->
		<!-- Text section start  -->
		<div class="m-2 mt-5 md:w-1/2 md:m-0 md:mt-0">
			<div class="">
				<!-- Brand name start  -->

				<h2 class="text-sm font-semibold md:text-xl">
					{product?.vendor_name}
				</h2>

				<!-- Brand name end -->
				<!-- Product name with price start -->
				<div class="">
					<h5 class="flex-1 mr-5 font-serif text-lg md:text-xl font-">
						{product?.name}
					</h5>
					<h5 class="mt-5 text-lg font-bold md:text-3xl min-w-max">
						{currency(product?.price)}
					</h5>
					<p class="hidden mt-2 mb-4 text-xs text-gray-400 md:block">
						Price inclusive of all taxes
					</p>
				</div>
				<!-- Product name with price end -->
				<div class="flex items-center space-x-5 text-sm font-semibold text-gray-400">
					{#if product?.stock < 10}
						<div class="flex items-center space-x-2 ">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
							<span>Low in Stock</span>
						</div>
					{/if}
					<div class="flex items-center space-x-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-4 h-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
							></path>
						</svg>
						<span>30 Days Return</span>
					</div>
				</div>
			</div>
			<!-- Product details start  -->
			<!-- <div
				class="flex items-center justify-between pb-2 mt-5 border-b border-gray-300 shadow-sm md:hidden ">
				<h5 class="font-semibold tracking-wide">Product details</h5>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-6 h-6 cursor-pointer"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
					></path>
				</svg>
			</div> -->

			<!-- Product details end -->
			<!-- Sizing start  -->
			<!-- <div
				class="flex items-center justify-between pb-2 mt-5 border-b border-gray-300 shadow-sm md:hidden ">
				<h5 class="font-semibold tracking-wide">Sizing</h5>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-6 h-6 cursor-pointer"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
					></path>
				</svg>
			</div> -->
			<!-- Sizing end -->
			<!-- Add to cart section start  -->
			<div class="flex flex-wrap items-center justify-between mt-10">
				<div class="flex flex-wrap items-center justify-between space-x-2">
					<!-- <div class="flex items-center space-x-2">
						<div class="flex border border-gray-400 space-x-1 p-2.5 rounded-md items-center">
							<div class="w-4 h-4 bg-blue-900"></div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-4 h-4 text-gray-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"></path>
							</svg>
						</div>
						<div class="flex border border-gray-400 space-x-1 px-2 py-1.5 rounded-md items-center">
							<div class="font-bold ">S</div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-4 h-4 text-gray-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"></path>
							</svg>
						</div>
					</div> -->

					{#if product?.color}
						<div class="flex items-center my-2 space-x-1 md:justify-center">
							<span class="text-sm font-medium md:text-base">Color:</span>
							<h2 class="ml-1 text-lg font-semibold whitespace-nowrap">
								{product?.color?.name}
							</h2>
						</div>
					{/if}
				</div>
				<!-- Add to cart start -->
				<div class="w-full my-5 xl:w-60">
					{#if CartButtonText == 'Add To Cart'}
						<button
							on:click="{() => addToBag(product)}"
							class="font-semibold tracking-wide text-white transform  rounded-md bg-gray-800 py-2 w-full hover:scale-105 focus:outline-none">
							<span>
								{CartButtonText}
							</span>
						</button>
					{:else}
						<a
							href="/cart"
							class="block text-center bg-purple-800 py-2 w-full font-semibold tracking-wide text-white transform  rounded-md hover:scale-105 focus:outline-none">
							<span>
								{CartButtonText}
							</span>
						</a>
					{/if}
				</div>
				<!-- Add to cart end -->
			</div>
			<!-- Add to cart section end -->

			<div class="hidden my-5 md:block">
				<div class="pb-2 text-lg font-semibold ">Product Details -</div>
				{@html product?.description}
			</div>
		</div>
	</div>
</section>
<div class="block md:hidden"></div>
