<script>
import { onMount } from 'svelte'
import Cookie from 'cookie-universal'

const cookies = Cookie()

onMount(async () => {
	const response = await fetch('/server/store')

	const res = await response.json()

	const { storeOne } = res

	cookies.set('storeId', storeOne?._id, { path: '/' })
})
</script>
