import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/svelte'
import CriteoTag from '$lib/components/common/criteo-tag.svelte'
import { adsAllowed, criteoAccount, criteoSiteType, loadCriteo } from '$lib/criteo'

describe('criteoAccount', () => {
	it('loads the account only when the store switched Criteo on', () => {
		expect(criteoAccount({ active: true, accountId: '67357' })).toBe('67357')
		expect(criteoAccount({ active: false, accountId: '67357' })).toBe('')
		expect(criteoAccount(undefined)).toBe('')
	})

	it('refuses anything but digits, since the account goes into a script URL', () => {
		expect(criteoAccount({ active: true, accountId: '67357&x=<script>' })).toBe('')
		expect(criteoAccount({ active: true, accountId: '' })).toBe('')
	})
})

describe('adsAllowed', () => {
	it('follows a saved choice wherever the visitor is', () => {
		expect(adsAllowed('{"ad_storage":"denied","analytics_storage":"denied"}', 'Asia/Kolkata')).toBe(false)
		expect(adsAllowed('{"ad_storage":"granted","analytics_storage":"granted"}', 'Europe/Berlin')).toBe(true)
	})

	it('waits for "Accept all" in opt-in regions, and allows ads elsewhere, when nothing is saved', () => {
		expect(adsAllowed(null, 'Europe/London')).toBe(false)
		expect(adsAllowed(null, 'Atlantic/Reykjavik')).toBe(false)
		expect(adsAllowed(null, 'Asia/Kolkata')).toBe(true)
		expect(adsAllowed('not json', 'America/New_York')).toBe(true)
	})
})

describe('loadCriteo', () => {
	it("adds Criteo's tag once, with the account and the site type queued", () => {
		loadCriteo('67357')
		loadCriteo('67357')
		const tags = document.querySelectorAll('script[src="https://dynamic.criteo.com/js/ld/ld.js?a=67357"]')
		expect(tags).toHaveLength(1)
		expect((tags[0] as HTMLScriptElement).async).toBe(true)
		expect((window as any).criteo_q.slice(0, 2)).toEqual([
			{ event: 'setAccount', account: 67357 },
			{ event: 'setSiteType', type: criteoSiteType(navigator.userAgent) }
		])
	})

	it('tells phones, tablets and desktops apart', () => {
		expect(criteoSiteType('Mozilla/5.0 (Linux; Android 13; Pixel 7) Mobile Safari')).toBe('m')
		expect(criteoSiteType('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)')).toBe('t')
		expect(criteoSiteType('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0')).toBe('d')
	})
})

describe('criteo-tag.svelte', () => {
	// A visitor outside the opt-in regions, whatever time zone runs the tests.
	beforeEach(() => {
		vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({ timeZone: 'Asia/Kolkata' } as Intl.ResolvedDateTimeFormatOptions)
	})
	afterEach(() => vi.restoreAllMocks())

	const tag = (account: string) => document.querySelector(`script[src="https://dynamic.criteo.com/js/ld/ld.js?a=${account}"]`)

	it('loads on the first interaction, and not for a store without Criteo', async () => {
		render(CriteoTag, { props: { plugin: { active: true, accountId: '111' } } })
		render(CriteoTag, { props: { plugin: { active: false, accountId: '222' } } })
		expect(tag('111')).toBeNull()
		await fireEvent.pointerDown(window)
		expect(tag('111')).not.toBeNull()
		expect(tag('222')).toBeNull()
	})

	it('stays away after "Required only" and loads after "Accept all"', async () => {
		localStorage.setItem('user_consent', '{"ad_storage":"denied","analytics_storage":"denied"}')
		render(CriteoTag, { props: { plugin: { active: true, accountId: '333' } } })
		await fireEvent.pointerDown(window)
		expect(tag('333')).toBeNull()
		window.dispatchEvent(new CustomEvent('consentchange', { detail: { ad_storage: 'granted', analytics_storage: 'granted' } }))
		expect(tag('333')).not.toBeNull()
		localStorage.removeItem('user_consent')
	})
})
