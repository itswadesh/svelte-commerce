<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		pincode: number | undefined
		content: Snippet<[SnippetParams]>
	}

	let { content, pincode = $bindable() }: Props = $props()

	interface SnippetParams {
		resultText: string
		loading: boolean
		showPincode: boolean

		checkPincode: () => void
		toggleShowPincode: () => void
	}

	let showPincode = $state(true)
	let resultText = $state('')
	let loading = $state(false)

	async function checkPincode() {
		loading = true
		const sevenDaysFromNow = new Date()
		sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
		resultText = `Available in your area. Get it by ${sevenDaysFromNow.toDateString()}`
		loading = false
	}

	function toggleShowPincode() {
		showPincode = !showPincode
	}
</script>

{@render content({ loading, resultText, showPincode, checkPincode, toggleShowPincode })}
