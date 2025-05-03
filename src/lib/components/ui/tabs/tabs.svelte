<!-- Tabs root component -->
<script lang="ts">
	import { createTabs } from './tabs.js'
	import { setContext } from 'svelte'

	export let value: string | undefined = undefined
	export let defaultValue: string | undefined = undefined

	const { root, content, list, trigger } = createTabs({
		value: value,
		defaultValue: defaultValue
	})
	setContext('tabs', { root, content, list, trigger })
</script>

<div use:root class="w-full" {...$$restProps}>
	<slot />
</div>
