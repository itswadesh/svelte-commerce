<script lang="ts">
	import type { CartProduct } from '$lib/core/types'
	import { Minus, Plus, Trash } from 'lucide-svelte'
	import { getCartState } from '$lib/core/stores/cart.svelte'
	import { formatPrice } from '$lib/core/utils'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import LoadingDotsGif from '$lib/assets/dots-loading.gif'
	import { fireGTagEvent } from '$lib/core/utils/gtag'
	import { getUserState } from '$lib/core/stores/auth.svelte'
  import { page } from '$app/state'

	const cartState = getCartState()
	const userState = getUserState()

	let loading = $state(false)

	type Props = {
		cartProduct: CartProduct
		removeItem: (id: string) => void
	}

	let { cartProduct = $bindable(), removeItem }: Props = $props()
</script>

<div class="flex items-center justify-between py-2" onclick={(e) => e.stopPropagation()} role="group">
	<div class="flex gap-6">
		<a
			href="/products/{cartProduct?.slug}"
			class="block w-32"
			onclick={(e) => {
				e.stopPropagation()
				cartState.isOpen = false
			}}
		>
			<LazyImg src={cartProduct?.thumbnail} alt="Product" class="mr-4 size-36 rounded object-contain" />
		</a>
		<div>
			<a
				class="text-s w-full"
				href="/products/{cartProduct?.slug}"
				onclick={(e) => {
					e.stopPropagation()
					cartState.isOpen = false
				}}
			>
				<p class="line-clamp-2 font-medium">{cartProduct?.title}</p>
			</a>
			<p class="text-sm">
				{formatPrice(cartProduct?.price, page?.data?.store?.currency?.code)}
			</p>

			<div class="mt-2 flex items-center gap-2">
				<div class="flex w-24 items-center justify-center rounded-md border border-gray-200 p-1">
					<button
						onclick={async (e) => {
							e.stopPropagation()
							loading = true
							fireGTagEvent('remove_from_cart', {
								items: [{ ...cartProduct }],
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
						class="rounded-md p-1 hover:bg-[#e9e9ec]"
						aria-label="Subtract 1 from qty"
					>
						<Minus class="size-4" />
					</button>

					<span class="mx-2 w-6 text-center">
						{#if loading}
							<img src={LoadingDotsGif} alt="Loading..." class="size-4" />
						{:else}
							{cartProduct.qty}
						{/if}
					</span>

					<button
						class="rounded-md p-1 hover:bg-[#e9e9ec]"
						aria-label="Add 1 to qty"
						onclick={async (e) => {
							e.stopPropagation()
							loading = true
							const me = userState?.user
							const dataToFire = {
								items: [{ ...cartProduct, qty: cartProduct?.qty + 1 }],
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
						<Plus class="size-4" />
					</button>
				</div>

				<button
					class="px-3 py-1"
					aria-label="Remove item"
					onclick={async (e) => {
						e?.preventDefault()
						e?.stopPropagation()
						fireGTagEvent('remove_from_cart', {
							items: [{ ...cartProduct }],
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
					<Trash class="size-4 text-red-500 hover:text-red-300" />
				</button>
			</div>
		</div>
	</div>
</div>
