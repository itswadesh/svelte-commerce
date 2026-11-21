import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render } from '@testing-library/svelte'
import { page } from '$app/state'
import DesktopFilter from '$lib/components/product-catalogue/desktop-filter.svelte'
import MobileFilter from '$lib/components/product-catalogue/mobile-filter.svelte'

const state = vi.hoisted(() => ({ current: {} as Record<string, unknown> }))

vi.mock('$lib/core/composables/index.js', () => ({ getDesktopFilterState: () => state.current }))
vi.mock('$lib/core/utils', async () => {
	const { clsx } = await import('clsx')
	const { twMerge } = await import('tailwind-merge')
	return { cn: (...inputs: unknown[]) => twMerge(clsx(inputs)) }
})
vi.mock('$lib/core/connectors/taxonomy', () => ({ taxonomy: { many: 'Categories' } }))

afterEach(cleanup)

type Row = { name: string; slug: string; depth?: number }

function filterState(categories: Row[], categorySearchQuery: string) {
	page.data = { products: { facets: { categories } } }
	state.current = {
		categories,
		filteredCategories: categories,
		categorySearchQuery,
		formatFilterOptionName: (name: string) => name,
		formatFilterName: (name: string) => name,
		tags: [],
		filteredTags: [],
		selectedTags: [],
		selectedGeneralFilters: {},
		processedFilters: {},
		minPossiblePrice: NaN,
		maxPossiblePrice: NaN,
		menuItems: [{ id: 'category', label: 'Categories' }],
		selectedSection: 'category',
		appliedFiltersCountByKey: {},
		showFilter: true
	}
}

function rail(categories: Row[], categorySearchQuery = '') {
	filterState(categories, categorySearchQuery)
	const { container } = render(DesktopFilter)
	return [...container.querySelectorAll<HTMLButtonElement>('button.ed-df__catbtn')]
}

function sheet(categories: Row[], categorySearchQuery = '') {
	filterState(categories, categorySearchQuery)
	const { baseElement } = render(MobileFilter)
	return [...baseElement.querySelectorAll<HTMLButtonElement>('[role="dialog"] .divide-y > button')]
}

const indents = (rows: HTMLButtonElement[]) =>
	rows.map((b) => [b.textContent?.trim(), [...b.classList].filter((c) => /^ps-/.test(c)), b.getAttribute('aria-label')])

const tree: Row[] = [
	{ name: 'Keychains', slug: 'keychains', depth: 0 },
	{ name: 'Naruto keychains', slug: 'naruto-keychains', depth: 1 },
	{ name: 'Village emblems', slug: 'village-emblems', depth: 2 },
	{ name: 'Leaf emblems', slug: 'leaf-emblems', depth: 3 },
	{ name: 'Leaf pins', slug: 'leaf-pins', depth: 4 },
	{ name: 'Robot keychains', slug: 'robot-keychains', depth: 1 },
	{ name: 'Mugs', slug: 'mugs', depth: 0 },
	{ name: 'Posters', slug: 'posters', depth: 0 }
]

const matches: Row[] = [
	{ name: 'Keychains', slug: 'keychains', depth: 0 },
	{ name: 'Naruto keychains', slug: 'naruto-keychains', depth: 1 }
]

describe('the filter rail’s categories', () => {
	it('indent a category one step for each level under the root, up to three, name its parent, and keep the first five in tree order', () => {
		const rows = rail(tree)
		expect(indents(rows)).toEqual([
			['Keychains', [], null],
			['Naruto keychains', ['ps-3'], 'Naruto keychains, in Keychains'],
			['Village emblems', ['ps-6'], 'Village emblems, in Naruto keychains'],
			['Leaf emblems', ['ps-9'], 'Leaf emblems, in Village emblems'],
			['Leaf pins', ['ps-9'], 'Leaf pins, in Leaf emblems']
		])
		expect(rows[1].title).toBe('Naruto keychains, in Keychains')
		expect(rows[0].parentElement?.textContent).toContain('+ 3 more')
	})

	it('list a name search’s matches flush, since a ranked match has no parent above it', () => {
		expect(indents(rail(matches, 'keychains'))).toEqual([
			['Keychains', [], null],
			['Naruto keychains', [], null]
		])
	})

	it('draw a backend’s list without depths as they always did', () => {
		const [row] = rail([{ name: 'Naruto Keychains', slug: 'naruto-keychains' }])
		expect(row.outerHTML).toMatchInlineSnapshot(
			`"<button class="ed-btn-base inline-flex items-center justify-center rounded-radius text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 text-primary underline-offset-4 hover:underline max-md:min-h-11 ed-df__catbtn group h-auto gap-2 overflow-hidden text-ellipsis whitespace-nowrap px-0 py-1 text-start hover:bg-transparent" type="button" title="Naruto Keychains"><!----><!----> <span class="ed-df__cat flex-1 py-0.5 capitalize text-muted-foreground transition-colors group-hover:text-primary svelte-1xbwik7">Naruto Keychains</span><!----></button>"`
		)
	})
})

describe('the phone filter sheet’s categories', () => {
	it('indent a category one step for each level under the root, up to three, and name its parent, every row listed', () => {
		const rows = sheet(tree)
		expect(rows[1].title).toBe('Naruto keychains, in Keychains')
		expect(indents(rows)).toEqual([
			['Keychains', [], null],
			['Naruto keychains', ['ps-4'], 'Naruto keychains, in Keychains'],
			['Village emblems', ['ps-7'], 'Village emblems, in Naruto keychains'],
			['Leaf emblems', ['ps-10'], 'Leaf emblems, in Village emblems'],
			['Leaf pins', ['ps-10'], 'Leaf pins, in Leaf emblems'],
			['Robot keychains', ['ps-4'], 'Robot keychains, in Keychains'],
			['Mugs', [], null],
			['Posters', [], null]
		])
	})

	it('list a name search’s matches flush', () => {
		expect(indents(sheet(matches, 'keychains'))).toEqual([
			['Keychains', [], null],
			['Naruto keychains', [], null]
		])
	})

	it('draw a backend’s list without depths as they always did', () => {
		const [row] = sheet([{ name: 'Naruto Keychains', slug: 'naruto-keychains' }])
		expect(row.outerHTML).toMatchInlineSnapshot(
			`"<button class="ed-btn-base inline-flex items-center rounded-radius text-sm transition-colors disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:border-primary border border-transparent hover:text-primary max-md:min-h-11 group h-auto min-h-11 w-full justify-start gap-3 whitespace-normal rounded-none px-1 py-3 text-left font-normal hover:bg-transparent" type="button" title="Naruto Keychains"><!----><!----> <span class="ed-mf__opt min-w-0 flex-1 text-sm capitalize text-foreground transition-colors group-hover:text-primary">Naruto Keychains</span> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="lucide-icon lucide lucide-chevron-right size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"><!----><path d="m9 18 6-6-6-6"></path><!----><!----></svg><!----><!----></button>"`
		)
	})
})
