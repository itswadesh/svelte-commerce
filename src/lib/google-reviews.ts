/**
 * Google reviews on this storefront (GoCommerce's ext/google-reviews, through the connector).
 *
 * Everything here is an extra on a page that must render without it, so each entry point answers
 * nothing rather than throwing, and each Google script is loaded only when it is needed, after the
 * page itself.
 */

/** A Google review with what Google's attribution policy asks a storefront to show. */
export type GoogleReview = {
	author: string
	authorUrl: string
	authorPhoto: string
	rating: number
	text: string
	language: string
	when: string
	visited: string
	url: string
	reportUrl: string
}

export type GoogleReviews = { rating: number; count: number; mapsUrl: string; reviews: GoogleReview[] }

/** Google Customer Reviews' opt-in fields, built by the engine from the order; Google's own keys. */
export type GoogleSurvey = {
	merchant_id: number
	order_id: string
	email: string
	delivery_country: string
	estimated_delivery_date: string
	opt_in_style?: string
}

type GoogleReviewService = {
	place?: () => Promise<GoogleReviews | null>
	survey?: (orderNumber: string) => Promise<GoogleSurvey | null>
}

// Reflect.get, as for the layout service: a connector from before the service exists answers
// nothing instead of failing the build.
async function service(): Promise<GoogleReviewService | undefined> {
	const { services } = await import('kitcommerce.config')
	return Reflect.get(services as object, 'googleReviewService') as GoogleReviewService | undefined
}

/** The store's Google rating and reviews, read live (Google's terms forbid keeping them). */
export async function loadGoogleReviews(): Promise<GoogleReviews | null> {
	return (await (await service())?.place?.()) ?? null
}

/** The survey offer's fields for an order placed in this browser, or null. */
export async function loadSurvey(orderNumber: string): Promise<GoogleSurvey | null> {
	return (await (await service())?.survey?.(orderNumber)) ?? null
}

function addScript(src: string, id?: string): HTMLScriptElement | null {
	if (document.querySelector(`script[src="${src}"]`)) return null
	const s = document.createElement('script')
	s.src = src
	s.async = true
	if (id) s.id = id
	document.head.appendChild(s)
	return s
}

const PLATFORM = 'https://apis.google.com/js/platform.js?onload=renderOptIn'

/**
 * Google Customer Reviews' survey offer (support.google.com/merchants/answer/7106244). The fields
 * go to Google's render call as an object, never pasted into script text.
 */
export function showSurvey(survey: GoogleSurvey): void {
	const w = window as unknown as {
		renderOptIn?: () => void
		gapi?: { load: (name: string, fn: () => void) => void; surveyoptin: { render: (o: GoogleSurvey) => void } }
	}
	w.renderOptIn = () => w.gapi?.load('surveyoptin', () => w.gapi?.surveyoptin.render(survey))
	// Loaded already (a second order this visit): Google will not call renderOptIn again.
	if (!addScript(PLATFORM) && w.gapi) w.renderOptIn()
}

/**
 * Google Customer Reviews' store widget, the badge with the store's rating
 * (support.google.com/merchants/answer/7105655).
 */
export function startStoreWidget(position: 'RIGHT_BOTTOM' | 'LEFT_BOTTOM'): void {
	const s = addScript('https://www.gstatic.com/shopping/merchant/merchantwidget.js', 'merchantWidgetScript')
	s?.addEventListener('load', () => (window as unknown as { merchantwidget?: { start: (o: object) => void } }).merchantwidget?.start({ position }))
}
