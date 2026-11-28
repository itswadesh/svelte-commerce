<script lang="ts">
	import { onMount, tick } from 'svelte'
	import * as Dialog from '$lib/components/ui/dialog'
	import { Button } from '$lib/components/ui/button'
	import { Label } from '$lib/components/ui/label'
	import { Textarea } from '$lib/components/ui/textarea'
	import Spinner from '$lib/components/common/spinner.svelte'
	import { fade } from '$lib/motion'
	import { orderService } from '$lib/core/services/index.js'
	import { Ban, Clock, XCircle } from '@lucide/svelte'
	import { cancelView, keptOrderToken, sentence, type CancelView } from './order-cancel'

	/**
	 * Cancel an order before it ships (GoCommerce D366). The engine decides everything: whether the
	 * button belongs here (`cancellable`), what happened to a request (`cancellation`), and why a
	 * cancel is refused, which is a sentence worth showing as it is.
	 *
	 * ponytail: connector 0.55 drops `cancellable` and `cancellation` from its order and has no cancel
	 * call, so this reads and posts the engine's own order through the connector's request method
	 * (which keeps the /backend proxy, the store header and the sign-in). It costs one more read of
	 * the order. When the connector maps the fields and adds `cancelOrder`, move this onto them.
	 */
	let { order, class: klass = '', onchange }: { order: { orderNo: string }; class?: string; onchange?: (order: any) => void } = $props()

	type Engine = { data: (path: string, req?: Record<string, unknown>) => Promise<any> }
	const engine = orderService as unknown as Partial<Engine>
	const reaches = typeof engine?.data === 'function'

	let view = $state<CancelView | null>(null)
	let reasonRequired = $state(false)
	let open = $state(false)
	let reason = $state('')
	let busy = $state(false)
	let error = $state('')
	let tried = $state(false)
	let statusEl = $state<HTMLElement | null>(null)

	const number = $derived(String(order?.orderNo ?? ''))
	const enc = $derived(encodeURIComponent(number))

	// A guest holds the order by its access token, the key in the emailed link, which the connector
	// keeps for every order this browser opened; without one the order is the signed-in account's.
	async function read() {
		const token = keptOrderToken(number)
		return token ? engine.data!(`/api/orders/${enc}`, { query: { token } }) : engine.data!(`/x/identity/me/orders/${enc}`, { auth: true })
	}

	onMount(async () => {
		if (!reaches || !number) return
		try {
			view = cancelView(await read())
		} catch {
			return
		}
		if (!view.cancellable) return
		try {
			const plugins = ((await engine.data!('/api/plugins')) ?? []) as { key: string; settings?: Record<string, unknown> }[]
			const v = plugins.find((p) => p.key === 'cancellations')?.settings?.reason_required
			reasonRequired = v === true || v === 'true'
		} catch {
			// The engine checks the reason too; the form only asks for it up front.
		}
	})

	const missing = $derived(reasonRequired && !reason.trim())

	async function submit(e: SubmitEvent) {
		e.preventDefault()
		tried = true
		if (busy || missing) return
		busy = true
		error = ''
		const token = keptOrderToken(number)
		try {
			const raw = token
				? await engine.data!(`/api/orders/${enc}/cancel`, { method: 'POST', body: { token, reason: reason.trim() } })
				: await engine.data!(`/x/identity/me/orders/${enc}/cancel`, { method: 'POST', body: { reason: reason.trim() }, auth: true })
			view = cancelView(raw)
			open = false
			// The page's own copy of the order, status and all, read the way it first read it.
			if (onchange) orderService.getOrder(number).then(onchange, () => {})
		} catch (err) {
			const status = (err as { status?: number })?.status
			error =
				status === 404
					? 'This order could not be found. Open it again from the link in your order email.'
					: sentence((err as { message?: string })?.message) || 'The order could not be cancelled. Please try again.'
			// A refusal means the order moved on; the button should go with it.
			if (status === 409)
				read().then(
					(r) => (view = cancelView(r)),
					() => {}
				)
		} finally {
			busy = false
		}
	}

	const note = $derived(sentence(view?.cancellation?.note).replace(/[.!?]+$/, ''))
