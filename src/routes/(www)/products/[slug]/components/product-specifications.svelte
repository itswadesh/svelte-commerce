<script lang="ts">
	import { useProductState } from '$lib/core/composables/index.js'
	import QrCodeDisplayer from '$lib/core/components/common/qr-code.svelte'
	import { page } from '$app/state'

	const productState = useProductState()
	const data = $derived(page.data)
</script>

<div class="mt-2 border-t border-gray-100">
	<div class="mb-6 flex items-center gap-3">
		<h3 class="text-xs font-bold uppercase tracking-widest text-gray-900">Product Specifications</h3>
		<div class="h-px flex-1 bg-gray-100"></div>
	</div>
	
	<div class="grid grid-cols-1 gap-y-4">
		<!-- SKU and Barcode Section -->
		<div class="grid grid-cols-2 gap-4 border-b border-gray-50 pb-4">
			{#if productState.selectedVariant?.sku || data?.product?.sku}
				<div class="flex flex-col gap-1">
					<p class="text-[10px] font-bold uppercase tracking-tighter text-gray-400">SKU</p>
					<p class="text-sm font-medium text-gray-900 break-words break-all">{String(productState.selectedVariant?.sku || data?.product?.sku)}</p>
				</div>
			{/if}

			{#if productState.selectedVariant?.barcode || data?.product?.barcode}
				<div class="flex flex-col gap-1 text-right">
					<p class="text-[10px] font-bold uppercase tracking-tighter text-gray-400">Barcode</p>
					<p class="text-sm font-medium text-gray-900">{productState.selectedVariant?.barcode || data?.product?.barcode}</p>
				</div>
			{/if}
		</div>

		<!-- Dimensions and Weight Section -->
		<div class="grid grid-cols-2 gap-4 border-b border-gray-50 pb-4">
			{#if productState.selectedVariant?.width || data?.product?.width || productState.selectedVariant?.height || data?.product?.height || productState.selectedVariant?.length || data?.product?.length}
				<div class="flex flex-col gap-1">
					<p class="text-[10px] font-bold uppercase tracking-tighter text-gray-400">Dimensions</p>
					<p class="text-sm font-medium text-gray-900">
						{#if productState.selectedVariant?.width || data?.product?.width}
							W-{productState.selectedVariant?.width || data?.product?.width}
						{/if}

						{#if (productState.selectedVariant?.width || data?.product?.width) && (productState.selectedVariant?.height || data?.product?.height)}
							x
						{/if}

						{#if productState.selectedVariant?.height || data?.product?.height}
							H-{productState.selectedVariant?.height || data?.product?.height}
						{/if}

						{#if (productState.selectedVariant?.height || data?.product?.height || productState.selectedVariant?.width || data?.product?.width) && (productState.selectedVariant?.length || data?.product?.length)}
							x
						{/if}

						{#if productState.selectedVariant?.length || data?.product?.length}
							L-{productState.selectedVariant?.length || data?.product?.length}
						{/if}
					</p>
				</div>
			{/if}

			{#if productState.selectedVariant?.weight || data?.product?.weight}
				<div class="flex flex-col gap-1 text-right">
					<p class="text-[10px] font-bold uppercase tracking-tighter text-gray-400">Weight</p>
					<p class="text-sm font-medium text-gray-900">
						{productState.selectedVariant?.weight || data?.product?.weight}
						{page?.data?.store.weight_unit || productState.settingState?.selectedStore?.weight_unit}
					</p>
				</div>
			{/if}
		</div>

		<div class="grid grid-cols-2 gap-4 border-b border-gray-50 pb-4">
			{#if data?.product?.originCountry}
				<div class="flex flex-col gap-1">
					<p class="text-[10px] font-bold uppercase tracking-tighter text-gray-400">Origin</p>
					<p class="text-sm font-medium text-gray-900">{data?.product?.originCountry}</p>
				</div>
			{/if}
		</div>

		{#each data?.product?.attributes as { name, value }}
			<div class="grid grid-cols-2 gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
				<div class="flex flex-col gap-1">
					<p class="text-[10px] font-bold uppercase tracking-tighter text-gray-400">{name}</p>
					<p class="text-sm font-medium text-gray-900">{value}</p>
				</div>
			</div>
		{/each}

		{#if productState.selectedVariant?.qrcode || data?.product?.qrcode}
			<div class="mt-4 flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
				<p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Product Authenticity</p>
				<QrCodeDisplayer base64Data={productState.selectedVariant?.qrcode || data?.product?.qrcode} />
			</div>
		{/if}
	</div>
</div>

