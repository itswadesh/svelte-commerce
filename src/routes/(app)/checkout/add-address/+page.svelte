<script>
import { goto } from '$app/navigation'
import { BackButton } from '$lib/ui'
import SaveAddress from '../../my/addresses/_SaveAddress.svelte'
import SEO from '$lib/components/SEO/index.svelte'

const seoProps = {
	title: 'Address Details ',
	description: 'Details about the category, name, contact, ratings, message, comments'
}

export let data

function redirectToCheckout({ detail }) {
	if (detail.id === 'new' && detail.newAddressId) {
		goto(`/checkout/payment-options?address=${detail.newAddressId}`)
	}
}
</script>

<SEO {...seoProps} />

<div class="container mx-auto min-h-screen max-w-3xl p-3 py-5 sm:p-10">
	<header class="mb-5 flex flex-wrap-reverse items-start md:items-center justify-between gap-2">
		<h3>
			{#if data.id === 'new'}
				Add New Address
			{:else}
				Edit Address
			{/if}
		</h3>

		<BackButton to="/checkout/address" />
	</header>

	<SaveAddress
		shipping_address="{data.address}"
		countries="{data.countries}"
		states="{data.states}"
		on:saved="{({ detail }) => redirectToCheckout({ detail })}" />
</div>
