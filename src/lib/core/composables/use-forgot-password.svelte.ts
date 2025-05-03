import { browser } from '$app/environment'
import { goto, replaceState } from '$app/navigation'
import { page } from '$app/state'
import { authService } from '$lib/core/services'
import { onMount } from 'svelte'
import { toast } from 'svelte-sonner'
import { z } from 'zod'

export const schemas = {
	email: z
		.string()
		.email('Please enter a valid email address')
		.min(5, 'Email must be at least 5 characters')
		.max(100, 'Email must be less than 100 characters')
		.refine((val) => val.includes('@'), {
			message: 'Please enter a valid email address'
		})
}

export class ForgotPasswordModule {
	email = $state('')
	success = $state(false)
	isLoading = $state(false)

	constructor() {
		onMount(() => {
			if (browser) {
				const url = new URL(window.location.href)
				this.email = decodeURIComponent(url.searchParams.get('email') || '')
			}
		})
	}

	handleSubmit = async (e: SubmitEvent, redirectAfterSuccess: boolean) => {
		e.preventDefault()
		try {
			this.isLoading = true
			const referrer = new URL(window.location.href)?.origin
			await authService.forgotPassword({ email: this.email, referrer })
			if (redirectAfterSuccess) goto(`/auth/forgot-password/success?email=${encodeURIComponent(this.email)}`)
			this.success = true
		} catch (e: any) {
			toast.error(e.message)
		} finally {
			this.isLoading = false
		}
	}

	removeUrlParams = () => {
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href)
			url.search = ''
			replaceState(url.toString(), {})
		}
	}
}

