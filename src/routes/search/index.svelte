<script>
  import Pagination from "./_Pagination.svelte";
  // import Skeleton from "~/components/Skeleton";
  import Product from "./_Product.svelte";
  import LeftSideBar from "./_LeftSideBar.svelte";
  // import MobileFilters from "~/components/MobileFilters";
  // import HeaderBody from "~/components/HeaderBody";
  // import NoProduct from "~/components/NoProduct";
  import Loading from "./../../components/ui/Loading.svelte";
  import { constructURL } from "./../../lib";
  import { get, put, post } from "./../../lib/api";
  import { goto, stores } from "@sapper/app";
  import { sorts } from "./../../config";
  const { session, page } = stores();
  let showMobileFilter = false,
    fl = {
      brands: [],
      price: [],
      categories: [],
      colors: [],
      sizes: [],
      price: [1, 100],
      sort: null,
      features: { Type: [], Fit: [], Fabric: [], Neck: [], Color: [] },
      sorts
    },
    products = [],
    facets = [],
    category = {},
    productCount = 0,
    currentPage = 1,
    loading = false,
    query = {};
  page.subscribe(({ query }) => {
    query = query;
  });
  function created() {
    currentPage = parseInt(query.page);
  }
  function changePage(p) {
    let fl = { ...fl };
    delete fl.page;
    delete fl.categories;
    const url = constructURL("/", fl);
    let page = parseInt(p || 1);
    goto(`${url}page=${page}`);
  }
  function facetRemoved(f) {
    fl = f;
  }
  async function getData() {
    try {
      loading = true;
      const products = await get("/products/es", {
        params: { ...query }
      });
      productCount = products.count;
      products = products.data;
      facets = products.facets.all_aggs;
    } catch (e) {
    } finally {
      loading = false;
    }
  }
</script>

{JSON.stringify(query)}
{#if showMobileFilter}
  <!-- <MobileFilters
      class="flex-none max-w-xs"
      bind:facets="{facets}"
      bind:fl="{fl}"
      on:hide="{showMobileFilter=false}"
    /> -->
{:else}
  <div class="flex">
    <LeftSideBar
      class="flex-none max-w-xs hidden md:block"
      bind:facets
      bind:fl />
    <div class="w-full">
      <!-- <HeaderBody
          bind:count="{productCount}"
          bind:fl="{fl}"
          on:removed="{facetRemoved}"
          on:showFilters="{showMobileFilter=true}"
        /> -->
      <Pagination
        count={10}
        current={parseInt(query.page || 1)}
        on:change={changePage} />
    </div>
  </div>
{/if}
