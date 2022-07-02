<script lang="ts">
import { spring } from 'svelte/motion'
import { createEventDispatcher } from 'svelte'
import { currency } from '$lib/util'
import { KQL_Cart } from '$lib/graphql/_kitql/graphqlStores'
import GradiantButton from '$lib/ui/GradiantButton.svelte'
import { goto } from '$app/navigation'
const dispatch = createEventDispatcher()
// const cart_total = spring(),
// 	cart_subtotal = spring()
// $: cart_total.set($cart.total)
// $: cart_subtotal.set($cart.subtotal)
// $: offset = modulo($cart_total, 1)
export let nextpage = null,
	text = 'Proceed to checkout',
	loading = false,
	disabled = false

function modulo(n, m) {
	// handle negative numbers
	return ((n % m) + m) % m
}
function submit() {
	dispatch('submit')
}
</script>

<section class="my-5 border-t  border-gray-200 py-5 text-gray-800">
	<h5 class="text-xl font-bold capitalize tracking-wide">Price Summary</h5>

	<h6 class="mt-1 text-xs tracking-wider text-gray-400">Includes GST and all government taxes</h6>

	<div class="mt-3">
		<div class="mt-2 flex items-center justify-between font-medium">
			<h4>Total item price</h4>
			<h4>{currency(Math.floor($KQL_Cart?.data?.cart.subtotal))}</h4>
		</div>

		{#if $KQL_Cart?.data?.cart?.discount > 0}
			<div class="mt-2 flex items-center justify-between font-medium">
				<h4>Item discount</h4>
				<h4>-{currency($KQL_Cart?.data?.cart?.discount)}</h4>
			</div>
		{/if}

		<div class="mt-2 flex items-center justify-between font-medium">
			<h4>Shipping fee</h4>
			<h4>{$KQL_Cart?.data?.cart.shipping.charge}</h4>
		</div>

		<!-- <p class="mt-1 text-xs tracking-wider text-gray-400 d">
			Free shipping on orders of ₹999 or more. For first purchase,
			<a href="*" class="underline hover:text-primary-500">See Offer</a>
		</p> -->
	</div>

	<hr class="my-5 border-t border-dashed border-gray-200" />

	<div class="my-2 mb-5 flex items-center justify-between text-lg font-semibold ">
		<h4>Total</h4>

		{currency(Math.floor($KQL_Cart?.data?.cart.subtotal))}
	</div>

	{#if $KQL_Cart?.data?.cart.qty > 0}
		{#if nextpage}
			<GradiantButton
				class="w-full uppercase"
				loading="{loading}"
				disabled="{disabled}"
				on:click="{() => goto(`${nextpage}`)}">
				{text}
			</GradiantButton>
		{:else}
			<GradiantButton
				class="w-full uppercase"
				loading="{loading}"
				disabled="{disabled}"
				on:click="{submit}">
				{text}
			</GradiantButton>
		{/if}
	{/if}
</section>
