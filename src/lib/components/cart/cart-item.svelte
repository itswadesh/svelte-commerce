<script lang="ts">
	import type { CartProduct } from '$lib/core/types/index.js'
	import { getCartState, getUserState } from '$lib/core/stores/index.js'
	import { Minus, Plus, Trash } from '@lucide/svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import LoadingDotsGif from '$lib/assets/dots-loading.gif'
	import { formatPrice, fireGTagEvent } from '$lib/core/utils/index.js'
	import { page } from '$app/state'

	const cartState = getCartState()
	const userState = getUserState()

	let loading = $state(false)

	type Props = {
		cartProduct: CartProduct
		removeItem: (id: string) => void
	}

	let { cartProduct = $bindable(), removeItem }: Props = $props()

	let totalPrice = $derived((cartProduct?.price || 0) * (cartProduct?.qty || 0))
</script>

<div class="flex items-center justify-between py-4" onclick={(e) => e.stopPropagation()} role="group">
	<div class="flex gap-4 w-full">
		<a
			href="/products/{cartProduct?.slug}"
			class="block shrink-0"
			onclick={(e) => {
				e.stopPropagation()
				cartState.isOpen = false
			}}
		>
			<!-- <div class="overflow-hidden  ring-1 ring-gray-100">
				<LazyImg
					src={cartProduct?.thumbnail}
					alt={cartProduct?.title || 'Product'}
					class="aspect-[3/4] w-20 object-contain sm:w-20"
				/>
			</div> -->
													<div class="overflow-hidden bg-gray-50 p-1 ring-1 ring-gray-100">
													<LazyImg
													src={cartProduct?.thumbnail}
														alt={cartProduct?.title || 'Product'}
														class="aspect-[3/4] w-24 object-contain sm:w-20"
													/>
												</div>
		</a>

		<div class="flex flex-1 flex-col">
			<div class="flex flex-col gap-1">
				<a
					href="/products/{cartProduct?.slug}"
					onclick={(e) => {
						e.stopPropagation()
						cartState.isOpen = false
					}}
				>
					<h4 class="line-clamp-2 text-base font-semibold text-gray-900">{cartProduct?.title}</h4>
				</a>
				
				<div class="flex justify-start items-center gap-2">
					<p class="text-base font-bold pt-1 text-gray-900">
						{formatPrice(totalPrice, page?.data?.store?.currency?.code)}
					</p>
					{#if cartProduct.qty > 1}
						<p class="text-sm font-semibold text-muted uppercase tracking-tighter">
							({formatPrice(cartProduct.price, page?.data?.store?.currency?.code)} each)
						</p>
					{/if}
				</div>

				{#if cartProduct?.variantTitle}
					<p class="text-xs font-medium text-gray-500">{cartProduct.variantTitle}</p>
				{/if}
			</div>

			<div class="mt-4 flex items-center gap-4">
				<!-- Qty and Delete side by side -->
				<div class="flex items-center gap-2">
					<div class="flex items-center rounded-md border border-gray-200 bg-white p-0.5 shadow-sm">
						<button
							onclick={async (e) => {
								e.stopPropagation()
								loading = true

								const categoryNames = cartProduct?.product?.categories?.flatMap?.((c) => c.category?.name) || []
								const productObj = {
									...(cartProduct || {}),
									categoryNames
								}

								fireGTagEvent('remove_from_cart', {
									items: [{ ...productObj }],
									price: cartProduct.price
								})
								await cartState.update({
									qty: cartProduct.qty - 1,
									lineId: cartProduct.id,
									productId: cartProduct.productId,
									variantId: cartProduct.variantId
								})
								loading = false
							}}
							class="rounded-md p-1 hover:bg-gray-100 disabled:opacity-30"
							aria-label="Subtract 1 from qty"
							disabled={loading || cartProduct.qty <= 1}
						>
							<Minus class="size-3.5" />
						</button>

						<span class="flex min-w-[2rem] items-center justify-center text-xs font-bold text-gray-900">
							{#if loading}
								<img src={LoadingDotsGif} alt="Loading..." class="size-3.5" />
							{:else}
								{cartProduct.qty}
							{/if}
						</span>

						<button
							class="rounded-md p-1 hover:bg-gray-100 disabled:opacity-30"
							aria-label="Add 1 to qty"
							disabled={loading}
							onclick={async (e) => {
								e.stopPropagation()
								loading = true
								const me = userState?.user

								const categoryNames = cartProduct?.product?.categories?.flatMap?.((c) => c.category?.name) || []
								const productObj = {
									...(cartProduct || {}),
									categoryNames
								}

								const dataToFire = {
									items: [{ ...productObj, qty: cartProduct?.qty + 1 }],
									total: cartProduct?.price * (cartProduct?.qty + 1),
									qty: cartProduct?.qty + 1,
									vendorBusinessName: cartProduct?.vendor?.businessName,
									user: {
										id: me?._id || me?.id,
										name: me?.firstName + ' ' + me?.lastName,
										email: me?.email
									}
								}
								fireGTagEvent('add_to_cart', dataToFire)
								await cartState?.update({
									qty: cartProduct.qty + 1,
									lineId: cartProduct.id,
									productId: cartProduct.productId,
									variantId: cartProduct.variantId
								})
								loading = false
							}}
						>
							<Plus class="size-3.5" />
						</button>
					</div>

					<button
						class="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-50"
						aria-label="Remove item"
						onclick={async (e) => {
							e?.preventDefault()
							e?.stopPropagation()

							const categoryNames = cartProduct?.product?.categories?.flatMap?.((c) => c.category?.name) || []
							const productObj = {
								...(cartProduct || {}),
								categoryNames
							}

							fireGTagEvent('remove_from_cart', {
								items: [{ ...productObj }],
								price: cartProduct.price
							})
							await cartState?.update({
								qty: 0,
								lineId: cartProduct.id,
								productId: cartProduct.productId,
								variantId: cartProduct.variantId
							})
						}}
					>
						<Trash class="size-4" />
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
