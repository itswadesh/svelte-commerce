<script lang="ts">
	import { Heart, Minus, Plus, ShoppingCart, Truck, Shield, Leaf, Star, Tag, ArrowRight } from '@lucide/svelte'
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
		featuredCategories = [],
		featuredProducts = [],
		filterButtons = [],
		homepageModule,
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
		featuredCategories?: any[]
		featuredProducts?: any[]
		filterButtons?: string[]
		homepageModule?: any
		currencyCode?: string
	} = $props()

	const stats = [
		{ value: '14k+', label: 'Product Varieties' },
		{ value: '50k+', label: 'Happy Customers' },
		{ value: '1.2k+', label: 'Stores Nationwide' },
		{ value: '99%', label: 'Satisfaction Rate' }
	]

	const features = [
		{ icon: Leaf, title: 'Fresh from Farm', text: 'Directly sourced from organic farms daily' },
		{ icon: Shield, title: '100% Organic', text: 'Certified organic products guaranteed' },
		{ icon: Truck, title: 'Free Delivery', text: 'Free delivery on orders above $50' }
	]

	const trustBadges = [
		{ icon: Truck, title: 'Free Delivery', text: 'On orders over $50' },
		{ icon: Shield, title: 'Secure Payment', text: '100% secure checkout' },
		{ icon: Star, title: 'Quality Guarantee', text: 'Fresh or money back' },
		{ icon: Leaf, title: '100% Organic', text: 'Certified products' }
	]

	const fallbackCategories = [
		{ name: 'Fruits & Veges', slug: 'fruits-veges', image: '/organic/category-thumb-1.jpg' },
		{ name: 'Breads & Sweets', slug: 'breads-sweets', image: '/organic/category-thumb-2.jpg' },
		{ name: 'Fruits & Veges', slug: 'fresh-produce', image: '/organic/category-thumb-3.jpg' },
		{ name: 'Beverages', slug: 'beverages', image: '/organic/category-thumb-4.jpg' },
		{ name: 'Meat Products', slug: 'meat-products', image: '/organic/category-thumb-5.jpg' },
		{ name: 'Breads', slug: 'breads', image: '/organic/category-thumb-6.jpg' },
		{ name: 'Fruits & Veges', slug: 'organic-fruits', image: '/organic/category-thumb-7.jpg' },
		{ name: 'Breads & Sweets', slug: 'sweet-bakery', image: '/organic/category-thumb-8.jpg' }
	]

	const displayCategories = fallbackCategories
	const displayProducts = $derived(featuredProducts)
</script>

