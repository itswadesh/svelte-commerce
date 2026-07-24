<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import { Truck, RotateCcw, ShieldCheck, Headset, ArrowRight, ArrowUpRight } from '@lucide/svelte'
	import { Skeleton } from '$lib/components/ui/skeleton/index.js'
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import { storeService } from '$lib/core/services'
	import { getUserState } from '$lib/core/stores/index.js'
	import { klaviyoIdentify, klaviyoSubscribe, resolveKlaviyoConfig } from '$lib/klaviyo'
	import { toast } from '@misiki/kitcommerce-core'
	import { z } from 'zod'
	import type { ThemeHomepageContent } from '$lib/theme/index.js'

	let {
		themeContent,
		brandName,
		storeName,
		aspectWidth,
		aspectHeight,
		featuredProducts,
		featuredCategories,
		loading = false
	}: {
		themeContent: ThemeHomepageContent
		brandName: string
		storeName?: string
		aspectWidth: string
		aspectHeight: string
		featuredProducts: any[]
		featuredCategories: any[]
		loading?: boolean
		currencyCode?: string
	} = $props()

	const ed = $derived(themeContent.editorial)
	const productAspect = $derived(`${aspectWidth || '4'} / ${aspectHeight || '5'}`)

	// Live categories take over the fallback tiles; capped at 4 for the balanced grid.
	const categoryTiles = $derived(
		featuredCategories?.length
			? featuredCategories.slice(0, 4).map((c: any) => ({
					label: c?.name || c?.title || 'Shop',
					href: c?.slug ? '/' + c.slug : c?.link || '/products',
					image: c?.image || c?.thumbnail || c?.img || ''
				}))
			: ed?.categories.tiles || []
	)

	const products = $derived((featuredProducts || []).slice(0, 8))

	const assuranceIcons = { truck: Truck, returns: RotateCcw, shield: ShieldCheck, support: Headset }

	let inView = $state(false)
	onMount(() => {
		inView = true
	})

	// Newsletter: subscribe to Litekart's list AND the store's Klaviyo list (same flow as the
	// footer). Both are no-ops when unconfigured; on success we confirm inline.
	const userState = getUserState()
	const klaviyoConfig = $derived(resolveKlaviyoConfig(page.data?.store?.plugins))
	let email = $state('')
	let subscribed = $state(false)
	let subscribing = $state(false)
	async function onSubscribe(e: Event) {
		e.preventDefault()
		const parsed = z.string().email().safeParse(email.trim())
		if (!parsed.success) {
			toast.error('Please enter a valid email address')
			return
		}
		subscribing = true
		try {
			await storeService.post('/api/newsletter/subscribe', {
				email: email.trim(),
				customerId: userState?.user?.userId || null
			})
			klaviyoIdentify({ email: email.trim() })
			klaviyoSubscribe(email.trim(), klaviyoConfig)
			subscribed = true
		} catch (err: any) {
			toast.error(err?.message || 'Subscription failed, please try again')
		} finally {
			subscribing = false
		}
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;0,6..96,700;1,6..96,400&family=Hanken+Grotesk:wght@400;500;600;700&display=swap"
	/>
</svelte:head>

{#if ed}
	<div class="ed" class:is-in={inView}>
		<!-- HERO -->
		<section class="ed-wrap ed-hero">
			<div class="ed-hero__body">
				<span class="ed-eyebrow">{ed.hero.eyebrow}</span>
				<h1 class="ed-display">
					{ed.hero.titleLead}
					<em>{ed.hero.titleAccent}</em>
				</h1>
				<p class="ed-hero__text">{ed.hero.text}</p>
				<div class="ed-hero__actions">
					<a class="ed-btn" href={ed.hero.primaryHref}>{ed.hero.primaryCta}</a>
					<a class="ed-link" href={ed.hero.secondaryHref}>
						{ed.hero.secondaryCta}
						<ArrowRight class="ed-link__icon" />
					</a>
				</div>
				{#if ed.hero.note}
					<p class="ed-hero__note">{ed.hero.note}</p>
				{/if}
			</div>
			<div class="ed-hero__media">
				<img src={ed.hero.image} alt={ed.hero.imageAlt} loading="eager" fetchpriority="high" />
			</div>
		</section>

		<!-- MARQUEE / assurance ribbon -->
		{#if ed.marquee?.length}
			<div class="ed-ribbon">
				<div class="ed-wrap ed-ribbon__row">
					{#each ed.marquee as item, i}
						{#if i > 0}<span class="ed-ribbon__dot" aria-hidden="true"></span>{/if}
						<span>{item}</span>
					{/each}
				</div>
			</div>
		{/if}

		<!-- CATEGORIES -->
		{#if categoryTiles.length}
			<section class="ed-wrap ed-section">
				<header class="ed-head">
					<div>
						<span class="ed-eyebrow">{ed.categories.eyebrow}</span>
						<h2 class="ed-display ed-head__title">{ed.categories.title}</h2>
					</div>
					<a class="ed-link" href={ed.categories.viewAllHref}>
						{ed.categories.viewAll}
						<ArrowRight class="ed-link__icon" />
					</a>
				</header>

				<div class="ed-cats">
					{#each categoryTiles as tile}
						<a class="ed-cat" href={tile.href}>
							<div class="ed-cat__media">
								{#if tile.image}
									<img src={tile.image} alt={tile.label} loading="lazy" />
								{:else}
									<div class="ed-cat__placeholder" aria-hidden="true"></div>
								{/if}
							</div>
							<span class="ed-cat__label">
								{tile.label}
								<ArrowUpRight class="ed-cat__icon" />
							</span>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<!-- FEATURED PRODUCTS -->
		<section class="ed-tint">
			<div class="ed-wrap ed-section">
				<header class="ed-head">
					<div>
						<span class="ed-eyebrow">{ed.featured.eyebrow}</span>
						<h2 class="ed-display ed-head__title">{ed.featured.title}</h2>
					</div>
					<a class="ed-link" href={ed.featured.viewAllHref}>
						{ed.featured.viewAll}
						<ArrowRight class="ed-link__icon" />
					</a>
				</header>

				{#if loading}
					<div class="ed-products">
						{#each Array(8) as _}
							<div class="ed-skel">
								<Skeleton class="ed-skel__img" />
								<Skeleton class="h-4 w-2/3 rounded" />
								<Skeleton class="h-4 w-1/3 rounded" />
							</div>
						{/each}
					</div>
				{:else if products.length}
					<div class="ed-products">
						{#each products as product (product.id || product.slug)}
							<ProductCard {product} aspectRatio={productAspect} />
						{/each}
					</div>
				{:else}
					<div class="ed-empty">
						<h3 class="ed-display">{themeContent.defaultHome.emptyTitle}</h3>
						<p>{themeContent.defaultHome.emptyText}</p>
						<a class="ed-btn" href="/products">Browse the catalogue</a>
					</div>
				{/if}
			</div>
		</section>

		<!-- EDITORIAL BANNER -->
		<section class="ed-wrap ed-banner">
			<div class="ed-banner__media">
				<img src={ed.banner.image} alt={ed.banner.imageAlt} loading="lazy" />
			</div>
			<div class="ed-banner__body">
				<span class="ed-eyebrow">{ed.banner.eyebrow}</span>
				<h2 class="ed-display ed-banner__title">{ed.banner.title}</h2>
				<p>{ed.banner.text}</p>
				<a class="ed-btn ed-btn--ghost" href={ed.banner.href}>{ed.banner.cta}</a>
			</div>
		</section>

		<!-- ASSURANCES -->
		<section class="ed-wrap">
			<div class="ed-assure">
				{#each ed.assurances as a}
					{@const Icon = assuranceIcons[a.icon]}
					<div class="ed-assure__item">
						<Icon class="ed-assure__icon" />
						<div>
							<p class="ed-assure__title">{a.title}</p>
							<p class="ed-assure__text">{a.text}</p>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- NEWSLETTER -->
		<section class="ed-tint">
			<div class="ed-wrap ed-news">
				<span class="ed-eyebrow">{ed.newsletter.eyebrow}</span>
				<h2 class="ed-display ed-news__title">{ed.newsletter.title}</h2>
				<p class="ed-news__text">{ed.newsletter.text}</p>
				{#if subscribed}
					<p class="ed-news__thanks">Thanks — you're on the list.</p>
				{:else}
					<form class="ed-news__form" onsubmit={onSubscribe}>
						<label class="sr-only" for="ed-news-email">Email address</label>
						<input id="ed-news-email" type="email" required placeholder="you@example.com" bind:value={email} />
						<button type="submit" disabled={subscribing}>{subscribing ? 'Subscribing…' : ed.newsletter.cta}</button>
					</form>
				{/if}
				<p class="ed-news__privacy">{ed.newsletter.privacy}</p>
			</div>
		</section>
	</div>
{/if}

<style>
	.ed {
		--ed-gutter: clamp(20px, 5vw, 48px);
		--ed-canvas: #f6f3ee;
		--ed-surface: #ffffff;
		--ed-ink: #1b1a17;
		--ed-soft: #736c60;
		--ed-line: rgba(27, 26, 23, 0.12);
		--ed-radius: 4px;
		--ed-display: 'Bodoni Moda', 'Times New Roman', serif;
		--ed-body: 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif;
		background: var(--ed-canvas);
		color: var(--ed-ink);
		font-family: var(--ed-body);
		-webkit-font-smoothing: antialiased;
	}

	.ed-wrap {
		width: min(1240px, 100% - 2 * var(--ed-gutter));
		margin-inline: auto;
	}

	.ed-section {
		padding-block: clamp(56px, 9vw, 120px);
	}

	.ed-display {
		font-family: var(--ed-display);
		font-weight: 500;
		letter-spacing: -0.01em;
	}

	.ed-eyebrow {
		display: inline-block;
		margin-bottom: 14px;
		color: var(--ed-soft);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	/* ---------- HERO ---------- */
	.ed-hero {
		display: grid;
		grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
		align-items: center;
		gap: clamp(28px, 5vw, 72px);
		padding-block: clamp(48px, 8vw, 104px);
	}

	.ed-hero__body {
		max-width: 34rem;
	}

	.ed-hero h1 {
		margin: 0;
		font-size: clamp(2.6rem, 5.6vw, 4.9rem);
		line-height: 1.02;
	}

	.ed-hero h1 em {
		font-style: italic;
		color: hsl(var(--primary));
	}

	.ed-hero__text {
		max-width: 42ch;
		margin: 22px 0 0;
		color: var(--ed-soft);
		font-size: 1.05rem;
		line-height: 1.7;
	}

	.ed-hero__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 14px 26px;
		margin-top: 34px;
	}

	.ed-hero__note {
		margin: 26px 0 0;
		color: var(--ed-soft);
		font-size: 0.82rem;
		letter-spacing: 0.01em;
	}

	.ed-hero__media {
		position: relative;
		overflow: hidden;
		border-radius: var(--ed-radius);
		aspect-ratio: 4 / 3.4;
		background: #eae5dd;
	}

	.ed-hero__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	/* ---------- BUTTONS / LINKS ---------- */
	.ed-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 52px;
		padding: 0 30px;
		border: 1px solid hsl(var(--primary));
		border-radius: var(--ed-radius);
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		transition:
			transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.25s ease;
	}

	.ed-btn:hover {
		transform: translateY(-2px);
		opacity: 0.92;
	}

	.ed-btn--ghost {
		background: transparent;
		border-color: var(--ed-ink);
		color: var(--ed-ink);
	}

	.ed-btn--ghost:hover {
		background: var(--ed-ink);
		color: var(--ed-canvas);
	}

	.ed-link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: var(--ed-ink);
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.ed-link :global(.ed-link__icon) {
		width: 16px;
		height: 16px;
		transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.ed-link:hover :global(.ed-link__icon) {
		transform: translateX(4px);
	}

	/* ---------- RIBBON ---------- */
	.ed-ribbon {
		border-block: 1px solid var(--ed-line);
		background: var(--ed-surface);
	}

	.ed-ribbon__row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 14px 22px;
		padding-block: 16px;
		color: var(--ed-soft);
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.ed-ribbon__dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: hsl(var(--primary));
	}

	/* ---------- SECTION HEADERS ---------- */
	.ed-head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 24px;
		margin-bottom: clamp(28px, 4vw, 52px);
	}

	.ed-head__title {
		margin: 0;
		font-size: clamp(2rem, 4vw, 3.2rem);
		line-height: 1.05;
	}

	.ed-tint {
		background: var(--ed-surface);
	}

	/* ---------- CATEGORY TILES ---------- */
	.ed-cats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: clamp(14px, 1.6vw, 22px);
	}

	.ed-cat {
		display: block;
		color: var(--ed-ink);
	}

	.ed-cat__media {
		overflow: hidden;
		border-radius: var(--ed-radius);
		aspect-ratio: 4 / 5;
		background: #eae5dd;
	}

	.ed-cat__media img,
	.ed-cat__placeholder {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.ed-cat__placeholder {
		background: linear-gradient(160deg, #efe9e0, #e3dcd1);
	}

	.ed-cat:hover .ed-cat__media img,
	.ed-cat:hover .ed-cat__placeholder {
		transform: scale(1.05);
	}

	.ed-cat__label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin-top: 14px;
		font-size: 0.95rem;
		font-weight: 600;
	}

	.ed-cat :global(.ed-cat__icon) {
		width: 16px;
		height: 16px;
		color: var(--ed-soft);
		transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.ed-cat:hover :global(.ed-cat__icon) {
		transform: translate(3px, -3px);
		color: hsl(var(--primary));
	}

	/* ---------- PRODUCTS ---------- */
	.ed-products {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: clamp(16px, 2vw, 28px);
	}

	.ed-skel {
		display: grid;
		gap: 10px;
	}

	.ed-skel :global(.ed-skel__img) {
		aspect-ratio: 4 / 5;
		width: 100%;
		border-radius: var(--ed-radius);
	}

	.ed-empty {
		display: grid;
		justify-items: center;
		gap: 14px;
		padding: clamp(48px, 8vw, 96px) 24px;
		border: 1px solid var(--ed-line);
		border-radius: var(--ed-radius);
		text-align: center;
	}

	.ed-empty h3 {
		margin: 0;
		font-size: 1.6rem;
	}

	.ed-empty p {
		max-width: 42ch;
		margin: 0;
		color: var(--ed-soft);
	}

	.ed-empty .ed-btn {
		margin-top: 8px;
	}

	/* ---------- EDITORIAL BANNER ---------- */
	.ed-banner {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-items: stretch;
		gap: clamp(24px, 4vw, 60px);
		margin-block: clamp(56px, 9vw, 120px);
	}

	.ed-banner__media {
		overflow: hidden;
		border-radius: var(--ed-radius);
		aspect-ratio: 5 / 4;
		background: #eae5dd;
	}

	.ed-banner__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.ed-banner__body {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		max-width: 34rem;
	}

	.ed-banner__title {
		margin: 0 0 18px;
		font-size: clamp(1.9rem, 3.6vw, 3rem);
		line-height: 1.06;
	}

	.ed-banner__body p {
		margin: 0 0 30px;
		max-width: 46ch;
		color: var(--ed-soft);
		font-size: 1.02rem;
		line-height: 1.7;
	}

	/* ---------- ASSURANCES ---------- */
	.ed-assure {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		border-block: 1px solid var(--ed-line);
	}

	.ed-assure__item {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 30px clamp(12px, 2vw, 26px);
	}

	.ed-assure__item + .ed-assure__item {
		border-left: 1px solid var(--ed-line);
	}

	.ed-assure :global(.ed-assure__icon) {
		width: 22px;
		height: 22px;
		flex: none;
		color: hsl(var(--primary));
		stroke-width: 1.5;
	}

	.ed-assure__title {
		margin: 0;
		font-size: 0.92rem;
		font-weight: 600;
	}

	.ed-assure__text {
		margin: 2px 0 0;
		color: var(--ed-soft);
		font-size: 0.82rem;
	}

	/* ---------- NEWSLETTER ---------- */
	.ed-news {
		max-width: 42rem;
		margin-inline: auto;
		padding-block: clamp(56px, 9vw, 116px);
		text-align: center;
	}

	.ed-news__title {
		margin: 0;
		font-size: clamp(2rem, 4vw, 3.1rem);
		line-height: 1.06;
	}

	.ed-news__text {
		max-width: 46ch;
		margin: 16px auto 0;
		color: var(--ed-soft);
		font-size: 1.02rem;
		line-height: 1.7;
	}

	.ed-news__form {
		display: flex;
		gap: 10px;
		max-width: 30rem;
		margin: 30px auto 0;
	}

	.ed-news__form input {
		flex: 1;
		min-width: 0;
		height: 52px;
		padding: 0 18px;
		border: 1px solid var(--ed-line);
		border-radius: var(--ed-radius);
		background: var(--ed-canvas);
		color: var(--ed-ink);
		font-family: inherit;
		font-size: 0.95rem;
	}

	.ed-news__form input:focus {
		outline: none;
		border-color: hsl(var(--primary));
	}

	.ed-news__form button {
		height: 52px;
		padding: 0 26px;
		border: 1px solid hsl(var(--primary));
		border-radius: var(--ed-radius);
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
		font-family: inherit;
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		cursor: pointer;
		transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.ed-news__form button:hover {
		transform: translateY(-2px);
	}

	.ed-news__thanks {
		margin: 28px 0 0;
		color: hsl(var(--primary));
		font-size: 1.05rem;
		font-weight: 600;
	}

	.ed-news__privacy {
		margin: 16px 0 0;
		color: var(--ed-soft);
		font-size: 0.78rem;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* ---------- ENTRANCE MOTION ---------- */
	.ed-hero__body > * {
		opacity: 0;
		transform: translateY(16px);
	}

	.ed.is-in .ed-hero__body > * {
		animation: ed-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.ed.is-in .ed-hero__body > *:nth-child(1) {
		animation-delay: 0.05s;
	}
	.ed.is-in .ed-hero__body > *:nth-child(2) {
		animation-delay: 0.12s;
	}
	.ed.is-in .ed-hero__body > *:nth-child(3) {
		animation-delay: 0.19s;
	}
	.ed.is-in .ed-hero__body > *:nth-child(4) {
		animation-delay: 0.26s;
	}
	.ed.is-in .ed-hero__body > *:nth-child(5) {
		animation-delay: 0.33s;
	}

	.ed-hero__media {
		opacity: 0;
		transform: scale(1.03);
	}

	.ed.is-in .ed-hero__media {
		animation: ed-fade 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
	}

	@keyframes ed-rise {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes ed-fade {
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* ---------- RESPONSIVE ---------- */
	@media (max-width: 900px) {
		.ed-hero {
			grid-template-columns: 1fr;
			gap: 28px;
		}
		.ed-hero__body {
			order: 2;
			max-width: none;
		}
		.ed-hero__media {
			order: 1;
			aspect-ratio: 16 / 11;
		}
		.ed-cats {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.ed-products {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.ed-banner {
			grid-template-columns: 1fr;
		}
		.ed-banner__media {
			aspect-ratio: 16 / 11;
		}
		.ed-assure {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.ed-assure__item:nth-child(2) {
			border-left: 0;
		}
		.ed-assure__item:nth-child(3),
		.ed-assure__item:nth-child(4) {
			border-top: 1px solid var(--ed-line);
		}
	}

	@media (max-width: 480px) {
		.ed-head {
			align-items: center;
		}
		.ed-news__form {
			flex-direction: column;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ed-hero__body > *,
		.ed-hero__media {
			opacity: 1;
			transform: none;
			animation: none;
		}
		.ed-cat__media img,
		.ed-cat__placeholder,
		.ed-btn,
		.ed-news__form button,
		.ed-link :global(.ed-link__icon) {
			transition: none;
		}
	}
</style>
