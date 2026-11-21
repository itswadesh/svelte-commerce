import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { stripIpLookup } from '../src/lib/build/no-ip-lookup'

describe('stripIpLookup', () => {
	it.each(['gtag.js', 'analytics.js'])('leaves no ipify request in the installed kitcommerce-core utils/%s', (file) => {
		const code = readFileSync(resolve('node_modules/@misiki/kitcommerce-core/dist/utils', file), 'utf8')
		expect(code).toContain('ipify.org')
		const out = stripIpLookup(code)
		expect(out).not.toContain('ipify.org')
		expect(out).toContain('Promise.reject()')
	})

	it('refuses a lookup it does not recognise rather than shipping it', () => {
		expect(() => stripIpLookup("const u = 'https://api64.ipify.org'; fetch(u)")).toThrow(/ipify/)
	})

	it('leaves other code alone', () => {
		const code = "fetch('https://example.com/a.json').then((r) => r.json())"
		expect(stripIpLookup(code)).toBe(code)
	})
})
