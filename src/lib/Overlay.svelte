<style>
.spinner {
	transition: opacity 0.15s ease;
	animation: rotator 1.4s linear infinite;
	animation-play-state: paused;
}
.spinner.show {
	animation-play-state: running;
}
.spinner.v-enter,
.spinner.v-leave-active {
	opacity: 0;
}
.spinner.v-enter-active,
.spinner.v-leave {
	opacity: 1;
}
.spinner .path {
	stroke: #f60;
	stroke-dasharray: 126;
	stroke-dashoffset: 0;
	transform-origin: center;
	animation: dash 1.4s ease-in-out infinite;
}
@-moz-keyframes rotator {
	0% {
		transform: scale(0.5) rotate(0deg);
	}
	100% {
		transform: scale(0.5) rotate(270deg);
	}
}
@-webkit-keyframes rotator {
	0% {
		transform: scale(0.5) rotate(0deg);
	}
	100% {
		transform: scale(0.5) rotate(270deg);
	}
}
@-o-keyframes rotator {
	0% {
		transform: scale(0.5) rotate(0deg);
	}
	100% {
		transform: scale(0.5) rotate(270deg);
	}
}
@keyframes rotator {
	0% {
		transform: scale(0.5) rotate(0deg);
	}
	100% {
		transform: scale(0.5) rotate(270deg);
	}
}
@-moz-keyframes dash {
	0% {
		stroke-dashoffset: 126;
	}
	50% {
		stroke-dashoffset: 63;
		transform: rotate(135deg);
	}
	100% {
		stroke-dashoffset: 126;
		transform: rotate(450deg);
	}
}
@-webkit-keyframes dash {
	0% {
		stroke-dashoffset: 126;
	}
	50% {
		stroke-dashoffset: 63;
		transform: rotate(135deg);
	}
	100% {
		stroke-dashoffset: 126;
		transform: rotate(450deg);
	}
}
@-o-keyframes dash {
	0% {
		stroke-dashoffset: 126;
	}
	50% {
		stroke-dashoffset: 63;
		transform: rotate(135deg);
	}
	100% {
		stroke-dashoffset: 126;
		transform: rotate(450deg);
	}
}
@keyframes dash {
	0% {
		stroke-dashoffset: 126;
	}
	50% {
		stroke-dashoffset: 63;
		transform: rotate(135deg);
	}
	100% {
		stroke-dashoffset: 126;
		transform: rotate(450deg);
	}
}
.loading-page {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(255, 255, 255, 0.8);
	text-align: center;
	padding-top: 200px;
	font-size: 30px;
	font-family: sans-serif;
}
</style>

<script>
export let closed = false
</script>

{#if closed}
	<div class="loading-page">
		<b>Sorry we are closed now.</b>
	</div>
{/if}
