<script lang="ts">
import { currency, toast } from '$lib/utils'
import { createEventDispatcher, onMount } from 'svelte'
import { goto } from '$app/navigation'
import GrnIndGradiantButton from './ui/GrnIndGradiantButton.svelte'
import { post } from '$lib/utils/api'
import { page } from '$app/stores'
import { stripeCheckoutService } from './services/OrdersService'
import type { Error, PaymentMethod } from './types'
let stripeReady = false
let mounted = false
let loading = false
let paySuccess = false
let isCardValid = false
let stripeCardMounting = true
let card:any
export let stripePublishableKey:string //process.env.VITE_STRIPE_PUBLISHABLE_KEY
let stripe:any,
	errors,
	errorMessage = { text: '', show: false }
const dispatch = createEventDispatcher()

export let address = '',
	isStripeSelected = false

async function payWithCard(clientSecret:string, orderId:string) {
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
				`/payment/success?payment_reference_id=${result.paymentIntent.id}&order_id=${orderId}&provider=Stripe`
			)
		}
	} catch (e) {
		toast(e, 'error')
	} finally {
		loading = false
	}
}

const payWithStripe = async (pm:PaymentMethod) => {
	try {
		loading = true
		toast('Contacting Payment Server...', 'warning')
		const paymentMethodId = pm.id
		const resStripe:any = stripeCheckoutService({
			paymentMethodId,
			address,
			storeId: $page.data.store?.id,
			origin: $page.data.origin
		})
		if (resStripe.errors) {
			errorMessage = { show: true, text: resStripe.errors[0].message }
			return
		} else {
			const res = resStripe.data?.stripe
			if (!res.paid) {
				await payWithCard(res.clientSecret, res?.orderId)
			} else if (res) {
				goto(
					`/payment/success?payment_reference_id=${res.referenceId}&order_id=${res?.orderId}&provider=Stripe`
				)
				paySuccess = true
			}
		}
	} catch (e:any) {
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
	stripeReady = true
	stripeCardMounting = true
	if (mounted) {
		loadStripeElements()
	}
}
function submit() {
	loading = true
	stripe.createPaymentMethod({ type: 'card', card }).then(async function (result:any) {
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
	card.on('change', function (event:any) {
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

{#if errorMessage.show}
	<div class="rounded border-red-300 bg-red-100 px-4 py-2 text-red-500 shadow">
		{errorMessage.text}
	</div>
{/if}
{#if stripeReady}
	<form
		on:submit|preventDefault="{submit}"
		class="{!isStripeSelected ? 'hidden' : 'block'} my-4 rounded border px-8 py-4 shadow-lg"
	>
		<div class="form-row">
			<label for="mount-point-for-stripe-elements" class="mb-3 text-lg font-bold tracking-wide">
				{#if stripeCardMounting} Please wait... {:else} Enter Card Details {/if}
			</label>

			<div id="mount-point-for-stripe-elements" class="mt-2">
				<!-- A Stripe Element will be inserted here. -->
			</div>
		</div>

		<script src="https://js.stripe.com/v3/"></script>

		<GrnIndGradiantButton
			loading="{loading}"
			disabled="{loading || !stripeReady || !isCardValid}"
			type="submit"
			class="mt-5 py-3 px-9"
		>
			Make Payment
		</GrnIndGradiantButton>

		<div id="error-message" role="alert" class="mt-4 text-sm text-red-500"></div>
	</form>
{:else}
	<div class="rounded bg-green-200 text-blue-500 shadow">Pleae wait...</div>
{/if}
