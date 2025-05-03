<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'

	let isMounted = $state(false)
	let whatsappChatButton = $state({})

	onMount(() => {
		isMounted = true
	})

	function openWhatsApp() {
		const message = encodeURIComponent('Hi!')
		const whatsappUrl = `https://wa.me/${page?.data?.store?.plugins?.whatsappChatButton?.phone}?text=${message}`
		window.open(whatsappUrl, '_blank')
	}
</script>

{#if isMounted && page?.data?.store?.plugins?.whatsappChatButton?.active && page?.data?.store?.plugins?.whatsappChatButton?.phone}
	<button
		onclick={openWhatsApp}
		class="fixed bottom-4 left-4 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:shadow-xl md:flex"
		aria-label="Chat on WhatsApp"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fff" viewBox="0 0 256 256"
			><path
				d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"
			></path></svg
		>
	</button>
{/if}

<style>
	button {
		animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}

	@keyframes bounce-in {
		0% {
			opacity: 0;
			transform: scale(0.3);
		}
		50% {
			opacity: 0.9;
			transform: scale(1.1);
		}
		80% {
			opacity: 1;
			transform: scale(0.89);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
