import { goto } from '$app/navigation'
import { getContext, onDestroy, onMount, setContext } from 'svelte'
import { toast } from 'svelte-sonner'
import { authService, userService } from '$lib/core/services'
import { showAuthModal } from '$lib/core/components/auth/auth-utils'

export function parseCookies(cookieString: string): Record<string, string> {
	return cookieString.split(';').reduce((cookies, cookie) => {
		const [name, value] = cookie.trim().split('=')
		cookies[name] = value
		return cookies
	}, {})
}

const initialUser = { user_id: '0', items: [], subtotal: 0, total: 0 }
export class UserState {
	user = $state<any>(initialUser)
  lastError = $state<any | null>(null)
	loading = $state<boolean>(false)
	hasLoaded: Promise<void>
	retrieveUserId = () => {
		const cookies = parseCookies(document.cookie)
		const sid = cookies['connect.sid'] || null
		const me = JSON.parse(decodeURIComponent(cookies['me'] || '{}'))
		return { sid, me }
	}

	constructor() {
		this.hasLoaded = new Promise((res, rej) => {
			onMount(async () => {
				try {
					this.loading = true
          this.lastError = null
					const { sid, me } = this.retrieveUserId()

				  this.user = me ?? null
          /*
					if (sid) {
						// const me = await userService.getMe()

						// this.user = me

					} else {
						this.user = null
					}
          */
					res()
				} catch (e: any) {
					this.user = null
          this.lastError = e

					rej()
				} finally {
					this.loading = false
				}
			})
		})
	}

	async signup({ email, password, firstName, lastName, phone, role, cartId = null, origin }: any) {
		this.loading = true
    this.lastError = null
		try {
			const me = await userService.signup({ email, password, firstName, lastName, phone, cartId, origin })
			this.user = me
      return true
		} catch (e: any) {
      this.lastError = e
			toast.error(e.message || 'Signup Failed')
      return false
		} finally {
		  this.loading = false
    }
	}

	async joinAsVendor({ email, password, firstName, lastName, businessName, phone, role, cartId = null }: any) {
		try {
			this.loading = true
      this.lastError = null
			const me = await userService.joinAsVendor({ email, password, businessName, firstName, lastName, phone, role: 'VENDOR', cartId })
			this.user = me
			toast.success('Signup successful')
			goto('/dash')
		} catch (e: any) {
			this.user = null
      this.lastError = e

			toast.error(e.message || e.toString())
		} finally {
			this.loading = false
		}
	}

	async verifyOtp({ phone, otp }: any) {

		try {
			this.loading = true
      this.lastError = null
			const me = await authService.verifyOtp({ phone, otp })
			this.user = me
			if (me?.role === 'VENDOR' || me?.role === 'ADMIN') {
				goto('/dash')
			} else {
				goto('/')
			}
		} catch (e: any) {

			this.user = null
      this.lastError = e
			toast.error(e.message || e.toString())
		} finally {
			this.loading = false
		}
	}

	async login({ email, password, cartId = null }: any) {

		try {
			this.loading = true
      this.lastError = null
			const me = await userService.login({
				email,
				password,
				cartId
			})
			this.user = me

			//if (me?.role === 'ADMIN') {
			//	goto('/select-store')
			//} else if (me?.role === 'VENDOR') {
			//	goto('/dash')
			//} else {
			//	goto('/')
			//}
			return true
		} catch (e: any) {
			this.user = null
      this.lastError = e
			toast.error(e.message || e.toString())
			return false
		} finally {
			this.loading = false
		}
	}

	async logout() {

		try {
			this.loading = true
      this.lastError = null
			const me = await userService.logout()

			this.user = me
			await goto('/')
			showAuthModal('login')
		} catch (e: any) {

			this.user = null
      this.lastError = e
			toast.error(e.message || e.toString())
		} finally {
			this.loading = false
		}
	}

	async updateMe({ id, firstName, lastName, phone, email }: any) {

		try {
			this.loading = true
      this.lastError = null

			const me = await userService.updateProfile({ id, firstName, lastName, phone, email })

			this.user = me
		} catch (e: any) {
			this.user = null
      this.lastError = e

			toast.error(e.body.message)
		} finally {
			this.loading = false
		}
	}
}

const USER_KEY = Symbol('USER')

export function setUserState() {
	return setContext(USER_KEY, new UserState())
}

export function getUserState() {
	return getContext<ReturnType<typeof setUserState>>(USER_KEY)
}
