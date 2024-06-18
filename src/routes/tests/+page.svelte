<style>
/* Add your styles here if needed */
</style>

<!-- <script>
import * as SC from 'svelte-cubed'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { onMount } from 'svelte'
import { modelURLS } from './stores'
import ReusableGLTF from './ReusableGLTF.svelte'
// …
</script>

<SC.Canvas>
	<SC.PerspectiveCamera position="{[50, 50, 105]}" />
	<SC.AmbientLight color="{0xffffff}" intensity="{0.5}" />
	<SC.DirectionalLight color="{0xffffff}" intensity="{1.3}" position="{[0, 0, 10]}" />
	<SC.OrbitControls enableZoom={true} /> -->
<!-- … all the scene stuff is here, including your models -->
<!-- <ReusableGLTF
		modelURL="{modelURLS['littleCity']}"
		name="littleCity"
		scale="{[0.05, 0.05, 0.05]}" />
</SC.Canvas> -->

<!-- src/App.svelte -->
<script lang="ts">
import { onMount } from 'svelte'
import { loadGumletScript } from 'lib/components/Image/gumlet';

onMount(() => {
	loadGumletScript().catch((error) => console.error(error))
})
</script>

<div class="App">
	<img
		data-src="
https://misiki.gumlet.io/litekart.in/images/product/women/3f97c35bd3c7d398e910e047bb2415da-44059846679.JPEG"
		alt="misiki girl"
		style="width: 250px;" />
	<!-- <img data-src="https://demo.gumlet.io/logo.png" style="width: 250px;" /> -->
	<!-- <img data-src="https://demo.gumlet.io/logo.png" style="width: 500px;" /> -->
</div>
