<script lang="ts">
	type Props = {
		class?: string
		style?: string
	}

	let { class: className = '', style }: Props = $props()
</script>

<div class={`h-full w-full bg-gray-100 dark:bg-gray-800 ${className}`} {style}></div>
