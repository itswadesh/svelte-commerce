<script>
import { Nav } from '$lib/theme-config'
import { page } from '$app/stores'
import { PageTransitions, Footer } from '$lib/components'

export let data
</script>

<div class="h-rem w-full flex-1">
	<Nav me="{$page.data.me}" cart="{$page.data.cart}" />

	<PageTransitions url="{data.url}">
		<slot />
	</PageTransitions>
</div>

<div class="hidden lg:block">
	<Footer me="{$page.data.me}" cart="{$page.data.cart}" />
</div>
