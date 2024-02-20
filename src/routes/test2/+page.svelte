<script>
import { onMount } from 'svelte'
import { services } from 'npm-swadesh'
onMount(async () => {
	console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz')
	try {
		console.log('test2/+page')
		// const api = services.setApiEndpoint('http://localhost:3000/api/v1/')
		// console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', api)
		// const x = await services.ProductService.fetchProducts({ storeId: '6356502aca4ff28ed596cb1b' })
		console.log('xxxxxxxxxxxxxxxxxxxxx', x)
	} catch (e) {
		console.log('eeeeeeeeeeeeeeeeeeee')
		console.log(e)
	}
	console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz')
})
</script>
