<script module lang="ts">
	import { pushState, replaceState } from '$app/navigation'

	// A frame, such as the theme editor's preview, shares its history with the page around it, and a
	// step back there can undo that page's own step: in a frame the editor neither adds nor leaves an entry.
	const framed = () => window.parent !== window

	export function openEditor() {
		if (framed()) replaceState('', { customizerOpen: true })
		else pushState('', { customizerOpen: true })
	}
</script>

<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui'
	import { untrack } from 'svelte'
	import { afterNavigate } from '$app/navigation'
	import { page } from '$app/state'
	import {
		ArrowDown,
		ArrowUp,
		Check,
		Expand,
		Eye,
		ImageUp,
		Layers,
		Minus,
		PaintBucket,
		Plus,
		Redo2,
		RotateCcw,
		RotateCw,
		Shapes,
		ShoppingBag,
		Shrink,
		Sticker,
		Trash2,
		Type,
		Undo2,
		X
	} from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import Spinner from '$lib/components/common/spinner.svelte'
	import { fade, fly } from '$lib/motion'
	import { useProductState } from '$lib/core/composables/index.js'
	import { getCartState, getUserState } from '$lib/core/stores/index.js'
	import { cartService } from '$lib/core/services'
	import { fireGTagEvent } from '$lib/core/utils/index.js'
	import { formatPrice } from '$lib/utils/price'
	import { addOnPicks, addPicks } from '$lib/product/add-on-picks.svelte'
	import { bumpTotal } from '$lib/product/upsells'
	import {
		canResize,
		isEmpty,
		layerLabel,
		SIZE_STEP,
		TURN_STEP,
		type CustomizerSetup,
		type DesignDocument,
		type Panel,
		type TextLayer
	} from './document'
	import { Designer } from './designer.svelte'
	import { loadPicture, previewView, renderPng, type Pictures } from './draw'
	import { loadFonts, loadGlyphs, MAX_UPLOAD_BYTES, saveDesign, ShopperError, shopperMessage, upload } from './service'
	import Stage from './stage.svelte'
	import Tools from './tools.svelte'

	let { setup: initial }: { setup: CustomizerSetup } = $props()

	// A design's coordinates are in its setup's mockup pixels, so the editor keeps the setup it was
	// opened with; another product is a new editor (the page keys it by product).
	const designer = new Designer(untrack(() => initial))
	const setup = designer.setup
	const productState = useProductState()
	const cartState = getCartState()
	const userState = getUserState()

	const product = $derived(page.data?.product)
	const variantId = $derived(String(productState.selectedVariant?.id || product?.variants?.[0]?.id || ''))
	const unitPrice = $derived(Number(productState.selectedVariant?.price || product?.price) || 0)
	const picked = $derived(addOnPicks.productId === setup.productId ? addOnPicks.items : [])
	const price = $derived(unitPrice > 0 ? formatPrice(bumpTotal(unitPrice, picked), page.data?.store?.currency?.code) : '')

	const tools = $derived(
		[
			{ panel: 'upload' as const, label: 'Upload', icon: ImageUp, on: setup.tools.upload },
			{ panel: 'text' as const, label: 'Text', icon: Type, on: setup.tools.text && setup.fonts.length > 0 },
			{ panel: 'shapes' as const, label: 'Shapes', icon: Shapes, on: setup.tools.shapes },
			{ panel: 'background' as const, label: 'Background', icon: PaintBucket, on: setup.tools.background },
			{ panel: 'stickers' as const, label: 'Stickers', icon: Sticker, on: setup.tools.stickers && setup.stickers.length > 0 },
			{ panel: 'layers' as const, label: 'Layers', icon: Layers, on: true }
		].filter((t) => t.on)
	)

	const emptyHint = $derived.by(() => {
		const others = [
			setup.tools.text && 'words',
			setup.tools.shapes && 'shapes',
			setup.tools.stickers && setup.stickers.length > 0 && 'stickers',
			setup.tools.background && 'a background'
		].filter((x): x is string => !!x)
		if (!others.length) return ''
		const list = others.length > 1 ? `${others.slice(0, -1).join(', ')} and ${others.at(-1)}` : others[0]
		return `${setup.tools.upload ? 'or add' : 'Add'} ${list}`
	})

	let open = $state(false)

	$effect(() => {
		if (page.state.customizerOpen) untrack(() => (open = true))
	})

	// The product composable canonicalises the URL with a replaceState goto that drops page.state,
	// and can land after Design yours: claim the entry back, so Back closes and Forward reopens.
	afterNavigate(({ type }) => {
		if (open && type !== 'popstate' && !page.state.customizerOpen) replaceState('', { ...page.state, customizerOpen: true })
	})

	let closing: Promise<void> | null = null
	let closed = () => {}
	let closeFallback: ReturnType<typeof setTimeout> | undefined
	let addedTimer: ReturnType<typeof setTimeout> | undefined

	function shut() {
		open = false
		clearTimeout(closeFallback)
		clearTimeout(addedTimer)
		if (status.state === 'added') status = { state: 'idle' }
		closing = null
		closed()
	}

	// A reload keeps the editor's history entry but not page.state or the design, so the next Back
	// would land on this product again: step off the entry now.
	$effect(() => {
		if (!framed() && history.state?.['sveltekit:states']?.customizerOpen) history.back()
	})

	// SvelteKit applies the entry's state in its own popstate listener, which may run after this one.
	function onpopstate() {
		setTimeout(() => {
			if (!page.state.customizerOpen) shut()
		})
	}

	// One step back however often Close is asked for before the step lands, and closed even if it never does.
	function close(): Promise<void> {
		if (!open) return Promise.resolve()
		if (framed()) {
			replaceState('', { ...page.state, customizerOpen: false })
			shut()
			return Promise.resolve()
		}
		closing ??= new Promise<void>((resolve) => {
			closed = resolve
			closeFallback = setTimeout(shut, 500)
			history.back()
		})
		return closing
	}

	let panel = $state<Panel | null>(null)
	let previewing = $state(false)
	let zoom = $state(1)
	let announcement = $state('')
	let loadError = $state(false)

	type Status = { state: 'idle' } | { state: 'saving' } | { state: 'added' } | { state: 'error'; message: string }
	let status = $state<Status>({ state: 'idle' })

	const selected = $derived(designer.selected)
	const softPhoto = $derived(selected?.type === 'image' ? designer.lowResPhotos[selected.upload_id] : undefined)
	const empty = $derived(isEmpty(designer.doc))

	function announce(message: string) {
		announcement = ''
		queueMicrotask(() => (announcement = message))
	}

	async function loadPictures() {
		loadError = false
		try {
			const [mockup, overlay, stickers] = await Promise.all([
				loadPicture(setup.mockup.url),
				setup.overlayUrl ? loadPicture(setup.overlayUrl) : null,
				Promise.all(setup.stickers.map(async (s) => [s.id, await loadPicture(s.url)] as const))
			])
			designer.pictures = { mockup, overlay, photos: designer.photos, stickers: new Map(stickers) }
		} catch {
			loadError = true
		}
	}

	$effect(() => {
		if (!open || designer.pictures) return
		designer.fontsReady = loadFonts(setup).then(() => void designer.redraws++)
		loadPictures()
	})

	$effect(() => {
		if (!open) untrack(() => designer.prune())
	})

	$effect(() => () => {
		designer.dispose()
		clearTimeout(addedTimer)
		clearTimeout(closeFallback)
	})

	function togglePanel(p: Panel) {
		previewing = false
		panel = panel === p ? null : p
	}

	function undo() {
		designer.undo()
		announce('Undone')
	}

	function redo() {
		designer.redo()
		announce('Redone')
	}

	function shortcuts(e: KeyboardEvent) {
		if ((e.target as HTMLElement).closest('input, textarea, select')) return
		const mod = e.ctrlKey || e.metaKey
		const key = e.key.toLowerCase()
		if (mod && key === 'z') {
			e.preventDefault()
			if (e.shiftKey) redo()
			else undo()
		} else if (mod && key === 'y') {
			e.preventDefault()
			redo()
		}
	}

	const ZOOMS = [1, 1.25, 1.5, 2, 3]
	const zoomBy = (by: 1 | -1) => (zoom = ZOOMS[Math.min(ZOOMS.length - 1, Math.max(0, ZOOMS.indexOf(zoom) + by))])

	const TOO_LARGE = 'Your design is too detailed to save as a print file. Make a photo smaller on the print, or use fewer photos, and try again.'
	const MISSING_PHOTO = 'A photo in your design did not finish loading. Delete it, add it again, and try again.'

	async function saveDocument(doc: DesignDocument, pictures: Pictures): Promise<string> {
		if (designer.missingPhoto) throw new ShopperError(MISSING_PHOTO)
		await designer.fontsReady
		await loadGlyphs(
			setup,
			doc.layers.filter((l): l is TextLayer => l.type === 'text')
		)
		const [previewPng, printPng] = await Promise.all([
			renderPng(doc, setup, pictures, previewView(setup)),
			renderPng(doc, setup, pictures, { kind: 'print' })
		])
		if (printPng.size > MAX_UPLOAD_BYTES || previewPng.size > MAX_UPLOAD_BYTES) throw new ShopperError(TOO_LARGE)
		const [preview, print] = await Promise.all([upload(previewPng, 'preview.png'), upload(printPng, 'print.png')])
		const saved = await saveDesign({
			productId: setup.productId,
			variantId,
			previewUploadId: preview.uploadId,
			printUploadId: print.uploadId,
			document: doc
		})
		return saved.designId
	}

	let unconfirmed: { doc: DesignDocument; variantId: string; designId: string } | null = null

	async function addToBag() {
		const pictures = designer.pictures
		if (!pictures || status.state === 'saving') return
		designer.endGesture()
		status = { state: 'saving' }
		try {
			const doc = designer.doc
			const bag = cartService as unknown as {
				addToCart: (q: Record<string, unknown>) => Promise<any>
				getCartByCartId: (cartId: string) => Promise<any>
				removeCart: (q: { cartId: string | undefined; lineId: string }) => Promise<any>
			}
			const lineOf = (cart: any, designId: string) => cart?.lineItems?.find((l: { designId?: string }) => l.designId === designId)
			const cartId = cartState?.retrieveCartId() || cartState?.cart?.id
			let cart = unconfirmed && cartId ? await bag.getCartByCartId(cartId) : null
			if (unconfirmed && (unconfirmed.doc !== doc || unconfirmed.variantId !== variantId)) {
				const lost = lineOf(cart, unconfirmed.designId)
				if (lost) cart = await bag.removeCart({ cartId, lineId: lost.id })
				unconfirmed = null
			}
			const designId = unconfirmed?.designId ?? (await saveDocument(doc, pictures))
			unconfirmed = { doc, variantId, designId }
			if (!lineOf(cart, designId)) {
				cart = await bag.addToCart({ cartId: cartState?.cart?.id || null, productId: setup.productId, variantId, qty: 1, designId })
			}
			if (!lineOf(cart, designId)) throw new Error('The bag came back without the design')
			unconfirmed = null
			if (cartState) cartState.cart = cart
			await addPicks(setup.productId, cartState)
			fireGTagEvent('add_to_cart', { items: [{ ...product, qty: 1 }], total: unitPrice, qty: 1, user: { id: userState?.user?.id } })
			if (!open) {
				status = { state: 'idle' }
				return
			}
			status = { state: 'added' }
			announce('Your design is in your bag')
			addedTimer = setTimeout(async () => {
				await close()
				if (cartState) cartState.isOpen = true
			}, 900)
		} catch (err) {
			status = { state: 'error', message: shopperMessage(err, 'Your design could not be added to your bag. Please try again.', TOO_LARGE) }
		}
	}
