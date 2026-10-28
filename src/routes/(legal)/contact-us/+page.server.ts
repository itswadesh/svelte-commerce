import { legalContactUsLoadServer } from '$lib/core/load-functions/index.js'
import { PluginsService } from '$lib/core/services'
import { canSubmitContactForm, servesStorefrontRestApi } from '$lib/components/common/store-capabilities'

export const load = async (event) => {
	const [base, plugins] = await Promise.all([
		legalContactUsLoadServer(event),
		servesStorefrontRestApi()
			? []
			: new PluginsService(event.fetch)
					.list()
					.then((r: { data?: Array<{ key?: string }> }) => r?.data ?? [])
					.catch(() => [])
	])
	return { ...base, contactFormOpen: canSubmitContactForm(plugins) }
}
