<style>
.frosted-black {
	backdrop-filter: blur(12px);
	background-color: hsla(0, 0%, 0%, 0.75);
}

.z-index {
	z-index: 99999;
}

@media (max-width: 640px) {
	.width {
		width: 90vw;
	}
}

@media (min-width: 640px) {
	.width {
		width: 80vw;
	}
}

@media (min-width: 768px) {
	.width {
		width: 70vw;
	}
}

@media (min-width: 1024px) {
	.width {
		width: 60vw;
	}
}

@media (min-width: 1024px) {
	.width {
		width: 50vw;
	}
}
</style>

<script>
import { createEventDispatcher } from 'svelte'
import { fade } from 'svelte/transition'
import BlackButton from '$lib/ui/BlackButton.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'

const dispatch = createEventDispatcher()

export let confirmButtonText = 'Submit'
export let disableSubmitButton = false
export let hideFooter = false
export let loading
export let show
export let title = 'Title'
export let useMaxHeight = true
export let useMaxWidth = false

let dontSubmit = false

function submit() {
	if (!disableSubmitButton) {
		dispatch('submit')
	} else {
		dontSubmit = true

		setTimeout(() => {
			dontSubmit = false
		}, 820)
	}
}
</script>

{#if show}
	<section
		transition:fade="{{ duration: 100 }}"
		class="frosted-black fixed inset-0 z-[99999] h-screen w-full items-center justify-center
		{show ? 'flex' : 'hidden'}">
		<div
			class="overflow-hidden rounded-3xl bg-white
			{useMaxWidth ? 'w-full max-w-[80vw]' : 'width'}
			{useMaxHeight ? 'max-h-[80vh] ' : 'h-[80vh]'}"
			class:wiggle="{dontSubmit}">
			<div class="{useMaxHeight ? 'max-h-[80vh] ' : 'h-[80vh]'} overflow-y-auto">
				<div
					class="sticky top-0 z-[100000] flex items-center justify-between gap-4 border-b bg-white p-4 shadow-md sm:px-8">
					<h2 class="text-xl capitalize sm:text-2xl">
						{title}
					</h2>

					<BlackButton type="button" on:click="{() => dispatch('close')}">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"></path>
						</svg>
					</BlackButton>
				</div>

				<form on:submit|preventDefault="{submit}">
					<div class="p-4 sm:p-8">
						<slot />
					</div>

					{#if !hideFooter}
						<div class="flex items-center justify-end gap-2 border-t p-4">
							<PrimaryButton
								type="submit"
								loadingringsize="xs"
								{loading}
								disabled="{disableSubmitButton}"
								class="whitespace-nowrap text-xs">
								{confirmButtonText}
							</PrimaryButton>
						</div>
					{/if}
				</form>
			</div>
		</div>
	</section>
{/if}
