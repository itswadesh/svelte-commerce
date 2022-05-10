<!-- Whole section start  -->
<style>
</style>

<script context="module" lang="ts">
export async function load({ url, params, fetch }) {
	let cart
	try {
		await KQL_Cart.resetCache()
		await KQL_Cart.queryLoad({ fetch, variables: { store: store.id } })
		return {
			props: {}
		}
	} catch (e) {
		throw Error(e)
	}
}
</script>

<script>
import Textbox from '$lib/ui/Textbox.svelte'
import Cartlist from './_Cartlist.svelte'
import Weprovides from '$lib/Weprovides.svelte'
import Pricesummary from '$lib/Pricesummary.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import { KQL_AddToCart, KQL_Cart } from '$lib/graphql/_kitql/graphqlStores'
import { store, toast } from '$lib/util'
let show, addingToBag
function toggle() {
	show = !show
}
const seoProps = {
	title: 'Shopping Bag',
	metadescription: 'Your items in shopping bag'
}
async function refreshCart() {
	// await KQL_Cart.resetCache()
	// await KQL_Cart.queryLoad({ variables: { store: store.id }, settings: { policy: 'network-only' } })
}
async function addToCart({ detail }) {
	const { pid, vid, options } = detail.item
	const qty = detail.qty
	const optiData = $KQL_Cart.data
	optiData.cart.currencyCode = `Removing items...`
	const addToCartRes = await KQL_AddToCart.mutate({
		variables: { pid, qty, vid, options }
	})
	if (addToCartRes.errors) {
		return toast(addToCartRes.errors[0].message.replace('UserInputError: ', ''), 'error')
	}
	if (qty < 1) toast('Removed from cart', 'success')
	else toast('Added to the cart', 'success')
	await KQL_Cart.queryLoad({ variables: { store: store.id }, settings: { policy: 'network-only' } })
}
$: cart = $KQL_Cart.data?.cart || {}
</script>

<SEO {...seoProps} />
<!-- Whole section start  -->
<section
	class="container mx-auto min-h-screen w-full max-w-6xl border-b px-4  py-2 text-gray-800 sm:px-10 sm:py-5 md:py-10 ">
	{#if cart?.qty > 0}
		<div class="lg:flex lg:justify-center lg:space-x-10 xl:space-x-20">
			<!-- Cart section start  -->

			<div class="lg:w-1/2 xl:w-2/3 ">
				<div class="items-center  justify-between pb-3 sm:flex ">
					<!-- Cart start  -->
					<div class="mr-4 flex items-baseline">
						<h2 class="text-4xl font-bold tracking-wide ">Cart</h2>
						<div class="mx-3 h-1 w-1 rounded-full bg-gray-200"></div>
						<h4 class="text-xl tracking-tighter text-gray-300">{cart.qty} items</h4>
					</div>
					<!-- Cart end  -->
					<!-- Enter pincode for delivery start  -->
					<div class="relative mt-2 sm:mt-0">
						<div
							on:click="{toggle}"
							class="flex cursor-pointer items-center px-2 py-2 hover:bg-gray-100 sm:px-4">
							<span> Enter pincode for delivery</span>
							{#if !show}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="mt-1 ml-2 h-5 w-5 text-gray-800 transition duration-300"
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
								class="absolute left-0 z-10 mt-2 flex w-72 flex-col rounded-lg border bg-white p-4 shadow-xl md:right-0 md:w-96 md:p-6">
								<p class="text-sm">Enter a pincode</p>
								<div class="mt-2">
									<Textbox label="Pincode" />
									<button
										on:click="{toggle}"
										class="mt-3 w-full rounded-lg bg-gray-800 bg-opacity-80 py-3 font-bold tracking-wide text-white hover:bg-opacity-100"
										>CHECK</button>
								</div>
							</div>
						{/if}
					</div>
					<!-- Enter pincode for delivery end  -->
				</div>
				<div class="border-t border-gray-200">
					{#if cart.items}
						{#each cart.items as item}
							<Cartlist
								addingToBag="{addingToBag}"
								item="{item}"
								on:refreshCart="{refreshCart}"
								on:addToCart="{addToCart}" />
						{/each}
					{/if}
				</div>
				<div>
					<Weprovides />
				</div>
			</div>
			<!-- Cart section end -->

			<!-- Promo code section start -->
			<div class="mb-12  lg:w-1/2 xl:w-1/3">
				<div class="group mt-3 flex cursor-pointer items-center justify-between">
					<h5 class="text-sm text-gray-500 group-hover:text-gray-800">Apply Promo Code</h5>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-gray-500 group-hover:text-gray-800"
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
					class="inline-block px-6 py-2 my-5  bg-primary-500 hover:bg-primary-700 transition duration-300 transform active:scale-95 rounded-md shadow-md focus:ring-2  focus:ring-offset-2 focus:ring-primary-500 font-semibold text-white ">
					Shop Now
				</a>
			</div>
		</div>
	{/if}
</section>
