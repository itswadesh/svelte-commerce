<script lang="ts">
import { currency } from '../util'
import { cart } from '../../store/cart'
import { spring } from 'svelte/motion'

const cart_total = spring(),
	cart_subtotal = spring()
$: cart_total.set($cart.total)
$: cart_subtotal.set($cart.subtotal)
$: offset = modulo($cart_total, 1)

function modulo(n: number, m: number) {
	// handle negative numbers
	return ((n % m) + m) % m
}
</script>

<div class="py-5 my-5 text-gray-800 border-t border-gray-200">
	<h2 class="text-xl font-semibold">Price Summary</h2>
	<h5 class="mt-1 text-xs tracking-wider text-gray-400">Includes GST and all government taxes</h5>
	<div class="mt-5">
		<div class="flex items-center justify-between my-2 text-sm font-medium">
			<h4>Total item price</h4>
			<h4>{currency(Math.floor($cart_subtotal))}</h4>
		</div>
		{#if $cart?.discount > 0}
			<div class="flex items-center justify-between my-2 text-sm font-medium">
				<h4>Item discount</h4>
				<h4>-{currency($cart?.discount)}</h4>
			</div>
		{/if}
		<div class="flex items-center justify-between my-2 text-sm font-medium">
			<h4>Shipping fee</h4>
			<h4>FREE</h4>
		</div>
	</div>
	<p class="pb-5 mt-1 text-xs tracking-wider text-gray-400 border-b border-gray-200 border-dashed">
		Free shipping on orders of ₹999 or more. For first purchase, <span
			class="underline cursor-pointer">See Offer</span>
	</p>
	<div class="relative flex items-center justify-between my-2 font-bold ">
		<h4>Total</h4>
		{currency(Math.floor($cart_subtotal))}
	</div>
	{#if $cart.qty > 0}
		<div>
			<button
				class="w-full py-2 my-2 font-bold tracking-wider text-white uppercase bg-gray-700 rounded-md shadow-md hover:bg-gray-800">
				Proceed to checkout
			</button>
		</div>
	{/if}
</div>
