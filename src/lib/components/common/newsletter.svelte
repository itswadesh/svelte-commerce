<script lang="ts">
	import Button from '../ui/button/button.svelte'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import Input from '../ui/input/input.svelte'
	import { NewsletterRenderer } from '$lib/core/composables/index.js'

	let email = $state('')
</script>

<NewsletterRenderer bind:email>
	{#snippet content({ loadingForSubmitting, subscribeToNewsletter })}
		<div class="flex flex-col gap-5">
			<div class="space-y-1.5">
				<h3 class="text-sm font-bold uppercase tracking-widest text-foreground">Newsletter</h3>
				<p class="text-sm text-muted-foreground">Subscribe to get the latest arrivals and offers.</p>
			</div>

			<div class="flex flex-col gap-2 sm:flex-row sm:items-center">
				<Input
					type="email"
					placeholder="Enter your email"
					bind:value={email}
					class="h-10 w-full bg-background sm:w-64"
					required
				/>
				<Button
					type="submit"
					class="h-10 w-full sm:w-auto sm:px-8"
					onclick={subscribeToNewsletter}
					disabled={loadingForSubmitting}
				>
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
