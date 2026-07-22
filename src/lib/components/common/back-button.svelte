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
			history.back()
			goto('/dash')
		}
	}
</script>

{#if title}
	<Button variant="outline" class="h-auto px-4 py-2" onclick={go}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-5 w-5 text-black"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"></path>
		</svg>

		<div class="flex flex-col text-left leading-3">
			<span class="hidden font-medium text-gray-600 sm:block"> Prev </span>

			<span class="font-semibold text-xs pt-1">{title}</span>
		</div>
	</Button>
{/if}
