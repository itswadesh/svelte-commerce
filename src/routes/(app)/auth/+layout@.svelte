<style>
.frosted {
	backdrop-filter: blur(12px);
	background-color: hsla(0, 0%, 0%, 0.5);
}
</style>

<script lang="ts">
import PageTransitions from '$lib/PageTransitions.svelte'
import { ToastContainer, FlatToast } from 'svelte-toasts'
import GoogleAnalytics from '$lib/components/GoogleAnalytics.svelte'
import { navigating, page } from '$app/stores'
import PreloadingIndicator from '$lib/PreloadingIndicator.svelte'
let url
</script>

<section class="minimum-width bg-white font-sans antialiased">
	<!-- Page transition commented because it was not removing the layout from the login page after navigating to my/index page -->
	<PageTransitions url="{$page?.url}">
		<div class="minimum-width relative bg-white font-sans antialiased">
			{#if $navigating}
				<PreloadingIndicator />
			{/if}

			<div class="{$navigating ? 'h-screen' : ''}">
				<section
					class="fixed inset-0 h-screen w-full bg-gradient-to-br from-secondary-100 to-primary-100">
					<div
						class="flex h-full w-full items-center justify-center overflow-y-auto p-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-400 sm:p-10 md:p-20">
						<slot />
					</div>
				</section>
			</div>
		</div>
	</PageTransitions>
</section>

<ToastContainer let:data>
	<FlatToast data="{data}" />
</ToastContainer>

<GoogleAnalytics />
