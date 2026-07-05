<script lang="ts">
	import { ChevronRight } from '@lucide/svelte'
	import NoorProductCard from './NoorProductCard.svelte'

	let {
		themeContent,
		featuredProducts = [],
		currencyCode
	}: {
		themeContent: ThemeHomepageContent
		brandName: string
		themeDescription: string
		featuredProducts?: any[]
		currencyCode?: string
	} = $props()

	const fallbackProducts = [
		{ id: 'noor-mk19', slug: 'mk-19', title: 'MK-19', price: 18500, thumbnail: '/noor/product-mk19.jpg' },
		{ id: 'noor-mk20', slug: 'mk-20', title: 'MK-20', price: 18500, thumbnail: '/noor/product-mk20.jpg' },
		{ id: 'noor-fp156', slug: 'fp-156', title: 'FP-156', price: 14200, thumbnail: '/noor/product-fp156.jpg' },
		{ id: 'noor-nel95', slug: 'nel-95a', title: 'NEL-95A', price: 22500, thumbnail: '/noor/product-nel95.jpg' }
	]

	const showcaseProducts = $derived(featuredProducts.length > 0 ? featuredProducts.slice(0, 8) : fallbackProducts)

	const categoryTiles = [
		{ title: 'Unstitched', href: '/categories/unstitched', image: '/noor/category-unstitched.jpg' },
		{ title: 'Luxury Pret', href: '/categories/luxury-pret', image: '/noor/category-luxury-pret.jpg' },
		{ title: 'Pret', href: '/categories/pret', image: '/noor/category-pret.jpg' }
	]

	const seasonTiles = [
		{ title: 'Summer', href: '/collections/summer', image: '/noor/season-summer.jpg' },
		{ title: 'Winter', href: '/collections/winter', image: '/noor/season-winter.jpg' },
		{ title: 'All Season', href: '/collections/all-season', image: '/noor/season-all.jpg' }
	]

	const spottedTiles = [
		{ name: 'Zarnab', image: '/noor/spotted-zarnab.jpg' },
		{ name: 'Ansar Sisters', image: '/noor/spotted-ansar.jpg' },
		{ name: 'Alizeh', image: '/noor/spotted-alizeh.jpg' },
		{ name: 'Areesha Kamran', image: '/noor/spotted-areesha.jpg' }
	]
</script>

