<script>
import { goto } from '$app/navigation'
import BackButton from '$lib/ui/BackButton.svelte'
import SaveAddress from '../_SaveAddress.svelte'
import SEO from '$lib/components/SEO/index.svelte'

const seoProps = {
	title: 'Address Details ',
	description: 'Details about the category, name, contact, ratings, message, comments'
}

export let data

function redirectToNewAddressDetailsPage({ detail }) {
	// console.log('{detail}', { detail })

	if (detail.id === 'new' && detail.newAddressId) {
		goto(`/my/addresses/${detail.newAddressId}`)
	}
}
</script>

<SEO {...seoProps} />

<div>
	<header
		class="mb-5 flex flex-col-reverse items-start md:items-center justify-between md:flex-row gap-2">
		<h1 class="text-xl font-medium md:text-2xl lg:text-3xl">
			{#if data.id === 'new'}
				<span> Add New Address </span>
			{:else if !data.address?.title}
				<span>Address Details</span>
			{:else}
				<span> Address Details of "{data.address?.title}"</span>
			{/if}
		</h1>

		<BackButton to="/my/addresses?sort=-updatedAt" />
	</header>

	<SaveAddress
		address="{data.address}"
		countries="{data.countries}"
		states="{data.states}"
		on:saved="{({ detail }) => redirectToNewAddressDetailsPage({ detail })}" />
</div>
