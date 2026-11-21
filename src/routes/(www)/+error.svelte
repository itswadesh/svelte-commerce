<script lang="ts">
	import { page } from '$app/state'
	import Button from '$lib/components/ui/button/button.svelte'
	import { ShoppingBag, Home, ArrowLeft } from '@lucide/svelte'
	import { goto } from '$app/navigation'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
</script>

<SeoHeader metaTitle={`Error ${page.status}`} noindex={true} />

<div class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
	<div class="text-center">
		<div class="mb-4 flex justify-center">
			<ShoppingBag class="h-24 w-24 animate-bounce text-primary" />
		</div>
		<h1 class="page-heading mb-2">{page.status}</h1>
		<h2 class="mb-8 text-2xl font-semibold text-muted-foreground">{page.error?.message || 'Something went wrong'}</h2>
		<p class="mb-8 text-muted-foreground">
			{#if page.status === 404}
				The page you're looking for doesn't exist.
			{:else}
				We encountered an unexpected error. Our team has been notified.
			{/if}
		</p>
		<div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
			<Button
				variant="outline"
				class="gap-2"
				onclick={() => {
					// if (window.history?.length > 1) {
					// 	window.history.back()
					// } else {
					goto('/')
					// }
				}}
			>
				<ArrowLeft class="h-4 w-4" />
				Go back
			</Button>
			<Button class="gap-2" onclick={() => goto('/')}>
				<Home class="h-4 w-4" />
				Return home
			</Button>
		</div>
	</div>
</div>
