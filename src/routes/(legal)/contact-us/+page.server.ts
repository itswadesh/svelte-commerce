import { legalContactUsLoadServer } from '$lib/core/load-functions/index.js'
import { PluginsService } from '$lib/core/services'
import { canSubmitContactForm, servesStorefrontRestApi } from '$lib/components/common/store-capabilities'

type Plugin = { key?: string; settings?: Record<string, unknown> }

export const load = async (event) => {
	const [base, plugins] = await Promise.all([
		legalContactUsLoadServer(event),
		servesStorefrontRestApi()
			? ([] as Plugin[])
			: new PluginsService(event.fetch)
					.list()
					.then((r: { data?: Plugin[] }) => r?.data ?? [])
					.catch(() => [] as Plugin[])
	])
	// The shop's own words from its contact-form plugin: the subjects it offers, and what it says
	// once a message is sent.
	const settings = (plugins as Plugin[]).find((p) => p?.key === 'contact-form')?.settings ?? {}
	return {
		...base,
		contactFormOpen: canSubmitContactForm(plugins),
		contactSubjects: String(settings.subjects ?? '')
			.split('\n')
			.map((s) => s.trim())
			.filter(Boolean),
		contactThanks: String(settings.thanks ?? '').trim()
	}
}
