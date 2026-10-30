import { describe, expect, it } from 'vitest'
import { gunzipSync } from 'node:zlib'
import { compressResponse } from '$lib/server/compress'

const page = '<!doctype html><p>' + 'hello '.repeat(500) + '</p>'
const gzipRequest = new Request('https://shop.test/', { headers: { 'accept-encoding': 'gzip, br' } })
const html = () => new Response(page, { headers: { 'content-type': 'text/html', 'content-length': '3018', etag: '"abc"' } })

describe('compressResponse', () => {
	it('gzips a page for a client that accepts gzip', async () => {
		const out = compressResponse(gzipRequest, html())
		expect(out.headers.get('content-encoding')).toBe('gzip')
		expect(out.headers.get('content-length')).toBeNull()
		expect(out.headers.get('etag')).toBe('W/"abc"')
		expect(gunzipSync(Buffer.from(await out.arrayBuffer())).toString()).toBe(page)
	})

	it('leaves pictures, encoded answers and clients without gzip alone', () => {
		const img = new Response('x', { headers: { 'content-type': 'image/jpeg' } })
		const encoded = new Response('x', { headers: { 'content-type': 'text/html', 'content-encoding': 'br' } })
		const plain = html()
		expect(compressResponse(gzipRequest, img)).toBe(img)
		expect(compressResponse(gzipRequest, encoded)).toBe(encoded)
		expect(compressResponse(new Request('https://shop.test/'), plain)).toBe(plain)
	})
})
