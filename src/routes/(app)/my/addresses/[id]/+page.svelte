<script>
import SEO from '$lib/components/SEO/index.svelte'
import SaveAddress from '../_SaveAddress.svelte'
import BackButton from '$lib/ui/BackButton.svelte'

const seoProps = {
	title: 'Address Details ',
	description: 'Details about the category, name, contact, ratings, message, comments'
}

export let data

// console.log(address)
</script>

<SEO {...seoProps} />

<div class="text-gray-800">
	<header class="mb-3 flex flex-col-reverse items-start justify-between md:flex-row">
		<h1 class="line-clamp-2 mb-2 mr-5 text-xl font-bold md:text-2xl">
			{#if data.id === 'new'}
				<span> Add New Address </span>
			{:else if !data.address?.title}
				<span>Address Details</span>
			{:else}
				<span> Address Details of "{data.address?.title}"</span>
			{/if}
		</h1>

		<div class="mb-2 md:my-2">
			<BackButton to="/my/addresses?sort=-updatedAt" class="" />
		</div>
	</header>

	<SaveAddress address="{data.address}" countries="{data.countries}" states="{data.states}" />
</div>
