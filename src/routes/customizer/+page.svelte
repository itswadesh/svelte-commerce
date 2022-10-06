<script>
import { onMount } from 'svelte'
import Konva from 'konva'

let container
onMount(() => {
	const stage = new Konva.Stage({
		container: container,
		width: 400,
		height: 400
	})
	const layer = new Konva.Layer()
	const simpleText = new Konva.Text({
		x: stage.width() / 2,
		y: 15,
		text: 'Hello Konva',
		fontSize: 30,
		fontFamily: 'Calibri',
		fill: 'green'
	})
	layer.add(simpleText)
	stage.add(layer)
})
</script>

<div bind:this="{container}"></div>
