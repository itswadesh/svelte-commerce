// Fails when a default-theme storefront file colours itself outside the design tokens: a raw
// Tailwind palette class (text-gray-500, bg-blue-50), a `dark:` class (no dark token set exists,
// so they never apply), or a hex colour in a class. Those are what made account, auth and order
// pages look like a different shop from the catalogue. Use the semantic utilities in
// UX_SYSTEM.md section 2 instead. White and black stay allowed: text over photos and image scrims.
//
//   node scripts/check-tokens.mjs
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOTS = ['src/routes', 'src/lib/components', 'src/lib/theme/default']
const SKIP = /[\\/]components[\\/]ui[\\/]/
const PALETTE = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'
const BAD = new RegExp(
	String.raw`(?<![\w-])(?:[a-z-]+:)*(?:(?:bg|text|border|divide|ring|fill|stroke|from|via|to|placeholder|outline|shadow)-(?:${PALETTE})-\d{2,3}|dark:[^\s"'\x60}]+|(?:bg|text|border)-\[#[0-9a-fA-F]{3,8}\])`,
	'g'
)

const files = (dir) =>
	readdirSync(dir).flatMap((name) => {
		const path = join(dir, name)
		return statSync(path).isDirectory() ? files(path) : path.endsWith('.svelte') && !SKIP.test(path) ? [path] : []
	})

let count = 0
for (const file of ROOTS.flatMap(files)) {
	readFileSync(file, 'utf8')
		.split('\n')
		.forEach((line, i) => {
			if (/^\s*(\/\/|<!--|\*)/.test(line)) return
			for (const [hit] of line.matchAll(BAD)) {
				count++
				console.log(`${file}:${i + 1}  ${hit}`)
			}
		})
}
if (count) {
	console.error(`\n${count} off-token colour class(es). Map them to the semantic tokens (UX_SYSTEM.md section 2).`)
	process.exit(1)
}
console.log('check-tokens: every storefront colour comes from the design tokens')
