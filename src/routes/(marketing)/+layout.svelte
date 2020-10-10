<script>
import Footer from '$lib/Footer.svelte'
import Nav from '$lib/Nav.svelte'
import { page } from '$app/stores'
</script>

<div class="h-rem w-full flex-1">
	<Nav me="{$page.data.me}" cart="{$page.data.cart}" />

	<div class="mt-14 w-full flex-1 sm:mt-20">
		<slot />
	</div>
</div>

<div class="hidden sm:block">
	<Footer me="{$page.data.me}" cart="{$page.data.cart}" />
</div>
