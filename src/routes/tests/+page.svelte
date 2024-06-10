<script>
// import { fetchGiftCard } from '$lib/services/medusa/gift-services'
import { fetchMeData } from '$lib/services/medusa/user-service'
import { onMount } from 'svelte'

let photos = []

onMount(async () => {
	const res = await fetchMeData()
	console.log(res)
})
</script>

<!-- s%3A4l5Hg7aRQK67QqJMbrNk1GjHIqVLNWYQ.lvnlR44IaNzjH2L6phGe60u2ScPPArEJh%2FnPVNZ0QpA -->
