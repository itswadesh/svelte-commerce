<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import Textbox from '$lib/components/form/textbox.svelte'
	import { Textarea } from '$lib/components/ui/textarea'
	import { LoaderCircle, X } from '@lucide/svelte'
	import { enquiryService, EnquiryService } from '$lib/core/services'
	import { z } from 'zod'
	import { toast } from 'svelte-sonner'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { dialog } from '$lib/actions/dialog.js'
	import { onDestroy, onMount } from 'svelte'

	let { isOpen = false, productId = '', productTitle = '', onClose = () => {} } = $props()

	const enquiryPlugin = $derived(page.data?.store?.plugins?.enquiryMode)

	let name = $state('')
	let email = $state('')
	let phone = $state('')
	let message = $state('')
	let loading = $state(false)
	const modalHistoryKey = '__svelteCommerceEnquiryModal'
	let ownsHistoryEntry = false

	function handleBrowserBack() {
		if (!isOpen || !ownsHistoryEntry) return
		ownsHistoryEntry = false
		onClose()
	}

	onMount(() => {
		window.addEventListener('popstate', handleBrowserBack)
		return () => window.removeEventListener('popstate', handleBrowserBack)
	})

	$effect(() => {
		if (typeof window === 'undefined') return

		if (isOpen && !ownsHistoryEntry) {
			history.pushState({ ...history.state, [modalHistoryKey]: true }, '', window.location.href)
			ownsHistoryEntry = true
		} else if (!isOpen && ownsHistoryEntry) {
			const isCurrentModalEntry = history.state?.[modalHistoryKey] === true
			ownsHistoryEntry = false
			if (isCurrentModalEntry) history.back()
		}
	})

	onDestroy(() => {
		if (typeof window !== 'undefined' && ownsHistoryEntry && history.state?.[modalHistoryKey] === true) {
			history.back()
		}
	})

	const schema = {
		name: z.string().min(2, 'First name must be at least 2 characters'),
		email: z
			.string()
			.email('Please enter a valid email address')
			.min(5, 'Email must be at least 5 characters')
			.max(100, 'Email must be less than 100 characters'),
		phone: z
			.string()
			.regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
			.min(9, 'Please enter a valid phone number')
	}

	async function handleSubmit() {
		try {
			loading = true
			await enquiryService.create({ name, email, phone, message, productId })
			toast.success('Enquiry submitted successfully')
			// Close only on success. Closing in a `finally` threw away the name, phone and message the
			// shopper had just typed the moment the request failed, so the retry the toast invites
			// meant typing all of it again.
			onClose()
			await goto('/enquiry/success')
		} catch (e: any) {
			toast.error(e?.message || 'Failed to submit enquiry')
		} finally {
			loading = false
		}
	}
</script>

{#if isOpen}
	<!-- A real dialog. This was a bare overlay: opening it moved no focus, Tab walked the product page
	     behind it, and Escape did nothing. `use:dialog` moves focus in, traps Tab, closes on Escape
	     and hands focus back to whatever opened it. -->
	<div
		class="fixed inset-0 z-modal flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby="enquiry-modal-title"
		tabindex="-1"
		use:dialog={() => onClose()}
	>
		<!-- The scrim is decoration: a click target, not a control. -->
		<div aria-hidden="true" class="absolute inset-0 bg-black/40" onclick={() => onClose()}></div>
		<div class="relative w-full max-w-md rounded-lg border bg-background p-6 shadow-z-10">
			<button
				type="button"
				aria-label="Close enquiry form"
				class="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				onclick={() => onClose()}
			>
				<X size={20} />
			</button>

			<h2 id="enquiry-modal-title" class="mb-4 pr-10 text-xl font-semibold text-foreground">{productTitle}</h2>

			<form
				onsubmit={(e: SubmitEvent) => {
					e.preventDefault()
					handleSubmit()
				}}
				class="space-y-4"
			>
				<div>
					<Textbox schema={schema.name} type="text" label="Your Name" bind:value={name} required />
				</div>

				<div>
					<Textbox schema={schema.email} type="email" label="Your Email" bind:value={email} required />
				</div>

				<div>
					<Textbox schema={schema.phone} type="tel" label="Your Phone" bind:value={phone} required />
				</div>

				<div>
					<Textarea placeholder="Your Message" bind:value={message} required rows={4} />
				</div>

				<Button type="submit" class="w-full" disabled={loading}>
					{#if loading}
						<LoaderCircle class="animate-spin" />
					{:else}
						Submit Enquiry
					{/if}
				</Button>
			</form>
		</div>
	</div>
{/if}
