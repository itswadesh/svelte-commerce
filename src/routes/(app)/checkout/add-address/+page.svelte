<script>
import BackButton from '$lib/ui/BackButton.svelte'
import SaveAddress from '../../my/addresses/_SaveAddress.svelte'
import SEO from '$lib/components/SEO/index.svelte'

const seoProps = {
	title: 'Address Details ',
	description: 'Details about the category, name, contact, ratings, message, comments'
}

export let data

// console.log('zzzzzzzzzzzzzzzzzz', data)
</script>

<SEO {...seoProps} />

<div class="container mx-auto min-h-screen max-w-3xl p-3 py-5 sm:p-10">
	<header
		class="mb-5 flex flex-col-reverse items-start md:items-center justify-between md:flex-row gap-2">
		<h1 class="text-xl font-medium md:text-2xl lg:text-3xl">
			{#if data.id === 'new'}
				<span> Add New Address </span>
			{:else}
				<span> Edit Address </span>
			{/if}
		</h1>

		<div class="mr-3">
			<BackButton to="/checkout/address" class="" />
		</div>
	</header>

	<SaveAddress address="{data.address}" countries="{data.countries}" states="{data.states}" />
</div>
