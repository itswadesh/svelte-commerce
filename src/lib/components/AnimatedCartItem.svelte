<script lang="ts">
import { elasticInOut } from 'svelte/easing'
import { fade, fly } from 'svelte/transition'
import LazyImg from './Image/LazyImg.svelte'

export let img = ''
</script>

<div class="fixed top-0 right-0 mr-16 mt-32">
	<span
		in:fly="{{ y: -200, delay: 0, duration: 1500, easing: elasticInOut }}"
		out:fade="{{ delay: 0, duration: 500 }}"
		class="flex w-56 items-center justify-start rounded bg-gray-800 px-4 py-3 text-center text-sm text-white shadow">
		<LazyImg src="{img}" alt="" width="32" height="32" class="mr-1 h-8 w-8 rounded object-cover" />

		<div class="w-full">Added to bag</div>
	</span>
</div>
