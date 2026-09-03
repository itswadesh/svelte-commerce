/**
 * Keeps a merchant's admin-set palette from breaking the surfaces the storefront is built on.
 *
 * `store.cssVariables` is edited on the admin Theme page and applied over the active theme's own
 * tokens. Brand colours are the merchant's to choose. Surfaces are not purely a choice: `--muted`,
 * `--background`, `--card` and `--popover` are grounds that fixed, dark foreground tokens are
 * printed on, so their lightness carries a structural job as well as a look.
 *
 * The demo store sets `--muted: 240 10% 70%` — #ABABBA — and does not set `--muted-foreground`.
 * The theme's own value is `210 40% 96%`, so the ground dropped 26 points of lightness while the
 * text on it stayed at 44%. Measured on the sign-in dialog's phone/email switcher that pairing is
 * 2.32:1, against a 4.5:1 floor, and `bg-muted` is used for hover states, skeletons, avatars and
 * placeholders on every page.
 *
 * The rule, deliberately narrow:
 *
 * - Only the four ground tokens are touched. Everything else — `--primary`, `--accent`,
 *   `--secondary`, `--destructive` and their foregrounds — is passed through untouched.
 * - A merchant who overrides a ground **and** its paired foreground has declared a complete pair
 *   and knows what they are doing. That pair is passed through untouched, which is why this store's
 *   deliberately dark `--secondary` with its near-white `--secondary-foreground` still works.
 * - Only an unpaired ground is clamped, and only its lightness. Hue and saturation survive, so the
 *   merchant's tint is kept and only the part that breaks legibility is corrected.
 *
 * This does not decide whether a colour is attractive. It only refuses to print dark text on a
 * ground the merchant never said was dark.
 */

/** Ground tokens, with the minimum lightness each needs to stay readable under dark text. */
const GROUND_FLOORS: Record<string, number> = {
	'--muted': 90,
	'--background': 95,
	'--card': 95,
	'--popover': 95
}

/** `hsl(240, 10%, 70%)` and `240 10% 70%` are both valid here; the storefront stores the latter. */
function parseHsl(value: string): { h: string; s: string; l: number } | null {
	const parts = value.replaceAll(',', ' ').replace('hsl(', '').replace(')', '').trim().split(/\s+/)
	if (parts.length < 3) return null
	const l = Number.parseFloat(parts[2])
	if (!Number.isFinite(l)) return null
	return { h: parts[0], s: parts[1], l }
}

/**
 * Strip a stored value down to the raw triplet shadcn expects (`240 10% 70%`), which is the same
 * transform the core ColorPalette component applies.
 */
export function toRawTriplet(value: string): string {
	return value.replaceAll(',', '').replace('hsl(', '').replace(')', '').trim()
}

/**
 * Returns the palette to apply: every entry the merchant set, with an unpaired ground token's
 * lightness raised to its floor. Input is left untouched.
 */
export function guardStorePalette(vars: Record<string, unknown>): Record<string, string> {
	const out: Record<string, string> = {}

	for (const [key, value] of Object.entries(vars ?? {})) {
		if (typeof value !== 'string' || !value || !key.startsWith('--')) continue
		out[key] = toRawTriplet(value)
	}

	for (const [token, floor] of Object.entries(GROUND_FLOORS)) {
		const raw = out[token]
		if (!raw) continue
		// A declared pair is the merchant's call, whatever the lightness.
		if (out[`${token}-foreground`]) continue

		const hsl = parseHsl(raw)
		if (!hsl || hsl.l >= floor) continue
		out[token] = `${hsl.h} ${hsl.s} ${floor}%`
	}

	return out
}
