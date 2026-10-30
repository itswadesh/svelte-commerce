import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

// A var() naming a token nothing declares fails silently: the property falls back to inheriting,
// so a mistyped `var(--type-uii)` ships text at whatever size its parent happens to have.
const FAMILY = /var\(\s*(--(?:type|leading|tracking|weight|space|grid-gap)-[a-z0-9-]+)/g

function files(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name)
		return statSync(path).isDirectory() ? files(path) : /\.(svelte|css|ts)$/.test(name) ? [path] : []
	})
}

describe('type and spacing tokens', () => {
	it('every one read in src is declared in src/app.css', () => {
		const css = readFileSync('src/app.css', 'utf8')
		const declared = new Set([...css.matchAll(/(--(?:type|leading|tracking|weight|space|grid-gap)-[a-z0-9-]+)\s*:/g)].map((m) => m[1]))
		const missing = files('src').flatMap((file) =>
			[...readFileSync(file, 'utf8').matchAll(FAMILY)].filter((m) => !declared.has(m[1])).map((m) => `${file}: ${m[1]}`)
		)
		expect(declared.size).toBeGreaterThan(0)
		expect(missing).toEqual([])
	})
})
