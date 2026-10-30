export const REVIEW_PARAM = 'review'

// Where sign-in sends a guest who asked to write a review: this page, with the review form to
// open. Always a same-site path; leading slashes are collapsed so `//host` cannot leave the site.
export function reviewReturnPath(url: URL): string {
	const next = new URL(url)
	for (const p of ['show_auth', 'login', 'signup', 'forgot-password', 'redirect']) next.searchParams.delete(p)
	next.searchParams.set(REVIEW_PARAM, '1')
	return '/' + next.pathname.replace(/^\/+/, '') + next.search + '#reviews'
}
