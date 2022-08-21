import { get, post } from '$lib/util/api'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { delay, toast } from '$lib/util'
import { WWW_URL } from './config'
import Cookie from 'cookie-universal'
import { GQL_login, GQL_me, GQL_signOut } from '$houdini'
const cookies = Cookie()

export function getUser() {
	return user.me
}

export async function signUp({ email, password, firstName, lastName, confirmPassword, role }) {
	let loading = true
	let me
	try {
		toast('Requesting server...', 'info')
		const { data, error, status } = await post('es/signup', {
			email,
			password,
			firstName,
			lastName,
			passwordConfirmation: confirmPassword,
			role
		})
		if (!data) return toast('Signup failed')
		me = {
			email: data.email,
			firstName: data.firstName,
			lastName: data.lastName,
			avatar: data.avatar,
			role: data.role,
			store: data.store,
			vendor: data.vendor,
			verified: data.verified,
			plan: data.plan,
			active: data.active
		}
		toast('Signup successful.', 'success')
		await cookies.set('me', me, { path: '/' })
		// goto('/my')
	} catch (e) {
		toast('Error: ' + e, 'error')
		throw e
	} finally {
		loading = false
	}
	return me
}

export async function signIn({ email, password }) {
	let loading = false
	let me
	try {
		toast('Signin In...', 'info')
		loading = true
		const data = (await GQL_login.mutate({ variables: { email, password } })).data?.login // post('es/login', { email, password })
		if (!data) {
			throw { message: 'Login failed' }
		}
		me = {
			email: data.email,
			firstName: data.firstName,
			lastName: data.lastName,
			avatar: data.avatar,
			role: data.role,
			store: data.store,
			vendor: data.vendor,
			verified: data.verified,
			plan: data.plan,
			active: data.active
		}
		toast('Login successful', 'success')
		await cookies.set('me', me, { path: '/' })
	} catch (e) {
		toast('Error: ' + e?.message, 'error')
		throw e
	} finally {
		loading = false
	}
	return me
}

export const signOut = async () => {
	let logout, error
	try {
		await GQL_signOut.mutate() //post('es/logout')
	} catch (e) {
		error = e
	} finally {
	}
	await cookies.set('me', null, { path: '/' })
	await cookies.remove('token')
	await cookies.remove('sid')
	await cookies.remove('me')
	return { data: logout, error }
}

export async function setStoreDetailsCookie() {
	try {
		const domain = user.domain
		let uri = new URL(`${WWW_URL}/api/init?domain=${domain}`)
		let res = await fetch(uri.toString(), { method: 'get' })
		if (res.ok) {
			let store = await res.json()
			const { id, email, address, phone, websiteName, websiteLegalName } = store.storeOne
			cookies.set(
				'store',
				JSON.stringify({ id, domain, address, phone, email, websiteName, websiteLegalName }),
				{
					path: '/'
				}
			)
		}
		return true
	} catch (e) {
		return false
	} finally {
	}
}
