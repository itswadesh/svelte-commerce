<script>
import { Nav, Footer } from '$lib/components'
import { page } from '$app/stores'
import { slotMarginGeneral, slotMarginGeneralWithHelloBar } from '$lib/config'

let hellobar = $page.data.store?.hellobar || {}
</script>

<div class="h-rem w-full flex-1">
	<Nav me="{$page.data.me}" cart="{$page.data.cart}" />

	<div
		class="{hellobar?.active?.val
			? slotMarginGeneralWithHelloBar
			: slotMarginGeneral} w-full flex-1">
		<slot />
	</div>
</div>

<div class="hidden lg:block">
	<Footer me="{$page.data.me}" cart="{$page.data.cart}" />
</div>
