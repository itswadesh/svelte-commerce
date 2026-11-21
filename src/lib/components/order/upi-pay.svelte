<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import Spinner from '$lib/components/common/spinner.svelte'
	import { fade } from '$lib/motion'
	import { formatPrice } from '$lib/utils/price'
	import { orderService } from '$lib/core/services/index.js'
	import { CheckCircle2, Smartphone } from '@lucide/svelte'

	/**
	 * Pay by UPI (GoCommerce D277): the order is placed and unpaid, and the money goes straight to the
	 * shop's own UPI ID. The engine hands the order its upi:// link, with the amount and order number
	 * filled in, and the same link as a QR code. The shopper then types the 12-digit UPI reference
	 * their app shows, and the shop checks it against its bank before marking the order paid.
	 *
	 * On a phone the app button comes first; on a computer, where a upi:// link opens nothing, the QR
	 * code does. The engine draws the QR as SVG from the link alone, so it is safe to put in the page.
	 */
	type Order = {
		orderNo: string
		total: number
		currencyCode?: string
		paymentReference?: string | null
		upi?: { url: string; qrSvg: string; vpa: string; payee?: string } | null
	}
	let { order }: { order: Order } = $props()

	let reference = $state('')
	let sent = $state('')
	let busy = $state(false)
	let error = $state('')
	$effect.pre(() => {
		// The reference the shop already has, so a shopper back on the page sees it, not an empty box.
		sent = order?.paymentReference ?? ''
	})

	const amount = $derived(formatPrice(order.total, order.currencyCode || 'INR'))
	const digits = $derived(reference.replace(/[\s-]/g, ''))
	const canLink = typeof (orderService as any)?.submitUpiReference === 'function'

	async function submit(e: SubmitEvent) {
		e.preventDefault()
		if (busy) return
		if (!/^\d{12}$/.test(digits)) {
			error = 'Enter the 12-digit UPI reference from your UPI app.'
			return
		}
		busy = true
		error = ''
		try {
			const updated = await (orderService as any).submitUpiReference({ orderNo: order.orderNo, reference: digits })
			sent = updated?.paymentReference || digits
			reference = ''
		} catch (err) {
			error = (err as { message?: string })?.message || 'The reference could not be sent. Please try again.'
		} finally {
			busy = false
		}
	}
</script>

{#if order?.upi}
	<section class="rounded-md border border-border bg-background p-4 text-left sm:p-6" aria-labelledby="upi-pay" data-testid="upi-pay">
		<h2 id="upi-pay" class="mb-1 text-lg font-semibold text-foreground">Pay {amount} by UPI</h2>
		<p class="mb-4 text-sm text-muted-foreground">
			Scan the code or tap the button to pay {amount}{order.upi.payee ? ` to ${order.upi.payee}` : ''} with any UPI app. Then enter the 12-digit UPI reference
			below so the store can confirm your payment.
		</p>

		<div class="flex flex-col items-center gap-4 md:flex-row md:items-start">
			<Button
				href={order.upi.url}
				data-testid="upi-app-button"
				class="order-1 h-12 w-full gap-2 text-base font-semibold transition-transform duration-150 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 md:order-2 md:w-auto"
			>
				<Smartphone class="size-5" aria-hidden="true" />
				Pay with UPI app
			</Button>
			<figure class="order-2 flex flex-col items-center gap-2 md:order-1">
				<div
					class="size-48 rounded-md border border-border bg-white p-2 sm:size-56 [&>svg]:h-full [&>svg]:w-full"
					role="img"
					aria-label="UPI QR code to pay {amount}"
					data-testid="upi-qr"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- drawn by the engine from the payment link -->
					{@html order.upi.qrSvg}
				</div>
				<figcaption class="break-all text-center text-xs text-muted-foreground">UPI ID: {order.upi.vpa}</figcaption>
			</figure>
		</div>

		{#if canLink}
			<form class="mt-5 border-t border-border pt-4" onsubmit={submit} novalidate>
				{#if sent}
					<p class="mb-3 flex items-start gap-2 text-sm text-foreground" role="status" in:fade data-testid="upi-reference-sent">
						<CheckCircle2 class="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
						<span>We have your UPI reference {sent}. The store will confirm your payment once it checks it. You can correct it below.</span>
					</p>
				{/if}
				<Label for="upi-reference" class="mb-1.5 block">UPI reference (12 digits)</Label>
				<div class="flex flex-col gap-2 sm:max-w-md sm:flex-row">
					<Input
						id="upi-reference"
						name="upi-reference"
						bind:value={reference}
						inputmode="numeric"
						autocomplete="off"
						maxlength={16}
						placeholder="e.g. 412345678901"
						aria-invalid={!!error}
						aria-describedby={error ? 'upi-reference-error' : undefined}
						class="h-11 sm:flex-1"
					/>
					<Button
						type="submit"
						variant="outline"
						disabled={busy}
						aria-busy={busy}
						class="h-11 shrink-0 transition-transform duration-150 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100"
					>
						{#if busy}
							<span class="flex items-center gap-2" in:fade><Spinner label="Sending" /> Sending…</span>
						{:else}
							<span in:fade>{sent ? 'Update reference' : 'Send reference'}</span>
						{/if}
					</Button>
				</div>
				{#if error}
					<p id="upi-reference-error" class="mt-2 text-sm text-destructive" role="alert" in:fade>{error}</p>
				{/if}
			</form>
		{/if}
	</section>
{/if}
