<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import Textbox from '$lib/components/form/textbox.svelte'
	import { Textarea } from '$lib/components/ui/textarea'
	import { LoaderCircle, X } from 'lucide-svelte'
	import { enquiryService, EnquiryService } from '$lib/core/services'
	import { z } from 'zod'
	import { toast } from 'svelte-sonner'
  import { goto } from '$app/navigation'
	import { page } from '$app/state'

	let { isOpen = false, productId = '', productTitle = '', onClose = () => {} } = $props()

	const enquiryPlugin = $derived(page.data?.store?.plugins?.enquiryMode)

	let name = $state('')
	let email = $state('')
	let phone = $state('')
	let message = $state('')
  let loading = $state(false)

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
		// TODO: Implement enquiry submission logic
		// console.log({ name, email, phone, message, productId })
		try {
      loading = true
			await enquiryService.create({ name, email, phone, message, productId })
      toast.success("Enquiry submitted successfully")
      await goto('/enquiry/success')
		} catch (e: any) {
      toast.error(e?.message || "Failed to submit enquiry")
		} finally {
      loading = false
		  onClose()
		}
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div class="relative w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
			<button
				class="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
				onclick={(e: MouseEvent) => onClose()}
			>
				<X size={20} />
			</button>

			<h2 class="mb-4 text-xl font-semibold dark:text-white"> {productTitle}</h2>

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
