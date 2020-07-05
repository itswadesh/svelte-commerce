<script context="module">
  import { get } from './../lib/api'
  import { currency } from './../lib'
  import { host } from './../config'
  import Nav from './../components/Nav.svelte'
  import ProductImage from './details/_ProductImage.svelte'
  import Breadcrumb from './details/_Breadcrumb.svelte'
  import ProductDetails from './details/_ProductDetails.svelte'
  import { send, receive } from './../actions/crossfade'
  export async function preload({ params, query }) {
    let product = {},
      err = null
    try {
      product = await get(`electronics/${query.id}`)
      if (!product) return
      return { product }
    } catch (e) {
      product = {}
      this.error(500, e.toString())
    }
  }
</script>

<script>
  import { goto, stores } from '@sapper/app'
  const { session } = stores()
  import { onMount } from 'svelte'
  export let product
</script>

<svelte:head>
  <title>{product && product.name}</title>
  <meta
    data-hid="description"
    name="description"
    content={product && product.description} />
  <meta data-hid="og:title" name="og_title" content={product && product.name} />
  <meta
    data-hid="og:description"
    name="og_description"
    property="og:description"
    content={product && product.description} />
  <meta
    name="og_url"
    property="og:url"
    content={product && `${host}/${product.slug}?id=${product._id}`} />
  <meta
    name="og_image"
    property="og:image"
    content={product && product.img && product.img[0]} />
  <meta property="og:image:width" content="800" />
  <meta property="og:image:height" content="800" />
  <!-- Twitter -->
  <meta name="twitter:title" content={product && product.name} />
  <meta name="twitter:description" content={product && product.description} />
  <meta
    name="twitter:image:src"
    content={product && product.img && product.img[0]} />
  <!-- Google / Schema.org markup: -->
  <meta hid="product_name" itemprop="name" content={product && product.name} />
  <meta
    hid="product_description"
    itemprop="description"
    content={product && product.description} />
  <meta
    hid="product_image"
    itemprop="image"
    content={product && product.img && product.img[0]} />
  <meta
    hid="product_price"
    name="product_price"
    property="product:price"
    itemprop="image"
    content={product && product.localPrice} />
</svelte:head>
<Nav home={true} />
<main in:receive out:send class="mt-20">
  {#if !product}
    Requested product not found.
  {:else}
    <Breadcrumb {product} />
    <div class="flex flex-wrap justify-start">
      <ProductImage {product} />
      <ProductDetails {product} />
    </div>
  {/if}
</main>
