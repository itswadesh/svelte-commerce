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
		stats: Array<{ value: string; suffix?: string; label: string }>
		floatingCards: Array<{ tone: 'r' | 'y' | 'g'; icon: 'flame' | 'star' | 'clock'; title: string; text: string }>
	}
	ticker: string[]
	category: { label: string; titleLead: string; titleAccent: string; text: string; emptyTitle: string; emptyText: string }
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
		features: Array<{ tone: 'r' | 'y' | 'g'; icon: 'leaf' | 'award' | 'zap'; title: string; text: string }>
	}
	menu: { label: string; titleLead: string; titleAccent: string; emptyTitle: string; emptyText: string; cta: string }
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
	}
	blog: { label: string; titleLead: string; titleAccent: string; items: Array<{ tag: string; title: string; date: string; month: string; image: string }> }
	newsletter: { label: string; titleLead: string; titleAccent: string; text: string; cta: string; privacy: string }
	footer?: {
		logo?: string
		logoAlt?: string
		assistance?: { label: string; links: Array<{ label: string; href: string }> }
		columns?: Array<{ title: string; links?: Array<{ label: string; href: string }>; text?: string[] }>
		copyright?: string
	}
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
}
