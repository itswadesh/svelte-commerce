<style>
/* .zoom {
	overflow: hidden;
}
.zoom img {
	transition: transform 0.7s;
}
.zoom:hover img {
	transform: scale(1.035);
} */
.trans {
	transition: width 0.3s;
	overflow: hidden;
	justify-content: start;
	padding-left: 2px;
}
.trans:hover {
	width: 130px;
	padding-left: 0px;
	justify-content: center;
}
</style>

<script>
import { lazyload } from './../actions/lazyload'
import { currency } from '../util'
import { CDN_URL } from './../../config'
export let product = {}

let show
function showitems() {
	show = true
}
function hideitems() {
	show = false
}

let avatar = [
	{ img: '/img/avatar-s-7.cb1b1e65.jpg' },
	{ img: '/img/avatar-s-6.0f4533ab.jpg' },
	{ img: '/img/avatar-s-20.32972323.jpg' },
]
</script>

<div
	class="flex-shrink-0 w-52 mb-4 mr-4 group  hover:bg-white hover:shadow-md text-gray-800"
	on:mouseenter="{showitems}"
	on:mouseleave="{hideitems}">
	<a
		href="{'/' + product.slug + '?id=' + product._id}"
		class="block overflow-hidden hover:shadow-lg">
		<div class="">
			<img
				alt=""
				use:lazyload
				src="{`${CDN_URL}/${product.img && product.img[0]}?tr=w-3,h-3`}"
				data-src="{`${CDN_URL}/${product.img && product.img[0]}`}"
				class="object-cover object-top w-full h-72  bg-black "
				style="" />
		</div>

		<div class="p-4 ">
			<!-- <div class="flex items-center justify-between space-x-2">
				<div class="flex items-center justify-start space-x-2">
					<h4 class="text-lg font-semibold ">
						{product.brandName || '_'}
					</h4>

					<button
						class="bg-gradient-to-br from-primary-500 to-success-500 text-white font-medium tracking-wide text-xs py-0.5 px-3 rounded-full focus:outline-none"
						>assured</button>
				</div>

				<div class="flex flex-row ">
					{#each avatar as a, i}
						<img
							src="{a.img}"
							alt="name"
							width="48"
							height="48"
							class="-ml-4 bg-gray-100 border-2 border-white rounded-full  w-7 h-7 " />
					{/each}
				</div>
			</div> -->

			{#if show}
				<div class="-mt-12">
					<!-- View smilar button start-->
					<a href="{`/search?brand=${product.brandName}`}" class="flex justify-end">
						<div
							class="flex items-center bg-white text-primary-500 h-7 w-7 rounded-full border border-primary-500 trans">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 flex-shrink-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
								></path>
							</svg>
							<span class="ps-2 text-xs whitespace-nowrap">View similar</span>
						</div>
					</a>
					<!-- View smilar button end-->
					<!-- Wishlist start-->
					<button
						class="mt-3.5 py-1 w-full border border-gray-300  flex items-center justify-center space-x-2 focus:outline-none ">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-gray-500 "
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
							></path>
						</svg><span class="text-sm font-semibold ">WISHLIST</span>
					</button>
					<!-- Wishlist end-->
					<!-- Size chart start-->
					<div class="mt-1.5 flex items-baseline justify-start">
						<h5 class="mr-1 text-sm">Sizes:</h5>
						<h5 class="space-x-1 text-xs font-medium text-gray-500 flex items-baseline ">
							{#each product.variants as v, i}
								<div>{v.size}</div>
							{/each}
						</h5>
					</div>
					<!-- Size chart end-->
				</div>
			{:else}
				<div>
					<h4 class="font-semibold mb-1.5">
						{product.brandName || '_'}
					</h4>

					<h2
						href="{'/' + product.slug + '?id=' + product._id}"
						class="text-sm font-medium overflow-hidden whitespace-nowrap overflow-ellipsis">
						{product.name}
					</h2>
				</div>
			{/if}

			<div class="mt-2.5 mb-1.5 leading-4 flex items-baseline justify-start ">
				<span class="mr-1 text-sm font-semibold whitespace-nowrap ">
					{currency(product.price)}
				</span>
				<span class="ml-1 text-xs text-gray-500 whitespace-nowrap line-through">
					{currency(product.mrp)}
				</span>
				{#if Math.floor(100 - (product.price * 100) / product.mrp) > 0}
					<span class="ml-1 text-xs text-green-500 whitespace-nowrap">
						( {Math.floor(100 - (product.price * 100) / product.mrp)}% off )
					</span>
				{/if}
				{#if product.stock < 1}
					<div class="text-xs text-red-500">Out of stock</div>
				{/if}
			</div>
		</div>
	</a>
</div>
