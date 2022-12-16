<script>
import BackButton from '$lib/ui/BackButton.svelte'
import SaveAddress from '../_SaveAddress.svelte'
import SEO from '$lib/components/SEO/index.svelte'

const seoProps = {
	title: 'Address Details ',
	description: 'Details about the category, name, contact, ratings, message, comments'
}

export let data

// console.log(address)
</script>

<SEO {...seoProps} />

<div>
	<header class="mb-3 flex flex-col-reverse items-start justify-between md:flex-row">
		<h1 class="mb-2 mr-5 text-xl font-bold line-clamp-2 md:text-2xl">
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
