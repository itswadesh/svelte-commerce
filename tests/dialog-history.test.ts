import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import StackedDialogs from './fixtures/stacked-dialogs.svelte'

const settle = () => new Promise((r) => setTimeout(r, 50))

describe('a dialog that opens as another closes', () => {
	it('stays open, and Back still closes it', async () => {
		render(StackedDialogs)
		const start = history.length

		await fireEvent.click(screen.getByText('Open form'))
		await settle()
		await fireEvent.click(screen.getByText('Save'))
		await settle()
		expect(screen.getByText('form closed, list open')).toBeTruthy()

		history.back()
		await settle()
		expect(screen.getByText('form closed, list closed')).toBeTruthy()
		expect(history.length).toBe(start + 1)
	})
})
