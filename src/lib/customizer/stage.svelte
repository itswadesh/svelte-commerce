<script lang="ts">
	import { Plus, RotateCw } from '@lucide/svelte'
	import { fade } from '$lib/motion'
	import { canResize, layerLabel, normaliseRotation, scaleLayer, SIZE_STEP, TURN_STEP, type Layer } from './document'
	import { backingScale, drawDesign } from './draw'
	import type { Designer } from './designer.svelte'

	type Props = {
		designer: Designer
		zoom: number
		previewing: boolean
		emptyHint: string
		onaddphoto?: () => void
	}

	let { designer, zoom, previewing, emptyHint, onaddphoto }: Props = $props()

	const setup = $derived(designer.setup)
	const area = $derived(setup.printArea)
	const doc = $derived(designer.doc)

	let boxWidth = $state(0)
	let boxHeight = $state(0)
	let scroller = $state<HTMLDivElement>()
	let surface = $state<HTMLDivElement>()
	let canvas = $state<HTMLCanvasElement>()

	const MARGIN = 16
	const MIN_SCALE = 0.05
	const fit = $derived(Math.max(MIN_SCALE, Math.min((boxWidth - 2 * MARGIN) / setup.mockup.width, (boxHeight - 2 * MARGIN) / setup.mockup.height)))
	const scale = $derived(fit * zoom)
	const width = $derived(setup.mockup.width * scale)
	const height = $derived(setup.mockup.height * scale)

	$effect(() => {
		const pictures = designer.pictures
		const ctx = canvas?.getContext('2d')
		void designer.redraws
		if (!canvas || !ctx || !pictures || !boxWidth) return
		const backing = backingScale(width, height, window.devicePixelRatio || 1)
		const w = Math.floor(width * backing)
		const h = Math.floor(height * backing)
		if (canvas.width !== w) canvas.width = w
		if (canvas.height !== h) canvas.height = h
		drawDesign(ctx, doc, setup, pictures, { kind: 'mockup', scale: scale * backing })
	})

	$effect(() => {
		const redraw = () => designer.redraws++
		document.fonts.addEventListener('loadingdone', redraw)
		return () => document.fonts.removeEventListener('loadingdone', redraw)
	})

	function boxStyle(l: Layer) {
		return `left:${(area.x + l.x) * scale}px;top:${(area.y + l.y) * scale}px;width:${l.width * scale}px;height:${l.height * scale}px;transform:rotate(${l.rotation}deg)`
	}

	const HANDLE_RADIUS = 22
	const ROTATE_GAP = 26

	/** Where a layer's handles go on the stage: at its corner and above it as it turns, but never off the stage. */
	function handlesOf(l: Layer) {
		const turn = (l.rotation * Math.PI) / 180
		const cx = (area.x + l.x + l.width / 2) * scale
		const cy = (area.y + l.y + l.height / 2) * scale
		const within = (v: number, size: number) => Math.min(Math.max(v, HANDLE_RADIUS), size - HANDLE_RADIUS)
		const at = (dx: number, dy: number) =>
			`left:${within(cx + dx * Math.cos(turn) - dy * Math.sin(turn), width)}px;top:${within(cy + dx * Math.sin(turn) + dy * Math.cos(turn), height)}px`
		return { rotate: at(0, (-l.height * scale) / 2 - ROTATE_GAP), resize: at((l.width * scale) / 2, (l.height * scale) / 2) }
	}

	function toDesignPoint(e: PointerEvent) {
		const r = surface!.getBoundingClientRect()
		return { x: (e.clientX - r.left) / scale - area.x, y: (e.clientY - r.top) / scale - area.y }
	}

	type Gesture =
		| { kind: 'move'; layer: Layer; from: { x: number; y: number } }
		| { kind: 'resize' | 'rotate'; layer: Layer; centre: { x: number; y: number }; from: { x: number; y: number } }
		| { kind: 'pinch'; layer: Layer; distance: number; angle: number }
		| { kind: 'pan'; from: { x: number; y: number }; scroll: { left: number; top: number }; moved: boolean }

	const pointers = new Map<number, { x: number; y: number }>()
	let gesture: Gesture | null = null

	const centreOf = (l: Layer) => ({ x: l.x + l.width / 2, y: l.y + l.height / 2 })
	const angleDeg = (a: { x: number; y: number }, b: { x: number; y: number }) => (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
	const distance = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(b.x - a.x, b.y - a.y)

	const SNAP_DEGREES = 4
	const snapToQuarterTurn = (deg: number) => {
		const nearest = Math.round(deg / 90) * 90
		return Math.abs(deg - nearest) < SNAP_DEGREES ? normaliseRotation(nearest) : normaliseRotation(deg)
	}

	function pinchOf(layer: Layer): Gesture {
		const [a, b] = [...pointers.values()]
		return { kind: 'pinch', layer, distance: distance(a, b) || 1, angle: angleDeg(a, b) }
	}

	function down(e: PointerEvent) {
		const target = e.target as Element
		// A button of the stage's own, such as Add photo, keeps its click: capturing the pointer
		// would send the click to the surface instead.
		if (previewing || e.button > 0 || (target.closest('button') && !target.closest('[data-layer]'))) return
		surface!.setPointerCapture(e.pointerId)
		pointers.set(e.pointerId, toDesignPoint(e))
		const selected = designer.selected
		if (pointers.size === 2 && selected) {
			designer.endGesture()
			gesture = pinchOf(selected)
			return
		}
		const handle = target.closest<HTMLElement>('[data-handle]')?.dataset.handle
		const id = target.closest<HTMLElement>('[data-layer]')?.dataset.layer
		const layer = doc.layers.find((l) => l.id === id)
		if (handle && selected) {
			gesture = { kind: handle as 'resize' | 'rotate', layer: selected, centre: centreOf(selected), from: toDesignPoint(e) }
		} else if (layer) {
			designer.selectedId = layer.id
			gesture = { kind: 'move', layer, from: toDesignPoint(e) }
		} else {
			gesture = { kind: 'pan', from: { x: e.clientX, y: e.clientY }, scroll: { left: scroller!.scrollLeft, top: scroller!.scrollTop }, moved: false }
		}
	}

	function moveTo(e: PointerEvent) {
		if (!pointers.has(e.pointerId) || !gesture) return
		const p = toDesignPoint(e)
		pointers.set(e.pointerId, p)
		const g = gesture
		switch (g.kind) {
			case 'move':
				designer.updateLive(g.layer.id, { x: g.layer.x + p.x - g.from.x, y: g.layer.y + p.y - g.from.y })
				break
			case 'resize': {
				const factor = distance(g.centre, p) / (distance(g.centre, g.from) || 1)
				if (canResize(g.layer, factor)) designer.updateLive(g.layer.id, scaleLayer(g.layer, factor))
				break
			}
			case 'rotate':
				designer.updateLive(g.layer.id, { rotation: snapToQuarterTurn(g.layer.rotation + angleDeg(g.centre, p) - angleDeg(g.centre, g.from)) })
				break
			case 'pinch': {
				if (pointers.size < 2) break
				const [a, b] = [...pointers.values()]
				const factor = distance(a, b) / g.distance
				const patch = canResize(g.layer, factor) ? scaleLayer(g.layer, factor) : {}
				designer.updateLive(g.layer.id, { ...patch, rotation: snapToQuarterTurn(g.layer.rotation + angleDeg(a, b) - g.angle) })
				break
			}
			case 'pan': {
				const dx = e.clientX - g.from.x
				const dy = e.clientY - g.from.y
				if (Math.hypot(dx, dy) > 4) g.moved = true
				scroller!.scrollLeft = g.scroll.left - dx
				scroller!.scrollTop = g.scroll.top - dy
				break
			}
		}
	}

	function up(e: PointerEvent) {
		pointers.delete(e.pointerId)
		if (gesture?.kind === 'pan' && !gesture.moved) designer.selectedId = null
		designer.endGesture()
		const selected = designer.selected
		gesture = pointers.size === 1 && selected ? { kind: 'move', layer: selected, from: [...pointers.values()][0] } : null
	}

	const SIZE_KEYS: Record<string, number> = { '+': SIZE_STEP, '=': SIZE_STEP, '-': 1 / SIZE_STEP, _: 1 / SIZE_STEP }
	const TURN_KEYS: Record<string, number> = { '[': -TURN_STEP, ']': TURN_STEP }

	function keydown(e: KeyboardEvent, layer: Layer) {
		if (e.ctrlKey || e.metaKey || e.altKey) return
		const step = (area.width / 100) * (e.shiftKey ? 10 : 1)
		const by: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }
		if (by[e.key]) {
			e.preventDefault()
			designer.update(layer.id, { x: layer.x + by[e.key][0], y: layer.y + by[e.key][1] })
		} else if (SIZE_KEYS[e.key]) {
			e.preventDefault()
			designer.resize(layer.id, SIZE_KEYS[e.key])
		} else if (TURN_KEYS[e.key]) {
			e.preventDefault()
			designer.turn(layer.id, TURN_KEYS[e.key])
		} else if (e.key === 'Delete' || e.key === 'Backspace') {
			e.preventDefault()
			designer.remove(layer.id)
			surface?.focus()
		}
	}
