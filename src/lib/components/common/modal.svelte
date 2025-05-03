<script lang="ts">
	import { fade } from 'svelte/transition'
	import * as Card from '$lib/components/ui/card'
	import type { WithElementRef } from 'bits-ui'
	import type { HTMLAttributes } from 'svelte/elements'
	import ModalRenderer from '$lib/core/composables/modal-renderer.svelte'

	type ModalProps = {
		confirmButtonText?: string
		disableSubmitButton?: boolean
		hideFooter?: boolean
		hideHeader?: boolean
		class?: string
		show?: boolean
		title?: string
		hAuto?: boolean
		wAuto?: boolean
		useMaxHeight?: boolean
		useMaxWidth?: boolean
		rounded?: boolean
		zIndex?: number
		confirmButtonPosition?: 'top' | 'bottom'
		loading?: boolean
		close?: () => any
		submit?: () => any
	}

	let {
		confirmButtonText = 'Submit',
		disableSubmitButton = false,
		hideFooter = false,
		hideHeader = false,
		class: className,
		show,
		title = 'Title',
		hAuto = false,
		wAuto = false,
		useMaxHeight = false,
		useMaxWidth = false,
		rounded = true,
		zIndex = 1000000,
		confirmButtonPosition = 'bottom',
		loading,
		children,
		close,
		submit
	}: ModalProps & WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<ModalRenderer bind:show {disableSubmitButton} {submit} {close}>
	{#snippet content({ handleSubmit, handleClose })}
		{#if show}
			<section
				style="z-index: {zIndex};"
				transition:fade={{ duration: 100 }}
				class="frosted-black fixed inset-0 h-screen w-full items-center justify-center
      {show ? 'flex' : 'hidden'}"
			>
				<Card.Root
					class="overflow-hidden border
        {rounded ? '' : 'rounded-none'}
        {wAuto ? '' : useMaxWidth ? 'w-full max-w-[80vw]' : 'width'}
        {hAuto ? '' : useMaxHeight ? 'max-h-[80vh] ' : 'h-[80vh]'}"
				>
					<div class="{hAuto ? '' : useMaxHeight ? 'max-h-[80vh] ' : 'h-[80vh]'} overflow-y-auto">
						{#if !hideHeader}
							<Card.Header style="z-index: {zIndex};" class="sticky top-0 flex w-full flex-row items-center justify-between gap-4 border-b p-4 px-6">
								<h2 class="text-lg capitalize sm:text-xl">
									{title}
								</h2>

								<div class="flex flex-row gap-3">
									{#if confirmButtonPosition === 'top'}
										<div class="flex items-center justify-end gap-2">
											<button type="submit" onclick={handleSubmit} disabled={disableSubmitButton} class="min-w-40 whitespace-nowrap rounded-full">
												{confirmButtonText}
											</button>
										</div>
									{/if}

									<button aria-label="Close modal button" type="button" onclick={handleClose}>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
											<path
												fill-rule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clip-rule="evenodd"
											></path>
										</svg>
									</button>
								</div>
							</Card.Header>
						{/if}

						<form onsubmit={handleSubmit}>
							<Card.Content class={className}>
								{@render children?.()}
							</Card.Content>

							{#if !hideFooter}
								{#if confirmButtonPosition === 'bottom'}
									<div class="flex items-center justify-end gap-2 border-t p-4">
										<button type="submit" disabled={disableSubmitButton} class="whitespace-nowrap text-xs">
											{confirmButtonText}
										</button>
									</div>
								{/if}
							{/if}
						</form>
					</div>
				</Card.Root>
			</section>
		{/if}
	{/snippet}
</ModalRenderer>

<style>
	.frosted-black {
		backdrop-filter: blur(12px);
		background-color: hsla(0, 0%, 0%, 0.75);
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
