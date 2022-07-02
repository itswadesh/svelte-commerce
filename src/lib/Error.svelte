<script>
export let err
</script>

{#if err}
	<div class="container mx-auto mb-5 text-red-600 font-medium text-xs">
		{#if err.message}
			<span>{JSON.stringify(err.message, null, 2)}</span>
		{:else}
			<span>{JSON.stringify(err, null, 2)}</span>
		{/if}
	</div>
{/if}
