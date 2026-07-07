<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { Drawer as DrawerPrimitive } from 'vaul-svelte'

	type $$Props = DrawerPrimitive.Props
	export let shouldScaleBackground: $$Props['shouldScaleBackground'] = true
	export let open: $$Props['open'] = false
	export let activeSnapPoint: $$Props['activeSnapPoint'] = undefined
	export let manageHistory: boolean = true

	const modalHistoryKey = '__svelteCommerceNestedDrawer'
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

<DrawerPrimitive.NestedRoot {shouldScaleBackground} bind:open bind:activeSnapPoint {...$$restProps}>
	<slot />
</DrawerPrimitive.NestedRoot>
