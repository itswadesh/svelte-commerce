// The digit grouping a currency's shoppers read. Any other currency groups in threes.
const LOCALE: Record<string, string> = { INR: 'en-IN' }

/**
 * A price as the kitcommerce-core formatter writes it (`₹2799.00`, `$12.00 AUD`, `¥1200 JPY`), with
 * the amount grouped the way the currency's shoppers read it and no `.00` on a whole amount:
 * `₹2,799`, `₹1,29,999`, `₹499.50`. The symbol and any currency code stay as core placed them. Text
 * that does not carry the amount the way core writes it comes back unchanged.
 */
export function shopperPrice(text: string, price: unknown, currencyCode?: string): string {
	if (typeof text !== 'string' || typeof price !== 'number' || !Number.isFinite(price)) return text
	const written = [price.toFixed(2), Math.round(price).toString()].find((amount) => text.includes(amount))
	if (!written) return text
	const cents = /\.\d\d$/.test(written) && !written.endsWith('.00') ? 2 : 0
	const locale = LOCALE[currencyCode?.toUpperCase() ?? ''] ?? 'en-US'
	const grouped = new Intl.NumberFormat(locale, { minimumFractionDigits: cents, maximumFractionDigits: cents }).format(Number(written))
	return text.replace(written, grouped)
}
