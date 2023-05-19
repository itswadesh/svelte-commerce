<script lang="ts">
export let err = null
</script>

{#if err}
	<div class="my-2 text-sm font-medium text-red-600">
		{#if err?.body?.message}
			{err?.body?.message}
		{:else if err?.message}
			{err.message}
		{:else if err?.length}
			<ul class="flex flex-col gap-1 m-0 p-0 list-disc">
				{#each err as e}
					<li>{e.message}</li>
				{/each}
			</ul>
		{:else}
			{JSON.stringify(err)}
		{/if}
	</div>
{/if}
