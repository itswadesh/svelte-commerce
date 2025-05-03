import { page } from '$app/state'
import { authService } from '$lib/core/services'
import { getUserState } from '$lib/core/stores/auth.svelte'
import { onMount } from 'svelte'
import { toast } from 'svelte-sonner'

export class ResetPasswordModule {
	userState = getUserState()
	email: string = $state('')
	success = $state(false)
	isLoading = $state(false)
	error: string = $state('')
	password: string = $state('')
	token: string = $state('')
	userId: string = $state('')
	retype: string = $state('')

	constructor() {
		onMount(() => {
			try {
				this.token = page.url.searchParams.get('token') || ''
				this.userId = page.url.searchParams.get('id') || ''
				if (!this.token && !this.userId) {
					toast.error('Invalid password reset link')
					return
				}
			} catch (e: any) {
				console.log('This is error:', e)
			}
		})
	}

	handleSubmit = async () => {
		if (this.password.length > 0 && this.password === this.retype) {
			await authService.resetPassword({ userId: this.userId, token: this.token, password: this.password })
			toast.info('Password Reset Successful')
			this.userState.logout()
			return
		}
		toast.error("Password and Retype don't match")
	}
}

