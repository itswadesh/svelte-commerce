<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Label } from '$lib/components/ui/label'
	import { Textarea } from '$lib/components/ui/textarea'
	import Spinner from '$lib/components/common/spinner.svelte'
	import { fade, slide } from '$lib/motion'
	import { date } from '$lib/core/utils'
	import { orderService } from '$lib/core/services/index.js'
	import { Camera, CheckCircle2, RefreshCw, X } from '@lucide/svelte'

	/**
	 * Replacement requests (GoCommerce D335). In a store that takes them, a signed-in shopper asks from
	 * a delivered order, until the store's window closes: which items, what is wrong, and photos. The
	 * engine decides everything — the window, what can still be asked for, whether a photo is needed —
	 * and its refusal is a sentence worth showing as it is. This replaces the Litekart-era "Exchange or
	 * return" button, which read a field nothing sends and linked to a page that never existed.
	 */
	type Request = {
		id: string
		kind: 'replacement' | 'return'
		status: 'pending' | 'approved' | 'rejected'
		lines: { lineId: string; qty: number; title: string }[]
		description: string
		photos: string[]
		rejectReason: string | null
		replacementOrderNo: string | null
		pickupStatus: string | null
		/** Connector 0.54: a return the store has recorded back. Absent on older connectors. */
		returned?: boolean
		createdAt: string
	}
	type Offer = {
		openUntil: string | null
		photoRequired: boolean
		replacementOnly: boolean
		maxPhotos: number
		requests: Request[]
	}
	type Line = { id: string; title: string; qty: number }
	let { order }: { order: { orderNo: string; lineItems?: Line[]; replacement?: Offer | null } } = $props()

	const MAX_BYTES = 8 * 1024 * 1024
	const TYPES = ['image/jpeg', 'image/png', 'image/webp']
	const canAsk = typeof (orderService as any)?.requestReplacement === 'function'

	let requests = $state<Request[]>([])
	$effect.pre(() => {
		requests = order?.replacement?.requests ?? []
	})
	const offer = $derived(order?.replacement ?? null)

	// What each line can still be asked about: its quantity less what requests still standing asked for.
	const left = $derived.by(() => {
		const asked: Record<string, number> = {}
		for (const r of requests) {
			if (r.status === 'rejected') continue
			for (const l of r.lines) asked[l.lineId] = (asked[l.lineId] ?? 0) + l.qty
		}
		return (order?.lineItems ?? []).map((l) => ({ ...l, left: Math.max(0, l.qty - (asked[l.id] ?? 0)) }))
	})
	const open = $derived(canAsk && !!offer?.openUntil && left.some((l) => l.left > 0))

	let showing = $state(false)
	let chosen = $state<Record<string, number>>({})
	let kind = $state<'replacement' | 'return'>('replacement')
	let description = $state('')
	let photos = $state<{ file: File; url: string }[]>([])
	let busy = $state(false)
	let error = $state('')
	let sentNow = $state('')

	function toggle(id: string, on: boolean) {
		const next = { ...chosen }
		if (on) next[id] = 1
		else delete next[id]
		chosen = next
	}

	function addPhotos(e: Event) {
		const input = e.currentTarget as HTMLInputElement
		error = ''
		for (const file of Array.from(input.files ?? [])) {
			if (photos.length >= (offer?.maxPhotos ?? 5)) {
				error = `You can add up to ${offer?.maxPhotos ?? 5} photos.`
				break
			}
			if (!TYPES.includes(file.type)) {
				error = 'Add photos as JPEG, PNG or WebP.'
				continue
			}
			if (file.size > MAX_BYTES) {
				error = 'Each photo can be at most 8 MB.'
				continue
			}
			photos = [...photos, { file, url: URL.createObjectURL(file) }]
		}
		input.value = ''
	}

	function removePhoto(i: number) {
		URL.revokeObjectURL(photos[i].url)
		photos = photos.filter((_, j) => j !== i)
	}

	async function submit(e: SubmitEvent) {
		e.preventDefault()
		if (busy) return
		const lines = Object.entries(chosen).map(([lineId, qty]) => ({ lineId, qty }))
		if (!lines.length) return void (error = 'Choose the item that needs replacing.')
		if (!description.trim()) return void (error = 'Describe what is wrong with the item.')
		if (offer?.photoRequired && !photos.length) return void (error = 'Add at least one photo of the item.')
		busy = true
		error = ''
		try {
			const made = await (orderService as any).requestReplacement({
				orderNo: order.orderNo,
				lines,
				description,
				photos: photos.map((p) => p.file),
				kind: offer?.replacementOnly ? 'replacement' : kind,
			})
			requests = [made, ...requests]
			for (const p of photos) URL.revokeObjectURL(p.url)
			photos = []
			chosen = {}
			description = ''
			showing = false
			sentNow = made.status === 'approved' ? 'Your request is approved.' : 'Your request is sent. The store will look at it soon.'
		} catch (err) {
			error = (err as { message?: string })?.message || 'The request could not be sent. Please try again.'
		} finally {
			busy = false
		}
	}

	const STATUS: Record<string, { label: string; cls: string }> = {
		pending: { label: 'Waiting for the store', cls: 'bg-warning/10 text-warning ring-warning/20' },
		approved: { label: 'Approved', cls: 'bg-success/10 text-success ring-success/20' },
		rejected: { label: 'Not approved', cls: 'bg-muted text-muted-foreground ring-border' },
	}

	function outcome(r: Request) {
		if (r.status === 'rejected') return r.rejectReason ? `The store said: ${r.rejectReason}` : ''
		if (r.status !== 'approved') return ''
		// The engine moves no money on a return; the refund is the store's to make (D355).
		if (r.returned) return 'The store has your item back and will be in touch about any refund.'
		const parts = []
		if (r.kind === 'replacement') {
			parts.push(r.replacementOrderNo ? `Your replacement is order ${r.replacementOrderNo}, at no cost.` : 'Your replacement order is being placed, at no cost.')
		}
		parts.push(
			r.pickupStatus === 'booked' || r.pickupStatus === 'queued'
				? 'A courier will collect the item from your delivery address.'
				: 'The store will arrange to collect the item from your delivery address.',
		)
		return parts.join(' ')
	}
