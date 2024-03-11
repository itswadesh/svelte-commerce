<script>
export let err

let clazz = ''
export { clazz as class }

$: errorMessage =
	err?.body?.message?.error ||
	err?.body?.message ||
	err?.message?.error ||
	err?.message ||
	err?.error ||
	err ||
	''

$: errorMessages = Array.isArray(err) ? err.map((e) => e.message) : [errorMessage]
</script>

{#if err}
	<div
		class="{clazz} rounded border border-red-500 bg-red-100 px-4 py-2 text-sm font-medium text-red-600">
		{#each errorMessages as message}
			<span>{message?.message || message}</span>
		{/each}
	</div>
{/if}
