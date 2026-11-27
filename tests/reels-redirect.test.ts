import { describe, expect, it } from 'vitest'
import { GET as reels } from '../src/routes/(www)/reels/+server'

describe('/reels', () => {
	it('redirects permanently to the catalogue', () => {
		let thrown: { status?: number; location?: string } | undefined
		try {
			reels()
		} catch (e) {
			thrown = e as typeof thrown
		}
		expect(thrown).toMatchObject({ status: 301, location: '/products' })
	})
})
