<script lang="ts">
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import { currency } from '$lib/utils/index.js'

export let product: any = {}
</script>

<div class="mx-auto flex w-full max-w-md flex-col rounded-lg border shadow-md">
	<div class="flex-shrink-0">
		{#if product?.img}
			<a href="/products/{product.product_id}" class="text-xl font-bold">
				<LazyImg
					height="{64}"
					class="h-36 w-full object-cover rounded"
					src="{product?.img}"
					alt="Product image" />
			</a>
		{/if}
	</div>

	<div class="px-2 py-2">
		{#if product.name}
			<div class="flex items-center justify-between gap-2 text-xs">
				<div>{currency(product.price)}</div>
				{#if product.type == 'NON-VEG'}
					<img src="/non-veg.png" alt="Non-Veg" class="h-4 w-4" />
				{:else}
					<img src="/veg.png" alt="Veg" class="h-4 w-4" />
				{/if}
			</div>
		{/if}
	</div>
	<div class="px-2 pb-2">
		<div class="flex items-center justify-between text-xs">
			<div class="text-xs line-clamp-2">
				<a href="/products/{product.product_id}" class="">
					{product.name} By {#if product.business_name}
						{product.business_name} <br />
					{/if}
				</a>
			</div>
			<!-- <div>
				{#if product.stock}
					{product.stock} available <br />
				{/if}
			</div> -->
		</div>
	</div>
	<!-- <div class="px-4 pb-2 pt-4">
				{#if !data.me}
					<a href="/auth/login"> <Button type="button" class="w-full">Login</Button></a>
				{:else}
					<a href="/product/{product.product_id}" type="button" class="w-full"> Order Now </a>
				{/if}
			</div> -->
</div>
