<script lang="ts">
	import { addressService } from '$lib/core/services'
	import { fade } from '$lib/motion'
	import { isIndianPin, pinAutofill } from '$lib/product/conversion'

	/**
	 * Six digits of an Indian PIN code fill the city and state (GoCommerce D134), from India Post's
	 * directory on the engine. Only a field that is empty, or still holds what an earlier PIN put
	 * there, is changed: whatever the shopper typed stays theirs, and both stay editable.
	 *
	 * Draws a one-line note when it filled something, and nothing otherwise: an older connector, an
	 * engine without the directory or an unknown PIN all leave the form exactly as it was.
	 */
	let { address = $bindable(), country = '' }: { address: any; country?: string } = $props()

	let lastFilled = $state<{ city: string; state: string } | null>(null)
	let note = $state('')

	$effect(() => {
		const zip = String(address?.zip ?? '').trim()
		const cc = String(country || address?.countryCode || '').toUpperCase()
		note = ''
		if (!isIndianPin(cc, zip)) return
		const svc = addressService as unknown as {
			lookupPostcode?: (q: { country: string; postcode: string }) => Promise<{ city: string; state: string } | null>
		}
		if (typeof svc.lookupPostcode !== 'function') return
		let live = true
		svc
			.lookupPostcode({ country: cc, postcode: zip })
			.then((found) => {
				if (!live || !found || !address) return
				const patch = pinAutofill({ city: address.city, state: address.state }, found, lastFilled)
				if (patch.city) address.city = patch.city
				if (patch.state) address.state = patch.state
				lastFilled = { city: found.city, state: found.state }
				if (patch.city || patch.state) note = `${found.city}, ${found.state}`
			})
			.catch(() => {
				// The shopper types the city and state, as before.
			})
		return () => {
			live = false
		}
	})
</script>

{#if note}
	<p class="col-span-full -mt-1 mb-1 text-xs text-muted-foreground" aria-live="polite" data-testid="pin-autofill" transition:fade>
		Filled in from the PIN code: {note}
	</p>
{/if}
