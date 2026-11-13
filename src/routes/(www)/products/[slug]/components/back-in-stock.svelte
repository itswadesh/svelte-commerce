<script lang="ts">
	import { services } from 'kitcommerce.config'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input/index.js'
	import Spinner from '$lib/components/common/spinner.svelte'
	import { Check } from '@lucide/svelte'
	import { fade } from '$lib/motion'
	import { askRestockAlert } from '$lib/product/store-facts'

	/**
	 * "Notify me" for a sold-out size (audit SNX-025, GoCommerce D248). Shown only while the store asks
	 * for an address on wishlists, the setting that makes the engine write when a saved item is back.
	 */
	let { productId, variantId = null, label = '' }: { productId: string; variantId?: string | null; label?: string } = $props()

	let email = $state('')
	let sending = $state(false)
	let sentTo = $state('')
	let error = $state('')

	// Another size is another request: what was saved for M does not stand for S.
	$effect(() => {
		void variantId
		sentTo = ''
		error = ''
	})

	async function submit(event: SubmitEvent) {
		event.preventDefault()
		const address = email.trim()
		if (!address) return
		error = ''
		sending = true
		try {
			await askRestockAlert(services as object, { productId, variantId, email: address })
			sentTo = address
		} catch (err) {
			error = err instanceof Error && err.message ? err.message : "We couldn't save that. Try again."
		} finally {
			sending = false
		}
	}
</script>

<div class="rounded-radius border border-border p-3" data-testid="back-in-stock" in:fade>
	{#if sentTo}
		<p class="flex items-start gap-2 text-sm text-foreground" role="status" in:fade>
			<Check class="motion-pop-in mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
			<span>Saved to your wishlist. We'll email {sentTo} when it's back.</span>
		</p>
	{:else}
		<form class="flex flex-col gap-2" onsubmit={submit}>
			<label for="back-in-stock-email" class="text-sm font-medium text-foreground">
				{label ? `${label} is sold out.` : 'Sold out.'} Get an email when it's back.
			</label>
			<div class="flex gap-2">
				<Input
					id="back-in-stock-email"
					type="email"
					autocomplete="email"
					inputmode="email"
					required
					bind:value={email}
					class="h-11 min-w-0 flex-1 md:h-10"
					aria-invalid={error ? 'true' : undefined}
					aria-describedby={error ? 'back-in-stock-error' : undefined}
				/>
				<Button type="submit" class="motion-press h-11 shrink-0 md:h-10" disabled={sending} aria-busy={sending}>
					{#if sending}<Spinner label="Saving" />{/if}
					Notify me
				</Button>
			</div>
			{#if error}
				<p id="back-in-stock-error" class="bis-error text-sm text-destructive" role="alert" in:fade>{error}</p>
			{/if}
		</form>
	{/if}
</div>

<style>
	@media (prefers-reduced-motion: no-preference) {
		.bis-error {
			animation: bis-shake 240ms ease-out both;
		}
	}
	@keyframes bis-shake {
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}
</style>
