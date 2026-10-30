import {
	addLayer,
	commit,
	moveLayer,
	redo,
	removeLayer,
	setBackground,
	startHistory,
	undo,
	updateLayer,
	type CustomizerSetup,
	type DesignDocument,
	type Layer
} from './document'
import type { Pictures } from './draw'

export class Designer {
	history = $state(startHistory())
	live = $state<DesignDocument | null>(null)
	selectedId = $state<string | null>(null)
	redraws = $state(0)
	lowResPhotos = $state<Record<string, { width: number; height: number }>>({})
	pictures = $state.raw<Pictures | null>(null)
	readonly photos = new Map<string, ImageBitmap>()
	fontsReady: Promise<void> = Promise.resolve()

	constructor(readonly setup: CustomizerSetup) {}

	get doc(): DesignDocument {
		return this.live ?? this.history.present
	}

	get selected(): Layer | undefined {
		return this.doc.layers.find((l) => l.id === this.selectedId)
	}

	get canUndo() {
		return this.history.past.length > 0
	}

	get canRedo() {
		return this.history.future.length > 0
	}

	apply(next: DesignDocument) {
		this.live = null
		this.history = commit(this.history, next)
		if (this.selectedId && !next.layers.some((l) => l.id === this.selectedId)) this.selectedId = null
	}

	preview(next: DesignDocument) {
		this.live = next
	}

	endGesture() {
		if (this.live) this.apply(this.live)
	}

	add(layer: Layer) {
		this.apply(addLayer(this.doc, layer))
		this.selectedId = layer.id
	}

	update(id: string, patch: Partial<Layer>) {
		this.apply(updateLayer(this.doc, id, patch))
	}

	updateLive(id: string, patch: Partial<Layer>) {
		this.preview(updateLayer(this.doc, id, patch))
	}

	remove(id: string) {
		this.apply(removeLayer(this.doc, id))
	}

	move(id: string, direction: 'up' | 'down') {
		this.apply(moveLayer(this.doc, id, direction))
	}

	background(colour: string | null) {
		this.apply(setBackground(this.doc, colour))
	}

	undo() {
		this.live = null
		this.history = undo(this.history)
	}

	redo() {
		this.live = null
		this.history = redo(this.history)
	}

	addPhoto(uploadId: string, picture: ImageBitmap) {
		this.photos.set(uploadId, picture)
		this.redraws++
	}

	get missingPhoto(): boolean {
		return this.doc.layers.some((l) => l.type === 'image' && !this.photos.has(l.upload_id))
	}
}
