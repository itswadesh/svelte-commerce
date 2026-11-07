<script lang="ts">
	import { onMount, tick } from 'svelte'
	import { fly, fade } from '$lib/motion'
	import { MessageCircle, X, Send, Sparkles, ShoppingCart, Check } from '@lucide/svelte'
	import { toast } from 'svelte-sonner'
	import { getCartState } from '$lib/core/stores/index.js'
	import { formatPrice } from '$lib/utils/price'
	import { historyFor, MAX_MESSAGE_LENGTH, type Line } from './shop-assistant-history'

	/**
	 * The store's shopping assistant (GoCommerce ext/shop-assistant). Draws nothing unless the engine
	 * says the store has switched it on. The conversation lives here and nowhere else: the engine
	 * stores none of it. Every word of a reply is drawn as text, never as markup, and the only links
	 * are the ones this file builds from what the catalogue sent.
	 */
	type Card = {
		productId: number
		slug: string
		title: string
		image: string | null
		price: number
		compareAtPrice: number | null
		currency: string
		variantId: number | null
	}
	type Faq = { id: number; question: string; answer: string }
	type Reply = { reply: string; products: Card[]; closest: boolean; faqs: Faq[]; handover: boolean }
	type Service = { enabled?: () => Promise<boolean>; turn?: (messages: Line[]) => Promise<Reply> }
	type Entry = Line & { failed?: boolean; answer?: Reply }

	let enabled = $state(false)
	let open = $state(false)
	let input = $state('')
	let loading = $state(false)
	let entries = $state<Entry[]>([])
	let adding = $state<number | null>(null)
	let added = $state<number | null>(null)
	let listEl = $state<HTMLDivElement | null>(null)
	let inputEl = $state<HTMLInputElement | null>(null)
	let launcherEl = $state<HTMLButtonElement | null>(null)

	const cartState = getCartState()

	// Reflect.get, as for the showcases: a connector without the service shows nothing.
	async function service() {
		const { services } = await import('kitcommerce.config')
		return Reflect.get(services as object, 'shopAssistantService') as Service | undefined
	}

	onMount(() => {
		service()
			.then((s) => s?.enabled?.())
			.then((on) => (enabled = on === true))
			.catch(() => (enabled = false))
	})

	async function scrollToEnd() {
		await tick()
		if (listEl) listEl.scrollTop = listEl.scrollHeight
	}

	async function toggle() {
		open = !open
		await tick()
		if (open) inputEl?.focus()
		else launcherEl?.focus()
	}

	async function send() {
		const text = input.trim()
		if (!text || loading) return
		input = ''
		entries = [...entries, { role: 'user', text }]
		loading = true
		scrollToEnd()
		try {
			const s = await service()
			if (!s?.turn) throw new Error('no assistant')
			const answer = await s.turn(historyFor(entries))
			entries = [...entries, { role: 'assistant', text: answer.reply, answer }]
		} catch (e) {
			// The engine's refusals are written for a shopper; anything else is not.
			const said = (e as { status?: number; message?: string })?.status ? (e as Error).message : ''
			entries = [
				...entries,
				{ role: 'assistant', failed: true, text: said || 'Sorry, that did not go through. Please try again.' }
			]
		} finally {
			loading = false
			scrollToEnd()
		}
	}

	async function addToCart(card: Card) {
		if (!card.variantId || adding) return
		if (!cartState) {
			toast.error('Could not add to cart. Please open the product page.')
			return
		}
		adding = card.productId
		try {
			await cartState.add({ productId: String(card.productId), variantId: String(card.variantId), qty: 1 })
			added = card.productId
			toast.success('Added to cart')
			setTimeout(() => {
				if (added === card.productId) added = null
			}, 1500)
		} catch {
			toast.error('Could not add to cart. Please open the product page.')
		} finally {
			adding = null
		}
	}

	const press =
		'transition-[transform,opacity,background-color] duration-[var(--motion-fast)] [transition-timing-function:var(--motion-ease)] hover:opacity-90 active:opacity-75 motion-safe:active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50'
</script>

<svelte:window
	onkeydown={(e) => {
		if (open && e.key === 'Escape') toggle()
	}}
/>

