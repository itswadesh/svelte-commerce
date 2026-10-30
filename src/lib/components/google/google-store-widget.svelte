<script lang="ts">
	import { startStoreWidget } from '$lib/google-reviews'
	import { onFirstInteraction } from '$lib/utils/on-first-interaction'

	/**
	 * Google Customer Reviews' store widget, the badge with the store's rating, where the store
	 * placed it. Loaded on the visitor's first interaction, like the other third-party widgets, so it
	 * costs the first paint nothing.
	 */
	let { widget }: { widget?: { active?: boolean; position?: string } | null } = $props()

	$effect(() => {
		if (!widget?.active) return
		const position = widget.position === 'LEFT_BOTTOM' ? 'LEFT_BOTTOM' : 'RIGHT_BOTTOM'
		return onFirstInteraction(() => startStoreWidget(position))
	})
</script>
