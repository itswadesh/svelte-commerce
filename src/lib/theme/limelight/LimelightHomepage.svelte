<script lang="ts">
	import { Plus, MapPin } from '@lucide/svelte'
	import { formatPrice } from '$lib/core/utils/index.js'
	import LimelightProductCard from './LimelightProductCard.svelte'
	import type { ThemeHomepageProps } from '../homepages.js'

	let {
		themeContent,
		featuredProducts = [],
		currencyCode
	}: Pick<
		ThemeHomepageProps,
		'themeContent' | 'brandName' | 'themeDescription' | 'featuredProducts' | 'currencyCode'
	> = $props()

	let subscribing = $state(false)



	const categories = [
		{ title: 'Rings', href: '/categories/rings', image: '/limelight/category-rings.jpg' },
		{ title: 'Earrings', href: '/categories/earrings', image: '/limelight/category-earrings.jpg' },
		{ title: 'Pendants', href: '/categories/pendants', image: '/limelight/category-pendants.jpg' },
		{ title: 'Bracelets', href: '/categories/bracelets', image: '/limelight/category-bracelets.jpg' },
		{ title: "Men's Rings", href: '/categories/mens-rings', image: '/limelight/category-mens-rings.jpg' },
		{ title: 'Necklaces', href: '/categories/necklaces', image: '/limelight/category-necklaces.jpg' },
		{ title: 'Solitaire', href: '/categories/solitaire', image: '/limelight/category-solitaire.jpg' }
	]

	const trustItems = [
		'/limelight/trust-1.png',
		'/limelight/trust-2.png',
		'/limelight/trust-3.png',
		'/limelight/trust-4.png',
		'/limelight/trust-5.png',
		'/limelight/trust-6.png'
	]

	const faqs = [
		['What are lab grown diamonds?', 'Lab grown diamonds are created in laboratories under controlled environments that mimic the same heat and pressure as those found in a mined diamond. They have the same sparkle, strength, and beauty as natural ones.'],
		['Why choose lab grown diamonds?', 'They offer the brilliance and durability of diamonds with a more conscious origin and accessible pricing.'],
		['Do lab grown diamonds cost less than mined diamonds?', 'Yes. Lab grown diamonds typically cost less than mined diamonds of comparable quality.'],
		['What are the 4Cs of lab grown diamonds?', 'The 4Cs are cut, colour, clarity, and carat, the same quality measures used for mined diamonds.'],
		['Are lab grown diamonds durable for daily wear?', 'Yes. They are real diamonds and are suitable for daily jewellery when crafted and cared for properly.'],
		['What makes Limelight lab grown diamond jewellery special?', 'Limelight combines certified lab grown diamonds with refined designs, transparent pricing, and store support across India.'],
		['Where can I buy certified lab grown diamond jewellery?', 'You can shop online or visit a Limelight store across major Indian cities.']
	]

	async function subscribe() {
		subscribing = true
		await new Promise((resolve) => setTimeout(resolve, 700))
		subscribing = false
	}

	function productImage(product: any) {
		return product?.image || product?.img || product?.thumbnail || ''
	}

	function productTitle(product: any) {
		return product?.name || product?.title || 'Product'
	}
</script>

