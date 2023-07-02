<script lang="ts">
import { elasticInOut } from 'svelte/easing'
import { fade, fly } from 'svelte/transition'
import { LazyImg } from '$lib/components'

export let img = ''
</script>

<div class="fixed z-50 top-20 right-20">
	<span
		in:fly="{{ y: -200, delay: 0, duration: 1500, easing: elasticInOut }}"
		out:fade="{{ delay: 0, duration: 500 }}"
		class="flex max-w-max items-center gap-3 bg-white p-3 text-center font-semibold border rounded shadow-md">
		<LazyImg
			src="{img}"
			alt=" "
			height="56"
			width="56"
			class="h-14 w-14 rounded object-contain object-center bg-gray-200" />

		<span class="flex-1">Added to Bag</span>
	</span>
</div>
