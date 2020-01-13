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
  <meta name="og_url" property="og:url" content={`${HOST}/search`} />
  <!-- Twitter -->
  <meta name="twitter:title" content="Hand picked laptops for you" />
  <meta
    name="twitter:description"
    content="Online electronics store using Litekart ecommerce platform.
    Features include search, filter, lazy load, infinite scrolling" />
  <link rel="canonical" href={`${HOST}`} />
  <link rel="alternate" hreflang="en" href={`${HOST}`} />
</svelte:head>
<Header home={true} />
<Hero />
<br />
{#await getLatest()}
  <ProductSkeleton count={5} />
{:then latestProducts}
  <Deals products={latestProducts} title="Latest Laptops" />
{/await}
<Banners />
{#await getAsus()}
  <ProductSkeleton count={5} />
{:then asusProducts}
  <Deals products={asusProducts} title="Asus Laptops" />
{/await}
