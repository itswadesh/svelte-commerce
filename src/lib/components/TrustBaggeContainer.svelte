<script>
import cartBadgeTrust from '$lib/assets/cart/cart-badge-trust.svg'
import cartEasyReturn from '$lib/assets/cart/cart-easy-return.svg'
import qualityCheck from '$lib/assets/cart/quality-check.svg'

let clazz = ''
export { clazz as class }

let trustBaggeContainerItems = [
	{
		icon: cartBadgeTrust,
		title: '100% secure payments'
	},
	{
		icon: cartEasyReturn,
		title: `Easy return & quick refunds`
	},
	{
		icon: qualityCheck,
		title: 'Quality assurance'
	}
]
</script>

<div class="{clazz} bg-zinc-100 flex items-start justify-between gap-3 p-5 rounded">
	{#each trustBaggeContainerItems as item}
		<div class="max-w-max">
			<div
				class="flex flex-col items-center justify-center gap-2 text-center text-[0.5em] text-zinc-500 uppercase whitespace-nowrap">
				<img
					src="{item.icon}"
					alt="cart badge trust"
					class="h-8 w-8 object-contain object-bottom" />

				<span>{item.title}</span>
			</div>
		</div>
	{/each}
</div>
