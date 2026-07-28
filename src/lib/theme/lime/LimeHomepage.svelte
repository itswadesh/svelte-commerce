<script lang="ts">
	import { Plus, MapPin, BadgeCheck, RefreshCw, Tag, Truck, Undo2, Store } from '@lucide/svelte'
	import LimeProductCard from './LimeProductCard.svelte'
	import type { ThemeHomepageProps } from '../homepages.js'
	import { themeImage } from '../placeholder.js'

	let {
		themeContent,
		brandName,
		featuredCategories = [],
		featuredProducts = [],
		currencyCode
	}: Pick<
		ThemeHomepageProps,
		| 'themeContent'
		| 'brandName'
		| 'themeDescription'
		| 'featuredCategories'
		| 'featuredProducts'
		| 'currencyCode'
	> = $props()

	let subscribing = $state(false)

	// Live catalogue categories win; the theme's tiles are the fallback for an empty store.
	const categories = $derived(
		featuredCategories?.length
			? featuredCategories.slice(0, 7).map((category: any) => ({
					title: category?.name || category?.title || '',
					href: category?.slug ? '/' + category.slug : category?.link || '/products',
					image: category?.image || category?.thumbnail || category?.img || '',
					imageAlt: ''
				}))
			: (themeContent.tiles?.categories ?? [])
	)

	const collage = $derived(themeContent.tiles?.collage ?? [])
	const featureTile = $derived(themeContent.tiles?.feature)
	const trust = $derived(themeContent.trust)

	// The source rendered each trust point as a text-in-image badge. Those are real icons and
	// real text now, so the section needs no asset files and stays readable at any size.
	const TRUST_ICONS: [RegExp, typeof BadgeCheck][] = [
		[/certif/i, BadgeCheck],
		[/exchange/i, RefreshCw],
		[/pricing|price/i, Tag],
		[/shipping|delivery/i, Truck],
		[/return/i, Undo2],
		[/store|support/i, Store]
	]

	const trustIcon = (title = '') => TRUST_ICONS.find(([pattern]) => pattern.test(title))?.[1] ?? BadgeCheck
	const faq = $derived(themeContent.faq)

	async function subscribe() {
		subscribing = true
		await new Promise((resolve) => setTimeout(resolve, 700))
		subscribing = false
	}
</script>

