<script lang="ts">
import { onMount } from 'svelte'
import { get } from '../../../util/api'
import SEO from '$lib/components/SEO/index.svelte'

const seoProps = {
	title: 'Orders',
	metadescription: 'All orders details',
}
let orders
onMount(() => {
	getOrders()
})
async function getOrders() {
	orders = await get(`orders/my`)
}
</script>

<SEO {...seoProps} />

<h1>My orders</h1>
{#if orders?.data?.length}
	{#each orders?.data as o}
		{o?.orderNo}
		{o?.status}
	{/each}
{/if}
