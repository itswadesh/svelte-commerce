<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { fade } from 'svelte/transition'
	import * as Card from '$lib/components/ui/card'
	import type { WithElementRef } from 'bits-ui'
	import type { HTMLAttributes } from 'svelte/elements'
	import { ModalRenderer } from '$lib/core/composables/index.js'
	import { Button } from '$lib/components/ui/button'
	import { dialog } from '$lib/actions/dialog.js'

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
		/**
		 * Extra classes for the card element itself. `class` goes to Card.Content, which sits inside
		 * a Card.Root carrying `overflow-hidden` — so a radius set through `class` is drawn and then
		 * clipped square by the parent, and the border a caller sees is Root's, not its own. This is
		 * the only way to reach that element.
		 */
		rootClass?: string
		zIndex?: number
		confirmButtonPosition?: 'top' | 'bottom'
		loading?: boolean
		manageHistory?: boolean
		close?: () => any
		submit?: () => any
	}

	let {
		confirmButtonText = 'Submit',
		disableSubmitButton = false,
		hideFooter = false,
		hideHeader = false,
		class: className,
		show = $bindable(false),
		title = 'Title',
		hAuto = false,
		wAuto = false,
		useMaxHeight = false,
		useMaxWidth = false,
		rounded = true,
		rootClass = '',
		zIndex = 1000000,
		confirmButtonPosition = 'bottom',
		loading,
		manageHistory = true,
		children,
		close,
		submit
	}: ModalProps & WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()

	const modalHistoryKey = '__svelteCommerceModal'
	const titleId = $props.id()
	let ownsHistoryEntry = false

	function handleBrowserBack() {
		if (!show || !ownsHistoryEntry) return
		ownsHistoryEntry = false
		show = false
	}

	onMount(() => {
		window.addEventListener('popstate', handleBrowserBack)
		return () => window.removeEventListener('popstate', handleBrowserBack)
	})

	$effect(() => {
		if (typeof window === 'undefined' || !manageHistory) return

		if (show && !ownsHistoryEntry) {
			history.pushState({ ...history.state, [modalHistoryKey]: true }, '', window.location.href)
			ownsHistoryEntry = true
		} else if (!show && ownsHistoryEntry) {
			const isCurrentModalEntry = history.state?.[modalHistoryKey] === true
			ownsHistoryEntry = false
			if (isCurrentModalEntry) history.back()
		}
	})

	onDestroy(() => {
		if (typeof window !== 'undefined' && manageHistory && ownsHistoryEntry && history.state?.[modalHistoryKey] === true) {
			history.back()
		}
	})
</script>

<ModalRenderer bind:show {disableSubmitButton} {submit} {close}>
	{#snippet content({ handleSubmit, handleClose })}
		{#if show}
			<!-- role/aria-modal + use:dialog: focus moves in on open, Tab stays inside, Escape closes
			     and focus returns to whatever opened the modal. Backs login/signup/forgot-password. -->
			<div
				style="z-index: {zIndex};"
				transition:fade={{ duration: 100 }}
				role="dialog"
				aria-modal="true"
				aria-labelledby={hideHeader ? undefined : titleId}
				aria-label={hideHeader ? title : undefined}
				tabindex="-1"
				use:dialog={handleClose}
				class="frosted-black fixed inset-0 h-[100dvh] w-full items-center justify-center
      {show ? 'flex' : 'hidden'}"
			>
				<Card.Root
					class="overflow-hidden border
        {rounded ? '' : 'rounded-none'} {rootClass}
        {wAuto ? '' : useMaxWidth ? 'w-full max-w-[80vw]' : 'width'}
        {hAuto ? '' : useMaxHeight ? 'max-h-[80vh] ' : 'h-[80vh]'}"
				>
					<div class="{hAuto ? '' : useMaxHeight ? 'max-h-[80vh] ' : 'h-[80vh]'} overflow-y-auto">
						{#if !hideHeader}
							<Card.Header style="z-index: {zIndex};" class="sticky top-0 flex w-full flex-row items-center justify-between gap-4 border-b p-4 px-6">
								<h2 id={titleId} class="text-lg capitalize sm:text-xl">
									{title}
								</h2>

								<div class="flex flex-row gap-3">
									{#if confirmButtonPosition === 'top'}
										<div class="flex items-center justify-end gap-2">
											<Button type="submit" onclick={handleSubmit} disabled={disableSubmitButton} class="min-w-40">
												{confirmButtonText}
											</Button>
										</div>
									{/if}

									<Button variant="ghost" size="icon" aria-label="Close modal button" type="button" onclick={handleClose}>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
											<path
												fill-rule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clip-rule="evenodd"
											></path>
										</svg>
									</Button>
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
										<Button type="submit" disabled={disableSubmitButton}>
											{confirmButtonText}
										</Button>
									</div>
								{/if}
							{/if}
						</form>
					</div>
				</Card.Root>
			</div>
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
