<script lang="ts">
import { createEventDispatcher, onMount } from 'svelte'
import { fly } from 'svelte/transition'
import { goto } from '$app/navigation'
import { OrdersService } from './../services'
import { page } from '$app/stores'
import { PrimaryButton } from '$lib/ui'
import { toast } from '$lib/utils'
import Error from './Error.svelte'
import type { PaymentMethod } from './../types'

const dispatch = createEventDispatcher()

export let address = null
export let isStripeSelected = false
export let stripePublishableKey: string //process.env.VITE_STRIPE_PUBLISHABLE_KEY

let card: any
let isCardValid = false
let loading = false
let mounted = false
let paySuccess = false
let stripeCardMounting = true
let stripeReady = false

let errorMessage = { text: '', show: false }
let errors
let stripe: any

async function payWithCard(clientSecret: string, orderId: string) {
	// This is for 3d authentication

	try {
		loading = true
		const result = await stripe.confirmCardPayment(clientSecret, {
			payment_method: { card: card }
		})
		if (result.error) {
			errorMessage.show = true
			errorMessage.text = result.error.message
			toast(result.error.message, 'error')
		} else if (result.paymentIntent) {
			errorMessage.show = false
			errorMessage.text = ''
			goto(
				`/payment/success?payment_reference_id=${result.paymentIntent.id}&id=${orderId}&provider=Stripe`
			)
		}
	} catch (e) {
		toast(e, 'error')
	} finally {
		loading = false
	}
}

const payWithStripe = async (pm: PaymentMethod) => {
	try {
		loading = true
		toast('Contacting Payment Server...', 'warning')
		const paymentMethodId = pm.id
		const res: any = await OrdersService.stripeCheckoutService({
			paymentMethodId,
			address,
			cartId: $page.data.cartId,
			storeId: $page.data.store.id,
			origin: $page.data.origin
		})
		if (res.errors) {
			errorMessage = { show: true, text: res.errors[0].message }
			return
		} else {
			if (!res.paid) {
				await payWithCard(res.clientSecret, res?.orderId)
			} else if (res) {
				goto(
					`/payment/success?payment_reference_id=${res.referenceId}&id=${res?.orderId}&provider=Stripe`
				)
				paySuccess = true
			}
		}
	} catch (e: any) {
		errorMessage = { show: true, text: e.toString() }
	} finally {
		loading = false
	}
}

onMount(() => {
	mounted = true

	if (stripeReady) {
		loadStripeElements()
	}
})

function stripeLoaded() {
	stripeCardMounting = true
	stripeReady = true

	if (mounted) {
		loadStripeElements()
	}
}

function submit() {
	loading = true
	stripe.createPaymentMethod({ type: 'card', card }).then(async function (result: any) {
		if (result.error) {
			// Inform the customer that there was an error.
			errorMessage.text = result.error.message
			errorMessage.show = true
		} else {
			// Redirect the customer to the authorization URL.
			errorMessage.show = false
			errorMessage.text = ''
			await payWithStripe(result.paymentMethod)
		}
		loading = false
	})
}

async function loadStripeElements() {
	// @ts-ignore
	stripe = Stripe(stripePublishableKey)
	var elements = stripe.elements()
	card = await elements.create('card', {})
	await card.mount('#mount-point-for-stripe-elements')
	stripeCardMounting = false
	card.on('change', function (event: any) {
		isCardValid = event.complete
		dispatch('isStripeCardValid', isCardValid)
		if (event.error) {
			errorMessage.show = true
			errorMessage.text = event.error.message
		} else {
			errorMessage.show = false
			errorMessage.text = ''
		}
	})
}
</script>

<svelte:head>
	<script src="https://js.stripe.com/v3/" on:load="{stripeLoaded}"></script>
</svelte:head>

{#if stripeReady}
	<form
		transition:fly="{{ y: 50, duration: 150 }}"
		on:submit|preventDefault="{submit}"
		class="flex flex-col gap-4
		{isStripeSelected ? 'block' : 'hidden'}">
		<script src="https://js.stripe.com/v3/"></script>

		{#if errorMessage.show}
			<Error err="{errorMessage.text}" />
		{/if}

		<label for="mount-point-for-stripe-elements" class="font-semibold">
			{#if stripeCardMounting}
				Please wait...
			{:else}
				Enter Card Details
			{/if}
		</label>

		<div id="mount-point-for-stripe-elements">
			<!-- A Stripe Element will be inserted here. -->
		</div>

		<div id="error-message" role="alert" class="text-sm text-red-500"></div>

		<PrimaryButton
			type="submit"
			{loading}
			disabled="{loading || !stripeReady || !isCardValid}"
			class="w-60">
			Make Payment
		</PrimaryButton>
	</form>
{:else}
	<div
		transition:fly="{{ y: 50, duration: 150 }}"
		class="rounded border border-yellow-500 bg-yellow-50 p-4 text-yellow-500 text-sm">
		Warn: Pleae wait...Stripe is getting ready .
	</div>
{/if}
