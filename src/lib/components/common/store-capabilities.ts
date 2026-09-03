import { services } from 'kitcommerce.config'

/**
 * What this store can actually do, asked at the call site.
 *
 * Two surfaces used to promise things the backend cannot deliver:
 *
 * - The contact form and the newsletter form both write to the storefront's own Litekart REST API
 *   (`/api/contact-us`, `/api/newsletter/subscribe`). On any other backend there is no such API —
 *   `src/lib/core/connectors/rest-guard.ts` blocks the whole `/api/**` class at the prototype so it
 *   fails fast instead of as a proxy ECONNREFUSED — so every submit returned "Failed to send
 *   message. Please try again later.", and retrying could never succeed.
 * - The support-chat plugin mounts a third-party widget whose account id falls back to another
 *   business's inbox when the merchant switches the plugin on before filling the id in.
 *
 * Both are questions about configuration, not about the shopper, so they are answered once here
 * rather than guessed in each component.
 */

type ActiveServices = {
	connectorName?: string
	BaseService?: { prototype?: Record<string, unknown> }
}

const active = services as unknown as ActiveServices

/**
 * Whether Litekart's REST API (`/api/**`) is behind this store.
 *
 * Read from the guard itself where it has been installed — `blockRestFallbacks` stamps the
 * connector's own BaseService prototype at module load — and from the connector marker otherwise,
 * which is the same test `init.ts` uses to decide whether to install it.
 */
export function servesStorefrontRestApi(): boolean {
	if (active?.BaseService?.prototype?.__litekartRestBlocked) return false
	return (active?.connectorName ?? 'litekart') === 'litekart'
}

/** The contact form posts to `/api/contact-us`. */
export const canSubmitContactForm = (): boolean => servesStorefrontRestApi()

/** The newsletter form posts to `/api/newsletter/subscribe`. */
export const canSubscribeToNewsletter = (): boolean => servesStorefrontRestApi()

type SupportChatPlugins = {
	tawkTo?: { active?: boolean; account?: string }
	tidio?: { active?: boolean; publicKey?: string }
}

/**
 * Whether a support-chat widget is both switched on and fully configured.
 *
 * The core `StorePlugins` component substitutes a demo account id and slug when the merchant has
 * not supplied one, so an active-but-unconfigured plugin puts a live chat bubble on every page that
 * delivers shoppers into another business's support inbox. Mount the component only when there is a
 * real account to reach.
 */
export function hasConfiguredSupportChat(plugins: SupportChatPlugins | undefined | null): boolean {
	const tawkTo = plugins?.tawkTo
	const tidio = plugins?.tidio
	return !!(tawkTo?.active && tawkTo?.account) || !!(tidio?.active && tidio?.publicKey)
}
