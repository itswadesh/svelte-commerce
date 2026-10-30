<script lang="ts">
	import { AlignCenter, AlignLeft, AlignRight, ArrowDown, ArrowUp, Circle, Heart, ImageUp, Palette, Square, Star, Trash2 } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import { Textarea } from '$lib/components/ui/textarea'
	import Spinner from '$lib/components/common/spinner.svelte'
	import { slide } from '$lib/motion'
	import {
		centredBox,
		coverBox,
		layerId,
		layerLabel,
		SHAPE_NAMES,
		PRINT_COLOURS,
		type Align,
		type Panel,
		type ShapeKind,
		type ShapeLayer,
		type TextLayer
	} from './document'
	import { textBox } from './draw'
	import { loadGlyphs, photoCap, preparePhoto, shopperMessage, upload } from './service'
	import type { Designer } from './designer.svelte'

	type Props = { designer: Designer; panel: Panel; announce: (message: string) => void }
	let { designer, panel, announce }: Props = $props()

	const setup = $derived(designer.setup)
	const area = $derived(setup.printArea)
	const selected = $derived(designer.selected)
	const selectedText = $derived(selected?.type === 'text' ? selected : undefined)
	const selectedShape = $derived(selected?.type === 'shape' ? selected : undefined)

	let measurer: CanvasRenderingContext2D | undefined
	const measure = (layer: Pick<TextLayer, 'text' | 'font' | 'font_size'>) => {
		measurer ??= document.createElement('canvas').getContext('2d')!
		return textBox(measurer, layer, setup)
	}

	let fileInput = $state<HTMLInputElement>()
	let uploading = $state(false)
	let uploadError = $state('')

	async function choose(e: Event) {
		const input = e.currentTarget as HTMLInputElement
		const file = input.files?.[0]
		input.value = ''
		if (!file) return
		uploading = true
		uploadError = ''
		try {
			const { blob, picture } = await preparePhoto(file, photoCap(setup))
			const sent = await upload(blob, blob.type === 'image/png' ? 'photo.png' : 'photo.jpg').catch((err) => {
				picture.close()
				throw err
			})
			designer.addPhoto(sent.uploadId, picture)
			if (Math.min(sent.width, sent.height) < setup.minPhotoPx) {
				designer.lowResPhotos = { ...designer.lowResPhotos, [sent.uploadId]: { width: sent.width, height: sent.height } }
			}
			designer.add({
				id: layerId('image'),
				type: 'image',
				upload_id: sent.uploadId,
				rotation: 0,
				opacity: 1,
				...coverBox(area, sent.width, sent.height)
			})
			announce('Photo added')
		} catch (err) {
			uploadError = shopperMessage(
				err,
				'Your photo could not be uploaded. Please try again.',
				'This photo is too large to upload. Choose a smaller one.'
			)
		} finally {
			uploading = false
		}
	}

	let draft = $state('')
	let font = $state('')
	let colour = $state(PRINT_COLOURS[0].hex)
	let align = $state<Align>('center')
	let editedGlyphs = Promise.resolve()
	const currentFont = $derived(selectedText?.font ?? (font || setup.fonts[0]?.key || ''))
	const currentColour = $derived(selectedText?.color ?? selectedShape?.color ?? colour)

	async function addWords() {
		const text = draft.trim()
		if (!text) return
		await designer.fontsReady
		const words = { text, font: currentFont, font_size: Math.round(area.height / 14) }
		await loadGlyphs(setup, [words])
		const box = measure(words)
		const fitted = Math.min(1, (area.width * 0.9) / box.width)
		const font_size = words.font_size * fitted
		const size = measure({ ...words, font_size })
		designer.add({
			id: layerId('text'),
			type: 'text',
			...words,
			font_size,
			color: colour,
			align,
			rotation: 0,
			opacity: 1,
			...centredBox(area, size.width / size.height, size.width / area.width)
		})
		draft = ''
		announce('Words added')
	}

	function rewriteKeepingCentre(layer: TextLayer, patch: Partial<TextLayer>, live = false) {
		const next = { ...layer, ...patch }
		const size = measure(next)
		const resized = { ...patch, x: layer.x + (layer.width - size.width) / 2, y: layer.y + (layer.height - size.height) / 2, ...size }
		if (live) designer.updateLive(layer.id, resized)
		else designer.update(layer.id, resized)
	}

	function setColour(hex: string) {
		colour = hex
		if (selectedText) rewriteKeepingCentre(selectedText, { color: hex })
		else if (selectedShape) designer.update(selectedShape.id, { color: hex })
	}

	function setAlign(value: Align) {
		align = value
		if (selectedText) designer.update(selectedText.id, { align: value })
	}

	function addShape(shape: ShapeKind) {
		const layer: ShapeLayer = { id: layerId('shape'), type: 'shape', shape, color: colour, rotation: 0, opacity: 1, ...centredBox(area, 1, 0.3) }
		designer.add(layer)
		announce(`${SHAPE_NAMES[shape]} added`)
	}

	function addSticker(sticker: (typeof setup.stickers)[number]) {
		designer.add({
			id: layerId('sticker'),
			type: 'sticker',
			sticker_media_id: sticker.id,
			rotation: 0,
			opacity: 1,
			...centredBox(area, sticker.width / sticker.height, 0.35)
		})
		announce('Sticker added')
	}

	const SHAPES: { shape: ShapeKind; icon: typeof Square }[] = [
		{ shape: 'rect', icon: Square },
		{ shape: 'circle', icon: Circle },
		{ shape: 'heart', icon: Heart },
		{ shape: 'star', icon: Star }
	]
	const ALIGNS: { value: Align; label: string; icon: typeof AlignLeft }[] = [
		{ value: 'left', label: 'Align left', icon: AlignLeft },
		{ value: 'center', label: 'Align centre', icon: AlignCenter },
		{ value: 'right', label: 'Align right', icon: AlignRight }
	]
	const layersTopFirst = $derived([...designer.doc.layers].reverse())
