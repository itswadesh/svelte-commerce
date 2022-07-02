<script>
import { currency, toast } from '$lib/util'

import { post } from '$lib/util/api'

import { onMount } from 'svelte'
import GradiantButton from '$lib/ui/GradiantButton.svelte'
import { KQL_Stripe } from '$lib/graphql/_kitql/graphqlStores'
import { goto } from '$app/navigation'

let stripeReady = false
let mounted = false
let loading = false
let paySuccess = false
let isCardValid = false
let card
let stripePublishableKey =
	'pk_test_51Jj5DHSEaRwuFSJKGARPZpU4MOhCLVxa8ZjIgMIbbmZLeCMrxzWwhxWEANZCOjuP93CVOoiAgY7M5NiH5UMj9Je200acRFRXb7'
let stripe

export let address
function stopLoading() {
	loading = false
	// console.log('stop loading...........')
}

async function payWithCard(clientSecret, orderId) {
	console.log('clientSecretzzzzzzzzzzzzzzzzzzzzzzzzzzz', clientSecret)
	// This is for 3d authentication
	try {
		loading = true
		const result = await stripe.confirmCardPayment(clientSecret, {
			payment_method: { card: card }
		})
		console.log('Confirm card pay...........', result)
		if (result.error) {
			const errorMessage = result.error.message
			toast(result.error.message, 'error')
		} else if (result.paymentIntent) {
			goto(
				`/products/payment/success?payment_reference_id=${result.paymentIntent.id}&order_id=${orderId}`
			)
		}
	} catch (e) {
		toast(e, 'error')
	} finally {
		loading = false
	}
}

const payWithStripe = async (pm) => {
	try {
		loading = true
		toast('Contacting Payment Server...', 'warning')
		const paymentMethodId = pm.id
		const resStripe = await KQL_Stripe.mutate({
			variables: {
				paymentMethodId,
				address
			}
		})
		if (resStripe.errors) {
			toast(resStripe.errors[0].message, 'error')
			return
		} else {
			const res = resStripe.data?.stripe
			if (!res.paid) {
				// console.log('pay/stripe', res.paid) // Show 3d secure screen
				await payWithCard(res.clientSecret, res?.orderId)
			} else if (res) {
				goto(
					`/products/payment/success?payment_reference_id=${res.referenceId}&order_id=${res?.orderId}`
				)
				paySuccess = true
			}
		}
	} catch (e) {
		toast(e, 'error')
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
	if (mounted) {
		loadStripeElements()
	}
}

function loadStripeElements() {
	// await sleep(500);
	// Create a Stripe client.
	// Note: this merchant has been set up for demo purposes.
	stripe = Stripe(stripePublishableKey)

	// Create an instance of Elements.
	var elements = stripe.elements()

	// Custom styling can be passed to options when creating an Element.
	// (Note that this demo uses a wider set of styles than the guide below.)
	var style = {
		base: {
			padding: '10px 12px',
			color: '#32325d',
			fontFamily:
				'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
			fontSmoothing: 'antialiased',
			fontSize: '16px',
			'::placeholder': {
				color: '#aab7c4'
			}
		},
		invalid: {
			color: '#fa755a'
		}
	}

	// Create an instance of the idealBank Element.
	card = elements.create('card', { style: style })

	// Add an instance of the card Element into the `ideal-bank-element` <div>.
	card.mount('#ideal-bank-element')

	var errorMessage = document.getElementById('error-message')

	// Handle form submission.
	var form = document.getElementById('payment-form')
	card.on('change', function (event) {
		isCardValid = event.complete
		if (event.error) {
			errorMessage.textContent = event.error.message
		} else {
			errorMessage.textContent = ''
		}
	})
	form.addEventListener('submit', function (event) {
		loading = true
		// console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', form.elements['card'])
		event.preventDefault()
		// payWithStripe(card)
		// var sourceData = {
		// 	type: 'card',
		// 	amount: 1099,
		// 	currency: 'eur',
		// 	owner: {
		// 		name: document.querySelector('input[name="name"]').value,
		// 	},
		// 	// Specify the URL to which the customer should be redirected
		// 	// after paying.
		// 	redirect: {
		// 		return_url: 'https://shop.example.com/crtA6B28E1',
		// 	},
		// }

		// Call `stripe.createSource` with the idealBank Element and additional options.
		stripe.createPaymentMethod({ type: 'card', card }).then(async function (result) {
			// console.log('createPaymentMethod...............', result)
			if (result.error) {
				// Inform the customer that there was an error.
				errorMessage.textContent = result.error.message
				errorMessage.classList.add('visible')
				stopLoading()
			} else {
				// Redirect the customer to the authorization URL.
				errorMessage.classList.remove('visible')
				await payWithStripe(result.paymentMethod)
				stopLoading()
			}
		})
	})
}
</script>

<svelte:head>
	<script src="https://js.stripe.com/v3/" on:load="{stripeLoaded}"></script>
</svelte:head>

{#if !paySuccess}
	<form id="payment-form">
		<div class="form-row">
			<label for="ideal-bank-element" class="mb-3 text-lg font-bold tracking-wide">
				Enter Card Details
			</label>

			<div id="ideal-bank-element" class="mt-2">
				<!-- A Stripe Element will be inserted here. -->
			</div>
		</div>

		<script src="https://js.stripe.com/v3/"></script>

		<!-- <button class="bg-green-500 text-white rounded px-4 py-2 shadow-lg">Submit Payment</button> -->

		<GradiantButton
			disabled="{loading || !stripeReady || !isCardValid}"
			type="submit"
			class="mt-5 py-3 px-9">
			Make Payment
		</GradiantButton>

		<!-- Used to display form errors. -->

		<div id="error-message" role="alert" class="mt-4 text-sm text-red-500"></div>
	</form>
{:else}
	<div class="text-green-500 bg-green-200 rounded shadow">Payment Received</div>
{/if}
