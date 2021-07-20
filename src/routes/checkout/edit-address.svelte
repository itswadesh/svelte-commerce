
<script context="module" lang="ts">
export async function load({ page: { host, path, params, query }, fetch }) {
	const id = +query.get('id')
	return {
		props: {
			id,
		},
	}
}
</script>
<script lang="ts">
import EditAddress from './_EditAddress.svelte'
import Pricesummary from '$lib/Pricesummary.svelte'
import CheckoutHeader from '/_CheckoutHeader.svelte'
export let id
</script>

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
              "
            >
              Edit Address
            </span>
            <EditAddress
              :id="$route.query.id"
              class="p-2 overflow-auto bg-white border rounded shadow md:p-5"
              :return-url="'/checkout/address'"
            />
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
            "
          >
            <span
              class="
                hidden
                mx-auto
                my-4
                text-2xl text-center text-gray-500
                lg:text-start
                sm:flex
              "
            >
              Cart Details
            </span>
            <Pricesummary
              btnname={'Continue'}
              nextpage="{`/checkout/payment-options?address=${id}`}"
              cls="bg-white border rounded shadow"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
