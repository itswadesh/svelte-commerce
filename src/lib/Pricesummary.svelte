<script lang="ts">
import { currency } from '../util'
import { spring } from 'svelte/motion'
import { createEventDispatcher } from 'svelte'
import { KQL_Cart } from './graphql/_kitql/graphqlStores'
const dispatch = createEventDispatcher()
export const btnname = null
export let nextpage = null
export let text = 'Proceed to checkout'
export const cls = null
export const loading = !!false
function modulo(n, m) {
	// handle negative numbers
	return ((n % m) + m) % m
}
function submit() {
	dispatch('submit')
}
</script>

<section class="py-5 my-5  border-t border-gray-200 text-gray-800">
	<h5 class="capitalize font-bold tracking-wide text-xl">Price Summary</h5>

	<h6 class="mt-1 text-xs tracking-wider text-gray-400">Includes GST and all government taxes</h6>

	<div class="mt-3">
		<div class="flex items-center justify-between mt-2 font-medium">
			<h4>Total item price</h4>
			<h4>{currency(Math.floor($KQL_Cart.data?.cart.subtotal))}</h4>
		</div>

		{#if $KQL_Cart.data?.cart.discount > 0}
			<div class="flex items-center justify-between mt-2 font-medium">
				<h4>Item discount</h4>
				<h4>-{currency($KQL_Cart.data?.cart.discount)}</h4>
			</div>
		{/if}

		<div class="flex items-center justify-between mt-2 font-medium">
			<h4>Shipping fee</h4>
			<h4>FREE</h4>
		</div>

		<p class="mt-1 text-xs tracking-wider text-gray-400 d">
			Free shipping on orders of ₹999 or more. For first purchase,
			<a href="/" class="underline hover:text-primary-500">See Offer</a>
		</p>
	</div>

	<hr class="my-5 border-t border-gray-200 border-dashed" />

	<div class=" flex items-center justify-between my-2 text-lg font-semibold ">
		<h4>Total</h4>
		{currency(Math.floor($KQL_Cart.data?.cart.subtotal))}
	</div>
	{#if $KQL_Cart.data?.cart.qty > 0}
		{#if nextpage}
			<a
				href="{nextpage}"
				class="w-full block px-4 py-2 mt-5 font-semibold tracking-wider text-white uppercase bg-gray-700 rounded-md text-center shadow-md transition duration-300 hover:bg-gray-800 ">
				{text}
			</a>
		{:else}
			<button
				on:click="{submit}"
				class="w-full block px-4 py-2 mt-5 font-semibold tracking-wider text-white uppercase bg-gray-700 rounded-md shadow-md transition duration-300 hover:bg-gray-800 focus:outline-none ">
				{text}
			</button>
		{/if}
	{/if}
</section>
