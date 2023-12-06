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
</script>

{#if err}
	<div
		class="{clazz} rounded border border-red-500 bg-red-100 px-4 py-2 text-sm font-medium text-red-600">
		{#if Array.isArray(err)}
			{#each err as e}
				<span>{e.message}</span>
			{/each}
		{:else if errorMessage}
			<span>{errorMessage}</span>
		{:else}
			<span>{JSON.stringify(err)}</span>
		{/if}
	</div>
{/if}
