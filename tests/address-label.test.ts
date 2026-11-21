import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import AddressLabelChips from '$lib/components/address/address-label-chips.svelte'

// "Save address as Home / Work / Other" (GoCommerce D134): one choice, optional.
describe('the address label chips', () => {
	it('offer the three names as one radio group, with the saved one checked', () => {
		render(AddressLabelChips, { props: { value: 'Work' } })
		const radios = screen.getAllByRole('radio')
		expect(radios.map((r) => r.textContent?.trim())).toEqual(['Home', 'Work', 'Other'])
		expect(screen.getByRole('radio', { name: 'Work' })).toHaveAttribute('aria-checked', 'true')
		expect(screen.getByRole('radio', { name: 'Home' })).toHaveAttribute('aria-checked', 'false')
	})

	it('choose a name, and clear it when the chosen one is pressed again', async () => {
		render(AddressLabelChips, { props: { value: '' } })
		const home = screen.getByRole('radio', { name: 'Home' })
		await fireEvent.click(home)
		expect(home).toHaveAttribute('aria-checked', 'true')
		await fireEvent.click(home)
		expect(home).toHaveAttribute('aria-checked', 'false')
	})
})
