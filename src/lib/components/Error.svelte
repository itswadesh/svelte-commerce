<script lang="ts">
export let err
</script>

{#if err}
	<div class="my-2 text-xs font-medium text-red-600">
		{#if err?.length}
			{#each err as e}
				<span>{e.message}</span>
			{/each}
		{:else if err?.message}
			<span>{err.message}</span>
		{:else if err?.body?.message}
			<span>{err?.body?.message}</span>
		{:else}
			<span>{JSON.stringify(err, null, 2)}</span>
		{/if}
	</div>
{/if}
