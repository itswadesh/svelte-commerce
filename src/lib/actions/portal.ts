/**
 * Moves an element to the end of <body>, out of whatever clips it or caps how high it can stack:
 * an ancestor with overflow hidden, a transform, or its own z-index. `use:portal`.
 */
export function portal(node: HTMLElement) {
	document.body.appendChild(node)
	return {
		destroy() {
			node.remove()
		}
	}
}
