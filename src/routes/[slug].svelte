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
      err = null,
      structuredData = {};
    try {
      product = await get(`electronics/${query.id}`);
      if (!product) return;
      structuredData = {
        "@context": "http://schema.org/",
        "@type": "Product",
        name: product && product.name,
        description: product && product.description,
        sku: product && product.sku,
        image: HOST + (product && product.imgUrls && product.imgUrls["400x400"])
      };
      return { product, structuredData };
    } catch (e) {
      product = {};
      this.error(500, e.toString());
    }
  }
</script>

<script>
  import { goto, stores } from "@sapper/app";
  const { session } = stores();
  import { onMount } from "svelte";
  export let product, structuredData;
</script>

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
    <ProductDetails {product} />
    <!-- <SimilarProducts :product="product" /> -->
  </div>
{/if}
