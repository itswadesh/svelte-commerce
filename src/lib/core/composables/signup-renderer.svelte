<script lang="ts">
	import { toast } from 'svelte-sonner'
	import { z } from 'zod'
	import { getUserState } from '$lib/core/stores/auth.svelte'
	import { goto, replaceState } from '$app/navigation'
	import { page } from '$app/state'
	import type { Snippet } from 'svelte'

	interface Props {
		info: {
			firstName: string
			lastName: string
			email: string
			password: string
			confirmPassword: string
		}
		content: Snippet<[SnippetParams]>
		show: boolean
	}
	let { content, show = $bindable(false), info = $bindable() }: Props = $props()

	type callbackFunction = (success: boolean) => void
	interface SnippetParams {
		isLoading: boolean
		handleSubmit: (e: Event, callback?: callbackFunction) => void
		closeModal: () => void
		schemas: any
	}

	const userState = getUserState()

	// const IS_DEV = import.meta.env.DEV
	let isLoading = $state(false)
	// let phone = $state(IS_DEV ? '+918249028220' : '')

	const schemas = {
		firstName: z
			.string()
			.min(2, 'First name must be at least 2 characters')
			.max(50, 'First name must be less than 50 characters')
			.regex(/^[a-zA-Z\s]*$/, 'First name can only contain letters and spaces'),
		lastName: z
			.string()
			.min(2, 'Last name must be at least 2 characters')
			.max(50, 'Last name must be less than 50 characters')
			.regex(/^[a-zA-Z\s]*$/, 'Last name can only contain letters and spaces'),
		email: z
			.string()
			.email('Please enter a valid email address')
			.min(5, 'Email must be at least 5 characters')
			.max(100, 'Email must be less than 100 characters'),
		// phone: z
		// 	.string()
		// 	.regex(/^(\+?\d{1,3}[- ]?)?\d{10}$/, 'Please enter a valid 10-digit phone number')
		// 	.refine((val) => {
		// 		// Remove any non-digit characters
		// 		const digits = val.replace(/\D/g, '')
		// 		// Check if it's exactly 10 digits or if it starts with country code
		// 		return digits.length === 10 || (digits.length > 9 && digits.length <= 17)
		// 	}, 'Phone number must be 10 digits'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(100, 'Password must be less than 100 characters')
			.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
			.regex(/[0-9]/, 'Password must contain at least one number')
			.regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
		confirmPassword: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(100, 'Password must be less than 100 characters')
			.refine((val) => val === info.password, {
				message: 'Passwords do not match'
			})
	}

	async function handleSubmit(e: Event, callback?: callbackFunction) {
		e.preventDefault()
		try {
			isLoading = true
			const res = await userState.signup({
				firstName: info.firstName,
				lastName: info.lastName,
				email: info.email,
				password: info.password,
				origin: page.url.origin
				// phone,
			})
			if (!res) return

			toast.success('Account created successfully')
			callback?.(true)
			goto(`/auth/signup/success?email=${encodeURIComponent(info.email)}`)
			show = false
		} catch (e: any) {
			toast.error(e.message)
			callback?.(false)
		} finally {
			isLoading = false
		}
	}

	function closeModal() {
		show = false

		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href)
			url.searchParams.delete('show_auth')
			url.searchParams.delete('signup')
			url.searchParams.delete('redirect')
			replaceState(url.toString(), {})
		}
	}
</script>

<svelte:head>
	<title>Create Account - {page?.data?.store?.name || ''}</title>
	<meta name="description" content="Create your account at {page?.data?.store?.name} to start shopping and discover amazing products." />
</svelte:head>

{@render content({
	handleSubmit,
	closeModal,
	isLoading,
	schemas
})}
