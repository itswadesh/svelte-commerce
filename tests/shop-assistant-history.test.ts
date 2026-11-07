import { describe, expect, it } from 'vitest'
import { historyFor, MAX_MESSAGE_LENGTH } from '../src/lib/components/chat/shop-assistant-history'

describe('historyFor', () => {
	it('leaves out failures and everything but role and text', () => {
		const out = historyFor([
			{ role: 'user', text: 'earrings' },
			{ role: 'assistant', text: 'Sorry.', failed: true },
			{ role: 'user', text: 'earrings again' },
			{ role: 'assistant', text: 'Let me look.', answer: { products: [] } } as never,
			{ role: 'user', text: 'cheaper' }
		])
		expect(out).toEqual([
			{ role: 'user', text: 'earrings' },
			{ role: 'user', text: 'earrings again' },
			{ role: 'assistant', text: 'Let me look.' },
			{ role: 'user', text: 'cheaper' }
		])
	})

	it('stays inside what the engine takes, keeping the newest', () => {
		const long = Array.from({ length: 30 }, (_, i) => ({ role: 'user' as const, text: `m${i}` }))
		const out = historyFor(long)
		expect(out).toHaveLength(20)
		expect(out.at(-1)?.text).toBe('m29')
		expect(historyFor([{ role: 'user', text: 'x'.repeat(5000) }])[0].text).toHaveLength(MAX_MESSAGE_LENGTH)
	})
})
