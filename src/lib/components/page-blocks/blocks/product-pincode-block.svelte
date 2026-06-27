<script lang="ts">
  import PincodeCheck from '$lib/components/product-catalogue/pincode-check.svelte'
  import { useProductState } from '$lib/core/composables/index.js'
  import { Truck } from '@lucide/svelte'
  let { block = {} } = $props()
  const productState = useProductState()
</script>

{#if productState.wareHousePluginEnabled && productState.isIndianPincodesPluginEnabled}
  <div class="intra-gap border-t intra-pt flex flex-col">
    <div class="intra-gap flex items-center justify-start">
      <Truck class="size-4 text-gray-900" />
      <span class="text-sm text-gray-900">Delivery Options</span>
    </div>
    <PincodeCheck />
  </div>
{/if}
