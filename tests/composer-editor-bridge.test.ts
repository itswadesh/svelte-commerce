import { describe, it, expect } from 'vitest'
import { draftSections, editorMessage, editorOrigin, EDITOR_SOURCE, storefrontMessage } from '$lib/composer/editor-bridge'

describe('editorOrigin', () => {
	it('accepts a bare http(s) origin, with or without its trailing slash', () => {
		expect(editorOrigin('https://admin.example.com')).toBe('https://admin.example.com')
		expect(editorOrigin('https://admin.example.com/')).toBe('https://admin.example.com')
		expect(editorOrigin('http://127.0.0.1:8096')).toBe('http://127.0.0.1:8096')
	})

	it('refuses anything that is not exactly an origin', () => {
		for (const bad of [
			null,
			'',
			'admin.example.com',
			'javascript:alert(1)',
			'https://admin.example.com/dash',
			'https://u:p@admin.example.com',
			'https://a.com; script-src *',
			'*',
			'data:text/html,x'
		]) {
			expect(editorOrigin(bad as string)).toBeNull()
		}
	})
})

describe('editorMessage', () => {
	const parent = {}
	const draft = { source: EDITOR_SOURCE, type: 'draft', document: { sections: [] } }

	it('reads the panel’s message from the framing window and the expected origin', () => {
		expect(editorMessage({ origin: 'https://admin.example.com', source: parent, data: draft }, 'https://admin.example.com', parent)).toEqual({
			type: 'draft',
			document: { sections: [] }
		})
		expect(
			editorMessage(
				{ origin: 'https://admin.example.com', source: parent, data: { source: EDITOR_SOURCE, type: 'select', id: 'hero' } },
				'https://admin.example.com',
				parent
			)
		).toEqual({ type: 'select', id: 'hero' })
	})

	it('ignores another origin, another window, no editor at all, and anything not shaped like the panel’s', () => {
		expect(editorMessage({ origin: 'https://evil.example', source: parent, data: draft }, 'https://admin.example.com', parent)).toBeNull()
		expect(editorMessage({ origin: 'https://admin.example.com', source: {}, data: draft }, 'https://admin.example.com', parent)).toBeNull()
		expect(editorMessage({ origin: 'https://admin.example.com', source: parent, data: draft }, null, parent)).toBeNull()
		expect(editorMessage({ origin: 'https://admin.example.com', source: null, data: draft }, 'https://admin.example.com', null)).toBeNull()
		expect(
			editorMessage(
				{ origin: 'https://admin.example.com', source: parent, data: { type: 'draft', document: { sections: [] } } },
				'https://admin.example.com',
				parent
			)
		).toBeNull()
		expect(
			editorMessage(
				{ origin: 'https://admin.example.com', source: parent, data: { source: EDITOR_SOURCE, type: 'draft', document: {} } },
				'https://admin.example.com',
				parent
			)
		).toBeNull()
		expect(editorMessage({ origin: 'https://admin.example.com', source: parent, data: 'draft' }, 'https://admin.example.com', parent)).toBeNull()
	})
})

describe('draftSections', () => {
	it('draws the shown sections in the draft’s order, and keeps each grid’s resolved products by id', () => {
		const resolved = [{ id: 'grid', type: 'product-grid', settings: {}, products: [{ id: 1 }] }]
		const got = draftSections(
			{
				sections: [
					{ id: 'hero', type: 'hero', enabled: true, settings: { heading: 'New words' } },
					{ id: 'hidden', type: 'rich-text', enabled: false, settings: { body: 'x' } },
					{ id: 'grid', type: 'product-grid', enabled: true, settings: { heading: 'Picks' } },
					{ id: 'fresh-grid', type: 'product-grid', enabled: true, settings: {} }
				]
			},
			resolved
		)
		expect(got.map((s) => s.id)).toEqual(['hero', 'grid', 'fresh-grid'])
		expect(got[0].settings).toEqual({ heading: 'New words' })
		expect(got[1].products).toEqual([{ id: 1 }])
		expect(got[2].products).toEqual([])
	})

	it('drops malformed sections and replaces malformed settings, so one bad value costs one section', () => {
		const got = draftSections(
			{ sections: [null as never, { id: 'a', type: 'hero', settings: ['x'] as never }, { id: 3 as never, type: 'hero' }] },
			[]
		)
		expect(got).toEqual([{ id: 'a', type: 'hero', settings: {} }])
	})
})

describe('storefrontMessage', () => {
	it('names itself so the panel can tell it from other scripts', () => {
		expect(storefrontMessage('ready')).toEqual({ source: 'gocommerce-storefront', type: 'ready' })
		expect(storefrontMessage('select', 'hero')).toEqual({ source: 'gocommerce-storefront', type: 'select', id: 'hero' })
	})
})
