<script>
  import { HOST } from "./../../config";
  import Header from "./../../components/Header.svelte";
  import Pagination from "./_Pagination.svelte";
  import Product from "./_Product.svelte";
  import ProductSkeleton from "./_ProductSkeleton.svelte";
  import DesktopFilters from "./_DesktopFilters.svelte";
  import MobileFilters from "./_MobileFilters.svelte";
  import HeaderBody from "./_HeaderBody.svelte";
  import NoProduct from "./_NoProduct.svelte";
  import Loading from "./../../components/ui/Loading.svelte";
  import { constructQry, constructURL2 } from "./../../lib";
  import { get, put, post } from "./../../lib/api";
  import { goto, stores } from "@sapper/app";
  import { sorts } from "./../../config";
  import { fadeIn, fadeOut } from "./../../actions/pageFade";
  const { preloading, page, session } = stores();
  let showMobileFilter = false,
    products = [],
    facets = [],
    category = {},
    productCount = 0,
    pageSize = 10,
    currentPage = 1,
    loading = false,
    query,
    searchQuery;
  page.subscribe(page => {
    console.log("page.subscribe");
    query = page.query;
    getData(query);
  });

  function changePage(e, p) {
    let fl = { ...query };
    delete fl.page;
    // delete fl.categories;
    const url = constructURL2("/search", fl);
    let page = parseInt(e.detail || 1);
    goto(`${url}page=${page}`);
  }
  async function getData(query) {
    try {
      loading = true;
      searchQuery = query.q;
      let url = constructQry("electronics/es", query);
      const p = await get(url);
      pageSize = p.data.length;
      productCount = p.count;
      products = p.data;
      facets = p.facets.all_aggs;
    } catch (e) {
    } finally {
      loading = false;
    }
  }
  function search(e) {
    query = {};
    query.q = e.detail;
    getData(query);
  }
  function toggle(e) {
    showMobileFilter = e.detail;
  }
</script>

<svelte:head>
  <title>{`Collection of handpicked laptops with ${query.q}`}</title>
  <meta
    data-hid="description"
    name="description"
    content={`Collection of handpicked laptops with ${query.q}`} />
  <meta
    data-hid="og:title"
    name="og_title"
    content={`Collection of handpicked laptops with ${query.q}`} />
  <meta
    data-hid="og:title"
    name="og_title"
    property="og:title"
    content={`Collection of handpicked laptops with ${query.q}`} />
  <meta name="og_url" property="og:url" content={`${HOST}/search`} />
  <!-- Twitter -->
  <meta
    name="twitter:title"
    content={`Collection of handpicked laptops with ${query.q}`} />
  <meta
    name="twitter:description"
    content="content={`Collection of handpicked laptops with ${query.q}`}" />
</svelte:head>

<main in:fadeIn out:fadeOut>
  <Header on:search={search} />
  {#if showMobileFilter}
    <MobileFilters {facets} on:hide={toggle} />
  {:else}
    <div class="flex">
      <DesktopFilters bind:facets bind:query />
      <div class="w-full">
        <HeaderBody
          {searchQuery}
          count={productCount}
          on:hide={() => (showMobileFilter = !showMobileFilter)} />
        {#if loading}
          <div class="flex flex-wrap">
            {#each { length: 15 } as _, i}
              <ProductSkeleton />
            {/each}
          </div>
        {:else if products.length == 0 && !loading}
          <NoProduct />
        {:else if products && products.length > 0}
          <div class="flex flex-wrap">
            {#each products as p}
              <Product product={p} />
            {/each}
          </div>
        {/if}
        {#if Math.ceil(productCount / pageSize) > 1}
          <Pagination
            count={Math.ceil(productCount / pageSize)}
            current={parseInt(query.page || 1)}
            on:change={changePage} />
        {/if}
      </div>
    </div>
  {/if}
</main>
