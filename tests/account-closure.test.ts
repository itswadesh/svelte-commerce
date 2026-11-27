import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/svelte'
import { page } from '$app/state'
import ClosePage from '../src/routes/(my)/my/profile/delete/+page.svelte'

describe('closing an account', () => {
	afterEach(() => cleanup())

	it("points at the store's own email and the contact page, with no button that cannot succeed", () => {
		page.data = { store: { name: 'Demo', businessEmail: 'hello@demo.example' } }
		const { container, getByTestId } = render(ClosePage)
		const line = getByTestId('account-closure')
		expect(line.textContent?.replace(/\s+/g, ' ').trim()).toBe(
			'To close your account, email the store at hello@demo.example, or use the contact page.'
		)
		expect(line.querySelector('a[href="mailto:hello@demo.example"]')).not.toBeNull()
		expect(line.querySelector('a[href="/contact-us"]')).not.toBeNull()
		expect(container.querySelector('button')).toBeNull()
	})

	it('prefers the contact email, and leaves the email out when the store has none', () => {
		page.data = { store: { contact: { email: 'care@demo.example' }, businessEmail: 'old@demo.example' } }
		render(ClosePage)
		expect(document.querySelector('a[href^="mailto:"]')?.getAttribute('href')).toBe('mailto:care@demo.example')
		cleanup()

		page.data = { store: { name: 'Demo', businessEmail: null } }
		const { getByTestId } = render(ClosePage)
		const line = getByTestId('account-closure')
		expect(line.textContent?.replace(/\s+/g, ' ').trim()).toBe('To close your account, use the contact page.')
		expect(line.querySelector('a[href^="mailto:"]')).toBeNull()
	})
})
