<script lang="ts">
	import { onMount } from 'svelte'
	interface Props {
		once?: boolean
		top?: number
		bottom?: number
		left?: number
		right?: number
		children?: import('svelte').Snippet<[any]>
	}

	let { once = false, top = 0, bottom = 0, left = 0, right = 0, children }: Props = $props()
	let intersecting = $state(false)

	let container: any = $state()
	onMount(() => {
		if (typeof IntersectionObserver !== 'undefined') {
			const rootMargin = `${bottom}px ${left}px ${top}px ${right}px`
			const observer = new IntersectionObserver(
				(entries) => {
					intersecting = entries[0].isIntersecting
					if (intersecting && once) {
						observer.unobserve(container)
					}
				},
				{
					rootMargin
				}
			)
			observer.observe(container)
			return () => observer.unobserve(container)
		}
	})

	const children_render = $derived(children)
</script>

<span bind:this={container}>
	{@render children_render?.({ intersecting })}
</span>

<style>
	div {
		width: 100%;
		height: 100%;
	}
</style>
