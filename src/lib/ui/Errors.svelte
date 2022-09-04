<script>
export let errors

// console.log('errors component =', errors)
</script>

<div class="mb-4 text-sm text-red-600">
	{#if errors}
		<ul class="ml-4 list-decimal gap-2">
			{#each errors as e}
				<li>
					{e.message}
				</li>
			{/each}
		</ul>
	{/if}
</div>
