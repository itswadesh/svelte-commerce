<!-- Whole section start  -->
<style>
</style>

<script>
import Textbox from '$lib/ui/Textbox.svelte'
import Cartlist from './_Cartlist.svelte'
import Weprovides from '$lib/Weprovides.svelte'
import Pricesummary from '$lib/Pricesummary.svelte'
import { cart, fetchCart, addToCart } from '../../../store/cart'
let show
function toggle() {
	show = !show
}
</script>

<!-- Whole section start  -->
<section
	class="justify-center px-4 pb-10 my-10 text-gray-800 border-b border-gray-200 lg:my-28 min-w-max md:flex">
	<!-- Cart section start  -->

	<div class="md:max-w-max">
		<div class="flex items-center justify-between pb-3 ">
			<!-- Cart start  -->
			<div class="flex items-baseline">
				<h2 class="text-4xl font-bold tracking-wide ">Cart</h2>
				<div class="w-1 h-1 mx-3 bg-gray-200 rounded-full"></div>
				<h4 class="text-xl tracking-tighter text-gray-300">{$cart?.qty} items</h4>
			</div>
			<!-- Cart end  -->
			<!-- Enter pincode for delivery start  -->
			<div class="relative">
				<div
					on:click="{toggle}"
					class="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100">
					<span> Enter pincode for delivery</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-5 h-5 mt-1 ml-2 text-gray-800"
						viewBox="0 0 20 20"
						fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clip-rule="evenodd"></path>
					</svg>
				</div>
				{#if show}
					<div class="absolute right-0 flex flex-col p-8 mt-2 bg-white rounded-lg shadow-xl w-96">
						<p class="text-sm">Enter a pincode</p>
						<div class="mt-2">
							<Textbox label="Pincode" />
							<button
								on:click="{toggle}"
								class="w-full py-3 mt-3 font-bold tracking-wide text-white bg-gray-800 rounded-lg bg-opacity-80 hover:bg-opacity-100"
								>CHECK</button>
						</div>
					</div>
				{/if}
			</div>
			<!-- Enter pincode for delivery end  -->
		</div>
		<div class="border-t border-gray-200">
			{#if $cart?.items}
				{#each $cart.items as item}
					<Cartlist item="{item}" />
				{/each}
			{/if}
		</div>
		<div>
			<Weprovides />
		</div>
	</div>
	<!-- Cart section end -->

	<!-- Promo code section start -->
	<div class="md:min-w-max md:ml-20">
		<div class="flex items-center justify-between mt-3 cursor-pointer group">
			<h5 class="text-sm text-gray-500 group-hover:text-gray-800">Apply Promo Code</h5>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="w-5 h-5 text-gray-500 group-hover:text-gray-800"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
				></path>
			</svg>
		</div>
		<Pricesummary nextpage="/checkout/address" text="Select Address" />
	</div>
	<!-- Promo code section end -->
</section>
