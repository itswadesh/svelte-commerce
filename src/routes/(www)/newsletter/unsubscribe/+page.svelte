<script lang="ts">
	import { page } from '$app/state'
	import { Loader, MailCheck, MailX } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'

	type Unsubscribe = (token: string) => Promise<unknown>

	// The link in a newsletter email lands here. Opening it changes nothing, because mail
	// scanners open every link: the button is what takes the address off the list.
	const token = $derived(page.url.searchParams.get('token') ?? '')
	const storeName = $derived(page.data?.store?.name || 'this store')

	let status = $state<'idle' | 'working' | 'done' | 'error'>('idle')

	async function unsubscribe() {
		if (status === 'working') return
		status = 'working'
		try {
			const { services } = await import('kitcommerce.config')
			// Reflect.get, as the signup box does: a connector without the service fails the call.
			const svc = Reflect.get(services as object, 'newsletterService') as { unsubscribe?: Unsubscribe } | undefined
			if (!svc?.unsubscribe) throw new Error('not available')
			await svc.unsubscribe(token)
			status = 'done'
		} catch {
			status = 'error'
		}
	}
</script>

<svelte:head>
	<title>Unsubscribe — {page.data?.store?.name || 'Store'}</title>
	<meta name="robots" content="noindex" />
	<meta name="referrer" content="no-referrer" />
</svelte:head>

<div class="flex min-h-[60vh] w-full items-center justify-center bg-background px-4 py-16">
	<div class="w-full max-w-lg text-center">
		{#if !token}
			<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
				<MailX class="h-10 w-10 text-muted-foreground" aria-hidden="true" />
			</div>
			<h1 class="mb-3 page-heading">This link is incomplete</h1>
			<p class="text-base text-muted-foreground">Open the unsubscribe link from your email again.</p>
		{:else if status === 'done'}
			<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
				<MailCheck class="h-10 w-10 text-success" aria-hidden="true" />
			</div>
			<h1 class="mb-3 page-heading" role="status">You're unsubscribed</h1>
			<p class="text-base text-muted-foreground">You won't get newsletter emails from {storeName} any more.</p>
		{:else}
			<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
				<MailX class="h-10 w-10 text-muted-foreground" aria-hidden="true" />
			</div>
			<h1 class="mb-3 page-heading">Unsubscribe from {storeName}?</h1>
			<p class="mb-6 text-base text-muted-foreground">You'll stop getting its newsletter. Order updates aren't affected.</p>
			<Button onclick={unsubscribe} disabled={status === 'working'} aria-busy={status === 'working'}>
				{#if status === 'working'}<Loader class="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />{/if}
				Unsubscribe
			</Button>
			{#if status === 'error'}
				<p class="mt-4 text-sm text-destructive" role="alert">That didn't go through. Please try again.</p>
			{/if}
		{/if}
	</div>
</div>
