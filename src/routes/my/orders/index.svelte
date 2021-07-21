<script lang="ts">
import { onMount } from 'svelte'
import { get } from '../../../util/api'
let orders
onMount(() => {
	getOrders()
})
async function getOrders() {
	orders = await get(`orders/my`)
}
</script>

<h1>My orders</h1>
{#if orders?.data?.length}
	{#each orders?.data as o}
		{o?.orderNo}
		{o?.status}
	{/each}
{/if}
