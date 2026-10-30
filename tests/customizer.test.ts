import { describe, expect, it } from 'vitest'
import {
	centredBox,
	commit,
	coverBox,
	emptyDocument,
	layerLabel,
	moveLayer,
	normaliseRotation,
	printPixels,
	printCoverScale,
	layerId,
	redo,
	scaleLayer,
	setBackground,
	startHistory,
	undo,
	type CustomizerSetup,
	type DesignDocument,
	type Layer
} from '$lib/customizer/document'
import { Designer } from '$lib/customizer/designer.svelte'
import { backingScale, previewView } from '$lib/customizer/draw'
import { PlainError, plainMessage } from '$lib/customizer/service'

const area = { x: 40, y: 40, width: 520, height: 1120, radius: 90 }

const setup: CustomizerSetup = {
	productId: '1',
	mockup: { url: '/backend/media/mockup.png', width: 600, height: 1200 },
	overlayUrl: null,
	printArea: area,
	printSize: { widthMm: 65, heightMm: 140, dpi: 300 },
	tools: { upload: true, text: true, shapes: true, background: true, stickers: true },
	fonts: [{ key: 'poppins', family: 'Poppins' }],
	stickers: [],
	minPhotoPx: 1000,
	consent: 'Your photo is used only to print your order.'
}

const shape = (id: string, x = 0): Layer => ({
	id,
	type: 'shape',
	shape: 'heart',
	color: '#e11d48',
	x,
	y: 0,
	width: 100,
	height: 100,
	rotation: 0,
	opacity: 1
})

describe('the print file size', () => {
	it('is round(mm / 25.4 × dpi) pixels each side, as the engine checks it', () => {
		expect(printPixels({ widthMm: 65, heightMm: 140, dpi: 300 })).toEqual({ width: 768, height: 1654 })
		expect(printPixels({ widthMm: 75, heightMm: 150, dpi: 300 })).toEqual({ width: 886, height: 1772 })
		expect(printPixels({ widthMm: 65, heightMm: 140, dpi: 500 })).toEqual({ width: 1280, height: 2756 })
	})

	it('is filled from the print area by one factor, the larger of the two', () => {
		expect(printCoverScale(area, { widthMm: 65, heightMm: 140, dpi: 300 })).toBe(768 / 520)
	})
})

describe('placing a layer', () => {
	it('covers the print area with a photo, centred', () => {
		expect(coverBox(area, 1500, 2000)).toEqual({ x: -160, y: 0, width: 840, height: 1120 })
	})

	it('centres a square at a share of the print area’s width', () => {
		expect(centredBox(area, 1, 0.3)).toEqual({ x: 182, y: 482, width: 156, height: 156 })
	})

	it('grows words with their box and keeps the centre', () => {
		const words: Layer = {
			id: 't',
			type: 'text',
			text: 'Asha',
			font: 'poppins',
			color: '#111827',
			font_size: 40,
			align: 'center',
			x: 100,
			y: 200,
			width: 200,
			height: 48,
			rotation: 0,
			opacity: 1
		}
		expect(scaleLayer(words, 2)).toEqual({ x: 0, y: 176, width: 400, height: 96, font_size: 80 })
	})

	it('names layers the way the engine accepts ids, never twice', () => {
		const ids = [layerId('image'), layerId('text'), layerId('shape'), layerId('sticker')]
		expect(ids.every((id) => /^[A-Za-z0-9_-]{1,64}$/.test(id))).toBe(true)
		expect(new Set(ids).size).toBe(4)
	})

	it('keeps rotation inside the engine’s range however far it turns', () => {
		expect(normaliseRotation(370)).toBe(10)
		expect(normaliseRotation(-190)).toBe(170)
		expect(normaliseRotation(-725)).toBe(-5)
	})
})

