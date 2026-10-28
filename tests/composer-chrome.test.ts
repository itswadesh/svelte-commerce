import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
	chromePreview,
	draftChromeSettings,
	fetchChrome,
	footerColumns,
	footerView,
	forgetChrome,
	headerView,
	shownFooterColumns,
	withChromeMenus
} from '$lib/composer/site-chrome'

// The header and footer a shop sets in the theme editor (GoCommerce ext/layouts, D131).
describe('the header the shop set', () => {
	it('shows the announcement strip where the shop chose, with a link only when it is a safe one', () => {
		expect(headerView({ show_announcement: true, announcement_text: ' Free returns ', announcement_link: '/products', announcement_pages: 'all' })).toEqual({
			announcement: { text: 'Free returns', link: '/products', everyPage: true },
			menu: true
		})
		expect(headerView({ show_announcement: true, announcement_text: 'Sale', announcement_pages: 'home' }).announcement).toEqual({
			text: 'Sale',
			link: null,
			everyPage: false
		})
		expect(headerView({ show_announcement: true, announcement_text: 'Hi', announcement_link: 'javascript:alert(1)' }).announcement?.link).toBeNull()
	})

	it('shows no strip when the shop switched it off, or left it with nothing to say', () => {
		expect(headerView({ show_announcement: false, announcement_text: 'Kept for later' }).announcement).toBeNull()
		expect(headerView({ show_announcement: true }).announcement).toBeNull()
		expect(headerView({}).announcement).toBeNull()
	})

	it('drops the menu only when the shop hid it; a header saved before the switch keeps it', () => {
		expect(headerView({ hide_menu: true, menu: 'header' }).menu).toBe(false)
		expect(headerView({ hide_menu: false }).menu).toBe(true)
		expect(headerView({ menu: 'header' }).menu).toBe(true)
		expect(headerView({ hide_menu: 'yes' }).menu).toBe(true)
	})
})

describe('the footer the shop set', () => {
	it('keeps its words, newsletter switch, social links and copyright line, all plain', () => {
		const view = footerView({
			about: ' Small-batch goods. ',
			newsletter: false,
			social: [
				{ network: 'instagram', url: 'https://instagram.com/example' },
				{ network: 'x', url: 'https://x.com/example' },
				{ network: 'facebook', url: 'javascript:alert(1)' },
				{ network: 'myspace', url: 'https://myspace.com/example' }
			],
			copyright: '© The shop'
		})
		expect(view.about).toBe('Small-batch goods.')
		expect(view.newsletter).toBe(false)
		// X is drawn with the mark the footer already keeps for it; an unsafe link and a network the
		// storefront has no name for are dropped.
		expect(view.social).toEqual([
			{ key: 'instagram', url: 'https://instagram.com/example' },
			{ key: 'twitter', url: 'https://x.com/example' }
		])
		expect(view.copyright).toBe('© The shop')
	})

	it('leaves to the storefront what the shop left empty', () => {
		expect(footerView({})).toEqual({ about: null, newsletter: null, social: [], copyright: null })
		expect(footerView(null)).toEqual({ about: null, newsletter: null, social: [], copyright: null })
	})
})

describe("the footer's columns from a menu", () => {
	it('makes a column of each top-level link with links under it, and one more of the links with none', () => {
		const items = [
			{ name: 'Help', link: '', items: [{ name: 'Shipping', link: '/shipping-policy', items: [] }] },
			{ name: 'About us', link: '/about-us', items: [] },
			{ name: 'Blog', link: '/blog', items: [] },
			{ name: 'Empty heading', link: '', items: [] }
		]
		expect(footerColumns(items)).toEqual([
			{ name: 'Help', items: [{ name: 'Shipping', link: '/shipping-policy' }] },
			{ name: '', items: [{ name: 'About us', link: '/about-us' }, { name: 'Blog', link: '/blog' }] }
		])
		expect(footerColumns([])).toEqual([])
		expect(footerColumns([{ name: 'Heading only', items: [] }])).toEqual([])
		expect(footerColumns(undefined)).toEqual([])
	})
})

describe('which columns the footer shows', () => {
	it("prefers the store's footer menu, once it has links, over the theme's built-in columns", () => {
		const menu = [{ name: 'Help', items: [{ name: 'Shipping', link: '/shipping-policy' }] }]
		const theme = [{ name: 'Shop', items: [{ name: 'Products', link: '/products' }] }]
		expect(shownFooterColumns(menu, theme)).toBe(menu)
		expect(shownFooterColumns([], theme)).toBe(theme)
	})
})

