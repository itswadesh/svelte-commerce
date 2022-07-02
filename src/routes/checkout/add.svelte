<script context="module" lang="ts">
import type { Load } from '@sveltejs/kit'
export const load: Load = async ({ url, session }) => {
	if (!session?.me) {
		return {
			redirect: `/${loginUrl}?ref=${url.pathname}`,
			status: 302
		}
	}
	return {}
}
</script>

<script lang="ts">
import EditAddress from './_EditAddress.svelte'
import CheckoutHeader from './_CheckoutHeader.svelte'
import Pricesummary from '$lib/Pricesummary.svelte'
import { goto } from '$app/navigation'
import { session } from '$app/stores'
import SEO from '$lib/components/SEO/index.svelte'
import { loginUrl } from '$lib/store'

let address = null

const seoProps = {
	title: 'Fill-Address',
	metadescription: 'Add your delivery address'
}
</script>

<SEO {...seoProps} />

<section
	class="container  mx-auto w-full max-w-6xl px-4 py-5 pb-10 text-gray-800 sm:px-10 md:py-10 ">
	<CheckoutHeader selected="address" />
	<div class="mt-10 lg:flex lg:justify-center lg:space-x-20">
		<div class="lg:w-2/3 ">
			<h2 class="text-2xl font-bold tracking-wide md:text-3xl lg:text-4xl ">Billing Details</h2>

			<EditAddress id="new" returnUrl="/checkout/address" />
		</div>

		<div class="mt-5 lg:mt-0 lg:w-1/3">
			<h2 class="text-2xl font-bold tracking-wide md:text-3xl lg:text-4xl ">Cart Details</h2>

			<Pricesummary btnname="{'Continue'}" />
		</div>
	</div>
</section>
