import { readFile } from 'node:fs/promises'
import type { Plugin } from 'vite'

/**
 * @misiki/kitcommerce-core's utils/gtag.js and utils/analytics.js ask api64.ipify.org for the
 * visitor's IP address as soon as they are imported, and the core utils barrel imports them on
 * every page: every visitor's address went to a company the privacy policy does not name, on stores
 * with no analytics at all. The address only ever rode along in analytics event parameters, and a
 * tag that wants it sees it on its own request, so the lookup bought nothing. node_modules is not
 * ours to edit, so the build drops the request instead, in the bundle and in the dev server's
 * pre-bundled copy alike.
 */
const CORE = /[\\/]@misiki[\\/]kitcommerce-core[\\/]dist[\\/].*\.js$/
const LOOKUP = /fetch\(\s*(['"`])https:\/\/[a-z0-9.]*ipify\.org[^'"`]*\1\s*\)/g

/** The module without its IP lookup; throws if a lookup is left that this does not recognise. */
export function stripIpLookup(code: string): string {
	// Rejected, not removed: the caller's own `.catch(() => {})` then swallows it, and nothing is sent.
	const out = code.replace(LOOKUP, 'Promise.reject()')
	if (out.includes('ipify.org')) throw new Error('kitcommerce-core calls ipify in a way src/lib/build/no-ip-lookup.ts does not recognise')
	return out
}

const applies = (id: string, code: string) => CORE.test(id.split('?')[0]) && code.includes('ipify.org')

export const noIpLookup = (): Plugin => ({
	name: 'no-ip-lookup',
	enforce: 'pre',
	transform(code, id) {
		return applies(id, code) ? { code: stripIpLookup(code), map: null } : null
	},
	config: () => ({
		optimizeDeps: {
			esbuildOptions: {
				plugins: [
					{
						name: 'no-ip-lookup',
						setup(build) {
							build.onLoad({ filter: CORE }, async ({ path }) => {
								const code = await readFile(path, 'utf8')
								return applies(path, code) ? { contents: stripIpLookup(code), loader: 'js' } : undefined
							})
						}
					}
				]
			}
		}
	})
})
