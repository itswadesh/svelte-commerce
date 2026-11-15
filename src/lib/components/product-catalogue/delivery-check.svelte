<script lang="ts">
	import { browser } from '$app/environment'
	import Spinner from '$lib/components/common/spinner.svelte'
	import { Button } from '$lib/components/ui/button/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import { addressService } from '$lib/core/services'
	import { fade } from '$lib/motion'
	import { deliveryMessage, validPostcode, type DeliveryAnswer } from '$lib/product/delivery-check'
	import { CircleAlert, CircleCheck, Truck } from '@lucide/svelte'

	/**
	 * "Do you deliver to my PIN code?" on a GoCommerce store (D286), answered by the store's own
	 * delivery zones through the connector's `checkDelivery`. The product page shows it only when
	 * the connector has that method, so a Litekart store keeps its warehouse check untouched.
	 */
	let { country = 'IN' }: { country?: string } = $props()

	const KEY = 'pdp-delivery-pin'
	const india = $derived(String(country).toUpperCase() === 'IN')
	const noun = $derived(india ? 'PIN code' : 'postcode')

	let pin = $state(remembered())
	let loading = $state(false)
	let answer = $state<DeliveryAnswer | null>(null)
	let failed = $state(false)
	const valid = $derived(validPostcode(country, pin))

	function remembered(): string {
		if (!browser) return ''
		try {
			return localStorage.getItem(KEY) ?? ''
		} catch {
			return ''
		}
	}

	type CheckDelivery = (q: { postcode: string; country?: string }) => Promise<DeliveryAnswer>

	async function check(e?: Event) {
		e?.preventDefault()
		if (!valid || loading) return
		const fn = (addressService as unknown as { checkDelivery?: CheckDelivery }).checkDelivery
		if (typeof fn !== 'function') return
		const code = pin.trim()
		loading = true
		failed = false
		try {
			answer = await fn.call(addressService, { postcode: code, country })
			try {
				localStorage.setItem(KEY, code)
			} catch {
				// Private mode: the PIN is simply not remembered.
			}
		} catch {
			answer = null
			failed = true
		} finally {
			loading = false
		}
	}

	// A PIN remembered from an earlier product is checked again on this one, so the answer is
	// there before the shopper asks.
	let asked = false
	$effect(() => {
		if (asked || !valid) return
		asked = true
		check()
	})

	function typed(e: Event) {
		const el = e.currentTarget as HTMLInputElement
		if (india) el.value = el.value.replace(/\D/g, '').slice(0, 6)
		pin = el.value
		answer = null
		failed = false
	}
</script>

<div class="flex flex-col gap-2 border-t pt-3" data-testid="pdp-delivery-check">
	<label for="pdp-delivery-pin" class="flex items-center gap-2 text-sm text-foreground">
		<Truck class="size-4 text-muted-foreground" aria-hidden="true" />
		Check delivery to your {noun}
	</label>
	<form class="flex gap-2" onsubmit={check}>
		<Input
			id="pdp-delivery-pin"
			value={pin}
			oninput={typed}
			inputmode={india ? 'numeric' : 'text'}
			autocomplete="postal-code"
			maxlength={india ? 6 : 10}
			pattern={india ? '[1-9][0-9]{5}' : undefined}
			placeholder={india ? '6-digit PIN code' : 'Postcode'}
			aria-describedby="pdp-delivery-result"
			class="min-h-11 w-full min-w-0 flex-1 bg-background"
		/>
		<Button type="submit" disabled={!valid || loading} class="min-h-11 min-w-[88px] transition-transform duration-150 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100">
			{#if loading}
				<Spinner label="Checking {noun}" />
			{:else}
				Check
			{/if}
		</Button>
	</form>
	<div id="pdp-delivery-result" aria-live="polite" aria-atomic="true" class="min-h-5 text-sm">
		{#if answer}
			{#key answer}
				<p in:fade class="flex items-start gap-1.5 font-medium {answer.deliverable ? 'text-success' : 'text-destructive'}">
					{#if answer.deliverable}
						<CircleCheck class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
					{:else}
						<CircleAlert class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
					{/if}
					{deliveryMessage(answer)}
				</p>
			{/key}
		{:else if failed}
			<p in:fade class="text-muted-foreground">Could not check right now. Please try again.</p>
		{/if}
	</div>
</div>
