<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'
	import { fade } from '$lib/motion'
	import type { WhatsappOffer } from '$lib/whatsapp'

	/**
	 * The WhatsApp opt-in on the address step. Draws nothing unless the store sends order updates on
	 * WhatsApp, and both boxes start unticked: the shopper asks, the store never assumes. The page
	 * loads the offer and sends the answers when the shopper moves on (`$lib/whatsapp`).
	 */
	let {
		storeName = '',
		offer,
		orderUpdates = $bindable(false),
		marketing = $bindable(false)
	}: { storeName?: string; offer: WhatsappOffer; orderUpdates?: boolean; marketing?: boolean } = $props()

	const row =
		'flex min-h-11 cursor-pointer items-center gap-3 rounded-radius px-3 py-2 text-sm text-foreground transition-colors duration-fast hover:bg-muted/50'
</script>

{#if offer.enabled}
	<fieldset class="rounded-lg border border-border bg-background p-2" data-testid="whatsapp-optin" transition:fade>
		<legend class="sr-only">WhatsApp messages</legend>
		<label class={row}>
			<Checkbox bind:checked={orderUpdates} name="whatsapp_order_updates" />
			<span>Get order updates from {storeName || 'this store'} on WhatsApp</span>
		</label>
		{#if offer.marketing}
			<label class={row}>
				<Checkbox bind:checked={marketing} name="whatsapp_marketing" />
				<span>Also send me offers and basket reminders on WhatsApp</span>
			</label>
		{/if}
	</fieldset>
{/if}
