import { goto, replaceState } from '$app/navigation'
import { env } from '$env/dynamic/public'
import { authService } from '$lib/core/services'
import { getUserState } from '$lib/core/stores/auth.svelte'
import { getCartState } from '$lib/core/stores/cart.svelte'
import { toast } from 'svelte-sonner'
import { z } from 'zod'

export const schemas = {
	email: z
		.string()
		.email('Please enter a valid email address')
		.min(5, 'Email must be at least 5 characters')
		.max(100, 'Email must be less than 100 characters'),
	phone: z
		.string()
		.regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
		.min(9, 'Please enter a valid phone number')
		.max(17, 'Please enter a valid phone number'),
	password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password must be less than 100 characters'),
	otp: z
		.string()
		.length(4, 'OTP must be 4 digits')
		.regex(/^[0-9]+$/, 'OTP must contain only numbers')
}

export class LoginModule {
	userState = getUserState()
	cartState = getCartState()

	identifier = $state(env.PUBLIC_LOGIN_TYPE === 'PHONE' ? '+918249028220' : '')
	password = $state('')
	isLoading = $state(false)
	isPhoneNumber = $state(env.PUBLIC_LOGIN_TYPE === 'PHONE' || env.PUBLIC_LOGIN_TYPE === 'BOTH')
	otp = $state('')
	showOtp = $state(false)
	step = $state(1)
	otpInputRef: HTMLInputElement | null = $state(null)
	showSignupButton = $state(true)

	handleSubmit = async (e: Event) => {
		e.preventDefault()
		try {
			this.isLoading = true

			if (this.isPhoneNumber) {
				await authService.getOtp({ phone: this.identifier })
				await this.cartState.updateEmail({ phone: this.identifier })
				this.step = 2
				setTimeout(() => {
					this.otpInputRef?.focus()
				}, 100)
			} else {
				const success = await this.userState.login({ email: this.identifier, password: this.password })
				await this.cartState.updateEmail({ email: this.identifier })

				if (success) {
					const url = new URL(window.location.href)
					const redirect = url.searchParams.get('redirect')
					goto(decodeURIComponent(redirect || '') || url.pathname, { replaceState: true })
				}

				return success
			}
		} catch (e) {
			toast.error((e as { message: string }).message || (e as { message: string }).toString())
		} finally {
			this.isLoading = false
		}
	}

	switchLoginType = () => {
		this.isPhoneNumber = !this.isPhoneNumber
		this.showOtp = this.isPhoneNumber
		this.showSignupButton = !this.isPhoneNumber
		this.identifier = ''
	}

	handleVerifyOtp = async () => {
		try {
			this.isLoading = true
			await this.userState.verifyOtp({ phone: this.identifier, otp: this.otp })
		} catch (e) {
			toast.error((e as { message: string }).message)
		} finally {
			this.isLoading = false
		}
	}

	removeUrlParams = () => {
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href)
			url.searchParams.delete('show_auth')
			url.searchParams.delete('login')
			url.searchParams.delete('redirect')
			replaceState(url.toString(), {})
		}
	}

	useDemoCredentials = (e: Event) => {
		this.identifier = 'hi@litekart.in'
		this.password = 'Litekart1'
		this.handleSubmit(e)
	}
}

