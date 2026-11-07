<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { formatPrice } from '$lib/utils/price'
	import { fade } from '$lib/motion'
	import { Check, Copy, Gift } from '@lucide/svelte'

	/**
	 * The gift cards an order bought (GoCommerce D250), each with its code. The order page is where a
	 * buyer looks for them, so the code is shown in full, in fours, with a Copy button.
	 */
	type BoughtCard = { code: string; last4: string; initial: number; balance: number; active: boolean }
	let { cards = [], currencyCode = '' }: { cards?: BoughtCard[] | null; currencyCode?: string } = $props()

	let copied = $state('')
	const grouped = (code: string) => code.match(/.{1,4}/g)?.join('-') ?? code

	async function copy(code: string) {
		try {
			await navigator.clipboard.writeText(grouped(code))
			copied = code
			setTimeout(() => {
				if (copied === code) copied = ''
			}, 2000)
		} catch {
			copied = ''
		}
	}
</script>

{#if cards?.length}
	<section class="rounded-md border border-border bg-background p-4 sm:p-6" aria-labelledby="bought-gift-cards" data-testid="bought-gift-cards">
		<h3 id="bought-gift-cards" class="mb-3 flex items-center gap-2 font-semibold text-foreground">
			<Gift class="size-4 text-primary" aria-hidden="true" />
			{cards.length === 1 ? 'Your gift card' : 'Your gift cards'}
		</h3>
		<ul class="divide-y divide-border">
			{#each cards as card (card.code)}
				<li class="flex flex-wrap items-center justify-between gap-3 py-3">
					<div class="min-w-0">
						<p class="break-all font-mono text-base font-semibold tracking-wide text-foreground">{grouped(card.code)}</p>
						<p class="text-sm text-muted-foreground">
							{#if card.active}
								{formatPrice(card.balance, currencyCode)} left of {formatPrice(card.initial, currencyCode)}
							{:else}
								No longer usable
							{/if}
						</p>
					</div>
					{#if card.active}
						<Button variant="outline" class="gift-copy h-11 shrink-0 gap-2" onclick={() => copy(card.code)} aria-label="Copy gift card code {grouped(card.code)}">
							{#if copied === card.code}
								<span class="flex items-center gap-2" in:fade><Check class="size-4" aria-hidden="true" /> Copied</span>
							{:else}
								<span class="flex items-center gap-2" in:fade><Copy class="size-4" aria-hidden="true" /> Copy</span>
							{/if}
						</Button>
					{/if}
				</li>
			{/each}
		</ul>
		<p class="sr-only" role="status">{copied ? 'Code copied' : ''}</p>
	</section>
{/if}

<style>
	:global(.gift-copy) {
		transition: transform var(--motion-fast, 150ms) ease;
	}
	:global(.gift-copy:active:not(:disabled)) {
		transform: scale(0.96);
	}
	@media (prefers-reduced-motion: reduce) {
		:global(.gift-copy:active:not(:disabled)) {
			transform: none;
		}
	}
</style>
