<script lang="ts">
	import { page } from '$app/state'
	import { env } from '$env/dynamic/public'
	import { fade, fly } from '$lib/motion'
	import Button from '$lib/components/ui/button/button.svelte'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Textarea } from '$lib/components/ui/textarea'
	import { CheckCircle, Flag } from '@lucide/svelte'

	// A shopper tells the platform about a store or a listing that breaks its rules. The engine
	// keeps it as a case for the platform's owner to review (GoCommerce D290); the store itself is
	// not told who reported it. Sent from the browser, through the engine proxy path when this
	// storefront has one (hooks.server.ts forwards the shopper's address) or straight to /api on this
	// host, where a hosted engine answers. Either way the engine's per-address limit counts each
	// shopper, not this server.
	const reasons = [
		{ value: 'prohibited', label: 'Sells something not allowed' },
		{ value: 'scam', label: 'Took money, did not deliver' },
		{ value: 'counterfeit', label: 'Fake or copied brand' },
		{ value: 'offensive', label: 'Offensive content' },
		{ value: 'other', label: 'Something else' }
	]

	let reason = $state('')
	let details = $state('')
	let email = $state('')
	const product = page.url.searchParams.get('product') ?? ''
	let busy = $state(false)
	let error = $state('')
	let sent = $state(false)

	const needsDetails = $derived(reason === 'other' && !details.trim())

	async function send(e: SubmitEvent) {
		e.preventDefault()
		if (!reason) {
			error = 'Choose what is wrong.'
			return
		}
		if (needsDetails) {
			error = 'Say what is wrong in a few words.'
			return
		}
		busy = true
		error = ''
		try {
			const base = (env.PUBLIC_GOCOMMERCE_PROXY_PATH || '').replace(/\/+$/, '')
			const res = await fetch(`${base}/api/store/report`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ reason, product, details: details.trim(), email: email.trim() })
			})
			if (res.status === 429) throw new Error('Too many reports from here just now. Please try again in an hour.')
			if (!res.ok) {
				const body = await res.json().catch(() => null)
				throw new Error(body?.message || body?.error?.message || 'The report did not go through. Please try again.')
			}
			sent = true
		} catch (err) {
			error = err instanceof Error ? err.message : 'The report did not go through. Please try again.'
		} finally {
			busy = false
		}
	}
</script>

<svelte:head>
	<title>Report this store</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="page-width py-6 md:py-10">
	<div class="mx-auto max-w-xl">
		{#if sent}
			<div class="rounded-lg border bg-card p-6 text-center" in:fly={{ y: 8 }}>
				<CheckCircle class="mx-auto mb-3 h-8 w-8 text-success" aria-hidden="true" />
				<h1 class="text-[length:var(--type-page-title)] font-semibold">Thank you, it was sent</h1>
				<p class="mt-2 text-muted-foreground">The platform this store runs on reviews every report. The store is not told who sent it.</p>
				<a href="/" class="mt-4 inline-block text-sm font-semibold text-primary underline underline-offset-2">Back to the store</a>
			</div>
		{:else}
			<h1 class="flex items-center gap-2 text-[length:var(--type-page-title)] font-semibold">
				<Flag class="h-5 w-5" aria-hidden="true" />
				Report this store
			</h1>
			<p class="mt-2 text-muted-foreground">
				Tell the platform this store runs on if it sells something it should not, or did not deliver what you paid for. The store is not told who sent
				it.
			</p>

			<form class="mt-5 space-y-5" onsubmit={send} novalidate>
				<fieldset>
					<legend class="mb-2 text-sm font-semibold">What is wrong?</legend>
					<div class="grid gap-2 sm:grid-cols-2" role="radiogroup">
						{#each reasons as r (r.value)}
							<label
								class="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors duration-fast ease-standard has-[:checked]:border-primary has-[:checked]:bg-muted has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring hover:bg-muted"
							>
								<input type="radio" name="reason" value={r.value} bind:group={reason} class="accent-primary" />
								{r.label}
							</label>
						{/each}
					</div>
				</fieldset>

				{#if product}
					<p class="text-sm text-muted-foreground">About the product: <span class="font-medium text-foreground">{product}</span></p>
				{/if}

				<div>
					<Label for="report-details">Details {reason === 'other' ? '' : '(optional)'}</Label>
					<Textarea
						id="report-details"
						class="mt-1.5 text-base sm:text-sm"
						rows={4}
						maxlength={1000}
						bind:value={details}
						placeholder="What did you see, and on which page?"
					/>
				</div>

				<div>
					<Label for="report-email">Your email (optional)</Label>
					<Input id="report-email" class="mt-1.5 text-base sm:text-sm" type="email" autocomplete="email" maxlength={200} bind:value={email} />
					<p class="mt-1 text-xs text-muted-foreground">Only if you are happy to be asked a question about it.</p>
				</div>

				{#if error}
					<p class="text-sm text-destructive" role="alert" in:fade>{error}</p>
				{/if}

				<Button type="submit" class="min-h-11 w-full sm:w-auto" disabled={busy} aria-busy={busy}>
					{busy ? 'Sending…' : 'Send report'}
				</Button>
			</form>
		{/if}
	</div>
</div>
