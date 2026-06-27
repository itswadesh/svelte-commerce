<script lang="ts">
  // Thin wrapper block for PRODUCT_BREADCRUMB
  import { page } from '$app/state'
  import Breadcrumb from '$lib/components/ui/breadcrumb.svelte'

  let { block = {} } = $props()
</script>

{#if page.data?.product?.categoryHierarchy}
  <div class="intra-pt page-width hidden md:block">
    <Breadcrumb categoryHierarchy={page.data.product.categoryHierarchy} />
  </div>
{/if}
