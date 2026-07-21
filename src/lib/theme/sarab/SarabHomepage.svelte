<script lang="ts">
	import {
		ArrowRight,
		Award,
		BookOpen,
		CalendarCheck,
		ChefHat,
		Circle,
		Clock,
		Flame,
		Heart,
		Leaf,
		Lock,
		Mail,
		MapPin,
		Phone,
		Play,
		Plus,
		Quote,
		Search,
		Send,
		ShoppingCart,
		Star,
		Truck,
		Users,
		Utensils,
		Zap
	} from '@lucide/svelte'
	import { Skeleton } from '$lib/components/ui/skeleton/index.js'
	import { formatPrice } from '$lib/core/utils/index.js'
	import type { ThemeHomepageContent } from '$lib/theme/index.js'

	let {
		themeContent,
		aspectWidth,
		aspectHeight,
		featuredCategories,
		featuredProducts,
		filterButtons,
		homepageModule,
		currencyCode
	}: {
		themeContent: ThemeHomepageContent
		aspectWidth: string
		aspectHeight: string
		featuredCategories: any[]
		featuredProducts: any[]
		filterButtons: string[]
		homepageModule: { loading: boolean; loadingFeaturedProducts: boolean }
		currencyCode?: string
	} = $props()

	let cdH = $state('08')
	let cdM = $state('45')
	let cdS = $state('30')

	$effect(() => {
		const end = Date.now() + (8 * 3600 + 45 * 60 + 30) * 1000
		const tick = setInterval(() => {
			const diff = Math.max(0, end - Date.now())
			cdH = String(Math.floor(diff / 3600000)).padStart(2, '0')
			cdM = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0')
			cdS = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
			if (diff === 0) clearInterval(tick)
		}, 1000)

		return () => clearInterval(tick)
	})
</script>

