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
					const { sid, me } = this.retrieveUserId()
					// console.log('🚀 ~ UserState ~ fetch:', sid, me)
					if (sid) {
						this.user = me
						// const me = await userService.getMe()
						// console.log('🚀 ~ UserState ~ fetch:', sid, me)
						// this.user = me
						// console.log('🚀 ~ UserState ~ fetch:', me)
					} else {
						this.user = null
					}
					res()
				} catch (e) {
					this.user = null
					// console.log('🚀 ~ UserState ~ error ~ e:', e)
					rej()
				} finally {
					this.loading = false
				}
			})
		})
	}

	async signup({ email, password, firstName, lastName, phone, role, cartId = null, origin }: any) {
		this.loading = true
		try {
			const me = await userService.signup({ email, password, firstName, lastName, phone, cartId, origin })
			this.user = me
			toast.success('Signup successful')
		} catch (e) {
			toast.error('Signup Failed')
			console.error(e)
		}
		this.loading = false
	}

	async joinAsVendor({ email, password, firstName, lastName, businessName, phone, role, cartId = null }: any) {
		try {
			this.loading = true
			const me = await userService.joinAsVendor({ email, password, businessName, firstName, lastName, phone, role: 'VENDOR', cartId })
			this.user = me
			toast.success('Signup successful')
			goto('/dash')
		} catch (e) {
			this.user = null
			// console.log(e)
			toast.error(e.message || e.toString())
		} finally {
			this.loading = false
		}
	}

	async verifyOtp({ phone, otp }: any) {
		// console.log('🚀 ~ UserState ~ add:', phone, otp)
		try {
			this.loading = true
			const me = await authService.verifyOtp({ phone, otp })
			this.user = me
			if (me?.role === 'VENDOR' || me?.role === 'ADMIN') {
				goto('/dash')
			} else {
				goto('/')
			}
		} catch (e) {
			// console.log(e)
			this.user = null
			toast.error(e.message || e.toString())
		} finally {
			this.loading = false
		}
	}

	async login({ email, password, cartId = null }: any) {
		// console.log('🚀 ~ UserState ~ add:', email, password, cartId)
		try {
			this.loading = true
			const me = await userService.login({
				email,
				password,
				cartId
			})
			this.user = me
			// console.log('🚀 ~ UserState ~ login ~ me:', me)
			if (me?.role === 'ADMIN') {
				goto('/select-store')
			} else if (me?.role === 'VENDOR') {
				goto('/dash')
			} else {
				goto('/')
			}
			return true
		} catch (e) {
			// console.log(e)
			this.user = null
			toast.error(e.message || e.toString())
			return false
		} finally {
			this.loading = false
		}
	}

	async logout() {
		// console.log('🚀 ~ UserState ~ lgout:')
		try {
			this.loading = true
			const me = await userService.logout()
			// console.log('🚀 ~ UserState ~ lgout ~ me:', me)
			this.user = me
			await goto('/')
			showAuthModal('login')
		} catch (e) {
			// console.log(e.message)
			this.user = null
			toast.error(e.message || e.toString())
		} finally {
			this.loading = false
		}
	}

	async updateMe({ id, firstName, lastName, phone, email }: any) {
		// console.log('🚀 ~ UserState ~ update:', { firstName, lastName, phone, email })
		try {
			this.loading = true
			// console.log("FirstName: ", firstName)
			const me = await userService.updateProfile({ id, firstName, lastName, phone, email })
			// console.log('🚀 ~ UserState ~ add ~ c:', c)
			this.user = me
		} catch (e) {
			this.user = null
			// console.log(e)
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
