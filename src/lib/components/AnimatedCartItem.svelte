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
		class="flex max-w-max items-center ounded bg-gray-800 px-4 py-3 text-center text-sm text-white rounded-md shadow-md"
	>
		<LazyImg
			src="{img}"
			alt=""
			height="56"
			class="h-14 w-auto rounded-md object-contain object-center"
		/>

		<div class="flex-1 px-5">Added to Bag</div>
	</span>
</div>
