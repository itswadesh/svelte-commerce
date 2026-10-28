import { redirect } from '@sveltejs/kit'
import { aliasedPath } from '$lib/server/path-aliases'

export function load({ url }) {
	redirect(301, aliasedPath(url) ?? '/')
}