<section class="sarab-hero" id="hero">
	<div class="hero-shape hero-shape-one"></div>
	<div class="hero-shape hero-shape-two"></div>
	<div class="hero-bg-text">{themeContent.hero.bgText}</div>
	<div class="sarab-container hero-grid">
		<div class="hero-copy">
			<div class="hero-badge">
				<span class="hero-badge-icon"><Star class="h-4 w-4" /></span>
				<span>{themeContent.hero.badge}</span>
			</div>
			<h1>{themeContent.hero.titleLead} <span>{themeContent.hero.titleAccent}</span><br />{themeContent.hero.titleRest}</h1>
			<p class="hero-text">
				{themeContent.hero.text}
			</p>
			<div class="hero-actions">
				<a href="/products" class="sarab-button primary">
					<Utensils class="h-4 w-4" />
					{themeContent.hero.primaryCta}
				</a>
				<a href="/about-us" class="story-button">
					<span><Play class="h-4 w-4 fill-current" /></span>
					{themeContent.hero.secondaryCta}
				</a>
			</div>
			<div class="hero-stats" aria-label="Restaurant highlights">
				{#each themeContent.hero.stats as stat, index}
					<div><strong>{stat.value}<em>{stat.suffix || ''}</em></strong><span>{stat.label}</span></div>
					{#if index < themeContent.hero.stats.length - 1}<i></i>{/if}
				{/each}
			</div>
		</div>

		<div class="hero-plate" aria-label={themeContent.hero.imageAlt}>
			<div class="plate-ring">
				<img src={themeContent.hero.image} alt={themeContent.hero.imageAlt} />
			</div>
			{#each themeContent.hero.floatingCards as card, index}
				<div class="floating-card fc{index + 1}">
					<span class="floating-icon {card.tone}">
						{#if card.icon === 'flame'}<Flame class="h-4 w-4" />
						{:else if card.icon === 'star'}<Star class="h-4 w-4 fill-current" />
						{:else}<Clock class="h-4 w-4" />{/if}
					</span>
					<div><strong>{card.title}</strong><span>{card.text}</span></div>
				</div>
			{/each}
		</div>
	</div>
</section>

<div class="ticker" aria-label="Popular menu categories">
	<div class="ticker-track">
		{#each Array(2) as _}
			{#each themeContent.ticker as item}
				<span><Circle class="h-2 w-2 fill-current" />{item}</span>
			{/each}
		{/each}
	</div>
</div>

<section class="sarab-section category-section" id="category">
	<div class="sarab-container">
		<div class="section-heading">
			<span class="script-label">{themeContent.category.label}</span>
			<h2>{themeContent.category.titleLead} <span>{themeContent.category.titleAccent}</span></h2>
			<div class="section-line"></div>
			<p>{themeContent.category.text}</p>
		</div>

		{#if homepageModule.loading}
			<div class="category-grid">
				{#each Array(6) as _}
					<Skeleton class="aspect-square w-full" />
				{/each}
			</div>
		{:else if featuredCategories.length > 0}
			<div class="category-grid">
				{#each featuredCategories.slice(0, 6) as cat}
					<a href="/categories/{cat.slug || cat._id}" class="category-card">
						{#if cat.image || cat.img}
							<img src={cat.image || cat.img} alt={cat.name} />
						{/if}
						<strong>{cat.name}</strong>
						<span>View items</span>
					</a>
				{/each}
			</div>
		{:else}
			<div class="theme-empty-state">
				<strong>{themeContent.category.emptyTitle}</strong>
				<span>{themeContent.category.emptyText}</span>
			</div>
		{/if}
	</div>
</section>

<section class="sarab-section" id="about">
	<div class="sarab-container story-grid">
		<div class="story-visual">
			<div class="story-photo">
				<img src={themeContent.about.primaryImage} alt={themeContent.about.primaryImageAlt} />
			</div>
			<img class="story-photo-small" src={themeContent.about.secondaryImage} alt={themeContent.about.secondaryImageAlt} />
			<div class="experience-badge"><strong>{themeContent.about.experienceValue}</strong><span>{themeContent.about.experienceText}</span></div>
		</div>
		<div>
			<span class="script-label">{themeContent.about.label}</span>
			<h2>{themeContent.about.titleLead}<br /><span>{themeContent.about.titleAccent}</span></h2>
			<div class="section-line left"></div>
			<p class="body-copy">
				{themeContent.about.text}
			</p>
			<div class="feature-list">
				{#each themeContent.about.features as feature}
					<div>
						<span class="feature-icon {feature.tone}">
							{#if feature.icon === 'leaf'}<Leaf class="h-5 w-5" />
							{:else if feature.icon === 'award'}<Award class="h-5 w-5" />
							{:else}<Zap class="h-5 w-5" />{/if}
						</span>
						<p><strong>{feature.title}</strong><span>{feature.text}</span></p>
					</div>
				{/each}
			</div>
			<a href="/products" class="sarab-button primary">
				<BookOpen class="h-4 w-4" />
				{themeContent.about.cta}
			</a>
		</div>
	</div>
</section>

<section class="sarab-section menu-section" id="menu">
	<div class="sarab-container">
		<div class="section-heading">
			<span class="script-label">{themeContent.menu.label}</span>
			<h2>{themeContent.menu.titleLead} <span>{themeContent.menu.titleAccent}</span></h2>
			<div class="section-line"></div>
		</div>

		<div class="filter-row" aria-label="Menu filters">
			{#each filterButtons as filter, i}
				<button type="button" class:active={i === 0}>{filter}</button>
			{/each}
		</div>

		{#if homepageModule.loadingFeaturedProducts}
			<div class="menu-grid">
				{#each Array(8) as _}
					<div class="menu-card">
						<Skeleton class="aspect-square w-full" />
						<div class="menu-content"><Skeleton class="h-4 w-3/4" /><Skeleton class="h-4 w-1/2" /></div>
					</div>
				{/each}
			</div>
		{:else if featuredProducts.length > 0}
			<div class="menu-grid">
				{#each featuredProducts.slice(0, 6) as product}
					<a href="/products/{product.slug}" class="menu-card">
						<div class="menu-image" style="aspect-ratio:{aspectWidth}/{aspectHeight};">
							<img
								src={product.image || product.img || product.thumbnail}
								alt={product.name || product.title}
							/>
							{#if product.mrp && product.price && product.mrp > product.price}
								<em>{Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off</em>
							{/if}
							<span class="menu-heart"><Heart class="h-4 w-4" /></span>
						</div>
						<div class="menu-content">
							<p>{product.category?.name || 'Menu'}</p>
							<h3>{product.name || product.title}</h3>
							<span class="menu-desc">Freshly prepared with house sauces and premium ingredients.</span>
							<div>
								<strong>{formatPrice(product.price, currencyCode || '')}</strong>
								{#if product.rating}<small><Star class="h-3 w-3 fill-current" /> ({product.rating})</small>{/if}
								<b><Plus class="h-4 w-4" /></b>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<div class="theme-empty-state">
				<strong>{themeContent.menu.emptyTitle}</strong>
				<span>{themeContent.menu.emptyText}</span>
			</div>
		{/if}

		<div class="center-action">
			<a href="/products" class="sarab-button primary">
				<Utensils class="h-4 w-4" />
				{themeContent.menu.cta}
			</a>
		</div>
	</div>
</section>

<section class="special-section" id="special">
	<div class="special-bg"></div>
	<div class="sarab-container offer-grid">
		<div>
			<span class="special-tag">{themeContent.special.label}</span>
			<h2>{themeContent.special.titleLead} <span>{themeContent.special.titleAccent}</span></h2>
			<p>
				{themeContent.special.text}
			</p>
			<div class="countdown" aria-label="Offer countdown">
				<div><strong>{cdH}</strong><span>Hours</span></div>
				<div><strong>{cdM}</strong><span>Minutes</span></div>
				<div><strong>{cdS}</strong><span>Seconds</span></div>
			</div>
			<a href="/products" class="sarab-button primary">
				<ShoppingCart class="h-4 w-4" />
				{themeContent.special.cta}
			</a>
		</div>
		<div class="special-image">
			<div class="special-glow"></div>
			<img src={themeContent.special.image} alt={themeContent.special.imageAlt} />
			<div class="price-badge"><span>{themeContent.special.oldPrice}</span><strong>{themeContent.special.price}</strong></div>
		</div>
	</div>
</section>

<section class="sarab-section gallery-section" id="gallery">
	<div class="sarab-container">
		<div class="section-heading">
			<span class="script-label">{themeContent.gallery.label}</span>
			<h2>{themeContent.gallery.titleLead} <span>{themeContent.gallery.titleAccent}</span></h2>
			<div class="section-line"></div>
		</div>
		<div class="gallery-grid">
			{#each themeContent.gallery.items as item}
				<a href="/products" class="gallery-item">
					<img src={item.image} alt={item.title} />
					<span><Search class="h-4 w-4" /> {item.title}</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<section class="sarab-section history-section" id="history">
	<div class="sarab-container">
		<div class="section-heading">
			<span class="script-label">{themeContent.history.label}</span>
			<h2>{themeContent.history.titleLead} <span>{themeContent.history.titleAccent}</span></h2>
			<div class="section-line"></div>
		</div>
		<div class="timeline">
			{#each themeContent.history.items as item}
				<div class="timeline-item">
					<div><strong>{item[0]}</strong></div>
					<span></span>
					<div><h3>{item[1]}</h3><p>{item[2]}</p></div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="sarab-section chefs-section" id="chefs">
	<div class="sarab-container">
		<div class="section-heading">
			<span class="script-label">{themeContent.chefs.label}</span>
			<h2>{themeContent.chefs.titleLead} <span>{themeContent.chefs.titleAccent}</span></h2>
			<div class="section-line"></div>
		</div>
		<div class="chef-grid">
			{#each themeContent.chefs.items as chef}
				<div class="chef-card">
					<img src={chef.image} alt={chef.name} />
					<div>
						<h3>{chef.name}</h3>
						<span>{chef.role}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="hours-section" id="hours">
	<div class="hours-bg"></div>
	<div class="sarab-container">
		<div class="section-heading hours-heading">
			<span class="script-label">{themeContent.hours.label}</span>
			<h2>{themeContent.hours.titleLead} <span>{themeContent.hours.titleAccent}</span></h2>
			<div class="section-line"></div>
		</div>
		<div class="hours-grid">
			<div class="hours-card">
				{#each themeContent.hours.rows as row}
					<div class="hours-row">
						<span><CalendarCheck class="h-4 w-4" />{row[0]}</span>
						<strong class:closed={!row[2]}><i class:open={row[2]}></i>{row[1]}</strong>
					</div>
				{/each}
			</div>
			<div class="hours-cta">
				<Truck class="h-10 w-10" />
				<h3>{themeContent.hours.orderTitle}</h3>
				<p>{themeContent.hours.orderText}</p>
				<a href="#menu">{themeContent.hours.orderCta}</a>
			</div>
			<div class="hours-card">
				<h3><MapPin class="h-4 w-4" />{themeContent.hours.locationTitle}</h3>
				<div class="hours-row"><span><MapPin class="h-4 w-4" />Address</span><strong>{themeContent.hours.address}</strong></div>
				<div class="hours-row"><span><Phone class="h-4 w-4" />Phone</span><strong>{themeContent.hours.phone}</strong></div>
				<div class="hours-row"><span><Mail class="h-4 w-4" />Email</span><strong>{themeContent.hours.email}</strong></div>
			</div>
		</div>
	</div>
</section>

<section class="sarab-section testimonials-section" id="testimonials">
	<div class="sarab-container">
		<div class="section-heading">
			<span class="script-label">{themeContent.testimonials.label}</span>
			<h2>{themeContent.testimonials.titleLead} <span>{themeContent.testimonials.titleAccent}</span></h2>
			<div class="section-line"></div>
		</div>
		<div class="testimonial-grid">
			{#each themeContent.testimonials.items as testimonial}
				<div class="testimonial-card">
					<Quote class="quote-icon" />
					<div class="stars"><Star class="h-4 w-4 fill-current" /><Star class="h-4 w-4 fill-current" /><Star class="h-4 w-4 fill-current" /><Star class="h-4 w-4 fill-current" /><Star class="h-4 w-4 fill-current" /></div>
					<p>{testimonial.text}</p>
					<div class="testimonial-author">
						<img src={testimonial.image} alt={testimonial.name} />
						<div><strong>{testimonial.name}</strong><span>{testimonial.role}</span></div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="sarab-section reservation-section" id="reservation">
	<div class="sarab-container">
		<div class="section-heading">
			<span class="script-label">{themeContent.reservation.label}</span>
			<h2>{themeContent.reservation.titleLead} <span>{themeContent.reservation.titleAccent}</span></h2>
			<div class="section-line"></div>
			<p>{themeContent.reservation.text}</p>
		</div>
		<div class="reservation-grid">
			<div class="contact-panel">
				<h3>{themeContent.reservation.panelTitle}</h3>
				<p>{themeContent.reservation.panelText}</p>
				<div><Clock class="h-5 w-5" /><span><strong>{themeContent.reservation.hoursLabel}</strong>{themeContent.reservation.hours}</span></div>
				<div><Phone class="h-5 w-5" /><span><strong>{themeContent.reservation.phoneLabel}</strong>{themeContent.reservation.phone}</span></div>
				<div><Users class="h-5 w-5" /><span><strong>{themeContent.reservation.groupLabel}</strong>{themeContent.reservation.group}</span></div>
				<div><MapPin class="h-5 w-5" /><span><strong>{themeContent.reservation.locationLabel}</strong>{themeContent.reservation.location}</span></div>
			</div>
			<form class="source-form" onsubmit={(event) => event.preventDefault()}>
				<label>Full Name *<input type="text" placeholder="John Doe" /></label>
				<label>Phone Number *<input type="tel" placeholder="+1 (800) 000-0000" /></label>
				<label>Email Address *<input type="email" placeholder="you@email.com" /></label>
				<label>Number of Guests *<select><option>2 People</option><option>3 - 4 People</option><option>5 - 6 People</option></select></label>
				<label>Date *<input type="date" /></label>
				<label>Time *<select><option>07:00 PM</option><option>08:00 PM</option><option>09:00 PM</option></select></label>
				<label class="full">Special Requests<textarea rows="3" placeholder="Allergies, dietary needs, special occasions..."></textarea></label>
				<button type="submit" class="sarab-button primary full"><CalendarCheck class="h-4 w-4" />{themeContent.reservation.cta}</button>
			</form>
		</div>
	</div>
</section>

<section class="sarab-section blog-section" id="blog">
	<div class="sarab-container">
		<div class="section-heading">
			<span class="script-label">{themeContent.blog.label}</span>
			<h2>{themeContent.blog.titleLead} <span>{themeContent.blog.titleAccent}</span></h2>
			<div class="section-line"></div>
		</div>
		<div class="blog-grid">
			{#each themeContent.blog.items as blog}
				<article class="blog-card">
					<div class="blog-image">
						<img src={blog.image} alt={blog.title} />
						<div><strong>{blog.date}</strong><span>{blog.month}</span></div>
					</div>
					<div class="blog-body">
						<span>{blog.tag}</span>
						<h3><a href="/blog">{blog.title}</a></h3>
						<p><span><ChefHat class="h-3 w-3" />Chef Marcus</span><span><Mail class="h-3 w-3" />24 Comments</span></p>
						<a href="/blog">Read More <ArrowRight class="h-4 w-4" /></a>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="newsletter" id="newsletter">
	<div class="newsletter-bg"></div>
	<div class="sarab-container newsletter-inner">
		<span class="script-label light">{themeContent.newsletter.label}</span>
		<h2>{themeContent.newsletter.titleLead} <span>{themeContent.newsletter.titleAccent}</span></h2>
		<p>{themeContent.newsletter.text}</p>
		<form onsubmit={(event) => event.preventDefault()}>
			<input type="email" placeholder="Enter your email address..." aria-label="Email address" />
			<button type="submit">
				<Send class="h-4 w-4" />
				{themeContent.newsletter.cta}
			</button>
		</form>
		<small><Lock class="h-3 w-3" />{themeContent.newsletter.privacy}</small>
	</div>
</section>

<section class="sarab-section contact-section" id="contact-section">
	<div class="sarab-container">
		<div class="section-heading">
			<span class="script-label">{themeContent.contact.label}</span>
			<h2>{themeContent.contact.titleLead} <span>{themeContent.contact.titleAccent}</span></h2>
			<div class="section-line"></div>
			<p>{themeContent.contact.text}</p>
		</div>
		<div class="reservation-grid">
			<div class="contact-panel">
				<h3>{themeContent.contact.panelTitle}</h3>
				<p>{themeContent.contact.panelText}</p>
				<div><MapPin class="h-5 w-5" /><span><strong>{themeContent.contact.addressLabel}</strong>{themeContent.contact.address}</span></div>
				<div><Phone class="h-5 w-5" /><span><strong>{themeContent.contact.phoneLabel}</strong>{themeContent.contact.phone}</span></div>
				<div><Mail class="h-5 w-5" /><span><strong>{themeContent.contact.emailLabel}</strong>{themeContent.contact.email}</span></div>
				<div><Clock class="h-5 w-5" /><span><strong>{themeContent.contact.hoursLabel}</strong>{themeContent.contact.hours}</span></div>
			</div>
			<form class="source-form" onsubmit={(event) => event.preventDefault()}>
				<label>Your Name *<input type="text" placeholder="John Doe" /></label>
				<label>Email Address *<input type="email" placeholder="you@email.com" /></label>
				<label>Phone Number<input type="tel" placeholder="+1 (800) 000-0000" /></label>
				<label>Subject *<select><option>General Inquiry</option><option>Catering & Events</option><option>Feedback</option></select></label>
				<label class="full">Message *<textarea rows="5" placeholder="Write your message here..."></textarea></label>
				<button type="submit" class="sarab-button primary"><Send class="h-4 w-4" />{themeContent.contact.cta}</button>
			</form>
		</div>
	</div>
</section>

<style>
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

	.sarab-container {
		width: min(1180px, calc(100% - 32px));
		margin: 0 auto;
	}

	.sarab-hero {
		position: relative;
		min-height: 92vh;
		display: flex;
		align-items: center;
		overflow: hidden;
		background: var(--sarab-cream);
		color: var(--sarab-dark);
	}

	.hero-bg-text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: rgba(0, 0, 0, 0.04);
		font-family: var(--font-heading);
		font-size: 22vw;
		font-weight: 900;
		line-height: 1;
		pointer-events: none;
		white-space: nowrap;
	}

	.hero-shape {
		position: absolute;
		border-radius: 50%;
		pointer-events: none;
	}

	.hero-shape-one {
		top: -90px;
		right: -80px;
		width: 480px;
		height: 480px;
		background: radial-gradient(circle, rgba(232, 40, 26, 0.07), transparent 70%);
		animation: hero-float 8s ease-in-out infinite;
	}

	.hero-shape-two {
		bottom: -50px;
		left: 8%;
		width: 280px;
		height: 280px;
		background: radial-gradient(circle, rgba(246, 166, 35, 0.09), transparent 70%);
		animation: hero-float 10s ease-in-out infinite reverse;
	}

	.sarab-hero > .sarab-container {
		position: relative;
		z-index: 1;
	}

	.hero-grid,
	.story-grid,
	.offer-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(320px, 0.9fr);
		gap: clamp(40px, 7vw, 88px);
		align-items: center;
	}

	.hero-grid {
		min-height: 88vh;
	}

	.eyebrow {
		margin-bottom: 14px;
		color: var(--sarab-red);
		font-size: 0.73rem;
		font-weight: 700;
		letter-spacing: 0.26em;
		text-transform: uppercase;
	}

	.eyebrow.light {
		color: rgba(255, 255, 255, 0.72);
	}

	h1,
	h2,
	h3,
	p {
		margin: 0;
	}

	.hero-copy h1 {
		max-width: 680px;
		color: var(--sarab-dark);
		font-family: var(--font-heading);
		font-size: clamp(2.7rem, 6vw, 4.8rem);
		font-weight: 900;
		line-height: 1.1;
		margin-bottom: 18px;
	}

	.hero-copy h1 span {
		position: relative;
		z-index: 0;
		display: inline-block;
		color: var(--sarab-red);
	}

	.hero-copy h1 span::before {
		content: '';
		position: absolute;
		right: 0;
		bottom: 2px;
		left: 0;
		z-index: -1;
		height: 7px;
		border-radius: 4px;
		background: rgba(232, 40, 26, 0.14);
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 22px;
		padding: 6px 16px 6px 6px;
		border-radius: 30px;
		background: #ffffff;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
	}

	.hero-badge-icon {
		display: grid;
		width: 30px;
		height: 30px;
		place-items: center;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--sarab-red), var(--sarab-gold));
		color: #ffffff;
	}

	.hero-badge span:last-child {
		color: var(--sarab-dark);
		font-size: 0.76rem;
		font-weight: 600;
	}

	.hero-text {
		max-width: 470px;
		margin-top: 18px;
		color: #666666;
		font-size: 1rem;
		line-height: 1.8;
	}

	.hero-actions,
	.center-action {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
		margin-top: 32px;
	}

	.sarab-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 9px;
		min-height: 52px;
		padding: 14px 32px;
		border: 1px solid transparent;
		border-radius: 50px;
		font-size: 0.93rem;
		font-weight: 600;
		letter-spacing: 0;
		text-transform: none;
		transition:
			transform 180ms ease,
			box-shadow 180ms ease,
			background 180ms ease;
	}

	.sarab-button:hover {
		transform: translateY(-2px);
	}

	.sarab-button.primary {
		background: linear-gradient(135deg, var(--sarab-red), var(--sarab-red-dark));
		color: #ffffff;
		box-shadow: 0 8px 24px rgba(232, 40, 26, 0.35);
	}

	.sarab-button.primary:hover {
		box-shadow: 0 14px 34px rgba(232, 40, 26, 0.45);
	}

	.story-button {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		padding: 10px 16px;
		color: var(--sarab-dark);
		font-size: 0.9rem;
		font-weight: 600;
		transition:
			color 180ms ease,
			transform 180ms ease;
	}

	.story-button span {
		display: grid;
		width: 48px;
		height: 48px;
		place-items: center;
		border-radius: 50%;
		background: #ffffff;
		color: var(--sarab-red);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
		transition:
			background 180ms ease,
			color 180ms ease,
			transform 180ms ease;
	}

	.story-button:hover {
		color: var(--sarab-red);
	}

	.story-button:hover span {
		transform: scale(1.1);
		background: var(--sarab-red);
		color: #ffffff;
	}

	.hero-stats {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		margin-top: 32px;
	}

	.hero-stats div,
	.countdown div {
		display: grid;
		gap: 4px;
	}

	.hero-stats strong,
	.countdown strong {
		color: var(--sarab-dark);
		font-family: var(--font-heading);
		font-size: 1.9rem;
		font-weight: 900;
		line-height: 1;
	}

	.hero-stats em {
		color: var(--sarab-red);
		font-style: normal;
	}

	.hero-stats i {
		width: 1px;
		height: 38px;
		align-self: center;
		background: #dddddd;
	}

	.hero-stats span,
	.countdown span {
		color: #aaaaaa;
		font-size: 0.7rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.hero-plate {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 520px;
	}

	.plate-ring {
		width: min(82vw, 480px);
		aspect-ratio: 1;
		display: grid;
		place-items: center;
		overflow: hidden;
		border-radius: 50%;
		background: radial-gradient(circle at 40% 40%, #fff8f0, #ffe5c8);
		box-shadow: 0 28px 76px rgba(232, 40, 26, 0.14);
	}

	.plate-ring img {
		width: 90%;
		height: 90%;
		border-radius: 50%;
		object-fit: cover;
	}

	.plate-monogram {
		font-family: var(--font-heading);
		font-size: clamp(6rem, 18vw, 10rem);
		font-weight: 900;
		color: var(--sarab-red);
	}

	.floating-card {
		position: absolute;
		display: flex;
		align-items: center;
		gap: 9px;
		min-width: 138px;
		background: #ffffff;
		color: var(--sarab-dark);
		padding: 10px 15px;
		border-radius: 11px;
		box-shadow: var(--sarab-shadow);
	}

	.floating-card.fc1 {
		top: 55px;
		left: -15px;
		animation: card-float 4s ease-in-out infinite;
	}

	.floating-card.fc2 {
		right: -25px;
		bottom: 75px;
		animation: card-float 4s ease-in-out infinite 1.5s;
	}

	.floating-card.fc3 {
		top: 38%;
		right: -45px;
		animation: card-float 4s ease-in-out infinite 0.8s;
	}

	.floating-card div span,
	.menu-content p,
	.offer-price span,
	.offer-price small,
	.testimonial-card span {
		display: block;
		color: #858585;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.floating-card .floating-icon {
		display: grid;
		width: 34px;
		height: 34px;
		place-items: center;
		border-radius: 8px;
		flex: 0 0 auto;
	}

	.floating-card .floating-icon.r {
		background: rgba(232, 40, 26, 0.11);
		color: var(--sarab-red);
	}

	.floating-card .floating-icon.y {
		background: rgba(246, 166, 35, 0.14);
		color: var(--sarab-gold);
	}

	.floating-card .floating-icon.g {
		background: rgba(45, 106, 79, 0.11);
		color: var(--sarab-green);
	}

	.floating-card strong {
		display: block;
		color: var(--sarab-dark);
		font-size: 0.92rem;
		line-height: 1;
	}

	.ticker {
		overflow: hidden;
		background: var(--sarab-red);
		padding: 16px 0;
	}

	.ticker-track {
		display: flex;
		width: max-content;
		animation: ticker 28s linear infinite;
	}

	.ticker span {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 0 34px;
		color: #ffffff;
		font-size: 0.78rem;
		font-weight: 800;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.sarab-section {
		padding: clamp(72px, 9vw, 112px) 0;
		background: #ffffff;
	}

	.sarab-section.warm {
		background: var(--sarab-light);
	}

	.section-heading {
		max-width: 620px;
		margin: 0 auto 44px;
		text-align: center;
	}

	.section-heading h2,
	.story-grid h2,
	.newsletter h2 {
		color: var(--sarab-dark);
		font-family: var(--font-heading);
		font-size: clamp(1.9rem, 4vw, 2.7rem);
		font-weight: 900;
		line-height: 1.2;
		margin-bottom: 12px;
	}

	.section-heading p:not(.eyebrow),
	.body-copy {
		margin-top: 14px;
		color: #686868;
		line-height: 1.75;
	}

	.category-grid,
	.menu-grid {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 18px;
	}

	.category-tile,
	.menu-card {
		overflow: hidden;
		background: #ffffff;
		color: var(--sarab-dark);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
		transition:
			transform 180ms ease,
			box-shadow 180ms ease;
	}

	.category-tile:hover,
	.menu-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--sarab-shadow);
	}

	.category-tile {
		aspect-ratio: 1;
		display: flex;
		flex-direction: column;
		justify-content: end;
		position: relative;
		padding: 18px;
	}

	.category-tile img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 300ms ease;
	}

	.category-tile:hover img {
		transform: scale(1.05);
	}

	.category-tile::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.64));
	}

	.category-tile strong,
	.category-tile span {
		position: relative;
		z-index: 1;
		color: #ffffff;
	}

	.category-tile.fallback {
		background: var(--sarab-dark);
	}

	.category-tile.fallback strong {
		color: #ffffff;
	}

	.category-tile.fallback span {
		color: rgba(255, 255, 255, 0.74);
	}

	.story-visual {
		position: relative;
		min-height: 440px;
	}

	.story-photo {
		width: min(100%, 420px);
		height: 440px;
		overflow: hidden;
		background: var(--sarab-dark);
		box-shadow: var(--sarab-shadow-lg);
	}

	.story-photo img,
	.story-photo-small {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.story-photo-small {
		position: absolute;
		right: 8px;
		bottom: 12px;
		width: 180px;
		height: 180px;
		border: 10px solid #ffffff;
		box-shadow: var(--sarab-shadow-lg);
	}

	.experience-badge {
		position: absolute;
		left: -12px;
		top: 42px;
		width: 154px;
		height: 154px;
		display: grid;
		place-items: center;
		align-content: center;
		gap: 8px;
		background: var(--sarab-red);
		color: #ffffff;
		text-align: center;
		box-shadow: var(--sarab-shadow-lg);
	}

	.experience-badge strong {
		font-family: var(--font-heading);
		font-size: 2.5rem;
		line-height: 1;
	}

	.experience-badge span {
		max-width: 96px;
		font-size: 0.72rem;
		line-height: 1.4;
		text-transform: uppercase;
	}

	.feature-list {
		display: grid;
		gap: 18px;
		margin: 28px 0 32px;
	}

	.feature-list div {
		display: flex;
		align-items: flex-start;
		gap: 14px;
	}

	.feature-icon {
		display: grid;
		width: 44px;
		height: 44px;
		place-items: center;
		border-radius: 11px;
		flex: 0 0 auto;
	}

	.feature-icon.r {
		background: rgba(232, 40, 26, 0.11);
		color: var(--sarab-red);
	}

	.feature-icon.y {
		background: rgba(246, 166, 35, 0.14);
		color: var(--sarab-gold);
	}

	.feature-icon.g {
		background: rgba(45, 106, 79, 0.11);
		color: var(--sarab-green);
	}

	.feature-list strong {
		display: block;
		color: var(--sarab-dark);
		font-size: 1rem;
	}

	.feature-list span {
		display: block;
		margin-top: 3px;
		color: #707070;
		font-size: 0.9rem;
	}

	.menu-grid {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.menu-image {
		position: relative;
		overflow: hidden;
		background: var(--sarab-cream);
		aspect-ratio: 1;
	}

	.menu-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 300ms ease;
	}

	.menu-card:hover .menu-image img {
		transform: scale(1.05);
	}

	.menu-image > span,
	.menu-image em {
		position: absolute;
		left: 12px;
		top: 12px;
		background: var(--sarab-red);
		color: #ffffff;
		padding: 6px 9px;
		font-size: 0.7rem;
		font-style: normal;
		font-weight: 800;
		text-transform: uppercase;
	}

	.menu-image.placeholder {
		background: var(--sarab-cream);
	}

	.menu-image.placeholder img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.menu-image.placeholder em {
		left: 12px;
		top: 12px;
	}

	.menu-content {
		display: grid;
		gap: 8px;
		padding: 18px;
	}

	.menu-content p {
		color: var(--sarab-red);
	}

	.menu-content h3 {
		min-height: 2.5em;
		color: var(--sarab-dark);
		font-size: 1.05rem;
		line-height: 1.25;
	}

	.menu-content div {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.menu-content strong {
		color: var(--sarab-dark);
		font-size: 1.08rem;
	}

	.menu-content small {
		color: #858585;
		font-size: 0.75rem;
		white-space: nowrap;
	}

	.center-action {
		justify-content: center;
	}

	.offer-section,
	.newsletter {
		padding: clamp(72px, 9vw, 112px) 0;
		background:
			radial-gradient(circle at 75% 40%, rgba(232, 40, 26, 0.18), transparent 34%),
			var(--sarab-dark);
		color: #ffffff;
	}

	.offer-grid h2,
	.newsletter h2 {
		color: #ffffff;
	}

	.offer-grid p:not(.eyebrow),
	.newsletter p:not(.eyebrow) {
		max-width: 560px;
		margin-top: 16px;
		color: rgba(255, 255, 255, 0.68);
		line-height: 1.75;
	}

	.countdown {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
		margin: 30px 0;
	}

	.countdown div {
		min-width: 92px;
		padding: 18px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.06);
		text-align: center;
	}

	.countdown strong {
		color: var(--sarab-red);
	}

	.offer-price {
		position: relative;
		overflow: hidden;
		min-height: 320px;
		background: var(--sarab-dark);
		border: 1px solid rgba(255, 255, 255, 0.12);
		text-align: center;
	}

	.offer-price::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 20%, rgba(0, 0, 0, 0.74));
	}

	.offer-price img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.offer-price div {
		position: relative;
		z-index: 1;
		display: grid;
		min-height: 320px;
		place-items: center;
		align-content: center;
		padding: 28px;
	}

	.offer-price strong {
		margin-top: 12px;
		color: #ffffff;
		font-family: var(--font-heading);
		font-size: clamp(3.4rem, 10vw, 6rem);
		line-height: 1;
	}

	.offer-price small {
		margin-top: 14px;
		color: rgba(255, 255, 255, 0.54);
	}

	.testimonial-card {
		max-width: 720px;
		margin: 0 auto;
		padding: clamp(28px, 5vw, 48px);
		background: var(--sarab-light);
		box-shadow: var(--sarab-shadow);
	}

	.testimonial-card p {
		color: #4e4e4e;
		font-size: clamp(1rem, 2.4vw, 1.25rem);
		line-height: 1.85;
	}

	.testimonial-card div {
		margin-top: 24px;
	}

	.testimonial-card strong {
		display: block;
		color: var(--sarab-dark);
	}

	.testimonial-dots {
		display: flex;
		justify-content: center;
		gap: 8px;
		margin-top: 22px;
	}

	.testimonial-dots button {
		width: 9px;
		height: 9px;
		border: 0;
		border-radius: 999px;
		background: #cfcfcf;
		transition: width 180ms ease;
	}

	.testimonial-dots button.active {
		width: 30px;
		background: var(--sarab-red);
	}

	.newsletter {
		background: var(--sarab-red);
		text-align: center;
	}

	.newsletter-inner {
		max-width: 720px;
	}

	.newsletter p:not(.eyebrow) {
		margin-left: auto;
		margin-right: auto;
	}

	.newsletter form {
		display: flex;
		max-width: 620px;
		margin: 30px auto 0;
		background: #ffffff;
		box-shadow: var(--sarab-shadow-lg);
	}

	.newsletter input {
		min-width: 0;
		flex: 1;
		border: 0;
		padding: 18px 22px;
		color: var(--sarab-dark);
		outline: none;
	}

	.newsletter button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 9px;
		border: 0;
		background: var(--sarab-dark);
		color: #ffffff;
		padding: 0 26px;
		font-size: 0.82rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.script-label {
		display: block;
		margin-bottom: 4px;
		color: var(--sarab-red);
		font-family: 'Dancing Script', cursive;
		font-size: 1.35rem;
		letter-spacing: 0;
		text-transform: none;
	}

	.script-label.light {
		color: rgba(255, 255, 255, 0.72);
	}

	.section-heading h2 span,
	.story-grid h2 span,
	.special-section h2 span,
	.hours-section h2 span,
	.newsletter h2 span {
		color: var(--sarab-red);
	}

	.section-line {
		width: 58px;
		height: 4px;
		margin: 0 auto 12px;
		border-radius: 4px;
		background: linear-gradient(90deg, var(--sarab-red), var(--sarab-gold));
	}

	.section-line.left {
		margin-left: 0;
	}

	.category-section {
		background: var(--sarab-cream);
	}

	.category-card {
		display: block;
		padding: 22px 14px;
		border: 2px solid transparent;
		border-radius: 15px;
		background: #ffffff;
		box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
		color: var(--sarab-dark);
		text-align: center;
		transition:
			transform 240ms ease,
			border-color 240ms ease,
			box-shadow 240ms ease;
	}

	.category-card:hover,
	.category-card.active {
		transform: translateY(-7px);
		border-color: var(--sarab-red);
		box-shadow: 0 14px 38px rgba(232, 40, 26, 0.14);
	}

	.category-card img {
		width: 86px;
		height: 86px;
		margin: 0 auto 12px;
		border-radius: 50%;
		object-fit: cover;
		transition: transform 240ms ease;
	}

	.category-card:hover img {
		transform: scale(1.1) rotate(-4deg);
	}

	.category-card strong {
		display: block;
		margin-bottom: 3px;
		color: var(--sarab-dark);
		font-size: 0.86rem;
		font-weight: 600;
	}

	.category-card span {
		color: #bbbbbb;
		font-size: 0.73rem;
	}

	.story-photo,
	.story-photo-small,
	.experience-badge {
		border-radius: 18px;
	}

	.story-photo-small {
		right: -26px;
		bottom: -26px;
		width: 170px;
		height: 170px;
		border-width: 5px;
		border-radius: 14px;
	}

	.experience-badge {
		top: 28px;
		left: -16px;
		width: auto;
		height: auto;
		padding: 18px 22px;
		border-radius: 14px;
	}

	.filter-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
		margin: -16px 0 34px;
	}

	.filter-row button {
		border: 2px solid #e5e5e5;
		border-radius: 50px;
		background: #ffffff;
		color: #666666;
		padding: 8px 20px;
		font-size: 0.84rem;
		font-weight: 600;
		transition:
			background 180ms ease,
			border-color 180ms ease,
			color 180ms ease,
			box-shadow 180ms ease;
	}

	.filter-row button.active,
	.filter-row button:hover {
		border-color: var(--sarab-red);
		background: var(--sarab-red);
		color: #ffffff;
		box-shadow: 0 5px 18px rgba(232, 40, 26, 0.24);
	}

	.menu-section {
		background: var(--sarab-light);
	}

	.menu-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
	}

	.menu-card {
		border-radius: 18px;
		box-shadow: 0 4px 22px rgba(0, 0, 0, 0.07);
	}

	.menu-card:hover {
		transform: translateY(-9px);
		box-shadow: 0 18px 48px rgba(0, 0, 0, 0.13);
	}

	.menu-image {
		height: 215px;
		aspect-ratio: auto;
		background: var(--sarab-cream2);
	}

	.menu-image > span.menu-heart {
		position: absolute;
		top: 13px;
		right: 13px;
		left: auto;
		display: grid;
		width: 33px;
		height: 33px;
		place-items: center;
		border-radius: 50%;
		background: #ffffff;
		color: #cccccc;
		box-shadow: 0 2px 9px rgba(0, 0, 0, 0.1);
	}

	.menu-image > em {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		border-radius: 7px;
		background: var(--sarab-green);
		padding: 3px 11px;
		font-size: 0.7rem;
		font-weight: 700;
	}

	.menu-image > em.hot {
		background: var(--sarab-gold);
		color: var(--sarab-dark);
	}

	.menu-content p {
		color: var(--sarab-gold);
		font-size: 0.7rem;
		letter-spacing: 1px;
	}

	.menu-content h3 {
		min-height: 0;
		font-family: var(--font-heading);
		font-size: 1.05rem;
		font-weight: 700;
	}

	.menu-desc {
		display: block;
		color: #aaaaaa;
		font-size: 0.78rem;
		line-height: 1.5;
	}

	.menu-content div {
		display: grid;
		grid-template-columns: 1fr auto auto;
		align-items: center;
	}

	.menu-content strong {
		color: var(--sarab-red);
		font-family: var(--font-heading);
		font-size: 1.25rem;
		font-weight: 800;
	}

	.menu-content del {
		margin-left: 5px;
		color: #cccccc;
		font-family: var(--font-body);
		font-size: 0.72rem;
		font-weight: 400;
	}

	.menu-content small {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		color: var(--sarab-gold);
	}

	.menu-content b {
		display: grid;
		width: 36px;
		height: 36px;
		place-items: center;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--sarab-red), var(--sarab-red-dark));
		color: #ffffff;
		box-shadow: 0 4px 11px rgba(232, 40, 26, 0.28);
	}

	.special-section {
		position: relative;
		overflow: hidden;
		padding: clamp(72px, 9vw, 112px) 0;
		background: linear-gradient(135deg, #1a0000 0%, #2d0000 100%);
		color: #ffffff;
	}

	.special-bg {
		position: absolute;
		inset: 0;
		opacity: 0.03;
		background: repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%);
		background-size: 40px 40px;
	}

	.special-section .sarab-container {
		position: relative;
		z-index: 1;
	}

	.special-tag {
		display: inline-block;
		margin-bottom: 14px;
		padding: 4px 15px;
		border-radius: 6px;
		background: var(--sarab-gold);
		color: var(--sarab-dark);
		font-size: 0.76rem;
		font-weight: 700;
		letter-spacing: 2px;
		text-transform: uppercase;
	}

	.special-section h2 {
		color: #ffffff;
		font-size: clamp(2.3rem, 5vw, 3.8rem);
		font-weight: 900;
		line-height: 1.1;
	}

	.special-section p {
		max-width: 560px;
		margin: 18px 0;
		color: rgba(255, 255, 255, 0.62);
		line-height: 1.8;
	}

	.countdown div {
		min-width: 72px;
		border-radius: 11px;
	}

	.countdown strong {
		color: #ffffff;
		font-size: 2.1rem;
	}

	.countdown span {
		color: rgba(255, 255, 255, 0.48);
	}

	.special-image {
		position: relative;
		text-align: center;
	}

	.special-glow {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 360px;
		height: 360px;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		background: radial-gradient(circle, rgba(246, 166, 35, 0.24), transparent 70%);
	}

	.special-image img {
		position: relative;
		z-index: 1;
		width: min(100%, 440px);
		filter: drop-shadow(0 28px 56px rgba(246, 166, 35, 0.28));
		animation: hero-float 5s ease-in-out infinite;
	}

	.price-badge {
		position: absolute;
		top: 18px;
		left: 18px;
		z-index: 2;
		display: grid;
		width: 86px;
		height: 86px;
		place-items: center;
		align-content: center;
		border-radius: 50%;
		background: var(--sarab-red);
		box-shadow: 0 8px 24px rgba(232, 40, 26, 0.5);
		color: #ffffff;
	}

	.price-badge span {
		font-size: 0.68rem;
		text-decoration: line-through;
		opacity: 0.7;
	}

	.price-badge strong {
		font-size: 1.25rem;
	}

	.gallery-section,
	.blog-section,
	.reservation-section {
		background: var(--sarab-light);
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(2, 215px);
		gap: 13px;
	}

	.gallery-item {
		position: relative;
		overflow: hidden;
		border-radius: 14px;
	}

	.gallery-item:first-child {
		grid-row: span 2;
	}

	.gallery-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 300ms ease;
	}

	.gallery-item:hover img {
		transform: scale(1.08);
	}

	.gallery-item span {
		position: absolute;
		inset: auto 0 0;
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 18px;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.76), transparent);
		color: #ffffff;
		font-weight: 600;
		opacity: 0;
		transition: opacity 180ms ease;
	}

	.gallery-item:hover span {
		opacity: 1;
	}

	.history-section {
		background: var(--sarab-cream);
	}

	.timeline {
		position: relative;
		display: grid;
		gap: 34px;
		max-width: 840px;
		margin: 0 auto;
	}

	.timeline::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		width: 2px;
		background: linear-gradient(to bottom, var(--sarab-red), var(--sarab-gold));
	}

	.timeline-item {
		display: grid;
		grid-template-columns: 1fr 36px 1fr;
		align-items: center;
		gap: 24px;
	}

	.timeline-item:nth-child(even) div:first-child {
		grid-column: 3;
		grid-row: 1;
	}

	.timeline-item:nth-child(even) div:last-child {
		grid-column: 1;
		grid-row: 1;
		text-align: right;
	}

	.timeline-item > span {
		position: relative;
		z-index: 1;
		display: block;
		width: 18px;
		height: 18px;
		margin: auto;
		border: 4px solid var(--sarab-cream);
		border-radius: 50%;
		background: var(--sarab-red);
		box-shadow: 0 0 0 2px var(--sarab-gold);
	}

	.timeline-item strong {
		color: var(--sarab-red);
		font-family: var(--font-heading);
		font-size: 2.4rem;
	}

	.timeline-item h3 {
		font-size: 1.1rem;
	}

	.timeline-item p {
		color: #777777;
		font-size: 0.86rem;
		line-height: 1.7;
	}

	.chef-grid,
	.blog-grid,
	.testimonial-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 24px;
	}

	.chef-card,
	.blog-card,
	.testimonial-card {
		overflow: hidden;
		border-radius: 18px;
		background: #ffffff;
		box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
		transition:
			transform 180ms ease,
			box-shadow 180ms ease;
	}

	.chef-card:hover,
	.blog-card:hover,
	.testimonial-card:hover {
		transform: translateY(-7px);
		box-shadow: var(--sarab-shadow-lg);
	}

	.chef-card img {
		width: 100%;
		height: 260px;
		object-fit: cover;
	}

	.chef-card div {
		padding: 18px;
		text-align: center;
	}

	.chef-card h3 {
		font-size: 1rem;
	}

	.chef-card span {
		color: var(--sarab-red);
		font-size: 0.78rem;
		font-weight: 600;
	}

	.hours-section {
		position: relative;
		overflow: hidden;
		padding: clamp(72px, 9vw, 112px) 0;
		background: linear-gradient(135deg, var(--sarab-green), #1a4a35);
		color: #ffffff;
	}

	.hours-bg {
		position: absolute;
		inset: 0;
		opacity: 0.05;
		background: repeating-linear-gradient(
			45deg,
			#ffffff,
			#ffffff 10px,
			transparent 10px,
			transparent 20px
		);
	}

	.hours-section > .sarab-container {
		position: relative;
		z-index: 1;
	}

	.hours-heading {
		margin-bottom: 44px;
	}

	.hours-heading .script-label {
		color: #a5d6bc;
	}

	.hours-grid {
		display: grid;
		grid-template-columns: 5fr 3fr 4fr;
		gap: 24px;
		align-items: start;
	}

	.hours-section h2 {
		color: #ffffff;
	}

	.hours-section h2 span {
		color: var(--sarab-gold);
	}

	.hours-card {
		display: grid;
		gap: 0;
		padding: 24px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 18px;
		background: rgba(0, 0, 0, 0.18);
		backdrop-filter: blur(12px);
	}

	.hours-card h3 {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 18px;
		color: #ffffff;
		font-family: var(--font-body);
		font-size: 0.95rem;
		font-weight: 700;
	}

	.hours-card h3 svg,
	.hours-row svg {
		color: var(--sarab-gold);
	}

	.hours-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 13px 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.hours-row:last-child {
		border-bottom: 0;
	}

	.hours-row span,
	.hours-row strong {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.hours-row span {
		color: rgba(255, 255, 255, 0.74);
		font-size: 0.9rem;
	}

	.hours-row strong {
		color: #ffffff;
		font-size: 0.86rem;
		font-weight: 600;
		text-align: right;
	}

	.hours-row strong.closed {
		color: #ff6b6b;
	}

	.hours-row strong i {
		width: 9px;
		height: 9px;
		border-radius: 999px;
		background: #ff6b6b;
	}

	.hours-row strong i.open {
		background: #50e3a4;
		box-shadow: 0 0 0 4px rgba(80, 227, 164, 0.12);
	}

	.hours-cta {
		min-height: 100%;
		padding: 28px;
		border-radius: 18px;
		background: var(--sarab-red);
		box-shadow: 0 18px 48px rgba(232, 40, 26, 0.4);
		text-align: center;
	}

	.hours-cta svg {
		margin: 0 auto 12px;
		color: rgba(255, 255, 255, 0.8);
	}

	.hours-cta h3 {
		color: #ffffff;
		font-family: var(--font-heading);
		font-size: 1.4rem;
		font-weight: 800;
	}

	.hours-cta p {
		margin: 9px auto 18px;
		color: rgba(255, 255, 255, 0.78);
		font-size: 0.86rem;
		line-height: 1.5;
	}

	.hours-cta a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 43px;
		border-radius: 50px;
		background: #ffffff;
		padding: 0 28px;
		color: var(--sarab-red);
		font-size: 0.88rem;
		font-weight: 700;
		transition: transform 180ms ease, box-shadow 180ms ease;
	}

	.hours-cta a:hover {
		transform: translateY(-3px);
		box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
	}

	.testimonial-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.testimonial-card {
		position: relative;
		max-width: none;
		padding: 28px;
		background: #ffffff;
	}

	.quote-icon {
		position: absolute;
		top: 18px;
		right: 22px;
		width: 64px;
		height: 64px;
		color: rgba(232, 40, 26, 0.07);
	}

	.stars {
		display: flex;
		gap: 3px;
		margin-bottom: 12px;
		color: var(--sarab-gold);
	}

	.testimonial-author {
		display: flex;
		align-items: center;
		gap: 11px;
		margin-top: 18px;
	}

	.testimonial-author img {
		width: 46px;
		height: 46px;
		border: 3px solid var(--sarab-red);
		border-radius: 50%;
		object-fit: cover;
	}

	.reservation-grid {
		display: grid;
		grid-template-columns: 0.45fr 1fr;
		gap: 24px;
		align-items: start;
	}

	.contact-panel {
		height: 100%;
		padding: 36px;
		border-radius: 18px;
		background: var(--sarab-dark);
		color: #ffffff;
	}

	.contact-panel h3 {
		color: #ffffff;
		font-size: 1.3rem;
	}

	.contact-panel > p {
		margin: 8px 0 26px;
		color: rgba(255, 255, 255, 0.58);
		font-size: 0.85rem;
	}

	.contact-panel div {
		display: flex;
		align-items: center;
		gap: 13px;
		margin-bottom: 16px;
		color: var(--sarab-red);
	}

	.contact-panel div > svg {
		width: 46px;
		height: 46px;
		padding: 12px;
		border-radius: 11px;
		background: rgba(232, 40, 26, 0.2);
		flex: 0 0 auto;
	}

	.contact-panel span {
		color: #ffffff;
		font-size: 0.87rem;
	}

	.contact-panel strong {
		display: block;
		color: #cccccc;
		font-size: 0.78rem;
		letter-spacing: 0.8px;
		text-transform: uppercase;
	}

	.source-form {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
		padding: 32px;
		border-radius: 18px;
		background: #ffffff;
		box-shadow: 0 6px 30px rgba(0, 0, 0, 0.08);
	}

	.source-form label {
		display: grid;
		gap: 5px;
		color: var(--sarab-dark);
		font-size: 0.83rem;
		font-weight: 600;
	}

	.source-form .full {
		grid-column: 1 / -1;
	}

	.source-form input,
	.source-form select,
	.source-form textarea {
		width: 100%;
		border: 2px solid #eeeeee;
		border-radius: 9px;
		background: #ffffff;
		color: var(--sarab-dark);
		padding: 11px 15px;
		font-family: var(--font-body);
		font-size: 0.88rem;
		outline: none;
		transition: border-color 180ms ease;
	}

	.source-form input:focus,
	.source-form select:focus,
	.source-form textarea:focus {
		border-color: var(--sarab-red);
	}

	.blog-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.blog-image {
		position: relative;
		height: 195px;
		overflow: hidden;
	}

	.blog-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 300ms ease;
	}

	.blog-card:hover .blog-image img {
		transform: scale(1.06);
	}

	.blog-image div {
		position: absolute;
		top: 14px;
		left: 14px;
		display: grid;
		padding: 5px 11px;
		border-radius: 9px;
		background: var(--sarab-red);
		color: #ffffff;
		text-align: center;
		line-height: 1.2;
	}

	.blog-image strong {
		font-size: 1.15rem;
	}

	.blog-image span {
		font-size: 0.63rem;
		letter-spacing: 0.8px;
		text-transform: uppercase;
	}

	.blog-body {
		padding: 20px;
	}

	.blog-body > span {
		color: var(--sarab-red);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.8px;
		text-transform: uppercase;
	}

	.blog-body h3 {
		margin: 7px 0 9px;
		font-size: 1rem;
		line-height: 1.4;
	}

	.blog-body p {
		display: flex;
		gap: 14px;
		margin-bottom: 13px;
		color: #bbbbbb;
		font-size: 0.76rem;
	}

	.blog-body p span,
	.blog-body a {
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}

	.blog-body a {
		color: var(--sarab-red);
		font-size: 0.8rem;
		font-weight: 600;
	}

	.newsletter {
		position: relative;
		overflow: hidden;
		padding: 80px 0;
		background: linear-gradient(135deg, var(--sarab-red), #8b0000);
	}

	.newsletter-bg {
		position: absolute;
		inset: 0;
		background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ccircle cx='50' cy='50' r='40' fill='none' stroke='white' stroke-width='.4' opacity='.1'/%3E%3C/svg%3E");
		background-size: 75px;
	}

	.newsletter-inner {
		position: relative;
		z-index: 1;
	}

	.newsletter h2 {
		color: #ffffff;
		font-size: 2.1rem;
	}

	.newsletter form {
		align-items: center;
		gap: 10px;
		background: transparent;
		box-shadow: none;
	}

	.newsletter input {
		border-radius: 50px;
		padding: 14px 22px;
	}

	.newsletter button {
		min-height: 50px;
		border-radius: 50px;
		background: var(--sarab-gold);
		color: var(--sarab-dark);
		font-size: 0.9rem;
		font-weight: 700;
		letter-spacing: 0;
		text-transform: none;
	}

	.newsletter small {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		margin-top: 11px;
		color: rgba(255, 255, 255, 0.45);
		font-size: 0.76rem;
	}

	@keyframes ticker {
		to {
			transform: translateX(-50%);
		}
	}

	@keyframes hero-float {
		50% {
			transform: translateY(-28px);
		}
	}

	@keyframes card-float {
		50% {
			transform: translateY(-9px);
		}
	}

	@media (max-width: 980px) {
		.hero-grid,
		.story-grid,
		.offer-grid {
			grid-template-columns: 1fr;
		}

		.hero-plate {
			min-height: 340px;
		}

		.category-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.menu-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.gallery-grid,
		.chef-grid,
		.hours-grid,
		.testimonial-grid,
		.reservation-grid,
		.blog-grid {
			grid-template-columns: 1fr;
		}

		.gallery-item:first-child {
			grid-row: span 1;
		}
	}

	@media (max-width: 640px) {
		.sarab-hero {
			min-height: auto;
			padding: 72px 0;
		}

		.hero-copy h1 {
			font-size: 2.4rem;
		}

		.section-heading h2,
		.story-grid h2,
		.newsletter h2 {
			font-size: 1.8rem;
		}

		.hero-stats {
			display: none;
		}

		.hero-plate {
			display: flex;
			min-height: 280px;
		}

		.plate-ring {
			width: min(78vw, 260px);
		}

		.floating-card {
			display: none;
		}

		.hero-bg-text {
			font-size: 34vw;
		}

		.category-grid,
		.menu-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 14px;
		}

		.gallery-grid {
			grid-template-columns: 1fr;
		}

		.category-tile {
			padding: 14px;
		}

		.story-visual {
			min-height: 340px;
		}

		.story-photo {
			height: 340px;
		}

		.experience-badge {
			width: 124px;
			height: 124px;
		}

		.newsletter form {
			display: grid;
		}

		.newsletter button {
			min-height: 52px;
		}
	}
</style>
