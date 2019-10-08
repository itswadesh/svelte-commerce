<script>
  import Header from "./../components/Header.svelte";
  import Deals from "./../components/Deals.svelte";
  import Banner from "./../components/Banner.svelte";
  import { HOST } from "./../config";
  import { goto } from "@sapper/app";
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
<Banner />
<Deals />