{#if enabled}
	<button
		bind:this={launcherEl}
		type="button"
		onclick={toggle}
		class="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-z-10 md:bottom-5 md:right-5 motion-safe:hover:-translate-y-0.5 {press}"
		aria-label={open ? 'Close shopping assistant' : 'Open shopping assistant'}
		aria-expanded={open}
	>
		{#if open}
			<X class="h-6 w-6" aria-hidden="true" />
		{:else}
			<MessageCircle class="h-6 w-6" aria-hidden="true" />
		{/if}
	</button>
{/if}

{#if enabled && open}
	<button
		type="button"
		tabindex="-1"
		class="fixed inset-0 z-40 bg-black/30 md:hidden"
		aria-label="Close shopping assistant"
		onclick={toggle}
		transition:fade
	></button>

	<div
		class="fixed bottom-0 right-0 z-50 flex h-[85dvh] w-full flex-col overflow-hidden rounded-t-radius border border-border bg-card text-card-foreground shadow-z-10 md:bottom-24 md:right-5 md:h-[600px] md:w-[400px] md:rounded-radius"
		role="dialog"
		aria-label="Shopping assistant"
		data-testid="shop-assistant"
		transition:fly={{ y: 24 }}
	>
		<header class="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
			<div class="flex min-w-0 items-center gap-2">
				<Sparkles class="h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
				<h2 class="font-heading text-sm font-semibold leading-tight">Shopping assistant</h2>
			</div>
			<button
				type="button"
				onclick={toggle}
				class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted {press}"
				aria-label="Close"
			>
				<X class="h-5 w-5" aria-hidden="true" />
			</button>
		</header>

		<div
			bind:this={listEl}
			class="flex-1 space-y-3 overflow-y-auto overflow-x-hidden px-4 py-4"
			role="log"
			aria-live="polite"
			aria-label="Conversation"
		>
			{#if entries.length === 0}
				<p class="text-sm text-muted-foreground">
					Tell me what you are looking for, or ask a question about this shop.
				</p>
			{/if}

			{#each entries as entry, i (i)}
				<div
					class="flex {entry.role === 'user' ? 'justify-end' : 'justify-start'}"
					in:fly={{ y: 8 }}
				>
					<div
						class="max-w-[85%] whitespace-pre-line break-words rounded-radius px-3 py-2 text-sm {entry.role === 'user'
							? 'bg-primary text-primary-foreground'
							: entry.failed
								? 'bg-destructive/10 text-foreground'
								: 'bg-muted text-foreground'}"
					>
						{entry.text}
					</div>
				</div>

				{#if entry.answer?.closest && entry.answer.products.length}
					<p class="text-xxs text-muted-foreground">Closest matches, not everything you asked for:</p>
				{/if}

				{#each entry.answer?.products ?? [] as card (card.productId)}
					<article class="flex gap-3 rounded-radius border border-border bg-background p-3" in:fly={{ y: 8 }}>
						{#if card.image}
							<img
								src={card.image}
								alt=""
								width="80"
								height="80"
								class="h-20 w-20 flex-shrink-0 rounded object-cover"
								loading="lazy"
							/>
						{/if}
						<div class="min-w-0 flex-1">
							<h3 class="line-clamp-2 break-words text-sm font-medium">{card.title}</h3>
							<p class="mt-0.5 text-sm font-semibold">
								{formatPrice(card.price, card.currency)}
								{#if card.compareAtPrice && card.compareAtPrice > card.price}
									<s class="ml-1 text-xs font-normal text-muted-foreground">
										{formatPrice(card.compareAtPrice, card.currency)}
									</s>
								{/if}
							</p>
							<div class="mt-2 flex flex-wrap gap-2">
								{#if card.variantId}
									<button
										type="button"
										class="inline-flex min-h-11 items-center gap-1 rounded bg-primary px-3 text-xs font-medium text-primary-foreground {press}"
										onclick={() => addToCart(card)}
										disabled={adding === card.productId}
									>
										{#if added === card.productId}
											<Check class="h-4 w-4" aria-hidden="true" /> Added
										{:else}
											<ShoppingCart class="h-4 w-4" aria-hidden="true" />
											{adding === card.productId ? 'Adding…' : 'Add to cart'}
										{/if}
									</button>
								{/if}
								<a
									href={`/products/${encodeURIComponent(card.slug)}`}
									class="inline-flex min-h-11 items-center rounded border border-border px-3 text-xs font-medium hover:bg-muted {press}"
									aria-label={`View ${card.title}`}
								>
									{card.variantId ? 'View' : 'Choose options'}
								</a>
							</div>
						</div>
					</article>
				{/each}

				{#each entry.answer?.faqs ?? [] as faq (faq.id)}
					<article class="rounded-radius border border-border bg-background p-3" in:fly={{ y: 8 }}>
						<h3 class="break-words text-sm font-medium">{faq.question}</h3>
						<p class="mt-1 whitespace-pre-line break-words text-sm text-muted-foreground">{faq.answer}</p>
					</article>
				{/each}

				{#if entry.answer?.handover}
					<a
						href="/contact"
						class="inline-flex min-h-11 items-center rounded border border-border px-3 text-xs font-medium hover:bg-muted {press}"
					>
						Contact the shop
					</a>
				{/if}
			{/each}

			{#if loading}
				<div class="flex justify-start" in:fade>
					<div class="flex gap-1 rounded-radius bg-muted px-3 py-3" role="status" aria-label="Thinking">
						<span class="h-1.5 w-1.5 rounded-full bg-muted-foreground motion-safe:animate-bounce"></span>
						<span class="h-1.5 w-1.5 rounded-full bg-muted-foreground motion-safe:animate-bounce [animation-delay:150ms]"></span>
						<span class="h-1.5 w-1.5 rounded-full bg-muted-foreground motion-safe:animate-bounce [animation-delay:300ms]"></span>
					</div>
				</div>
			{/if}
		</div>

		<form
			class="flex items-center gap-2 border-t border-border p-3"
			onsubmit={(e) => {
				e.preventDefault()
				send()
			}}
		>
			<label class="sr-only" for="shop-assistant-input">Message the shopping assistant</label>
			<input
				id="shop-assistant-input"
				bind:this={inputEl}
				bind:value={input}
				maxlength={MAX_MESSAGE_LENGTH}
				placeholder="What are you looking for?"
				class="h-11 min-w-0 flex-1 rounded-radius border border-border bg-background px-3 text-base transition-colors duration-[var(--motion-fast)] focus-visible:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary"
				autocomplete="off"
			/>
			<button
				type="submit"
				class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-radius bg-primary text-primary-foreground {press}"
				aria-label="Send"
				disabled={loading || !input.trim()}
			>
				<Send class="h-4 w-4" aria-hidden="true" />
			</button>
		</form>

		<p class="px-4 pb-3 text-center text-xxs text-muted-foreground">
			Answers come from AI and can be wrong. What you type goes to an AI provider, so please leave out personal
			details.
		</p>
	</div>
{/if}
