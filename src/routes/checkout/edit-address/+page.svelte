<script lang="ts">
import EditAddress from '../_EditAddress.svelte'
import Pricesummary from '$lib/Pricesummary.svelte'
import CheckoutHeader from '../_CheckoutHeader.svelte'
import SEO from '$lib/components/SEO/index.svelte'

export let data
let { id } = data
$: ({ id } = data)

const seoProps = {
	title: 'Edit-Address',
	metadescription: 'Edit your privious address'
}
</script>

<SEO {...seoProps} />

<div class="">
	<div class="bg-gray-50">
		<CheckoutHeader selected="address" />
		<div class="lg:container lg:mx-auto">
			<div class="mx-auto flex w-full flex-col pb-14 sm:pb-20 lg:flex-row">
				<div class="container mx-auto w-full lg:w-2/3">
					<span
						class="
                mx-auto
                my-4
                hidden
                text-center text-2xl text-gray-500
                sm:flex
                lg:text-start
              ">
						Edit Address
					</span>
					<div class="overflow-auto rounded border bg-white p-2 shadow md:p-5">
						<EditAddress id="{id}" returnUrl="/checkout/address" />
					</div>
				</div>
				<div
					class="
              container
              relative
              mx-auto
              mt-6
              w-full
              sm:px-2
              lg:mt-0
              lg:w-1/3
              lg:ms-8
            ">
					<span
						class="
                mx-auto
                my-4
                hidden
                text-center text-2xl text-gray-500
                sm:flex
                lg:text-start
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
