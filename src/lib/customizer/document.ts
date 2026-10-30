/**
 * The design document is the engine's (GoCommerce docs/customizer.md, version 1), sent and stored
 * unchanged, so it keeps the engine's snake_case keys. Every coordinate is in the mockup's pixels,
 * measured from the print area's top left corner.
 */

export type CustomizerSetup = {
	productId: string
	mockup: { url: string; width: number; height: number }
	overlayUrl: string | null
	printArea: { x: number; y: number; width: number; height: number; radius: number }
	printSize: { widthMm: number; heightMm: number; dpi: number }
	tools: Record<Tool, boolean>
	fonts: { key: string; family: string }[]
	stickers: { id: number; url: string; width: number; height: number }[]
	minPhotoPx: number
	consent: string
}

export type Tool = 'upload' | 'text' | 'shapes' | 'background' | 'stickers'
export type Panel = Tool | 'layers'
export type Align = 'left' | 'center' | 'right'
export type ShapeKind = 'rect' | 'circle' | 'heart' | 'star'

export type Box = { x: number; y: number; width: number; height: number }
type LayerBase = Box & { id: string; rotation: number; opacity: number }

export type ImageLayer = LayerBase & { type: 'image'; upload_id: string }
export type TextLayer = LayerBase & { type: 'text'; text: string; font: string; color: string; font_size: number; align: Align }
export type ShapeLayer = LayerBase & { type: 'shape'; shape: ShapeKind; color: string }
export type StickerLayer = LayerBase & { type: 'sticker'; sticker_media_id: number }
export type Layer = ImageLayer | TextLayer | ShapeLayer | StickerLayer

export type DesignDocument = { version: 1; background?: string; layers: Layer[] }

export const emptyDocument = (): DesignDocument => ({ version: 1, layers: [] })

export const isEmpty = (doc: DesignDocument) => !doc.layers.length && !doc.background

export function printPixels(size: CustomizerSetup['printSize']): { width: number; height: number } {
	return { width: Math.round((size.widthMm / 25.4) * size.dpi), height: Math.round((size.heightMm / 25.4) * size.dpi) }
}

export function printCoverScale(area: Box, size: CustomizerSetup['printSize']): number {
	const px = printPixels(size)
	return Math.max(px.width / area.width, px.height / area.height)
}

export function coverBox(area: Box, width: number, height: number): Box {
	const s = Math.max(area.width / width, area.height / height)
	return centred(area, width * s, height * s)
}

export function centredBox(area: Box, aspect: number, fraction = 0.4): Box {
	const width = area.width * fraction
	return centred(area, width, width / aspect)
}

const toHundredths = (n: number) => Math.round(n * 100) / 100

const centred = (area: Box, width: number, height: number): Box => ({
	x: toHundredths((area.width - width) / 2),
	y: toHundredths((area.height - height) / 2),
	width: toHundredths(width),
	height: toHundredths(height)
})

let counter = 0
export const layerId = (type: Layer['type']) => `${type}-${Date.now().toString(36)}${(counter++).toString(36)}`

export const addLayer = (doc: DesignDocument, layer: Layer): DesignDocument => ({ ...doc, layers: [...doc.layers, layer] })

export const removeLayer = (doc: DesignDocument, id: string): DesignDocument => ({ ...doc, layers: doc.layers.filter((l) => l.id !== id) })

export function updateLayer<L extends Layer>(doc: DesignDocument, id: string, patch: Partial<Omit<L, 'id' | 'type'>>): DesignDocument {
	return { ...doc, layers: doc.layers.map((l) => (l.id === id ? ({ ...l, ...patch } as Layer) : l)) }
}

export function moveLayer(doc: DesignDocument, id: string, direction: 'up' | 'down'): DesignDocument {
	const from = doc.layers.findIndex((l) => l.id === id)
	const to = from + (direction === 'up' ? 1 : -1)
	if (from < 0 || to < 0 || to >= doc.layers.length) return doc
	const layers = [...doc.layers]
	;[layers[from], layers[to]] = [layers[to], layers[from]]
	return { ...doc, layers }
}

export function setBackground(doc: DesignDocument, colour: string | null): DesignDocument {
	const { background: _, ...rest } = doc
	return colour ? { ...rest, background: colour } : rest
}

export const normaliseRotation = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180

export function scaleLayer(layer: Layer, factor: number): Partial<Layer> {
	const width = layer.width * factor
	const height = layer.height * factor
	const patch: Partial<TextLayer> = {
		x: layer.x + (layer.width - width) / 2,
		y: layer.y + (layer.height - height) / 2,
		width,
		height
	}
	if (layer.type === 'text') patch.font_size = layer.font_size * factor
	return patch
}

export const SHAPE_NAMES: Record<ShapeKind, string> = { rect: 'Rectangle', circle: 'Circle', heart: 'Heart', star: 'Star' }

export function layerLabel(layer: Layer): string {
	switch (layer.type) {
		case 'image':
			return 'Photo'
		case 'text':
			return `Words: ${layer.text}`
		case 'shape':
			return SHAPE_NAMES[layer.shape]
		case 'sticker':
			return 'Sticker'
	}
}

export const LINE_HEIGHT = 1.2

export type History = { past: DesignDocument[]; present: DesignDocument; future: DesignDocument[] }

const DEPTH = 100

export const startHistory = (doc: DesignDocument = emptyDocument()): History => ({ past: [], present: doc, future: [] })

export function commit(h: History, next: DesignDocument): History {
	if (next === h.present) return h
	return { past: [...h.past, h.present].slice(-DEPTH), present: next, future: [] }
}

export function undo(h: History): History {
	const previous = h.past.at(-1)
	return previous ? { past: h.past.slice(0, -1), present: previous, future: [h.present, ...h.future] } : h
}

export function redo(h: History): History {
	const [next, ...future] = h.future
	return next ? { past: [...h.past, h.present], present: next, future } : h
}

export const PRINT_COLOURS: { name: string; hex: string }[] = [
	{ name: 'Black', hex: '#111827' },
	{ name: 'White', hex: '#ffffff' },
	{ name: 'Grey', hex: '#9ca3af' },
	{ name: 'Red', hex: '#e11d48' },
	{ name: 'Orange', hex: '#f97316' },
	{ name: 'Yellow', hex: '#facc15' },
	{ name: 'Green', hex: '#16a34a' },
	{ name: 'Blue', hex: '#0ea5e9' },
	{ name: 'Indigo', hex: '#4f46e5' },
	{ name: 'Purple', hex: '#a855f7' },
	{ name: 'Pink', hex: '#f9a8d4' },
	{ name: 'Cream', hex: '#fde68a' }
]
