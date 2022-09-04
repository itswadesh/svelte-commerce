<script lang="ts">
import './../app.css'
import './../fonts.css'
import { ToastContainer, FlatToast } from 'svelte-toasts'
import PreloadingIndicator from '$lib/PreloadingIndicator.svelte'
import BackToTop from '$lib/components/BackToTop.svelte'
import PageTransitions from '$lib/PageTransitions.svelte'
import GoogleAnalytics from '$lib/components/GoogleAnalytics.svelte'
import { navigating } from '$app/stores'
</script>

{#if $navigating}
	<PreloadingIndicator />
{/if}

<section class="minimum-width relative flex min-h-screen flex-col bg-white antialiased">
	<div class="h-rem w-full flex-1">
		<slot />
	</div>
</section>

<GoogleAnalytics />

<BackToTop />

<ToastContainer let:data>
	<FlatToast data="{data}" />
</ToastContainer>
