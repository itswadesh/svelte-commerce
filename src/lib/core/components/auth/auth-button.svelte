<script lang="ts">
	import type { WithElementRef } from 'bits-ui'
	import type { HTMLAttributes } from 'svelte/elements'
	import { showAuthModal, type AuthType } from './auth-utils'

	type AuthButtonProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		type: AuthType
		extraqueries?: { [key: string]: string }
	}

	let { type, extraqueries, children, ...restProps }: AuthButtonProps = $props()

	function handleClick() {
		showAuthModal(type, extraqueries)
	}
</script>

<div role="button" aria-label="Open authentication modal" onclick={handleClick} {...restProps}>
	{@render children?.()}
</div>
