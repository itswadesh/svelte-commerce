import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte'
import { themeFontsHref, themeTokenCss, themeTokenDeclarations, hexToTriplet, themeBackground } from '$lib/composer/theme-tokens'
import { getThemeFontsUrl } from '$lib/theme'
import { publishedThemeSettings, forgetThemeSettings } from '$lib/composer/theme-settings'
import { collectionCards, columnItems, columnsClass, faqItems, slideInterval, slideItems, videoEmbed, videoSource } from '$lib/composer/helpers'
import { draftSections } from '$lib/composer/editor-bridge'
import { SECTIONS } from '$lib/composer/registry'
import Slideshow from '$lib/composer/sections/Slideshow.svelte'
import CollectionList from '$lib/composer/sections/CollectionList.svelte'
import Video from '$lib/composer/sections/Video.svelte'
import Newsletter from '$lib/composer/sections/Newsletter.svelte'
import Faq from '$lib/composer/sections/Faq.svelte'
import MultiColumn from '$lib/composer/sections/MultiColumn.svelte'
import Hero from '$lib/composer/sections/Hero.svelte'
import ImageWithText from '$lib/composer/sections/ImageWithText.svelte'

// The product grid draws the app's product card, which needs SvelteKit's runtime; not under test here.
vi.mock('$lib/composer/sections/ProductGrid.svelte', () => ({ default: () => {} }))

const section = (type: string, settings: Record<string, unknown> = {}, extra: Record<string, unknown> = {}) => ({
	id: 's1',
	type,
	settings,
	...extra
})

// jsdom has no matchMedia with listeners; the slideshow asks whether motion is reduced.
function motion(reduced: boolean) {
	globalThis.matchMedia = ((query: string) => ({
		matches: reduced && query.includes('reduce'),
		media: query,
		addEventListener: () => {},
		removeEventListener: () => {},
		addListener: () => {},
		removeListener: () => {}
	})) as unknown as typeof matchMedia
}

