<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import { Truck, RotateCcw, ShieldCheck, Headset, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from '@lucide/svelte'
	import { Skeleton } from '$lib/components/ui/skeleton/index.js'
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import { storeService, productService } from '$lib/core/services'
	import { canSubscribeToNewsletter } from '$lib/components/common/store-capabilities.js'
	import { getUserState } from '$lib/core/stores/index.js'
	import { klaviyoIdentify, klaviyoSubscribe, resolveKlaviyoConfig } from '$lib/klaviyo'
	import { toast } from '@misiki/kitcommerce-core'
	import { z } from 'zod'
	import type { ThemeHomepageContent } from '$lib/theme/index.js'
	import { resolveEditorialForDevice } from '$lib/theme/homepage-content.js'
	import { resolveHeroSlides, resolvePageBands, type PageBanner, type PageSection } from './page-inheritance.js'

	let {
		themeContent,
		brandName,
		storeName,
		aspectWidth,
		aspectHeight,
		featuredProducts,
		featuredCategories,
		loading = false,
		desktopBanners = [],
		tabletBanners = [],
		mobileBanners = [],
		pageSections = []
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
		/** Merchant content from the admin `home` page — see ./page-inheritance.ts. */
		desktopBanners?: PageBanner[]
		tabletBanners?: PageBanner[]
		mobileBanners?: PageBanner[]
		pageSections?: PageSection[]
	} = $props()

	// Per-device content (admin cascade mobile → tablet → desktop). SSR renders the mobile
	// base layer (Googlebot is mobile-first); the viewport picks the real layer on mount.
	// Stores without device overrides resolve identically on every device — no flash.
	let contentDevice = $state<'mobile' | 'tablet' | 'desktop'>('mobile')
	const ed = $derived(resolveEditorialForDevice(themeContent, contentDevice))
	// Admin-controlled per-section visibility (true = hidden), set on the store's Theme page.
	const hidden = $derived(ed?.hiddenSections ?? {})
	const productAspect = $derived(`${aspectWidth || '4'} / ${aspectHeight || '5'}`)

	// Live categories take over the fallback tiles; capped at 4 for the balanced grid.
	const categoryTiles = $derived(
		featuredCategories?.length
			? featuredCategories.slice(0, 4).map((c: any) => ({
					label: c?.name || c?.title || 'Shop',
					href: c?.slug ? `/${c.slug}` : c?.link || '/products',
					image: c?.image || c?.thumbnail || c?.img || ''
				}))
			: [] || []
	)

	// Products section source (admin Theme page): 'featured' uses the featured feed passed in
	// as props; 'latest' / 'popular' / 'category' fetch client-side. SSR renders the featured
	// feed and the configured source takes over on mount.
	let sourcedProducts = $state<any[] | null>(null)
	let sourceToken = 0
	$effect(() => {
		const source = ed?.featured?.source ?? 'featured'
		const categoryId = ed?.featured?.categoryId ?? ''
		const token = ++sourceToken
		if (source === 'featured' || (source === 'category' && !categoryId)) {
			sourcedProducts = null
			return
		}
		;(async () => {
			try {
				let res: any
				if (source === 'category') {
					res = await productService.listRelatedProducts({ page: 1, categoryId })
				} else if (source === 'popular') {
					res = await productService.list({ page: 1, sort: '-popularity' })
				} else {
					res = await productService.list({ page: 1, sort: '-createdAt' })
				}
				if (token === sourceToken) sourcedProducts = res?.data || []
			} catch {
				if (token === sourceToken) sourcedProducts = null
			}
		})()
	})

	const products = $derived(((sourcedProducts ?? featuredProducts) || []).slice(0, 8))

	const assuranceIcons = { truck: Truck, returns: RotateCcw, shield: ShieldCheck, support: Headset }

	// --- Home-page inheritance (admin Pages → this theme). Empty unless the merchant has
	// curated banners/sections, so a store that hasn't touched Pages renders exactly as before.
	const homePage = $derived({ desktopBanners, tabletBanners, mobileBanners, sections: pageSections })
	// Device-independent: each slide carries both artworks and <picture> picks per viewport,
	// so this never re-resolves (and never double-downloads) when contentDevice changes.
	const heroSlides = $derived(hidden.heroSlider ? [] : resolveHeroSlides(homePage))
	const pageBands = $derived(hidden.pageSections ? [] : resolvePageBands(homePage, contentDevice))

	// Hero slider: native scroll-snap so touch swiping is free; the arrows, dots and autoplay
	// drive it with scrollTo and read the position back on scroll.
	let heroTrack = $state<HTMLElement | null>(null)
	let heroIndex = $state(0)
	let heroPaused = $state(false)
	/** Read the live position rather than trusting heroIndex, which lags during the slide. */
	const currentSlide = () => (heroTrack ? Math.round(heroTrack.scrollLeft / Math.max(1, heroTrack.clientWidth)) : 0)

	// The slide is tweened frame by frame rather than with scrollTo({behavior:'smooth'}),
	// because Chrome silently downgrades that to an instant jump when the OS has
	// "reduce motion" enabled — which killed the animation outright on such machines. Writing
	// scrollLeft ourselves is not subject to that veto, and keeps the track a real scroller so
	// touch swiping still works natively.
	const SLIDE_MS = 600
	const easeOutCubic = (p: number) => 1 - (1 - p) ** 3
	let slideFrame = 0
	const cancelSlide = () => {
		if (slideFrame) cancelAnimationFrame(slideFrame)
		slideFrame = 0
		if (heroTrack) heroTrack.style.scrollSnapType = ''
	}
	const slideTo = (index: number) => {
		const track = heroTrack
		if (!track) return
		cancelSlide()
		const from = track.scrollLeft
		const to = track.clientWidth * index
		if (Math.abs(to - from) < 1) return
		// A background tab produces no animation frames, so a tween there would stall midway and
		// leave snapping disabled. Jump instead — nobody is watching.
		if (document.hidden) {
			track.scrollLeft = to
			return
		}
		// Mandatory snapping fights a frame-by-frame scrollLeft tween, so it is suspended for
		// the duration and restored at the end.
		track.style.scrollSnapType = 'none'
		const startedAt = performance.now()
		const tick = (now: number) => {
			const p = Math.min(1, (now - startedAt) / SLIDE_MS)
			track.scrollLeft = from + (to - from) * easeOutCubic(p)
			if (p < 1) {
				slideFrame = requestAnimationFrame(tick)
			} else {
				slideFrame = 0
				track.style.scrollSnapType = ''
			}
		}
		slideFrame = requestAnimationFrame(tick)
	}
	/** Step by ±1 with wraparound — shared by the arrows and autoplay. */
	const stepSlide = (delta: number) => slideTo((currentSlide() + delta + heroSlides.length) % heroSlides.length)
	const onHeroScroll = () => {
		if (!heroTrack) return
		heroIndex = currentSlide()
	}
	// Content that moves automatically for more than five seconds needs a real pause control
	// (WCAG 2.2.2) — hover/focus is not one on touch, where most of the traffic is — and must
	// not start at all for a visitor who asked for reduced motion. `autoplay` drives both: it
	// starts off when the media query matches, and the toggle beside the dots flips it.
	let autoplay = $state(true)
	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) autoplay = false
	})
	// Autoplay. Hovering or focusing the slider flips heroPaused, which tears this effect down
	// and clears the timer, so the next slide never fires while the pointer is over it.
	// A hidden tab is skipped rather than silently queueing advances nobody can see.
	$effect(() => {
		if (heroSlides.length < 2 || heroPaused || !autoplay) return
		const timer = setInterval(() => {
			if (!document.hidden) stepSlide(1)
		}, 6000)
		return () => clearInterval(timer)
	})
	// A tab hidden mid-slide would freeze the tween (no frames) and leave snapping off, so
	// finish immediately on the way out. Also stops any in-flight tween on unmount.
	$effect(() => {
		const onHide = () => {
			if (!document.hidden || !slideFrame || !heroTrack) return
			const track = heroTrack
			cancelSlide()
			track.scrollLeft = track.clientWidth * Math.round(track.scrollLeft / Math.max(1, track.clientWidth))
		}
		document.addEventListener('visibilitychange', onHide)
		return () => {
			document.removeEventListener('visibilitychange', onHide)
			cancelSlide()
		}
	})

	let inView = $state(false)
	onMount(() => {
		inView = true
		// Content-layer breakpoints (independent of the CSS layout breakpoints): they match
		// the admin preview's simulated devices — mobile <768, tablet 768–1199, desktop ≥1200.
		const mqTablet = window.matchMedia('(min-width: 768px)')
		const mqDesktop = window.matchMedia('(min-width: 1200px)')
		const pick = () => {
			contentDevice = mqDesktop.matches ? 'desktop' : mqTablet.matches ? 'tablet' : 'mobile'
		}
		pick()
		mqTablet.addEventListener('change', pick)
		mqDesktop.addEventListener('change', pick)
		return () => {
			mqTablet.removeEventListener('change', pick)
			mqDesktop.removeEventListener('change', pick)
		}
	})

	// Newsletter: subscribe to Litekart's list AND the store's Klaviyo list (same flow as the
	// footer). Both are no-ops when unconfigured; on success we confirm inline.
	const userState = getUserState()
	const klaviyoConfig = $derived(resolveKlaviyoConfig(page.data?.store?.plugins))
	let email = $state('')
	let subscribed = $state(false)
	let subscribing = $state(false)
	// A form that can only ever answer "not available" is worse than no form: this posts to the
	// storefront's own Litekart REST API, which no other backend serves.
	const canSubscribe = canSubscribeToNewsletter()

	// Editorial images arrive from the content file as one URL carrying its own width (…?w=1400…).
	// The slot is at most ~46vw on a wide screen, so the shipped file was roughly four times the
	// pixels the slot can show — paid for on the one connection a mobile shopper has. Re-emit the
	// same URL at several widths and let the browser choose. A URL with no width is passed through.
	function responsiveSrcset(url: string, widths = [480, 768, 1024, 1400]) {
		if (!url || !/[?&]w=\d+/.test(url)) return ''
		return widths.map((w) => `${url.replace(/([?&]w=)\d+/, `$1${w}`)} ${w}w`).join(', ')
	}

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
		<!-- HOME PAGE SLIDER — the merchant's own banners, full-bleed above the hero. These are
		     authored as wide strips (the admin asks for 1500x380 / 360x190), so they get their own
		     band rather than the hero's portrait media slot, which would crop them to pieces. -->
		{#if heroSlides.length}
			<div
				class="ed-slider"
				role="group"
				aria-roledescription="carousel"
				aria-label="Featured banners"
				onmouseenter={() => (heroPaused = true)}
				onmouseleave={() => (heroPaused = false)}
				onfocusin={() => (heroPaused = true)}
				onfocusout={() => (heroPaused = false)}
				onpointerdown={cancelSlide}
			>
				<div class="ed-slider__track" bind:this={heroTrack} onscroll={onHeroScroll}>
					{#each heroSlides as slide, i}
						<svelte:element this={slide.link ? 'a' : 'div'} class="ed-slide" href={slide.link || undefined} aria-label={slide.title || undefined}>
							<picture>
								<!-- Breakpoints match the .ed-slider aspect tiers below (and the admin's
								     upload hints), so each device fetches only its own artwork. A tier is
								     omitted when it resolved to the same file, to avoid a pointless source. -->
								{#if slide.mobileUrl !== slide.url}
									<source media="(max-width: 767px)" srcset={slide.mobileUrl} />
								{/if}
								{#if slide.tabletUrl !== slide.url}
									<source media="(max-width: 1199px)" srcset={slide.tabletUrl} />
								{/if}
								<img
									src={slide.url}
									alt={slide.title || 'Featured banner'}
									loading={i === 0 ? 'eager' : 'lazy'}
									fetchpriority={i === 0 ? 'high' : 'auto'}
								/>
							</picture>
						</svelte:element>
					{/each}
				</div>
				{#if heroSlides.length > 1}
					<!-- Arrows are pointer affordances: on touch the track swipes natively, so they
					     are hidden below the mobile breakpoint where they would cover the artwork. -->
					<button type="button" class="ed-slider__arrow ed-slider__arrow--prev" aria-label="Previous slide" onclick={() => stepSlide(-1)}>
						<ChevronLeft class="ed-slider__arrow-icon" />
					</button>
					<button type="button" class="ed-slider__arrow ed-slider__arrow--next" aria-label="Next slide" onclick={() => stepSlide(1)}>
						<ChevronRight class="ed-slider__arrow-icon" />
					</button>
					<div class="ed-slider__dots">
						{#each heroSlides as _, i}
							<button type="button" class="ed-dot" aria-current={heroIndex === i} aria-label="Go to slide {i + 1}" onclick={() => slideTo(i)}
							></button>
						{/each}
						<button
							type="button"
							class="ed-slider__playpause"
							aria-pressed={!autoplay}
							aria-label={autoplay ? 'Pause automatic slideshow' : 'Start automatic slideshow'}
							onclick={() => (autoplay = !autoplay)}
						>
							{#if autoplay}
								<Pause class="ed-slider__playpause-icon" />
							{:else}
								<Play class="ed-slider__playpause-icon" />
							{/if}
						</button>
					</div>
				{/if}
			</div>
		{/if}

		<!-- HERO -->
		{#if !hidden.hero}
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
					<img
						srcset={responsiveSrcset(ed.hero.image)}
						sizes="(min-width: 1024px) 46vw, 100vw"
						src={ed.hero.image}
						width="1400"
						height="1190"
						alt={ed.hero.imageAlt}
						loading={heroSlides.length ? 'lazy' : 'eager'}
						fetchpriority={heroSlides.length ? 'auto' : 'high'}
					/>
				</div>
			</section>
		{/if}

		<!-- MARQUEE / assurance ribbon -->
		{#if ed.marquee?.length && !hidden.marquee}
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
		{#if categoryTiles.length && !hidden.categories}
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
		{#if !hidden.featured}
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
		{/if}

		<!-- HOME PAGE GRIDS — the merchant's own banner sections, in the theme's tile styling -->
		{#if pageBands.length}
			<section class="ed-wrap ed-section ed-bands">
				{#each pageBands as band}
					<div class="ed-band">
						{#if band.title}
							<header class="ed-head">
								<h2 class="ed-display ed-head__title">{band.title}</h2>
							</header>
						{/if}
						<div
							class="ed-band__grid"
							class:ed-band__grid--carousel={band.carousel}
							style="--ed-band-cols: {band.columns}; --ed-band-aspect: {band.aspect}"
						>
							{#each band.items as item}
								<svelte:element this={item.link ? 'a' : 'div'} class="ed-band__item" href={item.link || undefined}>
									<div class="ed-band__media">
										<img src={item.url} alt={item.title || band.title || 'Banner'} loading="lazy" />
									</div>
									{#if item.title}
										<span class="ed-band__label">{item.title}</span>
									{/if}
								</svelte:element>
							{/each}
						</div>
					</div>
				{/each}
			</section>
		{/if}

		<!-- EDITORIAL BANNER -->
		{#if !hidden.banner}
			<section class="ed-wrap ed-banner">
				<div class="ed-banner__media">
					<img
						srcset={responsiveSrcset(ed.banner.image)}
						sizes="(min-width: 1024px) 46vw, 100vw"
						src={ed.banner.image}
						width="1400"
						height="1050"
						alt={ed.banner.imageAlt}
						loading="lazy"
					/>
				</div>
				<div class="ed-banner__body">
					<span class="ed-eyebrow">{ed.banner.eyebrow}</span>
					<h2 class="ed-display ed-banner__title">{ed.banner.title}</h2>
					<p>{ed.banner.text}</p>
					<a class="ed-btn ed-btn--ghost" href={ed.banner.href}>{ed.banner.cta}</a>
				</div>
			</section>
		{/if}

		<!-- ASSURANCES -->
		{#if !hidden.assurances}
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
		{/if}

		<!-- NEWSLETTER -->
		<!-- Also gated on the store being able to accept a subscription: this posts to the
		     storefront's own Litekart REST API, which no other backend serves, so on this store every
		     submit could only answer "not available". A form that cannot succeed is worse than none. -->
		{#if !hidden.newsletter && canSubscribe}
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
		{/if}
	</div>
{/if}

<style>
	/* The --ed-* token set (canvas / surface / ink / soft / line / radius / display / body) is
	   declared once, on [data-theme='default'] in src/app.css, and inherited here — this block
	   used to restate it with drifting contents (it omitted --ed-line-strong and added its own
	   --ed-gutter), so the homepage could sit on a stale palette. */
	.ed {
		background: var(--ed-canvas);
		color: var(--ed-ink);
		font-family: var(--ed-body);
		-webkit-font-smoothing: antialiased;

		/* ONE band rhythm for the whole page. Four different section paddings used to compete —
		   .ed-section 56-120px, .ed-banner's 56-120px margins, .ed-news' 56-116px and .ed-bands'
		   36-64px gap — so the distance between two bands depended on which two they happened to
		   be, and the product grid sat 230px away from the lookbook on a 1280px screen. */
		--ed-band: clamp(40px, 5vw, 64px);
	}

	/* Same container rail as the header (.page-width) and footer (.ed-foot-inner). */
	.ed-wrap {
		width: min(var(--container-max, 1240px), 100% - 2 * var(--container-gutter, 32px));
		margin-inline: auto;
	}

	.ed-section {
		padding-block: var(--ed-band);
	}

	.ed-display {
		font-family: var(--ed-display);
		font-weight: 500;
		letter-spacing: -0.01em;
	}

	.ed-eyebrow {
		display: inline-block;
		margin-bottom: 10px;
		color: var(--ed-soft);
		/* 12px, the floor of the supporting-text band. 0.72rem is 11.5px, and this is uppercase
		   at 0.2em tracking — it was the smallest, hardest-to-read text on the page. */
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	/* ---------- HERO ---------- */
	.ed-hero {
		display: grid;
		grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
		align-items: center;
		gap: clamp(24px, 3.5vw, 48px);
		/* Deliberately less than a full band: the hero opens the page directly under the header,
		   so the air above it is the header's gap, not a boundary between two bands. It was
		   104px top AND bottom around a column of copy 250px tall. */
		padding-block: clamp(28px, 3.4vw, 48px);
	}

	.ed-hero__body {
		/* One rhythm for the column. The eyebrow (14px), paragraph (22px), actions (34px) and
		   note (26px) each used to set their own margin, so four scopes decided four different
		   gaps inside a single 250px-tall block. */
		display: grid;
		gap: 14px;
		max-width: 34rem;
	}

	/* The eyebrow carries its own bottom margin for the section headers, where nothing else sets
	   a gap. Inside the two grid columns, that margin would stack on top of the grid gap. */
	.ed-hero__body .ed-eyebrow,
	.ed-banner__body .ed-eyebrow {
		margin-bottom: 0;
	}

	.ed-hero h1 {
		margin: 0;
		/* The page-title step, shared verbatim with .ed-lh__title on the listing header: 28px on a
		   phone, 30.7px at 1280, 34.6px at 1440, 36px at the widest. Both titles already agreed on
		   the 1.75rem floor and the 2.25rem ceiling and differed only in the ramp (3.4vw here),
		   so the hero hit the ceiling at 1060px while the listing title reached it at 1500px and
		   the two pages showed a 5.3px gap on the same 1280px screen. The slower ramp wins: it is
		   the smaller value at every width where they disagree. (It was worse before:
		   clamp(2.6rem, 5.6vw, 4.9rem), 72px at 1280.) */
		font-size: clamp(1.75rem, 2.4vw, 2.25rem);
		line-height: 1.06;
	}

	.ed-hero h1 em {
		display: block;
		font-style: italic;
		color: hsl(var(--primary));
	}

	.ed-hero__text {
		max-width: 42ch;
		/* Margins removed: .ed-hero__body owns every gap in this column now. 1.05rem/1.7 was over
		   the 14-16px body band and looser than the 1.45-1.6 line-height band. */
		margin: 0;
		color: var(--ed-soft);
		font-size: 1rem;
		line-height: 1.55;
	}

	.ed-hero__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 20px;
	}

	.ed-hero__note {
		margin: 0;
		color: var(--ed-soft);
		font-size: 0.8rem;
		letter-spacing: 0.01em;
	}

	.ed-hero__media {
		position: relative;
		overflow: hidden;
		border-radius: var(--ed-radius);
		/* 4/3.4 made the photograph 514px tall at 1280 beside a 250px column of copy, which is what
		   set the hero's height — and so how far a shopper scrolled before reaching a product. */
		aspect-ratio: 4 / 3;
		background: #eae5dd;
	}

	.ed-hero__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	/* ---------- HOME PAGE SLIDER (merchant banners from the admin Home page) ---------- */
	/* Full-bleed strip at the banner proportions the admin asks merchants to upload, so
	   artwork with baked-in text survives instead of being cropped to the middle third.
	   The three tiers below mirror BANNER_SIZES and the <picture> breakpoints — change one
	   and you must change all three. */
	.ed-slider {
		position: relative;
		aspect-ratio: 1500 / 380;
		background: #eae5dd;
	}

	/* Tablet artwork: 1024x320 */
	@media (max-width: 1199px) {
		.ed-slider {
			aspect-ratio: 1024 / 320;
		}
	}

	/* Mobile artwork: 360x190 */
	@media (max-width: 767px) {
		.ed-slider {
			aspect-ratio: 360 / 190;
		}
	}

	/* Arrows are pointer affordances: touch devices swipe the track natively, and on a phone
	   they would just cover the artwork. */
	@media (hover: none), (max-width: 767px) {
		.ed-slider__arrow {
			display: none;
		}
	}

	.ed-slider__track {
		display: flex;
		height: 100%;
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.ed-slider__track::-webkit-scrollbar {
		display: none;
	}

	.ed-slide {
		flex: 0 0 100%;
		height: 100%;
		scroll-snap-align: start;
	}

	.ed-slide picture,
	.ed-slide img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.ed-slider__arrow {
		position: absolute;
		top: 50%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		cursor: pointer;
		color: var(--ed-ink);
		background: rgb(255 255 255 / 0.82);
		box-shadow: 0 2px 10px rgb(0 0 0 / 0.14);
		transform: translateY(-50%);
		transition:
			background 0.25s ease,
			box-shadow 0.25s ease;
	}

	.ed-slider__arrow:hover {
		background: #fff;
		box-shadow: 0 4px 16px rgb(0 0 0 / 0.2);
	}

	.ed-slider__arrow--prev {
		left: clamp(12px, 2vw, 28px);
	}

	.ed-slider__arrow--next {
		right: clamp(12px, 2vw, 28px);
	}

	.ed-slider :global(.ed-slider__arrow-icon) {
		width: 20px;
		height: 20px;
	}

	.ed-slider__dots {
		position: absolute;
		inset: auto 0 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	/* Pause/play sits with the dots so the control is where the motion is. */
	.ed-slider__playpause {
		display: grid;
		place-items: center;
		width: 20px;
		height: 20px;
		margin-left: 4px;
		padding: 0;
		border: 0;
		border-radius: 99px;
		cursor: pointer;
		color: var(--ed-ink);
		background: rgb(255 255 255 / 0.85);
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.12);
	}

	.ed-slider :global(.ed-slider__playpause-icon) {
		width: 11px;
		height: 11px;
	}

	.ed-dot {
		width: 7px;
		height: 7px;
		padding: 0;
		border: 0;
		border-radius: 99px;
		cursor: pointer;
		background: rgb(255 255 255 / 0.6);
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.12);
		transition:
			width 0.35s cubic-bezier(0.16, 1, 0.3, 1),
			background 0.35s ease;
	}

	.ed-dot[aria-current='true'] {
		width: 22px;
		background: #fff;
	}

	/* ---------- BUTTONS / LINKS ---------- */
	.ed-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		/* 44px on touch, 40px from the tablet breakpoint up (see below) — the two control heights
		   the design system defines. A flat 52px is taller than any control in the storefront. */
		min-height: 44px;
		padding: 0 22px;
		border: 1px solid hsl(var(--primary));
		border-radius: var(--ed-radius);
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
		/* 0.8rem, the size the PDP's Add to bag CTA and the listing's sort trigger already use.
		   Three uppercase button labels at 0.8 / 0.82 / 0.85rem is drift, not hierarchy. */
		font-size: 0.8rem;
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

	/* Pointer-sized controls once there is room for them; the 44px touch target stays below. */
	@media (min-width: 768px) {
		.ed-btn {
			min-height: 40px;
		}
	}

	.ed-link {
		/* 32px tall so a standalone call to action clears the WCAG 2.2 target minimum; these sit
		   beside buttons, not inside a sentence, so the inline exception does not apply. */
		min-height: 32px;
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
		gap: 6px 16px;
		padding-block: 12px;
		color: var(--ed-soft);
		font-size: 0.75rem;
		/* This wraps to three lines on a 390px screen; at 16px padding and a 14px row gap the
		   assurance strip was 122px tall, taller than any product title it sits above. */
		line-height: 1.4;
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
		margin-bottom: clamp(20px, 2.4vw, 32px);
	}

	/* 22px on a phone, 28px on a desktop. The section-title band is 22-32px and every heading on
	   this page sat on its ceiling. Shared with the lookbook and newsletter titles below so the
	   page has one heading step rather than three identical clamps that can drift apart. */
	.ed-head__title,
	.ed-banner__title,
	.ed-news__title {
		font-size: clamp(1.375rem, 2.4vw, 1.75rem);
		line-height: 1.1;
	}

	.ed-head__title {
		margin: 0;
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
		margin-top: 10px;
		font-size: 0.875rem;
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

	/* ---------- HOME PAGE GRIDS (merchant sections from the admin Home page) ---------- */
	.ed-bands {
		display: grid;
		gap: var(--ed-band);
	}

	.ed-band__grid {
		display: grid;
		grid-template-columns: repeat(var(--ed-band-cols, 2), minmax(0, 1fr));
		gap: clamp(10px, 1.4vw, 18px);
	}

	/* Horizontal scroll row: the tiles keep their grid width so both layouts read alike. */
	.ed-band__grid--carousel {
		display: flex;
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scroll-snap-type: x proximity;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.ed-band__grid--carousel::-webkit-scrollbar {
		display: none;
	}

	.ed-band__grid--carousel .ed-band__item {
		flex: 0 0 calc((100% - (var(--ed-band-cols, 2) - 1) * 14px) / var(--ed-band-cols, 2));
		scroll-snap-align: start;
	}

	.ed-band__item {
		display: block;
		color: var(--ed-ink);
	}

	.ed-band__media {
		overflow: hidden;
		border-radius: var(--ed-radius);
		aspect-ratio: var(--ed-band-aspect, 1 / 1);
		background: #eae5dd;
	}

	.ed-band__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}

	a.ed-band__item:hover .ed-band__media img {
		transform: scale(1.05);
	}

	.ed-band__label {
		display: block;
		margin-top: 12px;
		font-size: 0.9rem;
		font-weight: 600;
	}

	/* ---------- PRODUCTS ---------- */
	.ed-products {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		/* Same gap as .ed-cats: two grids of tiles one band apart should not use two rhythms. */
		gap: clamp(14px, 1.6vw, 22px);
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
		gap: 12px;
		padding: clamp(32px, 5vw, 56px) 24px;
		border: 1px solid var(--ed-line);
		border-radius: var(--ed-radius);
		text-align: center;
	}

	.ed-empty h3 {
		margin: 0;
		font-size: 1.375rem;
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
		gap: clamp(20px, 3vw, 40px);
		margin-block: calc(var(--ed-band) / 2) var(--ed-band);
	}

	.ed-banner__media {
		overflow: hidden;
		border-radius: var(--ed-radius);
		/* Was 5/4 — 472px tall next to a 200px column of copy. */
		aspect-ratio: 4 / 3;
		background: #eae5dd;
	}

	.ed-banner__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.ed-banner__body {
		/* Grid with one gap, like the hero column. justify-items reproduces the old
		   align-items: flex-start, so the ghost button still shrink-wraps. The eyebrow (14px),
		   title (18px) and paragraph (30px) each used to set their own bottom margin. */
		display: grid;
		align-content: center;
		justify-items: start;
		gap: 14px;
		max-width: 34rem;
	}

	.ed-banner__title {
		margin: 0;
	}

	.ed-banner__body p {
		margin: 0;
		max-width: 46ch;
		color: var(--ed-soft);
		font-size: 1rem;
		line-height: 1.55;
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
		padding: 20px clamp(12px, 2vw, 26px);
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
		font-size: 0.875rem;
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
		padding-block: var(--ed-band);
		text-align: center;
	}

	.ed-news__title {
		margin: 0;
	}

	.ed-news__text {
		max-width: 46ch;
		margin: 12px auto 0;
		color: var(--ed-soft);
		font-size: 1rem;
		line-height: 1.55;
	}

	.ed-news__form {
		display: flex;
		gap: 10px;
		max-width: 30rem;
		margin: 20px auto 0;
	}

	.ed-news__form input {
		flex: 1;
		min-width: 0;
		height: 44px;
		padding: 0 16px;
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
		height: 44px;
		padding: 0 22px;
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

	/* Matches the .ed-btn step: 44px on touch, 40px once the viewport is pointer-sized. */
	@media (min-width: 768px) {
		.ed-news__form input,
		.ed-news__form button {
			height: 40px;
		}
	}

	.ed-news__thanks {
		margin: 20px 0 0;
		color: hsl(var(--primary));
		font-size: 1rem;
		font-weight: 600;
	}

	.ed-news__privacy {
		margin: 12px 0 0;
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
	/* Hidden only while scripts are running, so the entrance has something to reveal. Without
	   the `html.js` guard the hero painted as a blank cream rectangle until hydration — and
	   forever with scripts blocked — while holding the store's only value proposition, its
	   primary action and the largest paint on the page. */
	:global(html.js) .ed-hero__body > * {
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

	:global(html.js) .ed-hero__media {
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
			/* Once the hero stacks the photograph is full-bleed: at 768px, 16/11 made it 484px
			   tall and pushed the headline and the primary action off the first screen. The
			   max-height keeps it under half the fold on short viewports too. */
			aspect-ratio: 16 / 10;
			max-height: 46vh;
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

		/* `flex: 1` on the field means `flex: 1 1 0%`. Once the form stacks, that basis applies to
		   HEIGHT, so it beat the 52px rule and the email field rendered 22px tall — the smallest
		   target on the page, on the viewport where it matters most. */
		.ed-news__form input,
		.ed-news__form button {
			flex: none;
			width: 100%;
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
		.ed-band__media img,
		.ed-dot,
		.ed-slider__arrow,
		.ed-btn,
		.ed-news__form button,
		.ed-link :global(.ed-link__icon) {
			transition: none;
		}
		/* The hero slider deliberately keeps gliding here: its slide is the point of the
		   component, and it is driven by a scrollLeft tween rather than CSS scrolling, so this
		   block does not reach it. Only the band carousel, which has no scripted scrolling,
		   is reset. */
		.ed-band__grid--carousel {
			scroll-behavior: auto;
		}
	}
</style>
