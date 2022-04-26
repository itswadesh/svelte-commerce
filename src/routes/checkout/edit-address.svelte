<script context="module" lang="ts">
export async function load({ url, params, fetch }) {
	const id = +url.searchParams.get('id')
	return {
		props: {
			id
		}
	}
}
</script>

<script lang="ts">
import EditAddress from './_EditAddress.svelte'
import Pricesummary from '$lib/Pricesummary.svelte'
import CheckoutHeader from './_CheckoutHeader.svelte'
import SEO from '$lib/components/SEO/index.svelte'

export let id

const seoProps = {
	title: 'Edit-Address',
	metadescription: 'Edit your privious address'
}
</script>

<SEO {...seoProps} />

<div class="">
	<div class="bg-gray-50">
		<CheckoutHeader selected="address" />
		<div class="lg:mx-auto lg:container">
			<div class="flex flex-col w-full mx-auto pb-14 sm:pb-20 lg:flex-row">
				<div class="container w-full mx-auto lg:w-2/3">
					<span
						class="
                hidden
                mx-auto
                my-4
                text-2xl text-center text-gray-500
                lg:text-start
                sm:flex
              ">
						Edit Address
					</span>
					<div class="p-2 overflow-auto bg-white border rounded shadow md:p-5">
						<EditAddress id="{id}" returnUrl="/checkout/address" />
					</div>
				</div>
				<div
					class="
              container
              relative
              w-full
              mx-auto
              mt-6
              sm:px-2
              lg:ms-8
              lg:w-1/3
              lg:mt-0
            ">
					<span
						class="
                hidden
                mx-auto
                my-4
                text-2xl text-center text-gray-500
                lg:text-start
                sm:flex
              ">
						Cart Details
					</span>
					<Pricesummary
						btnname="{'Continue'}"
						nextpage="{`/checkout/payment-options?address=${id}`}"
						cls="bg-white border rounded shadow" />
				</div>
			</div>
		</div>
	</div>
</div>
