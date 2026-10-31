import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'

const [dir, arial = 'C:/Windows/Fonts/arial.ttf', times = 'C:/Windows/Fonts/times.ttf'] = process.argv.slice(2)
if (!dir)
	throw new Error('usage: npm install --prefix <dir> @capsizecss/unpack@2, then node scripts/font-fallbacks.mjs <dir> [arial.ttf] [times.ttf]')
const { fromBuffer, fromFile } = createRequire(join(dir, 'package.json'))('@capsizecss/unpack')

const source = readFileSync(new URL('../src/lib/composer/theme-tokens.ts', import.meta.url), 'utf8')
const fonts = [...source.matchAll(/^\t'?([a-z0-9-]+)'?: \{ name: '([^']+)'(, serif: true)?, weights: \[[^\]]*\], fallback: \[([^\]]*)\]/gm)]
if (!fonts.length) throw new Error('no FONTS entries found in theme-tokens.ts')
const fallbacks = { sans: await fromFile(arial), serif: await fromFile(times) }

// A current Chrome's user agent, or Google Fonts answers with TrueType files and no latin block.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
async function latinFile(name) {
	const css = await (
		await fetch(`https://fonts.googleapis.com/css2?family=${name.replaceAll(' ', '+')}:wght@400`, { headers: { 'user-agent': UA } })
	).text()
	const url = css.match(/\/\* latin \*\/[^}]*?url\((https:[^)]+)\)/)?.[1]
	if (!url) throw new Error(`Google Fonts serves no latin file for ${name}`)
	return fromBuffer(Buffer.from(await (await fetch(url)).arrayBuffer()))
}

const percent = (n) => Math.round(n * 10000) / 100
let wrong = 0
for (const [, key, name, serif, table] of fonts) {
	const face = await latinFile(name)
	const fallback = fallbacks[serif ? 'serif' : 'sans']
	const sizeAdjust = face.xWidthAvg / face.unitsPerEm / (fallback.xWidthAvg / fallback.unitsPerEm)
	const em = face.unitsPerEm * sizeAdjust
	const metrics = [sizeAdjust, face.ascent / em, Math.abs(face.descent) / em, face.lineGap / em].map(percent).join(', ')
	const holds = metrics === table
	if (!holds) wrong++
	console.log(`${key.padEnd(20)} [${metrics}]${holds ? '' : `  table has [${table}]`}`)
}
process.exit(wrong ? 1 : 0)
