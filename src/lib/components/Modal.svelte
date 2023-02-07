<style>
.frosted-black {
	backdrop-filter: blur(12px);
	background-color: hsla(0, 0%, 0%, 0.5);
}

.z-index {
	z-index: 99999;
}
</style>

<script>
import { fly } from 'svelte/transition'
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let show
</script>

{#if show}
	<div
		transition:fly="{{ y: -400, duration: 500 }}"
		class="z-index frosted-black fixed inset-0 flex h-screen w-screen items-center justify-center p-5 sm:p-10"
	>
		<div class="container relative mx-auto max-w-max rounded-xl bg-white">
			<button
				type="button"
				class="absolute top-4 right-4 z-10 transform text-gray-500 transition duration-300 focus:outline-none hover:scale-125 hover:text-gray-700"
				on:click="{() => dispatch('close')}"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"></path>
				</svg>
			</button>

			<div>
				<slot />
			</div>
		</div>
	</div>
{/if}
