<style>
.minimum-width-rem {
	min-width: 360px;
}
</style>

<script lang="ts">
import PageTransitions from '$lib/PageTransitions.svelte'
import { ToastContainer, FlatToast } from 'svelte-toasts'
import { navigating, page } from '$app/stores'
import PreloadingIndicator from '$lib/PreloadingIndicator.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
let url
</script>

<section class="minimum-width-rem bg-white font-sans antialiased">
	<!-- Page transition commented because it was not removing the layout from the login page after navigating to my/index page -->
	<PageTransitions url="{$page?.url}">
		<div class="relative bg-white font-sans antialiased">
			{#if $navigating}
				<PreloadingIndicator />
			{/if}

			<div class="{$navigating ? 'h-screen' : ''}">
				<section class="fixed inset-0 h-screen w-full bg-gradient-to-b from-primary-50">
					<a href="/" class="relative z-10 flex h-20 items-center justify-center border-b bg-white">
						<LazyImg src="/logo.svg" alt=" " class="h-auto w-32 object-contain object-center" />
					</a>

					<div
						class="mx-auto h-[91.5vh] overflow-y-auto p-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-400 sm:p-10 md:p-20">
						<slot />
					</div>
				</section>
			</div>
		</div>
	</PageTransitions>
</section>
