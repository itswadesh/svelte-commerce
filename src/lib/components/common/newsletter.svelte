<script lang="ts">
	import Button from '../ui/button/button.svelte'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import Input from '../ui/input/input.svelte'
	import { NewsletterRenderer } from '$lib/core/composables/index.js'

	let email = $state('')
</script>

<NewsletterRenderer bind:email>
	{#snippet content({ loadingForSubmitting, subscribeToNewsletter })}
		<div class="intra-gap flex flex-col">
			<h3>Keep up to date</h3>
			<div class="intra-gap flex flex-col md:flex-row md:items-center">
				<Input placeholder="Your email" bind:value={email} />
				<Button class="sm:min-w-40" onclick={subscribeToNewsletter}>
					{#if loadingForSubmitting}
						<LoadingDots />
					{:else}
						Subscribe
					{/if}
				</Button>
			</div>
		</div>
	{/snippet}
</NewsletterRenderer>
