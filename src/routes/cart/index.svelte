<!-- Whole section start  -->
<style>
</style>

<script>
import Textbox from '$lib/ui/Textbox.svelte'
import Cartlist from './_Cartlist.svelte'
import Weprovides from '$lib/Weprovides.svelte'
import Pricesummary from '$lib/Pricesummary.svelte'
import { cart, addToCart } from '../../../store/cart'
let show
function toggle() {
	show = !show
}
</script>

<!-- Whole section start  -->
<section
	class="container w-full min-h-screen mx-auto max-w-6xl px-4 sm:px-10  py-2 text-gray-800 border-b sm:py-5 md:py-10 ">
	{#if $cart?.qty > 0}
		<div class="lg:flex lg:justify-center lg:space-x-10 xl:space-x-20">
			<!-- Cart section start  -->

			<div class="lg:w-1/2 xl:w-2/3 ">
				<div class="sm:flex  items-center justify-between pb-3 ">
					<!-- Cart start  -->
					<div class="flex items-baseline mr-4">
						<h2 class="text-4xl font-bold tracking-wide ">Cart</h2>
						<div class="w-1 h-1 mx-3 bg-gray-200 rounded-full"></div>
						<h4 class="text-xl tracking-tighter text-gray-300">{$cart?.qty} items</h4>
					</div>
					<!-- Cart end  -->
					<!-- Enter pincode for delivery start  -->
					<div class="relative mt-2 sm:mt-0">
						<div
							on:click="{toggle}"
							class="flex items-center px-2 sm:px-4 py-2 cursor-pointer hover:bg-gray-100">
							<span> Enter pincode for delivery</span>
							{#if !show}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-5 h-5 mt-1 ml-2 text-gray-800 transition duration-300"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
										clip-rule="evenodd"></path>
								</svg>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-5 h-5 mt-1 ml-2 text-gray-800  transform rotate-180 transition duration-300"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
										clip-rule="evenodd"></path>
								</svg>
							{/if}
						</div>

						{#if show}
							<div
								class="absolute z-10 left-0 md:right-0 flex flex-col p-4 md:p-6 mt-2 bg-white border rounded-lg shadow-xl w-72 md:w-96">
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
			<div class="lg:w-1/2  xl:w-1/3">
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
		</div>
	{:else}
		<div>
			<div class="my-auto text-center">
				<div class="flex justify-center pt-6">
					<img
						src="/emptycart.png"
						class="h-72 w-80 md:h-84 md:w-96 oject-cover"
						alt="Empty cart" />
				</div>

				<h6 class="flex justify-center px-6 text-base text-center text-gray-500">
					Go ahead, order some essentials from the menu.
				</h6>

				<a
					href="/"
					class="inline-block px-6 py-2 my-5  bg-primary-500 hover:bg-primary-700 transition duration-300 transform active:scale-95 rounded-md shadow-md focus:ring-2  focus:ring-offset-2 focus:ring-primary-500 font-semibold text-white "
					>Shop Now</a>
			</div>
		</div>
	{/if}
</section>
