import {
	LINE_HEIGHT,
	printPixels,
	printCoverScale,
	type CustomizerSetup,
	type DesignDocument,
	type Layer,
	type ShapeKind,
	type TextLayer
} from './document'

/** Every font a setup offers has this weight; words are loaded and drawn at it. */
export const FONT_WEIGHT = 400

export type Pictures = {
	mockup: CanvasImageSource
	overlay: CanvasImageSource | null
	photos: Map<string, ImageBitmap>
	stickers: Map<number, CanvasImageSource>
}

export type View = { kind: 'mockup'; scale: number } | { kind: 'print' }

/** iOS draws a canvas of more than about 16.7 megapixels blank. */
const MAX_CANVAS_PIXELS = 16_000_000

export const backingScale = (width: number, height: number, dpr: number) => Math.min(dpr, Math.sqrt(MAX_CANVAS_PIXELS / (width * height)))

const MAX_PREVIEW_SIDE = 2000

export const previewView = (setup: CustomizerSetup): View => ({
	kind: 'mockup',
	scale: Math.min(1, MAX_PREVIEW_SIDE / Math.max(setup.mockup.width, setup.mockup.height))
})

function canvasSize(setup: CustomizerSetup, view: View): { width: number; height: number } {
	if (view.kind === 'print') return printPixels(setup.printSize)
	return { width: Math.round(setup.mockup.width * view.scale), height: Math.round(setup.mockup.height * view.scale) }
}

export function drawDesign(ctx: CanvasRenderingContext2D, doc: DesignDocument, setup: CustomizerSetup, pictures: Pictures, view: View) {
	const area = setup.printArea
	const { width, height } = canvasSize(setup, view)
	ctx.save()
	ctx.setTransform(1, 0, 0, 1, 0, 0)
	ctx.clearRect(0, 0, width, height)
	if (view.kind === 'mockup') {
		ctx.setTransform(view.scale, 0, 0, view.scale, 0, 0)
		ctx.drawImage(pictures.mockup, 0, 0, setup.mockup.width, setup.mockup.height)
		ctx.translate(area.x, area.y)
	} else {
		const s = printCoverScale(area, setup.printSize)
		ctx.setTransform(s, 0, 0, s, (width - area.width * s) / 2, (height - area.height * s) / 2)
	}

	ctx.save()
	roundedRect(ctx, area.width, area.height, area.radius)
	ctx.clip()
	if (doc.background) {
		ctx.fillStyle = doc.background
		ctx.fillRect(0, 0, area.width, area.height)
	}
	for (const layer of doc.layers) drawLayer(ctx, layer, setup, pictures)
	ctx.restore()

	if (view.kind === 'mockup' && pictures.overlay) {
		ctx.setTransform(view.scale, 0, 0, view.scale, 0, 0)
		ctx.drawImage(pictures.overlay, 0, 0, setup.mockup.width, setup.mockup.height)
	}
	ctx.restore()
}

function drawLayer(ctx: CanvasRenderingContext2D, layer: Layer, setup: CustomizerSetup, pictures: Pictures) {
	const { width: w, height: h } = layer
	ctx.save()
	ctx.globalAlpha = layer.opacity
	ctx.translate(layer.x + w / 2, layer.y + h / 2)
	ctx.rotate((layer.rotation * Math.PI) / 180)
	switch (layer.type) {
		case 'image': {
			const photo = pictures.photos.get(layer.upload_id)
			if (photo) ctx.drawImage(photo, -w / 2, -h / 2, w, h)
			break
		}
		case 'sticker': {
			const sticker = pictures.stickers.get(layer.sticker_media_id)
			if (sticker) ctx.drawImage(sticker, -w / 2, -h / 2, w, h)
			break
		}
		case 'shape':
			ctx.fillStyle = layer.color
			shapePath(ctx, layer.shape, w, h)
			ctx.fill()
			break
		case 'text': {
			ctx.fillStyle = layer.color
			ctx.font = fontOf(layer, setup)
			ctx.textAlign = layer.align
			ctx.textBaseline = 'middle'
			const lines = layer.text.split('\n')
			const step = layer.font_size * LINE_HEIGHT
			const x = layer.align === 'left' ? -w / 2 : layer.align === 'right' ? w / 2 : 0
			lines.forEach((line, i) => ctx.fillText(line, x, (i - (lines.length - 1) / 2) * step))
			break
		}
	}
	ctx.restore()
}

