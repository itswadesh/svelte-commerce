import { untrack } from 'svelte'
import { getUserState } from '$lib/core/stores/index.js'
import { clearPendingWishlistAction } from '$lib/core/logic/index.js'

/**
 * A heart tapped while signed out is saved once sign-in finishes (core WishlistState). Closing the
 * sign-in dialog without signing in abandons it, so a later sign-in does not add it unasked. Every
 * success path sets the user before it closes the dialog, so a dialog that closes with nobody
 * signed in is an abandoned one. A reload mounts the dialog afresh, so it does not count as closing.
 * Call during component init with a getter for the dialog's open state.
 */
export function forgetAbandonedWishlistTap(isOpen: () => boolean) {
	const userState = getUserState()
	let wasOpen = false
	$effect(() => {
		if (isOpen()) wasOpen = true
		else if (wasOpen) {
			wasOpen = false
			if (!untrack(() => userState?.user?.userId)) clearPendingWishlistAction()
		}
	})
}
