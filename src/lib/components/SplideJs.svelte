<script>
import '@splidejs/svelte-splide/css'
import { Splide, SplideSlide } from '@splidejs/svelte-splide'

export let currentImageIndex = 0
export let options = { type: 'loop', lazyLoad: true }
</script>

<Splide
	aria-label="Images"
	options="{options}"
	on:move="{(e) => (currentImageIndex = e.detail.index)}">
	<slot />
</Splide>
