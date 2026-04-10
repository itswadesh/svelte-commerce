<script lang="ts">
	const { block } = $props()
</script>

<div class="h-full flex justify-center items-center">
  <img src={block.metadata.url} class="object-contain h-full" alt="">
</div>
