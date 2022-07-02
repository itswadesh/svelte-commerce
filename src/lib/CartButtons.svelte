<script>
import ImageLoader from './components/Image/ImageLoader.svelte'
import { KQL_AddToCart, KQL_Cart } from './graphql/_kitql/graphqlStores'
import { Cart } from './graphql/_kitql/graphqlTypes'
import PrimaryButton from './ui/PrimaryButton.svelte'
import { store, toast } from './util'
import { fly } from 'svelte/transition'
import { tweened } from 'svelte/motion'
import { elasticOut } from 'svelte/easing'

let visible = true

export let product, cart
let loading = false
function checkCart(pid) {
	return cart?.items?.some((e) => e.pid === pid)
}
function getQty(pid) {
	const found = cart.items?.find((e) => e.pid === pid)
	return found?.qty || 0
}

async function refreshCart() {
	// await KQL_Cart.resetCache()
	// await KQL_Cart.queryLoad({ variables: { store: store.id }, settings: { policy: 'network-only' } })
}
async function addToCart({ pid, vid, options, qty }) {
	const optiData = $KQL_Cart.data
	optiData.cart.currencyCode = `Removing items...`
	loading = true
	const addToCartRes = await KQL_AddToCart.mutate({
		variables: { pid, qty, vid, options }
	})
	loading = false
	if (addToCartRes.errors) {
		return toast(addToCartRes.errors[0].message.replace('UserInputError: ', ''), 'error')
	}
	if (qty < 1) toast('Removed from cart', 'success')
	else toast('Added to the cart', 'success')
	cart = addToCartRes.data.addToCart
	await KQL_Cart.query({ variables: { store: store.id }, settings: { policy: 'network-only' } })
}
// $: cart = $KQL_Cart.data?.cart || {}
</script>

{#if cart?.items && !checkCart(product.id)}
	<!-- Plus Button -->

	<PrimaryButton
		loadingringsize="xs"
		loading="{loading}"
		class="whitespace-nowrap py-1 text-xs font-medium"
		on:click="{() =>
			addToCart({
				pid: product.id,
				vid: product.id,
				options: [],
				qty: 1
			})}">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-4 w-4"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
			></path>
		</svg>

		<span> Add to Cart </span>
	</PrimaryButton>
{:else}
	<div class="flex items-center">
		<!-- Minus Button -->

		<button
			in:fly="{{ x: 10, duration: 1000, delay: 50 }}"
			type="button"
			class="flex-shrink-0 rounded-full bg-primary-50 p-2 text-gray-800 transition duration-500 hover:bg-primary-500 hover:text-white focus:outline-none"
			on:click="{() =>
				addToCart({
					pid: product.id,
					vid: product.id,
					options: [],
					qty: -1
				})}">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 flex-shrink-0"
				viewBox="0 0 20 20"
				fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
					clip-rule="evenodd"></path>
			</svg>
		</button>

		<!-- Quantity and loading -->

		<div class="w-14 px-3 flex items-center justify-center">
			{#if loading}
				<div>
					<ImageLoader
						src="/dots-loading.gif"
						alt="loading..."
						class="h-5 w-5 object-contain object-center text-xs" />
				</div>
			{:else}
				<span>
					<b>{cart?.items?.find((e) => e.pid === product.id).qty}</b>
				</span>
			{/if}
		</div>

		<!-- Plus Button -->

		<button
			in:fly="{{ x: -10, duration: 1000, delay: 50 }}"
			type="button"
			class="flex-shrink-0 rounded-full bg-primary-50 p-2 text-gray-800 transition duration-500 hover:bg-primary-500 hover:text-white focus:outline-none"
			on:click="{() =>
				addToCart({
					pid: product.id,
					vid: product.id,
					options: [],
					qty: 1
				})}">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 flex-shrink-0"
				viewBox="0 0 20 20"
				fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
					clip-rule="evenodd"></path>
			</svg>
		</button>
	</div>
{/if}
