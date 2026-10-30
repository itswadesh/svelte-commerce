<script lang="ts">
	import { Check, Loader } from '@lucide/svelte'
	import Paragraphs from '../Paragraphs.svelte'
	import { text, type ComposerSection } from '../helpers.js'

	/**
	 * An email box that adds the shopper to the store's newsletter (ext/newsletter). The engine sends
	 * this section only while the newsletter is on, so the box never posts nowhere. Subscribing twice
	 * is not an error there, so the answer says the same either way.
	 *
	 * `subscribe` is the connector's newsletter service unless a caller passes its own (the tests).
	 */
	type Subscribe = (input: { email: string; source?: string }) => Promise<unknown>
	let { section, subscribe }: { section: ComposerSection; subscribe?: Subscribe } = $props()

	const s = $derived(section.settings ?? {})
	const heading = $derived(text(s, 'heading'))
	const button = $derived(text(s, 'button_text') || 'Subscribe')
	const thanks = $derived(text(s, 'success_text') || "You're on the list.")
	const fieldId = $derived(`cmp-news-${section.id}`)

	let email = $state('')
	let status = $state<'idle' | 'sending' | 'done' | 'error'>('idle')
	let message = $state('')

	async function connectorSubscribe(input: { email: string; source?: string }) {
		const { services } = await import('kitcommerce.config')
		// Reflect.get, as for the layout service: a connector without the service fails the call,
		// not the page.
		const svc = Reflect.get(services as object, 'newsletterService') as { subscribe?: Subscribe } | undefined
		if (!svc?.subscribe) throw new Error('Signing up is not available on this store.')
		return svc.subscribe(input)
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault()
		if (status === 'sending') return
		status = 'sending'
		message = ''
		try {
			await (subscribe ?? connectorSubscribe)({ email: email.trim(), source: 'home' })
			status = 'done'
		} catch (err) {
			status = 'error'
			message = (err as { message?: string } | null)?.message || "That didn't go through. Try again."
		}
	}
</script>

<section class="cmp-band">
	<div class="page-width">
		<div class="cmp-news bg-card">
			{#if heading}<h2 class="cmp-head__title">{heading}</h2>{/if}
			<Paragraphs value={s.text} class="cmp-copy" />
			{#if status === 'done'}
				<p class="cmp-news__done" role="status"><Check aria-hidden="true" />{thanks}</p>
			{:else}
				<form class="cmp-news__form" onsubmit={submit}>
					<label class="sr-only" for={fieldId}>Email address</label>
					<input
						id={fieldId}
						class="cmp-news__input"
						type="email"
						name="email"
						autocomplete="email"
						inputmode="email"
						placeholder="Email address"
						required
						bind:value={email}
						aria-invalid={status === 'error' ? 'true' : undefined}
						aria-describedby={status === 'error' ? `${fieldId}-error` : undefined}
					/>
					<button class="cmp-news__button" type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'}>
						{#if status === 'sending'}<Loader class="cmp-news__spin" aria-hidden="true" />{/if}
						{button}
					</button>
				</form>
				<p id="{fieldId}-error" class="cmp-news__error" aria-live="polite">{status === 'error' ? message : ''}</p>
			{/if}
		</div>
	</div>
</section>

<style>
	.cmp-news {
		display: grid;
		gap: 12px;
		justify-items: center;
		max-width: 40rem;
		margin-inline: auto;
		padding: clamp(20px, 4vw, 40px);
		border: 1px solid hsl(var(--border));
		border-radius: var(--radius, 0.5rem);
		text-align: center;
	}

	.cmp-news__form {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		width: 100%;
		max-width: 28rem;
	}

	.cmp-news__input {
		flex: 1 1 200px;
		min-width: 0;
		min-height: 44px;
		padding: 0 14px;
		border: 1px solid hsl(var(--input));
		border-radius: var(--radius, 0.5rem);
		background: hsl(var(--background));
		color: hsl(var(--foreground));
		font-size: 1rem;
		transition: border-color var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	.cmp-news__input:focus {
		border-color: hsl(var(--foreground));
	}

	.cmp-news__input[aria-invalid='true'] {
		border-color: hsl(var(--destructive));
	}

	.cmp-news__button {
		display: inline-flex;
		flex: 1 0 auto;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 44px;
		padding: 0 22px;
		border-radius: var(--radius, 0.5rem);
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
		font-size: 0.8rem;
		font-weight: 600;
		transition:
			transform var(--motion-fast, 150ms) var(--motion-ease, ease-out),
			opacity var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	@media (min-width: 480px) {
		.cmp-news__button {
			flex: 0 0 auto;
		}
	}

	.cmp-news__button:hover {
		opacity: 0.9;
	}

	.cmp-news__button:active {
		transform: scale(0.98);
	}

	.cmp-news__button:disabled {
		opacity: 0.7;
		cursor: progress;
	}

	.cmp-news__button :global(.cmp-news__spin) {
		width: 16px;
		height: 16px;
		animation: cmp-spin 900ms linear infinite;
	}

	@keyframes cmp-spin {
		to {
			transform: rotate(360deg);
		}
	}

	.cmp-news__done {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin: 0;
		font-weight: 600;
		animation: cmp-rise 200ms var(--motion-ease, ease-out);
	}

	.cmp-news__done :global(svg) {
		width: 18px;
		height: 18px;
		color: hsl(var(--success, var(--foreground)));
	}

	@keyframes cmp-rise {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}

	.cmp-news__error {
		min-height: 1.25em;
		margin: 0;
		color: hsl(var(--destructive));
		font-size: 0.875rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.cmp-news__button:active {
			transform: none;
		}
		.cmp-news__button :global(.cmp-news__spin) {
			animation: none;
		}
		.cmp-news__done {
			animation: none;
		}
	}
</style>
