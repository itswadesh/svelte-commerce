<script lang="ts">
	import type { Snippet } from 'svelte'
	import { varniCustomDesignService } from '$lib/core/services'
	import { z, ZodSchema } from 'zod'
	import { toast } from 'svelte-sonner'

	interface Props {
		formSchema: ZodSchema
		request: {
			name: string
			email: string
			phone: string
			jewelryType: string
			metalType: string
			designDescription: string
			budget: string
			timeline: string
			img: string
		}
		content: Snippet<[SnippetParams]>
	}

	const { content, formSchema, request = $bindable() }: Props = $props()

	interface SnippetParams {
		success: boolean
		loading: boolean
		errors: Record<string, string>
		handleSubmit: (e: Event) => void
		handleImageUpload: (urls: string[], index?: number) => void
		handleImageDelete: (index?: number) => void
	}

	let success = $state(false)
	let loading = $state(false)
	let errors = $state<Record<string, string>>({})
	let uploadedImages = $state<(string | string[])[]>([])

	const handleSubmit = async (event: Event) => {
		event.preventDefault()
		errors = {} // Reset errors

		try {
			const validatedData = formSchema.parse(request)

			loading = true
			await varniCustomDesignService.submitForm(validatedData)
			success = true
		} catch (error) {
			if (error instanceof z.ZodError) {
				errors = Object.fromEntries(Object.entries(error.flatten().fieldErrors).map(([key, value]) => [key, value?.[0] || '']))
        // display one error at a time
				const errorMessage = Object.values(errors).filter(Boolean)[0]
				toast.error(errorMessage)
			} else {
				console.error(error)
				errors = { form: 'An unexpected error occurred' }
			}
		} finally {
			loading = false
		}
	}

	const updateImg = () => (request.img = uploadedImages.flat().filter(Boolean).join(','))
	const handleImageUpload = (urls: string[], index = 0) => {
		uploadedImages[index] = urls
		updateImg()
	}

	const handleImageDelete = (index = 0) => {
		uploadedImages.splice(index, 1)
		updateImg()
	}
</script>

{@render content({
	handleSubmit,
	handleImageUpload,
	handleImageDelete,
	loading,
	errors,
	success
})}