describe('theme tokens', () => {
	it('maps each colour onto the tokens the storefront is built on', () => {
		const d = themeTokenDeclarations({ background: '#FFFFFF', text: '#000000', accent: '#ff0000', accent_text: '#ffffff', muted: '#eeeeee' })
		expect(d['--background']).toBe('0 0% 100%')
		expect(d['--card']).toBe('0 0% 100%')
		expect(d['--foreground']).toBe('0 0% 0%')
		expect(d['--primary']).toBe('0 100% 50%')
		expect(d['--primary-foreground']).toBe('0 0% 100%')
		expect(d['--muted']).toBe('0 0% 93.3%')
		expect(d['--ed-canvas']).toBe('#eeeeee')
		// Captions and hairlines follow the ink and the ground, between them.
		expect(d['--muted-foreground']).toBe('0 0% 30.2%')
		expect(d['--border']).toBeDefined()
	})

	it('sets nothing the merchant did not: an unset token keeps the storefront look', () => {
		expect(themeTokenDeclarations({})).toEqual({})
		expect(themeTokenDeclarations(null)).toEqual({})
		expect(Object.keys(themeTokenDeclarations({ accent: '#112233' })).sort()).toEqual([
			'--primary',
			'--primary-foreground',
			'--primary-hover',
			'--primary-ink'
		])
		expect(themeTokenCss({})).toBe('')
	})

	it('keeps an accent readable as ink and under its label', () => {
		const navy = themeTokenDeclarations({ accent: '#112233' })
		expect(navy['--primary-ink']).toBe('210 50% 13.3%')
		expect(navy['--primary-foreground']).toBe('0 0% 100%')

		const yellow = themeTokenDeclarations({ accent: '#ffd233' })
		expect(yellow['--primary-ink']).toBe('0 0% 10.2%')
		expect(yellow['--primary-foreground']).toBe('0 0% 10.2%')

		// The merchant's own label colour stands, and the ink follows their text colour.
		const own = themeTokenDeclarations({ accent: '#ffd233', accent_text: '#ffffff', text: '#222222' })
		expect(own['--primary-foreground']).toBe('0 0% 100%')
		expect(own['--primary-ink']).toBe('0 0% 13.3%')
	})

	it('lets nothing but the exact shapes through, so a value can never write CSS of its own', () => {
		const d = themeTokenDeclarations({
			background: '#000000;} body { display: none',
			text: 'red',
			accent: '#abc',
			heading_font: 'toString',
			body_font: "Inter'; }",
			radius: 'huge',
			product_image_ratio: '1 / 1',
			product_image_fit: 'cover'
		})
		expect(d).toEqual({})
	})

	it('maps the product picture shape and fit from their lists', () => {
		expect(themeTokenDeclarations({ product_image_ratio: 'square', product_image_fit: 'fill' })).toEqual({
			'--product-image-ratio': '1 / 1',
			'--product-image-fit': 'cover'
		})
		expect(themeTokenDeclarations({ product_image_ratio: 'tall', product_image_fit: 'whole' })).toEqual({
			'--product-image-ratio': '2 / 3',
			'--product-image-fit': 'contain'
		})
	})

	it('maps fonts and rounding from their lists', () => {
		const d = themeTokenDeclarations({ heading_font: 'playfair-display', body_font: 'lora', radius: 'large' })
		expect(d['--font-heading']).toContain("'Playfair Display'")
		expect(d['--font-body']).toContain("'Lora'")
		expect(d['--font-primary']).toBe(d['--font-body'])
		expect(d['--radius']).toBe('16px')
		expect(themeTokenDeclarations({ radius: 'none' })['--radius']).toBe('0px')
	})

	it('writes one rule, important, at the weight asked for', () => {
		const css = themeTokenCss({ accent: '#000000' })
		expect(css.startsWith('[data-theme][data-theme] {')).toBe(true)
		expect(css).toContain('--primary: 0 0% 0% !important;')
		expect(themeTokenCss({ accent: '#000000' }, 3).startsWith('[data-theme][data-theme][data-theme] {')).toBe(true)
	})

	it('loads only the fonts chosen, each once', () => {
		expect(themeFontsHref({})).toBe('')
		expect(themeFontsHref({ heading_font: 'lora', body_font: 'lora' })).toBe(
			'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap'
		)
		expect(themeFontsHref({ heading_font: 'dm-sans', body_font: 'nope' })).toBe(
			'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap'
		)
	})

	it('sets headings in Noto Serif and body text in Source Sans 3, each with its fallback next', () => {
		expect(themeTokenDeclarations({ heading_font: 'noto-serif', body_font: 'source-sans-3' })).toMatchObject({
			'--font-heading': "'Noto Serif', 'Noto Serif Fallback', Georgia, serif",
			'--font-body': "'Source Sans 3', 'Source Sans 3 Fallback', ui-sans-serif, system-ui, sans-serif"
		})
	})

	it('declares each chosen face once, as Arial or Times New Roman resized to its metrics, over the latin subset only so a ₹ the face lacks keeps its system face', () => {
		const latin =
			'unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;'
		expect(themeTokenCss({ heading_font: 'noto-serif', body_font: 'source-sans-3' })).toBe(
			`@font-face { font-family: 'Noto Serif Fallback'; src: local('Times New Roman'); ${latin} size-adjust: 118.4%; ascent-override: 90.29%; descent-override: 24.75%; line-gap-override: 0%; } ` +
				`@font-face { font-family: 'Source Sans 3 Fallback'; src: local('Arial'); ${latin} size-adjust: 93.76%; ascent-override: 109.21%; descent-override: 42.66%; line-gap-override: 0%; } ` +
				"[data-theme][data-theme] { --font-heading: 'Noto Serif', 'Noto Serif Fallback', Georgia, serif !important; " +
				"--font-body: 'Source Sans 3', 'Source Sans 3 Fallback', ui-sans-serif, system-ui, sans-serif !important; " +
				"--font-primary: 'Source Sans 3', 'Source Sans 3 Fallback', ui-sans-serif, system-ui, sans-serif !important; }"
		)
		expect(themeTokenCss({ heading_font: 'poppins', body_font: 'poppins' }).match(/@font-face \{[^}]*\}/g)).toEqual([
			`@font-face { font-family: 'Poppins Fallback'; src: local('Arial'); ${latin} size-adjust: 112.16%; ascent-override: 93.62%; descent-override: 31.21%; line-gap-override: 8.92%; }`
		])
	})

	it('loads every weight of the heading face whatever the heading weight, as the hero and tiles draw others', () => {
		expect(themeFontsHref({ heading_font: 'noto-serif', heading_weight: 'medium', body_font: 'source-sans-3' })).toBe(
			'https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;500;600;700;800&family=Source+Sans+3:wght@400;500;600;700;800&display=swap'
		)
		expect(themeFontsHref({ heading_font: 'merriweather', heading_weight: 'extrabold' })).toBe(
			'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap'
		)
		const css = themeTokenCss({ heading_font: 'merriweather', heading_weight: 'medium' })
		expect(css.slice(css.indexOf('[data-theme]'))).toBe(
			"[data-theme][data-theme] { --font-heading: 'Merriweather', 'Merriweather Fallback', Georgia, serif !important; --weight-heading: 500 !important; }"
		)
	})

	it("stops loading the default theme's Inter only when the store names both fonts", () => {
		const inter = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
		expect(getThemeFontsUrl('default', null)).toBe(inter)
		expect(getThemeFontsUrl('default', { heading_font: 'noto-serif' })).toBe(inter)
		expect(getThemeFontsUrl('default', { heading_font: 'noto-serif', body_font: 'comic-sans' })).toBe(inter)
		expect(getThemeFontsUrl('default', { heading_font: 'noto-serif', body_font: 'source-sans-3' })).toBeNull()
		expect(getThemeFontsUrl('wine', { heading_font: 'noto-serif', body_font: 'source-sans-3' })).toContain('family=Dancing+Script')
	})

	it('converts colours to the HSL triplets the theme holds', () => {
		expect(hexToTriplet('#0f172a')).toBe('222.2 47.4% 11.2%')
		expect(themeBackground({ background: '#ABCDEF' })).toBe('#abcdef')
		expect(themeBackground({ background: 'blue' })).toBe('')
	})
})

