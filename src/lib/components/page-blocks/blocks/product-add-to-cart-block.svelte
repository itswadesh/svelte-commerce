<script lang="ts">
  import ProductCartAndWishlistButtons from '../../../../routes/(www)/products/[slug]/components/product-cart-and-wishlist-buttons.svelte'
  let { block = {} } = $props()
</script>

<div class="flex flex-col gap-2">
  <ProductCartAndWishlistButtons />
</div>
