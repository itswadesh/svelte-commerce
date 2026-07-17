import { browser } from '$app/environment'
import { setWishlistState as setCoreWishlistState } from '@misiki/kitcommerce-core/stores'

export * from '@misiki/kitcommerce-core/stores'

// Login gate for the wishlist read. The core WishlistState fetches /api/wishlists/me on mount for
// every visitor, but anonymous visitors have no session, so the backend rejects the request with a
// 422 "Invalid credentials" that shows up in the console on every guest page load. Guests carry no
// `connect.sid` session cookie (the same signal the core UserState uses), so skip the read for them
// and keep the wishlist empty. The cookie is re-checked on every read, so reads from signed-in
// visitors — including after a login — pass through unchanged. Writes (toggles) are not gated.
export function setWishlistState(): ReturnType<typeof setCoreWishlistState> {
	const state = setCoreWishlistState()
	const fetchWishlist = state.setState
	state.setState = async () => {
		if (browser && !document.cookie.includes('connect.sid=')) return
		return fetchWishlist()
	}
	return state
}
