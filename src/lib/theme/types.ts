/** A picture tile that optionally links somewhere — category grids, collages, seasonal promos. */
export interface ThemeTile {
	image: string
	imageAlt?: string
	title?: string
	href?: string
}

/** Reservation-form copy (labels, placeholders, select options) — all store-editable. */
export interface ThemeReservationForm {
	nameLabel: string
	namePlaceholder: string
	phoneLabel: string
	phonePlaceholder: string
	emailLabel: string
	emailPlaceholder: string
	guestsLabel: string
	guestsOptions: string[]
	dateLabel: string
	timeLabel: string
	timeOptions: string[]
	requestsLabel: string
	requestsPlaceholder: string
}

/** Contact-form copy (labels, placeholders, select options) — all store-editable. */
export interface ThemeContactForm {
	nameLabel: string
	namePlaceholder: string
	emailLabel: string
	emailPlaceholder: string
	phoneLabel: string
	phonePlaceholder: string
	subjectLabel: string
	subjectOptions: string[]
	messageLabel: string
	messagePlaceholder: string
}

export interface ThemeHomepageContent {
	brandName?: string
	description: string
	seoTitle?: string
	seoImage?: string
	hero: {
		badge: string
		titleLead: string
		titleAccent: string
		titleRest: string
		text: string
		primaryCta: string
		secondaryCta: string
		bgText: string
		image: string
		imageAlt: string
		/** Full-bleed section background (themes that use art behind the hero rather than beside it). */
		backgroundImage?: string
		stats: Array<{ value: string; suffix?: string; label: string }>
		floatingCards: Array<{ tone: 'r' | 'y' | 'g'; icon: 'flame' | 'star' | 'clock'; title: string; text: string }>
	}
	ticker: string[]
	category: {
		label: string
		titleLead: string
		titleAccent: string
		text: string
		emptyTitle: string
		emptyText: string
		/** Per-card CTA on a category tile (e.g. "View items"). */
		cardCta?: string
	}
	about: {
		label: string
		titleLead: string
		titleAccent: string
		text: string
		primaryImage: string
		secondaryImage: string
		primaryImageAlt: string
		secondaryImageAlt: string
		experienceValue: string
		experienceText: string
		cta: string
		features: Array<{
			tone: 'r' | 'y' | 'g'
			icon: 'leaf' | 'award' | 'zap' | 'shield' | 'truck' | 'star'
			title: string
			text: string
		}>
	}
	menu: {
		label: string
		titleLead: string
		titleAccent: string
		emptyTitle: string
		emptyText: string
		cta: string
		/** Copy shown on every product card when the catalogue has no per-product description. */
		cardDescription?: string
		/** Suffix after the discount number on a product badge (e.g. "% off"). */
		discountSuffix?: string
		/** Fallback category label on a product card. */
		categoryFallback?: string
		/** Label of the "show everything" chip in the product filter row. */
		filterAllLabel?: string
	}
	special: {
		label: string
		titleLead: string
		titleAccent: string
		text: string
		cta: string
		image: string
		imageAlt: string
		oldPrice: string
		price: string
		/** Offer countdown: unit labels plus how long the timer runs from page load. */
		countdown?: {
			hoursLabel: string
			minutesLabel: string
			secondsLabel: string
			durationSeconds: number
		}
	}
	gallery: { label: string; titleLead: string; titleAccent: string; items: Array<{ image: string; title: string }> }
	history: { label: string; titleLead: string; titleAccent: string; items: Array<[string, string, string]> }
	chefs: { label: string; titleLead: string; titleAccent: string; items: Array<{ name: string; role: string; image: string }> }
	hours: {
		label: string
		titleLead: string
		titleAccent: string
		rows: Array<[string, string, boolean]>
		orderTitle: string
		orderText: string
		orderCta: string
		locationTitle: string
		address: string
		phone: string
		email: string
		addressLabel?: string
		phoneLabel?: string
		emailLabel?: string
	}
	testimonials: { label: string; titleLead: string; titleAccent: string; items: Array<{ name: string; role: string; image: string; text: string }> }
	reservation: {
		label: string
		titleLead: string
		titleAccent: string
		text: string
		panelTitle: string
		panelText: string
		hoursLabel: string
		phoneLabel: string
		groupLabel: string
		locationLabel: string
		hours: string
		phone: string
		group: string
		location: string
		cta: string
		form?: ThemeReservationForm
	}
	blog: {
		label: string
		titleLead: string
		titleAccent: string
		items: Array<{
			tag: string
			title: string
			date: string
			month: string
			image: string
			author?: string
			comments?: string
		}>
		/** Per-card "keep reading" link label. */
		readMore?: string
	}
	newsletter: {
		label: string
		titleLead: string
		titleAccent: string
		/** Trailing part of the heading, for themes that wrap the accent mid-sentence. */
		titleRest?: string
		text: string
		cta: string
		privacy: string
		/** Email input placeholder. */
		placeholder?: string
		/** Section background art, for themes that put the signup over an image. */
		backgroundImage?: string
	}
	footer?: {
		logo?: string
		logoAlt?: string
		assistance?: { label: string; links: Array<{ label: string; href: string }> }
		columns?: Array<{ title: string; links?: Array<{ label: string; href: string }>; text?: string[] }>
		copyright?: string
	}
	/** Admin-editable header chrome: announcement bar above the nav (empty = no bar,
	 *  hideAnnouncement: true switches an otherwise-defaulted bar off). */
	header?: { announcement?: string; announcementHref?: string; hideAnnouncement?: boolean }
	contact: {
		label: string
		titleLead: string
		titleAccent: string
		text: string
		panelTitle: string
		panelText: string
		addressLabel: string
		phoneLabel: string
		emailLabel: string
		hoursLabel: string
		address: string
		phone: string
		email: string
		hours: string
		cta: string
		form?: ThemeContactForm
	}
	defaultHome: {
		eyebrow: string
		primaryCta: string
		secondaryCta: string
		featuredLabel: string
		featuredTitle: string
		emptyTitle: string
		emptyText: string
	}
	/**
	 * Rich "Refined Editorial" homepage content for the default theme. Optional so other themes
	 * are unaffected. Copy + decorative imagery live here (theme layer); live commerce data
	 * (products, categories) is passed in as props and overrides the fallback tiles below.
	 */
	editorial?: {
		hero: {
			eyebrow: string
			titleLead: string
			titleAccent: string
			text: string
			primaryCta: string
			primaryHref: string
			secondaryCta: string
			secondaryHref: string
			image: string
			imageAlt: string
			note?: string
		}
		marquee?: string[]
		categories: {
			eyebrow: string
			title: string
			viewAll: string
			viewAllHref: string
			tiles: Array<{ label: string; href: string; image: string }>
		}
		featured: {
			eyebrow: string
			title: string
			viewAll: string
			viewAllHref: string
			/** Product source for the grid; 'featured' (default) uses the featured-products feed. */
			source?: 'featured' | 'latest' | 'popular' | 'category'
			/** Category id when source === 'category'. */
			categoryId?: string
		}
		banner: {
			eyebrow: string
			title: string
			text: string
			cta: string
			href: string
			image: string
			imageAlt: string
		}
		assurances: Array<{ icon: 'truck' | 'returns' | 'shield' | 'support'; title: string; text: string }>
		newsletter: { eyebrow: string; title: string; text: string; cta: string; privacy: string }
		/** Admin-controlled per-section visibility (true = hide the section on the homepage). */
		hiddenSections?: Record<string, boolean>
	}
	/**
	 * Per-device content overrides set by the admin Theme page, cascading
	 * mobile → tablet → desktop: `editorial` is the mobile/base layer, tablet deep-merges
	 * over it, desktop deep-merges over tablet. Absent/blank fields inherit the previous
	 * layer. Shapes mirror `editorial` (partial).
	 */
	editorialTablet?: Record<string, unknown>
	editorialDesktop?: Record<string, unknown>

