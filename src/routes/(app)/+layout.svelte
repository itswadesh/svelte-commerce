<script lang="ts">
import Nav from '$lib/Nav.svelte'
import Footer from '$lib/Footer.svelte'
import PageTransitions from '$lib/PageTransitions.svelte'
export let data
</script>

<Nav me="{data.me}" cart="{data.cart}" store="{data.store}" q="{data.q}" />

<PageTransitions url="{data.url}">
	<div class="h-rem mt-20 w-full flex-1">
		<slot />
	</div>
</PageTransitions>

<div class="hidden sm:block">
	<Footer me="{data.me}" cart="{data.cart}" />
</div>