<!-- Hero Section -->
<section class="organic-hero">
	<div class="organic-container organic-hero-shell">
		<div class="organic-hero-inner">
			<div class="organic-hero-content">
				<h1>
					<span class="organic-text-primary">Organic</span>
					Foods at your <span>Doorsteps</span>
				</h1>
				<p>{themeContent.hero.text}</p>
				<div class="organic-hero-actions">
					<a href="/products" class="organic-btn-primary">
						{themeContent.hero.primaryCta}
						<ArrowRight class="h-4 w-4" />
					</a>
					<a href="/categories" class="organic-btn-secondary">
						{themeContent.hero.secondaryCta}
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Stats Section -->
<section class="organic-stats">
	<div class="organic-container">
		<div class="organic-stats-grid">
			{#each stats as stat}
				<div class="organic-stat-item">
					<strong>{stat.value}</strong>
					<span>{stat.label}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="organic-features">
	<div class="organic-container">
		<div class="organic-features-grid">
			{#each features as feature}
				<div class="organic-feature-card">
					<div class="organic-feature-icon">
						<feature.icon class="h-6 w-6" />
					</div>
					<h3>{feature.title}</h3>
					<p>{feature.text}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Categories Section -->
{#if displayCategories.length > 0}
	<section class="organic-section">
		<div class="organic-container">
			<div class="organic-section-header">
				<div>
					<h2>Category</h2>
				</div>
				<a href="/categories" class="organic-view-all">
					View All <ArrowRight class="h-4 w-4" />
				</a>
			</div>
			<div class="organic-category-grid">
				{#each displayCategories.slice(0, 8) as category}
					<a href="/categories/{category.slug}" class="organic-category-card">
						{#if category.image || category.img || category.thumbnail}
							<img
								src={category.image || category.img || category.thumbnail}
								alt={category.name || category.title}
							/>
						{:else}
							<div class="organic-category-placeholder">
								<Leaf class="h-8 w-8" />
							</div>
						{/if}
						<span>{category.name || category.title}</span>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- Best Selling Products -->
<section class="organic-section organic-section-alt">
	<div class="organic-container">
		<div class="organic-section-header">
			<div>
				<h2>Best selling products</h2>
			</div>
			<a href="/products" class="organic-view-all">
				View All <ArrowRight class="h-4 w-4" />
			</a>
		</div>
		{#if displayProducts.length > 0}
			<div class="organic-product-grid">
				{#each displayProducts.slice(0, 10) as product}
					<a href="/products/{product.slug}" class="organic-product-card">
						<div class="organic-product-img" style="aspect-ratio:{aspectWidth}/{aspectHeight};">
							{#if product.image || product.img || product.thumbnail}
								<img
									src={product.image || product.img || product.thumbnail}
									alt={product.name || product.title}
								/>
							{/if}
							{#if product.discount}
								<span class="organic-discount-badge">
									<Tag class="h-3 w-3" />
									{product.discount}% OFF
								</span>
							{/if}
						</div>
						<div class="organic-product-info">
							<div class="organic-product-rating">
								<span>★ ★ ★ ★ ★</span>
								<small>({product.ratingCount || 222})</small>
							</div>
							<h3>{product.name || product.title}</h3>
							<span class="organic-product-meta">1 Unit</span>
							<div class="organic-product-price">
								{#if product.mrp && product.mrp > product.price}
									<span class="organic-price-old">{formatPrice(product.mrp, currencyCode || '')}</span>
								{/if}
								<strong>{formatPrice(product.price, currencyCode || '')}</strong>
							</div>
						</div>
						<div class="organic-card-actions">
							<div class="organic-qty">
								<Minus class="h-3 w-3" />
								<span>1</span>
								<Plus class="h-3 w-3" />
							</div>
							<button class="organic-add-to-cart">
								<ShoppingCart class="h-4 w-4" />
								Add to Cart
							</button>
							<Heart class="h-5 w-5 organic-heart" />
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<div class="organic-empty-state">
				<Leaf class="h-12 w-12 text-primary/30" />
				<strong>{themeContent.menu.emptyTitle}</strong>
				<span>{themeContent.menu.emptyText}</span>
			</div>
		{/if}
	</div>
</section>

<!-- Promotional Banners -->
<section class="organic-section">
	<div class="organic-container">
		<div class="organic-promo-grid">
			<div class="organic-promo-card organic-promo-sale">
				<div>
					<span>Items on SALE</span>
					<h3>Discounts up to 30%</h3>
					<a href="/products?sort=discount">Shop Now <ArrowRight class="h-4 w-4" /></a>
				</div>
			</div>
			<div class="organic-promo-card organic-promo-combo">
				<div>
					<span>Combo Offers</span>
					<h3>Discounts up to 50%</h3>
					<a href="/products">Shop Now <ArrowRight class="h-4 w-4" /></a>
				</div>
			</div>
			<div class="organic-promo-card organic-promo-coupon">
				<div>
					<span>Discount Coupons</span>
					<h3>Discounts up to 40%</h3>
					<a href="/products">Shop Now <ArrowRight class="h-4 w-4" /></a>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Newsletter Section -->
<section class="organic-newsletter">
	<div class="organic-container">
		<div class="organic-newsletter-inner">
			<div class="organic-newsletter-content">
				<span class="organic-section-label">{themeContent.newsletter.label}</span>
				<h2>Get <span class="organic-text-secondary">25% Discount</span> on your first purchase</h2>
				<p>{themeContent.newsletter.text}</p>
			</div>
			<form class="organic-newsletter-form" onsubmit={(e) => e.preventDefault()}>
				<input type="email" placeholder="Enter your email address" />
				<button type="submit">{themeContent.newsletter.cta}</button>
			</form>
		</div>
	</div>
</section>

<section class="organic-app">
	<div class="organic-container">
		<div class="organic-app-inner">
			<div class="organic-app-content">
				<h2>Download Organic App</h2>
				<p>Shop faster from your phone and get fresh grocery offers first.</p>
				<div class="organic-app-buttons">
					<img src="/organic/img-app-store.png" alt="Download on the App Store" />
					<img src="/organic/img-google-play.png" alt="Get it on Google Play" />
				</div>
			</div>
			<img class="organic-app-phone" src="/organic/banner-onlineapp.png" alt="Organic mobile app" />
		</div>
	</div>
</section>

<!-- Trust Badges -->
<section class="organic-trust">
	<div class="organic-container">
		<div class="organic-trust-grid">
			{#each trustBadges as badge}
				<div class="organic-trust-item">
					<div class="organic-trust-icon">
						<badge.icon class="h-6 w-6" />
					</div>
					<div>
						<strong>{badge.title}</strong>
						<span>{badge.text}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.organic-container {
		width: min(1600px, calc(100% - 32px));
		margin: 0 auto;
	}

	.organic-hero {
		padding: 0;
		background: #f8f8f8;
	}

	.organic-hero-shell {
		min-height: clamp(520px, 58vw, 760px);
		display: flex;
		align-items: center;
		background: url('/organic/banner-1.jpg') center / cover no-repeat;
	}

	.organic-hero-inner {
		display: grid;
		grid-template-columns: minmax(0, 720px) 1fr;
		width: 100%;
		align-items: center;
	}

	.organic-hero-content {
		display: flex;
		flex-direction: column;
		gap: 22px;
		padding: clamp(40px, 7vw, 96px) 0;
	}

	.organic-hero-content h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(3.2rem, 7.7vw, 7.2rem);
		font-weight: 400;
		line-height: 1.02;
		color: #222;
	}

	.organic-hero-content h1 span:last-child,
	.organic-text-primary {
		color: #6bb252;
		font-weight: 800;
	}

	.organic-text-secondary {
		color: #ffc43f;
	}

	.organic-hero-content p {
		margin: 0;
		max-width: 620px;
		color: #747474;
		font-size: 1.1rem;
		line-height: 1.9;
	}

	.organic-hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 8px;
	}

	.organic-btn-primary,
	.organic-btn-secondary {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 14px 30px;
		border-radius: 8px;
		color: #fff;
		font-size: 0.9rem;
		font-weight: 700;
		text-transform: uppercase;
		transition: all 0.3s ease;
	}

	.organic-btn-primary {
		background: #6bb252;
	}

	.organic-btn-secondary {
		background: #364127;
	}

	.organic-btn-primary:hover {
		background: #f7a422;
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgb(107 178 82 / 0.3);
	}

	.organic-btn-secondary:hover {
		background: #222;
	}

	.organic-stats,
	.organic-features,
	.organic-section,
	.organic-section-alt,
	.organic-app {
		background: #fff;
	}

	.organic-stats {
		padding: 34px 0;
		color: #222;
	}

	.organic-stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
	}

	.organic-stat-item {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 14px;
		text-align: left;
	}

	.organic-stat-item strong {
		font-family: var(--font-heading);
		font-size: clamp(1.7rem, 3vw, 2.4rem);
		font-weight: 800;
	}

	.organic-stat-item span {
		max-width: 120px;
		color: #747474;
		font-size: 0.85rem;
		line-height: 1.2;
		text-transform: uppercase;
	}

	.organic-features {
		padding: 34px 0 60px;
	}

	.organic-features-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
	}

	.organic-feature-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 32px 24px;
		border-radius: 16px;
		background: #f8f8f8;
		text-align: center;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.organic-feature-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
	}

	.organic-feature-icon {
		display: grid;
		place-items: center;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: #6bb252;
		color: #fff;
	}

	.organic-feature-card h3,
	.organic-trust-item strong {
		margin: 0;
		color: #222;
		font-size: 1rem;
		font-weight: 700;
	}

	.organic-feature-card p,
	.organic-trust-item span {
		margin: 0;
		color: #747474;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.organic-section {
		padding: clamp(48px, 6vw, 80px) 0;
	}

	.organic-section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 32px;
	}

	.organic-section-label {
		display: block;
		margin-bottom: 8px;
		color: #6bb252;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.organic-section-header h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(1.8rem, 3vw, 2.6rem);
		font-weight: 700;
		color: #222;
	}

	.organic-view-all {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: #6bb252;
		font-size: 0.9rem;
		font-weight: 600;
		white-space: nowrap;
		transition: gap 0.2s ease;
	}

	.organic-view-all:hover {
		gap: 10px;
	}

	.organic-category-grid {
		display: grid;
		grid-template-columns: repeat(8, minmax(104px, 1fr));
		gap: 22px;
	}

	.organic-category-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 8px 8px 14px;
		border: 1px solid transparent;
		border-radius: 16px;
		background: #fff;
		text-align: center;
		transition: all 0.3s ease;
	}

	.organic-category-card:hover {
		box-shadow: 0 21px 44px rgba(0, 0, 0, 0.08);
		transform: translateY(-10px);
	}

	.organic-category-card img,
	.organic-category-placeholder {
		width: 120px;
		height: 120px;
		border-radius: 50%;
	}

	.organic-category-card img {
		object-fit: cover;
	}

	.organic-category-placeholder {
		display: grid;
		place-items: center;
		background: rgb(107 178 82 / 0.12);
		color: #6bb252;
	}

	.organic-category-card span {
		color: #222;
		font-size: 1rem;
		font-weight: 400;
	}

	.organic-product-grid {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 24px;
	}

	.organic-product-card {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 16px;
		border: 1px solid transparent;
		border-radius: 16px;
		background: #fff;
		transition: all 0.3s ease;
	}

	.organic-product-card:hover {
		box-shadow: 0 0 44px rgba(0, 0, 0, 0.08);
	}

	.organic-product-img {
		position: relative;
		display: grid;
		place-items: center;
		overflow: hidden;
		background: #fff;
	}

	.organic-product-img img {
		width: 100%;
		height: 100%;
		max-height: 210px;
		object-fit: contain;
		transition: transform 0.4s ease;
	}

	.organic-product-card:hover .organic-product-img img {
		transform: scale(1.04);
	}

	.organic-discount-badge {
		position: absolute;
		top: 10px;
		left: 10px;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 4px 10px;
		border-radius: 50px;
		background: #f95f09;
		color: #fff;
		font-size: 0.72rem;
		font-weight: 700;
	}

	.organic-product-info {
		display: flex;
		flex-direction: column;
		gap: 7px;
		padding-top: 10px;
	}

	.organic-product-rating {
		display: flex;
		align-items: center;
		gap: 6px;
		color: #ffc43f;
		font-size: 0.75rem;
		line-height: 1;
	}

	.organic-product-rating small,
	.organic-product-meta,
	.organic-price-old {
		color: #747474;
	}

	.organic-product-info h3 {
		display: -webkit-box;
		min-height: 42px;
		margin: 0;
		overflow: hidden;
		color: #222;
		font-size: 1rem;
		font-weight: 400;
		line-height: 1.35;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.organic-product-meta {
		font-size: 0.85rem;
	}

	.organic-product-price {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.organic-price-old {
		font-size: 0.82rem;
		text-decoration: line-through;
	}

	.organic-product-price strong {
		color: #222;
		font-size: 1.05rem;
		font-weight: 700;
	}

	.organic-card-actions {
		display: grid;
		grid-template-columns: 76px minmax(0, 1fr) 24px;
		align-items: center;
		gap: 8px;
		margin-top: 12px;
	}

	.organic-qty {
		display: grid;
		grid-template-columns: 22px 1fr 22px;
		align-items: center;
		height: 32px;
		border: 1px solid #e2e2e2;
		border-radius: 6px;
		color: #222;
		font-size: 0.8rem;
		text-align: center;
	}

	.organic-add-to-cart {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		min-width: 0;
		padding: 8px;
		border: 0;
		border-radius: 6px;
		background: transparent;
		color: #747474;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.organic-add-to-cart:hover {
		background: #fcf7eb;
		color: #222;
	}

	.organic-heart {
		color: #747474;
	}

	.organic-promo-grid {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		grid-template-rows: repeat(2, minmax(190px, 1fr));
		gap: 32px;
	}

	.organic-promo-card {
		display: flex;
		align-items: flex-end;
		min-height: 220px;
		padding: 48px;
		border-radius: 16px;
	}

	.organic-promo-sale {
		grid-area: 1 / 1 / 3 / 8;
		background: url('/organic/banner-ad-1.jpg') center / cover no-repeat;
	}

	.organic-promo-combo {
		grid-area: 1 / 8 / 2 / 13;
		background: url('/organic/banner-ad-2.jpg') center / cover no-repeat;
	}

	.organic-promo-coupon {
		grid-area: 2 / 8 / 3 / 13;
		background: url('/organic/banner-ad-3.jpg') center / cover no-repeat;
	}

	.organic-promo-card span {
		display: block;
		margin-bottom: 4px;
		color: rgb(255 255 255 / 0.85);
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.organic-promo-card h3 {
		margin: 0 0 12px;
		color: #fff;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.organic-promo-card a {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: #fff;
		font-size: 0.9rem;
		font-weight: 600;
	}

	.organic-newsletter {
		padding: clamp(48px, 6vw, 80px) 0;
		background: #fff;
		color: #fff;
	}

	.organic-newsletter-inner {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 48px;
		align-items: center;
		min-height: 320px;
		padding: clamp(32px, 6vw, 72px);
		border-radius: 16px;
		background: url('/organic/banner-newsletter.jpg') center / cover no-repeat;
	}

	.organic-newsletter-content h2 {
		margin: 8px 0 0;
		color: #fff;
		font-family: var(--font-heading);
		font-size: clamp(1.8rem, 4vw, 3rem);
		font-weight: 700;
	}

	.organic-newsletter-content .organic-section-label,
	.organic-newsletter-content p {
		color: rgba(255, 255, 255, 0.85);
	}

	.organic-newsletter-content p {
		margin: 12px 0 0;
		font-size: 0.95rem;
	}

	.organic-newsletter-form {
		display: flex;
		max-width: 460px;
	}

	.organic-newsletter-form input {
		flex: 1;
		min-width: 0;
		padding: 14px 20px;
		border: none;
		border-radius: 8px 0 0 8px;
		font-size: 0.95rem;
		outline: none;
	}

	.organic-newsletter-form button {
		padding: 14px 24px;
		border: none;
		border-radius: 0 8px 8px 0;
		background: #222;
		color: #fff;
		font-size: 0.9rem;
		font-weight: 700;
		cursor: pointer;
		transition: background 0.2s ease;
		white-space: nowrap;
	}

	.organic-newsletter-form button:hover {
		background: #6bb252;
	}

	.organic-app {
		padding: 48px 0;
	}

	.organic-app-inner {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		min-height: 360px;
		border-radius: 16px;
		background: #fff9eb;
		overflow: hidden;
	}

	.organic-app-content {
		padding: clamp(32px, 5vw, 72px);
	}

	.organic-app-content h2 {
		margin: 0 0 12px;
		color: #222;
		font-family: var(--font-heading);
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 700;
	}

	.organic-app-content p {
		margin: 0 0 24px;
		color: #747474;
	}

	.organic-app-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.organic-app-buttons img {
		width: auto;
		height: 42px;
	}

	.organic-app-phone {
		width: 100%;
		max-height: 420px;
		object-fit: contain;
		align-self: end;
	}

	.organic-trust {
		padding: 48px 0;
		background: #f8f8f8;
		border-top: 1px solid #f1f1f1;
	}

	.organic-trust-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
	}

	.organic-trust-item {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.organic-trust-icon {
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		flex-shrink: 0;
		border-radius: 50%;
		background: rgb(107 178 82 / 0.12);
		color: #6bb252;
	}

	.organic-empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 64px 24px;
		border: 2px dashed #f1f1f1;
		border-radius: 16px;
		text-align: center;
	}

	.organic-empty-state strong {
		color: #222;
		font-size: 1.1rem;
		font-weight: 700;
	}

	.organic-empty-state span {
		max-width: 400px;
		color: #747474;
		font-size: 0.9rem;
	}

	@media (max-width: 1200px) {
		.organic-category-grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}

		.organic-product-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 1024px) {
		.organic-hero-inner,
		.organic-newsletter-inner,
		.organic-app-inner {
			grid-template-columns: 1fr;
		}

		.organic-promo-grid {
			grid-template-columns: 1fr;
			grid-template-rows: auto;
		}

		.organic-promo-sale,
		.organic-promo-combo,
		.organic-promo-coupon {
			grid-area: auto;
		}
	}

	@media (max-width: 768px) {
		.organic-hero-shell {
			min-height: 460px;
			background-position: 58% center;
		}

		.organic-stats-grid,
		.organic-trust-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.organic-features-grid,
		.organic-product-grid {
			grid-template-columns: 1fr;
		}

		.organic-category-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.organic-section-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;
		}

		.organic-newsletter-form {
			flex-direction: column;
			gap: 10px;
		}

		.organic-newsletter-form input,
		.organic-newsletter-form button {
			border-radius: 8px;
		}
	}

	@media (max-width: 480px) {
		.organic-stats-grid,
		.organic-trust-grid {
			grid-template-columns: 1fr;
		}

		.organic-stat-item {
			justify-content: flex-start;
		}
	}
</style>
