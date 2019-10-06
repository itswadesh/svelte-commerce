<script>
  import Header from "./../../components/Header.svelte";
  import Pagination from "./_Pagination.svelte";
  // import Skeleton from "~/components/Skeleton";
  import Product from "./_Product.svelte";
  import DesktopFilters from "./_DesktopFilters.svelte";
  import MobileFilters from "./_MobileFilters.svelte";
  import HeaderBody from "./../../components/HeaderBody.svelte";
  // import NoProduct from "~/components/NoProduct";
  import Loading from "./../../components/ui/Loading.svelte";
  import { constructQry, constructURL2 } from "./../../lib";
  import { get, put, post } from "./../../lib/api";
  import { goto, stores } from "@sapper/app";
  import { sorts } from "./../../config";
  const { session, page } = stores();
  let showMobileFilter = false,
    products = [],
    facets = [],
    category = {},
    productCount = 0,
    pageSize = 10,
    currentPage = 1,
    loading = false,
    query;
  page.subscribe(page => {
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
  <title>List of India's best laptops - Curated manually</title>
</svelte:head>
<Header on:search={search} />
{#if showMobileFilter}
  <MobileFilters {facets} on:hide={toggle} />
{:else}
  <Loading {loading} />
  <div class="flex">
    <DesktopFilters bind:facets bind:query />
    <div class="w-full">
      <HeaderBody
        count={productCount}
        on:hide={() => (showMobileFilter = !showMobileFilter)} />
      {#if products.length == 0 && !loading}
        <!-- <NoProduct /> -->
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
