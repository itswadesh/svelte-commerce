/**
 * A picture's width and height as a CSS aspect ratio ("1600 / 842"), read from the first bytes of
 * the file: the header of a JPEG, PNG or WebP names its size, so the rest is never downloaded.
 * Empty when the picture cannot be read in time or is another kind; the caller keeps its own shape.
 */
export async function imageShape(url: string | null | undefined, fetcher: typeof fetch = fetch): Promise<string> {
	if (!url) return ''
	try {
		const res = await fetcher(url, { signal: AbortSignal.timeout(1500) })
		const reader = res.ok ? res.body?.getReader() : undefined
		if (!reader) return ''
		let bytes = new Uint8Array(0)
		try {
			while (bytes.length < 65536) {
				const { done, value } = await reader.read()
				if (done) break
				const next = new Uint8Array(bytes.length + value.length)
				next.set(bytes)
				next.set(value, bytes.length)
				bytes = next
				const size = headerSize(bytes)
				if (size) return `${size[0]} / ${size[1]}`
			}
		} finally {
			reader.cancel().catch(() => {})
		}
	} catch {
		// A slow or missing picture keeps the fixed shape.
	}
	return ''
}

/** Width and height from a file's header, or null until enough of it has arrived. */
export function headerSize(b: Uint8Array): [number, number] | null {
	const u16 = (i: number) => (b[i] << 8) | b[i + 1]
	const u32 = (i: number) => ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0
	const le24 = (i: number) => b[i] | (b[i + 1] << 8) | (b[i + 2] << 16)
	const ok = (w: number, h: number): [number, number] | null => (w > 0 && h > 0 ? [w, h] : null)

	// PNG: the IHDR chunk comes first.
	if (b.length >= 24 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return ok(u32(16), u32(20))

	// WebP: RIFF....WEBP, then a VP8, VP8L or VP8X chunk.
	if (b.length >= 30 && u32(0) === 0x52494646 && u32(8) === 0x57454250) {
		const kind = String.fromCharCode(b[12], b[13], b[14], b[15])
		if (kind === 'VP8 ') return ok(((b[27] << 8) | b[26]) & 0x3fff, ((b[29] << 8) | b[28]) & 0x3fff)
		if (kind === 'VP8L') {
			const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24)
			return ok((bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1)
		}
		if (kind === 'VP8X') return ok(le24(24) + 1, le24(27) + 1)
		return null
	}

	// JPEG: walk the segments to the frame header (SOF0–SOF15, not DHT, JPG or DAC).
	if (b.length >= 4 && b[0] === 0xff && b[1] === 0xd8) {
		let i = 2
		while (i + 9 < b.length) {
			if (b[i] !== 0xff) return null
			const marker = b[i + 1]
			if (marker === 0xff) {
				i++
				continue
			}
			if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) return ok(u16(i + 7), u16(i + 5))
			i += 2 + u16(i + 2)
		}
	}
	return null
}

/** A shape this module wrote, or empty for anything else, so a setting cannot carry other CSS. */
export function safeShape(value: unknown): string {
	return typeof value === 'string' && /^\d{1,5} \/ \d{1,5}$/.test(value) ? value : ''
}
