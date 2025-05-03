<script lang="ts">
	import { useProductState } from '$lib/core/composables/product'
	import QrCodeDisplayer from '$lib/core/components/common/qr-code.svelte'
	import { page } from '$app/state'

	const productState = useProductState()
	const data = $derived(productState.data)
</script>

<div class="mt-4 rounded-lg bg-background">
	<div class="flex flex-col gap-4">
		<!-- SKU and Barcode Section -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			{#if productState.selectedVariant?.sku || data?.product?.sku}
				<div class="border-b">
					<p class="text-gray-500">SKU</p>
					<p class="break-words break-all">{productState.selectedVariant?.sku || data?.product?.sku}</p>
				</div>
			{/if}

			{#if productState.selectedVariant?.barcode || data?.product?.barcode}
				<div class="border-b">
					<p class="text-gray-500">Barcode</p>
					<!-- <QrCodeDisplayer
                      base64Data={selectedVariant?.barcode ||
                        data?.product?.barcode}
                    /> -->
					<p>{productState.selectedVariant?.barcode || data?.product?.barcode}</p>
				</div>
			{/if}

			{#if productState.selectedVariant?.qrcode || data?.product?.qrcode}
				<div class="border-b">
					<p class="text-gray-500">QR Code</p>
					<QrCodeDisplayer base64Data={productState.selectedVariant?.qrcode || data?.product?.qrcode} />
				</div>
			{/if}
		</div>

		<!-- Dimensions and Weight Section -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			{#if productState.selectedVariant?.width || data?.product?.width || productState.selectedVariant?.height || data?.product?.height || productState.selectedVariant?.length || data?.product?.length}
				<div class="border-b">
					<p class="text-gray-500">Dimensions</p>
					<p>
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
				<div class="border-b">
					<p class="text-gray-500">Weight</p>
					<p>
						{productState.selectedVariant?.weight || data?.product?.weight}
						{page?.data?.store.weight_unit || productState.settingState?.selectedStore?.weight_unit}
					</p>
				</div>
			{/if}
		</div>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			{#if data?.product?.originCountry}
				<div class="border-b">
					<p class="text-gray-500">Country of origin</p>
					<p>{data?.product?.originCountry}</p>
				</div>
			{/if}
		</div>

		{#each data?.product?.attributes as { name, value }}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="border-b">
					<p class="text-gray-500">{name}</p>
					<p>{value}</p>
				</div>
			</div>
		{/each}
	</div>
</div>

