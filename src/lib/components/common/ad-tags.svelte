<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import { enabledTags, startAdTags } from '$lib/ad-tags'

	let { plugins } = $props()

	// Keyed on the IDs rather than the store record, so a layout reload with the same tags leaves
	// them running.
	const ids = $derived(JSON.stringify(enabledTags(plugins)))
	let tags: ReturnType<typeof startAdTags> | undefined

	$effect(() => {
		const started = startAdTags(JSON.parse(ids))
		tags = started
		return () => {
			started.stop()
			tags = undefined
		}
	})

	afterNavigate(({ type }) => {
		if (type !== 'enter') tags?.pageView()
	})
</script>
