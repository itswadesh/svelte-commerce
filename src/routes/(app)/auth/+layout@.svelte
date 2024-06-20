<style>
.minimum-width-rem {
	min-width: 360px;
}
.frosted {
	backdrop-filter: blur(15px);
	background-color: hsla(0, 0%, 0%, 0.5);
}
</style>

<script lang="ts">
import { navigating, page } from '$app/stores'
import { scale } from 'svelte/transition'
import { PageTransitions } from '$lib/components'
import PreloadingIndicator from '$lib/PreloadingIndicator.svelte'

export let data

let customfont = data.store?.fontFamily || ''
</script>

<section
	class="minimum-width-rem bg-white font-sans antialiased"
	style="font-family: {customfont};">
	<!-- Page transition commented because it was not removing the layout from the login page after navigating to my/index page -->

	<PageTransitions url="{$page.data?.url}">
		<div class="relative">
			{#if $navigating}
				<PreloadingIndicator />
			{/if}

			<div class="{$navigating ? 'h-screen' : 'h-full min-h-screen'} bg-primary-500">
				<div
					in:scale="{{ duration: 150 }}"
					class="frosted mx-auto flex h-full min-h-screen items-center justify-center overflow-y-auto p-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-400 sm:p-10 md:p-20">
					<!-- {#key data.url} -->
						<slot />
					<!-- {/key} -->
				</div>
			</div>
		</div>
	</PageTransitions>
</section>
