import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import Logo from '$lib/components/common/logo.svelte'
import NoorFooter from '$lib/theme/noor/NoorFooter.svelte'
import LimeFooter from '$lib/theme/lime/LimeFooter.svelte'

// The store record each page renders from: the engine's logo, dark logo and icon (D148)
// arrive on it as `logo`, `logoDark` and `favicon`.
import { page } from '$app/state'
const state = { page: page as unknown as { data: { store: Record<string, unknown> } } }

describe("the store's logo", () => {
	beforeEach(() => {
		state.page.data.store = { name: 'Lumen', logo: 'https://engine.test/media/logo.png', logoDark: 'https://engine.test/media/logo-dark.png' }
	})

	it('is what the header shows', () => {
		render(Logo)
		expect(screen.getByRole('img', { name: 'Lumen' })).toHaveAttribute('src', 'https://engine.test/media/logo.png')
	})

	it('is the dark one on a dark background, and the logo when there is none', () => {
		const { unmount } = render(Logo, { variant: 'light' })
		expect(screen.getByRole('img', { name: 'Lumen' })).toHaveAttribute('src', 'https://engine.test/media/logo-dark.png')
		unmount()
		state.page.data.store = { name: 'Lumen', logo: 'https://engine.test/media/logo.png' }
		render(Logo, { variant: 'light' })
		expect(screen.getByRole('img', { name: 'Lumen' })).toHaveAttribute('src', 'https://engine.test/media/logo.png')
	})

	it("falls back to the store's name", () => {
		state.page.data.store = { name: 'Lumen' }
		render(Logo)
		expect(screen.queryByRole('img')).toBeNull()
		expect(screen.getByText('Lumen')).toBeInTheDocument()
	})

	it("is in a theme's footer when the footer has no logo of its own", () => {
		const { unmount } = render(NoorFooter, { brandName: 'Lumen', footer: {} })
		expect(screen.getByRole('img', { name: 'Lumen' })).toHaveAttribute('src', 'https://engine.test/media/logo.png')
		unmount()
		// Lime's footer is dark: only the dark logo shows there, else the name.
		globalThis.matchMedia = (() => ({ matches: true, addEventListener() {}, removeEventListener() {} })) as never
		render(LimeFooter, { brandName: 'Lumen', footer: {} })
		expect(screen.getByRole('img', { name: 'Lumen' })).toHaveAttribute('src', 'https://engine.test/media/logo-dark.png')
	})
})
