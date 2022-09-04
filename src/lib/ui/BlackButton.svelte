<style>
.bg-center-to-corner {
	display: inline-block;
	padding: 4px 4px;
	border-radius: 4px;
	color: #424242;
	font-size: 30px;
	font-family: arial;
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
</style>

<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let type = 'button',
	title = 'Click here'

let clazz

export { clazz as class }
</script>

<button
	type="{type}"
	title="{title}"
	class="bg-center-to-corner focus:outline-none {clazz}"
	on:click="{() => dispatch('click')}">
	<slot />
</button>