</script>

{#snippet swatches(current: string | undefined, pick: (hex: string) => void, label: string)}
	<fieldset class="flex flex-col gap-2">
		<legend class="mb-2 text-xs font-semibold text-foreground">{label}</legend>
		<div class="flex flex-wrap items-center gap-2">
			{#each PRINT_COLOURS as swatch (swatch.hex)}
				<button
					type="button"
					class="cz-swatch motion-press size-9 rounded-full border max-md:size-11 {current === swatch.hex
						? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
						: ''}"
					style="background-color:{swatch.hex}"
					aria-label={swatch.name}
					aria-pressed={current === swatch.hex}
					onclick={() => pick(swatch.hex)}
				></button>
			{/each}
			<label class="relative flex size-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border max-md:size-11">
				<span class="sr-only">Another colour</span>
				<input
					type="color"
					class="absolute inset-0 size-full cursor-pointer opacity-0"
					value={current ?? '#000000'}
					onchange={(e) => pick(e.currentTarget.value)}
				/>
				<Palette class="size-5 text-foreground" aria-hidden="true" />
			</label>
		</div>
	</fieldset>
{/snippet}

<div class="flex flex-col gap-4 p-4" in:slide>
	{#if panel === 'upload'}
		<h3 class="text-sm font-semibold text-foreground">Photo</h3>
		<p class="text-sm text-muted-foreground" data-testid="customizer-consent">{setup.consent}</p>
		<input bind:this={fileInput} type="file" accept="image/*" class="sr-only" tabindex="-1" aria-hidden="true" onchange={choose} />
		<Button class="h-11 w-full gap-2 font-semibold md:h-10" disabled={uploading} aria-busy={uploading} onclick={() => fileInput?.click()}>
			{#if uploading}
				<Spinner label="Uploading your photo" />
				<span>Uploading…</span>
			{:else}
				<ImageUp aria-hidden="true" />
				<span>Choose a photo</span>
			{/if}
		</Button>
		{#if uploadError}
			<p class="text-sm text-destructive" role="alert" transition:slide>{uploadError}</p>
		{/if}
	{:else if panel === 'text'}
		<h3 class="text-sm font-semibold text-foreground">{selectedText ? 'Edit words' : 'Words'}</h3>
		<label class="flex flex-col gap-1.5 text-xs font-semibold text-foreground">
			Your words
			{#if selectedText}
				<Textarea
					rows={2}
					maxlength={200}
					value={selectedText.text}
					oninput={(e) => {
						const text = e.currentTarget.value
						if (!text.trim()) return
						rewriteKeepingCentre(selectedText, { text }, true)
						editedGlyphs = loadGlyphs(setup, [{ ...selectedText, text }]).then(() => {
							if (selectedText?.text === text) rewriteKeepingCentre(selectedText, {}, true)
						})
					}}
					onchange={() => editedGlyphs.then(() => designer.endGesture())}
					class="text-base font-normal md:text-sm"
				/>
			{:else}
				<Textarea rows={2} maxlength={200} bind:value={draft} class="text-base font-normal md:text-sm" />
			{/if}
		</label>
		<label class="flex flex-col gap-1.5 text-xs font-semibold text-foreground">
			Font
			<select
				class="h-11 w-full rounded-md border border-input bg-background px-3 text-base font-normal md:h-10 md:text-sm"
				value={currentFont}
				onchange={async (e) => {
					font = e.currentTarget.value
					await designer.fontsReady
					if (selectedText) await loadGlyphs(setup, [{ ...selectedText, font }])
					if (selectedText) rewriteKeepingCentre(selectedText, { font })
				}}
			>
				{#each setup.fonts as f (f.key)}
					<option value={f.key}>{f.family}</option>
				{/each}
			</select>
		</label>
		{@render swatches(currentColour, setColour, 'Colour')}
		<div class="flex items-center gap-2" role="group" aria-label="Alignment">
			{#each ALIGNS as a (a.value)}
				{@const Icon = a.icon}
				{@const on = (selectedText?.align ?? align) === a.value}
				<Button
					variant="outline"
					size="icon"
					aria-label={a.label}
					aria-pressed={on}
					class={on ? 'border-primary text-primary' : ''}
					onclick={() => setAlign(a.value)}
				>
					<Icon aria-hidden="true" />
				</Button>
			{/each}
		</div>
		{#if !selectedText}
			<Button class="h-11 w-full font-semibold md:h-10" disabled={!draft.trim()} onclick={addWords}>Add words</Button>
		{/if}
	{:else if panel === 'shapes'}
		<h3 class="text-sm font-semibold text-foreground">Shapes</h3>
		<div class="grid grid-cols-4 gap-2">
			{#each SHAPES as s (s.shape)}
				{@const Icon = s.icon}
				<button
					type="button"
					class="motion-press flex h-14 flex-col items-center justify-center gap-1 rounded-md border text-xs text-foreground transition-colors hover:bg-muted"
					onclick={() => addShape(s.shape)}
				>
					<Icon class="size-5" aria-hidden="true" />
					{SHAPE_NAMES[s.shape]}
				</button>
			{/each}
		</div>
		{@render swatches(currentColour, setColour, selectedShape ? 'Colour of this shape' : 'Colour')}
	{:else if panel === 'background'}
		<h3 class="text-sm font-semibold text-foreground">Background</h3>
		{@render swatches(designer.doc.background, (hex) => designer.background(hex), 'Colour')}
		<Button variant="outline" class="h-11 md:h-10" disabled={!designer.doc.background} onclick={() => designer.background(null)}>No background</Button
		>
	{:else if panel === 'stickers'}
		<h3 class="text-sm font-semibold text-foreground">Stickers</h3>
		<div class="grid grid-cols-4 gap-2">
			{#each setup.stickers as sticker, i (sticker.id)}
				<button
					type="button"
					class="motion-press flex aspect-square items-center justify-center rounded-md border p-2 transition-colors hover:bg-muted"
					aria-label="Add sticker {i + 1}"
					onclick={() => addSticker(sticker)}
				>
					<img src={sticker.url} alt="" width={sticker.width} height={sticker.height} class="h-full w-full object-contain" loading="lazy" />
				</button>
			{/each}
		</div>
	{:else if panel === 'layers'}
		<h3 class="text-sm font-semibold text-foreground">Layers</h3>
		{#if layersTopFirst.length}
			<ol class="flex flex-col gap-1" aria-label="Layers, top first">
				{#each layersTopFirst as layer, i (layer.id)}
					{@const on = layer.id === designer.selectedId}
					<li class="flex items-center gap-1 rounded-md border {on ? 'border-primary' : ''}">
						<button
							type="button"
							class="min-h-11 flex-1 truncate px-3 text-left text-sm text-foreground md:min-h-9"
							aria-pressed={on}
							onclick={() => (designer.selectedId = layer.id)}
						>
							{layerLabel(layer)}
						</button>
						<Button
							variant="plain"
							size="icon"
							aria-label="Move {layerLabel(layer)} up"
							disabled={i === 0}
							onclick={() => designer.move(layer.id, 'up')}
						>
							<ArrowUp aria-hidden="true" />
						</Button>
						<Button
							variant="plain"
							size="icon"
							aria-label="Move {layerLabel(layer)} down"
							disabled={i === layersTopFirst.length - 1}
							onclick={() => designer.move(layer.id, 'down')}
						>
							<ArrowDown aria-hidden="true" />
						</Button>
						<Button variant="plain" size="icon" aria-label="Delete {layerLabel(layer)}" onclick={() => designer.remove(layer.id)}>
							<Trash2 aria-hidden="true" />
						</Button>
					</li>
				{/each}
			</ol>
		{:else}
			<p class="text-sm text-muted-foreground">Nothing added yet.</p>
		{/if}
	{/if}
</div>