describe('the document', () => {
	it('moves a layer one step and stops at the ends', () => {
		const doc: DesignDocument = { version: 1, layers: [shape('a'), shape('b'), shape('c')] }
		expect(moveLayer(doc, 'a', 'up').layers.map((l) => l.id)).toEqual(['b', 'a', 'c'])
		expect(moveLayer(doc, 'c', 'down').layers.map((l) => l.id)).toEqual(['a', 'c', 'b'])
		expect(moveLayer(doc, 'c', 'up').layers.map((l) => l.id)).toEqual(['a', 'b', 'c'])
	})

	it('leaves the background key out when there is none, as the engine refuses an empty colour', () => {
		const coloured = setBackground(emptyDocument(), '#fde68a')
		expect(JSON.stringify(coloured)).toBe('{"version":1,"layers":[],"background":"#fde68a"}')
		expect(JSON.stringify(setBackground(coloured, null))).toBe('{"version":1,"layers":[]}')
	})

	it('names each layer for the shopper', () => {
		expect(layerLabel(shape('h'))).toBe('Heart')
		expect(layerLabel({ ...shape('w'), type: 'text', text: 'Asha', font: 'poppins', font_size: 40, align: 'center' } as Layer)).toBe('Words: Asha')
	})
})

describe('undo and redo', () => {
	it('steps back and forward through whole documents, and a new change drops the redo', () => {
		const one: DesignDocument = { version: 1, layers: [shape('a')] }
		const two: DesignDocument = { version: 1, layers: [shape('a'), shape('b')] }
		const three: DesignDocument = { version: 1, layers: [shape('c')] }
		let h = commit(commit(startHistory(), one), two)
		h = undo(h)
		expect(h.present).toBe(one)
		h = redo(h)
		expect(h.present).toBe(two)
		h = commit(undo(h), three)
		expect(h.present).toBe(three)
		expect(redo(h).present).toBe(three)
		expect(undo(undo(h)).present.layers).toEqual([])
	})

	it('takes back a whole drag in one undo', () => {
		const designer = new Designer(setup)
		designer.add(shape('a'))
		designer.updateLive('a', { x: 10 })
		designer.updateLive('a', { x: 20 })
		designer.updateLive('a', { x: 30 })
		designer.endGesture()
		expect(designer.doc.layers[0].x).toBe(30)
		designer.undo()
		expect(designer.doc.layers[0].x).toBe(0)
		designer.undo()
		expect(designer.doc.layers).toEqual([])
	})

	it('lets go of the selection when its layer is deleted', () => {
		const designer = new Designer(setup)
		designer.add(shape('a'))
		expect(designer.selectedId).toBe('a')
		designer.remove('a')
		expect(designer.selectedId).toBe(null)
	})
})

const photo = (id: string, uploadId: string): Layer => ({
	id,
	type: 'image',
	upload_id: uploadId,
	x: 0,
	y: 0,
	width: 100,
	height: 100,
	rotation: 0,
	opacity: 1
})

const bitmap = () => {
	const b = { closed: false, close: () => void (b.closed = true) }
	return b as unknown as ImageBitmap & { closed: boolean }
}

describe('the shopper’s photos', () => {
	it('keeps a photo added before the product’s pictures have loaded', () => {
		const designer = new Designer(setup)
		const picture = bitmap()
		designer.addPhoto('u1', picture)
		designer.add(photo('p', 'u1'))
		expect(designer.photos.get('u1')).toBe(picture)
		expect(designer.missingPhoto).toBe(false)
	})

	it('knows when a photo layer has no picture to print', () => {
		const designer = new Designer(setup)
		designer.add(photo('p', 'u9'))
		expect(designer.missingPhoto).toBe(true)
	})

	it('lets go of a photo only once no layer and no undo step uses it', () => {
		const designer = new Designer(setup)
		const [placed, undoable, unused] = [bitmap(), bitmap(), bitmap()]
		designer.addPhoto('placed', placed)
		designer.add(photo('a', 'placed'))
		designer.addPhoto('undoable', undoable)
		designer.add(photo('b', 'undoable'))
		designer.remove('b')
		designer.addPhoto('unused', unused)
		designer.prune()
		expect([placed.closed, undoable.closed, unused.closed]).toEqual([false, false, true])
		expect([...designer.photos.keys()]).toEqual(['placed', 'undoable'])
	})

	it('lets go of every photo when the editor goes', () => {
		const designer = new Designer(setup)
		const picture = bitmap()
		designer.addPhoto('u1', picture)
		designer.add(photo('p', 'u1'))
		designer.dispose()
		expect(picture.closed).toBe(true)
		expect(designer.photos.size).toBe(0)
	})
})

