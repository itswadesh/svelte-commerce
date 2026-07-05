/**
 * Scroll-reveal action for the Maison Émeraude theme.
 *
 * Add `data-reveal` (optionally with a `.d1`–`.d4` stagger class) to any element
 * and attach `use:reveal`. The element fades/translates in once it scrolls into
 * view — mirroring the IntersectionObserver behaviour from the static template's
 * `main.js`, but scoped per-element so it works with SSR + client hydration.
 *
 * Usage:
 *   <div data-reveal use:reveal>…</div>
 *   <div data-reveal class="d2" use:reveal>…</div>
 */

// A single shared observer keeps things cheap when many elements use the action.
let observer: IntersectionObserver | undefined

function ensureObserver() {
	if (observer || typeof window === 'undefined') return
	observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add('in')
					observer?.unobserve(entry.target)
				}
			}
		},
		{ threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
	)
}

export function reveal(node: HTMLElement) {
	// Respect reduced-motion / no-JS: element is visible immediately if we bail.
	if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
		node.classList.add('in')
		return {}
	}

	ensureObserver()
	// Ensure the base marker class exists so the CSS transition applies.
	if (!node.hasAttribute('data-reveal')) node.setAttribute('data-reveal', '')
	observer?.observe(node)

	return {
		destroy() {
			observer?.unobserve(node)
		}
	}
}

export default reveal
