<script lang="ts">
	/**
	 * The storefront's half of the theme editor for the header or the footer (D131): the panel frames
	 * the home page with the part's preview key, `preview_page` and its origin, and posts the draft as
	 * it is edited; the header and footer redraw from it before the save. Mounted by the root layout
	 * only for a preview the engine accepted, and every message passes the same origin-and-window
	 * check as the page editor's (editor-bridge.ts). A menu the draft names is read here, as it is
	 * chosen, through the connector's menuService.
	 */
	import { services } from 'kitcommerce.config'
	import { editorMessage, storefrontMessage } from './editor-bridge.js'
	import { chromeDraft } from './chrome-draft.svelte.js'
	import { draftChromeSettings, type ChromeMenu, type ChromePart } from './site-chrome.js'

	let { editorOrigin, part }: { editorOrigin: string; part: ChromePart } = $props()

	type MenuHook = { getMenu?: (handle: string) => Promise<ChromeMenu> }

	function readMenu(handle: string) {
		if (handle in chromeDraft.menus) return
		chromeDraft.menus[handle] = null
		// Reflect.get for the reason the home page's load gives: another connector has no menuService.
		const menus = Reflect.get(services as object, 'menuService') as MenuHook | undefined
		menus
			?.getMenu?.(handle)
			.then((menu) => (chromeDraft.menus[handle] = menu))
			.catch(() => {
				// A menu that cannot be read keeps the store's own in its place.
			})
	}

	$effect(() => {
		if (window.parent === window) return
		const onMessage = (event: MessageEvent) => {
			const message = editorMessage(event, editorOrigin, window.parent)
			if (message?.type !== 'draft') return
			const settings = draftChromeSettings(message.document, part)
			if (!settings) return
			chromeDraft[part] = settings
			if (typeof settings.menu === 'string' && settings.menu) readMenu(settings.menu)
		}
		window.addEventListener('message', onMessage)
		window.parent.postMessage(storefrontMessage('ready'), editorOrigin)
		// The footer is at the foot of a long page: bring it into view, where the edits land.
		if (part === 'footer') {
			const still = matchMedia('(prefers-reduced-motion: reduce)').matches
			document.querySelector('footer[aria-label="Site footer"]')?.scrollIntoView({ block: 'end', behavior: still ? 'auto' : 'smooth' })
		}
		return () => {
			window.removeEventListener('message', onMessage)
			chromeDraft[part] = null
		}
	})
</script>
