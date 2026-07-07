<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { Dialog as DialogPrimitive } from 'bits-ui'

	type $$Props = DialogPrimitive.RootProps & {
		manageHistory?: boolean
	}

	export let open: $$Props['open'] = false
	export let manageHistory: $$Props['manageHistory'] = true

	const modalHistoryKey = '__svelteCommerceDialog'
	let ownsHistoryEntry = false

	function handleBrowserBack() {
		if (!open || !ownsHistoryEntry) return
		ownsHistoryEntry = false
		open = false
	}

	onMount(() => {
		window.addEventListener('popstate', handleBrowserBack)
		return () => window.removeEventListener('popstate', handleBrowserBack)
	})

	$: if (typeof window !== 'undefined' && manageHistory) {
		if (open && !ownsHistoryEntry) {
			history.pushState({ ...history.state, [modalHistoryKey]: true }, '', window.location.href)
			ownsHistoryEntry = true
		} else if (!open && ownsHistoryEntry) {
			const isCurrentModalEntry = history.state?.[modalHistoryKey] === true
			ownsHistoryEntry = false
			if (isCurrentModalEntry) history.back()
		}
	}

	onDestroy(() => {
		if (typeof window !== 'undefined' && manageHistory && ownsHistoryEntry && history.state?.[modalHistoryKey] === true) {
			history.back()
		}
	})
</script>

<DialogPrimitive.Root bind:open {...$$restProps}>
	<slot />
</DialogPrimitive.Root>
