<script>
  import Nav from './../components/Nav.svelte'
  import Hero from './../components/Hero.svelte'
  import Banners from './../components/Banners.svelte'
  import FFBanner from './../components/FFBanner.svelte'
  import Deals from './../components/Deals.svelte'
  import Carousel from './../components/Carousel.svelte'
  import ProductSkeleton from './../components/ProductSkeleton.svelte'
  import { get, put, post } from './../lib/api'
  import { host } from './../config'
  import { goto } from '@sapper/app'
  let loading = false,
    latestProducts = [],
    HPProducts = [],
    DellProducts = [],
    LenovoProducts = [],
    asusProducts = [],
    I7Products = [],
    I5Products = [],
    I3Products = [],
    SSDProducts = [],
    R64GBProducts = [],
    R32GBProducts = [],
    R16GBProducts = [],
    R8GBProducts = []

  async function getLatest() {
    try {
      const p = await get('electronics')
      latestProducts = p.data
      return latestProducts
    } catch (e) {}
  }
  // getLatest();
  async function getHP() {
    try {
      const p = await get('electronics', { brandName: 'HP' })
      HPProducts = p.data
      return HPProducts
    } catch (e) {}
  }
  // getHP();
  async function getDell() {
    try {
      const p = await get('electronics', { brandName: 'Dell' })
      DellProducts = p.data
      return DellProducts
    } catch (e) {}
  }
  // getDell();
  async function getLenovo() {
    try {
      const p = await get('electronics', { brandName: 'Lenovo' })
      LenovoProducts = p.data
      return LenovoProducts
    } catch (e) {}
  }
  // getLenovo();
  async function getAsus() {
    try {
      const p = await get('electronics', { brandName: 'Asus' })
      asusProducts = p.data
      return asusProducts
    } catch (e) {}
  }
  // getAsus();
  async function getAcer() {
    try {
      const p = await get('electronics', { brandName: 'Acer' })
      AcerProducts = p.data
      return AcerProducts
    } catch (e) {}
  }
  // getAcer();
  async function getI7() {
    try {
      const p = await get('electronics/es', { 'Processor Name': 'Core i7' })
      I7Products = p.data
      return I7Products
    } catch (e) {}
  }
  // getI7();
  async function getI5() {
    try {
      const p = await get('electronics/es', { 'Processor Name': 'Core i5' })
      I5Products = p.data
      return I5Products
    } catch (e) {}
  }
  // getI5();
  async function getI3() {
    try {
      const p = await get('electronics/es', { 'Processor Name': 'Core i3' })
      I3Products = p.data
      return I3Products
    } catch (e) {}
  }
  // getI3();
  async function getSSD() {
    try {
      const p = await get('electronics/es', { SSD: 'Yes' })
      SSDProducts = p.data
      return SSDProducts
    } catch (e) {}
  }
  // getSSD();
  async function get64GB() {
    try {
      const p = await get('electronics/es', { RAM: '64 GB' })
      R64GBProducts = p.data
      return R64GBProducts
    } catch (e) {}
  }
  // get64GB();
  async function get32GB() {
    try {
      const p = await get('electronics/es', { RAM: '32 GB' })
      R32GBProducts = p.data
      return R32GBProducts
    } catch (e) {}
  }
  // get32GB();
  async function get16GB() {
    try {
      const p = await get('electronics/es', { RAM: '16 GB' })
      R16GBProducts = p.data
      return R16GBProducts
    } catch (e) {}
  }
  // get16GB();
  async function get8GB() {
    try {
      const p = await get('electronics/es', { RAM: '8 GB' })
      R8GBProducts = p.data
      return R8GBProducts
    } catch (e) {}
  }
  // get8GB();
</script>

<svelte:head>
  <title>Online store for electronics using Litekart ecommerce</title>
  <meta
    data-hid="description"
    name="description"
    content="Online electronics store using Litekart ecommerce platform.
    Features include search, filter, lazy load, infinite scrolling" />
  <meta data-hid="og:title" name="og_title" content="" />
  <meta
    data-hid="og:title"
    name="og_title"
    property="og:title"
    content="Online store for electronics using Litekart ecommerce" />
  <meta name="og_url" property="og:url" content={`${host}/search`} />
  <!-- Twitter -->
  <meta name="twitter:title" content="Hand picked laptops for you" />
  <meta
    name="twitter:description"
    content="Online electronics store using Litekart ecommerce platform.
    Features include search, filter, lazy load, infinite scrolling" />
  <link rel="canonical" href={`${host}`} />
  <link rel="alternate" hreflang="en" href={`${host}`} />
</svelte:head>
<Nav home={true} />
<div class="mt-20">
  <!-- <FFBanner /> -->
  <Hero />
  <Banners />
  {#await getHP()}
    <ProductSkeleton count={5} />
  {:then HPProducts}
    <Deals products={HPProducts} title="HP Laptops" />
  {/await}
  {#await getDell()}
    <ProductSkeleton count={5} />
  {:then DellProducts}
    <Deals products={DellProducts} title="Dell Laptops" />
  {/await}
  {#await getLenovo()}
    <ProductSkeleton count={5} />
  {:then LenovoProducts}
    <Deals products={LenovoProducts} title="Lenovo Laptops" />
  {/await}
  {#await getAsus()}
    <ProductSkeleton count={5} />
  {:then asusProducts}
    <Deals products={asusProducts} title="Asus Laptops" />
  {/await}
  <!-- {#await getAcer()}
    <ProductSkeleton count={5} />
  {:then AcerProducts}
    <Deals products={AcerProducts} title="Acer Laptops" />
  {/await}
  {#await getSSD()}
    <ProductSkeleton count={5} />
  {:then SSDProducts}
    <Deals products={SSDProducts} title="SSD Laptops" />
  {/await}
  {#await getI7()}
    <ProductSkeleton count={5} />
  {:then I7Products}
    <Deals products={I7Products} title="I7 Laptops" />
  {/await}
  {#await getI5()}
    <ProductSkeleton count={5} />
  {:then I5Products}
    <Deals products={I5Products} title="I5 Laptops" />
  {/await}
  {#await getI3()}
    <ProductSkeleton count={5} />
  {:then I3Products}
    <Deals products={I3Products} title="I3 Laptops" />
  {/await} -->
  {#await getLatest()}
    <ProductSkeleton count={5} />
  {:then latestProducts}
    <Deals products={latestProducts} title="Latest Laptops" />
  {/await}
  <!-- {#await get64GB()}
  <ProductSkeleton count={5} />
{:then R64GBProducts}
  <Deals products={R64GBProducts} title="64GB Laptops" />
{/await}
{#await get32GB()}
  <ProductSkeleton count={5} />
{:then R32GBProducts}
  <Deals products={R32GBProducts} title="32GB Laptops" />
{/await}
  {#await get16GB()}
    <ProductSkeleton count={5} />
  {:then R16GBProducts}
    <Deals products={R16GBProducts} title="16GB Laptops" />
  {/await}
  {#await get8GB()}
    <ProductSkeleton count={5} />
  {:then R8GBProducts}
    <Deals products={R8GBProducts} title="8GB Laptops" />
  {/await} -->
</div>
