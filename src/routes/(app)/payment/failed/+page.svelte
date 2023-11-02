<script>
import { page } from '$app/stores'
import { PrimaryButton } from '$lib/ui'
import noCancle from '$lib/assets/no/cancle.png'
import SEO from '$lib/components/SEO/index.svelte'

let seoProps = {
	title: `Payment Failure`,
	description: `Payment Failure`
}

let addressId = $page.url.searchParams.get('address')
let ordrNo = $page.url.searchParams.get('order_no')
</script>

<SEO {...seoProps} />

<div class="min-h-screen w-full">
	<div class="flex flex-col items-center justify-center gap-5 py-20 text-center">
		<div>
			<img src="{noCancle}" alt="failed" class="h-auto w-20 object-contain object-top" />
		</div>

		<h1>Payment Failed!</h1>

		<a
			href="/checkout/payment-options?address={addressId}&order_no={ordrNo}"
			aria-label="Click to go back to payment method"
			data-sveltekit-preload-data>
			<PrimaryButton class="uppercase">Pay Again</PrimaryButton>
		</a>
	</div>
</div>
