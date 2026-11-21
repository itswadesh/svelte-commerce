// The store's rules for taking an order (GoCommerce D271): a pause on orders and a minimum order.
// Checkout enforces both; these say so before the shopper gets that far. Each plugin arrives on the
// store record as `{ active: false }` while it is off, and then nothing here blocks anything.

export type OrderBlock = { paused: string } | { minimum: number; short: number } | null

/** Why the bag cannot be ordered now: the pause first, then how far it is under the minimum. */
export function orderBlock(plugins: any, subtotal: number | null | undefined): OrderBlock {
	if (plugins?.ordersPaused?.active) return { paused: String(plugins.ordersPaused.message || '') }
	const minimum = Number(plugins?.minimumOrder?.active ? plugins.minimumOrder.amount : 0)
	const have = Number(subtotal) || 0
	if (minimum > 0 && have < minimum) return { minimum, short: Math.round((minimum - have) * 100) / 100 }
	return null
}

export type CheckoutQuestion = { text: string; required: boolean }

/** The store's checkout questions, or none while the plugin is off. */
export const checkoutQuestions = (plugins: any): CheckoutQuestion[] =>
	plugins?.checkoutQuestions?.active ? (plugins.checkoutQuestions.questions ?? []) : []

/** The first required question left unanswered, if any. */
export const unanswered = (questions: CheckoutQuestion[], answers: Record<string, string>) =>
	questions.find((q) => q.required && !String(answers[q.text] ?? '').trim())
