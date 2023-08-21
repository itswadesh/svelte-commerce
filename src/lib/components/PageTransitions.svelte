<style>
.transition-outer {
	display: grid;
	grid-template: 1fr 1fr;
}
.transition-inner {
	grid-row: 1;
	grid-column: 1;
}
</style>

<!-- PageTransition.svelte -->
<script>
import { fly, scale } from 'svelte/transition'
import { quintOut } from 'svelte/easing'

export let url = ''

const pageTransitionDuration = 500
</script>

<!-- in:fly={{
        y: 50,
        duration: pageTransitionDuration,
        delay: pageTransitionDuration,
      }}
      out:fly={{ duration: pageTransitionDuration }} -->

<div class="transition-outer">
	{#key url}
		<div
			class="transition-inner flex flex-col justify-center"
			transition:scale="{{ delay: 0, duration: 100, easing: quintOut }}">
			<slot />
		</div>
	{/key}
</div>
