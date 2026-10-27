/**
 * The header's and footer's draft while the theme editor frames the storefront (D131): the
 * settings the panel last posted, and the menus they name, read as they are chosen. Empty on every
 * shopper's page — only ChromeEditorBridge writes here, and only for a preview the engine accepted
 * — so the header and footer draw what is published, or the storefront's own.
 */
import type { ChromeMenu, ChromeMenuItem, ChromePart } from './site-chrome.js'

export const chromeDraft = $state<{
	header: Record<string, unknown> | null
	footer: Record<string, unknown> | null
	/** Menus a draft named, by handle; null for one that could not be read. */
	menus: Record<string, ChromeMenu | null>
}>({ header: null, footer: null, menus: {} })

/** The draft's settings for part, else the published ones from the root layout, else null. */
export function chromeSettings(part: ChromePart, pageData: unknown): Record<string, unknown> | null {
	const draft = chromeDraft[part]
	if (draft) return draft
	const chrome = (pageData as { chrome?: Record<ChromePart, { settings?: Record<string, unknown> } | null> } | null)?.chrome
	return chrome?.[part]?.settings ?? null
}

/**
 * The links of the store's header or footer menu: the one the draft names, once it has been read,
 * else the store's own under that id — which the connector already makes the published choice.
 */
export function chromeMenuItems(part: ChromePart, menus: ChromeMenu[] | null | undefined): ChromeMenuItem[] {
	return draftMenuItems(part) ?? (menus ?? []).find((m) => m?.menuId === part)?.items ?? []
}

/** The links of the menu the draft names, once read; undefined while there is none to show. */
export function draftMenuItems(part: ChromePart): ChromeMenuItem[] | undefined {
	const handle = chromeDraft[part]?.menu
	if (typeof handle !== 'string') return undefined
	const menu = chromeDraft.menus[handle]
	return menu ? (menu.items ?? []) : undefined
}
