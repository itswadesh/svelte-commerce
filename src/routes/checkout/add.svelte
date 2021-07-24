<script lang="ts">
import EditAddress from './_EditAddress.svelte'
import CheckoutHeader from './_CheckoutHeader.svelte'
import Pricesummary from '$lib/Pricesummary.svelte'
import { goto } from '$app/navigation'
import { session } from '$app/stores'
import SEO from '$lib/components/SEO/index.svelte'

let address = null
const user = $session.user
console.log(user)
if (!user || !user.email) goto('/login')

const seoProps = {
	title: 'Fill-Address',
	metadescription: 'Add your delivery address',
}
</script>

<SEO {...seoProps} />

<section
	class="container  w-full mx-auto max-w-6xl px-4 sm:px-10 pb-10 py-5 md:py-10 text-gray-800 ">
	<CheckoutHeader selected="address" />
	<div class="mt-10 lg:flex lg:justify-center lg:space-x-20">
		<div class="lg:w-2/3 ">
			<h2 class="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide ">Billing Details</h2>

			<EditAddress id="new" returnUrl="/checkout/address" />
		</div>

		<div class="mt-5 lg:mt-0 lg:w-1/3">
			<h2 class="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide ">Cart Details</h2>

			<Pricesummary btnname="{'Continue'}" />
		</div>
	</div>
</section>
