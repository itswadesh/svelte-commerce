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
import { navigateToProperPath, toast } from '$lib/utils'
import { onMount } from 'svelte'
import { page } from '$app/stores'

export let height = 40

let megamenu = $page.data.megamenu || []

onMount(() => {
	getMegaMenu()
})

async function getMegaMenu() {
	if (browser && $page.data.isDesktop) {
		try {
			// megamenu = await getMegamenuFromStore({
			// 	sid: null,
			// 	storeId: $page?.data?.storeId,
			// 	isCors: $page?.data?.store?.isCors,
			// 	origin: $page.data.origin
			// })

			const localMegamenu = localStorage.getItem('megamenu')

			if (!!localMegamenu && localMegamenu !== 'undefined') {
				megamenu = JSON.parse(localMegamenu)
			} else {
				megamenu = await CategoryService.fetchMegamenuData({
					storeId: $page?.data?.storeId,
					origin: $page.data.origin
				})
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
				href="{navigateToProperPath(m1.link || m1.slug)}?sort=-updatedAt"
				class="block uppercase link-underline link-underline-gray">
				<span>
					{m1.name}
				</span>
			</a>
		</li>
	{/each}
</ul>
