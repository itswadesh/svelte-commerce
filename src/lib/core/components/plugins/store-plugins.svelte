<script>
	import { browser } from '$app/environment'

	const { storeData } = $props()

	// $effect(() => {
	if (storeData?.plugins?.tawkTo?.active && browser) {
		// Clean up existing scripts to avoid duplicates
		const existingLoader = document.querySelector('script[src="https://cdn.reamaze.com/assets/reamaze-loader.js"]')
		const existingConfig = document.querySelector('script#reamaze-config')

		if (existingLoader) existingLoader.remove()
		if (existingConfig) existingConfig.remove()

		// Create and append loader script
		const loaderScript = document.createElement('script')
		loaderScript.src = 'https://cdn.reamaze.com/assets/reamaze-loader.js'
		loaderScript.async = true

		// Create and append configuration script
		const configScript = document.createElement('script')
		configScript.id = 'reamaze-config'
		configScript.textContent = `
    var _support = _support || { ui: {}, user: {} };
    _support.account = ${JSON.stringify(storeData?.plugins?.tawkTo?.account || 'secretgreen2')};
    _support.ui = {
     contactMode: 'default',
     enableKb: 'true',
     styles: {
      widgetColor: ${JSON.stringify(storeData?.plugins?.tawkTo?.widgetColor || 'rgba(16, 162, 197, 1)')},
      gradient: ${storeData?.plugins?.tawkTo?.enableGradient || true},
     },
     shoutboxFacesMode: 'default',
     shoutboxHeaderLogo: true,
     widget: {
      displayOn: 'all',
      fontSize: 'default',
      allowBotProcessing: ${storeData?.plugins?.tawkTo?.allowBotProcessing || true},
      slug: ${JSON.stringify(storeData?.plugins?.tawkTo?.slug || 'secretgreen-chat-slash-contact-form-shoutbox')},
      label: {
       text: ${JSON.stringify(storeData?.plugins?.tawkTo?.labelText || 'Let us know if you have any questions! &#128522;')},
       mode: 'notification',
       delay: ${storeData?.plugins?.tawkTo?.labelDelay || 3},
       duration: ${storeData?.plugins?.tawkTo?.labelDuration || 30},
       primary: ${JSON.stringify(storeData?.plugins?.tawkTo?.labelPrimary || 'I have a question')},
       secondary: ${JSON.stringify(storeData?.plugins?.tawkTo?.labelSecondary || 'No, thanks')},
       sound: ${JSON.stringify(storeData?.plugins?.tawkTo?.enableLabelSound || true)},
      },
      position: ${JSON.stringify(storeData?.plugins?.tawkTo?.widgetPosition || 'bottom-right')},
      mobilePosition: ${JSON.stringify(storeData?.plugins?.tawkTo?.widgetMobilePosition || 'bottom-right')},
     }
    };
    _support.apps = {
     faq: { enabled: ${storeData?.plugins?.tawkTo?.enableFaq || true} },
     recentConversations: {},
     orders: {},
     shopper: {}
    };
   `

		document.head.appendChild(loaderScript)
		document.head.appendChild(configScript)
	}
	// })

	// $effect(() => {
	if (storeData?.plugins?.tidio?.active && browser) {
		// Clean up existing script to avoid duplicates
		const existingScript = document.querySelector('script[src="//code.tidio.co/"]')
		if (existingScript) existingScript.remove()

		// Create and append Tidio script
		const tidioScript = document.createElement('script')
		tidioScript.src = `//code.tidio.co/${storeData?.plugins?.tidio?.publicKey || ''}.js`
		tidioScript.async = true
		document.body.appendChild(tidioScript)
	}
	// })

	// $effect(() => {
	if (storeData?.plugins?.plausible?.active && browser) {
		// Clean up existing script to avoid duplicates
		const existingScript = document.querySelector('script[src*="/js/script.js"]')
		if (existingScript) existingScript.remove()

		// Create and append Plausible script
		const plausibleScript = document.createElement('script')
		plausibleScript.src = storeData?.plugins?.plausible?.script || 'https://utilities-plausible.g5edov.easypanel.host/js/script.js'
		plausibleScript.defer = true
		plausibleScript.setAttribute('data-domain', storeData?.plugins?.plausible?.domain || 'secertgreen.com.au')
		document.body.appendChild(plausibleScript)
	}
	// })

	// $effect(() => {
	if (storeData?.plugins?.umami?.active && browser) {
		// Clean up existing script to avoid duplicates
		const existingScript = document.querySelector('script[src*="/script.js"]')
		if (existingScript) existingScript.remove()

		// Create and append Umami script
		const umamiScript = document.createElement('script')
		umamiScript.src = storeData?.plugins?.umami?.script || 'https://utilities-umami.g5edov.easypanel.host/script.js'
		umamiScript.defer = true
		umamiScript.setAttribute('data-website-id', storeData?.plugins?.umami?.websiteId || 'aac0e3f5-1766-4a9d-8c97-99852d7019cb')
		document.body.appendChild(umamiScript)
	}
	// })
</script>
