<script lang="ts">
	import { contactService } from '$lib/core/services'
	import type { Snippet } from 'svelte'
	import { z } from 'zod'
  
  interface Props {
    info: {
      name: string,
      email: string,
      message: string
    }
    content: Snippet<[SnippetParams]> 
  }

	const { content, info = $bindable() }: Props = $props()

	interface SnippetParams {
		success: boolean
		loading: boolean
		error: string
		nameError: string
		emailError: string
		messageError: string
		handleSubmit: (e: Event) => void
	}

	let success = $state(false)
	let loading = $state(false)
	let error = $state('')

	const schema = {
		name: z.string().min(2, 'Name must be at least 2 characters'),
		email: z.string().email('Please enter a valid email address'),
		message: z.string().min(10, 'Message must be at least 10 characters')
	}

	let nameError = $state('')
	let emailError = $state('')
	let messageError = $state('')

	const validateForm = () => {
		const nameResult = schema.name.safeParse(info.name)
		const emailResult = schema.email.safeParse(info.email)
		const messageResult = schema.message.safeParse(info.message)

		nameError = nameResult.success ? '' : nameResult.error.errors[0].message
		emailError = emailResult.success ? '' : emailResult.error.errors[0].message
		messageError = messageResult.success ? '' : messageResult.error.errors[0].message

		return nameResult.success && emailResult.success && messageResult.success
	}

	const handleSubmit = async (event: Event) => {
		event.preventDefault()
		if (!validateForm()) return

		loading = true
		error = ''
		try {
			await contactService.submitContactUsForm({ name: info.name, email: info.email, message: info.message })
			success = true
		} catch (err) {
			error = 'Failed to send message. Please try again later.'
		} finally {
			loading = false
		}
	}
</script>

{@render
  content({
    handleSubmit,
    nameError,
    messageError,
    emailError,
    loading,
    error,
    success,
  })
}
