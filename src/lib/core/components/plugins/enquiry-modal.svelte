<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Textarea } from '$lib/components/ui/textarea'
	import { X } from 'lucide-svelte'
	import { enquiryService, EnquiryService } from '$lib/core/services'

	let { isOpen = false, productId = '', productTitle = '', onClose = () => {} } = $props()

	let name = $state('')
	let email = $state('')
	let phone = $state('')
	let message = $state('')

	async function handleSubmit() {
		// TODO: Implement enquiry submission logic
		// console.log({ name, email, phone, message, productId })
		enquiryService.create({ name, email, phone, message, productId })
		onClose()
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

			<h2 class="mb-4 text-xl font-semibold dark:text-white">Enquire About {productTitle}</h2>

			<form
				onsubmit={(e: SubmitEvent) => {
					e.preventDefault()
					handleSubmit()
				}}
				class="space-y-4"
			>
				<div>
					<Input type="text" placeholder="Your Name" bind:value={name} required />
				</div>

				<div>
					<Input type="email" placeholder="Your Email" bind:value={email} required />
				</div>

				<div>
					<Input type="tel" placeholder="Your Phone" bind:value={phone} required />
				</div>

				<div>
					<Textarea placeholder="Your Message" bind:value={message} required rows={4} />
				</div>

				<Button type="submit" class="w-full">Submit Enquiry</Button>
			</form>
		</div>
	</div>
{/if}
