<script>
import { onMount } from 'svelte'
import Konva from 'konva'

let container
let json =
	'{"attrs":{"width":400,"height":400},"className":"Stage","children":[{"attrs":{},"className":"Layer","children":[{"attrs":{"x":71.020453858611,"y":60.88098560536032,"width":100,"height":90,"fill":"red","name":"rect","stroke":"black","draggable":true,"scaleX":1.8809856053602876,"scaleY":1.8809856053602882},"className":"Rect"},{"attrs":{"x":260,"y":160,"width":100,"height":90,"fill":"blue","name":"rect","stroke":"green","draggable":true},"className":"Rect"},{"attrs":{"x":5,"y":5,"fill":"black","text":"x: 71.020453858611\ny: 60.88098560536032\nrotation: 0\nwidth: 100\nheight: 90\nscaleX: 1.8809856053602876\nscaleY: 1.8809856053602882"},"className":"Text"},{"attrs":{},"className":"Transformer"},{"attrs":{},"className":"Transformer"}]}]}'
// var json =
// 	'{"attrs":{"width":578,"height":200},"className":"Stage","children":[{"attrs":{},"className":"Layer","children":[{"attrs":{"width":"auto","height":"auto","text":"Text Shadow!","fontFamily":"Calibri","fontSize":95,"x":20,"y":20,"stroke":"red","strokeWidth":2,"shadowColor":"black","shadowBlur":2,"shadowOffsetX":10,"shadowOffsetY":10,"shadowOpacity":0.5},"className":"Text"},{"attrs":{"stroke":"green","strokeWidth":10,"lineJoin":"round","lineCap":"round","points":[{"x":50,"y":140},{"x":450,"y":160}],"shadowColor":"black","shadowBlur":10,"shadowOffsetX":5,"shadowOffsetY":5,"shadowOpacity":0.5},"className":"Line"},{"attrs":{"x":280,"y":100,"width":100,"height":50,"fill":"#00D2FF","stroke":"black","strokeWidth":4,"shadowColor":"black","shadowBlur":10,"shadowOffsetX":5,"shadowOffsetY":5,"shadowOpacity":0.5,"rotation":0.35038503988659,"id":"blueRectangle"},"className":"Rect"},{"attrs":{"x":100,"y":41,"width":106,"height":118,"id":"yodaImage"},"className":"Image"}]}]}'
onMount(() => {
	var stage = Konva.Node.create(json, 'container')

	/*
	 * set functions
	 */
	// stage.findOne('#blueRectangle').on('mouseover mouseout', function () {
	// 	var stroke = this.stroke()
	// 	this.stroke(stroke === 'black' ? 'red' : 'black')
	// })
	// /*
	//  * set images
	//  */
	// var imageObj = new Image()
	// imageObj.onload = function () {
	// 	stage.findOne('#yodaImage').image(imageObj)
	// }
	// imageObj.src = '/icon.png'
})
</script>

<div bind:this="{container}" id="container"></div>
<!-- <button on:click="{toJSON}">export</button> -->
<br />
<br />
<br />
<code class="code">
	{json}
</code>