</script>

{#snippet bar(label: string, onclick: () => void, Icon: typeof Type, disabled = false, pressed: boolean | undefined = undefined, keys?: string)}
	<Button
		variant="plain"
		size="icon"
		aria-label={label}
		aria-pressed={pressed}
		aria-keyshortcuts={keys}
		{disabled}
		{onclick}
		class="motion-press shrink-0 rounded-md hover:bg-muted {pressed ? 'bg-muted text-primary' : ''}"
	>
		<Icon aria-hidden="true" />
	</Button>
{/snippet}

<svelte:window {onpopstate} />

<DialogPrimitive.Root
	bind:open={
		() => open,
		(next) => {
			if (!next) close()
		}
	}
>
	<DialogPrimitive.Portal>
		<DialogPrimitive.Overlay
			class="fixed inset-0 z-modal bg-foreground/40 data-[state=closed]:duration-exit data-[state=open]:duration-panel data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
		/>
		<DialogPrimitive.Content
			data-testid="customizer"
			class="fixed inset-0 z-modal flex flex-col overflow-hidden bg-background data-[state=closed]:duration-exit data-[state=open]:duration-panel data-[state=closed]:ease-exit data-[state=open]:ease-standard data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4 md:inset-6 md:mx-auto md:max-w-6xl md:rounded-xl md:border md:shadow-z-10"
			onkeydown={shortcuts}
		>
			<header class="flex h-14 shrink-0 items-center gap-1 border-b px-2">
				<DialogPrimitive.Close
					class="motion-press flex size-11 shrink-0 items-center justify-center rounded-md hover:bg-muted md:size-9"
					aria-label="Close the editor"
				>
					<X class="size-5" aria-hidden="true" />
				</DialogPrimitive.Close>
				<DialogPrimitive.Title class="min-w-0 flex-1 truncate px-1 text-sm font-semibold text-foreground max-sm:sr-only"
					>Design yours</DialogPrimitive.Title
				>
				<span class="flex-1 sm:hidden" aria-hidden="true"></span>
				<DialogPrimitive.Description class="sr-only">
					Add a photo, words, shapes or stickers, then add your design to your bag. Arrow keys move the selected layer, plus and minus resize it, the
					bracket keys turn it, and Delete removes it.
				</DialogPrimitive.Description>
				{@render bar('Undo', undo, Undo2, !designer.canUndo)}
				{@render bar('Redo', redo, Redo2, !designer.canRedo)}
				<div class="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden="true"></div>
				{@render bar('Zoom out', () => zoomBy(-1), Minus, zoom === ZOOMS[0])}
				<span class="w-11 text-center text-xs font-medium tabular-nums text-foreground" aria-live="polite">{Math.round(zoom * 100)}%</span>
				{@render bar('Zoom in', () => zoomBy(1), Plus, zoom === ZOOMS.at(-1))}
				{@render bar('Preview', () => ((previewing = !previewing), (panel = null)), Eye, false, previewing)}
			</header>

			<div class="flex min-h-0 flex-1 flex-col md:flex-row">
				<nav
					class="order-3 flex shrink-0 overflow-x-auto border-t md:order-1 md:w-24 md:flex-col md:overflow-y-auto md:border-r md:border-t-0"
					aria-label="Tools"
				>
					{#each tools as t (t.panel)}
						{@const Icon = t.icon}
						<button
							type="button"
							class="motion-press flex min-h-14 flex-auto flex-col items-center justify-center gap-1 px-1 py-1.5 text-xs transition-colors hover:bg-muted md:flex-none md:py-3 {panel ===
							t.panel
								? 'bg-muted font-semibold text-primary'
								: 'text-foreground'}"
							aria-pressed={panel === t.panel}
							onclick={() => togglePanel(t.panel)}
						>
							<Icon class="size-5" aria-hidden="true" />
							{t.label}
						</button>
					{/each}
				</nav>

				{#if panel && !previewing}
					<section
						class="order-2 max-h-56 shrink-0 overflow-y-auto border-t md:max-h-none md:w-80 md:border-r md:border-t-0"
						aria-label={tools.find((t) => t.panel === panel)?.label}
						transition:fly={{ y: 12 }}
					>
						{#key panel}
							<Tools {designer} {panel} {announce} />
						{/key}
					</section>
				{/if}

				<div class="order-1 flex min-h-0 flex-1 flex-col md:order-3">
					{#if loadError}
						<div class="flex flex-1 flex-col items-center justify-center gap-3 bg-muted p-6 text-center" role="alert" in:fade>
							<p class="text-sm text-foreground">The editor could not load this product's pictures.</p>
							<Button variant="outline" onclick={loadPictures}>Try again</Button>
						</div>
					{:else}
						<Stage {designer} {zoom} {previewing} {emptyHint} onaddphoto={() => togglePanel('upload')} />
					{/if}

					{#if selected && !previewing}
						{@const name = layerLabel(selected)}
						<div class="flex shrink-0 flex-col gap-1 border-t px-3 py-1.5" data-testid="customizer-layer-bar" transition:fly={{ y: 8 }}>
							<div class="flex flex-wrap items-center gap-1">
								<div class="flex h-9 min-w-0 flex-1 basis-full items-center gap-1 sm:h-auto sm:basis-0">
									<p class="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{name}</p>
									{#if selected.type === 'text' && panel !== 'text'}
										<Button variant="outline" size="sm" class="h-9" onclick={() => (panel = 'text')}>Edit words</Button>
									{/if}
								</div>
								<div class="flex items-center gap-1 max-sm:w-full max-sm:justify-between">
									{@render bar(
										`Make ${name} smaller`,
										() => designer.resize(selected.id, 1 / SIZE_STEP),
										Shrink,
										!canResize(selected, 1 / SIZE_STEP),
										undefined,
										'-'
									)}
									{@render bar(`Make ${name} bigger`, () => designer.resize(selected.id, SIZE_STEP), Expand, false, undefined, 'Plus')}
									{@render bar(`Turn ${name} left`, () => designer.turn(selected.id, -TURN_STEP), RotateCcw, false, undefined, '[')}
									{@render bar(`Turn ${name} right`, () => designer.turn(selected.id, TURN_STEP), RotateCw, false, undefined, ']')}
									<div class="mx-0.5 hidden h-6 w-px bg-border sm:block" aria-hidden="true"></div>
									{@render bar(`Move ${name} up`, () => designer.move(selected.id, 'up'), ArrowUp, designer.doc.layers.at(-1)?.id === selected.id)}
									{@render bar(`Move ${name} down`, () => designer.move(selected.id, 'down'), ArrowDown, designer.doc.layers[0]?.id === selected.id)}
									{@render bar(`Delete ${name}`, () => (designer.remove(selected.id), announce('Deleted')), Trash2, false, undefined, 'Delete')}
								</div>
							</div>
							{#if softPhoto}
								<p class="text-xs text-muted-foreground" data-testid="customizer-soft-photo">
									This photo is {softPhoto.width} × {softPhoto.height} pixels and may print soft. A photo at least {setup.minPhotoPx} pixels on its shorter
									side prints sharp.
								</p>
							{/if}
						</div>
					{/if}
				</div>
			</div>

			<footer class="flex shrink-0 flex-col gap-2 border-t p-3 md:flex-row md:items-center md:justify-end">
				{#if status.state === 'error'}
					<p class="text-sm text-destructive md:mr-auto" role="alert" in:fly={{ y: 4 }}>{status.message}</p>
				{/if}
				<Button
					data-testid="customizer-add-to-bag"
					size="lg"
					class="edp-atc h-11 w-full gap-2 text-sm font-semibold md:w-auto md:min-w-72 {status.state === 'added'
						? 'bg-success text-success-foreground hover:bg-success'
						: ''}"
					disabled={empty || !designer.pictures || status.state === 'saving' || status.state === 'added'}
					aria-busy={status.state === 'saving'}
					onclick={addToBag}
				>
					{#key status.state}
						<span class="inline-flex items-center gap-2" in:fade>
							{#if status.state === 'saving'}
								<Spinner label="Saving your design" />
								<span>Saving your design…</span>
							{:else if status.state === 'added'}
								<Check class="motion-pop-in h-4 w-4" aria-hidden="true" />
								<span>Added</span>
							{:else}
								<ShoppingBag class="h-4 w-4" aria-hidden="true" />
								<span>Add to bag</span>
								{#if price}
									<span class="tabular-nums" aria-hidden="true">· {price}</span>
									<span class="sr-only">for {price}</span>
								{/if}
							{/if}
						</span>
					{/key}
				</Button>
			</footer>

			<p class="sr-only" aria-live="polite">{announcement}</p>
		</DialogPrimitive.Content>
	</DialogPrimitive.Portal>
</DialogPrimitive.Root>
