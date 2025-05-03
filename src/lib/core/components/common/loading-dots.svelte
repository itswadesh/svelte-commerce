<!-- LoadingDots.svelte -->
<script>
	let visible = true
</script>

<span class="loading-dots" class:visible>
	<span class="dot"></span>
	<span class="dot"></span>
	<span class="dot"></span>
</span>

<style>
	.loading-dots {
		display: inline-flex;
		align-items: center;
		height: 1em;
		visibility: hidden;
	}

	.visible {
		visibility: visible;
	}

	.dot {
		width: 0.1em;
		height: 0.1em;
		border-radius: 50%;
		background-color: currentColor;
		margin: 0 0.1em;
		animation: pulse 1.4s infinite ease-in-out;
	}

	.dot:nth-child(2) {
		animation-delay: 0.2s;
	}

	.dot:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes pulse {
		0%,
		80%,
		100% {
			transform: scale(0);
			opacity: 0;
		}
		40% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
