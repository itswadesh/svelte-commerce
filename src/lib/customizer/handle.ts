// What the product page needs from the customizer before anyone opens it. Kept apart from
// editor.svelte so that the editor itself (canvas, tools, fonts) loads only on a product that can be
// designed, rather than in every product page's code (P1-11).
import { pushState, replaceState } from '$app/navigation'
import { page } from '$app/state'

// A frame, such as the theme editor's preview, shares its history with the page around it, and a
// step back there can undo that page's own step: in a frame the editor neither adds nor leaves an entry.
export const framed = () => window.parent !== window

export function openEditor() {
	if (framed() || page.state.customizerOpen) replaceState('', { customizerOpen: true })
	else pushState('', { customizerOpen: true })
}

export type EditorHandle = { readonly hasSetup: boolean; reloadSetup: () => Promise<void> }
export const EDITOR = Symbol('editor')
