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

	onDestroy(() => {
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
		<SignupModal bind:show />
	{:else if type === 'login'}
		<LoginModal bind:show />
	{:else if type === 'forgot-password'}
		<ForgotPasswordModal bind:show />
	{/if}
</main>
