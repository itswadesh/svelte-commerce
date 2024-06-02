<script lang="ts">
	import type { Snippet } from 'svelte'
  import { varniCustomDesignService } from '$lib/core/services'
	import { z } from 'zod'
  import { customDesignFormSchema, jewelryTypes, metalTypes } from '$lib/config'

  const formSchema = z.object(customDesignFormSchema)

	interface Props {
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

	const { content, request = $bindable() }: Props = $props()

	interface SnippetParams {
		success: boolean
		loading: boolean
		errors: Record<string, string>
		jewelryTypes: string[]
		metalTypes: string[]
		handleSubmit: (e: Event) => void
		handleImageUpload: (urls: string[]) => void
		handleImageDelete: () => void
	}

	let success = $state(false)
	let loading = $state(false)
	let errors = $state<Record<string, string>>({})

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
			} else {
				console.error(error)
				errors = { form: 'An unexpected error occurred' }
			}
		} finally {
			loading = false
		}
	}

	const handleImageUpload = (urls: string[]) => {
    if (request.img) request.img = [request.img, ...urls].join(',')
		else request.img = urls.join(',')
	}

	const handleImageDelete = () => (request.img = '')
</script>

{@render content({
	handleSubmit,
	handleImageUpload,
	handleImageDelete,
	loading,
	errors,
	success,
	jewelryTypes,
	metalTypes
})}
