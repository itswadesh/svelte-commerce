<script lang="ts">
import { spring } from 'svelte/motion'
import { createEventDispatcher } from 'svelte'
import { currency } from '$lib/utils'
import { goto } from '$app/navigation'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'

const dispatch = createEventDispatcher()

export let cart
export let disabled = false
export let hideCheckoutButton = false
export let loading = false
export let nextpage = null
export let showNextIcon = false
export let text = 'Proceed to checkout'

function modulo(n, m) {
	// handle negative numbers
	return ((n % m) + m) % m
}

function submit() {
	dispatch('submit')
}
</script>

{#if cart}
	<section class="my-5 border-t  border-zinc-200 py-5">
		<h5 class="text-xl font-bold capitalize tracking-wide">
			<span>Price Summary</span>

			<span class="text-sm font-medium">
				({cart.qty}
				{#if cart.qty > 1} items {:else} item {/if})
			</span>
		</h5>

		<h6 class="mt-1 text-xs tracking-wider text-zinc-400">Includes all government taxes</h6>

		<div class="mt-3">
			<div class="mt-2 flex items-center justify-between font-medium">
				<h4>Total</h4>

				<h4>{cart.formattedAmount?.subtotal || '-'}</h4>
			</div>

			{#if cart?.savings > 0}
				<div class="mt-2 flex items-center justify-between font-medium text-green-500">
					<h4>You Saved</h4>

					<h4>
						{currency(cart?.savings)}
					</h4>
				</div>
			{/if}

			<div class="mt-2 flex items-center justify-between font-medium">
				<h4>Discount</h4>

				<h4 class="text-green-500">
					{#if cart?.discount?.amount > 0}
						- {currency(cart?.discount?.amount)}
					{:else}
						0
					{/if}
				</h4>
			</div>

			{#if cart?.formattedAmount?.tax}
				<div class="mt-2 flex items-center justify-between font-medium">
					<h4>Tax</h4>

					<div>{cart?.formattedAmount?.tax}</div>
				</div>
			{/if}

			<div class="mt-2 flex items-center justify-between font-medium">
				<h4>Shipping</h4>

				<h4>
					{#if cart.shipping?.charge < 1}
						<span class="text-green-500">Free</span>
					{:else}
						{currency(cart.shipping?.charge)}
					{/if}
				</h4>
			</div>

			<!-- <p class="d mt-1 text-xs tracking-wider text-zinc-400">
				Free shipping on orders of ₹999 or more. For first purchase,
				<a href="##" aria-label="Click to see all available offers" class="underline hover:text-primary-500">See Offer</a>
			</p> -->
		</div>

		<hr class="my-5 border-t border-dashed border-zinc-200" />

		{#if cart.subtotal}
			<div class="my-2 mb-5 flex items-center justify-between text-lg font-bold ">
				<h4>Total Amount</h4>

				{cart.formattedAmount?.total}
			</div>
		{/if}

		<div class="hidden md:block">
			{#if cart.qty > 0 && !hideCheckoutButton}
				{#if nextpage}
					<a href="{nextpage}">
						<PrimaryButton class="group w-full uppercase" loading="{loading}" disabled="{disabled}">
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
					</a>
				{:else}
					<PrimaryButton
						type="submit"
						class="w-full uppercase"
						loading="{loading}"
						disabled="{disabled}"
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
			{/if}
		</div>

		<div class="fixed inset-x-0 bottom-0 z-50 block w-full md:hidden">
			{#if cart.qty > 0 && !hideCheckoutButton}
				{#if nextpage}
					<a href="{nextpage}">
						<PrimaryButton
							roundedNone
							class="w-full uppercase"
							loading="{loading}"
							disabled="{disabled}">
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
					</a>
				{:else}
					<PrimaryButton
						roundedNone
						type="submit"
						class="w-full uppercase"
						loading="{loading}"
						disabled="{disabled}"
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
			{/if}
		</div>
	</section>
{/if}
