<script lang="ts">
	import { CheckCircle2 } from '@lucide/svelte'
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'
	import { goto } from '$app/navigation'
	const enquiryPlugin = $derived(page.data?.store?.plugins?.enquiryMode)
</script>

<svelte:head>
	<title>Enquiry submitted successfully</title>
</svelte:head>

<div class="min-h-screen bg-muted py-12">
	<div class="container mx-auto max-w-3xl px-4">
		<div class="border rounded-lg bg-card p-6 md:p-8">
			<!-- Success Header -->
			<div class="mb-8 text-center">
				<div class="mb-4 flex justify-center">
					<div class="rounded-full bg-success/10 p-3">
						<CheckCircle2 class="h-12 w-12 text-success" />
					</div>
				</div>
				<h1 class="mb-2 page-heading">{enquiryPlugin?.successHeader || 'Thank You For Your Enquiry!'}</h1>
				<p class="text-muted-foreground">{enquiryPlugin?.successMessage || 'We will get back to you soon!'}</p>
				<Button class="mt-5" onclick={() => goto('/products')}>Continue shopping</Button>
			</div>
		</div>
	</div>
</div>
