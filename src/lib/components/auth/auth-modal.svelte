<script lang="ts">
	import { onMount } from 'svelte'
	import LoginModal from './login-modal.svelte'
	import SignupModal from './signup-modal.svelte'
	import { onNavigate } from '$app/navigation'
	import { showModal, type AuthType } from '$lib/core/components/index.js'
	import ForgotPasswordModal from './forgot-password-modal.svelte'

	let { show = $bindable() } = $props()

	let type: AuthType = $state('login')

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
