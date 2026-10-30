<script lang="ts">
	import { loadSurvey, showSurvey } from '$lib/google-reviews'

	/**
	 * Google Customer Reviews' survey offer, on the order confirmation page only. The engine builds
	 * every field from the order, read with the key this browser kept for it; with no real delivery
	 * estimate it answers nothing and nothing is offered. Asked once, after the page has drawn and the
	 * browser is idle, so Google's script never competes with the confirmation itself.
	 */
	let { active = false, orderNo = '' }: { active?: boolean; orderNo?: string } = $props()

	let asked = false
	$effect(() => {
		if (!active || !orderNo || asked) return
		asked = true
		const number = orderNo
		const ask = () =>
			loadSurvey(number)
				.then((survey) => survey && showSurvey(survey))
				.catch(() => {})
		if ('requestIdleCallback' in window) requestIdleCallback(ask, { timeout: 3000 })
		else setTimeout(ask, 1500)
	})
</script>
