<script>
	import { Instagram } from 'lucide-svelte'
	import ImagesCarousel from '../images-carousel.svelte'
	let { gallery = [] } = $props()
</script>

<section class="flex flex-col items-center bg-gray-100 py-8">
	<div class="container mx-auto flex flex-col items-center justify-center px-4">
		<div class="mb-4 flex items-center justify-center">
			<Instagram class="mr-2 h-6 w-6 text-gray-600" />
			<h2 class="text-center text-[20px] font-bold uppercase tracking-wide text-gray-800">#LITEKART ON INSTAGRAM</h2>
		</div>
		<p class="text-center text-[12px] text-gray-600">Phasellus lorem malesuada ligula pulvinar commodo maecenas</p>
	</div>
	<ImagesCarousel data={gallery} />
	<a href="/products" class="mx-auto inline-block">
		<button
			class="w-[180px] border border-black bg-black px-[15px] py-[10px] text-[14px] font-semibold uppercase text-white transition-colors duration-300 hover:bg-white hover:text-black"
		>
			VIEW GALLERY
		</button>
	</a>
</section>