<div class="noor-home">
	<section class="noor-hero" aria-label="Noor campaign">
		<img src={themeContent.hero.image} alt={themeContent.hero.imageAlt} />
	</section>

	<section class="noor-section noor-arrivals">
		<div class="noor-section-heading">
			<h2>New Arrivals</h2>
			<a href="/products">View All <ChevronRight class="h-4 w-4" /></a>
		</div>
		<div class="noor-product-grid">
			{#each showcaseProducts.slice(0, 4) as product}
				<NoorProductCard {product} aspectRatio="3:4" hideCartControls={featuredProducts.length === 0} />
			{/each}
		</div>
	</section>

	<section class="noor-section noor-category-band">
		{#each categoryTiles as tile}
			<a class="noor-category-tile" href={tile.href}>
				<img src={tile.image} alt={tile.title} />
				<span>{tile.title}</span>
			</a>
		{/each}
	</section>

	<section class="noor-editorial">
		<img src={themeContent.special.image} alt={themeContent.special.imageAlt} />
	</section>

	<section class="noor-section noor-trendsetters">
		<div class="noor-section-heading centered">
			<h2>Trendsetters</h2>
			<p>Signature looks, styled for festive dressing and refined everyday occasions.</p>
		</div>
		<div class="noor-product-grid">
			{#each showcaseProducts.slice(0, 4) as product}
				<NoorProductCard {product} aspectRatio="3:4" hideCartControls={featuredProducts.length === 0} />
			{/each}
		</div>
	</section>

	<section class="noor-section noor-season-grid">
		{#each seasonTiles as tile}
			<a class="noor-season-tile" href={tile.href}>
				<img src={tile.image} alt="{tile.title} collection" />
				<span>{tile.title}</span>
			</a>
		{/each}
	</section>

	<section class="noor-section noor-editorial-pair">
		<a href="/collections/trend-of-the-week"><img src="/noor/trend-week.png" alt="Trend of the week" /></a>
		<a href="/collections/best-sellers"><img src="/noor/best-seller.png" alt="Best seller" /></a>
	</section>

	<section class="noor-section noor-spotted">
		<div class="noor-section-heading centered">
			<h2>Spotted in Noor</h2>
			<p>Editorial moments and celebrity styling from the Noor wardrobe.</p>
		</div>
		<div class="noor-spotted-grid">
			{#each spottedTiles as tile}
				<figure>
					<img src={tile.image} alt="{tile.name} in Noor" />
					<figcaption>{tile.name}</figcaption>
				</figure>
			{/each}
		</div>
	</section>

	<section class="noor-newsletter">
		<div>
			<p>{themeContent.newsletter.label}</p>
			<h2>{themeContent.newsletter.titleLead} {themeContent.newsletter.titleAccent}</h2>
		</div>
		<form>
			<input type="email" placeholder="Enter your email address" aria-label="Email address" />
			<button type="button">{themeContent.newsletter.cta}</button>
		</form>
	</section>

</div>

<style>
	.noor-home {
		--ink: #151515;
		--soft: #f6f2ec;
		--line: #ded8cf;
		--muted: #6d6760;
		background: #fff;
		color: var(--ink);
		font-family: var(--font-body);
	}

	.noor-hero img,
	.noor-editorial img {
		display: block;
		width: 100%;
		height: auto;
	}

	.noor-section {
		width: min(1360px, calc(100% - 64px));
		margin: 0 auto;
		padding: 58px 0 0;
	}

	.noor-section-heading {
		display: flex;
		align-items: end;
		justify-content: space-between;
		margin-bottom: 26px;
	}

	.noor-section-heading.centered {
		display: block;
		text-align: center;
	}

	.noor-section-heading h2 {
		margin: 0;
		color: var(--ink);
		font-family: var(--font-heading);
		font-size: 30px;
		font-weight: 400;
		letter-spacing: 0.03em;
		line-height: 1.2;
		text-transform: uppercase;
	}

	.noor-section-heading p {
		max-width: 560px;
		margin: 10px auto 0;
		color: var(--muted);
		font-size: 14px;
		line-height: 1.8;
	}

	.noor-section-heading a {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		color: var(--ink);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-decoration: none;
		text-transform: uppercase;
	}

	.noor-product-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 28px;
	}

	.noor-category-band,
	.noor-season-grid,
	.noor-editorial-pair {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
	}

	.noor-category-tile,
	.noor-season-tile {
		position: relative;
		display: block;
		overflow: hidden;
		background: var(--soft);
		color: #fff;
		text-decoration: none;
	}

	.noor-category-tile img,
	.noor-season-tile img,
	.noor-editorial-pair img,
	.noor-spotted img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.45s ease;
	}

	.noor-category-tile img {
		aspect-ratio: 1.08 / 1;
	}

	.noor-season-tile img {
		aspect-ratio: 0.78 / 1;
	}

	.noor-category-tile:hover img,
	.noor-season-tile:hover img,
	.noor-editorial-pair a:hover img,
	.noor-spotted figure:hover img {
		transform: scale(1.035);
	}

	.noor-category-tile span,
	.noor-season-tile span {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 26px;
		text-align: center;
		font-family: var(--font-heading);
		font-size: 28px;
		font-weight: 400;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		text-shadow: 0 2px 18px rgb(0 0 0 / 0.25);
	}

	.noor-editorial {
		padding-top: 62px;
	}

	.noor-editorial-pair {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.noor-editorial-pair a {
		overflow: hidden;
		background: var(--soft);
	}

	.noor-editorial-pair img {
		aspect-ratio: 1.58 / 1;
	}

	.noor-spotted-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 22px;
	}

	.noor-spotted figure {
		margin: 0;
		overflow: hidden;
		background: var(--soft);
	}

	.noor-spotted img {
		aspect-ratio: 0.74 / 1;
		object-position: top center;
	}

	.noor-spotted figcaption {
		padding: 14px 10px 0;
		text-align: center;
		color: var(--ink);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.noor-newsletter {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1fr);
		align-items: center;
		gap: 40px;
		margin-top: 70px;
		padding: 46px max(32px, calc((100vw - 1360px) / 2));
		background: #111;
		color: #fff;
	}

	.noor-newsletter p {
		margin: 0 0 8px;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.noor-newsletter h2 {
		margin: 0;
		color: #fff;
		font-family: var(--font-heading);
		font-size: 28px;
		font-weight: 400;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.noor-newsletter form {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0;
	}

	.noor-newsletter input,
	.noor-newsletter button {
		height: 48px;
		border: 1px solid #fff;
		border-radius: 0;
	}

	.noor-newsletter input {
		background: #fff;
		color: #111;
		padding: 0 16px;
	}

	.noor-newsletter button {
		background: #111;
		color: #fff;
		padding: 0 26px;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	@media (max-width: 900px) {
		.noor-section {
			width: calc(100% - 28px);
			padding-top: 38px;
		}

		.noor-section-heading {
			margin-bottom: 18px;
		}

		.noor-section-heading h2,
		.noor-newsletter h2 {
			font-size: 22px;
		}

		.noor-product-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 24px 14px;
		}

		.noor-category-band,
		.noor-season-grid,
		.noor-editorial-pair,
		.noor-spotted-grid,
		.noor-newsletter {
			grid-template-columns: 1fr;
		}

		.noor-category-band,
		.noor-season-grid,
		.noor-editorial-pair,
		.noor-spotted-grid {
			gap: 16px;
		}

		.noor-category-tile span,
		.noor-season-tile span {
			bottom: 20px;
			font-size: 22px;
		}

		.noor-editorial {
			padding-top: 38px;
		}

		.noor-newsletter {
			gap: 22px;
			margin-top: 44px;
			padding: 36px 18px;
		}

		.noor-newsletter form {
			grid-template-columns: 1fr;
			gap: 10px;
		}

	}
</style>
