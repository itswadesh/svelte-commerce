<script lang="ts">
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'
	import { cartService } from '$lib/core/services'
	import { formatPrice } from '$lib/utils/price'
	import { fade, slide } from '$lib/motion'
	import { Gift } from '@lucide/svelte'

	/**
	 * The gift card box (GoCommerce D250). The engine checks the code, and its refusal is shown as it
	 * says it: a code that does not exist, has run out, has expired or is in another currency. What
	 * the card pays comes from checkout's quote, in the price summary, not from here.
	 */
	type Card = { last4: string; balance: number } | null
	type GiftCards = {
		applyGiftCard?: (args: { cartId?: string; code: string }) => Promise<any>
		removeGiftCard?: (cartId?: string) => Promise<any>
	}

	let { cartState }: { cartState: { cart?: { id?: string; giftCard?: Card } | null } } = $props()

	const svc = cartService as unknown as GiftCards
	const supported = typeof svc.applyGiftCard === 'function' && typeof svc.removeGiftCard === 'function'
	const card = $derived(cartState.cart?.giftCard ?? null)
	const currencyCode = $derived(page?.data?.store?.currency?.code)

	let code = $state('')
	let busy = $state(false)
	let error = $state('')

	async function apply(e: SubmitEvent) {
		e.preventDefault()
		if (!code.trim() || busy) return
		busy = true
		error = ''
		try {
			cartState.cart = await svc.applyGiftCard!({ cartId: cartState.cart?.id, code })
			code = ''
		} catch (err) {
			error = (err as Error)?.message || 'That gift card could not be added. Please try again.'
		} finally {
			busy = false
		}
	}

	async function remove() {
		busy = true
		error = ''
		try {
			cartState.cart = await svc.removeGiftCard!(cartState.cart?.id)
		} catch (err) {
			error = (err as Error)?.message || 'That gift card could not be taken off. Please try again.'
		} finally {
			busy = false
		}
	}
</script>

{#if supported}
	<section class="rounded-radius border border-border bg-background p-4" aria-labelledby="gift-card-title" data-testid="gift-card-box">
		<h2 id="gift-card-title" class="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
			<Gift class="size-4 text-primary" aria-hidden="true" />
			Gift card
		</h2>
		{#if card}
			<div class="flex items-center justify-between gap-3" in:fade>
				<p class="min-w-0 text-sm text-foreground">
					<span class="font-mono font-semibold">…{card.last4}</span>
					<span class="text-muted-foreground">· {formatPrice(card.balance, currencyCode)} on it</span>
				</p>
				<Button variant="outline" class="gift-press h-11 shrink-0" disabled={busy} onclick={remove}>
					{busy ? 'Removing…' : 'Remove'}
				</Button>
			</div>
		{:else}
			<form class="flex gap-2" onsubmit={apply} in:fade>
				<label for="gift-card-code" class="sr-only">Gift card code</label>
				<input
					id="gift-card-code"
					bind:value={code}
					autocomplete="off"
					autocapitalize="characters"
					spellcheck="false"
					placeholder="Enter gift card code"
					aria-invalid={!!error}
					aria-describedby={error ? 'gift-card-error' : undefined}
					class="h-11 min-w-0 flex-1 rounded-radius border border-border bg-background px-3 font-mono text-sm uppercase text-foreground transition-[border-color,box-shadow] duration-fast placeholder:font-sans placeholder:normal-case placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
				/>
				<Button type="submit" variant="outline" class="gift-press h-11 shrink-0" disabled={busy || !code.trim()}>
					{busy ? 'Checking…' : 'Apply'}
				</Button>
			</form>
		{/if}
		{#if error}
			<p id="gift-card-error" role="alert" class="mt-2 text-sm font-medium text-destructive" transition:slide>{error}</p>
		{/if}
	</section>
{/if}

<style>
	:global(.gift-press) {
		transition: transform var(--motion-fast, 150ms) ease;
	}
	:global(.gift-press:active:not(:disabled)) {
		transform: scale(0.96);
	}
	@media (prefers-reduced-motion: reduce) {
		:global(.gift-press:active:not(:disabled)) {
			transform: none;
		}
	}
</style>
