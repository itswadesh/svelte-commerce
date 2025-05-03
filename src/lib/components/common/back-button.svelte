<script lang="ts">
	import { goto } from '$app/navigation'
	import Button from '$lib/components/ui/button/button.svelte'
	type BackButtonProps = {
		title: string
		to: string
	}

	let { title = 'Dashboard', to = '/dash' }: BackButtonProps = $props()

	function go() {
		if (to) {
			goto(to)
		} else {
			goto(history.back() || '/dash')
		}
	}
</script>

{#if title}
	<div class="max-w-max rounded-[8px] border border-gray-200 shadow-sm">
		<Button class="group bg-white text-xs" onclick={go}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-5 w-5 transform text-black transition duration-300 group-hover:-translate-x-2 group-hover:text-white"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"></path>
			</svg>

			<div class="flex flex-col text-left leading-3">
				<span class="hidden font-normal text-gray-700 group-hover:text-white sm:block"> Prev </span>

				<span class="font-semibold text-black group-hover:text-white">{title}</span>
			</div>
		</Button>
	</div>
{/if}
