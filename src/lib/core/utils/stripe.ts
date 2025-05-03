/**
 * This is a singleton to ensure we only instantiate Stripe once.
 */
import { env } from '$env/dynamic/public'
import { loadStripe } from '@stripe/stripe-js'
// import env from '$env/static/public'

let stripePromise

const getStripe = () => {
	stripePromise = loadStripe(env.STRIPE_PUBLISHABLE_KEY)
	return stripePromise
}

export default getStripe
