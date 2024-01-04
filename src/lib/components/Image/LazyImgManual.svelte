<script lang="ts">
import Image from './Image.svelte'
import IntersectionObserver from './IntersectionObserver.svelte'

export let src: string
export let alt = ''
export let width = 'auto'
export let height = 'auto'

const w = width === 'auto' ? 'auto' : +width * 2
const h = height === 'auto' ? 'auto' : +height * 2

let clazz: string
export { clazz as class }

let nativeLoading = false
</script>

<IntersectionObserver once="{true}" let:intersecting>
	{#if intersecting || nativeLoading}
		<!-- noLazy="{intersecting}" -->
		<Image {alt} {src} {width} {height} {clazz} />
	{/if}
</IntersectionObserver>
