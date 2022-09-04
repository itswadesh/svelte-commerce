<script>
export let src
export let alt
let clazz
export { clazz as class }
import { onMount } from 'svelte'
import IntersectionObserver from './IntersectionObserver.svelte'
import Image from './Image.svelte'

let nativeLoading = false

// Determine whether to bypass our intersecting check
// onMount(() => {
//   if ('loading' in HTMLImageElement.prototype) {
//     nativeLoading = true
//   }
// })
</script>

<IntersectionObserver once="{true}" let:intersecting>
	{#if intersecting || nativeLoading}
		<Image alt="" src="{src}" clazz="{clazz}" />
	{/if}
</IntersectionObserver>
