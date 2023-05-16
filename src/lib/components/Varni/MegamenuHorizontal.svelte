<style>
.link-underline {
	border-bottom-width: 0;
	background-image: linear-gradient(transparent, transparent),
		linear-gradient(rgb(249 250 251), rgb(249 250 251));
	background-size: 0 1px;
	background-position: 0 100%;
	background-repeat: no-repeat;
	transition: background-size 0.5s ease-in-out;
}

.link-underline-gray {
	background-image: linear-gradient(transparent, transparent),
		linear-gradient(rgb(107 114 128), rgb(107 114 128));
}

.link-underline:hover {
	background-size: 100% 1px;
	background-position: 0 100%;
}
</style>

<script>
import { browser } from '$app/environment'
import { CategoryService } from '$lib/services'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { toast } from '$lib/utils'

export let height = 40

let megamenu = $page.data.megamenu || []

onMount(() => {
	getMegaMenu()
})

async function getMegaMenu() {
	if (browser && $page.data.isDesktop) {
		try {
			const localMegamenu = localStorage.getItem('megamenu')

			if (!!localMegamenu && localMegamenu !== 'undefined') {
				megamenu = JSON.parse(localMegamenu)
				// console.log('localMegamenu', megamenu)
			} else {
				megamenu = await CategoryService.fetchMegamenuData({
					storeId: $page?.data?.store?.id,
					origin: $page.data.origin
				})
				// console.log('megamenu', megamenu)
			}
		} catch (e) {
			toast(e, 'error')
		} finally {
		}
	} else {
	}
}
</script>

<ul class="flex items-center gap-4">
	{#each megamenu as m1, index1}
		<li>
			<a
				href="/{m1.link || m1.slug}?sort=-updatedAt"
				class="block uppercase link-underline link-underline-gray">
				<span>
					{m1.name}
				</span>
			</a>
		</li>
	{/each}
</ul>
