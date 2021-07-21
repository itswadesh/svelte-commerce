<script lang="ts">
import EditAddress from './_EditAddress.svelte'
import CheckoutHeader from './_CheckoutHeader.svelte'
import Pricesummary from '$lib/Pricesummary.svelte'
import { goto } from '$app/navigation'
import { session } from '$app/stores'

let address = null
const user = $session.user
console.log(user)
if (!user || !user.email) goto('/login')
</script>

<div class="container relative mx-auto">
	<div>
		<CheckoutHeader selected="{'address'}" />
		<div>
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
						Billing Details
					</span>
					<EditAddress id="new" returnUrl="/checkout/address" />
				</div>
				<div
					class="
              container
              relative
              w-full
              mx-auto
              mt-6
              lg:ms-4
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
					<div class="bg-white border rounded shadow">
						<Pricesummary btnname="{'Continue'}" />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