describe('canvas sizes', () => {
	it('draws the stage at the screen’s density until that would pass 16 megapixels', () => {
		expect(backingScale(400, 800, 2)).toBe(2)
		const k = backingScale(1738.5, 3477, 2)
		expect([Math.floor(1738.5 * k), Math.floor(3477 * k)]).toEqual([2828, 5656])
	})

	it('draws the preview at most 2000 pixels on its longer side', () => {
		expect(previewView({ ...setup, mockup: { url: '/m.png', width: 4000, height: 8000 } })).toEqual({ kind: 'mockup', scale: 0.25 })
		expect(previewView(setup)).toEqual({ kind: 'mockup', scale: 1 })
	})
})

describe('what a shopper is told when a step fails', () => {
	it('is plain copy, never the engine’s or HTTP’s words', () => {
		const tryAgain = 'Your photo could not be uploaded. Please try again.'
		const tooLarge = 'This photo is too large to upload. Choose a smaller one.'
		const engine = (status: number, message: string) => Object.assign(new Error(message), { status })
		expect(plainMessage(engine(502, 'The commerce engine answered 502.'), tryAgain, tooLarge)).toBe(tryAgain)
		expect(plainMessage(engine(413, 'Payload Too Large'), tryAgain, tooLarge)).toBe(tooLarge)
		expect(plainMessage(new TypeError('Failed to fetch'), tryAgain, tooLarge)).toBe(tryAgain)
		expect(plainMessage(engine(429, 'rate limited'), tryAgain)).toBe('Too many tries in the last hour. Please wait a while and try again.')
		expect(plainMessage(new PlainError('Choose a JPEG or PNG photo.'), tryAgain)).toBe('Choose a JPEG or PNG photo.')
	})
})

describe('resizing and turning without a drag', () => {
	const box = (l: Layer) => [l.x, l.y, l.width, l.height, l.rotation].map((n) => Math.round(n * 100) / 100 || 0)

	it('grows and shrinks a layer about its centre, one step at a time', () => {
		const designer = new Designer(setup)
		designer.add(shape('a'))
		designer.resize('a', 1.1)
		expect(box(designer.doc.layers[0])).toEqual([-5, -5, 110, 110, 0])
		designer.resize('a', 1 / 1.1)
		expect(box(designer.doc.layers[0])).toEqual([0, 0, 100, 100, 0])
		designer.undo()
		expect(box(designer.doc.layers[0])).toEqual([-5, -5, 110, 110, 0])
	})

	it('stops shrinking at the smallest size a drag allows', () => {
		const designer = new Designer(setup)
		designer.add({ ...shape('a'), width: 8.5, height: 40 })
		designer.resize('a', 1 / 1.1)
		expect(box(designer.doc.layers[0])).toEqual([0, 0, 8.5, 40, 0])
		expect(designer.history.past.length).toBe(1)
	})

	it('turns a layer by a step either way, inside the engine’s range', () => {
		const designer = new Designer(setup)
		designer.add({ ...shape('a'), rotation: 170 })
		designer.turn('a', 15)
		expect(designer.doc.layers[0].rotation).toBe(-175)
		designer.turn('a', -15)
		designer.turn('a', -15)
		expect(designer.doc.layers[0].rotation).toBe(155)
	})
})
