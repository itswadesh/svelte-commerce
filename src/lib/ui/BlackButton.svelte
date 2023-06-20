<style>
.bg-center-to-corner {
	display: inline-block;
	padding: 4px 4px;
	border-radius: 4px;
	color: #424242;
	font-size: 30px;
	background-image: linear-gradient(#424242, #424242);
	background-position: 50% 50%;
	background-repeat: no-repeat;
	background-size: 0% 0%;
	transition: background-size 0.5s, color 0.5s;
}

.bg-center-to-corner:hover {
	background-size: 100% 100%;
	color: #ffffff;
}

.bg-center-to-corner-reverse-color {
	display: inline-block;
	padding: 4px 4px;
	border-radius: 4px;
	color: #ffffff;
	font-size: 30px;
	background-image: linear-gradient(#ffffff, #ffffff);
	background-position: 50% 50%;
	background-repeat: no-repeat;
	background-size: 0% 0%;
	transition: background-size 0.5s, color 0.5s;
}

.bg-center-to-corner-reverse-color:hover {
	background-size: 100% 100%;
	color: #000000;
}
</style>

<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let reverseColor = false,
	type = 'button',
	title = ''

let clazz = ''
export { clazz as class }
</script>

<button
	type="{type}"
	title="{title}"
	class="{clazz} focus:outline-none
	{reverseColor ? 'bg-center-to-corner-reverse-color' : 'bg-center-to-corner'}"
	on:click="{() => dispatch('click')}">
	<slot />
</button>