<div class="limelight-home">


	<section class="limelight-hero" aria-label="Limelight hero">
		<img src={themeContent.hero.image} alt={themeContent.hero.imageAlt} />
	</section>

	<section class="limelight-categories">
		<div class="limelight-section-heading">
			<h2>{themeContent.category.label}</h2>
			<p>{themeContent.category.text}</p>
		</div>
		<div class="limelight-category-row">
			{#each categories as category}
				<a class="limelight-category" href={category.href}>
					<img src={category.image} alt={category.title} />
					<h3>{category.title}</h3>
				</a>
			{/each}
		</div>
	</section>

	<section class="limelight-collage">
		<a class="limelight-collage-large" href="/collections/light-weight-gold">
			<img src="/limelight/collage-stack.jpg" alt="Stack your sparkle collection" />
		</a>
		<div class="limelight-collage-stack">
			<a href="/collections/watches"><img src="/limelight/collage-watches.jpg" alt="Distinctive diamond studded watches" /></a>
			<a href="/pages/refine"><img src="/limelight/collage-refine.jpg" alt="Limelight refine membership" /></a>
		</div>
	</section>

	<section class="limelight-split-campaign">
		<a href="/collections/mangalsutra-bracelets">
			<img src="/limelight/collage-mangalsutra.jpg" alt="Mangalsutra bracelet collection" />
		</a>
		<a href="/collections/men">
			<img src="/limelight/collage-men.jpg" alt="Men's diamond jewellery campaign" />
		</a>
	</section>

	<section class="limelight-demand">
		<a class="limelight-demand-feature" href="/collections/most-in-demand">
			<img src="/limelight/demand.jpg" alt="Most in demand Limelight collection" />
			<span>Most in Demand</span>
		</a>
		<div class="limelight-product-grid">
			{#if featuredProducts.length > 0}
				{#each featuredProducts.slice(0, 4) as product}
					<LimelightProductCard {product} aspectRatio="1" />
				{/each}
			{:else}
				<div class="limelight-product-empty">
					<h4>{themeContent.menu.emptyTitle}</h4>
					<p>{themeContent.menu.emptyText}</p>
				</div>
			{/if}
		</div>
	</section>

	<section class="limelight-trust">
		<img class="limelight-trust-heading" src="/limelight/trust-heading.png" alt="Limelight trust that shines" />
		<div class="limelight-trust-grid">
			{#each trustItems as item, index}
				<img src={item} alt="Limelight trust point {index + 1}" />
			{/each}
		</div>
	</section>

	<section class="limelight-story">
		<img src={themeContent.about.primaryImage} alt={themeContent.about.primaryImageAlt} />
		<div>
			<h3>{themeContent.about.label}</h3>
			<p>{themeContent.about.text}</p>
			<a href="/pages/about-us">{themeContent.about.cta}</a>
		</div>
	</section>

	<section class="limelight-store">
		<div>
			<h3>{themeContent.special.titleLead} {themeContent.special.titleAccent}</h3>
			<p>{themeContent.special.text}</p>
			<a href="/store-locator"><MapPin class="h-4 w-4" />{themeContent.special.cta}</a>
		</div>
		<img src={themeContent.special.image} alt={themeContent.special.imageAlt} />
	</section>

	<section class="limelight-faq">
		<h3>FAQs</h3>
		<div class="limelight-faq-list">
			{#each faqs as faq, index}
				<details open={index === 0}>
					<summary>{faq[0]}<Plus class="limelight-faq-icon h-4 w-4" /></summary>
					<p>{faq[1]}</p>
				</details>
			{/each}
		</div>
	</section>


</div>

<style>
	.limelight-home {
		--plum: var(--limelight-plum, #460032);
		--wine: var(--limelight-wine, #6f1648);
		--line: var(--limelight-line, #d9c6ba);
		background: #fff;
		color: var(--plum);
		font-family: var(--font-body);
	}



	.limelight-hero {
		position: relative;
		height: 620px;
		overflow: hidden;
		background: #eee;
	}

	.limelight-hero img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.limelight-story a,
	.limelight-store a {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-width: 118px;
		justify-content: center;
		border: 1px solid currentColor;
		padding: 8px 18px;
		background: #fff;
		color: var(--plum);
		font-size: 12px;
		line-height: 16px;
		text-transform: uppercase;
	}

	.limelight-categories {
		padding: 60px 40px 52px;
		text-align: center;
	}

	.limelight-section-heading h2 {
		margin: 0 0 10px;
		color: var(--plum);
		font-family: var(--font-heading);
		font-size: 24px;
		font-weight: 400;
		line-height: 31.2px;
	}

	.limelight-section-heading p {
		margin: 0 0 20px;
		color: #000;
		font-size: 16px;
		line-height: 20.8px;
	}

	.limelight-category-row {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		gap: 20px;
	}

	.limelight-category img {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		display: block;
	}

	.limelight-category h3 {
		margin: 16px 0 0;
		color: var(--plum);
		font-family: var(--font-heading);
		font-size: 20px;
		font-weight: 400;
		line-height: 1.3;
	}

	.limelight-collage,
	.limelight-split-campaign,
	.limelight-demand,
	.limelight-story,
	.limelight-store,
	.limelight-faq {
		width: min(1360px, calc(100% - 80px));
		margin: 0 auto;
	}

	.limelight-collage {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 30px;
	}

	.limelight-collage img,
	.limelight-split-campaign img,
	.limelight-demand img,
	.limelight-story img,
	.limelight-store img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.limelight-collage-large {
		height: 697px;
	}

	.limelight-collage-stack {
		display: grid;
		grid-template-rows: 332px 330px;
		gap: 35px;
	}

	.limelight-split-campaign {
		display: grid;
		grid-template-columns: 530fr 801fr;
		gap: 30px;
		padding-top: 60px;
	}

	.limelight-split-campaign a {
		height: 691px;
	}

	.limelight-demand {
		display: grid;
		grid-template-columns: 602fr 606fr;
		gap: 64px;
		padding-top: 60px;
	}

	.limelight-demand-feature {
		position: relative;
		height: 685px;
	}

	.limelight-demand-feature span {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 52px;
		color: #fff;
		font-family: var(--font-heading);
		font-size: 38px;
		text-align: center;
	}

	.limelight-product-grid {
		display: flex;
		gap: 30px;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		padding-bottom: 20px;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	.limelight-product-grid::-webkit-scrollbar {
		display: none; /* Chrome, Safari and Opera */
	}

	.limelight-product-grid :global(.ll-card) {
		flex: 0 0 353px;
		scroll-snap-align: start;
	}

	.limelight-product img {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		background: #f5f5f5;
	}

	.limelight-product h4 {
		margin: 15px 0 0;
		color: var(--plum);
		font-family: var(--font-heading);
		font-size: 16px;
		font-weight: 400;
		line-height: 1.3;
		text-align: center;
	}

	.limelight-product p {
		margin: 4px 0 0;
		color: #444;
		text-align: center;
	}

	.limelight-product-empty {
		grid-column: 1 / -1;
		display: grid;
		min-height: 220px;
		place-items: center;
		border: 1px solid var(--line);
		padding: 32px;
		text-align: center;
	}

	.limelight-product-empty h4 {
		margin: 0 0 10px;
		color: var(--plum);
		font-family: var(--font-heading);
		font-size: 20px;
		font-weight: 400;
	}

	.limelight-product-empty p {
		margin: 0;
		color: #555;
	}

	.limelight-trust {
		margin-top: 70px;
		padding: 50px 40px;
		background: #f5f5f5;
		text-align: center;
	}

	.limelight-trust-heading {
		width: 560px;
		max-width: 100%;
		margin: 0 auto 40px;
	}

	.limelight-trust-grid {
		display: grid;
		grid-template-columns: repeat(3, 300px);
		justify-content: center;
		gap: 28px 173px;
	}

	.limelight-trust-grid img {
		width: 300px;
		height: 51px;
		object-fit: contain;
	}

	.limelight-story {
		display: grid;
		grid-template-columns: 600px minmax(0, 1fr);
		gap: 70px;
		align-items: center;
		padding-top: 72px;
	}

	.limelight-story img {
		height: 443px;
	}

	.limelight-story h3,
	.limelight-store h3,
	.limelight-faq h3 {
		margin: 0 0 18px;
		color: var(--plum);
		font-family: var(--font-heading);
		font-size: 20px;
		font-weight: 400;
		line-height: 1.3;
	}

	.limelight-story p,
	.limelight-store p,
	.limelight-faq p {
		margin: 0 0 24px;
		color: #111;
		font-size: 16px;
		line-height: 28.8px;
	}

	.limelight-store {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 600px;
		gap: 70px;
		align-items: center;
		padding-top: 72px;
	}

	.limelight-store img {
		height: 343px;
	}

	.limelight-faq {
		padding: 76px 0 70px;
	}

	.limelight-faq > h3 {
		font-weight: 500;
	}

	.limelight-faq-list {
		border-top: 1px solid var(--line);
	}

	.limelight-faq details {
		border-bottom: 1px solid var(--line);
	}

	.limelight-faq summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 18px 0;
		color: var(--plum);
		font-family: var(--font-heading);
		font-size: 20px;
		font-weight: 600;
		cursor: pointer;
		list-style: none;
	}

	.limelight-faq summary::-webkit-details-marker {
		display: none;
	}

	.limelight-faq details[open] .limelight-faq-icon {
		transform: rotate(45deg);
	}

	.limelight-faq details p {
		max-width: 1120px;
		padding-bottom: 22px;
		font-size: 14px;
		line-height: 25px;
	}

	@media (max-width: 900px) {
		.limelight-hero {
			height: 506px;
		}

		.limelight-hero img {
			object-position: 53% center;
		}

		.limelight-categories {
			padding: 45px 14px 30px;
		}

		.limelight-category-row {
			display: flex;
			gap: 14px;
			overflow-x: auto;
			padding-bottom: 8px;
			scroll-snap-type: x mandatory;
		}

		.limelight-category {
			flex: 0 0 138px;
			scroll-snap-align: start;
		}

		.limelight-category h3 {
			margin-top: 12px;
			font-size: 16px;
		}

		.limelight-collage,
		.limelight-split-campaign,
		.limelight-demand,
		.limelight-story,
		.limelight-store,
		.limelight-faq {
			width: calc(100% - 28px);
		}

		.limelight-collage,
		.limelight-split-campaign,
		.limelight-demand,
		.limelight-story,
		.limelight-store {
			grid-template-columns: 1fr;
			gap: 16px;
		}

		.limelight-collage-large,
		.limelight-collage-stack a,
		.limelight-split-campaign a,
		.limelight-demand-feature,
		.limelight-story img,
		.limelight-store img {
			height: auto;
		}

		.limelight-collage-stack {
			grid-template-rows: auto;
			gap: 16px;
		}

		.limelight-split-campaign,
		.limelight-demand,
		.limelight-story,
		.limelight-store {
			padding-top: 16px;
		}

		.limelight-demand-feature span {
			bottom: 28px;
			font-size: 24px;
		}

		.limelight-product-grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 20px 16px;
			overflow-x: visible;
			padding-bottom: 0;
		}

		.limelight-product-grid :global(.ll-card) {
			flex: none;
		}

		.limelight-trust {
			margin-top: 34px;
			padding: 38px 14px;
		}

		.limelight-trust-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 18px;
		}

		.limelight-trust-grid img {
			width: 100%;
			height: auto;
		}

		.limelight-store {
			display: flex;
			flex-direction: column;
		}

		.limelight-store > div {
			order: 2;
		}

		.limelight-store > img {
			order: 1;
		}

		.limelight-story p,
		.limelight-store p {
			font-size: 14px;
			line-height: 25px;
		}

		.limelight-faq {
			padding: 42px 0;
		}

		.limelight-faq summary {
			font-size: 16px;
		}


	}
</style>
