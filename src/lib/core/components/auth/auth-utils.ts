import { browser } from '$app/environment'
import { replaceState } from '$app/navigation'
import { showModal } from './auth-store'

export type AuthType = 'login' | 'signup' | 'forgot-password'

export function updateQueryParam(key: string, value: string, extraqueries?: Record<string, string>) {
	const url = new URL(window.location.href)
	url.searchParams.set(key, value)
	if (extraqueries) {
		for (const [key, value] of Object.entries(extraqueries)) {
			url.searchParams.set(key, encodeURIComponent(value))
		}
	}
	if (browser) replaceState(url, {})
}

export function removeQueryParam(key: string) {
	const url = new URL(window.location.href)
	url.searchParams.delete(key)
	if (browser) replaceState(url, {})
}

export function removeAllQueryParams() {
	const url = new URL(window.location.href)
	url.search = ''
	if (browser) replaceState(url, {})
}

export function showAuthModal(type: AuthType, extraqueries?: Record<string, string>) {
	removeAllQueryParams()

	if (type === 'login') {
		updateQueryParam('show_auth', 'true')
		updateQueryParam('login', 'true', extraqueries)
	} else if (type === 'signup') {
		updateQueryParam('show_auth', 'true')
		updateQueryParam('signup', 'true', extraqueries)
	} else if (type === 'forgot-password') {
		updateQueryParam('show_auth', 'true')
		updateQueryParam('forgot-password', 'true', extraqueries)
	}

	showModal.set(true)
	showModal.set(false)
}
