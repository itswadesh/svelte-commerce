<script lang="ts">
	import { page } from '$app/state'
	import { MailCheck } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'

	// Set by the footer newsletter form via goto(..., { state: { email } });
	// absent on a direct visit or reload, so the copy falls back to a generic line.
	const email = $derived((page.state as any)?.email)
</script>

<svelte:head>
	<title>Subscription Successful — {page.data?.store?.name || 'Store'}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-[60vh] w-full items-center justify-center bg-background px-4 py-16">
	<div class="w-full max-w-lg text-center">
		<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
			<MailCheck class="h-10 w-10 text-green-600" />
		</div>

		<h1 class="mb-3 text-3xl font-bold tracking-tight text-foreground">Subscription Successful</h1>

		<p class="mb-2 text-base text-muted-foreground">
			{#if email}
				Thanks for subscribing! We've sent a confirmation email to <span class="font-semibold text-foreground">{email}</span>.
			{:else}
				Thanks for subscribing! We've sent you a confirmation email.
			{/if}
		</p>
		<p class="mb-8 text-sm text-muted-foreground">
			Please check your inbox and click the link in that email to confirm your email address. If you don't see it within a few
			minutes, check your spam or promotions folder.
		</p>

		<Button href="/" class="h-12 px-8">Continue Shopping</Button>
	</div>
</div>
