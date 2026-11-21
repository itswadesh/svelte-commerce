export type Line = { role: 'user' | 'assistant'; text: string }

/** What the engine takes (ext/shop-assistant); it refuses a turn past either. */
export const MAX_MESSAGE_LENGTH = 1000
const MAX_MESSAGES = 20

/**
 * What a turn sends. A failed line is this page's apology, not the assistant's words, so it stays
 * out; only role and text go, because a card already on screen says nothing the model should read.
 */
export function historyFor(entries: (Line & { failed?: boolean })[]): Line[] {
	return entries
		.filter((e) => !e.failed)
		.slice(-MAX_MESSAGES)
		.map((e) => ({ role: e.role, text: e.text.slice(0, MAX_MESSAGE_LENGTH) }))
}
