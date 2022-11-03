<script lang="ts">
import Nav from '$lib/Nav.svelte'
import Footer from '$lib/Footer.svelte'
import PageTransitions from '$lib/PageTransitions.svelte'
import { page } from '$app/stores'
export let data
let showCartSidebar = false
let openSidebar = false
</script>

<div class="{showCartSidebar || openSidebar ? 'h-screen overflow-hidden' : 'h-full'}">
	<Nav me="{data.me}" cart="{data.cart}" bind:showCartSidebar bind:openSidebar />

	<PageTransitions url="{data.url}">
		<div class="mt-14 sm:mt-20 w-full flex-1">
			{#if $page.data.store?.closed}
				{$page.data.store?.closeMessage || 'We are closed for the day'}
			{:else}
				<slot />
			{/if}
		</div>
	</PageTransitions>

	<div class="hidden sm:block">
		<Footer me="{data.me}" />
	</div>
</div>
