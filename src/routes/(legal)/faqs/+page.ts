import { FaqService } from '$lib/core/services/index.js'

// Server-render the FAQs. They used to be fetched in `onMount`, so the SSR HTML was a heading
// plus a skeleton — the page that answers "do you ship to X", "how long are returns" told
// crawlers and assistants nothing at all.
export const load = async ({ fetch }: any) => {
	try {
		const response: any = await new FaqService(fetch).listFaqs({ page: 1 })
		return { faqs: Array.isArray(response) ? response : (response?.data ?? []) }
	} catch (e) {
		console.error('FAQ load', e)
		return { faqs: [] }
	}
}