describe('the menus a header and footer name', () => {
	const store = {
		name: 'Shop',
		menu: [
			{ menuId: 'header', name: 'Header', items: [{ name: 'Old', link: '/old', items: [] }] },
			{ menuId: 'footer', name: 'Footer', items: [] },
			{ menuId: 'other', name: 'Other', items: [] }
		]
	}

	it('stand in for the store’s header and footer menus, under the ids every part of the page reads', () => {
		const header = { preview: true, settings: {}, menu: { menuId: 'main', name: 'Main', items: [{ name: 'New', link: '/new', items: [] }] } }
		const out = withChromeMenus(store, { header, footer: null })
		expect(out.menu.map((m: { menuId: string }) => m.menuId)).toEqual(['header', 'footer', 'other'])
		expect(out.menu[0].items[0].name).toBe('New')
		expect(store.menu[0].items[0].name).toBe('Old')
	})

	it('leave the store as it is with nothing to put in', () => {
		expect(withChromeMenus(store, { header: null, footer: null })).toBe(store)
		expect(withChromeMenus(null, { header: null, footer: null })).toBeNull()
	})
})

describe('reading the header and footer', () => {
	beforeEach(() => forgetChrome())

	it('reads both through the connector, and keeps a published pair for half a minute per host', async () => {
		const getHeader = vi.fn(async () => ({ preview: false, revision: 1, settings: { show_announcement: false }, menu: null }))
		const getFooter = vi.fn(async () => null)
		const services = { layoutService: { getHeader, getFooter } }
		const first = await fetchChrome(services, 'shop.example', null, 1_000)
		expect(first.header?.revision).toBe(1)
		expect(first.footer).toBeNull()
		await fetchChrome(services, 'shop.example', null, 20_000)
		expect(getHeader).toHaveBeenCalledTimes(1)
		await fetchChrome(services, 'shop.example', null, 40_000)
		expect(getHeader).toHaveBeenCalledTimes(2)
	})

	it('asks for the draft of the part being previewed, and never keeps it', async () => {
		const getHeader = vi.fn(async (args?: { preview?: string }) => ({ preview: !!args?.preview, settings: {}, menu: null }))
		const getFooter = vi.fn(async () => null)
		const services = { layoutService: { getHeader, getFooter } }
		const out = await fetchChrome(services, 'shop.example', { page: 'header', key: 'k3y', editor: null }, 1_000)
		expect(getHeader).toHaveBeenLastCalledWith({ preview: 'k3y' })
		expect(getFooter).toHaveBeenLastCalledWith({})
		expect(out.header?.preview).toBe(true)
		await fetchChrome(services, 'shop.example', null, 2_000)
		expect(getHeader).toHaveBeenLastCalledWith({})
	})

	it('is nothing on an older connector, another backend, or a failure: the storefront keeps its own', async () => {
		expect(await fetchChrome({}, 'a', null)).toEqual({ header: null, footer: null })
		const broken = {
			layoutService: {
				getHeader: async () => {
					throw new Error('down')
				},
				getFooter: async () => null
			}
		}
		expect(await fetchChrome(broken, 'b', null)).toEqual({ header: null, footer: null })
	})
})

describe('a preview of the header or footer', () => {
	it('names the part, its key and the editor from the address; nothing else turns it on', () => {
		const url = new URL('https://shop.example/?preview=k3y&editor=https%3A%2F%2Fadmin.example&preview_page=footer')
		expect(chromePreview(url)).toEqual({ page: 'footer', key: 'k3y', editor: 'https://admin.example' })
		expect(chromePreview(new URL('https://shop.example/?preview=k3y'))).toBeNull()
		expect(chromePreview(new URL('https://shop.example/?preview=k3y&preview_page=home'))).toBeNull()
		expect(chromePreview(new URL('https://shop.example/?preview_page=header'))).toBeNull()
	})

	it('takes the settings of the part from a posted draft, and nothing from a malformed one', () => {
		const doc = { sections: [{ id: 'footer', type: 'footer', settings: { copyright: '© Draft' } }] }
		expect(draftChromeSettings(doc, 'footer')).toEqual({ copyright: '© Draft' })
		expect(draftChromeSettings(doc, 'header')).toBeNull()
		expect(draftChromeSettings({ sections: [{ id: 'f', type: 'footer', settings: 'nope' }] } as never, 'footer')).toEqual({})
		expect(draftChromeSettings(null, 'footer')).toBeNull()
	})
})

describe("the footer's newsletter sign-up", () => {
	it('is offered where the connector answers the sign-up itself', async () => {
		const { canSubscribeToNewsletter } = await import('$lib/components/common/store-capabilities')
		expect(canSubscribeToNewsletter({ newsletterService: { subscribe: async () => ({}) } })).toBe(true)
	})
})
