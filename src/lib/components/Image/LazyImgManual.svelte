<script>
import { onMount } from 'svelte'
import Image from './Image.svelte'
import IntersectionObserver from './IntersectionObserver.svelte'

export let src
export let alt = ''
export let width = 'auto'
export let height = 'auto'

const w = width === 'auto' ? 'auto' : +width * 2
const h = height === 'auto' ? 'auto' : +height * 2

let clazz
export { clazz as class }

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
		<Image
			noLazy="{intersecting}"
			alt="{alt}"
			src="{src}"
			width="{width}"
			height="{height}"
			clazz="{clazz}"
		/>
	{/if}
</IntersectionObserver>