	/**
	 * Theme-agnostic building blocks below. Every theme renders the subset it needs, and each
	 * block is optional so adding one never disturbs the other themes. They exist so that NO
	 * store-facing copy or imagery has to be hardcoded in a theme component — anything a store
	 * owner might reasonably want to change belongs here, where the admin customizer can reach it.
	 */

	/** Picture-tile groups. Live API categories, when present, take precedence over `tiles.categories`. */
	tiles?: {
		categories?: ThemeTile[]
		collage?: ThemeTile[]
		seasons?: ThemeTile[]
		promos?: ThemeTile[]
		/** A single oversized feature tile (e.g. Lime's "Most in Demand"). */
		feature?: ThemeTile
	}

	/** Small promo cards with their own background art (e.g. Organic's sale/combo/coupon trio). */
	promoBanners?: Array<{
		eyebrow: string
		title: string
		cta: string
		href: string
		image: string
	}>

	/** Trust/assurance strip: a heading plus badge items (icon-image, named icon, or plain copy). */
	trust?: {
		title?: string
		text?: string
		items: Array<{
			image?: string
			icon?: 'leaf' | 'award' | 'zap' | 'shield' | 'truck' | 'star'
			title?: string
			text?: string
		}>
	}

	/** Frequently-asked questions rendered as an accordion or list. */
	faq?: {
		label?: string
		titleLead?: string
		titleAccent?: string
		items: Array<{ question: string; answer: string }>
	}

	/** Mobile-app promotion block. `links` are plain text CTAs — no third-party store badge art. */
	appDownload?: {
		title: string
		text: string
		image: string
		imageAlt: string
		links: Array<{ label: string; href: string }>
	}

	/** Theme header chrome: announcement strip, primary menu, and a topbar CTA. */
	nav?: {
		announcement?: string
		announcementHref?: string
		links?: Array<{ label: string; href: string }>
		ctaLabel?: string
		ctaHref?: string
	}

	/**
	 * Shared microcopy for repeated UI affordances (`addToCart`, `viewAll`, `readMore`,
	 * `priceOnRequest`, …). Kept as a free-form map so a theme can add one without a type change.
	 */
	labels?: Record<string, string>

	/** Form copy for themes that render a reservation and/or contact form. */
	forms?: {
		reservation?: ThemeReservationForm
		contact?: ThemeContactForm
	}
}
