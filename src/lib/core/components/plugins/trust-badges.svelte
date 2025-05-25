<script lang="ts">
	import { page } from '$app/state'

	type Props = {
		type?: 'order' | 'product' | 'shop'
		children?: any
	}
	let { type = 'product', children }: Props = $props()

	const plugin = $derived(page.data?.store?.plugins?.trustBadges)

	let content = $derived.by(() => {
		if (plugin && plugin?.active) {
			if (type === 'order') {
				return plugin?.order_html // @todo: need to modify api
			} else if (type === 'shop') {
				return plugin?.shop_html // @todo: need to modify api
			} else {
				return plugin?.html
			}
		}
		return ''
	})
</script>

{#if content}
	<div>
		{@render children?.()}
		{@html content}
	</div>
{/if}
