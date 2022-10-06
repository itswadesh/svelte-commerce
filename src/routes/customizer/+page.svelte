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
	var rect = new Konva.Rect({
		x: 160,
		y: 60,
		width: 100,
		height: 90,
		fill: 'red',
		name: 'rect',
		stroke: 'black',
		draggable: true
	})
	layer.add(rect)

	var rect1 = new Konva.Rect({
		x: 260,
		y: 160,
		width: 100,
		height: 90,
		fill: 'blue',
		name: 'rect',
		stroke: 'green',
		draggable: true
	})
	layer.add(rect1)

	var text = new Konva.Text({
		x: 5,
		y: 5
	})
	layer.add(text)
	updateText()

	// create new transformer
	var tr = new Konva.Transformer()
	var tr1 = new Konva.Transformer()
	layer.add(tr)
	layer.add(tr1)
	tr.nodes([rect])
	tr1.nodes([rect1])

	rect.on('transformstart', function () {
		console.log('transform start')
	})

	rect.on('dragmove', function () {
		updateText()
	})
	rect.on('transform', function () {
		updateText()
		console.log('transform')
	})

	rect.on('transformend', function () {
		console.log('transform end')
	})

	function updateText() {
		var lines = [
			'x: ' + rect.x(),
			'y: ' + rect.y(),
			'rotation: ' + rect.rotation(),
			'width: ' + rect.width(),
			'height: ' + rect.height(),
			'scaleX: ' + rect.scaleX(),
			'scaleY: ' + rect.scaleY()
		]
		text.text(lines.join('\n'))
	}

	stage.add(layer)
})
</script>

<div bind:this="{container}"></div>
