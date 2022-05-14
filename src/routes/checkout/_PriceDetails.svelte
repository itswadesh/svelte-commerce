<script lang="ts">
import { goto } from '$app/navigation'
import { cart, addToCart } from '../../../store/cart'
import Button from '$lib/ui/Button.svelte'
import { currency } from '$lib/util'
import { spring } from 'svelte/motion'

const cart_total = spring(),
	cart_subtotal = spring()
$: cart_total.set($cart.total)
$: cart_subtotal.set($cart.subtotal)
$: offset = modulo($cart_total, 1)

// $: discount = Math.round(((item?.variant?.mrp - item?.variant?.price) * 100) / item?.variant?.mrp)
function modulo(n, m) {
	// handle negative numbers
	return ((n % m) + m) % m
}
let selectedAddress = null
let details = []
let btnname = null
let nextpage = null
let showOffers = false
let hide = false
let show = true
function proceed() {
	if (!selectedAddress) {
		goto(`/checkout/add`, {})
		return
	}
	goto(`/checkout/payment-options?address=${selectedAddress}`)
}
function hideOffers() {
	showOffers = false
}
</script>

<div class="flex flex-col sm:p-1">
	<div class="my-auto p-3 text-center text-lg font-medium text-gray-600">PRICE DETAILS</div>
	<div v-if="cart">
		<div>
			<button
				class="flex flex-row focus:outline-none"
				on:click="{() => (showOffers = !showOffers)}">
				<span
					class="
              text-secondary-200
              hover:text-secondary-400
              flex-shrink-0
              cursor-pointer
              text-sm
              font-medium
              ms-3
            ">
					See Available Offer
				</span>
			</button>
		</div>
		<div
			class="
          container
          mx-auto flex
          flex-shrink-0
          flex-row
          justify-between
          p-2
          px-3
          text-base
          font-light
        ">
			<span>Items Subtotal</span>
			<span>{currency($cart.subtotal)}</span>
		</div>
		<div
			class="
          container
          mx-auto flex
          flex-shrink-0
          flex-row
          justify-between
          p-2
          px-3
          text-base
          font-light
        ">
			<span>Total Item</span>
			<span>{$cart.qty}</span>
		</div>
		<!-- <div
        v-if="cart.discount && cart.discount.amount > 0"
        class="
          container
          flex flex-row
          justify-between
          p-2
          px-3
          mx-auto
          text-base
          font-light
        "
      >
        <span>Your Savings</span>
        <span class="text-accent-900">
          -{ currency(discount)}
        </span>
      </div> -->
		{#if $cart.shipping}
			<div
				class="
          container
          mx-auto flex
          flex-row
          justify-between
          p-2
          px-3
          text-base
          font-light
        ">
				<a
					href="/delivery-charges"
					class="
            flex
            cursor-pointer
            font-light
            text-gray-600
            hover:font-medium
            hover:text-primary-500
          ">
					<h6>Delivery Charges</h6>
					<h6 class="my-auto ml-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</h6>
				</a>
				<span> FREE </span>
			</div>
		{/if}
		<div
			class="
          container
          mx-auto flex
          flex-row
          justify-between
          p-2
          px-3
          text-base
          font-semibold
          text-gray-600
        ">
			<span class="text-xl">Total Amount</span>
			<span class="text-xl">
				{currency(Math.floor($cart_subtotal))}
			</span>
		</div>
		<div class="fixed bottom-0 w-full sm:relative">
			{#if nextpage}
				<a href="{nextpage}">
					<div
						class="flex w-full items-center justify-center bg-primary-500 p-3
                text-white
                focus:ring-primary-500
                sm:my-4
                sm:px-3">
						<Button>
							{btnname}
						</Button>
					</div>
				</a>
			{/if}
		</div>
	</div>
</div>
