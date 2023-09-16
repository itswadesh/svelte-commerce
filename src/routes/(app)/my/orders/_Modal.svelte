<style>
.frosted {
	backdrop-filter: blur(12px);
	background-color: rgba(0, 0, 0, 0.2);
}

.height {
	max-height: 70vh;
}
</style>

<script>
import BlackButton from '$lib/ui/BlackButton.svelte'

import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()

let clazz
export { clazz as class }
export let isVisible = false,
	trnsitionName = '',
	hideCloseButton = false

function emitCancel() {
	dispatch('cancel')
}

function emitConfirm() {
	dispatch('confirm')
}
</script>

<div class="{clazz}">
	<transition name="{trnsitionName}">
		{#if isVisible}
			<div
				class="frosted fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center px-3 py-5 sm:p-10">
				<div
					class="flex max-w-max flex-col overflow-hidden rounded-lg border bg-white align-middle shadow-lg">
					<!-- header-->

					<div class="flex items-center justify-between border-b border-zinc-200 p-3 sm:px-6">
						<h3 class="mr-4">
							<slot name="title" />
						</h3>

						<slot name="close">
							<BlackButton
								type="button"
								class="{hideCloseButton ? 'hidden' : 'block'}"
								on:click="{emitCancel}">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"></path>
								</svg>
							</BlackButton>
						</slot>
					</div>

					<!-- body-->

					<div class="height overflow-y-auto p-3 py-3 sm:px-6">
						<slot />
					</div>

					<!-- footer-->

					<slot name="footer">
						<div class="flex items-center justify-end border-t border-zinc-200 p-3 sm:px-6">
							<button on:click="{emitCancel}">
								<slot name="cancel-button"><button class="btn-outline">Cancel</button></slot>
							</button>

							<button class="ms-4" on:click="{emitConfirm}">
								<slot name="confirm-button"><button class="btn">Confirm</button></slot>
							</button>
						</div>
					</slot>
				</div>
			</div>
		{/if}
	</transition>
</div>
