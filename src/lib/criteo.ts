// Criteo's OneTag, for the store's own account: the engine's `criteo` plugin, which the connector
// hands over as store.plugins.criteo = { active, accountId }. Loaded by criteo-tag.svelte.

type CriteoPlugin = { active?: boolean; accountId?: unknown } | null | undefined

/** The account to load, or '' when the store has not switched Criteo on. Digits only: the value
 *  goes into a script URL. */
export function criteoAccount(plugin: CriteoPlugin): string {
	const id = String(plugin?.accountId ?? '').trim()
	return plugin?.active && /^\d{1,12}$/.test(id) ? id : ''
}

// The regions app.html's consent defaults treat as opt-in (EEA, UK, Switzerland). Criteo does not
// read Google's consent mode, so the browser's time zone stands in for the visitor's country.
// ponytail: a time zone is a proxy for a country; use the host's country header if one ever reaches the page.
const OPT_IN_ZONE = /^(Europe\/|Atlantic\/(Reykjavik|Canary|Madeira|Azores|Faroe)$)/

/** A saved cookie choice decides. Without one, opt-in regions wait for "Accept all"; elsewhere ads may load. */
export function adsAllowed(savedConsent: string | null, timeZone: string): boolean {
	try {
		const saved = JSON.parse(savedConsent || 'null')
		if (saved) return saved.ad_storage === 'granted'
	} catch {
		/* an unreadable choice is no choice */
	}
	return !OPT_IN_ZONE.test(timeZone)
}

/** Criteo's site type: m (phone), t (tablet) or d (desktop), from its own snippet. */
export function criteoSiteType(userAgent: string): 'm' | 't' | 'd' {
	return /iPad/.test(userAgent) ? 't' : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(userAgent) ? 'm' : 'd'
}

export function loadCriteo(account: string): void {
	const src = `https://dynamic.criteo.com/js/ld/ld.js?a=${account}`
	if (document.querySelector(`script[src="${src}"]`)) return
	const w = window as any
	w.criteo_q = w.criteo_q || []
	w.criteo_q.push({ event: 'setAccount', account: Number(account) }, { event: 'setSiteType', type: criteoSiteType(navigator.userAgent) })
	const script = document.createElement('script')
	script.src = src
	script.async = true
	document.head.appendChild(script)
}
