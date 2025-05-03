<script lang="ts">
	import { type Snippet } from "svelte"
	import { z } from "zod"

	interface Props {
		error?: string | string[]
		schema?: z.ZodType<any>
		validateOnChange: boolean
    initialType: string
    validityChange: (isValid: boolean) => void
		content: Snippet<[SnippetParams]>
	}

	let { content, error, schema, initialType, validateOnChange, validityChange }: Props = $props()

	interface SnippetParams {
    type: string
    touched: boolean
    isValid: boolean
    showPassword: boolean
    validationError: string
    togglePassword: () => void
    handleInput: (e: Event) => void
	}

	let validationError = $state('')
	let touched = $state(false)
	let isValid = $state(true)
	let showPassword = $state(false)
  let type = $state(initialType)

	function validateInput(val: string) {
		if (!schema) return true
		const result = schema.safeParse(val)
		validationError = result.success ? '' : result.error.errors[0].message
		isValid = result.success
		validityChange(result.success)
		return result.success
	}

	function handleInput(event: Event) {
		touched = true
		if (!schema || !validateOnChange) return
		const input = event.target as HTMLInputElement
		validateInput(input.value)
	}

	function togglePassword() {
		showPassword = !showPassword
		type = showPassword ? 'text' : 'password'
	}

	$effect(() => {
		if (error) {
			validationError = Array.isArray(error) ? error[0] : error
			isValid = false
		}
	})
</script>

{@render content({ showPassword, type, touched, validationError, isValid, handleInput, togglePassword  })}
