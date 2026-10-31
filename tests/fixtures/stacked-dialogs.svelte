<script lang="ts">
	import Dialog from '$lib/components/ui/dialog/dialog-root.svelte'

	let form = $state(false)
	let list = $state(false)
</script>

<button onclick={() => (form = true)}>Open form</button>
<button
	onclick={() => {
		list = true
		form = false
	}}>Save</button
>
<p>form {form ? 'open' : 'closed'}, list {list ? 'open' : 'closed'}</p>

<Dialog bind:open={list} />
<Dialog bind:open={form} />
