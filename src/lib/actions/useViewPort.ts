let intersectionObserver: any

function ensureIntersectionObserver() {
	if (intersectionObserver) return

	intersectionObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			const eventName = entry.isIntersecting ? 'enterViewport' : 'exitViewport'
			entry.target.dispatchEvent(new CustomEvent(eventName))
		})
	})
}

export default function viewport(element: any) {
	ensureIntersectionObserver()

	intersectionObserver.observe(element)

	return {
		destroy() {
			intersectionObserver.unobserve(element)
		}
	}
}