</script>

{#if offer && (open || requests.length)}
	<section class="rounded-md border border-border bg-background p-4 text-left sm:p-6" aria-labelledby="replacement-heading" data-testid="replacement-request">
		<div class="flex items-start gap-3">
			<RefreshCw class="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
			<div class="min-w-0 flex-1">
				<h2 id="replacement-heading" class="text-base font-semibold text-foreground">
					{offer.replacementOnly ? 'Replacement' : 'Replacement or return'}
				</h2>
				{#if open}
					<p class="mt-1 text-sm text-muted-foreground">
						Item damaged or not as ordered? You can ask for a {offer.replacementOnly ? 'replacement' : 'replacement or a return'} until {date(offer.openUntil ?? '')}.
					</p>
				{/if}
			</div>
		</div>

		{#if sentNow}
			<p class="mt-4 flex items-center gap-2 text-sm font-medium text-success" role="status" in:fade>
				<CheckCircle2 class="size-4" aria-hidden="true" />{sentNow}
			</p>
		{/if}

		{#if requests.length}
			<ul class="mt-4 space-y-3">
				{#each requests as r (r.id)}
					<li class="rounded-md border border-border p-3 text-sm" in:slide>
						<div class="flex flex-wrap items-center justify-between gap-2">
							<span class="font-medium text-foreground">{r.lines.map((l) => `${l.qty} × ${l.title}`).join(', ')}</span>
							<span class="rounded-full px-2 py-0.5 text-xs font-semibold ring-1 {STATUS[r.status]?.cls}">{STATUS[r.status]?.label}</span>
						</div>
						<p class="mt-1 break-words text-muted-foreground">{r.description}</p>
						{#if outcome(r)}<p class="mt-2 text-foreground">{outcome(r)}</p>{/if}
					</li>
				{/each}
			</ul>
		{/if}

		{#if open}
			{#if !showing}
				<Button
					variant="secondary"
					class="mt-4 h-12 w-full gap-2 transition-transform duration-150 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
					onclick={() => {
						showing = true
						sentNow = ''
					}}
					data-testid="replacement-open"
				>
					<RefreshCw class="h-4 w-4" aria-hidden="true" />
					Ask for a {offer.replacementOnly ? 'replacement' : 'replacement or return'}
				</Button>
			{:else}
				<form class="mt-4 space-y-5" onsubmit={submit} transition:slide novalidate>
					<fieldset class="space-y-2">
						<legend class="mb-1 text-sm font-medium text-foreground">Which item?</legend>
						{#each left as l (l.id)}
							<div class="flex items-center gap-3 rounded-md border border-border p-3 transition-colors duration-150 has-[:checked]:border-primary motion-reduce:transition-none">
								<input
									id="replace-{l.id}"
									type="checkbox"
									class="size-5 accent-primary"
									disabled={l.left === 0}
									checked={!!chosen[l.id]}
									onchange={(e) => toggle(l.id, e.currentTarget.checked)}
								/>
								<label for="replace-{l.id}" class="min-w-0 flex-1 text-sm text-foreground" class:opacity-50={l.left === 0}>
									{l.title}
									{#if l.left === 0}<span class="block text-xs text-muted-foreground">Already asked for</span>{/if}
								</label>
								{#if chosen[l.id] && l.left > 1}
									<select
										aria-label="How many of {l.title}"
										class="h-10 rounded-md border border-border bg-background px-2 text-sm"
										value={chosen[l.id]}
										onchange={(e) => (chosen = { ...chosen, [l.id]: Number(e.currentTarget.value) })}
									>
										{#each Array.from({ length: l.left }, (_, i) => i + 1) as n}<option value={n}>{n}</option>{/each}
									</select>
								{/if}
							</div>
						{/each}
					</fieldset>

					{#if !offer.replacementOnly}
						<fieldset class="space-y-2">
							<legend class="mb-1 text-sm font-medium text-foreground">What would you like?</legend>
							<div class="flex flex-wrap gap-4 text-sm">
								<label class="flex items-center gap-2"><input type="radio" name="kind" value="replacement" bind:group={kind} class="size-4 accent-primary" /> A replacement</label>
								<label class="flex items-center gap-2"><input type="radio" name="kind" value="return" bind:group={kind} class="size-4 accent-primary" /> Return it</label>
							</div>
						</fieldset>
					{/if}

					<div class="space-y-2">
						<Label for="replace-description">What is wrong with it?</Label>
						<Textarea id="replace-description" bind:value={description} rows={4} maxlength={2000} placeholder="For example: the glass arrived cracked along one side." />
					</div>

					<div class="space-y-2">
						<span class="block text-sm font-medium text-foreground">
							Photos {offer.photoRequired ? '(at least one)' : '(optional)'}
						</span>
						{#if photos.length}
							<div class="flex flex-wrap gap-2">
								{#each photos as p, i (p.url)}
									<div class="relative" in:fade>
										<img src={p.url} alt="Photo {i + 1} you added" class="size-20 rounded-md border border-border object-cover" />
										<button
											type="button"
											class="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-150 hover:scale-110 active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100"
											aria-label="Remove photo {i + 1}"
											onclick={() => removePhoto(i)}
										>
											<X class="size-4" aria-hidden="true" />
										</button>
									</div>
								{/each}
							</div>
						{/if}
						{#if photos.length < offer.maxPhotos}
							<label
								class="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border text-sm font-medium text-foreground transition-colors duration-150 hover:bg-muted/40 focus-within:ring-2 focus-within:ring-primary motion-reduce:transition-none"
							>
								<Camera class="size-4" aria-hidden="true" />
								Add photos
								<input type="file" accept="image/jpeg,image/png,image/webp" multiple class="sr-only" onchange={addPhotos} data-testid="replacement-photos" />
							</label>
						{/if}
						<p class="text-xs text-muted-foreground">Up to {offer.maxPhotos} photos, JPEG, PNG or WebP, 8 MB each.</p>
					</div>

					{#if error}
						<p class="text-sm text-destructive" role="alert" in:fade>{error}</p>
					{/if}

					<div class="flex flex-col gap-2 sm:flex-row">
						<Button type="submit" class="h-12 flex-1 gap-2 transition-transform duration-150 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100" disabled={busy} data-testid="replacement-submit">
							{#if busy}<Spinner />{/if}
							Send request
						</Button>
						<Button type="button" variant="ghost" class="h-12" disabled={busy} onclick={() => ((showing = false), (error = ''))}>Cancel</Button>
					</div>
				</form>
			{/if}
		{/if}
	</section>
{/if}
