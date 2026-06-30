<script lang="ts">
	import CouponsDrawer from '$lib/components/coupon/coupons-drawer.svelte'
	import { Button } from '$lib/components/ui/form/index.js'
	import { X } from '@lucide/svelte'
	import { getCartState } from '@misiki/kitcommerce-core/stores'

	const { block } = $props()

	const cartState = getCartState()
</script>

<div>
	{#if cartState.cart.couponCode}
		<div class="flex items-center justify-between px-1 text-sm sm:text-base">
			<p class="font-medium">Coupon Applied</p>
			<div class="flex items-center gap-2 rounded-radius bg-gray-100 p-2 px-3">
				<p class="text-sm font-medium text-gray-600">
					{cartState.cart.couponCode}
				</p>
				<Button variant="ghost" size="icon" class="h-auto w-auto p-1 text-destructive" onclick={() => cartState.removeCoupon()}>
					<X class="size-4" />
				</Button>
			</div>
		</div>
	{/if}

	<CouponsDrawer />
</div>