export function fontOf(layer: Pick<TextLayer, 'font' | 'font_size'>, setup: CustomizerSetup): string {
	const family = setup.fonts.find((f) => f.key === layer.font)?.family ?? 'sans-serif'
	return `${FONT_WEIGHT} ${layer.font_size}px "${family}"`
}

export function textBox(ctx: CanvasRenderingContext2D, layer: Pick<TextLayer, 'text' | 'font' | 'font_size'>, setup: CustomizerSetup) {
	ctx.save()
	ctx.font = fontOf(layer, setup)
	const lines = layer.text.split('\n')
	const widest = Math.max(...lines.map((l) => ctx.measureText(l).width))
	ctx.restore()
	return { width: Math.max(widest, layer.font_size * 0.5) + layer.font_size * 0.2, height: lines.length * layer.font_size * LINE_HEIGHT }
}

function roundedRect(ctx: CanvasRenderingContext2D, w: number, h: number, radius: number) {
	const r = Math.min(radius, w / 2, h / 2)
	ctx.beginPath()
	ctx.moveTo(r, 0)
	ctx.arcTo(w, 0, w, h, r)
	ctx.arcTo(w, h, 0, h, r)
	ctx.arcTo(0, h, 0, 0, r)
	ctx.arcTo(0, 0, w, 0, r)
	ctx.closePath()
}

function shapePath(ctx: CanvasRenderingContext2D, shape: ShapeKind, w: number, h: number) {
	const at = (u: number, v: number): [number, number] => [-w / 2 + u * w, -h / 2 + v * h]
	ctx.beginPath()
	switch (shape) {
		case 'rect':
			ctx.rect(-w / 2, -h / 2, w, h)
			break
		case 'circle':
			ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2)
			break
		case 'heart':
			ctx.moveTo(...at(0.5, 0.25))
			ctx.bezierCurveTo(...at(0.5, 0), ...at(0, 0), ...at(0, 0.3))
			ctx.bezierCurveTo(...at(0, 0.6), ...at(0.5, 0.8), ...at(0.5, 1))
			ctx.bezierCurveTo(...at(0.5, 0.8), ...at(1, 0.6), ...at(1, 0.3))
			ctx.bezierCurveTo(...at(1, 0), ...at(0.5, 0), ...at(0.5, 0.25))
			break
		case 'star':
			for (let i = 0; i < 10; i++) {
				const r = i % 2 ? 0.19 : 0.5
				const a = -Math.PI / 2 + (i * Math.PI) / 5
				ctx.lineTo(...at(0.5 + r * Math.cos(a), 0.5 + r * Math.sin(a)))
			}
			break
	}
	ctx.closePath()
}

export function loadPicture(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.decoding = 'async'
		// A picture from another origin taints the canvas, so the design could not be exported.
		// Asked for with CORS, it loads only where it can be drawn and saved.
		if (new URL(url, location.href).origin !== location.origin) img.crossOrigin = 'anonymous'
		img.onload = () => resolve(img)
		img.onerror = () => reject(new Error(`Could not load ${url}`))
		img.src = url
	})
}

export async function renderPng(doc: DesignDocument, setup: CustomizerSetup, pictures: Pictures, view: View): Promise<Blob> {
	const canvas = document.createElement('canvas')
	Object.assign(canvas, canvasSize(setup, view))
	const ctx = canvas.getContext('2d')
	if (!ctx) throw new Error('Could not draw the design')
	drawDesign(ctx, doc, setup, pictures, view)
	return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not draw the design'))), 'image/png'))
}
