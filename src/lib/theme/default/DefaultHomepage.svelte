<script lang="ts">
	import { ShoppingCart } from '@lucide/svelte'
	import { Skeleton } from '$lib/components/ui/skeleton/index.js'
	import { Button } from '$lib/components/ui/button'
	import Banners from '$lib/components/home/banners.svelte'
	import { formatPrice } from '$lib/core/utils/index.js'
	import type { ThemeHomepageContent } from '$lib/theme/index.js'

	let {
		themeContent,
		brandName,
		themeDescription,
		storeLogo,
		storeName,
		storeDescription,
		aspectWidth,
		aspectHeight,
		featuredProducts,
		loading = false,
		desktopBanners,
		mobileBanners,
		currencyCode
	}: {
		themeContent: ThemeHomepageContent
		brandName: string
		themeDescription: string
		storeLogo?: string
		storeName?: string
		storeDescription?: string
		aspectWidth: string
		aspectHeight: string
		featuredProducts: any[]
		loading?: boolean
		desktopBanners?: any[]
		mobileBanners?: any[]
		currencyCode?: string
	} = $props()
</script>

<div class="relative w-full">
	{#if loading || !desktopBanners}
		<div class="relative aspect-[4/3.5] w-full md:aspect-[16/6] md:max-h-[calc(50vh+2px)]">
			<Skeleton class="h-full w-full rounded-none" />
		</div>
	{:else if desktopBanners?.[0]?.url || mobileBanners?.[0]?.url}
		<Banners sliderBannersDesktop={desktopBanners} sliderBannersMobile={mobileBanners} />
	{:else}
		<div class="relative flex aspect-[4/3.5] w-full items-center overflow-hidden bg-black px-6 text-white md:aspect-[16/6] md:max-h-[50vh]">
			<div class="pointer-events-none absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"></div>
			<div class="relative mx-auto max-w-7xl">
				<div class="grid gap-12 md:grid-cols-2">
					<div class="flex flex-col justify-center">
						<h2 class="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
							{storeName || 'Welcome to Our Store'}
						</h2>
						<p class="mb-8 max-w-[55ch] text-base leading-relaxed text-zinc-100 md:text-lg">
							{@html storeDescription || 'Discover amazing products at unbeatable prices. Shop now and enjoy fast shipping on all orders.'}
						</p>
						<Button
							href="/products"
							size="lg"
							class="w-fit rounded-md bg-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-black transition-colors duration-300 hover:bg-primary/90"
						>
							Shop Now
						</Button>
					</div>
					<div class="hidden select-none items-center justify-center md:flex" aria-hidden="true">
						<div class="text-[10rem] font-black tracking-tighter text-white/20">NEW</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.default-home-container {
		width: min(1180px, calc(100% - 32px));
		margin: 0 auto;
	}

	.default-home-hero {
		background: linear-gradient(135deg, #ffffff 0%, #f5f7fb 100%);
		padding: clamp(72px, 10vw, 128px) 0;
		color: hsl(var(--foreground));
	}

	.default-home-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(280px, 0.8fr);
		gap: clamp(32px, 6vw, 80px);
		align-items: center;
	}

	.default-home-eyebrow,
	.default-home-heading span {
		display: inline-flex;
		margin-bottom: 14px;
		color: hsl(var(--primary));
		font-size: 0.78rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.default-home-hero h1 {
		max-width: 680px;
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(2.8rem, 6vw, 5.5rem);
		font-weight: 900;
		line-height: 0.98;
	}

	.default-home-hero p {
		max-width: 560px;
		margin: 24px 0 0;
		color: hsl(var(--muted-foreground));
		font-size: 1.05rem;
		line-height: 1.8;
	}

	.default-home-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 32px;
	}

	.default-home-actions a {
		display: inline-flex;
		min-height: 48px;
		align-items: center;
		justify-content: center;
		border: 1px solid hsl(var(--border));
		border-radius: var(--radius);
		padding: 0 22px;
		font-size: 0.9rem;
		font-weight: 800;
	}

	.default-home-actions a:first-child {
		border-color: hsl(var(--primary));
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
	}

	.default-home-panel {
		display: grid;
		min-height: 360px;
		place-items: center;
		border: 1px solid hsl(var(--border));
		border-radius: calc(var(--radius) * 2);
		background: #ffffff;
		color: hsl(var(--primary));
		box-shadow: 0 24px 80px rgba(15, 23, 42, 0.08);
	}

	.default-home-panel img {
		max-width: min(70%, 320px);
		max-height: 220px;
		object-fit: contain;
	}

	.default-home-section {
		padding: clamp(64px, 8vw, 108px) 0;
		background: #ffffff;
	}

	.default-home-heading {
		margin-bottom: 28px;
	}

	.default-home-heading h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(2rem, 4vw, 3.4rem);
		font-weight: 900;
	}

	.default-product-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 20px;
	}

	.default-product-card {
		display: grid;
		gap: 10px;
		border: 1px solid hsl(var(--border));
		border-radius: var(--radius);
		background: #ffffff;
		padding: 12px;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.default-product-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 18px 44px rgba(15, 23, 42, 0.1);
	}

	.default-product-card div {
		overflow: hidden;
		border-radius: calc(var(--radius) - 2px);
		background: hsl(var(--muted));
	}

	.default-product-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.default-product-card span {
		color: hsl(var(--muted-foreground));
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.default-product-card h3 {
		margin: 0;
		color: hsl(var(--foreground));
		font-size: 1rem;
		font-weight: 800;
		line-height: 1.35;
	}

	.default-product-card strong {
		color: hsl(var(--primary));
		font-size: 1rem;
	}

	.theme-empty-state {
		display: grid;
		min-height: 180px;
		place-items: center;
		gap: 8px;
		border: 1px dashed hsl(var(--border));
		border-radius: var(--radius);
		background: rgba(255, 255, 255, 0.62);
		padding: 24px;
		text-align: center;
	}

	.theme-empty-state strong {
		color: hsl(var(--foreground));
		font-size: 1rem;
		font-weight: 800;
	}

	.theme-empty-state span {
		max-width: 420px;
		color: hsl(var(--muted-foreground));
		font-size: 0.9rem;
		line-height: 1.6;
	}

	@media (max-width: 980px) {
		.default-home-grid,
		.default-product-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.default-product-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
