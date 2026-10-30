<script lang="ts">
	import { loadSurvey, showSurvey } from '$lib/google-reviews'

	/**
	 * Google Customer Reviews' survey offer, on the order confirmation page only. The engine builds
	 * every field from the order, read with the key this browser kept for it; with no real delivery
	 * estimate it answers nothing and nothing is offered. Asked after the page has drawn and the
	 * browser is idle, so Google's script never competes with the confirmation itself, and twice more
	 * over the next half minute: a card payment can be confirmed a moment after the shopper lands
	 * here, and an order still awaiting payment gets no survey.
	 */
	let { active = false, orderNo = '' }: { active?: boolean; orderNo?: string } = $props()

	let asked = false
	$effect(() => {
		if (!active || !orderNo || asked) return
		asked = true
		const number = orderNo
		const ask = (retries: number[]) =>
			loadSurvey(number)
				.catch(() => null)
				.then((survey) => {
					if (survey) showSurvey(survey)
					else if (retries.length) setTimeout(() => ask(retries.slice(1)), retries[0])
				})
		const first = () => ask([5000, 20000])
		if ('requestIdleCallback' in window) requestIdleCallback(first, { timeout: 3000 })
		else setTimeout(first, 1500)
	})
</script>