</script>

{#if view && (view.cancellable || view.cancellation)}
	<section class="text-sm {klass}" aria-label="Cancel order" data-testid="order-cancel">
		{#if view.cancellation?.status === 'pending'}
			<p bind:this={statusEl} tabindex="-1" class="flex items-start gap-2 text-foreground outline-none" role="status" in:fade>
				<Clock class="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
				<span>Cancellation requested. The store will review it.</span>
			</p>
		{:else if view.cancellation?.status === 'approved'}
			<div bind:this={statusEl} tabindex="-1" class="space-y-1 outline-none" role="status" in:fade>
				<p class="flex items-start gap-2 font-medium text-foreground">
					<Ban class="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
					<span>This order is cancelled.</span>
				</p>
				{#if view.prepaid}
					<p class="pl-6 text-muted-foreground">
						A refund to your original payment method has been started. It usually reaches your account in 5–7 working days.
					</p>
				{:else if view.paidDirect}
					<p class="pl-6 text-muted-foreground">The store will refund your UPI payment to you directly.</p>
				{/if}
			</div>
		{:else if view.cancellation?.status === 'rejected'}
			<p bind:this={statusEl} tabindex="-1" class="flex items-start gap-2 text-foreground outline-none" role="status" in:fade>
				<XCircle class="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
				<span>The store declined the cancellation{note ? `: ${note}` : ''}. Your order goes ahead.</span>
			</p>
		{:else if view.cancellable}
			<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" in:fade>
				<p class="text-muted-foreground">Changed your mind? You can cancel this order until it ships.</p>
				<Button
					variant="outline"
					class="h-11 w-full shrink-0 transition-transform duration-150 hover:border-destructive hover:text-destructive active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 sm:w-auto"
					onclick={() => {
						open = true
						error = ''
						tried = false
					}}
					data-testid="order-cancel-open"
				>
					Cancel order
				</Button>
			</div>
		{/if}
	</section>
{/if}

<Dialog.Root bind:open>
	<Dialog.Content
		class="w-[calc(100%-2rem)] rounded-lg sm:max-w-md"
		interactOutsideBehavior={busy ? 'ignore' : 'close'}
		escapeKeydownBehavior={busy ? 'ignore' : 'close'}
		onCloseAutoFocus={(e) => {
			// The button that opened this is gone once the order is cancelled; the outcome takes focus.
			if (!view?.cancellable) {
				e.preventDefault()
				tick().then(() => statusEl?.focus())
			}
		}}
	>
		<form class="grid gap-4" onsubmit={submit} novalidate>
			<Dialog.Header class="pr-8 text-left">
				<Dialog.Title>Cancel order #{number}?</Dialog.Title>
				<Dialog.Description>The store is told at once. Once it has shipped, an order can no longer be cancelled.</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-1.5">
				<Label for="cancel-reason">Reason {reasonRequired ? '' : '(optional)'}</Label>
				<Textarea
					id="cancel-reason"
					bind:value={reason}
					rows={3}
					maxlength={500}
					required={reasonRequired}
					aria-invalid={tried && missing ? 'true' : undefined}
					aria-describedby={tried && missing ? 'cancel-reason-error' : undefined}
					placeholder="For example: ordered the wrong size"
				/>
				{#if tried && missing}
					<p id="cancel-reason-error" class="text-xs text-destructive" in:fade>Please say why you are cancelling.</p>
				{/if}
			</div>
			{#if error}
				<p class="text-sm text-destructive" role="alert" in:fade>{error}</p>
			{/if}
			<Dialog.Footer class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
				<Button
					type="button"
					variant="outline"
					class="h-11 transition-transform duration-150 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
					disabled={busy}
					onclick={() => (open = false)}
				>
					Keep order
				</Button>
				<Button
					type="submit"
					variant="destructive"
					class="h-11 transition-transform duration-150 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
					disabled={busy}
					aria-busy={busy}
					data-testid="order-cancel-submit"
				>
					{#if busy}<Spinner />{/if}
					{busy ? 'Cancelling…' : 'Cancel order'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
