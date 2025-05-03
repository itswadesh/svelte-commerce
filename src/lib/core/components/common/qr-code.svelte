<script lang="ts">
	export let base64Data = '' // Your base64 data prop
	let canvas: HTMLCanvasElement
	let error: string | null = null

	const drawQRCode = () => {
		if (!base64Data) {
			error = 'No base64 data provided'
			return
		}
		if (!canvas) {
			error = 'Canvas not initialized'
			return
		}

		const ctx = canvas.getContext('2d')
		const img = new Image()

		img.src = base64Data

		img.onload = () => {
			canvas.width = img.width
			canvas.height = img.height
			ctx.drawImage(img, 0, 0)
			error = null // Clear error on success
		}

		img.onerror = function () {
			error = 'Failed to load QR code image from base64 data'
		}
	}

	// Reactively draw when base64Data or canvas changes
	$: if (base64Data && canvas) {
		drawQRCode()
	}
</script>

<div class="inline-block bg-white">
	{#if error}
		<!-- <img src={base64Data} alt="Image" class="min-w-[200px] min-h-[200px]" /> -->
		<p class="">{base64Data}</p>
	{:else}
		<canvas bind:this={canvas} class="image-pixelated min-h-[200px] min-w-[200px]"></canvas>
	{/if}
</div>
