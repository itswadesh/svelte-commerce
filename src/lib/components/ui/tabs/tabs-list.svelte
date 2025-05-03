<!-- TabsList.svelte -->
<script lang="ts">
	import { getContext } from 'svelte'
	const { list } = getContext('tabs')
</script>

<div use:list class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground" {...$$restProps}>
	<slot />
</div>
