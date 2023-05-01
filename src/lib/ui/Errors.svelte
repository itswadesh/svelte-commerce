<script>
export let errors
</script>

<div class="mb-4 text-sm text-red-600">
	{#if errors?.length > 0}
		<ul class="ml-4 list-decimal gap-2">
			{#each errors as e}
				<li>
					{e.message}
				</li>
			{/each}
		</ul>
	{/if}
</div>