</script>

<div
	bind:this={scroller}
	bind:clientWidth={boxWidth}
	bind:clientHeight={boxHeight}
	class="cz-stage relative flex min-h-0 flex-1 overflow-auto bg-muted"
>
	<div
		bind:this={surface}
		class="relative m-auto shrink-0 touch-none select-none"
		style="width:{width}px;height:{height}px"
		tabindex="-1"
		role="presentation"
		onpointerdown={down}
		onpointermove={moveTo}
		onpointerup={up}
		onpointercancel={up}
	>
		<canvas bind:this={canvas} aria-hidden="true" class="absolute inset-0 h-full w-full"></canvas>

		{#if !designer.pictures}
			<div class="absolute inset-0 animate-pulse rounded-lg bg-background/60" aria-hidden="true"></div>
		{/if}

		{#if !previewing}
			{#each doc.layers as layer (layer.id)}
				{@const selected = layer.id === designer.selectedId}
				<button
					type="button"
					data-layer={layer.id}
					aria-label={layerLabel(layer)}
					aria-pressed={selected}
					class="cz-layer absolute origin-center cursor-move rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring {selected
						? 'cz-selected'
						: ''}"
					style={boxStyle(layer)}
					onfocus={() => (designer.selectedId = layer.id)}
					onkeydown={(e) => keydown(e, layer)}
				>
					{#if selected}
						<span class="pointer-events-none absolute -inset-px rounded-sm border-2 border-primary" transition:fade aria-hidden="true"></span>
					{/if}
				</button>
			{/each}

			{#if designer.selected}
				{@const handles = handlesOf(designer.selected)}
				<span data-handle="rotate" class="cz-handle cursor-grab" style={handles.rotate} aria-hidden="true" transition:fade>
					<RotateCw class="size-3.5" />
				</span>
				<span data-handle="resize" class="cz-handle cursor-nwse-resize" style={handles.resize} aria-hidden="true" transition:fade></span>
			{/if}

			{#if !doc.layers.length && !doc.background && designer.pictures}
				<div
					class="pointer-events-none absolute flex flex-col items-center justify-end gap-2 p-4 text-center"
					style="left:{area.x * scale}px;top:{area.y * scale}px;width:{area.width * scale}px;height:{area.height * scale}px"
					transition:fade
				>
					{#if setup.tools.upload}
						<button
							type="button"
							class="motion-press pointer-events-auto inline-flex h-11 items-center gap-2 rounded-full border bg-background px-4 text-sm font-semibold text-foreground shadow-z-1 transition-colors hover:bg-muted"
							onclick={onaddphoto}
						>
							<Plus class="size-4 text-primary" aria-hidden="true" />
							Add photo
						</button>
					{/if}
					{#if emptyHint}
						<p class="rounded-sm bg-background/80 px-2 text-xs text-muted-foreground">{emptyHint}</p>
					{/if}
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.cz-layer {
		transition: box-shadow var(--motion-fast) var(--motion-ease);
	}
	.cz-layer:hover:not(.cz-selected) {
		box-shadow: 0 0 0 1px hsl(var(--primary-ink) / 0.6);
	}
	.cz-handle {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		color: hsl(var(--primary-ink));
		pointer-events: auto;
		touch-action: none;
		isolation: isolate;
		transform: translate(-50%, -50%);
		transition: transform var(--motion-fast) var(--motion-ease);
	}
	.cz-handle::before {
		content: '';
		position: absolute;
		inset: 0.5rem;
		z-index: -1;
		border-radius: 9999px;
		border: 2px solid hsl(var(--primary-ink));
		background: hsl(var(--background));
	}
	.cz-handle:active {
		transform: translate(-50%, -50%) scale(1.15);
	}
	@media (prefers-reduced-motion: reduce) {
		.cz-handle:active {
			transform: translate(-50%, -50%);
		}
	}
</style>
