import { FONTS, googleFamily } from '$lib/composer/theme-tokens'
import { printPixels, type CustomizerSetup, type DesignDocument, type TextLayer } from './document'
import { FONT_WEIGHT, fontOf } from './draw'

export type Upload = { uploadId: string; url: string; width: number; height: number }

type CustomizerService = {
	setup?: (productId: string) => Promise<CustomizerSetup | null>
	upload?: (file: Blob, filename?: string) => Promise<Upload>
	saveDesign?: (design: {
		productId: string
		variantId: string
		previewUploadId: string
		printUploadId: string
		document: DesignDocument
	}) => Promise<{ designId: string; previewUrl: string }>
}

const customizer = (services: object) => Reflect.get(services, 'customizerService') as CustomizerService | undefined

export async function loadSetup(services: object, productId: string | number | undefined): Promise<CustomizerSetup | null> {
	const svc = customizer(services)
	if (!productId || !svc?.setup || !svc.upload || !svc.saveDesign) return null
	try {
		return (await svc.setup(String(productId))) ?? null
	} catch {
		return null
	}
}

async function service(): Promise<Required<CustomizerService>> {
	const { services } = await import('kitcommerce.config')
	return customizer(services as object) as Required<CustomizerService>
}

export async function upload(file: Blob, filename?: string): Promise<Upload> {
	return (await service()).upload(file, filename)
}

export async function saveDesign(design: Parameters<Required<CustomizerService>['saveDesign']>[0]) {
	return (await service()).saveDesign(design)
}

export class ShopperError extends Error {}

export function shopperMessage(err: unknown, fallback: string, tooLarge = fallback): string {
	if (err instanceof ShopperError) return err.message
	const status = (err as { status?: unknown } | null)?.status
	if (status === 413) return tooLarge
	if (status === 429) return 'Too many tries in the last hour. Please wait a while and try again.'
	return fallback
}

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024
const MAX_PHOTO_PIXELS = 12_000_000
const UNREADABLE = 'This photo cannot be opened here. Choose a JPEG or PNG photo.'

export const photoCap = (setup: CustomizerSetup) => {
	const px = printPixels(setup.printSize)
	return 2 * Math.max(px.width, px.height)
}

/**
 * The engine takes only JPEG and PNG, and refuses some it could read but that cost too much to
 * (16-bit PNGs, progressive CMYK JPEGs); what a canvas writes it always takes.
 */
export async function preparePhoto(file: File, cap: number): Promise<{ blob: Blob; picture: ImageBitmap }> {
	const img = new Image()
	img.src = URL.createObjectURL(file)
	try {
		await new Promise((resolve, reject) => {
			img.onload = resolve
			img.onerror = () => reject(new ShopperError(UNREADABLE))
		})
		if (!img.naturalWidth || !img.naturalHeight) throw new ShopperError(UNREADABLE)
		const scale = Math.min(
			1,
			cap / Math.max(img.naturalWidth, img.naturalHeight),
			Math.sqrt(MAX_PHOTO_PIXELS / (img.naturalWidth * img.naturalHeight))
		)
		const canvas = Object.assign(document.createElement('canvas'), {
			width: Math.round(img.naturalWidth * scale),
			height: Math.round(img.naturalHeight * scale)
		})
		const ctx = canvas.getContext('2d', { willReadFrequently: true })
		if (!ctx) throw new ShopperError(UNREADABLE)
		ctx.imageSmoothingQuality = 'high'
		// Drawn smaller straight from the image element, Chrome decodes a large JPEG at a reduced
		// scale; an ImageBitmap of the file would first hold the whole original.
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
		const type = file.type !== 'image/jpeg' && hasTransparency(ctx, canvas.width, canvas.height) ? 'image/png' : 'image/jpeg'
		const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.9))
		const picture = await createImageBitmap(canvas)
		canvas.width = canvas.height = 0
		if (!blob) {
			picture.close()
			throw new ShopperError(UNREADABLE)
		}
		return { blob, picture }
	} finally {
		URL.revokeObjectURL(img.src)
	}
}

function hasTransparency(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
	const data = ctx.getImageData(0, 0, width, height).data
	for (let i = 3; i < data.length; i += 4) if (data[i] < 255) return true
	return false
}

const loadedFonts = new Set<string>()

/** A canvas draws words in a fallback face until the font has arrived, and would print them so. */
export async function loadFonts(setup: CustomizerSetup): Promise<void> {
	const google = setup.fonts
		.filter((f) => Object.hasOwn(FONTS, f.key))
		.map((f) => googleFamily(FONTS[f.key]))
		.filter((g) => !loadedFonts.has(g))
	if (google.length) {
		const link = document.createElement('link')
		link.rel = 'stylesheet'
		link.href = 'https://fonts.googleapis.com/css2?' + google.map((g) => 'family=' + g).join('&') + '&display=swap'
		await new Promise((resolve) => {
			link.onload = link.onerror = resolve
			document.head.appendChild(link)
		})
		google.forEach((g) => loadedFonts.add(g))
	}
	await Promise.all(setup.fonts.map((f) => document.fonts.load(`${FONT_WEIGHT} 32px "${f.family}"`).catch(() => [])))
}

/** A face's Devanagari and latin-ext subsets, which hold ₹, load only for words that use them. */
export async function loadGlyphs(setup: CustomizerSetup, words: Pick<TextLayer, 'text' | 'font' | 'font_size'>[]): Promise<void> {
	await Promise.all(words.map((w) => document.fonts.load(fontOf(w, setup), w.text).catch(() => [])))
}
