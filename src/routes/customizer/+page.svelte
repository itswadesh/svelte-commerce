<script>
import { onMount } from 'svelte'
import Konva from 'konva'

let container
let json
onMount(() => {
	json = localStorage.getItem('canvas')
	// const stage = new Konva.Stage({
	// 	container: container,
	// 	width: 400,
	// 	height: 400
	// })
	var stage = Konva.Node.create(json, 'container')

	const layer = new Konva.Layer()
	// var rect = new Konva.Rect({
	// 	x: 160,
	// 	y: 60,
	// 	width: 100,
	// 	height: 90,
	// 	fill: 'red',
	// 	name: 'rect',
	// 	stroke: 'black',
	// 	draggable: true
	// })
	// layer.add(rect)

	// var rect1 = new Konva.Rect({
	// 	x: 260,
	// 	y: 160,
	// 	width: 100,
	// 	height: 90,
	// 	fill: 'blue',
	// 	name: 'rect',
	// 	stroke: 'green',
	// 	draggable: true
	// })
	// layer.add(rect1)

	// updateText()

	// create new transformer
	var tr = new Konva.Transformer()
	var tr1 = new Konva.Transformer()
	layer.add(tr)
	layer.add(tr1)
	// tr.nodes([rect])
	// tr1.nodes([rect1])

	// rect.on('transformstart', function () {
	// 	console.log('transform start')
	// })

	// rect.on('transformend', function () {
	// 	console.log('transform end')
	// 	json = stage.toJSON()
	// 	localStorage.setItem('canvas', json)
	// })

	// function updateText() {
	// 	var lines = [
	// 		'x: ' + rect.x(),
	// 		'y: ' + rect.y(),
	// 		'rotation: ' + rect.rotation(),
	// 		'width: ' + rect.width(),
	// 		'height: ' + rect.height(),
	// 		'scaleX: ' + rect.scaleX(),
	// 		'scaleY: ' + rect.scaleY()
	// 	]
	// 	text.text(lines.join('\n'))
	// }

	stage.add(layer)
})
function toJSON() {
	console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', json)
}
</script>

<div bind:this="{container}" id="container"></div>
<button on:click="{toJSON}">export</button>
<br />
<br />
<br />
<code class="code">
	{json}
</code>
