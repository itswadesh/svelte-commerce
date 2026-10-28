// Pages, API proxy answers and feeds compress well; pictures and fonts are compressed already.
const COMPRESSIBLE = /^(text\/|application\/(json|javascript|xml|rss\+xml|manifest\+json)|image\/svg\+xml)/

/**
 * Gzips a response for a client that accepts it. The node adapter compresses only its prebuilt
 * static files, so a server-rendered page left uncompressed unless a proxy in front did it. That
 * is a 363 KB page instead of about 50 KB on a phone. An answer already carrying an encoding is
 * left alone, so a proxy that compresses too never encodes twice.
 */
export function compressResponse(request: Request, response: Response): Response {
	if (!response.body || request.method === 'HEAD' || response.headers.has('content-encoding')) return response
	if (!COMPRESSIBLE.test(response.headers.get('content-type') ?? '')) return response
	if (!/\bgzip\b/.test(request.headers.get('accept-encoding') ?? '')) return response

	const headers = new Headers(response.headers)
	headers.set('content-encoding', 'gzip')
	headers.delete('content-length')
	headers.append('vary', 'Accept-Encoding')
	const etag = headers.get('etag')
	if (etag && !etag.startsWith('W/')) headers.set('etag', `W/${etag}`)

	return new Response(response.body.pipeThrough(new CompressionStream('gzip')), {
		status: response.status,
		statusText: response.statusText,
		headers
	})
}
