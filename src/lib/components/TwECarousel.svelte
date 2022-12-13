<script>
import { browser } from '$app/environment'
import { onMount } from 'svelte'

// import 'tw-elements'
import { v4 as uuidv4 } from 'uuid'

const r = uuidv4()

onMount(async () => {
	if (browser) await import('tw-elements/dist/src/js/index.js')
})
</script>

<div id="twCarousel{r}" class="slide carousel relative" data-bs-ride="carousel">
	<div class="carousel-inner relative w-full overflow-hidden">
		<slot />
	</div>

	<button
		class="carousel-control-prev absolute top-0 bottom-0 left-0 flex items-center justify-center border-0 p-0 text-center focus:no-underline focus:outline-none hover:no-underline hover:outline-none"
		type="button"
		data-bs-target="#twCarousel{r}"
		data-bs-slide="prev">
		<span class="carousel-control-prev-icon inline-block bg-no-repeat" aria-hidden="true"></span>

		<span class="visually-hidden">Previous</span>
	</button>

	<button
		class="carousel-control-next absolute top-0 bottom-0 right-0 flex items-center justify-center border-0 p-0 text-center focus:no-underline focus:outline-none hover:no-underline hover:outline-none"
		type="button"
		data-bs-target="#twCarousel{r}"
		data-bs-slide="next">
		<span class="carousel-control-next-icon inline-block bg-no-repeat" aria-hidden="true"></span>

		<span class="visually-hidden">Next</span>
	</button>
</div>
