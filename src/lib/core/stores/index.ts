import { browser } from '$app/environment'
import { setWishlistState as setCoreWishlistState } from '@misiki/kitcommerce-core/stores'
import { hasSessionCookie } from '$lib/core/utils/session-cookie'

export * from '@misiki/kitcommerce-core/stores'

// Login gate for the wishlist read. The core WishlistState fetches /api/wishlists/me on mount for
// every visitor, but anonymous visitors have no session, so the backend rejects the request with a
// 422 "Invalid credentials" that shows up in the console on every guest page load. Guests carry no
// `me` cookie (the same signal the core UserState uses), so skip the read for them and keep the
// wishlist empty. Not `connect.sid` — that one is httpOnly and invisible to document.cookie, so
// gating on it skipped the read for signed-in visitors too. Anchored on a cookie boundary because
// a bare 'me=' also matches 'theme='. The cookie is re-checked on every read, so reads from
// signed-in visitors — including after a login — pass through unchanged. Writes are not gated.
export function setWishlistState(): ReturnType<typeof setCoreWishlistState> {
	const state = setCoreWishlistState()
	const fetchWishlist = state.setState
	state.setState = async () => {
		if (browser && !hasSessionCookie(document.cookie)) return
		return fetchWishlist()
	}
	return state
}
