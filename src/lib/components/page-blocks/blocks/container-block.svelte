<script lang="ts">
	import Blocks from "../blocks.svelte"

  const { block } = $props()
</script>

<Blocks layouts={[block.metadata.layout]} />
