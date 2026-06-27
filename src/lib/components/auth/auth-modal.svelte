<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import LoginModal from './login-modal.svelte'
	import SignupModal from './signup-modal.svelte'
	import { onNavigate } from '$app/navigation'
	import { showModal, type AuthType } from '$lib/core/components/index.js'
	import ForgotPasswordModal from './forgot-password-modal.svelte'

	let { show = $bindable() } = $props()

	let type: AuthType = $state('login')
	const modalHistoryKey = '__svelteCommerceAuthModal'
	let ownsHistoryEntry = false
	let scrollLock:
		| {
				scrollY: number
				bodyOverflow: string
				bodyPosition: string
				bodyTop: string
				bodyWidth: string
				htmlOverflow: string
		  }
		| undefined

	function lockPageScroll() {
		if (typeof window === 'undefined' || scrollLock) return

		const scrollY = window.scrollY
		scrollLock = {
			scrollY,
			bodyOverflow: document.body.style.overflow,
			bodyPosition: document.body.style.position,
			bodyTop: document.body.style.top,
			bodyWidth: document.body.style.width,
			htmlOverflow: document.documentElement.style.overflow
		}

		document.documentElement.style.overflow = 'hidden'
		document.body.style.overflow = 'hidden'
		document.body.style.position = 'fixed'
		document.body.style.top = `-${scrollY}px`
		document.body.style.width = '100%'
	}

	function unlockPageScroll() {
		if (typeof window === 'undefined' || !scrollLock) return

		const { scrollY, bodyOverflow, bodyPosition, bodyTop, bodyWidth, htmlOverflow } = scrollLock
		document.documentElement.style.overflow = htmlOverflow
		document.body.style.overflow = bodyOverflow
		document.body.style.position = bodyPosition
		document.body.style.top = bodyTop
		document.body.style.width = bodyWidth
		scrollLock = undefined
		window.scrollTo(0, scrollY)
	}

	function removeAuthParamsFromCurrentUrl() {
		const url = new URL(window.location.href)
		for (const parameter of ['show_auth', 'login', 'signup', 'forgot-password']) {
			url.searchParams.delete(parameter)
		}
		history.replaceState(history.state, '', url)
	}

	function handleBrowserBack() {
		if (!show || !ownsHistoryEntry) return
		ownsHistoryEntry = false
		show = false
		removeAuthParamsFromCurrentUrl()
	}

	const checkStateAndAct = () => {
		const urlParams = new URLSearchParams(window?.location?.search)
		if (urlParams) {
			const signup = urlParams.has('signup')
			const login = urlParams.has('login')
			const forgotPassword = urlParams.has('forgot-password')

			if (signup) type = 'signup'
			if (login) type = 'login'
			if (forgotPassword) type = 'forgot-password'

			if (urlParams.get('show_auth') === 'true') show = true
			if (urlParams.get('show_auth') === 'false') show = false
		}
	}

	onMount(() => {
		showModal.subscribe((val) => {
			if (val) {
				show = val
				checkStateAndAct()
			}
		})
	})

	onMount(() => {
		checkStateAndAct()
	})

	onMount(() => {
		window.addEventListener('popstate', handleBrowserBack)
		return () => window.removeEventListener('popstate', handleBrowserBack)
	})

	$effect(() => {
		if (typeof window === 'undefined') return

		if (show && !ownsHistoryEntry) {
			history.pushState({ ...history.state, [modalHistoryKey]: true }, '', window.location.href)
			ownsHistoryEntry = true
		} else if (!show && ownsHistoryEntry) {
			const isCurrentModalEntry = history.state?.[modalHistoryKey] === true
			ownsHistoryEntry = false
			if (isCurrentModalEntry) history.back()
		}
	})

	$effect(() => {
		if (show) lockPageScroll()
		else unlockPageScroll()
	})

	onDestroy(() => {
		unlockPageScroll()
		if (typeof window !== 'undefined' && ownsHistoryEntry && history.state?.[modalHistoryKey] === true) {
			history.back()
		}
	})

	onNavigate(() => {
		checkStateAndAct()
	})
</script>

<main>
	{#if type === 'signup'}
		<SignupModal bind:show manageHistory={false} />
	{:else if type === 'login'}
		<LoginModal bind:show manageHistory={false} />
	{:else if type === 'forgot-password'}
		<ForgotPasswordModal bind:show manageHistory={false} />
	{/if}
</main>
