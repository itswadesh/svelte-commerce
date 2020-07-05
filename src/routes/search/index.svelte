<script>
  import { host } from './../../config'
  import Nav from './../../components/Nav.svelte'
  import Pagination from './_Pagination.svelte'
  import Product from './_Product.svelte'
  import Product1 from './../../components/Product.svelte'
  import ProductSkeleton from './_ProductSkeleton.svelte'
  import DesktopFilters from './_DesktopFilters.svelte'
  import MobileFilters from './_MobileFilters.svelte'
  import HeaderBody from './_HeaderBody.svelte'
  import NoProduct from './_NoProduct.svelte'
  import Loading from './../../components/ui/Loading.svelte'
  import { constructQry, constructURL2 } from './../../lib'
  import { get, put, post } from './../../lib/api'
  import { goto, stores } from '@sapper/app'
  import { sorts } from './../../config'
  import { fadeIn, fadeOut } from './../../actions/pageFade'
  const { preloading, page, session } = stores()
  let showMobileFilter = false,
    products = [],
    facets = [],
    category = {},
    productCount = 0,
    pageSize = 10,
    currentPage = 1,
    loading = false,
    query,
    searchQuery
  $: noOfPages = Math.ceil(productCount / 24)
  page.subscribe(page => {
    query = page.query
    if (query.q == undefined) query.q = ''
    getData(query)
  })

  function changePage(e, p) {
    let fl = { ...query }
    delete fl.page
    const url = constructURL2('/search', fl)
    let page = parseInt(e.detail || 1)
    goto(`${url}page=${page}`)
    // scrollToTop();
  }
  // function scrollToTop() {
  //   window.scroll({
  //     behavior: "smooth",
  //     left: 0,
  //     top: 0
  //   });
  // }
  async function getData(query) {
    try {
      loading = true
      searchQuery = query.q
      let url = constructQry('electronics/es', query)
      const p = await get(url)
      pageSize = p.pageSize
      productCount = p.count
      products = p.data
      facets = p.facets.all_aggs
    } catch (e) {
    } finally {
      loading = false
    }
  }
  function search(e) {
    query = {}
    query.q = e.detail
    getData(query)
  }
  function toggle(e) {
    showMobileFilter = e.detail
  }
</script>

<svelte:head>
  <title>{`Top 20 ${query.q} laptops in India`}</title>
  <meta
    data-hid="description"
    name="description"
    content={`Best ${query.q} laptops in India`} />
  <meta
    data-hid="og:title"
    name="og_title"
    content={`Top 20 ${query.q} laptops in India`} />
  <meta
    data-hid="og:title"
    name="og_title"
    property="og:title"
    content={`Top 20 ${query.q} laptops in India`} />
  <meta name="og_url" property="og:url" content={`${host}/search`} />
  <!-- Twitter -->
  <meta name="twitter:title" content={`Top 20 ${query.q} laptops in India`} />
  <meta
    name="twitter:description"
    content="content={`Best ${query.q} laptops in India`}" />
</svelte:head>

<main in:fadeIn out:fadeOut>
  <Nav on:search={search} />
  {#if showMobileFilter}
    <MobileFilters {facets} on:hide={toggle} />
  {:else}
    <div class="flex pt-10">
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
          <div class="flex flex-wrap justify-center">
            {#each products as p}
              <Product1 product={p} />
            {/each}
          </div>
        {/if}
        <Pagination
          count={noOfPages}
          current={parseInt(query.page || 1)}
          on:change={changePage} />
      </div>
    </div>
  {/if}
</main>
