// @ts-nocheck — each body is the vendor's own base code, only reformatted, so it can be compared
// with the source; none of it was written to type-check.

// Each loader is the vendor's base code with the store's ID in place of the placeholder: it defines
// the vendor's queue function, inserts the vendor's script (async) and sends the first page view.
// ad-tags.ts runs one only after consent and the shopper's first interaction.

// https://developers.google.com/tag-platform/gtagjs/install — the Google tag, for GA4 and Google
// Ads, on a data layer of its own (`l=`, https://developers.google.com/tag-platform/devguides/datalayer#rename_the_data_layer).
// The page's dataLayer holds every event since the page opened; this one gets the page's consent
// commands first, then only what ad-tags.ts hands on, so nothing from before the shopper's choice
// reaches Google. Both IDs share one tag, as Google's snippet does with a second `config`.
function googleTag(id, consent) {
	const w = window
	if (!w.gcGtag) {
		w.gcLayer = w.gcLayer || []
		w.gcGtag = function () {
			w.gcLayer.push(arguments)
		}
		for (const command of consent) w.gcGtag(...command)
		const s = document.createElement('script')
		s.async = true
		s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id + '&l=gcLayer'
		document.head.appendChild(s)
		w.gcGtag('js', new Date())
	}
	w.gcGtag('config', id)
}

export const LOADERS = {
	ga4: googleTag,
	gads(target, consent) {
		googleTag(target.split('/')[0], consent)
	},

	// https://developers.google.com/tag-platform/tag-manager/web — the container snippet, on a data
	// layer of its own (`gtmLayer`), for the reason the Google tag has one: a container reads its
	// whole layer when it starts, and the page's holds every event since the page opened, with
	// core's personal details. This one gets the page's consent commands first, then only the events
	// ad-tags.ts hands on, in Google's e-commerce shape.
	gtm(id, consent) {
		const w = window
		w.gtmLayer = w.gtmLayer || []
		w.gtmGtag = function () {
			w.gtmLayer.push(arguments)
		}
		for (const command of consent) w.gtmGtag(...command)
		;(function (w, d, s, l, i) {
			w[l] = w[l] || []
			w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
			var f = d.getElementsByTagName(s)[0],
				j = d.createElement(s),
				dl = l != 'dataLayer' ? '&l=' + l : ''
			j.async = true
			j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
			f.parentNode.insertBefore(j, f)
		})(window, document, 'script', 'gtmLayer', id)
	},

	// https://developers.facebook.com/docs/meta-pixel/get-started
	meta(id) {
		!(function (f, b, e, v, n, t, s) {
			if (f.fbq) return
			n = f.fbq = function () {
				n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
			}
			if (!f._fbq) f._fbq = n
			n.push = n
			n.loaded = !0
			n.version = '2.0'
			n.queue = []
			t = b.createElement(e)
			t.async = !0
			t.src = v
			s = b.getElementsByTagName(e)[0]
			s.parentNode.insertBefore(t, s)
		})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
		// Meta's own page view on a history change fires before the new page has taken anything
		// private out of its address; ad-tags.ts sends each one afterwards instead.
		window.fbq.disablePushState = true
		window.fbq('init', id)
		window.fbq('track', 'PageView')
	},

	// https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup — the tracking
	// code Clarity's Setup page gives, as Microsoft's @microsoft/clarity package injects it.
	clarity(id) {
		;(function (c, l, a, r, i, t, y) {
			c[a] =
				c[a] ||
				function () {
					;(c[a].q = c[a].q || []).push(arguments)
				}
			t = l.createElement(r)
			t.async = 1
			t.src = 'https://www.clarity.ms/tag/' + i
			y = l.getElementsByTagName(r)[0]
			y.parentNode.insertBefore(t, y)
		})(window, document, 'clarity', 'script', id)
	},

	// https://help.hotjar.com/hc/en-us/articles/115009336727 — the tracking code, hjsv 6, as
	// Hotjar's @hotjar/browser package writes it.
	hotjar(id) {
		;(function (h, o, t, j, a, r) {
			h.hj =
				h.hj ||
				function () {
					;(h.hj.q = h.hj.q || []).push(arguments)
				}
			h._hjSettings = { hjid: id, hjsv: 6 }
			a = o.getElementsByTagName('head')[0]
			r = o.createElement('script')
			r.async = 1
			r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
			a.appendChild(r)
		})(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=')
	},

	// TikTok Ads Manager › Events › Web events › manual install: the base code.
	tiktok(id) {
		!(function (w, d, t) {
			w.TiktokAnalyticsObject = t
			var ttq = (w[t] = w[t] || [])
			;((ttq.methods = [
				'page',
				'track',
				'identify',
				'instances',
				'debug',
				'on',
				'off',
				'once',
				'ready',
				'alias',
				'group',
				'enableCookie',
				'disableCookie',
				'holdConsent',
				'revokeConsent',
				'grantConsent'
			]),
				(ttq.setAndDefer = function (t, e) {
					t[e] = function () {
						t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
					}
				}))
			for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i])
			;((ttq.instance = function (t) {
				for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n])
				return e
			}),
				(ttq.load = function (e, n) {
					var r = 'https://analytics.tiktok.com/i18n/pixel/events.js'
					;((ttq._i = ttq._i || {}),
						(ttq._i[e] = []),
						(ttq._i[e]._u = r),
						(ttq._t = ttq._t || {}),
						(ttq._t[e] = +new Date()),
						(ttq._o = ttq._o || {}),
						(ttq._o[e] = n || {}))
					n = document.createElement('script')
					;((n.type = 'text/javascript'), (n.async = !0), (n.src = r + '?sdkid=' + e + '&lib=' + t))
					e = document.getElementsByTagName('script')[0]
					e.parentNode.insertBefore(n, e)
				}))
			ttq.load(id)
			ttq.page()
		})(window, document, 'ttq')
	},

	// https://developers.pinterest.com/docs/track-conversions/pinterest-tag/ — the base code.
	pinterest(id) {
		!(function (e) {
			if (!window.pintrk) {
				window.pintrk = function () {
					window.pintrk.queue.push(Array.prototype.slice.call(arguments))
				}
				var n = window.pintrk
				;((n.queue = []), (n.version = '3.0'))
				var t = document.createElement('script')
				;((t.async = !0), (t.src = e))
				var r = document.getElementsByTagName('script')[0]
				r.parentNode.insertBefore(t, r)
			}
		})('https://s.pinimg.com/ct/core.js')
		window.pintrk('load', id)
		window.pintrk('page')
	},

	// https://developers.snap.com/marketing-api/Ads-API/snap-pixel — the pixel code. Snap's snippet
	// assigns `r` without declaring it, which a module (strict mode) refuses; it is declared here.
	snap(id) {
		;(function (e, t, n) {
			if (e.snaptr) return
			var a = (e.snaptr = function () {
				a.handleRequest ? a.handleRequest.apply(a, arguments) : a.queue.push(arguments)
			})
			a.queue = []
			var s = 'script'
			var r = t.createElement(s)
			r.async = !0
			r.src = n
			var u = t.getElementsByTagName(s)[0]
			u.parentNode.insertBefore(r, u)
		})(window, document, 'https://sc-static.net/scevent.min.js')
		window.snaptr('init', id)
		window.snaptr('track', 'PAGE_VIEW')
	}
}
