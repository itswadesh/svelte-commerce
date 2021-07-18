<style>
.zoom {
	transition: transform 0.7s;
}
.zoom:hover {
	transform: scale(1.035);
}
</style>

<script>
import { lazyload } from './../actions/lazyload'
import { currency } from '../util'
import { CDN_URL } from './../../config'
export let product = {}
</script>

<div class="justify-start w-40 mb-2 mr-2 rounded-lg group md:mb-8 md:w-72">
	<a
		href="{'/' + product.slug + '?id=' + product._id}"
		class="block overflow-hidden rounded-lg hover:shadow-lg">
		<img
			alt=""
			use:lazyload
			src="{`${CDN_URL}/${product.img && product.img[0]}?tr=w-3,h-3`}"
			data-src="{`${CDN_URL}/${product.img && product.img[0]}`}"
			class="object-cover object-top w-full h-40 pt-2 rounded-lg hover:rounded-b-none md:h-72 zoom"
			style="" />
		<div class="p-2 text-left md:p-4">
			<!-- {#if product.brandName} -->
				<h4 class="text-sm font-semibold ">
					{product.brandName || '_'}
				</h4>
				<!-- {:else}
				<h4 class="text-sm font-semibold ">
					{product.brandName}
				</h4>
			{/if} -->
			<h2
				href="{'/' + product.slug + '?id=' + product._id}"
				class="mt-1 font-medium leading-tight tracking-tight md:text-xl line-clamp-2 md:font-semibold ">
				{product.name}
			</h2>
			<div class="flex flex-wrap items-center justify-start mt-1">
				<span class="mr-1 text-sm font-semibold text-gray-600 max-w-max md:text-lg md:mr-5">
					{currency(product.price)}
				</span>
				<span class="mr-1 text-xs text-gray-400 line-through max-w-max md:text-base md:mr-5">
					{currency(product.mrp)}
				</span>
				{#if Math.floor(100 - (product.price * 100) / product.mrp)>0}
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
