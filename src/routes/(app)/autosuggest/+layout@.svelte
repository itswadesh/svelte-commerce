<style>
.frosted {
	backdrop-filter: blur(12px);
	background-color: hsla(0, 0%, 0%, 0.5);
}
</style>

<script>
import { navigating } from '$app/stores'
import PreloadingIndicator from '$lib/PreloadingIndicator.svelte'
let url
</script>

{#if $navigating}
	<PreloadingIndicator />
{/if}

<slot />
