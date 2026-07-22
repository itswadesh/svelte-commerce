import { writable } from 'svelte/store'

/**
 * @typedef {Object} CreateTabsProps
 * @property {string} [value] The initially selected tab value.
 * @property {string} [defaultValue] Fallback value used when `value` is not provided.
 */

/**
 * @typedef {Object} TabsActionResult
 * @property {() => void} destroy
 */

/**
 * @param {CreateTabsProps} props
 */
export function createTabs({ value, defaultValue }) {
	/** @type {import('svelte/store').Writable<string | undefined>} */
	const selectedTab = writable(value || defaultValue)

	/**
	 * @param {HTMLElement} node
	 * @returns {TabsActionResult}
	 */
	function root(node) {
		return {
			destroy() {}
		}
	}

	/**
	 * @param {HTMLElement} node
	 * @param {string} tabValue
	 * @returns {TabsActionResult}
	 */
	function content(node, tabValue) {
		const unsubscribe = selectedTab.subscribe((currentValue) => {
			node.style.display = currentValue === tabValue ? 'block' : 'none'
		})

		return {
			destroy() {
				unsubscribe()
			}
		}
	}

	/**
	 * @param {HTMLElement} node
	 * @returns {TabsActionResult}
	 */
	function list(node) {
		return {
			destroy() {}
		}
	}

	/**
	 * @param {HTMLElement} node
	 * @param {string} tabValue
	 * @returns {TabsActionResult}
	 */
	function trigger(node, tabValue) {
		function handleClick() {
			selectedTab.set(tabValue)
		}

		node.addEventListener('click', handleClick)

		const unsubscribe = selectedTab.subscribe((currentValue) => {
			node.setAttribute('data-state', currentValue === tabValue ? 'active' : '')
			node.setAttribute('aria-selected', String(currentValue === tabValue))
		})

		return {
			destroy() {
				node.removeEventListener('click', handleClick)
				unsubscribe()
			}
		}
	}

	return { root, content, list, trigger }
}
