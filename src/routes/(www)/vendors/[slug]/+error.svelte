<script lang="ts">
	import { page } from '$app/state'
	import Button from '$lib/components/ui/button/button.svelte'
	import { ShoppingBag, Home, ArrowLeft } from 'lucide-svelte'
	import { goto } from '$app/navigation'
</script>

<div class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
	<div class="text-center">
		<div class="mb-4 flex justify-center">
			<ShoppingBag class="h-24 w-24 animate-bounce text-primary" />
		</div>
		<h1 class="mb-2 text-6xl font-bold text-primary">{page.status}</h1>
		<h2 class="mb-8 text-2xl font-semibold text-gray-600">{page.error?.message || 'Something went wrong'}</h2>
		<p class="mb-8 text-gray-500">
			{#if page.status === 404}
				The vendor you're looking for doesn't exist.
			{:else}
				We encountered an unexpected error. Our team has been notified.
			{/if}
		</p>
		<div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
			<Button
				variant="outline"
				class="gap-2"
				onclick={() => {
					goto('/vendors')
				}}
			>
				<ArrowLeft class="h-4 w-4" />
				Go Back
			</Button>
			<Button class="gap-2" onclick={() => goto('/')}>
				<Home class="h-4 w-4" />
				Return Home
			</Button>
		</div>
	</div>
</div>
