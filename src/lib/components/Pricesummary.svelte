<script lang="ts">
import { cartStore, updateCartStore } from '$lib/store/cart'
import { createEventDispatcher, onMount } from 'svelte'
import { currency, toast } from '$lib/utils'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { PrimaryButton } from '$lib/ui'
// import { storeStore } from '$lib/store/store'
import { CartService } from '$lib/services'

const dispatch = createEventDispatcher()

export let checkedCartItems = []
export let disabled = false
export let hideCheckoutButton = false
export let loading = false
export let nextpage = null
export let showNextIcon = false
export let text = 'Proceed to checkout'

$: cart = {}
$: store = $page.data.store

onMount(() => {
	cartStore.subscribe((value) => {
		cart = value
	})
})

function modulo(n, m) {
	// handle negative numbers
	return ((n % m) + m) % m
}

async function submit() {
	if (text === 'Select Address') {
		if (checkedCartItems?.length) {
			try {
				const res = await CartService.updateCart2({
					cartId: cart?.cart_id || cart?.cartId || $page.data?.cartId,
					selected_products_for_checkout: checkedCartItems,
					origin: $page.data?.origin,
					storeId: $page?.data?.storeId
				})

				updateCartStore({ data: res })

				if (nextpage) {
					goto(nextpage)
				} else {
					dispatch('submit')
				}
			} catch (e) {
				console.error(e)
			}
		} else {
			toast('Select at least one item in bag to place order', 'info')
		}
	} else {
		if (nextpage) {
			goto(nextpage)
		} else {
			dispatch('submit')
		}
	}
}
</script>

{#if cart}
	<section>
		<div class="flex items-center gap-2 capitalize">
			<h5>Price Summary</h5>

			<p>
				({cart?.qty}
				{#if cart?.qty > 1}
					items
				{:else}
					item
				{/if})
			</p>
		</div>

		<p class="mt-1">Includes all government taxes</p>

		<div class="mt-3 text-sm">
			<div class="mt-2 flex items-center justify-between font-medium">
				<span>Total</span>

				<span>
					{#if cart?.formattedAmount?.subtotal?.value}
						{currency(
							cart?.formattedAmount?.subtotal?.value,
							cart?.formattedAmount?.subtotal?.currency
						)}
					{:else if cart?.formattedAmount?.subtotal}
						{cart?.formattedAmount?.subtotal}
					{/if}
				</span>
			</div>

			{#if cart?.formattedAmount?.savings?.value || cart?.savings}
				<div class="mt-2 flex items-center justify-between font-medium text-brand-500">
					<span>You Saved</span>

					<span>
						{currency(
							cart?.formattedAmount?.savings?.value || cart?.savings,
							cart?.formattedAmount?.subtotal?.currency
						)}
					</span>
				</div>
			{/if}

			{#if cart?.discount?.value || cart?.discount?.amount}
				<div class="mt-2 flex items-center justify-between font-medium">
					<span>Discount</span>

					<span class="text-brand-500">
						- {currency(
							cart?.discount?.value || cart?.discount?.amount,
							cart?.formattedAmount?.subtotal?.currency
						)}
					</span>
				</div>
			{/if}

			{#if cart?.formattedAmount?.tax?.value || cart?.formattedAmount?.tax}
				<div class="mt-2 flex items-center justify-between font-medium">
					<span>Tax</span>

					<span>
						{#if cart?.formattedAmount?.tax?.value}
							{currency(
								cart?.formattedAmount?.tax?.value,
								cart?.formattedAmount?.subtotal?.currency
							)}
						{:else if cart?.formattedAmount?.tax}
							{cart?.formattedAmount?.tax}
						{/if}
					</span>
				</div>
			{/if}

			{#if cart.codCharges}
				<div class="mt-2 flex items-center justify-between font-medium">
					<span>COD Charges</span>

					<span>
						{currency(cart.codCharges, store?.currencySymbol)}
					</span>
				</div>
			{/if}

			<div class="mt-2 flex items-center justify-between font-medium">
				<span>Shipping</span>

				<span>
					{#if cart?.formattedAmount?.shipping?.value < 1 || cart?.shipping?.charge < 1}
						<span
							class="border border-accent-500 text-accent-500 uppercase px-1.5 py-0.5 rounded text-xs">
							Free
						</span>
					{:else}
						{currency(
							cart?.formattedAmount?.shipping?.value || cart?.shipping?.charge,
							cart?.formattedAmount?.subtotal?.currency
						)}
					{/if}
				</span>
			</div>
		</div>

		<hr class="my-5 border-t border-dashed border-zinc-200" />

		{#if cart?.formattedAmount?.total?.value || cart?.subtotal}
			<h5 class="my-2 mb-5 flex items-center justify-between">
				<span>Total Amount</span>

				<span>
					{#if cart?.formattedAmount?.total?.value}
						{currency(
							cart?.formattedAmount?.total?.value,
							cart?.formattedAmount?.subtotal?.currency
						)}
					{:else if cart?.formattedAmount?.total}
						{cart?.formattedAmount?.total}
					{/if}
				</span>
			</h5>
		{/if}

		<!-- {#if cart?.savings + cart?.discount?.amount > 0}
			<div class="mb-5 bg-brand-100 p-1 w-full text-center text-sm text-zinc-500">
				You are saving
				<span class="text-brand-500 font-bold">
					{currency(cart?.savings + cart?.discount?.amount, store?.currencySymbol)}
				</span>
				on this order
			</div>
		{/if} -->

		{#if $page.url.pathname === '/checkout/address' && !$page.data.me}
			<div class="hidden"></div>
		{:else}
			<div class="hidden md:block">
				{#if cart?.qty > 0 && !hideCheckoutButton}
					<PrimaryButton
						roundedNone
						type="submit"
						class="group w-full uppercase"
						clickEffect="{false}"
						{loading}
						{disabled}
						on:click="{submit}">
						<span>{text}</span>

						{#if showNextIcon}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 transform transition duration-700 group-hover:translate-x-2"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
									clip-rule="evenodd"></path>
							</svg>
						{/if}
					</PrimaryButton>
				{/if}
			</div>

			<div class="fixed inset-x-0 bottom-0 z-50 block w-full md:hidden">
				{#if cart?.qty > 0 && !hideCheckoutButton}
					<PrimaryButton
						roundedNone
						type="submit"
						class="group w-full uppercase h-14"
						clickEffect="{false}"
						{loading}
						{disabled}
						on:click="{submit}">
						<span>{text}</span>

						{#if showNextIcon}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 transform transition duration-700 group-hover:translate-x-2"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
									clip-rule="evenodd"></path>
							</svg>
						{/if}
					</PrimaryButton>
				{/if}
			</div>
		{/if}
	</section>
{/if}
