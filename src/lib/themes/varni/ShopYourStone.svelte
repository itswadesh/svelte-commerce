<script>
import asscherDiamond from '$lib/assets/stones/asscher-diamond.png'
import cushionDiamond from '$lib/assets/stones/cushion-diamond.png'
import emeraldDiamond from '$lib/assets/stones/emerald-diamond.png'
import heartDiamond from '$lib/assets/stones/heart-diamond.png'
import marquiseDiamond from '$lib/assets/stones/marquise-diamond.png'
import ovalDiamond from '$lib/assets/stones/oval-diamond.png'
import pearDiamond from '$lib/assets/stones/pear-diamond.png'
import princessDiamond from '$lib/assets/stones/princess-diamond.png'
import radiantDiamond from '$lib/assets/stones/radiant-diamond.png'
import roundDiamond from '$lib/assets/stones/round-diamond.png'

let stones = [
	{
		img: roundDiamond,
		title: 'Round'
	},
	{
		img: princessDiamond,
		title: 'Princess'
	},
	{
		img: emeraldDiamond,
		title: 'Emerald'
	},
	{
		img: pearDiamond,
		title: 'Pear'
	},
	{
		img: radiantDiamond,
		title: 'Radiant'
	},
	{
		img: marquiseDiamond,
		title: 'Marquise'
	},
	{
		img: cushionDiamond,
		title: 'Cushion'
	},
	{
		img: heartDiamond,
		title: 'Heart'
	},
	{
		img: ovalDiamond,
		title: 'Oval'
	},
	{
		img: asscherDiamond,
		title: 'Asscher'
	}
]
</script>

{#if stones?.length}
	<div class="px-3 py-10 xl:px-10">
		<div class="container mx-auto max-w-6xl">
			<h2
				class="mb-5 sm:mb-10 uppercase text-primary-500 flex items-center gap-4 font-bold text-xl">
				<hr class="flex-1" />

				<span>Shop Your Stone</span>

				<hr class="flex-1" />
			</h2>

			<ul class="m-0 p-0 list-none flex flex-wrap items-center gap-4 justify-center">
				{#each stones as stone}
					<li class="flex flex-col gap-0.5 items-center justify-center text-center w-24">
						<img src="{stone.img}" alt=" " class="h-24 w-auto object-contain object-bottom" />

						<span>
							{stone.title}
						</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}
