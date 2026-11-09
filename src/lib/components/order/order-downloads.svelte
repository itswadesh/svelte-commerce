<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import Spinner from '$lib/components/common/spinner.svelte'
	import { fade } from '$lib/motion'
	import { orderService } from '$lib/core/services/index.js'
	import { Download, FileText } from '@lucide/svelte'

	/**
	 * The files a paid order bought (GoCommerce D254). A link is made when the button is pressed,
	 * because it lasts minutes: a page left open overnight still downloads in the morning. When the
	 * store has closed a file the row says why and what to do, instead of a button that fails.
	 */
	type OrderFile = {
		id: string
		title: string
		filename: string
		size: number
		downloads: number
		limit: number | null
		expiresAt: string | null
		status: 'ready' | 'expired' | 'used_up' | 'revoked'
	}
	let { downloads = [], orderNo = '' }: { downloads?: OrderFile[] | null; orderNo?: string } = $props()

	let busy = $state('')
	let errors = $state<Record<string, string>>({})
	let closed = $state<Record<string, OrderFile['status']>>({})
	const canLink = typeof (orderService as any)?.downloadLink === 'function'

	const CLOSED: Record<string, string> = {
		expired: 'The time to download this file has run out. Contact the store for another chance.',
		used_up: 'This file has been downloaded as many times as the store allows. Contact the store for another chance.',
		revoked: 'This file is no longer available for this order. Contact the store if you think that is wrong.'
	}
	const CODES: Record<string, OrderFile['status']> = {
		download_expired: 'expired',
		download_limit_reached: 'used_up',
		download_revoked: 'revoked'
	}

	function size(bytes: number) {
		if (bytes >= 1 << 20) return `${(bytes / (1 << 20)).toFixed(1)} MB`
		if (bytes >= 1 << 10) return `${Math.round(bytes / (1 << 10))} KB`
		return `${bytes} bytes`
	}

	function left(d: OrderFile) {
		const parts = []
		if (d.limit) parts.push(`${Math.max(0, d.limit - d.downloads)} of ${d.limit} downloads left`)
		if (d.expiresAt) parts.push(`until ${new Date(d.expiresAt).toLocaleDateString()}`)
		return parts.join(', ')
	}

	async function download(d: OrderFile) {
		if (busy) return
		busy = d.id
		errors = { ...errors, [d.id]: '' }
		try {
			const { url } = await (orderService as any).downloadLink({ orderNo, id: d.id })
			location.href = url
		} catch (err) {
			const code = (err as { code?: string })?.code ?? ''
			if (CODES[code]) closed = { ...closed, [d.id]: CODES[code] }
			else errors = { ...errors, [d.id]: (err as { message?: string })?.message || 'The download could not start. Please try again.' }
		} finally {
			busy = ''
		}
	}
</script>

{#if downloads?.length}
	<section class="rounded-md border border-border bg-background p-4 sm:p-6" aria-labelledby="order-downloads" data-testid="order-downloads">
		<h3 id="order-downloads" class="mb-3 flex items-center gap-2 font-semibold text-foreground">
			<Download class="size-4 text-primary" aria-hidden="true" />
			{downloads.length === 1 ? 'Your download' : 'Your downloads'}
		</h3>
		<ul class="divide-y divide-border">
			{#each downloads as d (d.id)}
				{@const status = closed[d.id] ?? d.status}
				<li class="flex flex-wrap items-center justify-between gap-3 py-3">
					<div class="flex min-w-0 items-start gap-3">
						<FileText class="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
						<div class="min-w-0">
							<p class="break-all font-medium text-foreground">{d.filename}</p>
							<p class="text-sm text-muted-foreground">
								{d.title} · {size(d.size)}{#if status === 'ready' && left(d)}<span> · {left(d)}</span>{/if}
							</p>
						</div>
					</div>
					{#if status === 'ready' && canLink}
						<Button
							class="h-11 shrink-0 gap-2 transition-transform duration-150 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100"
							disabled={!!busy}
							aria-busy={busy === d.id}
							onclick={() => download(d)}
							aria-label="Download {d.filename}"
						>
							{#if busy === d.id}
								<span class="flex items-center gap-2" in:fade><Spinner label="Preparing your download" /> Preparing…</span>
							{:else}
								<span class="flex items-center gap-2" in:fade><Download class="size-4" aria-hidden="true" /> Download</span>
							{/if}
						</Button>
					{/if}
					{#if status !== 'ready'}
						<p class="w-full text-sm text-destructive" role="alert" in:fade>{CLOSED[status]}</p>
					{:else if errors[d.id]}
						<p class="w-full text-sm text-destructive" role="alert" in:fade>{errors[d.id]}</p>
					{/if}
				</li>
			{/each}
		</ul>
	</section>
{/if}
