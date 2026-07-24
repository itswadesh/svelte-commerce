<script lang="ts">
	import { getUserState } from '$lib/core/stores/index.js'
	import { klaviyoIdentify, resolveKlaviyoConfig } from '$lib/klaviyo'

	let { storeData } = $props()

	// Admin plugin config first, env fallback — resolved by the shared helper so the
	// loader and the newsletter subscribe always agree on the same config.
	const { active: isActive, companyId } = resolveKlaviyoConfig(storeData?.plugins)

	const userState = getUserState()

	// Klaviyo's official pre-load shim: makes window.klaviyo callable immediately and
	// queues into _klOnsite until klaviyo.js loads and drains the queue.
	const KLAVIYO_SHIM = `!function(){if(!window.klaviyo){window._klOnsite=window._klOnsite||[];try{window.klaviyo=new Proxy({},{get:function(n,i){return"push"===i?function(){var n;(n=window._klOnsite).push.apply(n,arguments)}:function(){for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)o[w]=arguments[w];var t="function"==typeof o[o.length-1]?o.pop():void 0,e=new Promise((function(n){window._klOnsite.push([i].concat(o,[function(i){t&&t(i),n(i)}]))}));return e}}})}catch(n){window.klaviyo=window.klaviyo||[],window.klaviyo.push=function(){var n;(n=window._klOnsite).push.apply(n,arguments)}}}}();`

	$effect(() => {
		if (!isActive || typeof document === 'undefined') return

		const src = `https://static.klaviyo.com/onsite/js/${companyId}/klaviyo.js`
		if (document.querySelector(`script[src="${src}"]`)) return

		if (!document.getElementById('klaviyo-shim')) {
			const shim = document.createElement('script')
			shim.id = 'klaviyo-shim'
			shim.textContent = KLAVIYO_SHIM
			document.head.appendChild(shim)
		}

		const loader = document.createElement('script')
		loader.src = src
		loader.async = true
		document.head.appendChild(loader)
	})

	// Identify the logged-in shopper so onsite events attach to their Klaviyo profile
	// (fires once per email; re-fires if a different account logs in).
	let identifiedEmail = ''
	$effect(() => {
		const u = userState?.user
		if (isActive && u?.email && u.email !== identifiedEmail) {
			identifiedEmail = u.email
			klaviyoIdentify({ email: u.email, firstName: u.firstName, lastName: u.lastName, phone: u.phone })
		}
	})
</script>
