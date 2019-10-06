<script context="module">
  import { get } from "./../lib/api";
  import { currency } from "./../lib";
  import { HOST } from "./../config";
  import Header from "./../components/Header.svelte";
  import ProductImage from "./details/ProductImage.svelte";
  import Breadcrumb from "./details/Breadcrumb.svelte";
  import ProductDetails from "./details/ProductDetails.svelte";

  export async function preload({ params, query }) {
    let product = {},
      selectedVariant = null,
      userSelectedVariant = null,
      err = null,
      structuredData = null;

    try {
      product = await get(`electronics/${query.id}`);
      if (!product) return;
      for (let v of product && product.variants) {
        // Auto select variant
        if (v.stock > 0) {
          selectedVariant = v;
          break;
        }
      }
      structuredData = {
        "@context": "http://schema.org/",
        "@type": "Product",
        name: product && product.name,
        description: product && product.description,
        sku: product && product.sku,
        image:
          HOST +
          (product && product.imgA && product.imgA[0] && product.imgA[0].medium)
      };
      return { product, selectedVariant, userSelectedVariant, structuredData };
    } catch (e) {
      product = {};
      selectedVariant = null;
      userSelectedVariant = null;
      this.error(500, e.toString());
    }
  }
</script>

<script>
  import { goto, stores } from "@sapper/app";
  const { session } = stores();
  import { onMount } from "svelte";
  export let product, selectedVariant, userSelectedVariant, structuredData;
  let showDetails = false,
    showAbout = false,
    myshowpin = false,
    shake = false,
    selectedImgIndex = 0;
  function clearRecentItems() {
    RecentlyViewedProducts = [];
  }
</script>

<style>
  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }
    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }
    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }
    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }
  ::-webkit-scrollbar {
    display: none;
  }
</style>

<svelte:head>
  <title>{product && product.name}</title>
  <meta
    data-hid="description"
    name="description"
    content={product && product.description} />
</svelte:head>
<Header />
{#if !product}
  Requested product not found.
{:else}
  <Breadcrumb {product} />
  <div class="flex flex-wrap justify-start">
    <ProductImage {product} />
    <ProductDetails {product} {selectedVariant} />
    <!-- <SimilarProducts :product="product" /> -->
  </div>
{/if}
