<script lang="ts" module>
	const modalHistoryKey = '__svelteCommerceDialog'

	const dialogsOnSharedEntry = new Set<object>()

	function release(owner: object) {
		dialogsOnSharedEntry.delete(owner)
		queueMicrotask(() => {
			if (!dialogsOnSharedEntry.size && history.state?.[modalHistoryKey] === true) history.back()
		})
	}
</script>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { Dialog as DialogPrimitive } from 'bits-ui'

	type $$Props = DialogPrimitive.RootProps & {
		manageHistory?: boolean
	}

	export let open: $$Props['open'] = false
	export let manageHistory: $$Props['manageHistory'] = true

	const self = {}

	function handleBrowserBack() {
		if (!open || !dialogsOnSharedEntry.has(self)) return
		dialogsOnSharedEntry.delete(self)
		open = false
	}

	onMount(() => {
		window.addEventListener('popstate', handleBrowserBack)
		return () => window.removeEventListener('popstate', handleBrowserBack)
	})

	$: if (typeof window !== 'undefined' && manageHistory) {
		if (open && !dialogsOnSharedEntry.has(self)) {
			if (!dialogsOnSharedEntry.size && history.state?.[modalHistoryKey] !== true) {
				history.pushState({ ...history.state, [modalHistoryKey]: true }, '', window.location.href)
			}
			dialogsOnSharedEntry.add(self)
		} else if (!open && dialogsOnSharedEntry.has(self)) {
			release(self)
		}
	}

	onDestroy(() => {
		if (dialogsOnSharedEntry.has(self)) release(self)
	})
</script>

<DialogPrimitive.Root bind:open {...$$restProps}>
	<slot />
</DialogPrimitive.Root>
