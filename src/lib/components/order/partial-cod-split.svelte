<script lang="ts">
	import { formatPrice } from '$lib/utils/price'
	import { fade } from '$lib/motion'

	/**
	 * Part-paid cash on delivery (GoCommerce D297): what is paid online and what in cash at the door,
	 * with the refund rule. `paid` once the advance is in, which is what confirms the order; the
	 * order's payment status stays pending until the cash is collected.
	 */
	let {
		payNow,
		payOnDelivery,
		refundNote = '',
		paid = false,
		currencyCode = ''
	}: { payNow: number; payOnDelivery: number; refundNote?: string | null; paid?: boolean; currencyCode?: string } = $props()

	const now = $derived(formatPrice(payNow, currencyCode))
	const cash = $derived(formatPrice(payOnDelivery, currencyCode))
</script>

<div class="rounded-md border border-border bg-muted/20 px-3 py-2 text-xs" data-testid="partial-cod-split" in:fade>
	<p class="font-semibold text-foreground">
		{#if paid}Paid online {now} · Due in cash {cash}{:else}Pay {now} now · {cash} in cash on delivery{/if}
	</p>
	{#if refundNote}
		<p class="mt-0.5 text-muted-foreground">{refundNote}</p>
	{/if}
</div>
