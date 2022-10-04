<style>
.minimum-width-rem {
	min-width: 360px;
}
</style>

<script lang="ts">
import './../app.css'
import { ToastContainer, FlatToast } from 'svelte-toasts'
import PreloadingIndicator from '$lib/PreloadingIndicator.svelte'
import BackToTop from '$lib/components/BackToTop.svelte'
import PageTransitions from '$lib/PageTransitions.svelte'
import GoogleAnalytics from '$lib/components/GoogleAnalytics.svelte'
import { navigating } from '$app/stores'
</script>

<GoogleAnalytics />

{#if $navigating}
	<PreloadingIndicator />
{/if}

<section class="minimum-width-rem relative flex min-h-screen flex-col bg-white antialiased">
	<div class="h-rem w-full flex-1">
		<slot />
	</div>
</section>

<!-- <PartytownSnippet /> -->

<BackToTop />

<ToastContainer let:data>
	<FlatToast data="{data}" />
</ToastContainer>
