<script lang="ts">
  const { block } = $props()
  $inspect("block", block)
</script>

<div>
  {@html block.metadata.html}
</div>
