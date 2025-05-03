import { goto } from '$app/navigation'
import { page } from '$app/state'
import { authService } from '$lib/core/services'
import { toast } from 'svelte-sonner'
import { z } from 'zod'

const IS_DEV = import.meta.env.DEV

export class JoinAsVendorModule {
	firstName = $state(IS_DEV ? 'Swadesh' : '')
	lastName = $state(IS_DEV ? 'Behera' : '')
	phone = $state(IS_DEV ? '1234567890' : '')
	businessName = $state(IS_DEV ? 'Misiki' : '')
	password = $state(IS_DEV ? 'litekart' : '')
	email = $state(IS_DEV ? 'hi@litekart.in' : '')
	confirmPassword = $state(IS_DEV ? 'litekart' : '')
	isLoading = $state(false)

	schemas = {
		firstName: z.string().min(2, 'First name must be at least 2 characters'),
		lastName: z.string().min(2, 'Last name must be at least 2 characters'),
		email: z.string().email('Please enter a valid email address'),
		phone: z.string().min(9, 'Please enter a valid phone number'),
		businessName: z.string().min(3, 'Business name must be at least 3 characters'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.refine((val) => val === this.password, {
				message: 'Passwords do not match'
			})
	}

	constructor() {}

	handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()

		if (this.password !== this.confirmPassword) {
			toast.error('Passwords do not match')
			return
		}

		const url = new URL(window.location.href)
		const searchParams = url.searchParams
		const role = searchParams.get('role') || 'vendor'
		try {
			this.isLoading = true
			await authService.joinAsVendor({
				firstName: this.firstName,
				lastName: this.lastName,
				businessName: this.businessName,
				phone: this.phone,
				email: this.email,
				password: this.password,
				role,
				origin: page.url.origin
			})
			toast.success('Vendor application received')
			goto('/auth/join-as-vendor/success')
		} catch (e: any) {
			toast.error(e.message)
		} finally {
			this.isLoading = false
		}
	}
}

