import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { tidyPhone } from '$lib/utils/phone'

describe('tidyPhone', () => {
	it('makes the ways Indian numbers are written into digits', () => {
		expect(tidyPhone('+91 98765 01234')).toBe('+919876501234')
		expect(tidyPhone('98765 01234')).toBe('9876501234')
		expect(tidyPhone('098765-01234')).toBe('9876501234')
		expect(tidyPhone(' (987) 650.1234 ')).toBe('9876501234')
		expect(tidyPhone('9876501234')).toBe('9876501234')
	})

	it('keeps anything else for the rule to judge', () => {
		expect(tidyPhone('')).toBe('')
		expect(tidyPhone(null)).toBe('')
		expect(tidyPhone('abc')).toBe('')
		expect(tidyPhone('+0 12')).toBe('+012')
	})

	it('passes the shared phone rule once tidied', () => {
		const rule = z.string().regex(/^\+?[1-9]\d{1,14}$/).min(9)
		for (const typed of ['+91 98765 01234', '98765 01234', '098765 01234']) expect(rule.safeParse(tidyPhone(typed)).success, typed).toBe(true)
	})
})
