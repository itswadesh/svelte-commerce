/**
 * Modal a11y for the hand-rolled overlays (modal.svelte, the cart drawer, the nav aside, the
 * search overlay, the PDP lightbox, the review form) — the ones that are plain <section>/<div>
 * instead of a bits-ui Dialog, so they get none of this for free.
 *
 * Apply to the overlay element together with `role="dialog" aria-modal="true"
 * aria-labelledby=… tabindex="-1"`:
 *
 *   <section role="dialog" aria-modal="true" tabindex="-1" use:dialog={close}>
 *
 * Mount = move focus in. Escape / Tab = close / wrap. Unmount = focus back to whatever opened it.
 * Only mounts when the overlay is actually in the DOM, so gate it on `{#if open}`.
 */
export function dialog(node: HTMLElement, close?: () => void) {
	const FOCUSABLE =
		'a[href],area[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

	const opener = document.activeElement as HTMLElement | null
	let onclose = close

	const focusable = () => Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE))

	// The overlay itself is the fallback target, hence the required tabindex="-1".
	;(focusable()[0] ?? node).focus()

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.stopPropagation()
			onclose?.()
			return
		}
		if (e.key !== 'Tab') return

		const items = focusable()
		if (!items.length) {
			e.preventDefault()
			node.focus()
			return
		}
		const first = items[0]
		const last = items[items.length - 1]
		const active = document.activeElement

		if (e.shiftKey && (active === first || active === node)) {
			e.preventDefault()
			last.focus()
		} else if (!e.shiftKey && active === last) {
			e.preventDefault()
			first.focus()
		}
	}

	node.addEventListener('keydown', onkeydown)

	return {
		update(next?: () => void) {
			onclose = next
		},
		destroy() {
			node.removeEventListener('keydown', onkeydown)
			// isConnected: don't yank focus to a trigger that a navigation already removed.
			if (opener?.isConnected) opener.focus()
		}
	}
}