describe('published theme settings', () => {
	beforeEach(() => forgetThemeSettings())

	it('reads them through the connector and keeps them for half a minute per host', async () => {
		const getThemeSettings = vi.fn(async () => ({ settings: { accent: '#112233' } }))
		const services = { layoutService: { getThemeSettings } }
		expect(await publishedThemeSettings(services, 'a.test', 1000)).toEqual({ accent: '#112233' })
		expect(await publishedThemeSettings(services, 'a.test', 20_000)).toEqual({ accent: '#112233' })
		expect(getThemeSettings).toHaveBeenCalledTimes(1)
		await publishedThemeSettings(services, 'b.test', 20_000)
		expect(getThemeSettings).toHaveBeenCalledTimes(2)
		await publishedThemeSettings(services, 'a.test', 32_000)
		expect(getThemeSettings).toHaveBeenCalledTimes(3)
	})

	it('is null on a connector without the service, with none set, and on a failure', async () => {
		expect(await publishedThemeSettings({}, 'x.test')).toBeNull()
		expect(await publishedThemeSettings({ layoutService: { getThemeSettings: async () => ({ settings: {} }) } }, 'y.test')).toBeNull()
		expect(await publishedThemeSettings({ layoutService: { getThemeSettings: async () => null } }, 'z.test')).toBeNull()
		const broken = { layoutService: { getThemeSettings: async () => Promise.reject(new Error('down')) } }
		expect(await publishedThemeSettings(broken, 'w.test')).toBeNull()
	})
})

