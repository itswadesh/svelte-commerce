// Third-party widgets (Klaviyo, support chat) are not needed to render a page, and their scripts
// compete with first paint for the main thread. They load on the visitor's first interaction.

const EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const

/** Runs `fn` once, on the first pointer, key, touch or scroll. Returns a cleanup that cancels it. */
export function onFirstInteraction(fn: () => void): () => void {
	let done = false
	const cleanup = () => EVENTS.forEach((type) => window.removeEventListener(type, run))
	function run() {
		if (done) return
		done = true
		cleanup()
		fn()
	}
	EVENTS.forEach((type) => window.addEventListener(type, run, { passive: true }))
	return cleanup
}
