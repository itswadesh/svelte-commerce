<style>
.zoom {
	overflow: hidden;
}
.zoom img {
	transition: transform 0.7s;
}
.zoom:hover img {
	transform: scale(1.035);
}
</style>

<script>
import { lazyload } from './../actions/lazyload'
import { currency } from '../util'
import { CDN_URL } from './../../config'
export let product = {}

let avatar = [
	{ img: '/img/avatar-s-7.cb1b1e65.jpg' },
	{ img: '/img/avatar-s-6.0f4533ab.jpg' },
	{ img: '/img/avatar-s-20.32972323.jpg' },
]
</script>

<div
	class="flex-shrink-0 w-72 mb-2 mr-2 rounded-lg group md:mb-8 zoom bg-white shadow-md hover:shadow-lg">
	<a
		href="{'/' + product.slug + '?id=' + product._id}"
		class="block overflow-hidden rounded-lg hover:shadow-lg">
		<div class="zoom">
			<img
				alt=""
				use:lazyload
				src="{`${CDN_URL}/${product.img && product.img[0]}?tr=w-3,h-3`}"
				data-src="{`${CDN_URL}/${product.img && product.img[0]}`}"
				class="object-cover object-top w-full h-40 pt-2 rounded-t-lg  md:h-72 zoom"
				style="" />
		</div>

		<div class="p-2 text-left md:p-4">
			<div class="flex items-center justify-between space-x-2">
				<div class="flex items-center justify-start space-x-2">
					<h4 class="text-lg font-semibold ">
						{product.brandName || '_'}
					</h4>

					<button
						class="bg-gradient-to-br from-primary-500 to-success-500 text-white font-medium tracking-wide text-xs py-0.5 px-3 rounded-full focus:outline-none"
						>assured</button>

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
			</div>

			<h2
				href="{'/' + product.slug + '?id=' + product._id}"
				class="mt-1 text-gray-400  leading-tight tracking-wide text-sm line-clamp-2 md:font-semibold ">
				{product.name}
			</h2>
			<div class="flex flex-wrap items-center justify-start mt-1">
				<span class="mr-1 text-sm font-semibold text-gray-600 max-w-max md:text-lg md:mr-5">
					{currency(product.price)}
				</span>
				<span class="mr-1 text-xs text-gray-400 line-through max-w-max md:text-base md:mr-5">
					{currency(product.mrp)}
				</span>
				{#if Math.floor(100 - (product.price * 100) / product.mrp) > 0}
					<span class="mr-1 text-sm text-green-500 max-w-max md:text-base md:mr-5">
						{Math.floor(100 - (product.price * 100) / product.mrp)}% off
					</span>
				{/if}
				{#if product.stock < 1}
					<div class="text-xs text-red-500">Out of stock</div>
				{/if}
			</div>
			<!-- <h5 class="mt-1 space-x-1 text-xs font-semibold text-gray-400 md:text-sm">
				<span> XS </span> <span> S </span> <span> M </span> <span> L </span>
				<span> XL </span>
				<span> XXL </span>
			</h5> -->
		</div>
	</a>
</div>
