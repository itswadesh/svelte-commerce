<style>
img {
	opacity: 0;
	transition: opacity 1200ms ease-out;
}
img.loaded {
	opacity: 1;
}
</style>

<script>
export let src
export let alt
export let clazz
import { onMount } from 'svelte'

let loaded = false
let thisImage

onMount(() => {
	thisImage.onload = () => {
		loaded = true
	}
})
</script>

<img
	src="{src}"
	alt="{alt}"
	class:loaded
	class="{clazz} whitespace-pre-line"
	bind:this="{thisImage}"
	loading="lazy" />
