<script lang="ts">
  import ProductTitleSection from '../../../../routes/(www)/products/[slug]/components/product-title-section.svelte'
  import { page } from '$app/state'
  let { block = {} } = $props()
  const data = $derived(page.data)
</script>

<ProductTitleSection product={data?.product} />
