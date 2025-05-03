import { writable } from 'svelte/store'

export function createTabs({ value, defaultValue }) {
	const selectedTab = writable(value || defaultValue)

	function root(node) {
		return {
			destroy() {}
		}
	}

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

	function list(node) {
		return {
			destroy() {}
		}
	}

	function trigger(node, tabValue) {
		function handleClick() {
			selectedTab.set(tabValue)
		}

		node.addEventListener('click', handleClick)

		const unsubscribe = selectedTab.subscribe((currentValue) => {
			node.setAttribute('data-state', currentValue === tabValue ? 'active' : '')
			node.setAttribute('aria-selected', currentValue === tabValue)
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
