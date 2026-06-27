<script lang="ts">
  // Thin wrapper block for PRODUCT_GALLERY
  // Imports the route component using relative path (SvelteKit resolves these fine)
  import ProductGallerySection from '../../../../routes/(www)/products/[slug]/components/product-gallery-section.svelte'
  let { block = {} } = $props()
</script>

<ProductGallerySection />