describe('new section helpers', () => {
	it('keeps slides with a picture, through the link rule, at most eight', () => {
		const slides = slideItems([
			{ image: '/a.jpg', heading: ' One ', button_link: '/x' },
			{ heading: 'No picture' },
			{ mobile_image: 'https://cdn.example/m.jpg' },
			{ image: 'javascript:alert(1)' },
			...Array.from({ length: 10 }, (_, i) => ({ image: `/p${i}.jpg` }))
		])
		expect(slides.length).toBe(8)
		expect(slides[0]).toMatchObject({ image: '/a.jpg', heading: 'One' })
		expect(slides[1].image).toBe('https://cdn.example/m.jpg')
		expect(slideItems('nope')).toEqual([])
		expect(slideInterval(undefined)).toBe(5000)
		expect(slideInterval(60)).toBe(10000)
	})

	it('keeps questions that have an answer', () => {
		expect(faqItems([{ question: 'Q1', answer: 'A' }, { question: 'Q2' }, { answer: 'A' }, 'x'])).toEqual([{ question: 'Q1', answer: 'A' }])
	})

	it('keeps columns that show something, at most four, and lays them out by count', () => {
		const cols = columnItems([{ heading: 'A', link: 'javascript:x' }, {}, { text: 'B' }, { image: '/i.jpg' }, { heading: 'C' }, { heading: 'D' }])
		expect(cols.map((c) => c.heading || 'other')).toEqual(['A', 'other', 'other', 'C'])
		expect(cols[0].link).toBe('')
		expect(columnsClass(2)).toBe('grid-cols-1 md:grid-cols-2')
		expect(columnsClass(9)).toBe('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4')
		// Tiles — no paragraphs in any column — sit two across on a phone.
		expect(columnsClass(4, true)).toBe('grid-cols-2 lg:grid-cols-4')
		expect(columnsClass(3, true)).toBe('grid-cols-2 md:grid-cols-3')
		expect(columnsClass(2, true)).toBe('grid-cols-2')
	})

	it('keeps collection cards with a title and a link on this site', () => {
		const cards = collectionCards(
			section(
				'collection-list',
				{},
				{
					collections: [
						{ id: '1', title: 'Rings', link: '/collections/rings', image: 'javascript:x' },
						{ id: '2', title: '', link: '/collections/x', image: null },
						{ id: '3', title: 'Away', link: '//evil.example', image: null }
					]
				}
			)
		)
		expect(cards).toEqual([{ id: '1', title: 'Rings', link: '/collections/rings', image: null }])
	})

	it('reads a YouTube or Vimeo address the way the engine does', () => {
		const cases: Record<string, string> = {
			'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10': 'youtube:dQw4w9WgXcQ',
			'https://youtu.be/dQw4w9WgXcQ': 'youtube:dQw4w9WgXcQ',
			'https://m.youtube.com/shorts/dQw4w9WgXcQ': 'youtube:dQw4w9WgXcQ',
			'https://www.youtube.com/embed/dQw4w9WgXcQ': 'youtube:dQw4w9WgXcQ',
			'https://vimeo.com/76979871': 'vimeo:76979871',
			'https://player.vimeo.com/video/76979871': 'vimeo:76979871',
			'https://www.youtube.com/watch?v=bad id': '',
			'https://evil.example/youtube.com/watch?v=x': '',
			'javascript:alert(1)': ''
		}
		for (const [url, want] of Object.entries(cases)) {
			const got = videoEmbed(url)
			expect(got ? `${got.kind}:${got.id}` : '', url).toBe(want)
		}
		expect(videoEmbed('https://youtu.be/dQw4w9WgXcQ')?.embed).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0')
		expect(videoEmbed('https://vimeo.com/76979871')?.embed).toBe('https://player.vimeo.com/video/76979871?autoplay=1&dnt=1')
	})

	it('prefers the link and falls back to the file', () => {
		expect(videoSource({ video_url: 'https://vimeo.com/1', video_file: '/v.mp4' })?.kind).toBe('vimeo')
		expect(videoSource({ video_url: 'https://example.com/v', video_file: '/v.mp4' })).toEqual({ kind: 'file', src: '/v.mp4' })
		expect(videoSource({ video_file: 'javascript:x' })).toBeNull()
	})

	it('keeps the engine-resolved collections for a list in a posted draft', () => {
		const resolved = [
			{ id: 'c', type: 'collection-list', settings: {}, collections: [{ id: '1', title: 'Rings', link: '/collections/rings', image: null }] }
		]
		const out = draftSections(
			{
				sections: [
					{ id: 'c', type: 'collection-list', settings: { heading: 'New' } },
					{ id: 'n', type: 'collection-list' }
				]
			},
			resolved
		)
		expect(out[0].collections?.[0].title).toBe('Rings')
		expect(out[0].settings.heading).toBe('New')
		expect(out[1].collections).toEqual([])
	})

	it('registers a component for every new section type', () => {
		for (const type of ['slideshow', 'collection-list', 'video', 'newsletter', 'faq', 'multi-column']) expect(SECTIONS[type], type).toBeDefined()
	})
})

