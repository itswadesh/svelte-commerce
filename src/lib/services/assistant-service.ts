// Client for the Conversational Shopping Advisor backend
// (kitcommerce-api `/api/commerce-assistant/*`). All calls are relative — the
// storefront's hooks.server.ts rewrites `/api/*` to the backend host and the
// tenant (`litekart_store_id`) + auth (`connect.sid`) cookies flow automatically,
// so no manual headers are required (mirrors @misiki/litekart-connector's
// BaseService, which is itself a thin fetch wrapper).

export interface DeliveryFeasibility {
	eligible: boolean
	estimatedShipDate?: string
	estimatedDeliveryDate?: string
	eventDate?: string
	bufferDays: number
	confidence: 'guaranteed' | 'high' | 'medium' | 'low'
	reasonCodes: string[]
}

export interface AssistantAction {
	type: 'add_to_cart' | 'view_product' | 'answer_question' | 'refine'
	label: string
	productId?: string
	variantId?: string
	url?: string
	value?: string
}

export interface ProductRecommendation {
	productId: string
	variantId: string | null
	title: string
	image: string | null
	price: number
	currency: string
	metal?: string
	diamond?: string
	certification?: string
	availableSizes: string[]
	fulfillment: 'ready_to_ship' | 'made_to_order' | 'backorder' | 'unavailable'
	delivery: DeliveryFeasibility
	reasons: string[]
	isAlternative: boolean
	actions: AssistantAction[]
	productUrl: string
}

export interface AssistantNextQuestion {
	id: string
	text: string
	options?: Array<{ label: string; value: string }>
}

export interface AssistantMessageResponse {
	message: string
	intent: Record<string, unknown>
	nextQuestion?: AssistantNextQuestion
	recommendations?: ProductRecommendation[]
	actions?: AssistantAction[]
	warnings?: string[]
}

export interface AssistantSession {
	sessionId: string
	anonymousId: string | null
	currency: string | null
	locale: string | null
}

export type AddToCartResult =
	| { valid: true; item: Record<string, unknown> }
	| { valid: false; reason: string; reasonCode?: string }

const BASE = '/api/commerce-assistant'

export class AssistantService {
	private fetchFn: typeof fetch

	constructor(fetchFn: typeof fetch = fetch) {
		this.fetchFn = fetchFn
	}

	private async request<T>(url: string, body?: unknown): Promise<{ status: number; data: T }> {
		const res = await this.fetchFn(url, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body ?? {})
		})
		const data = (await res.json().catch(() => ({}))) as T
		return { status: res.status, data }
	}

	async getConfig(): Promise<{ enabled: boolean; currency: string; maxRecommendations: number }> {
		try {
			const res = await this.fetchFn(`${BASE}/config`, { headers: { accept: 'application/json' } })
			if (!res.ok) return { enabled: false, currency: 'INR', maxRecommendations: 5 }
			return (await res.json()) as { enabled: boolean; currency: string; maxRecommendations: number }
		} catch {
			return { enabled: false, currency: 'INR', maxRecommendations: 5 }
		}
	}

	async createSession(anonymousId?: string, locale?: string): Promise<AssistantSession> {
		const { data } = await this.request<AssistantSession>(`${BASE}/sessions`, { anonymousId, locale })
		return data
	}

	async sendMessage(sessionId: string, message: string): Promise<AssistantMessageResponse> {
		const { data } = await this.request<AssistantMessageResponse>(
			`${BASE}/sessions/${sessionId}/messages`,
			{ message }
		)
		return data
	}

	async addToCart(
		sessionId: string,
		item: { productId: string; variantId: string; qty?: number }
	): Promise<AddToCartResult> {
		const { data } = await this.request<AddToCartResult>(
			`${BASE}/sessions/${sessionId}/add-to-cart`,
			{ ...item, qty: item.qty ?? 1 }
		)
		return data
	}

	async postEvent(
		sessionId: string,
		event: { type: string; productId?: string; value?: string }
	): Promise<void> {
		await this.request(`${BASE}/sessions/${sessionId}/events`, event)
	}
}

export const assistantService = new AssistantService()