<div class="lime-home">


	<section class="lime-hero" aria-label="{brandName} hero">
		<img src={themeImage(themeContent.hero.image, 'lime-hero')} alt={themeContent.hero.imageAlt} />
	</section>

	<section class="lime-categories">
		<div class="lime-section-heading">
			<h2>{themeContent.category.label}</h2>
			<p>{themeContent.category.text}</p>
		</div>
		<div class="lime-category-row">
			{#each categories as category}
				<a class="lime-category" href={category.href}>
					<img src={themeImage(category.image, category.title)} alt={category.imageAlt || category.title} />
					<h3>{category.title}</h3>
				</a>
			{/each}
		</div>
	</section>

	{#if collage[0] || collage[1] || collage[2]}
		<section class="lime-collage">
			{#if collage[0]}
				<a class="lime-collage-large" href={collage[0].href}>
					<img src={themeImage(collage[0].image, collage[0].imageAlt || collage[0].href)} alt={collage[0].imageAlt || collage[0].title || ''} />
				</a>
			{/if}
			<div class="lime-collage-stack">
				{#each collage.slice(1, 3) as tile}
					<a href={tile.href}><img src={themeImage(tile.image, tile.imageAlt || tile.href)} alt={tile.imageAlt || tile.title || ''} /></a>
				{/each}
			</div>
		</section>
	{/if}

	{#if collage.length > 3}
		<section class="lime-split-campaign">
			{#each collage.slice(3, 5) as tile}
				<a href={tile.href}>
					<img src={themeImage(tile.image, tile.imageAlt || tile.href)} alt={tile.imageAlt || tile.title || ''} />
				</a>
			{/each}
		</section>
	{/if}

	<section class="lime-demand">
		{#if featureTile}
			<a class="lime-demand-feature" href={featureTile.href}>
				<img src={themeImage(featureTile.image, 'lime-feature', 'dark')} alt={featureTile.imageAlt || featureTile.title || ''} />
				<span>{featureTile.title}</span>
			</a>
		{/if}
		<div class="lime-product-grid">
			{#if featuredProducts.length > 0}
				{#each featuredProducts.slice(0, 4) as product}
					<LimeProductCard {product} {themeContent} aspectRatio="1" />
				{/each}
			{:else}
				<div class="lime-product-empty">
					<h4>{themeContent.menu.emptyTitle}</h4>
					<p>{themeContent.menu.emptyText}</p>
				</div>
			{/if}
		</div>
	</section>

	{#if trust?.items?.length}
		<section class="lime-trust">
			{#if trust.title}
				<h3 class="lime-trust-heading">{trust.title}</h3>
			{/if}
			<div class="lime-trust-grid">
				{#each trust.items as item, index}
					{@const TrustIcon = trustIcon(item.title)}
					<p class="lime-trust-item">
						<TrustIcon aria-hidden="true" />
						<span>{item.title || `${brandName} trust point ${index + 1}`}</span>
					</p>
				{/each}
			</div>
		</section>
	{/if}

	<section class="lime-story">
		<img src={themeImage(themeContent.about.primaryImage, 'lime-story')} alt={themeContent.about.primaryImageAlt} />
		<div>
			<h3>{themeContent.about.label}</h3>
			<p>{themeContent.about.text}</p>
			<a href="/pages/about-us">{themeContent.about.cta}</a>
		</div>
	</section>

	<section class="lime-store">
		<div>
			<h3>{themeContent.special.titleLead} {themeContent.special.titleAccent}</h3>
			<p>{themeContent.special.text}</p>
			<a href="/store-locator"><MapPin class="h-4 w-4" />{themeContent.special.cta}</a>
		</div>
		<img src={themeImage(themeContent.special.image, 'lime-store')} alt={themeContent.special.imageAlt} />
	</section>

	<section class="lime-faq">
		<h3>{faq?.label}</h3>
		<div class="lime-faq-list">
			{#each faq?.items ?? [] as item, index}
				<details open={index === 0}>
					<summary>{item.question}<Plus class="lime-faq-icon h-4 w-4" /></summary>
					<p>{item.answer}</p>
				</details>
			{/each}
		</div>
	</section>


</div>

<style>
	.lime-home {
		--plum: var(--lime-plum, #460032);
		--wine: var(--lime-wine, #6f1648);
		--line: var(--lime-line, #d9c6ba);
		background: #fff;
		color: var(--plum);
		font-family: var(--font-body);
	}



	.lime-hero {
		position: relative;
		height: 620px;
		overflow: hidden;
		background: #eee;
	}

	.lime-hero img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.lime-story a,
	.lime-store a {
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

	.lime-categories {
		padding: 60px 40px 52px;
		text-align: center;
	}

	.lime-section-heading h2 {
		margin: 0 0 10px;
		color: var(--plum);
		font-family: var(--font-heading);
		font-size: 24px;
		font-weight: 400;
		line-height: 31.2px;
	}

	.lime-section-heading p {
		margin: 0 0 20px;
		color: #000;
		font-size: 16px;
		line-height: 20.8px;
	}

	.lime-category-row {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		gap: 20px;
	}

	.lime-category img {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		display: block;
	}

	.lime-category h3 {
		margin: 16px 0 0;
		color: var(--plum);
		font-family: var(--font-heading);
		font-size: 20px;
		font-weight: 400;
		line-height: 1.3;
	}

	.lime-collage,
	.lime-split-campaign,
	.lime-demand,
	.lime-story,
	.lime-store,
	.lime-faq {
		width: min(1360px, calc(100% - 80px));
		margin: 0 auto;
	}

	.lime-collage {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 30px;
	}

	.lime-collage img,
	.lime-split-campaign img,
	.lime-demand img,
	.lime-story img,
	.lime-store img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.lime-collage-large {
		height: 697px;
	}

	.lime-collage-stack {
		display: grid;
		grid-template-rows: 332px 330px;
		gap: 35px;
	}

	.lime-split-campaign {
		display: grid;
		grid-template-columns: 530fr 801fr;
		gap: 30px;
		padding-top: 60px;
	}

	.lime-split-campaign a {
		height: 691px;
	}

	.lime-demand {
		display: grid;
		grid-template-columns: 602fr 606fr;
		gap: 64px;
		padding-top: 60px;
	}

	.lime-demand-feature {
		position: relative;
		height: 685px;
	}

	.lime-demand-feature span {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 52px;
		color: #fff;
		font-family: var(--font-heading);
		font-size: 38px;
		text-align: center;
	}

	.lime-product-grid {
		display: flex;
		gap: 30px;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		padding-bottom: 20px;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	.lime-product-grid::-webkit-scrollbar {
		display: none; /* Chrome, Safari and Opera */
	}

	.lime-product-grid :global(.ll-card) {
		flex: 0 0 353px;
		scroll-snap-align: start;
	}

	.lime-product img {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		background: #f5f5f5;
	}

	.lime-product h4 {
		margin: 15px 0 0;
		color: var(--plum);
		font-family: var(--font-heading);
		font-size: 16px;
		font-weight: 400;
		line-height: 1.3;
		text-align: center;
	}

	.lime-product p {
		margin: 4px 0 0;
		color: #444;
		text-align: center;
	}

	.lime-product-empty {
		grid-column: 1 / -1;
		display: grid;
		min-height: 220px;
		place-items: center;
		border: 1px solid var(--line);
		padding: 32px;
		text-align: center;
	}

	.lime-product-empty h4 {
		margin: 0 0 10px;
		color: var(--plum);
		font-family: var(--font-heading);
		font-size: 20px;
		font-weight: 400;
	}

	.lime-product-empty p {
		margin: 0;
		color: #555;
	}

	.lime-trust {
		margin-top: 70px;
		padding: 50px 40px;
		background: #f5f5f5;
		text-align: center;
	}

	/* Was a text-in-image heading; now real text, sized to occupy the same band. */
	.lime-trust-heading {
		width: 560px;
		max-width: 100%;
		margin: 0 auto 40px;
		color: var(--plum);
		font-family: var(--font-heading);
		font-size: 28px;
		font-weight: 400;
		line-height: 1.3;
	}

	.lime-trust-grid {
		display: grid;
		grid-template-columns: repeat(3, 300px);
		justify-content: center;
		gap: 28px 173px;
	}

	/* Same 300x51 slot the source badge images occupied. */
	.lime-trust-item {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		width: 300px;
		height: 51px;
		margin: 0;
		color: var(--plum);
		font-family: var(--font-heading);
		font-size: 16px;
		font-weight: 400;
		line-height: 1.3;
	}

	.lime-trust-item :global(svg) {
		width: 22px;
		height: 22px;
		flex: none;
		stroke-width: 1.4;
	}

	.lime-story {
		display: grid;
		grid-template-columns: 600px minmax(0, 1fr);
		gap: 70px;
		align-items: center;
		padding-top: 72px;
	}

	.lime-story img {
		height: 443px;
	}

	.lime-story h3,
	.lime-store h3,
	.lime-faq h3 {
		margin: 0 0 18px;
		color: var(--plum);
		font-family: var(--font-heading);
		font-size: 20px;
		font-weight: 400;
		line-height: 1.3;
	}

	.lime-story p,
	.lime-store p,
	.lime-faq p {
		margin: 0 0 24px;
		color: #111;
		font-size: 16px;
		line-height: 28.8px;
	}

	.lime-store {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 600px;
		gap: 70px;
		align-items: center;
		padding-top: 72px;
	}

	.lime-store img {
		height: 343px;
	}

	.lime-faq {
		padding: 76px 0 70px;
	}

	.lime-faq > h3 {
		font-weight: 500;
	}

	.lime-faq-list {
		border-top: 1px solid var(--line);
	}

	.lime-faq details {
		border-bottom: 1px solid var(--line);
	}

	.lime-faq summary {
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

	.lime-faq summary::-webkit-details-marker {
		display: none;
	}

	.lime-faq details[open] .lime-faq-icon {
		transform: rotate(45deg);
	}

	.lime-faq details p {
		max-width: 1120px;
		padding-bottom: 22px;
		font-size: 14px;
		line-height: 25px;
	}

	@media (max-width: 900px) {
		.lime-hero {
			height: 506px;
		}

		.lime-hero img {
			object-position: 53% center;
		}

		.lime-categories {
			padding: 45px 14px 30px;
		}

		.lime-category-row {
			display: flex;
			gap: 14px;
			overflow-x: auto;
			padding-bottom: 8px;
			scroll-snap-type: x mandatory;
		}

		.lime-category {
			flex: 0 0 138px;
			scroll-snap-align: start;
		}

		.lime-category h3 {
			margin-top: 12px;
			font-size: 16px;
		}

		.lime-collage,
		.lime-split-campaign,
		.lime-demand,
		.lime-story,
		.lime-store,
		.lime-faq {
			width: calc(100% - 28px);
		}

		.lime-collage,
		.lime-split-campaign,
		.lime-demand,
		.lime-story,
		.lime-store {
			grid-template-columns: 1fr;
			gap: 16px;
		}

		.lime-collage-large,
		.lime-collage-stack a,
		.lime-split-campaign a,
		.lime-demand-feature,
		.lime-story img,
		.lime-store img {
			height: auto;
		}

		.lime-collage-stack {
			grid-template-rows: auto;
			gap: 16px;
		}

		.lime-split-campaign,
		.lime-demand,
		.lime-story,
		.lime-store {
			padding-top: 16px;
		}

		.lime-demand-feature span {
			bottom: 28px;
			font-size: 24px;
		}

		.lime-product-grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 20px 16px;
			overflow-x: visible;
			padding-bottom: 0;
		}

		.lime-product-grid :global(.ll-card) {
			flex: none;
		}

		.lime-trust {
			margin-top: 34px;
			padding: 38px 14px;
		}

		.lime-trust-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 18px;
		}

		.lime-trust-item {
			width: 100%;
			height: auto;
			gap: 8px;
			font-size: 14px;
		}

		.lime-store {
			display: flex;
			flex-direction: column;
		}

		.lime-store > div {
			order: 2;
		}

		.lime-store > img {
			order: 1;
		}

		.lime-story p,
		.lime-store p {
			font-size: 14px;
			line-height: 25px;
		}

		.lime-faq {
			padding: 42px 0;
		}

		.lime-faq summary {
			font-size: 16px;
		}


	}
</style>