// jsdom has no inert of its own: Svelte sets the property, which is then a plain value.
const inert = (el: Element) => (el as HTMLElement & { inert?: boolean }).inert === true || el.hasAttribute('inert')

describe('Slideshow', () => {
	beforeEach(() => motion(false))
	const slides = [
		{ image: '/one.jpg', heading: 'One', button_text: 'Shop', button_link: '/products' },
		{ image: '/two.jpg', heading: 'Two' },
		{ image: '/three.jpg' }
	]

	it('shows one slide at a time, the others out of reach, and moves with its buttons', async () => {
		const { container } = render(Slideshow, { section: section('slideshow', { slides }) })
		const groups = container.querySelectorAll('[aria-roledescription="slide"]')
		expect(groups.length).toBe(3)
		expect(inert(groups[0])).toBe(false)
		expect(inert(groups[1])).toBe(true)
		expect(screen.getByRole('link', { name: 'Shop' }).getAttribute('href')).toBe('/products')
		await fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
		expect(inert(groups[1])).toBe(false)
		expect(screen.getByRole('button', { name: 'Show slide 2 of 3' }).getAttribute('aria-current')).toBe('true')
		await fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }))
		await fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }))
		expect(inert(groups[2])).toBe(false)
	})

	it('offers no pause button unless it moves by itself', () => {
		render(Slideshow, { section: section('slideshow', { slides }) })
		expect(screen.queryByRole('button', { name: /pause/i })).toBeNull()
	})

	it('moves by itself only when switched on, and can be paused', async () => {
		vi.useFakeTimers()
		try {
			const { container } = render(Slideshow, { section: section('slideshow', { slides, autoplay: true, interval: 3 }) })
			const groups = container.querySelectorAll('[aria-roledescription="slide"]')
			await vi.advanceTimersByTimeAsync(3100)
			expect(inert(groups[1])).toBe(false)
			await fireEvent.click(screen.getByRole('button', { name: 'Pause the slideshow' }))
			await vi.advanceTimersByTimeAsync(10_000)
			expect(inert(groups[1])).toBe(false)
		} finally {
			vi.useRealTimers()
		}
	})

	it('never moves by itself for a shopper who reduced motion', async () => {
		motion(true)
		vi.useFakeTimers()
		try {
			const { container } = render(Slideshow, { section: section('slideshow', { slides, autoplay: true, interval: 3 }) })
			await vi.advanceTimersByTimeAsync(10_000)
			expect(inert(container.querySelectorAll('[aria-roledescription="slide"]')[0])).toBe(false)
			expect(screen.queryByRole('button', { name: /pause/i })).toBeNull()
		} finally {
			vi.useRealTimers()
		}
	})

	it('renders nothing without a slide that has a picture', () => {
		const { container } = render(Slideshow, { section: section('slideshow', { slides: [{ heading: 'x' }] }) })
		expect(container.querySelector('section')).toBeNull()
	})
})

