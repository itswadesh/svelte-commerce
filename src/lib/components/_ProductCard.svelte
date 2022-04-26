<script>
import ImageLoader from './Image/ImageLoader.svelte'

export let product

let clazz = ''

export { clazz as class }
</script>

{#if product && (product.stock > 0 || product.isUnlimited)}
	<a href="/{product.slug}" class="{clazz} relative w-full text-gray-800 group">
		{#if product.new}
			<div
				class="absolute top-1 left-1 z-10 py-0.5 px-1 bg-red-500 text-xs text-white font-semibold tracking-wider rounded shadow-md">
				NEW
			</div>
		{/if}

		<div class="mb-4 h-60 w-full">
			<ImageLoader
				src="{product.imgCdn}"
				alt="{product.name}"
				class="w-full h-full object-contain rounded" />
		</div>

		<div class="w-full">
			{#if product.brand}
				<h5 class="mb-1"><b>{product.brand}</b></h5>
			{/if}

			<div class="mb-1 {product.foodType ? 'flex items-start gap-2' : ''}">
				<h6 class="flex-1 text-sm line-clamp-2 group-hover:underline">{product.name}</h6>

				{#if product.foodType}
					<div class="mt-0.5 flex-shrink-0">
						{#if product.foodType === 'V'}
							<ImageLoader
								src="/product/veg.png"
								alt="veg"
								class="h-5 object-contain object-left-top" />
						{:else if product.foodType === 'N'}
							<ImageLoader
								src="/product/non-veg.png"
								alt="veg"
								class="h-5 object-contain object-left-top" />
						{:else}
							<ImageLoader
								src="/product/other.png"
								alt="veg"
								class="h-5 object-contain object-left-top" />
						{/if}
					</div>
				{/if}
			</div>

			{#if product.stock === 5}
				<span class="text-xs font-medium text-red-500">Only few qty left!!</span>
			{/if}

			<div class="flex items-center gap-2">
				<span class="font-semibold">${product.price}</span>

				<span class="text-sm text-gray-500"><strike>${product.mrp}</strike></span>

				<span class="text-sm text-green-500">
					({Math.floor(100 - (product.price * 100) / product.mrp)}%)
				</span>
			</div>
		</div>
	</a>
{/if}
