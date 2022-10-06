<script>
import { onMount } from 'svelte'
import Konva from 'konva'

let container
let json = `{"attrs":{"width":400,"height":400},"className":"Stage","children":[{"attrs":{},"className":"Layer","children":[{"attrs":{"x":71.020453858611,"y":60.88098560536032,"width":100,"height":90,"fill":"red","name":"rect","stroke":"black","draggable":true,"scaleX":1.8809856053602876,"scaleY":1.8809856053602882},"className":"Rect"},{"attrs":{"x":260,"y":160,"width":100,"height":90,"fill":"blue","name":"rect","stroke":"green","draggable":true},"className":"Rect"},{"attrs":{"x":5,"y":5,"fill":"black","text":"x: 71.020453858611\ny: 60.88098560536032\nrotation: 0\nwidth: 100\nheight: 90\nscaleX: 1.8809856053602876\nscaleY: 1.8809856053602882"},"className":"Text"},{"attrs":{},"className":"Transformer"},{"attrs":{},"className":"Transformer"}]}]}`
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
		json = stage.toJSON()
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
function toJSON() {
	console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', json)
}
</script>

<div bind:this="{container}"></div>
<button on:click="{toJSON}">export</button>
<br />
<br />
<br />
<code class="code">
	{json}
</code>
