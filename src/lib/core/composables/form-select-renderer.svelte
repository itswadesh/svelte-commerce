<script lang="ts">
	import Fuse from 'fuse.js'
	import { tick } from 'svelte'
	import type { Snippet } from 'svelte'

	interface Props {
		searchQuery: string
		open: boolean
		triggerRef: HTMLButtonElement
		data: Record<string, string>[]
		value: string
		valueField: string
		title: string
		content: Snippet<[SnippetParams]>
	}

	let { content, searchQuery = $bindable(), open = $bindable(), triggerRef = $bindable(), value, data, valueField, title }: Props = $props()

	interface SnippetParams {
		selectedValue: string
		filteredData: Record<string, string>[]
		closeAndFocusTrigger: () => void
	}

	let searchFuse: Fuse<any>
	let selectedValue = $state('Select')
	let filteredData = $state(data)
	let hasRun = $state(false)

	$effect(() => {
		if (!data?.length && hasRun) return

		searchFuse = new Fuse(data, {
			keys: ['name', 'value', valueField],
			includeScore: true,
			threshold: 0.4
		})
		hasRun = true
	})

	$effect(() => {
		if (searchFuse && searchQuery) {
			let results = searchFuse.search(searchQuery)
			filteredData = results.map((r: any) => r.item)
		} else {
			filteredData = data
		}
	})

	$effect(() => {
		selectedValue = data.find((f: any) => f?.[valueField] === value)?.name ?? title
	})

	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	// function closeAndFocusTrigger(triggerId: string) {
	// 	open = false
	// 	tick().then(() => {
	// 		document.getElementById(triggerId)?.focus()
	// 	})
	// }

	function closeAndFocusTrigger() {
		open = false
		tick().then(() => {
			triggerRef.focus()
		})
	}
</script>

{@render content({ filteredData, selectedValue, closeAndFocusTrigger })}
