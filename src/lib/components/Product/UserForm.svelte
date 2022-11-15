<style>
.frosted-black {
	backdrop-filter: blur(5px);
	background-color: hsla(0, 0%, 0%, 0.8);
}
</style>

<script>
import TextboxFloating from '$lib/ui/TextboxFloating.svelte'
import { slide } from 'svelte/transition'

export let showUserInputForm = false
</script>

{#if showUserInputForm}
	<div
		transition:slide="{{ duration: 500 }}"
		class="fixed inset-x-0 bottom-0 z-[60] overflow-hidden border-t bg-white lg:hidden"
		style="box-shadow: 0px -4px 10px rgba(50, 50, 50, 0.2);">
		<div class="w-full max-w-md rounded-3xl bg-white">
			<h1 class="border-b p-4 text-lg font-bold tracking-wide sm:px-8 sm:text-xl">Fill The Form</h1>

			<div class="flex flex-col gap-4 p-4 sm:p-8">
				<TextboxFloating label="Full Name" class="w-full" />

				<TextboxFloating label="Email" class="w-full" />

				<TextboxFloating label="Phone" class="w-full" />
			</div>
		</div>
	</div>
{/if}