describe('CollectionList', () => {
	it('links each collection with its picture and title', () => {
		render(CollectionList, {
			section: section(
				'collection-list',
				{ heading: 'Shop by type' },
				{
					collections: [
						{ id: '1', title: 'Rings', link: '/collections/rings', image: '/r.jpg' },
						{ id: '2', title: 'Chains', link: '/collections/chains', image: null }
					]
				}
			)
		})
		expect(screen.getByRole('heading', { level: 2, name: 'Shop by type' })).toBeInTheDocument()
		expect(screen.getByRole('link', { name: 'Rings' }).getAttribute('href')).toBe('/collections/rings')
		expect(screen.getByRole('link', { name: 'Chains' }).querySelector('img')).toBeNull()
	})

	it('renders nothing when no collection is left', () => {
		const { container } = render(CollectionList, { section: section('collection-list', { heading: 'Gone' }, { collections: [] }) })
		expect(container.querySelector('section')).toBeNull()
	})
})

describe('Video', () => {
	it('loads nothing from YouTube until play is pressed, then the privacy-enhanced player', async () => {
		const { container } = render(Video, {
			section: section('video', { heading: 'Our studio', video_url: 'https://youtu.be/dQw4w9WgXcQ', poster: '/p.jpg' })
		})
		expect(container.querySelector('iframe')).toBeNull()
		await fireEvent.click(screen.getByRole('button', { name: 'Play Our studio' }))
		const frame = container.querySelector('iframe')
		expect(frame?.getAttribute('src')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0')
		expect(frame?.getAttribute('title')).toBe('Our studio')
	})

	it('plays a file from Files with controls, never by itself', () => {
		const { container } = render(Video, { section: section('video', { video_file: '/clip.mp4', poster: '/p.jpg' }) })
		const video = container.querySelector('video')
		expect(video?.hasAttribute('controls')).toBe(true)
		expect(video?.hasAttribute('autoplay')).toBe(false)
		expect(video?.querySelector('source')?.getAttribute('src')).toBe('/clip.mp4')
	})

	it('renders nothing for an address it does not know', () => {
		const { container } = render(Video, { section: section('video', { video_url: 'https://example.com/v' }) })
		expect(container.querySelector('section')).toBeNull()
	})
})

describe('Newsletter', () => {
	it('signs the address up and says so', async () => {
		const subscribe = vi.fn(async () => ({ status: 'subscribed' }))
		render(Newsletter, { section: section('newsletter', { heading: 'Letters', button_text: 'Join', success_text: 'Welcome aboard.' }), subscribe })
		await fireEvent.input(screen.getByLabelText('Email address'), { target: { value: ' a@example.com ' } })
		await fireEvent.submit(screen.getByRole('button', { name: 'Join' }).closest('form')!)
		await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Welcome aboard.'))
		expect(subscribe).toHaveBeenCalledWith({ email: 'a@example.com', source: 'home' })
	})

	it('keeps the form and says what went wrong', async () => {
		const subscribe = vi.fn(async () => Promise.reject({ message: 'that does not look like an email address' }))
		render(Newsletter, { section: section('newsletter', {}), subscribe })
		await fireEvent.submit(screen.getByRole('button', { name: 'Subscribe' }).closest('form')!)
		await waitFor(() => expect(screen.getByText('that does not look like an email address')).toBeInTheDocument())
		expect(screen.getByLabelText('Email address').getAttribute('aria-invalid')).toBe('true')
	})
})

describe('Faq', () => {
	it('draws each question as a disclosure with its answer, as text', () => {
		const { container } = render(Faq, {
			section: section('faq', {
				heading: 'Questions',
				items: [{ question: 'Do you ship?', answer: 'Yes.\n\n<b>Everywhere</b>' }, { question: 'Empty' }]
			})
		})
		const items = container.querySelectorAll('details')
		expect(items.length).toBe(1)
		expect(items[0].querySelector('summary')?.textContent).toContain('Do you ship?')
		expect(items[0].querySelectorAll('p').length).toBe(2)
		expect(items[0].querySelector('b')).toBeNull()
	})
})

describe('MultiColumn', () => {
	it('draws the columns, with headings one level under the section', () => {
		render(MultiColumn, {
			section: section('multi-column', {
				heading: 'Why us',
				items: [
					{ heading: 'Made here', text: 'By hand.', link: '/about', link_text: 'Read more' },
					{ heading: 'Kept long', link: 'javascript:x', link_text: 'Bad' }
				]
			})
		})
		expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Made here', 'Kept long'])
		expect(screen.getByRole('link', { name: /Read more/ }).getAttribute('href')).toBe('/about')
		expect(screen.queryByRole('link', { name: /Bad/ })).toBeNull()
	})

	it('draws columns without paragraphs as tiles, each one link named by its heading', () => {
		const { container } = render(MultiColumn, {
			section: section('multi-column', {
				heading: 'Start shopping',
				items: [
					{ heading: 'Shop all', link: '/products', link_text: 'See everything' },
					{ heading: 'Collections', link: '/collections', link_text: 'See collections' }
				]
			})
		})
		expect(container.querySelector('.cmp-mc--tiles')).not.toBeNull()
		const links = screen.getAllByRole('link')
		expect(links.map((a) => a.getAttribute('href'))).toEqual(['/products', '/collections'])
		expect(links[0].textContent).toContain('Shop all')
	})

	it('keeps a tile a tile when it has a picture, the picture inside the tile and silent beside its name', () => {
		const { container } = render(MultiColumn, {
			section: section('multi-column', {
				heading: 'Start shopping',
				items: [
					{ image: '/x/layouts/starter/1/tile-shop-all.webp', heading: 'Shop all', link: '/products', link_text: 'See everything' },
					{ image: '/x/layouts/starter/1/tile-track.webp', heading: 'Track an order', link: '/order-tracking', link_text: 'Find your order' }
				]
			})
		})
		expect(container.querySelector('.cmp-mc--tiles')).not.toBeNull()
		const tiles = container.querySelectorAll('.cmp-mc__col')
		expect(tiles.length).toBe(2)
		const img = tiles[0].querySelector('.cmp-mc__media img')
		expect(img?.getAttribute('src')).toBe('/x/layouts/starter/1/tile-shop-all.webp')
		expect(img?.getAttribute('alt')).toBe('')
		expect(img?.getAttribute('loading')).toBe('lazy')
		expect(screen.getAllByRole('link').map((a) => a.textContent?.trim())).toEqual(['Shop all', 'Track an order'])
	})

	it('keeps columns as columns when one has no link, and never draws an unnamed link', () => {
		const { container } = render(MultiColumn, {
			section: section('multi-column', {
				items: [{ heading: 'Made here' }, { image: '/a.webp', link: '/products' }]
			})
		})
		expect(container.querySelector('.cmp-mc--tiles')).toBeNull()
		for (const a of screen.queryAllByRole('link')) expect(a.textContent?.trim()).not.toBe('')
	})
})

// A photograph's description is the shop's (`image_alt`); without one the heading still names it.
describe('picture descriptions', () => {
	it('reads the hero picture its description, or its heading when there is none', () => {
		const { container, unmount } = render(Hero, {
			section: section('hero', { heading: 'Find your next favourite thing', image: '/h.webp', image_alt: 'A smiling woman holding up a dupatta' }),
			priority: true
		})
		const img = container.querySelector('img')
		expect(img?.getAttribute('alt')).toBe('A smiling woman holding up a dupatta')
		expect(img?.getAttribute('loading')).toBe('eager')
		expect(img?.getAttribute('fetchpriority')).toBe('high')
		unmount()
		const { container: plain } = render(Hero, { section: section('hero', { heading: 'Sale', image: '/h.webp' }) })
		expect(plain.querySelector('img')?.getAttribute('alt')).toBe('Sale')
	})

	it('reads the picture beside words its description, or its heading when there is none', () => {
		const { container, unmount } = render(ImageWithText, {
			section: section('image-with-text', { heading: 'Good things', image: '/l.webp', image_alt: 'A woman looking into a handbag' })
		})
		expect(container.querySelector('img')?.getAttribute('alt')).toBe('A woman looking into a handbag')
		unmount()
		const { container: plain } = render(ImageWithText, { section: section('image-with-text', { heading: 'Good things', image: '/l.webp' }) })
		expect(plain.querySelector('img')?.getAttribute('alt')).toBe('Good things')
	})
})
