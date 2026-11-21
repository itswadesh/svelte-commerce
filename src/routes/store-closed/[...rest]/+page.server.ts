import { error } from '@sveltejs/kit'
import type { LockReason } from '$lib/server/store-lock'
import type { PageServerLoad } from './$types'

export const csr = false

const REFUSED: Record<LockReason, string> = {
	wrong: "That password isn't right.",
	throttled: 'Too many tries. Wait a while and try again.',
	unavailable: "We couldn't check that password. Try again.",
	stopped: "This store isn't taking passwords right now. Reload the page in a minute."
}

export const load: PageServerLoad = ({ isSubRequest, url }) => {
	if (!isSubRequest) error(404)
	const reason = url.searchParams.get('reason') ?? ''
	return { error: Object.hasOwn(REFUSED, reason) ? REFUSED[reason as LockReason] : null }
}
