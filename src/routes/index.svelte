<script>
  import Header from "./../components/Header.svelte";
  import Hero from "./../components/Hero.svelte";
  import Banners from "./../components/Banners.svelte";
  import Deals from "./../components/Deals.svelte";
  import ProductSkeleton from "./../components/ProductSkeleton.svelte";
  import { get, put, post } from "./../lib/api";
  import { HOST } from "./../config";
  import { goto } from "@sapper/app";
  let loading = false,
    latestProducts = [],
    asusProducts = [];
  async function getLatest() {
    try {
      const p = await get("electronics");
      latestProducts = p.data;
      return latestProducts;
    } catch (e) {}
  }
  getLatest();
  async function getAsus() {
    try {
      const p = await get("electronics", { params: { brandName: "asus" } });
      asusProducts = p.data;
      return asusProducts;
    } catch (e) {}
  }
  getAsus();
</script>

<svelte:head>
  <title>List of India's best laptops - Curated manually</title>
  <meta
    data-hid="description"
    name="description"
    content="Collection of handpicked electronic items, worth buying. These are
    best in quality, performance, feels good to use, ergonomic, stylish" />
  <meta
    data-hid="og:title"
    name="og_title"
    content="List of India's best laptops - Curated manually" />
  <meta
    data-hid="og:title"
    name="og_title"
    property="og:title"
    content="Collection of handpicked electronic items, worth buying" />
  <meta name="og_url" property="og:url" content={`${HOST}/search`} />
  <!-- Twitter -->
  <meta name="twitter:title" content="Hand picked laptops for you" />
  <meta
    name="twitter:description"
    content="Collection of handpicked electronic items, worth buying. These are
    best in quality, performance, feels good to use, ergonomic, stylish" />
</svelte:head>
<Header home={true} />
<Hero />
<br />
{#await getLatest()}
  <ProductSkeleton count={5} />
{:then latestProducts}
  <Deals products={latestProducts} />
{/await}
<Banners />
{#await getAsus()}
  <ProductSkeleton count={5} />
{:then asusProducts}
  <Deals products={asusProducts} />
{/await}
