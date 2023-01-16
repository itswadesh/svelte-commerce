<script>
import { Splide, SplideSlide } from '@splidejs/svelte-splide'
import '@splidejs/svelte-splide/css'
export let options = { type: 'loop', lazyLoad: true }
</script>

<Splide aria-label="Images" options="{options}">
	<slot />
</Splide>
