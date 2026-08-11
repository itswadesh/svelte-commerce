<script lang="ts">
	import type { WithElementRef } from 'bits-ui'
	import type { HTMLAttributes } from 'svelte/elements'
	import { showAuthModal, type AuthType } from '@misiki/kitcommerce-core/components'

	/**
	 * Keyboard-reachable replacement for the vendored `AuthButton`
	 * (@misiki/kitcommerce-core/dist/components/auth/auth-button.svelte), which renders a
	 * `<div role="button">` with no `tabindex` and no key handler — so Tab skips it and
	 * Enter/Space never fire, i.e. login / signup / password reset are unreachable without a
	 * mouse (WCAG 2.1.1 A, 4.1.2 A).
	 *
	 * Same prop contract as the vendored component (`type`, `extraqueries`, children, and a
	 * `restProps` spread), so call sites only need their import swapped. The wrapper stays a
	 * `<div role="button">` rather than a `<button>` because most call sites pass block-level
	 * children, which are invalid inside a button.
	 */
	type AuthButtonProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		type: AuthType
		extraqueries?: { [key: string]: string }
	}

	let { type, extraqueries, children, ...restProps }: AuthButtonProps = $props()

	function handleClick() {
		showAuthModal(type, extraqueries)
	}
</script>

<div
	role="button"
	tabindex="0"
	aria-label="Open authentication modal"
	onclick={handleClick}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			handleClick()
		}
	}}
	{...restProps}
>
	{@render children?.()}
</div>
